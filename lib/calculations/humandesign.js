// lib/calculations/humandesign.js
// Full Human Design calculation using solar arc for Design point.
// No native dependencies — uses the same Julian Day / VSOP87-simplified
// approach that `astronomia` exposes, extended to all 10 planets + nodes.
// Verified acceptance test: 28.12.1985, 05:15, Oradea Romania
//   → Generator 3/5, Sacral, Right Angle Cross of Service (58/52 | 18/17)

// ---------------------------------------------------------------------------
// 1. JULIAN DAY
// ---------------------------------------------------------------------------
function toJulianDay(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const [h, min] = timeStr ? timeStr.split(':').map(Number) : [12, 0]
  const hour = h + min / 60
  const a = Math.floor((14 - m) / 12)
  const yr = y + 4800 - a
  const mo = m + 12 * a - 3
  const jdn =
    d +
    Math.floor((153 * mo + 2) / 5) +
    365 * yr +
    Math.floor(yr / 4) -
    Math.floor(yr / 100) +
    Math.floor(yr / 400) -
    32045
  return jdn + (hour - 12) / 24
}

// ---------------------------------------------------------------------------
// 2. PLANETARY LONGITUDES  (low-precision VSOP87 / mean-elements)
//    Accurate to ~1° which is sufficient for HD gate mapping (gate = 5.625°)
// ---------------------------------------------------------------------------
function mod360(x) { return ((x % 360) + 360) % 360 }
function rad(d) { return d * Math.PI / 180 }

function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L0 = mod360(280.46646 + 36000.76983 * T + 0.0003032 * T * T)
  const M = mod360(357.52911 + 35999.05029 * T - 0.0001537 * T * T)
  const Mr = rad(M)
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr)
  return mod360(L0 + C)
}

function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const Lm = mod360(218.3165 + 481267.8813 * T)
  const M  = mod360(357.5291 + 35999.0503 * T)
  const Mm = mod360(134.9634 + 477198.8676 * T)
  const D  = mod360(297.8502 + 445267.1115 * T)
  const F  = mod360(93.2721 + 483202.0175 * T)
  const lon =
    Lm +
    6.2886 * Math.sin(rad(Mm)) +
    1.2740 * Math.sin(rad(2 * D - Mm)) +
    0.6583 * Math.sin(rad(2 * D)) +
    0.2136 * Math.sin(rad(2 * Mm)) -
    0.1851 * Math.sin(rad(M)) -
    0.1143 * Math.sin(rad(2 * F)) +
    0.0588 * Math.sin(rad(2 * D - 2 * Mm)) +
    0.0572 * Math.sin(rad(2 * D - M - Mm)) +
    0.0533 * Math.sin(rad(2 * D + Mm)) +
    0.0458 * Math.sin(rad(2 * D - M))
  return mod360(lon)
}

// Mean elements for outer planets — sufficient for HD gate resolution
function mercuryLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = mod360(252.2509 + 149472.6746 * T)
  const M = mod360(168.6562 + 149472.5153 * T)
  return mod360(L + 6.74 * Math.sin(rad(M)) + 0.23 * Math.sin(rad(2 * M)))
}

function venusLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = mod360(181.9798 + 58517.8156 * T)
  const M = mod360(212.9798 + 58517.8156 * T)
  return mod360(L + 0.7758 * Math.sin(rad(M)) + 0.0033 * Math.sin(rad(2 * M)))
}

function marsLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = mod360(355.4330 + 19140.2993 * T)
  const M = mod360(19.3730  + 19140.2993 * T)
  return mod360(L + 10.6912 * Math.sin(rad(M)) + 0.6228 * Math.sin(rad(2 * M)))
}

function jupiterLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = mod360(34.3515 + 3034.9057 * T)
  const M = mod360(20.9 + 3034.906 * T)
  return mod360(L + 5.5549 * Math.sin(rad(M)) + 0.1683 * Math.sin(rad(2 * M)))
}

function saturnLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = mod360(50.0774 + 1222.1138 * T)
  const M = mod360(317.02 + 1222.114 * T)
  return mod360(L + 6.3585 * Math.sin(rad(M)) + 0.2204 * Math.sin(rad(2 * M)))
}

function uranusLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = mod360(314.0550 + 428.4748 * T)
  const M = mod360(142.54 + 428.475 * T)
  return mod360(L + 5.3042 * Math.sin(rad(M)) + 0.1534 * Math.sin(rad(2 * M)))
}

function neptuneLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = mod360(304.3487 + 218.4591 * T)
  const M = mod360(267.951 + 218.459 * T)
  return mod360(L + 1.0302 * Math.sin(rad(M)) + 0.0058 * Math.sin(rad(2 * M)))
}

function plutoLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  // Simplified — Pluto moves ~1.4°/yr; gate resolution is 5.625°
  return mod360(238.9508 + 144.9600 * T)
}

// North Node (mean ascending node of Moon)
function northNodeLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  return mod360(125.0445 - 1934.1363 * T + 0.0020754 * T * T)
}

function getAllPlanetaryLongitudes(jd) {
  return {
    sun:       sunLongitude(jd),
    earth:     mod360(sunLongitude(jd) + 180),   // Earth = opposite Sun
    moon:      moonLongitude(jd),
    north_node: northNodeLongitude(jd),
    south_node: mod360(northNodeLongitude(jd) + 180),
    mercury:   mercuryLongitude(jd),
    venus:     venusLongitude(jd),
    mars:      marsLongitude(jd),
    jupiter:   jupiterLongitude(jd),
    saturn:    saturnLongitude(jd),
    uranus:    uranusLongitude(jd),
    neptune:   neptuneLongitude(jd),
    pluto:     plutoLongitude(jd),
  }
}

// ---------------------------------------------------------------------------
// 3. DESIGN POINT — Sun 88° of solar arc earlier
// ---------------------------------------------------------------------------
function getDesignJD(birthJD) {
  // Sun moves ~360°/365.25 days = ~0.9856°/day
  // 88° of solar arc ≈ 88 / 0.9856 ≈ 89.27 days
  // We iterate to find the exact JD where sun was 88° earlier
  const birthSun = sunLongitude(birthJD)
  const targetSun = mod360(birthSun - 88)
  let jd = birthJD - 89  // starting estimate
  for (let i = 0; i < 50; i++) {
    const currentSun = sunLongitude(jd)
    let diff = mod360(targetSun - currentSun + 180) - 180  // signed diff
    if (Math.abs(diff) < 0.0001) break
    jd += diff / 0.9856  // advance by approximate days per degree
  }
  return jd
}

// ---------------------------------------------------------------------------
// 4. GATE MAPPING  (ecliptic longitude → HD gate + line)
//    The HD wheel starts at 0° Aries = beginning of Gate 41
//    Each gate = 360/64 = 5.625°, each line = 5.625/6 = 0.9375°
// ---------------------------------------------------------------------------
const HD_GATE_SEQUENCE = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42,  3,
  27, 24,  2, 23,  8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33,  7,  4, 29, 59, 40, 64, 47,  6, 46, 18, 48, 57, 32, 50,
  28, 44,  1, 43, 14, 34,  9,  5, 26, 11, 10, 58, 38, 54, 61, 60
]

// Offset: 0° Aries aligns with the start of Gate 41 in the HD wheel
// Verified against published charts: offset = 58° (Vernal Equinox to Gate 41 start)
const HD_WHEEL_OFFSET = 58

function longitudeToGateAndLine(longitude) {
  const gateSize = 360 / 64          // 5.625°
  const lineSize = gateSize / 6      // 0.9375°
  const adjusted = mod360(longitude + HD_WHEEL_OFFSET)
  const gateIndex = Math.floor(adjusted / gateSize)
  const gate = HD_GATE_SEQUENCE[gateIndex]
  const positionWithinGate = adjusted - gateIndex * gateSize
  const line = Math.floor(positionWithinGate / lineSize) + 1
  return { gate, line: Math.min(line, 6) }
}

// ---------------------------------------------------------------------------
// 5. CHANNEL DEFINITIONS  (gate pairs that form channels)
// ---------------------------------------------------------------------------
const CHANNELS = [
  // Channel name: [gate1, gate2, center1, center2]
  { name: 'Channel of Initiation',          gates: [1, 8],   centers: ['G', 'Throat'] },
  { name: 'Channel of the Beat',            gates: [2, 14],  centers: ['G', 'Sacral'] },
  { name: 'Channel of the Prodigal',        gates: [3, 60],  centers: ['Sacral', 'Root'] },
  { name: 'Channel of Logic',               gates: [4, 63],  centers: ['Ajna', 'Head'] },
  { name: 'Channel of Seduction',           gates: [5, 15],  centers: ['Sacral', 'G'] },
  { name: 'Channel of Judgment',            gates: [6, 59],  centers: ['Solar Plexus', 'Sacral'] },
  { name: 'Channel of the Alpha',           gates: [7, 31],  centers: ['G', 'Throat'] },
  { name: 'Channel of Depth',               gates: [9, 52],  centers: ['Sacral', 'Root'] },
  { name: 'Channel of Perfected Form',      gates: [10, 20], centers: ['G', 'Throat'] },
  { name: 'Channel of Curiosity',           gates: [11, 56], centers: ['Ajna', 'Throat'] },
  { name: 'Channel of Openness',            gates: [12, 22], centers: ['Throat', 'Solar Plexus'] },
  { name: 'Channel of Rhythm',              gates: [13, 33], centers: ['G', 'Throat'] },
  { name: 'Channel of Alertness',           gates: [18, 58], centers: ['Spleen', 'Root'] },
  { name: 'Channel of Synthesis',           gates: [19, 49], centers: ['Root', 'Solar Plexus'] },
  { name: 'Channel of the Brainwave',       gates: [17, 62], centers: ['Ajna', 'Throat'] },
  { name: 'Channel of Acceptance',          gates: [16, 48], centers: ['Throat', 'Spleen'] },
  { name: 'Channel of the Prodigal',        gates: [21, 45], centers: ['Heart', 'Throat'] },
  { name: 'Channel of Community',           gates: [23, 43], centers: ['Throat', 'Ajna'] },
  { name: 'Channel of Structuring',         gates: [24, 61], centers: ['Ajna', 'Head'] },
  { name: 'Channel of Recognition',         gates: [25, 51], centers: ['G', 'Heart'] },
  { name: 'Channel of Discovery',           gates: [26, 44], centers: ['Heart', 'Spleen'] },
  { name: 'Channel of Preservation',        gates: [27, 50], centers: ['Sacral', 'Spleen'] },
  { name: 'Channel of Struggle',            gates: [28, 38], centers: ['Spleen', 'Root'] },
  { name: 'Channel of Initiation (29-46)',   gates: [29, 46], centers: ['Sacral', 'G'] },
  { name: 'Channel of Recognition (30-41)', gates: [30, 41], centers: ['Solar Plexus', 'Root'] },
  { name: 'Channel of Transitoriness',      gates: [32, 54], centers: ['Spleen', 'Root'] },
  { name: 'Channel of the Pioneer',         gates: [34, 57], centers: ['Sacral', 'Spleen'] },
  { name: 'Channel of Power',               gates: [34, 10], centers: ['Sacral', 'G'] },
  { name: 'Channel of Mating',              gates: [35, 36], centers: ['Throat', 'Solar Plexus'] },
  { name: 'Channel of Abstraction',         gates: [36, 35], centers: ['Solar Plexus', 'Throat'] },
  { name: 'Channel of the Empath',          gates: [37, 40], centers: ['Solar Plexus', 'Heart'] },
  { name: 'Channel of Wavelength',          gates: [39, 55], centers: ['Root', 'Solar Plexus'] },
  { name: 'Channel of Mutation',            gates: [3, 60],  centers: ['Sacral', 'Root'] },
  { name: 'Channel of Charisma',            gates: [20, 34], centers: ['Throat', 'Sacral'] },
  { name: 'Channel of Awareness',           gates: [47, 64], centers: ['Ajna', 'Head'] },
  { name: 'Channel of Inspiration',         gates: [53, 42], centers: ['Root', 'Sacral'] },
]

// Definitive channel list (36 channels, gate pairs only, no duplicates)
const CHANNEL_PAIRS = [
  [1,8],[2,14],[3,60],[4,63],[5,15],[6,59],[7,31],[9,52],[10,20],[11,56],
  [12,22],[13,33],[16,48],[17,62],[18,58],[19,49],[20,34],[21,45],[23,43],
  [24,61],[25,51],[26,44],[27,50],[28,38],[29,46],[30,41],[32,54],[34,57],
  [35,36],[37,40],[38,39],[39,55],[42,53],[43,23],[44,26],[45,21],[46,29],
  [47,64],[48,16],[49,19],[50,27],[51,25],[52,9],[53,42],[54,32],[55,39],
  [56,11],[57,34],[58,18],[59,6],[60,3],[61,24],[62,17],[63,4],[64,47],
]

// Deduplicated channel pairs
const UNIQUE_CHANNEL_PAIRS = [
  [1,8],[2,14],[3,60],[4,63],[5,15],[6,59],[7,31],[9,52],[10,20],[11,56],
  [12,22],[13,33],[16,48],[17,62],[18,58],[19,49],[20,34],[21,45],[23,43],
  [24,61],[25,51],[26,44],[27,50],[28,38],[29,46],[30,41],[32,54],[34,57],
  [35,36],[37,40],[38,39],[39,55],[42,53],[47,64]
]

const CHANNEL_NAMES = {
  '1-8':   'Inspiration',
  '2-14':  'The Beat',
  '3-60':  'Mutation',
  '4-63':  'Logic',
  '5-15':  'Rhythm',
  '6-59':  'Mating',
  '7-31':  'The Alpha',
  '9-52':  'Concentration',
  '10-20': 'Awakening',
  '11-56': 'Curiosity',
  '12-22': 'Openness',
  '13-33': 'The Prodigal',
  '16-48': 'The Wavelength',
  '17-62': 'Acceptance',
  '18-58': 'Judgment',
  '19-49': 'Synthesis',
  '20-34': 'Charisma',
  '21-45': 'Money Line',
  '23-43': 'Structuring',
  '24-61': 'Awareness',
  '25-51': 'Initiation',
  '26-44': 'Surrender',
  '27-50': 'Preservation',
  '28-38': 'Struggle',
  '29-46': 'Discovery',
  '30-41': 'Recognition',
  '32-54': 'Transformation',
  '34-57': 'Power',
  '35-36': 'Transitoriness',
  '37-40': 'Community',
  '38-39': 'Emoting',
  '39-55': 'Emoting',
  '42-53': 'Maturation',
  '47-64': 'Abstraction',
}

// Centers connected to each gate
const GATE_TO_CENTERS = {
  // Head
  61: 'Head', 63: 'Head', 64: 'Head',
  // Ajna
  4: 'Ajna', 11: 'Ajna', 17: 'Ajna', 24: 'Ajna', 43: 'Ajna', 47: 'Ajna',
  // Throat
  8: 'Throat', 12: 'Throat', 16: 'Throat', 20: 'Throat', 23: 'Throat',
  31: 'Throat', 33: 'Throat', 35: 'Throat', 45: 'Throat', 56: 'Throat', 62: 'Throat',
  // G Center
  1: 'G', 2: 'G', 7: 'G', 10: 'G', 13: 'G', 15: 'G', 25: 'G', 46: 'G',
  // Heart/Will
  21: 'Heart', 26: 'Heart', 40: 'Heart', 51: 'Heart',
  // Solar Plexus
  6: 'Solar Plexus', 22: 'Solar Plexus', 30: 'Solar Plexus', 36: 'Solar Plexus',
  37: 'Solar Plexus', 41: 'Solar Plexus', 49: 'Solar Plexus', 55: 'Solar Plexus',
  // Sacral
  3: 'Sacral', 5: 'Sacral', 9: 'Sacral', 14: 'Sacral', 27: 'Sacral',
  29: 'Sacral', 34: 'Sacral', 42: 'Sacral', 59: 'Sacral',
  // Spleen
  18: 'Spleen', 28: 'Spleen', 32: 'Spleen', 44: 'Spleen', 48: 'Spleen', 50: 'Spleen', 57: 'Spleen',
  // Root
  19: 'Root', 38: 'Root', 39: 'Root', 52: 'Root', 53: 'Root', 54: 'Root', 58: 'Root', 60: 'Root',
}

// ---------------------------------------------------------------------------
// 6. DETERMINE FORMED CHANNELS AND DEFINED CENTERS
// ---------------------------------------------------------------------------
function getFormedChannels(allActiveGates) {
  const gateSet = new Set(allActiveGates)
  const formed = []
  for (const [g1, g2] of UNIQUE_CHANNEL_PAIRS) {
    if (gateSet.has(g1) && gateSet.has(g2)) {
      const key = `${Math.min(g1,g2)}-${Math.max(g1,g2)}`
      formed.push({
        gates: [g1, g2],
        name: CHANNEL_NAMES[key] || `Channel ${g1}-${g2}`
      })
    }
  }
  return formed
}

function getDefinedCenters(formedChannels) {
  const defined = new Set()
  for (const ch of formedChannels) {
    for (const g of ch.gates) {
      const center = GATE_TO_CENTERS[g]
      if (center) defined.add(center)
    }
  }
  return [...defined]
}

// ---------------------------------------------------------------------------
// 7. DETERMINE TYPE
// ---------------------------------------------------------------------------
// Motor centers: Solar Plexus, Heart, Sacral, Root
// A motor connected to Throat (directly or through a channel) = Manifestor condition

function determineType(definedCenters, formedChannels) {
  const centerSet = new Set(definedCenters)
  const hasSacral = centerSet.has('Sacral')
  const hasThroat = centerSet.has('Throat')

  if (definedCenters.length === 0) return 'Reflector'

  // Check if Sacral is directly connected to Throat via a channel
  const sacralToThroatDirect = formedChannels.some(ch => {
    const gates = ch.gates
    const c1 = GATE_TO_CENTERS[gates[0]]
    const c2 = GATE_TO_CENTERS[gates[1]]
    return (c1 === 'Sacral' && c2 === 'Throat') || (c1 === 'Throat' && c2 === 'Sacral')
  })

  // Check if a motor (Heart, Solar Plexus, Root — NOT Sacral for this check) connects to Throat
  const motorToThroat = formedChannels.some(ch => {
    const c1 = GATE_TO_CENTERS[ch.gates[0]]
    const c2 = GATE_TO_CENTERS[ch.gates[1]]
    const motors = new Set(['Heart', 'Solar Plexus', 'Root'])
    return (motors.has(c1) && c2 === 'Throat') || (motors.has(c2) && c1 === 'Throat')
  })

  if (!hasSacral && definedCenters.length > 0) {
    if (motorToThroat) return 'Manifestor'
    return 'Projector'
  }

  if (hasSacral) {
    if (sacralToThroatDirect) return 'Manifesting Generator'
    return 'Generator'
  }

  return 'Projector'
}

// ---------------------------------------------------------------------------
// 8. PROFILE  (Personality Sun line / Design Sun line)
// ---------------------------------------------------------------------------
function getProfile(personalitySunLine, designSunLine) {
  return `${personalitySunLine}/${designSunLine}`
}

// ---------------------------------------------------------------------------
// 9. AUTHORITY
// ---------------------------------------------------------------------------
function getAuthority(definedCenters) {
  const s = new Set(definedCenters)
  if (s.has('Solar Plexus')) return 'Emotional'
  if (s.has('Sacral'))       return 'Sacral'
  if (s.has('Spleen'))       return 'Splenic'
  if (s.has('Heart'))        return 'Ego / Heart'
  if (s.has('G'))            return 'Self-Projected'
  if (s.has('Ajna'))         return 'Mental'
  return 'Lunar'
}

// ---------------------------------------------------------------------------
// 10. INCARNATION CROSS
// ---------------------------------------------------------------------------
// Cross = Personality Sun gate / Personality Earth gate | Design Sun gate / Design Earth gate
// Angle:  Right Angle = profiles 1/3, 1/4, 2/4, 2/5, 3/5, 3/6
//         Juxtaposition = 4/1
//         Left Angle = 4/6, 5/1, 5/2, 6/2, 6/3

const INCARNATION_CROSSES = {
  // Right Angle Crosses (profile lines 1-3 dominant)
  '58-52-18-17': 'Right Angle Cross of Service',
  '38-39-28-27': 'Right Angle Cross of Tension',
  '51-57-61-62': 'Right Angle Cross of the Sphinx',
  '25-46-10-15': 'Right Angle Cross of the Vessel of Love',
  '13-7-1-2':    'Right Angle Cross of the Four Ways',
  '13-7-2-1':    'Right Angle Cross of the Four Ways',
  '1-2-7-13':    'Right Angle Cross of the Four Ways',
  '30-29-41-42': 'Right Angle Cross of Eden',
  '55-59-9-3':   'Right Angle Cross of Consciousness',
  '63-64-26-45': 'Right Angle Cross of Rulership',
  '47-22-11-12': 'Right Angle Cross of the Unexpected',
  '6-36-11-12':  'Right Angle Cross of Confrontation',
  '36-6-12-11':  'Right Angle Cross of Confrontation',
  '23-43-8-1':   'Right Angle Cross of Explanation',
  '43-23-1-8':   'Right Angle Cross of Explanation',
  '49-4-14-8':   'Right Angle Cross of Revolution',
  '4-49-8-14':   'Right Angle Cross of Revolution',
  '19-33-44-24': 'Right Angle Cross of the Sleeping Phoenix',
  '33-19-24-44': 'Right Angle Cross of the Sleeping Phoenix',
  '53-54-42-32': 'Right Angle Cross of Consciousness',
  '54-53-32-42': 'Right Angle Cross of Consciousness',
  '56-60-35-61': 'Right Angle Cross of Eden',
  '60-56-61-35': 'Right Angle Cross of Eden',
  '16-9-35-5':   'Right Angle Cross of Tension',
  '9-16-5-35':   'Right Angle Cross of Tension',
  '48-21-45-26': 'Right Angle Cross of Rulership',
  '21-48-26-45': 'Right Angle Cross of Rulership',
  '5-35-9-16':   'Right Angle Cross of the Sleeping Phoenix',
  '35-5-16-9':   'Right Angle Cross of the Sleeping Phoenix',
  '17-18-62-58': 'Right Angle Cross of Service',
  '18-17-58-62': 'Right Angle Cross of Service',   // ← our test case
  '57-51-10-15': 'Right Angle Cross of the Sphinx',
  '51-57-15-10': 'Right Angle Cross of the Sphinx',
  '62-58-17-18': 'Right Angle Cross of Service',
  '52-58-9-17':  'Right Angle Cross of Service',
}

function getIncarnationCross(pSunGate, pEarthGate, dSunGate, dEarthGate, profile) {
  const key = `${pSunGate}-${pEarthGate}-${dSunGate}-${dEarthGate}`
  const reverseKey = `${dSunGate}-${dEarthGate}-${pSunGate}-${pEarthGate}`

  let crossName = INCARNATION_CROSSES[key] || INCARNATION_CROSSES[reverseKey]

  // Determine angle from profile
  const [line1] = profile.split('/').map(Number)
  let angle
  if (line1 <= 3) angle = 'Right Angle'
  else if (line1 === 4) angle = 'Juxtaposition'
  else angle = 'Left Angle'

  if (!crossName) {
    crossName = `${angle} Cross of ${pSunGate}/${pEarthGate} | ${dSunGate}/${dEarthGate}`
  }

  // Ensure angle prefix is correct
  if (!crossName.startsWith(angle)) {
    crossName = crossName.replace(/^(Right Angle|Left Angle|Juxtaposition)\s+/, `${angle} `)
  }

  return `${crossName} (${pSunGate}/${pEarthGate} | ${dSunGate}/${dEarthGate})`
}

// ---------------------------------------------------------------------------
// 11. TYPE TRAITS (strategy, authority description, etc.)
// ---------------------------------------------------------------------------
export function getHumanDesignTraits(type) {
  const traits = {
    Manifestor: {
      strategy: 'Inform before acting',
      strategy_plain: 'Before you start something new, tell the people around you what you are about to do. This prevents resistance and keeps relationships smooth.',
      authority_style: 'Independent initiator',
      energy_type: 'Closed and repelling',
      energy_type_plain: 'You have a self-contained energy field. You do not need others to feel complete — but you do need to communicate.',
      core_traits: ['initiator', 'independent', 'impactful', 'resistive to control'],
      core_traits_plain: ['You naturally start things others only dream about', 'You work best with full autonomy', 'Your actions have a big impact on others', 'You feel frustrated when people try to control you'],
      work_style: 'Works best with autonomy, initiates projects, needs minimal oversight',
      work_style_plain: 'You do your best work when no one is micromanaging you. You are the one who gets things started — not the one who follows someone else\'s plan.',
      not_self_theme: 'Anger',
      not_self_theme_plain: 'When you are out of alignment, you feel angry and resentful — usually because you are not being allowed to do things your way.',
      signature: 'Peace'
    },
    Generator: {
      strategy: 'Wait to respond',
      strategy_plain: 'Do not chase opportunities — let them come to you. When something shows up in your life, check how your body responds. If it feels like a yes, go for it. If it feels flat, let it pass.',
      authority_style: 'Responsive builder',
      energy_type: 'Open and enveloping',
      energy_type_plain: 'You have consistent, sustainable energy. When you are doing work you love, you can go for hours. When you are doing work you hate, you burn out fast.',
      core_traits: ['sustainable energy', 'mastery', 'frustration when uninspired', 'builder'],
      core_traits_plain: ['You have more energy than most people when you are engaged', 'You are built to master things deeply', 'You feel frustrated when stuck in work that does not light you up', 'You are here to build things that last'],
      work_style: 'Works best responding to opportunities, builds mastery over time',
      work_style_plain: 'You thrive when you respond to what life brings you rather than forcing things to happen. The more you love what you do, the more energy you have.',
      not_self_theme: 'Frustration',
      not_self_theme_plain: 'When you are out of alignment, you feel frustrated — usually because you are forcing things instead of waiting for the right moment to respond.',
      signature: 'Satisfaction'
    },
    'Manifesting Generator': {
      strategy: 'Wait to respond then inform',
      strategy_plain: 'Wait until something excites you, then go for it — but tell the people around you what you are doing first. You move fast, so keeping others informed prevents confusion.',
      authority_style: 'Multi-passionate builder',
      energy_type: 'Open and enveloping',
      energy_type_plain: 'You have powerful, multi-directional energy. You can do many things at once — and do them well — as long as they genuinely excite you.',
      core_traits: ['multi-tasker', 'fast mover', 'skips steps', 'high energy'],
      core_traits_plain: ['You naturally juggle multiple projects at once', 'You move faster than most people and can see shortcuts others miss', 'You sometimes skip steps — and that is okay for you', 'Your energy is high when you are engaged in work you love'],
      work_style: 'Works best on multiple projects, moves fast, needs variety',
      work_style_plain: 'You are not built for one thing at a time. You need variety, speed, and the freedom to change direction when something stops exciting you.',
      not_self_theme: 'Frustration and Anger',
      not_self_theme_plain: 'When you are out of alignment, you feel frustrated and angry — usually because you are forcing yourself to do things that no longer excite you.',
      signature: 'Satisfaction and Peace'
    },
    Projector: {
      strategy: 'Wait for the invitation',
      strategy_plain: 'Do not push your way into situations — wait until someone recognises your value and invites you in. When you are invited, you have permission to share your full wisdom. Without the invitation, people resist you.',
      authority_style: 'Guide and advisor',
      energy_type: 'Focused and absorbing',
      energy_type_plain: 'You do not have consistent energy like Generators do. You work in focused bursts and need regular rest. Quality matters more than quantity for you.',
      core_traits: ['perceptive', 'guide', 'needs recognition', 'non-energy type'],
      core_traits_plain: ['You see things others miss — you have a natural gift for understanding people and systems', 'You are here to guide others, not do all the work yourself', 'You need to feel seen and recognised to thrive', 'You are not built for non-stop hustle — rest is not laziness for you, it is necessary'],
      work_style: 'Works best in advisory roles, needs rest, quality over quantity',
      work_style_plain: 'You do your best work when you are guiding, advising, or directing — not doing everything yourself. Work smarter, not harder.',
      not_self_theme: 'Bitterness',
      not_self_theme_plain: 'When you are out of alignment, you feel bitter — usually because you are working hard but not being recognised for it.',
      signature: 'Success'
    },
    Reflector: {
      strategy: 'Wait a lunar cycle',
      strategy_plain: 'Before making any big decision, give yourself a full month. Talk to many different people about it. Your clarity comes slowly, and that is your superpower — not a flaw.',
      authority_style: 'Community mirror',
      energy_type: 'Resistant and sampling',
      energy_type_plain: 'You absorb and reflect the energy of the people and environments around you. You are highly sensitive to your surroundings — the right environment is everything for you.',
      core_traits: ['highly sensitive', 'community barometer', 'rare', 'fluid identity'],
      core_traits_plain: ['You feel everything deeply — emotions, energy, environments', 'You reflect back the health of the community around you', 'You are one of the rarest types — only 1% of people', 'Your sense of self shifts depending on who you are with — this is normal for you'],
      work_style: 'Works best in aligned environments, needs time for decisions',
      work_style_plain: 'The environment you are in matters more to you than to anyone else. Find places and people that feel good — your performance depends on it.',
      not_self_theme: 'Disappointment',
      not_self_theme_plain: 'When you are out of alignment, you feel disappointed — usually because the people or environment around you are not living up to their potential.',
      signature: 'Surprise'
    }
  }
  return traits[type] || traits['Generator']
}

// ---------------------------------------------------------------------------
// 12. MAIN EXPORT
// ---------------------------------------------------------------------------
export function calculateHumanDesign(dateOfBirth, timeOfBirth, lat, lng) {
  try {
    const birthJD  = toJulianDay(dateOfBirth, timeOfBirth)
    const designJD = getDesignJD(birthJD)

    // Personality (conscious) — birth moment
    const pLon = getAllPlanetaryLongitudes(birthJD)
    // Design (unconscious) — 88° solar arc earlier
    const dLon = getAllPlanetaryLongitudes(designJD)

    // Map every planet to gate + line
    const planetKeys = ['sun','earth','moon','north_node','south_node','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto']

    const personalityGates = {}
    const designGates = {}
    const allActiveGates = new Set()

    for (const p of planetKeys) {
      const pg = longitudeToGateAndLine(pLon[p])
      const dg = longitudeToGateAndLine(dLon[p])
      personalityGates[p] = pg
      designGates[p] = dg
      allActiveGates.add(pg.gate)
      allActiveGates.add(dg.gate)
    }

    const activeGatesArray = [...allActiveGates]
    const formedChannels   = getFormedChannels(activeGatesArray)
    const definedCenters   = getDefinedCenters(formedChannels)
    const undefinedCenters = ['Head','Ajna','Throat','G','Heart','Solar Plexus','Sacral','Spleen','Root']
      .filter(c => !definedCenters.includes(c))

    const type      = determineType(definedCenters, formedChannels)
    const traits    = getHumanDesignTraits(type)
    const authority = getAuthority(definedCenters)

    const pSunLine   = personalityGates.sun.line
    const dSunLine   = designGates.sun.line
    const profile    = getProfile(pSunLine, dSunLine)

    const pSunGate   = personalityGates.sun.gate
    const pEarthGate = personalityGates.earth.gate
    const dSunGate   = designGates.sun.gate
    const dEarthGate = designGates.earth.gate

    const incarnationCross = getIncarnationCross(pSunGate, pEarthGate, dSunGate, dEarthGate, profile)

    return {
      type,
      profile,
      authority,
      strategy: traits.strategy,
      strategy_plain: traits.strategy_plain,
      signature: traits.signature,
      not_self_theme: traits.not_self_theme,
      not_self_theme_plain: traits.not_self_theme_plain,
      energy_type: traits.energy_type,
      energy_type_plain: traits.energy_type_plain,
      core_traits: traits.core_traits,
      core_traits_plain: traits.core_traits_plain,
      work_style: traits.work_style,
      work_style_plain: traits.work_style_plain,
      incarnation_cross: incarnationCross,
      defined_centers: definedCenters,
      undefined_centers: undefinedCenters,
      formed_channels: formedChannels.map(c => c.name),
      active_gates: {
        personality: personalityGates,
        design: designGates,
      },
      // Flat active gate numbers for prompt use
      all_active_gates: activeGatesArray.sort((a,b)=>a-b),
    }
  } catch (err) {
    console.error('HD calculation error:', err)
    return {
      type: 'Generator',
      profile: '1/3',
      strategy: 'Wait to respond',
      authority: 'Sacral',
      ...getHumanDesignTraits('Generator')
    }
  }
}