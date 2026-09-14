import React, { useEffect, useRef, useState } from 'react'
import { BookOpen, Download } from 'lucide-react'
import { cachedFetch } from '../utils/cachedFetch'
import { prefetchPdf, warmFlipbookRuntime } from '../utils/flipbookPrefetch'

// Company profile PDFs are large (10–22 MB), so we start fetching on intent
// rather than on click. This much sustained hover counts as intent.
const PREFETCH_INTENT_MS = 180

const navigate = (path: string) => {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

interface PdfFile {
  id: number
  name: string
  url: string
}

interface CoverImage {
  id: number
  url: string
  formats?: {
    small?: { url: string }
    medium?: { url: string }
  }
}

interface CompanyProfile {
  id: number
  documentId: string
  title: string
  shortDescription: string
  createdAt: string
  publishedAt: string
  companyPdf: PdfFile[]
  cover_image: CoverImage[]
}

const COMPANY_PROFILES_URL = 'https://admins.miningdiscovery.com/api/company-profiles?populate=*'

const mapCompanyItem = (item: any): CompanyProfile => ({
  id: item.id,
  documentId: item.documentId,
  title: item.title,
  shortDescription: item.shortDescription,
  createdAt: item.createdAt,
  publishedAt: item.publishedAt,
  companyPdf: item.companyPdf || [],
  cover_image: item.cover_image || [],
})

export default function CompanyProfiles(): JSX.Element {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadProfiles() {
      try {
        setLoading(true)
        const json = await cachedFetch(COMPANY_PROFILES_URL, {
          onUpdate: (fresh: any) => {
            if (!mounted) return
            setProfiles((fresh?.data || []).map(mapCompanyItem))
          },
        })
        if (!mounted) return

        setProfiles((json?.data || []).map(mapCompanyItem))
        setError(null)
      } catch (e) {
        if (!mounted) return
        setError(e instanceof Error ? e.message : 'Error loading profiles')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProfiles()
    return () => {
      mounted = false
    }
  }, [])

  const intentTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (intentTimer.current !== null) window.clearTimeout(intentTimer.current)
  }, [])

  // Hovering/touching a card warms the viewer chunk immediately and the PDF
  // once the hover looks deliberate, so the click itself has little left to do.
  const handleIntentStart = (pdfUrl?: string) => {
    if (!pdfUrl) return
    warmFlipbookRuntime()

    if (intentTimer.current !== null) window.clearTimeout(intentTimer.current)
    intentTimer.current = window.setTimeout(() => prefetchPdf(pdfUrl), PREFETCH_INTENT_MS)
  }

  const handleIntentEnd = () => {
    if (intentTimer.current !== null) {
      window.clearTimeout(intentTimer.current)
      intentTimer.current = null
    }
  }

  const openFlipbook = (profile: CompanyProfile) => {
    navigate(`/company-flipbook/${profile.documentId || profile.id}`)
  }

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

  const visibleProfiles = profiles.filter((profile) => {
    const normalizedTitle = profile.title.toLowerCase()
    return !normalizedTitle.includes('u.s. gold corp') && !normalizedTitle.includes('us gold corp')
  })

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
        {visibleProfiles.map((profile) => {
          const pdfUrl = profile.companyPdf?.[0]?.url
          const pdfName = profile.companyPdf?.[0]?.name
          const coverImageUrl = profile.cover_image?.[0]?.formats?.medium?.url || profile.cover_image?.[0]?.url

          return (
            <article
              key={profile.id}
              onClick={pdfUrl ? () => openFlipbook(profile) : undefined}
              onPointerEnter={() => handleIntentStart(pdfUrl)}
              onPointerLeave={handleIntentEnd}
              className={`bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-800 transition-shadow duration-300 group ${
                pdfUrl ? 'cursor-pointer hover:shadow-xl' : ''
              }`}
            >
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
                  <div className="mt-4 flex gap-2.5">
                    {pdfUrl && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openFlipbook(profile)
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#1E3B6E] hover:bg-[#2563EB] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                          <BookOpen className="w-4 h-4 flex-shrink-0" />
                          Open flipbook
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadPdf(pdfUrl, pdfName || 'profile.pdf')
                          }}
                          className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700 transition-all duration-200 whitespace-nowrap"
                        >
                          <Download className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
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
