import React from 'react'

const RightColumn: React.FC = () => {
  return (
    <div className="lg:col-span-3 order-3 lg:border-l lg:border-slate-200 lg:dark:border-slate-800 lg:pl-6">
      <h4 className="font-bold text-xs uppercase tracking-widest border-b-2 border-primary w-fit pb-1 mb-6">Trending Now</h4>
      <div className="space-y-6">
        <div className="flex gap-4">
          <span className="serif-title text-3xl text-primary/30 font-bold">01</span>
          <p className="text-sm font-semibold hover:text-primary cursor-pointer">BHP targets expansion in copper-rich regions of Chile</p>
        </div>
        <div className="flex gap-4">
          <span className="serif-title text-3xl text-primary/30 font-bold">02</span>
          <p className="text-sm font-semibold hover:text-primary cursor-pointer">The ethical challenge of Deep Sea Mining: A detailed probe</p>
        </div>
        <div className="flex gap-4">
          <span className="serif-title text-3xl text-primary/30 font-bold">03</span>
          <p className="text-sm font-semibold hover:text-primary cursor-pointer">Why Institutional Investors are flocking back to Silver</p>
        </div>
        <div className="flex gap-4">
          <span className="serif-title text-3xl text-primary/30 font-bold">04</span>
          <p className="text-sm font-semibold hover:text-primary cursor-pointer">Green Hydrogen: The future of mine site power generation?</p>
        </div>
      </div>
    </div>
  )
}

export default RightColumn
