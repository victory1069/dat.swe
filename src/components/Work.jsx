import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, LayoutList, Smartphone } from 'lucide-react'
import { projects, site } from '../data/content'
import { demos } from '../demos'
import { gsap, reducedMotion, useLenis } from '../lib/smooth'
import Phone from './Phone'
import { Chip, T, isReal } from './ui'

const n = projects.length
const pad = (i) => String(i + 1).padStart(2, '0')

export function Stack({ items }) {
  return (
    <div className="stack">
      {items.map((s, i) => (isReal(s) ? <Chip key={s}>{s}</Chip> : <T key={i} v={s} />))}
    </div>
  )
}

function Notes({ p, i }) {
  return (
    <article className="panel" style={{ '--brand': p.brand.primary }}>
      <p className="panel__index">{pad(i)} <span>/ {pad(n - 1)}</span></p>
      <h3 className="panel__name">{p.name}</h3>
      <p className="panel__tagline">{p.tagline}</p>
      <p className="panel__card">{p.card}</p>
      <dl className="panel__meta">
        <div><dt>Role</dt><dd><T v={p.role} /></dd></div>
        <div><dt>Stack</dt><dd><Stack items={p.stack} /></dd></div>
      </dl>
      <div className="panel__links">
        <Link className="btn btn--solid" to={`/work/${p.slug}`} data-cursor="view">
          Read the case study <ArrowRight size={16} />
        </Link>
        {isReal(p.live) && <a className="btn" href={p.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={16} /></a>}
        {isReal(p.repo) && <a className="btn" href={p.repo} target="_blank" rel="noreferrer">Code <ArrowUpRight size={16} /></a>}
      </div>
    </article>
  )
}

function Dock({ active, onPick }) {
  return (
    <div className="dock" role="tablist" aria-label="Projects">
      {projects.map((p, i) => (
        <button
          key={p.slug}
          role="tab"
          aria-selected={active === i}
          aria-label={p.name}
          className="dock__app"
          style={{ '--app-bg': p.brand.primary, '--app-fg': p.brand.bg }}
          onClick={() => onPick(i)}
        >
          <span className="dock__icon">{p.app[0]}</span>
          <span className="dock__label">{p.app}</span>
        </button>
      ))}
    </div>
  )
}

function ProjectList() {
  return (
    <ol className="plist">
      {projects.map((p, i) => (
        <li key={p.slug}>
          <Link to={`/work/${p.slug}`} className="plist__row" style={{ '--brand': p.brand.primary }} data-cursor="view">
            <span className="plist__n">{pad(i)}</span>
            <span className="plist__name">{p.name}</span>
            <span className="plist__tag">{p.tagline}</span>
            <ArrowRight className="plist__arrow" />
          </Link>
        </li>
      ))}
    </ol>
  )
}

export default function Work() {
  const ref = useRef(null)
  const trigger = useRef(null)
  const [active, setActive] = useState(0)
  const [list, setList] = useState(false)
  const lenis = useLenis()
  const p = projects[active]
  const { Demo, tone } = demos[p.slug]

  // Desktop: pin the stage and let vertical scroll walk the notes sideways.
  useGSAP(() => {
    if (list) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const track = ref.current.querySelector('.work__track')
      const viewport = ref.current.querySelector('.work__viewport')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current.querySelector('.work__stage'),
          start: 'top top',
          end: () => `+=${window.innerHeight * (n - 1) * 0.9}`,
          pin: true,
          scrub: reducedMotion() ? true : 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
        },
      })
      tl.to(track, { x: () => -(track.scrollWidth - viewport.clientWidth), ease: 'none' }, 0)
        .fromTo('.work__bar i', { scaleX: 1 / n }, { scaleX: 1, ease: 'none' }, 0)
      trigger.current = tl.scrollTrigger
      return () => { trigger.current = null }
    })
  }, { scope: ref, dependencies: [list], revertOnUpdate: true })

  const goTo = (i) => {
    const next = Math.max(0, Math.min(n - 1, i))
    const st = trigger.current
    if (st && lenis) lenis.scrollTo(st.start + ((st.end - st.start) * next) / (n - 1), { duration: 1.2 })
    else setActive(next)
  }

  // Arrow keys move between projects while the section is on screen.
  useEffect(() => {
    if (list) return
    let visible = false
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.5 })
    io.observe(ref.current.querySelector('.work__stage'))
    const onKey = (e) => {
      if (!visible || e.target.closest('input, textarea')) return
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => { io.disconnect(); window.removeEventListener('keydown', onKey) }
  })

  return (
    <section id="work" className="work" ref={ref}>
      <div className="work__head">
        <h2 className="eyebrow">Selected work <sup>({pad(n - 1)})</sup></h2>
        <button className="toggle" onClick={() => setList(!list)} aria-pressed={list}>
          {list ? <><Smartphone size={15} /> Show the phone</> : <><LayoutList size={15} /> Show as a list</>}
        </button>
      </div>

      {list ? (
        <ProjectList />
      ) : (
        // GSAP wraps the pinned stage in a spacer. This outer div gives React a
        // parent it still owns, so swapping to the list doesn't break the DOM.
        <div>
          <div className="work__stage" style={{ '--i': active, '--brand': p.brand.primary }}>
            <div className="work__device">
              <Phone tone={tone}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={p.slug}
                    className="phone__swap"
                    initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Demo />
                  </motion.div>
                </AnimatePresence>
              </Phone>
              <Dock active={active} onPick={goTo} />
              <p className="work__hint">{site.phoneHint} <kbd>←</kbd><kbd>→</kbd></p>
            </div>
            <div className="work__viewport">
              <div className="work__track">
                {projects.map((proj, i) => <Notes key={proj.slug} p={proj} i={i} />)}
              </div>
            </div>
            <div className="work__bar" aria-hidden="true"><i /></div>
          </div>
        </div>
      )}
    </section>
  )
}
