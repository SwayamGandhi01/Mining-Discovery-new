import React, { useState, useEffect } from 'react'

interface NewsCategory {
  id: number
  documentId: string
  category: string
  slug: string
}

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [magazineDropdownOpen, setMagazineDropdownOpen] = useState(false)
  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [categories, setCategories] = useState<NewsCategory[]>([])

  const servicesMenuItems = [
    { label: 'Investor Campaign', href: '#/investor-campaigns' },
    { label: 'YouTube', href: 'https://www.youtube.com/@miningdiscovery?si=t0TMA3H1QN-Jgu0j' },
    { label: 'News Syndication', href: '#/news-syndication' },
    { label: 'Conference Media Coverage', href: '#/conference-media' },
    { label: 'Digital Branding', href: '#/digital-branding' },
    { label: 'Newsletter & Email Blast', href: '#/newsletter-email-blast' },
    { label: 'Press Office', href: '#/press-office' },
  ]

  const magazineMenuItems = [
    { label: 'Magazine', href: '#/magazines' },
    { label: 'CEO Profile', href: '#/ceo-profile' },
    { label: 'Newsletter', href: '#/newsletter-page' },
    { label: 'Company Profile', href: '#/company-profile' },
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          'https://admins.miningdiscovery.com/api/news-categories?pagination[limit]=100'
        )
        if (res.ok) {
          const data = await res.json()
          setCategories(data?.data || [])
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [])
  return (
    <header className="border-b border-primary/20 bg-white dark:bg-background-dark/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-widest font-semibold border-b border-slate-100 dark:border-slate-800">
          {/* top strip kept for spacing; edition links moved next to logo */}
          <div />
        </div>

        <div className="py-4 px-4 flex items-center justify-between md:flex-row">
          {/* Logo - Left side */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Mining Discovery" className="h-16 w-auto" />
            </a>
          </div>

          {/* Edition - Center */}
          <div className="hidden md:flex items-center text-sm uppercase tracking-widest text-slate-500 space-x-3 flex-grow justify-center">
            <span className="text-primary font-bold">Edition:</span>
            <a className="hover:text-primary border-b-2 border-primary" href="#">UK</a>
            <a className="text-slate-400 hover:text-primary" href="#">AUSTRALIA</a>
            <a className="text-slate-400 hover:text-primary" href="#">CANADA</a>
            <a className="text-slate-400 hover:text-primary" href="#">AFRICA</a>
          </div>

          {/* Mobile menu button - Right side */}
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="md:hidden p-2.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0">
            <span className="material-icons">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Navigation - Full width below */}
        <div className="hidden md:flex border-t border-slate-200 dark:border-slate-800">
          <nav className="flex items-center space-x-8 text-sm font-bold w-full justify-center py-3 px-4">
            {/* News Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setNewsDropdownOpen(true)}
              onMouseLeave={() => setNewsDropdownOpen(false)}
            >
              <button className="hover:text-primary transition-colors flex items-center gap-1">
                NEWS
                <svg className={`w-4 h-4 transition-transform ${newsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              
              {newsDropdownOpen && (
                <div className="absolute top-full left-0 pt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 min-w-max z-50 max-h-96 overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <a
                        key={category.id}
                        href={`#/news/${category.slug}`}
                        onClick={() => setNewsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors"
                      >
                        {category.category}
                      </a>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-slate-500">Loading categories...</div>
                  )}
                </div>
              )}
            </div>
            
            <a className="hover:text-primary transition-colors" href="#/about-us">ABOUT US</a>
            
            {/* Services Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button className="hover:text-primary transition-colors flex items-center gap-1">
                SERVICES
                <svg className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 pt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 min-w-max z-50">
                  {servicesMenuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setServicesDropdownOpen(false)}
                      className="block px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            {/* Magazine Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setMagazineDropdownOpen(true)}
              onMouseLeave={() => setMagazineDropdownOpen(false)}
            >
              <button className="hover:text-primary transition-colors flex items-center gap-1">
                MAGAZINE
                <svg className={`w-4 h-4 transition-transform ${magazineDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              
              {magazineDropdownOpen && (
                <div className="absolute top-full left-0 pt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 min-w-max z-50">
                  {magazineMenuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMagazineDropdownOpen(false)}
                      className="block px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <a className="hover:text-primary transition-colors" href="#/contact-us">CONTACT US</a>
          </nav>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden bg-white dark:bg-background-dark/80 border-t border-slate-200 dark:border-slate-800 px-4 py-4">
          {/* mobile edition selector */}
          <div className="text-sm uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-4">
            <span className="text-primary font-bold">Edition:</span>
            <a className="hover:text-primary border-b-2 border-primary" href="#">UK</a>
            <a className="text-slate-800 hover:text-primary" href="#">AUSTRALIA</a>
            <a className="text-slate-800 hover:text-primary" href="#">CANADA</a>
            <a className="text-slate-800 hover:text-primary" href="#">AFRICA</a>
          </div>
          <nav className="flex flex-col space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            {/* Mobile News Dropdown */}
            <div>
              <button 
                onClick={() => setNewsDropdownOpen(!newsDropdownOpen)}
                className="text-sm font-bold hover:text-primary w-full text-left flex items-center justify-between"
              >
                NEWS
                <svg className={`w-4 h-4 transition-transform ${newsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {newsDropdownOpen && (
                <div className="mt-2 ml-4 space-y-2 max-h-60 overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <a
                        key={category.id}
                        href={`#/news/${category.slug}`}
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                      >
                        {category.category}
                      </a>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">Loading categories...</div>
                  )}
                </div>
              )}
            </div>
            
            <a className="text-sm font-bold hover:text-primary" href="#/about-us">ABOUT US</a>
            
            {/* Mobile Services Dropdown */}
            <div>
              <button 
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className="text-sm font-bold hover:text-primary w-full text-left flex items-center justify-between"
              >
                SERVICES
                <svg className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {servicesDropdownOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  {servicesMenuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mobile Magazine Dropdown */}
            <div>
              <button 
                onClick={() => setMagazineDropdownOpen(!magazineDropdownOpen)}
                className="text-sm font-bold hover:text-primary w-full text-left flex items-center justify-between"
              >
                MAGAZINE
                <svg className={`w-4 h-4 transition-transform ${magazineDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {magazineDropdownOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  {magazineMenuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <a className="text-sm font-bold hover:text-primary" href="#/contact-us">CONTACT US</a>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
