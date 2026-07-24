import React, { useEffect, useState } from 'react'

type Magazine = {
  id: number
  Title?: string
  Description?: string
  publishDate?: string
  features?: string
  coverImage?: any
  pdf?: { url?: string; name?: string }
}

export default function Magazines(): JSX.Element {
  const [items, setItems] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('https://admins.miningdiscovery.com/api/magazines?populate=*')
      .then((r) => r.json())
      .then((data) => {
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
        // sort newest first by publishDate (fallback to publishedAt when publishDate missing)
        list.sort((a: any, b: any) => {
          const ta = a.publishDate ? new Date(a.publishDate).getTime() : 0
          const tb = b.publishDate ? new Date(b.publishDate).getTime() : 0
          return tb - ta
        })
        setItems(list)
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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3B82F6]">
            PUBLICATIONS
          </span>
          <h1 className="serif-title text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
            Our Magazines
          </h1>
          <div className="w-16 h-1 bg-[#1E3B6E] mx-auto rounded-full mt-4" />
          <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Explore our collection of in-depth mining industry magazines featuring exclusive insights, market analysis, and expert commentary.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#1E3B6E] border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-slate-500 text-sm">Loading magazines...</span>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <span className="material-icons text-red-400 text-4xl">error_outline</span>
            <p className="text-sm text-red-500 mt-2">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {items.map((m) => (
            <article
              key={m.id}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Cover Image */}
              <div className="w-full h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative">
                {(() => {
                  const url =
                    m.coverImage?.formats?.large?.url ||
                    m.coverImage?.formats?.medium?.url ||
                    m.coverImage?.formats?.small?.url ||
                    m.coverImage?.url
                  if (url) {
                    return (
                      <img
                        src={url}
                        alt={m.Title || 'cover'}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    )
                  }
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <span className="material-icons text-5xl mb-2">menu_book</span>
                      <span className="text-sm">No cover available</span>
                    </div>
                  )
                })()}
                {/* Date badge */}
                {m.publishDate && (
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                    <span className="material-icons text-[11px] mr-1 align-middle">calendar_today</span>
                    {m.publishDate}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col items-center text-center">
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-[#1E3B6E] transition-colors duration-300">
                  {m.Title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-4 text-justify leading-relaxed">
                  {m.Description}
                </p>

                {/* Action Buttons */}
                <div className="mt-5 flex gap-3 justify-center flex-wrap w-full">
                  {m.pdf?.url && (
                    <>
                      <a
                        href={m.pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#1E3B6E] to-slate-900 hover:from-[#2563EB] hover:to-[#1E3B6E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <span className="material-icons text-sm">picture_as_pdf</span>
                        Read PDF
                      </a>
                      <button
                        onClick={() => handleDownloadPdf(m.pdf?.url, m.pdf?.name)}
                        className="inline-flex items-center gap-1.5 border-2 border-slate-200 dark:border-slate-700 hover:border-[#1E3B6E] text-slate-700 dark:text-slate-300 hover:text-[#1E3B6E] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      >
                        <span className="material-icons text-sm">download</span>
                        Download
                      </button>
                    </>
                  )}
                </div>

                {/* Features toggle */}
                {m.features && (
                  <details className="mt-4 w-full text-sm text-slate-500">
                    <summary className="cursor-pointer inline-flex items-center gap-1 hover:text-[#1E3B6E] transition-colors font-medium">
                      <span className="material-icons text-sm">auto_awesome</span>
                      Features
                    </summary>
                    <div className="mt-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300 text-justify bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700/50">
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
