import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TransitionSection() {
  const wrapRef  = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const wrap  = wrapRef.current
    const video = videoRef.current

    video.load()

    let rafId = null, rafTarget = 0
    const seekVideo = () => { video.currentTime = rafTarget; rafId = null }

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate(self) {
        const dur = video.duration || 6
        rafTarget = Math.min(self.progress, 1) * dur
        if (!rafId) rafId = requestAnimationFrame(seekVideo)
      },
    })

    return () => {
      st.kill()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={wrapRef} className="transition-wrapper">
      <div className="hero-sticky">
        {/* Drop TransitionVideo.mp4 in /public when ready */}
        <video
          ref={videoRef}
          className="hero-video"
          src="/TransitionVideo.mp4"
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-overlay" />
      </div>
    </div>
  )
}
