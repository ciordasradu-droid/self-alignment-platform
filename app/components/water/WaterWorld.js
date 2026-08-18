'use client'

// GCAO 05.08.2026 — "Apa vie, zi și seară", fundația vizuală pentru toată
// aplicația. Înlocuiește WaterVideoLayer (video) cu shader-ul viu, semnat de
// Alex, portat 1:1 din reference/concluzia_apa_vie_zi_seara.html — care la
// rândul lui e reference/bula_organica_FINAL.html (03.08.2026) cu o singură
// schimbare confirmată programatic (vezi sesiunea): EXP/SHD/CAU devin
// uniforms în loc de constante, ca să poată tranziționa între zi și seară.
// Restul shaderului (de la `float h(vec2 p)` încolo) e caracter-cu-caracter
// identic cu referința bulei — verificat cu un diff programatic, nu cu ochiul.
//
// UN SINGUR strat global (portal în document.body, ca fostul WaterVideoLayer)
// — nu se remontează la navigare între ecrane, deci contextul WebGL
// supraviețuiește tranzițiilor de rută (evită reinițializarea costisitoare).
//
// Diferențe FAȚĂ de referință — integrare, ZERO impact vizual asupra
// shaderului semnat:
// - u_bubble (uniform nou, singura adăugire la shader): 0/1, amestecă raza
//   bulei spre o valoare puternic negativă când e 0, ca bula să dispară
//   complet fără să existe DOI shadere (unul cu bulă, unul fără) — regula
//   „nu dubla shaderul".
// - mode ('day'/'night') vine din lib/waterMode.js (useWaterMode — granițele
//   EXISTENTE 03:33/15:33, nu o logică nouă), bubble vine din ruta curentă
//   (usePathname): activă doar pe /dashboard (Azi) și /drumul. Ambele pot fi
//   suprascrise explicit prin props, pentru testare.
// - fallback: prefers-reduced-motion SAU WebGL indisponibil → un gradient
//   static (tonul apei adânci), fără canvas, fără animație — nimic nu crapă.
// - oprire completă a buclei (cancelAnimationFrame, nu doar salt de desen)
//   la fila ascunsă SAU la ieșirea din viewport (IntersectionObserver) —
//   pentru un strat fullscreen practic mereu "vizibil", document.hidden e
//   cazul real care contează, dar IntersectionObserver rămâne ca plasă.

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { useWaterMode } from '../../../lib/waterMode'

const DAY = { e: 1.14, s: 0.54, c: 1.50 }
const NIGHT = { e: 0.68, s: 0.88, c: 0.85 }
const TRN = 1.00
const SPEED = 1.13
const LERP = 0.04
const FRAME_BUDGET_MS = 25 // plafon ~40fps, exact ca în machetă

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'

// Header cu uniforms (singura linie diferită față de bula_organica_FINAL.html)
// + u_bubble, singura adăugire reală. Restul, identic caracter-cu-caracter.
const FS = 'precision highp float;uniform float u_t;uniform vec2 u_res;uniform vec3 u_touch;' +
  'uniform float u_exp;uniform float u_shd;uniform float u_cau;uniform float u_bubble;' +
  'const float u_trn=' + TRN.toFixed(2) + ';' +
  'float h(vec2 p){vec3 q=fract(vec3(p.xyx)*0.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}' +
  'float sn(vec2 p){return sin(p.x)*sin(p.y);}' +
  'float tn(vec2 p){float v=0.;' +
  'v+=0.533*sn(p);p=mat2(1.6,1.2,-1.2,1.6)*p+vec2(1.7,4.6);' +
  'v+=0.267*sn(p);p=mat2(1.6,1.2,-1.2,1.6)*p+vec2(8.3,2.8);' +
  'v+=0.133*sn(p);' +
  'return v*0.5+0.5;}' +
  'float rg(vec2 p){return 1.-abs(2.*tn(p)-1.);}' +
  'float web(vec2 p,float t,float po){' +
  'vec2 w=vec2(tn(p*0.55+t*0.085),tn(p*0.55-t*0.07+7.0));' +
  'p+=(w-0.5)*1.7;' +
  'float a=rg(p*0.95+vec2(t*0.10,t*0.065));' +
  'float b=rg(p*1.65-vec2(t*0.08,-t*0.10)+vec2(3.1,5.7));' +
  'return pow(clamp(a*b,0.,1.),po);}' +
  'const vec2 SUN=vec2(-0.10,0.92);' +
  'float rays(vec2 uv,float t,float sc,float sp,float ph){' +
  'vec2 dv=uv-SUN;float ds=length(dv);' +
  'float a=atan(dv.x,-dv.y);' +
  'float rr=tn(vec2(a*sc,a*sc*0.6)+vec2(t*sp+ph,-t*sp*0.6));' +
  'rr=pow(smoothstep(0.40,1.,rr),2.4);' +
  'float fade=exp(-ds*1.0)*smoothstep(2.0,0.30,ds);' +
  'return rr*fade;}' +
  'vec3 water(vec2 uv,float t,float py,float cg,float po){' +
  'vec3 deep=vec3(0.040,0.070,0.135);' +
  'vec3 shal=vec3(0.130,0.255,0.350);' +
  'float vy=clamp(uv.y*0.5+0.5,0.,1.);' +
  'float yy=mix(vy,py,0.5);' +
  'vec3 col=mix(deep,shal,pow(yy,1.2));' +
  'col+=vec3(0.09,0.14,0.18)*tn(uv*1.6+vec2(t*0.028,t*0.02))*0.42;' +
  'float swell=0.90+0.10*sn(vec2(uv.x*1.3-t*0.075,uv.y*0.5+t*0.028)+3.0);' +
  'col*=swell;' +
  'vec2 sg=uv-SUN;float sd=dot(sg,sg);' +
  'float win=exp(-sd*2.1)*(0.85+0.15*tn(uv*3.2+t*0.14));' +
  'win*=0.90+0.10*tn(uv*9.0+vec2(t*0.30,-t*0.24));' +
  'col+=vec3(0.83,0.91,0.97)*win*0.38;' +
  'vec2 wuv=uv*vec2(2.0,2.9)+vec2(t*0.017,t*0.009);' +
  'float patch=0.42+0.58*tn(uv*1.7+vec2(t*0.042,-t*0.033)+vec2(7.7,2.2));' +
  'float sw=0.68+0.32*sin(t*0.16+uv.x*2.0+uv.y*2.8);' +
  'float c=web(wuv,t,po)*sw*patch*(0.35+0.65*yy)*cg*u_cau;' +
  'col+=vec3(0.57,0.71,0.86)*c*0.50;' +
  'col+=vec3(0.85,0.91,0.97)*pow(c,3.)*0.28;' +
  'return col;}' +
  'void main(){' +
  'vec2 uv=(gl_FragCoord.xy-.5*u_res)/min(u_res.x,u_res.y);uv.y+=0.03;float t=u_t+41.7;' +
  'uv-=vec2(0.008*sin(t*0.26),0.010*sin(t*0.20+1.3));' +
  'float py=gl_FragCoord.y/u_res.y;' +
  'vec2 L=normalize(SUN);' +
  'vec2 cs=uv/max(length(uv),0.001);' +
  'float th=atan(uv.y,uv.x);' +
  'float breath=1.+0.024*sin(t*0.45)+0.008*sin(t*0.83+1.7);' +
  'float wob=tn(cs*2.0+t*0.10);' +
  'float jelly=0.010*cos(2.*th-t*0.72)+0.006*cos(3.*th+t*0.55+1.2);' +
  'float r=0.30*breath*(1.+0.055*(wob-0.5)+jelly);' +
  'r=mix(-5.0,r,u_bubble);' +
  'vec2 tp=u_touch.xy;float td=length(uv-tp);' +
  'r+=0.030*u_touch.z*cos(td*17.-t*4.)*exp(-td*4.);' +
  'float d=length(uv)-r;' +
  'float inside=smoothstep(0.005,-0.005,d);' +
  'vec3 col=water(uv,t,py,1.0,2.3);' +
  'float lr=clamp(length(uv)/max(r,0.001),0.,1.);' +
  'float nz=sqrt(max(1.-lr*lr,0.0));' +
  'vec2 lensuv=-uv*mix(1.35,0.85,nz);' +
  'lensuv+=vec2(t*0.011,-t*0.007);' +
  'lensuv+=(0.006+0.014*(1.-nz))*vec2(tn(uv*5.+t*0.11)-0.5,tn(uv*5.-t*0.09+3.1)-0.5);' +
  'float lpy=clamp(0.5-lensuv.y*0.45,0.,1.);' +
  'vec3 thru=water(lensuv,t,1.-lpy,1.0,2.2)*1.06;' +
  'vec3 flat_=water(uv*0.98,t,py,0.9,2.2);' +
  'vec3 inCol=mix(flat_,thru,u_trn);' +
  'float face=clamp(dot(cs,L)*0.5+0.5,0.,1.);' +
  'float fres=pow(1.-nz,2.2);' +
  'vec2 refluv=vec2(uv.x,abs(uv.y)+0.3)*1.4;' +
  'vec3 sky=water(refluv+SUN*0.3,t,0.95,0.6,2.4)*1.25;' +
  'inCol=mix(inCol,sky,fres*face*0.55*u_trn);' +
  'inCol*=0.97+0.08*face;' +
  'col=mix(col,inCol,inside);' +
  'float topShade=mix(1.0,0.72+0.46*smoothstep(-1.0,1.0,uv.y/max(r,0.001)),u_shd*inside*0.7);' +
  'col*=topShade;' +
  'float sceneShade=mix(1.0,0.55+0.70*pow(py,1.1),u_shd);' +
  'col*=sceneShade;' +
  'float ev1=tn(cs*2.5+t*0.20);' +
  'float ev2=tn(cs*5.5-t*0.14+vec2(4.4,1.1));' +
  'float edgeVar=0.35+0.45*ev1+0.35*ev2*ev1;' +
  'float rimI=(0.15+0.85*pow(face,1.5))*edgeVar;' +
  'col+=vec3(0.96,0.94,0.89)*(exp(-abs(d)*22.)*0.33+exp(-abs(d)*60.)*0.17)*rimI;' +
  'col+=vec3(0.95,0.88,0.70)*exp(-abs(d)*38.)*pow(face,2.5)*0.15*edgeVar;' +
  'col+=vec3(0.44,0.54,0.74)*exp(-abs(d)*28.)*pow(1.-face,2.)*0.09;' +
  'vec2 spc=uv-normalize(SUN)*r*0.60;' +
  'vec2 tgt=vec2(-L.y,L.x);' +
  'float su=dot(spc,tgt);float sv=dot(spc,L);' +
  'float smear=exp(-(su*su*90.+sv*sv*420.));' +
  'col+=vec3(1.0,0.99,0.95)*smear*inside*0.30;' +
  'for(int i=0;i<4;i++){float fi=float(i);' +
  'float sz=mix(12000.,30000.,h(vec2(fi,3.)));' +
  'float bx=-0.45+fi*0.26+0.045*sin(t*0.28+fi*2.1);' +
  'float by=mod(t*0.027*(0.5+0.5*h(vec2(fi,1.)))+fi*0.33,1.4)-0.70;' +
  'float bd=length(uv-vec2(bx,by));' +
  'float glint=0.012+0.13*rays(vec2(bx,by),t,5.6,0.08,3.7);' +
  'col+=vec3(0.86,0.91,0.98)*glint*exp(-bd*bd*sz)*(1.-inside*0.9);}' +
  'float pulse=0.88+0.12*sin(t*0.19+1.1);' +
  'float rFar=rays(uv,t,3.2,0.05,0.0)*0.58;' +
  'float rNear=rays(uv,t,5.6,0.085,3.7);' +
  'float rThru=rays(lensuv,t,5.6,0.085,3.7);' +
  'float rb=(rFar+mix(rNear,mix(rNear,rThru,u_trn),inside))*pulse;' +
  'col+=vec3(0.81,0.90,0.98)*rb*0.38;' +
  'col+=vec3(0.96,0.92,0.82)*rb*rb*0.20;' +
  'float haze=smoothstep(0.42,0.0,py);' +
  'col=mix(col,vec3(0.040,0.070,0.135),haze*(0.28+0.14*u_shd));' +
  'col*=1.-0.16*dot(uv,uv);' +
  'col*=u_exp;' +
  'col=col*(1.0+0.7*col)/(1.0+col);' +
  'col+=(h(gl_FragCoord.xy)-0.5)*0.0078;' +
  'gl_FragColor=vec4(col,1.);}'

const BUBBLE_ROUTES = ['/dashboard', '/drumul']

export default function WaterWorld({ mode: modeProp, bubble: bubbleProp }) {
  const [mounted, setMounted] = useState(false)
  const [autoMode] = useWaterMode()
  const pathname = usePathname()
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  const mode = modeProp || autoMode
  const bubble = bubbleProp !== undefined ? bubbleProp : BUBBLE_ROUTES.includes(pathname)

  const [reducedMotion, setReducedMotion] = useState(false)
  const [broken, setBroken] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      const apply = () => setReducedMotion(mq.matches)
      apply()
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    } catch (e) {}
  }, [])

  // ținta curentă (zi/seară) — citită live în bucla de desen printr-un ref,
  // ca schimbarea de mode să nu ceară remontarea canvas-ului/contextului.
  const targetRef = useRef(mode === 'night' ? NIGHT : DAY)
  useEffect(() => { targetRef.current = mode === 'night' ? NIGHT : DAY }, [mode])

  const bubbleRef = useRef(bubble ? 1 : 0)
  useEffect(() => { bubbleRef.current = bubble ? 1 : 0 }, [bubble])

  useEffect(() => {
    if (!mounted || reducedMotion) return
    const wrap = wrapRef.current
    const cv = canvasRef.current
    if (!wrap || !cv) return

    // GCAO 06.08.2026 — reparație urgentă (apa invizibilă pe telefon):
    // fundalul violet vechi al body-ului (LEGEA 1, întotdeauna acolo ca
    // strat de bază) rămânea vizibil neobstrucționat de câte ori setup-ul
    // WebGL de mai jos arunca o eroare neprevăzută — canvasul rămânea
    // montat, dar niciodată desenat, fără să cadă pe fallback-ul static.
    // Acum ORICE eroare aici duce explicit la fallback (setBroken).
    let gl
    try {
      gl = cv.getContext('webgl', { antialias: false, alpha: false })
      if (!gl) { setBroken(true); return }
    } catch (e) {
      setBroken(true)
      return
    }

    // GCAO 06.08.2026 — reparație P0 (apa rămâne întunecată la revenirea
    // în filă): un browser de telefon poate revoca contextul WebGL cât
    // fila stă ascunsă (presiune de memorie) — evenimentul e
    // `webglcontextlost`. După el, ORICE apel gl.* devine un no-op tăcut
    // (nu aruncă), deci bucla „rula" dar nu mai desena nimic — canvas-ul
    // rămânea pe ultimul cadru sau negru. `webglcontextrestored` anunță
    // când browserul realocă un context nou pe ACELAȘI element canvas —
    // dar programul/buffer-ul/uniformele vechi sunt pierdute și trebuie
    // create din nou. initGL() e reutilizabilă exact pentru asta: rulează
    // o dată la montare, și din nou la fiecare restaurare.
    let pr, uT, uR, uTo, uE, uS, uC, uB
    let glReady = false

    function initGL() {
      glReady = false
      try {
        const sh = (t, s) => {
          const o = gl.createShader(t)
          gl.shaderSource(o, s)
          gl.compileShader(o)
          if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) {
            throw new Error('compilare shader esuata: ' + gl.getShaderInfoLog(o))
          }
          return o
        }
        pr = gl.createProgram()
        gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS))
        gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS))
        gl.linkProgram(pr)
        if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
          throw new Error('link program esuat: ' + gl.getProgramInfoLog(pr))
        }
        gl.useProgram(pr)
        const buf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
        const lp = gl.getAttribLocation(pr, 'p')
        gl.enableVertexAttribArray(lp)
        gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0)
        uT = gl.getUniformLocation(pr, 'u_t')
        uR = gl.getUniformLocation(pr, 'u_res')
        uTo = gl.getUniformLocation(pr, 'u_touch')
        uE = gl.getUniformLocation(pr, 'u_exp')
        uS = gl.getUniformLocation(pr, 'u_shd')
        uC = gl.getUniformLocation(pr, 'u_cau')
        uB = gl.getUniformLocation(pr, 'u_bubble')
        glReady = true
        setBroken(false)
      } catch (e) {
        setBroken(true)
      }
    }

    initGL()
    if (!glReady) return

    function onContextLost(e) {
      e.preventDefault() // obligatoriu — altfel browserul nu mai încearcă să restaureze
      glReady = false
      stop()
    }
    function onContextRestored() {
      initGL()
      if (glReady) evaluate()
    }
    cv.addEventListener('webglcontextlost', onContextLost, false)
    cv.addEventListener('webglcontextrestored', onContextRestored, false)

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    function resize() {
      cv.width = Math.max(1, Math.round(window.innerWidth * dpr))
      cv.height = Math.max(1, Math.round(window.innerHeight * dpr))
      if (glReady) gl.viewport(0, 0, cv.width, cv.height)
    }
    resize()
    window.addEventListener('resize', resize)

    let tx = 0, ty = 0, ts = 0
    function setTouch(e) {
      const x = e.clientX * dpr, y = e.clientY * dpr
      const m = Math.min(cv.width, cv.height)
      tx = (x - cv.width * 0.5) / m
      ty = (cv.height * 0.5 - y) / m + 0.03
      ts = 1
    }
    function onDown(e) { setTouch(e) }
    function onMove(e) { if (e.buttons || e.pointerType === 'touch') setTouch(e) }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)

    const cur = { e: DAY.e, s: DAY.s, c: DAY.c }
    let simT = 0
    let last = performance.now()
    let lastDraw = 0
    let rafId = 0
    let running = false

    function tick(now) {
      rafId = requestAnimationFrame(tick)
      if (!glReady) return // context pierdut intre timp — onContextLost va opri bucla oricum
      if (now - lastDraw < FRAME_BUDGET_MS) return // plafon ~40fps, ca in macheta
      lastDraw = now
      const dt = (now - last) / 1000
      last = now
      const tgt = targetRef.current
      cur.e += (tgt.e - cur.e) * LERP
      cur.s += (tgt.s - cur.s) * LERP
      cur.c += (tgt.c - cur.c) * LERP
      simT += dt * SPEED
      ts *= 0.965
      gl.uniform1f(uT, simT)
      gl.uniform2f(uR, cv.width, cv.height)
      gl.uniform3f(uTo, tx, ty, ts)
      gl.uniform1f(uE, cur.e)
      gl.uniform1f(uS, cur.s)
      gl.uniform1f(uC, cur.c)
      gl.uniform1f(uB, bubbleRef.current)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    function start() {
      if (running) return
      running = true
      last = performance.now()
      rafId = requestAnimationFrame(tick)
    }
    function stop() {
      running = false
      cancelAnimationFrame(rafId)
    }

    // GCAO 06.08.2026 — reparație urgentă: nu mai ținem un `isHidden`
    // cache-uit o singură dată la montare (risc: dacă document.hidden citea
    // greșit true chiar atunci și niciun eveniment visibilitychange nu mai
    // vine după aia pe un browser mobil anume, bucla nu mai pornea
    // NICIODATĂ). Citim document.hidden LIVE, de fiecare dată. Plus o
    // reverificare de siguranță la scurt timp după montare, în caz că
    // IntersectionObserver întârzie primul callback pe un device anume.
    let isIntersecting = true
    function evaluate() {
      if (!document.hidden && isIntersecting && glReady) start()
      else stop()
    }
    function onVis() { evaluate() }
    document.addEventListener('visibilitychange', onVis)

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting
      evaluate()
    }, { threshold: 0.01 })
    io.observe(wrap)

    evaluate()
    // plasă de siguranță: dacă IntersectionObserver întârzie primul
    // callback pe un device anume, mai reîncercăm o dată, curând.
    const safetyTimer = setTimeout(evaluate, 400)

    return () => {
      stop()
      clearTimeout(safetyTimer)
      document.removeEventListener('visibilitychange', onVis)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      cv.removeEventListener('webglcontextlost', onContextLost, false)
      cv.removeEventListener('webglcontextrestored', onContextRestored, false)
      if (glReady) {
        const lose = gl.getExtension('WEBGL_lose_context')
        if (lose) lose.loseContext()
      }
    }
  }, [mounted, reducedMotion])

  if (!mounted) return null

  const showStatic = reducedMotion || broken
  const tone = mode === 'night' ? '#070b14' : '#0B1220'

  // REPARAȚIE URGENTĂ 06.08.2026 — z-index aliniat exact cu valoarea
  // dovedită a fostului strat global (.watervideo, z-index:0), nu -1
  // (necesar/netestat anterior). #app-surface (z-index:1) și .room-shell
  // (z-index:2) rămân deasupra, neatinse.
  const layer = (
    <div ref={wrapRef} style={{ position: 'fixed', inset: 0, zIndex: 0, background: tone }} aria-hidden="true">
      {!showStatic && (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      )}
    </div>
  )
  return createPortal(layer, document.body)
}
