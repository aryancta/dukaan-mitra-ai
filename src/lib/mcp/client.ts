import type { Product, SaleRecord } from "../types";
import {
  mcpFindProducts,
  mcpInsertSales,
  mcpUpdateStock,
  mcpVectorSearch,
  ensureSeed,
} from "./mongodb-live";
import {
  mcpMockFind,
  mcpMockInsertSales,
  mcpMockUpdateStock,
  mcpMockVectorSearch,
} from "./mock-mcp";

export interface McpContext {
  mode: "live" | "demo";
  mongodbUri?: string;
}

export async function mcpResolveProduct(
  ctx: McpContext,
  spoken: string,
  products: Product[]
): Promise<{
  product: Product;
  confidence: number;
  resolvedVia: "vector_search" | "exact" | "alias";
} | undefined> {
  if (ctx.mode === "live" && ctx.mongodbUri) {
    await ensureSeed(ctx.mongodbUri, products);
    const hit = await mcpVectorSearch(ctx.mongodbUri, spoken, products);
    if (!hit) return undefined;
    return {
      product: hit.product,
      confidence: hit.confidence,
      resolvedVia: hit.via === "vector_search" ? "vector_search" : "alias",
    };
  }

  const hit = await mcpMockVectorSearch(spoken);
  if (!hit) return undefined;
  return {
    product: hit.product,
    confidence: hit.confidence,
    resolvedVia: hit.via === "vector_search" ? "vector_search" : "alias",
  };
}

export async function mcpWriteStock(
  ctx: McpContext,
  productId: string,
  newStock: number
): Promise<void> {
  if (ctx.mode === "live" && ctx.mongodbUri) {
    await mcpUpdateStock(ctx.mongodbUri, productId, newStock);
    return;
  }
  await mcpMockUpdateStock(productId, newStock);
}

export async function mcpWriteSales(
  ctx: McpContext,
  sales: Omit<SaleRecord, "_id">[]
): Promise<void> {
  if (ctx.mode === "live" && ctx.mongodbUri) {
    await mcpInsertSales(ctx.mongodbUri, sales);
    return;
  }
  await mcpMockInsertSales(sales);
}

export async function mcpListProducts(ctx: McpContext): Promise<Product[]> {
  if (ctx.mode === "live" && ctx.mongodbUri) {
    return mcpFindProducts(ctx.mongodbUri);
  }
  return mcpMockFind();
}
