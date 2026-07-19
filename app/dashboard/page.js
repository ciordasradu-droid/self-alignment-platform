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

const L = {
  en: { to_evening: 'Go to this evening', to_morning: 'Go to this morning' },
  ro: { to_evening: 'Mergi la seara asta', to_morning: 'Mergi la dimineața asta' },
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
  const naturally = hour < 12 ? 'morning' : hour >= 17 ? 'evening' : (today.morning ? 'evening' : 'morning')
  const showing = ritual || naturally
  const other = showing === 'morning' ? 'evening' : 'morning'

  // Mod-noapte pe tot Azi de la ora serii (secț. 3/4) — indiferent care
  // ritual e afișat manual, ceasul decide atmosfera întregului ecran.
  const isNight = hour >= 17 || hour < 6

  return (
    <main className={`room-shell${isNight ? ' night-mode' : ''}`}>

      {/* locul apei/lacrimii: ecranul se deschide pe apă, nu pe carduri */}
      <div style={{ height: 'min(30vh, 220px)' }} aria-hidden="true" />

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
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main style={{ padding: '120px 24px' }}><WaterLoader /></main>}>
      <DashboardContent />
    </Suspense>
  )
}
