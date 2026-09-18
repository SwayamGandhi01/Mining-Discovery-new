import React, { useEffect, useRef, useState } from 'react'
import { Clock, Calendar, ArrowRight, FileText, TrendingUp, ChevronLeft, Tag } from 'lucide-react'
import { cms, imageSources, withDescriptionFallback, NewsFilter } from '../api/cms'
import { warmFlipbookRuntime } from '../utils/flipbookPrefetch'
import LazyImage from '../components/ui/LazyImage'
import NewsPagination from '../components/NewsPagination'
import { SkeletonRegion } from '../components/ui/Skeleton'
import CategoryNewsSkeleton, { CategoryListSkeleton } from '../components/skeletons/CategoryNewsSkeleton'

interface NewsArticle {
  id: number
  documentId: string
  title: string
  short_description?: string
  description?: string | null
  publishedAt: string
  author?: string
  image?: {
    formats?: {
      medium?: { url: string }
      small?: { url: string }
      large?: { url: string }
      thumbnail?: { url: string }
    }
    url?: string
  }
  pdf?: { url?: string } | any
  pdfUrl?: string
}

interface CategoryNewsProps {
  categorySlug?: string
}

const navigate = (path: string) => {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

// The lightest image variant that still fills the slot: the featured story is
// ~720px wide, grid cards ~380px, sidebar thumbnails 96px.
const IMAGE_WIDTH = { featured: 700, card: 400, thumbnail: 160 }

const getImage = (article: NewsArticle, minWidth: number) => imageSources(article.image, minWidth)

// What each slot is drawn at, for the browser to choose a file by.
const SIZES = {
  featured: '(min-width: 1024px) 700px, 100vw',
  card: '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw',
  thumbnail: '96px',
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const formatDateShort = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const calcReadTime = (text?: string | null) => {
  if (!text) return null
  const words = text.split(/\s+/).length
  const mins = Math.ceil(words / 200)
  return mins < 1 ? null : `${mins} min read`
}

export default function CategoryNews({ categorySlug }: CategoryNewsProps): JSX.Element {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<NewsFilter>('all')
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  // Totals straight from the CMS, for the header figures and the tab labels.
  const [totals, setTotals] = useState<{ all: number; pdf: number } | null>(null)
  // A page or tab change swaps just the list, keeping the header and tabs put.
  const [listLoading, setListLoading] = useState(false)
  // Bumped by the "Try again" button so the request runs once more.
  const [retryCount, setRetryCount] = useState(0)
  const listTop = useRef<HTMLDivElement | null>(null)
  const firstLoad = useRef(true)

  // Opening a different category starts again at page one.
  const [lastSlug, setLastSlug] = useState(categorySlug)
  if (categorySlug !== lastSlug) {
    setLastSlug(categorySlug)
    setPage(1)
    firstLoad.current = true
  }

  useEffect(() => {
    let mounted = true

    const slug = categorySlug || (() => {
      const path = window.location.pathname
      const match = path.match(/^\/news\/([^/]+)$/)
      return match ? match[1] : ''
    })()

    if (!slug) {
      setError('Category not found')
      setLoading(false)
      return
    }

    const fetchArticles = async () => {
      try {
        if (firstLoad.current) setLoading(true)
        else setListLoading(true)
        setError(null)

        const processData = (data: any) => {
          if (!mounted) return
          const mapped: NewsArticle[] = (data?.data || []).map((item: any) => {
            let pdfUrl: string | undefined
            if (item.pdf) {
              if (typeof item.pdf === 'string') pdfUrl = item.pdf
              else if (item.pdf.url) pdfUrl = item.pdf.url
              else if (Array.isArray(item.pdf) && item.pdf[0]?.url) pdfUrl = item.pdf[0].url
            }
            return {
              id: item.id,
              documentId: item.documentId,
              title: item.title,
              short_description: item.short_description,
              description: item.description,
              publishedAt: item.publishedAt,
              author: item.author,
              image: item.image,
              pdf: item.pdf,
              pdfUrl,
            }
          })

          setArticles(mapped)
          setPageCount(Math.max(1, data?.meta?.pagination?.pageCount ?? 1))

          if (data?.data?.[0]?.news_categories) {
            const matchingCategory = data.data[0].news_categories.find(
              (cat: any) => cat.slug === slug
            )
            setCategoryName(
              matchingCategory?.category || data.data[0].news_categories[0]?.category || slug
            )
          }
        }

        const data = await cms.categoryNews(slug, page, activeFilter).fetch((fresh: any) => {
          withDescriptionFallback(fresh).then(processData)
        })

        processData(await withDescriptionFallback(data))
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Error loading articles')
      } finally {
        if (mounted) {
          setLoading(false)
          setListLoading(false)
          firstLoad.current = false
        }
      }
    }

    // The tab totals: two small requests, cached and shared by every page of
    // this category, so the counts stay right no matter which page is open.
    const fetchTotals = async () => {
      try {
        const [all, pdf] = await Promise.all([
          cms.categoryNewsCount(slug, 'all').fetch(),
          cms.categoryNewsCount(slug, 'pdf').fetch(),
        ])
        if (mounted) {
          setTotals({
            all: all?.meta?.pagination?.total ?? 0,
            pdf: pdf?.meta?.pagination?.total ?? 0,
          })
        }
      } catch {
        // Counts are a nicety; the page itself still renders.
      }
    }

    fetchArticles()
    fetchTotals()
    return () => { mounted = false }
  }, [categorySlug, activeFilter, page, retryCount])

  // PDF stories (the Research Reports category) open in the flipbook reader,
  // like magazines and newsletters; the reader links to the PDF itself too.
  const handleArticleClick = (article: NewsArticle) => {
    if (article.pdfUrl?.trim()) {
      navigate(`/news-flipbook/${article.documentId}`)
    } else {
      navigate(`/article/${article.documentId}`)
    }
  }

  // Hovering a PDF story fetches the reader's code ahead of the click.
  const warmReader = (article: NewsArticle) => {
    if (article.pdfUrl?.trim()) warmFlipbookRuntime()
  }

  // Moving between pages: load the page and bring the reader back to the top
  // of the list rather than leaving them halfway down the previous one.
  const goToPage = (next: number) => {
    setPage(next)
    listTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const showTab = (filter: NewsFilter) => {
    setActiveFilter(filter)
    setPage(1)
  }

  // Totals come from the CMS; until they arrive, this page's own counts stand in.
  const totalAll = totals?.all ?? articles.length
  const totalPdf = totals?.pdf ?? articles.filter(a => a.pdfUrl).length
  const totalArticles = Math.max(0, totalAll - totalPdf)

  // ── Loading ───────────────────────────────────────────────
  if (loading) return <CategoryNewsSkeleton />

  // ── Error ─────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">Something went wrong</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setRetryCount((n) => n + 1)}
              className="inline-flex items-center gap-2 bg-[#3B82F6] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#2563EB] transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // This page's stories: the first leads, the next three sit beside it, the
  // remainder fill the grid — the same layout on every page.
  const featured = articles[0]
  const secondary = articles.slice(1, 4)
  const rest = articles.slice(4)

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950">

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#3B82F6] text-xs font-semibold uppercase tracking-widest transition-colors mb-8 group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Home
            <span className="mx-1.5 opacity-40">·</span>
            News
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Tag className="w-3 h-3" />
                Category
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white serif-title leading-tight">
                {categoryName || 'News'}
              </h1>
            </div>

            <div className="flex items-center gap-6 text-slate-400 shrink-0">
              <div className="text-center">
                <div className="text-3xl font-black text-white">{totalAll}</div>
                <div className="text-xs uppercase tracking-widest mt-0.5">Articles</div>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-black text-white">{totalPdf}</div>
                <div className="text-xs uppercase tracking-widest mt-0.5">PDFs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[65px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none">
            {([
              { key: 'all', label: `All (${totalAll})` },
              { key: 'article', label: `Articles (${totalArticles})` },
              { key: 'pdf', label: `PDFs (${totalPdf})` },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => showTab(f.key)}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeFilter === f.key
                    ? 'bg-[#3B82F6] text-white shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={listTop} className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 scroll-mt-28">

        {listLoading ? (
          <SkeletonRegion label="Loading articles">
            <CategoryListSkeleton />
          </SkeletonRegion>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No articles match this filter.</p>
          </div>
        ) : (
          <>
            {/* The first story of the page leads; the rest follow below it. */}
            {featured && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">

                {/* Featured */}
                <article
                  onClick={() => handleArticleClick(featured)}
                  onPointerEnter={() => warmReader(featured)}
                  className="lg:col-span-7 group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 aspect-video shadow-lg">
                    {getImage(featured, IMAGE_WIDTH.featured) ? (
                      <LazyImage
                        priority
                        src={getImage(featured, IMAGE_WIDTH.featured)!.url}
                        srcSet={getImage(featured, IMAGE_WIDTH.featured)!.srcSet}
                        sizes={SIZES.featured}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-slate-600" />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-[#3B82F6] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        Featured
                      </span>
                      {featured.pdfUrl && (
                        <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5" /> PDF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(featured.publishedAt)}
                      </span>
                      {calcReadTime(featured.short_description || featured.description) && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-400" />
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {calcReadTime(featured.short_description || featured.description)}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-[#3B82F6] transition-colors duration-200 leading-tight mb-3 line-clamp-3">
                      {featured.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 mb-4">
                      {featured.short_description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[#3B82F6] text-sm font-bold group-hover:gap-3 transition-all">
                      {featured.pdfUrl ? 'Open flipbook' : 'Read Article'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>

                {/* Sidebar articles */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {secondary.map((article) => {
                    const img = getImage(article, IMAGE_WIDTH.thumbnail)
                    return (
                      <article
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        onPointerEnter={() => warmReader(article)}
                        className="group cursor-pointer flex gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:border-[#3B82F6]/50 hover:shadow-md transition-all duration-200"
                      >
                        <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                          {img ? (
                            <LazyImage src={img.url} srcSet={img.srcSet} sizes={SIZES.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-slate-500" />
                            </div>
                          )}
                          {article.pdfUrl && (
                            <div className="absolute bottom-1 right-1 bg-blue-600 text-white text-[9px] font-black rounded px-1 py-0.5">PDF</div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <p className="text-[10px] text-[#3B82F6] font-black uppercase tracking-wider mb-1">{formatDateShort(article.publishedAt)}</p>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#3B82F6] transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{article.short_description}</p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── More Articles Grid ───────────────────────────── */}
            {rest.length > 0 && (
              <>
                <div className="flex items-center gap-4 mb-7">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wide shrink-0">More Articles</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-300 dark:from-slate-700 to-transparent" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((article) => {
                    const img = getImage(article, IMAGE_WIDTH.card)
                    const readTime = calcReadTime(article.short_description || article.description)
                    return (
                      <article
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        onPointerEnter={() => warmReader(article)}
                        className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-[#3B82F6]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          {img ? (
                            <LazyImage src={img.url} srcSet={img.srcSet} sizes={SIZES.card} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                              <FileText className="w-10 h-10 text-slate-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          {article.pdfUrl && (
                            <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1">
                              <FileText className="w-2.5 h-2.5" /> PDF
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-2.5">
                            <Calendar className="w-3 h-3" />
                            {formatDate(article.publishedAt)}
                            {readTime && (
                              <>
                                <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                                <Clock className="w-3 h-3" />
                                {readTime}
                              </>
                            )}
                          </div>
                          <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#3B82F6] transition-colors line-clamp-2 leading-snug mb-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                            {article.short_description}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="inline-flex items-center gap-1 text-[#3B82F6] text-xs font-bold group-hover:gap-2 transition-all">
                              {article.pdfUrl ? 'Open flipbook' : 'Read more'}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                            {article.author && (
                              <span className="text-[11px] text-slate-400 font-medium truncate max-w-[100px]">by {article.author}</span>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}

        <NewsPagination page={page} pageCount={pageCount} onChange={goToPage} />
      </div>
    </div>
  )
}
