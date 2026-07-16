"use client"

const LABELS = {
  en: { current: "Current streak", longest: "Longest streak", day1: "The beginning is the hardest part.", days2: "Momentum is building.", days7: "A full week. Real consistency.", days30: "Remarkable. Keep going.", dayLetters: ["M","T","W","T","F","S","S"] },
  ro: { current: "Streak actual", longest: "Cel mai lung streak", day1: "Începutul e cel mai greu.", days2: "Se construiește impulsul.", days7: "O săptămână completă!", days30: "Remarcabil. Continuă.", dayLetters: ["L","M","M","J","V","S","D"] },
  es: { current: "Racha actual", longest: "Racha mas larga", day1: "El principio es lo mas dificil.", days2: "Se construye el impulso.", days7: "Una semana completa.", days30: "Notable. Sigue asi.", dayLetters: ["L","M","X","J","V","S","D"] },
  fr: { current: "Serie actuelle", longest: "Plus longue serie", day1: "Le debut est le plus dur.", days2: "L elan se construit.", days7: "Une semaine complete.", days30: "Remarquable. Continue.", dayLetters: ["L","M","M","J","V","S","D"] },
  de: { current: "Aktuelle Serie", longest: "Langste Serie", day1: "Der Anfang ist am schwersten.", days2: "Schwung baut sich auf.", days7: "Eine ganze Woche.", days30: "Bemerkenswert. Weiter so.", dayLetters: ["M","D","M","D","F","S","S"] },
  it: { current: "Serie attuale", longest: "Serie piu lunga", day1: "L inizio e la parte piu dura.", days2: "Lo slancio si costruisce.", days7: "Una settimana intera.", days30: "Notevole. Continua.", dayLetters: ["L","M","M","G","V","S","D"] },
  pt: { current: "Sequencia atual", longest: "Maior sequencia", day1: "O comeco e a parte mais dificil.", days2: "O impulso esta a crescer.", days7: "Uma semana inteira.", days30: "Notavel. Continua.", dayLetters: ["S","T","Q","Q","S","S","D"] },
  nl: { current: "Huidige reeks", longest: "Langste reeks", day1: "Het begin is het moeilijkst.", days2: "Het momentum bouwt op.", days7: "Een hele week.", days30: "Opmerkelijk. Ga door.", dayLetters: ["M","D","W","D","V","Z","Z"] },
  pl: { current: "Aktualna seria", longest: "Najdluzsza seria", day1: "Poczatek jest najtrudniejszy.", days2: "Impet sie buduje.", days7: "Caly tydzien.", days30: "Niezwykle. Tak trzymaj.", dayLetters: ["P","W","S","C","P","S","N"] },
  hu: { current: "Jelenlegi sorozat", longest: "Leghosszabb sorozat", day1: "A kezdes a legnehezebb.", days2: "Epul a lendulet.", days7: "Egy egesz het.", days30: "Figyelemre melto. Folytasd.", dayLetters: ["H","K","Sz","Cs","P","Sz","V"] }
}

export default function StreakTracker({ streak = 0, longestStreak = 0, lang = "en" }) {
  const t = LABELS[lang] || LABELS.en
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1

  const getMessage = () => {
    if (streak === 0) return ""
    if (streak === 1) return `1 — ${t.day1}`
    if (streak >= 2 && streak < 7) return `${streak} — ${t.days2}`
    if (streak >= 7 && streak < 30) return `${streak} — ${t.days7}`
    if (streak >= 30) return `${streak} — ${t.days30}`
    return ""
  }

  return (
    <div style={styles.card} className="anim-fade-in">
      <div style={styles.row}>
        <div style={styles.stat}>
          <p style={styles.streakNum}>
            <span className={streak > 0 ? "gradient-text-amber" : ""}>{streak}</span>
          </p>
          <p style={styles.streakLabel}>{t.current}</p>
        </div>
        <div style={styles.stat}>
          <p style={styles.streakNum}>{longestStreak}</p>
          <p style={styles.streakLabel}>{t.longest}</p>
        </div>
      </div>
      <div style={styles.weekRow}>
        {t.dayLetters.map((day, i) => {
          const filled = i <= adjustedToday
          const isToday = i === adjustedToday
          const cls = [
            filled ? `day-dot-fill day-fill-${i + 1}` : "",
            filled ? "day-dot-active" : "",
            isToday ? "day-dot-today" : ""
          ].filter(Boolean).join(" ")
          return (
            <div
              key={i}
              className={cls}
              style={{
                ...styles.dayDot,
                backgroundColor: filled ? "var(--purple)" : "var(--border)"
              }}
            >
              <span style={{ color: filled ? "#fff" : "var(--text-light)", fontSize: "11px", fontWeight: 600 }}>{day}</span>
            </div>
          )
        })}
      </div>
      <p style={styles.message}>{getMessage()}</p>
    </div>
  )
}

const styles = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "24px", marginBottom: "24px", boxShadow: "var(--shadow)" },
  row: { display: "flex", gap: "24px", marginBottom: "20px" },
  stat: { flex: 1, textAlign: "center" },
  streakNum: { fontSize: "40px", fontWeight: "600", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", lineHeight: 1.1, display: "inline-flex", alignItems: "center", gap: "4px" },
  streakLabel: { fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" },
  weekRow: { display: "flex", justifyContent: "space-between", marginBottom: "16px" },
  dayDot: { width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  message: { fontSize: "14px", color: "var(--text-muted)", textAlign: "center", fontStyle: "italic" }
}
