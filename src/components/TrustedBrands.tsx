import React from 'react'

interface ClientLogo {
  id: number
  name: string
  src: string
}

const CLIENT_LOGOS: ClientLogo[] = [
  { id: 1, name: '1911 Gold Corporation', src: "/clients/1911-gold-corporation-tsxv-aumb.webp" },
  { id: 2, name: 'Blue Lagoon Resources', src: "/clients/Blue-Lagoon-Logo@2x.webp" },
  { id: 3, name: 'Chilean Metals', src: "/clients/Chilean-Metals-Logo-2025-Small-300x98 (1).png" },
  { id: 4, name: 'Hunt Mining', src: "/clients/Hunt-logo-White.jpg.jpeg" },
  { id: 5, name: 'NorthPeak Resources', src: "/clients/NorthPeak-logo.svg" },
  { id: 6, name: 'Power Metallic Mines', src: "/clients/power_metallic_logo_colour_300px2.webp" },
  { id: 7, name: 'Apollo Silver Corp', src: "/clients/apollo-silver-tsxv-apgo.webp" },
  { id: 8, name: 'Honey Badger Mining', src: "/clients/honey_badger_exploration_inc_tuf__logo.jpg.jpeg" },
  { id: 9, name: 'RG Gold', src: "/clients/RG-Logo-secondary.png" },
  { id: 10, name: 'WAM Resources', src: "/clients/wam.png" },
  { id: 11, name: 'Power Metallic Inc', src: "/clients/Power Metallic Mines Inc--POWER METALLIC ANNOUNCES CLOSING of PR.jpg.jpeg" },
  { id: 12, name: 'Global Mining Partner', src: "/clients/Logo (8).png" },
  { id: 13, name: 'Mining Partner', src: "/clients/1712101152961.jpg.jpeg" },
  { id: 14, name: 'Resource Brand', src: "/clients/image (1).webp" },
  { id: 15, name: 'Exploration Group', src: "/clients/images (3).png" },
  { id: 16, name: 'Mining Exploration', src: "/clients/images (4).png" },
  { id: 17, name: 'Energy Partner', src: "/clients/logo (1).png" },
  { id: 18, name: 'Global Resources', src: "/clients/logo (1).svg" },
  { id: 19, name: 'Mineral Corp', src: "/clients/logo (2).png" },
  { id: 20, name: 'Mining Discovery Partner', src: "/clients/logo-md (1).webp" },
  { id: 21, name: 'Header Partner', src: "/clients/logoHeader (1).png" },
]

export default function TrustedBrands(): JSX.Element {
  // Duplicate array for seamless infinite marquee loop
  const marqueeLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS]

  return (
    <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900/70 border-t border-slate-200/80 dark:border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
            OUR CLIENTS &amp; PARTNERS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Our Trusted Brands
          </h2>
          <div className="w-14 h-1 bg-primary mx-auto rounded-full mt-3" />
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Trusted relationships with top junior exploration, production, and energy companies worldwide.
          </p>
        </div>

        {/* Auto-scrolling logo marquee track with fade gradient edges */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Left & Right gradient fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-slate-50 dark:from-slate-900/70 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-slate-50 dark:from-slate-900/70 to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="logo-marquee-track">
            {marqueeLogos.map((brand, idx) => (
              <div
                key={`${brand.id}-${idx}`}
                className="w-44 sm:w-52 flex-shrink-0 flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="h-16 w-full flex items-center justify-center p-2">
                  <img
                    src={brand.src}
                    alt={brand.name}
                    className="max-h-12 max-w-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement
                      if (parent) parent.style.display = 'none'
                    }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center line-clamp-1 mt-1">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
