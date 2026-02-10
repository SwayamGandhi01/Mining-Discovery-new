import React from 'react'

const highlights = [
  { title: 'The Last Frontier: Inside Congo’s Cobalt Mines', tag: 'VIDEO' },
  { title: 'Market Intelligence: Quarterly Gold Outlook', tag: 'PODCAST' },
  { title: 'Engineering Marvels: World’s Largest Excavators', tag: 'VIDEO' },
]

export default function MultimediaHighlights(): JSX.Element {
  return (
    <section className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="serif-title text-2xl font-bold mb-6">Multimedia Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((h) => (
            <div key={h.title} className="p-6 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900">
              <div className="h-36 bg-black/20 rounded mb-4 flex items-center justify-center">Thumbnail</div>
              <div className="text-xs uppercase text-primary font-extrabold mb-2">{h.tag}</div>
              <h4 className="font-bold text-lg">{h.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
