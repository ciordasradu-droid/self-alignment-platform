'use client'

// GCAO 05.08.2026 — "Apa vie, zi și seară": starea de lumină a lumii
// (WaterWorld) e condusă automat de jumătatea zilei, folosind granițele
// EXISTENTE (03:33/15:33, prin getRitualWindow — SINGURA sursă de adevăr
// pentru asta, ca peste tot în aplicație). NU se reimplementează logica de
// timp aici — doar se traduce fereastra deja calculată în 'day'/'night'.
//
// Comutatorul manual ☾/☀ (doar pe Azi) suprascrie starea PÂNĂ LA URMĂTOAREA
// GRANIȚĂ: alegerea se ține minte în localStorage, legată de fereastra
// curentă (getRitualWindow) în care a fost făcută — de îndată ce fereastra
// se schimbă (granița a trecut), override-ul expiră singur și starea
// naturală preia din nou.

import { useState, useEffect, useCallback } from 'react'
import { getRitualWindow, clientTzOffset } from './logicalDay'

const KEY = 'water_mode_override'

// 'morning' = zi; 'midday'/'evening' = seară — granița dintre ele e chiar
// cea numită explicit în constituție (15:33).
export function getNaturalMode() {
  return getRitualWindow(Date.now(), clientTzOffset()) === 'morning' ? 'day' : 'night'
}

export function getWaterMode() {
  if (typeof window === 'undefined') return 'day'
  const currentWindow = getRitualWindow(Date.now(), clientTzOffset())
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (stored && stored.window === currentWindow && (stored.mode === 'day' || stored.mode === 'night')) {
      return stored.mode
    }
  } catch (e) {}
  return currentWindow === 'morning' ? 'day' : 'night'
}

export function setWaterModeOverride(mode) {
  if (mode !== 'day' && mode !== 'night') return
  try {
    const currentWindow = getRitualWindow(Date.now(), clientTzOffset())
    localStorage.setItem(KEY, JSON.stringify({ mode, window: currentWindow }))
  } catch (e) {}
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('water-mode-change'))
}

// Hook React: const [mode, setMode] = useWaterMode()
// Recitește la fiecare minut (destul de des ca sa prinda trecerea unei
// granite de timp fara sa reincarce pagina) + la orice schimbare manuala.
export function useWaterMode() {
  const [mode, setMode] = useState('day')

  useEffect(() => {
    const update = () => setMode(getWaterMode())
    update()
    const interval = setInterval(update, 60000)
    window.addEventListener('water-mode-change', update)
    return () => {
      clearInterval(interval)
      window.removeEventListener('water-mode-change', update)
    }
  }, [])

  const setOverride = useCallback((next) => {
    setWaterModeOverride(next)
    setMode(next)
  }, [])

  return [mode, setOverride]
}
