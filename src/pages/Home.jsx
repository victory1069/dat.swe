import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Work from '../components/Work'
import { Experience } from '../components/Sections'
import { ScrubText } from '../components/ui'
import { site } from '../data/content'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={site.marquee} />
      <section className="statement">
        <ScrubText className="statement__text">{site.statement}</ScrubText>
      </section>
      <Work />
      <Experience />
    </>
  )
}
