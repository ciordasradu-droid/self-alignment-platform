// lib/lexiconGate.js — B1 (25.07): poarta lexicala ieftina, zero apeluri de
// model. Verifica fiecare sectiune a profilului cu expresii regulate pentru
// tiparele deja interzise in prompt (shadow, litere A/B, cifre brute de
// mecanism, scapari de engleza in non-EN). DOAR sectiunile care pica intra
// in a doua trecere (proofread) — pe un profil curat, a doua trecere nu se
// mai apeleaza deloc, taind din cele ~105s de asteptare.
//
// Limitare cunoscuta: verbele-comanda (should/need to/trebuie) si starile
// negative numite (resentment/frustrare) nu sunt verificate aici — variaza
// prea mult intre cele 11 limbi ca sa fie prinse fiabil cu regex simplu.
// Raman acoperite doar de prompt-ul de generare + auto-verificarea modelului.

const SHADOW_WORDS = /\b(shadow|umbra|sombra|ombre|schatten|ombra|schaduw|cień|árnyék|тень)\b/i
const LETTER_LABELS = /(^|[\s(])[ab]\)\s/i
const RAW_NUMBER_TUPLE = /\(\d+\/\d+\s*\|\s*\d+\/\d+\)/
const REQUIRED_LEAK = /^REQUIRED\s*[—-]/i

// cuvinte englezesti comune, pentru a detecta scapari intr-un text non-EN
const COMMON_ENGLISH = /\b(the|and|you|your|this|that|with|from|about|because|which|their|there|would|should|could)\b/i

function collectStrings(value, acc) {
  if (typeof value === 'string') { acc.push(value); return }
  if (Array.isArray(value)) { value.forEach(v => collectStrings(v, acc)); return }
  if (value && typeof value === 'object') { Object.values(value).forEach(v => collectStrings(v, acc)) }
}

function checkText(text, language) {
  if (SHADOW_WORDS.test(text)) return true
  if (LETTER_LABELS.test(text)) return true
  if (RAW_NUMBER_TUPLE.test(text)) return true
  if (REQUIRED_LEAK.test(text)) return true
  if (language !== 'en' && text.length > 20 && COMMON_ENGLISH.test(text)) return true
  return false
}

// Verifica fiecare cheie de top-nivel a sectiunilor profilului separat.
// Returneaza { failing: {cheie: valoare, ...}, clean: bool }
export function findFailingSections(sections, language = 'en') {
  const failing = {}
  for (const [key, value] of Object.entries(sections || {})) {
    const strings = []
    collectStrings(value, strings)
    if (strings.some(s => checkText(s, language))) {
      failing[key] = value
    }
  }
  return { failing, clean: Object.keys(failing).length === 0 }
}
