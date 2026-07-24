'use client'

// A3 — micro-moment ~ziua 21: o fraza scrisa de user acum ~3 saptamani,
// aratata o singura data (nu la fiecare vizita — localStorage tine minte
// data fazei deja vazute). Discret, sub harta, nu un ecran separat.

import { useState, useEffect } from 'react'

const L = {
  en: { label: 'Three weeks ago, you wrote this' },
  ro: { label: 'Acum trei săptămâni, ai scris asta' },
  es: { label: 'Hace tres semanas, escribiste esto' },
  fr: { label: 'Il y a trois semaines, tu as écrit ceci' },
  de: { label: 'Vor drei Wochen hast du das geschrieben' },
  it: { label: 'Tre settimane fa, hai scritto questo' },
  pt: { label: 'Há três semanas, escreveste isto' },
  nl: { label: 'Drie weken geleden schreef je dit' },
  pl: { label: 'Trzy tygodnie temu napisałeś to' },
  hu: { label: 'Három hete ezt írtad' },
  ru: { label: 'Три недели назад ты написал это' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

export default function EchoMoment({ lang = 'en' }) {
  const [phrase, setPhrase] = useState(null)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    fetch('/api/echo-moment')
      .then(r => r.json())
      .then(d => {
        if (!d.success || !d.phrase || !d.date) return
        let seenDates = []
        try { seenDates = JSON.parse(localStorage.getItem('echo_moment_seen') || '[]') } catch (e) {}
        if (seenDates.includes(d.date)) return
        setPhrase(d.phrase)
        setDismissed(false)
        try {
          localStorage.setItem('echo_moment_seen', JSON.stringify([...seenDates, d.date].slice(-10)))
        } catch (e) {}
      })
      .catch(() => {})
  }, [])

  if (dismissed || !phrase) return null

  return (
    <div style={s.card} className="anim-fade-in">
      <p style={s.label}>{lx(lang, 'label')}</p>
      <p style={s.phrase}>&ldquo;{phrase}&rdquo;</p>
      <button onClick={() => setDismissed(true)} style={s.dismiss} aria-label="dismiss">×</button>
    </div>
  )
}

const s = {
  card: { position: 'relative', background: 'var(--surface2)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '18px 36px 18px 20px', marginBottom: '20px', borderLeft: '3px solid var(--amber)' },
  label: { fontSize: '11.5px', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  phrase: { fontSize: '15px', color: 'var(--text)', lineHeight: '1.6', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' },
  dismiss: { position: 'absolute', top: '10px', right: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer', lineHeight: 1, padding: '4px' },
}
