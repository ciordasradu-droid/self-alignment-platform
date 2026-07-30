// Sursa unica a numelui aplicatiei (decizie 30.07, calup arhitectura, 0.1).
// "Awa" e numele de lucru curent, in verificare de branding — schimbarea lui
// trebuie sa fie O SINGURA linie, folosita peste tot: titluri, meta, emailuri,
// PDF-uri, manifest. NU redenumeste conceptele de produs existente
// ("Alignment Plan"/"Planul de aliniere", capitolul aligned_life) — acelea
// sunt nume de funcționalitate, nu numele aplicatiei.

export const APP_NAME = 'Awa'

export const APP_TAGLINE = {
  en: 'Your safe place for self-alignment',
  ro: 'Locul tău liniștit, pentru întoarcerea la tine',
}

export function appTagline(lang) {
  return APP_TAGLINE[lang] || APP_TAGLINE.en
}
