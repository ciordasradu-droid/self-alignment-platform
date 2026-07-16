'use client'

// Starea apei, partajata intre UI (DOM) si scena WebGL.
// Nu folosim context React: shaderul citeste la 60fps, iar re-randarile React
// n-au ce cauta acolo. Un store minimal cu abonare e mai ieftin si mai direct.

import { useEffect } from 'react'

// ── Cele 7 stadii: ziua -> parametrii vizuali. Arhitectura stie de toate,
//    stadiul 1 e livrat complet; 2-7 cresc pe aceiasi parametri (nu se rescrie).
export const STAGES = [
  { day: 1,  key: 'first_drop',  en: 'First Drop',  ro: 'Prima Picătură', size: 0.52, caustics: 0.30, light: 0.00, spin: 0.10 },
  { day: 3,  key: 'the_deep',    en: 'The Deep',    ro: 'Adâncul',        size: 0.62, caustics: 0.42, light: 0.10, spin: 0.14 },
  { day: 7,  key: 'the_flow',    en: 'The Flow',    ro: 'Curgerea',       size: 0.68, caustics: 0.52, light: 0.20, spin: 0.18 },
  { day: 14, key: 'clear_water', en: 'Clear Water', ro: 'Apa Limpede',    size: 0.74, caustics: 0.78, light: 0.34, spin: 0.20 },
  { day: 30, key: 'the_tide',    en: 'The Tide',    ro: 'Mareea',         size: 0.80, caustics: 0.62, light: 0.50, spin: 0.24 },
  { day: 60, key: 'the_crystal', en: 'The Crystal', ro: 'Cristalul',      size: 0.86, caustics: 0.70, light: 0.68, spin: 0.16 },
  { day: 90, key: 'the_ocean',   en: 'The Ocean',   ro: 'Oceanul',        size: 1.00, caustics: 0.95, light: 1.00, spin: 0.12 },
]

export function stageForDay(day = 1) {
  let s = STAGES[0]
  for (const st of STAGES) if (day >= st.day) s = st
  return s
}
export function stageIndexForDay(day = 1) {
  return Math.max(0, STAGES.findIndex(s => s.key === stageForDay(day).key))
}

// ── Store ──
const state = {
  day: 1,
  light: null,      // semnalul de moment (gestul de dimineata); null = lumina stadiului
  dropPos: [0.5, 0.62],
  ripples: [],      // { x, y, born } — max 8, in UV
  // Picatura e APA USERULUI. Pe landing/login nu exista user, deci nu exista
  // picatura — doar apa. Home o cere explicit.
  showDrop: false,
}
const listeners = new Set()
const notify = () => listeners.forEach(l => l())

export const waterState = {
  get: () => state,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) },
  setDay(d) { state.day = d; notify() },
  setLight(v) { state.light = v; notify() },
  setDropPos(x, y) { state.dropPos = [x, y]; notify() },
  setShowDrop(v) { state.showDrop = v; notify() },
  // LEGEA 2 — orice atingere naste o unda. Max 8 simultan; se sting in ~1.5s.
  addRipple(x, y, clock) {
    state.ripples.push({ x, y, born: clock })
    if (state.ripples.length > 8) state.ripples.shift()
  },
  pruneRipples(clock) {
    if (!state.ripples.length) return
    state.ripples = state.ripples.filter(r => clock - r.born < 1.6)
  },
}

// ── LEGEA 2: hook global. Montat o data, asculta tot documentul.
// Tap-ul pe UI ramane al UI-ului (canvas-ul e pointer-events:none) si naste
// SI unda — deci unda e limbajul tactil peste tot, nu doar pe fundal.
export function useRipple() {
  useEffect(() => {
    const onDown = (e) => {
      if (e.clientX == null) return
      const x = e.clientX / window.innerWidth
      const y = 1.0 - e.clientY / window.innerHeight   // UV: y creste in sus
      waterState.addRipple(x, y, waterState.clock ?? performance.now() / 1000)
    }
    document.addEventListener('pointerdown', onDown, { passive: true })
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])
}
