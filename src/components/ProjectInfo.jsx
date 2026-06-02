import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SLIDES = [
  { img: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/building.jpg',     label: '01 — PK Canopus', heading: 'A new standard\narrives.',      sub: 'Wakad · Pimpri Chinchwad · 2026' },
  { img: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/pool-day.jpg',     label: '02 — Aqua',       heading: 'Where mornings\nbegin.',        sub: 'Resort-style swimming pool'       },
  { img: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/building-2.jpg',   label: '03 — Evenings',   heading: 'The city\nbelow you.',          sub: 'Poolside lounge & cabana'          },
  { img: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/gym.jpg',          label: '04 — Fitness',    heading: 'Precision,\nevery rep.',        sub: 'Professional-grade fitness studio' },
  { img: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/tennis-court.jpg', label: '05 — Sport',      heading: 'Play harder.\nLive better.',    sub: 'Padel & tennis court'              },
  { img: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/theatre.jpg',      label: '06 — Cinema',     heading: 'Your private\nscreening room.', sub: 'In-house home theatre'             },
  { img: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/clubhouse.jpg',    label: '07 — Club',       heading: 'The art\nof gathering.',        sub: 'Clubhouse & games lounge'          },
  { img: 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/kids-play.jpg',    label: '08 — Family',     heading: "They'll never\nwant to leave.", sub: "Dedicated kids' play zone"         },
]

export default function ProjectInfo() {
  const introRef    = useRef(null)
  const introLine1  = useRef(null)
  const introLine2  = useRef(null)
  const introSub    = useRef(null)
  const wrapRef     = useRef(null)
  const trackRef    = useRef(null)
  const fillRef     = useRef(null)
  const imgRefs     = useRef([])
  const headRefs    = useRef([])
  const subRefs     = useRef([])
  const labelRefs   = useRef([])
  const counterRefs = useRef([])

  const [activeSlide, setActiveSlide] = useState(0)
  const [lightbox, setLightbox]       = useState(null)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  // ── Mobile: scroll-snap dot sync ────────────────────────────────────
  useEffect(() => {
    if (!window.matchMedia('(max-width: 768px)').matches) return
    const track = trackRef.current
    if (!track) return

    const onScroll = () => {
      const i = Math.round(track.scrollLeft / track.clientWidth)
      setActiveSlide(i)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  const goToSlide = (i) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })
  }

  // ── Desktop: GSAP scroll-driven carousel ────────────────────────────
  useLayoutEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return

    let onResize = null
    const ctx = gsap.context(() => {
    // ── Intro heading — pinned scrub ─────────────────────────────────
    gsap.set([introLine1.current, introLine2.current], { y: '110%' })
    gsap.set(introSub.current, { opacity: 0, y: 24 })

    const introTL = gsap.timeline()
    introTL
      .to(introLine1.current, { y: '0%',    duration: 0.25, ease: 'power4.out' }, 0.05)
      .to(introLine2.current, { y: '0%',    duration: 0.25, ease: 'power4.out' }, 0.15)
      .to(introSub.current,   { opacity: 1, y: 0, duration: 0.2, ease: 'power3.out' }, 0.3)
      .to(introLine1.current, { y: '-30%', opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.7)
      .to(introLine2.current, { y: '-30%', opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.75)
      .to(introSub.current,   { opacity: 0, y: -16,   duration: 0.15, ease: 'power2.in' }, 0.78)

    ScrollTrigger.create({
      trigger: introRef.current,
      start: 'top top',
      end: 'bottom top',
      pin: true,
      scrub: 0.8,
      animation: introTL,
    })

    // ── Carousel ─────────────────────────────────────────────────────
    const n  = SLIDES.length
    const vw = () => window.visualViewport?.width ?? window.innerWidth

    imgRefs.current.forEach(el => { if (el) gsap.set(el, { scale: 1.3 }) })

    headRefs.current.forEach(el => { if (el) gsap.set(el, { y: '108%' }) })
    subRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 0, y: 12 }) })
    labelRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 0 }) })
    counterRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 0 }) })

    const slideTLs = SLIDES.map((_, i) => {
      const tl      = gsap.timeline({ paused: true })
      const head    = headRefs.current[i]
      const sub     = subRefs.current[i]
      const label   = labelRefs.current[i]
      const counter = counterRefs.current[i]

      if (counter) tl.to(counter, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0)
      if (head)    tl.to(head,    { y: '0%',    duration: 0.85, ease: 'power4.out' }, 0.05)
      if (sub)     tl.to(sub,     { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.3)
      if (label)   tl.to(label,   { opacity: 1, duration: 0.5, ease: 'none' }, 0.4)

      return tl
    })

    slideTLs[0].play(0)

    const setImgX = imgRefs.current.map(el => el ? gsap.quickSetter(el, 'x', 'px') : null)
    const setFill = fillRef.current ? gsap.quickSetter(fillRef.current, 'scaleX') : null

    const scrollTL = gsap.to(trackRef.current, {
      x: -(n - 1) * vw(), ease: 'none', paused: true,
    })

    let lastSlide = 0

    ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      animation: scrollTL,
      onUpdate(self) {
        const progress = self.progress
        const w = vw()

        for (let i = 0; i < n; i++) {
          const set = setImgX[i]
          if (!set) continue
          const screenPos = i * w - progress * (n - 1) * w
          set(-screenPos * 0.25)
        }

        setFill?.(progress)

        const active = Math.round(progress * (n - 1))
        if (active !== lastSlide) {
          lastSlide = active
          slideTLs[active].restart(0)
        }
      },
    })

    onResize = () => {
      scrollTL.vars.x = -(n - 1) * vw()
      scrollTL.invalidate()
      ScrollTrigger.refresh()
    }
    window.visualViewport?.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    }) // end gsap.context

    return () => {
      ctx.revert()
      window.visualViewport?.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return (
    <>
    <div ref={introRef} className="pinfo-intro" style={{ height: '100vh' }}>
      <span className="pinfo-intro-eyebrow">Amenities</span>
      <div className="pinfo-intro-heading">
        <div className="pinfo-intro-mask">
          <h2 ref={introLine1} className="pinfo-intro-line">Every detail.</h2>
        </div>
        <div className="pinfo-intro-mask">
          <h2 ref={introLine2} className="pinfo-intro-line pinfo-intro-line--dim">considered.</h2>
        </div>
      </div>
      <p ref={introSub} className="pinfo-intro-sub">
        Eight spaces. One vision.
      </p>
    </div>

    <div ref={wrapRef} className="pinfo-wrapper">
      <div className="pinfo-sticky">
        <div ref={trackRef} className="pinfo-track">

          {SLIDES.map((s, i) => {
            const flip = i % 2 !== 0

            return (
              <div
                key={s.label}
                className="pinfo-slide"
                onClick={() => setLightbox(s)}
              >

                <img
                  ref={el => imgRefs.current[i] = el}
                  src={s.img}
                  alt={s.sub}
                  className="pinfo-img"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />

                <div className="pinfo-overlay" />

                <span
                  ref={el => labelRefs.current[i] = el}
                  className={`pinfo-edge-label pinfo-edge-label--${flip ? 'left' : 'right'}`}
                >
                  {s.label}
                </span>

                <span
                  ref={el => counterRefs.current[i] = el}
                  className={`pinfo-counter pinfo-counter--${flip ? 'right' : 'left'}`}
                >
                  {String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                </span>

                <div className={`pinfo-text pinfo-text--${flip ? 'right' : 'left'}`}>
                  <div className="pinfo-heading-mask">
                    <h3
                      ref={el => headRefs.current[i] = el}
                      className="pinfo-heading"
                    >
                      {s.heading.split('\n').map((line, j) => (
                        <span key={j} className="pinfo-heading-line">{line}</span>
                      ))}
                    </h3>
                  </div>

                  <p
                    ref={el => subRefs.current[i] = el}
                    className="pinfo-sub"
                  >
                    {s.sub}
                  </p>
                </div>

              </div>
            )
          })}

        </div>

        {/* Desktop progress bar */}
        <div className="pinfo-progress">
          <div className="pinfo-progress-fill" ref={fillRef} />
        </div>

        {/* Mobile dot navigation */}
        <div className="pinfo-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`pinfo-dot${activeSlide === i ? ' pinfo-dot--active' : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </div>

    {lightbox && createPortal(
      <div className="lightbox" onClick={() => setLightbox(null)}>
        <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
        <div className="lightbox-caption">
          <span className="lightbox-label">{lightbox.label}</span>
          <span className="lightbox-sub">{lightbox.sub}</span>
        </div>
        <img
          src={lightbox.img}
          alt={lightbox.sub}
          className="lightbox-img"
          onClick={e => e.stopPropagation()}
        />
      </div>,
      document.body
    )}
    </>
  )
}
