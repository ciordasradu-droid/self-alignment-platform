// Human Design Type based on date of birth
// Simplified calculation for MVP — full calculation requires ephemeris
export function getHumanDesignType(dateString) {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth() + 1

  // Simplified type distribution based on birth date
  // In production this will be replaced with full ephemeris calculation
  const sum = day + month
  if (sum % 5 === 0) return 'Manifestor'
  if (sum % 5 === 1) return 'Generator'
  if (sum % 5 === 2) return 'Manifesting Generator'
  if (sum % 5 === 3) return 'Projector'
  return 'Reflector'
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
  return traits[type] || {}
}

// Main function — returns all human design data
export function calculateHumanDesign(dateOfBirth) {
  const type = getHumanDesignType(dateOfBirth)
  const traits = getHumanDesignTraits(type)
  return {
    type,
    ...traits
  }
}