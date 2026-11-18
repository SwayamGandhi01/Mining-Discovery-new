import React, { useEffect, useState } from 'react'
import { cms, CMS_URL, resolveMediaUrl } from '../api/cms'
import FlipbookViewer from '../components/FlipbookViewer'
import FlipbookSkeleton from '../components/skeletons/FlipbookSkeleton'

const BASE_URL = CMS_URL

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
  return resolveMediaUrl(url)
}

const getPdfUrl = (item: OurArticle): string | null => {
  const candidate =
    item.pdf?.url ||
    item.file?.url ||
    item.pdfFile?.url ||
    item.our_article_pdf?.url ||
    item.buttonLink

  if (!candidate) return null
  return resolveMediaUrl(candidate)
}

const findArticle = (json: any, documentId: string): OurArticle | null =>
  (json?.data || []).find((item: any) => item.documentId === documentId) || null

export default function OurArticlesFlipbook({ documentId, onBack }: OurArticlesFlipbookProps): JSX.Element {
  const [article, setArticle] = useState<OurArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchArticle = async () => {
      // Opened from the Our Articles page or the homepage, the article is
      // already in the cached collection; otherwise fetch just this record.
      const listed = findArticle(cms.ourArticles.peek(), documentId)
      if (listed) {
        setArticle(listed)
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await cms.ourArticle(documentId).fetch((fresh: any) => {
          if (!mounted) return
          const found = findArticle(fresh, documentId)
          if (found) setArticle(found)
        })

        if (!mounted) return
        const found = findArticle(data, documentId)
        if (found) {
          setArticle(found)
        } else {
          setError('Article not found.')
        }
      } catch (err: any) {
        if (!mounted) return
        setError('Unable to load article at the moment.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchArticle()
    return () => {
      mounted = false
    }
  }, [documentId])

  if (loading) return <FlipbookSkeleton />

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
