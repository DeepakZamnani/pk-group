import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const isMobile = () => window.matchMedia('(max-width: 768px)').matches

export default function Hero({ onHeroComplete, onVideoReady, onProgress }) {
  const [mobile]   = useState(isMobile)
  const wrapRef     = useRef(null)
  const stickyRef   = useRef(null)
  const videoRef    = useRef(null)
  const titleRef    = useRef(null)
  const pkRef       = useRef(null)
  const progressRef = useRef(null)
  const fadeRef     = useRef(null)

  useLayoutEffect(() => {
    const title = titleRef.current
    const pk    = pkRef.current

    if (mobile) {
      if (onVideoReady) onVideoReady()
      if (onProgress)  onProgress(1)
      const ctx = gsap.context(() => {
        gsap.set(title, { xPercent: -50, yPercent: -50 })
        gsap.set(pk, { yPercent: 20, scale: 0.9, opacity: 0 })
        const tl = gsap.timeline({ delay: 0.4 })
        tl.to(pk, { yPercent: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'power4.out' })
          .to(pk, { scale: 1.1, opacity: 0, duration: 0.45, ease: 'power2.in' }, '+=0.9')
          .add(() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
            setTimeout(() => {
              if (wrapRef.current) wrapRef.current.style.display = 'none'
              window.scrollTo(0, 0)
              ScrollTrigger.refresh()
            }, 750)
          })
      })
      return () => ctx.revert()
    }

    const wrap  = wrapRef.current
    const video = videoRef.current
    const bar   = progressRef.current

    const signalReady = () => { if (onVideoReady) onVideoReady() }
    const readyTimer  = setTimeout(signalReady, 6000)
    const onData = () => { clearTimeout(readyTimer); signalReady() }
    video.addEventListener('loadeddata',     onData, { once: true })
    video.addEventListener('canplaythrough', onData, { once: true })
    if (video.readyState >= 2) { clearTimeout(readyTimer); signalReady() }

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
      gsap.set(title, { xPercent: -50, yPercent: -50 })
      gsap.set(pk,    { yPercent: 30, scale: 0.88, opacity: 0, transformOrigin: 'center center' })

      const tl = gsap.timeline({ paused: true })
      tl.to({}, { duration: 0.3 })
        .to(video, { filter: 'brightness(0.55)', duration: 0.06, ease: 'power2.out'  }, 0.20)
        .to(pk,    { yPercent: 0, scale: 1, opacity: 1, ease: 'power4.out', duration: 0.08 }, 0.22)
        .to(pk,    { scale: 1.12, opacity: 0, ease: 'power2.in',  duration: 0.07 }, 0.36)
        .to(video, { filter: 'brightness(1)', duration: 0.05, ease: 'power2.out' }, 0.44)
        .to(fadeRef.current, { opacity: 1, duration: 0.004, ease: 'none' }, 0.486)

      ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2,
        animation: tl,
        onUpdate(self) {
          const dur = video.duration || 8
          rafTarget = Math.min(self.progress / 0.3, 1) * dur
          if (!rafId) rafId = requestAnimationFrame(seekVideo)
          gsap.set(bar, { scaleX: self.progress })
        },
        onLeave()     { if (onHeroComplete) onHeroComplete(true)  },
        onEnterBack() { if (onHeroComplete) onHeroComplete(false) },
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
  }, [mobile, onHeroComplete, onVideoReady, onProgress])

  return (
    <>
      <div ref={progressRef} className="progress-bar" />

      <div ref={wrapRef} className="hero-wrapper">
        <div ref={stickyRef} className="hero-sticky">
          {mobile ? (
            <img src="https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/hero-mobile.jpeg" className="hero-video" alt="" />
          ) : (
            <video
              ref={videoRef}
              className="hero-video"
              src="https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/HeroVideo.mp4"
              muted
              playsInline
              preload="auto"
            />
          )}
          <div className="hero-overlay" />

          <div ref={titleRef} className="hero-title">
            <div className="line-mask">
              <img
                ref={pkRef}
                src="/pk-logo.png"
                alt="PK Group"
                className="hero-title-logo"
              />
            </div>
          </div>

          <div ref={fadeRef} className="hero-fade" />
        </div>
      </div>
    </>
  )
}
