import { useEffect, useState } from 'react'

function useClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(id)
  }, [])
  return time
}

// A phone shell. The screen is whatever you put inside; `tone` decides
// whether the status bar is drawn dark-on-light or light-on-dark.
export default function Phone({ children, tone = 'light', className = '' }) {
  const time = useClock()
  return (
    <div className={`phone ${className}`} data-cursor="tap">
      <div className="phone__screen" data-tone={tone}>
        <div className="phone__status" aria-hidden="true">
          <span>{time}</span>
          <span className="phone__island" />
          <span className="phone__icons">
            <svg width="17" height="11" viewBox="0 0 17 11"><g fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></g></svg>
            <svg width="25" height="12" viewBox="0 0 25 12"><rect x=".5" y=".5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor"/><rect x="23" y="4" width="1.5" height="4" rx=".75" fill="currentColor" opacity=".4"/></svg>
          </span>
        </div>
        <div className="phone__app">{children}</div>
        <div className="phone__home" aria-hidden="true" />
      </div>
    </div>
  )
}
