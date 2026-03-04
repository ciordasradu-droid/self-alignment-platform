// Reduces a number to a single digit (or master number 11, 22, 33)
function reduceNumber(num) {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split('').reduce((acc, d) => acc + parseInt(d), 0)
  }
  return num
}

// Life Path Number — from date of birth
export function getLifePathNumber(dateString) {
  const digits = dateString.replace(/-/g, '').split('').map(Number)
  const sum = digits.reduce((acc, d) => acc + d, 0)
  return reduceNumber(sum)
}

// Expression Number — from full name
export function getExpressionNumber(fullName) {
  const pythagorean = {
    a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
    j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
    s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8
  }
  const sum = fullName.toLowerCase().replace(/[^a-z]/g, '')
    .split('').reduce((acc, l) => acc + (pythagorean[l] || 0), 0)
  return reduceNumber(sum)
}

// Soul Urge Number — vowels only
export function getSoulUrgeNumber(fullName) {
  const vowelValues = { a:1, e:5, i:9, o:6, u:3 }
  const sum = fullName.toLowerCase().replace(/[^a-z]/g, '')
    .split('').reduce((acc, l) => acc + (vowelValues[l] || 0), 0)
  return reduceNumber(sum)
}

// Personality Number — consonants only
export function getPersonalityNumber(fullName) {
  const pythagorean = {
    b:2,c:3,d:4,f:6,g:7,h:8,j:1,k:2,l:3,m:4,
    n:5,p:7,q:8,r:9,s:1,t:2,v:4,w:5,x:6,y:7,z:8
  }
  const sum = fullName.toLowerCase().replace(/[^a-z]/g, '')
    .split('').reduce((acc, l) => acc + (pythagorean[l] || 0), 0)
  return reduceNumber(sum)
}

// Main function — returns all numerology data
export function calculateNumerology(fullName, dateOfBirth) {
  return {
    life_path: getLifePathNumber(dateOfBirth),
    expression: getExpressionNumber(fullName),
    soul_urge: getSoulUrgeNumber(fullName),
    personality: getPersonalityNumber(fullName)
  }
}
    