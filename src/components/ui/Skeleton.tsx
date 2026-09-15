import React, { useEffect, useState } from 'react'

/**
 * Skeleton loading primitives.
 *
 * `Skeleton` draws one placeholder block. `SkeletonRegion` wraps a group of
 * them and owns the loading semantics:
 *
 *   - It stays invisible for its first 200ms (`.skeleton-reveal` in index.css)
 *     while still taking up its full size. Most requests here resolve inside
 *     that window — cachedFetch serves repeat visits from localStorage — so the
 *     real content replaces an invisible placeholder instead of flashing a
 *     skeleton, and slower requests still get one without any layout shift.
 *   - It carries the screen-reader label; the blocks themselves are aria-hidden.
 */

export type SkeletonTone = 'default' | 'muted' | 'inverse'

const TONE_CLASSES: Record<SkeletonTone, string> = {
  default: 'bg-slate-200 dark:bg-slate-800',
  // Tinted light surfaces, e.g. the blue breaking-news strip.
  muted: 'bg-slate-900/10',
  // Dark surfaces, e.g. hero bands and the dark "latest issue" card.
  inverse: 'bg-white/10',
}

interface SkeletonProps {
  className?: string
  tone?: SkeletonTone
  style?: React.CSSProperties
}

export function Skeleton({ className = '', tone = 'default', style }: SkeletonProps): JSX.Element {
  // Only fall back to the default radius when the caller hasn't picked one,
  // so the two classes never compete.
  const radius = /(^|\s)rounded/.test(className) ? '' : 'rounded'

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`motion-safe:animate-pulse ${radius} ${TONE_CLASSES[tone]} ${className}`}
    />
  )
}

const REVEAL_DELAY_MS = 200
const HANDOFF_WINDOW_MS = 100

// When a visible skeleton region last left the screen.
let lastVisibleAt = -Infinity

interface SkeletonRegionProps {
  /** What is loading, for screen readers — e.g. "Loading articles". */
  label: string
  /**
   * Announce the label through a polite live region. Reserve this for
   * page-level loading, so a page full of loading sections doesn't produce a
   * burst of announcements.
   */
  announce?: boolean
  className?: string
  children: React.ReactNode
}

export function SkeletonRegion({
  label,
  announce = false,
  className = '',
  children,
}: SkeletonRegionProps): JSX.Element {
  // When one skeleton directly replaces another — a route's Suspense fallback
  // giving way to the page's own data skeleton — hiding the new one for
  // another 200ms would make the placeholder blink, so it shows straight away.
  const [immediate] = useState(() => performance.now() - lastVisibleAt < HANDOFF_WINDOW_MS)

  useEffect(() => {
    const mountedAt = performance.now()
    return () => {
      const now = performance.now()
      if (immediate || now - mountedAt >= REVEAL_DELAY_MS) lastVisibleAt = now
    }
  }, [immediate])

  return (
    <div
      data-skeleton=""
      role={announce ? 'status' : undefined}
      aria-busy={announce ? undefined : true}
      className={`${immediate ? '' : 'skeleton-reveal'} ${className}`}
    >
      {children}
      {/* Last, so it never picks up `space-y-*` / `last:` styles meant for the blocks. */}
      <span className="sr-only">{label}</span>
    </div>
  )
}
