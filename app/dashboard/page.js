'use client'

import { useState, useEffect, Suspense } from 'react'
import DailyCheckin from './components/DailyCheckin'
import AlignmentScore from './components/AlignmentScore'
import StreakTracker from './components/StreakTracker'
import WeeklyReview from './components/WeeklyReview'
import EmailCapture from './components/EmailCapture'
import DailyInsight from './components/DailyInsight'
import { getUserId } from '../../lib/userId'

function PersonalYearBanner({ personalYear }) {
  if (!personalYear) return null
  return (
    <div style={py.banner}>
      <div style={py.left}>
        <span style={py.num}>{personalYear.personal_year}</span>
        <div>
          <p style={py.label}>Your Current Phase</p>
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

function InviteSection({ userId }) {
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
        <span className="tag tag-green" style={{marginBottom:'8px', display:'inline-block'}}>Invite Friends</span>
        <h3 style={inv.title}>Bring a friend. Get a free month.</h3>
        <p style={inv.subtitle}>
          For every friend who subscribes to the Accountability System,
          you get <strong>1 month free</strong>. Share your unique link below.
        </p>
      </div>
      <div style={inv.linkBox}>
        <p style={inv.linkText}>{inviteLink}</p>
        <button onClick={handleCopy} style={inv.copyBtn}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div style={inv.stats}>
        <div style={inv.stat}>
          <span style={inv.statNum}>{referrals}</span>
          <span style={inv.statLabel}>Friends invited</span>
        </div>
        <div style={inv.stat}>
          <span style={{...inv.statNum, color:'var(--green)'}}>{referrals}</span>
          <span style={inv.statLabel}>Free months earned</span>
        </div>
      </div>
      <div style={inv.bonus}>
        <p style={inv.bonusText}>
          ✦ Invite a friend and both get a <strong>free Compatibility Profile</strong> — see how your energies align.
        </p>
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

function RecalibrationMode({ onComplete, personalYear }) {
  const [checkinDone, setCheckinDone] = useState(false)
  const [score, setScore] = useState(0)

  return (
    <>
      <div className="cosmic-bg" />
      <main style={rec.wrap}>
        <div style={rec.header}>
          <span className="tag" style={{background:'rgba(232,130,74,0.15)', color:'var(--orange)', marginBottom:'16px', display:'inline-block'}}>
            Recalibration Mode
          </span>
          <h1 style={rec.title}>Let's come back to basics.</h1>
          <p style={rec.subtitle}>
            Your alignment has been low. That's okay — it happens to everyone.
            This is not a setback. This is the system working exactly as it should.
            Simplify. Slow down. Return to what matters.
          </p>
        </div>
        <PersonalYearBanner personalYear={personalYear} />
        <div style={rec.focusCard}>
          <p style={rec.focusLabel}>Your only focus right now</p>
          <p style={rec.focusText}>Complete today's check-in honestly. One small act of alignment is enough to reset the momentum.</p>
        </div>
        <div style={rec.threeThings}>
          <p style={rec.thingsLabel}>Three things to return to today</p>
          {[
            { icon:'◎', text:'Your morning ritual — even 5 minutes counts' },
            { icon:'✦', text:'One non-negotiable from your personal agreements' },
            { icon:'◦', text:'10 minutes of silence — no phone, no input' }
          ].map((item, i) => (
            <div key={i} style={rec.thingItem}>
              <span style={{color:'var(--orange)', marginRight:'12px', fontSize:'18px'}}>{item.icon}</span>
              <p style={rec.thingText}>{item.text}</p>
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
            <p style={rec.stillLowText}>
              Your score is still low — and that's okay. Come back tomorrow.
              Every check-in is a step forward, even the hard ones.
            </p>
          </div>
        )}
        {checkinDone && score >= 40 && (
          <div style={rec.unlocked}>
            <p style={rec.unlockedText}>✦ Your alignment is returning. Dashboard unlocked.</p>
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

function ShadowAlert({ score }) {
  if (score === 0 || score >= 40) return null
  const messages = [
    "Your alignment has been low lately. This is not failure — it's a signal. You know what needs to change.",
    "A pattern is showing up. Not to judge you, but to remind you: small consistent actions beat big bursts of motivation.",
    "Low alignment days are part of the journey. The question is not why it happened — it's what one thing you can do right now to reset.",
    "Your system is telling you something. Slow down, simplify, and come back to your non-negotiables today."
  ]
  const message = messages[Math.floor(Math.random() * messages.length)]
  return (
    <div style={al.card}>
      <div style={al.header}>
        <span style={{color:'var(--orange)'}}>◦</span>
        <p style={al.title}>Pattern Detected</p>
      </div>
      <p style={al.message}>{message}</p>
      <div style={al.actions}>
        <p style={al.actionLabel}>One thing to do right now:</p>
        {[
          'Return to your morning ritual',
          'Do one non-negotiable from your profile',
          'Take 10 minutes of silence — no phone'
        ].map((action, i) => (
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

  useEffect(() => {
    const id = getUserId()
    setUserId(id)

    const stored = localStorage.getItem('profile')
    if (stored) {
      const profile = JSON.parse(stored)
      if (profile.personal_year) setPersonalYear(profile.personal_year)
    }

    fetch(`/api/dashboard?user_id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStreak(data.streak.current_streak || 0)
          setLongestStreak(data.streak.longest_streak || 0)
          setAlignmentScore(data.lastScore || 0)
          setCheckinDone(data.checkedInToday || false)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
      Loading your dashboard...
    </div>
  )

  if (recalibrating) {
    return (
      <RecalibrationMode
        personalYear={personalYear}
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
              Accountability System
            </span>
            <h1 style={s.title}>Alignment Dashboard</h1>
            <p style={s.subtitle}>Stay consistent. Build momentum.</p>
          </div>
          <a href="/" style={s.homeLink}>← Home</a>
        </div>

        <PersonalYearBanner personalYear={personalYear} />

        <DailyInsight />

        <div style={s.statsRow}>
          <div style={{...s.statCard, borderTop:'3px solid var(--purple)'}}>
            <p style={s.statLabel}>Alignment Score</p>
            <p style={{...s.statValue, color:'var(--purple)'}}>{alignmentScore}</p>
          </div>
          <div style={{...s.statCard, borderTop:'3px solid var(--green)'}}>
            <p style={s.statLabel}>Current Streak</p>
            <p style={{...s.statValue, color:'var(--green)'}}>{streak}<span style={s.statUnit}> days</span></p>
          </div>
          <div style={{...s.statCard, borderTop:'3px solid var(--orange)'}}>
            <p style={s.statLabel}>Today</p>
            <p style={{...s.statValue, color: checkinDone ? 'var(--green)' : 'var(--orange)'}}>
              {checkinDone ? '✓ Done' : 'Pending'}
            </p>
          </div>
        </div>

        <ShadowAlert score={alignmentScore} />

        <DailyCheckin
          onComplete={handleCheckinComplete}
          checkinDone={checkinDone}
        />

        <AlignmentScore score={alignmentScore} />

        <StreakTracker streak={streak} longestStreak={longestStreak} />

        <WeeklyReview />

        <EmailCapture />

        {userId && <InviteSection userId={userId} />}

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