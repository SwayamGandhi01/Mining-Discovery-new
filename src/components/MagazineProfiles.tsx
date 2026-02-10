import React from 'react'

const profiles = [
  { name: 'Sarah Jenkins', title: 'Editor-in-Chief' },
  { name: 'Marcus Thorne', title: 'Markets Editor' },
  { name: 'Mercator Resources', title: 'Contributor' },
]

export default function MagazineProfiles(): JSX.Element {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-extrabold text-primary uppercase mb-4">The Magazine</h4>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-48 h-64 bg-slate-200 dark:bg-slate-800 rounded" />
            <div>
              <h3 className="serif-title text-2xl font-bold mb-2">Winter 2024 Issue</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Our quarterly flagship publication featuring exclusive interviews with CEOs and detailed sector analysis.</p>
              <div className="mt-6">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold">Read Digital Edition</button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-extrabold text-primary uppercase mb-4">Power Players & Profiles</h4>
          <ul className="space-y-4">
            {profiles.map((p) => (
              <li key={p.name} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.title}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
