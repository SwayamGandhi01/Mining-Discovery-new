import React, { useEffect, useState } from 'react'
import { cms, pickImage, CMS_URL, resolveMediaUrl } from '../api/cms'
import FlipbookViewer from '../components/FlipbookViewer'
import FlipbookSkeleton from '../components/skeletons/FlipbookSkeleton'

const BASE_URL = CMS_URL

type NewsletterItem = {
  id: number
  title?: string
  publishedAt?: string
  coverImage?: any
  pdfFile?: { url?: string; name?: string }
  Description?: string
  description?: string
}

type NewsletterFlipbookProps = {
  newsletterId: string
  onBack: () => void
}

const getCoverImageUrl = (item: NewsletterItem): string | null => {
  // The download card shows the cover ~170px wide.
  const url = pickImage(item.coverImage, 300)?.url
  if (!url) return null
  return resolveMediaUrl(url)
}

const getPdfUrl = (item: NewsletterItem): string | null => {
  const candidate = item.pdfFile?.url
  if (!candidate) return null
  return resolveMediaUrl(candidate)
}

const findNewsletter = (json: any, newsletterId: string): NewsletterItem | null => {
  const rawItem = (json?.data || []).find((item: any) => String(item.id) === String(newsletterId))
  if (!rawItem) return null
  return {
    id: rawItem.id,
    title: rawItem.title,
    publishedAt: rawItem.publishedAt,
    coverImage: rawItem.coverImage,
    pdfFile: rawItem.pdfFile,
    Description: rawItem.Description,
    description: rawItem.description,
  }
}

export default function NewsletterFlipbook({ newsletterId, onBack }: NewsletterFlipbookProps): JSX.Element {
  const [item, setItem] = useState<NewsletterItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchNewsletter = async () => {
      // Opened from the Newsletters section, the newsletter is already in the
      // cached list; otherwise fetch just this one.
      const listed = findNewsletter(cms.newsletters.peek(), newsletterId)
      if (listed) {
        setItem(listed)
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await cms.newsletter(newsletterId).fetch((fresh: any) => {
          if (!mounted) return
          const found = findNewsletter(fresh, newsletterId)
          if (found) setItem(found)
        })
        if (!mounted) return

        const found = findNewsletter(data, newsletterId)
        if (!found) {
          setError('Newsletter not found.')
          return
        }

        setItem(found)
      } catch (err: any) {
        if (!mounted) return
        setError('Unable to load newsletter at the moment.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchNewsletter()
    return () => {
      mounted = false
    }
  }, [newsletterId])

  if (loading) return <FlipbookSkeleton label="Opening newsletter" />

  if (error || !item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center text-slate-700">
        <div className="max-w-md rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-xl font-semibold text-slate-900">Unable to open newsletter</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">{error || 'The newsletter could not be found.'}</p>
          <button
            onClick={onBack}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1E3B6E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
          >
            Back to newsletters
          </button>
        </div>
      </div>
    )
  }

  return (
    <FlipbookViewer
      title={item.title || 'Newsletter'}
      subtitle={item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : undefined}
      pdfUrl={getPdfUrl(item)}
      coverImageUrl={getCoverImageUrl(item)}
      description={item.Description || item.description || undefined}
      onBack={onBack}
    />
  )
}
