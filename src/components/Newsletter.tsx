import React, { useEffect, useState } from 'react'
import { Download, ExternalLink, Calendar } from 'lucide-react'
import SubscribeFormCard from './SubscribeFormCard'
import { cms, imageSources } from '../api/cms'
import { Skeleton, SkeletonRegion } from './ui/Skeleton'
import LazyImage from './ui/LazyImage'

type Category = { id: number; name: string; publishedAt?: string }
type NewsletterItem = any

const navigate = (path: string) => {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

// Newest month first.
const toCategories = (json: any): Category[] =>
  (json?.data || [])
    .map((c: any) => ({ id: c.id, name: c.name, publishedAt: c.publishedAt }))
    .sort((a: Category, b: Category) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime())

/** Matches a newsletter card: portrait cover beside the title, date and two buttons. */
const NewsletterCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start shadow-sm overflow-hidden">
    <Skeleton className="w-32 sm:w-36 aspect-[7/10] rounded-xl flex-shrink-0 mx-auto sm:mx-0" />
    <div className="flex-1 flex flex-col min-w-0 w-full self-stretch">
      <div className="space-y-2 mb-3">
        <Skeleton className="h-4 sm:h-5 w-full" />
        <Skeleton className="h-4 sm:h-5 w-2/3" />
      </div>
      <Skeleton className="h-6 w-28 rounded-full mb-4" />
      <div className="flex flex-col gap-2 mt-auto">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  </div>
)

const Newsletter: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Bumped by the "Try again" button so the request runs once more.
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let mounted = true
    async function loadAll() {
      setLoading(true)
      try {
        // Both requests run together. The list holds every newsletter (48
        // today), so switching months filters it here instead of asking the
        // CMS again.
        const [catsJson, listJson] = await Promise.all([
          cms.newsletterCategories.fetch((fresh) => {
            if (mounted) setCategories(toCategories(fresh))
          }),
          cms.newsletters.fetch((fresh) => {
            if (mounted) setNewsletters(fresh?.data || [])
          }),
        ])
        if (!mounted) return

        const sortedCats = toCategories(catsJson)
        setCategories(sortedCats)
        setNewsletters(listJson?.data || [])

        // default select first category
        setSelectedCat(sortedCats[0]?.id ?? null)
        setError(null)
      } catch (e: any) {
        if (mounted) setError('Failed to fetch newsletters')
      } finally {
        // A run that was cancelled (unmount, or React's dev double-invoke) must not
        // end the loading state of the run that replaced it.
        if (mounted) setLoading(false)
      }
    }
    loadAll()
    return () => { mounted = false }
  }, [retryCount])

  function newslettersForCategory(catId: number | null) {
    if (!catId) return []
    return newsletters.filter((n: any) => n.newsletter_category?.id === catId)
  }

  const handleOpenFlipbook = (newsletterId: number) => {
    navigate(`/newsletter-flipbook/${newsletterId}`)
  }

  async function downloadPdf(url?: string, filename?: string) {
    if (!url) return
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename || 'newsletter.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(blobUrl)
    } catch (e) {
      console.error('Download failed', e)
    }
  }

  const visibleNewsletters = newslettersForCategory(selectedCat)

  return (
    <section className="py-12 border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="serif-title text-3xl font-bold">Newsletters</h2>
            <p className="text-slate-600 dark:text-slate-400">Browse recent newsletters by month.</p>
          </div>
        </div>

        {error && (
          <div className="py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => setRetryCount((n) => n + 1)}
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#1E3B6E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
            >
              Try again
            </button>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
            <div className="lg:col-span-3 flex flex-col">
              {loading ? (
                <SkeletonRegion label="Loading newsletters">
                  {/* One pill per month, so several — enough to wrap like the real tabs on small screens. */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
                    {['w-24', 'w-28', 'w-24', 'w-32', 'w-28', 'w-24', 'w-32', 'w-28', 'w-24', 'w-28'].map((width, i) => (
                      <Skeleton key={i} className={`h-9 sm:h-10 rounded-full ${width}`} />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
                    <NewsletterCardSkeleton />
                    <NewsletterCardSkeleton />
                  </div>
                </SkeletonRegion>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCat(c.id)}
                        className={`px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base whitespace-nowrap ${selectedCat === c.id ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-800 border'}`}>
                        {c.name}
                      </button>
                    ))}
                  </div>

                  {/* Current month newsletter cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
                    {visibleNewsletters.slice(0, 6).map((n: any) => {
                      // The cover shows 128–144px wide: take the lightest variant that stays sharp.
                      const cover = imageSources(n.coverImage, 220)
                      return (
                        <div key={n.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start shadow-sm hover:shadow-xl hover:border-[#1E3B6E]/40 transition-all duration-300 group overflow-hidden">
                          <div className="relative w-32 sm:w-36 flex-shrink-0 mx-auto sm:mx-0">
                            {/* width/height let the browser reserve the cover's height before it downloads. */}
                            <LazyImage
                              src={cover?.url}
                              srcSet={cover?.srcSet}
                              sizes="144px"
                              width={cover?.width}
                              height={cover?.height}
                              alt={n.title}
                              className="w-full h-auto max-h-52 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                              skeletonClassName="rounded-xl"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between min-w-0 w-full h-full">
                            <div>
                              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">{n.title}</h3>
                              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">
                                <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                                {new Date(n.publishedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-auto w-full">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenFlipbook(n.id)
                                }}
                                className="w-full inline-flex items-center justify-center gap-2 bg-[#1E3B6E] hover:bg-[#2563EB] active:bg-[#152a4f] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                              >
                                <Download className="w-4 h-4 flex-shrink-0" />
                                <span>Open flipbook</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  downloadPdf(n.pdfFile?.url, n.pdfFile?.name)
                                }}
                                className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700 transition-all duration-200 text-center"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-[#3B82F6] flex-shrink-0" />
                                <span>Download PDF</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {visibleNewsletters.length === 0 && (
                      <div className="text-sm text-slate-500 col-span-full text-center py-8">No newsletters found for this month.</div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Daily Newsletter Subscribe Form */}
            <div className="lg:col-span-1">
              <SubscribeFormCard />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Newsletter
