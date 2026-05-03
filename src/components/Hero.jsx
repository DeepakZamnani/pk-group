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
    const wrap  = wrapRef.current
    const video = videoRef.current
    const title = titleRef.current
    const pk    = pkRef.current
    const grp   = groupRef.current
    const hint  = scrollHintRef.current
    const bar   = progressRef.current

    // Text starts hidden below each line's overflow:hidden mask
    gsap.set(title, { xPercent: -50, yPercent: -50 })
    gsap.set(pk,  { yPercent: 105 })
    gsap.set(grp, { yPercent: 105 })

    // Video ready → preloader exit
    const signalReady = () => { if (onVideoReady) onVideoReady() }
    const readyTimer  = setTimeout(signalReady, 6000)
    const onData = () => { clearTimeout(readyTimer); signalReady() }
    video.addEventListener('loadeddata',     onData, { once: true })
    video.addEventListener('canplaythrough', onData, { once: true })
    if (video.readyState >= 2) { clearTimeout(readyTimer); signalReady() }

    const onProgress = () => {
      try {
        if (video.buffered.length && video.duration) {
          const p = video.buffered.end(video.buffered.length - 1) / video.duration
          if (onProgress) onProgress(Math.min(p, 1))
        }
      } catch (_) {}
    }
    video.addEventListener('progress', onProgress)

    video.load()

    // rAF-throttled video scrub
    let rafId = null, rafTarget = 0
    const seekVideo = () => { video.currentTime = rafTarget; rafId = null }

    const createdSTs = []
    const tl = gsap.timeline({ paused: true })

    // ── Timeline ──────────────────────────────────────────────────────────
    // 0.00–0.50  video scrubs
    // 0.48       overlay dims slightly for text legibility
    // 0.50–0.60  "PK" wipes up into view (line mask)
    // 0.55–0.64  "Group" wipes up into view (staggered)
    // 0.64–0.78  text holds — clean read
    // 0.78–0.86  "Group" wipes back up out of frame
    // 0.82–0.92  "PK" wipes back up out of frame (reverse stagger)
    // 0.92       overlay clears

    // compressed into 0–0.65 of scroll — same beats, 35% tighter
    tl.to({}, { duration: 0.3 })

      .to(video, { filter: 'brightness(0.65)', duration: 0.06, ease: 'power2.out' }, 0.28)

      // enter — snap up fast
      .to(pk,  { yPercent: 0, ease: 'power4.out', duration: 0.07 }, 0.30)
      .to(grp, { yPercent: 0, ease: 'power4.out', duration: 0.06 }, 0.34)

      // hold, then exit sharply
      .to(grp, { yPercent: -105, ease: 'power4.in', duration: 0.06 }, 0.55)
      .to(pk,  { yPercent: -105, ease: 'power4.in', duration: 0.07 }, 0.58)

      .to(video, { filter: 'brightness(1)', duration: 0.05, ease: 'power2.in' }, 0.64)
      .to(fadeRef.current, { opacity: 1, duration: 0.06, ease: 'power2.in' }, 0.62)

    // ── ScrollTrigger ─────────────────────────────────────────────────────
    createdSTs.push(ScrollTrigger.create({
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
      video.removeEventListener('progress',       onProgress)
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
