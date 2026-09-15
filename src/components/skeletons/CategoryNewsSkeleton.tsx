import React from 'react'
import { Skeleton, SkeletonRegion } from '../ui/Skeleton'
import CardSkeleton from './CardSkeleton'

/**
 * Mirrors CategoryNews: hero banner, filter bar, featured story with its
 * three-story sidebar, then the "More Articles" grid.
 */
export default function CategoryNewsSkeleton(): JSX.Element {
  return (
    <SkeletonRegion label="Loading articles" announce className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950">
      {/* Hero banner — same chrome as the real one, placeholder text */}
      <div className="relative bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <Skeleton tone="inverse" className="h-4 w-28 mb-8" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <Skeleton tone="inverse" className="h-7 w-28 rounded-full mb-4" />
              <Skeleton tone="inverse" className="h-11 sm:h-14 md:h-[4.5rem] w-64 sm:w-96 max-w-full" />
            </div>
            <div className="flex items-center gap-6 shrink-0">
              {[0, 1].map((stat) => (
                <React.Fragment key={stat}>
                  {stat > 0 && <div className="w-px h-10 bg-slate-700" />}
                  <div className="flex flex-col items-center gap-1.5">
                    <Skeleton tone="inverse" className="h-8 w-12" />
                    <Skeleton tone="inverse" className="h-3 w-16" />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 py-3">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Featured */}
          <div className="lg:col-span-7">
            <Skeleton className="aspect-video rounded-2xl" />
            <div className="mt-5">
              <Skeleton className="h-3 w-40 mb-3" />
              <div className="space-y-2.5 mb-3">
                <Skeleton className="h-7 sm:h-8 w-full" />
                <Skeleton className="h-7 sm:h-8 w-3/4" />
              </div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {/* Sidebar stories */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
              >
                <Skeleton className="w-24 h-24 shrink-0 rounded-xl" />
                <div className="flex flex-1 min-w-0 flex-col justify-center gap-2">
                  <Skeleton className="h-2.5 w-14" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-7">
          <Skeleton className="h-6 w-40 shrink-0" />
          <div className="flex-1 h-px bg-gradient-to-r from-slate-300 dark:from-slate-700 to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }, (_, i) => (
            <CardSkeleton
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              mediaClassName="h-48 rounded-none"
              bodyClassName="p-5"
              meta
              titleLineClassName="h-4"
            />
          ))}
        </div>
      </div>
    </SkeletonRegion>
  )
}
