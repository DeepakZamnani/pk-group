import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Preloader({ videoReady, loadProgress, onComplete }) {
  const wrapRef = useRef(null)
  const barRef  = useRef(null)
  const textRef = useRef(null)
  const pctRef  = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    )
    gsap.set(barRef.current, { scaleX: 0 })
  }, [])

  // Drive bar from real CDN buffer progress
  useEffect(() => {
    const p = Math.min(loadProgress ?? 0, 0.92) // cap at 92% until truly ready
    gsap.to(barRef.current, { scaleX: p, duration: 0.4, ease: 'power2.out' })
    if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`
  }, [loadProgress])

  // Fill to 100% and exit
  useEffect(() => {
    if (!videoReady) return
    document.body.style.overflow = ''
    gsap.to(barRef.current, {
      scaleX: 1, duration: 0.35, ease: 'power2.out',
      onComplete() {
        if (pctRef.current) pctRef.current.textContent = '100%'
        gsap.to(wrapRef.current, {
          yPercent: -100,
          duration: 1,
          ease: 'power3.inOut',
          onComplete,
        })
      },
    })
  }, [videoReady, onComplete])

  return (
    <div ref={wrapRef} className="preloader">
      <span ref={textRef} className="preloader-logo">PK Group</span>
      <div className="preloader-track">
        <div ref={barRef} className="preloader-bar" />
      </div>
      <span ref={pctRef} className="preloader-pct">0%</span>
    </div>
  )
}
