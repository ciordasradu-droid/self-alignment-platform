'use client'

// LEGEA 6 + 7 — apa userului. Personajul principal, nu widget.
// Arhitectura cunoaște toate cele 7 stadii; ziua deblocată determină vizualul.
// Stadiul 1 (First Drop) e livrat complet. Stadiile 2-7 cresc pe aceeași
// structură (lumina aurie crește în apă) — vizualele lor specifice
// (curenți, fir care curge, caustice, cristal, fuziune) se adaugă pe rând,
// fără rescriere: fiecare are deja slotul lui în STAGES + <StageExtras/>.

import { useEffect, useRef, useState, useId } from 'react'

export const STAGES = [
  { day: 1,  key: 'first_drop',  en: 'First Drop',  ro: 'Prima Picătură' },
  { day: 3,  key: 'the_deep',    en: 'The Deep',    ro: 'Adâncul' },
  { day: 7,  key: 'the_flow',    en: 'The Flow',    ro: 'Curgerea' },
  { day: 14, key: 'clear_water', en: 'Clear Water', ro: 'Apa Limpede' },
  { day: 30, key: 'the_tide',    en: 'The Tide',    ro: 'Mareea' },
  { day: 60, key: 'the_crystal', en: 'The Crystal', ro: 'Cristalul' },
  { day: 90, key: 'the_ocean',   en: 'The Ocean',   ro: 'Oceanul' },
]

// ziua din drum -> stadiul apei
export function stageForDay(day = 1) {
  let s = STAGES[0]
  for (const st of STAGES) if (day >= st.day) s = st
  return s
}
export function stageIndexForDay(day = 1) {
  return STAGES.findIndex(s => s.key === stageForDay(day).key)
}

// Arcul drumului: lumina aurie de bază crește cu stadiul (palid -> miez auriu).
function baseLightForStage(i) {
  return [0.00, 0.10, 0.20, 0.34, 0.50, 0.68, 1.00][i] || 0
}

function mix(a, b, t) { return Math.round(a + (b - a) * t) }

/**
 * @param {number} day    - ziua deblocată a userului (1..90+)
 * @param {number} light  - 0..100, semnalul de moment (gestul de dimineață).
 *                          Null => doar lumina de stadiu (home în repaus).
 * @param {boolean} interactive - ripple la atingere pe suprafață
 */
export default function WaterDrop({
  day = 1,
  light = null,
  size = 260,
  interactive = true,
  onTouch,
}) {
  const uid = useId().replace(/:/g, '')
  const hostRef = useRef(null)
  const [rings, setRings] = useState([])
  const ringId = useRef(0)

  const stageIdx = stageIndexForDay(day)
  const base = baseLightForStage(stageIdx)
  // semnalul de moment ridică lumina peste baza stadiului, nu o înlocuiește
  const t = light == null ? base : Math.min(1, base * 0.45 + (light / 100) * 0.85)

  // ALB SPĂLAT (perlat) -> AURIU CALD. Lumina e ÎN apă.
  const r = mix(232, 255, t)
  const g = mix(238, 176, t)
  const b = mix(245, 102, t)
  const core = `rgb(${r},${g},${b})`

  // picătura rămâne MICĂ; apa și lumina răspund
  const dropR = 13 + stageIdx * 1.6
  const cx = size / 2
  const cy = size * 0.36
  const surfaceY = size * 0.66

  // ripples de pe suprafață se lărgesc blând cu lumina
  const spread = 0.55 + t * 0.45

  // atingerea naște o undă nouă pe suprafață
  const touch = (e) => {
    if (!interactive) return
    const box = hostRef.current?.getBoundingClientRect()
    if (!box) return
    const id = ++ringId.current
    const x = e.clientX != null ? e.clientX - box.left : cx
    setRings(v => [...v, { id, x }])
    setTimeout(() => setRings(v => v.filter(k => k.id !== id)), 2000)
    if (onTouch) onTouch()
  }

  return (
    <div
      ref={hostRef}
      onPointerDown={touch}
      style={{ width: size, height: size, margin: '0 auto', touchAction: 'manipulation' }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img"
           aria-label="Apa ta" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          {/* picătura perlată — lumina caldă crește în interior */}
          <radialGradient id={`d${uid}`} cx="38%" cy="32%" r="72%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="45%"  stopColor={core} stopOpacity="0.95" />
            <stop offset="100%" stopColor={core} stopOpacity="0.62" />
          </radialGradient>
          {/* halo — lumina difuzată ÎN apă, nu aură de foc */}
          <radialGradient id={`h${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={core} stopOpacity={0.34 + t * 0.34} />
            <stop offset="55%"  stopColor={core} stopOpacity={0.10 + t * 0.14} />
            <stop offset="100%" stopColor={core} stopOpacity="0" />
          </radialGradient>
          {/* reflexia pe suprafață — soarele care răsare peste apă */}
          <linearGradient id={`r${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={core} stopOpacity={0.30 + t * 0.42} />
            <stop offset="100%" stopColor={core} stopOpacity="0" />
          </linearGradient>
          <filter id={`b${uid}`} x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation={5 + t * 5} />
          </filter>
          <filter id={`bs${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <clipPath id={`c${uid}`}>
            <rect x="0" y={surfaceY} width={size} height={size - surfaceY} />
          </clipPath>
        </defs>

        {/* suprafața întunecată a apei */}
        <rect x="0" y={surfaceY} width={size} height={size - surfaceY} fill="rgba(0,0,0,0.30)" />
        <line x1="0" y1={surfaceY} x2={size} y2={surfaceY}
              stroke="rgba(255,255,255,0.16)" strokeWidth="1" />

        {/* reflexia luminii pe apă, sub picătură */}
        <g clipPath={`url(#c${uid})`}>
          <ellipse cx={cx} cy={surfaceY + 4} rx={dropR * (1.6 + t * 1.4)} ry={size * 0.10}
                   fill={`url(#r${uid})`} filter={`url(#bs${uid})`} />
        </g>

        {/* inele concentrice de ripples pe suprafață — respiră lent */}
        {[0, 1, 2].map(i => (
          <ellipse key={i}
            cx={cx} cy={surfaceY}
            rx={(38 + i * 34) * spread} ry={(6 + i * 5) * spread}
            fill="none"
            stroke={`rgba(255,255,255,${0.13 - i * 0.035})`}
            strokeWidth="1"
            style={{
              transformOrigin: `${cx}px ${surfaceY}px`,
              animation: `wd-breathe ${6 + i}s var(--ease-soft) ${i * 0.5}s infinite`,
            }}
          />
        ))}

        {/* unde născute din atingere */}
        {rings.map(k => (
          <ellipse key={k.id} cx={k.x} cy={surfaceY} rx="10" ry="2"
            fill="none" stroke="var(--gold-soft)" strokeWidth="1"
            style={{ transformOrigin: `${k.x}px ${surfaceY}px`, animation: 'wd-ring 1.9s var(--ease-out) forwards' }}
          />
        ))}

        {/* lumina difuză din jurul picăturii (în apă) */}
        <circle cx={cx} cy={cy} r={dropR * (2.6 + t * 3.4)} fill={`url(#h${uid})`} filter={`url(#b${uid})`}
                style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'wd-breathe 5.5s var(--ease-soft) infinite' }} />

        {/* PICĂTURA — mică, perlată, suspendată */}
        <circle cx={cx} cy={cy} r={dropR} fill={`url(#d${uid})`}
                style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'wd-float 7s var(--ease-soft) infinite' }} />
        <ellipse cx={cx - dropR * 0.32} cy={cy - dropR * 0.38} rx={dropR * 0.26} ry={dropR * 0.18}
                 fill="rgba(255,255,255,0.9)" />

        <StageExtras idx={stageIdx} cx={cx} cy={cy} r={dropR} surfaceY={surfaceY} core={core} t={t} />
      </svg>
    </div>
  )
}

// Sloturile stadiilor 2-7. Fiecare crește pe aceeași structură — se rafinează
// pe rând (backlog), fără să atingă restul componentei.
function StageExtras({ idx, cx, cy, r, surfaceY, core, t }) {
  return (
    <>
      {/* 2. Adâncul — curenți interiori */}
      {idx >= 1 && (
        <ellipse cx={cx} cy={cy} rx={r * 0.6} ry={r * 0.24}
                 fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="0.6"
                 style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'wd-breathe 4s var(--ease-soft) infinite' }} />
      )}
      {/* 3. Curgerea — firul de apă care se desprinde */}
      {idx >= 2 && (
        <line x1={cx} y1={cy + r} x2={cx} y2={surfaceY}
              stroke={core} strokeOpacity="0.34" strokeWidth="1.4" strokeLinecap="round"
              style={{ animation: 'wd-flow 3.4s var(--ease-soft) infinite' }} />
      )}
      {/* 4. Apa Limpede — caustice aurii */}
      {idx >= 3 && (
        <circle cx={cx} cy={cy} r={r * 1.5} fill="none"
                stroke="var(--gold-soft)" strokeWidth="0.5" strokeDasharray="2 6"
                style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'wd-breathe 9s linear infinite' }} />
      )}
      {/* 5. Mareea — valuri fine pe marea întunecată */}
      {idx >= 4 && (
        <path d={`M0 ${surfaceY + 16} q ${cx / 2} -6 ${cx} 0 t ${cx} 0`}
              fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      )}
      {/* 6. Cristalul — micro-structuri geometrice calde */}
      {idx >= 5 && (
        <polygon
          points={`${cx},${cy - r * 0.5} ${cx + r * 0.45},${cy + r * 0.3} ${cx - r * 0.45},${cy + r * 0.3}`}
          fill="none" stroke="var(--gold-soft)" strokeWidth="0.7" />
      )}
      {/* 7. Oceanul — miez auriu bioluminiscent */}
      {idx >= 6 && (
        <circle cx={cx} cy={cy} r={r * 0.34} fill="var(--gold)" fillOpacity={0.5 + t * 0.4}
                style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'wd-breathe 3s var(--ease-soft) infinite' }} />
      )}
    </>
  )
}
