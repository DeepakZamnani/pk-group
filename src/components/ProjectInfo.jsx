import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SLIDES = [
  {
    img:      '/carousel/building.jpg',
    label:    '01 — PK Canopus',
    heading:  'A new standard\narrives.',
    sub:      'Wakad · Pimpri Chinchwad · 2026',
  },
  {
    img:      '/carousel/pool-day.jpg',
    label:    '02 — Aqua',
    heading:  'Where mornings\nbegin.',
    sub:      'Resort-style swimming pool',
  },
  {
    img:      '/carousel/pool-night.jpg',
    label:    '03 — Evenings',
    heading:  'The city\nbelow you.',
    sub:      'Poolside lounge & cabana',
  },
  {
    img:      '/carousel/gym.jpg',
    label:    '04 — Fitness',
    heading:  'Precision,\nevery rep.',
    sub:      'Professional-grade fitness studio',
  },
  {
    img:      '/carousel/tennis.jpg',
    label:    '05 — Sport',
    heading:  'Play harder.\nLive better.',
    sub:      'Padel & tennis court',
  },
  {
    img:      '/carousel/theatre.jpg',
    label:    '06 — Cinema',
    heading:  'Your private\nscreening room.',
    sub:      'In-house home theatre',
  },
  {
    img:      '/carousel/clubhouse.jpg',
    label:    '07 — Club',
    heading:  'The art\nof gathering.',
    sub:      'Clubhouse & games lounge',
  },
  {
    img:      '/carousel/kids-play.jpg',
    label:    '08 — Family',
    heading:  "They'll never\nwant to leave.",
    sub:      "Dedicated kids' play zone",
  },
]

export default function ProjectInfo() {
  const wrapRef  = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const wrap  = wrapRef.current
    const track = trackRef.current
    const n     = SLIDES.length
    const vw    = () => window.visualViewport?.width ?? window.innerWidth

    const tl = gsap.to(track, {
      x:    -(n - 1) * vw(),
      ease: 'none',
      paused: true,
    })

    const fill    = document.getElementById('pinfo-fill')
    const setFill = fill ? gsap.quickSetter(fill, 'scaleX') : null

    const st = ScrollTrigger.create({
      trigger:   wrap,
      start:     'top top',
      end:       'bottom bottom',
      scrub:     0.5,
      animation: tl,
      onUpdate(self) { setFill?.(self.progress) },
    })

    const onResize = () => {
      tl.vars.x = -(n - 1) * vw()
      tl.invalidate()
      ScrollTrigger.refresh()
    }
    window.visualViewport?.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      st.kill()
      window.visualViewport?.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return (
    <div ref={wrapRef} className="pinfo-wrapper">
      <div className="pinfo-sticky">
        <div ref={trackRef} className="pinfo-track">

          {SLIDES.map((s, i) => (
            <div key={s.label} className="pinfo-slide">

              <img src={s.img} alt={s.sub} className="pinfo-img" loading={i === 0 ? 'eager' : 'lazy'} />
              <div className="pinfo-img-overlay" />

              <div className="pinfo-content">
                <span className="pinfo-label">{s.label}</span>
                <h3 className="pinfo-heading">
                  {s.heading.split('\n').map((line, j) => (
                    <span key={j} className="pinfo-heading-line">{line}</span>
                  ))}
                </h3>
                <p className="pinfo-sub">{s.sub}</p>
              </div>

              <span className="pinfo-counter">
                {String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
              </span>

            </div>
          ))}

        </div>

        {/* progress bar */}
        <div className="pinfo-progress-wrap">
          <div className="pinfo-progress-track">
            <div className="pinfo-progress-fill" id="pinfo-fill" />
          </div>
        </div>

      </div>
    </div>
  )
}
