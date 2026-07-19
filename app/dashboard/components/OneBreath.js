'use client'

// ONE BREATH / O RESPIRAȚIE (secțiunea 5).
// Buton discret pentru zilele grele: un ripple care se lărgește 3 secunde
// (inspiră/expiră) → ziua e completă, prezența e păstrată, fără presiunea
// scrisului. Zero vinovăție, zero explicații de ce n-ai scris.

import { useState } from 'react'
import { waterState } from '../../components/water/waterState'

const L = {
  en: { btn:'One breath', during:'Breathe in… and out.', done:'Your presence is kept.' },
  ro: { btn:'O respirație', during:'Inspiră… și expiră.', done:'Prezența ta e păstrată.' },
  es: { btn:'Una respiración', during:'Inhala… y exhala.', done:'Tu presencia queda.' },
  fr: { btn:'Une respiration', during:'Inspire… et expire.', done:'Ta présence est gardée.' },
  de: { btn:'Ein Atemzug', during:'Einatmen… und ausatmen.', done:'Deine Präsenz bleibt.' },
  it: { btn:'Un respiro', during:'Inspira… ed espira.', done:'La tua presenza resta.' },
  pt: { btn:'Uma respiração', during:'Inspira… e expira.', done:'A tua presença fica.' },
  nl: { btn:'Eén ademhaling', during:'Adem in… en uit.', done:'Je aanwezigheid blijft.' },
  pl: { btn:'Jeden oddech', during:'Wdech… i wydech.', done:'Twoja obecność zostaje.' },
  hu: { btn:'Egy lélegzet', during:'Lélegezz be… és ki.', done:'A jelenléted megmarad.' },
  ru: { btn:'Один вдох', during:'Вдохни… и выдохни.', done:'Твоё присутствие остаётся.' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

export default function OneBreath({ lang = 'en', onComplete }) {
  const [state, setState] = useState('idle') // idle | breathing | done

  const start = () => {
    if (state !== 'idle') return
    setState('breathing')
    // apa răspunde la respirație — se luminează pe durata gestului, apoi revine
    waterState.setLight(65)
    fetch('/api/ritual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'one_breath', one_breath: true }),
    }).catch(() => {})
    setTimeout(() => {
      waterState.setLight(null)
      setState('done')
      if (onComplete) onComplete()
    }, 3000)
  }

  if (state === 'done') {
    return <p style={s.doneText}>{lx(lang, 'done')}</p>
  }

  if (state === 'breathing') {
    return (
      <div style={s.stage}>
        <div className="one-breath-ripple" style={s.ripple} aria-hidden="true" />
        <p style={s.during}>{lx(lang, 'during')}</p>
      </div>
    )
  }

  return (
    <button onClick={start} style={s.btn}>{lx(lang, 'btn')}</button>
  )
}

const s = {
  btn: { display: 'block', margin: '0 auto 24px', padding: '10px 20px', background: 'transparent', border: 'none', color: 'var(--text-light)', fontSize: '13px', cursor: 'pointer', letterSpacing: '0.3px', minHeight: '44px' },
  stage: { position: 'relative', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
  ripple: { position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', border: '1px solid var(--gold-soft)', boxShadow: '0 0 30px var(--gold-faint)', animation: 'breath-3s 3s var(--ease-soft) forwards' },
  during: { position: 'relative', fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--text-muted)' },
  doneText: { textAlign: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--text-muted)', marginBottom: '24px' },
}
