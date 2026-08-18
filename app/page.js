'use client'

// LANDING — rescris integral (calup arhitectura 30.07, L1-L6). Doar pentru
// necunoscuți: userul logat e trimis direct în Azi de proxy.js, înainte să
// ajungă aici. Apa ambientală vine din WaterVideoLayer (montată global în
// layout.js) — pagina asta nu are propriul fundal, textul plutește direct
// pe apă, fără casete opace.

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useLanguage, LANGUAGES } from '../lib/language'
import { lt } from '../lib/landing'
import { APP_NAME, appFullIdentity } from '../lib/appConfig'

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

export default function Home() {
  const [lang, changeLanguage] = useLanguage()

  // GCAO A6 (01.08.2026) — fundatia afilierii prin coduri de influencer:
  // ?ref=COD se persista in localStorage pana la inregistrare (citit in
  // onboarding/page.js la finalul flow-ului). Fara reducere, doar atribuire.
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get('ref')
      if (ref) localStorage.setItem('invite_ref_code', ref.trim())
    } catch (e) {}
  }, [])

  return (
    <main style={s.wrap}>

      {/* ── NAV — doar numele, fara CTA propriu (un singur CTA auriu per ecran) ── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <p style={s.logo}>{APP_NAME}</p>
        </div>
      </nav>

      {/* ── L1 — HERO, plutind pe apă ── */}
      <section style={s.hero}>
        {/* IDENTITATE (raport 30.07): randul complet nume + descriptor +
            tagline, cerut explicit verificabil pe landing — nu doar numele
            gol din navbar de mai sus. */}
        <p style={s.identityLine} className="anim-fade-in">{appFullIdentity(lang)}</p>
        <h1 style={s.heroTitle} className="anim-fade-in">
          {lt(lang, 'hero_title')}
        </h1>
        <p style={s.heroSub} className="anim-fade-in stagger-3">
          {lt(lang, 'hero_sub')}
        </p>
        <div className="anim-fade-in stagger-5" style={{ display: 'inline-block' }}>
          <Link href="/onboarding" className="cta-premium cta-premium-large">
            {lt(lang, 'hero_cta')} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
        {/* GCAO A4 (01.08.2026) — contorul viu "primii 1.000" ELIMINAT;
            linia probei de 3 zile, statica, il inlocuieste (A5). */}
        <p style={s.heroSpots} className="anim-fade-in stagger-5">
          {lt(lang, 'hero_trial_line')}
        </p>
        <Link href="/login" style={s.heroLogin}>{lt(lang, 'hero_login')}</Link>
      </section>

      {/* ── L2 — CE PRIMEȘTI: 3 carduri ── */}
      <section style={s.section}>
        <Reveal as="h2" style={s.sectionTitle}>{lt(lang, 'get_title')}</Reveal>
        <div className="story-grid" style={{ marginTop: '36px' }}>
          <Reveal delay={0}>
            <div className="story-card story-card-purple">
              <span className="story-tag">{lt(lang, 'card_profile_tag')}</span>
              <p className="story-text">{lt(lang, 'card_profile_text')}</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="story-card story-card-green">
              <span className="story-tag" style={{ color: 'var(--green)' }}>{lt(lang, 'card_ritual_tag')}</span>
              <p className="story-text">{lt(lang, 'card_ritual_text')}</p>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="story-card story-card-amber">
              <span className="story-tag" style={{ color: 'var(--orange)' }}>{lt(lang, 'card_path_tag')}</span>
              <p className="story-text">{lt(lang, 'card_path_text')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── L3 — CUM FUNCȚIONEAZĂ: 3 pași pe un rând ── */}
      <section style={s.section}>
        <Reveal as="h2" style={s.sectionTitle}>{lt(lang, 'how_title')}</Reveal>
        <div style={s.threeGrid}>
          {[lt(lang, 'step1'), lt(lang, 'step2'), lt(lang, 'step3')].map((text, i) => (
            <Reveal key={i} delay={i * 120}>
              <div style={s.stepCard} className="landing-card">
                <p style={s.stepNum}>{i + 1}</p>
                <p style={s.stepText}>{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── L4 — PREȚURILE, PE FAȚĂ: un singur bloc, fara asteriscuri ── */}
      <section style={s.pricingSection}>
        <Reveal as="h2" style={s.sectionTitle}>{lt(lang, 'pricing_title')}</Reveal>
        <Reveal as="p" style={s.pricingBody} delay={80}>
          {lt(lang, 'pricing_body')}
        </Reveal>
      </section>

      {/* ── L5 — LIMBILE: steaguri ca butoane, nu <select> ── */}
      <section style={s.langsSection}>
        <Reveal as="p" style={s.langsTitle}>{lt(lang, 'langs_title')}</Reveal>
        <div style={s.flagRow} role="group" aria-label={lt(lang, 'nav_language_label')}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => changeLanguage(l.code)}
              aria-label={l.label}
              aria-pressed={lang === l.code}
              style={{ ...s.flagBtn, ...(lang === l.code ? s.flagBtnActive : null) }}
              className="btn-lift"
            >
              {l.flag}
            </button>
          ))}
        </div>
      </section>

      {/* ── L6 — ÎNCHIDERE ── */}
      <section style={s.ctaSection}>
        <Reveal as="h2" style={s.ctaTitle}>
          {lt(lang, 'final_1')}
          <br />
          <span className="gradient-text-fast">{lt(lang, 'final_2')}</span>
        </Reveal>
        <Reveal delay={150} style={{ display: 'inline-block' }}>
          <Link href="/onboarding" className="cta-premium cta-premium-large">
            {lt(lang, 'hero_cta')} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>

    </main>
  )
}

const s = {
  wrap: { maxWidth: '1040px', margin: '0 auto', padding: '0 24px' },

  // REPARAȚIE P0 06.08.2026 — nav-ul sticky nu avea niciun fundal, deci
  // odată lipit sus la scroll, "Aquanima" se suprapunea peste orice titlu
  // ajungea dedesubt (raportat: peste "The prices, upfront"). Fundal scrim,
  // consecvent cu restul aplicației (.water-sheet), nu o casetă nouă.
  nav: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(11,18,32,0.72)', backdropFilter: 'blur(12px)' },
  navInner: { maxWidth: '1040px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: '64px' },
  logo: { fontSize: '19px', fontWeight: '600', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.5px', color: 'var(--text)', textShadow: '0 1px 12px rgba(0,0,0,0.4)' },

  // Hero — text plutind pe apă, fără casetă opacă. text-shadow ține citirea
  // lizibilă peste apa în mișcare (regula tipografiei: contrast, nu decor).
  hero: { position: 'relative', textAlign: 'center', padding: 'clamp(70px, 13vw, 130px) 0 clamp(50px, 9vw, 90px)' },
  identityLine: { fontSize: '12.5px', letterSpacing: '0.3px', color: 'rgba(244,240,234,0.55)', textShadow: '0 1px 8px rgba(0,0,0,0.4)', marginBottom: '18px', padding: '0 20px' },
  heroTitle: {
    fontSize: 'clamp(38px, 7.5vw, 68px)', fontWeight: '600', color: '#fff', lineHeight: '1.1',
    marginBottom: '20px', letterSpacing: '-1px', fontFamily: 'Cormorant Garamond, serif',
    textShadow: '0 2px 20px rgba(0,0,0,0.5)',
  },
  heroSub: {
    fontSize: 'clamp(16px, 2vw, 19px)', color: 'rgba(255,255,255,0.88)', lineHeight: '1.7',
    maxWidth: '520px', margin: '0 auto 36px', fontWeight: '300', textShadow: '0 1px 12px rgba(0,0,0,0.45)',
  },
  heroSpots: { marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', textShadow: '0 1px 8px rgba(0,0,0,0.4)' },
  heroLogin: { display: 'block', marginTop: '22px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', textShadow: '0 1px 8px rgba(0,0,0,0.4)' },

  section: { padding: 'clamp(40px, 7vw, 80px) 0' },
  sectionTitle: {
    fontSize: 'clamp(30px, 4.6vw, 44px)', fontWeight: '600', color: 'var(--text)', marginBottom: '16px',
    fontFamily: 'Cormorant Garamond, serif', lineHeight: '1.15', letterSpacing: '-0.4px', textAlign: 'center',
  },

  threeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: '22px', marginTop: '36px' },
  stepCard: { background: 'var(--surface)', borderRadius: '20px', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' },
  stepNum: { fontSize: '38px', fontWeight: '700', fontFamily: 'Cormorant Garamond, serif', marginBottom: '10px', color: 'var(--gold)', lineHeight: 1 },
  stepText: { fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.7' },

  pricingSection: { padding: 'clamp(40px, 7vw, 80px) 0' },
  pricingBody: {
    fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '620px',
    margin: '0 auto', textAlign: 'center', fontWeight: '300',
  },

  langsSection: { padding: 'clamp(30px, 5vw, 60px) 0', textAlign: 'center' },
  langsTitle: { fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px', letterSpacing: '0.3px' },
  flagRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' },
  flagBtn: {
    fontSize: '26px', lineHeight: 1, padding: '10px', borderRadius: '12px', background: 'var(--surface)',
    border: '1px solid var(--border)', cursor: 'pointer', minWidth: '44px', minHeight: '44px',
  },
  flagBtnActive: { border: '1.5px solid var(--gold-soft)', boxShadow: '0 0 0 3px var(--gold-faint)' },

  ctaSection: { textAlign: 'center', padding: 'clamp(50px, 9vw, 100px) 0 clamp(60px, 8vw, 90px)' },
  ctaTitle: {
    fontSize: 'clamp(26px, 3.8vw, 40px)', fontWeight: '600', color: 'var(--text)', marginBottom: '36px',
    fontFamily: 'Cormorant Garamond, serif', lineHeight: '1.25', letterSpacing: '-0.3px',
  },
}
