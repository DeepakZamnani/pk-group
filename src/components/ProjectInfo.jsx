import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SLIDES = [
  { img: '/carousel/building.jpg',     label: '01 — PK Canopus', heading: 'A new standard\narrives.',      sub: 'Wakad · Pimpri Chinchwad · 2026' },
  { img: '/carousel/pool-day.jpg',     label: '02 — Aqua',       heading: 'Where mornings\nbegin.',        sub: 'Resort-style swimming pool'       },
  { img: '/carousel/building-2.jpg',   label: '03 — Evenings',   heading: 'The city\nbelow you.',          sub: 'Poolside lounge & cabana'          },
  { img: '/carousel/gym.jpg',          label: '04 — Fitness',    heading: 'Precision,\nevery rep.',        sub: 'Professional-grade fitness studio' },
  { img: '/carousel/tennis-court.jpg', label: '05 — Sport',      heading: 'Play harder.\nLive better.',    sub: 'Padel & tennis court'              },
  { img: '/carousel/theatre.jpg',      label: '06 — Cinema',     heading: 'Your private\nscreening room.', sub: 'In-house home theatre'             },
  { img: '/carousel/clubhouse.jpg',    label: '07 — Club',       heading: 'The art\nof gathering.',        sub: 'Clubhouse & games lounge'          },
  { img: '/carousel/kids-play.jpg',    label: '08 — Family',     heading: "They'll never\nwant to leave.", sub: "Dedicated kids' play zone"         },
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

  useEffect(() => {
    // ── Intro heading — pinned scrub ─────────────────────────────────
    gsap.set([introLine1.current, introLine2.current], { y: '110%' })
    gsap.set(introSub.current, { opacity: 0, y: 24 })

    const introTL = gsap.timeline()
    introTL
      .to(introLine1.current, { y: '0%',    duration: 0.25, ease: 'power4.out' }, 0.05)
      .to(introLine2.current, { y: '0%',    duration: 0.25, ease: 'power4.out' }, 0.15)
      .to(introSub.current,   { opacity: 1, y: 0, duration: 0.2, ease: 'power3.out' }, 0.3)
      // hold — then exit
      .to(introLine1.current, { y: '-30%', opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.7)
      .to(introLine2.current, { y: '-30%', opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.75)
      .to(introSub.current,   { opacity: 0, y: -16,   duration: 0.15, ease: 'power2.in' }, 0.78)

    const introST = ScrollTrigger.create({
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

    // scale images up so parallax never reveals edges
    imgRefs.current.forEach(el => { if (el) gsap.set(el, { scale: 1.3 }) })

    // hide all text upfront
    headRefs.current.forEach(el => {
      if (el) gsap.set(el, { y: '108%' })
    })
    subRefs.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 0, y: 12 })
    })
    labelRefs.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 0 })
    })
    counterRefs.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 0 })
    })

    // pre-build one paused timeline per slide — zero allocation during scroll
    const slideTLs = SLIDES.map((_, i) => {
      const tl = gsap.timeline({ paused: true })
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

    // play slide 0 immediately
    slideTLs[0].play(0)

    // quickSetters — zero GC pressure per frame
    const setImgX = imgRefs.current.map(el => el ? gsap.quickSetter(el, 'x', 'px') : null)
    const setFill = fillRef.current ? gsap.quickSetter(fillRef.current, 'scaleX') : null

    const scrollTL = gsap.to(trackRef.current, {
      x: -(n - 1) * vw(), ease: 'none', paused: true,
    })

    let lastSlide = 0

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      animation: scrollTL,
      onUpdate(self) {
        const progress = self.progress
        const w = vw()

        // parallax per image
        for (let i = 0; i < n; i++) {
          const set = setImgX[i]
          if (!set) continue
          const screenPos = i * w - progress * (n - 1) * w
          set(-screenPos * 0.25)
        }

        setFill?.(progress)

        // fire pre-built timeline when slide changes
        const active = Math.round(progress * (n - 1))
        if (active !== lastSlide) {
          lastSlide = active
          slideTLs[active].restart(0)
        }
      },
    })

    const onResize = () => {
      scrollTL.vars.x = -(n - 1) * vw()
      scrollTL.invalidate()
      ScrollTrigger.refresh()
    }
    window.visualViewport?.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      introST.kill()
      introTL.kill()
      st.kill()
      slideTLs.forEach(tl => tl.kill())
      window.visualViewport?.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return (
    <>
    <div ref={introRef} id="about" className="pinfo-intro" style={{ height: '100vh' }}>
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
              <div key={s.label} className="pinfo-slide">

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

        <div className="pinfo-progress">
          <div className="pinfo-progress-fill" ref={fillRef} />
        </div>

      </div>
    </div>
    </>
  )
}
