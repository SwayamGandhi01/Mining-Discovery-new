import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react'

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 3

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

  function handlePrevious() {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  function handleNext() {
    setCurrentIndex((prev) =>
      Math.min(Math.max(0, ceos.length - itemsPerView), prev + 1)
    )
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

  const visibleProfiles = ceos.slice(currentIndex, currentIndex + itemsPerView)
  const maxIndex = Math.max(0, ceos.length - itemsPerView)

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold" style={{color: '#ae8a4c'}}>CEO-PROFILES</h2>
        
        {/* Navigation Arrows */}
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous profiles"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next profiles"
          >
            <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">Loading CEO profiles...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-12">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {visibleProfiles.map((c) => (
              <article
                key={c.id}
                className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-800"
              >
                {/* Profile Image Container */}
                <div className="relative w-full h-64 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                  {c.ceo_image?.formats?.large?.url ? (
                    <img
                      src={c.ceo_image.formats.large.url}
                      alt={c.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : c.ceo_image?.url ? (
                    <img
                      src={c.ceo_image.url}
                      alt={c.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
                      No image available
                    </div>
                  )}
                </div>

                {/* Profile Content */}
                <div className="p-5 flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                      {c.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">
                      {c.designation}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {c.shortDescription}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
                    {c.ceo_pdf?.[0]?.url ? (
                      <>
                        <button
                          onClick={() => handleDownloadPdf(c.ceo_pdf?.[0]?.url, c.ceo_pdf?.[0]?.name)}
                          className="flex items-center gap-2 flex-1 justify-center bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <a
                          href={c.ceo_pdf?.[0]?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 flex-1 justify-center border-2 border-slate-900 dark:border-slate-300 text-slate-900 dark:text-slate-300 px-4 py-2 rounded font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open
                        </a>
                      </>
                    ) : (
                      <div className="w-full text-center py-2 text-xs text-slate-500">
                        No profile available
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Progress Bar Indicator */}
          {ceos.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-400 transition-all duration-300"
                  style={{
                    width: `${maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, ceos.length)} of {ceos.length}
              </span>
            </div>
          )}

          {/* No Profiles Message */}
          {ceos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500">
                No CEO profiles available at the moment.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  )
}
