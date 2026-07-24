import React from 'react'
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Compass,
  Eye,
  Globe,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  User,
} from 'lucide-react'

interface TeamMember {
  name: string
  title: string
  description: string
  initials: string
}

interface Purpose {
  title: string
  description: string
  icon: React.ReactNode
}

interface Principle {
  title: string
  description: string
  icon: React.ReactNode
}

interface UniqueFeature {
  feature: string
  benefit: string
}

const AboutUs: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: 'Laura Stein',
      title: 'Founder & President – Laura\'s Liaisons',
      initials: 'LS',
      description:
        'Laura Stein is an investor relations, business development, and networking professional with more than 30 years of experience in the mining industry. She is best known as the founder and President of Laura\'s Liaisons, a company focused on connecting mining companies, investors, analysts, and industry professionals through conferences, introductions, and strategic relationship building. Her services include shareholder communications, investor introductions, conference networking, social media outreach, and corporate visibility programs. She has attended and networked at many of the industry\'s largest events, including PDAC (Toronto), Mines and Money, Precious Metals Summit, New Orleans Investment Conference, and various North American and international mining conferences. Laura has worked with junior exploration companies, gold, silver, copper, uranium and critical mineral companies, mining executives, investors, fund managers, analysts, mining media, and conference organizers. She is widely recognized for her extensive industry network, strong relationships with mining executives, and her commitment to supporting junior mining companies during financing and promotional campaigns.',
    },
    {
      name: 'Chris Powell',
      title: 'Chief Analyst & Advisor',
      initials: 'CP',
      description:
        'Chris Powell has devoted decades as a managing editor, writer, and founding member of GATA. With extensive market expertise, he provides invaluable insights into gold, mineral markets, and global market protection.',
    },
    {
      name: 'Gaurav Sharma',
      title: 'Marketing Head',
      initials: 'GS',
      description:
        'Gaurav Sharma leads marketing strategy, digital branding, and global audience expansion for Laura\'s Liaisons. He concentrates on cutting-edge PR, media campaigns, and scalable digital solutions that elevate mining companies and investors worldwide.',
    },
  ]

  const purposes: Purpose[] = [
    {
      title: 'Illustrate the Industry',
      description: 'Shed insight on exploration, developments, and drilling to the industry.',
      icon: <Eye className="w-6 h-6 text-[#C59B27]" />,
    },
    {
      title: 'Insight Into Action',
      description: 'Empower the tools to feel forward thinking company awareness.',
      icon: <TrendingUp className="w-6 h-6 text-[#C59B27]" />,
    },
    {
      title: 'Foster Transparency',
      description: 'Provide a clear view of company communications and community impact.',
      icon: <ShieldCheck className="w-6 h-6 text-[#C59B27]" />,
    },
    {
      title: 'Build Bridges',
      description: 'Connecting investors, developers, and the global mining ecosystem.',
      icon: <Globe className="w-6 h-6 text-[#C59B27]" />,
    },
  ]

  const principles: Principle[] = [
    {
      title: 'Integrity',
      description: 'Truthful understanding above all else',
      icon: <ShieldCheck className="w-5 h-5 text-[#C59B27]" />,
    },
    {
      title: 'Clarity',
      description: 'Explain complex issues in plain, impactful language.',
      icon: <Sparkles className="w-5 h-5 text-[#C59B27]" />,
    },
    {
      title: 'Innovation',
      description: 'Adapting new tools and formats to keep coverage relevant.',
      icon: <Compass className="w-5 h-5 text-[#C59B27]" />,
    },
    {
      title: 'Respect',
      description: 'Consideration for communities, experts, and stakeholders.',
      icon: <HeartHandshake className="w-5 h-5 text-[#C59B27]" />,
    },
    {
      title: 'Partnership',
      description: 'Collaborating with industry leaders and decision makers.',
      icon: <Building2 className="w-5 h-5 text-[#C59B27]" />,
    },
  ]

  const uniqueFeatures: UniqueFeature[] = [
    {
      feature: 'Industry-Focused Journalism',
      benefit: 'We specialize in mining for depth, context, and consistency.',
    },
    {
      feature: 'Integrated Approach',
      benefit: 'We connect reporting, data, and communications into a cohesive narrative.',
    },
    {
      feature: 'Dual Perspective',
      benefit: 'We address both institutional investors and community stakeholders.',
    },
    {
      feature: 'Modern Distribution',
      benefit: 'Editorial excellence across digital outreach, visual storytelling, and syndication.',
    },
    {
      feature: 'Founder-Driven Vision',
      benefit: 'Driven by the personal commitment of our founders to purpose-driven growth.',
    },
  ]

  const brands = [
    {
      name: 'Gold Hunter Resources',
      logo: 'https://goldhunterresources.com/wp-content/uploads/2026/03/image.gif',
    },
    {
      name: 'Arras Minerals',
      logo: 'https://lirp.cdn-website.com/8c0a7d35/dms3rep/multi/opt/arras-minerals-corp-logo-345-236w.png',
    },
    {
      name: 'Aurion Resources',
      logo: 'https://aurionresources.com/aurion-logo.png',
    },
    {
      name: 'Phenom Resources',
      logo: 'https://i0.wp.com/www.phenomresources.com/wp-content/uploads/2024/10/Phenom_lg.png?w=500&ssl=1',
    },
    {
      name: 'U.S. Gold Corp',
      logo: 'https://www.usgoldcorp.com/_assets/_7b88ca6fb755a6b51f1247416aa5d941/usgoldcorp/files/theme/images/header-logo-fixed.png',
    },
  ]

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white py-20 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#C59B27]/10 text-[#C59B27] border border-[#C59B27]/30 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <Award className="w-4 h-4" /> Global Mining Media & Investor Relations
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            ABOUT <span className="text-[#C59B27]">LAURA'S LIAISONS</span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Connecting mining companies, institutional investors, analysts, and industry professionals through unmatched relationships, rigorous communications, and strategic introductions.
          </p>
        </div>
      </section>

      {/* Origin Section */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-md">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#C59B27]">
              OUR FOUNDING STORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 mb-6">
              Origin of Laura's Liaisons
            </h2>
            <div className="w-16 h-1 bg-[#C59B27] mx-auto rounded-full mb-8" />
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-normal">
              Laura's Liaisons was founded by <strong>Laura Stein</strong> — a veteran mining industry networking and investor relations professional with more than <strong>30 years of experience</strong> — alongside <strong>Gaurav Sharma</strong>, with a shared vision to bring clarity and depth to a field often clouded by noise and half-truths.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-[#C59B27] pl-4 text-left my-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-r-lg">
              "We believed that mining isn't just about rocks and ore mines. It's about people, communities, economies, and the future of our planet. Drawing on Laura's extensive global network and Gaurav's digital media expertise, we set out to build a platform that honors all of that."
            </p>
          </div>
        </div>
      </section>

      {/* Management Team Section */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#C59B27]">
              LEADERSHIP
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Management Team
            </h2>
            <div className="w-12 h-1 bg-[#C59B27] mx-auto rounded-full mt-3" />
          </div>

          {/* Laura Stein — Featured Leadership Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden mb-12 transition-all hover:shadow-xl">
            <div className="flex flex-col md:flex-row">
              {/* Left Column: Avatar & Tag Highlights */}
              <div className="md:w-72 bg-gradient-to-b from-slate-900 to-[#1C2541] text-white flex flex-col items-center justify-start p-8 gap-4 flex-shrink-0 text-center relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#C59B27] to-amber-700 p-1 shadow-xl mt-2">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-black text-[#C59B27]">
                    LS
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Laura Stein</h3>
                  <p className="text-[#C59B27] font-bold text-xs uppercase tracking-wider mt-1">
                    Founder & President
                  </p>
                  <p className="text-xs text-slate-300 mt-1 flex items-center justify-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C59B27]" /> 30+ Years Industry Experience
                  </p>
                </div>
                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                  {[
                    'Investor Relations',
                    'Strategic Networking',
                    'Business Development',
                    'Conference Org.',
                    'Shareholder Comms',
                    'Executive Intros',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/10 text-slate-200 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Bio & Core Panels */}
              <div className="flex-1 p-8 sm:p-10">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                  Laura Stein is an investor relations, business development, and networking professional with more than <strong>30 years of experience</strong> in the mining industry. She is best known as the founder and President of Laura's Liaisons — a company focused on connecting mining companies, investors, analysts, and industry professionals through conferences, introductions, and strategic relationship building.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wider">
                      <Briefcase className="w-4 h-4 text-[#C59B27]" /> Industry Experience
                    </h4>
                    <ul className="text-slate-600 dark:text-slate-400 space-y-1.5 text-xs pl-1">
                      {[
                        'Junior exploration companies',
                        'Gold, silver, copper, uranium & critical minerals',
                        'Mining executives & fund managers',
                        'Analysts & mining media',
                        'Conference organizers',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className="text-[#C59B27] font-bold">▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wider">
                      <Globe className="w-4 h-4 text-[#C59B27]" /> Major Conferences
                    </h4>
                    <ul className="text-slate-600 dark:text-slate-400 space-y-1.5 text-xs pl-1">
                      {[
                        'PDAC (Toronto)',
                        'Mines and Money',
                        'Precious Metals Summit',
                        'New Orleans Investment Conference',
                        'North American & International Events',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className="text-[#C59B27] font-bold">▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-[#C59B27]" /> IR & Outreach Services
                    </h4>
                    <ul className="text-slate-600 dark:text-slate-400 space-y-1.5 text-xs pl-1">
                      {[
                        'Shareholder & investor communications',
                        'Conference networking & private dinners',
                        'Email & social media outreach',
                        'Executive introductions',
                        'Corporate visibility programs',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className="text-[#C59B27] font-bold">▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-[#C59B27]" /> Recent Engagement
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                      In early 2026, <strong>Spanish Mountain Gold Ltd.</strong> engaged Laura Stein to provide shareholder and investor communications — supporting engagement through email, social media, and conference participation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chris Powell & Gaurav Sharma Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.slice(1).map((member, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C59B27] to-amber-700 p-1 shadow-md mb-4 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-extrabold text-white">
                    {member.initials}
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-[#C59B27] font-bold text-xs uppercase tracking-wider mt-1 mb-4">
                  {member.title}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Purpose Section */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#C59B27]">
            MISSION & VISION
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Our Purpose</h2>
          <div className="w-12 h-1 bg-[#C59B27] mx-auto rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {purposes.map((purpose, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-[#C59B27]/40 hover:shadow-md transition-all flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-[#C59B27]/10 rounded-full flex items-center justify-center mb-4">
                {purpose.icon}
              </div>
              <h3 className="font-bold text-base mb-2 text-slate-900 dark:text-white">{purpose.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {purpose.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Principles Section */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#C59B27]">
              CORE VALUES
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Our Principles</h2>
            <div className="w-12 h-1 bg-[#C59B27] mx-auto rounded-full mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {principles.map((principle, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm text-center flex flex-col items-center justify-between"
              >
                <div className="w-10 h-10 bg-[#C59B27]/10 rounded-full flex items-center justify-center mb-3">
                  {principle.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  {principle.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Unique Section */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#C59B27]">
            OUR DIFFERENCE
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            What Makes Us Unique
          </h2>
          <div className="w-12 h-1 bg-[#C59B27] mx-auto rounded-full mt-3" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md">
          <div className="grid grid-cols-12 bg-slate-900 text-white text-xs uppercase tracking-wider font-extrabold px-6 py-4">
            <div className="col-span-5">Feature</div>
            <div className="col-span-7">Why It Matters</div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {uniqueFeatures.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="col-span-5 font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C59B27] flex-shrink-0" />
                  {item.feature}
                </div>
                <div className="col-span-7 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands We Are Working With */}
      <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#C59B27]">
            TRUSTED PARTNERSHIPS
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 mb-2">
            Brands We Are Working With
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-10">
            Trusted partners across the global mining and investment community
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col items-center justify-center gap-3 p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:shadow-md hover:border-[#C59B27]/30 transition-all group"
              >
                <div className="h-14 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-h-14 w-auto object-contain transition-all duration-300"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Looking Ahead Banner */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 via-[#1C2541] to-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="w-16 h-1 bg-[#C59B27] mx-auto rounded-full mb-6" />
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">Looking Ahead</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Laura's Liaisons aims to be the trusted global voice in mining — expanding coverage in Africa, Latin America, and Asia, developing advanced data tools, and building an engaged community that drives today's industry future.
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
