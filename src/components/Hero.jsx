import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const isMobile = () => window.matchMedia('(max-width: 768px)').matches

export default function Hero({ onHeroComplete, onVideoReady, onProgress }) {
  const [videoSrc] = useState(() =>
    isMobile()
      ? 'https://mumvmszlytwswvacxnsg.supabase.co/storage/v1/object/public/assets/HeroVideo-mobile.mp4'
      : 'https://mumvmszlytwswvacxnsg.supabase.co/storage/v1/object/public/assets/HeroVideo.mp4'
  )
  const wrapRef       = useRef(null)
  const stickyRef     = useRef(null)
  const videoRef      = useRef(null)
  const titleRef      = useRef(null)
  const pkRef         = useRef(null)
  const groupRef      = useRef(null)
  const scrollHintRef = useRef(null)
  const progressRef   = useRef(null)
  const fadeRef       = useRef(null)

  useEffect(() => {
    const wrap    = wrapRef.current
    const video   = videoRef.current
    const title   = titleRef.current
    const pk      = pkRef.current
    const grp     = groupRef.current
    const hint    = scrollHintRef.current
    const bar     = progressRef.current
    const mobile  = isMobile()

    gsap.set(title, { xPercent: -50, yPercent: -50 })
    gsap.set(pk,  { yPercent: 105 })
    gsap.set(grp, { yPercent: 105 })

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
    const seekVideo = () => {
      if (mobile && video.fastSeek) video.fastSeek(rafTarget)
      else video.currentTime = rafTarget
      rafId = null
    }

    const createdSTs = []
    const tl = gsap.timeline({ paused: true })

    tl.to({}, { duration: 0.3 })
      .to(video, { filter: 'brightness(0.65)', duration: 0.06, ease: 'power2.out' }, 0.28)
      .to(pk,  { yPercent: 0, ease: 'power4.out', duration: 0.07 }, 0.30)
      .to(grp, { yPercent: 0, ease: 'power4.out', duration: 0.06 }, 0.34)
      .to(grp, { yPercent: -105, ease: 'power4.in', duration: 0.06 }, 0.55)
      .to(pk,  { yPercent: -105, ease: 'power4.in', duration: 0.07 }, 0.58)
      .to(video, { filter: 'brightness(1)', duration: 0.05, ease: 'power2.in' }, 0.64)
      .to(fadeRef.current, { opacity: 1, duration: mobile ? 0.04 : 0.06, ease: 'power2.in' }, mobile ? 0.65 : 0.62)

    createdSTs.push(ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2,
      animation: tl,
      onUpdate(self) {
        const dur = video.duration || 8
        rafTarget = Math.min(self.progress / (mobile ? 0.15 : 0.3), 1) * dur
        if (!rafId) rafId = requestAnimationFrame(seekVideo)
        gsap.set(bar, { scaleX: self.progress })
      },
      onLeave()      { if (onHeroComplete) onHeroComplete(true)  },
      onEnterBack()  { if (onHeroComplete) onHeroComplete(false) },
    }))

    gsap.to(hint, { opacity: 1, delay: 1.4, duration: 1.2 })
    createdSTs.push(ScrollTrigger.create({
      trigger: wrap,
      start: 'top+=1px top',
      onEnter: () => gsap.to(hint, { opacity: 0, duration: 0.5 }),
    }))

    return () => {
      clearTimeout(readyTimer)
      video.removeEventListener('loadeddata',     onData)
      video.removeEventListener('canplaythrough', onData)
      video.removeEventListener('progress',       onProgressEv)
      if (rafId) cancelAnimationFrame(rafId)
      createdSTs.forEach(st => st.kill())
    }
  }, [onHeroComplete, onVideoReady])

  return (
    <>
      <div ref={progressRef} className="progress-bar" />

      <div ref={wrapRef} className="hero-wrapper">
        <div ref={stickyRef} className="hero-sticky">
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
            {/* Each line-mask clips the text — creates the wipe effect */}
            <div className="line-mask">
              <span ref={pkRef} className="hero-title-pk">PK</span>
            </div>
            <div className="line-mask">
              <span ref={groupRef} className="hero-title-group">Group</span>
            </div>
          </div>

          <div ref={fadeRef} className="hero-fade" />

          <div ref={scrollHintRef} className="scroll-hint">
            <span>Scroll</span>
            <div className="scroll-line" />
          </div>
        </div>
      </div>
    </>
  )
}
