// sect. F (brief 25.07 noapte): poarta lexicală pentru tot copy-ul nou din
// "Ritmul zilei" — întrebarea buclei (EveningMirror), invitația sferei
// (BreathingSphere), întrebările de sâmbătă (MorningAnchor), eticheta
// sunetului (SettingsDrawer). Prag 0: imperative în text, priming negativ,
// "check-in" netradus, semne de exclamare.
import fs from 'fs'

const LANGS = ['en', 'ro', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'hu', 'ru']

function extractObjectLiteral(src, constName) {
  const re = new RegExp(`const ${constName} = (\\{[\\s\\S]*?\\n\\})\\n`)
  const m = src.match(re)
  if (!m) throw new Error(`nu am gasit ${constName}`)
  // eslint-disable-next-line no-eval
  return eval('(' + m[1] + ')')
}

const NEGATIVE_PRIMING = /tensiune (in|în) piept|nod (in|în) g[aâ]t|str[aâ]ngere de stomac|gol (in|în) stomac|tightness in (your|my) chest|knot in (your|my) stomach|resentiment\w*|frustrare\w*|am[aă]r[aă]ciune\w*|resentment\b|frustration\b|bitterness\b/i

// Verbe-comanda tipice, ca prim cuvant (aceeasi euristica redusa ca la
// test-subscribe-copy.mjs — vezi acel fisier pentru motivul excluderilor).
// Nota: "para" (PT/ES) exclus deliberat — coliza cu prepozitia foarte comuna
// "para" ("for"), vezi gasit empiric mai jos.
const IMPERATIVE_STARTERS = /^(start|try|get|discover|unlock|join|subscribe|click|download|claim|hurry|generate|write|choose|stop|avoid|make sure|begin|scrie|alege|opreste|evita|asigura-te|incepe|escribe|elige|detente|asegurate|empieza|ecris|choisis|arrete|evite|assure-toi|commence|schreib|wahle|hor auf|vermeide|stell sicher|beginne|scrivi|scegli|fermati|assicurati|inizia|escreve|escolhe|certifica-te|comeca|schrijf|kies|vermijd|zorg ervoor|begin|napisz|wybierz|przestan|unikaj|upewnij sie|zacznij|irj|valassz|allj meg|keruld el|gyozodj meg|kezdd|napishi|vyberi|ostanovis|izbegai|ubedis|nachni)\b/i

let totalIssues = 0

function check(label, lang, text, { skipImperative = false } = {}) {
  const issues = []
  if (text.includes('!')) issues.push(`[exclamare] ${label}: "${text}"`)
  if (/check-?in/i.test(text)) issues.push(`[check-in netradus] ${label}: "${text}"`)
  if (NEGATIVE_PRIMING.test(text)) issues.push(`[priming negativ] ${label}: "${text}"`)
  if (!skipImperative) {
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      if (IMPERATIVE_STARTERS.test(sentence.trim())) issues.push(`[imperativ] ${label}: "${sentence.trim()}"`)
    }
  }
  if (issues.length) {
    console.log(`  [FAIL] ${lang} — ${issues.join(' | ')}`)
    totalIssues += issues.length
  }
  return issues.length === 0
}

console.log('=== Poarta lexicala — copy nou "Ritmul zilei" (25.07 noapte), toate 11 limbi ===\n')

// 1. EveningMirror — loopQuestion
console.log('--- EveningMirror: loopQuestion ---')
{
  const src = fs.readFileSync('app/dashboard/components/EveningMirror.js', 'utf8')
  const L = extractObjectLiteral(src, 'L')
  let clean = true
  for (const lang of LANGS) {
    const text = L[lang]?.loopQuestion?.replace('{intention}', 'X')
    if (!text) { console.log(`  [FAIL] ${lang} — loopQuestion lipsa`); clean = false; continue }
    if (!check('loopQuestion', lang, text)) clean = false
  }
  if (clean) console.log('  [OK] toate 11 limbi curate')
}

// 2. BreathingSphere — invite
console.log('\n--- BreathingSphere: invite ---')
{
  const src = fs.readFileSync('app/dashboard/components/BreathingSphere.js', 'utf8')
  const L = extractObjectLiteral(src, 'L')
  let clean = true
  for (const lang of LANGS) {
    const text = L[lang]?.invite
    if (!text) { console.log(`  [FAIL] ${lang} — invite lipsa`); clean = false; continue }
    if (!check('invite', lang, text)) clean = false
  }
  if (clean) console.log('  [OK] toate 11 limbi curate')
}

// 3. MorningAnchor — weekQ1/2/3, weekPh1/2/3
console.log('\n--- MorningAnchor: weekQ1/2/3, weekPh1/2/3 ---')
{
  const src = fs.readFileSync('app/dashboard/components/MorningAnchor.js', 'utf8')
  const L = extractObjectLiteral(src, 'L')
  let clean = true
  for (const lang of LANGS) {
    const o = L[lang]
    if (!o?.weekQ1 || !o?.weekQ2 || !o?.weekQ3 || !o?.weekPh1 || !o?.weekPh2 || !o?.weekPh3) {
      console.log(`  [FAIL] ${lang} — camp lipsa`); clean = false; continue
    }
    for (const key of ['weekQ1', 'weekQ2', 'weekQ3', 'weekPh1', 'weekPh2', 'weekPh3']) {
      if (!check(key, lang, o[key], { skipImperative: key.startsWith('weekPh') })) clean = false
    }
  }
  if (clean) console.log('  [OK] toate 11 limbi curate')
}

// 4. SettingsDrawer — SOUND_LABEL
console.log('\n--- SettingsDrawer: SOUND_LABEL ---')
{
  const src = fs.readFileSync('app/components/SettingsDrawer.js', 'utf8')
  const SOUND_LABEL = extractObjectLiteral(src, 'SOUND_LABEL')
  let clean = true
  for (const lang of LANGS) {
    const text = SOUND_LABEL[lang]
    if (!text) { console.log(`  [FAIL] ${lang} — eticheta lipsa`); clean = false; continue }
    if (!check('SOUND_LABEL', lang, text)) clean = false
  }
  if (clean) console.log('  [OK] toate 11 limbi curate')
}

console.log(`\n=== REZULTAT: ${totalIssues === 0 ? 'CURAT — tot copy-ul nou trece poarta' : `${totalIssues} PROBLEME gasite (prag 0)`} ===`)
process.exit(totalIssues === 0 ? 0 : 1)
