import { TTLCache } from './ttlCache';

// Bài 37 — High Performance: categories are read on every page load but change
// maybe once a month. Caching them for 10 minutes removes one DB round trip per request.
const CATEGORY_CACHE_TTL_MS = 10 * 60 * 1000;

export const CATEGORY_LIST_KEY = 'categories:all';

// `unknown[]` because the cache does not care about the shape — categoryService does.
export const categoryCache = new TTLCache<unknown[]>(CATEGORY_CACHE_TTL_MS);
