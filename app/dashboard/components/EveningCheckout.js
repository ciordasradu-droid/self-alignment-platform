"use client"

import { useState, useEffect } from "react"

const LABELS = {
  en: { title: "How did today land?", subtitle: "Close the loop. One tap.", notice: "One thing I noticed about myself today", placeholder: "Optional -- one sentence", saved: "Saved. Rest well.", btn: "Save" },
  ro: { title: "Cum s-a asezat ziua de azi?", subtitle: "Inchide cercul. Un singur tap.", notice: "Un lucru pe care l-am observat despre mine azi", placeholder: "Optional -- o propozitie", saved: "Salvat. Odihna placuta.", btn: "Salveaza" }
}
const LEVELS = { en: ["Depleted", "Heavy", "Neutral", "Good", "Alive"], ro: ["Epuizat", "Greu", "Neutru", "Bine", "Viu"] }
const COLORS = ["#e24b4a", "var(--orange)", "var(--border)", "var(--green)", "var(--purple)"]

export default function EveningCheckout({ lang = "en", onSave }) {
  const [visible, setVisible] = useState(false)
  const [level, setLevel] = useState(null)
  const [note, setNote] = useState("")
  const [saved, setSaved] = useState(false)
  const t = LABELS[lang] || LABELS.en
  const levels = LEVELS[lang] || LEVELS.en

  useEffect(() => {
    const hour = new Date().getHours()
    const today = new Date().toISOString().split("T")[0]
    const alreadySaved = localStorage.getItem("evening_checkout_" + today)
    if (hour >= 18 && !alreadySaved) setVisible(true)
    if (alreadySaved) { setSaved(true); setVisible(true) }
  }, [])

  const handleSave = () => {
    if (level === null) return
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem("evening_checkout_" + today, JSON.stringify({ level, levelLabel: levels[level], note, date: today }))
    setSaved(true)
    if (onSave) onSave({ level, note })
  }

  if (!visible) return null
  if (saved) return (<div style={s.card}><p style={s.saved}>{t.saved}</p></div>)

  return (
    <div style={s.card}>
      <p style={s.title}>{t.title}</p>
      <p style={s.subtitle}>{t.subtitle}</p>
      <div style={s.levels}>{levels.map((lbl, i) => (
        <button key={i} onClick={() => setLevel(i)} style={{ ...s.levelBtn, background: level === i ? COLORS[i] : "var(--bg)", color: level === i ? "#fff" : "var(--text)", borderColor: level === i ? COLORS[i] : "var(--border)" }}>{lbl}</button>
      ))}</div>
      <p style={s.noticeLabel}>{t.notice}</p>
      <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.placeholder} style={s.input} maxLength={200} />
      <button onClick={handleSave} disabled={level === null} style={{ ...s.saveBtn, opacity: level === null ? 0.4 : 1, cursor: level === null ? "not-allowed" : "pointer" }}>{t.btn}</button>
    </div>
  )
}
const s = {
  card: { background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", borderRadius: "var(--radius)", border: "1px solid rgba(124,92,191,0.2)", padding: "24px", marginBottom: "24px" },
  title: { fontSize: "18px", fontWeight: "600", color: "#fff", fontFamily: "Cormorant Garamond, serif", marginBottom: "4px" },
  subtitle: { fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" },
  levels: { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
  levelBtn: { padding: "10px 16px", borderRadius: "20px", border: "1.5px solid", fontSize: "14px", cursor: "pointer", flex: "1", minWidth: "70px", textAlign: "center" },
  noticeLabel: { fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "8px" },
  input: { width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box" },
  saveBtn: { width: "100%", padding: "14px", background: "var(--purple)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "500" },
  saved: { fontSize: "16px", color: "rgba(255,255,255,0.7)", textAlign: "center", padding: "8px 0" }
}