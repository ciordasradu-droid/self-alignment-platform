'use client'

// DIMINEAȚA — Morning Anchor (secțiunea 5).
// Elementul central e APA: picătura First Drop. Userul glisează → lumina DIN apă
// răspunde. Fără etichete pe poli, fără scor afișat. Semnalul 0-100 se salvează.

import { useState } from 'react'

const L = {
  en: { greet:'Good morning', q:'How are you right now?', intention:'The intention you wish for today…', start:'Begin the day', wish:'May your day be gentle', done:'Your day has begun.' },
  ro: { greet:'Bună dimineața', q:'Cum ești acum?', intention:'Intenția pe care ți-o dorești azi…', start:'Începe ziua', wish:'Să-ți fie ziua blândă', done:'Ziua ta a început.' },
  es: { greet:'Buenos días', q:'¿Cómo estás ahora?', intention:'La intención que deseas para hoy…', start:'Comienza el día', wish:'Que tu día sea suave', done:'Tu día ha comenzado.' },
  fr: { greet:'Bonjour', q:'Comment es-tu maintenant ?', intention:'L intention que tu souhaites pour aujourd hui…', start:'Commence la journée', wish:'Que ta journée soit douce', done:'Ta journée a commencé.' },
  de: { greet:'Guten Morgen', q:'Wie geht es dir gerade?', intention:'Die Absicht, die du dir für heute wünschst…', start:'Beginne den Tag', wish:'Möge dein Tag sanft sein', done:'Dein Tag hat begonnen.' },
  it: { greet:'Buongiorno', q:'Come stai adesso?', intention:'L intenzione che desideri per oggi…', start:'Inizia la giornata', wish:'Che la tua giornata sia gentile', done:'La tua giornata è iniziata.' },
  pt: { greet:'Bom dia', q:'Como estás agora?', intention:'A intenção que desejas para hoje…', start:'Começa o dia', wish:'Que o teu dia seja suave', done:'O teu dia começou.' },
  nl: { greet:'Goedemorgen', q:'Hoe is het nu met je?', intention:'De intentie die je vandaag wenst…', start:'Begin de dag', wish:'Moge je dag zacht zijn', done:'Je dag is begonnen.' },
  pl: { greet:'Dzień dobry', q:'Jak się teraz masz?', intention:'Intencja, której pragniesz na dziś…', start:'Zacznij dzień', wish:'Niech twój dzień będzie łagodny', done:'Twój dzień się zaczął.' },
  hu: { greet:'Jó reggelt', q:'Hogy vagy most?', intention:'A szándék, amit ma szeretnél…', start:'Kezdd a napot', wish:'Legyen szelíd a napod', done:'A napod elkezdődött.' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

// Nu își desenează propria picătură: gestul atinge APA HOME-ULUI (legea 6).
// Semnalul urcă în sus, spre picătura care e deja pe ecran.
export default function MorningAnchor({ lang = 'en', name = '', done = false, onComplete, onSignal }) {
  const [signal, setSignal] = useState(40)
  const [intention, setIntention] = useState('')
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(done)

  const who = name ? `, ${name}` : ''

  const move = (v) => {
    setSignal(v)
    if (onSignal) onSignal(v)
  }

  const save = async () => {
    if (saving) return
    setSaving(true)
    try {
      await fetch('/api/ritual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'morning', morning_signal: signal, intention: intention.trim() }),
      })
    } catch (e) { /* prezența nu se pierde pentru o eroare de rețea */ }
    setSent(true)
    setSaving(false)
    if (onComplete) onComplete()
  }

  if (sent) {
    return (
      <div className="glass" style={s.card}>
        <p style={s.wish}>{lx(lang, 'wish')}{who}.</p>
      </div>
    )
  }

  return (
    <div className="glass flow-in" style={s.card}>
      <p style={s.greet}>{lx(lang, 'greet')}{who}</p>
      <p style={s.q}>{lx(lang, 'q')}</p>

      {/* Poli: doar semnal vizual — mic si stins la un capat, mare si cald la
          celalalt. Zero cuvinte de stare (principiul 13). */}
      <div style={s.sliderRow}>
        <span style={s.poleLow} aria-hidden="true" />
        <input
          type="range" min="0" max="100" value={signal}
          onChange={(e) => move(+e.target.value)}
          aria-label={lx(lang, 'q')}
          className="water-slider"
        />
        <span style={s.poleHigh} aria-hidden="true" />
      </div>

      <p style={s.label}>{lx(lang, 'intention')}</p>
      <textarea
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
        rows={2}
        className="input-clean"
        style={s.textarea}
      />

      <button onClick={save} disabled={saving} className="pill-btn" style={s.btn}>
        {lx(lang, 'start')}
      </button>
    </div>
  )
}

const s = {
  card: { padding: '30px 24px', marginBottom: '24px', textAlign: 'center' },
  greet: { fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', color: 'var(--text)', marginBottom: '4px' },
  q: { fontSize: '15px', color: 'var(--text-muted)' },
  sliderRow: { display: 'flex', alignItems: 'center', gap: '13px', margin: '22px 4px 28px' },
  poleLow: { width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(255,255,255,0.30)', flex: 'none' },
  poleHigh: { width: '15px', height: '15px', borderRadius: '50%', flex: 'none', background: 'radial-gradient(circle, var(--gold) 0%, var(--gold-faint) 70%)' },
  label: { fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: 'var(--text)', textAlign: 'left', marginBottom: '10px' },
  textarea: { resize: 'none', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.6 },
  btn: { width: '100%', marginTop: '22px' },
  wish: { fontFamily: 'Cormorant Garamond, serif', fontSize: '19px', color: 'var(--amber)', marginTop: '10px' },
}
