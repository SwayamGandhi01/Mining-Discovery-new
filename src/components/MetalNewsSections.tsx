import React, { useEffect, useState } from 'react'
import { cachedFetch } from '../utils/cachedFetch'

type SectionItem = any

const METAL_CATEGORIES = [
  { label: 'Gold News', slug: 'gold-news' },
  { label: 'Silver News', slug: 'silver-news' },
  { label: 'Copper News', slug: 'copper-news' },
]

interface MetalNewsSectionsProps {
  onArticleClick?: (docId: string) => void
}

const FILTER_OPTIONS = [
  { label: 'Gold', value: 'gold-news' },
  { label: 'Silver', value: 'silver-news' },
  { label: 'Copper', value: 'copper-news' },
]

const MetalNewsSections: React.FC<MetalNewsSectionsProps> = ({ onArticleClick }) => {
  const [postsBySection, setPostsBySection] = useState<Record<string, SectionItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')

  const fetchSectionPosts = async (slug: string) => {
    const url = `https://admins.miningdiscovery.com/api/news-sections?filters[news_categories][slug][$eq]=${slug}&sort=publishedAt:desc&pagination[limit]=4&populate=*`
    const json = await cachedFetch(url)
    return json?.data || []
  }

  useEffect(() => {
    let mounted = true

    const loadSections = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          METAL_CATEGORIES.map(async (section) => {
            const posts = await fetchSectionPosts(section.slug)
            return { slug: section.slug, posts }
          })
        )

        if (!mounted) return

        setPostsBySection(
          results.reduce((acc, result) => {
            acc[result.slug] = result.posts
            return acc
          }, {} as Record<string, SectionItem[]>)
        )
      } catch (error) {
        console.error('Metal news fetch error:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSections()

    return () => {
      mounted = false
    }
  }, [])

  const calculateReadTime = (text: string): number => {
    const wordsPerMinute = 200
    const wordCount = text?.split(/\s+/).length || 0
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }

  const renderSection = (section: typeof METAL_CATEGORIES[number]) => {
    const sectionPosts = postsBySection[section.slug] || []

    return (
      <section
        key={section.slug}
        className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-0.5 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="pointer-events-none absolute -right-10 top-8 h-40 w-40 rounded-full bg-slate-100 opacity-30 dark:bg-slate-800" />
        <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {section.label}
            </span>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Market headlines for {section.label.split(' ')[0].toLowerCase()}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              Get the most important developments in {section.label.split(' ')[0].toLowerCase()} from our expert news desk.
            </p>
          </div>
          <a
            href={`/news/${section.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            View all {section.label.split(' ')[0].toLowerCase()} news
          </a>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : sectionPosts.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sectionPosts.map((item: SectionItem, idx: number) => {
              const title = item.title || item.Title || 'Untitled article'
              const excerpt = item.short_description || item.description || 'Read the latest market update and insights.'
              const readTime = calculateReadTime(excerpt)
              const imageUrl = item.image?.formats?.small?.url || item.image?.formats?.thumbnail?.url || item.image?.url || ''
              const publishDate = new Date(item.publish_on || item.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })

              return (
                <article
                  key={idx}
                  onClick={() => onArticleClick?.(item.documentId)}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
                    <div className="absolute left-3 top-3 rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
                      {section.label.split(' ')[0]}
                    </div>
                    <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          <span className="material-icons text-3xl">newspaper</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {title}
                    </h4>
                    <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400 line-clamp-2">
                      {excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      <span>{publishDate}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                        {readTime} min
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            No {section.label.toLowerCase()} found.
          </div>
        )}
      </section>
    )
  }

  const visibleSections =
    selectedFilter === 'all'
      ? METAL_CATEGORIES
      : METAL_CATEGORIES.filter((section) => section.slug === selectedFilter)

  return (
    <div className="space-y-8 py-12">
      <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Market briefing</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Gold, Silver & Copper News
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            The latest market updates, investment insights, and sector headlines for precious and industrial metals.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Combined metal filter
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              Show news by market
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {FILTER_OPTIONS.map((option) => {
              const isActive = selectedFilter === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isActive ? 'border-primary bg-primary text-white shadow-lg shadow-primary/10' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800'}`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {visibleSections.map((section) => renderSection(section))}
    </div>
  )
}

export default MetalNewsSections
