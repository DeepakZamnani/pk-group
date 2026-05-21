import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import About from '../components/About'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

const FOUNDERS = [
  {
    index:  '01',
    name:   ['Ar. Rohan', 'J. Kate'],
    title:  'Architect & Director at PK Group',
    img:    '/founders/Director.png',
    bio:    'He is a visionary founder of PK Group, established with the mission of leading the way in construction and contributing towards design that takes into consideration the future needs and lifestyle of people in developing times. With over 10 years of rich experience in the field of construction and management, Mr. Rohan has dedicated himself to developing highly premium and exclusive design projects. His positive outlook and technical expertise are driving innovation within the builder and developer ecosystem, paving the way for advanced facilities.',
  },
  {
    index:  '02',
    name:   ['Mr. Somnath', 'Pandurang Kate'],
    title:  'Founder & Visionary at PK Group',
    img:    '/founders/Founder.jpeg',
    bio:    'Mr. Somnath Pandurang Kate is a visionary leader and the founder of PK Group, established with the mission of revolutionizing the construction industry. His vision focuses on designing future-ready spaces that cater to evolving lifestyles and modern needs. With over a decade of expertise in construction and management, Mr. Kate has been instrumental in developing premium and exclusive design projects. His commitment to innovation and excellence is shaping the builder and developer ecosystem, paving the way for advanced facilities and sustainable growth.',
  },
]

export default function AboutPage() {
  const line1Ref    = useRef(null)
  const line2Ref    = useRef(null)
  const subRef      = useRef(null)
  const founderRefs = useRef([])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = ''

    const ctx = gsap.context(() => {
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110 })
      gsap.set(subRef.current, { opacity: 0, y: 16 })
      gsap.to(line1Ref.current, { yPercent: 0, duration: 1.1, delay: 0.2,  ease: 'power4.out' })
      gsap.to(line2Ref.current, { yPercent: 0, duration: 1.1, delay: 0.34, ease: 'power4.out' })
      gsap.to(subRef.current,   { opacity: 1, y: 0, duration: 0.9, delay: 0.6, ease: 'power3.out' })

      founderRefs.current.forEach((el) => {
        if (!el) return
        const img   = el.querySelector('.founder-img-wrap')
        const names = el.querySelectorAll('.founder-name-mask span')
        const rule  = el.querySelector('.founder-gold-rule')
        const title = el.querySelector('.founder-title')
        const bio   = el.querySelector('.founder-bio')

        gsap.set(img,   { opacity: 0, y: 40 })
        gsap.set(names, { yPercent: 110 })
        gsap.set(rule,  { scaleX: 0, transformOrigin: 'left' })
        gsap.set([title, bio], { opacity: 0, y: 16 })

        ScrollTrigger.create({
          trigger: el, start: 'top 82%',
          onEnter() {
            gsap.to(img,   { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' })
            gsap.to(names, { yPercent: 0, duration: 0.9, stagger: 0.08, delay: 0.15, ease: 'power4.out' })
            gsap.to(rule,  { scaleX: 1, duration: 0.7, delay: 0.4, ease: 'power3.inOut' })
            gsap.to(title, { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power3.out' })
            gsap.to(bio,   { opacity: 1, y: 0, duration: 0.8, delay: 0.65, ease: 'power3.out' })
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <div className="about-page-hero">
        <span className="about-page-eyebrow">Our Story</span>
        <h1 className="about-page-heading">
          <div className="about-page-mask">
            <span ref={line1Ref}>More than a developer.</span>
          </div>
          <div className="about-page-mask">
            <span ref={line2Ref} className="about-page-heading--dim">A legacy in the making.</span>
          </div>
        </h1>
        <p ref={subRef} className="about-page-sub">
          Since our founding, PK Group has pursued a single standard — that every home we build
          should outlast the decade and elevate the lives within it.
        </p>
      </div>

      {/* ── Founders ── */}
      <section className="founders-section">
        <div className="founders-header">
          <span className="founders-eyebrow">The Visionaries</span>
          <div className="founders-header-rule" />
        </div>

        <div className="founders-grid">
          {FOUNDERS.map((f, i) => (
            <div key={f.index} ref={el => founderRefs.current[i] = el} className="founder-card">

              <div className="founder-img-wrap">
                <span className="founder-ghost-index" aria-hidden="true">{f.index}</span>
                <div className="founder-portrait">
                  <img src={f.img} alt={f.name.join(' ')} />
                </div>
              </div>

              <div className="founder-info">
                <h2 className="founder-name-heading">
                  {f.name.map((line, j) => (
                    <div key={j} className="founder-name-mask">
                      <span>{line}</span>
                    </div>
                  ))}
                </h2>
                <div className="founder-gold-rule" />
                <span className="founder-title">{f.title}</span>
                <p className="founder-bio">{f.bio}</p>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ── About section ── */}
      <About />

      {/* ── Footer ── */}
      <Footer />
    </>
  )
}
