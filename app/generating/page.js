'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getUserId } from '../../lib/userId'

function GeneratingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Starting...')
  const [step, setStep] = useState(0)

  const steps = [
    'Calculating your astrology chart...',
    'Mapping your numerology...',
    'Reading your Human Design...',
    'Synthesizing your profile...',
    'Writing your alignment plan...',
    'Almost ready...'
  ]

  useEffect(() => {
    const data = searchParams.get('data')
    if (!data) {
      router.push('/onboarding')
      return
    }

    let formData
    try {
      formData = JSON.parse(decodeURIComponent(data))
    } catch (e) {
      setStatus('Error reading your data. Please go back and try again.')
      return
    }

    // Cycle through status messages while generating
    let stepIndex = 0
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length
      setStep(stepIndex)
    }, 8000)

    generateProfile(formData).finally(() => clearInterval(interval))
  }, [])

  const generateProfile = async (formData) => {
    try {
      const userId = getUserId()

      const calcResponse = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          time_of_birth: formData.time_of_birth,
          lat: formData.lat,
          lng: formData.lng,
          user_id: userId
        })
      })

      const calcData = await calcResponse.json()
      if (!calcData.success) {
        setStatus('Calculation failed: ' + (calcData.error || 'unknown error'))
        return
      }

      const interpretResponse = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          calculated_profile_id: calcData.calculated_profile_id,
          calculated_data: calcData.data,
          user_id: userId,
          language: formData.language || 'en'
        })
      })

      const interpretData = await interpretResponse.json()
      if (!interpretData.success) {
        setStatus('Interpretation failed: ' + (interpretData.error || 'unknown error'))
        return
      }

      const profilePayload = {
        full_name: formData.full_name,
        sections: interpretData.sections,
        swot: interpretData.swot,
        alignment_plan: interpretData.alignment_plan,
        personal_year: calcData.data.numerology.personal_year,
        interpreted_profile_id: interpretData.interpreted_profile_id,
        language: formData.language || 'en'
      }

      localStorage.setItem('profile', JSON.stringify(profilePayload))
      router.push('/profile')

    } catch (err) {
      setStatus('Error: ' + err.message)
    }
  }

  return (
    <>
      <div className="cosmic-bg" />
      <main style={{ maxWidth:'480px', margin:'120px auto', padding:'0 20px', textAlign:'center' }}>
        <div style={{ fontSize:'48px', marginBottom:'24px' }}>✦</div>
        <h1 style={{ fontSize:'24px', fontWeight:'600', marginBottom:'16px', fontFamily:'Cormorant Garamond, serif' }}>
          Building Your Profile
        </h1>
        <p style={{ color:'var(--text-muted)', fontSize:'16px', lineHeight:'1.6', marginBottom:'8px' }}>
          {steps[step]}
        </p>
        <p style={{ color:'var(--text-light)', fontSize:'13px', marginTop:'24px', lineHeight:'1.6' }}>
          We are combining three systems into one personalised profile.<br/>
          This takes 2-3 minutes — please don't close this window.
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