import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { experience, site } from '../data/content'
import { gsap, reducedMotion } from '../lib/smooth'
import { Reveal, T, isReal } from './ui'

export function Experience({ detailed = false }) {
  return (
    <section className="exp">
      <Reveal as="h2" className="eyebrow">Experience</Reveal>
      <ul>
        {experience.map((e) => (
          <li key={e.company} className="exp__row">
            <span className="exp__company">{e.company}</span>
            <span className="exp__role">{e.role}</span>
            <span className="exp__dates">{e.dates}</span>
            {detailed && <span className="exp__detail"><T v={e.detail} /></span>}
          </li>
        ))}
      </ul>
    </section>
  )
}

// The footer sits underneath the page and is uncovered as the last section
// scrolls away, rather than scrolling up like everything else.
export function Footer() {
  const ref = useRef(null)
  useGSAP(() => {
    if (reducedMotion()) return
    gsap.from('.footer__big', {
      yPercent: 40, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
  }, { scope: ref })

  const email = isReal(site.email) ? site.email : null
  return (
    <footer className="footer" ref={ref}>
      <div className="footer__inner">
        <p className="eyebrow">Got a product that needs building?</p>
        <a className="footer__big" href={email ? `mailto:${email}` : undefined}>
          Let’s talk<span>↗</span>
        </a>
        <div className="footer__row">
          <span>{email ?? <T v={site.email} />}</span>
          <nav>
            <a href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
            <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
            <a href={site.cv} target="_blank" rel="noreferrer">CV <ArrowUpRight size={14} /></a>
          </nav>
          <span>© {new Date().getFullYear()} {site.name}</span>
        </div>
      </div>
    </footer>
  )
}
