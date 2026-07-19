'use client'

// Simulare de zi-a-săptămânii pentru testare (secț. QA) — DOAR client-side,
// localStorage. Nu e o gaură de securitate: ziua săptămânii nu blochează
// nimic plătit, doar schimbă CE ritual se arată (sâmbătă/duminică), lucru pe
// care oricine și l-ar putea falsifica oricum schimbând ceasul telefonului.
// Vârsta contului (z14/z30/z60) e separată și server-verificată — vezi app/qa.

export function getEffectiveWeekday() {
  if (typeof window === 'undefined') return new Date().getDay()
  try {
    const sim = localStorage.getItem('sim_weekday')
    if (sim !== null && sim !== '') return parseInt(sim, 10)
  } catch (e) {}
  return new Date().getDay()
}

export function setSimWeekday(day) {
  try {
    if (day === null || day === undefined) {
      localStorage.removeItem('sim_weekday')
    } else {
      localStorage.setItem('sim_weekday', String(day))
    }
  } catch (e) {}
}
