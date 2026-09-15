import React, { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cms } from '../api/cms'
import { Skeleton, SkeletonRegion } from './ui/Skeleton'
import LazyImage from './ui/LazyImage'

interface AdvertisementItem {
  id: number
  documentId?: string
  alt_text?: string
  title?: string
  ad_url?: string
  vertical_banner?: boolean | null
  ads_image?: {
    id?: number
    url?: string
    name?: string
    formats?: {
      large?: { url: string }
      medium?: { url: string }
      small?: { url: string }
      thumbnail?: { url: string }
    }
  }
  image?: any
  banner?: any
  cover?: any
  home_image?: any
  media?: any
  file?: any
}

type ImageSource = { url: string; width?: number; height?: number }

const BASE_URL = 'https://admins.miningdiscovery.com'

const asImage = (candidate: any): ImageSource | null =>
  candidate?.url ? { url: candidate.url, width: candidate.width, height: candidate.height } : null

// Largest available format first. Its dimensions travel with the URL so the
// banner can reserve its height before the file arrives.
const pickFormat = (img: any): ImageSource | null =>
  asImage([img?.formats?.large, img?.formats?.medium, img?.formats?.small, img].find((c) => c?.url))

export default function RegionalIntelligence(): JSX.Element {
  const [ads, setAds] = useState<AdvertisementItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    // The request already excludes vertical banners; the filter below stays as a guard.
    cms.advertisements
      .fetch((fresh: any) => {
        if (!mounted) return
        setAds(fresh?.data || [])
      })
      .then((data) => {
        if (!mounted) return
        setAds(data?.data || [])
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

  const getImage = (item: AdvertisementItem): ImageSource | null => {
    let image = pickFormat(item.ads_image)

    if (!image) {
      const candidate =
        item.image || item.banner || item.cover || item.media || item.file
      if (Array.isArray(item.home_image) && item.home_image.length > 0) {
        image = asImage(item.home_image[0])
      } else if (Array.isArray(candidate) && candidate.length > 0) {
        image = asImage(candidate[0])
      } else if (candidate) {
        image = pickFormat(candidate)
      }
    }

    if (!image) return null
    return image.url.startsWith('http') ? image : { ...image, url: `${BASE_URL}${image.url}` }
  }

  // Filter strictly for horizontal banners (vertical_banner !== true) with valid image URLs
  const horizontalAds = ads
    .filter((ad) => ad.vertical_banner !== true)
    .filter((ad) => Boolean(getImage(ad)))

  // Auto-scroll effect: advances every 3.5 seconds unless user hovers
  useEffect(() => {
    if (horizontalAds.length <= 1 || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % horizontalAds.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [horizontalAds.length, isHovered])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? horizontalAds.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % horizontalAds.length)
  }

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h3 className="serif-title text-xl sm:text-2xl md:text-3xl font-bold">
            Featured Advertisements
          </h3>
          {horizontalAds.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous advertisement"
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next advertisement"
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {loading && (
          <SkeletonRegion
            label="Loading advertisements"
            className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900"
          >
            <div className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2">
              {/* The horizontal banners are wide ~8:1 strips. */}
              <Skeleton className="w-full aspect-[8/1] rounded-xl" />
            </div>
          </SkeletonRegion>
        )}
        {error && <div className="text-sm text-red-500 py-6">Error loading advertisements</div>}

        {!loading && horizontalAds.length > 0 && (
          <div
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Auto-scroll banner track */}
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {horizontalAds.map((ad) => {
                const image = getImage(ad)!
                const alt = ad.alt_text || ad.title || 'Advertisement'
                const href = ad.ad_url || '#'

                return (
                  <a
                    key={ad.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex-shrink-0 block"
                  >
                    <div className="relative w-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-1 sm:p-2">
                      {/* Eager: slides sit off to the side in a clipped track, where
                          lazy loading would hold each one back until it slides in. */}
                      <LazyImage
                        loading="eager"
                        src={image.url}
                        width={image.width}
                        height={image.height}
                        alt={alt}
                        className="w-full h-auto max-h-48 sm:max-h-60 md:max-h-72 object-contain hover:scale-[1.01] transition-transform duration-300 rounded-xl"
                        skeletonClassName="inset-1 sm:inset-2 rounded-xl"
                      />
                    </div>
                  </a>
                )
              })}
            </div>

            {/* Navigation Dots */}
            {horizontalAds.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-auto">
                {horizontalAds.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? 'w-6 bg-primary'
                        : 'w-2 bg-slate-400/60 dark:bg-slate-600/60 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && horizontalAds.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500">No horizontal advertisements available</p>
          </div>
        )}
      </div>
    </section>
  )
}
