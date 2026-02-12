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
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h3 className="serif-title text-2xl font-bold mb-6">Announcements</h3>
      
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-100 dark:border-slate-800 animate-pulse">
              <div className="h-40 bg-slate-300 dark:bg-slate-700 rounded mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && picks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {picks.map((p) => {
            const imageUrl = getImageUrl(p)
            return (
              <article 
                key={p.documentId} 
                className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                onClick={() => openArticle(p.documentId)}
              >
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt={p.title}
                    className="h-40 w-full object-cover rounded mb-4"
                  />
                )}
                {!imageUrl && (
                  <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
                )}
                <h4 className="serif-title text-lg mb-2 line-clamp-2">{p.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-4 line-clamp-2">{p.short_description || ''}</p>
                <button 
                  className="text-sm font-bold hover:text-primary text-primary dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={(e) => {
                    e.preventDefault()
                    openArticle(p.documentId)
                  }}
                >
                  Read the announcement 
                </button>
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
