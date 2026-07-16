// scripts/fix-palette.mjs — a treia trecere.
// Brief sectiunea 2: zero culori hardcodate in componente, zero mov, zero emoji.
// Butoane pline lila -> pastila cu contur auriu (clasa .pill-btn din globals).

import fs from 'fs'
import path from 'path'
const ROOT = path.resolve(import.meta.dirname, '..')
const SKIP = new Set(['node_modules', '.next', '.git', 'scripts', 'public'])

const files = []
;(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(js|css)$/.test(e.name)) files.push(p)
  }
})(ROOT)

// ── valori mov hardcodate -> tokeni de aur/apa ──
const COLOR = [
  [/rgba\(124,\s*92,\s*191,\s*0?\.\d+\)/g, 'var(--gold-faint)'],
  [/rgba\(124,\s*92,\s*191\)/g, 'var(--gold)'],
  [/#7C5CBF/gi, 'var(--gold)'],
  [/#9d7cd6/gi, 'var(--gold)'],
  [/#a892e8/gi, 'var(--gold)'],
  [/#4A3280/gi, 'var(--gold-deep)'],
  [/#F0EBFF/gi, 'var(--gold-faint)'],
  // cardul Gandului Zilei avea gradient mov propriu — devine adancime de apa
  [/linear-gradient\(135deg,\s*#1a1a2e 0%,\s*#2d1b4e 100%\)/g,
   'linear-gradient(135deg, var(--water-deep) 0%, var(--water-plum) 100%)'],
  [/#1a1a2e/gi, 'var(--water-deep)'],
  [/#2d1b4e/gi, 'var(--water-plum)'],
]

// ── emoji din dictionar si etichete ──
const EMOJI_TXT = [
  ['🪞 ', ''], ['🧭 ', ''], ['✓ ', ''], ['↓ ', ''], ['✦ ', ''],
  ['🔥 ', ''], ['🌍 ', ''], ['🔒 ', ''], ['⚡ ', ''], ['🛡 ', ''],
  ['🌱 ', ''], ['⚠ ', ''], ['✕ ', ''], ['📜 ', ''], ['📔 ', ''],
  ['📓 ', ''], ['🔍 ', ''], ['⭕ ', ''], ['⚙ ', ''],
]

let touched = 0, colorFixes = 0, emojiFixes = 0
for (const f of files) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/')
  let s = fs.readFileSync(f, 'utf8')
  const orig = s

  for (const [re, to] of COLOR) {
    const before = s
    s = s.replace(re, to)
    if (s !== before) colorFixes++
  }
  // emoji doar in siruri de text (dictionare/etichete)
  for (const [a, b] of EMOJI_TXT) {
    if (s.includes("'" + a) || s.includes('"' + a) || s.includes('>' + a)) {
      const before = s
      s = s.split("'" + a).join("'" + b).split('"' + a).join('"' + b).split('>' + a).join('>' + b)
      if (s !== before) emojiFixes++
    }
  }
  if (s !== orig) { fs.writeFileSync(f, s, 'utf8'); touched++; }
}
console.log(`fisiere atinse: ${touched} | inlocuiri culoare: ${colorFixes} | inlocuiri emoji: ${emojiFixes}`)
