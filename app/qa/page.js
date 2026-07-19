'use client'

// UNEALTĂ DE TEST — NU un ecran de produs, nu apare în nicio navigare.
// ȘTERGE acest folder + app/api/qa înainte de lansarea publică.
// Acces: /qa?key=e4c9669fcad5b7e113fd1897c766805b

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { setSimWeekday } from '../../lib/simWeekday'
import { setForcedRitual } from '../../lib/simRitual'

const QA_KEY = 'e4c9669fcad5b7e113fd1897c766805b'

const AGE_LINKS = [
  { label: 'Ziua 14+ (Tipare)', days: 14 },
  { label: 'Ziua 30+ (Privirea săptămânii)', days: 30 },
  { label: 'Ziua 60+ (Angajamentul)', days: 60 },
  { label: 'Ziua 90+ (Cercul, doar eticheta)', days: 90 },
]

function QAContent() {
  const params = useSearchParams()
  const [msg, setMsg] = useState('')
  const ok = params.get('key') === QA_KEY

  if (!ok) {
    return <main style={{ padding: 40, color: '#fff' }}>Not found.</main>
  }

  const setWeekday = (day, label) => {
    setSimWeekday(day)
    setMsg(`Setat: ${label}.`)
  }

  const clearWeekday = () => {
    setSimWeekday(null)
    setMsg('Simularea de zi a săptămânii a fost ștearsă — folosește ziua reală.')
  }

  const forceRitual = (value, label) => {
    setForcedRitual(value)
    setMsg(`Setat: ${label}.`)
  }

  const clearRitual = () => {
    setForcedRitual(null)
    setMsg('Simularea de ritual a fost ștearsă — folosește ora reală.')
  }

  return (
    <main style={{ padding: '32px 20px', maxWidth: 480, margin: '0 auto', color: '#f4f0ea', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>Unelte de test</h1>
      <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 24 }}>
        Doar pentru verificare. Nu apare nicăieri în aplicație.
      </p>

      <h2 style={{ fontSize: 15, marginBottom: 12 }}>1. Vechimea contului (server, reală)</h2>
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
        Trebuie să fii deja logat. Fiecare buton rescrie data de creare a contului TĂU și te duce direct pe Azi.
        Prima dată când apeși unul dintre astea, vechimea ta reală se salvează automat — o poți readuce oricând.
      </p>
      <a href={`/api/qa/age?key=${QA_KEY}&restore=1`}
         style={{ display: 'block', padding: '12px 16px', marginBottom: 8, background: 'rgba(240,217,176,0.14)', border: '1px solid rgba(240,217,176,0.4)', borderRadius: 10, color: '#f0d9b0', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
        ↩ Revino la starea reală (vechimea ta adevărată)
      </a>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {AGE_LINKS.map(a => (
          <a key={a.days} href={`/api/qa/age?key=${QA_KEY}&days=${a.days}`}
             style={{ display: 'block', padding: '12px 16px', background: 'rgba(229,169,60,0.12)', border: '1px solid rgba(229,169,60,0.3)', borderRadius: 10, color: '#f0d9b0', textDecoration: 'none', fontSize: 14 }}>
            {a.label}
          </a>
        ))}
      </div>

      <h2 style={{ fontSize: 15, marginBottom: 12 }}>2. Ziua săptămânii (doar pe acest telefon)</h2>
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
        Nu atinge nimic pe server — schimbă doar ce ritual vezi TU, în acest browser.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        <button onClick={() => setWeekday(6, 'Sâmbătă')} style={btnStyle}>Simulează Sâmbătă</button>
        <button onClick={() => setWeekday(0, 'Duminică')} style={btnStyle}>Simulează Duminică</button>
        <button onClick={clearWeekday} style={neutralBtnStyle}>
          Șterge simularea de zi (revino la ziua reală)
        </button>
      </div>

      <h2 style={{ fontSize: 15, marginBottom: 12 }}>3. Fereastra ritualului (doar pe acest telefon)</h2>
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
        Forțează dimineața sau seara, indiferent de ora reală — ca să poți verifica Privirea săptămânii
        sau ploaia de seară oricând, nu doar la ora potrivită.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <button onClick={() => forceRitual('morning', 'Dimineața forțată')} style={btnStyle}>Forțează Dimineața</button>
        <button onClick={() => forceRitual('evening', 'Seara forțată')} style={btnStyle}>Forțează Seara</button>
        <button onClick={clearRitual} style={neutralBtnStyle}>
          Șterge forțarea (revino la ora reală, peste zi)
        </button>
      </div>
      {msg && <p style={{ fontSize: 13, color: '#f0d9b0', marginBottom: 20 }}>{msg}</p>}

      <a href="/dashboard" style={{ display: 'inline-block', marginTop: 12, fontSize: 14, color: '#f0d9b0' }}>→ Deschide Azi</a>
    </main>
  )
}

const btnStyle = {
  display: 'block', width: '100%', padding: '12px 16px', background: 'rgba(229,169,60,0.12)',
  border: '1px solid rgba(229,169,60,0.3)', borderRadius: 10, color: '#f0d9b0', fontSize: 14, cursor: 'pointer', textAlign: 'left',
}

const neutralBtnStyle = {
  ...btnStyle, background: 'rgba(244,240,234,0.08)', borderColor: 'rgba(244,240,234,0.18)', color: '#f4f0ea',
}

export default function QAPage() {
  return (
    <Suspense fallback={null}>
      <QAContent />
    </Suspense>
  )
}
