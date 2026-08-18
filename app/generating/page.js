'use client'

// Destinație: app/generating/page.js  (ÎNLOCUIEȘTE COMPLET)
// Schimbare (fix bug plan gol): până acum, dacă POST-ul către interpret-plan
// depășea 30s (normal — serverul are nevoie de 60-120s), clientul abandona tot
// și NU mai făcea polling, deci planul rămânea null chiar dacă serverul îl
// termina. Acum POST-ul are voie să fie abandonat, iar polling-ul rulează
// oricum și prinde planul când e gata. Restul rămâne identic.
//
// P0 continuare (06.08.2026) — "generarea nu supraviețuiește ascunderii
// filei": întreg pipeline-ul (calculate -> interpret -> interpret-plan) era
// orchestrat 100% client-side, secvențial, într-un singur closure legat de
// instanța paginii. Dacă telefonul evacua tab-ul din memorie cât timp era în
// fundal, bucla murea fără nicio eroare — ecranul rămânea înghețat la
// nesfârșit, fiindcă nimic nu mai declanșa pasul următor. O revenire pe
// /generating remontează pagina de la zero oricum (asta face un tab evacuat
// la reload) — acum acel mount citește progresul deja salvat
// (calculatedData/interpretedProfileId, vezi PATCH în api/onboarding/session)
// și sare peste pașii deja făcuți, în loc să reia orbește sau să aștepte un
// client care nu mai există.

import { useState, useEffect, useRef, Suspense } from 'react'
import WaterLoader from '../components/water/WaterLoader'
import { useRouter, useSearchParams } from 'next/navigation'
import { t } from '../../lib/translations'
import { clientTzOffset } from '../../lib/logicalDay'

// Localized "still working" messages shown when a request hits the timeout
const TIMEOUT_MESSAGES = {
  en: 'Taking longer than usual. Please wait...',
  ro: 'Durează mai mult decât de obicei. Te rugăm să aștepți...'
}

// GCAO 06.08.2026 — reparatie P0: buton nou, cerut explicit, cu formularea
// exacta ceruta ("Incearca din nou"/"Try again") — nu o rescriere a
// textelor existente.
const RETRY_LABEL = { en: 'Try again', ro: 'Încearcă din nou' }
const STUCK_MESSAGE_DELAY_MS = 45000

// Safe fetch for short request/response calls. Guards against HTML error pages.
async function safeFetch(url, options, timeoutMs = 30000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)
    const contentType = response.headers.get('content-type') || ''

    if (!response.ok || !contentType.includes('application/json')) {
      throw new Error(
        `Request to ${url} failed (HTTP ${response.status}). ` +
        (response.status === 504 ? 'The server took too long to respond. Please try again.' :
         response.status === 502 ? 'Bad gateway. Please try again in a moment.' :
         'Unexpected server error. Please try again.')
      )
    }

    return response.json()
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

// Poll a status endpoint every intervalMs until status !== 'pending' or maxMs elapses.
// Mobile-friendly: each poll is a short request, so backgrounded tabs and flaky
// connections recover naturally on the next interval instead of dying mid-stream.
async function pollUntilComplete(url, { intervalMs = 3000, maxMs = 240000, onTick = null } = {}) {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    let data
    try {
      const res = await fetch(url, { cache: 'no-store' })
      data = await res.json()
    } catch (e) {
      // Transient network error — wait and retry within the overall budget
      await new Promise(r => setTimeout(r, intervalMs))
      continue
    }
    if (onTick) onTick(data)
    if (data.status === 'complete') return data
    if (data.status === 'failed') throw new Error(data.error || 'Generation failed')
    await new Promise(r => setTimeout(r, intervalMs))
  }
  throw new Error('Generation timed out')
}

// B2 (25.07): ordinea in care capitolele apar in prompt (nu neaparat ordinea
// exacta in care Claude le scrie, dar aproape) — folosita doar ca sa aratam
// bifele in ordine stabila, nu sarind aiurea daca sosesc putin altfel.
const CHAPTER_ORDER = ['archetype', 'how_you_work', 'strengths', 'decision_system', 'energy_manual', 'central_tension', 'aligned_life']

// P0 continuare (06.08.2026) — punctul 2b: "etapele existente devin vizibile
// ca pasi bifati". Textele NU se rescriu (interzis explicit in acest calup) —
// refolosim 3 din liniile deja traduse din generating_steps ca ancore pentru
// cele 3 mari etape ale pipeline-ului (harta / profil / plan), aceleasi
// etape la care rezuma logica de reluare de mai jos.
const MACRO_STAGE_ANCHORS = [0, 3, 5]

async function patchOnboardingSession(onboardingId, patch) {
  if (!onboardingId) return
  try {
    await fetch(`/api/onboarding/session?id=${encodeURIComponent(onboardingId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    })
  } catch (e) {
    // Non-fatal — persistenta progresului e un bonus de rezilienta, nu o
    // conditie pentru ca generarea curenta sa reuseasca.
  }
}

function GeneratingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [lang, setLang] = useState('en')
  const [error, setError] = useState(null)
  const [revealedChapters, setRevealedChapters] = useState([])
  // GCAO 06.08.2026 — reparatie P0: mesaj de asigurare daca un pas dureaza
  // neobisnuit de mult, plus posibilitatea de a incerca din nou fara sa te
  // intorci la onboarding (formData ramane in memorie).
  const [stuck, setStuck] = useState(false)
  const startedRef = useRef(false)
  const stuckTimerRef = useRef(null)

  const resetStuckTimer = () => {
    setStuck(false)
    clearTimeout(stuckTimerRef.current)
    stuckTimerRef.current = setTimeout(() => setStuck(true), STUCK_MESSAGE_DELAY_MS)
  }

  useEffect(() => {
    // Punctul 3 (audit 26.07, runda 2, gasit in timpul testarii): React
    // Strict Mode (dev) invoca efectul de doua ori — fara guard, generarea ar
    // porni de doua ori (cost dublu, doua randuri in DB). Guard-ul de mai jos
    // face efectul idempotent, indiferent de cate ori il invoca React.
    if (startedRef.current) return
    startedRef.current = true

    // Punctul 1 (audit 26.07, runda 2 — corectie dupa testul explicit al lui
    // Alex): niciodata date personale in query string — doar id-uri opace.
    // `id` = sesiunea de onboarding proprie (server-side, vezi
    // /api/onboarding/session); `session_id` = intoarcerea din Stripe
    // ({CHECKOUT_SESSION_ID}, vezi /api/checkout/session). Ambele sunt
    // re-citibile oricand — un refresh nu mai pierde formularul, fiindca nu
    // mai exista un pas "citește o singura data si sterge" pe client.
    const onboardingId = searchParams.get('id')
    const sessionId = searchParams.get('session_id')

    // P0 continuare (06.08.2026) — citeste si progresul deja salvat (nu doar
    // formularul), ca generateProfile sa poata sari peste pasii deja facuti
    // la o remontare (revenire dintr-un tab evacuat = reload complet).
    const fetchSession = async () => {
      if (sessionId) {
        try {
          const res = await fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
          const json = await res.json()
          if (json.success) return { formData: json.formData, calculatedData: null, interpretedProfileId: null }
        } catch (e) {}
        return null
      } else if (onboardingId) {
        try {
          const res = await fetch(`/api/onboarding/session?id=${encodeURIComponent(onboardingId)}`)
          const json = await res.json()
          if (json.success) return { formData: json.formData, calculatedData: json.calculatedData, interpretedProfileId: json.interpretedProfileId }
        } catch (e) {}
        return null
      }
      return undefined // niciun id — nu e o eroare de retea, doar lipsa datelor
    }

    const start = async () => {
      const session = await fetchSession()

      if (session === undefined) {
        router.push('/onboarding')
        return
      }
      if (!session) {
        setError(sessionId ? 'Error reading your payment. Please go back and try again.' : 'Error reading your data. Please go back and try again.')
        return
      }

      setLang(session.formData.language || 'en')
      resetStuckTimer()
      generateProfile(session, onboardingId)
    }

    start()

    return () => clearTimeout(stuckTimerRef.current)
  }, [])

  // GCAO 06.08.2026 — reparatie P0: reincearca generarea, fara sa te trimita
  // inapoi la onboarding. P0 continuare — citeste din nou progresul salvat
  // (nu doar formularul), deci un retry manual e acum acelasi mecanism ca
  // reluarea automata de la remontare: sare peste orice s-a facut deja.
  const retry = async () => {
    const onboardingId = searchParams.get('id')
    const sessionId = searchParams.get('session_id')
    setError(null)
    setStep(0)
    setRevealedChapters([])

    let session = null
    if (sessionId) {
      try {
        const res = await fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
        const json = await res.json()
        if (json.success) session = { formData: json.formData, calculatedData: null, interpretedProfileId: null }
      } catch (e) {}
    } else if (onboardingId) {
      try {
        const res = await fetch(`/api/onboarding/session?id=${encodeURIComponent(onboardingId)}`)
        const json = await res.json()
        if (json.success) session = { formData: json.formData, calculatedData: json.calculatedData, interpretedProfileId: json.interpretedProfileId }
      } catch (e) {}
    }

    if (!session) {
      setError(sessionId ? 'Error reading your payment. Please go back and try again.' : 'Error reading your data. Please go back and try again.')
      return
    }

    resetStuckTimer()
    generateProfile(session, onboardingId)
  }

  // Punctul 3 (audit 26.07, runda 2): mesajele de progres urmau un carusel pe
  // cronometru (un pas la 8s, cu % steps.length) — la peste 56s se relua de
  // la primul mesaj, dand impresia ca generarea a luat-o inapoi. Acum step-ul
  // avanseaza DOAR odata cu evenimente reale din pipeline si nu scade niciodata.
  const advanceStep = (min) => setStep(current => {
    const next = Math.max(current, min)
    if (next !== current) resetStuckTimer() // orice progres real amana mesajul de asigurare
    return next
  })

  // P0 continuare (06.08.2026) — semnatura schimbata: primeste `session`
  // (formData + progresul deja salvat, daca exista) si `onboardingId` (ca sa
  // poata scrie inapoi progresul nou facut). Fiecare etapa lunga verifica
  // intai daca s-a facut deja intr-o incercare anterioara si sare peste ea —
  // asta e reluarea generala ceruta explicit ("nu fix manual doar pentru
  // Alex"): functioneaza identic pentru orice cont a carui fila a fost
  // evacuata de browser in mijlocul generarii.
  const generateProfile = async (session, onboardingId) => {
    const formData = session.formData
    try {
      const language = formData.language || 'en'

      // Step 1 — calculate chart data (sarit daca era deja salvat)
      let calcData = session.calculatedData
      if (calcData) {
        advanceStep(1)
      } else {
        calcData = await safeFetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: formData.full_name,
            date_of_birth: formData.date_of_birth,
            time_of_birth: formData.time_of_birth,
            time_unknown: !!formData.time_unknown,
            city: formData.city,
            lat: formData.lat,
            lng: formData.lng,
            language,
            tz: clientTzOffset()
          })
        })
        if (!calcData.success) {
          setError('Calculation failed: ' + (calcData.error || 'unknown error'))
          return
        }
        advanceStep(1)
        await patchOnboardingSession(onboardingId, { calculated_data: calcData })
      }

      // Step 2 — start interpret (sarit daca exista deja un id salvat), apoi
      // poll pana la complet — poll-ul ruleaza mereu, indiferent daca POST-ul
      // a pornit acum sau intr-o incercare anterioara.
      let interpretedProfileId = session.interpretedProfileId
      if (!interpretedProfileId) {
        const startInterpret = await safeFetch('/api/interpret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: formData.full_name,
            calculated_profile_id: calcData.calculated_profile_id,
            calculated_data: calcData.data,
            language
          })
        })
        if (!startInterpret.success) {
          setError('Interpretation failed: ' + (startInterpret.error || 'unknown error'))
          return
        }
        interpretedProfileId = startInterpret.interpreted_profile_id
        await patchOnboardingSession(onboardingId, { interpreted_profile_id: interpretedProfileId })
      }
      advanceStep(2)

      const interpretData = await pollUntilComplete(
        `/api/interpret?id=${interpretedProfileId}`,
        {
          intervalMs: 1500, maxMs: 240000,
          onTick: (data) => {
            const keys = data.partial_sections ? Object.keys(data.partial_sections) : []
            if (keys.length) {
              setRevealedChapters(keys)
              advanceStep(keys.length >= 4 ? 4 : 3)
            }
          }
        }
      )
      advanceStep(4)

      // Step 3 — planul. Verificam INTAI daca e deja gata (o incercare
      // anterioara poate fi pornit deja after()-ul de pe server, chiar daca
      // clientul de-atunci nu mai exista) — doar daca nu e, (re)pornim POST-ul.
      let planData = {}
      advanceStep(5)
      try {
        let existing = null
        try {
          existing = await fetch(`/api/interpret-plan?id=${interpretedProfileId}`, { cache: 'no-store' }).then(r => r.json())
        } catch (e) {}

        if (existing && existing.status === 'complete') {
          planData = existing
        } else {
          try {
            await safeFetch('/api/interpret-plan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                interpreted_profile_id: interpretedProfileId,
                calculated_data: calcData.data,
                sections: interpretData.sections,
                swot: interpretData.swot,
                language
              })
            })
          } catch (postErr) {
            // Expected for long generations (client-side 30s abort). Server continues.
            console.warn('interpret-plan POST aborted/failed, polling anyway:', postErr.message)
          }
          planData = await pollUntilComplete(
            `/api/interpret-plan?id=${interpretedProfileId}`,
            { intervalMs: 3000, maxMs: 240000 }
          )
        }
      } catch (planErr) {
        console.warn('interpret-plan failed (non-fatal):', planErr.message)
      }
      advanceStep(6)

      const profilePayload = {
        full_name: formData.full_name,
        sections: interpretData.sections,
        swot: interpretData.swot,
        alignment_plan: planData.alignment_plan || null,
        action_plan: planData.action_plan || [],
        personal_year: calcData.data.numerology.personal_year,
        hd_data: calcData.data.human_design,
        // lentilele 1/2/3 de pe home au nevoie de toate trei perspectivele
        astro_data: calcData.data.astrology,
        numerology_data: calcData.data.numerology,
        interpreted_profile_id: interpretedProfileId,
        language
      }

      localStorage.setItem('profile', JSON.stringify(profilePayload))

      // Punctul 3 (audit 26.07, runda 3): sesiunea de onboarding (nume, data,
      // ora, orasul nasterii) nu mai e necesara odata ce profilul e creat —
      // stearsa explicit, nu lasata sa se acumuleze la nesfarsit.
      if (onboardingId) {
        try {
          await fetch(`/api/onboarding/session?id=${encodeURIComponent(onboardingId)}`, { method: 'DELETE' })
        } catch (e) {}
      }

      router.push('/profile')

    } catch (err) {
      clearTimeout(stuckTimerRef.current)
      if (err.name === 'AbortError') {
        const language = formData.language || 'en'
        setError(TIMEOUT_MESSAGES[language] || TIMEOUT_MESSAGES.en)
        return
      }
      setError('Error: ' + err.message)
    }
  }

  const steps = t(lang, 'generating_steps')
  const stepIndex = Math.min(step, steps.length - 1)

  if (error) return (
    <>
      <main style={{ maxWidth:'480px', margin:'120px auto', padding:'0 20px', textAlign:'center' }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px 24px',
          boxShadow: 'var(--shadow)'
        }}>
          <p style={{
            color: 'var(--text)',
            fontSize: '17px',
            fontWeight: 500,
            lineHeight: 1.6,
            marginBottom: '20px'
          }}>
            {error}
          </p>
          <button onClick={retry} className="pill-btn" style={{ width: '100%', marginBottom: '14px' }}>
            {RETRY_LABEL[lang] || RETRY_LABEL.en}
          </button>
          <a href="/onboarding" style={{
            color: 'var(--purple)',
            fontWeight: 600,
            fontSize: '15px'
          }}>
            ← Go back
          </a>
        </div>
      </main>
    </>
  )

  return (
    <>
      <main style={{ maxWidth:'480px', margin:'120px auto', padding:'0 20px', textAlign:'center' }}>
        <div style={{ marginBottom:'24px' }}><WaterLoader /></div>
        <h1 style={{
          fontSize:'26px',
          fontWeight:600,
          marginBottom:'18px',
          color:'var(--text)',
          fontFamily:'Cormorant Garamond, serif',
          lineHeight:1.2
        }}>
          {t(lang, 'generating_title')}
        </h1>
        <p style={{
          color:'var(--text)',
          fontSize:'16px',
          lineHeight:1.65,
          marginBottom:'8px',
          fontWeight:500
        }}>
          {steps[stepIndex]}
        </p>
        <p style={{
          color:'var(--text-muted)',
          fontSize:'14px',
          marginTop:'24px',
          lineHeight:1.6
        }}>
          {t(lang, 'generating_subtitle')}
        </p>

        {/* GCAO 06.08.2026 — reparatie P0: asigurare vizibila daca un pas
            dureaza neobisnuit de mult (45s+), ca asteptarea sa nu para
            moarta/inghetata — reuseste textul existent (TIMEOUT_MESSAGES). */}
        {stuck && (
          <p className="anim-fade-in" style={{
            color:'var(--text-light)',
            fontSize:'13px',
            fontStyle:'italic',
            marginTop:'14px',
            lineHeight:1.6
          }}>
            {TIMEOUT_MESSAGES[lang] || TIMEOUT_MESSAGES.en}
          </p>
        )}
        {/* P0 continuare (06.08.2026) — punctul 2a: "asteptarea respira".
            Linie de apa care creste cu etapele, in loc de puncte statice —
            varianta simpla tehnic (CSS pur, fara WebGL), dar miscarea trebuie
            sa se vada: umplere animata + un capat care sclipeste usor. */}
        <div className="gen-fill-track" aria-hidden="true">
          <div className="gen-fill-bar" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
        </div>

        {/* Punctul 2b: etapele mari devin pasi bifati, refolosind exact
            liniile deja traduse din generating_steps (fara text nou). */}
        <div style={{ marginTop:'18px', textAlign:'left', display:'inline-block' }}>
          {MACRO_STAGE_ANCHORS.map((anchor) => {
            if (stepIndex < anchor) return null
            const done = stepIndex > anchor
            return (
              <p key={anchor} className="anim-fade-in" style={{
                fontSize:'13px', color: done ? 'var(--text-muted)' : 'var(--text)', lineHeight:1.8,
                display:'flex', alignItems:'center', gap:'8px', fontWeight: done ? 400 : 500
              }}>
                <span style={{ color: done ? 'var(--purple)' : 'var(--gold)' }}>{done ? '✓' : '·'}</span>
                {steps[anchor]}
              </p>
            )
          })}
        </div>

        {/* B2 — capitolele apar pe masura ce sunt scrise, nu doar la final */}
        {revealedChapters.length > 0 && (
          <div style={{ marginTop:'28px', textAlign:'left', display:'inline-block' }}>
            {CHAPTER_ORDER.filter(k => revealedChapters.includes(k)).map(key => (
              <p key={key} className="anim-fade-in" style={{
                fontSize:'14px', color:'var(--text-muted)', lineHeight:1.8,
                display:'flex', alignItems:'center', gap:'8px'
              }}>
                <span style={{ color:'var(--purple)' }}>✓</span>
                {key === 'archetype' ? t(lang, 'archetype_label') : t(lang, key)}
              </p>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default function GeneratingPage() {
  return (
    <Suspense fallback={<main style={{ padding:'120px 24px' }}><WaterLoader /></main>}>
      <GeneratingContent />
    </Suspense>
  )
}