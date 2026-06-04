import type { ApiKeys } from "./types";
import { API_KEYS_STORAGE } from "./types";

export function loadApiKeys(): ApiKeys {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(API_KEYS_STORAGE);
    if (!raw) return {};
    return JSON.parse(raw) as ApiKeys;
  } catch {
    return {};
  }
}

export function saveApiKeys(keys: ApiKeys): void {
  localStorage.setItem(API_KEYS_STORAGE, JSON.stringify(keys));
}

export function buildAuthHeaders(keys?: ApiKeys): HeadersInit {
  const k = keys ?? loadApiKeys();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (k.gemini) headers["x-user-gemini-key"] = k.gemini;
  if (k.mongodbUri) headers["x-user-mongodb-uri"] = k.mongodbUri;
  return headers;
}

export function keysFromRequest(req: Request): ApiKeys {
  return {
    gemini: req.headers.get("x-user-gemini-key") ?? undefined,
    mongodbUri: req.headers.get("x-user-mongodb-uri") ?? undefined,
  };
}
