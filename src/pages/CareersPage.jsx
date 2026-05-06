import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

/*
  Google Apps Script setup:
  1. Create a Google Sheet with columns:
     Timestamp | Name | Email | Phone | Position | Experience | Note | Portfolio
  2. In the sheet: Extensions → Apps Script → paste the doPost function below
  3. Deploy as Web App (Execute as: Me, Who has access: Anyone)
  4. Copy the deployment URL and paste it into SHEET_URL below.

  Apps Script code:
  ─────────────────────────────────────────────────────────────────
  function doPost(e) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(),
      e.parameter.name,
      e.parameter.email,
      e.parameter.phone,
      e.parameter.position,
      e.parameter.experience,
      e.parameter.note,
      e.parameter.portfolio,
    ]);
    return ContentService.createTextOutput('OK');
  }
  ─────────────────────────────────────────────────────────────────
*/
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxkKiJGc_AGIRxUshWAc-XZIvUswGnCpKaSzyV4-GZZRYGi-ikBvCy0ndV6MkLulumK/exec'

const JOBS = [
  {
    id:          'site-engineer',
    department:  'Construction',
    title:       'Site Engineer',
    location:    'Wakad, Pune',
    type:        'Full-time',
    description: 'Oversee day-to-day construction activities, ensure quality compliance, and coordinate with contractors across active project sites.',
    requirements: [
      'B.E. / B.Tech in Civil Engineering',
      '2–5 years of on-site experience',
      'Familiarity with IS codes and quality norms',
    ],
  },
  {
    id:          'interior-designer',
    department:  'Design',
    title:       'Interior Designer',
    location:    'Baner, Pune',
    type:        'Full-time',
    description: 'Conceptualise and execute interior schemes for model apartments, lobbies, and amenity spaces that reflect the PK Group standard of restrained luxury.',
    requirements: [
      'Degree / Diploma in Interior Design',
      '3+ years of residential project experience',
      'Proficiency in AutoCAD, 3ds Max or equivalent',
    ],
  },
  {
    id:          'business-development',
    department:  'Sales',
    title:       'Business Development Executive',
    location:    'Pune',
    type:        'Full-time',
    description: 'Build and maintain relationships with channel partners, broker networks, and direct buyers to drive residential sales targets.',
    requirements: [
      'Any graduate with strong communication skills',
      '2+ years in real estate or B2B sales',
      'Existing broker network in Pune preferred',
    ],
  },
  {
    id:          'project-manager',
    department:  'Projects',
    title:       'Project Manager',
    location:    'Wakad, Pune',
    type:        'Full-time',
    description: 'End-to-end ownership of project delivery — from planning and procurement to handover — ensuring timelines, budgets, and quality benchmarks are met.',
    requirements: [
      'B.E. Civil / MBA (Construction Management)',
      '7+ years of real estate project management',
      'PMP or PRINCE2 certification is a plus',
    ],
  },
  {
    id:          'crm-executive',
    department:  'Customer Relations',
    title:       'CRM Executive',
    location:    'Pune',
    type:        'Full-time',
    description: 'Manage post-booking customer journeys from allotment and documentation through to possession, ensuring a seamless and premium homebuyer experience.',
    requirements: [
      'Graduate with excellent interpersonal skills',
      '1–3 years in customer service or CRM roles',
      'Proficiency in CRM software and MS Office',
    ],
  },
]

const BLANK_FORM = { name: '', email: '', phone: '', experience: '', note: '', portfolio: '' }

export default function CareersPage() {
  const [activeJob,  setActiveJob]  = useState(null)
  const [form,       setForm]       = useState(BLANK_FORM)
  const [status,     setStatus]     = useState('idle') // idle | sending | sent | error

  const heroLine1   = useRef(null)
  const heroLine2   = useRef(null)
  const heroSub     = useRef(null)
  const cardRefs    = useRef([])
  const drawerRef   = useRef(null)
  const overlayRef  = useRef(null)

  // Hero entrance
  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = ''
    ScrollTrigger.refresh()

    const ctx = gsap.context(() => {
      gsap.set([heroLine1.current, heroLine2.current], { yPercent: 110 })
      gsap.set(heroSub.current, { opacity: 0, y: 16 })
      gsap.to(heroLine1.current, { yPercent: 0, duration: 1.1, delay: 0.2,  ease: 'power4.out' })
      gsap.to(heroLine2.current, { yPercent: 0, duration: 1.1, delay: 0.34, ease: 'power4.out' })
      gsap.to(heroSub.current,   { opacity: 1, y: 0, duration: 0.9, delay: 0.6, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [])

  // Cards scroll in
  useEffect(() => {
    const triggers = []
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, { opacity: 0, y: 40 })
      triggers.push(ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => gsap.to(el, {
          opacity: 1, y: 0,
          duration: 0.8, delay: (i % 2) * 0.1,
          ease: 'power3.out',
        }),
      }))
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => { clearTimeout(t); triggers.forEach(st => st.kill()) }
  }, [])

  // Drawer open/close
  const openDrawer = (job) => {
    setActiveJob(job)
    setForm(BLANK_FORM)
    setStatus('idle')
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      gsap.set(overlayRef.current, { display: 'block' })
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(drawerRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.5, ease: 'power3.out' }
      )
    })
  }

  const closeDrawer = () => {
    gsap.to(drawerRef.current, {
      x: '100%', duration: 0.4, ease: 'power3.in',
      onComplete: () => {
        gsap.set(overlayRef.current, { display: 'none', opacity: 0 })
        setActiveJob(null)
        document.body.style.overflow = ''
      },
    })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 })
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode:   'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          ...form,
          position: activeJob.title,
        }).toString(),
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
      <div className="careers-hero">
        <span className="careers-eyebrow">Join Us</span>
        <h1 className="careers-heading">
          <div className="careers-mask">
            <span ref={heroLine1}>Build with us.</span>
          </div>
          <div className="careers-mask">
            <span ref={heroLine2} className="careers-heading--dim">Shape tomorrow.</span>
          </div>
        </h1>
        <p ref={heroSub} className="careers-sub">
          Every home PK Group delivers is the result of exceptional people working
          at the intersection of craft, precision, and vision. If that describes you,
          we'd like to hear from you.
        </p>
      </div>

      {/* ── Listings ── */}
      <section className="careers-listings">
        <div className="careers-listings-header">
          <span className="careers-listings-eyebrow">Open Positions</span>
          <div className="careers-listings-rule" />
          <span className="careers-listings-count">{JOBS.length} roles</span>
        </div>

        <div className="careers-grid">
          {JOBS.map((job, i) => (
            <article
              key={job.id}
              ref={el => cardRefs.current[i] = el}
              className="career-card"
            >
              <div className="career-card-top">
                <span className="career-dept">{job.department}</span>
                <span className="career-type">{job.type}</span>
              </div>

              <h2 className="career-title">{job.title}</h2>

              <div className="career-location">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1z" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <circle cx="6" cy="4.5" r="1.2" fill="currentColor"/>
                </svg>
                {job.location}
              </div>

              <p className="career-desc">{job.description}</p>

              <ul className="career-req">
                {job.requirements.map((r, j) => (
                  <li key={j}>{r}</li>
                ))}
              </ul>

              <button className="career-apply-btn" onClick={() => openDrawer(job)}>
                <span>Apply Now</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </article>
          ))}
        </div>
      </section>

      <Footer />

      {/* ── Overlay ── */}
      <div
        ref={overlayRef}
        className="drawer-overlay"
        style={{ display: 'none', opacity: 0 }}
        onClick={closeDrawer}
      />

      {/* ── Application Drawer ── */}
      <aside ref={drawerRef} className="app-drawer" style={{ transform: 'translateX(100%)' }}>
        <div className="app-drawer-inner">

          <div className="app-drawer-head">
            <div>
              <span className="app-drawer-eyebrow">Application</span>
              <h2 className="app-drawer-title">{activeJob?.title}</h2>
            </div>
            <button className="app-drawer-close" onClick={closeDrawer} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {status === 'sent' ? (
            <div className="app-success">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="var(--gold)" strokeWidth="1.5"/>
                <path d="M14 24l7 7 13-13" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="app-success-title">Application received.</h3>
              <p className="app-success-body">
                Thank you for your interest in the <strong>{activeJob?.title}</strong> role.
                We review every application carefully and will be in touch if there's a fit.
              </p>
              <button className="career-apply-btn" style={{ marginTop: 32 }} onClick={closeDrawer}>
                Close
              </button>
            </div>
          ) : (
            <form className="app-form" onSubmit={handleSubmit} noValidate>

              <div className="app-field">
                <label className="app-label">Full Name *</label>
                <input
                  className="app-input"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="app-row">
                <div className="app-field">
                  <label className="app-label">Email *</label>
                  <input
                    className="app-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    required
                  />
                </div>
                <div className="app-field">
                  <label className="app-label">Phone *</label>
                  <input
                    className="app-input"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="app-field">
                <label className="app-label">Applying for</label>
                <input
                  className="app-input app-input--readonly"
                  type="text"
                  value={activeJob?.title ?? ''}
                  readOnly
                />
              </div>

              <div className="app-field">
                <label className="app-label">Years of Experience *</label>
                <select
                  className="app-input app-select"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select range</option>
                  <option value="0–1 years">0–1 years (Fresher)</option>
                  <option value="1–3 years">1–3 years</option>
                  <option value="3–5 years">3–5 years</option>
                  <option value="5–8 years">5–8 years</option>
                  <option value="8+ years">8+ years</option>
                </select>
              </div>

              <div className="app-field">
                <label className="app-label">Cover Note *</label>
                <textarea
                  className="app-input app-textarea"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Tell us about yourself and why this role is a fit…"
                  required
                  rows={5}
                />
              </div>

              <div className="app-field">
                <label className="app-label">Portfolio / LinkedIn URL <span className="app-label--opt">(optional)</span></label>
                <input
                  className="app-input"
                  type="url"
                  name="portfolio"
                  value={form.portfolio}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              {status === 'error' && (
                <p className="app-error">Something went wrong. Please try again or email us directly.</p>
              )}

              <button
                type="submit"
                className="app-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <span className="app-spinner" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit Application
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

            </form>
          )}

        </div>
      </aside>
    </>
  )
}
