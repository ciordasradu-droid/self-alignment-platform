'use client'

// Starea apei, partajata intre UI (DOM) si scena WebGL.
// Nu folosim context React: shaderul citeste la 60fps, iar re-randarile React
// n-au ce cauta acolo. Un store minimal cu abonare e mai ieftin si mai direct.

import { useEffect } from 'react'

// ── Cele 7 stadii: ziua -> parametrii vizuali. Arhitectura stie de toate,
//    stadiul 1 e livrat complet; 2-7 cresc pe aceiasi parametri (nu se rescrie).
// Stadiile TREBUIE sa difere dramatic: daca ziua 1 si ziua 90 se confunda
// una cu alta, drumul nu se vede — iar starea apei e singura forma de progres
// din aplicatie (legea 7). De aici saltul mare de marime si de lumina.
export const STAGES = [
  { day: 1,  key: 'first_drop',  en: 'First Drop',  ro: 'Prima Picătură', size: 0.34, caustics: 0.22, light: 0.00, spin: 0.10 },
  { day: 3,  key: 'the_deep',    en: 'The Deep',    ro: 'Adâncul',        size: 0.52, caustics: 0.38, light: 0.10, spin: 0.14 },
  { day: 7,  key: 'the_flow',    en: 'The Flow',    ro: 'Curgerea',       size: 0.66, caustics: 0.50, light: 0.22, spin: 0.18 },
  { day: 14, key: 'clear_water', en: 'Clear Water', ro: 'Apa Limpede',    size: 0.80, caustics: 0.85, light: 0.38, spin: 0.20 },
  { day: 30, key: 'the_tide',    en: 'The Tide',    ro: 'Mareea',         size: 0.95, caustics: 0.65, light: 0.55, spin: 0.24 },
  { day: 60, key: 'the_crystal', en: 'The Crystal', ro: 'Cristalul',      size: 1.10, caustics: 0.75, light: 0.75, spin: 0.16 },
  { day: 90, key: 'the_ocean',   en: 'The Ocean',   ro: 'Oceanul',        size: 1.45, caustics: 1.05, light: 1.00, spin: 0.12 },
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
  // Picatura traieste in zona ei din hero si iese din cadru odata cu ea.
  // NU e element care pluteste peste continutul scrolat.
  dropOpacity: 1,
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
  setDropOpacity(v) { state.dropOpacity = v },
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

// ── Ancora picaturii ──
// Picatura se randeaza in Canvas-ul fix, dar TREBUIE sa stea in zona ei din
// hero si sa iasa din cadru odata cu ea la scroll. Elementul-ancora isi
// raporteaza pozitia; picatura o urmeaza si se stinge cand ancora pleaca.
export function useWaterAnchor(ref, active = true) {
  useEffect(() => {
    if (!active || !ref.current) {
      waterState.setShowDrop(false)
      return
    }
    let raf = 0
    const measure = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = (r.left + r.width / 2) / window.innerWidth
      const cy = 1 - (r.top + r.height / 2) / window.innerHeight   // UV: y creste in sus
      waterState.setDropPos(cx, cy)

      // se stinge pe masura ce ancora paraseste ecranul — nu trece peste carduri
      const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)
      waterState.setDropOpacity(Math.max(0, Math.min(1, visible / Math.max(1, r.height))))
      waterState.setShowDrop(true)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      waterState.setShowDrop(false)
    }
  }, [ref, active])
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
