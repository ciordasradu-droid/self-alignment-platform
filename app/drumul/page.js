'use client'

// DRUMUL — camera creșterii (sect. 7, locked). De sus în jos: stadiul curent
// (mic, viu) → harta unlock-urilor cu orizont vizibil → rândul de acces
// (proba gratuită) → conținutul deblocat (Jurnal/Tipare/Angajament) →
// Prezența ta (discret, jos). Revizuirea săptămânală nu mai e card separat
// aici — trăiește în ritualul de dimineață de sâmbătă (z30+, secț. 5).

import { useState, useEffect, Suspense } from 'react'
import FreeJournal from '../dashboard/components/FreeJournal'
import PatternsInsight from '../dashboard/components/PatternsInsight'
import CommitmentDocument from '../dashboard/components/CommitmentDocument'
import Presence from '../components/Presence'
import RoomNav from '../components/RoomNav'
import WaterLoader from '../components/water/WaterLoader'
import { stageForDay, STAGES } from '../components/water/waterState'
import { useLanguage } from '../../lib/language'

const ROADMAP = [
  { day: 1,  key: 'checkin',    en: 'Rituals + Daily Thought',         ro: 'Ritualurile + Gândul Zilei',          en_d: 'you fall into rhythm with yourself',                ro_d: 'intri în ritm cu tine' },
  { day: 3,  key: 'journal',    en: 'Free Journal',                     ro: 'Jurnal liber',                        en_d: 'a private space to write, any time — not only in the evening', ro_d: 'spațiu privat de scris, oricând, nu doar seara' },
  { day: 7,  key: 'plan',       en: 'Alignment Plan',                   ro: 'Plan de aliniere',                    en_d: 'your personalized roadmap, from your profile',       ro_d: 'foaia personalizată de parcurs, din profil' },
  { day: 14, key: 'patterns',   en: 'Patterns',                         ro: 'Tipare',                               en_d: "the mirror of what you've written — what keeps returning", ro_d: 'oglinda a ce ai scris: ce revine' },
  { day: 30, key: 'review',     en: 'The Week, Seen',                   ro: 'Privirea săptămânii',                 en_d: 'the weekly reflection, lives in Saturday\'s ritual',  ro_d: 'reflecția săptămânală, trăiește în ritualul de sâmbătă' },
  { day: 60, key: 'commitment', en: 'Commitment With Yourself',         ro: 'Angajamentul cu Tine',                en_d: 'a personal document — read again anytime',           ro_d: 'un document personal, recitit oricând' },
  { day: 90, key: 'circle',     en: 'The Circle',                       ro: 'Cercul',                              en_d: '4 people, compatible by design',                     ro_d: '4 persoane, compatibile prin design' },
]

const L = {
  en: { title: 'Your Path', subtitle: 'Everything here opens with time. You can see the full map.', opens: 'Opens on day', unlocked: 'Open', access_line: 'You\'re here on the free trial — subscribe to keep your path going.', access_link: 'See the plan →' },
  ro: { title: 'Drumul Tău', subtitle: 'Totul aici se deschide cu timpul. Poți vedea harta completă.', opens: 'Se deschide în ziua', unlocked: 'Deschis', access_line: 'Ești aici prin proba gratuită — abonează-te ca să-ți continui drumul.', access_link: 'Vezi planul →' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

// TODO(texte de lucru): rand de acces pentru neabonati (proba gratuita, nu
// abonament real), sub harta. Simplu, pana vine formularea finala.
function AccessLine({ lang }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    try {
      const cookies = document.cookie
      const hasSub = /(?:^|;\s*)subscribed=/.test(cookies)
      const hasTrial = /(?:^|;\s*)try_free=/.test(cookies)
      setShow(hasTrial && !hasSub)
    } catch (e) {}
  }, [])
  if (!show) return null
  return (
    <div style={{ textAlign: 'center', padding: '4px 20px 20px' }}>
      <p style={{ fontSize: '12.5px', color: 'rgba(244,240,234,0.5)', lineHeight: 1.5, marginBottom: '8px' }}>
        {lx(lang, 'access_line')}
      </p>
      <a href="/subscribe" style={{ fontSize: '12.5px', color: 'var(--amber)', fontWeight: 600 }}>
        {lx(lang, 'access_link')}
      </a>
    </div>
  )
}

function isUnlocked(day, accountAge) { return accountAge + 1 >= day }

function Roadmap({ lang, accountAge }) {
  const t = L[lang] || L.en
  return (
    <div className="chapter">
      <div style={{ padding: '22px' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#f4f0ea', marginBottom: '4px' }}>
          {lx(lang, 'title')}
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(244,240,234,0.55)', lineHeight: 1.5, marginBottom: '20px' }}>
          {lx(lang, 'subtitle')}
        </p>
        <div>
          {ROADMAP.map((r, i) => {
            const unlocked = isUnlocked(r.day, accountAge)
            const isLast = i === ROADMAP.length - 1
            return (
              <div key={r.key} style={{ display: 'flex', gap: '14px', minHeight: '54px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16px', flexShrink: 0 }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                    background: unlocked ? '#e5a93c' : 'rgba(244,240,234,0.18)',
                    boxShadow: unlocked ? '0 0 8px rgba(229,169,60,0.5)' : 'none',
                  }} />
                  {!isLast && <span style={{ width: '2px', flex: 1, marginTop: '4px', marginBottom: '4px', background: unlocked ? 'rgba(229,169,60,0.35)' : 'rgba(244,240,234,0.1)' }} />}
                </div>
                <div style={{ paddingBottom: '18px', opacity: unlocked ? 1 : 0.55 }}>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#f4f0ea', marginBottom: '3px' }}>
                    {lang === 'ro' ? r.ro : r.en}
                  </p>
                  <p style={{ fontSize: '13px', color: 'rgba(244,240,234,0.6)', lineHeight: 1.5 }}>
                    {lang === 'ro' ? r.ro_d : r.en_d}
                  </p>
                  {!unlocked && (
                    <p style={{ fontSize: '11.5px', color: 'rgba(244,240,234,0.4)', marginTop: '4px', fontStyle: 'italic' }}>
                      {lx(lang, 'opens')} {r.day}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DrumulContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [globalLang] = useLanguage()
  const [profileLang, setProfileLang] = useState('en')
  const lang = globalLang || profileLang || 'en'

  useEffect(() => {
    try {
      const stored = localStorage.getItem('profile')
      if (stored) {
        const p = JSON.parse(stored)
        if (p.language) setProfileLang(p.language)
      }
    } catch (e) {}
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { if (d.success) setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <main style={{ padding: '120px 24px' }}><WaterLoader /></main>

  const day = data?.day || 1
  const age = Math.max(0, day - 1)
  const stage = stageForDay(day)
  const streak = data?.streak?.current_streak || 0

  return (
    <main className="room-shell">
      <header style={{ textAlign: 'center', marginBottom: '18px' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: 'rgba(244,240,234,0.6)', letterSpacing: '1px' }}>
          {stage[lang] || stage.en}
        </p>
      </header>

      <Roadmap lang={lang} accountAge={age} />
      <AccessLine lang={lang} />

      {isUnlocked(3, age) && <FreeJournal lang={lang} />}
      {isUnlocked(14, age) && <PatternsInsight lang={lang} />}
      {isUnlocked(60, age) && <CommitmentDocument lang={lang} />}

      <Presence streak={streak} lang={lang} />

      <RoomNav lang={lang} />
    </main>
  )
}

export default function DrumulPage() {
  return (
    <Suspense fallback={<main style={{ padding: '120px 24px' }}><WaterLoader /></main>}>
      <DrumulContent />
    </Suspense>
  )
}
