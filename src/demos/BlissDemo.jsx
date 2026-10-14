import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MapPin, Search, X } from 'lucide-react'

// Made-up listings: the demo shows the interaction, not real venues.
const listings = [
  { name: 'Sundown on Nine', kind: 'Rooftop bar', area: 'Island', spot: 'Victoria Island', day: 'Fri', price: 8000, tags: ['rooftop', 'drinks'] },
  { name: 'Afrobeats Brunch', kind: 'Brunch party', area: 'Island', spot: 'Lekki Phase 1', day: 'Sat', price: 25000, tags: ['brunch', 'music'] },
  { name: 'The Terrace at Ikoyi', kind: 'Rooftop lounge', area: 'Island', spot: 'Ikoyi', day: 'Fri', price: 45000, tags: ['rooftop', 'dinner'] },
  { name: 'Suya Street Night', kind: 'Food market', area: 'Mainland', spot: 'Yaba', day: 'Fri', price: 5000, tags: ['food', 'cheap'] },
  { name: 'Comedy Underground', kind: 'Stand-up', area: 'Mainland', spot: 'Ikeja GRA', day: 'Thu', price: 12000, tags: ['comedy'] },
  { name: 'Lagoon Sunset Cruise', kind: 'Boat party', area: 'Island', spot: 'Victoria Island', day: 'Sat', price: 60000, tags: ['boat', 'music'] },
  { name: 'Jazz on the Roof', kind: 'Live music', area: 'Mainland', spot: 'Surulere', day: 'Fri', price: 10000, tags: ['rooftop', 'music'] },
]
const EXAMPLE = 'cheap rooftop on the Island this Friday'
const naira = (n) => `₦${n.toLocaleString('en-NG')}`

// A tiny stand-in for the real search: it reads area, budget, day and vibe
// out of a plain sentence.
function parse(q) {
  const s = q.toLowerCase()
  const f = {}
  if (/\bisland\b|\bvi\b|lekki|ikoyi/.test(s)) f.area = 'Island'
  if (/mainland|yaba|ikeja|surulere/.test(s)) f.area = 'Mainland'
  if (/cheap|budget|under/.test(s)) f.max = 15000
  const day = { fri: 'Fri', sat: 'Sat', thu: 'Thu' }
  for (const [k, v] of Object.entries(day)) if (s.includes(k)) f.day = v
  for (const tag of ['rooftop', 'brunch', 'comedy', 'food', 'music', 'boat']) if (s.includes(tag)) f.tag = tag
  return f
}

export default function BlissDemo() {
  const [area, setArea] = useState('All')
  const [query, setQuery] = useState('')
  const f = useMemo(() => parse(query), [query])

  const results = listings.filter((l) => {
    const a = f.area || (area === 'All' ? null : area)
    return (!a || l.area === a) && (!f.max || l.price <= f.max) && (!f.day || l.day === f.day) && (!f.tag || l.tags.includes(f.tag))
  })

  return (
    <div className="demo demo--bliss">
      <div className="b-head">
        <p className="b-kicker"><MapPin size={12} /> Lagos · tonight</p>
        <h3 className="b-title">What’s on</h3>
        <label className="b-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask in plain English…" aria-label="Search" />
          {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
        </label>
        {!query ? (
          <button className="b-suggest" onClick={() => setQuery(EXAMPLE)}>Try “{EXAMPLE}”</button>
        ) : (
          <p className="b-understood">
            {[f.tag, f.max && `under ${naira(f.max)}`, f.area, f.day].filter(Boolean).join(' · ') || 'Showing everything'}
          </p>
        )}
        {!query && (
          <div className="b-chips">
            {['All', 'Island', 'Mainland'].map((a) => (
              <button key={a} aria-pressed={area === a} onClick={() => setArea(a)}>{a}</button>
            ))}
          </div>
        )}
      </div>
      <motion.ul layout className="b-list" data-lenis-prevent>
        <AnimatePresence initial={false}>
          {results.map((l) => (
            <motion.li layout key={l.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="b-item">
              <div className="b-thumb" data-tag={l.tags[0]} />
              <div>
                <p className="b-name">{l.name}</p>
                <p className="b-meta">{l.kind} · {l.spot}</p>
                <p className="b-meta"><span className="b-day">{l.day}</span> {naira(l.price)}</p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        {results.length === 0 && <li className="b-empty">Nothing matches yet. Try another night.</li>}
      </motion.ul>
    </div>
  )
}
