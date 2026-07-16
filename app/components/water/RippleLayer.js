'use client'

// LEGEA 2 — atingerea: feedback-ul universal al oricărui tap e un ripple pe apă.
// Montat o singură dată în layout, ascultă pe tot documentul. Nu trebuie
// adăugat pe fiecare buton — unda e limbajul tactil al întregii aplicații.

import { useEffect } from 'react'

export default function RippleLayer() {
  useEffect(() => {
    const host = document.getElementById('water-ripples')
    if (!host) return

    // Ripple-ul se naște unde atinge degetul. Mărimea variază puțin,
    // ca undele să nu pară ștampilate identic.
    const spawn = (x, y) => {
      const el = document.createElement('span')
      const size = 130 + Math.random() * 70
      el.className = 'water-ripple'
      el.style.left = x + 'px'
      el.style.top = y + 'px'
      el.style.width = size + 'px'
      el.style.height = size + 'px'
      host.appendChild(el)
      // curățăm după ce unda s-a stins
      setTimeout(() => el.remove(), 950)
    }

    const onDown = (e) => {
      // ignorăm scroll-ul cu rotița și tastatura
      if (e.clientX == null) return
      spawn(e.clientX, e.clientY)
    }

    document.addEventListener('pointerdown', onDown, { passive: true })
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  return <div id="water-ripples" aria-hidden="true" />
}
