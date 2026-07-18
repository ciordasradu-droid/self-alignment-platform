'use client'

// DIMINEAȚA — ritual curgător (sect. 5, v5): cum ai dormit → Gândul Zilei →
// intenția continuată din aseară. Fără slider (legea nouă: sliderele dispar
// complet) — semnalul e un gest de atins (pastilă), nu de tras.

import { useState } from 'react'
import DailyInsight from './DailyInsight'
import { waterState } from '../../components/water/waterState'

const L = {
  en: { greet: 'Good morning', sleepQ: 'How did you sleep?', start: 'Begin the day', wish: 'May your day be gentle', done: 'Your day has begun.', continuing: 'Continuing with:' },
  ro: { greet: 'Bună dimineața', sleepQ: 'Cum ai dormit?', start: 'Începe ziua', wish: 'Să-ți fie ziua blândă', done: 'Ziua ta a început.', continuing: 'Continui cu:' },
  es: { greet: 'Buenos días', sleepQ: '¿Cómo dormiste?', start: 'Comienza el día', wish: 'Que tu día sea suave', done: 'Tu día ha comenzado.', continuing: 'Continuando con:' },
  fr: { greet: 'Bonjour', sleepQ: 'As-tu bien dormi ?', start: 'Commence la journée', wish: 'Que ta journée soit douce', done: 'Ta journée a commencé.', continuing: 'Tu continues avec :' },
  de: { greet: 'Guten Morgen', sleepQ: 'Wie hast du geschlafen?', start: 'Beginne den Tag', wish: 'Möge dein Tag sanft sein', done: 'Dein Tag hat begonnen.', continuing: 'Du machst weiter mit:' },
  it: { greet: 'Buongiorno', sleepQ: 'Come hai dormito?', start: 'Inizia la giornata', wish: 'Che la tua giornata sia gentile', done: 'La tua giornata è iniziata.', continuing: 'Continui con:' },
  pt: { greet: 'Bom dia', sleepQ: 'Como dormiste?', start: 'Começa o dia', wish: 'Que o teu dia seja suave', done: 'O teu dia começou.', continuing: 'A continuar com:' },
  nl: { greet: 'Goedemorgen', sleepQ: 'Hoe heb je geslapen?', start: 'Begin de dag', wish: 'Moge je dag zacht zijn', done: 'Je dag is begonnen.', continuing: 'Je gaat verder met:' },
  pl: { greet: 'Dzień dobry', sleepQ: 'Jak spałeś?', start: 'Zacznij dzień', wish: 'Niech twój dzień będzie łagodny', done: 'Twój dzień się zaczął.', continuing: 'Kontynuujesz z:' },
  hu: { greet: 'Jó reggelt', sleepQ: 'Hogy aludtál?', start: 'Kezdd a napot', wish: 'Legyen szelíd a napod', done: 'A napod elkezdődött.', continuing: 'Folytatod ezzel:' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

// TODO(texte de lucru — sect. 5): cele 3 stări de somn sunt cuvinte simple,
// puse ca placeholder până vin formulările finale din Prompt Master.
const SLEEP_OPTIONS = [
  { key: 'well',  value: 80, en: 'Well',   ro: 'Bine' },
  { key: 'okay',  value: 50, en: 'So-so',  ro: 'Așa și așa' },
  { key: 'rough', value: 20, en: 'Rough',  ro: 'Greu' },
]
const sleepLabel = (opt, lang) => opt[lang] || opt.en

// Nu își desenează propria picătură: gestul atinge APA HOME-ULUI (legea 6).
export default function MorningAnchor({ lang = 'en', name = '', done = false, continuedIntention = '', onComplete }) {
  const [sleep, setSleep] = useState(null)
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(done)

  const who = name ? `, ${name}` : ''

  const pickSleep = (opt) => {
    setSleep(opt.key)
    waterState.setLight(opt.value)
  }

  const save = async () => {
    if (saving) return
    setSaving(true)
    try {
      await fetch('/api/ritual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'morning', sleep, morning_signal: SLEEP_OPTIONS.find(o => o.key === sleep)?.value ?? 50 }),
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

      {/* pas 1 — cum ai dormit: gest de atins, nu de tras */}
      <p style={s.q}>{lx(lang, 'sleepQ')}</p>
      <div style={s.pillRow}>
        {SLEEP_OPTIONS.map(opt => (
          <button
            key={opt.key}
            type="button"
            onClick={() => pickSleep(opt)}
            className={`pill-btn${sleep === opt.key ? ' selected' : ''}`}
            style={s.sleepPill}
          >
            {sleepLabel(opt, lang)}
          </button>
        ))}
      </div>

      {/* pas 2 — Gândul Zilei, îmbrăcat în ritual, nu card separat pe Azi */}
      <div style={s.step}>
        <DailyInsight embedded />
      </div>

      {/* pas 3 — intenția continuată din aseară, nu una nouă */}
      {continuedIntention && (
        <div style={s.step}>
          <p style={s.continuing}>{lx(lang, 'continuing')} <span style={{ color: 'var(--amber)' }}>{continuedIntention}</span></p>
        </div>
      )}

      <button onClick={save} disabled={saving || !sleep} className="pill-btn" style={s.btn}>
        {lx(lang, 'start')}
      </button>
    </div>
  )
}

const s = {
  card: { padding: '30px 24px', marginBottom: '24px', textAlign: 'center' },
  greet: { fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', color: 'var(--text)', marginBottom: '20px' },
  q: { fontSize: '15px', color: 'var(--text-muted)', marginBottom: '14px' },
  pillRow: { display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4px' },
  sleepPill: { padding: '11px 20px', fontSize: '14px', minHeight: '44px' },
  step: { marginTop: '24px', textAlign: 'left' },
  continuing: { fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.5 },
  btn: { width: '100%', marginTop: '26px' },
  wish: { fontFamily: 'Cormorant Garamond, serif', fontSize: '19px', color: 'var(--amber)', marginTop: '10px' },
}
