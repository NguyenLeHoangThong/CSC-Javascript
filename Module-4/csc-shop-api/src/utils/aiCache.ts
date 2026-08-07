import { TTLCache } from './ttlCache';

// Bài 35 — AI for Backend: cache Gemini answers.
//
// Two reasons this matters more than a normal cache:
//   1. Money — every call is billed / counts against the daily free quota.
//   2. Latency — a Gemini round trip is ~1-3s, a cache hit is ~0ms.
// 10 minutes is long enough to absorb "everyone searches the same thing" traffic,
// short enough that a newly added product shows up soon.
const AI_CACHE_TTL_MS = 10 * 60 * 1000;

const cache = new TTLCache<string>(AI_CACHE_TTL_MS);

// Normalize so "  Laptop GAMING " and "laptop gaming" share one cache entry.
export function cacheKey(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getCached(query: string): string | undefined {
  return cache.get(cacheKey(query));
}

export function setCached(query: string, value: string): void {
  cache.set(cacheKey(query), value);
}

// Exported for tests — each test starts from an empty cache.
export function clearCache(): void {
  cache.invalidate();
}
