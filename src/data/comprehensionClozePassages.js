/**
 * PhonicsQuest – Comprehension Cloze (open cloze) content bank
 *
 * Real Paper 2-style comprehension cloze: pupils read a passage and TYPE
 * one suitable word for each blank.  No two-option choices, no slash
 * syntax — every blank has one clearly correct answer (with optional
 * accepted alternates for genuine synonyms).
 *
 * Passage shape:
 *   {
 *     id,                          // stable id, e.g. 'cc-p3-01'
 *     level,                       // 'P3' | 'P4' | 'P5' | 'P6'
 *     title,                       // human-readable title
 *     text,                        // passage text using {{1}}..{{N}} blanks
 *     blanks: [
 *       {
 *         num,                     // 1-based blank index
 *         answer,                  // primary correct answer (case-insensitive)
 *         accept,                  // [] of accepted alternates (synonyms only)
 *         hint,                    // one-sentence nudge, no answer give-away
 *         explanation,             // why the answer fits — shown after Check
 *         skill,                   // 'tense' | 'preposition' | 'connector' |
 *                                  // 'collocation' | 'context-clue' |
 *                                  // 'reference' | 'grammar-clue'
 *       },
 *       ... (5 blanks per passage)
 *     ],
 *   }
 */

export const COMPREHENSION_CLOZE_LEVELS = Object.freeze(['P3', 'P4', 'P5', 'P6']);

export const COMPREHENSION_CLOZE_SKILLS = Object.freeze([
  'tense',
  'preposition',
  'connector',
  'collocation',
  'context-clue',
  'reference',
  'grammar-clue',
]);

const P3 = [
  {
    id: 'cc-p3-01',
    level: 'P3',
    title: 'The New Library',
    text:
      'Mei Ling visited the new community library {{1}} Saturday. She was excited {{2}} see the bright reading corner. The librarian {{3}} her how to use the new self-checkout machine. After choosing two books, she sat {{4}} a soft beanbag near the window. The afternoon passed {{5}} quickly that she barely noticed the sun setting.',
    blanks: [
      { num: 1, answer: 'last', accept: [], hint: 'A time word that points to a recent past day.', explanation: '"last Saturday" tells us the visit happened on the most recent Saturday — a common past-time marker.', skill: 'tense' },
      { num: 2, answer: 'to', accept: [], hint: 'Which short word follows "excited"?', explanation: '"excited to see" is the natural pattern; "excited" is followed by "to" + base verb.', skill: 'collocation' },
      { num: 3, answer: 'showed', accept: ['taught'], hint: 'A past-tense verb meaning "demonstrated".', explanation: 'The librarian "showed her how to use" the machine — past simple, meaning to demonstrate.', skill: 'tense' },
      { num: 4, answer: 'on', accept: [], hint: 'Which preposition fits when you sit on a soft surface?', explanation: 'You sit "on" a beanbag — the preposition for being on top of a surface.', skill: 'preposition' },
      { num: 5, answer: 'so', accept: [], hint: 'A short connector that pairs with "that" to show degree.', explanation: '"so quickly that …" is the standard pattern that links degree to a result.', skill: 'connector' },
    ],
  },
  {
    id: 'cc-p3-02',
    level: 'P3',
    title: 'Sports Day Practice',
    text:
      'Our class trained hard {{1}} the upcoming Sports Day. Coach Tan reminded us to drink water {{2}} every drill. Adam was tired but he kept running {{3}} of giving up. Mei broke her own record {{4}} the long jump. We were all proud {{5}} our effort that afternoon.',
    blanks: [
      { num: 1, answer: 'for', accept: [], hint: 'Which preposition shows the purpose of an action?', explanation: '"trained for Sports Day" shows the reason or goal — "for" links an action to its purpose.', skill: 'preposition' },
      { num: 2, answer: 'after', accept: [], hint: 'A time word that means "following".', explanation: '"after every drill" tells us when they drank water — after each round of practice.', skill: 'preposition' },
      { num: 3, answer: 'instead', accept: [], hint: 'Which word pairs with "of" to show a different choice?', explanation: '"instead of giving up" shows the alternative action — he chose to keep running.', skill: 'collocation' },
      { num: 4, answer: 'in', accept: ['at'], hint: 'Which preposition is used for the event itself?', explanation: '"in the long jump" names the event Mei competed in — Singaporean usage also accepts "at".', skill: 'preposition' },
      { num: 5, answer: 'of', accept: [], hint: 'Which short word follows "proud"?', explanation: '"proud of" is the fixed pair — proud always takes "of" before what causes the pride.', skill: 'collocation' },
    ],
  },
  {
    id: 'cc-p3-03',
    level: 'P3',
    title: 'Saturday at the Wet Market',
    text:
      'Last Saturday, my grandmother and I went {{1}} the wet market. The fishmonger smiled {{2}} us and offered fresh prawns. Grandma chose a kilogram {{3}} kang kong for dinner. By lunchtime, the market was filled {{4}} the smell of fresh food. After Grandma paid, we {{5}} on the bus home.',
    blanks: [
      { num: 1, answer: 'to', accept: [], hint: 'Which preposition shows a destination after "went"?', explanation: '"went to the wet market" — "to" marks the place we travelled to.', skill: 'preposition' },
      { num: 2, answer: 'at', accept: [], hint: 'Which short word follows "smiled"?', explanation: '"smiled at us" is the standard pattern — you smile AT someone.', skill: 'collocation' },
      { num: 3, answer: 'of', accept: [], hint: 'A preposition that links amount and item.', explanation: '"a kilogram of kang kong" — "of" links the amount to the thing measured.', skill: 'grammar-clue' },
      { num: 4, answer: 'with', accept: [], hint: 'Which short word follows "filled"?', explanation: '"filled with" is the fixed pair — what fills something always follows "with".', skill: 'collocation' },
      { num: 5, answer: 'got', accept: [], hint: 'Past-tense verb that pairs with "on the bus".', explanation: '"got on the bus" is the standard expression for boarding a bus.', skill: 'collocation' },
    ],
  },
];

const P4 = [
  {
    id: 'cc-p4-01',
    level: 'P4',
    title: 'The Lost Dog',
    text:
      'Last Tuesday, Mei {{1}} a small brown dog wandering near the bus stop. The dog looked frightened {{2}} hungry, its tail tucked low. She gently knelt down and {{3}} out her hand. To her surprise, the dog approached her right {{4}}. Together, they walked to the nearby clinic, {{5}} a vet could examine the dog properly.',
    blanks: [
      { num: 1, answer: 'noticed', accept: ['spotted'], hint: 'A past-tense verb meaning "saw and paid attention to".', explanation: '"Mei noticed a small brown dog" — "noticed" describes seeing and paying attention. "spotted" is also accepted.', skill: 'tense' },
      { num: 2, answer: 'and', accept: [], hint: 'Which connector joins two adjectives describing the same dog?', explanation: '"frightened and hungry" — "and" joins two qualities of the same subject (the dog).', skill: 'connector' },
      { num: 3, answer: 'held', accept: [], hint: 'Past tense of a verb meaning "extended" — pairs with "out".', explanation: '"held out her hand" — past tense of "hold", part of the phrase "hold out".', skill: 'tense' },
      { num: 4, answer: 'away', accept: [], hint: 'An adverb meaning "immediately" — pairs with "right".', explanation: '"right away" means "immediately" — a fixed adverbial phrase.', skill: 'collocation' },
      { num: 5, answer: 'where', accept: [], hint: 'A relative word that refers back to "the clinic".', explanation: '"the clinic, where a vet could examine the dog" — "where" is the relative pronoun for places.', skill: 'reference' },
    ],
  },
  {
    id: 'cc-p4-02',
    level: 'P4',
    title: "Uncle Jamal's Bookshop",
    text:
      "Uncle Jamal's bookshop is squeezed {{1}} two restaurants on Joo Chiat Road. Every Sunday morning, he carefully unpacks new arrivals {{2}} a wooden crate. The smell of old paper {{3}} customers as soon as they walk through the door. He remembers his regular customers' tastes {{4}} suggests new titles for them. {{5}} the shop is small, it feels like a treasure chest of stories.",
    blanks: [
      { num: 1, answer: 'between', accept: [], hint: 'A preposition for being in the middle of two things.', explanation: '"squeezed between two restaurants" — "between" is used for two specific things on either side.', skill: 'preposition' },
      { num: 2, answer: 'from', accept: [], hint: 'Which preposition shows the source of something?', explanation: '"unpacks new arrivals from a wooden crate" — "from" marks where the books come out of.', skill: 'preposition' },
      { num: 3, answer: 'greets', accept: ['welcomes'], hint: 'A present-tense verb meaning "to welcome".', explanation: 'The smell "greets" customers — a vivid verb meaning to welcome them on arrival.', skill: 'context-clue' },
      { num: 4, answer: 'and', accept: [], hint: 'Which connector joins two things he does?', explanation: '"remembers their tastes and suggests new titles" — "and" joins two parallel actions.', skill: 'connector' },
      { num: 5, answer: 'Although', accept: ['Though'], hint: 'A connector that introduces an idea contrary to what follows.', explanation: '"Although the shop is small, it feels like a treasure chest" — "Although" sets up contrast between small and treasure-like.', skill: 'connector' },
    ],
  },
  {
    id: 'cc-p4-03',
    level: 'P4',
    title: 'The School Concert',
    text:
      'The auditorium was full {{1}} families and friends on concert night. Mei Ling waited backstage, her hands trembling {{2}} excitement. As the curtains lifted, the spotlight {{3}} on her violin. She took a deep breath and played the first note with confidence. By the end of the piece, the audience erupted {{4}} applause. The school principal came on stage to congratulate {{5}} performer.',
    blanks: [
      { num: 1, answer: 'of', accept: [], hint: 'Which short word follows "full"?', explanation: '"full of" is the fixed pair — what fills something always follows "full of".', skill: 'collocation' },
      { num: 2, answer: 'with', accept: [], hint: 'Which preposition follows "trembling"?', explanation: '"trembling with excitement" — "with" is the standard preposition after "trembling" to show the reason.', skill: 'collocation' },
      { num: 3, answer: 'shone', accept: ['shined'], hint: 'Past tense of "to shine".', explanation: '"the spotlight shone on her violin" — past tense, meaning the light fell brightly on it.', skill: 'tense' },
      { num: 4, answer: 'in', accept: ['into'], hint: 'A preposition that fits with "erupted".', explanation: '"erupted in applause" — "in" describes the kind of reaction that burst out.', skill: 'preposition' },
      { num: 5, answer: 'every', accept: ['each'], hint: 'A word meaning "all of them, one by one".', explanation: '"to congratulate every performer" — "every" emphasises that no performer was left out.', skill: 'grammar-clue' },
    ],
  },
];

const P5 = [
  {
    id: 'cc-p5-01',
    level: 'P5',
    title: 'A Small Act of Kindness',
    text:
      'Adam noticed an elderly man struggling {{1}} a heavy bag of groceries near the train station. Without hesitation, he stepped forward {{2}} offered to help. Together, they walked slowly toward the bus stop, chatting {{3}} the changes in their neighbourhood. The old man smiled, his eyes {{4}} with quiet gratitude. Adam realised that small acts of kindness {{5}} more meaningful than grand gestures.',
    blanks: [
      { num: 1, answer: 'with', accept: [], hint: 'Which preposition follows "struggling"?', explanation: '"struggling with a heavy bag" — "with" is the standard preposition after "struggle" to name what makes it hard.', skill: 'collocation' },
      { num: 2, answer: 'and', accept: [], hint: 'Which connector joins two actions Adam did?', explanation: '"stepped forward and offered to help" — "and" joins two parallel actions in the same moment.', skill: 'connector' },
      { num: 3, answer: 'about', accept: [], hint: 'Which preposition follows "chatting"?', explanation: '"chatting about the changes" — "about" introduces the topic of conversation.', skill: 'preposition' },
      { num: 4, answer: 'shining', accept: ['glowing'], hint: 'A present-participle verb describing eyes full of feeling.', explanation: '"his eyes shining with gratitude" — "shining" describes eyes that are bright with emotion.', skill: 'context-clue' },
      { num: 5, answer: 'were', accept: [], hint: 'A past-tense form of "be" for a plural subject.', explanation: '"small acts of kindness were more meaningful" — past tense, plural subject "acts" takes "were".', skill: 'tense' },
    ],
  },
  {
    id: 'cc-p5-02',
    level: 'P5',
    title: 'The Forgotten Umbrella',
    text:
      'Mei rushed out of the train station and only realised her mistake {{1}} she reached the bus stop. Her bright yellow umbrella, the one her grandmother had given her, had been left {{2}} the train. She bit her lip, weighing her options carefully. {{3}} the chance of recovering it was small, she decided to try. She walked back into the station {{4}} reported it at the lost-and-found counter. The kind staff member promised to call her {{5}} the umbrella turned up.',
    blanks: [
      { num: 1, answer: 'when', accept: [], hint: 'A subordinator that links the moment of realisation to a place.', explanation: '"only realised her mistake when she reached the bus stop" — "when" pinpoints the moment.', skill: 'connector' },
      { num: 2, answer: 'on', accept: [], hint: 'Which preposition fits for being aboard a train?', explanation: '"left on the train" — "on" is the standard preposition for being aboard a train (or bus).', skill: 'preposition' },
      { num: 3, answer: 'Although', accept: ['Though', 'Even though'], hint: 'A connector that introduces a fact contrary to her decision.', explanation: '"Although the chance was small, she decided to try" — "Although" sets up the contrast between low chance and her choice.', skill: 'connector' },
      { num: 4, answer: 'and', accept: [], hint: 'A connector joining two things she did at the station.', explanation: '"walked back … and reported it" — "and" joins two parallel actions in sequence.', skill: 'connector' },
      { num: 5, answer: 'if', accept: [], hint: 'A conditional connector — only call her when something happens.', explanation: '"call her if the umbrella turned up" — "if" introduces the condition that triggers the call.', skill: 'connector' },
    ],
  },
  {
    id: 'cc-p5-03',
    level: 'P5',
    title: 'The Heritage Walk',
    text:
      'Our class went on a heritage walk through Chinatown {{1}} part of our Social Studies project. Each student carried a notebook to record what they noticed {{2}} the way. As we passed a row of restored shophouses, the guide explained how the bright tiles {{3}} the wealth of the original owners. Mei sketched the carved doorways {{4}} fascinated her the most. By the end of the morning, we had filled our notebooks {{5}} both observations and questions.',
    blanks: [
      { num: 1, answer: 'as', accept: [], hint: 'A connector meaning "in the role of".', explanation: '"as part of our Social Studies project" — "as" introduces the role or purpose of the walk.', skill: 'preposition' },
      { num: 2, answer: 'along', accept: [], hint: 'Which short word pairs with "the way"?', explanation: '"along the way" is the fixed phrase for things noticed during a journey.', skill: 'collocation' },
      { num: 3, answer: 'reflected', accept: ['showed'], hint: 'A past-tense verb meaning "displayed" or "revealed".', explanation: '"the bright tiles reflected the wealth of the owners" — "reflected" means showed indirectly. "showed" is also accepted.', skill: 'context-clue' },
      { num: 4, answer: 'that', accept: ['which'], hint: 'A relative pronoun referring to the doorways.', explanation: '"the carved doorways that fascinated her the most" — "that" introduces a relative clause about the doorways.', skill: 'reference' },
      { num: 5, answer: 'with', accept: [], hint: 'Which short word follows "filled"?', explanation: '"filled our notebooks with observations" — "filled with" is the fixed pair.', skill: 'collocation' },
    ],
  },
];

const P6 = [
  {
    id: 'cc-p6-01',
    level: 'P6',
    title: 'The Climate Talk',
    text:
      'Last Friday, our cohort attended an inspiring talk by a marine biologist {{1}} had spent twenty years studying coral reefs. She began by showing us photographs of reefs that had once been vibrant but were now {{2}} bleached. Her voice was calm, yet every word carried a sense of urgency. {{3}} the end of her presentation, she invited us to consider the small choices we could make at home. We left the auditorium not only informed {{4}} also resolved to act. As we walked back to our classrooms, several students were already discussing {{5}} they could start a recycling drive.',
    blanks: [
      { num: 1, answer: 'who', accept: [], hint: 'A relative pronoun referring to the marine biologist (a person).', explanation: '"a marine biologist who had spent twenty years studying" — "who" introduces a relative clause about a person.', skill: 'reference' },
      { num: 2, answer: 'completely', accept: ['entirely'], hint: 'An adverb of degree meaning "totally".', explanation: '"now completely bleached" — "completely" intensifies the adjective and contrasts with "vibrant".', skill: 'context-clue' },
      { num: 3, answer: 'By', accept: [], hint: 'A preposition that means "before or at" a moment.', explanation: '"By the end of her presentation" — "By" sets the time boundary up to the end of the talk.', skill: 'preposition' },
      { num: 4, answer: 'but', accept: [], hint: 'The second half of the correlative pair "not only … ___ also".', explanation: '"not only informed but also resolved" — "not only X but also Y" is the standard correlative pair.', skill: 'connector' },
      { num: 5, answer: 'how', accept: [], hint: 'A wh-word that introduces an indirect question about a method.', explanation: '"discussing how they could start a recycling drive" — "how" introduces the embedded question.', skill: 'reference' },
    ],
  },
  {
    id: 'cc-p6-02',
    level: 'P6',
    title: 'The Heirloom Watch',
    text:
      "When Tim opened the small wooden box, his breath caught at the sight of his grandfather's silver watch. The hands had stopped {{1}} eight, frozen in time, but the engraving on the back still gleamed under the light. {{2}} reading the inscription aloud, his voice trembled with quiet emotion. His grandmother explained that the watch had been passed {{3}} from generation to generation. {{4}} its age, the timepiece had remained remarkably well preserved. Tim promised himself that he would care for it {{5}} the same dedication his grandfather once had.",
    blanks: [
      { num: 1, answer: 'at', accept: [], hint: 'Which preposition is used with a specific clock time?', explanation: '"stopped at eight" — "at" is the preposition for a specific point in time.', skill: 'preposition' },
      { num: 2, answer: 'After', accept: ['On'], hint: 'A time-relation word that means "once something has happened".', explanation: '"After reading the inscription aloud" — "After" means once that action was complete.', skill: 'connector' },
      { num: 3, answer: 'down', accept: [], hint: 'Which short word completes the phrase "passed ___" for inheritance?', explanation: '"passed down from generation to generation" — "down" is the fixed phrasal-verb particle for inheritance.', skill: 'collocation' },
      { num: 4, answer: 'Despite', accept: ['In spite of'], hint: 'A formal preposition meaning "even with".', explanation: '"Despite its age, the timepiece had remained well preserved" — "Despite" introduces a noun phrase that contrasts with the main clause.', skill: 'preposition' },
      { num: 5, answer: 'with', accept: [], hint: 'Which preposition shows the manner of caring for something?', explanation: '"care for it with the same dedication" — "with" shows the manner or quality of the action.', skill: 'preposition' },
    ],
  },
  {
    id: 'cc-p6-03',
    level: 'P6',
    title: 'The Practice Paper',
    text:
      "Mei stared at the practice paper, her pencil hovering above the first comprehension question. {{1}} the questions seemed familiar, none felt straightforward. She reminded herself of Mr Lim's advice — to underline keywords carefully {{2}} attempting any answer. With a steadying breath, she began. By the time the timer rang, her hand was tired {{3}} her mind was clearer than before. She glanced over her work, double-checking each response carefully {{4}} the final bell rang. The result, when it arrived a week later, was {{5}} encouraging than she had expected.",
    blanks: [
      { num: 1, answer: 'Although', accept: ['Though', 'While'], hint: 'A connector that introduces a contrast — familiar yet difficult.', explanation: '"Although the questions seemed familiar, none felt straightforward" — "Although" sets up the contrast between recognition and difficulty.', skill: 'connector' },
      { num: 2, answer: 'before', accept: [], hint: 'A time-order word — underline first, answer next.', explanation: '"underline keywords carefully before attempting any answer" — "before" gives the order: underline first, then answer.', skill: 'connector' },
      { num: 3, answer: 'but', accept: [], hint: 'A connector that contrasts a tired hand with a clearer mind.', explanation: '"her hand was tired but her mind was clearer" — "but" links two contrasting clauses.', skill: 'connector' },
      { num: 4, answer: 'until', accept: [], hint: 'A time connector meaning "up to the moment".', explanation: '"double-checking each response carefully until the final bell rang" — "until" marks the end-point of the action.', skill: 'connector' },
      { num: 5, answer: 'more', accept: [], hint: 'A short word that pairs with "than" in a comparison.', explanation: '"more encouraging than she had expected" — "more … than" is the fixed comparative pair.', skill: 'grammar-clue' },
    ],
  },
];

export const COMPREHENSION_CLOZE_PASSAGES = Object.freeze({ P3, P4, P5, P6 });

/**
 * Get every passage for a given level (frozen array).
 * @param {string} level — 'P3' | 'P4' | 'P5' | 'P6'
 * @returns {object[]}
 */
export function getComprehensionClozePassages(level) {
  return COMPREHENSION_CLOZE_PASSAGES[level] || [];
}

/**
 * Flat list of every passage across all levels.
 * @returns {object[]}
 */
export function getAllComprehensionClozePassages() {
  return COMPREHENSION_CLOZE_LEVELS.flatMap(lv => COMPREHENSION_CLOZE_PASSAGES[lv] || []);
}

/**
 * Validate a passage bank for content-integrity issues. Used by tests
 * (and callable manually) to catch malformed entries early.
 * @param {object} bank — same shape as COMPREHENSION_CLOZE_PASSAGES
 * @returns {string[]} list of human-readable problems (empty = OK)
 */
export function validateComprehensionClozeBank(bank = COMPREHENSION_CLOZE_PASSAGES) {
  const problems = [];
  const seenIds = new Set();
  const blankToken = /\{\{(\d+)\}\}/g;
  const slashChoice = /\{\d+:[^}/]+\/[^}]+\}/; // legacy two-option syntax

  for (const level of COMPREHENSION_CLOZE_LEVELS) {
    const list = bank?.[level];
    if (!Array.isArray(list)) {
      problems.push(`${level}: missing or not an array`);
      continue;
    }
    if (list.length < 3) {
      problems.push(`${level}: needs at least 3 passages, has ${list.length}`);
    }
    for (const p of list) {
      const tag = `${level}/${p?.id || '<no-id>'}`;
      if (!p?.id) problems.push(`${tag}: missing id`);
      else if (seenIds.has(p.id)) problems.push(`${tag}: duplicate id`);
      else seenIds.add(p.id);
      if (p?.level !== level) problems.push(`${tag}: level field "${p?.level}" does not match bucket ${level}`);
      if (!p?.title) problems.push(`${tag}: missing title`);
      if (typeof p?.text !== 'string' || !p.text.trim()) problems.push(`${tag}: missing text`);
      if (slashChoice.test(p?.text || '')) problems.push(`${tag}: text contains legacy {n:a/b} two-option syntax`);

      const tokens = [...(p?.text || '').matchAll(blankToken)].map(m => Number(m[1]));
      if (tokens.length !== 5) problems.push(`${tag}: expected 5 blanks, found ${tokens.length}`);
      const expected = [1, 2, 3, 4, 5];
      if (JSON.stringify(tokens) !== JSON.stringify(expected)) {
        problems.push(`${tag}: blank tokens must be {{1}}..{{5}} in order, got ${JSON.stringify(tokens)}`);
      }

      if (!Array.isArray(p?.blanks) || p.blanks.length !== 5) {
        problems.push(`${tag}: blanks array must have exactly 5 entries`);
        continue;
      }
      for (const b of p.blanks) {
        const btag = `${tag} blank #${b?.num}`;
        if (typeof b?.num !== 'number' || b.num < 1 || b.num > 5) problems.push(`${btag}: bad num`);
        if (typeof b?.answer !== 'string' || !b.answer.trim()) problems.push(`${btag}: empty answer`);
        if (typeof b?.answer === 'string' && b.answer.includes('/')) problems.push(`${btag}: answer contains "/" (no two-option choices allowed)`);
        if (!Array.isArray(b?.accept)) problems.push(`${btag}: accept must be an array`);
        if (typeof b?.hint !== 'string' || !b.hint.trim()) problems.push(`${btag}: missing hint`);
        if (typeof b?.explanation !== 'string' || !b.explanation.trim()) problems.push(`${btag}: missing explanation`);
        if (!COMPREHENSION_CLOZE_SKILLS.includes(b?.skill)) problems.push(`${btag}: unknown skill "${b?.skill}"`);
      }
      const nums = p.blanks.map(b => b.num).sort((a, b) => a - b);
      if (JSON.stringify(nums) !== JSON.stringify(expected)) {
        problems.push(`${tag}: blank.num values must be 1..5, got ${JSON.stringify(nums)}`);
      }
    }
  }

  return problems;
}
