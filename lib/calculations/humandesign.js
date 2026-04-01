// Human Design Type based on astronomical calculation
function getJulianDay(dateString, timeString) {
  const date = new Date(dateString)
  const [hours, minutes] = timeString ? timeString.split(':').map(Number) : [12, 0]

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = hours + minutes / 60

  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3

  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045

  return jdn + (hour - 12) / 24
}

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

function getGate(longitude) {
  const gateSize = 360 / 64
  const offset = 58
  const adjusted = ((longitude + offset) % 360 + 360) % 360
  const gateIndex = Math.floor(adjusted / gateSize)

  const gateSequence = [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
  ]

  return gateSequence[gateIndex % 64]
}

function getDesignJD(birthJD) {
  return birthJD - 88
}

function determineType(consciousGate, unconsciousGate) {
  const manifestorThroatGates = [16, 20, 31, 33, 35, 45, 62]
  const sacralGates = [3, 5, 9, 14, 27, 29, 34, 42, 59]
  const projectorGates = [7, 13, 15, 2, 1, 10, 25, 46]

  const allGates = [consciousGate, unconsciousGate]

  const hasSacral = allGates.some(g => sacralGates.includes(g))
  const hasThroat = allGates.some(g => manifestorThroatGates.includes(g))
  const hasProjector = allGates.some(g => projectorGates.includes(g))

  if (hasSacral && hasThroat) return 'Manifesting Generator'
  if (hasSacral) return 'Generator'
  if (hasThroat) return 'Manifestor'
  if (hasProjector) return 'Projector'
  return 'Projector'
}

function getProfile(consciousGate) {
  const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3']
  return profiles[consciousGate % 12]
}

function getAuthority(type) {
  const authorities = {
    'Generator': 'Sacral Authority',
    'Manifesting Generator': 'Sacral Authority',
    'Manifestor': 'Emotional or Splenic Authority',
    'Projector': 'Splenic or Emotional Authority',
    'Reflector': 'Lunar Authority'
  }
  return authorities[type] || 'Sacral Authority'
}

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
      not_self_theme_plain: 'When you are out of alignment, you feel angry and resentful — usually because you are not being allowed to do things your way.'
    },
    Generator: {
      strategy: 'Wait to respond',
      strategy_plain: 'Do not chase opportunities — let them come to you. When something shows up in your life, check how your body responds. If it feels like a "yes", go for it. If it feels flat, let it pass.',
      authority_style: 'Responsive builder',
      energy_type: 'Open and enveloping',
      energy_type_plain: 'You have consistent, sustainable energy. When you are doing work you love, you can go for hours. When you are doing work you hate, you burn out fast.',
      core_traits: ['sustainable energy', 'mastery', 'frustration when uninspired', 'builder'],
      core_traits_plain: ['You have more energy than most people when you are engaged', 'You are built to master things deeply', 'You feel frustrated when stuck in work that does not light you up', 'You are here to build things that last'],
      work_style: 'Works best responding to opportunities, builds mastery over time',
      work_style_plain: 'You thrive when you respond to what life brings you rather than forcing things to happen. The more you love what you do, the more energy you have.',
      not_self_theme: 'Frustration',
      not_self_theme_plain: 'When you are out of alignment, you feel frustrated — usually because you are forcing things instead of waiting for the right moment to respond.'
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
      not_self_theme_plain: 'When you are out of alignment, you feel frustrated and angry — usually because you are forcing yourself to do things that no longer excite you.'
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
      not_self_theme_plain: 'When you are out of alignment, you feel bitter — usually because you are working hard but not being recognised for it.'
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
      not_self_theme_plain: 'When you are out of alignment, you feel disappointed — usually because the people or environment around you are not living up to their potential.'
    }
  }

  return traits[type] || traits['Generator']
}

export function calculateHumanDesign(dateOfBirth, timeOfBirth, lat, lng) {
  try {
    const birthJD = getJulianDay(dateOfBirth, timeOfBirth)
    const designJD = getDesignJD(birthJD)

    const consciousGate = getGate(getSunLongitude(birthJD))
    const unconsciousGate = getGate(getSunLongitude(designJD))

    const type = determineType(consciousGate, unconsciousGate)
    const traits = getHumanDesignTraits(type)
    const profile = getProfile(consciousGate)
    const authority = getAuthority(type)

    return {
      type,
      profile,
      strategy: traits.strategy,
      authority,
      conscious_gate: consciousGate,
      unconscious_gate: unconsciousGate,
      ...traits
    }
  } catch (err) {
    console.error('HD calculation error:', err)
    return {
      type: 'Generator',
      profile: '1/3',
      strategy: 'Wait to respond',
      authority: 'Sacral Authority',
      ...getHumanDesignTraits('Generator')
    }
  }
}