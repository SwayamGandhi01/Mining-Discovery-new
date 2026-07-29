import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import HTMLFlipBook from 'react-pageflip'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

type FlipbookViewerProps = {
  title: string
  subtitle?: string
  pdfUrl?: string | null
  coverImageUrl?: string | null
  description?: string
  onBack?: () => void
  onClose?: () => void
}

type PageSize = {
  width: number
  height: number
}

const getResponsivePageSize = (): PageSize => {
  if (typeof window === 'undefined') return { width: 280, height: 396 }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Mobile: small single page, Tablet: medium, Desktop: larger
  let baseWidth: number
  if (viewportWidth < 480) {
    baseWidth = Math.min(280, viewportWidth - 32)
  } else if (viewportWidth < 768) {
    baseWidth = Math.min(360, viewportWidth - 48)
  } else {
    baseWidth = Math.min(420, (viewportWidth - 60) / 2)
  }

  const availableHeight = Math.max(300, viewportHeight - 280)
  let height = Math.round(baseWidth * 1.414)

  if (height > availableHeight) {
    height = Math.max(300, Math.floor(availableHeight * 0.9))
    baseWidth = Math.max(180, Math.floor(height / 1.414))
  }

  return { width: Math.max(180, baseWidth), height }
}

const spreadLabel = (rawIdx: number, numPages: number): string => {
  if (numPages <= 0) return 'Loading pages...'
  if (rawIdx === 0) return `Cover · Page 1 of ${numPages}`
  const left = rawIdx + 1
  const right = rawIdx + 2
  if (right > numPages) return `Page ${left} of ${numPages}`
  return `Pages ${left}–${right} of ${numPages}`
}

const FlipBookComponent = HTMLFlipBook as any

export default function FlipbookViewer({
  title,
  subtitle,
  pdfUrl,
  coverImageUrl,
  description,
  onBack,
  onClose,
}: FlipbookViewerProps): JSX.Element {
  const bookRef = useRef<any>(null)
  const [numPages, setNumPages] = useState(0)
  const [rawIdx, setRawIdx] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [pageSize, setPageSize] = useState<PageSize>({ width: 420, height: 594 })
  const [visiblePageCount, setVisiblePageCount] = useState(2)
  const [loadProgress, setLoadProgress] = useState(0)

  const goNext = useCallback(() => {
    if (isMobile) {
      setCurrentPage((prev) => Math.min(numPages, prev + 1))
      return
    }

    bookRef.current?.pageFlip()?.flipNext()
  }, [isMobile, numPages])

  const goPrev = useCallback(() => {
    if (isMobile) {
      setCurrentPage((prev) => Math.max(1, prev - 1))
      return
    }

    bookRef.current?.pageFlip()?.flipPrev()
  }, [isMobile])

  useEffect(() => {
    const setFromViewport = () => {
      const viewportWidth = window.innerWidth
      setIsMobile(viewportWidth < 768)
      setPageSize(getResponsivePageSize())
    }

    setFromViewport()
    window.addEventListener('resize', setFromViewport)
    return () => window.removeEventListener('resize', setFromViewport)
  }, [])

  useEffect(() => {
    if (isMobile || numPages <= 2) return

    const timer = window.setTimeout(() => {
      setVisiblePageCount((prev) => Math.min(numPages, prev + 2))
    }, 120)

    return () => window.clearTimeout(timer)
  }, [isMobile, numPages, visiblePageCount])

  const isFirst = isMobile ? currentPage === 1 : rawIdx === 0
  const isLast = isMobile ? currentPage >= numPages : numPages > 0 && rawIdx >= numPages - 2
  const currentSpread = useMemo(() => {
    if (isMobile) {
      return numPages > 0 ? `Page ${currentPage} of ${numPages}` : 'Loading pages...'
    }

    return spreadLabel(rawIdx, numPages)
  }, [currentPage, isMobile, numPages, rawIdx])

  if (!pdfUrl) {
    return (
      <div className="min-h-[70vh] rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm">
        <div className="flex items-center gap-3 text-[#1E3B6E]">
          <BookOpen className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.25em]">Flipbook preview</span>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-900">No PDF is available for this article yet.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          This article does not currently have a downloadable PDF, so the book-style reader cannot be opened.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : null}
          </div>
          <div className="text-xs font-medium text-slate-500 sm:text-sm">{currentSpread}</div>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f8f8f7] p-2 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-4 lg:p-6">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm sm:gap-3 sm:px-4">
              <button
                type="button"
                onClick={goPrev}
                disabled={isFirst}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={isLast}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex w-full items-center justify-center overflow-x-auto px-1 sm:px-2">
              <Document
                file={pdfUrl}
                onLoadSuccess={(pdf) => {
                  setNumPages(pdf.numPages)
                  setVisiblePageCount(Math.min(2, pdf.numPages || 2))
                  setCurrentPage(1)
                  setRawIdx(0)
                  setLoadProgress(100)
                  setLoading(false)
                  setError(false)
                }}
                onLoadProgress={({ loaded, total }) => {
                  if (total) {
                    setLoadProgress(Math.round((loaded / total) * 100))
                  }
                }}
                onLoadError={() => {
                  setLoading(false)
                  setError(true)
                }}
                className="flex justify-center"
              >
                {loading ? (
                  <div className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white px-4 py-6 text-slate-600 shadow-inner sm:min-h-[420px] sm:px-6 sm:py-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <Loader2 className="h-5 w-5 animate-spin text-[#1E3B6E]" />
                      <span>Preparing the flipbook…</span>
                      {loadProgress > 0 ? <span className="text-sm text-slate-500">{loadProgress}% ready</span> : null}
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white px-4 py-6 text-center text-slate-600 shadow-inner sm:min-h-[420px] sm:px-6 sm:py-8">
                    <p>The article could not be loaded right now.</p>
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-center justify-center">
                    {isMobile ? (
                      <div className="flex w-full justify-center overflow-x-auto px-1 py-2 sm:px-2">
                        <div className="rounded-[1.25rem] border border-slate-200 bg-white p-2 shadow-sm">
                          <Page
                            pageNumber={currentPage}
                            width={typeof window !== 'undefined' ? Math.min(pageSize.width, window.innerWidth - 28) : pageSize.width}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            renderMode="canvas"
                          />
                        </div>
                      </div>
                    ) : (
                      <FlipBookComponent
                        ref={bookRef}
                        width={pageSize.width}
                        height={pageSize.height}
                        size="fixed"
                        usePortrait={false}
                        showCover={true}
                        drawShadow={true}
                        flippingTime={700}
                        mobileScrollSupport={false}
                        startZIndex={0}
                        onFlip={(event: { data: number }) => setRawIdx(event.data)}
                      >
                        {Array.from({ length: visiblePageCount }, (_, index) => (
                          <div
                            key={index}
                            className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm"
                            style={{ width: pageSize.width, height: pageSize.height }}
                          >
                            <Page
                              pageNumber={index + 1}
                              width={pageSize.width}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              renderMode="canvas"
                            />
                          </div>
                        ))}
                      </FlipBookComponent>
                    )}
                  </div>
                )}
              </Document>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
