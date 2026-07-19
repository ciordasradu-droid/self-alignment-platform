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
    en: { theme:'New Beginnings', focus:'Plant seeds for what you want to create. This is a year of starting, not finishing.', warning:'What no longer serves you can hold you in place if you cling to it — this year makes room for what is new.' },
    ro: { theme:'Începuturi Noi', focus:'Plantează semințe pentru ceea ce vrei să creezi. Acesta este un an de început, nu de finalizare.', warning:'Ce nu te mai servește te poate ține pe loc dacă te agăți de el — anul acesta face loc pentru ce e nou.' },
    es: { theme:'Nuevos Comienzos', focus:'Planta semillas para lo que quieres crear. Este es un año de comienzos, no de finales.', warning:'Lo que ya no te sirve puede retenerte si te aferras a ello — este año hace espacio para lo nuevo.' },
    fr: { theme:'Nouveaux Débuts', focus:'Plante des graines pour ce que tu veux créer. C\'est une année de commencements, pas de fins.', warning:'Ce qui ne te sert plus peut te retenir si tu t\'y accroches — cette année fait de la place pour ce qui est nouveau.' },
    de: { theme:'Neue Anfänge', focus:'Pflanze Samen für das, was du erschaffen möchtest. Dies ist ein Jahr des Beginns, nicht des Abschlusses.', warning:'Was dir nicht mehr dient, kann dich festhalten, wenn du daran festhältst — dieses Jahr schafft Platz für das Neue.' },
    it: { theme:'Nuovi Inizi', focus:'Pianta semi per ciò che vuoi creare. Questo è un anno di inizi, non di conclusioni.', warning:'Ciò che non ti serve più può trattenerti se ti aggrappi ad esso — quest\'anno fa spazio per ciò che è nuovo.' },
    pt: { theme:'Novos Começos', focus:'Plante sementes para o que você quer criar. Este é um ano de começar, não de terminar.', warning:'O que já não te serve pode prender-te se te agarrares a isso — este ano abre espaço para o que é novo.' },
    nl: { theme:'Nieuwe Beginnen', focus:'Plant zaden voor wat je wilt creëren. Dit is een jaar van beginnen, niet van eindigen.', warning:'Wat je niet meer dient kan je vasthouden als je eraan vasthoudt — dit jaar maakt ruimte voor wat nieuw is.' },
    pl: { theme:'Nowe Początki', focus:'Sadź nasiona dla tego, co chcesz stworzyć. To rok rozpoczynania, nie kończenia.', warning:'To, co już ci nie służy, może cię zatrzymać, jeśli się tego trzymasz — ten rok robi miejsce na to, co nowe.' },
    hu: { theme:'Új Kezdetek', focus:'Ültesd el a magokat ahhoz, amit létre szeretnél hozni. Ez egy kezdés éve, nem befejezésé.', warning:'Ami már nem szolgál téged, fogva tarthat, ha ragaszkodsz hozzá — ez az év helyet csinál az újnak.' }
  },
  2: {
    en: { theme:'Patience & Partnership', focus:'Nurture relationships and allow things to develop. Cooperation over competition.', warning:'Forced outcomes don\'t ripen any faster — things are growing beneath the surface right now.' },
    ro: { theme:'Răbdare și Parteneriat', focus:'Hrănește relațiile și lasă lucrurile să se dezvolte. Cooperare înaintea competiției.', warning:'Rezultatele forțate nu se coc mai repede — lucrurile cresc acum sub suprafață.' },
    es: { theme:'Paciencia y Asociación', focus:'Nutre las relaciones y permite que las cosas se desarrollen. Cooperación sobre competencia.', warning:'Los resultados forzados no maduran más rápido — las cosas están creciendo bajo la superficie ahora mismo.' },
    fr: { theme:'Patience et Partenariat', focus:'Nourris les relations et laisse les choses se développer. Coopération plutôt que compétition.', warning:'Les résultats forcés ne mûrissent pas plus vite — les choses grandissent sous la surface en ce moment.' },
    de: { theme:'Geduld und Partnerschaft', focus:'Pflege Beziehungen und lass Dinge sich entwickeln. Kooperation über Wettbewerb.', warning:'Erzwungene Ergebnisse reifen nicht schneller — die Dinge wachsen gerade jetzt unter der Oberfläche.' },
    it: { theme:'Pazienza e Partnership', focus:'Nutri le relazioni e lascia che le cose si sviluppino. Cooperazione sulla competizione.', warning:'I risultati forzati non maturano più in fretta — le cose stanno crescendo sotto la superficie proprio ora.' },
    pt: { theme:'Paciência e Parceria', focus:'Nutra relacionamentos e permita que as coisas se desenvolvam. Cooperação sobre competição.', warning:'Resultados forçados não amadurecem mais depressa — as coisas estão a crescer sob a superfície agora mesmo.' },
    nl: { theme:'Geduld en Partnerschap', focus:'Koester relaties en laat dingen zich ontwikkelen. Samenwerking boven competitie.', warning:'Geforceerde resultaten rijpen niet sneller — dingen groeien nu onder het oppervlak.' },
    pl: { theme:'Cierpliwość i Partnerstwo', focus:'Pielęgnuj relacje i pozwól rzeczom się rozwijać. Współpraca ponad konkurencją.', warning:'Wymuszone rezultaty nie dojrzewają szybciej — rzeczy rosną teraz pod powierzchnią.' },
    hu: { theme:'Türelem és Partnerség', focus:'Ápold a kapcsolatokat és hagyd, hogy a dolgok fejlődjenek. Együttműködés a versengés felett.', warning:'Az erőltetett eredmények nem érnek be gyorsabban — a dolgok most a felszín alatt növekednek.' }
  },
  3: {
    en: { theme:'Expression & Growth', focus:'Share your voice, create, and expand socially. Joy is your compass this year.', warning:'Energy scattered across too many directions loses its force.' },
    ro: { theme:'Exprimare și Creștere', focus:'Împărtășește-ți vocea, creează și extinde-te social. Bucuria este busola ta în acest an.', warning:'Energia împrăștiată în prea multe direcții își pierde din forță.' },
    es: { theme:'Expresión y Crecimiento', focus:'Comparte tu voz, crea y expándete socialmente. La alegría es tu brújula este año.', warning:'La energía dispersada en demasiadas direcciones pierde su fuerza.' },
    fr: { theme:'Expression et Croissance', focus:'Partage ta voix, crée et développe-toi socialement. La joie est ton boussole cette année.', warning:'L\'énergie dispersée dans trop de directions perd sa force.' },
    de: { theme:'Ausdruck und Wachstum', focus:'Teile deine Stimme, erschaffe und expandiere sozial. Freude ist dein Kompass dieses Jahr.', warning:'Energie, die auf zu viele Richtungen verteilt wird, verliert ihre Kraft.' },
    it: { theme:'Espressione e Crescita', focus:'Condividi la tua voce, crea ed espanditi socialmente. La gioia è la tua bussola quest\'anno.', warning:'L\'energia dispersa in troppe direzioni perde la sua forza.' },
    pt: { theme:'Expressão e Crescimento', focus:'Compartilhe sua voz, crie e expanda socialmente. A alegria é sua bússola este ano.', warning:'Energia dispersa em demasiadas direções perde a sua força.' },
    nl: { theme:'Expressie en Groei', focus:'Deel je stem, creëer en breid sociaal uit. Vreugde is je kompas dit jaar.', warning:'Energie verspreid over te veel richtingen verliest zijn kracht.' },
    pl: { theme:'Ekspresja i Wzrost', focus:'Dziel się swoim głosem, twórz i rozwijaj się społecznie. Radość jest twoim kompasem w tym roku.', warning:'Energia rozproszona w zbyt wielu kierunkach traci swoją siłę.' },
    hu: { theme:'Kifejezés és Növekedés', focus:'Oszd meg a hangodat, alkoss és terjeszkedj társadalmilag. Az öröm az iránytűd ebben az évben.', warning:'A túl sok irányba szétszórt energia elveszti erejét.' }
  },
  4: {
    en: { theme:'Structure & Foundation', focus:'Build systems, establish routines, do the disciplined work. Slow and steady wins.', warning:'Shortcuts cost more later — what you build now determines your next 4 years.' },
    ro: { theme:'Structură și Fundație', focus:'Construiește sisteme, stabilește rutine, fă munca disciplinată. Lent și constant câștigă.', warning:'Scurtăturile se plătesc mai târziu — ceea ce construiești acum determină următorii 4 ani.' },
    es: { theme:'Estructura y Fundación', focus:'Construye sistemas, establece rutinas, haz el trabajo disciplinado. Lento y constante gana.', warning:'Los atajos cuestan más después — lo que construyes ahora determina tus próximos 4 años.' },
    fr: { theme:'Structure et Fondation', focus:'Construis des systèmes, établis des routines, fais le travail discipliné. Lent et régulier gagne.', warning:'Les raccourcis coûtent plus cher plus tard — ce que tu construis maintenant détermine tes 4 prochaines années.' },
    de: { theme:'Struktur und Fundament', focus:'Baue Systeme auf, etabliere Routinen, tue die disziplinierte Arbeit. Langsam und stetig gewinnt.', warning:'Abkürzungen kosten später mehr — was du jetzt baust, bestimmt deine nächsten 4 Jahre.' },
    it: { theme:'Struttura e Fondazione', focus:'Costruisci sistemi, stabilisci routine, fai il lavoro disciplinato. Lento e costante vince.', warning:'Le scorciatoie costano di più dopo — ciò che costruisci ora determina i tuoi prossimi 4 anni.' },
    pt: { theme:'Estrutura e Fundação', focus:'Construa sistemas, estabeleça rotinas, faça o trabalho disciplinado. Devagar e sempre ganha.', warning:'Atalhos custam mais tarde — o que constróis agora determina os teus próximos 4 anos.' },
    nl: { theme:'Structuur en Fundament', focus:'Bouw systemen, vestig routines, doe het gedisciplineerde werk. Langzaam en gestaag wint.', warning:'Snelle wegen kosten later meer — wat je nu bouwt bepaalt je volgende 4 jaar.' },
    pl: { theme:'Struktura i Fundament', focus:'Buduj systemy, ustanawiaj rutyny, wykonuj zdyscyplinowaną pracę. Powoli i wytrwale wygrywa.', warning:'Skróty kosztują więcej później — to, co budujesz teraz, determinuje twoje następne 4 lata.' },
    hu: { theme:'Struktúra és Alap', focus:'Építs rendszereket, alakíts ki rutinokat, végezd a fegyelmezett munkát. A lassú és kitartó nyer.', warning:'A rövidítések később többe kerülnek — amit most építesz, az határozza meg a következő 4 évedet.' }
  },
  5: {
    en: { theme:'Change & Freedom', focus:'Embrace change, explore new directions, and release rigid structures.', warning:'Impulsive decisions and overindulgence can derail this freedom — it needs a direction.' },
    ro: { theme:'Schimbare și Libertate', focus:'Îmbrățișează schimbarea, explorează noi direcții și eliberează structurile rigide.', warning:'Deciziile impulsive și excesele pot deraia libertatea asta — ea are nevoie de o direcție.' },
    es: { theme:'Cambio y Libertad', focus:'Abraza el cambio, explora nuevas direcciones y libera las estructuras rígidas.', warning:'Las decisiones impulsivas y los excesos pueden descarrilar esta libertad — necesita una dirección.' },
    fr: { theme:'Changement et Liberté', focus:'Embrasse le changement, explore de nouvelles directions et libère les structures rigides.', warning:'Les décisions impulsives et les excès peuvent dérailler cette liberté — elle a besoin d\'une direction.' },
    de: { theme:'Wandel und Freiheit', focus:'Umarme den Wandel, erkunde neue Richtungen und löse starre Strukturen.', warning:'Impulsive Entscheidungen und Ausschweifungen können diese Freiheit entgleisen lassen — sie braucht eine Richtung.' },
    it: { theme:'Cambiamento e Libertà', focus:'Abbraccia il cambiamento, esplora nuove direzioni e libera le strutture rigide.', warning:'Le decisioni impulsive e gli eccessi possono far deragliare questa libertà — ha bisogno di una direzione.' },
    pt: { theme:'Mudança e Liberdade', focus:'Abrace a mudança, explore novas direções e libere estruturas rígidas.', warning:'Decisões impulsivas e excessos podem descarrilar esta liberdade — ela precisa de uma direção.' },
    nl: { theme:'Verandering en Vrijheid', focus:'Omarm verandering, verken nieuwe richtingen en laat rigide structuren los.', warning:'Impulsieve beslissingen en overdaad kunnen deze vrijheid doen ontsporen — ze heeft een richting nodig.' },
    pl: { theme:'Zmiana i Wolność', focus:'Przyjmij zmianę, eksploruj nowe kierunki i uwolnij sztywne struktury.', warning:'Impulsywne decyzje i przesada mogą wykoleić tę wolność — potrzebuje ona kierunku.' },
    hu: { theme:'Változás és Szabadság', focus:'Fogadd el a változást, fedezz fel új irányokat és engedd el a merev struktúrákat.', warning:'Az impulzív döntések és a mértéktelenség kisiklathatják ezt a szabadságot — iránymutatásra van szüksége.' }
  },
  6: {
    en: { theme:'Responsibility & Harmony', focus:'Tend to home, family, and close relationships. Service and love lead the way.', warning:'Overgiving at the expense of your own needs empties you rather than fulfilling you.' },
    ro: { theme:'Responsabilitate și Armonie', focus:'Îngrijește-te de casă, familie și relații apropiate. Serviciul și dragostea conduc calea.', warning:'Prea multă dăruire în detrimentul propriilor nevoi te golește, nu te împlinește.' },
    es: { theme:'Responsabilidad y Armonía', focus:'Cuida el hogar, la familia y las relaciones cercanas. El servicio y el amor lideran el camino.', warning:'Dar demasiado a expensas de tus propias necesidades te vacía en vez de llenarte.' },
    fr: { theme:'Responsabilité et Harmonie', focus:'Prends soin du foyer, de la famille et des relations proches. Le service et l\'amour ouvrent la voie.', warning:'Trop donner au détriment de tes propres besoins te vide au lieu de te combler.' },
    de: { theme:'Verantwortung und Harmonie', focus:'Kümmere dich um Zuhause, Familie und enge Beziehungen. Dienst und Liebe weisen den Weg.', warning:'Zu viel geben auf Kosten deiner eigenen Bedürfnisse leert dich, statt dich zu erfüllen.' },
    it: { theme:'Responsabilità e Armonia', focus:'Prenditi cura della casa, della famiglia e delle relazioni strette. Il servizio e l\'amore guidano la via.', warning:'Dare troppo a scapito dei tuoi bisogni ti svuota invece di appagarti.' },
    pt: { theme:'Responsabilidade e Harmonia', focus:'Cuide do lar, família e relacionamentos próximos. O serviço e o amor lideram o caminho.', warning:'Dar demais à custa das tuas próprias necessidades esvazia-te em vez de te preencher.' },
    nl: { theme:'Verantwoordelijkheid en Harmonie', focus:'Zorg voor thuis, familie en nauwe relaties. Dienst en liefde leiden de weg.', warning:'Te veel geven ten koste van je eigen behoeften maakt je leeg in plaats van vervuld.' },
    pl: { theme:'Odpowiedzialność i Harmonia', focus:'Dbaj o dom, rodzinę i bliskie relacje. Służba i miłość prowadzą drogę.', warning:'Nadmierne dawanie kosztem własnych potrzeb opróżnia cię, zamiast spełniać.' },
    hu: { theme:'Felelősség és Harmónia', focus:'Törődj az otthonnal, a családdal és a közeli kapcsolatokkal. A szolgálat és a szeretet vezeti az utat.', warning:'A saját szükségleteid rovására való túlzott adás kiürít, nem tölt fel.' }
  },
  7: {
    en: { theme:'Reflection & Mastery', focus:'Go inward. Study, reflect, and deepen your understanding of yourself.', warning:'Isolation and overthinking aren\'t rest — rest is not the same as retreat.' },
    ro: { theme:'Reflecție și Măiestrie', focus:'Mergi spre interior. Studiază, reflectează și aprofundează înțelegerea de sine.', warning:'Izolarea și gândirea excesivă nu sunt odihnă — odihna nu e același lucru cu retragerea.' },
    es: { theme:'Reflexión y Maestría', focus:'Ve hacia adentro. Estudia, reflexiona y profundiza tu comprensión de ti mismo.', warning:'El aislamiento y pensar en exceso no son descanso — descansar no es lo mismo que retirarse.' },
    fr: { theme:'Réflexion et Maîtrise', focus:'Va vers l\'intérieur. Étudie, réfléchis et approfondi ta compréhension de toi-même.', warning:'L\'isolement et la surréflexion ne sont pas du repos — se reposer n\'est pas la même chose que se retirer.' },
    de: { theme:'Reflexion und Meisterschaft', focus:'Geh nach innen. Studiere, reflektiere und vertiefe dein Selbstverständnis.', warning:'Isolation und Überdenken sind keine Ruhe — Ruhe ist nicht dasselbe wie Rückzug.' },
    it: { theme:'Riflessione e Maestria', focus:'Vai verso l\'interno. Studia, rifletti e approfondisci la tua comprensione di te stesso.', warning:'L\'isolamento e il pensiero eccessivo non sono riposo — riposarsi non è lo stesso che ritirarsi.' },
    pt: { theme:'Reflexão e Maestria', focus:'Vá para dentro. Estude, reflita e aprofunde sua compreensão de si mesmo.', warning:'Isolamento e pensamento excessivo não são descanso — descansar não é o mesmo que retirar-se.' },
    nl: { theme:'Reflectie en Meesterschap', focus:'Ga naar binnen. Studeer, reflecteer en verdiep je zelfbegrip.', warning:'Isolatie en overdenken zijn geen rust — rusten is niet hetzelfde als terugtrekken.' },
    pl: { theme:'Refleksja i Mistrzostwo', focus:'Idź do wewnątrz. Ucz się, reflektuj i pogłębiaj swoją samoświadomość.', warning:'Izolacja i nadmierne myślenie to nie odpoczynek — odpoczynek to nie to samo co wycofanie.' },
    hu: { theme:'Reflexió és Mesterség', focus:'Menj befelé. Tanulmányozz, reflektálj és mélyítsd az önmegismerésedet.', warning:'Az elszigetelődés és a túlgondolkodás nem pihenés — a pihenés nem ugyanaz, mint a visszavonulás.' }
  },
  8: {
    en: { theme:'Power & Achievement', focus:'Step into your authority. This is a year of ambition, results, and material growth.', warning:'Achievement paid for with your close relationships isn\'t a full win.' },
    ro: { theme:'Putere și Realizare', focus:'Intră în autoritatea ta. Acesta este un an de ambiție, rezultate și creștere materială.', warning:'Realizările plătite cu relațiile tale apropiate nu sunt o victorie completă.' },
    es: { theme:'Poder y Logros', focus:'Entra en tu autoridad. Este es un año de ambición, resultados y crecimiento material.', warning:'Un logro pagado con tus relaciones cercanas no es una victoria completa.' },
    fr: { theme:'Pouvoir et Réussite', focus:'Entre dans ton autorité. C\'est une année d\'ambition, de résultats et de croissance matérielle.', warning:'Une réussite payée avec tes relations proches n\'est pas une victoire complète.' },
    de: { theme:'Macht und Leistung', focus:'Tritt in deine Autorität. Dies ist ein Jahr des Ehrgeizes, der Ergebnisse und des materiellen Wachstums.', warning:'Ein Erfolg, der mit deinen engen Beziehungen bezahlt wird, ist kein vollständiger Sieg.' },
    it: { theme:'Potere e Realizzazione', focus:'Entra nella tua autorità. Questo è un anno di ambizione, risultati e crescita materiale.', warning:'Un successo pagato con le tue relazioni strette non è una vittoria completa.' },
    pt: { theme:'Poder e Realização', focus:'Entre na sua autoridade. Este é um ano de ambição, resultados e crescimento material.', warning:'Uma conquista paga com as tuas relações próximas não é uma vitória completa.' },
    nl: { theme:'Macht en Prestatie', focus:'Stap in je autoriteit. Dit is een jaar van ambitie, resultaten en materiële groei.', warning:'Een prestatie betaald met je hechte relaties is geen volledige overwinning.' },
    pl: { theme:'Władza i Osiągnięcia', focus:'Wejdź w swoją władzę. To rok ambicji, wyników i materialnego wzrostu.', warning:'Osiągnięcie opłacone bliskimi relacjami nie jest pełnym zwycięstwem.' },
    hu: { theme:'Hatalom és Teljesítmény', focus:'Lépj be az autoritásodba. Ez az ambíció, az eredmények és az anyagi növekedés éve.', warning:'Egy siker, amit a közeli kapcsolataiddal fizetsz meg, nem teljes győzelem.' }
  },
  9: {
    en: { theme:'Completion & Release', focus:'Let go of what no longer fits. Forgive, release, and prepare for a new cycle.', warning:'Big new projects can wait — this year calls for finishing what is already in motion.' },
    ro: { theme:'Finalizare și Eliberare', focus:'Lasă să plece ceea ce nu se mai potrivește. Iartă, eliberează și pregătește-te pentru un nou ciclu.', warning:'Proiectele mari noi pot aștepta — anul acesta cere finalizarea a ceea ce e deja în lucru.' },
    es: { theme:'Finalización y Liberación', focus:'Suelta lo que ya no encaja. Perdona, libera y prepárate para un nuevo ciclo.', warning:'Los grandes proyectos nuevos pueden esperar — este año pide terminar lo que ya está en marcha.' },
    fr: { theme:'Complétion et Libération', focus:'Laisse partir ce qui ne s\'adapte plus. Pardonne, libère et prépare-toi pour un nouveau cycle.', warning:'Les grands nouveaux projets peuvent attendre — cette année appelle à terminer ce qui est déjà en cours.' },
    de: { theme:'Vollendung und Loslassen', focus:'Lass los, was nicht mehr passt. Vergib, lass los und bereite dich auf einen neuen Zyklus vor.', warning:'Große neue Projekte können warten — dieses Jahr ruft danach, zu vollenden, was bereits in Gang ist.' },
    it: { theme:'Completamento e Liberazione', focus:'Lascia andare ciò che non si adatta più. Perdona, libera e preparati per un nuovo ciclo.', warning:'I grandi nuovi progetti possono aspettare — quest\'anno chiede di finire ciò che è già in corso.' },
    pt: { theme:'Conclusão e Liberação', focus:'Deixe ir o que não se encaixa mais. Perdoe, libere e prepare-se para um novo ciclo.', warning:'Grandes projetos novos podem esperar — este ano pede para terminar o que já está em curso.' },
    nl: { theme:'Voltooiing en Loslating', focus:'Laat los wat niet meer past. Vergeef, laat los en bereid je voor op een nieuwe cyclus.', warning:'Grote nieuwe projecten kunnen wachten — dit jaar vraagt om af te maken wat al in gang is.' },
    pl: { theme:'Zakończenie i Uwolnienie', focus:'Puść to, co już nie pasuje. Wybacz, uwolnij i przygotuj się na nowy cykl.', warning:'Duże nowe projekty mogą poczekać — ten rok wzywa do dokończenia tego, co już jest w toku.' },
    hu: { theme:'Befejezés és Elengedés', focus:'Engedd el azt, ami már nem illik. Bocsáss meg, engedj el és készülj fel egy új ciklusra.', warning:'A nagy új projektek várhatnak — ez az év azt kéri, hogy fejezd be, ami már folyamatban van.' }
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

// Ziua/luna personală — reduc pe același principiu ca anul personal (secț.
// 5, Gândul Zilei): anul personal + luna curentă → luna personală; luna
// personală + ziua curentă → ziua personală. Doar cifre, folosite ca temei
// pentru generare — nu se afișează niciodată ca "numerologie" pe ecran.
function reduceToDigit(n) {
  let x = n
  while (x > 9) x = String(x).split('').map(Number).reduce((a, b) => a + b, 0)
  return x
}
export function calculatePersonalDayMonth(dateOfBirth, language = 'en') {
  const personalYear = calculatePersonalYear(dateOfBirth, language).personal_year
  const now = new Date()
  const personalMonth = reduceToDigit(personalYear + (now.getMonth() + 1))
  const personalDay = reduceToDigit(personalMonth + now.getDate())
  return { personal_month: personalMonth, personal_day: personalDay }
}

export function calculateNumerology(fullName, dateOfBirth, language = 'en') {
  return {
    life_path: calculateLifePath(dateOfBirth),
    expression: calculateExpressionNumber(fullName),
    soul_urge: calculateSoulUrge(fullName),
    personality: calculatePersonalityNumber(fullName),
    personal_year: calculatePersonalYear(dateOfBirth, language),
    ...calculatePersonalDayMonth(dateOfBirth, language)
  }
}