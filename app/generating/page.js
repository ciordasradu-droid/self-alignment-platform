'use client'

// Destinație: app/generating/page.js  (ÎNLOCUIEȘTE COMPLET)
// Schimbare (fix bug plan gol): până acum, dacă POST-ul către interpret-plan
// depășea 30s (normal — serverul are nevoie de 60-120s), clientul abandona tot
// și NU mai făcea polling, deci planul rămânea null chiar dacă serverul îl
// termina. Acum POST-ul are voie să fie abandonat, iar polling-ul rulează
// oricum și prinde planul când e gata. Restul rămâne identic.

import { useState, useEffect, Suspense } from 'react'
import WaterLoader from '../components/water/WaterLoader'
import { useRouter, useSearchParams } from 'next/navigation'
import { t } from '../../lib/translations'

// Localized "still working" messages shown when a request hits the timeout
const TIMEOUT_MESSAGES = {
  en: 'Taking longer than usual. Please wait...',
  ro: 'Durează mai mult decât de obicei. Te rugăm să aștepți...'
}

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
async function pollUntilComplete(url, { intervalMs = 3000, maxMs = 240000 } = {}) {
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
    if (data.status === 'complete') return data
    if (data.status === 'failed') throw new Error(data.error || 'Generation failed')
    await new Promise(r => setTimeout(r, intervalMs))
  }
  throw new Error('Generation timed out')
}

function GeneratingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [lang, setLang] = useState('en')
  const [error, setError] = useState(null)

  useEffect(() => {
    const data = searchParams.get('data')
    if (!data) { router.push('/onboarding'); return }

    let formData
    try {
      formData = JSON.parse(decodeURIComponent(data))
      setLang(formData.language || 'en')
    } catch (e) {
      setError('Error reading your data. Please go back and try again.')
      return
    }

    let stepIndex = 0
    const steps = t(formData.language || 'en', 'generating_steps')
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length
      setStep(stepIndex)
    }, 8000)

    generateProfile(formData).finally(() => clearInterval(interval))
  }, [])

  const generateProfile = async (formData) => {
    try {
      const language = formData.language || 'en'

      // Step 1 — calculate chart data
      const calcData = await safeFetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          time_of_birth: formData.time_of_birth,
          lat: formData.lat,
          lng: formData.lng,
          language
        })
      })
      if (!calcData.success) {
        setError('Calculation failed: ' + (calcData.error || 'unknown error'))
        return
      }

      // Step 2 — start interpret (returns id immediately), then poll until complete
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
      const interpretedProfileId = startInterpret.interpreted_profile_id

      const interpretData = await pollUntilComplete(
        `/api/interpret?id=${interpretedProfileId}`,
        { intervalMs: 1500, maxMs: 240000 }
      )

      // Step 3 — start plan, then poll. Plan is non-fatal.
      // The POST runs the full generation on the server (60-120s). Our client
      // timeout may abort the request, but the server keeps working — so we
      // IGNORE any POST error here and rely on polling to pick up the result.
      let planData = {}
      try {
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
      } catch (planErr) {
        console.warn('interpret-plan failed (non-fatal):', planErr.message)
      }

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
      router.push('/profile')

    } catch (err) {
      if (err.name === 'AbortError') {
        const language = formData.language || 'en'
        setError(TIMEOUT_MESSAGES[language] || TIMEOUT_MESSAGES.en)
        return
      }
      setError('Error: ' + err.message)
    }
  }

  const steps = t(lang, 'generating_steps')

  if (error) return (
    <>
      <div className="cosmic-bg" />
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
      <div className="cosmic-bg" />
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
          {steps[step]}
        </p>
        <p style={{
          color:'var(--text-muted)',
          fontSize:'14px',
          marginTop:'24px',
          lineHeight:1.6
        }}>
          {t(lang, 'generating_subtitle')}
        </p>
        <div style={{ marginTop:'32px', display:'flex', justifyContent:'center', gap:'8px' }} aria-hidden="true">
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? '24px' : '8px',
              height:'8px',
              borderRadius:'4px',
              background: i === step ? 'var(--purple)' : 'var(--border)',
              transition:'background 0.3s ease, width 0.3s ease'
            }} />
          ))}
        </div>
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