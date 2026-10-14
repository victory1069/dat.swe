import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { ArrowDown } from 'lucide-react'
import { site } from '../data/content'
import { gsap, ScrollTrigger, SplitText, reducedMotion, useLenis } from '../lib/smooth'
import { useIntroDone } from '../lib/intro'
import { DMark } from './Brand'

function LagosTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: site.timezone }).format(new Date())
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 10000)
    return () => clearInterval(id)
  }, [])
  return <span>{t} WAT</span>
}

// The dot in the D follows the pointer like a pupil, and blinks now and
// then. On phones and tablets it follows your finger, leans with the device
// when the browser shares tilt (Android does without asking), and glances
// around on its own when nothing is happening.
function useEye(mark, dot) {
  useEffect(() => {
    if (reducedMotion()) return
    const x = gsap.quickTo(dot.current, 'x', { duration: 0.6, ease: 'power3' })
    const y = gsap.quickTo(dot.current, 'y', { duration: 0.6, ease: 'power3' })
    const max = () => {
      const hole = mark.current.querySelector('.dmark__hole')
      return (hole.offsetWidth - dot.current.offsetWidth) / 2 - 3
    }
    // Look in a direction, `amount` 0–1 of the way to the edge of the hole.
    const glance = (dx, dy, amount) => {
      const d = Math.hypot(dx, dy) || 1
      const reach = Math.min(1, amount) * max()
      x((dx / d) * reach)
      y((dy / d) * reach)
    }
    const look = (px, py) => {
      const hole = mark.current.querySelector('.dmark__hole').getBoundingClientRect()
      const dx = px - (hole.left + hole.width / 2)
      const dy = py - (hole.top + hole.height / 2)
      glance(dx, dy, Math.hypot(dx, dy) / 400)
    }

    const blink = gsap.to(dot.current, {
      scaleY: 0.12, duration: 0.09, yoyo: true, repeat: 1,
      repeatDelay: 0.04, ease: 'power2.in', delay: 2.5,
    })
    const blinker = setInterval(() => blink.restart(), 4200)
    const stop = []
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts)
      stop.push(() => target.removeEventListener(type, fn, opts))
    }

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      on(window, 'pointermove', (e) => look(e.clientX, e.clientY))
    } else {
      let idleUntil = 0
      const busy = () => { idleUntil = Date.now() + 2500 }
      on(window, 'touchstart', (e) => { busy(); look(e.touches[0].clientX, e.touches[0].clientY) }, { passive: true })
      on(window, 'touchmove', (e) => { busy(); look(e.touches[0].clientX, e.touches[0].clientY) }, { passive: true })
      on(window, 'deviceorientation', (e) => {
        if (e.gamma == null || Date.now() < idleUntil) return
        // gamma: left/right tilt; beta: forward/back, ~45° when held upright.
        const tx = gsap.utils.clamp(-1, 1, e.gamma / 25)
        const ty = gsap.utils.clamp(-1, 1, (e.beta - 45) / 25)
        idleUntil = Date.now() + 300
        glance(tx, ty, Math.hypot(tx, ty))
      })
      const wander = setInterval(() => {
        if (Date.now() < idleUntil) return
        const a = Math.random() * Math.PI * 2
        glance(Math.cos(a), Math.sin(a), 0.4 + Math.random() * 0.6)
      }, 1600)
      stop.push(() => clearInterval(wander))
    }
    return () => { stop.forEach((f) => f()); clearInterval(blinker); blink.kill() }
  }, [mark, dot])
}

export default function Hero() {
  const ref = useRef(null)
  const mark = useRef(null)
  const dot = useRef(null)
  const intro = useRef(null)
  const lenis = useLenis()
  const ready = useIntroDone()
  useEye(mark, dot)

  useGSAP(() => {
    // While the nav sits over the orange panel, its orange full stop would
    // vanish, so it switches to ink (as the brand's orange variant does).
    const root = document.documentElement
    ScrollTrigger.create({
      trigger: ref.current, start: 'top bottom', end: 'bottom top+=60',
      onToggle: (self) => root.classList.toggle('nav-on-orange', self.isActive),
    })
    const cleanup = () => root.classList.remove('nav-on-orange')
    if (reducedMotion()) return cleanup
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    ref.current.querySelectorAll('.hero__name span').forEach((el, i) => {
      const split = SplitText.create(el, { type: 'chars', mask: 'chars' })
      tl.from(split.chars, { yPercent: 115, rotate: 6, duration: 1.4, stagger: 0.04 }, i * 0.12)
    })
    tl.from('.hero__mark', { scale: 0.6, rotate: -25, autoAlpha: 0, duration: 1.4 }, 0)
      .from('.hero__fade', { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.5)
    intro.current = tl

    // Scrolling away. Desktop: the orange panel shrinks into a rounded card,
    // the name drifts apart and the D rolls off. Phones and tablets (dark,
    // centred): the D grows and turns as it leaves, and the name lifts and
    // fades, so the hero hands over to the orange band below.
    const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true }
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      gsap.to('.hero__panel', { scale: 0.9, borderRadius: 48, ease: 'none', scrollTrigger: st })
      gsap.to('.hero__name span:first-child', { xPercent: -10, ease: 'none', scrollTrigger: st })
      gsap.to('.hero__name span:last-child', { xPercent: 10, ease: 'none', scrollTrigger: st })
      gsap.to('.hero__markwrap', { yPercent: -30, rotate: 40, ease: 'none', scrollTrigger: st })
    })
    mm.add('(max-width: 1023px)', () => {
      gsap.to('.hero__markwrap', { scale: 1.35, rotate: -30, yPercent: -20, autoAlpha: 0.2, ease: 'none', scrollTrigger: st })
      gsap.to('.hero__title', { yPercent: -35, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '70% top' } })
      gsap.to('.hero__foot', { y: -40, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '40% top' } })
    })
    return cleanup
  }, { scope: ref })

  useEffect(() => { if (ready) intro.current?.play() }, [ready])

  return (
    <section className="hero" ref={ref}>
      <div className="hero__panel">
        <div className="hero__meta hero__fade">
          <span>{site.location}</span>
          <LagosTime />
          <span className="hero__open"><i /> Open to frontend &amp; React Native roles</span>
        </div>

        <div className="hero__markwrap">
          <DMark ref={mark} dotRef={dot} className="hero__mark" />
        </div>

        <div className="hero__title">
          <p className="hero__tag hero__fade">That software engineer</p>
          <h1 className="hero__name" aria-label={site.name}>
            <span>{site.firstName}</span>
            <span>{site.lastName}</span>
          </h1>
        </div>

        <div className="hero__foot">
          <p className="hero__line hero__fade">{site.line}</p>
          <div className="hero__actions hero__fade">
            <button className="btn btn--solid" onClick={() => lenis?.scrollTo('#work', { duration: 1.6 })}>
              See the work <ArrowDown size={16} />
            </button>
            <a className="btn" href={site.cv} target="_blank" rel="noreferrer">CV</a>
          </div>
        </div>
      </div>
    </section>
  )
}
