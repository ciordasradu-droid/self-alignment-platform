'use client'

// AZI pentru contul doar-cu-profil, fără abonament/probă (A7, calup
// arhitectura 30.07). Apa rămâne vie (fundalul global); aici e SINGURUL
// card — acces la recitirea profilului + o linie calmă către Drumul, fără
// vitrină de upsell, fără ritual.

import Link from 'next/link'

const L = {
  en: { read_profile: 'Read your profile', card_line: 'Your daily rituals are waiting on your Path.', card_cta: 'See the Path' },
  ro: { read_profile: 'Recitește-ți profilul', card_line: 'Ritualurile zilnice te așteaptă pe Drumul tău.', card_cta: 'Vezi Drumul' },
  es: { read_profile: 'Lee tu perfil', card_line: 'Tus rituales diarios te esperan en tu Camino.', card_cta: 'Ver el Camino' },
  fr: { read_profile: 'Lis ton profil', card_line: 'Tes rituels quotidiens t\'attendent sur ton Chemin.', card_cta: 'Voir le Chemin' },
  de: { read_profile: 'Lies dein Profil', card_line: 'Deine täglichen Rituale warten auf deinem Weg.', card_cta: 'Den Weg ansehen' },
  it: { read_profile: 'Leggi il tuo profilo', card_line: 'I tuoi rituali quotidiani ti aspettano sul tuo Cammino.', card_cta: 'Vedi il Cammino' },
  pt: { read_profile: 'Lê o teu perfil', card_line: 'Os teus rituais diários esperam por ti no teu Caminho.', card_cta: 'Ver o Caminho' },
  nl: { read_profile: 'Lees je profiel', card_line: 'Je dagelijkse rituelen wachten op je Weg.', card_cta: 'Bekijk de Weg' },
  pl: { read_profile: 'Przeczytaj swój profil', card_line: 'Twoje codzienne rytuały czekają na twojej Drodze.', card_cta: 'Zobacz Drogę' },
  hu: { read_profile: 'Olvasd el a profilod', card_line: 'A napi rituáléid az Utadon várnak.', card_cta: 'Az Út megtekintése' },
  ru: { read_profile: 'Прочитай свой профиль', card_line: 'Твои ежедневные ритуалы ждут на твоём Пути.', card_cta: 'Смотреть Путь' },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

export default function AziAccessCard({ lang = 'en' }) {
  return (
    <div className="glass" style={s.card}>
      <Link href="/profile" style={s.readProfile}>{lx(lang, 'read_profile')} →</Link>
      <p style={s.line}>{lx(lang, 'card_line')}</p>
      <Link href="/drumul" className="pill-btn" style={s.cta}>{lx(lang, 'card_cta')}</Link>
    </div>
  )
}

const s = {
  card: { padding: '28px 24px', textAlign: 'center' },
  readProfile: { display: 'inline-block', fontSize: '14px', color: 'var(--gold)', marginBottom: '18px' },
  line: { fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: 'var(--text)', lineHeight: 1.6, marginBottom: '20px' },
  cta: { display: 'inline-block' },
}
