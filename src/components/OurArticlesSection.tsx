import React, { useEffect, useState } from 'react'
import { Download, ExternalLink } from 'lucide-react'
import { cachedFetch } from '../utils/cachedFetch'

type OurArticle = {
  id: number
  documentId?: string
  Title?: string
  title?: string
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

const API_URL = 'https://admins.miningdiscovery.com/api/our-artciles?populate=*'
const BASE_URL = 'https://admins.miningdiscovery.com'

interface OurArticlesSectionProps {
  onArticleClick?: (documentId: string) => void
}

const getImageUrl = (item: OurArticle): string | null => {
  const imgObj = item.image || item.coverImage || item.media
  if (!imgObj) return null
  const url = imgObj?.formats?.medium?.url || imgObj?.formats?.small?.url || imgObj?.url
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

export default function OurArticlesSection({ onArticleClick }: OurArticlesSectionProps): JSX.Element {
  const [articles, setArticles] = useState<OurArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchArticles = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await cachedFetch(API_URL, {
          onUpdate: (fresh: any) => {
            if (!mounted) return
            const fetched = (fresh?.data || []).map((item: any) => item)
            setArticles(fetched)
          },
        })

        if (!mounted) return
        setArticles((data?.data || []).map((item: any) => item))
      } catch (err: any) {
        if (!mounted) return
        setError('Unable to load articles at the moment.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchArticles()
    return () => {
      mounted = false
    }
  }, [])

  const handleArticleClick = (item: OurArticle) => {
    const pdfUrl = getPdfUrl(item)
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer')
      return
    }
    if (item.documentId) {
      onArticleClick?.(item.documentId)
    }
  }

  const sortedArticles = [...articles].sort((a, b) => {
    const aDate = new Date(a.publishDate || a.publishedAt || a.createdAt || 0).getTime()
    const bDate = new Date(b.publishDate || b.publishedAt || b.createdAt || 0).getTime()
    return bDate - aDate
  })

  return (
    <section className="py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h2 className="serif-title text-3xl sm:text-4xl font-bold">Latest Articles</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mt-2">
              Fresh insights and commentary from the Our Articles page, curated for the homepage.
            </p>
          </div>
          <a
            href="/our-articles"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            View all articles
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl mb-5" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-3 w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded mb-2 w-1/2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-700/40 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 no-scrollbar">
            <div className="flex gap-4 min-w-max">
              {sortedArticles.map((item) => {
                const title = item.Title || item.title || 'Untitled article'
                const imageUrl = getImageUrl(item)
                const pdfUrl = getPdfUrl(item)
                const date = item.publishDate || item.publishedAt || item.createdAt
                const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

                return (
                  <article
                    key={item.id}
                    className="min-w-[22rem] max-w-[22rem] shrink-0 group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
                    onClick={() => handleArticleClick(item)}
                  >
                    <div className="h-40 overflow-hidden bg-slate-100 dark:bg-slate-900">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          No image available
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{formattedDate}</p>
                      <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-3">
                        {title}
                      </h3>
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {pdfUrl ? (
                          <>
                            <Download className="h-4 w-4 text-[#1E3B6E]" />
                            <span>Open PDF</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-4 w-4 text-[#1E3B6E]" />
                            <span>Read article</span>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
