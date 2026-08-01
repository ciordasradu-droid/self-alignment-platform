// A5/A6 (decizii inchise 23.07): proba gratuita a Tiparelor/gandului zilei
// personalizat dureaza pana la PRIMA oglinda de Tipare generata — existenta
// unui rand in patterns_insights e chiar marcajul de sfarsit de proba,
// nimic separat de urmarit. La expirare NU se confisca nimic (A6): paginile
// raman accesibile, doar regenerarile de Tipare si gandul zilei personalizat
// se opresc. Neschimbat de GCAO 01.08 — e mai generos decat cele 3 zile de
// mai jos (prima oglinda ramane gratuita oricat ar dura pana la z14), deci
// cele doua reguli nu se contrazic.

// GCAO A5 (01.08.2026) — fereastra automata de 3 zile de acces complet
// (Azi + Drumul), de la inregistrare, fara card. Inlocuieste necesitatea
// de a apasa manual "Incearca gratuit" (care ramanea activ nelimitat) ca
// prag IMPLICIT pentru orice cont nou — vezi app/api/dashboard/route.js
// si proxy.js, care folosesc isWithinAutoTrial ca alternativa la
// subscriptie/cookie try_free, nu ca inlocuitor al lor.
export const TRIAL_DAYS = 3

export function isWithinAutoTrial(createdAt) {
  if (!createdAt) return false
  const ageDays = (Date.now() - new Date(createdAt).getTime()) / 86400000
  return ageDays <= TRIAL_DAYS
}

export function autoTrialDaysLeft(createdAt) {
  if (!createdAt) return 0
  const ageDays = (Date.now() - new Date(createdAt).getTime()) / 86400000
  return Math.max(0, Math.ceil(TRIAL_DAYS - ageDays))
}

export async function getTrialStatus(supabaseAdmin, userId) {
  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  const subscribed = !!sub

  // Verificat INDIFERENT de abonament: un rand existent inseamna ca prima
  // oglinda a fost livrata deja — folosit atat pentru gate-ul de proba
  // (trialEnded, doar cand !subscribed) cat si pentru cooldown-ul de
  // regenerare (A3, se aplica si userilor abonati). Ramane real chiar si in
  // FULL_ACCESS_MODE — cooldown-ul de 14 zile nu e o poarta de plata.
  const { data: patterns } = await supabaseAdmin
    .from('patterns_insights')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  const hasPriorMirror = !!patterns

  // 0.4 (calup arhitectura 30.07): comutator de testare cu acces complet —
  // server-side, se stinge dintr-o singura miscare la lansare. Ocoleste
  // DOAR poarta de plata (subscribed/trialEnded), nu si cooldown-ul de mai sus.
  if (process.env.FULL_ACCESS_MODE === 'true') {
    return { subscribed: true, trialEnded: false, hasPriorMirror }
  }

  return { subscribed, trialEnded: !subscribed && hasPriorMirror, hasPriorMirror }
}
