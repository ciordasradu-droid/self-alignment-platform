const PDF_LABELS = {
  en: {
    title: 'Your Alignment Profile', generated: 'Generated for',
    hd_title: 'Human Design', hd_type: 'Type', hd_profile: 'Profile', hd_strategy: 'Strategy', hd_authority: 'Authority',
    archetype: 'Your Archetype', how_you_work: 'How You Work', layer_surface: 'On the Surface', layer_engine: 'Your Engine', layer_core: 'Underneath',
    friction_map: 'Inner Tensions', friction_daily: 'In daily life', friction_resolution: 'How to hold both',
    aligned_life: 'Life in Alignment', decision_system: 'Your Decision System',
    energy_manual: 'Your Energy Manual', energy_peak: 'When you peak', energy_drain: 'What drains you', energy_rhythm: 'Your natural rhythm', energy_year: 'Your personal year',
    warning_signals: 'Warning Signals',
    blueprint: 'Core Energetic Blueprint', strengths: 'Natural Strengths', vulnerabilities: 'Growth Opportunities',
    energy_patterns: 'Energy Patterns', sabotage: 'Patterns to Watch', decision: 'Decision-Making Style', work: 'Work & Discipline Profile',
    self_perspective: 'Self Perspective', str: 'Natural Gifts', weak: 'Growth Edges', opp: 'Opportunities to Shine', threats: 'Patterns to Release',
    alignment_plan: 'Alignment Plan', layer1: 'Layer 1 — Directional Clarity', prioritize: 'Energize — Prioritize', eliminate: 'Release — Let Go',
    layer2: 'Layer 2 — Structured Plan', focus: '30-Day Focus', weekly: 'Weekly Template', daily: 'Daily Template',
    layer3: 'Layer 3 — Behavioral Anchors', habits: 'Keystone Habits', forbidden: 'Forbidden Behaviors', agreements: 'My Agreements',
    footer: 'Self Alignment Platform — Confidential'
  },
  ro: {
    title: 'Profilul Tău de Aliniere', generated: 'Generat pentru',
    hd_title: 'Human Design', hd_type: 'Tip', hd_profile: 'Profil', hd_strategy: 'Strategie', hd_authority: 'Autoritate',
    archetype: 'Arhetipul Tău', how_you_work: 'Cum Funcționezi', layer_surface: 'La Suprafață', layer_engine: 'Motorul Tău', layer_core: 'În Profunzime',
    friction_map: 'Tensiuni Interioare', friction_daily: 'În viața de zi cu zi', friction_resolution: 'Cum le ții pe amândouă',
    aligned_life: 'Viața în Aliniere', decision_system: 'Sistemul Tău de Decizie',
    energy_manual: 'Manualul Energiei Tale', energy_peak: 'Când ești la vârf', energy_drain: 'Ce te epuizează', energy_rhythm: 'Ritmul tău natural', energy_year: 'Anul tău personal',
    warning_signals: 'Semnale de Avertizare',
    blueprint: 'Planul Energetic Central', strengths: 'Puncte Forte Naturale', vulnerabilities: 'Oportunități de Creștere',
    energy_patterns: 'Tipare de Energie', sabotage: 'Tipare de Urmărit', decision: 'Stilul de Luare a Deciziilor', work: 'Profilul de Muncă și Disciplină',
    self_perspective: 'Perspectivă Personală', str: 'Daruri Naturale', weak: 'Zone de Creștere', opp: 'Oportunități de Strălucire', threats: 'Tipare de Eliberat',
    alignment_plan: 'Plan de Aliniere', layer1: 'Stratul 1 — Claritate Direcțională', prioritize: 'Energizează — Prioritizează', eliminate: 'Eliberează — Lasă să Plece',
    layer2: 'Stratul 2 — Plan Structurat', focus: 'Focalizare pe 30 de Zile', weekly: 'Șablon Săptămânal', daily: 'Șablon Zilnic',
    layer3: 'Stratul 3 — Ancore Comportamentale', habits: 'Obiceiuri Cheie', forbidden: 'Comportamente Interzise', agreements: 'Acordurile Mele',
    footer: 'Platforma de Aliniere Personală — Confidențial'
  },
  es: {
    title: 'Tu Perfil de Alineación', generated: 'Generado para',
    hd_title: 'Human Design', hd_type: 'Tipo', hd_profile: 'Perfil', hd_strategy: 'Estrategia', hd_authority: 'Autoridad',
    archetype: 'Tu Arquetipo', how_you_work: 'Cómo Funcionas', layer_surface: 'En la Superficie', layer_engine: 'Tu Motor', layer_core: 'En lo Profundo',
    friction_map: 'Tensiones Internas', friction_daily: 'En el día a día', friction_resolution: 'Cómo sostener ambas',
    aligned_life: 'La Vida en Alineación', decision_system: 'Tu Sistema de Decisión',
    energy_manual: 'El Manual de Tu Energía', energy_peak: 'Cuando estás al máximo', energy_drain: 'Qué te agota', energy_rhythm: 'Tu ritmo natural', energy_year: 'Tu año personal',
    warning_signals: 'Señales de Alerta',
    blueprint: 'Plano Energético Central', strengths: 'Fortalezas Naturales', vulnerabilities: 'Oportunidades de Crecimiento',
    energy_patterns: 'Patrones de Energía', sabotage: 'Patrones a Observar', decision: 'Estilo de Toma de Decisiones', work: 'Perfil de Trabajo y Disciplina',
    self_perspective: 'Perspectiva Personal', str: 'Dones Naturales', weak: 'Bordes de Crecimiento', opp: 'Oportunidades para Brillar', threats: 'Patrones a Liberar',
    alignment_plan: 'Plan de Alineación', layer1: 'Capa 1 — Claridad Direccional', prioritize: 'Energizar — Priorizar', eliminate: 'Liberar — Dejar Ir',
    layer2: 'Capa 2 — Plan Estructurado', focus: 'Enfoque de 30 Días', weekly: 'Plantilla Semanal', daily: 'Plantilla Diaria',
    layer3: 'Capa 3 — Anclajes Conductuales', habits: 'Hábitos Clave', forbidden: 'Comportamientos Prohibidos', agreements: 'Mis Acuerdos',
    footer: 'Plataforma de Alineación Personal — Confidencial'
  },
  fr: {
    title: "Votre Profil d'Alignement", generated: 'Généré pour',
    hd_title: 'Human Design', hd_type: 'Type', hd_profile: 'Profil', hd_strategy: 'Stratégie', hd_authority: 'Autorité',
    archetype: 'Votre Archétype', how_you_work: 'Comment Vous Fonctionnez', layer_surface: 'En Surface', layer_engine: 'Votre Moteur', layer_core: 'En Profondeur',
    friction_map: 'Tensions Intérieures', friction_daily: 'Au quotidien', friction_resolution: 'Comment tenir les deux',
    aligned_life: 'La Vie en Alignement', decision_system: 'Votre Système de Décision',
    energy_manual: 'Le Manuel de Votre Énergie', energy_peak: 'Quand vous êtes au sommet', energy_drain: 'Ce qui vous épuise', energy_rhythm: 'Votre rythme naturel', energy_year: 'Votre année personnelle',
    warning_signals: "Signaux d'Alerte",
    blueprint: 'Plan Énergétique Central', strengths: 'Forces Naturelles', vulnerabilities: 'Opportunités de Croissance',
    energy_patterns: "Schémas d'Énergie", sabotage: 'Schémas à Observer', decision: 'Style de Prise de Décision', work: 'Profil de Travail et Discipline',
    self_perspective: 'Perspective Personnelle', str: 'Dons Naturels', weak: 'Zones de Croissance', opp: 'Opportunités de Briller', threats: 'Schémas à Libérer',
    alignment_plan: "Plan d'Alignement", layer1: 'Couche 1 — Clarté Directionnelle', prioritize: 'Énergiser — Prioriser', eliminate: 'Libérer — Laisser Aller',
    layer2: 'Couche 2 — Plan Structuré', focus: 'Objectif sur 30 Jours', weekly: 'Modèle Hebdomadaire', daily: 'Modèle Quotidien',
    layer3: 'Couche 3 — Ancres Comportementales', habits: 'Habitudes Clés', forbidden: 'Comportements Interdits', agreements: 'Mes Engagements',
    footer: "Plateforme d'Alignement Personnel — Confidentiel"
  },
  de: {
    title: 'Dein Ausrichtungsprofil', generated: 'Erstellt für',
    hd_title: 'Human Design', hd_type: 'Typ', hd_profile: 'Profil', hd_strategy: 'Strategie', hd_authority: 'Autorität',
    archetype: 'Dein Archetyp', how_you_work: 'Wie Du Funktionierst', layer_surface: 'An der Oberfläche', layer_engine: 'Dein Motor', layer_core: 'In der Tiefe',
    friction_map: 'Innere Spannungen', friction_daily: 'Im Alltag', friction_resolution: 'Wie du beide hältst',
    aligned_life: 'Das Leben im Einklang', decision_system: 'Dein Entscheidungssystem',
    energy_manual: 'Dein Energie-Handbuch', energy_peak: 'Wann du am stärksten bist', energy_drain: 'Was dich auslaugt', energy_rhythm: 'Dein natürlicher Rhythmus', energy_year: 'Dein persönliches Jahr',
    warning_signals: 'Warnsignale',
    blueprint: 'Zentraler Energieplan', strengths: 'Natürliche Stärken', vulnerabilities: 'Wachstumschancen',
    energy_patterns: 'Energiemuster', sabotage: 'Muster zu Beobachten', decision: 'Entscheidungsstil', work: 'Arbeits- und Disziplinprofil',
    self_perspective: 'Persönliche Perspektive', str: 'Natürliche Gaben', weak: 'Wachstumsbereiche', opp: 'Chancen zu Glänzen', threats: 'Muster Loszulassen',
    alignment_plan: 'Ausrichtungsplan', layer1: 'Schicht 1 — Richtungsklarheit', prioritize: 'Energetisieren — Priorisieren', eliminate: 'Loslassen',
    layer2: 'Schicht 2 — Strukturierter Plan', focus: '30-Tage-Fokus', weekly: 'Wöchentliche Vorlage', daily: 'Tägliche Vorlage',
    layer3: 'Schicht 3 — Verhaltensanker', habits: 'Schlüsselgewohnheiten', forbidden: 'Verbotene Verhaltensweisen', agreements: 'Meine Vereinbarungen',
    footer: 'Persönliche Ausrichtungsplattform — Vertraulich'
  },
  it: {
    title: 'Il Tuo Profilo di Allineamento', generated: 'Generato per',
    hd_title: 'Human Design', hd_type: 'Tipo', hd_profile: 'Profilo', hd_strategy: 'Strategia', hd_authority: 'Autorità',
    archetype: 'Il Tuo Archetipo', how_you_work: 'Come Funzioni', layer_surface: 'In Superficie', layer_engine: 'Il Tuo Motore', layer_core: 'Nel Profondo',
    friction_map: 'Tensioni Interiori', friction_daily: 'Nella vita quotidiana', friction_resolution: 'Come tenerle entrambe',
    aligned_life: 'La Vita in Allineamento', decision_system: 'Il Tuo Sistema Decisionale',
    energy_manual: 'Il Manuale della Tua Energia', energy_peak: 'Quando sei al massimo', energy_drain: 'Cosa ti svuota', energy_rhythm: 'Il tuo ritmo naturale', energy_year: 'Il tuo anno personale',
    warning_signals: 'Segnali di Allerta',
    blueprint: 'Piano Energetico Centrale', strengths: 'Punti di Forza Naturali', vulnerabilities: 'Opportunità di Crescita',
    energy_patterns: 'Schemi di Energia', sabotage: 'Schemi da Osservare', decision: 'Stile Decisionale', work: 'Profilo di Lavoro e Disciplina',
    self_perspective: 'Prospettiva Personale', str: 'Doni Naturali', weak: 'Aree di Crescita', opp: 'Opportunità di Brillare', threats: 'Schemi da Liberare',
    alignment_plan: 'Piano di Allineamento', layer1: 'Strato 1 — Chiarezza Direzionale', prioritize: 'Energizzare — Prioritizzare', eliminate: 'Liberare — Lasciar Andare',
    layer2: 'Strato 2 — Piano Strutturato', focus: 'Focus di 30 Giorni', weekly: 'Modello Settimanale', daily: 'Modello Giornaliero',
    layer3: 'Strato 3 — Ancore Comportamentali', habits: 'Abitudini Chiave', forbidden: 'Comportamenti Vietati', agreements: 'I Miei Accordi',
    footer: 'Piattaforma di Allineamento Personale — Riservato'
  },
  pt: {
    title: 'Seu Perfil de Alinhamento', generated: 'Gerado para',
    hd_title: 'Human Design', hd_type: 'Tipo', hd_profile: 'Perfil', hd_strategy: 'Estratégia', hd_authority: 'Autoridade',
    archetype: 'Seu Arquétipo', how_you_work: 'Como Você Funciona', layer_surface: 'Na Superfície', layer_engine: 'Seu Motor', layer_core: 'Nas Profundezas',
    friction_map: 'Tensões Internas', friction_daily: 'No dia a dia', friction_resolution: 'Como manter as duas',
    aligned_life: 'A Vida em Alinhamento', decision_system: 'Seu Sistema de Decisão',
    energy_manual: 'O Manual da Sua Energia', energy_peak: 'Quando você está no auge', energy_drain: 'O que te esgota', energy_rhythm: 'Seu ritmo natural', energy_year: 'Seu ano pessoal',
    warning_signals: 'Sinais de Alerta',
    blueprint: 'Plano Energético Central', strengths: 'Forças Naturais', vulnerabilities: 'Oportunidades de Crescimento',
    energy_patterns: 'Padrões de Energia', sabotage: 'Padrões a Observar', decision: 'Estilo de Tomada de Decisão', work: 'Perfil de Trabalho e Disciplina',
    self_perspective: 'Perspectiva Pessoal', str: 'Dons Naturais', weak: 'Áreas de Crescimento', opp: 'Oportunidades de Brilhar', threats: 'Padrões a Liberar',
    alignment_plan: 'Plano de Alinhamento', layer1: 'Camada 1 — Clareza Direcional', prioritize: 'Energizar — Priorizar', eliminate: 'Liberar — Deixar Ir',
    layer2: 'Camada 2 — Plano Estruturado', focus: 'Foco de 30 Dias', weekly: 'Modelo Semanal', daily: 'Modelo Diário',
    layer3: 'Camada 3 — Âncoras Comportamentais', habits: 'Hábitos Essenciais', forbidden: 'Comportamentos Proibidos', agreements: 'Meus Acordos',
    footer: 'Plataforma de Alinhamento Pessoal — Confidencial'
  },
  nl: {
    title: 'Jouw Uitlijningsprofiel', generated: 'Gegenereerd voor',
    hd_title: 'Human Design', hd_type: 'Type', hd_profile: 'Profiel', hd_strategy: 'Strategie', hd_authority: 'Autoriteit',
    archetype: 'Jouw Archetype', how_you_work: 'Hoe Je Functioneert', layer_surface: 'Aan de Oppervlakte', layer_engine: 'Jouw Motor', layer_core: 'In de Diepte',
    friction_map: 'Innerlijke Spanningen', friction_daily: 'In het dagelijks leven', friction_resolution: 'Hoe je beide vasthoudt',
    aligned_life: 'Het Leven in Afstemming', decision_system: 'Jouw Beslissingssysteem',
    energy_manual: 'Jouw Energiehandboek', energy_peak: 'Wanneer je op je best bent', energy_drain: 'Wat je uitput', energy_rhythm: 'Jouw natuurlijke ritme', energy_year: 'Jouw persoonlijke jaar',
    warning_signals: 'Waarschuwingssignalen',
    blueprint: 'Centraal Energetisch Blauwdruk', strengths: 'Natuurlijke Sterktes', vulnerabilities: 'Groeikansen',
    energy_patterns: 'Energiepatronen', sabotage: 'Patronen om te Observeren', decision: 'Besluitvormingsstijl', work: 'Werk- en Disciplineprofiel',
    self_perspective: 'Persoonlijk Perspectief', str: 'Natuurlijke Gaven', weak: 'Groeigebieden', opp: 'Kansen om te Schitteren', threats: 'Patronen los te Laten',
    alignment_plan: 'Uitlijningsplan', layer1: 'Laag 1 — Richtingshelderheid', prioritize: 'Energetiseren — Prioriteren', eliminate: 'Loslaten',
    layer2: 'Laag 2 — Gestructureerd Plan', focus: '30-Dagen Focus', weekly: 'Weeksjabloon', daily: 'Dagsjabloon',
    layer3: 'Laag 3 — Gedragsankers', habits: 'Sleutelgewoonten', forbidden: 'Verboden Gedragingen', agreements: 'Mijn Afspraken',
    footer: 'Persoonlijk Uitlijningsplatform — Vertrouwelijk'
  },
  pl: {
    title: 'Twój Profil Wyrównania', generated: 'Wygenerowano dla',
    hd_title: 'Human Design', hd_type: 'Typ', hd_profile: 'Profil', hd_strategy: 'Strategia', hd_authority: 'Autorytet',
    archetype: 'Twój Archetyp', how_you_work: 'Jak Funkcjonujesz', layer_surface: 'Na Powierzchni', layer_engine: 'Twój Silnik', layer_core: 'W Głębi',
    friction_map: 'Wewnętrzne Napięcia', friction_daily: 'W codziennym życiu', friction_resolution: 'Jak utrzymać obie',
    aligned_life: 'Życie w Zgodzie', decision_system: 'Twój System Decyzyjny',
    energy_manual: 'Podręcznik Twojej Energii', energy_peak: 'Kiedy jesteś u szczytu', energy_drain: 'Co cię wyczerpuje', energy_rhythm: 'Twój naturalny rytm', energy_year: 'Twój rok osobisty',
    warning_signals: 'Sygnały Ostrzegawcze',
    blueprint: 'Centralny Plan Energetyczny', strengths: 'Naturalne Mocne Strony', vulnerabilities: 'Możliwości Rozwoju',
    energy_patterns: 'Wzorce Energii', sabotage: 'Wzorce do Obserwowania', decision: 'Styl Podejmowania Decyzji', work: 'Profil Pracy i Dyscypliny',
    self_perspective: 'Osobista Perspektywa', str: 'Naturalne Dary', weak: 'Obszary Wzrostu', opp: 'Możliwości Błyszczenia', threats: 'Wzorce do Uwolnienia',
    alignment_plan: 'Plan Wyrównania', layer1: 'Warstwa 1 — Jasność Kierunkowa', prioritize: 'Energetyzować — Priorytetyzować', eliminate: 'Uwolnić — Puścić',
    layer2: 'Warstwa 2 — Ustrukturyzowany Plan', focus: 'Skupienie na 30 Dni', weekly: 'Szablon Tygodniowy', daily: 'Szablon Dzienny',
    layer3: 'Warstwa 3 — Kotwice Behawioralne', habits: 'Kluczowe Nawyki', forbidden: 'Zakazane Zachowania', agreements: 'Moje Umowy',
    footer: 'Platforma Osobistego Wyrównania — Poufne'
  },
  hu: {
    title: 'Az Ön Igazítási Profilja', generated: 'Létrehozva',
    hd_title: 'Human Design', hd_type: 'Típus', hd_profile: 'Profil', hd_strategy: 'Stratégia', hd_authority: 'Autoritás',
    archetype: 'Az Ön Archetípusa', how_you_work: 'Hogyan Működik', layer_surface: 'A Felszínen', layer_engine: 'Az Ön Motorja', layer_core: 'A Mélyben',
    friction_map: 'Belső Feszültségek', friction_daily: 'A mindennapokban', friction_resolution: 'Hogyan tartsa mindkettőt',
    aligned_life: 'Élet Összhangban', decision_system: 'Az Ön Döntési Rendszere',
    energy_manual: 'Az Ön Energia Kézikönyve', energy_peak: 'Amikor csúcson van', energy_drain: 'Mi meríti ki', energy_rhythm: 'Az Ön természetes ritmusa', energy_year: 'Az Ön személyes éve',
    warning_signals: 'Figyelmeztető Jelek',
    blueprint: 'Központi Energetikai Terv', strengths: 'Természetes Erősségek', vulnerabilities: 'Növekedési Lehetőségek',
    energy_patterns: 'Energia Minták', sabotage: 'Megfigyelendő Minták', decision: 'Döntéshozatali Stílus', work: 'Munka és Fegyelem Profil',
    self_perspective: 'Személyes Perspektíva', str: 'Természetes Adottságok', weak: 'Növekedési Területek', opp: 'Ragyogási Lehetőségek', threats: 'Feloldandó Minták',
    alignment_plan: 'Igazítási Terv', layer1: '1. Réteg — Irányvonal Tisztaság', prioritize: 'Energizálás — Priorizálás', eliminate: 'Elengedés',
    layer2: '2. Réteg — Strukturált Terv', focus: '30 Napos Fókusz', weekly: 'Heti Sablon', daily: 'Napi Sablon',
    layer3: '3. Réteg — Viselkedési Horgonyok', habits: 'Kulcs Szokások', forbidden: 'Tiltott Viselkedések', agreements: 'Megállapodásaim',
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
  const { full_name, sections, swot, alignment_plan, language = 'en', personal_year, hd_data } = profile
  const L = getLabels(language)

  // Detect v4 by presence of archetype
  const isV4 = !!(sections && sections.archetype)

  // ---- Build the sections body depending on version ----
  let sectionsHtml = ''

  if (isV4) {
    const a = sections.archetype
    const work = sections.how_you_work
    const frictions = Array.isArray(sections.friction_map)
      ? sections.friction_map.filter(f => f && typeof f === 'object' && f.tension) : []
    const energy = sections.energy_manual
    const signals = Array.isArray(sections.warning_signals)
      ? sections.warning_signals.filter(w => w && typeof w === 'object' && w.signal) : []
    const decision = Array.isArray(sections.decision_system) ? sections.decision_system : []

    // Archetype
    if (a && (a.name || a.description)) {
      sectionsHtml += `<div class="section archetype">
        <div class="tag tp">${esc(L.archetype)}</div>
        ${a.name ? `<div class="arch-name">${esc(a.name)}</div>` : ''}
        ${a.description ? `<p class="blueprint">${esc(a.description)}</p>` : ''}
      </div>`
    }

    // How you work — 3 layers
    if (work && (work.surface || work.engine || work.core)) {
      sectionsHtml += `<div class="section">
        <div class="tag tp">${esc(L.how_you_work)}</div>
        ${work.surface ? `<div class="sub" style="color:#4A9B7F">${esc(L.layer_surface)}</div><p class="blueprint">${esc(work.surface)}</p>` : ''}
        ${work.engine ? `<div class="sub" style="color:#7C5CBF;margin-top:8px">${esc(L.layer_engine)}</div><p class="blueprint">${esc(work.engine)}</p>` : ''}
        ${work.core ? `<div class="sub" style="color:#E8824A;margin-top:8px">${esc(L.layer_core)}</div><p class="blueprint">${esc(work.core)}</p>` : ''}
      </div>`
    }

    // Friction map
    if (frictions.length) {
      let fr = `<div class="section"><div class="tag to">${esc(L.friction_map)}</div>`
      frictions.forEach(f => {
        fr += `<div class="friction">
          ${f.tension ? `<div class="friction-name">${esc(f.tension)}</div>` : ''}
          <div class="g2" style="margin-bottom:4px">
            ${f.pull_a ? `<div class="pull pull-a"><span class="pull-tag pa">A</span> ${esc(f.pull_a)}</div>` : ''}
            ${f.pull_b ? `<div class="pull pull-b"><span class="pull-tag pb">B</span> ${esc(f.pull_b)}</div>` : ''}
          </div>
          ${f.daily_experience ? `<p class="fmeta"><b>${esc(L.friction_daily)}:</b> ${esc(f.daily_experience)}</p>` : ''}
          ${f.resolution ? `<p class="fmeta"><b>${esc(L.friction_resolution)}:</b> ${esc(f.resolution)}</p>` : ''}
        </div>`
      })
      fr += `</div>`
      sectionsHtml += fr
    }

    // Aligned life
    if (sections.aligned_life) {
      sectionsHtml += `<div class="section"><div class="tag tg">${esc(L.aligned_life)}</div><p class="blueprint">${esc(sections.aligned_life)}</p></div>`
    }

    // Strengths + vulnerabilities
    sectionsHtml += `<div class="g2">
      <div class="section"><div class="tag tg">${esc(L.strengths)}</div><ul>${bullets(sections.strengths, '#4A9B7F')}</ul></div>
      <div class="section"><div class="tag to">${esc(L.vulnerabilities)}</div><ul>${bullets(sections.vulnerabilities, '#E8824A')}</ul></div>
    </div>`

    // Decision system
    if (decision.length) {
      sectionsHtml += `<div class="section"><div class="tag tp">${esc(L.decision_system)}</div>${decision.map(d => `<p class="blueprint" style="margin-bottom:6px">${esc(d)}</p>`).join('')}</div>`
    }

    // Energy manual
    if (energy && (energy.peak || energy.drain || energy.rhythm || energy.current_year)) {
      sectionsHtml += `<div class="section"><div class="tag tp">${esc(L.energy_manual)}</div>
        <div class="g2" style="margin-bottom:0">
          ${energy.peak ? `<div><div class="sub" style="color:#4A9B7F">${esc(L.energy_peak)}</div><p class="blueprint">${esc(energy.peak)}</p></div>` : ''}
          ${energy.drain ? `<div><div class="sub" style="color:#E8824A">${esc(L.energy_drain)}</div><p class="blueprint">${esc(energy.drain)}</p></div>` : ''}
          ${energy.rhythm ? `<div><div class="sub" style="color:#7C5CBF">${esc(L.energy_rhythm)}</div><p class="blueprint">${esc(energy.rhythm)}</p></div>` : ''}
          ${energy.current_year ? `<div><div class="sub" style="color:#E8824A">${esc(L.energy_year)}</div><p class="blueprint">${esc(energy.current_year)}</p></div>` : ''}
        </div>
      </div>`
    }

    // Warning signals
    if (signals.length) {
      let ws = `<div class="section"><div class="tag to">${esc(L.warning_signals)}</div>`
      signals.forEach(w => {
        ws += `<div class="signal">
          ${w.signal ? `<p class="signal-feel">⚠ ${esc(w.signal)}</p>` : ''}
          ${w.pattern ? `<p class="blueprint">${esc(w.pattern)}</p>` : ''}
          ${w.exit ? `<p class="signal-exit">→ ${esc(w.exit)}</p>` : ''}
        </div>`
      })
      ws += `</div>`
      sectionsHtml += ws
    }
  } else {
    // ---- Legacy v3 layout ----
    sectionsHtml += `<div class="section"><div class="tag tp">${esc(L.blueprint)}</div><p class="blueprint">${esc(sections?.blueprint || '')}</p></div>`
    sectionsHtml += `<div class="g2">
      <div class="section"><div class="tag tg">${esc(L.strengths)}</div><ul>${bullets(sections?.strengths, '#4A9B7F')}</ul></div>
      <div class="section"><div class="tag to">${esc(L.vulnerabilities)}</div><ul>${bullets(sections?.vulnerabilities, '#E8824A')}</ul></div>
    </div>`
    sectionsHtml += `<div class="g2">
      <div class="section"><div class="tag tp">${esc(L.energy_patterns)}</div><ul>${bullets(sections?.energy_patterns, '#7C5CBF')}</ul></div>
      <div class="section"><div class="tag to">${esc(L.sabotage)}</div><ul>${bullets(sections?.sabotage_tendencies, '#E8824A')}</ul></div>
    </div>`
    sectionsHtml += `<div class="g2">
      <div class="section"><div class="tag tg">${esc(L.decision)}</div><ul>${bullets(sections?.decision_making, '#4A9B7F')}</ul></div>
      <div class="section"><div class="tag tp">${esc(L.work)}</div><ul>${bullets(sections?.work_discipline, '#7C5CBF')}</ul></div>
    </div>`
  }

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
.hd { background:#fff; border-radius:8px; border:1px solid #e8e8e4; border-left:4px solid #E8824A; padding:14px 16px; margin-bottom:12px; break-inside:avoid; }
.hd-title { display:inline-block; padding:3px 10px; border-radius:20px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; background:rgba(232,130,74,0.1); color:#E8824A; }
.hd-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.hd-item { background:#f8f8f6; border-radius:8px; padding:10px; }
.hd-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#888; margin-bottom:4px; }
.hd-value { font-size:13px; font-weight:600; color:#1a1a1a; }
.section { background:#fff; border-radius:8px; border:1px solid #e8e8e4; padding:14px 16px; margin-bottom:10px; break-inside:avoid; page-break-inside:avoid; }
.archetype { background:linear-gradient(135deg,#1a1a2e,#2d1b4e); border:none; }
.archetype .tag { background:rgba(255,255,255,0.15); color:#fff; }
.arch-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#fff; margin:6px 0 8px; }
.archetype .blueprint { color:rgba(255,255,255,0.85); }
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
.friction { border-bottom:1px solid #f0f0ee; padding-bottom:8px; margin-bottom:8px; }
.friction:last-child { border-bottom:none; }
.friction-name { font-family:'Cormorant Garamond',serif; font-size:14px; font-weight:600; color:#1a1a1a; margin-bottom:6px; }
.pull { background:#f8f8f6; border-radius:6px; padding:8px; font-size:10px; line-height:1.5; }
.pull-a { border-left:2px solid #7C5CBF; }
.pull-b { border-left:2px solid #4A9B7F; }
.pull-tag { display:inline-block; width:14px; height:14px; border-radius:50%; color:#fff; font-size:8px; font-weight:700; text-align:center; line-height:14px; }
.pa{background:#7C5CBF}.pb{background:#4A9B7F}
.fmeta { font-size:10px; color:#555; line-height:1.55; margin-top:4px; }
.signal { background:#f8f8f6; border-radius:6px; padding:10px; margin-bottom:8px; }
.signal:last-child { margin-bottom:0; }
.signal-feel { font-size:11px; font-weight:600; color:#1a1a1a; margin-bottom:4px; }
.signal-exit { font-size:11px; font-weight:600; color:#4A9B7F; margin-top:4px; }
.footer { text-align:center; padding:14px 0 0; font-size:9px; color:#bbb; border-top:1px solid #eee; margin-top:12px; }
@media print {
  body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .section,.hd,.g2>div { break-inside:avoid; page-break-inside:avoid; }
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

${hd_data ? `<div class="hd">
  <div class="hd-title">${esc(L.hd_title)}</div>
  <div class="hd-grid">
    <div class="hd-item"><div class="hd-label">${esc(L.hd_type)}</div><div class="hd-value">${esc(hd_data.type)}</div></div>
    <div class="hd-item"><div class="hd-label">${esc(L.hd_profile)}</div><div class="hd-value">${esc(hd_data.profile)}</div></div>
    <div class="hd-item"><div class="hd-label">${esc(L.hd_strategy)}</div><div class="hd-value">${esc(hd_data.strategy)}</div></div>
    <div class="hd-item"><div class="hd-label">${esc(L.hd_authority)}</div><div class="hd-value">${esc(hd_data.authority)}</div></div>
  </div>
</div>` : ''}

${sectionsHtml}

<div class="section">
  <div class="tag to">${esc(L.self_perspective)}</div>
  <div class="g2" style="margin-top:6px;margin-bottom:0">
    <div><div class="sub" style="color:#7C5CBF">${esc(L.opp)}</div><ul>${bullets(swot?.opportunities, '#7C5CBF')}</ul></div>
    <div><div class="sub" style="color:#E8824A">${esc(L.threats)}</div><ul>${bullets(swot?.threats, '#E8824A')}</ul></div>
  </div>
</div>

${alignment_plan ? `<div class="section">
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
</div>` : ''}

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