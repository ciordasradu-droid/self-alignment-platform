'use client'

// Destinație: app/page.js  (ÎNLOCUIEȘTE COMPLET)
// Schimbări față de versiunea anterioară:
// - selector de limbă în nav (global, salvat în localStorage prin lib/language.js)
// - toate textele landing-ului vin din lib/landing.js (10 limbi)
// - structura, stilurile și animațiile rămân identice

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useLanguage, LANGUAGES } from '../lib/language'
import { lt } from '../lib/landing'

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
function ReturningUserBanner({ lang }) {
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    const profile = localStorage.getItem('profile')
    if (profile) setHasProfile(true)
  }, [])

  if (!hasProfile) return null

  return (
    <div style={rb.banner} className="anim-fade-in">
      <span style={rb.text}>{lt(lang, 'banner_back')}</span>
      <Link href="/profile" style={rb.link}>{lt(lang, 'banner_view')}</Link>
    </div>
  )
}

const rb = {
  banner: { background:'var(--purple-light)', border:'1px solid var(--purple)', borderRadius:'12px', padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px', flexWrap:'wrap', gap:'12px' },
  text: { fontSize:'14px', color:'var(--purple)', fontWeight:'500' },
  link: { fontSize:'14px', color:'var(--purple)', fontWeight:'700', textDecoration:'underline' }
}

export default function Home() {
  const [lang, changeLanguage] = useLanguage()

  return (
    <>
      <div className="cosmic-bg" />
      <CosmicStars />

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <p style={s.logo}>✦ Alignment</p>
          <div style={s.navRight}>
            <select
              value={lang}
              onChange={e => changeLanguage(e.target.value)}
              style={s.langSelect}
              aria-label="Language"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <Link href="/onboarding" style={s.navCta} className="btn-lift">{lt(lang, 'nav_start')}</Link>
          </div>
        </div>
      </nav>

      <main style={s.wrap}>

        <ReturningUserBanner lang={lang} />

        {/* ── HERO ── */}
        <section style={s.hero}>
          <div className="hero-orb" aria-hidden="true" />
          <div style={s.heroInner}>
            <h1 style={s.heroTitle} className="anim-fade-in">
              {lt(lang, 'hero_title_1')}
              <br />
              <span className="gradient-text-fast">{lt(lang, 'hero_title_2')}</span>
            </h1>
            <p style={s.heroSub} className="anim-fade-in stagger-3">
              {lt(lang, 'hero_sub')}
            </p>
            <div className="anim-fade-in stagger-5" style={{ display:'inline-block' }}>
              <Link href="/onboarding" className="cta-premium cta-premium-large">
                {lt(lang, 'hero_cta')} <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <span className="cta-subtext">{lt(lang, 'hero_cta_note')}</span>
            </div>
          </div>
        </section>

        {/* ── VISUAL STORYTELLING ── */}
        <section style={s.section}>
          <Reveal as="h2" style={s.sectionTitle}>{lt(lang, 'get_title')}</Reveal>
          <Reveal as="p" style={s.sectionSub} delay={80}>
            {lt(lang, 'get_sub')}
          </Reveal>

          <div className="story-grid" style={{ marginTop: '36px' }}>

            <Reveal delay={0}>
              <div className="story-card story-card-purple">
                <span className="story-tag">{lt(lang, 'card_profile_tag')}</span>
                <h3 className="story-title">{lt(lang, 'card_profile_title')}</h3>
                <p className="story-text">
                  {lt(lang, 'card_profile_text')}
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
                <span className="story-tag" style={{ color:'var(--green)' }}>{lt(lang, 'card_ritual_tag')}</span>
                <h3 className="story-title">{lt(lang, 'card_ritual_title')}</h3>
                <p className="story-text">
                  {lt(lang, 'card_ritual_text')}
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
                <span className="story-tag" style={{ color:'var(--orange)' }}>{lt(lang, 'card_patterns_tag')}</span>
                <h3 className="story-title">{lt(lang, 'card_patterns_title')}</h3>
                <p className="story-text">
                  {lt(lang, 'card_patterns_text')}
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
                <span className="story-tag" style={{ color:'var(--purple)' }}>{lt(lang, 'card_foundation_tag')}</span>
                <h3 className="story-title">{lt(lang, 'card_foundation_title')}</h3>
                <p className="story-text">
                  {lt(lang, 'card_foundation_text')}
                </p>
                <div className="story-preview">
                  <div className="mock-pillars">
                    <span className="mock-pillar"><span className="mock-pillar-icon">◎</span> Human Design</span>
                    <span className="mock-pillar"><span className="mock-pillar-icon">✦</span> {lt(lang, 'pillar_astro')}</span>
                    <span className="mock-pillar"><span className="mock-pillar-icon">⚡</span> {lt(lang, 'pillar_num')}</span>
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
                {lt(lang, 'trust_banner')}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="trust-indicators">
              <div className="trust-indicator"><span className="trust-indicator-icon">🔒</span> {lt(lang, 'trust_private')}</div>
              <div className="trust-indicator"><span className="trust-indicator-icon">⚡</span> {lt(lang, 'trust_fast')}</div>
              <div className="trust-indicator"><span className="trust-indicator-icon">🌍</span> {lt(lang, 'trust_langs')}</div>
            </div>
          </Reveal>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={s.section}>
          <Reveal as="h2" style={s.sectionTitle}>{lt(lang, 'how_title')}</Reveal>
          <div style={s.threeGrid}>
            {[
              { n:'1', color:'var(--purple)', title:lt(lang, 'step1_title'), text:lt(lang, 'step1_text') },
              { n:'2', color:'var(--green)', title:lt(lang, 'step2_title'), text:lt(lang, 'step2_text') },
              { n:'3', color:'var(--orange)', title:lt(lang, 'step3_title'), text:lt(lang, 'step3_text') },
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
          <Reveal as="h2" style={s.pricingTitle}>{lt(lang, 'pricing_title')}</Reveal>
          <Reveal as="p" style={s.sectionSub} delay={80}>
            {lt(lang, 'pricing_sub')}
          </Reveal>

          <div style={s.pricingGrid}>
            <Reveal delay={0}>
              <div className="price-card-free landing-card">
                <span className="tag tag-purple" style={{marginBottom:'18px', display:'inline-block'}}>{lt(lang, 'price_free_tag')}</span>
                <p className="price-amount-free">{lt(lang, 'price_free')}</p>
                <p style={{ fontSize:'13px', color:'var(--text-light)', marginTop:'4px' }}>{lt(lang, 'price_free_note')}</p>
                <p style={s.priceDesc}>
                  {lt(lang, 'price_free_desc')}
                </p>
                <Link href="/onboarding" style={s.priceBtnGhost} className="btn-lift">
                  {lt(lang, 'price_free_btn')}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="price-premium">
                <span className="price-premium-tag">{lt(lang, 'price_premium_tag')}</span>
                <div>
                  <span className="price-premium-amount">€8</span>
                  <span className="price-premium-period">{lt(lang, 'price_month')}</span>
                </div>
                <p className="price-premium-annual">{lt(lang, 'price_annual')}</p>

                <div className="price-premium-features">
                  {lt(lang, 'features').map((feat, i) => (
                    <div key={i} className="price-feature">
                      <span className="price-check">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link href="/subscribe" className="cta-premium" style={{ background:'linear-gradient(135deg, #d4a574 0%, #f5d976 50%, #d4a574 100%)' }}>
                  {lt(lang, 'price_premium_btn')} <span className="arrow" aria-hidden="true">→</span>
                </Link>

                <p style={{ marginTop:'18px', fontSize:'12px', color:'rgba(255,255,255,0.55)' }}>
                  {lt(lang, 'guarantee')}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={s.ctaSection}>
          <Reveal as="h2" style={s.ctaTitle}>
            {lt(lang, 'final_1')}
            <br />
            <span className="gradient-text-fast">{lt(lang, 'final_2')}</span>
          </Reveal>
          <Reveal delay={150} style={{display:'inline-block'}}>
            <Link href="/onboarding" className="cta-premium cta-premium-large">
              {lt(lang, 'hero_cta')} <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <span className="cta-subtext">{lt(lang, 'hero_cta_note')}</span>
          </Reveal>
        </section>

        {/* ── FOOTER ── */}
        <footer style={s.footer}>
          <p style={s.footerLogo}>✦ Alignment</p>
          <p style={s.footerText}>{lt(lang, 'footer_text')}</p>
        </footer>

      </main>
    </>
  )
}

const s = {
  // Layout
  wrap: { maxWidth:'1040px', margin:'0 auto', padding:'0 24px' },

  // Nav
  nav: { position:'sticky', top:0, zIndex:100, background:'rgba(11,14,42,0.72)', backdropFilter:'blur(16px)', borderBottom:'1px solid var(--border)' },
  navInner: { maxWidth:'1040px', margin:'0 auto', padding:'0 24px', display:'flex', justifyContent:'space-between', alignItems:'center', height:'64px' },
  logo: { fontSize:'19px', fontWeight:'600', fontFamily:'Cormorant Garamond, serif', letterSpacing:'0.5px' },
  navRight: { display:'flex', alignItems:'center', gap:'10px' },
  langSelect: { padding:'8px 10px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--surface)', fontSize:'13px', color:'var(--text)', cursor:'pointer', maxWidth:'130px' },
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