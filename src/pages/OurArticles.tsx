import React, { useEffect, useState } from 'react'
import { Download, ExternalLink, FileText } from 'lucide-react'
import { cachedFetch } from '../utils/cachedFetch'

const navigate = (path: string) => {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

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
  buttonText?: string
  buttonLink?: string
  features?: any
  image?: any
  coverImage?: any
  pdf?: any
  file?: any
  pdfFile?: any
  our_article_pdf?: any
  media?: any
}

type GroupedArticles = {
  monthYear: string
  articles: OurArticle[]
}

const API_URL = 'https://admins.miningdiscovery.com/api/our-artciles?populate=*'
const BASE_URL = 'https://admins.miningdiscovery.com'

export default function OurArticles(): JSX.Element {
  const [articles, setArticles] = useState<OurArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    cachedFetch(API_URL, {
      onUpdate: (fresh: any) => {
        if (!mounted) return
        setArticles(fresh?.data || [])
      },
    })
      .then((data) => {
        if (!mounted) return
        setArticles(data?.data || [])
        setLoading(false)
      })
      .catch((err) => {
        if (!mounted) return
        setError(String(err))
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  // Helper to format date string to "MONTH YEAR" (e.g. "JULY 2026")
  const getMonthYear = (item: OurArticle): string => {
    const rawDate = item.publishDate || item.publishedAt || item.createdAt
    if (!rawDate) return 'RECENT ARTICLES'
    const date = new Date(rawDate)
    if (isNaN(date.getTime())) return 'RECENT ARTICLES'
    const month = date.toLocaleString('default', { month: 'long' }).toUpperCase()
    const year = date.getFullYear()
    return `${month} ${year}`
  }

  // Helper to get image URL
  const getImageUrl = (item: OurArticle): string | null => {
    const imgObj = item.image || item.coverImage || item.media
    if (!imgObj) return null
    const url = imgObj?.formats?.medium?.url || imgObj?.formats?.small?.url || imgObj?.url
    if (!url) return null
    return url.startsWith('http') ? url : `${BASE_URL}${url}`
  }

  // Helper to get PDF URL
  const getPdfUrl = (item: OurArticle): string | null => {
    const candidate =
      item.pdf?.url ||
      item.file?.url ||
      item.pdfFile?.url ||
      item.our_article_pdf?.url ||
      item.media?.url ||
      item.buttonLink

    if (!candidate) return null
    return candidate.startsWith('http') ? candidate : `${BASE_URL}${candidate}`
  }

  // Click handler to open the flipbook viewer
  const handleArticleClick = (item: OurArticle) => {
    if (item.documentId) {
      navigate(`/flipbook/${item.documentId}`)
      return
    }

    const pdfUrl = getPdfUrl(item)
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const visibleArticles = React.useMemo(() => {
    return articles.filter((item) => {
      const normalizedTitle = (item.Title || item.title || '').toLowerCase()
      return !normalizedTitle.includes('u.s. gold') && !normalizedTitle.includes('us gold')
    })
  }, [articles])

  // Group articles by Month Year, sorted newest first
  const groupedArticles: GroupedArticles[] = React.useMemo(() => {
    const map = new Map<string, { articles: OurArticle[]; sortDate: number }>()

    visibleArticles.forEach((item) => {
      const key = getMonthYear(item)
      const rawDate = item.publishDate || item.publishedAt || item.createdAt
      const timestamp = rawDate ? new Date(rawDate).getTime() : 0

      if (!map.has(key)) {
        map.set(key, { articles: [], sortDate: timestamp })
      }
      const group = map.get(key)!
      group.articles.push(item)
      // Keep the latest date in the group for sorting
      if (timestamp > group.sortDate) {
        group.sortDate = timestamp
      }
    })

    return Array.from(map.entries())
      .map(([monthYear, { articles, sortDate }]) => ({
        monthYear,
        articles,
        sortDate,
      }))
      .sort((a, b) => b.sortDate - a.sortDate)
  }, [visibleArticles])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Header — matching Magazines page style */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3B82F6]">
            INSIGHTS &amp; ANALYSIS
          </span>
          <h1 className="serif-title text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
            Our Articles
          </h1>
          <div className="w-16 h-1 bg-[#1E3B6E] mx-auto rounded-full mt-4" />
          <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            In-depth coverage, expert commentary, and actionable intelligence from the global mining industry — curated by Laura's Liaisons.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#1E3B6E] border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-slate-500 text-sm">Loading articles...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <span className="material-icons text-red-400 text-4xl">error_outline</span>
            <p className="text-sm text-red-500 mt-2">{error}</p>
          </div>
        )}

        {/* Grouped Articles List */}
        {!loading && !error && (
          <div className="space-y-14">
            {groupedArticles.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="material-icons text-slate-300 text-5xl">article</span>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-3">No articles found.</p>
              </div>
            ) : (
              groupedArticles.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-5">
                  {/* Month Year Heading */}
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[#1E3B6E] dark:text-[#3B82F6] text-xl">date_range</span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">
                      {group.monthYear}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 dark:from-slate-700 to-transparent" />
                  </div>

                  {/* Card Container */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 sm:gap-6 justify-items-center">
                      {group.articles.map((art) => {
                        const title = art.Title || art.title || 'Untitled Article'
                        const coverUrl = getImageUrl(art)
                        const pdfUrl = getPdfUrl(art)

                        return (
                          <div
                            key={art.id}
                            onClick={() => handleArticleClick(art)}
                            className="flex flex-col items-center text-center group cursor-pointer w-full"
                            title={`Click to open ${title}`}
                          >
                            {/* Card Cover Preview */}
                            <div className="w-full aspect-[3/4] bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md group-hover:shadow-xl group-hover:-translate-y-1.5 transition-all duration-300 overflow-hidden relative flex flex-col justify-between p-3">
                              {coverUrl ? (
                                <img
                                  src={coverUrl}
                                  alt={title}
                                  className="w-full h-full object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                /* Fallback Styled Magazine Cover */
                                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#1E3B6E] to-slate-900 text-white rounded-md p-3 flex flex-col justify-between items-center relative overflow-hidden border border-slate-700">
                                  {/* Top accent bar */}
                                  <div className="w-full h-1 bg-[#3B82F6] rounded-full mb-1" />
                                  <div className="my-auto flex flex-col items-center justify-center p-2">
                                    <FileText className="w-8 h-8 text-[#3B82F6] mb-2 opacity-90" />
                                    <span className="text-[11px] font-black tracking-tight leading-tight line-clamp-3 text-center uppercase text-white">
                                      {title}
                                    </span>
                                  </div>
                                  <div className="text-[8px] font-bold tracking-widest text-[#3B82F6] uppercase">
                                    LAURA'S LIAISONS
                                  </div>
                                </div>
                              )}

                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4 rounded-xl">
                                <ExternalLink className="w-5 h-5 text-[#3B82F6] mb-1.5" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-center">
                                  Open Article
                                </span>
                              </div>
                            </div>

                            {/* Article Title */}
                            <h4 className="mt-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#1E3B6E] transition-colors duration-300 line-clamp-2">
                              {title}
                            </h4>

                            {/* Flipbook / PDF Action Link */}
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#1E3B6E] dark:text-[#3B82F6] group-hover:underline">
                              <Download className="w-3 h-3" /> {art.documentId ? 'Open flipbook' : pdfUrl ? 'View PDF' : 'Read article'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
