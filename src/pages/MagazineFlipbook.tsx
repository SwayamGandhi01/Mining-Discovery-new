import React, { useEffect, useState } from 'react'
import { cms, pickImage, CMS_URL, resolveMediaUrl } from '../api/cms'
import FlipbookViewer from '../components/FlipbookViewer'
import FlipbookSkeleton from '../components/skeletons/FlipbookSkeleton'

const BASE_URL = CMS_URL

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
  // The download card shows the cover ~170px wide.
  const url = pickImage(item.coverImage, 300)?.url
  if (!url) return null
  return resolveMediaUrl(url)
}

const getPdfUrl = (item: Magazine): string | null => {
  const candidate = item.pdf?.url
  if (!candidate) return null
  return resolveMediaUrl(candidate)
}

const toMagazine = (found: any): Magazine => ({
  id: found.id,
  Title: found.Title,
  Description: found.Description,
  publishDate: found.publishDate || found.publishedAt,
  coverImage: found.coverImage,
  pdf: found.pdf,
})

const findMagazine = (json: any, magazineId: string): Magazine | null => {
  const found = (json?.data || []).find((item: any) => String(item.id) === String(magazineId))
  return found ? toMagazine(found) : null
}

export default function MagazineFlipbook({ magazineId, onBack }: MagazineFlipbookProps): JSX.Element {
  const [magazine, setMagazine] = useState<Magazine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchMagazine = async () => {
      // Opened from the Magazines page, the magazine is already in the cached
      // list; otherwise fetch just this one.
      const listed = findMagazine(cms.magazines.peek(), magazineId)
      if (listed) {
        setMagazine(listed)
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      // Magazine links use the numeric id; anything else can't match one.
      if (!/^\d+$/.test(magazineId)) {
        setError('Magazine not found.')
        setLoading(false)
        return
      }

      try {
        const data = await cms.magazine(magazineId).fetch((fresh: any) => {
          if (!mounted) return
          const found = findMagazine(fresh, magazineId)
          if (found) setMagazine(found)
        })

        if (!mounted) return
        const found = findMagazine(data, magazineId)
        if (found) {
          setMagazine(found)
        } else {
          setError('Magazine not found.')
        }
      } catch (err: any) {
        if (!mounted) return
        setError('Unable to load magazine at the moment.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchMagazine()
    return () => {
      mounted = false
    }
  }, [magazineId])

  if (loading) return <FlipbookSkeleton label="Opening magazine" />

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
