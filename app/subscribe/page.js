'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUserId } from '../../lib/userId'
import { t as tr } from '../../lib/translations'

const SUBSCRIBE_LABELS = {
  en: {
    back: '← Back',
    tag: 'Accountability System',
    title_line1: 'We are accountable to everyone.',
    title_line2: 'Except ourselves.',
    subtitle: 'The Accountability System keeps you aligned every day — with check-ins, pattern detection, and a structure built around who you actually are.',
    spots_left: 'spots left',
    spots_text_1: 'The first 1,000 people to start their accountability journey get their',
    spots_text_bold: 'first month free',
    spots_text_2: '. No credit card needed for the trial.',
    monthly: 'Monthly',
    annual: 'Annual',
    save_badge: 'Save 2 months',
    per_month: '/month',
    per_year: '/year',
    two_months_free: '2 months free',
    features: [
      { text: 'Daily alignment check-in — 2 minutes' },
      { text: 'Daily personalized insight — generated from your profile' },
      { text: 'Weekly reset — every Monday morning' },
      { text: 'Presence held gently, without scores' },
      { text: 'Weekly review — reflect and reset' },
      { text: 'Patterns — what is emerging in your journey' },
      { text: 'Personal year phase — always in context' },
      { text: 'Available in 10 languages' },
    ],
    subscribe_btn: 'Start for',
    redirecting: 'Redirecting...',
    try_free: 'Try for free first →',
    guarantee_badge: '30-day money-back guarantee. No questions asked.',
    no_profile_text: "Don't have your free profile yet?",
    no_profile_link: 'Generate your free profile first →',
    promise_title: 'Our promise to you',
    promise_1_title: '30-Day Money Back',
    promise_1_text: "If you're not satisfied in the first 30 days, we refund you fully. No questions, no hassle.",
    promise_2_title: 'Cancel Anytime',
    promise_2_text: 'No lock-in. Cancel your subscription at any time with one click. No penalties.',
    promise_3_title: 'Built Around You',
    promise_3_text: 'Every feature is generated from your unique profile. This is not a generic app.',
  },
  ro: {
    back: '← Înapoi',
    tag: 'Sistem de Responsabilitate',
    title_line1: 'Suntem responsabili față de toți.',
    title_line2: 'Mai puțin față de noi. Hai să schimbăm asta!',
    subtitle: 'Sistemul de Responsabilitate te menține aliniat în fiecare zi — cu check-in-uri, detectarea tiparelor și o structură construită în jurul a cine ești cu adevărat.',
    spots_left: 'locuri rămase',
    spots_text_1: 'Primii 1.000 de oameni care încep călătoria de responsabilitate primesc',
    spots_text_bold: 'prima lună gratuită',
    spots_text_2: '. Nu e nevoie de card de credit pentru încercare.',
    monthly: 'Lunar',
    annual: 'Anual',
    save_badge: 'Economisești 2 luni',
    per_month: '/lună',
    per_year: '/an',
    two_months_free: '2 luni gratuite',
    features: [
      { text: 'Check-in zilnic de aliniere — 2 minute' },
      { text: 'Gândul zilnic personalizat — generat din profilul tău' },
      { text: 'Reset săptămânal — în fiecare luni dimineața' },
      { text: 'Prezență ținută blând, fără scoruri' },
      { text: 'Revizuire săptămânală — reflectează și resetează' },
      { text: 'Tipare — ce se conturează în drumul tău' },
      { text: 'Faza anului personal — mereu în context' },
      { text: 'Disponibil în 10 limbi' },
    ],
    subscribe_btn: 'Începe pentru',
    redirecting: 'Redirecționare...',
    try_free: 'Încearcă gratuit mai întâi →',
    guarantee_badge: 'Garanție de returnare 30 de zile. Fără întrebări.',
    no_profile_text: 'Nu ai încă profilul gratuit?',
    no_profile_link: 'Generează-ți profilul gratuit mai întâi →',
    promise_title: 'Promisiunea noastră pentru tine',
    promise_1_title: 'Banii Înapoi în 30 de Zile',
    promise_1_text: 'Dacă nu ești satisfăcut în primele 30 de zile, îți returnăm banii integral. Fără întrebări.',
    promise_2_title: 'Anulează Oricând',
    promise_2_text: 'Fără angajament. Anulează abonamentul oricând cu un singur click. Fără penalități.',
    promise_3_title: 'Construit În Jurul Tău',
    promise_3_text: 'Fiecare funcționalitate e generată din profilul tău unic. Nu e o aplicație generică.',
  }
}

export default function SubscribePage() {
  const [plan, setPlan] = useState('monthly')
  const [spotsLeft, setSpotsLeft] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    // Detect user language from profile
    try {
      const stored = localStorage.getItem('profile')
      if (stored) {
        const profile = JSON.parse(stored)
        if (profile.language) setLang(profile.language)
      }
    } catch (e) {}

    fetch('/api/spots')
      .then(r => r.json())
      .then(data => setSpotsLeft(data.spots_left))
      .catch(() => setSpotsLeft(847))
  }, [])

  const labels = SUBSCRIBE_LABELS[lang] || SUBSCRIBE_LABELS['en']

  const handleSubscribe = async () => {
    setLoading(true)
    const userId = getUserId()
    const res = await fetch('/api/stripe/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, user_id: userId })
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setLoading(false)
    }
  }

  const handleTryFree = async () => {
    await fetch('/api/try-free', { method: 'POST' })
    window.location.href = '/dashboard'
  }

  const priceLabel = plan === 'monthly' ? '€8' : '€80'
  const periodLabel = plan === 'monthly' ? labels.per_month : labels.per_year

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>

        <div style={s.header}>
          <Link href="/" style={s.back}>{labels.back}</Link>
        </div>

        <div style={s.hero}>
          <span className="tag tag-orange" style={{marginBottom:'16px', display:'inline-block'}}>
            {labels.tag}
          </span>
          <h1 style={s.title}>
            {labels.title_line1}<br />
            <span style={s.accent}>{labels.title_line2}</span>
          </h1>
          <p style={s.subtitle}>{labels.subtitle}</p>
        </div>

        {spotsLeft !== null && spotsLeft > 0 && (
          <div style={s.spotsBanner}>
            <div style={s.spotsLeft}>
              <span style={s.spotsNum}>{spotsLeft}</span>
              <span style={s.spotsLabel}>{labels.spots_left}</span>
            </div>
            <p style={s.spotsText}>
              {labels.spots_text_1} <strong>{labels.spots_text_bold}</strong>{labels.spots_text_2}
            </p>
          </div>
        )}

        <div style={s.toggle}>
          <button
            onClick={() => setPlan('monthly')}
            style={{
              ...s.toggleBtn,
              background: plan === 'monthly' ? 'var(--purple)' : 'transparent',
              color: plan === 'monthly' ? '#fff' : 'var(--text-muted)'
            }}
          >
            {labels.monthly}
          </button>
          <button
            onClick={() => setPlan('annual')}
            style={{
              ...s.toggleBtn,
              background: plan === 'annual' ? 'var(--purple)' : 'transparent',
              color: plan === 'annual' ? '#fff' : 'var(--text-muted)'
            }}
          >
            {labels.annual} <span style={s.saveBadge}>{labels.save_badge}</span>
          </button>
        </div>

        <div style={s.pricingCard}>
          <div style={s.priceRow}>
            <span style={s.price}>{priceLabel}</span>
            <span style={s.period}>{periodLabel}</span>
            {plan === 'annual' && (
              <span style={s.annualNote}>{labels.two_months_free}</span>
            )}
          </div>

          <div style={s.features}>
            {labels.features.map((f, i) => (
              <div key={i} style={s.feature}>
                <span style={s.featureText}>{f.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={s.subscribeBtn}
          >
            {loading ? labels.redirecting : `${labels.subscribe_btn} ${priceLabel}${periodLabel} →`}
          </button>

          <button onClick={handleTryFree} style={s.tryFreeBtn}>
            {labels.try_free}
          </button>

          <p style={s.guarantee}>{labels.guarantee_badge}</p>
        </div>

        <div style={s.profileNote}>
          <p style={s.profileNoteText}>{labels.no_profile_text}</p>
          <Link href="/onboarding" style={s.profileNoteLink}>
            {labels.no_profile_link}
          </Link>
        </div>

        <div style={s.guaranteeSection}>
          <h2 style={s.guaranteeTitle}>{labels.promise_title}</h2>
          <div style={s.guaranteeGrid}>
            <div style={s.guaranteeCard}>
              <p style={s.guaranteeCardTitle}>{labels.promise_1_title}</p>
              <p style={s.guaranteeCardText}>{labels.promise_1_text}</p>
            </div>
            <div style={s.guaranteeCard}>
              <p style={s.guaranteeCardTitle}>{labels.promise_2_title}</p>
              <p style={s.guaranteeCardText}>{labels.promise_2_text}</p>
            </div>
            <div style={s.guaranteeCard}>
              <p style={s.guaranteeCardTitle}>{labels.promise_3_title}</p>
              <p style={s.guaranteeCardText}>{labels.promise_3_text}</p>
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
  back: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500', display:'inline-block', padding:'8px 12px', minHeight:'44px' },
  hero: { textAlign:'center', marginBottom:'40px' },
  title: { fontSize:'clamp(32px, 5vw, 48px)', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.15', marginBottom:'16px' },
  accent: { color:'var(--orange)' },
  subtitle: { fontSize:'16px', color:'var(--text-muted)', lineHeight:'1.75', maxWidth:'480px', margin:'0 auto' },
  spotsBanner: { background:'linear-gradient(135deg, var(--water-deep) 0%, var(--water-plum) 100%)', borderRadius:'var(--radius)', padding:'20px 24px', marginBottom:'32px', display:'flex', gap:'20px', alignItems:'center', flexWrap:'wrap' },
  spotsLeft: { textAlign:'center', flexShrink:0 },
  spotsNum: { display:'block', fontSize:'36px', fontWeight:'700', color:'var(--orange)', fontFamily:'Cormorant Garamond, serif', lineHeight:1 },
  spotsLabel: { display:'block', fontSize:'11px', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'1px', marginTop:'4px' },
  spotsText: { fontSize:'14px', color:'rgba(255,255,255,0.75)', lineHeight:'1.6' },
  toggle: { display:'flex', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'10px', padding:'4px', marginBottom:'24px' },
  toggleBtn: { flex:1, padding:'10px', borderRadius:'8px', border:'none', fontSize:'14px', fontWeight:'500', cursor:'pointer', transition:'all 0.2s', minHeight:'44px' },
  saveBadge: { fontSize:'11px', background:'var(--green-light)', color:'var(--green)', padding:'2px 6px', borderRadius:'4px', marginLeft:'6px' },
  pricingCard: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'clamp(16px, 4vw, 32px)', marginBottom:'24px', boxShadow:'var(--shadow)' },
  priceRow: { display:'flex', alignItems:'baseline', gap:'6px', marginBottom:'28px', flexWrap:'wrap' },
  price: { fontSize:'56px', fontWeight:'700', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1 },
  period: { fontSize:'18px', color:'var(--text-muted)' },
  annualNote: { fontSize:'13px', background:'var(--green-light)', color:'var(--green)', padding:'4px 10px', borderRadius:'20px', fontWeight:'600', marginLeft:'8px' },
  features: { marginBottom:'28px' },
  feature: { display:'flex', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' },
  featureText: { fontSize:'14px', color:'var(--text)', lineHeight:'1.5' },
  subscribeBtn: { width:'100%', padding:'16px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'500', cursor:'pointer', marginBottom:'12px', boxShadow:'0 4px 20px var(--gold-faint)' },
  tryFreeBtn: { width:'100%', padding:'14px', background:'transparent', color:'var(--text-muted)', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'15px', fontWeight:'500', cursor:'pointer', marginBottom:'16px' },
  guarantee: { textAlign:'center', fontSize:'13px', color:'var(--text-muted)' },
  profileNote: { textAlign:'center', padding:'24px', background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', marginBottom:'32px' },
  profileNoteText: { fontSize:'14px', color:'var(--text-muted)', marginBottom:'8px' },
  profileNoteLink: { fontSize:'15px', color:'var(--purple)', fontWeight:'600' },
  guaranteeSection: { marginTop:'48px' },
  guaranteeTitle: { fontSize:'28px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', textAlign:'center', marginBottom:'24px' },
  guaranteeGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'16px' },
  guaranteeCard: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'24px', textAlign:'center' },
  guaranteeCardTitle: { fontSize:'15px', fontWeight:'600', color:'var(--text)', marginBottom:'8px' },
  guaranteeCardText: { fontSize:'13px', color:'var(--text-muted)', lineHeight:'1.6' }
}