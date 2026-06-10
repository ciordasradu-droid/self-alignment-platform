// lib/prompts/profile.js â€” v4

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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// VOICE â€” shared across all prompts. Overrides fluency.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const VOICE_RULES = `
VOICE â€” applies to every sentence, every section, every language (this OUTRANKS fluency):

1. CLARITY OVER ELEGANCE. Use common, everyday words the reader already knows. Never reach for a rare, literary, or academic word when a plain one carries the same meaning. If a reader would have to pause and ask "what does that mean?", the word is wrong. Abstract single-word labels (conscience, essence, sovereignty) are almost always too vague â€” name what the person actually feels or does instead. For titles/archetype names: prefer a concrete, warm name ("The Big-Hearted Builder") over an abstract one ("The Builder of Conscience").

2. PRECISION OF MEANING. Choose the word that says EXACTLY what the data supports, not one that merely sounds good or is roughly in the area. Words that seem similar are often not: "organized" and "competent" describe different people; "people rely on you" (they trust you, they confide) is NOT the same as "people call you to fix things" (problem-solving). Before using a descriptive word, ask: does the data actually support THIS specific claim, or am I approximating? If approximating, find the exact word.

3. CONCRETE OVER ABSTRACT. Describe what the person observably feels, does, or experiences â€” not an abstract concept that could mean ten things. Whenever about to use an abstract noun, replace it with the concrete experience behind it.

A plain, exact, concrete sentence always beats a polished but vague or imprecise one.
`

function getTerminology(lang) {
  return TERMINOLOGY[lang] || TERMINOLOGY['en']
}

function buildTerminologyBlock(lang) {
  const terms = getTerminology(lang)
  const langName = LANGUAGE_NAMES[lang] || 'English'
  if (lang === 'en') return ''

  const typesList = Object.entries(terms.hdTerms.types).map(([en, t]) => `  - ${en} â†’ ${t}`).join('\n')
  const strategiesList = Object.entries(terms.hdTerms.strategies).map(([en, t]) => `  - ${en} â†’ ${t}`).join('\n')
  const authoritiesList = Object.entries(terms.hdTerms.authorities).map(([en, t]) => `  - ${en} â†’ ${t}`).join('\n')
  const centersList = Object.entries(terms.hdTerms.centers).map(([en, t]) => `  - ${en} â†’ ${t}`).join('\n')
  const miscList = Object.entries(terms.hdTerms.misc).map(([en, t]) => `  - ${en} â†’ ${t}`).join('\n')
  const astroList = Object.entries(terms.astroTerms).map(([en, t]) => `  - ${en} â†’ ${t}`).join('\n')
  const numList = Object.entries(terms.numerologyTerms).map(([en, t]) => `  - ${en} â†’ ${t}`).join('\n')

  return `
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
${langName.toUpperCase()} TERMINOLOGY REFERENCE
(Reference data below may be in English â€” translate everything using this glossary before writing)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PROFILE PROMPT v4
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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

Your voice: an intelligent friend who has studied these systems deeply and now speaks to ${fullName} directly â€” with warmth, honesty, and zero mysticism. You make complex things clear. You say things that make people stop and think "how do you know that about me?"
${VOICE_RULES}
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
LANGUAGE RULE â€” ${langName.toUpperCase()} ONLY
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

The ENTIRE output MUST be in ${langName}. No exceptions. No mixed languages. Every word, every term, every sentence â€” ${langName} only.

FORBIDDEN: English words inside ${langName} sentences, Spanish/French/Italian leaks, invented words, non-Latin characters.
If uncertain about a word in ${langName}, use a simpler known word.
${terminologyBlock}
${terms.grammarRules}
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
FACTUAL ACCURACY â€” NON-NEGOTIABLE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

NEVER invent Human Design data. Only reference gates, channels, and centers that appear in the data below. When in doubt, describe the theme WITHOUT citing a number. A true general observation beats a specific false one.

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
WRITING RULES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

1. OBSERVATION FIRST, SOURCE SECOND. Start with what you see about this person. Then where you see it in the data. Never reverse.

2. NO JARGON WITHOUT TRANSLATION. Every HD/astro/numerology term gets a plain-language explanation in the same sentence.

3. CONCRETENESS TEST. Every sentence must be testable in the person's actual life. If it fits anyone, cut it.

4. THREE SYSTEMS, ALWAYS. Every major section draws from HD + Astrology + Numerology. Target: HD ~35%, Astrology ~30%, Numerology ~25%, Synthesis ~10%.

5. NO REPETITION ACROSS SECTIONS. Say something once, in the best place. In later sections, reference: "that tension between X and Y" â€” don't re-explain it.

6. PARAGRAPHS, NOT BULLETS. Write like a letter, not a PowerPoint.

7. SHADOW FOR EVERY STRENGTH. Every gift has a cost. Name it.

8. FRICTION IS THE INTERESTING PART. Where systems agree = confidence. Where they clash = insight. Prioritize clashes.

9. LENGTH DISCIPLINE. Say it in 2 sentences if you can. The entire profile should be around 1800-2200 words. Be concise — say things once, clearly. Shorter and sharper beats long and repetitive.

10. FORBIDDEN WORDS: "unique", "special", "journey", "resonates", "vibration", "frequency", "universe", "manifests", "aligned", "profound mission", "your soul", "gifted" â€” or their ${langName} equivalents.

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
PROFILE DATA
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

NUMEROLOGY:
- Life path: ${n.life_path} â€” ${n.life_path_meaning}
- Expression number: ${n.expression} â€” ${n.expression_meaning}
- Soul urge: ${n.soul_urge} â€” ${n.soul_urge_meaning}
- Personality number: ${n.personality}
- Personal year: ${n.personal_year?.personal_year} of 9 â€” ${n.personal_year?.theme}
- Personal year focus: ${n.personal_year?.focus}
- Personal year warning: ${n.personal_year?.warning}

ASTROLOGY:
- Sun sign: ${a.sun_sign} (element: ${a.element} / modality: ${a.modality})
- Ruling planet: ${a.ruling_planet}
- Core traits: ${a.core_traits?.join(', ')}

HUMAN DESIGN:
- Type: ${hd.type} â†’ translate as: ${translatedType}
- Profile: ${hd.profile}
- Authority: ${hd.authority} â†’ translate as: ${translatedAuthority}
- Strategy: ${hd.strategy} â†’ translate as: ${translatedStrategy}
- Signature (on-track feeling): ${hd.signature}
- Warning signal (off-track feeling): ${hd.not_self_theme_plain}
- Energy description: ${hd.energy_type_plain}
- Work style: ${hd.work_style_plain}
- Incarnation cross: ${hd.incarnation_cross}
- Defined centers: ${translatedDefinedCenters}
- Undefined centers: ${translatedUndefinedCenters}
- Formed channels (ONLY reference these): ${channelsBlock}
- All active gates (ONLY reference these): ${allGatesBlock}

KEY GATES:
${keyGatesBlock}

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
OUTPUT FORMAT â€” RETURN ONLY VALID JSON
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

{
  "archetype": {
    "name": "A 2-4 word evocative name that captures who this person is across all three systems. Not mystical â€” grounded. Examples: 'The Quiet Architect', 'The Reluctant Leader', 'The Builder Who Craves Meaning'. Make this specific person feel recognized.",
    "description": "3-4 sentences. Explain the archetype: what kind of person this describes, what drives them, and the central tension they navigate. Weave HD type (translated, explained), life path theme, and sun sign naturally. End with something they would recognize as deeply true."
  },

  "how_you_work": {
    "surface": "2-3 sentences. How others perceive this person. Draw from: personality number, sun sign traits, defined centers that project outward. Should feel like recognition: 'yes, people do see me that way.'",
    "engine": "2-3 sentences. How they actually operate day-to-day â€” work rhythm, what energizes vs drains. Draw from: HD type + strategy + expression number + relevant defined centers. Specific enough to evaluate their current job against.",
    "core": "2-3 sentences. What drives them underneath â€” the need they might not show anyone. Draw from: life path + soul urge + incarnation cross. This paragraph should make them pause."
  },

  "friction_map": [
    {
      "tension": "Short name for this internal conflict â€” 3-5 words",
      "pull_a": "What one part of the data says â€” be specific about which system and element. 1-2 sentences.",
      "pull_b": "What the opposing part says â€” different system. 1-2 sentences.",
      "daily_experience": "How this shows up in their daily life. 2 sentences. Concrete, recognizable.",
      "resolution": "How to hold both â€” not choose one. 2 sentences. Practical."
    },
    "Same format â€” 3-4 friction points total. Each must involve a REAL clash between different parts of the data.",
    "Third friction point",
    "Fourth friction point (optional â€” only if genuinely present)"
  ],

  "aligned_life": "4-6 sentences painting a concrete picture of what life looks like when this person is operating well. Concrete: what kind of work, autonomy, people, daily rhythm, what their body feels like (reference HD signature). Every sentence testable. Draw from all three systems.",

  "decision_system": [
    "Full paragraph about their HD authority (${translatedAuthority}) in completely human language. How it feels in the body, a concrete daily example, what happens when they override it.",
    "Full paragraph about soul urge ${n.soul_urge} (${n.soul_urge_meaning}) as a decision filter. What they truly want vs what they think they should want.",
    "Full paragraph: one personal operating principle from authority + sun sign + life path. Frame as a rule. Make it memorable and practical."
  ],

  "energy_manual": {
    "peak": "2-3 sentences. When and why energy is highest. Tied to defined centers and HD type. Concrete: activities, conditions, time patterns.",
    "drain": "2-3 sentences. What drains this person. Tied to undefined centers and not-self theme. Warning signs specific to THIS person.",
    "rhythm": "2-3 sentences. How element (${a.element}) and modality (${a.modality}) shape their ideal daily rhythm.",
    "current_year": "2-3 sentences. What personal year ${n.personal_year?.personal_year} (${n.personal_year?.theme}) means for energy right now."
  },

  "warning_signals": [
    {
      "signal": "What the person FEELS â€” a specific physical or emotional sensation they would recognize.",
      "pattern": "What is actually happening â€” traced to their profile. 1-2 sentences.",
      "exit": "One concrete action. Not 'meditate.' Something specific and time-bound."
    },
    "Same format â€” 3-4 signals total. Each from a DIFFERENT part of the data."
  ],

  "strengths": [
    "2-3 sentences. Concrete observation first, then source in data (only real gates/channels). When it shines AND its shadow. Rotate HD/astro/numerology across 5 strengths.",
    "Second strength â€” different system emphasis",
    "Third strength",
    "Fourth strength",
    "Fifth strength"
  ],

  "vulnerabilities": [
    "2-3 sentences. Pattern honestly named, source in data. End with ONE concrete thing to do differently tomorrow.",
    "Same format â€” 4 vulnerabilities total.",
    "Third vulnerability",
    "Fourth vulnerability"
  ],

  "opportunities": [
    "One sentence from ASTROLOGY: where this person naturally draws success. Plain language.",
    "One sentence from NUMEROLOGY: where their impact lands hardest. Plain language.",
    "One sentence from HUMAN DESIGN: where their design wants to be used. Plain language.",
    "One synthesis sentence: a concrete opening available right now."
  ],

  "commitments": [
    "Written as 'I commit to...' â€” specific, personal, grounded in their design. 2-3 sentences.",
    "Written as 'I commit to...' â€” grounded in HD type. 2-3 sentences.",
    "Written as 'I commit to...' â€” grounded in personal year ${n.personal_year?.personal_year}. 2-3 sentences."
  ],

  "accountability_seeds": {
    "identity_anchors": [
      "A short, warm sentence reminding this person who they are at their best. For hard days.",
      "Second anchor â€” different angle.",
      "Third anchor â€” the deepest one."
    ],
    "guided_intentions": [
      {
        "theme": "Single word or short phrase â€” e.g. 'boundaries', 'presence'",
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
  },

  "glossary": {
    "intro": "One sentence in ${langName} introducing the terminology section.",
    "terms": [
      { "term": "Life Path", "definition": "A number from your date of birth describing the central theme of your life." },
      { "term": "Expression Number", "definition": "From your full name at birth â€” describes how you naturally express yourself." },
      { "term": "Soul Urge", "definition": "From the vowels of your name â€” what you truly desire inside." },
      { "term": "Personal Year", "definition": "One of 9 years in a numerological cycle. Each has a different theme." },
      { "term": "Type", "definition": "In Human Design, 5 types of people â€” each with a different energy strategy." },
      { "term": "Authority", "definition": "Your internal decision-making mechanism. Different for each person." },
      { "term": "Center", "definition": "9 energy centers in the body. Defined = consistent. Undefined = absorbs from environment." },
      { "term": "Gate", "definition": "A specific theme in your design â€” each colors how you see an area of life." },
      { "term": "Channel", "definition": "Two compatible active gates form a channel â€” a consistent energy flow." },
      { "term": "Incarnation Cross", "definition": "Four gates describing the overarching theme of your life purpose." }
    ]
  }
}

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
QUALITY CHECK â€” BEFORE OUTPUT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Verify silently:
1. Every word is valid ${langName}. No foreign language leaks.
2. Second person singular throughout. No gender assumptions.
3. Every gate/channel reference exists in the data above.
4. No insight repeated across sections.
5. friction_map tensions are REAL clashes, not manufactured.
6. aligned_life is concrete enough to be testable.
7. warning_signals exits are specific actions, not vague advice.
8. accountability_seeds.guided_intentions are observation practices, not tasks.
9. Total length around 1800-2200 words. Concise, no padding.
10. VOICE: every word common and clear; every descriptive word precise (not approximate); no vague abstract labels. Replace any rare/academic/abstract word with a plain, exact one.

Fix any issues silently. Do not mention this check.`
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ALIGNMENT PLAN PROMPT (updated for v4 field names)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export function buildAlignmentPlanPrompt(calculatedData, profileSections, swot) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology

  return `You are writing an Alignment Plan â€” a practical, concrete guide for how this person should direct their energy over the next 30 days and beyond.

Tone: warm but direct. No vague advice. Every item must be something they can actually do.
Fully in the profile's language â€” no mixed languages. Translate any English data before using it.
NEVER invent gate numbers, channel numbers, or channel names not listed in the data below.
${VOICE_RULES}
PROFILE DATA:
- HD Type: ${hd.type}, Profile ${hd.profile}, Authority: ${hd.authority}
- Incarnation Cross: ${hd.incarnation_cross}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels (only reference these): ${hd.formed_channels?.join(', ') || 'none'}
- Key Gates (only reference these): ${hd.key_gates?.join(' | ')}
- Life Path ${n.life_path} â€” ${n.life_path_meaning}
- Expression ${n.expression} â€” ${n.expression_meaning}
- Soul Urge ${n.soul_urge} â€” ${n.soul_urge_meaning}
- Personal Year ${n.personal_year?.personal_year} of 9: ${n.personal_year?.theme}
- Personal Year Focus: ${n.personal_year?.focus}
- Personal Year Warning: ${n.personal_year?.warning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Archetype: ${profileSections.archetype?.name || ''} â€” ${profileSections.archetype?.description || ''}
- Top Strengths: ${profileSections.strengths?.slice(0,2).join(' | ')}
- Key Frictions: ${profileSections.friction_map?.slice(0,2).map(f => typeof f === 'object' ? f.tension : f).join(' | ') || ''}
- Aligned Life: ${profileSections.aligned_life || ''}
- Opportunities: ${swot.opportunities?.slice(0,2).join(' | ')}

Return ONLY valid JSON, no markdown, no explanation.

{
  "directional_clarity": {
    "life_direction": "3 sentences. Where is this person headed, based on their incarnation cross and life path? Compass, not prescription.",
    "prioritize": [
      "Concrete priority â€” what to say yes to this month, why it connects to their design",
      "Second priority",
      "Third priority"
    ],
    "eliminate": [
      "Concrete thing to stop doing â€” explain why it drains this specific person",
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
      "Morning: specific ritual â€” what, how long, why it works for this person",
      "Midday: specific action â€” concrete, doable",
      "Evening: specific reflection â€” tied to their authority or personal year"
    ]
  },
  "behavioral_anchors": {
    "keystone_habits": [
      "Habit 1 â€” specific, doable, tied to a gate or channel from their data",
      "Habit 2 â€” tied to a numerology number",
      "Habit 3 â€” tied to their HD type or authority"
    ],
    "forbidden_behaviors": [
      "REQUIRED â€” name a specific behavior that derails this person based on their warning signal or undefined centers. Explain exactly why it hurts them.",
      "REQUIRED â€” second forbidden behavior",
      "REQUIRED â€” third forbidden behavior"
    ],
    "non_negotiables": [
      "I... â€” personal agreement, specific, grounded in their design",
      "Second agreement",
      "Third agreement"
    ]
  }
}`
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ACTION PLAN PROMPT (updated for v4 field names)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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

  return `You are creating a personalized daily practice plan â€” 5 to 8 concrete practices this person can start tomorrow.

Each practice must be doable with no equipment, no prior training, no cost.
Each practice must be directly connected to something specific in this person's data.
Tone: practical and warm.
Fully in the profile's language â€” no mixed languages. Translate any English data before using it.
NEVER cite gate or channel numbers not listed in the data below.
${VOICE_RULES}
PROFILE DATA:
- HD Type: ${hd.type} â€” ${typeGuidance[hd.type] || ''}
- Profile: ${hd.profile}
- Authority: ${hd.authority}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels (only reference these): ${hd.formed_channels?.join(', ') || 'none'}
- Key Gates (only reference these):
${hd.key_gates?.join('\n')}
- Life Path ${n.life_path} â€” ${n.life_path_meaning}
- Soul Urge ${n.soul_urge} â€” ${n.soul_urge_meaning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Personal Year ${n.personal_year?.personal_year} of 9: ${n.personal_year?.theme}
- Archetype: ${profileSections.archetype?.name || ''} â€” ${profileSections.archetype?.description || ''}
- Key warning signals: ${profileSections.warning_signals?.slice(0,2).map(w => typeof w === 'object' ? w.signal : w).join(' | ') || ''}

Return ONLY valid JSON, no markdown, no explanation.

{
  "practices": [
    {
      "id": "p1",
      "name": "Short name, max 6 words",
      "when": "morning",
      "duration_minutes": 10,
      "instructions": "Exactly what to do, step by step, in 2-3 concrete sentences.",
      "why_for_you": "One sentence explaining why this practice fits this specific person â€” name only gates/channels/centers that are in the data above.",
      "frequency": "daily"
    }
  ]
}`
}

