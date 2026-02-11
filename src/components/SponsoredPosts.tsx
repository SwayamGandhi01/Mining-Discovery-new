import React, { useEffect, useState } from 'react'

interface NewsArticle {
  id?: number
  documentId?: string
  title: string
  short_description?: string
  description?: string
  publishedAt?: string
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

interface SponsoredPostsProps {
  onArticleClick?: (docId: string) => void
}

export default function SponsoredPosts({ onArticleClick }: SponsoredPostsProps): JSX.Element {
  const [posts, setPosts] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchWithRetry = async (urlToFetch: string, retries = 3, timeout = 10000) => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), timeout)

          const res = await fetch(urlToFetch, { signal: controller.signal })
          clearTimeout(timeoutId)

          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = await res.json()

          if (!data?.data?.[0]) {
            throw new Error('Invalid response structure')
          }

          return data
        } catch (err) {
          console.warn(`Attempt ${attempt + 1} failed:`, err instanceof Error ? err.message : 'Unknown error')
          if (attempt === retries - 1) throw err
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1))) // Exponential backoff
        }
      }
    }

    async function loadPosts() {
      try {
        setLoading(true)
        const url =
          'https://admins.miningdiscovery.com/api/news-sections' +
          '?filters[news_categories][slug][$eq]=sponsored-post&sort=publishedAt:desc&pagination[limit]=6&populate=*'

        const data = await fetchWithRetry(url)

        if (!mounted) return

        // Get posts - already sorted by publishedAt
        const posts = (data?.data || [])
          .filter((post: any) => post && post.title) // Filter out empty/invalid posts

        const mappedPosts: NewsArticle[] = posts.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          title: item.title,
          short_description: item.short_description,
          description: item.description,
          publishedAt: item.publishedAt,
          image: item.image,
        }))

        setPosts(mappedPosts)
        setError(null)
      } catch (e) {
        console.error('Error loading sponsored posts:', e)
        if (mounted) {
          setError(e instanceof Error ? e.message : 'Error loading posts')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadPosts()
    return () => {
      mounted = false
    }
  }, [])

  const calculateReadTime = (text: string): number => {
    const wordsPerMinute = 200
    const wordCount = text.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const handlePostClick = (docId: string) => {
    if (onArticleClick) {
      onArticleClick(docId)
    }
  }

  if (loading || error || posts.length === 0) return <div></div>

  return (
    <section className="py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Sponsored Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.slice(0, 2).map((post) => {
            const imageUrl = post.image?.url || post.image?.formats?.medium?.url || post.image?.formats?.small?.url
            const readTime = calculateReadTime(post.description || post.short_description || '')

            return (
              <div
                key={post.id || post.documentId}
                onClick={() => handlePostClick(post.documentId || '')}
                className="cursor-pointer group bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image */}
                {imageUrl && (
                  <div className="w-full h-48 md:h-56 overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                    {post.short_description}
                  </p>

                  <div className="text-xs uppercase text-primary font-bold">{readTime} MIN READ</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
