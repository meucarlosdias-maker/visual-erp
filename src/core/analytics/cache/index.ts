interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class AnalyticsCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private defaultTtl = 5 * 60 * 1000;

  set<T>(key: string, data: T, ttl?: number): void {
    this.store.set(key, { data, timestamp: Date.now(), ttl: ttl ?? this.defaultTtl });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidateByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return { size: this.store.size, keys: Array.from(this.store.keys()) };
  }
}

export const analyticsCache = new AnalyticsCache();
