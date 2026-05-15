/**
 * PhonicsQuest – Vocabulary MCQ Item Bank
 *
 * Item generation follows the vocabulary category spine and keeps
 * contextual stems for upper-primary practice.
 */

export const VOCAB_MCQ_LEVELS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

const LEVEL_CATEGORY_PLAN = {
  P1: [
    'contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue',
    'bodyPartsAnimals', 'collectiveNouns', 'placeNouns', 'actionVerbs', 'soundVerbs', 'emotionAdjectives', 'verbDistinction',
  ],
  P2: [
    'contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'wordParts',
    'actionVerbs', 'soundVerbs', 'collectiveNouns', 'emotionAdjectives', 'similes', 'mannerAdverbs',
  ],
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
  bodyPartsAnimals(level, i) {
    const rows = [
      ['The bird dipped its ___ into the pond to drink water.', 'beak', ['wing', 'claws', 'feathers']],
      ['The farmer brushed the horse’s ___ with a comb.', 'mane', ['fur', 'fleece', 'wool']],
      ['The cat scratched the door with its sharp ___.', 'claws', ['paws', 'wings', 'beak']],
      ['The fish moved its ___ to swim through the water.', 'fins', ['paws', 'legs', 'feathers']],
      ['The elephant lifted the log with its long ___.', 'trunk', ['horn', 'tail', 'paw']],
      ['The peacock spread its colourful ___ to show off.', 'feathers', ['scales', 'fur', 'fins']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'bodyPartsAnimals', subskill: 'animal_part_name', q, choices: buildChoices(answer, ds), answer, explain: 'Different animals have different body parts. Match the part to the animal.' };
  },
  collectiveNouns(level, i) {
    const rows = [
      ['We saw a ___ of elephants in the jungle.', 'herd', ['flock', 'school', 'pack']],
      ['A ___ of monkeys stole food from the shops.', 'troop', ['pack', 'army', 'flock']],
      ['A ___ of birds flew across the sky at sunset.', 'flock', ['herd', 'pack', 'school']],
      ['To while away time, we played with a ___ of cards.', 'pack', ['box', 'pile', 'heap']],
      ['My aunt Jemima always wears a ___ of pearls round her neck.', 'string', ['group', 'line', 'bunch']],
      ['Bill finished a whole ___ of ice-cream on his own.', 'tub', ['carton', 'container', 'box']],
      ['A ___ of fish swam past the diver.', 'school', ['flock', 'herd', 'pack']],
      ['Mrs Lee bought a ___ of milk from the supermarket.', 'carton', ['bowl', 'tub', 'tray']],
      ['A ___ of wolves howled in the forest at night.', 'pack', ['flock', 'herd', 'troop']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'collectiveNouns', subskill: 'collective_noun', q, choices: buildChoices(answer, ds), answer, explain: 'Each group of animals, threaded objects or container uses its own special collective word.' };
  },
  placeNouns(level, i) {
    const rows = [
      ['Mrs Lee bought a loaf of bread and some buns from the ___.', 'bakery', ['kitchen', 'canteen', 'restaurant']],
      ['I was feeling ill, so I visited a ___ to see a doctor.', 'clinic', ['shop', 'hospital', 'sickbay']],
      ['It is hot and dry in the ___ where few plants can survive.', 'desert', ['forest', 'jungle', 'reservoir']],
      ['Everyone rushed towards the ___ of the building to escape from the fire.', 'exit', ['entrance', 'lobby', 'corridor']],
      ['We borrowed storybooks from the school ___.', 'library', ['canteen', 'office', 'hall']],
      ['Mum stopped at the ___ to fill petrol in the car.', 'petrol station', ['bus stop', 'taxi stand', 'workshop']],
      ['We watched a movie at the ___ last weekend.', 'cinema', ['theatre', 'studio', 'gallery']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'placeNouns', subskill: 'place_name', q, choices: buildChoices(answer, ds), answer, explain: 'Each place has a special name that tells us what people do there.' };
  },
  actionVerbs(level, i) {
    const rows = [
      ['Our pet dog ___ its tail excitedly when it sees us.', 'wags', ['flaps', 'waves', 'shakes']],
      ['Gail ___ the dirty table with a cloth.', 'wiped', ['rubbed', 'mopped', 'brushed']],
      ['No one saw the burglar ___ into the house when night fell.', 'sneaking', ['crawling', 'strolling', 'marching']],
      ['"Look at that caterpillar ___ on the branch!" Joe said.', 'crawling', ['sliding', 'trotting', 'travelling']],
      ['Betsy let out a scream when the snake ___ towards her.', 'slithered', ['slid', 'crept', 'glided']],
      ['Little Sophie went missing as she had ___ off on her own.', 'wandered', ['marched', 'strolled', 'travelled']],
      ['The vase ___ when it hit the floor.', 'shattered', ['exploded', 'burst', 'crashed']],
      ['The chef ___ the eggs in a bowl before pouring them into the pan.', 'whisked', ['poured', 'sliced', 'fried']],
      ['Anna ___ a cup of hot tea slowly so as not to burn her tongue.', 'sipped', ['gulped', 'chewed', 'spilled']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'actionVerbs', subskill: 'action_verb', q, choices: buildChoices(answer, ds), answer, explain: 'Each action has a precise verb — pick the one that matches the movement, speed and surface.' };
  },
  soundVerbs(level, i) {
    const rows = [
      ['Every morning, I can hear birds ___ outside my window.', 'chirping', ['humming', 'cheeping', 'screeching']],
      ['I heard an owl ___ in the woods just now.', 'screech', ['chirp', 'howl', 'crow']],
      ['People believe that wolves like to ___ at the moon.', 'howl', ['bark', 'roar', 'growl']],
      ['The crow flew in and began to ___ loudly.', 'caw', ['chirp', 'squawk', 'screech']],
      ['Gabriel let out a ___ when he saw his huge pile of homework.', 'sigh', ['roar', 'hum', 'squeal']],
      ['The lion ___ loudly, frightening the visitors at the zoo.', 'roared', ['barked', 'meowed', 'squeaked']],
      ['Bees were ___ near the flowers in our garden.', 'buzzing', ['barking', 'roaring', 'crowing']],
      ['The puppy ___ when it heard the doorbell ring.', 'barked', ['mewed', 'roared', 'hooted']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'soundVerbs', subskill: 'animal_sound', q, choices: buildChoices(answer, ds), answer, explain: 'Each animal — and some human sounds (sigh) — has its own specific verb.' };
  },
  emotionAdjectives(level, i) {
    const rows = [
      ['Alison was ___ with her gift. She loved it very much.', 'delighted', ['upset', 'excited', 'surprised']],
      ['I was ___ by the size of Jane’s home. It looks like a palace!', 'amazed', ['frightened', 'delighted', 'angry']],
      ['Whenever Steve does not have enough sleep, he will be in a ___ mood.', 'grumpy', ['jolly', 'lazy', 'miserable']],
      ['Most children feel ___ visiting the dentist. It is an unpleasant experience.', 'nervous', ['excited', 'annoyed', 'discouraged']],
      ['As I had no one to play with and talk to all day, I felt ___.', 'miserable', ['nasty', 'disappointed', 'discouraged']],
      ['Everyone was ___ by the passenger’s strange behaviour. They did not know why.', 'puzzled', ['curious', 'amazed', 'dazed']],
      ['He seems to be ___, so do not believe every word he says.', 'sly', ['honest', 'truthful', 'mischievous']],
      ['Tom felt ___ when he won first prize in the spelling bee.', 'proud', ['angry', 'sleepy', 'bored']],
      ['The children were ___ to ride the new roller coaster.', 'excited', ['bored', 'tired', 'upset']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'emotionAdjectives', subskill: 'feeling_word', q, choices: buildChoices(answer, ds), answer, explain: 'Use the feeling word that matches the situation and the strength of the emotion.' };
  },
  similes(level, i) {
    const rows = [
      ['Dennis is as proud as a ___. He always thinks he is better than other people.', 'peacock', ['fox', 'eel', 'lion']],
      ['Little Liyana is as quiet as a ___ when she reads in the library.', 'mouse', ['lion', 'parrot', 'monkey']],
      ['After running the race, John was as fast as a ___.', 'cheetah', ['turtle', 'snail', 'whale']],
      ['Grandma said the porridge was as smooth as ___.', 'silk', ['sand', 'rock', 'glass']],
      ['Our prefect, Aliya, is as brave as a ___ when she stops bullies in school.', 'lion', ['mouse', 'rabbit', 'parrot']],
      ['Daniel was as busy as a ___ during the school carnival.', 'bee', ['bear', 'sloth', 'cat']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'similes', subskill: 'fixed_comparison', q, choices: buildChoices(answer, ds), answer, explain: 'Similes are fixed comparisons — you cannot swap the noun for another animal.' };
  },
  mannerAdverbs(level, i) {
    const rows = [
      ['It was so difficult to wake Ian as he was sleeping so ___.', 'soundly', ['drowsily', 'noisily', 'calmly']],
      ['The pupils sat ___ during the silent reading lesson.', 'quietly', ['loudly', 'lazily', 'roughly']],
      ['The dog growled ___ when the stranger walked past the gate.', 'fiercely', ['kindly', 'lazily', 'softly']],
      ['The old man walked ___ down the road, leaning on his stick.', 'slowly', ['hastily', 'rapidly', 'briskly']],
      ['She thanked the volunteer ___ for helping her cross the road.', 'politely', ['rudely', 'angrily', 'wildly']],
      ['The boys clapped ___ when their team scored the winning goal.', 'wildly', ['quietly', 'gently', 'softly']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'mannerAdverbs', subskill: 'adverb_manner', q, choices: buildChoices(answer, ds), answer, explain: 'An adverb of manner describes HOW an action is done — match the adverb to the mood and intensity of the scene.' };
  },
  verbDistinction(level, i) {
    const rows = [
      ['May I ___ a colour pencil from you?', 'borrow', ['get', 'lend', 'use']],
      ['I ___ my grandmother a birthday card. She received it in her mailbox today.', 'sent', ['fetched', 'took', 'picked']],
      ['Please ___ me your eraser; I will return it after class.', 'lend', ['borrow', 'give', 'pass']],
      ['Father will ___ me from school at three o’clock today.', 'fetch', ['send', 'borrow', 'leave']],
      ['Sara ___ her brother to the park on her bicycle.', 'took', ['brought', 'fetched', 'sent']],
      ['Could you ___ the salt over here, please?', 'pass', ['lend', 'borrow', 'send']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'verbDistinction', subskill: 'verb_pair_choice', q, choices: buildChoices(answer, ds), answer, explain: 'These verbs look similar but mean different things — pay attention to who is doing what to whom.' };
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
