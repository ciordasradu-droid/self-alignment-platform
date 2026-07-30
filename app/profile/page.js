'use client'

// Destinație: app/profile/page.js  (ÎNLOCUIEȘTE COMPLET)
// Schimbări față de versiunea cu gate-ul cu 3 acorduri (care rămâne):
// - AUTO-VINDECARE: dacă profilul există dar planul lipsește (generare eșuată),
//   pagina pornește singură regenerarea planului și face polling până e gata
// - Secțiunea Plan de Aliniere NU se mai afișează goală: ori plan complet,
//   ori un card mic "planul tău se scrie acum...", ori nimic
// - Gate-ul primește acordurile și dacă planul sosește în timp ce userul e la gate

import { useState, useEffect, Suspense } from 'react'
import WaterLoader from '../components/water/WaterLoader'
import { generateProfilePDF } from '../../lib/generatePDF'
import { t } from '../../lib/translations'
import V4Sections, { isV4 } from './V4Sections'
import Chapter from '../components/Chapter'
import RoomNav from '../components/RoomNav'
import { SettingsIcon } from '../components/SettingsDrawer'
import SettingsDrawer from '../components/SettingsDrawer'
import { useUser } from '../../lib/useUser'
import { useLanguage } from '../../lib/language'
import { languageNameIn } from '../../lib/languageNames'

// Terminology imports for HDCard subtitles + translated values
import { headerBoxExplanations as roExpl, hdTerms as roHd } from '../../lib/prompts/terminology/ro'
import { headerBoxExplanations as enExpl, hdTerms as enHd } from '../../lib/prompts/terminology/en'
import { headerBoxExplanations as esExpl, hdTerms as esHd } from '../../lib/prompts/terminology/es'
import { headerBoxExplanations as frExpl, hdTerms as frHd } from '../../lib/prompts/terminology/fr'
import { headerBoxExplanations as deExpl, hdTerms as deHd } from '../../lib/prompts/terminology/de'
import { headerBoxExplanations as itExpl, hdTerms as itHd } from '../../lib/prompts/terminology/it'
import { headerBoxExplanations as ptExpl, hdTerms as ptHd } from '../../lib/prompts/terminology/pt'
import { headerBoxExplanations as nlExpl, hdTerms as nlHd } from '../../lib/prompts/terminology/nl'
import { headerBoxExplanations as plExpl, hdTerms as plHd } from '../../lib/prompts/terminology/pl'
import { headerBoxExplanations as huExpl, hdTerms as huHd } from '../../lib/prompts/terminology/hu'
import { headerBoxExplanations as ruExpl, hdTerms as ruHd } from '../../lib/prompts/terminology/ru'

const EXPLANATIONS = { ro: roExpl, en: enExpl, es: esExpl, fr: frExpl, de: deExpl, it: itExpl, pt: ptExpl, nl: nlExpl, pl: plExpl, hu: huExpl, ru: ruExpl }
const HD_TERMS = { ro: roHd, en: enHd, es: esHd, fr: frHd, de: deHd, it: itHd, pt: ptHd, nl: nlHd, pl: plHd, hu: huHd, ru: ruHd }

// Mesaj pentru cardul "planul se scrie acum" (regenerare automată în fundal)
const PLAN_PENDING = {
  en: 'Your alignment plan is being written right now. It will appear here in 1-2 minutes — you can keep reading your profile.',
  ro: 'Planul tău de aliniere se scrie chiar acum. Va apărea aici în 1-2 minute — poți continua să-ți citești profilul.',
  es: 'Tu plan de alineación se está escribiendo ahora mismo. Aparecerá aquí en 1-2 minutos — puedes seguir leyendo tu perfil.',
  fr: "Ton plan d'alignement est en train d'être écrit. Il apparaîtra ici dans 1-2 minutes — tu peux continuer à lire ton profil.",
  de: 'Dein Ausrichtungsplan wird gerade geschrieben. Er erscheint hier in 1-2 Minuten — du kannst dein Profil weiterlesen.',
  it: 'Il tuo piano di allineamento viene scritto proprio ora. Apparirà qui tra 1-2 minuti — puoi continuare a leggere il tuo profilo.',
  pt: 'O teu plano de alinhamento está a ser escrito agora. Aparecerá aqui em 1-2 minutos — podes continuar a ler o teu perfil.',
  nl: 'Je uitlijningsplan wordt nu geschreven. Het verschijnt hier over 1-2 minuten — je kunt je profiel verder lezen.',
  pl: 'Twój plan wyrównania jest właśnie pisany. Pojawi się tutaj za 1-2 minuty — możesz dalej czytać swój profil.',
  hu: 'Az igazítási terved éppen most készül. 1-2 perc múlva megjelenik itt — közben olvashatod tovább a profilod.',
  ru: 'Твой план согласия с собой пишется прямо сейчас. Он появится здесь через 1-2 минуты — пока можешь дальше читать свой профиль.',
}

function getExplanations(lang) { return EXPLANATIONS[lang] || EXPLANATIONS['en'] }
function getHdTerms(lang) { return HD_TERMS[lang] || HD_TERMS['en'] }

function translateHd(category, value, lang) {
  if (!value) return value
  const terms = getHdTerms(lang)
  const map = terms?.[category]
  if (map && map[value]) return map[value]
  return value
}

// Polling simplu: întreabă endpoint-ul până când status != 'pending' sau expiră bugetul
async function pollUntilComplete(url, { intervalMs = 3000, maxMs = 240000 } = {}) {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    let data
    try {
      const res = await fetch(url, { cache: 'no-store' })
      data = await res.json()
    } catch (e) {
      await new Promise(r => setTimeout(r, intervalMs))
      continue
    }
    if (data.status === 'complete') return data
    if (data.status === 'failed') throw new Error(data.error || 'Generation failed')
    await new Promise(r => setTimeout(r, intervalMs))
  }
  throw new Error('Generation timed out')
}

// ============================================================
//  HUB DE IDENTITATE — lentile + compatibilitate + invitatii
//  (sect. 6: "TU: profilul complet, lentilele, compatibilitatea, invitatiile")
// ============================================================
const HUB_L = {
  en: { lenses: 'Your three lenses', lens1: 'How', lens2: 'Where', lens3: 'Why',
        compat_t: 'Compatibility profile', compat_s: 'See how you work with someone — partner, friend or business.',
        invite_t: 'Invite someone', invite_s: 'So you can see your compatibility, once they join.', invite_link_label: 'Your invite link', copy: 'Copy', copied: 'Copied' },
  ro: { lenses: 'Cele trei lentile ale tale', lens1: 'Cum', lens2: 'Unde', lens3: 'De ce',
        compat_t: 'Profil de compatibilitate', compat_s: 'Vezi cum funcționezi cu cineva — partener, prieten sau afaceri.',
        invite_t: 'Invită pe cineva', invite_s: 'Ca să-i poți vedea compatibilitatea cu tine, odată ce se alătură.', invite_link_label: 'Linkul tău de invitație', copy: 'Copiază', copied: 'Copiat' },
}
const hx = (lang, k) => (HUB_L[lang] || HUB_L.en)[k]

// Punctul 3 (audit 26.07, runda 4): "Copiaza"/"Copiat" e carcasa (ca
// "Descarca PDF") — separat de HUB_L (care ramane pe profileLang pentru
// restul cardului, neschimbat fata de runda 3) ca sa nu introduca chei
// lipsa in blocurile HUB_L existente (doar en/ro).
const COPY_L = {
  en: { copy: 'Copy', copied: 'Copied' },
  ro: { copy: 'Copiază', copied: 'Copiat' },
  es: { copy: 'Copiar', copied: 'Copiado' },
  fr: { copy: 'Copier', copied: 'Copié' },
  de: { copy: 'Kopieren', copied: 'Kopiert' },
  it: { copy: 'Copia', copied: 'Copiato' },
  pt: { copy: 'Copiar', copied: 'Copiado' },
  nl: { copy: 'Kopiëren', copied: 'Gekopieerd' },
  pl: { copy: 'Kopiuj', copied: 'Skopiowano' },
  hu: { copy: 'Másolás', copied: 'Másolva' },
  ru: { copy: 'Копировать', copied: 'Скопировано' },
}
const cx = (lang, k) => (COPY_L[lang] || COPY_L.en)[k]

function Lenses({ profile, lang }) {
  if (!profile) return null
  const hd = profile.hd_data || {}
  const astro = profile.astro_data || {}
  const num = profile.numerology_data || {}
  const items = [
    { n: '1', k: 'lens1', title: 'Human Design', value: [hd.type, hd.profile].filter(Boolean).join(' · ') },
    { n: '2', k: 'lens2', title: 'Astrologie', value: [astro.sun_sign, astro.element].filter(Boolean).join(' · ') },
    { n: '3', k: 'lens3', title: 'Numerologie', value: num.life_path ? String(num.life_path) : '' },
  ].filter(i => i.value)
  if (!items.length) return null

  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontSize: '12px', color: 'rgba(244,240,234,0.5)', letterSpacing: '0.5px', marginBottom: '10px' }}>{hx(lang, 'lenses')}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', gap: '10px' }}>
        {items.map(i => (
          <div key={i.n} className="chapter" style={{ padding: '14px 16px', marginBottom: 0 }}>
            <span style={{ fontSize: '10.5px', color: '#e5a93c', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{hx(lang, i.k)}</span>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: '#f4f0ea', margin: '5px 0 2px' }}>{i.title}</p>
            <p style={{ fontSize: '12.5px', color: 'rgba(244,240,234,0.6)', lineHeight: 1.4 }}>{i.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// T1 (calup arhitectura 30.07) — la finalul profilului, DE FIECARE DATA
// (nu doar prima citire), optiunile Vocea Pragului de inceput de drum:
// nu e o oferta de pret (aceea traieste doar pe Drumul, sect. D6), doar
// o invitatie calma catre camerele unde ritualul chiar se intampla.
const CLOSE_L = {
  en: { line: 'You have read who you are. The rest writes itself, day by day.', today: 'Go to Today', path: 'See your Path' },
  ro: { line: 'Ai citit cine ești. Restul se scrie singur, zi de zi.', today: 'Mergi la Azi', path: 'Vezi Drumul tău' },
  es: { line: 'Has leído quién eres. El resto se escribe solo, día a día.', today: 'Ir a Hoy', path: 'Ver tu Camino' },
  fr: { line: 'Tu as lu qui tu es. Le reste s\'écrit tout seul, jour après jour.', today: 'Aller à Aujourd\'hui', path: 'Voir ton Chemin' },
  de: { line: 'Du hast gelesen, wer du bist. Der Rest schreibt sich von selbst, Tag für Tag.', today: 'Zu Heute gehen', path: 'Deinen Weg ansehen' },
  it: { line: 'Hai letto chi sei. Il resto si scrive da solo, giorno dopo giorno.', today: 'Vai a Oggi', path: 'Vedi il tuo Cammino' },
  pt: { line: 'Leste quem és. O resto escreve-se sozinho, dia após dia.', today: 'Ir para Hoje', path: 'Ver o teu Caminho' },
  nl: { line: 'Je hebt gelezen wie je bent. De rest schrijft zichzelf, dag na dag.', today: 'Ga naar Vandaag', path: 'Bekijk je Weg' },
  pl: { line: 'Przeczytałeś, kim jesteś. Reszta pisze się sama, dzień po dniu.', today: 'Przejdź do Dziś', path: 'Zobacz swoją Drogę' },
  hu: { line: 'Elolvastad, ki vagy. A többi magától íródik, napról napra.', today: 'Ugrás a Mára', path: 'Az Utad megtekintése' },
  ru: { line: 'Ты прочитал, кто ты есть. Остальное пишется само, день за днём.', today: 'Перейти к Сегодня', path: 'Смотреть твой Путь' },
}
const clx = (lang, k) => (CLOSE_L[lang] || CLOSE_L.en)[k]

function JourneyStart({ lang }) {
  return (
    <div className="chapter" style={{ padding: '28px 24px', textAlign: 'center', marginTop: '8px' }}>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: '#f4f0ea', lineHeight: 1.6, marginBottom: '20px' }}>
        {clx(lang, 'line')}
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/dashboard" className="pill-btn">{clx(lang, 'today')}</a>
        <a href="/drumul" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 24px', minHeight: '44px', fontSize: '14px', borderRadius: '999px', border: '1px solid rgba(244,240,234,0.2)', color: 'rgba(244,240,234,0.85)', textDecoration: 'none' }}>{clx(lang, 'path')}</a>
      </div>
    </div>
  )
}

function CompatCard({ lang }) {
  return (
    <a href="/compatibility" className="chapter" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px',
      padding: '18px 20px', marginBottom: '12px', textDecoration: 'none',
    }}>
      <div>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: '#f4f0ea', marginBottom: '3px' }}>{hx(lang, 'compat_t')}</p>
        <p style={{ fontSize: '13px', color: 'rgba(244,240,234,0.6)', lineHeight: 1.4 }}>{hx(lang, 'compat_s')}</p>
      </div>
      <span style={{ fontSize: '20px', color: '#e5a93c', flexShrink: 0 }} aria-hidden="true">→</span>
    </a>
  )
}

function InviteHub({ userId, lang, appLang }) {
  const [copied, setCopied] = useState(false)
  const [link, setLink] = useState('')

  useEffect(() => { setLink(`${window.location.origin}/invite/${userId}`) }, [userId])

  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="chapter" style={{ padding: '18px 20px', marginBottom: '16px' }}>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: '#f4f0ea', marginBottom: '3px' }}>{hx(lang, 'invite_t')}</p>
      <p style={{ fontSize: '13px', color: 'rgba(244,240,234,0.6)', marginBottom: '12px' }}>{hx(lang, 'invite_s')}</p>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <p style={{ flex: 1, fontSize: '12.5px', color: 'rgba(244,240,234,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: 'rgba(7,6,14,0.4)', borderRadius: '10px', padding: '9px 12px' }}>{hx(lang, 'invite_link_label')}</p>
        <button onClick={copy} style={{ padding: '9px 16px', minHeight: '40px', fontSize: '13px', flexShrink: 0, borderRadius: '20px', border: '1px solid rgba(229,169,60,0.3)', background: 'transparent', color: '#f0d9b0', cursor: 'pointer' }}>
          {copied ? cx(appLang, 'copied') : cx(appLang, 'copy')}
        </button>
      </div>
    </div>
  )
}

function CommitmentGate({ lang, agreements, onAccept }) {
  const hasAgreements = Array.isArray(agreements) && agreements.length > 0
  const [checked, setChecked] = useState(hasAgreements ? agreements.map(() => false) : [])

  const allChecked = !hasAgreements || (checked.length > 0 && checked.every(Boolean))

  const toggle = (i) => {
    setChecked(prev => prev.map((c, j) => (j === i ? !c : c)))
  }

  return (
    <>
      <main style={{ position:'relative', zIndex:2, maxWidth:'560px', margin:'60px auto', padding:'0 24px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(26px, 6vw, 38px)', fontWeight:600, color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1.2, marginBottom:'18px' }}>
          {t(lang, 'before_you_begin')}
        </h1>
        <p style={{ fontSize:'16px', lineHeight:1.7, color:'var(--text-muted)', marginBottom:'32px' }}>
          {t(lang, 'agreements_subtitle')}
        </p>

        {hasAgreements && (
          <div style={{ textAlign:'left', marginBottom:'32px' }}>
            <p style={{ fontSize:'12px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--text-muted)', marginBottom:'14px', textAlign:'center' }}>
              {t(lang, 'your_agreements')}
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {agreements.map((item, i) => {
                const isOn = checked[i]
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={isOn}
                    style={{
                      display:'flex', alignItems:'flex-start', gap:'14px',
                      width:'100%', textAlign:'left', cursor:'pointer',
                      background:'var(--surface)',
                      border: isOn ? '1.5px solid var(--purple)' : '1.5px solid var(--border)',
                      borderRadius:'14px', padding:'16px 18px',
                      boxShadow: isOn ? '0 4px 14px var(--gold-faint)' : 'var(--shadow)',
                      transition:'border-color 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink:0, width:'24px', height:'24px', borderRadius:'50%',
                        border: isOn ? 'none' : '2px solid var(--border)',
                        background: isOn ? 'var(--purple)' : 'transparent',
                        color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center',
                        fontSize:'14px', fontWeight:'700', marginTop:'1px',
                        transition:'background 0.2s',
                      }}
                    >
                      {null}
                    </span>
                    <span style={{ fontSize:'15px', lineHeight:'1.65', color: isOn ? 'var(--text)' : 'var(--text-muted)', transition:'color 0.2s' }}>
                      {item}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <button
          onClick={onAccept}
          disabled={!allChecked}
          className="cta-premium cta-premium-large"
          style={{
            cursor: allChecked ? 'pointer' : 'not-allowed',
            opacity: allChecked ? 1 : 0.45,
            animation: allChecked ? undefined : 'none',
          }}
        >
          {t(lang, 'ready_btn')}
        </button>

        {hasAgreements && !allChecked && (
          <p style={{ fontSize:'13px', color:'var(--text-light)', marginTop:'14px' }}>
            {t(lang, 'check_all')}
          </p>
        )}
      </main>
    </>
  )
}

function HDCard({ hdData, lang }) {
  if (!hdData) return null
  const expl = getExplanations(lang)

  const translatedType = translateHd('types', hdData.type, lang)
  const translatedStrategy = translateHd('strategies', hdData.strategy, lang)
  const translatedAuthority = translateHd('authorities', hdData.authority, lang)

  const typeSubtitle = expl.type?.subtitles?.[hdData.type] || null
  const profileSubtitle = expl.profile?.subtitle || null
  const strategySubtitle = expl.strategy?.subtitles?.[hdData.strategy] || null
  const authoritySubtitle = expl.authority?.subtitles?.[hdData.authority] || null

  return (
    <div style={{...s.card, borderLeft:'4px solid var(--orange)', marginBottom:'20px'}}>
      <div style={s.cardLabel('var(--orange-light)', 'var(--orange)')}>Human Design</div>
      <div style={s.grid2}>
        <div style={hd.item}>
          <p style={hd.label}>{t(lang, 'hd_type')}</p>
          <p style={hd.value}>{translatedType}</p>
          {typeSubtitle && <p style={hd.subtitle}>{typeSubtitle}</p>}
        </div>
        <div style={hd.item}>
          <p style={hd.label}>{t(lang, 'hd_profile')}</p>
          <p style={hd.value}>{hdData.profile}</p>
          {profileSubtitle && <p style={hd.subtitle}>{profileSubtitle}</p>}
        </div>
        <div style={hd.item}>
          <p style={hd.label}>{t(lang, 'hd_strategy')}</p>
          <p style={hd.value}>{translatedStrategy}</p>
          {strategySubtitle && <p style={hd.subtitle}>{strategySubtitle}</p>}
        </div>
        <div style={hd.item}>
          <p style={hd.label}>{t(lang, 'hd_authority')}</p>
          <p style={hd.value}>{translatedAuthority}</p>
          {authoritySubtitle && <p style={hd.subtitle}>{authoritySubtitle}</p>}
        </div>
      </div>
    </div>
  )
}

const hd = {
  item: { background:'var(--bg)', borderRadius:'10px', padding:'14px' },
  label: { fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.5px', color:'var(--text-muted)', marginBottom:'6px' },
  value: { fontSize:'15px', fontWeight:'600', color:'var(--text)', marginBottom:'4px' },
  subtitle: { fontSize:'12px', color:'var(--text-muted)', lineHeight:'1.5', marginTop:'4px', fontStyle:'italic' }
}

// ============================================================
//  LEGACY v3 SECTIONS — shown only for old profiles in the DB
// ============================================================
function LegacySections({ sections, swot, lang }) {
  return (
    <>
      <div style={{...s.card, borderLeft:'4px solid var(--purple)'}}>
        <div style={s.cardLabel('var(--purple-light)', 'var(--purple)')}>{t(lang, 'blueprint')}</div>
        <p style={s.bodyText}>{sections?.blueprint}</p>
      </div>

      <div style={s.grid2}>
        <div style={{...s.card, borderLeft:'4px solid var(--green)'}}>
          <div style={s.cardLabel('var(--green-light)', 'var(--green)')}>{t(lang, 'strengths')}</div>
          <ul style={s.list}>
            {sections?.strengths?.map((item, i) => (
              <li key={i} style={s.listItem}><span style={{color:'var(--green)', marginRight:'8px'}}>◦</span>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{...s.card, borderLeft:'4px solid var(--orange)'}}>
          <div style={s.cardLabel('var(--orange-light)', 'var(--orange)')}>{t(lang, 'vulnerabilities')}</div>
          <ul style={s.list}>
            {sections?.vulnerabilities?.map((item, i) => (
              <li key={i} style={s.listItem}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={s.grid2}>
        <div style={{...s.card, borderLeft:'4px solid var(--purple)'}}>
          <div style={s.cardLabel('var(--purple-light)', 'var(--purple)')}>{t(lang, 'energy_patterns')}</div>
          <ul style={s.list}>
            {sections?.energy_patterns?.map((item, i) => (
              <li key={i} style={s.listItem}><span style={{color:'var(--purple)', marginRight:'8px'}}>◦</span>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{...s.card, borderLeft:'4px solid var(--orange)'}}>
          <div style={s.cardLabel('var(--orange-light)', 'var(--orange)')}>{t(lang, 'sabotage')}</div>
          <ul style={s.list}>
            {sections?.sabotage_tendencies?.map((item, i) => (
              <li key={i} style={s.listItem}><span style={{color:'var(--orange)', marginRight:'8px'}}>◦</span>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={s.grid2}>
        <div style={{...s.card, borderLeft:'4px solid var(--green)'}}>
          <div style={s.cardLabel('var(--green-light)', 'var(--green)')}>{t(lang, 'decision')}</div>
          <ul style={s.list}>
            {sections?.decision_making?.map((item, i) => (
              <li key={i} style={s.listItem}><span style={{color:'var(--green)', marginRight:'8px'}}>◦</span>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{...s.card, borderLeft:'4px solid var(--purple)'}}>
          <div style={s.cardLabel('var(--purple-light)', 'var(--purple)')}>{t(lang, 'work')}</div>
          <ul style={s.list}>
            {sections?.work_discipline?.map((item, i) => (
              <li key={i} style={s.listItem}><span style={{color:'var(--purple)', marginRight:'8px'}}>◦</span>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

function ProfileContent() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [committed, setCommitted] = useState(false)
  const [planPending, setPlanPending] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { user } = useUser()
  // Punctul 1 (audit 26.07, runda 3): carcasa (meniu, titlu, butoane, panoul
  // de Setari) urmeaza intotdeauna limba aplicatiei — profile.language (mai
  // jos, profileLang) ramane doar pentru continutul generat (capitolele,
  // acordurile), care nu poate fi retradus fara regenerare.
  const [appLang] = useLanguage()

  // Regenerează planul în fundal când lipsește (auto-vindecare).
  // POST-ul poate fi abandonat de browser (30s) — serverul continuă;
  // polling-ul prinde rezultatul când e scris în DB.
  const healPlan = async (data) => {
    if (!data.interpreted_profile_id || !data.calculated_data || !data.sections) return
    setPlanPending(true)
    try {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 25000)
        await fetch('/api/interpret-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interpreted_profile_id: data.interpreted_profile_id,
            calculated_data: data.calculated_data,
            sections: data.sections,
            swot: data.swot,
            language: data.language || 'en'
          }),
          signal: controller.signal
        })
        clearTimeout(timeoutId)
      } catch (e) {
        // așteptat la generări lungi — continuăm cu polling
      }

      const planData = await pollUntilComplete(
        `/api/interpret-plan?id=${data.interpreted_profile_id}`,
        { intervalMs: 3000, maxMs: 240000 }
      )

      setProfile(prev => {
        if (!prev) return prev
        const updated = { ...prev, alignment_plan: planData.alignment_plan }
        try { localStorage.setItem('profile', JSON.stringify(updated)) } catch (e) {}
        return updated
      })
    } catch (e) {
      console.warn('Plan self-heal failed:', e.message)
    } finally {
      setPlanPending(false)
    }
  }

  useEffect(() => {
    // D3 (25.07): NU se mai sterge cache-ul inainte de fetch. Stergerea eagera
    // de aici era cauza numelui disparut din salut (Azi) si a ecranului gol
    // "genereaza profilul" dupa navigare rapida — orice pagina care citea
    // 'profile' din localStorage (inclusiv fallback-ul de mai jos, in ACELASI
    // effect) gasea cache-ul deja golit de aceasta linie, inainte ca fetch-ul
    // sa apuce sa-l repopuleze. Cache-ul se suprascrie doar la fetch reusit
    // (mai jos); daca fetch-ul esueaza, fallback-ul foloseste cache-ul vechi,
    // intact — mai bine date usor invechite decat un ecran gol.
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const profilePayload = {
            sections: data.sections,
            swot: data.swot,
            alignment_plan: data.alignment_plan,
            full_name: data.full_name,
            personal_year: data.personal_year,
            hd_data: data.hd_data,
            language: data.language,
            interpreted_profile_id: data.interpreted_profile_id
          }
          localStorage.setItem('profile', JSON.stringify(profilePayload))
          setProfile(profilePayload)
          // Punctul 2 (audit 26.07): poarta verifica acum SERVERUL
          // (agreements_committed, legat de interpreted_profile_id CURENT)
          // — nu mai exista sursa locala de adevar, se invalideaza singura
          // la un profil nou.
          if (data.agreements_committed) setCommitted(true)

          // Plan lipsă -> regenerare automată în fundal
          if (!data.alignment_plan) {
            healPlan(data)
          }
        }
        setLoading(false)
      })
      .catch(() => {
        const stored = localStorage.getItem('profile')
        if (stored) {
          const parsed = JSON.parse(stored)
          setProfile(parsed)
        }
        setLoading(false)
      })
  }, [])

  if (loading) return <main style={s.center}><WaterLoader /></main>
  if (!profile) return (
    <>
      <div style={s.center}>
        <p style={{marginBottom:'20px'}}>No profile found.</p>
        <a href="/onboarding" style={{color:'var(--purple)', fontWeight:'600'}}>Generate your profile →</a>
      </div>
      <RoomNav lang={appLang} />
    </>
  )

  // profileLang = limba in care a fost SCRIS profilul (nu poate fi retradusa
  // fara regenerare) — foloseste-o doar pentru continutul generat mai jos.
  // Carcasa paginii (header, butoane, panoul Setari, RoomNav) foloseste appLang.
  const profileLang = profile.language || 'en'
  const lang = profileLang

  if (!committed) {
    const gateAgreements = Array.isArray(profile.alignment_plan?.behavioral_anchors?.non_negotiables)
      ? profile.alignment_plan.behavioral_anchors.non_negotiables.filter(Boolean).slice(0, 3)
      : []

    return (
      <CommitmentGate
        key={gateAgreements.length}
        lang={lang}
        agreements={gateAgreements}
        onAccept={() => {
          // Punctul 2 (audit 26.07): acordul se scrie pe server, legat de
          // profilul curent — nu mai e sursa de adevar in localStorage.
          // Fire-and-forget: nu blocam UI-ul pe raspunsul retelei; daca
          // esueaza, /api/profile va re-cere acordul la urmatoarea vizita
          // (fail-safe: mai bine cere din nou decat sa presupuna acceptat).
          fetch('/api/agreements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: gateAgreements,
              interpreted_profile_id: profile.interpreted_profile_id,
              language: lang,
            }),
          }).catch(() => {})
          setCommitted(true)
        }}
      />
    )
  }

  const { sections, swot, full_name, personal_year, hd_data } = profile
  const useV4 = isV4(sections)

  const handleDownloadPDF = () => generateProfilePDF(profile)
  const chapterKey = full_name || 'anon'

  // TOC — doar capitolele care chiar exista (v4, sect. A7 25.07: 6 capitole,
  // Plan de Aliniere nu se mai randeaza aici — vezi Drumul, z7). Trebuie sa
  // oglindeasca exact id-urile Chapter din V4Sections.
  const toc = useV4 ? [
    sections.how_you_work && (sections.how_you_work.surface || sections.how_you_work.engine || sections.how_you_work.core) && { id: 'how-you-work', label: t(lang, 'how_you_work') },
    Array.isArray(sections.strengths) && sections.strengths.length > 0 && { id: 'strengths', label: t(lang, 'strengths') },
    Array.isArray(sections.decision_system) && sections.decision_system.length > 0 && { id: 'decision-system', label: t(lang, 'decision_system') },
    sections.energy_manual && { id: 'energy-manual', label: t(lang, 'energy_manual') },
    sections.central_tension?.tension && { id: 'central-tension', label: t(lang, 'central_tension') },
    sections.aligned_life && { id: 'aligned-life', label: t(lang, 'aligned_life') },
  ].filter(Boolean) : []

  return (
    <>
      <main style={s.wrap}>

        <div style={s.header}>
          <div>
            <span className="tag tag-purple" style={{marginBottom:'12px', display:'inline-block'}}>{t(appLang, 'profile_tag')}</span>
            <h1 style={s.title}>{t(appLang, 'profile_title')}</h1>
            {full_name && <p style={s.subtitle}>{t(appLang, 'profile_generated_for')} {full_name}</p>}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
            <button onClick={handleDownloadPDF} style={s.dlBtn}>
              {t(appLang, 'download_pdf')}
            </button>
            <SettingsIcon onClick={() => setSettingsOpen(true)} lang={appLang} />
          </div>
        </div>

        {/* Punctul 1 (audit 26.07, runda 3): linia onesta — doar cand limba
            aplicatiei difera de limba in care a fost scris profilul. Numele
            limbii apare IN app_language (nu ca endonim), din languageNames.js. */}
        {appLang !== profileLang && (
          <p style={s.languageNotice}>
            {t(appLang, 'profile_language_notice').replace('{lang}', languageNameIn(appLang, profileLang))}
          </p>
        )}

        {/* HUB DE IDENTITATE — lentile, compatibilitate, invitatii (sect. 6) */}
        <Lenses profile={profile} lang={lang} />
        <CompatCard lang={lang} />
        {user?.id && <InviteHub userId={user.id} lang={lang} appLang={appLang} />}

        {toc.length > 0 && (
          <div className="chapter-toc">
            {toc.map(c => <a key={c.id} href={`#${c.id}`} className="chapter-toc-item">{c.label}</a>)}
          </div>
        )}

        {personal_year && (
          <div style={s.personalYearCard}>
            <div style={s.personalYearLeft}>
              <span style={s.personalYearNum}>{personal_year.personal_year}</span>
              <div>
                <p style={s.personalYearLabel}>{t(lang, 'current_phase')}</p>
                <p style={s.personalYearTheme}>{personal_year.theme}</p>
              </div>
            </div>
            <div style={s.personalYearRight}>
              <p style={s.personalYearFocus}>{personal_year.focus}</p>
              <div style={s.personalYearWarning}>
                                <span>{personal_year.warning}</span>
              </div>
            </div>
          </div>
        )}

        <HDCard hdData={hd_data} lang={lang} />

        {/* v4 profiles render the new 6 sections (A7, 25.07); old v3 profiles
            fall back to legacy. Plan de Aliniere si Self Perspective nu se
            mai randeaza aici (A7) — profilul se opreste la recunoastere.
            Cardul de upsell de mai jos a fost eliminat (D1, 25.07): contrazicea
            decizia inchisa "upsell eliminat" din documentul-mama, sect. 7. */}
        {useV4
          ? <V4Sections sections={sections} lang={lang} s={s} storageKey={chapterKey} />
          : <LegacySections sections={sections} swot={swot} lang={lang} />
        }

        <JourneyStart lang={appLang} />

      </main>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} lang={appLang} />
      <RoomNav lang={appLang} />
    </>
  )
}

const s = {
  wrap: { position:'relative', zIndex:2, maxWidth:'800px', margin:'0 auto', padding:'calc(40px + env(safe-area-inset-top)) 24px 24px', overflowX:'hidden' },
  center: { position:'relative', zIndex:2, textAlign:'center', padding:'80px 20px 24px', fontSize:'18px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'40px', flexWrap:'wrap', gap:'16px' },
  languageNotice: { fontSize:'13px', color:'var(--text-light)', fontStyle:'italic', marginTop:'-24px', marginBottom:'24px' },
  title: { fontSize:'clamp(28px, 7vw, 42px)', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  subtitle: { fontSize:'16px', color:'var(--text-muted)', marginTop:'6px' },
  dlBtn: { padding:'10px 20px', background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'14px', fontWeight:'500', cursor:'pointer', color:'var(--text)' },
  personalYearCard: { background:'var(--surface)', backdropFilter:'blur(16px) saturate(120%)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'28px', marginBottom:'20px', display:'flex', gap:'32px', alignItems:'flex-start', flexWrap:'wrap' },
  personalYearLeft: { display:'flex', alignItems:'center', gap:'16px', flexShrink:0 },
  personalYearNum: { fontSize:'64px', fontWeight:'700', color:'var(--orange)', fontFamily:'Cormorant Garamond, serif', lineHeight:1 },
  personalYearLabel: { fontSize:'11px', color:'var(--text-light)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px' },
  personalYearTheme: { fontSize:'18px', fontWeight:'600', color:'var(--text)' },
  personalYearRight: { flex:1 },
  personalYearFocus: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.7', marginBottom:'12px' },
  personalYearWarning: { display:'flex', alignItems:'flex-start', fontSize:'13px', color:'var(--text-light)', lineHeight:'1.6' },
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'28px', marginBottom:'20px', boxShadow:'var(--shadow)' },
  cardLabel: (bg, color) => ({ display:'inline-block', padding:'6px 14px', background:bg, color:color, borderRadius:'20px', fontSize:'13px', fontWeight:'600', marginBottom:'16px', letterSpacing:'0.3px' }),
  grid2: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap:'20px', marginBottom:'20px' },
  grid3: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap:'16px' },
  list: { listStyle:'none', padding:0, margin:0 },
  listItem: { fontSize:'14px', lineHeight:'1.6', color:'var(--text)', padding:'7px 0', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'flex-start' },
  bodyText: { fontSize:'15px', lineHeight:'1.75', color:'var(--text)', marginBottom:'8px' },
  swotGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap:'16px' },
  swotBox: { background:'var(--bg)', borderRadius:'10px', padding:'16px' },
  swotTitle: { fontSize:'13px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px' },
  planLayer: { borderBottom:'1px solid var(--border)', paddingBottom:'24px', marginBottom:'24px' },
  layerBadge: (color) => ({ display:'inline-block', padding:'5px 14px', background: color, color:'#fff', borderRadius:'20px', fontSize:'12px', fontWeight:'600', marginBottom:'16px', letterSpacing:'0.3px' }),
  planLabel: { fontSize:'12px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.5px', color:'var(--text-muted)', marginBottom:'10px', marginTop:'16px' },
  anchorBox: { background:'var(--bg)', borderRadius:'10px', padding:'16px' },
  ctaBox: { position:'relative', overflow:'hidden', background:'var(--surface)', backdropFilter:'blur(16px) saturate(120%)', border:'1px solid var(--border)', boxShadow:'0 24px 60px rgba(224, 179, 106, 0.14)', borderRadius:'var(--radius)', padding:'40px', textAlign:'center', marginTop:'32px' },
  ctaTitle: { fontSize:'28px', fontWeight:'600', color:'var(--text)', marginBottom:'10px', fontFamily:'Cormorant Garamond, serif' },
  ctaText: { fontSize:'15px', color:'var(--text-muted)', marginBottom:'24px' },
  ctaBtns: { display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' },
  ctaBtn: { display:'inline-block', padding:'13px 28px', background:'var(--gold)', color:'#20142a', borderRadius:'999px', fontSize:'15px', fontWeight:'600' },
  ctaBtnSecondary: { display:'inline-block', padding:'13px 28px', background:'rgba(255,255,255,0.15)', color:'#fff', borderRadius:'10px', fontSize:'15px', fontWeight:'600', border:'1px solid rgba(255,255,255,0.3)' }
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<main style={{ padding:'120px 24px' }}><WaterLoader /></main>}>
      <ProfileContent />
    </Suspense>
  )
}