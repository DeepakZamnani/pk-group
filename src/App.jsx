import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
import HomePage     from './pages/HomePage'
import AboutPage    from './pages/AboutPage'
import ProjectsPage from './pages/ProjectsPage'
import CareersPage  from './pages/CareersPage'
import ContactPage  from './pages/ContactPage'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function RouteReset() {
  const location = useLocation()
  useEffect(() => {
    gsap.killTweensOf('*')
    ScrollTrigger.getAll().forEach(st => st.kill())
    window.scrollTo(0, 0)
    document.body.style.overflow = ''
  }, [location.pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteReset />
      <Routes>
        <Route path="/"         element={<HomePage />}     />
        <Route path="/about"    element={<AboutPage />}    />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/careers"  element={<CareersPage />}  />
        <Route path="/contact"  element={<ContactPage />}  />
      </Routes>
    </BrowserRouter>
  )
}
