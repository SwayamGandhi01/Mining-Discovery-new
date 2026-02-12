import React from 'react'

interface ApproachCard {
  icon: string
  title: string
  description: string
}

interface DistributionChannel {
  name: string
}

interface PartnerBenefit {
  title: string
  description: string
}

interface ImpactStat {
  number: string
  label: string
}

const ConferenceMediaCoverage: React.FC = () => {
  const approachCards: ApproachCard[] = [
    {
      icon: '📅',
      title: 'Pre-Event Strategy',
      description: 'Highlight your event, speakers, and agenda to build anticipation and visibility.',
    },
    {
      icon: '⏱️',
      title: 'Real-Time Coverage',
      description: 'From-live updates and insights, livestream key moments, highlight audience connection.',
    },
    {
      icon: '🎤',
      title: 'Exclusive Interviews',
      description: 'One-on-one insights with thought leaders and speakers, unique content that stands out.',
    },
    {
      icon: '📊',
      title: 'Post-Event Features',
      description: 'Comprehensive recaps, takeaways, and attendee spotlights to extend the life of your event.',
    },
  ]

  const distributionChannels: DistributionChannel[] = [
    { name: 'MiningDiscovery.com' },
    { name: 'Mining Discovery Newsletter' },
    { name: 'Email Newsletters' },
    { name: 'YouTube' },
    { name: 'LinkedIn' },
    { name: 'Spotify' },
  ]

  const partnerBenefits: PartnerBenefit[] = [
    {
      title: 'Credible Source',
      description: 'Recognized by industry insiders and event reporters.',
    },
    {
      title: 'Multi-Channel Exposure',
      description: 'Powered, organic, owned and earned channels to maximize visibility.',
    },
    {
      title: 'Strong Industry Network',
      description: 'Deep connections with miners and media outlets worldwide.',
    },
    {
      title: 'SEO Optimized',
      description: 'Long-term discoverability for your event, highlights and coverage.',
    },
    {
      title: 'Flexible Packages',
      description: 'Options tailored to match your events size, scope, and needs.',
    },
  ]

  const impactStats: ImpactStat[] = [
    { number: '45%+', label: 'Increased event attendance' },
    { number: 'Global', label: 'Audience reach across multiple platforms' },
    { number: 'Trusted', label: 'Miners, leaders and media networks' },
  ]

  const galleryImages = Array(20).fill(0).map((_, i) => i)

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Conference Media Coverage</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-amber-400">
            Amplify Mining Conferences
          </h2>
          <p className="text-lg mb-8 text-slate-300 max-w-3xl mx-auto">
            We ensure mining conferences don't just deliver value to attendees—we capture, amplify, and share their ideas. Newsmakers and insights with a global audience.
          </p>
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded font-semibold transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Our Approach</h2>
        <p className="text-center text-amber-600 dark:text-amber-500 text-sm mb-8">
          Comprehensive coverage planning, during, and after to event to maximize impact
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approachCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 text-center hover:shadow-md transition"
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="font-bold text-lg mb-3">{card.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Distribution Channels */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">Distribution Channels</h2>
          <p className="text-center text-amber-600 dark:text-amber-500 text-sm mb-8">
            We amplify your event to reach across multiple platforms
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {distributionChannels.map((channel, idx) => (
              <button
                key={idx}
                className="bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 px-6 py-3 rounded-lg font-semibold transition"
                disabled
              >
                {channel.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Why Partner With Us</h2>
        <p className="text-center text-amber-600 dark:text-amber-500 text-sm mb-8">
          We combine credibility, reach, and innovation to deliver unmatched coverage
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerBenefits.map((benefit, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-6 ${
                idx === 3
                  ? 'bg-slate-50 dark:bg-slate-800 border-l-4 border-amber-600 col-span-1 md:col-span-2 lg:col-span-1 lg:col-start-2'
                  : 'bg-slate-50 dark:bg-slate-800 border-l-4 border-amber-600'
              }`}
            >
              <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proven Impact */}
      <section className="py-12 max-w-4xl mx-auto px-4">
        <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-center mb-2 text-amber-400">Proven Impact</h2>
          <p className="text-center text-slate-300 text-sm mb-8">
            Our coverage testimonials deliver engagement and results for organizers and sponsors
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {impactStats.map((stat, idx) => (
              <div key={idx} className="bg-slate-800 dark:bg-slate-700 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">{stat.number}</div>
                <p className="text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Amplify Your Next Event */}
        <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3 text-amber-400">Amplify Your Next Event</h2>
          <p className="text-slate-300 mb-6">
            Partner with Mining Discovery to capture, share, and extend the reach of your next conference through expert coverage
          </p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded font-semibold transition">
            Get Started
          </button>
        </div>
      </section>

      {/* Conference Media Gallery */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">CONFERENCE MEDIA GALLERY</h2>
          <div className="text-center mb-8">
            <span className="bg-slate-900 dark:bg-slate-800 text-amber-400 px-4 py-2 rounded text-sm font-semibold inline-block">
              The Mining Investment Event
            </span>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {galleryImages.map((_, idx) => (
              <div
                key={idx}
                className="aspect-square bg-slate-300 dark:bg-slate-700 rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer flex items-center justify-center"
              >
                <span className="text-4xl">📸</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to showcase your conference?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Let Mining Discovery handle your event coverage and reach global mining industry stakeholders.
          </p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded font-semibold transition">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConferenceMediaCoverage
