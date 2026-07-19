'use client'

// DEV — /dev/water-video. Harnessul de lucru pentru WaterVideoLayer.
// Gated de middleware: 404 in productie, nevazut de Alex.
// Selector intre placile Veo livrate (atmosfera = fundal implicit, picatura =
// procesata si gata, neconectata inca la nicio interactiune).

import { useState } from 'react'
import WaterVideoLayer from '../../components/water/WaterVideoLayer'

const PLATES = {
  atmosfera: { src: '/videos/atmosfera.mp4', poster: '/videos/atmosfera-poster.jpg' },
  picatura: { src: '/videos/picatura.mp4', poster: '/videos/atmosfera-poster.jpg' },
}

export default function DevWaterVideo() {
  const [plate, setPlate] = useState('atmosfera')
  const p = PLATES[plate]

  return (
    <>
      <WaterVideoLayer key={plate} src={p.src} poster={p.poster} />
      <main style={{ position: 'fixed', inset: 0, zIndex: 2, padding: 16, pointerEvents: 'none' }}>
        <p style={{ color: '#f4f0ea', fontFamily: 'Cormorant Garamond, serif', fontSize: 16, margin: 0 }}>
          dev · WaterVideoLayer
        </p>
        <p style={{ color: 'rgba(244,240,234,0.55)', fontSize: 12, marginTop: 4 }}>
          placa activa: {plate}
        </p>
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: 8, marginTop: 12 }}>
          {Object.keys(PLATES).map((k) => (
            <button key={k} onClick={() => setPlate(k)}
                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(229,169,60,0.3)', background: plate === k ? 'rgba(229,169,60,0.25)' : 'rgba(229,169,60,0.08)', color: '#f0d9b0', fontSize: 13 }}>
              {k}
            </button>
          ))}
        </div>
      </main>
    </>
  )
}
