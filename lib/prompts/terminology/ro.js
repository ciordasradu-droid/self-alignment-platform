// lib/prompts/terminology/ro.js

export const hdTerms = {
  // Type translations
  types: {
    'Generator': 'Generator',
    'Manifesting Generator': 'Generator Manifestant',
    'Manifestor': 'Manifestor',
    'Projector': 'Proiector',
    'Reflector': 'Reflector',
  },
  // Strategy translations
  strategies: {
    'Wait to respond': 'Așteaptă și răspunde',
    'Wait to respond then inform': 'Așteaptă, răspunde, apoi informează',
    'Inform before acting': 'Informează înainte să acționezi',
    'Wait for the invitation': 'Așteaptă invitația',
    'Wait a lunar cycle': 'Așteaptă un ciclu lunar',
  },
  // Authority translations
  authorities: {
    'Emotional': 'Autoritate Emoțională',
    'Sacral': 'Autoritate Sacrală',
    'Splenic': 'Autoritate Splenică',
    'Ego / Heart': 'Autoritate Ego / Inimă',
    'Self-Projected': 'Autoritate Auto-Proiectată',
    'Mental': 'Autoritate Mentală',
    'Lunar': 'Autoritate Lunară',
  },
  // Center translations
  centers: {
    'Head': 'Centrul Capului',
    'Ajna': 'Centrul Ajna',
    'Throat': 'Centrul Gâtului',
    'G': 'Centrul G (Identitate)',
    'Heart': 'Centrul Inimii',
    'Solar Plexus': 'Plexul Solar',
    'Sacral': 'Centrul Sacral',
    'Spleen': 'Splina',
    'Root': 'Centrul Rădăcinii',
  },
  // Other terms
  misc: {
    'Gates': 'Porți',
    'Channels': 'Canale',
    'Profile': 'Profil',
    'Incarnation Cross': 'Cruce de Încarnare',
    'Defined': 'Definit',
    'Undefined': 'Nedefinit',
    'Right Angle Cross': 'Cruce în Unghi Drept',
    'Left Angle Cross': 'Cruce în Unghi Stâng',
    'Juxtaposition Cross': 'Cruce de Juxtapunere',
  },
}

export const astroTerms = {
  'Sun sign': 'Semn Solar',
  'Moon sign': 'Semn Lunar',
  'Rising': 'Ascendent',
  'Ascendant': 'Ascendent',
  'Planetary ruler': 'Planetă Conducătoare',
  'Cardinal': 'Cardinal',
  'Fixed': 'Fix',
  'Mutable': 'Mutabil',
  'Fire': 'Foc',
  'Earth': 'Pământ',
  'Air': 'Aer',
  'Water': 'Apă',
}

export const numerologyTerms = {
  'Life Path': 'Calea Vieții',
  'Expression Number': 'Numărul Expresiei',
  'Soul Urge': 'Dorința Sufletului',
  'Personal Year': 'Anul Personal',
  'Personal Month': 'Luna Personală',
  'Personality Number': 'Numărul Personalității',
}

export const grammarRules = `
REGULI GRAMATICALE OBLIGATORII PENTRU ROMÂNĂ:
1. Folosește diacritice complete: ă, â, î, ș, ț — fără excepții.
2. Acord gramatical strict: gen (masculin/feminin), număr (singular/plural), persoană. Verifică fiecare adjectiv, participiu, pronume.
3. Nu se cunoaște genul utilizatorului — folosește EXCLUSIV formulări neutre de gen. Evită construcții de tipul "ești pregătit/ă". Reformulează: "ai pregătirea necesară", "te afli în...", "există în tine...".
4. Persoana a II-a singular ("tu") consistent pe tot profilul. Nu alterna cu forme impersonale sau persoana a III-a.
5. Zero cuvinte din engleză, spaniolă sau altă limbă în text. Dacă un termen tehnic apare în datele de intrare în engleză, traducere obligatorie înainte de utilizare.
6. Propoziții complete cu subiect, predicat și sens finalizat. Fără trunchieri.
7. Evită neologisme stâlcite. Dacă nu ești sigur de un cuvânt, folosește o formulare mai simplă și corectă în română.
8. Construcții naturale în română — nu traduce literal din engleză. "Wait to respond" NU devine "așteaptă să răspunzi" ci "lasă lucrurile să vină spre tine și răspunde la ce te atrage".
`

export const headerBoxExplanations = {
  type: {
    label: 'Tip',
    subtitles: {
      'Generator': 'Energie susținută — prosperezi răspunzând la ce te atrage.',
      'Manifesting Generator': 'Energie multiplă — te miști repede și ai nevoie de varietate.',
      'Manifestor': 'Inițiator independent — pornești lucruri și informezi pe ceilalți.',
      'Projector': 'Ghid și consilier — ai nevoie de recunoaștere și invitație.',
      'Reflector': 'Oglinda comunității — sensibil la mediu, decizii lente și înțelepte.',
    }
  },
  profile: {
    label: 'Profil',
    subtitle: 'Combinația de linii care descrie rolul tău în lume și modul în care înveți.',
  },
  strategy: {
    label: 'Strategie',
    subtitles: {
      'Wait to respond': 'Nu inițiezi — răspunzi la ce îți apare în față.',
      'Wait to respond then inform': 'Răspunzi la ce te atrage, apoi îi informezi pe ceilalți.',
      'Inform before acting': 'Înainte să pornești ceva, spune-le celor din jur ce urmează.',
      'Wait for the invitation': 'Nu te împingi în față — așteaptă să fii invitat.',
      'Wait a lunar cycle': 'Înainte de decizii mari, lasă o lună întreagă să treacă.',
    }
  },
  authority: {
    label: 'Autoritate',
    subtitles: {
      'Emotional': 'Claritatea ta vine în timp — nu decide în vârful emoției.',
      'Sacral': 'Corpul tău știe — ascultă răspunsul visceral, nu mintea.',
      'Splenic': 'Intuiție instantanee — prima impresie este de obicei corectă.',
      'Ego / Heart': 'Decizi din voință și valori — ce vrei cu adevărat să faci?',
      'Self-Projected': 'Claritatea vine când vorbești tare cu oameni de încredere.',
      'Mental': 'Procesezi prin conversație și observarea mediului.',
      'Lunar': 'Ai nevoie de un ciclu lunar complet pentru decizii importante.',
    }
  },
}