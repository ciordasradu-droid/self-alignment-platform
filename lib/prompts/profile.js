// lib/prompts/profile.js — v4

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

// ===================================================================
// VOICE — shared across all prompts. Overrides fluency.
// ===================================================================
export const VOICE_RULES = `
VOICE — applies to every sentence, every section, every language (this OUTRANKS fluency):

1. CLARITY OVER ELEGANCE. Use common, everyday words the reader already knows. Never reach for a rare, literary, or academic word when a plain one carries the same meaning. If a reader would have to pause and ask "what does that mean?", the word is wrong. Abstract single-word labels (conscience, essence, sovereignty) are almost always too vague — name what the person actually feels or does instead. For titles/archetype names: prefer a concrete, warm name ("The Big-Hearted Builder") over an abstract one ("The Builder of Conscience").

2. PRECISION OF MEANING. Choose the word that says EXACTLY what the data supports, not one that merely sounds good or is roughly in the area. Words that seem similar are often not: "organized" and "competent" describe different people; "people rely on you" (they trust you, they confide) is NOT the same as "people call you to fix things" (problem-solving). Before using a descriptive word, ask: does the data actually support THIS specific claim, or am I approximating? If approximating, find the exact word.

3. CONCRETE OVER ABSTRACT. Describe what the person observably feels, does, or experiences — not an abstract concept that could mean ten things. Whenever about to use an abstract noun, replace it with the concrete experience behind it.

4. TONE CALIBRATION — one example, for TONE only, not a sentence shape to reuse:
   "You have plenty of energy for the things that light you up — and almost none for the ones that don't. Your body tells you the difference clearly."
   What to copy from it: PLAIN WORDS ("light you up", "your body", "tells you" — nothing to look up), SHORT SENTENCES that breathe, POINTS TO SELF-OBSERVATION (shows the reader where to notice this in themselves), DIRECT AND WARM tone like a person talking to them, not a manual.
   What NOT to copy: the contrast-shape itself ("plenty of X and almost none of Y"). That shape fits THIS one example. Do not reuse it as a template for other sentences or other profiles — see STRUCTURAL VARIATION below. A profile where every section opens with the same "lots of A, none of B" shape reads as a template, not as this specific person.

A plain, exact, concrete sentence always beats a polished but vague or imprecise one.
`

// ===================================================================
// TERMINOLOGY POLICY — what to name vs. what to translate into plain experience
// ===================================================================
const TERM_POLICY = `
TERMINOLOGY POLICY (read carefully — this shapes every sentence):

There are TWO kinds of technical terms. Treat them differently.

A) MECHANISM JARGON — the internal machinery names. Examples: "Sacral Center", "Ajna Center", "Solar Plexus", "Spleen", "Throat Center", "G Center", "Root Center", "defined/undefined center", "not-self", "authority" as a bare label.
   → DO NOT use these words in the text. They mean nothing to a normal reader and break the flow.
   → Instead, TRANSLATE them into the lived experience.
   Example: NOT "Your defined Sacral Center gives you energy." INSTEAD "You have a real, physical engine of energy that switches on for what genuinely interests you."
   Example: NOT "Your undefined Head Center absorbs mental pressure." INSTEAD "You soak up the mental noise and worry of people around you, and mistake it for your own."

B) VERIFIABLE ANCHORS — specific coordinates the curious reader could look up. Examples: "Gate 58", "Gate 13", "Life Path 7", "Personal Year 4", "Leo Sun", "Capricorn", "Profile 3/5", "Incarnation Cross of ...", "Channel of Curiosity".
   → KEEP these. They give credibility (this was calculated, not invented) and a door to explore more.
   → But still explain their MEANING in plain words right beside them, briefly.
   Example: "Gate 58 — your drive to make things better — pushes you to..."
   Example: "Your Life Path 7 pulls you toward understanding things deeply, not just knowing them."

In short: name the SPECIFIC COORDINATE (Gate 58, Life Path 7, Leo Sun), drop the MACHINERY LABEL (Sacral, Ajna, undefined center), and always say what it means in lived terms.
`

function getTerminology(lang) {
  return TERMINOLOGY[lang] || TERMINOLOGY['en']
}

function buildTerminologyBlock(lang) {
  const terms = getTerminology(lang)
  const langName = LANGUAGE_NAMES[lang] || 'English'
  if (lang === 'en') return ''

  const typesList = Object.entries(terms.hdTerms.types).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  const strategiesList = Object.entries(terms.hdTerms.strategies).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  const authoritiesList = Object.entries(terms.hdTerms.authorities).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  const centersList = Object.entries(terms.hdTerms.centers).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  const miscList = Object.entries(terms.hdTerms.misc).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  const astroList = Object.entries(terms.astroTerms).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')
  const numList = Object.entries(terms.numerologyTerms).map(([en, t]) => `  - ${en} -> ${t}`).join('\n')

  return `
===============================
${langName.toUpperCase()} TERMINOLOGY REFERENCE
(Reference data below may be in English — translate everything using this glossary before writing)
===============================

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

// ===================================================================
// PROFILE PROMPT v4
// ===================================================================

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

  const birthTimeBlock = hd.birth_time_unknown ? `
===============================
BIRTH TIME UNKNOWN — READ CAREFULLY
===============================

This person's exact birth time is NOT known. Midday was used as a technical placeholder to run the
calculation. This means:
- The Sun sign, Life Path, Expression, Soul Urge, and most gates/channels below are UNAFFECTED and
  fully reliable — do not hedge these.
- The Ascendant/Rising, astrological houses, and occasionally the exact Human Design Type or
  Authority CAN shift with the true birth time (they depend on the Moon's exact position and/or
  precise time-sensitive angles). Treat any such claim in the data below with appropriate caution.

WHAT TO DO:
1. Do not state the Ascendant, houses, or a borderline Type/Authority as flat certainty if the data
   suggests it could be time-sensitive — use language like "most likely" rather than an absolute claim.
2. Include exactly ONE short, warm sentence somewhere natural in the profile (not a disclaimer block,
   not repeated) acknowledging the birth time is unknown and that this doesn't weaken the rest of the
   profile. Do not dwell on it or apologize for it.
3. Never invent a specific time or pretend it is known.
` : ''

  return `You are writing a personal profile for ${fullName}.

Your voice: an intelligent friend who has studied these systems deeply and now speaks to ${fullName} directly — with warmth, honesty, and zero mysticism. You make complex things clear. You say things that make people stop and think "how do you know that about me?"
${VOICE_RULES}
${TERM_POLICY}
===============================
LANGUAGE RULE — ${langName.toUpperCase()} ONLY
===============================

The ENTIRE output MUST be in ${langName}. No exceptions. No mixed languages. Every word, every term, every sentence — ${langName} only.

FORBIDDEN, with zero exceptions: single English words inside ${langName} sentences, Spanish/French/Italian leaks, invented words, non-Latin characters, AND — this is the one that gets missed — a full English phrase, greeting, exclamation, or aside used as a stylistic flourish (e.g. an opening address, an interjection, a rhetorical "Well, ..." or similar). If you catch yourself reaching for an English turn of phrase because it sounds punchy, STOP and write the equivalent feeling in ${langName} instead — never drop the English phrase in as-is.
If uncertain about a word in ${langName}, use a simpler known word.
${terminologyBlock}
${terms.grammarRules}
===============================
FACTUAL ACCURACY — NON-NEGOTIABLE
===============================

NEVER invent Human Design data. Only reference gates, channels, and centers that appear in the data below. When in doubt, describe the theme WITHOUT citing a number. A true general observation beats a specific false one.
${birthTimeBlock}
===============================
WRITING RULES
===============================

1. OBSERVATION FIRST, SOURCE SECOND. Start with what you see about this person. Then where it comes from (a verifiable anchor like a Gate, Life Path, or Sun sign — never machinery jargon). Never reverse.

2. DENSITY, NOT BREVITY. This is important: do NOT pad, but do NOT thin out either. Every sentence must carry real meaning — a specific observation, a concrete example, or a usable insight. The goal is MAXIMUM VALUE inside the word budget, not the fewest words. A short empty sentence is as wrong as a long padded one. Use the three systems' richness — there is far more material (gates, channels, sign element/modality, ruling planet, expression, soul urge, personal year, profile lines) than you need, so reach for the LESS obvious, more specific detail rather than restating the obvious one.

3. EACH SECTION OWNS ITS SUBJECT (this prevents repetition). Every section has its OWN topic and must not re-explain another section's topic:
   - how_you_work = how they operate (outer image, daily engine, inner driver)
   - friction_map = genuine clashes between parts of the data
   - aligned_life = what a good day/life looks like in practice
   - decision_system = HOW they make decisions (this is the ONLY place to explain their decision mechanism in depth)
   - energy_manual = energy: peaks, drains, rhythm, this year
   - warning_signals = early signs something is off + the exit
   - strengths / vulnerabilities = gifts (with shadow) / growth areas
   All three systems (HD + astrology + numerology) can contribute to ANY section — that cross-confirmation is good and makes it credible. What is NOT allowed is re-explaining the SAME idea in section after section. A central theme may appear in AT MOST 2 sections, and the second time only briefly, from a new angle — never a third full re-explanation. If you already explained how their decisions work in decision_system, do not re-explain it in energy_manual and the plan too; reference it in one line if needed.

4. NO JARGON MACHINERY. Follow the TERMINOLOGY POLICY above strictly. Translate mechanism names (Sacral, Ajna, centers, "not-self") into lived experience. Keep verifiable anchors (Gate numbers, Life Path, Sun sign) and explain their meaning plainly beside them.

5. PARAGRAPHS, NOT BULLETS where the format is prose. Write like a letter, not a slide.

6. SHADOW FOR EVERY STRENGTH. Every gift has a cost. Name it.

7. FRICTION IS THE INTERESTING PART. Where systems agree = confidence. Where they clash = insight.

8. SELF-RECOGNITION + GUIDANCE. Each major section should let the reader both RECOGNIZE themselves (observation they can feel is true) AND, where relevant, know how to handle it (energy, decisions, time). Observation first, then what to do with it.

9. LENGTH. The whole profile should be around 1900-2200 words — full but not bloated. Spend the words on specific, varied insight, not repetition or padding.

10. FORBIDDEN WORDS: "unique", "special", "journey", "resonates", "vibration", "frequency", "universe", "manifests", "aligned", "profound mission", "your soul", "gifted" — or their ${langName} equivalents.

===============================
STRUCTURAL VARIATION — READ CAREFULLY
===============================

Two profiles built from different data must read as structurally DIFFERENT documents — different
opening angle, different central metaphor, different shape — not the same template with new
labels swapped in. This person's dominant combination is: ${a.element} element, ${translatedType}, Life Path ${n.life_path}, Profile ${hd.profile}.

Before writing archetype.description and how_you_work, decide which of these actually fits THIS
person's data, and build the opening around it — do not default to the same shape every time:
- GENUINE TENSION: if two systems clearly pull in different directions, open with that tension.
- CONVERGENCE: if type, sun sign, and life path all point the SAME direction, open with that
  alignment — do not invent a tension that isn't in the data.
- MOVEMENT: if the Profile or Life Path suggests change over time (a 3/5, 4/6, or 2/4 profile; a
  mutable sun sign; a Life Path like 5 or 7 built around exploration) — open with movement or
  evolution, not a static snapshot.
- ONE DOMINANT TRAIT: if one single trait outweighs everything else (a strongly defined Sacral, a
  cardinal Fire sun, a Life Path 1 or 8) — open by naming that trait directly and concretely,
  never forced into a contrast shape.
Pick whichever is actually true here. The "plenty of X, almost none of Y" contrast shape from the
tone example is ONE option among these four, valid only when a genuine tension is what the data
shows — not the default choice.

===============================
PROFILE DATA
===============================

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

HUMAN DESIGN:
- Type: ${hd.type} -> translate as: ${translatedType}
- Profile: ${hd.profile}
- Authority: ${hd.authority} -> translate as: ${translatedAuthority}
- Strategy: ${hd.strategy} -> translate as: ${translatedStrategy}
- Signature (on-track feeling): ${hd.signature}
- Warning signal (off-track feeling): ${hd.not_self_theme_plain}
- Energy description: ${hd.energy_type_plain}
- Work style: ${hd.work_style_plain}
- Incarnation cross: ${hd.incarnation_cross}
- Defined centers (translate to lived experience, do NOT name them): ${translatedDefinedCenters}
- Undefined centers (translate to lived experience, do NOT name them): ${translatedUndefinedCenters}
- Formed channels (ONLY reference these): ${channelsBlock}
- All active gates (ONLY reference these): ${allGatesBlock}

KEY GATES:
${keyGatesBlock}

===============================
OUTPUT FORMAT — RETURN ONLY VALID JSON
===============================

IMPORTANT JSON SAFETY: Use only standard straight quotes for JSON structure. Inside text values, do NOT use curly/typographic quotes (" " „ ") or unescaped double quotes — use simple words or single quotes if you must quote something. Every value must be a clean JSON string.

{
  "archetype": {
    "name": "A 2-4 word evocative name that captures who this person is across all three systems. Not mystical — grounded and concrete. Make this specific person feel recognized.",
    "description": "3-4 dense sentences. What kind of person this describes, what drives them, the central tension they navigate. Weave in their type (as lived experience), life path theme, and sun sign. End with something they would recognize as deeply true."
  },

  "how_you_work": {
    "surface": "2-3 sentences. How others perceive this person. Draw from personality number, sun sign, outward-projecting traits. Should feel like recognition: 'yes, people do see me that way.'",
    "engine": "2-3 sentences. How they actually operate day-to-day — work rhythm, what charges vs flattens their energy. Draw from type + strategy + expression number. Specific enough to evaluate their current job against.",
    "core": "2-3 sentences. What drives them underneath — the need they might not show anyone. Draw from life path + soul urge + incarnation cross. This should make them pause."
  },

  "friction_map": [
    {
      "tension": "Short name for this internal conflict — 3-5 words",
      "pull_a": "What one part of them wants/does — name the source as a verifiable anchor (sign, life path, gate), in lived terms. 1-2 sentences.",
      "pull_b": "What the opposing part wants/does — a different source. 1-2 sentences.",
      "daily_experience": "How this shows up in real daily life. 2 sentences. Concrete, recognizable.",
      "resolution": "How to hold both — not choose one. 2 sentences. Practical, doable."
    },
    "Same format — 3-4 friction points total. Each a REAL clash between different parts of the data.",
    "Third friction point",
    "Fourth friction point (optional — only if genuinely present)"
  ],

  "aligned_life": "4-6 sentences painting a concrete picture of life when this person is operating well: kind of work, autonomy, people, daily rhythm, how their body feels. Every sentence testable. Do not re-explain their decision-making or energy mechanics here — show the lived result.",

  "decision_system": [
    "Full dense paragraph: HOW this person makes good decisions, in plain lived language (their inner mechanism without naming the machinery). How it feels in the body, a concrete everyday example, what goes wrong when they override it. This is the ONLY section that explains their decision mechanism in depth.",
    "Full paragraph: what they truly want underneath (from soul urge ${n.soul_urge}) vs what they think they should want — as a decision filter.",
    "Full paragraph: one memorable personal operating rule, drawn from how they decide + sun sign + life path. Practical."
  ],

  "energy_manual": {
    "peak": "2-3 sentences. When and why energy is highest — concrete activities, conditions, patterns. Do not re-explain decision-making here.",
    "drain": "2-3 sentences. What drains them and the specific early warning sign, in lived terms (no machinery names).",
    "rhythm": "2-3 sentences. How their sun's element (${a.element}) and modality (${a.modality}) shape their ideal daily rhythm.",
    "current_year": "2-3 sentences. What personal year ${n.personal_year?.personal_year} (${n.personal_year?.theme}) means for their energy right now."
  },

  "warning_signals": [
    {
      "signal": "What the person FEELS — a specific physical or emotional sensation they would recognize.",
      "pattern": "What is actually happening underneath — in lived terms. 1-2 sentences.",
      "exit": "One concrete, specific, time-bound action. Not 'meditate.'"
    },
    "Same format — 3-4 signals total. Each from a DIFFERENT part of their data."
  ],

  "strengths": [
    "2-3 dense sentences. Concrete observation first, then the verifiable source (real gate/sign/number, in lived terms). When it shines AND its shadow. Rotate across the three systems over the 5 strengths.",
    "Second strength — different system emphasis",
    "Third strength",
    "Fourth strength",
    "Fifth strength"
  ],

  "vulnerabilities": [
    "2-3 sentences. Pattern honestly named, source in data (lived terms). End with ONE concrete thing to do differently tomorrow.",
    "Second vulnerability",
    "Third vulnerability",
    "Fourth vulnerability"
  ],

  "opportunities": [
    "One sentence from ASTROLOGY: where this person naturally draws success.",
    "One sentence from NUMEROLOGY: where their impact lands hardest.",
    "One sentence from HUMAN DESIGN: where their design wants to be used.",
    "One synthesis sentence: a concrete opening available right now."
  ],

  "accountability_seeds": {
    "identity_anchors": [
      "A short, warm sentence reminding this person who they are at their best. For hard days.",
      "Second anchor — different angle.",
      "Third anchor — the deepest one."
    ],
    "guided_intentions": [
      {
        "theme": "Single word or short phrase — e.g. 'boundaries', 'presence'",
        "suggestion": "Weekly intention in 1-2 sentences. An observation practice, not a task.",
        "connected_to": "Which friction_map item or vulnerability this addresses"
      },
      "5-7 guided intentions total.",
      "Third", "Fourth", "Fifth"
    ],
    "warning_phrases": [
      "Short phrase: 'When you feel [sensation], it usually means [pattern].' Notification-sized.",
      "Second warning phrase",
      "Third warning phrase"
    ]
  }
}

===============================
QUALITY CHECK — BEFORE OUTPUT
===============================

Verify silently:
1. Every single word, in every section, is valid ${langName} — re-read the whole text looking specifically for any stray English (or other language) word, phrase, greeting, or interjection, and rewrite it in ${langName} if found. This includes casual asides, not just technical terms.
2. Second person singular throughout. No gender assumptions.
3. Every gate/channel reference exists in the data above.
4. NO machinery jargon in the text (no "Sacral", "Ajna", "center", "not-self", etc.) — all translated to lived experience. Verifiable anchors (Gate numbers, Life Path, Sun sign) kept and explained plainly.
5. NO central idea explained in more than 2 sections. The third time, it's a one-line reference at most, or cut.
6. Each section stays on its own subject; decision mechanics only in depth in decision_system.
7. Density: every sentence carries a specific observation, example, or usable insight — no padding, no thinning.
8. friction_map tensions are REAL clashes. aligned_life is concrete. warning_signals exits are specific actions.
9. Total length around 1900-2200 words.
10. VOICE matches the style model: contrast, plain words, short sentences, points to self-observation, warm and direct.
11. JSON is valid: no curly/typographic quotes inside values, all strings clean.

Fix any issues silently. Do not mention this check.`
}

// ===================================================================
// ALIGNMENT PLAN PROMPT (updated for v4 field names)
// ===================================================================

export function buildAlignmentPlanPrompt(calculatedData, profileSections, swot, language = 'en') {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology
  const langName = LANGUAGE_NAMES[language] || 'English'
  const terms = getTerminology(language)
  const terminologyBlock = buildTerminologyBlock(language)

  return `You are writing an Alignment Plan — a practical, concrete guide for how this person should direct their energy over the next 30 days and beyond.

Tone: warm but direct. No vague advice. Every item must be something they can actually do.
NEVER invent gate numbers, channel numbers, or channel names not listed in the data below.
${VOICE_RULES}
${TERM_POLICY}
===============================
LANGUAGE RULE — ${langName.toUpperCase()} ONLY
===============================

The ENTIRE output MUST be in ${langName}. No exceptions, no mixed languages, no English words or
phrases dropped in as a flourish (greetings, exclamations, asides) even if the rest is correct.
Translate any English data below before using it. If uncertain about a word, use a simpler known
${langName} word rather than an English one.
${terminologyBlock}
${terms.grammarRules}
This plan COMPLEMENTS the profile — do not re-explain their whole personality or decision mechanism again. Give direction and concrete actions.
${hd.birth_time_unknown ? `
NOTE: This person's exact birth time is unknown (midday was used as a placeholder). Type/Authority
can occasionally shift with true birth time — do not lean hard on Authority-specific mechanics if
it could be time-sensitive; favor Strategy and Life Path/Sun-based direction instead. Do not add a
separate disclaimer here — the profile already carries the one acknowledgment of this.
` : ''}
PROFILE DATA:
- HD Type: ${hd.type}, Profile ${hd.profile}, Authority: ${hd.authority}
- Incarnation Cross: ${hd.incarnation_cross}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers (translate to lived experience): ${hd.defined_centers?.join(', ')}
- Formed Channels (only reference these): ${hd.formed_channels?.join(', ') || 'none'}
- Key Gates (only reference these): ${hd.key_gates?.join(' | ')}
- Life Path ${n.life_path} — ${n.life_path_meaning}
- Expression ${n.expression} — ${n.expression_meaning}
- Soul Urge ${n.soul_urge} — ${n.soul_urge_meaning}
- Personal Year ${n.personal_year?.personal_year} of 9: ${n.personal_year?.theme}
- Personal Year Focus: ${n.personal_year?.focus}
- Personal Year Warning: ${n.personal_year?.warning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Archetype: ${profileSections.archetype?.name || ''} — ${profileSections.archetype?.description || ''}
- Top Strengths: ${profileSections.strengths?.slice(0,2).join(' | ')}
- Key Frictions: ${profileSections.friction_map?.slice(0,2).map(f => typeof f === 'object' ? f.tension : f).join(' | ') || ''}
- Aligned Life: ${profileSections.aligned_life || ''}
- Opportunities: ${swot.opportunities?.slice(0,2).join(' | ')}

JSON SAFETY: no curly/typographic quotes inside text values. Return ONLY valid JSON, no markdown, no explanation.

{
  "directional_clarity": {
    "life_direction": "3 sentences. Where is this person headed, based on their incarnation cross and life path? Compass, not prescription.",
    "prioritize": [
      "Concrete priority — what to say yes to this month, why it connects to them",
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
      "Mon-Tue: specific action tied to their energy",
      "Wed-Thu: specific action tied to a gate or strength from their data",
      "Fri: specific action tied to how they decide",
      "Weekend: specific rest or reflection practice tied to their energy"
    ],
    "daily_template": [
      "Morning: specific ritual — what, how long, why it works for this person",
      "Midday: specific action — concrete, doable",
      "Evening: specific reflection — tied to their year or how they decide"
    ]
  },
  "behavioral_anchors": {
    "keystone_habits": [
      "Habit 1 — specific, doable, tied to a gate or strength from their data",
      "Habit 2 — tied to a numerology number",
      "Habit 3 — tied to their type or how they decide"
    ],
    "forbidden_behaviors": [
      "REQUIRED — name a specific behavior that derails this person based on their warning signal. Explain exactly why it hurts them.",
      "REQUIRED — second forbidden behavior",
      "REQUIRED — third forbidden behavior"
    ],
    "non_negotiables": [
      "I... — personal agreement, specific, grounded in who they are",
      "Second agreement",
      "Third agreement"
    ]
  }
}

Before returning: re-read every string value and confirm it is entirely in ${langName}, with no stray English words, phrases, or interjections anywhere. Fix silently if found.`
}

// ===================================================================
// ACTION PLAN PROMPT (updated for v4 field names)
// ===================================================================

export function buildActionPlanPrompt(calculatedData, profileSections, language = 'en') {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology
  const langName = LANGUAGE_NAMES[language] || 'English'
  const terms = getTerminology(language)
  const terminologyBlock = buildTerminologyBlock(language)

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
NEVER cite gate or channel numbers not listed in the data below.
${VOICE_RULES}
${TERM_POLICY}
===============================
LANGUAGE RULE — ${langName.toUpperCase()} ONLY
===============================

The ENTIRE output MUST be in ${langName}. No exceptions, no mixed languages, no English words or
phrases dropped in as a flourish (greetings, exclamations, asides) even if the rest is correct.
Translate any English data below before using it. If uncertain about a word, use a simpler known
${langName} word rather than an English one.
${terminologyBlock}
${terms.grammarRules}
${hd.birth_time_unknown ? `
NOTE: This person's exact birth time is unknown (midday was used as a placeholder). If Type or
Authority could be time-sensitive, favor practices tied to Strategy and Life Path instead of
leaning hard on Authority-specific mechanics. No separate disclaimer needed here.
` : ''}
PROFILE DATA:
- HD Type: ${hd.type} — ${typeGuidance[hd.type] || ''}
- Profile: ${hd.profile}
- Authority: ${hd.authority}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers (translate to lived experience): ${hd.defined_centers?.join(', ')}
- Formed Channels (only reference these): ${hd.formed_channels?.join(', ') || 'none'}
- Key Gates (only reference these):
${hd.key_gates?.join('\n')}
- Life Path ${n.life_path} — ${n.life_path_meaning}
- Soul Urge ${n.soul_urge} — ${n.soul_urge_meaning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Personal Year ${n.personal_year?.personal_year} of 9: ${n.personal_year?.theme}
- Archetype: ${profileSections.archetype?.name || ''} — ${profileSections.archetype?.description || ''}
- Key warning signals: ${profileSections.warning_signals?.slice(0,2).map(w => typeof w === 'object' ? w.signal : w).join(' | ') || ''}

JSON SAFETY: no curly/typographic quotes inside text values. Return ONLY valid JSON, no markdown, no explanation.

{
  "practices": [
    {
      "id": "p1",
      "name": "Short name, max 6 words",
      "when": "morning",
      "duration_minutes": 10,
      "instructions": "Exactly what to do, step by step, in 2-3 concrete sentences.",
      "why_for_you": "One sentence explaining why this practice fits this specific person — name only gates/channels that are in the data above, in lived terms.",
      "frequency": "daily"
    }
  ]
}

Before returning: re-read every string value and confirm it is entirely in ${langName}, with no stray English words, phrases, or interjections anywhere. Fix silently if found.`
}