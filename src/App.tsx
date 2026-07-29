import React, { useEffect, useState, lazy, Suspense } from 'react'
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

// Lazy-loaded page components for optimal bundle splitting
const Magazines = lazy(() => import('./pages/Magazines'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const CEOProfiles = lazy(() => import('./pages/CEOProfiles'))
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
const SearchResults = lazy(() => import('./pages/SearchResults'))

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
)

// Placeholder components for magazine dropdown pages


const NewsletterPage = () => (
  <div>
    <Newsletter />
  </div>
)



export default function App(): JSX.Element {
  const [route, setRoute] = useState<string>(window.location.pathname || '/')
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('q')?.trim() || ''
  })
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [categorySlug, setCategorySlug] = useState<string | null>(null)
  const [flipbookDocumentId, setFlipbookDocumentId] = useState<string | null>(null)
  const [magazineFlipbookId, setMagazineFlipbookId] = useState<string | null>(null)
  const [newsletterFlipbookId, setNewsletterFlipbookId] = useState<string | null>(null)

  useEffect(() => {
    const onRoute = () => {
      const path = window.location.pathname || '/'
      setRoute(path)

      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      })

      const params = new URLSearchParams(window.location.search)
      setSearchQuery(params.get('q')?.trim() || '')

      // Parse documentId from path like /article/sx6gn6ckwbiljfpq226eqzbz
      const articleMatch = path.match(/^\/article\/(.+)$/)
      if (articleMatch) {
        setDocumentId(articleMatch[1])
        setCategorySlug(null)
        setFlipbookDocumentId(null)
      } else {
        setDocumentId(null)
      }

      const flipbookMatch = path.match(/^\/flipbook\/(.+)$/)
      if (flipbookMatch) {
        setFlipbookDocumentId(flipbookMatch[1])
        setMagazineFlipbookId(null)
        setDocumentId(null)
        setCategorySlug(null)
      } else if (!articleMatch) {
        setFlipbookDocumentId(null)
      }

      const magazineFlipbookMatch = path.match(/^\/magazine-flipbook\/(.+)$/)
      if (magazineFlipbookMatch) {
        setMagazineFlipbookId(magazineFlipbookMatch[1])
        setNewsletterFlipbookId(null)
        setFlipbookDocumentId(null)
        setDocumentId(null)
        setCategorySlug(null)
      } else if (!flipbookMatch) {
        setMagazineFlipbookId(null)
      }

      const newsletterFlipbookMatch = path.match(/^\/newsletter-flipbook\/(.+)$/)
      if (newsletterFlipbookMatch) {
        setNewsletterFlipbookId(newsletterFlipbookMatch[1])
        setMagazineFlipbookId(null)
        setFlipbookDocumentId(null)
        setDocumentId(null)
        setCategorySlug(null)
      } else if (!magazineFlipbookMatch && !flipbookMatch) {
        setNewsletterFlipbookId(null)
      }

      // Parse category slug from path like /news/evening-chatter
      const categoryMatch = path.match(/^\/news\/([^/]+)$/)
      if (categoryMatch) {
        setCategorySlug(categoryMatch[1])
      } else {
        setCategorySlug(null)
      }
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

  const renderPage = (Component: React.ComponentType<any>, props = {}) => (
    <div>
      <AnnouncementBar />
      <Header initialSearchQuery={searchQuery} />
      <BreakingNews />
      <Suspense fallback={<PageFallback />}>
        <Component {...props} />
      </Suspense>
      <Footer />
    </div>
  )

  // Article detail page
  if (documentId) return renderPage(ArticleDetail, { documentId, onBack: closeArticle })

  if (flipbookDocumentId) return renderPage(OurArticlesFlipbook, { documentId: flipbookDocumentId, onBack: () => window.history.back() })
  if (magazineFlipbookId) return renderPage(MagazineFlipbook, { magazineId: magazineFlipbookId, onBack: () => window.history.back() })
  if (newsletterFlipbookId) return renderPage(NewsletterFlipbook, { newsletterId: newsletterFlipbookId, onBack: () => window.history.back() })

  // Category news page
  if (categorySlug) return renderPage(CategoryNews, { categorySlug })

  const isSearchPage = route === '/search'
  if (isSearchPage) return renderPage(SearchResults, { query: searchQuery, onArticleClick: openArticle })

  const isMagPage = route === '/magazines'
  const isOurArticlesPage = route === '/our-articles'
  const isCEOProfile = route === '/ceo-profile'
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
  if (isCEOProfile) return renderPage(CEOProfiles)
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
