'use client'

// Scena apei. UN SINGUR Canvas, montat global in layout, fixed sub UI.
// Nimic din fisierul asta nu ruleaza la SSR (se importa doar prin next/dynamic
// cu ssr:false) — three.js nu supravietuieste pe server.

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { WATER_VERT, WATER_FRAG, BUBBLE_VERT, BUBBLE_FRAG } from './shaders'
import { waterState, stageForDay, stageIndexForDay, STAGES } from './waterState'

// Paleta impusa (brief sectiunea 2). Zero culori hardcodate in alta parte.
const DEEP = new THREE.Color('#14122a')
const PLUM = new THREE.Color('#2a1f3d')
const GOLD = new THREE.Color('#e0b36a')
const PEARL = new THREE.Color('#f4ecd9')

// ── FUNDALUL: triunghi full-screen. Fara camera, fara matrici — cel mai ieftin.
function WaterBackground({ overrides, motion }) {
  const mat = useRef()
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
    uBubblePos:   { value: new THREE.Vector2(0.5, 0.62) },
    uBubbleLight: { value: 0 },
    uHasBubble:   { value: 0 },
    uRipples:   { value: Array.from({ length: 8 }, () => new THREE.Vector3(0, 0, -99)) },
    uRippleCount: { value: 0 },
  }), [])

  useEffect(() => {
    uniforms.uRes.value.set(size.width, size.height)
  }, [size, uniforms])

  useFrame(({ clock }) => {
    const u = uniforms
    const t = clock.getElapsedTime()
    u.uTime.value = t
    waterState.clock = t

    const s = waterState.get()
    const stage = stageForDay(s.day)
    const light = s.light == null ? stage.light : (stage.light * 0.45 + (s.light / 100) * 0.85)

    // overrides = playground-ul /dev/water. In productie sunt undefined.
    u.uCaustics.value  = overrides?.caustics ?? (stage.caustics)
    u.uWaveAmp.value   = overrides?.waveAmp ?? 0.35
    u.uWaveSpeed.value = overrides?.waveSpeed ?? 1.0
    u.uOctaves.value   = overrides?.octaves ?? perf.octaves
    u.uBubbleLight.value = overrides?.light ?? Math.min(1, light)
    u.uBubblePos.value.set(s.bubblePos[0], s.bubblePos[1])
    u.uHasBubble.value = (overrides ? true : s.showBubble) ? 1 : 0

    // undele active -> shader
    waterState.pruneRipples(t)
    const rs = s.ripples
    for (let i = 0; i < 8; i++) {
      const r = rs[i]
      u.uRipples.value[i].set(r ? r.x : 0, r ? r.y : 0, r ? r.born : -99)
    }
    u.uRippleCount.value = Math.min(8, rs.length)
  })

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      {/* triunghi care acopera ecranul; pozitia trece neatinsa prin vertex shader */}
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array([-1,-1,0, 3,-1,0, -1,3,0]), 3]} />
        <bufferAttribute attach="attributes-uv" args={[new Float32Array([0,0, 2,0, 0,2]), 2]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={WATER_VERT}
        fragmentShader={WATER_FRAG}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

// Zgomot ieftin, dependency-free — trei sinusoide defazate pe axe diferite.
// Nu e Perlin adevarat, dar la amplitudine mica pe o forma deja rotunda
// citeste ca "respira", nu ca artefact — si costa aproape nimic per-vertex.
function cheapNoise3(x, y, z, t) {
  return (
    Math.sin(x * 3.1 + t * 0.6) +
    Math.sin(y * 3.7 - t * 0.5 + 1.7) +
    Math.sin(z * 2.9 + t * 0.4 + 3.1)
  ) / 3
}

// ── BULA: forma organica suspendata deasupra apei (0.2, calup arhitectura
// 30.07 — inlocuieste picatura/lacrima). NICIODATA sfera perfecta: conturul
// respira, deformat usor prin zgomot pe geometrie, amplitudine mica.
// Se OPRESTE din respirat exact la stadiul Cristalul (z60) — cristalul nu
// respira, e static — si la prefers-reduced-motion (motion=0).
const BUBBLE_DETAIL = 3 // icosaedru, 642 varfuri — organic, ieftin pe mobil
const BUBBLE_NOISE_AMP = 0.045 // amplitudine MICA (brief) — deformare, nu explozie

function WaterBubble({ overrides, motion }) {
  const mesh = useRef()
  const { viewport } = useThree()

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uLight: { value: 0 },
    uStage: { value: 1 },
    uPearl: { value: PEARL.clone() },
    uGold:  { value: GOLD.clone() },
    uDeep:  { value: DEEP.clone() },
    uMotion:{ value: motion },
  }), [])

  // geometria de baza (nedeformata), clonata o singura data — in fiecare
  // cadru scriem peste attributes.position.array pornind mereu de aici, nu
  // alocam un Float32Array nou.
  const { baseGeometry, basePositions } = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, BUBBLE_DETAIL)
    const base = g.attributes.position.array.slice()
    return { baseGeometry: g, basePositions: base }
  }, [])

  const frozenTime = useRef(0)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * motion
    const s = waterState.get()
    const stage = stageForDay(s.day)
    const idx = stageIndexForDay(s.day)
    const light = s.light == null ? stage.light : (stage.light * 0.45 + (s.light / 100) * 0.85)
    const stageNum = overrides?.stage ?? (idx + 1)
    const isCrystalOrLater = stageNum >= 6 // Cristalul (z60) si Oceanul (z90)

    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uLight.value = overrides?.light ?? Math.min(1, light)
    uniforms.uStage.value = stageNum

    if (!mesh.current) return
    // apa userului apare doar unde exista un user (home / playground)
    mesh.current.visible = overrides ? true : s.showBubble
    if (!mesh.current.visible) return

    // respiratia organica: ingheata la Cristalul+ (nu doar la reduced-motion) —
    // timpul de zgomot se opreste din avansat, forma ramane la ultima ei stare.
    if (!isCrystalOrLater) frozenTime.current = t
    const noiseT = frozenTime.current
    const posAttr = mesh.current.geometry.attributes.position
    const arr = posAttr.array
    for (let i = 0; i < arr.length; i += 3) {
      const bx = basePositions[i], by = basePositions[i + 1], bz = basePositions[i + 2]
      const n = cheapNoise3(bx, by, bz, noiseT)
      const d = 1 + n * BUBBLE_NOISE_AMP
      arr[i] = bx * d; arr[i + 1] = by * d; arr[i + 2] = bz * d
    }
    posAttr.needsUpdate = true
    mesh.current.geometry.computeVertexNormals()

    // bula ramane MICA; apa si lumina sunt cele care raspund
    const size = (overrides?.size ?? stage.size)
    const scale = size * Math.min(viewport.width, viewport.height) * 0.085
    mesh.current.scale.setScalar(scale)

    // pluteste — suspendata, nu asezata
    const [px, py] = s.bubblePos
    mesh.current.position.x = (px - 0.5) * viewport.width
    mesh.current.position.y = (py - 0.5) * viewport.height + Math.sin(t * 0.55) * 0.06
    mesh.current.rotation.y = t * (overrides?.spin ?? stage.spin)
    mesh.current.rotation.x = Math.sin(t * 0.22) * 0.14
  })

  return (
    <mesh ref={mesh}>
      <primitive object={baseGeometry} attach="geometry" />
      <shaderMaterial
        vertexShader={BUBBLE_VERT}
        fragmentShader={BUBBLE_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
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
    } else {
      a.slow = 0
    }
  })
  return null
}

export default function WaterScene({ overrides }) {
  const [frameloop, setFrameloop] = useState('always')
  const motion = useMemo(() => {
    if (typeof window === 'undefined') return 1
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1
  }, [])

  // Bucla se opreste cand fila nu e vizibila — nu ardem bateria degeaba.
  // 'demand', nu 'never': fila din fundal randeaza totusi primul cadru, deci
  // cand omul revine gaseste apa acolo, nu un dreptunghi gol.
  // La prefers-reduced-motion apa exista, dar nu se misca.
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
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <WaterBackground overrides={overrides} motion={motion} />
      <WaterBubble overrides={overrides} motion={motion} />
      {motion ? <PerfGuard /> : null}
    </Canvas>
  )
}
