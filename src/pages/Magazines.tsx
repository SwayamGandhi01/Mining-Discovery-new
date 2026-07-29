import React, { useEffect, useState } from 'react'
import { BookOpen, Download, Calendar, AlertCircle } from 'lucide-react'

type Magazine = {
  id: number
  Title?: string
  Description?: string
  publishDate?: string
  features?: string
  coverImage?: any
  pdf?: { url?: string; name?: string }
}

const navigate = (path: string) => {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

const CACHE_KEY = 'md_magazines_cache_v1'
const API_URL = 'https://admins.miningdiscovery.com/api/magazines?populate=*&sort=publishedAt:desc'

export default function Magazines(): JSX.Element {
  const [items, setItems] = useState<Magazine[]>(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) return JSON.parse(cached)
    } catch (e) {
      // Ignore cache parse error
    }
    return []
  })
  const [loading, setLoading] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem(CACHE_KEY)
    } catch (e) {
      return true
    }
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadMagazines() {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(`Server returned status ${res.status}`)
        const data = await res.json()
        if (!mounted) return

        const list = (data?.data || []).map((it: any) => ({
          id: it.id,
          Title: it.Title,
          Description: it.Description,
          publishDate: it.publishDate || it.publishedAt,
          features: it.features,
          coverImage: it.coverImage,
          pdf: it.pdf,
        }))

        // Sort newest first by publishDate
        list.sort((a: any, b: any) => {
          const ta = a.publishDate ? new Date(a.publishDate).getTime() : 0
          const tb = b.publishDate ? new Date(b.publishDate).getTime() : 0
          return tb - ta
        })

        setItems(list)
        setError(null)
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(list))
        } catch (e) {
          // Ignore cache write error
        }
      } catch (e: any) {
        if (!mounted) return
        if (items.length === 0) {
          setError(e.message || 'Failed to load magazines')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadMagazines()
    return () => {
      mounted = false
    }
  }, [])

  const handleOpenFlipbook = (magazineId: number) => {
    navigate(`/magazine-flipbook/${magazineId}`)
  }

  async function handleDownloadPdf(url: string | undefined, filename?: string) {
    if (!url) return
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename || 'magazine.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(blobUrl)
    } catch (e) {
      console.error('Download failed', e)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-[#1C2541] to-slate-900 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3B82F6]">
            PUBLICATIONS
          </span>
          <h1 className="serif-title text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
            Our Magazines
          </h1>
          <div className="w-16 h-1 bg-[#1E3B6E] mx-auto rounded-full mt-4" />
          <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed font-light">
            Explore our collection of in-depth mining industry magazines featuring exclusive insights, market analysis, and expert commentary.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {loading && items.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#1E3B6E] border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-slate-500 text-sm font-medium">Loading magazines...</span>
          </div>
        )}
        {error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
            <p className="text-sm text-red-500 font-semibold">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {items.map((m) => (
            <article
              key={m.id}
              onClick={() => handleOpenFlipbook(m.id)}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Cover Image */}
                <div className="w-full h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative p-3">
                  {(() => {
                    const url =
                      m.coverImage?.formats?.medium?.url ||
                      m.coverImage?.formats?.small?.url ||
                      m.coverImage?.formats?.large?.url ||
                      m.coverImage?.url
                    if (url) {
                      return (
                        <img
                          src={url}
                          alt={m.Title || 'cover'}
                          loading="lazy"
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg drop-shadow-md"
                        />
                      )
                    }
                    return (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-xs">No cover available</span>
                      </div>
                    )
                  })()}
                  {/* Date badge */}
                  {m.publishDate && (
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-[11px] font-semibold text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#3B82F6]" />
                      {m.publishDate}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col items-center text-center">
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-[#1E3B6E] dark:group-hover:text-[#3B82F6] transition-colors duration-300">
                    {m.Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-4 leading-relaxed">
                    {m.Description}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0 flex flex-col items-center w-full">
                {/* Action Buttons */}
                <div className="flex gap-2.5 justify-center w-full mt-2">
                  {m.pdf?.url && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenFlipbook(m.id)
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#1E3B6E] hover:bg-[#2563EB] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        Open flipbook
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadPdf(m.pdf?.url, m.pdf?.name)
                        }}
                        className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700 transition-all duration-200 whitespace-nowrap cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                        Download
                      </button>
                    </>
                  )}
                </div>

                {/* Features toggle */}
                {m.features && (
                  <details className="mt-4 w-full text-xs text-slate-500">
                    <summary className="cursor-pointer inline-flex items-center gap-1 hover:text-[#1E3B6E] transition-colors font-semibold">
                      Features
                    </summary>
                    <div className="mt-2.5 whitespace-pre-wrap text-xs text-slate-600 dark:text-slate-300 text-left bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50 leading-relaxed">
                      {m.features}
                    </div>
                  </details>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
