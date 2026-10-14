import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, reducedMotion } from '../lib/smooth'
import { useIntroDone } from '../lib/intro'

const SHOW_TBC = import.meta.env.DEV

// Renders a content value. Plain strings pass through; tbc() values show as a
// highlighted note in development and render nothing in a production build.
export function T({ v }) {
  if (v == null) return null
  if (typeof v === 'object' && 'tbc' in v) {
    return SHOW_TBC ? <mark className="tbc" title="Needs confirming">TBC: {v.tbc}</mark> : null
  }
  return v
}
export const isReal = (v) => v != null && !(typeof v === 'object' && 'tbc' in v)

// Words rise out of a line mask. `trigger="load"` runs once on mount
// (after `delay`); the default runs when the text scrolls into view.
export function Reveal({ as: Tag = 'div', children, className, trigger = 'scroll', delay = 0, by = 'words' }) {
  const ref = useRef(null)
  const tween = useRef(null)
  const ready = useIntroDone()
  const readyRef = useRef(ready)
  readyRef.current = ready
  useGSAP(() => {
    if (reducedMotion()) return
    SplitText.create(ref.current, {
      type: 'lines,words,chars',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) => (tween.current = gsap.from(self[by], {
          paused: trigger === 'load' && !readyRef.current,
          yPercent: 110,
          duration: by === 'chars' ? 1.1 : 0.9,
          ease: 'expo.out',
          stagger: by === 'chars' ? 0.025 : 0.035,
          delay,
          scrollTrigger: trigger === 'scroll' ? { trigger: ref.current, start: 'top 88%', once: true } : undefined,
        })),
    })
  }, { scope: ref })
  useEffect(() => { if (ready && trigger === 'load') tween.current?.play() }, [ready, trigger])
  return <Tag ref={ref} className={className}>{children}</Tag>
}

// A paragraph whose words light up one by one as it scrolls through the screen.
export function ScrubText({ children, className }) {
  const ref = useRef(null)
  useGSAP(() => {
    const split = SplitText.create(ref.current, { type: 'words' })
    if (reducedMotion()) return
    gsap.fromTo(split.words, { opacity: 0.14 }, {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
    })
  }, { scope: ref })
  return <p ref={ref} className={className}>{children}</p>
}

// Fades and lifts a block into view.
export function FadeIn({ children, className, as: Tag = 'div', y = 40 }) {
  const ref = useRef(null)
  useGSAP(() => {
    if (reducedMotion()) return
    gsap.from(ref.current, {
      y, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
    })
  }, { scope: ref })
  return <Tag ref={ref} className={className}>{children}</Tag>
}

// A dot that trails the pointer and grows over links. Over the phone it says
// "Tap" so visitors know the screen is live. Mouse and pen only.
export function Cursor() {
  const dot = useRef(null)
  const label = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = dot.current
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    const move = (e) => {
      x(e.clientX); y(e.clientY)
      const target = e.target.closest?.('[data-cursor], a, button')
      const mode = target?.dataset?.cursor || (target ? 'link' : '')
      el.dataset.mode = mode
      // An orange cursor would disappear on the orange hero.
      el.dataset.surface = e.target.closest?.('.hero__panel') ? 'orange' : ''
      label.current.textContent = mode === 'tap' ? 'Tap' : mode === 'view' ? 'View' : ''
    }
    const hide = () => { el.dataset.mode = 'hidden' }
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', hide)
    el.dataset.mode = 'hidden'
    el.style.display = 'flex'
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
    }
  }, [])
  return <div ref={dot} className="cursor" aria-hidden="true"><span ref={label} /></div>
}

export function Chip({ children }) {
  return <span className="chip">{children}</span>
}
