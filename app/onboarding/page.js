'use client'

import { useState } from 'react'

export default function Onboarding() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    time_of_birth: '',
    city: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }

    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>

        <div style={s.header}>
          <a href="/" style={s.back}>← Back</a>
          <span className="tag tag-purple">Step 1 of 1</span>
        </div>

        <div style={s.card}>

          <div style={s.cardHeader}>
            <h1 style={s.title}>Your Alignment Profile</h1>
            <p style={s.subtitle}>
              Enter your birth details to generate your personal blueprint.
              Takes 30 seconds.
            </p>
            <div style={s.tags}>
              <span className="tag tag-purple">Astrology</span>
              <span className="tag tag-green">Human Design</span>
              <span className="tag tag-orange">Numerology</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>

            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                style={s.input}
              />
            </div>

            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  style={s.input}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Time of Birth</label>
                <input
                  type="time"
                  name="time_of_birth"
                  value={formData.time_of_birth}
                  onChange={handleChange}
                  required
                  style={s.input}
                />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>City of Birth</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="e.g. Bucharest"
                style={s.input}
              />
            </div>

            <div style={s.priceNote}>
              <span style={s.priceAmount}>$27</span>
              <span style={s.priceLabel}>one-time payment — full profile + PDF</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...s.btn,
                background: loading ? '#ccc' : 'var(--purple)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Redirecting to payment...' : 'Generate My Profile →'}
            </button>

            <p style={s.disclaimer}>
              Secure payment via Stripe. Your data is never shared.
            </p>

          </form>
        </div>
      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'560px', margin:'0 auto', padding:'32px 24px 80px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' },
  back: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500' },
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', boxShadow:'var(--shadow-lg)', overflow:'hidden' },
  cardHeader: { padding:'36px 36px 28px', borderBottom:'1px solid var(--border)', background:'linear-gradient(135deg, var(--purple-light) 0%, var(--green-light) 100%)' },
  title: { fontSize:'32px', fontWeight:'600', color:'var(--text)', marginBottom:'10px' },
  subtitle: { fontSize:'15px', color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'16px' },
  tags: { display:'flex', gap:'8px', flexWrap:'wrap' },
  form: { padding:'36px' },
  field: { marginBottom:'20px', flex:1 },
  row: { display:'flex', gap:'16px', marginBottom:'0' },
  label: { display:'block', fontSize:'13px', fontWeight:'600', color:'var(--text)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.5px' },
  input: { width:'100%', padding:'12px 16px', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'15px', color:'var(--text)', background:'var(--bg)', outline:'none', transition:'border-color 0.2s' },
  priceNote: { display:'flex', alignItems:'center', gap:'10px', padding:'16px', background:'var(--purple-light)', borderRadius:'10px', marginBottom:'20px' },
  priceAmount: { fontSize:'22px', fontWeight:'700', color:'var(--purple)', fontFamily:'Cormorant Garamond, serif' },
  priceLabel: { fontSize:'14px', color:'var(--purple)', opacity:'0.8' },
  btn: { width:'100%', padding:'15px', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'500', boxShadow:'0 4px 20px rgba(124,92,191,0.3)' },
  disclaimer: { textAlign:'center', fontSize:'12px', color:'var(--text-light)', marginTop:'16px' }
}