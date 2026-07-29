import React, { useEffect, useState } from 'react'
import { cachedFetch } from '../utils/cachedFetch'
import FlipbookViewer from '../components/FlipbookViewer'

const API_URL = 'https://admins.miningdiscovery.com/api/our-artciles?populate=*'
const BASE_URL = 'https://admins.miningdiscovery.com'

type OurArticle = {
  id: number
  documentId: string
  Title?: string
  title?: string
  Description?: string
  description?: string
  publishDate?: string
  publishedAt?: string
  createdAt?: string
  image?: any
  coverImage?: any
  media?: any
  pdf?: any
  file?: any
  pdfFile?: any
  our_article_pdf?: any
  buttonLink?: string
}

type OurArticlesFlipbookProps = {
  documentId: string
  onBack: () => void
}

const getImageUrl = (item: OurArticle): string | null => {
  const rawImg = item.coverImage || item.image || item.media
  if (!rawImg) return null
  const imgObj = rawImg?.data?.attributes || rawImg?.attributes || rawImg
  const url =
    imgObj?.formats?.medium?.url ||
    imgObj?.formats?.small?.url ||
    imgObj?.formats?.thumbnail?.url ||
    imgObj?.formats?.large?.url ||
    imgObj?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${BASE_URL}${url}`
}

const getPdfUrl = (item: OurArticle): string | null => {
  const candidate =
    item.pdf?.url ||
    item.file?.url ||
    item.pdfFile?.url ||
    item.our_article_pdf?.url ||
    item.buttonLink

  if (!candidate) return null
  return candidate.startsWith('http') ? candidate : `${BASE_URL}${candidate}`
}

export default function OurArticlesFlipbook({ documentId, onBack }: OurArticlesFlipbookProps): JSX.Element {
  const [article, setArticle] = useState<OurArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchArticle = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await cachedFetch(API_URL, {
          onUpdate: (fresh: any) => {
            if (!mounted) return
            const found = (fresh?.data || []).find((item: any) => item.documentId === documentId)
            if (found) {
              setArticle(found)
            }
          },
        })

        if (!mounted) return
        const found = (data?.data || []).find((item: any) => item.documentId === documentId)
        if (found) {
          setArticle(found)
        } else {
          setError('Article not found.')
        }
      } catch (err: any) {
        if (!mounted) return
        setError('Unable to load article at the moment.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchArticle()
    return () => {
      mounted = false
    }
  }, [documentId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 rounded-[1.5rem] border border-slate-800 bg-slate-900 px-6 py-4 shadow-xl">
          <div className="h-5 w-5 animate-spin rounded-full border-4 border-[#1E3B6E] border-t-transparent" />
          <span className="text-sm text-slate-300">Opening flipbook…</span>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-white">
        <div className="max-w-md rounded-[2rem] border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <p className="text-xl font-semibold">Unable to open flipbook</p>
          <p className="mt-3 text-sm leading-7 text-slate-400">{error || 'The article could not be found.'}</p>
          <button
            onClick={onBack}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1E3B6E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
          >
            Back to articles
          </button>
        </div>
      </div>
    )
  }

  return (
    <FlipbookViewer
      title={article.Title || article.title || 'Article'}
      subtitle={article.publishDate || article.publishedAt || article.createdAt || undefined}
      pdfUrl={getPdfUrl(article)}
      coverImageUrl={getImageUrl(article)}
      description={article.Description || article.description || undefined}
      onBack={onBack}
    />
  )
}
