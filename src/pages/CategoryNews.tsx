import React, { useEffect, useState } from 'react'

interface NewsArticle {
  id: number
  documentId: string
  title: string
  short_description?: string
  description?: string | null
  publishedAt: string
  author?: string
  image?: {
    formats?: {
      medium?: { url: string }
      small?: { url: string }
      large?: { url: string }
      thumbnail?: { url: string }
    }
    url?: string
  }
  pdf?: {
    url?: string
  } | any
  pdfUrl?: string
}

interface CategoryNewsProps {
  categorySlug?: string
}

export default function CategoryNews({ categorySlug }: CategoryNewsProps): JSX.Element {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    let mounted = true

    const fetchArticles = async () => {
      try {
        // Use the slug passed as prop, or extract from hash as fallback
        const slug = categorySlug || (() => {
          const hash = window.location.hash
          const match = hash.match(/#\/news\/([^/]+)$/)
          return match ? match[1] : ''
        })()

        console.log('CategoryNews - categorySlug prop:', categorySlug)
        console.log('CategoryNews - extracted slug from hash:', slug)

        if (!slug) {
          setError('Category not found')
          setLoading(false)
          console.error('No slug provided')
          return
        }

        setLoading(true)
        setError(null)
        
        const url =
          `https://admins.miningdiscovery.com/api/news-sections` +
          `?filters[news_categories][slug][$eq]=${encodeURIComponent(slug)}&sort=publishedAt:desc&populate=*`

        console.log('CategoryNews - API URL:', url)

        const res = await fetch(url)
        if (!res.ok) {
          const errorMsg = `Failed to fetch articles: ${res.status} ${res.statusText}`
          console.error(errorMsg)
          throw new Error(errorMsg)
        }
        const data = await res.json()

        console.log('CategoryNews - API Response:', data)

        if (mounted) {
          const articles: NewsArticle[] = (data?.data || []).map((item: any) => {
            // Extract PDF URL properly
            let pdfUrl: string | undefined = undefined
            if (item.pdf) {
              if (typeof item.pdf === 'string') {
                pdfUrl = item.pdf
              } else if (item.pdf.url) {
                pdfUrl = item.pdf.url
              } else if (Array.isArray(item.pdf) && item.pdf[0]?.url) {
                pdfUrl = item.pdf[0].url
              }
            }

            return {
              id: item.id,
              documentId: item.documentId,
              title: item.title,
              short_description: item.short_description,
              description: item.description,
              publishedAt: item.publishedAt,
              author: item.author,
              image: item.image,
              pdf: item.pdf,
              pdfUrl: pdfUrl,
            }
          })

          setArticles(articles)
          console.log('Articles loaded:', articles.length)
          console.log('Articles with PDF:', articles.filter(a => a.pdfUrl).length)
          
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
  }, [categorySlug])

  const calculateReadTime = (text: string | null | undefined): number => {
    if (!text) return 0
    const wordsPerMinute = 200
    const wordCount = text.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const handleArticleClick = (article: NewsArticle) => {
    // Priority: PDF first, then article details
    if (article.pdfUrl && article.pdfUrl.trim() !== '') {
      console.log('Opening PDF:', article.pdfUrl)
      // Open PDF in new tab
      const newWindow = window.open(article.pdfUrl, '_blank')
      // Fallback if popup blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = article.pdfUrl
      }
    } else {
      console.log('Opening article details:', article.documentId)
      window.location.hash = `#/article/${article.documentId}`
    }
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
    <div className="min-h-screen bg-white dark:bg-background-dark">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 serif-title">
            {categoryName}
          </h1>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="text-lg">{articles.length} articles</span>
            <span className="w-1 h-1 bg-primary rounded-full"></span>
            <span className="text-sm">Updated regularly</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Article + Grid */}
        {articles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Featured Article - Large on left */}
            <div className="lg:col-span-2">
              <article
                onClick={() => handleArticleClick(articles[0])}
                className="cursor-pointer group"
              >
                <div className="relative overflow-hidden rounded-lg mb-6 bg-slate-200 dark:bg-slate-800 h-96">
                  {articles[0].image?.formats?.large?.url ||
                  articles[0].image?.formats?.medium?.url ||
                  articles[0].image?.url ? (
                    <>
                      <img
                        src={
                          articles[0].image?.formats?.large?.url ||
                          articles[0].image?.formats?.medium?.url ||
                          articles[0].image?.url
                        }
                        alt={articles[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {articles[0].pdfUrl && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                          📄 PDF
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800" />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors line-clamp-3">
                  {articles[0].title}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-4">
                  {articles[0].short_description}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>
                    {new Date(articles[0].publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  {articles[0].author && (
                    <>
                      <span>•</span>
                      <span>{articles[0].author}</span>
                    </>
                  )}
                </div>
              </article>
            </div>

            {/* Grid of Articles on Right */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {articles.slice(1, 4).map((article) => (
                  <article
                    key={article.id}
                    onClick={() => handleArticleClick(article)}
                    className="cursor-pointer group rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-32 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      {article.image?.formats?.medium?.url ||
                      article.image?.formats?.small?.url ||
                      article.image?.url ? (
                        <>
                          <img
                            src={
                              article.image?.formats?.medium?.url ||
                              article.image?.formats?.small?.url ||
                              article.image?.url
                            }
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {article.pdfUrl && (
                            <div className="absolute top-2 right-2 bg-yellow-500 text-slate-900 px-2 py-0.5 rounded text-xs font-bold">
                              PDF
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800" />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rest of Articles in Grid */}
        {articles.length > 4 && (
          <>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                More Articles
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(4).map((article) => {
                const imageUrl =
                  article.image?.formats?.medium?.url ||
                  article.image?.formats?.large?.url ||
                  article.image?.url

                return (
                  <article
                    key={article.id}
                    onClick={() => handleArticleClick(article)}
                    className="cursor-pointer group rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-primary/50 transition-all"
                  >
                    <div className="relative h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {article.pdfUrl && (
                            <div className="absolute top-2 right-2 bg-yellow-500 text-slate-900 px-2 py-1 rounded text-xs font-bold">
                              PDF
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                        {article.short_description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        {article.author && <span className="font-semibold">{article.author}</span>}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
