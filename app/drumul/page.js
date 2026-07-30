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

// CLARITATE (30.07, punctul 1): subtitlul vechi ("Totul aici se deschide cu
// prezenta ta. Poti vedea harta completa.") nu spunea nimic despre CE e
// drumul — a devenit intro-ul hartii unificate, ancorat in metafora apei.
const L = {
  en: { title: 'Your Path', subtitle: 'Your path through water: seven states, ninety days. Each one opens with your presence.', opens_days: 'Opens after {n} active days', unlocked: 'Open', access_line: 'Everything you write here stays yours. The subscription opens your Patterns mirror and your personalized daily thought.', access_link: 'See the plan →' },
  ro: { title: 'Drumul Tău', subtitle: 'Drumul tău prin apă: șapte stări, nouăzeci de zile. Fiecare se deschide cu prezența ta.', opens_days: 'Se deschide după {n} zile active', unlocked: 'Deschis', access_line: 'Tot ce scrii aici rămâne al tău. Abonamentul deschide oglinda Tiparelor și gândul zilei personalizat.', access_link: 'Vezi planul →' },
  es: { title: 'Tu Camino', subtitle: 'Tu camino a través del agua: siete estados, noventa días. Cada uno se abre con tu presencia.', opens_days: 'Se abre después de {n} días activos', unlocked: 'Abierto', access_line: 'Todo lo que escribes aquí sigue siendo tuyo. La suscripción abre tu espejo de Patrones y tu pensamiento diario personalizado.', access_link: 'Ver el plan →' },
  fr: { title: 'Ton Chemin', subtitle: 'Ton chemin à travers l\'eau : sept états, quatre-vingt-dix jours. Chacun s\'ouvre avec ta présence.', opens_days: 'S\'ouvre après {n} jours actifs', unlocked: 'Ouvert', access_line: 'Tout ce que tu écris ici reste à toi. L\'abonnement ouvre ton miroir des Tendances et ta pensée du jour personnalisée.', access_link: 'Voir le plan →' },
  de: { title: 'Dein Weg', subtitle: 'Dein Weg durchs Wasser: sieben Zustände, neunzig Tage. Jeder öffnet sich mit deiner Präsenz.', opens_days: 'Öffnet sich nach {n} aktiven Tagen', unlocked: 'Offen', access_line: 'Alles, was du hier schreibst, bleibt dein Eigentum. Das Abo öffnet deinen Muster-Spiegel und deinen persönlichen Tagesgedanken.', access_link: 'Plan ansehen →' },
  it: { title: 'Il Tuo Cammino', subtitle: 'Il tuo cammino attraverso l\'acqua: sette stati, novanta giorni. Ognuno si apre con la tua presenza.', opens_days: 'Si apre dopo {n} giorni attivi', unlocked: 'Aperto', access_line: 'Tutto quello che scrivi qui resta tuo. L\'abbonamento apre il tuo specchio dei Modelli e il tuo pensiero del giorno personalizzato.', access_link: 'Vedi il piano →' },
  pt: { title: 'O Teu Caminho', subtitle: 'O teu caminho através da água: sete estados, noventa dias. Cada um abre com a tua presença.', opens_days: 'Abre depois de {n} dias ativos', unlocked: 'Aberto', access_line: 'Tudo o que escreves aqui continua teu. A subscrição abre o teu espelho de Padrões e o teu pensamento do dia personalizado.', access_link: 'Ver o plano →' },
  nl: { title: 'Jouw Weg', subtitle: 'Jouw weg door het water: zeven staten, negentig dagen. Elke opent met jouw aanwezigheid.', opens_days: 'Gaat open na {n} actieve dagen', unlocked: 'Open', access_line: 'Alles wat je hier schrijft blijft van jou. Het abonnement opent je Patronenspiegel en je persoonlijke dagelijkse gedachte.', access_link: 'Bekijk het plan →' },
  pl: { title: 'Twoja Droga', subtitle: 'Twoja droga przez wodę: siedem stanów, dziewięćdziesiąt dni. Każdy otwiera się z twoją obecnością.', opens_days: 'Otwiera się po {n} aktywnych dniach', unlocked: 'Otwarte', access_line: 'Wszystko, co tu piszesz, zostaje twoje. Subskrypcja otwiera twoje Lustro Wzorców i twoją spersonalizowaną myśl dnia.', access_link: 'Zobacz plan →' },
  hu: { title: 'Az Utad', subtitle: 'Utad a vízen át: hét állapot, kilencven nap. Mindegyik a jelenléteddel nyílik meg.', opens_days: '{n} aktív nap után nyílik meg', unlocked: 'Nyitva', access_line: 'Minden, amit itt írsz, a tiéd marad. Az előfizetés megnyitja a Minták tükrét és a személyre szabott napi gondolatodat.', access_link: 'Terv megtekintése →' },
  ru: { title: 'Твой Путь', subtitle: 'Твой путь через воду: семь состояний, девяносто дней. Каждое открывается твоим присутствием.', opens_days: 'Открывается после {n} активных дней', unlocked: 'Открыто', access_line: 'Всё, что ты пишешь здесь, остаётся твоим. Подписка открывает твоё зеркало Закономерностей и твою персональную мысль дня.', access_link: 'Смотреть план →' },
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

// CLARITATE (30.07, punctul 2): sfera luminoasa (cerc perfect alb-galbui,
// plutind deasupra apei) incalca decizia bulei organice (niciodata cerc
// perfect) si steaua polara (elementul traieste IN apa, nu deasupra) — scoasa
// complet de pe ecranul Drumul, fara inlocuitor provizoriu, pana la faza de
// design. Celebrarea de mai jos ramane doar text + buton, fara grafica.
const STAGE_MAP_L = {
  en: { day_exact: 'day {n}', day_approx: 'around day {n}', celebrate_title: 'You\'ve reached a new stage.', celebrate_cta: 'Continue' },
  ro: { day_exact: 'ziua {n}', day_approx: 'în jurul zilei {n}', celebrate_title: 'Ai ajuns la un stadiu nou.', celebrate_cta: 'Continuă' },
  es: { day_exact: 'día {n}', day_approx: 'alrededor del día {n}', celebrate_title: 'Has llegado a una nueva etapa.', celebrate_cta: 'Continuar' },
  fr: { day_exact: 'jour {n}', day_approx: 'autour du jour {n}', celebrate_title: 'Tu as atteint une nouvelle étape.', celebrate_cta: 'Continuer' },
  de: { day_exact: 'Tag {n}', day_approx: 'um Tag {n}', celebrate_title: 'Du hast eine neue Stufe erreicht.', celebrate_cta: 'Weiter' },
  it: { day_exact: 'giorno {n}', day_approx: 'intorno al giorno {n}', celebrate_title: 'Hai raggiunto una nuova fase.', celebrate_cta: 'Continua' },
  pt: { day_exact: 'dia {n}', day_approx: 'por volta do dia {n}', celebrate_title: 'Chegaste a uma nova fase.', celebrate_cta: 'Continuar' },
  nl: { day_exact: 'dag {n}', day_approx: 'rond dag {n}', celebrate_title: 'Je hebt een nieuwe fase bereikt.', celebrate_cta: 'Verder' },
  pl: { day_exact: 'dzień {n}', day_approx: 'około dnia {n}', celebrate_title: 'Dotarłeś do nowego etapu.', celebrate_cta: 'Dalej' },
  hu: { day_exact: '{n}. nap', day_approx: 'a(z) {n}. nap körül', celebrate_title: 'Elértél egy új szakaszt.', celebrate_cta: 'Tovább' },
  ru: { day_exact: 'день {n}', day_approx: 'около дня {n}', celebrate_title: 'Ты достиг нового этапа.', celebrate_cta: 'Далее' },
}
const sx = (lang, k) => (STAGE_MAP_L[lang] || STAGE_MAP_L.en)[k]
const STAGE_SEEN_KEY = 'stage_map_last_seen'

// CLARITATE (30.07, punctul 1): O SINGURA HARTA — inainte existau doua liste
// separate (stadiile poetice fara nicio explicatie + "Drumul Tau" cu
// deblocarile). STAGES si ROADMAP au exact 7 intrari fiecare, in aceeasi
// ordine de prezenta (0/1, 3, 7, 7-scris, 30, 60, 90) — le imperechem
// pozitional: fiecare rand = nume stadiu + ziua + ce se deschide + rostul.
const JOURNEY = STAGES.map((stage, i) => ({ stage, unlock: ROADMAP[i] }))

function JourneyMap({ lang, day, presence }) {
  const currentIdx = stageIndexForDay(day)
  return (
    <div className="chapter">
      <div style={{ padding: '22px' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#f4f0ea', marginBottom: '4px' }}>
          {lx(lang, 'title')}
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(244,240,234,0.55)', lineHeight: 1.5, marginBottom: '20px' }}>
          {lx(lang, 'subtitle')}
        </p>
        {JOURNEY.map(({ stage, unlock }, i) => {
          const isPast = i < currentIdx
          const isCurrent = i === currentIdx
          const isFuture = i > currentIdx
          const isLast = i === JOURNEY.length - 1
          const unlocked = isUnlocked(unlock.threshold, unlock.metric, presence)
          const dayText = (i <= 1 ? sx(lang, 'day_exact') : sx(lang, 'day_approx')).replace('{n}', stage.day)
          return (
            <div key={stage.key} style={{ display: 'flex', gap: '14px', minHeight: '54px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16px', flexShrink: 0 }}>
                <span style={{
                  width: isCurrent ? '12px' : '9px', height: isCurrent ? '12px' : '9px', borderRadius: '50%', flexShrink: 0,
                  background: isCurrent ? '#e5a93c' : (isPast || unlocked) ? 'rgba(229,169,60,0.4)' : 'rgba(244,240,234,0.15)',
                  boxShadow: isCurrent ? '0 0 10px rgba(229,169,60,0.6)' : 'none',
                }} />
                {!isLast && <span style={{ width: '2px', flex: 1, marginTop: '4px', marginBottom: '4px', background: (isPast || isCurrent) ? 'rgba(229,169,60,0.3)' : 'rgba(244,240,234,0.08)' }} />}
              </div>
              <div style={{ paddingBottom: '18px', opacity: isFuture && !unlocked ? 0.55 : 1 }}>
                <p style={{ fontSize: isCurrent ? '16px' : '14.5px', fontWeight: isCurrent ? 600 : 500, color: '#f4f0ea', fontFamily: 'Cormorant Garamond, serif', marginBottom: '2px' }}>
                  {stage[lang] || stage.en}
                  <span style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(244,240,234,0.4)', fontStyle: 'italic', marginLeft: '8px' }}>
                    {dayText}
                  </span>
                </p>
                <p style={{ fontSize: '13.5px', color: '#f4f0ea', marginTop: '4px' }}>
                  <strong style={{ fontWeight: 600 }}>{lang === 'ro' ? unlock.ro : unlock.en}</strong>
                  {': '}
                  <span style={{ color: 'rgba(244,240,234,0.65)' }}>{lang === 'ro' ? unlock.ro_d : unlock.en_d}</span>
                </p>
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

      <JourneyMap lang={lang} day={day} presence={presence} />

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
