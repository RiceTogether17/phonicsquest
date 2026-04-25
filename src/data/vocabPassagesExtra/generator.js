import { VOCAB_CATEGORIES } from '../vocabCategories.js';

const LEVELS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

const CATEGORY_SHORT = {
  contextInference: 'ci',
  definitionMatch: 'dm',
  synonymContrast: 'sc',
  morphologicalAffix: 'ma',
  collocationCloze: 'cc',
  grammaticalRole: 'gr',
  connectorClue: 'cn',
  idiomaticExpressions: 'ie',
  proverbsSayings: 'ps',
  scienceTechTerms: 'st',
  socialStudiesVocab: 'ss',
  grammarPrepositions: 'gp',
  grammarArticles: 'ga',
  grammarSVA: 'gs',
};

const LEXICON = {
  muddy: ['adjective', 'Covered with wet dirt.'],
  umbrella: ['noun', 'A tool you open over your head to keep off rain.'],
  dry: ['adjective', 'Not wet.'],
  sunny: ['adjective', 'Bright with strong sunlight.'],
  helmet: ['noun', 'A hard hat that protects the head.'],
  soaked: ['adjective', 'Very wet all over.'],

  library: ['noun', 'A place where people borrow and read books.'],
  canteen: ['noun', 'A school dining area where food is sold.'],
  playground: ['noun', 'An outdoor area where children play.'],
  corridor: ['noun', 'A passage that connects rooms in a building.'],
  clinic: ['noun', 'A place where a doctor sees patients.'],
  workshop: ['noun', 'A session where people learn by doing activities.'],

  cheerful: ['adjective', 'Happy and positive.'],
  gloomy: ['adjective', 'Dark or sad in mood.'],
  polite: ['adjective', 'Showing good manners.'],
  rude: ['adjective', 'Not polite.'],
  brief: ['adjective', 'Short in length or time.'],
  lengthy: ['adjective', 'Long in length or time.'],

  reusable: ['adjective', 'Able to be used again.'],
  rewrite: ['verb', 'To write something again.'],
  careless: ['adjective', 'Not careful and likely to make mistakes.'],
  preview: ['verb', 'To look at something before using it fully.'],
  unhappy: ['adjective', 'Not happy.'],
  teacher: ['noun', 'A person who teaches students.'],

  make: ['verb', 'To create or do something.'],
  pay: ['verb', 'To give money or attention.'],
  heavy: ['adjective', 'Having a lot of weight.'],
  rain: ['noun', 'Water that falls from clouds.'],
  decision: ['noun', 'A choice made after thinking.'],
  attention: ['noun', 'Careful focus on something.'],

  careful: ['adjective', 'Taking care to avoid mistakes or danger.'],
  carefully: ['adverb', 'In a careful way.'],
  success: ['noun', 'A good result from effort.'],
  successful: ['adjective', 'Having achieved a goal.'],
  swift: ['adjective', 'Fast and quick.'],
  swiftly: ['adverb', 'In a fast manner.'],

  determined: ['adjective', 'Not giving up easily.'],
  calm: ['adjective', 'Peaceful and not upset.'],
  confused: ['adjective', 'Unable to think clearly because things are unclear.'],
  focused: ['adjective', 'Giving full attention to a task.'],
  distracted: ['adjective', 'Unable to focus because attention is pulled away.'],
  patient: ['adjective', 'Able to wait calmly without complaining.'],

  'break the ice': ['phrase', 'To start a friendly conversation and reduce awkwardness.'],
  'hit the books': ['phrase', 'To study seriously.'],
  'piece of cake': ['phrase', 'Something very easy to do.'],
  'on cloud nine': ['phrase', 'Very happy.'],
  'spill the beans': ['phrase', 'To reveal a secret.'],
  'under the weather': ['phrase', 'Feeling unwell.'],

  practice: ['noun', 'Repeated training to improve skill.'],
  perfect: ['adjective', 'As good as possible.'],
  honesty: ['noun', 'The quality of telling the truth.'],
  trust: ['noun', 'Belief that someone is reliable and truthful.'],
  effort: ['noun', 'Energy used to do something difficult.'],
  reward: ['noun', 'Something good received after effort or success.'],

  microscope: ['noun', 'An instrument that makes tiny objects look larger.'],
  data: ['noun', 'Facts or information collected for study.'],
  digital: ['adjective', 'Using computer technology.'],
  energy: ['noun', 'Power used to do work.'],
  circuit: ['noun', 'A complete path that electricity flows through.'],
  sensor: ['noun', 'A device that detects changes such as heat or movement.'],

  citizen: ['noun', 'A person who belongs to a country and has rights and duties there.'],
  election: ['noun', 'A process where people vote to choose leaders.'],
  community: ['noun', 'A group of people living and working in one area.'],
  policy: ['noun', 'An official plan or rule made by leaders.'],
  volunteer: ['noun', 'A person who helps without being paid.'],
  heritage: ['noun', 'Traditions and history passed down from earlier generations.'],

  in: ['preposition', 'Inside a place or container.'],
  on: ['preposition', 'Touching and supported by a surface.'],
  at: ['preposition', 'In or near a specific place or time.'],
  under: ['preposition', 'Below something.'],
  beside: ['preposition', 'Next to something.'],
  between: ['preposition', 'In the middle of two things.'],

  a: ['article', 'Used before a singular noun that starts with a consonant sound.'],
  an: ['article', 'Used before a singular noun that starts with a vowel sound.'],
  the: ['article', 'Used for a specific noun known to the speaker and listener.'],
  some: ['determiner', 'An amount or number that is not exact.'],
  many: ['determiner', 'A large number of countable things.'],
  much: ['determiner', 'A large amount of uncountable substance.'],

  reads: ['verb', 'Looks at and understands written words.'],
  read: ['verb', 'To look at and understand written words.'],
  are: ['verb', 'A form of the verb "be" used with plural subjects.'],
  is: ['verb', 'A form of the verb "be" used with singular subjects.'],
  has: ['verb', 'Owns or holds something; used with singular subjects.'],
  have: ['verb', 'Own or hold something; used with plural subjects or I/you.'],
};

function pick(level, idx, arr) {
  const levelOffset = LEVELS.indexOf(level) * 2;
  return arr[(idx + levelOffset) % arr.length];
}

function levelContext(level) {
  const contexts = {
    p1: ['morning assembly', 'recess time', 'homework hour', 'playground break', 'reading corner', 'family dinner'],
    p2: ['science period', 'bus journey', 'library lesson', 'sports day', 'school garden', 'class duty'],
    p3: ['project discussion', 'community trip', 'group experiment', 'oral practice', 'eco-club task', 'music rehearsal'],
    p4: ['inquiry project', 'class debate', 'museum visit', 'service-learning activity', 'problem-solving workshop', 'journal writing'],
    p5: ['exam revision session', 'STEM challenge', 'leadership camp', 'heritage study', 'portfolio reflection', 'class presentation'],
    p6: ['PSLE practice lesson', 'current-affairs discussion', 'science briefing', 'school forum', 'research summary', 'community proposal'],
  };
  return contexts[level];
}

function makeDefinition(word) {
  const key = String(word || '').toLowerCase();
  if (LEXICON[key]) return LEXICON[key][1];
  const compact = String(word || '').trim();
  return `A useful word in this passage that matches the context. (${compact})`;
}

function makePos(word) {
  const key = String(word || '').toLowerCase();
  if (LEXICON[key]) return LEXICON[key][0];
  if (key.endsWith('ly')) return 'adverb';
  if (key.endsWith('ing') || key.endsWith('ed')) return 'verb';
  return 'word';
}

function buildLearningAids(text, answers) {
  const segments = text.split('___');
  return answers.map((_, i) => {
    const left = (segments[i] || '').trim().split(/\s+/).slice(-4).join(' ').replace(/[.,;:!?]+$/g, '').trim();
    const right = (segments[i + 1] || '').trim().split(/\s+/).slice(0, 4).join(' ').replace(/[.,;:!?]+$/g, '').trim();
    const span = right || left || 'context';
    return {
      hint: `Read the words near blank ${i + 1} and decide what meaning fits best.`,
      clue: {
        blankIndex: i,
        prompt: 'Which word or phrase helps you choose the answer?',
        acceptableSpans: [span],
        partialSpans: span.split(/\s+/).slice(0, 2),
        clueType: 'context-clue',
        explanation: `The phrase "${span}" gives context that points to the best answer for this blank.`,
      },
    };
  });
}

function buildPassageCore(category, level, idx) {
  const context = pick(level, idx, levelContext(level));

  const bank = {
    contextInference: {
      answers: ['muddy', 'umbrella', 'dry'], distractors: ['sunny', 'helmet', 'soaked'],
      text: `During ${context}, the school path became ___ after rain. Nia opened her ___ before crossing the courtyard. She stayed under the corridor to keep ___.`,
    },
    definitionMatch: {
      answers: ['library', 'canteen', 'playground'], distractors: ['corridor', 'clinic', 'workshop'],
      text: `In this school story, pupils borrow books in the ___. They buy meals in the ___. They run and climb at the ___.`,
    },
    synonymContrast: {
      answers: ['cheerful', 'rude', 'brief'], distractors: ['gloomy', 'polite', 'lengthy'],
      text: `Mina looked ___ after hearing good news. The boy who pushed in line was ___. The principal gave a ___ reminder before class ended.`,
    },
    morphologicalAffix: {
      answers: ['reusable', 'rewrite', 'careless'], distractors: ['preview', 'unhappy', 'teacher'],
      text: `For Green Week, we brought a ___ bottle to reduce waste. After checking spelling, I had to ___ one paragraph. The teacher warned us that ___ work causes avoidable mistakes.`,
    },
    collocationCloze: {
      answers: ['make', 'heavy', 'attention'], distractors: ['pay', 'rain', 'decision'],
      text: `Before the group task, we must ___ a decision together. During monsoon season, ___ rain can flood the drain. In class, always pay ___ to safety instructions.`,
    },
    grammaticalRole: {
      answers: ['careful', 'carefully', 'success'], distractors: ['successful', 'swift', 'swiftly'],
      text: `A ___ plan helps the team avoid mistakes. The pupils checked each measurement ___ before cutting the board. Their final model was a clear ___.`,
    },
    connectorClue: {
      answers: ['determined', 'focused', 'patient'], distractors: ['calm', 'confused', 'distracted'],
      text: `Although the puzzle looked hard, Zara stayed ___ and kept trying. Because the hall was noisy, she remained ___ on her notes. Since the printer was slow, the class became ___ and waited quietly.`,
    },
    idiomaticExpressions: {
      answers: ['break the ice', 'piece of cake', 'under the weather'], distractors: ['hit the books', 'on cloud nine', 'spill the beans'],
      text: `At the start of camp, the leader told a joke to ___. The warm-up quiz was a ___ for our team. Ken skipped training because he felt ___.`,
    },
    proverbsSayings: {
      answers: ['practice', 'trust', 'reward'], distractors: ['perfect', 'honesty', 'effort'],
      text: `Coach Lim reminded us that ___ makes perfect. She said honesty builds ___. She also taught us that effort brings its own ___.`,
    },
    scienceTechTerms: {
      answers: ['microscope', 'data', 'sensor'], distractors: ['digital', 'energy', 'circuit'],
      text: `In the lab, we used a ___ to observe tiny onion cells. We recorded every reading as ___. The robot stopped when its ___ detected movement near the table.`,
    },
    socialStudiesVocab: {
      answers: ['citizen', 'community', 'election'], distractors: ['policy', 'volunteer', 'heritage'],
      text: `A responsible ___ follows laws and helps others. During service day, our ___ cleaned the park together. Next term, students will vote in an ___ for class leaders.`,
    },
    grammarPrepositions: {
      answers: ['in', 'between', 'under'], distractors: ['on', 'at', 'beside'],
      text: `The markers are kept ___ the top drawer. The map hangs ___ the noticeboard and the clock. During drill, pupils waited ___ the sheltered walkway.`,
    },
    grammarArticles: {
      answers: ['an', 'a', 'the'], distractors: ['some', 'many', 'much'],
      text: `Mira packed ___ umbrella before leaving home. She borrowed ___ marker from her partner. At the gate, she thanked ___ guard who helped her.`,
    },
    grammarSVA: {
      answers: ['reads', 'are', 'has'], distractors: ['read', 'is', 'have'],
      text: `Every afternoon, my sister ___ storybooks in the quiet corner. The science notes ___ on the middle shelf. Each pupil ___ a role during the group task.`,
    },
  };

  return bank[category];
}

function buildPassage(category, level, idx) {
  const core = buildPassageCore(category, level, idx);
  const wordBank = [...core.answers, ...core.distractors];
  const learning = buildLearningAids(core.text, core.answers);
  const definitions = Object.fromEntries(wordBank.map(w => [w, makeDefinition(w)]));
  const partOfSpeechMap = Object.fromEntries(wordBank.map(w => [w, makePos(w)]));
  const short = CATEGORY_SHORT[category];
  const levelNum = level.replace('p', '');

  return {
    id: `vxp-${short}-p${levelNum}-${String(idx + 1).padStart(2, '0')}`,
    title: `${VOCAB_CATEGORIES[category]?.label || category} ${level.toUpperCase()} Set ${idx + 1}`,
    text: core.text,
    answers: core.answers,
    wordBank,
    hints: learning.map(l => l.hint),
    clues: learning.map(l => l.clue),
    definitions,
    partOfSpeechMap,
    xp: levelNum <= '2' ? 20 : levelNum <= '4' ? 30 : 40,
  };
}

export function buildExtraPassageBank(levels = []) {
  const out = {};
  for (const category of Object.keys(VOCAB_CATEGORIES)) {
    out[category] = {};
    for (const level of levels) {
      out[category][level] = Array.from({ length: 6 }, (_, i) => buildPassage(category, level, i));
    }
  }
  return out;
}
