'use client'

// ─────────────────────────────────────────────────────────────
// PREFERINȚA GLOBALĂ „SUNETUL APEI" (sect. E, 25.07 noapte).
// Salvată în localStorage ('water_sound'). OPRIT implicit — pornește
// doar dacă omul alege explicit. Aceeași convenție ca lib/language.js:
// citire/scriere prin un mic store + eveniment global, fără context React.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'water_sound'

export function getSoundPref() {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on'
  } catch (e) {
    return false
  }
}

export function setSoundPref(on) {
  try { localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off') } catch (e) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('water-sound-change'))
  }
}

// Hook React: const [soundOn, setSound] = useSoundPref()
export function useSoundPref() {
  const [on, setOn] = useState(false)

  useEffect(() => {
    setOn(getSoundPref())
    const handler = () => setOn(getSoundPref())
    window.addEventListener('water-sound-change', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('water-sound-change', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const change = useCallback((v) => { setSoundPref(v) }, [])

  return [on, change]
}
