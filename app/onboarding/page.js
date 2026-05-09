'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { t, UI } from '../../lib/translations'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ro', label: 'Română' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'hu', label: 'Magyar' },
]

const READY_NOTE = {
  en: 'Your profile will be ready in 2-3 minutes',
  ro: 'Profilul tău va fi generat în 2-3 minute',
  es: 'Tu perfil estará listo en 2-3 minutos',
  fr: 'Ton profil sera prêt en 2-3 minutes',
  de: 'Dein Profil ist in 2-3 Minuten fertig',
  it: 'Il tuo profilo sarà pronto in 2-3 minuti',
  pt: 'O teu perfil estará pronto em 2-3 minutos',
  nl: 'Je profiel is klaar in 2-3 minuten',
  pl: 'Twój profil będzie gotowy za 2-3 minuty',
  hu: 'A profilod 2-3 perc alatt elkészül',
}

function CosmicStars() {
  return (
    <div className="cosmic-stars" aria-hidden="true">
      {Array.from({ length: 25 }).map((_, i) => <span key={i} />)}
    </div>
  )
}

export default function Onboarding() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('en')
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    time_of_birth: '',
    city: '',
    lat: '',
    lng: '',
    language: 'en'
  })

  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [cityValue, setCityValue] = useState('')
  const [citySuggestions, setCitySuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (day && month && year && year.length === 4) {
      const paddedMonth = month.padStart(2, '0')
      const paddedDay = day.padStart(2, '0')
      setFormData(prev => ({ ...prev, date_of_birth: `${year}-${paddedMonth}-${paddedDay}` }))
    }
  }, [day, month, year])

  const handleLanguageChange = (code) => {
    setLang(code)
    setFormData(prev => ({ ...prev, language: code }))
    setMonth('')
  }

  const handleCityInput = (e) => {
    const value = e.target.value
    setCityValue(value)
    setFormData(prev => ({ ...prev, city: '', lat: '', lng: '' }))
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 2) { setCitySuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&featuretype=city`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setCitySuggestions(data)
        setShowSuggestions(true)
      } catch (err) {
        console.error('City search error:', err)
      }
    }, 400)
  }

  const handleCitySelect = (place) => {
    const cityName = place.display_name
    setCityValue(cityName)
    setFormData(prev => ({ ...prev, city: cityName, lat: place.lat, lng: place.lon }))
    setCitySuggestions([])
    setShowSuggestions(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!day || !month || !year || year.length !== 4) {
      alert(t(lang, 'date_error'))
      return
    }
    if (!formData.time_of_birth) {
      alert(t(lang, 'time_error'))
      return
    }
    if (!formData.city) {
      alert(t(lang, 'city_error'))
      return
    }
    setLoading(true)
    const encoded = encodeURIComponent(JSON.stringify(formData))
    router.push(`/generating?data=${encoded}`)
  }

  const months = t(lang, 'months')
  const readyNote = READY_NOTE[lang] || READY_NOTE.en

  return (
    <>
      <div className="cosmic-bg" />
      <CosmicStars />
      <main style={s.wrap}>

        <div style={s.header}>
          <a href="/" style={s.back} className="btn-lift">{t(lang, 'back')}</a>
          <span className="tag tag-purple">Free Profile</span>
        </div>

        <div className="onboarding-premium-card anim-fade-in">
          <div className="onboarding-card-header">
            <h1 className="onboarding-title-huge">{t(lang, 'onboarding_title')}</h1>
            <p style={s.subtitle}>{t(lang, 'onboarding_subtitle')}</p>
            <div style={s.tags}>
              <span className="tag tag-purple">Astrology</span>
              <span className="tag tag-green">Human Design</span>
              <span className="tag tag-orange">Numerology</span>
            </div>
          </div>

          <div className="onboarding-form-body">

            <div style={s.field}>
              <label className="onboarding-label">{t(lang, 'profile_language')}</label>
              <select
                value={lang}
                onChange={e => handleLanguageChange(e.target.value)}
                className="input-clean select-clean"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <p style={s.hint}>{t(lang, 'language_hint')}</p>
            </div>

            <div style={s.field}>
              <label className="onboarding-label">{t(lang, 'full_name')}</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder={t(lang, 'full_name_placeholder')}
                className="input-clean"
              />
            </div>

            <div style={s.field}>
              <label className="onboarding-label">{t(lang, 'date_of_birth')}</label>
              <div style={s.dateRow}>
                <div style={{flex:1, minWidth:'56px'}}>
                  <input
                    type="number"
                    placeholder="DD"
                    value={day}
                    onChange={e => setDay(e.target.value)}
                    min="1" max="31"
                    className="input-clean"
                    style={{ textAlign:'center' }}
                  />
                </div>
                <div style={{flex:2}}>
                  <select
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="input-clean select-clean"
                  >
                    <option value="">—</option>
                    {months.map((m, i) => (
                      <option key={i} value={String(i + 1)}>{m}</option>
                    ))}
                  </select>
                </div>
                <div style={{flex:1, minWidth:'70px'}}>
                  <input
                    type="number"
                    placeholder="YYYY"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    min="1900" max="2010"
                    className="input-clean"
                    style={{ textAlign:'center' }}
                  />
                </div>
              </div>
            </div>

            <div style={s.field}>
              <label className="onboarding-label">{t(lang, 'time_of_birth')}</label>
              <input
                type="time"
                value={formData.time_of_birth}
                onChange={e => setFormData(prev => ({ ...prev, time_of_birth: e.target.value }))}
                className="input-clean"
              />
              <p style={s.hint}>{t(lang, 'time_hint')}</p>
            </div>

            <div style={{...s.field, position:'relative'}}>
              <label className="onboarding-label">{t(lang, 'city_of_birth')}</label>
              <input
                type="text"
                value={cityValue}
                onChange={handleCityInput}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={t(lang, 'city_placeholder')}
                className="input-clean"
                autoComplete="off"
              />
              <p style={s.hint}>{t(lang, 'city_hint')}</p>
              {showSuggestions && citySuggestions.length > 0 && (
                <div style={s.suggestions} className="anim-fade-in">
                  {citySuggestions.map((place, i) => (
                    <div key={i} onMouseDown={() => handleCitySelect(place)} style={s.suggestion} className="city-suggestion">
                      <span style={s.suggestionIcon}>◦</span>
                      <span style={s.suggestionText}>{place.display_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={s.freeNote}>
              <span style={s.freeIcon}>✦</span>
              <span style={s.freeLabel}>{t(lang, 'free_note')}</span>
            </div>

            <div style={s.submitWrap}>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`cta-premium cta-premium-large${loading ? '' : ''}`}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: loading ? '#bbb' : undefined,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  animation: loading ? 'none' : undefined,
                  opacity: loading ? 0.85 : 1
                }}
              >
                {loading ? t(lang, 'generating_btn') : t(lang, 'generate_btn')}
                {!loading && <span className="arrow" aria-hidden="true">→</span>}
              </button>

              <p className="onboarding-note">
                <span className="onboarding-note-star">✦</span>
                <span>{readyNote}</span>
              </p>
            </div>

            <p style={s.disclaimer}>{t(lang, 'disclaimer')}</p>

          </div>
        </div>
      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'600px', margin:'0 auto', padding:'40px 20px 80px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' },
  back: { display:'inline-flex', fontSize:'14px', color:'var(--text-muted)', fontWeight:'500', padding:'8px 14px', borderRadius:'8px', minHeight:'40px', alignItems:'center' },
  subtitle: { fontSize:'15px', color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'18px' },
  tags: { display:'flex', gap:'8px', flexWrap:'wrap' },
  field: { marginBottom:'22px' },
  dateRow: { display:'flex', gap:'10px', alignItems:'center' },
  hint: { fontSize:'12px', color:'var(--text-light)', marginTop:'8px' },
  suggestions: { position:'absolute', top:'100%', left:0, right:0, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:'12px', boxShadow:'var(--shadow-lg)', zIndex:100, maxHeight:'240px', overflowY:'auto', marginTop:'4px' },
  suggestion: { display:'flex', alignItems:'flex-start', gap:'10px', padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid var(--border)' },
  suggestionIcon: { color:'var(--purple)', flexShrink:0, marginTop:'2px' },
  suggestionText: { fontSize:'13px', color:'var(--text)', lineHeight:'1.5' },
  freeNote: { display:'flex', alignItems:'center', gap:'10px', padding:'14px 18px', background:'linear-gradient(135deg, var(--purple-light) 0%, var(--green-light) 100%)', borderRadius:'12px', marginBottom:'24px', border:'1px solid rgba(124, 92, 191, 0.15)' },
  freeIcon: { fontSize:'20px', color:'var(--purple)' },
  freeLabel: { fontSize:'14px', color:'var(--purple)', fontWeight:'500' },
  submitWrap: { textAlign:'center', marginTop:'28px' },
  disclaimer: { textAlign:'center', fontSize:'12px', color:'var(--text-light)', marginTop:'20px', lineHeight:'1.5' }
}
