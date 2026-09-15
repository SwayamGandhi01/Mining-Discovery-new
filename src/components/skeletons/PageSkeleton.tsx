import React from 'react'
import { Skeleton, SkeletonRegion } from '../ui/Skeleton'
import CardSkeleton from './CardSkeleton'

/**
 * Generic Suspense fallback for lazily-loaded routes without a skeleton of
 * their own. Nearly all of them open with a dark hero band above content
 * sections, so that is the shape it sketches. A full screen of height keeps the
 * footer below the fold, so it doesn't jump when the page itself arrives.
 */
export default function PageSkeleton(): JSX.Element {
  return (
    <SkeletonRegion label="Loading page" announce className="min-h-screen">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-4">
          <Skeleton tone="inverse" className="h-3 w-28" />
          <Skeleton tone="inverse" className="h-9 sm:h-12 w-72 max-w-full" />
          <Skeleton tone="inverse" className="h-4 w-[36rem] max-w-full" />
          <Skeleton tone="inverse" className="h-4 w-[28rem] max-w-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }, (_, i) => (
          <CardSkeleton
            key={i}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
            mediaClassName="h-40 rounded-xl mb-4"
            textLines={3}
          />
        ))}
      </div>
    </SkeletonRegion>
  )
}
