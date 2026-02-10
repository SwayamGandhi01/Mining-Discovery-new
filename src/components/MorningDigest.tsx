import React from 'react'

export default function MorningDigest(): JSX.Element {
  return (
    <section className="bg-primary/90 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="serif-title text-4xl font-bold mb-4">The Morning Digest</h2>
        <p className="max-w-2xl mx-auto mb-6">Join 45,000+ industry professionals. Get our award-winning briefings on commodities, geopolitics and markets delivered to your inbox every morning at 06:00 AM.</p>
        <form className="flex flex-col md:flex-row items-center justify-center gap-3 max-w-xl mx-auto" onSubmit={(e)=>e.preventDefault()}>
          <input className="flex-grow p-4 rounded text-slate-900" placeholder="Email address" type="email" />
          <button className="bg-slate-900 text-white px-6 py-4 rounded font-bold">Sign Up Free</button>
        </form>
      </div>
    </section>
  )
}
