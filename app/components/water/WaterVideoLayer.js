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
// Placa curenta (handoff 23.07, sect. B): ocean-base.mp4 — clip Pexels
// (14077639), comprimat 720x1280/25fps/H.264 fara audio, ~8.5MB. Placa
// provizorie pana cand plachile Veo finale (atmosfera/picatura per stadiu)
// rezolva problema watermark-ului — inlocuirea de-atunci = schimb de
// fisiere, zero cod. picatura.mp4 ramane in public/videos/, NECONECTATA
// inca la nicio interactiune noua — decizie de produs separata.

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const FADE = 1.1 // secunde de suprapunere la cusatura

export default function WaterVideoLayer({ src = '/videos/ocean-base.mp4', poster = '/videos/ocean-base-poster.jpg' }) {
  const [mounted, setMounted] = useState(false)
  const [motion, setMotion] = useState(true) // false = reduced-motion: doar poster
  const [broken, setBroken] = useState(false) // true = video n-a putut porni: doar poster
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

    // Punctul 1 (audit 26.07, runda 5): slotB nu avea niciun cadru decodat
    // cand era chemat la incrucisare (preload="metadata" cerea doar durata,
    // nu si cadre) — opacitatea lui urca spre 1 inainte sa aiba ce arata, deci
    // se vedea un gol. Amorsat aici: play() urmat de pause() la currentTime=0,
    // ca sa aiba primul cadru decodat cu mult inainte de nevoie.
    //
    // Punctul 3 (audit 26.07, runda 5): amorsarea NU porneste la montare, ca
    // sa nu ceara acelasi fisier de doua ori in paralel inainte ca slotA sa
    // apuce sa-l puna in cache (masurat: doua cereri la +0/+1ms cu varianta
    // initiala). Asteapta 'canplaythrough' pe slotA — semnal real ca
    // incarcarea lui e suficient de avansata — inainte sa ceara slotB.
    let primed = false
    const primeB = () => {
      if (primed || !b) return
      primed = true
      b.play().then(() => {
        b.pause()
        try { b.currentTime = 0 } catch (e) {}
      }).catch(() => {})
    }
    if (a && a.readyState >= 4) primeB()
    else a && a.addEventListener('canplaythrough', primeB, { once: true })

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      a && a.removeEventListener('ended', aEnd)
      b && b.removeEventListener('ended', bEnd)
      a && a.removeEventListener('canplaythrough', primeB)
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
          fallback la reduced-motion SAU daca placa nu poate porni */}
      <img className="watervideo-poster" src={poster} alt="" />
      {motion && !broken && (
        <>
          <video ref={slotA} className="watervideo-el" style={{ opacity: 1 }}
                 src={src} poster={poster} muted playsInline autoPlay preload="auto"
                 onError={() => setBroken(true)} />
          {/* Punctul 1+3 (audit 26.07, runda 5, corectie fata de D5): "metadata"
              (decizia D5) era exact cauza golului vizibil la incrucisare — nu
              cere niciun cadru, doar durata. Dar "auto" direct in JSX (prima
              incercare din runda asta) cerea fisierul din nou chiar la montare,
              in paralel cu slotA — masurat: doua cereri identice la +0/+1ms.
              "none" aici + amorsarea programatica din efectul de mai sus
              (asteapta 'canplaythrough' pe slotA, apoi play()+pause() pe
              slotB) rezolva ambele: cadre gata inainte de nevoie, un singur
              fisier cerut de la retea. */}
          <video ref={slotB} className="watervideo-el" style={{ opacity: 0 }}
                 src={src} poster={poster} muted playsInline preload="none"
                 onError={() => setBroken(true)} />
        </>
      )}
      <div className="watervideo-gradient" />
    </div>
  )
  return createPortal(layer, document.body)
}
