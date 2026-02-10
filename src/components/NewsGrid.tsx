import React, { useEffect, useRef, useState } from 'react'

type Category = {
  id: number
  category: string
  slug: string
}

type SectionItem = any

const CATEGORIES_API = 'https://admins.miningdiscovery.com/api/news-categories'
const SECTIONS_API = 'https://admins.miningdiscovery.com/api/news-sections'

const NewsGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [sections, setSections] = useState<SectionItem[] | null>(null)
  const tabsRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [latestMag, setLatestMag] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const [catsRes, secsRes] = await Promise.all([
          fetch(CATEGORIES_API),
          fetch(SECTIONS_API),
        ])
        if (!catsRes.ok || !secsRes.ok) throw new Error('Failed to fetch')
        const catsJson = await catsRes.json()
        const secsJson = await secsRes.json()
        // fetch latest magazines for right column card
        try {
          const magRes = await fetch('https://admins.miningdiscovery.com/api/magazines?populate=*')
          if (magRes.ok) {
            const magJson = await magRes.json()
            const mags = magJson?.data || []
            if (mags.length) {
              const sortedMags = mags.sort((a: any, b: any) => {
                const da = a.publishDate || a.publishedAt || ''
                const db = b.publishDate || b.publishedAt || ''
                return new Date(db).getTime() - new Date(da).getTime()
              })
              setLatestMag(sortedMags[0])
            }
          }
        } catch (e) {
          // ignore magazine fetch errors; keep latestMag null
        }
        const catData: Category[] = catsJson?.data || []
        const secData: SectionItem[] = secsJson?.data || secsJson || []
        if (!mounted) return
        setCategories(catData)
        setSections(secData)
        setActive(catData?.[0]?.slug ?? null)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Fetch error')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  function itemsForCategory(slug: string) {
    if (!sections) return []
    // try to match by slug or category name
    const lower = slug.toLowerCase()
    return sections.filter((s: any) => {
      const sSlug = (s.slug || '').toString().toLowerCase()
      const sCategory = (s.category || s.category_name || '').toString().toLowerCase()
      const sTitle = (s.title || s.name || '').toString().toLowerCase()
      return sSlug.includes(lower) || sCategory.includes(lower) || sTitle.includes(lower)
    })
  }

  if (loading) return <div className="py-12 text-center">Loading...</div>
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>

  const tabs = categories && categories.length ? categories : [{ id: 0, category: 'Latest', slug: 'latest-news' }]

    return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-12">
      <div className="lg:col-span-3">
        <div className="relative mb-8">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide border-b border-slate-100 dark:border-slate-800 pb-px" ref={tabsRef => { /* placeholder for ref assignment below */ }}>
            {/* placeholder - replaced by proper ref below */}
          </div>
          <div className="relative">
            <div ref={tabsRef as any} className="flex items-center gap-6 overflow-x-auto scrollbar-hide border-b border-slate-100 dark:border-slate-800 pb-px">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActive(t.slug)}
                  className={`text-sm font-bold pb-4 ${active === t.slug ? 'border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent hover:border-slate-300'}`}>
                  {t.category.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const el = tabsRef as unknown as React.RefObject<HTMLDivElement>
                if (el && el.current) el.current.scrollBy({ left: -300, behavior: 'smooth' })
              }}
              aria-label="Scroll categories left"
              className="absolute left-0 top-0 mt-1 -ml-6 p-2 rounded-full bg-white shadow-sm hidden md:inline-flex">
              <span className="material-icons text-sm">chevron_left</span>
            </button>

            <button
              onClick={() => {
                const el = tabsRef as unknown as React.RefObject<HTMLDivElement>
                if (el && el.current) el.current.scrollBy({ left: 300, behavior: 'smooth' })
              }}
              aria-label="Scroll categories right"
              className="absolute right-0 top-0 mt-1 -mr-6 p-2 rounded-full bg-white shadow-sm hidden md:inline-flex">
              <span className="material-icons text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {active && itemsForCategory(active).length > 0 ? (
            itemsForCategory(active).slice(0, 4).map((item: any, idx: number) => (
              <article key={idx} className="group">
                <div className="aspect-video bg-slate-200 overflow-hidden mb-4 rounded-lg">
                  {item.image ? (
                    // image may be nested; try common fields
                    <img alt={item.title || item.name || 'image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={item.image || item.thumbnail || item.cover_image} />
                  ) : (
                    <div className="w-full h-full bg-slate-300" />
                  )}
                </div>
                <h4 className="serif-title text-2xl mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer">{item.title || item.name || item.heading || 'Untitled'}</h4>
                <p className="text-sm text-slate-500 mb-4">{item.excerpt || item.summary || item.description || ''}</p>
                {item.read_time && <span className="text-[10px] font-bold text-slate-400 uppercase">{item.read_time}</span>}
              </article>
            ))
          ) : (
            // fallback static content when API returns no matching items
            <>
              <article className="group">
                <div className="aspect-video bg-slate-200 overflow-hidden mb-4 rounded-lg">
                  <img alt="Mining operations landscape" className="w-full h-full object-cover group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_kIBfKbOnVpzW1l9R4lLHGPA14JMr3T2kQPjtlosD8HXDz40vMmNVHzhfBSu8PWRjDwIwbMH89U-59cHMwqU8Tyo5wfT9Mvj-7Bthpb_5IlAyslt1DUwCi0mBxnQLL2N7iJ6BNCnmXLAl6zbt6uWGOOEcn1nzRjqZs9nvP5vPUSBASh7O5c3DkETrhqfPBFqlBJc9TnHGfL_qz9BNfyJpBwhE-DFpxNp65qjNraXLGBX3roZ32RdI5zHPG4YFe0E4_dZd6NoI2K6I"/>
                </div>
                <h4 className="serif-title text-2xl mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer">Yorkshire Potash Project Secures Final Round of Environmental Clearances</h4>
                <p className="text-sm text-slate-500 mb-4">The long-awaited project is set to begin full-scale construction in Q3 2024, promising over 2,000 regional jobs.</p>
                <span className="text-[10px] font-bold text-slate-400 uppercase">14 Min Read</span>
              </article>
              <article className="group">
                <div className="aspect-video bg-slate-200 overflow-hidden mb-4 rounded-lg">
                  <img alt="Steel and minerals" className="w-full h-full object-cover group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXV5gwI1Xej7QQ6g81JiHucNas_dU-ik2MPs4ZfZAvcvzzIpapyidycI-gJq9n0f-uGMxKN5KMUSdpV96LTWBEp6EUmFpP9-RLs5EJofpP_W-DfzexmV53sVa11hURYPV1aL71SM-RS2ZyoM-cGjYCLBxqjF5jPSv2P3792MZInMI1e0K7wTC7IA-GBoeqJxqBjD_gV49H2kTZphiUPj9FEmVcOuNNjYA5OY188BWbaxLY-mP0mhksCNjPB0gqYpsH4EiOTnagbNuO"/>
                </div>
                <h4 className="serif-title text-2xl mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer">Cornwall Lithium Hits Critical Purity Milestones in Pilot Testing</h4>
                <p className="text-sm text-slate-500 mb-4">New direct lithium extraction tech shows promise for domestic EV battery supply chains in the UK.</p>
                <span className="text-[10px] font-bold text-slate-400 uppercase">8 Min Read</span>
              </article>
            </>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl text-center">
          <h5 className="text-xs font-extrabold text-primary mb-6 uppercase tracking-[0.2em]">Latest Magazine</h5>
          {latestMag ? (
            <>
              <div className="relative inline-block group cursor-pointer mb-6">
                <div className="absolute inset-0 bg-primary/20 -translate-x-2 translate-y-2 rounded shadow-xl group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
                <img
                  alt={latestMag?.coverImage?.alternativeText || latestMag?.Title || 'Magazine Cover'}
                  className="relative w-auto h-48 object-contain rounded shadow-2xl transition-transform group-hover:scale-[1.02] mx-auto"
                  src={latestMag?.coverImage?.formats?.medium?.url || latestMag?.coverImage?.formats?.small?.url || latestMag?.coverImage?.url}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white rounded">
                  <span className="material-icons text-4xl">chrome_reader_mode</span>
                </div>
              </div>
              <p className="font-bold serif-title text-xl mb-2">{latestMag.Title}</p>
              <p className="text-sm text-slate-400 mb-6 px-4">{(latestMag.Description || '').slice(0, 120)}</p>
              <button onClick={async () => {
                const url = latestMag?.pdf?.url
                if (!url) return
                try {
                  const res = await fetch(url)
                  const blob = await res.blob()
                  const blobUrl = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = blobUrl
                  a.download = latestMag.pdf?.name || 'magazine.pdf'
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  URL.revokeObjectURL(blobUrl)
                } catch (e) {
                  console.error('Download failed', e)
                }
              }} className="w-full bg-slate-900 dark:bg-primary py-3 rounded text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-primary/90 transition-colors">Download PDF</button>
              <a className="inline-block mt-4 text-[10px] font-bold uppercase hover:text-primary" href={latestMag.pdf?.url} target="_blank" rel="noopener noreferrer">Order Print Copy</a>
            </>
          ) : (
            <>
              <div className="relative inline-block group cursor-pointer mb-6">
                <div className="absolute inset-0 bg-primary/20 -translate-x-2 translate-y-2 rounded shadow-xl group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
                <img alt="Magazine Cover" className="relative w-auto h-48 object-contain rounded shadow-2xl transition-transform group-hover:scale-[1.02] mx-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3KN0aRSDOlR6SMM6PnsGmPIuC8SZ6Xo-SEz-ZZwudiGryXA2CZgQqudyZp4pjDUETPLNCHb16xzDrwsJLFcWC2tt2AEBYNnRYRXZNx15EKnRFr8fTz8hzvsSdfEXVAZvAMftnI6wROTg8ixP4GPqIgKYMQg8mXt_19_sAydlRar4I66xywDPaifL7G5ry0CTcVRyn_k9f5yUbuMP6MRh717b7qi28AfqolxPY0qBiq_UoKIYzhs3pz6bTAu6SNAsXLhk7-vfdA1I"/>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white rounded">
                  <span className="material-icons text-4xl">chrome_reader_mode</span>
                </div>
              </div>
              <p className="font-bold serif-title text-xl mb-2">Winter 2024 Issue</p>
              <p className="text-sm text-slate-400 mb-6 px-4">The Future of Automation: Robots in the Deep Mines</p>
              <button className="w-full bg-slate-900 dark:bg-primary py-3 rounded text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-primary/90 transition-colors">Download PDF</button>
              <a className="inline-block mt-4 text-[10px] font-bold uppercase hover:text-primary" href="#">Order Print Copy</a>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewsGrid
