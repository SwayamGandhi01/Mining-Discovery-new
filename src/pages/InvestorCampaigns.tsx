import React, { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const InvestorCampaigns: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0)

  const statistics = [
    { count: '200+', label: 'Origination News', description: '' },
    { count: '12k+', label: 'Insightful Subscribers', description: '' },
    { count: '44k+', label: 'Social Followers', description: '' },
  ]

  const features = [
    {
      title: 'Exclusive Field Reporting',
      description: 'On-the-ground insights from mining sites across key commodities, delivering unparalleled real-time information',
    },
    {
      title: 'Investor Oriented Analysis',
      description: 'In-depth breakdowns tailored to investor priorities, highlighting risks, opportunities, and trends',
    },
    {
      title: 'Interactive Tools',
      description: 'Custom dashboards, charts, and data to help investors understand mining market dynamics effectively',
    },
    {
      title: 'Dedicated Support',
      description: 'Direct engagement with MD team delivers in-depth private briefings and exclusive insights',
    },
  ]

  const whyInvest = [
    {
      title: 'Subscription Revenue',
      description: 'Premium subscription generates recurring revenue streams and supplies',
    },
    {
      title: 'Sponsorship & Advertising',
      description: 'Sponsorship & advertising opportunities enhance corporate partnerships and opportunities',
    },
    {
      title: 'Partnerships & Media',
      description: 'Customized partnerships and branded multimedia content',
    },
    {
      title: 'Data Products',
      description: 'APIs, databases and premium data services',
    },
  ]

  const opportunities = [
    {
      badge: 'Seed Investors',
      range: '$10k - $100k',
      features: ['Early growth access', 'Equity upside', 'Investor reporting'],
    },
    {
      badge: 'Growth Partners',
      range: '$100k - $250k',
      features: ['Larger equity position', 'Advisory opportunities', 'Quarterly reports'],
    },
    {
      badge: 'Strategic Investors',
      range: '$250k+',
      features: ['Principal equity stake', 'Board visibility', 'Exclusive access'],
    },
  ]

  const faqItems: FAQItem[] = [
    {
      question: 'How does Mining Discovery generate revenue through premium subscriptions, advertising and data sales?',
      answer: 'Mining Discovery operates a multi-revenue model including premium subscriptions, targeted advertising, partnerships, and enterprise data products delivered through APIs and custom reports.',
    },
    {
      question: 'What makes our mining news and investment analysis different?',
      answer: 'Our differentiation comes from on-the-ground field reporting, investor-focused analysis, and direct engagement with industry experts, providing insights that other platforms cannot match.',
    },
    {
      question: 'What percentage of capital goes toward product vs. marketing and growth?',
      answer: 'We maintain a balanced approach with significant investment in both product development and strategic market expansion to maximize reach and impact.',
    },
  ]

  const brands = [
    { name: 'ASTRA', logo: '🏢' },
    { name: 'ARRAS', logo: '🏔️' },
    { name: 'Aurion', logo: '⚙️' },
    { name: 'PHENOM', logo: '🔧' },
    { name: 'Empire', logo: '🏛️' },
    { name: 'U.S. Gold', logo: '🥇' },
    { name: 'Empowered X', logo: '⚡' },
    { name: 'Empire', logo: '👑' },
    { name: 'Ultiverse', logo: '🌐' },
  ]

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Investor Campaigns</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400">
            Unlocking the Future of Mining Insights
          </h2>
          <p className="text-lg mb-8 text-slate-300 max-w-3xl mx-auto">
            Fast, verified, investor-focused news and data built for the mining and metals sector. Turn growth to core watch.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded font-semibold transition">
              Download Our Deck
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded font-semibold transition">
              Schedule a Meeting
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statistics.map((stat, idx) => (
            <div
              key={idx}
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg p-8 text-center transition transform hover:scale-105"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.count}</div>
              <div className="text-lg font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6"
              >
                <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Invest Section */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Why invest in Mining Discovery</h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
          Mining is critical to the global energy transition and infrastructure growth. Forward-looking investors
          understand how essential mining discovery is.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyInvest.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-6 hover:bg-slate-800 dark:hover:bg-slate-700 transition"
            >
              <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
              <p className="text-sm text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Investment Opportunities</h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">Flexible tiers designed for early believers to strategic partners.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
              >
                <div className="text-primary-600 font-bold text-sm mb-2 uppercase">{opp.badge}</div>
                <div className="text-2xl font-bold mb-6">{opp.range}</div>
                <ul className="space-y-3">
                  {opp.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary-600 font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                className="w-full px-6 py-4 bg-slate-900 dark:bg-slate-800 text-white font-semibold text-left flex justify-between items-center hover:bg-slate-800 dark:hover:bg-slate-700 transition"
              >
                <span>{item.question}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${expandedFAQ === idx ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {expandedFAQ === idx && (
                <div className="px-6 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Brands we are working with</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center p-4 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:shadow-md transition"
              >
                <span className="text-2xl mr-2">{brand.logo}</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to invest in Mining Discovery?</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join a growing community of investors backing the future of mining intelligence
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded font-semibold transition">
              Get Started
            </button>
            <button className="border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded font-semibold transition">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InvestorCampaigns
