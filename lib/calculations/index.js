// lib/calculations/index.js
import { calculateNumerology } from './numerology.js'
import { calculateAstrology } from './astrology.js'
import { calculateHumanDesign } from './humandesign.js'

// Gate meanings — short phrases the AI can quote directly in the profile
const GATE_MEANINGS = {
  1:  'Creative Self-Expression',       2:  'Receptive Direction',
  3:  'Ordering Through Chaos',         4:  'Logical Answers',
  5:  'Fixed Rhythms',                  6:  'Friction & Intimacy',
  7:  'The Role of the Self',           8:  'Contribution',
  9:  'Focus & Determination',          10: 'Behavior of the Self',
  11: 'Ideas & Peace',                  12: 'Caution & Standstill',
  13: 'The Listener',                   14: 'Possession in Great Measure',
  15: 'Extremes',                       16: 'Enthusiasm & Skills',
  17: 'Following & Opinions',           18: 'Correction',
  19: 'Wanting',                        20: 'The Now',
  21: 'Control',                        22: 'Openness & Grace',
  23: 'Assimilation',                   24: 'Rationalization',
  25: 'Innocence',                      26: 'The Egoist',
  27: 'Caring',                         28: 'The Game Player',
  29: 'Saying Yes',                     30: 'Desire & Feelings',
  31: 'Influence & Leading',            32: 'Continuity',
  33: 'Privacy & Retreat',              34: 'Power',
  35: 'Change & Progress',              36: 'Crisis & Learning',
  37: 'Friendship',                     38: 'Opposition & Purpose',
  39: 'Provocation',                    40: 'Aloneness & Delivery',
  41: 'Contraction & Imagination',      42: 'Growth & Completion',
  43: 'Insight & Breakthrough',         44: 'Alertness',
  45: 'Gathering',                      46: 'Love of the Body',
  47: 'Realization',                    48: 'Depth',
  49: 'Revolution & Principles',        50: 'Values',
  51: 'Shock & Initiation',             52: 'Stillness',
  53: 'Starting Things',                54: 'Ambition',
  55: 'Abundance & Moodiness',          56: 'Stimulation',
  57: 'Intuitive Clarity',              58: 'Joy & Vitality',
  59: 'Sexuality & Intimacy',           60: 'Acceptance of Limits',
  61: 'Inner Truth',                    62: 'Detail & Routine',
  63: 'Doubt & Questioning',            64: 'Confusion before Clarity',
}

// Life path number meanings — short phrase for prompt context
const LIFE_PATH_MEANINGS = {
  1:  'the Independent Pioneer',
  2:  'the Cooperative Mediator',
  3:  'the Creative Communicator',
  4:  'the Disciplined Builder',
  5:  'the Freedom-Seeking Adventurer',
  6:  'the Nurturing Caretaker',
  7:  'the Introspective Seeker',
  8:  'the Ambitious Achiever',
  9:  'the Compassionate Humanitarian',
  11: 'the Intuitive Visionary (Master 11)',
  22: 'the Master Builder (Master 22)',
  33: 'the Master Teacher (Master 33)',
}

const EXPRESSION_MEANINGS = {
  1: 'natural leadership and originality',
  2: 'diplomacy and sensitivity to others',
  3: 'expressive creativity and social magnetism',
  4: 'practical discipline and systematic thinking',
  5: 'versatility and hunger for experience',
  6: 'responsibility, care, and aesthetic sense',
  7: 'analytical depth and spiritual searching',
  8: 'executive power and material mastery',
  9: 'broad humanitarian vision',
  11: 'heightened intuition and inspirational presence',
  22: 'visionary capacity to build at scale',
  33: 'selfless teaching and healing energy',
}

const SOUL_URGE_MEANINGS = {
  1: 'a deep inner drive for independence and recognition',
  2: 'a soul-level need for peace, love, and connection',
  3: 'an inner craving for self-expression and joy',
  4: 'a core desire for security, order, and solid foundations',
  5: 'an inner hunger for freedom and variety',
  6: 'a soul need to love, protect, and create harmony',
  7: 'a deep yearning for truth, solitude, and inner knowing',
  8: 'an inner drive for power, success, and influence',
  9: 'a soul-level pull toward service and universal love',
  11: 'a deep desire to inspire and illuminate others',
  22: 'an inner calling to build something lasting and meaningful',
  33: 'a soul mission of healing through compassionate teaching',
}

export function calculateFullProfile(fullName, dateOfBirth, timeOfBirth, lat, lng, language = 'en') {
  const numerology  = calculateNumerology(fullName, dateOfBirth, language)
  const astrology   = calculateAstrology(dateOfBirth)
  const humanDesign = calculateHumanDesign(dateOfBirth, timeOfBirth, lat, lng)

  // Build the enriched context object passed to the AI
  const enriched = buildEnrichedContext(numerology, astrology, humanDesign)

  return {
    numerology,
    astrology,
    human_design: humanDesign,
    enriched,       // ← this is what the prompt builder now uses
  }
}

function buildEnrichedContext(numerology, astrology, humanDesign) {
  const hd = humanDesign

  // Annotate active gates with their meanings
  const personalityGateList = hd.active_gates?.personality
    ? Object.entries(hd.active_gates.personality).map(([planet, { gate, line }]) => ({
        planet,
        gate,
        line,
        meaning: GATE_MEANINGS[gate] || `Gate ${gate}`,
      }))
    : []

  const designGateList = hd.active_gates?.design
    ? Object.entries(hd.active_gates.design).map(([planet, { gate, line }]) => ({
        planet,
        gate,
        line,
        meaning: GATE_MEANINGS[gate] || `Gate ${gate}`,
      }))
    : []

  // Key gates to highlight (Sun + Earth = most important for identity)
  const pSun   = hd.active_gates?.personality?.sun
  const pEarth = hd.active_gates?.personality?.earth
  const dSun   = hd.active_gates?.design?.sun
  const dEarth = hd.active_gates?.design?.earth

  const keyGates = []
  if (pSun)   keyGates.push(`Personality Sun: Gate ${pSun.gate} Line ${pSun.line} — ${GATE_MEANINGS[pSun.gate] || ''}`)
  if (pEarth) keyGates.push(`Personality Earth: Gate ${pEarth.gate} Line ${pEarth.line} — ${GATE_MEANINGS[pEarth.gate] || ''}`)
  if (dSun)   keyGates.push(`Design Sun: Gate ${dSun.gate} Line ${dSun.line} — ${GATE_MEANINGS[dSun.gate] || ''}`)
  if (dEarth) keyGates.push(`Design Earth: Gate ${dEarth.gate} Line ${dEarth.line} — ${GATE_MEANINGS[dEarth.gate] || ''}`)

  return {
    numerology: {
      life_path:        numerology.life_path,
      life_path_meaning: LIFE_PATH_MEANINGS[numerology.life_path] || '',
      expression:        numerology.expression,
      expression_meaning: EXPRESSION_MEANINGS[numerology.expression] || '',
      soul_urge:         numerology.soul_urge,
      soul_urge_meaning: SOUL_URGE_MEANINGS[numerology.soul_urge] || '',
      personality:       numerology.personality,
      personal_year:     numerology.personal_year,
    },
    astrology: {
      sun_sign:      astrology.sun_sign,
      element:       astrology.element,
      modality:      astrology.modality,
      ruling_planet: astrology.ruling_planet,
      core_traits:   astrology.core_traits,
    },
    human_design: {
      type:             hd.type,
      profile:          hd.profile,
      authority:        hd.authority,
      strategy:         hd.strategy,
      strategy_plain:   hd.strategy_plain,
      signature:        hd.signature,
      not_self_theme:   hd.not_self_theme,
      not_self_theme_plain: hd.not_self_theme_plain,
      energy_type_plain: hd.energy_type_plain,
      core_traits_plain: hd.core_traits_plain,
      work_style_plain:  hd.work_style_plain,
      incarnation_cross:  hd.incarnation_cross,
      defined_centers:    hd.defined_centers,
      undefined_centers:  hd.undefined_centers,
      formed_channels:    hd.formed_channels,
      all_active_gates:   hd.all_active_gates,
      key_gates:          keyGates,
      personality_gates:  personalityGateList,
      design_gates:       designGateList,
    },
  }
}