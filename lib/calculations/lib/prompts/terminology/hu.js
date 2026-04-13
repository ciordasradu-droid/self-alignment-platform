// lib/prompts/terminology/hu.js

export const hdTerms = {
  types: {
    'Generator': 'Generátor',
    'Manifesting Generator': 'Megnyilvánuló Generátor',
    'Manifestor': 'Megnyilvánító',
    'Projector': 'Projektor',
    'Reflector': 'Reflektor',
  },
  strategies: {
    'Wait to respond': 'Várj és reagálj',
    'Wait to respond then inform': 'Várj, reagálj és tájékoztass',
    'Inform before acting': 'Tájékoztass cselekvés előtt',
    'Wait for the invitation': 'Várd meg a meghívást',
    'Wait a lunar cycle': 'Várj egy holdciklust',
  },
  authorities: {
    'Emotional': 'Érzelmi Autoritás',
    'Sacral': 'Szakrális Autoritás',
    'Splenic': 'Lép Autoritás',
    'Ego / Heart': 'Ego / Szív Autoritás',
    'Self-Projected': 'Önvetített Autoritás',
    'Mental': 'Mentális Autoritás',
    'Lunar': 'Hold Autoritás',
  },
  centers: {
    'Head': 'Fej Központ',
    'Ajna': 'Ajna Központ',
    'Throat': 'Torok Központ',
    'G': 'G Központ (Identitás)',
    'Heart': 'Szív Központ',
    'Solar Plexus': 'Napfonat',
    'Sacral': 'Szakrális Központ',
    'Spleen': 'Lép Központ',
    'Root': 'Gyökér Központ',
  },
  misc: {
    'Gates': 'Kapuk',
    'Channels': 'Csatornák',
    'Profile': 'Profil',
    'Incarnation Cross': 'Inkarnációs Kereszt',
    'Defined': 'Meghatározott',
    'Undefined': 'Meghatározatlan',
    'Right Angle Cross': 'Derékszögű Kereszt',
    'Left Angle Cross': 'Balszögű Kereszt',
    'Juxtaposition Cross': 'Párhuzamos Kereszt',
  },
}

export const astroTerms = {
  'Sun sign': 'Napjegy',
  'Moon sign': 'Holdjegy',
  'Rising': 'Aszcendens',
  'Ascendant': 'Aszcendens',
  'Planetary ruler': 'Uraló Bolygó',
  'Cardinal': 'Kardinális',
  'Fixed': 'Rögzített',
  'Mutable': 'Változékony',
  'Fire': 'Tűz',
  'Earth': 'Föld',
  'Air': 'Levegő',
  'Water': 'Víz',
}

export const numerologyTerms = {
  'Life Path': 'Életút',
  'Expression Number': 'Kifejezési Szám',
  'Soul Urge': 'Lélek Vágya',
  'Personal Year': 'Személyes Év',
  'Personal Month': 'Személyes Hónap',
  'Personality Number': 'Személyiség Szám',
}

export const grammarRules = `
KÖTELEZŐ NYELVTANI SZABÁLYOK MAGYARUL:
1. Következetesen használd az egyes szám második személyt ("te"). Ne váltogass harmadik személyre.
2. A magyar magánhangzó-harmónia betartása: az utótagok illeszkedjenek a szótő magánhangzóihoz (pl. -ban/-ben, -hoz/-hez/-höz).
3. A felhasználó neme ismeretlen — nemleges vagy semleges fogalmazást használj. Kerüld a nemre utaló végződéseket.
4. Nulla angol szó a szövegben. Ha egy technikai kifejezés angolul érkezik az adatokban, fordítsd le felhasználás előtt.
5. Teljes mondatok alannyal és állítmánnyal. Nincs töredék.
6. Természetes magyar — ne fordíts szó szerint angolból. Fogalmazz úgy, hogy folyékonyan hangozzék.
7. Különös figyelem a ragozásra és a szórendere — a magyar SOV szórend eltér az angoltól.
`

export const headerBoxExplanations = {
  type: {
    label: 'Típus',
    subtitles: {
      'Generator': 'Tartós energia — akkor virágzol, ha arra reagálsz, ami vonz.',
      'Manifesting Generator': 'Sokrétű energia — gyorsan mozogsz és változatosságra van szükséged.',
      'Manifestor': 'Független kezdeményező — elindítasz dolgokat és tájékoztatod másokat.',
      'Projector': 'Vezető és tanácsadó — elismerésre és meghívásra van szükséged.',
      'Reflector': 'Közösségi tükör — érzékeny a környezetre, lassú bölcs döntések.',
    }
  },
  profile: {
    label: 'Profil',
    subtitle: 'A vonalkombináció, amely leírja a világban betöltött szerepedet és tanulási módodat.',
  },
  strategy: {
    label: 'Stratégia',
    subtitles: {
      'Wait to respond': 'Ne kezdeményezz — reagálj arra, amit az élet hoz eléd.',
      'Wait to respond then inform': 'Reagálj arra, ami lelkesít, majd tájékoztasd másokat.',
      'Inform before acting': 'Mielőtt valami újba kezdesz, szólj a körülötted lévőknek.',
      'Wait for the invitation': 'Ne erőlköd — várj, amíg felismernek és meghívnak.',
      'Wait a lunar cycle': 'Nagy döntések előtt hagyj eltelni egy teljes hónapot.',
    }
  },
  authority: {
    label: 'Autoritás',
    subtitles: {
      'Emotional': 'Az egyértelműség idővel jön — soha ne dönts az érzelmi csúcson.',
      'Sacral': 'A tested tudja — bízz a zsigeri reakcióban, ne az elmédben.',
      'Splenic': 'Azonnali intuíció — az első benyomásod általában helyes.',
      'Ego / Heart': 'Akaratból és értékekből döntesz — mit szeretnél valóban tenni?',
      'Self-Projected': 'Az egyértelműség akkor jön, ha megbeszéled megbízható emberekkel.',
      'Mental': 'Beszélgetésen és a környezet megfigyelésén keresztül dolgozol fel.',
      'Lunar': 'Fontos döntésekhez egy teljes holdciklusra van szükséged.',
    }
  },
}