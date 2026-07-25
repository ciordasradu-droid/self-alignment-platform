'use client'
import { t } from '../../lib/translations'
import Chapter from '../components/Chapter'

// ============================================================
//  V4 PROFILE SECTIONS
//  Defensive: every block renders ONLY if its data exists.
//  If a profile is v3 (no archetype), this whole component
//  renders nothing and the page falls back to legacy display.
// ============================================================

export function isV4(sections) {
  return !!(sections && sections.archetype)
}

export default function V4Sections({ sections, lang, s, storageKey = 'anon' }) {
  if (!isV4(sections)) return null

  const a = sections.archetype
  const work = sections.how_you_work
  const tension = (sections.central_tension && typeof sections.central_tension === 'object' && sections.central_tension.tension)
    ? sections.central_tension
    : null
  const energy = sections.energy_manual
  const watchFor = Array.isArray(sections.energy_manual?.watch_for)
    ? sections.energy_manual.watch_for.filter(Boolean)
    : []
  const decision = Array.isArray(sections.decision_system) ? sections.decision_system : []

  return (
    <>
      {/* ARCHETYPE */}
      {a && (a.name || a.description) && (
        <div style={v.archetypeCard}>
          <div style={v.archetypeGlow} aria-hidden="true" />
          <div style={v.archetypeLabel}>{t(lang, 'archetype_label')}</div>
          {a.name && <h2 style={v.archetypeName}>{a.name}</h2>}
          {a.description && <p style={v.archetypeDesc}>{a.description}</p>}
        </div>
      )}

      {/* 1. CUM FUNCȚIONEZI — 3 layers */}
      {work && (work.surface || work.engine || work.core) && (
        <Chapter id="how-you-work" title={t(lang, 'how_you_work')} storageKey={storageKey}>
          <div style={v.layerStack}>
            {work.surface && (
              <div style={v.workLayer}>
                <div style={v.workLayerHead}>
                  <span style={v.workDot('var(--green)')} />
                  <span style={v.workLayerTitle}>{t(lang, 'layer_surface')}</span>
                </div>
                <p style={s.bodyText}>{work.surface}</p>
              </div>
            )}
            {work.engine && (
              <div style={v.workLayer}>
                <div style={v.workLayerHead}>
                  <span style={v.workDot('var(--purple)')} />
                  <span style={v.workLayerTitle}>{t(lang, 'layer_engine')}</span>
                </div>
                <p style={s.bodyText}>{work.engine}</p>
              </div>
            )}
            {work.core && (
              <div style={v.workLayer}>
                <div style={v.workLayerHead}>
                  <span style={v.workDot('var(--orange)')} />
                  <span style={v.workLayerTitle}>{t(lang, 'layer_core')}</span>
                </div>
                <p style={s.bodyText}>{work.core}</p>
              </div>
            )}
          </div>
        </Chapter>
      )}

      {/* 2. PUNCTELE TALE FORTE */}
      {Array.isArray(sections.strengths) && sections.strengths.length > 0 && (
        <Chapter id="strengths" title={t(lang, 'strengths')} storageKey={storageKey}>
          <ul style={s.list}>
            {sections.strengths.map((item, i) => (
              <li key={i} style={s.listItem}><span style={{color:'var(--green)', marginRight:'8px'}}>◦</span>{item}</li>
            ))}
          </ul>
        </Chapter>
      )}

      {/* 3. SISTEMUL TĂU DE DECIZIE — de protejat, cel mai bun text din profil */}
      {decision.length > 0 && (
        <Chapter id="decision-system" title={t(lang, 'decision_system')} storageKey={storageKey}>
          <div style={v.decisionStack}>
            {decision.map((item, i) => (
              <p key={i} style={{...s.bodyText, paddingBottom:'14px', marginBottom:'14px', borderBottom: i < decision.length-1 ? '1px solid var(--border)' : 'none'}}>{item}</p>
            ))}
          </div>
        </Chapter>
      )}

      {/* 4. MANUALUL ENERGIEI — absoarbe fostele Semnale de Alarmă, ca watch_for */}
      {energy && (energy.peak || energy.drain || energy.rhythm || energy.current_year || watchFor.length > 0) && (
        <Chapter id="energy-manual" title={t(lang, 'energy_manual')} storageKey={storageKey}>
          <div style={s.grid2}>
            {energy.peak && (
              <div style={v.energyBox('var(--green)')}>
                <p style={v.energyLabel('var(--green)')}>{t(lang, 'energy_peak')}</p>
                <p style={s.bodyText}>{energy.peak}</p>
              </div>
            )}
            {energy.drain && (
              <div style={v.energyBox('var(--orange)')}>
                <p style={v.energyLabel('var(--orange)')}>{t(lang, 'energy_drain')}</p>
                <p style={s.bodyText}>{energy.drain}</p>
              </div>
            )}
            {energy.rhythm && (
              <div style={v.energyBox('var(--purple)')}>
                <p style={v.energyLabel('var(--purple)')}>{t(lang, 'energy_rhythm')}</p>
                <p style={s.bodyText}>{energy.rhythm}</p>
              </div>
            )}
            {energy.current_year && (
              <div style={v.energyBox('var(--orange)')}>
                <p style={v.energyLabel('var(--orange)')}>{t(lang, 'energy_year')}</p>
                <p style={s.bodyText}>{energy.current_year}</p>
              </div>
            )}
          </div>
          {watchFor.length > 0 && (
            <div style={v.watchForBox}>
              <p style={v.energyLabel('var(--text-light)')}>{t(lang, 'energy_watch_for')}</p>
              {watchFor.map((wf, i) => (
                <p key={i} style={{...s.bodyText, marginBottom: i < watchFor.length - 1 ? '8px' : 0}}>{wf}</p>
              ))}
            </div>
          )}
        </Chapter>
      )}

      {/* 5. TENSIUNEA CU CARE TRĂIEȘTI — UNA singură, polii numiți, fără litere */}
      {tension && (
        <Chapter id="central-tension" title={t(lang, 'central_tension')} storageKey={storageKey}>
          <div style={v.frictionItem}>
            {tension.tension && <p style={v.frictionTension}>{tension.tension}</p>}
            <div style={v.pullRow}>
              {tension.pull_a && (
                <div style={v.pullBox('var(--purple)')}>
                  <p style={v.pullText}>{tension.pull_a}</p>
                </div>
              )}
              {tension.pull_b && (
                <div style={v.pullBox('var(--orange)')}>
                  <p style={v.pullText}>{tension.pull_b}</p>
                </div>
              )}
            </div>
            {tension.daily_experience && (
              <p style={v.frictionMeta}><strong style={v.metaLabel}>{t(lang, 'friction_daily')}:</strong> {tension.daily_experience}</p>
            )}
            {tension.resolution && (
              <p style={v.frictionMeta}><strong style={v.metaLabel}>{t(lang, 'friction_resolution')}:</strong> {tension.resolution}</p>
            )}
          </div>
        </Chapter>
      )}

      {/* 6. VIAȚA ÎN ALINIERE — capitolul de închidere */}
      {sections.aligned_life && (
        <Chapter id="aligned-life" title={t(lang, 'aligned_life')} storageKey={storageKey}>
          <p style={s.bodyText}>{sections.aligned_life}</p>
        </Chapter>
      )}
    </>
  )
}

// ---- v4-specific styles (named `v` to avoid clashing with page `s`) ----
const v = {
  archetypeCard: { position:'relative', overflow:'hidden', background:'var(--surface)', backdropFilter:'blur(16px) saturate(120%)', borderRadius:'var(--radius)', padding:'40px 32px', marginBottom:'24px', textAlign:'center', border:'1px solid var(--border)' },
  archetypeGlow: { position:'absolute', top:'-40%', left:'50%', transform:'translateX(-50%)', width:'320px', height:'320px', background:'radial-gradient(circle, rgba(229,169,60,0.22) 0%, transparent 70%)', pointerEvents:'none' },
  archetypeLabel: { position:'relative', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--text-light)', marginBottom:'14px' },
  archetypeName: { position:'relative', fontSize:'clamp(28px, 6vw, 44px)', fontWeight:'700', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1.1, marginBottom:'16px' },
  archetypeDesc: { position:'relative', fontSize:'16px', lineHeight:'1.8', color:'var(--text-muted)', maxWidth:'640px', margin:'0 auto' },

  layerStack: { display:'flex', flexDirection:'column', gap:'18px' },
  workLayer: { paddingLeft:'18px', borderLeft:'2px solid var(--border)' },
  workLayerHead: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' },
  workDot: (c) => ({ width:'9px', height:'9px', borderRadius:'50%', background:c, display:'inline-block' }),
  workLayerTitle: { fontSize:'12px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.5px', color:'var(--text-muted)' },

  frictionStack: { display:'flex', flexDirection:'column', gap:'24px' },
  frictionItem: { paddingBottom:'24px', borderBottom:'1px solid var(--border)' },
  frictionTension: { fontSize:'17px', fontWeight:'600', color:'var(--text)', marginBottom:'14px', fontFamily:'Cormorant Garamond, serif' },
  pullRow: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap:'12px', marginBottom:'14px' },
  pullBox: (c) => ({ position:'relative', background:'var(--surface2)', backdropFilter:'blur(10px)', borderRadius:'10px', padding:'14px 14px 14px 16px', borderLeft:`3px solid ${c}` }),
  pullTag: (c) => ({ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'20px', height:'20px', borderRadius:'50%', background:c, color:'#fff', fontSize:'11px', fontWeight:'700', marginBottom:'8px' }),
  pullText: { fontSize:'14px', lineHeight:'1.6', color:'var(--text)' },
  frictionMeta: { fontSize:'13.5px', lineHeight:'1.65', color:'var(--text-muted)', marginTop:'8px' },
  metaLabel: { color:'var(--text)', fontWeight:'600' },

  decisionStack: { display:'flex', flexDirection:'column' },

  energyBox: (c) => ({ background:'var(--surface2)', backdropFilter:'blur(10px)', borderRadius:'10px', padding:'18px', borderTop:`3px solid ${c}` }),
  energyLabel: (c) => ({ fontSize:'12px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.5px', color:c, marginBottom:'10px' }),
  watchForBox: { marginTop:'16px', paddingTop:'16px', borderTop:'1px solid var(--border)' },
}