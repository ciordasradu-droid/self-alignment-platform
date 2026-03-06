'use client'

import { useState } from 'react'
import { getUserId } from '../../../lib/userId'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!email || !email.includes('@')) return
    setLoading(true)

    const userId = getUserId()

    await fetch('/api/save-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, email })
    })

    await fetch('/api/send-reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'daily',
        email,
        name: ''
      })
    })

    setSaved(true)
    setLoading(false)
  }

  if (saved) {
    return (
      <div style={s.card}>
        <p style={s.savedIcon}>✦</p>
        <p style={s.savedTitle}>You're set up for reminders.</p>
        <p style={s.savedText}>
          We'll send you a gentle nudge each morning if you haven't checked in yet.
          Check your inbox for a welcome email.
        </p>
      </div>
    )
  }

  return (
    <div style={s.card}>
      <div style={s.header}>
        <span style={s.tag}>Daily Reminders</span>
        <h3 style={s.title}>Never miss a check-in.</h3>
        <p style={s.subtitle}>
          Add your email and we'll send you a warm reminder each morning
          if you haven't checked in yet. No spam. Just alignment.
        </p>
      </div>

      <div style={s.inputRow}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={s.input}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          style={s.btn}
        >
          {loading ? '...' : 'Remind me →'}
        </button>
      </div>

      <p style={s.micro}>
        No spam. Unsubscribe anytime. We only email when it matters.
      </p>
    </div>
  )
}

const s = {
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'28px', marginBottom:'24px', boxShadow:'var(--shadow)' },
  header: { marginBottom:'20px' },
  tag: { display:'inline-block', padding:'5px 12px', background:'var(--purple-light)', color:'var(--purple)', borderRadius:'20px', fontSize:'12px', fontWeight:'600', marginBottom:'12px', letterSpacing:'0.3px' },
  title: { fontSize:'20px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'8px' },
  subtitle: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6' },
  inputRow: { display:'flex', gap:'10px', marginBottom:'12px' },
  input: { flex:1, padding:'12px 16px', borderRadius:'10px', border:'1.5px solid var(--border)', fontSize:'15px', background:'var(--bg)', color:'var(--text)', outline:'none' },
  btn: { padding:'12px 20px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:'500', cursor:'pointer', flexShrink:0 },
  micro: { fontSize:'12px', color:'var(--text-light)' },
  savedIcon: { fontSize:'32px', textAlign:'center', marginBottom:'12px' },
  savedTitle: { fontSize:'18px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'8px', textAlign:'center' },
  savedText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6', textAlign:'center' }
}