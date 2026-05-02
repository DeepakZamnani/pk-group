import { useState, useCallback, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Preloader from './components/Preloader'
import Project from './components/Project'
import VideoSection from './components/VideoSection'
import ProjectInfo from './components/ProjectInfo'
// import ProjectInfo from './components/ProjectInfoMask'  // mask backup
import './App.css'

export default function App() {
  const [heroComplete,       setHeroComplete]       = useState(false)
  const [heroVideoReady,     setHeroVideoReady]     = useState(false)
  const [projectVideoReady,  setProjectVideoReady]  = useState(false)
  const [preloaderDone,      setPreloaderDone]      = useState(false)

  const vsecRef = useRef(null)

  const handleHeroVideoReady    = useCallback(() => setHeroVideoReady(true),    [])
  const handleProjectVideoReady = useCallback(() => setProjectVideoReady(true), [])
  const handlePreloaderDone     = useCallback(() => setPreloaderDone(true),     [])

  const handleProjectLeave = useCallback(() => {
    vsecRef.current?.snap()
  }, [])

  const allReady = heroVideoReady && projectVideoReady

  return (
    <>
      {!preloaderDone && (
        <Preloader
          videoReady={allReady}
          onComplete={handlePreloaderDone}
        />
      )}
      <Navbar heroComplete={heroComplete} />
      <Hero
        onHeroComplete={setHeroComplete}
        onVideoReady={handleHeroVideoReady}
      />
      <Project
        onVideoReady={handleProjectVideoReady}
        onLeave={handleProjectLeave}
      />
      <VideoSection ref={vsecRef} />
      <ProjectInfo />
    </>
  )
}
