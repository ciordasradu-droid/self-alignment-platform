'use client'

// Destinație: app/dashboard/page.js  (ÎNLOCUIEȘTE COMPLET)
// Schimbări majore (toate discutate):
// - SCOS: scorul (87/100), ShadowAlert (pattern detected), RecalibrationMode
//   (bloca dashboard-ul), FeelingCheckin (cuvinte de stare), DailyIntention
//   (intenție separată), DailyCheckin (emoji+scor), EveningCheckout vechi.
// - ADĂUGAT: MorningReflection (stare scrisă liber) + EveningCheckin (3 întrebări scrise).
// - Limba vine din limba globală (lib/language) cu fallback pe profil.
// - PĂSTRAT intact: Gândul Zilei (DailyInsight), jurnalul, streak ca prezență,
//   harta drumului, invitația (mutată jos, afară din fluxul de reflecție).
// - Mojibake reparat (✦ în loc de âœ¦).

import { useState, useEffect, Suspense } from 'react'
import MorningReflection from './components/MorningReflection'
import EveningCheckin from './components/EveningCheckin'
import StreakTracker from './components/StreakTracker'
import WeeklyReview from './components/WeeklyReview'
import EmailCapture from './components/EmailCapture'
import DailyInsight from './components/DailyInsight'
import WeeklyReset from './components/WeeklyReset'
import ProgressiveUnlock from './components/ProgressiveUnlock'
import FreeJournal from './components/FreeJournal'
import CommitmentDocument from './components/CommitmentDocument'
import PatternsInsight from './components/PatternsInsight'
import { isFeatureUnlocked, getAccountAgeDays } from './components/ProgressiveUnlock'
import { getUserId } from '../../lib/userId'
import { t } from '../../lib/translations'
import { useLanguage } from '../../lib/language'

// 25 drifting "stars" — purely decorative, positioned via CSS :nth-child
function CosmicStars() {
  return (
    <div className="cosmic-stars" aria-hidden="true">
      {Array.from({ length: 25 }).map((_, i) => <span key={i} />)}
    </div>
  )
}

function PersonalYearBanner({ personalYear, lang }) {
  if (!personalYear) return null
  return (
    <div style={py.banner}>
      <div style={py.left}>
        <span style={py.num}>{personalYear.personal_year}</span>
        <div>
          <p style={py.label}>{t(lang, 'current_phase')}</p>
          <p style={py.theme}>{personalYear.theme}</p>
        </div>
      </div>
      <div style={py.right}>
        <p style={py.focus}>{personalYear.focus}</p>
        <p style={py.warning}>
          <span style={{color:'var(--orange)', marginRight:'6px'}}>⚠</span>
          {personalYear.warning}
        </p>
      </div>
    </div>
  )
}

const py = {
  banner: { background:'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', borderRadius:'var(--radius)', padding:'20px 28px', marginBottom:'28px', display:'flex', gap:'24px', alignItems:'center', flexWrap:'wrap' },
  left: { display:'flex', alignItems:'center', gap:'14px', flexShrink:0 },
  num: { fontSize:'48px', fontWeight:'700', color:'var(--orange)', fontFamily:'Cormorant Garamond, serif', lineHeight:1 },
  label: { fontSize:'10px', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'2px' },
  theme: { fontSize:'16px', fontWeight:'600', color:'#fff' },
  right: { flex:1 },
  focus: { fontSize:'13px', color:'rgba(255,255,255,0.75)', lineHeight:'1.6', marginBottom:'6px' },
  warning: { fontSize:'12px', color:'rgba(255,255,255,0.5)', lineHeight:'1.5', display:'flex', alignItems:'flex-start' }
}

function InviteSection({ userId, lang }) {
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState(0)
  const inviteLink = `${window.location.origin}/invite/${userId}`

  useEffect(() => {
    fetch(`/api/invite?user_id=${userId}`)
      .then(r => r.json())
      .then(data => { if (data.success) setReferrals(data.referrals) })
      .catch(() => {})
  }, [userId])

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={inv.card}>
      <div style={inv.header}>
        <span className="tag tag-green" style={{marginBottom:'8px', display:'inline-block'}}>{t(lang, 'invite_tag')}</span>
        <h3 style={inv.title}>{t(lang, 'invite_title')}</h3>
        <p style={inv.subtitle}>{t(lang, 'invite_subtitle')}</p>
      </div>
      <div style={inv.linkBox}>
        <p style={inv.linkText}>{inviteLink}</p>
        <button onClick={handleCopy} style={inv.copyBtn}>
          {copied ? t(lang, 'copied') : t(lang, 'copy')}
        </button>
      </div>
      <div style={inv.stats}>
        <div style={inv.stat}>
          <span style={inv.statNum}>{referrals}</span>
          <span style={inv.statLabel}>{t(lang, 'friends_invited')}</span>
        </div>
        <div style={inv.stat}>
          <span style={{...inv.statNum, color:'var(--green)'}}>{referrals}</span>
          <span style={inv.statLabel}>{t(lang, 'free_months')}</span>
        </div>
      </div>
      <div style={inv.bonus}>
        <p style={inv.bonusText}>✦ {t(lang, 'invite_bonus')}</p>
      </div>
    </div>
  )
}

const inv = {
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'28px', marginBottom:'24px', boxShadow:'var(--shadow)' },
  header: { marginBottom:'20px' },
  title: { fontSize:'20px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'8px' },
  subtitle: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6' },
  linkBox: { display:'flex', gap:'10px', background:'var(--bg)', borderRadius:'10px', border:'1px solid var(--border)', padding:'12px 16px', marginBottom:'20px', alignItems:'center' },
  linkText: { flex:1, fontSize:'13px', color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  copyBtn: { padding:'8px 16px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:'500', cursor:'pointer', flexShrink:0, minHeight:'44px' },
  stats: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' },
  stat: { background:'var(--bg)', borderRadius:'10px', padding:'16px', textAlign:'center' },
  statNum: { display:'block', fontSize:'28px', fontWeight:'700', color:'var(--purple)', fontFamily:'Nunito, system-ui, sans-serif', marginBottom:'4px' },
  statLabel: { fontSize:'12px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' },
  bonus: { background:'var(--green-light)', borderRadius:'10px', padding:'14px 16px' },
  bonusText: { fontSize:'13px', color:'var(--green)', lineHeight:'1.6' }
}

function DashboardContent() {
  const [checkinDone, setCheckinDone] = useState(false)
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [personalYear, setPersonalYear] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [globalLang] = useLanguage()
  const [profileLang, setProfileLang] = useState('en')

  // limba globală are prioritate; dacă nu e setată, cade pe limba profilului
  const lang = globalLang || profileLang || 'en'

  useEffect(() => {
    const id = getUserId()
    setUserId(id)

    const stored = localStorage.getItem('profile')
    if (stored) {
      try {
        const profile = JSON.parse(stored)
        if (profile.personal_year) setPersonalYear(profile.personal_year)
        if (profile.language) setProfileLang(profile.language)
      } catch (e) {}
    }

    fetch(`/api/dashboard?user_id=${id}`)
      .then(r => r.json())
      .then((dashData) => {
        if (dashData.success) {
          setStreak(dashData.streak.current_streak || 0)
          setLongestStreak(dashData.streak.longest_streak || 0)
          setCheckinDone(dashData.checkedInToday || false)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleCheckinComplete = (data) => {
    if (data && data.success) {
      setStreak(data.streak)
      setLongestStreak(data.longest_streak)
    }
    setCheckinDone(true)
  }

  if (loading) return (
    <div style={{textAlign:'center', padding:'80px', fontSize:'18px', color:'var(--text-muted)'}}>
      {t(lang, 'loading_dashboard')}
    </div>
  )

  return (
    <>
      <div className="cosmic-bg" />
      <CosmicStars />
      <main style={s.wrap} className="dashboard-cards-stagger">

        <div style={s.header}>
          <div>
            <span className="tag tag-purple shimmer-overlay" style={{marginBottom:'12px', display:'inline-block'}}>
              {t(lang, 'dashboard_tag')}
            </span>
            <h1 style={s.title}>{t(lang, 'dashboard_title')}</h1>
            <p style={s.subtitle}>{t(lang, 'dashboard_subtitle')}</p>
          </div>
          <a href="/" style={s.homeLink}>{t(lang, 'home')}</a>
        </div>

        <PersonalYearBanner personalYear={personalYear} lang={lang} />

        {/* ── DIMINEAȚA: Gândul Zilei + reflecția de stare ── */}
        <DailyInsight />

        <MorningReflection lang={lang} />

        {/* ── SEARA: cele 3 întrebări scrise ── */}
        <EveningCheckin
          lang={lang}
          onComplete={handleCheckinComplete}
          checkinDone={checkinDone}
        />

        {/* prezență blândă, fără scor */}
        <StreakTracker streak={streak} longestStreak={longestStreak} lang={lang} />

        <WeeklyReset lang={lang} />

        {isFeatureUnlocked('journal', getAccountAgeDays()) && (
          <FreeJournal lang={lang} />
        )}

        {isFeatureUnlocked('patterns', getAccountAgeDays()) && (
          <PatternsInsight lang={lang} />
        )}

        {isFeatureUnlocked('review', getAccountAgeDays()) && (
          <WeeklyReview />
        )}

        {isFeatureUnlocked('commitment', getAccountAgeDays()) && (
          <CommitmentDocument lang={lang} />
        )}

        <ProgressiveUnlock lang={lang} />

        {/* creșterea organică — jos, afară din fluxul de reflecție */}
        <EmailCapture lang={lang} />

        {userId && <InviteSection userId={userId} lang={lang} />}

      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'720px', margin:'0 auto', padding:'40px 24px 80px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'40px', flexWrap:'wrap', gap:'12px' },
  title: { fontSize:'clamp(28px, 7vw, 42px)', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  subtitle: { fontSize:'16px', color:'var(--text-muted)', marginTop:'6px' },
  homeLink: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500', marginTop:'8px', display:'inline-block', padding:'8px 12px', minHeight:'44px' },
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ textAlign:'center', padding:'80px' }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}