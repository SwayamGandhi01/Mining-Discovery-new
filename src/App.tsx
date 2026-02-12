import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import LeftColumn from './components/LeftColumn'
import HeroSection from './components/HeroSection'
import RightColumn from './components/RightColumn'
import NewsGrid from './components/NewsGrid'
import RegionalIntelligence from './components/RegionalIntelligence'
import MultimediaHighlights from './components/MultimediaHighlights'
import EditorsPicks from './components/EditorsPicks'
import MagazineProfiles from './components/MagazineProfiles'
import MorningDigest from './components/MorningDigest'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import BreakingNews from './components/BreakingNews'
import Magazines from './pages/Magazines'
import ArticleDetail from './pages/ArticleDetail'
import CEOProfiles from './pages/CEOProfiles'
import CompanyProfiles from './pages/CompanyProfiles'
import CategoryNews from './pages/CategoryNews'
import Services from './pages/Services'
import InvestorCampaigns from './pages/InvestorCampaigns'
import NewsSyndication from './pages/NewsSyndication'
import DigitalBranding from './pages/DigitalBranding'
import PressOffice from './pages/PressOffice'
import ConferenceMediaCoverage from './pages/ConferenceMediaCoverage'
import NewsletterEmailBlast from './pages/NewsletterEmailBlast'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'

// Placeholder components for magazine dropdown pages


const NewsletterPage = () => (
  <div>
    <Newsletter />
  </div>
)



export default function App(): JSX.Element {
  const [route, setRoute] = useState<string>(window.location.hash || '')
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [categorySlug, setCategorySlug] = useState<string | null>(null)

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash || ''
      setRoute(hash)
      console.log('Hash changed:', hash)

      // Parse documentId from hash like #/article/sx6gn6ckwbiljfpq226eqzbz
      const articleMatch = hash.match(/#\/article\/(.+)$/)
      if (articleMatch) {
        console.log('Detected article:', articleMatch[1])
        setDocumentId(articleMatch[1])
        setCategorySlug(null)
      } else {
        setDocumentId(null)
      }

      // Parse category slug from hash like #/news/evening-chatter
      const categoryMatch = hash.match(/#\/news\/([^/]+)$/)
      if (categoryMatch) {
        console.log('Detected category:', categoryMatch[1])
        setCategorySlug(categoryMatch[1])
      } else {
        setCategorySlug(null)
      }
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const openArticle = (docId: string) => {
    window.location.hash = `#/article/${docId}`
  }

  const closeArticle = () => {
    window.location.hash = '#'
  }

  // Article detail page
  if (documentId) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <ArticleDetail documentId={documentId} onBack={closeArticle} />
        <Footer />
      </div>
    )
  }

  // Category news page
  if (categorySlug) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <CategoryNews categorySlug={categorySlug} />
        <Footer />
      </div>
    )
  }

  const isMagPage = route === '#/magazines' || window.location.pathname === '/magazines'
  const isCEOProfile = route === '#/ceo-profile'
  const isNewsletterPage = route === '#/newsletter-page'
  const isCompanyProfile = route === '#/company-profile'
  const isServicesPage = route === '#/services'
  const isInvestorCampaignsPage = route === '#/investor-campaigns'
  const isNewsSyndicationPage = route === '#/news-syndication'
  const isDigitalBrandingPage = route === '#/digital-branding'
  const isPressOfficePage = route === '#/press-office'
  const isConferenceMediaPage = route === '#/conference-media'
  const isNewsletterEmailBlastPage = route === '#/newsletter-email-blast'
  const isAboutUsPage = route === '#/about-us'
  const isContactUsPage = route === '#/contact-us'


  if (isCEOProfile) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <CEOProfiles />
        <Footer />
      </div>
    )
  }

  if (isNewsletterPage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <NewsletterPage />
        <Footer />
      </div>
    )
  }

  if (isCompanyProfile) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <CompanyProfiles />
        <Footer />
      </div>
    )
  }

  if (isServicesPage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <Services />
        <Footer />
      </div>
    )
  }

  if (isInvestorCampaignsPage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <InvestorCampaigns />
        <Footer />
      </div>
    )
  }

  if (isNewsSyndicationPage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <NewsSyndication />
        <Footer />
      </div>
    )
  }

  if (isDigitalBrandingPage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <DigitalBranding />
        <Footer />
      </div>
    )
  }

  if (isPressOfficePage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <PressOffice />
        <Footer />
      </div>
    )
  }

  if (isConferenceMediaPage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <ConferenceMediaCoverage />
        <Footer />
      </div>
    )
  }

  if (isNewsletterEmailBlastPage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <NewsletterEmailBlast />
        <Footer />
      </div>
    )
  }

  if (isAboutUsPage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <AboutUs />
        <Footer />
      </div>
    )
  }

  if (isContactUsPage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <ContactUs />
        <Footer />
      </div>
    )
  }

  if (isMagPage) {
    return (
      <div>
        <Header />
        <BreakingNews />
        <Magazines />
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <BreakingNews />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <LeftColumn onArticleClick={openArticle} />
          <HeroSection onArticleClick={openArticle} />
          <RightColumn onArticleClick={openArticle} />
        </section>
        <NewsGrid onArticleClick={openArticle} />
        <RegionalIntelligence />
        <EditorsPicks />
        <MagazineProfiles />
      </main>
      <MorningDigest />
      <Newsletter />
      <Footer />
    </div>
  )
}
