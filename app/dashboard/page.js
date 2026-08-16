'use client'

// AZI — camera ritualului (sect. 6, locked). ATÂT: apă + ritual contextual
// (dimineață/seară) + Gândul Zilei + One Breath discret. Fără scroll-depozit,
// fără upsell, fără carduri străine — restul a plecat în Drumul/Tu.
//
// Bula 3D vie (interactiune, three.js) vine cu bloc 5 — pana atunci,
// Azi arata apa globala (WaterVideoLayer), fara bula interactiva.

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import MorningAnchor from './components/MorningAnchor'
import EveningMirror from './components/EveningMirror'
import OneBreath from './components/OneBreath'
import DailyInsight from './components/DailyInsight'
import AziAccessCard from './components/AziAccessCard'
import WaterLoader from '../components/water/WaterLoader'
import RoomNav from '../components/RoomNav'
import { useUser } from '../../lib/useUser'
import { t } from '../../lib/translations'
import { useLanguage } from '../../lib/language'
import { getForcedRitual } from '../../lib/simRitual'
import { getRitualWindow, clientTzOffset } from '../../lib/logicalDay'
import { FEATURE_BREATH } from '../../lib/appConfig'
import { useWaterMode } from '../../lib/waterMode'

const L = {
  en: { to_evening: 'Go to this evening', to_morning: 'Go to this morning', returning: 'What you wrote is still here.', journal_link: 'Journal', greet_morning: 'Good morning', greet_evening: 'Good evening' },
  ro: { to_evening: 'Mergi la seara asta', to_morning: 'Mergi la dimineața asta', returning: 'Ce ai scris e tot aici.', journal_link: 'Jurnalul', greet_morning: 'Bună dimineața', greet_evening: 'Bună seara' },
  es: { to_evening: 'Ir a esta noche', to_morning: 'Ir a esta mañana', returning: 'Lo que escribiste sigue aquí.', journal_link: 'Diario', greet_morning: 'Buenos días', greet_evening: 'Buenas noches' },
  fr: { to_evening: 'Aller à ce soir', to_morning: 'Aller à ce matin', returning: 'Ce que tu as écrit est toujours là.', journal_link: 'Journal', greet_morning: 'Bonjour', greet_evening: 'Bonsoir' },
  de: { to_evening: 'Zu diesem Abend gehen', to_morning: 'Zu diesem Morgen gehen', returning: 'Was du geschrieben hast, ist noch da.', journal_link: 'Tagebuch', greet_morning: 'Guten Morgen', greet_evening: 'Guten Abend' },
  it: { to_evening: 'Vai a stasera', to_morning: 'Vai a stamattina', returning: 'Quello che hai scritto è ancora qui.', journal_link: 'Diario', greet_morning: 'Buongiorno', greet_evening: 'Buonasera' },
  pt: { to_evening: 'Ir para esta noite', to_morning: 'Ir para esta manhã', returning: 'O que escreveste continua aqui.', journal_link: 'Diário', greet_morning: 'Bom dia', greet_evening: 'Boa noite' },
  nl: { to_evening: 'Ga naar vanavond', to_morning: 'Ga naar vanochtend', returning: 'Wat je hebt geschreven is er nog steeds.', journal_link: 'Dagboek', greet_morning: 'Goedemorgen', greet_evening: 'Goedenavond' },
  pl: { to_evening: 'Przejdź do dzisiejszego wieczoru', to_morning: 'Przejdź do dzisiejszego poranka', returning: 'To, co napisałeś, wciąż tu jest.', journal_link: 'Dziennik', greet_morning: 'Dzień dobry', greet_evening: 'Dobry wieczór' },
  hu: { to_evening: 'Ugrás a mai estéhez', to_morning: 'Ugrás a mai reggelhez', returning: 'Amit írtál, még mindig itt van.', journal_link: 'Napló', greet_morning: 'Jó reggelt', greet_evening: 'Jó estét' },
  ru: { to_evening: 'Перейти к сегодняшнему вечеру', to_morning: 'Перейти к сегодняшнему утру', returning: 'То, что ты написал, всё ещё здесь.', journal_link: 'Дневник', greet_morning: 'Доброе утро', greet_evening: 'Добрый вечер' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

function DashboardContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const { user } = useUser()
  const [globalLang] = useLanguage()
  const [profileLang, setProfileLang] = useState('en')
  const lang = globalLang || profileLang || 'en'
  const [waterMode, setWaterMode] = useWaterMode()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('profile')
      if (stored) {
        const p = JSON.parse(stored)
        setProfile(p)
        if (p.language) setProfileLang(p.language)
      }
    } catch (e) {}

    fetch(`/api/dashboard?tz=${clientTzOffset()}`)
      .then(r => r.json())
      .then(d => { if (d.success) setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const refresh = () => {
    fetch(`/api/dashboard?tz=${clientTzOffset()}`).then(r => r.json())
      .then(d => { if (d.success) setData(d) }).catch(() => {})
  }

  if (loading) {
    return <main style={{ padding: '120px 24px' }}><WaterLoader /></main>
  }

  const today = data?.today || {}
  const firstName = (profile?.full_name || '').trim().split(/\s+/)[0] || ''

  // Ritualul potrivit orei — Azi arată UN SINGUR ritual contextual (sect. 6,
  // D7 25.07: butonul de comutare a fost scos, contrazicea "un singur ritual").
  // Punctul 0.3 (calup arhitectura 30.07): granița zilei e 03:33, iar
  // fereastra dimineții se închide ferm la 15:33 — nu mai există fallback
  // "dacă dimineața e deja făcută, arată seara" care lăsa ritualul de
  // dimineață deschis oricât de târziu (bug reprodus de Alex la ~16:00).
  // getRitualWindow (lib/logicalDay.js, aceeași sursă ca /api/dashboard și
  // /api/ritual) e SINGURA decizie a ferestrei: 'morning' / 'midday' / 'evening'.
  const now = new Date()
  const naturalWindow = getRitualWindow(now.getTime(), now.getTimezoneOffset())
  const forcedRitual = getForcedRitual() // testare (secț. QA) — vezi lib/simRitual.js
  const showing = forcedRitual || naturalWindow

  // GCAO 05.08.2026 — "Apa vie, zi și seară": salutul (Georgia, stânga-sus)
  // și comutatorul manual ☾/☀ (dreapta-sus, ca în machetă) trăiesc AICI,
  // în afara ritualului — rămân vizibile indiferent de starea lui (activ,
  // gata, fereastra de mijloc). Comutatorul suprascrie starea globală a
  // WaterWorld până la următoarea graniță de timp (lib/waterMode.js) —
  // salutul urmează ACEEAȘI stare (zi/seară), ca lumina apei să nu
  // contrazică textul. Decizie explicită: comutatorul schimbă DOAR
  // lumina/salutul, NU care ritual e activ — ritualul real (câmpuri,
  // salvare) rămâne condus strict de fereastra reală de timp (neatinsă,
  // restricție explicită).
  const greetText = waterMode === 'night' ? lx(lang, 'greet_evening') : lx(lang, 'greet_morning')

  // Mod-noapte pe tot Azi de la ora serii (secț. 3/4) — indiferent care
  // ritual e afișat manual, ceasul decide atmosfera întregului ecran. Ramane
  // pe ORA REALA (nu logica) — merge deja corect, nu se atinge (runda 6).
  const hour = now.getHours()
  const isNight = forcedRitual ? forcedRitual === 'evening' : (hour >= 17 || hour < 6)

  return (
    <main className={`room-shell${isNight ? ' night-mode' : ''}`}>

      {/* GCAO 05.08.2026 — antetul comun al Azi-ului: salut (Georgia,
          stânga-sus) + comutator manual ☾/☀ (dreapta-sus), ca în machetă.
          A5 (calup arhitectura 30.07) — jurnalul-carte rămâne accesibil de
          aici, mutat lângă comutator, tot discret. */}
      <div style={s.topBar}>
        <p style={s.greet}>{greetText}</p>
        <div style={s.topBarRight}>
          <Link href="/dashboard/journal" style={s.journalLink}>{lx(lang, 'journal_link')}</Link>
          <button
            type="button"
            onClick={() => setWaterMode(waterMode === 'night' ? 'day' : 'night')}
            style={s.modeBtn}
            aria-label={waterMode === 'night' ? '☀' : '☾'}
          >
            {waterMode === 'night' ? '☀' : '☾'}
          </button>
        </div>
      </div>

      {/* locul apei/lacrimii: ecranul se deschide pe apă, nu pe carduri */}
      <div style={{ height: 'min(30vh, 220px)' }} aria-hidden="true" />

      {/* A4 — Momentul Revenirii: un singur mesaj, cald, fără mențiunea
          absenței și fără statistici. Se stinge singur după primul ritual
          făcut azi (returning devine false din server). */}
      {data?.returning && (
        <p style={s.returning} className="anim-fade-in">{lx(lang, 'returning')}</p>
      )}

      {/* A7 (calup arhitectura 30.07): un cont doar-cu-profil, fara abonament
          sau proba, nu vede niciun ritual — un singur card calm, fara
          vitrina de upsell. hasFullAccess vine din /api/dashboard (aceeasi
          regula ca poarta din proxy.js: abonament activ SAU cookie
          try_free SAU FULL_ACCESS_MODE). */}
      {data?.hasFullAccess === false ? (
        <AziAccessCard lang={lang} />
      ) : (
        <>
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
            ) : showing === 'midday' ? (
              // 0.3 — fereastra de mijloc (15:33-ora serii): doar Gandul Zilei
              // recitibil, fara ritual de scris. Ritualul de dimineata s-a
              // inchis ferm la 15:33; cel de seara inca n-a inceput.
              <DailyInsight />
            ) : (
              <EveningMirror
                lang={lang}
                name={firstName}
                done={today.evening}
                todayIntention={today.continuedIntention}
                accountDay={data?.day || 1}
                onComplete={refresh}
              />
            )}
          </div>

          {/* zilele grele — fără vinovăție. GCAO 02.08.2026 (regresie
              reparată): sub FEATURE_BREATH, implicit false/ascuns. */}
          {FEATURE_BREATH && !today.one_breath && !today.evening && <OneBreath lang={lang} onComplete={refresh} />}
        </>
      )}

      <RoomNav lang={lang} />
    </main>
  )
}

// GCAO 05.08.2026 — antetul comun: salut Georgia 27px (singurul „moment
// mare" de aici, ca în machetă) + comutator ☾/☀ 46px (țintă minimă 44px
// respectată) + link jurnal, 13px, discret. Text-shadow, nu scrim — antetul
// stă direct pe apa vie, ca în machetă (fundalul scrim e doar pe foaia jos).
const s = {
  switchBtn: { display: 'block', margin: '-8px auto 22px', padding: '10px 16px', background: 'transparent', border: 'none', color: 'rgba(244,240,234,0.55)', fontSize: '13px', cursor: 'pointer', minHeight: '44px' },
  returning: { textAlign: 'center', fontSize: '16px', fontStyle: 'italic', color: 'rgba(244,240,234,0.7)', margin: '0 24px 18px', textShadow: '0 1px 8px rgba(6,10,18,.6)' },
  topBar: { position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: 'calc(16px + env(safe-area-inset-top)) 20px 0' },
  greet: { margin: 0, fontFamily: 'Georgia, serif', fontSize: '27px', lineHeight: 1.25, color: '#F2EFE9', textShadow: '0 2px 14px rgba(0,0,0,.55)' },
  topBarRight: { display: 'flex', alignItems: 'center', gap: '14px' },
  journalLink: { fontSize: '13px', color: 'rgba(244,240,234,0.55)', minHeight: '44px', display: 'flex', alignItems: 'center', textShadow: '0 1px 8px rgba(6,10,18,.6)' },
  modeBtn: { width: '46px', height: '46px', borderRadius: '50%', border: '1px solid rgba(242,239,233,.22)', background: 'rgba(12,18,30,.45)', color: '#F2EFE9', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main style={{ padding: '120px 24px' }}><WaterLoader /></main>}>
      <DashboardContent />
    </Suspense>
  )
}
