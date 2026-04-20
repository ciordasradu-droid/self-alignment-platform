'use client'

import { useState, useEffect } from 'react'
import { getDailyCheckinQuestions } from '../../../lib/checkinQuestions'
import { supabase } from '../../../lib/supabase'

export default function DailyCheckin({ onComplete, checkinDone }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(checkinDone)

  useEffect(() => {
    // Get HD type and language from stored profile
    const stored = localStorage.getItem('profile')
    let hdType = 'Generator'
    let lang = 'en'

    if (stored) {
      try {
        const profile = JSON.parse(stored)
        hdType = profile.hd_data?.type || 'Generator'
        lang = profile.language || 'en'
      } catch (e) {
        console.error('Error parsing profile:', e)
      }
    }

    const dailyQuestions = getDailyCheckinQuestions(hdType, lang)
    setQuestions(dailyQuestions)
  }, [])

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const allAnswered = questions.length > 0 && questions.every(q => answers[q.id] !== undefined)

  const handleSubmit = async () => {
    if (!allAnswered) return
    setLoading(true)

    // Score: simple average of 1-5 ratings, scaled to 0-100
    const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0)
    const alignmentScore = Math.round((totalScore / (questions.length * 5)) * 100)

    try {
      await supabase.from('daily_checkins').insert([{
        date: new Date().toISOString().split('T')[0],
        responses: answers,
        alignment_score: alignmentScore,
        questions: questions.map(q => ({ id: q.id, category: q.category, question: q.question }))
      }])

      setSubmitted(true)
      onComplete(alignmentScore, answers)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>✓</h2>
        <div style={styles.doneBox}>
          <p style={styles.doneText}>Check-in complete.</p>
          <p style={styles.doneSubtext}>Come back tomorrow.</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) return null

  const categoryLabels = {
    mirroring: { icon: '🪞', color: 'var(--purple)' },
    gratitude: { icon: '✦', color: 'var(--green)' },
    intention: { icon: '🧭', color: 'var(--orange)' },
  }

  const ratingLabels = {
    1: '1', 2: '2', 3: '3', 4: '4', 5: '5'
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.cardTitle}>Daily Check-in</h2>
        <p style={styles.cardSubtitle}>3 questions. Less than 2 minutes.</p>
      </div>

      {questions.map((q) => {
        const cat = categoryLabels[q.category] || categoryLabels.mirroring
        return (
          <div key={q.id} style={styles.questionBlock}>
            <div style={styles.categoryRow}>
              <span style={{ fontSize: '16px', marginRight: '8px' }}>{cat.icon}</span>
              <span style={{ ...styles.categoryLabel, color: cat.color }}>{q.category}</span>
            </div>
            <p style={styles.questionText}>{q.question}</p>
            <div style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleAnswer(q.id, val)}
                  style={{
                    ...styles.ratingBtn,
                    background: answers[q.id] === val ? cat.color : 'var(--bg)',
                    color: answers[q.id] === val ? '#fff' : 'var(--text)',
                    borderColor: answers[q.id] === val ? cat.color : 'var(--border)'
                  }}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        )
      })}

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || loading}
        style={{
          ...styles.submitButton,
          background: allAnswered ? 'var(--purple)' : '#ccc',
          cursor: allAnswered ? 'pointer' : 'not-allowed'
        }}
      >
        {loading ? 'Saving...' : 'Submit Check-in →'}
      </button>
    </div>
  )
}

const styles = {
  card: { background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '28px', marginBottom: '24px', boxShadow: 'var(--shadow)' },
  header: { marginBottom: '24px' },
  cardTitle: { fontSize: '20px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '6px' },
  cardSubtitle: { fontSize: '14px', color: 'var(--text-muted)' },
  questionBlock: { marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' },
  categoryRow: { display: 'flex', alignItems: 'center', marginBottom: '8px' },
  categoryLabel: { fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
  questionText: { fontSize: '16px', fontWeight: '500', marginBottom: '14px', color: 'var(--text)', lineHeight: '1.5' },
  ratingRow: { display: 'flex', gap: '8px' },
  ratingBtn: { width: '44px', height: '44px', borderRadius: '10px', border: '1.5px solid', fontSize: '15px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  submitButton: { width: '100%', padding: '15px', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '500', boxShadow: '0 4px 20px rgba(124,92,191,0.3)' },
  doneBox: { textAlign: 'center', padding: '24px 0' },
  doneText: { fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'var(--text)' },
  doneSubtext: { fontSize: '14px', color: 'var(--text-muted)' }
}