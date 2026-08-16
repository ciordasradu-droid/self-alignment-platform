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
import { clientTzOffset } from '../../../lib/logicalDay'
import { FEATURE_BREATH } from '../../../lib/appConfig'

const L = {
  en: { greet: 'Good morning', sleepQ: 'How did you sleep?', sleepPh: 'Write a word or two…', intentionQ: 'Yesterday you left this intention:', carry: 'Carry it forward', change: 'Change it', changePh: 'Write the new intention…', freshQ: 'What intention do you have for today?', freshPh: 'Write it here…', start: 'Begin the day', wish: 'May your day be gentle', done: 'Your day has begun.', weekTag: 'The Week, Seen', weekQ1: 'What repeated this week, seen from the shore, not from the current?', weekQ2: 'A moment when you were close to yourself — what made it possible?', weekQ3: 'What you take with you into the coming week — one sentence.', weekPh1: 'What you noticed coming back…', weekPh2: 'The moment, and what supported it…', weekPh3: 'One sentence…', planToggle: 'Add a plan (optional)', planIntro: 'If you want, tie the intention to a specific moment in your day.', planIfLabel: 'If…', planIfPh: 'e.g., I feel rushed in the morning', planThenLabel: 'then…', planThenPh: 'e.g., I pause for 10 seconds and breathe', planObstacleLabel: 'What might get in the way today?', planObstaclePh: 'Write it here…' },
  ro: { greet: 'Bună dimineața', sleepQ: 'Cum ai dormit?', sleepPh: 'Scrie într-un cuvânt sau două…', intentionQ: 'Aseară ai lăsat această intenție:', carry: 'O duc mai departe', change: 'O schimb', changePh: 'Scrie noua intenție…', freshQ: 'Ce intenție ai pentru azi?', freshPh: 'Scrie aici…', start: 'Începe ziua', wish: 'Să-ți fie ziua blândă', done: 'Ziua ta a început.', weekTag: 'Privirea săptămânii', weekQ1: 'Ce s-a repetat săptămâna asta, văzut de pe mal, nu din vâltoare?', weekQ2: 'Un moment în care ai fost aproape de tine — ce l-a făcut posibil?', weekQ3: 'Ce iei cu tine în săptămâna care vine — o singură propoziție.', weekPh1: 'Ce ai observat revenind…', weekPh2: 'Momentul și ce l-a susținut…', weekPh3: 'O propoziție…', planToggle: 'Adaugă un plan (opțional)', planIntro: 'Dacă vrei, leagă intenția de un moment concret al zilei.', planIfLabel: 'Dacă…', planIfPh: 'ex.: mă apucă graba dimineață', planThenLabel: 'atunci…', planThenPh: 'ex.: mă opresc 10 secunde și respir', planObstacleLabel: 'Ce ar putea sta în cale azi?', planObstaclePh: 'Scrie aici…' },
  es: { greet: 'Buenos días', sleepQ: '¿Cómo dormiste?', sleepPh: 'Escribe una o dos palabras…', intentionQ: 'Anoche dejaste esta intención:', carry: 'La llevo adelante', change: 'La cambio', changePh: 'Escribe la nueva intención…', freshQ: '¿Qué intención tienes para hoy?', freshPh: 'Escribe aquí…', start: 'Comienza el día', wish: 'Que tu día sea suave', done: 'Tu día ha comenzado.', weekTag: 'La Semana, Vista', weekQ1: '¿Qué se repitió esta semana, visto desde la orilla, no desde la corriente?', weekQ2: 'Un momento en el que estuviste cerca de ti mismo — ¿qué lo hizo posible?', weekQ3: 'Qué te llevas contigo a la semana que viene — una sola frase.', weekPh1: 'Lo que notaste que volvía…', weekPh2: 'El momento, y qué lo sostuvo…', weekPh3: 'Una frase…', planToggle: 'Añadir un plan (opcional)', planIntro: 'Si quieres, une la intención a un momento concreto del día.', planIfLabel: 'Si…', planIfPh: 'ej.: me entra prisa por la mañana', planThenLabel: 'entonces…', planThenPh: 'ej.: me detengo 10 segundos y respiro', planObstacleLabel: '¿Qué podría interponerse hoy?', planObstaclePh: 'Escríbelo aquí…' },
  fr: { greet: 'Bonjour', sleepQ: 'As-tu bien dormi ?', sleepPh: 'Écris un ou deux mots…', intentionQ: 'Hier soir tu as laissé cette intention :', carry: 'Je la porte plus loin', change: 'Je la change', changePh: 'Écris la nouvelle intention…', freshQ: 'Quelle intention as-tu pour aujourd\'hui ?', freshPh: 'Écris ici…', start: 'Commence la journée', wish: 'Que ta journée soit douce', done: 'Ta journée a commencé.', weekTag: 'La Semaine, Vue', weekQ1: 'Qu\'est-ce qui s\'est répété cette semaine, vu depuis le rivage, pas depuis le courant ?', weekQ2: 'Un moment où tu as été proche de toi-même — qu\'est-ce qui l\'a rendu possible ?', weekQ3: 'Ce que tu emportes avec toi dans la semaine qui vient — une seule phrase.', weekPh1: 'Ce que tu as remarqué qui revenait…', weekPh2: 'Le moment, et ce qui l\'a soutenu…', weekPh3: 'Une phrase…', planToggle: 'Ajouter un plan (facultatif)', planIntro: 'Si tu veux, relie ton intention à un moment précis de la journée.', planIfLabel: 'Si…', planIfPh: 'ex. : je me sens pressé le matin', planThenLabel: 'alors…', planThenPh: 'ex. : je m\'arrête 10 secondes et je respire', planObstacleLabel: 'Qu\'est-ce qui pourrait se mettre en travers aujourd\'hui ?', planObstaclePh: 'Écris-le ici…' },
  de: { greet: 'Guten Morgen', sleepQ: 'Wie hast du geschlafen?', sleepPh: 'Schreib ein, zwei Worte…', intentionQ: 'Gestern Abend hast du diese Absicht hinterlassen:', carry: 'Ich trage sie weiter', change: 'Ich ändere sie', changePh: 'Schreib die neue Absicht…', freshQ: 'Welche Absicht hast du für heute?', freshPh: 'Schreib hier…', start: 'Beginne den Tag', wish: 'Möge dein Tag sanft sein', done: 'Dein Tag hat begonnen.', weekTag: 'Die Woche, Gesehen', weekQ1: 'Was hat sich diese Woche wiederholt — vom Ufer aus gesehen, nicht aus der Strömung?', weekQ2: 'Ein Moment, in dem du dir selbst nahe warst — was hat ihn möglich gemacht?', weekQ3: 'Was du mit in die kommende Woche nimmst — ein einziger Satz.', weekPh1: 'Was dir als wiederkehrend aufgefallen ist…', weekPh2: 'Der Moment, und was ihn getragen hat…', weekPh3: 'Ein Satz…', planToggle: 'Einen Plan hinzufügen (optional)', planIntro: 'Wenn du willst, verknüpfe die Absicht mit einem konkreten Moment des Tages.', planIfLabel: 'Wenn…', planIfPh: 'z. B.: ich gerate morgens in Eile', planThenLabel: 'dann…', planThenPh: 'z. B.: ich halte 10 Sekunden inne und atme', planObstacleLabel: 'Was könnte dir heute im Weg stehen?', planObstaclePh: 'Schreib es hier…' },
  it: { greet: 'Buongiorno', sleepQ: 'Come hai dormito?', sleepPh: 'Scrivi una o due parole…', intentionQ: 'Ieri sera hai lasciato questa intenzione:', carry: 'La porto avanti', change: 'La cambio', changePh: 'Scrivi la nuova intenzione…', freshQ: 'Che intenzione hai per oggi?', freshPh: 'Scrivi qui…', start: 'Inizia la giornata', wish: 'Che la tua giornata sia gentile', done: 'La tua giornata è iniziata.', weekTag: 'La Settimana, Vista', weekQ1: 'Cosa si è ripetuto questa settimana, visto dalla riva, non dalla corrente?', weekQ2: 'Un momento in cui sei stato vicino a te stesso — cosa lo ha reso possibile?', weekQ3: 'Cosa porti con te nella settimana che viene — una sola frase.', weekPh1: 'Quello che hai notato tornare…', weekPh2: 'Il momento, e cosa lo ha sostenuto…', weekPh3: 'Una frase…', planToggle: 'Aggiungi un piano (opzionale)', planIntro: 'Se vuoi, collega l\'intenzione a un momento concreto della giornata.', planIfLabel: 'Se…', planIfPh: 'es.: mi prende la fretta al mattino', planThenLabel: 'allora…', planThenPh: 'es.: mi fermo 10 secondi e respiro', planObstacleLabel: 'Cosa potrebbe ostacolarti oggi?', planObstaclePh: 'Scrivilo qui…' },
  pt: { greet: 'Bom dia', sleepQ: 'Como dormiste?', sleepPh: 'Escreve uma ou duas palavras…', intentionQ: 'Ontem à noite deixaste esta intenção:', carry: 'Levo-a comigo', change: 'Mudo-a', changePh: 'Escreve a nova intenção…', freshQ: 'Que intenção tens para hoje?', freshPh: 'Escreve aqui…', start: 'Começa o dia', wish: 'Que o teu dia seja suave', done: 'O teu dia começou.', weekTag: 'A Semana, Vista', weekQ1: 'O que se repetiu esta semana, visto da margem, não da correnteza?', weekQ2: 'Um momento em que estiveste perto de ti — o que o tornou possível?', weekQ3: 'O que levas contigo para a semana que vem — uma única frase.', weekPh1: 'O que notaste a repetir-se…', weekPh2: 'O momento, e o que o sustentou…', weekPh3: 'Uma frase…', planToggle: 'Adicionar um plano (opcional)', planIntro: 'Se quiseres, liga a intenção a um momento concreto do dia.', planIfLabel: 'Se…', planIfPh: 'ex.: apanho-me com pressa de manhã', planThenLabel: 'então…', planThenPh: 'ex.: paro 10 segundos e respiro', planObstacleLabel: 'O que pode atrapalhar hoje?', planObstaclePh: 'Escreve aqui…' },
  nl: { greet: 'Goedemorgen', sleepQ: 'Hoe heb je geslapen?', sleepPh: 'Schrijf een woord of twee…', intentionQ: 'Gisteravond liet je dit voornemen achter:', carry: 'Ik draag het mee', change: 'Ik verander het', changePh: 'Schrijf het nieuwe voornemen…', freshQ: 'Welk voornemen heb je voor vandaag?', freshPh: 'Schrijf hier…', start: 'Begin de dag', wish: 'Moge je dag zacht zijn', done: 'Je dag is begonnen.', weekTag: 'De Week, Gezien', weekQ1: 'Wat herhaalde zich deze week, gezien vanaf de oever, niet vanuit de stroming?', weekQ2: 'Een moment waarop je dicht bij jezelf was — wat maakte dat mogelijk?', weekQ3: 'Wat neem je mee naar de komende week — één zin.', weekPh1: 'Wat je zag terugkeren…', weekPh2: 'Het moment, en wat het droeg…', weekPh3: 'Eén zin…', planToggle: 'Voeg een plan toe (optioneel)', planIntro: 'Als je wilt, koppel je intentie aan een concreet moment van de dag.', planIfLabel: 'Als…', planIfPh: 'bijv.: ik heb haast in de ochtend', planThenLabel: 'dan…', planThenPh: 'bijv.: ik pauzeer 10 seconden en adem', planObstacleLabel: 'Wat zou vandaag in de weg kunnen staan?', planObstaclePh: 'Schrijf het hier…' },
  pl: { greet: 'Dzień dobry', sleepQ: 'Jak spałeś?', sleepPh: 'Napisz słowo lub dwa…', intentionQ: 'Wczoraj wieczorem zostawiłeś tę intencję:', carry: 'Niosę to dalej', change: 'Zmieniam to', changePh: 'Napisz nową intencję…', freshQ: 'Jaką intencję masz na dziś?', freshPh: 'Napisz tutaj…', start: 'Zacznij dzień', wish: 'Niech twój dzień będzie łagodny', done: 'Twój dzień się zaczął.', weekTag: 'Tydzień, Zobaczony', weekQ1: 'Co powtarzało się w tym tygodniu, widziane z brzegu, nie z nurtu?', weekQ2: 'Chwila, w której byłeś blisko siebie — co to umożliwiło?', weekQ3: 'Co zabierasz ze sobą w nadchodzący tydzień — jedno zdanie.', weekPh1: 'Co zauważyłeś, że wraca…', weekPh2: 'Ta chwila i to, co ją podtrzymało…', weekPh3: 'Jedno zdanie…', planToggle: 'Dodaj plan (opcjonalnie)', planIntro: 'Jeśli chcesz, połącz intencję z konkretnym momentem dnia.', planIfLabel: 'Jeśli…', planIfPh: 'np.: łapie mnie pośpiech rano', planThenLabel: 'to…', planThenPh: 'np.: zatrzymuję się na 10 sekund i oddycham', planObstacleLabel: 'Co może stanąć na przeszkodzie dzisiaj?', planObstaclePh: 'Napisz tutaj…' },
  hu: { greet: 'Jó reggelt', sleepQ: 'Hogy aludtál?', sleepPh: 'Írj egy-két szót…', intentionQ: 'Tegnap este ezt a szándékot hagytad itt:', carry: 'Továbbviszem', change: 'Megváltoztatom', changePh: 'Írd le az új szándékot…', freshQ: 'Milyen szándékod van a mai napra?', freshPh: 'Írj ide…', start: 'Kezdd a napot', wish: 'Legyen szelíd a napod', done: 'A napod elkezdődött.', weekTag: 'A Hét, Látva', weekQ1: 'Mi ismétlődött ezen a héten — a partról nézve, nem a sodrásból?', weekQ2: 'Egy pillanat, amikor közel voltál önmagadhoz — mi tette lehetővé?', weekQ3: 'Mit viszel magaddal a következő hétre — egyetlen mondat.', weekPh1: 'Amit visszatérni észrevettél…', weekPh2: 'A pillanat, és ami megtartotta…', weekPh3: 'Egy mondat…', planToggle: 'Terv hozzáadása (opcionális)', planIntro: 'Ha szeretnéd, köss a szándékhoz a nap egy konkrét pillanatát.', planIfLabel: 'Ha…', planIfPh: 'pl.: reggel elkap a sietség', planThenLabel: 'akkor…', planThenPh: 'pl.: megállok 10 másodpercre és lélegzem', planObstacleLabel: 'Mi állhat ma az utadba?', planObstaclePh: 'Írd ide…' },
  ru: { greet: 'Доброе утро', sleepQ: 'Как спалось?', sleepPh: 'Напиши слово или два…', intentionQ: 'Вчера вечером ты оставил(а) это намерение:', carry: 'Несу его дальше', change: 'Меняю его', changePh: 'Напиши новое намерение…', freshQ: 'Какое у тебя намерение на сегодня?', freshPh: 'Напиши здесь…', start: 'Начать день', wish: 'Пусть день будет мягким', done: 'Твой день начался.', weekTag: 'Неделя, Увиденная', weekQ1: 'Что повторялось на этой неделе — если смотреть с берега, а не из течения?', weekQ2: 'Момент, когда ты был(а) близко к себе — что сделало это возможным?', weekQ3: 'Что ты берёшь с собой в следующую неделю — одно предложение.', weekPh1: 'Что ты заметил(а) возвращающимся…', weekPh2: 'Момент и то, что его поддержало…', weekPh3: 'Одно предложение…', planToggle: 'Добавить план (по желанию)', planIntro: 'Если хочешь, свяжи намерение с конкретным моментом дня.', planIfLabel: 'Если…', planIfPh: 'напр.: утром меня охватывает спешка', planThenLabel: 'то…', planThenPh: 'напр.: останавливаюсь на 10 секунд и дышу', planObstacleLabel: 'Что может помешать сегодня?', planObstaclePh: 'Напиши здесь…' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

// Nu își desenează propria picătură: gestul atinge APA HOME-ULUI (legea 6).
export default function MorningAnchor({ lang = 'en', name = '', done = false, continuedIntention = '', accountDay = 1, onComplete }) {
  const [sleep, setSleep] = useState('')
  const [intentionMode, setIntentionMode] = useState(continuedIntention ? 'echo' : 'fresh') // echo | changing | fresh
  const [intention, setIntention] = useState('')
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(done)
  // GCAO A1 (01.08.2026) — pasul "Planul", opțional: dacă-atunci (Gollwitzer
  // & Sheeran) + obstacolul numit dinainte (Oettingen/WOOP). Ascuns până
  // userul îl deschide — sărirea lui nu blochează și nu pătează ritualul.
  const [planOpen, setPlanOpen] = useState(false)
  const [planIf, setPlanIf] = useState('')
  const [planThen, setPlanThen] = useState('')
  const [planObstacle, setPlanObstacle] = useState('')
  // Sfera care respiră deschide ritualul (secț. B) — dacă ritualul e deja
  // făcut azi (done), n-are rost s-o mai arătăm la fiecare re-randare.
  const [breathDone, setBreathDone] = useState(done)

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
    // Planul e opțional — trimis doar dacă userul a scris ceva în el; nu
    // exista niciun camp gol care sa arate ca "ai sarit un pas obligatoriu".
    const plan = {}
    if (planIf.trim()) plan.plan_if = planIf.trim()
    if (planThen.trim()) plan.plan_then = planThen.trim()
    if (planObstacle.trim()) plan.plan_obstacle = planObstacle.trim()
    try {
      await fetch('/api/ritual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'morning', sleep: sleep.trim(), intention: finalIntention, ...plan, tz: clientTzOffset() }),
      })
    } catch (e) { /* prezența nu se pierde pentru o eroare de rețea */ }
    setSent(true)
    setSaving(false)
    if (onComplete) onComplete()
  }

  if (sent) {
    return (
      <div className="flow-in water-float">
        <p style={s.wish}>{lx(lang, 'wish')}{who}.</p>
      </div>
    )
  }

  // Sfera care respiră deschide ritualul (secț. B) — nu ritual paralel, ci
  // primul pas al celui existent. La final (natural sau ieșire liberă),
  // continuăm cu restul ritualului de mai jos.
  // GCAO 02.08.2026 (regresie reparată): FEATURE_BREATH era inexistent in
  // cod — sfera se randa neconditionat, deci "ascunsa complet" nu era
  // adevarat niciodata. Cat FEATURE_BREATH e false, sarim direct la restul
  // ritualului, fara nicio poarta.
  if (FEATURE_BREATH && !breathDone) {
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

  // GCAO 05.08.2026 — "Apa vie, zi și seară": salutul s-a mutat în antetul
  // comun de pe Azi (dashboard/page.js, stânga-sus, lângă comutatorul ☾/☀) —
  // nu se mai repetă aici. Câmpurile stau pe foaia cu scrim (water-sheet),
  // jos, în zona degetului mare. Ierarhia rămâne: cum ai dormit → Gândul
  // Zilei → intenție+Plan (un singur bloc vizual) → UN buton primar.
  return (
    <div className="flow-in water-sheet">
      <div className="water-sheet-inner">
      {/* bloc 1 — cum ai dormit: scris liber, un rând, fără stări preselectate */}
      <p style={s.q}>{lx(lang, 'sleepQ')}</p>
      <input
        type="text"
        value={sleep}
        onChange={(e) => setSleep(e.target.value)}
        placeholder={lx(lang, 'sleepPh')}
        className="input-clean"
        style={s.sleepInput}
      />

      {/* bloc 2 — Gândul Zilei, fără casetă proprie (embedded, vezi
          DailyInsight.js) */}
      <div style={s.block}>
        <DailyInsight embedded />
      </div>

      {/* bloc 3 — intenția + Planul (opțional, discret), UN singur bloc vizual */}
      <div style={s.block}>
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

        {/* Planul — rămâne parte a aceluiași bloc (intenție+Plan), nu unul separat */}
        {!planOpen ? (
          <button type="button" onClick={() => setPlanOpen(true)} style={s.planToggle}>
            {lx(lang, 'planToggle')}
          </button>
        ) : (
          <div className="flow-in" style={{ marginTop: '14px' }}>
            <p style={s.planIntro}>{lx(lang, 'planIntro')}</p>
            <p style={s.q}>{lx(lang, 'planIfLabel')}</p>
            <input type="text" value={planIf} onChange={(e) => setPlanIf(e.target.value)} placeholder={lx(lang, 'planIfPh')} className="input-clean" style={s.planInput} />
            <p style={{ ...s.q, marginTop: '14px' }}>{lx(lang, 'planThenLabel')}</p>
            <input type="text" value={planThen} onChange={(e) => setPlanThen(e.target.value)} placeholder={lx(lang, 'planThenPh')} className="input-clean" style={s.planInput} />
            <p style={{ ...s.q, marginTop: '14px' }}>{lx(lang, 'planObstacleLabel')}</p>
            <input type="text" value={planObstacle} onChange={(e) => setPlanObstacle(e.target.value)} placeholder={lx(lang, 'planObstaclePh')} className="input-clean" style={s.planInput} />
          </div>
        )}
      </div>

      <button onClick={save} disabled={saving} className="pill-btn" style={s.btn}>
        {lx(lang, 'start')}
      </button>
      </div>
    </div>
  )
}

// GCAO 05.08.2026 — constituția v2: sans de sistem, corp minim 16px, maxim 3
// mărimi vizibile (16px conținut funcțional, 13px indicii/meta); serif
// (Georgia) rezervat DOAR pentru salut și Gândul Zilei — niciunul dintre ele
// nu se mai randează aici (salutul e în antetul comun; Gândul Zilei își are
// propriile stiluri, în DailyInsight.js).
const s = {
  card: { padding: '30px 24px', marginBottom: '24px', textAlign: 'center' },
  wish: { fontFamily: 'Georgia, serif', fontSize: '20px', color: 'var(--text)' },
  q: { fontSize: '16px', color: 'rgba(242,239,233,.66)', marginBottom: '10px' },
  sleepInput: { width: '100%', textAlign: 'left', boxSizing: 'border-box' },
  block: { marginTop: '18px', textAlign: 'left' },
  echoText: { fontSize: '16px', color: 'var(--text)', lineHeight: 1.6, marginBottom: '14px', fontStyle: 'italic' },
  gestureRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  gestureBtn: { padding: '11px 20px', minHeight: '44px' },
  intentionArea: { width: '100%', resize: 'none', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '16px', lineHeight: 1.6, boxSizing: 'border-box' },
  planToggle: { display: 'inline-block', background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '13px', cursor: 'pointer', padding: '10px 0 4px', minHeight: '44px' },
  planIntro: { fontSize: '13px', color: 'var(--text-light)', lineHeight: 1.5, marginBottom: '14px' },
  planInput: { width: '100%', boxSizing: 'border-box' },
  btn: { width: '100%', height: '52px', marginTop: '16px' },
}
