// scripts/fix-copy.mjs — curatare de copy, rulata o data.
// Master decizia 1: scorul nu exista, nicaieri, niciodata.
// Master decizia 4: consecventa ingheata — nu "serii" care se pierd.
// Brief sectiunea 2: zero emoji.
// TODO (sesiunea de texte cu Fable/Alex): formularile de mai jos sunt varianta
// simpla conforma tonului, nu cizelate.

import fs from 'fs'
import path from 'path'
const ROOT = path.resolve(import.meta.dirname, '..')

// „Serii, scor si responsabilitate blanda" -> fara scor, fara pierdere.
const FEATURE_LINE = {
  en: ['Streaks, score, and gentle accountability', 'Presence held gently, without scores'],
  ro: ['Serii, scor și responsabilitate blândă', 'Prezență ținută blând, fără scoruri'],
  es: ['Rachas, puntuación y responsabilidad amable', 'Presencia sostenida con suavidad, sin puntuaciones'],
  fr: ['Séries, score et responsabilité douce', 'Présence tenue avec douceur, sans scores'],
  de: ['Streaks, Punktzahl und sanfte Verbindlichkeit', 'Präsenz, sanft gehalten, ohne Punkte'],
  it: ['Serie, punteggio e responsabilità gentile', 'Presenza tenuta con gentilezza, senza punteggi'],
  pt: ['Sequências, pontuação e responsabilidade gentil', 'Presença mantida com suavidade, sem pontuações'],
  nl: ['Reeksen, score en zachte verantwoordelijkheid', 'Aanwezigheid, zacht vastgehouden, zonder scores'],
  pl: ['Serie, wynik i łagodna odpowiedzialność', 'Obecność trzymana łagodnie, bez wyników'],
  hu: ['Sorozatok, pontszám és szelíd elszámoltathatóság', 'Jelenlét, szelíden megtartva, pontszámok nélkül'],
}

let report = []

// ── lib/landing.js ──
{
  const p = path.join(ROOT, 'lib/landing.js')
  let s = fs.readFileSync(p, 'utf8')
  for (const [lang, [from, to]] of Object.entries(FEATURE_LINE)) {
    if (s.includes(from)) { s = s.split(from).join(to); report.push(`landing ${lang}: scor scos`) }
  }
  // emoji din garantie (scut) — brief: zero emoji
  const before = s
  s = s.replace(/'\u{1F6E1}️? ?/gu, "'").replace(/\u{1F6E1}️? ?/gu, '')
  if (s !== before) report.push('landing: scut scos din garantie')
  fs.writeFileSync(p, s, 'utf8')
}

// ── app/subscribe/page.js — lista de functii ──
{
  const p = path.join(ROOT, 'app/subscribe/page.js')
  let s = fs.readFileSync(p, 'utf8')

  // Functiile listate nu mai exista in produs: scorul (decizia 1), alertele de
  // umbra (decizia 2), modul de recalibrare (scos din dashboard). Lista trebuie
  // sa spuna adevarul despre ce primeste omul.
  const EN = `    features: [
      { text: 'Daily alignment check-in — 2 minutes' },
      { text: 'Daily personalized insight — generated from your profile' },
      { text: 'Weekly reset — every Monday morning' },
      { text: 'Presence held gently, without scores' },
      { text: 'Weekly review — reflect and reset' },
      { text: 'Patterns — what is emerging in your journey' },
      { text: 'Personal year phase — always in context' },
      { text: 'Available in 10 languages' },
    ],`
  const RO = `    features: [
      { text: 'Check-in zilnic de aliniere — 2 minute' },
      { text: 'Gândul zilnic personalizat — generat din profilul tău' },
      { text: 'Reset săptămânal — în fiecare luni dimineața' },
      { text: 'Prezență ținută blând, fără scoruri' },
      { text: 'Revizuire săptămânală — reflectează și resetează' },
      { text: 'Tipare — ce se conturează în drumul tău' },
      { text: 'Faza anului personal — mereu în context' },
      { text: 'Disponibil în 10 limbi' },
    ],`

  // inlocuim ambele blocuri `features: [...]` (en, apoi ro)
  const re = /    features: \[\n(?:.*\n)*?    \],/g
  const blocks = s.match(re) || []
  if (blocks.length >= 2) {
    s = s.replace(blocks[0], EN).replace(blocks[1], RO)
    report.push('subscribe: lista de functii rescrisa (fara scor, fara umbra, fara recalibrare)')
  } else {
    report.push('subscribe: NU am gasit blocurile features (' + blocks.length + ')')
  }

  // emoji din badge-ul de garantie
  s = s.replace(/\u{1F6E1}️? ?/gu, '')
  fs.writeFileSync(p, s, 'utf8')
}

report.forEach(r => console.log('  ' + r))
