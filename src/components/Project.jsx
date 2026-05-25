import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { num: '24',    label: 'Floors'     },
  { num: '120',   label: 'Units'      },
  { num: '3.2L',  label: 'Sq. Ft.'   },
  { num: '2026',  label: 'Completion' },
]

const mobile = window.matchMedia('(max-width: 768px)').matches

const DRONE_SRC = mobile
  ? 'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/drone-mobile.mp4'
  : 'drone-start-4k.mp4'

export default function Project({ onVideoReady, onLeave, onProgress }) {
  const wrapRef    = useRef(null)
  const sectionRef = useRef(null)
  const videoRef   = useRef(null)
  const fadeRef    = useRef(null)
  const exitRef    = useRef(null)
  const introRef   = useRef(null)
  const statsRef   = useRef([])
  const headRef    = useRef(null)
  const bodyRef    = useRef(null)

  useLayoutEffect(() => {
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

    let rafId = null, rafTarget = 0
    const seekVideo = () => { video.currentTime = rafTarget; rafId = null }

    const ctx = gsap.context(() => {
      gsap.set(fadeRef.current, { opacity: 1 })
      gsap.set(exitRef.current, { opacity: 0 })

      const setFadeIn  = gsap.quickSetter(fadeRef.current, 'opacity')
      const setFadeOut = gsap.quickSetter(exitRef.current, 'opacity')

      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: mobile ? 0.45 : 0.2,
        onLeave() { onLeave?.() },
        onUpdate(self) {
          const p = self.progress
          if (!mobile) setFadeIn(Math.max(0, 1 - p / 0.001))
          else         setFadeIn(Math.max(0, 1 - p / 0.20))
          setFadeOut(Math.max(0, (p - 0.998) / 0.002))
          const dur = video.duration || 6
          rafTarget = Math.min(p, 1) * dur
          if (!rafId) rafId = requestAnimationFrame(seekVideo)
        },
      })

      if (mobile && introRef.current) {
        const items = introRef.current.children
        gsap.set(items, { opacity: 0 })
        ScrollTrigger.create({
          trigger: wrapRef.current,
          start: 'top 95%',
          once: true,
          onEnter() {
            gsap.to(items, {
              opacity: 1,
              duration: 0.75,
              stagger: 0.2,
              ease: 'power2.out',
              delay: 0.1,
            })
          },
        })
      }

      gsap.set([headRef.current, bodyRef.current], { yPercent: 60, opacity: 0 })
      gsap.set(statsRef.current, { yPercent: 40, opacity: 0 })

      ScrollTrigger.create({
        trigger: headRef.current,
        start: 'top 80%',
        onEnter() {
          gsap.to(headRef.current,  { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' })
          gsap.to(bodyRef.current,  { yPercent: 0, opacity: 1, duration: 1, delay: 0.15, ease: 'power3.out' })
          gsap.to(statsRef.current, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, delay: 0.3, ease: 'power3.out' })
        },
      })
    })

    return () => {
      clearTimeout(readyTimer)
      video.removeEventListener('loadeddata',     onData)
      video.removeEventListener('canplaythrough', onData)
      video.removeEventListener('progress',       onProgressEv)
      if (rafId) cancelAnimationFrame(rafId)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={wrapRef} id="projects" className="project-wrapper">
      <div className="project-sticky">
        <section ref={sectionRef} className="project-section">
          <video
            ref={videoRef}
            className="project-video"
            src={DRONE_SRC}
            muted
            playsInline
            preload="auto"
          />
          <div className="project-overlay" />
          <div ref={fadeRef} className="project-fade">
            {mobile && (
              <div ref={introRef} className="project-fade-intro">
                <span className="pf-eyebrow">Featured Project</span>
                <h2 className="pf-name">PK<br />Canopus</h2>
                <span className="pf-sub">Wakad · Pune · 2026</span>
              </div>
            )}
          </div>
          <div ref={exitRef}  className="project-exit" />

          <div className="project-copy">
            <span className="project-eyebrow">Featured Project</span>
            <div ref={headRef} className="project-head-wrap">
              <h2 className="project-name">PK<br />Canopus</h2>
              <p className="project-location">Wakad · Pimpri Chinchwad, Maharashtra</p>
            </div>
            <div ref={bodyRef} className="project-body-wrap">
              <p className="project-desc">
                3 &amp; 4 BHK ultra-luxurious residences in the heart of Wakad.
                A landmark mixed-use address — retail, dining, and workspace at your doorstep, with Hinjawadi moments away.
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
