'use client'

// DIMINEAȚA — ritual curgător (sect. 5, v5): sfera care respiră (secț. B,
// 25.07 noapte, deschiderea ritualului, nu ritual paralel) → salut + apa se
// luminează → cum ai dormit (scris liber) → Gândul Zilei → intenția
// (continuată din aseară, cu 2 gesturi, sau scrisă liber dacă nu există
// una) → închidere. Legea (secț. 3): fără sliders, fără stări preselectate
// — semnalul vine din text, nicăieri din butoane.

import { useState, useEffect } from 'react'
import DailyInsight from './DailyInsight'
import BreathingSphere from './BreathingSphere'
import { waterState } from '../../components/water/waterState'
import { getEffectiveWeekday } from '../../../lib/simWeekday'
import { clientTzOffset } from '../../../lib/logicalDay'

const L = {
  en: { greet: 'Good morning', sleepQ: 'How did you sleep?', sleepPh: 'Write a word or two…', intentionQ: 'Yesterday you left this intention:', carry: 'Carry it forward', change: 'Change it', changePh: 'Write the new intention…', freshQ: 'What intention do you carry into today?', freshPh: 'Write it here…', start: 'Begin the day', wish: 'May your day be gentle', done: 'Your day has begun.', weekTag: 'The Week, Seen', weekQ1: 'What repeated this week, seen from the shore, not from the current?', weekQ2: 'A moment when you were close to yourself — what made it possible?', weekQ3: 'What you take with you into the coming week — one sentence.', weekPh1: 'What you noticed coming back…', weekPh2: 'The moment, and what supported it…', weekPh3: 'One sentence…' },
  ro: { greet: 'Bună dimineața', sleepQ: 'Cum ai dormit?', sleepPh: 'Scrie într-un cuvânt sau două…', intentionQ: 'Aseară ai lăsat această intenție:', carry: 'O duc mai departe', change: 'O schimb', changePh: 'Scrie noua intenție…', freshQ: 'Ce intenție porți cu tine azi?', freshPh: 'Scrie aici…', start: 'Începe ziua', wish: 'Să-ți fie ziua blândă', done: 'Ziua ta a început.', weekTag: 'Privirea săptămânii', weekQ1: 'Ce s-a repetat săptămâna asta, văzut de pe mal, nu din vâltoare?', weekQ2: 'Un moment în care ai fost aproape de tine — ce l-a făcut posibil?', weekQ3: 'Ce iei cu tine în săptămâna care vine — o singură propoziție.', weekPh1: 'Ce ai observat revenind…', weekPh2: 'Momentul și ce l-a susținut…', weekPh3: 'O propoziție…' },
  es: { greet: 'Buenos días', sleepQ: '¿Cómo dormiste?', sleepPh: 'Escribe una o dos palabras…', intentionQ: 'Anoche dejaste esta intención:', carry: 'La llevo adelante', change: 'La cambio', changePh: 'Escribe la nueva intención…', freshQ: '¿Qué intención llevas contigo hoy?', freshPh: 'Escribe aquí…', start: 'Comienza el día', wish: 'Que tu día sea suave', done: 'Tu día ha comenzado.', weekTag: 'La Semana, Vista', weekQ1: '¿Qué se repitió esta semana, visto desde la orilla, no desde la corriente?', weekQ2: 'Un momento en el que estuviste cerca de ti mismo — ¿qué lo hizo posible?', weekQ3: 'Qué te llevas contigo a la semana que viene — una sola frase.', weekPh1: 'Lo que notaste que volvía…', weekPh2: 'El momento, y qué lo sostuvo…', weekPh3: 'Una frase…' },
  fr: { greet: 'Bonjour', sleepQ: 'As-tu bien dormi ?', sleepPh: 'Écris un ou deux mots…', intentionQ: 'Hier soir tu as laissé cette intention :', carry: 'Je la porte plus loin', change: 'Je la change', changePh: 'Écris la nouvelle intention…', freshQ: 'Quelle intention portes-tu aujourd\'hui ?', freshPh: 'Écris ici…', start: 'Commence la journée', wish: 'Que ta journée soit douce', done: 'Ta journée a commencé.', weekTag: 'La Semaine, Vue', weekQ1: 'Qu\'est-ce qui s\'est répété cette semaine, vu depuis le rivage, pas depuis le courant ?', weekQ2: 'Un moment où tu as été proche de toi-même — qu\'est-ce qui l\'a rendu possible ?', weekQ3: 'Ce que tu emportes avec toi dans la semaine qui vient — une seule phrase.', weekPh1: 'Ce que tu as remarqué qui revenait…', weekPh2: 'Le moment, et ce qui l\'a soutenu…', weekPh3: 'Une phrase…' },
  de: { greet: 'Guten Morgen', sleepQ: 'Wie hast du geschlafen?', sleepPh: 'Schreib ein, zwei Worte…', intentionQ: 'Gestern Abend hast du diese Absicht hinterlassen:', carry: 'Ich trage sie weiter', change: 'Ich ändere sie', changePh: 'Schreib die neue Absicht…', freshQ: 'Welche Absicht trägst du heute in dir?', freshPh: 'Schreib hier…', start: 'Beginne den Tag', wish: 'Möge dein Tag sanft sein', done: 'Dein Tag hat begonnen.', weekTag: 'Die Woche, Gesehen', weekQ1: 'Was hat sich diese Woche wiederholt — vom Ufer aus gesehen, nicht aus der Strömung?', weekQ2: 'Ein Moment, in dem du dir selbst nahe warst — was hat ihn möglich gemacht?', weekQ3: 'Was du mit in die kommende Woche nimmst — ein einziger Satz.', weekPh1: 'Was dir als wiederkehrend aufgefallen ist…', weekPh2: 'Der Moment, und was ihn getragen hat…', weekPh3: 'Ein Satz…' },
  it: { greet: 'Buongiorno', sleepQ: 'Come hai dormito?', sleepPh: 'Scrivi una o due parole…', intentionQ: 'Ieri sera hai lasciato questa intenzione:', carry: 'La porto avanti', change: 'La cambio', changePh: 'Scrivi la nuova intenzione…', freshQ: 'Quale intenzione porti con te oggi?', freshPh: 'Scrivi qui…', start: 'Inizia la giornata', wish: 'Che la tua giornata sia gentile', done: 'La tua giornata è iniziata.', weekTag: 'La Settimana, Vista', weekQ1: 'Cosa si è ripetuto questa settimana, visto dalla riva, non dalla corrente?', weekQ2: 'Un momento in cui sei stato vicino a te stesso — cosa lo ha reso possibile?', weekQ3: 'Cosa porti con te nella settimana che viene — una sola frase.', weekPh1: 'Quello che hai notato tornare…', weekPh2: 'Il momento, e cosa lo ha sostenuto…', weekPh3: 'Una frase…' },
  pt: { greet: 'Bom dia', sleepQ: 'Como dormiste?', sleepPh: 'Escreve uma ou duas palavras…', intentionQ: 'Ontem à noite deixaste esta intenção:', carry: 'Levo-a comigo', change: 'Mudo-a', changePh: 'Escreve a nova intenção…', freshQ: 'Que intenção levas contigo hoje?', freshPh: 'Escreve aqui…', start: 'Começa o dia', wish: 'Que o teu dia seja suave', done: 'O teu dia começou.', weekTag: 'A Semana, Vista', weekQ1: 'O que se repetiu esta semana, visto da margem, não da correnteza?', weekQ2: 'Um momento em que estiveste perto de ti — o que o tornou possível?', weekQ3: 'O que levas contigo para a semana que vem — uma única frase.', weekPh1: 'O que notaste a repetir-se…', weekPh2: 'O momento, e o que o sustentou…', weekPh3: 'Uma frase…' },
  nl: { greet: 'Goedemorgen', sleepQ: 'Hoe heb je geslapen?', sleepPh: 'Schrijf een woord of twee…', intentionQ: 'Gisteravond liet je dit voornemen achter:', carry: 'Ik draag het mee', change: 'Ik verander het', changePh: 'Schrijf het nieuwe voornemen…', freshQ: 'Welk voornemen draag je vandaag mee?', freshPh: 'Schrijf hier…', start: 'Begin de dag', wish: 'Moge je dag zacht zijn', done: 'Je dag is begonnen.', weekTag: 'De Week, Gezien', weekQ1: 'Wat herhaalde zich deze week, gezien vanaf de oever, niet vanuit de stroming?', weekQ2: 'Een moment waarop je dicht bij jezelf was — wat maakte dat mogelijk?', weekQ3: 'Wat neem je mee naar de komende week — één zin.', weekPh1: 'Wat je zag terugkeren…', weekPh2: 'Het moment, en wat het droeg…', weekPh3: 'Eén zin…' },
  pl: { greet: 'Dzień dobry', sleepQ: 'Jak spałeś?', sleepPh: 'Napisz słowo lub dwa…', intentionQ: 'Wczoraj wieczorem zostawiłeś tę intencję:', carry: 'Niosę to dalej', change: 'Zmieniam to', changePh: 'Napisz nową intencję…', freshQ: 'Jaką intencję niesiesz dziś ze sobą?', freshPh: 'Napisz tutaj…', start: 'Zacznij dzień', wish: 'Niech twój dzień będzie łagodny', done: 'Twój dzień się zaczął.', weekTag: 'Tydzień, Zobaczony', weekQ1: 'Co powtarzało się w tym tygodniu, widziane z brzegu, nie z nurtu?', weekQ2: 'Chwila, w której byłeś blisko siebie — co to umożliwiło?', weekQ3: 'Co zabierasz ze sobą w nadchodzący tydzień — jedno zdanie.', weekPh1: 'Co zauważyłeś, że wraca…', weekPh2: 'Ta chwila i to, co ją podtrzymało…', weekPh3: 'Jedno zdanie…' },
  hu: { greet: 'Jó reggelt', sleepQ: 'Hogy aludtál?', sleepPh: 'Írj egy-két szót…', intentionQ: 'Tegnap este ezt a szándékot hagytad itt:', carry: 'Továbbviszem', change: 'Megváltoztatom', changePh: 'Írd le az új szándékot…', freshQ: 'Milyen szándékot viszel magaddal ma?', freshPh: 'Írj ide…', start: 'Kezdd a napot', wish: 'Legyen szelíd a napod', done: 'A napod elkezdődött.', weekTag: 'A Hét, Látva', weekQ1: 'Mi ismétlődött ezen a héten — a partról nézve, nem a sodrásból?', weekQ2: 'Egy pillanat, amikor közel voltál önmagadhoz — mi tette lehetővé?', weekQ3: 'Mit viszel magaddal a következő hétre — egyetlen mondat.', weekPh1: 'Amit visszatérni észrevettél…', weekPh2: 'A pillanat, és ami megtartotta…', weekPh3: 'Egy mondat…' },
  ru: { greet: 'Доброе утро', sleepQ: 'Как спалось?', sleepPh: 'Напиши слово или два…', intentionQ: 'Вчера вечером ты оставил(а) это намерение:', carry: 'Несу его дальше', change: 'Меняю его', changePh: 'Напиши новое намерение…', freshQ: 'Какое намерение ты несёшь с собой сегодня?', freshPh: 'Напиши здесь…', start: 'Начать день', wish: 'Пусть день будет мягким', done: 'Твой день начался.', weekTag: 'Неделя, Увиденная', weekQ1: 'Что повторялось на этой неделе — если смотреть с берега, а не из течения?', weekQ2: 'Момент, когда ты был(а) близко к себе — что сделало это возможным?', weekQ3: 'Что ты берёшь с собой в следующую неделю — одно предложение.', weekPh1: 'Что ты заметил(а) возвращающимся…', weekPh2: 'Момент и то, что его поддержало…', weekPh3: 'Одно предложение…' },
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
  // Sfera care respiră deschide ritualul (secț. B) — dacă ritualul e deja
  // făcut azi (done), n-are rost s-o mai arătăm la fiecare re-randare.
  const [breathDone, setBreathDone] = useState(done)

  const who = name ? `, ${name}` : ''

  // Sâmbăta, din ziua 30, Gândul Zilei devine Privirea săptămânii (secț. 5).
  // Înainte de ziua 30, sâmbăta e o zi ca oricare — nu există încă destul
  // istoric pentru o privire reală înapoi.
  const isSaturday = getEffectiveWeekday() === 6
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
        body: JSON.stringify({ kind: 'morning', sleep: sleep.trim(), intention: finalIntention, tz: clientTzOffset() }),
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

  // Sfera care respiră deschide ritualul (secț. B) — nu ritual paralel, ci
  // primul pas al celui existent. La final (natural sau ieșire liberă),
  // continuăm cu restul ritualului de mai jos.
  if (!breathDone) {
    return (
      <div className="glass flow-in" style={s.card}>
        <BreathingSphere
          lang={lang}
          mode="session"
          continuedIntention={continuedIntention}
          onComplete={() => setBreathDone(true)}
        />
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
