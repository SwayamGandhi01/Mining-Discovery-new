import React from 'react'

const regions = [
  { title: 'United Kingdom', excerpt: 'Cornish lithium completes landmark series C funding' },
  { title: 'Australia', excerpt: 'Waite Coal legacy: Turning old pits into green power projects' },
  { title: 'Americas', excerpt: 'Scotland Gold Mine Halts Production Amid Safety Review' },
  { title: 'Africa', excerpt: 'North Sea transition: Repurposing rigs for rare earth recovery' },
]

export default function RegionalIntelligence(): JSX.Element {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h3 className="serif-title text-2xl font-bold">Regional Intelligence</h3>
        <a className="text-primary font-bold text-sm" href="#">VIEW ALL REGIONS</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {regions.map((r) => (
          <article key={r.title} className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider mb-2">{r.title}</h4>
            <p className="serif-title text-lg leading-snug mb-4">{r.excerpt}</p>
            <a className="text-sm font-bold hover:text-primary" href="#">Read more →</a>
          </article>
        ))}
      </div>
    </section>
  )
}
