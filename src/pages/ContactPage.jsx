import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

/*
  Google Apps Script setup (same flow as Careers):
  Sheet columns: Timestamp | Name | Email | Phone | Subject | Message

  Apps Script:
  ─────────────────────────────────────────────────────────
  function doPost(e) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(),
      e.parameter.name,
      e.parameter.email,
      e.parameter.phone,
      e.parameter.subject,
      e.parameter.message,
    ]);
    return ContentService.createTextOutput('OK');
  }
  ─────────────────────────────────────────────────────────
*/
const SHEET_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'

const CONTACT_DETAILS = [
  {
    label: 'Visit Us',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1.5A5.25 5.25 0 0 1 14.25 6.75C14.25 11.25 9 16.5 9 16.5S3.75 11.25 3.75 6.75A5.25 5.25 0 0 1 9 1.5z" stroke="currentColor" strokeWidth="1.1" fill="none"/>
        <circle cx="9" cy="6.75" r="1.8" fill="currentColor"/>
      </svg>
    ),
    lines: ['136, Near PK Internation School', 'Pimple Saudagar , Pune , Maharashtra – 411027'],
  },
  {
    label: 'Call Us',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3.5 3h3l1.5 3.5-1.75 1.25A9.5 9.5 0 0 0 9.25 10.75L10.5 9l3.5 1.5V14a1 1 0 0 1-1 1C6.5 15 3 8.5 3.5 4a1 1 0 0 1 0 0z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    lines: ['+91 7631125125'],
  },
  {
    label: 'Write to Us',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1" fill="none"/>
        <path d="M2 5l7 5.5L16 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
    lines: ['pkgroup125@gmail.com'],
  },
  {
    label: 'Office Hours',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.1" fill="none"/>
        <path d="M9 5.5V9l2.5 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    lines: ['Monday – Saturday', '10:00 AM – 7:00 PM'],
  },
]

const BLANK = { name: '', email: '', phone: '', subject: '', message: '' }

export default function ContactPage() {
  const [form,   setForm]   = useState(BLANK)
  const [status, setStatus] = useState('idle')

  const heroLine1  = useRef(null)
  const heroLine2  = useRef(null)
  const heroSub    = useRef(null)
  const contentRef = useRef(null)
  const detailRefs = useRef([])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = ''

    if (window.matchMedia('(max-width: 768px)').matches) return

    const ctx = gsap.context(() => {
      gsap.set([heroLine1.current, heroLine2.current], { yPercent: 110 })
      gsap.set(heroSub.current, { opacity: 0, y: 16 })
      gsap.to(heroLine1.current, { yPercent: 0, duration: 1.1, delay: 0.2,  ease: 'power4.out' })
      gsap.to(heroLine2.current, { yPercent: 0, duration: 1.1, delay: 0.34, ease: 'power4.out' })
      gsap.to(heroSub.current,   { opacity: 1, y: 0, duration: 0.9, delay: 0.6, ease: 'power3.out' })

      gsap.set(contentRef.current, { opacity: 0, y: 30 })
      ScrollTrigger.create({
        trigger: contentRef.current,
        start: 'top 88%',
        onEnter: () => gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }),
      })

      detailRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { opacity: 0, y: 24 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out' }),
        })
      })
    })

    return () => ctx.revert()
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode:   'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(form).toString(),
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <div className="contact-hero">
        <span className="contact-eyebrow">Get in Touch</span>
        <h1 className="contact-heading">
          <div className="contact-mask">
            <span ref={heroLine1}>We're listening.</span>
          </div>
          <div className="contact-mask">
            <span ref={heroLine2} className="contact-heading--dim">Say hello.</span>
          </div>
        </h1>
        <p ref={heroSub} className="contact-sub">
          Whether you're looking for your next home, exploring a partnership,
          or simply want to know more — we'd love to hear from you.
        </p>
      </div>

      {/* ── Content ── */}
      <section ref={contentRef} className="contact-body">

        {/* ── Left: Details ── */}
        <div className="contact-details">
          <span className="contact-details-eyebrow">Our Office</span>
          <div className="contact-details-list">
            {CONTACT_DETAILS.map((d, i) => (
              <div key={d.label} ref={el => detailRefs.current[i] = el} className="contact-detail-item">
                <div className="contact-detail-icon">{d.icon}</div>
                <div className="contact-detail-text">
                  <span className="contact-detail-label">{d.label}</span>
                  {d.lines.map((line, j) => (
                    <span key={j} className="contact-detail-line">{line}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="contact-form-wrap">
          <div className="contact-form-head">
            <span className="contact-details-eyebrow">Send a Message</span>
          </div>

          {status === 'sent' ? (
            <div className="contact-success">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="24" stroke="var(--gold)" strokeWidth="1.5"/>
                <path d="M16 26l7 7 13-13" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="contact-success-title">Message received.</h3>
              <p className="contact-success-body">
                Thank you for reaching out. Someone from our team will get back to you within one business day.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>

              <div className="contact-form-row">
                <div className="contact-form-field">
                  <label className="contact-form-label">Full Name *</label>
                  <input
                    className="contact-form-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="contact-form-field">
                  <label className="contact-form-label">Email *</label>
                  <input
                    className="contact-form-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-form-field">
                  <label className="contact-form-label">Phone <span className="contact-form-opt">(optional)</span></label>
                  <input
                    className="contact-form-input"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="contact-form-field">
                  <label className="contact-form-label">Subject *</label>
                  <select
                    className="contact-form-input contact-form-select"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="Project Enquiry">Project Enquiry</option>
                    <option value="Site Visit">Site Visit Request</option>
                    <option value="Partnership">Partnership / Channel Partner</option>
                    <option value="General">General Enquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="contact-form-field">
                <label className="contact-form-label">Message *</label>
                <textarea
                  className="contact-form-input contact-form-textarea"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind…"
                  required
                  rows={6}
                />
              </div>

              {status === 'error' && (
                <p className="contact-form-error">Something went wrong. Please email us directly at info@pkgroup.in</p>
              )}

              <button type="submit" className="contact-form-submit" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <><span className="contact-spinner" />Sending…</>
                ) : (
                  <>
                    Send Message
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </section>

      <Footer />
    </>
  )
}
