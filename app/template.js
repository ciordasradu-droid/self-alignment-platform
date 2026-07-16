'use client'

// LEGEA 3 — navigarea între ecrane curge. template.js se re-montează la
// fiecare schimbare de rută, deci fiecare ecran intră prin dizolvare fluidă,
// ca mișcarea prin apă. Fără tăieturi seci.

export default function Template({ children }) {
  return <div className="flow-in">{children}</div>
}
