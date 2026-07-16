'use client'

// Scena apei. UN SINGUR Canvas, montat global in layout, fixed sub UI.
// Nimic din fisierul asta nu ruleaza la SSR (se importa doar prin next/dynamic
// cu ssr:false) — three.js nu supravietuieste pe server.
//
// DE CE ARATA ALTFEL DECAT PRIMA VERSIUNE:
// prima incercare a fost un shader propriu de la zero, fara mediu de lumina.
// O sfera fara ce sa reflecte arata ca lut, oricat de bun e shaderul. Acum:
// Environment (lumini reale de reflectat) + material fizic de apa (transmisie,
// ior 1.33) + bloom discret. Sideful vine din mediu si irizatie, nu din culoare
// pictata de mana.

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { WATER_VERT, WATER_FRAG } from './shaders'
import { waterState, stageForDay, stageIndexForDay } from './waterState'

// Paleta impusa (brief sectiunea 2).
const DEEP = new THREE.Color('#14122a')
const PLUM = new THREE.Color('#2a1f3d')
const GOLD = new THREE.Color('#e0b36a')
const GOLD_DEEP = new THREE.Color('#e08a3c')
const PEARL = new THREE.Color('#f4ecd9')
// tenta apei din interiorul picaturii — rece si clara, nu pruna care inneaca
const WATER_TINT = new THREE.Color('#cfe3f5')

// ── MEDIUL DE LUMINA ──
// Fara HDRI de pe internet: construim mediul din lightformere, deci e
// self-contained, controlabil si nu depinde de vreun CDN.
// Lumina calda vine de SUS (soarele care rasare peste apa) si de JOS
// (aurul din apa). Lateralele dau adancimea indigo/pruna.
function WaterEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      {/* soarele peste apa */}
      <Lightformer form="rect" intensity={3.2} color="#fff4e0"
                   scale={[10, 5, 1]} position={[0, 6, -2]} rotation={[Math.PI / 2, 0, 0]} />
      {/* lumina refractata din apa, de dedesubt */}
      <Lightformer form="circle" intensity={2.0} color="#e0b36a"
                   scale={[7, 7, 1]} position={[0, -5, 1]} rotation={[-Math.PI / 2, 0, 0]} />
      {/* adancimea — pruna intr-o parte, indigo in cealalta */}
      <Lightformer form="rect" intensity={0.9} color="#2a1f3d"
                   scale={[12, 12, 1]} position={[-6, 0, 1]} rotation={[0, Math.PI / 2, 0]} />
      <Lightformer form="rect" intensity={0.7} color="#14122a"
                   scale={[12, 12, 1]} position={[6, 0, 1]} rotation={[0, -Math.PI / 2, 0]} />
      {/* Reflex rece in fata, ca marginea sa nu fie moarta.
          form="ring" lasa un inel desenat pe sfera — arata ca un defect.
          Un dreptunghi lat da acelasi reflex, fara tatuaj. */}
      <Lightformer form="rect" intensity={1.0} color="#cfe0ff"
                   scale={[6, 3, 1]} position={[-3, 2, 4]} rotation={[0, 0.5, 0]} />
    </Environment>
  )
}

// ── FUNDALUL: triunghi full-screen. Fara camera, fara matrici — cel mai ieftin.
function WaterBackground({ overrides, motion }) {
  const { size } = useThree()

  const uniforms = useMemo(() => ({
    uTime:      { value: 0 },
    uRes:       { value: new THREE.Vector2(1, 1) },
    uDeep:      { value: DEEP.clone() },
    uPlum:      { value: PLUM.clone() },
    uGold:      { value: GOLD.clone() },
    uCaustics:  { value: 0.3 },
    uWaveAmp:   { value: 0.35 },
    uWaveSpeed: { value: 1.0 },
    uOctaves:   { value: 4 },
    uMotion:    { value: motion },
    uDropPos:   { value: new THREE.Vector2(0.5, 0.62) },
    uDropLight: { value: 0 },
    uHasDrop:   { value: 0 },
    uRipples:   { value: Array.from({ length: 8 }, () => new THREE.Vector3(0, 0, -99)) },
    uRippleCount: { value: 0 },
  }), [])

  useEffect(() => { uniforms.uRes.value.set(size.width, size.height) }, [size, uniforms])

  useFrame(({ clock }) => {
    const u = uniforms
    const t = clock.getElapsedTime()
    u.uTime.value = t
    waterState.clock = t

    const s = waterState.get()
    const stage = stageForDay(s.day)
    const light = s.light == null ? stage.light : (stage.light * 0.45 + (s.light / 100) * 0.85)
    const shown = overrides ? 1 : (s.showDrop ? s.dropOpacity : 0)

    u.uCaustics.value  = overrides?.caustics ?? stage.caustics
    u.uWaveAmp.value   = overrides?.waveAmp ?? 0.35
    u.uWaveSpeed.value = overrides?.waveSpeed ?? 1.0
    u.uOctaves.value   = overrides?.octaves ?? perf.octaves
    u.uDropLight.value = overrides?.light ?? Math.min(1, light)
    u.uDropPos.value.set(s.dropPos[0], s.dropPos[1])
    u.uHasDrop.value = shown

    waterState.pruneRipples(t)
    const rs = s.ripples
    for (let i = 0; i < 8; i++) {
      const r = rs[i]
      u.uRipples.value[i].set(r ? r.x : 0, r ? r.y : 0, r ? r.born : -99)
    }
    u.uRippleCount.value = Math.min(8, rs.length)
  })

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array([-1,-1,0, 3,-1,0, -1,3,0]), 3]} />
        <bufferAttribute attach="attributes-uv" args={[new Float32Array([0,0, 2,0, 0,2]), 2]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={WATER_VERT}
        fragmentShader={WATER_FRAG}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

// ── PICATURA userului: sfera de apa fizic corecta.
function WaterDrop({ overrides, motion }) {
  const group = useRef()
  const mesh = useRef()
  const mat = useRef()
  const sats = useRef([])
  const { viewport } = useThree()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * motion
    const s = waterState.get()
    const stage = stageForDay(s.day)
    const idx = overrides ? Math.round(overrides.stage ?? 1) - 1 : stageIndexForDay(s.day)
    const light = s.light == null ? stage.light : (stage.light * 0.45 + (s.light / 100) * 0.85)
    const lightAmt = overrides?.light ?? Math.min(1, light)

    if (!group.current) return
    // Apa userului apare doar unde exista un user, si NUMAI in zona ei din hero.
    // dropOpacity scade cand hero-ul iese din ecran => nu pluteste peste carduri.
    const vis = overrides ? 1 : (s.showDrop ? s.dropOpacity : 0)
    group.current.visible = vis > 0.01
    if (!group.current.visible) return

    // Marimea, calculata ca fractiune din ecran (nu numar magic):
    // ziua 1 ~ 17% din latime, ziua 90 ~ 70%. Saltul trebuie sa se vada.
    const size = overrides?.size ?? stage.size
    const scale = size * Math.min(viewport.width, viewport.height) * 0.25
    mesh.current.scale.setScalar(scale)

    const [px, py] = s.dropPos
    group.current.position.x = (px - 0.5) * viewport.width
    group.current.position.y = (py - 0.5) * viewport.height + Math.sin(t * 0.55) * 0.06
    mesh.current.rotation.y = t * (overrides?.spin ?? stage.spin)
    mesh.current.rotation.x = Math.sin(t * 0.22) * 0.14

    if (mat.current) {
      mat.current.opacity = vis
      // MIEZUL: lumina calda creste IN apa, nu o inlocuieste.
      // Emisia tare face din picatura un balon portocaliu opac — adica exact
      // "soarele/sfera abstracta" pe care vocabularul apei le interzice.
      // Aurul urca mult mai bland, iar apa ramane apa pana la capat.
      mat.current.emissiveIntensity = lightAmt * lightAmt * 0.42
      mat.current.emissive.copy(GOLD).lerp(GOLD_DEEP, lightAmt * 0.5)
      // pe drum devine mai limpede, nu mai plina (Apa Limpede, ziua 14+)
      mat.current.transmission = 0.35 + lightAmt * 0.45
      // Apa din interior se limpezeste pe drum (Apa Limpede, ziua 14+).
      // attenuationDistance mic + thickness mare = lumina moare in picatura si
      // iese o bila neagra. Distanta trebuie sa fie mult peste grosime.
      mat.current.attenuationDistance = 4.0 + lightAmt * 8.0
      mat.current.iridescence = 0.85 - lightAmt * 0.35
      mat.current.thickness = 0.35
    }

    // Stadiul 7 — Oceanul: 4 picaturi-satelit se contopesc in sfera mare.
    const satOn = idx >= 6
    sats.current.forEach((m, i) => {
      if (!m) return
      m.visible = satOn && vis > 0.01
      if (!m.visible) return
      const a = t * 0.28 + (i * Math.PI * 2) / 4
      // se apropie incet de centru — fuziunea
      const r = scale * (2.5 + Math.sin(t * 0.3 + i) * 0.25)
      m.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.42, Math.sin(a) * 0.4)
      m.scale.setScalar(scale * 0.24)
    })
  })

  return (
    <group ref={group}>
      <mesh ref={mesh}>
        {/* 96 segmente: marginea trebuie sa fie curata la zoom pe captura */}
        <sphereGeometry args={[1, 96, 96]} />
        {/* Apa, fizic: transmisie totala, ior 1.33. Perlatul vine din
            environment + irizatie, nu din culoare pictata. */}
        {/* PERLA, nu sticla. Cu transmission=1 peste apa intunecata, sfera
            transmite intuneric si iese o bila neagra. Perla are CORP: transmisie
            partiala + irizatie puternica + clearcoat, luminata de Environment.
            Sideful vine din mediu, nu din culoare pictata. */}
        <meshPhysicalMaterial
          ref={mat}
          transmission={0.35}
          thickness={0.35}
          roughness={0.10}
          metalness={0.0}
          ior={1.33}
          iridescence={1}
          iridescenceIOR={1.35}
          iridescenceThicknessRange={[180, 780]}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={2.6}
          sheen={0.6}
          sheenColor={PEARL}
          sheenRoughness={0.4}
          color={PEARL}
          attenuationColor={WATER_TINT}
          attenuationDistance={6}
          emissive={GOLD}
          emissiveIntensity={0}
          transparent
          opacity={1}
        />
      </mesh>

      {[0, 1, 2, 3].map(i => (
        <mesh key={i} ref={el => (sats.current[i] = el)} visible={false}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhysicalMaterial
            transmission={1} thickness={0.5} roughness={0.05} ior={1.33}
            iridescence={0.9} clearcoat={1} envMapIntensity={1.8}
            color={PEARL} attenuationColor={WATER_TINT} attenuationDistance={6}
            emissive={GOLD} emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

// ── Bugetul de performanta: daca frame time-ul depaseste 22ms sustinut,
//    scadem octavele de noise. Telefonul nu trebuie sa geama.
const perf = { octaves: 4 }
function PerfGuard() {
  const acc = useRef({ t: 0, n: 0, slow: 0 })
  useFrame((_, delta) => {
    const a = acc.current
    a.t += delta; a.n++
    if (a.n < 40) return
    const avg = (a.t / a.n) * 1000
    a.t = 0; a.n = 0
    if (avg > 22) {
      a.slow++
      if (a.slow >= 2 && perf.octaves > 2) { perf.octaves--; a.slow = 0 }
    } else a.slow = 0
  })
  return null
}

export default function WaterScene({ overrides }) {
  const [frameloop, setFrameloop] = useState('always')
  const motion = useMemo(() => {
    if (typeof window === 'undefined') return 1
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1
  }, [])

  useEffect(() => {
    const onVis = () => setFrameloop(!document.hidden && motion ? 'always' : 'demand')
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [motion])

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <WaterEnvironment />
      <WaterBackground overrides={overrides} motion={motion} />
      <WaterDrop overrides={overrides} motion={motion} />
      {/* Bloom discret: glow-ul din referinta e bloom. Prag ridicat ca sa prinda
          doar miezul si luciile, nu tot ecranul. */}
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom intensity={0.55} luminanceThreshold={0.72} luminanceSmoothing={0.28} mipmapBlur />
      </EffectComposer>
      {motion ? <PerfGuard /> : null}
    </Canvas>
  )
}
