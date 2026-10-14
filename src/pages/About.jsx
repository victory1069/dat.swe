import { about } from '../data/content'
import { Experience } from '../components/Sections'
import { FadeIn, Reveal, T, isReal } from '../components/ui'

export default function About() {
  return (
    <div className="about">
      <header className="about__head">
        <p className="eyebrow">About</p>
        <Reveal as="h1" className="about__title" trigger="load">I build the screen and the system behind it.</Reveal>
      </header>

      <div className="about__intro">
        <div className="about__photo"><T v={{ tbc: 'Photo (optional)' }} /></div>
        <div className="about__bio">
          {about.bio.map((b) => <Reveal as="p" key={b}>{b}</Reveal>)}
        </div>
      </div>

      <Experience detailed />

      <section className="about__section">
        <Reveal as="h2" className="eyebrow">Stack, by what it’s for</Reveal>
        <div className="about__stack">
          {about.stack.map((g) => (
            <FadeIn key={g.group} className="about__group">
              <h3>{g.group}</h3>
              <ul>{g.items.map((it, k) => <li key={k}>{isReal(it) ? it : <T v={it} />}</li>)}</ul>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="about__section">
        <Reveal as="h2" className="eyebrow">Design and community</Reveal>
        <ul className="about__community">
          {about.community.map((c) => (
            <li key={c.title + c.org}><b>{c.title}</b><span>{c.org}</span><span>{c.dates}</span></li>
          ))}
        </ul>
        <div className="about__graphics">
          {[1, 2, 3].map((k) => <div key={k}><T v={{ tbc: `Graphic ${k}` }} /></div>)}
        </div>
      </section>
    </div>
  )
}
