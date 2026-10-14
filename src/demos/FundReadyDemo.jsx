import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion } from 'motion/react'
import { AlertTriangle, ArrowRight } from 'lucide-react'

const questions = [
  {
    module: 'Traction', n: 4,
    q: 'Do customers pay you today?',
    options: [['Yes, every month', 90], ['Yes, but one-off', 60], ['Not yet', 25]],
    flag: 'No paying customers yet. Investors will ask what proves people want this.',
  },
  {
    module: 'Economics', n: 5,
    q: 'How many months can you run without new money?',
    options: [['More than 12', 85], ['6 to 12', 60], ['Less than 6', 30]],
    flag: 'Under six months of runway. You’ll be raising from a weak position.',
  },
  {
    module: 'Compliance', n: 7,
    q: 'Is the company registered, with filings up to date?',
    options: [['Yes, all current', 90], ['Registered, filings behind', 45], ['Not registered', 15]],
    flag: 'Filings are behind. This comes up in the first week of diligence.',
  },
]
const preset = [['Company', 78], ['Market', 70], ['Product', 74], ['Team', 66], ['The raise', 58]]
const screen = { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.28 } }

function Score({ to }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const c = animate(0, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [to])
  return <span>{n}</span>
}

export default function FundReadyDemo() {
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState([])

  const answer = (score) => {
    setAnswers([...answers, score])
    setStep(step + 1)
  }
  const reset = () => { setAnswers([]); setStep(-1) }

  const done = step >= questions.length
  const areas = [...preset, ...questions.map((q, i) => [q.module, answers[i] ?? 0])]
  const total = done ? Math.round(areas.reduce((s, [, v]) => s + v, 0) / areas.length) : 0
  const worst = done ? answers.indexOf(Math.min(...answers)) : -1

  return (
    <div className="demo demo--fund">
      <AnimatePresence mode="wait">
        {step === -1 && (
          <motion.div key="intro" {...screen} className="f-pad f-intro">
            <p className="f-kicker">FundReady AI</p>
            <h3 className="f-h">Is your business ready for investors?</h3>
            <p className="f-muted">The full interview has eight modules. This is three questions from it.</p>
            <button className="f-btn" onClick={() => setStep(0)}>Start <ArrowRight size={16} /></button>
          </motion.div>
        )}
        {step >= 0 && !done && (
          <motion.div key={step} {...screen} className="f-pad">
            <div className="f-progress"><span style={{ width: `${(questions[step].n / 8) * 100}%` }} /></div>
            <p className="f-kicker">Module {questions[step].n} of 8 · {questions[step].module}</p>
            <h3 className="f-h">{questions[step].q}</h3>
            <div className="f-options">
              {questions[step].options.map(([label, score]) => (
                <button key={label} onClick={() => answer(score)}>{label}</button>
              ))}
            </div>
          </motion.div>
        )}
        {done && (
          <motion.div key="report" {...screen} className="f-pad" data-lenis-prevent>
            <p className="f-kicker">Your report</p>
            <div className="f-score">
              <p className="f-num"><Score to={total} /><small>/100</small></p>
              <p className="f-muted">{total >= 70 ? 'Nearly there. Fix the flag below before you pitch.' : 'Not yet. You have work to do before you pitch, and here is where to start.'}</p>
            </div>
            <div className="f-flag">
              <AlertTriangle size={16} />
              <p><b>Red flag · {questions[worst].module}</b>{questions[worst].flag}</p>
            </div>
            <ul className="f-bars">
              {areas.map(([name, v], i) => (
                <li key={name}>
                  <span>{name}</span>
                  <span className="f-bar"><motion.i initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ delay: 0.3 + i * 0.06, duration: 0.8 }} data-low={v < 50} /></span>
                </li>
              ))}
            </ul>
            <button className="f-link" onClick={reset}>Start again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
