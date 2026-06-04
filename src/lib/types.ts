export interface Product {
  _id: string;
  sku: string;
  name: string;
  nameHi: string;
  aliases: string[];
  category: string;
  unit: string;
  stock: number;
  reorderLevel: number;
  costPrice: number;
  sellPrice: number;
  embeddingText?: string;
}

export interface SaleRecord {
  _id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  spokenName: string;
  resolvedVia: "vector_search" | "exact" | "alias";
  timestamp: string;
}

export interface StockUpdate {
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  reason: "sale" | "out_of_stock" | "restock";
}

export interface FestivalForecast {
  festival: string;
  daysUntil: number;
  message: string;
  items: { productName: string; suggestedExtra: number; reason: string }[];
}

export interface ReorderLine {
  productId: string;
  productName: string;
  currentStock: number;
  suggestedQty: number;
  unit: string;
}

export interface ReorderDraft {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  lines: ReorderLine[];
  supplierMessage: string;
  createdAt: string;
}

export interface McpToolLog {
  tool: string;
  args: Record<string, unknown>;
  resultSummary: string;
  timestamp: string;
}

export interface AgentPlanStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "awaiting_confirm";
  detail?: string;
}

export interface AgentProcessResult {
  mode: "live" | "demo";
  transcript: string;
  parsedItems: {
    spoken: string;
    action: "sold" | "out_of_stock" | "restock";
    quantity?: number;
    matchedProduct?: Product;
    confidence?: number;
  }[];
  stockUpdates: StockUpdate[];
  sales: SaleRecord[];
  mcpLogs: McpToolLog[];
  plan: AgentPlanStep[];
  forecast?: FestivalForecast;
  reorderDraft?: ReorderDraft;
  assistantReply: string;
}

export interface ApiKeys {
  gemini?: string;
  mongodbUri?: string;
}

export const API_KEYS_STORAGE = "dukaanmitra_api_keys";
