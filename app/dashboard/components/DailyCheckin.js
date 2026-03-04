'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

const questions = [
  {
    id: 'energy',
    question: 'How is your energy level today?',
    options: ['Very low', 'Low', 'Medium', 'High', 'Very high'],
    scores: [1, 2, 3, 4, 5]
  },
  {
    id: 'focus',
    question: 'How focused were you today?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Fully'],
    scores: [1, 2, 3, 4, 5]
  },
  {
    id: 'alignment',
    question: 'How aligned did your actions feel with your goals?',
    options: ['Not aligned', 'Slightly', 'Moderately', 'Mostly', 'Fully aligned'],
    scores: [1, 2, 3, 4, 5]
  }
]

export default function DailyCheckin({ onComplete, checkinDone }) {
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(checkinDone)

  const handleSelect = (questionId, score) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }))
  }

  const allAnswered = questions.every(q => answers[q.id] !== undefined)

  const handleSubmit = async () => {
    if (!allAnswered) return
    setLoading(true)

    const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0)
    const alignmentScore = Math.round((totalScore / (questions.length * 5)) * 100)

    try {
      await supabase.from('daily_checkins').insert([{
        date: new Date().toISOString().split('T')[0],
        responses: answers,
        alignment_score: alignmentScore
      }])

      setSubmitted(true)
      onComplete(alignmentScore)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Daily Check-in</h2>
        <div style={styles.doneBox}>
          <p style={styles.doneIcon}>✓</p>
          <p style={styles.doneText}>Check-in complete for today.</p>
          <p style={styles.doneSubtext}>Come back tomorrow to keep your streak alive.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Daily Check-in</h2>
      <p style={styles.cardSubtitle}>3 questions — takes less than 2 minutes.</p>

      {questions.map((q) => (
        <div key={q.id} style={styles.questionBlock}>
          <p style={styles.questionText}>{q.question}</p>
          <div style={styles.optionsRow}>
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(q.id, q.scores[i])}
                style={{
                  ...styles.optionButton,
                  backgroundColor: answers[q.id] === q.scores[i] ? '#111' : '#f0f0f0',
                  color: answers[q.id] === q.scores[i] ? '#fff' : '#333'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || loading}
        style={{
          ...styles.submitButton,
          backgroundColor: allAnswered ? '#111' : '#ccc',
          cursor: allAnswered ? 'pointer' : 'not-allowed'
        }}
      >
        {loading ? 'Saving...' : 'Submit Check-in →'}
      </button>
    </div>
  )
}

const styles = {
  card: { background: '#f9f9f9', borderRadius: '12px', padding: '28px', marginBottom: '24px' },
  cardTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '8px' },
  cardSubtitle: { fontSize: '14px', color: '#888', marginBottom: '24px' },
  questionBlock: { marginBottom: '24px' },
  questionText: { fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: '#222' },
  optionsRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  optionButton: { padding: '8px 14px', borderRadius: '6px', border: 'none', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' },
  submitButton: { width: '100%', padding: '14px', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', marginTop: '8px' },
  doneBox: { textAlign: 'center', padding: '32px 0' },
  doneIcon: { fontSize: '48px', marginBottom: '16px' },
  doneText: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' },
  doneSubtext: { fontSize: '14px', color: '#888' }
}