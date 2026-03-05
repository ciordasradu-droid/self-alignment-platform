'use client'

import { useState, Suspense } from 'react'
import DailyCheckin from './components/DailyCheckin'
import AlignmentScore from './components/AlignmentScore'
import StreakTracker from './components/StreakTracker'
import WeeklyReview from './components/WeeklyReview'

function ShadowAlert({ score, streak }) {
  const showAlert = score > 0 && score < 40

  if (!showAlert) return null

  const messages = [
    "Your alignment has been low lately. This is not failure — it's a signal. You know what needs to change.",
    "A pattern is showing up. Not to judge you, but to remind you: small consistent actions beat big bursts of motivation.",
    "Low alignment days are part of the journey. The question is not why it happened — it's what one thing you can do right now to reset.",
    "Your system is telling you something. Slow down, simplify, and come back to your non-negotiables today."
  ]

  const message = messages[Math.floor(Math.random() * messages.length)]

  return (
    <div style={a.card}>
      <div style={a.header}>
        <span style={a.icon}>◦</span>
        <p style={a.title}>Pattern Detected</p>
      </div>
      <p style={a.message}>{message}</p>
      <div style={a.actions}>
        <p style={a.actionLabel}>One thing to do right now:</p>
        <div style={a.actionItems}>
          {[
            'Return to your morning ritual',
            'Do one non-negotiable from your profile',
            'Take 10 minutes of silence — no phone'
          ].map((action, i) => (
            <div key={i} style={a.actionItem}>
              <span style={{color:'var(--orange)', marginRight:'8px'}}>→</span>
              {action}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const a = {
  card: { background:'linear-gradient(135deg, #2d1b00 0%, #3d2400 100%)', borderRadius:'var(--radius)', padding:'28px', marginBottom:'24px', border:'1px solid rgba(232,130,74,0.3)' },
  header: { display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' },
  icon: { fontSize:'20px', color:'var(--orange)' },
  title: { fontSize:'14px', fontWeight:'700', color:'var(--orange)', textTransform:'uppercase', letterSpacing:'0.5px' },
  message: { fontSize:'15px', color:'rgba(255,255,255,0.85)', lineHeight:'1.7', marginBottom:'20px' },
  actions: { background:'rgba(255,255,255,0.05)', borderRadius:'10px', padding:'16px' },
  actionLabel: { fontSize:'12px', fontWeight:'600', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px' },
  actionItems: {},
  actionItem: { fontSize:'14px', color:'rgba(255,255,255,0.75)', padding:'6px 0', display:'flex', alignItems:'flex-start' }
}

function DashboardContent() {
  const [checkinDone, setCheckinDone] = useState(false)
  const [alignmentScore, setAlignmentScore] = useState(0)
  const [streak, setStreak] = useState(0)

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

        <div style={s.statsRow}>
          <div style={{...s.statCard, borderTop:'3px solid var(--purple)'}}>
            <p style={s.statLabel}>Alignment Score</p>
            <p style={{...s.statValue, color:'var(--purple)'}}>{alignmentScore}</p>
          </div>
          <div style={{...s.statCard, borderTop:'3px solid var(--green)'}}>
            <p style={s.statLabel}>Current Streak</p>
            <p style={{...s.statValue, color:'var(--green)'}}>{streak} <span style={s.statUnit}>days</span></p>
          </div>
          <div style={{...s.statCard, borderTop:'3px solid var(--orange)'}}>
            <p style={s.statLabel}>Today</p>
            <p style={{...s.statValue, color: checkinDone ? 'var(--green)' : 'var(--orange)'}}>
              {checkinDone ? '✓ Done' : 'Pending'}
            </p>
          </div>
        </div>

        <ShadowAlert score={alignmentScore} streak={streak} />

        <DailyCheckin
          onComplete={(score) => {
            setCheckinDone(true)
            setAlignmentScore(score)
            setStreak(prev => prev + 1)
          }}
          checkinDone={checkinDone}
        />

        <AlignmentScore score={alignmentScore} />

        <StreakTracker streak={streak} longestStreak={streak} />

        <WeeklyReview />

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