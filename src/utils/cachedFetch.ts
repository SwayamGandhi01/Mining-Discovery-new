/**
 * Stale-While-Revalidate caching layer for API requests.
 *
 * Strategy:
 *   1. On first call, check localStorage for cached data.
 *   2. If cache exists AND is not expired → return it immediately (no loading state).
 *   3. Always fetch fresh data in the background, update cache, and call onUpdate.
 *   4. If cache is missing, await the network request and return.
 *
 * Cache TTL defaults to 10 minutes. Data updates silently in background.
 */

const DEFAULT_TTL_MS = 10 * 60 * 1000 // 10 minutes

interface CacheEntry<T> {
  data: T
  timestamp: number
}

function getCacheKey(url: string): string {
  return `swr_cache_${url}`
}

function readCache<T>(url: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(getCacheKey(url))
    if (!raw) return null
    return JSON.parse(raw) as CacheEntry<T>
  } catch {
    return null
  }
}

function writeCache<T>(url: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() }
    localStorage.setItem(getCacheKey(url), JSON.stringify(entry))
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

/**
 * Fetch JSON from a URL with stale-while-revalidate caching.
 *
 * @param url       The API URL to fetch
 * @param options   Optional: { ttl, onUpdate }
 *   - ttl: cache TTL in ms (default 10 min)
 *   - onUpdate: callback when fresh data arrives (for background updates)
 *
 * @returns The parsed JSON data (from cache if available, otherwise from network)
 */
export async function cachedFetch<T = any>(
  url: string,
  options?: {
    ttl?: number
    onUpdate?: (data: T) => void
  }
): Promise<T> {
  const ttl = options?.ttl ?? DEFAULT_TTL_MS
  const cached = readCache<T>(url)

  const fetchFresh = async (): Promise<T> => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    writeCache(url, data)
    return data
  }

  // Cache hit
  if (cached) {
    const age = Date.now() - cached.timestamp

    if (age < ttl) {
      // Cache is fresh — return immediately, but still revalidate in background
      fetchFresh()
        .then((freshData) => {
          // Only call onUpdate if the data actually changed
          if (options?.onUpdate && JSON.stringify(freshData) !== JSON.stringify(cached.data)) {
            options.onUpdate(freshData)
          }
        })
        .catch(() => {
          // Background revalidation failed — stale data is fine
        })

      return cached.data
    }

    // Cache is stale but exists — return stale data immediately, fetch in background
    fetchFresh()
      .then((freshData) => {
        if (options?.onUpdate) {
          options.onUpdate(freshData)
        }
      })
      .catch(() => { })

    return cached.data
  }

  // No cache — must await network
  const data = await fetchFresh()
  return data
}

/**
 * Clear all SWR cache entries from localStorage.
 */
export function clearSWRCache(): void {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('swr_cache_')) {
      keys.push(key)
    }
  }
  keys.forEach((k) => localStorage.removeItem(k))
}

/**
 * Clear a specific cache entry.
 */
export function invalidateCache(url: string): void {
  localStorage.removeItem(getCacheKey(url))
}
