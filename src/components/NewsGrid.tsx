import React from 'react'

const NewsGrid: React.FC = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-12">
      <div className="lg:col-span-3">
        <div className="flex items-center gap-6 mb-8 overflow-x-auto scrollbar-hide border-b border-slate-100 dark:border-slate-800 pb-px">
          <button className="text-sm font-bold pb-4 border-b-2 border-primary">UK NEWS</button>
          <button className="text-sm font-bold pb-4 text-slate-400 hover:text-slate-600 border-b-2 border-transparent hover:border-slate-300">AUSTRALIA</button>
          <button className="text-sm font-bold pb-4 text-slate-400 hover:text-slate-600 border-b-2 border-transparent hover:border-slate-300">CANADA</button>
          <button className="text-sm font-bold pb-4 text-slate-400 hover:text-slate-600 border-b-2 border-transparent hover:border-slate-300">LATIN AMERICA</button>
          <button className="text-sm font-bold pb-4 text-slate-400 hover:text-slate-600 border-b-2 border-transparent hover:border-slate-300">AFRICA</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <article className="group">
            <div className="aspect-video bg-slate-200 overflow-hidden mb-4 rounded-lg">
              <img alt="Mining operations landscape" className="w-full h-full object-cover group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_kIBfKbOnVpzW1l9R4lLHGPA14JMr3T2kQPjtlosD8HXDz40vMmNVHzhfBSu8PWRjDwIwbMH89U-59cHMwqU8Tyo5wfT9Mvj-7Bthpb_5IlAyslt1DUwCi0mBxnQLL2N7iJ6BNCnmXLAl6zbt6uWGOOEcn1nzRjqZs9nvP5vPUSBASh7O5c3DkETrhqfPBFqlBJc9TnHGfL_qz9BNfyJpBwhE-DFpxNp65qjNraXLGBX3roZ32RdI5zHPG4YFe0E4_dZd6NoI2K6I"/>
            </div>
            <h4 className="serif-title text-2xl mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer">Yorkshire Potash Project Secures Final Round of Environmental Clearances</h4>
            <p className="text-sm text-slate-500 mb-4">The long-awaited project is set to begin full-scale construction in Q3 2024, promising over 2,000 regional jobs.</p>
            <span className="text-[10px] font-bold text-slate-400 uppercase">14 Min Read</span>
          </article>
          <article className="group">
            <div className="aspect-video bg-slate-200 overflow-hidden mb-4 rounded-lg">
              <img alt="Steel and minerals" className="w-full h-full object-cover group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXV5gwI1Xej7QQ6g81JiHucNas_dU-ik2MPs4ZfZAvcvzzIpapyidycI-gJq9n0f-uGMxKN5KMUSdpV96LTWBEp6EUmFpP9-RLs5EJofpP_W-DfzexmV53sVa11hURYPV1aL71SM-RS2ZyoM-cGjYCLBxqjF5jPSv2P3792MZInMI1e0K7wTC7IA-GBoeqJxqBjD_gV49H2kTZphiUPj9FEmVcOuNNjYA5OY188BWbaxLY-mP0mhksCNjPB0gqYpsH4EiOTnagbNuO"/>
            </div>
            <h4 className="serif-title text-2xl mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer">Cornwall Lithium Hits Critical Purity Milestones in Pilot Testing</h4>
            <p className="text-sm text-slate-500 mb-4">New direct lithium extraction tech shows promise for domestic EV battery supply chains in the UK.</p>
            <span className="text-[10px] font-bold text-slate-400 uppercase">8 Min Read</span>
          </article>
          <article className="group border-t border-slate-100 dark:border-slate-800 pt-6">
            <h4 className="serif-title text-xl mb-2 group-hover:text-primary transition-colors cursor-pointer">Scotland Gold: New Vein Discovered at Cononish Site</h4>
            <p className="text-sm text-slate-500 mb-4">Recent exploration drilling has intersected high-grade mineralization beyond current resource estimates.</p>
          </article>
          <article className="group border-t border-slate-100 dark:border-slate-800 pt-6">
            <h4 className="serif-title text-xl mb-2 group-hover:text-primary transition-colors cursor-pointer">Heritage Mining: Protecting the History of Welsh Coal Towns</h4>
            <p className="text-sm text-slate-500 mb-4">A new museum initiative looks to preserve the cultural legacy of the valleys as they transition to renewables.</p>
          </article>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl text-center">
          <h5 className="text-xs font-extrabold text-primary mb-6 uppercase tracking-[0.2em]">Latest Magazine</h5>
          <div className="relative inline-block group cursor-pointer mb-6">
            <div className="absolute inset-0 bg-primary/20 -translate-x-2 translate-y-2 rounded shadow-xl group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
            <img alt="Magazine Cover" className="relative w-full max-w-[12rem] h-auto object-cover rounded shadow-2xl transition-transform group-hover:scale-[1.02] mx-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3KN0aRSDOlR6SMM6PnsGmPIuC8SZ6Xo-SEz-ZZwudiGryXA2CZgQqudyZp4pjDUETPLNCHb16xzDrwsJLFcWC2tt2AEBYNnRYRXZNx15EKnRFr8fTz8hzvsSdfEXVAZvAMftnI6wROTg8ixP4GPqIgKYMQg8mXt_19_sAydlRar4I66xywDPaifL7G5ry0CTcVRyn_k9f5yUbuMP6MRh717b7qi28AfqolxPY0qBiq_UoKIYzhs3pz6bTAu6SNAsXLhk7-vfdA1I"/>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white rounded">
              <span className="material-icons text-4xl">chrome_reader_mode</span>
            </div>
          </div>
          <p className="font-bold serif-title text-xl mb-2">Winter 2024 Issue</p>
          <p className="text-sm text-slate-400 mb-6 px-4">The Future of Automation: Robots in the Deep Mines</p>
          <button className="w-full bg-slate-900 dark:bg-primary py-3 rounded text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-primary/90 transition-colors">Download PDF</button>
          <a className="inline-block mt-4 text-[10px] font-bold uppercase hover:text-primary" href="#">Order Print Copy</a>
        </div>
      </div>
    </section>
  )
}

export default NewsGrid
