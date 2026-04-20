// app/dashboard/components/FreeJournal.js
// Private journal — no prompts, no structure, just space to write
// Unlocks at Day 3 of account

'use client'

import { useState, useEffect } from 'react'

export default function FreeJournal({ lang = 'en' }) {
  const [entry, setEntry] = useState('')
  const [saved, setSaved] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [pastEntries, setPastEntries] = useState([])

  const today = new Date().toISOString().split('T')[0]

  const labels = {
    en: { title: 'Journal', subtitle: 'A private space. No prompts. Just you.', placeholder: 'Write freely...', save: 'Save', saved: 'Saved', past: 'Past entries', no_entries: 'No entries yet. Start writing when you are ready.' },
    ro: { title: 'Jurnal', subtitle: 'Un spațiu privat. Fără întrebări. Doar tu.', placeholder: 'Scrie liber...', save: 'Salvează', saved: 'Salvat', past: 'Intrări anterioare', no_entries: 'Nicio intrare încă. Începe să scrii când ești pregătit.' },
    es: { title: 'Diario', subtitle: 'Un espacio privado. Sin guías. Solo tú.', placeholder: 'Escribe libremente...', save: 'Guardar', saved: 'Guardado', past: 'Entradas anteriores', no_entries: 'Sin entradas aún. Empieza cuando estés listo.' },
    fr: { title: 'Journal', subtitle: 'Un espace privé. Sans questions. Juste toi.', placeholder: 'Écris librement...', save: 'Sauvegarder', saved: 'Sauvegardé', past: 'Entrées passées', no_entries: 'Aucune entrée encore. Commence quand tu es prêt.' },
    de: { title: 'Tagebuch', subtitle: 'Ein privater Raum. Keine Fragen. Nur du.', placeholder: 'Schreib frei...', save: 'Speichern', saved: 'Gespeichert', past: 'Frühere Einträge', no_entries: 'Noch keine Einträge. Fang an, wenn du bereit bist.' },
    it: { title: 'Diario', subtitle: 'Uno spazio privato. Senza domande. Solo tu.', placeholder: 'Scrivi liberamente...', save: 'Salva', saved: 'Salvato', past: 'Voci precedenti', no_entries: 'Nessuna voce ancora. Inizia quando sei pronto.' },
    pt: { title: 'Diário', subtitle: 'Um espaço privado. Sem perguntas. Só tu.', placeholder: 'Escreve livremente...', save: 'Guardar', saved: 'Guardado', past: 'Entradas anteriores', no_entries: 'Sem entradas ainda. Começa quando estiveres pronto.' },
    nl: { title: 'Dagboek', subtitle: 'Een privé ruimte. Geen vragen. Alleen jij.', placeholder: 'Schrijf vrij...', save: 'Opslaan', saved: 'Opgeslagen', past: 'Eerdere items', no_entries: 'Nog geen items. Begin wanneer je klaar bent.' },
    pl: { title: 'Dziennik', subtitle: 'Prywatna przestrzeń. Bez pytań. Tylko ty.', placeholder: 'Pisz swobodnie...', save: 'Zapisz', saved: 'Zapisano', past: 'Wcześniejsze wpisy', no_entries: 'Brak wpisów. Zacznij, gdy będziesz gotowy.' },
    hu: { title: 'Napló', subtitle: 'Egy privát tér. Kérdések nélkül. Csak te.', placeholder: 'Írj szabadon...', save: 'Mentés', saved: 'Mentve', past: 'Korábbi bejegyzések', no_entries: 'Még nincsenek bejegyzések. Kezdj el írni, amikor készen állsz.' },
  }

  const t = labels[lang] || labels['en']

  useEffect(() => {
    // Load today's entry if exists
    const journalData = JSON.parse(localStorage.getItem('journal_entries') || '{}')
    if (journalData[today]) {
      setEntry(journalData[today])
      setSaved(true)
    }
    // Load past entries (last 7)
    const entries = Object.entries(journalData)
      .filter(([date]) => date !== today)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 7)
    setPastEntries(entries)
  }, [])

  const handleSave = () => {
    if (!entry.trim()) return
    const journalData = JSON.parse(localStorage.getItem('journal_entries') || '{}')
    journalData[today] = entry
    localStorage.setItem('journal_entries', JSON.stringify(journalData))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={s.card}>
      <div style={s.header} onClick={() => setIsOpen(!isOpen)}>
        <div>
          <div style={s.titleRow}>
            <span style={{ fontSize: '18px', marginRight: '8px' }}>📓</span>
            <h3 style={s.title}>{t.title}</h3>
          </div>
          <p style={s.subtitle}>{t.subtitle}</p>
        </div>
        <span style={s.toggle}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div style={s.content}>
          <textarea
            value={entry}
            onChange={(e) => { setEntry(e.target.value); setSaved(false) }}
            placeholder={t.placeholder}
            rows={8}
            style={s.textarea}
          />
          <div style={s.actions}>
            <button onClick={handleSave} style={s.saveBtn}>
              {saved ? `✓ ${t.saved}` : t.save}
            </button>
          </div>

          {pastEntries.length > 0 && (
            <div style={s.pastSection}>
              <p style={s.pastLabel}>{t.past}</p>
              {pastEntries.map(([date, text]) => (
                <div key={date} style={s.pastEntry}>
                  <p style={s.pastDate}>{new Date(date + 'T00:00').toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <p style={s.pastText}>{text.length > 120 ? text.slice(0, 120) + '...' : text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const s = {
  card: { background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '28px', marginBottom: '24px', boxShadow: 'var(--shadow)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' },
  titleRow: { display: 'flex', alignItems: 'center', marginBottom: '4px' },
  title: { fontSize: '18px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif' },
  subtitle: { fontSize: '13px', color: 'var(--text-muted)' },
  toggle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  content: { marginTop: '20px' },
  textarea: { width: '100%', padding: '16px', border: '1.5px solid var(--border)', borderRadius: '12px', fontSize: '15px', color: 'var(--text)', background: 'var(--bg)', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', lineHeight: '1.7', minHeight: '160px' },
  actions: { display: 'flex', justifyContent: 'flex-end', marginTop: '12px' },
  saveBtn: { padding: '10px 24px', background: 'var(--purple)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  pastSection: { marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' },
  pastLabel: { fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' },
  pastEntry: { padding: '12px 0', borderBottom: '1px solid var(--border)' },
  pastDate: { fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' },
  pastText: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' },
}