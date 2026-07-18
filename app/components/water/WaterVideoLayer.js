'use client'

// WaterVideoLayer — UN player global de fundal (arhitectura hibrida, sect. 4.1).
// Placa .mp4 cinematica in bucla, sub tot UI-ul. Placa NU contine picatura.
//
// - autoplay + muted + loop(prin swap) + playsinline  -> pornire permisa pe mobil
// - poster din primul cadru (gol de incarcare + reduced-motion)
// - pauza cand fila e ascunsa (document.hidden) -> zero baterie in fundal
// - crossfade ~1.1s FARA CUSATURA: doua instante ale ACELEIASI placi, decalate;
//   cand una se apropie de final, cealalta preia din 0 -> cusatura placii AI
//   (care nu se inchide perfect) e mereu ascunsa. Opacitatea o conduce rAF, nu o
//   tranzitie CSS -> lin peste tot, fara sa depinda de compositorul browserului.
// - PORTAL in document.body: fundalul trebuie sa umple viewportul; montat in
//   pagina ar cadea sub containing-block-ul lui .flow-in (transform+filter) si
//   s-ar prabusi la inaltime 0. In body scapa de orice stramos transformat.
//
// Cand vin placile Veo per stadiu: se schimba props `src`/`poster`, nu codul.

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const FADE = 1.1 // secunde de suprapunere la cusatura

export default function WaterVideoLayer({ src = '/ocean.mp4', poster = '/ocean-poster.jpg' }) {
  const [mounted, setMounted] = useState(false)
  const [motion, setMotion] = useState(true) // false = reduced-motion: doar poster
  const slotA = useRef(null)
  const slotB = useRef(null)
  const vids = [slotA, slotB]
  const frontRef = useRef(0)   // slotul din fata (opacity 1)
  const rafRef = useRef(0)
  const hiddenRef = useRef(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setMotion(!mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Bucla de crossfade fara cusatura.
  useEffect(() => {
    if (!mounted || !motion) return
    const clamp = (v) => Math.min(1, Math.max(0, v))

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)
      if (hiddenRef.current) return
      const fi = frontRef.current
      const f = vids[fi].current
      const b = vids[fi ^ 1].current
      if (!f || !b || !f.duration) return
      const remaining = f.duration - f.currentTime
      if (remaining <= FADE) {
        // placa din fata se apropie de cusatura -> cealalta preia din 0
        if (b.paused) { try { b.currentTime = 0 } catch (e) {} ; b.play().catch(() => {}) }
        const p = clamp(1 - remaining / FADE)
        f.style.opacity = String(1 - p)
        b.style.opacity = String(p)
      } else {
        f.style.opacity = '1'
        if (b.style.opacity !== '0') b.style.opacity = '0'
      }
    }

    // Cand placa din fata se termina, e deja stinsa -> comutam rolurile.
    const makeOnEnded = (i) => () => {
      const v = vids[i].current
      if (!v) return
      v.pause(); try { v.currentTime = 0 } catch (e) {}
      v.style.opacity = '0'
      frontRef.current = i ^ 1
    }
    const aEnd = makeOnEnded(0)
    const bEnd = makeOnEnded(1)
    const a = slotA.current
    const b = slotB.current
    a && a.addEventListener('ended', aEnd)
    b && b.addEventListener('ended', bEnd)
    a && a.play().catch(() => {})
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      a && a.removeEventListener('ended', aEnd)
      b && b.removeEventListener('ended', bEnd)
    }
  }, [mounted, motion, src])

  // Pauza in fundal, reia la revenire.
  useEffect(() => {
    if (!mounted || !motion) return
    const onVis = () => {
      hiddenRef.current = document.hidden
      if (document.hidden) {
        vids.forEach((r) => r.current && r.current.pause())
      } else {
        const f = vids[frontRef.current].current
        f && f.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [mounted, motion])

  if (!mounted) return null

  const layer = (
    <div className="watervideo" aria-hidden="true">
      {/* posterul (primul cadru) — sub video, mereu prezent: gol de incarcare +
          singurul strat vizibil la reduced-motion */}
      <img className="watervideo-poster" src={poster} alt="" />
      {motion && (
        <>
          <video ref={slotA} className="watervideo-el" style={{ opacity: 1 }}
                 src={src} poster={poster} muted playsInline autoPlay preload="auto" />
          <video ref={slotB} className="watervideo-el" style={{ opacity: 0 }}
                 src={src} poster={poster} muted playsInline preload="auto" />
        </>
      )}
    </div>
  )
  return createPortal(layer, document.body)
}
