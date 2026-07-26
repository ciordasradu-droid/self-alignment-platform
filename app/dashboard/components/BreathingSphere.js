'use client'

// SFERA CARE RESPIRĂ (sect. B/C, 25.07 noapte) — element luminos simplu
// (CSS/SVG), provizoriu pe placa video curentă, până vine setul unic de
// plăci (legea 4, Steaua Polară — mișcarea aici e permisă, moment de ritual).
// Fără cifre pe ecran, fără gamificare, fără nivel. Ciclu ~4s dilatare
// (inspirație) / ~6s strângere (expirație) — expirația mai lungă coboară
// fiziologic pulsul.
//
// Două moduri:
// - "session" (dimineața, secț. B): 3 min implicit / 5 min opțiune tăcută
//   (fără text, fără cifre — doar două puncte discrete). Ieșire liberă
//   oricând (tap → fade blând). La final natural: arată intenția câteva
//   secunde, apoi onComplete({ early:false }).
// - "singleCycle" (seara, secț. C): UN singur ciclu, fără text, fără
//   opțiuni — un tap trece mai departe (aceeași regulă de ieșire liberă).

import { useState, useEffect, useRef } from 'react'
import { waterState } from '../../components/water/waterState'
import { getBreathDurationOverrideMs } from '../../../lib/simBreath'

const L = {
  en: { invite: 'The sphere breathes — you can breathe with it. Leave whenever you want.', aria_breathing: 'Breathing exercise' },
  ro: { invite: 'Sfera respiră — poți respira cu ea. Ieși oricând.', aria_breathing: 'Exercițiu de respirație' },
  es: { invite: 'La esfera respira — puedes respirar con ella. Sal cuando quieras.', aria_breathing: 'Ejercicio de respiración' },
  fr: { invite: 'La sphère respire — tu peux respirer avec elle. Pars quand tu veux.', aria_breathing: 'Exercice de respiration' },
  de: { invite: 'Die Kugel atmet — du kannst mit ihr atmen. Geh, wann du willst.', aria_breathing: 'Atemübung' },
  it: { invite: 'La sfera respira — puoi respirare con lei. Vai via quando vuoi.', aria_breathing: 'Esercizio di respirazione' },
  pt: { invite: 'A esfera respira — podes respirar com ela. Sai quando quiseres.', aria_breathing: 'Exercício de respiração' },
  nl: { invite: 'De bol ademt — je kunt met haar meeademen. Vertrek wanneer je wilt.', aria_breathing: 'Ademhalingsoefening' },
  pl: { invite: 'Kula oddycha — możesz oddychać razem z nią. Odejdź, kiedy chcesz.', aria_breathing: 'Ćwiczenie oddechowe' },
  hu: { invite: 'A gömb lélegzik — vele lélegezhetsz. Menj el, amikor akarsz.', aria_breathing: 'Légzőgyakorlat' },
  ru: { invite: 'Сфера дышит — ты можешь дышать вместе с ней. Уходи, когда захочешь.', aria_breathing: 'Дыхательное упражнение' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

const CYCLE_MS = 10000 // 4s inspiratie + 6s expiratie
const SESSION_DEFAULT_MS = 3 * 60 * 1000
const SESSION_LONG_MS = 5 * 60 * 1000
const FIRST_USE_KEY = 'seen_morning_sphere'

export default function BreathingSphere({ lang = 'en', mode = 'session', continuedIntention = '', onComplete }) {
  const [longSession, setLongSession] = useState(false)
  const [fading, setFading] = useState(false)
  const [showIntention, setShowIntention] = useState(false)
  // Initializer lazy, NU efect: citit o singura data, INAINTE ca orice efect
  // sa apuce sa scrie flag-ul — altfel React StrictMode (dev) il gaseste
  // deja "vazut" la a doua montare simulata, si invitatia nu mai apare
  // niciodata la prima folosire reala.
  const [firstUse] = useState(() => {
    if (mode !== 'session') return false
    try { return !localStorage.getItem(FIRST_USE_KEY) } catch (e) { return false }
  })
  const [reducedMotion, setReducedMotion] = useState(false)
  // Doar pentru lanțul intern al lui finish() (fade -> arată intenția ->
  // onComplete) — NU pentru timerele efectelor de mai jos, care își curăță
  // fiecare propriul timer la cleanup. Amestecarea celor două a fost sursa
  // unui bug real: React StrictMode (dev) montează-demontează-remontează
  // simulat, iar un cleanup comun anula timerul de sesiune înainte ca acesta
  // să apuce să pornească din nou, blocând finalul natural al respirației.
  const timeoutsRef = useRef([])

  // sect. QA: sim_breath_ms scurteaza durata pentru verificare, fara sa
  // afecteze productia (override null implicit, vezi lib/simBreath.js).
  const durationMs = getBreathDurationOverrideMs() || (mode === 'session' ? (longSession ? SESSION_LONG_MS : SESSION_DEFAULT_MS) : CYCLE_MS)

  useEffect(() => {
    try {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    } catch (e) {}
    waterState.setLight(15)
    return () => {
      waterState.setLight(null)
    }
  }, [])

  useEffect(() => {
    return () => { timeoutsRef.current.forEach(clearTimeout) }
  }, [])

  const clearTimers = () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = [] }

  const finish = (early) => {
    clearTimers()
    setFading(true)
    const t1 = setTimeout(() => {
      if (!early && mode === 'session' && continuedIntention) {
        setShowIntention(true)
        const t2 = setTimeout(() => onComplete && onComplete({ early }), 3400)
        timeoutsRef.current.push(t2)
      } else {
        onComplete && onComplete({ early })
      }
    }, 650)
    timeoutsRef.current.push(t1)
  }

  // pornirea reala: la primul tap/randare, marcam invitatia ca vazuta si
  // programam finalul natural al sesiunii (mod "session"). Fiecare montare
  // a acestui efect isi programeaza si isi curata PROPRIUL timer — nu
  // depinde de un flag "startedRef" care ar supravietui unei demontari
  // simulate (StrictMode) in timp ce timerul insusi e curatat separat.
  useEffect(() => {
    if (mode !== 'session') return
    try { localStorage.setItem(FIRST_USE_KEY, '1') } catch (e) {}
    const t = setTimeout(() => finish(false), durationMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longSession, durationMs])

  // Mod "singleCycle" (seara, secț. C): în mod normal, un singur ciclu CSS
  // se termină singur (onAnimationEnd mai jos). Dar dacă utilizatorul are
  // prefers-reduced-motion, animația nu rulează deloc — evenimentul nu mai
  // vine niciodată, deci avem nevoie și de un timer JS de rezervă, altfel
  // ecranul rămâne blocat pentru totdeauna.
  useEffect(() => {
    if (mode !== 'singleCycle') return
    const t = setTimeout(() => finish(false), durationMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs])

  const handleTapExit = () => {
    if (fading) return
    finish(true)
  }

  const handleCycleEnd = () => {
    if (mode === 'singleCycle' && !fading) finish(false)
  }

  // Schimbarea lui longSession schimba durationMs, ceea ce reprogrameaza
  // automat timerul de sesiune (efectul de mai sus curata timerul vechi si
  // porneste unul nou) — fara nicio gestiune manuala de ref aici.
  const pickLong = (e) => { e.stopPropagation(); setLongSession(true) }
  const pickDefault = (e) => { e.stopPropagation(); setLongSession(false) }

  return (
    <div
      style={{ ...s.wrap, opacity: fading ? 0 : 1 }}
      onClick={handleTapExit}
      role="button"
      tabIndex={0}
      aria-label={lx(lang, 'aria_breathing')}
    >
      <div style={{ ...s.ambientGlow, opacity: fading ? 0 : 1, transitionDuration: `${durationMs}ms` }} aria-hidden="true" />

      {showIntention ? (
        <p style={s.intentionText}>{continuedIntention}</p>
      ) : (
        <>
          {mode === 'session' && firstUse && (
            <p style={s.invite}>{lx(lang, 'invite')}</p>
          )}
          <div
            className={reducedMotion ? '' : 'breath-sphere'}
            style={s.sphere}
            onAnimationIteration={handleCycleEnd}
            onAnimationEnd={handleCycleEnd}
          />
          {mode === 'session' && (
            <div style={s.durationRow} aria-hidden="true">
              <span onClick={pickDefault} style={{ ...s.durationDot, opacity: longSession ? 0.35 : 0.9 }} />
              <span onClick={pickLong} style={{ ...s.durationDot, width: '10px', height: '10px', opacity: longSession ? 0.9 : 0.35 }} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

const s = {
  wrap: { position: 'relative', minHeight: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'opacity 650ms var(--ease-out)', textAlign: 'center', padding: '20px' },
  ambientGlow: { position: 'absolute', inset: 0, borderRadius: 'inherit', background: 'radial-gradient(ellipse 90% 70% at 50% 60%, var(--gold-faint) 0%, transparent 70%)', transitionProperty: 'opacity', transitionTimingFunction: 'linear', pointerEvents: 'none' },
  invite: { fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: 'var(--text-light)', lineHeight: 1.6, marginBottom: '22px', maxWidth: '280px' },
  sphere: { width: '84px', height: '84px', borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, #fff 0%, var(--pearl) 45%, var(--gold) 100%)', boxShadow: '0 0 30px var(--gold-soft), 0 0 60px var(--gold-faint)' },
  durationRow: { display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', marginTop: '28px' },
  durationDot: { width: '7px', height: '7px', borderRadius: '50%', background: 'var(--gold)', cursor: 'pointer', transition: 'opacity 200ms ease' },
  intentionText: { fontFamily: 'Cormorant Garamond, serif', fontSize: '19px', fontStyle: 'italic', color: 'var(--amber)', lineHeight: 1.6, maxWidth: '320px' },
}
