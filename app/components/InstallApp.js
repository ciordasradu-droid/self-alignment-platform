'use client'

// „Descarcă aplicația" — instalare PWA pe telefon.
// Se ascunde singur dacă aplicația e deja instalată sau dacă browserul nu poate.
// Pe iPhone nu există prompt automat: acolo arătăm instrucțiunea scurtă.

import { useEffect, useState } from 'react'

const L = {
  en: { title:'Keep it on your phone', sub:'Install it and it opens like any app — full screen, one tap.', btn:'Install', ios:'Tap Share, then “Add to Home Screen”.' },
  ro: { title:'Ține-o pe telefon', sub:'Instaleaz-o și se deschide ca orice aplicație — ecran întreg, un tap.', btn:'Instalează', ios:'Apasă Share, apoi „Add to Home Screen".' },
  es: { title:'Tenla en tu teléfono', sub:'Instálala y se abre como cualquier app — pantalla completa, un toque.', btn:'Instalar', ios:'Toca Compartir, luego “Añadir a pantalla de inicio”.' },
  fr: { title:'Garde-la sur ton téléphone', sub:'Installe-la et elle s ouvre comme une app — plein écran, un clic.', btn:'Installer', ios:'Touche Partager, puis “Sur l écran d accueil”.' },
  de: { title:'Behalte sie auf deinem Handy', sub:'Installiere sie und sie öffnet wie jede App — Vollbild, ein Tipp.', btn:'Installieren', ios:'Tippe Teilen, dann “Zum Home-Bildschirm”.' },
  it: { title:'Tienila sul telefono', sub:'Installala e si apre come ogni app — schermo intero, un tocco.', btn:'Installa', ios:'Tocca Condividi, poi “Aggiungi a Home”.' },
  pt: { title:'Mantém-na no telemóvel', sub:'Instala-a e abre como qualquer app — ecrã inteiro, um toque.', btn:'Instalar', ios:'Toca em Partilhar, depois “Adicionar ao ecrã principal”.' },
  nl: { title:'Houd hem op je telefoon', sub:'Installeer hem en hij opent als elke app — volledig scherm, één tik.', btn:'Installeren', ios:'Tik op Delen, dan “Zet op beginscherm”.' },
  pl: { title:'Miej ją w telefonie', sub:'Zainstaluj — otwiera się jak każda aplikacja, pełny ekran, jedno dotknięcie.', btn:'Zainstaluj', ios:'Dotknij Udostępnij, potem „Do ekranu początkowego".' },
  hu: { title:'Tartsd a telefonodon', sub:'Telepítsd, és úgy nyílik, mint bármelyik app — teljes képernyő, egy koppintás.', btn:'Telepítés', ios:'Koppints a Megosztásra, majd „Főképernyőhöz adás”.' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

export default function InstallApp({ lang = 'en' }) {
  const [prompt, setPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // deja instalată → nu mai cerem nimic
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    if (standalone) { setInstalled(true); return }

    setIsIOS(/iphone|ipad|ipod/i.test(window.navigator.userAgent))

    const onPrompt = (e) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (installed) return null
  if (!prompt && !isIOS) return null   // browserul nu poate instala — nu promitem ce nu putem

  const install = async () => {
    if (!prompt) return
    prompt.prompt()
    await prompt.userChoice
    setPrompt(null)
  }

  return (
    <div className="glass" style={s.card}>
      <p style={s.title}>{lx(lang, 'title')}</p>
      <p style={s.sub}>{lx(lang, 'sub')}</p>
      {isIOS
        ? <p style={s.ios}>{lx(lang, 'ios')}</p>
        : <button onClick={install} className="pill-btn" style={{ marginTop: '14px' }}>{lx(lang, 'btn')}</button>}
    </div>
  )
}

const s = {
  card: { padding: '22px 24px', marginBottom: '24px', textAlign: 'center' },
  title: { fontFamily: 'Cormorant Garamond, serif', fontSize: '19px', color: 'var(--text)', marginBottom: '6px' },
  sub: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 },
  ios: { fontSize: '13px', color: 'var(--gold)', marginTop: '12px', lineHeight: 1.6 },
}
