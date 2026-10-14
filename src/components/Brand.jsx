import { forwardRef } from 'react'

// The dat.swe mark, built from its proportions: a square whose right side is a
// semicircle, a hole 63.5% of its width, and a dot 34% of its width. Colours
// come from CSS variables (--d, --hole, --dot) so every brand variant is just
// a class. `dotRef` exposes the dot so the hero can make it look around.
export const DMark = forwardRef(function DMark({ className = '', dotRef, label }, ref) {
  return (
    <span ref={ref} className={`dmark ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <span className="dmark__hole">
        <span ref={dotRef} className="dmark__dot" />
      </span>
    </span>
  )
})

// "dat.swe" in mono, with the brand's rounded-square full stop.
export function Wordmark({ className = '' }) {
  return (
    <span className={`wordmark ${className}`} aria-label="dat.swe">
      {[...'dat'].map((c, i) => <span key={`a${i}`} aria-hidden="true">{c}</span>)}
      <span className="wordmark__dot" aria-hidden="true" />
      {[...'swe'].map((c, i) => <span key={`b${i}`} aria-hidden="true">{c}</span>)}
    </span>
  )
}
