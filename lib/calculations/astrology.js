// Sun sign based on date of birth
export function getSunSign(dateString) {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius'
  return 'Pisces'
}

// Sun sign traits for interpretation
export function getSunSignTraits(sign) {
  const traits = {
    Aries: { element: 'Fire', modality: 'Cardinal', ruling_planet: 'Mars', core_traits: ['initiative', 'courage', 'impatience', 'leadership'] },
    Taurus: { element: 'Earth', modality: 'Fixed', ruling_planet: 'Venus', core_traits: ['persistence', 'reliability', 'stubbornness', 'sensuality'] },
    Gemini: { element: 'Air', modality: 'Mutable', ruling_planet: 'Mercury', core_traits: ['adaptability', 'curiosity', 'inconsistency', 'communication'] },
    Cancer: { element: 'Water', modality: 'Cardinal', ruling_planet: 'Moon', core_traits: ['intuition', 'loyalty', 'moodiness', 'nurturing'] },
    Leo: { element: 'Fire', modality: 'Fixed', ruling_planet: 'Sun', core_traits: ['confidence', 'generosity', 'pride', 'creativity'] },
    Virgo: { element: 'Earth', modality: 'Mutable', ruling_planet: 'Mercury', core_traits: ['analysis', 'precision', 'criticism', 'service'] },
    Libra: { element: 'Air', modality: 'Cardinal', ruling_planet: 'Venus', core_traits: ['balance', 'diplomacy', 'indecision', 'harmony'] },
    Scorpio: { element: 'Water', modality: 'Fixed', ruling_planet: 'Pluto', core_traits: ['intensity', 'focus', 'secrecy', 'transformation'] },
    Sagittarius: { element: 'Fire', modality: 'Mutable', ruling_planet: 'Jupiter', core_traits: ['optimism', 'freedom', 'restlessness', 'philosophy'] },
    Capricorn: { element: 'Earth', modality: 'Cardinal', ruling_planet: 'Saturn', core_traits: ['discipline', 'ambition', 'rigidity', 'responsibility'] },
    Aquarius: { element: 'Air', modality: 'Fixed', ruling_planet: 'Uranus', core_traits: ['innovation', 'independence', 'detachment', 'humanitarianism'] },
    Pisces: { element: 'Water', modality: 'Mutable', ruling_planet: 'Neptune', core_traits: ['empathy', 'creativity', 'escapism', 'spirituality'] }
  }
  return traits[sign] || {}
}

// Main function — returns all astrology data
export function calculateAstrology(dateOfBirth) {
  const sunSign = getSunSign(dateOfBirth)
  const traits = getSunSignTraits(sunSign)
  return {
    sun_sign: sunSign,
    ...traits
  }
}