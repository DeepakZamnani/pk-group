import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CDN = 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/redevelopment'
const B   = i => `${CDN}/Ellora-Enclave-Brochure-Option-1/Ellora%20Enclave%20Brochure%20Option%201_page-${String(i).padStart(4,'0')}.jpg`

const PROJECTS = [
  {
    slug:     '/redevelopment/ellora-enclave',
    name:     'Ellora Enclave',
    type:     '3 BHK Apartments',
    location: 'Pimpri, Pune',
    status:   'Ongoing',
    img:      B(5),
  },
]

export default function RedevelopmentPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const els = document.querySelectorAll('.rd-reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('rd-visible'); obs.unobserve(e.target) } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Navbar heroComplete={true} />

      {/* ── Header ── */}
      <div className="rd-header">
        <div className="rd-header-inner">
          <span className="rd-eyebrow rd-reveal">PK Group</span>
          <h1 className="rd-title rd-reveal" style={{ transitionDelay: '0.1s' }}>Redevelopment</h1>
          <p className="rd-subtitle rd-reveal" style={{ transitionDelay: '0.2s' }}>
            Transforming existing communities into extraordinary addresses.
          </p>
        </div>
      </div>

      {/* ── About ── */}
      <section className="rd-about">
        <div className="rd-about-inner">
          <div className="rd-about-text">
            <span className="rd-label rd-reveal">Our Approach</span>
            <h2 className="rd-reveal" style={{ transitionDelay: '0.1s' }}>
              Rebuilding homes.<br /><em>Renewing lives.</em>
            </h2>
            <p className="rd-reveal" style={{ transitionDelay: '0.2s' }}>
              At PK Group, redevelopment is more than construction — it is a commitment
              to the families and communities who have called a place home for generations.
              We bring modern living standards, thoughtful design, and lasting quality to
              neighbourhoods that deserve the best.
            </p>
            <p className="rd-reveal" style={{ transitionDelay: '0.3s' }}>
              Every redevelopment project is handled with transparency, care, and an
              unwavering focus on delivering more than what was promised.
            </p>
          </div>
          <div className="rd-about-stats rd-reveal" style={{ transitionDelay: '0.2s' }}>
            {[
              { num: '100%', label: 'Transparency' },
              { num: 'On Time', label: 'Delivery' },
              { num: 'Family First', label: 'Approach' },
            ].map(s => (
              <div key={s.label} className="rd-about-stat">
                <span className="rd-about-stat-num">{s.num}</span>
                <span className="rd-about-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="rd-projects">
        <div className="rd-projects-head">
          <span className="rd-label rd-reveal">Our Projects</span>
          <h2 className="rd-reveal" style={{ transitionDelay: '0.1s' }}>Current Redevelopments</h2>
        </div>
        <div className="rd-projects-grid">
          {PROJECTS.map((p, i) => (
            <div
              key={p.slug}
              className="rd-card rd-reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
              onClick={() => navigate(p.slug)}
            >
              <div className="rd-card-img">
                <img src={p.img} alt={p.name} loading="lazy" />
                <div className="rd-card-overlay" />
                <span className="rd-card-status">{p.status}</span>
              </div>
              <div className="rd-card-body">
                <div className="rd-card-meta">
                  <span className="rd-card-type">{p.type}</span>
                  <span className="rd-card-location">{p.location}</span>
                </div>
                <h3 className="rd-card-name">{p.name}</h3>
                <div className="rd-card-cta">
                  <span>View Project</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
