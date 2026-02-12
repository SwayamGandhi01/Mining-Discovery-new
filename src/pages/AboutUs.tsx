import React from 'react'

interface TeamMember {
  name: string
  title: string
  description: string
}

interface Advisor {
  name: string
  title: string
  description: string
}

interface Purpose {
  title: string
  description: string
}

interface Principle {
  title: string
  description: string
}

interface UniqueFeature {
  feature: string
  benefit: string
}

const AboutUs: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: 'Gaurav Sharma',
      title: 'Founder - Mining Discovery',
      description: 'Michael Clark, who established Mining Discovery, is at the forefront with an idea that the global mining industry should communicate as innovation. He concentrates on the U.S. and Canadian practices and their site, a vibrant media and marketing centre under his guidance. Where mining firms, investors, and professionals exchange knowledge and grow their footprint. His speciality covers the scope of advertising, PR, eCommerce, and web development, which result in the creation of scalable solutions applicable to both the technology and the everything-else. His progressive approach is very much a part of Mining Discovery\'s solid foundation that has expanded to a trillion-dollar enterprise.',
    },
    {
      name: 'Sagar Bakshi',
      title: 'Co-founder & VP of Mining Discovery',
      description: 'The platform of Mining Discovery is supported by Sagar Bakshi, curates the global mining community with a digital-first vision. Leading operations in U.S. and Canadian mining archives and is by way that brings the companies put out their messages regarding industry news, corporate updates, and more promotions. Mining Discovery, under his leadership, has grown into a local growth partner and is promoting understanding in the mining industry across the globe. Sagar is also working with eCommerce startups on Shopify and Amazon by giving them displaysying and digital marketing support. His strategic planning, coupled with his innovative methods, will continue to play a significant role in the measurable growth of the mining and digital marketing industries.',
    },
  ]

  const advisors: Advisor[] = [
    {
      name: 'Laura Stein',
      title: 'Mining Discovery Advisor, Board Member',
      description: 'Laura Stein brings over 20 years of mining industry experience. These exude a lighter shade is in operational experience, and a great, virtual, and market boundaries. In exploration, project development, and strategic mining operations. Laura has been required for the expertise: ability to manage complex capital projects and the technical rigor to her principles and of respect for the challenges put in front of her. Designing a full range of support and more services, she enables a community in that consideration, evaluation, and advancement of promising mineral opportunities with confidence and transparency.',
    },
    {
      name: 'Chris Powell',
      title: 'Mining Discovery Advisor, Chief Analyst',
      description: 'A Mining Discovery Advisor, Chris Powell has devoted decades of the Journal Inquire. All of them as managing editor, writer and writing. Correspondent-based are hie background includes 30 years of the Journal Inquire. Al of them as managing editor, writer is also a founding member of the (GATA). Also is a founding member of the Gold Anti-Fraud Action Committee (GATA), and is devoted to the protection of the integrity of the gold market and monetary gold market manipulations by the central banks. Through his writings for the GATA Dispatch as well as his congressional testimonies, Powell continues to have invaluable insights for the dealing in the gold and mineral markets. With his endured expertise and commitment, he takes a great interest in Mining Discovery\'s mandate in the early-stage mineral exploration and discovery.',
    },
  ]

  const purposes: Purpose[] = [
    {
      title: 'Illustrate the Industry',
      description: 'Shed insight on exploration, developments, and drilling to the industry.',
    },
    {
      title: 'Insight Into Action',
      description: 'Empower the tools to feel forward thinking company awareness.',
    },
    {
      title: 'Foster Transparency',
      description: 'Provide a clear view of company communications and community impact.',
    },
    {
      title: 'Build Bridges',
      description: 'Connecting investors, developers, and the global mining ecosystem.',
    },
  ]

  const principles: Principle[] = [
    {
      title: 'Integrity',
      description: 'Truthful understanding above all else',
    },
    {
      title: 'Clarity',
      description: 'Explain complex issues in plain, impactful language.',
    },
    {
      title: 'Innovation',
      description: 'Adapting new tools and formats to keep coverage relevant.',
    },
    {
      title: 'Respect',
      description: 'Consideration for communities, experts, and stakeholders.',
    },
    {
      title: 'Partnership',
      description: 'Collaborating with industry leaders and decision makers.',
    },
  ]

  const uniqueFeatures: UniqueFeature[] = [
    {
      feature: 'Industry-Focused Journalism',
      benefit: 'We specialize in mining for depth, context, and consistency.',
    },
    {
      feature: 'Integrated Approach',
      benefit: 'We connect reporting, data, and breaching - breaking down as a single story.',
    },
    {
      feature: 'Dual Perspective',
      benefit: 'We address both investor professionals and community stakeholders.',
    },
    {
      feature: 'Modern Distribution',
      benefit: 'Editorial excellence across SEO, visual storytelling, and syndication.',
    },
    {
      feature: 'Founder-Driven Vision',
      benefit: 'Driven by the personal commitment of our founders to purpose-driven growth.',
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero/Origin Section */}
      <section className="py-16 max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">ORIGIN OF MINING DISCOVERY</h1>
        <p className="text-lg text-slate-700 dark:text-slate-400 mb-4 max-w-3xl mx-auto">
          Mining Discovery began in 2022, founded by <strong>Michael Clark</strong> and <strong>Sagar Bakshi</strong> with a shared vision: to bring clarity and depth to a field often clouded by noise and half-truths. Both coming from different backgrounds in mining markets, and strategic communication, they realized the mining world lacked a resource that combined rigorous journalism with
          <strong> exploration, regulation, investor relations, and innovation.</strong>
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-500 max-w-3xl mx-auto">
          They believed that mining isn't just about rocks and ore mines. It's about people, communities, economies, and the future of our planet. And they set to build a platform that honors all of that.
        </p>
      </section>

      {/* Management Team */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Management Team</h2>

          <div className="space-y-12">
            {/* Gaurav Sharma */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 md:w-1/3">
                <div className="w-48 h-48 bg-slate-300 dark:bg-slate-700 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-6xl">👤</div>
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-1">{teamMembers[0].name}</h3>
                <p className="text-amber-600 dark:text-amber-500 font-semibold mb-4">{teamMembers[0].title}</p>
                <p className="text-slate-700 dark:text-slate-400 leading-relaxed">{teamMembers[0].description}</p>
              </div>
            </div>

            {/* Sagar Bakshi */}
            <div className="flex flex-col md:flex-row-reverse gap-8 items-start">
              <div className="flex-shrink-0 md:w-1/3">
                <div className="w-48 h-48 bg-slate-300 dark:bg-slate-700 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-6xl">👤</div>
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-1">{teamMembers[1].name}</h3>
                <p className="text-amber-600 dark:text-amber-500 font-semibold mb-4">{teamMembers[1].title}</p>
                <p className="text-slate-700 dark:text-slate-400 leading-relaxed">{teamMembers[1].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Advisors */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Advisors</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {advisors.map((advisor, idx) => (
            <div key={idx} className="border-t-4 border-amber-600 pt-6">
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-24 bg-slate-300 dark:bg-slate-700 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl">
                  👤
                </div>
                <div>
                  <h3 className="text-xl font-bold">{advisor.name}</h3>
                  <p className="text-amber-600 dark:text-amber-500 text-sm font-semibold">{advisor.title}</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed">{advisor.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Purpose */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Purpose</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {purposes.map((purpose, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center">
                <h3 className="font-bold text-lg mb-3">{purpose.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{purpose.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Principles */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Principles</h2>

        <div className="bg-amber-50 dark:bg-slate-800 rounded-lg p-8 mb-8 text-center">
          <div className="flex flex-wrap justify-center gap-6">
            {principles.map((principle, idx) => (
              <div key={idx} className="flex-1 min-w-fit">
                <h3 className="font-bold text-lg mb-2">{principle.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Unique */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Unique</h2>

          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 bg-slate-200 dark:bg-slate-800">
              <div className="px-6 py-3 font-bold border-r border-slate-200 dark:border-slate-700">Feature</div>
              <div className="px-6 py-3 font-bold">Why It Matters</div>
            </div>

            {uniqueFeatures.map((item, idx) => (
              <div key={idx} className="grid grid-cols-2 border-t border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  {item.feature}
                </div>
                <div className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.benefit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Looking Ahead */}
      <section className="py-16 max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Looking Ahead</h2>
        <p className="text-lg text-slate-700 dark:text-slate-400 max-w-3xl mx-auto">
          Mining Discovery aims to the the trusted global voice in mining — expanding coverage in Africa, Latin America, and Asia, developing advanced data tools, spending in programming, exploring an engaged community that drives today's industry future.
        </p>
      </section>
    </div>
  )
}

export default AboutUs
