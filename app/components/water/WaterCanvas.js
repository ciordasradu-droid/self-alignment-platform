'use client'

// Invelisul apei, montat O SINGURA DATA in layout.
// - three.js intra doar prin next/dynamic cu ssr:false (altfel crapa build-ul)
// - daca WebGL lipseste, aplicatia NU moare: cade pe gradient + inele statice
// - hook-ul global de ripple traieste aici (legea 2)

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useRipple } from './waterState'

const WaterScene = dynamic(() => import('./WaterScene'), { ssr: false })

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch (e) {
    return false
  }
}

export default function WaterCanvas() {
  const [ok, setOk] = useState(null)
  const pathname = usePathname()
  useRipple()

  useEffect(() => { setOk(hasWebGL()) }, [])

  // Playground-ul isi monteaza propria scena, cu uniformurile lui.
  // Doua contexte WebGL pe acelasi ecran = risipa curata.
  // /proba/* judeca stratul video hibrid IZOLAT — apa three.js n-are ce cauta acolo.
  if (pathname?.startsWith('/dev') || pathname?.startsWith('/proba')) return null

  if (ok === null) return <div className="water-fallback" aria-hidden="true" />
  if (ok === false) {
    // Fallback: apa nu se misca, dar ecranul ramane apa — nu fundal mort.
    return (
      <div className="water-fallback" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="water-fallback-rings">
          {[10, 17, 24].map((r, i) => (
            <ellipse key={r} cx="50" cy="62" rx={r} ry={r * 0.22}
                     fill="none" stroke="rgba(224,179,106,0.18)" strokeWidth="0.25" />
          ))}
          <circle cx="50" cy="38" r="3.2" fill="#f4ecd9" opacity="0.9" />
        </svg>
      </div>
    )
  }

  return <WaterScene />
}
