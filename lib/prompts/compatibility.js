// Destinație: lib/prompts/compatibility.js  (FIȘIER NOU)
// Trei prompturi de compatibilitate (viață / prieten / afaceri), construite pe
// aceeași fundație de voce și terminologie ca profilul personal.
// Fără procent. Neutru/simetric (se dă share). Secțiunea de nevoi la cuplu e reciprocă.

import * as roTerms from './terminology/ro.js'
import * as enTerms from './terminology/en.js'
import * as esTerms from './terminology/es.js'
import * as frTerms from './terminology/fr.js'
import * as deTerms from './terminology/de.js'
import * as itTerms from './terminology/it.js'
import * as ptTerms from './terminology/pt.js'
import * as nlTerms from './terminology/nl.js'
import * as plTerms from './terminology/pl.js'
import * as huTerms from './terminology/hu.js'
import * as ruTerms from './terminology/ru.js'

const TERMINOLOGY = { ro: roTerms, en: enTerms, es: esTerms, fr: frTerms, de: deTerms, it: itTerms, pt: ptTerms, nl: nlTerms, pl: plTerms, hu: huTerms, ru: ruTerms }

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian', ru: 'Russian'
}

const VOICE_RULES = `
VOICE — applies to every sentence, every section, every language (this OUTRANKS fluency):
1. CLARITY OVER ELEGANCE. Common, everyday words. If a reader has to pause and ask "what does that mean?", the word is wrong.
2. PRECISION. The word that says EXACTLY what the data supports, not one that merely sounds good.
3. CONCRETE OVER ABSTRACT. Describe what the two people observably feel, do, or experience between them.
4. STYLE: contrast (this one / that one), plain words, short sentences with natural rhythm, points to self-observation, warm and direct — like a wise friend talking to both of them.
A plain, exact, concrete sentence always beats a polished but vague one.
`

const TERM_POLICY = `
TERMINOLOGY POLICY:
A) MECHANISM JARGON (Sacral, Ajna, centers, defined/undefined, not-self, bare "authority"): DO NOT use. Translate into lived experience.
B) VERIFIABLE ANCHORS (Gate 58, Life Path 7, Leo Sun, Profile 3/5): KEEP, but explain plainly beside them. In a relationship, the anchor is usually a CONTRAST ("your Life Path 7, which wants to understand, meets their Life Path 1, which wants to start"). Keep these light and readable — lean more on lived experience than on numbers.
`

function getTerminology(lang) { return TERMINOLOGY[lang] || TERMINOLOGY['en'] }

function buildTerminologyBlock(lang) {
  const terms = getTerminology(lang)
  const langName = LANGUAGE_NAMES[lang] || 'English'
  if (lang === 'en') return ''
  const typesList = Object.entries(terms.hdTerms.types).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  const strategiesList = Object.entries(terms.hdTerms.strategies).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  const authoritiesList = Object.entries(terms.hdTerms.authorities).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  const astroList = Object.entries(terms.astroTerms).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  const numList = Object.entries(terms.numerologyTerms).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  return `
===============================
${langName.toUpperCase()} TERMINOLOGY REFERENCE (translate everything using this glossary)
===============================
HUMAN DESIGN TYPES:
${typesList}
STRATEGIES:
${strategiesList}
AUTHORITIES:
${authoritiesList}
ASTROLOGY TERMS:
${astroList}
NUMEROLOGY TERMS:
${numList}
`
}

function personBlock(label, name, data) {
  const n = data.enriched?.numerology || data.numerology
  const a = data.enriched?.astrology || data.astrology
  const hd = data.enriched?.human_design
    ? { ...data.human_design, ...data.enriched.human_design }
    : data.human_design
  return `${label} — ${name}:
- Life Path: ${n.life_path} (${n.life_path_meaning})
- Expression: ${n.expression}, Soul Urge: ${n.soul_urge}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality}), Ruling planet: ${a.ruling_planet}
- Core traits: ${a.core_traits?.join(', ')}
- HD Type: ${hd.type}, Profile ${hd.profile}, Authority: ${hd.authority}
- Strategy (lived): ${hd.strategy_plain || hd.strategy}
- Off-track signal (lived): ${hd.not_self_theme_plain || ''}
- Energy (lived): ${hd.energy_type_plain || ''}
- Key gates: ${hd.key_gates?.join(', ') || ''}`
}

function commonIntro(nameA, nameB, langName, terminologyBlock, terms) {
  return `You are writing the profile of a RELATIONSHIP between ${nameA} and ${nameB}.

You are not describing two separate people — you describe what happens BETWEEN them. The dynamic is the subject, not the persons. Both will read this text, so write about the relationship as a third thing they share, never about one through the other's eyes.

Your voice: a wise friend who knows them both and tells them, warmly and honestly, how they work together — what flows, where they rub, and how to hold both sides without one snuffing out the other.
${VOICE_RULES}
${TERM_POLICY}
OBSERVATION BEFORE SOURCE: say what is seen in the relationship first, then where it comes from (a verifiable contrast — of signs, Life Paths, types — in lived terms). Never reverse.

FRICTION IS NOT A FLAW: where the two designs clash is the most useful part. Name the tension cleanly, without judging it, and always show how BOTH are held — not how one is chosen. A relationship is not fixed by picking a side.

ENTIRE OUTPUT IN ${langName.toUpperCase()} ONLY. No mixed languages.
${terminologyBlock}
${terms.grammarRules || ''}
JSON SAFETY: only straight quotes for structure. Inside text values, no curly/typographic quotes. Return ONLY valid JSON, no markdown.

Target length: around 1200-1500 words. Dense, not padded. Every sentence carries a specific observation both would recognize.`
}

// ─────────────────────────────────────────────
// TIP 1 — PARTENER DE VIAȚĂ
// ─────────────────────────────────────────────
function lifePartnerSchema(nameA, nameB) {
  return `{
  "archetype": {
    "name": "2-4 words for the dynamic between them. Warm, concrete, not mystical. Both should recognize themselves.",
    "description": "3-4 sentences. What kind of couple this is, the energy born when they are together, the central tension they navigate. Weave types (as lived experience) + a contrast of signs or Life Paths. End with something both would feel is true."
  },
  "ce_va_apropie": "4-5 sentences. What flows naturally between them — why they attract, what works effortlessly. Name the source in the data, in lived terms.",
  "unde_apare_frecarea": [
    { "tensiune": "Short name, 3-5 words", "cum_se_simte": "How it lives in daily life, concrete. 2 sentences.", "de_unde_vine": "Source in the two designs, lived terms. 1-2 sentences.", "cum_tineti_ambele": "How the tension is held without snuffing it — how both coexist. 2 sentences, practical." },
    "3-4 real frictions, each a true clash between the two charts."
  ],
  "de_ce_aveti_nevoie_unul_de_la_altul": {
    "${nameA}": "What ${nameA} needs from ${nameB} to feel seen and at ease — from A's design. 2-3 sentences, warm, concrete. Not a demand, a light on what nourishes them.",
    "${nameB}": "Same for ${nameB}, from B's design. 2-3 sentences.",
    "puntea": "One sentence linking the two needs — what understanding between them reconciles both."
  },
  "intimitate_si_spatiu": "3-4 sentences. How closeness and distance work between them — who needs more space, who more closeness, how it balances without one feeling rejected or smothered. From the two energy rhythms.",
  "cum_decideti_impreuna": "3-4 sentences. The couple's decision dynamic: who brings direction, who brings the check, where they stall when alike, how they complete each other. Practical.",
  "tipare_de_urmarit": [
    { "semn": "An early sign something is breaking between them.", "ce_se_intampla": "What is underneath, lived terms. 1-2 sentences.", "intoarcerea": "A concrete return gesture. Specific, not 'communicate more'." },
    "3 patterns, each from a different part of their dynamic."
  ]
}`
}

// ─────────────────────────────────────────────
// TIP 2 — PRIETEN
// ─────────────────────────────────────────────
function friendSchema() {
  return `{
  "archetype": {
    "name": "2-4 words for their friendship.",
    "description": "3-4 sentences. What kind of friendship this is, what is born when they are together, what makes it last or tests it."
  },
  "ce_va_apropie": "4-5 sentences. What pulls them together, why they seek each other, what they share effortlessly. Source in the data, lived terms.",
  "ce_fel_de_prietenie": "3-4 sentences. Intense or relaxed? Frequent or rare but deep? Hours of talk or comfortable silence? How this friendship looks in practice, from both designs. Important: some strong friendships are rare — say honestly what rhythm fits them.",
  "cum_va_incarcati": "3-4 sentences. How they affect each other's energy — does one lift the other, do they calm each other, or drain if too long together? When it is best to be together, when a pause is needed. From the energy rhythms.",
  "unde_apare_frecarea": [
    { "tensiune": "Short name, 3-5 words", "cum_se_simte": "How it lives. 2 sentences.", "de_unde_vine": "Source in designs, lived terms. 1-2 sentences.", "cum_tineti_ambele": "How both coexist without the friendship suffering. 2 sentences." },
    "2-3 real frictions."
  ],
  "cum_ramaneti_conectati": "3-4 sentences. How the friendship stays alive when life pulls them into different rhythms — what keeps it vivid even at distance or when they meet rarely. Practical, calibrated to how each works.",
  "tipare_de_urmarit": [
    { "semn": "A sign the friendship is cooling or tensing.", "ce_se_intampla": "What is underneath. 1-2 sentences.", "intoarcerea": "A concrete return gesture." },
    "2-3 patterns."
  ]
}`
}

// ─────────────────────────────────────────────
// TIP 3 — PARTENER DE AFACERI
// ─────────────────────────────────────────────
function businessSchema(nameA, nameB) {
  return `{
  "archetype": {
    "name": "2-4 words for their team.",
    "description": "3-4 sentences. What kind of team they form, the force born from their combination, the central tension to manage as partners."
  },
  "unde_va_completati": "4-5 sentences. What each brings that the other lacks, why they are stronger together than apart. Concrete, from the data.",
  "cum_impartiti_rolurile": {
    "${nameA}": "The role that fits ${nameA} by design — what they carry naturally, where they are at ease. 2-3 sentences.",
    "${nameB}": "Same for ${nameB}. 2-3 sentences.",
    "capcana": "One sentence: where they step on each other if roles are unclear — e.g. both want to decide, or neither wants execution."
  },
  "cum_decideti_impreuna": "3-4 sentences. How they decide as partners — who is fast, who needs time, how they avoid deadlock, who should have the last word on which kind of decision. Practical.",
  "risc_si_bani": "3-4 sentences. How they relate differently to risk and money — one bold, one cautious? How that balances or conflicts them. From the two designs.",
  "unde_apare_frecarea": [
    { "tensiune": "Short name, 3-5 words", "cum_se_simte": "How it lives in daily work. 2 sentences.", "de_unde_vine": "Source in designs, lived terms. 1-2 sentences.", "cum_tineti_ambele": "How both coexist without the business suffering. 2 sentences." },
    "3 real frictions."
  ],
  "ce_va_blocheaza": "3-4 sentences. What stops them advancing as a team — the pattern that repeats when they get stuck, and how to catch it early.",
  "tipare_de_urmarit": [
    { "semn": "An early sign of trouble in the partnership.", "ce_se_intampla": "What is underneath. 1-2 sentences.", "intoarcerea": "A concrete return gesture." },
    "2-3 patterns."
  ]
}`
}

const TYPE_FOCUS = {
  life: 'Focus: daily attraction and friction, intimacy and space, how big decisions are made together, and the reciprocal needs.',
  friend: 'Focus: what draws you together naturally, what kind of friendship it is (intense/relaxed, frequent/rare), how you charge or drain each other, how you stay connected across different rhythms.',
  business: 'Focus: how you decide and who carries what, where you complete or step on each other, risk and money differently, work rhythm, what blocks you as a team, roles by design.'
}

export function buildCompatibilityPrompt(dataA, dataB, nameA, nameB, type = 'life', language = 'en') {
  const langName = LANGUAGE_NAMES[language] || 'English'
  const terms = getTerminology(language)
  const terminologyBlock = buildTerminologyBlock(language)

  const intro = commonIntro(nameA, nameB, langName, terminologyBlock, terms)
  const focus = TYPE_FOCUS[type] || TYPE_FOCUS.life

  let schema
  if (type === 'friend') schema = friendSchema()
  else if (type === 'business') schema = businessSchema(nameA, nameB)
  else schema = lifePartnerSchema(nameA, nameB)

  return `${intro}

${focus}

===============================
PERSON DATA
===============================
${personBlock('PERSON A', nameA, dataA)}

${personBlock('PERSON B', nameB, dataB)}

===============================
OUTPUT FORMAT — RETURN ONLY VALID JSON
===============================
${schema}

Before output, verify silently: entire text in ${langName}; second person where natural; no machinery jargon; frictions are real clashes; "how both are held" never "who gives in"; JSON valid with no curly quotes. Fix issues silently.`
}

export const COMPATIBILITY_TYPES = ['life', 'friend', 'business']