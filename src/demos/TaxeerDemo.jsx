import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'

// Due dates are set relative to today so the demo always has one overdue,
// one close and a few comfortable.
const start = [
  { id: 'paye', name: 'PAYE remittance', body: 'Lagos IRS', in: -4 },
  { id: 'vat', name: 'VAT return', body: 'FIRS', in: 7 },
  { id: 'wht', name: 'Withholding tax', body: 'FIRS', in: 26 },
  { id: 'cac', name: 'Annual return', body: 'CAC', in: 48 },
  { id: 'cit', name: 'Company income tax', body: 'FIRS', in: 120 },
]
const fmt = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(d)
}
const when = (n) => (n < 0 ? `${-n} days overdue` : n === 0 ? 'Due today' : `In ${n} days`)
const level = (items) =>
  items.some((i) => i.in < 0) ? 'red' : items.some((i) => i.in <= 14) ? 'amber' : 'green'
const copy = {
  red: ['Action needed', 'Something is overdue. Penalties are already adding up.'],
  amber: ['Something’s due soon', 'Nothing is late, but one filing is close.'],
  green: ['You’re in the clear', 'Nothing due in the next two weeks.'],
}

export default function TaxeerDemo() {
  const [items, setItems] = useState(start)
  const status = level(items)
  const next = items.slice(0, 3)

  return (
    <div className="demo demo--taxeer" data-status={status}>
      <p className="t-org">Ada Foods Ltd</p>
      <motion.div className="t-status" layout>
        <motion.span className="t-light" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5 }} key={status} />
        <div>
          <p className="t-status-title">{copy[status][0]}</p>
          <p className="t-status-body">{copy[status][1]}</p>
        </div>
      </motion.div>
      <p className="t-label">Next up</p>
      <ul className="t-list">
        <AnimatePresence initial={false} mode="popLayout">
          {next.map((i) => (
            <motion.li key={i.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }} className="t-item" data-late={i.in < 0} data-soon={i.in >= 0 && i.in <= 14}>
              <div>
                <p className="t-name">{i.name}</p>
                <p className="t-meta">{i.body} · {fmt(i.in)} · <b>{when(i.in)}</b></p>
              </div>
              <button onClick={() => setItems(items.filter((x) => x.id !== i.id))} aria-label={`Mark ${i.name} as filed`}>
                <Check size={14} strokeWidth={3} /> Filed
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
        {next.length === 0 && <li className="t-empty">All caught up.</li>}
      </ul>
      {items.length < start.length && <button className="t-reset" onClick={() => setItems(start)}>Reset demo</button>}
    </div>
  )
}
