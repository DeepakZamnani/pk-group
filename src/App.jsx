import { useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Preloader from './components/Preloader'
import Project from './components/Project'
import './App.css'

export default function App() {
  const [heroComplete,       setHeroComplete]       = useState(false)
  const [heroVideoReady,     setHeroVideoReady]     = useState(false)
  const [projectVideoReady,  setProjectVideoReady]  = useState(false)
  const [preloaderDone,      setPreloaderDone]      = useState(false)

  const handleHeroVideoReady    = useCallback(() => setHeroVideoReady(true),    [])
  const handleProjectVideoReady = useCallback(() => setProjectVideoReady(true), [])
  const handlePreloaderDone     = useCallback(() => setPreloaderDone(true),     [])

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
      <Project onVideoReady={handleProjectVideoReady} />
    </>
  )
}
