// Check-in Questions Bank
// 10 questions × 3 categories × 5 HD types × 10 languages
// Zero API cost — all static content
// getDailyCheckinQuestions(hdType, lang) returns 3 questions (1 per category) rotating daily

const QUESTIONS = {
  en: {
    Generator: {
      mirroring: [
        "Did you feel a genuine pull toward your work today, or were you pushing through?",
        "When did your body give you a clear yes or no signal today?",
        "Were you responding to what life brought you, or forcing an outcome?",
        "How much of today was spent on things that truly light you up?",
        "Did you honor your need to rest when your energy dipped?",
        "Were you doing work that made you feel satisfied, or just busy?",
        "When did you feel most in flow today?",
        "Did you say yes to something your gut said no to?",
        "How aligned was your energy with how you spent your time?",
        "Did you wait for the right moment, or jump in too quickly?"
      ],
      gratitude: [
        "What gave you deep satisfaction today?",
        "What responded to you in a way that felt right?",
        "Name one moment where your energy felt perfectly matched to the task.",
        "What opportunity showed up today that you didn't plan?",
        "What part of your work felt effortless today?",
        "Who or what lit up your sacral energy today?",
        "What small win brought you genuine joy?",
        "What are you grateful your body told you today?",
        "Name something that felt like a true yes in your gut.",
        "What moment today reminded you why you do what you do?"
      ],
      intention: [
        "Tomorrow, what will you wait to respond to before acting?",
        "What is one thing you can say no to, so your yes means more?",
        "How will you protect your energy for what truly matters?",
        "What would it look like to trust your gut response more tomorrow?",
        "What can you let go of that's draining your life force?",
        "How will you create space for something satisfying to show up?",
        "What boundary will you set to honor your energy?",
        "Tomorrow, how will you notice when you're pushing instead of flowing?",
        "What is one way you'll prioritize satisfaction over productivity?",
        "How will you stay open to responding rather than initiating?"
      ]
    },
    'Manifesting Generator': {
      mirroring: [
        "Did you follow your excitement today, even when it seemed scattered?",
        "Were you multi-tasking from joy or from stress?",
        "Did you honor the urge to pivot when something stopped feeling right?",
        "How many of your activities today came from a genuine gut response?",
        "Did you give yourself permission to move fast without guilt?",
        "Were you skipping steps wisely, or cutting corners from impatience?",
        "Did you let yourself explore multiple interests without judgment?",
        "When did you feel your signature satisfaction today?",
        "Did you inform people before making changes, or blindside them?",
        "How well did you balance speed with presence today?"
      ],
      gratitude: [
        "What unexpected path opened up for you today?",
        "Name a moment when your speed and instinct served you perfectly.",
        "What are you grateful you had the courage to pivot toward?",
        "Which of your many interests brought you the most alive today?",
        "What efficiency or shortcut saved you energy for the good stuff?",
        "Who appreciated your energy and pace today?",
        "What felt electric and exciting in your body today?",
        "Name something you're grateful you quit or dropped.",
        "What connection between two different interests surprised you?",
        "What moment of satisfaction do you want to remember?"
      ],
      intention: [
        "Tomorrow, how will you honor your need to follow excitement?",
        "What can you inform others about before you pivot?",
        "How will you give yourself permission to be multi-passionate?",
        "What step can you skip tomorrow without sacrificing quality?",
        "How will you balance your speed with patience for others?",
        "What will you commit to responding to, not initiating?",
        "How can you channel your energy toward fewer, deeper things?",
        "Tomorrow, what will you drop if it stops feeling right?",
        "How will you communicate your changes to those affected?",
        "What would full permission to be yourself look like tomorrow?"
      ]
    },
    Manifestor: {
      mirroring: [
        "Did you inform the people around you before taking action today?",
        "Were you initiating from a place of peace, or from anger?",
        "Did you honor your need for solitude and rest?",
        "How much resistance did you encounter, and was it external or internal?",
        "Did you feel at peace with your impact today?",
        "Were you forcing doors open, or finding the ones already unlocked?",
        "Did you allow yourself to rest without guilt?",
        "How honest were you about what you truly wanted?",
        "Did you consider how your actions affected others?",
        "Were you leading from vision or from frustration?"
      ],
      gratitude: [
        "What did you successfully initiate today?",
        "Name a moment where your impact felt clean and clear.",
        "What are you grateful you had the courage to start?",
        "Who supported your vision today?",
        "What peace did you find in your independence?",
        "What creative urge did you honor today?",
        "Name a moment when informing others smoothed your path.",
        "What boundary protected your energy today?",
        "What felt powerful about being yourself today?",
        "What new thing did you set in motion?"
      ],
      intention: [
        "Tomorrow, who needs to be informed about your plans?",
        "How will you create space for your creative urges?",
        "What will you initiate that's been waiting for your energy?",
        "How will you balance independence with informing others?",
        "What rest do you need to protect your creative power?",
        "How will you respond to anger as a signal, not a weapon?",
        "What impact do you want to have tomorrow?",
        "How will you make space for the unexpected?",
        "What needs your initiating energy most right now?",
        "Tomorrow, how will you lead without bulldozing?"
      ]
    },
    Projector: {
      mirroring: [
        "Did you wait for an invitation before offering guidance today?",
        "Were you recognized for your wisdom, or did you feel invisible?",
        "How much of today did you spend managing others' energy wisely?",
        "Did you rest enough to maintain your clarity?",
        "Were you guiding, or were you trying to do the work yourself?",
        "Did you feel bitter about anything today? What does that signal?",
        "How well did you manage your limited energy today?",
        "Did you offer advice only when asked, or push it uninvited?",
        "Were you studying and mastering what interests you?",
        "How present were you in one-on-one interactions today?"
      ],
      gratitude: [
        "Who recognized and valued your insight today?",
        "What did you see clearly that others missed?",
        "Name a moment where your guidance truly landed.",
        "What system or person did you help optimize today?",
        "What are you grateful you waited for?",
        "What deep rest replenished you today?",
        "Who invited you into something meaningful?",
        "What mastery or study brought you joy today?",
        "Name a moment where less effort created more impact.",
        "What quality one-on-one connection nourished you?"
      ],
      intention: [
        "Tomorrow, where will you wait for the invitation?",
        "How will you protect your energy for what truly matters?",
        "What system or person could benefit from your insight?",
        "How will you rest before you're depleted?",
        "What will you study or master that excites you?",
        "How will you handle bitterness if it arises?",
        "Tomorrow, how will you let your recognition come to you?",
        "What one-on-one connection will you invest in?",
        "How will you guide without overextending?",
        "What invitation are you hoping for, and how can you be ready?"
      ]
    },
    Reflector: {
      mirroring: [
        "How did your environment affect your mood and energy today?",
        "Did you give yourself enough time before making decisions?",
        "Whose energy did you absorb today — and was it yours to carry?",
        "How well did you reflect the health of your community today?",
        "Did you feel surprised by anything you felt today?",
        "Were you honoring your need for a full lunar cycle on big decisions?",
        "How different did you feel compared to yesterday?",
        "Did you create enough space for solitude and reflection?",
        "Were you sampling different experiences, or getting stuck in one?",
        "How well did you protect your openness today?"
      ],
      gratitude: [
        "What environment made you feel truly good today?",
        "Name a moment of clarity that came from reflecting, not acting.",
        "What surprised and delighted you about today?",
        "Who created a safe space for you to be yourself?",
        "What did your sensitivity reveal that others missed?",
        "What lunar phase wisdom served you today?",
        "Name something beautiful you noticed that others overlooked.",
        "What community or group made you feel whole today?",
        "What change in yourself today felt interesting rather than scary?",
        "What are you grateful your openness allowed you to experience?"
      ],
      intention: [
        "Tomorrow, how will you choose your environment wisely?",
        "What big decision will you give more time before finalizing?",
        "How will you release energy that isn't yours?",
        "What community needs your mirror and reflection?",
        "How will you protect your openness without closing down?",
        "Tomorrow, what experience do you want to sample?",
        "How will you honor your need for solitude?",
        "What environment will you avoid to protect your well-being?",
        "How will you notice the difference between your feelings and others'?",
        "What is one way you'll let yourself be surprised tomorrow?"
      ]
    }
  },

  ro: {
    Generator: {
      mirroring: [
        "Ai simtit o atractie autentica spre munca ta azi, sau te-ai fortat?",
        "Cand ti-a dat corpul un semnal clar de da sau nu azi?",
        "Ai raspuns la ce ti-a adus viata, sau ai fortat un rezultat?",
        "Cat din ziua de azi ai petrecut pe lucruri care te aprind cu adevarat?",
        "Ti-ai respectat nevoia de odihna cand energia ta a scazut?",
        "Ai facut munca ce te-a facut sa te simti satisfacut, sau doar ocupat?",
        "Cand te-ai simtit cel mai in flux azi?",
        "Ai spus da la ceva la care instinctul tau a spus nu?",
        "Cat de aliniata a fost energia ta cu modul in care ti-ai petrecut timpul?",
        "Ai asteptat momentul potrivit, sau ai sarit prea repede?"
      ],
      gratitude: [
        "Ce ti-a adus satisfactie profunda azi?",
        "Ce ti-a raspuns intr-un mod care a simtit corect?",
        "Numeste un moment cand energia ta s-a potrivit perfect cu sarcina.",
        "Ce oportunitate a aparut azi pe care nu ai planificat-o?",
        "Ce parte din munca ta a fost fara efort azi?",
        "Cine sau ce ti-a aprins energia sacral azi?",
        "Ce mica victorie ti-a adus bucurie autentica?",
        "Pentru ce esti recunoscator ca ti-a spus corpul azi?",
        "Numeste ceva ce a simtit ca un da adevarat in instinctul tau.",
        "Ce moment de azi ti-a amintit de ce faci ceea ce faci?"
      ],
      intention: [
        "Maine, la ce vei astepta sa raspunzi inainte de a actiona?",
        "Care este un lucru la care poti spune nu, ca da-ul tau sa insemne mai mult?",
        "Cum iti vei proteja energia pentru ce conteaza cu adevarat?",
        "Cum ar arata sa ai mai multa incredere in raspunsul instinctiv maine?",
        "Ce poti elibera din ce iti epuizeaza forta vitala?",
        "Cum vei crea spatiu pentru ceva satisfacator sa apara?",
        "Ce limita vei pune pentru a-ti onora energia?",
        "Maine, cum vei observa cand fortezi in loc sa curga?",
        "Care e un mod in care vei prioritiza satisfactia peste productivitate?",
        "Cum vei ramane deschis sa raspunzi in loc sa initiezi?"
      ]
    },
    'Manifesting Generator': {
      mirroring: [
        "Ti-ai urmat entuziasmul azi, chiar cand parea haotic?",
        "Ai facut mai multe lucruri din bucurie sau din stres?",
        "Ai onorat impulsul de a schimba directia cand ceva nu mai simtea bine?",
        "Cate din activitatile tale de azi au venit dintr-un raspuns autentic?",
        "Ti-ai dat permisiunea sa te misti rapid fara vinovatie?",
        "Ai sarit pasi cu intelepciune, sau ai taiat colturi din nerabdare?",
        "Te-ai lasat sa explorezi interese multiple fara judecata?",
        "Cand ai simtit satisfactia ta de semnatura azi?",
        "Ai informat oamenii inainte de a face schimbari, sau i-ai luat prin surprindere?",
        "Cat de bine ai echilibrat viteza cu prezenta azi?"
      ],
      gratitude: [
        "Ce cale neasteptata s-a deschis pentru tine azi?",
        "Numeste un moment cand viteza si instinctul tau te-au servit perfect.",
        "Pentru ce esti recunoscator ca ai avut curajul sa pivotezi?",
        "Care din multiplele tale interese te-a adus cel mai in viata azi?",
        "Ce eficienta te-a ajutat sa-ti pastrezi energia pentru lucrurile bune?",
        "Cine ti-a apreciat energia si ritmul azi?",
        "Ce a simtit electric si captivant in corpul tau azi?",
        "Numeste ceva pentru care esti recunoscator ca ai renuntat.",
        "Ce conexiune intre doua interese diferite te-a surprins?",
        "Ce moment de satisfactie vrei sa tii minte?"
      ],
      intention: [
        "Maine, cum iti vei onora nevoia de a urma entuziasmul?",
        "Despre ce poti informa pe altii inainte de a pivota?",
        "Cum iti vei da permisiunea de a fi multi-pasional?",
        "Ce pas poti sari maine fara a sacrifica calitatea?",
        "Cum vei echilibra viteza ta cu rabdarea pentru altii?",
        "La ce te vei angaja sa raspunzi, nu sa initiezi?",
        "Cum poti canaliza energia spre mai putine lucruri, dar mai profunde?",
        "Maine, la ce vei renunta daca nu mai simte bine?",
        "Cum vei comunica schimbarile tale celor afectati?",
        "Cum ar arata permisiunea completa de a fi tu maine?"
      ]
    },
    Manifestor: {
      mirroring: [
        "Ai informat oamenii din jurul tau inainte de a actiona azi?",
        "Ai initiat dintr-un loc de pace, sau din furie?",
        "Ti-ai onorat nevoia de solitudine si odihna?",
        "Cata rezistenta ai intalnit, si a fost externa sau interna?",
        "Te-ai simtit in pace cu impactul tau azi?",
        "Ai fortat usi sa se deschida, sau le-ai gasit pe cele deja deschise?",
        "Ti-ai permis sa te odihnesti fara vinovatie?",
        "Cat de sincer ai fost despre ce iti doresti cu adevarat?",
        "Ai luat in considerare cum actiunile tale i-au afectat pe altii?",
        "Ai condus din viziune sau din frustrare?"
      ],
      gratitude: [
        "Ce ai initiat cu succes azi?",
        "Numeste un moment cand impactul tau a fost clar si curat.",
        "Pentru ce esti recunoscator ca ai avut curajul sa incepi?",
        "Cine ti-a sustinut viziunea azi?",
        "Ce pace ai gasit in independenta ta?",
        "Ce impuls creativ ai onorat azi?",
        "Numeste un moment cand informarea altora ti-a netezit calea.",
        "Ce limita ti-a protejat energia azi?",
        "Ce a simtit puternic in a fi tu azi?",
        "Ce lucru nou ai pus in miscare?"
      ],
      intention: [
        "Maine, cine trebuie informat despre planurile tale?",
        "Cum vei crea spatiu pentru impulsurile tale creative?",
        "Ce vei initia ce a asteptat energia ta?",
        "Cum vei echilibra independenta cu informarea altora?",
        "Ce odihna ai nevoie pentru a-ti proteja puterea creativa?",
        "Cum vei raspunde la furie ca un semnal, nu o arma?",
        "Ce impact vrei sa ai maine?",
        "Cum vei face loc pentru neasteptat?",
        "Ce are nevoie de energia ta de initiere cel mai mult acum?",
        "Maine, cum vei conduce fara a calca pe altii?"
      ]
    },
    Projector: {
      mirroring: [
        "Ai asteptat o invitatie inainte de a oferi indrumare azi?",
        "Ai fost recunoscut pentru intelepciunea ta, sau te-ai simtit invizibil?",
        "Cat din ziua de azi ai petrecut gestionand energia altora cu intelepciune?",
        "Te-ai odihnit suficient pentru a-ti mentine claritatea?",
        "Ai ghidat, sau ai incercat sa faci munca tu insuti?",
        "Te-ai simtit amarat de ceva azi? Ce semnaleaza asta?",
        "Cat de bine ti-ai gestionat energia limitata azi?",
        "Ai oferit sfaturi doar cand ai fost intrebat, sau le-ai impus?",
        "Ai studiat si perfectionat ce te intereseaza?",
        "Cat de prezent ai fost in interactiunile unu-la-unu azi?"
      ],
      gratitude: [
        "Cine ti-a recunoscut si apreciat perspectiva azi?",
        "Ce ai vazut clar pe ce altii au ratat?",
        "Numeste un moment cand ghidarea ta a rezonat cu adevarat.",
        "Ce sistem sau persoana ai ajutat sa optimizeze azi?",
        "Pentru ce esti recunoscator ca ai asteptat?",
        "Ce odihna profunda te-a regenerat azi?",
        "Cine te-a invitat in ceva semnificativ?",
        "Ce studiu sau perfectionare ti-a adus bucurie azi?",
        "Numeste un moment cand mai putin efort a creat mai mult impact.",
        "Ce conexiune unu-la-unu te-a hranit?"
      ],
      intention: [
        "Maine, unde vei astepta invitatia?",
        "Cum iti vei proteja energia pentru ce conteaza cu adevarat?",
        "Ce sistem sau persoana ar beneficia de perspectiva ta?",
        "Cum te vei odihni inainte de a fi epuizat?",
        "Ce vei studia sau perfectiona ce te entuziasmeaza?",
        "Cum vei gestiona amaraciunea daca apare?",
        "Maine, cum vei lasa recunoasterea sa vina la tine?",
        "In ce conexiune unu-la-unu vei investi?",
        "Cum vei ghida fara a te supraextinde?",
        "Ce invitatie speri sa primesti, si cum poti fi pregatit?"
      ]
    },
    Reflector: {
      mirroring: [
        "Cum ti-a afectat mediul starea si energia azi?",
        "Ti-ai acordat suficient timp inainte de a lua decizii?",
        "A cui energie ai absorbit azi — si era a ta de purtat?",
        "Cat de bine ai reflectat sanatatea comunitatii tale azi?",
        "Te-ai simtit surprins de ceva ce ai simtit azi?",
        "Ti-ai onorat nevoia unui ciclu lunar complet pentru decizii mari?",
        "Cat de diferit te-ai simtit fata de ieri?",
        "Ai creat suficient spatiu pentru solitudine si reflectie?",
        "Ai explorat experiente diferite, sau ai ramas blocat intr-una?",
        "Cat de bine ti-ai protejat deschiderea azi?"
      ],
      gratitude: [
        "Ce mediu te-a facut sa te simti cu adevarat bine azi?",
        "Numeste un moment de claritate care a venit din reflectie, nu actiune.",
        "Ce te-a surprins si incantat azi?",
        "Cine a creat un spatiu sigur pentru tine sa fii tu?",
        "Ce a dezvaluit sensibilitatea ta pe ce altii au ratat?",
        "Ce intelepciune a fazei lunare te-a servit azi?",
        "Numeste ceva frumos pe care l-ai observat dar altii nu.",
        "Ce comunitate sau grup te-a facut sa te simti complet azi?",
        "Ce schimbare in tine azi a simtit interesanta in loc de infricosatoare?",
        "Pentru ce esti recunoscator ca deschiderea ta ti-a permis sa experimentezi?"
      ],
      intention: [
        "Maine, cum iti vei alege mediul cu intelepciune?",
        "Ce decizie mare ii vei acorda mai mult timp inainte de a finaliza?",
        "Cum vei elibera energia care nu este a ta?",
        "Ce comunitate are nevoie de oglinda si reflectia ta?",
        "Cum iti vei proteja deschiderea fara a te inchide?",
        "Maine, ce experienta vrei sa explorezi?",
        "Cum iti vei onora nevoia de solitudine?",
        "Ce mediu vei evita pentru a-ti proteja bunastarea?",
        "Cum vei observa diferenta dintre sentimentele tale si ale altora?",
        "Care e un mod prin care te vei lasa surprins maine?"
      ]
    }
  },

}

// Translated labels for categories
const CATEGORY_LABELS = {
  en: { mirroring: 'mirroring', gratitude: 'gratitude', intention: 'intention' },
  ro: { mirroring: 'oglindire', gratitude: 'recunoștință', intention: 'intenție' },
  es: { mirroring: 'reflejo', gratitude: 'gratitud', intention: 'intención' },
  fr: { mirroring: 'miroir', gratitude: 'gratitude', intention: 'intention' },
  de: { mirroring: 'Spiegelung', gratitude: 'Dankbarkeit', intention: 'Absicht' },
  it: { mirroring: 'specchio', gratitude: 'gratitudine', intention: 'intenzione' },
  pt: { mirroring: 'espelho', gratitude: 'gratidão', intention: 'intenção' },
  nl: { mirroring: 'spiegel', gratitude: 'dankbaarheid', intention: 'intentie' },
  pl: { mirroring: 'lustro', gratitude: 'wdzięczność', intention: 'intencja' },
  hu: { mirroring: 'tükör', gratitude: 'hála', intention: 'szándék' }
}

/**
 * Get 3 daily check-in questions (1 per category), rotating by day of year
 * @param {string} hdType - Human Design type
 * @param {string} lang - Language code
 * @returns {Array<{id: string, category: string, question: string}>}
 */
export function getDailyCheckinQuestions(hdType, lang = 'en') {
  // Use EN questions for all languages (questions are reflective/personal, EN works as base)
  // Category labels are translated for UI display
  const langData = QUESTIONS[lang] || QUESTIONS.en
  const typeData = langData[hdType] || langData['Generator']
  
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  )
  
  const categories = ['mirroring', 'gratitude', 'intention']
  
  return categories.map((cat, i) => {
    const pool = typeData[cat]
    const index = (dayOfYear + i) % pool.length
    return {
      id: `${cat}-${index}`,
      category: cat,
      question: pool[index]
    }
  })
}
