// scripts/find-violations.mjs
// Vaneaza incalcarile deciziilor blocate din Master: emoji in UI, cuvantul
// "scor" in orice limba, culori mov hardcodate. Rulabil oricand:
//   node scripts/find-violations.mjs

import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SKIP = new Set(['node_modules', '.next', '.git', 'scripts', 'public'])

// Emoji pictografice. Sagetile (→) si simbolurile geometrice subtiri (✦ ◦ ▲)
// nu sunt emoji — sunt tipografie; le tratam separat.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2190}-\u{21FF}]/gu
const KEEP = new Set(['→', '←', '↗', '↻', '·', '—', '✦', '◦', '▲', '♥', '◎', '⟳'])

// "scor" in cele 10 limbi (Master decizia 1: nicaieri, niciodata)
const SCORE = /\b(scor|scoruri|score|scores|puntuaci[oó]n|puntaje|note?\b|punkt|punkte|punteggio|pontua[cç][aã]o|wynik|pontsz[aá]m|scorul)\b/i
const PURPLE = /#7C5CBF|#9d7cd6|#a892e8|#4A3280|#F0EBFF|rgba\(124,\s*92,\s*191|purple|violet|lila/i

const files = []
;(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(js|css|json)$/.test(e.name) && !e.name.endsWith('.OLD.js')) files.push(p)
  }
})(ROOT)

const out = { emoji: [], score: [], purple: [] }
for (const f of files) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/')
  const lines = fs.readFileSync(f, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|--)/.test(line)) return          // comentarii: nu sunt UI
    const em = [...(line.match(EMOJI) || [])].filter(c => !KEEP.has(c))
    if (em.length) out.emoji.push(`${rel}:${i + 1}  ${[...new Set(em)].join(' ')}  ${line.trim().slice(0, 60)}`)
    if (SCORE.test(line) && !/score:\s*0|score,|\.score|score\b.*NOT NULL/i.test(line))
      out.score.push(`${rel}:${i + 1}  ${line.trim().slice(0, 70)}`)
    if (PURPLE.test(line) && !/--purple/.test(line))
      out.purple.push(`${rel}:${i + 1}  ${line.trim().slice(0, 60)}`)
  })
}

for (const [k, v] of Object.entries(out)) {
  console.log(`\n=== ${k.toUpperCase()} — ${v.length} ===`)
  v.slice(0, 40).forEach(l => console.log('  ' + l))
  if (v.length > 40) console.log(`  … si inca ${v.length - 40}`)
}
const total = out.emoji.length + out.score.length + out.purple.length
console.log(`\nTOTAL incalcari: ${total}`)
process.exit(total ? 1 : 0)
