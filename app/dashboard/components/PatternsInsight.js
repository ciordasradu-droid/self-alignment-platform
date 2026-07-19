"use client"

import { useState, useEffect } from "react"

export default function PatternsInsight({ lang = "en" }) {
  const [patterns, setPatterns] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [lastGenerated, setLastGenerated] = useState(null)

  const labels = {
    en: {
      tag: "Patterns",
      title: "What is emerging in your journey",
      subtitle: "AI synthesis of your check-ins. Patterns you might not see yourself.",
      generate: "Reveal my patterns",
      regenerate: "Refresh patterns",
      loading: "Analyzing your check-ins...",
      no_data: "You need at least 7 check-ins before patterns can emerge. Keep showing up.",
      last_updated: "Last updated",
      strength: "Strength",
      watch: "Watch",
      invitation: "Invitation",
    },
    ro: {
      tag: "Tipare",
      title: "Ce apare in calatoria ta",
      subtitle: "Sinteza AI a check-in-urilor tale. Tipare pe care s-ar putea sa nu le vezi singur.",
      generate: "Dezvaluie tiparele mele",
      regenerate: "Actualizeaza tiparele",
      loading: "Analizez check-in-urile tale...",
      no_data: "Ai nevoie de cel putin 7 check-in-uri inainte ca tiparele sa apara. Continua sa vii.",
      last_updated: "Ultima actualizare",
      strength: "Punct forte",
      watch: "De urmarit",
      invitation: "Invitatie",
    },
    es: {
      tag: "Patrones",
      title: "Lo que esta emergiendo en tu camino",
      subtitle: "Sintesis AI de tus check-ins. Patrones que quizas no ves tu mismo.",
      generate: "Revelar mis patrones",
      regenerate: "Actualizar patrones",
      loading: "Analizando tus check-ins...",
      no_data: "Necesitas al menos 7 check-ins antes de que los patrones emerjan.",
      last_updated: "Ultima actualizacion",
      strength: "Fortaleza",
      watch: "Observar",
      invitation: "Invitacion",
    },
    fr: {
      tag: "Tendances",
      title: "Ce qui emerge dans ton parcours",
      subtitle: "Synthese IA de tes check-ins. Des tendances que tu ne vois peut-etre pas.",
      generate: "Reveler mes tendances",
      regenerate: "Actualiser",
      loading: "Analyse de tes check-ins...",
      no_data: "Il te faut au moins 7 check-ins avant que les tendances apparaissent.",
      last_updated: "Derniere mise a jour",
      strength: "Force",
      watch: "A surveiller",
      invitation: "Invitation",
    },
    de: {
      tag: "Muster",
      title: "Was sich auf deinem Weg zeigt",
      subtitle: "KI-Synthese deiner Check-ins. Muster, die du vielleicht selbst nicht siehst.",
      generate: "Meine Muster enthuellen",
      regenerate: "Aktualisieren",
      loading: "Analysiere deine Check-ins...",
      no_data: "Du brauchst mindestens 7 Check-ins, bevor Muster erscheinen koennen.",
      last_updated: "Zuletzt aktualisiert",
      strength: "Staerke",
      watch: "Beobachten",
      invitation: "Einladung",
    },
    it: {
      tag: "Modelli",
      title: "Cosa sta emergendo nel tuo percorso",
      subtitle: "Sintesi AI dei tuoi check-in. Modelli che potresti non vedere da solo.",
      generate: "Rivela i miei modelli",
      regenerate: "Aggiorna",
      loading: "Analizzo i tuoi check-in...",
      no_data: "Servono almeno 7 check-in prima che i modelli emergano.",
      last_updated: "Ultimo aggiornamento",
      strength: "Punto di forza",
      watch: "Da osservare",
      invitation: "Invito",
    },
    pt: {
      tag: "Padroes",
      title: "O que esta a emergir na sua jornada",
      subtitle: "Sintese IA dos seus check-ins. Padroes que talvez nao veja sozinho.",
      generate: "Revelar os meus padroes",
      regenerate: "Atualizar",
      loading: "A analisar os seus check-ins...",
      no_data: "Precisa de pelo menos 7 check-ins antes que os padroes emerjam.",
      last_updated: "Ultima atualizacao",
      strength: "Forca",
      watch: "Observar",
      invitation: "Convite",
    },
    nl: {
      tag: "Patronen",
      title: "Wat er opkomt in jouw reis",
      subtitle: "AI-synthese van je check-ins. Patronen die je misschien zelf niet ziet.",
      generate: "Onthul mijn patronen",
      regenerate: "Vernieuwen",
      loading: "Je check-ins analyseren...",
      no_data: "Je hebt minstens 7 check-ins nodig voordat patronen kunnen verschijnen.",
      last_updated: "Laatst bijgewerkt",
      strength: "Kracht",
      watch: "Aandachtspunt",
      invitation: "Uitnodiging",
    },
    pl: {
      tag: "Wzorce",
      title: "Co wylania sie w twojej podrozy",
      subtitle: "Synteza AI twoich check-inow. Wzorce, ktorych sam mozesz nie widziec.",
      generate: "Odkryj moje wzorce",
      regenerate: "Odswiez",
      loading: "Analizuje twoje check-iny...",
      no_data: "Potrzebujesz co najmniej 7 check-inow, zanim wzorce sie pojawia.",
      last_updated: "Ostatnia aktualizacja",
      strength: "Sila",
      watch: "Do obserwacji",
      invitation: "Zaproszenie",
    },
    hu: {
      tag: "Mintak",
      title: "Mi rajzolodik ki az utadon",
      subtitle: "AI szintezis a check-injeidbol. Mintak, amiket talan magadtol nem latnal.",
      generate: "Fedezd fel a mintaimat",
      regenerate: "Frissites",
      loading: "Check-injeid elemzese...",
      no_data: "Legalabb 7 check-in kell, mielott a mintak megjelenhetnek.",
      last_updated: "Utoljara frissitve",
      strength: "Erosseg",
      watch: "Figyelendo",
      invitation: "Meghivas",
    },
    ru: {
      tag: "Закономерности",
      title: "Что проявляется на твоём пути",
      subtitle: "AI-синтез твоих чек-инов. Закономерности, которые ты сам можешь не замечать.",
      generate: "Раскрыть мои закономерности",
      regenerate: "Обновить",
      loading: "Анализирую твои чек-ины...",
      no_data: "Нужно как минимум 7 чек-инов, прежде чем закономерности смогут проявиться.",
      last_updated: "Последнее обновление",
      strength: "Сильная сторона",
      watch: "Присмотреться",
      invitation: "Приглашение",
    }
  }

  const t = labels[lang] || labels.en

  useEffect(() => {
    try {
      const cached = localStorage.getItem("patterns_insight")
      if (cached) {
        const parsed = JSON.parse(cached)
        setPatterns(parsed.data)
        setLastGenerated(parsed.date)
      }
    } catch (e) {}
  }, [])

  const generatePatterns = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to generate patterns")

      if (data.insufficient) {
        setError(t.no_data)
        setLoading(false)
        return
      }

      setPatterns(data.patterns)
      const today = new Date().toLocaleDateString(lang === "en" ? "en-US" : lang, {
        month: "short", day: "numeric"
      })
      setLastGenerated(today)

      localStorage.setItem("patterns_insight", JSON.stringify({
        data: data.patterns,
        date: today
      }))

    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div style={s.card}>
      <div
        style={s.headerRow}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <span style={s.tag}>{t.tag}</span>
          <h3 style={s.title}>{t.title}</h3>
          <p style={s.subtitle}>{t.subtitle}</p>
        </div>
        <span style={s.chevron}>{isOpen ? "\u25BE" : "\u25B8"}</span>
      </div>

      {isOpen && (
        <div style={s.body}>
          {!patterns && !loading && !error && (
            <button onClick={generatePatterns} style={s.generateBtn}>
              {t.generate}
            </button>
          )}

          {loading && (
            <div style={s.loadingBox}>
              <div style={s.spinner} />
              <p style={s.loadingText}>{t.loading}</p>
            </div>
          )}

          {error && (
            <p style={s.errorText}>{error}</p>
          )}

          {patterns && !loading && (
            <div style={s.patternsWrap}>

              {patterns.strength && (
                <div style={{ ...s.patternCard, borderLeft: "3px solid var(--green)" }}>
                  <p style={{ ...s.patternLabel, color: "var(--green)" }}>{t.strength}</p>
                  <p style={s.patternTitle}>{patterns.strength.title}</p>
                  <p style={s.patternBody}>{patterns.strength.body}</p>
                </div>
              )}

              {patterns.watch && (
                <div style={{ ...s.patternCard, borderLeft: "3px solid var(--orange)" }}>
                  <p style={{ ...s.patternLabel, color: "var(--orange)" }}>{t.watch}</p>
                  <p style={s.patternTitle}>{patterns.watch.title}</p>
                  <p style={s.patternBody}>{patterns.watch.body}</p>
                </div>
              )}

              {patterns.invitation && (
                <div style={{ ...s.patternCard, borderLeft: "3px solid var(--purple)" }}>
                  <p style={{ ...s.patternLabel, color: "var(--purple)" }}>{t.invitation}</p>
                  <p style={s.patternTitle}>{patterns.invitation.title}</p>
                  <p style={s.patternBody}>{patterns.invitation.body}</p>
                </div>
              )}

              <div style={s.footer}>
                {lastGenerated && (
                  <p style={s.lastUpdated}>{t.last_updated}: {lastGenerated}</p>
                )}
                <button onClick={generatePatterns} style={s.refreshBtn}>
                  {t.regenerate}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const s = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "24px", marginBottom: "24px", boxShadow: "var(--shadow)" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" },
  tag: { fontSize: "11px", fontWeight: "700", color: "var(--purple)", textTransform: "uppercase", letterSpacing: "1px", background: "var(--purple-light)", padding: "4px 10px", borderRadius: "20px", display: "inline-block", marginBottom: "10px" },
  title: { fontSize: "20px", fontWeight: "600", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", marginBottom: "6px" },
  subtitle: { fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.5" },
  chevron: { fontSize: "18px", color: "var(--text-muted)", marginTop: "4px", flexShrink: 0 },
  body: { marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" },
  generateBtn: { width: "100%", padding: "14px", background: "var(--purple)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "500", cursor: "pointer", boxShadow: "0 4px 20px var(--gold-faint)" },
  loadingBox: { textAlign: "center", padding: "32px 0" },
  spinner: { width: "32px", height: "32px", border: "3px solid var(--border)", borderTopColor: "var(--purple)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" },
  loadingText: { fontSize: "14px", color: "var(--text-muted)" },
  errorText: { fontSize: "14px", color: "var(--text-muted)", textAlign: "center", padding: "20px 0", lineHeight: "1.6" },
  patternsWrap: { },
  patternCard: { background: "var(--bg)", borderRadius: "10px", padding: "20px", marginBottom: "14px" },
  patternLabel: { fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
  patternTitle: { fontSize: "17px", fontWeight: "600", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", marginBottom: "8px" },
  patternBody: { fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" },
  lastUpdated: { fontSize: "12px", color: "var(--text-muted)" },
  refreshBtn: { padding: "8px 16px", background: "transparent", color: "var(--purple)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer" },
}
