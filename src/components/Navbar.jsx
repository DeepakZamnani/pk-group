import { useEffect, useState } from 'react'

export default function Navbar({ heroComplete }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar${heroComplete ? ' visible' : ''}${scrolled ? ' scrolled' : ''}`}>
      <span className="navbar-logo">PK Group</span>
      <ul className="navbar-links">
        {['Projects', 'About', 'Vision', 'Contact'].map(link => (
          <li key={link}>
            <a href={`#${link.toLowerCase()}`}>{link}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
