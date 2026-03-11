'use client'

import { useState } from 'react'
import { getUserId } from '../../../lib/userId'

const reviewQuestions = [
  {
    id: 'wins',
    question: 'What were your 3 biggest wins this week?',
    type: 'textarea',
    placeholder: 'List your wins, big or small...'
  },
  {
    id: 'struggles',
    question: 'Where did you struggle or self-sabotage?',
    type: 'textarea',
    placeholder: 'Be honest with yourself...'
  },
  {
    id: 'energy_rating',
    question: 'How was your energy this week?',
    type: 'rating'
  },
  {
    id: 'alignment_rating',
    question: 'How aligned were your actions with your values?',
    type: 'rating'
  },
  {
    id: 'next_week',
    question: 'What is your ONE focus for next week?',
    type: 'textarea',
    placeholder: 'One clear intention...'
  }
]

export default function WeeklyReview() {
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const today = new Date()
  const dayOfWeek = today.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const allAnswered = reviewQuestions.every(q => answers[q.id])

  const handleSubmit = async () => {
    if (!allAnswered) return
    setLoading(true)

    const userId = getUserId()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())

    const energyRating = parseInt(answers.energy_rating || 0)
    const alignmentRating = parseInt(answers.alignment_rating || 0)
    const scoreAvg = (energyRating + alignmentRating) / 2 * 10

    try {
      await fetch('/api/weekly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          week_start: weekStart.toISOString().split('T')[0],
          responses: answers,
          score_avg: scoreAvg
        })
      })
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
          <p style={s.doneTitle}>Weekly review complete.</p>
          <p style={s.doneText}>Well done for showing up for yourself. See you next week.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={s.card}>
      <div style={s.cardHeader} onClick={() => isWeekend && setIsOpen(!isOpen)}>
        <div>
          <span className="tag tag-purple" style={{marginBottom:'8px', display:'inline-block'}}>
            🪞 Weekly Review
          </span>
          <p style={s.cardSubtitle}>
            {isWeekend
              ? 'Available now — take 5 minutes to reflect.'
              : 'Available on weekends — come back Saturday or Sunday.'}
          </p>
        </div>
        {isWeekend && (
          <span style={s.toggle}>{isOpen ? '▲' : '▼'}</span>
        )}
      </div>

      {isOpen && isWeekend && (
        <div style={s.content}>
          {reviewQuestions.map((q) => (
            <div key={q.id} style={s.questionBlock}>
              <p style={s.questionText}>{q.question}</p>

              {q.type === 'textarea' && (
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  rows={3}
                  style={s.textarea}
                />
              )}

              {q.type === 'rating' && (
                <div style={s.ratingRow}>
                  {[1,2,3,4,5,6,7,8,9,10].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleChange(q.id, String(opt))}
                      style={{
                        ...s.ratingBtn,
                        background: answers[q.id] === String(opt) ? 'var(--purple)' : 'var(--bg)',
                        color: answers[q.id] === String(opt) ? '#fff' : 'var(--text)',
                        borderColor: answers[q.id] === String(opt) ? 'var(--purple)' : 'var(--border)'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
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
            {loading ? 'Saving...' : 'Complete Weekly Review →'}
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
  questionBlock: { marginBottom:'24px', paddingBottom:'24px', borderBottom:'1px solid var(--border)' },
  questionText: { fontSize:'15px', fontWeight:'600', color:'var(--text)', marginBottom:'12px', lineHeight:'1.5' },
  textarea: { width:'100%', padding:'12px 16px', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'14px', color:'var(--text)', background:'var(--bg)', resize:'vertical', fontFamily:'inherit', outline:'none', boxSizing:'border-box' },
  ratingRow: { display:'flex', gap:'8px', flexWrap:'wrap' },
  ratingBtn: { width:'40px', height:'40px', borderRadius:'8px', border:'1.5px solid', fontSize:'14px', cursor:'pointer', fontWeight:'500', transition:'all 0.15s' },
  submitBtn: { width:'100%', padding:'15px', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'500', marginTop:'8px', boxShadow:'0 4px 20px rgba(124,92,191,0.3)' },
  doneBox: { textAlign:'center', padding:'24px 0' },
  doneIcon: { fontSize:'36px', marginBottom:'12px' },
  doneTitle: { fontSize:'20px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'8px' },
  doneText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6' }
}
