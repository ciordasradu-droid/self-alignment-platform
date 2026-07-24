'use client'

// AZI — camera ritualului (sect. 6, locked). ATÂT: apă + ritual contextual
// (dimineață/seară) + Gândul Zilei + One Breath discret. Fără scroll-depozit,
// fără upsell, fără carduri străine — restul a plecat în Drumul/Tu.
//
// Lacrima 3D vie (interactiune, three.js) vine cu bloc 5 — pana atunci,
// Azi arata apa globala (WaterVideoLayer), fara picatura interactiva.

import { useState, useEffect, Suspense } from 'react'
import MorningAnchor from './components/MorningAnchor'
import EveningMirror from './components/EveningMirror'
import OneBreath from './components/OneBreath'
import WaterLoader from '../components/water/WaterLoader'
import RoomNav from '../components/RoomNav'
import { useUser } from '../../lib/useUser'
import { t } from '../../lib/translations'
import { useLanguage } from '../../lib/language'
import { getForcedRitual } from '../../lib/simRitual'

const L = {
  en: { to_evening: 'Go to this evening', to_morning: 'Go to this morning', returning: 'What you wrote is still here.' },
  ro: { to_evening: 'Mergi la seara asta', to_morning: 'Mergi la dimineața asta', returning: 'Ce ai scris e tot aici.' },
  es: { to_evening: 'Ir a esta noche', to_morning: 'Ir a esta mañana', returning: 'Lo que escribiste sigue aquí.' },
  fr: { to_evening: 'Aller à ce soir', to_morning: 'Aller à ce matin', returning: 'Ce que tu as écrit est toujours là.' },
  de: { to_evening: 'Zu diesem Abend gehen', to_morning: 'Zu diesem Morgen gehen', returning: 'Was du geschrieben hast, ist noch da.' },
  it: { to_evening: 'Vai a stasera', to_morning: 'Vai a stamattina', returning: 'Quello che hai scritto è ancora qui.' },
  pt: { to_evening: 'Ir para esta noite', to_morning: 'Ir para esta manhã', returning: 'O que escreveste continua aqui.' },
  nl: { to_evening: 'Ga naar vanavond', to_morning: 'Ga naar vanochtend', returning: 'Wat je hebt geschreven is er nog steeds.' },
  pl: { to_evening: 'Przejdź do dzisiejszego wieczoru', to_morning: 'Przejdź do dzisiejszego poranka', returning: 'To, co napisałeś, wciąż tu jest.' },
  hu: { to_evening: 'Ugrás a mai estéhez', to_morning: 'Ugrás a mai reggelhez', returning: 'Amit írtál, még mindig itt van.' },
  ru: { to_evening: 'Перейти к сегодняшнему вечеру', to_morning: 'Перейти к сегодняшнему утру', returning: 'То, что ты написал, всё ещё здесь.' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

function DashboardContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [ritual, setRitual] = useState(null) // ritualul ales manual de user
  const { user } = useUser()
  const [globalLang] = useLanguage()
  const [profileLang, setProfileLang] = useState('en')
  const lang = globalLang || profileLang || 'en'

  useEffect(() => {
    try {
      const stored = localStorage.getItem('profile')
      if (stored) {
        const p = JSON.parse(stored)
        setProfile(p)
        if (p.language) setProfileLang(p.language)
      }
    } catch (e) {}

    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { if (d.success) setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const refresh = () => {
    fetch('/api/dashboard').then(r => r.json())
      .then(d => { if (d.success) setData(d) }).catch(() => {})
  }

  if (loading) {
    return <main style={{ padding: '120px 24px' }}><WaterLoader /></main>
  }

  const today = data?.today || {}
  const firstName = (profile?.full_name || '').trim().split(/\s+/)[0] || ''

  // Ritualul potrivit orei. FĂRĂ blocaj (principiul 4): celălalt rămâne
  // accesibil printr-un link discret — ora sugerează, nu interzice.
  const hour = new Date().getHours()
  const forcedRitual = getForcedRitual() // testare (secț. QA) — vezi lib/simRitual.js
  const naturally = forcedRitual || (hour < 12 ? 'morning' : hour >= 17 ? 'evening' : (today.morning ? 'evening' : 'morning'))
  const showing = ritual || naturally
  const other = showing === 'morning' ? 'evening' : 'morning'

  // Mod-noapte pe tot Azi de la ora serii (secț. 3/4) — indiferent care
  // ritual e afișat manual, ceasul decide atmosfera întregului ecran.
  const isNight = forcedRitual ? forcedRitual === 'evening' : (hour >= 17 || hour < 6)

  return (
    <main className={`room-shell${isNight ? ' night-mode' : ''}`}>

      {/* locul apei/lacrimii: ecranul se deschide pe apă, nu pe carduri */}
      <div style={{ height: 'min(30vh, 220px)' }} aria-hidden="true" />

      {/* A4 — Momentul Revenirii: un singur mesaj, cald, fără mențiunea
          absenței și fără statistici. Se stinge singur după primul ritual
          făcut azi (returning devine false din server). */}
      {data?.returning && (
        <p style={s.returning} className="anim-fade-in">{lx(lang, 'returning')}</p>
      )}

      {/* ── RITUALUL — atinge apa de deasupra ── */}
      <div>
        {showing === 'morning' ? (
          <MorningAnchor
            lang={lang}
            name={firstName}
            done={today.morning}
            continuedIntention={today.continuedIntention}
            accountDay={data?.day || 1}
            onComplete={refresh}
          />
        ) : (
          <EveningMirror
            lang={lang}
            name={firstName}
            done={today.evening}
            onComplete={refresh}
          />
        )}

        <button onClick={() => setRitual(other)} style={s.switchBtn}>
          {other === 'evening' ? lx(lang, 'to_evening') : lx(lang, 'to_morning')}
        </button>
      </div>

      {/* zilele grele — fără vinovăție */}
      {!today.one_breath && !today.evening && <OneBreath lang={lang} onComplete={refresh} />}

      <RoomNav lang={lang} />
    </main>
  )
}

const s = {
  switchBtn: { display: 'block', margin: '-8px auto 22px', padding: '10px 16px', background: 'transparent', border: 'none', color: 'rgba(244,240,234,0.55)', fontSize: '13px', cursor: 'pointer', minHeight: '44px' },
  returning: { textAlign: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontStyle: 'italic', color: 'rgba(244,240,234,0.7)', margin: '0 24px 18px' },
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main style={{ padding: '120px 24px' }}><WaterLoader /></main>}>
      <DashboardContent />
    </Suspense>
  )
}
