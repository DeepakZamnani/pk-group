import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SLIDES = [
  {
    img:     '/carousel/building.jpg',
    label:   '01 — PK Canopus',
    heading: 'A new standard\narrives.',
    sub:     'Wakad · Pimpri Chinchwad · 2026',
  },
  {
    img:     '/carousel/pool-day.jpg',
    label:   '02 — Aqua',
    heading: 'Where mornings\nbegin.',
    sub:     'Resort-style swimming pool',
  },
  {
    img:     '/carousel/building-2.jpg',
    label:   '03 — Evenings',
    heading: 'The city\nbelow you.',
    sub:     'Poolside lounge & cabana',
  },
  {
    img:     '/carousel/gym.jpg',
    label:   '04 — Fitness',
    heading: 'Precision,\nevery rep.',
    sub:     'Professional-grade fitness studio',
  },
  {
    img:     '/carousel/tennis-court.jpg',
    label:   '05 — Sport',
    heading: 'Play harder.\nLive better.',
    sub:     'Padel & tennis court',
  },
  {
    img:     '/carousel/theatre.jpg',
    label:   '06 — Cinema',
    heading: 'Your private\nscreening room.',
    sub:     'In-house home theatre',
  },
  {
    img:     '/carousel/clubhouse.jpg',
    label:   '07 — Club',
    heading: 'The art\nof gathering.',
    sub:     'Clubhouse & games lounge',
  },
  {
    img:     '/carousel/kids-play.jpg',
    label:   '08 — Family',
    heading: "They'll never\nwant to leave.",
    sub:     "Dedicated kids' play zone",
  },
]

export default function ProjectInfoMask() {
  const wrapRef  = useRef(null)
  const clipRefs = useRef([])
  const innRefs  = useRef([])
  const fillRef  = useRef(null)

  useEffect(() => {
    const n = SLIDES.length

    // set initial off-screen state for slides 1+
    for (let i = 1; i < n; i++) {
      gsap.set(clipRefs.current[i], { xPercent: 100 })
      gsap.set(innRefs.current[i],  { xPercent: -100 })
    }

    // quickSetters — fastest per-frame property update in GSAP
    const setClip = clipRefs.current.map(el => el && gsap.quickSetter(el, 'xPercent'))
    const setInn  = innRefs.current.map( el => el && gsap.quickSetter(el, 'xPercent'))
    const setFill = fillRef.current && gsap.quickSetter(fillRef.current, 'scaleX')

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start:   'top top',
      end:     'bottom bottom',
      scrub:   0.6,
      onUpdate(self) {
        const total = self.progress * (n - 1)

        for (let i = 1; i < n; i++) {
          const p = Math.min(Math.max(total - (i - 1), 0), 1)
          const x = (1 - p) * 100
          setClip[i]?.(x)
          setInn[i]?.(-x)
        }

        setFill?.(self.progress)
      },
    })

    return () => st.kill()
  }, [])

  return (
    <div ref={wrapRef} className="pmask-wrapper">
      <div className="pmask-sticky">

        {SLIDES.map((s, i) => (
          <div
            key={s.label}
            className="pmask-slide"
            style={{ zIndex: i + 1 }}
          >
            {/* clip container — slides in from right */}
            <div className="pmask-clip" ref={el => clipRefs.current[i] = el}>
              {/* inner — counter-translates so content stays pinned */}
              <div className="pmask-inner" ref={el => innRefs.current[i] = el}>
                <img src={s.img} alt={s.sub} className="pmask-img" />
                <div className="pmask-overlay" />

                <div className="pmask-content">
                  <span className="pmask-label">{s.label}</span>
                  <h3 className="pmask-heading">
                    {s.heading.split('\n').map((line, j) => (
                      <span key={j} className="pmask-heading-line">{line}</span>
                    ))}
                  </h3>
                  <p className="pmask-sub">{s.sub}</p>
                </div>

                <span className="pmask-counter">
                  {String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="pmask-progress">
          <div className="pmask-progress-fill" ref={fillRef} />
        </div>

      </div>
    </div>
  )
}
