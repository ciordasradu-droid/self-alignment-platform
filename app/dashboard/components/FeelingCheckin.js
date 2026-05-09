"use client"

import { useState } from "react"

const FEELINGS = {
  Generator: { en: ["Satisfied", "Frustrated", "Energized", "Depleted", "In flow", "Forcing", "Content", "Restless"], ro: ["Satisfacut", "Frustrat", "Energizat", "Epuizat", "In flux", "Fortez", "Multumit", "Nelinistit"] },
  "Manifesting Generator": { en: ["Excited", "Frustrated", "Fast", "Scattered", "Satisfied", "Stuck", "Alive", "Impatient"], ro: ["Entuziasmat", "Frustrat", "Rapid", "Imprastiat", "Satisfacut", "Blocat", "Viu", "Nerabdator"] },
  Manifestor: { en: ["Peaceful", "Angry", "Creative", "Blocked", "Independent", "Controlled", "Powerful", "Exhausted"], ro: ["Pasnic", "Furios", "Creativ", "Blocat", "Independent", "Controlat", "Puternic", "Epuizat"] },
  Projector: { en: ["Recognized", "Bitter", "Clear", "Foggy", "Rested", "Drained", "Seen", "Invisible"], ro: ["Recunoscut", "Amarat", "Clar", "Incetos", "Odihnit", "Epuizat", "Vazut", "Invizibil"] },
  Reflector: { en: ["Surprised", "Overwhelmed", "Open", "Absorbing", "Grounded", "Lost", "Curious", "Numb"], ro: ["Surprins", "Coplesit", "Deschis", "Absorb", "Ancorat", "Pierdut", "Curios", "Amorteala"] }
}

// 8 universal icons mapped to emotion-position (0..7).
// Even positions = positive states, odd = challenging — visual valence carries across HD types.
const FEELING_ICONS = ["🌿", "🌋", "⚡", "🌫️", "🌊", "🔥", "🌸", "🌙"]

const LABELS = {
  en: {
    title: "Right now, I feel...",
    subtitle: "One tap. No wrong answer.",
    micro: "That's valid. Notice it."
  },
  ro: {
    title: "Acum, ma simt...",
    subtitle: "Un singur tap. Niciun raspuns gresit.",
    micro: "Asta e valid. Observă-l."
  }
}

export default function FeelingCheckin({ lang = "en", hdType = "Generator", onSelect }) {
  const t = LABELS[lang] || LABELS.en
  const feelings = FEELINGS[hdType] || FEELINGS.Generator
  const options = feelings[lang] || feelings.en
  const [selectedIdx, setSelectedIdx] = useState(null)

  const handleSelect = (i) => {
    setSelectedIdx(i)
    if (onSelect) onSelect(options[i])
  }

  if (selectedIdx !== null) {
    return (
      <div style={s.card} className="anim-scale-in">
        <div className="feeling-done-wrap">
          <div className={`feeling-done-circle feeling-bg-${selectedIdx} anim-bounce-subtle`}>
            <span>{FEELING_ICONS[selectedIdx]}</span>
          </div>
          <p className="feeling-done-name">{options[selectedIdx]}</p>
          <p className="feeling-done-message">{t.micro}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={s.card} className="anim-fade-in">
      <p style={s.title}>{t.title}</p>
      <p style={s.subtitle}>{t.subtitle}</p>
      <div className="feeling-grid">
        {options.map((f, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            className="feeling-card"
            aria-label={f}
          >
            <div className={`feeling-circle feeling-bg-${i}`}>
              <span aria-hidden="true">{FEELING_ICONS[i]}</span>
            </div>
            <span className="feeling-label">{f}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const s = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "24px", marginBottom: "24px", boxShadow: "var(--shadow)" },
  title: { fontSize: "18px", fontWeight: "600", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" },
}
