import React, { useState } from 'react'

interface Service {
  title: string
  description: string
}

interface WorkStep {
  title: string
  description: string
}

interface FAQItem {
  question: string
}

interface WhyChooseItem {
  title: string
  description: string
}

const DigitalBranding: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0)

  const services: Service[] = [
    {
      title: 'Press Distribution & Article Content',
      description: 'Modern announcements, consistent stories, and engaging content shared across channels.',
    },
    {
      title: 'Search & Google Ads',
      description: 'Strategic campaigns to ensure your website reaches mining companies and partners.',
    },
    {
      title: 'YouTube & Multimedia Management',
      description: 'Corporate videos, webinars, events, and content optimized for your channels.',
    },
    {
      title: 'Website Development & UX',
      description: 'Beautiful websites, responsive design, optimized architecture and clear messaging.',
    },
    {
      title: 'Email Campaigns & Newsletters',
      description: 'Strategic emails designed to build loyalty and drive consistent business results.',
    },
    {
      title: 'Comprehensive Digital Integration',
      description: 'APIs, social consistency, and integrated campaigns across all web channels.',
    },
  ]

  const workSteps: WorkStep[] = [
    {
      title: 'Discovery & Benchmarking',
      description: 'We learn you brand, research success, audience, and trial opportunities.',
    },
    {
      title: 'Brand Strategy Development',
      description: 'Detailed brand positioning and digital style driving board plans.',
    },
    {
      title: 'Design & Messaging',
      description: 'Thoughtful design crafted for brand alignment and long right the impression.',
    },
    {
      title: 'Deploy, Monitor & Evolve',
      description: 'Roll out across channels, track performance, and refine next plan.',
    },
  ]

  const whyMatters = [
    'Trust & credibility essential to mining industry success and reputation',
    'Visibility from peers and potential partners who get buy-in of the mining',
    'Control to set the narrative instead of letting others define you',
  ]

  const whatYouGain = [
    'Cohesive brand feel, tone, color codes and messaging',
    'Clear value proposition to investors and markets',
    'Messaging that convey investors concerns',
    'Better visibility and stronger engagement.',
  ]

  const whyChoose: WhyChooseItem[] = [
    {
      title: 'Being Seen',
      description: 'By investors and stakeholders.',
    },
    {
      title: 'Being Trusted',
      description: 'Through clear, consistent messaging.',
    },
    {
      title: 'Being Remembered',
      description: 'With a brand that induces a lasting impression.',
    },
  ]

  const faqItems: FAQItem[] = [
    {
      question: "How long does it take to revise or build my brand's digital identity?",
    },
    {
      question: 'Will my existing assets be usable?',
    },
    {
      question: 'Do you handle brand assets in-house or through partners?',
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Digital Branding</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-amber-600 dark:text-amber-500">
            Your identity, amplified
          </h2>
          <p className="text-lg mb-8 text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            In mining, reputation travels fast. What others say about you matters. What you show the world matters most. We build branding that gets recognized and inspires action.
          </p>
          <button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-6 py-3 rounded font-semibold transition">
            Start your Digital Branding
          </button>
        </div>
      </section>

      {/* Trust & Visibility Cards */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-amber-600 bg-slate-50 dark:bg-slate-800 p-6 rounded">
            <h3 className="font-bold text-xl mb-3">Trust</h3>
            <p className="text-slate-700 dark:text-slate-300">Build credibility with stakeholders and partners</p>
          </div>
          <div className="border-l-4 border-slate-400 bg-slate-50 dark:bg-slate-800 p-6 rounded">
            <h3 className="font-bold text-xl mb-3">Visibility</h3>
            <p className="text-slate-700 dark:text-slate-300">Make sure your vision and progress are seen and recognized</p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">What we offer</h2>
          <p className="text-center text-amber-600 dark:text-amber-500 text-sm mb-8">
            We bring you need to access every digital branding and take each service to insightful audiences
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-6 hover:bg-slate-800 dark:hover:bg-slate-700 transition"
              >
                <h3 className="font-bold text-lg mb-3">{service.title}</h3>
                <p className="text-sm text-slate-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work With You */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">How we work with you</h2>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-8">
          A structured approach to take messaging and to ensure best-in-class brand and data-driven
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-900 rounded-lg p-6"
            >
              <h3 className="font-bold text-amber-600 dark:text-amber-500 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-700 dark:text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side */}
            <div>
              <h2 className="text-3xl font-bold mb-3">Why this matters (especially in mining)</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                It's the foundation of valuable, credible, convincingly-unopposed, and market presence
              </p>
              <ul className="space-y-3">
                {whyMatters.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-slate-900 dark:text-slate-100 font-bold">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-500">What you'll gain</h3>
              <ul className="space-y-3">
                {whatYouGain.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-amber-600 dark:text-amber-500 font-bold">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Mining Discovery */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Why choose Mining Discovery?</h2>
        <p className="text-center text-amber-600 dark:text-amber-500 text-sm mb-8">
          We believe industry cruelty with modern digital marketing to make your brand stand out where it matters most
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyChoose.map((item, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-900 rounded-lg p-6 text-center">
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">FAQs</h2>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 bg-white dark:bg-slate-800 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <span className="font-semibold">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${
                      expandedFAQ === idx ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                {expandedFAQ === idx && (
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
                    <p>{item.question} - Answer coming soon</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to amplify your brand?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Let's create a digital presence that tells your story and resonates with investors, partners, and the mining industry.
          </p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded font-semibold transition">
            Get Started
          </button>
        </div>
      </section>
    </div>
  )
}

export default DigitalBranding
