'use client'

// Înregistrează service worker-ul — condiția ca aplicația să fie instalabilă
// pe telefon. Tăcut: dacă browserul nu poate, nu se întâmplă nimic.
//
// 26.07 (secț. H1, addendum): fix pentru geamul vechi raportat de Alex —
// aplicația instalată arăta text șters de pe `main` de zile. sw.js (fetch
// network-first) era corect, dar NIMIC nu verifica vreodată dacă exista un
// service worker NOU, iar un tab deja deschis/reluat din fundal nu avea de
// unde să ia bundle-ul proaspăt fără o reîncărcare. Acum: verificăm la
// fiecare revenire în prim-plan (focus/visibilitychange), și quando un SW
// nou preia controlul (controllerchange), reîncărcăm o singură dată.

import { useEffect } from 'react'

export default function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') return

    let reg = null
    let reloaded = false

    const checkForUpdate = () => { reg && reg.update().catch(() => {}) }

    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').then((r) => {
        reg = r
        checkForUpdate()
      }).catch(() => {})
    }
    window.addEventListener('load', onLoad)

    // Un service worker nou nu ajunge la un tab deja deschis fara ca cineva
    // sa verifice — verificam de fiecare data cand aplicatia revine in
    // prim-plan (deschisa din nou, sau reluata din fundal pe telefon).
    const onVisible = () => { if (!document.hidden) checkForUpdate() }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', checkForUpdate)

    // sw.js face skipWaiting()+clients.claim(), deci un SW nou preia
    // controlul imediat ce e activat — cand se intampla asta, tab-ul
    // deschis inca ruleaza bundle-ul VECHI in memorie. O reincarcare
    // (o singura data, ca sa nu bucleze) aduce bundle-ul proaspat.
    const onControllerChange = () => {
      if (reloaded) return
      reloaded = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)

    return () => {
      window.removeEventListener('load', onLoad)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', checkForUpdate)
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
    }
  }, [])
  return null
}
