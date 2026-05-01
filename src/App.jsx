import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import './App.css'

export default function App() {
  const [heroComplete, setHeroComplete] = useState(false)

  return (
    <>
      <Navbar heroComplete={heroComplete} />
      <Hero onHeroComplete={setHeroComplete} />

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
