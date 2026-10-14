import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

// The site on a phone, one section per swipe.
const slides = [
  { kicker: 'The Bridge Pitch', title: ['Connect to Capital.', 'Secure Grants.', 'Scale Globally.'], cta: 'Apply to pitch' },
  { kicker: 'What it is', body: 'A network that puts high-growth founders in front of grant-makers, private equity and venture capital, and gets them ready before they walk in.' },
  { kicker: 'Four pillars', list: ['Monthly grants', 'Private equity access', 'Global VC network', 'FundReady AI intake'] },
  { kicker: 'How it works', steps: ['Apply', 'Get audited by FundReady AI', 'Pitch to the room', 'Close the round'] },
  { kicker: 'Ready?', title: ['Your next round', 'starts with one pitch.'], cta: 'Apply now' },
]

function Mark() {
  // Arch, deck and piers, after the brand's unit grid.
  return (
    <svg viewBox="0 0 90 70" width="34" height="26" aria-hidden="true">
      <path d="M5.5 51 Q45 -10 84.5 51" fill="none" stroke="var(--br-signal)" strokeWidth="11" />
      <rect x="0" y="40" width="90" height="11" fill="currentColor" />
      <rect x="18" y="51" width="11" height="19" fill="currentColor" />
      <rect x="61" y="51" width="11" height="19" fill="currentColor" />
    </svg>
  )
}

export default function BridgeDemo() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const go = (n) => {
    if (n < 0 || n >= slides.length) return
    setDir(n > i ? 1 : -1)
    setI(n)
  }
  const s = slides[i]

  return (
    <div className="demo demo--bridge">
      <div className="br-nav"><Mark /><span>The Bridge Pitch</span></div>
      <div className="br-stage">
        <AnimatePresence custom={dir} mode="popLayout" initial={false}>
          <motion.section
            key={i}
            custom={dir}
            className="br-slide"
            initial={{ x: `${dir * 100}%`, opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: `${dir * -100}%`, opacity: 0.4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) go(i + 1)
              else if (info.offset.x > 50) go(i - 1)
            }}
          >
            <p className="br-kicker">{s.kicker}</p>
            {s.title && <h3 className="br-title">{s.title.map((l) => <span key={l}>{l}</span>)}</h3>}
            {s.body && <p className="br-body">{s.body}</p>}
            {s.list && <ul className="br-list">{s.list.map((l, n) => <li key={l}><b>0{n + 1}</b>{l}</li>)}</ul>}
            {s.steps && <ol className="br-steps">{s.steps.map((l) => <li key={l}>{l}</li>)}</ol>}
            {s.cta && <button className="br-cta" onClick={() => go(i === slides.length - 1 ? 0 : i + 1)}>{s.cta} →</button>}
          </motion.section>
        </AnimatePresence>
      </div>
      <div className="br-dots">
        {slides.map((_, n) => (
          <button key={n} aria-label={`Section ${n + 1}`} aria-current={n === i} onClick={() => go(n)} />
        ))}
      </div>
      <p className="br-hint">Swipe</p>
    </div>
  )
}
