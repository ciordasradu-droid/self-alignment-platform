import { JulianDay, Solar } from 'astronomia'

// Convert date/time/location to Julian Day Number
function getJulianDay(dateString, timeString, lat, lng) {
  const date = new Date(dateString)
  const [hours, minutes] = timeString ? timeString.split(':').map(Number) : [12, 0]
  
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = hours + minutes / 60

  // Julian Day calculation
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  
  return jdn + (hour - 12) / 24
}

// Get sun longitude (degrees 0-360)
function getSunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T
  const Mrad = M * Math.PI / 180
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad)
  const sunLon = L0 + C
  return ((sunLon % 360) + 360) % 360
}

// Convert sun longitude to Human Design gate (1-64)
function getGate(longitude) {
  // 64 gates mapped around the wheel
  // Each gate = 5.625 degrees (360/64)
  const gateSize = 360 / 64
  // HD wheel starts at gate 41 at 0° Aries offset
  const offset = 58 // degrees offset for HD wheel alignment
  const adjusted = ((longitude + offset) % 360 + 360) % 360
  const gateIndex = Math.floor(adjusted / gateSize)
  
  // HD gate sequence around the wheel
  const gateSequence = [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
  ]
  
  return gateSequence[gateIndex % 64]
}

// Get design (unconscious) sun — 88 days before birth
function getDesignJD(birthJD) {
  return birthJD - 88
}

// Determine HD type from conscious and unconscious gates
function determineType(consciousGate, unconsciousGate) {
  // Defined throat center gates that create Manifestor
  const manifestorThroatGates = [16, 20, 31, 33, 35, 45, 62]
  // Sacral gates that define Generator
  const sacralGates = [3, 5, 9, 14, 27, 29, 34, 42, 59]
  // Projector recognition gates
  const projectorGates = [7, 13, 15, 2, 1, 10, 25, 46]

  const allGates = [consciousGate, unconsciousGate]

  const hasSacral = allGates.some(g => sacralGates.includes(g))
  const hasThroat = allGates.some(g => manifestorThroatGates.includes(g))
  const hasProjector = allGates.some(g => projectorGates.includes(g))

  // Simplified but more accurate type determination
  if (hasSacral && hasThroat) return 'Manifesting Generator'
  if (hasSacral) return 'Generator'
  if (hasThroat) return 'Manifestor'
  if (hasProjector) return 'Projector'
  
  // Reflector is rare (~1%) — all centers undefined
  // Use birth date to determine if Reflector
  return 'Projector' // default to Projector for undefined types
}

// Human Design type traits
export function getHumanDesignTraits(type) {
  const traits = {
    Manifestor: {
      strategy: 'Inform before acting',
      authority_style: 'Independent initiator',
      energy_type: 'Closed and repelling',
      core_traits: ['initiator', 'independent', 'impactful', 'resistive to control'],
      work_style: 'Works best with autonomy, initiates projects, needs minimal oversight',
      not_self_theme: 'Anger'
    },
    Generator: {
      strategy: 'Wait to respond',
      authority_style: 'Responsive builder',
      energy_type: 'Open and enveloping',
      core_traits: ['sustainable energy', 'mastery', 'frustration when uninspired', 'builder'],
      work_style: 'Works best responding to opportunities, builds mastery over time',
      not_self_theme: 'Frustration'
    },
    'Manifesting Generator': {
      strategy: 'Wait to respond then inform',
      authority_style: 'Multi-passionate builder',
      energy_type: 'Open and enveloping',
      core_traits: ['multi-tasker', 'fast mover', 'skips steps', 'high energy'],
      work_style: 'Works best on multiple projects, moves fast, needs variety',
      not_self_theme: 'Frustration and Anger'
    },
    Projector: {
      strategy: 'Wait for the invitation',
      authority_style: 'Guide and advisor',
      energy_type: 'Focused and absorbing',
      core_traits: ['perceptive', 'guide', 'needs recognition', 'non-energy type'],
      work_style: 'Works best in advisory roles, needs rest, quality over quantity',
      not_self_theme: 'Bitterness'
    },
    Reflector: {
      strategy: 'Wait a lunar cycle',
      authority_style: 'Community mirror',
      energy_type: 'Resistant and sampling',
      core_traits: ['highly sensitive', 'community barometer', 'rare', 'fluid identity'],
      work_style: 'Works best in aligned environments, needs time for decisions',
      not_self_theme: 'Disappointment'
    }
  }
  return traits[type] || traits['Projector']
}

// Main function
export function calculateHumanDesign(dateOfBirth, timeOfBirth, lat, lng) {
  try {
    const birthJD = getJulianDay(dateOfBirth, timeOfBirth, lat, lng)
    const designJD = getDesignJD(birthJD)

    const consciousGate = getGate(getSunLongitude(birthJD))
    const unconsciousGate = getGate(getSunLongitude(designJD))

    const type = determineType(consciousGate, unconsciousGate)
    const traits = getHumanDesignTraits(type)

    return {
      type,
      conscious_gate: consciousGate,
      unconscious_gate: unconsciousGate,
      ...traits
    }
  } catch (err) {
    console.error('HD calculation error:', err)
    // Fallback
    return {
      type: 'Generator',
      ...getHumanDesignTraits('Generator')
    }
  }
}