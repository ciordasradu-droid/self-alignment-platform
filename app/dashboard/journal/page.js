'use client'

// JURNALUL-CARTE (A5, calup arhitectura 30.07) — un singur punct de intrare,
// paginile zilelor logice în ordine inversă, tot ce s-a scris (ritualuri +
// intrări libere). Scrisul liber se deblochează la prezența >= 3 zile
// (A2, aceeași regulă ca fostul Jurnal liber, acum unificat aici).

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../../lib/language'
import { clientTzOffset } from '../../../lib/logicalDay'
import WaterLoader from '../../components/water/WaterLoader'
import RoomNav from '../../components/RoomNav'

const L = {
  en: { title: 'Your Journal', back: '← Today', write_ph: 'Write freely…', save: 'Leave it here', saving: '…', unlock_once: 'What you write here stays between you and the water. No one else reads it.', locked_hint: 'Writing freely opens after a few more days of presence.', empty: 'Nothing written yet. It starts on your first ritual.', sleep: 'How you slept', morning_intention: 'Morning intention', evening_journal: 'Evening thoughts', gratitude: 'Gratitude', evening_intention: 'Intention for tomorrow', free: 'Written freely' },
  ro: { title: 'Jurnalul tău', back: '← Azi', write_ph: 'Scrie liber…', save: 'Lasă aici', saving: '…', unlock_once: 'Ce scrii aici rămâne între tine și apă. Nimeni altcineva nu citește.', locked_hint: 'Scrisul liber se deschide după câteva zile de prezență în plus.', empty: 'Nimic scris încă. Începe cu primul tău ritual.', sleep: 'Cum ai dormit', morning_intention: 'Intenția dimineții', evening_journal: 'Gândurile serii', gratitude: 'Recunoștință', evening_intention: 'Intenția pentru mâine', free: 'Scris liber' },
  es: { title: 'Tu Diario', back: '← Hoy', write_ph: 'Escribe libremente…', save: 'Déjalo aquí', saving: '…', unlock_once: 'Lo que escribes aquí queda entre tú y el agua. Nadie más lo lee.', locked_hint: 'Escribir libremente se abre tras unos días más de presencia.', empty: 'Nada escrito aún. Empieza con tu primer ritual.', sleep: 'Cómo dormiste', morning_intention: 'Intención de la mañana', evening_journal: 'Pensamientos de la noche', gratitude: 'Gratitud', evening_intention: 'Intención para mañana', free: 'Escrito libremente' },
  fr: { title: 'Ton Journal', back: '← Aujourd\'hui', write_ph: 'Écris librement…', save: 'Laisse-le ici', saving: '…', unlock_once: 'Ce que tu écris ici reste entre toi et l\'eau. Personne d\'autre ne le lit.', locked_hint: 'L\'écriture libre s\'ouvre après quelques jours de présence en plus.', empty: 'Rien d\'écrit encore. Ça commence avec ton premier rituel.', sleep: 'Comment tu as dormi', morning_intention: 'Intention du matin', evening_journal: 'Pensées du soir', gratitude: 'Gratitude', evening_intention: 'Intention pour demain', free: 'Écrit librement' },
  de: { title: 'Dein Tagebuch', back: '← Heute', write_ph: 'Schreib frei…', save: 'Hier lassen', saving: '…', unlock_once: 'Was du hier schreibst, bleibt zwischen dir und dem Wasser. Niemand sonst liest es.', locked_hint: 'Freies Schreiben öffnet sich nach ein paar weiteren Tagen der Präsenz.', empty: 'Noch nichts geschrieben. Es beginnt mit deinem ersten Ritual.', sleep: 'Wie du geschlafen hast', morning_intention: 'Morgenabsicht', evening_journal: 'Abendgedanken', gratitude: 'Dankbarkeit', evening_intention: 'Absicht für morgen', free: 'Frei geschrieben' },
  it: { title: 'Il Tuo Diario', back: '← Oggi', write_ph: 'Scrivi liberamente…', save: 'Lascialo qui', saving: '…', unlock_once: 'Quello che scrivi qui resta tra te e l\'acqua. Nessun altro lo legge.', locked_hint: 'Scrivere liberamente si apre dopo qualche altro giorno di presenza.', empty: 'Ancora niente di scritto. Inizia con il tuo primo rituale.', sleep: 'Come hai dormito', morning_intention: 'Intenzione del mattino', evening_journal: 'Pensieri della sera', gratitude: 'Gratitudine', evening_intention: 'Intenzione per domani', free: 'Scritto liberamente' },
  pt: { title: 'O Teu Diário', back: '← Hoje', write_ph: 'Escreve livremente…', save: 'Deixa aqui', saving: '…', unlock_once: 'O que escreves aqui fica entre ti e a água. Mais ninguém lê.', locked_hint: 'Escrever livremente abre depois de mais alguns dias de presença.', empty: 'Nada escrito ainda. Começa com o teu primeiro ritual.', sleep: 'Como dormiste', morning_intention: 'Intenção da manhã', evening_journal: 'Pensamentos da noite', gratitude: 'Gratidão', evening_intention: 'Intenção para amanhã', free: 'Escrito livremente' },
  nl: { title: 'Jouw Dagboek', back: '← Vandaag', write_ph: 'Schrijf vrij…', save: 'Laat hier', saving: '…', unlock_once: 'Wat je hier schrijft, blijft tussen jou en het water. Niemand anders leest het.', locked_hint: 'Vrij schrijven opent na nog een paar dagen aanwezigheid.', empty: 'Nog niets geschreven. Het begint bij je eerste ritueel.', sleep: 'Hoe je sliep', morning_intention: 'Ochtendintentie', evening_journal: 'Avondgedachten', gratitude: 'Dankbaarheid', evening_intention: 'Intentie voor morgen', free: 'Vrij geschreven' },
  pl: { title: 'Twój Dziennik', back: '← Dzisiaj', write_ph: 'Pisz swobodnie…', save: 'Zostaw tutaj', saving: '…', unlock_once: 'To, co tu piszesz, zostaje między tobą a wodą. Nikt inny tego nie czyta.', locked_hint: 'Swobodne pisanie otwiera się po kilku kolejnych dniach obecności.', empty: 'Jeszcze nic nie napisano. Zaczyna się od twojego pierwszego rytuału.', sleep: 'Jak spałeś', morning_intention: 'Poranna intencja', evening_journal: 'Wieczorne myśli', gratitude: 'Wdzięczność', evening_intention: 'Intencja na jutro', free: 'Napisane swobodnie' },
  hu: { title: 'A Naplód', back: '← Ma', write_ph: 'Írj szabadon…', save: 'Hagyd itt', saving: '…', unlock_once: 'Amit itt írsz, az közted és a víz között marad. Senki más nem olvassa.', locked_hint: 'A szabad írás még néhány nap jelenlét után nyílik meg.', empty: 'Még nincs semmi írva. Az első rituáléddal kezdődik.', sleep: 'Hogy aludtál', morning_intention: 'Reggeli szándék', evening_journal: 'Esti gondolatok', gratitude: 'Hála', evening_intention: 'Szándék a holnapra', free: 'Szabadon írva' },
  ru: { title: 'Твой Дневник', back: '← Сегодня', write_ph: 'Пиши свободно…', save: 'Оставить здесь', saving: '…', unlock_once: 'То, что ты пишешь здесь, остаётся между тобой и водой. Никто другой это не читает.', locked_hint: 'Свободное письмо откроется через ещё несколько дней присутствия.', empty: 'Пока ничего не написано. Всё начинается с первого ритуала.', sleep: 'Как ты спал(а)', morning_intention: 'Утреннее намерение', evening_journal: 'Вечерние мысли', gratitude: 'Благодарность', evening_intention: 'Намерение на завтра', free: 'Написано свободно' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

const UNLOCK_SEEN_KEY = 'journal_unlock_seen'

export default function JournalPage() {
  const [globalLang] = useLanguage()
  const lang = globalLang || 'en'
  const [pages, setPages] = useState([])
  const [activeDays, setActiveDays] = useState(0)
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [showUnlockNote, setShowUnlockNote] = useState(false)

  const load = () => {
    fetch(`/api/journal?tz=${clientTzOffset()}&lang=${lang}`)
      .then(r => r.json())
      .then(d => { if (d.success) { setPages(d.pages); setActiveDays(d.activeDays) } setLoading(false) })
      .catch(() => setLoading(false))
  }

  // Fix GCAO (02.08.2026): useLanguage() e 'en' pe primul render (citește
  // localStorage abia in propriul useEffect); cu deps goale, load() ramanea
  // blocat cu acel 'en' initial pentru totdeauna, chiar daca limba reala era
  // alta — planul dacă-atunci din jurnal (A1) aparea cu conectori in engleza
  // in orice alta limba. Se re-executa acum de fiecare data cand lang se
  // stabilizeaza la valoarea reala.
  useEffect(load, [lang])

  useEffect(() => {
    if (loading || activeDays < 3) return
    try {
      if (!localStorage.getItem(UNLOCK_SEEN_KEY)) {
        setShowUnlockNote(true)
        localStorage.setItem(UNLOCK_SEEN_KEY, '1')
      }
    } catch (e) {}
  }, [loading, activeDays])

  const canWrite = activeDays >= 3

  const save = () => {
    if (saving || !draft.trim()) return
    setSaving(true)
    fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: draft.trim(), tz: clientTzOffset() }),
    })
      .then(r => r.json())
      .then(d => {
        setSaving(false)
        if (d.success) { setDraft(''); load() }
      })
      .catch(() => setSaving(false))
  }

  const fmtDate = (dateStr) => {
    try {
      return new Date(`${dateStr}T12:00:00Z`).toLocaleDateString(lang, { weekday: 'long', month: 'long', day: 'numeric' })
    } catch (e) { return dateStr }
  }

  if (loading) {
    return <main style={{ padding: '120px 24px' }}><WaterLoader /></main>
  }

  return (
    <main className="room-shell" style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 100px' }}>
      <Link href="/dashboard" style={s.back}>{lx(lang, 'back')}</Link>
      <h1 style={s.title}>{lx(lang, 'title')}</h1>

      {showUnlockNote && (
        <p style={s.unlockNote} className="anim-fade-in">{lx(lang, 'unlock_once')}</p>
      )}

      {canWrite ? (
        <div className="glass" style={s.writeCard}>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={lx(lang, 'write_ph')}
            rows={4}
            className="input-clean journal-paper"
            style={s.textarea}
          />
          <button onClick={save} disabled={saving || !draft.trim()} className="pill-btn" style={s.saveBtn}>
            {saving ? lx(lang, 'saving') : lx(lang, 'save')}
          </button>
        </div>
      ) : (
        <p style={s.lockedHint}>{lx(lang, 'locked_hint')}</p>
      )}

      {pages.length === 0 ? (
        <p style={s.empty}>{lx(lang, 'empty')}</p>
      ) : (
        pages.map(page => (
          <section key={page.date} style={s.page}>
            <p style={s.pageDate}>{fmtDate(page.date)}</p>
            {page.entries.map((e, i) => (
              <div key={i} style={s.entry}>
                <p style={s.entryLabel}>{lx(lang, e.label)}</p>
                <p style={s.entryText}>{e.text}</p>
              </div>
            ))}
          </section>
        ))
      )}

      <RoomNav lang={lang} />
    </main>
  )
}

// GCAO 05.08.2026 — "Apa vie": fundalul e acum shader-ul viu, nu un video
// static — textul care plutea deja fără casetă (titlu, link, intrările
// jurnalului) primește text-shadow, ca protecție de lizibilitate (regula
// scrim), fără nicio restructurare de conținut/layout.
const shadow = '0 1px 8px rgba(6,10,18,.6)'
const s = {
  back: { display: 'inline-block', marginBottom: '18px', fontSize: '14px', color: 'var(--text-light)', textShadow: shadow },
  title: { fontFamily: 'Cormorant Garamond, serif', fontSize: '30px', fontWeight: '600', color: 'var(--text)', marginBottom: '18px', textShadow: shadow },
  unlockNote: { fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px', padding: '14px 16px', borderRadius: '12px', background: 'var(--gold-faint)' },
  writeCard: { padding: '20px', marginBottom: '28px' },
  textarea: { width: '100%', resize: 'none', fontFamily: 'inherit', lineHeight: 1.7, boxSizing: 'border-box' },
  saveBtn: { marginTop: '14px', width: '100%' },
  lockedHint: { fontSize: '13px', color: 'var(--text-light)', marginBottom: '28px', textShadow: shadow },
  empty: { fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--text-muted)', fontStyle: 'italic', textShadow: shadow },
  page: { marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' },
  pageDate: { fontSize: '12px', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px', textShadow: shadow },
  entry: { marginBottom: '14px' },
  entryLabel: { fontSize: '12px', color: 'var(--gold)', marginBottom: '4px', textShadow: shadow },
  entryText: { fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--text)', lineHeight: 1.65, textShadow: shadow },
}
