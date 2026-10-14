import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion, useLenis } from '../lib/smooth'

// An endless strip that runs left, speeds up while you scroll, and flips
// direction when you scroll back up.
export default function Marquee({ items }) {
  const ref = useRef(null)
  const lenis = useLenis()

  useGSAP(() => {
    if (reducedMotion() || !lenis) return
    const track = ref.current.querySelector('.marquee__track')
    const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
    // Start far from zero so playing in reverse never hits the beginning.
    loop.totalTime(loop.duration() * 100)
    let dir = 1
    const onScroll = ({ velocity, direction }) => {
      if (direction) dir = direction
      const speed = dir * (1 + Math.min(Math.abs(velocity) / 6, 4))
      gsap.to(loop, { timeScale: speed, duration: 0.3, overwrite: true })
    }
    return lenis.on('scroll', onScroll)
  }, { scope: ref, dependencies: [lenis] })

  // Two copies back to back, so moving by -50% lands exactly on the start.
  const row = (copy) => items.map((t) => <span key={copy + t}>{t}<i>✦</i></span>)
  return (
    <div className="marquee" ref={ref} aria-label={items.join(', ')}>
      <div className="marquee__track" aria-hidden="true">{row('a')}{row('b')}</div>
    </div>
  )
}
