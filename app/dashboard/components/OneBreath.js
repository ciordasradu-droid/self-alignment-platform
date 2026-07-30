'use client'

// O RESPIRAȚIE = OFTATUL FIZIOLOGIC (physiological sigh) — calup arhitectura
// 30.07, A4. DECIZIE ÎNCHISĂ: înlocuiește complet vechea implementare
// (inel simplu de 3 secunde). Coregrafia, pe bulă:
//   1) inspirație adâncă pe nas — bula crește lent (~3.4s)
//   2) a doua inspirație scurtă peste ea — bula mai saltă o dată (~1s)
//   3) expirație lungă și lentă pe gură — bula se lasă moale, inele în apă (~6.6s)
// Primele 3 folosiri: trei indicații discrete, sincron cu fazele. După aceea,
// bula singură e ghidajul — fără cuvinte. La final: apa doar se liniștește,
// fără mesaj, fără bifă, fără vinovăție. Se poate repeta.

import { useState, useEffect, useRef } from 'react'
import { waterState } from '../../components/water/waterState'
import { clientTzOffset } from '../../../lib/logicalDay'

const L = {
  en: { btn: 'One breath', inhale1: 'Breathe in deep', inhale2: 'A little more', exhale: 'Let it all go, long' },
  ro: { btn: 'O respirație', inhale1: 'Inspiră adânc', inhale2: 'Încă puțin', exhale: 'Lasă tot, lung' },
  es: { btn: 'Una respiración', inhale1: 'Inhala profundo', inhale2: 'Un poco más', exhale: 'Suelta todo, largo' },
  fr: { btn: 'Une respiration', inhale1: 'Inspire profond', inhale2: 'Encore un peu', exhale: 'Lâche tout, longuement' },
  de: { btn: 'Ein Atemzug', inhale1: 'Tief einatmen', inhale2: 'Noch etwas mehr', exhale: 'Lass alles los, lang' },
  it: { btn: 'Un respiro', inhale1: 'Inspira profondo', inhale2: 'Ancora un po\'', exhale: 'Lascia andare tutto, a lungo' },
  pt: { btn: 'Uma respiração', inhale1: 'Inspira fundo', inhale2: 'Mais um pouco', exhale: 'Deixa tudo ir, devagar' },
  nl: { btn: 'Eén ademhaling', inhale1: 'Adem diep in', inhale2: 'Nog een beetje', exhale: 'Laat alles los, lang' },
  pl: { btn: 'Jeden oddech', inhale1: 'Weź głęboki wdech', inhale2: 'Jeszcze trochę', exhale: 'Wypuść wszystko, długo' },
  hu: { btn: 'Egy lélegzet', inhale1: 'Lélegezz mélyen', inhale2: 'Még egy kicsit', exhale: 'Engedj el mindent, hosszan' },
  ru: { btn: 'Один вдох', inhale1: 'Вдохни глубоко', inhale2: 'Ещё немного', exhale: 'Отпусти всё, медленно' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

const PHASE_MS = { inhale1: 3400, inhale2: 1000, exhale: 6600 }
const USES_KEY = 'one_breath_uses'

export default function OneBreath({ lang = 'en', onComplete }) {
  const [state, setState] = useState('idle') // idle | inhale1 | inhale2 | exhale | done
  const [showHints, setShowHints] = useState(false)
  const timeoutsRef = useRef([])

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), [])

  const start = () => {
    if (state !== 'idle') return

    let uses = 0
    try { uses = parseInt(localStorage.getItem(USES_KEY) || '0', 10) } catch (e) {}
    setShowHints(uses < 3)
    try { localStorage.setItem(USES_KEY, String(uses + 1)) } catch (e) {}

    fetch('/api/ritual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'one_breath', one_breath: true, tz: clientTzOffset() }),
    }).catch(() => {})

    setState('inhale1')
    waterState.setLight(55)
    const t1 = setTimeout(() => {
      setState('inhale2')
      waterState.setLight(80)
      const t2 = setTimeout(() => {
        setState('exhale')
        waterState.setLight(35)
        const t3 = setTimeout(() => {
          waterState.setLight(null)
          setState('done')
          if (onComplete) onComplete()
        }, PHASE_MS.exhale)
        timeoutsRef.current.push(t3)
      }, PHASE_MS.inhale2)
      timeoutsRef.current.push(t2)
    }, PHASE_MS.inhale1)
    timeoutsRef.current.push(t1)
  }

  // finalul: apa doar se liniștește — fără mesaj, fără bifă. Se poate repeta.
  if (state === 'done') {
    return <button onClick={() => setState('idle')} style={s.btn}>{lx(lang, 'btn')}</button>
  }

  if (state !== 'idle') {
    return (
      <div style={s.stage}>
        <div className={`one-breath-bubble one-breath-${state}`} style={s.bubble} aria-hidden="true" />
        {state === 'exhale' && (
          <>
            <span className="one-breath-ring" style={{ ...s.ring, animationDelay: '0ms' }} aria-hidden="true" />
            <span className="one-breath-ring" style={{ ...s.ring, animationDelay: '900ms' }} aria-hidden="true" />
          </>
        )}
        {showHints && (
          <p style={s.hint}>{lx(lang, state)}</p>
        )}
      </div>
    )
  }

  return (
    <button onClick={start} style={s.btn}>{lx(lang, 'btn')}</button>
  )
}

const s = {
  btn: { display: 'block', margin: '0 auto 24px', padding: '10px 20px', background: 'transparent', border: 'none', color: 'var(--text-light)', fontSize: '13px', cursor: 'pointer', letterSpacing: '0.3px', minHeight: '44px' },
  stage: { position: 'relative', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
  bubble: {
    width: '72px', height: '72px', borderRadius: '48% 52% 45% 55% / 55% 45% 55% 45%',
    background: 'radial-gradient(circle at 38% 32%, #fff 0%, var(--pearl) 45%, var(--gold) 100%)',
    boxShadow: '0 0 30px var(--gold-soft), 0 0 60px var(--gold-faint)',
  },
  ring: { position: 'absolute', width: '110px', height: '110px', borderRadius: '50%', border: '1px solid var(--gold-soft)', boxShadow: '0 0 14px var(--gold-faint)', animation: 'one-breath-ring-out 1.8s var(--ease-out) forwards' },
  hint: { position: 'relative', marginTop: '18px', fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--text-muted)' },
}
