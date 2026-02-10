import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <h3 className="serif-title text-3xl font-bold mb-6">MiningDiscovery <span className="text-primary italic">UK</span></h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">The leading independent news source for the global mining industry, delivering actionable intelligence and deep-dive analysis since 2008.</p>
            <div className="flex space-x-4">
              <a className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-primary transition-colors" href="#"><span className="material-icons text-sm">facebook</span></a>
              <a className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-primary transition-colors" href="#"><span className="material-icons text-sm">alternate_email</span></a>
              <a className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-primary transition-colors" href="#"><span className="material-icons text-sm">podcasts</span></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-primary">News</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a className="hover:text-white" href="#">Gold &amp; Silver</a></li>
              <li><a className="hover:text-white" href="#">Copper &amp; Zinc</a></li>
              <li><a className="hover:text-white" href="#">Energy Minerals</a></li>
              <li><a className="hover:text-white" href="#">ESG Reports</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-primary">Regions</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a className="hover:text-white" href="#">United Kingdom</a></li>
              <li><a className="hover:text-white" href="#">Australia &amp; Asia</a></li>
              <li><a className="hover:text-white" href="#">Americas</a></li>
              <li><a className="hover:text-white" href="#">Africa</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-primary">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a className="hover:text-white" href="#">About Us</a></li>
              <li><a className="hover:text-white" href="#">Editorial Team</a></li>
              <li><a className="hover:text-white" href="#">Advertise</a></li>
              <li><a className="hover:text-white" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-primary">Account</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a className="hover:text-white" href="#">Subscribe</a></li>
              <li><a className="hover:text-white" href="#">My Account</a></li>
              <li><a className="hover:text-white" href="#">Gift Subscriptions</a></li>
              <li><a className="hover:text-white" href="#">Help Center</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <p>© 2024 MiningDiscovery Media Group. All rights reserved.</p>
          <div className="flex space-x-6">
            <a className="hover:text-primary" href="#">Privacy Policy</a>
            <a className="hover:text-primary" href="#">Terms of Service</a>
            <a className="hover:text-primary" href="#">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
