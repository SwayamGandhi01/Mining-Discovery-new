import React from 'react'

const HeroSection: React.FC = () => {
  return (
    <section className="lg:col-span-6 order-1 lg:order-2">
      <article className="relative">
        <div className="aspect-[16/9] bg-slate-200 overflow-hidden mb-4">
          <img alt="Heavy machinery in an open pit mine" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1XL-RtUexs4H2skppv4FXa6Yasp4r4gHJ_bD8bfChLBoq5YHWfU766HcpzXAsznnxq6D73JJhHAah5EFytxgMBuKmsCs4360v9erCby6OzmP_t_mCVvYyIZbE6sy6c34sG8boraE9zjJ3xJXC-0OOJEEqPemBbmonCsY0emvKo3nxts7p_jwCbdBdHnOby0HZLmTSW0LUGRXMNoPsGavi8E8ZyAgs4EPFfXgnoeO_yfUenf8-I-r_gCwkztyh9j5B-g9CVfWAERlt"/>
        </div>
        <div className="text-center px-4">
          <span className="inline-block bg-primary/10 text-primary text-[10px] font-extrabold px-3 py-1 mb-3">COVER STORY</span>
          <h2 className="serif-title text-3xl md:text-5xl leading-tight mb-4 hover:underline decoration-primary decoration-2 underline-offset-8 cursor-pointer">Global Decarbonization Hinges on a Massive Increase in Critical Mineral Extraction</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">A special report on the widening gap between climate targets and actual mineral supply, and the industry leaders racing to fill the void.</p>
          <div className="mt-6 flex items-center justify-center space-x-4 text-xs font-bold text-slate-400">
            <span>By MARSHALL STONE</span>
            <span className="w-1 h-1 bg-primary rounded-full" />
            <span>JANUARY 24, 2024</span>
          </div>
        </div>
      </article>
    </section>
  )
}

export default HeroSection
