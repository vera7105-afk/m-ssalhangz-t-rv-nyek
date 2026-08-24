import { Question, BonusChallenge } from '../types';

export const QUESTIONS: Question[] = [
  // ==========================================
  // 1. RÉSZ: KVÍZFELADATOK (1 - 10)
  // 4 lehetséges megoldás, 1 helyes válasz
  // ==========================================
  {
    id: 1,
    part: 'quiz',
    title: '1. Kvíz: Alapfogalmak és felismerés',
    subtitle: 'Kezdjük egy könnyű kérdéssel!',
    prompt: 'Milyen mássalhangzótörvény érvényesül a „vasgolyó” szó kiejtésekor?',
    word: 'vasgolyó',
    pronunciation: '[vazsgolyó]',
    ruleCategory: 'reszleges_zongesseg',
    options: [
      { id: 'a', text: 'Zöngésség szerinti részleges hasonulás (zöngésedés)', isCorrect: true },
      { id: 'b', text: 'Összeolvadás', isCorrect: false },
      { id: 'c', text: 'Mássalhangzó-kiesés', isCorrect: false },
      { id: 'd', text: 'Írásban jelölt teljes hasonulás', isCorrect: false },
    ],
    explanation: 'A „vasgolyó” szóban a zöngétlen „s” hang után zöngés „g” áll. A „g” hatására az „s” zöngéssé válik, így kiejtésben [vazsgolyó]-t mondunk. Ez zöngésség szerinti részleges hasonulás (zöngésedés).',
    hint: 'Nézd meg a két találkozó hangot: s (zöngétlen) és g (zöngés)!'
  },
  {
    id: 2,
    part: 'quiz',
    title: '2. Kvíz: Zöngétlenedés',
    subtitle: 'Figyeld meg a találkozó hangokat!',
    prompt: 'Mit tapasztalunk a „dobtam” szó kiejtésekor?',
    word: 'dobtam',
    pronunciation: '[doptam]',
    ruleCategory: 'reszleges_zongesseg',
    options: [
      { id: 'a', text: 'Mássalhangzó-rövidülés', isCorrect: false },
      { id: 'b', text: 'Zöngésség szerinti részleges hasonulás (zöngétlenedés)', isCorrect: true },
      { id: 'c', text: 'Képzés helye szerinti hasonulás', isCorrect: false },
      { id: 'd', text: 'Írásban jelöletlen teljes hasonulás', isCorrect: false },
    ],
    explanation: 'A „b” (zöngés) a mögötte álló „t” (zöngétlen) hatására a saját zöngétlen párjává, [p]-vé változik kiejtésben: [doptam]. Ez zöngétlenedés.',
    hint: 'A b zöngétlen párja a p hang!'
  },
  {
    id: 3,
    part: 'quiz',
    title: '3. Kvíz: Képzés helye szerinti hasonulás',
    subtitle: 'Az N hang különleges viselkedése',
    prompt: 'Miért ejtjük a „színpad” szót [szímpad]-nak?',
    word: 'színpad',
    pronunciation: '[szímpad]',
    ruleCategory: 'reszleges_kepzes_helye',
    options: [
      { id: 'a', text: 'Mert a „p” hang előtt az „n” átalakul ajakkal képzett „m” hanggá', isCorrect: true },
      { id: 'b', text: 'Mert a „p” zöngésíti az „n”-t', isCorrect: false },
      { id: 'c', text: 'Mert a szóban mássalhangzó-kiesés történt', isCorrect: false },
      { id: 'd', text: 'Mert összeolvadt a két hang egy hosszú [pp]-vé', isCorrect: false },
    ],
    explanation: 'A „p” és „b” ajakhangok előtt az „n” foghang helyett az ajakkal képzett „m” hangot ejtjük. Ez a képzés helye szerinti részleges hasonulás.',
    hint: 'P és B előtt az N mindig M-mé alakul kiejtésben!'
  },
  {
    id: 4,
    part: 'quiz',
    title: '4. Kvíz: Írásban jelölt teljes hasonulás',
    subtitle: 'Amikor a leírt betűk is megváltoznak',
    prompt: 'Melyik szóban történik ÍRÁSBAN JELÖLT teljes hasonulás?',
    word: 'azzal',
    pronunciation: '[azzal]',
    ruleCategory: 'teljes_irasban_jelolt',
    options: [
      { id: 'a', text: 'hagyja', isCorrect: false },
      { id: 'b', text: 'virággal', isCorrect: true },
      { id: 'c', text: 'mondta', isCorrect: false },
      { id: 'd', text: 'barátság', isCorrect: false },
    ],
    explanation: 'A „virág + val” toldalékolásakor a „v” teljesen hasonul a szóvégi „g”-hez, és ezt le is írjuk: „virággal” (dupla g). Ez írásban jelölt teljes hasonulás.',
    hint: 'Keresd a -val/-vel vagy -vá/-vé ragos alakot, ahol kettőzött betűt írunk!'
  },
  {
    id: 5,
    part: 'quiz',
    title: '5. Kvíz: Írásban jelöletlen teljes hasonulás',
    subtitle: 'A fülünk mást hall, mint amit a szemünk lát!',
    prompt: 'A „hagyja” szóban kiejtéskor [haggya]-t mondunk. Miért írjuk mégis „gy + j”-vel?',
    word: 'hagyja',
    pronunciation: '[haggya]',
    ruleCategory: 'teljes_irasban_jeloletlen',
    options: [
      { id: 'a', text: 'Mert a j hang kiesett a szóból', isCorrect: false },
      { id: 'b', text: 'Mert írásban jelöletlen teljes hasonulás történik: a szótő (hagy) és a toldalék (ja) megőrzi eredeti alakját', isCorrect: true },
      { id: 'c', text: 'Mert ez zöngésségi hasonulás', isCorrect: false },
      { id: 'd', text: 'Mert a gy és j összeolvadt egy harmadik hanggá', isCorrect: false },
    ],
    explanation: 'A „hagy + ja” kapcsolatban a j teljesen hasonul az előtte álló gy-hez ([haggya]), de helyesírásunkban a szóelemzés elve miatt külön leírjuk az eredeti betűket: „hagyja”.',
    hint: 'A szótő a „hagy”, a toldalék a „-ja”.'
  },
  {
    id: 6,
    part: 'quiz',
    title: '6. Kvíz: Az összeolvadás felismerése',
    subtitle: 'Új hang születik a kiejtésben!',
    prompt: 'Mi történik a „barátság” szó kiejtésekor [baráccság]?',
    word: 'barátság',
    pronunciation: '[baráccság]',
    ruleCategory: 'osszeolvadas',
    options: [
      { id: 'a', text: 'Összeolvadás: a „t” és „s” hangok helyett egy harmadik, hosszú hangot [ccs] ejtünk', isCorrect: true },
      { id: 'b', text: 'Kiesés: a „t” hang eltűnik', isCorrect: false },
      { id: 'c', text: 'Rövidülés: a hosszú á hang megrövidül', isCorrect: false },
      { id: 'd', text: 'Írásban jelölt teljes hasonulás', isCorrect: false },
    ],
    explanation: 'A „t” és „s” mássalhangzók találkozásakor egyik sem győz a másik felett, hanem egy harmadik, hosszú hanggá, [ccs]-vé olvadnak össze: [baráccság].',
    hint: 't + s = hosszú cs [ccs]!'
  },
  {
    id: 7,
    part: 'quiz',
    title: '7. Kvíz: Mássalhangzó-rövidülés',
    subtitle: 'Hosszúnak írjuk, de röviden mondjuk',
    prompt: 'Melyik szó példa a mássalhangzó-RÖVIDÜLÉS törvényére?',
    word: 'jobbra',
    pronunciation: '[jobra]',
    ruleCategory: 'rovidules',
    options: [
      { id: 'a', text: 'szénpor', isCorrect: false },
      { id: 'b', text: 'jobbra [jobra]', isCorrect: true },
      { id: 'c', text: 'adja', isCorrect: false },
      { id: 'd', text: 'azzal', isCorrect: false },
    ],
    explanation: 'A „jobb + ra” szóban a hosszú „bb” után egy másik mássalhangzó (r) áll. A beszédben a hosszú bb megrövidül [jobra], de írásban megtartjuk a dupla bb-t.',
    hint: 'Keresd a szót, amiben egy hosszú (kettőzött) mássalhangzó mellett egy másik mássalhangzó áll!'
  },
  {
    id: 8,
    part: 'quiz',
    title: '8. Kvíz: Mássalhangzó-kiesés',
    subtitle: 'Három mássalhangzó már túl sok a nyelvünknek!',
    prompt: 'Miért ejtjük a „mondta” szót [monta]-nak?',
    word: 'mondta',
    pronunciation: '[monta]',
    ruleCategory: 'kieses',
    options: [
      { id: 'a', text: 'Mert három mássalhangzó (n+d+t) torlódásakor a középső „d” kiesik a kiejtésben', isCorrect: true },
      { id: 'b', text: 'Mert a „t” átalakul „d”-vé', isCorrect: false },
      { id: 'c', text: 'Mert ez képzés helye szerinti hasonulás', isCorrect: false },
      { id: 'd', text: 'Mert az n és d összeolvadt', isCorrect: false },
    ],
    explanation: 'Három egymás melletti mássalhangzó (n-d-t) közül a középső „d” kiejtéskor kiesik a könnyebb beszéd érdekében: [monta]. Ez a mássalhangzó-kiesés.',
    hint: 'Három mássalhangzó találkozik, és a középső eltűnik a kiejtésben!'
  },
  {
    id: 9,
    part: 'quiz',
    title: '9. Kvíz: Összetett felismerés',
    subtitle: 'Nézd meg alaposan a szót!',
    prompt: 'Milyen törvény érvényesül a „kétszáz” szóban [kécczáz]?',
    word: 'kétszáz',
    pronunciation: '[kécczáz]',
    ruleCategory: 'osszeolvadas',
    options: [
      { id: 'a', text: 'Összeolvadás (t + sz → [cc])', isCorrect: true },
      { id: 'b', text: 'Zöngésedés', isCorrect: false },
      { id: 'c', text: 'Mássalhangzó-kiesés', isCorrect: false },
      { id: 'd', text: 'Írásban jelölt teljes hasonulás', isCorrect: false },
    ],
    explanation: 'A „két” és a „száz” összetételében a „t” és „sz” hangok találkoznak. A kiejtésben egy harmadik, hosszú hang keletkezik: [cc]. Ez összeolvadás!',
    hint: 't + sz = [cc] (hosszú c hang)!'
  },
  {
    id: 10,
    part: 'quiz',
    title: '10. Kvíz: A zöngésségi párkereső',
    subtitle: '10. kérdés – Utána jön az első Bónusz Kihívás!',
    prompt: 'Melyik állítás IGAZ a zöngés és zöngétlen mássalhangzókra?',
    word: 'párok',
    ruleCategory: 'reszleges_zongesseg',
    options: [
      { id: 'a', text: 'A „d” zöngétlen párja a „t”, a „g” zöngétlen párja pedig a „k”', isCorrect: true },
      { id: 'b', text: 'A magyar nyelvben minden mássalhangzónak van zöngés párja', isCorrect: false },
      { id: 'c', text: 'Az „m”, „n”, „l”, „r” hangok zöngétlenek', isCorrect: false },
      { id: 'd', text: 'A „z” hang zöngétlen, a „sz” pedig zöngés', isCorrect: false },
    ],
    explanation: 'A d-t és g-k valódi zöngésségi párok! Az m, n, ny, l, r, j hangoknak (páratlan zöngések) nincs zöngétlen párjuk, a h-nak (páratlan zöngétlen) pedig nincs zöngés párja.',
    hint: 'Tedd a kezed a gégédre: „d” és „g” ejtésekor rezeg (zöngés), „t” és „k” ejtésekor nem rezeg (zöngétlen)!'
  },

  // ==========================================
  // 2. RÉSZ: HELYESÍRÁSI FELADATOK (11 - 20)
  // Kiejtés vs Íráskép, mondatba illesztés
  // ==========================================
  {
    id: 11,
    part: 'spelling',
    title: '11. Helyesírás: Kiejtés vs. Írásmód',
    subtitle: 'Válaszd ki a helyes írásmódot!',
    prompt: 'Hogyan írjuk helyesen a mondatba illő szót?',
    spellingContext: 'A tanító néni kedvesen ___ a diákok kérdéseit.',
    spellingChoices: ['meghalgatja', 'meghallgatja', 'meghalggattya', 'meghallgattya'],
    ruleCategory: 'rovidules',
    options: [
      { id: 'a', text: 'meghalgatja', isCorrect: false },
      { id: 'b', text: 'meghallgatja', isCorrect: true },
      { id: 'c', text: 'meghalggattya', isCorrect: false },
      { id: 'd', text: 'meghallgattya', isCorrect: false },
    ],
    explanation: 'A „hallgat” alapige két l-lel írandó (a g előtt kiejtésben megrövidül: [halgat]), a toldalék pedig -ja (írásban jelöletlen teljes hasonulás: [meghallgaccsa/meghallgattya]), de helyesen: meghallgatja!',
    hint: 'A szóelemzés elve: meg + hallgat + ja'
  },
  {
    id: 12,
    part: 'spelling',
    title: '12. Helyesírás: Összeolvadás a felszólításban',
    subtitle: 'Figyelj a jeles alakokra!',
    prompt: 'Melyik alak a helyes az alábbi mondatban?',
    spellingContext: 'Kérlek, ___ ide a tollat az asztalról!',
    spellingChoices: ['aggyad', 'add', 'adgyad', 'agyd'],
    ruleCategory: 'teljes_irasban_jelolt',
    options: [
      { id: 'a', text: 'aggyad', isCorrect: false },
      { id: 'b', text: 'add', isCorrect: true },
      { id: 'c', text: 'adgyad', isCorrect: false },
      { id: 'd', text: 'adjad', isCorrect: false },
    ],
    explanation: 'Az „ad” ige felszólító alakja határozott ragozásban: „add” (ad + j → add, írásban jelölt teljes hasonulás), vagy „add ide”!',
    hint: 'Az „ad” felszólító módja két d-vel írandó: add!'
  },
  {
    id: 13,
    part: 'spelling',
    title: '13. Helyesírás: -val, -vel ragos alakok',
    subtitle: 'Írásban jelölt teljes hasonulás a gyakorlatban',
    prompt: 'Hogyan írjuk helyesen a „kés + vel” toldalékos alakot?',
    spellingContext: 'Peti óvatosan vágta a kenyeret az éles ___.',
    spellingChoices: ['késvel', 'késsel', 'késszel', 'késel'],
    ruleCategory: 'teljes_irasban_jelolt',
    options: [
      { id: 'a', text: 'késvel', isCorrect: false },
      { id: 'b', text: 'késsel', isCorrect: true },
      { id: 'c', text: 'késszel', isCorrect: false },
      { id: 'd', text: 'késel', isCorrect: false },
    ],
    explanation: 'A -val/-vel rag v hangja mássalhangzóra végződő szótő után mindig teljesen hasonul az utolsó mássalhangzóhoz, így „kés + vel = késsel”.',
    hint: 'A v betű s-sé válik: kés + vel → késsel'
  },
  {
    id: 14,
    part: 'spelling',
    title: '14. Helyesírás: Mássalhangzó-kiesés',
    subtitle: 'A kiejtés becsapós, a szótő segít!',
    prompt: 'Válaszd ki a helyes írásmódot a pontozott helyre!',
    spellingContext: 'A postás már reggel ___ a fontos levelet.',
    spellingChoices: ['kikülte', 'kiküldte', 'kikültte', 'kiküldt-e'],
    ruleCategory: 'kieses',
    options: [
      { id: 'a', text: 'kikülte', isCorrect: false },
      { id: 'b', text: 'kiküldte', isCorrect: true },
      { id: 'c', text: 'kikültte', isCorrect: false },
      { id: 'd', text: 'kiküldt-e', isCorrect: false },
    ],
    explanation: 'Bár kiejtésben [külte]-t mondunk a d kiesése miatt, a szótő a „küld”, a múlt idő jele a „-t-”, a személyrag az „-e”, tehát helyesen: „kiküldte”.',
    hint: 'Szótő: küld. Múlt idő jele: -t-. Ne hagyd ki a d-t az írásból!'
  },
  {
    id: 15,
    part: 'spelling',
    title: '15. Helyesírás: Képzés helye szerinti hasonulás',
    subtitle: 'N vagy M betűt írjunk?',
    prompt: 'Melyik szó helyesírása HIBÁTLAN az alábbiak közül?',
    spellingContext: 'A műsor ___ sok néző gyűlt össze.',
    spellingChoices: ['azonban', 'azomban', 'azommbann', 'azombann'],
    ruleCategory: 'reszleges_kepzes_helye',
    options: [
      { id: 'a', text: 'azonban', isCorrect: true },
      { id: 'b', text: 'azomban', isCorrect: false },
      { id: 'c', text: 'azommbann', isCorrect: false },
      { id: 'd', text: 'azombann', isCorrect: false },
    ],
    explanation: 'A b előtt az n hang [m]-nek hallatszik ([azomban]), de a szóelemző írásmód szerint „n”-nel írjuk: „azonban” (az + on + ban).',
    hint: 'Kiejtésben [m], de írásban mindig „n”: azonban!'
  },
  {
    id: 16,
    part: 'spelling',
    title: '16. Helyesírás: Birtokos személyjel és a J hang',
    subtitle: 'Gyakori hibaforrás dolgozatban!',
    prompt: 'Melyik a helyes leírt alak?',
    spellingContext: 'Bence büszke a ___ szerzett jó jegyére.',
    spellingChoices: ['báttyától', 'bátyjától', 'bátyjátol', 'bátyától'],
    ruleCategory: 'osszeolvadas',
    options: [
      { id: 'a', text: 'báttyától', isCorrect: false },
      { id: 'b', text: 'bátyjától', isCorrect: true },
      { id: 'c', text: 'bátyjátol', isCorrect: false },
      { id: 'd', text: 'bátyától', isCorrect: false },
    ],
    explanation: 'Kiejtésben [báttyától]-t ejtünk az összeolvadás (ty + j → [tty]) miatt, de a szótő a „báty” és a birtokjel a „-ja”, így helyesen: „bátyjától”.',
    hint: 'Báty + ja + tól = bátyjától!'
  },
  {
    id: 17,
    part: 'spelling',
    title: '17. Helyesírás: Egészség és betegség',
    subtitle: 'Írásban jelöletlen hasonulás',
    prompt: 'Melyik szó írásképe helyes?',
    spellingContext: 'A sportolás nagyon fontos a jó ___ megőrzéséhez.',
    spellingChoices: ['egésség', 'egészség', 'egésszég', 'egésséghez'],
    ruleCategory: 'teljes_irasban_jeloletlen',
    options: [
      { id: 'a', text: 'egésség', isCorrect: false },
      { id: 'b', text: 'egészség', isCorrect: true },
      { id: 'c', text: 'egésszég', isCorrect: false },
      { id: 'd', text: 'egéség', isCorrect: false },
    ],
    explanation: 'A szó az „egész” szótőből és a „-ség” képzőből áll. Kiejtésben [egésszég], de leírva: „egészség”.',
    hint: 'Egész + ség = egészség!'
  },
  {
    id: 18,
    part: 'spelling',
    title: '18. Helyesírás: Rövidülés a toldalékoláskor',
    subtitle: 'Jobbra vagy jobra?',
    prompt: 'Melyik mondatban írtuk HELYESEN a vastag betűs szót?',
    spellingContext: 'Kanyarodj az első utcánál ___ !',
    spellingChoices: ['jobbra', 'jobra', 'jobb-ra', 'job-bra'],
    ruleCategory: 'rovidules',
    options: [
      { id: 'a', text: 'jobbra', isCorrect: true },
      { id: 'b', text: 'jobra', isCorrect: false },
      { id: 'c', text: 'jobb-ra', isCorrect: false },
      { id: 'd', text: 'job-bra', isCorrect: false },
    ],
    explanation: 'A „jobb” szótőben két b van. Bár az „r” előtt a kiejtésben megrövidül [jobra], az írásképben kötelező kitenni a két b-t: „jobbra”.',
    hint: 'Szótő: jobb + határozórag: -ra = jobbra.'
  },
  {
    id: 19,
    part: 'spelling',
    title: '19. Helyesírás: Összeolvadás a számnévben',
    subtitle: 'Hány száz?',
    prompt: 'Melyik szó írása helyes?',
    spellingContext: 'A könyvtárban több mint ___ könyv található.',
    spellingChoices: ['ötszáz', 'öccszáz', 'öccáz', 'öts-száz'],
    ruleCategory: 'osszeolvadas',
    options: [
      { id: 'a', text: 'ötszáz', isCorrect: true },
      { id: 'b', text: 'öccszáz', isCorrect: false },
      { id: 'c', text: 'öccáz', isCorrect: false },
      { id: 'd', text: 'öts-száz', isCorrect: false },
    ],
    explanation: 'Az „öt” és a „száz” összetétele. A „t + sz” a beszédben összeolvad [öccáz]-zá, de leírva marad az eredeti összetétel: „ötszáz”.',
    hint: 'Öt + száz = ötszáz'
  },
  {
    id: 20,
    part: 'spelling',
    title: '20. Helyesírás: Felszólító mód a -szt végű igéknél',
    subtitle: '20. kérdés – Utána jön a 2. Bónusz Kihívás!',
    prompt: 'Hogyan írjuk helyesen a „fest” ige felszólító alakját többes szám 1. személyben?',
    spellingContext: 'Gyere, ___ ki együtt ezt a szép képet!',
    spellingChoices: ['fessük', 'fesstük', 'festjük', 'fessyük'],
    ruleCategory: 'teljes_irasban_jelolt',
    options: [
      { id: 'a', text: 'festjük', isCorrect: false },
      { id: 'b', text: 'fessük', isCorrect: true },
      { id: 'c', text: 'fesstük', isCorrect: false },
      { id: 'd', text: 'fessyük', isCorrect: false },
    ],
    explanation: 'A -st, -szt végű igék felszólító alakjában írásban jelölt teljes hasonulás történik: fest + jük → fessük!',
    hint: 'A fest igéből felszólításkor „fessük” lesz (két s-sel)!'
  },

  // ==========================================
  // 3. RÉSZ: KAKUKKTOJÁS - HIBAKERESŐS (21 - 30)
  // Melyik lóg ki a csoportból és miért?
  // ==========================================
  {
    id: 21,
    part: 'oddoneout',
    title: '21. Kakukktojás: Hangtörvény szerinti csoportosítás',
    subtitle: 'Keresd a kakukktojást!',
    prompt: 'Melyik szó a KAKUKKTOJÁS az alábbi négy közül a mássalhangzótörvény szempontjából?',
    options: [
      { id: 'a', text: 'vasgolyó', isCorrect: false },
      { id: 'b', text: 'népdal', isCorrect: false },
      { id: 'c', text: 'színpad', isCorrect: true },
      { id: 'd', text: 'lökdös', isCorrect: false },
    ],
    explanation: 'A „színpad” a kakukktojás! A vasgolyó, népdal és lökdös szavakban ZÖNGÉSSÉGI részleges hasonulás történik, míg a színpadban KÉPZÉS HELYE szerinti hasonulás (n+p → [mp]).',
    oddReason: 'A színpad képzés helye szerinti hasonulás, a többi három zöngésségi hasonulás.'
  },
  {
    id: 22,
    part: 'oddoneout',
    title: '22. Kakukktojás: Összeolvadás vs. Hasonulás',
    subtitle: 'Egyik szóban nem olvadnak össze a hangok!',
    prompt: 'Melyik szóban NEM történik összeolvadás?',
    options: [
      { id: 'a', text: 'barátság [baráccság]', isCorrect: false },
      { id: 'b', text: 'kétszáz [kécczáz]', isCorrect: false },
      { id: 'c', text: 'látja [láttya]', isCorrect: false },
      { id: 'd', text: 'azzal [azzal]', isCorrect: true },
    ],
    explanation: 'Az „azzal” a kakukktojás! Ebben írásban jelölt teljes hasonulás történt (az + val → azzal), míg a másik három szóban összeolvadás történik (t+s→[ccs], t+sz→[cc], t+j→[tty]).',
    oddReason: 'Az azzal teljes hasonulás, a többiek összeolvadások.'
  },
  {
    id: 23,
    part: 'oddoneout',
    title: '23. Hibakereső: Melyik szó van HIBÁSAN leírva?',
    subtitle: 'Találd meg a helyesírási bakit!',
    prompt: 'A négy szó közül melyiket írtuk helytelenül (kiejtés szerint)?',
    options: [
      { id: 'a', text: 'mondta', isCorrect: false },
      { id: 'b', text: 'különben', isCorrect: false },
      { id: 'c', text: 'haggya', isCorrect: true },
      { id: 'd', text: 'hallgat', isCorrect: false },
    ],
    explanation: 'A „haggya” hibás! Bár kiejtésben [haggya]-nak mondjuk, helyesen „hagyja” (gy + j) alakban kell írni!',
    oddReason: 'Helytelen a „haggya”, helyesen: hagyja!'
  },
  {
    id: 24,
    part: 'oddoneout',
    title: '24. Kakukktojás: Mássalhangzó-kiesés',
    subtitle: 'Melyikben nem esik ki hang?',
    prompt: 'Melyik szóban NEM történik mássalhangzó-kiesés kiejtéskor?',
    options: [
      { id: 'a', text: 'mondta [monta]', isCorrect: false },
      { id: 'b', text: 'küldte [külte]', isCorrect: false },
      { id: 'c', text: 'mindnyájan [minnyájan]', isCorrect: false },
      { id: 'd', text: 'otthon [othon]', isCorrect: true },
    ],
    explanation: 'Az „otthon” a kakukktojás! Az otthon szóban mássalhangzó-RÖVIDÜLÉS van (a hosszú tt után h áll: [othon]), míg a másik háromban mássalhangzó-KIESÉS van.',
    oddReason: 'Az otthon rövidülés, nem pedig kiesés.'
  },
  {
    id: 25,
    part: 'oddoneout',
    title: '25. Hibakereső: Félrevezető betűk',
    subtitle: 'Keresd a hibás szót a felsorolásból!',
    prompt: 'Melyik szó helyesírása HIBÁS az alábbiak közül?',
    options: [
      { id: 'a', text: 'jobbra', isCorrect: false },
      { id: 'b', text: 'kéccáz', isCorrect: true },
      { id: 'c', text: 'egészség', isCorrect: false },
      { id: 'd', text: 'barátság', isCorrect: false },
    ],
    explanation: 'A „kéccáz” hibás! Kiejtés szerint van leírva. Helyesen „kétszáz” (két + száz, összeolvadás).',
    oddReason: 'Helyesen kétszáz, nem kéccáz.'
  },
  {
    id: 26,
    part: 'oddoneout',
    title: '26. Kakukktojás: Zöngésedés vs. Zöngétlenedés',
    subtitle: 'Ki változik és mivé?',
    prompt: 'Melyik szóban történik ZÖNGÉSEDÉS (zöngétlenből zöngés), míg a többiben zöngétlenedés?',
    options: [
      { id: 'a', text: 'népdal [nébdal]', isCorrect: true },
      { id: 'b', text: 'dobtam [doptam]', isCorrect: false },
      { id: 'c', text: 'vágta [vákta]', isCorrect: false },
      { id: 'd', text: 'mézcsupor [mészcsupor]', isCorrect: false },
    ],
    explanation: 'A „népdal” szóban a zöngétlen p hang a zöngés d előtt zöngéssé válik: [nébdal] (zöngésedés). A másik háromban a zöngés hang zöngétlenné válik (zöngétlenedés).',
    oddReason: 'Népdal: zöngésedés. Dobtam, vágta, mézcsupor: zöngétlenedés.'
  },
  {
    id: 27,
    part: 'oddoneout',
    title: '27. Kakukktojás: Jelölt vs. Jelöletlen teljes hasonulás',
    subtitle: 'Nézd meg, látszik-e az írásban a hasonulás!',
    prompt: 'Melyik szóban történik ÍRÁSBAN JELÖLETLEN teljes hasonulás (a másik három jelölt)?',
    options: [
      { id: 'a', text: 'ebben (ez + ben)', isCorrect: false },
      { id: 'b', text: 'virággal (virág + val)', isCorrect: false },
      { id: 'c', text: 'moss (mos + j)', isCorrect: false },
      { id: 'd', text: 'anyja [annya] (anya + ja)', isCorrect: true },
    ],
    explanation: 'Az „anyja” jelöletlen teljes hasonulás (kiejtésben [annya], de írásban ny+j marad). Az „ebben”, „virággal” és „moss” szavakban írásban jelölt a hasonulás (kettőzött bb, gg, ss betűvel).',
    oddReason: 'Az anyja írásban jelöletlen, a többi három írásban jelölt teljes hasonulás.'
  },
  {
    id: 28,
    part: 'oddoneout',
    title: '28. Hibakereső: Mondatbeli hiba',
    subtitle: 'Melyik szó rontja el a mondatot?',
    prompt: 'Melyik szó van hibásan leírva a következő mondatban: „A kirándulók bátran másztak fel a hegyre a sziklák közt, és megnézték a fenséges naplementét.”',
    options: [
      { id: 'a', text: 'kirándulók', isCorrect: false },
      { id: 'b', text: 'bátran', isCorrect: false },
      { id: 'c', text: 'Mindegyik szó helyesen van leírva!', isCorrect: true },
      { id: 'd', text: 'fenséges', isCorrect: false },
    ],
    explanation: 'Cseles feladvány! A mondatban minden szó teljesen szabályosan és helyesen van leírva (kirándulók, másztak, közt, megnézték, fenséges).',
    oddReason: 'Nincs hiba a mondatban, minden szó helyes.'
  },
  {
    id: 29,
    part: 'oddoneout',
    title: '29. Kakukktojás: Szabályos kiejtés',
    subtitle: 'Keresd a kivételt!',
    prompt: 'Melyik szóban NEM érvényesül a képzés helye szerinti részleges hasonulás?',
    options: [
      { id: 'a', text: 'különben [külömben]', isCorrect: false },
      { id: 'b', text: 'szénpor [szémpor]', isCorrect: false },
      { id: 'c', text: 'azonban [azomban]', isCorrect: false },
      { id: 'd', text: 'kandalló [kandalló]', isCorrect: true },
    ],
    explanation: 'A „kandalló” szóban az „n” után „d” áll (nem „p” vagy „b”), ezért nincs képzés helye szerinti hasonulás, marad [n]. A másik három szóban n+p vagy n+b áll, így [m]-et ejtünk.',
    oddReason: 'A kandallóban n+d áll, a többiben n+p vagy n+b van.'
  },
  {
    id: 30,
    part: 'oddoneout',
    title: '30. Záró Kvíz: A végső kakukktojás',
    subtitle: '30. kérdés – Teljesítetted az alapkérdéseket!',
    prompt: 'Melyik szó lóg ki a csoportból a mássalhangzó-kapcsolatok alapján?',
    options: [
      { id: 'a', text: 'szebbre [szebre]', isCorrect: false },
      { id: 'b', text: 'jobbra [jobra]', isCorrect: false },
      { id: 'c', text: 'hallgat [halgat]', isCorrect: false },
      { id: 'd', text: 'mondta [monta]', isCorrect: true },
    ],
    explanation: 'A „mondta” a kakukktojás! Ebben mássalhangzó-KIESÉS van (a d kiesik), míg a szebbre, jobbra és hallgat szavakban mássalhangzó-RÖVIDÜLÉS történik (hosszú bb és ll után mássalhangzó áll).',
    oddReason: 'A mondta kiesés, a másik három szó rövidülés.'
  }
];

export const BONUS_CHALLENGES: BonusChallenge[] = [
  {
    id: 1,
    afterQuestionNumber: 10,
    title: '🌟 1. BÓNUSZ MESTERFELADAT (+10 pont)',
    subtitle: 'Hangtörvény-Kódfejtő Bajnokság',
    points: 10,
    description: 'Párosítsd a szavakat a megfelelő mássalhangzótörvénnyel! Ha mind a 4 párosítás helyes, azonnal megkapod a +10 bónuszpontot!',
    taskType: 'sort_rules',
    data: {
      pairs: [
        { word: 'vasgolyó', ruleId: 'reszleges_zongesseg', ruleLabel: 'Zöngésségi hasonulás (s+g → [zsg])' },
        { word: 'színpad', ruleId: 'reszleges_kepzes_helye', ruleLabel: 'Képzés helye szerinti (n+p → [mp])' },
        { word: 'barátság', ruleId: 'osszeolvadas', ruleLabel: 'Összeolvadás (t+s → [ccs])' },
        { word: 'vízzé', ruleId: 'teljes_irasban_jelolt', ruleLabel: 'Írásban jelölt teljes hasonulás (víz+vé)' }
      ]
    },
    explanation: 'Gratulálunk! A vasgolyó zöngésségi hasonulás, a színpad képzés helye szerinti hasonulás, a barátság összeolvadás, a vízzé pedig írásban jelölt teljes hasonulás.'
  },
  {
    id: 2,
    afterQuestionNumber: 20,
    title: '🕵️‍♂️ 2. BÓNUSZ MESTERFELADAT (+10 pont)',
    subtitle: 'Nyelvtan Nyomozó: Találd meg a 3 hibát!',
    points: 10,
    description: 'Egy 5. osztályos diák fogalmazásában 3 szó hibásan, kiejtés szerint lett leírva. Kattints a 3 hibás szóra a javításhoz!',
    taskType: 'sentence_correction',
    data: {
      words: [
        { id: 'w1', text: 'Tegnap', isError: false },
        { id: 'w2', text: 'délután', isError: false },
        { id: 'w3', text: 'Peti', isError: false },
        { id: 'w4', text: 'megmongya', isError: true, correction: 'megmondja' },
        { id: 'w5', text: 'a', isError: false },
        { id: 'w6', text: 'titkát,', isError: false },
        { id: 'w7', text: 'majd', isError: false },
        { id: 'w8', text: 'jobra', isError: true, correction: 'jobbra' },
        { id: 'w9', text: 'fordult,', isError: false },
        { id: 'w10', text: 'és', isError: false },
        { id: 'w11', text: 'kikülte', isError: true, correction: 'kiküldte' },
        { id: 'w12', text: 'a', isError: false },
        { id: 'w13', text: 'levelet.', isError: false }
      ],
      requiredCount: 3
    },
    explanation: 'Szuper nyomozás! A három hibás szó: „megmongya” (helyesen: megmondja), „jobra” (helyesen: jobbra) és „kikülte” (helyesen: kiküldte).'
  },
  {
    id: 3,
    afterQuestionNumber: 30,
    title: '👑 3. NAGY ZÁRÓ MESTERKIHÍVÁS (+10 pont)',
    subtitle: 'A Mássalhangzótörvények Nagymestere!',
    points: 10,
    description: 'Döntsd el, hogy az alábbi 4 állítás IGAZ vagy HAMIS! Ha mind a 4 állítást eltalálod, tiéd a maximális +10 bónuszpont!',
    taskType: 'riddle_match',
    data: {
      statements: [
        { id: 's1', text: 'A „mondta” szóban kiejtéskor a középső „d” mássalhangzó kiesik.', isTrue: true, explanation: 'Igaz: mondta kiejtése [monta], a d kiesik.' },
        { id: 's2', text: 'A „-val, -vel” rag v betűje soha nem változik meg írásban.', isTrue: false, explanation: 'Hamis: mássalhangzó után teljesen hasonul (pl. késsel, fával, kővel).' },
        { id: 's3', text: 'A „színpad” szóban [szímpad]-ot ejtünk, mert p előtt az n helyett m hangot mondunk.', isTrue: true, explanation: 'Igaz: képzés helye szerinti hasonulás.' },
        { id: 's4', text: 'A „barátság” és a „látja” szavakban írásban jelölt teljes hasonulás történik.', isTrue: false, explanation: 'Hamis: mindkettőben összeolvadás történik (t+s→[ccs], t+j→[tty]).' }
      ]
    },
    explanation: 'Fantasztikus tudás! Mind a 4 nyelvtani állítást helyesen ítélted meg!'
  }
];
