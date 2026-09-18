import React, { useEffect, useState, lazy, Suspense } from 'react'
import { isHiddenCategory } from './api/cms'
import Header from './components/Header'
import AnnouncementBar from './components/AnnouncementBar'
import LeftColumn from './components/LeftColumn'
import HeroSection from './components/HeroSection'
import RightColumn from './components/RightColumn'
import NewsGrid from './components/NewsGrid'
import RegionalIntelligence from './components/RegionalIntelligence'
import EditorsPicks from './components/EditorsPicks'
import Newsletter from './components/Newsletter'
import OurArticlesSection from './components/OurArticlesSection'
import MetalNewsSections from './components/MetalNewsSections'
import Footer from './components/Footer'
import BreakingNews from './components/BreakingNews'
import TrustedBrands from './components/TrustedBrands'
import ArticleDetailSkeleton from './components/skeletons/ArticleDetailSkeleton'
import CategoryNewsSkeleton from './components/skeletons/CategoryNewsSkeleton'
import FlipbookSkeleton from './components/skeletons/FlipbookSkeleton'
import PageSkeleton from './components/skeletons/PageSkeleton'

// Lazy-loaded page components for optimal bundle splitting
const Magazines = lazy(() => import('./pages/Magazines'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const CompanyProfiles = lazy(() => import('./pages/CompanyProfiles'))
const CategoryNews = lazy(() => import('./pages/CategoryNews'))
const Services = lazy(() => import('./pages/Services'))
const InvestorCampaigns = lazy(() => import('./pages/InvestorCampaigns'))
const NewsSyndication = lazy(() => import('./pages/NewsSyndication'))
const DigitalBranding = lazy(() => import('./pages/DigitalBranding'))
const PressOffice = lazy(() => import('./pages/PressOffice'))
const ConferenceMediaCoverage = lazy(() => import('./pages/ConferenceMediaCoverage'))
const NewsletterEmailBlast = lazy(() => import('./pages/NewsletterEmailBlast'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const OurArticles = lazy(() => import('./pages/OurArticles'))
const OurArticlesFlipbook = lazy(() => import('./pages/OurArticlesFlipbook'))
const MagazineFlipbook = lazy(() => import('./pages/MagazineFlipbook'))
const NewsletterFlipbook = lazy(() => import('./pages/NewsletterFlipbook'))
const CompanyProfileFlipbook = lazy(() => import('./pages/CompanyProfileFlipbook'))
const NewsPdfFlipbook = lazy(() => import('./pages/NewsPdfFlipbook'))
const SearchResults = lazy(() => import('./pages/SearchResults'))

// Placeholder components for magazine dropdown pages


const NewsletterPage = () => (
  <div>
    <Newsletter />
  </div>
)

// Routes that carry an id, e.g. /article/sx6gn6ckwbiljfpq226eqzbz, /news/evening-chatter
const ROUTE_PATTERNS = {
  article: /^\/article\/(.+)$/,
  flipbook: /^\/flipbook\/(.+)$/,
  magazineFlipbook: /^\/magazine-flipbook\/(.+)$/,
  newsletterFlipbook: /^\/newsletter-flipbook\/(.+)$/,
  companyFlipbook: /^\/company-flipbook\/(.+)$/,
  // PDF stories from the news categories (Research Reports)
  newsFlipbook: /^\/news-flipbook\/(.+)$/,
  category: /^\/news\/([^/]+)$/,
}

// The id captured by `pattern`, or null when the path doesn't match it.
const routeParam = (path: string, pattern: RegExp): string | null => path.match(pattern)?.[1] ?? null

// A category the site doesn't publish is not a route: the path falls through to
// the home page the same way any unknown path does.
const categoryParam = (path: string): string | null => {
  const slug = routeParam(path, ROUTE_PATTERNS.category)
  return isHiddenCategory(slug) ? null : slug
}

const initialPath = () => window.location.pathname || '/'


export default function App(): JSX.Element {
  const [route, setRoute] = useState<string>(window.location.pathname || '/')
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('q')?.trim() || ''
  })
  // Parsed from the URL up front: starting these at null rendered the home page
  // (and fired its API requests) for a moment before every deep-linked page.
  const [documentId, setDocumentId] = useState(() => routeParam(initialPath(), ROUTE_PATTERNS.article))
  const [categorySlug, setCategorySlug] = useState(() => categoryParam(initialPath()))
  const [flipbookDocumentId, setFlipbookDocumentId] = useState(() => routeParam(initialPath(), ROUTE_PATTERNS.flipbook))
  const [magazineFlipbookId, setMagazineFlipbookId] = useState(() => routeParam(initialPath(), ROUTE_PATTERNS.magazineFlipbook))
  const [newsletterFlipbookId, setNewsletterFlipbookId] = useState(() => routeParam(initialPath(), ROUTE_PATTERNS.newsletterFlipbook))
  const [companyFlipbookId, setCompanyFlipbookId] = useState(() => routeParam(initialPath(), ROUTE_PATTERNS.companyFlipbook))
  const [newsFlipbookId, setNewsFlipbookId] = useState(() => routeParam(initialPath(), ROUTE_PATTERNS.newsFlipbook))

  useEffect(() => {
    const onRoute = () => {
      let path = window.location.pathname || '/'
      // A hidden category's URL is rewritten rather than left pointing at a
      // listing the site no longer shows.
      if (isHiddenCategory(routeParam(path, ROUTE_PATTERNS.category))) {
        window.history.replaceState(null, '', '/')
        path = '/'
      }
      setRoute(path)

      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      })

      const params = new URLSearchParams(window.location.search)
      setSearchQuery(params.get('q')?.trim() || '')

      // Each of these prefixes is mutually exclusive, so every route state is derived
      // from its own match and cleared when the path no longer matches it.
      setDocumentId(routeParam(path, ROUTE_PATTERNS.article))
      setFlipbookDocumentId(routeParam(path, ROUTE_PATTERNS.flipbook))
      setMagazineFlipbookId(routeParam(path, ROUTE_PATTERNS.magazineFlipbook))
      setNewsletterFlipbookId(routeParam(path, ROUTE_PATTERNS.newsletterFlipbook))
      setCompanyFlipbookId(routeParam(path, ROUTE_PATTERNS.companyFlipbook))
      setNewsFlipbookId(routeParam(path, ROUTE_PATTERNS.newsFlipbook))
      setCategorySlug(categoryParam(path))
    }
    onRoute()
    window.addEventListener('popstate', onRoute)
    return () => window.removeEventListener('popstate', onRoute)
  }, [])

  const openArticle = (docId: string) => {
    window.history.pushState(null, '', `/article/${docId}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const openFlipbook = (docId: string) => {
    window.history.pushState(null, '', `/flipbook/${docId}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const openMagazineFlipbook = (magazineId: string) => {
    window.history.pushState(null, '', `/magazine-flipbook/${magazineId}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const openNewsletterFlipbook = (newsletterId: string) => {
    window.history.pushState(null, '', `/newsletter-flipbook/${newsletterId}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const closeArticle = () => {
    window.history.pushState(null, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // Header, tickers and footer render straight away; only the page body waits.
  // While its code downloads, the page shows its own skeleton where it has one,
  // which then hands over seamlessly to the page's data-loading skeleton.
  const renderPage = (
    Component: React.ComponentType<any>,
    props = {},
    fallback: React.ReactNode = <PageSkeleton />
  ) => (
    <div>
      <AnnouncementBar />
      <Header initialSearchQuery={searchQuery} />
      <BreakingNews />
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
      <Footer />
    </div>
  )

  // Article detail page
  if (documentId) return renderPage(ArticleDetail, { documentId, onBack: closeArticle }, <ArticleDetailSkeleton />)

  if (flipbookDocumentId) return renderPage(OurArticlesFlipbook, { documentId: flipbookDocumentId, onBack: () => window.history.back() }, <FlipbookSkeleton />)
  if (magazineFlipbookId) return renderPage(MagazineFlipbook, { magazineId: magazineFlipbookId, onBack: () => window.history.back() }, <FlipbookSkeleton label="Opening magazine" />)
  if (newsletterFlipbookId) return renderPage(NewsletterFlipbook, { newsletterId: newsletterFlipbookId, onBack: () => window.history.back() }, <FlipbookSkeleton label="Opening newsletter" />)
  if (companyFlipbookId) return renderPage(CompanyProfileFlipbook, { profileId: companyFlipbookId, onBack: () => window.history.back() }, <FlipbookSkeleton label="Opening company profile" />)
  if (newsFlipbookId) return renderPage(NewsPdfFlipbook, { documentId: newsFlipbookId, onBack: () => window.history.back() }, <FlipbookSkeleton label="Opening report" />)

  // Category news page
  if (categorySlug) return renderPage(CategoryNews, { categorySlug }, <CategoryNewsSkeleton />)

  const isSearchPage = route === '/search'
  if (isSearchPage) return renderPage(SearchResults, { query: searchQuery, onArticleClick: openArticle })

  const isMagPage = route === '/magazines'
  const isOurArticlesPage = route === '/our-articles'
  const isNewsletterPage = route === '/newsletter-page'
  const isCompanyProfile = route === '/company-profile'
  const isServicesPage = route === '/services'
  const isInvestorCampaignsPage = route === '/investor-campaigns'
  const isNewsSyndicationPage = route === '/news-syndication'
  const isDigitalBrandingPage = route === '/digital-branding'
  const isPressOfficePage = route === '/press-office'
  const isConferenceMediaPage = route === '/conference-media'
  const isNewsletterEmailBlastPage = route === '/newsletter-email-blast'
  const isAboutUsPage = route === '/about-us'
  const isContactUsPage = route === '/contact-us'

  if (isOurArticlesPage) return renderPage(OurArticles)
  if (isMagPage) return renderPage(Magazines)
  if (isNewsletterPage) return renderPage(NewsletterPage)
  if (isCompanyProfile) return renderPage(CompanyProfiles)
  if (isServicesPage) return renderPage(Services)
  if (isInvestorCampaignsPage) return renderPage(InvestorCampaigns)
  if (isNewsSyndicationPage) return renderPage(NewsSyndication)
  if (isDigitalBrandingPage) return renderPage(DigitalBranding)
  if (isPressOfficePage) return renderPage(PressOffice)
  if (isConferenceMediaPage) return renderPage(ConferenceMediaCoverage)
  if (isNewsletterEmailBlastPage) return renderPage(NewsletterEmailBlast)
  if (isAboutUsPage) return renderPage(AboutUs)
  if (isContactUsPage) return renderPage(ContactUs)

  return (
    <div className="overflow-x-hidden">
      <AnnouncementBar />
      <Header initialSearchQuery={searchQuery} />
      <BreakingNews />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-10 sm:mb-12 lg:items-stretch">
          <LeftColumn onArticleClick={openArticle} />
          <HeroSection onArticleClick={openArticle} />
          <RightColumn onArticleClick={openArticle} />
        </section>
        <NewsGrid onArticleClick={openArticle} />
        <RegionalIntelligence />
        <EditorsPicks />
        <Newsletter />
        <OurArticlesSection onArticleClick={openFlipbook} />
        <MetalNewsSections onArticleClick={openArticle} />
      </main>

      <TrustedBrands />
      <Footer />
    </div>
  )
}
