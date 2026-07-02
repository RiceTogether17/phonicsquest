/**
 * PhonicsQuest – Phonics Mini-Lessons
 *
 * One explicit-instruction script per CURRICULUM stage, shown by the
 * shared mini-lesson overlay (src/components/miniLesson.js) the first
 * time a child practises that stage ("I do → we do → you do").
 *
 * Each entry (keyed by CURRICULUM stage id):
 *   headline   – child-facing lesson title (≤ 60 chars)
 *   soundChips – tappable sound buttons: { g, type, label } where g/type
 *                feed audio.speakPhoneme() and label is the display text
 *   script     – 2–4 short teaching lines Giri reads aloud (≤ 140 chars each)
 *   weDoWord   – the guided-practice word (must exist in words.js — the
 *                child and Giri blend it together before independent work)
 *   confusions – 0–2 "watch out" pointers shown under the script
 *
 * Stage name, sample words, and sentence examples are NOT duplicated here;
 * the overlay reads them from CURRICULUM so the two can never drift.
 * Coverage and integrity are asserted in __tests__/miniLessons.test.js.
 */

export const PHONICS_LESSONS = {
  /* ── Phase 1 · CVC ──────────────────────────────────────────────── */
  'cvc-a': {
    headline: 'Hear the short A sound',
    soundChips: [{ g: 'a', type: 'sv', label: 'ă' }],
    script: [
      'Every word today has the same middle sound: /a/, like the start of "apple".',
      'Open your mouth wide and say it three times: a… a… a!',
      'To read a word, say each sound, then glue them together: c… a… t — cat!',
    ],
    weDoWord: 'cat',
    confusions: ['Short A and short E sound close. /a/ opens your mouth wide; /e/ uses a small smile.'],
  },
  'cvc-e': {
    headline: 'Hear the short E sound',
    soundChips: [{ g: 'e', type: 'sv', label: 'ĕ' }],
    script: [
      'Today\'s middle sound is /e/, like the start of "egg".',
      'Make a small smile and say it: e… e… e!',
      'Glue the sounds together to read: h… e… n — hen!',
    ],
    weDoWord: 'hen',
    confusions: ['Listen carefully: /e/ (egg) is not /a/ (apple). Your mouth opens less for /e/.'],
  },
  'cvc-i': {
    headline: 'Hear the short I sound',
    soundChips: [{ g: 'i', type: 'sv', label: 'ĭ' }],
    script: [
      'Today\'s middle sound is /i/, like the start of "igloo".',
      'It is a quick, tiny sound: i… i… i!',
      'Glue the sounds together to read: p… i… g — pig!',
    ],
    weDoWord: 'pig',
    confusions: ['Short I (igloo) and short E (egg) are easy to mix up. /i/ is quicker and higher.'],
  },
  'cvc-o': {
    headline: 'Hear the short O sound',
    soundChips: [{ g: 'o', type: 'sv', label: 'ŏ' }],
    script: [
      'Today\'s middle sound is /o/, like the start of "octopus".',
      'Make your lips a round circle and say: o… o… o!',
      'Glue the sounds together to read: d… o… g — dog!',
    ],
    weDoWord: 'dog',
    confusions: ['Short O (octopus) is rounder than short U (umbrella). Check your lips in a mirror!'],
  },
  'cvc-u': {
    headline: 'Hear the short U sound',
    soundChips: [{ g: 'u', type: 'sv', label: 'ŭ' }],
    script: [
      'Today\'s middle sound is /u/, like the start of "umbrella".',
      'Relax your mouth and say it: u… u… u!',
      'Glue the sounds together to read: s… u… n — sun!',
    ],
    weDoWord: 'sun',
    confusions: ['Short U (up) and short O (on) sound close. /u/ is lazy and relaxed; /o/ is round.'],
  },

  /* ── Phase 2 · CCVC initial blends ──────────────────────────────── */
  'ccvc-a': {
    headline: 'Two friends at the front: blends',
    soundChips: [{ g: 'fl', type: 'bl', label: 'fl' }, { g: 'a', type: 'sv', label: 'ă' }],
    script: [
      'Some words start with TWO consonant friends. You can hear both sounds!',
      'Say them quickly together: f…l → "fl", like in "flag".',
      'Now blend the whole word: f… l… a… g — flag! Don\'t skip the second sound.',
    ],
    weDoWord: 'flag',
    confusions: ['The most common slip is skipping the second sound — "fag" instead of "flag". Say BOTH.'],
  },
  'ccvc-e': {
    headline: 'Blends with short E',
    soundChips: [{ g: 'st', type: 'bl', label: 'st' }, { g: 'e', type: 'sv', label: 'ĕ' }],
    script: [
      'Today the two consonant friends come before short E.',
      'Say the blend, then the rest: s…t…e…p — step!',
      'Both blend sounds matter. "Sep" is missing one — listen for the /t/.',
    ],
    weDoWord: 'step',
    confusions: [],
  },
  'ccvc-i': {
    headline: 'Blends with short I',
    soundChips: [{ g: 'sw', type: 'bl', label: 'sw' }, { g: 'i', type: 'sv', label: 'ĭ' }],
    script: [
      'Two consonant friends, then the quick /i/ sound.',
      'Try this one: s… w… i… m — swim!',
      'Slide the first two sounds together smoothly, like a swing: "sw…".',
    ],
    weDoWord: 'swim',
    confusions: [],
  },
  'ccvc-o': {
    headline: 'Blends with short O',
    soundChips: [{ g: 'st', type: 'bl', label: 'st' }, { g: 'o', type: 'sv', label: 'ŏ' }],
    script: [
      'Two consonant friends, then the round /o/ sound.',
      'Try this one: s… t… o… p — stop!',
      'Keep both starting sounds: "top" and "stop" are different words.',
    ],
    weDoWord: 'stop',
    confusions: ['"Stop" without the /s/ becomes "top". The first sound changes the word!'],
  },
  'ccvc-u': {
    headline: 'Blends with short U',
    soundChips: [{ g: 'dr', type: 'bl', label: 'dr' }, { g: 'u', type: 'sv', label: 'ŭ' }],
    script: [
      'Two consonant friends, then the relaxed /u/ sound.',
      'Try this one: d… r… u… m — drum!',
      'Say /d/ and /r/ quickly together so they sound like one beat: "dr…".',
    ],
    weDoWord: 'drum',
    confusions: [],
  },

  /* ── Phase 3 · CVCC final blends ────────────────────────────────── */
  'cvcc-a': {
    headline: 'Two friends at the END of the word',
    soundChips: [{ g: 'a', type: 'sv', label: 'ă' }, { g: 'nd', type: 'bl', label: 'nd' }],
    script: [
      'Now the two consonant friends come at the END.',
      'Listen to the ending of "hand": h… a… n… d. Two sounds at the end!',
      'Read the word, and don\'t drop the last sound: "han" is not "hand".',
    ],
    weDoWord: 'hand',
    confusions: ['Endings are easy to drop. Touch your chin as you finish the word to feel the last sound.'],
  },
  'cvcc-e': {
    headline: 'Endings with short E',
    soundChips: [{ g: 'e', type: 'sv', label: 'ĕ' }, { g: 'lt', type: 'bl', label: 'lt' }],
    script: [
      'Short E in the middle, two consonant friends at the end.',
      'Try this one: b… e… l… t — belt!',
      'Say the ending slowly first: /l/… /t/. Then speed it up: "lt".',
    ],
    weDoWord: 'belt',
    confusions: [],
  },
  'cvcc-i': {
    headline: 'Endings with short I',
    soundChips: [{ g: 'i', type: 'sv', label: 'ĭ' }, { g: 'ft', type: 'bl', label: 'ft' }],
    script: [
      'Quick /i/ in the middle, two consonant friends at the end.',
      'Try this one: g… i… f… t — gift!',
      'Check the end: can you hear BOTH /f/ and /t/?',
    ],
    weDoWord: 'gift',
    confusions: [],
  },
  'cvcc-o': {
    headline: 'Endings with short O',
    soundChips: [{ g: 'o', type: 'sv', label: 'ŏ' }, { g: 'st', type: 'bl', label: 'st' }],
    script: [
      'Round /o/ in the middle, two consonant friends at the end.',
      'Try this one: l… o… s… t — lost!',
      'The ending "st" hisses then taps: /s/… /t/.',
    ],
    weDoWord: 'lost',
    confusions: [],
  },
  'cvcc-u': {
    headline: 'Endings with short U',
    soundChips: [{ g: 'u', type: 'sv', label: 'ŭ' }, { g: 'mp', type: 'bl', label: 'mp' }],
    script: [
      'Relaxed /u/ in the middle, two consonant friends at the end.',
      'Try this one: j… u… m… p — jump!',
      'Press your lips for /m/, then pop them open for /p/.',
    ],
    weDoWord: 'jump',
    confusions: [],
  },

  /* ── Phase 4 · Digraphs ─────────────────────────────────────────── */
  'digraphs': {
    headline: 'Two letters, ONE new sound',
    soundChips: [
      { g: 'sh', type: 'd', label: 'sh' },
      { g: 'ch', type: 'd', label: 'ch' },
      { g: 'th', type: 'd', label: 'th' },
      { g: 'ng', type: 'd', label: 'ng' },
    ],
    script: [
      'Sometimes two letters team up to make ONE brand-new sound.',
      '"s" and "h" together say /sh/ — the quiet sound: "shhh!".',
      '"c" and "h" say /ch/ like a train. "t" and "h" say /th/ — tongue between your teeth!',
      'When you see these teams, say ONE sound, not two: sh… i… p — ship!',
    ],
    weDoWord: 'ship',
    confusions: ['/sh/ (quiet) and /ch/ (train) feel similar. /ch/ pops; /sh/ flows.'],
  },

  /* ── Phase 5 · CCVCC both-end blends ────────────────────────────── */
  'ccvcc-a': {
    headline: 'Blends at BOTH ends',
    soundChips: [{ g: 'st', type: 'bl', label: 'st' }, { g: 'a', type: 'sv', label: 'ă' }, { g: 'mp', type: 'bl', label: 'mp' }],
    script: [
      'Big words now: two friends at the start AND two at the end!',
      'Break it into parts: st… a… mp — stamp!',
      'Take your time. Start blend → vowel → end blend.',
    ],
    weDoWord: 'stamp',
    confusions: [],
  },
  'ccvcc-e': {
    headline: 'Both-end blends with short E',
    soundChips: [{ g: 'bl', type: 'bl', label: 'bl' }, { g: 'e', type: 'sv', label: 'ĕ' }, { g: 'nd', type: 'bl', label: 'nd' }],
    script: [
      'Two friends at the start, short E, two friends at the end.',
      'Try this one: b… l… e… n… d — blend!',
      'Five sounds in one little word. Count them on your fingers!',
    ],
    weDoWord: 'blend',
    confusions: [],
  },
  'ccvcc-i': {
    headline: 'Both-end blends with short I',
    soundChips: [{ g: 'dr', type: 'bl', label: 'dr' }, { g: 'i', type: 'sv', label: 'ĭ' }, { g: 'nk', type: 'bl', label: 'nk' }],
    script: [
      'Two friends at the start, quick /i/, two friends at the end.',
      'Try this one: d… r… i… n… k — drink!',
      'The ending /nk/ is sneaky — it hides in "think", "blink" and "sink" too.',
    ],
    weDoWord: 'drink',
    confusions: [],
  },
  'ccvcc-o': {
    headline: 'Both-end blends with short O',
    soundChips: [{ g: 'fr', type: 'bl', label: 'fr' }, { g: 'o', type: 'sv', label: 'ŏ' }, { g: 'st', type: 'bl', label: 'st' }],
    script: [
      'Two friends at the start, round /o/, two friends at the end.',
      'Try this one: s… t… o… m… p — stomp!',
      'Whisper each sound first, then say the word at full speed.',
    ],
    weDoWord: 'stomp',
    confusions: [],
  },
  'ccvcc-u': {
    headline: 'Both-end blends with short U',
    soundChips: [{ g: 'tr', type: 'bl', label: 'tr' }, { g: 'u', type: 'sv', label: 'ŭ' }, { g: 'st', type: 'bl', label: 'st' }],
    script: [
      'Two friends at the start, relaxed /u/, two friends at the end.',
      'Try this one: t… r… u… s… t — trust!',
      'You know all these sounds — just line them up one by one.',
    ],
    weDoWord: 'trust',
    confusions: [],
  },

  /* ── Phase 6 · Long vowels ──────────────────────────────────────── */
  'long-a-ae': {
    headline: 'Magic E makes A say its name',
    soundChips: [{ g: 'a', type: 'lv', label: 'ā' }, { g: 'e', type: 'se', label: 'e (silent)' }],
    script: [
      'Meet Magic E! It sits at the end of the word and stays SILENT.',
      'But it has a power: it makes the vowel say its NAME. "a" says /ā/, like in "cake".',
      'Look: c-a-k-e. The e is quiet, and a says its name: c… ā… k — cake!',
    ],
    weDoWord: 'cake',
    confusions: ['Without Magic E, "cap" has short /a/. Add the e — "cape" — and a says its name!'],
  },
  'long-a-ai': {
    headline: 'The AI team says /ā/',
    soundChips: [{ g: 'ai', type: 'lv', label: 'ai' }],
    script: [
      'The letters "a" and "i" walk together and say ONE sound: /ā/.',
      'Remember: when two vowels go walking, the first one does the talking!',
      'Try it: r… ai… n — rain!',
    ],
    weDoWord: 'rain',
    confusions: [],
  },
  'long-a-ay': {
    headline: 'The AY team says /ā/ at the end',
    soundChips: [{ g: 'ay', type: 'lv', label: 'ay' }],
    script: [
      '"a" and "y" team up at the END of words to say /ā/.',
      'AI likes the middle (rain); AY likes the end (play).',
      'Try it: p… l… ay — play!',
    ],
    weDoWord: 'play',
    confusions: ['Same sound, two spellings: "ai" in the middle, "ay" at the end.'],
  },
  'long-e-ee': {
    headline: 'The EE team says /ē/',
    soundChips: [{ g: 'ee', type: 'lv', label: 'ee' }],
    script: [
      'Two e\'s together make the long /ē/ sound — like a happy squeal: "eee!"',
      'Smile wide and say it: /ē/… /ē/… /ē/!',
      'Try it: tr… ee — tree!',
    ],
    weDoWord: 'tree',
    confusions: [],
  },
  'long-e-ea': {
    headline: 'The EA team also says /ē/',
    soundChips: [{ g: 'ea', type: 'lv', label: 'ea' }],
    script: [
      '"e" and "a" walk together — and the first one does the talking: /ē/.',
      '"ee" and "ea" make the SAME sound: see the sea!',
      'Try it: s… ea — sea!',
    ],
    weDoWord: 'sea',
    confusions: ['Two spellings, one sound: "feet" uses ee, "seat" uses ea. Both say /ē/.'],
  },
  'long-i-ie': {
    headline: 'Magic E makes I say its name',
    soundChips: [{ g: 'i', type: 'lv', label: 'ī' }, { g: 'e', type: 'se', label: 'e (silent)' }],
    script: [
      'Magic E is back! It makes "i" say its name: /ī/, like in "kite".',
      'Look: k-i-t-e. The e is silent, the i says its name.',
      'Try it: k… ī… t — kite!',
    ],
    weDoWord: 'kite',
    confusions: ['"Bit" has short /i/. Add Magic E — "bite" — and i says its name!'],
  },
  'long-i-igh': {
    headline: 'IGH — three letters, one sound: /ī/',
    soundChips: [{ g: 'igh', type: 'lv', label: 'igh' }],
    script: [
      'Here is a three-letter team: i-g-h together say just /ī/.',
      'The g and h are totally silent — they only help the i.',
      'Try it: n… igh… t — night!',
    ],
    weDoWord: 'night',
    confusions: [],
  },
  'long-i-y': {
    headline: 'Y the pretender says /ī/',
    soundChips: [{ g: 'y', type: 'lv', label: 'y → ī' }],
    script: [
      'At the end of short words, "y" pretends to be a vowel and says /ī/.',
      'cry, fly, sky — hear the /ī/ at the end?',
      'Try it: c… r… y — cry!',
    ],
    weDoWord: 'cry',
    confusions: [],
  },
  'long-o-oe': {
    headline: 'Magic E makes O say its name',
    soundChips: [{ g: 'o', type: 'lv', label: 'ō' }, { g: 'e', type: 'se', label: 'e (silent)' }],
    script: [
      'Magic E makes "o" say its name: /ō/, like in "home".',
      'Look: h-o-m-e. Silent e, and o says its name.',
      'Try it: h… ō… m — home!',
    ],
    weDoWord: 'home',
    confusions: ['"Hop" has short /o/. Add Magic E — "hope" — and o says its name!'],
  },
  'long-o-oa': {
    headline: 'The OA team says /ō/',
    soundChips: [{ g: 'oa', type: 'lv', label: 'oa' }],
    script: [
      '"o" and "a" walk together; the first one does the talking: /ō/.',
      'Try it: b… oa… t — boat!',
      'Boat, coat, road — the oa team loves the middle of words.',
    ],
    weDoWord: 'boat',
    confusions: [],
  },
  'long-o-ow': {
    headline: 'OW can say /ō/ — like snow!',
    soundChips: [{ g: 'ow', type: 'lv', label: 'ow → ō' }],
    script: [
      'At the end of words, "ow" often says /ō/: snow, grow, show.',
      'Try it: s… n… ow — snow!',
      'Watch out: ow has another sound too (like in "cow") — you\'ll meet it later!',
    ],
    weDoWord: 'snow',
    confusions: ['"ow" says /ō/ in snow but /ow/ in cow. Try both sounds and pick the real word.'],
  },
  'long-u-ue': {
    headline: 'Magic E makes U say its name',
    soundChips: [{ g: 'u', type: 'lv', label: 'ū' }, { g: 'e', type: 'se', label: 'e (silent)' }],
    script: [
      'Magic E makes "u" say its name: /ū/, like in "cube".',
      'Look: c-u-b-e. Silent e, and u says its name.',
      'Try it: c… ū… b — cube!',
    ],
    weDoWord: 'cube',
    confusions: ['"Cub" has short /u/. Add Magic E — "cube" — and u says its name!'],
  },
  'long-u-uue': {
    headline: 'The UE team says /oo/',
    soundChips: [{ g: 'ue', type: 'lv', label: 'ue' }],
    script: [
      '"u" and "e" together at the end say /oo/: blue, true, glue.',
      'Try it: b… l… ue — blue!',
      'Stretch the sound like sticky glue: "blu-u-ue".',
    ],
    weDoWord: 'blue',
    confusions: [],
  },
  'long-u-ew': {
    headline: 'The EW team says /oo/',
    soundChips: [{ g: 'ew', type: 'lv', label: 'ew' }],
    script: [
      '"e" and "w" team up to say /oo/: new, flew, grew.',
      'Try it: n… ew — new!',
      'Same sound as "ue" in blue — English likes to spell one sound many ways!',
    ],
    weDoWord: 'new',
    confusions: [],
  },
  'long-u-oo': {
    headline: 'The OO team says /oo/ — like the moon',
    soundChips: [{ g: 'oo', type: 'lv', label: 'oo' }],
    script: [
      'Two o\'s together say /oo/ — make your lips a small circle, like howling at the moon!',
      'Try it: m… oo… n — moon!',
      'Moon, food, pool — can you hear the same /oo/ in all of them?',
    ],
    weDoWord: 'moon',
    confusions: [],
  },

  /* ── Phase 7 · Diphthongs ───────────────────────────────────────── */
  'dip-oi': {
    headline: 'OI and OY — the sliding /oy/ sound',
    soundChips: [{ g: 'oi', type: 'dp', label: 'oi' }, { g: 'oy', type: 'dp', label: 'oy' }],
    script: [
      'This sound SLIDES — your mouth moves while you say it: /oy/!',
      'Spell it "oi" in the middle (coin) and "oy" at the end (boy).',
      'Try it: c… oi… n — coin!',
    ],
    weDoWord: 'coin',
    confusions: [],
  },
  'dip-ou': {
    headline: 'OU and OW — the "ouch!" sound',
    soundChips: [{ g: 'ou', type: 'dp', label: 'ou' }, { g: 'ow', type: 'dp', label: 'ow' }],
    script: [
      'This is the "ouch!" sound: /ow/. Your mouth opens, then closes.',
      'Spell it "ou" in the middle (loud) and often "ow" at the end (cow).',
      'Try it: c… ow — cow!',
    ],
    weDoWord: 'cow',
    confusions: ['Remember: "ow" can also say /ō/ (snow). Try both and pick the word that makes sense.'],
  },
  'dip-aw': {
    headline: 'AW — the "awww" sound',
    soundChips: [{ g: 'aw', type: 'dp', label: 'aw' }],
    script: [
      'This sound is like seeing a cute puppy: "awww!" — /aw/.',
      'Try it: p… aw — paw!',
      'Paw, saw, draw, yawn — same /aw/ in every one.',
    ],
    weDoWord: 'paw',
    confusions: [],
  },

  /* ── Phase 8 · Blends review ────────────────────────────────────── */
  'blends-review': {
    headline: 'Blend champion: mixed review',
    soundChips: [{ g: 'spr', type: 'bl', label: 'spr' }, { g: 'str', type: 'bl', label: 'str' }],
    script: [
      'You know start blends, end blends, and both-end blends. Time to mix them!',
      'Some words even have THREE consonant friends: spr… i… nt — sprint!',
      'The trick never changes: say every sound, in order, then glue them together.',
    ],
    weDoWord: 'crisp',
    confusions: ['Three-letter blends hide a middle sound: "spint" is missing the /r/ in "sprint".'],
  },

  /* ── Phase 9 · Suffixes ─────────────────────────────────────────── */
  'suffix-ing': {
    headline: 'The -ing ending: action happening NOW',
    soundChips: [{ g: 'ing', type: 'sf', label: '-ing' }],
    script: [
      'The ending "-ing" means the action is happening right now: run → running!',
      'Read the base word first, then add the ending: jump + ing — jumping!',
      'Try it: r… u… n + ing — running!',
    ],
    weDoWord: 'running',
    confusions: ['Some short base words double their last letter first: run → running, sit → sitting.'],
  },
  'suffix-ed': {
    headline: 'The -ed ending: it already happened',
    soundChips: [{ g: 'ed', type: 'sf', label: '-ed' }],
    script: [
      'The ending "-ed" means the action already happened: jump → jumped.',
      'Sneaky fact: -ed has THREE sounds! /t/ in "jumped", /d/ in "played", /id/ in "wanted".',
      'Read the base word, add the ending, then check which -ed sound fits.',
    ],
    weDoWord: 'jumped',
    confusions: ['Don\'t say "jump-ed" as two beats — in "jumped" the -ed is just a quick /t/.'],
  },
  'suffix-er': {
    headline: 'The -er ending: comparing two things',
    soundChips: [{ g: 'er', type: 'sf', label: '-er' }],
    script: [
      'Add "-er" to compare two things: tall → taller, big → bigger.',
      'Read the base word first, then the ending: tall + er — taller!',
      'Try it: t… a… ll + er — taller!',
    ],
    weDoWord: 'taller',
    confusions: [],
  },
  'suffix-est': {
    headline: 'The -est ending: the MOST of all',
    soundChips: [{ g: 'est', type: 'sf', label: '-est' }],
    script: [
      'Add "-est" for the most of all: tall → tallest — nobody is taller!',
      '-er compares two; -est compares everyone: taller than Sam, but the tallest in class.',
      'Try it: t… a… ll + est — tallest!',
    ],
    weDoWord: 'tallest',
    confusions: ['-er = comparing two. -est = the champion of all. "Taller" vs "tallest".'],
  },

  /* ── Phase 10 · Morphology ──────────────────────────────────────── */
  'prefixes': {
    headline: 'Prefixes: word parts that change meaning',
    soundChips: [{ g: 'un', type: 'p', label: 'un-' }, { g: 're', type: 'p', label: 're-' }],
    script: [
      'A prefix sits at the FRONT of a word and changes its meaning.',
      '"un-" means NOT or undo: tie → untie. "re-" means AGAIN: do → redo.',
      'Read the prefix, then the base word: un + tie — untie!',
    ],
    weDoWord: 'untie',
    confusions: [],
  },
  'suffixes-advanced': {
    headline: 'Big endings: -tion and -able',
    soundChips: [{ g: 'tion', type: 'sf', label: '-tion' }, { g: 'able', type: 'sf', label: '-able' }],
    script: [
      'The ending "-tion" sounds like /shun/: ac + tion — action!',
      'The ending "-able" means "can be done": read + able — readable, can be read!',
      'Spot the ending first, then read the base word in front of it.',
    ],
    weDoWord: 'action',
    confusions: ['"-tion" looks like "tee-on" but always says /shun/. Nation, station, action.'],
  },
  'multisyllable': {
    headline: 'Big words: read them chunk by chunk',
    soundChips: [],
    script: [
      'Long words are just small chunks holding hands: mar + ket — market!',
      'Clap the beats to find the chunks: "ju-ngle" has two claps.',
      'Read each chunk, then join them: mar + ket — market!',
    ],
    weDoWord: 'market',
    confusions: ['Don\'t rush — find the chunks first. Every chunk has one vowel sound.'],
  },
  'sight-highfreq': {
    headline: 'Sight words: tricky words to know by heart',
    soundChips: [],
    script: [
      'Some words don\'t follow the rules — like "because" and "friend".',
      'These are sight words: we learn to know them on sight, like a friend\'s face.',
      'Look at the shape, say it, spell it out loud, then say it again!',
    ],
    weDoWord: 'because',
    confusions: ['Don\'t sound these out letter by letter — the spelling plays tricks. Learn the whole word.'],
  },
};

/**
 * Get the mini-lesson for a curriculum stage id, or null.
 * @param {string} stageId
 */
export function getPhonicsLesson(stageId) {
  return PHONICS_LESSONS[stageId] ?? null;
}
