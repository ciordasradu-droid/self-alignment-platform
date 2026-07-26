// Punctul 1 (audit 26.07, runda 3): linia onesta ("profilul tau e scris in
// X") trebuie sa numeasca limba profilului IN LIMBA APLICATIEI, nu ca
// endonim — ex. app pe franceza + profil in romana -> "roumain", nu "română".
// Matrice completa: LANGUAGE_NAMES[app_language][profil_language].

export const LANGUAGE_NAMES = {
  en: { en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch', pl: 'Polish', hu: 'Hungarian', ru: 'Russian' },
  ro: { en: 'engleză', ro: 'română', es: 'spaniolă', fr: 'franceză', de: 'germană', it: 'italiană', pt: 'portugheză', nl: 'olandeză', pl: 'poloneză', hu: 'maghiară', ru: 'rusă' },
  es: { en: 'inglés', ro: 'rumano', es: 'español', fr: 'francés', de: 'alemán', it: 'italiano', pt: 'portugués', nl: 'neerlandés', pl: 'polaco', hu: 'húngaro', ru: 'ruso' },
  fr: { en: 'anglais', ro: 'roumain', es: 'espagnol', fr: 'français', de: 'allemand', it: 'italien', pt: 'portugais', nl: 'néerlandais', pl: 'polonais', hu: 'hongrois', ru: 'russe' },
  de: { en: 'Englisch', ro: 'Rumänisch', es: 'Spanisch', fr: 'Französisch', de: 'Deutsch', it: 'Italienisch', pt: 'Portugiesisch', nl: 'Niederländisch', pl: 'Polnisch', hu: 'Ungarisch', ru: 'Russisch' },
  it: { en: 'inglese', ro: 'rumeno', es: 'spagnolo', fr: 'francese', de: 'tedesco', it: 'italiano', pt: 'portoghese', nl: 'olandese', pl: 'polacco', hu: 'ungherese', ru: 'russo' },
  pt: { en: 'inglês', ro: 'romeno', es: 'espanhol', fr: 'francês', de: 'alemão', it: 'italiano', pt: 'português', nl: 'neerlandês', pl: 'polaco', hu: 'húngaro', ru: 'russo' },
  nl: { en: 'Engels', ro: 'Roemeens', es: 'Spaans', fr: 'Frans', de: 'Duits', it: 'Italiaans', pt: 'Portugees', nl: 'Nederlands', pl: 'Pools', hu: 'Hongaars', ru: 'Russisch' },
  // Punctul 1 (audit 26.07, runda 4): pl/ru sunt singurele doua limbi din
  // matrice unde prepozitia care introduce numele limbii ("w jezyku" / "na")
  // cere un caz gramatical diferit de nominativ — locativ in poloneza,
  // prepozitional in rusa. Verificat: matricea e folosita DOAR de linia
  // onesta (vezi grep, nicaieri altundeva), deci formele flexionate de mai
  // jos pot inlocui direct nominativul, fara sa strice alt loc din aplicatie.
  pl: { en: 'angielskim', ro: 'rumuńskim', es: 'hiszpańskim', fr: 'francuskim', de: 'niemieckim', it: 'włoskim', pt: 'portugalskim', nl: 'niderlandzkim', pl: 'polskim', hu: 'węgierskim', ru: 'rosyjskim' },
  hu: { en: 'angol', ro: 'román', es: 'spanyol', fr: 'francia', de: 'német', it: 'olasz', pt: 'portugál', nl: 'holland', pl: 'lengyel', hu: 'magyar', ru: 'orosz' },
  ru: { en: 'английском', ro: 'румынском', es: 'испанском', fr: 'французском', de: 'немецком', it: 'итальянском', pt: 'португальском', nl: 'нидерландском', pl: 'польском', hu: 'венгерском', ru: 'русском' },
}

export function languageNameIn(appLang, profileLangCode) {
  const row = LANGUAGE_NAMES[appLang] || LANGUAGE_NAMES.en
  return row[profileLangCode] || row.en
}
