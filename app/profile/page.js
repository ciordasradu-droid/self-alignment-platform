'use client'

import { useState, useEffect, Suspense } from 'react'
import { generateProfilePDF } from '../../lib/generatePDF'

function ProfileContent() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('profile')
    if (stored) {
      setProfile(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  if (loading) return <div style={s.center}>Loading your profile...</div>
  if (!profile) return <div style={s.center}>No profile data found.</div>

  const { sections, swot, alignment_plan, full_name } = profile

  const handleDownloadPDF = () => generateProfilePDF(profile)

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>

        <div style={s.header}>
          <div>
            <span className="tag tag-purple" style={{marginBottom:'12px', display:'inline-block'}}>Your Profile</span>
            <h1 style={s.title}>Alignment Profile</h1>
            {full_name && <p style={s.subtitle}>Generated for {full_name}</p>}
          </div>
          <button onClick={handleDownloadPDF} style={s.dlBtn}>
            ↓ Download PDF
          </button>
        </div>

        <div style={{...s.card, borderLeft:'4px solid var(--purple)'}}>
          <div style={s.cardLabel('var(--purple-light)', 'var(--purple)')}>✦ Core Energetic Blueprint</div>
          <p style={s.bodyText}>{sections?.blueprint}</p>
        </div>

        <div style={s.grid2}>
          <div style={{...s.card, borderLeft:'4px solid var(--green)'}}>
            <div style={s.cardLabel('var(--green-light)', 'var(--green)')}>Natural Strengths</div>
            <ul style={s.list}>
              {sections?.strengths?.map((item, i) => (
                <li key={i} style={s.listItem}>
                  <span style={{color:'var(--green)', marginRight:'8px'}}>✦</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{...s.card, borderLeft:'4px solid var(--orange)'}}>
            <div style={s.cardLabel('var(--orange-light)', 'var(--orange)')}>Growth Opportunities</div>
            <ul style={s.list}>
              {sections?.vulnerabilities?.map((item, i) => (
                <li key={i} style={s.listItem}>
                  <span style={{color:'var(--orange)', marginRight:'8px'}}>🌱</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={s.grid2}>
          <div style={{...s.card, borderLeft:'4px solid var(--purple)'}}>
            <div style={s.cardLabel('var(--purple-light)', 'var(--purple)')}>Energy Patterns</div>
            <ul style={s.list}>
              {sections?.energy_patterns?.map((item, i) => (
                <li key={i} style={s.listItem}>
                  <span style={{color:'var(--purple)', marginRight:'8px'}}>◦</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{...s.card, borderLeft:'4px solid var(--orange)'}}>
            <div style={s.cardLabel('var(--orange-light)', 'var(--orange)')}>Patterns to Watch</div>
            <ul style={s.list}>
              {sections?.sabotage_tendencies?.map((item, i) => (
                <li key={i} style={s.listItem}>
                  <span style={{color:'var(--orange)', marginRight:'8px'}}>◦</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={s.grid2}>
          <div style={{...s.card, borderLeft:'4px solid var(--green)'}}>
            <div style={s.cardLabel('var(--green-light)', 'var(--green)')}>Decision-Making Style</div>
            <ul style={s.list}>
              {sections?.decision_making?.map((item, i) => (
                <li key={i} style={s.listItem}>
                  <span style={{color:'var(--green)', marginRight:'8px'}}>◦</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{...s.card, borderLeft:'4px solid var(--purple)'}}>
            <div style={s.cardLabel('var(--purple-light)', 'var(--purple)')}>Work & Discipline Profile</div>
            <ul style={s.list}>
              {sections?.work_discipline?.map((item, i) => (
                <li key={i} style={s.listItem}>
                  <span style={{color:'var(--purple)', marginRight:'8px'}}>◦</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardLabel('var(--orange-light)', 'var(--orange)')}>🪞 Self Perspective</div>
          <div style={s.swotGrid}>
            {[
              { title:'Natural Gifts', items: swot?.strengths, color:'var(--green)', icon:'✦' },
              { title:'Growth Edges', items: swot?.weaknesses, color:'var(--orange)', icon:'🌱' },
              { title:'Opportunities to Shine', items: swot?.opportunities, color:'var(--purple)', icon:'✦' },
              { title:'Patterns to Release', items: swot?.threats, color:'var(--orange)', icon:'◦' },
            ].map((q, i) => (
              <div key={i} style={{...s.swotBox, borderTop:`3px solid ${q.color}`}}>
                <p style={{...s.swotTitle, color: q.color}}>{q.title}</p>
                <ul style={s.list}>
                  {q.items?.map((item, j) => (
                    <li key={j} style={s.listItem}>
                      <span style={{color: q.color, marginRight:'6px'}}>{q.icon}</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardLabel('var(--purple-light)', 'var(--purple)')}>🧭 Alignment Plan</div>

          <div style={s.planLayer}>
            <div style={s.layerBadge('var(--purple)')}>Layer 1 — Directional Clarity</div>
            <p style={s.bodyText}>{alignment_plan?.directional_clarity?.life_direction}</p>
            <div style={s.grid2}>
              <div>
                <p style={s.planLabel}>Energize — Prioritize</p>
                <ul style={s.list}>
                  {alignment_plan?.directional_clarity?.prioritize?.map((item, i) => (
                    <li key={i} style={s.listItem}>
                      <span style={{color:'var(--green)', marginRight:'8px'}}>✦</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={s.planLabel}>Release — Let Go</p>
                <ul style={s.list}>
                  {alignment_plan?.directional_clarity?.eliminate?.map((item, i) => (
                    <li key={i} style={s.listItem}>
                      <span style={{color:'var(--orange)', marginRight:'8px'}}>◦</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div style={s.planLayer}>
            <div style={s.layerBadge('var(--green)')}>Layer 2 — Structured Plan</div>
            <p style={s.planLabel}>30-Day Focus</p>
            <p style={{...s.bodyText, marginBottom:'20px'}}>{alignment_plan?.structured_plan?.thirty_day_focus}</p>
            <div style={s.grid2}>
              <div>
                <p style={s.planLabel}>Weekly Template</p>
                <ul style={s.list}>
                  {alignment_plan?.structured_plan?.weekly_template?.map((item, i) => (
                    <li key={i} style={s.listItem}>
                      <span style={{color:'var(--green)', marginRight:'8px'}}>◦</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={s.planLabel}>Daily Template</p>
                <ul style={s.list}>
                  {alignment_plan?.structured_plan?.daily_template?.map((item, i) => (
                    <li key={i} style={s.listItem}>
                      <span style={{color:'var(--green)', marginRight:'8px'}}>◦</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div style={{...s.planLayer, borderBottom:'none', marginBottom:0, paddingBottom:0}}>
            <div style={s.layerBadge('var(--orange)')}>Layer 3 — Behavioral Anchors</div>
            <div style={s.grid3}>
              <div style={s.anchorBox}>
                <p style={{...s.planLabel, color:'var(--purple)'}}>Keystone Habits</p>
                <ul style={s.list}>
                  {alignment_plan?.behavioral_anchors?.keystone_habits?.map((item, i) => (
                    <li key={i} style={s.listItem}>
                      <span style={{color:'var(--purple)', marginRight:'8px'}}>✦</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={s.anchorBox}>
                <p style={{...s.planLabel, color:'var(--orange)'}}>Compassionate Rules</p>
                <ul style={s.list}>
                  {alignment_plan?.behavioral_anchors?.anti_sabotage_rules?.map((item, i) => (
                    <li key={i} style={s.listItem}>
                      <span style={{color:'var(--orange)', marginRight:'8px'}}>◦</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={s.anchorBox}>
                <p style={{...s.planLabel, color:'var(--green)'}}>Non-Negotiables</p>
                <ul style={s.list}>
                  {alignment_plan?.behavioral_anchors?.non_negotiables?.map((item, i) => (
                    <li key={i} style={s.listItem}>
                      <span style={{color:'var(--green)', marginRight:'8px'}}>✦</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div style={s.ctaBox}>
          <h2 style={s.ctaTitle}>Ready to stay aligned?</h2>
          <p style={s.ctaText}>Daily check-ins, alignment score, and streak tracking — $15/month.</p>
          <a href="/subscribe" style={s.ctaBtn}>Start Accountability System →</a>
        </div>

      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'800px', margin:'0 auto', padding:'40px 24px 80px' },
  center: { textAlign:'center', padding:'80px 20px', fontSize:'18px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'40px', flexWrap:'wrap', gap:'16px' },
  title: { fontSize:'42px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  subtitle: { fontSize:'16px', color:'var(--text-muted)', marginTop:'6px' },
  dlBtn: { padding:'10px 20px', background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'14px', fontWeight:'500', cursor:'pointer', color:'var(--text)' },
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'28px', marginBottom:'20px', boxShadow:'var(--shadow)' },
  cardLabel: (bg, color) => ({ display:'inline-block', padding:'6px 14px', background:bg, color:color, borderRadius:'20px', fontSize:'13px', fontWeight:'600', marginBottom:'16px', letterSpacing:'0.3px' }),
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' },
  grid3: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px' },
  list: { listStyle:'none', padding:0, margin:0 },
  listItem: { fontSize:'14px', lineHeight:'1.6', color:'var(--text)', padding:'7px 0', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'flex-start' },
  bodyText: { fontSize:'15px', lineHeight:'1.75', color:'var(--text)', marginBottom:'8px' },
  swotGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' },
  swotBox: { background:'var(--bg)', borderRadius:'10px', padding:'16px' },
  swotTitle: { fontSize:'13px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px' },
  planLayer: { borderBottom:'1px solid var(--border)', paddingBottom:'24px', marginBottom:'24px' },
  layerBadge: (color) => ({ display:'inline-block', padding:'5px 14px', background: color, color:'#fff', borderRadius:'20px', fontSize:'12px', fontWeight:'600', marginBottom:'16px', letterSpacing:'0.3px' }),
  planLabel: { fontSize:'12px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.5px', color:'var(--text-muted)', marginBottom:'10px', marginTop:'16px' },
  anchorBox: { background:'var(--bg)', borderRadius:'10px', padding:'16px' },
  ctaBox: { background:'linear-gradient(135deg, var(--purple-dark) 0%, var(--purple) 100%)', borderRadius:'var(--radius)', padding:'40px', textAlign:'center', marginTop:'32px' },
  ctaTitle: { fontSize:'28px', fontWeight:'600', color:'#fff', marginBottom:'10px', fontFamily:'Cormorant Garamond, serif' },
  ctaText: { fontSize:'15px', color:'rgba(255,255,255,0.7)', marginBottom:'24px' },
  ctaBtn: { display:'inline-block', padding:'13px 28px', background:'#fff', color:'var(--purple-dark)', borderRadius:'10px', fontSize:'15px', fontWeight:'600' }
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div style={{ textAlign:'center', padding:'80px' }}>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  )
}