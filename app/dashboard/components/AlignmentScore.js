"use client"

const LABELS = {
  en: { title: "Alignment score", strong: "Strong alignment", moderate: "Moderate alignment", low: "Low alignment", based: "Based on your last 7 check-ins" },
  ro: { title: "Scor de aliniere", strong: "Aliniere puternica", moderate: "Aliniere moderata", low: "Aliniere scazuta", based: "Bazat pe ultimele 7 check-in-uri" },
  es: { title: "Puntuacion de alineacion", strong: "Alineacion fuerte", moderate: "Alineacion moderada", low: "Alineacion baja", based: "Basado en tus ultimos 7 check-ins" },
  fr: { title: "Score d alignement", strong: "Alignement fort", moderate: "Alignement modere", low: "Alignement faible", based: "Base sur vos 7 derniers check-ins" },
  de: { title: "Ausrichtungswert", strong: "Starke Ausrichtung", moderate: "Moderate Ausrichtung", low: "Niedrige Ausrichtung", based: "Basierend auf deinen letzten 7 Check-ins" },
  it: { title: "Punteggio di allineamento", strong: "Allineamento forte", moderate: "Allineamento moderato", low: "Allineamento basso", based: "Basato sui tuoi ultimi 7 check-in" },
  pt: { title: "Pontuacao de alinhamento", strong: "Alinhamento forte", moderate: "Alinhamento moderado", low: "Alinhamento baixo", based: "Baseado nos seus ultimos 7 check-ins" },
  nl: { title: "Uitlijningsscore", strong: "Sterke uitlijning", moderate: "Matige uitlijning", low: "Lage uitlijning", based: "Gebaseerd op je laatste 7 check-ins" },
  pl: { title: "Wynik wyrownania", strong: "Silne wyrownanie", moderate: "Umiarkowane wyrownanie", low: "Niskie wyrownanie", based: "Na podstawie ostatnich 7 check-inow" },
  hu: { title: "Igazodasi pontszam", strong: "Eros igazodas", moderate: "Mersekeltigazodas", low: "Alacsony igazodas", based: "Az utolso 7 check-in alapjan" }
}

export default function AlignmentScore({ score = 0, lang = "en" }) {
  const t = LABELS[lang] || LABELS.en

  const getLabel = () => {
    if (score >= 80) return t.strong
    if (score >= 60) return t.moderate
    return t.low
  }

  return (
    <div style={styles.card} className="anim-fade-in">
      <h2 style={styles.cardTitle}>{t.title}</h2>
      <div style={styles.scoreWrap}>
        <p style={styles.scoreNum} className="gradient-text-warm">{score}</p>
        <p style={styles.scoreMax}>/100</p>
      </div>
      <p style={styles.scoreLabel}>{getLabel()}</p>
      <p style={styles.scoreSubtext}>{t.based}</p>
    </div>
  )
}

const styles = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "24px", marginBottom: "24px", textAlign: "center", boxShadow: "var(--shadow)" },
  cardTitle: { fontSize: "16px", fontWeight: "600", color: "var(--text)", marginBottom: "16px" },
  scoreWrap: { display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4px" },
  scoreNum: { fontSize: "48px", fontWeight: "600", color: "var(--text)", fontFamily: "Cormorant Garamond, serif" },
  scoreMax: { fontSize: "18px", color: "var(--text-muted)" },
  scoreLabel: { fontSize: "15px", fontWeight: "500", color: "var(--purple)", marginTop: "8px" },
  scoreSubtext: { fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }
}
