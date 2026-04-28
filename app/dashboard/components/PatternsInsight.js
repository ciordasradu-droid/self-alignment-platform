'use client'

import { useState, useEffect } from 'react'
import { getUserId } from '../../../lib/userId'

export default function PatternsInsight({ lang = 'en' }) {
  const [patterns, setPatterns] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [lastGenerated, setLastGenerated] = useState(null)

  const labels = {
    en: {
      tag: 'Patterns',
      title: 'What's emerging in your journey',
      subtitle: 'AI synthesis of your check-ins â€” patterns you might not see yourself.',
      generate: 'Reveal my patterns â†'',
      regenerate: 'Refresh patterns',
      loading: 'Analyzing your check-ins...',
      no_data: 'You need at least 7 check-ins before patterns can emerge. Keep showing up.',
      last_updated: 'Last updated',
      strength: 'Strength',
      watch: 'Watch',
      invitation: 'Invitation',
    },
    ro: {
      tag: 'Tipare',
      title: 'Ce apare Ã®n cÄƒlÄƒtoria ta',
      subtitle: 'SintezÄƒ AI a check-in-urilor tale â€” tipare pe care s-ar putea sÄƒ nu le vezi singur.',
      generate: 'DezvÄƒluie tiparele mele â†'',
      regenerate: 'ActualizeazÄƒ tiparele',
      loading: 'Analizez check-in-urile tale...',
      no_data: 'Ai nevoie de cel puÈ›in 7 check-in-uri Ã®nainte ca tiparele sÄƒ aparÄƒ. ContinuÄƒ sÄƒ vii.',
      last_updated: 'Ultima actualizare',
      strength: 'Punct forte',
      watch: 'De urmÄƒrit',
      invitation: 'InvitaÈ›ie',
    },
    es: {
      tag: 'Patrones',
      title: 'Lo que estÃ¡ emergiendo en tu camino',
      subtitle: 'SÃ­ntesis AI de tus check-ins â€” patrones que quizÃ¡s no ves tÃº mismo.',
      generate: 'Revelar mis patrones â†'',
      regenerate: 'Actualizar patrones',
      loading: 'Analizando tus check-ins...',
      no_data: 'Necesitas al menos 7 check-ins antes de que los patrones emerjan.',
      last_updated: 'Ãšltima actualizaciÃ³n',
      strength: 'Fortaleza',
      watch: 'Observar',
      invitation: 'InvitaciÃ³n',
    },
    fr: {
      tag: 'Tendances',
      title: 'Ce qui Ã©merge dans ton parcours',
      subtitle: 'SynthÃ¨se IA de tes check-ins â€” des tendances que tu ne vois peut-Ãªtre pas.',
      generate: 'RÃ©vÃ©ler mes tendances â†'',
      regenerate: 'Actualiser',
      loading: 'Analyse de tes check-ins...',
      no_data: 'Il te faut au moins 7 check-ins avant que les tendances apparaissent.',
      last_updated: 'DerniÃ¨re mise Ã  jour',
      strength: 'Force',
      watch: 'Ã€ surveiller',
      invitation: 'Invitation',
    },
    de: {
      tag: 'Muster',
      title: 'Was sich auf deinem Weg zeigt',
      subtitle: 'KI-Synthese deiner Check-ins â€” Muster, die du vielleicht selbst nicht siehst.',
      generate: 'Meine Muster enthÃ¼llen â†'',
      regenerate: 'Aktualisieren',
      loading: 'Analysiere deine Check-ins...',
      no_data: 'Du brauchst mindestens 7 Check-ins, bevor Muster erscheinen kÃ¶nnen.',
      last_updated: 'Zuletzt aktualisiert',
      strength: 'StÃ¤rke',
      watch: 'Beobachten',
      invitation: 'Einladung',
    },
    it: {
      tag: 'Modelli',
      title: 'Cosa sta emergendo nel tuo percorso',
      subtitle: 'Sintesi AI dei tuoi check-in â€” modelli che potresti non vedere da solo.',
      generate: 'Rivela i miei modelli â†'',
      regenerate: 'Aggiorna',
      loading: 'Analizzo i tuoi check-in...',
      no_data: 'Servono almeno 7 check-in prima che i modelli emergano.',
      last_updated: 'Ultimo aggiornamento',
      strength: 'Punto di forza',
      watch: 'Da osservare',
      invitation: 'Invito',
    },
    pt: {
      tag: 'PadrÃµes',
      title: 'O que estÃ¡ a emergir na sua jornada',
      subtitle: 'SÃ­ntese IA dos seus check-ins â€” padrÃµes que talvez nÃ£o veja sozinho.',
      generate: 'Revelar os meus padrÃµes â†'',
      regenerate: 'Atualizar',
      loading: 'A analisar os seus check-ins...',
      no_data: 'Precisa de pelo menos 7 check-ins antes que os padrÃµes emerjam.',
      last_updated: 'Ãšltima atualizaÃ§Ã£o',
      strength: 'ForÃ§a',
      watch: 'Observar',
      invitation: 'Convite',
    },
    nl: {
      tag: 'Patronen',
      title: 'Wat er opkomt in jouw reis',
      subtitle: 'AI-synthese van je check-ins â€” patronen die je misschien zelf niet ziet.',
      generate: 'Onthul mijn patronen â†'',
      regenerate: 'Vernieuwen',
      loading: 'Je check-ins analyseren...',
      no_data: 'Je hebt minstens 7 check-ins nodig voordat patronen kunnen verschijnen.',
      last_updated: 'Laatst bijgewerkt',
      strength: 'Kracht',
      watch: 'Aandachtspunt',
      invitation: 'Uitnodiging',
    },
    pl: {
      tag: 'Wzorce',
      title: 'Co wyÅ‚ania siÄ™ w twojej podrÃ³Å¼y',
      subtitle: 'Synteza AI twoich check-inÃ³w â€” wzorce, ktÃ³rych sam moÅ¼esz nie widzieÄ‡.',
      generate: 'Odkryj moje wzorce â†'',
      regenerate: 'OdÅ›wieÅ¼',
      loading: 'AnalizujÄ™ twoje check-iny...',
      no_data: 'Potrzebujesz co najmniej 7 check-inÃ³w, zanim wzorce siÄ™ pojawiÄ….',
      last_updated: 'Ostatnia aktualizacja',
      strength: 'SiÅ‚a',
      watch: 'Do obserwacji',
      invitation: 'Zaproszenie',
    },
    hu: {
      tag: 'MintÃ¡k',
      title: 'Mi rajzolÃ³dik ki az utadon',
      subtitle: 'AI szintÃ©zis a check-injeidbÅ‘l â€” mintÃ¡k, amiket talÃ¡n magadtÃ³l nem lÃ¡tnÃ¡l.',
      generate: 'Fedezd fel a mintÃ¡imat â†'',
      regenerate: 'FrissÃ­tÃ©s',
      loading: 'Check-injeid elemzÃ©se...',
      no_data: 'LegalÃ¡bb 7 check-in kell, mielÅ‘tt a mintÃ¡k megjelenhetnek.',
      last_updated: 'UtoljÃ¡ra frissÃ­tve',
      strength: 'ErÅ‘ssÃ©g',
      watch: 'FigyelendÅ‘',
      invitation: 'MeghÃ­vÃ¡s',
    }
  }

  const t = labels[lang] || labels.en

  useEffect(() => {
    // Check for cached patterns
    try {
      const cached = localStorage.getItem('patterns_insight')
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
      const userId = getUserId()
      const res = await fetch('/api/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, language: lang })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to generate patterns')

      if (data.insufficient) {
        setError(t.no_data)
        setLoading(false)
        return
      }

      setPatterns(data.patterns)
      const today = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : lang, {
        month: 'short', day: 'numeric'
      })
      setLastGenerated(today)

      // Cache
      localStorage.setItem('patterns_insight', JSON.stringify({
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
        <span style={s.chevron}>{isOpen ? 'â–¾' : 'â–¸'}</span>
      </div>

      {isOpen && (
        <div style={s.body}>
          {/* No patterns yet â€” show generate button */}
          {!patterns && !loading && !error && (
            <button onClick={generatePatterns} style={s.generateBtn}>
              {t.generate}
            </button>
          )}

          {/* Loading */}
          {loading && (
            <div style={s.loadingBox}>
              <div style={s.spinner} />
              <p style={s.loadingText}>{t.loading}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p style={s.errorText}>{error}</p>
          )}

          {/* Patterns display */}
          {patterns && !loading && (
            <div style={s.patternsWrap}>

              {/* Strength */}
              {patterns.strength && (
                <div style={{ ...s.patternCard, borderLeft: '3px solid var(--green)' }}>
                  <p style={{ ...s.patternLabel, color: 'var(--green)' }}>{t.strength}</p>
                  <p style={s.patternTitle}>{patterns.strength.title}</p>
                  <p style={s.patternBody}>{patterns.strength.body}</p>
                </div>
              )}

              {/* Watch */}
              {patterns.watch && (
                <div style={{ ...s.patternCard, borderLeft: '3px solid var(--orange)' }}>
                  <p style={{ ...s.patternLabel, color: 'var(--orange)' }}>{t.watch}</p>
                  <p style={s.patternTitle}>{patterns.watch.title}</p>
                  <p style={s.patternBody}>{patterns.watch.body}</p>
                </div>
              )}

              {/* Invitation */}
              {patterns.invitation && (
                <div style={{ ...s.patternCard, borderLeft: '3px solid var(--purple)' }}>
                  <p style={{ ...s.patternLabel, color: 'var(--purple)' }}>{t.invitation}</p>
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
  card: { background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' },
  tag: { fontSize: '11px', fontWeight: '700', color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '1px', background: 'var(--purple-light)', padding: '4px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '10px' },
  title: { fontSize: '20px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '6px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' },
  chevron: { fontSize: '18px', color: 'var(--text-muted)', marginTop: '4px', flexShrink: 0 },
  body: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' },
  generateBtn: { width: '100%', padding: '14px', background: 'var(--purple)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,92,191,0.3)' },
  loadingBox: { textAlign: 'center', padding: '32px 0' },
  spinner: { width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' },
  loadingText: { fontSize: '14px', color: 'var(--text-muted)' },
  errorText: { fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0', lineHeight: '1.6' },
  patternsWrap: { },
  patternCard: { background: 'var(--bg)', borderRadius: '10px', padding: '20px', marginBottom: '14px' },
  patternLabel: { fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  patternTitle: { fontSize: '17px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '8px' },
  patternBody: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' },
  lastUpdated: { fontSize: '12px', color: 'var(--text-muted)' },
  refreshBtn: { padding: '8px 16px', background: 'transparent', color: 'var(--purple)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
}
