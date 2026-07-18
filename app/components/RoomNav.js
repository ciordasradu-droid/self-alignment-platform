'use client'

// Bara de jos — cele 3 camere (sect. 6, locked). Glass, un singur accent auriu
// pentru tabul activ (nu fundal auriu plin — legea 4.2: aurul e accent, nu fundal).
//
// PORTAL in document.body: template.js (.flow-in, transform+filter) creeaza un
// containing block nou pentru orice fixed din interior — la fel ca la
// WaterVideoLayer. Fara portal, bara ajunge la finalul paginii, nu la baza
// ecranului.

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const L = {
  en: { azi: 'Today', drumul: 'The Path', tu: 'You' },
  ro: { azi: 'Azi', drumul: 'Drumul', tu: 'Tu' },
  es: { azi: 'Hoy', drumul: 'Camino', tu: 'Tú' },
  fr: { azi: 'Aujourd\'hui', drumul: 'Chemin', tu: 'Toi' },
  de: { azi: 'Heute', drumul: 'Weg', tu: 'Du' },
  it: { azi: 'Oggi', drumul: 'Percorso', tu: 'Tu' },
  pt: { azi: 'Hoje', drumul: 'Caminho', tu: 'Tu' },
  nl: { azi: 'Vandaag', drumul: 'Pad', tu: 'Jij' },
  pl: { azi: 'Dziś', drumul: 'Droga', tu: 'Ty' },
  hu: { azi: 'Ma', drumul: 'Út', tu: 'Te' },
}

const TABS = [
  { key: 'azi', href: '/dashboard' },
  { key: 'drumul', href: '/drumul' },
  { key: 'tu', href: '/profile' },
]

function Icon({ tab, active }) {
  const c = active ? '#f0d9b0' : 'rgba(244,240,234,0.55)'
  if (tab === 'azi') {
    // picatura
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3 C12 3 6 11 6 15.5 C6 19.09 8.69 21 12 21 C15.31 21 18 19.09 18 15.5 C18 11 12 3 12 3 Z" stroke={c} strokeWidth="1.6" fill={active ? 'rgba(229,169,60,0.18)' : 'none'} />
      </svg>
    )
  }
  if (tab === 'drumul') {
    // drum/harta
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20 C8 14 8 10 12 10 C16 10 16 14 20 8" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="4" cy="20" r="1.6" fill={c} />
        <circle cx="12" cy="10" r="1.6" fill={c} />
        <circle cx="20" cy="8" r="1.6" fill={c} />
      </svg>
    )
  }
  // tu — persoana
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" stroke={c} strokeWidth="1.6" />
      <path d="M5 20 C5 15.6 8.13 13 12 13 C15.87 13 19 15.6 19 20" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function RoomNav({ lang = 'en' }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const t = L[lang] || L.en

  if (!mounted) return null

  return createPortal(
    <nav className="room-nav" aria-label="Navigare principala">
      <div className="room-nav-bar">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname?.startsWith(tab.href + '/')
          return (
            <Link key={tab.key} href={tab.href} className={`room-nav-tab${active ? ' active' : ''}`}>
              <Icon tab={tab.key} active={active} />
              <span>{t[tab.key]}</span>
            </Link>
          )
        })}
      </div>
    </nav>,
    document.body
  )
}
