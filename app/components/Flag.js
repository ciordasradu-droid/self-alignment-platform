'use client'

// Steaguri SVG inline — emoji-urile de steag nu se randeaza pe Windows.
// Folosit in onboarding (copie inline, validata deja) si in Setari (aici).

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
  ru: { dir: 'h', colors: ['#FFFFFF', '#0039A6', '#D52B1E'] },
}

export default function Flag({ code }) {
  if (code === 'en') {
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
