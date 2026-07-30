// A5/A6 (decizii inchise 23.07): proba gratuita dureaza pana la PRIMA
// oglinda de Tipare generata — existenta unui rand in patterns_insights
// e chiar marcajul de sfarsit de proba, nimic separat de urmarit.
// La expirare NU se confisca nimic (A6): paginile raman accesibile,
// doar regenerarile de Tipare si gandul zilei personalizat se opresc.

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
