'use client'

// HOME — construit ÎN JURUL apei userului (legea 6).
// Picătura în stadiul curent e personajul principal, permanent vizibil.
// Ritualurile o ating: gestul de dimineață aprinde lumina din ea, jurnalul de
// seară cade în ea. Restul (Gândul Zilei, lentilele, harta drumului) orbitează.

import { useState, useEffect, Suspense } from 'react'
import MorningAnchor from './components/MorningAnchor'
import EveningMirror from './components/EveningMirror'
import OneBreath from './components/OneBreath'
import StreakTracker from './components/StreakTracker'
import WeeklyReview from './components/WeeklyReview'
import DailyInsight from './components/DailyInsight'
import WeeklyReset from './components/WeeklyReset'
import ProgressiveUnlock from './components/ProgressiveUnlock'
import FreeJournal from './components/FreeJournal'
import CommitmentDocument from './components/CommitmentDocument'
import PatternsInsight from './components/PatternsInsight'
import { isFeatureUnlocked } from './components/ProgressiveUnlock'
import { waterState, stageForDay } from '../components/water/waterState'
import WaterLoader from '../components/water/WaterLoader'
import InstallApp from '../components/InstallApp'
import { useUser } from '../../lib/useUser'
import { t } from '../../lib/translations'
import { useLanguage } from '../../lib/language'

const L = {
  en: { lenses:'Your three lenses', lens1:'How', lens2:'Where', lens3:'Why', to_evening:'Go to this evening', to_morning:'Go to this morning', compat_t:'Compatibility profile', compat_s:'See how you work with someone — partner, friend or business.' },
  ro: { lenses:'Cele trei lentile ale tale', lens1:'Cum', lens2:'Unde', lens3:'De ce', to_evening:'Mergi la seara asta', to_morning:'Mergi la dimineața asta', compat_t:'Profil de compatibilitate', compat_s:'Vezi cum funcționezi cu cineva — iubit, prieten sau partener de afaceri.' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

function CosmicStars() {
  return (
    <div className="cosmic-stars" aria-hidden="true">
      {Array.from({ length: 25 }).map((_, i) => <span key={i} />)}
    </div>
  )
}

// Lentilele 1/2/3 — Human Design (Cum) · Astrologie (Unde) · Numerologie (De ce)
function Lenses({ profile, lang }) {
  if (!profile) return null
  const hd = profile.hd_data || {}
  const astro = profile.astro_data || {}
  const num = profile.numerology_data || {}
  const items = [
    { n: '1', k: 'lens1', title: 'Human Design', value: [hd.type, hd.profile].filter(Boolean).join(' · ') },
    { n: '2', k: 'lens2', title: 'Astrologie', value: [astro.sun_sign, astro.element].filter(Boolean).join(' · ') },
    { n: '3', k: 'lens3', title: 'Numerologie', value: num.life_path ? String(num.life_path) : '' },
  ].filter(i => i.value)
  if (!items.length) return null

  return (
    <div style={ln.wrap}>
      <p style={ln.head}>{lx(lang, 'lenses')}</p>
      <div style={ln.grid}>
        {items.map(i => (
          <div key={i.n} className="glass" style={ln.card}>
            <span style={ln.badge}>{lx(lang, i.k)}</span>
            <p style={ln.title}>{i.title}</p>
            <p style={ln.value}>{i.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
const ln = {
  wrap: { marginBottom: '24px' },
  head: { fontSize: '12px', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' },
  card: { padding: '16px 18px' },
  badge: { fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.5px', textTransform: 'uppercase' },
  title: { fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--text)', margin: '6px 0 2px' },
  value: { fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 },
}

function InviteSection({ userId, lang }) {
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState(0)
  const [link, setLink] = useState('')

  useEffect(() => {
    setLink(`${window.location.origin}/invite/${userId}`)
    fetch('/api/invite').then(r => r.json())
      .then(d => { if (d.success) setReferrals(d.referrals) })
      .catch(() => {})
  }, [userId])

  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass" style={inv.card}>
      <span className="tag tag-green" style={{ marginBottom: '8px', display: 'inline-block' }}>{t(lang, 'invite_tag')}</span>
      <h3 style={inv.title}>{t(lang, 'invite_title')}</h3>
      <p style={inv.subtitle}>{t(lang, 'invite_subtitle')}</p>
      <div style={inv.linkBox}>
        <p style={inv.linkText}>{link}</p>
        <button onClick={copy} className="pill-btn" style={{ padding: '8px 16px', fontSize: '13px', minHeight: '44px', flexShrink: 0 }}>
          {copied ? t(lang, 'copied') : t(lang, 'copy')}
        </button>
      </div>
      <p style={inv.bonusText}>{t(lang, 'invite_bonus')} · {referrals}</p>
    </div>
  )
}
const inv = {
  card: { padding: '24px', marginBottom: '24px' },
  title: { fontSize: '20px', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 },
  linkBox: { display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.20)', borderRadius: '10px', border: '1px solid var(--border)', padding: '10px 14px', margin: '16px 0', alignItems: 'center' },
  linkText: { flex: 1, fontSize: '13px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  bonusText: { fontSize: '13px', color: 'var(--green)', lineHeight: 1.6 },
}

function DashboardContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [light, setLight] = useState(null)   // semnalul de moment -> apa home-ului
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
    return (
      <>
        <div className="cosmic-bg" />
        <main style={{ padding: '120px 24px' }}><WaterLoader /></main>
      </>
    )
  }

  // ?day=N — override pentru testarea stadiilor apei
  const override = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('day') : null
  const day = override !== null ? parseInt(override, 10) : (data?.day || 1)
  const age = Math.max(0, day - 1)

  const today = data?.today || {}
  const stage = stageForDay(day)
  const firstName = (profile?.full_name || '').trim().split(/\s+/)[0] || ''

  // Apa userului traieste in Canvas-ul global (legea 6): home-ul nu o deseneaza,
  // ii spune doar in ce stadiu e si unde sa stea pe ecran.
  waterState.setDay(day)
  waterState.setDropPos(0.5, 0.72)
  waterState.setShowDrop(true)

  // Ritualul potrivit orei. FĂRĂ blocaj (principiul 4): celălalt rămâne
  // accesibil printr-un link discret — ora sugerează, nu interzice.
  // TODO (sesiunea de experiență): pragurile 12/17 sunt de validat cu Alex.
  const hour = new Date().getHours()
  const naturally = hour < 12 ? 'morning' : hour >= 17 ? 'evening' : (today.morning ? 'evening' : 'morning')
  const showing = ritual || naturally
  const other = showing === 'morning' ? 'evening' : 'morning'

  return (
    <>
      <div className="cosmic-bg" />
      <CosmicStars />
      <main style={s.wrap} className="flow-in">

        <div style={s.header}>
          <p style={s.stageName}>{stage[lang] || stage.en}</p>
          <a href="/" style={s.homeLink}>{t(lang, 'home')}</a>
        </div>

        {/* ── APA USERULUI ──
            Picătura e randată de Canvas-ul global, în spatele UI-ului. Aici îi
            lăsăm locul ei: ecranul se deschide pe apă, nu pe carduri. */}
        <div style={s.waterRoom} aria-hidden="true" />

        {/* ── RITUALUL — atinge apa de deasupra ── */}
        <div>
          {showing === 'morning' ? (
            <MorningAnchor
              lang={lang}
              name={firstName}
              done={today.morning}
              /* gestul aprinde lumina DIN picătura de deasupra, în timp real */
              onSignal={(v) => { setLight(v); waterState.setLight(v) }}
              onComplete={refresh}
            />
          ) : (
            <EveningMirror
              lang={lang}
              done={today.evening}
              intention={today.intention}
              onComplete={refresh}
            />
          )}

          <button onClick={() => setRitual(other)} style={s.switchBtn}>
            {other === 'evening' ? lx(lang, 'to_evening') : lx(lang, 'to_morning')}
          </button>
        </div>

        {/* zilele grele — fără vinovăție */}
        {!today.one_breath && !today.evening && <OneBreath lang={lang} onComplete={refresh} />}

        <DailyInsight />

        <Lenses profile={profile} lang={lang} />

        <StreakTracker
          streak={data?.streak?.current_streak || 0}
          longestStreak={data?.streak?.longest_streak || 0}
          lang={lang}
        />

        <WeeklyReset lang={lang} />

        {isFeatureUnlocked('journal', age) && <FreeJournal lang={lang} />}
        {isFeatureUnlocked('patterns', age) && <PatternsInsight lang={lang} />}
        {isFeatureUnlocked('review', age) && <WeeklyReview />}
        {isFeatureUnlocked('commitment', age) && <CommitmentDocument lang={lang} />}

        <a href="/compatibility" className="glass" style={s.compat}>
          <div>
            <p style={s.compatTitle}>{lx(lang, 'compat_t')}</p>
            <p style={s.compatSub}>{lx(lang, 'compat_s')}</p>
          </div>
          <span style={s.compatArrow} aria-hidden="true">→</span>
        </a>

        <ProgressiveUnlock lang={lang} day={age} />

        <InstallApp lang={lang} />

        {user?.id && <InviteSection userId={user.id} lang={lang} />}

      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth: '640px', margin: '0 auto', padding: '28px 20px 80px' },
  // locul picăturii: ecranul se deschide pe apă, nu pe carduri
  waterRoom: { height: 'min(46vh, 340px)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  stageName: { fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: 'var(--text-light)', letterSpacing: '1px' },
  homeLink: { fontSize: '14px', color: 'var(--text-muted)', padding: '8px 12px', minHeight: '44px', display: 'inline-flex', alignItems: 'center' },
  switchBtn: { display: 'block', margin: '-8px auto 22px', padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--text-light)', fontSize: '13px', cursor: 'pointer', minHeight: '44px' },
  compat: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '20px 22px', marginBottom: '24px', textDecoration: 'none' },
  compatTitle: { fontSize: '17px', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '4px' },
  compatSub: { fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 },
  compatArrow: { fontSize: '22px', color: 'var(--gold)', flexShrink: 0 },
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main style={{ padding: '120px 24px' }}><WaterLoader /></main>}>
      <DashboardContent />
    </Suspense>
  )
}
