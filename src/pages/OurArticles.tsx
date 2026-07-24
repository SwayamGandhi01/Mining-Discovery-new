import React, { useEffect, useState } from 'react'
import { Download, ExternalLink, FileText } from 'lucide-react'

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

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch articles')
        return res.json()
      })
      .then((data) => {
        if (!mounted) return
        const list = data?.data || []
        setArticles(list)
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

  // Click handler to open PDF
  const handleArticleClick = (item: OurArticle) => {
    const pdfUrl = getPdfUrl(item)
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer')
    } else if (item.documentId) {
      window.location.hash = `#/article/${item.documentId}`
    }
  }

  // Group articles by Month Year
  const groupedArticles: GroupedArticles[] = React.useMemo(() => {
    const map = new Map<string, OurArticle[]>()

    articles.forEach((item) => {
      const key = getMonthYear(item)
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key)!.push(item)
    })

    return Array.from(map.entries()).map(([monthYear, items]) => ({
      monthYear,
      articles: items,
    }))
  }, [articles])

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Dark Navy Header Banner */}
      <section className="bg-[#0B132B] text-white py-12 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Laura's Liaisons <span className="text-[#C59B27]">Articles</span>
          </h1>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-[#1E3B6E] dark:text-[#3B82F6]">All</span> Articles
          </h2>
          <div className="w-12 h-1 bg-[#C59B27] rounded-full mt-2" />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-20 text-center">
            <div className="inline-block w-10 h-10 border-4 border-[#C59B27] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Loading articles...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="py-12 text-center text-red-500">
            <p className="font-semibold">Error loading articles: {error}</p>
          </div>
        )}

        {/* Grouped Articles List */}
        {!loading && !error && (
          <div className="space-y-12">
            {groupedArticles.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 font-medium">No articles found.</p>
              </div>
            ) : (
              groupedArticles.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-4">
                  {/* Month Year Heading */}
                  <h3 className="text-lg font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase pl-1">
                    {group.monthYear}
                  </h3>

                  {/* Cream/Slate Background Card Container with Bronze Bottom Border */}
                  <div className="bg-[#FAF8F5] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 border-b-4 border-b-[#8B6F47] rounded-2xl p-6 sm:p-8 shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {group.articles.map((art) => {
                        const title = art.Title || art.title || 'Untitled Article'
                        const coverUrl = getImageUrl(art)
                        const pdfUrl = getPdfUrl(art)

                        return (
                          <div
                            key={art.id}
                            onClick={() => handleArticleClick(art)}
                            className="flex flex-col items-center text-center group cursor-pointer"
                            title={`Click to open ${title}`}
                          >
                            {/* Card Cover Preview */}
                            <div className="w-full aspect-[3/4] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 overflow-hidden relative flex flex-col justify-between p-3">
                              {coverUrl ? (
                                <img
                                  src={coverUrl}
                                  alt={title}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                /* Fallback Styled Magazine Cover */
                                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#1E3B6E] to-slate-900 text-white rounded-md p-3 flex flex-col justify-between items-center relative overflow-hidden border border-slate-700">
                                  {/* Top accent bar */}
                                  <div className="w-full h-1 bg-[#C59B27] rounded-full mb-1" />
                                  <div className="my-auto flex flex-col items-center justify-center p-2">
                                    <FileText className="w-8 h-8 text-[#C59B27] mb-2 opacity-90" />
                                    <span className="text-[11px] font-black tracking-tight leading-tight line-clamp-3 text-center uppercase text-white">
                                      {title}
                                    </span>
                                  </div>
                                  <div className="text-[8px] font-bold tracking-widest text-[#C59B27] uppercase">
                                    LAURA'S LIAISONS
                                  </div>
                                </div>
                              )}

                              {/* Hover overlay hint */}
                              <div className="absolute inset-0 bg-[#0B132B]/75 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 rounded-xl">
                                <ExternalLink className="w-6 h-6 text-[#C59B27] mb-1" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-center">
                                  Open PDF
                                </span>
                              </div>
                            </div>

                            {/* Article Title */}
                            <h4 className="mt-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-2">
                              {title}
                            </h4>

                            {/* Download / Open Action Link */}
                            {pdfUrl && (
                              <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-primary group-hover:underline">
                                <Download className="w-3 h-3" /> View PDF
                              </span>
                            )}
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
