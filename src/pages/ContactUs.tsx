import React, { useState } from 'react'
import { Mail, Phone, MapPin, Linkedin, Youtube, Send, CheckCircle, AlertCircle, Clock, Globe } from 'lucide-react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('https://admins.miningdiscovery.com/api/contact-uses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
        }),
      })

      if (!res.ok) throw new Error('Failed to send message. Please try again.')

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      console.error('Contact submission error:', err)
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3.5 bg-slate-800/60 text-white placeholder-slate-400 rounded-xl border border-slate-700/60 focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]/40 transition-all duration-200 text-sm'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#C59B27 1px, transparent 1px), linear-gradient(90deg, #C59B27 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#C59B27]/15 border border-[#C59B27]/30 text-[#C59B27] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <Mail className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h1 className="serif-title text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Contact Us
          </h1>
          <div className="w-16 h-0.5 bg-[#C59B27] mx-auto mb-5" />
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            We'd love to hear from you. Reach out with questions, partnership inquiries, or media requests.
          </p>
        </div>
      </div>

      {/* Info Cards Strip */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Mail className="w-5 h-5 text-[#C59B27]" />, label: 'Email Us', value: 'laura@laurastein.net', href: 'mailto:laura@laurastein.net' },
            { icon: <Phone className="w-5 h-5 text-[#C59B27]" />, label: 'Call Us', value: '+1 862 295 0117', href: 'tel:+18622950117' },
            { icon: <Clock className="w-5 h-5 text-[#C59B27]" />, label: 'Business Hours', value: 'Mon–Fri, 9AM–6PM EST', href: null },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#C59B27]/10 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-sm font-bold text-slate-900 dark:text-white hover:text-[#C59B27] transition-colors">{item.value}</a>
                ) : (
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-slate-900 text-white rounded-2xl p-7 sm:p-9 shadow-xl relative overflow-hidden">
            {/* Gold accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C59B27] via-[#e8c35a] to-[#C59B27]" />

            <h2 className="text-2xl font-bold mb-1 mt-2">Send Us a Message</h2>
            <p className="text-slate-400 text-sm mb-7">Fill out the form below and we'll respond within 24 hours.</p>

            {submitted ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Message Sent!</h3>
                <p className="text-slate-300 text-sm max-w-xs mx-auto">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-[#C59B27] text-sm font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={inputClass + ' cursor-pointer'}
                  >
                    <option value="">Select a subject...</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Partnership & Advertising">Partnership & Advertising</option>
                    <option value="Media & Press">Media & Press</option>
                    <option value="Newsletter Subscription">Newsletter Subscription</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Message</label>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={inputClass + ' resize-none'}
                  />
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C59B27] to-[#a8832a] hover:from-[#d4a83a] hover:to-[#C59B27] text-white font-bold py-3.5 px-10 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Info Panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Contact Details Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C59B27]" />
                Contact Information
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#C59B27]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#C59B27]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-0.5">Email</p>
                    <a href="mailto:laura@laurastein.net" className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-[#C59B27] transition-colors">
                      laura@laurastein.net
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#C59B27]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#C59B27]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-0.5">Phone</p>
                    <a href="tel:+18622950117" className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-[#C59B27] transition-colors">
                      +1 862 295 0117
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#C59B27]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#C59B27]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-0.5">Office</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      180 Lafayette Street,<br />Passaic, New Jersey 07055, USA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-2">Connect with Laura Stein</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Follow Laura's work in mining media and investor relations.</p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.linkedin.com/in/laura-stein-b4867313"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] dark:text-blue-400 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Profile
                  <span className="ml-auto text-xs opacity-60 group-hover:opacity-100">→</span>
                </a>
                <a
                  href="https://www.youtube.com/watch?v=KzyysYdoLzI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border border-[#FF0000]/30 text-[#FF0000] dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group"
                >
                  <Youtube className="w-4 h-4" />
                  YouTube Feature
                  <span className="ml-auto text-xs opacity-60 group-hover:opacity-100">→</span>
                </a>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-14 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="w-10 h-10 bg-[#C59B27]/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-5 h-5 text-[#C59B27]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">We're Here to Help</h2>
          <p className="text-slate-300 text-base mb-7 max-w-lg mx-auto">
            Have a question about Mining Discovery? Our team is ready to assist with partnerships, advertising, and media inquiries.
          </p>
          <a
            href="mailto:laura@laurastein.net"
            className="inline-flex items-center gap-2 bg-[#C59B27] hover:bg-[#d4a83a] text-white font-bold py-3.5 px-9 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm tracking-wide"
          >
            <Mail className="w-4 h-4" />
            Email Us Directly
          </a>
        </div>
      </section>
    </div>
  )
}

export default ContactUs
