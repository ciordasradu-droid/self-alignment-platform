function reduceToSingleDigit(num) {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0)
  }
  return num
}

function calculateLifePath(dateOfBirth) {
  const digits = dateOfBirth.replace(/-/g, '').split('').map(Number)
  const sum = digits.reduce((a, b) => a + b, 0)
  return reduceToSingleDigit(sum)
}

function calculateExpressionNumber(fullName) {
  const pythagorean = {
    a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
    j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
    s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8
  }
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, '').split('')
  const sum = letters.reduce((acc, l) => acc + (pythagorean[l] || 0), 0)
  return reduceToSingleDigit(sum)
}

function calculateSoulUrge(fullName) {
  const pythagorean = { a:1, e:5, i:9, o:6, u:3 }
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, '').split('')
  const sum = letters
    .filter(l => ['a','e','i','o','u'].includes(l))
    .reduce((acc, l) => acc + (pythagorean[l] || 0), 0)
  return reduceToSingleDigit(sum)
}

function calculatePersonalityNumber(fullName) {
  const pythagorean = {
    b:2,c:3,d:4,f:6,g:7,h:8,j:1,k:2,l:3,m:4,
    n:5,p:7,q:8,r:9,s:1,t:2,v:4,w:5,x:6,y:7,z:8
  }
  const vowels = ['a','e','i','o','u']
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, '').split('')
  const sum = letters
    .filter(l => !vowels.includes(l))
    .reduce((acc, l) => acc + (pythagorean[l] || 0), 0)
  return reduceToSingleDigit(sum)
}

const PERSONAL_YEAR_PHASES = {
  1: {
    en: { theme:'New Beginnings', focus:'Plant seeds for what you want to create. This is a year of starting, not finishing.', warning:'Avoid clinging to what no longer serves you. The old must go to make room.' },
    ro: { theme:'Începuturi Noi', focus:'Plantează semințe pentru ceea ce vrei să creezi. Acesta este un an de început, nu de finalizare.', warning:'Evită să te agăți de ceea ce nu te mai servește. Vechiul trebuie să plece pentru a face loc.' },
    es: { theme:'Nuevos Comienzos', focus:'Planta semillas para lo que quieres crear. Este es un año de comienzos, no de finales.', warning:'Evita aferrarte a lo que ya no te sirve. Lo viejo debe irse para hacer espacio.' },
    fr: { theme:'Nouveaux Débuts', focus:'Plante des graines pour ce que tu veux créer. C\'est une année de commencements, pas de fins.', warning:'Évite de t\'accrocher à ce qui ne te sert plus. L\'ancien doit partir pour faire de la place.' },
    de: { theme:'Neue Anfänge', focus:'Pflanze Samen für das, was du erschaffen möchtest. Dies ist ein Jahr des Beginns, nicht des Abschlusses.', warning:'Vermeide es, an dem festzuhalten, was dir nicht mehr dient. Das Alte muss gehen, um Platz zu machen.' },
    it: { theme:'Nuovi Inizi', focus:'Pianta semi per ciò che vuoi creare. Questo è un anno di inizi, non di conclusioni.', warning:'Evita di aggrapparti a ciò che non ti serve più. Il vecchio deve andare per fare spazio.' },
    pt: { theme:'Novos Começos', focus:'Plante sementes para o que você quer criar. Este é um ano de começar, não de terminar.', warning:'Evite se agarrar ao que não te serve mais. O velho deve ir para abrir espaço.' },
    nl: { theme:'Nieuwe Beginnen', focus:'Plant zaden voor wat je wilt creëren. Dit is een jaar van beginnen, niet van eindigen.', warning:'Vermijd je vast te klampen aan wat je niet meer dient. Het oude moet gaan om ruimte te maken.' },
    pl: { theme:'Nowe Początki', focus:'Sadź nasiona dla tego, co chcesz stworzyć. To rok rozpoczynania, nie kończenia.', warning:'Unikaj trzymania się tego, co już ci nie służy. Stare musi odejść, żeby zrobić miejsce.' },
    hu: { theme:'Új Kezdetek', focus:'Ültesd el a magokat ahhoz, amit létre szeretnél hozni. Ez egy kezdés éve, nem befejezésé.', warning:'Kerüld a ragaszkodást ahhoz, ami már nem szolgál. A réginek el kell mennie, hogy helyet csináljon.' }
  },
  2: {
    en: { theme:'Patience & Partnership', focus:'Nurture relationships and allow things to develop. Cooperation over competition.', warning:'Avoid forcing outcomes. Things are growing beneath the surface.' },
    ro: { theme:'Răbdare și Parteneriat', focus:'Hrănește relațiile și lasă lucrurile să se dezvolte. Cooperare înaintea competiției.', warning:'Evită să forțezi rezultatele. Lucrurile cresc sub suprafață.' },
    es: { theme:'Paciencia y Asociación', focus:'Nutre las relaciones y permite que las cosas se desarrollen. Cooperación sobre competencia.', warning:'Evita forzar resultados. Las cosas están creciendo bajo la superficie.' },
    fr: { theme:'Patience et Partenariat', focus:'Nourris les relations et laisse les choses se développer. Coopération plutôt que compétition.', warning:'Évite de forcer les résultats. Les choses grandissent sous la surface.' },
    de: { theme:'Geduld und Partnerschaft', focus:'Pflege Beziehungen und lass Dinge sich entwickeln. Kooperation über Wettbewerb.', warning:'Vermeide es, Ergebnisse zu erzwingen. Dinge wachsen unter der Oberfläche.' },
    it: { theme:'Pazienza e Partnership', focus:'Nutri le relazioni e lascia che le cose si sviluppino. Cooperazione sulla competizione.', warning:'Evita di forzare i risultati. Le cose stanno crescendo sotto la superficie.' },
    pt: { theme:'Paciência e Parceria', focus:'Nutra relacionamentos e permita que as coisas se desenvolvam. Cooperação sobre competição.', warning:'Evite forçar resultados. As coisas estão crescendo sob a superfície.' },
    nl: { theme:'Geduld en Partnerschap', focus:'Koester relaties en laat dingen zich ontwikkelen. Samenwerking boven competitie.', warning:'Vermijd het forceren van uitkomsten. Dingen groeien onder de oppervlakte.' },
    pl: { theme:'Cierpliwość i Partnerstwo', focus:'Pielęgnuj relacje i pozwól rzeczom się rozwijać. Współpraca ponad konkurencją.', warning:'Unikaj wymuszania wyników. Rzeczy rosną pod powierzchnią.' },
    hu: { theme:'Türelem és Partnerség', focus:'Ápold a kapcsolatokat és hagyd, hogy a dolgok fejlődjenek. Együttműködés a versengés felett.', warning:'Kerüld az eredmények erőltetését. A dolgok a felszín alatt növekednek.' }
  },
  3: {
    en: { theme:'Expression & Growth', focus:'Share your voice, create, and expand socially. Joy is your compass this year.', warning:'Avoid scattering your energy across too many directions.' },
    ro: { theme:'Exprimare și Creștere', focus:'Împărtășește-ți vocea, creează și extinde-te social. Bucuria este busola ta în acest an.', warning:'Evită să-ți împrăștii energia în prea multe direcții.' },
    es: { theme:'Expresión y Crecimiento', focus:'Comparte tu voz, crea y expándete socialmente. La alegría es tu brújula este año.', warning:'Evita dispersar tu energía en demasiadas direcciones.' },
    fr: { theme:'Expression et Croissance', focus:'Partage ta voix, crée et développe-toi socialement. La joie est ton boussole cette année.', warning:'Évite de disperser ton énergie dans trop de directions.' },
    de: { theme:'Ausdruck und Wachstum', focus:'Teile deine Stimme, erschaffe und expandiere sozial. Freude ist dein Kompass dieses Jahr.', warning:'Vermeide es, deine Energie in zu viele Richtungen zu streuen.' },
    it: { theme:'Espressione e Crescita', focus:'Condividi la tua voce, crea ed espanditi socialmente. La gioia è la tua bussola quest\'anno.', warning:'Evita di disperdere la tua energia in troppe direzioni.' },
    pt: { theme:'Expressão e Crescimento', focus:'Compartilhe sua voz, crie e expanda socialmente. A alegria é sua bússola este ano.', warning:'Evite dispersar sua energia em muitas direções.' },
    nl: { theme:'Expressie en Groei', focus:'Deel je stem, creëer en breid sociaal uit. Vreugde is je kompas dit jaar.', warning:'Vermijd het verspreiden van je energie over te veel richtingen.' },
    pl: { theme:'Ekspresja i Wzrost', focus:'Dziel się swoim głosem, twórz i rozwijaj się społecznie. Radość jest twoim kompasem w tym roku.', warning:'Unikaj rozpraszania energii w zbyt wiele kierunków.' },
    hu: { theme:'Kifejezés és Növekedés', focus:'Oszd meg a hangodat, alkoss és terjeszkedj társadalmilag. Az öröm az iránytűd ebben az évben.', warning:'Kerüld az energia szétszórását túl sok irányba.' }
  },
  4: {
    en: { theme:'Structure & Foundation', focus:'Build systems, establish routines, do the disciplined work. Slow and steady wins.', warning:'Avoid shortcuts. What you build now determines your next 4 years.' },
    ro: { theme:'Structură și Fundație', focus:'Construiește sisteme, stabilește rutine, fă munca disciplinată. Lent și constant câștigă.', warning:'Evită scurtăturile. Ceea ce construiești acum determină următori 4 ani.' },
    es: { theme:'Estructura y Fundación', focus:'Construye sistemas, establece rutinas, haz el trabajo disciplinado. Lento y constante gana.', warning:'Evita los atajos. Lo que construyes ahora determina tus próximos 4 años.' },
    fr: { theme:'Structure et Fondation', focus:'Construis des systèmes, établis des routines, fais le travail discipliné. Lent et régulier gagne.', warning:'Évite les raccourcis. Ce que tu construis maintenant détermine tes 4 prochaines années.' },
    de: { theme:'Struktur und Fundament', focus:'Baue Systeme auf, etabliere Routinen, tue die disziplinierte Arbeit. Langsam und stetig gewinnt.', warning:'Vermeide Abkürzungen. Was du jetzt baust, bestimmt deine nächsten 4 Jahre.' },
    it: { theme:'Struttura e Fondazione', focus:'Costruisci sistemi, stabilisci routine, fai il lavoro disciplinato. Lento e costante vince.', warning:'Evita le scorciatoie. Ciò che costruisci ora determina i tuoi prossimi 4 anni.' },
    pt: { theme:'Estrutura e Fundação', focus:'Construa sistemas, estabeleça rotinas, faça o trabalho disciplinado. Devagar e sempre ganha.', warning:'Evite atalhos. O que você constrói agora determina seus próximos 4 anos.' },
    nl: { theme:'Structuur en Fundament', focus:'Bouw systemen, vestig routines, doe het gedisciplineerde werk. Langzaam en gestaag wint.', warning:'Vermijd snelle wegen. Wat je nu bouwt bepaalt je volgende 4 jaar.' },
    pl: { theme:'Struktura i Fundament', focus:'Buduj systemy, ustanawiaj rutyny, wykonuj zdyscyplinowaną pracę. Powoli i wytrwale wygrywa.', warning:'Unikaj skrótów. To co budujesz teraz determinuje twoje następne 4 lata.' },
    hu: { theme:'Struktúra és Alap', focus:'Építs rendszereket, alakíts ki rutinokat, végezd a fegyelmezett munkát. A lassú és kitartó nyer.', warning:'Kerüld a rövidítéseket. Amit most építesz, az határozza meg a következő 4 évedet.' }
  },
  5: {
    en: { theme:'Change & Freedom', focus:'Embrace change, explore new directions, and release rigid structures.', warning:'Avoid impulsive decisions and overindulgence. Freedom needs direction.' },
    ro: { theme:'Schimbare și Libertate', focus:'Îmbrățișează schimbarea, explorează noi direcții și eliberează structurile rigide.', warning:'Evită deciziile impulsive și excesele. Libertatea are nevoie de direcție.' },
    es: { theme:'Cambio y Libertad', focus:'Abraza el cambio, explora nuevas direcciones y libera las estructuras rígidas.', warning:'Evita las decisiones impulsivas y los excesos. La libertad necesita dirección.' },
    fr: { theme:'Changement et Liberté', focus:'Embrasse le changement, explore de nouvelles directions et libère les structures rigides.', warning:'Évite les décisions impulsives et les excès. La liberté a besoin de direction.' },
    de: { theme:'Wandel und Freiheit', focus:'Umarme den Wandel, erkunde neue Richtungen und löse starre Strukturen.', warning:'Vermeide impulsive Entscheidungen und Ausschweifungen. Freiheit braucht Richtung.' },
    it: { theme:'Cambiamento e Libertà', focus:'Abbraccia il cambiamento, esplora nuove direzioni e libera le strutture rigide.', warning:'Evita decisioni impulsive e eccessi. La libertà ha bisogno di direzione.' },
    pt: { theme:'Mudança e Liberdade', focus:'Abrace a mudança, explore novas direções e libere estruturas rígidas.', warning:'Evite decisões impulsivas e excessos. A liberdade precisa de direção.' },
    nl: { theme:'Verandering en Vrijheid', focus:'Omarm verandering, verken nieuwe richtingen en laat rigide structuren los.', warning:'Vermijd impulsieve beslissingen en overdaad. Vrijheid heeft richting nodig.' },
    pl: { theme:'Zmiana i Wolność', focus:'Przyjmij zmianę, eksploruj nowe kierunki i uwolnij sztywne struktury.', warning:'Unikaj impulsywnych decyzji i przesady. Wolność potrzebuje kierunku.' },
    hu: { theme:'Változás és Szabadság', focus:'Fogadd el a változást, fedezz fel új irányokat és engedd el a merev struktúrákat.', warning:'Kerüld az impulzív döntéseket és a mértéktelenséget. A szabadságnak iránya kell.' }
  },
  6: {
    en: { theme:'Responsibility & Harmony', focus:'Tend to home, family, and close relationships. Service and love lead the way.', warning:'Avoid overgiving at the expense of your own needs.' },
    ro: { theme:'Responsabilitate și Armonie', focus:'Îngrijește-te de casă, familie și relații apropiate. Serviciul și dragostea conduc calea.', warning:'Evită să dai prea mult în detrimentul propriilor nevoi.' },
    es: { theme:'Responsabilidad y Armonía', focus:'Cuida el hogar, la familia y las relaciones cercanas. El servicio y el amor lideran el camino.', warning:'Evita dar demasiado a expensas de tus propias necesidades.' },
    fr: { theme:'Responsabilité et Harmonie', focus:'Prends soin du foyer, de la famille et des relations proches. Le service et l\'amour ouvrent la voie.', warning:'Évite de trop donner au détriment de tes propres besoins.' },
    de: { theme:'Verantwortung und Harmonie', focus:'Kümmere dich um Zuhause, Familie und enge Beziehungen. Dienst und Liebe weisen den Weg.', warning:'Vermeide es, auf Kosten deiner eigenen Bedürfnisse zu viel zu geben.' },
    it: { theme:'Responsabilità e Armonia', focus:'Prenditi cura della casa, della famiglia e delle relazioni strette. Il servizio e l\'amore guidano la via.', warning:'Evita di dare troppo a scapito dei tuoi bisogni.' },
    pt: { theme:'Responsabilidade e Harmonia', focus:'Cuide do lar, família e relacionamentos próximos. O serviço e o amor lideram o caminho.', warning:'Evite dar demais às custas das suas próprias necessidades.' },
    nl: { theme:'Verantwoordelijkheid en Harmonie', focus:'Zorg voor thuis, familie en nauwe relaties. Dienst en liefde leiden de weg.', warning:'Vermijd te veel geven ten koste van je eigen behoeften.' },
    pl: { theme:'Odpowiedzialność i Harmonia', focus:'Dbaj o dom, rodzinę i bliskie relacje. Służba i miłość prowadzą drogę.', warning:'Unikaj nadmiernego dawania kosztem własnych potrzeb.' },
    hu: { theme:'Felelősség és Harmónia', focus:'Törődj az otthonnal, a családdal és a közeli kapcsolatokkal. A szolgálat és a szeretet vezeti az utat.', warning:'Kerüld a túlzott adást a saját szükségletek rovására.' }
  },
  7: {
    en: { theme:'Reflection & Mastery', focus:'Go inward. Study, reflect, and deepen your understanding of yourself.', warning:'Avoid isolation and overthinking. Rest is not the same as retreat.' },
    ro: { theme:'Reflecție și Măiestrie', focus:'Mergi spre interior. Studiază, reflectează și aprofundează înțelegerea de sine.', warning:'Evită izolarea și gândirea excesivă. Odihna nu este același lucru cu retragerea.' },
    es: { theme:'Reflexión y Maestría', focus:'Ve hacia adentro. Estudia, reflexiona y profundiza tu comprensión de ti mismo.', warning:'Evita el aislamiento y el pensamiento excesivo. Descansar no es lo mismo que retirarse.' },
    fr: { theme:'Réflexion et Maîtrise', focus:'Va vers l\'intérieur. Étudie, réfléchis et approfondi ta compréhension de toi-même.', warning:'Évite l\'isolement et la surréflexion. Se reposer n\'est pas la même chose que se retirer.' },
    de: { theme:'Reflexion und Meisterschaft', focus:'Geh nach innen. Studiere, reflektiere und vertiefe dein Selbstverständnis.', warning:'Vermeide Isolation und Überdenken. Ruhe ist nicht dasselbe wie Rückzug.' },
    it: { theme:'Riflessione e Maestria', focus:'Vai verso l\'interno. Studia, rifletti e approfondisci la tua comprensione di te stesso.', warning:'Evita l\'isolamento e il pensiero eccessivo. Riposarsi non è lo stesso che ritirarsi.' },
    pt: { theme:'Reflexão e Maestria', focus:'Vá para dentro. Estude, reflita e aprofunde sua compreensão de si mesmo.', warning:'Evite isolamento e pensamento excessivo. Descansar não é o mesmo que se retirar.' },
    nl: { theme:'Reflectie en Meesterschap', focus:'Ga naar binnen. Studeer, reflecteer en verdiep je zelfbegrip.', warning:'Vermijd isolatie en overdenken. Rusten is niet hetzelfde als terugtrekken.' },
    pl: { theme:'Refleksja i Mistrzostwo', focus:'Idź do wewnątrz. Ucz się, reflektuj i pogłębiaj swoją samoświadomość.', warning:'Unikaj izolacji i nadmiernego myślenia. Odpoczynek to nie to samo co wycofanie.' },
    hu: { theme:'Reflexió és Mesterség', focus:'Menj befelé. Tanulmányozz, reflektálj és mélyítsd az önmegismerésedet.', warning:'Kerüld az elszigetelődést és a túlgondolkodást. A pihenés nem ugyanaz, mint a visszavonulás.' }
  },
  8: {
    en: { theme:'Power & Achievement', focus:'Step into your authority. This is a year of ambition, results, and material growth.', warning:'Avoid sacrificing relationships for achievement.' },
    ro: { theme:'Putere și Realizare', focus:'Intră în autoritatea ta. Acesta este un an de ambiție, rezultate și creștere materială.', warning:'Evită să sacrifici relațiile pentru realizări.' },
    es: { theme:'Poder y Logros', focus:'Entra en tu autoridad. Este es un año de ambición, resultados y crecimiento material.', warning:'Evita sacrificar las relaciones por los logros.' },
    fr: { theme:'Pouvoir et Réussite', focus:'Entre dans ton autorité. C\'est une année d\'ambition, de résultats et de croissance matérielle.', warning:'Évite de sacrifier les relations pour la réussite.' },
    de: { theme:'Macht und Leistung', focus:'Tritt in deine Autorität. Dies ist ein Jahr des Ehrgeizes, der Ergebnisse und des materiellen Wachstums.', warning:'Vermeide es, Beziehungen für Leistung zu opfern.' },
    it: { theme:'Potere e Realizzazione', focus:'Entra nella tua autorità. Questo è un anno di ambizione, risultati e crescita materiale.', warning:'Evita di sacrificare le relazioni per il successo.' },
    pt: { theme:'Poder e Realização', focus:'Entre na sua autoridade. Este é um ano de ambição, resultados e crescimento material.', warning:'Evite sacrificar relacionamentos por realizações.' },
    nl: { theme:'Macht en Prestatie', focus:'Stap in je autoriteit. Dit is een jaar van ambitie, resultaten en materiële groei.', warning:'Vermijd het opofferen van relaties voor prestaties.' },
    pl: { theme:'Władza i Osiągnięcia', focus:'Wejdź w swoją władzę. To rok ambicji, wyników i materialnego wzrostu.', warning:'Unikaj poświęcania relacji dla osiągnięć.' },
    hu: { theme:'Hatalom és Teljesítmény', focus:'Lépj be az autoritásodba. Ez az ambíció, az eredmények és az anyagi növekedés éve.', warning:'Kerüld a kapcsolatok feláldozását a teljesítményért.' }
  },
  9: {
    en: { theme:'Completion & Release', focus:'Let go of what no longer fits. Forgive, release, and prepare for a new cycle.', warning:'Avoid starting major new projects. Complete what needs completing.' },
    ro: { theme:'Finalizare și Eliberare', focus:'Lasă să plece ceea ce nu se mai potrivește. Iartă, eliberează și pregătește-te pentru un nou ciclu.', warning:'Evită să începi proiecte majore noi. Completează ceea ce trebuie completat.' },
    es: { theme:'Finalización y Liberación', focus:'Suelta lo que ya no encaja. Perdona, libera y prepárate para un nuevo ciclo.', warning:'Evita comenzar grandes proyectos nuevos. Completa lo que necesita completarse.' },
    fr: { theme:'Complétion et Libération', focus:'Laisse partir ce qui ne s\'adapte plus. Pardonne, libère et prépare-toi pour un nouveau cycle.', warning:'Évite de commencer de grands nouveaux projets. Complète ce qui doit être complété.' },
    de: { theme:'Vollendung und Loslassen', focus:'Lass los, was nicht mehr passt. Vergib, lass los und bereite dich auf einen neuen Zyklus vor.', warning:'Vermeide es, große neue Projekte zu beginnen. Vervollständige, was vervollständigt werden muss.' },
    it: { theme:'Completamento e Liberazione', focus:'Lascia andare ciò che non si adatta più. Perdona, libera e preparati per un nuovo ciclo.', warning:'Evita di iniziare grandi nuovi progetti. Completa ciò che deve essere completato.' },
    pt: { theme:'Conclusão e Liberação', focus:'Deixe ir o que não se encaixa mais. Perdoe, libere e prepare-se para um novo ciclo.', warning:'Evite começar grandes projetos novos. Complete o que precisa ser completado.' },
    nl: { theme:'Voltooiing en Loslating', focus:'Laat los wat niet meer past. Vergeef, laat los en bereid je voor op een nieuwe cyclus.', warning:'Vermijd het starten van grote nieuwe projecten. Voltooi wat voltooid moet worden.' },
    pl: { theme:'Zakończenie i Uwolnienie', focus:'Puść to, co już nie pasuje. Wybacz, uwolnij i przygotuj się na nowy cykl.', warning:'Unikaj rozpoczynania dużych nowych projektów. Dokończ to, co wymaga dokończenia.' },
    hu: { theme:'Befejezés és Elengedés', focus:'Engedd el azt, ami már nem illik. Bocsáss meg, engedj el és készülj fel egy új ciklusra.', warning:'Kerüld a nagy új projektek elkezdését. Fejezd be, ami befejezésre szorul.' }
  }
}

function calculatePersonalYear(dateOfBirth, language = 'en') {
  const currentYear = new Date().getFullYear()
  const parts = dateOfBirth.split('-')
  const month = parseInt(parts[1])
  const day = parseInt(parts[2])

  const sum = day + month + currentYear
  const digits = String(sum).split('').map(Number)
  let personalYear = digits.reduce((a, b) => a + b, 0)
  while (personalYear > 9) {
    personalYear = String(personalYear).split('').map(Number).reduce((a, b) => a + b, 0)
  }

  const lang = PERSONAL_YEAR_PHASES[personalYear][language] || PERSONAL_YEAR_PHASES[personalYear]['en']

  return {
    personal_year: personalYear,
    theme: lang.theme,
    focus: lang.focus,
    warning: lang.warning,
    energy: PERSONAL_YEAR_PHASES[personalYear]['en'].energy || ''
  }
}

export function calculateNumerology(fullName, dateOfBirth, language = 'en') {
  return {
    life_path: calculateLifePath(dateOfBirth),
    expression: calculateExpressionNumber(fullName),
    soul_urge: calculateSoulUrge(fullName),
    personality: calculatePersonalityNumber(fullName),
    personal_year: calculatePersonalYear(dateOfBirth, language)
  }
}