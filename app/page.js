import Link from 'next/link'

export default function Home() {
  return (
    <main style={styles.container}>

      {/* Nav */}
      <nav style={styles.nav}>
        <p style={styles.logo}>Alignment</p>
        <div style={styles.navLinks}>
          <Link href="/subscribe" style={styles.navLink}>Accountability</Link>
          <Link href="/onboarding" style={styles.ctaButton}>Get Your Profile →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Self-Alignment Platform</p>
        <h1 style={styles.heroTitle}>
          Understand yourself.<br />
          Build structure.<br />
          Stay consistent.
        </h1>
        <p style={styles.heroSubtitle}>
          A practical system that combines astrology, numerology, and human design 
          to generate your personal blueprint — then holds you accountable to it.
        </p>
        <div style={styles.heroButtons}>
          <Link href="/onboarding" style={styles.primaryButton}>
            Generate My Profile →
          </Link>
          <Link href="/subscribe" style={styles.secondaryButton}>
            View Accountability Plan
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How it works</h2>
        <div style={styles.stepsGrid}>
          <div style={styles.stepCard}>
            <p style={styles.stepNumber}>01</p>
            <h3 style={styles.stepTitle}>Enter your birth data</h3>
            <p style={styles.stepText}>Name, date, time, and city of birth. Takes 30 seconds.</p>
          </div>
          <div style={styles.stepCard}>
            <p style={styles.stepNumber}>02</p>
            <h3 style={styles.stepTitle}>Get your profile</h3>
            <p style={styles.stepText}>A structured personal blueprint — strengths, vulnerabilities, energy patterns, decision style.</p>
          </div>
          <div style={styles.stepCard}>
            <p style={styles.stepNumber}>03</p>
            <h3 style={styles.stepTitle}>Follow your plan</h3>
            <p style={styles.stepText}>A 3-layer alignment plan with daily structure, keystone habits, and anti-sabotage rules.</p>
          </div>
          <div style={styles.stepCard}>
            <p style={styles.stepNumber}>04</p>
            <h3 style={styles.stepTitle}>Stay accountable</h3>
            <p style={styles.stepText}>Daily check-ins, alignment score, streak tracking, and weekly reviews.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Simple pricing</h2>
        <div style={styles.pricingGrid}>
          <div style={styles.pricingCard}>
            <h3 style={styles.pricingTitle}>Profile</h3>
            <p style={styles.pricingPrice}>$27 <span style={styles.pricingPeriod}>one-time</span></p>
            <ul style={styles.pricingFeatures}>
              <li style={styles.pricingFeature}>✦ Full personal blueprint</li>
              <li style={styles.pricingFeature}>✦ SWOT analysis</li>
              <li style={styles.pricingFeature}>✦ Alignment plan</li>
              <li style={styles.pricingFeature}>✦ PDF download</li>
            </ul>
            <Link href="/onboarding" style={styles.pricingButton}>Get Started →</Link>
          </div>
          <div style={{ ...styles.pricingCard, ...styles.pricingCardFeatured }}>
            <h3 style={{ ...styles.pricingTitle, color: '#fff' }}>Accountability</h3>
            <p style={{ ...styles.pricingPrice, color: '#fff' }}>$15 <span style={{ ...styles.pricingPeriod, color: '#aaa' }}>/month</span></p>
            <ul style={styles.pricingFeatures}>
              <li style={{ ...styles.pricingFeature, color: '#ddd' }}>✦ Everything in Profile</li>
              <li style={{ ...styles.pricingFeature, color: '#ddd' }}>✦ Daily check-in system</li>
              <li style={{ ...styles.pricingFeature, color: '#ddd' }}>✦ Alignment score</li>
              <li style={{ ...styles.pricingFeature, color: '#ddd' }}>✦ Streak tracking</li>
              <li style={{ ...styles.pricingFeature, color: '#ddd' }}>✦ Weekly review</li>
              <li style={{ ...styles.pricingFeature, color: '#ddd' }}>✦ Email reminders</li>
            </ul>
            <Link href="/subscribe" style={{ ...styles.pricingButton, backgroundColor: '#fff', color: '#111' }}>Start Accountability →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>Self Alignment Platform — Not mystical. Not vague. Just clarity.</p>
      </footer>

    </main>
  )
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '0 20px' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid #eee', marginBottom: '80px' },
  logo: { fontSize: '20px', fontWeight: '700', color: '#111' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '24px' },
  navLink: { fontSize: '15px', color: '#555', textDecoration: 'none' },
  ctaButton: { padding: '10px 20px', backgroundColor: '#111', color: '#fff', borderRadius: '6px', fontSize: '14px', textDecoration: 'none' },
  hero: { textAlign: 'center', marginBottom: '100px' },
  eyebrow: { fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' },
  heroTitle: { fontSize: '52px', fontWeight: '700', lineHeight: '1.15', color: '#111', marginBottom: '24px' },
  heroSubtitle: { fontSize: '18px', color: '#666', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 40px' },
  heroButtons: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
  primaryButton: { padding: '14px 28px', backgroundColor: '#111', color: '#fff', borderRadius: '8px', fontSize: '16px', textDecoration: 'none' },
  secondaryButton: { padding: '14px 28px', backgroundColor: '#f0f0f0', color: '#111', borderRadius: '8px', fontSize: '16px', textDecoration: 'none' },
  section: { marginBottom: '100px' },
  sectionTitle: { fontSize: '32px', fontWeight: '700', marginBottom: '40px', textAlign: 'center' },
  stepsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  stepCard: { background: '#f9f9f9', borderRadius: '12px', padding: '28px' },
  stepNumber: { fontSize: '32px', fontWeight: '700', color: '#ddd', marginBottom: '12px' },
  stepTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111' },
  stepText: { fontSize: '15px', color: '#666', lineHeight: '1.6' },
  pricingGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  pricingCard: { background: '#f9f9f9', borderRadius: '16px', padding: '32px' },
  pricingCardFeatured: { background: '#111' },
  pricingTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#111' },
  pricingPrice: { fontSize: '36px', fontWeight: '700', color: '#111', marginBottom: '24px' },
  pricingPeriod: { fontSize: '16px', color: '#888' },
  pricingFeatures: { listStyle: 'none', padding: '0', margin: '0 0 28px 0' },
  pricingFeature: { fontSize: '15px', padding: '8px 0', borderBottom: '1px solid #eee', color: '#444' },
  pricingButton: { display: 'block', textAlign: 'center', padding: '12px', backgroundColor: '#111', color: '#fff', borderRadius: '8px', fontSize: '15px', textDecoration: 'none' },
  footer: { borderTop: '1px solid #eee', padding: '40px 0', textAlign: 'center', marginTop: '40px' },
  footerText: { fontSize: '14px', color: '#aaa' }
}