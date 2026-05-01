import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const isMobile = () => window.matchMedia('(max-width: 768px)').matches

export default function Hero({ onHeroComplete }) {
  const [videoSrc] = useState(() =>
    isMobile() ? '/HeroVideo-mobile.mp4' : '/HeroVideo.mp4'
  )
  const wrapRef      = useRef(null)
  const videoRef     = useRef(null)
  const titleRef     = useRef(null)
  const pkRef        = useRef(null)
  const groupRef     = useRef(null)
  const scrollHintRef = useRef(null)
  const progressRef  = useRef(null)

  useEffect(() => {
    const wrap  = wrapRef.current
    const video = videoRef.current
    const title = titleRef.current
    const pk    = pkRef.current
    const grp   = groupRef.current
    const hint  = scrollHintRef.current
    const bar   = progressRef.current

    // GSAP owns all transforms — no CSS transform conflict
    gsap.set(title, { xPercent: -50, yPercent: -50 })
    gsap.set(pk,    { opacity: 0, y: 50 })
    gsap.set(grp,   { opacity: 0, y: 25 })

    // rAF throttle — video.currentTime is only written once per paint frame
    let rafId     = null
    let rafTarget = 0
    const seekVideo = () => { video.currentTime = rafTarget; rafId = null }

    const vw        = window.innerWidth
    const vh        = window.innerHeight
    const mobile    = vw <= 768
    const navPad    = mobile ? 20 : 48   // matches CSS padding
    const navHeight = mobile ? 60 : 72   // matches CSS height

    const heroSize = parseFloat(getComputedStyle(pk).fontSize)
    const navScale = 18 / heroSize
    const xToNav   = navPad - vw * 0.5
    const yToNav   = (navHeight / 2) - vh * 0.5

    const tl = gsap.timeline({ paused: true })

    tl.to({}, { duration: 0.5 })

      .to(video, { filter: 'blur(12px) brightness(0.7)', ease: 'power2.out', duration: 0.12 }, 0.48)

      .to(pk,  { opacity: 1, y: 0, ease: 'power2.out', duration: 0.10 }, 0.50)
      .to(grp, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.09 }, 0.57)

      .to(title, {
        x: xToNav, y: yToNav,
        xPercent: 0, yPercent: 0,
        scale: navScale,
        transformOrigin: 'left center',
        ease: 'power3.inOut',
        duration: 0.22,
      }, 0.68)
      .to(video, { filter: 'blur(0px) brightness(1)', ease: 'power2.in', duration: 0.20 }, 0.68)
      .to(grp, { opacity: 0, duration: 0.08 }, 0.68)
      .to(pk,  { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0.90)

    // ─── GSAP pin — created immediately, not waiting for video ────────────
    ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: '+=700%',
      pin: true,
      scrub: 0.5,
      animation: tl,
      onUpdate(self) {
        // read video.duration live so it works before metadata loads too
        const dur = video.duration || 8
        rafTarget = Math.min(self.progress / 0.5, 1) * dur
        if (!rafId) rafId = requestAnimationFrame(seekVideo)
        gsap.set(bar, { scaleX: self.progress })
      },
      onLeave() {
        if (onHeroComplete) onHeroComplete(true)
      },
      onEnterBack() {
        if (onHeroComplete) onHeroComplete(false)
      },
    })

    // scroll hint
    gsap.to(hint, { opacity: 1, delay: 1.4, duration: 1.2 })
    ScrollTrigger.create({
      trigger: wrap,
      start: 'top+=1px top',
      onEnter: () => gsap.to(hint, { opacity: 0, duration: 0.5 }),
    })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [onHeroComplete])

  return (
    <>
      <div ref={progressRef} className="progress-bar" />

      <div ref={wrapRef} className="hero-sticky">
        <video
          ref={videoRef}
          className="hero-video"
          src={videoSrc}
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-overlay" />

        <div ref={titleRef} className="hero-title">
          <span ref={pkRef}    className="hero-title-pk">PK</span>
          <span ref={groupRef} className="hero-title-group">Group</span>
        </div>

        <div ref={scrollHintRef} className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </div>
    </>
  )
}
