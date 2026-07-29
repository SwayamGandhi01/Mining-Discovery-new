import React from 'react'
import SubscribeFormCard from './SubscribeFormCard'

const navigate = (path: string) => {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 items-start">
          {/* Left Column: Brand Info & Navigation Links */}
          <div className="lg:col-span-7 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
            <div className="sm:col-span-2">
              <img src="/Footer logo.webp" alt="Laura's Liaisons" className="h-14 sm:h-16 w-auto mb-4" />
              <h3 className="serif-title text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"><span className="text-primary italic"></span></h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                The leading independent news source for the global mining industry, delivering actionable intelligence and deep-dive analysis since 2008.
              </p>
              <div className="mb-6 text-sm text-slate-300">
                <span className="font-semibold text-primary">Email: </span>
                <a href="mailto:laura@laurastein.net" className="hover:text-white underline transition-colors">
                  laura@laurastein.net
                </a>
              </div>
              <div className="flex space-x-3">
                <a 
                  className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-primary transition-colors" 
                  href="mailto:laura@laurastein.net"
                  title="Email Laura Stein"
                >
                  <span className="material-icons text-sm">alternate_email</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-primary">Explore</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a className="hover:text-white" href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a></li>
                <li><a className="hover:text-white" href="/magazines" onClick={(e) => { e.preventDefault(); navigate('/magazines') }}>Magazines</a></li>
                <li><a className="hover:text-white" href="/our-articles" onClick={(e) => { e.preventDefault(); navigate('/our-articles') }}>Our Articles</a></li>
                <li><a className="hover:text-white" href="/newsletter-page" onClick={(e) => { e.preventDefault(); navigate('/newsletter-page') }}>Newsletter</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-primary">Services</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a className="hover:text-white" href="/services" onClick={(e) => { e.preventDefault(); navigate('/services') }}>Services</a></li>
                <li><a className="hover:text-white" href="/investor-campaigns" onClick={(e) => { e.preventDefault(); navigate('/investor-campaigns') }}>Investor Campaigns</a></li>
                <li><a className="hover:text-white" href="/news-syndication" onClick={(e) => { e.preventDefault(); navigate('/news-syndication') }}>News Syndication</a></li>
                <li><a className="hover:text-white" href="/digital-branding" onClick={(e) => { e.preventDefault(); navigate('/digital-branding') }}>Digital Branding</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-primary">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a className="hover:text-white" href="/about-us" onClick={(e) => { e.preventDefault(); navigate('/about-us') }}>About Us</a></li>
                <li><a className="hover:text-white" href="/company-profile" onClick={(e) => { e.preventDefault(); navigate('/company-profile') }}>Company Profile</a></li>
                <li><a className="hover:text-white" href="/contact-us" onClick={(e) => { e.preventDefault(); navigate('/contact-us') }}>Contact</a></li>
                <li><a className="hover:text-white" href="/ceo-profile" onClick={(e) => { e.preventDefault(); navigate('/ceo-profile') }}>CEO Profile</a></li>
              </ul>
            </div>
          </div>

          {/* Right Column: Daily Newsletter Form */}
          <div className="lg:col-span-4 xl:col-span-4 w-full">
            <SubscribeFormCard isCard={false} />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <p>© 2024 Laura's Liaisons Media Group. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a className="hover:text-primary" href="/about-us" onClick={(e) => { e.preventDefault(); navigate('/about-us') }}>About Us</a>
            <a className="hover:text-primary" href="/contact-us" onClick={(e) => { e.preventDefault(); navigate('/contact-us') }}>Contact</a>
            <a className="hover:text-primary" href="/services" onClick={(e) => { e.preventDefault(); navigate('/services') }}>Services</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
