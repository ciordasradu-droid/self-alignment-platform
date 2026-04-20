'use client'

import { useState, useEffect } from 'react'
import { getUserId } from '../../../lib/userId'

export default function WeeklyReview() {
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [lang, setLang] = useState('en')
  const [weekSummary, setWeekSummary] = useState(null)

  const today = new Date()
  const dayOfWeek = today.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  useEffect(() => {
    const stored = localStorage.getItem('profile')
    if (stored) {
      try {
        const profile = JSON.parse(stored)
        setLang(profile.language || 'en')
      } catch(e) {}
    }

    // Build week summary from stored check-ins
    try {
      const checkins = JSON.parse(localStorage.getItem('weekly_checkin_scores') || '[]')
      if (checkins.length > 0) {
        const avg = Math.round(checkins.reduce((a, b) => a + b, 0) / checkins.length)
        setWeekSummary({ count: checkins.length, avgScore: avg })
      }
    } catch(e) {}
  }, [])

  const labels = {
    en: {
      tag: 'Weekly Review',
      available: 'Take 5 minutes to reflect on your week.',
      unavailable: 'Available on weekends — come back Saturday or Sunday.',
      week_summary: 'Your Week',
      checkins_done: 'check-ins this week',
      avg_score: 'average alignment',
      q1: 'What did you continue even when it was hard?',
      q2: 'What pattern showed up more than once this week?',
      q3: 'What do you want to bring into next week?',
      placeholder1: 'The hard things you kept doing...',
      placeholder2: 'Recurring patterns you noticed...',
      placeholder3: 'One intention for next week...',
      submit: 'Complete Weekly Review →',
      saving: 'Saving...',
      done_title: 'Weekly review complete.',
      done_text: 'Well done for showing up for yourself. See you next week.',
    },
    ro: {
      tag: 'Revizuire Săptămânală',
      available: 'Ia 5 minute să reflectezi asupra săptămânii tale.',
      unavailable: 'Disponibil în weekend — revino sâmbătă sau duminică.',
      week_summary: 'Săptămâna Ta',
      checkins_done: 'check-in-uri săptămâna asta',
      avg_score: 'aliniere medie',
      q1: 'Ce ai continuat chiar dacă a fost greu?',
      q2: 'Ce tipar a apărut de mai multe ori săptămâna asta?',
      q3: 'Ce vrei să aduci în săptămâna viitoare?',
      placeholder1: 'Lucrurile grele pe care le-ai continuat...',
      placeholder2: 'Tipare recurente pe care le-ai observat...',
      placeholder3: 'O intenție pentru săptămâna viitoare...',
      submit: 'Completează Revizuirea →',
      saving: 'Se salvează...',
      done_title: 'Revizuire completă.',
      done_text: 'Bravo că te-ai prezentat pentru tine. Ne vedem săptămâna viitoare.',
    },
  }

  const t = labels[lang] || labels['en']

  const reviewQuestions = [
    { id: 'perseverance', question: t.q1, placeholder: t.placeholder1 },
    { id: 'patterns', question: t.q2, placeholder: t.placeholder2 },
    { id: 'intention', question: t.q3, placeholder: t.placeholder3 },
  ]

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const allAnswered = reviewQuestions.every(q => answers[q.id]?.trim())

  const handleSubmit = async () => {
    if (!allAnswered) return
    setLoading(true)

    const userId = getUserId()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())

    try {
      await fetch('/api/weekly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          week_start: weekStart.toISOString().split('T')[0],
          responses: answers,
          score_avg: weekSummary?.avgScore || 0
        })
      })
      // Clear weekly checkin scores after review
      localStorage.setItem('weekly_checkin_scores', '[]')
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={s.card}>
        <div style={s.doneBox}>
          <p style={s.doneIcon}>✦</p>
          <p style={s.doneTitle}>{t.done_title}</p>
          <p style={s.doneText}>{t.done_text}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={s.card}>
      <div style={s.cardHeader} onClick={() => isWeekend && setIsOpen(!isOpen)}>
        <div>
          <span className="tag tag-purple" style={{marginBottom:'8px', display:'inline-block'}}>
            🪞 {t.tag}
          </span>
          <p style={s.cardSubtitle}>
            {isWeekend ? t.available : t.unavailable}
          </p>
        </div>
        {isWeekend && (
          <span style={s.toggle}>{isOpen ? '▲' : '▼'}</span>
        )}
      </div>

      {isOpen && isWeekend && (
        <div style={s.content}>

          {/* Week summary */}
          {weekSummary && (
            <div style={s.summaryRow}>
              <div style={s.summaryItem}>
                <span style={s.summaryNum}>{weekSummary.count}</span>
                <span style={s.summaryLabel}>{t.checkins_done}</span>
              </div>
              <div style={s.summaryDivider} />
              <div style={s.summaryItem}>
                <span style={{...s.summaryNum, color: weekSummary.avgScore >= 60 ? 'var(--green)' : 'var(--orange)'}}>{weekSummary.avgScore}</span>
                <span style={s.summaryLabel}>{t.avg_score}</span>
              </div>
            </div>
          )}

          {/* 3 reflexive questions */}
          {reviewQuestions.map((q) => (
            <div key={q.id} style={s.questionBlock}>
              <p style={s.questionText}>{q.question}</p>
              <textarea
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder={q.placeholder}
                rows={3}
                style={s.textarea}
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            style={{
              ...s.submitBtn,
              background: allAnswered ? 'var(--purple)' : '#ccc',
              cursor: allAnswered ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? t.saving : t.submit}
          </button>
        </div>
      )}
    </div>
  )
}

const s = {
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'28px', marginBottom:'24px', boxShadow:'var(--shadow)' },
  cardHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', cursor:'pointer' },
  cardSubtitle: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.5' },
  toggle: { fontSize:'14px', color:'var(--text-muted)', marginTop:'4px' },
  content: { marginTop:'24px' },

  // Summary
  summaryRow: { display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', borderRadius:'12px', padding:'20px', marginBottom:'24px', gap:'24px' },
  summaryItem: { textAlign:'center' },
  summaryNum: { display:'block', fontSize:'28px', fontWeight:'700', color:'var(--purple)', fontFamily:'Cormorant Garamond, serif', lineHeight:1 },
  summaryLabel: { display:'block', fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginTop:'6px' },
  summaryDivider: { width:'1px', height:'40px', background:'var(--border)' },

  // Questions
  questionBlock: { marginBottom:'24px', paddingBottom:'24px', borderBottom:'1px solid var(--border)' },
  questionText: { fontSize:'15px', fontWeight:'600', color:'var(--text)', marginBottom:'12px', lineHeight:'1.5' },
  textarea: { width:'100%', padding:'12px 16px', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'14px', color:'var(--text)', background:'var(--bg)', resize:'vertical', fontFamily:'inherit', outline:'none', boxSizing:'border-box', lineHeight:'1.6' },
  submitBtn: { width:'100%', padding:'15px', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'500', marginTop:'8px', boxShadow:'0 4px 20px rgba(124,92,191,0.3)' },

  // Done
  doneBox: { textAlign:'center', padding:'24px 0' },
  doneIcon: { fontSize:'36px', marginBottom:'12px' },
  doneTitle: { fontSize:'20px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'8px' },
  doneText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6' },
}