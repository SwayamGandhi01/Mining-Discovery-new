import React, { useState } from 'react'

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [magazineDropdownOpen, setMagazineDropdownOpen] = useState(false)

  const magazineMenuItems = [
    { label: 'Magazine', href: '#/magazines' },
    { label: 'Digital Edition', href: '#/digital-edition' },
    { label: 'CEO Profile', href: '#/ceo-profile' },
    { label: 'Newsletter', href: '#/newsletter-page' },
    { label: 'Company Profile', href: '#/company-profile' },
  ]
  return (
    <header className="border-b border-primary/20 bg-white dark:bg-background-dark/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-widest font-semibold border-b border-slate-100 dark:border-slate-800">
          {/* top strip kept for spacing; edition links moved next to logo */}
          <div />
        </div>

        <div className="py-6 px-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between md:hidden mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Mining Discovery" className="h-10 w-auto" />
                <div className="text-sm uppercase tracking-widest text-slate-500 hidden sm:flex items-center gap-2">
                  <span className="text-primary font-bold">Edition:</span>
                  <a className="hover:text-primary border-b-2 border-primary" href="#">UK</a>
                  <a className="text-slate-800 hover:text-primary" href="#">AUSTRALIA</a>
                  <a className="text-slate-800 hover:text-primary" href="#">CANADA</a>
                  <a className="text-slate-800 hover:text-primary" href="#">AFRICA</a>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                <span className="material-icons">{mobileOpen ? 'close' : 'menu'}</span>
              </button>
            </div>
          </div>

          <img src="/logo.png" alt="Mining Discovery" className="hidden md:block h-20 w-auto mb-2" />
          <p className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-6">The Global Authority in Resource Extraction &amp; Market Intelligence</p>

          <div className="hidden md:flex items-center justify-center text-sm uppercase tracking-widest text-slate-500 space-x-4 mb-6">
            <span className="text-primary font-bold">Edition:</span>
            <a className="hover:text-primary border-b-2 border-primary" href="#">UK</a>
            <a className="text-slate-400 hover:text-primary" href="#">AUSTRALIA</a>
            <a className="text-slate-400 hover:text-primary" href="#">CANADA</a>
            <a className="text-slate-400 hover:text-primary" href="#">AFRICA</a>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-bold border-y border-slate-200 dark:border-slate-800 w-full justify-center py-3">
            <a className="hover:text-primary transition-colors" href="#">LATEST NEWS</a>
            <a className="hover:text-primary transition-colors" href="#">MARKETS</a>
            <a className="hover:text-primary transition-colors" href="#">COMMODITIES</a>
            
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
            
            <a className="hover:text-primary transition-colors" href="#">ESG &amp; SUSTAINABILITY</a>
            <a className="hover:text-primary transition-colors" href="#">EVENTS</a>
          </nav>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden bg-white dark:bg-background-dark/80 border-t border-slate-200 dark:border-slate-800 px-4 py-4">
          {/* mobile actions removed: search / subscribe / login */}
          <nav className="flex flex-col space-y-3">
            <a className="text-sm font-bold hover:text-primary" href="#">LATEST NEWS</a>
            <a className="text-sm font-bold hover:text-primary" href="#">MARKETS</a>
            <a className="text-sm font-bold hover:text-primary" href="#">COMMODITIES</a>
            
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
            
            <a className="text-sm font-bold hover:text-primary" href="#">ESG &amp; SUSTAINABILITY</a>
            <a className="text-sm font-bold hover:text-primary" href="#">EVENTS</a>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
