// lib/prompts/profile.js

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

const TERMINOLOGY = { ro: roTerms, en: enTerms, es: esTerms, fr: frTerms, de: deTerms, it: itTerms, pt: ptTerms, nl: nlTerms, pl: plTerms, hu: huTerms }

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian'
}

function getTerminology(lang) {
  return TERMINOLOGY[lang] || TERMINOLOGY['en']
}

function buildTerminologyBlock(lang) {
  const terms = getTerminology(lang)
  const langName = LANGUAGE_NAMES[lang] || 'English'
  if (lang === 'en') return ''

  const typesList = Object.entries(terms.hdTerms.types).map(([en, t]) => `  - ${en} → ${t}`).join('\n')
  const strategiesList = Object.entries(terms.hdTerms.strategies).map(([en, t]) => `  - ${en} → ${t}`).join('\n')
  const authoritiesList = Object.entries(terms.hdTerms.authorities).map(([en, t]) => `  - ${en} → ${t}`).join('\n')
  const centersList = Object.entries(terms.hdTerms.centers).map(([en, t]) => `  - ${en} → ${t}`).join('\n')
  const miscList = Object.entries(terms.hdTerms.misc).map(([en, t]) => `  - ${en} → ${t}`).join('\n')
  const astroList = Object.entries(terms.astroTerms).map(([en, t]) => `  - ${en} → ${t}`).join('\n')
  const numList = Object.entries(terms.numerologyTerms).map(([en, t]) => `  - ${en} → ${t}`).join('\n')

  return `
═══════════════════════════════
${langName.toUpperCase()} TERMINOLOGY REFERENCE
(Reference data below may be in English — translate everything using this glossary before writing)
═══════════════════════════════

HUMAN DESIGN TYPES:
${typesList}

STRATEGIES:
${strategiesList}

AUTHORITIES:
${authoritiesList}

CENTERS:
${centersList}

OTHER HD TERMS:
${miscList}

ASTROLOGY TERMS:
${astroList}

NUMEROLOGY TERMS:
${numList}
`
}

export function buildProfilePrompt(calculatedData, fullName, language = 'en') {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const a  = enriched.astrology
  const hd = enriched.human_design
  const langName = LANGUAGE_NAMES[language] || 'English'
  const terms = getTerminology(language)
  const terminologyBlock = buildTerminologyBlock(language)

  const translatedType = terms.hdTerms.types[hd.type] || hd.type
  const translatedStrategy = terms.hdTerms.strategies[hd.strategy] || hd.strategy
  const translatedAuthority = terms.hdTerms.authorities[hd.authority] || hd.authority
  const translatedDefinedCenters = hd.defined_centers?.map(c => terms.hdTerms.centers[c] || c).join(', ') || 'none'
  const translatedUndefinedCenters = hd.undefined_centers?.map(c => terms.hdTerms.centers[c] || c).join(', ') || 'none'

  const keyGatesBlock = hd.key_gates?.join('\n') || ''
  const channelsBlock = hd.formed_channels?.length ? hd.formed_channels.join(', ') : 'no full channels formed'
  const allGatesBlock = hd.all_active_gates?.join(', ') || ''

  return `You are writing a personal profile for ${fullName}.

Your mission: make this person feel deeply understood — not analysed. Like an intelligent friend who has studied these systems would speak to them directly, with warmth and clarity. Not mystical. Not clinical. Not guru.

═══════════════════════════════
ABSOLUTE LANGUAGE RULE — READ FIRST
═══════════════════════════════

The ENTIRE output MUST be written exclusively in ${langName}. This is non-negotiable.

This includes ALL section content, ALL Human Design terminology, ALL astrology terminology, ALL numerology terminology, and ALL reference data passed below — translate everything before using it.

FORBIDDEN: mixing languages within a sentence, paragraph, or bullet. No English words inside ${langName} sentences. No Spanish, French, Italian, or any other language leaking in. Every output token must be in ${langName}.

SPECIFICALLY FORBIDDEN language leaks:
- Do NOT write "estrategia" (Spanish) — write the ${langName} equivalent
- Do NOT write "complacent" (English) — find the ${langName} equivalent
- Do NOT write "Wait to respond" in English inside a ${langName} sentence
- Do NOT write any Japanese, Chinese, or other non-Latin characters under any circumstances
- Do NOT invent words. If you are not certain a word exists in ${langName}, use a simpler known word instead.
${terminologyBlock}
${terms.grammarRules}
═══════════════════════════════
FACTUAL ACCURACY RULE — CRITICAL
═══════════════════════════════

NEVER invent Human Design facts. This is non-negotiable.

If you mention a specific gate number, channel number, or channel name, it MUST be one that is explicitly listed in the user's chart data below. Do not cite gate numbers, channel numbers, or channel names you are not certain about.

WRONG: "Your Channel of Power (23-8) activates..." — Channel 23-8 does not exist. You invented it.
RIGHT: Only reference channels that appear in "Formed channels" list below. If no channels are formed, say so in human terms without inventing channel names.

The same rule applies to gates: only cite gate numbers that appear in "Key gates" or "All active gates" below.

When in doubt, describe the theme or quality WITHOUT citing a specific gate or channel number. It is better to write a true general observation than a specific false one.

═══════════════════════════════
WRITING RULES
═══════════════════════════════

RULE 1 — Observation first, source second.
Structure every insight: first what you observe about this person (concrete, human), then — if useful — where you know this from in the data. Never the reverse.

RULE 2 — No technical term without immediate plain-language explanation.
Never use a Human Design, numerology, or astrology term without explaining it immediately in human language in the same paragraph.

RULE 3 — Tone: warm direct friend, not guru.
No "you have a profound mission of service." No "your soul demands." No mystical or formally therapeutic language.

RULE 4 — No mechanical translation from English.
Reformulate naturally in ${langName} as someone who speaks about this daily would say it.

RULE 5 — No numeric labels as subjects.
"Life Path 9", "Expression 4", "Soul Urge 1" do not appear as labels in text. Describe what they mean. Number in parentheses at end if useful.

RULE 6 — Mandatory concreteness.
Every observation must be testable in the person's life from yesterday or today. If a sentence fits anyone, cut it.

RULE 7 — Paragraphs, not bullet points.
Write text that reads like a letter about someone.

RULE 8 — Shadow for every strength.
Every strength has a reverse. Name it.

RULE 9 — Forbidden words (do not use these or their ${langName} equivalents):
"unique", "special", "journey", "resonates", "vibration", "frequency", "universe", "manifests", "aligned", "profound mission", "your soul".

═══════════════════════════════
SYSTEM BALANCE RULE — CRITICAL
═══════════════════════════════

This profile synthesizes THREE systems: Human Design, Astrology, and Numerology. Every major section MUST draw on all three.

Target distribution:
- Human Design insights: ~35-40%
- Astrology insights: ~30-35% (explain what sun sign, element, modality MEAN for daily experience)
- Numerology insights: ~25-30% (explain what each number FEELS LIKE in work, relationships, decisions)

BAD astrology: "Your Capricorn makes you disciplined."
GOOD astrology: "Your Sun in Capricorn — a cardinal earth sign ruled by Saturn — means your identity is built through discipline, responsibility, and tangible results. Unlike fire signs who act from enthusiasm, you need structure and measurable progress to feel on track."

BAD numerology: "Expression 4 — practical discipline."
GOOD numerology: "There is something in the way you work that needs order and solidity. You build things methodically, step by step, and feel most yourself when you can see concrete progress."

═══════════════════════════════
PROFILE DATA
═══════════════════════════════

NUMEROLOGY:
- Life path: ${n.life_path} — ${n.life_path_meaning}
- Expression number: ${n.expression} — ${n.expression_meaning}
- Soul urge: ${n.soul_urge} — ${n.soul_urge_meaning}
- Personality number: ${n.personality}
- Personal year: ${n.personal_year?.personal_year} of 9 — ${n.personal_year?.theme}
- Personal year focus: ${n.personal_year?.focus}
- Personal year warning: ${n.personal_year?.warning}

ASTROLOGY:
- Sun sign: ${a.sun_sign} (element: ${a.element} / modality: ${a.modality})
- Ruling planet: ${a.ruling_planet}
- Core traits: ${a.core_traits?.join(', ')}

HUMAN DESIGN (reference data may be in English — translate before using):
- Type: ${hd.type} → translate as: ${translatedType}
- Profile: ${hd.profile}
- Authority: ${hd.authority} → translate as: ${translatedAuthority}
- Strategy: ${hd.strategy} → translate as: ${translatedStrategy}
- Signature (how they feel when on their path): ${hd.signature}
- Warning signal (how they feel when off-track): ${hd.not_self_theme_plain}
- Energy description: ${hd.energy_type_plain}
- Work style: ${hd.work_style_plain}
- Incarnation cross: ${hd.incarnation_cross}
- Defined centers (translate each): ${translatedDefinedCenters}
- Undefined centers (translate each): ${translatedUndefinedCenters}
- Formed channels (ONLY reference these — do not invent others): ${channelsBlock}
- All active gates (ONLY reference these numbers — do not invent others): ${allGatesBlock}

KEY GATES (most important — explain each in human terms, fully translated):
${keyGatesBlock}

═══════════════════════════════
OUTPUT FORMAT
═══════════════════════════════

Return ONLY valid JSON, no markdown, no explanation.

{
  "blueprint": "3-4 sentences. Open with who this person fundamentally is — their energy type (HD, translated), what drives them deeply (life path), and the moment they are in now (personal year). Explain the 9-year cycle. Make it sound like the opening of a letter written specifically for them. Fully in ${langName}.",

  "strengths": [
    "2-3 sentence paragraph. First: concrete human observation — something they'd recognise from yesterday. Second: where this comes from in their data (only cite gates/channels that are actually in the data above). Third: when this strength shines brightest. Draw from a mix of HD, astrology, and numerology across the 5 strengths.",
    "Same format — 5 strengths total. Rotate systems.",
    "Third strength — draw from astrology or numerology",
    "Fourth strength",
    "Fifth strength"
  ],

  "vulnerabilities": [
    "2-3 sentence paragraph. Name patterns honestly. Explain which part of the data this comes from. End with one concrete thing they can do differently tomorrow.",
    "Same format — 4 vulnerabilities total. Mix systems.",
    "Third vulnerability",
    "Fourth vulnerability"
  ],

  "energy_patterns": [
    "Full paragraph about when energy is at maximum — why, what triggers it. Reference defined centers (explaining what they are).",
    "Full paragraph about when energy drops — why, warning signs, how to manage.",
    "Full paragraph about how the astrological element (${a.element}) shapes their daily energy rhythm.",
    "Full paragraph about what personal year ${n.personal_year?.personal_year} does to their energy right now."
  ],

  "sabotage_tendencies": [
    "Full paragraph — name a specific self-sabotage pattern, trace it to a gate or number (only ones in the data), explain what triggers it and the concrete exit.",
    "Same format — 4 patterns total",
    "Third pattern",
    "Fourth pattern"
  ],

  "decision_making": [
    "Full paragraph explaining their authority (${translatedAuthority}) in completely human language — how it feels in the body, how to use it practically, with a concrete daily example.",
    "Full paragraph about how soul urge ${n.soul_urge} (${n.soul_urge_meaning}) filters what they truly want versus what they think they should want.",
    "Full paragraph about the tension or harmony between their authority and ${a.sun_sign}."
  ],

  "work_discipline": [
    "Full paragraph about how this person works best — HD type, channels (only those in the data), what kind of work ignites their energy.",
    "Full paragraph about a specific gate from the data that shapes their approach to work — explain what that gate is.",
    "Full paragraph about what expression number ${n.expression} (${n.expression_meaning}) means professionally.",
    "Full paragraph about what personal year ${n.personal_year?.personal_year} means for their work right now."
  ],

  "opportunities": [
    "One full sentence from ASTROLOGY: where this person naturally magnetizes attention or success. Plain language, no technical codes.",
    "One full sentence from NUMEROLOGY: where their numbers say their gifts land with most impact. Plain language.",
    "One full sentence from HUMAN DESIGN: where their energetic design wants to be used. Plain language.",
    "One synthesis sentence combining two systems: a concrete opening available right now."
  ],

  "commitments": [
    "Written as 'I commit to...' in ${langName} — specific, personal, grounded in their design. 2-3 sentences.",
    "Written as 'I commit to...' — grounded in HD type and how they work best. 2-3 sentences.",
    "Written as 'I commit to...' — grounded in personal year ${n.personal_year?.personal_year} theme. 2-3 sentences."
  ],

  "glossary": {
    "intro": "One introductory sentence in ${langName} about understanding the terms behind the profile.",
    "terms": [
      { "term": "Life Path", "definition": "A number from your date of birth describing the central theme of your life." },
      { "term": "Expression Number", "definition": "From your full name at birth — describes how you naturally express yourself in the world." },
      { "term": "Soul Urge", "definition": "From the vowels of your name — describes what you truly desire inside, beyond what you show the world." },
      { "term": "Personal Year", "definition": "You are always in one of 9 years in a numerological cycle. Each year has a different theme." },
      { "term": "Type", "definition": "In Human Design, there are 5 types of people — each with a different strategy for using their energy." },
      { "term": "Authority", "definition": "The internal mechanism through which you make good decisions for yourself. Different for each person." },
      { "term": "Center", "definition": "Human Design maps 9 energy centers in the human body. Defined ones are consistent sources of energy. Undefined ones are areas where you absorb energies from outside." },
      { "term": "Gate", "definition": "A specific component of your design — each gate has a theme or way of seeing the world." },
      { "term": "Channel", "definition": "When two compatible gates are both active, they form a channel — a consistent energy flow in you." },
      { "term": "Incarnation Cross", "definition": "A combination of 4 gates describing the general theme of your life in Human Design." }
    ]
  }
}

═══════════════════════════════
FINAL LANGUAGE CHECK — MANDATORY
═══════════════════════════════

Before outputting, silently verify your response:
1. Every single word is valid ${langName}. No invented words, no words from other languages.
2. Every verb agrees with its subject. Second person singular ("you" / "${language === 'ro' ? 'tu' : language === 'de' ? 'du' : language === 'fr' ? 'tu' : language === 'es' ? 'tú' : language === 'it' ? 'tu' : language === 'pt' ? 'tu' : language === 'nl' ? 'jij/je' : language === 'pl' ? 'ty' : language === 'hu' ? 'te' : 'you'}") throughout — no first-person or third-person slips.
3. Every sentence is grammatically complete. No fragments, no truncated words.
4. No English words embedded in ${langName} text.
5. No Spanish, French, Italian, or other foreign language words.
6. No Japanese, Chinese, or other non-Latin characters anywhere.
7. Diacritics correct on every word that needs them.
8. All gate and channel references exist in the data provided above.

If you find any issue, fix it silently before outputting. Do not mention this check.`
}

export function buildAlignmentPlanPrompt(calculatedData, profileSections, swot) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology

  return `You are writing an Alignment Plan — a practical, concrete guide for how this person should direct their energy over the next 30 days and beyond.

Tone: warm but direct. No vague advice. Every item must be something they can actually do.
Fully in the profile's language — no mixed languages. Translate any English data before using it.
NEVER invent gate numbers, channel numbers, or channel names not listed in the data below.

PROFILE DATA:
- HD Type: ${hd.type}, Profile ${hd.profile}, Authority: ${hd.authority}
- Incarnation Cross: ${hd.incarnation_cross}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels (only reference these): ${hd.formed_channels?.join(', ') || 'none'}
- Key Gates (only reference these): ${hd.key_gates?.join(' | ')}
- Life Path ${n.life_path} — ${n.life_path_meaning}
- Expression ${n.expression} — ${n.expression_meaning}
- Soul Urge ${n.soul_urge} — ${n.soul_urge_meaning}
- Personal Year ${n.personal_year?.personal_year} of 9: ${n.personal_year?.theme}
- Personal Year Focus: ${n.personal_year?.focus}
- Personal Year Warning: ${n.personal_year?.warning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Blueprint: ${profileSections.blueprint}
- Top Strengths: ${profileSections.strengths?.slice(0,2).join(' | ')}
- Growth Areas: ${profileSections.vulnerabilities?.slice(0,2).join(' | ')}
- Key Opportunities: ${swot.opportunities?.slice(0,2).join(' | ')}

Return ONLY valid JSON, no markdown, no explanation.

{
  "directional_clarity": {
    "life_direction": "3 sentences. Where is this person headed, based on their incarnation cross and life path? Compass, not prescription.",
    "prioritize": [
      "Concrete priority — what to say yes to this month, why it connects to their design",
      "Second priority",
      "Third priority"
    ],
    "eliminate": [
      "Concrete thing to stop doing — explain why it drains this specific person",
      "Second drain",
      "Third drain"
    ]
  },
  "structured_plan": {
    "thirty_day_focus": "One clear sentence naming Personal Year ${n.personal_year?.personal_year} (${n.personal_year?.theme}) and the one thing to focus on this month.",
    "weekly_template": [
      "Mon-Tue: specific action tied to their HD type and energy",
      "Wed-Thu: specific action tied to a gate or center from their data",
      "Fri: specific action tied to their authority or strategy",
      "Weekend: specific rest or reflection practice tied to their energy type"
    ],
    "daily_template": [
      "Morning: specific ritual — what, how long, why it works for this person",
      "Midday: specific action — concrete, doable",
      "Evening: specific reflection — tied to their authority or personal year"
    ]
  },
  "behavioral_anchors": {
    "keystone_habits": [
      "Habit 1 — specific, doable, tied to a gate or channel from their data",
      "Habit 2 — tied to a numerology number",
      "Habit 3 — tied to their HD type or authority"
    ],
    "forbidden_behaviors": [
      "REQUIRED — never leave this empty. Name a specific behavior that derails this person based on their warning signal or undefined centers. Explain exactly why it hurts them.",
      "REQUIRED — second forbidden behavior, tied to a different part of their data",
      "REQUIRED — third forbidden behavior, concrete and specific"
    ],
    "non_negotiables": [
      "I... — personal agreement, specific, grounded in their design",
      "Second agreement",
      "Third agreement"
    ]
  }
}`
}

export function buildActionPlanPrompt(calculatedData, profileSections) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology

  const typeGuidance = {
    'Generator':             'Practices should focus on sustainable energy output, responding to what lights you up, and building mastery through repetition.',
    'Manifesting Generator': 'Practices should support multi-directional energy, quick pivots, and informing others. Include variety and short bursts.',
    'Manifestor':            'Practices should support independent initiation, informing before acting, and managing impact on others.',
    'Projector':             'Practices should prioritize rest, recognition, waiting for the right moment, and conserving focused energy.',
    'Reflector':             'Practices should honor sensitivity to environment, slow decision-making, and lunar cycle awareness.',
  }

  return `You are creating a personalized daily practice plan — 5 to 8 concrete practices this person can start tomorrow.

Each practice must be doable with no equipment, no prior training, no cost.
Each practice must be directly connected to something specific in this person's data.
Tone: practical and warm.
Fully in the profile's language — no mixed languages. Translate any English data before using it.
NEVER cite gate or channel numbers not listed in the data below.

PROFILE DATA:
- HD Type: ${hd.type} — ${typeGuidance[hd.type] || ''}
- Profile: ${hd.profile}
- Authority: ${hd.authority}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels (only reference these): ${hd.formed_channels?.join(', ') || 'none'}
- Key Gates (only reference these):
${hd.key_gates?.join('\n')}
- Life Path ${n.life_path} — ${n.life_path_meaning}
- Soul Urge ${n.soul_urge} — ${n.soul_urge_meaning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Personal Year ${n.personal_year?.personal_year} of 9: ${n.personal_year?.theme}
- Blueprint: ${profileSections.blueprint}
- Key sabotage patterns: ${profileSections.sabotage_tendencies?.join(' | ')}

Return ONLY valid JSON, no markdown, no explanation.

{
  "practices": [
    {
      "id": "p1",
      "name": "Short name, max 6 words",
      "when": "morning",
      "duration_minutes": 10,
      "instructions": "Exactly what to do, step by step, in 2-3 concrete sentences.",
      "why_for_you": "One sentence explaining why this practice fits this specific person — name only gates/channels/centers that are in the data above.",
      "frequency": "daily"
    }
  ]
}`
}