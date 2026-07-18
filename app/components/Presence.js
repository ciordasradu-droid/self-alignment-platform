'use client'

// Prezenta ta (sect. 7) — inlocuieste streak-ul cu record (sect. 10, anti-regresie).
// FARA record, FARA comparatie, FARA cifre mari. Sapatamana curenta ca puncte
// de lumina pe apa. Absenta ingheata, nu scade — vizual, o zi neatinsa e doar
// stinsa, nu goala/rosie.

const L = {
  en: { title: 'Your Presence', days: ['M','T','W','T','F','S','S'] },
  ro: { title: 'Prezența ta', days: ['L','M','M','J','V','S','D'] },
  es: { title: 'Tu Presencia', days: ['L','M','X','J','V','S','D'] },
  fr: { title: 'Ta Présence', days: ['L','M','M','J','V','S','D'] },
  de: { title: 'Deine Präsenz', days: ['M','D','M','D','F','S','S'] },
  it: { title: 'La Tua Presenza', days: ['L','M','M','G','V','S','D'] },
  pt: { title: 'A Tua Presença', days: ['S','T','Q','Q','S','S','D'] },
  nl: { title: 'Jouw Aanwezigheid', days: ['M','D','W','D','V','Z','Z'] },
  pl: { title: 'Twoja Obecność', days: ['P','W','Ś','C','P','S','N'] },
  hu: { title: 'A Jelenléted', days: ['H','K','Sz','Cs','P','Sz','V'] },
}

export default function Presence({ streak = 0, lang = 'en' }) {
  const t = L[lang] || L.en
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1

  return (
    <div className="chapter" style={{ marginTop: '8px' }}>
      <div style={{ padding: '18px 22px' }}>
        <p style={{ fontSize: '12px', color: 'rgba(244,240,234,0.5)', letterSpacing: '0.5px', marginBottom: '14px' }}>
          {t.title}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
          {t.days.map((label, i) => {
            const lit = i <= adjustedToday && streak > (adjustedToday - i)
            const isToday = i === adjustedToday
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: isToday ? '11px' : '9px',
                    height: isToday ? '11px' : '9px',
                    borderRadius: '50%',
                    background: lit ? '#e5a93c' : 'rgba(244,240,234,0.14)',
                    boxShadow: lit ? '0 0 8px rgba(229,169,60,0.5)' : 'none',
                  }}
                />
                <span style={{ fontSize: '10.5px', color: 'rgba(244,240,234,0.4)' }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
