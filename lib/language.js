'use client'

// ─────────────────────────────────────────────────────────────
// LIMBA GLOBALĂ A APLICAȚIEI
// Salvată în localStorage ('app_language').
// Orice pagină o citește cu useLanguage() și o schimbă cu setLanguage().
// Destinație: lib/language.js  (FIȘIER NOU)
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
]

const SUPPORTED = LANGUAGES.map(l => l.code)
const STORAGE_KEY = 'app_language'

// Citește limba curentă: localStorage → limba browserului → engleză
export function getLanguage() {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED.includes(saved)) return saved
  } catch (e) {}
  try {
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase()
    if (SUPPORTED.includes(nav)) return nav
  } catch (e) {}
  return 'en'
}

// Schimbă limba global (toate paginile care folosesc useLanguage se actualizează)
export function setLanguage(code) {
  if (!SUPPORTED.includes(code)) return
  try { localStorage.setItem(STORAGE_KEY, code) } catch (e) {}
  if (typeof window !== 'undefined') {
    document.documentElement.lang = code
    window.dispatchEvent(new Event('app-language-change'))
  }
}

// Hook React: const [lang, changeLanguage] = useLanguage()
export function useLanguage() {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    setLang(getLanguage())
    const handler = () => setLang(getLanguage())
    window.addEventListener('app-language-change', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('app-language-change', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const change = useCallback((code) => { setLanguage(code) }, [])

  return [lang, change]
}