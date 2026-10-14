import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/content'
import { demos } from '../demos'
import Phone from '../components/Phone'
import { LiveButton, Stack } from '../components/Work'
import { FadeIn, Reveal, T, isReal } from '../components/ui'

function Block({ title, children }) {
  return (
    <FadeIn as="section" className="cs__block">
      <h2 className="eyebrow">{title}</h2>
      <div className="cs__body">{children}</div>
    </FadeIn>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return <Navigate to="/" replace />
  const p = projects[i]
  const next = projects[(i + 1) % projects.length]
  const { Demo, tone } = demos[p.slug]

  return (
    <article className="cs" style={{ '--brand': p.brand.primary, '--brand-bg': p.brand.bg, '--brand-ink': p.brand.ink }}>
      <header className="cs__head">
        <p className="eyebrow">Case study · {String(i + 1).padStart(2, '0')}</p>
        <Reveal as="h1" className="cs__title" trigger="load" by="chars">{p.name}</Reveal>
        <Reveal as="p" className="cs__tagline" trigger="load" delay={0.3}>{p.tagline}</Reveal>
        <dl className="cs__meta">
          <div><dt>Role</dt><dd><T v={p.role} /> {p.roleNote && <T v={p.roleNote} />}</dd></div>
          <div><dt>Timeline</dt><dd><T v={p.timeline} /></dd></div>
          <div><dt>Stack</dt><dd><Stack items={p.stack} /></dd></div>
          <div>
            <dt>Links</dt>
            <dd className="cs__links">
              {isReal(p.live) ? <a href={p.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={14} /></a> : <T v={p.live} />}
              {isReal(p.repo) && <a href={p.repo} target="_blank" rel="noreferrer">Code <ArrowUpRight size={14} /></a>}
            </dd>
          </div>
        </dl>
        {(isReal(p.live) || isReal(p.repo)) && (
          <div className="cs__actions">
            <LiveButton p={p} />
            {isReal(p.repo) && <a className="btn" href={p.repo} target="_blank" rel="noreferrer">View code <ArrowUpRight size={16} /></a>}
          </div>
        )}
        {p.credit && <p className="cs__credit"><T v={p.credit} /></p>}
      </header>

      <div className="cs__grid">
        <div className="cs__text">
          <Block title="The problem"><p><T v={p.problem} /></p></Block>
          <Block title="What I built">{p.built.map((b, k) => <p key={k}><T v={b} /></p>)}</Block>
          <Block title="The hard part"><p><T v={p.hard} /></p>{p.hardNote && <p><T v={p.hardNote} /></p>}</Block>
          <Block title="Where it is now"><p><T v={p.status} /></p></Block>
          <Block title="What I’d do next"><p><T v={p.next} /></p></Block>
        </div>
        <aside className="cs__phone">
          <Phone tone={tone}><Demo /></Phone>
          <p className="work__hint">Try it. It’s the real flow, with made-up data.</p>
        </aside>
      </div>

      <Link to={`/work/${next.slug}`} className="cs__next" style={{ '--next': next.brand.primary }} data-cursor="view">
        <span className="eyebrow">Next project</span>
        <span className="cs__next-name">{next.name}</span>
      </Link>
    </article>
  )
}
