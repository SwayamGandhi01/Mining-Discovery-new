import React, { useEffect, useState } from 'react'
import { cachedFetch } from '../utils/cachedFetch'
import FlipbookViewer from '../components/FlipbookViewer'

const API_URL = 'https://admins.miningdiscovery.com/api/post-newsletters?populate=*'
const BASE_URL = 'https://admins.miningdiscovery.com'

const getNewsletterDetailUrl = (id: string) => `${API_URL}&filters[id][$eq]=${encodeURIComponent(id)}`

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
  const url = item.coverImage?.formats?.small?.url || item.coverImage?.formats?.medium?.url || item.coverImage?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${BASE_URL}${url}`
}

const getPdfUrl = (item: NewsletterItem): string | null => {
  const candidate = item.pdfFile?.url
  if (!candidate) return null
  return candidate.startsWith('http') ? candidate : `${BASE_URL}${candidate}`
}

export default function NewsletterFlipbook({ newsletterId, onBack }: NewsletterFlipbookProps): JSX.Element {
  const [item, setItem] = useState<NewsletterItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchNewsletter = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await cachedFetch(getNewsletterDetailUrl(newsletterId))
        if (!mounted) return

        const rawItem = Array.isArray(data?.data) ? data.data[0] : data?.data || data
        if (!rawItem || !rawItem.id) {
          setError('Newsletter not found.')
          return
        }

        setItem({
          id: rawItem.id,
          title: rawItem.title,
          publishedAt: rawItem.publishedAt,
          coverImage: rawItem.coverImage,
          pdfFile: rawItem.pdfFile,
          Description: rawItem.Description,
          description: rawItem.description,
        })
      } catch (err: any) {
        if (!mounted) return
        setError('Unable to load newsletter at the moment.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchNewsletter()
    return () => {
      mounted = false
    }
  }, [newsletterId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-slate-700">
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-4 border-[#1E3B6E] border-t-transparent" />
          <span className="text-sm">Opening newsletter…</span>
        </div>
      </div>
    )
  }

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
