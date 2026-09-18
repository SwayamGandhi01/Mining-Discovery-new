import { cachedFetch, peekCache, TTL } from '../utils/cachedFetch'

/**
 * Every CMS read the site makes, in one place.
 *
 * Each endpoint asks only for the records and fields its components actually
 * render (checked against those components and the live content types), and
 * carries the freshness class it is cached under. Components that show the
 * same data use the same endpoint, so they share one request and cache entry.
 */

export const CMS_URL = 'https://admins.miningdiscovery.com'
const API = `${CMS_URL}/api`

const indexed = (param: string, names: readonly string[]) => names.map((name, i) => `${param}[${i}]=${name}`).join('&')
const fields = (names: readonly string[]) => indexed('fields', names)
const populate = (relation: string, names: readonly string[]) => indexed(`populate[${relation}][fields]`, names)

// What pickImage needs to choose the right variant of a media file.
const IMAGE = ['url', 'formats', 'width', 'height', 'size'] as const
const FILE = ['url', 'name'] as const

const newsIn = (slug: string) => `${API}/news-sections?filters[news_categories][slug][$eq]=${encodeURIComponent(slug)}`

/** Stories per page on a category listing. */
export const NEWS_PAGE_SIZE = 25

/** The category page's tabs: everything, stories without a PDF, or PDF stories. */
export type NewsFilter = 'all' | 'article' | 'pdf'

const pdfFilter = (filter: NewsFilter) =>
  filter === 'pdf' ? '&filters[pdf][$notNull]=true' : filter === 'article' ? '&filters[pdf][$null]=true' : ''

/**
 * Categories the site doesn't publish. They are left out of the News menu, of
 * the feeds that aren't tied to one category (headlines ticker, related
 * articles, search) and of their own listing page. Nothing is removed from the
 * CMS — the stories are simply no longer surfaced.
 */
export const HIDDEN_NEWS_CATEGORIES = ['daily-newsletter']

export const isHiddenCategory = (slug?: string | null): boolean =>
  !!slug && HIDDEN_NEWS_CATEGORIES.includes(slug)

/**
 * Leaves hidden categories out of a feed that isn't already filtered to one
 * category. The `$or` matters: on a to-many relation `$notIn` on its own also
 * drops the handful of stories filed under no category at all, because there is
 * no related row for the condition to match.
 *
 * `prefix` places the clause inside a `filters[$and][n]` group for queries that
 * already carry conditions of their own.
 */
const notHidden = (prefix = 'filters') =>
  [
    ...HIDDEN_NEWS_CATEGORIES.map(
      (slug, i) => `${prefix}[$or][0][news_categories][slug][$notIn][${i}]=${encodeURIComponent(slug)}`
    ),
    `${prefix}[$or][1][news_categories][id][$null]=true`,
  ].join('&')
const idFilter = (value: string) => `filters[${/^\d+$/.test(value) ? 'id' : 'documentId'}][$eq]=${encodeURIComponent(value)}`

export interface Endpoint<T = any> {
  url: string
  /** Cached fetch; `onUpdate` receives newer data from a background refresh. */
  fetch: (onUpdate?: (data: T) => void) => Promise<T>
  /** Cached data only — never a request. */
  peek: () => T | undefined
}

function endpoint<T = any>(url: string, ttl: number, persist = true): Endpoint<T> {
  return {
    url,
    fetch: (onUpdate) => cachedFetch<T>(url, { ttl, persist, onUpdate }),
    peek: () => peekCache<T>(url),
  }
}

const MAGAZINE_FIELDS = fields(['Title', 'Description', 'publishDate', 'features', 'publishedAt'])
const MAGAZINE_MEDIA = `${populate('coverImage', IMAGE)}&${populate('pdf', FILE)}`
const NEWSLETTER_QUERY = `${fields(['title', 'publishedAt'])}&${populate('coverImage', IMAGE)}&${populate('pdfFile', FILE)}&${populate('newsletter_category', ['name'])}`

// Only the fields these pages render: the cards, their covers, and the files
// their buttons open. Every other column and relation stays on the server.
const OUR_ARTICLE_QUERY = `${fields(['Title', 'Description', 'publishDate', 'publishedAt', 'createdAt', 'buttonLink'])}&${populate('coverImage', IMAGE)}&${populate('pdf', FILE)}`
const COMPANY_QUERY = `${fields(['title', 'shortDescription', 'publishedAt', 'createdAt'])}&${populate('cover_image', IMAGE)}&${populate('companyPdf', FILE)}`

export const cms = {
  /** AnnouncementBar and BreakingNews: the eight newest headlines. Both only show titles. */
  latestHeadlines: endpoint(
    `${API}/news-sections?sort=publishedAt:desc&pagination[limit]=8&${fields(['title'])}&${notHidden()}`,
    TTL.news
  ),

  /** Header's News menu. */
  newsCategories: endpoint(
    `${API}/news-categories?pagination[limit]=100&${fields(['category', 'slug'])}&${HIDDEN_NEWS_CATEGORIES.map(
      (slug, i) => `filters[slug][$notIn][${i}]=${encodeURIComponent(slug)}`
    ).join('&')}`,
    TTL.static
  ),

  /**
   * HeroSection. Ordered by the editorial news date (`publish_on`) — the date
   * the cover story displays — with the CMS record timestamp breaking ties
   * between stories filed on the same day. Sorting by `publishedAt` alone put
   * whichever story was entered last on the cover, even when its news date was
   * older. `publish_on` nulls sort first on a descending sort, which would hand
   * the cover to an undated story, so they are filtered out.
   */
  coverStory: endpoint(
    `${newsIn('latest-news')}&filters[publish_on][$notNull]=true&sort[0]=publish_on:desc&sort[1]=publishedAt:desc&pagination[limit]=1&${fields(['title', 'short_description', 'publish_on', 'publishedAt'])}&${populate('image', IMAGE)}`,
    TTL.news
  ),

  /** RightColumn: trending titles. */
  trending: endpoint(`${newsIn('latest-news')}&sort=publishedAt:desc&pagination[limit]=8&${fields(['title'])}`, TTL.news),

  /** MetalNewsSections shows all four; LeftColumn shows the first — one shared request per metal. */
  metalNews: (slug: string) =>
    endpoint(
      `${newsIn(slug)}&sort=publishedAt:desc&pagination[limit]=4&${fields(['title', 'short_description', 'publish_on', 'publishedAt'])}&${populate('image', IMAGE)}`,
      TTL.news
    ),

  /** NewsGrid tabs. `description` stays: the cards' read time is counted from it. */
  tabPosts: (slug: string) =>
    endpoint(
      `${newsIn(slug)}&sort=publishedAt:desc&pagination[limit]=2&${fields(['title', 'short_description', 'description', 'publish_on', 'publishedAt'])}&${populate('image', IMAGE)}`,
      TTL.news
    ),

  /** EditorsPicks: the three latest announcements it displays. */
  announcements: endpoint(
    `${newsIn('announcement')}&sort=publishedAt:desc&pagination[limit]=3&${fields(['title', 'short_description', 'publishedAt'])}&${populate('image', IMAGE)}`,
    TTL.news
  ),

  /**
   * CategoryNews: one page of a category, newest first. Categories run to
   * thousands of stories, so only the requested page is fetched; `id` breaks
   * ties on the timestamp so paging can't repeat or skip a story.
   */
  categoryNews: (slug: string, page = 1, filter: NewsFilter = 'all') =>
    endpoint(
      `${newsIn(slug)}${pdfFilter(filter)}&sort[0]=publishedAt:desc&sort[1]=id:desc&pagination[page]=${page}&pagination[pageSize]=${NEWS_PAGE_SIZE}&${fields(['title', 'short_description', 'author', 'publishedAt'])}&${populate('image', IMAGE)}&${populate('pdf', ['url'])}&${populate('news_categories', ['category', 'slug'])}`,
      TTL.news
    ),

  /**
   * The totals behind the "All / Articles / PDFs" tabs. One row is enough —
   * the count comes from the pagination metadata.
   */
  categoryNewsCount: (slug: string, filter: NewsFilter) =>
    endpoint(`${newsIn(slug)}${pdfFilter(filter)}&pagination[pageSize]=1&${fields(['title'])}`, TTL.news),

  /** ArticleDetail: one story. */
  article: (documentId: string) =>
    endpoint(
      `${API}/news-sections/${encodeURIComponent(documentId)}?${fields(['title', 'short_description', 'description', 'author', 'publish_on', 'publishedAt'])}&${populate('image', IMAGE)}`,
      TTL.article
    ),

  /** NewsPdfFlipbook: a news story published as a PDF (the Research Reports category). */
  newsPdf: (documentId: string) =>
    endpoint(
      `${API}/news-sections/${encodeURIComponent(documentId)}?${fields(['title', 'publishedAt'])}&${populate('pdf', FILE)}&${populate('image', IMAGE)}`,
      TTL.article
    ),

  /** ArticleDetail's "Continue Reading" sidebar — the same list for every article. */
  relatedArticles: endpoint(
    `${API}/news-sections?sort=publishedAt:desc&pagination[limit]=15&${fields(['title'])}&${populate('image', IMAGE)}&${notHidden()}`,
    TTL.related
  ),

  /** SearchResults. Kept in memory only, so queries don't pile up in localStorage. */
  search: (query: string) => {
    const q = encodeURIComponent(query)
    return endpoint(
      // The term match and the hidden-category exclusion are two separate `$or`
      // groups, so both are nested under `$and` rather than sharing one.
      `${API}/news-sections?sort=publishedAt:desc&pagination[limit]=24&${fields(['title', 'short_description', 'publish_on', 'publishedAt'])}&filters[$and][0][$or][0][title][$containsi]=${q}&filters[$and][0][$or][1][short_description][$containsi]=${q}&filters[$and][0][$or][2][description][$containsi]=${q}&${notHidden('filters[$and][1]')}`,
      TTL.search,
      false
    )
  },

  /** NewsGrid's "Latest issue" card: just the newest magazine. */
  latestMagazine: endpoint(
    `${API}/magazines?sort=publishedAt:desc&pagination[limit]=1&${fields(['Title', 'publishedAt'])}&${MAGAZINE_MEDIA}`,
    TTL.semiStatic
  ),

  /** Magazines page — and MagazineFlipbook looks its magazine up here when cached. */
  magazines: endpoint(`${API}/magazines?sort=publishedAt:desc&pagination[pageSize]=100&${MAGAZINE_FIELDS}&${MAGAZINE_MEDIA}`, TTL.semiStatic),

  /** MagazineFlipbook on a direct visit: one magazine by its numeric id. */
  magazine: (id: string) =>
    endpoint(`${API}/magazines?filters[id][$eq]=${encodeURIComponent(id)}&${MAGAZINE_FIELDS}&${MAGAZINE_MEDIA}`, TTL.semiStatic),

  /** RegionalIntelligence shows horizontal banners only, so vertical ones aren't downloaded. */
  advertisements: endpoint(
    `${API}/advertisements?filters[$or][0][vertical_banner][$null]=true&filters[$or][1][vertical_banner][$eq]=false&${fields(['alt_text', 'ad_url', 'vertical_banner'])}&${populate('ads_image', IMAGE)}`,
    TTL.semiStatic
  ),

  newsletterCategories: endpoint(`${API}/newsletter-categories?pagination[limit]=100&${fields(['name', 'publishedAt'])}`, TTL.static),

  /** Every newsletter in one request (48 today), so switching months filters locally. */
  newsletters: endpoint(`${API}/post-newsletters?pagination[pageSize]=100&${NEWSLETTER_QUERY}`, TTL.semiStatic),

  /** NewsletterFlipbook on a direct visit. */
  newsletter: (id: string) => endpoint(`${API}/post-newsletters?filters[id][$eq]=${encodeURIComponent(id)}&${NEWSLETTER_QUERY}`, TTL.semiStatic),

  /** Our Articles: the listing, the homepage row and the flipbook all read this. */
  ourArticles: endpoint(`${API}/our-artciles?pagination[pageSize]=100&${OUR_ARTICLE_QUERY}`, TTL.semiStatic),

  /** OurArticlesFlipbook on a direct visit. */
  ourArticle: (documentId: string) =>
    endpoint(`${API}/our-artciles?filters[documentId][$eq]=${encodeURIComponent(documentId)}&${OUR_ARTICLE_QUERY}`, TTL.semiStatic),

  /** Company Profiles: cards plus the cover and PDF their buttons open. */
  companyProfiles: endpoint(`${API}/company-profiles?pagination[pageSize]=100&${COMPANY_QUERY}`, TTL.static),

  /** CompanyProfileFlipbook on a direct visit — links use the documentId, older ones the numeric id. */
  companyProfile: (idOrDocumentId: string) => endpoint(`${API}/company-profiles?${idFilter(idOrDocumentId)}&${COMPANY_QUERY}`, TTL.static),

}

/**
 * A few news records (22 of ~3,400) have no short_description, and the cards
 * fall back to the full description for those. List requests leave the heavy
 * description out, so it is fetched here for just those records — normally
 * none, so normally no extra request.
 */
export async function withDescriptionFallback<T = any>(json: T): Promise<T> {
  const items: any[] = (json as any)?.data || []
  const missing = items.filter((item) => !item.short_description && item.documentId)
  if (!missing.length) return json

  const ids = missing.map((item, i) => `filters[documentId][$in][${i}]=${encodeURIComponent(item.documentId)}`).join('&')
  try {
    const extra = await cachedFetch(`${API}/news-sections?${ids}&pagination[limit]=${missing.length}&${fields(['description'])}`, {
      ttl: TTL.article,
    })
    const descriptions = new Map<string, string>((extra?.data || []).map((d: any) => [d.documentId, d.description]))
    return {
      ...(json as any),
      data: items.map((item) => (descriptions.has(item.documentId) ? { ...item, description: descriptions.get(item.documentId) } : item)),
    }
  } catch {
    return json
  }
}

export interface PickedImage {
  url: string
  width?: number
  height?: number
}

export interface ImageSources extends PickedImage {
  /** `srcSet` listing the useful variants, or undefined when there is only one. */
  srcSet?: string
}

/**
 * `src` + `srcSet` for a CMS image, so the browser can pick a file that suits
 * the viewport and screen density rather than always taking the desktop one.
 *
 * `displayWidth` is roughly how wide the image is drawn at its largest; much
 * wider variants are left out. So are variants that weigh more than a wider
 * one — Strapi's PNG re-encodes often do — so choosing a wider file is never a
 * heavier download. `src` stays the byte-aware pick, for anything that ignores
 * srcSet.
 */
export function imageSources(image: any, displayWidth: number, baseUrl?: string): ImageSources | null {
  const absolute = (url: string) => (!baseUrl || url.startsWith('http') ? url : `${baseUrl}${url}`)
  const fallback = pickImage(image, displayWidth)
  if (!fallback) return null

  const variants: any[] = [...Object.values(image?.formats || {}), image]
    .filter((v: any) => v?.url && v.width)
    .sort((a: any, b: any) => a.width - b.width)

  // Offer nothing heavier than the variant that would have been used anyway.
  // Many covers are PNG uploads whose wider variants cost several times the
  // bytes, so a dense screen must never turn into a bigger download than a
  // plain one — it just keeps this variant. Narrower, lighter files stay on
  // offer for smaller slots and 1x screens.
  const base = variants.find((v) => v.url === fallback.url)
  const maxWidth = displayWidth * 2
  const maxSize = base?.size ?? Infinity
  const candidates = variants.filter(
    (v) => v === base || (v.width <= maxWidth && (v.size ?? 0) <= maxSize)
  )

  // Widest first: keep a variant only if it is lighter than every wider one kept.
  const useful: any[] = []
  let lightestWider = Infinity
  for (let i = candidates.length - 1; i >= 0; i--) {
    const variant = candidates[i]
    const size = variant.size ?? 0
    if (size < lightestWider) {
      useful.unshift(variant)
      lightestWider = size
    }
  }

  const unique = useful.filter((v, i, all) => all.findIndex((o) => o.width === v.width) === i)
  return {
    ...fallback,
    url: absolute(fallback.url),
    srcSet: unique.length > 1 ? unique.map((v) => `${absolute(v.url)} ${v.width}w`).join(', ') : undefined,
  }
}

/**
 * The lightest variant of a CMS image that is at least `minWidth` pixels wide,
 * judged by file size: for PNG uploads Strapi's "medium" variant can outweigh
 * the original. Falls back to the widest variant when none is wide enough.
 */
export function pickImage(image: any, minWidth: number): PickedImage | null {
  if (!image) return null
  const variants: any[] = [...Object.values(image.formats || {}), image].filter((variant: any) => variant?.url)
  if (!variants.length) return null

  const wideEnough = variants.filter((variant) => (variant.width ?? 0) >= minWidth)
  const chosen = wideEnough.length
    ? wideEnough.reduce((best, variant) => ((variant.size ?? Infinity) < (best.size ?? Infinity) ? variant : best))
    : variants.reduce((best, variant) => ((variant.width ?? 0) > (best.width ?? 0) ? variant : best))

  return { url: chosen.url, width: chosen.width, height: chosen.height }
}
