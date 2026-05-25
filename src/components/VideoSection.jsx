import { useLayoutEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_YT_ID = 'hGmHAxVMwiQ'
const DEFAULT_THUMB  = '/carousel-canopus/building-2.jpg'
const DEFAULT_LINES  = [
  { text: 'Some addresses',    indent: 0, italic: false },
  { text: "don't just change", indent: 1, italic: false },
  { text: 'where you live.',   indent: 2, italic: true  },
]

const VideoSection = forwardRef(function VideoSection({
  ytId     = DEFAULT_YT_ID,
  thumb    = DEFAULT_THUMB,
  lines    = DEFAULT_LINES,
  tagline  = 'Ours changes how.',
  cardMeta = { label: 'PK Canopus — Wakad, Pune', year: '2026' },
}, ref) {
  const sectionRef = useRef(null)
  const ruleRef    = useRef(null)
  const lineRefs   = useRef([])
  const taglineRef = useRef(null)
  const cardRef    = useRef(null)
  const tlRef      = useRef(null)
  const [playing, setPlaying] = useState(false)

  useLayoutEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches
    let ctx = null

    if (!mobile) {
      ctx = gsap.context(() => {
        gsap.set(ruleRef.current,    { scaleX: 0, transformOrigin: 'left' })
        gsap.set(lineRefs.current,   { y: '108%' })
        gsap.set(taglineRef.current, { opacity: 0, y: 12 })
        gsap.set(cardRef.current,    { opacity: 0, y: 32 })

        const tl = gsap.timeline({ paused: true })
        tl.to(ruleRef.current, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, 0)
        lineRefs.current.forEach((el, i) => {
          tl.to(el, { y: '0%', duration: 0.7, ease: 'power4.out' }, 0.08 + i * 0.08)
        })
        tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.35)
          .to(cardRef.current,    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.42)

        tlRef.current = tl

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 85%',
          onEnter: () => tl.play(0),
        })
      })
    }

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPlaying(true) },
      { threshold: 0.6 }
    )
    if (cardRef.current) obs.observe(cardRef.current)

    return () => { ctx?.revert(); obs.disconnect() }
  }, [])

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
        {lines.map((l, i) => (
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

      <p ref={taglineRef} className="vsec-tagline">{tagline}</p>

      <div ref={cardRef} className="vsec-card" onClick={() => setPlaying(true)} style={{ cursor: playing ? 'default' : 'pointer' }}>
        {playing ? (
          <iframe
            className="vsec-iframe"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&color=white`}
            title={cardMeta.label}
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img className="vsec-thumb" src={thumb} alt={cardMeta.label} />
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
              <span>{cardMeta.label}</span>
              <span>{cardMeta.year}</span>
            </div>
          </>
        )}
      </div>

    </section>
  )
})

export default VideoSection
