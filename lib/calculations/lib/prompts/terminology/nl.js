// lib/prompts/terminology/nl.js

export const hdTerms = {
  types: {
    'Generator': 'Generator',
    'Manifesting Generator': 'Manifesterende Generator',
    'Manifestor': 'Manifestor',
    'Projector': 'Projector',
    'Reflector': 'Reflector',
  },
  strategies: {
    'Wait to respond': 'Wachten en reageren',
    'Wait to respond then inform': 'Wachten, reageren en informeren',
    'Inform before acting': 'Informeren voordat je handelt',
    'Wait for the invitation': 'Wachten op de uitnodiging',
    'Wait a lunar cycle': 'Een maancyclus afwachten',
  },
  authorities: {
    'Emotional': 'Emotionele Autoriteit',
    'Sacral': 'Sacrale Autoriteit',
    'Splenic': 'Miltautoriteit',
    'Ego / Heart': 'Ego- / Hartautoriteit',
    'Self-Projected': 'Zelfgeprojecteerde Autoriteit',
    'Mental': 'Mentale Autoriteit',
    'Lunar': 'Lunaire Autoriteit',
  },
  centers: {
    'Head': 'Hoofdcentrum',
    'Ajna': 'Ajna-centrum',
    'Throat': 'Keelcentrum',
    'G': 'G-centrum (Identiteit)',
    'Heart': 'Hartcentrum',
    'Solar Plexus': 'Zonnevlecht',
    'Sacral': 'Sacraal centrum',
    'Spleen': 'Miltcentrum',
    'Root': 'Wortelcentrum',
  },
  misc: {
    'Gates': 'Poorten',
    'Channels': 'Kanalen',
    'Profile': 'Profiel',
    'Incarnation Cross': 'Incarnatiekruis',
    'Defined': 'Gedefinieerd',
    'Undefined': 'Ongedefinieerd',
    'Right Angle Cross': 'Rechthoekig Kruis',
    'Left Angle Cross': 'Linkshoekig Kruis',
    'Juxtaposition Cross': 'Juxtapositiekruis',
  },
}

export const astroTerms = {
  'Sun sign': 'Zonneteken',
  'Moon sign': 'Maanteken',
  'Rising': 'Ascendant',
  'Ascendant': 'Ascendant',
  'Planetary ruler': 'Heersende planeet',
  'Cardinal': 'Cardinaal',
  'Fixed': 'Vast',
  'Mutable': 'Veranderlijk',
  'Fire': 'Vuur',
  'Earth': 'Aarde',
  'Air': 'Lucht',
  'Water': 'Water',
}

export const numerologyTerms = {
  'Life Path': 'Levenspad',
  'Expression Number': 'Expressiegetal',
  'Soul Urge': 'Zielsverlangen',
  'Personal Year': 'Persoonlijk Jaar',
  'Personal Month': 'Persoonlijke Maand',
  'Personality Number': 'Persoonlijkheidsgetal',
}

export const grammarRules = `
GRAMMATICAREGELS VOOR NEDERLANDS — VERPLICHT:
1. Gebruik de tweede persoon enkelvoud ("jij/je") consequent. Niet wisselen met derde persoon of "u".
2. Strikte woordgeslacht- en getalscongruentie voor bijvoeglijke naamwoorden en voornaamwoorden.
3. Het geslacht van de gebruiker is onbekend — gebruik genderneutrale formuleringen.
4. Nul Engelse woorden in de tekst. Als een technische term in de gegevens in het Engels staat, vertaal het dan voor gebruik.
5. Volledige zinnen met onderwerp en gezegde. Geen fragmenten.
6. Natuurlijk Nederlands — niet letterlijk vertalen uit het Engels. Herformuleer zodat het vloeiend klinkt.
`

export const headerBoxExplanations = {
  type: {
    label: 'Type',
    subtitles: {
      'Generator': 'Duurzame energie — je bloeit op door te reageren op wat je aantrekt.',
      'Manifesting Generator': 'Veelzijdige energie — je beweegt snel en hebt variatie nodig.',
      'Manifestor': 'Onafhankelijke initiatiefnemer — je start dingen en houdt anderen geïnformeerd.',
      'Projector': 'Gids en adviseur — je hebt erkenning en de juiste uitnodiging nodig.',
      'Reflector': 'Gemeenschapsspiegel — gevoelig voor omgeving, langzame wijze beslissingen.',
    }
  },
  profile: {
    label: 'Profiel',
    subtitle: 'De lijncombinatie die jouw rol in de wereld en jouw manier van leren beschrijft.',
  },
  strategy: {
    label: 'Strategie',
    subtitles: {
      'Wait to respond': 'Neem geen initiatief — reageer op wat het leven je brengt.',
      'Wait to respond then inform': 'Reageer op wat je enthousiasmeert, informeer dan anderen.',
      'Inform before acting': 'Voordat je iets nieuws start, vertel het de mensen om je heen.',
      'Wait for the invitation': 'Dring je niet op — wacht tot je wordt erkend en uitgenodigd.',
      'Wait a lunar cycle': 'Laat bij grote beslissingen een volledige maand verstrijken.',
    }
  },
  authority: {
    label: 'Autoriteit',
    subtitles: {
      'Emotional': 'Helderheid komt met de tijd — beslis nooit op het emotionele hoogtepunt.',
      'Sacral': 'Je lichaam weet het — vertrouw de buikreactie, niet het verstand.',
      'Splenic': 'Directe intuïtie — je eerste indruk is meestal juist.',
      'Ego / Heart': 'Je beslist vanuit wil en waarden — wat wil je echt doen?',
      'Self-Projected': 'Helderheid komt als je het bespreekt met vertrouwde mensen.',
      'Mental': 'Je verwerkt door gesprekken en observatie van je omgeving.',
      'Lunar': 'Je hebt een volledige maancyclus nodig voor belangrijke beslissingen.',
    }
  },
}