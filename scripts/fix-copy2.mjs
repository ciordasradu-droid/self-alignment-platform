// scripts/fix-copy2.mjs — a doua trecere: subscribe + landing (fr/de/nl).
import fs from 'fs'
import path from 'path'
const ROOT = path.resolve(import.meta.dirname, '..')

const sub = path.join(ROOT, 'app/subscribe/page.js')
let s = fs.readFileSync(sub, 'utf8')

// Lista de functii spunea lucruri care nu exista / sunt interzise:
// scorul (decizia 1), alertele de umbra (decizia 2), modul de recalibrare
// (scos din dashboard), streak-ul ca urmarire (decizia 4). Si emoji (brief 2).
const REPL = [
  // EN
  [`      { icon: '◎', text: 'Daily alignment check-in — 2 minutes' },`, `      { text: 'Daily alignment check-in — 2 minutes' },`],
  [`      { icon: '✦', text: 'Daily personalized insight — generated from your profile' },`, `      { text: 'Daily personalized insight — generated from your profile' },`],
  [`      { icon: '◎', text: 'Weekly reset — every Monday morning' },`, `      { text: 'Weekly reset — every Monday morning' },`],
  [`      { icon: '⚡', text: 'Personal alignment score — updated daily' },`, `      { text: 'Presence held gently, without scores' },`],
  [`      { icon: '⟳', text: 'Streak tracking — build real consistency' },`, ``],
  [`      { icon: '🪞', text: 'Weekly review — reflect and reset' },`, `      { text: 'Weekly review — reflect and reset' },`],
  [`      { icon: '◦', text: 'Shadow alerts — pattern detection' },`, `      { text: 'Patterns — what is emerging in your journey' },`],
  [`      { icon: '🧭', text: 'Recalibration mode — when you drift' },`, ``],
  [`      { icon: '✦', text: 'Personal year phase — always in context' },`, `      { text: 'Personal year phase — always in context' },`],
  [`      { icon: '🌍', text: 'Available in 10 languages' },`, `      { text: 'Available in 10 languages' },`],
  // RO
  [`      { icon: '◎', text: 'Check-in zilnic de aliniere — 2 minute' },`, `      { text: 'Check-in zilnic de aliniere — 2 minute' },`],
  [`      { icon: '✦', text: 'Gândul zilnic personalizat — generat din profilul tău' },`, `      { text: 'Gândul zilnic personalizat — generat din profilul tău' },`],
  [`      { icon: '◎', text: 'Reset săptămânal — în fiecare luni dimineața' },`, `      { text: 'Reset săptămânal — în fiecare luni dimineața' },`],
  [`      { icon: '⚡', text: 'Scor personal de aliniere — actualizat zilnic' },`, `      { text: 'Prezență ținută blând, fără scoruri' },`],
  [`      { icon: '⟳', text: 'Urmărirea streak-ului — construiește consecvență reală' },`, ``],
  [`      { icon: '🪞', text: 'Revizuire săptămânală — reflectează și resetează' },`, `      { text: 'Revizuire săptămânală — reflectează și resetează' },`],
  [`      { icon: '◦', text: 'Alerte de umbră — detectarea tiparelor' },`, `      { text: 'Tipare — ce se conturează în drumul tău' },`],
  [`      { icon: '🧭', text: 'Mod de recalibrare — când deviezi' },`, ``],
  [`      { icon: '✦', text: 'Faza anului personal — mereu în context' },`, `      { text: 'Faza anului personal — mereu în context' },`],
  [`      { icon: '🌍', text: 'Disponibil în 10 limbi' },`, `      { text: 'Disponibil în 10 limbi' },`],
]
let n = 0
for (const [a, b] of REPL) {
  if (s.includes(a)) { s = s.split(a).join(b); n++ }
  else console.log('  NEGASIT:', a.trim().slice(0, 50))
}
// randurile golite raman ca linii goale -> le stergem
s = s.replace(/\r?\n\s*\r?\n(\s*\{ text:)/g, '\n$1')
// nu mai exista f.icon
s = s.replace(/\s*<span style=\{\{color:'var\(--purple\)', marginRight:'10px', fontSize:'16px'\}\}>\{f\.icon\}<\/span>\r?\n/, '\n')
fs.writeFileSync(sub, s, 'utf8')
console.log('subscribe: ' + n + ' randuri reparate')

// ── landing: fr/de/nl ramase ──
const land = path.join(ROOT, 'lib/landing.js')
let l = fs.readFileSync(land, 'utf8')
const L2 = [
  ['Séries, score et responsabilité bienveillante', 'Présence tenue avec douceur, sans scores'],
  ['Streaks, Punktzahl und sanfte Verantwortlichkeit', 'Präsenz, sanft gehalten, ohne Punkte'],
  ['Reeksen, score en zachte verantwoordelijkheid', 'Aanwezigheid, zacht vastgehouden, zonder scores'],
]
for (const [a, b] of L2) if (l.includes(a)) { l = l.split(a).join(b); console.log('  landing: ' + a.slice(0, 28) + ' -> reparat') }
fs.writeFileSync(land, l, 'utf8')
