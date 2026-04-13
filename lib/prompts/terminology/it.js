// lib/prompts/terminology/it.js

export const hdTerms = {
  types: {
    'Generator': 'Generatore',
    'Manifesting Generator': 'Generatore Manifestante',
    'Manifestor': 'Manifestore',
    'Projector': 'Proiettore',
    'Reflector': 'Riflettore',
  },
  strategies: {
    'Wait to respond': 'Aspettare e rispondere',
    'Wait to respond then inform': 'Aspettare, rispondere e informare',
    'Inform before acting': 'Informare prima di agire',
    'Wait for the invitation': 'Aspettare l\'invito',
    'Wait a lunar cycle': 'Aspettare un ciclo lunare',
  },
  authorities: {
    'Emotional': 'Autorità Emotiva',
    'Sacral': 'Autorità Sacrale',
    'Splenic': 'Autorità Splenica',
    'Ego / Heart': 'Autorità dell\'Ego / Cuore',
    'Self-Projected': 'Autorità Auto-proiettata',
    'Mental': 'Autorità Mentale',
    'Lunar': 'Autorità Lunare',
  },
  centers: {
    'Head': 'Centro della Testa',
    'Ajna': 'Centro Ajna',
    'Throat': 'Centro della Gola',
    'G': 'Centro G (Identità)',
    'Heart': 'Centro del Cuore',
    'Solar Plexus': 'Plesso Solare',
    'Sacral': 'Centro Sacrale',
    'Spleen': 'Centro della Milza',
    'Root': 'Centro Radice',
  },
  misc: {
    'Gates': 'Porte',
    'Channels': 'Canali',
    'Profile': 'Profilo',
    'Incarnation Cross': 'Croce d\'Incarnazione',
    'Defined': 'Definito',
    'Undefined': 'Indefinito',
    'Right Angle Cross': 'Croce ad Angolo Retto',
    'Left Angle Cross': 'Croce ad Angolo Sinistro',
    'Juxtaposition Cross': 'Croce di Giustapposizione',
  },
}

export const astroTerms = {
  'Sun sign': 'Segno Solare',
  'Moon sign': 'Segno Lunare',
  'Rising': 'Ascendente',
  'Ascendant': 'Ascendente',
  'Planetary ruler': 'Pianeta Dominante',
  'Cardinal': 'Cardinale',
  'Fixed': 'Fisso',
  'Mutable': 'Mutevole',
  'Fire': 'Fuoco',
  'Earth': 'Terra',
  'Air': 'Aria',
  'Water': 'Acqua',
}

export const numerologyTerms = {
  'Life Path': 'Sentiero di Vita',
  'Expression Number': 'Numero dell\'Espressione',
  'Soul Urge': 'Desiderio dell\'Anima',
  'Personal Year': 'Anno Personale',
  'Personal Month': 'Mese Personale',
  'Personality Number': 'Numero della Personalità',
}

export const grammarRules = `
REGOLE GRAMMATICALI OBBLIGATORIE PER L'ITALIANO:
1. Usa la seconda persona singolare ("tu") in modo coerente. Non alternare con la terza persona o il "Lei" formale.
2. Accordo rigoroso di genere e numero per aggettivi, participi e pronomi.
3. Il genere dell'utente è sconosciuto — usa formulazioni neutre o riformula per evitare marche di genere.
4. Zero parole in inglese o in altre lingue nel testo. Se un termine tecnico arriva in inglese nei dati, traducilo prima di usarlo.
5. Frasi complete con soggetto e predicato. Nessun frammento.
6. Italiano naturale — non tradurre letteralmente dall'inglese. Riformula in modo che suoni fluido.
`

export const headerBoxExplanations = {
  type: {
    label: 'Tipo',
    subtitles: {
      'Generator': 'Energia sostenuta — prosperi rispondendo a ciò che ti attrae.',
      'Manifesting Generator': 'Energia multipla — ti muovi veloce e hai bisogno di varietà.',
      'Manifestor': 'Iniziatore indipendente — avvii cose e tieni informati gli altri.',
      'Projector': 'Guida e consigliere — hai bisogno di riconoscimento e invito.',
      'Reflector': 'Specchio comunitario — sensibile all\'ambiente, decisioni lente e sagge.',
    }
  },
  profile: {
    label: 'Profilo',
    subtitle: 'La combinazione di linee che descrive il tuo ruolo nel mondo e come impari.',
  },
  strategy: {
    label: 'Strategia',
    subtitles: {
      'Wait to respond': 'Non iniziare — rispondi a ciò che la vita ti porta.',
      'Wait to respond then inform': 'Rispondi a ciò che ti entusiasma, poi informa gli altri.',
      'Inform before acting': 'Prima di iniziare qualcosa di nuovo, dillo a chi ti sta intorno.',
      'Wait for the invitation': 'Non importi — aspetta di essere riconosciuto e invitato.',
      'Wait a lunar cycle': 'Prima delle grandi decisioni, lascia passare un mese intero.',
    }
  },
  authority: {
    label: 'Autorità',
    subtitles: {
      'Emotional': 'La chiarezza arriva nel tempo — non decidere mai nel picco emotivo.',
      'Sacral': 'Il tuo corpo sa — fidati della risposta viscerale, non della mente.',
      'Splenic': 'Intuizione istantanea — la tua prima impressione è di solito giusta.',
      'Ego / Heart': 'Decidi dalla volontà e dai valori — cosa vuoi davvero fare?',
      'Self-Projected': 'La chiarezza arriva quando ne parli con persone di fiducia.',
      'Mental': 'Elabori attraverso la conversazione e l\'osservazione dell\'ambiente.',
      'Lunar': 'Hai bisogno di un ciclo lunare completo per le decisioni importanti.',
    }
  },
}