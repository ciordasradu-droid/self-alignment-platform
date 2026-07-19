'use client'

// Destinație: app/compatibility/CompatibilitySections.js  (FIȘIER NOU)
// Randează profilul relației. Fiecare bloc apare doar dacă datele există,
// deci aceeași componentă servește toate 3 tipurile (viață/prieten/afaceri).

const HEAD = {
  en: {
    pair_with:'with', archetype:'Together you are',
    ce_va_apropie:'What draws you together', unde_va_completati:'Where you complete each other',
    frecare:'Where friction shows up', felt:'How it feels', source:'Where it comes from', hold:'Holding both',
    needs:'What you need from each other', bridge:'The bridge',
    intimacy:'Closeness and space', decisions:'How you decide together',
    friendship_kind:'What kind of friendship', charge:'How you charge each other', connected:'Staying connected',
    roles:'How you split roles', trap:'The trap', risk:'Risk and money', blocks:'What blocks you',
    patterns:'Patterns to watch', sign:'Sign', underneath:'Underneath', return:'Coming back',
  },
  ro: {
    pair_with:'cu', archetype:'Împreună sunteți',
    ce_va_apropie:'Ce vă apropie', unde_va_completati:'Unde vă completați',
    frecare:'Unde apare frecarea', felt:'Cum se simte', source:'De unde vine', hold:'Cum țineți ambele',
    needs:'De ce aveți nevoie unul de la altul', bridge:'Puntea',
    intimacy:'Intimitate și spațiu', decisions:'Cum decideți împreună',
    friendship_kind:'Ce fel de prietenie', charge:'Cum vă încărcați', connected:'Cum rămâneți conectați',
    roles:'Cum împărțiți rolurile', trap:'Capcana', risk:'Risc și bani', blocks:'Ce vă blochează',
    patterns:'Tipare de urmărit', sign:'Semn', underneath:'Ce se întâmplă', return:'Întoarcerea',
  },
}
function h(lang,k){ return (HEAD[lang]||HEAD.en)[k] }

function Card({ label, children, color='var(--purple)' }) {
  return (
    <div style={{ ...st.card, borderLeft:`4px solid ${color}` }}>
      <div style={st.label}>{label}</div>
      {children}
    </div>
  )
}

function Frictions({ items, lang }) {
  if (!Array.isArray(items)) return null
  const real = items.filter(f => f && typeof f === 'object' && f.tensiune)
  if (!real.length) return null
  return (
    <Card label={h(lang,'frecare')} color="var(--orange)">
      <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
        {real.map((f,i)=>(
          <div key={i} style={{ paddingBottom:'18px', borderBottom: i<real.length-1?'1px solid var(--border)':'none' }}>
            <p style={st.fricTitle}>{f.tensiune}</p>
            {f.cum_se_simte && <p style={st.meta}><strong style={st.metaLab}>{h(lang,'felt')}:</strong> {f.cum_se_simte}</p>}
            {f.de_unde_vine && <p style={st.meta}><strong style={st.metaLab}>{h(lang,'source')}:</strong> {f.de_unde_vine}</p>}
            {f.cum_tineti_ambele && <p style={st.meta}><strong style={st.metaLab}>{h(lang,'hold')}:</strong> {f.cum_tineti_ambele}</p>}
          </div>
        ))}
      </div>
    </Card>
  )
}

function Patterns({ items, lang }) {
  if (!Array.isArray(items)) return null
  const real = items.filter(p => p && typeof p === 'object' && p.semn)
  if (!real.length) return null
  return (
    <Card label={h(lang,'patterns')} color="var(--orange)">
      <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
        {real.map((p,i)=>(
          <div key={i} style={st.signItem}>
            <p style={st.signFeel}>{p.semn}</p>
            {p.ce_se_intampla && <p style={st.signSub}>{p.ce_se_intampla}</p>}
            {p.intoarcerea && <p style={st.signExit}>→ {p.intoarcerea}</p>}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function CompatibilitySections({ profile, lang }) {
  const x = profile.sections || {}
  const a = x.archetype

  return (
    <>
      <div style={st.pairHead}>
        <span style={st.pairName}>{profile.name_a}</span>
        <span style={st.pairAmp}>&amp;</span>
        <span style={st.pairName}>{profile.name_b}</span>
      </div>

      {a && (a.name || a.description) && (
        <div style={st.archetypeCard}>
          <div style={st.archetypeLabel}>{h(lang,'archetype')}</div>
          {a.name && <h2 style={st.archetypeName}>{a.name}</h2>}
          {a.description && <p style={st.archetypeDesc}>{a.description}</p>}
        </div>
      )}

      {x.ce_va_apropie && <Card label={h(lang,'ce_va_apropie')} color="var(--green)"><p style={st.body}>{x.ce_va_apropie}</p></Card>}
      {x.unde_va_completati && <Card label={h(lang,'unde_va_completati')} color="var(--green)"><p style={st.body}>{x.unde_va_completati}</p></Card>}

      {/* prieten */}
      {x.ce_fel_de_prietenie && <Card label={h(lang,'friendship_kind')}><p style={st.body}>{x.ce_fel_de_prietenie}</p></Card>}
      {x.cum_va_incarcati && <Card label={h(lang,'charge')}><p style={st.body}>{x.cum_va_incarcati}</p></Card>}

      <Frictions items={x.unde_apare_frecarea} lang={lang} />

      {/* viață — nevoi reciproce */}
      {x.de_ce_aveti_nevoie_unul_de_la_altul && (
        <Card label={h(lang,'needs')}>
          {Object.entries(x.de_ce_aveti_nevoie_unul_de_la_altul).map(([k,v]) => {
            if (k === 'puntea') return null
            return (<div key={k} style={{ marginBottom:'14px' }}><p style={st.subName}>{k}</p><p style={st.body}>{v}</p></div>)
          })}
          {x.de_ce_aveti_nevoie_unul_de_la_altul.puntea && (
            <p style={{ ...st.body, fontStyle:'italic', marginTop:'6px' }}>{x.de_ce_aveti_nevoie_unul_de_la_altul.puntea}</p>
          )}
        </Card>
      )}

      {x.intimitate_si_spatiu && <Card label={h(lang,'intimacy')}><p style={st.body}>{x.intimitate_si_spatiu}</p></Card>}

      {/* afaceri — roluri */}
      {x.cum_impartiti_rolurile && (
        <Card label={h(lang,'roles')}>
          {Object.entries(x.cum_impartiti_rolurile).map(([k,v]) => {
            if (k === 'capcana') return null
            return (<div key={k} style={{ marginBottom:'14px' }}><p style={st.subName}>{k}</p><p style={st.body}>{v}</p></div>)
          })}
          {x.cum_impartiti_rolurile.capcana && (
            <p style={{ ...st.body, fontStyle:'italic', marginTop:'6px' }}>{x.cum_impartiti_rolurile.capcana}</p>
          )}
        </Card>
      )}

      {x.cum_decideti_impreuna && <Card label={h(lang,'decisions')}><p style={st.body}>{x.cum_decideti_impreuna}</p></Card>}
      {x.risc_si_bani && <Card label={h(lang,'risk')}><p style={st.body}>{x.risc_si_bani}</p></Card>}
      {x.ce_va_blocheaza && <Card label={h(lang,'blocks')} color="var(--orange)"><p style={st.body}>{x.ce_va_blocheaza}</p></Card>}
      {x.cum_ramaneti_conectati && <Card label={h(lang,'connected')} color="var(--green)"><p style={st.body}>{x.cum_ramaneti_conectati}</p></Card>}

      <Patterns items={x.tipare_de_urmarit} lang={lang} />
    </>
  )
}

const st = {
  pairHead: { textAlign:'center', marginBottom:'24px', display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', flexWrap:'wrap' },
  pairName: { fontSize:'clamp(22px,5vw,30px)', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  pairAmp: { fontSize:'20px', color:'var(--purple)' },
  archetypeCard: { position:'relative', overflow:'hidden', background:'var(--surface)', backdropFilter:'blur(16px) saturate(120%)', borderRadius:'var(--radius)', padding:'36px 28px', marginBottom:'20px', textAlign:'center', border:'1px solid var(--border)' },
  archetypeLabel: { fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--text-light)', marginBottom:'12px' },
  archetypeName: { fontSize:'clamp(26px,6vw,40px)', fontWeight:'700', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1.1, marginBottom:'14px' },
  archetypeDesc: { fontSize:'16px', lineHeight:'1.8', color:'var(--text-muted)', maxWidth:'620px', margin:'0 auto' },
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'28px', marginBottom:'20px', boxShadow:'var(--shadow)' },
  label: { display:'inline-block', padding:'6px 14px', background:'var(--purple-light)', color:'var(--purple)', borderRadius:'20px', fontSize:'13px', fontWeight:'600', marginBottom:'16px', letterSpacing:'0.3px' },
  body: { fontSize:'15px', lineHeight:'1.75', color:'var(--text)' },
  subName: { fontSize:'13px', fontWeight:'700', color:'var(--purple)', marginBottom:'4px', textTransform:'capitalize' },
  fricTitle: { fontSize:'17px', fontWeight:'600', color:'var(--text)', marginBottom:'10px', fontFamily:'Cormorant Garamond, serif' },
  meta: { fontSize:'14px', lineHeight:'1.65', color:'var(--text-muted)', marginTop:'6px' },
  metaLab: { color:'var(--text)', fontWeight:'600' },
  signItem: { background:'var(--bg)', borderRadius:'10px', padding:'16px' },
  signFeel: { fontSize:'15px', fontWeight:'600', color:'var(--text)', marginBottom:'6px' },
  signSub: { fontSize:'14px', lineHeight:'1.6', color:'var(--text-muted)', marginBottom:'8px' },
  signExit: { fontSize:'14px', fontWeight:'600', color:'var(--green)', lineHeight:'1.6' },
}