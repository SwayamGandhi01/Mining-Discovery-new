import React, { useEffect, useState } from 'react'
import { Mail, Check } from 'lucide-react'

type Category = { id: number; name: string; publishedAt?: string }
type NewsletterItem = any

const CATEGORIES_API = 'https://admins.miningdiscovery.com/api/newsletter-categories'
const NEWSLETTERS_API = 'https://admins.miningdiscovery.com/api/post-newsletters?populate=*'

const SubscribeFormCard: React.FC = () => {
  const [email, setEmail] = useState('')
  const [subscriptions, setSubscriptions] = useState({
    corporateNews: false,
    magazine: false,
    dailyNewsletter: true,
    weeklyNewsletter: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleCheckboxChange = (key: keyof typeof subscriptions) => {
    setSubscriptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setEmail('')
    }, 4000)
  }

  return (
    <div className="w-full bg-[#0A0F1D] text-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-800/80 relative overflow-hidden">
      {/* Top left accent line */}
      <div className="w-14 h-1 bg-[#1E3B6E] rounded-full mb-6" />

      {/* Circular Mail Icon */}
      <div className="w-14 h-14 bg-[#111827] border border-[#1E3B6E]/60 rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
        <Mail className="w-6 h-6 text-[#3B82F6]" />
      </div>

      {/* Headline & Subtitle */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-black tracking-wide mb-1.5 uppercase">
          <span className="text-white">DAILY </span>
          <span className="text-[#3B82F6]">NEWSLETTER</span>
        </h3>
        <p className="text-slate-300 text-xs leading-relaxed max-w-xs mx-auto">
          Get the top mining stories delivered to your inbox.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your e-mail"
            required
            className="w-full bg-[#131C2E] border border-slate-700/80 rounded-lg px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-2.5 pt-1 pl-1">
          <label className="flex items-center gap-3 cursor-pointer group text-xs sm:text-sm text-slate-200 select-none">
            <input
              type="checkbox"
              checked={subscriptions.corporateNews}
              onChange={() => handleCheckboxChange('corporateNews')}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#1E3B6E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#1E3B6E]"
            />
            <span className="font-medium group-hover:text-white transition-colors">
              Corporate News
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group text-xs sm:text-sm text-slate-200 select-none">
            <input
              type="checkbox"
              checked={subscriptions.magazine}
              onChange={() => handleCheckboxChange('magazine')}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#1E3B6E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#1E3B6E]"
            />
            <span className="font-medium group-hover:text-white transition-colors">
              Magazine
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group text-xs sm:text-sm text-slate-200 select-none">
            <input
              type="checkbox"
              checked={subscriptions.dailyNewsletter}
              onChange={() => handleCheckboxChange('dailyNewsletter')}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#1E3B6E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#1E3B6E]"
            />
            <span className="font-medium group-hover:text-white transition-colors">
              Daily Newsletter
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group text-xs sm:text-sm text-slate-200 select-none">
            <input
              type="checkbox"
              checked={subscriptions.weeklyNewsletter}
              onChange={() => handleCheckboxChange('weeklyNewsletter')}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#1E3B6E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#1E3B6E]"
            />
            <span className="font-medium group-hover:text-white transition-colors">
              Weekly Newsletter
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#1E3B6E] hover:bg-[#2563EB] active:bg-[#152a4f] text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-lg tracking-wider uppercase transition-colors shadow-md mt-4"
        >
          {submitted ? (
            <span className="flex items-center justify-center gap-2 text-white">
              <Check className="w-4 h-4" /> SUBSCRIBED!
            </span>
          ) : (
            'SUBSCRIBE NOW'
          )}
        </button>
      </form>
    </div>
  )
}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 mb-6">
                {(selectedNewsletters.length ? selectedNewsletters : newslettersForCategory(selectedCat)).slice(0, 6).map((n: any) => (
                  <div key={n.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex gap-5 items-start shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-28 sm:w-32 flex-shrink-0">
                      <img src={n.coverImage?.formats?.small?.url || n.coverImage?.url} alt={n.title} className="w-full h-auto object-cover rounded-lg shadow-sm" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1">{n.title}</div>
                      <div className="text-sm text-slate-500 mb-4">{new Date(n.publishedAt).toLocaleDateString()}</div>
                      <div className="flex gap-3 flex-wrap">
                        <button onClick={() => downloadPdf(n.pdfFile?.url, n.pdfFile?.name)} className="inline-flex items-center gap-1.5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-[#C59B27] hover:to-[#a8832a] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md">
                          <span className="material-icons text-sm">picture_as_pdf</span>
                          Download PDF
                        </button>
                        <a target="_blank" rel="noopener noreferrer" href={n.pdfFile?.url} className="inline-flex items-center gap-1.5 border-2 border-slate-200 dark:border-slate-700 hover:border-[#C59B27] text-slate-700 dark:text-slate-300 hover:text-[#C59B27] px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300">
                          <span className="material-icons text-sm">open_in_new</span>
                          Open
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
