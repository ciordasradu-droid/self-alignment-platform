'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const code = params.code
    if (code) {
      localStorage.setItem('referred_by', code)
    }
    router.push('/onboarding')
  }, [])

  return (
    <>
      <div className="cosmic-bg" />
      <main style={{ maxWidth:'480px', margin:'120px auto', padding:'0 20px', textAlign:'center' }}>
        <div style={{ fontSize:'48px', marginBottom:'24px' }}>✦</div>
        <h1 style={{ fontSize:'24px', fontWeight:'600', marginBottom:'16px', fontFamily:'Cormorant Garamond, serif' }}>
          You've been invited
        </h1>
        <p style={{ color:'var(--text-muted)', fontSize:'16px', lineHeight:'1.6' }}>
          Taking you to your free profile...
        </p>
      </main>
    </>
  )
}