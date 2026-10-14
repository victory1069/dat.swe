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

// The phone's screen slides in from the side you're heading towards.
const screenSwap = {
  enter: (dir) => ({ opacity: 0, x: dir * 70, scale: 0.96, filter: 'blur(6px)' }),
  show: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  leave: (dir) => ({ opacity: 0, x: dir * -70, scale: 0.96, filter: 'blur(6px)', transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }),
}
const pad = (i) => String(i + 1).padStart(2, '0')

export function Stack({ items }) {
  return (
    <div className="stack">
      {items.map((s, i) => (isReal(s) ? <Chip key={s}>{s}</Chip> : <T key={i} v={s} />))}
    </div>
  )
}

const host = (url) => new URL(url).hostname.replace(/^www\./, '')

// A pill that opens the real product in a new tab, in the project's colour.
export function LiveButton({ p, className = '' }) {
  if (!isReal(p.live)) return null
  return (
    <a
      className={`live ${className}`}
      href={p.live}
      target="_blank"
      rel="noreferrer"
      style={{ '--brand': p.brand.primary }}
      aria-label={`Open ${p.name}, live site, in a new tab`}
    >
      <i className="live__dot" aria-hidden="true" />
      <span className="live__label">Live</span>
      <span className="live__host">{host(p.live)}</span>
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  )
}

function Notes({ p, i, active }) {
  return (
    <article className={`panel${active ? ' is-active' : ''}`} style={{ '--brand': p.brand.primary }}>
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
        <LiveButton p={p} />
        {isReal(p.repo) && <a className="btn" href={p.repo} target="_blank" rel="noreferrer">Code <ArrowUpRight size={16} /></a>}
      </div>
    </article>
  )
}

function Dock({ active, onPick }) {
  const ref = useRef(null)
  // On phones the dock is a scrolling row; keep the open app centred in it.
  useEffect(() => {
    const dock = ref.current
    if (dock.scrollWidth <= dock.clientWidth) return
    const app = dock.children[active]
    dock.scrollTo({ left: app.offsetLeft - (dock.clientWidth - app.offsetWidth) / 2, behavior: 'smooth' })
  }, [active])
  return (
    <div className="dock" role="tablist" aria-label="Projects" ref={ref}>
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
        <li key={p.slug} className="plist__item">
          <Link to={`/work/${p.slug}`} className="plist__row" style={{ '--brand': p.brand.primary }} data-cursor="view">
            <span className="plist__n">{pad(i)}</span>
            <span className="plist__name">{p.name}</span>
            <span className="plist__tag">{p.tagline}</span>
            <ArrowRight className="plist__arrow" />
          </Link>
          <LiveButton p={p} className="plist__live" />
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
  const swipe = useRef(null)

  // Which way we moved, so the next screen slides in from that side.
  const last = useRef({ active, dir: 1 })
  if (last.current.active !== active) last.current = { active, dir: active > last.current.active ? 1 : -1 }
  const dir = last.current.dir

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
    if (st && lenis) return lenis.scrollTo(st.start + ((st.end - st.start) * next) / (n - 1), { duration: 1.2 })
    if (next === active) return
    navigator.vibrate?.(8)
    setActive(next)
  }

  // Phones and tablets: swipe the notes sideways to change project. Vertical
  // drags are left alone (touch-action: pan-y), so the page still scrolls.
  const swipeHandlers = {
    onPointerDown: (e) => { swipe.current = { x: e.clientX, y: e.clientY } },
    onPointerCancel: () => { swipe.current = null },
    onPointerUp: (e) => {
      const start = swipe.current
      swipe.current = null
      if (!start || trigger.current) return
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) goTo(active + (dx < 0 ? 1 : -1))
    },
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
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                  <motion.div
                    key={p.slug}
                    className="phone__swap"
                    custom={dir}
                    variants={screenSwap}
                    initial="enter"
                    animate="show"
                    exit="leave"
                  >
                    <Demo />
                  </motion.div>
                </AnimatePresence>
              </Phone>
              <Dock active={active} onPick={goTo} />
              <div className="work__live">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <LiveButton p={p} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="work__hint">{site.phoneHint} <kbd>←</kbd><kbd>→</kbd></p>
            </div>
            <div className="work__viewport" {...swipeHandlers}>
              <div className="work__track">
                {projects.map((proj, i) => <Notes key={proj.slug} p={proj} i={i} active={i === active} />)}
              </div>
            </div>
            <div className="work__bar" aria-hidden="true"><i /></div>
          </div>
        </div>
      )}
    </section>
  )
}
