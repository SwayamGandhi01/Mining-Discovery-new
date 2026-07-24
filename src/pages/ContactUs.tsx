import React, { useState } from 'react'

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to send message. Please try again.')
      }

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (err: any) {
      console.error('Contact submission error:', err)
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Page Title */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center">Contact us</h1>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-8 sm:py-12 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Send Us a Message Form */}
          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">Send Us a Message</h2>

            {submitted ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">✓</div>
                <p className="text-lg font-semibold">Thank you for your message! We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800 text-white placeholder-slate-400 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800 text-white placeholder-slate-400 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />

                {/* Subject */}
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800 text-white placeholder-slate-400 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />

                {/* Message */}
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-800 text-white placeholder-slate-400 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
                />

                {submitError && (
                  <p className="text-sm text-red-400 font-medium">{submitError}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">Contact Information</h2>

            {/* Email */}
            <div className="mb-6">
              <p className="text-amber-400 font-semibold mb-1">Email:</p>
              <a href="mailto:laura@laurastein.net" className="text-blue-400 hover:text-blue-300">
                laura@laurastein.net
              </a>
            </div>

            {/* Phone */}
            <div className="mb-6">
              <p className="text-amber-400 font-semibold mb-1">Phone:</p>
              <a href="tel:+18622950117" className="text-blue-400 hover:text-blue-300">
                +1 862 295 0117
              </a>
            </div>

            {/* Office Address */}
            <div className="mb-6">
              <p className="text-amber-400 font-semibold mb-1">Office Address:</p>
              <p className="text-slate-300">Address: 180 Lafayette Street, Passaic, New Jersey 07055, USA</p>
            </div>

            {/* Social & Media Links */}
            <div className="mb-6">
              <p className="text-amber-400 font-semibold mb-2">Connect with Laura Stein:</p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="https://www.linkedin.com/in/laura-stein-b4867313"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0A66C2] hover:bg-[#084e96] text-white px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5"
                >
                  LinkedIn Profile
                </a>
                <a
                  href="https://www.youtube.com/watch?v=KzyysYdoLzI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF0000] hover:bg-[#cc0000] text-white px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5"
                >
                  YouTube Feature
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8">
              <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded text-sm mb-4 transition">
                View larger map
              </button>

              {/* Embedded Map */}
              <div className="w-full h-64 bg-sky-200 rounded border border-slate-600 relative overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.8321770073863!2d-74.27036!3d40.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f5e5e5e5e5e5%3A0x5e5e5e5e5e5e5e5e!2s180%20Lafayette%20St%2C%20Passaic%2C%20NJ%2007055!5e0!3m2!1sen!2sus!4v1234567890"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-100 dark:bg-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">We're Here to Help</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            Have a question about Laura's Liaisons? Our team is ready to assist you. Reach out today!
          </p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded transition">
            Schedule a Call
          </button>
        </div>
      </section>
    </div>
  )
}

export default ContactUs
