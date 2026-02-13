import React, { useState } from 'react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const Services: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const services = [
    {
      title: 'Digital Branding',
      description:
        'Your brand visibility is not enough. It should also be authentic. Our strategic branding approach goes beyond logos and colors to emphasize your core business, mining and industrial tasks into the company.',
      color: 'bg-slate-800',
    },
    {
      title: 'Social Media Marketing',
      description:
        'Create strategies that are optimized for both you and your consumers. Our team takes care of all social needs, be it monthly posts, strategies creation, or brand awareness and strengthening your brand.',
      color: 'bg-primary-700',
    },
    {
      title: 'Google Ads & Paid Campaigns',
      description:
        'Get the right clicks that get your site to rank on Google search and display ads. Our expertise with AdWords gets better out of your marketing budget, and displays right to your brand.',
      color: 'bg-slate-800',
    },
    {
      title: 'LinkedIn & Meta Ads',
      description:
        'Our team specializes in LinkedIn and advertising campaigns in both B2B and B2C industries in expanding roles. Connecting with professionals in engaging with a large audience but add it to brand impact.',
      color: 'bg-primary-700',
    },
    {
      title: 'Logo & Visual Design',
      description:
        'The hearts of the underlying interest brains should result in a beautiful logo and graphic design. We focus on the dynamics of your brand aesthetics and with each imagination and ask.',
      color: 'bg-slate-800',
    },
    {
      title: 'Public Relations (PR)',
      description:
        'The public face that you compile in is core to the branding and success. A strong press release, press releases, and. This media contacts, press releases, and through features, we create credibility and exposure for your brand.',
      color: 'bg-primary-700',
    },
    {
      title: 'Webinars & Events',
      description:
        'Capture the attention of your audience through significant digital interactions and content planning. From registrations to real-time logistics and interactive content, we get all aspects of your position in the industry.',
      color: 'bg-slate-800',
    },
    {
      title: 'Website Development',
      description:
        'Your website is the centerpiece of your online presence. We use the latest technologies, secure, open, user-friendly, user-flexible, and conversion-focused options and business aims.',
      color: 'bg-primary-700',
    },
    {
      title: 'App Development',
      description:
        'Go to the end with seamless development of digital presence beyond website. Mobile operations today are essential and all digital software related to both web and social media tasks to make your company work to know.',
      color: 'bg-slate-800',
    },
  ]

  const howWeWork = [
    {
      icon: '🔍',
      title: 'Discover & Define',
      description:
        'We strive to understanding your brand goals, audiences and culture better. With these insights, we craft a collaborative strategy.',
    },
    {
      icon: '📐',
      title: 'Strategy & Design',
      description:
        'Our experts craft clear roadmaps for the creative content. You can expect updates, feedback and collaboration every step of the way.',
    },
    {
      icon: '⚡',
      title: 'Execute & Deliver',
      description:
        'We take our digital proposals and plans of any implementation and ready to launch. Get the highest possible results.',
    },
    {
      icon: '📈',
      title: 'Optimize & Grow',
      description:
        'We use the metrics and best practices for continuous improvement and success of your business, so it can succeed in this.',
    },
  ]

  const whyChooseUs = [
    {
      title: 'Industry-Focused Expertise',
      description:
        'We are committed to mining and industrial analytics, ensuring our strategies fit your industry best.',
    },
    {
      title: 'All-in-One Partner',
      description:
        'From branding to web and all other services put your marketing all in one strategic way.',
    },
    {
      title: 'Creative & Analytical Balance',
      description:
        'Every creative idea is backed by research and data-driven insight to deliver better and results driven.',
    },
    {
      title: 'Transparent Collaboration',
      description:
        'We value transparency in focus and results at every point. A clear strategic partnership is key.',
    },
    {
      title: 'Performance-Driven Results',
      description:
        'Our services are targeted by our organization, for results and marketing successes.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'What industries do you work with?',
      answer:
        'We specialize in the mining industry and related sectors. Our expertise spans mining companies, equipment manufacturers, service providers, and other organizations within the mining and resource extraction sectors.',
    },
    {
      id: 2,
      question: 'How long will it take to see results?',
      answer:
        'Results vary depending on the service and goals. Typically, initial feedback comes within 1-3 months, with substantial results visible within 6+ months. We provide regular updates and performance metrics throughout the journey.',
    },
    {
      id: 3,
      question: 'Do you offer custom marketing packages?',
      answer:
        'Yes, we offer fully customized packages tailored to your specific needs and budget. We work with you to understand your goals and create a strategic plan that maximizes your marketing investment.',
    },
    {
      id: 4,
      question: 'Can you handle complete social media and advertising management?',
      answer:
        'Absolutely. We manage everything from content creation and posting to ad campaign management, community engagement, and performance analytics. Our team ensures consistent brand voice across all platforms.',
    },
    {
      id: 5,
      question: 'Do you collaborate with international clients?',
      answer:
        'Yes, we work with international clients and have experience in global marketing strategies. We understand regional differences and can adapt our approach to different markets and cultures.',
    },
  ]

  return (
    <div className="bg-white dark:bg-background-dark">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 serif-title">Services</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Engineering the Mining Industry Through Digital Innovation. From branding to paid media, we help mining and resource-driven companies grow with purpose.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.color} text-white p-6 rounded-lg hover:shadow-lg transition-shadow`}
            >
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-sm text-gray-200 line-clamp-4">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How We Work */}
      <div className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white serif-title">
            How we work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howWeWork.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4 text-primary">{item.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white serif-title">
          Why Choose Mining Discovery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">✓</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white serif-title">
            FAQs
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800"
              >
                <button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {faq.id}. {faq.question}
                  </span>
                  <span
                    className={`text-primary text-xl transition-transform ${
                      expandedFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-800 dark:bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 serif-title">Ready to grow?</h2>
          <p className="text-slate-300 mb-8">
            Let's discuss how Mining Discovery can help your business—strategy, creative, and performance-to
            set your part.
          </p>
          <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-colors">
            Contact Our Team
          </button>
        </div>
      </div>
    </div>
  )
}

export default Services
