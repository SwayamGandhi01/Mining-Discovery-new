import React from 'react'

const LeftColumn: React.FC = () => {
  return (
    <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1 lg:border-r lg:border-slate-200 lg:dark:border-slate-800 lg:pr-6">
      <article className="group">
        <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">COPPER</p>
        <h3 className="serif-title text-xl leading-tight group-hover:text-primary transition-colors cursor-pointer">The Great Electrification: Why Copper is the New Oil</h3>
        <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">Infrastructure projects across Europe are driving unprecedented demand for red metal as grids undergo transformation.</p>
      </article>
      <hr className="border-slate-100 dark:border-slate-800"/>
      <article className="group">
        <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">TECHNOLOGY</p>
        <h3 className="serif-title text-xl leading-tight group-hover:text-primary transition-colors cursor-pointer">AI-Driven Exploration: Reducing Risks in Greenfields</h3>
        <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">How machine learning algorithms are identifying Tier 1 deposits with 40% higher accuracy than traditional methods.</p>
      </article>
      <hr className="border-slate-100 dark:border-slate-800"/>
      <article className="group">
        <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">POLITICS</p>
        <h3 className="serif-title text-xl leading-tight group-hover:text-primary transition-colors cursor-pointer">UK Mining Reform Bill Passed: What it Means for Investors</h3>
        <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">The new legislation aims to streamline permitting while maintaining strict environmental oversight.</p>
      </article>
    </div>
  )
}

export default LeftColumn
