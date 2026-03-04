import Link from 'next/link'

export default function Home() {
  return (
    <>
      <div className="cosmic-bg" />

      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <p style={s.logo}>✦ Alignment</p>
          <div style={s.navLinks}>
            <Link href="#accountability" style={s.navLink}>Accountability</Link>
            <Link href="#profile" style={s.navLink}>Free Profile</Link>
            <Link href="/onboarding" style={s.navCta}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      <main style={s.wrap}>

        {/* HERO */}
        <section style={s.hero}>
          <div style={s.heroEyebrow}>
            <span className="tag tag-purple">Know Yourself. Align. Thrive.</span>
          </div>

          <h1 style={s.heroTitle}>
            Life is not about<br />
            manifesting.<br />
            <span style={s.heroGradient}>It's about aligning with yourself.</span>
          </h1>

          <p style={s.heroSub}>
            When you align with yourself — everything else follows.
            <br />
            Your free personal blueprint starts here.
          </p>

          <Link href="/onboarding" style={s.heroCta}>
            Discover Your Blueprint — Free →
          </Link>

          <p style={s.heroMicro}>
            No account needed. No payment. Just clarity.
          </p>

          <div style={s.proofBar}>
            <div style={s.proofItem}>
              <span style={s.proofNum}>3</span>
              <span style={s.proofLabel}>Systems combined</span>
            </div>
            <div style={s.proofDivider} />
            <div style={s.proofItem}>
              <span style={s.proofNum}>7</span>
              <span style={s.proofLabel}>Profile sections</span>
            </div>
            <div style={s.proofDivider} />
            <div style={s.proofItem}>
              <span style={s.proofNum}>30s</span>
              <span style={s.proofLabel}>To generate</span>
            </div>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section style={s.section} id="profile">
          <div style={s.sectionLabel}>
            <span className="tag tag-green">What you get — Free</span>
          </div>
          <h2 style={s.sectionTitle}>
            Your personal blueprint.<br />Clear. Structured. Free.
          </h2>
          <p style={s.sectionSub}>
            We combine Astrology, Numerology, and Human Design into one
            structured, AI-powered profile. Warm, honest, and actionable.
            No mysticism. No vague predictions. Just you — clearly seen.
          </p>

          <div style={s.featuresGrid}>
            {[
              { icon:'◎', color:'var(--purple)', bg:'var(--purple-light)', title:'Core Energetic Blueprint', text:'A synthesized summary of how you operate, what drives you, and what energizes you most.' },
              { icon:'✦', color:'var(--green)', bg:'var(--green-light)', title:'Natural Strengths', text:'Celebrate what you are genuinely wired for — your unique gifts and natural advantages.' },
              { icon:'🌱', color:'var(--orange)', bg:'var(--orange-light)', title:'Growth Opportunities', text:'The specific patterns holding you back — named clearly so you can move through them.' },
              { icon:'⚡', color:'var(--purple)', bg:'var(--purple-light)', title:'Energy Patterns', text:'When you peak, when you rest, and how to design your days to flow naturally.' },
              { icon:'🧭', color:'var(--green)', bg:'var(--green-light)', title:'Alignment Plan', text:'A 3-layer plan: direction, structure, and behavioral anchors. Starts today.' },
              { icon:'🪞', color:'var(--orange)', bg:'var(--orange-light)', title:'Self Perspective', text:'A compassionate, clear view of your natural gifts, growth edges, and biggest opportunities.' },
            ].map((f, i) => (
              <div key={i} style={s.featureCard}>
                <div style={{...s.featureIconBox, color: f.color, background: f.bg}}>{f.icon}</div>
                <h3 style={s.featureTitle}>{f.title}</h3>
                <p style={s.featureText}>{f.text}</p>
              </div>
            ))}
          </div>

          <div style={s.profileCta}>
            <Link href="/onboarding" style={s.heroCta}>Get Your Free Profile →</Link>
            <p style={s.heroMicro}>Takes 30 seconds. No account needed.</p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={s.section}>
          <div style={s.sectionLabel}>
            <span className="tag tag-purple">The process</span>
          </div>
          <h2 style={s.sectionTitle}>
            Three steps.<br />Total time: 2 minutes.
          </h2>

          <div style={s.stepsRow}>
            {[
              { n:'01', color:'var(--purple)', title:'Enter your birth data', text:'Name, date, time, and city. This is how the three systems calculate your unique chart.' },
              { n:'02', color:'var(--green)', title:'We generate your profile', text:'Our AI synthesizes astrology, numerology, and human design into one warm, clear document.' },
              { n:'03', color:'var(--orange)', title:'Read. Reflect. Grow.', text:'Download your PDF. Start your alignment plan today. Subscribe for ongoing accountability.' },
            ].map((step, i) => (
              <div key={i} style={s.stepCard}>
                <p style={{...s.stepNum, color: step.color}}>{step.n}</p>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SYSTEMS */}
        <section style={s.systemsSection}>
          <h2 style={s.systemsTitle}>Three systems. One synthesis.</h2>
          <div style={s.systemsGrid}>
            <div style={s.systemCard}>
              <span className="tag tag-purple" style={{marginBottom:'16px', display:'inline-block'}}>Astrology</span>
              <p style={s.systemText}>Your sun sign reveals your core energetic signature — how you move through the world, what fuels you, and where you have the most natural momentum.</p>
            </div>
            <div style={s.systemCard}>
              <span className="tag tag-green" style={{marginBottom:'16px', display:'inline-block'}}>Human Design</span>
              <p style={s.systemText}>Your energy type shows how you make aligned decisions, how you work best, and what lights you up when you honor your natural rhythm.</p>
            </div>
            <div style={s.systemCard}>
              <span className="tag tag-orange" style={{marginBottom:'16px', display:'inline-block'}}>Numerology</span>
              <p style={s.systemText}>Your life path and expression numbers reveal your deeper purpose, natural talents, and the themes that keep showing up to help you grow.</p>
            </div>
          </div>
        </section>

        {/* ACCOUNTABILITY SECTION */}
        <section style={s.accountabilitySection} id="accountability">
          <div style={s.accountabilityInner}>
            <div style={s.sectionLabel}>
              <span className="tag" style={{background:'rgba(255,255,255,0.15)', color:'#fff'}}>Accountability System</span>
            </div>
            <h2 style={s.accountabilityTitle}>
              We are accountable to everyone.<br />
              <span style={s.accountabilityAccent}>Except ourselves.</span>
            </h2>
            <p style={s.accountabilityText}>
              We show up for our bosses, our families, our friends.
              But when it comes to our own growth — we let it slide.
              The Accountability System changes that.
              It's time to take action. For yourself.
            </p>

            <div style={s.accountabilityFeatures}>
              {[
                { icon:'◎', title:'Daily Check-in', text:'3 questions. 2 minutes. Every day.' },
                { icon:'⚡', title:'Alignment Score', text:'A daily metric that reflects how aligned you are.' },
                { icon:'⟳', title:'Streak Tracking', text:'Build consistency. Watch momentum grow.' },
                { icon:'🪞', title:'Weekly Review', text:'Reflect, reset, and realign every weekend.' },
              ].map((f, i) => (
                <div key={i} style={s.accountabilityCard}>
                  <p style={s.accountabilityIcon}>{f.icon}</p>
                  <p style={s.accountabilityFeatureTitle}>{f.title}</p>
                  <p style={s.accountabilityFeatureText}>{f.text}</p>
                </div>
              ))}
            </div>

            <div style={s.accountabilityCta}>
              <Link href="/subscribe" style={s.accountabilityBtn}>
                Take Action — $15/month →
              </Link>
              <p style={s.accountabilityMicro}>Cancel anytime. No lock-in.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={s.ctaSection}>
          <h2 style={s.ctaTitle}>
            Your most aligned life<br />starts with knowing yourself.
          </h2>
          <p style={s.ctaText}>
            Start with your free profile. Then stay accountable to yourself — every day.
          </p>
          <Link href="/onboarding" style={s.ctaBtn}>
            Get Your Free Profile →
          </Link>
          <p style={s.ctaMicro}>Then explore our accountability system — $15/month</p>
        </section>

        {/* Footer */}
        <footer style={s.footer}>
          <p style={s.footerLogo}>✦ Alignment</p>
          <p style={s.footerTagline}>Know yourself. Align your energy. Fulfill your potential.</p>
          <div style={s.footerLinks}>
            <Link href="/onboarding" style={s.footerLink}>Free Profile</Link>
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
  nav: { position:'sticky', top:0, zIndex:100, background:'rgba(250,250,248,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--border)' },
  navInner: { maxWidth:'960px', margin:'0 auto', padding:'0 24px', display:'flex', justifyContent:'space-between', alignItems:'center', height:'64px' },
  logo: { fontSize:'18px', fontWeight:'600', fontFamily:'Cormorant Garamond, serif', letterSpacing:'0.5px' },
  navLinks: { display:'flex', alignItems:'center', gap:'28px' },
  navLink: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500' },
  navCta: { padding:'9px 20px', background:'var(--purple)', color:'#fff', borderRadius:'8px', fontSize:'14px', fontWeight:'500' },
  hero: { textAlign:'center', padding:'100px 0 80px' },
  heroEyebrow: { marginBottom:'28px' },
  heroTitle: { fontSize:'clamp(52px, 8vw, 88px)', fontWeight:'600', color:'var(--text)', lineHeight:'1.05', marginBottom:'28px', letterSpacing:'-1px', fontFamily:'Cormorant Garamond, serif' },
  heroGradient: { background:'linear-gradient(135deg, var(--purple) 0%, var(--orange) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
  heroSub: { fontSize:'20px', color:'var(--text-muted)', lineHeight:'1.7', maxWidth:'520px', margin:'0 auto 40px', fontWeight:'300' },
  heroCta: { display:'inline-block', padding:'16px 36px', background:'var(--purple)', color:'#fff', borderRadius:'12px', fontSize:'17px', fontWeight:'500', boxShadow:'0 6px 30px rgba(124,92,191,0.35)', marginBottom:'16px' },
  heroMicro: { fontSize:'13px', color:'var(--text-light)', marginBottom:'60px' },
  proofBar: { display:'inline-flex', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'20px 40px', boxShadow:'var(--shadow)' },
  proofItem: { textAlign:'center', padding:'0 32px' },
  proofNum: { display:'block', fontSize:'32px', fontWeight:'700', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  proofLabel: { display:'block', fontSize:'12px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginTop:'4px' },
  proofDivider: { width:'1px', background:'var(--border)' },
  section: { marginBottom:'100px' },
  sectionLabel: { marginBottom:'16px' },
  sectionTitle: { fontSize:'clamp(32px, 4vw, 52px)', fontWeight:'600', color:'var(--text)', marginBottom:'20px', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.15' },
  sectionSub: { fontSize:'16px', color:'var(--text-muted)', lineHeight:'1.75', maxWidth:'600px', marginBottom:'48px', fontWeight:'300' },
  featuresGrid: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px', marginBottom:'48px' },
  featureCard: { background:'var(--surface)', borderRadius:'var(--radius)', padding:'24px', border:'1px solid var(--border)', boxShadow:'var(--shadow)' },
  featureIconBox: { display:'inline-flex', alignItems:'center', justifyContent:'center', width:'40px', height:'40px', borderRadius:'10px', fontSize:'18px', marginBottom:'14px' },
  featureTitle: { fontSize:'16px', fontWeight:'600', color:'var(--text)', marginBottom:'8px', fontFamily:'Cormorant Garamond, serif' },
  featureText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6' },
  profileCta: { textAlign:'center', marginTop:'8px' },
  stepsRow: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'24px' },
  stepCard: { background:'var(--surface)', borderRadius:'var(--radius)', padding:'28px', border:'1px solid var(--border)', boxShadow:'var(--shadow)' },
  stepNum: { fontSize:'40px', fontWeight:'700', fontFamily:'Cormorant Garamond, serif', marginBottom:'12px', display:'block' },
  stepTitle: { fontSize:'18px', fontWeight:'600', color:'var(--text)', marginBottom:'10px', fontFamily:'Cormorant Garamond, serif' },
  stepText: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6' },
  systemsSection: { background:'linear-gradient(135deg, var(--purple-dark) 0%, var(--purple) 100%)', borderRadius:'24px', padding:'60px', marginBottom:'100px' },
  systemsTitle: { fontSize:'clamp(28px, 3vw, 40px)', fontWeight:'600', color:'#fff', marginBottom:'40px', textAlign:'center', fontFamily:'Cormorant Garamond, serif' },
  systemsGrid: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px' },
  systemCard: { background:'rgba(255,255,255,0.08)', borderRadius:'16px', padding:'24px', border:'1px solid rgba(255,255,255,0.12)' },
  systemText: { fontSize:'14px', color:'rgba(255,255,255,0.75)', lineHeight:'1.7' },
  accountabilitySection: { background:'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', borderRadius:'24px', padding:'80px 60px', marginBottom:'100px' },
  accountabilityInner: { maxWidth:'720px', margin:'0 auto', textAlign:'center' },
  accountabilityTitle: { fontSize:'clamp(32px, 4vw, 52px)', fontWeight:'600', color:'#fff', marginBottom:'20px', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.2', marginTop:'16px' },
  accountabilityAccent: { color:'var(--orange)' },
  accountabilityText: { fontSize:'17px', color:'rgba(255,255,255,0.7)', lineHeight:'1.8', maxWidth:'560px', margin:'0 auto 48px', fontWeight:'300' },
  accountabilityFeatures: { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', marginBottom:'48px' },
  accountabilityCard: { background:'rgba(255,255,255,0.06)', borderRadius:'16px', padding:'24px 16px', border:'1px solid rgba(255,255,255,0.1)' },
  accountabilityIcon: { fontSize:'28px', marginBottom:'12px' },
  accountabilityFeatureTitle: { fontSize:'15px', fontWeight:'600', color:'#fff', marginBottom:'6px' },
  accountabilityFeatureText: { fontSize:'13px', color:'rgba(255,255,255,0.6)', lineHeight:'1.5' },
  accountabilityCta: { textAlign:'center' },
  accountabilityBtn: { display:'inline-block', padding:'16px 36px', background:'var(--orange)', color:'#fff', borderRadius:'12px', fontSize:'17px', fontWeight:'500', boxShadow:'0 6px 30px rgba(232,130,74,0.4)', marginBottom:'12px' },
  accountabilityMicro: { fontSize:'13px', color:'rgba(255,255,255,0.4)' },
  ctaSection: { textAlign:'center', padding:'80px 0 60px' },
  ctaTitle: { fontSize:'clamp(32px, 4vw, 52px)', fontWeight:'600', color:'var(--text)', marginBottom:'16px', fontFamily:'Cormorant Garamond, serif', lineHeight:'1.2' },
  ctaText: { fontSize:'17px', color:'var(--text-muted)', lineHeight:'1.7', maxWidth:'480px', margin:'0 auto 40px', fontWeight:'300' },
  ctaBtn: { display:'inline-block', padding:'16px 36px', background:'var(--purple)', color:'#fff', borderRadius:'12px', fontSize:'17px', fontWeight:'500', boxShadow:'0 6px 30px rgba(124,92,191,0.35)', marginBottom:'16px' },
  ctaMicro: { display:'block', fontSize:'13px', color:'var(--text-light)', marginTop:'8px' },
  footer: { borderTop:'1px solid var(--border)', padding:'48px 0', textAlign:'center' },
  footerLogo: { fontSize:'18px', fontWeight:'600', fontFamily:'Cormorant Garamond, serif', marginBottom:'8px' },
  footerTagline: { fontSize:'14px', color:'var(--text-muted)', marginBottom:'24px' },
  footerLinks: { display:'flex', gap:'24px', justifyContent:'center' },
  footerLink: { fontSize:'14px', color:'var(--text-muted)' }
}