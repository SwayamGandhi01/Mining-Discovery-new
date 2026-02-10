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

export default function App(): JSX.Element {
  const [route, setRoute] = useState<string>(window.location.hash || '')

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const isMagPage = route === '#/magazines' || window.location.pathname === '/magazines'

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
          <LeftColumn />
          <HeroSection />
          <RightColumn />
        </section>
        <NewsGrid />
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
