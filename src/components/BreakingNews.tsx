import React from 'react'

export default function BreakingNews(): JSX.Element {
  const text = 'Rio Tinto signals interest in further copper acquisitions as demand surges · Gold prices hit record high amid geopolitical tensions · Markets react to latest supply updates'
  return (
    <div className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-2">
        <span className="bg-yellow-400 text-black font-bold text-xs px-2 py-1">BREAKING NEWS</span>
        <div className="flex-1 overflow-hidden">
          <div className="breaking-ticker-wrapper">
            <div className="breaking-ticker-content text-sm md:text-base">
              <span className="mr-8">{text}</span>
              <span className="mr-8">{text}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
