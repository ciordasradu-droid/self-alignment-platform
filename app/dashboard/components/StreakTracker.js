"use client"

const LABELS = {
  en: { current: "Current streak", longest: "Longest streak", day1: "Good start. Come back tomorrow.", days2: " days in. Keep going.", days7: " days strong. Real momentum.", days30: " days. Remarkable consistency.", dayLetters: ["M","T","W","T","F","S","S"] },
  ro: { current: "Streak actual", longest: "Cel mai lung streak", day1: "Bun inceput. Revino maine.", days2: " zile consecutive. Continua.", days7: " zile puternice. Impuls real.", days30: " zile. Consistenta remarcabila.", dayLetters: ["L","M","M","J","V","S","D"] },
  es: { current: "Racha actual", longest: "Racha mas larga", day1: "Buen inicio. Vuelve manana.", days2: " dias. Sigue asi.", days7: " dias fuertes. Impulso real.", days30: " dias. Consistencia notable.", dayLetters: ["L","M","X","J","V","S","D"] },
  fr: { current: "Serie actuelle", longest: "Plus longue serie", day1: "Bon debut. Reviens demain.", days2: " jours. Continue.", days7: " jours forts. Vrai elan.", days30: " jours. Consistance remarquable.", dayLetters: ["L","M","M","J","V","S","D"] },
  de: { current: "Aktuelle Serie", longest: "Langste Serie", day1: "Guter Start. Komm morgen wieder.", days2: " Tage dran. Weiter so.", days7: " Tage stark. Echtes Momentum.", days30: " Tage. Bemerkenswerte Konsistenz.", dayLetters: ["M","D","M","D","F","S","S"] },
  it: { current: "Serie attuale", longest: "Serie piu lunga", day1: "Buon inizio. Torna domani.", days2: " giorni. Continua cosi.", days7: " giorni forti. Vero slancio.", days30: " giorni. Consistenza notevole.", dayLetters: ["L","M","M","G","V","S","D"] },
  pt: { current: "Sequencia atual", longest: "Maior sequencia", day1: "Bom inicio. Volta amanha.", days2: " dias. Continua.", days7: " dias fortes. Impulso real.", days30: " dias. Consistencia notavel.", dayLetters: ["S","T","Q","Q","S","S","D"] },
  nl: { current: "Huidige reeks", longest: "Langste reeks", day1: "Goed begin. Kom morgen terug.", days2: " dagen. Ga zo door.", days7: " dagen sterk. Echt momentum.", days30: " dagen. Opmerkelijke consistentie.", dayLetters: ["M","D","W","D","V","Z","Z"] },
  pl: { current: "Aktualna seria", longest: "Najdluzsza seria", day1: "Dobry poczatek. Wroc jutro.", days2: " dni. Tak trzymaj.", days7: " dni. Prawdziwy impet.", days30: " dni. Niezwykla konsekwencja.", dayLetters: ["P","W","S","C","P","S","N"] },
  hu: { current: "Jelenlegi sorozat", longest: "Leghosszabb sorozat", day1: "Jo kezdes. Gyere vissza holnap.", days2: " nap. Folytasd.", days7: " nap erosen. Igazi lendület.", days30: " nap. Figyelemre melto kitartas.", dayLetters: ["H","K","Sz","Cs","P","Sz","V"] }
}

export default function StreakTracker({ streak = 0, longestStreak = 0, lang = "en" }) {
  const t = LABELS[lang] || LABELS.en
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1

  const getMessage = () => {
    if (streak === 1) return t.day1
    if (streak >= 2 && streak < 7) return streak + t.days2
    if (streak >= 7 && streak < 30) return streak + t.days7
    if (streak >= 30) return streak + t.days30
    return ""
  }

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <div style={styles.stat}>
          <p style={styles.streakNum}>{streak}</p>
          <p style={styles.streakLabel}>{t.current}</p>
        </div>
        <div style={styles.stat}>
          <p style={styles.streakNum}>{longestStreak}</p>
          <p style={styles.streakLabel}>{t.longest}</p>
        </div>
      </div>
      <div style={styles.weekRow}>
        {t.dayLetters.map((day, i) => (
          <div key={i} style={{ ...styles.dayDot, backgroundColor: i <= adjustedToday ? "#111" : "#eee" }}>
            <span style={{ color: i <= adjustedToday ? "#fff" : "#999", fontSize: "11px" }}>{day}</span>
          </div>
        ))}
      </div>
      <p style={styles.message}>{getMessage()}</p>
    </div>
  )
}

const styles = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "24px", marginBottom: "24px", boxShadow: "var(--shadow)" },
  row: { display: "flex", gap: "24px", marginBottom: "20px" },
  stat: { flex: 1, textAlign: "center" },
  streakNum: { fontSize: "36px", fontWeight: "600", color: "var(--text)", fontFamily: "Cormorant Garamond, serif" },
  streakLabel: { fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" },
  weekRow: { display: "flex", justifyContent: "space-between", marginBottom: "16px" },
  dayDot: { width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  message: { fontSize: "14px", color: "var(--text-muted)", textAlign: "center" }
}
