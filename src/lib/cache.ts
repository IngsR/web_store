// Simple high-performance in-memory cache for fast API reads without unnecessary DB load
interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

export function getFromCache<T>(key: string): T | null {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        memoryCache.delete(key);
        return null;
    }
    return entry.data as T;
}

export function setInCache<T>(key: string, data: T, ttlSeconds = 30): void {
    if (memoryCache.size > 200) {
        memoryCache.clear(); // Cegah memory leak
    }
    memoryCache.set(key, {
        data,
        expiresAt: Date.now() + ttlSeconds * 1000,
    });
}

export function clearCacheByPrefix(prefix: string): void {
    for (const key of memoryCache.keys()) {
        if (key.startsWith(prefix)) {
            memoryCache.delete(key);
        }
    }
}

export function clearAllCache(): void {
    memoryCache.clear();
}
