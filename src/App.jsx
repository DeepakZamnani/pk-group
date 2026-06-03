import { useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomePage     from './pages/HomePage'
import AboutPage    from './pages/AboutPage'
import ProjectsPage from './pages/ProjectsPage'
import CareersPage  from './pages/CareersPage'
import ContactPage         from './pages/ContactPage'
import ElloraEnclavePage    from './pages/ElloraEnclavePage'
import RedevelopmentPage   from './pages/RedevelopmentPage'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function RouteReset() {
  const location = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = ''
  }, [location.pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteReset />
      <Routes>
        <Route path="/"         element={<HomePage />}     />
        <Route path="/about"    element={<AboutPage />}    />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/careers"  element={<CareersPage />}  />
        <Route path="/contact"                       element={<ContactPage />}        />
        <Route path="/redevelopment"                 element={<RedevelopmentPage />}  />
        <Route path="/redevelopment/ellora-enclave"  element={<ElloraEnclavePage />}  />
      </Routes>
    </BrowserRouter>
  )
}
