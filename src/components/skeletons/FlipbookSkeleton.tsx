import React from 'react'
import { Skeleton, SkeletonRegion } from '../ui/Skeleton'
import { getReaderStageHeight } from '../../utils/flipbookLayout'

/**
 * Stand-in for FlipbookViewer while a flipbook's record (and, on a first
 * visit, the viewer's code) loads. It mirrors the viewer's shell and its
 * download card — the next thing to appear — so the hand-off doesn't shift.
 */
export default function FlipbookSkeleton({ label = 'Opening flipbook' }: { label?: string }): JSX.Element {
  return (
    <SkeletonRegion label={label} announce className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
        <div className="mb-3 flex items-center justify-between gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>

        <div className="flex flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f8f8f7] p-2 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-4 lg:p-6">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="mb-4 flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm sm:gap-3 sm:px-4">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>

            <div className="flex w-full items-center justify-center px-1 sm:px-2">
              <div
                className="flex min-h-[320px] w-full max-w-md flex-col items-center justify-center gap-5 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-6 shadow-inner sm:min-h-[420px] sm:px-6 sm:py-8"
                style={{ minHeight: getReaderStageHeight() }}
              >
                <Skeleton className="h-48 w-36 rounded-lg sm:h-56 sm:w-40" />
                <div className="flex w-full max-w-xs flex-col items-center">
                  <Skeleton className="h-4 w-48 max-w-full" />
                  <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
                  <Skeleton className="mt-2 h-3 w-36" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonRegion>
  )
}
