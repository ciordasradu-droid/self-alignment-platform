function reduceToSingleDigit(num) {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0)
  }
  return num
}

function calculateLifePath(dateOfBirth) {
  const digits = dateOfBirth.replace(/-/g, '').split('').map(Number)
  const sum = digits.reduce((a, b) => a + b, 0)
  return reduceToSingleDigit(sum)
}

function calculateExpressionNumber(fullName) {
  const pythagorean = {
    a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
    j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
    s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
  }
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, '').split('')
  const sum = letters.reduce((acc, l) => acc + (pythagorean[l] || 0), 0)
  return reduceToSingleDigit(sum)
}

function calculateSoulUrge(fullName) {
  const vowels = ['a','e','i','o','u']
  const pythagorean = {
    a:1, e:5, i:9, o:6, u:3
  }
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, '').split('')
  const sum = letters
    .filter(l => vowels.includes(l))
    .reduce((acc, l) => acc + (pythagorean[l] || 0), 0)
  return reduceToSingleDigit(sum)
}

function calculatePersonalityNumber(fullName) {
  const pythagorean = {
    b:2, c:3, d:4, f:6, g:7, h:8, j:1, k:2, l:3, m:4,
    n:5, p:7, q:8, r:9, s:1, t:2, v:4, w:5, x:6, y:7, z:8
  }
  const vowels = ['a','e','i','o','u']
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, '').split('')
  const sum = letters
    .filter(l => !vowels.includes(l))
    .reduce((acc, l) => acc + (pythagorean[l] || 0), 0)
  return reduceToSingleDigit(sum)
}

function calculatePersonalYear(dateOfBirth) {
  const currentYear = new Date().getFullYear()
  const parts = dateOfBirth.split('-')
  const month = parseInt(parts[1])
  const day = parseInt(parts[2])

  const sum = day + month + currentYear
  const digits = String(sum).split('').map(Number)
  let personalYear = digits.reduce((a, b) => a + b, 0)
  while (personalYear > 9) {
    personalYear = String(personalYear).split('').map(Number).reduce((a, b) => a + b, 0)
  }

  const phases = {
    1: {
      theme: 'New Beginnings',
      focus: 'Plant seeds for what you want to create. This is a year of starting, not finishing.',
      warning: 'Avoid clinging to what no longer serves you. The old must go to make room.',
      energy: 'High initiative, independent action, fresh starts'
    },
    2: {
      theme: 'Patience & Partnership',
      focus: 'Nurture relationships and allow things to develop. Cooperation over competition.',
      warning: 'Avoid forcing outcomes. Things are growing beneath the surface.',
      energy: 'Receptive, collaborative, emotionally attuned'
    },
    3: {
      theme: 'Expression & Growth',
      focus: 'Share your voice, create, and expand socially. Joy is your compass this year.',
      warning: 'Avoid scattering your energy across too many directions.',
      energy: 'Creative, expressive, socially expansive'
    },
    4: {
      theme: 'Structure & Foundation',
      focus: 'Build systems, establish routines, do the disciplined work. Slow and steady wins.',
      warning: 'Avoid shortcuts. What you build now determines your next 4 years.',
      energy: 'Methodical, grounded, disciplined'
    },
    5: {
      theme: 'Change & Freedom',
      focus: 'Embrace change, explore new directions, and release rigid structures.',
      warning: 'Avoid impulsive decisions and overindulgence. Freedom needs direction.',
      energy: 'Dynamic, adaptable, curious'
    },
    6: {
      theme: 'Responsibility & Harmony',
      focus: 'Tend to home, family, and close relationships. Service and love lead the way.',
      warning: 'Avoid overgiving at the expense of your own needs.',
      energy: 'Nurturing, responsible, community-focused'
    },
    7: {
      theme: 'Reflection & Mastery',
      focus: 'Go inward. Study, reflect, and deepen your understanding of yourself.',
      warning: 'Avoid isolation and overthinking. Rest is not the same as retreat.',
      energy: 'Introspective, analytical, spiritually attuned'
    },
    8: {
      theme: 'Power & Achievement',
      focus: 'Step into your authority. This is a year of ambition, results, and material growth.',
      warning: 'Avoid sacrificing relationships for achievement.',
      energy: 'Ambitious, authoritative, results-driven'
    },
    9: {
      theme: 'Completion & Release',
      focus: 'Let go of what no longer fits. Forgive, release, and prepare for a new cycle.',
      warning: 'Avoid starting major new projects. Complete what needs completing.',
      energy: 'Compassionate, reflective, releasing'
    }
  }

  return {
    personal_year: personalYear,
    ...phases[personalYear]
  }
}

export function calculateNumerology(fullName, dateOfBirth) {
  return {
    life_path: calculateLifePath(dateOfBirth),
    expression: calculateExpressionNumber(fullName),
    soul_urge: calculateSoulUrge(fullName),
    personality: calculatePersonalityNumber(fullName),
    personal_year: calculatePersonalYear(dateOfBirth)
  }
}