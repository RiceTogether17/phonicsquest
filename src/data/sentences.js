/**
 * PhonicsQuest – Sentence Forge Quest Data
 *
 * Sentences organised by level (1 = P1 easiest → 6 = P6 hardest).
 * Each sentence is shuffled word-by-word in the game for the player to re-order.
 *
 * PROGRESSION MODEL (sentence-pattern focused, not vocabulary-sophistication focused)
 * ──────────────────────────────────────────────────────────────────────────────────
 * P1  Simple SVO / is-am-are / place phrases / basic noun groups
 * P2  Simple past / because-but-and-so / time phrases (yesterday, after school)
 * P3  Adverbs / before-after-when clauses / comparatives / clause expansion
 * P4  Modals / future meaning / cause-result order / longer time phrases
 * P5  Clause ordering / formal connectors / so-that / not only…but also
 * P6  Inverted structures / relative clauses / conditionals / reported speech
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
  // ── P1: SVO / is-am-are / place phrases / basic noun groups ──────────────
  { id: 's001', sentence: 'The cat is on the mat.',          level: 1 },
  { id: 's002', sentence: 'I can see a big dog.',            level: 1 },
  { id: 's003', sentence: 'She has a red hat.',              level: 1 },
  { id: 's004', sentence: 'We play in the park.',            level: 1 },
  { id: 's005', sentence: 'He ran to the bus.',              level: 1 },
  { id: 's006', sentence: 'The hen has an egg.',             level: 1 },
  { id: 's007', sentence: 'I like to eat rice.',             level: 1 },
  { id: 's008', sentence: 'My bag is on the table.',         level: 1 },
  { id: 's009', sentence: 'The tree is very tall.',          level: 1 },
  { id: 's010', sentence: 'We sit in the classroom.',        level: 1 },

  // ── P2: Simple past / because-but-and-so / time phrases ──────────────────
  { id: 's011', sentence: 'She fell because the floor was wet.',           level: 2 },
  { id: 's012', sentence: 'I wanted to play but it was raining.',          level: 2 },
  { id: 's013', sentence: 'After school, she helped her mother at home.',  level: 2 },
  { id: 's014', sentence: 'We played games and then went home.',           level: 2 },
  { id: 's015', sentence: 'He stayed at home because he was sick.',        level: 2 },
  { id: 's016', sentence: 'My father drove me to school yesterday.',       level: 2 },
  { id: 's017', sentence: 'She washed her hands before she ate lunch.',    level: 2 },
  { id: 's018', sentence: 'The baby cried and her mother came.',           level: 2 },
  { id: 's019', sentence: 'It was raining so we stayed indoors.',          level: 2 },
  { id: 's020', sentence: 'They had a picnic last Saturday morning.',      level: 2 },

  // ── P3: Adverbs / before-after-when / comparatives / clause expansion ────
  { id: 's021', sentence: 'When the bell rang, all the students stood up.',         level: 3 },
  { id: 's022', sentence: 'My sister is two years older than me.',                  level: 3 },
  { id: 's023', sentence: 'Before going to bed, Tom brushed his teeth.',            level: 3 },
  { id: 's024', sentence: 'The old man walked slowly down the stairs.',             level: 3 },
  { id: 's025', sentence: 'After finishing her homework, she watched television.',  level: 3 },
  { id: 's026', sentence: 'He ran faster than anyone else in the class.',           level: 3 },
  { id: 's027', sentence: 'Although it was raining, they continued to play.',      level: 3 },
  { id: 's028', sentence: 'The new library is much bigger than the old one.',      level: 3 },
  { id: 's029', sentence: 'She whispered so that the baby would not wake up.',     level: 3 },
  { id: 's030', sentence: 'When they arrived at the park, it started to rain.',    level: 3 },

  // ── P4: Modals / future / cause-result order / longer time phrases ────────
  { id: 's031', sentence: 'We should always wash our hands before eating.',                 level: 4 },
  { id: 's032', sentence: 'If it rains tomorrow, the match will be cancelled.',             level: 4 },
  { id: 's033', sentence: 'You must not run along the school corridor.',                    level: 4 },
  { id: 's034', sentence: 'Because he studied hard every day, he passed his exam.',         level: 4 },
  { id: 's035', sentence: 'She could not finish her project in time.',                      level: 4 },
  { id: 's036', sentence: 'The doctor told him to rest and drink plenty of water.',         level: 4 },
  { id: 's037', sentence: 'Although she was tired, she continued to help her friend.',      level: 4 },
  { id: 's038', sentence: 'We had to leave early to catch the first bus.',                  level: 4 },
  { id: 's039', sentence: 'The school will hold its annual sports day next Friday.',        level: 4 },
  { id: 's040', sentence: 'She worked so hard that she finished an hour ahead of time.',   level: 4 },

  // ── P5: Clause ordering / formal-but-primary-friendly structures ──────────
  { id: 's041', sentence: 'Despite the heavy rain, the match continued until the final whistle.', level: 5 },
  { id: 's042', sentence: 'Without enough sleep, students find it hard to concentrate in class.', level: 5 },
  { id: 's043', sentence: 'The more she practised, the more confident she became.',              level: 5 },
  { id: 's044', sentence: 'After much thought, the class decided to raise money for charity.',   level: 5 },
  { id: 's045', sentence: 'She not only completed her work on time but also helped others.',     level: 5 },
  { id: 's046', sentence: 'By the time they arrived, the show had already ended.',              level: 5 },
  { id: 's047', sentence: 'He worked so carefully that he did not make a single mistake.',      level: 5 },
  { id: 's048', sentence: 'Both the students and their teacher were proud of the result.',      level: 5 },
  { id: 's049', sentence: 'She practised every day so that she could improve her results.',     level: 5 },
  { id: 's050', sentence: 'Having saved enough money, she finally bought the book she wanted.', level: 5 },

  // ── P6: Advanced clause structures / conditionals / relative / reported ───
  { id: 's051', sentence: 'Although the task was difficult, she persevered and succeeded in the end.',     level: 6 },
  { id: 's052', sentence: 'The book, which was written by a local author, won a national award.',          level: 6 },
  { id: 's053', sentence: 'Not only did he finish the race, but he also helped a fellow runner.',          level: 6 },
  { id: 's054', sentence: 'It is important that we take care of the environment around us.',               level: 6 },
  { id: 's055', sentence: 'Had she left earlier, she would not have missed the morning assembly.',         level: 6 },
  { id: 's056', sentence: 'The principal praised the students who had shown great kindness and teamwork.', level: 6 },
  { id: 's057', sentence: 'She told her teacher that she had tried her best on the project.',              level: 6 },
  { id: 's058', sentence: 'The old library, which had stood for fifty years, was finally renovated.',     level: 6 },
  { id: 's059', sentence: 'If every student does their part, the school will become a better place.',     level: 6 },
  { id: 's060', sentence: 'Whether it was raining or sunny, they always arrived at school on time.',      level: 6 },
];
