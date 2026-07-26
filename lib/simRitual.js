'use client'

// Forțare manuală a ritualului afișat pe Azi (dimineață/seară), pentru
// verificare (secț. QA) — doar client-side, localStorage. Nu deblochează
// nimic plătit, doar schimbă care ritual se arată — exact ce face deja
// butonul "Mergi la dimineața/seara asta" de pe Azi, dar persistat între
// reîncărcări, ca să nu trebuiască apăsat de fiecare dată.

export function getForcedRitual() {
  if (typeof window === 'undefined') return null
  // Punctul 2 (audit 27.07, runda 6): unealta de simulare era livrata si in
  // productie — oricine putea forta ritualul din consola. Ramane activa doar
  // in afara productiei (acelasi tipar ca in ServiceWorker.js).
  if (process.env.NODE_ENV === 'production') return null
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
