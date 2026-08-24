import { GrammarRuleInfo } from '../types';

export const CONSONANT_PAIRS = [
  { voiced: 'b', unvoiced: 'p', label: 'b ↔ p' },
  { voiced: 'd', unvoiced: 't', label: 'd ↔ t' },
  { voiced: 'g', unvoiced: 'k', label: 'g ↔ k' },
  { voiced: 'z', unvoiced: 'sz', label: 'z ↔ sz' },
  { voiced: 'zs', unvoiced: 's', label: 'zs ↔ s' },
  { voiced: 'v', unvoiced: 'f', label: 'v ↔ f' },
  { voiced: 'dz', unvoiced: 'c', label: 'dz ↔ c' },
  { voiced: 'dzs', unvoiced: 'cs', label: 'dzs ↔ cs' },
  { voiced: 'gy', unvoiced: 'ty', label: 'gy ↔ ty' },
];

export const UNPAIRED_CONSONANTS = {
  voicedOnly: ['m', 'n', 'ny', 'l', 'r', 'j (ly)'],
  unvoicedOnly: ['h'],
};

export const GRAMMAR_RULES: GrammarRuleInfo[] = [
  {
    id: 'reszleges_zongesseg',
    name: 'Zöngésség szerinti részleges hasonulás',
    shortName: 'Zöngésségi hasonulás',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    definition: 'Amikor két egymás melletti mássalhangzó közül az egyik zöngés, a másik zöngétlen, akkor a második hang zöngésség szempontjából megváltoztatja az elsőt.',
    formula: 'zöngétlen + zöngés → [zöngés + zöngés] vagy zöngés + zöngétlen → [zöngétlen + zöngétlen]',
    examples: [
      { written: 'vasgolyó', pronounced: '[vazsgolyó]', breakdown: 's (zöngétlen) + g (zöngés) → [zs + g] (zöngésedés)' },
      { written: 'dobtam', pronounced: '[doptam]', breakdown: 'b (zöngés) + t (zöngétlen) → [p + t] (zöngétlenedés)' },
      { written: 'képkeret', pronounced: '[képkeret]', breakdown: 'nincs változás (mindkettő zöngétlen)' },
      { written: 'mézcsupor', pronounced: '[mészcsupor]', breakdown: 'z (zöngés) + cs (zöngétlen) → [sz + cs] (zöngétlenedés)' }
    ],
    tip: 'Jegyezd meg: mindig a MÁSODIK mássalhangzó a "főnök", ő alakítja át az előtte lévőt!'
  },
  {
    id: 'reszleges_kepzes_helye',
    name: 'Képzés helye szerinti részleges hasonulás',
    shortName: 'Képzés helye szerinti',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    definition: 'Amikor az "n" hang "p" vagy "b" mássalhangzó elé kerül, a kiejtésben "m" hanggá változik.',
    formula: 'n + b → [mb] vagy n + p → [mp]',
    examples: [
      { written: 'színpad', pronounced: '[szímpad]', breakdown: 'n + p → [mp]' },
      { written: 'különben', pronounced: '[külömben]', breakdown: 'n + b → [mb]' },
      { written: 'azonban', pronounced: '[azomban]', breakdown: 'n + b → [mb]' },
      { written: 'szénpor', pronounced: '[szémpor]', breakdown: 'n + p → [mp]' }
    ],
    tip: 'P és B előtt az N ajakhanggá alakul, így [m]-et mondunk, de n-nel írjuk!'
  },
  {
    id: 'teljes_irasban_jelolt',
    name: 'Írásban jelölt teljes hasonulás',
    shortName: 'Jelölt teljes hasonulás',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    definition: 'Két mássalhangzó találkozásakor az egyik teljesen azonossá válik a másikkal, és ezt ÍRÁSBAN IS JELÖLJÜK (kettőzött mássalhangzót írunk).',
    formula: 'pl. ez + nek → ennek; virág + val → virággal',
    examples: [
      { written: 'azzal', pronounced: '[azzal]', breakdown: 'az + val → azzal (v hasonult z-hez)' },
      { written: 'késsel', pronounced: '[késsel]', breakdown: 'kés + vel → késsel (v hasonult s-hez)' },
      { written: 'vízzé', pronounced: '[vízzé]', breakdown: 'víz + vé → vízzé' },
      { written: 'moss', pronounced: '[moss]', breakdown: 'mos + j → moss' }
    ],
    tip: 'A -val/-vel és -vá/-vé ragok v-je mindig teljesen hasonul a szóvégi mássalhangzóhoz!'
  },
  {
    id: 'teljes_irasban_jeloletlen',
    name: 'Írásban jelöletlen teljes hasonulás',
    shortName: 'Jelöletlen teljes hasonulás',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    definition: 'Két különböző mássalhangzó a kiejtésben teljesen azonossá válik, de ÍRÁSBAN NEM JELÖLJÜK (az eredeti betűket írjuk le).',
    formula: 'pl. hagyja → [haggya]; anyja → [annya]',
    examples: [
      { written: 'hagyja', pronounced: '[haggya]', breakdown: 'gy + j → [ggy]' },
      { written: 'anyja', pronounced: '[annya]', breakdown: 'ny + j → [nny]' },
      { written: 'egészség', pronounced: '[egésszég]', breakdown: 'sz + s → [ssz]' },
      { written: 'község', pronounced: '[közzség]', breakdown: 'z + s → [zzs]' }
    ],
    tip: 'Figyelj a gy+j és ny+j kapcsolatokra: kiejtésben [ggy] és [nny], de írásban gy+j és ny+j!'
  },
  {
    id: 'osszeolvadas',
    name: 'Összeolvadás',
    shortName: 'Összeolvadás',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    definition: 'Két különböző mássalhangzó helyett a kiejtésben egy harmadik, HOSSZÚ mássalhangzót ejtünk.',
    formula: 'd/t + s → [ccs]; d/t + sz → [cc]; d/t + j → [ggy]/[tty]',
    examples: [
      { written: 'barátság', pronounced: '[baráccság]', breakdown: 't + s → [ccs]' },
      { written: 'szabadság', pronounced: '[szabaccság]', breakdown: 'd + s → [ccs]' },
      { written: 'kétszáz', pronounced: '[kécczáz]', breakdown: 't + sz → [cc]' },
      { written: 'látja', pronounced: '[láttya]', breakdown: 't + j → [tty]' },
      { written: 'adja', pronounced: '[aggya]', breakdown: 'd + j → [ggy]' },
      { written: 'tanítja', pronounced: '[taníttya]', breakdown: 't + j → [tty]' }
    ],
    tip: 'Két betűből egy vadonatúj hang (pl. cs, c, ty, gy) születik!'
  },
  {
    id: 'rovidules',
    name: 'Mássalhangzó-rövidülés',
    shortName: 'Rövidülés',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    definition: 'Egy hosszú mássalhangzót egy másik mássalhangzó mellett a beszédben RÖVIDEN ejtünk, de írásban HOSSZAN jelöljük.',
    formula: 'hosszú Msh. + Msh. → [rövid Msh. + Msh.]',
    examples: [
      { written: 'jobbra', pronounced: '[jobra]', breakdown: 'bb + r → [b + r]' },
      { written: 'szebbre', pronounced: '[szebre]', breakdown: 'bb + r → [b + r]' },
      { written: 'otthon', pronounced: '[othon]', breakdown: 'tt + h → [t + h]' },
      { written: 'hallgat', pronounced: '[halgat]', breakdown: 'll + g → [l + g]' },
      { written: 'varrtam', pronounced: '[vartam]', breakdown: 'rr + t → [r + t]' }
    ],
    tip: 'Bár röviden mondjuk, a szótő vagy a toldalék miatt mindig hosszan írjuk (pl. jobb + ra)!'
  },
  {
    id: 'kieses',
    name: 'Mássalhangzó-kiesés',
    shortName: 'Kiesés',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    definition: 'Három egymás mellé kerülő mássalhangzó közül a középső a kiejtésben teljesen KIMARAD a könnyebb kiejtés miatt.',
    formula: 'Msh.1 + Msh.2 + Msh.3 → [Msh.1 + Msh.3]',
    examples: [
      { written: 'mondta', pronounced: '[monta]', breakdown: 'n + d + t → [n + t] (a d kiesik és d zöngétlenedik)' },
      { written: 'küldte', pronounced: '[külte]', breakdown: 'l + d + t → [l + t] (a d kiesik)' },
      { written: 'mindnyájan', pronounced: '[minnyájan]', breakdown: 'n + d + ny → [n + ny] (a d kiesik)' },
      { written: 'csukd be', pronounced: '[csugbe]', breakdown: 'k + d + b → a kiejtésben a d kihullik' }
    ],
    tip: 'Gyakran a "d" vagy "t" hang esik ki 3 mássalhangzó torlódásakor!'
  }
];
