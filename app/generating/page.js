'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getUserId } from '../../lib/userId'
import { t } from '../../lib/translations'

// Safe fetch: guards against HTML error pages (504, 502, etc.) returned as non-JSON
async function safeFetch(url, options) {
  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type') || ''

  if (!response.ok || !contentType.includes('application/json')) {
    // Vercel returned an HTML error page — extract status for a useful message
    throw new Error(
      `Request to ${url} failed (HTTP ${response.status}). ` +
      (response.status === 504 ? 'The server took too long to respond. Please try again.' :
       response.status === 502 ? 'Bad gateway. Please try again in a moment.' :
       'Unexpected server error. Please try again.')
    )
  }

  return response.json()
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
      const userId = getUserId()
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
          user_id: userId,
          language
        })
      })
      if (!calcData.success) {
        setError('Calculation failed: ' + (calcData.error || 'unknown error'))
        return
      }

      // Step 2 — generate profile + self perspective (~25s)
      const interpretData = await safeFetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          calculated_profile_id: calcData.calculated_profile_id,
          calculated_data: calcData.data,
          user_id: userId,
          language
        })
      })
      if (!interpretData.success) {
        setError('Interpretation failed: ' + (interpretData.error || 'unknown error'))
        return
      }

      // Step 3 — generate alignment plan + action plan (~40-50s)
      // plan is non-fatal — continue even if it fails
      let planData = {}
      try {
        planData = await safeFetch('/api/interpret-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interpreted_profile_id: interpretData.interpreted_profile_id,
            calculated_data: calcData.data,
            sections: interpretData.sections,
            swot: interpretData.swot,
            language
          })
        })
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
        interpreted_profile_id: interpretData.interpreted_profile_id,
        language
      }

      localStorage.setItem('profile', JSON.stringify(profilePayload))
      router.push('/profile')

    } catch (err) {
      setError('Error: ' + err.message)
    }
  }

  const steps = t(lang, 'generating_steps')

  if (error) return (
    <>
      <div className="cosmic-bg" />
      <main style={{ maxWidth:'480px', margin:'120px auto', padding:'0 20px', textAlign:'center' }}>
        <p style={{ color:'var(--orange)', fontSize:'16px', marginBottom:'20px' }}>{error}</p>
        <a href="/onboarding" style={{ color:'var(--purple)', fontWeight:'600' }}>← Go back</a>
      </main>
    </>
  )

  return (
    <>
      <div className="cosmic-bg" />
      <main style={{ maxWidth:'480px', margin:'120px auto', padding:'0 20px', textAlign:'center' }}>
        <div style={{ fontSize:'48px', marginBottom:'24px' }}>✦</div>
        <h1 style={{ fontSize:'24px', fontWeight:'600', marginBottom:'16px', fontFamily:'Cormorant Garamond, serif' }}>
          {t(lang, 'generating_title')}
        </h1>
        <p style={{ color:'var(--text-muted)', fontSize:'16px', lineHeight:'1.6', marginBottom:'8px' }}>
          {steps[step]}
        </p>
        <p style={{ color:'var(--text-light)', fontSize:'13px', marginTop:'24px', lineHeight:'1.6' }}>
          {t(lang, 'generating_subtitle')}
        </p>
        <div style={{ marginTop:'32px', display:'flex', justifyContent:'center', gap:'6px' }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width:'8px', height:'8px', borderRadius:'50%',
              background: i === step ? 'var(--purple)' : 'var(--border)',
              transition:'background 0.3s'
            }} />
          ))}
        </div>
      </main>
    </>
  )
}

export default function GeneratingPage() {
  return (
    <Suspense fallback={<div style={{ textAlign:'center', padding:'80px' }}>Loading...</div>}>
      <GeneratingContent />
    </Suspense>
  )
}