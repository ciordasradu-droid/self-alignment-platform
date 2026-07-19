"use client"

// Destinație: app/dashboard/components/DailyInsight.js  (ÎNLOCUIEȘTE COMPLET)
// Singura schimbare: scos micro-textul confuz ("Ia trei respirații adânci.
// Observă unde se așază asta în corpul tău") — formulare care cerea decodare.
// Restul Gândului Zilei rămâne identic.

import { useState, useEffect } from "react"
import { getDailyThought, getDailyThoughtFormat } from "../../../lib/dailyThoughts"

const LABELS = {
  en: { tag: "Daily Thought", reflect: "Reflect on this today" },
  ro: { tag: "Gandul Zilei", reflect: "Reflecteaza asupra asta azi" },
  es: { tag: "Pensamiento del Dia", reflect: "Reflexiona sobre esto hoy" },
  fr: { tag: "Pensee du Jour", reflect: "Reflechis a cela aujourd'hui" },
  de: { tag: "Gedanke des Tages", reflect: "Denke heute darueber nach" },
  it: { tag: "Pensiero del Giorno", reflect: "Rifletti su questo oggi" },
  pt: { tag: "Pensamento do Dia", reflect: "Reflita sobre isto hoje" },
  nl: { tag: "Gedachte van de Dag", reflect: "Denk hier vandaag over na" },
  pl: { tag: "Mysl Dnia", reflect: "Zastanow sie nad tym dzis" },
  hu: { tag: "A Nap Gondolata", reflect: "Gondolkodj el ezen ma" }
}

// Ambele formate (sect. 5) vin din aceeași bancă de conținut — 'quick' arată
// doar întrebarea, fără titlu/corp/geometrie. embedded=true scoate marginea
// de card proprie, pentru montare ca pas în ritualul de dimineață.
export default function DailyInsight({ embedded = false }) {
  const [insight, setInsight] = useState(null)
  const [lang, setLang] = useState("en")
  const [format, setFormat] = useState("full")

  useEffect(() => {
    const stored = localStorage.getItem("profile")
    if (!stored) return
    try {
      const profile = JSON.parse(stored)
      const hdType = profile.hd_data?.type || "Generator"
      const userLang = profile.language || "en"
      const dayFormat = getDailyThoughtFormat()
      setLang(userLang)
      setFormat(dayFormat)

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
            format: dayFormat,
            language: userLang,
          }),
        })
          .then((r) => r.json())
          .then((d) => { if (d.success) setInsight(d.insight) })
          .catch(() => {}) // fallback-ul static rămâne pe ecran
      }
    } catch (e) {
      console.error("Error loading daily thought:", e)
    }
  }, [])

  if (!insight) return null

  const t = LABELS[lang] || LABELS.en
  const dateLocale = lang === "en" ? "en-US" : lang

  if (format === "quick") {
    return (
      <div style={{ ...s.card, ...s.quickCard, ...(embedded ? s.embeddedCard : null) }} className="anim-fade-in">
        <span style={s.tag} className="shimmer-overlay">{t.tag}</span>
        <p style={s.quickQuestion}>{insight.question}</p>
      </div>
    )
  }

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
      <h3 style={s.title}>{insight.title}</h3>
      <p style={s.body}>{insight.body}</p>
      <div style={s.questionBox} className="question-accent-orange">
        <p style={s.questionLabel}>{t.reflect}</p>
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
  quickCard: { padding: "24px", display: "flex", flexDirection: "column", gap: "14px" },
  quickQuestion: { fontSize: "18px", color: "var(--text)", lineHeight: "1.6", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  tag: { fontSize: "12px", fontWeight: "700", color: "var(--purple)", textTransform: "uppercase", letterSpacing: "1px", background: "var(--gold-faint)", padding: "5px 12px", borderRadius: "20px", alignSelf: "flex-start" },
  date: { fontSize: "12px", color: "rgba(255,255,255,0.4)" },
  title: { fontSize: "22px", fontWeight: "600", color: "#fff", fontFamily: "Cormorant Garamond, serif", marginBottom: "12px" },
  body: { fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: "1.75", marginBottom: "20px" },
  questionBox: { background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "16px" },
  questionLabel: { fontSize: "11px", fontWeight: "700", color: "var(--orange)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
  question: { fontSize: "15px", color: "rgba(255,255,255,0.85)", lineHeight: "1.6", fontStyle: "italic" },
}