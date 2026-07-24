import React, { useEffect, useState } from 'react'

interface Pick {
  id: number
  documentId: string
  title: string
  short_description?: string
  image?: {
    url?: string
    formats?: {
      medium?: {
        url?: string
      }
    }
  }
  publishedAt?: string
}

export default function EditorsPicks(): JSX.Element {
  const [picks, setPicks] = useState<Pick[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          'https://admins.miningdiscovery.com/api/news-sections?filters[news_categories][slug][$eq]=announcement&sort=publishedAt:desc&populate=*'
        )
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        
        // Get the latest 3 announcements
        const latestPicks = data.data.slice(0, 3)
        setPicks(latestPicks)
        setError(null)
      } catch (err) {
        console.error('Error fetching editor picks:', err)
        setError('Failed to load editor picks')
        setPicks([])
      } finally {
        setLoading(false)
      }
    }

    fetchPicks()
  }, [])

  const openArticle = (documentId: string) => {
    window.location.hash = `#/article/${documentId}`
  }

  const getImageUrl = (pick: Pick): string => {
    return pick.image?.formats?.medium?.url || pick.image?.url || ''
  }

  return (
    <section className="my-12 sm:my-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2.5 h-7 bg-primary rounded-full" />
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">
            OFFICIAL UPDATES
          </span>
          <h3 className="serif-title text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Corporate Announcements
          </h3>
        </div>
      </div>
      
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse">
              <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded mb-2 w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-700 dark:text-red-300 text-center">
          {error}
        </div>
      )}

      {!loading && !error && picks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {picks.map((p) => {
            const imageUrl = getImageUrl(p)
            return (
              <article 
                key={p.documentId} 
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 cursor-pointer shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
                onClick={() => openArticle(p.documentId)}
              >
                <div>
                  {imageUrl ? (
                    <div className="h-44 w-full overflow-hidden rounded-xl mb-4 bg-slate-100 dark:bg-slate-800 shadow-inner">
                      <img 
                        src={imageUrl} 
                        alt={p.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 flex items-center justify-center text-slate-400">
                      <span className="material-icons text-4xl">campaign</span>
                    </div>
                  )}
                  <h4 className="serif-title text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {p.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                    {p.short_description || ''}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-primary group-hover:underline">
                  <span>Read full announcement</span>
                  <span className="material-icons text-base group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {!loading && !error && picks.length === 0 && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          No announcements available
        </div>
      )}
    </section>
  )
}
