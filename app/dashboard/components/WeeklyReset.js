'use client'

import { useState, useEffect } from 'react'
import { getUserId } from '../../../lib/userId'

export default function WeeklyReset() {
  const [reset, setReset] = useState(null)
  const [loading, setLoading] = useState(true)

  const isMonday = new Date().getDay() === 1

  useEffect(() => {
    if (!isMonday) {
      setLoading(false)
      return
    }

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

    fetch('/api/weekly-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        profile: profileData,
        personal_year: profile.personal_year,
        language: profile.language || 'en',
        last_week_score: 0
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setReset(data.reset)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (!isMonday) return null
  if (loading) return (
    <div style={s.card}>
      <p style={s.loading}>Generating your weekly reset...</p>
    </div>
  )
  if (!reset) return null

  return (
    <div style={s.card}>
      <div style={s.header}>
        <span style={s.tag}>◎ Weekly Reset</span>
        <span style={s.date}>Monday — New Week</span>
      </div>

      <h3 style={s.title}>{reset.title}</h3>

      <div style={s.section}>
        <p style={s.sectionLabel}>Last Week</p>
        <p style={s.sectionText}>{reset.reflection}</p>
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>This Week's Intention</p>
        <p style={s.sectionText}>{reset.intention}</p>
      </div>

      <div style={s.focusBox}>
        <p style={s.focusLabel}>Your One Focus This Week</p>
        <p style={s.focusText}>{reset.focus}</p>
      </div>

      <div style={s.questionBox}>
        <p style={s.questionLabel}>Carry this question through the week</p>
        <p style={s.question}>"{reset.question}"</p>
      </div>
    </div>
  )
}

const s = {
  card: { background:'linear-gradient(135deg, #0d2818 0%, #1a3d2b 100%)', borderRadius:'var(--radius)', padding:'28px', marginBottom:'24px', border:'1px solid rgba(74,155,127,0.3)' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' },
  tag: { fontSize:'12px', fontWeight:'700', color:'var(--green)', textTransform:'uppercase', letterSpacing:'1px', background:'rgba(74,155,127,0.15)', padding:'5px 12px', borderRadius:'20px' },
  date: { fontSize:'12px', color:'rgba(255,255,255,0.4)' },
  title: { fontSize:'22px', fontWeight:'600', color:'#fff', fontFamily:'Cormorant Garamond, serif', marginBottom:'20px' },
  section: { marginBottom:'16px' },
  sectionLabel: { fontSize:'11px', fontWeight:'700', color:'var(--green)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px' },
  sectionText: { fontSize:'15px', color:'rgba(255,255,255,0.8)', lineHeight:'1.7' },
  focusBox: { background:'rgba(255,255,255,0.06)', borderRadius:'10px', padding:'16px', marginBottom:'16px' },
  focusLabel: { fontSize:'11px', fontWeight:'700', color:'var(--orange)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' },
  focusText: { fontSize:'16px', color:'#fff', lineHeight:'1.6', fontWeight:'500' },
  questionBox: { background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'16px' },
  questionLabel: { fontSize:'11px', fontWeight:'700', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' },
  question: { fontSize:'15px', color:'rgba(255,255,255,0.75)', lineHeight:'1.6', fontStyle:'italic' },
  loading: { fontSize:'14px', color:'rgba(255,255,255,0.5)', textAlign:'center', padding:'20px 0' }
}