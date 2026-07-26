'use client'

// Punctul 2 (audit 26.07, runda 3): document.title ramanea "Profil de
// Aliniere" indiferent de app_language — vine din metadata statica
// (layout.js), rezolvata pe server, fara acces la localStorage. Titlul e
// carcasa (urmeaza intotdeauna app_language, ca meniul/butoanele).
//
// Incercarea initiala (document.title = ... intr-un useEffect) era anulata
// la scurt timp de mecanismul intern al Next.js care re-aplica <title> din
// metadata statica. React 19 stie sa "ridice" (hoist) un <title> randat
// oriunde in arbore direct in <head>, castigand in fata metadatelor statice
// — asta foloseste, nu manipulare imperativa a DOM-ului.

import { useLanguage } from '../../lib/language'
import { t } from '../../lib/translations'

export default function DocumentTitle() {
  const [lang] = useLanguage()
  return <title>{t(lang, 'profile_title')}</title>
}
