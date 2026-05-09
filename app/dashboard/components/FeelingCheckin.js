"use client"

import { useState } from "react"

const FEELINGS = {
  Generator: { en: ["Satisfied", "Frustrated", "Energized", "Depleted", "In flow", "Forcing", "Content", "Restless"], ro: ["Satisfacut", "Frustrat", "Energizat", "Epuizat", "In flux", "Fortez", "Multumit", "Nelinistit"] },
  "Manifesting Generator": { en: ["Excited", "Frustrated", "Fast", "Scattered", "Satisfied", "Stuck", "Alive", "Impatient"], ro: ["Entuziasmat", "Frustrat", "Rapid", "Imprastiat", "Satisfacut", "Blocat", "Viu", "Nerabdator"] },
  Manifestor: { en: ["Peaceful", "Angry", "Creative", "Blocked", "Independent", "Controlled", "Powerful", "Exhausted"], ro: ["Pasnic", "Furios", "Creativ", "Blocat", "Independent", "Controlat", "Puternic", "Epuizat"] },
  Projector: { en: ["Recognized", "Bitter", "Clear", "Foggy", "Rested", "Drained", "Seen", "Invisible"], ro: ["Recunoscut", "Amarat", "Clar", "Incetos", "Odihnit", "Epuizat", "Vazut", "Invizibil"] },
  Reflector: { en: ["Surprised", "Overwhelmed", "Open", "Absorbing", "Grounded", "Lost", "Curious", "Numb"], ro: ["Surprins", "Coplesit", "Deschis", "Absorb", "Ancorat", "Pierdut", "Curios", "Amorteala"] }
}
const LABELS = {
  en: { title: "Right now, I feel...", subtitle: "One tap. No wrong answer." },
  ro: { title: "Acum, ma simt...", subtitle: "Un singur tap. Niciun raspuns gresit." }
}
export default function FeelingCheckin({ lang = "en", hdType = "Generator", onSelect }) {
  const t = LABELS[lang] || LABELS.en
  const feelings = FEELINGS[hdType] || FEELINGS.Generator
  const options = feelings[lang] || feelings.en
  const [selected, setSelected] = useState(null)
  const handleSelect = (f) => { setSelected(f); if (onSelect) onSelect(f) }
  if (selected) return (
    <div style={s.card} className="anim-scale-in">
      <p style={s.done} className="anim-bounce-subtle">{selected}</p>
    </div>
  )
  return (
    <div style={s.card} className="anim-fade-in">
      <p style={s.title}>{t.title}</p>
      <p style={s.subtitle}>{t.subtitle}</p>
      <div style={s.grid}>
        {options.map((f, i) => (
          <button key={i} onClick={() => handleSelect(f)} style={s.btn} className="feeling-btn">{f}</button>
        ))}
      </div>
    </div>
  )
}
const s = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "24px", marginBottom: "24px", boxShadow: "var(--shadow)" },
  title: { fontSize: "18px", fontWeight: "600", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" },
  grid: { display: "flex", flexWrap: "wrap", gap: "8px" },
  btn: { padding: "10px 18px", borderRadius: "20px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: "14px", cursor: "pointer" },
  done: { fontSize: "20px", fontWeight: "600", color: "var(--purple)", textAlign: "center", padding: "8px 0", fontFamily: "Cormorant Garamond, serif", textShadow: "0 0 18px rgba(124, 92, 191, 0.25)" }
}