import { NextResponse } from "next/server";
import { mcpListProducts, type McpContext } from "@/lib/mcp/client";
import { getStore, resetStore } from "@/lib/store";
import { keysFromRequest } from "@/lib/api-headers";

export async function GET(req: Request) {
  const keys = keysFromRequest(req);
  const ctx: McpContext = {
    mode: keys.mongodbUri ? "live" : "demo",
    mongodbUri: keys.mongodbUri,
  };

  try {
    const products = await mcpListProducts(ctx);
    const store = getStore();
    return NextResponse.json({
      mode: ctx.mode,
      storeName: store.storeName,
      ownerName: store.ownerName,
      products: ctx.mode === "demo" ? store.products : products,
      sales: store.sales.slice(0, 20),
      mcpLogs: store.mcpLogs.slice(0, 15),
      pendingReorder: store.pendingReorder,
      confirmedReorders: store.confirmedReorders,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Inventory fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body?.action === "reset") {
    resetStore();
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
