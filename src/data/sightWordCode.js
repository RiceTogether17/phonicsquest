/**
 * PhonicsQuest – what is tricky about each sight word (VALIDITY_ROADMAP 1.3)
 *
 * The sight-word bank was 470 bare strings. Most "sight words" are not
 * irregular at all: "day", "white", "name" and "story" follow the rules
 * once the child has met ay, i_e, a_e and or. Teaching them as shapes to
 * memorise wastes the phonics the child already has. And the genuinely
 * tricky ones are usually tricky in ONE place — "said" is s and d as
 * normal, with ai saying /e/. That one part is what the child learns by
 * heart ("heart words"); the rest they sound out.
 *
 * Each word below is written as its letter groups, in order:
 *
 *   's ai* d | ai says /e/'
 *
 *   token      one letter group (a grapheme)
 *   token*     the tricky part — it does not make its usual sound
 *   token~     a regular but later sound: a long vowel on its own (go, find),
 *              soft c / g (city, page), ow as in cow, short oo (book), y as
 *              a vowel (fly, happy)
 *   token@     an unstressed "uh" vowel in a longer word (a·bout)
 *   e_         the silent e of a split digraph (m·a·d·e_)
 *   -token     a suffix (-ing, -ed, -s, -ly)
 *   | note     what the tricky part does, in a child's words
 *
 * The groups must spell the word exactly (tested). From them the module
 * works out the phase in which a word with no tricky part becomes fully
 * decodable, so that number is computed from the curriculum's own order,
 * not typed in.
 *
 * The 50 hard-tier words (accommodate, conscience…) are spelling demons for
 * P4–P6, not early reading, and are deliberately not described here.
 */

/** @type {Record<string, string>} */
const SPECS = {
  // ── Quests 1–10 ─────────────────────────────────────────────────────────
  a: 'a* | on its own, a says /uh/',
  it: 'i t',
  on: 'o n',
  the: 'th e* | e says /uh/',
  not: 'n o t',
  then: 'th e n',
  of: 'o* f* | o says /u/ and f says /v/',
  in: 'i n',
  his: 'h i s* | s says /z/',
  to: 't o* | o says /oo/',
  he: 'h e* | e says its name, /ē/',
  is: 'i s* | s says /z/',
  so: 's o* | o says its name, /ō/',
  for: 'f or',
  said: 's ai* d | ai says /e/',
  day: 'd ay',
  go: 'g o* | o says its name, /ō/',
  was: 'w a* s* | a says /o/ and s says /z/',
  too: 't oo',
  I: 'I* | always a capital, and it says its name',
  all: 'a* ll | a says /aw/',
  one: 'o* n e* | it says "wun": o makes /w/ and /u/, and the e is silent',
  white: 'wh i t e_',
  now: 'n ow~',
  into: 'i n t o* | o says /oo/, like in "to"',
  again: 'a@ g ai* n | ai says /e/',
  came: 'c a m e_',
  be: 'b e* | e says its name, /ē/',
  do: 'd o* | o says /oo/',
  what: 'wh a* t | a says /o/',
  know: 'k* n ow | the k is silent',
  when: 'wh e n',
  over: 'o~ v er',
  above: 'a@ b o* v e* | o says /u/ and the e is silent',
  there: 'th ere* | ere says /air/',
  were: 'w ere* | ere says /er/',
  she: 'sh e* | e says its name, /ē/',
  are: 'ar e* | the e is silent',
  this: 'th i s',
  her: 'h er',
  about: 'a@ b ou t',
  name: 'n a m e_',
  their: 'th eir* | eir says /air/',
  story: 's t or y~',
  many: 'm a* n y~ | a says /e/',
  some: 's o* m e* | o says /u/ and the e is silent',
  how: 'h ow~',
  also: 'a* l s o~ | a says /aw/',
  does: 'd oe* s* | oe says /u/ and s says /z/',
  want: 'w a* n t | a says /o/',

  // ── Quests 11–85 ────────────────────────────────────────────────────────
  no: 'n o* | o says its name, /ō/',
  me: 'm e* | e says its name, /ē/',
  saw: 's aw',
  two: 't w* o* | the w is silent and o says /oo/',
  out: 'ou t',
  take: 't a k e_',
  find: 'f i~ n d',
  they: 'th ey* | ey says /ay/',
  here: 'h e r e_',
  while: 'wh i l e_',
  see: 's ee',
  would: 'w oul* d | oul says /oo/, as in "book"',
  should: 'sh oul* d | oul says /oo/, as in "book"',
  could: 'c oul* d | oul says /oo/, as in "book"',
  good: 'g oo~ d',
  made: 'm a d e_',
  across: 'a@ c r o ss',
  come: 'c o* m e* | o says /u/ and the e is silent',
  water: 'w a* t er | a says /aw/',
  will: 'w i ll',
  under: 'u n d er',
  from: 'f r o* m | o says /u/',
  cold: 'c o~ l d',
  love: 'l o* v e* | o says /u/; words never end in v, so an e comes after it',
  put: 'p u* t | u says /oo/, as in "book"',
  other: 'o* th er | o says /u/',
  salt: 's a* l t | a says /aw/',
  because: 'b e@ c au* s* e* | au says /o/, s says /z/ and the e is silent',
  upon: 'u@ p o n',
  before: 'b e~ f ore',
  until: 'u n t i l',
  young: 'y ou* ng | ou says /u/',
  you: 'y ou* | ou says /oo/',
  who: 'wh* o* | wh says /h/ and o says /oo/',
  give: 'g i v e* | words never end in v, so an e comes after it — the i stays short',
  mother: 'm o* th er | o says /u/',
  brother: 'b r o* th er | o says /u/',
  something: 's o* m e* th i ng | o says /u/ and the first e is silent',
  become: 'b e~ c o* m e* | o says /u/ and the e is silent',
  wolf: 'w o* l f | o says /oo/, as in "book"',
  just: 'j u s t',
  with: 'w i th',
  must: 'm u s t',
  girl: 'g ir l',
  boy: 'b oy',
  where: 'wh ere* | ere says /air/, as in "there"',
  thought: 'th ough* t | ough says /aw/',
  fast: 'f a s t',
  down: 'd ow~ n',
  watch: 'w a* tch | a says /o/',
  head: 'h ea* d | ea says /e/',
  may: 'm ay',
  friend: 'f r ie* n d | ie says /e/',
  maybe: 'm ay b e~',
  has: 'h a s* | s says /z/',
  have: 'h a v e* | words never end in v, so an e comes after it — the a stays short',
  away: 'a@ w ay',
  way: 'w ay',
  make: 'm a k e_',
  ate: 'a t e_',
  been: 'b ee n',
  same: 's a m e_',
  say: 's ay',
  green: 'g r ee n',
  people: 'p eo* p le | eo says /ee/',
  each: 'ea ch',
  your: 'y our* | our says /or/',
  happy: 'h a pp y~',
  pretty: 'p r e* tt y~ | e says /i/',
  please: 'p l ea s* e* | s says /z/ and the e is silent',
  keep: 'k ee p',
  leave: 'l ea v e* | words never end in v, so an e comes after it',
  these: 'th e s* e_ | s says /z/',
  sea: 's ea',
  flies: 'f l ie -s',
  fly: 'f l y~',
  life: 'l i f e_',
  light: 'l igh t',
  myself: 'm y~ s e l f',
  time: 't i m e_',
  why: 'wh y~',
  fine: 'f i n e_',
  high: 'h igh',
  eye: 'e* y* e* | the whole word says /ī/ — one to know by heart',
  nothing: 'n o* th i ng | o says /u/',
  buy: 'b u* y~ | the u is silent and y says /ī/',
  wrote: 'w* r o t e_ | the w is silent',
  by: 'b y~',
  going: 'g o~ -ing',
  own: 'ow n',
  only: 'o~ n l y~',
  ago: 'a@ g o~',
  very: 'v e r y~',
  though: 'th ough* | ough says /ō/',
  large: 'l ar g~ e_',
  goes: 'g oe -s',
  both: 'b o~ th',
  home: 'h o m e_',
  "don't": "d o* n ' t | o says its name, /ō/",
  any: 'a* n y~ | a says /e/',
  became: 'b e~ c a m e_',
  began: 'b e~ g a n',
  begin: 'b e~ g i n',
  change: 'ch a~ n g~ e_',
  eat: 'ea t',
  few: 'f ew',
  knew: 'k* n ew | the k is silent',
  music: 'm u~ s* i c | s says /z/',
  really: 'r ea l -ly',
  through: 'th r ough* | ough says /oo/',
  place: 'p l a c~ e_',
  move: 'm o* v e* | o says /oo/ and the e is silent',
  brought: 'b r ough* t | ough says /aw/',
  inside: 'i n s i d e_',
  which: 'wh i ch',
  after: 'a f t er',
  always: 'a* l w ay -s | a says /aw/',
  aunty: 'au* n t y~ | au says /ar/',
  work: 'w or* k | after w, or says /er/',
  off: 'o ff',
  behind: 'b e~ h i~ n d',
  body: 'b o d y~',
  family: 'f a m i@ l y~',
  today: 't o@ d ay',
  open: 'o~ p e@ n',
  below: 'b e~ l ow',
  carry: 'c a rr y~',
  finally: 'f i~ n a@ l -ly',
  try: 't r y~',
  along: 'a@ l o ng',
  between: 'b e~ t w ee n',
  easy: 'ea s* y~ | s says /z/',
  funny: 'f u nn y~',
  often: 'o f t* e@ n | the t is silent',
  done: 'd o* n e* | o says /u/ and the e is silent',
  city: 'c~ i t y~',
  eight: 'eigh* t | eigh says /ay/',
  feel: 'f ee l',
  feet: 'f ee t',
  great: 'g r ea* t | ea says /ay/',
  sleep: 's l ee p',
  without: 'w i th ou t',
  kind: 'k i~ n d',
  might: 'm igh t',
  night: 'n igh t',
  nice: 'n i c~ e_',
  once: 'o* n c~ e_ | it says "wunce": o makes /w/ and /u/',
  rain: 'r ai n',
  "can't": "c a n ' t",
  catch: 'c a tch',
  children: 'ch i l d r e@ n',
  "couldn't": "c oul* d n ' t | oul says /oo/, as in \"book\"",
  enough: 'e@ n ough* | ough says /uf/',
  even: 'e~ v e@ n',
  group: 'g r ou* p | ou says /oo/',
  yellow: 'y e ll ow',
  low: 'l ow',
  money: 'm o* n ey* | o says /u/ and ey says /ee/',
  most: 'm o~ s t',
  much: 'm u ch',
  new: 'n ew',
  page: 'p a g~ e_',
  hard: 'h ar d',
  start: 's t ar t',
  part: 'p ar t',
  last: 'l a s t',
  laugh: 'l augh* | augh says /arf/',
  car: 'c ar',
  half: 'h a* l* f | a says /ar/ and the l is silent',
  ask: 'a s k',
  father: 'f a* th er | a says /ar/',
  air: 'air',
  little: 'l i tt le',
  every: 'e v e@ r y~',
  parent: 'p a* r e@ n t | a says /air/',
  ever: 'e v er',
  never: 'n e v er',
  number: 'n u m b er',
  together: 't o@ g e th er',
  bought: 'b ough* t | ough says /aw/',
  everywhere: 'e v e@ r y~ wh ere* | ere says /air/',
  question: 'qu e s t* io* n | ti says /ch/ and io says /uh/',
  answer: 'a n s w* er | the w is silent',
  early: 'ear* l y~ | ear says /er/',
  earth: 'ear* th | ear says /er/',
  later: 'l a~ t er',
  letter: 'l e tt er',
  our: 'our',
  we: 'w e* | e says its name, /ē/',
  first: 'f ir s t',
  hurt: 'h ur t',
  heard: 'h ear* d | ear says /er/',
  call: 'c a* ll | a says /aw/',
  door: 'd oor* | oor says /or/',
  draw: 'd r aw',
  four: 'f our* | our says /or/',
  more: 'm ore',
  morning: 'm or n -ing',
  small: 's m a* ll | a says /aw/',
  walk: 'w a* l* k | a says /aw/ and the l is silent',
  already: 'a* l r ea* d y~ | a says /aw/ and ea says /e/',
  toy: 't oy',
  found: 'f ou n d',
  house: 'h ou s e* | the e is silent',
  around: 'a@ r ou n d',
  almost: 'a* l m o~ s t | a says /aw/',
  hear: 'h ear',
  horse: 'h or s e* | the e is silent',
  talk: 't a* l* k | a says /aw/ and the l is silent',
  short: 'sh or t',
  fall: 'f a* ll | a says /aw/',
  point: 'p oi n t',
  another: 'a@ n o* th er | o says /u/',
  against: 'a@ g ai* n s t | ai says /e/',
  ear: 'ear',
  able: 'a~ b le',
  outside: 'ou t s i d e_',
  pull: 'p u* ll | u says /oo/, as in "book"',
  far: 'f ar',
  push: 'p u* sh | u says /oo/, as in "book"',
  fire: 'f i r e_',
  right: 'r igh t',
  dear: 'd ear',
  idea: 'i~ d e~ a@',
  year: 'y ear',
  near: 'n ear',
  ball: 'b a* ll | a says /aw/',
  blue: 'b l ue',
  during: 'd u~ r -ing',
  front: 'f r o* n t | o says /u/',
  hold: 'h o~ l d',
  like: 'l i k e_',
  look: 'l oo~ k',
  write: 'w* r i t e_ | the w is silent',
  my: 'm y~',
  called: 'c a* ll -ed | a says /aw/',
  oil: 'oi l',
  long: 'l o ng',
  use: 'u s* e_ | s says /z/',
  words: 'w or* d -s | after w, or says /er/',
  sound: 's ou n d',
  live: 'l i v e* | words never end in v, so an e comes after it — the i stays short',
  back: 'b a ck',
  things: 'th i ng -s',
  sentence: 's e n t e@ n c~ e_',
  line: 'l i n e_',
  means: 'm ea n -s',
  old: 'o~ l d',
  tell: 't e ll',
  fellow: 'f e ll ow',
  show: 'sh ow',
  form: 'f or m',
  three: 'th r ee',
  well: 'w e ll',
  such: 's u ch',
  turn: 't ur n',
  read: 'r ea d',
  need: 'n ee d',
  different: 'd i ff er e@ n t',
  picture: 'p i c ture* | ture says /cher/',
  play: 'p l ay',
  spell: 's p e ll',
  animal: 'a n i@ m a@ l',
  study: 's t u d y~',
  still: 's t i ll',
  learn: 'l ear* n | ear says /er/',
  Singapore: 'S i ng a@ p ore',
  world: 'w or* l d | after w, or says /er/',
  add: 'a dd',
  food: 'f oo d',
  country: 'c ou* n t r y~ | ou says /u/',
  plant: 'p l a n t',
  school: 's ch* oo l | ch says /k/',
  tree: 't r ee',
  close: 'c l o s* e_ | s says /z/',
  seem: 's ee m',
  example: 'e@ x a m p le',
  those: 'th o s* e_ | s says /z/',
  paper: 'p a~ p er',
  important: 'i m p or t a@ n t',
  side: 's i d e_',
  metre: 'm e~ t re* | re says /er/',
  grow: 'g r ow',
  took: 't oo~ k',
  river: 'r i v er',
  state: 's t a t e_',
  book: 'b oo~ k',
  stop: 's t o p',
  second: 's e c o@ n d',
  late: 'l a t e_',
  miss: 'm i ss',
  face: 'f a c~ e_',
  Indian: 'I n d i@ a@ n',
  real: 'r ea l',
  sometimes: 's o* m e* t i m e_ -s | o says /u/ and the first e is silent',
  mountains: 'm ou n t ai* n -s | ai says /i/',
  soon: 's oo n',
  song: 's o ng',
  being: 'b e~ -ing',
  Monday: 'M o* n d ay | o says /u/',
  Tuesday: 'T ue s* d ay | s says /z/',
  "it's": "i t ' s",
  colour: 'c o* l our* | o says /u/ and our says /er/',
  area: 'a* r e~ a@ | a says /air/',
  mark: 'm ar k',
  birds: 'b ir d -s',
  problem: 'p r o b l e@ m',
  complete: 'c o@ m p l e t e_',
  room: 'r oo m',
  Wednesday: 'W e d* n e* s* d ay | it says "Wenz-day": the d and the second e are silent',
  Thursday: 'Th ur s* d ay | s says /z/',
  since: 's i n c~ e_',
  piece: 'p ie* c~ e_ | ie says /ee/',
  told: 't o~ l d',
  usually: 'u~ s* u* a@ ll y~ | su says /zhoo/',
  "didn't": "d i d n ' t",
  friends: 'f r ie* n d -s | ie says /e/',
  order: 'or d er',
  sure: 's* ure* | s says /sh/ and ure says /or/',
  Friday: 'F r i~ d ay',
  Saturday: 'S a t ur d ay',
  Sunday: 'S u n d ay',
  better: 'b e tt er',
  however: 'h ow~ e v er',
  black: 'b l a ck',
  products: 'p r o d u@ c t -s',
  happened: 'h a pp e@ n -ed',
  whole: 'wh* o l e_ | wh says /h/',
  measure: 'm ea* s* ure* | ea says /e/ and sure says /zher/',
  remember: 'r e~ m e m b er',
  waves: 'w a v e_ -s',
  reached: 'r ea ch -ed',
  listen: 'l i s t* e@ n | the t is silent',
  wind: 'w i n d',
  rock: 'r o ck',
  space: 's p a c~ e_',
  covered: 'c o* v er -ed | o says /u/',
  several: 's e v er a@ l',
  himself: 'h i m s e l f',
  towards: 't o@ w ar* d -s | ar says /or/',
  five: 'f i v e_',
  passed: 'p a ss -ed',
  vowel: 'v ow~ e@ l',
  true: 't r ue',
  hundred: 'h u n d r e@ d',
  pattern: 'p a tt er n',
  numeral: 'n u~ m er a@ l',
  table: 't a~ b le',
  north: 'n or th',
  slowly: 's l ow -ly',
  farm: 'f ar m',
  pulled: 'p u* ll -ed | u says /oo/, as in "book"',
  voice: 'v oi c~ e_',
  seen: 's ee n',
  cried: 'c r ie -d',
  plan: 'p l a n',
  notice: 'n o~ t i c~ e_',
  south: 's ou th',
  sing: 's i ng',
  ground: 'g r ou n d',
  king: 'k i ng',
  town: 't ow~ n',
  "I'll": "I* ' ll | I is always a capital",
  unit: 'u~ n i t',
  figure: 'f i g ure* | ure says /er/',
  certain: 'c~ er t ai* n | ai says /uh/',
  field: 'f ie* l d | ie says /ee/',
  travel: 't r a v e@ l',
  wood: 'w oo~ d',
  used: 'u s* e_ -d | s says /z/',
};

/**
 * The phase that teaches each regular letter group. Single letters and
 * short vowels are phase 1 and need no entry.
 */
const GRAPHEME_PHASE = Object.freeze({
  sh: 4, ch: 4, th: 4, wh: 4, ck: 4, ng: 4,
  ll: 4, ss: 4, ff: 4, zz: 4, dd: 4, tt: 4, pp: 4, nn: 4, rr: 4, mm: 4, bb: 4, gg: 4,
  ai: 6, ay: 6, ee: 6, ea: 6, oa: 6, ow: 6, oe: 6, ie: 6, igh: 6, ue: 6, ew: 6, oo: 6, e_: 6,
  ar: 7, or: 7, er: 7, ir: 7, ur: 7, ore: 7, tch: 7, dge: 7, ph: 7,
  oi: 8, oy: 8, ou: 8, aw: 8, au: 8,
  air: 9, ear: 9, our: 9,
  le: 10,
});

/** A token's phase when it carries a marker. */
function _markedPhase(base, marker) {
  if (marker === '@') return 10; // unstressed vowel: met in the multisyllable stage
  if (marker === '~') {
    if (base === 'c' || base === 'g') return 7; // soft c / soft g
    if (base === 'ow') return 8; // ow as in cow
    return 6; // long vowel on its own, short oo, y as a vowel
  }
  return null;
}

const VOWELS = /[aeiouy]/;

/**
 * @typedef {object} SightWordCode
 * @property {string} word
 * @property {'decodable'|'heart'} category
 *   decodable — no tricky part; heart — one part to learn by heart
 * @property {Array<{ text: string, tricky: boolean }>} segments
 * @property {string} note  what the tricky part does ('' when decodable)
 * @property {number|null} decodableAt  the phase from which a decodable word
 *   can be sounded out in full; null for heart words
 * @property {string|null} waitsOn  for a decodable word, the latest letter
 *   group it needs ("ay" in day); null when it is the word's length (two or
 *   more beats) that waits for phase 10, or when nothing does
 */

/** @param {string} word @param {string} spec @returns {SightWordCode} */
function _parse(word, spec) {
  const [groups, note = ''] = spec.split('|').map((x) => x.trim());
  const segments = [];
  let phase = 1;
  let waitsOn = null;
  let vowelBeats = 0;
  let tricky = false;
  for (const raw of groups.split(/\s+/)) {
    const isSuffix = raw.startsWith('-');
    const marker = /[*~@]$/.exec(raw)?.[0] ?? '';
    const text = raw.replace(/^-/, '').replace(/[*~@]$/, '');
    const shown = text.replace(/_$/, ''); // e_ is written as e
    const base = text.toLowerCase();
    if (marker === '*') tricky = true;
    segments.push({ text: shown, tricky: marker === '*' });
    if (marker === '*') continue;
    const p = isSuffix ? 9 : (_markedPhase(base, marker) ?? GRAPHEME_PHASE[base] ?? 1);
    if (p > phase) {
      phase = p;
      waitsOn = p > 1 ? (isSuffix ? `-${shown}` : shown.toLowerCase()) : null;
    }
    const consonantY = base === 'y' && marker !== '~';
    if (!isSuffix && base !== 'e_' && base !== 'qu' && !consonantY && VOWELS.test(base)) {
      vowelBeats++;
    }
  }
  if (vowelBeats >= 2 && phase < 10) {
    phase = 10; // longer words are phase 10's multisyllable work
    waitsOn = null;
  }
  return {
    word,
    category: tricky ? 'heart' : 'decodable',
    segments,
    note: tricky ? note : '',
    decodableAt: tricky ? null : phase,
    waitsOn: tricky ? null : waitsOn,
  };
}

const _CODE = new Map(Object.entries(SPECS).map(([w, spec]) => [w.toLowerCase(), _parse(w, spec)]));

/** Every described sight word, for tests and reports. */
export const SIGHT_WORD_CODE = Object.freeze(Object.fromEntries(_CODE));

/**
 * One line for the child about how to read the word.
 *   heart:      "❤️ ai says /e/"
 *   decodable:  "No tricky part — sound it out!" (code from phases 1–4),
 *               or "… once you know ay" / "… clap the parts" for later code
 * @param {SightWordCode} code
 */
export function sightWordTip(code) {
  if (!code) return '';
  if (code.category === 'heart') return `❤️ Tricky part: ${code.note}`;
  if (code.decodableAt <= 4) return 'No tricky part — sound it out!';
  if (!code.waitsOn) return 'No tricky part — clap the parts, then sound it out.';
  const what = code.waitsOn.startsWith('-') ? `the ending “${code.waitsOn}”` : `“${code.waitsOn}”`;
  return `No tricky part — you can sound it out once you know ${what}.`;
}

/**
 * How a sight word is built: which part (if any) is tricky, and when it
 * becomes decodable. Null for words not described (the hard spelling tier).
 * @param {string} word
 * @returns {SightWordCode|null}
 */
export function getSightWordCode(word) {
  return _CODE.get(String(word ?? '').toLowerCase()) ?? null;
}
