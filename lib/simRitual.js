'use client'

// Forțare manuală a ritualului afișat pe Azi (dimineață/seară), pentru
// verificare (secț. QA) — doar client-side, localStorage. Nu deblochează
// nimic plătit, doar schimbă care ritual se arată — exact ce face deja
// butonul "Mergi la dimineața/seara asta" de pe Azi, dar persistat între
// reîncărcări, ca să nu trebuiască apăsat de fiecare dată.

export function getForcedRitual() {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem('sim_ritual')
    return v === 'morning' || v === 'evening' ? v : null
  } catch (e) { return null }
}

export function setForcedRitual(value) {
  try {
    if (value === 'morning' || value === 'evening') {
      localStorage.setItem('sim_ritual', value)
    } else {
      localStorage.removeItem('sim_ritual')
    }
  } catch (e) {}
}
