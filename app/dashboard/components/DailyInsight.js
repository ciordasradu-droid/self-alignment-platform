'use client'

import { useState, useEffect } from 'react'
import { getUserId } from '../../../lib/userId'

export default function DailyInsight() {
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('profile')
    if (!stored) {
      setLoading(false)
      return
    }

    const profile = JSON.parse(stored)
    const userId = getUserId()

    const profileData = {
      human_design_type: profile.sections?.energy_patterns?.[0] || '',
      human_design_strategy: profile.sections?.decision_making?.[0] || '',
      life_path: '',
      blueprint: profile.sections?.blueprint || '',
      sabotage: profile.sections?.sabotage_tendencies?.[0] || ''
    }

    fetch('/api/daily-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        profile: profileData,
        personal_year: profile.personal_year
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setInsight(data.insight)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={s.card}>
      <p style={s.loading}>Generating your daily insight...</p>
    </div>
  )

  if (!insight) return null

  return (
    <div style={s.card}>
      <div style={s.header}>
        <span style={s.tag}>✦ Daily Insight</span>
        <span style={s.date}>
          {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
        </span>
      </div>

      <h3 style={s.title}>{insight.title}</h3>
      <p style={s.body}>{insight.body}</p>

      <div style={s.questionBox}>
        <p style={s.questionLabel}>Reflect on this today</p>
        <p style={s.question}>"{insight.question}"</p>
      </div>
    </div>
  )
}

const s = {
  card: { background:'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', borderRadius:'var(--radius)', padding:'28px', marginBottom:'24px', border:'1px solid rgba(124,92,191,0.3)' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' },
  tag: { fontSize:'12px', fontWeight:'700', color:'var(--purple)', textTransform:'uppercase', letterSpacing:'1px', background:'rgba(124,92,191,0.15)', padding:'5px 12px', borderRadius:'20px' },
  date: { fontSize:'12px', color:'rgba(255,255,255,0.4)' },
  title: { fontSize:'22px', fontWeight:'600', color:'#fff', fontFamily:'Cormorant Garamond, serif', marginBottom:'12px' },
  body: { fontSize:'15px', color:'rgba(255,255,255,0.8)', lineHeight:'1.75', marginBottom:'20px' },
  questionBox: { background:'rgba(255,255,255,0.06)', borderRadius:'10px', padding:'16px' },
  questionLabel: { fontSize:'11px', fontWeight:'700', color:'var(--orange)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' },
  question: { fontSize:'15px', color:'rgba(255,255,255,0.85)', lineHeight:'1.6', fontStyle:'italic' },
  loading: { fontSize:'14px', color:'rgba(255,255,255,0.5)', textAlign:'center', padding:'20px 0' }
}