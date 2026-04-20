'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

function ReturningUserBanner() {
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    const profile = localStorage.getItem('profile')
    if (profile) setHasProfile(true)
  }, [])

  if (!hasProfile) return null

  return (
    <div style={rb.banner}>
      <span style={rb.text}>✦ Welcome back — your profile is waiting</span>
      <Link href="/profile" style={rb.link}>View My Profile →</Link>
    </div>
  )
}

const rb = {
  banner: { background:'var(--purple-light)', border:'1px solid var(--purple)', borderRadius:'12px', padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px', flexWrap:'wrap', gap:'12px' },
  text: { fontSize:'14px', color:'var(--purple)', fontWeight:'500' },
  link: { fontSize:'14px', color:'var(--purple)', fontWeight:'700', textDecoration:'underline' }
}

export default function Home() {
  return (
    <>
      <div className="cosmic-bg" />

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <p style={s.logo}>✦ Alignment</p>
          <Link href="/onboarding" style={s.navCta}>Start</Link>
        </div>
      </nav>

      <main style={s.wrap}>

        <ReturningUserBanner />

        {/* ── SECTION 1 — HOOK ── */}
        <section style={s.hero}>
          <h1 style={s.heroTitle}>
            When you align with yourself
            <br />
            <span style={s.heroGradient}>everything else follows.</span>
          </h1>
          <p style={s.heroSub}>
            Three systems. One profile. A clear path to knowing yourself
            better than you ever have — and acting on it, every day.
          </p>
          <Link href="/onboarding" style={s.heroCta}>
            Start Here →
          </Link>
        </section>

        {/* ── SECTION 2 — WHAT YOU GET (3 CARDS) ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>What you get</h2>
          <div style={s.threeGrid}>

            <div style={s.card}>
              <div style={{...s.cardIcon, color:'var(--purple)', background:'var(--purple-light)'}}>◎</div>
              <h3 style={s.cardTitle}>Your Profile</h3>
              <p style={s.cardText}>
                Human Design, astrology, and numerology synthesized into one
                clear, personal reading. Who you are, how you operate, what
                lights you up — and what holds you back.
              </p>
            </div>

            <div style={s.card}>
              <div style={{...s.cardIcon, color:'var(--green)', background:'var(--green-light)'}}>🧭</div>
              <h3 style={s.cardTitle}>Your Plan</h3>
              <p style={s.cardText}>
                A personalized alignment plan calibrated to your design.
                Not generic advice — concrete actions, daily structure,
                and behavioral anchors built around who you actually are.
              </p>
            </div>

            <div style={s.card}>
              <div style={{...s.cardIcon, color:'var(--orange)', background:'var(--orange-light)'}}>⚡</div>
              <h3 style={s.cardTitle}>Accountability</h3>
              <p style={s.cardText}>
                Daily check-ins, weekly reviews, pattern detection, and
                a structure that keeps you honest with yourself. Because
                knowing is not enough — doing is what changes things.
              </p>
            </div>

          </div>
        </section>

        {/* ── SECTION 3 — HOW IT WORKS (3 STEPS) ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>How it works</h2>
          <div style={s.threeGrid}>
            {[
              { n:'1', color:'var(--purple)', title:'Enter your birth data', text:'Name, date, time, and city of birth. This is how the three systems calculate your chart.' },
              { n:'2', color:'var(--green)', title:'Receive your profile', text:'In 2-3 minutes, your personal profile is generated — warm, honest, and structured.' },
              { n:'3', color:'var(--orange)', title:'Start the path', text:'Read your profile. Start your plan. Check in daily. The rest unfolds from there.' },
            ].map((step, i) => (
              <div key={i} style={s.stepCard}>
                <p style={{...s.stepNum, color: step.color}}>{step.n}</p>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — TRANSPARENT PRICING ── */}
        <section style={s.pricingSection}>
          <h2 style={s.pricingTitle}>Clear pricing. No surprises.</h2>
          <div style={s.pricingGrid}>

            <div style={s.priceCard}>
              <span className="tag tag-purple" style={{marginBottom:'16px', display:'inline-block'}}>Profile</span>
              <p style={s.priceAmount}>€4</p>
              <p style={s.pricePeriod}>one time</p>
              <p style={s.priceDesc}>
                Your personal profile — Human Design, astrology, and numerology
                combined into one reading. Includes your alignment plan. Yours to keep.
              </p>
              <Link href="/onboarding" style={s.priceBtn}>
                Get Your Profile →
              </Link>
            </div>

            <div style={{...s.priceCard, border:'2px solid var(--purple)'}}>
              <span className="tag tag-orange" style={{marginBottom:'16px', display:'inline-block'}}>Full Path</span>
              <div style={s.priceRow}>
                <p style={s.priceAmount}>€8</p>
                <p style={s.pricePeriod}>/month</p>
              </div>
              <p style={s.priceAnnual}>or €80/year (save €16)</p>
              <p style={s.priceDesc}>
                Everything in the profile, plus daily check-ins, weekly reviews,
                pattern detection, alignment tracking, and the full accountability system.
              </p>
              <Link href="/subscribe" style={{...s.priceBtn, background:'var(--purple)'}}>
                Start Your Path →
              </Link>
            </div>

          </div>
          <p style={s.pricingNote}>No asterisks. No hidden fees. No free trial that turns into a charge.</p>
        </section>

        {/* ── SECTION 5 — FINAL CTA ── */}
        <section style={s.ctaSection}>
          <h2 style={s.ctaTitle}>
            The most honest relationship you will
            <br />ever have is the one with yourself.
          </h2>
          <Link href="/onboarding" style={s.heroCta}>
            Start Here →
          </Link>
        </section>

        {/* ── FOOTER ── */}
        <footer style={s.footer}>
          <p style={s.footerLogo}>✦ Alignment</p>
          <p style={s.footerText}>A self-alignment platform.</p>
        </footer>

      </main>
    </>
  )
}

const s = {
  // Layout
  wrap: { maxWidth:'960px', margin:'0 auto', padding:'0 24px' },

  // Nav
  nav: { position:'sticky', top:0, zIndex:100, background:'rgba(250,250,248,0.92)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--border)' },
  navInner: { maxWidth:'960px', margin:'0 auto', padding:'0 24px', display:'flex', justifyContent:'space-between', alignItems:'center', height:'60px' },
  logo: { fontSize:'18px', fontWeight:'600', fontFamily:'Cormorant Garamond, serif', letterSpacing:'0.5px' },
  navCta: { padding:'8px 20px', background:'var(--purple)', color:'#fff', borderRadius:'8px', fontSize:'14px', fontWeight:'500' },

  // Hero
  hero: { textAlign:'center', padding:'100px 0 80px' },
  heroTitle: { fontSize:'clamp(40px, 7vw, 72px)', fontWeight:'600', color:'var(--text)', lineHeight:'1.1', marginBottom:'24px', letterSpacing:'-0.5px', fontFamily:'Cormorant Garamond, serif' },
  heroGradient: { background:'linear-gradient(135deg, var(--purple) 0%, var(--orange) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
  heroSub: { fontSize:'18px', color:'var(--text-muted)', lineHeight:'1.75', maxWidth:'520px', margin:'0 auto 36px', fontWeight:'300' },
  heroCta: { display:'inline-block', padding:'16px 36px', background:'var(--purple)', color:'#fff', borderRadius:'12px', fontSize:'17px', fontWeight:'500', boxShadow:'0 6px 30px rgba(124,92,191,0.3)' },

  // Sections
  section: { marginBottom:'80px' },
  sectionTitle: { fontSize:'clamp(28px, 4vw, 42px)', fontWeight:'600', color:'var(--text)', marginBottom:'32px', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.2', textAlign:'center' },

  // 3-column grid (responsive)
  threeGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px' },

  // Cards (Section 2)
  card: { background:'var(--surface)', borderRadius:'var(--radius)', padding:'28px', border:'1px solid var(--border)', boxShadow:'var(--shadow)' },
  cardIcon: { display:'inline-flex', alignItems:'center', justifyContent:'center', width:'44px', height:'44px', borderRadius:'12px', fontSize:'20px', marginBottom:'16px' },
  cardTitle: { fontSize:'18px', fontWeight:'600', color:'var(--text)', marginBottom:'10px', fontFamily:'Cormorant Garamond, serif' },
  cardText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.7' },

  // Steps (Section 3)
  stepCard: { background:'var(--surface)', borderRadius:'var(--radius)', padding:'28px', border:'1px solid var(--border)', boxShadow:'var(--shadow)' },
  stepNum: { fontSize:'36px', fontWeight:'700', fontFamily:'Cormorant Garamond, serif', marginBottom:'12px', display:'block' },
  stepTitle: { fontSize:'17px', fontWeight:'600', color:'var(--text)', marginBottom:'8px', fontFamily:'Cormorant Garamond, serif' },
  stepText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.7' },

  // Pricing (Section 4)
  pricingSection: { marginBottom:'80px' },
  pricingTitle: { fontSize:'clamp(28px, 4vw, 42px)', fontWeight:'600', color:'var(--text)', marginBottom:'32px', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.2', textAlign:'center' },
  pricingGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px', maxWidth:'680px', margin:'0 auto' },
  priceCard: { background:'var(--surface)', borderRadius:'var(--radius)', padding:'32px', border:'1px solid var(--border)', boxShadow:'var(--shadow)', textAlign:'center' },
  priceRow: { display:'flex', alignItems:'baseline', justifyContent:'center', gap:'4px' },
  priceAmount: { fontSize:'48px', fontWeight:'700', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1 },
  pricePeriod: { fontSize:'16px', color:'var(--text-muted)', marginBottom:'4px' },
  priceAnnual: { fontSize:'13px', color:'var(--green)', fontWeight:'500', marginBottom:'16px' },
  priceDesc: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.7', marginBottom:'24px', marginTop:'12px' },
  priceBtn: { display:'inline-block', padding:'14px 28px', background:'var(--text)', color:'#fff', borderRadius:'10px', fontSize:'15px', fontWeight:'500' },
  pricingNote: { textAlign:'center', fontSize:'13px', color:'var(--text-light)', marginTop:'20px' },

  // Final CTA
  ctaSection: { textAlign:'center', padding:'60px 0 40px' },
  ctaTitle: { fontSize:'clamp(26px, 3.5vw, 40px)', fontWeight:'600', color:'var(--text)', marginBottom:'32px', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.25' },

  // Footer
  footer: { borderTop:'1px solid var(--border)', padding:'40px 0', textAlign:'center' },
  footerLogo: { fontSize:'18px', fontWeight:'600', fontFamily:'Cormorant Garamond, serif', marginBottom:'6px' },
  footerText: { fontSize:'13px', color:'var(--text-light)' },
}