'use client'

// T3 (calup arhitectura 30.07) — REORDONARE: fluxul vechi cerea datele
// celeilalte persoane INAINTE de a mentiona ca genereaza compatibilitate cu
// vreun cost. Ordine noua: (1) ce este, (2) costul (€8, aratat aici, inainte
// de orice date), (3) abia apoi datele tale (precompletate) + datele
// celeilalte persoane + tipul relatiei. Plata reala se declanseaza la
// generare (dupa ce toate datele sunt stranse) — vezi /api/compatibility/checkout
// si poarta din /api/compatibility (paid_session_id, verificat direct la Stripe).

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../lib/language'
import { t } from '../../lib/translations'

const TYPES = [
  { key: 'life',     icon: '♥', en: 'Life partner', ro: 'Partener de viață', es: 'Pareja de vida', fr: 'Partenaire de vie', de: 'Lebenspartner', it: 'Partner di vita', pt: 'Parceiro de vida', nl: 'Levenspartner', pl: 'Partner życiowy', hu: 'Élettárs', ru: 'Партнёр по жизни' },
  { key: 'friend',   icon: '◎', en: 'Friend', ro: 'Prieten', es: 'Amigo', fr: 'Ami', de: 'Freund', it: 'Amico', pt: 'Amigo', nl: 'Vriend', pl: 'Przyjaciel', hu: 'Barát', ru: 'Друг' },
  { key: 'business', icon: '▲', en: 'Business partner', ro: 'Partener de afaceri', es: 'Socio de negocios', fr: "Partenaire d'affaires", de: 'Geschäftspartner', it: "Partner d'affari", pt: 'Sócio de negócios', nl: 'Zakenpartner', pl: 'Partner biznesowy', hu: 'Üzleti partner', ru: 'Деловой партнёр' },
]

const L = {
  en: {
    tag: 'Compatibility', back: '← Back',
    about_title: 'What this is', about_body: 'A reading of how you and someone else actually work together — where you flow, and where you pull in different directions. Written from both your charts, not from a quiz.',
    about_cta: 'Continue',
    price_title: 'The cost', price_body: 'A compatibility reading is €8, one time, for this one pairing. You will pay once you have entered both sets of details, right before it is written.',
    price_cta: 'Continue',
    step_type: 'What relationship do you want to understand?', step_type_sub: 'Each type looks at something different between the two of you.',
    you: 'You', them: 'The other person', your_data: 'Your details', your_data_sub: 'From your profile — just confirm.',
    their_data: 'Their details', their_data_sub: 'Name, date, time and place of birth.',
    name: 'Full name', date: 'Date of birth', time: 'Time of birth', city: 'City of birth',
    city_ph: 'Start typing the city...', generate: 'See the relationship profile — €8', next: 'Continue', redirecting: 'Redirecting to payment...',
    no_profile_text: 'You need your own profile first — compatibility reads from it.', no_profile_link: 'Get your profile',
    error_generic: 'Something went wrong. Try again.',
    your_data_sub_edit: 'Your details, so we can read the relationship correctly.',
    confirm_correct: 'Correct', confirm_edit: 'Edit',
  },
  ro: {
    tag: 'Compatibilitate', back: '← Înapoi',
    about_title: 'Ce este', about_body: 'O citire a felului în care tu și cineva chiar funcționați împreună — unde curgeți la fel, și unde trageți în direcții diferite. Scrisă din hărțile amândurora, nu dintr-un test.',
    about_cta: 'Continuă',
    price_title: 'Costul', price_body: 'O citire de compatibilitate costă €8, o singură dată, pentru această pereche. Plătești după ce ai completat datele amândurora, chiar înainte să fie scrisă.',
    price_cta: 'Continuă',
    step_type: 'Ce relație vrei să înțelegi?', step_type_sub: 'Fiecare tip privește altceva între voi doi.',
    you: 'Tu', them: 'Cealaltă persoană', your_data: 'Datele tale', your_data_sub: 'Din profilul tău — doar confirmă.',
    their_data: 'Datele celuilalt', their_data_sub: 'Nume, dată, oră și loc al nașterii.',
    name: 'Nume complet', date: 'Data nașterii', time: 'Ora nașterii', city: 'Orașul nașterii',
    city_ph: 'Începe să scrii orașul...', generate: 'Vezi profilul relației — €8', next: 'Continui', redirecting: 'Te trimitem la plată...',
    no_profile_text: 'Ai nevoie de propriul profil mai întâi — compatibilitatea citește din el.', no_profile_link: 'Ia-ți profilul',
    error_generic: 'Ceva n-a mers. Încearcă din nou.',
    your_data_sub_edit: 'Datele tale, ca să putem citi relația corect.',
    confirm_correct: 'Corect', confirm_edit: 'Modifică',
  },
  es: {
    tag: 'Compatibilidad', back: '← Atrás',
    about_title: 'Qué es esto', about_body: 'Una lectura de cómo tú y otra persona realmente funcionáis juntos — dónde fluís igual, y dónde tiráis en direcciones distintas. Escrita a partir de ambas cartas, no de un test.',
    about_cta: 'Continuar',
    price_title: 'El costo', price_body: 'Una lectura de compatibilidad cuesta 8 €, una sola vez, para esta pareja. Pagas después de introducir los datos de ambos, justo antes de que se escriba.',
    price_cta: 'Continuar',
    step_type: '¿Qué relación quieres entender?', step_type_sub: 'Cada tipo mira algo distinto entre los dos.',
    you: 'Tú', them: 'La otra persona', your_data: 'Tus datos', your_data_sub: 'De tu perfil — solo confirma.',
    their_data: 'Sus datos', their_data_sub: 'Nombre, fecha, hora y lugar de nacimiento.',
    name: 'Nombre completo', date: 'Fecha de nacimiento', time: 'Hora de nacimiento', city: 'Ciudad de nacimiento',
    city_ph: 'Empieza a escribir la ciudad...', generate: 'Ver el perfil de la relación — 8 €', next: 'Continuar', redirecting: 'Te llevamos al pago...',
    no_profile_text: 'Primero necesitas tu propio perfil — la compatibilidad lee de él.', no_profile_link: 'Obtén tu perfil',
    error_generic: 'Algo falló. Inténtalo de nuevo.',
    your_data_sub_edit: 'Tus datos, para poder leer la relación correctamente.',
    confirm_correct: 'Correcto', confirm_edit: 'Editar',
  },
  fr: {
    tag: 'Compatibilité', back: '← Retour',
    about_title: "Ce que c'est", about_body: "Une lecture de la façon dont toi et quelqu'un d'autre fonctionnez vraiment ensemble — où vous coulez pareil, et où vous tirez dans des directions différentes. Écrite à partir des deux thèmes, pas d'un test.",
    about_cta: 'Continuer',
    price_title: 'Le coût', price_body: "Une lecture de compatibilité coûte 8 €, une seule fois, pour ce duo. Tu payes une fois les deux jeux de données saisis, juste avant qu'elle soit écrite.",
    price_cta: 'Continuer',
    step_type: 'Quelle relation veux-tu comprendre ?', step_type_sub: 'Chaque type regarde quelque chose de différent entre vous deux.',
    you: 'Toi', them: "L'autre personne", your_data: 'Tes informations', your_data_sub: 'Depuis ton profil — confirme simplement.',
    their_data: 'Ses informations', their_data_sub: 'Nom, date, heure et lieu de naissance.',
    name: 'Nom complet', date: 'Date de naissance', time: 'Heure de naissance', city: 'Ville de naissance',
    city_ph: 'Commence à taper la ville...', generate: 'Voir le profil de la relation — 8 €', next: 'Continuer', redirecting: 'Redirection vers le paiement...',
    no_profile_text: "Tu as besoin de ton propre profil d'abord — la compatibilité s'en inspire.", no_profile_link: 'Obtenir ton profil',
    error_generic: "Quelque chose s'est mal passé. Réessaie.",
    your_data_sub_edit: 'Tes informations, pour que nous puissions lire la relation correctement.',
    confirm_correct: 'Correct', confirm_edit: 'Modifier',
  },
  de: {
    tag: 'Kompatibilität', back: '← Zurück',
    about_title: 'Was das ist', about_body: 'Eine Lesung, wie du und jemand anderes wirklich zusammen funktioniert — wo ihr im selben Fluss seid, und wo ihr in verschiedene Richtungen zieht. Geschrieben aus beiden Chart, nicht aus einem Quiz.',
    about_cta: 'Weiter',
    price_title: 'Die Kosten', price_body: 'Eine Kompatibilitäts-Lesung kostet einmalig 8 €, für dieses eine Paar. Du zahlst, sobald beide Angaben eingetragen sind, direkt bevor sie geschrieben wird.',
    price_cta: 'Weiter',
    step_type: 'Welche Beziehung willst du verstehen?', step_type_sub: 'Jeder Typ betrachtet etwas anderes zwischen euch beiden.',
    you: 'Du', them: 'Die andere Person', your_data: 'Deine Angaben', your_data_sub: 'Aus deinem Profil — einfach bestätigen.',
    their_data: 'Ihre Angaben', their_data_sub: 'Name, Datum, Uhrzeit und Ort der Geburt.',
    name: 'Vollständiger Name', date: 'Geburtsdatum', time: 'Geburtszeit', city: 'Geburtsort',
    city_ph: 'Stadt eingeben...', generate: 'Beziehungsprofil ansehen — 8 €', next: 'Weiter', redirecting: 'Weiterleitung zur Zahlung...',
    no_profile_text: 'Du brauchst zuerst dein eigenes Profil — die Kompatibilität liest daraus.', no_profile_link: 'Profil holen',
    error_generic: 'Etwas ist schiefgelaufen. Versuch es noch einmal.',
    your_data_sub_edit: 'Deine Angaben, damit wir die Beziehung richtig lesen können.',
    confirm_correct: 'Richtig', confirm_edit: 'Bearbeiten',
  },
  it: {
    tag: 'Compatibilità', back: '← Indietro',
    about_title: "Cos'è", about_body: 'Una lettura di come tu e un\'altra persona funzionate davvero insieme — dove scorrete allo stesso modo, e dove tirate in direzioni diverse. Scritta da entrambi i temi, non da un quiz.',
    about_cta: 'Continua',
    price_title: 'Il costo', price_body: 'Una lettura di compatibilità costa 8 €, una volta sola, per questa coppia. Paghi dopo aver inserito i dati di entrambi, appena prima che venga scritta.',
    price_cta: 'Continua',
    step_type: 'Quale relazione vuoi capire?', step_type_sub: 'Ogni tipo guarda qualcosa di diverso tra voi due.',
    you: 'Tu', them: "L'altra persona", your_data: 'I tuoi dati', your_data_sub: 'Dal tuo profilo — conferma soltanto.',
    their_data: 'I suoi dati', their_data_sub: 'Nome, data, ora e luogo di nascita.',
    name: 'Nome completo', date: 'Data di nascita', time: 'Ora di nascita', city: 'Città di nascita',
    city_ph: 'Inizia a scrivere la città...', generate: 'Vedi il profilo della relazione — 8 €', next: 'Continua', redirecting: 'Reindirizzamento al pagamento...',
    no_profile_text: 'Prima ti serve il tuo profilo — la compatibilità legge da lì.', no_profile_link: 'Ottieni il tuo profilo',
    error_generic: 'Qualcosa è andato storto. Riprova.',
    your_data_sub_edit: 'I tuoi dati, per poter leggere la relazione correttamente.',
    confirm_correct: 'Corretto', confirm_edit: 'Modifica',
  },
  pt: {
    tag: 'Compatibilidade', back: '← Voltar',
    about_title: 'O que é isto', about_body: 'Uma leitura de como tu e outra pessoa realmente funcionam juntos — onde fluem da mesma forma, e onde puxam em direções diferentes. Escrita a partir dos dois mapas, não de um questionário.',
    about_cta: 'Continuar',
    price_title: 'O custo', price_body: 'Uma leitura de compatibilidade custa 8 €, uma única vez, para este par. Pagas depois de inseridos os dados de ambos, mesmo antes de ser escrita.',
    price_cta: 'Continuar',
    step_type: 'Que relação queres entender?', step_type_sub: 'Cada tipo olha para algo diferente entre vocês os dois.',
    you: 'Tu', them: 'A outra pessoa', your_data: 'Os teus dados', your_data_sub: 'Do teu perfil — apenas confirma.',
    their_data: 'Os dados dela', their_data_sub: 'Nome, data, hora e local de nascimento.',
    name: 'Nome completo', date: 'Data de nascimento', time: 'Hora de nascimento', city: 'Cidade de nascimento',
    city_ph: 'Começa a escrever a cidade...', generate: 'Ver o perfil da relação — 8 €', next: 'Continuar', redirecting: 'A redirecionar para o pagamento...',
    no_profile_text: 'Precisas primeiro do teu próprio perfil — a compatibilidade lê a partir dele.', no_profile_link: 'Obter o teu perfil',
    error_generic: 'Algo correu mal. Tenta outra vez.',
    your_data_sub_edit: 'Os teus dados, para podermos ler a relação corretamente.',
    confirm_correct: 'Correto', confirm_edit: 'Editar',
  },
  nl: {
    tag: 'Compatibiliteit', back: '← Terug',
    about_title: 'Wat dit is', about_body: 'Een lezing van hoe jij en iemand anders echt samenwerken — waar jullie op dezelfde golf zitten, en waar jullie verschillende kanten op trekken. Geschreven vanuit beide kaarten, niet vanuit een quiz.',
    about_cta: 'Doorgaan',
    price_title: 'De kosten', price_body: 'Een compatibiliteitslezing kost eenmalig €8, voor dit ene koppel. Je betaalt zodra beide gegevens zijn ingevuld, vlak voordat hij geschreven wordt.',
    price_cta: 'Doorgaan',
    step_type: 'Welke relatie wil je begrijpen?', step_type_sub: 'Elk type kijkt naar iets anders tussen jullie twee.',
    you: 'Jij', them: 'De andere persoon', your_data: 'Jouw gegevens', your_data_sub: 'Uit je profiel — bevestig gewoon.',
    their_data: 'Hun gegevens', their_data_sub: 'Naam, datum, tijd en plaats van geboorte.',
    name: 'Volledige naam', date: 'Geboortedatum', time: 'Geboortetijd', city: 'Geboorteplaats',
    city_ph: 'Begin de stad te typen...', generate: 'Bekijk het relatieprofiel — €8', next: 'Doorgaan', redirecting: 'Doorverwijzen naar betaling...',
    no_profile_text: 'Je hebt eerst je eigen profiel nodig — compatibiliteit leest daaruit.', no_profile_link: 'Haal je profiel',
    error_generic: 'Er ging iets mis. Probeer opnieuw.',
    your_data_sub_edit: 'Jouw gegevens, zodat we de relatie correct kunnen lezen.',
    confirm_correct: 'Klopt', confirm_edit: 'Wijzigen',
  },
  pl: {
    tag: 'Kompatybilność', back: '← Wstecz',
    about_title: 'Czym to jest', about_body: 'Odczyt tego, jak ty i ktoś inny naprawdę współdziałacie — gdzie płyniecie tak samo, a gdzie ciągniecie w różne strony. Napisany z obu wykresów, nie z quizu.',
    about_cta: 'Dalej',
    price_title: 'Koszt', price_body: 'Odczyt kompatybilności kosztuje jednorazowo 8 €, dla tej pary. Płacisz po wpisaniu danych obu osób, tuż przed napisaniem.',
    price_cta: 'Dalej',
    step_type: 'Jaką relację chcesz zrozumieć?', step_type_sub: 'Każdy typ patrzy na coś innego między wami.',
    you: 'Ty', them: 'Druga osoba', your_data: 'Twoje dane', your_data_sub: 'Z twojego profilu — po prostu potwierdź.',
    their_data: 'Jej dane', their_data_sub: 'Imię, data, godzina i miejsce urodzenia.',
    name: 'Imię i nazwisko', date: 'Data urodzenia', time: 'Godzina urodzenia', city: 'Miejsce urodzenia',
    city_ph: 'Zacznij wpisywać miasto...', generate: 'Zobacz profil relacji — 8 €', next: 'Dalej', redirecting: 'Przekierowanie do płatności...',
    no_profile_text: 'Najpierw potrzebujesz własnego profilu — kompatybilność z niego czerpie.', no_profile_link: 'Zdobądź swój profil',
    error_generic: 'Coś poszło nie tak. Spróbuj ponownie.',
    your_data_sub_edit: 'Twoje dane, abyśmy mogli poprawnie odczytać relację.',
    confirm_correct: 'Poprawne', confirm_edit: 'Zmień',
  },
  hu: {
    tag: 'Kompatibilitás', back: '← Vissza',
    about_title: 'Mi ez', about_body: 'Egy olvasat arról, hogyan működtök együtt valójában te és valaki más — hol áramoltok egy irányba, és hol húztok más-más irányba. Mindkét térképből írva, nem egy kvízből.',
    about_cta: 'Tovább',
    price_title: 'Az ár', price_body: 'Egy kompatibilitási olvasat egyszeri 8 €-ba kerül, erre a párosra. Akkor fizetsz, amikor mindkettőtök adatait megadtad, közvetlenül a megírás előtt.',
    price_cta: 'Tovább',
    step_type: 'Melyik kapcsolatot szeretnéd megérteni?', step_type_sub: 'Minden típus mást néz kettőtök között.',
    you: 'Te', them: 'A másik személy', your_data: 'A te adataid', your_data_sub: 'A profilodból — csak erősítsd meg.',
    their_data: 'Az ő adatai', their_data_sub: 'Név, dátum, idő és a születés helye.',
    name: 'Teljes név', date: 'Születési dátum', time: 'Születési idő', city: 'Születési város',
    city_ph: 'Kezdd el beírni a várost...', generate: 'Kapcsolati profil megtekintése — 8 €', next: 'Tovább', redirecting: 'Átirányítás a fizetéshez...',
    no_profile_text: 'Először a saját profilodra van szükséged — a kompatibilitás abból olvas.', no_profile_link: 'Szerezd meg a profilod',
    error_generic: 'Valami elromlott. Próbáld újra.',
    your_data_sub_edit: 'A te adataid, hogy helyesen tudjuk olvasni a kapcsolatot.',
    confirm_correct: 'Helyes', confirm_edit: 'Módosítás',
  },
  ru: {
    tag: 'Совместимость', back: '← Назад',
    about_title: 'Что это', about_body: 'Разбор того, как вы с другим человеком на самом деле работаете вместе — где вы движетесь заодно, а где тянете в разные стороны. Написан по обеим картам, а не по тесту.',
    about_cta: 'Продолжить',
    price_title: 'Стоимость', price_body: 'Разбор совместимости стоит 8 € единоразово, для этой пары. Ты платишь после того, как введены данные обоих, прямо перед тем, как он будет написан.',
    price_cta: 'Продолжить',
    step_type: 'Какие отношения ты хочешь понять?', step_type_sub: 'Каждый тип смотрит на разное между вами двумя.',
    you: 'Ты', them: 'Другой человек', your_data: 'Твои данные', your_data_sub: 'Из твоего профиля — просто подтверди.',
    their_data: 'Его/её данные', their_data_sub: 'Имя, дата, время и место рождения.',
    name: 'Полное имя', date: 'Дата рождения', time: 'Время рождения', city: 'Город рождения',
    city_ph: 'Начни вводить город...', generate: 'Смотреть профиль отношений — 8 €', next: 'Продолжить', redirecting: 'Переход к оплате...',
    no_profile_text: 'Сначала нужен твой собственный профиль — совместимость читает из него.', no_profile_link: 'Получить профиль',
    error_generic: 'Что-то пошло не так. Попробуй ещё раз.',
    your_data_sub_edit: 'Твои данные, чтобы мы могли правильно прочитать отношения.',
    confirm_correct: 'Верно', confirm_edit: 'Изменить',
  },
}
function lx(lang, k){ return (L[lang]||L.en)[k] }

const PENDING_KEY = 'compat_pending'

function formatBirthDate(dob, lang) {
  if (!dob) return ''
  try {
    return new Date(`${dob}T12:00:00Z`).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (e) {
    return dob
  }
}

function PersonForm({ lang, value, onChange }) {
  const [day, setDay] = useState(value.day || '')
  const [month, setMonth] = useState(value.month || '')
  const [year, setYear] = useState(value.year || '')
  const [cityValue, setCityValue] = useState(value.city || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug] = useState(false)
  const debounceRef = useRef(null)
  const months = t(lang, 'months')

  useEffect(() => {
    if (day && month && year && year.length === 4) {
      const dob = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`
      onChange({ ...value, day, month, year, date_of_birth: dob })
    }
  }, [day, month, year])

  const handleCity = (e) => {
    const v = e.target.value
    setCityValue(v)
    onChange({ ...value, city: '', lat: '', lng: '' })
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (v.length < 2) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(v)}&format=json&limit=5&featuretype=city`, { headers: { 'Accept-Language': 'en' } })
        setSuggestions(await res.json()); setShowSug(true)
      } catch (e) {}
    }, 400)
  }
  const pickCity = (p) => {
    setCityValue(p.display_name)
    onChange({ ...value, city: p.display_name, lat: p.lat, lng: p.lon })
    setSuggestions([]); setShowSug(false)
  }

  return (
    <>
      <div style={s.field}>
        <label style={s.label}>{lx(lang,'name')}</label>
        <input className="input-clean" value={value.full_name || ''} onChange={e => onChange({ ...value, full_name: e.target.value })} placeholder={lx(lang,'name')} />
      </div>
      <div style={s.field}>
        <label style={s.label}>{lx(lang,'date')}</label>
        <div style={{ display:'flex', gap:'10px' }}>
          <input className="input-clean" type="number" placeholder="DD" value={day} onChange={e=>setDay(e.target.value)} min="1" max="31" style={{ flex:1, minWidth:'56px', textAlign:'center' }} />
          <select className="input-clean select-clean" value={month} onChange={e=>setMonth(e.target.value)} style={{ flex:2 }}>
            <option value="">—</option>
            {months.map((m,i)=>(<option key={i} value={String(i+1)}>{m}</option>))}
          </select>
          <input className="input-clean" type="number" placeholder="YYYY" value={year} onChange={e=>setYear(e.target.value)} min="1900" max="2025" style={{ flex:1, minWidth:'70px', textAlign:'center' }} />
        </div>
      </div>
      <div style={s.field}>
        <label style={s.label}>{lx(lang,'time')}</label>
        <input className="input-clean" type="time" value={value.time_of_birth || ''} onChange={e => onChange({ ...value, time_of_birth: e.target.value })} />
      </div>
      <div style={{ ...s.field, position:'relative' }}>
        <label style={s.label}>{lx(lang,'city')}</label>
        <input className="input-clean" value={cityValue} onChange={handleCity} onBlur={()=>setTimeout(()=>setShowSug(false),200)} placeholder={lx(lang,'city_ph')} autoComplete="off" />
        {showSug && suggestions.length > 0 && (
          <div style={s.sug}>
            {suggestions.map((p,i)=>(
              <div key={i} onMouseDown={()=>pickCity(p)} style={s.sugItem} className="city-suggestion">
                <span style={{ color:'var(--purple)', marginRight:'8px' }}>◦</span>{p.display_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function CompatibilityPage() {
  const router = useRouter()
  const [lang] = useLanguage()
  const [step, setStep] = useState('about')
  const [type, setType] = useState(null)
  const [personA, setPersonA] = useState({})
  const [personB, setPersonB] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resuming, setResuming] = useState(false)

  // BUG (raport live, Alex): pasul 'me' arata mereu formularul GOL, chiar
  // cand contul are deja profil — decizia era ca datele proprii sa vina
  // precompletate SI confirmate ("Datele tale: ... — Corect / Modifica"),
  // nu reintroduse. meMode decide ce se randeaza in pasul 'me':
  // null = inca asteptam raspunsul /api/profile (nu randam nimic inca,
  // ca sa nu clipeasca intai formularul gol si apoi confirmarea);
  // 'confirm' = profil complet gasit, aratam confirmarea;
  // 'form' = fara profil / date incomplete, fallback pe formularul editabil.
  const [meMode, setMeMode] = useState(null)

  // precompletează A din profilul existent — de pe server, nu din
  // localStorage (punctul 1, audit 26.07: browserul e cache, serverul e
  // adevărul). Fără asta, câmpurile veneau goale chiar dacă profilul exista.
  useEffect(() => {
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(data => {
      if (!data) { setMeMode('form'); return }
      const patch = { prefilled: true }
      if (data.full_name) patch.full_name = data.full_name
      if (data.birth_date) {
        const [year, month, day] = data.birth_date.split('-')
        patch.date_of_birth = data.birth_date
        patch.year = year
        patch.month = String(Number(month))
        patch.day = String(Number(day))
      }
      if (data.birth_time) patch.time_of_birth = data.birth_time.slice(0, 5)
      if (data.birth_city) patch.city = data.birth_city
      if (data.birth_lat != null) patch.lat = data.birth_lat
      if (data.birth_lng != null) patch.lng = data.birth_lng
      setPersonA(prev => ({ ...prev, ...patch }))
      const hasFullOwnData = patch.full_name && patch.date_of_birth && patch.time_of_birth && patch.city
      setMeMode(hasFullOwnData ? 'confirm' : 'form')
    }).catch(() => setMeMode('form'))
  }, [])

  // Intoarcere de la Stripe (T3): plata s-a facut, reluam generarea exact
  // de unde ramasese, fara sa mai cerem datele o a doua oara.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paidSession = params.get('paid_session')
    if (!paidSession) return
    let pending = null
    try { pending = JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null') } catch (e) {}
    if (!pending) return
    setResuming(true)
    setType(pending.type)
    setPersonA(pending.personA)
    setPersonB(pending.personB)
    setStep('them')
    runGenerate(pending.type, pending.personA, pending.personB, paidSession)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chooseType = (k) => { setType(k); setStep('me') }

  const aReady = personA.full_name && personA.date_of_birth && personA.time_of_birth && personA.city
  const bReady = personB.full_name && personB.date_of_birth && personB.time_of_birth && personB.city

  const runGenerate = async (theType, pA, pB, paidSessionId) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: theType, language: lang,
          personA: { full_name: pA.full_name, date_of_birth: pA.date_of_birth, time_of_birth: pA.time_of_birth, lat: pA.lat, lng: pA.lng },
          personB: { full_name: pB.full_name, date_of_birth: pB.date_of_birth, time_of_birth: pB.time_of_birth, lat: pB.lat, lng: pB.lng },
          paid_session_id: paidSessionId,
        })
      })
      const data = await res.json()

      if (data.success) {
        try { sessionStorage.removeItem(PENDING_KEY) } catch (e) {}
        router.push(`/compatibility/result?id=${data.compatibility_id}`)
        return
      }

      if (data.checkout_required) {
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify({ type: theType, personA: pA, personB: pB })) } catch (e) {}
        const checkoutRes = await fetch('/api/compatibility/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang }),
        })
        const checkoutData = await checkoutRes.json()
        if (checkoutData.url) { window.location.href = checkoutData.url; return }
        setError(lx(lang, 'error_generic'))
        setLoading(false)
        return
      }

      if (data.error === 'no_profile') {
        setResuming(false)
        setError('no_profile')
        setLoading(false)
        return
      }

      setResuming(false)
      setError(lx(lang, 'error_generic'))
      setLoading(false)
    } catch (e) {
      setResuming(false)
      setError(lx(lang, 'error_generic'))
      setLoading(false)
    }
  }

  const handleGenerate = () => {
    if (!aReady || !bReady) return
    runGenerate(type, personA, personB, null)
  }

  return (
    <>
      <main style={s.wrap}>
        <div style={s.header}>
          <a href="/dashboard" style={s.back}>{lx(lang,'back')}</a>
          <span className="tag tag-purple">{lx(lang,'tag')}</span>
        </div>

        {resuming && loading && (
          <div className="anim-fade-in" style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={s.sub}>{lx(lang, 'redirecting')}</p>
          </div>
        )}

        {!resuming && step === 'about' && (
          <div className="anim-fade-in">
            <h1 style={s.title}>{lx(lang,'about_title')}</h1>
            <p style={{ ...s.sub, marginTop: '14px' }}>{lx(lang,'about_body')}</p>
            <button onClick={()=>setStep('price')} style={s.cta}>{lx(lang,'about_cta')}</button>
          </div>
        )}

        {!resuming && step === 'price' && (
          <div className="anim-fade-in">
            <h1 style={s.title}>{lx(lang,'price_title')}</h1>
            <p style={{ ...s.sub, marginTop: '14px' }}>{lx(lang,'price_body')}</p>
            <button onClick={()=>setStep('type')} style={s.cta}>{lx(lang,'price_cta')}</button>
          </div>
        )}

        {!resuming && step === 'type' && (
          <div className="anim-fade-in">
            <h1 style={s.title}>{lx(lang,'step_type')}</h1>
            <p style={s.sub}>{lx(lang,'step_type_sub')}</p>
            <div style={{ marginTop:'28px' }}>
              {TYPES.map(tp => (
                <button key={tp.key} onClick={()=>chooseType(tp.key)} style={s.typeBtn} className="landing-card">
                  <span style={s.typeIcon}>{tp.icon}</span>
                  <span style={s.typeLabel}>{tp[lang] || tp.en}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!resuming && step === 'me' && (
          <div className="anim-fade-in">
            <span className="tag tag-purple" style={{ marginBottom:'14px', display:'inline-block' }}>{lx(lang,'you')}</span>
            <h1 style={s.title}>{lx(lang,'your_data')}</h1>

            {meMode === 'confirm' && (
              <>
                <p style={s.sub}>{lx(lang,'your_data_sub')}</p>
                <div className="chapter" style={{ marginTop:'24px', padding:'20px 22px' }}>
                  <p style={s.confirmRow}><strong>{lx(lang,'name')}:</strong> {personA.full_name}</p>
                  <p style={s.confirmRow}><strong>{lx(lang,'date')}:</strong> {formatBirthDate(personA.date_of_birth, lang)}</p>
                  <p style={s.confirmRow}><strong>{lx(lang,'time')}:</strong> {personA.time_of_birth}</p>
                  <p style={s.confirmRow}><strong>{lx(lang,'city')}:</strong> {personA.city}</p>
                </div>
                <div style={{ display:'flex', gap:'10px', marginTop:'24px' }}>
                  <button onClick={()=>setMeMode('form')} style={s.secondaryBtn}>{lx(lang,'confirm_edit')}</button>
                  <button onClick={()=>setStep('them')} style={{ ...s.cta, marginTop:0, flex:1 }}>{lx(lang,'confirm_correct')}</button>
                </div>
              </>
            )}

            {meMode === 'form' && (
              <>
                <p style={s.sub}>{lx(lang,'your_data_sub_edit')}</p>
                <div style={{ marginTop:'24px' }}>
                  <PersonForm lang={lang} value={personA} onChange={setPersonA} />
                </div>
                <button onClick={()=>setStep('them')} disabled={!aReady} style={{ ...s.cta, opacity: aReady?1:0.4, cursor: aReady?'pointer':'not-allowed' }}>{lx(lang,'next')}</button>
              </>
            )}
          </div>
        )}

        {!resuming && step === 'them' && (
          <div className="anim-fade-in">
            <span className="tag tag-green" style={{ marginBottom:'14px', display:'inline-block' }}>{lx(lang,'them')}</span>
            <h1 style={s.title}>{lx(lang,'their_data')}</h1>
            <p style={s.sub}>{lx(lang,'their_data_sub')}</p>
            <div style={{ marginTop:'24px' }}>
              <PersonForm lang={lang} value={personB} onChange={setPersonB} />
            </div>

            {error === 'no_profile' ? (
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <p style={{ ...s.sub, marginBottom: '10px' }}>{lx(lang, 'no_profile_text')}</p>
                <a href="/onboarding" style={{ color: 'var(--purple)', fontWeight: '600' }}>{lx(lang, 'no_profile_link')} →</a>
              </div>
            ) : (
              <>
                <button onClick={handleGenerate} disabled={!bReady || loading} style={{ ...s.cta, opacity: (bReady&&!loading)?1:0.4, cursor: (bReady&&!loading)?'pointer':'not-allowed' }}>
                  {loading ? '...' : lx(lang,'generate')}
                </button>
                {error && <p style={{ fontSize: '13px', color: 'var(--orange)', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
              </>
            )}
          </div>
        )}
      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'600px', margin:'0 auto', padding:'40px 24px 80px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' },
  back: { fontSize:'14px', color:'var(--text-muted)', fontWeight:'500' },
  title: { fontSize:'clamp(26px,6vw,36px)', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', lineHeight:1.2 },
  sub: { fontSize:'15px', color:'var(--text-muted)', lineHeight:'1.6', marginTop:'8px' },
  typeBtn: { display:'flex', alignItems:'center', gap:'16px', width:'100%', textAlign:'left', padding:'20px', marginBottom:'14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', cursor:'pointer', boxShadow:'var(--shadow)' },
  typeIcon: { fontSize:'24px', color:'var(--purple)', width:'32px', textAlign:'center' },
  typeLabel: { fontSize:'17px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif' },
  field: { marginBottom:'20px' },
  label: { display:'block', fontSize:'13px', fontWeight:'600', color:'var(--text)', marginBottom:'8px' },
  sug: { position:'absolute', top:'100%', left:0, right:0, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:'12px', boxShadow:'var(--shadow-lg)', zIndex:100, maxHeight:'240px', overflowY:'auto', marginTop:'4px' },
  sugItem: { padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid var(--border)', fontSize:'13px', color:'var(--text)', display:'flex', alignItems:'flex-start' },
  cta: { width:'100%', padding:'16px', marginTop:'28px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'16px', fontWeight:'600', boxShadow:'0 4px 20px var(--gold-faint)' },
  confirmRow: { fontSize:'15px', color:'var(--text)', lineHeight:'2', margin:0 },
  secondaryBtn: { padding:'16px 20px', background:'transparent', color:'var(--text-muted)', border:'1.5px solid var(--border)', borderRadius:'12px', fontSize:'15px', fontWeight:'500', cursor:'pointer' },
}
