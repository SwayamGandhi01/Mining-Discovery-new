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
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Magazines</h2>

      {loading && <div className="text-sm text-slate-500">Loading magazines...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((m) => (
          <article key={m.id} className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col h-full">
              <div className="w-full h-56 overflow-hidden rounded bg-slate-100 flex items-center justify-center">
                {(() => {
                  const url =
                    m.coverImage?.formats?.large?.url ||
                    m.coverImage?.formats?.medium?.url ||
                    m.coverImage?.formats?.small?.url ||
                    m.coverImage?.url
                  if (url) {
                    return <img src={url} alt={m.Title || 'cover'} className="w-full h-full object-contain" />
                  }
                  return <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">No cover</div>
                })()}
              </div>

              <div className="mt-3 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg">{m.Title}</h3>
                <div className="text-xs text-slate-500 mt-1">{m.publishDate}</div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-4">{m.Description}</p>

                <div className="mt-4 flex gap-2">
                  {m.pdf?.url && (
                    <>
                      <a href={m.pdf.url} target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white px-3 py-1 rounded text-sm">Read PDF</a>
                      <button onClick={() => handleDownloadPdf(m.pdf?.url, m.pdf?.name)} className="border border-slate-300 px-3 py-1 rounded text-sm">Download</button>
                    </>
                  )}
                  {m.features && (
                    <details className="ml-auto text-sm text-slate-500">
                      <summary className="cursor-pointer">Features</summary>
                      <div className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{m.features}</div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
