'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { generateProfilePDF } from '../../lib/generatePDF'

function ProfileContent() {
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const data = searchParams.get('data')
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data))
        setProfile(parsed)
      } catch (e) {
        setError('Could not load profile data.')
      }
    }
    setLoading(false)
  }, [searchParams])

  if (loading) return <div style={styles.center}>Generating your profile...</div>
  if (error) return <div style={styles.center}>{error}</div>
  if (!profile) return <div style={styles.center}>No profile data found.</div>

  const { sections, swot, alignment_plan, full_name } = profile

  const handleDownloadPDF = () => {
    generateProfilePDF(profile)
  }

  return (
    <main style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Your Alignment Profile</h1>
        {full_name && <p style={styles.subtitle}>Generated for {full_name}</p>}
        <button
          onClick={handleDownloadPDF}
          style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
        >
          Download PDF ↓
        </button>
      </div>

      {/* Blueprint */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Core Energetic Blueprint</h2>
        <p style={styles.text}>{sections?.blueprint}</p>
      </section>

      {/* Strengths */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Natural Strengths</h2>
        <ul style={styles.list}>
          {sections?.strengths?.map((item, i) => (
            <li key={i} style={styles.listItem}>✦ {item}</li>
          ))}
        </ul>
      </section>

      {/* Vulnerabilities */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Natural Vulnerabilities</h2>
        <ul style={styles.list}>
          {sections?.vulnerabilities?.map((item, i) => (
            <li key={i} style={styles.listItem}>◦ {item}</li>
          ))}
        </ul>
      </section>

      {/* Energy Patterns */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Energy Patterns</h2>
        <ul style={styles.list}>
          {sections?.energy_patterns?.map((item, i) => (
            <li key={i} style={styles.listItem}>◦ {item}</li>
          ))}
        </ul>
      </section>

      {/* Self-Sabotage */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Self-Sabotage Tendencies</h2>
        <ul style={styles.list}>
          {sections?.sabotage_tendencies?.map((item, i) => (
            <li key={i} style={styles.listItem}>⚠ {item}</li>
          ))}
        </ul>
      </section>

      {/* Decision Making */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Decision-Making Style</h2>
        <ul style={styles.list}>
          {sections?.decision_making?.map((item, i) => (
            <li key={i} style={styles.listItem}>◦ {item}</li>
          ))}
        </ul>
      </section>

      {/* Work & Discipline */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Work & Discipline Profile</h2>
        <ul style={styles.list}>
          {sections?.work_discipline?.map((item, i) => (
            <li key={i} style={styles.listItem}>◦ {item}</li>
          ))}
        </ul>
      </section>

      {/* SWOT */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>SWOT Analysis</h2>
        <div style={styles.swotGrid}>
          <div style={styles.swotBox}>
            <h3 style={styles.swotTitle}>Strengths</h3>
            <ul style={styles.list}>
              {swot?.strengths?.map((item, i) => (
                <li key={i} style={styles.listItem}>✦ {item}</li>
              ))}
            </ul>
          </div>
          <div style={styles.swotBox}>
            <h3 style={styles.swotTitle}>Weaknesses</h3>
            <ul style={styles.list}>
              {swot?.weaknesses?.map((item, i) => (
                <li key={i} style={styles.listItem}>◦ {item}</li>
              ))}
            </ul>
          </div>
          <div style={styles.swotBox}>
            <h3 style={styles.swotTitle}>Opportunities</h3>
            <ul style={styles.list}>
              {swot?.opportunities?.map((item, i) => (
                <li key={i} style={styles.listItem}>✦ {item}</li>
              ))}
            </ul>
          </div>
          <div style={styles.swotBox}>
            <h3 style={styles.swotTitle}>Threats</h3>
            <ul style={styles.list}>
              {swot?.threats?.map((item, i) => (
                <li key={i} style={styles.listItem}>⚠ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Alignment Plan */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Alignment Plan</h2>

        <h3 style={styles.planTitle}>Layer 1 — Directional Clarity</h3>
        <p style={styles.text}>{alignment_plan?.directional_clarity?.life_direction}</p>
        <p style={styles.label}>Prioritize:</p>
        <ul style={styles.list}>
          {alignment_plan?.directional_clarity?.prioritize?.map((item, i) => (
            <li key={i} style={styles.listItem}>✦ {item}</li>
          ))}
        </ul>
        <p style={styles.label}>Eliminate:</p>
        <ul style={styles.list}>
          {alignment_plan?.directional_clarity?.eliminate?.map((item, i) => (
            <li key={i} style={styles.listItem}>✕ {item}</li>
          ))}
        </ul>

        <h3 style={styles.planTitle}>Layer 2 — Structured Plan</h3>
        <p style={styles.label}>30-Day Focus:</p>
        <p style={styles.text}>{alignment_plan?.structured_plan?.thirty_day_focus}</p>
        <p style={styles.label}>Weekly Template:</p>
        <ul style={styles.list}>
          {alignment_plan?.structured_plan?.weekly_template?.map((item, i) => (
            <li key={i} style={styles.listItem}>◦ {item}</li>
          ))}
        </ul>
        <p style={styles.label}>Daily Template:</p>
        <ul style={styles.list}>
          {alignment_plan?.structured_plan?.daily_template?.map((item, i) => (
            <li key={i} style={styles.listItem}>◦ {item}</li>
          ))}
        </ul>

        <h3 style={styles.planTitle}>Layer 3 — Behavioral Anchors</h3>
        <p style={styles.label}>Keystone Habits:</p>
        <ul style={styles.list}>
          {alignment_plan?.behavioral_anchors?.keystone_habits?.map((item, i) => (
            <li key={i} style={styles.listItem}>✦ {item}</li>
          ))}
        </ul>
        <p style={styles.label}>Anti-Sabotage Rules:</p>
        <ul style={styles.list}>
          {alignment_plan?.behavioral_anchors?.anti_sabotage_rules?.map((item, i) => (
            <li key={i} style={styles.listItem}>⚠ {item}</li>
          ))}
        </ul>
        <p style={styles.label}>Non-Negotiables:</p>
        <ul style={styles.list}>
          {alignment_plan?.behavioral_anchors?.non_negotiables?.map((item, i) => (
            <li key={i} style={styles.listItem}>✕ {item}</li>
          ))}
        </ul>
      </section>

    </main>
  )
}

const styles = {
  container: { maxWidth: '720px', margin: '0 auto', padding: '40px 20px' },
  center: { textAlign: 'center', padding: '80px 20px', fontSize: '18px' },
  header: { marginBottom: '40px' },
  title: { fontSize: '32px', fontWeight: '700', marginBottom: '8px' },
  subtitle: { fontSize: '16px', color: '#666' },
  card: { background: '#f9f9f9', borderRadius: '12px', padding: '28px', marginBottom: '24px' },
  sectionTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' },
  planTitle: { fontSize: '16px', fontWeight: '600', marginTop: '24px', marginBottom: '12px', color: '#333' },
  label: { fontSize: '14px', fontWeight: '600', color: '#666', marginTop: '16px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  text: { fontSize: '16px', lineHeight: '1.7', color: '#333' },
  list: { listStyle: 'none', padding: '0', margin: '0' },
  listItem: { fontSize: '15px', lineHeight: '1.6', color: '#444', padding: '6px 0', borderBottom: '1px solid #f0f0f0' },
  swotGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' },
  swotBox: { background: '#fff', borderRadius: '8px', padding: '16px' },
  swotTitle: { fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#333' }
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px' }}>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  )
}