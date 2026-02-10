import React, { useState } from 'react'

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <header className="border-b border-primary/20 bg-white dark:bg-background-dark/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-widest font-semibold border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <span className="text-primary">Edition:</span>
            <div className="flex space-x-3">
              <a className="hover:text-primary border-b-2 border-primary" href="#">UK</a>
              <a className="text-slate-400 hover:text-primary" href="#">AUSTRALIA</a>
              <a className="text-slate-400 hover:text-primary" href="#">CANADA</a>
              <a className="text-slate-400 hover:text-primary" href="#">AFRICA</a>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="flex items-center gap-1 hover:text-primary"><span className="material-icons text-sm">search</span> Search</button>
            <a className="bg-primary px-3 py-1 text-white rounded hover:bg-primary/90 transition-colors" href="#">Subscribe</a>
            <a className="hover:text-primary" href="#">Login</a>
          </div>
        </div>

        <div className="py-6 px-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between md:hidden mb-4">
            <div className="flex items-center gap-3">
              <h1 className="serif-title text-2xl font-bold tracking-tighter mb-0">MiningDiscovery <span className="text-primary italic">UK</span></h1>
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="mobile-menu" className="p-2 rounded-md bg-slate-100 dark:bg-slate-800">
              <span className="material-icons">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>

          <h1 className="serif-title text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-center mb-2">
            MiningDiscovery <span className="text-primary italic">UK</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-6">The Global Authority in Resource Extraction &amp; Market Intelligence</p>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-bold border-y border-slate-200 dark:border-slate-800 w-full justify-center py-3">
            <a className="hover:text-primary transition-colors" href="#">LATEST NEWS</a>
            <a className="hover:text-primary transition-colors" href="#">MARKETS</a>
            <a className="hover:text-primary transition-colors" href="#">COMMODITIES</a>
            <a className="hover:text-primary transition-colors" href="#">MAGAZINE</a>
            <a className="hover:text-primary transition-colors" href="#">ESG &amp; SUSTAINABILITY</a>
            <a className="hover:text-primary transition-colors" href="#">EVENTS</a>
          </nav>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden bg-white dark:bg-background-dark/80 border-t border-slate-200 dark:border-slate-800 px-4 py-4">
          <nav className="flex flex-col space-y-3">
            <a className="text-sm font-bold hover:text-primary" href="#">LATEST NEWS</a>
            <a className="text-sm font-bold hover:text-primary" href="#">MARKETS</a>
            <a className="text-sm font-bold hover:text-primary" href="#">COMMODITIES</a>
            <a className="text-sm font-bold hover:text-primary" href="#">MAGAZINE</a>
            <a className="text-sm font-bold hover:text-primary" href="#">ESG &amp; SUSTAINABILITY</a>
            <a className="text-sm font-bold hover:text-primary" href="#">EVENTS</a>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
