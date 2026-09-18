/**
 * Runs `task` once the browser has painted and the main thread is next idle.
 *
 * The home page asks the CMS for a dozen sections at once. Every one of those
 * responses competes for the same connection as the cover story and its image,
 * which is what the page's LCP waits on — so the sections below the first
 * screen start their requests through here instead of during the first render.
 * They are below the fold and already show skeletons, so nothing on screen
 * waits on them.
 *
 * Every path to `task` is capped by a timer, because neither
 * requestAnimationFrame (paused in a background tab) nor requestIdleCallback
 * (starved by a busy main thread) is guaranteed to fire on its own. A section
 * can therefore be delayed, but never left loading forever.
 *
 * Returns a cancel function for the effect's cleanup.
 */
export function whenIdle(task: () => void): () => void {
  let finished = false
  const run = () => {
    if (finished) return
    finished = true
    task()
  }

  let idleId: number | undefined
  const schedule = () => {
    if (finished) return
    const idle = window.requestIdleCallback
    if (idle) idleId = idle(run, { timeout: 500 })
    else run()
  }

  // Two frames: the first render has been painted by the time the second runs.
  const frame = window.requestAnimationFrame(() => window.requestAnimationFrame(schedule))
  // Backstop for a tab that never paints, so the request still goes out.
  const fallback = window.setTimeout(run, 300)

  return () => {
    finished = true
    window.cancelAnimationFrame(frame)
    window.clearTimeout(fallback)
    if (idleId !== undefined && window.cancelIdleCallback) window.cancelIdleCallback(idleId)
  }
}
