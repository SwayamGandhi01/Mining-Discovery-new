import React, { useEffect, useState } from 'react'
import { cachedFetch } from '../utils/cachedFetch'

interface SearchResultsProps {
  query: string
  onArticleClick?: (documentId: string) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, onArticleClick }) => {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      setResults([])
      setError(null)
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      setError(null)

      try {
        const encodedQuery = encodeURIComponent(normalizedQuery)
        const url = `https://admins.miningdiscovery.com/api/news-sections?sort=publishedAt:desc&pagination[limit]=24&populate=*&filters[$or][0][title][$containsi]=${encodedQuery}&filters[$or][1][short_description][$containsi]=${encodedQuery}&filters[$or][2][description][$containsi]=${encodedQuery}`
        const data = await cachedFetch(url, {
          onUpdate: (fresh: any) => {
            if (active) setResults(fresh?.data || [])
          },
        })

        if (!active) return
        setResults(data?.data || [])
      } catch (err) {
        console.error('Search error:', err)
        if (active) setError('Unable to search articles right now. Please try again later.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchResults()

    return () => {
      active = false
    }
  }, [query])

  const trimmedQuery = query.trim()

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-primary font-extrabold mb-2">
          Search Articles
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          {trimmedQuery ? `Results for “${trimmedQuery}”` : 'Search for an article'}
        </h1>
        {!trimmedQuery && (
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl">
            Enter a keyword or phrase at the top to find matching news articles.
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-700/50 dark:bg-red-950/40 p-4 mb-6 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {loading && (
        <div className="py-20 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && trimmedQuery && results.length === 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 text-center">
          <p className="text-xl font-semibold text-slate-900 dark:text-white">No articles found</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try another keyword or phrase to widen your search.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {!loading && results.map((item) => {
          const publishDate = item.publish_on || item.publishedAt
          const formattedDate = publishDate
            ? new Date(publishDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : ''

          return (
            <article
              key={item.id}
              onClick={() => item.documentId && onArticleClick?.(item.documentId)}
              className="cursor-pointer rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {item.short_description || item.description || 'No preview available.'}
                  </p>
                </div>
                <div className="text-right text-sm text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] font-semibold">
                  {formattedDate}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}

export default SearchResults
