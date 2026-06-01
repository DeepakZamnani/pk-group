import { useState, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Preloader from '../components/Preloader'
import Project from '../components/Project'
import VideoSection from '../components/VideoSection'
import ProjectInfo from '../components/ProjectInfo'
import Footer from '../components/Footer'
import { useSEO } from '../hooks/useSEO'

export default function HomePage() {
  const [heroComplete,      setHeroComplete]      = useState(false)
  const [heroVideoReady,    setHeroVideoReady]    = useState(false)
  const [projectVideoReady, setProjectVideoReady] = useState(false)
  const [preloaderDone,     setPreloaderDone]     = useState(false)

  const vsecRef = useRef(null)

  const [heroProgress,    setHeroProgress]    = useState(0)
  const [projectProgress, setProjectProgress] = useState(0)

  const handleHeroVideoReady    = useCallback(() => setHeroVideoReady(true),    [])
  const handleProjectVideoReady = useCallback(() => setProjectVideoReady(true), [])
  const handlePreloaderDone     = useCallback(() => setPreloaderDone(true),     [])
  const handleHeroProgress      = useCallback(p => setHeroProgress(p),          [])
  const handleProjectProgress   = useCallback(p => setProjectProgress(p),       [])

  const loadProgress = useMemo(
    () => (heroProgress + projectProgress) / 2,
    [heroProgress, projectProgress]
  )

  const navigate = useNavigate()

  const handleProjectLeave = useCallback(() => {
    vsecRef.current?.snap()
  }, [])

  const allReady = heroVideoReady && projectVideoReady

  useSEO({
    title:       'Luxury Real Estate Developer in Pune',
    description: 'PK Group Realty — ultra-luxury residential developer in Pune. Explore PK Canopus (Wakad, 24 floors, 3 & 4 BHK), PK Ornate and PK Hillcrest (Pimple Saudagar). Homes built to outlast decades.',
    image:       'https://pub-1deadda0e0574fd399f7bfe63a5e41d7.r2.dev/carousel-canopus/hero.jpg',
    path:        '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://www.pkgroupcompanies.com/#webpage',
      'url': 'https://www.pkgroupcompanies.com/',
      'name': 'PK Group | Luxury Real Estate Developer in Pune',
      'description': 'Ultra-luxury residential developer in Pune — PK Canopus, PK Ornate, PK Hillcrest.',
      'isPartOf': { '@id': 'https://www.pkgroupcompanies.com/#website' },
      'about': { '@id': 'https://www.pkgroupcompanies.com/#organization' },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.pkgroupcompanies.com/' },
        ],
      },
    },
  })

  return (
    <>
      {!preloaderDone && (
        <Preloader
          videoReady={allReady}
          loadProgress={loadProgress}
          onComplete={handlePreloaderDone}
        />
      )}
      <Navbar heroComplete={heroComplete} />
      <Hero
        onHeroComplete={setHeroComplete}
        onVideoReady={handleHeroVideoReady}
        onProgress={handleHeroProgress}
      />

      <Project
        onVideoReady={handleProjectVideoReady}
        onLeave={handleProjectLeave}
        onProgress={handleProjectProgress}
      />
      <VideoSection ref={vsecRef} />
      <ProjectInfo />

      {/* ── View More Projects ── */}
      <div className="home-more-projects">
        <div className="home-more-inner">
          <div className="home-more-text">
            <span className="home-more-eyebrow">Our Portfolio</span>
            <h2 className="home-more-heading">
              Two addresses.<br />
              <em>One standard.</em>
            </h2>
          </div>
          <button
            className="home-more-btn"
            onClick={() => navigate('/projects')}
          >
            <span>View All Projects</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <Footer />
    </>
  )
}
