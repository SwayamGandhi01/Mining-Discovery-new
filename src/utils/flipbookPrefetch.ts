/**
 * Warm-up helpers for the flipbook reader.
 *
 * Opening a flipbook has three serial costs before the first page can paint:
 *   1. the lazily-loaded viewer chunk (react-pdf + react-pageflip, ~510 kB)
 *   2. the pdf.js worker at /pdf.worker.min.mjs (~1 MB)
 *   3. the PDF itself — company profile PDFs run 10–22 MB
 *
 * None of that can start until the user clicks. These helpers move the work
 * earlier, to the moment the user shows intent (hovering or touching a card),
 * so by the time they click the bytes are already in the HTTP cache.
 *
 * Everything here is best-effort: failures are swallowed, because a failed
 * warm-up must never be worse than not warming up at all.
 */

const warmedUrls = new Set<string>()
let runtimeWarmed = false

/**
 * Skip prefetching when the user has asked us not to burn their data, or when
 * the connection is slow enough that a speculative 20 MB download would hurt
 * more than help.
 */
function prefetchAllowed(): boolean {
  if (typeof navigator === 'undefined') return false

  const connection = (navigator as any).connection
  if (!connection) return true

  if (connection.saveData) return false

  const effectiveType: string = connection.effectiveType || ''
  return !(effectiveType.includes('2g') || effectiveType === 'slow-2g')
}

/**
 * Pull down the viewer chunk and the pdf.js worker. Shared by every flipbook,
 * so this is a one-time cost per session and always worth paying early.
 */
export function warmFlipbookRuntime(): void {
  if (runtimeWarmed || !prefetchAllowed()) return
  runtimeWarmed = true

  // Same chunk App.tsx lazy-loads for the flipbook route.
  import('../pages/CompanyProfileFlipbook').catch(() => {
    runtimeWarmed = false
  })

  fetch('/pdf.worker.min.mjs', { credentials: 'omit' }).catch(() => {
    // Worker will be fetched on demand instead.
  })
}

/**
 * Pull the PDF into the browser's HTTP cache.
 *
 * The response carries `cache-control: max-age=3600`, so when react-pdf later
 * requests the same URL the browser serves it from cache rather than
 * re-downloading it. We deliberately do not hold the bytes in memory — these
 * files are large and the HTTP cache is the right place for them.
 */
export function prefetchPdf(url?: string | null): void {
  if (!url || warmedUrls.has(url) || !prefetchAllowed()) return
  warmedUrls.add(url)

  fetch(url, { credentials: 'omit', mode: 'cors' })
    .then((res) => (res.ok ? res.arrayBuffer() : null))
    .catch(() => {
      // Let the viewer fetch it normally; allow a later retry.
      warmedUrls.delete(url)
    })
}
