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
  en: { greet: 'Good morning', sleepQ: 'How did you sleep?', sleepPh: 'Write a word or two…', intentionQ: 'Yesterday you left this intention:', carry: 'Carry it forward', change: 'Change it', changePh: 'Write the new intention…', freshQ: 'What intention do you carry into today?', freshPh: 'Write it here…', start: 'Begin the day', wish: 'May your day be gentle', done: 'Your day has begun.', weekTag: 'The Week, Seen', weekQ1: 'What did you continue even when it was hard?', weekQ2: 'What pattern showed up more than once this week?', weekQ3: 'What do you want to bring into next week?', weekPh1: 'The hard things you kept doing…', weekPh2: 'Recurring patterns you noticed…', weekPh3: 'One intention for next week…' },
  ro: { greet: 'Bună dimineața', sleepQ: 'Cum ai dormit?', sleepPh: 'Scrie într-un cuvânt sau două…', intentionQ: 'Aseară ai lăsat această intenție:', carry: 'O duc mai departe', change: 'O schimb', changePh: 'Scrie noua intenție…', freshQ: 'Ce intenție porți cu tine azi?', freshPh: 'Scrie aici…', start: 'Începe ziua', wish: 'Să-ți fie ziua blândă', done: 'Ziua ta a început.', weekTag: 'Privirea săptămânii', weekQ1: 'Ce ai continuat chiar dacă a fost greu?', weekQ2: 'Ce tipar a apărut de mai multe ori săptămâna asta?', weekQ3: 'Ce vrei să aduci în săptămâna viitoare?', weekPh1: 'Lucrurile grele pe care le-ai continuat…', weekPh2: 'Tipare recurente pe care le-ai observat…', weekPh3: 'O intenție pentru săptămâna viitoare…' },
  es: { greet: 'Buenos días', sleepQ: '¿Cómo dormiste?', sleepPh: 'Escribe una o dos palabras…', intentionQ: 'Anoche dejaste esta intención:', carry: 'La llevo adelante', change: 'La cambio', changePh: 'Escribe la nueva intención…', freshQ: '¿Qué intención llevas contigo hoy?', freshPh: 'Escribe aquí…', start: 'Comienza el día', wish: 'Que tu día sea suave', done: 'Tu día ha comenzado.', weekTag: 'La Semana, Vista', weekQ1: '¿Qué continuaste incluso cuando fue difícil?', weekQ2: '¿Qué patrón apareció más de una vez esta semana?', weekQ3: '¿Qué quieres llevar a la próxima semana?', weekPh1: 'Las cosas difíciles que seguiste haciendo…', weekPh2: 'Patrones recurrentes que notaste…', weekPh3: 'Una intención para la próxima semana…' },
  fr: { greet: 'Bonjour', sleepQ: 'As-tu bien dormi ?', sleepPh: 'Écris un ou deux mots…', intentionQ: 'Hier soir tu as laissé cette intention :', carry: 'Je la porte plus loin', change: 'Je la change', changePh: 'Écris la nouvelle intention…', freshQ: 'Quelle intention portes-tu aujourd\'hui ?', freshPh: 'Écris ici…', start: 'Commence la journée', wish: 'Que ta journée soit douce', done: 'Ta journée a commencé.', weekTag: 'La Semaine, Vue', weekQ1: 'Qu\'as-tu continué même quand c\'était difficile ?', weekQ2: 'Quel schéma est apparu plus d\'une fois cette semaine ?', weekQ3: 'Que veux-tu emporter dans la semaine prochaine ?', weekPh1: 'Les choses difficiles que tu as continuées…', weekPh2: 'Les schémas récurrents que tu as remarqués…', weekPh3: 'Une intention pour la semaine prochaine…' },
  de: { greet: 'Guten Morgen', sleepQ: 'Wie hast du geschlafen?', sleepPh: 'Schreib ein, zwei Worte…', intentionQ: 'Gestern Abend hast du diese Absicht hinterlassen:', carry: 'Ich trage sie weiter', change: 'Ich ändere sie', changePh: 'Schreib die neue Absicht…', freshQ: 'Welche Absicht trägst du heute in dir?', freshPh: 'Schreib hier…', start: 'Beginne den Tag', wish: 'Möge dein Tag sanft sein', done: 'Dein Tag hat begonnen.', weekTag: 'Die Woche, Gesehen', weekQ1: 'Was hast du weitergemacht, auch als es schwer war?', weekQ2: 'Welches Muster ist diese Woche mehr als einmal aufgetaucht?', weekQ3: 'Was möchtest du in die nächste Woche mitnehmen?', weekPh1: 'Die schwierigen Dinge, die du weitergemacht hast…', weekPh2: 'Wiederkehrende Muster, die dir aufgefallen sind…', weekPh3: 'Eine Absicht für die nächste Woche…' },
  it: { greet: 'Buongiorno', sleepQ: 'Come hai dormito?', sleepPh: 'Scrivi una o due parole…', intentionQ: 'Ieri sera hai lasciato questa intenzione:', carry: 'La porto avanti', change: 'La cambio', changePh: 'Scrivi la nuova intenzione…', freshQ: 'Quale intenzione porti con te oggi?', freshPh: 'Scrivi qui…', start: 'Inizia la giornata', wish: 'Che la tua giornata sia gentile', done: 'La tua giornata è iniziata.', weekTag: 'La Settimana, Vista', weekQ1: 'Cosa hai continuato a fare anche quando era difficile?', weekQ2: 'Quale schema è emerso più di una volta questa settimana?', weekQ3: 'Cosa vuoi portare nella prossima settimana?', weekPh1: 'Le cose difficili che hai continuato a fare…', weekPh2: 'Schemi ricorrenti che hai notato…', weekPh3: 'Un\'intenzione per la prossima settimana…' },
  pt: { greet: 'Bom dia', sleepQ: 'Como dormiste?', sleepPh: 'Escreve uma ou duas palavras…', intentionQ: 'Ontem à noite deixaste esta intenção:', carry: 'Levo-a comigo', change: 'Mudo-a', changePh: 'Escreve a nova intenção…', freshQ: 'Que intenção levas contigo hoje?', freshPh: 'Escreve aqui…', start: 'Começa o dia', wish: 'Que o teu dia seja suave', done: 'O teu dia começou.', weekTag: 'A Semana, Vista', weekQ1: 'O que continuaste mesmo quando foi difícil?', weekQ2: 'Que padrão apareceu mais de uma vez esta semana?', weekQ3: 'O que queres levar para a próxima semana?', weekPh1: 'As coisas difíceis que continuaste a fazer…', weekPh2: 'Padrões recorrentes que notaste…', weekPh3: 'Uma intenção para a próxima semana…' },
  nl: { greet: 'Goedemorgen', sleepQ: 'Hoe heb je geslapen?', sleepPh: 'Schrijf een woord of twee…', intentionQ: 'Gisteravond liet je dit voornemen achter:', carry: 'Ik draag het mee', change: 'Ik verander het', changePh: 'Schrijf het nieuwe voornemen…', freshQ: 'Welk voornemen draag je vandaag mee?', freshPh: 'Schrijf hier…', start: 'Begin de dag', wish: 'Moge je dag zacht zijn', done: 'Je dag is begonnen.', weekTag: 'De Week, Gezien', weekQ1: 'Wat heb je volgehouden, ook toen het moeilijk was?', weekQ2: 'Welk patroon kwam deze week meer dan eens naar boven?', weekQ3: 'Wat wil je meenemen naar volgende week?', weekPh1: 'De moeilijke dingen die je volhield…', weekPh2: 'Terugkerende patronen die je opmerkte…', weekPh3: 'Een voornemen voor volgende week…' },
  pl: { greet: 'Dzień dobry', sleepQ: 'Jak spałeś?', sleepPh: 'Napisz słowo lub dwa…', intentionQ: 'Wczoraj wieczorem zostawiłeś tę intencję:', carry: 'Niosę to dalej', change: 'Zmieniam to', changePh: 'Napisz nową intencję…', freshQ: 'Jaką intencję niesiesz dziś ze sobą?', freshPh: 'Napisz tutaj…', start: 'Zacznij dzień', wish: 'Niech twój dzień będzie łagodny', done: 'Twój dzień się zaczął.', weekTag: 'Tydzień, Zobaczony', weekQ1: 'Co kontynuowałeś, nawet gdy było trudno?', weekQ2: 'Jaki wzorzec pojawił się więcej niż raz w tym tygodniu?', weekQ3: 'Co chcesz zabrać ze sobą do przyszłego tygodnia?', weekPh1: 'Trudne rzeczy, które kontynuowałeś…', weekPh2: 'Powtarzające się wzorce, które zauważyłeś…', weekPh3: 'Intencja na przyszły tydzień…' },
  hu: { greet: 'Jó reggelt', sleepQ: 'Hogy aludtál?', sleepPh: 'Írj egy-két szót…', intentionQ: 'Tegnap este ezt a szándékot hagytad itt:', carry: 'Továbbviszem', change: 'Megváltoztatom', changePh: 'Írd le az új szándékot…', freshQ: 'Milyen szándékot viszel magaddal ma?', freshPh: 'Írj ide…', start: 'Kezdd a napot', wish: 'Legyen szelíd a napod', done: 'A napod elkezdődött.', weekTag: 'A Hét, Látva', weekQ1: 'Mit folytattál akkor is, amikor nehéz volt?', weekQ2: 'Milyen minta jelent meg egynél többször ezen a héten?', weekQ3: 'Mit szeretnél magaddal vinni a következő hétre?', weekPh1: 'A nehéz dolgok, amiket folytattál…', weekPh2: 'Ismétlődő minták, amiket észrevettél…', weekPh3: 'Egy szándék a következő hétre…' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

// Nu își desenează propria picătură: gestul atinge APA HOME-ULUI (legea 6).
export default function MorningAnchor({ lang = 'en', name = '', done = false, continuedIntention = '', accountDay = 1, onComplete }) {
  const [sleep, setSleep] = useState('')
  const [intentionMode, setIntentionMode] = useState(continuedIntention ? 'echo' : 'fresh') // echo | changing | fresh
  const [intention, setIntention] = useState('')
  const [weekAnswers, setWeekAnswers] = useState({ continued: '', pattern: '', bring: '' })
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(done)

  const who = name ? `, ${name}` : ''

  // Sâmbăta, din ziua 30, Gândul Zilei devine Privirea săptămânii (secț. 5).
  // Înainte de ziua 30, sâmbăta e o zi ca oricare — nu există încă destul
  // istoric pentru o privire reală înapoi.
  const isSaturday = new Date().getDay() === 6
  const weekReviewActive = isSaturday && accountDay >= 30

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
      if (weekReviewActive) {
        const now = new Date()
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        await fetch('/api/weekly-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            week_start: weekStart.toISOString().split('T')[0],
            responses: weekAnswers,
            score_avg: 0,
          }),
        })
      }
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

      {/* pas 2 — Gândul Zilei, sau sâmbăta (z30+) Privirea săptămânii */}
      <div style={s.step}>
        {weekReviewActive ? (
          <div style={s.weekBox}>
            <p style={s.weekTag}>{lx(lang, 'weekTag')}</p>
            <div style={s.weekQuestion}>
              <p style={s.q}>{lx(lang, 'weekQ1')}</p>
              <textarea
                value={weekAnswers.continued}
                onChange={(e) => setWeekAnswers(w => ({ ...w, continued: e.target.value }))}
                placeholder={lx(lang, 'weekPh1')}
                rows={2}
                className="input-clean"
                style={s.intentionArea}
              />
            </div>
            <div style={s.weekQuestion}>
              <p style={s.q}>{lx(lang, 'weekQ2')}</p>
              <textarea
                value={weekAnswers.pattern}
                onChange={(e) => setWeekAnswers(w => ({ ...w, pattern: e.target.value }))}
                placeholder={lx(lang, 'weekPh2')}
                rows={2}
                className="input-clean"
                style={s.intentionArea}
              />
            </div>
            <div style={s.weekQuestion}>
              <p style={s.q}>{lx(lang, 'weekQ3')}</p>
              <textarea
                value={weekAnswers.bring}
                onChange={(e) => setWeekAnswers(w => ({ ...w, bring: e.target.value }))}
                placeholder={lx(lang, 'weekPh3')}
                rows={2}
                className="input-clean"
                style={s.intentionArea}
              />
            </div>
          </div>
        ) : (
          <DailyInsight embedded />
        )}
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
  weekBox: { textAlign: 'left' },
  weekTag: { fontSize: '12px', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' },
  weekQuestion: { marginBottom: '18px' },
  btn: { width: '100%', marginTop: '26px' },
  wish: { fontFamily: 'Cormorant Garamond, serif', fontSize: '19px', color: 'var(--amber)', marginTop: '10px' },
}
