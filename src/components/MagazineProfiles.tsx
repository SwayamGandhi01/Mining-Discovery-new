import React, { useEffect, useRef, useState } from 'react'

type CeoProfile = {
  id: number
  name: string
  designation: string
  shortDescription?: string
  ceo_image?: any
  ceo_pdf?: Array<{ url: string; name?: string }>
}

export default function MagazineProfiles(): JSX.Element {
  const [ceos, setCeos] = useState<CeoProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sliderRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('https://admins.miningdiscovery.com/api/ceo-profiles?populate=*')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        const items = data?.data || []
        const mapped: CeoProfile[] = items.map((it: any) => ({
          id: it.id,
          name: it.name,
          designation: it.designation,
          shortDescription: it.shortDescription,
          ceo_image: it.ceo_image,
          ceo_pdf: it.ceo_pdf,
        }))
        setCeos(mapped)
        setLoading(false)
      })
      .catch((e) => {
        if (!mounted) return
        setError(String(e))
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  function scrollBy(amount: number) {
    const el = sliderRef.current
    if (!el) return
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  async function handleDownloadPdf(url: string | undefined, filename?: string) {
    if (!url) return
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename || 'file.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(blobUrl)
    } catch (e) {
      console.error('Download failed', e)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-extrabold text-primary uppercase">Ceo-Profiles</h4>
        <div className="flex gap-2">
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy(-300)}
            className="p-2 bg-slate-100 rounded border hover:bg-slate-200"
          >
            ‹
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy(300)}
            className="p-2 bg-slate-100 rounded border hover:bg-slate-200"
          >
            ›
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-slate-500">Loading profiles...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      <div
        ref={sliderRef}
        className="relative overflow-x-auto -mx-4 px-4 py-2 snap-x snap-mandatory scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-6 items-stretch">
          {ceos.map((c) => (
            <article
              key={c.id}
              className="flex-none w-[80%] sm:w-80 md:w-96 lg:w-80 xl:w-96 bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-800 snap-start"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  {c.ceo_image?.formats?.thumbnail?.url ? (
                    <img src={c.ceo_image.formats.thumbnail.url} alt={c.name} className="w-full h-full object-cover" />
                  ) : c.ceo_image?.url ? (
                    <img src={c.ceo_image.url} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.designation}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-4">{c.shortDescription}</p>
                  <div className="mt-3 flex gap-2">
                    {c.ceo_pdf?.[0]?.url && (
                      <>
                        <button onClick={() => handleDownloadPdf(c.ceo_pdf?.[0]?.url, c.ceo_pdf?.[0]?.name)} className="bg-slate-900 text-white px-3 py-1 rounded text-sm">Download</button>
                        <a target="_blank" rel="noopener noreferrer" href={c.ceo_pdf?.[0]?.url} className="border border-slate-300 px-3 py-1 rounded text-sm">Open</a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
