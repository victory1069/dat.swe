import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, CalendarDays, Home, Wallet } from 'lucide-react'

const newCode = () => String(Math.floor(100000 + Math.random() * 900000))
const ROTATE_MS = 6000
const team = [
  { name: 'Kemi', role: 'Design', free: true },
  { name: 'Tunde', role: 'Eng lead', free: false },
  { name: 'Ifeoma', role: 'Design', free: true },
]
const screen = { initial: { opacity: 0, x: 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -18 }, transition: { duration: 0.25 } }

function CheckIn() {
  const [code, setCode] = useState(newCode)
  const [done, setDone] = useState(null)
  useEffect(() => {
    if (done) return
    const id = setInterval(() => setCode(newCode()), ROTATE_MS)
    return () => clearInterval(id)
  }, [done])

  const checkIn = () => {
    const now = new Date()
    setDone(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' }).format(now))
  }

  return (
    <motion.div {...screen} className="q-pad">
      <p className="q-muted">Good morning</p>
      <h3 className="q-h">Ada Okafor</h3>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="code" {...screen}>
            <div className="q-card">
              <p className="q-label">Lekki office · code on the front-desk screen</p>
              <div className="q-code">
                <AnimatePresence mode="popLayout">
                  <motion.span key={code} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
                    {code.slice(0, 3)} {code.slice(3)}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="q-timer"><span key={code} style={{ animationDuration: `${ROTATE_MS}ms` }} /></div>
              <p className="q-fine">The code changes every few seconds, so it only works if you’re in the building.</p>
            </div>
            <button className="q-btn" onClick={checkIn}>Check in with {code}</button>
          </motion.div>
        ) : (
          <motion.div key="done" {...screen} className="q-card q-done">
            <motion.span className="q-tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
              <Check size={28} strokeWidth={3} />
            </motion.span>
            <p className="q-h">Checked in at {done}</p>
            <p className="q-muted">Lekki office. Have a good day.</p>
            <button className="q-link" onClick={() => setDone(null)}>Reset demo</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Leave() {
  const [type, setType] = useState('Annual')
  const [cover, setCover] = useState(null)
  const [sent, setSent] = useState(false)
  if (sent) {
    return (
      <motion.div {...screen} className="q-pad">
        <div className="q-card q-done">
          <span className="q-tick"><Check size={28} strokeWidth={3} /></span>
          <p className="q-h">Request sent</p>
          <p className="q-muted">{type} leave, Mon 19 – Wed 21. Tunde approves it. {cover} is covering.</p>
          <button className="q-link" onClick={() => { setSent(false); setCover(null) }}>Reset demo</button>
        </div>
      </motion.div>
    )
  }
  return (
    <motion.div {...screen} className="q-pad">
      <h3 className="q-h">Request leave</h3>
      <p className="q-label">Type · 14 annual days left</p>
      <div className="q-row">
        {['Annual', 'Sick', 'Study'].map((t) => (
          <button key={t} className="q-chip" aria-pressed={type === t} onClick={() => setType(t)}>{t}</button>
        ))}
      </div>
      <p className="q-label">Dates</p>
      <div className="q-card q-dates"><CalendarDays size={16} /> Mon 19 – Wed 21 Oct · 3 days</div>
      <p className="q-label">Who’s covering?</p>
      <div className="q-people">
        {team.map((p) => (
          <button key={p.name} className="q-person" disabled={!p.free} aria-pressed={cover === p.name} onClick={() => setCover(p.name)}>
            <span className="q-avatar">{p.name[0]}</span>
            <span><b>{p.name}</b><small>{p.free ? p.role : 'Also off these days'}</small></span>
          </button>
        ))}
      </div>
      <button className="q-btn" disabled={!cover} onClick={() => setSent(true)}>{cover ? 'Send request' : 'Pick someone to cover'}</button>
    </motion.div>
  )
}

function Payslip() {
  return (
    <motion.div {...screen} className="q-pad">
      <h3 className="q-h">September payslip</h3>
      <div className="q-card">
        <p className="q-label">Net pay</p>
        <p className="q-big">₦485,200</p>
        {[['Basic', '₦420,000'], ['Housing', '₦110,000'], ['Transport', '₦45,000'], ['PAYE', '−₦62,300'], ['Pension', '−₦27,500']].map(([k, v]) => (
          <div key={k} className="q-line"><span>{k}</span><span>{v}</span></div>
        ))}
      </div>
    </motion.div>
  )
}

export default function QuantiDemo() {
  const [tab, setTab] = useState('home')
  return (
    <div className="demo demo--quanti">
      <div className="q-body" data-lenis-prevent>
        <AnimatePresence mode="wait">
          {tab === 'home' && <CheckIn key="home" />}
          {tab === 'leave' && <Leave key="leave" />}
          {tab === 'pay' && <Payslip key="pay" />}
        </AnimatePresence>
      </div>
      <nav className="q-tabs">
        {[['home', Home, 'Check in'], ['leave', CalendarDays, 'Leave'], ['pay', Wallet, 'Payslip']].map(([id, Icon, label]) => (
          <button key={id} aria-pressed={tab === id} onClick={() => setTab(id)}><Icon size={18} />{label}</button>
        ))}
      </nav>
    </div>
  )
}
