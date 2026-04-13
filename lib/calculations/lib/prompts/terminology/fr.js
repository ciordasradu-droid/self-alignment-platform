// lib/prompts/terminology/fr.js

export const hdTerms = {
  types: {
    'Generator': 'Générateur',
    'Manifesting Generator': 'Générateur Manifestant',
    'Manifestor': 'Manifesteur',
    'Projector': 'Projecteur',
    'Reflector': 'Réflecteur',
  },
  strategies: {
    'Wait to respond': 'Attendre et répondre',
    'Wait to respond then inform': 'Attendre, répondre puis informer',
    'Inform before acting': 'Informer avant d\'agir',
    'Wait for the invitation': 'Attendre l\'invitation',
    'Wait a lunar cycle': 'Attendre un cycle lunaire',
  },
  authorities: {
    'Emotional': 'Autorité Émotionnelle',
    'Sacral': 'Autorité Sacrale',
    'Splenic': 'Autorité Splénique',
    'Ego / Heart': 'Autorité de l\'Ego / Cœur',
    'Self-Projected': 'Autorité Auto-projetée',
    'Mental': 'Autorité Mentale',
    'Lunar': 'Autorité Lunaire',
  },
  centers: {
    'Head': 'Centre de la Tête',
    'Ajna': 'Centre Ajna',
    'Throat': 'Centre de la Gorge',
    'G': 'Centre G (Identité)',
    'Heart': 'Centre du Cœur',
    'Solar Plexus': 'Plexus Solaire',
    'Sacral': 'Centre Sacral',
    'Spleen': 'Centre de la Rate',
    'Root': 'Centre Racine',
  },
  misc: {
    'Gates': 'Portes',
    'Channels': 'Canaux',
    'Profile': 'Profil',
    'Incarnation Cross': 'Croix d\'Incarnation',
    'Defined': 'Défini',
    'Undefined': 'Indéfini',
    'Right Angle Cross': 'Croix en Angle Droit',
    'Left Angle Cross': 'Croix en Angle Gauche',
    'Juxtaposition Cross': 'Croix de Juxtaposition',
  },
}

export const astroTerms = {
  'Sun sign': 'Signe Solaire',
  'Moon sign': 'Signe Lunaire',
  'Rising': 'Ascendant',
  'Ascendant': 'Ascendant',
  'Planetary ruler': 'Planète Maîtresse',
  'Cardinal': 'Cardinal',
  'Fixed': 'Fixe',
  'Mutable': 'Mutable',
  'Fire': 'Feu',
  'Earth': 'Terre',
  'Air': 'Air',
  'Water': 'Eau',
}

export const numerologyTerms = {
  'Life Path': 'Chemin de Vie',
  'Expression Number': 'Nombre d\'Expression',
  'Soul Urge': 'Désir de l\'Âme',
  'Personal Year': 'Année Personnelle',
  'Personal Month': 'Mois Personnel',
  'Personality Number': 'Nombre de Personnalité',
}

export const grammarRules = `
RÈGLES GRAMMATICALES OBLIGATOIRES POUR LE FRANÇAIS :
1. Deuxième personne du singulier ("tu") de manière cohérente. Ne pas alterner avec le vouvoiement ou la troisième personne.
2. Accord strict en genre et en nombre pour les adjectifs, participes et pronoms.
3. Le genre de l'utilisateur est inconnu — utilise des formulations neutres ou reformule pour éviter les marques de genre.
4. Zéro mot en anglais ou autre langue dans le texte. Si un terme technique arrive en anglais dans les données, le traduire avant utilisation.
5. Phrases complètes avec sujet et prédicat. Pas de fragments.
6. Français naturel — ne pas traduire littéralement de l'anglais. Reformuler pour que ce soit fluide.
`

export const headerBoxExplanations = {
  type: {
    label: 'Type',
    subtitles: {
      'Generator': 'Énergie durable — tu t\'épanouis en répondant à ce qui t\'attire.',
      'Manifesting Generator': 'Énergie multiple — tu vas vite et as besoin de variété.',
      'Manifestor': 'Initiateur indépendant — tu lances des choses et informes les autres.',
      'Projector': 'Guide et conseiller — tu as besoin de reconnaissance et d\'invitation.',
      'Reflector': 'Miroir communautaire — sensible à l\'environnement, décisions lentes et sages.',
    }
  },
  profile: {
    label: 'Profil',
    subtitle: 'La combinaison de lignes qui décrit ton rôle dans le monde et ta façon d\'apprendre.',
  },
  strategy: {
    label: 'Stratégie',
    subtitles: {
      'Wait to respond': 'N\'initie pas — réponds à ce que la vie t\'apporte.',
      'Wait to respond then inform': 'Réponds à ce qui t\'enthousiasme, puis informe les autres.',
      'Inform before acting': 'Avant de commencer quelque chose, dis-le à ton entourage.',
      'Wait for the invitation': 'Ne t\'impose pas — attends d\'être reconnu et invité.',
      'Wait a lunar cycle': 'Avant les grandes décisions, laisse passer un mois complet.',
    }
  },
  authority: {
    label: 'Autorité',
    subtitles: {
      'Emotional': 'La clarté vient avec le temps — ne décide jamais au pic émotionnel.',
      'Sacral': 'Ton corps sait — fais confiance à la réponse viscérale, pas à l\'esprit.',
      'Splenic': 'Intuition instantanée — ta première impression est généralement juste.',
      'Ego / Heart': 'Tu décides depuis la volonté et les valeurs — que veux-tu vraiment faire ?',
      'Self-Projected': 'La clarté vient quand tu en parles avec des personnes de confiance.',
      'Mental': 'Tu traites par la conversation et l\'observation de ton environnement.',
      'Lunar': 'Tu as besoin d\'un cycle lunaire complet pour les décisions importantes.',
    }
  },
}