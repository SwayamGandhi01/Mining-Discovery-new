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

export const cms = {
  /** AnnouncementBar and BreakingNews: the eight newest headlines. Both only show titles. */
  latestHeadlines: endpoint(`${API}/news-sections?sort=publishedAt:desc&pagination[limit]=8&${fields(['title'])}`, TTL.news),

  /** Header's News menu. */
  newsCategories: endpoint(`${API}/news-categories?pagination[limit]=100&${fields(['category', 'slug'])}`, TTL.static),

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

  /** CategoryNews: the 25 newest stories — the page size Strapi applied before — plus the category name. */
  categoryNews: (slug: string) =>
    endpoint(
      `${newsIn(slug)}&sort=publishedAt:desc&pagination[pageSize]=25&${fields(['title', 'short_description', 'author', 'publishedAt'])}&${populate('image', IMAGE)}&${populate('pdf', ['url'])}&${populate('news_categories', ['category', 'slug'])}`,
      TTL.news
    ),

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
  relatedArticles: endpoint(`${API}/news-sections?sort=publishedAt:desc&pagination[limit]=15&${fields(['title'])}&${populate('image', IMAGE)}`, TTL.related),

  /** SearchResults. Kept in memory only, so queries don't pile up in localStorage. */
  search: (query: string) => {
    const q = encodeURIComponent(query)
    return endpoint(
      `${API}/news-sections?sort=publishedAt:desc&pagination[limit]=24&${fields(['title', 'short_description', 'publish_on', 'publishedAt'])}&filters[$or][0][title][$containsi]=${q}&filters[$or][1][short_description][$containsi]=${q}&filters[$or][2][description][$containsi]=${q}`,
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

  /**
   * Our Articles. Kept as `populate=*`: the whole collection is ~4 KB compressed
   * and the components read several optional media/link fields from it.
   */
  ourArticles: endpoint(`${API}/our-artciles?populate=*`, TTL.semiStatic),

  /** OurArticlesFlipbook on a direct visit. */
  ourArticle: (documentId: string) =>
    endpoint(`${API}/our-artciles?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`, TTL.semiStatic),

  /** Company Profiles (small collection, full records). */
  companyProfiles: endpoint(`${API}/company-profiles?populate=*`, TTL.static),

  /** CompanyProfileFlipbook on a direct visit — links use the documentId, older ones the numeric id. */
  companyProfile: (idOrDocumentId: string) => endpoint(`${API}/company-profiles?${idFilter(idOrDocumentId)}&populate=*`, TTL.static),

  ceoProfiles: endpoint(`${API}/ceo-profiles?populate=*&pagination[limit]=100&sort=publishedAt:desc`, TTL.static),
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
