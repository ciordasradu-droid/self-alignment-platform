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
    alignment_plan: 'Alignment Plan', layer1: 'Layer 1 â€” Directional Clarity', prioritize: 'Energize â€” Prioritize', eliminate: 'Release â€” Let Go',
    layer2: 'Layer 2 â€” Structured Plan', focus: '30-Day Focus', weekly: 'Weekly Template', daily: 'Daily Template',
    layer3: 'Layer 3 â€” Behavioral Anchors', habits: 'Keystone Habits', forbidden: 'Forbidden Behaviors', agreements: 'My Agreements',
    footer: 'Self Alignment Platform â€” Confidential'
  },
  ro: {
    title: 'Profilul TÄƒu de Aliniere', generated: 'Generat pentru',
    hd_title: 'Human Design', hd_type: 'Tip', hd_profile: 'Profil', hd_strategy: 'Strategie', hd_authority: 'Autoritate',
    archetype: 'Arhetipul TÄƒu', how_you_work: 'Cum FuncÈ›ionezi', layer_surface: 'La SuprafaÈ›Äƒ', layer_engine: 'Motorul TÄƒu', layer_core: 'ÃŽn Profunzime',
    friction_map: 'Tensiuni Interioare', friction_daily: 'ÃŽn viaÈ›a de zi cu zi', friction_resolution: 'Cum le È›ii pe amÃ¢ndouÄƒ',
    aligned_life: 'ViaÈ›a Ã®n Aliniere', decision_system: 'Sistemul TÄƒu de Decizie',
    energy_manual: 'Manualul Energiei Tale', energy_peak: 'CÃ¢nd eÈ™ti la vÃ¢rf', energy_drain: 'Ce te epuizeazÄƒ', energy_rhythm: 'Ritmul tÄƒu natural', energy_year: 'Anul tÄƒu personal',
    warning_signals: 'Semnale de Avertizare',
    blueprint: 'Planul Energetic Central', strengths: 'Puncte Forte Naturale', vulnerabilities: 'OportunitÄƒÈ›i de CreÈ™tere',
    energy_patterns: 'Tipare de Energie', sabotage: 'Tipare de UrmÄƒrit', decision: 'Stilul de Luare a Deciziilor', work: 'Profilul de MuncÄƒ È™i DisciplinÄƒ',
    self_perspective: 'PerspectivÄƒ PersonalÄƒ', str: 'Daruri Naturale', weak: 'Zone de CreÈ™tere', opp: 'OportunitÄƒÈ›i de StrÄƒlucire', threats: 'Tipare de Eliberat',
    alignment_plan: 'Plan de Aliniere', layer1: 'Stratul 1 â€” Claritate DirecÈ›ionalÄƒ', prioritize: 'EnergizeazÄƒ â€” PrioritizeazÄƒ', eliminate: 'ElibereazÄƒ â€” LasÄƒ sÄƒ Plece',
    layer2: 'Stratul 2 â€” Plan Structurat', focus: 'Focalizare pe 30 de Zile', weekly: 'È˜ablon SÄƒptÄƒmÃ¢nal', daily: 'È˜ablon Zilnic',
    layer3: 'Stratul 3 â€” Ancore Comportamentale', habits: 'Obiceiuri Cheie', forbidden: 'Comportamente Interzise', agreements: 'Acordurile Mele',
    footer: 'Platforma de Aliniere PersonalÄƒ â€” ConfidenÈ›ial'
  },
  es: {
    title: 'Tu Perfil de AlineaciÃ³n', generated: 'Generado para',
    hd_title: 'Human Design', hd_type: 'Tipo', hd_profile: 'Perfil', hd_strategy: 'Estrategia', hd_authority: 'Autoridad',
    archetype: 'Tu Arquetipo', how_you_work: 'CÃ³mo Funcionas', layer_surface: 'En la Superficie', layer_engine: 'Tu Motor', layer_core: 'En lo Profundo',
    friction_map: 'Tensiones Internas', friction_daily: 'En el dÃ­a a dÃ­a', friction_resolution: 'CÃ³mo sostener ambas',
    aligned_life: 'La Vida en AlineaciÃ³n', decision_system: 'Tu Sistema de DecisiÃ³n',
    energy_manual: 'El Manual de Tu EnergÃ­a', energy_peak: 'Cuando estÃ¡s al mÃ¡ximo', energy_drain: 'QuÃ© te agota', energy_rhythm: 'Tu ritmo natural', energy_year: 'Tu aÃ±o personal',
    warning_signals: 'SeÃ±ales de Alerta',
    blueprint: 'Plano EnergÃ©tico Central', strengths: 'Fortalezas Naturales', vulnerabilities: 'Oportunidades de Crecimiento',
    energy_patterns: 'Patrones de EnergÃ­a', sabotage: 'Patrones a Observar', decision: 'Estilo de Toma de Decisiones', work: 'Perfil de Trabajo y Disciplina',
    self_perspective: 'Perspectiva Personal', str: 'Dones Naturales', weak: 'Bordes de Crecimiento', opp: 'Oportunidades para Brillar', threats: 'Patrones a Liberar',
    alignment_plan: 'Plan de AlineaciÃ³n', layer1: 'Capa 1 â€” Claridad Direccional', prioritize: 'Energizar â€” Priorizar', eliminate: 'Liberar â€” Dejar Ir',
    layer2: 'Capa 2 â€” Plan Estructurado', focus: 'Enfoque de 30 DÃ­as', weekly: 'Plantilla Semanal', daily: 'Plantilla Diaria',
    layer3: 'Capa 3 â€” Anclajes Conductuales', habits: 'HÃ¡bitos Clave', forbidden: 'Comportamientos Prohibidos', agreements: 'Mis Acuerdos',
    footer: 'Plataforma de AlineaciÃ³n Personal â€” Confidencial'
  },
  fr: {
    title: "Votre Profil d'Alignement", generated: 'GÃ©nÃ©rÃ© pour',
    hd_title: 'Human Design', hd_type: 'Type', hd_profile: 'Profil', hd_strategy: 'StratÃ©gie', hd_authority: 'AutoritÃ©',
    archetype: 'Votre ArchÃ©type', how_you_work: 'Comment Vous Fonctionnez', layer_surface: 'En Surface', layer_engine: 'Votre Moteur', layer_core: 'En Profondeur',
    friction_map: 'Tensions IntÃ©rieures', friction_daily: 'Au quotidien', friction_resolution: 'Comment tenir les deux',
    aligned_life: 'La Vie en Alignement', decision_system: 'Votre SystÃ¨me de DÃ©cision',
    energy_manual: 'Le Manuel de Votre Ã‰nergie', energy_peak: 'Quand vous Ãªtes au sommet', energy_drain: 'Ce qui vous Ã©puise', energy_rhythm: 'Votre rythme naturel', energy_year: 'Votre annÃ©e personnelle',
    warning_signals: "Signaux d'Alerte",
    blueprint: 'Plan Ã‰nergÃ©tique Central', strengths: 'Forces Naturelles', vulnerabilities: 'OpportunitÃ©s de Croissance',
    energy_patterns: "SchÃ©mas d'Ã‰nergie", sabotage: 'SchÃ©mas Ã  Observer', decision: 'Style de Prise de DÃ©cision', work: 'Profil de Travail et Discipline',
    self_perspective: 'Perspective Personnelle', str: 'Dons Naturels', weak: 'Zones de Croissance', opp: 'OpportunitÃ©s de Briller', threats: 'SchÃ©mas Ã  LibÃ©rer',
    alignment_plan: "Plan d'Alignement", layer1: 'Couche 1 â€” ClartÃ© Directionnelle', prioritize: 'Ã‰nergiser â€” Prioriser', eliminate: 'LibÃ©rer â€” Laisser Aller',
    layer2: 'Couche 2 â€” Plan StructurÃ©', focus: 'Objectif sur 30 Jours', weekly: 'ModÃ¨le Hebdomadaire', daily: 'ModÃ¨le Quotidien',
    layer3: 'Couche 3 â€” Ancres Comportementales', habits: 'Habitudes ClÃ©s', forbidden: 'Comportements Interdits', agreements: 'Mes Engagements',
    footer: "Plateforme d'Alignement Personnel â€” Confidentiel"
  },
  de: {
    title: 'Dein Ausrichtungsprofil', generated: 'Erstellt fÃ¼r',
    hd_title: 'Human Design', hd_type: 'Typ', hd_profile: 'Profil', hd_strategy: 'Strategie', hd_authority: 'AutoritÃ¤t',
    archetype: 'Dein Archetyp', how_you_work: 'Wie Du Funktionierst', layer_surface: 'An der OberflÃ¤che', layer_engine: 'Dein Motor', layer_core: 'In der Tiefe',
    friction_map: 'Innere Spannungen', friction_daily: 'Im Alltag', friction_resolution: 'Wie du beide hÃ¤ltst',
    aligned_life: 'Das Leben im Einklang', decision_system: 'Dein Entscheidungssystem',
    energy_manual: 'Dein Energie-Handbuch', energy_peak: 'Wann du am stÃ¤rksten bist', energy_drain: 'Was dich auslaugt', energy_rhythm: 'Dein natÃ¼rlicher Rhythmus', energy_year: 'Dein persÃ¶nliches Jahr',
    warning_signals: 'Warnsignale',
    blueprint: 'Zentraler Energieplan', strengths: 'NatÃ¼rliche StÃ¤rken', vulnerabilities: 'Wachstumschancen',
    energy_patterns: 'Energiemuster', sabotage: 'Muster zu Beobachten', decision: 'Entscheidungsstil', work: 'Arbeits- und Disziplinprofil',
    self_perspective: 'PersÃ¶nliche Perspektive', str: 'NatÃ¼rliche Gaben', weak: 'Wachstumsbereiche', opp: 'Chancen zu GlÃ¤nzen', threats: 'Muster Loszulassen',
    alignment_plan: 'Ausrichtungsplan', layer1: 'Schicht 1 â€” Richtungsklarheit', prioritize: 'Energetisieren â€” Priorisieren', eliminate: 'Loslassen',
    layer2: 'Schicht 2 â€” Strukturierter Plan', focus: '30-Tage-Fokus', weekly: 'WÃ¶chentliche Vorlage', daily: 'TÃ¤gliche Vorlage',
    layer3: 'Schicht 3 â€” Verhaltensanker', habits: 'SchlÃ¼sselgewohnheiten', forbidden: 'Verbotene Verhaltensweisen', agreements: 'Meine Vereinbarungen',
    footer: 'PersÃ¶nliche Ausrichtungsplattform â€” Vertraulich'
  },
  it: {
    title: 'Il Tuo Profilo di Allineamento', generated: 'Generato per',
    hd_title: 'Human Design', hd_type: 'Tipo', hd_profile: 'Profilo', hd_strategy: 'Strategia', hd_authority: 'AutoritÃ ',
    archetype: 'Il Tuo Archetipo', how_you_work: 'Come Funzioni', layer_surface: 'In Superficie', layer_engine: 'Il Tuo Motore', layer_core: 'Nel Profondo',
    friction_map: 'Tensioni Interiori', friction_daily: 'Nella vita quotidiana', friction_resolution: 'Come tenerle entrambe',
    aligned_life: 'La Vita in Allineamento', decision_system: 'Il Tuo Sistema Decisionale',
    energy_manual: 'Il Manuale della Tua Energia', energy_peak: 'Quando sei al massimo', energy_drain: 'Cosa ti svuota', energy_rhythm: 'Il tuo ritmo naturale', energy_year: 'Il tuo anno personale',
    warning_signals: 'Segnali di Allerta',
    blueprint: 'Piano Energetico Centrale', strengths: 'Punti di Forza Naturali', vulnerabilities: 'OpportunitÃ  di Crescita',
    energy_patterns: 'Schemi di Energia', sabotage: 'Schemi da Osservare', decision: 'Stile Decisionale', work: 'Profilo di Lavoro e Disciplina',
    self_perspective: 'Prospettiva Personale', str: 'Doni Naturali', weak: 'Aree di Crescita', opp: 'OpportunitÃ  di Brillare', threats: 'Schemi da Liberare',
    alignment_plan: 'Piano di Allineamento', layer1: 'Strato 1 â€” Chiarezza Direzionale', prioritize: 'Energizzare â€” Prioritizzare', eliminate: 'Liberare â€” Lasciar Andare',
    layer2: 'Strato 2 â€” Piano Strutturato', focus: 'Focus di 30 Giorni', weekly: 'Modello Settimanale', daily: 'Modello Giornaliero',
    layer3: 'Strato 3 â€” Ancore Comportamentali', habits: 'Abitudini Chiave', forbidden: 'Comportamenti Vietati', agreements: 'I Miei Accordi',
    footer: 'Piattaforma di Allineamento Personale â€” Riservato'
  },
  pt: {
    title: 'Seu Perfil de Alinhamento', generated: 'Gerado para',
    hd_title: 'Human Design', hd_type: 'Tipo', hd_profile: 'Perfil', hd_strategy: 'EstratÃ©gia', hd_authority: 'Autoridade',
    archetype: 'Seu ArquÃ©tipo', how_you_work: 'Como VocÃª Funciona', layer_surface: 'Na SuperfÃ­cie', layer_engine: 'Seu Motor', layer_core: 'Nas Profundezas',
    friction_map: 'TensÃµes Internas', friction_daily: 'No dia a dia', friction_resolution: 'Como manter as duas',
    aligned_life: 'A Vida em Alinhamento', decision_system: 'Seu Sistema de DecisÃ£o',
    energy_manual: 'O Manual da Sua Energia', energy_peak: 'Quando vocÃª estÃ¡ no auge', energy_drain: 'O que te esgota', energy_rhythm: 'Seu ritmo natural', energy_year: 'Seu ano pessoal',
    warning_signals: 'Sinais de Alerta',
    blueprint: 'Plano EnergÃ©tico Central', strengths: 'ForÃ§as Naturais', vulnerabilities: 'Oportunidades de Crescimento',
    energy_patterns: 'PadrÃµes de Energia', sabotage: 'PadrÃµes a Observar', decision: 'Estilo de Tomada de DecisÃ£o', work: 'Perfil de Trabalho e Disciplina',
    self_perspective: 'Perspectiva Pessoal', str: 'Dons Naturais', weak: 'Ãreas de Crescimento', opp: 'Oportunidades de Brilhar', threats: 'PadrÃµes a Liberar',
    alignment_plan: 'Plano de Alinhamento', layer1: 'Camada 1 â€” Clareza Direcional', prioritize: 'Energizar â€” Priorizar', eliminate: 'Liberar â€” Deixar Ir',
    layer2: 'Camada 2 â€” Plano Estruturado', focus: 'Foco de 30 Dias', weekly: 'Modelo Semanal', daily: 'Modelo DiÃ¡rio',
    layer3: 'Camada 3 â€” Ã‚ncoras Comportamentais', habits: 'HÃ¡bitos Essenciais', forbidden: 'Comportamentos Proibidos', agreements: 'Meus Acordos',
    footer: 'Plataforma de Alinhamento Pessoal â€” Confidencial'
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
    alignment_plan: 'Uitlijningsplan', layer1: 'Laag 1 â€” Richtingshelderheid', prioritize: 'Energetiseren â€” Prioriteren', eliminate: 'Loslaten',
    layer2: 'Laag 2 â€” Gestructureerd Plan', focus: '30-Dagen Focus', weekly: 'Weeksjabloon', daily: 'Dagsjabloon',
    layer3: 'Laag 3 â€” Gedragsankers', habits: 'Sleutelgewoonten', forbidden: 'Verboden Gedragingen', agreements: 'Mijn Afspraken',
    footer: 'Persoonlijk Uitlijningsplatform â€” Vertrouwelijk'
  },
  pl: {
    title: 'TwÃ³j Profil WyrÃ³wnania', generated: 'Wygenerowano dla',
    hd_title: 'Human Design', hd_type: 'Typ', hd_profile: 'Profil', hd_strategy: 'Strategia', hd_authority: 'Autorytet',
    archetype: 'TwÃ³j Archetyp', how_you_work: 'Jak Funkcjonujesz', layer_surface: 'Na Powierzchni', layer_engine: 'TwÃ³j Silnik', layer_core: 'W GÅ‚Ä™bi',
    friction_map: 'WewnÄ™trzne NapiÄ™cia', friction_daily: 'W codziennym Å¼yciu', friction_resolution: 'Jak utrzymaÄ‡ obie',
    aligned_life: 'Å»ycie w Zgodzie', decision_system: 'TwÃ³j System Decyzyjny',
    energy_manual: 'PodrÄ™cznik Twojej Energii', energy_peak: 'Kiedy jesteÅ› u szczytu', energy_drain: 'Co ciÄ™ wyczerpuje', energy_rhythm: 'TwÃ³j naturalny rytm', energy_year: 'TwÃ³j rok osobisty',
    warning_signals: 'SygnaÅ‚y Ostrzegawcze',
    blueprint: 'Centralny Plan Energetyczny', strengths: 'Naturalne Mocne Strony', vulnerabilities: 'MoÅ¼liwoÅ›ci Rozwoju',
    energy_patterns: 'Wzorce Energii', sabotage: 'Wzorce do Obserwowania', decision: 'Styl Podejmowania Decyzji', work: 'Profil Pracy i Dyscypliny',
    self_perspective: 'Osobista Perspektywa', str: 'Naturalne Dary', weak: 'Obszary Wzrostu', opp: 'MoÅ¼liwoÅ›ci BÅ‚yszczenia', threats: 'Wzorce do Uwolnienia',
    alignment_plan: 'Plan WyrÃ³wnania', layer1: 'Warstwa 1 â€” JasnoÅ›Ä‡ Kierunkowa', prioritize: 'EnergetyzowaÄ‡ â€” PriorytetyzowaÄ‡', eliminate: 'UwolniÄ‡ â€” PuÅ›ciÄ‡',
    layer2: 'Warstwa 2 â€” Ustrukturyzowany Plan', focus: 'Skupienie na 30 Dni', weekly: 'Szablon Tygodniowy', daily: 'Szablon Dzienny',
    layer3: 'Warstwa 3 â€” Kotwice Behawioralne', habits: 'Kluczowe Nawyki', forbidden: 'Zakazane Zachowania', agreements: 'Moje Umowy',
    footer: 'Platforma Osobistego WyrÃ³wnania â€” Poufne'
  },
  hu: {
    title: 'Az Ã–n IgazÃ­tÃ¡si Profilja', generated: 'LÃ©trehozva',
    hd_title: 'Human Design', hd_type: 'TÃ­pus', hd_profile: 'Profil', hd_strategy: 'StratÃ©gia', hd_authority: 'AutoritÃ¡s',
    archetype: 'Az Ã–n ArchetÃ­pusa', how_you_work: 'Hogyan MÅ±kÃ¶dik', layer_surface: 'A FelszÃ­nen', layer_engine: 'Az Ã–n Motorja', layer_core: 'A MÃ©lyben',
    friction_map: 'BelsÅ‘ FeszÃ¼ltsÃ©gek', friction_daily: 'A mindennapokban', friction_resolution: 'Hogyan tartsa mindkettÅ‘t',
    aligned_life: 'Ã‰let Ã–sszhangban', decision_system: 'Az Ã–n DÃ¶ntÃ©si Rendszere',
    energy_manual: 'Az Ã–n Energia KÃ©zikÃ¶nyve', energy_peak: 'Amikor csÃºcson van', energy_drain: 'Mi merÃ­ti ki', energy_rhythm: 'Az Ã–n termÃ©szetes ritmusa', energy_year: 'Az Ã–n szemÃ©lyes Ã©ve',
    warning_signals: 'FigyelmeztetÅ‘ Jelek',
    blueprint: 'KÃ¶zponti Energetikai Terv', strengths: 'TermÃ©szetes ErÅ‘ssÃ©gek', vulnerabilities: 'NÃ¶vekedÃ©si LehetÅ‘sÃ©gek',
    energy_patterns: 'Energia MintÃ¡k', sabotage: 'MegfigyelendÅ‘ MintÃ¡k', decision: 'DÃ¶ntÃ©shozatali StÃ­lus', work: 'Munka Ã©s Fegyelem Profil',
    self_perspective: 'SzemÃ©lyes PerspektÃ­va', str: 'TermÃ©szetes AdottsÃ¡gok', weak: 'NÃ¶vekedÃ©si TerÃ¼letek', opp: 'RagyogÃ¡si LehetÅ‘sÃ©gek', threats: 'FeloldandÃ³ MintÃ¡k',
    alignment_plan: 'IgazÃ­tÃ¡si Terv', layer1: '1. RÃ©teg â€” IrÃ¡nyvonal TisztasÃ¡g', prioritize: 'EnergizÃ¡lÃ¡s â€” PriorizÃ¡lÃ¡s', eliminate: 'ElengedÃ©s',
    layer2: '2. RÃ©teg â€” StrukturÃ¡lt Terv', focus: '30 Napos FÃ³kusz', weekly: 'Heti Sablon', daily: 'Napi Sablon',
    layer3: '3. RÃ©teg â€” ViselkedÃ©si Horgonyok', habits: 'Kulcs SzokÃ¡sok', forbidden: 'Tiltott ViselkedÃ©sek', agreements: 'MegÃ¡llapodÃ¡saim',
    footer: 'SzemÃ©lyes IgazÃ­tÃ¡si Platform â€” Bizalmas'
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

    // How you work â€” 3 layers
    if (work && (work.surface || work.engine || work.core)) {
      sectionsHtml += `<div class="section">
        <div class="tag tp">${esc(L.how_you_work)}</div>
        ${work.surface ? `<div class="sub" style="color:#4A9B7F">${esc(L.layer_surface)}</div><p class="blueprint">${esc(work.surface)}</p>` : ''}
        ${work.engine ? `<div class="sub" style="color:var(--gold);margin-top:8px">${esc(L.layer_engine)}</div><p class="blueprint">${esc(work.engine)}</p>` : ''}
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
          ${energy.rhythm ? `<div><div class="sub" style="color:var(--gold)">${esc(L.energy_rhythm)}</div><p class="blueprint">${esc(energy.rhythm)}</p></div>` : ''}
          ${energy.current_year ? `<div><div class="sub" style="color:#E8824A">${esc(L.energy_year)}</div><p class="blueprint">${esc(energy.current_year)}</p></div>` : ''}
        </div>
      </div>`
    }

    // Warning signals
    if (signals.length) {
      let ws = `<div class="section"><div class="tag to">${esc(L.warning_signals)}</div>`
      signals.forEach(w => {
        ws += `<div class="signal">
          ${w.signal ? `<p class="signal-feel">âš  ${esc(w.signal)}</p>` : ''}
          ${w.pattern ? `<p class="blueprint">${esc(w.pattern)}</p>` : ''}
          ${w.exit ? `<p class="signal-exit">â†’ ${esc(w.exit)}</p>` : ''}
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
      <div class="section"><div class="tag tp">${esc(L.energy_patterns)}</div><ul>${bullets(sections?.energy_patterns, 'var(--gold)')}</ul></div>
      <div class="section"><div class="tag to">${esc(L.sabotage)}</div><ul>${bullets(sections?.sabotage_tendencies, '#E8824A')}</ul></div>
    </div>`
    sectionsHtml += `<div class="g2">
      <div class="section"><div class="tag tg">${esc(L.decision)}</div><ul>${bullets(sections?.decision_making, '#4A9B7F')}</ul></div>
      <div class="section"><div class="tag tp">${esc(L.work)}</div><ul>${bullets(sections?.work_discipline, 'var(--gold)')}</ul></div>
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
.header { background:linear-gradient(135deg,var(--water-deep),var(--water-plum)); color:#fff; padding:22px 28px; border-radius:10px; margin-bottom:16px; }
.header h1 { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; margin-bottom:3px; }
.header p { font-size:11px; opacity:0.65; }
.py { background:var(--water-deep); border-radius:10px; padding:14px 18px; margin-bottom:14px; display:flex; gap:14px; align-items:center; }
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
.archetype { background:linear-gradient(135deg,var(--water-deep),var(--water-plum)); border:none; }
.archetype .tag { background:rgba(255,255,255,0.15); color:#fff; }
.arch-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#fff; margin:6px 0 8px; }
.archetype .blueprint { color:rgba(255,255,255,0.85); }
.tag { display:inline-block; padding:3px 10px; border-radius:20px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
.tp { background:var(--gold-faint); color:var(--gold); }
.tg { background:rgba(74,155,127,0.1); color:#4A9B7F; }
.to { background:rgba(232,130,74,0.1); color:#E8824A; }
ul { list-style:none; padding:0; margin:0; }
li { padding:4px 0 4px 12px; border-bottom:1px solid #f0f0ee; font-size:11px; position:relative; }
li:last-child { border-bottom:none; }
li::before { content:'â€¢'; position:absolute; left:1px; }
.blueprint { font-size:11px; line-height:1.75; color:#333; }
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px; }
.sub { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin:8px 0 4px; }
.italic { font-size:11px; color:#333; line-height:1.7; font-style:italic; margin-bottom:6px; }
.badge { display:inline-block; padding:2px 9px; border-radius:20px; font-size:9px; font-weight:700; color:#fff; margin-bottom:8px; }
.b1{background:var(--gold)}.b2{background:#4A9B7F}.b3{background:#E8824A}
.friction { border-bottom:1px solid #f0f0ee; padding-bottom:8px; margin-bottom:8px; }
.friction:last-child { border-bottom:none; }
.friction-name { font-family:'Cormorant Garamond',serif; font-size:14px; font-weight:600; color:#1a1a1a; margin-bottom:6px; }
.pull { background:#f8f8f6; border-radius:6px; padding:8px; font-size:10px; line-height:1.5; }
.pull-a { border-left:2px solid var(--gold); }
.pull-b { border-left:2px solid #4A9B7F; }
.pull-tag { display:inline-block; width:14px; height:14px; border-radius:50%; color:#fff; font-size:8px; font-weight:700; text-align:center; line-height:14px; }
.pa{background:var(--gold)}.pb{background:#4A9B7F}
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
    <div><div class="sub" style="color:var(--gold)">${esc(L.opp)}</div><ul>${bullets(swot?.opportunities, 'var(--gold)')}</ul></div>
    ${(swot?.threats && swot.threats.length) ? `<div><div class="sub" style="color:#E8824A">${esc(L.threats)}</div><ul>${bullets(swot?.threats, '#E8824A')}</ul></div>` : ''}
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
    <div><div class="sub" style="color:var(--gold)">${esc(L.habits)}</div><ul>${bullets(alignment_plan?.behavioral_anchors?.keystone_habits, 'var(--gold)')}</ul></div>
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
