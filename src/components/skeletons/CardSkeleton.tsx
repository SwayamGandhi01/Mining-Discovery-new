import React from 'react'
import { Skeleton } from '../ui/Skeleton'

interface CardSkeletonProps {
  /** Card shell: copy the real card's border, radius, padding and background. */
  className?: string
  /** Size and spacing of the image block, e.g. `aspect-video rounded-xl mb-4`. Omit for cards without one. */
  mediaClassName?: string
  /** Wrapper for everything below the image — the padding of cards whose image is flush. */
  bodyClassName?: string
  align?: 'left' | 'center'
  /** Short line above the title (date / category). */
  meta?: boolean
  titleLines?: number
  /** Height of each title line; match it to the real title's line height. */
  titleLineClassName?: string
  /** Short line below the title (designation / date). */
  subtitle?: boolean
  textLines?: number
  textLineClassName?: string
  /** Bottom row with two short items (date, read time…). */
  footer?: boolean
  footerClassName?: string
  /** Number of buttons in the action row. */
  actions?: number
  actionsClassName?: string
  actionClassName?: string
}

/**
 * Placeholder for the site's content cards — news, announcements, magazines,
 * profiles. Those cards differ in shape far more than in structure (image,
 * title, text, optional meta / footer / buttons), so one configurable skeleton
 * covers them all; each caller passes the real card's shell and sizes so the
 * placeholder takes up the same space as the card that replaces it.
 */
export default function CardSkeleton({
  className = '',
  mediaClassName,
  bodyClassName = '',
  align = 'left',
  meta = false,
  titleLines = 2,
  titleLineClassName = 'h-5',
  subtitle = false,
  textLines = 2,
  textLineClassName = 'h-3.5',
  footer = false,
  footerClassName = 'mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800',
  actions = 0,
  actionsClassName = 'mt-5 flex gap-2.5',
  actionClassName = 'h-10 flex-1 rounded-xl',
}: CardSkeletonProps): JSX.Element {
  const stack = align === 'center' ? 'flex flex-col items-center' : ''

  return (
    <div aria-hidden="true" className={className}>
      {mediaClassName && <Skeleton className={mediaClassName} />}

      <div className={bodyClassName}>
        {meta && (
          <div className={stack}>
            <Skeleton className="mb-3 h-3 w-24" />
          </div>
        )}

        <div className={`space-y-2 ${stack}`}>
          {Array.from({ length: titleLines }, (_, i) => (
            <Skeleton
              key={i}
              className={`${titleLineClassName} ${i < titleLines - 1 ? 'w-full' : titleLines > 1 ? 'w-3/4' : 'w-2/3'}`}
            />
          ))}
        </div>

        {subtitle && (
          <div className={stack}>
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        )}

        {textLines > 0 && (
          <div className={`mt-3 space-y-2 ${stack}`}>
            {Array.from({ length: textLines }, (_, i) => (
              <Skeleton key={i} className={`${textLineClassName} ${i < textLines - 1 ? 'w-full' : 'w-2/3'}`} />
            ))}
          </div>
        )}

        {footer && (
          <div className={footerClassName}>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        )}

        {actions > 0 && (
          <div className={actionsClassName}>
            {Array.from({ length: actions }, (_, i) => (
              <Skeleton key={i} className={actionClassName} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
