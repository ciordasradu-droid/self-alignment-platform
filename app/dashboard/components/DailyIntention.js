"use client"

import { useState } from "react"

const INTENTIONS = {
  Generator: { en: ["Today I choose to respond, not push", "Today I follow what lights me up", "Today I honor my energy above obligations", "Today I notice my gut before my mind", "Today I let satisfaction guide me"], ro: ["Azi aleg sa raspund, nu sa fortez", "Azi urmez ce ma aprinde", "Azi imi onorez energia deasupra obligatiilor", "Azi observ instinctul inainte de minte", "Azi las satisfactia sa ma ghideze"] },
  "Manifesting Generator": { en: ["Today I follow my excitement without guilt", "Today I inform before I pivot", "Today I trust my speed", "Today I honor all my interests", "Today I let go of what lost its spark"], ro: ["Azi imi urmez entuziasmul fara vinovatie", "Azi informez inainte sa schimb directia", "Azi am incredere in viteza mea", "Azi imi onorez toate interesele", "Azi eliberez ce si-a pierdut scanteia"] },
  Manifestor: { en: ["Today I initiate from peace, not anger", "Today I inform those around me", "Today I rest without guilt", "Today I honor my creative urges", "Today I lead with vision"], ro: ["Azi initiez din pace, nu din furie", "Azi informez pe cei din jur", "Azi ma odihnesc fara vinovatie", "Azi imi onorez impulsurile creative", "Azi conduc cu viziune"] },
  Projector: { en: ["Today I wait for the invitation", "Today I rest before I guide", "Today I value my own wisdom", "Today I choose depth over breadth", "Today I let recognition come to me"], ro: ["Azi astept invitatia", "Azi ma odihnesc inainte sa ghidez", "Azi imi pretuiesc propria intelepciune", "Azi aleg profunzimea in loc de suprafata", "Azi las recunoasterea sa vina la mine"] },
  Reflector: { en: ["Today I choose my environment wisely", "Today I give myself time", "Today I notice what is mine and what is not", "Today I stay open to surprise", "Today I reflect without absorbing"], ro: ["Azi imi aleg mediul cu intelepciune", "Azi imi acord timp", "Azi observ ce e al meu si ce nu", "Azi raman deschis la surprize", "Azi reflectez fara sa absorb"] }
}
const LABELS = {
  en: { title: "Set your intention", subtitle: "A state, not a goal. Choose one.", done: "Your intention is set." },
  ro: { title: "Seteaza-ti intentia", subtitle: "O stare, nu un obiectiv. Alege una.", done: "Intentia ta e setata." }
}
export default function DailyIntention({ lang = "en", hdType = "Generator", onSelect }) {
  const t = LABELS[lang] || LABELS.en
  const options = (INTENTIONS[hdType] || INTENTIONS.Generator)[lang] || (INTENTIONS[hdType] || INTENTIONS.Generator).en
  const [selected, setSelected] = useState(null)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const startIdx = dayOfYear % options.length
  const rotated = [...options.slice(startIdx), ...options.slice(0, startIdx)].slice(0, 3)
  const handleSelect = (i) => { setSelected(i); if (onSelect) onSelect(i) }
  if (selected) return (
    <div style={s.card} className="anim-scale-in">
      <p style={s.doneLabel}>{t.done}</p>
      <p style={s.doneText}>{selected}</p>
    </div>
  )
  return (
    <div style={s.card} className="anim-fade-in">
      <p style={s.title}>{t.title}</p>
      <p style={s.subtitle}>{t.subtitle}</p>
      <div style={s.options}>
        {rotated.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(opt)} style={s.optBtn} className="intention-btn">{opt}</button>
        ))}
      </div>
    </div>
  )
}
const s = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "24px", marginBottom: "24px", boxShadow: "var(--shadow)" },
  title: { fontSize: "18px", fontWeight: "600", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" },
  options: { display: "flex", flexDirection: "column", gap: "10px" },
  optBtn: { padding: "14px 20px", paddingLeft: "22px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: "15px", textAlign: "left", cursor: "pointer", lineHeight: "1.4" },
  doneLabel: { fontSize: "12px", color: "var(--purple)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700", marginBottom: "10px", textAlign: "center" },
  doneText: { fontSize: "20px", color: "var(--text)", textAlign: "center", fontStyle: "italic", fontFamily: "Cormorant Garamond, serif", lineHeight: "1.5", padding: "8px 12px", textShadow: "0 0 24px rgba(124, 92, 191, 0.18)" }
}