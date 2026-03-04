'use client'

export default function AlignmentScore({ score }) {
  const getColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#eab308'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  const getLabel = (score) => {
    if (score >= 80) return 'Strong Alignment'
    if (score >= 60) return 'Moderate Alignment'
    if (score >= 40) return 'Low Alignment'
    return 'Off Track'
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Alignment Score</h2>
      <div style={styles.scoreCircle}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#eee" strokeWidth="12" />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={getColor(score)}
            strokeWidth="12"
            strokeDasharray={`${(score / 100) * 339} 339`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div style={styles.scoreText}>
          <p style={{ ...styles.scoreNumber, color: getColor(score) }}>{score}</p>
          <p style={styles.scoreMax}>/100</p>
        </div>
      </div>
      <p style={{ ...styles.scoreLabel, color: getColor(score) }}>{getLabel(score)}</p>
      <p style={styles.scoreSubtext}>Based on your last 7 check-ins</p>
    </div>
  )
}

const styles = {
  card: { background: '#f9f9f9', borderRadius: '12px', padding: '28px', marginBottom: '24px', textAlign: 'center' },
  cardTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '24px' },
  scoreCircle: { position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px' },
  scoreText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' },
  scoreNumber: { fontSize: '28px', fontWeight: '700', lineHeight: '1' },
  scoreMax: { fontSize: '12px', color: '#aaa' },
  scoreLabel: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' },
  scoreSubtext: { fontSize: '13px', color: '#aaa' }
}