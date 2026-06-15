'use client'

// Destinație: app/compatibility/result/page.js  (FIȘIER NOU)
// Face polling pe /api/compatibility?id=... până e gata, apoi afișează profilul
// relației. Randează secțiunile în funcție de tip. Buton de share la final.

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '../../../lib/language'
import CompatibilitySections from '../CompatibilitySections'

const L = {
  en: { generating:'Reading the dynamic between you', generating_sub:'Combining the two charts. 1-2 minutes.', failed:'Something went wrong. Please try again.', share:'Send it to them to see', private:'Your personal profile stays private', copied:'Link copied', back:'← Dashboard' },
  ro: { generating:'Citim dinamica dintre voi', generating_sub:'Combinăm cele două hărți. 1-2 minute.', failed:'Ceva n-a mers. Încearcă din nou.', share:'Trimite-i și lui să vadă', private:'Profilul tău personal rămâne privat', copied:'Link copiat', back:'← Dashboard' },
}
function lx(lang,k){ return (L[lang]||L.en)[k] }

async function poll(url, { intervalMs=3000, maxMs=240000 }={}) {
  const start = Date.now()
  while (Date.now()-start < maxMs) {
    try {
      const res = await fetch(url, { cache:'no-store' })
      const data = await res.json()
      if (data.status === 'complete') return data
      if (data.status === 'failed') throw new Error(data.error || 'failed')
    } catch (e) {
      if (e.message === 'failed') throw e
    }
    await new Promise(r=>setTimeout(r, intervalMs))
  }
  throw new Error('timeout')
}

function Result() {
  const [lang] = useLanguage()
  const params = useSearchParams()
  const id = params.get('id')
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    poll(`/api/compatibility?id=${id}`)
      .then(setProfile)
      .catch(() => setError(true))
  }, [id])

  const handleShare = () => {
    const url = `${window.location.origin}/r/${id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(()=>setCopied(false), 2000)
  }

  if (error) return (
    <><div className="cosmic-bg" /><main style={s.center}><p>{lx(lang,'failed')}</p><a href="/compatibility" style={{color:'var(--purple)',fontWeight:600}}>↻</a></main></>
  )

  if (!profile) return (
    <>
      <div className="cosmic-bg" />
      <main style={s.center}>
        <div style={{ fontSize:'40px', marginBottom:'18px' }} aria-hidden="true">✦</div>
        <h1 style={s.genTitle}>{lx(lang,'generating')}</h1>
        <p style={s.genSub}>{lx(lang,'generating_sub')}</p>
      </main>
    </>
  )

  const langUsed = profile.language || lang

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>
        <div style={s.header}>
          <a href="/dashboard" style={s.back}>{lx(langUsed,'back')}</a>
        </div>
        <CompatibilitySections profile={profile} lang={langUsed} />

        <div style={s.shareBox}>
          <button onClick={handleShare} style={s.shareBtn}>
            ↗ {copied ? lx(langUsed,'copied') : lx(langUsed,'share')}
          </button>
          <p style={s.private}>🔒 {lx(langUsed,'private')}</p>
        </div>
      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'760px', margin:'0 auto', padding:'40px 24px 80px' },
  center: { maxWidth:'480px', margin:'120px auto', padding:'0 24px', textAlign:'center' },
  genTitle: { fontSize:'24px', fontWeight:600, color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1.3, marginBottom:'10px' },
  genSub: { fontSize:'15px', color:'var(--text-muted)', lineHeight:1.6 },
  header: { marginBottom:'24px' },
  back: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500' },
  shareBox: { textAlign:'center', marginTop:'32px' },
  shareBtn: { padding:'15px 32px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'16px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 20px rgba(124,92,191,0.3)' },
  private: { fontSize:'13px', color:'var(--text-muted)', marginTop:'12px' },
}

export default function CompatibilityResultPage() {
  return (
    <Suspense fallback={<div style={{textAlign:'center',padding:'80px'}}>...</div>}>
      <Result />
    </Suspense>
  )
}