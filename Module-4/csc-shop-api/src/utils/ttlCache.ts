// Bài 37 — High Performance: a tiny in-memory TTL cache.
//
// Why not Redis? For a single-instance app the cheapest win is to stop hitting Postgres
// for data that barely changes (categories). Keep it in the process, expire it by time.
// Trade-off to be aware of: the cache is per-process, so with >1 instance each one has
// its own copy — acceptable for read-mostly data with a short TTL.
export class TTLCache<T> {
  private store = new Map<string, { value: T; expiresAt: number }>();

  constructor(private ttlMs: number) {}

  get(key: string): T | undefined {
    const hit = this.store.get(key);
    if (!hit) return undefined;

    // Lazy expiration: we only check the clock when the key is read.
    if (Date.now() > hit.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return hit.value;
  }

  set(key: string, value: T): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  // Called after every write (create/update/delete) so clients never read stale data.
  invalidate(key?: string): void {
    if (key) this.store.delete(key);
    else this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}
