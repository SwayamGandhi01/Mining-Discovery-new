import React, { useEffect, useState } from 'react'
import { cachedFetch } from '../utils/cachedFetch'
import FlipbookViewer from '../components/FlipbookViewer'
import FlipbookSkeleton from '../components/skeletons/FlipbookSkeleton'

// Same endpoint the Company Profiles listing uses, so the SWR cache is usually already warm.
const API_URL = 'https://admins.miningdiscovery.com/api/company-profiles?populate=*'
const BASE_URL = 'https://admins.miningdiscovery.com'

type CompanyProfile = {
  id: number
  documentId?: string
  title?: string
  shortDescription?: string
  publishedAt?: string
  companyPdf?: { url?: string; name?: string }[]
  cover_image?: { url?: string; formats?: any }[]
}

type CompanyProfileFlipbookProps = {
  profileId: string
  onBack: () => void
}

const absoluteUrl = (url?: string | null): string | null => {
  if (!url) return null
  return url.startsWith('http') ? url : `${BASE_URL}${url}`
}

const getCoverImageUrl = (item: CompanyProfile): string | null => {
  const cover = item.cover_image?.[0]
  return absoluteUrl(
    cover?.formats?.medium?.url || cover?.formats?.small?.url || cover?.formats?.large?.url || cover?.url
  )
}

const getPdfUrl = (item: CompanyProfile): string | null => absoluteUrl(item.companyPdf?.[0]?.url)

const mapProfile = (raw: any): CompanyProfile => ({
  id: raw.id,
  documentId: raw.documentId,
  title: raw.title,
  shortDescription: raw.shortDescription,
  publishedAt: raw.publishedAt,
  companyPdf: raw.companyPdf || [],
  cover_image: raw.cover_image || [],
})

// Cards link by documentId, but tolerate a numeric id in the URL too.
const findProfile = (data: any, profileId: string): CompanyProfile | null => {
  const found = (data?.data || []).find(
    (item: any) => String(item.documentId) === String(profileId) || String(item.id) === String(profileId)
  )
  return found ? mapProfile(found) : null
}

export default function CompanyProfileFlipbook({
  profileId,
  onBack,
}: CompanyProfileFlipbookProps): JSX.Element {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchProfile = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await cachedFetch(API_URL, {
          onUpdate: (fresh: any) => {
            if (!mounted) return
            const refreshed = findProfile(fresh, profileId)
            if (refreshed) setProfile(refreshed)
          },
        })

        if (!mounted) return

        const found = findProfile(data, profileId)
        if (found) {
          setProfile(found)
        } else {
          setError('Company profile not found.')
        }
      } catch (err) {
        if (!mounted) return
        setError('Unable to load this company profile at the moment.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchProfile()
    return () => {
      mounted = false
    }
  }, [profileId])

  if (loading) return <FlipbookSkeleton label="Opening company profile" />

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center text-slate-700">
        <div className="max-w-md rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-xl font-semibold text-slate-900">Unable to open company profile</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {error || 'The company profile could not be found.'}
          </p>
          <button
            onClick={onBack}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1E3B6E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
          >
            Back to company profiles
          </button>
        </div>
      </div>
    )
  }

  return (
    <FlipbookViewer
      title={profile.title || 'Company Profile'}
      subtitle={profile.publishedAt ? new Date(profile.publishedAt).toLocaleDateString() : undefined}
      pdfUrl={getPdfUrl(profile)}
      coverImageUrl={getCoverImageUrl(profile)}
      description={profile.shortDescription || undefined}
      onBack={onBack}
    />
  )
}
