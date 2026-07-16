'use client'

// PLAYGROUND — /dev/water. Aici se itereaza vizualul apei, local, cu hot reload.
// NICIODATA prin deploy. Valorile bune se copiaza ca default-uri in waterState.js.
// Exclus din productie: vezi verificarea de env de mai jos + middleware.

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useControls, folder } from 'leva'
import { waterState, STAGES } from '../../components/water/waterState'

const WaterScene = dynamic(() => import('../../components/water/WaterScene'), { ssr: false })

export default function WaterPlayground() {
  const v = useControls({
    stadiu: folder({
      day: { value: 1, min: 1, max: 90, step: 1 },
      light: { value: 0, min: 0, max: 1, step: 0.01 },
      size: { value: 0.52, min: 0.2, max: 1.6, step: 0.01 },
      spin: { value: 0.1, min: 0, max: 1, step: 0.01 },
    }),
    apa: folder({
      caustics: { value: 0.3, min: 0, max: 1.5, step: 0.01 },
      waveAmp: { value: 0.35, min: 0, max: 1.2, step: 0.01 },
      waveSpeed: { value: 1.0, min: 0, max: 3, step: 0.01 },
      octaves: { value: 4, min: 1, max: 5, step: 1 },
    }),
    picatura: folder({
      dropX: { value: 0.5, min: 0, max: 1, step: 0.01 },
      dropY: { value: 0.62, min: 0, max: 1, step: 0.01 },
    }),
  })

  useEffect(() => { waterState.setDay(v.day) }, [v.day])
  useEffect(() => {
    waterState.setDropPos(v.dropX, v.dropY)
    waterState.setShowDrop(true)
    waterState.setDropOpacity(1)
  }, [v.dropX, v.dropY])

  const stage = STAGES.reduce((a, s) => (v.day >= s.day ? s : a), STAGES[0])

  return (
    <>
      <WaterScene overrides={v} />
      <main style={{ position: 'relative', zIndex: 2, padding: 20, pointerEvents: 'none' }}>
        <p style={{ color: 'var(--pearl)', fontFamily: 'Cormorant Garamond, serif', fontSize: 18 }}>
          {stage.ro} · ziua {v.day}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>
          playground — atinge oriunde pentru undă
        </p>
      </main>
    </>
  )
}
