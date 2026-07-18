'use client'

// DEV — /dev/water-video. Harnessul de lucru pentru WaterVideoLayer.
// Gated de middleware: 404 in productie, nevazut de Alex.
// Aici traieste selectorul de placi: momentan exista O SINGURA placa (ocean,
// generica); cand Alex livreaza placile Veo per stadiu, aici se comuta intre ele.

import WaterVideoLayer from '../../components/water/WaterVideoLayer'

export default function DevWaterVideo() {
  return (
    <>
      <WaterVideoLayer src="/ocean.mp4" poster="/ocean-poster.jpg" />
      <main style={{ position: 'fixed', inset: 0, zIndex: 2, padding: 16, pointerEvents: 'none' }}>
        <p style={{ color: '#f4f0ea', fontFamily: 'Cormorant Garamond, serif', fontSize: 16, margin: 0 }}>
          dev · WaterVideoLayer
        </p>
        <p style={{ color: 'rgba(244,240,234,0.55)', fontSize: 12, marginTop: 4 }}>
          placa: ocean (generica) — selectorul intra cand vin placile Veo
        </p>
      </main>
    </>
  )
}
