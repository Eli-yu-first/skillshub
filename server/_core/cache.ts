/**
 * Universal Cache Manager (In-Memory with Redis-ready API)
 * Provides a standardized way to cache expensive database queries and API responses.
 * Can be easily swapped with 'ioredis' or other distributed caches in the future.
 */

type CacheItem<T> = {
  data: T;
  expiresAt: number;
};

class CacheManager {
  private store: Map<string, CacheItem<any>>;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.store = new Map();
    
    // Periodically clean up expired entries (every 10 minutes)
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const keysToDelete: string[] = [];
      
      Array.from(this.store.entries()).forEach(([key, item]) => {
        if (item.expiresAt < now) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach(key => this.store.delete(key));
    }, 10 * 60 * 1000);
  }

  /**
   * Get an item from cache
   * @param key Unique identifier for the cached data
   * @returns The cached data or null if not found/expired
   */
  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Set an item in the cache
   * @param key Unique identifier
   * @param value Data to cache
   * @param ttlSeconds Time-to-live in seconds (default: 5 minutes)
   */
  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    this.store.set(key, {
      data: value,
      expiresAt: Date.now() + (ttlSeconds * 1000)
    });
  }

  /**
   * Immediately clear a specific cache key
   */
  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  /**
   * Clear all cached data
   */
  async clear(): Promise<void> {
    this.store.clear();
  }

  /**
   * Destroy the cache manager (useful for graceful shutdowns)
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Export a singleton instance
export const cache = new CacheManager();
