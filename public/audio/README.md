# Sunetul apei — asset în așteptare (sect. E, brief 25.07 noapte)

Componenta (`app/components/water/WaterSoundLoop.js`) și comutatorul din Setări
sunt complete și funcționale. Lipsește DOAR fișierul audio real:

- **Cale așteptată:** `public/audio/water-loop.mp3`
- **Cerințe:** un singur loop de apă calmă, fără muzică, buclă perfectă
  (fără cusătură auzibilă la reluare).
- **Disciplina de licențiere — aceeași ca la plăcile video** (vezi
  `public/videos/`): sursă comercial curată, licența documentată AICI, în
  acest fișier, înainte de commit. Nimic „împrumutat" fără proveniență clară.

## De completat la adăugarea fișierului real:

```
Fișier:     water-loop.mp3
Sursă:      [numele bibliotecii/platformei]
Licență:    [tip licență — ex. royalty-free comercial, CC0, etc.]
Link:       [url la pagina de licențiere/achiziție]
Achiziționat/verificat de: [nume, dată]
```

Până atunci, elementul `<audio>` există în DOM cu `src="/audio/water-loop.mp3"`
(fișier absent → eroare silențioasă de rețea, ignorată de `.catch(() => {})`
în componentă) — comutatorul rămâne vizibil și funcțional, pregătit pentru
asset, nu ascuns.
