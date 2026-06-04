import { MongoClient, type Db } from "mongodb";
import { bestSemanticMatch } from "../semantic-search";
import type { Product, SaleRecord } from "../types";
import { MCP_TOOLS } from "./tool-names";

const DB_NAME = "dukaan_mitra";
const PRODUCTS = "products";
const SALES = "sales";

let client: MongoClient | null = null;

async function getDb(uri: string): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(DB_NAME);
}

export async function ensureSeed(uri: string, products: Product[]): Promise<void> {
  const db = await getDb(uri);
  const count = await db.collection(PRODUCTS).countDocuments();
  if (count === 0) {
    await db.collection(PRODUCTS).insertMany(
      products as unknown as Record<string, unknown>[]
    );
  }
}

export async function mcpFindProducts(
  uri: string,
  filter: Record<string, unknown> = {}
): Promise<Product[]> {
  const db = await getDb(uri);
  const docs = await db.collection(PRODUCTS).find(filter).toArray();
  return docs as unknown as Product[];
}

export async function mcpVectorSearch(
  uri: string,
  spoken: string,
  productsFallback: Product[]
): Promise<{ product: Product; confidence: number; via: "vector_search" | "semantic_fallback" } | undefined> {
  const db = await getDb(uri);
  try {
    const pipeline = [
      {
        $vectorSearch: {
          index: "product_vector_index",
          path: "embedding",
          queryVector: await embedQueryPlaceholder(),
          numCandidates: 20,
          limit: 1,
        },
      },
      { $project: { name: 1, sku: 1, stock: 1, aliases: 1, nameHi: 1, category: 1, unit: 1, reorderLevel: 1, costPrice: 1, sellPrice: 1, score: { $meta: "vectorSearchScore" } } },
    ];
    const [hit] = await db.collection(PRODUCTS).aggregate(pipeline).toArray();
    if (hit) {
      return {
        product: { ...hit, _id: String(hit._id) } as Product,
        confidence: (hit as { score?: number }).score ?? 0.85,
        via: "vector_search",
      };
    }
  } catch {
    // M0 may lack vector index: fall back to semantic scoring (same as MCP demo path)
  }

  const match = bestSemanticMatch(spoken, productsFallback);
  if (!match) return undefined;
  return {
    product: match.product,
    confidence: match.confidence,
    via: "semantic_fallback",
  };
}

async function embedQueryPlaceholder(): Promise<number[]> {
  // Atlas autoEmbed handles inserts; query embedding typically comes from Voyage via MCP.
  // Return empty to trigger catch and semantic fallback on M0 demos.
  return [];
}

export async function mcpUpdateStock(
  uri: string,
  productId: string,
  newStock: number
): Promise<void> {
  const db = await getDb(uri);
  const { ObjectId } = await import("mongodb");
  const filter = productId.startsWith("prod_")
    ? { sku: productId.replace("prod_", "").toUpperCase() }
    : { _id: new ObjectId(productId) };
  await db.collection(PRODUCTS).updateOne(filter, { $set: { stock: newStock, updatedAt: new Date() } });
}

export async function mcpInsertSales(
  uri: string,
  sales: Omit<SaleRecord, "_id">[]
): Promise<void> {
  const db = await getDb(uri);
  if (sales.length) {
    await db.collection(SALES).insertMany(
      sales.map((s) => ({ ...s, createdAt: new Date() }))
    );
  }
}

export function summarizeMcpCall(
  tool: string,
  args: Record<string, unknown>,
  resultSummary: string
) {
  return { tool, args, resultSummary };
}

export { MCP_TOOLS };
