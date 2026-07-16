'use client'

// SEARA — Evening Mirror (secțiunea 5).
// Oglinda E suprafața apei. 3 axe fără etichete de stare (aceeași gramatică
// vizuală ca dimineața), jurnal liber cu 3 sugestii OPȚIONALE, iar la salvare
// scrisul „cade" în apă — un ripple blând închide gestul.

import { useState } from 'react'

const L = {
  en: { tag:'This evening', axes:'A short gesture', journal:'Leave your thoughts here', prompts:['What did you notice about yourself today?','What are you grateful for today?','What do you leave here, from this day?'], save:'Leave it in the water', saving:'…', saved:'You were present for yourself today.', entered:'today you entered the day with:' },
  ro: { tag:'Seara asta', axes:'Un gest scurt', journal:'Lasă-ți gândurile aici', prompts:['Ce ai observat la tine azi?','Pentru ce ești recunoscător azi?','Ce lași aici, din ziua asta?'], save:'Lasă în apă', saving:'…', saved:'Ai fost prezent pentru tine azi.', entered:'azi ai intrat în zi cu:' },
  es: { tag:'Esta noche', axes:'Un gesto breve', journal:'Deja aquí tus pensamientos', prompts:['¿Qué notaste en ti hoy?','¿Por qué estás agradecido hoy?','¿Qué dejas aquí, de este día?'], save:'Déjalo en el agua', saving:'…', saved:'Hoy estuviste presente para ti.', entered:'hoy entraste en el día con:' },
  fr: { tag:'Ce soir', axes:'Un geste court', journal:'Laisse tes pensées ici', prompts:['Qu as-tu remarqué chez toi aujourd hui ?','De quoi es-tu reconnaissant aujourd hui ?','Que laisses-tu ici, de cette journée ?'], save:'Laisse-le dans l eau', saving:'…', saved:'Tu as été présent pour toi aujourd hui.', entered:'aujourd hui tu es entré dans la journée avec :' },
  de: { tag:'Heute Abend', axes:'Eine kurze Geste', journal:'Lass deine Gedanken hier', prompts:['Was hast du heute an dir bemerkt?','Wofür bist du heute dankbar?','Was lässt du hier, von diesem Tag?'], save:'Lass es im Wasser', saving:'…', saved:'Du warst heute für dich da.', entered:'heute bist du in den Tag gegangen mit:' },
  it: { tag:'Stasera', axes:'Un gesto breve', journal:'Lascia qui i tuoi pensieri', prompts:['Cosa hai notato di te oggi?','Per cosa sei grato oggi?','Cosa lasci qui, di questa giornata?'], save:'Lascialo nell acqua', saving:'…', saved:'Oggi sei stato presente per te.', entered:'oggi sei entrato nella giornata con:' },
  pt: { tag:'Esta noite', axes:'Um gesto curto', journal:'Deixa aqui os teus pensamentos', prompts:['O que notaste em ti hoje?','Pelo que estás grato hoje?','O que deixas aqui, deste dia?'], save:'Deixa na água', saving:'…', saved:'Hoje estiveste presente para ti.', entered:'hoje entraste no dia com:' },
  nl: { tag:'Vanavond', axes:'Een kort gebaar', journal:'Laat je gedachten hier', prompts:['Wat viel je vandaag op aan jezelf?','Waar ben je vandaag dankbaar voor?','Wat laat je hier, van deze dag?'], save:'Laat het in het water', saving:'…', saved:'Je was er vandaag voor jezelf.', entered:'vandaag ging je de dag in met:' },
  pl: { tag:'Dziś wieczorem', axes:'Krótki gest', journal:'Zostaw tu swoje myśli', prompts:['Co dziś zauważyłeś u siebie?','Za co jesteś dziś wdzięczny?','Co zostawiasz tutaj z tego dnia?'], save:'Zostaw w wodzie', saving:'…', saved:'Dziś byłeś obecny dla siebie.', entered:'dziś wszedłeś w dzień z:' },
  hu: { tag:'Ma este', axes:'Egy rövid gesztus', journal:'Hagyd itt a gondolataidat', prompts:['Mit vettél észre ma magadon?','Miért vagy hálás ma?','Mit hagysz itt ebből a napból?'], save:'Hagyd a vízben', saving:'…', saved:'Ma jelen voltál önmagad számára.', entered:'ma ezzel léptél a napba:' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

// cele 3 axe — gând · acțiune · prezență. Fără etichete de stare pe poli.
const AXES = [
  { key: 'thoughts', en: 'thought',   ro: 'gând' },
  { key: 'actions',  en: 'action',    ro: 'acțiune' },
  { key: 'presence', en: 'presence',  ro: 'prezență' },
]

export default function EveningMirror({ lang = 'en', done = false, intention = '', onComplete }) {
  const [vals, setVals] = useState({ thoughts: 50, actions: 50, presence: 50 })
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(done)
  const [drop, setDrop] = useState(false)

  const save = async () => {
    if (saving) return
    setSaving(true)
    setDrop(true) // scrisul cade în apă
    try {
      await fetch('/api/ritual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'evening',
          thoughts_signal: vals.thoughts,
          actions_signal: vals.actions,
          presence_signal: vals.presence,
          evening_journal: text.trim(),
        }),
      })
    } catch (e) { /* prezența rămâne */ }
    setTimeout(() => { setSent(true); setSaving(false); if (onComplete) onComplete() }, 700)
  }

  if (sent) {
    return (
      <div className="glass" style={s.card}>
        <p style={s.tag}>{lx(lang, 'tag')}</p>
        <div style={s.mirror} aria-hidden="true"><span style={s.mirrorRing} /></div>
        <p style={s.saved}>{lx(lang, 'saved')}</p>
      </div>
    )
  }

  return (
    <div className="glass flow-in" style={s.card}>
      <p style={s.tag}>{lx(lang, 'tag')}</p>

      {/* legătura dimineață-seară — pur oglindă, fără evaluare */}
      {intention && (
        <p style={s.echo}>{lx(lang, 'entered')} <span style={{ color: 'var(--amber)' }}>{intention}</span></p>
      )}

      <p style={s.small}>{lx(lang, 'axes')}</p>
      {AXES.map(a => (
        <div key={a.key} style={s.axisRow}>
          <span style={s.axisName}>{a[lang] || a.en}</span>
          <span style={s.poleLow} aria-hidden="true" />
          <input
            type="range" min="0" max="100" value={vals[a.key]}
            onChange={(e) => setVals(v => ({ ...v, [a.key]: +e.target.value }))}
            aria-label={a[lang] || a.en}
            className="water-slider"
          />
          <span style={s.poleHigh} aria-hidden="true" />
        </div>
      ))}

      <p style={s.label}>{lx(lang, 'journal')}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="input-clean"
        style={{ ...s.textarea, ...(drop ? s.textareaDrop : null) }}
      />

      {/* sugestii OPȚIONALE — de atins doar dacă vrei un imbold */}
      <div style={s.prompts}>
        {lx(lang, 'prompts').map((p, i) => (
          <button key={i} type="button" onClick={() => setText(t => (t ? t + '\n\n' : '') + p + '\n')} style={s.prompt}>
            {p}
          </button>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="pill-btn" style={s.btn}>
        {saving ? lx(lang, 'saving') : lx(lang, 'save')}
      </button>
    </div>
  )
}

const s = {
  card: { padding: '28px 24px', marginBottom: '24px' },
  tag: { fontSize: '12px', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' },
  echo: { fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.5 },
  small: { fontSize: '13px', color: 'var(--text-light)', marginBottom: '14px' },
  axisRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' },
  axisName: { fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: 'var(--text-muted)', width: '72px', textAlign: 'left', flex: 'none' },
  poleLow: { width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.28)', flex: 'none' },
  poleHigh: { width: '12px', height: '12px', borderRadius: '50%', flex: 'none', background: 'radial-gradient(circle, var(--gold) 0%, var(--gold-faint) 70%)' },
  label: { fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: 'var(--text)', margin: '22px 0 10px' },
  textarea: { resize: 'none', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.7, transition: 'transform 0.7s var(--ease-out), opacity 0.7s var(--ease-out)' },
  textareaDrop: { transform: 'translateY(14px) scale(0.98)', opacity: 0.25 },
  prompts: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' },
  prompt: { textAlign: 'left', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', lineHeight: 1.5 },
  btn: { width: '100%', marginTop: '22px' },
  mirror: { position: 'relative', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mirrorRing: { width: '10px', height: '10px', borderRadius: '50%', border: '1px solid var(--gold-soft)', animation: 'wd-ring 2.4s var(--ease-out) infinite' },
  saved: { fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: 'var(--text)', textAlign: 'center' },
}
