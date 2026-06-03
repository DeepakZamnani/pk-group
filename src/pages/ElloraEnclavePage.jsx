import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CDN   = 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/redevelopment'
const B     = i => `${CDN}/Ellora-Enclave-Brochure-Option-1/Ellora%20Enclave%20Brochure%20Option%201_page-${String(i).padStart(4,'0')}.jpg`
const FP    = i => `${CDN}/Ellora-Enclave-Floor-Plan/Ellora%20Enclave%20Floor%20Plan_page-${String(i).padStart(4,'0')}.jpg`
const VIDEO = `${CDN}/Pimpri_Walkthrough.mp4`

const STATS = [
  { num: 'B+P+7',  label: 'Floors'         },
  { num: '3 BHK',  label: 'Residences'     },
  { num: '828+',   label: 'Carpet Sq. Ft.' },
  { num: 'Pimpri', label: 'Pune'           },
]

const AMENITIES = [
  'Viewing Deck', 'Gymnasium', 'Party Lawn',
  'Senior Citizen Sitout', 'Meditation Plaza', 'Open Air Buffet Area',
  "Children's Play Area", 'Gazebo', 'Outdoor Board Games',
]

const CONNECTIVITY = [
  { cat: 'Transport',  items: ['Pimpri Railway Station – 5 mins', 'Metro Station (Pimpri) – 5 mins', 'Pune-Mumbai Highway – 3 mins'] },
  { cat: 'Work',       items: ['Bhosari MIDC – 10 mins', 'Hinjewadi IT Park – 20–25 mins'] },
  { cat: 'Shopping',   items: ['City One Mall – 5 mins', 'Premier Plaza Mall – 6 mins', 'D-Mart, Pimpri – 7 mins'] },
  { cat: 'Schools',    items: ['Wisdom World School – 8 mins', 'SNBP International School – 10 mins', 'Podar International School – 12 mins'] },
  { cat: 'Healthcare', items: ['YCM Hospital – 5 mins', 'Sterling Multispeciality – 8 mins', 'Aditya Birla Memorial – 12 mins'] },
]

const FLOOR_PLANS = [
  { label: 'A Wing · 3 BHK',     src: FP(1), detail: 'Carpet: 828–838 sq ft  ·  ENC. Balcony: 70 sq ft  ·  Total: ~1,057 sq ft' },
  { label: 'B Wing · 2 & 3 BHK', src: FP(2), detail: '2 BHK: 643 sq ft  ·  3 BHK: 749 sq ft carpet  ·  B + P + 7 Floor'        },
  { label: 'Combined Layout',     src: FP(3), detail: 'A Wing + B Wing  ·  Full building footprint'                               },
]

const SPECS = [
  { title: 'Structure & Brickwork', items: ['Earthquake resistant R.C.C. framed structure', "Lightweight 'AAC' block work internally & externally"] },
  { title: 'Plaster & Tiles',       items: ['External sand faced cement plaster', 'Gypsum finished ceiling', 'Vitrified tiles with skirting', 'Antiskid flooring in balconies & bathrooms'] },
  { title: 'Doors & Windows',       items: ['Decorative main entrance door with digital lock', 'Wooden box frame for main & bedroom doors', 'Anodized aluminum sliding windows with mosquito nets', 'Three track aluminum sliding doors for balcony'] },
  { title: 'Electrical',            items: ['Branded fittings & concealed copper wiring', 'TV & telephone points in all rooms', 'AC point in master bedroom', 'Provision for inverter backup & Wi-Fi router'] },
  { title: 'Kitchen',               items: ['Granite platform & S.S. sink', "Kitchen dado tiles up to 2'–0\" above platform", 'Provision for exhaust fan, water purifier & washing machine'] },
  { title: 'Bathrooms',             items: ['Designer wall tiles up to lintel level', 'Hot & cold shower diverter unit', 'Standard CP & sanitary fittings', 'Solar system for hot water'] },
  { title: 'Lift & Common Areas',   items: ['Lift of reputed make per building', 'Generator backup for lifts & common areas', 'Granite work at lift entrance lobby', 'Staircase with granite treads & tile risers'] },
]

export default function ElloraEnclavePage() {
  const [floorTab, setFloorTab] = useState(0)
  const [openSpec, setOpenSpec] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const videoRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!window.matchMedia('(max-width: 768px)').matches) return
    const video = videoRef.current
    if (!video) return
    const seek = () => { video.currentTime = 8.5 }
    if (video.readyState >= 1) seek()
    else video.addEventListener('loadedmetadata', seek, { once: true })
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.ee-reveal, .ee-reveal-left, .ee-reveal-right')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('ee-visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Navbar heroComplete={scrolled} />

      {/* ── Hero ── */}
      <div className="ee-hero">
        <video ref={videoRef} className="ee-hero-video" autoPlay muted loop playsInline>
          <source src={VIDEO} type="video/mp4" />
        </video>
        <div className="ee-hero-grad" />
        <div className="ee-hero-content">
          <span className="ee-hero-eyebrow">A PK Group Redevelopment</span>
          <h1 className="ee-hero-title">Ellora<br />Enclave</h1>
          <p className="ee-hero-sub">3 BHK Apartments &nbsp;·&nbsp; Pimpri, Pune</p>
          <span className="ee-hero-tag">Designed for You</span>
        </div>
        <div className="ee-hero-scroll">
          <span>Scroll</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="7" cy="6" r="1.5" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* ── Intro ── */}
      <section className="ee-intro">
        <div className="ee-intro-img ee-reveal-left">
          <img src={B(2)} alt="Ellora Enclave lifestyle" loading="eager" />
        </div>
        <div className="ee-intro-text">
          <span className="ee-label ee-reveal">Our Philosophy</span>
          <h2 className="ee-reveal" style={{ transitionDelay: '0.1s' }}>
            Rooted in love,<br /><em>growing in happiness.</em>
          </h2>
          <p className="ee-reveal" style={{ transitionDelay: '0.2s' }}>
            In a world that moves fast, find a home that lets you slow down.
            Set in a calm and well-connected pocket of Pimpri, these thoughtfully designed
            3 BHK homes bring together comfort, privacy, and everyday joy.
          </p>
          <div className="ee-usps ee-reveal" style={{ transitionDelay: '0.3s' }}>
            {['Limited Unit Community', 'Vastu Friendly', 'Peaceful Location', 'Modern Amenities'].map(u => (
              <span key={u} className="ee-usp">{u}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="ee-stats">
        {STATS.map((s, i) => (
          <div key={s.label} className="ee-stat ee-reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
            <span className="ee-stat-num">{s.num}</span>
            <span className="ee-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Showcase 1 ── */}
      <div className="ee-showcase">
        <img src={B(5)} alt="Ellora Enclave exterior" loading="lazy" />
        <div className="ee-showcase-content">
          <h2 className="ee-reveal">The new centre of<br /><em>your lifestyle.</em></h2>
          <p className="ee-reveal" style={{ transitionDelay: '0.15s' }}>Live where the city comes together effortlessly.</p>
        </div>
      </div>

      {/* ── Location ── */}
      <section className="ee-location">
        <div className="ee-location-text">
          <span className="ee-label ee-reveal">Location</span>
          <h2 className="ee-reveal" style={{ transitionDelay: '0.1s' }}>Where the<br />city connects.</h2>
          <div className="ee-connectivity ee-reveal" style={{ transitionDelay: '0.2s' }}>
            {CONNECTIVITY.map(c => (
              <div key={c.cat} className="ee-conn-group">
                <span className="ee-conn-cat">{c.cat}</span>
                <ul>{c.items.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
        <div className="ee-location-map ee-reveal-right">
          <img src={B(4)} alt="Location map" loading="lazy" />
        </div>
      </section>

      {/* ── Showcase 2 ── */}
      <div className="ee-showcase">
        <img src={B(7)} alt="Rooftop view" loading="lazy" />
        <div className="ee-showcase-content">
          <h2 className="ee-reveal">A grand view.<br /><em>A greater life.</em></h2>
          <p className="ee-reveal" style={{ transitionDelay: '0.15s' }}>Elevated living reaches new heights with thoughtfully curated rooftop experiences.</p>
        </div>
      </div>

      {/* ── Amenities ── */}
      <section className="ee-amenities">
        <div className="ee-amenities-head">
          <span className="ee-label ee-reveal">Amenities</span>
          <h2 className="ee-reveal" style={{ transitionDelay: '0.1s' }}>Make every<br /><em>moment count.</em></h2>
          <p className="ee-reveal" style={{ transitionDelay: '0.2s' }}>Nine spaces designed to enrich every part of your day.</p>
        </div>
        <div className="ee-amenities-grid">
          {AMENITIES.map((a, i) => (
            <div key={a} className="ee-amenity ee-reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
              <div className="ee-amenity-dot" />
              <span>{a}</span>
            </div>
          ))}
        </div>
        <div className="ee-amenities-img ee-reveal">
          <img src={B(8)} alt="Amenities" loading="lazy" />
        </div>
      </section>

      {/* ── Floor Plans ── */}
      <section className="ee-plans">
        <div className="ee-plans-head">
          <span className="ee-label ee-reveal">Floor Plans</span>
          <h2 className="ee-reveal" style={{ transitionDelay: '0.1s' }}>Your space,<br /><em>defined.</em></h2>
          <div className="ee-plan-tabs ee-reveal" style={{ transitionDelay: '0.2s' }}>
            {FLOOR_PLANS.map((p, i) => (
              <button
                key={i}
                className={`ee-plan-tab${floorTab === i ? ' active' : ''}`}
                onClick={() => setFloorTab(i)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="ee-plan-view">
          <img src={FLOOR_PLANS[floorTab].src} alt={FLOOR_PLANS[floorTab].label} />
          <p>{FLOOR_PLANS[floorTab].detail}</p>
        </div>
      </section>

      {/* ── Specifications ── */}
      <section className="ee-specs">
        <div className="ee-specs-head">
          <span className="ee-label ee-reveal">Specifications</span>
          <h2 className="ee-reveal" style={{ transitionDelay: '0.1s' }}>Where details<br /><em>define your everyday.</em></h2>
        </div>
        <div className="ee-specs-list">
          {SPECS.map((s, i) => (
            <div key={i} className={`ee-spec-item ee-reveal${openSpec === i ? ' open' : ''}`} style={{ transitionDelay: `${i * 0.06}s` }}>
              <button className="ee-spec-header" onClick={() => setOpenSpec(openSpec === i ? null : i)}>
                <span>{s.title}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d={openSpec === i ? 'M3 8h10' : 'M3 8h10M8 3v10'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
              {openSpec === i && (
                <ul className="ee-spec-items">
                  {s.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ee-cta">
        <div className="ee-cta-inner">
          <span className="ee-label ee-reveal">Get In Touch</span>
          <h2 className="ee-reveal" style={{ transitionDelay: '0.1s' }}>Your dream home<br /><em>is here.</em></h2>
          <p className="ee-reveal" style={{ transitionDelay: '0.2s' }}>
            3 BHK apartments designed for how you truly want to live.<br />
            Pimpri, Pune — ready to welcome you.
          </p>
          <div className="ee-cta-actions ee-reveal" style={{ transitionDelay: '0.3s' }}>
            <a href="tel:7631125125" className="ee-cta-phone">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 3C2 3 4 1.5 5.5 4L6.5 6C7 7 6 8 6 8C6 8 7.5 10.5 8.5 11.5C9.5 12.5 12 14 12 14C12 14 13 13 14 13.5C14 13.5 14.5 15 12.5 15C10.5 15 7 12.5 5 10C3 7.5 1.5 4.5 2 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              76311 25125
            </a>
            <button className="ee-cta-btn" onClick={() => navigate('/contact')}>
              Schedule a Visit
            </button>
          </div>
        </div>
        <div className="ee-cta-img">
          <img src={B(6)} alt="Ellora Enclave" loading="lazy" />
        </div>
      </section>

      <Footer />
    </>
  )
}
