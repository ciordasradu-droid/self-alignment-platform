'use client'

// Destinație: app/r/[id]/page.js  (FIȘIER NOU — folder nou app/r/[id]/)
// Pagina publică de share. Cealaltă persoană deschide linkul, vede DOAR profilul
// relației (niciodată profilul personal al celui care a trimis). Fără cont, fără
// fricțiune. Jos, opțiunea blândă "începe propriul drum".

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useLanguage } from '../../../lib/language'
import CompatibilitySections from '../../compatibility/CompatibilitySections'

const L = {
  en: { loading:'Loading...', notfound:'This relationship profile is no longer available.', shared:'Someone shared this with you', start_title:'Want to understand yourself this way too?', start_sub:'This is how you two work together. Your own profile shows how you work — start your own journey.', start_btn:'Start my own journey →' },
  ro: { loading:'Se încarcă...', notfound:'Acest profil de relație nu mai e disponibil.', shared:'Cineva a împărtășit asta cu tine', start_title:'Vrei să te înțelegi și pe tine așa?', start_sub:'Asta e cum funcționați voi doi împreună. Profilul tău arată cum funcționezi tu — începe propriul drum.', start_btn:'Începe propriul drum →' },
}
function lx(lang,k){ return (L[lang]||L.en)[k] }

export default function SharedRelationPage() {
  const { id } = useParams()
  const [lang] = useLanguage()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/compatibility?id=${id}`, { cache:'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'complete' || data.success) setProfile(data)
        else setError(true)
      })
      .catch(() => setError(true))
  }, [id])

  if (error) return (
    <><div className="cosmic-bg" /><main style={s.center}><p>{lx(lang,'notfound')}</p></main></>
  )
  if (!profile) return (
    <><div className="cosmic-bg" /><main style={s.center}><div style={{fontSize:'40px'}} aria-hidden="true">✦</div><p style={{marginTop:'16px',color:'var(--text-muted)'}}>{lx(lang,'loading')}</p></main></>
  )

  const langUsed = profile.language || lang

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>
        <div style={s.banner}>
          <span style={s.bannerText}>✦ {lx(langUsed,'shared')}</span>
        </div>

        <CompatibilitySections profile={profile} lang={langUsed} />

        <div style={s.startBox}>
          <h2 style={s.startTitle}>{lx(langUsed,'start_title')}</h2>
          <p style={s.startSub}>{lx(langUsed,'start_sub')}</p>
          <a href="/" style={s.startBtn}>{lx(langUsed,'start_btn')}</a>
        </div>
      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'760px', margin:'0 auto', padding:'30px 24px 80px' },
  center: { maxWidth:'480px', margin:'120px auto', padding:'0 24px', textAlign:'center' },
  banner: { background:'var(--purple-light)', border:'1px solid var(--purple)', borderRadius:'12px', padding:'12px 18px', marginBottom:'28px', textAlign:'center' },
  bannerText: { fontSize:'14px', color:'var(--purple)', fontWeight:'500' },
  startBox: { background:'linear-gradient(135deg, var(--purple-dark) 0%, var(--purple) 100%)', borderRadius:'var(--radius)', padding:'40px', textAlign:'center', marginTop:'32px' },
  startTitle: { fontSize:'26px', fontWeight:'600', color:'#fff', marginBottom:'12px', fontFamily:'Cormorant Garamond, serif', lineHeight:1.3 },
  startSub: { fontSize:'15px', color:'rgba(255,255,255,0.8)', marginBottom:'24px', lineHeight:1.6, maxWidth:'440px', margin:'0 auto 24px' },
  startBtn: { display:'inline-block', padding:'14px 30px', background:'var(--gold)', color:'#20142a', borderRadius:'999px', fontSize:'15px', fontWeight:'600' },
}