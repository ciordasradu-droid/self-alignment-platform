// lib/prompts/profile.js

import { hdTerms, astroTerms, numerologyTerms, grammarRules } from './terminology/ro.js'
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

  if (lang === 'en') return '' // English needs no translation block

  const typesList = Object.entries(terms.hdTerms.types)
    .map(([en, translated]) => `  - ${en} → ${translated}`)
    .join('\n')

  const strategiesList = Object.entries(terms.hdTerms.strategies)
    .map(([en, translated]) => `  - ${en} → ${translated}`)
    .join('\n')

  const authoritiesList = Object.entries(terms.hdTerms.authorities)
    .map(([en, translated]) => `  - ${en} → ${translated}`)
    .join('\n')

  const centersList = Object.entries(terms.hdTerms.centers)
    .map(([en, translated]) => `  - ${en} → ${translated}`)
    .join('\n')

  const miscList = Object.entries(terms.hdTerms.misc)
    .map(([en, translated]) => `  - ${en} → ${translated}`)
    .join('\n')

  const astroList = Object.entries(terms.astroTerms)
    .map(([en, translated]) => `  - ${en} → ${translated}`)
    .join('\n')

  const numList = Object.entries(terms.numerologyTerms)
    .map(([en, translated]) => `  - ${en} → ${translated}`)
    .join('\n')

  return `
═══════════════════════════════
${langName.toUpperCase()} TERMINOLOGY REFERENCE
(All reference data in the context below may be in English — translate everything using this glossary before writing)
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

  // Translate HD fields that arrive in English from humandesign.js
  const translatedType = terms.hdTerms.types[hd.type] || hd.type
  const translatedStrategy = terms.hdTerms.strategies[hd.strategy] || hd.strategy
  const translatedAuthority = terms.hdTerms.authorities[hd.authority] || hd.authority
  const translatedDefinedCenters = hd.defined_centers?.map(c => terms.hdTerms.centers[c] || c).join(', ') || 'none'
  const translatedUndefinedCenters = hd.undefined_centers?.map(c => terms.hdTerms.centers[c] || c).join(', ') || 'none'

  const keyGatesBlock = hd.key_gates?.join('\n') || ''
  const channelsBlock = hd.formed_channels?.length
    ? hd.formed_channels.join(', ')
    : (language === 'en' ? 'no full channels formed' : 'no full channels formed — translate this phrase')
  const allGatesBlock = hd.all_active_gates?.join(', ') || ''

  return `You are writing a personal profile for ${fullName}.

Your mission: make this person feel deeply understood — not analysed. Like an intelligent friend who has studied these systems would speak to them directly, with warmth and clarity. Not mystical. Not clinical. Not guru.

═══════════════════════════════
ABSOLUTE LANGUAGE RULE — READ FIRST
═══════════════════════════════

The ENTIRE output MUST be written exclusively in ${langName}. This is non-negotiable.

This includes:
- All section content, observations, and descriptions
- All Human Design terminology (type, strategy, authority, profile, centers, gates, channels, crosses)
- All astrology terminology (signs, planets, elements, modalities)
- All numerology terminology (life path, expression, soul urge, personal year)
- ALL reference data passed to you below — it may arrive in English, translate it before using it

FORBIDDEN: mixing languages within a sentence, paragraph, or bullet. If you find yourself about to write an English technical term inside a ${langName} sentence, stop and render it in ${langName} instead using the terminology reference below.

Never code-switch. Every output token must be in ${langName}.
${terminologyBlock}
${terms.grammarRules}
═══════════════════════════════
WRITING RULES
═══════════════════════════════

RULE 1 — Observation first, source second.
Structure every insight: first what you observe about this person (concrete, human), then — if useful — where you know this from in the data. Never the reverse.
Wrong: "Gate 58 gives you pure life energy."
Right: "You have a natural ability to bring life to a space — to make it lighter, warmer, more alive. This comes from a specific element of your design (Gate 58, if you want to look it up)."

RULE 2 — No technical term without immediate plain-language explanation.
Never use a Human Design, numerology, or astrology term without explaining it immediately in human language in the same paragraph.

RULE 3 — Tone: warm direct friend, not guru.
No "you have a profound mission of service." No "your soul demands." No mystical or formally therapeutic language. Write like someone who thinks naturally in ${langName} and tells you the truth with care.

RULE 4 — No mechanical translation from English.
"Wait to respond" does not become a direct literal translation. Reformulate naturally in ${langName} as someone who speaks about this daily would say it.

RULE 5 — No numeric labels as subjects.
"Life Path 9", "Expression 4", "Soul Urge 1" do not appear as labels in text. Describe what they mean. If useful to mention the number, put it in parentheses at the end.

RULE 6 — Mandatory concreteness.
Every observation must be testable in the person's life from yesterday or today. If a sentence is so general it fits anyone, cut it.

RULE 7 — Paragraphs, not bullet points.
Write text that reads like a letter about someone, not a list of characteristics.

RULE 8 — Shadow for every strength.
Every strength has a reverse. Name it. This makes a profile feel honest, not flattering.

RULE 9 — Forbidden words (do not use these or their ${langName} equivalents):
"unique", "special", "journey", "resonates", "vibration", "frequency", "universe", "manifests", "aligned", "profound mission", "your soul".

═══════════════════════════════
SYSTEM BALANCE RULE — CRITICAL
═══════════════════════════════

This profile synthesizes THREE systems: Human Design, Astrology, and Numerology. Every major section MUST draw on all three. Do not default to Human Design as the primary frame.

For each insight or paragraph you write, ask: "Which system am I using? Have I used the other two recently?" Rotate deliberately.

Target distribution across the full profile:
- Human Design insights: ~35-40%
- Astrology insights: ~30-35% (sun sign, element, modality, ruling planet — explain what each MEANS for this person's daily experience, not just the label)
- Numerology insights: ~25-30% (life path, expression, soul urge, personal year — explain what having each number FEELS LIKE in work, relationships, decisions)

BAD astrology usage: "Your Capricorn makes you disciplined."
GOOD astrology usage: "Your Sun in Capricorn — a cardinal earth sign ruled by Saturn — means your identity is built through discipline, responsibility, and tangible results. Unlike fire signs who act from enthusiasm, you need structure and measurable progress to feel on track. When combined with your [HD authority], this creates a rare profile: someone who knows from the body what they want, but needs a solid framework to deliver."

BAD numerology usage: "Expression 4 — practical discipline."
GOOD numerology usage: "There is something in the way you work that needs order and solidity. You are not someone who thrives in chaos — you build things methodically, step by step, and you feel most yourself when you can see concrete progress. This comes from a deep thread in your design (Expression 4, for those who want to explore further)."

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
- Formed channels: ${channelsBlock}
- All active gates: ${allGatesBlock}

KEY GATES (most important — explain each in human terms, fully translated):
${keyGatesBlock}

═══════════════════════════════
OUTPUT FORMAT
═══════════════════════════════

Return ONLY valid JSON, no markdown, no explanation.

{
  "blueprint": "3-4 sentences. Open with who this person fundamentally is — their energy type (HD, translated), what drives them deeply (life path), and the moment they are in now (personal year). Explain the cycle: 'You are in year X of a 9-year cycle — what this means concretely.' Make it sound like the opening of a letter written specifically for them. No technical label without explanation. Fully in ${langName}.",

  "strengths": [
    "2-3 sentence paragraph. First sentence: concrete human observation about this person — something they would recognise from their life yesterday. Second: where this comes from in their data (gate, channel or number — explain what that element IS, not just what it gives). Third: when this strength shines brightest. No bullet points, no labels as subjects. Draw from a mix of HD, astrology, and numerology across the 5 strengths.",
    "Same format — 5 strengths total, each a real paragraph, each referencing something specific from the data with explanation. Rotate systems: not all from HD.",
    "Third strength — draw from astrology or numerology",
    "Fourth strength",
    "Fifth strength"
  ],

  "vulnerabilities": [
    "2-3 sentence paragraph. Name patterns honestly — not as flaws, but as things to understand. Explain which part of the data this tendency comes from (gate, undefined center or number — with explanation). End with one concrete thing they can do differently tomorrow.",
    "Same format — 4 vulnerabilities total. Mix systems.",
    "Third vulnerability",
    "Fourth vulnerability"
  ],

  "energy_patterns": [
    "Full paragraph about when their energy is at maximum — why, what triggers it, what to do with it. Reference defined centers, explaining what they are.",
    "Full paragraph about when energy drops — why, warning signs, how to manage. Reference undefined centers or their type's warning signal.",
    "Full paragraph about how the astrological element (${a.element}) shapes their daily energy rhythm — concrete, not abstract. Explain what this element means.",
    "Full paragraph about what personal year ${n.personal_year?.personal_year} does to their energy right now — explain the 9-year cycle, what this specific year brings."
  ],

  "sabotage_tendencies": [
    "Full paragraph — name a specific self-sabotage pattern, trace it back to a gate or number (with explanation), explain what triggers it and what the concrete exit is.",
    "Same format — 4 patterns total",
    "Third pattern",
    "Fourth pattern"
  ],

  "decision_making": [
    "Full paragraph explaining their authority (${hd.authority} → ${translatedAuthority}) in completely human language — how it feels in the body, how to use it practically, with a concrete example from daily life. Explain what 'authority' means in Human Design before saying what theirs does.",
    "Full paragraph about how the person's deep desire (soul urge ${n.soul_urge} — ${n.soul_urge_meaning}) filters what they truly want versus what they think they should want.",
    "Full paragraph about the tension or harmony between their authority and their sun sign — does ${a.sun_sign} support or conflict with their decision style?"
  ],

  "work_discipline": [
    "Full paragraph about how this person works best — HD type, their channels, what kind of work ignites their energy.",
    "Full paragraph about a specific gate from their design that shapes their approach to work — explain what that gate is and how it shows up in their concrete behaviour.",
    "Full paragraph about what their expression number (${n.expression} — ${n.expression_meaning}) means professionally — no label as subject.",
    "Full paragraph about what personal year ${n.personal_year?.personal_year} means for their work right now — concrete guidance, not generic."
  ],

  "opportunities": [
    "One full sentence from ASTROLOGY: where this person's chart says they naturally magnetize attention or success. Explain the astrological basis in plain language. No technical codes.",
    "One full sentence from NUMEROLOGY: where their numbers say their gifts land with the most impact. Explain in plain language.",
    "One full sentence from HUMAN DESIGN: where their energetic design wants to be used. Explain the HD basis in plain language.",
    "One synthesis sentence combining two systems: a concrete opening available to this person right now."
  ],

  "commitments": [
    "Written as 'I commit to...' (in ${langName}) — specific, personal, grounded in a gate or center from their design. 2-3 sentences. Must sound like something this person would actually say about themselves.",
    "Written as 'I commit to...' — grounded in HD type and how they work best. 2-3 sentences.",
    "Written as 'I commit to...' — grounded in personal year ${n.personal_year?.personal_year} theme (${n.personal_year?.theme}). 2-3 sentences."
  ],

  "glossary": {
    "intro": "One introductory sentence in ${langName}: 'If you want to understand the terms behind your profile, here is a brief explanation of each.'",
    "terms": [
      { "term": "Life Path (translated to ${langName})", "definition": "A number calculated from your date of birth that describes the central theme of your life — what kinds of experiences you will attract and what you are here to learn." },
      { "term": "Expression Number (translated to ${langName})", "definition": "Calculated from your full name at birth — describes how you naturally express yourself in the world and what talents are native to you." },
      { "term": "Soul Urge (translated to ${langName})", "definition": "Calculated from the vowels of your name — describes what you truly desire inside, beyond what you show the world." },
      { "term": "Personal Year (translated to ${langName})", "definition": "You are always in one of 9 years in a numerological cycle. Each year has a different theme — some are for building, some for harvesting, some for transformation." },
      { "term": "Type (translated to ${langName})", "definition": "In Human Design, there are 5 types of people — each with a different strategy for using their energy and interacting with the world." },
      { "term": "Authority (translated to ${langName})", "definition": "The internal mechanism through which you make good decisions for yourself — it can be a body sensation, a clarity that comes with your voice, or something else. Different for each person." },
      { "term": "Center (translated to ${langName})", "definition": "Human Design maps 9 energy centers in the human body. 'Defined' ones are consistent sources of energy or traits. 'Undefined' ones are areas where you absorb and amplify energies from outside." },
      { "term": "Gate (translated to ${langName})", "definition": "A specific component of your design — each gate has a theme, an energy, or a way of seeing the world. You have dozens of active gates, but a few are dominant." },
      { "term": "Channel (translated to ${langName})", "definition": "When two compatible gates are both active, they form a channel — a trait or energy flow that functions consistently in you." },
      { "term": "Incarnation Cross (translated to ${langName})", "definition": "A combination of 4 gates that describes the general theme of your life in Human Design — the direction you naturally gravitate toward." }
    ]
  }
}`
}

export function buildAlignmentPlanPrompt(calculatedData, profileSections, swot) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology

  return `You are writing an Alignment Plan — a practical, concrete guide for how this person should direct their energy over the next 30 days and beyond.

Tone: warm but direct. Like a coach who knows their data well and cares about results. No vague advice. Every item must be something they can actually do.
Fully in the profile's language — no mixed languages. If data arrives in English, translate before using.

PROFILE DATA:
- HD Type: ${hd.type}, Profile ${hd.profile}, Authority: ${hd.authority}
- Incarnation Cross: ${hd.incarnation_cross}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates: ${hd.key_gates?.join(' | ')}
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
    "life_direction": "3 sentences. Where is this person headed, based on their incarnation cross and life path? Make it feel like a compass, not a prescription.",
    "prioritize": [
      "Concrete priority — what to say yes to this month, and why it connects to their design",
      "Second priority",
      "Third priority"
    ],
    "eliminate": [
      "Concrete thing to stop doing — explain why it drains this specific person based on their data",
      "Second drain",
      "Third drain"
    ]
  },
  "structured_plan": {
    "thirty_day_focus": "One clear sentence naming Personal Year ${n.personal_year?.personal_year} (${n.personal_year?.theme}) and the one thing to focus on this month.",
    "weekly_template": [
      "Mon-Tue: specific action tied to their HD type and energy",
      "Wed-Thu: specific action tied to a gate or center",
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
      "Habit 1 — specific, doable, tied to a gate or channel",
      "Habit 2 — tied to a number",
      "Habit 3 — tied to their HD type or authority"
    ],
    "forbidden_behaviors": [
      "Never do this — explain exactly why it derails this specific person",
      "Second forbidden behavior",
      "Third forbidden behavior"
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
Tone: practical and warm. Explain why each practice is right for THIS person specifically.
Fully in the profile's language — no mixed languages. Translate any English data before using it.

PROFILE DATA:
- HD Type: ${hd.type} — ${typeGuidance[hd.type] || ''}
- Profile: ${hd.profile}
- Authority: ${hd.authority}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates:
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
      "instructions": "Exactly what to do, step by step, in 2-3 concrete sentences. Tell them precisely what to do, not just what category it falls into.",
      "why_for_you": "One sentence explaining why this specific practice fits this specific person — name the gate, channel, center, or number behind it and explain what it is.",
      "frequency": "daily"
    }
  ]
}`
}