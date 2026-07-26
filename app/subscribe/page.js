'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../lib/language'
import { SUBSCRIBE_LABELS } from '../../lib/subscribeLabels'

// 25.07 seara: rescriere completa dupa Vocea Pragului (vezi master doc,
// sect. 3). Copy RO/EN validat verbatim de Alex; celelalte 9 limbi traduse
// ca intentie de implementator. Limba paginii vine acum din useLanguage()
// (aceeasi sursa ca /drumul, /dashboard, /onboarding), nu mai e re-derivata
// din profile.language — asta era sursa amestecului de limbi raportat.
// Continutul complet e in lib/subscribeLabels.js (extras acolo ca sa poata
// fi verificat direct de scripts/test-subscribe-copy.mjs, fara JSX).
export default function SubscribePage() {
  const [plan, setPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [lang] = useLanguage()

  // A3: contor viu, nu decorativ — daca /api/spots nu raspunde cu o cifra
  // reala, caseta ofertei nu se livreaza deloc (regula dura, Vocea Pragului 5).
  const [spotsLeft, setSpotsLeft] = useState(null)

  // A4: sursa reala de adevar (aceleasi endpoint-uri pe care se bazeaza si
  // restul aplicatiei — /api/subscription, /api/profile), NU localStorage.
  // Cat timp raspunsul nu a sosit, ambele blocuri conditionate stau ascunse
  // (altfel repetam clasa de bug de la salutul fara nume — D3, sesiunea
  // anterioara).
  const [authLoading, setAuthLoading] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [tryStarted, setTryStarted] = useState(false)

  useEffect(() => {
    fetch('/api/spots')
      .then(r => r.json())
      .then(d => { if (typeof d.spots_left === 'number') setSpotsLeft(d.spots_left) })
      .catch(() => {})

    try {
      setTryStarted(/(?:^|;\s*)try_free=/.test(document.cookie))
    } catch (e) {}

    Promise.all([
      fetch('/api/subscription').then(r => r.json()).catch(() => ({ subscribed: false })),
      fetch('/api/profile').then(r => ({ ok: r.ok })).catch(() => ({ ok: false })),
    ]).then(([sub, prof]) => {
      setSubscribed(!!sub.subscribed)
      setHasProfile(!!prof.ok)
      setAuthLoading(false)
    })

    // A7 — oferta planului anual la momentul Angajamentului (z60) trimite
    // aici cu anualul deja selectat, fara query param (fara Suspense nou).
    try {
      if (localStorage.getItem('subscribe_intent_plan') === 'annual') {
        setPlan('annual')
        localStorage.removeItem('subscribe_intent_plan')
      }
    } catch (e) {}
  }, [])

  const labels = SUBSCRIBE_LABELS[lang] || SUBSCRIBE_LABELS['en']

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

  const handleTryFree = async () => {
    await fetch('/api/try-free', { method: 'POST' })
    window.location.href = '/dashboard'
  }

  const priceLabel = plan === 'monthly' ? '€8' : '€80'
  const periodLabel = plan === 'monthly' ? labels.period_month : labels.period_year

  const showTryFree = !authLoading && !subscribed && !tryStarted
  const showNoProfile = !authLoading && !hasProfile

  return (
    <>
      <main style={s.wrap}>

        <div style={s.header}>
          <Link href="/" style={s.back}>{labels.back}</Link>
        </div>

        <div style={s.hero}>
          <h1 style={s.title}>
            {labels.title_line1}<br />
            <span style={s.accent}>{labels.title_line2}</span>
          </h1>
          <p style={s.bridge}>{labels.bridge}</p>
          <p style={s.subtitle}>{labels.subtitle}</p>
        </div>

        {!authLoading && subscribed ? (
          <div style={s.alreadyCard}>
            <p style={s.alreadyTitle}>{labels.already_title}</p>
            <p style={s.alreadyText}>{labels.already_text}</p>
            <Link href="/dashboard" style={s.alreadyLink}>{labels.already_link}</Link>
          </div>
        ) : (
          <>
            {typeof spotsLeft === 'number' && (
              <div style={s.offerBanner}>
                <p style={s.offerText}>{labels.offer_text.replace('{n}', spotsLeft)}</p>
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
                {labels.annual}
              </button>
            </div>

            <div style={s.pricingCard}>
              <div style={s.priceRow}>
                <span style={s.price}>{priceLabel}</span>
                <span style={s.period}>{periodLabel}</span>
              </div>

              <div style={s.features}>
                {labels.features.map((text, i) => (
                  <div key={i} style={s.feature}>
                    <span style={s.featureText}>{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubscribe}
                disabled={loading}
                style={s.subscribeBtn}
              >
                {loading ? labels.redirecting : `${labels.subscribe_prefix} — ${priceLabel}${periodLabel} →`}
              </button>

              {showTryFree && (
                <button onClick={handleTryFree} style={s.tryFreeBtn}>
                  {labels.try_free}
                </button>
              )}

              <p style={s.guarantee}>{labels.guarantee_line}</p>
            </div>

            {showNoProfile && (
              <div style={s.profileNote}>
                <p style={s.profileNoteText}>{labels.no_profile_text}</p>
                <Link href="/onboarding" style={s.profileNoteLink}>
                  {labels.no_profile_link}
                </Link>
              </div>
            )}
          </>
        )}

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
  bridge: { fontSize:'16px', color:'var(--text)', lineHeight:'1.6', maxWidth:'480px', margin:'0 auto 12px', fontWeight:'500' },
  subtitle: { fontSize:'16px', color:'var(--text-muted)', lineHeight:'1.75', maxWidth:'480px', margin:'0 auto' },
  offerBanner: { background:'var(--surface)', border:'1px solid var(--border)', backdropFilter:'blur(16px) saturate(120%)', borderRadius:'var(--radius)', padding:'20px 24px', marginBottom:'32px', textAlign:'center' },
  offerText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6' },
  toggle: { display:'flex', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'10px', padding:'4px', marginBottom:'24px' },
  toggleBtn: { flex:1, padding:'10px', borderRadius:'8px', border:'none', fontSize:'14px', fontWeight:'500', cursor:'pointer', transition:'all 0.2s', minHeight:'44px' },
  pricingCard: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'clamp(16px, 4vw, 32px)', marginBottom:'24px', boxShadow:'var(--shadow)' },
  priceRow: { display:'flex', alignItems:'baseline', gap:'6px', marginBottom:'28px', flexWrap:'wrap' },
  price: { fontSize:'56px', fontWeight:'700', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1 },
  period: { fontSize:'18px', color:'var(--text-muted)' },
  features: { marginBottom:'28px' },
  feature: { display:'flex', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' },
  featureText: { fontSize:'14px', color:'var(--text)', lineHeight:'1.5' },
  subscribeBtn: { width:'100%', padding:'16px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'500', cursor:'pointer', marginBottom:'12px', boxShadow:'0 4px 20px var(--gold-faint)' },
  tryFreeBtn: { width:'100%', padding:'14px', background:'transparent', color:'var(--text-muted)', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'15px', fontWeight:'500', cursor:'pointer', marginBottom:'16px' },
  guarantee: { textAlign:'center', fontSize:'13px', color:'var(--text-muted)' },
  profileNote: { textAlign:'center', padding:'24px', background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', marginBottom:'32px' },
  profileNoteText: { fontSize:'14px', color:'var(--text-muted)', marginBottom:'8px' },
  profileNoteLink: { fontSize:'15px', color:'var(--purple)', fontWeight:'600' },
  alreadyCard: { textAlign:'center', padding:'32px 24px', background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', marginBottom:'32px', boxShadow:'var(--shadow)' },
  alreadyTitle: { fontSize:'22px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'8px' },
  alreadyText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'16px' },
  alreadyLink: { fontSize:'15px', color:'var(--purple)', fontWeight:'600' },
  guaranteeSection: { marginTop:'48px' },
  guaranteeTitle: { fontSize:'28px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', textAlign:'center', marginBottom:'24px' },
  guaranteeGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap:'16px' },
  guaranteeCard: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'24px', textAlign:'center' },
  guaranteeCardTitle: { fontSize:'15px', fontWeight:'600', color:'var(--text)', marginBottom:'8px' },
  guaranteeCardText: { fontSize:'13px', color:'var(--text-muted)', lineHeight:'1.6' }
}
