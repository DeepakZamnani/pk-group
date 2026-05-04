import { useState, useCallback, useRef, useMemo } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Preloader from './components/Preloader'
import Project from './components/Project'
import VideoSection from './components/VideoSection'
import About from './components/About'
import ProjectInfo from './components/ProjectInfo'
import Footer from './components/Footer'
// import ProjectInfo from './components/ProjectInfoMask'  // mask backup
import './App.css'

export default function App() {
  const [heroComplete,       setHeroComplete]       = useState(false)
  const [heroVideoReady,     setHeroVideoReady]     = useState(false)
  const [projectVideoReady,  setProjectVideoReady]  = useState(false)
  const [preloaderDone,      setPreloaderDone]      = useState(false)

  const vsecRef = useRef(null)

  const [heroProgress,    setHeroProgress]    = useState(0)
  const [projectProgress, setProjectProgress] = useState(0)

  const handleHeroVideoReady    = useCallback(() => setHeroVideoReady(true),    [])
  const handleProjectVideoReady = useCallback(() => setProjectVideoReady(true), [])
  const handlePreloaderDone     = useCallback(() => setPreloaderDone(true),     [])
  const handleHeroProgress      = useCallback(p => setHeroProgress(p),    [])
  const handleProjectProgress   = useCallback(p => setProjectProgress(p), [])

  const loadProgress = useMemo(
    () => (heroProgress + projectProgress) / 2,
    [heroProgress, projectProgress]
  )

  const handleProjectLeave = useCallback(() => {
    vsecRef.current?.snap()
  }, [])

  const allReady = heroVideoReady && projectVideoReady

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
      <About />
      <Footer />
    </>
  )
}
