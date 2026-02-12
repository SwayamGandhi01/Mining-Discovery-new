import React, { useState } from 'react'

interface SyndicationContent {
  title: string
  description: string
}

interface ProcessStep {
  number: string
  title: string
  description: string
}

interface Channel {
  number: string
  name: string
  description: string
  details: string[]
}

interface WhyChoose {
  icon: string
  title: string
  description: string
}

interface AmplificationTool {
  title: string
  description: string
}

const NewsSyndication: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  })

  const syndicationContent: SyndicationContent[] = [
    {
      title: 'Press Releases',
      description: 'Timely updates, regulatory announcements and partnership news crafted for clarity and reach.',
    },
    {
      title: 'Industry Articles & Thought Leadership',
      description: 'Position leaders and spokesperson with expert, fresh, and common commentary that builds thought.',
    },
    {
      title: 'Exploration & Project Reporting',
      description: 'Technical and non-technical updates that explain project status and timelines to investors.',
    },
    {
      title: 'Market Reports & Forecasts',
      description: 'Statistical commentary and forecasts giving investors real transparency and market context.',
    },
    {
      title: 'Product Launch Announcements',
      description: 'Newsworthy updates that communicate new product and company programs.',
    },
    {
      title: 'Sustainability & ESG Updates',
      description: 'Impactful reporting that communicate commitments, achievements, and governance programs.',
    },
  ]

  const processSteps: ProcessStep[] = [
    {
      number: '1',
      title: 'Submit Your News',
      description: 'Send your content pitches to our news submission portal to start the process.',
    },
    {
      number: '2',
      title: 'Editorial Review',
      description: 'Our mining experienced editors evaluate relevance to audience interest and fit.',
    },
    {
      number: '3',
      title: 'Multichannel Publishing',
      description: 'Pushed across eMailers, email newsletters and partner networks.',
    },
    {
      number: '4',
      title: 'Performance Tracking',
      description: 'Real-time reach, engagement, clicks and leads metrics in detailed reports.',
    },
  ]

  const channels: Channel[] = [
    {
      number: '1',
      name: 'MiningDiscovery.com',
      description: 'Daily traffic on our published mining news and content',
      details: ['Home Page', 'Category Pages', 'Newsletter'],
    },
    {
      number: '2',
      name: 'Mining Discovery Newsletter',
      description: 'Broad readership from our audiences subscribers',
      details: ['Daily Newsletter', 'Weekly Analysis', 'Alerts'],
    },
    {
      number: '3',
      name: 'Email Newsletters',
      description: 'Targeted audience to contract daily news and industry insights',
      details: ['Sector Based', 'Regional Focused', 'Curated'],
    },
    {
      number: '4',
      name: 'Substack Channel',
      description: 'Your content placed for expanded readership and visibility',
      details: ['Direct Delivery', 'Engaged Readers', 'Archives'],
    },
    {
      number: '5',
      name: 'Social Media',
      description: 'Platform optimization for organic and paid sharing',
      details: ['LinkedIn', 'X/Twitter', 'YouTube', 'Instagram'],
    },
  ]

  const whyChoose: WhyChoose[] = [
    {
      icon: '🎯',
      title: 'Targeted Audience',
      description: 'Reach investors, executives and partners who are mining industry information.',
    },
    {
      icon: '🌐',
      title: 'Global + Local',
      description: 'Worldwide distribution with local relevance through unique stories, languages, and nuances.',
    },
    {
      icon: '⚡',
      title: 'Speed & Quality',
      description: 'Fast turnaround supported by specialists who understand timing, messaging and details.',
    },
    {
      icon: '🔍',
      title: 'SEO Visibility',
      description: 'Content optimized to surface in search results and drive top-line discovery.',
    },
    {
      icon: '🚀',
      title: 'Boost Options',
      description: 'Paid amplification to push critical updates to broader audience visibility further.',
    },
    {
      icon: '📊',
      title: 'Transparent Reporting',
      description: 'Clear metrics on your real time news and other content articles and leads data.',
    },
  ]

  const amplificationTools: AmplificationTool[] = [
    {
      title: 'Email Campaigns & Newsletters',
      description: 'Strategy, editorial calendar and distribution through Mining Discovery network.',
    },
    {
      title: 'Substack Setup & Management',
      description: 'Strategy, editorial calendar and associated growth to create subscribers, audience and lists.',
    },
    {
      title: 'Social Media Syndication',
      description: 'Organic search traffic and scheduling that will enhance site- relevant digital and organic.',
    },
  ]

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">News Syndication</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-amber-400">
            Mining News Amplified
          </h2>
          <p className="text-lg mb-8 text-slate-300 max-w-3xl mx-auto">
            At Mining Discovery we don't just see news—we amplify it. Ready for your update. From press releases to market forecasts, we put your story partners, regulators and industry insiders.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded font-semibold transition">
              Submit Your Story
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded font-semibold transition">
              See Syndication Options
            </button>
          </div>
        </div>
      </section>

      {/* What Can Be Syndicated */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">What Can Be Syndicated</h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          We syndicate, rebrand and distribute for a wide range of content formats—each tailored to member audiences and reach discoverability.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {syndicationContent.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-6 hover:bg-slate-800 dark:hover:bg-slate-700 transition"
            >
              <h3 className="font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-sm text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Process */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">Our Process - Simple & Transparent</h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Fast and effortless to reporting — a clear workflow that keeps you informed and in control.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center"
              >
                <div className="w-12 h-12 bg-slate-900 dark:bg-slate-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {step.number}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where Your Content Gets Featured */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Where Your Content Gets Featured</h2>
        <p className="text-center text-amber-600 dark:text-amber-500 mb-8 text-sm">
          Open-door channels tailored to different kinds of content and audiences
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {channels.map((channel, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            >
              <div className="w-8 h-8 bg-slate-900 dark:bg-slate-700 text-white rounded flex items-center justify-center mb-3 font-bold text-sm">
                {channel.number}
              </div>
              <h3 className="font-bold mb-1">{channel.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{channel.description}</p>
              <ul className="text-xs space-y-1">
                {channel.details.map((detail, didx) => (
                  <li key={didx} className="text-amber-600 dark:text-amber-500">
                    • {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Our Syndication */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">Why Choose Our Syndication?</h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            The complete value delivered through STRENGTH and flexibility to your content matters
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 border-l-4 border-amber-600 rounded-lg p-6"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amplification Tools */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Amplification Tools</h2>
        <p className="text-center text-amber-600 dark:text-amber-500 text-sm mb-8">
          Additional services to do extend reach and engagement
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {amplificationTools.map((tool, idx) => (
            <div
              key={idx}
              className="bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-6"
            >
              <h3 className="font-bold text-lg mb-3">{tool.title}</h3>
              <p className="text-sm text-slate-300">{tool.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Have a mining story to tell?</h2>
          <p className="text-center text-slate-300 mb-8">
            Submit your content or request a quote. Get direct post on our full packages considering syndication, email newsletters and distribution.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleFormChange}
                className="px-4 py-2 rounded bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleFormChange}
                className="px-4 py-2 rounded bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleFormChange}
                className="px-4 py-2 rounded bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded font-semibold transition"
              >
                Get Started
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default NewsSyndication
