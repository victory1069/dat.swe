import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const LenisContext = createContext(null)
export const useLenis = () => useContext(LenisContext)

// One Lenis instance for the whole site, driven by GSAP's ticker so that
// ScrollTrigger and the smooth scroll never disagree about where the page is.
export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)
  const raf = useRef(null)

  useEffect(() => {
    const instance = new Lenis({
      lerp: reducedMotion() ? 1 : 0.09,
      smoothWheel: !reducedMotion(),
    })
    instance.on('scroll', ScrollTrigger.update)
    raf.current = (time) => instance.raf(time * 1000)
    gsap.ticker.add(raf.current)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    return () => {
      gsap.ticker.remove(raf.current)
      instance.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export { gsap, ScrollTrigger, SplitText }
