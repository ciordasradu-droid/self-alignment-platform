// Ziua aplicatiei se termina la 03:33, nu la miezul noptii (decizie inchisa,
// calup arhitectura 30.07, punctul 0.3 — inlocuieste cutoff-ul de 04:00 din
// runda 6) — cine isi face bucla de seara dupa miezul noptii nu trebuie s-o
// piarda din ziua care tocmai s-a incheiat. O SINGURA functie, folosita peste
// tot (alegerea ritualului in interfata + /api/dashboard + /api/ritual) — nu
// trei implementari care se potrivesc din intamplare (runda 6, punctul 1).
//
// Serverul (Vercel) ruleaza in UTC; fusul real e al omului, nu al serverului
// — de-asta orice apel de aici ia un offset explicit
// (Date.prototype.getTimezoneOffset(), trimis de client) in loc sa presupuna
// fusul mediului in care ruleaza codul.

export const LOGICAL_DAY_CUTOFF_MINUTES = 3 * 60 + 33 // 03:33
// Pastrat pentru compatibilitate cu orice cod/comentariu care citeste ora
// intreaga de cutoff — valoarea reala e cea in minute, de mai sus.
export const LOGICAL_DAY_CUTOFF_HOURS = LOGICAL_DAY_CUTOFF_MINUTES / 60

// Fereastra ritualului de dimineata se INCHIDE ferm la 15:33 (0.3) — dupa ora
// asta ritualul de dimineata nu mai poate fi inceput, indiferent ce s-a
// intamplat pana atunci. Intre 15:33 si ora serii (17:00, mod-noapte
// existent, neschimbat) e fereastra de mijloc: doar Gandul Zilei + O
// Respiratie, fara ritual de scris.
export const MORNING_WINDOW_CLOSE_MINUTES = 15 * 60 + 33 // 15:33
export const EVENING_START_HOUR = 17 // ora serii, neschimbata (mod-noapte existent)

function shiftedLogical(epochMs, tzOffsetMinutes = 0) {
  const localMs = epochMs - tzOffsetMinutes * 60000
  return new Date(localMs - LOGICAL_DAY_CUTOFF_MINUTES * 60000)
}

// 'YYYY-MM-DD' — ziua logica a unui moment dat, in fusul cu offset-ul dat.
// Un check-in la 02:00 pe 27 apartine zilei de 26 (inainte de cutoff-ul 03:33).
export function getLogicalDay(epochMs, tzOffsetMinutes = 0) {
  const d = shiftedLogical(epochMs, tzOffsetMinutes)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

// 0-23 — ora DIN ZIUA LOGICA (0 = exact ora de cutoff, 03:33 pe ceas).
export function getLogicalHour(epochMs, tzOffsetMinutes = 0) {
  return shiftedLogical(epochMs, tzOffsetMinutes).getUTCHours()
}

// Client-side: fusul lui, de trimis la orice ruta care calculeaza ziua
// logica (serverul insusi ruleaza in UTC, nu-l poate ghici).
export function clientTzOffset() {
  return new Date().getTimezoneOffset()
}

// Fereastra ritualului potrivita momentului curent — SINGURA sursa pentru
// alegerea asta (0.3): 'morning' 03:33-15:33 · 'midday' 15:33-ora serii ·
// 'evening' de la ora serii (mod-noapte existent, ora reala, nu logica —
// se intinde peste miezul noptii pana la cutoff-ul zilei urmatoare).
export function getRitualWindow(epochMs, tzOffsetMinutes = 0) {
  const localMs = epochMs - tzOffsetMinutes * 60000
  const local = new Date(localMs)
  const minuteOfDay = local.getUTCHours() * 60 + local.getUTCMinutes()
  if (minuteOfDay >= EVENING_START_HOUR * 60 || minuteOfDay < LOGICAL_DAY_CUTOFF_MINUTES) return 'evening'
  if (minuteOfDay < MORNING_WINDOW_CLOSE_MINUTES) return 'morning'
  return 'midday'
}
