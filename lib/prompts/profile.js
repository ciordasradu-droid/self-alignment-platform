// lib/prompts/profile.js

export function buildProfilePrompt(calculatedData, fullName) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const a  = enriched.astrology
  const hd = enriched.human_design

  const keyGatesBlock = hd.key_gates?.join('\n') || ''
  const channelsBlock = hd.formed_channels?.length
    ? hd.formed_channels.join(', ')
    : 'no full channels formed'
  const definedBlock   = hd.defined_centers?.join(', ') || 'none'
  const undefinedBlock = hd.undefined_centers?.join(', ') || 'none'
  const allGatesBlock  = hd.all_active_gates?.join(', ') || ''

  return `Scrii un profil personal pentru ${fullName}.

Misiunea ta: să facă această persoană să se simtă profund înțeleasă — nu analizată. Ca și cum un prieten inteligent care a studiat aceste sisteme i-ar vorbi direct, cu căldură și claritate. Nu mistic. Nu clinic. Nu guru.

═══════════════════════════════
REGULI STRICTE DE SCRIERE
═══════════════════════════════

REGULA 1 — Observația prima, sursa după.
Structura oricărei fraze: întâi ce observi despre această persoană (concret, uman), apoi — dacă e util — de unde știi asta din date. Niciodată invers.
Greșit: "Gate 58 îți dă energie pură de viață."
Bun: "Ai o capacitate naturală să aduci viață într-un spațiu — să-l faci mai luminos, mai prietenos, mai viu. Asta vine dintr-un element specific al profilului (gate 58, dacă vrei să cauți mai departe)."

REGULA 2 — Niciun termen tehnic fără traducere imediată.
Niciodată nu folosi un termen din Human Design, numerologie sau astrologie fără să-l explici imediat în limbaj uman. Dacă îl menționezi, explică-l în același paragraf.
Greșit: "Sacral-ul tău este definit."
Bun: "Ai un motor intern de energie care se aprinde când ești cu adevărat interesat de ceva — în Human Design se numește sacral, dar nu trebuie să reții termenul."

REGULA 3 — Ton: prieten cald și direct, nu guru.
Fără "ai o misiune profundă de serviciu". Fără "sufletul tău cere". Fără limbaj mistic sau terapeutic formal. Scrie ca un om care gândește în română și îți spune adevărul cu grijă.
Greșit: "Ești o ființă generator cu o misiune de serviciu profund."
Bun: "Ești cineva care prinde aripi când ajută pe alții — nu din datorie, ci pentru că asta te încarcă. Dar cu o condiție: să fie ajutor pe care tu l-ai ales, nu pe care ți-a picat în cap."

REGULA 4 — Nu traduce mecanic din engleză.
"Wait to respond" nu se traduce "așteaptă să răspunzi". Reformulează în română naturală, cum ar spune cineva care vorbește zilnic despre asta.
Greșit: "Strategia ta este să aștepți să răspunzi."
Bun: "Nu te arunca — lasă viața să aducă lucrurile spre tine și răspunde la ce te atrage cu adevărat."

REGULA 5 — Fără etichete numerice ca subiecte.
"Life Path 9", "Expression 4", "Soul Urge 1" nu apar ca etichete în text. Descrie ce înseamnă. Dacă e util să menționezi numărul, pune-l în paranteză la final.
Greșit: "Life Path 9 al tău te trimite către serviciu."
Bun: "Există ceva în tine care se liniștește când munca ta are sens pentru alții — e parte din codul tău profund (life path 9, pentru cine vrea să exploreze)."

REGULA 6 — Concretețe obligatorie.
Fiecare observație trebuie să poată fi testată în viața de ieri sau azi. Dacă o frază e atât de generală încât se potrivește oricui, taie-o.
Greșit: "Ai un intelect practic și ordonat."
Bun: "Când cineva îți dă o problemă haotică, tu o desfaci în bucăți și o rezolvi — e felul tău natural de a gândi, și se vede cel mai clar când lucrezi la ceva ce îți pasă."

REGULA 7 — Paragrafe, nu liste cu bullet points.
Scrie text care se citește ca o scrisoare despre cineva, nu ca o listă de caracteristici. Secțiunile pot exista, dar în interiorul fiecăreia: paragrafe fluente.

REGULA 8 — Umbre pentru fiecare forță.
Orice forță are un revers. Dacă cineva are energie de bucurie, numește și când devine perfecționism sau neliniște. Asta face un profil să pară sincer, nu flatant.

REGULA 9 — Română corectă și naturală.
Fără construcții traduse din engleză. Fără limbaj care sună artificial. Scrie cum gândește un om care se exprimă natural în română.

Cuvinte INTERZISE: "unic", "special", "călătorie", "rezonă", "vibrație", "frecvență", "univers", "manifestă", "aliniat", "misiune profundă", "sufletul tău".

═══════════════════════════════
DATELE PROFILULUI
═══════════════════════════════

NUMEROLOGIE:
- Calea vieții: ${n.life_path} — ${n.life_path_meaning}
- Numărul expresiei: ${n.expression} — ${n.expression_meaning}
- Dorința sufletului: ${n.soul_urge} — ${n.soul_urge_meaning}
- Numărul personalității: ${n.personality}
- Anul personal: ${n.personal_year?.personal_year} din 9 — ${n.personal_year?.theme}
- Focus anul personal: ${n.personal_year?.focus}
- Atenție anul personal: ${n.personal_year?.warning}

ASTROLOGIE:
- Semnul solar: ${a.sun_sign} (element: ${a.element} / modalitate: ${a.modality})
- Planeta conducătoare: ${a.ruling_planet}
- Trăsături de bază: ${a.core_traits?.join(', ')}

HUMAN DESIGN:
- Tipul: ${hd.type}
- Profilul: ${hd.profile}
- Autoritatea: ${hd.authority}
- Strategia: ${hd.strategy_plain}
- Semnătura (cum se simte când e pe drumul lui): ${hd.signature}
- Semnalul de alarmă (cum se simte când e rătăcit): ${hd.not_self_theme_plain}
- Energia: ${hd.energy_type_plain}
- Stilul de lucru: ${hd.work_style_plain}
- Crucea încarnării: ${hd.incarnation_cross}
- Centre definite: ${definedBlock}
- Centre nedefinite: ${undefinedBlock}
- Canale formate: ${channelsBlock}
- Toate porțile active: ${allGatesBlock}

PORȚI CHEIE (cele mai importante — explică fiecare în termeni umani):
${keyGatesBlock}

═══════════════════════════════
FORMAT OUTPUT
═══════════════════════════════

Returnează DOAR JSON valid, fără markdown, fără explicații.

{
  "blueprint": "3-4 propoziții. Deschide cu cine este fundamental această persoană — tipul ei de energie (HD), ce o motivează în profunzime (calea vieții), și momentul în care se află acum (anul personal). Explică ciclul: 'Ești în anul X dintr-un ciclu de 9 ani — ce înseamnă asta concret.' Fă-o să sune ca începutul unei scrisori scrise special pentru ei. Nicio etichetă tehnică fără explicație.",

  "strengths": [
    "Paragraf de 2-3 propoziții. Prima propoziție: observația umană concretă despre această persoană — ceva ce ar putea recunoaște în viața lor de ieri. A doua: de unde vine asta în datele lor (poartă, canal sau număr — explică ce este acel element, nu doar ce dă). A treia: când această forță strălucește cel mai tare. Fără bullet points, fără etichete ca subiecte.",
    "Același format — 5 forțe total, fiecare un paragraf real, fiecare referind ceva specific din date cu explicație",
    "A treia forță",
    "A patra forță",
    "A cincea forță"
  ],

  "vulnerabilities": [
    "Paragraf de 2-3 propoziții. Numește tiparele cu onestitate — nu ca defecte, ci ca lucruri de înțeles. Explică din ce parte a datelor vine această tendință (poartă, centru nedefinit sau număr — cu explicație). Termină cu un lucru concret pe care îl pot face diferit mâine.",
    "Același format — 4 vulnerabilități total",
    "A treia vulnerabilitate",
    "A patra vulnerabilitate"
  ],

  "energy_patterns": [
    "Paragraf complet despre când energia lor e la maximum — de ce, ce o declanșează, ce să facă cu ea. Referință la centrele definite, explicând ce sunt.",
    "Paragraf complet despre când energia scade — de ce, semnele de avertizare, cum să gestioneze. Referință la centrele nedefinite sau semnalul de alarmă al tipului lor.",
    "Paragraf complet despre cum elementul astrologic (${a.element}) le modelează ritmul zilnic de energie — concret, nu abstract.",
    "Paragraf complet despre ce face anul personal ${n.personal_year?.personal_year} energiei lor chiar acum — explică ciclul de 9 ani, ce aduce acest an specific."
  ],

  "sabotage_tendencies": [
    "Paragraf complet — numește un tipar specific de auto-sabotaj, urmărește-l înapoi la o poartă sau număr (cu explicație), explică ce îl declanșează și care e ieșirea concretă.",
    "Același format — 4 tipare total",
    "Al treilea tipar",
    "Al patrulea tipar"
  ],

  "decision_making": [
    "Paragraf complet explicând autoritatea lor (${hd.authority}) în limbaj complet uman — cum se simte în corp, cum să o folosească practic, cu un exemplu concret din viața de zi cu zi. Explică ce înseamnă 'autoritate' în Human Design înainte să spui ce face a lor.",
    "Paragraf complet despre cum dorința profundă a persoanei (soul urge ${n.soul_urge} — ${n.soul_urge_meaning}) filtrează ce vrea cu adevărat versus ce crede că ar trebui să vrea.",
    "Paragraf complet despre tensiunea sau armonia dintre autoritatea lor și semnul solar — ${a.sun_sign} sprijină sau se bate cu stilul lor de decizie?"
  ],

  "work_discipline": [
    "Paragraf complet despre cum lucrează cel mai bine această persoană — tipul HD, canalele lor, ce fel de muncă îi aprinde energia.",
    "Paragraf complet despre o poartă specifică din design care modelează abordarea lor față de muncă — explică ce este acea poartă și cum se vede în comportamentul lor concret.",
    "Paragraf complet despre ce înseamnă numărul expresiei lor (${n.expression} — ${n.expression_meaning}) profesional — fără etichetă ca subiect.",
    "Paragraf complet despre ce înseamnă pentru munca lor anul personal ${n.personal_year?.personal_year} chiar acum — ghidaj concret, nu generic."
  ],

  "commitments": [
    "Scris ca 'Mă angajez să...' — specific, personal, fundamentat într-o poartă sau centru din design. 2-3 propoziții. Trebuie să sune ca ceva ce această persoană ar spune cu adevărat despre sine.",
    "Scris ca 'Mă angajez să...' — fundamentat în tipul HD și cum lucrează cel mai bine. 2-3 propoziții.",
    "Scris ca 'Mă angajez să...' — fundamentat în tema anului personal ${n.personal_year?.personal_year} (${n.personal_year?.theme}). 2-3 propoziții."
  ],

  "glossary": {
    "intro": "O propoziție introductivă: 'Dacă vrei să înțelegi mai bine termenii din spatele profilului tău, iată o scurtă explicație a fiecăruia.'",
    "terms": [
      { "term": "Calea vieții (Life Path)", "definition": "Un număr calculat din data nașterii care descrie tema centrală a vieții tale — ce fel de experiențe vei atrage și ce ai de învățat." },
      { "term": "Expresia (Expression Number)", "definition": "Calculat din numele complet la naștere — descrie cum te exprimi natural în lume și ce talente îți sunt native." },
      { "term": "Dorința sufletului (Soul Urge)", "definition": "Calculat din vocalele numelui — descrie ce îți dorești cu adevărat în interior, dincolo de ce arăți lumii." },
      { "term": "Anul personal", "definition": "Ești mereu într-unul din 9 ani dintr-un ciclu numerologic. Fiecare an are o temă diferită — unii sunt de construcție, alții de recoltă, alții de transformare." },
      { "term": "Tipul (Human Design Type)", "definition": "În Human Design, există 5 tipuri de oameni — fiecare cu o strategie diferită de a-și folosi energia și de a interacționa cu lumea." },
      { "term": "Autoritatea (Authority)", "definition": "Mecanismul intern prin care iei decizii bune pentru tine — poate fi o senzație în corp, o claritate care vine cu vocea, sau altceva. Diferit de la om la om." },
      { "term": "Centrul (Center)", "definition": "Human Design mapează 9 centre energetice în corpul uman. Cele 'definite' sunt surse constante de energie sau trăsături. Cele 'nedefinite' sunt zone unde absorbi și amplifici energii din exterior." },
      { "term": "Poarta (Gate)", "definition": "O componentă specifică a design-ului tău — fiecare poartă are o temă, o energie sau un mod de a privi lumea. Ai zeci de porți active, dar câteva sunt dominante." },
      { "term": "Canalul (Channel)", "definition": "Când două porți compatibile sunt ambele active, formează un canal — o trăsătură sau un flux de energie care funcționează constant în tine." },
      { "term": "Crucea încarnării (Incarnation Cross)", "definition": "O combinație de 4 porți care descrie tema generală a vieții tale în Human Design — direcția spre care gravitezi natural." }
    ]
  }
}`
}

export function buildSWOTPrompt(calculatedData, profileSections) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design

  return `You are writing a Self Perspective section for a personal profile.

Use the same warm, clear, grounded tone as the profile. Lead with human truths. Explain data references. No mystical language. Full paragraphs, not bullet points. Fully in the profile's language — no mixed languages.

PROFILE SUMMARY:
- Blueprint: ${profileSections.blueprint}
- Key Strengths: ${profileSections.strengths?.join(' | ')}
- Growth Areas: ${profileSections.vulnerabilities?.join(' | ')}
- HD Type: ${hd.type} — Profile ${hd.profile}
- Incarnation Cross: ${hd.incarnation_cross}
- Life Path: ${n.life_path} — ${n.life_path_meaning}
- Soul Urge: ${n.soul_urge} — ${n.soul_urge_meaning}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates: ${hd.key_gates?.join(' | ')}
- Personal Year: ${n.personal_year?.personal_year} of 9 — ${n.personal_year?.theme}

Return ONLY valid JSON, no markdown, no explanation.

{
  "strengths": [
    "2-3 sentence paragraph — a natural gift, explained as a human truth first, then traced to its source in the data",
    "Same format — 4 strengths total",
    "Third strength",
    "Fourth strength"
  ],
  "weaknesses": [
    "2-3 sentence paragraph — a growth edge, named honestly, traced to its source, one concrete reframe at the end",
    "Same format — 4 weaknesses total",
    "Third weakness",
    "Fourth weakness"
  ],
  "opportunities": [
    "2-3 sentence paragraph — a real opening available to this person right now, tied to their Personal Year ${n.personal_year?.personal_year} theme",
    "Opportunity tied to their incarnation cross purpose",
    "Opportunity tied to a specific channel or gate — explain what it is",
    "Opportunity tied to their Life Path ${n.life_path} number"
  ],
  "threats": [
    "2-3 sentence paragraph — a pattern that could pull them off track, named specifically, with one practical way to catch it early",
    "Same format — 4 threats total",
    "Third threat",
    "Fourth threat"
  ]
}`
}

export function buildAlignmentPlanPrompt(calculatedData, profileSections, swot) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology

  return `You are writing an Alignment Plan — a practical, concrete guide for how this person should direct their energy over the next 30 days and beyond.

Tone: warm but direct. Like a coach who knows their data well and cares about results. No vague advice. Every item must be something they can actually do.
Fully in the profile's language — no mixed languages.

PROFILE DATA:
- HD Type: ${hd.type}, Profile ${hd.profile}, Authority: ${hd.authority}
- Incarnation Cross: ${hd.incarnation_cross}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates: ${hd.key_gates?.join(' | ')}
- Life Path ${n.life_path} — ${n.life_path_meaning}
- Expression ${n.expression} — ${n.expression_meaning}
- Soul Urge ${n.soul_urge} — ${n.soul_urge_meaning}
- Personal Year ${n.personal_year?.personal_year} of 9: ${n.personal_year?.theme}
- Personal Year Focus: ${n.personal_year?.focus}
- Personal Year Warning: ${n.personal_year?.warning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Blueprint: ${profileSections.blueprint}
- Top Strengths: ${profileSections.strengths?.slice(0,2).join(' | ')}
- Growth Areas: ${profileSections.vulnerabilities?.slice(0,2).join(' | ')}
- Key Opportunities: ${swot.opportunities?.slice(0,2).join(' | ')}

Return ONLY valid JSON, no markdown, no explanation.

{
  "directional_clarity": {
    "life_direction": "3 sentences. Where is this person headed, based on their incarnation cross and life path? Make it feel like a compass, not a prescription.",
    "prioritize": [
      "Concrete priority — what to say yes to this month, and why it connects to their design",
      "Second priority",
      "Third priority"
    ],
    "eliminate": [
      "Concrete thing to stop doing — explain why it drains this specific person based on their data",
      "Second drain",
      "Third drain"
    ]
  },
  "structured_plan": {
    "thirty_day_focus": "One clear sentence naming Personal Year ${n.personal_year?.personal_year} (${n.personal_year?.theme}) and the one thing to focus on this month.",
    "weekly_template": [
      "Mon-Tue: specific action tied to their HD type and energy",
      "Wed-Thu: specific action tied to a gate or center",
      "Fri: specific action tied to their authority or strategy",
      "Weekend: specific rest or reflection practice tied to their energy type"
    ],
    "daily_template": [
      "Morning: specific ritual — what, how long, why it works for this person",
      "Midday: specific action — concrete, doable",
      "Evening: specific reflection — tied to their authority or personal year"
    ]
  },
  "behavioral_anchors": {
    "keystone_habits": [
      "Habit 1 — specific, doable, tied to a gate or channel",
      "Habit 2 — tied to a number",
      "Habit 3 — tied to their HD type or authority"
    ],
    "forbidden_behaviors": [
      "Never do this — explain exactly why it derails this specific person",
      "Second forbidden behavior",
      "Third forbidden behavior"
    ],
    "non_negotiables": [
      "I... — personal agreement, specific, grounded in their design",
      "Second agreement",
      "Third agreement"
    ]
  }
}`
}

export function buildActionPlanPrompt(calculatedData, profileSections) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology

  const typeGuidance = {
    'Generator':             'Practices should focus on sustainable energy output, responding to what lights you up, and building mastery through repetition.',
    'Manifesting Generator': 'Practices should support multi-directional energy, quick pivots, and informing others. Include variety and short bursts.',
    'Manifestor':            'Practices should support independent initiation, informing before acting, and managing impact on others.',
    'Projector':             'Practices should prioritize rest, recognition, waiting for the right moment, and conserving focused energy.',
    'Reflector':             'Practices should honor sensitivity to environment, slow decision-making, and lunar cycle awareness.',
  }

  return `You are creating a personalized daily practice plan — 5 to 8 concrete practices this person can start tomorrow.

Each practice must be doable with no equipment, no prior training, no cost.
Each practice must be directly connected to something specific in this person's data.
Tone: practical and warm. Explain why each practice is right for THIS person specifically.
Fully in the profile's language — no mixed languages.

PROFILE DATA:
- HD Type: ${hd.type} — ${typeGuidance[hd.type] || ''}
- Profile: ${hd.profile}
- Authority: ${hd.authority}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates:
${hd.key_gates?.join('\n')}
- Life Path ${n.life_path} — ${n.life_path_meaning}
- Soul Urge ${n.soul_urge} — ${n.soul_urge_meaning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Personal Year ${n.personal_year?.personal_year} of 9: ${n.personal_year?.theme}
- Blueprint: ${profileSections.blueprint}
- Key sabotage patterns: ${profileSections.sabotage_tendencies?.join(' | ')}

Return ONLY valid JSON, no markdown, no explanation.

{
  "practices": [
    {
      "id": "p1",
      "name": "Short name, max 6 words",
      "when": "morning",
      "duration_minutes": 10,
      "instructions": "Exactly what to do, step by step, in 2-3 concrete sentences. Tell them precisely what to do, not just what category it falls into.",
      "why_for_you": "One sentence explaining why this specific practice fits this specific person — name the gate, channel, center, or number behind it and explain what it is.",
      "frequency": "daily"
    }
  ]
}`
}