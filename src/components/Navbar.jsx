import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Projects', id: 'projects' },
  { label: 'About',    id: 'about'    },
  { label: 'Vision',   id: 'vision'   },
  { label: 'Contact',  id: 'contact'  },
]

const LIGHT_SECTIONS = ['.vsec-section']

export default function Navbar({ heroComplete }) {
  const [light, setLight] = useState(false)

  useEffect(() => {
    const els = LIGHT_SECTIONS.flatMap(sel => [...document.querySelectorAll(sel)])
    if (!els.length) return

    const obs = new IntersectionObserver(
      entries => setLight(entries.some(e => e.isIntersecting)),
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={[
      'navbar',
      heroComplete ? 'visible' : '',
      light        ? 'navbar--light' : 'navbar--dark',
    ].join(' ')}>
      <img src="/pk-logo.png" alt="PK Group" className="navbar-logo" />
      <ul className="navbar-links">
        {LINKS.map(({ label, id }) => (
          <li key={id}>
            <a href={`#${id}`} onClick={e => scrollTo(e, id)}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
