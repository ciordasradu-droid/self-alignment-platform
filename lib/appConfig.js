// Sursa unica a identitatii aplicatiei (decizie inchisa, IDENTITATE 30.07).
// Numele e Aquanima (A mare, restul mic) — schimbarea lui trebuie sa fie
// O SINGURA linie, folosita peste tot: <title>, manifest, meta, emailuri,
// PDF-uri, navbar. NU redenumeste conceptele de produs existente
// ("Alignment Plan"/"Planul de aliniere", capitolul aligned_life) — acelea
// sunt nume de functionalitate, nu numele aplicatiei.

export const APP_NAME = 'Aquanima'

// Descriptorul e o singura fraza, in engleza, peste tot (nu se traduce per
// limba, la fel ca numele) — apare langa nume in navbar/landing/manifest.
export const APP_DESCRIPTOR = 'Self-Alignment & Inner Journey'

export const APP_TAGLINE = {
  en: 'Your quiet place, every morning and every evening',
  ro: 'Locul tău liniștit, dimineața și seara.',
}

export function appTagline(lang) {
  return APP_TAGLINE[lang] || APP_TAGLINE.en
}

// Randul complet de identitate ("Aquanima · Self-Alignment & Inner Journey ·
// <tagline>") — folosit pe landing si in manifest.description, ca sa nu
// existe doua compuneri diferite ale acelorasi 3 bucati.
export function appFullIdentity(lang) {
  return `${APP_NAME} · ${APP_DESCRIPTOR} · ${appTagline(lang)}`
}
