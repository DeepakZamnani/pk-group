import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Preloader from './components/Preloader'
import './App.css'

export default function App() {
  const [heroComplete,  setHeroComplete]  = useState(false)
  const [videoReady,    setVideoReady]    = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)

  return (
    <>
      {!preloaderDone && (
        <Preloader
          videoReady={videoReady}
          onComplete={() => setPreloaderDone(true)}
        />
      )}
      <Navbar heroComplete={heroComplete} />
      <Hero
        onHeroComplete={setHeroComplete}
        onVideoReady={() => setVideoReady(true)}
      />

      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--warm-white)',
        }}
      >
        <p
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '14px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--stone)',
          }}
        >
          More sections coming soon
        </p>
      </section>
    </>
  )
}
