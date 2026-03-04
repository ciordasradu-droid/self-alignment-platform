'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubscribePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'guest' })
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>

        <div style={s.header}>
          <a href="/" style={s.back}>← Back</a>
        </div>

        <div style={s.hero}>
          <span className="tag tag-green" style={{marginBottom:'20px', display:'inline-block'}}>
            Accountability System
          </span>
          <h1 style={s.title}>Stay consistent.<br/>Build real momentum.</h1>
          <p style={s.subtitle}>
            Your profile gives you clarity. The accountability system
            keeps you moving — every single day.
          </p>
        </div>

        <div style={s.card}>

          <div style={s.cardTop}>
            <div>
              <p style={s.planName}>Accountability Plan</p>
              <div style={s.priceRow}>
                <span style={s.price}>$15</span>
                <span style={s.period}>/month</span>
              </div>
            </div>
            <span className="tag tag-green">Most Popular</span>
          </div>

          <div style={s.featuresGrid}>
            {[
              { icon:'✦', color:'var(--purple)', label:'Daily check-in system', sub:'3 questions, under 2 minutes' },
              { icon:'◎', color:'var(--green)', label:'Alignment score', sub:'Gamified 0-100 metric' },
              { icon:'⟳', color:'var(--orange)', label:'Streak tracking', sub:'Build consistency over time' },
              { icon:'◦', color:'var(--purple)', label:'Weekly review', sub:'Reflect and reset every weekend' },
              { icon:'✉', color:'var(--green)', label:'Email reminders', sub:'Daily nudges to stay on track' },
              { icon:'✕', color:'var(--orange)', label:'Cancel anytime', sub:'No lock-in, no tricks' },
            ].map((f, i) => (
              <div key={i} style={s.featureItem}>
                <div style={{...s.featureIcon, color: f.color}}>{f.icon}</div>
                <div>
                  <p style={s.featureLabel}>{f.label}</p>
                  <p style={s.featureSub}>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              ...s.btn,
              background: loading ? '#ccc' : 'var(--purple)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Redirecting...' : 'Start Accountability →'}
          </button>

          <p style={s.disclaimer}>
            Billed monthly. Cancel anytime from your account settings.
            Secure payment via Stripe.
          </p>

        </div>

        <div style={s.alreadyBox}>
          <button
            onClick={() => router.push('/dashboard')}
            style={s.alreadyBtn}
          >
            Already subscribed? Go to dashboard →
          </button>
        </div>

      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'560px', margin:'0 auto', padding:'32px 24px 80px' },
  header: { marginBottom:'32px' },
  back: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500' },
  hero: { textAlign:'center', marginBottom:'40px' },
  title: { fontSize:'40px', fontWeight:'600', color:'var(--text)', marginBottom:'16px', lineHeight:'1.2' },
  subtitle: { fontSize:'16px', color:'var(--text-muted)', lineHeight:'1.7', fontWeight:'300' },
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'36px', boxShadow:'var(--shadow-lg)' },
  cardTop: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px', paddingBottom:'28px', borderBottom:'1px solid var(--border)' },
  planName: { fontSize:'13px', fontWeight:'600', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'8px' },
  priceRow: { display:'flex', alignItems:'baseline', gap:'6px' },
  price: { fontSize:'52px', fontWeight:'700', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  period: { fontSize:'18px', color:'var(--text-muted)' },
  featuresGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'32px' },
  featureItem: { display:'flex', gap:'12px', alignItems:'flex-start' },
  featureIcon: { fontSize:'18px', marginTop:'2px', flexShrink:0 },
  featureLabel: { fontSize:'14px', fontWeight:'600', color:'var(--text)', marginBottom:'2px' },
  featureSub: { fontSize:'12px', color:'var(--text-muted)' },
  btn: { width:'100%', padding:'15px', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'500', boxShadow:'0 4px 20px rgba(124,92,191,0.3)' },
  disclaimer: { textAlign:'center', fontSize:'12px', color:'var(--text-light)', marginTop:'16px', lineHeight:'1.6' },
  alreadyBox: { textAlign:'center', marginTop:'24px' },
  alreadyBtn: { background:'none', border:'none', color:'var(--text-muted)', fontSize:'14px', cursor:'pointer' }
}