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

  if (sub) return { subscribed: true, trialEnded: false }

  const { data: patterns } = await supabaseAdmin
    .from('patterns_insights')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  return { subscribed: false, trialEnded: !!patterns }
}
