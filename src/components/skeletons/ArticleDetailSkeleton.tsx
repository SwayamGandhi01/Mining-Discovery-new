import React from 'react'
import { Skeleton, SkeletonRegion } from '../ui/Skeleton'

/** The "Continue Reading" grid in the article sidebar. */
export function RelatedArticlesSkeleton(): JSX.Element {
  return (
    <SkeletonRegion label="Loading related articles">
      <Skeleton className="mb-6 h-5 w-36" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>
            <Skeleton className="mb-3 aspect-video rounded-lg" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1.5 h-3 w-2/3" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  )
}

/** Mirrors ArticleDetail: breadcrumb bar, title block, hero image, body copy, sidebar. */
export default function ArticleDetailSkeleton(): JSX.Element {
  return (
    <SkeletonRegion label="Loading article" announce className="bg-white dark:bg-slate-950">
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex h-12 items-center gap-3">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 px-4 py-12">
        <div className="col-span-12 lg:col-span-8">
          <div className="mb-8">
            <div className="mb-4 space-y-3">
              <Skeleton className="h-9 lg:h-12 w-full" />
              <Skeleton className="h-9 lg:h-12 w-2/3" />
            </div>
            <div className="mb-6 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>

          <Skeleton className="mb-8 aspect-video rounded-lg" />

          <div className="mb-12 space-y-8">
            {[0, 1, 2].map((paragraph) => (
              <div key={paragraph} className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <Skeleton className="mb-8 h-11 w-full rounded-lg" />
          <RelatedArticlesSkeleton />
        </div>
      </div>
    </SkeletonRegion>
  )
}
