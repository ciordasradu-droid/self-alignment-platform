'use client'

// Magic-link login. User enters email → receives a link → clicks it → logged in.
// No password. The link lands on /auth/callback which creates the session.

import { useState, Suspense, useEffect } from 'react'
import WaterLoader from '../components/water/WaterLoader'
import { useSearchParams } from 'next/navigation'
import { createSupabaseBrowser } from '../../lib/supabase/client'
import { useLanguage } from '../../lib/language'

const L = {
  en: { tag:'Sign in', title:'Enter with your email', sub:'We send you a link. One tap and you are in — no password to remember.', ph:'your@email.com', btn:'Send me the link', sending:'Sending...', sent_title:'Check your inbox', sent_sub:'We sent a link to', sent_hint:'Tap it to enter. You can close this tab.', err:'Something went wrong. Try again.', invalid:'Please enter a valid email.', err_rate:'Quite a few links went out already. Try again in a few minutes.', err_link:'That link did not work. Ask for a new one.' },
  ro: { tag:'Intră', title:'Intră cu emailul tău', sub:'Îți trimitem un link. Un tap și ești înăuntru — fără parolă de ținut minte.', ph:'email@exemplu.com', btn:'Trimite-mi linkul', sending:'Se trimite...', sent_title:'Verifică-ți emailul', sent_sub:'Am trimis un link către', sent_hint:'Apasă-l ca să intri. Poți închide fila asta.', err:'Ceva n-a mers. Încearcă din nou.', invalid:'Scrie un email valid.', err_rate:'Am trimis deja cateva linkuri. Mai incearca peste cateva minute.', err_link:'Linkul nu a mers. Cere unul nou.' },
  es: { tag:'Entrar', title:'Entra con tu email', sub:'Te enviamos un enlace. Un toque y estás dentro — sin contraseña.', ph:'tu@email.com', btn:'Enviarme el enlace', sending:'Enviando...', sent_title:'Revisa tu bandeja', sent_sub:'Enviamos un enlace a', sent_hint:'Tócalo para entrar. Puedes cerrar esta pestaña.', err:'Algo salió mal. Inténtalo de nuevo.', invalid:'Escribe un email válido.', err_rate:'Ya salieron varios enlaces. Intenta de nuevo en unos minutos.', err_link:'Ese enlace no funciono. Pide uno nuevo.' },
  fr: { tag:'Entrer', title:'Entre avec ton email', sub:'On t envoie un lien. Un clic et tu es connecté — sans mot de passe.', ph:'ton@email.com', btn:'Envoie-moi le lien', sending:'Envoi...', sent_title:'Vérifie ta boîte mail', sent_sub:'Nous avons envoyé un lien à', sent_hint:'Clique dessus pour entrer. Tu peux fermer cet onglet.', err:'Une erreur est survenue. Réessaie.', invalid:'Entre un email valide.', err_rate:'Plusieurs liens sont deja partis. Reessaie dans quelques minutes.', err_link:'Ce lien n a pas fonctionne. Demandes-en un nouveau.' },
  de: { tag:'Anmelden', title:'Mit deiner E-Mail anmelden', sub:'Wir senden dir einen Link. Ein Tipp und du bist drin — ohne Passwort.', ph:'deine@email.com', btn:'Link senden', sending:'Senden...', sent_title:'Sieh in dein Postfach', sent_sub:'Wir haben einen Link gesendet an', sent_hint:'Tippe darauf, um dich anzumelden. Du kannst diesen Tab schließen.', err:'Etwas ist schiefgelaufen. Versuch es erneut.', invalid:'Bitte gib eine gültige E-Mail ein.', err_rate:'Es wurden schon einige Links gesendet. Versuch es in ein paar Minuten.', err_link:'Dieser Link hat nicht funktioniert. Fordere einen neuen an.' },
  it: { tag:'Accedi', title:'Entra con la tua email', sub:'Ti inviamo un link. Un tocco e sei dentro — senza password.', ph:'tua@email.com', btn:'Inviami il link', sending:'Invio...', sent_title:'Controlla la tua email', sent_sub:'Abbiamo inviato un link a', sent_hint:'Toccalo per entrare. Puoi chiudere questa scheda.', err:'Qualcosa è andato storto. Riprova.', invalid:'Inserisci un email valida.', err_rate:'Sono gia partiti diversi link. Riprova tra qualche minuto.', err_link:'Quel link non ha funzionato. Chiedine uno nuovo.' },
  pt: { tag:'Entrar', title:'Entra com o teu email', sub:'Enviamos-te um link. Um toque e estás dentro — sem palavra-passe.', ph:'teu@email.com', btn:'Enviar-me o link', sending:'A enviar...', sent_title:'Verifica o teu email', sent_sub:'Enviámos um link para', sent_hint:'Toca nele para entrar. Podes fechar este separador.', err:'Algo correu mal. Tenta de novo.', invalid:'Escreve um email válido.', err_rate:'Ja sairam varios links. Tenta de novo daqui a uns minutos.', err_link:'Esse link nao funcionou. Pede um novo.' },
  nl: { tag:'Inloggen', title:'Log in met je e-mail', sub:'We sturen je een link. Eén tik en je bent binnen — geen wachtwoord.', ph:'jouw@email.com', btn:'Stuur me de link', sending:'Versturen...', sent_title:'Check je inbox', sent_sub:'We hebben een link gestuurd naar', sent_hint:'Tik erop om in te loggen. Je kunt dit tabblad sluiten.', err:'Er ging iets mis. Probeer opnieuw.', invalid:'Voer een geldig e-mailadres in.', err_rate:'Er zijn al flink wat links verstuurd. Probeer over een paar minuten.', err_link:'Die link werkte niet. Vraag een nieuwe aan.' },
  pl: { tag:'Zaloguj', title:'Wejdź przez email', sub:'Wysyłamy ci link. Jedno kliknięcie i jesteś w środku — bez hasła.', ph:'twoj@email.com', btn:'Wyślij mi link', sending:'Wysyłanie...', sent_title:'Sprawdź skrzynkę', sent_sub:'Wysłaliśmy link na', sent_hint:'Kliknij, aby wejść. Możesz zamknąć tę kartę.', err:'Coś poszło nie tak. Spróbuj ponownie.', invalid:'Wpisz poprawny email.', err_rate:'Wyslano juz kilka linkow. Sprobuj za kilka minut.', err_link:'Ten link nie zadzialal. Popros o nowy.' },
  hu: { tag:'Belépés', title:'Lépj be az emaileddel', sub:'Küldünk egy linket. Egy koppintás és bent vagy — jelszó nélkül.', ph:'te@email.com', btn:'Küldd el a linket', sending:'Küldés...', sent_title:'Nézd meg a postaládád', sent_sub:'Küldtünk egy linket ide:', sent_hint:'Koppints rá a belépéshez. Ezt a lapot bezárhatod.', err:'Valami elromlott. Próbáld újra.', invalid:'Adj meg egy érvényes emailt.', err_rate:'Mar tobb link is kiment. Probald ujra par perc mulva.', err_link:'Ez a link nem mukodott. Kerj egy ujat.' },
}
function lx(lang, k) { return (L[lang] || L.en)[k] }

function LoginInner() {
  const [lang] = useLanguage()
  const params = useSearchParams()
  const next = params.get('next') || '/dashboard'
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | invalid | error | rate | link
  const t = (k) => lx(lang, k)

  // dacă linkul a eșuat, /auth/callback ne trimite înapoi cu ?error=...
  useEffect(() => {
    if (params.get('error')) setStatus('link')
  }, [params])

  const handleSend = async () => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('invalid')
      return
    }
    setStatus('sending')
    const supabase = createSupabaseBrowser()
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })
    if (!error) { setStatus('sent'); return }

    // Nu ascunde motivul: limita de emailuri e cel mai frecvent caz și e
    // temporară — userul trebuie să știe că e de așteptat, nu de reparat.
    console.error('[login]', error.status, error.code, error.message)
    setStatus(error.status === 429 || error.code === 'over_email_send_rate_limit' ? 'rate' : 'error')
  }

  const errText = status === 'rate' ? t('err_rate')
    : status === 'link' ? t('err_link')
    : status === 'error' ? t('err')
    : status === 'invalid' ? t('invalid')
    : null

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>
        <div style={s.card} className="glass anim-fade-in">
          {status === 'sent' ? (
            <>
              {/* confirmarea e o undă pe apă, nu un simbol abstract */}
              <div style={{ marginBottom: '10px' }}><WaterLoader /></div>
              <h1 style={s.title}>{t('sent_title')}</h1>
              <p style={s.sub}>{t('sent_sub')} <strong style={{ color:'var(--text)' }}>{email.trim()}</strong></p>
              <p style={s.hint}>{t('sent_hint')}</p>
            </>
          ) : (
            <>
              <span className="tag tag-purple" style={{ marginBottom:'16px', display:'inline-block' }}>{t('tag')}</span>
              <h1 style={s.title}>{t('title')}</h1>
              <p style={s.sub}>{t('sub')}</p>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errText) setStatus('idle') }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
                placeholder={t('ph')}
                className="input-clean"
                autoComplete="email"
                style={{ marginBottom:'8px' }}
              />
              {errText && <p style={s.errText}>{errText}</p>}
              <button
                onClick={handleSend}
                disabled={status === 'sending'}
                style={{ ...s.btn, opacity: status === 'sending' ? 0.6 : 1, cursor: status === 'sending' ? 'wait' : 'pointer' }}
              >
                {status === 'sending' ? t('sending') : t('btn')}
              </button>
            </>
          )}
        </div>
      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'460px', margin:'0 auto', padding:'clamp(60px,14vh,140px) 24px 80px' },
  card: { padding:'36px 28px', textAlign:'center' },
  icon: { fontSize:'40px', marginBottom:'16px', color:'var(--purple)' },
  title: { fontSize:'clamp(26px,6vw,34px)', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1.2, marginBottom:'12px' },
  sub: { fontSize:'15px', color:'var(--text-muted)', lineHeight:1.6, marginBottom:'24px' },
  hint: { fontSize:'13px', color:'var(--text-light)', lineHeight:1.6, marginTop:'6px' },
  btn: { width:'100%', padding:'15px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'16px', fontWeight:'600', boxShadow:'0 4px 20px var(--gold-faint)', marginTop:'8px' },
  errText: { fontSize:'13px', color:'#c0392b', textAlign:'left', marginBottom:'8px' },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main style={{ padding:'120px 24px' }}><WaterLoader /></main>}>
      <LoginInner />
    </Suspense>
  )
}
