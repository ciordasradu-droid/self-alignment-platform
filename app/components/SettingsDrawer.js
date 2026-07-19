'use client'

// Setările — icon din colț pe Tu (sect. 6). Limba se schimbă DOAR aici și la
// onboarding, nicăieri altundeva. Cont + abonament ca link-uri simple.
//
// PORTAL in document.body — la fel ca WaterVideoLayer/RoomNav: .flow-in din
// template.js creeaza containing block pentru fixed, altfel panoul ajunge
// la finalul paginii lungi, nu la baza ecranului.

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Flag from './Flag'
import { useLanguage, LANGUAGES } from '../../lib/language'
import { createSupabaseBrowser } from '../../lib/supabase/client'

const L = {
  en: {
    title: 'Settings', language: 'Language', subscription: 'Subscription', logout: 'Log out', close: 'Close',
    export_data: 'Export my data', exporting: 'Preparing...',
    delete_account: 'Delete my account', delete_confirm: 'This permanently deletes your profile, check-ins, and everything else. This cannot be undone.',
    delete_yes: 'Yes, delete everything', delete_cancel: 'Cancel', deleting: 'Deleting...',
  },
  ro: {
    title: 'Setări', language: 'Limbă', subscription: 'Abonament', logout: 'Ieși din cont', close: 'Închide',
    export_data: 'Exportă-mi datele', exporting: 'Se pregătește...',
    delete_account: 'Șterge-mi contul', delete_confirm: 'Asta șterge definitiv profilul, check-in-urile și tot restul. Nu se poate anula.',
    delete_yes: 'Da, șterge tot', delete_cancel: 'Anulează', deleting: 'Se șterge...',
  },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

export function SettingsIcon({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Setări" style={{
      width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(229,169,60,0.15)',
      background: 'rgba(10,9,21,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="rgba(244,240,234,0.75)" strokeWidth="1.6" />
        <path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.55 1.55M7.15 16.85l-1.55 1.55M18.4 18.4l-1.55-1.55M7.15 7.15L5.6 5.6"
              stroke="rgba(244,240,234,0.75)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  )
}

export default function SettingsDrawer({ open, onClose, lang: pageLang }) {
  const [lang, changeLanguage] = useLanguage()
  const shown = pageLang || lang
  const [loggingOut, setLoggingOut] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!open || !mounted) return null

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await createSupabaseBrowser().auth.signOut()
    } catch (e) {}
    window.location.href = '/'
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/account/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'my-data.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {}
    setExporting(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await fetch('/api/account/delete', { method: 'POST' })
      await createSupabaseBrowser().auth.signOut()
    } catch (e) {}
    window.location.href = '/'
  }

  return createPortal(
    <div style={ov.backdrop} onClick={onClose}>
      <div style={ov.panel} onClick={(e) => e.stopPropagation()} className="chapter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 22px 0' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '19px', color: '#f4f0ea' }}>{lx(shown, 'title')}</p>
          <button onClick={onClose} aria-label={lx(shown, 'close')} style={ov.closeBtn}>✕</button>
        </div>

        <div style={{ padding: '18px 22px 24px' }}>
          <p style={ov.label}>{lx(shown, 'language')}</p>
          <div style={ov.flagGrid}>
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => changeLanguage(l.code)} style={{
                ...ov.flagBtn,
                borderColor: shown === l.code ? 'rgba(229,169,60,0.7)' : 'rgba(244,240,234,0.18)',
              }}>
                <Flag code={l.code} />
                <span style={{ fontSize: '13px', color: 'rgba(244,240,234,0.85)' }}>{l.label}</span>
              </button>
            ))}
          </div>

          <div style={{ height: '1px', background: 'rgba(244,240,234,0.1)', margin: '20px 0' }} />

          <a href="/subscribe" style={ov.linkRow}>{lx(shown, 'subscription')}</a>
          <button onClick={handleLogout} disabled={loggingOut} style={{ ...ov.linkRow, opacity: loggingOut ? 0.6 : 1 }}>
            {lx(shown, 'logout')}
          </button>
          <button onClick={handleExport} disabled={exporting} style={{ ...ov.linkRow, opacity: exporting ? 0.6 : 1 }}>
            {exporting ? lx(shown, 'exporting') : lx(shown, 'export_data')}
          </button>

          {!confirmingDelete ? (
            <button onClick={() => setConfirmingDelete(true)} style={{ ...ov.linkRow, color: 'rgba(224,138,138,0.85)' }}>
              {lx(shown, 'delete_account')}
            </button>
          ) : (
            <div style={{ padding: '14px 4px', borderTop: '1px solid rgba(244,240,234,0.08)' }}>
              <p style={{ fontSize: '13px', color: 'rgba(244,240,234,0.65)', marginBottom: '12px', lineHeight: 1.5 }}>
                {lx(shown, 'delete_confirm')}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setConfirmingDelete(false)} disabled={deleting} style={ov.cancelBtn}>
                  {lx(shown, 'delete_cancel')}
                </button>
                <button onClick={handleDelete} disabled={deleting} style={{ ...ov.dangerBtn, opacity: deleting ? 0.6 : 1 }}>
                  {deleting ? lx(shown, 'deleting') : lx(shown, 'delete_yes')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

const ov = {
  backdrop: { position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(7,6,14,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  panel: { width: '100%', maxWidth: '480px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 0 },
  closeBtn: { width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'rgba(244,240,234,0.08)', color: 'rgba(244,240,234,0.7)', fontSize: '15px', cursor: 'pointer' },
  label: { fontSize: '12px', color: 'rgba(244,240,234,0.5)', letterSpacing: '0.5px', marginBottom: '12px' },
  flagGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  flagBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '20px', border: '1px solid', background: 'transparent', cursor: 'pointer', minHeight: '44px' },
  linkRow: { display: 'block', width: '100%', textAlign: 'left', padding: '14px 4px', background: 'none', border: 'none', borderTop: '1px solid rgba(244,240,234,0.08)', color: 'rgba(244,240,234,0.85)', fontSize: '15px', cursor: 'pointer', minHeight: '44px', textDecoration: 'none' },
  cancelBtn: { flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(244,240,234,0.18)', background: 'transparent', color: 'rgba(244,240,234,0.85)', fontSize: '14px', cursor: 'pointer', minHeight: '44px' },
  dangerBtn: { flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(224,138,138,0.4)', background: 'rgba(224,138,138,0.12)', color: 'rgba(244,240,234,0.95)', fontSize: '14px', cursor: 'pointer', minHeight: '44px' },
}
