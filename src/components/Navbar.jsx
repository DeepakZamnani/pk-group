import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'


const LINKS = [
  { label: 'Home',      route:   '/'          },
  { label: 'Projects',  route:   '/projects' },
  { label: 'About',     route:   '/about'    },
  { label: 'Amenities', section: 'vision'    },
  { label: 'Contact',   section: 'contact'   },
  
]

export default function Navbar({ heroComplete }) {
  const [light, setLight]       = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const isHome    = location.pathname === '/'

  // Light/dark switching — only relevant on home
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

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLink = (e, link) => {
    e.preventDefault()
    setMenuOpen(false)
    if (link.route) {
      navigate(link.route)
      return
    }
    if (isHome) {
      document.getElementById(link.section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate(`/#${link.section}`)
    }
  }

  const visible = true

  return (
    <>
      <nav className={[
        'navbar',
        visible           ? 'visible'       : '',
        isHome && light   ? 'navbar--light' : 'navbar--dark',
      ].filter(Boolean).join(' ')}>

        <Link to="/" className="navbar-logo-link" onClick={() => setMenuOpen(false)}>
          <img src="/pk-logo.png" alt="PK Group" className="navbar-logo" />
        </Link>

        <ul className="navbar-links">
          {LINKS.map(link => (
            <li key={link.label}>
              <a
                href={link.route ?? `#${link.section}`}
                onClick={e => handleLink(e, link)}
                className={location.pathname === link.route ? 'active' : ''}
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
                href={link.route ?? `#${link.section}`}
                onClick={e => handleLink(e, link)}
                className={location.pathname === link.route ? 'active' : ''}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
