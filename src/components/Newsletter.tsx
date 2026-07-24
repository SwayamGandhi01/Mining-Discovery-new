import React, { useEffect, useState } from 'react'
import { Download, ExternalLink, Calendar } from 'lucide-react'
import SubscribeFormCard from './SubscribeFormCard'

type Category = { id: number; name: string; publishedAt?: string }
type NewsletterItem = any

const CATEGORIES_API = 'https://admins.miningdiscovery.com/api/newsletter-categories'
const NEWSLETTERS_API = 'https://admins.miningdiscovery.com/api/post-newsletters?populate=*'

const Newsletter: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([])
  const [selectedNewsletters, setSelectedNewsletters] = useState<NewsletterItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function loadAll() {
      setLoading(true)
      try {
        const [catsRes, listRes] = await Promise.all([fetch(CATEGORIES_API), fetch(NEWSLETTERS_API)])
        if (!catsRes.ok || !listRes.ok) throw new Error('Failed to fetch newsletters')
        const catsJson = await catsRes.json()
        const listJson = await listRes.json()
        if (!mounted) return

        const cats: Category[] = (catsJson?.data || []).map((c: any) => ({ id: c.id, name: c.name, publishedAt: c.publishedAt }))
        // sort by publishedAt desc to show newest first
        const sortedCats = cats.sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime())
        setCategories(sortedCats)

        const newslettersList: NewsletterItem[] = listJson?.data || []
        setNewsletters(newslettersList)

        // default select first category
        const defaultCatId = sortedCats?.[0]?.id ?? null
        setSelectedCat(defaultCatId)
        if (defaultCatId) fetchNewslettersByCategory(defaultCatId)
        setError(null)
      } catch (e: any) {
        setError(e.message || 'Error loading data')
      } finally {
        setLoading(false)
      }
    }
    loadAll()
    return () => { mounted = false }
  }, [])

  function newslettersForCategory(catId: number | null) {
    if (!catId) return []
    return newsletters.filter((n: any) => n.newsletter_category?.id === catId)
  }

  async function fetchNewslettersByCategory(catId: number) {
    try {
      setLoading(true)
      const url = `${NEWSLETTERS_API}&filters[newsletter_category][id][$eq]=${catId}`
      const res = await fetch(url)
      if (!res.ok) {
        setSelectedNewsletters([])
        return
      }
      const json = await res.json()
      setSelectedNewsletters(json?.data || [])
    } catch (e) {
      setSelectedNewsletters([])
    } finally {
      setLoading(false)
    }
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

  return (
    <section className="py-12 border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="serif-title text-3xl font-bold">Newsletters</h2>
            <p className="text-slate-600 dark:text-slate-400">Browse recent newsletters by month.</p>
          </div>
        </div>

        {loading && <div className="py-8">Loading...</div>}
        {error && <div className="py-8 text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
            <div className="lg:col-span-3 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCat(c.id); setSelectedNewsletters([]); fetchNewslettersByCategory(c.id) }}
                    className={`px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base whitespace-nowrap ${selectedCat === c.id ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-800 border'}`}>
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Current month newsletter cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
                {(selectedNewsletters.length ? selectedNewsletters : newslettersForCategory(selectedCat)).slice(0, 6).map((n: any) => (
                  <div key={n.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start shadow-sm hover:shadow-xl hover:border-[#1E3B6E]/40 transition-all duration-300 group overflow-hidden">
                    <div className="w-32 sm:w-36 flex-shrink-0 mx-auto sm:mx-0">
                      <img src={n.coverImage?.formats?.small?.url || n.coverImage?.url} alt={n.title} className="w-full h-auto max-h-52 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300" />
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
                          onClick={() => downloadPdf(n.pdfFile?.url, n.pdfFile?.name)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#1E3B6E] hover:bg-[#2563EB] active:bg-[#152a4f] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                        >
                          <Download className="w-4 h-4 flex-shrink-0" />
                          <span>Download PDF</span>
                        </button>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={n.pdfFile?.url}
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700 transition-all duration-200 text-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#3B82F6] flex-shrink-0" />
                          <span>Open</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {!(selectedNewsletters.length) && newslettersForCategory(selectedCat).length === 0 && (
                  <div className="text-sm text-slate-500 col-span-full text-center py-8">No newsletters found for this month.</div>
                )}
              </div>

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
