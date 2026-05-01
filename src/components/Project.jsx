import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { num: '24',    label: 'Floors'     },
  { num: '120',   label: 'Units'      },
  { num: '3.2L',  label: 'Sq. Ft.'   },
  { num: '2026',  label: 'Completion' },
]

const isMobile = () => window.matchMedia('(max-width: 768px)').matches

export default function Project({ onVideoReady }) {
  const [videoSrc] = useState(() =>
    isMobile() ? '/drone-mobile.mp4' : '/drone-start.mp4'
  )
  const wrapRef    = useRef(null)
  const sectionRef = useRef(null)
  const videoRef   = useRef(null)
  const statsRef   = useRef([])
  const headRef    = useRef(null)
  const bodyRef    = useRef(null)

  useEffect(() => {
    const wrap    = wrapRef.current
    const section = sectionRef.current
    const video   = videoRef.current

    const readyTimer = setTimeout(() => { if (onVideoReady) onVideoReady() }, 6000)
    const onData = () => { clearTimeout(readyTimer); if (onVideoReady) onVideoReady() }
    video.addEventListener('loadeddata',     onData, { once: true })
    video.addEventListener('canplaythrough', onData, { once: true })
    if (video.readyState >= 2) { clearTimeout(readyTimer); if (onVideoReady) onVideoReady() }

    video.load()

    // ── Circle reveal + video scrub — driven by wrapper scroll budget ────
    gsap.set(section, { clipPath: 'circle(0% at 50% 50%)' })

    let rafId = null, rafTarget = 0
    const seekVideo = () => { video.currentTime = rafTarget; rafId = null }

    const st1 = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate(self) {
        const r = self.progress * 160
        gsap.set(section, { clipPath: `circle(${r}% at 50% 50%)` })

        const dur = video.duration || 6
        rafTarget = Math.min(self.progress, 1) * dur
        if (!rafId) rafId = requestAnimationFrame(seekVideo)
      },
    })

    // ── Content animations (fire once on enter) ──────────────────────────
    gsap.set([headRef.current, bodyRef.current], { yPercent: 60, opacity: 0 })
    gsap.set(statsRef.current, { yPercent: 40, opacity: 0 })

    const st2 = ScrollTrigger.create({
      trigger: headRef.current,
      start: 'top 80%',
      onEnter() {
        gsap.to(headRef.current, { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' })
        gsap.to(bodyRef.current, { yPercent: 0, opacity: 1, duration: 1, delay: 0.15, ease: 'power3.out' })
        gsap.to(statsRef.current, {
          yPercent: 0, opacity: 1, duration: 0.8,
          stagger: 0.08, delay: 0.3, ease: 'power3.out',
        })
      },
    })

    return () => {
      clearTimeout(readyTimer)
      video.removeEventListener('loadeddata',     onData)
      video.removeEventListener('canplaythrough', onData)
      if (rafId) cancelAnimationFrame(rafId)
      st1.kill()
      st2.kill()
    }
  }, [])

  return (
    <div ref={wrapRef} className="project-wrapper">
      <div className="project-sticky">
        <section ref={sectionRef} className="project-section">

          <video
            ref={videoRef}
            className="project-video"
            src={videoSrc}
            muted
            playsInline
            preload="auto"
          />
          <div className="project-overlay" />

          {/* ── Left: copy ── */}
          <div className="project-copy">
            <span className="project-eyebrow">Featured Project</span>

            <div ref={headRef} className="project-head-wrap">
              <h2 className="project-name">PK<br />Canopus</h2>
              <p className="project-location">Wakad · Pimpri Chinchwad, Maharashtra</p>
            </div>

            <div ref={bodyRef} className="project-body-wrap">
              <p className="project-desc">
                A refined residential address in the heart of Wakad.
                Thoughtfully designed homes that balance modern living with natural calm.
              </p>
              <a href="#" className="project-cta">
                <span>Explore Project</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ── Right: stats ── */}
          <div className="project-right">
            <div className="project-stats">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="stat-item"
                  ref={el => statsRef.current[i] = el}
                >
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>
    </div>
  )
}
