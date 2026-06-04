/** MongoDB MCP tool names used by Dukaan Mitra (Atlas Vector Search + CRUD). */
export const MCP_TOOLS = {
  FIND_PRODUCTS: "find",
  INSERT_SALES: "insertMany",
  UPDATE_STOCK: "updateOne",
  VECTOR_SEARCH: "aggregate",
  LIST_COLLECTIONS: "listCollections",
} as const;

export type McpToolName = (typeof MCP_TOOLS)[keyof typeof MCP_TOOLS];
