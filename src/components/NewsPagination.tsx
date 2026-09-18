import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NewsPaginationProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

/**
 * Page numbers to show: always the first and last, plus a window around the
 * current page, with gaps standing in for the rest. Keeps the control the same
 * width whether a category has three pages or fifty.
 */
export function pageWindow(page: number, pageCount: number, span = 1): (number | 'gap')[] {
  const wanted = new Set<number>([1, pageCount])
  for (let p = page - span; p <= page + span; p++) {
    if (p >= 1 && p <= pageCount) wanted.add(p)
  }
  // Keep the control a steady width near the ends.
  if (page <= span + 2) for (let p = 2; p <= Math.min(span + 3, pageCount); p++) wanted.add(p)
  if (page >= pageCount - span - 1) for (let p = Math.max(1, pageCount - span - 2); p < pageCount; p++) wanted.add(p)

  const pages = [...wanted].sort((a, b) => a - b)
  const withGaps: (number | 'gap')[] = []
  pages.forEach((p, i) => {
    if (i > 0 && p - (pages[i - 1] as number) > 1) withGaps.push('gap')
    withGaps.push(p)
  })
  return withGaps
}

const BUTTON = 'shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all'
const INACTIVE = 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'

/** Page controls under a category listing, styled like the filter tabs above it. */
export default function NewsPagination({ page, pageCount, onChange }: NewsPaginationProps): JSX.Element | null {
  if (pageCount <= 1) return null

  const step = (to: number) => () => onChange(Math.min(pageCount, Math.max(1, to)))

  return (
    <nav
      aria-label="News pages"
      className="mt-10 flex flex-col items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-6"
    >
      <div className="flex items-center gap-1 overflow-x-auto max-w-full scrollbar-none">
        <button
          onClick={step(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={`${BUTTON} ${INACTIVE} inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {pageWindow(page, pageCount).map((entry, i) =>
          entry === 'gap' ? (
            <span key={`gap-${i}`} className="px-1 text-slate-400 dark:text-slate-600 select-none">
              …
            </span>
          ) : (
            <button
              key={entry}
              onClick={step(entry)}
              aria-label={`Page ${entry}`}
              aria-current={entry === page ? 'page' : undefined}
              className={`${BUTTON} ${entry === page ? 'bg-[#3B82F6] text-white shadow' : INACTIVE}`}
            >
              {entry}
            </button>
          )
        )}

        <button
          onClick={step(page + 1)}
          disabled={page === pageCount}
          aria-label="Next page"
          className={`${BUTTON} ${INACTIVE} inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Page {page} of {pageCount}
      </p>
    </nav>
  )
}
