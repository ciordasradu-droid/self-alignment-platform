// Shaderele apei. Sursa vizuala: Master sectiunea 4 + imaginea-referinta.
// Regula de aur: lumina calda exista doar IN/PE apa (caustice, miez, reflexii).
// Niciun "soare" plutitor, niciun glob care arde.

// ── Zgomot simplex 2D (Ashima) + FBM. Baza undelor si a causticelor. ──
export const NOISE = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865, 0.366025404, -0.577350269, 0.024390244);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// FBM cu numar variabil de octave — degradarea de performanta scade uOctaves.
float fbm(vec2 p, float t, int octaves){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){
    if (i >= octaves) break;
    v += a * snoise(p + t * (0.06 + float(i) * 0.02));
    p *= 2.02; a *= 0.5;
  }
  return v;
}
`

// ═══════════════ FUNDALUL — suprafata de apa vazuta de aproape ═══════════════
export const WATER_VERT = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const WATER_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform float uTime;
uniform vec2  uRes;
uniform vec3  uDeep;        // indigo
uniform vec3  uPlum;        // pruna
uniform vec3  uGold;        // lumina calda
uniform float uCaustics;    // creste cu stadiul userului
uniform float uWaveAmp;
uniform float uWaveSpeed;
uniform int   uOctaves;
uniform float uMotion;      // 0 = apa statica (prefers-reduced-motion)

uniform vec2  uDropPos;     // pozitia picaturii in UV -> centrul inelelor
uniform float uDropLight;   // lumina din picatura -> reflexia pe apa
uniform float uHasDrop;    // 0 pe landing/login: acolo nu exista apa unui user

uniform vec3  uRipples[8];  // xy = centru UV, z = timpul nasterii
uniform int   uRippleCount;

${NOISE}

// Inele concentrice care se lasa pe suprafata sub picatura.
// Subtiri si clare: daca sunt late si difuze, citesc a fum/nebuloasa, nu a apa.
// NOTA: smoothstep(edge0, edge1, x) cu edge0 > edge1 e NEDEFINIT in GLSL —
// merge pe unele drivere, intoarce zero pe altele. De aia disparusera inelele.
// Forma corecta: 1.0 - smoothstep(0.0, w, x).
float band(float x, float w){ return 1.0 - smoothstep(0.0, w, x); }

float restingRings(vec2 p, vec2 c, float t){
  float d = distance(p, c);
  float rings = 0.0;
  for (int i = 0; i < 4; i++){
    float fi = float(i);
    // undele respira: se largesc si se sting, apoi se reiau
    float r = 0.055 + fi * 0.042 + sin(t * 0.35 - fi * 0.9) * 0.009;
    float w = 0.005 + fi * 0.002;                // grosime — subtire, dar vizibila
    float amp = (0.26 - fi * 0.05);
    rings += band(abs(d - r), w) * amp;
  }
  return rings;
}

// Unda nascuta dintr-o atingere: se largeste si se stinge in ~1.5s.
// Asta e limbajul tactil al aplicatiei (legea 2) — daca nu se vede, degetul
// nu primeste raspuns. Deci: lata cat sa fie evidenta, scurta cat sa nu deranjeze.
float touchRipple(vec2 p, vec3 rip, float t){
  float age = t - rip.z;
  if (age < 0.0 || age > 1.6) return 0.0;
  float d = distance(p, rip.xy);
  float r = age * 0.42;                       // viteza de largire
  float fade = 1.0 - smoothstep(0.0, 1.6, age);
  float ring = band(abs(d - r), 0.034);
  // un al doilea inel, mai slab, in urma primului — unda are corp
  float trail = band(abs(d - r * 0.72), 0.055) * 0.35;
  return (ring + trail) * fade;
}

void main(){
  vec2 uv = vUv;
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = uv * asp;

  float t = uTime * uMotion;

  // ── unde lente procedurale ──
  float w1 = fbm(p * 2.6, t * uWaveSpeed, uOctaves);
  float w2 = fbm(p * 5.4 + 13.7, t * uWaveSpeed * 0.7, uOctaves);
  float waves = (w1 * 0.65 + w2 * 0.35) * uWaveAmp;

  // ── adancimea: indigo sus -> pruna jos, framantata de unde ──
  // ATENTIE la spatiul de culoare: uDeep/uPlum vin din THREE.Color, deci sunt
  // deja LINIARE. Scriem liniar; conversia in sRGB o face pasul final al
  // composer-ului, o singura data. Orice "ridicare" manuala aici (col *= 2)
  // spala imaginea — asta a fost bug-ul care facea fundalul sa para mort.
  float depth = clamp(uv.y + waves * 0.16, 0.0, 1.0);
  vec3 col = mix(uPlum, uDeep, smoothstep(0.0, 1.0, depth));

  // apa respira cu undele — variatie, nu luminozitate in plus
  col *= 0.85 + 0.35 * (0.5 + 0.5 * waves);
  // pruna calda urca de jos: lumina se aduna sub picatura
  col += uPlum * 0.45 * smoothstep(0.9, 0.0, uv.y);

  // ── caustice: BALTI LARGI de lumina refractata, nu filamente ──
  // Nota: pow(1-abs(c1-c2), N) pe doua zgomote da fire subtiri care citesc a
  // fulger/flacara — interzis. Lumina prin apa se aduna in pete moi.
  vec2 cp = p * 1.9 + vec2(waves * 0.30, -waves * 0.22);
  float pool = fbm(cp, t * 0.10, min(uOctaves, 3));
  float caustic = smoothstep(0.10, 0.85, pool);
  // o a doua trecere, mai fina, doar cat sa nu fie o pata uniforma
  float weave = smoothstep(0.45, 0.95, fbm(cp * 2.3 + 7.1, t * 0.07, 2));
  caustic = caustic * 0.75 + weave * 0.25;
  // lumina se aduna spre baza — soarele care rasare peste apa
  caustic *= smoothstep(1.05, 0.0, uv.y);
  col += uGold * caustic * uCaustics * 0.55;

  // ── reflexia picaturii pe suprafata (lumina IN apa, nu obiect) ──
  // Nu e un glow plutitor: e lumina picaturii care cade pe apa de sub ea.
  float refl = smoothstep(0.30, 0.0, distance(p, uDropPos * asp));
  col += uGold * refl * uDropLight * 0.34 * uHasDrop;

  // ── inelele de sub picatura ──
  float rings = restingRings(p, uDropPos * asp, t);
  col += mix(vec3(0.62, 0.70, 0.88), uGold, uDropLight * 0.8) * rings * uHasDrop;

  // ── undele nascute din atingeri ──
  float touch = 0.0;
  for (int i = 0; i < 8; i++){
    if (i >= uRippleCount) break;
    touch += touchRipple(p, vec3(uRipples[i].xy * asp, uRipples[i].z), uTime);
  }
  col += mix(vec3(0.70, 0.78, 0.92), uGold, 0.45) * touch;

  // ── vignette blanda: aduna privirea, fara sa inece ecranul in negru ──
  float vig = smoothstep(1.5, 0.15, length((uv - 0.5) * vec2(asp.x, 1.0)));
  col *= 0.86 + 0.14 * vig;

  gl_FragColor = vec4(col, 1.0);
}
`

// ═══════════════ PICATURA — perlata, irizata, cu lumina in miez ═══════════════
export const DROP_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
varying vec2 vUv;
void main(){
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`

export const DROP_FRAG = /* glsl */ `
precision highp float;
varying vec3 vNormal;
varying vec3 vView;
varying vec2 vUv;

uniform float uTime;
uniform float uLight;     // 0..1 — aurul din interior
uniform float uStage;     // 1..7
uniform vec3  uPearl;
uniform vec3  uGold;
uniform vec3  uDeep;
uniform float uMotion;

${NOISE}

// Irizatie perlata: culoarea aluneca lent cu unghiul de privire.
// Paleta e RECE (albastru-roz-verde palid) — sideful de perla. O paleta calda
// aici vireaza picatura spre cupru si o scoate din vocabularul apei.
vec3 iridescence(float x){
  return 0.82 + 0.18 * cos(6.28318 * (vec3(0.60, 0.75, 0.95) * x + vec3(0.55, 0.35, 0.10)));
}

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float t = uTime * uMotion;

  // Fresnel — cheia intregii picaturi: o sfera de apa se citeste prin faptul ca
  // MARGINEA e aprinsa, iar CENTRUL e transparent. Daca ambele sunt la fel de
  // luminoase, iese un disc mat (pietricica), nu o picatura.
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.0);

  // Curenti interiori — sidef care aluneca lent. Discret: zgomotul tare
  // murdareste picatura.
  float flow = fbm(N.xy * 1.6 + vec2(0.0, t * 0.10), t * 0.30, 2);

  // PERLA, nu sticla: are corp si lumina proprie. Forma vine din lumina difuza
  // infasurata (wrap lighting) — fara ea iese disc plat; cu transparenta totala
  // iese gaura neagra. Perla sta la mijloc.
  vec3 LDIR = normalize(vec3(-0.42, 0.62, 0.66));
  float wrap = dot(N, LDIR) * 0.5 + 0.5;          // 0 in umbra, 1 in lumina
  float diff = pow(wrap, 1.35);

  vec3 irid = iridescence(fres * 0.5 + flow * 0.05 + wrap * 0.12);
  vec3 sheen = uPearl * (0.94 + 0.12 * flow);
  sheen = mix(sheen, sheen * irid, 0.30);

  // corpul perlei: umbra ei nu e neagra si nu e calda — e apa in care sta
  vec3 shadow = uDeep * 2.1 + uPearl * 0.12;
  vec3 col = mix(shadow, sheen, diff);

  // marginea aprinsa — lumina care ocoleste picatura
  col = mix(col, sheen * 1.15, fres * 0.55);

  // MIEZUL: lumina calda creste IN picatura (nu in jurul ei)
  float core = smoothstep(0.9, 0.0, length(N.xy)) * uLight;
  col = mix(col, uGold, core * 0.62);
  col += uGold * fres * (0.10 + uLight * 0.34);

  // Doua luciri: una ascutita (suprafata), una larga (interiorul perlat).
  float spec = pow(max(0.0, dot(N, normalize(vec3(-0.45, 0.72, 0.55)))), 42.0);
  float glow = pow(max(0.0, dot(N, normalize(vec3(-0.35, 0.55, 0.75)))), 5.0);
  col += vec3(1.0) * spec * 1.1;
  col += uPearl * glow * 0.16;

  // stadiul 6+: apa se organizeaza geometric (cristal), foarte discret
  if (uStage >= 6.0) {
    float facet = abs(sin(N.x * 9.0) * sin(N.y * 9.0));
    col += uGold * pow(facet, 6.0) * 0.20;
  }

  // perla are corp: e aproape opaca, dar lasa apa sa se simta la margine
  float alpha = clamp(0.86 + fres * 0.14 + spec, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}
`
