/**
 * PhonicsQuest – Grammar MCQ Item Bank
 *
 * Data is generated from level/category blueprints so we can maintain
 * broad category coverage and consistent schema quality at scale.
 */

export const GRAMMAR_MCQ_LEVELS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

const LEVEL_CATEGORY_PLAN = {
  P1: ['articles', 'pronouns', 'demonstratives', 'whQuestions', 'svAgreement', 'simplePast', 'presentCont', 'prepositions', 'possessives', 'quantifiers'],
  P2: ['articles', 'pronouns', 'svAgreement', 'simplePast', 'presentCont', 'prepositions', 'connectors', 'countableUncountable', 'futureTense'],
  P3: ['articles', 'pronouns', 'svAgreement', 'simplePast', 'presentCont', 'prepositions', 'connectors', 'conjunctions', 'comparatives', 'modals'],
  P4: ['svAgreement', 'presentPerfect', 'pastCont', 'futureTense', 'prepositions', 'connectors', 'quantifiers', 'adjAdverbs', 'auxiliaries', 'conjunctions'],
  P5: ['svAgreement', 'tenseAwareness', 'presentPerfect', 'pastPerfect', 'perfectContinuousTenses', 'conditionals', 'passiveVoice', 'relativeClauses', 'reportedSpeech', 'modals', 'quantifiers', 'mixedGrammar'],
  P6: ['tenseAwareness', 'pastPerfect', 'perfectContinuousTenses', 'conditionals', 'passiveVoice', 'relativeClauses', 'reportedSpeech', 'modals', 'inversion', 'auxiliaries', 'connectors', 'mixedGrammar'],
};

const SUBJECTS = ['The pupil', 'My brother', 'Our teacher', 'The class monitor', 'The twins', 'The players', 'Her cousin', 'The science team'];
const PLACES = ['in the canteen', 'at the void deck', 'near the school gate', 'in the library', 'at East Coast Park', 'beside the hall', 'on the field', 'at the community club'];
const CONTEXT_TAILS = [
  'during English lesson',
  'before assembly',
  'after recess',
  'during CCA training',
  'at the book fair',
  'during Mother Tongue class',
  'while preparing for the concert',
  'during camp briefing',
  'before the spelling quiz',
  'after the science activity',
  'during oral practice',
  'before dismissal',
];
const LEVEL_TAILS = {
  P1: ['before story time', 'during phonics practice', 'after snack break'],
  P2: ['before spelling practice', 'during reading lesson', 'after group work'],
  P3: ['during project discussion', 'before oral practice', 'after science activity'],
  P4: ['during class debate', 'before journal writing', 'after team rehearsal'],
  P5: ['during revision class', 'before presentation practice', 'after consultation'],
  P6: ['during exam preparation', 'before timed practice', 'after reflection session'],
};

function rotate(arr, idx) {
  return arr[idx % arr.length];
}

function buildChoices(answer, distractors) {
  const choices = [answer, ...distractors.slice(0, 3)];
  return [...new Set(choices)].slice(0, 4);
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

const GRAMMAR_BUILDERS = {
  articles(level, i) {
    const nouns = [
      ['apple', 'an'], ['uniform', 'a'], ['hour', 'an'], ['museum', 'a'], ['umbrella', 'an'], ['homework file', 'a'],
    ];
    const [noun, article] = rotate(nouns, i);
    return {
      subskill: 'article_choice',
      q: `${rotate(SUBJECTS, i)} packed ___ ${noun} before assembly.`,
      choices: buildChoices(article, article === 'an' ? ['a', 'the', 'some'] : ['an', 'the', 'some']),
      answer: article,
      explain: `Use "${article}" for this noun sound in context.`,
    };
  },
  pronouns(level, i) {
    const p1Rows = [
      ['Tom is my friend. ___ likes to play football with me.', 'He', ['She', 'It', 'They']],
      ['Sara and I went to the park. ___ played on the swings.', 'We', ['I', 'They', 'She']],
      ['Look at the bird in the cage. ___ is so colourful!', 'It', ['He', 'She', 'They']],
      ['The boys forgot their bags. The teacher reminded ___.', 'them', ['they', 'their', 'theirs']],
      ['Don’t eat the bread. ___ has turned mouldy.', 'It', ['He', 'She', 'They']],
    ];
    const upperRows = [
      ['The girls were late, so ___ apologised to the teacher.', 'they', ['them', 'their', 'theirs']],
      ['Mr Tan called Ali and me, so he spoke to ___.', 'us', ['we', 'our', 'ours']],
      ['That sketchbook belongs to Mei. It is ___.', 'hers', ['her', 'she', 'herself']],
      ['Please pass the worksheet to Dan and ___.', 'me', ['I', 'my', 'mine']],
    ];
    const rows = level === 'P1' ? p1Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'pronoun_form', q, choices: buildChoices(answer, ds), answer, explain: 'Choose the pronoun form that fits the sentence role.' };
  },
  demonstratives(level, i) {
    const rows = [
      ['I like this toy. I do not like ___ one over there.', 'that', ['this', 'these', 'those']],
      ['"___ is my pencil," said Mimi as she held it in her hand.', 'This', ['That', 'These', 'Those']],
      ['Look at ___ apples on the table in front of us. They are red and shiny.', 'these', ['this', 'that', 'those']],
      ['Can you see ___ birds flying high in the sky?', 'those', ['this', 'that', 'these']],
      ['"Pass me ___ book on your desk, please," asked the teacher.', 'that', ['this', 'these', 'those']],
      ['"___ shoes here are mine. The ones over there are yours."', 'These', ['That', 'Those', 'This']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'demonstrative_choice',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'Use "this/these" for things near, "that/those" for things far. Use the singular form for one and the plural form for many.',
    };
  },
  whQuestions(level, i) {
    const rows = [
      ['"___ did you perform this magic trick? Please show me," Fred asked.', 'How', ['When', 'What', 'Where']],
      ['"___ are you today? I hope you are feeling much better," my teacher said to me.', 'How', ['Why', 'What', 'Which']],
      ['"___ is your birthday party? I want to know the date," Sara asked.', 'When', ['Where', 'How', 'Who']],
      ['"___ do you keep your school bag at home?" asked Mum.', 'Where', ['When', 'How', 'Why']],
      ['"___ are you wearing a raincoat? It is not raining," Tom asked.', 'Why', ['How', 'When', 'Where']],
      ['"___ is the largest animal in the world?" the teacher asked the class.', 'Which', ['How', 'When', 'Whose']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'wh_question_word',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'Wh- words ask about time (when), place (where), reason (why), manner (how), choice (which).',
    };
  },
  svAgreement(level, i) {
    const rows = [
      ['The captain of the team ___ early every day.', 'arrives', ['arrive', 'arrived', 'arriving']],
      ['My cousins ___ badminton after school.', 'play', ['plays', 'played', 'is playing']],
      ['There ___ two packets of rice on the shelf.', 'are', ['is', 'was', 'has']],
      ['Neither the coach nor the players ___ careless today.', 'are', ['is', 'was', 'be']],
      ['Each student ___ a name tag for the camp.', 'has', ['have', 'had', 'having']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'agreement', q, choices: buildChoices(answer, ds), answer, explain: 'Match the verb with the true subject.' };
  },
  simplePast(level, i) {
    const p1Rows = [
      ['Yesterday, I ___ to the library to borrow books.', 'went', ['go', 'gone', 'goes']],
      ['Yesterday, Jean ___ her bicycle to the park.', 'rode', ['ride', 'rides', 'riding']],
      ['Last weekend, Mum ___ a chocolate cake for my birthday.', 'baked', ['bake', 'bakes', 'baking']],
      ['As a young boy, Grandfather ___ in this river.', 'swam', ['swim', 'swims', 'swum']],
      ['Last night, Dad ___ us a bedtime story.', 'told', ['tell', 'tells', 'telling']],
      ['Yesterday, we ___ pizza at the food court.', 'ate', ['eat', 'eats', 'eating']],
    ];
    const upperRows = [
      ['Yesterday, we ___ the art display before lunch.', 'visited', ['visit', 'visits', 'visiting']],
      ['Last Friday, she ___ her wallet at home.', 'left', ['leave', 'leaves', 'leaving']],
      ['Two days ago, they ___ the heavy box upstairs.', 'carried', ['carry', 'carries', 'carrying']],
      ['Last night, Father ___ us a story about courage.', 'told', ['tell', 'tells', 'telling']],
    ];
    const rows = level === 'P1' ? p1Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'past_tense_form', q, choices: buildChoices(answer, ds), answer, explain: 'Past time markers require a past-tense verb.' };
  },
  presentCont(level, i) {
    const rows = [
      ['Look! The children ___ across the hall.', 'are running', ['run', 'ran', 'is running']],
      ['Right now, my mother ___ dinner for everyone.', 'is cooking', ['cooks', 'cooked', 'are cooking']],
      ['At the moment, I ___ my spelling corrections.', 'am checking', ['check', 'checked', 'is checking']],
      ['Listen! The choir ___ the final chorus.', 'is singing', ['sing', 'sang', 'are singing']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'present_continuous', q, choices: buildChoices(answer, ds), answer, explain: 'Use present continuous for actions happening now.' };
  },
  prepositions(level, i) {
    const p1Rows = [
      ['Gavin fell asleep ___ the sofa.', 'on', ['in', 'into', 'onto']],
      ['The ball rolled away and fell ___ a drain.', 'into', ['to', 'on', 'over']],
      ['Holly has to attend a lesson ___ 8 o’clock in the morning.', 'at', ['in', 'on', 'by']],
      ['It was very hot, so we sat ___ the shade where it was cooler.', 'in', ['on', 'with', 'below']],
      ['My bag is ___ the table next to my books.', 'on', ['in', 'under', 'between']],
      ['The cat is hiding ___ the chair. I cannot see it.', 'under', ['above', 'across', 'behind']],
    ];
    const upperRows = [
      ['Please place the attendance file ___ the principal’s desk.', 'on', ['in', 'under', 'between']],
      ['We reached school ___ 7.20 a.m. today.', 'at', ['on', 'in', 'by']],
      ['The football rolled ___ the bench.', 'under', ['above', 'across', 'toward']],
      ['They walked ___ the bridge to the science centre.', 'across', ['behind', 'inside', 'with']],
    ];
    const rows = level === 'P1' ? p1Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'preposition_use', q, choices: buildChoices(answer, ds), answer, explain: 'Choose the preposition that best shows time, place or movement.' };
  },
  possessives(level, i) {
    const rows = [
      ['This is not my bottle. It is ___.', 'hers', ['her', 'she', 'herself']],
      ['The boys forgot ___ PE shirts in class.', 'their', ['there', 'they', 'theirs']],
      ['That laptop belongs to my parents. It is ___.', 'theirs', ['their', 'them', 'they']],
      ['I borrowed ___ ruler because mine was missing.', 'his', ['he', 'him', 'himself']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'possessive_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Use the possessive word that shows ownership clearly.' };
  },
  quantifiers(level, i) {
    const p1Rows = [
      ['I looked into the refrigerator. There wasn’t ___ juice left.', 'any', ['a few', 'many', 'a little']],
      ['There is no ___ soup left after Dan finished the whole pot.', 'more', ['any', 'much', 'many']],
      ['After a tiring day, Mother had ___ rest when she came home.', 'some', ['any', 'little', 'few']],
      ['There wasn’t ___ juice left. I only had half a glass of it.', 'much', ['some', 'little', 'few']],
      ['I bought ___ apples at the market for our breakfast.', 'some', ['any', 'much', 'a little']],
      ['How ___ pencils do you have in your pencil case?', 'many', ['much', 'a little', 'less']],
    ];
    const upperRows = [
      ['There are ___ marbles in this small pouch.', 'few', ['little', 'much', 'less']],
      ['How ___ sugar should we add to this drink?', 'much', ['many', 'few', 'several']],
      ['Only ___ pupils were absent during rehearsal.', 'a few', ['a little', 'much', 'less']],
      ['We have ___ water left, so refill the bottle.', 'little', ['few', 'many', 'several']],
    ];
    const rows = level === 'P1' ? p1Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'quantifier_choice', q, choices: buildChoices(answer, ds), answer, explain: 'Use quantifiers based on whether the noun is countable or uncountable.' };
  },
  connectors(level, i) {
    const rows = [
      ['The sky darkened, ___ we packed our raincoats.', 'so', ['but', 'or', 'because']],
      ['She was tired, ___ she still completed her corrections.', 'but', ['and', 'so', 'because']],
      ['Pack your bottle ___ your worksheet before camp.', 'and', ['but', 'or', 'because']],
      ['He revised carefully ___ he wanted to improve.', 'because', ['but', 'so', 'or']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'connector_logic', q, choices: buildChoices(answer, ds), answer, explain: 'Choose the connector that matches the relationship between ideas.' };
  },
  countableUncountable(level, i) {
    const rows = [
      ['There is ___ rice left in the cooker.', 'some', ['many', 'few', 'an']],
      ['How ___ oranges did Grandma buy?', 'many', ['much', 'little', 'less']],
      ['Please add ___ flour to the bowl.', 'a little', ['a few', 'many', 'several']],
      ['We need ___ chairs for the visitors.', 'a few', ['a little', 'much', 'less']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'countability', q, choices: buildChoices(answer, ds), answer, explain: 'Match the quantifier to countable or uncountable nouns.' };
  },
  futureTense(level, i) {
    const rows = [
      ['Tomorrow, our class ___ the heritage gallery.', 'will visit', ['visit', 'visited', 'is visiting']],
      ['I think it ___ later in the afternoon.', 'will rain', ['rains', 'rained', 'is raining']],
      ['The coach says we ___ extra drills next week.', 'will have', ['have', 'had', 'are having']],
      ['Do not worry. I ___ you after CCA.', 'will call', ['call', 'called', 'am calling']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'future_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Use future forms for plans, promises or predictions.' };
  },
  conjunctions(level, i) {
    const rows = [
      ['Would you prefer noodles ___ rice for lunch?', 'or', ['and', 'but', 'because']],
      ['He stayed quiet ___ he was unsure of the answer.', 'because', ['or', 'but', 'so']],
      ['Take your umbrella, ___ the clouds look heavy.', 'for', ['yet', 'or', 'and']],
      ['She practised daily, ___ she improved steadily.', 'so', ['or', 'because', 'but']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'conjunction_function', q, choices: buildChoices(answer, ds), answer, explain: 'Pick the conjunction that links the clauses correctly.' };
  },
  comparatives(level, i) {
    const rows = [
      ['This puzzle is ___ than yesterday’s puzzle.', 'harder', ['hard', 'hardest', 'more hard']],
      ['The new route is ___ than the old one.', 'shorter', ['short', 'shortest', 'more short']],
      ['A cheetah is ___ than a rabbit.', 'faster', ['fast', 'fastest', 'more fast']],
      ['Today is ___ than Monday.', 'hotter', ['hot', 'hottest', 'more hot']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'comparative_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Use a comparative form when comparing two things.' };
  },
  modals(level, i) {
    const rows = [
      ['You ___ submit the form by Friday.', 'must', ['might', 'could', 'would']],
      ['May I borrow your marker? Yes, you ___.', 'may', ['must', 'should', 'would']],
      ['If you feel unwell, you ___ see the school nurse.', 'should', ['might', 'would', 'can’t']],
      ['The sign says we ___ run in the corridor.', 'must not', ['should', 'might', 'could']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'modal_meaning', q, choices: buildChoices(answer, ds), answer, explain: 'Choose the modal that expresses the intended rule or advice.' };
  },
  presentPerfect(level, i) {
    const rows = [
      ['She ___ her assignment already.', 'has completed', ['completed', 'had completed', 'is completing']],
      ['We ___ this museum before.', 'have visited', ['visited', 'had visited', 'are visiting']],
      ['The boys ___ their shoes, so they are ready.', 'have polished', ['polished', 'had polished', 'are polishing']],
      ['He ___ his wallet, so he cannot pay now.', 'has lost', ['lost', 'had lost', 'is losing']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'present_perfect', q, choices: buildChoices(answer, ds), answer, explain: 'Present perfect links a past action to the present result.' };
  },
  pastCont(level, i) {
    const rows = [
      ['At 8 p.m., we ___ for the oral exam.', 'were revising', ['revised', 'have revised', 'are revising']],
      ['While I was washing dishes, my brother ___ the floor.', 'was mopping', ['mopped', 'has mopped', 'is mopping']],
      ['They ___ when the principal entered.', 'were talking', ['talked', 'have talked', 'are talking']],
      ['At that moment, the class ___ a video.', 'was watching', ['watched', 'has watched', 'is watching']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'past_continuous', q, choices: buildChoices(answer, ds), answer, explain: 'Past continuous describes an action in progress at a past time.' };
  },
  adjAdverbs(level, i) {
    const rows = [
      ['The speaker explained the rule ___.', 'clearly', ['clear', 'clearest', 'more clear']],
      ['After the race, the runners looked ___.', 'tired', ['tiredly', 'more tiredly', 'tiring']],
      ['Please answer the question ___.', 'politely', ['polite', 'politer', 'politeness']],
      ['The soup tastes ___.', 'delicious', ['deliciously', 'more deliciously', 'deliciousness']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'adjective_adverb_choice', q, choices: buildChoices(answer, ds), answer, explain: 'Use adjectives after linking verbs and adverbs to describe actions.' };
  },
  auxiliaries(level, i) {
    const rows = [
      ['___ you finished your corrections yet?', 'Have', ['Do', 'Did', 'Are']],
      ['Why ___ the players so quiet today?', 'are', ['is', 'was', 'has']],
      ['___ she submit the file yesterday?', 'Did', ['Does', 'Do', 'Has']],
      ['How many chapters ___ you read so far?', 'have', ['has', 'had', 'are']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'aux_question_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Question forms need the correct auxiliary verb.' };
  },
  tenseAwareness(level, i) {
    const rows = [
      ['By the time we reached the hall, the programme ___.', 'had started', ['has started', 'was starting', 'starts']],
      ['She practises daily, so she usually ___ well.', 'performs', ['performed', 'is performing', 'has performed']],
      ['We ___ for twenty minutes before the rain stopped.', 'had been waiting', ['have waited', 'are waiting', 'waited']],
      ['Next month, they ___ the same project for a year.', 'will have done', ['have done', 'did', 'do']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'tense_selection', q, choices: buildChoices(answer, ds), answer, explain: 'Choose the tense that best matches the time relationship.' };
  },
  pastPerfect(level, i) {
    const rows = [
      ['The train had left before we ___ the station.', 'reached', ['reach', 'have reached', 'are reaching']],
      ['She ___ her notes before the quiz began.', 'had revised', ['has revised', 'revised', 'was revising']],
      ['By 6 p.m., they ___ all the banners.', 'had hung', ['have hung', 'hung', 'were hanging']],
      ['He was hungry because he ___ breakfast.', 'had skipped', ['has skipped', 'skipped', 'is skipping']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'past_perfect_sequence', q, choices: buildChoices(answer, ds), answer, explain: 'Past perfect shows the earlier past action.' };
  },
  perfectContinuousTenses(level, i) {
    const rows = [
      ['By noon, we ___ for two hours.', 'had been practising', ['have practised', 'practised', 'are practising']],
      ['She looks tired because she ___ non-stop since dawn.', 'has been working', ['worked', 'had worked', 'was working']],
      ['They ___ in this neighbourhood for ten years.', 'have been living', ['lived', 'had lived', 'are living']],
      ['By next week, he ___ at this task for a month.', 'will have been working', ['has worked', 'worked', 'is working']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'perfect_continuous', q, choices: buildChoices(answer, ds), answer, explain: 'Perfect continuous tenses emphasise duration of an action.' };
  },
  conditionals(level, i) {
    const rows = [
      ['If you heat ice, it ___ into water.', 'melts', ['melted', 'will melt', 'has melted']],
      ['If it rains this afternoon, we ___ indoors.', 'will stay', ['stayed', 'stay', 'have stayed']],
      ['If she had left earlier, she ___ the bus.', 'would have caught', ['catches', 'will catch', 'has caught']],
      ['If I were class chairperson, I ___ clearer notices.', 'would write', ['write', 'wrote', 'will write']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'if_clauses', q, choices: buildChoices(answer, ds), answer, explain: 'Match the if-clause type with the correct result verb form.' };
  },
  passiveVoice(level, i) {
    const rows = [
      ['The science models ___ by the P5 pupils.', 'were built', ['built', 'are building', 'have built']],
      ['The report ___ by the committee tomorrow.', 'will be reviewed', ['reviews', 'reviewed', 'has reviewed']],
      ['The hall ___ before the event started.', 'had been cleaned', ['cleaned', 'was cleaning', 'has cleaned']],
      ['The safety rules ___ to all new students.', 'are explained', ['explain', 'explained', 'have explained']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'passive_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Passive voice focuses on the action or receiver, not the doer.' };
  },
  relativeClauses(level, i) {
    const rows = [
      ['The teacher ___ guided us is retiring this year.', 'who', ['which', 'whose', 'whom']],
      ['This is the book ___ cover was torn.', 'whose', ['who', 'which', 'whom']],
      ['The park ___ we visited has a new playground.', 'that', ['who', 'whose', 'whom']],
      ['The scientist to ___ we wrote replied kindly.', 'whom', ['who', 'which', 'whose']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'relative_pronouns', q, choices: buildChoices(answer, ds), answer, explain: 'Use the relative pronoun that fits the noun and clause function.' };
  },
  reportedSpeech(level, i) {
    const rows = [
      ['Mum said that she ___ home late that evening.', 'would be', ['is', 'was', 'has been']],
      ['The coach told us that we ___ to bring water bottles.', 'had to', ['have to', 'must', 'are having to']],
      ['Alicia said that she ___ the worksheet already.', 'had finished', ['has finished', 'finished', 'is finishing']],
      ['He asked whether I ___ the notice.', 'had read', ['have read', 'read', 'am reading']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'speech_reporting', q, choices: buildChoices(answer, ds), answer, explain: 'Reported speech usually shifts tense and pronouns.' };
  },
  inversion(level, i) {
    const rows = [
      ['Rarely ___ such a neat project display.', 'have we seen', ['we have seen', 'we saw', 'had we see']],
      ['Not only ___ the plan clear, but it was practical too.', 'was', ['is', 'were', 'has']],
      ['Hardly ___ when the bell rang.', 'had we sat down', ['we had sat down', 'we sit down', 'have we sat down']],
      ['Only after checking the data ___ the error.', 'did she notice', ['she noticed', 'has she noticed', 'she notices']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'inversion_patterns', q, choices: buildChoices(answer, ds), answer, explain: 'Certain fronted phrases trigger inversion in formal structures.' };
  },
  mixedGrammar(level, i) {
    const rows = [
      ['Neither the prefect nor the players ___ responsible for the delay.', 'were', ['was', 'is', 'has']],
      ['By next June, she ___ this school for six years.', 'will have attended', ['has attended', 'attended', 'attends']],
      ['The worksheet, ___ was printed yesterday, is already outdated.', 'which', ['who', 'whom', 'whose']],
      ['If they had checked the map earlier, they ___ lost.', 'would not have got', ['do not get', 'will not get', 'have not got']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'exam_mix', q, choices: buildChoices(answer, ds), answer, explain: 'Use all sentence clues to choose the most accurate grammar form.' };
  },
};

function buildLevel(level) {
  const categories = LEVEL_CATEGORY_PLAN[level];
  const targetCount = 150;
  const items = [];
  const categoryCursor = Object.fromEntries(categories.map(c => [c, 0]));

  for (let i = 0; i < targetCount; i += 1) {
    const category = categories[i % categories.length];
    const localIndex = categoryCursor[category];
    categoryCursor[category] += 1;
    const spec = GRAMMAR_BUILDERS[category](level, localIndex);
    const id = `g-${level.toLowerCase()}-${String(i + 1).padStart(3, '0')}`;
    items.push({
      id,
      level,
      category,
      subskill: spec.subskill,
      difficulty: difficultyFor(level, i),
      q: decorateStem(spec.q, level, i + localIndex * 3),
      choices: spec.choices,
      answer: spec.answer,
      explain: spec.explain,
    });
  }

  return items;
}

export const GRAMMAR_MCQ_ITEMS = Object.fromEntries(
  GRAMMAR_MCQ_LEVELS.map(level => [level, buildLevel(level)]),
);
