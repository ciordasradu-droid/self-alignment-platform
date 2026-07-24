"use client"

// Destinație: app/dashboard/components/DailyInsight.js  (ÎNLOCUIEȘTE COMPLET)
// Singura schimbare: scos micro-textul confuz ("Ia trei respirații adânci.
// Observă unde se așază asta în corpul tău") — formulare care cerea decodare.
// Restul Gândului Zilei rămâne identic.

import { useState, useEffect } from "react"
import { getDailyThought } from "../../../lib/dailyThoughts"

const LABELS = {
  en: { tag: "Daily Thought" },
  ro: { tag: "Gandul Zilei" },
  es: { tag: "Pensamiento del Dia" },
  fr: { tag: "Pensee du Jour" },
  de: { tag: "Gedanke des Tages" },
  it: { tag: "Pensiero del Giorno" },
  pt: { tag: "Pensamento do Dia" },
  nl: { tag: "Gedachte van de Dag" },
  pl: { tag: "Mysl Dnia" },
  hu: { tag: "A Nap Gondolata" },
  ru: { tag: "Мысль Дня" }
}

// A9 (decizie inchisa 23.07): UN SINGUR format — max 2 propozitii + 1
// intrebare, fara titlu, fara "reflecteaza asupra asta". embedded=true
// scoate marginea de card proprie, pentru montare ca pas in ritualul de
// dimineata.
export default function DailyInsight({ embedded = false }) {
  const [insight, setInsight] = useState(null)
  const [lang, setLang] = useState("en")

  useEffect(() => {
    const stored = localStorage.getItem("profile")
    if (!stored) return
    try {
      const profile = JSON.parse(stored)
      const hdType = profile.hd_data?.type || "Generator"
      const userLang = profile.language || "en"
      setLang(userLang)

      // fallback imediat, din banca statică — niciodată ecran gol cât timp
      // generarea reală răspunde (sau eșuează: cheie lipsă, rețea, etc.)
      setInsight(getDailyThought(hdType, userLang))

      if (profile.date_of_birth) {
        fetch("/api/daily-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile,
            personal_year: profile.personal_year,
            language: userLang,
          }),
        })
          .then((r) => r.json())
          // A6: daca gandul personalizat s-a oprit (proba expirata, fara
          // abonament), server-ul intoarce insight:null — fallback-ul
          // static ramas pe ecran de la pasul de mai sus e exact corect.
          .then((d) => { if (d.success && d.insight) setInsight(d.insight) })
          .catch(() => {}) // fallback-ul static rămâne pe ecran
      }
    } catch (e) {
      console.error("Error loading daily thought:", e)
    }
  }, [])

  if (!insight) return null

  const t = LABELS[lang] || LABELS.en
  const dateLocale = lang === "en" ? "en-US" : lang
  const questionWords = (insight.question || "").split(/\s+/).filter(Boolean)

  return (
    <div style={{ ...s.card, ...(embedded ? s.embeddedCard : null) }} className="anim-fade-in gradient-border-glow">
      {/* Sacred geometry decoration */}
      <svg
        className="mandala-bg"
        style={{ top: "-40px", right: "-40px", width: "220px", height: "220px" }}
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <g fill="none" stroke="#fff" strokeWidth="0.6">
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="50" />
          <circle cx="100" cy="100" r="30" />
          {[0, 30, 60, 90, 120, 150].map((a) => (
            <line key={a} x1="100" y1="10" x2="100" y2="190" transform={`rotate(${a} 100 100)`} />
          ))}
          {[0, 60, 120].map((a) => (
            <polygon key={a} points="100,30 158,130 42,130" transform={`rotate(${a} 100 100)`} />
          ))}
        </g>
      </svg>

      <div style={s.header}>
        <span style={s.tag} className="shimmer-overlay">{t.tag}</span>
        <span style={s.date}>
          {new Date().toLocaleDateString(dateLocale, { weekday: "long", month: "long", day: "numeric" })}
        </span>
      </div>
      <p style={s.body}>{insight.body}</p>
      <div style={s.questionBox} className="question-accent-orange">
        <p style={s.question} aria-label={insight.question}>
          {"“"}
          {questionWords.map((w, i) => (
            <span
              key={i}
              className="typewriter-word"
              style={{ animationDelay: `${0.25 + i * 0.06}s` }}
            >
              {w}{i < questionWords.length - 1 ? " " : ""}
            </span>
          ))}
          {"”"}
        </p>
      </div>
    </div>
  )
}

const s = {
  card: { position: "relative", overflow: "hidden", background: "var(--surface)", backdropFilter: "blur(16px) saturate(120%)", borderRadius: "var(--radius)", padding: "28px", marginBottom: "24px", border: "1px solid var(--border)" },
  embeddedCard: { marginBottom: 0 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  tag: { fontSize: "12px", fontWeight: "700", color: "var(--purple)", textTransform: "uppercase", letterSpacing: "1px", background: "var(--gold-faint)", padding: "5px 12px", borderRadius: "20px", alignSelf: "flex-start" },
  date: { fontSize: "12px", color: "rgba(255,255,255,0.4)" },
  body: { fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: "1.75", marginBottom: "20px" },
  questionBox: { background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "16px" },
  question: { fontSize: "15px", color: "rgba(255,255,255,0.85)", lineHeight: "1.6", fontStyle: "italic" },
}