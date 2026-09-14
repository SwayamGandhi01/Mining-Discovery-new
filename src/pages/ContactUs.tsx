import React, { useEffect, useRef, useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Copy,
  Check,
  Navigation,
  MessageSquare,
  Search,
  Reply,
} from 'lucide-react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

type FieldErrors = Partial<Record<keyof FormData, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MESSAGE_MAX = 1000
const MESSAGE_MIN = 20

const OFFICE_ADDRESS = '180 Lafayette Street, Passaic, New Jersey 07055, USA'
const MAP_QUERY = encodeURIComponent(OFFICE_ADDRESS)
const CONTACT_EMAIL = 'laura@laurastein.net'
const CONTACT_PHONE = '+1 862 295 0117'

const FIELD_ORDER: (keyof FormData)[] = ['name', 'email', 'subject', 'message']

const validateField = (field: keyof FormData, rawValue: string): string | undefined => {
  const value = rawValue.trim()
  switch (field) {
    case 'name':
      if (!value) return 'Please enter your name.'
      if (value.length < 2) return 'Please enter at least 2 characters.'
      return undefined
    case 'email':
      if (!value) return 'Please enter your email address.'
      if (!EMAIL_RE.test(value)) return 'Please enter a valid email address.'
      return undefined
    case 'subject':
      if (!value) return 'Please select a subject.'
      return undefined
    case 'message':
      if (!value) return 'Please enter a message.'
      if (value.length < MESSAGE_MIN) return `Please add a little more detail (${value.length}/${MESSAGE_MIN} characters).`
      return undefined
    default:
      return undefined
  }
}

/** Small inline "copy to clipboard" button used beside the email and phone number. */
const CopyButton: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard API unavailable (insecure context / older browser) — fail quietly.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      title={copied ? 'Copied!' : `Copy ${label}`}
      className="p-1.5 rounded-md text-slate-400 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Honeypot: bots fill hidden fields, humans never see this one.
  const honeypotRef = useRef('')
  const fieldRefs = useRef<Partial<Record<keyof FormData, HTMLElement | null>>>({})
  const successRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Contact Us | Mining Discovery'

    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? null
    meta?.setAttribute(
      'content',
      'Get in touch with Mining Discovery for partnership, advertising, media and general inquiries. We respond within 24 business hours.'
    )

    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== null) meta.setAttribute('content', previousDescription)
    }
  }, [])

  // Move focus to the confirmation message so screen readers and keyboard users land on it.
  useEffect(() => {
    if (submitted) successRef.current?.focus()
  }, [submitted])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const field = name as keyof FormData
    setFormData(prev => ({ ...prev, [field]: value }))

    // Only re-validate live once the field has been visited, so typing isn't nagged at.
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const field = e.target.name as keyof FormData
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(prev => ({ ...prev, [field]: validateField(field, e.target.value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const nextErrors: FieldErrors = {}
    FIELD_ORDER.forEach(field => {
      const error = validateField(field, formData[field])
      if (error) nextErrors[field] = error
    })

    setTouched({ name: true, email: true, subject: true, message: true })
    setErrors(nextErrors)

    const firstInvalid = FIELD_ORDER.find(field => nextErrors[field])
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus()
      return
    }

    // Silently drop bot submissions without telling them why.
    if (honeypotRef.current) {
      setSubmitted(true)
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('https://admins.miningdiscovery.com/api/contact-uses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject,
            message: formData.message.trim(),
          },
        }),
      })

      if (!res.ok) throw new Error('Failed to send message. Please try again.')

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTouched({})
      setErrors({})
    } catch (err: any) {
      console.error('Contact submission error:', err)
      setSubmitError(
        err?.message === 'Failed to fetch'
          ? 'We could not reach the server. Check your connection and try again.'
          : err?.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputBase =
    'w-full px-4 py-3.5 bg-slate-800/60 text-white placeholder-slate-500 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 text-sm'

  const fieldClass = (field: keyof FormData) =>
    `${inputBase} ${
      errors[field]
        ? 'border-red-400/70 focus:border-red-400 focus:ring-red-400/30'
        : 'border-slate-700/60 focus:border-[#3B82F6] focus:ring-[#3B82F6]/40'
    }`

  const labelClass = 'block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5'

  const FieldError: React.FC<{ field: keyof FormData }> = ({ field }) =>
    errors[field] ? (
      <p id={`${field}-error`} className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        {errors[field]}
      </p>
    ) : null

  const messageLength = formData.message.length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <Mail className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h1 className="serif-title text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Contact Us
          </h1>
          <div className="w-16 h-0.5 bg-[#3B82F6] mx-auto mb-5" />
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            We'd love to hear from you. Reach out with questions, partnership inquiries, or media requests.
          </p>
        </div>
      </div>

      {/* Info Cards Strip */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Mail className="w-5 h-5 text-[#3B82F6]" />, label: 'Email Us', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
            { icon: <Phone className="w-5 h-5 text-[#3B82F6]" />, label: 'Call Us', value: CONTACT_PHONE, href: 'tel:+18622950117' },
            { icon: <Clock className="w-5 h-5 text-[#3B82F6]" />, label: 'Business Hours', value: 'Mon–Fri, 9AM–6PM EST', href: null },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-sm font-bold text-slate-900 dark:text-white hover:text-[#3B82F6] transition-colors break-words">{item.value}</a>
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-slate-900 text-white rounded-2xl p-7 sm:p-9 shadow-xl relative overflow-hidden">
            {/* Accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#3B82F6]" />

            <h2 className="text-2xl font-bold mb-1 mt-2">Send Us a Message</h2>
            <p className="text-slate-400 text-sm mb-7">Fill out the form below and we'll respond within 24 hours.</p>

            {submitted ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="py-16 text-center focus:outline-none"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Message Sent!</h3>
                <p className="text-slate-300 text-sm max-w-xs mx-auto">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-[#3B82F6] text-sm font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 rounded px-2 py-1"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Honeypot — hidden from users, catches automated spam */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="contact-company">Company (leave blank)</label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={e => { honeypotRef.current = e.target.value }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Your Name <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-name"
                      ref={el => { fieldRefs.current.name = el }}
                      type="text"
                      name="name"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="name"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={fieldClass('name')}
                    />
                    <FieldError field="name" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email Address <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      ref={el => { fieldRefs.current.email = el }}
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={fieldClass('email')}
                    />
                    <FieldError field="email" />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className={labelClass}>
                    Subject <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="contact-subject"
                    ref={el => { fieldRefs.current.subject = el }}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    className={`${fieldClass('subject')} cursor-pointer [&>option]:bg-slate-800 [&>option]:text-white`}
                  >
                    <option value="">Select a subject...</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Partnership & Advertising">Partnership & Advertising</option>
                    <option value="Media & Press">Media & Press</option>
                    <option value="Newsletter Subscription">Newsletter Subscription</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                  <FieldError field="subject" />
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <label htmlFor="contact-message" className={labelClass}>
                      Message <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <span
                      className={`text-xs tabular-nums mb-1.5 ${
                        messageLength > MESSAGE_MAX - 50 ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      {messageLength}/{MESSAGE_MAX}
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    ref={el => { fieldRefs.current.message = el }}
                    name="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    maxLength={MESSAGE_MAX}
                    rows={6}
                    className={`${fieldClass('message')} resize-none`}
                  />
                  <FieldError field="message" />
                </div>

                <div aria-live="assertive">
                  {submitError && (
                    <div role="alert" className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {submitError}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#1E3B6E] hover:from-[#60A5FA] hover:to-[#2563eb] text-white font-bold py-3.5 px-10 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
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
                  <p className="text-xs text-slate-500">
                    <span className="text-red-400" aria-hidden="true">*</span> Required fields. We never share your details.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Info Panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Contact Details Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#3B82F6]" />
                Contact Information
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-0.5">Email</p>
                    <div className="flex items-center gap-1">
                      <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-[#3B82F6] transition-colors break-all">
                        {CONTACT_EMAIL}
                      </a>
                      <CopyButton value={CONTACT_EMAIL} label="email address" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-0.5">Phone</p>
                    <div className="flex items-center gap-1">
                      <a href="tel:+18622950117" className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-[#3B82F6] transition-colors">
                        {CONTACT_PHONE}
                      </a>
                      <CopyButton value={CONTACT_PHONE} label="phone number" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-0.5">Office</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      180 Lafayette Street,<br />Passaic, New Jersey 07055, USA
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] hover:underline mt-2"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Get directions
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-0.5">Business Hours</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      Monday – Friday<br />9:00 AM – 6:00 PM EST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#3B82F6]" />
                What Happens Next
              </h3>
              <ol className="space-y-4">
                {[
                  { icon: <Send className="w-3.5 h-3.5" />, title: 'You send your message', body: 'Pick a subject so it reaches the right desk straight away.' },
                  { icon: <Search className="w-3.5 h-3.5" />, title: 'We review it', body: 'Our editorial and partnerships team reads every inquiry.' },
                  { icon: <Reply className="w-3.5 h-3.5" />, title: 'You hear back', body: 'Expect a reply within 24 hours on business days.' },
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
                        {step.icon}
                      </div>
                      {i < 2 && <div className="absolute left-1/2 top-8 h-4 w-px -translate-x-1/2 bg-slate-200 dark:bg-slate-700" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{step.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-14 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="w-10 h-10 bg-[#3B82F6]/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">We're Here to Help</h2>
          <p className="text-slate-300 text-base mb-7 max-w-lg mx-auto">
            Have a question about Mining Discovery? Our team is ready to assist with partnerships, advertising, and media inquiries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563eb] text-white font-bold py-3.5 px-9 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Mail className="w-4 h-4" />
              Email Us Directly
            </a>
            <a
              href="tel:+18622950117"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3.5 px-9 rounded-xl transition-all duration-300 text-sm tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Phone className="w-4 h-4" />
              Call {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs
