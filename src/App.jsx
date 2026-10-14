import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Nav from './components/Nav'
import Preloader from './components/Preloader'
import { Footer } from './components/Sections'
import { Cursor } from './components/ui'
import Home from './pages/Home'
import About from './pages/About'
import CaseStudy from './pages/CaseStudy'
import { site } from './data/content'
import { ScrollTrigger, useLenis } from './lib/smooth'
import { IntroContext } from './lib/intro'

const ease = [0.76, 0, 0.24, 1]

// A panel of ink wipes up over the old page, then lifts off the new one.
function Page({ children }) {
  return (
    <motion.main className="page" initial="enter" animate="idle" exit="leave">
      <motion.div
        className="curtain"
        aria-hidden="true"
        variants={{
          enter: { scaleY: 1, originY: 0 },
          idle: { scaleY: 0, originY: 0, transition: { duration: 0.7, ease, delay: 0.05 } },
          leave: { scaleY: 1, originY: 1, transition: { duration: 0.55, ease } },
        }}
      />
      {children}
    </motion.main>
  )
}

function Cv() {
  useEffect(() => { window.location.replace(site.cv) }, [])
  return null
}

export default function App() {
  const location = useLocation()
  const lenis = useLenis()
  const [introDone, setIntroDone] = useState(false)

  // No scrolling while the preloader is up.
  useEffect(() => {
    if (!lenis) return
    if (introDone) lenis.start()
    else lenis.stop()
  }, [lenis, introDone])

  // Land on #work when arriving at the homepage from another page.
  useEffect(() => {
    if (!lenis || !location.hash) return
    const id = setTimeout(() => lenis.scrollTo(location.hash, { duration: 1.4 }), 400)
    return () => clearTimeout(id)
  }, [lenis, location])

  return (
    <IntroContext.Provider value={introDone}>
      <Preloader onDone={() => setIntroDone(true)} />
      <Cursor />
      <Nav />
      <div className="content">
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => {
            lenis?.scrollTo(0, { immediate: true, force: true })
            requestAnimationFrame(() => ScrollTrigger.refresh())
          }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/work/:slug" element={<Page><CaseStudy /></Page>} />
            <Route path="/about" element={<Page><About /></Page>} />
            <Route path="/cv" element={<Cv />} />
            <Route path="*" element={<Page><Home /></Page>} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </IntroContext.Provider>
  )
}
