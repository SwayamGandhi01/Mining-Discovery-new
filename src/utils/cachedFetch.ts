/**
 * Cached GET requests to the CMS.
 *
 * Lookup order: memory → localStorage → network.
 *
 *   fresh    younger than `ttl`             served from cache — no request at all
 *   stale    past `ttl`, within `staleFor`  served from cache at once and refreshed
 *                                           in the background; `onUpdate` receives
 *                                           the new data if it actually changed
 *   expired  (or not cached)                fetched; if that fails, an expired copy
 *                                           is still served rather than an error
 *
 * Concurrent calls for the same URL share one network request, so components
 * that show the same data can each ask for it without doubling traffic.
 *
 * localStorage keeps a bounded copy (oldest entries evicted past a size budget,
 * expired ones swept on startup) so reloads render instantly. `persist: false`
 * keeps an entry in memory only — used for search. Storage being full or
 * unavailable only ever means less caching; it never breaks a page.
 */

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

/** Freshness classes. src/api/cms.ts assigns one to every endpoint. */
export const TTL = {
  news: 2 * MINUTE,
  related: 5 * MINUTE,
  search: 5 * MINUTE,
  article: 20 * MINUTE,
  semiStatic: 3 * HOUR,
  static: 12 * HOUR,
} as const

// How long past its TTL an entry may still be shown while it refreshes.
const DEFAULT_STALE_FOR = 24 * HOUR

const STORAGE_PREFIX = 'cms_cache_v2:'
// The previous cache format, which grew without limit.
const LEGACY_PREFIX = 'swr_cache_'
// Budgets in UTF-16 characters (~2 bytes each), well inside browsers' ~5 MB quota.
const STORAGE_BUDGET = 1_500_000
const MAX_STORED_ENTRY = 250_000
const MAX_MEMORY_ENTRIES = 200

interface CacheEntry<T = unknown> {
  timestamp: number
  ttl: number
  staleFor: number
  hash: string
  data: T
}

interface FetchResult {
  data: unknown
  hash: string
}

export interface CachedFetchOptions<T> {
  ttl?: number
  staleFor?: number
  /** Keep a copy in localStorage (default true). */
  persist?: boolean
  onUpdate?: (data: T) => void
}

/** A non-2xx response. `status` lets callers tell "not found" from "failed". */
export class CmsRequestError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const memory = new Map<string, CacheEntry>()
const inFlight = new Map<string, Promise<FetchResult>>()

// FNV-1a fingerprint of a response body, to tell whether a refresh changed anything.
function hashText(text: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return `${(hash >>> 0).toString(36)}:${text.length}`
}

function remember(url: string, entry: CacheEntry): void {
  memory.delete(url) // re-insert so Map order tracks recency
  memory.set(url, entry)
  if (memory.size > MAX_MEMORY_ENTRIES) {
    const oldest = memory.keys().next().value
    if (oldest !== undefined) memory.delete(oldest)
  }
}

// ---------------------------------------------------------------------------
// localStorage
// ---------------------------------------------------------------------------

function getStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

const storageKey = (url: string) => STORAGE_PREFIX + url

// Metadata is written ahead of the body so sweeps can read an entry's age
// without parsing the whole response.
const HEADER = /^\{"timestamp":(\d+),"ttl":(\d+),"staleFor":(\d+)/

function serialize(entry: CacheEntry, bodyText: string): string {
  return `{"timestamp":${entry.timestamp},"ttl":${entry.ttl},"staleFor":${entry.staleFor},"hash":${JSON.stringify(entry.hash)},"data":${bodyText}}`
}

function keysWithPrefix(store: Storage, prefix: string): string[] {
  const keys: string[] = []
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i)
    if (key?.startsWith(prefix)) keys.push(key)
  }
  return keys
}

let swept = false

// Once per page load: drop expired entries and the old unbounded cache.
function sweep(store: Storage): void {
  if (swept) return
  swept = true
  try {
    keysWithPrefix(store, LEGACY_PREFIX).forEach((key) => store.removeItem(key))
    const now = Date.now()
    for (const key of keysWithPrefix(store, STORAGE_PREFIX)) {
      const header = HEADER.exec(store.getItem(key) || '')
      if (!header || now > Number(header[1]) + Number(header[2]) + Number(header[3])) store.removeItem(key)
    }
  } catch {
    // Storage unavailable — nothing to clean.
  }
}

// Evict the oldest entries until `incoming` more characters fit in the budget.
function makeRoom(store: Storage, replacingKey: string, incoming: number): void {
  const entries = keysWithPrefix(store, STORAGE_PREFIX)
    .filter((key) => key !== replacingKey)
    .map((key) => {
      const value = store.getItem(key) || ''
      return { key, size: key.length + value.length, timestamp: Number(HEADER.exec(value)?.[1] ?? 0) }
    })
    .sort((a, b) => a.timestamp - b.timestamp)

  let used = entries.reduce((sum, entry) => sum + entry.size, 0)
  for (const entry of entries) {
    if (used + incoming <= STORAGE_BUDGET) break
    store.removeItem(entry.key)
    used -= entry.size
  }
}

function readStored<T>(url: string): CacheEntry<T> | null {
  const store = getStorage()
  if (!store) return null
  sweep(store)
  try {
    const raw = store.getItem(storageKey(url))
    return raw ? (JSON.parse(raw) as CacheEntry<T>) : null
  } catch {
    return null
  }
}

function writeStored(url: string, entry: CacheEntry, bodyText: string): void {
  const store = getStorage()
  if (!store) return
  const key = storageKey(url)
  const value = serialize(entry, bodyText)

  try {
    if (value.length + key.length > MAX_STORED_ENTRY) {
      // Too big to be worth persisting; it still lives in memory.
      store.removeItem(key)
      return
    }
    makeRoom(store, key, value.length + key.length)
    store.setItem(key, value)
  } catch {
    // Quota reached anyway (other data on this origin): clear our entries and retry once.
    try {
      makeRoom(store, key, STORAGE_BUDGET)
      store.setItem(key, value)
    } catch {
      // Give up on persisting this one; memory still has it.
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function lookup<T>(url: string, persist: boolean): CacheEntry<T> | null {
  const inMemory = memory.get(url) as CacheEntry<T> | undefined
  if (inMemory) return inMemory
  if (!persist) return null
  const stored = readStored<T>(url)
  if (stored) remember(url, stored)
  return stored
}

function fetchNetwork(url: string, ttl: number, staleFor: number, persist: boolean): Promise<FetchResult> {
  const pending = inFlight.get(url)
  if (pending) return pending

  const request = (async (): Promise<FetchResult> => {
    const res = await fetch(url)
    if (!res.ok) throw new CmsRequestError(res.status, `API error: ${res.status} ${res.statusText}`)
    const text = await res.text()
    const entry: CacheEntry = { timestamp: Date.now(), ttl, staleFor, hash: hashText(text), data: JSON.parse(text) }
    remember(url, entry)
    if (persist) writeStored(url, entry, text)
    return { data: entry.data, hash: entry.hash }
  })()

  inFlight.set(url, request)
  const settle = () => inFlight.delete(url)
  request.then(settle, settle)
  return request
}

/**
 * Fetch JSON from `url` through the cache (see the notes at the top of this file).
 */
export async function cachedFetch<T = any>(url: string, options: CachedFetchOptions<T> = {}): Promise<T> {
  const { ttl = TTL.news, staleFor = DEFAULT_STALE_FOR, persist = true, onUpdate } = options
  const cached = lookup<T>(url, persist)

  if (cached) {
    const age = Date.now() - cached.timestamp
    if (age < ttl) return cached.data

    if (age < ttl + staleFor) {
      fetchNetwork(url, ttl, staleFor, persist)
        .then((fresh) => {
          if (fresh.hash !== cached.hash) onUpdate?.(fresh.data as T)
        })
        .catch(() => {
          // The refresh failed; the stale copy is still on screen.
        })
      return cached.data
    }
  }

  try {
    return (await fetchNetwork(url, ttl, staleFor, persist)).data as T
  } catch (error) {
    if (cached) return cached.data
    throw error
  }
}

/**
 * Whatever usable (fresh or stale) copy of `url` is cached, without touching the
 * network — e.g. to find one record inside a list another page already loaded.
 */
export function peekCache<T = any>(url: string): T | undefined {
  const cached = lookup<T>(url, true)
  if (!cached) return undefined
  return Date.now() - cached.timestamp < cached.ttl + cached.staleFor ? cached.data : undefined
}

/** Clear every cached CMS response. */
export function clearSWRCache(): void {
  memory.clear()
  const store = getStorage()
  if (!store) return
  try {
    keysWithPrefix(store, STORAGE_PREFIX).forEach((key) => store.removeItem(key))
  } catch {
    // Storage unavailable.
  }
}

/** Clear one cached response. */
export function invalidateCache(url: string): void {
  memory.delete(url)
  try {
    getStorage()?.removeItem(storageKey(url))
  } catch {
    // Storage unavailable.
  }
}
