"use client"

import { useState, useEffect } from "react"
import { getDailyCheckinQuestions } from "../../../lib/checkinQuestions"

const LABELS = {
  en: {
    title: "Daily Check-in",
    subtitle: "3 questions. Less than 2 minutes.",
    mirroring: "mirroring",
    gratitude: "gratitude",
    intention: "intention",
    submit: "Submit Check-in",
    saving: "Saving...",
    done: "Check-in complete.",
    tomorrow: "Come back tomorrow.",
    anchor_low: "Not at all",
    anchor_high: "Completely"
  },
  ro: {
    title: "Check-in Zilnic",
    subtitle: "3 întrebări. Mai puțin de 2 minute.",
    mirroring: "oglindire",
    gratitude: "recunoștință",
    intention: "intenție",
    submit: "Trimite Check-in",
    saving: "Se salvează...",
    done: "Check-in complet.",
    tomorrow: "Revino mâine.",
    anchor_low: "Deloc",
    anchor_high: "Total"
  },
  es: {
    title: "Check-in Diario",
    subtitle: "3 preguntas. Menos de 2 minutos.",
    mirroring: "reflejo",
    gratitude: "gratitud",
    intention: "intención",
    submit: "Enviar Check-in",
    saving: "Guardando...",
    done: "Check-in completado.",
    tomorrow: "Vuelve mañana.",
    anchor_low: "Para nada",
    anchor_high: "Completamente"
  },
  fr: {
    title: "Check-in Quotidien",
    subtitle: "3 questions. Moins de 2 minutes.",
    mirroring: "miroir",
    gratitude: "gratitude",
    intention: "intention",
    submit: "Envoyer le Check-in",
    saving: "Enregistrement...",
    done: "Check-in terminé.",
    tomorrow: "Reviens demain.",
    anchor_low: "Pas du tout",
    anchor_high: "Totalement"
  },
  de: {
    title: "Täglicher Check-in",
    subtitle: "3 Fragen. Weniger als 2 Minuten.",
    mirroring: "Spiegelung",
    gratitude: "Dankbarkeit",
    intention: "Absicht",
    submit: "Check-in absenden",
    saving: "Speichern...",
    done: "Check-in abgeschlossen.",
    tomorrow: "Komm morgen wieder.",
    anchor_low: "Gar nicht",
    anchor_high: "Vollständig"
  },
  it: {
    title: "Check-in Giornaliero",
    subtitle: "3 domande. Meno di 2 minuti.",
    mirroring: "specchio",
    gratitude: "gratitudine",
    intention: "intenzione",
    submit: "Invia Check-in",
    saving: "Salvataggio...",
    done: "Check-in completato.",
    tomorrow: "Torna domani.",
    anchor_low: "Per niente",
    anchor_high: "Completamente"
  },
  pt: {
    title: "Check-in Diário",
    subtitle: "3 perguntas. Menos de 2 minutos.",
    mirroring: "espelho",
    gratitude: "gratidão",
    intention: "intenção",
    submit: "Enviar Check-in",
    saving: "A guardar...",
    done: "Check-in completo.",
    tomorrow: "Volta amanhã.",
    anchor_low: "De modo algum",
    anchor_high: "Completamente"
  },
  nl: {
    title: "Dagelijkse Check-in",
    subtitle: "3 vragen. Minder dan 2 minuten.",
    mirroring: "spiegel",
    gratitude: "dankbaarheid",
    intention: "intentie",
    submit: "Check-in versturen",
    saving: "Opslaan...",
    done: "Check-in voltooid.",
    tomorrow: "Kom morgen terug.",
    anchor_low: "Helemaal niet",
    anchor_high: "Volledig"
  },
  pl: {
    title: "Codzienny Check-in",
    subtitle: "3 pytania. Mniej niż 2 minuty.",
    mirroring: "lustro",
    gratitude: "wdzięczność",
    intention: "intencja",
    submit: "Wyślij Check-in",
    saving: "Zapisywanie...",
    done: "Check-in ukończony.",
    tomorrow: "Wróć jutro.",
    anchor_low: "Wcale nie",
    anchor_high: "Całkowicie"
  },
  hu: {
    title: "Napi Check-in",
    subtitle: "3 kérdés. Kevesebb mint 2 perc.",
    mirroring: "tükör",
    gratitude: "hála",
    intention: "szándék",
    submit: "Check-in küldése",
    saving: "Mentés...",
    done: "Check-in kész.",
    tomorrow: "Gyere vissza holnap.",
    anchor_low: "Egyáltalán nem",
    anchor_high: "Teljesen"
  }
}

export default function DailyCheckin({ onComplete, checkinDone }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(checkinDone)
  const [lang, setLang] = useState("en")

  useEffect(() => {
    const stored = localStorage.getItem("profile")
    let hdType = "Generator"
    let userLang = "en"

    if (stored) {
      try {
        const profile = JSON.parse(stored)
        hdType = profile.hd_data?.type || "Generator"
        userLang = profile.language || "en"
      } catch (e) {
        console.error("Error parsing profile:", e)
      }
    }

    setLang(userLang)
    const dailyQuestions = getDailyCheckinQuestions(hdType, userLang)
    setQuestions(dailyQuestions)
  }, [])

  const t = LABELS[lang] || LABELS.en

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const allAnswered = questions.length > 0 && questions.every(q => answers[q.id] !== undefined)

  const handleSubmit = async () => {
    if (!allAnswered) return
    setLoading(true)

    const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0)
    const alignmentScore = Math.round((totalScore / (questions.length * 5)) * 100)

    try {
      setSubmitted(true)
      onComplete(alignmentScore, answers)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>{t.done}</h2>
        <div style={styles.doneBox}>
          <p style={styles.doneText}>{t.done}</p>
          <p style={styles.doneSubtext}>{t.tomorrow}</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) return null

  const categoryMeta = {
    mirroring: { icon: "🪞", color: "var(--purple)" },
    gratitude: { icon: "✦", color: "var(--green)" },
    intention: { icon: "🧭", color: "var(--orange)" },
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.cardTitle}>{t.title}</h2>
        <p style={styles.cardSubtitle}>{t.subtitle}</p>
      </div>

      {questions.map((q) => {
        const cat = categoryMeta[q.category] || categoryMeta.mirroring
        const catLabel = t[q.category] || q.category
        return (
          <div key={q.id} style={styles.questionBlock}>
            <div style={styles.categoryRow}>
              <span style={{ fontSize: "16px", marginRight: "8px" }}>{cat.icon}</span>
              <span style={{ ...styles.categoryLabel, color: cat.color }}>{catLabel}</span>
            </div>
            <p style={styles.questionText}>{q.question}</p>
            <div style={styles.scaleWrap}>
              <div style={styles.anchorRow}>
                <span style={styles.anchorLabel}>{t.anchor_low}</span>
                <span style={styles.anchorLabel}>{t.anchor_high}</span>
              </div>
              <div style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(q.id, val)}
                    style={{
                      ...styles.ratingBtn,
                      background: answers[q.id] === val ? cat.color : "var(--bg)",
                      color: answers[q.id] === val ? "#fff" : "var(--text)",
                      borderColor: answers[q.id] === val ? cat.color : "var(--border)"
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || loading}
        style={{
          ...styles.submitButton,
          background: allAnswered ? "var(--purple)" : "#ccc",
          cursor: allAnswered ? "pointer" : "not-allowed"
        }}
      >
        {loading ? t.saving : t.submit}
      </button>
    </div>
  )
}

const styles = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "28px", marginBottom: "24px", boxShadow: "var(--shadow)" },
  header: { marginBottom: "24px" },
  cardTitle: { fontSize: "20px", fontWeight: "600", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", marginBottom: "6px" },
  cardSubtitle: { fontSize: "14px", color: "var(--text-muted)" },
  questionBlock: { marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" },
  categoryRow: { display: "flex", alignItems: "center", marginBottom: "8px" },
  categoryLabel: { fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" },
  questionText: { fontSize: "16px", fontWeight: "500", marginBottom: "14px", color: "var(--text)", lineHeight: "1.5" },
  scaleWrap: {},
  anchorRow: { display: "flex", justifyContent: "space-between", marginBottom: "6px", padding: "0 2px" },
  anchorLabel: { fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" },
  ratingRow: { display: "flex", gap: "8px" },
  ratingBtn: { flex: 1, minWidth: "36px", maxWidth: "52px", height: "44px", borderRadius: "10px", border: "1.5px solid", fontSize: "15px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center" },
  submitButton: { width: "100%", padding: "15px", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "500", boxShadow: "0 4px 20px rgba(124,92,191,0.3)" },
  doneBox: { textAlign: "center", padding: "24px 0" },
  doneText: { fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" },
  doneSubtext: { fontSize: "14px", color: "var(--text-muted)" }
}