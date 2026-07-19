'use client'

// DIMINEAȚA — ritual curgător (sect. 5, v5): salut + apa se luminează →
// cum ai dormit (scris liber) → Gândul Zilei → intenția (continuată din
// aseară, cu 2 gesturi, sau scrisă liber dacă nu există una) → închidere.
// Legea (secț. 3): fără sliders, fără stări preselectate — semnalul vine
// din text, nicăieri din butoane.

import { useState, useEffect } from 'react'
import DailyInsight from './DailyInsight'
import { waterState } from '../../components/water/waterState'

const L = {
  en: { greet: 'Good morning', sleepQ: 'How did you sleep?', sleepPh: 'Write a word or two…', intentionQ: 'Yesterday you left this intention:', carry: 'Carry it forward', change: 'Change it', changePh: 'Write the new intention…', freshQ: 'What intention do you carry into today?', freshPh: 'Write it here…', start: 'Begin the day', wish: 'May your day be gentle', done: 'Your day has begun.' },
  ro: { greet: 'Bună dimineața', sleepQ: 'Cum ai dormit?', sleepPh: 'Scrie într-un cuvânt sau două…', intentionQ: 'Aseară ai lăsat această intenție:', carry: 'O duc mai departe', change: 'O schimb', changePh: 'Scrie noua intenție…', freshQ: 'Ce intenție porți cu tine azi?', freshPh: 'Scrie aici…', start: 'Începe ziua', wish: 'Să-ți fie ziua blândă', done: 'Ziua ta a început.' },
  es: { greet: 'Buenos días', sleepQ: '¿Cómo dormiste?', sleepPh: 'Escribe una o dos palabras…', intentionQ: 'Anoche dejaste esta intención:', carry: 'La llevo adelante', change: 'La cambio', changePh: 'Escribe la nueva intención…', freshQ: '¿Qué intención llevas contigo hoy?', freshPh: 'Escribe aquí…', start: 'Comienza el día', wish: 'Que tu día sea suave', done: 'Tu día ha comenzado.' },
  fr: { greet: 'Bonjour', sleepQ: 'As-tu bien dormi ?', sleepPh: 'Écris un ou deux mots…', intentionQ: 'Hier soir tu as laissé cette intention :', carry: 'Je la porte plus loin', change: 'Je la change', changePh: 'Écris la nouvelle intention…', freshQ: 'Quelle intention portes-tu aujourd\'hui ?', freshPh: 'Écris ici…', start: 'Commence la journée', wish: 'Que ta journée soit douce', done: 'Ta journée a commencé.' },
  de: { greet: 'Guten Morgen', sleepQ: 'Wie hast du geschlafen?', sleepPh: 'Schreib ein, zwei Worte…', intentionQ: 'Gestern Abend hast du diese Absicht hinterlassen:', carry: 'Ich trage sie weiter', change: 'Ich ändere sie', changePh: 'Schreib die neue Absicht…', freshQ: 'Welche Absicht trägst du heute in dir?', freshPh: 'Schreib hier…', start: 'Beginne den Tag', wish: 'Möge dein Tag sanft sein', done: 'Dein Tag hat begonnen.' },
  it: { greet: 'Buongiorno', sleepQ: 'Come hai dormito?', sleepPh: 'Scrivi una o due parole…', intentionQ: 'Ieri sera hai lasciato questa intenzione:', carry: 'La porto avanti', change: 'La cambio', changePh: 'Scrivi la nuova intenzione…', freshQ: 'Quale intenzione porti con te oggi?', freshPh: 'Scrivi qui…', start: 'Inizia la giornata', wish: 'Che la tua giornata sia gentile', done: 'La tua giornata è iniziata.' },
  pt: { greet: 'Bom dia', sleepQ: 'Como dormiste?', sleepPh: 'Escreve uma ou duas palavras…', intentionQ: 'Ontem à noite deixaste esta intenção:', carry: 'Levo-a comigo', change: 'Mudo-a', changePh: 'Escreve a nova intenção…', freshQ: 'Que intenção levas contigo hoje?', freshPh: 'Escreve aqui…', start: 'Começa o dia', wish: 'Que o teu dia seja suave', done: 'O teu dia começou.' },
  nl: { greet: 'Goedemorgen', sleepQ: 'Hoe heb je geslapen?', sleepPh: 'Schrijf een woord of twee…', intentionQ: 'Gisteravond liet je dit voornemen achter:', carry: 'Ik draag het mee', change: 'Ik verander het', changePh: 'Schrijf het nieuwe voornemen…', freshQ: 'Welk voornemen draag je vandaag mee?', freshPh: 'Schrijf hier…', start: 'Begin de dag', wish: 'Moge je dag zacht zijn', done: 'Je dag is begonnen.' },
  pl: { greet: 'Dzień dobry', sleepQ: 'Jak spałeś?', sleepPh: 'Napisz słowo lub dwa…', intentionQ: 'Wczoraj wieczorem zostawiłeś tę intencję:', carry: 'Niosę to dalej', change: 'Zmieniam to', changePh: 'Napisz nową intencję…', freshQ: 'Jaką intencję niesiesz dziś ze sobą?', freshPh: 'Napisz tutaj…', start: 'Zacznij dzień', wish: 'Niech twój dzień będzie łagodny', done: 'Twój dzień się zaczął.' },
  hu: { greet: 'Jó reggelt', sleepQ: 'Hogy aludtál?', sleepPh: 'Írj egy-két szót…', intentionQ: 'Tegnap este ezt a szándékot hagytad itt:', carry: 'Továbbviszem', change: 'Megváltoztatom', changePh: 'Írd le az új szándékot…', freshQ: 'Milyen szándékot viszel magaddal ma?', freshPh: 'Írj ide…', start: 'Kezdd a napot', wish: 'Legyen szelíd a napod', done: 'A napod elkezdődött.' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

// Nu își desenează propria picătură: gestul atinge APA HOME-ULUI (legea 6).
export default function MorningAnchor({ lang = 'en', name = '', done = false, continuedIntention = '', onComplete }) {
  const [sleep, setSleep] = useState('')
  const [intentionMode, setIntentionMode] = useState(continuedIntention ? 'echo' : 'fresh') // echo | changing | fresh
  const [intention, setIntention] = useState('')
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(done)

  const who = name ? `, ${name}` : ''

  // apa se luminează la deschiderea ritualului — un singur gest atmosferic,
  // decuplat de răspunsul userului (nu mai există stare/valoare de mapat).
  useEffect(() => {
    if (sent) return
    waterState.setLight(70)
    const t = setTimeout(() => waterState.setLight(null), 2200)
    return () => clearTimeout(t)
  }, [sent])

  const finalIntention = intentionMode === 'echo' ? continuedIntention : intention.trim()

  const save = async () => {
    if (saving) return
    setSaving(true)
    try {
      await fetch('/api/ritual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'morning', sleep: sleep.trim(), intention: finalIntention }),
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

      {/* pas 1 — cum ai dormit: scris liber, un rând, fără stări preselectate */}
      <p style={s.q}>{lx(lang, 'sleepQ')}</p>
      <input
        type="text"
        value={sleep}
        onChange={(e) => setSleep(e.target.value)}
        placeholder={lx(lang, 'sleepPh')}
        className="input-clean"
        style={s.sleepInput}
      />

      {/* pas 2 — Gândul Zilei, îmbrăcat în ritual, nu card separat pe Azi */}
      <div style={s.step}>
        <DailyInsight embedded />
      </div>

      {/* pas 3 — intenția: continuată din aseară (2 gesturi) sau scrisă liber
          dacă e prima dimineață fără o seară în urmă */}
      <div style={s.step}>
        {continuedIntention ? (
          intentionMode === 'changing' ? (
            <>
              <p style={s.q}>{lx(lang, 'change')}</p>
              <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder={lx(lang, 'changePh')}
                rows={2}
                className="input-clean"
                style={s.intentionArea}
                autoFocus
              />
            </>
          ) : (
            <>
              <p style={s.q}>{lx(lang, 'intentionQ')}</p>
              <p style={s.echoText}>{continuedIntention}</p>
              <div style={s.gestureRow}>
                <button type="button" onClick={() => setIntentionMode('echo')} className={`pill-btn${intentionMode === 'echo' ? ' selected' : ''}`} style={s.gestureBtn}>
                  {lx(lang, 'carry')}
                </button>
                <button type="button" onClick={() => setIntentionMode('changing')} className="pill-btn" style={s.gestureBtn}>
                  {lx(lang, 'change')}
                </button>
              </div>
            </>
          )
        ) : (
          <>
            <p style={s.q}>{lx(lang, 'freshQ')}</p>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder={lx(lang, 'freshPh')}
              rows={2}
              className="input-clean"
              style={s.intentionArea}
            />
          </>
        )}
      </div>

      <button onClick={save} disabled={saving} className="pill-btn" style={s.btn}>
        {lx(lang, 'start')}
      </button>
    </div>
  )
}

const s = {
  card: { padding: '30px 24px', marginBottom: '24px', textAlign: 'center' },
  greet: { fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', color: 'var(--text)', marginBottom: '20px' },
  q: { fontSize: '15px', color: 'var(--text-muted)', marginBottom: '14px' },
  sleepInput: { width: '100%', textAlign: 'center', boxSizing: 'border-box' },
  step: { marginTop: '24px', textAlign: 'left' },
  echoText: { fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: 'var(--amber)', lineHeight: 1.5, marginBottom: '16px' },
  gestureRow: { display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' },
  gestureBtn: { padding: '11px 20px', fontSize: '14px', minHeight: '44px' },
  intentionArea: { width: '100%', resize: 'none', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.6, boxSizing: 'border-box' },
  btn: { width: '100%', marginTop: '26px' },
  wish: { fontFamily: 'Cormorant Garamond, serif', fontSize: '19px', color: 'var(--amber)', marginTop: '10px' },
}
