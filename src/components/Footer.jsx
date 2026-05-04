import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'About',    href: '#about'    },
  { label: 'Amenities',href: '#vision'   },
  { label: 'Contact',  href: '#contact'  },
]

export default function Footer() {
  const footerRef  = useRef(null)
  const topRef     = useRef(null)
  const bottomRef  = useRef(null)
  const lineRef    = useRef(null)

  useEffect(() => {
    gsap.set(lineRef.current,   { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(topRef.current,    { opacity: 0, y: 24 })
    gsap.set(bottomRef.current, { opacity: 0 })

    ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top 90%',
      onEnter() {
        gsap.to(lineRef.current,   { scaleX: 1, duration: 1.2, ease: 'power3.inOut' })
        gsap.to(topRef.current,    { opacity: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'power3.out' })
        gsap.to(bottomRef.current, { opacity: 1, duration: 0.8, delay: 0.7, ease: 'power2.out' })
      },
    })

    return () => ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === footerRef.current) st.kill()
    })
  }, [])

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer ref={footerRef} id="contact" className="footer">

      {/* ── Top row ── */}
      <div ref={topRef} className="footer-top">
        <div className="footer-brand">
          <span className="footer-logo">PK Group</span>
          <p className="footer-tagline">Building tomorrow's landmarks, today.</p>
        </div>

        <nav className="footer-nav">
          {NAV_LINKS.map(l => (
            <button key={l.label} className="footer-nav-link" onClick={() => scrollTo(l.href)}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="footer-contact">
          <span className="footer-contact-label">Get in Touch</span>
          <a href="mailto:info@pkgroup.in" className="footer-contact-email">info@pkgroup.in</a>
          <p className="footer-contact-addr">Wakad · Pimpri Chinchwad<br />Maharashtra, India</p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div ref={lineRef} className="footer-line" />

      {/* ── Bottom row ── */}
      <div ref={bottomRef} className="footer-bottom">
        <p className="footer-copy">© 2026 PK Group. All rights reserved.</p>
        <p className="footer-copy">Crafted with precision.</p>
      </div>

    </footer>
  )
}
