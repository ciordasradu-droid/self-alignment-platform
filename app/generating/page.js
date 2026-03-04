'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function GeneratingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Starting...')

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

    generateProfile(formData)
  }, [])

  const generateProfile = async (formData) => {
    try {
      setStatus('Calculating your profile...')

      const calcResponse = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth
        })
      })

      const calcData = await calcResponse.json()
      if (!calcData.success) {
        setStatus('Calculation failed: ' + (calcData.error || 'unknown error'))
        return
      }

      setStatus('Generating your alignment profile... (20-30 seconds)')

      const interpretResponse = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          calculated_profile_id: calcData.calculated_profile_id,
          calculated_data: calcData.data
        })
      })

      const interpretData = await interpretResponse.json()
      if (!interpretData.success) {
        setStatus('Interpretation failed: ' + (interpretData.error || 'unknown error'))
        return
      }

      localStorage.setItem('profile', JSON.stringify({
        full_name: formData.full_name,
        sections: interpretData.sections,
        swot: interpretData.swot,
        alignment_plan: interpretData.alignment_plan
      }))

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
        <p style={{ color:'var(--text-muted)', fontSize:'16px', lineHeight:'1.6' }}>
          {status}
        </p>
        <p style={{ color:'var(--text-light)', fontSize:'14px', marginTop:'24px' }}>
          Please don't close this window.
        </p>
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