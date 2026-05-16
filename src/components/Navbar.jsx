import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

const LINKS = [
  { label: 'Home',           route:   '/'               },
  { label: 'Projects',       route:   '/projects'        },
  { label: 'About',          route:   '/about'           },
  { label: 'Careers',        route:   '/careers'         },
  { label: 'Reconstruction', modal:   'coming-soon'      },
  { label: 'Contact',        route:   '/contact'         },
]

export default function Navbar({ heroComplete }) {
  const [light,          setLight]          = useState(false)
  const [menuOpen,       setMenuOpen]       = useState(false)
  const [comingSoonOpen, setComingSoonOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome   = location.pathname === '/'

  useEffect(() => {
    if (!isHome) return
    const els = [...document.querySelectorAll('.vsec-section')]
    if (!els.length) return
    const obs = new IntersectionObserver(
      entries => setLight(entries.some(e => e.isIntersecting)),
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [isHome])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = (menuOpen || comingSoonOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, comingSoonOpen])

  const handleLink = (e, link) => {
    e.preventDefault()
    setMenuOpen(false)
    if (link.modal === 'coming-soon') { setComingSoonOpen(true); return }
    if (link.route) { navigate(link.route); return }
    if (isHome) {
      document.getElementById(link.section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate(`/#${link.section}`)
    }
  }

  return (
    <>
      <nav className={[
        'navbar', 'visible',
        isHome && light ? 'navbar--light' : 'navbar--dark',
      ].join(' ')}>

        <Link to="/" className="navbar-logo-link" onClick={() => setMenuOpen(false)}>
          <img src="/pk-logo.png" alt="PK Group" className="navbar-logo" />
        </Link>

        <ul className="navbar-links">
          {LINKS.map(link => (
            <li key={link.label}>
              <a
                href={link.route ?? '#'}
                onClick={e => handleLink(e, link)}
                className={[
                  location.pathname === link.route ? 'active' : '',
                  link.modal ? 'navbar-link--soon' : '',
                ].filter(Boolean).join(' ')}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`navbar-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          {LINKS.map(link => (
            <li key={link.label}>
              <a
                href={link.route ?? '#'}
                onClick={e => handleLink(e, link)}
                className={location.pathname === link.route ? 'active' : ''}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Coming Soon Modal ── */}
      {comingSoonOpen && (
        <div className="cs-overlay" onClick={() => setComingSoonOpen(false)}>
          <div className="cs-panel" onClick={e => e.stopPropagation()}>

            <button
              className="cs-close"
              onClick={() => setComingSoonOpen(false)}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>

            <span className="cs-eyebrow">Coming Soon</span>

            <h2 className="cs-heading">
              Reconstruction.<br />
              <em>Reimagined.</em>
            </h2>

            <p className="cs-body">
              PK Group is expanding into high-end structural reconstruction —
              breathing new life into ageing buildings without compromising their
              original character. This service is currently in development.
            </p>

            <div className="cs-rule" />

            <p className="cs-note">
              Interested in a reconstruction consultation?<br />
              Reach us at{' '}
              <a className="cs-link" href="mailto:info@pkgroup.in">info@pkgroup.in</a>
            </p>

            <button className="cs-dismiss" onClick={() => setComingSoonOpen(false)}>
              Got it
            </button>

          </div>
        </div>
      )}
    </>
  )
}
