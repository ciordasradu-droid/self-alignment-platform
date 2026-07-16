"use client"

// Destinație: app/dashboard/components/EveningCheckin.js  (FIȘIER NOU)
// Cele 3 întrebări fixe din Prompt Master, fiecare cu spațiu liber de scris.
// Fără emoji, fără scor, fără cuvinte preselectate.
// Înlocuiește DailyCheckin + DailyIntention + EveningCheckout vechi.
// Salvează în DB (privat) prin /api/dashboard (coloana answers) — păstrează
// streak-ul și prezența care merg deja, dar fără scor (score: null).

import { useState, useEffect } from "react"
import { getUserId } from "../../../lib/userId"

const LABELS = {
  en: {
    tag: "This evening",
    subtitle: "Three questions. In your own words.",
    q_mirror: "What did you notice about yourself today?",
    q_gratitude: "What are you grateful for today?",
    q_intention: "What do you want to bring to tomorrow?",
    placeholder: "...",
    save: "Save",
    saving: "Saving...",
    saved: "You showed up for yourself today.",
    rest: "Rest well.",
  },
  ro: {
    tag: "Seara asta",
    subtitle: "Trei întrebări. În cuvintele tale.",
    q_mirror: "Ce ai observat la tine azi?",
    q_gratitude: "Pentru ce ești recunoscător azi?",
    q_intention: "Ce vrei să aduci mâine?",
    placeholder: "...",
    save: "Salvează",
    saving: "Se salvează...",
    saved: "Ai fost prezent pentru tine azi.",
    rest: "Odihnă plăcută.",
  },
  es: {
    tag: "Esta noche",
    subtitle: "Tres preguntas. Con tus propias palabras.",
    q_mirror: "¿Qué notaste en ti hoy?",
    q_gratitude: "¿Por qué estás agradecido hoy?",
    q_intention: "¿Qué quieres llevar a mañana?",
    placeholder: "...",
    save: "Guardar",
    saving: "Guardando...",
    saved: "Hoy estuviste presente para ti.",
    rest: "Descansa bien.",
  },
  fr: {
    tag: "Ce soir",
    subtitle: "Trois questions. Avec tes propres mots.",
    q_mirror: "Qu'as-tu remarqué chez toi aujourd'hui ?",
    q_gratitude: "De quoi es-tu reconnaissant aujourd'hui ?",
    q_intention: "Que veux-tu apporter à demain ?",
    placeholder: "...",
    save: "Enregistrer",
    saving: "Enregistrement...",
    saved: "Tu as été présent pour toi aujourd'hui.",
    rest: "Repose-toi bien.",
  },
  de: {
    tag: "Heute Abend",
    subtitle: "Drei Fragen. In deinen eigenen Worten.",
    q_mirror: "Was hast du heute an dir bemerkt?",
    q_gratitude: "Wofür bist du heute dankbar?",
    q_intention: "Was möchtest du in den morgigen Tag mitnehmen?",
    placeholder: "...",
    save: "Speichern",
    saving: "Speichern...",
    saved: "Du warst heute für dich da.",
    rest: "Ruh dich gut aus.",
  },
  it: {
    tag: "Stasera",
    subtitle: "Tre domande. Con parole tue.",
    q_mirror: "Cosa hai notato di te oggi?",
    q_gratitude: "Per cosa sei grato oggi?",
    q_intention: "Cosa vuoi portare a domani?",
    placeholder: "...",
    save: "Salva",
    saving: "Salvataggio...",
    saved: "Oggi sei stato presente per te.",
    rest: "Riposa bene.",
  },
  pt: {
    tag: "Esta noite",
    subtitle: "Três perguntas. Nas tuas próprias palavras.",
    q_mirror: "O que notaste em ti hoje?",
    q_gratitude: "Pelo que estás grato hoje?",
    q_intention: "O que queres levar para amanhã?",
    placeholder: "...",
    save: "Guardar",
    saving: "A guardar...",
    saved: "Hoje estiveste presente para ti.",
    rest: "Descansa bem.",
  },
  nl: {
    tag: "Vanavond",
    subtitle: "Drie vragen. In je eigen woorden.",
    q_mirror: "Wat viel je vandaag op aan jezelf?",
    q_gratitude: "Waar ben je vandaag dankbaar voor?",
    q_intention: "Wat wil je meenemen naar morgen?",
    placeholder: "...",
    save: "Opslaan",
    saving: "Opslaan...",
    saved: "Je was er vandaag voor jezelf.",
    rest: "Rust goed uit.",
  },
  pl: {
    tag: "Dziś wieczorem",
    subtitle: "Trzy pytania. Własnymi słowami.",
    q_mirror: "Co dziś zauważyłeś u siebie?",
    q_gratitude: "Za co jesteś dziś wdzięczny?",
    q_intention: "Co chcesz wnieść w jutro?",
    placeholder: "...",
    save: "Zapisz",
    saving: "Zapisywanie...",
    saved: "Dziś byłeś obecny dla siebie.",
    rest: "Odpocznij dobrze.",
  },
  hu: {
    tag: "Ma este",
    subtitle: "Három kérdés. A saját szavaiddal.",
    q_mirror: "Mit vettél észre ma magadon?",
    q_gratitude: "Miért vagy hálás ma?",
    q_intention: "Mit szeretnél átvinni a holnapba?",
    placeholder: "...",
    save: "Mentés",
    saving: "Mentés...",
    saved: "Ma jelen voltál önmagad számára.",
    rest: "Pihenj jól.",
  },
}

export default function EveningCheckin({ lang = "en", onComplete, checkinDone }) {
  const t = LABELS[lang] || LABELS.en
  const [mirror, setMirror] = useState("")
  const [gratitude, setGratitude] = useState("")
  const [intention, setIntention] = useState("")
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(checkinDone || false)

  useEffect(() => {
    if (checkinDone) setSubmitted(true)
  }, [checkinDone])

  const allFilled = mirror.trim() && gratitude.trim() && intention.trim()

  const handleSave = async () => {
    if (!allFilled || saving) return
    setSaving(true)
    const answers = {
      mirror: mirror.trim(),
      gratitude: gratitude.trim(),
      intention: intention.trim(),
    }
    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: getUserId(), score: 0, answers }),
      })
      const data = await res.json()
      setSubmitted(true)
      if (onComplete) onComplete(data)
    } catch (e) {
      setSubmitted(true)
      if (onComplete) onComplete(null)
    }
    setSaving(false)
  }

  if (submitted) {
    return (
      <div style={s.card}>
        <p style={s.tag}>{t.tag}</p>
        <p style={s.savedText}>{t.saved}</p>
        <p style={s.restText}>{t.rest}</p>
      </div>
    )
  }

  return (
    <div style={s.card} className="anim-fade-in">
      <p style={s.tag}>{t.tag}</p>
      <p style={s.subtitle}>{t.subtitle}</p>

      <div style={s.block}>
        <p style={s.q}>{t.q_mirror}</p>
        <textarea value={mirror} onChange={(e) => setMirror(e.target.value)} placeholder={t.placeholder} rows={2} style={s.textarea} />
      </div>

      <div style={s.block}>
        <p style={s.q}>{t.q_gratitude}</p>
        <textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder={t.placeholder} rows={2} style={s.textarea} />
      </div>

      <div style={s.block}>
        <p style={s.q}>{t.q_intention}</p>
        <textarea value={intention} onChange={(e) => setIntention(e.target.value)} placeholder={t.placeholder} rows={2} style={s.textarea} />
      </div>

      <button
        onClick={handleSave}
        disabled={!allFilled || saving}
        style={{ ...s.btn, opacity: allFilled ? 1 : 0.4, cursor: allFilled ? "pointer" : "not-allowed" }}
      >
        {saving ? t.saving : t.save}
      </button>
    </div>
  )
}

const s = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "28px", marginBottom: "24px", boxShadow: "var(--shadow)" },
  tag: { fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
  subtitle: { fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" },
  block: { marginBottom: "20px" },
  q: { fontSize: "17px", fontWeight: "500", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", lineHeight: "1.4", marginBottom: "10px" },
  textarea: { width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: "15px", lineHeight: "1.6", fontFamily: "Cormorant Garamond, serif", resize: "vertical", boxSizing: "border-box" },
  btn: { width: "100%", padding: "15px", background: "var(--purple)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "500", marginTop: "4px" },
  savedText: { fontSize: "18px", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", lineHeight: "1.4", marginBottom: "6px" },
  restText: { fontSize: "14px", color: "var(--text-muted)" },
}