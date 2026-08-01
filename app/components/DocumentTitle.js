'use client'

// IDENTITATE (raport 30.07): document.title afisa "Alignment Profile" —
// numele unei FUNCTIONALITATI (profilul), nu al aplicatiei — pe orice
// ecran, nu doar pe /profile. Titlul e carcasa (identitatea aplicatiei),
// nu continutul paginii curente.
//
// Incercarea initiala (document.title = ... intr-un useEffect) era anulata
// la scurt timp de mecanismul intern al Next.js care re-aplica <title> din
// metadata statica. React 19 stie sa "ridice" (hoist) un <title> randat
// oriunde in arbore direct in <head>, castigand in fata metadatelor statice
// — asta foloseste, nu manipulare imperativa a DOM-ului.

import { APP_NAME } from '../../lib/appConfig'

export default function DocumentTitle() {
  return <title>{APP_NAME}</title>
}
