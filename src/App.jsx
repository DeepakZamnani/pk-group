import { useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Preloader from './components/Preloader'
import Project from './components/Project'
import './App.css'

export default function App() {
  const [heroComplete,  setHeroComplete]  = useState(false)
  const [videoReady,    setVideoReady]    = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)

  const handleVideoReady   = useCallback(() => setVideoReady(true),   [])
  const handlePreloaderDone = useCallback(() => setPreloaderDone(true), [])

  return (
    <>
      {!preloaderDone && (
        <Preloader
          videoReady={videoReady}
          onComplete={handlePreloaderDone}
        />
      )}
      <Navbar heroComplete={heroComplete} />
      <Hero
        onHeroComplete={setHeroComplete}
        onVideoReady={handleVideoReady}
      />
      <Project />
    </>
  )
}
