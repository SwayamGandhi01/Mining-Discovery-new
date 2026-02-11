import React, { useEffect, useState } from 'react'

interface Advertisement {
  id: number
  documentId: string
  title: string
  url_text: string
  ad_url: string
  home_image?: Array<{
    id: number
    url: string
    name: string
  }>
}

export default function RegionalIntelligence(): JSX.Element {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('https://admins.miningdiscovery.com/api/home-advertisments?populate=*')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        const ads = (data?.data || []).map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          title: item.title,
          url_text: item.url_text,
          ad_url: item.ad_url,
          home_image: item.home_image || [],
        }))
        setAds(ads)
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

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-12 lg:py-14">
      <div className="max-w-5xl mx-auto">
        <h3 className="serif-title text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8">Featured Advertisements</h3>

        {loading && <div className="text-sm text-slate-500">Loading advertisements...</div>}
        {error && <div className="text-sm text-red-500">Error loading advertisements</div>}

        {!loading && ads.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {ads.map((ad) => (
              <a
                key={ad.id}
                href={ad.ad_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 shadow-lg"
              >
                <div className="w-full aspect-[5/1] sm:aspect-[6/1] md:aspect-[7/1] lg:aspect-[8/1] bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                  {ad.home_image && ad.home_image.length > 0 ? (
                    <img
                      src={ad.home_image[0].url}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-xs sm:text-sm text-slate-400">No image</div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && ads.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500">No advertisements available</p>
          </div>
        )}
      </div>
    </section>
  )
}
