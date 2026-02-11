import React, { useEffect, useState } from 'react'

interface NewsArticle {
  id: number
  documentId: string
  title: string
  short_description: string
  description: string
  publishedAt: string
  image?: {
    formats?: {
      medium?: { url: string }
      small?: { url: string }
      large?: { url: string }
      thumbnail?: { url: string }
    }
    url?: string
  }
}

export default function CategoryNews(): JSX.Element {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    let mounted = true

    const fetchArticles = async () => {
      try {
        // Extract slug from hash
        const hash = window.location.hash
        const match = hash.match(/#\/news\/(.+)$/)
        const slug = match ? match[1] : ''

        console.log('Fetching articles for slug:', slug)

        if (!slug) {
          setError('Category not found')
          setLoading(false)
          return
        }

        setLoading(true)
        setError(null)
        
        const url =
          `https://admins.miningdiscovery.com/api/news-sections` +
          `?filters[news_categories][slug][$eq]=${encodeURIComponent(slug)}&sort=publishedAt:desc&populate=*`

        console.log('API URL:', url)

        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch articles')
        const data = await res.json()

        console.log('API Response:', data)

        if (mounted) {
          const articles: NewsArticle[] = (data?.data || []).map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            title: item.title,
            short_description: item.short_description,
            description: item.description,
            publishedAt: item.publishedAt,
            image: item.image,
          }))

          setArticles(articles)
          
          // Get category name by finding the matching slug in the first article
          if (data?.data?.[0]?.news_categories) {
            const matchingCategory = data.data[0].news_categories.find((cat: any) => cat.slug === slug)
            if (matchingCategory) {
              setCategoryName(matchingCategory.category)
            } else {
              // Fallback to first category if exact match not found
              setCategoryName(data.data[0].news_categories[0].category)
            }
          }
        }
      } catch (e) {
        console.error('Error fetching articles:', e)
        if (mounted) {
          setError(e instanceof Error ? e.message : 'Error loading articles')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    const handleHashChange = () => {
      fetchArticles()
    }

    fetchArticles()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      mounted = false
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const calculateReadTime = (text: string): number => {
    const wordsPerMinute = 200
    const wordCount = text.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => {
              window.location.hash = '#'
            }}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No articles found in this category</p>
          <button
            onClick={() => {
              window.location.hash = '#'
            }}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">{categoryName}</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">{articles.length} articles</p>

        <div className="space-y-8">
          {articles.map((article) => {
            const imageUrl =
              article.image?.formats?.medium?.url ||
              article.image?.formats?.large?.url ||
              article.image?.url
            const readTime = calculateReadTime(article.description)
            const publicDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })

            return (
              <article
                key={article.id}
                onClick={() => {
                  window.location.hash = `#/article/${article.documentId}`
                }}
                className="flex gap-6 pb-8 border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:opacity-80 transition-opacity group"
              >
                {imageUrl && (
                  <div className="w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                    {article.short_description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>{publicDate}</span>
                    <span>•</span>
                    <span>{readTime} MIN READ</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
