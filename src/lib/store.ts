import {
  SEED_PRODUCTS,
  SEED_SALES,
  STORE_NAME,
  STORE_OWNER,
} from "./seed-data";
import type {
  McpToolLog,
  Product,
  ReorderDraft,
  SaleRecord,
} from "./types";

export interface StoreState {
  storeName: string;
  ownerName: string;
  products: Product[];
  sales: SaleRecord[];
  mcpLogs: McpToolLog[];
  pendingReorder?: ReorderDraft;
  confirmedReorders: ReorderDraft[];
}

declare global {
  // eslint-disable-next-line no-var
  var __dukaanStore: StoreState | undefined;
}

function createStore(): StoreState {
  return {
    storeName: STORE_NAME,
    ownerName: STORE_OWNER,
    products: SEED_PRODUCTS.map((p) => ({ ...p })),
    sales: [...SEED_SALES],
    mcpLogs: [],
    confirmedReorders: [],
  };
}

export function getStore(): StoreState {
  if (!global.__dukaanStore) {
    global.__dukaanStore = createStore();
  }
  return global.__dukaanStore;
}

export function resetStore(): StoreState {
  global.__dukaanStore = createStore();
  return global.__dukaanStore;
}

export function appendMcpLog(log: Omit<McpToolLog, "timestamp">): McpToolLog {
  const entry: McpToolLog = {
    ...log,
    timestamp: new Date().toISOString(),
  };
  const store = getStore();
  store.mcpLogs = [entry, ...store.mcpLogs].slice(0, 50);
  return entry;
}
