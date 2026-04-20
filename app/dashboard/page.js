'use client'

import { useState, useEffect, Suspense } from 'react'
import DailyCheckin from './components/DailyCheckin'
import AlignmentScore from './components/AlignmentScore'
import StreakTracker from './components/StreakTracker'
import WeeklyReview from './components/WeeklyReview'
import EmailCapture from './components/EmailCapture'
import DailyInsight from './components/DailyInsight'
import WeeklyReset from './components/WeeklyReset'
import ProgressiveUnlock from './components/ProgressiveUnlock'
import FreeJournal from './components/FreeJournal'
import CommitmentDocument from './components/CommitmentDocument'
import { isFeatureUnlocked, getAccountAgeDays } from './components/ProgressiveUnlock'
import { getUserId } from '../../lib/userId'
import { t } from '../../lib/translations'

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

function UpgradeBanner({ lang }) {
  return (
    <div style={up.banner}>
      <div style={up.left}>
        <p style={up.title}>{t(lang, 'free_trial')}</p>
        <p style={up.text}>{t(lang, 'free_trial_text')}</p>
      </div>
      <a href="/subscribe" style={up.btn}>{t(lang, 'upgrade_btn')}</a>
    </div>
  )
}

const up = {
  banner: { background:'linear-gradient(135deg, var(--purple-dark) 0%, var(--purple) 100%)', borderRadius:'var(--radius)', padding:'20px 24px', marginBottom:'28px', display:'flex', gap:'20px', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' },
  left: { flex:1 },
  title: { fontSize:'16px', fontWeight:'600', color:'#fff', marginBottom:'4px' },
  text: { fontSize:'13px', color:'rgba(255,255,255,0.7)' },
  btn: { padding:'10px 20px', background:'#fff', color:'var(--purple-dark)', borderRadius:'8px', fontSize:'14px', fontWeight:'600', flexShrink:0 }
}

function InviteSection({ userId, lang }) {
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState(0)
  const inviteLink = `${window.location.origin}/invite/${userId}`

  useEffect(() => {
    fetch(`/api/invite?user_id=${userId}`)
      .then(r => r.json())
      .then(data => { if (data.success) setReferrals(data.referrals) })
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
  copyBtn: { padding:'8px 16px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:'500', cursor:'pointer', flexShrink:0 },
  stats: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' },
  stat: { background:'var(--bg)', borderRadius:'10px', padding:'16px', textAlign:'center' },
  statNum: { display:'block', fontSize:'28px', fontWeight:'700', color:'var(--purple)', fontFamily:'Cormorant Garamond, serif', marginBottom:'4px' },
  statLabel: { fontSize:'12px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' },
  bonus: { background:'var(--green-light)', borderRadius:'10px', padding:'14px 16px' },
  bonusText: { fontSize:'13px', color:'var(--green)', lineHeight:'1.6' }
}

function RecalibrationMode({ onComplete, personalYear, lang }) {
  const [checkinDone, setCheckinDone] = useState(false)
  const [score, setScore] = useState(0)

  return (
    <>
      <div className="cosmic-bg" />
      <main style={rec.wrap}>
        <div style={rec.header}>
          <span className="tag" style={{background:'rgba(232,130,74,0.15)', color:'var(--orange)', marginBottom:'16px', display:'inline-block'}}>
            {t(lang, 'recalibration_tag')}
          </span>
          <h1 style={rec.title}>{t(lang, 'recalibration_title')}</h1>
          <p style={rec.subtitle}>{t(lang, 'recalibration_subtitle')}</p>
        </div>
        <PersonalYearBanner personalYear={personalYear} lang={lang} />
        <div style={rec.focusCard}>
          <p style={rec.focusLabel}>{t(lang, 'only_focus')}</p>
          <p style={rec.focusText}>{t(lang, 'only_focus_text')}</p>
        </div>
        <div style={rec.threeThings}>
          <p style={rec.thingsLabel}>{t(lang, 'three_things')}</p>
          {t(lang, 'recal_items').map((item, i) => (
            <div key={i} style={rec.thingItem}>
              <span style={{color:'var(--orange)', marginRight:'12px', fontSize:'18px'}}>◎</span>
              <p style={rec.thingText}>{item}</p>
            </div>
          ))}
        </div>
        <DailyCheckin
          onComplete={(s) => {
            setCheckinDone(true)
            setScore(s)
            if (s >= 40) setTimeout(() => onComplete(s), 1500)
          }}
          checkinDone={checkinDone}
        />
        {checkinDone && score < 40 && (
          <div style={rec.stillLow}>
            <p style={rec.stillLowText}>{t(lang, 'still_low')}</p>
          </div>
        )}
        {checkinDone && score >= 40 && (
          <div style={rec.unlocked}>
            <p style={rec.unlockedText}>{t(lang, 'unlocked')}</p>
          </div>
        )}
      </main>
    </>
  )
}

const rec = {
  wrap: { maxWidth:'560px', margin:'0 auto', padding:'60px 24px 80px' },
  header: { marginBottom:'32px' },
  title: { fontSize:'36px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'12px' },
  subtitle: { fontSize:'15px', color:'var(--text-muted)', lineHeight:'1.8' },
  focusCard: { background:'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', borderRadius:'var(--radius)', padding:'28px', marginBottom:'20px' },
  focusLabel: { fontSize:'11px', fontWeight:'700', color:'var(--orange)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' },
  focusText: { fontSize:'16px', color:'rgba(255,255,255,0.85)', lineHeight:'1.7' },
  threeThings: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'24px', marginBottom:'24px' },
  thingsLabel: { fontSize:'12px', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'16px' },
  thingItem: { display:'flex', alignItems:'flex-start', padding:'10px 0', borderBottom:'1px solid var(--border)' },
  thingText: { fontSize:'14px', color:'var(--text)', lineHeight:'1.6' },
  stillLow: { background:'var(--orange-light)', borderRadius:'var(--radius)', padding:'20px', marginTop:'16px' },
  stillLowText: { fontSize:'14px', color:'var(--orange)', lineHeight:'1.7', textAlign:'center' },
  unlocked: { background:'var(--green-light)', borderRadius:'var(--radius)', padding:'20px', marginTop:'16px' },
  unlockedText: { fontSize:'15px', color:'var(--green)', lineHeight:'1.7', textAlign:'center', fontWeight:'500' }
}

function ShadowAlert({ score, lang }) {
  if (score === 0 || score >= 40) return null
  const messages = t(lang, 'shadow_messages')
  const message = messages[Math.floor(Math.random() * messages.length)]
  return (
    <div style={al.card}>
      <div style={al.header}>
        <span style={{color:'var(--orange)'}}>◦</span>
        <p style={al.title}>{t(lang, 'pattern_detected')}</p>
      </div>
      <p style={al.message}>{message}</p>
      <div style={al.actions}>
        <p style={al.actionLabel}>{t(lang, 'one_thing')}</p>
        {t(lang, 'shadow_actions').map((action, i) => (
          <div key={i} style={al.actionItem}>
            <span style={{color:'var(--orange)', marginRight:'8px'}}>→</span>
            {action}
          </div>
        ))}
      </div>
    </div>
  )
}

const al = {
  card: { background:'linear-gradient(135deg, #2d1b00 0%, #3d2400 100%)', borderRadius:'var(--radius)', padding:'28px', marginBottom:'24px', border:'1px solid rgba(232,130,74,0.3)' },
  header: { display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' },
  title: { fontSize:'14px', fontWeight:'700', color:'var(--orange)', textTransform:'uppercase', letterSpacing:'0.5px' },
  message: { fontSize:'15px', color:'rgba(255,255,255,0.85)', lineHeight:'1.7', marginBottom:'20px' },
  actions: { background:'rgba(255,255,255,0.05)', borderRadius:'10px', padding:'16px' },
  actionLabel: { fontSize:'12px', fontWeight:'600', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px' },
  actionItem: { fontSize:'14px', color:'rgba(255,255,255,0.75)', padding:'6px 0', display:'flex', alignItems:'flex-start' }
}

function DashboardContent() {
  const [checkinDone, setCheckinDone] = useState(false)
  const [alignmentScore, setAlignmentScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [recalibrating, setRecalibrating] = useState(false)
  const [personalYear, setPersonalYear] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [subscribed, setSubscribed] = useState(false)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const id = getUserId()
    setUserId(id)

    const stored = localStorage.getItem('profile')
    if (stored) {
      const profile = JSON.parse(stored)
      if (profile.personal_year) setPersonalYear(profile.personal_year)
      if (profile.language) setLang(profile.language)
    }

    Promise.all([
      fetch(`/api/dashboard?user_id=${id}`).then(r => r.json()),
      fetch(`/api/subscription?user_id=${id}`).then(r => r.json())
    ]).then(([dashData, subData]) => {
      if (dashData.success) {
        setStreak(dashData.streak.current_streak || 0)
        setLongestStreak(dashData.streak.longest_streak || 0)
        setAlignmentScore(dashData.lastScore || 0)
        setCheckinDone(dashData.checkedInToday || false)
      }
      setSubscribed(subData.subscribed || false)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleCheckinComplete = async (score, answers) => {
    const id = getUserId()
    const res = await fetch('/api/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: id, score, answers })
    })
    const data = await res.json()
    if (data.success) {
      setStreak(data.streak)
      setLongestStreak(data.longest_streak)
    }
    setCheckinDone(true)
    setAlignmentScore(score)
    if (score < 40) setRecalibrating(true)
  }

  if (loading) return (
    <div style={{textAlign:'center', padding:'80px', fontSize:'18px', color:'var(--text-muted)'}}>
      {t(lang, 'loading_dashboard')}
    </div>
  )

  if (recalibrating) {
    return (
      <RecalibrationMode
        personalYear={personalYear}
        lang={lang}
        onComplete={(score) => {
          setAlignmentScore(score)
          setRecalibrating(false)
          setCheckinDone(true)
        }}
      />
    )
  }

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>

        <div style={s.header}>
          <div>
            <span className="tag tag-purple" style={{marginBottom:'12px', display:'inline-block'}}>
              {t(lang, 'dashboard_tag')}
            </span>
            <h1 style={s.title}>{t(lang, 'dashboard_title')}</h1>
            <p style={s.subtitle}>{t(lang, 'dashboard_subtitle')}</p>
          </div>
          <a href="/" style={s.homeLink}>{t(lang, 'home')}</a>
        </div>

        <PersonalYearBanner personalYear={personalYear} lang={lang} />

        {!subscribed && <UpgradeBanner lang={lang} />}

        <WeeklyReset />

        <DailyInsight />

        <div style={s.statsRow}>
          <div style={{...s.statCard, borderTop:'3px solid var(--purple)'}}>
            <p style={s.statLabel}>{t(lang, 'alignment_score')}</p>
            <p style={{...s.statValue, color:'var(--purple)'}}>{alignmentScore}</p>
          </div>
          <div style={{...s.statCard, borderTop:'3px solid var(--green)'}}>
            <p style={s.statLabel}>{t(lang, 'current_streak')}</p>
            <p style={{...s.statValue, color:'var(--green)'}}>{streak}<span style={s.statUnit}> {t(lang, 'days')}</span></p>
          </div>
          <div style={{...s.statCard, borderTop:'3px solid var(--orange)'}}>
            <p style={s.statLabel}>{t(lang, 'today')}</p>
            <p style={{...s.statValue, color: checkinDone ? 'var(--green)' : 'var(--orange)'}}>
              {checkinDone ? t(lang, 'done') : t(lang, 'pending')}
            </p>
          </div>
        </div>

        <ShadowAlert score={alignmentScore} lang={lang} />

        <DailyCheckin
          onComplete={handleCheckinComplete}
          checkinDone={checkinDone}
        />

        <AlignmentScore score={alignmentScore} />

        <StreakTracker streak={streak} longestStreak={longestStreak} />

        {isFeatureUnlocked('journal', getAccountAgeDays()) && (
          <FreeJournal lang={lang} />
        )}

        {isFeatureUnlocked('review', getAccountAgeDays()) && (
          <WeeklyReview />
        )}

        {isFeatureUnlocked('commitment', getAccountAgeDays()) && (
          <CommitmentDocument lang={lang} />
        )}

        <EmailCapture />

        {userId && <InviteSection userId={userId} lang={lang} />}

        <ProgressiveUnlock lang={lang} />

      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'720px', margin:'0 auto', padding:'40px 24px 80px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'40px' },
  title: { fontSize:'42px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  subtitle: { fontSize:'16px', color:'var(--text-muted)', marginTop:'6px' },
  homeLink: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500', marginTop:'8px' },
  statsRow: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginBottom:'32px' },
  statCard: { background:'var(--surface)', borderRadius:'var(--radius)', padding:'24px', textAlign:'center', border:'1px solid var(--border)', boxShadow:'var(--shadow)' },
  statLabel: { fontSize:'12px', color:'var(--text-muted)', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:'600' },
  statValue: { fontSize:'32px', fontWeight:'700', fontFamily:'Cormorant Garamond, serif' },
  statUnit: { fontSize:'16px', fontWeight:'400' }
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ textAlign:'center', padding:'80px' }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}