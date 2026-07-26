'use client'

// Suprascriere de durata pentru sfera care respira, DOAR pentru verificare
// (sect. QA) — acelasi tipar ca lib/simRitual.js / lib/simWeekday.js.
// DOAR client-side, localStorage. Nu schimba nimic platit, doar scurteaza
// durata sesiunii ca sa poata fi verificat finalul natural (arata intentia)
// fara sa se astepte 3-5 minute reale.

export function getBreathDurationOverrideMs() {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem('sim_breath_ms')
    const n = v ? parseInt(v, 10) : NaN
    return Number.isFinite(n) && n > 0 ? n : null
  } catch (e) { return null }
}

export function setBreathDurationOverrideMs(ms) {
  try {
    if (ms) localStorage.setItem('sim_breath_ms', String(ms))
    else localStorage.removeItem('sim_breath_ms')
  } catch (e) {}
}
