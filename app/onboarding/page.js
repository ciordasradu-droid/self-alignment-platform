'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    time_of_birth: '',
    city: '',
    lat: '',
    lng: ''
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

  const handleCityInput = (e) => {
    const value = e.target.value
    setCityValue(value)
    setFormData(prev => ({ ...prev, city: '', lat: '', lng: '' }))

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.length < 2) {
      setCitySuggestions([])
      return
    }

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
    setFormData(prev => ({
      ...prev,
      city: cityName,
      lat: place.lat,
      lng: place.lon
    }))
    setCitySuggestions([])
    setShowSuggestions(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!day || !month || !year || year.length !== 4) {
      alert('Please enter a valid date of birth.')
      return
    }
    if (!formData.time_of_birth) {
      alert('Please enter your time of birth.')
      return
    }
    if (!formData.city) {
      alert('Please select a city from the dropdown suggestions.')
      return
    }

    setLoading(true)
    const encoded = encodeURIComponent(JSON.stringify(formData))
    router.push(`/generating?data=${encoded}`)
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>

        <div style={s.header}>
          <a href="/" style={s.back}>← Back</a>
          <span className="tag tag-purple">Free Profile</span>
        </div>

        <div style={s.card}>

          <div style={s.cardHeader}>
            <h1 style={s.title}>Your Alignment Profile</h1>
            <p style={s.subtitle}>
              Enter your birth details to generate your personal blueprint.
              Takes 30 seconds.
            </p>
            <div style={s.tags}>
              <span className="tag tag-purple">Astrology</span>
              <span className="tag tag-green">Human Design</span>
              <span className="tag tag-orange">Numerology</span>
            </div>
          </div>

          <div style={s.form}>

            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your full name"
                style={s.input}
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Date of Birth</label>
              <div style={s.dateRow}>
                <div style={{width:'70px', flexShrink:0}}>
                  <input
                    type="number"
                    placeholder="DD"
                    value={day}
                    onChange={e => setDay(e.target.value)}
                    min="1"
                    max="31"
                    style={{...s.input, textAlign:'center', width:'100%'}}
                  />
                </div>
                <div style={{flex:2}}>
                  <select
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    style={{...s.input, width:'100%'}}
                  >
                    <option value="">Month</option>
                    {months.map((m, i) => (
                      <option key={i} value={String(i + 1)}>{m}</option>
                    ))}
                  </select>
                </div>
                <div style={{width:'90px', flexShrink:0}}>
                  <input
                    type="number"
                    placeholder="YYYY"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    min="1900"
                    max="2010"
                    style={{...s.input, textAlign:'center', width:'100%'}}
                  />
                </div>
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Time of Birth</label>
              <input
                type="time"
                value={formData.time_of_birth}
                onChange={e => setFormData(prev => ({ ...prev, time_of_birth: e.target.value }))}
                style={s.input}
              />
              <p style={s.hint}>Check your birth certificate for accuracy.</p>
            </div>

            <div style={{...s.field, position:'relative'}}>
              <label style={s.label}>City of Birth</label>
              <input
                type="text"
                value={cityValue}
                onChange={handleCityInput}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Start typing your city..."
                style={s.input}
                autoComplete="off"
              />
              <p style={s.hint}>Select from the dropdown for accurate coordinates.</p>

              {showSuggestions && citySuggestions.length > 0 && (
                <div style={s.suggestions}>
                  {citySuggestions.map((place, i) => (
                    <div
                      key={i}
                      onMouseDown={() => handleCitySelect(place)}
                      style={s.suggestion}
                    >
                      <span style={s.suggestionIcon}>◦</span>
                      <span style={s.suggestionText}>{place.display_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={s.freeNote}>
              <span style={s.freeIcon}>✦</span>
              <span style={s.freeLabel}>Free — no payment required</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                ...s.btn,
                background: loading ? '#ccc' : 'var(--purple)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Generating...' : 'Generate My Profile →'}
            </button>

            <p style={s.disclaimer}>
              Your data is used only to generate your profile. Never shared.
            </p>

          </div>
        </div>
      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'560px', margin:'0 auto', padding:'32px 24px 80px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' },
  back: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500' },
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', boxShadow:'var(--shadow-lg)', overflow:'hidden' },
  cardHeader: { padding:'36px 36px 28px', borderBottom:'1px solid var(--border)', background:'linear-gradient(135deg, var(--purple-light) 0%, var(--green-light) 100%)' },
  title: { fontSize:'32px', fontWeight:'600', color:'var(--text)', marginBottom:'10px', fontFamily:'Cormorant Garamond, serif' },
  subtitle: { fontSize:'15px', color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'16px' },
  tags: { display:'flex', gap:'8px', flexWrap:'wrap' },
  form: { padding:'36px' },
  field: { marginBottom:'20px' },
  dateRow: { display:'flex', gap:'10px', alignItems:'center' },
  label: { display:'block', fontSize:'13px', fontWeight:'600', color:'var(--text)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.5px' },
  input: { padding:'12px 16px', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'15px', color:'var(--text)', background:'var(--bg)', outline:'none', boxSizing:'border-box' },
  hint: { fontSize:'12px', color:'var(--text-light)', marginTop:'6px' },
  suggestions: { position:'absolute', top:'100%', left:0, right:0, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:'10px', boxShadow:'var(--shadow-lg)', zIndex:100, maxHeight:'200px', overflowY:'auto' },
  suggestion: { display:'flex', alignItems:'flex-start', gap:'10px', padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid var(--border)' },
  suggestionIcon: { color:'var(--purple)', flexShrink:0, marginTop:'2px' },
  suggestionText: { fontSize:'13px', color:'var(--text)', lineHeight:'1.5' },
  freeNote: { display:'flex', alignItems:'center', gap:'10px', padding:'16px', background:'var(--purple-light)', borderRadius:'10px', marginBottom:'20px' },
  freeIcon: { fontSize:'20px', color:'var(--purple)' },
  freeLabel: { fontSize:'14px', color:'var(--purple)', fontWeight:'500' },
  btn: { width:'100%', padding:'15px', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'500', boxShadow:'0 4px 20px rgba(124,92,191,0.3)' },
  disclaimer: { textAlign:'center', fontSize:'12px', color:'var(--text-light)', marginTop:'16px' }
}