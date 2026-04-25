/**
 * PhonicsQuest – Vocabulary MCQ Item Bank
 *
 * Item generation follows the vocabulary category spine and keeps
 * contextual stems for upper-primary practice.
 */

export const VOCAB_MCQ_LEVELS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

const LEVEL_CATEGORY_PLAN = {
  P1: ['contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue'],
  P2: ['contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'wordParts'],
  P3: ['contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue', 'wordParts', 'scienceTechTerms'],
  P4: ['contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue', 'wordParts', 'socialStudiesVocab'],
  P5: ['contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue', 'wordParts', 'idiomaticExpressions', 'proverbsSayings', 'scienceTechTerms'],
  P6: ['contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue', 'wordParts', 'idiomaticExpressions', 'proverbsSayings', 'socialStudiesVocab'],
};
const CONTEXT_TAILS = [
  'during morning assembly',
  'in class discussion',
  'while revising for the exam',
  'at the neighbourhood library',
  'during project work',
  'before the oral presentation',
  'during group rehearsal',
  'at the science corner',
  'in the canteen queue',
  'during values-in-action day',
  'during enrichment week',
  'before the final check',
];
const LEVEL_TAILS = {
  P1: ['during a short class story', 'before playtime', 'after phonics station'],
  P2: ['during worksheet practice', 'before sharing time', 'after library period'],
  P3: ['during group discussion', 'before oral reading', 'after science period'],
  P4: ['during project reflection', 'before class presentation', 'after feedback session'],
  P5: ['during exam revision', 'before composition drafting', 'after problem-solving workshop'],
  P6: ['during PSLE preparation', 'before timed correction', 'after strategy review'],
};

function rotate(arr, idx) {
  return arr[idx % arr.length];
}

function buildChoices(answer, distractors) {
  return [answer, ...distractors].slice(0, 4);
}

function difficultyFor(level, idx) {
  if (level === 'P1' || level === 'P2') return idx % 5 === 0 ? 2 : 1;
  if (level === 'P3' || level === 'P4') return idx % 4 === 0 ? 3 : 2;
  return idx % 3 === 0 ? 3 : 2;
}

function decorateStem(stem, level, idx) {
  const tail = rotate([...(LEVEL_TAILS[level] || []), ...CONTEXT_TAILS], idx);
  return `${String(stem).replace(/\.$/, '')} ${tail}.`;
}

const VOCAB_BUILDERS = {
  contextInference(level, i) {
    const rows = [
      ['After running three rounds in the sun, Amir felt very ___.', 'tired', ['cheerful', 'spotless', 'plastic']],
      ['The classroom was so ___ that everyone could hear a pin drop.', 'quiet', ['crowded', 'muddy', 'rapid']],
      ['Because the floor was wet, we walked ___.', 'carefully', ['lazily', 'noisily', 'luckily']],
      ['The soup smelled fresh and tasted very ___.', 'delicious', ['dusty', 'broken', 'narrow']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'contextInference', subskill: 'meaning_in_context', q, choices: buildChoices(answer, ds), answer, explain: 'Use clues in the sentence to infer meaning.' };
  },
  definitionMatch(level, i) {
    const rows = [
      ['A person who treats sick animals is a ___.', 'veterinarian', ['librarian', 'tailor', 'cashier']],
      ['A place where we borrow storybooks is a ___.', 'library', ['bakery', 'stadium', 'factory']],
      ['A machine that shows moving pictures on a screen is a ___.', 'projector', ['stapler', 'compass', 'teapot']],
      ['A long journey to explore a place is an ___.', 'expedition', ['equation', 'invitation', 'reflection']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'definitionMatch', subskill: 'word_meaning', q, choices: buildChoices(answer, ds), answer, explain: 'Choose the word that matches the definition.' };
  },
  synonymContrast(level, i) {
    const rows = [
      ['The principal’s message was brief but very ___.', 'meaningful', ['careless', 'shallow', 'crooked']],
      ['The opposite of "ancient" in this sentence is ___.', 'modern', ['fragile', 'gentle', 'hollow']],
      ['Her tone was polite, not ___.', 'rude', ['formal', 'steady', 'honest']],
      ['The child was joyful, which means she was ___.', 'happy', ['angry', 'silent', 'frozen']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'synonymContrast', subskill: 'synonym_antonym', q, choices: buildChoices(answer, ds), answer, explain: 'Select the closest synonym or contrast word from context.' };
  },
  collocationCloze(level, i) {
    const rows = [
      ['Please ___ attention to the safety signs at the lab door.', 'pay', ['do', 'keep', 'set']],
      ['The class decided to ___ a charity sale next Friday.', 'hold', ['make', 'draw', 'carry']],
      ['After discussion, the team ___ a decision quickly.', 'reached', ['caught', 'drew', 'lifted']],
      ['To improve, you should ___ an effort every day.', 'make', ['do', 'bring', 'throw']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'collocationCloze', subskill: 'word_partners', q, choices: buildChoices(answer, ds), answer, explain: 'Some words naturally go together as collocations.' };
  },
  grammaticalRole(level, i) {
    const rows = [
      ['The class admired her ___ performance during speech day.', 'confident', ['confidence', 'confidently', 'confide']],
      ['The referee blew the whistle ___.', 'sharply', ['sharp', 'sharpness', 'sharpen']],
      ['Their ___ helped the new pupil settle in quickly.', 'kindness', ['kind', 'kindly', 'kinder']],
      ['The team moved with great ___ during the relay.', 'speed', ['speedy', 'speedily', 'speeding']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'grammaticalRole', subskill: 'word_form', q, choices: buildChoices(answer, ds), answer, explain: 'Pick the word form that fits the grammar slot.' };
  },
  connectorClue(level, i) {
    const rows = [
      ['Although the backpack looked small, it was surprisingly ___.', 'heavy', ['empty', 'gentle', 'silent']],
      ['The map was clear; however, the route was still ___.', 'confusing', ['tidy', 'famous', 'silent']],
      ['Because the lights went out suddenly, the hall became ___.', 'dark', ['tiny', 'modern', 'spacious']],
      ['She was nervous, yet her voice remained ___.', 'steady', ['crooked', 'dusty', 'fragile']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'connectorClue', subskill: 'connector_inference', q, choices: buildChoices(answer, ds), answer, explain: 'Use the connector to infer the missing meaning word.' };
  },
  wordParts(level, i) {
    const rows = [
      ['The prefix "re-" in "rewrite" means to do it ___.', 'again', ['slowly', 'poorly', 'outside']],
      ['A person who drives is a ___.', 'driver', ['driving', 'driveful', 'driveless']],
      ['The suffix "-less" in "careless" means "without ___."', 'care', ['speed', 'noise', 'luck']],
      ['If something is "unfair", the prefix "un-" means ___.', 'not', ['very', 'more', 'before']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'morphologicalAffix', subskill: 'prefix_suffix', q, choices: buildChoices(answer, ds), answer, explain: 'Word parts can help you infer meaning.' };
  },
  idiomaticExpressions(level, i) {
    const rows = [
      ['When Jia Min said "break the ice", she meant to ___.', 'start friendly conversation', ['smash something cold', 'end the meeting', 'draw a cube']],
      ['"Hit the books" means to ___.', 'study hard', ['close the library', 'buy textbooks', 'tear paper']],
      ['If someone is "on cloud nine", the person feels ___.', 'very happy', ['very sleepy', 'very angry', 'very hungry']],
      ['"Piece of cake" describes a task that is ___.', 'very easy', ['very expensive', 'very noisy', 'very late']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'idiomaticExpressions', subskill: 'idiom_meaning', q, choices: buildChoices(answer, ds), answer, explain: 'Idioms are figurative, not literal.' };
  },
  proverbsSayings(level, i) {
    const rows = [
      ['"Practice makes ___."', 'perfect', ['faster', 'silent', 'famous']],
      ['"Where there is a will, there is a ___."', 'way', ['roadblock', 'ticket', 'raincoat']],
      ['"Actions speak louder than ___."', 'words', ['coins', 'voices', 'windows']],
      ['"A stitch in time saves ___."', 'nine', ['mine', 'fine', 'line']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'proverbsSayings', subskill: 'proverb_completion', q, choices: buildChoices(answer, ds), answer, explain: 'Choose the proverb word that completes the saying correctly.' };
  },
  scienceTechTerms(level, i) {
    const rows = [
      ['Plants make food using sunlight through ___.', 'photosynthesis', ['evaporation', 'erosion', 'migration']],
      ['A program used to browse websites is a web ___.', 'browser', ['charger', 'beaker', 'ruler']],
      ['The boiling point of water is measured using a ___.', 'thermometer', ['compass', 'tripod', 'magnet']],
      ['A robot uses sensors to ___ its surroundings.', 'detect', ['decorate', 'defend', 'delay']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'scienceTechTerms', subskill: 'topic_vocabulary', q, choices: buildChoices(answer, ds), answer, explain: 'Use science and technology context clues.' };
  },
  socialStudiesVocab(level, i) {
    const rows = [
      ['People choose leaders during an ___.', 'election', ['excursion', 'eruption', 'equation']],
      ['A person who belongs to a country is a ___.', 'citizen', ['chemist', 'captain', 'carpenter']],
      ['Rules made by the government are called ___.', 'laws', ['drawings', 'lanes', 'ladders']],
      ['Helping at a food drive is a form of ___.', 'volunteering', ['calculating', 'whispering', 'postponing']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'socialStudiesVocab', subskill: 'civics_terms', q, choices: buildChoices(answer, ds), answer, explain: 'Use social studies context to identify vocabulary.' };
  },
};

function toCanonicalCategory(cat) {
  if (cat === 'wordParts') return 'morphologicalAffix';
  return cat;
}

function buildLevel(level) {
  const target = 150;
  const cats = LEVEL_CATEGORY_PLAN[level];
  const items = [];
  const categoryCursor = Object.fromEntries(cats.map(c => [c, 0]));

  for (let i = 0; i < target; i += 1) {
    const baseCat = cats[i % cats.length];
    const localIndex = categoryCursor[baseCat];
    categoryCursor[baseCat] += 1;
    const spec = VOCAB_BUILDERS[baseCat](level, localIndex);
    items.push({
      id: `v-${level.toLowerCase()}-${String(i + 1).padStart(3, '0')}`,
      level,
      category: toCanonicalCategory(spec.category),
      subskill: spec.subskill,
      difficulty: difficultyFor(level, i),
      q: decorateStem(spec.q, level, i + localIndex * 2),
      choices: spec.choices,
      answer: spec.answer,
      explain: spec.explain,
    });
  }

  return items;
}

export const VOCAB_MCQ_ITEMS = Object.fromEntries(
  VOCAB_MCQ_LEVELS.map(level => [level, buildLevel(level)]),
);
