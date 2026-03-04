'use client'

export default function StreakTracker({ streak, longestStreak }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Streak Tracker</h2>

      <div style={styles.streakRow}>
        <div style={styles.streakStat}>
          <p style={styles.streakNumber}>{streak}</p>
          <p style={styles.streakLabel}>Current Streak</p>
        </div>
        <div style={styles.streakDivider} />
        <div style={styles.streakStat}>
          <p style={styles.streakNumber}>{longestStreak || streak}</p>
          <p style={styles.streakLabel}>Longest Streak</p>
        </div>
      </div>

      <div style={styles.weekRow}>
        {days.map((day, i) => (
          <div key={i} style={styles.dayColumn}>
            <div style={{
              ...styles.dayDot,
              backgroundColor: i <= adjustedToday ? '#111' : '#eee'
            }} />
            <p style={styles.dayLabel}>{day}</p>
          </div>
        ))}
      </div>

      <p style={styles.encouragement}>
        {streak === 0 && 'Start your streak today.'}
        {streak === 1 && 'Good start. Come back tomorrow.'}
        {streak >= 2 && streak < 7 && `${streak} days in. Keep going.`}
        {streak >= 7 && streak < 30 && `${streak} days strong. You're building real momentum.`}
        {streak >= 30 && `${streak} days. Remarkable consistency.`}
      </p>
    </div>
  )
}

const styles = {
  card: { background: '#f9f9f9', borderRadius: '12px', padding: '28px', marginBottom: '24px' },
  cardTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '24px' },
  streakRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
  streakStat: { textAlign: 'center', padding: '0 32px' },
  streakNumber: { fontSize: '36px', fontWeight: '700', color: '#111', marginBottom: '4px' },
  streakLabel: { fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' },
  streakDivider: { width: '1px', height: '60px', backgroundColor: '#ddd' },
  weekRow: { display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' },
  dayColumn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  dayDot: { width: '32px', height: '32px', borderRadius: '50%' },
  dayLabel: { fontSize: '11px', color: '#aaa', fontWeight: '500' },
  encouragement: { textAlign: 'center', fontSize: '14px', color: '#666', fontStyle: 'italic' }
}