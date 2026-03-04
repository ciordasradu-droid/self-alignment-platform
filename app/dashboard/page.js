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
    <main style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Alignment Dashboard</h1>
        <p style={styles.subtitle}>Stay consistent. Build momentum.</p>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Alignment Score</p>
          <p style={styles.statValue}>{alignmentScore}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Current Streak</p>
          <p style={styles.statValue}>{streak} days</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Today</p>
          <p style={styles.statValue}>{checkinDone ? '✓ Done' : 'Pending'}</p>
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
  )
}

const styles = {
  container: { maxWidth: '720px', margin: '0 auto', padding: '40px 20px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '32px', fontWeight: '700', marginBottom: '8px' },
  subtitle: { fontSize: '16px', color: '#666' },
  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' },
  statCard: { background: '#f9f9f9', borderRadius: '12px', padding: '20px', textAlign: 'center' },
  statLabel: { fontSize: '13px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#111' }
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px' }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}