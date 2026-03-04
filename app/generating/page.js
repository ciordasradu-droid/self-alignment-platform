'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { Suspense } from 'react'

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

    const formData = JSON.parse(decodeURIComponent(data))
    generateProfile(formData)
  }, [])

  const generateProfile = async (formData) => {
    try {
      // Step 1 — Save birth data
      setStatus('Saving your details...')
      const { data: birthData, error: birthError } = await supabase
        .from('birth_data')
        .insert([formData])
        .select()

      if (birthError) throw birthError

      // Step 2 — Calculate profile
      setStatus('Calculating your profile...')
      const calcResponse = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          birth_data_id: birthData[0].id
        })
      })
      const calcData = await calcResponse.json()
      if (!calcData.success) throw new Error('Calculation failed')

      // Step 3 — Interpret profile
      setStatus('Generating your alignment profile... (this takes 20-30 seconds)')
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
      if (!interpretData.success) throw new Error('Interpretation failed')

      // Step 4 — Redirect to profile
      const profilePayload = {
        full_name: formData.full_name,
        sections: interpretData.sections,
        swot: interpretData.swot,
        alignment_plan: interpretData.alignment_plan
      }

      router.push('/profile?data=' + encodeURIComponent(JSON.stringify(profilePayload)))

    } catch (err) {
      console.error(err)
      setStatus('Something went wrong. Please contact support.')
    }
  }

  return (
    <main style={{ maxWidth: '480px', margin: '120px auto', padding: '0 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '24px' }}>⟳</div>
      <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
        Building Your Profile
      </h1>
      <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
        {status}
      </p>
      <p style={{ color: '#999', fontSize: '14px', marginTop: '24px' }}>
        Please don't close this window.
      </p>
    </main>
  )
}

export default function GeneratingPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px' }}>Loading...</div>}>
      <GeneratingContent />
    </Suspense>
  )
}