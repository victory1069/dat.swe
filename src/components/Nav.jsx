import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../data/content'
import { useLenis } from '../lib/smooth'
import { DMark, Wordmark } from './Brand'

export default function Nav() {
  const lenis = useLenis()
  const { pathname } = useLocation()
  const toWork = (e) => {
    if (pathname !== '/') return
    e.preventDefault()
    lenis?.scrollTo('#work', { duration: 1.6 })
  }
  return (
    <header className="nav">
      <Link to="/" className="nav__mark" aria-label={`${site.name}, home`}>
        <DMark className="nav__d" /> <Wordmark />
      </Link>
      <nav className="nav__links">
        <Link to="/#work" onClick={toWork}>Work</Link>
        <NavLink to="/about">About</NavLink>
        <a href={site.cv} target="_blank" rel="noreferrer">CV ↗</a>
      </nav>
    </header>
  )
}
