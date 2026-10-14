import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion } from '../lib/smooth'
import { DMark, Wordmark } from './Brand'

const TAG = 'That software engineer'

// Three seconds, start to finish:
//   0.0  the D rises out of a mask, the dot pops in
//   0.8  "dat.swe" types itself out, the tagline opens up
//   0–2.4  the counter runs to 100
//   2.3  the dot floods the screen orange. On desktop the hero is orange too,
//        so the preloader just disappears. On phones and tablets the hero
//        is black, so the orange sheet lifts away like a curtain.
export default function Preloader({ onDone }) {
  const ref = useRef(null)
  const [gone, setGone] = useState(false)

  useGSAP(() => {
    const q = gsap.utils.selector(ref)
    const finish = () => { setGone(true); onDone() }
    document.documentElement.classList.add('is-loading')
    const unlock = () => document.documentElement.classList.remove('is-loading')

    if (reducedMotion()) {
      gsap.timeline({ onComplete: () => { unlock(); finish() } })
        .to(ref.current, { autoAlpha: 0, duration: 0.4, delay: 1 })
      return unlock
    }

    const count = { v: 0 }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => { unlock(); finish() } })

    tl.fromTo(q('.pre__mark'), { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.8 }, 0)
      .from(q('.pre__mark .dmark__dot'), { scale: 0, duration: 0.6, ease: 'back.out(3)' }, 0.45)
      .from(q('.pre__word > *'), { autoAlpha: 0, duration: 0.01, stagger: 0.075, ease: 'none' }, 0.8)
      .from(q('.pre__word .wordmark__dot'), { scale: 0, y: -24, duration: 0.5, ease: 'back.out(4)' }, 0.95)
      .from(q('.pre__tag'), { autoAlpha: 0, letterSpacing: '0em', duration: 1.1 }, 1.25)
      .to(count, {
        v: 100, duration: 2.35, ease: 'power2.inOut',
        onUpdate: () => {
          const el = q('.pre__count')[0]
          if (el) el.textContent = String(Math.round(count.v)).padStart(3, '0')
        },
      }, 0)
      .fromTo(q('.pre__bar i'), { scaleX: 0 }, { scaleX: 1, duration: 2.35, ease: 'power2.inOut' }, 0)

    // The flood grows from wherever the dot is on screen, big enough to
    // cover the far corner.
    tl.add(() => {
      const dot = q('.pre__mark .dmark__dot')[0].getBoundingClientRect()
      const cx = dot.left + dot.width / 2
      const cy = dot.top + dot.height / 2
      const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy))
      gsap.set(q('.pre__flood'), { left: cx, top: cy, width: r * 2, height: r * 2, xPercent: -50, yPercent: -50 })
    }, 2.1)
    if (window.matchMedia('(min-width: 1024px)').matches) {
      tl.fromTo(q('.pre__flood'), { scale: 0 }, { scale: 1, duration: 0.55, ease: 'expo.in' }, 2.35)
        .to(ref.current, { autoAlpha: 0, duration: 0.1, ease: 'none' }, 2.9)
    } else {
      tl.fromTo(q('.pre__flood'), { scale: 0 }, { scale: 1, duration: 0.45, ease: 'expo.in' }, 2.15)
        .to(ref.current, { yPercent: -100, duration: 0.45, ease: 'expo.inOut' }, 2.55)
    }

    return unlock
  }, { scope: ref })

  if (gone) return null
  return (
    <div className="preloader" ref={ref} aria-live="polite" aria-label="Loading">
      <div className="pre__center">
        <DMark className="pre__mark dmark--on-ink" />
        <Wordmark className="pre__word" />
        <p className="pre__tag">{TAG}</p>
      </div>
      <div className="pre__foot">
        <span>Victory Bedford — portfolio</span>
        <span className="pre__count">000</span>
      </div>
      <div className="pre__bar"><i /></div>
      <div className="pre__flood" />
    </div>
  )
}
