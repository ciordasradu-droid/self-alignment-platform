const PDF_LABELS = {
  en: {
    title: 'Your Alignment Profile',
    generated: 'Generated for',
    blueprint: 'Core Energetic Blueprint',
    strengths: 'Natural Strengths',
    vulnerabilities: 'Growth Opportunities',
    energy_patterns: 'Energy Patterns',
    sabotage: 'Patterns to Watch',
    decision: 'Decision-Making Style',
    work: 'Work & Discipline Profile',
    self_perspective: 'Self Perspective',
    str: 'Natural Gifts',
    weak: 'Growth Edges',
    opp: 'Opportunities to Shine',
    threats: 'Patterns to Release',
    alignment_plan: 'Alignment Plan',
    layer1: 'Layer 1 — Directional Clarity',
    prioritize: 'Energize — Prioritize',
    eliminate: 'Release — Let Go',
    layer2: 'Layer 2 — Structured Plan',
    focus: '30-Day Focus',
    weekly: 'Weekly Template',
    daily: 'Daily Template',
    layer3: 'Layer 3 — Behavioral Anchors',
    habits: 'Keystone Habits',
    forbidden: 'Forbidden Behaviors',
    agreements: 'My Agreements',
    footer: 'Self Alignment Platform — Confidential'
  },
  ro: {
    title: 'Profilul Tău de Aliniere',
    generated: 'Generat pentru',
    blueprint: 'Planul Energetic Central',
    strengths: 'Puncte Forte Naturale',
    vulnerabilities: 'Oportunități de Creștere',
    energy_patterns: 'Tipare de Energie',
    sabotage: 'Tipare de Urmărit',
    decision: 'Stilul de Luare a Deciziilor',
    work: 'Profilul de Muncă și Disciplină',
    self_perspective: 'Perspectivă Personală',
    str: 'Daruri Naturale',
    weak: 'Zone de Creștere',
    opp: 'Oportunități de Strălucire',
    threats: 'Tipare de Eliberat',
    alignment_plan: 'Plan de Aliniere',
    layer1: 'Stratul 1 — Claritate Direcțională',
    prioritize: 'Energizează — Prioritizează',
    eliminate: 'Eliberează — Lasă să Plece',
    layer2: 'Stratul 2 — Plan Structurat',
    focus: 'Focalizare pe 30 de Zile',
    weekly: 'Șablon Săptămânal',
    daily: 'Șablon Zilnic',
    layer3: 'Stratul 3 — Ancore Comportamentale',
    habits: 'Obiceiuri Cheie',
    forbidden: 'Comportamente Interzise',
    agreements: 'Acordurile Mele',
    footer: 'Platforma de Aliniere Personală — Confidențial'
  },
  es: {
    title: 'Tu Perfil de Alineación',
    generated: 'Generado para',
    blueprint: 'Plano Energético Central',
    strengths: 'Fortalezas Naturales',
    vulnerabilities: 'Oportunidades de Crecimiento',
    energy_patterns: 'Patrones de Energía',
    sabotage: 'Patrones a Observar',
    decision: 'Estilo de Toma de Decisiones',
    work: 'Perfil de Trabajo y Disciplina',
    self_perspective: 'Perspectiva Personal',
    str: 'Dones Naturales',
    weak: 'Bordes de Crecimiento',
    opp: 'Oportunidades para Brillar',
    threats: 'Patrones a Liberar',
    alignment_plan: 'Plan de Alineación',
    layer1: 'Capa 1 — Claridad Direccional',
    prioritize: 'Energizar — Priorizar',
    eliminate: 'Liberar — Dejar Ir',
    layer2: 'Capa 2 — Plan Estructurado',
    focus: 'Enfoque de 30 Días',
    weekly: 'Plantilla Semanal',
    daily: 'Plantilla Diaria',
    layer3: 'Capa 3 — Anclajes Conductuales',
    habits: 'Hábitos Clave',
    forbidden: 'Comportamientos Prohibidos',
    agreements: 'Mis Acuerdos',
    footer: 'Plataforma de Alineación Personal — Confidencial'
  },
  fr: {
    title: "Votre Profil d'Alignement",
    generated: 'Généré pour',
    blueprint: 'Plan Énergétique Central',
    strengths: 'Forces Naturelles',
    vulnerabilities: 'Opportunités de Croissance',
    energy_patterns: "Schémas d'Énergie",
    sabotage: 'Schémas à Observer',
    decision: 'Style de Prise de Décision',
    work: 'Profil de Travail et Discipline',
    self_perspective: 'Perspective Personnelle',
    str: 'Dons Naturels',
    weak: 'Zones de Croissance',
    opp: 'Opportunités de Briller',
    threats: 'Schémas à Libérer',
    alignment_plan: "Plan d'Alignement",
    layer1: 'Couche 1 — Clarté Directionnelle',
    prioritize: 'Énergiser — Prioriser',
    eliminate: 'Libérer — Laisser Aller',
    layer2: 'Couche 2 — Plan Structuré',
    focus: 'Objectif sur 30 Jours',
    weekly: 'Modèle Hebdomadaire',
    daily: 'Modèle Quotidien',
    layer3: 'Couche 3 — Ancres Comportementales',
    habits: 'Habitudes Clés',
    forbidden: 'Comportements Interdits',
    agreements: 'Mes Engagements',
    footer: "Plateforme d'Alignement Personnel — Confidentiel"
  },
  de: {
    title: 'Dein Ausrichtungsprofil',
    generated: 'Erstellt für',
    blueprint: 'Zentraler Energieplan',
    strengths: 'Natürliche Stärken',
    vulnerabilities: 'Wachstumschancen',
    energy_patterns: 'Energiemuster',
    sabotage: 'Muster zu Beobachten',
    decision: 'Entscheidungsstil',
    work: 'Arbeits- und Disziplinprofil',
    self_perspective: 'Persönliche Perspektive',
    str: 'Natürliche Gaben',
    weak: 'Wachstumsbereiche',
    opp: 'Chancen zu Glänzen',
    threats: 'Muster Loszulassen',
    alignment_plan: 'Ausrichtungsplan',
    layer1: 'Schicht 1 — Richtungsklarheit',
    prioritize: 'Energetisieren — Priorisieren',
    eliminate: 'Loslassen',
    layer2: 'Schicht 2 — Strukturierter Plan',
    focus: '30-Tage-Fokus',
    weekly: 'Wöchentliche Vorlage',
    daily: 'Tägliche Vorlage',
    layer3: 'Schicht 3 — Verhaltensanker',
    habits: 'Schlüsselgewohnheiten',
    forbidden: 'Verbotene Verhaltensweisen',
    agreements: 'Meine Vereinbarungen',
    footer: 'Persönliche Ausrichtungsplattform — Vertraulich'
  },
  it: {
    title: 'Il Tuo Profilo di Allineamento',
    generated: 'Generato per',
    blueprint: 'Piano Energetico Centrale',
    strengths: 'Punti di Forza Naturali',
    vulnerabilities: 'Opportunità di Crescita',
    energy_patterns: 'Schemi di Energia',
    sabotage: 'Schemi da Osservare',
    decision: 'Stile Decisionale',
    work: 'Profilo di Lavoro e Disciplina',
    self_perspective: 'Prospettiva Personale',
    str: 'Doni Naturali',
    weak: 'Aree di Crescita',
    opp: 'Opportunità di Brillare',
    threats: 'Schemi da Liberare',
    alignment_plan: 'Piano di Allineamento',
    layer1: 'Strato 1 — Chiarezza Direzionale',
    prioritize: 'Energizzare — Prioritizzare',
    eliminate: 'Liberare — Lasciar Andare',
    layer2: 'Strato 2 — Piano Strutturato',
    focus: 'Focus di 30 Giorni',
    weekly: 'Modello Settimanale',
    daily: 'Modello Giornaliero',
    layer3: 'Strato 3 — Ancore Comportamentali',
    habits: 'Abitudini Chiave',
    forbidden: 'Comportamenti Vietati',
    agreements: 'I Miei Accordi',
    footer: 'Piattaforma di Allineamento Personale — Riservato'
  },
  pt: {
    title: 'Seu Perfil de Alinhamento',
    generated: 'Gerado para',
    blueprint: 'Plano Energético Central',
    strengths: 'Forças Naturais',
    vulnerabilities: 'Oportunidades de Crescimento',
    energy_patterns: 'Padrões de Energia',
    sabotage: 'Padrões a Observar',
    decision: 'Estilo de Tomada de Decisão',
    work: 'Perfil de Trabalho e Disciplina',
    self_perspective: 'Perspectiva Pessoal',
    str: 'Dons Naturais',
    weak: 'Áreas de Crescimento',
    opp: 'Oportunidades de Brilhar',
    threats: 'Padrões a Liberar',
    alignment_plan: 'Plano de Alinhamento',
    layer1: 'Camada 1 — Clareza Direcional',
    prioritize: 'Energizar — Priorizar',
    eliminate: 'Liberar — Deixar Ir',
    layer2: 'Camada 2 — Plano Estruturado',
    focus: 'Foco de 30 Dias',
    weekly: 'Modelo Semanal',
    daily: 'Modelo Diário',
    layer3: 'Camada 3 — Âncoras Comportamentais',
    habits: 'Hábitos Essenciais',
    forbidden: 'Comportamentos Proibidos',
    agreements: 'Meus Acordos',
    footer: 'Plataforma de Alinhamento Pessoal — Confidencial'
  },
  nl: {
    title: 'Jouw Uitlijningsprofiel',
    generated: 'Gegenereerd voor',
    blueprint: 'Centraal Energetisch Blauwdruk',
    strengths: 'Natuurlijke Sterktes',
    vulnerabilities: 'Groeikansen',
    energy_patterns: 'Energiepatronen',
    sabotage: 'Patronen om te Observeren',
    decision: 'Besluitvormingsstijl',
    work: 'Werk- en Disciplineprofiel',
    self_perspective: 'Persoonlijk Perspectief',
    str: 'Natuurlijke Gaven',
    weak: 'Groeigebieden',
    opp: 'Kansen om te Schitteren',
    threats: 'Patronen los te Laten',
    alignment_plan: 'Uitlijningsplan',
    layer1: 'Laag 1 — Richtingshelderheid',
    prioritize: 'Energetiseren — Prioriteren',
    eliminate: 'Loslaten',
    layer2: 'Laag 2 — Gestructureerd Plan',
    focus: '30-Dagen Focus',
    weekly: 'Weeksjabloon',
    daily: 'Dagsjabloon',
    layer3: 'Laag 3 — Gedragsankers',
    habits: 'Sleutelgewoonten',
    forbidden: 'Verboden Gedragingen',
    agreements: 'Mijn Afspraken',
    footer: 'Persoonlijk Uitlijningsplatform — Vertrouwelijk'
  },
  pl: {
    title: 'Twój Profil Wyrównania',
    generated: 'Wygenerowano dla',
    blueprint: 'Centralny Plan Energetyczny',
    strengths: 'Naturalne Mocne Strony',
    vulnerabilities: 'Możliwości Rozwoju',
    energy_patterns: 'Wzorce Energii',
    sabotage: 'Wzorce do Obserwowania',
    decision: 'Styl Podejmowania Decyzji',
    work: 'Profil Pracy i Dyscypliny',
    self_perspective: 'Osobista Perspektywa',
    str: 'Naturalne Dary',
    weak: 'Obszary Wzrostu',
    opp: 'Możliwości Błyszczenia',
    threats: 'Wzorce do Uwolnienia',
    alignment_plan: 'Plan Wyrównania',
    layer1: 'Warstwa 1 — Jasność Kierunkowa',
    prioritize: 'Energetyzować — Priorytetyzować',
    eliminate: 'Uwolnić — Puścić',
    layer2: 'Warstwa 2 — Ustrukturyzowany Plan',
    focus: 'Skupienie na 30 Dni',
    weekly: 'Szablon Tygodniowy',
    daily: 'Szablon Dzienny',
    layer3: 'Warstwa 3 — Kotwice Behawioralne',
    habits: 'Kluczowe Nawyki',
    forbidden: 'Zakazane Zachowania',
    agreements: 'Moje Umowy',
    footer: 'Platforma Osobistego Wyrównania — Poufne'
  },
  hu: {
    title: 'Az Ön Igazítási Profilja',
    generated: 'Létrehozva',
    blueprint: 'Központi Energetikai Terv',
    strengths: 'Természetes Erősségek',
    vulnerabilities: 'Növekedési Lehetőségek',
    energy_patterns: 'Energia Minták',
    sabotage: 'Megfigyelendő Minták',
    decision: 'Döntéshozatali Stílus',
    work: 'Munka és Fegyelem Profil',
    self_perspective: 'Személyes Perspektíva',
    str: 'Természetes Adottságok',
    weak: 'Növekedési Területek',
    opp: 'Ragyogási Lehetőségek',
    threats: 'Feloldandó Minták',
    alignment_plan: 'Igazítási Terv',
    layer1: '1. Réteg — Irányvonal Tisztaság',
    prioritize: 'Energizálás — Priorizálás',
    eliminate: 'Elengedés',
    layer2: '2. Réteg — Strukturált Terv',
    focus: '30 Napos Fókusz',
    weekly: 'Heti Sablon',
    daily: 'Napi Sablon',
    layer3: '3. Réteg — Viselkedési Horgonyok',
    habits: 'Kulcs Szokások',
    forbidden: 'Tiltott Viselkedések',
    agreements: 'Megállapodásaim',
    footer: 'Személyes Igazítási Platform — Bizalmas'
  }
}

function getLabels(language) {
  return PDF_LABELS[language] || PDF_LABELS['en']
}

function esc(text) {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function bullets(items, color) {
  if (!items || !items.length) return ''
  return items.map(i => `<li style="color:${color}">${esc(i)}</li>`).join('')
}

export async function generateProfilePDF(profile) {
  const { full_name, sections, swot, alignment_plan, language = 'en', personal_year } = profile
  const L = getLabels(language)

  const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Cormorant+Garamond:wght@400;600&display=swap" rel="stylesheet">
<title>${esc(L.title)}</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Nunito',sans-serif; background:#fff; color:#1a1a1a; font-size:12px; line-height:1.65; }
.page { max-width:740px; margin:0 auto; padding:28px; }
.header { background:linear-gradient(135deg,#1a1a2e,#2d1b4e); color:#fff; padding:22px 28px; border-radius:10px; margin-bottom:16px; }
.header h1 { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; margin-bottom:3px; }
.header p { font-size:11px; opacity:0.65; }
.py { background:#1a1a2e; border-radius:10px; padding:14px 18px; margin-bottom:14px; display:flex; gap:14px; align-items:center; }
.py-num { font-size:36px; font-weight:700; color:#E8824A; font-family:'Cormorant Garamond',serif; line-height:1; flex-shrink:0; }
.py-theme { font-size:13px; font-weight:600; color:#fff; }
.py-focus { font-size:10px; color:rgba(255,255,255,0.55); margin-top:2px; }
.section { background:#fff; border-radius:8px; border:1px solid #e8e8e4; padding:14px 16px; margin-bottom:10px; break-inside:avoid; page-break-inside:avoid; }
.tag { display:inline-block; padding:3px 10px; border-radius:20px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
.tp { background:rgba(124,92,191,0.1); color:#7C5CBF; }
.tg { background:rgba(74,155,127,0.1); color:#4A9B7F; }
.to { background:rgba(232,130,74,0.1); color:#E8824A; }
ul { list-style:none; padding:0; margin:0; }
li { padding:4px 0 4px 12px; border-bottom:1px solid #f0f0ee; font-size:11px; position:relative; }
li:last-child { border-bottom:none; }
li::before { content:'•'; position:absolute; left:1px; }
.blueprint { font-size:11px; line-height:1.75; color:#333; }
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px; }
.sub { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin:8px 0 4px; }
.italic { font-size:11px; color:#333; line-height:1.7; font-style:italic; margin-bottom:6px; }
.badge { display:inline-block; padding:2px 9px; border-radius:20px; font-size:9px; font-weight:700; color:#fff; margin-bottom:8px; }
.b1{background:#7C5CBF}.b2{background:#4A9B7F}.b3{background:#E8824A}
.footer { text-align:center; padding:14px 0 0; font-size:9px; color:#bbb; border-top:1px solid #eee; margin-top:12px; }
@media print {
  body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .section,.g2>div { break-inside:avoid; page-break-inside:avoid; }
}
</style>
</head>
<body>
<div class="page">

<div class="header">
  <h1>${esc(L.title)}</h1>
  <p>${esc(L.generated)} ${esc(full_name)}</p>
</div>

${personal_year ? `<div class="py">
  <div class="py-num">${personal_year.personal_year}</div>
  <div><div class="py-theme">${esc(personal_year.theme)}</div><div class="py-focus">${esc(personal_year.focus)}</div></div>
</div>` : ''}

<div class="section">
  <div class="tag tp">${esc(L.blueprint)}</div>
  <p class="blueprint">${esc(sections?.blueprint || '')}</p>
</div>

<div class="g2">
  <div class="section"><div class="tag tg">${esc(L.strengths)}</div><ul>${bullets(sections?.strengths, '#4A9B7F')}</ul></div>
  <div class="section"><div class="tag to">${esc(L.vulnerabilities)}</div><ul>${bullets(sections?.vulnerabilities, '#E8824A')}</ul></div>
</div>

<div class="g2">
  <div class="section"><div class="tag tp">${esc(L.energy_patterns)}</div><ul>${bullets(sections?.energy_patterns, '#7C5CBF')}</ul></div>
  <div class="section"><div class="tag to">${esc(L.sabotage)}</div><ul>${bullets(sections?.sabotage_tendencies, '#E8824A')}</ul></div>
</div>

<div class="g2">
  <div class="section"><div class="tag tg">${esc(L.decision)}</div><ul>${bullets(sections?.decision_making, '#4A9B7F')}</ul></div>
  <div class="section"><div class="tag tp">${esc(L.work)}</div><ul>${bullets(sections?.work_discipline, '#7C5CBF')}</ul></div>
</div>

<div class="section">
  <div class="tag to">${esc(L.self_perspective)}</div>
  <div class="g2" style="margin-top:6px;margin-bottom:0">
    <div><div class="sub" style="color:#4A9B7F">${esc(L.str)}</div><ul>${bullets(swot?.strengths, '#4A9B7F')}</ul></div>
    <div><div class="sub" style="color:#E8824A">${esc(L.weak)}</div><ul>${bullets(swot?.weaknesses, '#E8824A')}</ul></div>
    <div><div class="sub" style="color:#7C5CBF">${esc(L.opp)}</div><ul>${bullets(swot?.opportunities, '#7C5CBF')}</ul></div>
    <div><div class="sub" style="color:#E8824A">${esc(L.threats)}</div><ul>${bullets(swot?.threats, '#E8824A')}</ul></div>
  </div>
</div>

<div class="section">
  <div class="tag tp">${esc(L.alignment_plan)}</div>
  <div class="badge b1">${esc(L.layer1)}</div>
  <p class="italic">${esc(alignment_plan?.directional_clarity?.life_direction || '')}</p>
  <div class="g2" style="margin-bottom:0">
    <div><div class="sub" style="color:#4A9B7F">${esc(L.prioritize)}</div><ul>${bullets(alignment_plan?.directional_clarity?.prioritize, '#4A9B7F')}</ul></div>
    <div><div class="sub" style="color:#E8824A">${esc(L.eliminate)}</div><ul>${bullets(alignment_plan?.directional_clarity?.eliminate, '#E8824A')}</ul></div>
  </div>

  <div class="badge b2" style="margin-top:10px">${esc(L.layer2)}</div>
  <div class="sub" style="color:#888">${esc(L.focus)}</div>
  <p class="italic">${esc(alignment_plan?.structured_plan?.thirty_day_focus || '')}</p>
  <div class="g2" style="margin-bottom:0">
    <div><div class="sub" style="color:#888">${esc(L.weekly)}</div><ul>${bullets(alignment_plan?.structured_plan?.weekly_template, '#555')}</ul></div>
    <div><div class="sub" style="color:#888">${esc(L.daily)}</div><ul>${bullets(alignment_plan?.structured_plan?.daily_template, '#555')}</ul></div>
  </div>

  <div class="badge b3" style="margin-top:10px">${esc(L.layer3)}</div>
  <div class="g2" style="margin-top:6px;margin-bottom:0">
    <div><div class="sub" style="color:#7C5CBF">${esc(L.habits)}</div><ul>${bullets(alignment_plan?.behavioral_anchors?.keystone_habits, '#7C5CBF')}</ul></div>
    <div><div class="sub" style="color:#E8824A">${esc(L.forbidden)}</div><ul>${bullets(alignment_plan?.behavioral_anchors?.forbidden_behaviors, '#E8824A')}</ul></div>
  </div>
  <div><div class="sub" style="color:#4A9B7F">${esc(L.agreements)}</div><ul>${bullets(alignment_plan?.behavioral_anchors?.non_negotiables, '#4A9B7F')}</ul></div>
</div>

<div class="footer">${esc(L.footer)}</div>
</div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (win) {
    win.onload = () => {
      setTimeout(() => {
        win.print()
        URL.revokeObjectURL(url)
      }, 1500)
    }
  }
}