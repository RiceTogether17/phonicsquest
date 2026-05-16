/**
 * PhonicsQuest – Sentence Forge Quest Data
 *
 * Sentences are shuffled word-by-word for the player to re-order.
 * Each level targets specific WORD-ORDER patterns that challenge Singapore
 * primary students — progressing from core SVO order to complex inversion
 * and embedding. Contexts are drawn from Singapore school and community life.
 *
 * WORD-ORDER PROGRESSION
 * ──────────────────────────────────────────────────────────────────────────────
 * P1  Core SVO order · Noun + be + Adj/Place · Article placement in noun groups
 * P2  Fronted time adverbial position · Cause-clause (because) placement ·
 *     Compound sentence order (and / but / so)
 * P3  Fronted temporal subordinate (When/After/Before + clause, …) ·
 *     Mid-sentence adverb placement · Comparative structure (adj + -er + than)
 * P4  Modal-verb order (must not / should always) · Fronted cause clause
 *     (Because he…, he…) · So + adj + that result structure
 * P5  Fronted concessive phrase (Despite / Without + NP, …) ·
 *     Fronted participial phrase (Having + PP, …) · Not only … but also order
 * P6  Subject-auxiliary inversion (Not only did …) · Inverted conditional
 *     (Had she …, she would …) · Embedded relative clause (…, which …, …)
 */

export const SENTENCE_LEVEL_LABELS = {
  1: 'P1 – Starter',
  2: 'P2 – Explorer',
  3: 'P3 – Builder',
  4: 'P4 – Challenger',
  5: 'P5 – Expert',
  6: 'P6 – Master',
};

export const SENTENCE_LEVEL_ICONS = ['🌱', '🌿', '🌳', '🔥', '💎', '👑'];

export const allSentences = [
  // ── P1: Core SVO · Noun + be + Adj/Place · Article in noun groups ─────────────
  { id: 's001', sentence: 'The canteen is on the first floor.',          level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Verb + Place', grammarNote: 'Location sentences use "is" + a place phrase. "The canteen" is the subject, "on the first floor" tells us where.' },
  { id: 's002', sentence: 'I can see the school bus from here.',         level: 1, sentenceSkills: ['word_order', 'modal_order'], focusLabel: 'Modal verb order', grammarNote: 'After a modal like "can", the next verb stays in its base form: "see" (not "sees").' },
  { id: 's003', sentence: 'She has a new pencil case.',                  level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Verb + Object', grammarNote: '"has" is the singular form used with she/he/it. "She has" — never "She have".' },
  { id: 's004', sentence: 'We play in the park.',            level: 1, sentenceSkills: ['word_order'], focusLabel: 'Basic SVO', grammarNote: 'Simple sentence pattern: Subject + Verb + Place — "We" + "play" + "in the park".' },
  { id: 's005', sentence: 'He ran to the bus.',              level: 1, sentenceSkills: ['word_order', 'tense_clue'], focusLabel: 'Past tense', grammarNote: '"ran" is the past tense of "run" — the verb shows the action happened already.' },
  { id: 's006', sentence: 'My class has twenty-five pupils.',            level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Verb + Object', grammarNote: 'Treat "My class" as one group (singular), so the verb is "has", not "have".' },
  { id: 's007', sentence: 'I like to eat rice.',             level: 1, sentenceSkills: ['word_order'], focusLabel: 'Basic SVO', grammarNote: 'Some verbs are followed by "to + verb": "like to eat", "want to read".' },
  { id: 's008', sentence: 'My bag is on the table.',         level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Place', grammarNote: '"is" links the subject to its location. "on the table" tells us where the bag is.' },
  { id: 's009', sentence: 'The tree is very tall.',          level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Adjective', grammarNote: '"is" links the subject to an adjective. "very" makes "tall" stronger.' },
  { id: 's010', sentence: 'We sit in the classroom.',        level: 1, sentenceSkills: ['word_order'], focusLabel: 'Basic SVO', grammarNote: 'Plural subject "we" takes the base verb "sit" — no -s ending.' },
  { id: 's061', sentence: 'The nurse is in the sick bay.', level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Verb + Place', grammarNote: 'In simple location sentences, we use subject + "is" + place.' },
  { id: 's062', sentence: 'I can open the window now.', level: 1, sentenceSkills: ['word_order', 'modal_order'], focusLabel: 'Modal + base verb', grammarNote: 'After modal verbs like "can", the next verb stays in base form: "open".' },
  { id: 's063', sentence: 'Our art room is very bright.', level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + be + adjective', grammarNote: '"is" + adjective describes the subject. "very" intensifies "bright".' },
  { id: 's079', sentence: 'The class library has many storybooks.', level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Verb + Object', grammarNote: '"The class library" is singular, so the verb is "has". "many" goes with countable nouns like "storybooks".' },
  { id: 's080', sentence: 'My little brother is at the gate.', level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + be + place', grammarNote: '"is" + "at" + place tells us where someone is right now.' },
  { id: 's081', sentence: 'She can carry the empty tray.', level: 1, sentenceSkills: ['word_order', 'modal_order'], focusLabel: 'Modal + base verb', grammarNote: 'After "can", the next verb stays in base form: "carry", not "carries".' },
  { id: 's082', sentence: 'The red ball is under the chair.', level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Noun phrase + place', grammarNote: '"under" is a preposition of place. The noun phrase "The red ball" is the subject.' },
  { id: 's083', sentence: 'We read quietly in the reading corner.', level: 1, sentenceSkills: ['word_order'], focusLabel: 'Simple action sentence', grammarNote: 'Adverbs of manner like "quietly" usually come right after the verb they describe.' },
  { id: 's084', sentence: 'Can my team start the game now?', level: 1, sentenceSkills: ['word_order', 'modal_order'], focusLabel: 'Question word order', grammarNote: 'Yes/no questions with a modal start with the modal verb.' },

  // ── P2: Simple past / because-but-and-so / time phrases ──────────────────
  {
    id: 's011', sentence: 'She fell because the floor was wet.', level: 2,
    sentenceSkills: ['connector_clue', 'tense_clue'],
    expectedConnector: 'because',
    grammarNote: '"because" links the cause (wet floor) to the result (she fell). It must come between the two clauses.',
    focusLabel: 'Cause connector',
    clueMission: {
      prompt: 'Tap the connector word that links the two ideas.',
      acceptableWords: ['because'],
      clueType: 'connector-clue',
      explanation: '"because" connects a reason (wet floor) to a result (she fell). It always comes before the reason.',
    },
  },
  {
    id: 's012', sentence: 'I wanted to play but it was raining.', level: 2,
    sentenceSkills: ['connector_clue', 'tense_clue'],
    expectedConnector: 'but',
    grammarNote: '"but" shows contrast — it always connects two opposing ideas.',
    focusLabel: 'Contrast connector',
    clueMission: {
      prompt: 'Tap the word that shows a contrast between two ideas.',
      acceptableWords: ['but'],
      clueType: 'contrast-clue',
      explanation: '"but" shows a contrast — wanting to play vs. rain stopping you. It connects two opposite ideas.',
    },
  },
  {
    id: 's013', sentence: 'After school, she helped her mother at home.', level: 2,
    sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue'],
    expectedFirstWord: 'After',
    firstWordHint: '"After school" is a time phrase — start with "After" so the time clause comes first.',
    punctuationHint: 'The comma after "After school" separates the time phrase from the main clause.',
    grammarNote: 'When a time phrase begins the sentence, a comma follows it.',
    focusLabel: 'Fronted time phrase',
    clueMission: {
      prompt: 'Tap the word that tells you when she helped her mother.',
      acceptableWords: ['After'],
      clueType: 'time-marker',
      explanation: '"After school" is a time phrase — it tells us WHEN the event happened. It goes at the start of the sentence.',
    },
  },
  { id: 's014', sentence: 'We played games and then went home.', level: 2, sentenceSkills: ['connector_clue', 'tense_clue'], expectedConnector: 'and', grammarNote: '"and then" joins two past-tense actions in time order.', focusLabel: 'Time sequence' },
  {
    id: 's015', sentence: 'He stayed at home because he was sick.', level: 2,
    sentenceSkills: ['connector_clue', 'tense_clue'],
    expectedConnector: 'because',
    grammarNote: '"because" introduces the reason — being sick is the reason he stayed home.',
    focusLabel: 'Cause connector',
    clueMission: {
      prompt: 'Tap the word that introduces the reason for staying home.',
      acceptableWords: ['because'],
      clueType: 'connector-clue',
      explanation: '"because" introduces the reason — being sick is the reason he stayed home.',
    },
  },
  {
    id: 's016', sentence: 'My father took me to the hawker centre yesterday.', acceptableAnswers: ['Yesterday my father took me to the hawker centre.'], level: 2,
    sentenceSkills: ['tense_clue', 'time_order_clue'],
    grammarNote: '"yesterday" is a past time marker — it confirms the past tense, so we use "took" not "take".',
    focusLabel: 'Past tense signal',
    clueMission: {
      prompt: 'Tap the word that tells you when this happened.',
      acceptableWords: ['yesterday'],
      clueType: 'time-marker',
      explanation: '"yesterday" is a past time marker — it tells us this happened in the past, so we use "took" (simple past).',
    },
  },
  {
    id: 's017', sentence: 'She washed her hands before she ate lunch.', level: 2,
    sentenceSkills: ['connector_clue', 'tense_clue'],
    expectedConnector: 'before',
    grammarNote: '"before" connects two actions and tells us which came first — washing hands, then eating.',
    focusLabel: 'Time connector',
    clueMission: {
      prompt: 'Tap the word that tells you which action happened first.',
      acceptableWords: ['before'],
      clueType: 'connector-clue',
      explanation: '"before" tells us washing hands happened first, then eating lunch.',
    },
  },
  {
    id: 's018', sentence: 'The baby cried and her mother came.', level: 2,
    sentenceSkills: ['connector_clue', 'tense_clue'],
    expectedConnector: 'and',
    grammarNote: '"and" joins two past-tense actions in sequence. Both verbs are in the simple past.',
    focusLabel: 'Sequence connector',
  },
  {
    id: 's019', sentence: 'It was raining so we stayed indoors.', level: 2,
    sentenceSkills: ['connector_clue', 'tense_clue'],
    expectedConnector: 'so',
    grammarNote: '"so" introduces a result — it connects a cause (rain) to its effect (staying indoors).',
    focusLabel: 'Result connector',
    clueMission: {
      prompt: 'Tap the word that introduces the result of the rain.',
      acceptableWords: ['so'],
      clueType: 'connector-clue',
      explanation: '"so" introduces the result or consequence — rain caused them to stay indoors.',
    },
  },
  {
    id: 's020', sentence: 'They had a picnic last Saturday morning.', acceptableAnswers: ['Last Saturday morning they had a picnic.'], level: 2,
    sentenceSkills: ['tense_clue', 'time_order_clue'],
    grammarNote: '"last Saturday" is a past time expression — it confirms we use "had" (simple past).',
    focusLabel: 'Past time marker',
    clueMission: {
      prompt: 'Tap the word that tells you when the picnic happened.',
      acceptableWords: ['last'],
      clueType: 'time-marker',
      explanation: '"last Saturday" is a past time expression — it confirms the picnic happened in the past.',
    },
  },
  {
    id: 's064', sentence: 'In the evening, we revised for our spelling test.', level: 2,
    sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue', 'tense_clue'],
    expectedFirstWord: 'In',
    firstWordHint: 'The fronted time phrase starts with "In" and comes before the comma.',
    punctuationHint: 'Place a comma after the fronted phrase "In the evening".',
    grammarNote: 'Fronted time phrases at the start are followed by a comma.',
    focusLabel: 'Fronted time phrase',
  },
  {
    id: 's065', sentence: 'He packed his file, so he was ready for class.', level: 2,
    sentenceSkills: ['connector_clue', 'punctuation_clue', 'clause_boundary'],
    expectedConnector: 'so',
    punctuationHint: 'The comma before "so" helps separate the cause from the result.',
    grammarNote: '"so" links an action to its result in compound sentences.',
    focusLabel: 'Result connector',
  },
  {
    id: 's066', sentence: 'She was tired, but she still finished her reading.', level: 2,
    sentenceSkills: ['connector_clue', 'punctuation_clue', 'clause_boundary'],
    expectedConnector: 'but',
    grammarNote: '"but" links two contrasting ideas in one sentence.',
    focusLabel: 'Contrast connector',
  },
  { id: 's085', sentence: 'After lunch, we cleaned our tables quickly.', level: 2, sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue'], expectedFirstWord: 'After', firstWordHint: 'Start with "After" to front the time phrase.', punctuationHint: 'Add a comma after "After lunch".', focusLabel: 'Fronted time phrase', grammarNote: 'A fronted time phrase like "After lunch" is followed by a comma before the main clause.' },
  { id: 's086', sentence: 'Because the bus was late, we reached school late.', level: 2, sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Because', expectedConnector: 'Because', punctuationHint: 'Use a comma after the fronted reason clause.', focusLabel: 'Fronted cause clause', grammarNote: 'When "Because" starts the sentence, the cause clause ends with a comma before the result.' },
  { id: 's087', sentence: 'He forgot his bottle, so he shared mine.', level: 2, sentenceSkills: ['connector_clue', 'punctuation_clue', 'clause_boundary'], expectedConnector: 'so', focusLabel: 'Result connector', grammarNote: '"so" links a cause to its result. Use a comma before "so" when joining two clauses.' },
  { id: 's088', sentence: 'Before assembly, the prefect checked our attire.', level: 2, sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue'], expectedFirstWord: 'Before', punctuationHint: 'Put a comma after the fronted phrase.', focusLabel: 'Fronted time phrase', grammarNote: '"Before" + a time phrase at the start needs a comma before the main clause.' },
  { id: 's089', sentence: 'They stayed indoors because the lightning was near.', level: 2, sentenceSkills: ['connector_clue', 'tense_clue'], expectedConnector: 'because', focusLabel: 'Cause connector', grammarNote: 'When "because" sits in the middle of the sentence, no comma is needed before it.' },
  { id: 's090', sentence: 'Last night, did you finish your math worksheet?', level: 2, sentenceSkills: ['tense_clue', 'time_order_clue', 'punctuation_clue'], expectedFirstWord: 'Last', punctuationHint: 'A comma follows the fronted time marker "Last night".', focusLabel: 'Past time marker question', grammarNote: '"Last night" is a past time marker, so the question uses "did" + base verb "finish".' },

  // ── P3: Fronted temporal subordinate · Adverb placement · Comparative ────────
  {
    id: 's021', sentence: 'When the bell rang, all the students stood up.', level: 3,
    sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'When',
    firstWordHint: '"When" starts the time clause — it must come first, before the comma.',
    punctuationHint: 'The comma after "When the bell rang" separates the time clause from the result clause.',
    grammarNote: 'Fronted time clauses (When/After/Before + clause) always come first, followed by a comma.',
    focusLabel: 'Fronted time clause',
    clueMission: {
      prompt: 'Tap the word that starts the fronted time clause.',
      acceptableWords: ['When'],
      clueType: 'connector-clue',
      explanation: '"When" starts a time clause that must come first, followed by a comma, then the main clause.',
    },
  },
  { id: 's022', sentence: 'My sister is two years older than me.', level: 3, sentenceSkills: ['comparison_structure'], grammarNote: '"older than" is the comparative form. Comparative sentences use: adjective + -er + than.', focusLabel: 'Comparative structure' },
  {
    id: 's023', sentence: 'Before going to bed, Tom brushed his teeth.', level: 3,
    sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'Before',
    firstWordHint: '"Before" starts the time phrase — it must come first in the sentence.',
    punctuationHint: 'A comma follows the fronted time phrase "Before going to bed".',
    grammarNote: 'Fronted time phrases (Before/After + verb-ing) come at the start, followed by a comma.',
    focusLabel: 'Fronted time phrase',
    clueMission: {
      prompt: 'Tap the word that should come first to show the earlier event.',
      acceptableWords: ['Before'],
      clueType: 'time-marker',
      explanation: '"Before" is a fronted time word — it comes at the start of the sentence, before the comma.',
    },
  },
  { id: 's024', sentence: 'The old man walked slowly down the stairs.', acceptableAnswers: ['The old man slowly walked down the stairs.'], level: 3, sentenceSkills: ['word_order', 'tense_clue'], grammarNote: '"walked" is past tense. Adverbs like "slowly" usually follow the verb.', focusLabel: 'Adverb placement' },
  {
    id: 's025', sentence: 'After finishing her homework, she watched television.', level: 3,
    sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'After',
    firstWordHint: '"After" starts the fronted time phrase — it must come first, before the comma.',
    punctuationHint: 'A comma follows the fronted phrase "After finishing her homework".',
    grammarNote: 'Fronted time phrases (After + verb-ing) begin the sentence, followed by a comma.',
    focusLabel: 'Fronted time phrase',
    clueMission: {
      prompt: 'Tap the connector word that shows one event finished before the other started.',
      acceptableWords: ['After'],
      clueType: 'time-marker',
      explanation: '"After" shows that homework was finished first — it starts the fronted clause, followed by a comma.',
    },
  },
  { id: 's026', sentence: 'He ran faster than anyone else in the class.', level: 3, sentenceSkills: ['comparison_structure'], grammarNote: '"faster than" is a comparative — use adj + -er + than to compare.', focusLabel: 'Comparative structure' },
  {
    id: 's027', sentence: 'Although it was raining, they continued to play.', level: 3,
    sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'Although',
    expectedConnector: 'Although',
    firstWordHint: '"Although" starts a contrast clause — it comes first, before the comma.',
    punctuationHint: 'A comma follows the "Although" clause before the main clause.',
    grammarNote: '"Although" introduces an unexpected contrast — it fronts the subordinate clause, followed by a comma.',
    focusLabel: 'Contrast clause',
    clueMission: {
      prompt: 'Tap the connector that shows a surprising contrast.',
      acceptableWords: ['Although'],
      clueType: 'contrast-clue',
      explanation: '"Although" starts a contrast clause — rain should stop play, but it did not. This unexpected contrast is the key.',
    },
  },
  {
    id: 's028', sentence: 'The new library is much bigger than the old one.', level: 3,
    sentenceSkills: ['comparison_structure'],
    grammarNote: '"bigger than" is the comparative form — adjective + -er + than. "much" intensifies the comparison.',
    focusLabel: 'Comparative structure',
  },
  {
    id: 's029', sentence: 'She whispered so that the baby would not wake up.', level: 3,
    sentenceSkills: ['connector_clue', 'clause_boundary'],
    expectedConnector: 'so',
    grammarNote: '"so that" introduces a purpose clause — it follows the main action and explains the reason.',
    focusLabel: 'Purpose clause',
    clueMission: {
      prompt: 'Tap the action word (verb) that tells you what she did.',
      acceptableWords: ['whispered'],
      clueType: 'action-clue',
      explanation: '"whispered" is the main verb — it tells us the action, and "so that" explains her reason for doing it.',
    },
  },
  {
    id: 's030', sentence: 'When they arrived at the park, it started to rain.', level: 3,
    sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'When',
    firstWordHint: '"When" starts the time clause — it comes first, before the comma.',
    punctuationHint: 'A comma separates the "When" time clause from the main clause.',
    grammarNote: 'Fronted time clauses (When + clause) come first, followed by a comma, then the main clause.',
    focusLabel: 'Fronted time clause',
  },
  {
    id: 's067', sentence: 'After the lights went out, we waited quietly for help.', level: 3,
    sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'After',
    firstWordHint: '"After" starts the fronted clause and comes before the comma.',
    punctuationHint: 'Put a comma after "After the lights went out".',
    focusLabel: 'Fronted time clause',
    grammarNote: 'A fronted time clause beginning with "After" needs a comma before the main clause.',
  },
  { id: 's068', sentence: 'The rabbit moved quickly across the garden.', acceptableAnswers: ['The rabbit quickly moved across the garden.'], level: 3, sentenceSkills: ['word_order', 'adverb_placement'], grammarNote: 'The adverb "quickly" tells how the action happened and usually follows the verb.', focusLabel: 'Adverb placement' },
  { id: 's069', sentence: 'This puzzle is easier than the one we did yesterday.', level: 3, sentenceSkills: ['comparison_structure', 'tense_clue'], focusLabel: 'Comparative structure', grammarNote: 'Comparative form: adjective + -er + than.' },
  { id: 's091', sentence: 'When the rain stopped, the children ran outside.', level: 3, sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'When', punctuationHint: 'A comma separates the fronted time clause.', focusLabel: 'Fronted time clause', grammarNote: 'When the time clause comes first, use a comma to mark the boundary between the two clauses.' },
  { id: 's092', sentence: 'After the teacher explained the task, we began quietly.', level: 3, sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'After', punctuationHint: 'Use a comma after the fronted clause.', focusLabel: 'Fronted time clause', grammarNote: '"After + clause" at the start is always followed by a comma.' },
  { id: 's093', sentence: 'The blue route is shorter than the green route.', level: 3, sentenceSkills: ['comparison_structure'], grammarNote: 'Use comparative adjective + than for comparison.', focusLabel: 'Comparative structure' },
  { id: 's094', sentence: 'She carefully packed the microscope into the box.', acceptableAnswers: ['She packed the microscope carefully into the box.', 'She packed the microscope into the box carefully.'], level: 3, sentenceSkills: ['word_order', 'adverb_placement'], focusLabel: 'Adverb placement', grammarNote: 'Adverbs like "carefully" can sit between the subject and the verb to describe how the action was done.' },
  { id: 's095', sentence: 'Although he was nervous, he answered the question clearly.', level: 3, sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Although', expectedConnector: 'Although', punctuationHint: 'Use a comma after the concessive clause.', focusLabel: 'Contrast clause', grammarNote: '"Although" shows contrast: the result goes against what the first clause suggests. Use a comma between the two clauses.' },
  { id: 's096', sentence: 'The later train arrived more slowly than usual.', level: 3, sentenceSkills: ['comparison_structure', 'adverb_placement'], focusLabel: 'Comparative adverb pattern', grammarNote: '"more slowly" is the comparative form of the adverb "slowly". Pattern: "more + adverb + than".' },

  // ── P4: Modal-verb order · Fronted cause clause · So…that structure ──────────
  {
    id: 's031', sentence: 'We should always wash our hands before eating.', level: 4,
    sentenceSkills: ['modal_order', 'connector_clue'],
    grammarNote: '"should" is a modal verb — it comes directly before "always" and the main verb "wash".',
    focusLabel: 'Modal verb order',
    clueMission: {
      prompt: 'Tap the modal verb that gives advice or a recommendation.',
      acceptableWords: ['should'],
      clueType: 'action-clue',
      explanation: '"should" is a modal verb that gives advice — it always comes before the main verb ("wash").',
    },
  },
  {
    id: 's032', sentence: 'If it rains tomorrow, the match will be cancelled.', level: 4,
    sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'If',
    firstWordHint: '"If" starts the condition clause — it must come first, before the comma.',
    punctuationHint: 'A comma separates the "If" condition clause from the result clause.',
    grammarNote: '"If" conditionals: If-clause first + comma, then result clause.',
    focusLabel: 'Conditional clause',
    clueMission: {
      prompt: 'Tap the word that signals this is a conditional sentence.',
      acceptableWords: ['If'],
      clueType: 'connector-clue',
      explanation: '"If" starts a Type 1 conditional — it begins the condition clause, and the result clause follows after the comma.',
    },
  },
  {
    id: 's033', sentence: 'You must not run along the school corridor.', level: 4,
    sentenceSkills: ['modal_order', 'subject_action_clue'],
    grammarNote: '"must not" is a modal verb phrase — it expresses prohibition and comes before the base verb "run".',
    focusLabel: 'Modal prohibition',
    clueMission: {
      prompt: 'Tap the modal verb that shows a strong rule or obligation.',
      acceptableWords: ['must'],
      clueType: 'action-clue',
      explanation: '"must not" expresses a prohibition — a strong rule. It always comes before the base verb.',
    },
  },
  {
    id: 's034', sentence: 'Because he studied hard every day, he passed his exam.', level: 4,
    sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'Because',
    expectedConnector: 'Because',
    firstWordHint: '"Because" starts the reason clause — when fronted, it comes first before the comma.',
    punctuationHint: 'A comma follows the fronted "Because" clause before the result.',
    grammarNote: 'Fronted cause clauses: Because + reason + comma + result.',
    focusLabel: 'Fronted cause clause',
    clueMission: {
      prompt: 'Tap the word that starts the cause clause (the reason).',
      acceptableWords: ['Because'],
      clueType: 'connector-clue',
      explanation: '"Because" starts the reason clause — when it is fronted, the cause clause comes first, followed by a comma.',
    },
  },
  {
    id: 's035', sentence: 'She could not finish her project in time.', level: 4,
    sentenceSkills: ['modal_order', 'tense_clue'],
    grammarNote: '"could not" is a past modal negative — "could" comes before "not" and the main verb "finish".',
    focusLabel: 'Modal negative',
  },
  {
    id: 's036', sentence: 'The doctor told him to rest and drink plenty of water.', level: 4,
    sentenceSkills: ['connector_clue', 'word_order'],
    expectedConnector: 'and',
    grammarNote: '"and" links two parallel actions in the doctor\'s instruction — rest AND drink.',
    focusLabel: 'Parallel commands',
  },
  {
    id: 's037', sentence: 'Although she was tired, she continued to help her friend.', level: 4,
    sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'Although',
    expectedConnector: 'Although',
    firstWordHint: '"Although" starts a concessive clause — it comes first, before the comma.',
    punctuationHint: 'A comma follows the "Although" clause before the main action.',
    grammarNote: '"Although" fronts the concessive clause — the contrast (tired vs. helping) is the key.',
    focusLabel: 'Concessive clause',
    clueMission: {
      prompt: 'Tap the connector that shows she did something unexpected.',
      acceptableWords: ['Although'],
      clueType: 'contrast-clue',
      explanation: '"Although" introduces an unexpected contrast — being tired should stop you helping, but it did not.',
    },
  },
  {
    id: 's038', sentence: 'We had to leave early to catch the first bus.', level: 4,
    sentenceSkills: ['connector_clue', 'word_order'],
    grammarNote: '"to catch" is an infinitive of purpose — it explains why they had to leave early.',
    focusLabel: 'Infinitive of purpose',
  },
  {
    id: 's039', sentence: 'The school will hold its annual sports day next Friday.', acceptableAnswers: ['Next Friday the school will hold its annual sports day.'], level: 4,
    sentenceSkills: ['tense_clue', 'word_order'],
    grammarNote: '"will hold" is the future tense — "next Friday" is the future time marker that signals this.',
    focusLabel: 'Future tense',
  },
  {
    id: 's040', sentence: 'She worked so hard that she finished an hour ahead of time.', level: 4,
    sentenceSkills: ['connector_clue', 'clause_boundary'],
    expectedConnector: 'so',
    grammarNote: '"so hard that" is a result structure — the degree of effort (so hard) causes the result (finished early).',
    focusLabel: 'So…that result structure',
  },
  {
    id: 's070', sentence: 'If you revise tonight, you will feel calmer tomorrow.', level: 4,
    sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'If',
    expectedConnector: 'If',
    firstWordHint: 'Start with "If" to place the condition clause before the comma.',
    punctuationHint: 'A comma separates the condition clause from the result clause.',
    focusLabel: 'Conditional clause',
    grammarNote: 'First conditional: "If" + present simple, then "will" + base verb. Comma after the if-clause when it comes first.',
  },
  {
    id: 's071', sentence: 'Because the path was slippery, we walked very slowly.', level: 4,
    sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'],
    expectedFirstWord: 'Because',
    expectedConnector: 'Because',
    punctuationHint: 'A comma follows the fronted cause clause.',
    focusLabel: 'Fronted cause clause',
    grammarNote: 'Fronted "Because" clause is followed by a comma before the main clause.',
  },
  { id: 's072', sentence: 'You must always label your files clearly.', level: 4, sentenceSkills: ['modal_order', 'word_order'], grammarNote: 'Order in this sentence: modal + adverb + base verb.', focusLabel: 'Modal order' },
  { id: 's097', sentence: 'If the rain continues, the coach will cancel practice.', level: 4, sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'If', expectedConnector: 'If', punctuationHint: 'Use a comma between condition and result.', focusLabel: 'Conditional clause', grammarNote: 'First conditional pattern: "If" + present simple, "will" + base verb in the result clause.' },
  { id: 's098', sentence: 'Because we revised together, we solved the questions faster.', level: 4, sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Because', focusLabel: 'Fronted cause clause', grammarNote: 'When "Because" leads the sentence, end its clause with a comma before the main clause.' },
  { id: 's099', sentence: 'You should never post private details online.', level: 4, sentenceSkills: ['modal_order', 'word_order'], focusLabel: 'Modal + adverb order', grammarNote: 'Adverbs like "never" sit between the modal "should" and the main verb "post".' },
  { id: 's100', sentence: 'The class will present their project next Monday.', acceptableAnswers: ['Next Monday the class will present their project.'], level: 4, sentenceSkills: ['tense_clue', 'word_order'], focusLabel: 'Future signal', grammarNote: '"will" + base verb signals a future action. "next Monday" is the future time marker.' },
  { id: 's101', sentence: 'He spoke so clearly that everyone understood the instructions.', level: 4, sentenceSkills: ['connector_clue', 'clause_boundary'], expectedConnector: 'so', focusLabel: 'So…that result structure', grammarNote: '"so + adverb + that" shows a result: the speaking was clear enough to cause understanding.' },
  { id: 's102', sentence: 'Should you need help, please call the office immediately.', level: 4, sentenceSkills: ['modal_order', 'clause_boundary'], focusLabel: 'Formal conditional opening', grammarNote: 'In formal instructions, an auxiliary opening can front the condition clause.' },

  // ── P5: Fronted concessive/participial phrases · Not only…but also ─────────
  { id: 's041', sentence: 'Despite the heavy rain, the match continued until the final whistle.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Despite', firstWordHint: '"Despite" starts a concessive phrase — it goes first, before the comma.', punctuationHint: 'A comma follows the concessive phrase "Despite the heavy rain".', focusLabel: 'Concessive phrase', grammarNote: '"Despite" is followed by a noun phrase, not a clause. Use a comma after the fronted phrase.' },
  { id: 's042', sentence: 'Without enough sleep, students find it hard to concentrate in class.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Without', firstWordHint: '"Without" starts a fronted prepositional phrase — it goes first.', focusLabel: 'Fronted prepositional phrase', grammarNote: '"Without" is a preposition — it takes a noun phrase, not a clause. Fronted phrases end with a comma.' },
  { id: 's043', sentence: 'The more she practised, the more confident she became.', level: 5, sentenceSkills: ['comparison_structure', 'clause_boundary'], grammarNote: '"The more…the more…" is a parallel comparative structure — both halves are needed.', focusLabel: 'Parallel comparative' },
  { id: 's044', sentence: 'After much thought, the class decided to raise money for charity.', level: 5, sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue'], expectedFirstWord: 'After', firstWordHint: '"After" starts a fronted time phrase — it comes before the comma.', focusLabel: 'Fronted time phrase', grammarNote: 'A fronted time phrase like "After much thought" is followed by a comma before the main clause.' },
  { id: 's045', sentence: 'She not only completed her work on time but also helped others.', level: 5, sentenceSkills: ['connector_clue'], expectedConnector: 'only', grammarNote: '"not only…but also" is a paired connector — both parts must be in the sentence.', focusLabel: 'Not only…but also' },
  { id: 's046', sentence: 'By the time they arrived, the show had already ended.', level: 5, sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'By', firstWordHint: '"By the time" starts a time clause — it comes first, before the comma.', focusLabel: 'Time reference clause', grammarNote: '"By the time" + simple past action triggers past perfect ("had ended") for the earlier action.' },
  { id: 's047', sentence: 'He worked so carefully that he did not make a single mistake.', level: 5, sentenceSkills: ['connector_clue', 'clause_boundary'], grammarNote: '"so…that" is a result structure — so + adverb/adjective + that + result clause.', focusLabel: 'So…that structure' },
  { id: 's048', sentence: 'Both the students and their teacher were proud of the result.', level: 5, sentenceSkills: ['connector_clue'], expectedConnector: 'and', grammarNote: '"Both…and" links two subjects — they go before the verb.', focusLabel: 'Both…and structure' },
  { id: 's049', sentence: 'She practised every day so that she could improve her results.', acceptableAnswers: ['Every day she practised so that she could improve her results.'], level: 5, sentenceSkills: ['connector_clue', 'tense_clue'], expectedConnector: 'so', grammarNote: '"so that" introduces the purpose clause — it follows the main action.', focusLabel: 'Purpose clause' },
  { id: 's050', sentence: 'Having saved enough money, she finally bought the book she wanted.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Having', firstWordHint: '"Having saved" is a participial phrase — it comes at the start, before the comma.', punctuationHint: 'A comma follows the participial phrase "Having saved enough money".', focusLabel: 'Fronted participial phrase', grammarNote: '"Having + past participle" forms a participial phrase that shows an earlier action. Comma after the phrase.' },
  { id: 's073', sentence: 'Despite the heavy rain, the netball training continued.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Despite', firstWordHint: '"Despite" starts a fronted concessive phrase before the comma.', punctuationHint: 'Use a comma after the concessive phrase.', focusLabel: 'Fronted concessive phrase', grammarNote: '"Despite" + noun phrase (not a clause). Always followed by a comma when fronted.' },
  { id: 's074', sentence: 'Without checking the map, they took the wrong bus home.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Without', firstWordHint: '"Without" starts the fronted phrase.', punctuationHint: 'A comma separates the fronted phrase from the main clause.', focusLabel: 'Fronted participial phrase', grammarNote: '"Without + -ing" forms a fronted phrase showing what someone failed to do. Comma before the main clause.' },
  { id: 's075', sentence: 'Not only did Mei organise the notes, but she also explained them to her group.', level: 5, sentenceSkills: ['inversion_pattern', 'connector_clue', 'clause_boundary'], expectedConnector: 'only', grammarNote: 'In this paired structure, "Not only" is followed by inversion: did + subject + verb.', focusLabel: 'Paired structure with inversion' },
  { id: 's103', sentence: 'Despite his injury, he completed the relay leg.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Despite', punctuationHint: 'Place a comma after the concessive phrase.', focusLabel: 'Concessive phrase', grammarNote: '"Despite" must be followed by a noun or noun phrase — not a full clause.' },
  { id: 's104', sentence: 'Having checked every answer, the pair submitted their worksheet.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Having', focusLabel: 'Fronted participial phrase', grammarNote: '"Having" + past participle ("checked") describes a completed action that happened before the main action.' },
  { id: 's105', sentence: 'Either the science club or the art club will host the showcase.', level: 5, sentenceSkills: ['connector_clue', 'word_order'], expectedConnector: 'or', focusLabel: 'Paired structure', grammarNote: '"Either…or…" links two alternatives. The verb agrees with the subject closer to it.' },
  { id: 's106', sentence: 'By organising their roles early, the team avoided confusion later.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'By', focusLabel: 'Fronted phrase for method', grammarNote: '"By + -ing" explains the method: how the team avoided confusion.' },
  { id: 's107', sentence: 'She revised with a checklist so that she would miss nothing important.', level: 5, sentenceSkills: ['connector_clue', 'clause_boundary'], expectedConnector: 'so', focusLabel: 'Purpose clause', grammarNote: '"so that" introduces a purpose clause — it answers the question "why?".' },
  { id: 's108', sentence: 'Only after the final rehearsal did the cast feel fully prepared.', level: 5, sentenceSkills: ['inversion_pattern', 'first_word_clue'], expectedFirstWord: 'Only', focusLabel: 'Inversion after restrictive opener', grammarNote: 'After "Only after…" at the start, subject and auxiliary invert: "did + the cast + feel".' },

  // ── P6: Subject-auxiliary inversion · Inverted conditional · Embedded relative ──
  { id: 's051', sentence: 'Although the task was difficult, she persevered and succeeded in the end.', level: 6, sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Although', firstWordHint: '"Although" starts a concessive clause — it comes first, before the comma.', focusLabel: 'Concessive clause', grammarNote: '"Although" leads a concessive clause that goes against the main clause. Comma between the two clauses.' },
  { id: 's052', sentence: 'The book, which was written by a local author, won a national award.', level: 6, sentenceSkills: ['clause_boundary', 'connector_clue'], grammarNote: '"which was written by a local author" is a relative clause inserted with commas.', focusLabel: 'Embedded relative clause' },
  { id: 's053', sentence: 'Not only did he finish the race, but he also helped a fellow runner.', level: 6, sentenceSkills: ['inversion_pattern', 'connector_clue', 'first_word_clue'], expectedFirstWord: 'Not', firstWordHint: '"Not only did he…" uses subject-auxiliary inversion — "did" comes before "he".', grammarNote: 'After "Not only", subject and auxiliary are inverted: Not only did + subject + verb.', focusLabel: 'Subject-auxiliary inversion' },
  { id: 's054', sentence: 'It is important that we take care of the environment around us.', level: 6, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'It is + adjective + that structure', grammarNote: 'The "It is + adjective + that…" pattern uses "It" as a dummy subject; the real meaning is in the "that" clause.' },
  { id: 's055', sentence: 'Had she left earlier, she would not have missed the morning assembly.', level: 6, sentenceSkills: ['inversion_pattern', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Had', firstWordHint: '"Had she left" uses inverted conditional structure — "Had" comes before "she".', punctuationHint: 'A comma follows the inverted conditional clause "Had she left earlier".', grammarNote: 'Inverted conditional: Had + subject + past participle + comma + result.', focusLabel: 'Inverted conditional' },
  { id: 's056', sentence: 'The principal praised the students who had shown great kindness and teamwork.', level: 6, sentenceSkills: ['clause_boundary', 'connector_clue'], grammarNote: '"who had shown" is a relative clause modifying "students" — it follows directly after the noun.', focusLabel: 'Relative clause' },
  { id: 's057', sentence: 'She told her teacher that she had tried her best on the project.', level: 6, sentenceSkills: ['connector_clue', 'tense_clue'], expectedConnector: 'that', grammarNote: '"that she had tried" is a reported clause — "that" links the reporting verb to the reported speech.', focusLabel: 'Reported speech' },
  { id: 's058', sentence: 'The old library, which had stood for fifty years, was finally renovated.', level: 6, sentenceSkills: ['clause_boundary', 'connector_clue'], grammarNote: '"which had stood for fifty years" is a non-defining relative clause, inserted with commas.', focusLabel: 'Non-defining relative clause' },
  { id: 's059', sentence: 'If every student does their part, the school will become a better place.', level: 6, sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'If', firstWordHint: '"If" starts the condition — it must come first, before the comma.', focusLabel: 'Conditional clause', grammarNote: 'First conditional: "If" + present, "will" + base verb. "Every student" is singular, so use "does".' },
  { id: 's060', sentence: 'Whether it was raining or sunny, they always arrived at school on time.', level: 6, sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Whether', firstWordHint: '"Whether" starts an alternative condition — it comes first, before the comma.', focusLabel: 'Alternative condition', grammarNote: '"Whether…or…" presents two alternatives, both leading to the same result.' },
  { id: 's076', sentence: 'Rarely have we seen the river rise so quickly after a storm.', level: 6, sentenceSkills: ['inversion_pattern', 'first_word_clue'], expectedFirstWord: 'Rarely', firstWordHint: 'Negative adverbs like "Rarely" trigger inversion: auxiliary before subject.', grammarNote: 'After fronted negative adverbs, use subject-auxiliary inversion.', focusLabel: 'Negative adverb inversion' },
  { id: 's077', sentence: 'Had they checked the timetable, they would have caught the earlier train.', level: 6, sentenceSkills: ['inversion_pattern', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Had', punctuationHint: 'Use a comma after the inverted conditional clause.', focusLabel: 'Inverted conditional', grammarNote: 'Inverted third conditional: "Had + subject + past participle" replaces "If they had checked…".' },
  { id: 's078', sentence: 'The captain, who had trained with discipline, led the team through the final round.', level: 6, sentenceSkills: ['clause_boundary', 'connector_clue'], grammarNote: 'The embedded relative clause "who had trained with discipline" is enclosed by commas.', focusLabel: 'Embedded relative clause' },
  { id: 's109', sentence: 'Seldom do students receive such detailed feedback in one lesson.', level: 6, sentenceSkills: ['inversion_pattern', 'first_word_clue'], expectedFirstWord: 'Seldom', focusLabel: 'Negative adverb inversion', grammarNote: 'After negative adverbs like "Seldom", subject and auxiliary invert: "do + students + receive".' },
  { id: 's110', sentence: 'Were the gate left open, the laboratory equipment could be stolen.', level: 6, sentenceSkills: ['inversion_pattern', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Were', focusLabel: 'Inverted conditional', grammarNote: 'Inverted second conditional with "Were": replaces "If the gate were left open…".' },
  { id: 's111', sentence: 'The proposal, which the principal reviewed personally, was approved yesterday.', level: 6, sentenceSkills: ['clause_boundary', 'connector_clue'], focusLabel: 'Embedded relative clause', grammarNote: '"which the principal reviewed personally" is a non-defining relative clause. Commas separate it from the main sentence.' },
  { id: 's112', sentence: 'Not until the final bell did the hall become quiet again.', level: 6, sentenceSkills: ['inversion_pattern', 'first_word_clue'], expectedFirstWord: 'Not', focusLabel: 'Inversion after fronted negative', grammarNote: 'After "Not until + time", subject and auxiliary invert: "did + the hall + become".' },
  { id: 's113', sentence: 'Had the warning been shared earlier, fewer students would have panicked.', level: 6, sentenceSkills: ['inversion_pattern', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Had', focusLabel: 'Advanced inverted conditional', grammarNote: 'Inverted third conditional with passive: "Had + subject + been + past participle" replaces "If the warning had been shared…".' },
  { id: 's114', sentence: 'The vice-captain, who was elected last term, coordinated the emergency drill.', level: 6, sentenceSkills: ['clause_boundary', 'connector_clue'], focusLabel: 'Non-defining relative clause', grammarNote: '"who was elected last term" is a non-defining relative clause with commas — extra information about the subject.' },
  {
    id: 's115',
    sentence: 'The rain started, so we moved the PE lesson indoors.',
    level: 3,
    sentenceSkills: ['connector_clue', 'clause_boundary'],
    focusLabel: 'Synthesis with connector',
    grammarNote: '"so" introduces the result. Use a comma before "so" when joining two independent clauses.',
    synthesisTask: {
      type: 'combine',
      prompt: 'Combine two ideas into one sentence.',
      connectors: ['because', 'so', 'although'],
      punctuationHint: 'Use a comma before the connector when joining full clauses.',
    },
  },
  {
    id: 's116',
    sentence: 'Mia said that she was ready then.',
    level: 5,
    sentenceSkills: ['connector_clue', 'tense_clue'],
    focusLabel: 'Direct to indirect speech',
    grammarNote: 'Reported speech shifts the tense and time word: "I am ready now" → "she was ready then".',
    synthesisTask: {
      type: 'transform',
      prompt: 'Change direct speech to indirect speech.',
      connectors: ['that'],
      punctuationHint: 'Remove quotation marks and adjust tense/pronouns.',
    },
  },
  // ── Spiralled skill coverage (s201-s320) ────────────────────────────────
  // 4 sentences per skill × 5 skills × 6 levels = 120 sentences
  // Each level meets the five required sentenceSkills tags with age-appropriate grammar.

  // ── P1 (level 1) ──────────────────────────────────────────────────────────
  // connector_clue – "and", "because"
  { id: 's201', sentence: 'Mei likes cats and dogs.', level: 1, sentenceSkills: ['connector_clue'], focusLabel: 'Simple connector "and"', grammarNote: '"and" joins two nouns together.' },
  { id: 's202', sentence: 'Ahmad is happy because he got a star.', level: 1, sentenceSkills: ['connector_clue'], focusLabel: 'Reason connector "because"', grammarNote: '"because" gives the reason.' },
  { id: 's203', sentence: 'I eat rice and fish for lunch.', level: 1, sentenceSkills: ['connector_clue'], focusLabel: 'Connector "and" in a list', grammarNote: '"and" joins two items.' },
  { id: 's204', sentence: 'Siti is tired because she ran a lot.', level: 1, sentenceSkills: ['connector_clue'], focusLabel: 'Cause with "because"', grammarNote: '"because" tells us why Siti is tired.' },
  // comparison_structure – "bigger/smaller/taller than"
  { id: 's205', sentence: 'The ball is bigger than the eraser.', level: 1, sentenceSkills: ['comparison_structure'], focusLabel: 'Comparing sizes', grammarNote: '"bigger than" compares two objects.' },
  { id: 's206', sentence: 'Ravi is taller than Wei.', level: 1, sentenceSkills: ['comparison_structure'], focusLabel: 'Comparing heights', grammarNote: '"taller than" compares height.' },
  { id: 's207', sentence: 'My bag is smaller than your bag.', level: 1, sentenceSkills: ['comparison_structure'], focusLabel: 'Comparing sizes', grammarNote: '"smaller than" compares two bags.' },
  { id: 's208', sentence: 'This book is thicker than that one.', level: 1, sentenceSkills: ['comparison_structure'], focusLabel: 'Comparing thickness', grammarNote: '"thicker than" compares two books.' },
  // modal_order – "can"
  { id: 's209', sentence: 'I can read this book by myself.', level: 1, sentenceSkills: ['modal_order'], focusLabel: 'Ability with "can"', grammarNote: '"can" shows ability.' },
  { id: 's210', sentence: 'Mei can swim very well.', level: 1, sentenceSkills: ['modal_order'], focusLabel: 'Ability with "can"', grammarNote: '"can" comes before the main verb.' },
  { id: 's211', sentence: 'We can see the birds from here.', level: 1, sentenceSkills: ['modal_order'], focusLabel: 'Ability with "can"', grammarNote: '"can" goes before "see".' },
  { id: 's212', sentence: 'Ahmad can count to one hundred.', level: 1, sentenceSkills: ['modal_order'], focusLabel: 'Ability with "can"', grammarNote: '"can" shows what Ahmad is able to do.' },
  // tense_clue – simple present / simple past with time markers
  { id: 's213', sentence: 'She walks to school every day.', level: 1, sentenceSkills: ['tense_clue'], focusLabel: 'Simple present routine', grammarNote: '"every day" signals simple present tense.' },
  { id: 's214', sentence: 'Yesterday, Ravi played in the field.', level: 1, sentenceSkills: ['tense_clue'], focusLabel: 'Simple past with "yesterday"', grammarNote: '"Yesterday" tells us the action is in the past.' },
  { id: 's215', sentence: 'We eat lunch at noon every day.', level: 1, sentenceSkills: ['tense_clue'], focusLabel: 'Simple present routine', grammarNote: '"every day" signals a routine action.' },
  { id: 's216', sentence: 'Siti washed her hands just now.', level: 1, sentenceSkills: ['tense_clue'], focusLabel: 'Simple past with "just now"', grammarNote: '"just now" tells us the action already happened.' },
  // preposition_clue – "in", "on", "under", "at"
  { id: 's217', sentence: 'The pencil is on the table.', level: 1, sentenceSkills: ['preposition_clue'], focusLabel: 'Place preposition "on"', grammarNote: '"on" tells where the pencil is.' },
  { id: 's218', sentence: 'My shoes are under the chair.', level: 1, sentenceSkills: ['preposition_clue'], focusLabel: 'Place preposition "under"', grammarNote: '"under" shows position below.' },
  { id: 's219', sentence: 'We line up at the canteen door.', level: 1, sentenceSkills: ['preposition_clue'], focusLabel: 'Place preposition "at"', grammarNote: '"at" marks a specific point.' },
  { id: 's220', sentence: 'The fish is in the pond.', level: 1, sentenceSkills: ['preposition_clue'], focusLabel: 'Place preposition "in"', grammarNote: '"in" shows inside a space.' },

  // ── P2 (level 2) ──────────────────────────────────────────────────────────
  // connector_clue – "but", "so", "because", fronted "After/Before"
  { id: 's221', sentence: 'Mei wanted to play, but it started to rain.', level: 2, sentenceSkills: ['connector_clue'], focusLabel: 'Contrast connector "but"', grammarNote: '"but" joins two contrasting ideas.' },
  { id: 's222', sentence: 'Ahmad was hungry, so he ate a curry puff.', level: 2, sentenceSkills: ['connector_clue'], focusLabel: 'Result connector "so"', grammarNote: '"so" shows the result of being hungry.' },
  { id: 's223', sentence: 'After recess, we went back to our classroom quietly.', level: 2, sentenceSkills: ['connector_clue'], focusLabel: 'Fronted time connector "After"', grammarNote: '"After" starts a time clause at the front.' },
  { id: 's224', sentence: 'Before assembly, Siti checked her uniform in the mirror.', level: 2, sentenceSkills: ['connector_clue'], focusLabel: 'Fronted time connector "Before"', grammarNote: '"Before" introduces a time clause at the front.' },
  // comparison_structure – "faster/longer/heavier than"
  { id: 's225', sentence: 'Ravi can run faster than Wei during PE lessons.', level: 2, sentenceSkills: ['comparison_structure'], focusLabel: 'Comparing speed', grammarNote: '"faster than" compares running speed.' },
  { id: 's226', sentence: 'The recess break is longer than the assembly break.', level: 2, sentenceSkills: ['comparison_structure'], focusLabel: 'Comparing duration', grammarNote: '"longer than" compares two time periods.' },
  { id: 's227', sentence: 'This dictionary is heavier than that storybook on the shelf.', level: 2, sentenceSkills: ['comparison_structure'], focusLabel: 'Comparing weight', grammarNote: '"heavier than" compares the weight of two objects.' },
  { id: 's228', sentence: 'Mei is a faster reader than Ahmad in our reading group.', level: 2, sentenceSkills: ['comparison_structure'], focusLabel: 'Comparing ability', grammarNote: '"faster...than" compares reading speed.' },
  // modal_order – "can", "cannot"
  { id: 's229', sentence: 'We cannot bring our phones to school every day.', level: 2, sentenceSkills: ['modal_order'], focusLabel: 'Prohibition with "cannot"', grammarNote: '"cannot" shows something is not allowed.' },
  { id: 's230', sentence: 'Siti can finish her homework before dinner time tonight.', level: 2, sentenceSkills: ['modal_order'], focusLabel: 'Ability with "can"', grammarNote: '"can" shows Siti is able to finish.' },
  { id: 's231', sentence: 'Ravi cannot reach the top shelf without a step stool.', level: 2, sentenceSkills: ['modal_order'], focusLabel: 'Inability with "cannot"', grammarNote: '"cannot" means not able to do something.' },
  { id: 's232', sentence: 'We can borrow three library books at one time.', level: 2, sentenceSkills: ['modal_order'], focusLabel: 'Permission with "can"', grammarNote: '"can" shows what is allowed.' },
  // tense_clue – simple past with "yesterday", "last week"
  { id: 's233', sentence: 'Yesterday, Ahmad forgot to bring his water bottle to school.', level: 2, sentenceSkills: ['tense_clue'], focusLabel: 'Past tense with "Yesterday"', grammarNote: '"Yesterday" signals past tense; "forgot" is the past form.' },
  { id: 's234', sentence: 'Last week, our class visited the science centre together.', level: 2, sentenceSkills: ['tense_clue'], focusLabel: 'Past tense with "Last week"', grammarNote: '"Last week" tells us the event already happened.' },
  { id: 's235', sentence: 'Mei practised her spelling words carefully last night at home.', level: 2, sentenceSkills: ['tense_clue'], focusLabel: 'Past tense with "last night"', grammarNote: '"last night" is a past-time marker.' },
  { id: 's236', sentence: 'Wei helped his father wash the car yesterday afternoon.', level: 2, sentenceSkills: ['tense_clue'], focusLabel: 'Past tense with "yesterday"', grammarNote: '"yesterday afternoon" shows the action is completed.' },
  // preposition_clue – "from", "near", "between", "behind"
  { id: 's237', sentence: 'The bookshop is near the bus stop on our street.', level: 2, sentenceSkills: ['preposition_clue'], focusLabel: 'Place preposition "near"', grammarNote: '"near" shows closeness to a place.' },
  { id: 's238', sentence: 'Ravi walked from the canteen to the classroom after recess.', level: 2, sentenceSkills: ['preposition_clue'], focusLabel: 'Movement preposition "from"', grammarNote: '"from...to" shows start and end of movement.' },
  { id: 's239', sentence: 'The garden is between the hall and the car park.', level: 2, sentenceSkills: ['preposition_clue'], focusLabel: 'Place preposition "between"', grammarNote: '"between" shows a position in the middle.' },
  { id: 's240', sentence: 'Siti hid behind the big tree during the game.', level: 2, sentenceSkills: ['preposition_clue'], focusLabel: 'Place preposition "behind"', grammarNote: '"behind" shows position at the back of something.' },

  // ── P3 (level 3) ──────────────────────────────────────────────────────────
  // connector_clue – "although", "when", fronted subordinates
  { id: 's241', sentence: 'Although it was raining, Mei still walked to school on time.', level: 3, sentenceSkills: ['connector_clue'], focusLabel: 'Concessive connector "Although"', grammarNote: '"Although" introduces a contrast clause at the front.' },
  { id: 's242', sentence: 'When the bell rang, the students lined up in the corridor.', level: 3, sentenceSkills: ['connector_clue'], focusLabel: 'Time connector "When"', grammarNote: '"When" starts a fronted time clause.' },
  { id: 's243', sentence: 'Although Ahmad studied hard, he found the test quite difficult.', level: 3, sentenceSkills: ['connector_clue'], focusLabel: 'Concessive "Although" clause', grammarNote: '"Although" shows a surprising contrast between effort and result.' },
  { id: 's244', sentence: 'When Siti opened the door, she saw a stray cat in the garden.', level: 3, sentenceSkills: ['connector_clue'], focusLabel: 'Fronted "When" clause', grammarNote: '"When" links two events in time order.' },
  // comparison_structure – "more...than", "adj-er than"
  { id: 's245', sentence: 'This maths problem is more difficult than the one we did yesterday.', level: 3, sentenceSkills: ['comparison_structure'], focusLabel: '"more...than" comparison', grammarNote: '"more difficult than" compares difficulty of two things.' },
  { id: 's246', sentence: 'Ravi is stronger than most of the boys in his PE class.', level: 3, sentenceSkills: ['comparison_structure'], focusLabel: '"-er than" comparison', grammarNote: '"stronger than" uses the -er form for comparison.' },
  { id: 's247', sentence: 'Reading storybooks is more enjoyable than doing extra worksheets after school.', level: 3, sentenceSkills: ['comparison_structure'], focusLabel: '"more...than" with activities', grammarNote: '"more enjoyable than" compares two activities.' },
  { id: 's248', sentence: 'The hawker centre is nearer than the restaurant from our school.', level: 3, sentenceSkills: ['comparison_structure'], focusLabel: '"-er than" with places', grammarNote: '"nearer than" compares distance.' },
  // modal_order – "should", "must"
  { id: 's249', sentence: 'You should return your library books before the due date.', level: 3, sentenceSkills: ['modal_order'], focusLabel: 'Advice with "should"', grammarNote: '"should" gives advice about what is the right thing to do.' },
  { id: 's250', sentence: 'All students must wear the school uniform during assembly every morning.', level: 3, sentenceSkills: ['modal_order'], focusLabel: 'Obligation with "must"', grammarNote: '"must" shows a strong obligation or rule.' },
  { id: 's251', sentence: 'Wei should practise his handwriting every day to improve his grades.', level: 3, sentenceSkills: ['modal_order'], focusLabel: 'Advice with "should"', grammarNote: '"should" recommends a good habit.' },
  { id: 's252', sentence: 'We must keep the classroom clean before we leave each afternoon.', level: 3, sentenceSkills: ['modal_order'], focusLabel: 'Rule with "must"', grammarNote: '"must" expresses a rule everyone follows.' },
  // tense_clue – past continuous, more complex past
  { id: 's253', sentence: 'Mei was reading a storybook when the teacher walked into the class.', level: 3, sentenceSkills: ['tense_clue'], focusLabel: 'Past continuous interrupted', grammarNote: '"was reading" shows an ongoing action interrupted by "walked".' },
  { id: 's254', sentence: 'The children were playing in the field when it started to rain.', level: 3, sentenceSkills: ['tense_clue'], focusLabel: 'Past continuous + past simple', grammarNote: '"were playing" is past continuous; "started" interrupts it.' },
  { id: 's255', sentence: 'Ahmad was drawing a poster while Siti was cutting out the letters.', level: 3, sentenceSkills: ['tense_clue'], focusLabel: 'Two past continuous actions', grammarNote: 'Both "was drawing" and "was cutting" happened at the same time.' },
  { id: 's256', sentence: 'Ravi was waiting at the bus stop when his mother called him.', level: 3, sentenceSkills: ['tense_clue'], focusLabel: 'Past continuous with interruption', grammarNote: '"was waiting" describes the background action.' },
  // preposition_clue – "across", "through", "along"
  { id: 's257', sentence: 'The students walked across the field to reach the assembly hall.', level: 3, sentenceSkills: ['preposition_clue'], focusLabel: 'Movement preposition "across"', grammarNote: '"across" means from one side to the other.' },
  { id: 's258', sentence: 'We ran through the corridor to get to the canteen before the queue.', level: 3, sentenceSkills: ['preposition_clue'], focusLabel: 'Movement preposition "through"', grammarNote: '"through" shows movement inside and out the other end.' },
  { id: 's259', sentence: 'Mei jogged along the park connector trail with her family on Sunday.', level: 3, sentenceSkills: ['preposition_clue'], focusLabel: 'Movement preposition "along"', grammarNote: '"along" means following the length of a path.' },
  { id: 's260', sentence: 'Wei cycled along the riverside path to his grandmother house after school.', level: 3, sentenceSkills: ['preposition_clue'], focusLabel: 'Direction with "along"', grammarNote: '"along" shows direction following a route.' },

  // ── P4 (level 4) ──────────────────────────────────────────────────────────
  // connector_clue – "If" conditionals, "so...that" result
  { id: 's261', sentence: 'If it rains after school, we will take the sheltered walkway instead.', level: 4, sentenceSkills: ['connector_clue'], focusLabel: 'Conditional "If" clause', grammarNote: '"If" introduces a condition; the result follows.' },
  { id: 's262', sentence: 'The hall was so crowded that we could not find any empty seats.', level: 4, sentenceSkills: ['connector_clue'], focusLabel: '"so...that" result structure', grammarNote: '"so...that" links a degree to its consequence.' },
  { id: 's263', sentence: 'If Ahmad finishes his project early, he can help Ravi with the poster.', level: 4, sentenceSkills: ['connector_clue'], focusLabel: 'Conditional with "If"', grammarNote: '"If" sets a condition for what happens next.' },
  { id: 's264', sentence: 'Siti was so excited that she jumped up and cheered loudly.', level: 4, sentenceSkills: ['connector_clue'], focusLabel: '"so...that" expressing degree', grammarNote: '"so excited that" links the emotion to the reaction.' },
  // comparison_structure – "less...than", "as...as"
  { id: 's265', sentence: 'This route is less crowded than the main road during the morning rush.', level: 4, sentenceSkills: ['comparison_structure'], focusLabel: '"less...than" comparison', grammarNote: '"less crowded than" shows a lower degree.' },
  { id: 's266', sentence: 'Mei is as hardworking as Ravi when it comes to completing daily homework.', level: 4, sentenceSkills: ['comparison_structure'], focusLabel: '"as...as" equal comparison', grammarNote: '"as...as" shows two things are equal in degree.' },
  { id: 's267', sentence: 'The maths test was less challenging than the science paper we sat last week.', level: 4, sentenceSkills: ['comparison_structure'], focusLabel: '"less...than" with tests', grammarNote: '"less challenging than" compares difficulty at a lower degree.' },
  { id: 's268', sentence: 'Wei can draw as neatly as Siti when he takes his time with each stroke.', level: 4, sentenceSkills: ['comparison_structure'], focusLabel: '"as...as" comparing skill', grammarNote: '"as neatly as" shows equal ability.' },
  // modal_order – "must not", "could not", "should always"
  { id: 's269', sentence: 'Students must not run along the corridor during the change of periods.', level: 4, sentenceSkills: ['modal_order'], focusLabel: 'Prohibition with "must not"', grammarNote: '"must not" forbids an action.' },
  { id: 's270', sentence: 'Ravi could not complete the puzzle because several pieces were missing.', level: 4, sentenceSkills: ['modal_order'], focusLabel: 'Past inability with "could not"', grammarNote: '"could not" shows inability in the past.' },
  { id: 's271', sentence: 'We should always greet our teachers politely when we see them in school.', level: 4, sentenceSkills: ['modal_order'], focusLabel: 'Strong advice with "should always"', grammarNote: '"should always" stresses a habitual good behaviour.' },
  { id: 's272', sentence: 'You must not touch the exhibits in the museum without permission from staff.', level: 4, sentenceSkills: ['modal_order'], focusLabel: 'Prohibition with "must not"', grammarNote: '"must not" states a firm rule.' },
  // tense_clue – future "will", mixed past/present
  { id: 's273', sentence: 'Ahmad will present his project to the whole class next Monday morning.', level: 4, sentenceSkills: ['tense_clue'], focusLabel: 'Future tense with "will"', grammarNote: '"will" marks a future action; "next Monday" confirms the time.' },
  { id: 's274', sentence: 'Mei practises the piano every evening because she will perform at the concert.', level: 4, sentenceSkills: ['tense_clue'], focusLabel: 'Mixed present and future tense', grammarNote: 'Present "practises" explains preparation; "will perform" is future.' },
  { id: 's275', sentence: 'Last term the class planted seeds, and now the sunflowers are blooming beautifully.', level: 4, sentenceSkills: ['tense_clue'], focusLabel: 'Mixed past and present tense', grammarNote: '"planted" is past; "are blooming" is present result.' },
  { id: 's276', sentence: 'Siti will join the debate team next year after she finishes her exams.', level: 4, sentenceSkills: ['tense_clue'], focusLabel: 'Future tense with time clause', grammarNote: '"will join" is future; "finishes" is present in the time clause.' },
  // preposition_clue – "despite" (as prep), "beyond", "throughout"
  { id: 's277', sentence: 'Despite the heavy rain, the National Day rehearsal continued on the field.', level: 4, sentenceSkills: ['preposition_clue'], focusLabel: 'Preposition "despite"', grammarNote: '"Despite" is followed by a noun phrase, not a clause.' },
  { id: 's278', sentence: 'The nature trail extends beyond the school fence into the neighbouring park.', level: 4, sentenceSkills: ['preposition_clue'], focusLabel: 'Preposition "beyond"', grammarNote: '"beyond" means further than a boundary.' },
  { id: 's279', sentence: 'The students showed great teamwork throughout the three-day outdoor adventure camp.', level: 4, sentenceSkills: ['preposition_clue'], focusLabel: 'Preposition "throughout"', grammarNote: '"throughout" means during the entire period.' },
  { id: 's280', sentence: 'Despite his injury, Ravi cheered loudly for his team from the sidelines.', level: 4, sentenceSkills: ['preposition_clue'], focusLabel: 'Preposition "despite"', grammarNote: '"Despite" introduces a contrasting circumstance as a noun phrase.' },

  // ── P5 (level 5) ──────────────────────────────────────────────────────────
  // connector_clue – "Not only...but also", "Despite", concessive
  { id: 's281', sentence: 'Not only did Mei win the art prize, but she also topped her English class.', level: 5, sentenceSkills: ['connector_clue'], focusLabel: '"Not only...but also" connector', grammarNote: '"Not only...but also" emphasises two achievements.' },
  { id: 's282', sentence: 'Despite feeling unwell, Ahmad insisted on finishing his group science project.', level: 5, sentenceSkills: ['connector_clue'], focusLabel: 'Concessive "Despite" connector', grammarNote: '"Despite" introduces a concessive phrase before the main clause.' },
  { id: 's283', sentence: 'Not only was the performance entertaining, but it also carried a meaningful message.', level: 5, sentenceSkills: ['connector_clue'], focusLabel: '"Not only...but also" connector', grammarNote: '"Not only...but also" highlights two qualities.' },
  { id: 's284', sentence: 'Despite the tight deadline, the students produced an impressive recycling display board.', level: 5, sentenceSkills: ['connector_clue'], focusLabel: 'Concessive "Despite" phrase', grammarNote: '"Despite" shows contrast between difficulty and achievement.' },
  // comparison_structure – "The more...the more" parallel comparative
  { id: 's285', sentence: 'The more Ravi practised his spelling, the fewer mistakes he made in dictation.', level: 5, sentenceSkills: ['comparison_structure'], focusLabel: '"The more...the fewer" parallel', grammarNote: 'Parallel comparative shows a proportional relationship.' },
  { id: 's286', sentence: 'The harder Siti studied for her exams, the better her results became this year.', level: 5, sentenceSkills: ['comparison_structure'], focusLabel: '"The harder...the better" parallel', grammarNote: 'Parallel comparative links effort to outcome.' },
  { id: 's287', sentence: 'The more books Wei read during the holidays, the richer his vocabulary grew.', level: 5, sentenceSkills: ['comparison_structure'], focusLabel: '"The more...the richer" parallel', grammarNote: 'Parallel comparatives show cause and effect progression.' },
  { id: 's288', sentence: 'The earlier the class started preparing, the smoother the concert rehearsal went.', level: 5, sentenceSkills: ['comparison_structure'], focusLabel: '"The earlier...the smoother" parallel', grammarNote: 'Two comparatives in parallel show how one change affects another.' },
  // modal_order – "might have", "could have", "should have"
  { id: 's289', sentence: 'Mei should have checked her answers before submitting the test paper to the teacher.', level: 5, sentenceSkills: ['modal_order'], focusLabel: 'Regret with "should have"', grammarNote: '"should have + past participle" expresses past regret.' },
  { id: 's290', sentence: 'Ahmad could have joined the football team if he had attended the tryouts last week.', level: 5, sentenceSkills: ['modal_order'], focusLabel: 'Missed chance with "could have"', grammarNote: '"could have + past participle" shows an unrealised past possibility.' },
  { id: 's291', sentence: 'The bus might have already left by the time Ravi reached the bus stop.', level: 5, sentenceSkills: ['modal_order'], focusLabel: 'Possibility with "might have"', grammarNote: '"might have + past participle" expresses uncertain past possibility.' },
  { id: 's292', sentence: 'Siti should have brought an umbrella because the sky was already turning grey.', level: 5, sentenceSkills: ['modal_order'], focusLabel: 'Regret with "should have"', grammarNote: '"should have + past participle" expresses a past missed action.' },
  // tense_clue – past perfect "had + past participle"
  { id: 's293', sentence: 'By the time Ahmad arrived at school, the morning assembly had already started.', level: 5, sentenceSkills: ['tense_clue'], focusLabel: 'Past perfect with "had already"', grammarNote: '"had already started" shows an action completed before another past event.' },
  { id: 's294', sentence: 'Mei had finished all her homework before her mother called her for dinner.', level: 5, sentenceSkills: ['tense_clue'], focusLabel: 'Past perfect before past event', grammarNote: '"had finished" shows the earlier of two past actions.' },
  { id: 's295', sentence: 'The rain had stopped by the time the students gathered at the assembly area.', level: 5, sentenceSkills: ['tense_clue'], focusLabel: 'Past perfect with "by the time"', grammarNote: '"had stopped" occurred before "gathered".' },
  { id: 's296', sentence: 'Wei had never visited the new library until his class went there last Friday.', level: 5, sentenceSkills: ['tense_clue'], focusLabel: 'Past perfect with "had never"', grammarNote: '"had never visited" shows no prior experience before the past event.' },
  // preposition_clue – "By means of", complex prepositional phrases
  { id: 's297', sentence: 'By means of a simple experiment, the students proved that plants need sunlight to grow.', level: 5, sentenceSkills: ['preposition_clue'], focusLabel: 'Complex preposition "By means of"', grammarNote: '"By means of" introduces the method or instrument used.' },
  { id: 's298', sentence: 'In addition to the written test, the pupils had to complete an oral presentation.', level: 5, sentenceSkills: ['preposition_clue'], focusLabel: 'Complex preposition "In addition to"', grammarNote: '"In addition to" adds extra information to the main point.' },
  { id: 's299', sentence: 'With the help of their teacher, the group built a working model volcano for Science.', level: 5, sentenceSkills: ['preposition_clue'], focusLabel: 'Complex preposition "With the help of"', grammarNote: '"With the help of" shows who assisted in the action.' },
  { id: 's300', sentence: 'By means of daily practice, Ravi improved his multiplication speed before the exam.', level: 5, sentenceSkills: ['preposition_clue'], focusLabel: 'Complex preposition "By means of"', grammarNote: '"By means of" tells how the improvement was achieved.' },

  // ── P6 (level 6) ──────────────────────────────────────────────────────────
  // connector_clue – Inversion triggers, "Whether...or"
  { id: 's301', sentence: 'Not until the results were announced did the students realise how well they had performed.', level: 6, sentenceSkills: ['connector_clue'], focusLabel: 'Inversion with "Not until"', grammarNote: '"Not until" at the front triggers subject-auxiliary inversion.' },
  { id: 's302', sentence: 'Whether the event is held indoors or outdoors, the committee must be prepared for both.', level: 6, sentenceSkills: ['connector_clue'], focusLabel: '"Whether...or" connector', grammarNote: '"Whether...or" presents two alternative conditions.' },
  { id: 's303', sentence: 'Seldom had the school choir performed with such confidence before the national competition.', level: 6, sentenceSkills: ['connector_clue'], focusLabel: 'Inversion with "Seldom"', grammarNote: '"Seldom" at the front triggers inversion of subject and auxiliary.' },
  { id: 's304', sentence: 'Whether Ahmad chooses Science or Art as his elective, he should discuss it with his parents.', level: 6, sentenceSkills: ['connector_clue'], focusLabel: '"Whether...or" with advice', grammarNote: '"Whether...or" offers alternatives before the main clause.' },
  // comparison_structure – Academic comparatives, "far more...than"
  { id: 's305', sentence: 'The oral examination proved far more demanding than the written component for many students.', level: 6, sentenceSkills: ['comparison_structure'], focusLabel: '"far more...than" comparison', grammarNote: '"far more demanding than" intensifies the comparative with "far".' },
  { id: 's306', sentence: 'Collaborative learning was found to be significantly more effective than individual revision alone.', level: 6, sentenceSkills: ['comparison_structure'], focusLabel: 'Academic comparative with intensifier', grammarNote: '"significantly more effective than" uses a formal intensifier.' },
  { id: 's307', sentence: 'The new science syllabus is far more rigorous than the previous version used in schools.', level: 6, sentenceSkills: ['comparison_structure'], focusLabel: '"far more...than" academic comparison', grammarNote: '"far more rigorous than" is a formal academic comparative.' },
  { id: 's308', sentence: 'Preparing for the PSLE proved considerably harder than the students had initially expected it to be.', level: 6, sentenceSkills: ['comparison_structure'], focusLabel: 'Formal comparative with intensifier', grammarNote: '"considerably harder than" uses a formal degree modifier.' },
  // modal_order – "Were...to" (formal conditional), "Had...been"
  { id: 's309', sentence: 'Were Mei to represent the school in the debate, she would need to prepare thoroughly.', level: 6, sentenceSkills: ['modal_order'], focusLabel: 'Formal conditional "Were...to"', grammarNote: '"Were...to" is a formal inverted conditional without "if".' },
  { id: 's310', sentence: 'Had Ahmad been more careful with his calculations, he would not have lost those marks.', level: 6, sentenceSkills: ['modal_order'], focusLabel: 'Inverted conditional "Had...been"', grammarNote: '"Had...been" inverts the past perfect to form a formal conditional.' },
  { id: 's311', sentence: 'Were the school to extend the library hours, more students could complete their research there.', level: 6, sentenceSkills: ['modal_order'], focusLabel: 'Formal conditional "Were...to"', grammarNote: '"Were...to" replaces "If...were to" in formal register.' },
  { id: 's312', sentence: 'Had Siti been given more time, she would have written a much stronger essay for the competition.', level: 6, sentenceSkills: ['modal_order'], focusLabel: 'Inverted past conditional "Had...been"', grammarNote: '"Had...been given" is an inverted conditional showing an unreal past.' },
  // tense_clue – Past perfect in reported speech, mixed tense control
  { id: 's313', sentence: 'Ravi mentioned that he had already submitted his project before the deadline last Friday.', level: 6, sentenceSkills: ['tense_clue'], focusLabel: 'Past perfect in reported speech', grammarNote: '"had already submitted" shifts further back in reported speech.' },
  { id: 's314', sentence: 'The teacher explained that the experiment had failed because the mixture was not stirred properly.', level: 6, sentenceSkills: ['tense_clue'], focusLabel: 'Reported speech with past perfect', grammarNote: '"had failed" is backshifted from "has failed" in reported speech.' },
  { id: 's315', sentence: 'Mei said that she had been practising the piano daily since the beginning of the school term.', level: 6, sentenceSkills: ['tense_clue'], focusLabel: 'Past perfect continuous in reported speech', grammarNote: '"had been practising" shows an ongoing past action reported later.' },
  { id: 's316', sentence: 'Ahmad reported that all the group members had contributed equally to the science poster.', level: 6, sentenceSkills: ['tense_clue'], focusLabel: 'Reported speech with past perfect', grammarNote: '"had contributed" backshifts the original past tense in indirect speech.' },
  // preposition_clue – "In spite of", "In accordance with", formal
  { id: 's317', sentence: 'In spite of the limited resources, the team produced an award-winning project for the fair.', level: 6, sentenceSkills: ['preposition_clue'], focusLabel: 'Formal preposition "In spite of"', grammarNote: '"In spite of" is a formal alternative to "despite".' },
  { id: 's318', sentence: 'In accordance with the school guidelines, all students must wear their name tags during outings.', level: 6, sentenceSkills: ['preposition_clue'], focusLabel: 'Formal preposition "In accordance with"', grammarNote: '"In accordance with" means following official rules.' },
  { id: 's319', sentence: 'In spite of the sweltering heat, the cross-country runners completed the course without complaint.', level: 6, sentenceSkills: ['preposition_clue'], focusLabel: 'Formal preposition "In spite of"', grammarNote: '"In spite of" introduces a contrasting circumstance formally.' },
  { id: 's320', sentence: 'In accordance with the new timetable, recess will be held fifteen minutes earlier starting next term.', level: 6, sentenceSkills: ['preposition_clue'], focusLabel: 'Formal preposition "In accordance with"', grammarNote: '"In accordance with" refers to compliance with an official schedule.' },
];
