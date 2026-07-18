'use client'

// SEARA — ritual curgător (sect. 5, v5): jurnal → recunoștință → intenție
// (pentru mâine, continuată de ritualul de dimineață). Fără axe cu sliders
// (legea nouă: sliderele dispar complet). La salvare, tot ce ai scris "cade"
// în apă — un ripple blând închide gestul. Mod-noapte: sticlă mai adâncă,
// mai puțin aur, pentru un ecran de seară calm.

import { useState } from 'react'

const L = {
  en: { tag: 'This evening', journal: 'Leave your thoughts here', gratitude: 'What are you grateful for today?', intention: 'The intention you wish for tomorrow…', save: 'Leave it in the water', saving: '…', saved: 'You were present for yourself today.' },
  ro: { tag: 'Seara asta', journal: 'Lasă-ți gândurile aici', gratitude: 'Pentru ce ești recunoscător azi?', intention: 'Intenția pe care ți-o dorești pentru mâine…', save: 'Lasă în apă', saving: '…', saved: 'Ai fost prezent pentru tine azi.' },
  es: { tag: 'Esta noche', journal: 'Deja aquí tus pensamientos', gratitude: '¿Por qué estás agradecido hoy?', intention: 'La intención que deseas para mañana…', save: 'Déjalo en el agua', saving: '…', saved: 'Hoy estuviste presente para ti.' },
  fr: { tag: 'Ce soir', journal: 'Laisse tes pensées ici', gratitude: 'De quoi es-tu reconnaissant aujourd hui ?', intention: 'L intention que tu souhaites pour demain…', save: 'Laisse-le dans l eau', saving: '…', saved: 'Tu as été présent pour toi aujourd hui.' },
  de: { tag: 'Heute Abend', journal: 'Lass deine Gedanken hier', gratitude: 'Wofür bist du heute dankbar?', intention: 'Die Absicht, die du dir für morgen wünschst…', save: 'Lass es im Wasser', saving: '…', saved: 'Du warst heute für dich da.' },
  it: { tag: 'Stasera', journal: 'Lascia qui i tuoi pensieri', gratitude: 'Per cosa sei grato oggi?', intention: 'L intenzione che desideri per domani…', save: 'Lascialo nell acqua', saving: '…', saved: 'Oggi sei stato presente per te.' },
  pt: { tag: 'Esta noite', journal: 'Deixa aqui os teus pensamentos', gratitude: 'Pelo que estás grato hoje?', intention: 'A intenção que desejas para amanhã…', save: 'Deixa na água', saving: '…', saved: 'Hoje estiveste presente para ti.' },
  nl: { tag: 'Vanavond', journal: 'Laat je gedachten hier', gratitude: 'Waar ben je vandaag dankbaar voor?', intention: 'De intentie die je voor morgen wenst…', save: 'Laat het in het water', saving: '…', saved: 'Je was er vandaag voor jezelf.' },
  pl: { tag: 'Dziś wieczorem', journal: 'Zostaw tu swoje myśli', gratitude: 'Za co jesteś dziś wdzięczny?', intention: 'Intencja, której pragniesz na jutro…', save: 'Zostaw w wodzie', saving: '…', saved: 'Dziś byłeś obecny dla siebie.' },
  hu: { tag: 'Ma este', journal: 'Hagyd itt a gondolataidat', gratitude: 'Miért vagy hálás ma?', intention: 'A szándék, amit holnapra szeretnél…', save: 'Hagyd a vízben', saving: '…', saved: 'Ma jelen voltál önmagad számára.' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

export default function EveningMirror({ lang = 'en', done = false, onComplete }) {
  const [journal, setJournal] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [intention, setIntention] = useState('')
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(done)
  const [drop, setDrop] = useState(false)

  const save = async () => {
    if (saving) return
    setSaving(true)
    setDrop(true) // totul cade în apă
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
    setTimeout(() => { setSent(true); setSaving(false); if (onComplete) onComplete() }, 700)
  }

  if (sent) {
    return (
      <div className="glass ritual-night" style={s.card}>
        <p style={s.tag}>{lx(lang, 'tag')}</p>
        <div style={s.mirror} aria-hidden="true"><span style={s.mirrorRing} /></div>
        <p style={s.saved}>{lx(lang, 'saved')}</p>
      </div>
    )
  }

  return (
    <div className="glass ritual-night flow-in" style={s.card}>
      <p style={s.tag}>{lx(lang, 'tag')}</p>

      <div style={{ ...s.content, ...(drop ? s.contentDrop : null) }}>
        {/* pas 1 — jurnal, curgător */}
        <p style={s.label}>{lx(lang, 'journal')}</p>
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          rows={4}
          className="input-clean journal-paper"
          style={s.textarea}
        />

        {/* pas 2 — recunoștință */}
        <p style={s.label}>{lx(lang, 'gratitude')}</p>
        <textarea
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          rows={2}
          className="input-clean journal-paper"
          style={s.textarea}
        />

        {/* pas 3 — intenția pentru mâine, continuată de dimineața următoare */}
        <p style={s.label}>{lx(lang, 'intention')}</p>
        <textarea
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          rows={2}
          className="input-clean journal-paper"
          style={s.textarea}
        />

        <button onClick={save} disabled={saving} className="pill-btn" style={s.btn}>
          {saving ? lx(lang, 'saving') : lx(lang, 'save')}
        </button>
      </div>
    </div>
  )
}

const s = {
  card: { padding: '28px 24px', marginBottom: '24px' },
  tag: { fontSize: '12px', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' },
  content: { transition: 'transform 0.7s var(--ease-out), opacity 0.7s var(--ease-out)' },
  contentDrop: { transform: 'translateY(14px) scale(0.98)', opacity: 0.25 },
  label: { fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: 'var(--text)', margin: '18px 0 10px' },
  textarea: { width: '100%', resize: 'none', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.7, boxSizing: 'border-box' },
  btn: { width: '100%', marginTop: '24px' },
  mirror: { position: 'relative', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mirrorRing: { width: '10px', height: '10px', borderRadius: '50%', border: '1px solid var(--gold-soft)', animation: 'wd-ring 2.4s var(--ease-out) infinite' },
  saved: { fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: 'var(--text)', textAlign: 'center' },
}
