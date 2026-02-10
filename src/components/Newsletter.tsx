import React from 'react'

const Newsletter: React.FC = () => {
  return (
    <section className="bg-primary/10 dark:bg-primary/5 py-16 mt-16 border-t border-primary/20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="material-icons text-primary text-5xl mb-4">mail_outline</span>
        <h2 className="serif-title text-4xl mb-4">Stay Informed on Global Markets</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Join 25,000+ mining professionals and receive our daily digest of commodity prices and breaking news.</p>
        <form className="flex flex-col md:flex-row gap-2 max-w-xl mx-auto" onSubmit={(e)=>e.preventDefault()}>
          <input className="flex-grow p-4 bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Your corporate email address" type="email"/>
          <button className="bg-primary px-8 py-4 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20" type="submit">Subscribe Now</button>
        </form>
        <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">By subscribing you agree to our Terms of Service &amp; Privacy Policy</p>
      </div>
    </section>
  )
}

export default Newsletter
