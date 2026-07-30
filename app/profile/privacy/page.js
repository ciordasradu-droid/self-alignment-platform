'use client'

// T5 (calup arhitectura 30.07) — pagina noua "Intimitatea Ta": un contract
// in 5 puncte, in limbaj simplu, plus butoanele REALE de Export/Sterge (mutate
// aici din SettingsDrawer, care acum are doar un link catre pagina asta —
// un singur loc unde traiesc, nu doua copii care se pot dezacorda).

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../../lib/language'
import { createSupabaseBrowser } from '../../../lib/supabase/client'

const L = {
  en: {
    back: '← Back', title: 'Your Privacy', subtitle: 'In plain language, no fine print.',
    p1_t: 'What you write stays yours.', p1_b: 'Journal entries, intentions, gratitude — none of it is read by anyone but you. It is never used to train any model.',
    p2_t: 'No analytics on your words.', p2_b: 'We track nothing about what you write — no word counts, no sentiment scores, no keyword analysis. Your text is stored, not studied.',
    p3_t: 'Your birth data calculates your profile, then rests.', p3_b: "Name, date, time and place of birth are used once, to calculate your charts. They are not shared, sold, or used for anything else.",
    p4_t: 'You can leave with everything, any time.', p4_b: 'Export gives you a complete copy of your data. Delete removes it permanently — both work instantly, no support ticket required.',
    p5_t: 'If we ever change this, we tell you first.', p5_b: "We won't quietly change what happens to your data. Any real change to this contract reaches you before it takes effect.",
    export_data: 'Export my data', exporting: 'Preparing...',
    delete_account: 'Delete my account', delete_confirm: 'This permanently deletes your profile, check-ins, and everything else. This cannot be undone.',
    delete_yes: 'Yes, delete everything', delete_cancel: 'Cancel', deleting: 'Deleting...',
  },
  ro: {
    back: '← Înapoi', title: 'Intimitatea Ta', subtitle: 'În limbaj simplu, fără litere mici.',
    p1_t: 'Ce scrii rămâne al tău.', p1_b: 'Însemnările din jurnal, intențiile, recunoștința — nimic din ele nu e citit de altcineva decât tine. Nu sunt folosite niciodată pentru antrenarea vreunui model.',
    p2_t: 'Zero analiză pe cuvintele tale.', p2_b: 'Nu urmărim nimic din ce scrii — nici numărul de cuvinte, nici scoruri de sentiment, nici analiză de cuvinte-cheie. Textul tău e stocat, nu studiat.',
    p3_t: 'Datele tale de naștere îți calculează profilul, apoi se odihnesc.', p3_b: 'Numele, data, ora și locul nașterii sunt folosite o singură dată, ca să-ți calculăm hărțile. Nu sunt partajate, vândute sau folosite pentru altceva.',
    p4_t: 'Poți pleca cu tot, oricând.', p4_b: 'Exportul îți dă o copie completă a datelor tale. Ștergerea le elimină definitiv — ambele funcționează instant, fără vreun tichet de suport.',
    p5_t: 'Dacă schimbăm vreodată asta, îți spunem primii.', p5_b: 'Nu schimbăm în tăcere ce se întâmplă cu datele tale. Orice schimbare reală a acestui contract ajunge la tine înainte să intre în vigoare.',
    export_data: 'Exportă-mi datele', exporting: 'Se pregătește...',
    delete_account: 'Șterge-mi contul', delete_confirm: 'Asta șterge definitiv profilul, check-in-urile și tot restul. Nu se poate anula.',
    delete_yes: 'Da, șterge tot', delete_cancel: 'Anulează', deleting: 'Se șterge...',
  },
  es: {
    back: '← Atrás', title: 'Tu Privacidad', subtitle: 'En lenguaje simple, sin letra pequeña.',
    p1_t: 'Lo que escribes sigue siendo tuyo.', p1_b: 'Entradas de diario, intenciones, gratitud — nada de eso lo lee nadie más que tú. Nunca se usa para entrenar ningún modelo.',
    p2_t: 'Cero análisis sobre tus palabras.', p2_b: 'No rastreamos nada de lo que escribes — ni conteo de palabras, ni puntuaciones de sentimiento, ni análisis de palabras clave. Tu texto se guarda, no se estudia.',
    p3_t: 'Tus datos de nacimiento calculan tu perfil, luego descansan.', p3_b: 'Nombre, fecha, hora y lugar de nacimiento se usan una vez, para calcular tus cartas. No se comparten, venden ni usan para nada más.',
    p4_t: 'Puedes irte con todo, cuando quieras.', p4_b: 'Exportar te da una copia completa de tus datos. Eliminar los borra permanentemente — ambos funcionan al instante, sin necesidad de soporte.',
    p5_t: 'Si alguna vez cambiamos esto, te lo decimos primero.', p5_b: 'No cambiaremos en silencio lo que pasa con tus datos. Cualquier cambio real a este contrato te llega antes de entrar en vigor.',
    export_data: 'Exportar mis datos', exporting: 'Preparando...',
    delete_account: 'Eliminar mi cuenta', delete_confirm: 'Esto elimina permanentemente tu perfil, tus check-ins y todo lo demás. No se puede deshacer.',
    delete_yes: 'Sí, eliminar todo', delete_cancel: 'Cancelar', deleting: 'Eliminando...',
  },
  fr: {
    back: '← Retour', title: 'Ta Vie Privée', subtitle: 'En langage simple, sans petites lignes.',
    p1_t: "Ce que tu écris reste à toi.", p1_b: "Entrées de journal, intentions, gratitude — rien de tout cela n'est lu par personne d'autre que toi. Jamais utilisé pour entraîner un modèle.",
    p2_t: 'Aucune analyse de tes mots.', p2_b: "Nous ne suivons rien de ce que tu écris — ni nombre de mots, ni score de sentiment, ni analyse de mots-clés. Ton texte est stocké, pas étudié.",
    p3_t: 'Tes données de naissance calculent ton profil, puis se reposent.', p3_b: 'Nom, date, heure et lieu de naissance sont utilisés une fois, pour calculer tes thèmes. Jamais partagés, vendus, ni utilisés autrement.',
    p4_t: "Tu peux partir avec tout, à tout moment.", p4_b: "L'export te donne une copie complète de tes données. La suppression les efface définitivement — les deux fonctionnent instantanément, sans ticket de support.",
    p5_t: "Si on change un jour cela, on te le dit d'abord.", p5_b: "Nous ne changerons jamais en silence ce qui arrive à tes données. Tout changement réel de ce contrat t'atteint avant d'entrer en vigueur.",
    export_data: 'Exporter mes données', exporting: 'Préparation...',
    delete_account: 'Supprimer mon compte', delete_confirm: 'Ceci supprime définitivement ton profil, tes check-ins et tout le reste. Impossible à annuler.',
    delete_yes: 'Oui, tout supprimer', delete_cancel: 'Annuler', deleting: 'Suppression...',
  },
  de: {
    back: '← Zurück', title: 'Deine Privatsphäre', subtitle: 'In einfacher Sprache, ohne Kleingedrucktes.',
    p1_t: 'Was du schreibst, bleibt deins.', p1_b: 'Tagebucheinträge, Absichten, Dankbarkeit — nichts davon liest jemand außer dir. Wird nie zum Training irgendeines Modells verwendet.',
    p2_t: 'Keine Analyse deiner Worte.', p2_b: 'Wir verfolgen nichts von dem, was du schreibst — keine Wortzahlen, keine Stimmungswerte, keine Schlüsselwortanalyse. Dein Text wird gespeichert, nicht untersucht.',
    p3_t: 'Deine Geburtsdaten berechnen dein Profil, dann ruhen sie.', p3_b: 'Name, Datum, Uhrzeit und Geburtsort werden einmal verwendet, um deine Karten zu berechnen. Nie geteilt, verkauft oder anders verwendet.',
    p4_t: 'Du kannst jederzeit mit allem gehen.', p4_b: 'Export gibt dir eine vollständige Kopie deiner Daten. Löschen entfernt sie dauerhaft — beides funktioniert sofort, ohne Support-Anfrage.',
    p5_t: 'Wenn wir das je ändern, sagen wir es dir zuerst.', p5_b: 'Wir ändern nie still, was mit deinen Daten passiert. Jede echte Änderung dieses Vertrags erreicht dich, bevor sie wirksam wird.',
    export_data: 'Meine Daten exportieren', exporting: 'Wird vorbereitet...',
    delete_account: 'Mein Konto löschen', delete_confirm: 'Dies löscht dauerhaft dein Profil, deine Check-ins und alles andere. Kann nicht rückgängig gemacht werden.',
    delete_yes: 'Ja, alles löschen', delete_cancel: 'Abbrechen', deleting: 'Wird gelöscht...',
  },
  it: {
    back: '← Indietro', title: 'La Tua Privacy', subtitle: 'In linguaggio semplice, senza clausole nascoste.',
    p1_t: 'Quello che scrivi resta tuo.', p1_b: 'Voci di diario, intenzioni, gratitudine — niente di tutto ciò viene letto da nessuno tranne te. Mai usato per addestrare alcun modello.',
    p2_t: 'Zero analisi sulle tue parole.', p2_b: 'Non tracciamo nulla di ciò che scrivi — né conteggio parole, né punteggi di sentiment, né analisi di parole chiave. Il tuo testo è archiviato, non studiato.',
    p3_t: 'I tuoi dati di nascita calcolano il tuo profilo, poi riposano.', p3_b: 'Nome, data, ora e luogo di nascita sono usati una volta, per calcolare i tuoi temi. Mai condivisi, venduti o usati per altro.',
    p4_t: 'Puoi andartene con tutto, in qualsiasi momento.', p4_b: "L'esportazione ti dà una copia completa dei tuoi dati. L'eliminazione li rimuove permanentemente — entrambi funzionano istantaneamente, senza bisogno di supporto.",
    p5_t: 'Se mai cambiamo questo, te lo diciamo prima.', p5_b: 'Non cambieremo mai in silenzio ciò che accade ai tuoi dati. Qualsiasi cambiamento reale a questo contratto ti raggiunge prima di entrare in vigore.',
    export_data: 'Esporta i miei dati', exporting: 'Preparazione...',
    delete_account: 'Elimina il mio account', delete_confirm: 'Questo elimina definitivamente il tuo profilo, i check-in e tutto il resto. Non può essere annullato.',
    delete_yes: 'Sì, elimina tutto', delete_cancel: 'Annulla', deleting: 'Eliminazione...',
  },
  pt: {
    back: '← Voltar', title: 'A Tua Privacidade', subtitle: 'Em linguagem simples, sem letras miúdas.',
    p1_t: 'O que escreves continua teu.', p1_b: 'Entradas de diário, intenções, gratidão — nada disso é lido por mais ninguém além de ti. Nunca usado para treinar qualquer modelo.',
    p2_t: 'Zero análise sobre as tuas palavras.', p2_b: 'Não rastreamos nada do que escreves — nem contagem de palavras, nem pontuações de sentimento, nem análise de palavras-chave. O teu texto é guardado, não estudado.',
    p3_t: 'Os teus dados de nascimento calculam o teu perfil, depois descansam.', p3_b: 'Nome, data, hora e local de nascimento são usados uma vez, para calcular os teus mapas. Nunca partilhados, vendidos ou usados para outra coisa.',
    p4_t: 'Podes sair com tudo, a qualquer momento.', p4_b: 'A exportação dá-te uma cópia completa dos teus dados. A eliminação remove-os permanentemente — ambos funcionam instantaneamente, sem precisar de suporte.',
    p5_t: 'Se alguma vez mudarmos isto, dizemos-te primeiro.', p5_b: 'Nunca mudaremos em silêncio o que acontece aos teus dados. Qualquer mudança real a este contrato chega até ti antes de entrar em vigor.',
    export_data: 'Exportar os meus dados', exporting: 'A preparar...',
    delete_account: 'Eliminar a minha conta', delete_confirm: 'Isto elimina permanentemente o teu perfil, os teus check-ins e tudo o resto. Não pode ser desfeito.',
    delete_yes: 'Sim, eliminar tudo', delete_cancel: 'Cancelar', deleting: 'A eliminar...',
  },
  nl: {
    back: '← Terug', title: 'Jouw Privacy', subtitle: 'In gewone taal, zonder kleine lettertjes.',
    p1_t: 'Wat je schrijft blijft van jou.', p1_b: 'Dagboekaantekeningen, intenties, dankbaarheid — niets daarvan wordt door iemand anders gelezen dan jij. Nooit gebruikt om enig model te trainen.',
    p2_t: 'Geen analyse van jouw woorden.', p2_b: 'We volgen niets van wat je schrijft — geen woordentelling, geen sentimentscores, geen trefwoordanalyse. Je tekst wordt opgeslagen, niet bestudeerd.',
    p3_t: 'Je geboortegegevens berekenen je profiel, daarna rusten ze.', p3_b: 'Naam, datum, tijd en plaats van geboorte worden één keer gebruikt, om je kaarten te berekenen. Nooit gedeeld, verkocht of anders gebruikt.',
    p4_t: 'Je kunt altijd met alles vertrekken.', p4_b: 'Exporteren geeft je een volledige kopie van je gegevens. Verwijderen wist ze permanent — beide werken direct, zonder supportticket.',
    p5_t: 'Als we dit ooit veranderen, zeggen we het je eerst.', p5_b: 'We veranderen nooit stilletjes wat er met je gegevens gebeurt. Elke echte wijziging van dit contract bereikt je voordat hij ingaat.',
    export_data: 'Mijn gegevens exporteren', exporting: 'Voorbereiden...',
    delete_account: 'Mijn account verwijderen', delete_confirm: 'Dit verwijdert permanent je profiel, je check-ins en al de rest. Dit kan niet ongedaan worden gemaakt.',
    delete_yes: 'Ja, alles verwijderen', delete_cancel: 'Annuleren', deleting: 'Verwijderen...',
  },
  pl: {
    back: '← Wstecz', title: 'Twoja Prywatność', subtitle: 'Prostym językiem, bez drobnego druku.',
    p1_t: 'To, co piszesz, zostaje twoje.', p1_b: 'Wpisy w dzienniku, intencje, wdzięczność — nic z tego nie czyta nikt poza tobą. Nigdy nie jest używane do trenowania żadnego modelu.',
    p2_t: 'Zero analizy twoich słów.', p2_b: 'Nie śledzimy niczego z tego, co piszesz — ani liczby słów, ani wyników nastroju, ani analizy słów kluczowych. Twój tekst jest przechowywany, nie badany.',
    p3_t: 'Twoje dane urodzenia obliczają twój profil, a potem odpoczywają.', p3_b: 'Imię, data, godzina i miejsce urodzenia są używane raz, do obliczenia twoich wykresów. Nigdy nie udostępniane, sprzedawane ani używane inaczej.',
    p4_t: 'Możesz odejść ze wszystkim, kiedy chcesz.', p4_b: 'Eksport daje ci pełną kopię twoich danych. Usunięcie kasuje je trwale — oba działają natychmiast, bez zgłoszenia do wsparcia.',
    p5_t: 'Jeśli kiedykolwiek to zmienimy, powiemy ci pierwsi.', p5_b: 'Nigdy po cichu nie zmienimy tego, co dzieje się z twoimi danymi. Każda prawdziwa zmiana tej umowy dotrze do ciebie, zanim wejdzie w życie.',
    export_data: 'Eksportuj moje dane', exporting: 'Przygotowywanie...',
    delete_account: 'Usuń moje konto', delete_confirm: 'To trwale usuwa twój profil, check-iny i wszystko inne. Nie da się tego cofnąć.',
    delete_yes: 'Tak, usuń wszystko', delete_cancel: 'Anuluj', deleting: 'Usuwanie...',
  },
  hu: {
    back: '← Vissza', title: 'A Te Adatvédelmed', subtitle: 'Egyszerű nyelven, apró betűk nélkül.',
    p1_t: 'Amit írsz, az a tiéd marad.', p1_b: 'Naplóbejegyzések, szándékok, hála — ezekből semmit sem olvas más, csak te. Soha nem használjuk semmilyen modell tanítására.',
    p2_t: 'Nulla elemzés a szavaidon.', p2_b: 'Semmit nem követünk abból, amit írsz — sem szószámot, sem hangulati pontszámokat, sem kulcsszóelemzést. A szöveged tárolva van, nem tanulmányozva.',
    p3_t: 'A születési adataid kiszámítják a profilod, aztán pihennek.', p3_b: 'A név, dátum, idő és születési hely egyszer kerül felhasználásra, a térképeid kiszámításához. Soha nem osztjuk meg, adjuk el vagy használjuk másra.',
    p4_t: 'Bármikor elmehetsz mindennel.', p4_b: 'Az exportálás teljes másolatot ad az adataidról. A törlés véglegesen eltávolítja őket — mindkettő azonnal működik, support jegy nélkül.',
    p5_t: 'Ha valaha megváltoztatjuk ezt, előbb szólunk.', p5_b: 'Soha nem változtatjuk meg csendben, hogy mi történik az adataiddal. E szerződés bármely valódi változása eléred, mielőtt hatályba lépne.',
    export_data: 'Adataim exportálása', exporting: 'Előkészítés...',
    delete_account: 'Fiókom törlése', delete_confirm: 'Ez véglegesen törli a profilodat, a bejelentkezéseidet és minden mást. Nem vonható vissza.',
    delete_yes: 'Igen, töröljön mindent', delete_cancel: 'Mégse', deleting: 'Törlés...',
  },
  ru: {
    back: '← Назад', title: 'Твоя Приватность', subtitle: 'Простым языком, без мелкого шрифта.',
    p1_t: 'То, что ты пишешь, остаётся твоим.', p1_b: 'Записи в дневнике, намерения, благодарность — ничего из этого не читает никто, кроме тебя. Никогда не используется для обучения какой-либо модели.',
    p2_t: 'Ноль анализа твоих слов.', p2_b: 'Мы не отслеживаем ничего из того, что ты пишешь — ни подсчёт слов, ни оценки настроения, ни анализ ключевых слов. Твой текст хранится, а не изучается.',
    p3_t: 'Твои данные о рождении рассчитывают твой профиль, затем отдыхают.', p3_b: 'Имя, дата, время и место рождения используются один раз, для расчёта твоих карт. Никогда не передаются, не продаются и не используются иначе.',
    p4_t: 'Ты можешь уйти со всем, в любой момент.', p4_b: 'Экспорт даёт тебе полную копию твоих данных. Удаление стирает их навсегда — оба работают мгновенно, без обращения в поддержку.',
    p5_t: 'Если мы когда-нибудь это изменим, мы скажем тебе первым.', p5_b: 'Мы никогда молча не изменим то, что происходит с твоими данными. Любое реальное изменение этого договора дойдёт до тебя до того, как вступит в силу.',
    export_data: 'Экспортировать мои данные', exporting: 'Подготовка...',
    delete_account: 'Удалить мой аккаунт', delete_confirm: 'Это навсегда удалит твой профиль, чек-ины и всё остальное. Это нельзя отменить.',
    delete_yes: 'Да, удалить всё', delete_cancel: 'Отмена', deleting: 'Удаление...',
  },
}
const lx = (lang, k) => (L[lang] || L.en)[k]

export default function PrivacyPage() {
  const [lang] = useLanguage()
  const [exporting, setExporting] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/account/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'my-data.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {}
    setExporting(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await fetch('/api/account/delete', { method: 'POST' })
      await createSupabaseBrowser().auth.signOut()
    } catch (e) {}
    try { localStorage.clear() } catch (e) {}
    try { sessionStorage.clear() } catch (e) {}
    window.location.href = '/'
  }

  const points = ['p1', 'p2', 'p3', 'p4', 'p5']

  return (
    <main style={s.wrap}>
      <Link href="/profile" style={s.back}>{lx(lang, 'back')}</Link>

      <h1 style={s.title}>{lx(lang, 'title')}</h1>
      <p style={s.subtitle}>{lx(lang, 'subtitle')}</p>

      <div style={{ marginTop: '28px' }}>
        {points.map((p, i) => (
          <div key={p} className="chapter" style={{ padding: '20px 22px', marginBottom: '14px' }}>
            <p style={s.pointNum}>{i + 1}</p>
            <p style={s.pointTitle}>{lx(lang, `${p}_t`)}</p>
            <p style={s.pointBody}>{lx(lang, `${p}_b`)}</p>
          </div>
        ))}
      </div>

      <div className="chapter" style={{ padding: '20px 22px', marginTop: '24px' }}>
        <button onClick={handleExport} disabled={exporting} style={{ ...s.actionRow, borderTop: 'none', opacity: exporting ? 0.6 : 1 }}>
          {exporting ? lx(lang, 'exporting') : lx(lang, 'export_data')}
        </button>

        {!confirmingDelete ? (
          <button onClick={() => setConfirmingDelete(true)} style={{ ...s.actionRow, color: 'rgba(224,138,138,0.85)' }}>
            {lx(lang, 'delete_account')}
          </button>
        ) : (
          <div style={{ padding: '14px 4px', borderTop: '1px solid rgba(244,240,234,0.08)' }}>
            <p style={{ fontSize: '13px', color: 'rgba(244,240,234,0.65)', marginBottom: '12px', lineHeight: 1.5 }}>
              {lx(lang, 'delete_confirm')}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setConfirmingDelete(false)} disabled={deleting} style={s.cancelBtn}>
                {lx(lang, 'delete_cancel')}
              </button>
              <button onClick={handleDelete} disabled={deleting} style={{ ...s.dangerBtn, opacity: deleting ? 0.6 : 1 }}>
                {deleting ? lx(lang, 'deleting') : lx(lang, 'delete_yes')}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

const s = {
  wrap: { maxWidth: '600px', margin: '0 auto', padding: 'calc(40px + env(safe-area-inset-top)) 24px 80px' },
  back: { fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500', display: 'inline-block', marginBottom: '24px', minHeight: '44px' },
  title: { fontSize: 'clamp(28px, 7vw, 40px)', fontWeight: '600', color: '#f4f0ea', fontFamily: 'Cormorant Garamond, serif' },
  subtitle: { fontSize: '15px', color: 'rgba(244,240,234,0.6)', marginTop: '8px' },
  pointNum: { fontSize: '12px', color: '#e5a93c', letterSpacing: '0.5px', marginBottom: '6px' },
  pointTitle: { fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: '#f4f0ea', marginBottom: '6px' },
  pointBody: { fontSize: '14px', color: 'rgba(244,240,234,0.65)', lineHeight: 1.6 },
  actionRow: { display: 'block', width: '100%', textAlign: 'left', padding: '14px 4px', background: 'none', border: 'none', borderTop: '1px solid rgba(244,240,234,0.08)', color: 'rgba(244,240,234,0.85)', fontSize: '15px', cursor: 'pointer', minHeight: '44px' },
  cancelBtn: { flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(244,240,234,0.18)', background: 'transparent', color: 'rgba(244,240,234,0.85)', fontSize: '14px', cursor: 'pointer', minHeight: '44px' },
  dangerBtn: { flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(224,138,138,0.4)', background: 'rgba(224,138,138,0.12)', color: 'rgba(244,240,234,0.95)', fontSize: '14px', cursor: 'pointer', minHeight: '44px' },
}
