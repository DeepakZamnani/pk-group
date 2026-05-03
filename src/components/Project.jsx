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

export default function Project({ onVideoReady, onLeave, onProgress }) {
  const [videoSrc] = useState(() =>
    isMobile()
      ? 'https://mumvmszlytwswvacxnsg.supabase.co/storage/v1/object/public/assets/drone-mobile.mp4'
      : 'https://mumvmszlytwswvacxnsg.supabase.co/storage/v1/object/public/assets/drone-start.mp4'
  )
  const wrapRef    = useRef(null)
  const sectionRef = useRef(null)
  const videoRef   = useRef(null)
  const fadeRef    = useRef(null)
  const exitRef    = useRef(null)
  const statsRef   = useRef([])
  const headRef    = useRef(null)
  const bodyRef    = useRef(null)

  useEffect(() => {
    const video = videoRef.current

    const readyTimer = setTimeout(() => { if (onVideoReady) onVideoReady() }, 6000)
    const onData = () => { clearTimeout(readyTimer); if (onVideoReady) onVideoReady() }
    video.addEventListener('loadeddata',     onData, { once: true })
    video.addEventListener('canplaythrough', onData, { once: true })
    if (video.readyState >= 2) { clearTimeout(readyTimer); if (onVideoReady) onVideoReady() }

    const onProgressEv = () => {
      try {
        if (video.buffered.length && video.duration) {
          const p = video.buffered.end(video.buffered.length - 1) / video.duration
          if (onProgress) onProgress(Math.min(p, 1))
        }
      } catch (_) {}
    }
    video.addEventListener('progress', onProgressEv)

    video.load()

    // start fully black — fades out as scroll begins
    gsap.set(fadeRef.current, { opacity: 1 })
    gsap.set(exitRef.current, { opacity: 0 })

    let rafId = null, rafTarget = 0
    const seekVideo = () => { video.currentTime = rafTarget; rafId = null }

    const setFadeIn  = gsap.quickSetter(fadeRef.current, 'opacity')
    const setFadeOut = gsap.quickSetter(exitRef.current, 'opacity')

    const st1 = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2,
      onLeave() { onLeave?.() },
      onUpdate(self) {
        const p = self.progress

        // fade from black at entry (0 → 0.08)
        setFadeIn(Math.max(0, 1 - p / 0.08))

        // flash to white at exit (0.88 → 1.0)
        setFadeOut(Math.max(0, (p - 0.88) / 0.12))

        const dur = video.duration || 6
        rafTarget = Math.min(p, 1) * dur
        if (!rafId) rafId = requestAnimationFrame(seekVideo)
      },
    })

    // content animations
    gsap.set([headRef.current, bodyRef.current], { yPercent: 60, opacity: 0 })
    gsap.set(statsRef.current, { yPercent: 40, opacity: 0 })

    const st2 = ScrollTrigger.create({
      trigger: headRef.current,
      start: 'top 80%',
      onEnter() {
        gsap.to(headRef.current,  { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' })
        gsap.to(bodyRef.current,  { yPercent: 0, opacity: 1, duration: 1, delay: 0.15, ease: 'power3.out' })
        gsap.to(statsRef.current, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, delay: 0.3, ease: 'power3.out' })
      },
    })

    return () => {
      clearTimeout(readyTimer)
      video.removeEventListener('loadeddata',     onData)
      video.removeEventListener('canplaythrough', onData)
      video.removeEventListener('progress',       onProgressEv)
      if (rafId) cancelAnimationFrame(rafId)
      st1.kill()
      st2.kill()
    }
  }, [])

  return (
    <div ref={wrapRef} id="projects" className="project-wrapper">
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
          <div ref={fadeRef}  className="project-fade" />
          <div ref={exitRef}  className="project-exit" />

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

          <div className="project-right">
            <div className="project-stats">
              {STATS.map((s, i) => (
                <div key={s.label} className="stat-item" ref={el => statsRef.current[i] = el}>
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
