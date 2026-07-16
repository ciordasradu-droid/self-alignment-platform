// scripts/strip-emoji.mjs — unealta de curatare, rulata o data.
// Master decizia 9 + brief sectiunea 2: zero emoji in UI.
// Nu inlocuim cu alte decoratiuni: apa e limbajul vizual, nu pictogramele.

import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')

// pereche [cauta, inlocuieste]
const EDITS = [
  // ── landing: scala de fete = priming interzis (principiul 13) ──
  ['app/page.js', [
    [`                <div className="story-preview">
                  <div className="mock-rating" aria-hidden="true">
                    <div className="mock-rating-emoji"><span>\u{1F614}</span></div>
                    <div className="mock-rating-emoji"><span>\u{1F610}</span></div>
                    <div className="mock-rating-emoji"><span>\u{1F642}</span></div>
                    <div className="mock-rating-emoji active"><span>\u{1F60A}</span></div>
                    <div className="mock-rating-emoji"><span>\u{2728}</span></div>
                  </div>
                </div>`,
     `                <div className="story-preview">
                  {/* reprezentarea check-in-ului = apa, nu fete (principiul 13) */}
                  <div className="mock-water" aria-hidden="true">
                    <span className="mock-water-drop" />
                    <span className="mock-water-ring" />
                    <span className="mock-water-ring" />
                    <span className="mock-water-ring" />
                  </div>
                </div>`],
    // streak cu flacara + puncte care sugereaza pierdere -> prezenta care se aduna
    [`                <div className="story-preview">
                  <div className="mock-streak">
                    <div className="mock-streak-row">
                      <span className="mock-streak-num">12</span>
                      <span className="mock-streak-fire" aria-hidden="true">\u{1F525}</span>
                    </div>
                    <div className="mock-streak-dots">
                      <div className="mock-streak-dot filled" />
                      <div className="mock-streak-dot filled" />
                      <div className="mock-streak-dot filled" />
                      <div className="mock-streak-dot filled" />
                      <div className="mock-streak-dot filled" />
                      <div className="mock-streak-dot" />
                      <div className="mock-streak-dot" />
                    </div>
                  </div>
                </div>`,
     `                <div className="story-preview">
                  {/* prezenta se aduna, nu se pierde (decizia 4) */}
                  <div className="mock-water" aria-hidden="true">
                    <span className="mock-water-drop mock-water-drop-lit" />
                    <span className="mock-water-ring" />
                    <span className="mock-water-ring" />
                    <span className="mock-water-ring" />
                  </div>
                </div>`],
    [`<span className="mock-pillar"><span className="mock-pillar-icon">\u{25CE}</span> Human Design</span>`,
     `<span className="mock-pillar">Human Design</span>`],
    [`<span className="mock-pillar"><span className="mock-pillar-icon">\u{2726}</span> {lt(lang, 'pillar_astro')}</span>`,
     `<span className="mock-pillar">{lt(lang, 'pillar_astro')}</span>`],
    [`<span className="mock-pillar"><span className="mock-pillar-icon">\u{26A1}</span> {lt(lang, 'pillar_num')}</span>`,
     `<span className="mock-pillar">{lt(lang, 'pillar_num')}</span>`],
    [`              <div className="trust-indicator"><span className="trust-indicator-icon">\u{1F512}</span> {lt(lang, 'trust_private')}</div>
              <div className="trust-indicator"><span className="trust-indicator-icon">\u{26A1}</span> {lt(lang, 'trust_fast')}</div>
              <div className="trust-indicator"><span className="trust-indicator-icon">\u{1F30D}</span> {lt(lang, 'trust_langs')}</div>`,
     `              <div className="trust-indicator">{lt(lang, 'trust_private')}</div>
              <div className="trust-indicator">{lt(lang, 'trust_fast')}</div>
              <div className="trust-indicator">{lt(lang, 'trust_langs')}</div>`],
  ]],

  // ── harta drumului: fara pictograme, doar text ──
  ['app/dashboard/components/ProgressiveUnlock.js', [
    [`  { day: 0,  id: 'checkin',    icon: '\u{25CE}', label: 'Daily Check-in',        description:`,
     `  { day: 0,  id: 'checkin',    label: 'Daily Check-in',        description:`],
    [`  { day: 0,  id: 'insight',    icon: '\u{2726}', label: 'Daily Thought',         description:`,
     `  { day: 0,  id: 'insight',    label: 'Daily Thought',         description:`],
    [`  { day: 3,  id: 'journal',    icon: '\u{1F4D4}', label: 'Free Journal',          description:`,
     `  { day: 3,  id: 'journal',    label: 'Free Journal',          description:`],
    [`  { day: 7,  id: 'plan',       icon: '\u{1F9ED}', label: 'Alignment Plan',        description:`,
     `  { day: 7,  id: 'plan',       label: 'Alignment Plan',        description:`],
    [`  { day: 14, id: 'patterns',   icon: '\u{1F50D}', label: 'Patterns',             description:`,
     `  { day: 14, id: 'patterns',   label: 'Patterns',             description:`],
    [`  { day: 30, id: 'review',     icon: '\u{1FA9E}', label: 'Weekly Review',         description:`,
     `  { day: 30, id: 'review',     label: 'Weekly Review',         description:`],
    [`  { day: 60, id: 'commitment', icon: '\u{1F4DC}', label: 'Commitment With Yourself', description:`,
     `  { day: 60, id: 'commitment', label: 'Commitment With Yourself', description:`],
    [`  { day: 90, id: 'circle',     icon: '\u{2B55}', label: 'The Circle',            description:`,
     `  { day: 90, id: 'circle',     label: 'The Circle',            description:`],
  ]],

  ['app/dashboard/components/FreeJournal.js', [
    [`<span style={{ fontSize: '18px', marginRight: '8px' }}>\u{1F4D3}</span>`, ``],
    ['{saved ? `✓ ${t.saved}` : t.save}', '{saved ? t.saved : t.save}'],
  ]],

  ['app/dashboard/components/WeeklyReview.js', [
    ['\u{1FA9E} {t.tag}', '{t.tag}'],
  ]],

  ['app/compatibility/result/page.js', [
    [`<p style={s.private}>\u{1F512} {lx(langUsed,'private')}</p>`,
     `<p style={s.private}>{lx(langUsed,'private')}</p>`],
  ]],

  ['app/dashboard/components/MorningAnchor.js', [
    ['{/* poli: doar semnal vizual — mic/stins ↔ mare/cald. Zero cuvinte de stare. */}',
     '{/* poli: doar semnal vizual. Mic si stins la un capat, mare si cald la',
    ],
  ]],
]

let changed = 0, missed = []
for (const [rel, pairs] of EDITS) {
  const p = path.join(ROOT, rel)
  if (!fs.existsSync(p)) { missed.push(rel + ' (lipseste)'); continue }
  let src = fs.readFileSync(p, 'utf8')
  for (const [from, to] of pairs) {
    if (src.includes(from)) { src = src.split(from).join(to); changed++ }
    else missed.push(`${rel}: ${JSON.stringify(from.slice(0, 45))}`)
  }
  fs.writeFileSync(p, src, 'utf8')
}
console.log('inlocuiri aplicate:', changed)
if (missed.length) { console.log('NEGASITE:'); missed.forEach(m => console.log('  ' + m)) }
