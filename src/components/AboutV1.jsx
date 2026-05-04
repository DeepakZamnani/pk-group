import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { num: '15+',  label: 'Years of Excellence' },
  { num: '12',   label: 'Projects Delivered'  },
  { num: '4L+',  label: 'Sq. Ft. Built'       },
]

const BLOCKS = [
  {
    eyebrow: 'Our Founding',
    heading: 'Born from a belief\nthat homes deserve more.',
    body: 'PK Group was established with a singular conviction — that residential spaces should do more than shelter. They should elevate. Since our founding, we have pursued that standard without compromise.',
  },
  {
    eyebrow: 'Our Philosophy',
    heading: 'Design that outlasts\nthe decade.',
    body: 'Every project begins with restraint. We strip away the superfluous and build inward — toward precision, toward quiet luxury, toward spaces that feel as considered ten years on as they do the day you move in.',
  },
  {
    eyebrow: 'Our Promise',
    heading: 'Your address is\nour signature.',
    body: 'We do not deliver units. We deliver addresses — each one a statement of intent. From the lobby to the last detail of the penthouse, PK Group\'s name is the guarantee.',
  },
]

export default function About() {
  const sectionRef  = useRef(null)
  const leftRef     = useRef(null)
  const eyebrowRef  = useRef(null)
  const taglineRef  = useRef(null)
  const blockRefs   = useRef([])
  const statRefs    = useRef([])
  const dividerRef  = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Left panel entrance ───────────────────────────────────────
      gsap.set(eyebrowRef.current, { opacity: 0, y: 16 })
      gsap.set(taglineRef.current, { opacity: 0, y: 32 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter() {
          gsap.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
          gsap.to(taglineRef.current, { opacity: 1, y: 0, duration: 1.1, delay: 0.15, ease: 'power3.out' })
        },
      })

      // ── Right blocks — line-mask wipe ─────────────────────────────
      blockRefs.current.forEach((block, i) => {
        if (!block) return
        const eyebrow = block.querySelector('.about-block-eyebrow')
        const lines   = block.querySelectorAll('.about-block-line')
        const body    = block.querySelector('.about-block-body')

        gsap.set(lines,   { yPercent: 110 })
        gsap.set(eyebrow, { opacity: 0, y: 10 })
        gsap.set(body,    { opacity: 0, y: 16 })

        ScrollTrigger.create({
          trigger: block,
          start: 'top 82%',
          onEnter() {
            gsap.to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
            gsap.to(lines,   { yPercent: 0, duration: 0.85, stagger: 0.07, delay: 0.1, ease: 'power4.out' })
            gsap.to(body,    { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' })
          },
        })
      })

      // ── Divider ───────────────────────────────────────────────────
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: 'left center' })
      ScrollTrigger.create({
        trigger: dividerRef.current,
        start: 'top 85%',
        onEnter() {
          gsap.to(dividerRef.current, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' })
        },
      })

      // ── Stats ─────────────────────────────────────────────────────
      statRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { opacity: 0, y: 30 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter() {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.9, delay: i * 0.12, ease: 'power3.out' })
          },
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="about-section">

      {/* ── Split layout ── */}
      <div className="about-split">

        {/* Left — sticky statement */}
        <div ref={leftRef} className="about-left">
          <span ref={eyebrowRef} className="about-eyebrow">About PK Group</span>
          <h2 ref={taglineRef} className="about-tagline">
            We don't build<br />
            <em>buildings.</em><br />
            We build legacies.
          </h2>
        </div>

        {/* Right — scrollable blocks */}
        <div className="about-right">
          {BLOCKS.map((b, i) => (
            <div key={i} ref={el => blockRefs.current[i] = el} className="about-block">
              <span className="about-block-eyebrow">{b.eyebrow}</span>
              <h3 className="about-block-heading">
                {b.heading.split('\n').map((line, j) => (
                  <div key={j} className="about-block-mask">
                    <span className="about-block-line">{line}</span>
                  </div>
                ))}
              </h3>
              <p className="about-block-body">{b.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div ref={dividerRef} className="about-divider" />

      {/* ── Stats ── */}
      <div className="about-stats">
        {STATS.map((s, i) => (
          <div key={i} ref={el => statRefs.current[i] = el} className="about-stat">
            <span className="about-stat-num">{s.num}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

    </section>
  )
}
