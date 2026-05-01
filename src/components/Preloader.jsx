import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Preloader({ videoReady, onComplete }) {
  const wrapRef = useRef(null)
  const barRef  = useRef(null)
  const textRef = useRef(null)

  // entrance
  useEffect(() => {
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    )
    // bar pulses to show activity while waiting
    gsap.to(barRef.current, {
      scaleX: 0.6, duration: 1.8, ease: 'power1.inOut',
      yoyo: true, repeat: -1,
    })
  }, [])

  // exit when video is ready
  useEffect(() => {
    if (!videoReady) return

    // kill the pulse, fill to 100 %, then slide the curtain up
    gsap.killTweensOf(barRef.current)
    gsap.to(barRef.current, {
      scaleX: 1, duration: 0.3, ease: 'power2.out',
      onComplete() {
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
    </div>
  )
}
