import React, { useEffect, useState } from 'react'
import { ArrowRight, Clock3, Download, ExternalLink, Sparkles } from 'lucide-react'
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

const navigate = (path: string) => {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}
interface OurArticlesSectionProps {
  onArticleClick?: (documentId: string) => void
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
    if (item.documentId) {
      onArticleClick?.(item.documentId)
      return
    }

    const pdfUrl = getPdfUrl(item)
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const visibleArticles = [...articles].filter((item) => {
    const normalizedTitle = (item.Title || item.title || '').toLowerCase()
    return !normalizedTitle.includes('u.s. gold') && !normalizedTitle.includes('us gold')
  })

  const sortedArticles = [...visibleArticles].sort((a, b) => {
    const aDate = new Date(a.publishDate || a.publishedAt || a.createdAt || 0).getTime()
    const bDate = new Date(b.publishDate || b.publishedAt || b.createdAt || 0).getTime()
    return bDate - aDate
  })

  return (
    <section className="border-t border-slate-200 py-12 sm:py-14 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 shadow-sm sm:p-8 md:flex-row md:items-end md:justify-between dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#1E3B6E]/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#1E3B6E] shadow-sm dark:bg-slate-900/70">
              <Sparkles className="h-3.5 w-3.5" />
              Fresh from the newsroom
            </div>
            <h2 className="serif-title text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">Latest Articles</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
              Fresh insights and commentary from the Our Articles page, curated for the homepage.
            </p>
          </div>
          <button
            onClick={() => navigate('/our-articles')}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </button>
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
          <div className="overflow-x-auto pb-2 no-scrollbar">
            <div className="flex gap-5 min-w-max pb-2">
              {sortedArticles.map((item) => {
                const title = item.Title || item.title || 'Untitled article'
                const imageUrl = getImageUrl(item)
                const pdfUrl = getPdfUrl(item)
                const date = item.publishDate || item.publishedAt || item.createdAt
                const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

                return (
                  <article
                    key={item.id}
                    className="group min-w-[22rem] max-w-[22rem] shrink-0 cursor-pointer overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-950"
                    onClick={() => handleArticleClick(item)}
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-900">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="mx-auto h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          No image available
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/85 dark:text-slate-200">
                        Featured
                      </div>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        <span>{formattedDate || 'Latest update'}</span>
                      </div>
                      <h3 className="mt-3 line-clamp-3 text-lg font-semibold leading-7 text-slate-900 transition group-hover:text-[#1E3B6E] dark:text-slate-100">
                        {title}
                      </h3>
                      <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 transition group-hover:border-[#1E3B6E]/20 group-hover:bg-[#F4F8FF] dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          {item.documentId ? (
                            <>
                              <Download className="h-4 w-4 text-[#1E3B6E]" />
                              <span>Open flipbook</span>
                            </>
                          ) : pdfUrl ? (
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
                        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#1E3B6E]" />
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
