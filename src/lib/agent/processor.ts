import { getUpcomingFestivalForecast } from "./forecast";
import { parseWithGemini } from "./gemini";
import { parseUtteranceFallback, type ParsedUtteranceItem } from "./parse-fallback";
import {
  mcpListProducts,
  mcpResolveProduct,
  mcpWriteSales,
  mcpWriteStock,
  type McpContext,
} from "../mcp/client";
import { getStore } from "../store";
import type {
  AgentPlanStep,
  AgentProcessResult,
  ReorderDraft,
  ReorderLine,
  SaleRecord,
  StockUpdate,
} from "../types";

function buildReorderDraft(
  lines: ReorderLine[],
  forecastName: string
): ReorderDraft {
  const msgLines = lines.map(
    (l) => `- ${l.productName}: ${l.suggestedQty} ${l.unit} (abhi stock ${l.currentStock})`
  );
  return {
    id: `reorder_${Date.now()}`,
    status: "pending",
    lines,
    supplierMessage: `Namaste,\n\nNavratri / ${forecastName} ke liye reorder:\n${msgLines.join("\n")}\n\nPlease confirm delivery date.\n\n- Sharma Kirana`,
    createdAt: new Date().toISOString(),
  };
}

export async function processShopkeeperUtterance(
  transcript: string,
  options: { geminiKey?: string; mongodbUri?: string }
): Promise<AgentProcessResult> {
  const ctx: McpContext = {
    mode: options.mongodbUri ? "live" : "demo",
    mongodbUri: options.mongodbUri,
  };

  const plan: AgentPlanStep[] = [
    { id: "1", label: "Parse voice (Hindi / Hinglish)", status: "running" },
    { id: "2", label: "Resolve SKUs via MongoDB vector search", status: "pending" },
    { id: "3", label: "Write sales and stock (MCP)", status: "pending" },
    { id: "4", label: "Forecast festival demand", status: "pending" },
    { id: "5", label: "Draft supplier reorder", status: "pending" },
  ];

  let parsed: ParsedUtteranceItem[] = [];
  try {
    if (options.geminiKey) {
      parsed = await parseWithGemini(transcript, options.geminiKey);
    } else {
      parsed = parseUtteranceFallback(transcript);
    }
    plan[0].status = "done";
    plan[0].detail = `${parsed.length} item(s) understood`;
  } catch {
    parsed = parseUtteranceFallback(transcript);
    plan[0].status = "done";
    plan[0].detail = "Used offline parser (add Gemini key for live NLU)";
  }

  plan[1].status = "running";
  const store = getStore();
  let products = store.products;
  if (ctx.mode === "live") {
    products = await mcpListProducts(ctx);
  }

  const stockUpdates: StockUpdate[] = [];
  const sales: SaleRecord[] = [];
  const parsedItems: AgentProcessResult["parsedItems"] = [];

  plan[1].status = "done";
  plan[2].status = "running";

  for (const item of parsed) {
    const resolved = await mcpResolveProduct(ctx, item.spoken, products);
    if (!resolved) {
      parsedItems.push({
        spoken: item.spoken,
        action: item.action,
        quantity: item.quantity,
      });
      continue;
    }

    const { product, confidence, resolvedVia } = resolved;
    const idx = products.findIndex((p) => p._id === product._id);
    const current = idx >= 0 ? products[idx] : product;
    let newStock = current.stock;

    if (item.action === "sold" && item.quantity) {
      newStock = Math.max(0, current.stock - item.quantity);
      const sale: Omit<SaleRecord, "_id"> = {
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        unit: product.unit,
        spokenName: item.spoken,
        resolvedVia,
        timestamp: new Date().toISOString(),
      };
      await mcpWriteSales(ctx, [sale]);
      sales.push({ ...sale, _id: `sale_${Date.now()}` });
    } else if (item.action === "out_of_stock") {
      newStock = 0;
    }

    if (newStock !== current.stock) {
      await mcpWriteStock(ctx, product._id, newStock);
      stockUpdates.push({
        productId: product._id,
        productName: product.name,
        previousStock: current.stock,
        newStock,
        reason: item.action === "out_of_stock" ? "out_of_stock" : "sale",
      });
      if (idx >= 0) products[idx] = { ...products[idx], stock: newStock };
      else if (ctx.mode === "demo") {
        const si = store.products.findIndex((p) => p._id === product._id);
        if (si >= 0) store.products[si].stock = newStock;
      }
    }

    parsedItems.push({
      spoken: item.spoken,
      action: item.action,
      quantity: item.quantity,
      matchedProduct: { ...product, stock: newStock },
      confidence,
    });
  }

  plan[2].status = "done";
  plan[3].status = "running";
  const forecast = getUpcomingFestivalForecast(
    ctx.mode === "demo" ? getStore().products : products
  );
  plan[3].status = "done";
  plan[3].detail = forecast?.festival;

  plan[4].status = "running";
  const lowStock = (ctx.mode === "demo" ? getStore().products : products).filter(
    (p) => p.stock <= p.reorderLevel
  );

  const reorderLines: ReorderLine[] = lowStock.map((p) => {
    const extra =
      forecast?.items.find((i) => i.productName === p.name)?.suggestedExtra ?? 0;
    return {
      productId: p._id,
      productName: p.name,
      currentStock: p.stock,
      suggestedQty: Math.max(p.reorderLevel * 2 - p.stock, 6) + extra,
      unit: p.unit,
    };
  });

  let reorderDraft: ReorderDraft | undefined;
  if (reorderLines.length > 0) {
    reorderDraft = buildReorderDraft(
      reorderLines,
      forecast?.festival ?? "seasonal"
    );
    getStore().pendingReorder = reorderDraft;
    plan[4].status = "awaiting_confirm";
    plan[4].detail = `${reorderLines.length} SKU(s) - tap Confirm order`;
  } else {
    plan[4].status = "done";
  }

  const mcpLogs = getStore().mcpLogs.slice(0, 8);
  const replyParts: string[] = [];
  if (parsedItems.length) {
    replyParts.push(
      `Updated ${stockUpdates.length} item(s). ${parsedItems.map((p) => p.matchedProduct?.nameHi ?? p.spoken).join(", ")}.`
    );
  }
  if (forecast) {
    replyParts.push(
      `${forecast.festival} in ${forecast.daysUntil} days: consider extra dairy and staples.`
    );
  }
  if (reorderDraft) {
    replyParts.push("Reorder draft ready. Please confirm before sending.");
  }

  return {
    mode: ctx.mode,
    transcript,
    parsedItems,
    stockUpdates,
    sales,
    mcpLogs,
    plan,
    forecast,
    reorderDraft,
    assistantReply: replyParts.join(" ") || "Suniye, kya update karna hai?",
  };
}

export function confirmPendingReorder(): ReorderDraft | undefined {
  const store = getStore();
  if (!store.pendingReorder || store.pendingReorder.status !== "pending") {
    return undefined;
  }
  const confirmed = { ...store.pendingReorder, status: "confirmed" as const };
  store.confirmedReorders.unshift(confirmed);
  store.pendingReorder = undefined;
  return confirmed;
}
