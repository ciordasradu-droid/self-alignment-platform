'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

const reviewQuestions = [
  {
    id: 'wins',
    question: 'What were your 3 biggest wins this week?',
    type: 'textarea',
    placeholder: 'List your wins...'
  },
  {
    id: 'struggles',
    question: 'Where did you struggle or self-sabotage?',
    type: 'textarea',
    placeholder: 'Be honest...'
  },
  {
    id: 'energy_rating',
    question: 'How would you rate your overall energy this week?',
    type: 'rating',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  },
  {
    id: 'alignment_rating',
    question: 'How aligned were your actions with your goals?',
    type: 'rating',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  },
  {
    id: 'next_week',
    question: 'What is your ONE focus for next week?',
    type: 'textarea',
    placeholder: 'One clear focus...'
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

    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())

    try {
      await supabase.from('weekly_reviews').insert([{
        week_start: weekStart.toISOString().split('T')[0],
        responses: answers
      }])
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Weekly Review</h2>
        <div style={styles.doneBox}>
          <p style={styles.doneIcon}>✓</p>
          <p style={styles.doneText}>Weekly review complete.</p>
          <p style={styles.doneSubtext}>See you next week.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader} onClick={() => setIsOpen(!isOpen)}>
        <div>
          <h2 style={styles.cardTitle}>Weekly Review</h2>
          <p style={styles.cardSubtitle}>
            {isWeekend ? 'Available now — reflect on your week.' : 'Available on weekends.'}
          </p>
        </div>
        <span style={styles.toggle}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div style={styles.reviewContent}>
          {!isWeekend && (
            <div style={styles.lockedBox}>
              <p>Weekly review is designed for weekends.</p>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>Come back on Saturday or Sunday to reflect on your week.</p>
            </div>
          )}

          {isWeekend && reviewQuestions.map((q) => (
            <div key={q.id} style={styles.questionBlock}>
              <p style={styles.questionText}>{q.question}</p>

              {q.type === 'textarea' && (
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  rows={3}
                  style={styles.textarea}
                />
              )}

              {q.type === 'rating' && (
                <div style={styles.ratingRow}>
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleChange(q.id, opt)}
                      style={{
                        ...styles.ratingButton,
                        backgroundColor: answers[q.id] === opt ? '#111' : '#f0f0f0',
                        color: answers[q.id] === opt ? '#fff' : '#333'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isWeekend && (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || loading}
              style={{
                ...styles.submitButton,
                backgroundColor: allAnswered ? '#111' : '#ccc',
                cursor: allAnswered ? 'pointer' : 'not-allowed'
              }}
            >
              {loading ? 'Saving...' : 'Submit Weekly Review →'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  card: { background: '#f9f9f9', borderRadius: '12px', padding: '28px', marginBottom: '24px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' },
  cardTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '4px' },
  cardSubtitle: { fontSize: '14px', color: '#888' },
  toggle: { fontSize: '14px', color: '#888' },
  reviewContent: { marginTop: '24px' },
  questionBlock: { marginBottom: '24px' },
  questionText: { fontSize: '15px', fontWeight: '500', marginBottom: '10px', color: '#222' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' },
  ratingRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  ratingButton: { width: '36px', height: '36px', borderRadius: '6px', border: 'none', fontSize: '13px', cursor: 'pointer' },
  submitButton: { width: '100%', padding: '14px', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', marginTop: '8px' },
  lockedBox: { textAlign: 'center', padding: '24px', color: '#555', background: '#fff', borderRadius: '8px' },
  doneBox: { textAlign: 'center', padding: '32px 0' },
  doneIcon: { fontSize: '48px', marginBottom: '16px' },
  doneText: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' },
  doneSubtext: { fontSize: '14px', color: '#888' }
}