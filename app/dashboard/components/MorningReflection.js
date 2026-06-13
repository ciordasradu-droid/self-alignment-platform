"use client"

// Destinație: app/dashboard/components/MorningReflection.js  (FIȘIER NOU)
// Reflecția de dimineață: un singur câmp liber de scris pe starea cu care
// te trezești. Fără emoji, fără cuvinte preselectate, fără scor.
// Se salvează în DB (privat) prin /api/reflection ca să alimenteze Weekly Review.

import { useState, useEffect } from "react"
import { getUserId } from "../../../lib/userId"

const LABELS = {
  en: { tag: "This morning", prompt: "What state are you waking up in?", placeholder: "in your own words...", save: "Save", saving: "Saving...", saved: "Noted. Carry it gently into the day." },
  ro: { tag: "Dimineața asta", prompt: "Cu ce stare te trezești?", placeholder: "în cuvintele tale...", save: "Salvează", saving: "Se salvează...", saved: "Notat. Poartă-o ușor în zi." },
  es: { tag: "Esta mañana", prompt: "¿Con qué estado te despiertas?", placeholder: "en tus propias palabras...", save: "Guardar", saving: "Guardando...", saved: "Anotado. Llévalo con calma al día." },
  fr: { tag: "Ce matin", prompt: "Dans quel état te réveilles-tu ?", placeholder: "avec tes propres mots...", save: "Enregistrer", saving: "Enregistrement...", saved: "Noté. Porte-le doucement dans ta journée." },
  de: { tag: "Heute Morgen", prompt: "In welchem Zustand wachst du auf?", placeholder: "in deinen eigenen Worten...", save: "Speichern", saving: "Speichern...", saved: "Notiert. Nimm es sanft mit in den Tag." },
  it: { tag: "Stamattina", prompt: "In che stato ti svegli?", placeholder: "con parole tue...", save: "Salva", saving: "Salvataggio...", saved: "Annotato. Portalo con calma nella giornata." },
  pt: { tag: "Esta manhã", prompt: "Em que estado acordas?", placeholder: "nas tuas próprias palavras...", save: "Guardar", saving: "A guardar...", saved: "Anotado. Leva-o com calma para o dia." },
  nl: { tag: "Vanochtend", prompt: "In welke staat word je wakker?", placeholder: "in je eigen woorden...", save: "Opslaan", saving: "Opslaan...", saved: "Genoteerd. Draag het rustig de dag in." },
  pl: { tag: "Dziś rano", prompt: "W jakim stanie się budzisz?", placeholder: "własnymi słowami...", save: "Zapisz", saving: "Zapisywanie...", saved: "Zapisane. Wnieś to spokojnie w dzień." },
  hu: { tag: "Ma reggel", prompt: "Milyen állapotban ébredsz?", placeholder: "a saját szavaiddal...", save: "Mentés", saving: "Mentés...", saved: "Feljegyezve. Vidd magaddal csendben a napba." },
}

export default function MorningReflection({ lang = "en" }) {
  const [text, setText] = useState("")
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const t = LABELS[lang] || LABELS.en

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    if (localStorage.getItem("morning_reflection_" + today)) setSaved(true)
  }, [])

  const handleSave = async () => {
    if (!text.trim()) return
    setSaving(true)
    const today = new Date().toISOString().split("T")[0]
    try {
      await fetch("/api/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: getUserId(), kind: "morning", text: text.trim() })
      })
    } catch (e) {
      // chiar dacă rețeaua pică, reflecția rămâne salvată local pentru user
    }
    try {
      localStorage.setItem("morning_reflection_" + today, JSON.stringify({ text: text.trim(), date: today }))
    } catch (e) {}
    setSaving(false)
    setSaved(true)
  }

  if (saved) {
    return (
      <div style={s.card}>
        <p style={s.tag}>{t.tag}</p>
        <p style={s.savedText}>{t.saved}</p>
      </div>
    )
  }

  return (
    <div style={s.card} className="anim-fade-in">
      <p style={s.tag}>{t.tag}</p>
      <p style={s.prompt}>{t.prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.placeholder}
        rows={3}
        style={s.textarea}
      />
      <button
        onClick={handleSave}
        disabled={!text.trim() || saving}
        style={{ ...s.btn, opacity: text.trim() ? 1 : 0.4, cursor: text.trim() ? "pointer" : "not-allowed" }}
      >
        {saving ? t.saving : t.save}
      </button>
    </div>
  )
}

const s = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "24px", marginBottom: "24px", boxShadow: "var(--shadow)" },
  tag: { fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" },
  prompt: { fontSize: "19px", fontWeight: "500", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", lineHeight: "1.4", marginBottom: "16px" },
  textarea: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: "15px", lineHeight: "1.6", fontFamily: "Cormorant Garamond, serif", resize: "vertical", boxSizing: "border-box", marginBottom: "16px" },
  btn: { width: "100%", padding: "14px", background: "var(--purple)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "500" },
  savedText: { fontSize: "16px", color: "var(--text-muted)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", lineHeight: "1.5" },
}