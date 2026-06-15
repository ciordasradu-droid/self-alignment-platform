'use client'

// Destinație: app/compatibility/page.js  (FIȘIER NOU — folder nou app/compatibility/)
// Pas 1: alegi tipul (viață / prieten / afaceri)
// Pas 2: datele tale (precompletate din profil dacă există)
// Pas 3: datele celeilalte persoane — FORMAT IDENTIC cu onboarding personal
// Apoi pornește generarea și merge la /compatibility/result

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getUserId } from '../../lib/userId'
import { useLanguage, LANGUAGES } from '../../lib/language'
import { t } from '../../lib/translations'

const TYPES = [
  { key: 'life',     icon: '♥', en: 'Life partner',     ro: 'Partener de viață' },
  { key: 'friend',   icon: '◎', en: 'Friend',            ro: 'Prieten' },
  { key: 'business', icon: '▲', en: 'Business partner',  ro: 'Partener de afaceri' },
]

const L = {
  en: { tag:'Compatibility', step_type:'What relationship do you want to understand?', step_type_sub:'Each type looks at something different between the two of you.',
        you:'You', them:'The other person', your_data:'Your details', your_data_sub:'From your profile — just confirm.',
        their_data:'Their details', their_data_sub:'Name, date, time and place of birth.',
        name:'Full name', date:'Date of birth', time:'Time of birth', city:'City of birth',
        city_ph:'Start typing the city...', generate:'See the relationship profile', next:'Continue', back:'← Back' },
  ro: { tag:'Compatibilitate', step_type:'Ce relație vrei să înțelegi?', step_type_sub:'Fiecare tip privește altceva între voi doi.',
        you:'Tu', them:'Cealaltă persoană', your_data:'Datele tale', your_data_sub:'Din profilul tău — doar confirmă.',
        their_data:'Datele celuilalt', their_data_sub:'Nume, dată, oră și loc al nașterii.',
        name:'Nume complet', date:'Data nașterii', time:'Ora nașterii', city:'Orașul nașterii',
        city_ph:'Începe să scrii orașul...', generate:'Vezi profilul relației', next:'Continui', back:'← Înapoi' },
}
function lx(lang, k){ return (L[lang]||L.en)[k] }

function PersonForm({ lang, value, onChange }) {
  const [day, setDay] = useState(value.day || '')
  const [month, setMonth] = useState(value.month || '')
  const [year, setYear] = useState(value.year || '')
  const [cityValue, setCityValue] = useState(value.city || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug] = useState(false)
  const debounceRef = useRef(null)
  const months = t(lang, 'months')

  useEffect(() => {
    if (day && month && year && year.length === 4) {
      const dob = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`
      onChange({ ...value, day, month, year, date_of_birth: dob })
    }
  }, [day, month, year])

  const handleCity = (e) => {
    const v = e.target.value
    setCityValue(v)
    onChange({ ...value, city: '', lat: '', lng: '' })
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (v.length < 2) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(v)}&format=json&limit=5&featuretype=city`, { headers: { 'Accept-Language': 'en' } })
        setSuggestions(await res.json()); setShowSug(true)
      } catch (e) {}
    }, 400)
  }
  const pickCity = (p) => {
    setCityValue(p.display_name)
    onChange({ ...value, city: p.display_name, lat: p.lat, lng: p.lon })
    setSuggestions([]); setShowSug(false)
  }

  return (
    <>
      <div style={s.field}>
        <label style={s.label}>{lx(lang,'name')}</label>
        <input className="input-clean" value={value.full_name || ''} onChange={e => onChange({ ...value, full_name: e.target.value })} placeholder={lx(lang,'name')} />
      </div>
      <div style={s.field}>
        <label style={s.label}>{lx(lang,'date')}</label>
        <div style={{ display:'flex', gap:'10px' }}>
          <input className="input-clean" type="number" placeholder="DD" value={day} onChange={e=>setDay(e.target.value)} min="1" max="31" style={{ flex:1, minWidth:'56px', textAlign:'center' }} />
          <select className="input-clean select-clean" value={month} onChange={e=>setMonth(e.target.value)} style={{ flex:2 }}>
            <option value="">—</option>
            {months.map((m,i)=>(<option key={i} value={String(i+1)}>{m}</option>))}
          </select>
          <input className="input-clean" type="number" placeholder="YYYY" value={year} onChange={e=>setYear(e.target.value)} min="1900" max="2025" style={{ flex:1, minWidth:'70px', textAlign:'center' }} />
        </div>
      </div>
      <div style={s.field}>
        <label style={s.label}>{lx(lang,'time')}</label>
        <input className="input-clean" type="time" value={value.time_of_birth || ''} onChange={e => onChange({ ...value, time_of_birth: e.target.value })} />
      </div>
      <div style={{ ...s.field, position:'relative' }}>
        <label style={s.label}>{lx(lang,'city')}</label>
        <input className="input-clean" value={cityValue} onChange={handleCity} onBlur={()=>setTimeout(()=>setShowSug(false),200)} placeholder={lx(lang,'city_ph')} autoComplete="off" />
        {showSug && suggestions.length > 0 && (
          <div style={s.sug}>
            {suggestions.map((p,i)=>(
              <div key={i} onMouseDown={()=>pickCity(p)} style={s.sugItem} className="city-suggestion">
                <span style={{ color:'var(--purple)', marginRight:'8px' }}>◦</span>{p.display_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function CompatibilityPage() {
  const router = useRouter()
  const [lang] = useLanguage()
  const [step, setStep] = useState('type')
  const [type, setType] = useState(null)
  const [personA, setPersonA] = useState({})
  const [personB, setPersonB] = useState({})
  const [loading, setLoading] = useState(false)

  // precompletează A din profilul existent
  useEffect(() => {
    const stored = localStorage.getItem('profile')
    if (stored) {
      try {
        const p = JSON.parse(stored)
        if (p.full_name) setPersonA(prev => ({ ...prev, full_name: p.full_name, prefilled: true }))
      } catch (e) {}
    }
  }, [])

  const chooseType = (k) => { setType(k); setStep('me') }

  const aReady = personA.full_name && personA.date_of_birth && personA.time_of_birth && personA.city
  const bReady = personB.full_name && personB.date_of_birth && personB.time_of_birth && personB.city

  const handleGenerate = async () => {
    if (!aReady || !bReady) return
    setLoading(true)
    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: getUserId(), type, language: lang,
          personA: { full_name: personA.full_name, date_of_birth: personA.date_of_birth, time_of_birth: personA.time_of_birth, lat: personA.lat, lng: personA.lng },
          personB: { full_name: personB.full_name, date_of_birth: personB.date_of_birth, time_of_birth: personB.time_of_birth, lat: personB.lat, lng: personB.lng },
        })
      })
      const data = await res.json()
      if (data.success) router.push(`/compatibility/result?id=${data.compatibility_id}`)
      else { setLoading(false); alert(data.error || 'error') }
    } catch (e) { setLoading(false); alert('error') }
  }

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>
        <div style={s.header}>
          <a href="/dashboard" style={s.back}>{lx(lang,'back')}</a>
          <span className="tag tag-purple">{lx(lang,'tag')}</span>
        </div>

        {step === 'type' && (
          <div className="anim-fade-in">
            <h1 style={s.title}>{lx(lang,'step_type')}</h1>
            <p style={s.sub}>{lx(lang,'step_type_sub')}</p>
            <div style={{ marginTop:'28px' }}>
              {TYPES.map(tp => (
                <button key={tp.key} onClick={()=>chooseType(tp.key)} style={s.typeBtn} className="landing-card">
                  <span style={s.typeIcon}>{tp.icon}</span>
                  <span style={s.typeLabel}>{tp[lang] || tp.en}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'me' && (
          <div className="anim-fade-in">
            <span className="tag tag-purple" style={{ marginBottom:'14px', display:'inline-block' }}>{lx(lang,'you')}</span>
            <h1 style={s.title}>{lx(lang,'your_data')}</h1>
            <p style={s.sub}>{lx(lang,'your_data_sub')}</p>
            <div style={{ marginTop:'24px' }}>
              <PersonForm lang={lang} value={personA} onChange={setPersonA} />
            </div>
            <button onClick={()=>setStep('them')} disabled={!aReady} style={{ ...s.cta, opacity: aReady?1:0.4, cursor: aReady?'pointer':'not-allowed' }}>{lx(lang,'next')}</button>
          </div>
        )}

        {step === 'them' && (
          <div className="anim-fade-in">
            <span className="tag tag-green" style={{ marginBottom:'14px', display:'inline-block' }}>{lx(lang,'them')}</span>
            <h1 style={s.title}>{lx(lang,'their_data')}</h1>
            <p style={s.sub}>{lx(lang,'their_data_sub')}</p>
            <div style={{ marginTop:'24px' }}>
              <PersonForm lang={lang} value={personB} onChange={setPersonB} />
            </div>
            <button onClick={handleGenerate} disabled={!bReady || loading} style={{ ...s.cta, opacity: (bReady&&!loading)?1:0.4, cursor: (bReady&&!loading)?'pointer':'not-allowed' }}>
              {loading ? '...' : lx(lang,'generate')}
            </button>
          </div>
        )}
      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'600px', margin:'0 auto', padding:'40px 24px 80px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' },
  back: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500' },
  title: { fontSize:'clamp(26px,6vw,36px)', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1.2 },
  sub: { fontSize:'15px', color:'var(--text-muted)', lineHeight:'1.6', marginTop:'8px' },
  typeBtn: { display:'flex', alignItems:'center', gap:'16px', width:'100%', textAlign:'left', padding:'20px', marginBottom:'14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', cursor:'pointer', boxShadow:'var(--shadow)' },
  typeIcon: { fontSize:'24px', color:'var(--purple)', width:'32px', textAlign:'center' },
  typeLabel: { fontSize:'17px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  field: { marginBottom:'20px' },
  label: { display:'block', fontSize:'13px', fontWeight:'600', color:'var(--text)', marginBottom:'8px' },
  sug: { position:'absolute', top:'100%', left:0, right:0, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:'12px', boxShadow:'var(--shadow-lg)', zIndex:100, maxHeight:'240px', overflowY:'auto', marginTop:'4px' },
  sugItem: { padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid var(--border)', fontSize:'13px', color:'var(--text)', display:'flex', alignItems:'flex-start' },
  cta: { width:'100%', padding:'16px', marginTop:'28px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'16px', fontWeight:'600', boxShadow:'0 4px 20px rgba(124,92,191,0.3)' },
}