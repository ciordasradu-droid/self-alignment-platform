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
import { useSoundPref } from '../../lib/soundPref'
import { useUser } from '../../lib/useUser'
import { createSupabaseBrowser } from '../../lib/supabase/client'

// Eticheta comutatorului de sunet (sect. E, 25.07 noapte) — separată de
// obiectul L de mai jos (care are doar en/ro, gol pre-existent) pentru că
// aceasta trece prin poarta lexicală în toate cele 11 limbi.
const SOUND_LABEL = {
  en: 'Water sound', ro: 'Sunetul apei', es: 'Sonido del agua', fr: "Son de l'eau", de: 'Wassergeräusch', it: "Suono dell'acqua", pt: 'Som da água', nl: 'Watergeluid', pl: 'Dźwięk wody', hu: 'Vízhang', ru: 'Звук воды',
}

const L = {
  en: {
    title: 'Settings', language: 'Language', subscription: 'Subscription', logout: 'Log out', close: 'Close',
    privacy: 'Your Privacy',
    recovery_label: 'Add a recovery email', recovery_hint: 'So you never lose access to this account.', recovery_ph: 'you@example.com', recovery_save: 'Save', recovery_saving: 'Saving...', recovery_sent: 'Check your email to confirm it.', recovery_invalid: 'Enter a valid email.',
  },
  ro: {
    title: 'Setări', language: 'Limbă', subscription: 'Abonament', logout: 'Ieși din cont', close: 'Închide',
    privacy: 'Intimitatea Ta',
    recovery_label: 'Adaugă un email de recuperare', recovery_hint: 'Ca să nu pierzi niciodată accesul la acest cont.', recovery_ph: 'tu@exemplu.com', recovery_save: 'Salvează', recovery_saving: 'Se salvează...', recovery_sent: 'Verifică-ți emailul ca să-l confirmi.', recovery_invalid: 'Introdu un email valid.',
  },
  es: { title: 'Ajustes', language: 'Idioma', subscription: 'Suscripción', logout: 'Cerrar sesión', close: 'Cerrar', privacy: 'Tu Privacidad', recovery_label: 'Añade un email de recuperación', recovery_hint: 'Para que nunca pierdas el acceso a esta cuenta.', recovery_ph: 'tu@ejemplo.com', recovery_save: 'Guardar', recovery_saving: 'Guardando...', recovery_sent: 'Revisa tu email para confirmarlo.', recovery_invalid: 'Introduce un email válido.' },
  fr: { title: 'Paramètres', language: 'Langue', subscription: 'Abonnement', logout: 'Se déconnecter', close: 'Fermer', privacy: 'Ta Vie Privée', recovery_label: 'Ajouter un email de récupération', recovery_hint: "Pour ne jamais perdre l'accès à ce compte.", recovery_ph: 'toi@exemple.com', recovery_save: 'Enregistrer', recovery_saving: 'Enregistrement...', recovery_sent: 'Vérifie ton email pour confirmer.', recovery_invalid: 'Entre un email valide.' },
  de: { title: 'Einstellungen', language: 'Sprache', subscription: 'Abonnement', logout: 'Abmelden', close: 'Schließen', privacy: 'Deine Privatsphäre', recovery_label: 'Wiederherstellungs-E-Mail hinzufügen', recovery_hint: 'Damit du nie den Zugriff auf dieses Konto verlierst.', recovery_ph: 'du@beispiel.com', recovery_save: 'Speichern', recovery_saving: 'Wird gespeichert...', recovery_sent: 'Prüfe deine E-Mail zur Bestätigung.', recovery_invalid: 'Gib eine gültige E-Mail ein.' },
  it: { title: 'Impostazioni', language: 'Lingua', subscription: 'Abbonamento', logout: 'Esci', close: 'Chiudi', privacy: 'La Tua Privacy', recovery_label: 'Aggiungi un\'email di recupero', recovery_hint: "Così non perdi mai l'accesso a questo account.", recovery_ph: 'tu@esempio.com', recovery_save: 'Salva', recovery_saving: 'Salvataggio...', recovery_sent: 'Controlla la tua email per confermare.', recovery_invalid: 'Inserisci un\'email valida.' },
  pt: { title: 'Definições', language: 'Idioma', subscription: 'Subscrição', logout: 'Sair', close: 'Fechar', privacy: 'A Tua Privacidade', recovery_label: 'Adiciona um email de recuperação', recovery_hint: 'Para nunca perderes o acesso a esta conta.', recovery_ph: 'tu@exemplo.com', recovery_save: 'Guardar', recovery_saving: 'A guardar...', recovery_sent: 'Verifica o teu email para confirmar.', recovery_invalid: 'Introduz um email válido.' },
  nl: { title: 'Instellingen', language: 'Taal', subscription: 'Abonnement', logout: 'Uitloggen', close: 'Sluiten', privacy: 'Jouw Privacy', recovery_label: 'Voeg een herstel-e-mail toe', recovery_hint: 'Zodat je nooit toegang tot dit account verliest.', recovery_ph: 'jij@voorbeeld.com', recovery_save: 'Opslaan', recovery_saving: 'Opslaan...', recovery_sent: 'Controleer je e-mail om te bevestigen.', recovery_invalid: 'Voer een geldig e-mailadres in.' },
  pl: { title: 'Ustawienia', language: 'Język', subscription: 'Subskrypcja', logout: 'Wyloguj się', close: 'Zamknij', privacy: 'Twoja Prywatność', recovery_label: 'Dodaj email odzyskiwania', recovery_hint: 'Żebyś nigdy nie stracił dostępu do tego konta.', recovery_ph: 'ty@przyklad.com', recovery_save: 'Zapisz', recovery_saving: 'Zapisywanie...', recovery_sent: 'Sprawdź email, aby potwierdzić.', recovery_invalid: 'Wpisz prawidłowy email.' },
  hu: { title: 'Beállítások', language: 'Nyelv', subscription: 'Előfizetés', logout: 'Kijelentkezés', close: 'Bezárás', privacy: 'A Te Adatvédelmed', recovery_label: 'Helyreállítási email hozzáadása', recovery_hint: 'Hogy sose veszítsd el a hozzáférést ehhez a fiókhoz.', recovery_ph: 'te@pelda.com', recovery_save: 'Mentés', recovery_saving: 'Mentés...', recovery_sent: 'Nézd meg az emailed a megerősítéshez.', recovery_invalid: 'Adj meg egy érvényes emailt.' },
  ru: { title: 'Настройки', language: 'Язык', subscription: 'Подписка', logout: 'Выйти', close: 'Закрыть', privacy: 'Твоя Приватность', recovery_label: 'Добавить email для восстановления', recovery_hint: 'Чтобы никогда не потерять доступ к этому аккаунту.', recovery_ph: 'ty@example.com', recovery_save: 'Сохранить', recovery_saving: 'Сохранение...', recovery_sent: 'Проверь почту для подтверждения.', recovery_invalid: 'Введи корректный email.' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

export function SettingsIcon({ onClick, lang = 'en' }) {
  return (
    <button onClick={onClick} aria-label={lx(lang, 'title')} style={{
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
  const [soundOn, setSoundOn] = useSoundPref()
  const { user } = useUser()
  const [loggingOut, setLoggingOut] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryState, setRecoveryState] = useState('idle') // idle | saving | sent | invalid
  useEffect(() => setMounted(true), [])

  if (!open || !mounted) return null

  // T5 (calup arhitectura 30.07) — conturi anonime existente (fara email)
  // pot adauga acum un email de recuperare din Setari, nu doar la generare
  // (O5 il cere deja pentru conturile noi). Acelasi updateUser() ca in O5.
  const needsRecovery = !!user && user.is_anonymous && !user.email

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await createSupabaseBrowser().auth.signOut()
    } catch (e) {}
    // Punctul 3 (audit 26.07): delogarea lasa profilul, acordurile si alte
    // chei intime in localStorage — pe un calculator imprumutat, urmatorul
    // om le citea direct din browser. TOT, nu selectiv (o lista de chei
    // enumerate ar rata mereu ceva, exact ca inainte).
    try { localStorage.clear() } catch (e) {}
    try { sessionStorage.clear() } catch (e) {}
    window.location.href = '/'
  }

  const handleSaveRecovery = async () => {
    const val = recoveryEmail.trim()
    if (!val || !val.includes('@') || !val.includes('.')) { setRecoveryState('invalid'); return }
    setRecoveryState('saving')
    try {
      await createSupabaseBrowser().auth.updateUser({ email: val })
      setRecoveryState('sent')
    } catch (e) {
      setRecoveryState('invalid')
    }
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

          <button
            onClick={() => setSoundOn(!soundOn)}
            style={ov.soundRow}
            aria-pressed={soundOn}
          >
            <span>{SOUND_LABEL[shown] || SOUND_LABEL.en}</span>
            <span style={{ ...ov.soundSwitch, background: soundOn ? 'rgba(229,169,60,0.5)' : 'rgba(244,240,234,0.15)' }}>
              <span style={{ ...ov.soundKnob, transform: soundOn ? 'translateX(16px)' : 'translateX(0)' }} />
            </span>
          </button>

          {needsRecovery && (
            <>
              <div style={{ height: '1px', background: 'rgba(244,240,234,0.1)', margin: '20px 0' }} />
              <p style={ov.label}>{lx(shown, 'recovery_label')}</p>
              {recoveryState === 'sent' ? (
                <p style={{ fontSize: '13px', color: 'rgba(244,240,234,0.65)', lineHeight: 1.5 }}>{lx(shown, 'recovery_sent')}</p>
              ) : (
                <>
                  <p style={{ fontSize: '12.5px', color: 'rgba(244,240,234,0.5)', marginBottom: '10px' }}>{lx(shown, 'recovery_hint')}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => { setRecoveryEmail(e.target.value); setRecoveryState('idle') }}
                      placeholder={lx(shown, 'recovery_ph')}
                      style={ov.recoveryInput}
                    />
                    <button onClick={handleSaveRecovery} disabled={recoveryState === 'saving'} style={{ ...ov.recoveryBtn, opacity: recoveryState === 'saving' ? 0.6 : 1 }}>
                      {recoveryState === 'saving' ? lx(shown, 'recovery_saving') : lx(shown, 'recovery_save')}
                    </button>
                  </div>
                  {recoveryState === 'invalid' && (
                    <p style={{ fontSize: '12px', color: 'rgba(224,138,138,0.85)', marginTop: '6px' }}>{lx(shown, 'recovery_invalid')}</p>
                  )}
                </>
              )}
            </>
          )}

          <div style={{ height: '1px', background: 'rgba(244,240,234,0.1)', margin: '20px 0' }} />

          <a href="/subscribe" style={ov.linkRow}>{lx(shown, 'subscription')}</a>
          <a href="/profile/privacy" style={ov.linkRow}>{lx(shown, 'privacy')}</a>
          <button onClick={handleLogout} disabled={loggingOut} style={{ ...ov.linkRow, opacity: loggingOut ? 0.6 : 1 }}>
            {lx(shown, 'logout')}
          </button>

          {/* sect. H2 (addendum 26.07): marcaj discret de build — ca sa se
              stie mereu prin ce geam se uita cineva inainte de un verdict
              Poarta 1. Nu apare nicaieri altundeva in UI. */}
          {(process.env.NEXT_PUBLIC_BUILD_SHA || process.env.NEXT_PUBLIC_BUILD_DATE) && (
            <p style={ov.buildMark}>
              {process.env.NEXT_PUBLIC_BUILD_SHA || '—'}
              {' · '}
              {process.env.NEXT_PUBLIC_BUILD_DATE ? new Date(process.env.NEXT_PUBLIC_BUILD_DATE).toLocaleString(shown === 'ro' ? 'ro-RO' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
            </p>
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
  soundRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '4px', background: 'none', border: 'none', color: 'rgba(244,240,234,0.85)', fontSize: '15px', cursor: 'pointer', minHeight: '44px' },
  soundSwitch: { width: '36px', height: '20px', borderRadius: '10px', position: 'relative', transition: 'background-color 200ms ease', flexShrink: 0 },
  soundKnob: { position: 'absolute', top: '2px', left: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#f4f0ea', transition: 'transform 200ms ease' },
  buildMark: { textAlign: 'center', fontSize: '11px', color: 'rgba(244,240,234,0.3)', letterSpacing: '0.3px', marginTop: '18px', fontFamily: 'monospace' },
  linkRow: { display: 'block', width: '100%', textAlign: 'left', padding: '14px 4px', background: 'none', border: 'none', borderTop: '1px solid rgba(244,240,234,0.08)', color: 'rgba(244,240,234,0.85)', fontSize: '15px', cursor: 'pointer', minHeight: '44px', textDecoration: 'none' },
  recoveryInput: { flex: 1, minWidth: 0, padding: '11px 14px', minHeight: '44px', borderRadius: '10px', border: '1px solid rgba(244,240,234,0.18)', background: 'rgba(7,6,14,0.4)', color: '#f4f0ea', fontSize: '14px' },
  recoveryBtn: { padding: '11px 18px', minHeight: '44px', flexShrink: 0, borderRadius: '10px', border: '1px solid rgba(229,169,60,0.3)', background: 'transparent', color: '#f0d9b0', fontSize: '14px', cursor: 'pointer' },
}
