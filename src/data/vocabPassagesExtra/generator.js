import { VOCAB_CATEGORIES } from '../vocabCategories.js';

const LEVELS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

const CATEGORY_SHORT = {
  contextInference: 'ci', definitionMatch: 'dm', synonymContrast: 'sc', morphologicalAffix: 'ma',
  collocationCloze: 'cc', grammaticalRole: 'gr', connectorClue: 'cn', idiomaticExpressions: 'ie',
  proverbsSayings: 'ps', scienceTechTerms: 'st', socialStudiesVocab: 'ss', grammarPrepositions: 'gp',
  grammarArticles: 'ga', grammarSVA: 'gs',
};

const LEXICON = {
  muddy: ['adjective', 'Covered with wet dirt.'], umbrella: ['noun', 'A foldable cover used to keep off rain.'], dry: ['adjective', 'Not wet.'], sunny: ['adjective', 'Bright with sunlight.'], helmet: ['noun', 'A hard protective hat.'], soaked: ['adjective', 'Completely wet.'],
  library: ['noun', 'A place where books can be borrowed and read.'], canteen: ['noun', 'A school eating area where meals are sold.'], playground: ['noun', 'An outdoor area for children to play.'], corridor: ['noun', 'A passage linking rooms in a building.'], clinic: ['noun', 'A place for medical treatment.'], workshop: ['noun', 'A learning session with practical activities.'],
  cheerful: ['adjective', 'Happy and lively.'], gloomy: ['adjective', 'Dark, sad, or lacking hope.'], polite: ['adjective', 'Showing good manners.'], rude: ['adjective', 'Impolite or disrespectful.'], brief: ['adjective', 'Short in time or length.'], lengthy: ['adjective', 'Long in time or length.'],
  reusable: ['adjective', 'Able to be used again.'], rewrite: ['verb', 'To write again with changes.'], careless: ['adjective', 'Not careful and likely to make mistakes.'], preview: ['verb', 'To look at something before the full version.'], unhappy: ['adjective', 'Not happy.'], teacher: ['noun', 'A person who teaches pupils.'],
  make: ['verb', 'To create or produce.'], pay: ['verb', 'To give money, attention, or respect.'], heavy: ['adjective', 'Having a lot of weight or intensity.'], rain: ['noun', 'Water that falls from clouds.'], decision: ['noun', 'A choice made after thinking.'], attention: ['noun', 'Careful focus.'],
  careful: ['adjective', 'Taking care to avoid mistakes.'], carefully: ['adverb', 'In a careful manner.'], success: ['noun', 'A good result after effort.'], successful: ['adjective', 'Having achieved a goal.'], swift: ['adjective', 'Very fast.'], swiftly: ['adverb', 'Quickly.'],
  determined: ['adjective', 'Firm in purpose and not giving up.'], calm: ['adjective', 'Peaceful and not upset.'], confused: ['adjective', 'Unable to understand clearly.'], focused: ['adjective', 'Giving full attention.'], distracted: ['adjective', 'Unable to focus because attention is pulled away.'], patient: ['adjective', 'Able to wait without getting angry.'],
  'break the ice': ['phrase', 'To start a friendly conversation in an awkward situation.'], 'hit the books': ['phrase', 'To study seriously.'], 'piece of cake': ['phrase', 'Something very easy to do.'], 'on cloud nine': ['phrase', 'Very happy.'], 'spill the beans': ['phrase', 'To reveal a secret.'], 'under the weather': ['phrase', 'Feeling unwell.'],
  practice: ['noun', 'Repeated training to improve.'], perfect: ['adjective', 'As good as possible.'], honesty: ['noun', 'Truthfulness.'], trust: ['noun', 'Belief that someone is reliable.'], effort: ['noun', 'Energy spent doing something.'], reward: ['noun', 'Something gained after effort.'],
  microscope: ['noun', 'A tool that enlarges tiny objects.'], data: ['noun', 'Facts collected for analysis.'], digital: ['adjective', 'Using computer or electronic technology.'], energy: ['noun', 'Power used for work or movement.'], circuit: ['noun', 'A closed path for electric current.'], sensor: ['noun', 'A device that detects change.'],
  citizen: ['noun', 'A member of a country with rights and duties.'], election: ['noun', 'A vote to choose leaders.'], community: ['noun', 'People living or working together in one area.'], policy: ['noun', 'An official rule or plan.'], volunteer: ['noun', 'A person who helps without payment.'], heritage: ['noun', 'Traditions and history passed down over time.'],
  in: ['preposition', 'Inside a place.'], on: ['preposition', 'Touching a surface.'], at: ['preposition', 'In a specific place or time.'], under: ['preposition', 'Below something.'], beside: ['preposition', 'Next to.'], between: ['preposition', 'In the middle of two things.'],
  a: ['article', 'Used before a singular noun with a consonant sound.'], an: ['article', 'Used before a singular noun with a vowel sound.'], the: ['article', 'Used for a specific known noun.'], some: ['determiner', 'An unspecified amount or number.'], many: ['determiner', 'A large number of countable items.'], much: ['determiner', 'A large amount of uncountable substance.'],
  reads: ['verb', 'Looks at and understands written words.'], read: ['verb', 'To look at and understand words.'], are: ['verb', 'Be-form used with plural subjects.'], is: ['verb', 'Be-form used with singular subjects.'], has: ['verb', 'Owns or holds, used with singular subjects.'], have: ['verb', 'Own or hold, used with plural subjects and I/you.'],
};

const CATEGORY_BANK = {
  contextInference: { answers: ['muddy', 'umbrella', 'dry'], distractors: ['sunny', 'helmet', 'soaked'] },
  definitionMatch: { answers: ['library', 'canteen', 'playground'], distractors: ['corridor', 'clinic', 'workshop'] },
  synonymContrast: { answers: ['cheerful', 'rude', 'brief'], distractors: ['gloomy', 'polite', 'lengthy'] },
  morphologicalAffix: { answers: ['reusable', 'rewrite', 'careless'], distractors: ['preview', 'unhappy', 'teacher'] },
  collocationCloze: { answers: ['make', 'heavy', 'attention'], distractors: ['pay', 'rain', 'decision'] },
  grammaticalRole: { answers: ['careful', 'carefully', 'success'], distractors: ['successful', 'swift', 'swiftly'] },
  connectorClue: { answers: ['determined', 'focused', 'patient'], distractors: ['calm', 'confused', 'distracted'] },
  idiomaticExpressions: { answers: ['break the ice', 'piece of cake', 'under the weather'], distractors: ['hit the books', 'on cloud nine', 'spill the beans'] },
  proverbsSayings: { answers: ['practice', 'trust', 'reward'], distractors: ['perfect', 'honesty', 'effort'] },
  scienceTechTerms: { answers: ['microscope', 'data', 'sensor'], distractors: ['digital', 'energy', 'circuit'] },
  socialStudiesVocab: { answers: ['citizen', 'community', 'election'], distractors: ['policy', 'volunteer', 'heritage'] },
  grammarPrepositions: { answers: ['in', 'between', 'under'], distractors: ['on', 'at', 'beside'] },
  grammarArticles: { answers: ['an', 'a', 'the'], distractors: ['some', 'many', 'much'] },
  grammarSVA: { answers: ['reads', 'are', 'has'], distractors: ['read', 'is', 'have'] },
};

const CONTEXTS = {
  p1: ['recess', 'reading corner', 'morning assembly', 'class duty', 'playground break', 'library period'],
  p2: ['science lesson', 'school garden', 'PE period', 'music rehearsal', 'lunch queue', 'bus ride home'],
  p3: ['group project', 'oral practice', 'museum trip', 'CCA training', 'community visit', 'art workshop'],
  p4: ['inquiry task', 'service-learning day', 'debate practice', 'camp briefing', 'lab activity', 'journal writing'],
  p5: ['exam revision', 'leadership camp', 'heritage project', 'STEM challenge', 'presentation prep', 'peer coaching'],
  p6: ['PSLE revision', 'research forum', 'class leadership meeting', 'science consultation', 'community proposal', 'study clinic'],
};

const TITLE_SEEDS = {
  contextInference: ['Rainy Corridor', 'After-School Dash', 'Unexpected Shower', 'Shelter First'],
  definitionMatch: ['Places in School', 'Campus Map Clues', 'Where We Go', 'School Spaces'],
  synonymContrast: ['Tone and Manners', 'Word Opposites', 'Feeling and Behaviour', 'Choosing the Right Shade'],
  morphologicalAffix: ['Word Parts at Work', 'Prefix and Suffix Clues', 'Build the Word', 'Affix Detective'],
  collocationCloze: ['Natural Word Partners', 'Phrases That Fit', 'Everyday Collocations', 'Best Pairing'],
  grammaticalRole: ['Form in Context', 'Noun or Adverb?', 'Word Form Choice', 'Role in the Sentence'],
  connectorClue: ['Signal Word Meaning', 'Because and Although', 'Reason and Contrast Clues', 'Connector Evidence'],
  idiomaticExpressions: ['Figurative Meaning', 'Idiom in Context', 'What It Really Means', 'School Idioms'],
  proverbsSayings: ['Wisdom in Action', 'Meaning Behind the Saying', 'Proverb Context', 'Advice from Elders'],
  scienceTechTerms: ['Lab and Tech Vocabulary', 'Science in School', 'Data and Devices', 'Investigation Terms'],
  socialStudiesVocab: ['Community Matters', 'Active Citizenship', 'People and Policies', 'Heritage and Leadership'],
  grammarPrepositions: ['Location Clues', 'Where Things Are', 'Position in School', 'Place and Space'],
  grammarArticles: ['Article Choice', 'Specific or General?', 'Noun Starters', 'Choosing a/an/the'],
  grammarSVA: ['Subject and Verb Match', 'Agreement in Action', 'Singular or Plural?', 'Correct Verb Form'],
};

function makeDefinition(word) {
  const key = String(word || '').toLowerCase();
  if (!LEXICON[key]) throw new Error(`[vocabPassagesExtra] Missing lexicon definition for word: "${word}"`);
  return LEXICON[key][1];
}

function makePos(word) {
  const key = String(word || '').toLowerCase();
  if (!LEXICON[key]) throw new Error(`[vocabPassagesExtra] Missing lexicon part-of-speech for word: "${word}"`);
  return LEXICON[key][0];
}

function pick(level, idx, arr) {
  return arr[(idx + LEVELS.indexOf(level)) % arr.length];
}

function makeText(category, level, idx) {
  const context = pick(level, idx, CONTEXTS[level]);
  const variants = {
    0: `During ${context}, the path outside was ___. Mei opened her ___ before crossing the courtyard. She stayed under the walkway so her worksheet remained ___.`,
    1: `In ${context}, pupils borrow books in the ___. They buy snacks in the ___. They play tag at the ___.`,
    2: `After good news in ${context}, Jia looked ___. The boy who cut the queue was ___. The teacher gave a ___ reminder before dismissal.`,
  };

  if (category === 'definitionMatch') return variants[1];
  if (category === 'synonymContrast') return variants[2];
  if (category === 'contextInference') return variants[0];

  const perCategory = {
    morphologicalAffix: [
      `For ${context}, we used a ___ bottle to reduce waste. I had to ___ my paragraph after feedback. The teacher said ___ work causes avoidable mistakes.`,
      `At ${context}, Tim chose a ___ container instead of a disposable one. He decided to ___ his opening sentence. Rushing made his notes look ___.`,
      `Before ${context}, the class packed a ___ lunch box. I will ___ my report tonight. The coach warned that ___ actions can be unsafe.`,
    ],
    collocationCloze: [
      `Before ${context}, our group must ___ a decision together. During monsoon season, ___ rain can flood the drain. In class, always pay ___ to instructions.`,
      `In ${context}, we had to ___ a choice quickly. The weather report predicted ___ rain all afternoon. Everyone must pay ___ to safety signs.`,
      `At ${context}, leaders asked us to ___ a decision as a team. The clouds brought ___ rain by noon. We paid ___ when the siren sounded.`,
    ],
    grammaticalRole: [
      `A ___ plan helped us finish ${context} on time. The pupils measured ___ before cutting the card. Their final model was a clear ___.`,
      `Our class made a ___ checklist for ${context}. The monitor read each step ___. The event was a ___.`,
      `With a ___ strategy, the team prepared for ${context}. They checked each label ___. The project ended in ___.`,
    ],
    connectorClue: [
      `Although the task in ${context} was hard, Zara stayed ___. Because the hall was noisy, she remained ___ on her notes. Since the printer was slow, everyone stayed ___.`,
      `Although ${context} was stressful, Amir stayed ___. Because his friends were chatting, he became ___ on revision cards. Since the queue moved slowly, the class remained ___.`,
      `Although the schedule for ${context} changed, Lin stayed ___. Because announcements were loud, she stayed ___ on key points. Since help came late, the group became ___.`,
    ],
    idiomaticExpressions: [
      `At the start of ${context}, the leader told a joke to ___. The warm-up quiz felt like a ___. Ken skipped training because he felt ___.`,
      `During ${context}, our buddy game helped us ___. The first worksheet was a ___. I stayed home because I was ___.`,
      `In ${context}, the emcee asked everyone to ___ with a short game. The simple puzzle was a ___. Siti sat out because she was ___.`,
    ],
    proverbsSayings: [
      `Before ${context}, our coach reminded us that ___ makes perfect. She said honesty builds ___. She also said steady effort brings ___.`,
      `During ${context}, Grandpa said ___ makes perfect when I complained. He added that honesty earns ___. In the end, hard work brings ___.`,
      `In ${context}, the teacher repeated that ___ makes perfect. She explained that truth builds ___. She promised patient work brings ___.`,
    ],
    scienceTechTerms: [
      `In ${context}, we used a ___ to observe tiny cells. We recorded each reading as ___. The robot stopped when its ___ detected movement.`,
      `During ${context}, the team used a ___ to view the sample. We entered the results as ___. A door ___ triggered the alarm.`,
      `At ${context}, pupils looked through a ___ to inspect mould. They logged the numbers as ___. A light ___ switched on automatically.`,
    ],
    socialStudiesVocab: [
      `A responsible ___ follows rules during ${context}. Our ___ cleaned the park together. Next term, pupils will vote in an ___ for class leaders.`,
      `During ${context}, each ___ was asked to help neighbours. The ___ planned a recycling drive. The school held an ___ to choose captains.`,
      `In ${context}, every ___ has duties and rights. Our ___ discussed safety rules. We held an ___ for student council roles.`,
    ],
    grammarPrepositions: [
      `The markers for ${context} are kept ___ the top drawer. The map hangs ___ the noticeboard and the clock. During drill, pupils waited ___ the shelter.`,
      `For ${context}, the forms are filed ___ the blue tray. The nurse stood ___ the cabinet and the sink. The shoes were placed ___ the bench.`,
      `After ${context}, we stacked books ___ the shelf. The flag is ___ two tall trees. Bags stayed ___ the table.`,
    ],
    grammarArticles: [
      `Mira packed ___ umbrella for ${context}. She borrowed ___ marker from her partner. At the gate, she thanked ___ guard who helped her.`,
      `Before ${context}, Dan bought ___ apple. He used ___ notebook for reminders. He returned ___ file that the teacher requested.`,
      `During ${context}, Ava carried ___ orange folder. She drew ___ poster for her class. She greeted ___ principal near the hall.`,
    ],
    grammarSVA: [
      `Every afternoon before ${context}, my sister ___ storybooks. The science notes ___ on the middle shelf. Each pupil ___ a role in the group task.`,
      `During ${context}, our monitor ___ aloud. The worksheets ___ on the front table. The class leader ___ a checklist.`,
      `After ${context}, Sam ___ quietly in the corner. The rule cards ___ beside the sink. Every child ___ homework in a folder.`,
    ],
  };

  return pick(level, idx, perCategory[category]);
}

function buildLearningAids(text, category, answers) {
  const segments = text.split('___');
  const aidMap = {
    contextInference: {
      hint: 'Use setting and cause clues around the blank to infer meaning.',
      prompt: 'Which nearby setting detail (weather/place/action) points to the correct word?',
      clueType: 'setting-cause-clue',
      explanation: 'The surrounding setting details narrow the meaning to one suitable word.',
    },
    definitionMatch: {
      hint: 'Match each blank to the sentence definition of that place or concept.',
      prompt: 'Which sentence phrase defines what this place/word is used for?',
      clueType: 'definition-in-context',
      explanation: 'The sentence itself gives a child-friendly definition that matches one option.',
    },
    synonymContrast: {
      hint: 'Look for tone clues that signal similar or opposite meaning.',
      prompt: 'Which phrase signals a positive/negative contrast that guides the word choice?',
      clueType: 'synonym-contrast-clue',
      explanation: 'Contrast and tone clues show whether the answer should be close in meaning or opposite.',
    },
    morphologicalAffix: {
      hint: 'Use prefix/suffix clues to decide the correct word form and meaning.',
      prompt: 'Which part of the sentence hints at a prefix/suffix meaning (re-, -less, etc.)?',
      clueType: 'affix-word-formation',
      explanation: 'Word-part clues in context indicate the correct derived form.',
    },
    collocationCloze: {
      hint: 'Pick the word that naturally pairs with nearby words (collocation).',
      prompt: 'Which neighbouring words form a natural collocation with the answer?',
      clueType: 'collocation-clue',
      explanation: 'Only one option forms a natural word partnership in this context.',
    },
    grammaticalRole: {
      hint: 'Check the sentence frame for noun/adjective/adverb form.',
      prompt: 'Which surrounding words show the needed grammatical role here?',
      clueType: 'word-form-role',
      explanation: 'The sentence structure reveals the required part of speech.',
    },
    connectorClue: {
      hint: 'Use connector logic (although/because/since) to infer meaning.',
      prompt: 'Which connector relationship (contrast/reason/result) gives the clue?',
      clueType: 'connector-logic-clue',
      explanation: 'The connector sets a logic relationship that points to the best vocabulary choice.',
    },
    idiomaticExpressions: {
      hint: 'Use whole-situation clues to infer figurative meaning.',
      prompt: 'Which event in the sentence reveals the idiom’s intended meaning?',
      clueType: 'idiom-context-clue',
      explanation: 'The scenario context, not literal words, signals the idiom meaning.',
    },
    proverbsSayings: {
      hint: 'Infer the proverb meaning from actions and outcomes in the scenario.',
      prompt: 'Which outcome in the situation reflects the proverb’s lesson?',
      clueType: 'proverb-lesson-clue',
      explanation: 'The situation demonstrates the proverb’s message and supports one answer.',
    },
    scienceTechTerms: {
      hint: 'Use experiment/device clues to infer the science or tech term.',
      prompt: 'Which experiment or device detail in the sentence identifies the term?',
      clueType: 'science-tech-context',
      explanation: 'Lab and device evidence in the sentence identifies the precise technical word.',
    },
    socialStudiesVocab: {
      hint: 'Use citizenship/community clues to infer the social studies word.',
      prompt: 'Which civic action or leadership detail gives the strongest clue?',
      clueType: 'civic-context-clue',
      explanation: 'Community and citizenship details point to the correct social studies vocabulary.',
    },
    grammarPrepositions: {
      hint: 'Use location/position clues to choose the preposition.',
      prompt: 'Which place relationship in the sentence guides the preposition choice?',
      clueType: 'preposition-location-clue',
      explanation: 'Relative position words in the sentence indicate the correct preposition.',
    },
    grammarArticles: {
      hint: 'Use noun sound and specificity clues for article choice.',
      prompt: 'Which noun sound or specificity clue decides a/an/the here?',
      clueType: 'article-sound-specificity',
      explanation: 'Vowel/consonant sound and specific reference clues determine the right article.',
    },
    grammarSVA: {
      hint: 'Use subject number clues to choose the correct verb form.',
      prompt: 'Which subject in this clause controls subject-verb agreement?',
      clueType: 'subject-verb-agreement-clue',
      explanation: 'The subject’s number/person determines the matching verb form.',
    },
  };
  const aid = aidMap[category] || aidMap.contextInference;

  return answers.map((_, i) => {
    const left = (segments[i] || '').trim().split(/\s+/).slice(-5).join(' ').replace(/[.,;:!?]+$/g, '').trim();
    const right = (segments[i + 1] || '').trim().split(/\s+/).slice(0, 5).join(' ').replace(/[.,;:!?]+$/g, '').trim();
    const span = right || left || 'sentence context';
    return {
      hint: `Blank ${i + 1}: ${aid.hint}`,
      clue: {
        blankIndex: i,
        prompt: aid.prompt,
        acceptableSpans: [span],
        partialSpans: span.split(/\s+/).slice(0, 2),
        clueType: aid.clueType,
        explanation: `${aid.explanation} The phrase "${span}" is the key textual evidence.`,
      },
    };
  });
}

function buildPassage(category, level, idx) {
  const core = CATEGORY_BANK[category];
  const text = makeText(category, level, idx);
  const wordBank = [...core.answers, ...core.distractors];
  const learning = buildLearningAids(text, category, core.answers);
  const definitions = Object.fromEntries(wordBank.map((w) => [w, makeDefinition(w)]));
  const partOfSpeechMap = Object.fromEntries(wordBank.map((w) => [w, makePos(w)]));
  const short = CATEGORY_SHORT[category];
  const levelNum = level.replace('p', '');
  const titleSeed = pick(level, idx, TITLE_SEEDS[category]);

  return {
    id: `vxp-${short}-p${levelNum}-${String(idx + 1).padStart(2, '0')}`,
    title: `${titleSeed} (${level.toUpperCase()})`,
    text,
    answers: [...core.answers],
    wordBank,
    hints: learning.map((l) => l.hint),
    clues: learning.map((l) => l.clue),
    definitions,
    partOfSpeechMap,
    xp: Number(levelNum) <= 2 ? 20 : Number(levelNum) <= 4 ? 30 : 40,
  };
}

export function buildExtraPassageBank(levels = []) {
  const out = {};
  for (const category of Object.keys(VOCAB_CATEGORIES)) {
    // Skip categories that don't have a generator bank (e.g. P1-only MCQ-only
    // categories such as collectiveNouns, soundVerbs, placeNouns).  These
    // categories are exercised through Vocabulary MCQ but don't have cloze
    // passages, so we omit them from the auto-generated extras.
    if (!CATEGORY_BANK[category]) continue;
    out[category] = {};
    for (const level of levels) {
      out[category][level] = Array.from({ length: 12 }, (_, i) => buildPassage(category, level, i));
    }
  }
  return out;
}
