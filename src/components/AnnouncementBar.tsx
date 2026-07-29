import React, { useEffect, useState } from 'react'
import { cachedFetch } from '../utils/cachedFetch'
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

interface SocialLinks {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
}

interface AnnouncementBarProps {
  socialLinks?: SocialLinks
}

const defaultSocialLinks: SocialLinks = {
  facebook: 'https://www.facebook.com/getminingnews?mibextid=wwXIfr&rdid=1JjSArrA8LCHulpp&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17woBUaJqG%2F%3Fmibextid%3DwwXIfr#',
  twitter: 'https://x.com/MiningDiscovery?s=20',
  instagram: 'https://www.instagram.com/miningdiscovery?igsh=cGp6ZzdtNWJlbHUw',
  linkedin: 'https://www.linkedin.com/company/miningdiscovery/',
  youtube: 'https://www.youtube.com/@miningdiscovery',
}

export default function AnnouncementBar({ socialLinks = defaultSocialLinks }: AnnouncementBarProps): JSX.Element {
  const [titles, setTitles] = useState<string[]>([])

  useEffect(() => {
    const loadTitles = async () => {
      try {
        const data = await cachedFetch(
          'https://admins.miningdiscovery.com/api/news-sections?sort=publishedAt:desc&pagination[limit]=8&populate=*'
        )

        const fetchedTitles = (data?.data || [])
          .map((item: any) => String(item.title || '').trim())
          .filter(Boolean)

        setTitles(fetchedTitles)
      } catch (error) {
        console.error('AnnouncementBar load error:', error)
      }
    }

    loadTitles()
  }, [])

  return (
    <div className="w-full bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
          <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
            POPULAR THIS WEEK
          </span>
          <div className="min-w-0 overflow-hidden announcement-marquee-wrapper">
            {titles.length > 0 ? (
              <div className="announcement-marquee-track text-sm sm:text-base text-slate-200">
                {titles.map((title, index) => (
                  <span key={`title-${index}`} className="announcement-marquee-item inline-flex items-center gap-2 whitespace-nowrap">
                    <span className="hover:underline cursor-pointer">{title}</span>
                    <span className="text-slate-500">•</span>
                  </span>
                ))}
                {titles.map((title, index) => (
                  <span key={`title-dup-${index}`} className="announcement-marquee-item inline-flex items-center gap-2 whitespace-nowrap">
                    <span className="hover:underline cursor-pointer">{title}</span>
                    <span className="text-slate-500">•</span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-sm sm:text-base">Loading popular titles...</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end flex-wrap">
          <a href={socialLinks.facebook} aria-label="Facebook" className="inline-flex items-center justify-center rounded-full bg-slate-900 p-2 text-slate-100 transition hover:bg-slate-800">
            <Facebook className="h-4 w-4" />
          </a>
          <a href={socialLinks.twitter} aria-label="Twitter" className="inline-flex items-center justify-center rounded-full bg-slate-900 p-2 text-slate-100 transition hover:bg-slate-800">
            <Twitter className="h-4 w-4" />
          </a>
          <a href={socialLinks.instagram} aria-label="Instagram" className="inline-flex items-center justify-center rounded-full bg-slate-900 p-2 text-slate-100 transition hover:bg-slate-800">
            <Instagram className="h-4 w-4" />
          </a>
          <a href={socialLinks.linkedin} aria-label="LinkedIn" className="inline-flex items-center justify-center rounded-full bg-slate-900 p-2 text-slate-100 transition hover:bg-slate-800">
            <Linkedin className="h-4 w-4" />
          </a>
          <a href={socialLinks.youtube} aria-label="YouTube" className="inline-flex items-center justify-center rounded-full bg-slate-900 p-2 text-slate-100 transition hover:bg-slate-800">
            <Youtube className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
