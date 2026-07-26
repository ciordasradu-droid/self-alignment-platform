// Ziua aplicatiei se termina la 04:00, nu la miezul noptii (decizie inchisa,
// handoff sect. B.1) — cine isi face bucla de seara la 00:30 nu trebuie s-o
// piarda din ziua care tocmai s-a incheiat. O SINGURA functie, folosita peste
// tot (alegerea ritualului in interfata + /api/dashboard + /api/ritual) — nu
// trei implementari care se potrivesc din intamplare (runda 6, punctul 1).
//
// Serverul (Vercel) ruleaza in UTC; fusul real e al omului, nu al serverului
// — de-asta orice apel de aici ia un offset explicit
// (Date.prototype.getTimezoneOffset(), trimis de client) in loc sa presupuna
// fusul mediului in care ruleaza codul.

export const LOGICAL_DAY_CUTOFF_HOURS = 4

function shiftedLogical(epochMs, tzOffsetMinutes = 0) {
  const localMs = epochMs - tzOffsetMinutes * 60000
  return new Date(localMs - LOGICAL_DAY_CUTOFF_HOURS * 3600000)
}

// 'YYYY-MM-DD' — ziua logica a unui moment dat, in fusul cu offset-ul dat.
// Un check-in la 01:00 pe 27 apartine zilei de 26.
export function getLogicalDay(epochMs, tzOffsetMinutes = 0) {
  const d = shiftedLogical(epochMs, tzOffsetMinutes)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

// 0-23 — ora DIN ZIUA LOGICA (0 = exact ora de cutoff, 04:00 pe ceas;
// 20-23 = 00:00-03:59 pe ceas, inca "seara" zilei logice precedente).
export function getLogicalHour(epochMs, tzOffsetMinutes = 0) {
  return shiftedLogical(epochMs, tzOffsetMinutes).getUTCHours()
}

// Client-side: fusul lui, de trimis la orice ruta care calculeaza ziua
// logica (serverul insusi ruleaza in UTC, nu-l poate ghici).
export function clientTzOffset() {
  return new Date().getTimezoneOffset()
}
