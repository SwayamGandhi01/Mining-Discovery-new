import React, { useState } from 'react'

interface Company {
  name: string
  description: string
  icon?: string
}

const PressOffice: React.FC = () => {
  const companies: Company[] = [
    {
      name: 'Mining Discovery',
      description: 'Mining Discovery is a global digital platform and event organizer connecting investors, explorers, and industry innovators. It offers project-matching tools, digital branding solutions, and networking opportunities to help early-stage mining ventures attract investment and build visibility through curated showcases and strategic partnerships.',
    },
    {
      name: 'U.S. Gold Corp',
      description: 'U.S. Gold specializes in gold exploration and development across the United States, including the Keysite QE Gold Project in Wyoming. CEO George Scan leads a team with extensive mine-building experience, focusing on permitting milestones and rare earth production. The company also develops the Keystone project in Nevada and the Chalice project in Idaho.',
    },
    {
      name: 'Freyr Metals',
      description: 'Freyr Metals is a Canadian exploration company focused on developing the high-grade Ni-Cu Copper-PGM-Gold Nickel Risk project in Quebec. With a strong technical foundation and a commitment to environmental stewardship, the company aims to advance this project toward development. Canada\'s most major polymetallic mine.',
    },
    {
      name: 'Kodiak Copper',
      description: 'Kodiak Copper Corp. is a Canadian exploration company developing high-value copper gold projects, focused on its MP project in British Columbia. The company combines innovation, sustainability, and technical rigor to realize the mineralization potential and support the growing demand for copper in a clean-energy and technology-driven future.',
    },
    {
      name: 'Aurion Resources',
      description: 'Aurion Resources Ltd (TSXV: AU; OTCQB: AIRRUSF) is a well-funded Canadian exploration company focused on early-stage precious metals opportunities. The company advances projects through a portfolio of ventures with partners such as Botala, Kinross Gold, and Killbuck Metals in Finland. Aurion\'s flagship project is the wholly-owned field gold project.',
    },
    {
      name: 'Phenom Resources',
      description: 'Phenom Resources Ltd focuses on gold and vanadium exploration in Nevada, USA. Led by a highly experienced technical team, the company holds vectored processes for extracting vanadium and nickel from porphyry-gold deposits and engages in work partnerships that leverage their technical expertise. Phenom is well-positioned to serve both the precious metals and clean-energy market.',
    },
    {
      name: 'Noble Metals Uranium Corp',
      description: 'Noble Metals Uranium Corp. is ranked uranium exploration company developing ISR-compatible projects across key states such as Wyoming. The company upgrades folders, uranium assets and equity interests via M&A compliant resources, aiming to meet growing domestic uranium demand through digital efficient and environmentally responsible in-situ recovery operations.',
    },
    {
      name: 'Astra Exploration Inc.',
      description: 'Astra Exploration Inc. is a U.S. based uranium exploration company focused on developing ISR-compatible projects in key regions such as Wyoming. The company advances folder, uranium assets to compliant M&A ISR resources, aiming to meet the growing domestic uranium demand through digital-efficient and environmentally responsible in-situ recovery operations.',
    },
    {
      name: 'Loyalite Exploration Ltd',
      description: 'Loyalite Exploration Ltd. is a U.S. based uranium exploration company advancing ISR-compatible projects across Wyoming and other key regions. The company focuses on upgrading folders, uranium assets via compliant M&A ISR resources while emphasizing environmentally responsible and cost-efficient in-situ recovery operations to meet the nation\'s growing uranium demand.',
    },
    {
      name: 'Guanajuato Silver Company Ltd.',
      description: 'Guanajuato Silver Company Ltd. focuses on reactivating precious metal mines in Mexico\'s historically rich Guanajuato region. The company operates five mines and three production facilities, with the El Cubo operation as the primary asset. It continues to expand silver and gold production in one of the world\'s oldest mining districts.',
    },
    {
      name: 'Digissues X',
      description: 'Digissues X operates multiple advanced energy sites, including state-of-the-art combined cycle systems and high-capacity substations. The company enhances and stabilizes the energy grid, serving industrial clients and supporting global power demands with innovative energy infrastructure solutions.',
    },
    {
      name: 'Arras Minerals Corp',
      description: 'Arras Minerals Corp. is a copper and gold focused exploration company focusing on copper and gold assets in northwestern Kazakhstan. Holding one of the country\'s largest exploration license portfolios, the company recently entered a strategic alliance with Teck Resources to fund a USD billion-generator exploration program. Ongoing work includes IP surveys, soil sampling, and drilling across the El Paso and Las properties.',
    },
    {
      name: 'Gold Hunter Resources',
      description: 'Gold Hunter Resources is dedicated to advancing high-potential gold and base metal projects through top-class exploration and strong buy-in strategy. With a commitment to discovery and sustainable growth, the company continues to unlock value across its strategic assets, driving opportunities in emerging mineral-rich regions.',
    },
    {
      name: 'BioEnerges',
      description: 'BioEnerges is an independent exploration company advancing oil and gas discoveries across frontier regions. With a focus on innovation, sustainability, and data-driven insights, the company leverage advanced scientific techniques to unlock new energy opportunities and strengthen critical mineral development.',
    },
    {
      name: 'Golfer',
      description: 'Golfer Inc. is an international mineral asset consultation company focused on acquiring, advancing and monetizing precious-metal projects globally. With experienced industry leadership and a strategic, value-driven approach, Golfer Inc. is positioned to transform under-developed minerals and established opportunities into solid prospected growth assets.',
    },
  ]

  const handleViewMore = (companyName: string) => {
    console.log(`View more for: ${companyName}`)
  }

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-8">Press Office</h1>

        {/* Companies List */}
        <div className="space-y-4">
          {companies.map((company, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex items-start gap-6 hover:shadow-md transition"
            >
              {/* Logo placeholder */}
              <div className="flex-shrink-0 w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">{company.name}</h3>
                <p className="text-sm text-slate-700 dark:text-slate-400 line-clamp-3">{company.description}</p>
              </div>

              {/* View More Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleViewMore(company.name)}
                  className="bg-white dark:bg-slate-800 border border-amber-600 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-700 px-4 py-2 rounded font-semibold text-sm transition whitespace-nowrap"
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PressOffice
