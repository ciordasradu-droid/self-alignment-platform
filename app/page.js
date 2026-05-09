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

// ── 25 drifting decorative dots ──
function CosmicStars() {
  return (
    <div className="cosmic-stars" aria-hidden="true">
      {Array.from({ length: 25 }).map((_, i) => <span key={i} />)}
    </div>
  )
}

// ── Returning user banner ──
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
          <Link href="/onboarding" style={s.navCta} className="btn-lift">Start</Link>
        </div>
      </nav>

      <main style={s.wrap}>

        <ReturningUserBanner />

        {/* ── HERO ── */}
        <section style={s.hero}>
          <div className="hero-orb" aria-hidden="true" />
          <div style={s.heroInner}>
            <h1 style={s.heroTitle} className="anim-fade-in">
              When you align with yourself
              <br />
              <span className="gradient-text-fast">everything else follows.</span>
            </h1>
            <p style={s.heroSub} className="anim-fade-in stagger-3">
              Human Design. Astrology. Numerology. One profile that finally
              tells you who you are — and a daily ritual to live it.
            </p>
            <div className="anim-fade-in stagger-5" style={{ display:'inline-block' }}>
              <Link href="/onboarding" className="cta-premium cta-premium-large">
                Start Here <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <span className="cta-subtext">Free. No card. 30 seconds.</span>
            </div>
          </div>
        </section>

        {/* ── VISUAL STORYTELLING ── */}
        <section style={s.section}>
          <Reveal as="h2" style={s.sectionTitle}>What you actually get</Reveal>
          <Reveal as="p" style={s.sectionSub} delay={80}>
            Four pieces, designed to work together. Built around who you are — not generic advice.
          </Reveal>

          <div className="story-grid" style={{ marginTop: '36px' }}>

            <Reveal delay={0}>
              <div className="story-card story-card-purple">
                <span className="story-tag">Profile</span>
                <h3 className="story-title">Your unique profile</h3>
                <p className="story-text">
                  Human Design, astrology, and numerology synthesized into one honest document.
                  Personal. Specific. Yours.
                </p>
                <div className="story-preview">
                  <div className="mock-profile">
                    <span className="mock-profile-tag">Generator · 2/4</span>
                    <div className="mock-line mock-line-1" />
                    <div className="mock-line mock-line-2" />
                    <div className="mock-line mock-line-3" />
                    <div className="mock-line mock-line-4" />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="story-card story-card-green">
                <span className="story-tag" style={{ color:'var(--green)' }}>Daily Ritual</span>
                <h3 className="story-title">2-minute daily ritual</h3>
                <p className="story-text">
                  A short check-in. Real questions. Your alignment, tracked over time without ever
                  feeling like a chore.
                </p>
                <div className="story-preview">
                  <div className="mock-rating" aria-hidden="true">
                    <div className="mock-rating-emoji"><span>😔</span></div>
                    <div className="mock-rating-emoji"><span>😐</span></div>
                    <div className="mock-rating-emoji"><span>🙂</span></div>
                    <div className="mock-rating-emoji active"><span>😊</span></div>
                    <div className="mock-rating-emoji"><span>✨</span></div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="story-card story-card-amber">
                <span className="story-tag" style={{ color:'var(--orange)' }}>Patterns</span>
                <h3 className="story-title">Patterns that guide you</h3>
                <p className="story-text">
                  Streaks, weekly reviews, and pattern detection that learns from you — not from
                  some generic app's idea of progress.
                </p>
                <div className="story-preview">
                  <div className="mock-streak">
                    <div className="mock-streak-row">
                      <span className="mock-streak-num">12</span>
                      <span className="mock-streak-fire" aria-hidden="true">🔥</span>
                    </div>
                    <div className="mock-streak-dots">
                      <div className="mock-streak-dot filled" />
                      <div className="mock-streak-dot filled" />
                      <div className="mock-streak-dot filled" />
                      <div className="mock-streak-dot filled" />
                      <div className="mock-streak-dot filled" />
                      <div className="mock-streak-dot" />
                      <div className="mock-streak-dot" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={360}>
              <div className="story-card story-card-mixed">
                <span className="story-tag" style={{ color:'var(--purple)' }}>Foundation</span>
                <h3 className="story-title">Built on who you are</h3>
                <p className="story-text">
                  Three ancient systems, calculated from your birth data, woven into one
                  contemporary profile you can actually use.
                </p>
                <div className="story-preview">
                  <div className="mock-pillars">
                    <span className="mock-pillar"><span className="mock-pillar-icon">◎</span> Human Design</span>
                    <span className="mock-pillar"><span className="mock-pillar-icon">✦</span> Astrology</span>
                    <span className="mock-pillar"><span className="mock-pillar-icon">⚡</span> Numerology</span>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </section>

        {/* ── TRUST SECTION ── */}
        <section style={s.trust} className="trust-section">
          <Reveal>
            <div className="trust-banner">
              <p className="trust-banner-title">
                No subscription. No card. Your profile is free.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="trust-indicators">
              <div className="trust-indicator"><span className="trust-indicator-icon">🔒</span> Private &amp; secure</div>
              <div className="trust-indicator"><span className="trust-indicator-icon">⚡</span> Ready in 2 minutes</div>
              <div className="trust-indicator"><span className="trust-indicator-icon">🌍</span> 10 languages</div>
            </div>
          </Reveal>
        </section>

        {/* ── HOW IT WORKS ── */}
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

        {/* ── PRICING (premium dark card + free card) ── */}
        <section style={s.pricingSection}>
          <Reveal as="h2" style={s.pricingTitle}>Clear pricing. No surprises.</Reveal>
          <Reveal as="p" style={s.sectionSub} delay={80}>
            Start free. Upgrade only if it's worth it.
          </Reveal>

          <div style={s.pricingGrid}>
            <Reveal delay={0}>
              <div className="price-card-free landing-card">
                <span className="tag tag-purple" style={{marginBottom:'18px', display:'inline-block'}}>Profile</span>
                <p className="price-amount-free">Free</p>
                <p style={{ fontSize:'13px', color:'var(--text-light)', marginTop:'4px' }}>Yours to keep</p>
                <p style={s.priceDesc}>
                  Your full personal profile — Human Design, astrology, and numerology
                  combined into one document. Includes your alignment plan.
                </p>
                <Link href="/onboarding" style={s.priceBtnGhost} className="btn-lift">
                  Get Your Profile →
                </Link>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="price-premium">
                <span className="price-premium-tag">Full Path</span>
                <div>
                  <span className="price-premium-amount">€8</span>
                  <span className="price-premium-period">/month</span>
                </div>
                <p className="price-premium-annual">or €80/year — 2 months free</p>

                <div className="price-premium-features">
                  {[
                    "Everything in the free profile",
                    "Daily 2-minute check-in ritual",
                    "Weekly pattern detection & reviews",
                    "Streaks, score, and gentle accountability",
                    "Available in 10 languages",
                  ].map((feat, i) => (
                    <div key={i} className="price-feature">
                      <span className="price-check">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link href="/subscribe" className="cta-premium" style={{ background:'linear-gradient(135deg, #d4a574 0%, #f5d976 50%, #d4a574 100%)' }}>
                  Start Your Path <span className="arrow" aria-hidden="true">→</span>
                </Link>

                <p style={{ marginTop:'18px', fontSize:'12px', color:'rgba(255,255,255,0.55)' }}>
                  🛡 30-day money-back guarantee · Cancel anytime
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={s.ctaSection}>
          <Reveal as="h2" style={s.ctaTitle}>
            The most honest relationship you will
            <br />
            <span className="gradient-text-fast">ever have is the one with yourself.</span>
          </Reveal>
          <Reveal delay={150} style={{display:'inline-block'}}>
            <Link href="/onboarding" className="cta-premium cta-premium-large">
              Start Here <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <span className="cta-subtext">Free. No card. 30 seconds.</span>
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
  wrap: { maxWidth:'1040px', margin:'0 auto', padding:'0 24px' },

  // Nav
  nav: { position:'sticky', top:0, zIndex:100, background:'rgba(250,250,248,0.85)', backdropFilter:'blur(14px)', borderBottom:'1px solid rgba(232, 232, 240, 0.6)' },
  navInner: { maxWidth:'1040px', margin:'0 auto', padding:'0 24px', display:'flex', justifyContent:'space-between', alignItems:'center', height:'64px' },
  logo: { fontSize:'19px', fontWeight:'600', fontFamily:'Cormorant Garamond, serif', letterSpacing:'0.5px' },
  navCta: { display:'inline-block', padding:'9px 22px', background:'var(--purple)', color:'#fff', borderRadius:'10px', fontSize:'14px', fontWeight:'600', boxShadow:'0 4px 14px rgba(124, 92, 191, 0.25)' },

  // Hero — large, generous
  hero: { position:'relative', textAlign:'center', padding:'clamp(80px, 14vw, 140px) 0 clamp(70px, 12vw, 110px)', overflow:'hidden' },
  heroInner: { position:'relative', zIndex:1 },
  heroTitle: { fontSize:'clamp(44px, 8vw, 76px)', fontWeight:'600', color:'var(--text)', lineHeight:'1.05', marginBottom:'28px', letterSpacing:'-1px', fontFamily:'Cormorant Garamond, serif' },
  heroSub: { fontSize:'clamp(16px, 2vw, 19px)', color:'var(--text-muted)', lineHeight:'1.7', maxWidth:'560px', margin:'0 auto 40px', fontWeight:'300' },

  // Sections — generous vertical padding
  section: { padding:'clamp(50px, 8vw, 90px) 0' },
  sectionTitle: { fontSize:'clamp(32px, 5vw, 48px)', fontWeight:'600', color:'var(--text)', marginBottom:'16px', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.15', letterSpacing:'-0.4px', textAlign:'center' },
  sectionSub: { fontSize:'17px', color:'var(--text-muted)', lineHeight:'1.65', maxWidth:'520px', margin:'0 auto', textAlign:'center', fontWeight:'300' },

  // Trust
  trust: { padding:'clamp(20px, 3vw, 40px) 0 clamp(40px, 6vw, 80px)' },

  // 3-column grid
  threeGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'22px', marginTop:'40px' },

  // Steps
  stepCard: { background:'var(--surface)', borderRadius:'20px', padding:'32px', border:'1px solid var(--border)', boxShadow:'var(--shadow)' },
  stepNum: { fontSize:'42px', fontWeight:'700', fontFamily:'Cormorant Garamond, serif', marginBottom:'12px', display:'block', lineHeight:1 },
  stepTitle: { fontSize:'18px', fontWeight:'600', color:'var(--text)', marginBottom:'8px', fontFamily:'Cormorant Garamond, serif' },
  stepText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.7' },

  // Pricing
  pricingSection: { padding:'clamp(60px, 10vw, 100px) 0', position:'relative' },
  pricingTitle: { fontSize:'clamp(32px, 5vw, 48px)', fontWeight:'600', color:'var(--text)', marginBottom:'14px', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.15', letterSpacing:'-0.4px', textAlign:'center' },
  pricingGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'24px', maxWidth:'780px', margin:'40px auto 0', alignItems:'stretch' },
  priceDesc: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.7', margin:'18px 0 26px' },
  priceBtnGhost: { display:'inline-block', padding:'14px 30px', background:'var(--text)', color:'#fff', borderRadius:'12px', fontSize:'15px', fontWeight:'500', alignSelf:'center', marginTop:'auto' },

  // Final CTA — generous
  ctaSection: { textAlign:'center', padding:'clamp(60px, 10vw, 110px) 0 clamp(40px, 6vw, 70px)' },
  ctaTitle: { fontSize:'clamp(28px, 4vw, 42px)', fontWeight:'600', color:'var(--text)', marginBottom:'40px', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.2', letterSpacing:'-0.3px' },

  // Footer
  footer: { borderTop:'1px solid var(--border)', padding:'48px 0', textAlign:'center', background:'linear-gradient(180deg, transparent 0%, rgba(124, 92, 191, 0.04) 100%)', marginTop:'40px' },
  footerLogo: { fontSize:'19px', fontWeight:'600', fontFamily:'Cormorant Garamond, serif', marginBottom:'8px', color:'var(--text)' },
  footerText: { fontSize:'13px', color:'var(--text-muted)' },
}
