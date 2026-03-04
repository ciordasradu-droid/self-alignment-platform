import Link from 'next/link'

export default function Home() {
  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>

        {/* Nav */}
        <nav style={s.nav}>
          <div style={s.navInner}>
            <p style={s.logo}>✦ Alignment</p>
            <div style={s.navLinks}>
              <Link href="/subscribe" style={s.navLink}>Accountability</Link>
              <Link href="/dashboard" style={s.navLink}>Dashboard</Link>
              <Link href="/onboarding" style={s.cta}>Get Your Profile →</Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section style={s.hero}>
          <span className="tag tag-purple" style={{marginBottom:'24px', display:'inline-block'}}>
            Self-Alignment Platform
          </span>
          <h1 style={s.heroTitle}>
            Understand yourself.<br />
            Build structure.<br />
            <span style={s.heroAccent}>Stay consistent.</span>
          </h1>
          <p style={s.heroSub}>
            A practical system combining astrology, numerology, and human design
            to generate your personal blueprint — then holds you accountable to it.
          </p>
          <div style={s.heroButtons}>
            <Link href="/onboarding" style={s.btnPrimary}>Generate My Profile →</Link>
            <Link href="/subscribe" style={s.btnSecondary}>View Accountability</Link>
          </div>

          {/* floating tags */}
          <div style={s.floatTags}>
            <span className="tag tag-purple">Astrology</span>
            <span className="tag tag-green">Human Design</span>
            <span className="tag tag-orange">Numerology</span>
          </div>
        </section>

        {/* Divider */}
        <div style={s.divider} />

        {/* How it works */}
        <section style={s.section}>
          <span className="tag tag-green" style={{marginBottom:'16px', display:'inline-block'}}>Process</span>
          <h2 style={s.sectionTitle}>How it works</h2>
          <div style={s.stepsGrid}>
            {[
              { n:'01', title:'Enter your birth data', text:'Name, date, time, and city of birth. Takes 30 seconds.', color:'var(--purple)', bg:'var(--purple-light)' },
              { n:'02', title:'Get your profile', text:'A structured personal blueprint — strengths, vulnerabilities, energy patterns, decision style.', color:'var(--green)', bg:'var(--green-light)' },
              { n:'03', title:'Follow your plan', text:'A 3-layer alignment plan with daily structure, keystone habits, and anti-sabotage rules.', color:'var(--orange)', bg:'var(--orange-light)' },
              { n:'04', title:'Stay accountable', text:'Daily check-ins, alignment score, streak tracking, and weekly reviews.', color:'var(--purple)', bg:'var(--purple-light)' },
            ].map((step, i) => (
              <div key={i} style={s.stepCard}>
                <div style={{...s.stepNum, color: step.color, background: step.bg}}>{step.n}</div>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={s.divider} />

        {/* Pricing */}
        <section style={s.section}>
          <span className="tag tag-orange" style={{marginBottom:'16px', display:'inline-block'}}>Pricing</span>
          <h2 style={s.sectionTitle}>Simple pricing</h2>
          <div style={s.pricingGrid}>

            <div style={s.pricingCard}>
              <span className="tag tag-purple" style={{marginBottom:'20px', display:'inline-block'}}>Profile</span>
              <div style={s.priceRow}>
                <span style={s.price}>$27</span>
                <span style={s.period}>one-time</span>
              </div>
              <ul style={s.features}>
                {['Full personal blueprint','SWOT analysis','Alignment plan','PDF download'].map((f,i) => (
                  <li key={i} style={s.feature}>
                    <span style={{color:'var(--purple)', marginRight:'8px'}}>✦</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding" style={{...s.btnPrimary, display:'block', textAlign:'center'}}>Get Started →</Link>
            </div>

            <div style={s.pricingCardFeatured}>
              <span className="tag" style={{background:'rgba(255,255,255,0.15)', color:'#fff', marginBottom:'20px', display:'inline-block'}}>Accountability</span>
              <div style={s.priceRow}>
                <span style={{...s.price, color:'#fff'}}>$15</span>
                <span style={{...s.period, color:'rgba(255,255,255,0.6)'}}>/month</span>
              </div>
              <ul style={s.features}>
                {['Everything in Profile','Daily check-in system','Alignment score','Streak tracking','Weekly review','Email reminders'].map((f,i) => (
                  <li key={i} style={{...s.feature, borderColor:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.85)'}}>
                    <span style={{color:'var(--orange)', marginRight:'8px'}}>✦</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/subscribe" style={{...s.btnSecondary, display:'block', textAlign:'center', background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)'}}>
                Start Accountability →
              </Link>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer style={s.footer}>
          <p style={s.logo}>✦ Alignment</p>
          <p style={s.footerText}>Not mystical. Not vague. Just clarity.</p>
          <div style={s.footerLinks}>
            <Link href="/onboarding" style={s.footerLink}>Get Profile</Link>
            <Link href="/subscribe" style={s.footerLink}>Accountability</Link>
            <Link href="/dashboard" style={s.footerLink}>Dashboard</Link>
          </div>
        </footer>

      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'960px', margin:'0 auto', padding:'0 24px' },
  nav: { position:'sticky', top:0, zIndex:100, background:'rgba(250,250,248,0.85)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--border)', marginBottom:'80px' },
  navInner: { maxWidth:'960px', margin:'0 auto', padding:'0 24px', display:'flex', justifyContent:'space-between', alignItems:'center', height:'64px' },
  logo: { fontSize:'18px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', letterSpacing:'0.5px' },
  navLinks: { display:'flex', alignItems:'center', gap:'28px' },
  navLink: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500' },
  cta: { padding:'9px 20px', background:'var(--purple)', color:'#fff', borderRadius:'8px', fontSize:'14px', fontWeight:'500' },
  hero: { textAlign:'center', paddingBottom:'80px' },
  heroTitle: { fontSize:'clamp(42px, 6vw, 72px)', fontWeight:'600', color:'var(--text)', marginBottom:'24px', letterSpacing:'-0.5px' },
  heroAccent: { color:'var(--purple)' },
  heroSub: { fontSize:'18px', color:'var(--text-muted)', lineHeight:'1.7', maxWidth:'560px', margin:'0 auto 40px', fontWeight:'300' },
  heroButtons: { display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap', marginBottom:'48px' },
  floatTags: { display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' },
  btnPrimary: { padding:'13px 28px', background:'var(--purple)', color:'#fff', borderRadius:'10px', fontSize:'15px', fontWeight:'500', boxShadow:'0 4px 20px rgba(124,92,191,0.3)' },
  btnSecondary: { padding:'13px 28px', background:'var(--surface)', color:'var(--text)', borderRadius:'10px', fontSize:'15px', fontWeight:'500', border:'1px solid var(--border)' },
  divider: { height:'1px', background:'linear-gradient(90deg, transparent, var(--border), transparent)', margin:'20px 0 80px' },
  section: { marginBottom:'80px' },
  sectionTitle: { fontSize:'clamp(32px, 4vw, 48px)', fontWeight:'600', marginBottom:'48px', color:'var(--text)' },
  stepsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'24px' },
  stepCard: { background:'var(--surface)', borderRadius:'var(--radius)', padding:'28px', border:'1px solid var(--border)', boxShadow:'var(--shadow)' },
  stepNum: { display:'inline-block', padding:'6px 12px', borderRadius:'8px', fontSize:'13px', fontWeight:'700', marginBottom:'16px', letterSpacing:'1px' },
  stepTitle: { fontSize:'18px', fontWeight:'600', marginBottom:'10px', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  stepText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6' },
  pricingGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' },
  pricingCard: { background:'var(--surface)', borderRadius:'var(--radius)', padding:'36px', border:'1px solid var(--border)', boxShadow:'var(--shadow)' },
  pricingCardFeatured: { background:'linear-gradient(135deg, var(--purple-dark) 0%, var(--purple) 100%)', borderRadius:'var(--radius)', padding:'36px', boxShadow:'var(--shadow-lg)' },
  priceRow: { display:'flex', alignItems:'baseline', gap:'8px', marginBottom:'28px' },
  price: { fontSize:'48px', fontWeight:'700', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  period: { fontSize:'16px', color:'var(--text-muted)' },
  features: { listStyle:'none', marginBottom:'28px' },
  feature: { fontSize:'15px', padding:'10px 0', borderBottom:'1px solid var(--border)', color:'var(--text)', display:'flex', alignItems:'center' },
  footer: { borderTop:'1px solid var(--border)', padding:'48px 0', textAlign:'center', marginTop:'40px' },
  footerText: { fontSize:'14px', color:'var(--text-muted)', margin:'8px 0 24px' },
  footerLinks: { display:'flex', gap:'24px', justifyContent:'center' },
  footerLink: { fontSize:'14px', color:'var(--text-muted)' }
}