'use client'

// INTERACTION LAYER — jumătatea 2D a pasului 5 (fără video, fără three.js).
// Ripple la orice atingere, global, peste toată aplicația (legea 2): inele
// eliptice moi + glow, 300-450ms, prefers-reduced-motion → static (fără
// mișcare, doar un semnal scurt). Lacrima 3D (three.js, interactivă) rămâne
// izolată pe Azi, la pasul ei — asta e doar feedback-ul tactil universal.
//
// Refolosește waterState (deja avea addRipple/pruneRipples, gândit pentru
// scena three.js de dinainte de WaterVideoLayer) — acum are, în sfârșit,
// un randor vizual 2D, nu doar magazia de date.

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { waterState, useRipple } from './waterState'

export default function InteractionLayer() {
  const [mounted, setMounted] = useState(false)
  const [ripples, setRipples] = useState([])

  useRipple() // ascultă orice atingere din document, global (legea 2)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const sync = () => setRipples([...waterState.get().ripples])
    const unsub = waterState.subscribe(sync)
    // curăță periodic undele stinse — notify() se declanșează doar la
    // adăugare, nu doar pentru că a trecut timpul.
    const interval = setInterval(() => {
      waterState.pruneRipples(performance.now() / 1000)
      sync()
    }, 500)
    return () => { unsub(); clearInterval(interval) }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div id="water-ripples" aria-hidden="true">
      {ripples.map((r) => (
        <span
          key={r.born}
          className="water-ripple"
          style={{ left: `${r.x * 100}%`, top: `${(1 - r.y) * 100}%` }}
        />
      ))}
    </div>,
    document.body
  )
}
