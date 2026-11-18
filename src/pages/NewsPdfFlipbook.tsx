import React, { useEffect, useState } from 'react'
import { cms, pickImage, CMS_URL, resolveMediaUrl } from '../api/cms'
import { CmsRequestError } from '../utils/cachedFetch'
import FlipbookViewer from '../components/FlipbookViewer'
import FlipbookSkeleton from '../components/skeletons/FlipbookSkeleton'

const BASE_URL = CMS_URL

type NewsPdf = {
  title?: string
  publishedAt?: string
  pdf?: any
  image?: any
}

type NewsPdfFlipbookProps = {
  documentId: string
  onBack: () => void
}

const absoluteUrl = (url?: string | null): string | null => {
  if (!url) return null
  return resolveMediaUrl(url)
}

// Same shapes CategoryNews accepts: one file, a list of files, or a plain URL.
const getPdfUrl = (pdf: any): string | null =>
  absoluteUrl(typeof pdf === 'string' ? pdf : Array.isArray(pdf) ? pdf[0]?.url : pdf?.url)

/**
 * Flipbook reader for news stories published as PDFs — the Research Reports
 * category — matching how magazines, newsletters and company profiles open.
 */
export default function NewsPdfFlipbook({ documentId, onBack }: NewsPdfFlipbookProps): JSX.Element {
  const [report, setReport] = useState<NewsPdf | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchReport = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await cms.newsPdf(documentId).fetch((fresh: any) => {
          if (mounted && fresh?.data) setReport(fresh.data)
        })
        if (!mounted) return
        if (data?.data) setReport(data.data)
        else setError('Report not found.')
      } catch (err) {
        if (!mounted) return
        setError(
          err instanceof CmsRequestError && err.status === 404
            ? 'Report not found.'
            : 'Unable to load this report at the moment.'
        )
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchReport()
    return () => {
      mounted = false
    }
  }, [documentId])

  if (loading) return <FlipbookSkeleton label="Opening report" />

  if (error || !report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center text-slate-700">
        <div className="max-w-md rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-xl font-semibold text-slate-900">Unable to open report</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">{error || 'The report could not be found.'}</p>
          <button
            onClick={onBack}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1E3B6E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
          >
            Back to news
          </button>
        </div>
      </div>
    )
  }

  const pdfUrl = getPdfUrl(report.pdf)

  return (
    <FlipbookViewer
      title={report.title || 'Research Report'}
      subtitle={report.publishedAt ? new Date(report.publishedAt).toLocaleDateString() : undefined}
      pdfUrl={pdfUrl}
      // The download card shows the cover ~170px wide.
      coverImageUrl={absoluteUrl(pickImage(report.image, 300)?.url)}
      // Opening the PDF itself stays one click away, as it was before the reader.
      downloadUrl={pdfUrl}
      onBack={onBack}
    />
  )
}
