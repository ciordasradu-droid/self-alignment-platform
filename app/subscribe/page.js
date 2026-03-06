'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SubscribePage() {
  const [plan, setPlan] = useState('monthly')
  const [spotsLeft, setSpotsLeft] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/spots')
      .then(r => r.json())
      .then(data => setSpotsLeft(data.spots_left))
      .catch(() => setSpotsLeft(847))
  }, [])

  const handleSubscribe = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setLoading(false)
    }
  }

  const handleTryFree = () => {
    window.location.href = '/dashboard'
  }

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>

        {/* Header */}
        <div style={s.header}>
          <Link href="/" style={s.back}>← Back</Link>
        </div>

        {/* Hero */}
        <div style={s.hero}>
          <span className="tag tag-orange" style={{marginBottom:'16px', display:'inline-block'}}>
            Accountability System
          </span>
          <h1 style={s.title}>
            We are accountable to everyone.<br />
            <span style={s.accent}>Except ourselves.</span>
          </h1>
          <p style={s.subtitle}>
            The Accountability System keeps you aligned every day —
            with check-ins, pattern detection, and a structure built around who you actually are.
          </p>
        </div>

        {/* First 1000 banner */}
        {spotsLeft !== null && spotsLeft > 0 && (
          <div style={s.spotsBanner}>
            <div style={s.spotsLeft}>
              <span style={s.spotsNum}>{spotsLeft}</span>
              <span style={s.spotsLabel}>spots left</span>
            </div>
            <p style={s.spotsText}>
              The first 1,000 people to start their accountability journey get their <strong>first month free</strong>. No credit card needed for the trial.
            </p>
          </div>
        )}

        {/* Plan toggle */}
        <div style={s.toggle}>
          <button
            onClick={() => setPlan('monthly')}
            style={{
              ...s.toggleBtn,
              background: plan === 'monthly' ? 'var(--purple)' : 'transparent',
              color: plan === 'monthly' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setPlan('annual')}
            style={{
              ...s.toggleBtn,
              background: plan === 'annual' ? 'var(--purple)' : 'transparent',
              color: plan === 'annual' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Annual <span style={s.saveBadge}>Save 2 months</span>
          </button>
        </div>

        {/* Pricing card */}
        <div style={s.pricingCard}>
          <div style={s.priceRow}>
            <span style={s.price}>
              {plan === 'monthly' ? '€8' : '€80'}
            </span>
            <span style={s.period}>
              {plan === 'monthly' ? '/month' : '/year'}
            </span>
            {plan === 'annual' && (
              <span style={s.annualNote}>2 months free</span>
            )}
          </div>

          <div style={s.features}>
            {[
              { icon:'◎', text:'Daily alignment check-in — 2 minutes' },
              { icon:'⚡', text:'Personal alignment score — updated daily' },
              { icon:'⟳', text:'Streak tracking — build real consistency' },
              { icon:'🪞', text:'Weekly review — reflect and reset' },
              { icon:'◦', text:'Shadow alerts — pattern detection' },
              { icon:'🧭', text:'Recalibration mode — when you drift' },
              { icon:'✦', text:'Personal year phase — always in context' },
            ].map((f, i) => (
              <div key={i} style={s.feature}>
                <span style={{color:'var(--purple)', marginRight:'10px', fontSize:'16px'}}>{f.icon}</span>
                <span style={s.featureText}>{f.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={s.subscribeBtn}
          >
            {loading ? 'Redirecting...' : `Start for ${plan === 'monthly' ? '€8/month' : '€80/year'} →`}
          </button>

          <button onClick={handleTryFree} style={s.tryFreeBtn}>
            Try for free first →
          </button>

          <p style={s.guarantee}>
            🛡 30-day money-back guarantee. No questions asked.
          </p>
        </div>

        {/* What you need first */}
        <div style={s.profileNote}>
          <p style={s.profileNoteText}>
            Don't have your free profile yet?
          </p>
          <Link href="/onboarding" style={s.profileNoteLink}>
            Generate your free profile first →
          </Link>
        </div>

        {/* Guarantee section */}
        <div style={s.guaranteeSection}>
          <h2 style={s.guaranteeTitle}>Our promise to you</h2>
          <div style={s.guaranteeGrid}>
            <div style={s.guaranteeCard}>
              <p style={s.guaranteeIcon}>🛡</p>
              <p style={s.guaranteeCardTitle}>30-Day Money Back</p>
              <p style={s.guaranteeCardText}>If you're not satisfied in the first 30 days, we refund you fully. No questions, no hassle.</p>
            </div>
            <div style={s.guaranteeCard}>
              <p style={s.guaranteeIcon}>⚡</p>
              <p style={s.guaranteeCardTitle}>Cancel Anytime</p>
              <p style={s.guaranteeCardText}>No lock-in. Cancel your subscription at any time with one click. No penalties.</p>
            </div>
            <div style={s.guaranteeCard}>
              <p style={s.guaranteeIcon}>✦</p>
              <p style={s.guaranteeCardTitle}>Built Around You</p>
              <p style={s.guaranteeCardText}>Every feature is generated from your unique profile. This is not a generic app.</p>
            </div>
          </div>
        </div>

      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'640px', margin:'0 auto', padding:'40px 24px 80px' },
  header: { marginBottom:'32px' },
  back: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500' },
  hero: { textAlign:'center', marginBottom:'40px' },
  title: { fontSize:'clamp(32px, 5vw, 48px)', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.15', marginBottom:'16px' },
  accent: { color:'var(--orange)' },
  subtitle: { fontSize:'16px', color:'var(--text-muted)', lineHeight:'1.75', maxWidth:'480px', margin:'0 auto' },
  spotsBanner: { background:'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', borderRadius:'var(--radius)', padding:'20px 24px', marginBottom:'32px', display:'flex', gap:'20px', alignItems:'center' },
  spotsLeft: { textAlign:'center', flexShrink:0 },
  spotsNum: { display:'block', fontSize:'36px', fontWeight:'700', color:'var(--orange)', fontFamily:'Cormorant Garamond, serif', lineHeight:1 },
  spotsLabel: { display:'block', fontSize:'11px', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'1px', marginTop:'4px' },
  spotsText: { fontSize:'14px', color:'rgba(255,255,255,0.75)', lineHeight:'1.6' },
  toggle: { display:'flex', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'10px', padding:'4px', marginBottom:'24px' },
  toggleBtn: { flex:1, padding:'10px', borderRadius:'8px', border:'none', fontSize:'14px', fontWeight:'500', cursor:'pointer', transition:'all 0.2s' },
  saveBadge: { fontSize:'11px', background:'var(--green-light)', color:'var(--green)', padding:'2px 6px', borderRadius:'4px', marginLeft:'6px' },
  pricingCard: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'32px', marginBottom:'24px', boxShadow:'var(--shadow)' },
  priceRow: { display:'flex', alignItems:'baseline', gap:'6px', marginBottom:'28px' },
  price: { fontSize:'56px', fontWeight:'700', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1 },
  period: { fontSize:'18px', color:'var(--text-muted)' },
  annualNote: { fontSize:'13px', background:'var(--green-light)', color:'var(--green)', padding:'4px 10px', borderRadius:'20px', fontWeight:'600', marginLeft:'8px' },
  features: { marginBottom:'28px' },
  feature: { display:'flex', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' },
  featureText: { fontSize:'14px', color:'var(--text)', lineHeight:'1.5' },
  subscribeBtn: { width:'100%', padding:'16px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'500', cursor:'pointer', marginBottom:'12px', boxShadow:'0 4px 20px rgba(124,92,191,0.3)' },
  tryFreeBtn: { width:'100%', padding:'14px', background:'transparent', color:'var(--text-muted)', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'15px', fontWeight:'500', cursor:'pointer', marginBottom:'16px' },
  guarantee: { textAlign:'center', fontSize:'13px', color:'var(--text-muted)' },
  profileNote: { textAlign:'center', padding:'24px', background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', marginBottom:'32px' },
  profileNoteText: { fontSize:'14px', color:'var(--text-muted)', marginBottom:'8px' },
  profileNoteLink: { fontSize:'15px', color:'var(--purple)', fontWeight:'600' },
  guaranteeSection: { marginTop:'48px' },
  guaranteeTitle: { fontSize:'28px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', textAlign:'center', marginBottom:'24px' },
  guaranteeGrid: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px' },
  guaranteeCard: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'24px', textAlign:'center' },
  guaranteeIcon: { fontSize:'28px', marginBottom:'12px' },
  guaranteeCardTitle: { fontSize:'15px', fontWeight:'600', color:'var(--text)', marginBottom:'8px' },
  guaranteeCardText: { fontSize:'13px', color:'var(--text-muted)', lineHeight:'1.6' }
}