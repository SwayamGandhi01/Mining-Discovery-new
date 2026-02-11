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

// Placeholder components for magazine dropdown pages
const DigitalEdition = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <h1 className="serif-title text-4xl mb-6">Digital Edition</h1>
    <p className="text-slate-600">Digital Edition content coming soon...</p>
  </div>
)

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

      // Parse documentId from hash like #/article/sx6gn6ckwbiljfpq226eqzbz
      const articleMatch = hash.match(/#\/article\/(.+)$/)
      if (articleMatch) {
        setDocumentId(articleMatch[1])
        setCategorySlug(null)
      } else {
        setDocumentId(null)
      }

      // Parse category slug from hash like #/news/latest-news
      const categoryMatch = hash.match(/#\/news\/(.+)$/)
      if (categoryMatch) {
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
        <CategoryNews />
        <Footer />
      </div>
    )
  }

  const isMagPage = route === '#/magazines' || window.location.pathname === '/magazines'
  const isCEOProfile = route === '#/ceo-profile'
  const isNewsletterPage = route === '#/newsletter-page'
  const isCompanyProfile = route === '#/company-profile'


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
        <MultimediaHighlights />
        <EditorsPicks />
        <MagazineProfiles />
      </main>
      <MorningDigest />
      <Newsletter />
      <Footer />
    </div>
  )
}
