// app/dashboard/components/ProgressiveUnlock.js
// Shows the full unlock roadmap and gates features based on account age
// User sees everything from day 1 with future stages marked
// Each unlock celebrated gently, not gamified

'use client'

import { useState, useEffect } from 'react'

const UNLOCK_STAGES = [
  { day: 0,  id: 'checkin',    icon: '◎', label: 'Daily Check-in',        description: 'Your daily mirror — 3 questions, less than 2 minutes.' },
  { day: 0,  id: 'insight',    icon: '✦', label: 'Daily Thought',         description: 'A reflection calibrated to your design, every morning.' },
  { day: 3,  id: 'journal',    icon: '📓', label: 'Free Journal',          description: 'A private space to write freely, with no prompts or structure.' },
  { day: 7,  id: 'plan',       icon: '🧭', label: 'Alignment Plan',        description: 'Your personalized roadmap — direction, structure, and anchors.' },
  { day: 14, id: 'patterns',   icon: '🔍', label: 'Patterns',             description: 'AI synthesis of your check-ins — what is emerging in your journey.' },
  { day: 30, id: 'review',     icon: '🪞', label: 'Weekly Review',         description: 'A deeper weekly reflection with AI-powered insights.' },
  { day: 60, id: 'commitment', icon: '📜', label: 'Commitment With Yourself', description: 'A personal document you write, print, and sign by hand.' },
  { day: 90, id: 'circle',     icon: '⭕', label: 'The Circle',            description: '4 people, compatible by design. Shared presence, not therapy.' },
]

// Translations for unlock stage labels
const UNLOCK_TRANSLATIONS = {
  en: { opens_after: 'Opens after', days: 'days', unlocked: 'Unlocked', new: 'New', your_path: 'Your Path', path_subtitle: 'Everything unlocks with time and consistency. You can see the full map — each step opens when you are ready.' },
  ro: { opens_after: 'Se deschide după', days: 'zile', unlocked: 'Deblocat', new: 'Nou', your_path: 'Drumul Tău', path_subtitle: 'Totul se deblochează cu timp și consecvență. Poți vedea harta completă — fiecare pas se deschide când ești pregătit.' },
  es: { opens_after: 'Se abre después de', days: 'días', unlocked: 'Desbloqueado', new: 'Nuevo', your_path: 'Tu Camino', path_subtitle: 'Todo se desbloquea con tiempo y consistencia. Puedes ver el mapa completo.' },
  fr: { opens_after: 'S\'ouvre après', days: 'jours', unlocked: 'Débloqué', new: 'Nouveau', your_path: 'Ton Chemin', path_subtitle: 'Tout se débloque avec le temps et la constance. Tu peux voir la carte complète.' },
  de: { opens_after: 'Öffnet sich nach', days: 'Tagen', unlocked: 'Freigeschaltet', new: 'Neu', your_path: 'Dein Weg', path_subtitle: 'Alles wird mit Zeit und Beständigkeit freigeschaltet. Du kannst die vollständige Karte sehen.' },
  it: { opens_after: 'Si apre dopo', days: 'giorni', unlocked: 'Sbloccato', new: 'Nuovo', your_path: 'Il Tuo Percorso', path_subtitle: 'Tutto si sblocca con tempo e costanza. Puoi vedere la mappa completa.' },
  pt: { opens_after: 'Abre após', days: 'dias', unlocked: 'Desbloqueado', new: 'Novo', your_path: 'O Teu Caminho', path_subtitle: 'Tudo se desbloqueia com tempo e consistência. Podes ver o mapa completo.' },
  nl: { opens_after: 'Opent na', days: 'dagen', unlocked: 'Ontgrendeld', new: 'Nieuw', your_path: 'Jouw Pad', path_subtitle: 'Alles wordt ontgrendeld met tijd en consistentie. Je kunt de volledige kaart zien.' },
  pl: { opens_after: 'Otwiera się po', days: 'dniach', unlocked: 'Odblokowane', new: 'Nowe', your_path: 'Twoja Ścieżka', path_subtitle: 'Wszystko odblokowuje się z czasem i konsekwencją. Możesz zobaczyć pełną mapę.' },
  hu: { opens_after: 'Megnyílik', days: 'nap után', unlocked: 'Feloldva', new: 'Új', your_path: 'Az Utad', path_subtitle: 'Minden idővel és következetességgel oldódik fel. Láthatod a teljes térképet.' },
}

export function getAccountAgeDays() {
  try {
    const stored = localStorage.getItem('profile')
    if (!stored) return 0
    const profile = JSON.parse(stored)

    // Use interpreted_profile_id creation as account start
    // If no explicit start date, estimate from streak data or default to 0
    const startDate = localStorage.getItem('account_start_date')
    if (startDate) {
      const start = new Date(startDate)
      const now = new Date()
      return Math.floor((now - start) / 86400000)
    }

    // First time: set today as start
    localStorage.setItem('account_start_date', new Date().toISOString().split('T')[0])
    return 0
  } catch (e) {
    return 0
  }
}

export function isFeatureUnlocked(featureId, accountAgeDays) {
  const stage = UNLOCK_STAGES.find(s => s.id === featureId)
  if (!stage) return true // unknown features are always available
  return accountAgeDays >= stage.day
}

export default function ProgressiveUnlock({ lang = 'en' }) {
  const [accountAge, setAccountAge] = useState(0)
  const [justUnlocked, setJustUnlocked] = useState(null)

  const t = UNLOCK_TRANSLATIONS[lang] || UNLOCK_TRANSLATIONS['en']

  useEffect(() => {
    const age = getAccountAgeDays()
    setAccountAge(age)

    // Check if something just unlocked (within last 24h)
    const lastCheck = localStorage.getItem('last_unlock_check_day')
    const today = new Date().toISOString().split('T')[0]

    if (lastCheck !== today) {
      localStorage.setItem('last_unlock_check_day', today)
      const newlyUnlocked = UNLOCK_STAGES.find(s => s.day === age && s.day > 0)
      if (newlyUnlocked) {
        setJustUnlocked(newlyUnlocked)
        // Auto-dismiss after 8 seconds
        setTimeout(() => setJustUnlocked(null), 8000)
      }
    }
  }, [])

  return (
    <div style={s.card}>
      {/* Celebration banner for newly unlocked feature */}
      {justUnlocked && (
        <div style={s.celebration}>
          <p style={s.celebrationIcon}>{justUnlocked.icon}</p>
          <p style={s.celebrationTitle}>{justUnlocked.label}</p>
          <p style={s.celebrationText}>{justUnlocked.description}</p>
          <span style={s.celebrationBadge}>{t.new}</span>
        </div>
      )}

      <div style={s.header}>
        <h3 style={s.title}>{t.your_path}</h3>
        <p style={s.subtitle}>{t.path_subtitle}</p>
      </div>

      <div style={s.timeline}>
        {UNLOCK_STAGES.map((stage, i) => {
          const unlocked = accountAge >= stage.day
          const isNew = accountAge === stage.day && stage.day > 0
          const isLast = i === UNLOCK_STAGES.length - 1

          return (
            <div key={stage.id} style={s.stageRow}>
              {/* Timeline line */}
              <div style={s.timelineCol}>
                <div style={{
                  ...s.dot,
                  background: unlocked ? 'var(--purple)' : 'var(--border)',
                  border: isNew ? '2px solid var(--orange)' : '2px solid transparent',
                }} />
                {!isLast && (
                  <div style={{
                    ...s.line,
                    background: unlocked ? 'var(--purple)' : 'var(--border)',
                  }} />
                )}
              </div>

              {/* Stage content */}
              <div style={{
                ...s.stageContent,
                opacity: unlocked ? 1 : 0.5,
              }}>
                <div style={s.stageHeader}>
                  <span style={s.stageIcon}>{stage.icon}</span>
                  <span style={s.stageLabel}>{stage.label}</span>
                  {isNew && <span style={s.newBadge}>{t.new}</span>}
                </div>
                <p style={s.stageDesc}>{stage.description}</p>
                {!unlocked && (
                  <p style={s.lockText}>
                    {t.opens_after} {stage.day} {t.days}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const s = {
  card: { background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '28px', marginBottom: '24px', boxShadow: 'var(--shadow)' },

  // Celebration
  celebration: { background: 'linear-gradient(135deg, var(--purple-light) 0%, var(--green-light) 100%)', borderRadius: '12px', padding: '24px', marginBottom: '24px', textAlign: 'center', position: 'relative' },
  celebrationIcon: { fontSize: '32px', marginBottom: '8px' },
  celebrationTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '6px' },
  celebrationText: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' },
  celebrationBadge: { position: 'absolute', top: '12px', right: '12px', background: 'var(--orange)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' },

  // Header
  header: { marginBottom: '24px' },
  title: { fontSize: '20px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '6px' },
  subtitle: { fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' },

  // Timeline
  timeline: {},
  stageRow: { display: 'flex', gap: '16px', minHeight: '56px' },
  timelineCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 },
  dot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
  line: { width: '2px', flex: 1, marginTop: '4px', marginBottom: '4px' },

  // Stage content
  stageContent: { flex: 1, paddingBottom: '16px' },
  stageHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  stageIcon: { fontSize: '16px' },
  stageLabel: { fontSize: '15px', fontWeight: '600', color: 'var(--text)' },
  newBadge: { background: 'var(--orange)', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  stageDesc: { fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' },
  lockText: { fontSize: '12px', color: 'var(--text-light)', marginTop: '4px', fontStyle: 'italic' },
}