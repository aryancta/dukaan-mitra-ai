import type { Product } from "./types";

const STOP = new Set([
  "aaj",
  "aur",
  "the",
  "sold",
  "bik",
  "gaye",
  "khatam",
  "ho",
  "gaya",
  "gayi",
  "hai",
  "mein",
  "ka",
  "ki",
  "ke",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F\s-]/gi, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function scoreProduct(query: string, product: Product): number {
  const q = query.toLowerCase();
  const tokens = tokenize(query);
  let score = 0;

  if (product.name.toLowerCase().includes(q)) score += 10;
  if (product.nameHi.toLowerCase().includes(q)) score += 12;
  if (product.aliases.some((a) => a === q || q.includes(a))) score += 15;

  const blob = [
    product.name,
    product.nameHi,
    ...product.aliases,
    product.embeddingText ?? "",
    product.category,
  ]
    .join(" ")
    .toLowerCase();

  for (const t of tokens) {
    if (blob.includes(t)) score += 4;
  }

  // Partial fuzzy: "dahi" in aliases
  for (const alias of product.aliases) {
    if (alias.includes(q) || q.includes(alias)) score += 8;
  }

  return score;
}

export interface SemanticMatch {
  product: Product;
  score: number;
  confidence: number;
}

export function semanticProductSearch(
  spoken: string,
  products: Product[],
  limit = 3
): SemanticMatch[] {
  const ranked = products
    .map((product) => {
      const score = scoreProduct(spoken, product);
      const confidence = Math.min(0.99, score / 20);
      return { product, score, confidence };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked;
}

export function bestSemanticMatch(
  spoken: string,
  products: Product[]
): SemanticMatch | undefined {
  const [best] = semanticProductSearch(spoken, products, 1);
  return best && best.score >= 4 ? best : undefined;
}
