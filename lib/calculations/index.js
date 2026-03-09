import { calculateNumerology } from './numerology'
import { calculateAstrology } from './astrology'
import { calculateHumanDesign } from './humandesign'

export function calculateFullProfile(fullName, dateOfBirth, timeOfBirth, lat, lng) {
  const numerology = calculateNumerology(fullName, dateOfBirth)
  const astrology = calculateAstrology(dateOfBirth)
  const humanDesign = calculateHumanDesign(dateOfBirth, timeOfBirth, lat, lng)

  return {
    numerology,
    astrology,
    human_design: humanDesign
  }
}