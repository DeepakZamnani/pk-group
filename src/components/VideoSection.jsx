import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const YT_ID = 'hGmHAxVMwiQ'
const THUMB = '/carousel/building-2.jpg'

const LINES = [
  { text: 'Some addresses',    indent: 0, italic: false },
  { text: "don't just change", indent: 1, italic: false },
  { text: 'where you live.',   indent: 2, italic: true  },
]

const VideoSection = forwardRef(function VideoSection(_, ref) {
  const sectionRef = useRef(null)
  const ruleRef    = useRef(null)
  const lineRefs   = useRef([])
  const taglineRef = useRef(null)
  const cardRef    = useRef(null)
  const tlRef      = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    gsap.set(ruleRef.current,    { scaleX: 0, transformOrigin: 'left' })
    gsap.set(lineRefs.current,   { y: '108%' })
    gsap.set(taglineRef.current, { opacity: 0, y: 12 })
    gsap.set(cardRef.current,    { opacity: 0, y: 32 })

    const tl = gsap.timeline({ paused: true })
    tl.to(ruleRef.current,    { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, 0)
    lineRefs.current.forEach((el, i) => {
      tl.to(el, { y: '0%', duration: 0.7, ease: 'power4.out' }, 0.08 + i * 0.08)
    })
    tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.35)
      .to(cardRef.current,    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.42)

    tlRef.current = tl

    // autoplay when card is 60% visible
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPlaying(true) },
      { threshold: 0.6 }
    )
    if (cardRef.current) obs.observe(cardRef.current)

    return () => { tl.kill(); obs.disconnect() }
  }, [])

  // expose snap() — scrolls to section and plays animation immediately
  useImperativeHandle(ref, () => ({
    snap() {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => tlRef.current?.play(0), 300)
    }
  }))

  return (
    <section ref={sectionRef} id="vision" className="vsec-section">

      <div ref={ruleRef} className="vsec-rule" />

      <div className="vsec-verse">
        {LINES.map((l, i) => (
          <div key={i} className="vsec-mask" style={{ paddingLeft: `${l.indent * 1.4}em` }}>
            <span
              ref={el => lineRefs.current[i] = el}
              className={`vsec-line${l.italic ? ' vsec-line--italic' : ''}`}
            >
              {l.text}
            </span>
          </div>
        ))}
      </div>

      <p ref={taglineRef} className="vsec-tagline">
        Ours changes <em>how.</em>
      </p>

      <div ref={cardRef} className="vsec-card" onClick={() => setPlaying(true)} style={{ cursor: playing ? 'default' : 'pointer' }}>
        {playing ? (
          <iframe
            className="vsec-iframe"
            src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1&color=white`}
            title="PK Canopus"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img className="vsec-thumb" src={THUMB} alt="PK Canopus walkthrough" />
            <div className="vsec-veil" />
            <div className="vsec-play-wrap">
              <button className="vsec-play" aria-label="Play">
                <svg viewBox="0 0 72 72" fill="none">
                  <circle cx="36" cy="36" r="35" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                  <path d="M30 25l18 11-18 11V25z" fill="#fff" />
                </svg>
              </button>
              <span className="vsec-play-label">Watch Film</span>
            </div>
            <div className="vsec-card-meta">
              <span>PK Canopus — Wakad, Pune</span>
              <span>2026</span>
            </div>
          </>
        )}
      </div>

    </section>
  )
})

export default VideoSection
