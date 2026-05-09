"use client"

import { useState, useEffect } from "react"
import { getDailyThought } from "../../../lib/dailyThoughts"

const LABELS = {
  en: { tag: "Daily Thought", reflect: "Reflect on this today", micro: "Take three deep breaths. Notice where this lands in your body." },
  ro: { tag: "Gandul Zilei", reflect: "Reflecteaza asupra asta azi", micro: "Ia trei respiratii adanci. Observa unde se aseaza asta in corpul tau." },
  es: { tag: "Pensamiento del Dia", reflect: "Reflexiona sobre esto hoy" },
  fr: { tag: "Pensee du Jour", reflect: "Reflechis a cela aujourd'hui" },
  de: { tag: "Gedanke des Tages", reflect: "Denke heute darueber nach" },
  it: { tag: "Pensiero del Giorno", reflect: "Rifletti su questo oggi" },
  pt: { tag: "Pensamento do Dia", reflect: "Reflita sobre isto hoje" },
  nl: { tag: "Gedachte van de Dag", reflect: "Denk hier vandaag over na" },
  pl: { tag: "Mysl Dnia", reflect: "Zastanow sie nad tym dzis" },
  hu: { tag: "A Nap Gondolata", reflect: "Gondolkodj el ezen ma" }
}

export default function DailyInsight() {
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
      const thought = getDailyThought(hdType, userLang)
      setInsight(thought)
    } catch (e) {
      console.error("Error loading daily thought:", e)
    }
  }, [])

  if (!insight) return null

  const t = LABELS[lang] || LABELS.en
  const dateLocale = lang === "en" ? "en-US" : lang

  const questionWords = (insight.question || "").split(/\s+/).filter(Boolean)

  return (
    <div style={s.card} className="anim-fade-in gradient-border-glow">
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
        <span style={s.tag} className="shimmer-overlay">{"✦"} {t.tag}</span>
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
      {t.micro && <p style={s.micro}>{t.micro}</p>}
    </div>
  )
}

const s = {
  card: { position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)", borderRadius: "var(--radius)", padding: "28px", marginBottom: "24px", border: "1px solid rgba(124,92,191,0.3)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  tag: { fontSize: "12px", fontWeight: "700", color: "var(--purple)", textTransform: "uppercase", letterSpacing: "1px", background: "rgba(124,92,191,0.15)", padding: "5px 12px", borderRadius: "20px" },
  date: { fontSize: "12px", color: "rgba(255,255,255,0.4)" },
  title: { fontSize: "22px", fontWeight: "600", color: "#fff", fontFamily: "Cormorant Garamond, serif", marginBottom: "12px" },
  body: { fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: "1.75", marginBottom: "20px" },
  questionBox: { background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "16px" },
  questionLabel: { fontSize: "11px", fontWeight: "700", color: "var(--orange)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
  micro: { fontSize: "13px", color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: "16px", fontStyle: "italic", lineHeight: "1.5" },
  question: { fontSize: "15px", color: "rgba(255,255,255,0.85)", lineHeight: "1.6", fontStyle: "italic" },
}
