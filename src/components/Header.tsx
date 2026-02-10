import React, { useState } from 'react'

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
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
                <h1 className="serif-title text-lg font-bold tracking-tighter mb-0">MiningDiscovery <span className="text-primary italic">UK</span></h1>
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

          <h1 className="hidden md:block serif-title text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-center mb-2">
            MiningDiscovery <span className="text-primary italic">UK</span>
          </h1>
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
            <a className="hover:text-primary transition-colors" href="#/magazines">MAGAZINE</a>
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
            <a className="text-sm font-bold hover:text-primary" href="#/magazines">MAGAZINE</a>
            <a className="text-sm font-bold hover:text-primary" href="#">ESG &amp; SUSTAINABILITY</a>
            <a className="text-sm font-bold hover:text-primary" href="#">EVENTS</a>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
