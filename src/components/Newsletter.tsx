import React, { useEffect, useState } from 'react'

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
        // sort by publishedAt desc and take latest 3
        const sortedCats = cats.sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime())
        const top3 = sortedCats.slice(0, 3)
        setCategories(top3)

        const newslettersList: NewsletterItem[] = listJson?.data || []
        setNewsletters(newslettersList)

        // default select first top3 category
        const defaultCatId = top3?.[0]?.id ?? null
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
    <section className="bg-primary/10 dark:bg-primary/5 py-16 mt-16 border-t border-primary/20">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-4 mb-6">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCat(c.id); setSelectedNewsletters([]); fetchNewslettersByCategory(c.id) }}
                    className={`px-4 py-2 rounded-full font-bold ${selectedCat === c.id ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-800 border'}`}>
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(selectedNewsletters.length ? selectedNewsletters : newslettersForCategory(selectedCat)).slice(0, 6).map((n: any) => (
                  <div key={n.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 flex gap-4 items-start">
                    <div className="w-24 flex-shrink-0">
                      <img src={n.coverImage?.formats?.small?.url || n.coverImage?.url} alt={n.title} className="w-full h-auto object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold mb-1">{n.title}</div>
                      <div className="text-sm text-slate-500 mb-3">{new Date(n.publishedAt).toLocaleDateString()}</div>
                      <div className="flex gap-3">
                        <button onClick={() => downloadPdf(n.pdfFile?.url, n.pdfFile?.name)} className="bg-slate-900 text-white px-4 py-2 rounded">Download PDF</button>
                        <a target="_blank" rel="noopener noreferrer" href={n.pdfFile?.url} className="inline-block border px-4 py-2 rounded">Open</a>
                      </div>
                    </div>
                  </div>
                ))}
                {!(selectedNewsletters.length) && newslettersForCategory(selectedCat).length === 0 && (
                  <div className="text-sm text-slate-500">No newsletters found for this month.</div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-100 dark:border-slate-800">
                <h5 className="text-xs font-extrabold text-primary mb-4 uppercase">About Newsletters</h5>
                <p className="text-sm text-slate-600">Our newsletters collect the most important market and project updates each month. Click a month to view recent issues.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Newsletter
