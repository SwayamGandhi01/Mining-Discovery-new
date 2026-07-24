import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 mb-12">
          <div className="col-span-1 sm:col-span-2">
            <img src="/Footer logo.webp" alt="Laura's Liaisons" className="h-14 sm:h-16 w-auto mb-4" />
            <h3 className="serif-title text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"><span className="text-primary italic"></span></h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">The leading independent news source for the global mining industry, delivering actionable intelligence and deep-dive analysis since 2008.</p>
            <div className="mb-6 text-sm text-slate-300">
              <span className="font-semibold text-primary">Email: </span>
              <a href="mailto:laura@laurastein.net" className="hover:text-white underline transition-colors">
                laura@laurastein.net
              </a>
            </div>
            <div className="flex space-x-3">
              <a 
                className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-[#0A66C2] transition-colors" 
                href="https://www.linkedin.com/in/laura-stein-b4867313" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Laura Stein on LinkedIn"
              >
                <span className="material-icons text-sm">link</span>
              </a>
              <a 
                className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-[#FF0000] transition-colors" 
                href="https://www.youtube.com/watch?v=KzyysYdoLzI" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Laura Stein YouTube Video"
              >
                <span className="material-icons text-sm">play_arrow</span>
              </a>
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
          <p>© 2024 Laura's Liaisons Media Group. All rights reserved.</p>
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
