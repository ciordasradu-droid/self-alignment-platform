'use client'

// SEARA — ritual curgător (sect. 5, v5): "Bună seara" → jurnalul apare
// singur → la atingere, recunoștința → apoi intenția (pentru mâine,
// continuată de ritualul de dimineață) → închidere, ecranul se stinge
// lent. Fără axe cu sliders (legea nouă: sliderele dispar complet).
// Mod-noapte: sticlă mai adâncă, mai puțin aur, pentru un ecran calm.

import { useState } from 'react'

const L = {
  en: { greet: 'Good evening', journal: 'Leave your thoughts here', gratitude: 'What are you grateful for today?', intention: 'For tomorrow, I want to…', save: 'Leave it in the water', saving: '…', saved: 'You were present for yourself today.', goodnight: 'Sleep well.' },
  ro: { greet: 'Bună seara', journal: 'Lasă-ți gândurile aici', gratitude: 'Pentru ce ești recunoscător azi?', intention: 'Pentru mâine îmi doresc să…', save: 'Lasă în apă', saving: '…', saved: 'Ai fost prezent pentru tine azi.', goodnight: 'Somn lin.' },
  es: { greet: 'Buenas noches', journal: 'Deja aquí tus pensamientos', gratitude: '¿Por qué estás agradecido hoy?', intention: 'Para mañana quiero…', save: 'Déjalo en el agua', saving: '…', saved: 'Hoy estuviste presente para ti.', goodnight: 'Que duermas bien.' },
  fr: { greet: 'Bonsoir', journal: 'Laisse tes pensées ici', gratitude: 'De quoi es-tu reconnaissant aujourd hui ?', intention: 'Pour demain, je veux…', save: 'Laisse-le dans l eau', saving: '…', saved: 'Tu as été présent pour toi aujourd hui.', goodnight: 'Dors bien.' },
  de: { greet: 'Guten Abend', journal: 'Lass deine Gedanken hier', gratitude: 'Wofür bist du heute dankbar?', intention: 'Für morgen möchte ich…', save: 'Lass es im Wasser', saving: '…', saved: 'Du warst heute für dich da.', goodnight: 'Schlaf gut.' },
  it: { greet: 'Buonasera', journal: 'Lascia qui i tuoi pensieri', gratitude: 'Per cosa sei grato oggi?', intention: 'Per domani voglio…', save: 'Lascialo nell acqua', saving: '…', saved: 'Oggi sei stato presente per te.', goodnight: 'Dormi bene.' },
  pt: { greet: 'Boa noite', journal: 'Deixa aqui os teus pensamentos', gratitude: 'Pelo que estás grato hoje?', intention: 'Para amanhã quero…', save: 'Deixa na água', saving: '…', saved: 'Hoje estiveste presente para ti.', goodnight: 'Dorme bem.' },
  nl: { greet: 'Goedenavond', journal: 'Laat je gedachten hier', gratitude: 'Waar ben je vandaag dankbaar voor?', intention: 'Voor morgen wil ik…', save: 'Laat het in het water', saving: '…', saved: 'Je was er vandaag voor jezelf.', goodnight: 'Slaap zacht.' },
  pl: { greet: 'Dobry wieczór', journal: 'Zostaw tu swoje myśli', gratitude: 'Za co jesteś dziś wdzięczny?', intention: 'Na jutro chcę…', save: 'Zostaw w wodzie', saving: '…', saved: 'Dziś byłeś obecny dla siebie.', goodnight: 'Śpij spokojnie.' },
  hu: { greet: 'Jó estét', journal: 'Hagyd itt a gondolataidat', gratitude: 'Miért vagy hálás ma?', intention: 'Holnapra azt szeretném…', save: 'Hagyd a vízben', saving: '…', saved: 'Ma jelen voltál önmagad számára.', goodnight: 'Aludj jól.' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

export default function EveningMirror({ lang = 'en', name = '', done = false, onComplete }) {
  const [journal, setJournal] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [intention, setIntention] = useState('')
  const [journalTouched, setJournalTouched] = useState(false)
  const [gratitudeTouched, setGratitudeTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(done)
  const [dimmed, setDimmed] = useState(false)

  const who = name ? `, ${name}` : ''

  const save = async () => {
    if (saving) return
    setSaving(true)
    try {
      await fetch('/api/ritual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'evening',
          evening_journal: journal.trim(),
          gratitude: gratitude.trim(),
          intention: intention.trim(),
        }),
      })
    } catch (e) { /* prezența rămâne */ }
    setSent(true)
    setSaving(false)
    if (onComplete) onComplete()
    // ecranul se stinge lent, după ce mesajul de închidere apare
    setTimeout(() => setDimmed(true), 900)
  }

  if (sent) {
    return (
      <div className="glass ritual-night" style={{ ...s.card, ...(dimmed ? s.dimmed : null) }}>
        <div style={s.mirror} aria-hidden="true"><span className="wd-ring" style={s.mirrorRing} /></div>
        <p style={s.saved}>{lx(lang, 'saved')}</p>
        <p style={s.goodnight}>{lx(lang, 'goodnight')}</p>
      </div>
    )
  }

  return (
    <div className="glass ritual-night flow-in" style={s.card}>
      <p style={s.greet}>{lx(lang, 'greet')}{who}</p>

      {/* pas 1 — jurnalul apare singur */}
      <p style={s.label}>{lx(lang, 'journal')}</p>
      <textarea
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
        onFocus={() => setJournalTouched(true)}
        rows={4}
        className="input-clean journal-paper"
        style={s.textarea}
      />

      {/* pas 2 — recunoștința, la atingerea jurnalului */}
      {journalTouched && (
        <div className="flow-in">
          <p style={s.label}>{lx(lang, 'gratitude')}</p>
          <textarea
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            onFocus={() => setGratitudeTouched(true)}
            rows={2}
            className="input-clean journal-paper"
            style={s.textarea}
          />
        </div>
      )}

      {/* pas 3 — intenția pentru mâine, continuată de dimineața următoare */}
      {gratitudeTouched && (
        <div className="flow-in">
          <p style={s.label}>{lx(lang, 'intention')}</p>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            rows={2}
            className="input-clean journal-paper"
            style={s.textarea}
          />

          {/* TODO(bloc 5, lacrima vie): "Leave it in the water" e butonul
              INTERIMAR. Gestul final e picătura care cade cu textul — vine
              cu three.js izolat pe Azi (lacrima interactivă), nu înainte. */}
          <button onClick={save} disabled={saving} className="pill-btn" style={s.btn}>
            {saving ? lx(lang, 'saving') : lx(lang, 'save')}
          </button>
        </div>
      )}
    </div>
  )
}

const s = {
  card: { padding: '28px 24px', marginBottom: '24px', transition: 'opacity 3.5s ease, filter 3.5s ease' },
  dimmed: { opacity: 0.55, filter: 'brightness(0.8)' },
  greet: { fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: 'var(--text)', marginBottom: '18px' },
  label: { fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: 'var(--text)', margin: '18px 0 10px' },
  textarea: { width: '100%', resize: 'none', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.7, boxSizing: 'border-box' },
  btn: { width: '100%', marginTop: '24px' },
  mirror: { position: 'relative', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mirrorRing: { width: '10px', height: '10px', borderRadius: '50%', border: '1px solid var(--gold-soft)', animation: 'wd-ring 2.4s var(--ease-out) infinite' },
  saved: { fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: 'var(--text)', textAlign: 'center' },
  goodnight: { fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: 'var(--text-light)', textAlign: 'center', marginTop: '6px' },
}
