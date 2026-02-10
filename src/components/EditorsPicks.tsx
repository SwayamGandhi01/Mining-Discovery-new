import React from 'react'

const picks = [
  { title: 'The Lithium Paradox: Can We Mine Sustainably?', excerpt: 'An 8,000-word investigation into the environmental costs of battery metals.' },
  { title: 'The Silent Giants: Life Inside Autonomous Mine Fleets', excerpt: 'How automation is reshaping remote operations.' },
  { title: 'Why the City of London is Losing its Mining Grip', excerpt: 'An analysis of historic financial centres and modern resource flows.' },
]

export default function EditorsPicks(): JSX.Element {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h3 className="serif-title text-2xl font-bold mb-6">Editor’s Picks</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {picks.map((p) => (
          <article key={p.title} className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-100 dark:border-slate-800">
            <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
            <h4 className="serif-title text-lg mb-2">{p.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-300 mb-4">{p.excerpt}</p>
            <a className="text-sm font-bold hover:text-primary" href="#">Read the investigation →</a>
          </article>
        ))}
      </div>
    </section>
  )
}
