// GCAO 06.08.2026 — reparatie P0: niciuna dintre sesiunile Stripe Checkout
// nu trimitea `locale`, deci Stripe cadea pe propria detectie automata —
// putea iesi in engleza indiferent de limba aleasa in aplicatie. Cele 11
// limbi ale aplicatiei se potrivesc 1:1 cu coduri de locale suportate de
// Stripe, deci maparea e directa, fara cazuri speciale.
const SUPPORTED = ['en', 'ro', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'hu', 'ru']

export function toStripeLocale(lang) {
  return SUPPORTED.includes(lang) ? lang : 'auto'
}
