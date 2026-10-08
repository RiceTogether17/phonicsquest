/**
 * Clues a person wrote for Cloze Castle blanks.
 *
 * Before a child fills a blank, the clue hunt asks them to tap the word in the
 * passage that decides it. Clues derived by code (the words to the right of
 * the blank) pointed at the wrong evidence — "likes to play" instead of "Tom"
 * — so they are flagged `generated` and never asked (see clueEngine.js). This
 * table is the evidence a teacher would underline, one clue per blank:
 *
 *   pronouns          — the person or thing the pronoun stands for;
 *   agreement         — the subject;
 *   tenses            — the time words;
 *   a / an            — the next word, and its first sound;
 *   the               — the earlier mention that makes the noun known.
 *
 * Keys are passage seed ids, so a revision round (the same passage with a new
 * lead sentence) inherits its seed's clues. Entry i is the clue for blank i,
 * or null where no single word decides the blank — a later blank whose time
 * word was already hunted, or a blank with two right answers.
 *
 * Spans are matched word by word anywhere in the passage, so a span never
 * contains a little word like "the" or "a": tapping any "the" would count.
 * Explanations at P1–P2 are written for a six-year-old.
 *
 * Second-reader follow-up, 2026-10-08 (D1). Starts with the P1–P3 categories.
 */

const LEVELS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

/** The GrammarMaster expansion passages are copied into every level. */
function atLevels(stem, clues) {
  return Object.fromEntries(LEVELS.map((level) => [`gm-${level}-${stem}`, clues]));
}

/** Pronouns: tap the person or thing the pronoun stands for. */
const standsFor = (spans, explanation, partial = []) => ({
  prompt: 'Who or what does the missing word stand for? Tap it.',
  acceptableSpans: spans,
  partialSpans: partial,
  clueType: 'antecedent',
  explanation,
});

/** Subject–verb agreement: tap the subject. */
const subject = (spans, explanation, partial = []) => ({
  prompt: 'Who or what is doing the action? Tap that word.',
  acceptableSpans: spans,
  partialSpans: partial,
  clueType: 'subject-clue',
  explanation,
});

/** Tenses: tap the time words. */
const time = (spans, explanation, partial = [], prompt = 'Tap the time words that tell you when this happens.') => ({
  prompt,
  acceptableSpans: spans,
  partialSpans: partial,
  clueType: 'time-marker',
  explanation,
});

/** "a" or "an": tap the word right after the blank and listen to its first sound. */
const nextSound = (word, explanation) => ({
  prompt: 'Say the word just after the blank. What sound does it start with? Tap that word.',
  acceptableSpans: [word],
  partialSpans: [],
  clueType: 'next-word-sound',
  explanation,
});

/** "the": tap the earlier mention that tells us which one. */
const known = (spans, explanation, partial = []) => ({
  prompt: 'Have we already met this thing in the passage? Tap the words that tell you.',
  acceptableSpans: spans,
  partialSpans: partial,
  clueType: 'known-noun',
  explanation,
});

const NOW = 'Which word tells you this is happening now? Tap it.';
const ALREADY = 'Tap the word that tells you this already happened.';
const WHEN = 'Tap the words that tell you when this was happening.';

/** Cloze Castle — keyed by `passages.js` / `passagesExtra` seed ids. */
export const GRAMMAR_CLOZE_CLUES = {
  // ── Articles ───────────────────────────────────────────────────────────
  // Blanks 0 and 3 have inline clues in passages.js.
  'g-p1-art-01': [
    null,
    nextSound('father', '"father" starts with the sound "f", so we use "a": a father.'),
    nextSound('big', '"big" starts with the sound "b", so we use "a": a big house.'),
    null,
  ],
  'g-p1-art-02': [
    nextSound('apple', '"apple" starts with the sound "a", so we use "an": an apple.'),
    nextSound('banana', '"banana" starts with the sound "b", so we use "a": a banana.'),
    known(['apple'], 'We already said "an apple". Now we know which apple, so we say "The apple".'),
    known(['banana'], 'We already said "a banana". Now we know which banana, so we say "The banana".'),
  ],
  // Blank 2 takes "The" or "A"; blank 3 is "the" wall of a known room.
  'g-p1-art-03': [
    nextSound('teacher', '"teacher" starts with the sound "t", so we use "a": a teacher.'),
    nextSound('big', '"big" starts with the sound "b", so we use "a": a big desk.'),
    null,
    null,
  ],
  'gx-p1-articles-01': [
    nextSound('apple', '"apple" starts with the sound "a", so we use "an": an apple.'),
    nextSound('bun', '"bun" starts with the sound "b", so we use "a": a bun.'),
    known(['bun'], 'We already met this bun: her friend packed it. Now we know which bun, so we say "the bun".', ['packed']),
  ],
  'gx-p2-articles-26': [
    nextSound('pencil', '"pencil" starts with the sound "p", so we use "a": a pencil case.'),
    known(['pencil case'], 'I already bought it in the first sentence, so we know which pencil case: "The pencil case".', ['bought']),
    nextSound('eraser', '"eraser" starts with the sound "e", so we use "an": an eraser.'),
  ],
  'gx-p2-articles-27': [
    nextSound('water', '"water" starts with the sound "w", so we use "a": a water bottle.'),
    known(['water bottle'], 'Mei already found this water bottle, so we know which one: "The water bottle".', ['found']),
    nextSound('umbrella', '"umbrella" starts with the sound "u", so we use "an": an umbrella.'),
  ],
  'gx-p2-articles-28': [
    nextSound('storybook', '"storybook" starts with the sound "s", so we use "a": a storybook.'),
    nextSound('activity', '"activity" starts with the sound "a", so we use "an": an activity book.'),
    known(['storybook'], 'We already said I borrowed a storybook. Now we know which one: "The storybook".', ['borrowed']),
  ],
  'gx-p2-articles-29': [
    nextSound('orange', '"orange" starts with the sound "o", so we use "an": an orange.'),
    nextSound('biscuit', '"biscuit" starts with the sound "b", so we use "a": a biscuit.'),
    known(['orange'], 'Mum already packed this orange, so we know which one: "The orange".', ['packed']),
    known(['biscuit'], 'This is the biscuit Mum packed, so we know which one: "the biscuit".', ['packed']),
  ],
  'gx-p2-articles-30': [
    nextSound('rabbit', '"rabbit" starts with the sound "r", so we use "a": a rabbit.'),
    known(['Snowy'], 'We already met this rabbit. It is Snowy, so we know which one: "The rabbit".', ['rabbit']),
    known(['Snowy'], 'It is still Snowy, the rabbit we already know, so we say "the rabbit".', ['rabbit']),
  ],
  // Blank 2 takes "a" or "the" trophy.
  'gx-p2-articles-31': [
    nextSound('exciting', '"exciting" starts with the sound "e", so we use "an". Listen to the very next word, not "race".'),
    known(['exciting race'], 'We already met this race: the exciting race on the field. Now we know which one, so we say "The race".'),
    null,
  ],
  'gx-p3-articles-21': [
    nextSound('small', '"small" starts with the sound "s", so we use "a". Listen to the very next word, even when it describes the thing.'),
    nextSound('apple', '"apple" starts with the sound "a", so we use "an": an apple.'),
    known(['apple'], 'This is the apple in my hand, which we already know about, so we say "The apple".', ['carry']),
  ],
  'gx-p3-articles-22': [
    nextSound('snack', '"snack" starts with the sound "s", so we use "a": a snack.'),
    nextSound('sandwich', '"sandwich" starts with the sound "s", so we use "a": a sandwich.'),
    known(['sandwich'], 'This is the sandwich she made today, so we know which one: "The sandwich".', ['made']),
  ],
  'gx-p3-articles-23': [
    nextSound('short', '"short" starts with the sound "sh", so we use "a": a short story.'),
    nextSound('adventure', '"adventure" starts with the sound "a", so we use "an": an adventure book.'),
    nextSound('brave', '"brave" starts with the sound "b", so we use "a": a brave knight.'),
  ],
  'gx-p3-articles-24': [
    nextSound('whistle', '"whistle" starts with the sound "w", so we use "a": a whistle.'),
    nextSound('stopwatch', '"stopwatch" starts with the sound "s", so we use "a": a stopwatch.'),
    known(['whistle'], 'This is the whistle Coach brings, which we already know about, so we say "The whistle".', ['brings']),
  ],
  'gx-p3-articles-25': [
    nextSound('omelette', '"omelette" starts with the sound "o", so we use "an": an omelette.'),
    nextSound('sausage', '"sausage" starts with the sound "s", so we use "a": a sausage.'),
    known(['sausage'], 'This is the sausage Dad fried, so we know which one: "The sausage".', ['fried']),
  ],
  'gx-p3-articles-26': [
    nextSound('comic', '"comic" starts with the sound "k", so we use "a": a comic book.'),
    nextSound('astronaut', '"astronaut" starts with the sound "a", so we use "an": an astronaut.'),
    known(['comic book'], 'This is the comic book I borrowed, so we know which one: "The comic".', ['borrowed']),
  ],

  // ── Pronouns ───────────────────────────────────────────────────────────
  'g-p1-pro-01': [
    standsFor(['Tom'], 'Tom is one boy, so we use "He".'),
    standsFor(['Sara'], 'Sara is one girl, so we use "She".', ['her']),
    standsFor(['I'], '"Tom, Sara and I" means the three of us, and that includes me, so we use "We".', ['Tom', 'Sara']),
  ],
  'g-p1-pro-02': [
    standsFor(['cat'], 'The cat is one animal, so we use "It".'),
    standsFor(['dog'], 'The dog is one animal, so we use "It".'),
    standsFor(['I', 'brother'], 'My brother and I both love the pets — they are "our" pets — so we use "We".', ['our']),
  ],
  // Blank 1 is the same "Ali and I" again; blank 2 takes "His" or "My".
  'g-p1-pro-03': [
    standsFor(['Ali', 'I'], '"Ali and I" means Ali and me together, so we use "We".'),
    null,
    null,
  ],
  'gx-p1-pronouns-02': [
    standsFor(['Amir'], 'Amir is one boy, and he placed the books, so we use "he".'),
    standsFor(['Amir'], 'Ms Tan thanked Amir. He comes after the doing word "thanked", so we say "him", not "he".', ['thanked']),
    standsFor(['Ms Tan'], 'Ms Tan is one woman, and she checked the list, so we use "she".'),
  ],
  'gx-p2-pronouns-04': [
    standsFor(['Maya'], 'Maya is one girl, and she cheered, so we use "she".'),
    standsFor(['Maya'], 'Mr Lim praised Maya. She comes after the doing word "praised", so we say "her".', ['praised']),
    standsFor(['Mr Lim'], 'Mr Lim is one man, so we use "he".', ['coach']),
  ],
  'gx-p3-pronouns-08': [
    standsFor(['Mr Rahman'], 'Mr Rahman is one man, and he showed us the maps, so we use "he".', ['guide']),
    standsFor(['Mr Rahman'], 'We thanked Mr Rahman. He comes after the doing word "thanked", so we say "him".', ['guide']),
    standsFor(['We', 'our'], '"We thanked" and "our notes" tell us the speakers are a group that includes me, so we use "we".'),
  ],
  // Clues for GrammarMaster pronouns-1 are inline in passages.js.
  ...atLevels('pronouns-2', [
    standsFor(['cousins'], 'My cousins are more than one person, and they brought the snacks, so we use "they".'),
    standsFor(['sister', 'me'], '"My sister and me" includes me, and it comes after "for", so we use "us".'),
    standsFor(['cousins'], 'Mum thanked my cousins. They come after "thanked", so we say "them", not "they".', ['thanked']),
  ]),
  ...atLevels('pronouns-3', [
    standsFor(['Mr Tan'], 'Mr Tan is one man, and he checked the model and smiled, so we use "He".'),
    standsFor(['model'], 'Our model is one thing, so we use "it".'),
    standsFor(['partner', 'I'], '"My partner and I" includes me, so we use "we".'),
  ]),

  // ── Subject–verb agreement ─────────────────────────────────────────────
  'g-p1-sva-02': [
    subject(['I'], 'With "I", the doing word has no -s: "I eat".'),
    subject(['Mum'], 'Mum is one person, so the doing word takes -s: "Mum cooks".'),
    subject(['We'], 'With "We", we use "are": "We are happy".'),
  ],
  'g-p1-sva-03': [
    subject(['teacher'], 'My teacher is one person, so we use "is".'),
    subject(['students'], '"Students" means more than one, so the doing word has no -s: "work".'),
    subject(['I'], 'With "I", we always use "am": "I am".'),
  ],
  'gx-p1-svAgreement-03': [
    subject(['monitor'], '"Every monitor" means each one on its own, so the doing word takes -s: "wipes".', ['Every']),
    subject(['prefects'], '"Prefects" means more than one, so the doing word has no -s: "stand".'),
    subject(['pupil'], '"Each pupil" means one pupil at a time, so we use "has", not "have".', ['Each']),
  ],
  'g-p2-sva-01': [
    subject(['Mrs Lin'], 'Mrs Lin is one person, so the doing word takes -s: "shops".'),
    subject(['She'], '"She" is one person, so the doing word takes -s: "buys".'),
    subject(['sellers'], '"Sellers" means more than one, so we use "are".'),
  ],
  'g-p2-sva-02': [
    subject(['canteen'], 'The canteen is one place, so we use "is".'),
    subject(['Ali', 'Tom'], '"Ali and Tom" are two people, so we use "have", not "has".'),
    subject(['teacher'], 'Their teacher is one person, so we use "has".'),
  ],
  'g-p2-sva-03': [
    subject(['I'], 'With "I", we always use "am": "I am".'),
    subject(['friend'], 'My best friend is one person, so the doing word takes -s: "sits".'),
    subject(['We'], 'With "We", the doing word has no -s: "We do".'),
  ],
  'g-p2-sva-04': [
    subject(['group'], '"The reading group" is one group meeting together, so the doing word takes -s: "meets".'),
    subject(['member'], '"Each member" means one person at a time, so the doing word takes -s: "keeps".', ['Each']),
    subject(['friend', 'I'], '"My friend and I" are two people, so we use "are".'),
  ],
  'g-p2-sva-05': [
    subject(['sunflower'], 'The sunflower is one plant, so we use "is" (or "was").'),
    subject(['roses'], '"Roses" means more than one, so we use "are".'),
    subject(['monitor'], 'Our class monitor is one person, so the doing word takes -s: "checks".'),
  ],
  'g-p2-sva-06': [
    subject(['boys'], '"Boys" means more than one, so we use "are".'),
    subject(['captain'], 'Our captain is one person, so the doing word takes -s: "gives".'),
    subject(['I'], 'With "I", we always use "am": "I am".'),
  ],
  'gx-p2-svAgreement-03': [
    subject(['prefect'], '"Each prefect" means one at a time, so we use "has".', ['Each']),
    subject(['ushers'], '"Ushers" means more than one, so the doing word has no -s: "wait".'),
    subject(['principal'], 'Our principal is one person, so the doing word takes -s: "explains".'),
  ],
  'gx-p3-svAgreement-03': [
    subject(['student'], '"Each student" means one at a time, so the doing word takes -s: "writes".', ['Each']),
    subject(['pages'], '"Pages" means more than one, so we use "are".'),
    subject(['teacher'], 'Our teacher is one person, so the doing word takes -s: "adds".'),
  ],
  // Clues for GrammarMaster svAgreement-1 are inline in passages.js.
  ...atLevels('svAgreement-2', [
    subject(['monitor'], '"Each monitor" means one at a time, so we use "has".', ['Each']),
    subject(['volunteers'], '"Volunteers" means more than one, so the doing word has no -s: "arrange".'),
    subject(['librarian'], 'The librarian is one person, so the doing word takes -s: "posts".'),
  ]),
  ...atLevels('svAgreement-3', [
    subject(['coach'], 'Our coach is one person, so the doing word takes -s: "gives".'),
    subject(['players'], '"Players" means more than one, so the doing word has no -s: "respond".'),
    subject(['Mei'], 'Mei is one person, so the doing word takes -s: "updates".'),
  ]),

  // ── Simple past ────────────────────────────────────────────────────────
  // One time word sets the tense for the whole passage, so only the first
  // blank is hunted; asking for "Yesterday" three times teaches nothing new.
  'g-p1-sp-02': [time(['Last week'], '"Last week" tells us it already happened, so the doing word must be in the past, like "baked".'), null, null],
  'g-p1-sp-03': [time(['Yesterday'], '"Yesterday" tells us it already happened, so the doing word must be in the past, like "walked".'), null, null],
  'gx-p1-simplePast-04': [time(['Yesterday'], '"Yesterday" tells us it already happened, so "plant" becomes "planted".'), null, null],
  'g-p2-sp-02': [time(['Last night'], '"Last night" tells us it already happened, so "wash" becomes "washed".'), null, null],
  'g-p2-sp-03': [time(['last week'], '"Last week" tells us it already happened, so "have" becomes "had".'), null, null],
  'g-p2-sp-04': [time(['Yesterday'], '"Yesterday" tells us it already happened, so "decorate" becomes "decorated".'), null, null],
  'g-p2-sp-05': [time(['Last weekend'], '"Last weekend" tells us it already happened, so "visit" becomes "visited".'), null, null],
  'g-p2-sp-06': [time(['Last Tuesday'], '"Last Tuesday" tells us it already happened, so "walk" becomes "walked".'), null, null],
  'gx-p2-simplePast-01': [
    time(['rang'], '"The bell rang" already happened, so the next thing the pupils did is in the past too: "walked".', [], ALREADY),
    null,
    null,
  ],
  'gx-p3-simplePast-27': [time(['Last Friday'], '"Last Friday" tells us it already happened, so "go" becomes "went".'), null, null, null],
  'gx-p3-simplePast-28': [time(['Yesterday'], '"Yesterday" tells us it already happened, so "hold" becomes "held".'), null, null, null],
  'gx-p3-simplePast-29': [time(['Last Saturday'], '"Last Saturday" tells us it already happened, so "plan" becomes "planned".'), null, null, null],
  'gx-p3-simplePast-30': [time(['Last Monday'], '"Last Monday" tells us it already happened, so "wait" becomes "waited".'), null, null, null],
  'gx-p3-simplePast-31': [time(['Last Wednesday'], '"Last Wednesday" tells us it already happened, so "show" becomes "showed".'), null, null, null],
  'gx-p3-simplePast-32': [time(['Last Friday'], '"Last Friday" tells us it already happened, so "hold" becomes "held".'), null, null, null],

  // ── Present continuous ─────────────────────────────────────────────────
  'g-p2-pc-01': [time(['now'], '"Now" tells us it is happening at this moment, and the children are more than one, so we use "are building".', [], NOW), null, null],
  'g-p2-pc-02': [time(['Now'], '"Now" tells us it is happening at this moment, so we use "are eating".', ['rung'], NOW), null, null],
  'g-p2-pc-03': [time(['Look'], '"Look!" tells us it is happening right now, so we use "is cooking".', [], NOW), null, null],
  'g-p2-pc-04': [time(['Right now'], '"Right now" tells us it is happening at this moment, so we use "are standing".', [], NOW), null, null],
  'g-p2-pc-05': [time(['moment'], '"At the moment" means right now, so we use "am making".', [], NOW), null, null],
  'g-p2-pc-06': [time(['now'], '"Now" tells us it is happening at this moment, so we use "is serving".', [], NOW), null, null],
  'gx-p2-presentCont-02': [time(['now'], '"Now" tells us it is happening at this moment, so we use "are pouring".', [], NOW), null, null],

  // ── Past continuous: the past is set once; was or were is the subject ──
  'g-p3-pc-01': [
    subject(['we'], '"It started to rain" tells us this was in the past, and "we" is more than one, so we use "were".', ['started']),
    subject(['children'], '"The bell rang" is in the past, and "children" means more than one, so we use "were".', ['rang']),
    subject(['I'], '"Mum called me" is in the past, and with "I" we use "was".', ['called']),
  ],
  'g-p3-pc-02': [
    subject(['principal'], '"The fire alarm rang" is in the past, and the principal is one person, so we use "was".', ['rang']),
    subject(['pupils'], '"Pupils" means more than one, so we use "were".'),
    subject(['prefect'], 'The prefect is one person, so we use "was".'),
  ],
  'g-p3-pc-03': [
    subject(['boys'], '"Boys" means more than one, and "she heard" tells us it was in the past, so we use "were".', ['heard']),
    subject(['girls'], '"Girls" means more than one, so we use "were".'),
    subject(['teacher'], 'The teacher is one person, and "she heard" is in the past, so we use "was".', ['heard']),
  ],
  'gx-p3-pastCont-01': [
    subject(['we'], '"This morning" is already over, and "we" is more than one, so we use "were".', ['morning']),
    subject(['Mei'], 'Mei is one person, so we use "was".'),
    subject(['teachers'], '"Teachers" means more than one, so we use "were".'),
  ],

  // ── Tense awareness: each blank has its own time words ────────────────
  'g-p1-ta-01': [
    time(['Right now'], '"Right now" tells us it is happening at this moment: "I am reading".'),
    time(['Yesterday'], '"Yesterday" tells us it already happened, so "go" becomes "went".'),
    time(['Every day'], '"Every day" tells us it happens again and again, so we use "eat".'),
  ],
  'g-p1-ta-02': [
    time(['Look'], '"Look!" tells us it is happening right now, so we use "is".', [], NOW),
    time(['Last week'], '"Last week" tells us it already happened, so "tell" becomes "told".'),
    time(['Every morning'], '"Every morning" tells us it happens again and again, so we use "say".'),
  ],
  // "Saturday" is in both time phrases; "Every" and "Last" are what differ.
  'g-p1-ta-03': [
    time(['Every'], '"Every Saturday" tells us it happens again and again, so we use "go".', ['Saturday']),
    time(['Last'], '"Last Saturday" tells us it already happened, so "go" becomes "went".', ['Saturday']),
    time(['Now'], '"Now" tells us it is true at this moment, so we use "am".'),
  ],
  'gx-p1-tenseAwareness-05': [
    time(['Every morning'], '"Every morning" tells us it happens again and again, and Dan is one person, so we use "takes".'),
    time(['Yesterday'], '"Yesterday" tells us it already happened, so we use "missed".', ['woke']),
    time(['Tomorrow'], '"Tomorrow" tells us it has not happened yet, so we use "will wake".'),
  ],
  'gx-p3-tenseAwareness-02': [
    time(['called'], '"When the office called" tells us this was going on in the past when something else happened, so we use "was practising".', ['office'], WHEN),
    time(['Yesterday'], '"Yesterday" tells us it is finished, so we use the past: "printed".'),
    time(['Tomorrow'], '"Tomorrow" tells us it has not happened yet, so we use "will add".'),
  ],
  'gx-p3-tenseAwareness-16': [
    time(['right now'], '"Right now" tells us it is happening at this moment, so we use "am organising".'),
    time(['yesterday'], '"Yesterday" tells us it is finished, so we use the past: "completed".'),
    time(['tomorrow'], '"Tomorrow" tells us it has not happened yet, so we use "will submit".'),
  ],
  'gx-p3-tenseAwareness-17': [
    time(['every Saturday'], '"Every Saturday" tells us it happens again and again, so we use "visit".'),
    time(['last weekend'], '"Last weekend" tells us it is finished, so we use the past: "tried".'),
    time(['next time'], '"Next time" is in the future, so we use "will explore".'),
  ],
  'gx-p3-tenseAwareness-18': [
    time(['moment'], '"At this moment" means right now, and Lina is one person, so we use "is practising".'),
    time(['last week'], '"Last week" tells us it is finished, so we use the past: "performed".'),
    time(['next month'], '"Next month" is in the future, so we use "will audition".'),
  ],
  'gx-p3-tenseAwareness-19': [
    time(['right now'], '"Right now" tells us it is happening at this moment, so we use "am feeding".'),
    time(['yesterday'], '"Yesterday" tells us it is finished, so we use the past: "examined".'),
    time(['tomorrow'], '"Tomorrow" tells us it has not happened yet, so we use "will take".'),
  ],
  'gx-p3-tenseAwareness-20': [
    time(['earlier today'], '"Earlier today" is already over, so we use the past: "froze".'),
    time(['yesterday'], '"Yesterday" tells us it is finished, so we use the past: "fetched".'),
    time(['tomorrow'], '"Tomorrow" tells us it has not happened yet, so we use "will install".'),
  ],
};

/**
 * Put each authored clue on its blank, replacing any derived one there.
 * Works on either bank shape (level → category → list, or category → level →
 * list) and matches by seed id, falling back to id before seeds are assigned.
 */
export function attachAuthoredClues(bank, table) {
  for (const group of Object.values(bank || {})) {
    for (const list of Object.values(group || {})) {
      for (const passage of list || []) {
        const authored = table[passage.seedId || passage.id];
        if (!authored) continue;
        const byBlank = new Map((passage.clues || []).map((c) => [c.blankIndex, c]));
        authored.forEach((clue, blankIndex) => {
          if (clue) byBlank.set(blankIndex, { blankIndex, ...clue });
        });
        passage.clues = [...byBlank.values()].sort((a, b) => a.blankIndex - b.blankIndex);
      }
    }
  }
}
