'use client'

// SUNETUL APEI (sect. E, 25.07 noapte) — un singur loop audio real de apă
// calmă, fără muzică, buclă perfectă, OPRIT implicit. Montat o singură
// dată în layout-ul rădăcină, lângă WaterVideoLayer — se oprește automat
// în fundal, la fel ca video-ul (aceeași ascultare de visibilitychange).
//
// ASSET LIPSĂ, DELIBERAT: fișierul audio real + licența lui nu există încă
// în repo (vezi public/audio/README.md). Componenta e completă și gata de
// folosire — doar sursa sonoră trebuie adăugată, cu aceeași disciplină ca
// la plăcile video (sursă comercial curată, licență documentată). Până
// atunci, elementul audio există dar nu are ce reda; comutatorul rămâne
// funcțional și vizibil (pregătit pentru asset), nu ascuns.

import { useEffect, useRef } from 'react'
import { useSoundPref } from '../../../lib/soundPref'

export default function WaterSoundLoop() {
  const [on] = useSoundPref()
  const ref = useRef(null)

  useEffect(() => {
    const a = ref.current
    if (!a) return
    if (on && !document.hidden) {
      a.play().catch(() => {})
    } else {
      a.pause()
    }
  }, [on])

  useEffect(() => {
    const onVis = () => {
      const a = ref.current
      if (!a) return
      if (document.hidden) {
        a.pause()
      } else if (on) {
        a.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [on])

  return (
    <audio
      ref={ref}
      loop
      preload="none"
      aria-hidden="true"
      src="/audio/water-loop.mp3"
    />
  )
}
