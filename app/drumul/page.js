'use client'

// DRUMUL — camera creșterii (sect. 7, locked). De sus în jos: stadiul curent
// (mic, viu) → harta unlock-urilor cu orizont vizibil → rândul de acces
// (proba gratuită) → conținutul deblocat (Jurnal/Tipare/Angajament) →
// Prezența ta (discret, jos). Revizuirea săptămânală nu mai e card separat
// aici — trăiește în ritualul de seară de vineri (z30+, A6, calup
// arhitectura 30.07 — mutat de pe dimineața de sâmbătă).

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import PatternsInsight from '../dashboard/components/PatternsInsight'
import CommitmentDocument from '../dashboard/components/CommitmentDocument'
import EchoMoment from '../dashboard/components/EchoMoment'
import Presence from '../components/Presence'
import RoomNav from '../components/RoomNav'
import WaterLoader from '../components/water/WaterLoader'
import { stageForDay, stageIndexForDay, STAGES } from '../components/water/waterState'
import { useLanguage } from '../../lib/language'
import { clientTzOffset } from '../../lib/logicalDay'

// A2 (decizie închisă 23.07): deblocările se leagă de PREZENȚĂ, nu de
// calendar. metric: 'days' = zile active (cel puțin un ritual făcut),
// 'entries' = consemnări scrise reale (jurnal/recunoștință/intenție/somn).
const ROADMAP = [
  { threshold: 0,  metric: 'days',    key: 'checkin',    en: 'Rituals + Daily Thought',         ro: 'Ritualurile + Gândul Zilei',          en_d: 'you fall into rhythm with yourself',                ro_d: 'intri în ritm cu tine' },
  { threshold: 3,  metric: 'days',    key: 'journal',    en: 'Free Journal',                     ro: 'Jurnal liber',                        en_d: 'a private space to write, any time — not only in the evening', ro_d: 'spațiu privat de scris, oricând, nu doar seara' },
  { threshold: 7,  metric: 'days',    key: 'plan',       en: 'Alignment Plan',                   ro: 'Plan de aliniere',                    en_d: 'your personalized roadmap, from your profile',       ro_d: 'foaia personalizată de parcurs, din profil' },
  { threshold: 7,  metric: 'entries', key: 'patterns',   en: 'Patterns',                         ro: 'Tipare',                               en_d: "the mirror of what you've written — what keeps returning", ro_d: 'oglinda a ce ai scris: ce revine' },
  { threshold: 30, metric: 'days',    key: 'review',     en: 'The Week, Seen',                   ro: 'Privirea săptămânii',                 en_d: 'the weekly reflection, lives in Friday evening\'s ritual',  ro_d: 'reflecția săptămânală, trăiește în ritualul de vineri seara' },
  { threshold: 60, metric: 'days',    key: 'commitment', en: 'Commitment With Yourself',         ro: 'Angajamentul cu Tine',                en_d: 'a personal document — read again anytime',           ro_d: 'un document personal, recitit oricând' },
  // A8 (decizie închisă 23.07): Cercul iese din harta afișată până la masă
  // critică de useri; în loc, la ziua 90 (echivalent prezență), placeholder
  // pentru reînnoirea Angajamentului. Fără componentă funcțională încă.
  { threshold: 90, metric: 'days',    key: 'renewal',    en: 'Renewing Your Commitment',          ro: 'Reînnoirea Angajamentului',           en_d: 'revisit what you wrote at day 60, and what comes next', ro_d: 'recitești ce ai scris la ziua 60, și ce urmează' },
]

const L = {
  en: { title: 'Your Path', subtitle: 'Everything here opens with presence. You can see the full map.', opens_days: 'Opens after {n} active days', unlocked: 'Open', access_line: 'Everything you write here stays yours. The subscription opens your Patterns mirror and your personalized daily thought.', access_link: 'See the plan →' },
  ro: { title: 'Drumul Tău', subtitle: 'Totul aici se deschide cu prezența ta. Poți vedea harta completă.', opens_days: 'Se deschide după {n} zile active', unlocked: 'Deschis', access_line: 'Tot ce scrii aici rămâne al tău. Abonamentul deschide oglinda Tiparelor și gândul zilei personalizat.', access_link: 'Vezi planul →' },
}

// A5 (calup arhitectura 30.07): Jurnalul liber s-a unificat in Jurnalul-carte
// (/dashboard/journal) — aici ramane doar un rand de acces catre el.
const JOURNAL_LINK_L = {
  en: { line: 'Your journal — everything you\'ve written, one page per day.', link: 'Open →' },
  ro: { line: 'Jurnalul tău — tot ce ai scris, o pagină pe zi.', link: 'Deschide →' },
  es: { line: 'Tu diario — todo lo que has escrito, una página por día.', link: 'Abrir →' },
  fr: { line: 'Ton journal — tout ce que tu as écrit, une page par jour.', link: 'Ouvrir →' },
  de: { line: 'Dein Tagebuch — alles, was du geschrieben hast, eine Seite pro Tag.', link: 'Öffnen →' },
  it: { line: 'Il tuo diario — tutto ciò che hai scritto, una pagina al giorno.', link: 'Apri →' },
  pt: { line: 'O teu diário — tudo o que escreveste, uma página por dia.', link: 'Abrir →' },
  nl: { line: 'Jouw dagboek — alles wat je hebt geschreven, één pagina per dag.', link: 'Openen →' },
  pl: { line: 'Twój dziennik — wszystko, co napisałeś, jedna strona dziennie.', link: 'Otwórz →' },
  hu: { line: 'A naplód — minden, amit írtál, egy oldal naponta.', link: 'Megnyitás →' },
  ru: { line: 'Твой дневник — всё, что ты написал, одна страница в день.', link: 'Открыть →' },
}
const jx = (lang, k) => (JOURNAL_LINK_L[lang] || JOURNAL_LINK_L.en)[k]
const lx = (lang, k) => (L[lang] || L.en)[k]

// D1/D2 (calup arhitectura 30.07): harta celor 7 stadii — trecute stinse,
// curent viu, viitoare abia ghicite + orizont ("se deschide in jurul zilei
// {n}"). Celebrare o singura data la trecerea intr-un stadiu nou.
const STAGE_MAP_L = {
  en: { horizon: 'Opens around day {n}', celebrate_title: 'You\'ve reached a new stage.', celebrate_cta: 'Continue' },
  ro: { horizon: 'Se deschide în jurul zilei {n}', celebrate_title: 'Ai ajuns la un stadiu nou.', celebrate_cta: 'Continuă' },
  es: { horizon: 'Se abre alrededor del día {n}', celebrate_title: 'Has llegado a una nueva etapa.', celebrate_cta: 'Continuar' },
  fr: { horizon: "S'ouvre autour du jour {n}", celebrate_title: 'Tu as atteint une nouvelle étape.', celebrate_cta: 'Continuer' },
  de: { horizon: 'Öffnet sich um Tag {n}', celebrate_title: 'Du hast eine neue Stufe erreicht.', celebrate_cta: 'Weiter' },
  it: { horizon: 'Si apre intorno al giorno {n}', celebrate_title: 'Hai raggiunto una nuova fase.', celebrate_cta: 'Continua' },
  pt: { horizon: 'Abre por volta do dia {n}', celebrate_title: 'Chegaste a uma nova fase.', celebrate_cta: 'Continuar' },
  nl: { horizon: 'Gaat open rond dag {n}', celebrate_title: 'Je hebt een nieuwe fase bereikt.', celebrate_cta: 'Verder' },
  pl: { horizon: 'Otwiera się około dnia {n}', celebrate_title: 'Dotarłeś do nowego etapu.', celebrate_cta: 'Dalej' },
  hu: { horizon: 'A(z) {n}. nap körül nyílik meg', celebrate_title: 'Elértél egy új szakaszt.', celebrate_cta: 'Tovább' },
  ru: { horizon: 'Открывается около дня {n}', celebrate_title: 'Ты достиг нового этапа.', celebrate_cta: 'Далее' },
}
const sx = (lang, k) => (STAGE_MAP_L[lang] || STAGE_MAP_L.en)[k]
const STAGE_SEEN_KEY = 'stage_map_last_seen'

function StageBubble({ stage }) {
  const glow = 0.25 + (stage.light || 0) * 0.6
  return (
    <div
      aria-hidden="true"
      style={{
        width: '56px', height: '56px', margin: '0 auto 14px',
        borderRadius: '48% 52% 45% 55% / 55% 45% 55% 45%',
        background: 'radial-gradient(circle at 38% 32%, #fff 0%, var(--pearl) 45%, var(--gold) 100%)',
        boxShadow: `0 0 ${18 + glow * 20}px rgba(229,169,60,${glow})`,
        animation: 'stage-bubble-breathe 6s ease-in-out infinite',
      }}
    />
  )
}

function StageMap({ lang, day }) {
  const currentIdx = stageIndexForDay(day)
  return (
    <div className="chapter" style={{ marginBottom: '18px' }}>
      <div style={{ padding: '22px' }}>
        <StageBubble stage={STAGES[currentIdx]} />
        {STAGES.map((st, i) => {
          const isPast = i < currentIdx
          const isCurrent = i === currentIdx
          const isFuture = i > currentIdx
          const isLast = i === STAGES.length - 1
          return (
            <div key={st.key} style={{ display: 'flex', gap: '14px', minHeight: '44px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16px', flexShrink: 0 }}>
                <span style={{
                  width: isCurrent ? '12px' : '9px', height: isCurrent ? '12px' : '9px', borderRadius: '50%', flexShrink: 0,
                  background: isCurrent ? '#e5a93c' : isPast ? 'rgba(229,169,60,0.4)' : 'rgba(244,240,234,0.15)',
                  boxShadow: isCurrent ? '0 0 10px rgba(229,169,60,0.6)' : 'none',
                }} />
                {!isLast && <span style={{ width: '2px', flex: 1, marginTop: '4px', marginBottom: '4px', background: isPast || isCurrent ? 'rgba(229,169,60,0.3)' : 'rgba(244,240,234,0.08)' }} />}
              </div>
              <div style={{ paddingBottom: '14px', opacity: isFuture ? 0.4 : isPast ? 0.6 : 1 }}>
                <p style={{ fontSize: isCurrent ? '15px' : '13.5px', fontWeight: isCurrent ? 600 : 400, color: '#f4f0ea', fontFamily: 'Cormorant Garamond, serif' }}>
                  {st[lang] || st.en}
                </p>
                {isFuture && (
                  <p style={{ fontSize: '11px', color: 'rgba(244,240,234,0.4)', fontStyle: 'italic', marginTop: '2px' }}>
                    {sx(lang, 'horizon').replace('{n}', st.day)}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StageCelebration({ lang, stage, onDismiss }) {
  return (
    <div
      onClick={onDismiss}
      className="anim-fade-in"
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,6,16,0.88)', backdropFilter: 'blur(8px)', cursor: 'pointer', padding: '24px', textAlign: 'center' }}
    >
      <StageBubble stage={stage} />
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: 'rgba(244,240,234,0.7)', marginBottom: '8px' }}>
        {sx(lang, 'celebrate_title')}
      </p>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', color: '#f4f0ea', marginBottom: '28px' }}>
        {stage[lang] || stage.en}
      </p>
      <button onClick={onDismiss} className="pill-btn">{sx(lang, 'celebrate_cta')}</button>
    </div>
  )
}

// D6-fix (25.07): formulare naturala, nu ordinal clinic ("a 7-a") — trecuta
// prin Regula de Voce. Legata de threshold=7 (singurul unlock pe 'entries').
const OPENS_ENTRIES_TEXT = {
  en: "Opens after you've written seven times",
  ro: 'Se deschide după ce scrii de șapte ori',
  es: 'Se abre después de escribir siete veces',
  fr: "S'ouvre après avoir écrit sept fois",
  de: 'Öffnet sich, nachdem du siebenmal geschrieben hast',
  it: 'Si apre dopo che hai scritto sette volte',
  pt: 'Abre depois de escreveres sete vezes',
  nl: 'Gaat open nadat je zeven keer hebt geschreven',
  pl: 'Otwiera się, gdy napiszesz siedem razy',
  hu: 'Miután hétszer írtál, megnyílik',
  ru: 'Открывается после того, как ты напишешь семь раз',
}
const opensEntriesText = (lang) => OPENS_ENTRIES_TEXT[lang] || OPENS_ENTRIES_TEXT.en

// TODO(texte de lucru): rand de acces pentru neabonati (proba gratuita, nu
// abonament real), sub harta. Simplu, pana vine formularea finala.
function AccessLine({ lang }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    // 25.07: 'subscribed=' nu era niciodata setat ca si cookie real (vezi
    // proxy.js) — orice abonat cu un try_free vechi vedea gresit acest rand.
    // Sursa reala acum: /api/subscription (acelasi endpoint pe care se
    // bazeaza si gate-ul de mai jos).
    let hasTrial = false
    try { hasTrial = /(?:^|;\s*)try_free=/.test(document.cookie) } catch (e) {}
    if (!hasTrial) return
    fetch('/api/subscription')
      .then(r => r.json())
      .then(d => setShow(hasTrial && !d.subscribed))
      .catch(() => {})
  }, [])
  if (!show) return null
  return (
    <div style={{ textAlign: 'center', padding: '4px 20px 20px' }}>
      <p style={{ fontSize: '12.5px', color: 'rgba(244,240,234,0.5)', lineHeight: 1.5, marginBottom: '8px' }}>
        {lx(lang, 'access_line')}
      </p>
      <a href="/subscribe" style={{ fontSize: '12.5px', color: 'var(--amber)', fontWeight: 600 }}>
        {lx(lang, 'access_link')}
      </a>
    </div>
  )
}

function isUnlocked(threshold, metric, presence) {
  const value = metric === 'entries' ? presence.writtenEntries : presence.activeDays
  return value >= threshold
}

function Roadmap({ lang, presence }) {
  const t = L[lang] || L.en
  return (
    <div className="chapter">
      <div style={{ padding: '22px' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#f4f0ea', marginBottom: '4px' }}>
          {lx(lang, 'title')}
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(244,240,234,0.55)', lineHeight: 1.5, marginBottom: '20px' }}>
          {lx(lang, 'subtitle')}
        </p>
        <div>
          {ROADMAP.map((r, i) => {
            const unlocked = isUnlocked(r.threshold, r.metric, presence)
            const isLast = i === ROADMAP.length - 1
            const opensText = r.metric === 'entries' ? opensEntriesText(lang) : lx(lang, 'opens_days').replace('{n}', r.threshold)
            return (
              <div key={r.key} style={{ display: 'flex', gap: '14px', minHeight: '54px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16px', flexShrink: 0 }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                    background: unlocked ? '#e5a93c' : 'rgba(244,240,234,0.18)',
                    boxShadow: unlocked ? '0 0 8px rgba(229,169,60,0.5)' : 'none',
                  }} />
                  {!isLast && <span style={{ width: '2px', flex: 1, marginTop: '4px', marginBottom: '4px', background: unlocked ? 'rgba(229,169,60,0.35)' : 'rgba(244,240,234,0.1)' }} />}
                </div>
                <div style={{ paddingBottom: '18px', opacity: unlocked ? 1 : 0.55 }}>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#f4f0ea', marginBottom: '3px' }}>
                    {lang === 'ro' ? r.ro : r.en}
                  </p>
                  <p style={{ fontSize: '13px', color: 'rgba(244,240,234,0.6)', lineHeight: 1.5 }}>
                    {lang === 'ro' ? r.ro_d : r.en_d}
                  </p>
                  {!unlocked && r.threshold > 0 && (
                    <p style={{ fontSize: '11.5px', color: 'rgba(244,240,234,0.4)', marginTop: '4px', fontStyle: 'italic' }}>
                      {opensText}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DrumulContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [globalLang] = useLanguage()
  const [profileLang, setProfileLang] = useState('en')
  const lang = globalLang || profileLang || 'en'
  const [celebrating, setCelebrating] = useState(null) // stage object, sau null

  useEffect(() => {
    try {
      const stored = localStorage.getItem('profile')
      if (stored) {
        const p = JSON.parse(stored)
        if (p.language) setProfileLang(p.language)
      }
    } catch (e) {}
    fetch(`/api/dashboard?tz=${clientTzOffset()}`)
      .then(r => r.json())
      .then(d => { if (d.success) setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // D2 — celebrare o singura data, la trecerea intr-un stadiu nou (nu la
  // fiecare vizita si nu la primul stadiu, care nu e o "trecere").
  useEffect(() => {
    if (!data) return
    const idx = stageIndexForDay(data.day || 1)
    let lastSeen = null
    try { lastSeen = localStorage.getItem(STAGE_SEEN_KEY) } catch (e) {}
    if (lastSeen === null) {
      // prima vizita vreodata — doar inregistram, fara sarbatoare
      try { localStorage.setItem(STAGE_SEEN_KEY, String(idx)) } catch (e) {}
      return
    }
    if (parseInt(lastSeen, 10) !== idx) {
      setCelebrating(STAGES[idx])
      try { localStorage.setItem(STAGE_SEEN_KEY, String(idx)) } catch (e) {}
    }
  }, [data])

  if (loading) return <main style={{ padding: '120px 24px' }}><WaterLoader /></main>

  const day = data?.day || 1
  const streak = data?.streak?.current_streak || 0
  const presence = { activeDays: data?.activeDays || 0, writtenEntries: data?.writtenEntries || 0 }

  return (
    <main className="room-shell">
      {celebrating && (
        <StageCelebration lang={lang} stage={celebrating} onDismiss={() => setCelebrating(null)} />
      )}

      <StageMap lang={lang} day={day} />

      <Roadmap lang={lang} presence={presence} />
      <AccessLine lang={lang} />

      <EchoMoment lang={lang} />

      {isUnlocked(3, 'days', presence) && (
        <div className="glass" style={{ padding: '20px 22px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
            {jx(lang, 'line')}
          </p>
          <Link href="/dashboard/journal" style={{ fontSize: '13px', color: 'var(--gold)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {jx(lang, 'link')}
          </Link>
        </div>
      )}
      {isUnlocked(7, 'entries', presence) && <PatternsInsight lang={lang} />}
      {isUnlocked(60, 'days', presence) && <CommitmentDocument lang={lang} />}

      <Presence streak={streak} lang={lang} />

      <RoomNav lang={lang} />
    </main>
  )
}

export default function DrumulPage() {
  return (
    <Suspense fallback={<main style={{ padding: '120px 24px' }}><WaterLoader /></main>}>
      <DrumulContent />
    </Suspense>
  )
}
