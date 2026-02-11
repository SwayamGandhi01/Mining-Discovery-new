import React, { useEffect, useState } from 'react'

interface CompanyProfile {
  id: number
  documentId: string
  title: string
  shortDescription: string
  createdAt: string
  publishedAt: string
  companyPdf?: Array<{
    id: number
    url: string
    name: string
  }>
  cover_image?: Array<{
    id: number
    url: string
    formats?: {
      small?: { url: string }
      medium?: { url: string }
    }
  }>
}

export default function CompanyProfiles(): JSX.Element {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadProfiles() {
      try {
        setLoading(true)
        const res = await fetch('https://admins.miningdiscovery.com/api/company-profiles?populate=*')
        if (!res.ok) throw new Error('Failed to fetch company profiles')
        const json = await res.json()
        if (!mounted) return

        const data: CompanyProfile[] = (json?.data || []).map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          title: item.title,
          shortDescription: item.shortDescription,
          createdAt: item.createdAt,
          publishedAt: item.publishedAt,
          companyPdf: item.companyPdf || [],
          cover_image: item.cover_image || [],
        }))

        setProfiles(data)
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error loading profiles')
      } finally {
        setLoading(false)
      }
    }

    loadProfiles()
    return () => {
      mounted = false
    }
  }, [])

  const downloadPdf = async (url: string, filename: string) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(blobUrl)
    } catch (e) {
      console.error('Download failed', e)
    }
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Company Profiles</h2>
        <div className="text-sm text-slate-500">Loading company profiles...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Company Profiles</h2>
        <div className="text-sm text-red-500">{error}</div>
      </main>
    )
  }

  if (profiles.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Company Profiles</h2>
        <div className="text-sm text-slate-500">No company profiles available.</div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Company Profiles</h2>

      {loading && <div className="text-sm text-slate-500">Loading company profiles...</div>}

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => {
          const pdfUrl = profile.companyPdf?.[0]?.url
          const pdfName = profile.companyPdf?.[0]?.name
          const coverImageUrl = profile.cover_image?.[0]?.formats?.medium?.url || profile.cover_image?.[0]?.url

          return (
            <article key={profile.id} className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col h-full">
                {/* Cover Image */}
                <div className="w-full h-56 overflow-hidden rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {coverImageUrl ? (
                    <img
                      src={coverImageUrl}
                      alt={profile.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">No cover</div>
                  )}
                </div>

                {/* Content */}
                <div className="mt-3 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg">{profile.title}</h3>
                  <div className="text-xs text-slate-500 mt-1">{new Date(profile.publishedAt).toLocaleDateString()}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-4">{profile.shortDescription}</p>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    {pdfUrl && (
                      <>
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-900 dark:bg-slate-700 text-white px-3 py-1 rounded text-sm hover:bg-slate-800 transition-colors"
                        >
                          Read PDF
                        </a>
                        <button
                          onClick={() => downloadPdf(pdfUrl, pdfName || 'profile.pdf')}
                          className="border border-slate-300 dark:border-slate-600 px-3 py-1 rounded text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          Download
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
