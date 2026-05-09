'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// ── Reveal: fades + slides up its children when scrolled into view ──
function Reveal({ children, delay = 0, as: Tag = 'div', style, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      className={`reveal-on-scroll${visible ? ' visible' : ''}${className ? ' ' + className : ''}`}
    >
      {children}
    </Tag>
  )
}

// ── CosmicStars: 25 drifting decorative dots, positioned via CSS :nth-child ──
function CosmicStars() {
  return (
    <div className="cosmic-stars" aria-hidden="true">
      {Array.from({ length: 25 }).map((_, i) => <span key={i} />)}
    </div>
  )
}

// ── Sacred-geometry mandala overlay used behind hero ──
function HeroMandala() {
  return (
    <svg
      className="mandala-bg-light"
      style={{ top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '480px', height: '480px' }}
      viewBox="0 0 200 200"
      aria-hidden="true"
    >
      <g fill="none" stroke="var(--purple)" strokeWidth="0.5">
        <circle cx="100" cy="100" r="90" />
        <circle cx="100" cy="100" r="70" />
        <circle cx="100" cy="100" r="50" />
        <circle cx="100" cy="100" r="30" />
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <line key={a} x1="100" y1="10" x2="100" y2="190" transform={`rotate(${a} 100 100)`} />
        ))}
        {[0, 60, 120].map((a) => (
          <polygon key={a} points="100,30 158,130 42,130" transform={`rotate(${a} 100 100)`} />
        ))}
      </g>
    </svg>
  )
}

function ReturningUserBanner() {
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    const profile = localStorage.getItem('profile')
    if (profile) setHasProfile(true)
  }, [])

  if (!hasProfile) return null

  return (
    <div style={rb.banner} className="anim-fade-in">
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
      <CosmicStars />

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <p style={s.logo}>✦ Alignment</p>
          <Link href="/onboarding" style={s.navCta}>Start</Link>
        </div>
      </nav>

      <main style={s.wrap}>

        <ReturningUserBanner />

        {/* ── SECTION 1 — HERO ── */}
        <section style={s.hero}>
          <HeroMandala />
          <div style={s.heroInner}>
            <h1 style={s.heroTitle} className="anim-fade-in">
              When you align with yourself
              <br />
              <span className="gradient-text-animated">everything else follows.</span>
            </h1>
            <p style={s.heroSub} className="anim-fade-in stagger-3">
              Human Design. Astrology. Numerology. One profile that finally
              tells you who you are — and a daily system to act on it.
            </p>
            <div className="anim-fade-in stagger-5" style={{ display:'inline-block' }}>
              <Link href="/onboarding" style={s.heroCta} className="btn-glow-pulse">
                Start Here →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SECTION 2 — WHAT YOU GET (3 CARDS) ── */}
        <section style={s.section}>
          <Reveal as="h2" style={s.sectionTitle}>What you get</Reveal>
          <div style={s.threeGrid}>

            <Reveal delay={0}>
              <div style={{...s.card, borderLeft:'4px solid var(--purple)'}} className="landing-card">
                <div style={{...s.cardIcon, color:'var(--purple)', background:'var(--purple-light)'}}>◎</div>
                <h3 style={s.cardTitle}>Your Profile</h3>
                <p style={s.cardText}>
                  Human Design, astrology, and numerology synthesized into one
                  honest, personal profile. Who you are, how you operate, what
                  lights you up — and what holds you back.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div style={{...s.card, borderLeft:'4px solid var(--green)'}} className="landing-card">
                <div style={{...s.cardIcon, color:'var(--green)', background:'var(--green-light)'}}>🧭</div>
                <h3 style={s.cardTitle}>Your Plan</h3>
                <p style={s.cardText}>
                  A personalized alignment plan calibrated to your design.
                  Not generic advice — concrete actions, daily structure,
                  and behavioral anchors built around who you actually are.
                </p>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div style={{...s.card, borderLeft:'4px solid var(--orange)'}} className="landing-card">
                <div style={{...s.cardIcon, color:'var(--orange)', background:'var(--orange-light)'}}>⚡</div>
                <h3 style={s.cardTitle}>Accountability</h3>
                <p style={s.cardText}>
                  Daily check-ins, weekly reviews, pattern detection, and
                  a structure that keeps you honest with yourself. Because
                  knowing is not enough — doing is what changes things.
                </p>
              </div>
            </Reveal>

          </div>
        </section>

        {/* ── SECTION 3 — HOW IT WORKS (3 STEPS) ── */}
        <section style={s.section}>
          <Reveal as="h2" style={s.sectionTitle}>How it works</Reveal>
          <div style={s.threeGrid}>
            {[
              { n:'1', color:'var(--purple)', title:'Enter your birth data', text:'Name, date, time, and city of birth. This is how your unique profile is calculated.' },
              { n:'2', color:'var(--green)', title:'Receive your profile', text:'In 2-3 minutes, your personal profile is generated — warm, honest, and structured.' },
              { n:'3', color:'var(--orange)', title:'Start the path', text:'Read your profile. Start your plan. Check in daily. The rest unfolds from there.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 120}>
                <div style={{...s.stepCard, borderLeft:`4px solid ${step.color}`}} className="landing-card">
                  <p style={{...s.stepNum, color: step.color}}>{step.n}</p>
                  <h3 style={s.stepTitle}>{step.title}</h3>
                  <p style={s.stepText}>{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — TRANSPARENT PRICING ── */}
        <section style={s.pricingSection}>
          <Reveal as="h2" style={s.pricingTitle}>Clear pricing. No surprises.</Reveal>
          <div style={s.pricingGrid}>

            <Reveal delay={0}>
              <div style={s.priceCard} className="landing-card">
                <span className="tag tag-purple" style={{marginBottom:'16px', display:'inline-block'}}>Profile</span>
                <p style={s.priceAmount} className="gradient-text-warm">Free</p>
                <p style={s.pricePeriod}>&nbsp;</p>
                <p style={s.priceDesc}>
                  Your personal profile — Human Design, astrology, and numerology
                  combined into one document. Includes your alignment plan. Yours to keep.
                </p>
                <Link href="/onboarding" style={s.priceBtn}>
                  Get Your Profile →
                </Link>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div style={{...s.priceCard, border:'2px solid var(--purple)'}} className="landing-card">
                <span className="tag tag-orange" style={{marginBottom:'16px', display:'inline-block'}}>Full Path</span>
                <div style={s.priceRow}>
                  <p style={s.priceAmount} className="gradient-text-animated">€8</p>
                  <p style={s.pricePeriod}>/month</p>
                </div>
                <p style={s.priceAnnual}>or €80/year (save €16)</p>
                <p style={s.priceDesc}>
                  Everything in the profile, plus daily check-ins, weekly reviews,
                  pattern detection, alignment tracking, and the full accountability system.
                </p>
                <Link href="/subscribe" style={{...s.priceBtn, background:'var(--purple)'}} className="btn-glow-pulse">
                  Start Your Path →
                </Link>
              </div>
            </Reveal>

          </div>
          <Reveal as="p" style={s.pricingNote} delay={200}>
            <span style={{marginRight:'6px'}}>🛡</span>
            No asterisks. No hidden fees. Cancel anytime. 30-day money-back guarantee.
          </Reveal>
        </section>

        {/* ── SECTION 5 — FINAL CTA ── */}
        <section style={s.ctaSection}>
          <Reveal as="h2" style={s.ctaTitle}>
            The most honest relationship you will
            <br />
            <span className="gradient-text-animated">ever have is the one with yourself.</span>
          </Reveal>
          <Reveal delay={150} style={{display:'inline-block'}}>
            <Link href="/onboarding" style={s.heroCta} className="btn-glow-pulse">
              Start Here →
            </Link>
          </Reveal>
        </section>

        {/* ── FOOTER ── */}
        <footer style={s.footer}>
          <p style={s.footerLogo}>✦ Alignment</p>
          <p style={s.footerText}>Available in 10 languages. Built for people who are done with generic advice.</p>
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
  hero: { position:'relative', textAlign:'center', padding:'100px 0 80px', overflow:'hidden' },
  heroInner: { position:'relative', zIndex:1 },
  heroTitle: { fontSize:'clamp(40px, 7vw, 72px)', fontWeight:'600', color:'var(--text)', lineHeight:'1.1', marginBottom:'24px', letterSpacing:'-0.5px', fontFamily:'Cormorant Garamond, serif' },
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
  priceCard: { background:'var(--surface)', borderRadius:'var(--radius)', padding:'clamp(20px, 4vw, 32px)', border:'1px solid var(--border)', boxShadow:'var(--shadow)', textAlign:'center' },
  priceRow: { display:'flex', alignItems:'baseline', justifyContent:'center', gap:'4px' },
  priceAmount: { fontSize:'56px', fontWeight:'700', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1 },
  pricePeriod: { fontSize:'16px', color:'var(--text-muted)', marginBottom:'4px' },
  priceAnnual: { fontSize:'13px', color:'var(--green)', fontWeight:'500', marginBottom:'16px' },
  priceDesc: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.7', marginBottom:'24px', marginTop:'12px' },
  priceBtn: { display:'inline-block', padding:'14px 28px', background:'var(--text)', color:'#fff', borderRadius:'10px', fontSize:'15px', fontWeight:'500' },
  pricingNote: { textAlign:'center', fontSize:'13px', color:'var(--text-light)', marginTop:'20px' },

  // Final CTA
  ctaSection: { textAlign:'center', padding:'60px 0 40px' },
  ctaTitle: { fontSize:'clamp(26px, 3.5vw, 40px)', fontWeight:'600', color:'var(--text)', marginBottom:'32px', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.25' },

  // Footer
  footer: { borderTop:'1px solid var(--border)', padding:'40px 0', textAlign:'center', background:'linear-gradient(180deg, transparent 0%, rgba(124, 92, 191, 0.03) 100%)' },
  footerLogo: { fontSize:'18px', fontWeight:'600', fontFamily:'Cormorant Garamond, serif', marginBottom:'6px', color:'var(--text)' },
  footerText: { fontSize:'13px', color:'var(--text-muted)' },
}
