import React, { useState } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'

interface SubscribeFormCardProps {
  isCard?: boolean
}

export const SubscribeFormCard: React.FC<SubscribeFormCardProps> = ({ isCard = true }) => {
  const [email, setEmail] = useState('')
  const [subscriptions, setSubscriptions] = useState({
    corporateNews: false,
    magazine: false,
    dailyNewsletter: true,
    weeklyNewsletter: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleCheckboxChange = (key: keyof typeof subscriptions) => {
    setSubscriptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
      const selectedOptions = Object.entries(subscriptions)
        .filter(([_, v]) => v)
        .map(([k]) => {
          switch (k) {
            case 'corporateNews': return 'Corporate News'
            case 'magazine': return 'Magazine'
            case 'dailyNewsletter': return 'Daily Newsletter'
            case 'weeklyNewsletter': return 'Weekly Newsletter'
            default: return k
          }
        })
        .join(', ')

      await fetch('https://admins.miningdiscovery.com/api/contact-uses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            email: email,
            subject: 'Newsletter Subscription',
            message: `Selected subscriptions: ${selectedOptions || 'None'}`,
          },
        }),
      })
    } catch (err) {
      console.error('Subscription error:', err)
    } finally {
      setSubmitting(false)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setEmail('')
      }, 4000)
    }
  }

  return (
    <div
      className={
        isCard
          ? 'w-full bg-[#0A0F1D] text-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-800/80 relative overflow-hidden'
          : 'w-full text-white'
      }
    >
      {/* Header title for plain form layout */}
      {!isCard && (
        <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-[#3B82F6]">
          Daily Newsletter
        </h4>
      )}

      {/* Top left accent line if card */}
      {isCard && <div className="w-14 h-1 bg-[#1E3B6E] rounded-full mb-6" />}

      {/* Circular Mail Icon if card */}
      {isCard && (
        <div className="w-14 h-14 bg-[#111827] border border-[#1E3B6E]/60 rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
          <Mail className="w-6 h-6 text-[#3B82F6]" />
        </div>
      )}

      {/* Headline & Subtitle */}
      <div className={isCard ? 'text-center mb-6' : 'mb-4'}>
        {isCard ? (
          <>
            <h3 className="text-xl font-black tracking-wide mb-1.5 uppercase">
              <span className="text-white">DAILY </span>
              <span className="text-[#3B82F6]">NEWSLETTER</span>
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed max-w-xs mx-auto">
              Get the top mining stories delivered to your inbox.
            </p>
          </>
        ) : (
          <p className="text-slate-400 text-xs leading-relaxed">
            Get the top mining stories delivered directly to your inbox.
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your e-mail"
            required
            className="w-full bg-[#131C2E] border border-slate-700/80 rounded-lg px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-2.5 pt-1 pl-1">
          <label className="flex items-center gap-3 cursor-pointer group text-xs sm:text-sm text-slate-200 select-none">
            <input
              type="checkbox"
              checked={subscriptions.corporateNews}
              onChange={() => handleCheckboxChange('corporateNews')}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#1E3B6E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#1E3B6E]"
            />
            <span className="font-medium group-hover:text-white transition-colors">
              Corporate News
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group text-xs sm:text-sm text-slate-200 select-none">
            <input
              type="checkbox"
              checked={subscriptions.magazine}
              onChange={() => handleCheckboxChange('magazine')}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#1E3B6E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#1E3B6E]"
            />
            <span className="font-medium group-hover:text-white transition-colors">
              Magazine
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group text-xs sm:text-sm text-slate-200 select-none">
            <input
              type="checkbox"
              checked={subscriptions.dailyNewsletter}
              onChange={() => handleCheckboxChange('dailyNewsletter')}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#1E3B6E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#1E3B6E]"
            />
            <span className="font-medium group-hover:text-white transition-colors">
              Daily Newsletter
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group text-xs sm:text-sm text-slate-200 select-none">
            <input
              type="checkbox"
              checked={subscriptions.weeklyNewsletter}
              onChange={() => handleCheckboxChange('weeklyNewsletter')}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#1E3B6E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#1E3B6E]"
            />
            <span className="font-medium group-hover:text-white transition-colors">
              Weekly Newsletter
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1E3B6E] hover:bg-[#2563EB] active:bg-[#152a4f] text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-lg tracking-wider uppercase transition-colors shadow-md mt-4 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2 text-white">
              <Loader2 className="w-4 h-4 animate-spin" /> SUBMITTING...
            </span>
          ) : submitted ? (
            <span className="flex items-center justify-center gap-2 text-white">
              <Check className="w-4 h-4" /> SUBSCRIBED!
            </span>
          ) : (
            'SUBSCRIBE NOW'
          )}
        </button>
      </form>
    </div>
  )
}

export default SubscribeFormCard
