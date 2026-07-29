import React, { useEffect, useState } from 'react'
import { cachedFetch } from '../utils/cachedFetch'
import FlipbookViewer from '../components/FlipbookViewer'

const API_URL = 'https://admins.miningdiscovery.com/api/magazines?populate=*&sort=publishedAt:desc'
const BASE_URL = 'https://admins.miningdiscovery.com'

type Magazine = {
  id: number
  Title?: string
  Description?: string
  publishDate?: string
  coverImage?: any
  pdf?: { url?: string; name?: string }
}

type MagazineFlipbookProps = {
  magazineId: string
  onBack: () => void
}

const getCoverImageUrl = (item: Magazine): string | null => {
  const url =
    item.coverImage?.formats?.medium?.url ||
    item.coverImage?.formats?.small?.url ||
    item.coverImage?.formats?.large?.url ||
    item.coverImage?.url

  if (!url) return null
  return url.startsWith('http') ? url : `${BASE_URL}${url}`
}

const getPdfUrl = (item: Magazine): string | null => {
  const candidate = item.pdf?.url
  if (!candidate) return null
  return candidate.startsWith('http') ? candidate : `${BASE_URL}${candidate}`
}

export default function MagazineFlipbook({ magazineId, onBack }: MagazineFlipbookProps): JSX.Element {
  const [magazine, setMagazine] = useState<Magazine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchMagazine = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await cachedFetch(API_URL, {
          onUpdate: (fresh: any) => {
            if (!mounted) return
            const found = (fresh?.data || []).find((item: any) => String(item.id) === String(magazineId))
            if (found) {
              setMagazine({
                id: found.id,
                Title: found.Title,
                Description: found.Description,
                publishDate: found.publishDate || found.publishedAt,
                coverImage: found.coverImage,
                pdf: found.pdf,
              })
            }
          },
        })

        if (!mounted) return
        const found = (data?.data || []).find((item: any) => String(item.id) === String(magazineId))
        if (found) {
          setMagazine({
            id: found.id,
            Title: found.Title,
            Description: found.Description,
            publishDate: found.publishDate || found.publishedAt,
            coverImage: found.coverImage,
            pdf: found.pdf,
          })
        } else {
          setError('Magazine not found.')
        }
      } catch (err: any) {
        if (!mounted) return
        setError('Unable to load magazine at the moment.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchMagazine()
    return () => {
      mounted = false
    }
  }, [magazineId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-slate-700">
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-4 border-[#1E3B6E] border-t-transparent" />
          <span className="text-sm">Opening magazine…</span>
        </div>
      </div>
    )
  }

  if (error || !magazine) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center text-slate-700">
        <div className="max-w-md rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-xl font-semibold text-slate-900">Unable to open magazine</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">{error || 'The magazine could not be found.'}</p>
          <button
            onClick={onBack}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1E3B6E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
          >
            Back to magazines
          </button>
        </div>
      </div>
    )
  }

  return (
    <FlipbookViewer
      title={magazine.Title || 'Magazine'}
      subtitle={magazine.publishDate || undefined}
      pdfUrl={getPdfUrl(magazine)}
      coverImageUrl={getCoverImageUrl(magazine)}
      description={magazine.Description || undefined}
      onBack={onBack}
    />
  )
}
