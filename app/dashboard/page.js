'use client'

import { useState, Suspense } from 'react'
import DailyCheckin from './components/DailyCheckin'
import AlignmentScore from './components/AlignmentScore'
import StreakTracker from './components/StreakTracker'
import WeeklyReview from './components/WeeklyReview'

function DashboardContent() {
  const [checkinDone, setCheckinDone] = useState(false)
  const [alignmentScore, setAlignmentScore] = useState(0)
  const [streak, setStreak] = useState(0)

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>

        {/* Header */}
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

        {/* Stats Row */}
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

        {/* Daily Check-in */}
        <DailyCheckin
          onComplete={(score) => {
            setCheckinDone(true)
            setAlignmentScore(score)
            setStreak(prev => prev + 1)
          }}
          checkinDone={checkinDone}
        />

        {/* Alignment Score */}
        <AlignmentScore score={alignmentScore} />

        {/* Streak Tracker */}
        <StreakTracker streak={streak} longestStreak={streak} />

        {/* Weekly Review */}
        <WeeklyReview />

      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'720px', margin:'0 auto', padding:'40px 24px 80px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'40px' },
  title: { fontSize:'42px', fontWeight:'600', color:'var(--text)' },
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