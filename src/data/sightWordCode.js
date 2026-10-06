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
 *   a^         a saying /ar/ (fast, last, path, father). In Singapore and
 *              British English these are not the short a of "cat", and a
 *              child who sounds them out with it says "fasst". It is taught
 *              beside ar, so these words wait for that lesson
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
  fast: 'f a^ s t',
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
  after: 'a^ f t er',
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
  "can't": "c a^ n ' t",
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
  last: 'l a^ s t',
  laugh: 'l augh* | augh says /arf/',
  car: 'c ar',
  half: 'h a* l* f | a says /ar/ and the l is silent',
  ask: 'a^ s k',
  father: 'f a^ th er',
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
  plant: 'p l a^ n t',
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
  passed: 'p a^ ss -ed',
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
 * Story words outside the sight-word bank, described the same way.
 *
 * The decodability checker reads letters: it knows a child has been taught
 * s, a and t, so it passed "last" in the first Band A story, and "his" from
 * the second short-vowel phase on. But the a in "last" says /ar/ and the s in
 * "his" says /z/, and neither sound is what those letters were taught to
 * make. These entries tell the checker and the sound colours what each word
 * actually says, for every story word whose spelling does not give it away.
 * A word with an ending ("planted", "pushed") is found through its base.
 *
 * Some describe words the stories no longer use — they were rewritten when
 * the checker learned sounds — and stay so that the next story to use "nose"
 * or "bath" is checked properly too.
 */
const STORY_SPECS = {
  // ── a says /ar/ (taught beside ar) ──────────────────────────────────────
  past: 'p a^ s t',
  path: 'p a^ th',
  bath: 'b a^ th',
  grass: 'g r a^ ss',
  glass: 'g l a^ ss',
  class: 'c l a^ ss',
  pass: 'p a^ ss',
  branch: 'b r a^ n ch',
  nasty: 'n a^ s t y~',
  afternoon: 'a^ f t er n oo n',
  grandfather: 'g r a n d f a^ th er',
  grandpa: 'g r a n d p a^',
  halfway: 'h a* l* f w ay | a says /ar/ and the l is silent',
  calm: 'c a* l* m | a says /ar/ and the l is silent',
  palm: 'p a* l* m | a says /ar/ and the l is silent',
  auntie: 'au* n t ie* | au says /ar/ and ie says /ee/',

  // ── s says /z/ ──────────────────────────────────────────────────────────
  as: 'a s* | s says /z/',
  says: 's ay* s* | ay says /e/ and s says /z/',
  nose: 'n o s* e_ | s says /z/',
  rose: 'r o s* e_ | s says /z/',
  chose: 'ch o s* e_ | s says /z/',
  rise: 'r i s* e_ | s says /z/',
  surprise: 's ur p r i s* e_ | s says /z/',
  cosy: 'c o~ s* y~ | s says /z/',
  nosy: 'n o~ s* y~ | s says /z/',
  busy: 'b u* s* y~ | u says /i/ and s says /z/',
  noise: 'n oi s* e* | s says /z/ and the e is silent',
  pause: 'p au s* e* | s says /z/ and the e is silent',
  whose: 'wh* o* s* e* | it says "hooz": w is silent, o says /oo/ and s says /z/',
  treasure: 't r ea* s* ure* | ea says /e/, s says /zh/ and ure says /er/',
  shophouses: 'sh o p h ou s* -es | s says /z/ before -es',

  // ── o, u and a that say another sound ──────────────────────────────────
  cover: 'c o* v er | o says /u/',
  discovered: 'd i s c o* v er -ed | o says /u/',
  honey: 'h o* n ey* | o says /u/ and ey says /ee/',
  monkey: 'm o* n k ey* | o says /u/ and ey says /ee/',
  month: 'm o* n th | o says /u/',
  none: 'n o* n e* | o says /u/ and the e is silent',
  won: 'w o* n | o says /u/',
  grandmother: 'g r a n d m o* th er | o says /u/',
  anyone: 'a* n y~ o* n e* | a says /e/, and "one" says "wun"',
  someone: 's o* m e* o* n e* | o says /u/, and "one" says "wun"',
  somewhere: 's o* m e* wh ere* | o says /u/ and ere says /air/',
  stomach: 's t o* m a@ ch* | o says /u/ and ch says /k/',
  tongue: 't o* n gue* | o says /u/ and gue says /g/',
  shove: 'sh o* v e* | o says /u/ and the e is silent',
  shone: 'sh o* n e* | o says /o/, as in "hot", and the e is silent',
  gone: 'g o* n e* | o says /o/, as in "hot", and the e is silent',
  onto: 'o n t o* | o says /oo/, like in "to"',
  woman: 'w o* m a@ n | o says /oo/, as in "book"',
  fro: 'f r o* | o says its name, /ō/',
  pro: 'p r o* | o says its name, /ō/',
  oh: 'o* h* | o says its name and the h is silent',
  full: 'f u* ll | u says /oo/, as in "book"',
  bush: 'b u* sh | u says /oo/, as in "book"',
  cushion: 'c u* sh io* n | u says /oo/ and io says /uh/',
  sugar: 's* u* g ar* | s says /sh/, u says /oo/ and ar says /er/',
  bury: 'b u* r y~ | u says /e/',
  compass: 'c o* m p a@ ss | o says /u/',
  tasty: 't a~ s t y~',
  minute: 'm i n u* t e* | u says /i/ and the e is silent',
  wash: 'w a* sh | a says /o/',
  hall: 'h a* ll | a says /aw/',
  stall: 's t a* ll | a says /aw/',
  tall: 't a* ll | a says /aw/',
  wall: 'w a* ll | a says /aw/',
  salty: 's a* l t y~ | a says /aw/',
  warm: 'w ar* m | ar says /or/',
  word: 'w or* d | or says /er/',
  workshop: 'w or* k sh o p | or says /er/',
  worth: 'w or* th | or says /er/',
  worry: 'w o* rr y~ | o says /u/',

  // ── vowel teams that say another sound ─────────────────────────────────
  bread: 'b r ea* d | ea says /e/',
  breakfast: 'b r ea* k f a@ s t | ea says /e/',
  breath: 'b r ea* th | ea says /e/',
  feather: 'f ea* th er | ea says /e/',
  heavier: 'h ea* v i@ er | ea says /e/',
  instead: 'i n s t ea* d | ea says /e/',
  meant: 'm ea* n t | ea says /e/',
  spread: 's p r ea* d | ea says /e/',
  heart: 'h ear* t | ear says /ar/',
  pearl: 'p ear* l | ear says /er/',
  search: 's ear* ch | ear says /er/',
  wearing: 'w ear* -ing | ear says /air/',
  leaves: 'l ea v -es',
  toes: 't oe -s',
  courage: 'c ou* r a* g~ e_ | ou says /u/ and a says /i/',
  favourite: 'f a v ou* r i* t e* | ou says /uh/, i says /i/ and the e is silent',
  pour: 'p our* | our says /or/',
  shoulder: 'sh ou* l d er | ou says /oa/',
  touch: 't ou* ch | ou says /u/',
  doubt: 'd ou b* t | the b is silent',
  believe: 'b e@ l ie* v e* | ie says /ee/ and the e is silent',
  thief: 'th ie* f | ie says /ee/',
  grey: 'g r ey* | ey says /ay/',
  key: 'k ey* | ey says /ee/',
  built: 'b ui* l t | ui says /i/',
  building: 'b ui* l d -ing | ui says /i/',
  juice: 'j ui* c~ e* | ui says /oo/ and the e is silent',
  caught: 'c augh* t | augh says /aw/',
  straight: 's t r aigh* t | aigh says /ay/',
  guard: 'g u* ar d | the u is silent',
  kueh: 'k ueh* | it says "kway"',
  cendol: 'c* e n d o l | in Malay, c says /ch/',

  // ── silent letters ─────────────────────────────────────────────────────
  knee: 'k* n ee | the k is silent',
  knelt: 'k* n e l t | the k is silent',
  knife: 'k* n i f e_ | the k is silent',
  knock: 'k* n o ck | the k is silent',
  knot: 'k* n o t | the k is silent',
  wrong: 'w* r o ng | the w is silent',
  whistle: 'wh i s t* le | the t is silent',
  island: 'i~ s* l a@ n d | the s is silent',
  yoghurt: 'y o g h* ur t | the h is silent',
  else: 'e l s e* | the e is silent',
  orchids: 'or ch* i d -s | ch says /k/',
  mrs: 'm* r* s* | Mrs is short for a longer word: say "missiz"',
  mr: 'm* r* | Mr is short for "mister"',
  mrt: 'm* r* t* | say the letter names: M, R, T',

  // ── endings and the long vowel on its own ──────────────────────────────
  adventure: 'a d v e n t* ure* | t says /ch/ and ure says /er/',
  special: 's p e c* ia* l | c says /sh/ and ia says /uh/',
  necklace: 'n e ck l a* c e* | ace says /iss/',
  bicycle: 'b i~ c~ y* c le | y says /i/',
  fold: 'f o~ l d',
  gold: 'g o~ l d',
  sold: 's o~ l d',
  mind: 'm i~ n d',
  post: 'p o~ s t',
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
  if (marker === '^') return 7; // a says /ar/: taught beside ar
  if (marker === '~') {
    if (base === 'c' || base === 'g') return 7; // soft c / soft g
    if (base === 'ow') return 8; // ow as in cow
    return 6; // long vowel on its own, short oo, y as a vowel
  }
  return null;
}

const VOWELS = /[aeiouy]/;
const SINGLE_VOWEL = /^[aeiou]$/;

/** What a marked (~) letter group says, in a child's words. */
const LATER_SOUND = Object.freeze({
  c: '“c” can say /s/',
  g: '“g” can say /j/',
  ow: '“ow” can say /ow/, as in “cow”',
  oo: '“oo” can say /oo/, as in “book”',
  y: '“y” can say /igh/',
});

/**
 * The letter group a regular word waits on, and how to say it to a child.
 *
 * The bare letters mislead for exactly the groups the spec marks: the "e"
 * of "white" is Magic E, not the e of "hen", and the "o" of "cold" says its
 * name, not the o of "hot". "Once you know “e”" tells a child who already
 * knows e that they should be able to read "white", and they can't.
 * Unstressed vowels (@) wait on the word's length, not on a letter group,
 * so they return null and the tip says to clap the parts.
 *
 * @returns {{ waitsOn: string, tip: string }|null}
 */
function _waitsOn(base, shown, marker, isSuffix, earlier) {
  if (isSuffix) return { waitsOn: `-${shown}`, tip: `the ending “-${shown}”` };
  if (marker === '@') return null;
  if (marker === '^') return { waitsOn: 'a^', tip: '“a” can say /ar/, as in “fast”' };
  if (base === 'e_') {
    const vowel = [...earlier].reverse().find((s) => SINGLE_VOWEL.test(s.text.toLowerCase()));
    if (!vowel) return { waitsOn: 'e', tip: 'Magic E' };
    const v = vowel.text.toLowerCase();
    return { waitsOn: `${v}_e`, tip: `Magic E makes “${v}” say its name` };
  }
  if (marker === '~') {
    if (LATER_SOUND[base]) return { waitsOn: base, tip: LATER_SOUND[base] };
    if (SINGLE_VOWEL.test(base)) return { waitsOn: base, tip: `“${base}” can say its name` };
  }
  const group = shown.toLowerCase();
  return { waitsOn: group, tip: `“${group}”` };
}

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
 *   group it needs ("ay" in day, "i_e" in white); null when it is the word's
 *   length (two or more beats) that waits for phase 10, or when nothing does
 * @property {string|null} waitsOnTip  waitsOn as a child is told it: "Magic E
 *   makes “i” say its name", "“c” can say /s/", "“ay”"
 * @property {number} soundPhase  the phase that teaches the latest SOUND the
 *   word's letters make, counting only the marked groups (~ and ^): the
 *   letters themselves are the decodability checker's business, and a word
 *   of two beats is not harder to sound out for being long. 1 when no group
 *   is marked; for a heart word, the regular parts only.
 */

/** @param {string} word @param {string} spec @returns {SightWordCode} */
function _parse(word, spec) {
  const [groups, note = ''] = spec.split('|').map((x) => x.trim());
  const segments = [];
  let phase = 1;
  /** @type {{ waitsOn: string, tip: string }|null} */
  let waits = null;
  let vowelBeats = 0;
  let tricky = false;
  let soundPhase = 1;
  for (const raw of groups.split(/\s+/)) {
    const isSuffix = raw.startsWith('-');
    const marker = /[*~@^]$/.exec(raw)?.[0] ?? '';
    const text = raw.replace(/^-/, '').replace(/[*~@^]$/, '');
    const shown = text.replace(/_$/, ''); // e_ is written as e
    const base = text.toLowerCase();
    if (marker === '*') tricky = true;
    const earlier = [...segments];
    segments.push({ text: shown, tricky: marker === '*', mark: marker });
    if (marker === '*') continue;
    if (marker === '~' || marker === '^') {
      soundPhase = Math.max(soundPhase, _markedPhase(base, marker));
    }
    const p = isSuffix ? 9 : (_markedPhase(base, marker) ?? GRAPHEME_PHASE[base] ?? 1);
    if (p > phase) {
      phase = p;
      waits = p > 1 ? _waitsOn(base, shown, marker, isSuffix, earlier) : null;
    }
    const consonantY = base === 'y' && marker !== '~';
    if (!isSuffix && base !== 'e_' && base !== 'qu' && !consonantY && VOWELS.test(base)) {
      vowelBeats++;
    }
  }
  if (vowelBeats >= 2 && phase < 10) {
    phase = 10; // longer words are phase 10's multisyllable work
    waits = null;
  }
  return {
    word,
    category: tricky ? 'heart' : 'decodable',
    segments,
    note: tricky ? note : '',
    decodableAt: tricky ? null : phase,
    waitsOn: tricky ? null : (waits?.waitsOn ?? null),
    waitsOnTip: tricky ? null : (waits?.tip ?? null),
    soundPhase,
  };
}

const _CODE = new Map(Object.entries(SPECS).map(([w, spec]) => [w.toLowerCase(), _parse(w, spec)]));
const _STORY_CODE = new Map(
  Object.entries(STORY_SPECS).map(([w, spec]) => [w.toLowerCase(), _parse(w, spec)]),
);
/** Stories are read with their apostrophes cleaned off: "cant" is "can't". */
const _BY_LETTERS = new Map(
  [..._CODE, ..._STORY_CODE]
    .filter(([w]) => /[^a-z]/.test(w))
    .map(([w, code]) => [w.replace(/[^a-z]/g, ''), code]),
);

/** Every described sight word, for tests and reports. */
export const SIGHT_WORD_CODE = Object.freeze(Object.fromEntries(_CODE));

/** Every described story word outside the sight-word bank. */
export const STORY_WORD_CODE = Object.freeze(Object.fromEntries(_STORY_CODE));

/**
 * One line for the child about how to read the word.
 *   heart:      "❤️ ai says /e/"
 *   decodable:  "No tricky part — sound it out!" (code from phases 1–4),
 *               or "… once you know “ay”" / "… clap the parts" for later code
 * @param {SightWordCode} code
 */
export function sightWordTip(code) {
  if (!code) return '';
  if (code.category === 'heart') return `❤️ Tricky part: ${code.note}`;
  if (code.decodableAt <= 4) return 'No tricky part — sound it out!';
  if (!code.waitsOnTip) return 'No tricky part — clap the parts, then sound it out.';
  return `No tricky part — you can sound it out once you know ${code.waitsOnTip}.`;
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

/**
 * How any described word is built — a sight word, or a story word whose
 * spelling does not give its sounds away. Null for a word whose letters
 * all make the sound they were taught to make.
 * @param {string} word
 * @returns {SightWordCode|null}
 */
export function getWordCode(word) {
  const key = String(word ?? '').toLowerCase();
  return _CODE.get(key) ?? _STORY_CODE.get(key) ?? _BY_LETTERS.get(key) ?? null;
}
