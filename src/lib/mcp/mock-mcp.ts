import { appendMcpLog, getStore } from "../store";
import { bestSemanticMatch } from "../semantic-search";
import type { Product, SaleRecord } from "../types";
import { MCP_TOOLS } from "./tool-names";

export async function mcpMockFind(filter?: Partial<Product>): Promise<Product[]> {
  const store = getStore();
  appendMcpLog({
    tool: MCP_TOOLS.FIND_PRODUCTS,
    args: { collection: "products", filter: filter ?? {} },
    resultSummary: `${store.products.length} products`,
  });
  let list = [...store.products];
  if (filter?.category) {
    list = list.filter((p) => p.category === filter.category);
  }
  return list;
}

export async function mcpMockVectorSearch(spoken: string): Promise<{
  product: Product;
  confidence: number;
  via: "vector_search" | "alias" | "exact";
} | undefined> {
  const store = getStore();
  const match = bestSemanticMatch(spoken, store.products);
  appendMcpLog({
    tool: MCP_TOOLS.VECTOR_SEARCH,
    args: {
      collection: "products",
      pipeline: "$vectorSearch",
      query: spoken,
      index: "product_vector_index",
    },
    resultSummary: match
      ? `Matched ${match.product.name} (${Math.round(match.confidence * 100)}%)`
      : "No match",
  });
  if (!match) return undefined;
  const via =
    match.product.aliases.some((a) => spoken.toLowerCase().includes(a)) ||
    match.product.nameHi.toLowerCase() === spoken.toLowerCase()
      ? "alias"
      : "vector_search";
  return { product: match.product, confidence: match.confidence, via };
}

export async function mcpMockUpdateStock(
  productId: string,
  newStock: number
): Promise<Product | undefined> {
  const store = getStore();
  const idx = store.products.findIndex((p) => p._id === productId);
  if (idx < 0) return undefined;
  const prev = store.products[idx].stock;
  store.products[idx] = { ...store.products[idx], stock: newStock };
  appendMcpLog({
    tool: MCP_TOOLS.UPDATE_STOCK,
    args: { collection: "products", filter: { _id: productId }, update: { stock: newStock } },
    resultSummary: `${store.products[idx].name}: ${prev} -> ${newStock}`,
  });
  return store.products[idx];
}

export async function mcpMockInsertSales(
  sales: Omit<SaleRecord, "_id">[]
): Promise<void> {
  const store = getStore();
  for (const s of sales) {
    store.sales.unshift({
      ...s,
      _id: `sale_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    });
  }
  appendMcpLog({
    tool: MCP_TOOLS.INSERT_SALES,
    args: { collection: "sales", documents: sales.length },
    resultSummary: `Inserted ${sales.length} sale(s)`,
  });
}
