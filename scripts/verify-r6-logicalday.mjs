// Runda 6, punctul 1 — teste unitare directe pe getLogicalDay/getLogicalHour,
// exact scenariile din testul de acceptare al lui Alex.
import { getLogicalDay, getLogicalHour, LOGICAL_DAY_CUTOFF_HOURS } from '../lib/logicalDay.js'

console.log('CUTOFF_HOURS:', LOGICAL_DAY_CUTOFF_HOURS)

function at(y, m, d, h, min, tzOffsetMinutes) {
  // construim un epoch ms care, interpretat CU offset-ul dat, reprezinta ora
  // locala data (simuland "ceasul sistemului" fara sa depindem de fusul
  // masinii care ruleaza testul).
  const utcMs = Date.UTC(y, m - 1, d, h, min) + tzOffsetMinutes * 60000
  return utcMs
}

// Fus Romania vara (UTC+3 => getTimezoneOffset() = -180)
const RO_TZ = -180

console.log('\n--- Romania, 27 iulie, diverse ore ---')
const cases = [
  { h: 1, min: 0, label: '01:00' },
  { h: 4, min: 30, label: '04:30' },
  { h: 3, min: 59, label: '03:59' },
  { h: 4, min: 1, label: '04:01' },
  { h: 0, min: 49, label: '00:49 (raportul initial al lui Alex)' },
]
for (const c of cases) {
  const ms = at(2026, 7, 27, c.h, c.min, RO_TZ)
  const day = getLogicalDay(ms, RO_TZ)
  const hour = getLogicalHour(ms, RO_TZ)
  const ritual = hour < 12 ? 'morning' : hour >= 17 ? 'evening' : '(fallback: today.morning ? evening : morning)'
  console.log(`${c.label} pe 27 iulie -> ziua logica: ${day}, ora logica: ${hour}, ritual: ${ritual}`)
}

console.log('\n--- verificare intr-un fus DIFERIT de server (UTC) ---')
// Server UTC (Vercel), om in Romania vara (UTC+3). La 01:00 ora Romaniei,
// serverul e la 22:00 UTC (ziua precedenta) — testam ca folosind offset-ul
// corect, ziua logica ramane cea vazuta de om, nu cea a serverului.
const msRoAt0100 = at(2026, 7, 27, 1, 0, RO_TZ)
console.log('epoch UTC pentru "27 iulie, 01:00 Romania":', new Date(msRoAt0100).toISOString())
console.log('ziua logica (cu tz Romania, -180):', getLogicalDay(msRoAt0100, RO_TZ))
console.log('ziua logica (GRESIT, cu tz server=0, ca inainte de fix):', getLogicalDay(msRoAt0100, 0))

console.log('\n--- divergenta reala: acelasi moment UTC, om diferit ---')
// intre 01:00 si 04:00 UTC, cutoff-ul de 04:00 local a trecut deja pentru
// cineva in Romania (+3h vara) dar NU inca pentru cineva pe UTC — exact
// fereastra in care ignorarea fusului ar da o zi logica GRESITA.
const fixedInstant = Date.parse('2026-07-27T02:00:00.000Z')
console.log('moment UTC fix:', new Date(fixedInstant).toISOString())
console.log('  vazut din Romania (offset -180, local 05:00) -> ziua logica:', getLogicalDay(fixedInstant, -180), '(asteptat: 2026-07-27, cutoff-ul a trecut)')
console.log('  vazut din UTC     (offset 0,    local 02:00) -> ziua logica:', getLogicalDay(fixedInstant, 0), '(asteptat: 2026-07-26, cutoff-ul NU a trecut inca)')

console.log('\nDONE')
