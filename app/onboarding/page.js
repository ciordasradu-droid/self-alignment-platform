'use client'

// ONBOARDING — structura decisa (sect. 6, locked):
//   limba (steaguri) -> o fraza de viziune -> datele nasterii -> PUNCT DE PLECARE -> generare
// Curgere pe ACELASI ecran, un moment pe rand, fara interogatorii, fara scale.
// Punctul de plecare se pastreaza (user_metadata + localStorage) — e recitit
// la Angajamentul z60 (momentul-oglinda al produsului).
//
// TODO(faza de texte): formularile marcate [text de lucru] in Prompt Master
// (intrebarea punctului de plecare) se cizeleaza cu Fable dupa implementare.

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { t } from '../../lib/translations'
import { useLanguage, LANGUAGES } from '../../lib/language'
import { createSupabaseBrowser } from '../../lib/supabase/client'
import WaterVideoLayer from '../components/water/WaterVideoLayer'

// Steaguri SVG inline — emoji-urile de steag nu se randeaza pe Windows
// (cad pe coduri de litere), iar spec-ul cere steaguri, nu coduri.
const FLAG_BARS = {
  ro: { dir: 'v', colors: ['#002B7F', '#FCD116', '#CE1126'] },
  fr: { dir: 'v', colors: ['#0055A4', '#FFFFFF', '#EF4135'] },
  it: { dir: 'v', colors: ['#009246', '#FFFFFF', '#CE2B37'] },
  de: { dir: 'h', colors: ['#000000', '#DD0000', '#FFCE00'] },
  nl: { dir: 'h', colors: ['#AE1C28', '#FFFFFF', '#21468B'] },
  hu: { dir: 'h', colors: ['#CE2939', '#FFFFFF', '#477050'] },
  pl: { dir: 'h', colors: ['#FFFFFF', '#DC143C'] },
  es: { dir: 'h', colors: ['#AA151B', '#F1BF00', '#AA151B'] },
  pt: { dir: 'v', colors: ['#046A38', '#DA291C', '#DA291C'] },
}

function Flag({ code }) {
  if (code === 'en') {
    // Union Jack simplificat
    return (
      <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
        <rect width="22" height="16" rx="2" fill="#012169" />
        <path d="M0 0 L22 16 M22 0 L0 16" stroke="#FFFFFF" strokeWidth="3" />
        <path d="M11 0 V16 M0 8 H22" stroke="#FFFFFF" strokeWidth="5.5" />
        <path d="M11 0 V16 M0 8 H22" stroke="#C8102E" strokeWidth="3" />
      </svg>
    )
  }
  const f = FLAG_BARS[code]
  if (!f) return null
  const n = f.colors.length
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
      <clipPath id={`fc-${code}`}><rect width="22" height="16" rx="2" /></clipPath>
      <g clipPath={`url(#fc-${code})`}>
        {f.colors.map((c, i) => f.dir === 'v'
          ? <rect key={i} x={(22 / n) * i} y="0" width={22 / n + 0.5} height="16" fill={c} />
          : <rect key={i} x="0" y={(16 / n) * i} width="22" height={16 / n + 0.5} fill={c} />)}
      </g>
      <rect width="22" height="16" rx="2" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
    </svg>
  )
}

// Textele noi ale onboarding-ului, in toate limbile (Regula de Voce).
const TX = {
  your_language: {
    en: 'Your language', ro: 'Limba ta', es: 'Tu idioma', fr: 'Ta langue',
    de: 'Deine Sprache', it: 'La tua lingua', pt: 'A tua língua',
    nl: 'Jouw taal', pl: 'Twój język', hu: 'A nyelved',
  },
  // Fraza de viziune — propozitia-mama a produsului (sect. 2, locked).
  vision: {
    en: "Life isn't about manifesting. It's about aligning with yourself.",
    ro: 'Viața nu e despre a manifesta, e despre a te alinia cu tine însuți.',
    es: 'La vida no va de manifestar. Va de alinearte contigo.',
    fr: "La vie, ce n'est pas manifester. C'est t'aligner avec toi-même.",
    de: 'Im Leben geht es nicht ums Manifestieren, sondern darum, mit dir selbst im Einklang zu sein.',
    it: 'La vita non è manifestare. È allinearti con te stesso.',
    pt: 'A vida não é sobre manifestar. É sobre alinhares-te contigo.',
    nl: 'Het leven draait niet om manifesteren, maar om in lijn komen met jezelf.',
    pl: 'Życie nie polega na manifestowaniu. Polega na dostrojeniu się do siebie.',
    hu: 'Az élet nem a manifesztálásról szól, hanem arról, hogy összhangba kerülj önmagaddal.',
  },
  continue: {
    en: 'Continue', ro: 'Continuă', es: 'Continuar', fr: 'Continuer', de: 'Weiter',
    it: 'Continua', pt: 'Continuar', nl: 'Verder', pl: 'Dalej', hu: 'Tovább',
  },
  back: {
    en: 'back', ro: 'înapoi', es: 'atrás', fr: 'retour', de: 'zurück',
    it: 'indietro', pt: 'voltar', nl: 'terug', pl: 'wstecz', hu: 'vissza',
  },
  birth_title: {
    en: 'Where it all began', ro: 'De unde pornește totul', es: 'Donde empieza todo',
    fr: 'Là où tout commence', de: 'Wo alles beginnt', it: 'Da dove parte tutto',
    pt: 'Onde tudo começa', nl: 'Waar het allemaal begint', pl: 'Skąd wszystko się zaczyna',
    hu: 'Ahonnan minden indul',
  },
  // PUNCT DE PLECARE [text de lucru] — hraneste Angajamentul z60.
  start_q: {
    en: 'What do you wish were different in your life?',
    ro: 'Ce îți dorești să fie diferit în viața ta?',
    es: '¿Qué te gustaría que fuera diferente en tu vida?',
    fr: "Qu'aimerais-tu voir changer dans ta vie ?",
    de: 'Was wünschst du dir anders in deinem Leben?',
    it: 'Cosa vorresti che fosse diverso nella tua vita?',
    pt: 'O que gostavas que fosse diferente na tua vida?',
    nl: 'Wat zou je anders willen in je leven?',
    pl: 'Co chcesz, aby było inne w twoim życiu?',
    hu: 'Mit szeretnél, hogy más legyen az életedben?',
  },
  // Transparenta (principiul 9) + orizont vizibil (principiul 5).
  start_hint: {
    en: "Your answer stays yours. You'll read it again in 60 days.",
    ro: 'Răspunsul rămâne al tău. Îl vei reciti peste 60 de zile.',
    es: 'Tu respuesta es tuya. La volverás a leer dentro de 60 días.',
    fr: 'Ta réponse reste la tienne. Tu la reliras dans 60 jours.',
    de: 'Deine Antwort gehört dir. In 60 Tagen liest du sie wieder.',
    it: 'La tua risposta resta tua. La rileggerai tra 60 giorni.',
    pt: 'A tua resposta é tua. Vais relê-la daqui a 60 dias.',
    nl: 'Je antwoord blijft van jou. Over 60 dagen lees je het terug.',
    pl: 'Twoja odpowiedź należy do ciebie. Przeczytasz ją ponownie za 60 dni.',
    hu: 'A válaszod a tiéd marad. 60 nap múlva újra elolvasod.',
  },
  generate: {
    en: 'Create my profile', ro: 'Creează-mi profilul', es: 'Crear mi perfil',
    fr: 'Créer mon profil', de: 'Mein Profil erstellen', it: 'Crea il mio profilo',
    pt: 'Criar o meu perfil', nl: 'Maak mijn profiel', pl: 'Stwórz mój profil',
    hu: 'Profilom elkészítése',
  },
  ready_note: {
    en: 'Ready in 2–3 minutes. Once, for good.',
    ro: 'Gata în 2–3 minute. O singură dată, pentru totdeauna.',
    es: 'Listo en 2–3 minutos. Una sola vez, para siempre.',
    fr: 'Prêt en 2–3 minutes. Une seule fois, pour de bon.',
    de: 'Fertig in 2–3 Minuten. Einmal, für immer.',
    it: 'Pronto in 2–3 minuti. Una volta sola, per sempre.',
    pt: 'Pronto em 2–3 minutos. Uma só vez, para sempre.',
    nl: 'Klaar in 2–3 minuten. Eén keer, voorgoed.',
    pl: 'Gotowy w 2–3 minuty. Raz, na zawsze.',
    hu: 'Kész 2–3 perc alatt. Egyszer, örökre.',
  },
}
const tx = (lang, key) => TX[key][lang] || TX[key].en

export default function Onboarding() {
  const router = useRouter()
  const [lang, changeLanguage] = useLanguage()
  const [step, setStep] = useState(0)      // 0 limba · 1 viziunea · 2 nasterea · 3 punctul de plecare
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false) // validarea vorbeste doar dupa prima incercare

  const [formData, setFormData] = useState({
    full_name: '', date_of_birth: '', time_of_birth: '',
    city: '', lat: '', lng: '', language: 'en',
  })
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [startingPoint, setStartingPoint] = useState('')

  const [cityValue, setCityValue] = useState('')
  const [citySuggestions, setCitySuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    setFormData(prev => ({ ...prev, language: lang }))
  }, [lang])

  useEffect(() => {
    if (day && month && year && year.length === 4) {
      setFormData(prev => ({
        ...prev,
        date_of_birth: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
      }))
    }
  }, [day, month, year])

  const pickLanguage = (code) => {
    changeLanguage(code)
    setMonth('')
    setStep(1)
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
    setCityValue(place.display_name)
    setFormData(prev => ({ ...prev, city: place.display_name, lat: place.lat, lng: place.lon }))
    setCitySuggestions([])
    setShowSuggestions(false)
  }

  const birthMissing = () => {
    if (!day || !month || !year || year.length !== 4) return t(lang, 'date_error')
    if (!formData.time_of_birth) return t(lang, 'time_error')
    if (!formData.city) return t(lang, 'city_error')
    return null
  }

  const nextFromBirth = () => {
    setTouched(true)
    if (birthMissing()) return
    setTouched(false)
    setStep(3)
  }

  const handleGenerate = async () => {
    setLoading(true)
    // Punctul de plecare se pastreaza pentru Angajamentul z60 — in contul
    // userului (user_metadata, fara migrare de schema) + local ca plasa.
    const text = startingPoint.trim()
    try {
      localStorage.setItem('starting_point', JSON.stringify({
        text, language: lang, saved_at: new Date().toISOString(),
      }))
    } catch (e) {}
    try {
      const supabase = createSupabaseBrowser()
      await supabase.auth.updateUser({
        data: { starting_point: text, starting_point_at: new Date().toISOString() },
      })
    } catch (e) {
      console.warn('starting_point metadata save failed (non-fatal):', e?.message)
    }
    const encoded = encodeURIComponent(JSON.stringify({ ...formData, language: lang }))
    router.push(`/generating?data=${encoded}`)
  }

  const months = t(lang, 'months')
  const missing = touched ? birthMissing() : null

  return (
    <>
      <WaterVideoLayer src="/ocean.mp4" poster="/ocean-poster.jpg" />
      <main className="ob">

        {step > 0 && (
          <button className="ob-back" onClick={() => { setTouched(false); setStep(step - 1) }}>
            ← {tx(lang, 'back')}
          </button>
        )}

        {/* 0 — LIMBA (steaguri; decizie sect. 6/9) */}
        {step === 0 && (
          <section className="ob-card ob-enter" key="s0">
            <h1 className="ob-title">{tx(lang, 'your_language')}</h1>
            <div className="ob-flags">
              {LANGUAGES.map(l => (
                <button key={l.code} className="ob-flag" onClick={() => pickLanguage(l.code)}>
                  <Flag code={l.code} />
                  <span className="ob-flag-name">{l.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 1 — FRAZA DE VIZIUNE */}
        {step === 1 && (
          <section className="ob-card ob-enter ob-center" key="s1">
            <p className="ob-vision">{tx(lang, 'vision')}</p>
            <button className="ob-cta" onClick={() => setStep(2)}>{tx(lang, 'continue')}</button>
          </section>
        )}

        {/* 2 — DATELE NASTERII */}
        {step === 2 && (
          <section className="ob-card ob-enter" key="s2">
            <h1 className="ob-title">{tx(lang, 'birth_title')}</h1>

            <div className="ob-field">
              <label className="ob-label">{t(lang, 'full_name')}</label>
              <input type="text" className="input-clean" value={formData.full_name}
                     placeholder={t(lang, 'full_name_placeholder')}
                     onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))} />
            </div>

            <div className="ob-field">
              <label className="ob-label">{t(lang, 'date_of_birth')}</label>
              <div className="ob-daterow">
                <input type="number" inputMode="numeric" placeholder="DD" min="1" max="31"
                       className="input-clean ob-datepart" value={day} onChange={e => setDay(e.target.value)} />
                <select className="input-clean select-clean ob-datemonth" value={month}
                        onChange={e => setMonth(e.target.value)}>
                  <option value="">—</option>
                  {months.map((m, i) => <option key={i} value={String(i + 1)}>{m}</option>)}
                </select>
                <input type="number" inputMode="numeric" placeholder="YYYY" min="1900" max="2020"
                       className="input-clean ob-dateyear" value={year} onChange={e => setYear(e.target.value)} />
              </div>
            </div>

            <div className="ob-field">
              <label className="ob-label">{t(lang, 'time_of_birth')}</label>
              <input type="time" className="input-clean" value={formData.time_of_birth}
                     onChange={e => setFormData(prev => ({ ...prev, time_of_birth: e.target.value }))} />
              <p className="ob-hint">{t(lang, 'time_hint')}</p>
            </div>

            <div className="ob-field ob-cityfield">
              <label className="ob-label">{t(lang, 'city_of_birth')}</label>
              <input type="text" className="input-clean" value={cityValue} autoComplete="off"
                     placeholder={t(lang, 'city_placeholder')}
                     onChange={handleCityInput}
                     onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} />
              {showSuggestions && citySuggestions.length > 0 && (
                <div className="ob-suggestions">
                  {citySuggestions.map((place, i) => (
                    <div key={i} className="ob-suggestion" onMouseDown={() => handleCitySelect(place)}>
                      {place.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {missing && <p className="ob-missing">{missing}</p>}
            <button className="ob-cta" onClick={nextFromBirth}>{tx(lang, 'continue')}</button>
          </section>
        )}

        {/* 3 — PUNCTUL DE PLECARE [text de lucru] */}
        {step === 3 && (
          <section className="ob-card ob-enter" key="s3">
            <h1 className="ob-title ob-title-q">{tx(lang, 'start_q')}</h1>
            <textarea
              className="input-clean ob-textarea"
              rows={4}
              value={startingPoint}
              onChange={e => setStartingPoint(e.target.value)}
            />
            <p className="ob-hint">{tx(lang, 'start_hint')}</p>
            <button className="ob-cta" onClick={handleGenerate} disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? t(lang, 'generating_btn') : tx(lang, 'generate')}
            </button>
            <p className="ob-ready">{tx(lang, 'ready_note')}</p>
          </section>
        )}

        {/* orizontul pasilor — puncte de lumina, fara cifre */}
        <div className="ob-dots" aria-hidden="true">
          {[0, 1, 2, 3].map(i => (
            <span key={i} className={`ob-dot${i === step ? ' on' : ''}`} />
          ))}
        </div>
      </main>

      <style jsx>{`
        .ob {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: calc(24px + env(safe-area-inset-top)) 20px calc(56px + env(safe-area-inset-bottom));
        }
        .ob-back {
          position: absolute;
          top: calc(16px + env(safe-area-inset-top));
          left: 16px;
          background: none;
          border: none;
          color: rgba(244, 240, 234, 0.6);
          font-size: 14px;
          padding: 10px 12px;
          min-height: 44px;
          cursor: pointer;
        }
        .ob-card {
          width: 100%;
          max-width: 440px;
          padding: 28px 24px;
          border-radius: 22px;
          background: rgba(10, 9, 21, 0.45);
          border: 1px solid rgba(229, 169, 60, 0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .ob-center { text-align: center; }
        .ob-enter { animation: ob-in 420ms cubic-bezier(0.22, 0.7, 0.35, 1) both; }
        @keyframes ob-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ob-title {
          margin: 0 0 20px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 27px;
          color: #f4f0ea;
          text-align: center;
        }
        .ob-title-q { font-size: 24px; line-height: 1.35; }
        .ob-vision {
          margin: 8px 0 26px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 24px;
          line-height: 1.45;
          color: #f4f0ea;
        }
        .ob-flags {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .ob-flag {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 48px;
          padding: 10px 14px;
          border-radius: 24px;
          border: 1px solid rgba(244, 240, 234, 0.22);
          background: transparent;
          color: rgba(244, 240, 234, 0.88);
          font-size: 14.5px;
          cursor: pointer;
          text-align: left;
        }
        .ob-flag:hover { border-color: rgba(229, 169, 60, 0.5); }
        .ob-flag :global(svg) { flex-shrink: 0; }
        .ob-field { margin-bottom: 18px; }
        .ob-cityfield { position: relative; }
        .ob-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          color: rgba(244, 240, 234, 0.72);
        }
        .ob-daterow { display: flex; gap: 8px; }
        /* padding-ul lateral standard (18px) taia cifrele — DD si YYYY au nevoie de loc */
        .ob-datepart { flex: 1; min-width: 56px; text-align: center; padding-left: 8px; padding-right: 8px; }
        .ob-datemonth { flex: 2; }
        .ob-dateyear { flex: 1.2; min-width: 84px; text-align: center; padding-left: 8px; padding-right: 8px; }
        .ob-hint {
          margin: 8px 0 0;
          font-size: 12.5px;
          color: rgba(244, 240, 234, 0.55);
        }
        .ob-suggestions {
          position: absolute;
          top: 100%;
          left: 0; right: 0;
          margin-top: 4px;
          border-radius: 14px;
          background: rgba(10, 9, 21, 0.92);
          border: 1px solid rgba(229, 169, 60, 0.2);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 20;
          max-height: 220px;
          overflow-y: auto;
        }
        .ob-suggestion {
          padding: 12px 16px;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(244, 240, 234, 0.85);
          cursor: pointer;
          border-bottom: 1px solid rgba(244, 240, 234, 0.08);
        }
        .ob-suggestion:last-child { border-bottom: none; }
        .ob-missing {
          margin: 0 0 14px;
          font-size: 13px;
          text-align: center;
          color: rgba(244, 240, 234, 0.75);
        }
        .ob-textarea {
          resize: none;
          font-family: inherit;
          line-height: 1.6;
        }
        /* UN singur CTA plin auriu per ecran (sect. 4.2). */
        .ob-cta {
          display: block;
          width: 100%;
          margin-top: 20px;
          min-height: 48px;
          padding: 13px 24px;
          border: none;
          border-radius: 26px;
          background: #e5a93c;
          color: #170f22;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
        }
        .ob-ready {
          margin: 14px 0 0;
          text-align: center;
          font-size: 12.5px;
          color: rgba(244, 240, 234, 0.55);
        }
        .ob-dots {
          position: absolute;
          bottom: calc(20px + env(safe-area-inset-bottom));
          display: flex;
          gap: 10px;
        }
        .ob-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(244, 240, 234, 0.25);
          transition: background 300ms ease, box-shadow 300ms ease;
        }
        .ob-dot.on {
          background: #e5a93c;
          box-shadow: 0 0 10px rgba(229, 169, 60, 0.55);
        }
      `}</style>
    </>
  )
}
