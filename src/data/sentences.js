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
  { id: 's001', sentence: 'The canteen is on the first floor.',          level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Verb + Place' },
  { id: 's002', sentence: 'I can see the school bus from here.',         level: 1, sentenceSkills: ['word_order', 'modal_order'], focusLabel: 'Modal verb order' },
  { id: 's003', sentence: 'She has a new pencil case.',                  level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Verb + Object' },
  { id: 's004', sentence: 'We play in the park.',            level: 1, sentenceSkills: ['word_order'], focusLabel: 'Basic SVO' },
  { id: 's005', sentence: 'He ran to the bus.',              level: 1, sentenceSkills: ['word_order', 'tense_clue'], focusLabel: 'Past tense', grammarNote: '"ran" is the past tense of "run" — the verb shows the action happened already.' },
  { id: 's006', sentence: 'My class has twenty-five pupils.',            level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Verb + Object' },
  { id: 's007', sentence: 'I like to eat rice.',             level: 1, sentenceSkills: ['word_order'], focusLabel: 'Basic SVO' },
  { id: 's008', sentence: 'My bag is on the table.',         level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Place' },
  { id: 's009', sentence: 'The tree is very tall.',          level: 1, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'Subject + Adjective' },
  { id: 's010', sentence: 'We sit in the classroom.',        level: 1, sentenceSkills: ['word_order'], focusLabel: 'Basic SVO' },

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
    id: 's016', sentence: 'My father took me to the hawker centre yesterday.', level: 2,
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
    id: 's020', sentence: 'They had a picnic last Saturday morning.', level: 2,
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
  { id: 's024', sentence: 'The old man walked slowly down the stairs.', level: 3, sentenceSkills: ['word_order', 'tense_clue'], grammarNote: '"walked" is past tense. Adverbs like "slowly" usually follow the verb.', focusLabel: 'Adverb placement' },
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
    id: 's039', sentence: 'The school will hold its annual sports day next Friday.', level: 4,
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

  // ── P5: Fronted concessive/participial phrases · Not only…but also ─────────
  { id: 's041', sentence: 'Despite the heavy rain, the match continued until the final whistle.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Despite', firstWordHint: '"Despite" starts a concessive phrase — it goes first, before the comma.', punctuationHint: 'A comma follows the concessive phrase "Despite the heavy rain".', focusLabel: 'Concessive phrase' },
  { id: 's042', sentence: 'Without enough sleep, students find it hard to concentrate in class.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Without', firstWordHint: '"Without" starts a fronted prepositional phrase — it goes first.', focusLabel: 'Fronted prepositional phrase' },
  { id: 's043', sentence: 'The more she practised, the more confident she became.', level: 5, sentenceSkills: ['comparison_structure', 'clause_boundary'], grammarNote: '"The more…the more…" is a parallel comparative structure — both halves are needed.', focusLabel: 'Parallel comparative' },
  { id: 's044', sentence: 'After much thought, the class decided to raise money for charity.', level: 5, sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue'], expectedFirstWord: 'After', firstWordHint: '"After" starts a fronted time phrase — it comes before the comma.', focusLabel: 'Fronted time phrase' },
  { id: 's045', sentence: 'She not only completed her work on time but also helped others.', level: 5, sentenceSkills: ['connector_clue'], expectedConnector: 'only', grammarNote: '"not only…but also" is a paired connector — both parts must be in the sentence.', focusLabel: 'Not only…but also' },
  { id: 's046', sentence: 'By the time they arrived, the show had already ended.', level: 5, sentenceSkills: ['time_order_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'By', firstWordHint: '"By the time" starts a time clause — it comes first, before the comma.', focusLabel: 'Time reference clause' },
  { id: 's047', sentence: 'He worked so carefully that he did not make a single mistake.', level: 5, sentenceSkills: ['connector_clue', 'clause_boundary'], grammarNote: '"so…that" is a result structure — so + adverb/adjective + that + result clause.', focusLabel: 'So…that structure' },
  { id: 's048', sentence: 'Both the students and their teacher were proud of the result.', level: 5, sentenceSkills: ['connector_clue'], expectedConnector: 'and', grammarNote: '"Both…and" links two subjects — they go before the verb.', focusLabel: 'Both…and structure' },
  { id: 's049', sentence: 'She practised every day so that she could improve her results.', level: 5, sentenceSkills: ['connector_clue', 'tense_clue'], expectedConnector: 'so', grammarNote: '"so that" introduces the purpose clause — it follows the main action.', focusLabel: 'Purpose clause' },
  { id: 's050', sentence: 'Having saved enough money, she finally bought the book she wanted.', level: 5, sentenceSkills: ['first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Having', firstWordHint: '"Having saved" is a participial phrase — it comes at the start, before the comma.', punctuationHint: 'A comma follows the participial phrase "Having saved enough money".', focusLabel: 'Fronted participial phrase' },

  // ── P6: Subject-auxiliary inversion · Inverted conditional · Embedded relative ──
  { id: 's051', sentence: 'Although the task was difficult, she persevered and succeeded in the end.', level: 6, sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Although', firstWordHint: '"Although" starts a concessive clause — it comes first, before the comma.', focusLabel: 'Concessive clause' },
  { id: 's052', sentence: 'The book, which was written by a local author, won a national award.', level: 6, sentenceSkills: ['clause_boundary', 'connector_clue'], grammarNote: '"which was written by a local author" is a relative clause inserted with commas.', focusLabel: 'Embedded relative clause' },
  { id: 's053', sentence: 'Not only did he finish the race, but he also helped a fellow runner.', level: 6, sentenceSkills: ['inversion_pattern', 'connector_clue', 'first_word_clue'], expectedFirstWord: 'Not', firstWordHint: '"Not only did he…" uses subject-auxiliary inversion — "did" comes before "he".', grammarNote: 'After "Not only", subject and auxiliary are inverted: Not only did + subject + verb.', focusLabel: 'Subject-auxiliary inversion' },
  { id: 's054', sentence: 'It is important that we take care of the environment around us.', level: 6, sentenceSkills: ['word_order', 'subject_action_clue'], focusLabel: 'It is + adjective + that structure' },
  { id: 's055', sentence: 'Had she left earlier, she would not have missed the morning assembly.', level: 6, sentenceSkills: ['inversion_pattern', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Had', firstWordHint: '"Had she left" uses inverted conditional structure — "Had" comes before "she".', punctuationHint: 'A comma follows the inverted conditional clause "Had she left earlier".', grammarNote: 'Inverted conditional: Had + subject + past participle + comma + result.', focusLabel: 'Inverted conditional' },
  { id: 's056', sentence: 'The principal praised the students who had shown great kindness and teamwork.', level: 6, sentenceSkills: ['clause_boundary', 'connector_clue'], grammarNote: '"who had shown" is a relative clause modifying "students" — it follows directly after the noun.', focusLabel: 'Relative clause' },
  { id: 's057', sentence: 'She told her teacher that she had tried her best on the project.', level: 6, sentenceSkills: ['connector_clue', 'tense_clue'], expectedConnector: 'that', grammarNote: '"that she had tried" is a reported clause — "that" links the reporting verb to the reported speech.', focusLabel: 'Reported speech' },
  { id: 's058', sentence: 'The old library, which had stood for fifty years, was finally renovated.', level: 6, sentenceSkills: ['clause_boundary', 'connector_clue'], grammarNote: '"which had stood for fifty years" is a non-defining relative clause, inserted with commas.', focusLabel: 'Non-defining relative clause' },
  { id: 's059', sentence: 'If every student does their part, the school will become a better place.', level: 6, sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'If', firstWordHint: '"If" starts the condition — it must come first, before the comma.', focusLabel: 'Conditional clause' },
  { id: 's060', sentence: 'Whether it was raining or sunny, they always arrived at school on time.', level: 6, sentenceSkills: ['connector_clue', 'first_word_clue', 'punctuation_clue', 'clause_boundary'], expectedFirstWord: 'Whether', firstWordHint: '"Whether" starts an alternative condition — it comes first, before the comma.', focusLabel: 'Alternative condition' },
];
