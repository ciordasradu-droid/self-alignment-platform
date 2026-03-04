'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubscribePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'guest' })
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <main style={styles.container}>

      <div style={styles.header}>
        <h1 style={styles.title}>Accountability System</h1>
        <p style={styles.subtitle}>
          Your profile gives you clarity. The accountability system keeps you moving.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.priceRow}>
          <span style={styles.price}>$15</span>
          <span style={styles.period}>/month</span>
        </div>

        <ul style={styles.featureList}>
          <li style={styles.feature}>✦ Daily check-in system</li>
          <li style={styles.feature}>✦ Alignment score tracking</li>
          <li style={styles.feature}>✦ Streak tracker</li>
          <li style={styles.feature}>✦ Weekly review module</li>
          <li style={styles.feature}>✦ Behavioral pattern insights</li>
          <li style={styles.feature}>✦ Cancel anytime</li>
        </ul>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? '#999' : '#111',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Redirecting...' : 'Start Accountability →'}
        </button>

        <p style={styles.disclaimer}>
          Billed monthly. Cancel anytime from your account settings.
        </p>
      </div>

      <div style={styles.backLink}>
        <button
          onClick={() => router.push('/dashboard')}
          style={styles.linkButton}
        >
          ← Already subscribed? Go to dashboard
        </button>
      </div>

    </main>
  )
}

const styles = {
  container: { maxWidth: '480px', margin: '60px auto', padding: '0 20px' },
  header: { marginBottom: '32px', textAlign: 'center' },
  title: { fontSize: '28px', fontWeight: '700', marginBottom: '12px' },
  subtitle: { fontSize: '16px', color: '#666', lineHeight: '1.6' },
  card: { background: '#f9f9f9', borderRadius: '16px', padding: '32px', marginBottom: '24px' },
  priceRow: { textAlign: 'center', marginBottom: '24px' },
  price: { fontSize: '48px', fontWeight: '700', color: '#111' },
  period: { fontSize: '18px', color: '#888' },
  featureList: { listStyle: 'none', padding: '0', margin: '0 0 28px 0' },
  feature: { fontSize: '15px', padding: '10px 0', borderBottom: '1px solid #eee', color: '#333' },
  button: { width: '100%', padding: '14px', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px' },
  disclaimer: { textAlign: 'center', fontSize: '12px', color: '#aaa', marginTop: '16px' },
  backLink: { textAlign: 'center' },
  linkButton: { background: 'none', border: 'none', color: '#888', fontSize: '14px', cursor: 'pointer' }
}