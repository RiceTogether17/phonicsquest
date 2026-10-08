/**
 * PhonicsQuest – Vocabulary MCQ Item Bank
 *
 * Item generation follows the vocabulary category spine and keeps
 * contextual stems for upper-primary practice.
 */

import { inferQuestionContextType } from './mcqItemMetadata.js';
import { deriveMcqDifficulty, mcqSeedKey } from './mcqItemFeatures.js';
import { makeFallbackOptionExplanations } from './mcqOptionExplanations.js';
import { makeVocabTeachingExplanations } from './vocabGlosses.js';
import { MIN_QUESTIONS_PER_SCOPE, contextualizeMcqQuestion, varyMcqNames } from './practiceExpansion.js';
import { VOCAB_CATEGORIES } from './vocabCategories.js';

export const VOCAB_MCQ_LEVELS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

const LEVEL_CATEGORY_PLAN = {
  P1: [
    'contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue',
    'bodyPartsAnimals', 'collectiveNouns', 'placeNouns', 'actionVerbs', 'soundVerbs', 'emotionAdjectives', 'verbDistinction',
    'movementVerbs', 'wordParts', 'similes', 'mannerAdverbs', 'scienceTechTerms', 'socialStudiesVocab', 'proverbsSayings',
    'idiomaticExpressions', 'phrasalVerbs',
  ],
  P2: [
    'contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'wordParts',
    'actionVerbs', 'soundVerbs', 'collectiveNouns', 'emotionAdjectives', 'similes', 'mannerAdverbs',
    'connectorClue', 'placeNouns', 'bodyPartsAnimals', 'verbDistinction', 'movementVerbs', 'scienceTechTerms', 'socialStudiesVocab',
    'proverbsSayings', 'idiomaticExpressions', 'phrasalVerbs',
  ],
  P3: [
    'contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue',
    'wordParts', 'scienceTechTerms', 'phrasalVerbs', 'similes', 'mannerAdverbs', 'actionVerbs',
    'collectiveNouns', 'placeNouns', 'bodyPartsAnimals', 'soundVerbs', 'emotionAdjectives', 'verbDistinction',
    'movementVerbs', 'socialStudiesVocab', 'idiomaticExpressions', 'proverbsSayings',
  ],
  P4: [
    'contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue',
    'wordParts', 'socialStudiesVocab',
    'actionVerbs', 'soundVerbs', 'emotionAdjectives', 'similes', 'mannerAdverbs', 'phrasalVerbs',
    'collectiveNouns', 'placeNouns', 'bodyPartsAnimals', 'verbDistinction', 'movementVerbs', 'scienceTechTerms',
    'idiomaticExpressions', 'proverbsSayings',
  ],
  P5: [
    'contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue',
    'wordParts', 'idiomaticExpressions', 'proverbsSayings', 'scienceTechTerms',
    'socialStudiesVocab', 'actionVerbs', 'soundVerbs', 'emotionAdjectives', 'similes', 'mannerAdverbs',
    'phrasalVerbs', 'collectiveNouns', 'placeNouns', 'bodyPartsAnimals', 'verbDistinction', 'movementVerbs',
   
  ],
  P6: [
    'contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole', 'connectorClue',
    'wordParts', 'idiomaticExpressions', 'proverbsSayings', 'socialStudiesVocab',
    'scienceTechTerms', 'actionVerbs', 'soundVerbs', 'emotionAdjectives', 'similes', 'mannerAdverbs',
    'phrasalVerbs', 'collectiveNouns', 'placeNouns', 'bodyPartsAnimals', 'verbDistinction', 'movementVerbs',
   
  ],
};

function rotate(arr, idx) {
  return arr[idx % arr.length];
}

/**
 * Pick the seed pool for a level's band.
 *
 * Several categories used to serve one pool to P1 through P6, which made the
 * same item simultaneously too hard for a six-year-old and trivial for a
 * P6 pupil. Each banded category now authors three pools along the spiral:
 * lower (P1–P2), middle (P3–P4) and upper (P5–P6).
 */
function bandRows(level, { lower, middle, upper }) {
  if (level === 'P1' || level === 'P2') return lower;
  if (level === 'P3' || level === 'P4') return middle;
  return upper;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildChoices(answer, distractors) {
  return shuffle([answer, ...distractors].slice(0, 4));
}

const VOCAB_BUILDERS = {
  contextInference(level, i) {
    const p1p2Rows = [
      ['After running three rounds in the sun, Amir felt very ___.', 'tired', ['cheerful', 'spotless', 'plastic']],
      ['The classroom was so ___ that everyone could hear a pin drop.', 'quiet', ['crowded', 'muddy', 'rapid']],
      ['Because the floor was wet, we walked ___.', 'carefully', ['lazily', 'noisily', 'luckily']],
      ['The soup smelled fresh and tasted very ___.', 'delicious', ['terrible', 'sour', 'stale']],
      ['The baby smiled because she was very ___.', 'happy', ['sleepy', 'angry', 'cold']],
      ['The dog ran to the door because it was ___ to see its owner.', 'excited', ['bored', 'sad', 'tired']],
      ['It was raining so we stayed ___ to keep dry.', 'indoors', ['outside', 'upstairs', 'away']],
      ['She put on a thick coat because it was ___ outside.', 'cold', ['sunny', 'warm', 'bright']],
      ['The boy cried because he ___ his favourite toy.', 'lost', ['found', 'cleaned', 'shared']],
      ['The children laughed because the clown was very ___.', 'funny', ['scary', 'quiet', 'angry']],
      ['The cake was so delicious that everyone asked for ___ slice.', 'another', ['a smaller', 'no more', 'a last']],
      ['Tom put on his shoes because he was going ___.', 'outside', ['to sleep', 'to bed', 'indoors']],
      ['The lights went out because there was a power ___.', 'failure', ['station', 'switch', 'cable']],
      ['She finished all three worksheets in twenty minutes because she was ___.', 'efficient', ['clumsy', 'noisy', 'absent']],
      ['The shopkeeper smiled and nodded — he was clearly ___.', 'pleased', ['confused', 'upset', 'afraid']],
      ['After the long journey, everyone was too ___ to eat.', 'exhausted', ['curious', 'cheerful', 'talkative']],
    ];
    const upperRows = [
      ['The scientist repeated the experiment three times to ___ her results.', 'verify', ['contradict', 'estimate', 'ignore']],
      ['The politician\'s speech was deliberately vague to ___ taking a clear stand.', 'avoid', ['demand', 'welcome', 'highlight']],
      ['Despite her initial reluctance, she ___ accepted the award graciously.', 'eventually', ['hastily', 'reluctantly', 'angrily']],
      ['The rare manuscript was kept in a controlled environment to ___ its condition.', 'preserve', ['duplicate', 'advertise', 'dissolve']],
      ['His tone was calm yet his words were ___, leaving no room for compromise.', 'firm', ['hesitant', 'confused', 'cheerful']],
      ['The report was so detailed that it left ___ for misinterpretation.', 'little room', ['extra time', 'clear gaps', 'broad scope']],
      ['After weeks of drought, the farmers were ___ for rain.', 'desperate', ['grateful', 'indifferent', 'responsible']],
      ['The project was completed ahead of schedule, which was a testament to the team\'s ___.', 'efficiency', ['creativity', 'conflict', 'ambition']],
      ['She spoke with such ___ that the audience was moved to tears.', 'conviction', ['confusion', 'boredom', 'hesitation']],
      ['The sudden announcement ___ the carefully laid plans.', 'disrupted', ['reinforced', 'expanded', 'supported']],
      ['The policy was revised to better ___ the needs of rural communities.', 'address', ['ignore', 'suppress', 'delay']],
      ['His ___ approach to learning helped him master new skills quickly.', 'disciplined', ['reckless', 'passive', 'erratic']],
      ['The new regulation was met with ___ from business owners who feared higher costs.', 'resistance', ['approval', 'celebration', 'indifference']],
      ['The athlete\'s ___ performance in the final round secured the championship.', 'flawless', ['mediocre', 'inconsistent', 'reckless']],
      ['The community came together to ___ the flood victims with food and shelter.', 'assist', ['abandon', 'criticise', 'monitor']],
      ['Her explanation was so clear that even the most ___ student understood the concept.', 'confused', ['advanced', 'attentive', 'curious']],
    ];
    const p1p2RowsEx = [
      { 'tired': '"tired" fits — running three rounds in the sun drains energy.', 'cheerful': '"cheerful" means happy, not a result of hard exercise.', 'spotless': '"spotless" means very clean — unrelated to how Amir feels.', 'plastic': '"plastic" is a material, not a feeling.' },
      { 'quiet': '"quiet" fits — if you can hear a pin drop, the room must be silent.', 'crowded': '"crowded" means full of people — the opposite of pin-drop silence.', 'muddy': '"muddy" describes a wet floor, not a sound level.', 'rapid': '"rapid" means fast — it describes speed, not quietness.' },
      { 'carefully': '"carefully" fits — a wet floor is slippery, so you walk with caution.', 'lazily': '"lazily" means slowly without effort — not the right response to a wet floor.', 'noisily': '"noisily" describes sound, not how you walk safely.', 'luckily': '"luckily" describes good fortune, not a manner of walking.' },
      { 'delicious': '"delicious" fits — "fresh" smell and good taste go together.', 'terrible': '"terrible" contradicts the clue that the soup smelled fresh.', 'sour': '"sour" describes spoilt food — the soup smelled fresh.', 'stale': '"stale" means old and no longer fresh — the opposite of the clue.' },
      { 'happy': '"happy" fits — a smile is a sign of happiness.', 'sleepy': '"sleepy" would cause drooping eyelids, not a smile.', 'angry': '"angry" would cause a frown, not a smile.', 'cold': '"cold" describes temperature, not an emotion.' },
      { 'excited': '"excited" fits — dogs become excited when they see their owners.', 'bored': '"bored" would make a dog uninterested, not run to the door.', 'sad': '"sad" would make a dog stay still, not run eagerly.', 'tired': '"tired" would make a dog rest, not run to the door.' },
      { 'indoors': '"indoors" fits — staying inside keeps you dry when it rains.', 'outside': '"outside" contradicts "to keep dry" in the rain.', 'upstairs': '"upstairs" is a direction inside a building but the clue is about staying dry, not going up.', 'away': '"away" is vague and does not explain how they stayed dry.' },
      { 'cold': '"cold" fits — you wear a thick coat when the weather is cold.', 'sunny': '"sunny" is warm — you would not need a thick coat.', 'warm': '"warm" contradicts the need for a thick coat.', 'bright': '"bright" describes light, not temperature.' },
      { 'lost': '"lost" fits — crying because you cannot find your favourite toy is natural.', 'found': '"found" would cause happiness, not tears.', 'cleaned': '"cleaned" is a caring action — it would not make the boy cry.', 'shared': '"shared" is a positive action — unlikely to cause crying.' },
      { 'funny': '"funny" fits — laughter is always a response to something funny.', 'scary': '"scary" would cause fear, not laughter.', 'quiet': '"quiet" describes sound level, not something that makes you laugh.', 'angry': '"angry" describes a negative emotion — it would cause upset, not laughter.' },
      { 'another': '"another" fits — enjoying a delicious cake makes you want one more slice.', 'a smaller': '"a smaller" suggests wanting less — the opposite if the cake is enjoyed.', 'no more': '"no more" means refusing — contradicts "so delicious that everyone asked for".', 'a last': '"a last" implies reluctance, not enjoyment.' },
      { 'outside': '"outside" fits — you put on shoes when you are going out.', 'to sleep': '"to sleep" is incorrect — you remove shoes before sleeping.', 'to bed': '"to bed" is incorrect — you remove shoes before going to bed.', 'indoors': '"indoors" contradicts putting shoes on — shoes are for going out.' },
      { 'failure': '"failure" fits — a power failure explains why the lights went out.', 'station': '"station" is a location — it does not explain why the lights went out.', 'switch': '"switch" controls lights but a switch alone does not explain a sudden outage.', 'cable': '"cable" is part of the system but a broken cable is a type of failure, not the event itself.' },
      { 'efficient': '"efficient" fits — finishing three worksheets in twenty minutes shows efficient work.', 'clumsy': '"clumsy" means accident-prone — this would slow someone down.', 'noisy': '"noisy" describes sound — unrelated to finishing quickly.', 'absent': '"absent" means not present — if absent, the worksheets could not be done.' },
      { 'pleased': '"pleased" fits — smiling and nodding are signs of satisfaction.', 'confused': '"confused" would show a puzzled face, not a smile.', 'upset': '"upset" would show a frown or frown, not a nod.', 'afraid': '"afraid" would show fear — contradicts a friendly smile and nod.' },
      { 'exhausted': '"exhausted" fits — a long journey tires people out.', 'curious': '"curious" means wanting to know more — unrelated to a tiring journey.', 'cheerful': '"cheerful" is a happy state — unlikely after an exhausting journey.', 'talkative': '"talkative" means wanting to talk — too tired to eat suggests too tired to do anything.' },
    ];
    const upperRowsEx = [
      { 'verify': '"verify" fits — repeating an experiment confirms the results are reliable.', 'contradict': '"contradict" means to go against — the scientist would not repeat tests to disprove herself.', 'estimate': '"estimate" means to guess — repeating precisely is not the same as guessing.', 'ignore': '"ignore" is the opposite of carefully checking results.' },
      { 'avoid': '"avoid" fits — being "deliberately vague" means not taking a clear stand.', 'demand': '"demand" means to insist firmly — the opposite of being vague.', 'welcome': '"welcome" means to accept willingly — contradicts being deliberately vague.', 'highlight': '"highlight" means to draw attention to — the politician is hiding, not highlighting, a position.' },
      { 'eventually': '"eventually" fits — "despite initial reluctance" shows she came around after some time.', 'hastily': '"hastily" means quickly and without care — this contradicts "reluctance" which suggests slowness.', 'reluctantly': '"reluctantly" describes her initial feeling, not how she ended up accepting — the connector "despite" signals a change.', 'angrily': '"angrily" contradicts "graciously" at the end of the sentence.' },
      { 'preserve': '"preserve" fits — a controlled environment protects and maintains the manuscript\'s condition.', 'duplicate': '"duplicate" means to copy — this is not what a controlled environment does.', 'advertise': '"advertise" means to promote — a manuscript is kept private, not promoted.', 'dissolve': '"dissolve" means to break down — the opposite of preserving.' },
      { 'firm': '"firm" fits — a calm tone combined with decisive words describes someone who is controlled but resolute.', 'hesitant': '"hesitant" contradicts "no room for compromise" — hesitation implies uncertainty.', 'confused': '"confused" contradicts the clear, decisive meaning of "no room for compromise".', 'cheerful': '"cheerful" contradicts the serious tone of leaving no room for compromise.' },
      { 'little room': '"little room" fits — a detailed report leaves little space for misunderstanding.', 'extra time': '"extra time" does not relate to how much misinterpretation a report allows.', 'clear gaps': '"clear gaps" means obvious missing parts — the opposite of a detailed report.', 'broad scope': '"broad scope" means wide coverage — a broad scope increases, not decreases, misinterpretation.' },
      { 'desperate': '"desperate" fits — weeks of drought with no rain would make farmers feel urgently in need.', 'grateful': '"grateful" means thankful — they have not yet received rain so cannot be grateful.', 'indifferent': '"indifferent" means not caring — farmers would care deeply about rain.', 'responsible': '"responsible" would mean the farmers caused the rain — the drought makes them urgently in need of it.' },
      { 'efficiency': '"efficiency" fits — completing a project ahead of schedule demonstrates organised, effective work.', 'creativity': '"creativity" relates to original ideas — being ahead of schedule is about speed and organisation.', 'conflict': '"conflict" means disagreement — a successful early completion suggests the opposite.', 'ambition': '"ambition" means desire — the testament here is to ability, not just desire.' },
      { 'conviction': '"conviction" fits — moving an audience to tears requires speaking with deep belief.', 'confusion': '"confusion" would make an audience puzzled, not moved.', 'boredom': '"boredom" would cause the audience to lose interest, not be moved to tears.', 'hesitation': '"hesitation" suggests uncertainty — the opposite of powerful, moving speech.' },
      { 'disrupted': '"disrupted" fits — an unexpected announcement would upset carefully laid plans.', 'reinforced': '"reinforced" means strengthened — the opposite of upsetting plans.', 'expanded': '"expanded" means made larger — the plans were not expanded, they were upset.', 'supported': '"supported" means helped — contradicts the negative effect of a sudden announcement.' },
      { 'address': '"address" fits — revising a policy to meet community needs means the policy must respond to or deal with those needs.', 'ignore': '"ignore" is the opposite — a revision aims to respond, not to neglect.', 'suppress': '"suppress" means to hold down — the opposite of meeting needs.', 'delay': '"delay" means to postpone — revising a policy is action, not postponement.' },
      { 'disciplined': '"disciplined" fits — mastering new skills quickly suggests a structured, controlled approach.', 'reckless': '"reckless" means careless — this would lead to mistakes, not quick mastery.', 'passive': '"passive" means inactive — a passive learner would not master skills quickly.', 'erratic': '"erratic" means irregular — consistent skill-building requires the opposite.' },
      { 'resistance': '"resistance" fits — business owners who fear higher costs would oppose the regulation.', 'approval': '"approval" is the opposite — fear of costs leads to opposition, not support.', 'celebration': '"celebration" is the opposite — opposition is not a celebration.', 'indifference': '"indifference" means not caring — business owners with financial concerns would not be indifferent.' },
      { 'flawless': '"flawless" fits — securing a championship requires a perfect, error-free performance.', 'mediocre': '"mediocre" means average — an average performance would not secure a championship.', 'inconsistent': '"inconsistent" means uneven — inconsistency would lose, not win, a championship.', 'reckless': '"reckless" means careless — winning requires precision, not recklessness.' },
      { 'assist': '"assist" fits — coming together to provide food and shelter means helping the victims.', 'abandon': '"abandon" means to leave behind — the opposite of coming together to help.', 'criticise': '"criticise" means to find fault — unrelated to providing food and shelter.', 'monitor': '"monitor" means to watch — the community actively helped, not just observed.' },
      { 'confused': '"confused" fits — if even the most confused student understood, the explanation was clearly very clear.', 'advanced': '"advanced" would make the sentence complimentary but weak — "even the most advanced student" is not a strong test of clarity.', 'attentive': '"attentive" means paying close attention — these students would understand anyway.', 'curious': '"curious" means interested — curious students would likely understand with or without a clear explanation.' },
    ];
    const expl = (level === 'P1' || level === 'P2') ? p1p2RowsEx : upperRowsEx;
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : upperRows;
    const [q, answer, ds, optionExplanations] = [rotate(rows, i)[0], rotate(rows, i)[1], rotate(rows, i)[2], expl[i % expl.length]];
    return { category: 'contextInference', subskill: 'meaning_in_context', q, choices: buildChoices(answer, ds), answer, explain: 'Use clues in the sentence to infer meaning.', optionExplanations };
  },
  definitionMatch(level, i) {
    const p1p2Rows = [
      ['A person who treats sick animals is a ___.', 'veterinarian', ['librarian', 'tailor', 'cashier']],
      ['A place where we borrow storybooks is a ___.', 'library', ['bakery', 'stadium', 'factory']],
      ['A machine that shows moving pictures on a screen is a ___.', 'projector', ['stapler', 'compass', 'teapot']],
      ['A person who fixes taps and pipes is a ___.', 'plumber', ['mechanic', 'carpenter', 'painter']],
      ['A place where sick people go to get better is a ___.', 'hospital', ['hotel', 'school', 'factory']],
      ['A person who flies an aeroplane is a ___.', 'pilot', ['sailor', 'engineer', 'soldier']],
      ['Something you use to cut paper is a pair of ___.', 'scissors', ['pliers', 'tongs', 'tweezers']],
      ['A place where you can watch animals from many countries is a ___.', 'zoo', ['park', 'farm', 'museum']],
      ['A person who helps put out fires is a ___.', 'firefighter', ['policeman', 'sailor', 'doctor']],
      ['The seven colours you see in the sky after rain form a ___.', 'rainbow', ['sunset', 'hailstorm', 'tornado']],
      ['A small book you carry to write notes and appointments in is a ___.', 'diary', ['calendar', 'atlas', 'register']],
      ['A person who cooks food in a restaurant is a ___.', 'chef', ['waiter', 'baker', 'grocer']],
      ['A container used to boil water for making tea is a ___.', 'kettle', ['flask', 'jug', 'basin']],
      ['A place where bread and cakes are made and sold is a ___.', 'bakery', ['cafeteria', 'stall', 'pantry']],
      ['A person who teaches students is a ___.', 'teacher', ['prefect', 'counsellor', 'warden']],
      ['Something you wear on your wrist to tell the time is a ___.', 'watch', ['bracelet', 'bangle', 'compass']],
    ];
    const upperRows = [
      ['A long journey to explore a place is an ___.', 'expedition', ['equation', 'invitation', 'reflection']],
      ['A government system where citizens choose their leaders by voting is a ___.', 'democracy', ['monarchy', 'embassy', 'tribunal']],
      ['A person who studies and writes about history is a ___.', 'historian', ['journalist', 'archaeologist', 'diplomat']],
      ['The process by which green plants make food using sunlight is ___.', 'photosynthesis', ['respiration', 'germination', 'erosion']],
      ['An official booklet that shows who you are and which country you belong to when you travel abroad is a ___.', 'passport', ['permit', 'visa', 'certificate']],
      ['A person who is new to a job or skill and is still learning is an ___.', 'apprentice', ['expert', 'assistant', 'consultant']],
      ['The study of the stars and planets is called ___.', 'astronomy', ['astrology', 'geology', 'philosophy']],
      ['A piece of land entirely surrounded by water is an ___.', 'island', ['peninsula', 'isthmus', 'lagoon']],
      ['The practice of growing crops and raising animals for food is ___.', 'agriculture', ['horticulture', 'commerce', 'infrastructure']],
      ['A formal agreement between two or more countries is a ___.', 'treaty', ['legislation', 'referendum', 'charter']],
      ['The outer layer of the Earth on which we live is the ___.', 'crust', ['mantle', 'core', 'membrane']],
      ['A person who is against violence and believes in peaceful solutions is a ___.', 'pacifist', ['activist', 'nationalist', 'mediator']],
      ['The branch of government that makes laws is the ___.', 'legislature', ['judiciary', 'executive', 'bureaucracy']],
      ['A story passed down through generations that explains natural events is a ___.', 'myth', ['fable', 'legend', 'parable']],
      ['The point at which a substance changes from solid to liquid is its ___ point.', 'melting', ['boiling', 'freezing', 'tipping']],
      ['An organisation that helps people in need without seeking profit is a ___.', 'charity', ['corporation', 'agency', 'syndicate']],
    ];
    const p1p2Ex = [
      { 'veterinarian': 'A vet treats sick animals — the definition says "treats sick animals".', 'librarian': 'A librarian works with books, not animals.', 'tailor': 'A tailor makes clothes — unrelated to animals.', 'cashier': 'A cashier handles payments — not an animal doctor.' },
      { 'library': 'A library is where you borrow books — "borrow storybooks" is the key clue.', 'bakery': 'A bakery sells bread and cakes — not books.', 'stadium': 'A stadium is for sports — not for borrowing books.', 'factory': 'A factory makes goods — it does not lend books.' },
      { 'projector': 'A projector shows moving pictures on a screen — all three parts of the definition match.', 'stapler': 'A stapler joins paper together — it does not show pictures.', 'compass': 'A compass draws circles or shows direction — not pictures.', 'teapot': 'A teapot holds hot water for tea — not a machine for showing pictures.' },
      { 'plumber': 'A plumber fixes taps and pipes — both clues match.', 'mechanic': 'A mechanic fixes engines and cars — not taps and pipes.', 'carpenter': 'A carpenter works with wood — not water pipes.', 'painter': 'A painter applies paint — not taps and pipes.' },
      { 'hospital': 'A hospital is where sick people go to recover — "sick people … get better" matches exactly.', 'hotel': 'A hotel is for overnight stays, not for medical treatment.', 'school': 'A school is for learning — not a medical facility.', 'factory': 'A factory makes products — not a place for sick people.' },
      { 'pilot': 'A pilot flies an aeroplane — the definition says exactly that.', 'sailor': 'A sailor works on a ship at sea — not in an aeroplane.', 'engineer': 'An engineer designs or maintains systems — not the person who flies the plane.', 'soldier': 'A soldier serves in the military — not a pilot.' },
      { 'scissors': 'Scissors are used to cut paper — "cut paper" and "pair of" both match.', 'pliers': 'Pliers grip and bend metal — not used to cut paper.', 'tongs': 'Tongs pick up objects — not a cutting tool.', 'tweezers': 'Tweezers grip tiny objects — not used for cutting paper.' },
      { 'zoo': 'A zoo has animals from many countries — "watch animals from many countries" matches.', 'park': 'A park is an open green space — not specifically for animals from many countries.', 'farm': 'A farm has local farm animals — not animals from many countries.', 'museum': 'A museum displays objects and artefacts — not live animals.' },
      { 'firefighter': 'A firefighter puts out fires — "helps put out fires" matches exactly.', 'policeman': 'A policeman enforces the law — not primarily a fire-fighting role.', 'sailor': 'A sailor works on ships — unrelated to putting out fires.', 'doctor': 'A doctor treats illness — does not put out fires.' },
      { 'rainbow': 'A rainbow has seven colours and appears in the sky after rain — all clues match.', 'sunset': 'A sunset has colours but is not a ring of seven colours after rain.', 'hailstorm': 'A hailstorm is a weather event — not a colourful arc.', 'tornado': 'A tornado is a dangerous spinning wind — not a colourful arc after rain.' },
      { 'diary': 'A diary is a small personal book for notes and appointments — all parts of the definition match.', 'calendar': 'A calendar shows dates — it is not carried around for personal notes.', 'atlas': 'An atlas is a book of maps — not for personal notes.', 'register': 'A register records names — not a personal notebook.' },
      { 'chef': 'A chef cooks food in a restaurant — "cooks food in a restaurant" is the exact definition.', 'waiter': 'A waiter serves food — does not cook it.', 'baker': 'A baker bakes bread and pastries — not specifically in a restaurant.', 'grocer': 'A grocer sells food — does not cook it.' },
      { 'kettle': 'A kettle boils water for making tea — "boil water for making tea" matches exactly.', 'flask': 'A flask keeps drinks hot or cold — it does not boil water.', 'jug': 'A jug pours liquids — it cannot boil water.', 'basin': 'A basin holds water for washing — not for boiling.' },
      { 'bakery': 'A bakery is where bread and cakes are made and sold — all three clues match.', 'cafeteria': 'A cafeteria is a dining hall — not specifically for making bread and cakes.', 'stall': 'A stall sells items but does not make bread and cakes on site.', 'pantry': 'A pantry stores food — it is not a place where food is made and sold.' },
      { 'teacher': 'A teacher teaches students — the definition says exactly that.', 'prefect': 'A prefect is a student leader — does not teach.', 'counsellor': 'A counsellor provides guidance and support — not primarily a teacher.', 'warden': 'A warden supervises a building or prisoners — not a classroom teacher.' },
      { 'watch': 'A watch is worn on the wrist to tell the time — both clues match.', 'bracelet': 'A bracelet is a wrist decoration — it does not tell the time.', 'bangle': 'A bangle is a rigid wrist ornament — not a timepiece.', 'compass': 'A compass shows direction — it is not worn on the wrist to tell the time.' },
    ];
    const upperEx = [
      { 'expedition': 'An expedition is a long journey to explore — "long journey to explore" matches.', 'equation': 'An equation is a mathematical statement — not a journey.', 'invitation': 'An invitation is a request to attend an event — not a journey.', 'reflection': 'A reflection is a thought or image — not a journey of exploration.' },
      { 'democracy': 'In a democracy, citizens choose their leaders by voting — all parts match.', 'monarchy': 'A monarchy is ruled by a king or queen — not chosen by citizens voting.', 'embassy': 'An embassy is a diplomatic office in a foreign country — not a system of government.', 'tribunal': 'A tribunal is a court for special cases — not a voting system.' },
      { 'historian': 'A historian studies and writes about history — both parts of the definition match.', 'journalist': 'A journalist reports current news — not someone who studies history.', 'archaeologist': 'An archaeologist studies ancient objects — not primarily a writer of history.', 'diplomat': 'A diplomat manages relations between countries — not a history writer.' },
      { 'photosynthesis': 'Photosynthesis is the process by which green plants make food using sunlight — all parts match.', 'respiration': 'Respiration is the process of releasing energy from food — not making food from sunlight.', 'germination': 'Germination is when a seed begins to grow — not food production.', 'erosion': 'Erosion is the wearing away of rock or soil — unrelated to plants making food.' },
      { 'passport': 'A passport is the booklet that proves who you are and your nationality when you travel — every part of the definition matches.', 'permit': 'A permit allows a specific activity — not the standard international travel document.', 'visa': 'A visa is permission to enter one particular country, usually stamped into a passport — it does not show who you are.', 'certificate': 'A certificate proves an achievement — not a travel document.' },
      { 'apprentice': 'An apprentice is a beginner learning a trade — "new to a job … still learning" matches.', 'expert': 'An expert already knows a great deal — the opposite of someone still learning.', 'assistant': 'An assistant helps someone — not necessarily a beginner still learning.', 'consultant': 'A consultant is an expert adviser — the opposite of someone new to the job.' },
      { 'astronomy': 'Astronomy is the study of stars and planets — both clues match.', 'astrology': 'Astrology uses stars to predict fortunes — not a scientific study.', 'geology': 'Geology studies rocks and the Earth — not stars and planets.', 'philosophy': 'Philosophy studies ideas and existence — not stars and planets.' },
      { 'island': 'An island is land entirely surrounded by water — "entirely surrounded by water" matches.', 'peninsula': 'A peninsula is surrounded by water on three sides — not entirely surrounded.', 'isthmus': 'An isthmus is a narrow strip of land joining two larger areas — it is not surrounded by water.', 'lagoon': 'A lagoon is a stretch of shallow water — not a piece of land.' },
      { 'agriculture': 'Agriculture is growing crops and raising animals for food — all parts match.', 'horticulture': 'Horticulture focuses on garden plants — not raising animals.', 'commerce': 'Commerce is trade and business — not farming.', 'infrastructure': 'Infrastructure refers to roads and utilities — not farming.' },
      { 'treaty': 'A treaty is a formal agreement between countries — "formal agreement … countries" matches.', 'legislation': 'Legislation is law made by a government — not an agreement between countries.', 'referendum': 'A referendum is a public vote — not an agreement between countries.', 'charter': 'A charter is a formal document of rights — not specifically an agreement between nations.' },
      { 'crust': 'The crust is the outer layer of the Earth — "outer layer of the Earth" matches exactly.', 'mantle': 'The mantle is the layer beneath the crust — not the outer layer.', 'core': 'The core is the innermost part of the Earth — not the outer layer.', 'membrane': 'A membrane is a thin biological layer — not a layer of the Earth.' },
      { 'pacifist': 'A pacifist is against violence and believes in peaceful solutions — both clues match.', 'activist': 'An activist campaigns for change — not specifically against violence.', 'nationalist': 'A nationalist promotes national interests — not necessarily peaceful.', 'mediator': 'A mediator helps settle disputes — not specifically against violence.' },
      { 'legislature': 'The legislature is the branch of government that makes laws — matches exactly.', 'judiciary': 'The judiciary interprets and applies laws — it does not make them.', 'executive': 'The executive enforces laws — it does not make them.', 'bureaucracy': 'The bureaucracy is the administrative system — not the law-making body.' },
      { 'myth': 'A myth is a traditional story explaining natural events — "passed down … explains natural events" matches.', 'fable': 'A fable is a moral story featuring animals — not about natural events.', 'legend': 'A legend is a historical story about real or imagined heroes — not specifically about natural events.', 'parable': 'A parable is a short moral story — not a traditional explanation of natural events.' },
      { 'melting': 'The melting point is where a solid turns to liquid — "solid to liquid" matches exactly.', 'boiling': 'The boiling point is where a liquid turns to gas — not solid to liquid.', 'freezing': 'The freezing point is where liquid turns to solid — the opposite direction.', 'tipping': '"Tipping point" is a figurative expression — not a scientific term for a change of state.' },
      { 'charity': 'A charity helps people in need without seeking profit — both clues match.', 'corporation': 'A corporation seeks profit — the opposite of a charity.', 'agency': 'An agency provides services — not necessarily helping those in need.', 'syndicate': 'A syndicate is a group formed for business — not a non-profit organisation.' },
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : upperRows;
    const exRows = (level === 'P1' || level === 'P2') ? p1p2Ex : upperEx;
    const [q, answer, ds] = rotate(rows, i);
    const optionExplanations = exRows[i % exRows.length];
    return { category: 'definitionMatch', subskill: 'word_meaning', q, choices: buildChoices(answer, ds), answer, explain: 'Choose the word that matches the definition.', optionExplanations };
  },
  synonymContrast(level, i) {
    const p1p2Rows = [
      ['The child was joyful, which means she was ___.', 'happy', ['angry', 'silent', 'frozen']],
      ['Her tone was polite, not ___.', 'rude', ['formal', 'steady', 'honest']],
      ['The room was tiny — it means it was very ___.', 'small', ['bright', 'cold', 'loud']],
      ['He was very brave, which means he was not ___.', 'afraid', ['angry', 'lazy', 'hungry']],
      ['The box was heavy, which is the opposite of being ___.', 'light', ['short', 'old', 'narrow']],
      ['The kitten was gentle, not ___.', 'rough', ['soft', 'little', 'timid']],
      ['The hall was noisy, which is the opposite of ___.', 'quiet', ['dark', 'small', 'crowded']],
      ['She was absent from school, which means she was not ___.', 'present', ['well', 'alert', 'ready']],
      ['The water was freezing, which means it was extremely ___.', 'cold', ['warm', 'fresh', 'still']],
      ['The shop was closed, which is the opposite of being ___.', 'open', ['busy', 'large', 'bright']],
      ['The puppy was playful, which means it was very ___.', 'lively', ['quiet', 'serious', 'timid']],
      ['He was very generous, which means he was not ___.', 'selfish', ['kind', 'gentle', 'polite']],
      ['The path was narrow, which is the opposite of being ___.', 'wide', ['long', 'steep', 'rough']],
      ['She felt miserable, which means she was very ___.', 'unhappy', ['hungry', 'tired', 'confused']],
      ['The answer was incorrect, which means it was ___.', 'wrong', ['hidden', 'partial', 'unclear']],
      ['The athlete was swift, which means she was very ___.', 'fast', ['tall', 'lean', 'strong']],
    ];
    const upperRows = [
      ['The principal\'s message was brief but very ___.', 'meaningful', ['careless', 'shallow', 'crooked']],
      ['The restored square was celebrated for its ___ design, a striking contrast to the ancient buildings that surrounded it.', 'modern', ['fragile', 'gentle', 'hollow']],
      ['The report was concise, which means it was ___ and to the point.', 'brief', ['lengthy', 'vague', 'repetitive']],
      ['Her argument was coherent, meaning it was ___ and easy to follow.', 'logical', ['creative', 'repetitive', 'bold']],
      ['The policy was transparent, which means it was ___.', 'open', ['complicated', 'confidential', 'flexible']],
      ['The evidence was conclusive, meaning it was ___ and left no doubt.', 'decisive', ['partial', 'ambiguous', 'suggestive']],
      ['His behaviour was erratic, which means it was ___ and unpredictable.', 'irregular', ['consistent', 'calm', 'deliberate']],
      ['The speech was eloquent, meaning it was ___ and persuasive.', 'articulate', ['simple', 'aggressive', 'unclear']],
      ['The decision was unanimous — it means everyone was ___ about it.', 'in agreement', ['divided', 'uncertain', 'unaware']],
      ['The scientist\'s theory was controversial, which means it was ___.', 'disputed', ['accepted', 'proven', 'ignored']],
      ['The student was diligent, which means she was ___.', 'hardworking', ['talented', 'creative', 'confident']],
      ['The opposite of "oppressive" is ___.', 'liberating', ['demanding', 'strict', 'formal']],
      ['The fund was depleted, meaning it was almost ___.', 'empty', ['full', 'distributed', 'frozen']],
      ['The new law was contentious, meaning it was ___.', 'debatable', ['popular', 'temporary', 'straightforward']],
      ['The writer\'s prose was vivid, which means it was ___ and descriptive.', 'lively', ['plain', 'direct', 'restrained']],
      ['The economy was stagnant, which is the opposite of being ___.', 'growing', ['stable', 'regulated', 'diversified']],
    ];
    const p1p2Ex = [
      { 'happy': '"happy" is the synonym of "joyful" — both mean a feeling of great pleasure.', 'angry': '"angry" is an emotion, but it is the opposite of joyful.', 'silent': '"silent" describes sound level — unrelated to joyfulness.', 'frozen': '"frozen" means extremely cold — not a feeling of happiness.' },
      { 'rude': '"rude" is the antonym of "polite" — the word "not" signals you need the opposite.', 'formal': '"formal" means serious and proper — it is not the opposite of polite.', 'steady': '"steady" means stable — unrelated to politeness.', 'honest': '"honest" is a positive quality — not the opposite of polite.' },
      { 'small': '"small" is the synonym of "tiny" — both mean not large.', 'bright': '"bright" describes light, not size.', 'cold': '"cold" describes temperature, not size.', 'loud': '"loud" describes sound, not size.' },
      { 'afraid': '"afraid" is the antonym of "brave" — "not" signals you need the opposite.', 'angry': '"angry" describes a feeling, not the opposite of brave.', 'lazy': '"lazy" means not working hard — not the opposite of brave.', 'hungry': '"hungry" describes an appetite — not the opposite of brave.' },
      { 'light': '"light" is the antonym of "heavy" — "opposite of" is the key signal.', 'short': '"short" is the opposite of tall, not heavy.', 'old': '"old" is the opposite of new — not the opposite of heavy.', 'narrow': '"narrow" is the opposite of wide — not the opposite of heavy.' },
      { 'rough': '"rough" is the antonym of "gentle" — "not gentle" signals you need the opposite.', 'soft': '"soft" is a synonym of gentle — not the opposite.', 'little': '"little" describes size — not the opposite of gentle.', 'timid': '"timid" means shy — not the opposite of gentle.' },
      { 'quiet': '"quiet" is the antonym of "noisy" — "opposite of" signals this.', 'dark': '"dark" is the opposite of bright — not the opposite of noisy.', 'small': '"small" is the opposite of large — not the opposite of noisy.', 'crowded': '"crowded" can go with noisy, but it is not its opposite.' },
      { 'present': '"present" is the antonym of "absent" — "not absent" means the same as being present.', 'well': '"well" means healthy — not the direct antonym of absent.', 'alert': '"alert" means aware — not the antonym of absent.', 'ready': '"ready" means prepared — not the antonym of absent.' },
      { 'cold': '"cold" is the synonym of "freezing" (extremely cold) — "extremely" strengthens the meaning.', 'warm': '"warm" is the opposite of freezing — not a synonym.', 'fresh': '"fresh" means cool or new — not the same as extremely cold.', 'still': '"still" means not moving — unrelated to temperature.' },
      { 'open': '"open" is the antonym of "closed" — "opposite of" signals this.', 'busy': '"busy" can describe an open shop but is not its opposite.', 'large': '"large" is the opposite of small — not the opposite of closed.', 'bright': '"bright" is the opposite of dark — not the opposite of closed.' },
      { 'lively': '"lively" is a synonym of "playful" — both mean full of energy and fun.', 'quiet': '"quiet" is the opposite of lively — not a synonym.', 'serious': '"serious" means not playful — it is the opposite.', 'timid': '"timid" means shy and fearful — not a synonym of playful.' },
      { 'selfish': '"selfish" is the antonym of "generous" — "not generous" signals you need the opposite.', 'kind': '"kind" is close to generous — not the opposite.', 'gentle': '"gentle" describes manner — not the opposite of generous.', 'polite': '"polite" is good behaviour — not the opposite of generous.' },
      { 'wide': '"wide" is the antonym of "narrow" — "opposite of" signals this.', 'long': '"long" is the opposite of short — not the opposite of narrow.', 'steep': '"steep" describes slope — not the opposite of narrow.', 'rough': '"rough" describes texture — not the opposite of narrow.' },
      { 'unhappy': '"unhappy" is the synonym of "miserable" — both mean very sad.', 'hungry': '"hungry" describes appetite — not the same as feeling miserable.', 'tired': '"tired" means physically drained — not the same as feeling miserable.', 'confused': '"confused" means puzzled — not the same as very sad.' },
      { 'wrong': '"wrong" is the synonym of "incorrect" — both mean not right.', 'hidden': '"hidden" means not visible — not a synonym of incorrect.', 'partial': '"partial" means incomplete — not the same as incorrect.', 'unclear': '"unclear" means not clear — not the same as incorrect.' },
      { 'fast': '"fast" is the synonym of "swift" — both mean moving quickly.', 'tall': '"tall" describes height — not a synonym of swift.', 'lean': '"lean" describes build — not a synonym of swift.', 'strong': '"strong" describes power — not the same as swift.' },
    ];
    const upperEx = [
      { 'meaningful': '"meaningful" fits — "brief" describes length, but "very meaningful" describes the impact.', 'careless': '"careless" is a negative quality — contradicts the compliment "very".', 'shallow': '"shallow" means lacking depth — the opposite of meaningful.', 'crooked': '"crooked" means bent or dishonest — unrelated to the value of a message.' },
      { 'modern': '"modern" fits — the contrast with "ancient buildings" signals a new, contemporary design.', 'fragile': '"fragile" means easily broken — not the focus of the contrast here.', 'gentle': '"gentle" describes manner — not relevant to architectural style.', 'hollow': '"hollow" means empty inside — not an architectural contrast.' },
      { 'brief': '"brief" is the synonym of "concise" — both mean short and to the point.', 'lengthy': '"lengthy" is the antonym — the opposite of concise.', 'vague': '"vague" means unclear — not the same as concise.', 'repetitive': '"repetitive" means repeating unnecessarily — the opposite of concise.' },
      { 'logical': '"logical" is the synonym of "coherent" — both mean clear and reasoned.', 'creative': '"creative" means original — not the same as logical and easy to follow.', 'repetitive': '"repetitive" means repeating — not a feature of a coherent argument.', 'bold': '"bold" means daring — not the same as clear and logical.' },
      { 'open': '"open" is the synonym of "transparent" — both mean nothing is hidden.', 'complicated': '"complicated" is the opposite of transparent.', 'confidential': '"confidential" means secret — the opposite of transparent.', 'flexible': '"flexible" means adaptable — not the same as transparent.' },
      { 'decisive': '"decisive" is the synonym of "conclusive" — both mean leaving no doubt.', 'partial': '"partial" means incomplete — the opposite of conclusive.', 'ambiguous': '"ambiguous" means unclear — the opposite of conclusive.', 'suggestive': '"suggestive" implies possibility — not the same as certain and final.' },
      { 'irregular': '"irregular" is the synonym of "erratic" — both mean inconsistent and unpredictable.', 'consistent': '"consistent" is the antonym of erratic.', 'calm': '"calm" is the antonym of erratic.', 'deliberate': '"deliberate" means planned — the opposite of erratic.' },
      { 'articulate': '"articulate" is the synonym of "eloquent" — both mean expressing ideas clearly and persuasively.', 'simple': '"simple" means basic — not the same as eloquent and persuasive.', 'aggressive': '"aggressive" means forceful and hostile — not the same as eloquent.', 'unclear': '"unclear" is the antonym of eloquent.' },
      { 'in agreement': '"in agreement" matches "unanimous" — unanimous means all agreed.', 'divided': '"divided" is the antonym — unanimous means the opposite of divided.', 'uncertain': '"uncertain" means unsure — unanimous means certain agreement.', 'unaware': '"unaware" means not knowing — unrelated to unanimous agreement.' },
      { 'disputed': '"disputed" is the synonym of "controversial" — both mean contested and debated.', 'accepted': '"accepted" is the antonym of controversial.', 'proven': '"proven" means established as fact — the opposite of controversial.', 'ignored': '"ignored" means not noticed — not the same as widely debated.' },
      { 'hardworking': '"hardworking" is the synonym of "diligent" — both mean working with care and effort.', 'talented': '"talented" means naturally gifted — not the same as diligent.', 'creative': '"creative" means imaginative — not the same as hardworking.', 'confident': '"confident" means self-assured — not the same as diligent.' },
      { 'liberating': '"liberating" is the antonym of "oppressive" — freedom contrasts with oppression.', 'demanding': '"demanding" is similar to oppressive — not its opposite.', 'strict': '"strict" is similar to oppressive — not its opposite.', 'formal': '"formal" means proper and official — not the opposite of oppressive.' },
      { 'empty': '"empty" is the synonym of "depleted" — depleted means almost used up.', 'full': '"full" is the antonym of depleted.', 'distributed': '"distributed" means shared out — not the same as depleted.', 'frozen': '"frozen" means stopped — not the same as nearly empty.' },
      { 'debatable': '"debatable" is the synonym of "contentious" — both mean open to argument.', 'popular': '"popular" is the antonym of contentious.', 'temporary': '"temporary" means short-lived — not the same as debatable.', 'straightforward': '"straightforward" means simple and clear — the opposite of contentious.' },
      { 'lively': '"lively" is the synonym of "vivid" — both mean bright, striking, and full of life.', 'plain': '"plain" is the antonym of vivid.', 'direct': '"direct" means straightforward — not the same as vivid.', 'restrained': '"restrained" means held back — the opposite of vivid.' },
      { 'growing': '"growing" is the antonym of "stagnant" — stagnant means not moving forward.', 'stable': '"stable" also contrasts with stagnant but is not exact — a stagnant economy is not moving, but neither is a stable one; the question signals an opposite, which is growth.', 'regulated': '"regulated" means controlled — not the antonym of stagnant.', 'diversified': '"diversified" means varied — not the antonym of stagnant.' },
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : upperRows;
    const exRows = (level === 'P1' || level === 'P2') ? p1p2Ex : upperEx;
    const [q, answer, ds] = rotate(rows, i);
    const optionExplanations = exRows[i % exRows.length];
    return { category: 'synonymContrast', subskill: 'synonym_antonym', q, choices: buildChoices(answer, ds), answer, explain: 'Select the closest synonym or contrast word from context.', optionExplanations };
  },
  collocationCloze(level, i) {
    const p1p2Rows = [
      ['Please ___ attention to the safety signs at the lab door.', 'pay', ['do', 'keep', 'set']],
      ['The class decided to ___ a charity sale next Friday.', 'hold', ['make', 'draw', 'carry']],
      ['After discussion, the team ___ a decision quickly.', 'reached', ['caught', 'drew', 'lifted']],
      ['To improve, you should ___ an effort every day.', 'make', ['do', 'bring', 'throw']],
      ['She helped her friend ___ a mistake in the exercise.', 'correct', ['repair', 'mend', 'remove']],
      ['The pupils were told to ___ their hands before asking a question.', 'raise', ['rise', 'wave', 'stretch']],
      ['He was afraid he would ___ a mistake in the spelling test.', 'make', ['do', 'take', 'have']],
      ['The teacher asked us to ___ a line under the important words.', 'draw', ['write', 'mark', 'place']],
      ['We need to ___ our best in every competition.', 'do', ['put', 'make', 'bring']],
      ['The children ___ a song at the National Day celebration.', 'sang', ['drew', 'told', 'acted']],
      ['Could you ___ me a favour and pass the salt?', 'do', ['give', 'make', 'offer']],
      // Audit 2026-09-19, finding 11: "finish off" was offered as a distractor
      // and is a perfectly valid answer here, so a child choosing it was marked
      // wrong for correct English. Replaced with "conclude", which looks
      // plausible but is not an idiomatic collocation with "homework".
      ['The pupils have to ___ their homework before going home.', 'complete', ['conclude', 'end', 'close']],
      ['She ___ a deep breath before stepping onto the stage.', 'took', ['made', 'inhaled', 'pulled']],
      ['We should ___ care of our belongings.', 'take', ['do', 'make', 'give']],
      ['The doctor asked the patient to ___ an appointment early.', 'make', ['take', 'put', 'keep']],
      ['The team had to ___ a plan before the competition.', 'form', ['assemble', 'build', 'arrange']],
    ];
    const upperRows = [
      ['The government decided to ___ a new policy on plastic use.', 'implement', ['construct', 'perform', 'achieve']],
      ['Researchers will ___ a study on the effects of screen time.', 'conduct', ['produce', 'arrange', 'commit']],
      ['The committee ___ a conclusion after weeks of deliberation.', 'reached', ['caught', 'grabbed', 'lifted']],
      ['The athlete had to ___ her determination to push through the pain.', 'summon', ['create', 'remember', 'carry']],
      ['The new policy will ___ effect from the first of January.', 'take', ['bring', 'come', 'make']],
      ['The two sides finally decided to ___ a truce after days of arguing.', 'call', ['shout', 'name', 'say']],
      ['The organisation aims to ___ awareness about mental health.', 'raise', ['lift', 'rise', 'climb']],
      ['The chairman ___ the meeting to a close after the final vote.', 'brought', ['took', 'made', 'put']],
      ['The report will ___ light on the challenges faced by migrant workers.', 'shed', ['spill', 'drop', 'pour']],
      ['The witness was asked to ___ an account of what she had seen.', 'give', ['make', 'do', 'put']],
      ['They hope to ___ an agreement by the end of the week.', 'reach', ['arrive', 'settle', 'find']],
      ['The scientist ___ a breakthrough after years of research.', 'achieved', ['earned', 'found', 'discovered']],
      ['The council had to ___ into account the residents\' feedback.', 'take', ['bring', 'call', 'put']],
      ['The government will ___ measures to tackle water wastage.', 'introduce', ['invent', 'attend', 'publish']],
      ['The charity event managed to ___ over a thousand dollars in donations.', 'raise', ['earn', 'lift', 'rise']],
      ['The team had to ___ a balance between cost and quality.', 'strike', ['hit', 'catch', 'make']],
    ];
    const p1p2Ex = [
      { 'pay': 'We "pay attention" — this is a fixed collocation; you cannot "do" or "set" attention.', 'do': '"do attention" is not a natural English phrase.', 'keep': '"keep attention" is not idiomatic in this context.', 'set': '"set attention" is not a real collocation.' },
      { 'hold': 'We "hold a sale" — the fixed collocation for running an event is "hold".', 'make': '"make a sale" means to sell something, not to organise a sale event.', 'draw': '"draw a sale" is not a real expression.', 'carry': '"carry a sale" is not idiomatic.' },
      { 'reached': 'We "reach a decision" — this is the natural collocation; you arrive at a decision.', 'caught': '"caught a decision" is not a real collocation.', 'drew': '"drew a decision" is not used this way.', 'lifted': '"lifted a decision" is not idiomatic.' },
      { 'make': 'We "make an effort" — this is a fixed collocation in English.', 'do': '"do an effort" is not standard; we "do our best" but "make an effort".', 'bring': '"bring an effort" is not a real collocation.', 'throw': '"throw an effort" is not idiomatic.' },
      { 'correct': 'We "correct a mistake" — the natural verb for fixing an error.', 'repair': '"repair a mistake" is not standard; repair is for physical objects.', 'mend': '"mend a mistake" is not standard — mend is for physical objects like clothes.', 'remove': '"remove a mistake" suggests erasing, not fixing.' },
      { 'raise': 'We "raise our hands" — the standard gesture for asking to speak.', 'rise': '"rise" never takes an object — hands "rise", but you "raise" them.', 'wave': '"wave hands" suggests signalling, not the classroom gesture.', 'stretch': '"stretch hands" means to extend for exercise — not the classroom convention.' },
      { 'make': 'We "make a mistake" — the fixed collocation for errors.', 'do': '"do a mistake" is not a standard collocation — mistakes are "made".', 'take': '"take a mistake" is not an English collocation.', 'have': '"have a mistake" is not the standard collocation for committing an error.' },
      { 'draw': 'We "draw a line" — the fixed collocation for making a line with a pencil.', 'write': '"write a line" means to write words, not to make a line.', 'mark': '"mark a line" suggests highlighting, not drawing.', 'place': '"place a line" is not a natural expression.' },
      { 'do': 'We "do our best" — the fixed collocation for giving maximum effort.', 'put': '"put our best" is incomplete — the idiom is "put our best foot forward", not "put our best".', 'make': '"make our best" is not standard; we "do our best".', 'bring': '"bring our best" is not a fixed collocation.' },
      { 'sang': 'We "sang a song" — the natural verb for performing a vocal piece.', 'drew': '"drew a song" is not English — we draw pictures, not songs.', 'told': '"told a song" is not English — we tell stories, not songs.', 'acted': '"acted a song" is not standard; acting applies to drama.' },
      { 'do': 'We "do a favour" — the fixed collocation; you cannot "give" or "make" a favour.', 'give': '"give a favour" is not the standard collocation.', 'make': '"make a favour" is not standard in English.', 'offer': '"offer a favour" suggests proposing, not the act itself.' },
      { 'complete': 'We "complete homework" — the standard verb for finishing all the required work.', 'conclude': '"Conclude" fits a speech or a meeting, not homework — we do not say "conclude your homework".', 'end': '"end homework" is not a natural collocation.', 'close': '"close homework" is not a real expression.' },
      { 'took': 'We "took a deep breath" — the fixed collocation for this action.', 'made': '"made a deep breath" is not a standard collocation.', 'inhaled': '"inhaled a deep breath" is redundant — inhaling is part of breathing.', 'pulled': '"pulled a deep breath" is not standard.' },
      { 'take': 'We "take care of" — the fixed phrase for looking after something.', 'do': '"do care of" is not correct.', 'make': '"make care of" is not a real collocation.', 'give': '"give care of" is not standard.' },
      { 'make': 'We "make an appointment" — the standard collocation for booking a time.', 'take': '"take an appointment" is not the standard phrase.', 'put': '"put an appointment" is not an English collocation.', 'keep': '"keep an appointment" means to not miss it — not to book one.' },
      { 'form': 'We "form a plan" — a fixed collocation meaning to develop and create a plan.', 'assemble': '"assemble a plan" is not natural — assemble is for physical parts.', 'build': '"build a plan" is not the natural collocation — plans are "formed" or "made".', 'arrange': '"arrange a plan" is not the natural collocation for creating one.' },
    ];
    const upperEx = [
      { 'implement': 'We "implement a policy" — the precise collocation for putting a policy into action.', 'construct': '"construct" is used for buildings and structures, not policies.', 'perform': '"perform" is used for plays, songs and tasks, not policies.', 'achieve': '"achieve" goes with goals or results, not with a policy itself.' },
      { 'conduct': 'We "conduct a study" — the formal collocation for carrying out research.', 'produce': '"produce a study" means to create the written report — not to carry it out.', 'arrange': '"arrange a study" means to organise — not the standard research collocation.', 'commit': '"commit a study" is not an English collocation.' },
      { 'reached': 'We "reach a conclusion" — the natural collocation for arriving at a final decision.', 'caught': '"caught a conclusion" is not a real collocation.', 'grabbed': '"grabbed a conclusion" is not a real collocation.', 'lifted': '"lifted a conclusion" is not idiomatic.' },
      { 'summon': 'We "summon determination" — meaning to call up a resource from within yourself.', 'create': '"create determination" implies making something new — determination is an inner resource.', 'remember': '"remember determination" does not convey calling upon it in a difficult moment.', 'carry': '"carry determination" is not idiomatic for this meaning.' },
      { 'take': '"Take effect" is the fixed collocation — a policy "takes effect" when it starts.', 'bring': '"bring effect" is not a standard collocation.', 'come': '"come effect" is not grammatical — the phrase would need "into", which is not in the sentence.', 'make': '"make effect" is not a real collocation.' },
      { 'call': 'We "call a truce" — the fixed collocation for agreeing to stop fighting.', 'shout': '"shout a truce" is not the collocation — a truce is "called".', 'name': '"name a truce" means to give it a name, not to agree on one.', 'say': '"say a truce" is not an English collocation.' },
      { 'raise': 'We "raise awareness" — the fixed collocation for increasing people\'s understanding.', 'lift': '"lift awareness" is not an English collocation.', 'rise': '"rise" never takes an object — awareness "rises", but you "raise" it.', 'climb': '"climb awareness" is not an English collocation.' },
      { 'brought': 'We "bring a meeting to a close" — the fixed collocation for formally ending it.', 'took': '"took the meeting to a close" is not the collocation — meetings are "brought" to a close.', 'made': '"made the meeting to a close" is not grammatical.', 'put': '"put the meeting to a close" is not the standard collocation.' },
      { 'shed': 'We "shed light on" something — the fixed collocation for revealing new information.', 'spill': '"spill light on" is not an English collocation.', 'drop': '"drop light on" is not an English collocation.', 'pour': '"pour light on" is not the idiom for revealing information.' },
      { 'give': 'We "give an account" — the fixed collocation for describing what happened.', 'make': '"make an account" is not the collocation for describing events.', 'do': '"do an account" is not an English collocation.', 'put': '"put an account" is not an English collocation.' },
      { 'reach': 'We "reach an agreement" — the collocation for successfully coming to a deal.', 'arrive': '"arrive an agreement" is missing "at" — we "arrive at" an agreement.', 'settle': '"settle an agreement" is not standard; "settle" is used with disputes.', 'find': '"find an agreement" is not a natural collocation.' },
      { 'achieved': 'We "achieved a breakthrough" — the collocation for reaching an important discovery.', 'earned': '"earned a breakthrough" is not a standard collocation.', 'found': '"found a breakthrough" is not a typical collocation.', 'discovered': '"discovered a breakthrough" is redundant — a breakthrough is already a discovery.' },
      { 'take': 'We "take into account" — the fixed phrase for considering something.', 'bring': '"bring into account" is not standard.', 'call': '"call into account" means to question someone — not to consider feedback.', 'put': '"put into account" is not the standard phrase.' },
      { 'introduce': 'We "introduce measures" — the formal collocation for putting new actions in place.', 'invent': '"invent measures" is not the collocation for putting new rules in place.', 'attend': '"attend measures" is not English — we attend meetings or events.', 'publish': '"publish measures" means to announce them — not to put them into action.' },
      { 'raise': 'We "raise money" — the fixed collocation for gathering donations.', 'earn': '"earn money" means to get it through work — not through donations at an event.', 'lift': '"lift money" is not an English collocation.', 'rise': '"rise" never takes an object — money cannot be "risen" by an event.' },
      { 'strike': 'We "strike a balance" — the fixed idiom for settling on a fair middle point.', 'hit': '"hit a balance" is not the idiom, even though "strike" can mean "hit".', 'catch': '"catch a balance" is not an English collocation.', 'make': '"make a balance" is not a standard collocation.' },
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : upperRows;
    const exRows = (level === 'P1' || level === 'P2') ? p1p2Ex : upperEx;
    const [q, answer, ds] = rotate(rows, i);
    const optionExplanations = exRows[i % exRows.length];
    return { category: 'collocationCloze', subskill: 'word_partners', q, choices: buildChoices(answer, ds), answer, explain: 'Some words naturally go together as collocations.', optionExplanations };
  },
  grammaticalRole(level, i) {
    const p1p2Rows = [
      ['The class admired her ___ performance during speech day.', 'confident', ['confidence', 'confidently', 'confide']],
      ['The referee blew the whistle ___.', 'sharply', ['sharp', 'sharpness', 'sharpen']],
      ['Their ___ helped the new pupil settle in quickly.', 'kindness', ['kind', 'kindly', 'kinder']],
      ['The team moved with great ___ during the relay.', 'speed', ['speedy', 'speedily', 'speeding']],
      ['She spoke very ___ to the younger children.', 'gently', ['gentle', 'gentleness', 'gentler']],
      ['The ___ of the playground made it a popular spot.', 'beauty', ['beautiful', 'beautifully', 'beautify']],
      ['He was ___ that he had left his bag on the bus.', 'upset', ['upsetting', 'upsets', 'upsettingly']],
      ['The puppy ran ___ around the garden.', 'joyfully', ['joyful', 'joyfulness', 'joy']],
      ['Her ___ surprised everyone in the class.', 'bravery', ['brave', 'bravely', 'braver']],
      ['The boy smiled ___ when he received his prize.', 'proudly', ['proud', 'pride', 'prouder']],
      ['It was ___ of him to share his lunch with his friend.', 'kind', ['kindly', 'kindness', 'kinder']],
      ['The children played ___ in the sand.', 'happily', ['happy', 'happiness', 'happier']],
      ['The ___ of the music filled the hall.', 'beauty', ['beautiful', 'beautifully', 'beautify']],
      ['He was very ___ after winning the race.', 'excited', ['excitedly', 'excitement', 'exciting']],
      ['The teacher spoke ___ to the nervous student.', 'calmly', ['calm', 'calmness', 'calmer']],
      ['Her ___ helped her finish the task first.', 'focus', ['focused', 'focusedly', 'focusing']],
    ];
    const upperRows = [
      ['The government made a ___ decision to postpone the elections.', 'controversial', ['controversy', 'controversially', 'controvert']],
      ['The essay was written with great ___.', 'clarity', ['clear', 'clearly', 'clearer']],
      ['She argued ___ for a change in the school policy.', 'persuasively', ['persuasive', 'persuasion', 'persuade']],
      ['The committee reached a ___ agreement after long debate.', 'unanimous', ['unanimously', 'unanimity', 'anonymous']],
      ['The data showed a ___ improvement in student performance.', 'significant', ['significantly', 'significance', 'signify']],
      ['The report was presented with ___.', 'precision', ['precise', 'precisely', 'preciser']],
      ['The delegate spoke ___ on behalf of her country.', 'eloquently', ['eloquent', 'eloquence', 'eloquenter']],
      ['The ___ of the new policy surprised many citizens.', 'complexity', ['complex', 'complexly', 'complicate']],
      ['The scientist worked ___ to reproduce the results.', 'systematically', ['systematic', 'system', 'systematise']],
      ['Her ___ approach to the problem impressed the panel.', 'analytical', ['analytically', 'analysis', 'analyse']],
      ['The volunteers worked ___ throughout the night.', 'tirelessly', ['tireless', 'tirelessness', 'tire']],
      ['The speaker delivered a ___ address to the nation.', 'stirring', ['stir', 'stirringly', 'stirred']],
      ['The new curriculum promotes ___ thinking among students.', 'critical', ['critically', 'criticism', 'criticise']],
      ['She approached the challenge with admirable ___.', 'resilience', ['resilient', 'resiliently', 'resile']],
      ['The law was passed ___ by both chambers of parliament.', 'unanimously', ['unanimous', 'unanimity', 'union']],
      ['The ___ of his work was recognised at the national level.', 'excellence', ['excellent', 'excellently', 'excel']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'grammaticalRole', subskill: 'word_form', q, choices: buildChoices(answer, ds), answer, explain: 'Pick the word form that fits the grammar slot.' };
  },
  connectorClue(level, i) {
    // Review 2026-10-08: every option explained. Where the connector only
    // constrained the verb, not the blank ("Although it was raining, the
    // children played ___ outside" took any adverb), the stem was rewritten
    // so the connector decides the blank.
    const p1p2Rows = [
      ['Although the backpack looked small, it was surprisingly ___.', 'heavy', ['empty', 'gentle', 'silent'], {
        'heavy': '"Heavy" is right — "Although" and "surprisingly" tell us something unexpected: the bag looked small but weighed a lot.',
        'empty': '"Empty" means nothing inside. A small bag being empty is not a surprise, but "surprisingly" tells us something unexpected comes next.',
        'gentle': '"Gentle" means soft and kind. We use it for people or touches, not for a backpack.',
        'silent': '"Silent" means making no sound. A backpack does not make a sound anyway, so that is no surprise.',
      }],
      ['Because the lights went out suddenly, the hall became ___.', 'dark', ['tiny', 'modern', 'spacious'], {
        'dark': '"Dark" is right — "Because" tells us why: with no lights, there was no light, so the hall became dark.',
        'tiny': '"Tiny" means very small. Lights going out does not make a hall smaller.',
        'modern': '"Modern" means new and up to date. Lights going out does not make a hall new.',
        'spacious': '"Spacious" means having lots of room. Lights going out does not change how big the hall is.',
      }],
      ['She was nervous, yet her voice remained ___.', 'steady', ['crooked', 'dusty', 'fragile'], {
        'steady': '"Steady" is right — it means firm and not shaking. "Yet" tells us something unexpected: she was nervous, but her voice did not shake.',
        'crooked': '"Crooked" means bent, like a crooked line. A voice cannot be bent.',
        'dusty': '"Dusty" means covered in dust. A voice cannot be dusty.',
        'fragile': '"Fragile" means easy to break. A nervous voice might sound fragile, but "yet" tells us her voice did the opposite.',
      }],
      ['The toy was old; however, it was still ___.', 'working', ['broken', 'missing', 'rusted'], {
        'working': '"Working" is right — "however" tells us something unexpected: the toy was old, but it still worked.',
        'broken': '"Broken" is what we might expect from an old toy. "However" tells us the opposite happened.',
        'missing': '"Missing" means lost. The sentence is about what the old toy was like, not where it was.',
        'rusted': '"Rusted" is what we might expect from an old toy. "However" tells us the opposite happened.',
      }],
      ['He ate a big breakfast, so he was not ___ by lunchtime.', 'hungry', ['sleepy', 'angry', 'wet'], {
        'hungry': '"Hungry" is right — "so" tells us what happened because of the big breakfast: it filled him up.',
        'sleepy': '"Sleepy" means needing sleep. A big breakfast fills your tummy; it does not stop you feeling sleepy.',
        'angry': '"Angry" means cross. Eating breakfast is not why he was not cross.',
        'wet': '"Wet" means covered in water. Breakfast has nothing to do with being wet.',
      }],
      ['It was raining, but the children did not mind. They played ___ in the puddles.', 'happily', ['sadly', 'angrily', 'grumpily'], {
        'happily': '"Happily" is right — "but" and "did not mind" tell us the rain did not spoil their fun.',
        'sadly': '"Sadly" means in an unhappy way. "Did not mind" tells us the rain did not upset them.',
        'angrily': '"Angrily" means in a cross way. "Did not mind" tells us the rain did not upset them.',
        'grumpily': '"Grumpily" means in a bad mood. "Did not mind" tells us they were in a good mood.',
      }],
      ['She practised hard; therefore, she performed ___ on stage.', 'well', ['badly', 'slowly', 'silently'], {
        'well': '"Well" is right — "therefore" tells us what happened because she practised: hard practice helps you do well.',
        'badly': '"Badly" is the opposite of what hard practice does.',
        'slowly': '"Slowly" is about speed, not about how good she was. Practice makes you better, not slower.',
        'silently': '"Silently" means without a sound. Practising hard does not make you silent.',
      }],
      ['The shop was far; however, Mum said the walk was ___.', 'easy', ['long', 'tiring', 'hard'], {
        'easy': '"Easy" is right — "however" tells us something unexpected: the shop was far, but the walk was easy.',
        'long': '"Long" is what we expect when a shop is far. "However" tells us something unexpected comes next.',
        'tiring': '"Tiring" is what we expect from a far walk. "However" tells us the opposite.',
        'hard': '"Hard" is what we expect from a far walk. "However" tells us the opposite.',
      }],
      ['Because the sun was bright, everyone wore ___.', 'sunglasses', ['mittens', 'boots', 'scarves'], {
        'sunglasses': '"Sunglasses" is right — "Because" gives the reason: bright sun hurts our eyes, and sunglasses protect them.',
        'mittens': '"Mittens" keep your hands warm on a cold day. They do not help with bright sun.',
        'boots': '"Boots" keep your feet dry. They do not help with bright sun.',
        'scarves': '"Scarves" keep your neck warm. They do not help with bright sun.',
      }],
      ['He forgot his umbrella, so he got ___ in the rain.', 'wet', ['lost', 'hungry', 'sleepy'], {
        'wet': '"Wet" is right — "so" tells us what happened next: with no umbrella, the rain fell on him.',
        'lost': '"Lost" means not knowing where you are. Forgetting an umbrella does not make you lost.',
        'hungry': '"Hungry" means needing food. Forgetting an umbrella does not make you hungry.',
        'sleepy': '"Sleepy" means needing sleep. Forgetting an umbrella does not make you sleepy.',
      }],
      ['Despite the cold, Mei wore only a ___ jacket outside.', 'thin', ['thick', 'warm', 'heavy'], {
        'thin': '"Thin" is right — "Despite" and "only" tell us something unexpected: it was cold, but her jacket was thin.',
        'thick': '"Thick" is what we expect on a cold day. "Despite" tells us she did something unexpected.',
        'warm': '"Warm" is what we expect on a cold day. "Only" tells us her jacket was not enough.',
        'heavy': '"Heavy" is what we expect on a cold day. "Despite" tells us she did something unexpected.',
      }],
      ['Because he dropped his tray, the food got ___.', 'dirty', ['tasty', 'hot', 'fresh'], {
        'dirty': '"Dirty" is right — "Because" gives the reason: the food fell on the floor.',
        'tasty': '"Tasty" means good to eat. Food on the floor does not become tasty.',
        'hot': '"Hot" means very warm. Dropping food does not heat it up.',
        'fresh': '"Fresh" means just made and clean. Food on the floor is the opposite of fresh.',
      }],
      ['The bag was full, so Mum had to carry it ___.', 'carefully', ['lightly', 'lazily', 'quickly'], {
        'carefully': '"Carefully" is right — "so" tells us what the full bag made Mum do: things might fall out, so she took care.',
        'lightly': '"Lightly" means with little weight. A full bag is heavy, not light.',
        'lazily': '"Lazily" means without trying. A full bag needs more effort, not less.',
        'quickly': '"Quickly" is about speed. A full bag is a reason to go carefully, not fast.',
      }],
      ['She had not eaten all day, yet she still looked ___.', 'cheerful', ['hungry', 'weak', 'tired'], {
        'cheerful': '"Cheerful" is right — "yet" tells us something unexpected: she had not eaten, but she still looked happy.',
        'hungry': '"Hungry" is what we expect when someone has not eaten. "Yet" tells us the opposite.',
        'weak': '"Weak" is what we expect when someone has not eaten. "Yet" tells us the opposite.',
        'tired': '"Tired" is what we expect when someone has not eaten. "Yet" tells us the opposite.',
      }],
      ['Although the homework was long, Ali finished it ___.', 'quickly', ['slowly', 'badly', 'late'], {
        'quickly': '"Quickly" is right — "Although" tells us something unexpected: long homework usually takes a long time, but Ali was fast.',
        'slowly': '"Slowly" is what we expect with long homework. "Although" tells us the opposite happened.',
        'badly': '"Badly" is about how good the work was. "Although" needs a surprise about time: long homework, finished fast.',
        'late': '"Late" is what we expect with long homework. "Although" tells us the opposite happened.',
      }],
      ['He left his water bottle behind; however, he was not ___ at all.', 'thirsty', ['happy', 'sleepy', 'bored'], {
        'thirsty': '"Thirsty" is right — "however" tells us something unexpected: he had no water, but he did not need a drink.',
        'happy': '"Happy" does not go with the water bottle. Leaving water behind is about needing a drink.',
        'sleepy': '"Sleepy" means needing sleep. A water bottle is about drinking, not sleeping.',
        'bored': '"Bored" means having nothing fun to do. A water bottle is about drinking.',
      }],
    ];
    const upperRows = [
      ['The map was clear; however, the route was still ___.', 'confusing', ['tidy', 'famous', 'silent'], {
        'confusing': '"Confusing" is right — "however" signals a contrast: a clear map should make the route easy, but it was still hard to follow.',
        'tidy': '"Tidy" means neat. A route is not neat or messy, and "tidy" does not contrast with a clear map.',
        'famous': '"Famous" means well known. It says nothing about whether the route was easy to follow.',
        'silent': '"Silent" means without sound. A route is not quiet or loud.',
      }],
      ['Despite the setback, the team remained ___ and continued their work.', 'determined', ['discouraged', 'confused', 'impatient'], {
        'determined': '"Determined" is right — "Despite" signals a contrast: a setback could have stopped them, but they kept going.',
        'discouraged': '"Discouraged" means losing hope — what a setback usually causes. "Despite" and "continued their work" show the opposite.',
        'confused': '"Confused" means not understanding. It does not explain why they kept working after a setback.',
        'impatient': '"Impatient" means unwilling to wait. It does not contrast with the setback or explain why they kept working.',
      }],
      ['Although the experiment failed, the scientists gained ___ insights.', 'valuable', ['negative', 'useless', 'obvious'], {
        'valuable': '"Valuable" is right — "Although" signals a contrast: the experiment failed, yet they learnt something worthwhile.',
        'negative': '"Negative" means bad or unhelpful. It matches the failure instead of contrasting with it.',
        'useless': '"Useless" matches a failed experiment, so there is no contrast. "Although" needs something good to come out of the failure.',
        'obvious': '"Obvious" means already easy to see. It does not give the good surprise that "Although" sets up.',
      }],
      ['The evidence was limited; nevertheless, the judge reached a ___ verdict.', 'reasonable', ['hasty', 'unfair', 'random'], {
        'reasonable': '"Reasonable" is right — "nevertheless" signals a contrast: with little evidence, a sensible verdict is a surprise.',
        'hasty': '"Hasty" means rushed. Limited evidence might lead to a rushed verdict, so there is no contrast.',
        'unfair': '"Unfair" is what limited evidence might cause. "Nevertheless" needs the opposite.',
        'random': '"Random" means without reason. Limited evidence might cause that, and "nevertheless" needs the opposite.',
      }],
      ['She had rehearsed for months; consequently, her performance was ___.', 'outstanding', ['average', 'poor', 'rushed'], {
        'outstanding': '"Outstanding" is right — "consequently" means "as a result", and months of rehearsal result in an excellent performance.',
        'average': '"Average" means ordinary. Months of rehearsal should lead to more than an ordinary result.',
        'poor': '"Poor" is the opposite of what months of rehearsal would produce.',
        'rushed': '"Rushed" means done too quickly. Someone who rehearsed for months had no need to rush.',
      }],
      ['Unless the budget is increased, the project will remain ___.', 'incomplete', ['ambitious', 'approved', 'successful'], {
        'incomplete': '"Incomplete" is right — "Unless" means "if not": if there is no more money, the work cannot be finished.',
        'ambitious': '"Ambitious" means aiming high. A lack of money is not what keeps a project ambitious.',
        'approved': '"Approved" means agreed to. "Unless the budget is increased" warns of a problem, not an approval.',
        'successful': '"Successful" is the opposite of the warning. "Unless" tells us something goes wrong without more money.',
      }],
      ['The policy was popular; however, its implementation was ___.', 'challenging', ['swift', 'celebrated', 'clear'], {
        'challenging': '"Challenging" is right — "however" signals a contrast: people liked the policy, but carrying it out was difficult.',
        'swift': '"Swift" means fast — a good thing that agrees with "popular", so there is no contrast.',
        'celebrated': '"Celebrated" agrees with "popular" instead of contrasting with it.',
        'clear': '"Clear" is a good thing, like "popular". "However" needs a difficulty.',
      }],
      ['While the report was detailed, the recommendations were surprisingly ___.', 'vague', ['thorough', 'accepted', 'decisive'], {
        'vague': '"Vague" is right — it means unclear. "While" and "surprisingly" set up a contrast with "detailed".',
        'thorough': '"Thorough" means careful and complete — the same idea as "detailed", so it is no surprise.',
        'accepted': '"Accepted" means agreed to. It does not contrast with "detailed".',
        'decisive': '"Decisive" means firm and clear. That matches a detailed report, so it is no surprise.',
      }],
      ['He prepared thoroughly; therefore, he answered the questions ___.', 'confidently', ['nervously', 'carelessly', 'reluctantly'], {
        'confidently': '"Confidently" is right — "therefore" shows the result: careful preparation makes you sure of your answers.',
        'nervously': '"Nervously" is the opposite of what good preparation gives you.',
        'carelessly': '"Carelessly" means without care. Someone who prepared thoroughly would answer with care.',
        'reluctantly': '"Reluctantly" means unwillingly. Being well prepared would make him willing, not unwilling.',
      }],
      ['Even though the task seemed impossible, the team found it surprisingly ___.', 'manageable', ['overwhelming', 'exhausting', 'daunting'], {
        'manageable': '"Manageable" is right — it means possible to deal with. "Even though" and "surprisingly" set up a contrast with "impossible".',
        'overwhelming': '"Overwhelming" means too much to cope with. It agrees with "impossible", so there is no surprise.',
        'exhausting': '"Exhausting" means very tiring — just what an impossible-seeming task would be, so there is no surprise.',
        'daunting': '"Daunting" means scary to begin. That is the same idea as "seemed impossible", so there is no contrast.',
      }],
      ['Because of the heavy traffic, the convoy arrived ___ at the venue.', 'late', ['early', 'quietly', 'ahead'], {
        'late': '"Late" is right — "Because of" gives the cause: heavy traffic slows vehicles down.',
        'early': '"Early" is the opposite of what heavy traffic causes.',
        'quietly': '"Quietly" is about sound. Heavy traffic affects time, not noise.',
        'ahead': '"Ahead" (of time) is the opposite of what heavy traffic causes.',
      }],
      ['The solution was elegant; furthermore, it was ___ to implement.', 'practical', ['costly', 'difficult', 'controversial'], {
        'practical': '"Practical" is right — "furthermore" adds another good point to "elegant", and "practical to implement" means easy to put into use.',
        'costly': '"Costly" means expensive — a drawback. "Furthermore" adds another good point, not a problem.',
        'difficult': '"Difficult" is a drawback. "Furthermore" adds a second good point to "elegant".',
        'controversial': '"Controversial" means causing disagreement — a drawback. "Furthermore" adds a good point.',
      }],
      ['Despite being the youngest member, she contributed ___ to the group.', 'significantly', ['minimally', 'carelessly', 'grudgingly'], {
        'significantly': '"Significantly" is right — "Despite" signals a contrast: we might expect the youngest to give little, but she gave a lot.',
        'minimally': '"Minimally" means very little — what we might expect from the youngest, so there is no contrast.',
        'carelessly': '"Carelessly" means without care. It does not contrast with being the youngest.',
        'grudgingly': '"Grudgingly" means unwillingly. It does not contrast with being the youngest.',
      }],
      ['The data was incomplete; as a result, the conclusions were ___.', 'unreliable', ['precise', 'final', 'convincing'], {
        'unreliable': '"Unreliable" is right — "as a result" shows cause and effect: missing data leads to conclusions you cannot trust.',
        'precise': '"Precise" means exact. Incomplete data cannot produce exact conclusions.',
        'final': '"Final" means settled. With data missing, the conclusions could not be settled.',
        'convincing': '"Convincing" is the opposite of what incomplete data produces.',
      }],
      ['He was nervous before the interview; nonetheless, he performed ___.', 'admirably', ['terribly', 'forgetfully', 'quietly'], {
        'admirably': '"Admirably" is right — it means very well. "Nonetheless" signals a contrast with "nervous".',
        'terribly': '"Terribly" is what nerves might cause, so there is no contrast.',
        'forgetfully': '"Forgetfully" is what nerves might cause, so there is no contrast.',
        'quietly': '"Quietly" describes his voice, not how well he did. "Nonetheless" needs a contrast with being nervous.',
      }],
      ['Since the deadline was moved forward, the team had to work ___.', 'faster', ['more slowly', 'individually', 'silently'], {
        'faster': '"Faster" is right — "Since" gives the reason: an earlier deadline means less time, so they had to speed up.',
        'more slowly': '"More slowly" is the opposite of what an earlier deadline demands.',
        'individually': '"Individually" means alone. An earlier deadline is about time, not about working alone.',
        'silently': '"Silently" means without talking. An earlier deadline is about time, not noise.',
      }],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : upperRows;
    const [q, answer, ds, optionExplanations] = rotate(rows, i);
    return { category: 'connectorClue', subskill: 'connector_inference', q, choices: buildChoices(answer, ds), answer, explain: 'The linking word tells you what kind of word comes next: "because" and "so" point to a cause or result; "although", "yet" and "however" point to a surprise.', optionExplanations };
  },
  wordParts(level, i) {
    const p1p2Rows = [
      ['The prefix "re-" in "rewrite" means to do it ___.', 'again', ['slowly', 'poorly', 'outside']],
      ['A person who drives is a ___.', 'driver', ['driving', 'drives', 'drove']],
      ['The suffix "-less" in "careless" means "without ___."', 'care', ['speed', 'noise', 'luck']],
      ['If something is "unfair", the prefix "un-" means ___.', 'not', ['very', 'more', 'before']],
      ['The word "happiness" ends in "-ness", which makes it a ___.', 'noun', ['verb', 'adjective', 'adverb']],
      ['"Rebuild" uses the prefix "re-", which means to ___.', 'build again', ['build quickly', 'build well', 'build slowly']],
      ['The suffix "-ful" in "helpful" means ___.', 'full of help', ['without help', 'against help', 'before help']],
      ['The word "unkind" means ___.', 'not kind', ['very kind', 'most kind', 'quite kind']],
      ['"Playful" describes someone who is full of ___.', 'play', ['work', 'study', 'rest']],
      ['The prefix "pre-" in "preview" means ___.', 'before', ['after', 'again', 'not']],
      ['The prefix "dis-" in "dislike" means you do ___ something.', 'not like', ['like a lot', 'like more', 'like later']],
      ['A person who teaches is a ___.', 'teacher', ['teaching', 'teaches', 'taught']],
      ['The suffix "-ness" in "kindness" tells you it is a ___.', 'noun', ['verb', 'adjective', 'adverb']],
      ['The word "retell" uses "re-", so it means to tell a story ___.', 'again', ['quietly', 'faster', 'badly']],
      ['The suffix "-ly" in "slowly" tells you how something is ___.', 'done', ['seen', 'named', 'owned']],
      ['If someone is "unwell", the prefix "un-" shows they are ___ well.', 'not', ['very', 'quite', 'most']],
    ];
    const upperRows = [
      ['The root "port" in "transport" relates to ___.', 'carrying', ['speaking', 'writing', 'building']],
      ['The root "dict" in "predict" and "contradict" relates to ___.', 'saying', ['seeing', 'moving', 'hearing']],
      ['The suffix "-ology" in "biology" means the ___ of something.', 'study', ['practice', 'history', 'art']],
      ['The prefix "mis-" in "misinterpret" means to interpret ___.', 'incorrectly', ['again', 'before', 'fully']],
      ['The root "graph" in "photography" relates to ___.', 'writing or recording', ['light', 'movement', 'colour']],
      ['The prefix "inter-" in "international" means ___.', 'between', ['inside', 'above', 'before']],
      ['The suffix "-ible" in "reversible" means capable of being ___.', 'reversed', ['improved', 'confirmed', 'required']],
      ['The root "aud" in "audible" relates to ___.', 'hearing', ['seeing', 'speaking', 'touching']],
      ['The prefix "over-" in "overestimate" means to estimate ___.', 'too highly', ['not at all', 'exactly', 'again']],
      ['The root "scribe" in "prescribe" and "describe" relates to ___.', 'writing', ['seeing', 'measuring', 'learning']],
      ['The prefix "sub-" in "submarine" means ___.', 'under', ['above', 'beside', 'through']],
      ['The suffix "-ment" in "achievement" turns a verb into a ___.', 'noun', ['verb', 'adjective', 'adverb']],
      ['The root "vis" in "visible" and "invisible" relates to ___.', 'seeing', ['knowing', 'moving', 'hearing']],
      ['The prefix "contra-" in "contradict" means ___.', 'against', ['with', 'before', 'within']],
      ['The root "struct" in "construct" and "instruct" relates to ___.', 'building', ['ordering', 'breaking', 'joining']],
      ['The suffix "-ation" in "organisation" turns a verb into a ___.', 'noun', ['verb', 'adjective', 'preposition']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'morphologicalAffix', subskill: 'prefix_suffix', q, choices: buildChoices(answer, ds), answer, explain: 'Word parts can help you infer meaning.' };
  },
  idiomaticExpressions(level, i) {
    const p1p2Rows = [
      ['"Hit the books" means to ___.', 'study hard', ['close the library', 'buy textbooks', 'tear paper']],
      ['If someone is "on cloud nine", the person feels ___.', 'very happy', ['very sleepy', 'very angry', 'very hungry']],
      ['"Piece of cake" describes a task that is ___.', 'very easy', ['very expensive', 'very noisy', 'very late']],
      ['When someone says "break a leg", they are wishing you ___.', 'good luck', ['to be careful', 'to rest', 'to hurry up']],
      ['"Under the weather" means that someone is ___.', 'feeling unwell', ['going outside', 'checking the rain', 'feeling cold']],
      ['"Bite the bullet" means to ___ a difficult situation.', 'endure', ['escape', 'complain about', 'ignore']],
      ['"Let the cat out of the bag" means to ___ a secret.', 'reveal', ['keep', 'discover', 'hide']],
      ['When someone is "all ears", they are ___.', 'listening carefully', ['feeling tired', 'looking around', 'very hungry']],
      ['"Keep an eye on" something means to ___ it.', 'watch carefully', ['close it', 'carry it', 'throw it away']],
      ['"Have a heart of gold" means the person is very ___.', 'kind', ['clever', 'strong', 'noisy']],
      ['"Give someone a hand" means to ___ someone.', 'help', ['wave at', 'clap for', 'hold hands with']],
      ['"Out of the blue" means something happens ___.', 'suddenly', ['slowly', 'loudly', 'sadly']],
      ['"Hold your horses" means you should ___.', 'wait', ['run faster', 'shout louder', 'sit down']],
      ['"It is raining cats and dogs" means it is raining ___.', 'very heavily', ['very lightly', 'with animals', 'a little bit']],
      ['"On top of the world" means feeling ___.', 'very happy', ['very tired', 'very confused', 'very hungry']],
      ['"Get cold feet" means to feel ___ about doing something.', 'nervous', ['excited', 'ready', 'happy']],
    ];
    const upperRows = [
      ['When Jia Min said "break the ice", she meant to ___.', 'start friendly conversation', ['smash something cold', 'end the meeting', 'draw a cube']],
      ['"Burning the midnight oil" means to ___.', 'work late into the night', ['set things on fire', 'waste electricity', 'sleep poorly']],
      ['"Turn a blind eye" means to ___ something wrong deliberately.', 'ignore', ['report', 'witness', 'stop']],
      ['"Beat around the bush" means to ___ the main point.', 'avoid', ['explain', 'repeat', 'support']],
      ['"The ball is in your court" means ___ has to make the next decision.', 'you', ['the opponent', 'the referee', 'the crowd']],
      ['"Take with a grain of salt" means to ___ what someone says.', 'not fully believe', ['accept completely', 'question loudly', 'report immediately']],
      ['"Pull strings" means to use ___ to get something done.', 'personal connections', ['physical force', 'detailed plans', 'extra money']],
      ['"Read between the lines" means to understand a ___ meaning.', 'hidden', ['literal', 'repeated', 'simple']],
      ['"Burn your bridges" means to permanently ___ a relationship or opportunity.', 'destroy', ['repair', 'establish', 'improve']],
      ['"Go back to the drawing board" means to ___ from the beginning.', 'start again', ['revise slightly', 'present earlier', 'abandon completely']],
      ['"On the fence" describes someone who is ___ about a decision.', 'undecided', ['determined', 'excited', 'confident']],
      ['"Let sleeping dogs lie" means to ___ a past problem.', 'not disturb', ['resolve', 'expose', 'remember']],
      ['"Bite off more than you can chew" means to take on more ___ than you can handle.', 'responsibility', ['food', 'rest', 'money']],
      ['"Spill the beans" means to ___ information that was meant to be secret.', 'reveal', ['conceal', 'exaggerate', 'question']],
      ['"Hit the nail on the head" means to describe something ___.', 'exactly right', ['too harshly', 'very creatively', 'with difficulty']],
      ['"Add fuel to the fire" means to make a difficult situation ___.', 'worse', ['better', 'clearer', 'calmer']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'idiomaticExpressions', subskill: 'idiom_meaning', q, choices: buildChoices(answer, ds), answer, explain: 'Idioms are figurative, not literal.' };
  },
  proverbsSayings(level, i) {
    // P1–P2: the handful of sayings a young child will actually have heard.
    const lower = [
      ['"Practice makes ___."', 'perfect', ['faster', 'silent', 'famous']],
      ['"Better late than ___."', 'never', ['later', 'sooner', 'always']],
      ['"Two heads are better than ___."', 'one', ['two', 'none', 'three']],
      ['"Look before you ___."', 'leap', ['run', 'sleep', 'climb']],
      ['"The early bird catches the ___."', 'worm', ['fish', 'fly', 'bug']],
      ['"Honesty is the best ___."', 'policy', ['action', 'virtue', 'lesson']],
      ['"Actions speak louder than ___."', 'words', ['coins', 'voices', 'windows']],
      ['"A friend in need is a friend ___."', 'indeed', ['always', 'forever', 'truly']],
    ];
    // P3–P4: a wider set, still testing the fixed wording.
    const middle = [
      ['"Where there is a will, there is a ___."', 'way', ['roadblock', 'ticket', 'raincoat']],
      ['"A stitch in time saves ___."', 'nine', ['trouble', 'money', 'effort']],
      ['"Do not judge a book by its ___."', 'cover', ['content', 'author', 'title']],
      ['"Every cloud has a silver ___."', 'lining', ['edge', 'border', 'frame']],
      ['"All that glitters is not ___."', 'gold', ['bright', 'silver', 'precious']],
      ['"Too many cooks spoil the ___."', 'broth', ['meal', 'food', 'dish']],
      ['"When in Rome, do as the Romans ___."', 'do', ['say', 'eat', 'sing']],
      ['"The pen is mightier than the ___."', 'sword', ['gun', 'shield', 'arrow']],
    ];
    // P5–P6: meaning and application, not a memorised ending. A pupil who can
    // finish a proverb but cannot use it has learnt nothing transferable.
    const upper = [
      ['Which situation best shows "a stitch in time saves nine"?', 'Repairing a small roof leak before the monsoon season arrives', ['Sewing nine buttons onto a shirt at once', 'Waiting until the roof collapses before calling a repairman', 'Buying nine spare tiles in case the roof leaks']],
      ['Which situation best shows "too many cooks spoil the broth"?', 'Six pupils each rewrite the class poster and the message is lost', ['Six pupils each take one clear task and finish early', 'One pupil makes soup for the whole class', 'The canteen hires an extra cook for the lunch rush']],
      ['Which situation best shows "do not judge a book by its cover"?', 'The quietest boy in class turns out to be the strongest debater', ['The library reorders its books by colour', 'A torn book is thrown away because it cannot be read', 'A pupil chooses a novel because the blurb sounds exciting']],
      ['Which situation best shows "every cloud has a silver lining"?', 'A cancelled trip means the class finally finishes its mural', ['A rainy day is followed by another rainy day', 'The sky clears just before the sports meet begins', 'A pupil finds a silver coin on the field']],
      ['Which situation best shows "actions speak louder than words"?', 'He said nothing but quietly cleaned the classroom every day', ['He explained his plan to the class very loudly', 'He promised repeatedly that he would help next week', 'He wrote a long letter about the importance of tidiness']],
      ['Which situation best shows "the early bird catches the worm"?', 'She queued at dawn and got the last concert ticket', ['She woke early but arrived after the tickets sold out', 'She fed the birds in the school garden before class', 'She stayed up late to finish her project on time']],
      ['"All that glitters is not gold" warns us that ___.', 'something impressive on the outside may have little real worth', ['gold is often mistaken for cheaper metals', 'valuable things are usually dull in appearance', 'people should not wear expensive jewellery']],
      ['"When in Rome, do as the Romans do" advises us to ___.', 'follow the customs of the place we are visiting', ['travel to Italy whenever we can', 'copy whatever our closest friends are doing', 'refuse to change our habits when we travel']],
    ];
    const rows = bandRows(level, { lower, middle, upper });
    const [q, answer, ds] = rotate(rows, i);
    const subskill = (level === 'P5' || level === 'P6') ? 'proverb_meaning' : 'proverb_completion';
    const explain = subskill === 'proverb_meaning'
      ? 'A proverb is a piece of advice — match the saying to the situation it describes.'
      : 'Choose the proverb word that completes the saying correctly.';
    return { category: 'proverbsSayings', subskill, q, choices: buildChoices(answer, ds), answer, explain };
  },
  scienceTechTerms(level, i) {
    const p1p2Rows = [
      ['All living things need ___ to survive.', 'water', ['sand', 'metal', 'plastic']],
      ['After hatching from its egg, a young butterfly is called a ___.', 'caterpillar', ['tadpole', 'chick', 'grub']],
      ['The sun gives us heat and ___.', 'light', ['wind', 'water', 'soil']],
      ['We use our ___ to smell things around us.', 'nose', ['tongue', 'ears', 'eyes']],
      ['When water is heated, it turns into ___.', 'steam', ['ice', 'snow', 'rain']],
      ['A tadpole grows into a ___.', 'frog', ['fish', 'lizard', 'turtle']],
      ['Plants need ___ from the soil to grow.', 'nutrients', ['sand', 'petrol', 'paint']],
      ['We can use a ___ to see very small things.', 'microscope', ['telescope', 'compass', 'ruler']],
      ['The force that pulls objects toward the Earth is called ___.', 'gravity', ['friction', 'pressure', 'tension']],
      ['A ___ is used to measure how hot or cold something is.', 'thermometer', ['barometer', 'compass', 'ruler']],
      ['A ___ is a baby cat.', 'kitten', ['puppy', 'chick', 'calf']],
      ['We use our ___ to hear sounds around us.', 'ears', ['eyes', 'nose', 'tongue']],
      ['Plants need ___ from the sun to make their own food.', 'sunlight', ['rainwater', 'soil', 'wind']],
      ['Ice is water that has been ___.', 'frozen', ['boiled', 'dried', 'melted']],
      ['We breathe in ___ to stay alive.', 'air', ['water', 'soil', 'light']],
      ['A ___ spins to show which direction is north.', 'compass', ['ruler', 'clock', 'scale']],
    ];
    const p3p4Rows = [
      ['Plants make food using sunlight through ___.', 'photosynthesis', ['evaporation', 'erosion', 'migration']],
      ['A program used to browse websites is a web ___.', 'browser', ['charger', 'beaker', 'ruler']],
      ['The boiling point of water is measured using a ___.', 'thermometer', ['compass', 'tripod', 'magnet']],
      ['A robot uses sensors to ___ its surroundings.', 'detect', ['decorate', 'defend', 'delay']],
      ['The process of a liquid turning into a gas is called ___.', 'evaporation', ['condensation', 'photosynthesis', 'germination']],
      ['The layer of gases surrounding the Earth is called the ___.', 'atmosphere', ['stratosphere', 'hydrosphere', 'biosphere']],
      ['The continuous movement of water from the Earth\'s surface into the sky as vapour and back again as rain is called the ___.', 'water cycle', ['food chain', 'rock cycle', 'carbon cycle']],
      ['Electricity that builds up on the surface of an object is called ___ electricity.', 'static', ['current', 'magnetic', 'thermal']],
      ['Animals that eat both plants and other animals for food are called ___.', 'omnivores', ['herbivores', 'carnivores', 'decomposers']],
      ['A ___ is a device that converts solar energy into electrical energy.', 'solar panel', ['generator', 'turbine', 'circuit']],
      ['The process by which water vapour cools and turns back into liquid is called ___.', 'condensation', ['evaporation', 'precipitation', 'absorption']],
      ['Animals with a backbone are called ___.', 'vertebrates', ['invertebrates', 'mammals', 'reptiles']],
      ['The type of simple machine that allows a load to be lifted using a wheel and a rope is a ___.', 'pulley', ['lever', 'wedge', 'screw']],
      ['When a solid changes directly into a gas without becoming a liquid first, the process is called ___.', 'sublimation', ['evaporation', 'condensation', 'melting']],
      ['A complete path along which electricity flows is called a ___.', 'circuit', ['magnet', 'current', 'filament']],
      ['The stage of a plant\'s life when a seed starts to grow into a new plant is called ___.', 'germination', ['pollination', 'photosynthesis', 'fertilisation']],
    ];
    const upperRows = [
      ['The study of heredity and genetic variation in living organisms is called ___.', 'genetics', ['genomics', 'taxonomy', 'ecology']],
      ['A ___ is a network of interconnected computers that share information globally.', 'internet', ['intranet', 'server', 'router']],
      ['The process by which rocks are broken down by weather is called ___.', 'weathering', ['erosion', 'sedimentation', 'leaching']],
      ['Data stored in a remote server accessible via the internet is called ___ storage.', 'cloud', ['digital', 'virtual', 'paper']],
      ['The branch of science that studies matter and its interactions with energy is ___.', 'physics', ['chemistry', 'geology', 'biology']],
      ['An organism that breaks down dead material into simpler substances is a ___.', 'decomposer', ['producer', 'consumer', 'predator']],
      ['The use of computer systems to perform tasks that normally require human intelligence is ___.', 'artificial intelligence', ['machine learning', 'data science', 'robotics']],
      ['A ___ is a strand of DNA that carries genetic information.', 'chromosome', ['protein', 'enzyme', 'hormone']],
      ['The study of the structure and history of the Earth is called ___.', 'geology', ['ecology', 'biology', 'meteorology']],
      ['Software that scans a computer for viruses and removes them is called ___.', 'antivirus software', ['firewall', 'operating system', 'browser']],
      ['A ___ is a device that measures the amount of an electric current.', 'ammeter', ['voltmeter', 'thermometer', 'resistor']],
      ['The conversion of light energy to chemical energy in plants is called ___.', 'photosynthesis', ['chemosynthesis', 'bioluminescence', 'catalysis']],
      ['A ___ reaction releases energy in the form of heat and light.', 'combustion', ['reduction', 'oxidation', 'neutralisation']],
      ['The force that opposes the relative motion of two surfaces in contact is ___.', 'friction', ['tension', 'compression', 'pressure']],
      ['A ___ is a chart that shows the elements arranged by atomic number.', 'periodic table', ['chemical equation', 'data table', 'formula chart']],
      ['The use of living organisms or their products in industry is called ___.', 'biotechnology', ['nanotechnology', 'biochemistry', 'genetics']],
    ];
    let rows;
    if (level === 'P1' || level === 'P2') rows = p1p2Rows;
    else if (level === 'P3' || level === 'P4') rows = p3p4Rows;
    else rows = upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'scienceTechTerms', subskill: 'topic_vocabulary', q, choices: buildChoices(answer, ds), answer, explain: 'Use science and technology context clues.' };
  },
  socialStudiesVocab(level, i) {
    const p1p2Rows = [
      ['A person who lives in a place and is part of the community is a ___.', 'resident', ['visitor', 'tourist', 'stranger']],
      ['The place where a family lives together is called a ___.', 'home', ['shelter', 'dormitory', 'retreat']],
      ['People who help others in the community are called ___.', 'volunteers', ['tourists', 'inspectors', 'merchants']],
      ['The person in charge of a school is called the ___.', 'principal', ['teacher', 'counsellor', 'librarian']],
      ['A rule made by the government that everyone in the country must follow is called a ___.', 'law', ['suggestion', 'guideline', 'request']],
      ['The person who leads the government of Singapore is called the ___.', 'Prime Minister', ['mayor', 'principal', 'captain']],
      ['People who move to a new country to live are called ___.', 'immigrants', ['tourists', 'travellers', 'diplomats']],
      ['A person who patrols the neighbourhood and catches people who break the law is a ___.', 'police officer', ['firefighter', 'doctor', 'teacher']],
      ['The building where a country\'s government meets is called the ___.', 'parliament', ['court', 'embassy', 'town hall']],
      ['A large town where many people live and work is called a ___.', 'city', ['village', 'estate', 'suburb']],
      ['A person who puts out fires to keep the community safe is a ___.', 'firefighter', ['teacher', 'sailor', 'pilot']],
      ['The place where people go to borrow books for free is called a ___.', 'library', ['stadium', 'market', 'clinic']],
      ['The flag of our country is a national ___.', 'symbol', ['food', 'sport', 'song']],
      ['A person who delivers letters and packages to your home is a ___.', 'postman', ['driver', 'guard', 'vendor']],
      ['The money that the government collects from workers to pay for services is called ___.', 'tax', ['fees', 'fines', 'wages']],
      ['A place in the neighbourhood where sick people can see a doctor is a ___.', 'clinic', ['temple', 'mosque', 'stadium']],
    ];
    const p3p4Rows = [
      ['People choose leaders during an ___.', 'election', ['excursion', 'eruption', 'equation']],
      ['A person who belongs to a country is a ___.', 'citizen', ['chemist', 'captain', 'carpenter']],
      ['Rules made by the government are called ___.', 'laws', ['drawings', 'lanes', 'ladders']],
      ['Helping at a food drive is a form of ___.', 'volunteering', ['calculating', 'whispering', 'postponing']],
      ['A government that is chosen by the people through voting is a ___.', 'democracy', ['monarchy', 'autocracy', 'theocracy']],
      ['The process of bringing goods into a country from abroad is called ___.', 'importing', ['exporting', 'trading', 'distributing']],
      ['An area that is controlled and managed by a foreign country is called a ___.', 'colony', ['territory', 'province', 'nation']],
      ['A formal agreement between countries to trade freely is a ___ agreement.', 'free trade', ['diplomatic', 'cultural', 'security']],
      ['The duty of citizens to obey the laws and contribute to society is called ___.', 'civic responsibility', ['social obligation', 'moral duty', 'legal practice']],
      ['The system of rules that governs a country is called the ___.', 'constitution', ['statute', 'legislation', 'ordinance']],
      ['A group of countries in Southeast Asia that work together is called ___.', 'ASEAN', ['NATO', 'UNESCO', 'APEC']],
      ['The person who represents their country in another country is called an ___.', 'ambassador', ['inspector', 'accountant', 'engineer']],
      ['The process of selling goods made in Singapore to other countries is called ___.', 'exporting', ['importing', 'distributing', 'recycling']],
      ['A person who is born in a country or who has been given the rights of belonging to that country is a ___.', 'citizen', ['resident', 'tourist', 'migrant']],
      ['The principle of treating all people fairly and equally, regardless of their background, is called ___.', 'equality', ['diversity', 'harmony', 'loyalty']],
      ['The government department responsible for collecting taxes in Singapore is called the ___.', 'IRAS', ['MAS', 'CPF', 'HDB']],
    ];
    const upperRows = [
      ['The expansion of connections between countries through trade and communication is called ___.', 'globalisation', ['urbanisation', 'industrialisation', 'migration']],
      ['A binding agreement between two countries signed by their leaders is a ___.', 'treaty', ['memorandum', 'charter', 'protocol']],
      ['The movement of people from rural areas to cities is called ___.', 'urbanisation', ['migration', 'industrialisation', 'globalisation']],
      ['Goods and services produced in a country and sold abroad are called ___.', 'exports', ['imports', 'commodities', 'tariffs']],
      ['Aid given to people suffering after a disaster or conflict is called ___ relief.', 'humanitarian', ['commercial', 'ceremonial', 'industrial']],
      ['Buildings and customs passed down from earlier generations are a country\'s ___.', 'heritage', ['scenery', 'territory', 'machinery']],
      ['The idea that every person has basic rights simply by being human is called ___.', 'human rights', ['civil liberties', 'legal rights', 'civil rights']],
      ['The belief that the interests of one\'s own nation come before those of all other nations is ___.', 'nationalism', ['protectionism', 'isolationism', 'globalism']],
      ['Living together peacefully despite different races and religions is called racial ___.', 'harmony', ['balance', 'silence', 'variety']],
      ['Protecting forests, reefs and wildlife from damage is called ___.', 'conservation', ['construction', 'consumption', 'convention']],
      ['Producing enough of something to meet your own needs is called ___.', 'self-sufficiency', ['self-discipline', 'self-confidence', 'self-expression']],
      ['The early settlers who built up Singapore\'s trade and industry are called ___.', 'pioneers', ['tourists', 'spectators', 'inspectors']],
      ['The upholding of what is right and the punishment of wrongdoing through the law is called ___.', 'justice', ['equality', 'fairness', 'democracy']],
      ['The right of a country to govern itself without interference from others is called ___.', 'sovereignty', ['democracy', 'diplomacy', 'citizenship']],
      ['Creating new land by filling in part of the sea is called land ___.', 'reclamation', ['formation', 'decoration', 'donation']],
      ['A system in which people advance according to their own effort and ability is called ___.', 'meritocracy', ['monarchy', 'bureaucracy', 'democracy']],
    ];
    let rows;
    if (level === 'P1' || level === 'P2') rows = p1p2Rows;
    else if (level === 'P3' || level === 'P4') rows = p3p4Rows;
    else rows = upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'socialStudiesVocab', subskill: 'civics_terms', q, choices: buildChoices(answer, ds), answer, explain: 'Use social studies context to identify vocabulary.' };
  },
  bodyPartsAnimals(level, i) {
    const p1p2Rows = [
      ['The bird dipped its ___ into the pond to drink water.', 'beak', ['wing', 'claws', 'feathers']],
      ['The farmer brushed the horse\'s ___ with a comb.', 'mane', ['fur', 'fleece', 'wool']],
      ['The cat scratched the door with its sharp ___.', 'claws', ['paws', 'wings', 'beak']],
      ['The fish moved its ___ to swim through the water.', 'fins', ['paws', 'legs', 'feathers']],
      ['The elephant lifted the log with its long ___.', 'trunk', ['horn', 'tail', 'paw']],
      ['The peacock spread its colourful ___ to show off.', 'feathers', ['scales', 'fur', 'fins']],
      ['The snake moved silently by wriggling its ___.', 'body', ['fins', 'wings', 'claws']],
      ['The deer had sharp, branching ___ growing from its head.', 'antlers', ['tusks', 'horns', 'spines']],
      ['The tortoise retreated into its hard ___ when frightened.', 'shell', ['scales', 'pouch', 'skin']],
      ['The kangaroo carried its joey safely in its ___.', 'pouch', ['shell', 'skin', 'mane']],
      ['The shark sliced through the water using its powerful ___.', 'tail fin', ['front legs', 'gills', 'flippers']],
      ['The frog pushed itself off the lily pad using its strong ___.', 'hind legs', ['fins', 'claws', 'wings']],
      ['The rabbit twitched its long ___ to listen for danger.', 'ears', ['whiskers', 'paws', 'tails']],
      ['The crab pinched the fishing net with its strong ___.', 'pincers', ['fins', 'hooves', 'wings']],
      ['The goat butted the fence with its hard ___.', 'horns', ['antlers', 'tusks', 'hooves']],
      ['The walrus dug for shellfish using its two long ___.', 'tusks', ['horns', 'antlers', 'fangs']],
      ['The horse trotted along the track on its hard ___.', 'hooves', ['paws', 'claws', 'fins']],
      ['The cat used its ___ to feel its way through the narrow gap.', 'whiskers', ['eyelashes', 'ears', 'paws']],
      ['The eagle grabbed the fish with its sharp ___.', 'talons', ['wings', 'fins', 'feathers']],
      ['The camel stores fat in the ___ on its back.', 'hump', ['horn', 'shell', 'pouch']],
    ];
    const p3UpperRows = [
      ['As the egret waded silently through the shallows, it dipped its long ___ into the water and emerged with a wriggling fish.', 'beak', ['wing', 'claws', 'feathers']],
      ['The zookeeper demonstrated how to care for the horse by carefully combing its thick, golden ___ to remove tangles.', 'mane', ['fur', 'fleece', 'wool']],
      ['The climber watched nervously as the leopard extended its razor-sharp ___ and gripped the bark of the tree overhead.', 'claws', ['paws', 'wings', 'beak']],
      ['In the aquarium, the clownfish darted between the coral by rippling its brightly coloured ___ with remarkable precision.', 'fins', ['paws', 'legs', 'feathers']],
      ['During the drought, the elephant used its flexible ___ to suck up water from the muddy riverbed and spray it over its body.', 'trunk', ['horn', 'tail', 'paw']],
      ['Although the peacock\'s brilliant blue-green ___ are spectacular, they make it harder for the bird to escape from predators.', 'feathers', ['scales', 'fur', 'fins']],
      ['To avoid being detected, the grass snake pressed its scaled ___ flat against the ground and lay perfectly still among the leaves.', 'body', ['fins', 'wings', 'claws']],
      ['Two male deer locked ___ during the mating season, pushing against each other for several minutes to establish dominance.', 'antlers', ['tusks', 'horns', 'spines']],
      ['When the tortoise sensed danger approaching, it withdrew its head and all four limbs into its tough, dome-shaped ___.', 'shell', ['scales', 'pouch', 'skin']],
      ['The mother kangaroo carefully lowered her tiny joey into the warmth of her ___ as the evening temperature began to drop sharply.', 'pouch', ['shell', 'skin', 'mane']],
      ['Scientists studying sharks discovered that the powerful ___ propels the animal forward at speeds exceeding fifty kilometres per hour.', 'tail fin', ['front legs', 'gills', 'flippers']],
      ['The frog waited motionless on the bank before pushing off with its muscular ___ and launching itself into the stream below.', 'hind legs', ['fins', 'claws', 'wings']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : p3UpperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'bodyPartsAnimals', subskill: 'animal_part_name', q, choices: buildChoices(answer, ds), answer, explain: 'Different animals have different body parts. Match the part to the animal.' };
  },
  collectiveNouns(level, i) {
    const p1p2Rows = [
      ['We saw a ___ of elephants in the jungle.', 'herd', ['flock', 'school', 'pack']],
      ['A ___ of monkeys stole food from the shops.', 'troop', ['pack', 'army', 'flock']],
      ['A ___ of birds flew across the sky at sunset.', 'flock', ['herd', 'pack', 'school']],
      ['To while away time, we played with a ___ of cards.', 'pack', ['box', 'pile', 'heap']],
      ['My aunt Jemima always wears a ___ of pearls round her neck.', 'string', ['group', 'line', 'bunch']],
      ['Bill finished a whole ___ of ice-cream on his own.', 'tub', ['flock', 'loaf', 'slice']],
      ['A ___ of fish swam past the diver.', 'school', ['flock', 'herd', 'pack']],
      ['Mrs Lee bought a ___ of milk from the supermarket.', 'carton', ['bowl', 'tub', 'tray']],
      ['A ___ of wolves howled in the forest at night.', 'pack', ['flock', 'herd', 'troop']],
      ['A ___ of bees buzzed around the hive near our garden.', 'swarm', ['flock', 'school', 'herd']],
      ['The children found a ___ of kittens behind the shed.', 'litter', ['pack', 'nest', 'flock']],
      ['The ranger spotted a ___ of lions resting under a tree.', 'pride', ['pack', 'herd', 'troop']],
      ['Grandma gave me a ___ of grapes to share with my cousins.', 'bunch', ['pile', 'loaf', 'sheet']],
      ['Mum asked me to fetch a ___ of eggs from the provision shop.', 'tray', ['bowl', 'cup', 'stack']],
      ['We watched a ___ of ants carry crumbs across the pavement.', 'colony', ['herd', 'flock', 'school']],
      ['The dancer wore a ___ of flowers in her hair on stage.', 'garland', ['bundle', 'row', 'stack']],
      ['A ___ of stairs led up to the old lighthouse.', 'flight', ['row', 'line', 'ladder']],
      ['A ___ of ships sailed into the harbour for the naval display.', 'fleet', ['herd', 'flock', 'pack']],
      ['The choir sang while a ___ of dancers performed on stage.', 'troupe', ['crew', 'gang', 'band']],
      ['Mum bought a ___ of bread from the bakery.', 'loaf', ['slice', 'bar', 'block']],
    ];
    const p3UpperRows = [
      ['Park rangers reported that a ___ of over two hundred elephants had crossed the river overnight during the annual migration.', 'herd', ['flock', 'school', 'pack']],
      ['Villagers were alarmed when a ___ of macaques descended from the hillside and raided their fruit trees at dawn.', 'troop', ['pack', 'army', 'flock']],
      ['The pilot radioed the control tower after spotting a large ___ of birds flying directly into the aircraft\'s flight path.', 'flock', ['herd', 'pack', 'school']],
      ['Dad kept the spare ___ of cards in the drawer, ready to bring out for family game nights after dinner.', 'pack', ['box', 'pile', 'heap']],
      ['My grandmother treasured the antique ___ of pearls that had been passed down through three generations of our family.', 'string', ['group', 'line', 'bunch']],
      ['To everyone\'s amusement, he finished an entire ___ of ice cream during the film without offering a single spoonful to anyone.', 'tub', ['flock', 'loaf', 'slice']],
      ['Divers swimming above the coral reef were surrounded by a shimmering ___ of sardines that moved together like one glittering cloud.', 'school', ['flock', 'herd', 'pack']],
      ['The teacher collected a ___ of milk from the canteen to distribute among the pupils during their morning nutrition break.', 'carton', ['bowl', 'tub', 'tray']],
      ['A ___ of wolves had been tracking the injured deer through the snow for several hours before finally cornering it near the ravine.', 'pack', ['flock', 'herd', 'troop']],
      ['Scientists warned that a ___ of locusts stretching over thirty kilometres was moving rapidly towards the farmlands to the north.', 'swarm', ['flock', 'colony', 'herd']],
      ['The vet examined each puppy in the ___ carefully before confirming that all six were healthy and ready for adoption.', 'litter', ['pack', 'nest', 'flock']],
      ['A documentary filmmaker spent three months photographing a ___ of lions hunting prey across the open plains of East Africa.', 'pride', ['pack', 'herd', 'troop']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : p3UpperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'collectiveNouns', subskill: 'collective_noun', q, choices: buildChoices(answer, ds), answer, explain: 'Each group of animals, threaded objects or container uses its own special collective word.' };
  },
  placeNouns(level, i) {
    const p1p2Rows = [
      ['Mrs Lee bought a loaf of bread and some buns from the ___.', 'bakery', ['kitchen', 'canteen', 'restaurant']],
      ['I was feeling ill, so I visited a ___ to see a doctor.', 'clinic', ['shop', 'bakery', 'sickbay']],
      ['It is hot and dry in the ___ where few plants can survive.', 'desert', ['forest', 'jungle', 'reservoir']],
      ['Everyone rushed towards the ___ of the building to escape from the fire.', 'exit', ['entrance', 'lobby', 'corridor']],
      ['We borrowed storybooks from the school ___.', 'library', ['canteen', 'office', 'hall']],
      ['Mum stopped at the ___ to fill the car with petrol.', 'petrol station', ['bus stop', 'taxi stand', 'workshop']],
      ['We watched a movie at the ___ last weekend.', 'cinema', ['library', 'studio', 'gallery']],
      ['Thousands of fans cheered at the National ___ during the football final.', 'stadium', ['library', 'court', 'garage']],
      ['Passengers board and alight from planes at the ___.', 'airport', ['harbour', 'station', 'garage']],
      ['Scientists conduct experiments in a ___.', 'laboratory', ['workshop', 'studio', 'office']],
      ['Patients stay overnight to recover after surgery in a ___.', 'hospital ward', ['clinic room', 'pharmacy', 'surgery']],
      ['Trees are felled and timber is processed at a ___.', 'sawmill', ['quarry', 'foundry', 'warehouse']],
      ['We fed the goats and ponies at the ___ during our school trip.', 'farm', ['orchard', 'market', 'nursery']],
      ['Ships load and unload their cargo at the ___.', 'harbour', ['airport', 'station', 'depot']],
      ['We watched sharks swim above us in the glass tunnel at the ___.', 'aquarium', ['reservoir', 'museum', 'planetarium']],
      ['Old paintings and sculptures are displayed at the ___.', 'museum', ['library', 'cinema', 'studio']],
      ['Dad parked the car in the ___ below our block.', 'car park', ['garage', 'driveway', 'workshop']],
      ['The gardener bought young plants from the ___.', 'nursery', ['orchard', 'meadow', 'field']],
      ['The players changed into their jerseys in the ___ before the match.', 'changing room', ['classroom', 'store room', 'staff room']],
      ['Fresh fish and vegetables are sold at the wet ___.', 'market', ['mall', 'shop', 'stall']],
    ];
    const p3UpperRows = [
      ['Every Saturday morning, our family stops at the neighbourhood ___ to collect freshly baked sourdough loaves and almond croissants.', 'bakery', ['kitchen', 'canteen', 'restaurant']],
      ['Mum brought Kai to the ___ after he complained of a persistent headache that had not improved despite resting through the afternoon.', 'clinic', ['shop', 'bakery', 'sickbay']],
      ['Researchers studying how animals survive in extreme conditions travelled to the Sahara ___, where daytime temperatures can exceed fifty degrees Celsius.', 'desert', ['forest', 'jungle', 'reservoir']],
      ['The crowd was directed towards the nearest ___ when the fire alarm sounded, and security ensured that no one was left behind in the building.', 'exit', ['entrance', 'lobby', 'corridor']],
      ['Mrs Tan encouraged us to explore the school ___ during recess to discover new titles in the recently updated reading corner on the second floor.', 'library', ['canteen', 'office', 'hall']],
      ['Dad pulled into the ___ along the expressway to top up the fuel tank and check the tyre pressure before our long drive north.', 'petrol station', ['bus stop', 'taxi stand', 'workshop']],
      ['Although they had watched the trailer many times, nothing prepared them for how spectacular the special effects appeared on the huge ___ screen.', 'cinema', ['theatre', 'studio', 'gallery']],
      ['The ___ was packed with over fifty thousand fans who had waited years to see their favourite team compete in an international final.', 'stadium', ['gymnasium', 'court', 'arena']],
      ['Passengers arriving at the ___ were reminded to collect their luggage from the correct carousel and proceed through customs without delay.', 'airport', ['harbour', 'station', 'garage']],
      ['The students visited the university ___ and observed researchers using electron microscopes to examine the detailed structure of plant cells.', 'laboratory', ['workshop', 'studio', 'office']],
      ['The volunteers spent their afternoon reading to elderly patients in the ___, lifting their spirits with stories and friendly conversation.', 'hospital ward', ['clinic room', 'pharmacy', 'surgery']],
      ['Logs from the sustainable plantation were transported to the ___, where they were cut into planks and treated before being used for furniture production.', 'sawmill', ['quarry', 'foundry', 'warehouse']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : p3UpperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'placeNouns', subskill: 'place_name', q, choices: buildChoices(answer, ds), answer, explain: 'Each place has a special name that tells us what people do there.' };
  },
  actionVerbs(level, i) {
    // Review 2026-10-08: every option explained. Distractors that also made
    // a true sentence were replaced ("mopped the table with a cloth", "the
    // monkey crawled from branch to branch", "the professor marched into the
    // wrong hall"), or the stem gained the clue that rules them out ("as if
    // they were skating", "through the air", "slowly").
    const p1p2Rows = [
      ['Our pet dog ___ its tail excitedly when it sees us.', 'wags', ['flaps', 'waves', 'shakes'], {
        'wags': '"Wags" is right — a dog wags its tail when it moves it quickly from side to side because it is happy.',
        'flaps': '"Flaps" is for wings or a flag moving up and down. A dog\'s tail wags.',
        'waves': 'We wave our hands to say hello. For a dog\'s tail, we say "wags".',
        'shakes': 'A dog shakes its whole body to dry off. For the tail, we say "wags".',
      }],
      ['Gail ___ the dirty table with a cloth.', 'wiped', ['sliced', 'poured', 'stacked'], {
        'wiped': '"Wiped" is right — you wipe a table when you rub it with a cloth to clean it.',
        'sliced': '"Sliced" means cut with a knife. You cannot clean a table by slicing it.',
        'poured': '"Poured" is for water or juice coming out of a jug. You cannot pour a table.',
        'stacked': '"Stacked" means put things on top of each other. That does not clean a table.',
      }],
      ['No one saw the burglar ___ into the house when night fell.', 'sneaking', ['stomping', 'strolling', 'marching'], {
        'sneaking': '"Sneaking" is right — it means moving quietly so no one sees you, just what a burglar does.',
        'stomping': '"Stomping" means walking with loud, heavy steps. That would wake everyone up.',
        'strolling': '"Strolling" means walking slowly for fun, like in a park. A burglar is trying to hide.',
        'marching': '"Marching" means walking with big, loud steps, like soldiers. A burglar wants to be quiet.',
      }],
      ['"Look at that caterpillar ___ on the branch!" Joe said.', 'crawling', ['sliding', 'trotting', 'flying'], {
        'crawling': '"Crawling" is right — a caterpillar moves slowly along on its many little legs.',
        'sliding': '"Sliding" means moving smoothly over something slippery, like ice. A caterpillar walks with its legs.',
        'trotting': '"Trotting" is how a horse runs. A caterpillar is far too small and slow.',
        'flying': '"Flying" needs wings. A caterpillar has no wings yet — it gets them when it becomes a butterfly.',
      }],
      ['Betsy let out a scream when the snake ___ towards her.', 'slithered', ['hopped', 'galloped', 'waddled'], {
        'slithered': '"Slithered" is right — a snake has no legs, so it slides along the ground by twisting its body.',
        'hopped': '"Hopped" means jumped along, like a rabbit. A snake has no legs.',
        'galloped': '"Galloped" is how a horse runs fast. A snake has no legs.',
        'waddled': '"Waddled" is how a duck walks, rocking from side to side. A snake has no legs.',
      }],
      ['Little Sophie went missing as she had ___ off on her own.', 'wandered', ['galloped', 'travelled', 'slithered'], {
        'wandered': '"Wandered" is right — it means walked about without knowing where you are going. That is how a child gets lost.',
        'galloped': '"Galloped" is how a horse runs fast. A little girl walks.',
        'travelled': '"Travelled" means went on a journey, like to another country. A child who gets lost has wandered off.',
        'slithered': '"Slithered" is how a snake moves. A little girl walks.',
      }],
      ['The vase ___ when it hit the floor.', 'shattered', ['exploded', 'burst', 'melted'], {
        'shattered': '"Shattered" is right — it means broke into many small pieces, like a vase does when it falls.',
        'exploded': '"Exploded" means blew apart with a loud bang, like fireworks. A vase does not do that.',
        'burst': '"Burst" is what a balloon or a bubble does when it pops. A vase breaks.',
        'melted': '"Melted" means turned soft and runny from heat, like ice cream. Hitting the floor does not melt a vase.',
      }],
      ['The chef ___ the eggs in a bowl before pouring them into the pan.', 'whisked', ['poured', 'sliced', 'fried'], {
        'whisked': '"Whisked" is right — it means stirred very fast to mix, which is what you do to eggs in a bowl.',
        'poured': 'The pouring comes later ("before pouring them"). First the chef did something else to the eggs.',
        'sliced': '"Sliced" means cut into pieces with a knife. You cannot slice runny eggs.',
        'fried': '"Fried" means cooked in a hot pan. These eggs were still in a bowl, not in the pan yet.',
      }],
      ['Anna ___ a cup of hot tea slowly so as not to burn her tongue.', 'sipped', ['gulped', 'chewed', 'spilled'], {
        'sipped': '"Sipped" is right — it means drank in tiny amounts, which stops you burning your tongue.',
        'gulped': '"Gulped" means drank quickly in big mouthfuls. That is the opposite of "slowly".',
        'chewed': '"Chewed" is what you do with food, not with a drink.',
        'spilled': '"Spilled" means let it fall out of the cup by mistake. Then she would not be drinking it.',
      }],
      ['The puppy ___ at the ball and knocked it across the room.', 'pounced', ['yawned', 'sniffed', 'blinked'], {
        'pounced': '"Pounced" is right — it means jumped on something suddenly. That is how the puppy knocked the ball away.',
        'yawned': '"Yawned" means opened its mouth wide because it was tired. That would not knock a ball.',
        'sniffed': '"Sniffed" means smelled something. Smelling a ball would not knock it across the room.',
        'blinked': '"Blinked" means shut and opened its eyes quickly. That would not move a ball.',
      }],
      ['He ___ the wet shirt on the bamboo pole to dry.', 'hung', ['ironed', 'folded', 'dropped'], {
        'hung': '"Hung" is right — we hang wet clothes up on a pole or line so they can dry.',
        'ironed': '"Ironed" means made smooth with a hot iron. We iron clothes after they are dry.',
        'folded': '"Folded" means made into a neat pile. A folded wet shirt would not dry well.',
        'dropped': '"Dropped" means let it fall by accident. That would not help it dry.',
      }],
      ['She ___ the heavy bag over her shoulders before setting off.', 'hoisted', ['emptied', 'unzipped', 'dropped'], {
        'hoisted': '"Hoisted" is right — it means lifted something heavy up, here onto her shoulders.',
        'emptied': '"Emptied" means took everything out. Then the bag would not be heavy.',
        'unzipped': '"Unzipped" means opened the zip. That does not put a bag over your shoulders.',
        'dropped': '"Dropped" means let it fall. That is the opposite of lifting it onto her shoulders.',
      }],
      ['Tom ___ the crumpled paper into the bin from across the room.', 'tossed', ['lifted', 'folded', 'pushed'], {
        'tossed': '"Tossed" is right — it means threw lightly. "From across the room" tells us the paper flew through the air.',
        'lifted': '"Lifted" means picked up. It cannot get the paper into a bin far away.',
        'folded': '"Folded" means bent into a smaller shape. It does not move the paper into the bin.',
        'pushed': '"Pushed" means moved it with your hand. From across the room, Tom could not reach the bin.',
      }],
      ['The baby ___ the toy tightly and would not let go.', 'clutched', ['tapped', 'patted', 'poked'], {
        'clutched': '"Clutched" is right — it means held on very tightly, just like "would not let go".',
        'tapped': '"Tapped" means touched quickly and lightly. That is not holding on.',
        'patted': '"Patted" means touched gently with a flat hand. That is not holding on.',
        'poked': '"Poked" means pushed with a finger. That is not holding on.',
      }],
      ['Mum ___ the pancake high into the air with the frying pan.', 'flipped', ['rolled', 'stirred', 'spread'], {
        'flipped': '"Flipped" is right — it means made it jump up and turn over, which is how you cook the other side of a pancake.',
        'rolled': '"Rolled" means turned over and over along a flat place. It would not go high into the air.',
        'stirred': '"Stirred" means moved a spoon round and round in a pot. You cannot stir a pancake into the air.',
        'spread': '"Spread" means made something flat and thin, like butter on bread. It would not go into the air.',
      }],
      ['The children ___ across the icy floor in their socks, as if they were skating.', 'slid', ['hopped', 'stamped', 'marched'], {
        'slid': '"Slid" is right — it means moved smoothly over something slippery. "As if they were skating" tells us their feet glided.',
        'hopped': '"Hopped" means jumped along. Skating is smooth, not bouncy.',
        'stamped': '"Stamped" means put feet down hard and loud. Skating is smooth and gliding.',
        'marched': '"Marched" means walked with big steps, like soldiers. Skating is smooth and gliding.',
      }],
      ['She ___ the stamps carefully onto the envelope.', 'stuck', ['wrote', 'clipped', 'folded'], {
        'stuck': '"Stuck" is right — stamps have glue on the back, so you stick them onto an envelope.',
        'wrote': '"Wrote" is for words, like the address. You do not write stamps.',
        'clipped': '"Clipped" means held with a clip. Stamps are sticky, so they do not need a clip.',
        'folded': '"Folded" means bent over. You do not fold stamps onto an envelope.',
      }],
      ['The monkey ___ from branch to branch high above us.', 'swung', ['swam', 'waddled', 'slithered'], {
        'swung': '"Swung" is right — a monkey holds a branch with its arms and moves through the air to the next one.',
        'swam': '"Swam" means moved through water. The monkey was up in the trees.',
        'waddled': '"Waddled" is how a duck walks. A monkey high in the trees swings.',
        'slithered': '"Slithered" is how a snake moves. A monkey uses its arms to swing.',
      }],
      ['Grandpa ___ the seeds evenly over the freshly dug soil.', 'scattered', ['piled', 'buried', 'stacked'], {
        'scattered': '"Scattered" is right — it means threw them so they landed all over. "Evenly over the soil" tells us they spread out.',
        'piled': '"Piled" means put them all in one heap. That is not "evenly over" the soil.',
        'buried': '"Buried" means put under the ground. "Over" the soil tells us the seeds were on top.',
        'stacked': '"Stacked" means put them neatly on top of each other. Seeds spread "evenly over" the soil are not stacked.',
      }],
      ['The goalkeeper ___ through the air across the goal to stop the ball.', 'dived', ['stepped', 'walked', 'turned'], {
        'dived': '"Dived" is right — it means jumped forward through the air, which is how a goalkeeper reaches the ball.',
        'stepped': '"Stepped" means moved one foot. You cannot step "through the air".',
        'walked': '"Walked" keeps your feet on the ground. "Through the air" tells us the goalkeeper jumped.',
        'turned': '"Turned" means faced another way. It does not carry you through the air across the goal.',
      }],
    ];
    const p3UpperRows = [
      ['The golden retriever ___ its tail so vigorously when it recognises its owner\'s car in the driveway that its whole body shakes.', 'wags', ['flaps', 'waves', 'shakes'], {
        'wags': '"Wags" is right — it is the precise verb for a dog moving its tail quickly from side to side.',
        'flaps': '"Flaps" is for wings or a flag moving up and down. A tail wags.',
        'waves': 'We wave a hand or a flag. The precise verb for a dog\'s tail is "wags".',
        'shakes': '"Shakes" is already used later in the sentence for the whole body. The tail itself wags.',
      }],
      ['After the experiment, the laboratory assistant carefully ___ the bench clean with a damp cloth so that no chemicals were left behind.', 'wiped', ['sliced', 'poured', 'stacked'], {
        'wiped': '"Wiped" is right — you wipe a surface clean by rubbing it with a cloth.',
        'sliced': '"Sliced" means cut with a knife. It does not clean a bench.',
        'poured': '"Poured" is for a liquid flowing out of a container. You cannot pour a bench clean with a cloth.',
        'stacked': '"Stacked" means piled things up. It does not clean a bench.',
      }],
      ['Security footage showed a figure ___ through the emergency exit while the guard was occupied at the front desk.', 'sneaking', ['stomping', 'strolling', 'marching'], {
        'sneaking': '"Sneaking" is right — it means moving secretly. "While the guard was occupied" shows the figure waited until no one was watching.',
        'stomping': '"Stomping" means walking with loud, heavy steps — the opposite of trying not to be noticed.',
        'strolling': '"Strolling" means walking in a relaxed way. Waiting until the guard was busy shows the figure was trying to hide.',
        'marching': '"Marching" means walking with firm, regular steps, like a soldier. It does not suggest secrecy.',
      }],
      ['The nature photographer spent three hours flat on the ground, watching a caterpillar ___ along the underside of a broad leaf.', 'crawling', ['sliding', 'trotting', 'flying'], {
        'crawling': '"Crawling" is right — a caterpillar moves slowly on its many short legs, close to the surface.',
        'sliding': '"Sliding" means gliding over a slippery surface without stepping. A caterpillar grips with its legs.',
        'trotting': '"Trotting" is a horse\'s quick, bouncing run. A caterpillar is small and slow.',
        'flying': '"Flying" needs wings. A caterpillar only gets wings after it becomes a butterfly or a moth.',
      }],
      ['The python ___ through the underbrush with barely a rustle, keeping its eyes fixed on the unsuspecting prey ahead.', 'slithered', ['hopped', 'galloped', 'waddled'], {
        'slithered': '"Slithered" is right — it means slid along by twisting the body, the way a legless snake moves.',
        'hopped': '"Hopped" means jumped along on legs, like a rabbit. A python has no legs.',
        'galloped': '"Galloped" is a horse\'s fastest run. A python has no legs.',
        'waddled': '"Waddled" means walked with short, rocking steps, like a duck. A python has no legs.',
      }],
      ['The elderly professor ___ into the wrong lecture hall and had begun speaking for several minutes before anyone dared to interrupt.', 'wandered', ['slithered', 'galloped', 'travelled'], {
        'wandered': '"Wandered" is right — it means walked without a clear purpose, which explains how he ended up in the wrong hall.',
        'slithered': '"Slithered" is how a snake moves. A professor walks.',
        'galloped': '"Galloped" is a horse\'s fastest run. It does not describe a person walking into a room.',
        'travelled': '"Travelled" means made a journey, often a long one. Walking into a room is not a journey.',
      }],
      ['The ancient vase ___ when it fell from the display case, scattering fragments across the polished museum floor.', 'shattered', ['exploded', 'burst', 'melted'], {
        'shattered': '"Shattered" is right — it means broke suddenly into many pieces, and "scattering fragments" confirms it.',
        'exploded': '"Exploded" means blew apart from a force inside, like fireworks. A falling vase breaks from the impact.',
        'burst': '"Burst" means split open from pressure inside, like a balloon or a pipe. A vase breaks from hitting the floor.',
        'melted': '"Melted" means turned to liquid in heat. A fall does not melt a vase.',
      }],
      ['The pastry chef ___ the egg whites until they formed stiff peaks, then folded them gently into the cake mixture.', 'whisked', ['poured', 'sliced', 'fried'], {
        'whisked': '"Whisked" is right — beating egg whites fast with a whisk traps air until they form stiff peaks.',
        'poured': '"Poured" makes a liquid flow out. Pouring egg whites would never make stiff peaks.',
        'sliced': '"Sliced" means cut into thin pieces. Raw egg whites are runny and cannot be sliced.',
        'fried': '"Fried" means cooked in hot oil. Fried egg whites could not be folded into a cake mixture.',
      }],
      ['She slowly ___ her chamomile tea in silence, reading through the final draft of her speech one last time before the ceremony.', 'sipped', ['gulped', 'chewed', 'spilled'], {
        'sipped': '"Sipped" is right — it means drank in small mouthfuls, which suits "slowly" and her quiet, careful mood.',
        'gulped': '"Gulped" means swallowed quickly in large mouthfuls — the opposite of "slowly".',
        'chewed': '"Chewed" is for food. Tea is a drink.',
        'spilled': '"Spilled" means let it fall out by accident. Then she would not be drinking it.',
      }],
      ['The cheetah ___ on the gazelle with breathtaking speed, ending a chase that had stretched nearly four hundred metres across the plain.', 'pounced', ['yawned', 'snapped', 'dashed'], {
        'pounced': '"Pounced" is right — it means sprang suddenly onto prey. We say a hunter "pounced on" its prey.',
        'yawned': '"Yawned" means opened its mouth wide from tiredness. It does not end a chase.',
        'snapped': '"Snapped" means bit quickly with its jaws. We say "snapped at", not "snapped on", and it is not a leap.',
        'dashed': '"Dashed" means ran quickly, but we say "dashed towards", not "dashed on". The leap that ends a chase is "pounced on".',
      }],
      ['Workers ___ the elaborate festival decorations across the entire length of the street, transforming it in preparation for the night\'s celebration.', 'hung', ['buried', 'swept', 'dropped'], {
        'hung': '"Hung" is right — decorations are hung up high so they stretch across the street.',
        'buried': '"Buried" means put under the ground. Buried decorations could not transform the street.',
        'swept': '"Swept" means cleaned with a broom. You do not sweep decorations into place.',
        'dropped': '"Dropped" means let fall. Dropped decorations would not stretch across the street.',
      }],
      ['The mountaineers ___ their packs onto their backs and began the steep ascent before sunrise, hoping to reach the summit by noon before the clouds moved in.', 'hoisted', ['emptied', 'unzipped', 'dropped'], {
        'hoisted': '"Hoisted" is right — it means lifted something heavy up, here onto their backs.',
        'emptied': '"Emptied" means took everything out. That does not put a pack on your back.',
        'unzipped': '"Unzipped" means opened the zip. That does not put a pack on your back.',
        'dropped': '"Dropped" means let fall — the opposite of lifting a pack onto your back.',
      }],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : p3UpperRows;
    const [q, answer, ds, optionExplanations] = rotate(rows, i);
    return { category: 'actionVerbs', subskill: 'action_verb', q, choices: buildChoices(answer, ds), answer, explain: 'Each action has a precise verb — pick the one that matches the movement, speed and surface.', optionExplanations };
  },
  soundVerbs(level, i) {
    const p1p2Rows = [
      ['Every morning, I can hear birds ___ outside my window.', 'chirping', ['humming', 'mooing', 'barking']],
      ['I heard an owl ___ in the woods just now.', 'screech', ['chirp', 'howl', 'crow']],
      ['People believe that wolves like to ___ at the moon.', 'howl', ['bark', 'roar', 'growl']],
      ['The crow flew in and began to ___ loudly.', 'caw', ['chirp', 'squawk', 'screech']],
      ['Gabriel let out a ___ when he saw his huge pile of homework.', 'sigh', ['roar', 'hum', 'squeal']],
      ['The lion ___ loudly, frightening the visitors at the zoo.', 'roared', ['barked', 'meowed', 'squeaked']],
      ['Bees were ___ near the flowers in our garden.', 'buzzing', ['barking', 'roaring', 'crowing']],
      ['The puppy ___ when it heard the doorbell ring.', 'barked', ['mewed', 'roared', 'hooted']],
      ['The snake made a loud ___ sound when it felt threatened.', 'hissing', ['buzzing', 'chirping', 'hooting']],
      ['The horse ___ and reared up when it heard the thunderclap.', 'neighed', ['brayed', 'bleated', 'grunted']],
      ['The frog ___ all night, keeping us awake by the pond.', 'croaked', ['chirped', 'howled', 'barked']],
      ['The crowd ___ in delight when the magician pulled a rabbit from his hat.', 'gasped', ['sighed', 'snored', 'mumbled']],
      ['The ducks ___ loudly as they waddled towards the pond.', 'quacked', ['clucked', 'crowed', 'cooed']],
      ['The rooster ___ at dawn and woke the whole village.', 'crowed', ['cawed', 'hooted', 'quacked']],
      ['The mice ___ behind the cupboard all through the night.', 'squeaked', ['croaked', 'growled', 'brayed']],
      ['The pigeons ___ softly on the window ledge.', 'cooed', ['quacked', 'honked', 'crowed']],
      ['The angry dog ___ at the postman through the gate.', 'growled', ['purred', 'cooed', 'bleated']],
      ['The cat ___ happily as I stroked its soft fur.', 'purred', ['hissed', 'growled', 'yowled']],
      ['The geese ___ loudly as they flew over the reservoir.', 'honked', ['cooed', 'clucked', 'purred']],
      ['The hens ___ as they pecked at the grain in the yard.', 'clucked', ['quacked', 'honked', 'hooted']],
    ];
    const p3UpperRows = [
      ['As dawn broke over the nature reserve, dozens of bird species began ___ in the treetops, filling the air with a rich layering of sound.', 'chirping', ['humming', 'mooing', 'barking']],
      ['The ornithologist paused on the trail when she heard the barn owl ___ from somewhere deep within the pine forest ahead.', 'screech', ['chirp', 'howl', 'crow']],
      ['Explorers camped at the edge of the tundra listened in silence as a pack of wolves began to ___ at the full moon rising over the frozen plains.', 'howl', ['bark', 'roar', 'growl']],
      ['Before the storm arrived, a murder of crows began to ___ from every rooftop along the street, as though warning the neighbourhood.', 'caw', ['chirp', 'squawk', 'screech']],
      ['When Mrs Lim revealed the amount of work remaining before the holidays, the entire class let out a collective ___ of disappointment.', 'sigh', ['roar', 'hum', 'squeal']],
      ['The male lion ___ across the savannah to announce his territory, and the sound could be heard from over five kilometres away.', 'roared', ['barked', 'meowed', 'squeaked']],
      ['Scientists discovered that bees in stressed hives had been ___ more intensely than usual, suggesting they use sound as a form of communication.', 'buzzing', ['barking', 'roaring', 'crowing']],
      ['The Border Collie ___ sharply twice to signal that it had located the lost hikers, then turned immediately to lead the rescuers forward.', 'barked', ['mewed', 'roared', 'hooted']],
      ['The king cobra warned the approaching photographer by spreading its hood wide and producing a deep ___ sound that echoed through the undergrowth.', 'hissing', ['buzzing', 'chirping', 'hooting']],
      ['Startled by the unexpected crack of lightning, the thoroughbred ___ and pulled hard against its reins before the groom managed to calm it down.', 'neighed', ['brayed', 'bleated', 'grunted']],
      ['Throughout the monsoon season, frogs ___ incessantly in the drains and paddy fields surrounding the kampong, sometimes well into the early morning.', 'croaked', ['chirped', 'howled', 'barked']],
      ['The audience ___ in unison when the trapeze artist released his grip at the very peak of the arc and appeared to plummet towards the net below.', 'gasped', ['sighed', 'snored', 'mumbled']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : p3UpperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'soundVerbs', subskill: 'animal_sound', q, choices: buildChoices(answer, ds), answer, explain: 'Each animal — and some human sounds (sigh) — has its own specific verb.' };
  },
  emotionAdjectives(level, i) {
    const p1p2Rows = [
      ['Alison was ___ with her gift. She loved it very much.', 'delighted', ['upset', 'excited', 'surprised']],
      ['I was ___ by the size of Jane\'s home. It looks like a palace!', 'amazed', ['frightened', 'delighted', 'angry']],
      ['Whenever Steve does not have enough sleep, he will be in a ___ mood.', 'grumpy', ['jolly', 'lazy', 'miserable']],
      ['Most children feel ___ visiting the dentist. It is an unpleasant experience.', 'nervous', ['excited', 'annoyed', 'discouraged']],
      ['As I had no one to play with and talk to all day, I felt ___.', 'miserable', ['nasty', 'disappointed', 'discouraged']],
      ['Everyone was ___ by the passenger\'s strange behaviour. They did not know why.', 'puzzled', ['curious', 'amazed', 'dazed']],
      ['He seems to be ___, so do not believe every word he says.', 'sly', ['honest', 'truthful', 'mischievous']],
      ['Tom felt ___ when he won first prize in the spelling bee.', 'proud', ['angry', 'sleepy', 'bored']],
      ['The children were ___ to ride the new roller coaster.', 'excited', ['bored', 'tired', 'upset']],
      ['She felt ___ when she realised she had been left out of the group project.', 'hurt', ['relieved', 'grateful', 'confused']],
      ['The boy was ___ when he saw the spider crawl towards him.', 'terrified', ['thrilled', 'amused', 'calm']],
      ['She was ___ at herself for forgetting to bring her homework.', 'annoyed', ['pleased', 'proud', 'grateful']],
      ['Ken was ___ after failing the test even though he had studied hard.', 'disappointed', ['delighted', 'relieved', 'proud']],
      ['I was ___ to see my lost wallet returned with nothing missing.', 'relieved', ['worried', 'jealous', 'furious']],
      ['Lila felt ___ of her sister\'s shiny new bicycle.', 'jealous', ['proud', 'fond', 'ashamed']],
      ['The coach was ___ when the players arrived late again.', 'furious', ['cheerful', 'patient', 'calm']],
      ['He was ___ of the dark and slept with a night light on.', 'afraid', ['fond', 'proud', 'sure']],
      ['She felt ___ when she tripped in front of the whole class.', 'embarrassed', ['amused', 'confident', 'cheerful']],
      ['We were ___ for Grandma\'s help with our costumes.', 'grateful', ['sorry', 'famous', 'careless']],
      ['The team felt ___ after losing three matches in a row.', 'discouraged', ['hopeful', 'thrilled', 'confident']],
    ];
    const p3UpperRows = [
      ['When the judges announced her name as the first-prize winner, Alison was so ___ that she could barely manage her acceptance speech.', 'delighted', ['upset', 'bored', 'sleepy']],
      ['Visitors to the science exhibition were ___ at the working robot that could solve a Rubik\'s cube in under thirty seconds.', 'amazed', ['frightened', 'delighted', 'angry']],
      ['Whenever Steve has not slept well the night before an examination, he tends to be in a particularly ___ mood throughout the day.', 'grumpy', ['jolly', 'lazy', 'miserable']],
      ['Although she had rehearsed the piece over a hundred times, she still felt ___ the moment she sat down before the panel of judges.', 'nervous', ['excited', 'annoyed', 'discouraged']],
      ['Stranded at the airport without her phone or boarding pass, she felt completely ___ and unsure what steps to take next.', 'miserable', ['nasty', 'disappointed', 'discouraged']],
      ['The entire class was ___ by the magician\'s final trick, and not even the teacher could work out how it had been done.', 'puzzled', ['curious', 'bored', 'dazed']],
      ['The new student seemed ___ at first, making promises he had no intention of keeping; it took weeks for the class to notice the pattern.', 'sly', ['honest', 'truthful', 'mischievous']],
      ['Tom felt genuinely ___ not because he had won, but because he had overcome the fear that had kept him from competing for years.', 'proud', ['angry', 'sleepy', 'bored']],
      ['The children were so ___ about the expedition to the science centre that none of them could fall asleep the night before.', 'excited', ['bored', 'tired', 'upset']],
      ['She felt deeply ___ when she discovered that her closest friend had been invited to the gathering but had chosen not to mention it.', 'hurt', ['relieved', 'grateful', 'confused']],
      ['The experienced hiker admitted he was ___ during the unexpected lightning storm that caught them on the exposed ridge above the tree line.', 'terrified', ['thrilled', 'amused', 'calm']],
      ['She was ___ at herself for leaving her identity card at home on the very day she needed it for the registration process.', 'annoyed', ['pleased', 'proud', 'grateful']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : p3UpperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'emotionAdjectives', subskill: 'feeling_word', q, choices: buildChoices(answer, ds), answer, explain: 'Use the feeling word that matches the situation and the strength of the emotion.' };
  },
  similes(level, i) {
    const p1p2Rows = [
      ['Dennis is as proud as a ___. He always thinks he is better than other people.', 'peacock', ['fox', 'eel', 'lion']],
      ['Little Liyana is as quiet as a ___ when she reads in the library.', 'mouse', ['lion', 'parrot', 'monkey']],
      ['John ran as fast as a ___ and won the race.', 'cheetah', ['turtle', 'snail', 'whale']],
      ['The kitten\'s fur felt as soft as ___.', 'silk', ['sand', 'rock', 'wood']],
      ['Our prefect, Aliya, is as brave as a ___ when she stops bullies in school.', 'lion', ['mouse', 'rabbit', 'parrot']],
      ['Daniel was as busy as a ___ during the school carnival.', 'bee', ['bear', 'sloth', 'cat']],
      ['The old man\'s skin was as rough as ___.', 'sandpaper', ['cotton', 'silk', 'velvet']],
      ['Her answer was as clear as ___ — there was no doubt at all.', 'crystal', ['mud', 'sand', 'glass']],
      ['He was as stubborn as a ___ and refused to change his mind.', 'mule', ['cat', 'rabbit', 'fox']],
      ['The twins are as alike as two peas in a ___.', 'pod', ['bag', 'box', 'basket']],
      ['Her memory is as sharp as a ___ — she never forgets a face.', 'tack', ['sponge', 'pillow', 'pencil']],
      ['After swimming for an hour, the children were as hungry as ___.', 'wolves', ['birds', 'fish', 'ducks']],
      ['My hands were as cold as ___ after holding the ice pack.', 'ice', ['fire', 'toast', 'soup']],
      ['His face turned as red as a ___ when he ran up ten flights of stairs.', 'tomato', ['banana', 'plum', 'grape']],
      ['Grandpa said the joke was as old as the ___.', 'hills', ['trees', 'roads', 'rocks']],
      ['The twin brothers look as alike as two ___ in a pod.', 'peas', ['beans', 'seeds', 'nuts']],
      ['The new pillow was as light as a ___.', 'feather', ['brick', 'stone', 'log']],
      ['The old treasure chest was as heavy as ___.', 'lead', ['paper', 'cloth', 'straw']],
      ['The wet floor was as slippery as an ___.', 'eel', ['owl', 'ant', 'egg']],
      ['The night sky was as black as ___.', 'coal', ['snow', 'milk', 'chalk']],
    ];
    const p3UpperRows = [
      ['Despite receiving several critical remarks during the review, Dennis remained as proud as a ___, refusing to acknowledge any of the feedback.', 'peacock', ['fox', 'eel', 'lion']],
      ['Even in the crowded school hall during the assembly, Liyana sat as quiet as a ___, completely absorbed in the book on her lap.', 'mouse', ['lion', 'parrot', 'monkey']],
      ['Training twice a day for an entire term had clearly paid off, and by the finals, she was as fast as a ___, leaving her competitors well behind.', 'cheetah', ['turtle', 'snail', 'whale']],
      ['The luxury bedding brand advertised that each sheet had been woven until it was as soft as ___ against the skin of its customers.', 'silk', ['sand', 'rock', 'wood']],
      ['Even when outnumbered three to one in the debate, Aliya argued her point as bravely as a ___, never once backing down under pressure.', 'lion', ['mouse', 'rabbit', 'parrot']],
      ['With twelve events to coordinate and barely two hours before the guests arrived, Daniel was as busy as a ___, rushing between stations.', 'bee', ['bear', 'sloth', 'cat']],
      ['After years of working outdoors without gloves, the gardener\'s weathered hands had become as rough as ___ to the touch.', 'sandpaper', ['cotton', 'silk', 'velvet']],
      ['After a week of patient revision and a thorough explanation from the tutor, the concept was finally as clear as ___ to her.', 'crystal', ['mud', 'sand', 'glass']],
      ['The committee spent hours presenting evidence and alternative proposals, yet he remained as stubborn as a ___ and would not reconsider.', 'mule', ['cat', 'rabbit', 'fox']],
      ['The new recruits were surprised to discover that the twins were as alike as two peas in a ___ in both appearance and personality.', 'pod', ['bag', 'box', 'basket']],
      ['Even a decade after the event, Grandma\'s memory was as sharp as a ___, and she could recall every name and detail from that day.', 'tack', ['sponge', 'pillow', 'pencil']],
      ['After completing the gruelling orienteering course through the jungle trail, the scouts were as hungry as ___ and devoured every scrap of food in sight.', 'wolves', ['birds', 'fish', 'ducks']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : p3UpperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'similes', subskill: 'fixed_comparison', q, choices: buildChoices(answer, ds), answer, explain: 'Similes are fixed comparisons — you cannot swap the noun for another animal.' };
  },
  mannerAdverbs(level, i) {
    // P1–P2: everyday -ly adverbs with an obvious scene clue.
    // Review 2026-10-08: every option explained. A kitten can purr loudly, a
    // dog can growl softly and a gymnast can land heavily, so those
    // distractors were replaced or the stem now says which it was ("and the
    // judges gave her top marks", "without a trace of fear").
    const lower = [
      ['The pupils sat ___ during the silent reading lesson.', 'quietly', ['loudly', 'roughly', 'wildly'], {
        'quietly': '"Quietly" is right — it means without making noise. A "silent reading lesson" needs quiet.',
        'loudly': '"Loudly" means with lots of noise. That is the opposite of "silent".',
        'roughly': '"Roughly" means in a hard, not gentle way. It does not fit sitting and reading.',
        'wildly': '"Wildly" means in a crazy, out-of-control way. Pupils reading in silence sit still.',
      }],
      ['The old man walked ___ down the road, leaning on his stick.', 'slowly', ['quickly', 'wildly', 'roughly'], {
        'slowly': '"Slowly" is right — someone who leans on a stick walks slowly and carefully.',
        'quickly': '"Quickly" means fast. Leaning on a stick tells us he could not walk fast.',
        'wildly': '"Wildly" means in a crazy, out-of-control way. Leaning on his stick, he walked steadily.',
        'roughly': '"Roughly" means in a hard, not gentle way. It does not describe how an old man walks with a stick.',
      }],
      ['She thanked the volunteer ___ for helping her cross the road.', 'politely', ['rudely', 'angrily', 'wildly'], {
        'politely': '"Politely" is right — it means with good manners. Saying thank you is polite.',
        'rudely': '"Rudely" means with bad manners. You do not thank someone rudely for helping you.',
        'angrily': '"Angrily" means in a cross way. Someone had helped her, so she was not cross.',
        'wildly': '"Wildly" means in a crazy, out-of-control way. Saying thank you is calm and kind.',
      }],
      ['She carried the tray of glasses ___ across the crowded room.', 'carefully', ['carelessly', 'roughly', 'wildly'], {
        'carefully': '"Carefully" is right — glasses can break, and a crowded room has people to walk around.',
        'carelessly': '"Carelessly" means without care. The glasses might fall and break.',
        'roughly': '"Roughly" means in a hard, not gentle way. The glasses might break.',
        'wildly': '"Wildly" means in a crazy, out-of-control way. The glasses would fall.',
      }],
      ['The boys clapped ___ when their team scored the winning goal.', 'loudly', ['quietly', 'softly', 'sadly'], {
        'loudly': '"Loudly" is right — when your team wins, you clap with lots of noise.',
        'quietly': '"Quietly" means with little noise. Fans clap loudly for a winning goal.',
        'softly': '"Softly" means gently and quietly. A winning goal makes fans clap hard and loud.',
        'sadly': '"Sadly" means in an unhappy way. Their team won, so they were happy.',
      }],
      ['The librarian spoke ___ so as not to disturb the readers.', 'softly', ['loudly', 'harshly', 'rudely'], {
        'softly': '"Softly" is right — it means gently and quietly, so the readers are not disturbed.',
        'loudly': '"Loudly" means with lots of noise. That would disturb the readers.',
        'harshly': '"Harshly" means in a hard, unkind voice. A harsh voice would disturb the readers.',
        'rudely': '"Rudely" is about bad manners, not about how loud she was. "So as not to disturb" is about keeping quiet.',
      }],
      ['The children cheered ___ when the extra holiday was announced.', 'happily', ['sadly', 'quietly', 'angrily'], {
        'happily': '"Happily" is right — an extra holiday is good news, so the children were happy.',
        'sadly': '"Sadly" means in an unhappy way. An extra holiday is good news.',
        'quietly': '"Quietly" means with little noise. Cheering is loud.',
        'angrily': '"Angrily" means in a cross way. Nobody is cross about an extra holiday.',
      }],
      ['The runner crossed the finish line ___ and won the race.', 'quickly', ['slowly', 'lazily', 'sadly'], {
        'quickly': '"Quickly" is right — to win a race, you must be fast.',
        'slowly': '"Slowly" means not fast. A slow runner does not win the race.',
        'lazily': '"Lazily" means without trying. You have to try hard to win a race.',
        'sadly': '"Sadly" means in an unhappy way. Winning a race makes you happy.',
      }],
      ['He shut the gate ___ behind him so the dog could not escape.', 'firmly', ['loosely', 'lazily', 'carelessly'], {
        'firmly': '"Firmly" is right — it means tightly and strongly, so the gate stays shut and the dog stays in.',
        'loosely': '"Loosely" means not tightly. The gate might swing open and the dog could escape.',
        'lazily': '"Lazily" means without trying. The gate might not close properly.',
        'carelessly': '"Carelessly" means without care. The gate might not close, and the dog could escape.',
      }],
      ['The kitten purred ___ as the girl stroked its fur.', 'gently', ['roughly', 'angrily', 'fiercely'], {
        'gently': '"Gently" is right — a purr is the soft, happy sound a kitten makes when it is stroked.',
        'roughly': '"Roughly" means in a hard, not gentle way. A happy purr is soft.',
        'angrily': '"Angrily" means in a cross way. A kitten purrs when it is happy, not cross.',
        'fiercely': '"Fiercely" means in a wild, scary way. A kitten being stroked is calm and happy.',
      }],
      ['The boy answered ___ because he was not sure he was right.', 'quietly', ['proudly', 'loudly', 'firmly'], {
        'quietly': '"Quietly" is right — when you are not sure, you often speak in a small, soft voice.',
        'proudly': '"Proudly" means feeling pleased with yourself. He was not sure he was right, so he was not proud.',
        'loudly': '"Loudly" means in a big voice. People who are not sure usually speak softly.',
        'firmly': '"Firmly" means in a strong, sure way. He was not sure, so he did not speak firmly.',
      }],
      ['She waited ___ in line even though the queue was very long.', 'patiently', ['angrily', 'rudely', 'noisily'], {
        'patiently': '"Patiently" is right — it means calmly, without getting upset. "Even though" tells us the long queue did not bother her.',
        'angrily': '"Angrily" is how someone might feel in a long queue, but "even though" tells us she stayed calm.',
        'rudely': '"Rudely" means with bad manners. "Even though" tells us the long queue did not upset her.',
        'noisily': '"Noisily" means making lots of noise. "Even though" tells us she stayed calm about the long queue.',
      }],
    ];
    // P3–P4: adverbs that name a mood or intensity, not just volume or speed.
    const middle = [
      ['It was so difficult to wake Ian as he was sleeping so ___.', 'soundly', ['drowsily', 'noisily', 'calmly'], {
        'soundly': '"Soundly" is right — it means deeply. Someone sleeping soundly is very hard to wake.',
        'drowsily': '"Drowsily" means in a half-asleep way. A drowsy person is easy to wake.',
        'noisily': '"Noisily" means making lots of noise. Snoring does not make someone hard to wake.',
        'calmly': '"Calmly" means peacefully. It does not say how deep his sleep was, and that is why he was hard to wake.',
      }],
      ['The dog growled ___ when the stranger walked past the gate.', 'fiercely', ['kindly', 'lazily', 'cheerfully'], {
        'fiercely': '"Fiercely" is right — it means in an angry, threatening way. A growl is a warning to a stranger.',
        'kindly': '"Kindly" means in a friendly way. A growl is a warning, not a friendly sound.',
        'lazily': '"Lazily" means without any effort. A dog warning off a stranger is alert, not lazy.',
        'cheerfully': '"Cheerfully" means happily. A growl is an angry sound.',
      }],
      ['The ambulance moved ___ through the traffic to reach the patient in time.', 'swiftly', ['lazily', 'slowly', 'aimlessly'], {
        'swiftly': '"Swiftly" is right — it means very quickly. "To reach the patient in time" tells us there was no time to lose.',
        'lazily': '"Lazily" means without effort. An ambulance rushing to a patient is not lazy.',
        'slowly': '"Slowly" is the opposite of what an emergency needs.',
        'aimlessly': '"Aimlessly" means without a goal. The ambulance had a clear goal: to reach the patient.',
      }],
      ['The boys cheered ___ when their team scored in the last minute.', 'wildly', ['quietly', 'gently', 'softly'], {
        'wildly': '"Wildly" is right — it means with lots of uncontrolled excitement, just right for a last-minute goal.',
        'quietly': '"Quietly" means with little noise. Cheering for a last-minute goal is loud.',
        'gently': '"Gently" means softly and calmly. A last-minute goal causes great excitement.',
        'softly': '"Softly" means with little noise. Cheering for a last-minute goal is loud.',
      }],
      ['She answered the teacher\'s question ___ without hesitation.', 'confidently', ['shyly', 'reluctantly', 'hesitantly'], {
        'confidently': '"Confidently" is right — it means feeling sure of yourself. "Without hesitation" means she did not pause or doubt.',
        'shyly': '"Shyly" means nervously, as if afraid to speak. "Without hesitation" tells us she did not hold back.',
        'reluctantly': '"Reluctantly" means unwillingly. "Without hesitation" tells us she was ready to answer.',
        'hesitantly': '"Hesitantly" means pausing because you are unsure. It is the opposite of "without hesitation".',
      }],
      ['The baby slept ___ in her mother\'s arms and did not stir once during the journey.', 'peacefully', ['restlessly', 'alertly', 'wakefully'], {
        'peacefully': '"Peacefully" is right — it means calmly and quietly. "Did not stir once" tells us she slept without moving.',
        'restlessly': '"Restlessly" means moving about and not settling. "Did not stir once" tells us the opposite.',
        'alertly': '"Alertly" means watching carefully, wide awake. A sleeping baby is not alert.',
        'wakefully': '"Wakefully" means staying awake. The baby was asleep.',
      }],
      ['The gymnast landed ___ on the mat after her somersault, and the judges gave her top marks.', 'gracefully', ['clumsily', 'heavily', 'roughly'], {
        'gracefully': '"Gracefully" is right — it means smoothly and beautifully. "Top marks" tells us her landing was excellent.',
        'clumsily': '"Clumsily" means awkwardly, as if about to fall. Judges do not give top marks for that.',
        'heavily': '"Heavily" means with a loud thud. Judges take marks off for a heavy landing.',
        'roughly': '"Roughly" means in a hard, uncontrolled way. Judges do not give top marks for that.',
      }],
      ['The children cheered ___ when the extra holiday was announced.', 'joyfully', ['sadly', 'quietly', 'bitterly'], {
        'joyfully': '"Joyfully" is right — it means with great happiness. An extra holiday is good news.',
        'sadly': '"Sadly" means unhappily. An extra holiday is good news.',
        'quietly': '"Quietly" means with little noise. Cheering is loud.',
        'bitterly': '"Bitterly" means with anger or hurt. Nobody is upset about an extra holiday.',
      }],
      ['The knight fought ___, without a trace of fear, to defend the castle gates.', 'bravely', ['fearfully', 'timidly', 'nervously'], {
        'bravely': '"Bravely" is right — it means with courage. "Without a trace of fear" tells us he was brave.',
        'fearfully': '"Fearfully" means full of fear. The sentence says "without a trace of fear".',
        'timidly': '"Timidly" means shyly, like a mouse. Someone "without a trace of fear" is not timid.',
        'nervously': '"Nervously" means feeling worried. Someone "without a trace of fear" is not nervous.',
      }],
      ['He accepted the prize ___, thanking everyone who had helped him.', 'modestly', ['boastfully', 'rudely', 'angrily'], {
        'modestly': '"Modestly" is right — it means without showing off. Thanking everyone who helped shows he did not take all the credit.',
        'boastfully': '"Boastfully" means showing off. Thanking others is the opposite of boasting.',
        'rudely': '"Rudely" means with bad manners. Thanking people is polite.',
        'angrily': '"Angrily" means in a cross way. Someone thanking the people who helped him is not cross.',
      }],
      ['The lost child looked around ___ for a familiar face, her lip trembling.', 'anxiously', ['calmly', 'cheerfully', 'lazily'], {
        'anxiously': '"Anxiously" is right — it means in a worried way. A lost child with a trembling lip is worried.',
        'calmly': '"Calmly" means without worry. "Her lip trembling" tells us she was upset.',
        'cheerfully': '"Cheerfully" means happily. A lost child with a trembling lip is not happy.',
        'lazily': '"Lazily" means without effort. A lost child searching for help is not lazy.',
      }],
      ['She tore open the envelope and read the letter ___, smiling at every line.', 'eagerly', ['reluctantly', 'lazily', 'rudely'], {
        'eagerly': '"Eagerly" is right — it means keenly, wanting to know more. Tearing open the envelope and smiling show she could not wait.',
        'reluctantly': '"Reluctantly" means unwillingly. Tearing the envelope open shows she could not wait.',
        'lazily': '"Lazily" means without effort. Tearing open the envelope shows she was keen.',
        'rudely': '"Rudely" means with bad manners. Reading your own letter is not rude, and she was smiling.',
      }],
    ];
    // P5–P6: adverbs whose neighbours are all plausible until the clue is weighed.
    const upper = [
      ['The thief moved ___ through the dark corridor so as not to make a sound.', 'stealthily', ['boldly', 'noisily', 'carelessly'], {
        'stealthily': '"Stealthily" is right — it means quietly and secretly, to avoid being noticed. "So as not to make a sound" confirms it.',
        'boldly': '"Boldly" means confidently, without fear of being seen. A thief avoiding any sound is being careful, not bold.',
        'noisily': '"Noisily" contradicts "so as not to make a sound".',
        'carelessly': '"Carelessly" means without thought. Trying not to make a sound takes great care.',
      }],
      ['The wounded soldier crawled ___ towards the shelter.', 'painfully', ['comfortably', 'effortlessly', 'playfully'], {
        'painfully': '"Painfully" is right — "wounded" tells us every movement hurt.',
        'comfortably': '"Comfortably" means without discomfort. A wounded soldier crawling is not comfortable.',
        'effortlessly': '"Effortlessly" means with no effort at all. A wound makes crawling a struggle.',
        'playfully': '"Playfully" means in a fun, light-hearted way. It does not suit a wounded soldier seeking shelter.',
      }],
      ['He practised the piano ___ every evening until he mastered the piece.', 'diligently', ['casually', 'lazily', 'carelessly'], {
        'diligently': '"Diligently" is right — it means with steady, careful effort, the kind it takes to practise every evening until you master a piece.',
        'casually': '"Casually" means in a relaxed, not serious way. Mastering a piece takes serious effort.',
        'lazily': '"Lazily" means with little effort. Lazy practice would not lead to mastery.',
        'carelessly': '"Carelessly" means without attention. Mastering a piece needs careful practice.',
      }],
      ['The detective examined the footprints ___ before drawing any conclusions.', 'meticulously', ['carelessly', 'blindly', 'loosely'], {
        'meticulously': '"Meticulously" is right — it means with great attention to every detail, which is what a detective does before deciding anything.',
        'carelessly': '"Carelessly" means without attention. "Before drawing any conclusions" shows he was being careful.',
        'blindly': '"Blindly" means without thinking or looking. Examining clues means looking closely.',
        'loosely': '"Loosely" means not exactly. It does not describe a close examination.',
      }],
      ['The witness answered ___, avoiding any detail that might identify her.', 'evasively', ['candidly', 'bluntly', 'eagerly'], {
        'evasively': '"Evasively" is right — it means avoiding giving a direct answer. "Avoiding any detail" is exactly that.',
        'candidly': '"Candidly" means openly and honestly. She was hiding details, not sharing them.',
        'bluntly': '"Bluntly" means very directly. She was avoiding details, not stating them plainly.',
        'eagerly': '"Eagerly" means keenly. Someone avoiding details is holding back, not eager.',
      }],
      ['He apologised ___, clearly meaning every word of it.', 'sincerely', ['grudgingly', 'mockingly', 'carelessly'], {
        'sincerely': '"Sincerely" is right — it means honestly, meaning what you say. "Clearly meaning every word" says exactly that.',
        'grudgingly': '"Grudgingly" means unwillingly. Someone who means every word is not apologising against his will.',
        'mockingly': '"Mockingly" means making fun. A mocking apology does not mean what it says.',
        'carelessly': '"Carelessly" means without thought. Meaning every word shows careful thought.',
      }],
      ['The chairman spoke ___, refusing to soften the bad news.', 'bluntly', ['tactfully', 'evasively', 'timidly'], {
        'bluntly': '"Bluntly" is right — it means saying something directly, without making it gentler. "Refusing to soften" says the same.',
        'tactfully': '"Tactfully" means carefully, so as not to upset anyone. That is softening the news.',
        'evasively': '"Evasively" means avoiding the point. He stated the bad news directly.',
        'timidly': '"Timidly" means shyly and nervously. Refusing to soften bad news takes firmness.',
      }],
      ['She agreed to help ___, having already refused twice.', 'grudgingly', ['eagerly', 'instantly', 'joyfully'], {
        'grudgingly': '"Grudgingly" is right — it means unwillingly. Refusing twice shows she did not want to help.',
        'eagerly': '"Eagerly" means keenly. Someone who refused twice was not keen.',
        'instantly': '"Instantly" means at once. She had already refused twice, so she did not agree at once.',
        'joyfully': '"Joyfully" means happily. Refusing twice shows she was not happy to help.',
      }],
      ['The old scholar explained the theory ___ so no one was left behind.', 'patiently', ['hastily', 'carelessly', 'curtly'], {
        'patiently': '"Patiently" is right — it means calmly, taking as long as needed. "So no one was left behind" shows he waited for everyone.',
        'hastily': '"Hastily" means in a rush. Rushing would leave some people behind.',
        'carelessly': '"Carelessly" means without attention. A careless explanation would leave people confused.',
        'curtly': '"Curtly" means rudely short. A short, abrupt explanation would leave people behind.',
      }],
      ['He glanced at the report ___ and missed the error entirely.', 'cursorily', ['meticulously', 'thoroughly', 'diligently'], {
        'cursorily': '"Cursorily" is right — it means quickly and without attention to detail. "Glanced" and "missed the error" both point to that.',
        'meticulously': '"Meticulously" means with great care. A careful check would have found the error.',
        'thoroughly': '"Thoroughly" means completely and carefully. A thorough check would have found the error.',
        'diligently': '"Diligently" means with steady effort. A diligent reader would have found the error, and a glance is not diligent.',
      }],
      ['The volunteers worked ___ through the night to fill the sandbags.', 'tirelessly', ['lazily', 'cursorily', 'idly'], {
        'tirelessly': '"Tirelessly" is right — it means without stopping or tiring. Working "through the night" shows that.',
        'lazily': '"Lazily" means with little effort. Working through the night takes great effort.',
        'cursorily': '"Cursorily" means quickly and without attention. It describes a quick look, not long, hard work.',
        'idly': '"Idly" means without doing anything useful. They were filling sandbags all night.',
      }],
      ['She declined the invitation ___, so as not to cause offence.', 'tactfully', ['bluntly', 'rudely', 'mockingly'], {
        'tactfully': '"Tactfully" is right — it means carefully, so as not to upset anyone. "So as not to cause offence" says exactly that.',
        'bluntly': '"Bluntly" means very directly, without softening. That risks causing offence.',
        'rudely': '"Rudely" means with bad manners. That would cause offence.',
        'mockingly': '"Mockingly" means making fun. That would certainly cause offence.',
      }],
    ];
    const rows = bandRows(level, { lower, middle, upper });
    const [q, answer, ds, optionExplanations] = rotate(rows, i);
    return { category: 'mannerAdverbs', subskill: 'adverb_manner', q, choices: buildChoices(answer, ds), answer, explain: 'An adverb of manner describes HOW an action is done — match the adverb to the mood and intensity of the scene.', optionExplanations };
  },
  phrasalVerbs(level, i) {
    // P1–P2: everyday phrasal verbs from home and classroom routines.
    const lower = [
      ['Mum said I had to ___ my room before going out.', 'tidy up', ['give up', 'turn up', 'take up']],
      ['Please ___ the lights when you leave the classroom.', 'turn off', ['turn up', 'turn over', 'turn in']],
      ['It is cold outside, so ___ your jacket before you go.', 'put on', ['put off', 'put up', 'put down']],
      ['Could you ___ my little brother while I finish my homework?', 'look after', ['look up', 'look out', 'look into']],
      ['The teacher asked us to ___ our textbooks to page 42.', 'turn to', ['turn over', 'turn down', 'turn in']],
      ['I am ___ to my birthday party next week.', 'looking forward', ['looking up', 'looking out', 'looking after']],
      ['Please ___ the music a little. We cannot hear ourselves think.', 'turn down', ['turn in', 'turn over', 'turn out']],
      ['Do not ___ so easily — try the puzzle once more.', 'give up', ['give back', 'give out', 'give away']],
      ['Remember to ___ your shoes before entering the house.', 'take off', ['take up', 'take on', 'take over']],
      ['She had to ___ early because the bus leaves at seven.', 'get up', ['get on', 'get over', 'get by']],
      ['We should ___ the rubbish before the bin overflows.', 'throw away', ['throw up', 'throw on', 'throw over']],
      ['Please ___ your toys when you have finished playing.', 'put away', ['put on', 'put up', 'put off']],
    ];
    // P3–P4: phrasal verbs whose meaning is no longer the sum of their parts.
    const middle = [
      ['I ___ my old photo album while clearing the storeroom.', 'came across', ['came over', 'came along', 'came through']],
      ['The school concert was ___ because the hall was flooded.', 'called off', ['called out', 'called up', 'called for']],
      ['We have ___ milk. Could you buy some on your way home?', 'run out of', ['run into', 'run over', 'run through']],
      ['The teacher ___ that the answer to question 5 was on the board.', 'pointed out', ['pointed at', 'pointed to', 'pointed up']],
      ['My brother decided to ___ swimming after watching the Olympics.', 'take up', ['take on', 'take over', 'take off']],
      ['My sister and I always ___ after an argument.', 'make up', ['make out', 'make over', 'make for']],
      ['My father ___ his own business after twenty years at a large company.', 'set up', ['set off', 'set out', 'set aside']],
      ['The prisoners succeeded in ___ of prison through a secret tunnel.', 'breaking out', ['breaking into', 'breaking up', 'breaking through']],
      ['He was so excited that he could not ___ the urge to share the news.', 'hold back', ['hold on', 'hold out', 'hold up']],
      ['Please ___ the form and return it to the office by Friday.', 'fill in', ['fill up', 'fill out of', 'fill over']],
      ['The meeting was ___ until the principal returned from leave.', 'put off', ['put on', 'put away', 'put up']],
      ['She promised to ___ the matter and report back to the class.', 'look into', ['look after', 'look up', 'look out']],
    ];
    // P5–P6: abstract and figurative phrasal verbs of the kind PSLE tests.
    const upper = [
      ['The business deal ___ because both sides could not agree.', 'fell through', ['fell out', 'fell behind', 'fell over']],
      ['The scientist ___ a series of experiments to test her new theory.', 'carried out', ['carried on', 'carried over', 'carried away']],
      ['The manager had to ___ a difficult decision that affected the team.', 'face up to', ['face off with', 'face away from', 'face down from']],
      ['She had to ___ a very difficult period after her grandmother died.', 'go through', ['go over', 'go along', 'go into']],
      ['The committee ___ the proposal in detail before voting on it.', 'went over', ['went off', 'went along', 'went out']],
      ['Despite the setback, the team ___ with the project as planned.', 'pressed on', ['pressed in', 'pressed out', 'pressed over']],
      ['His long silence ___ how uncomfortable he was with the question.', 'gave away', ['gave in', 'gave out', 'gave up']],
      ['The new evidence ___ the theory the class had accepted for weeks.', 'ruled out', ['ruled over', 'ruled on', 'ruled up']],
      ['The negotiators refused to ___ despite hours of pressure.', 'give in', ['give out', 'give away', 'give off']],
      ['She ___ her nervousness and delivered the speech beautifully.', 'got over', ['got on', 'got by', 'got up']],
      ['The scheme was ___ after the funding was unexpectedly withdrawn.', 'wound up', ['wound in', 'wound over', 'wound on']],
      ['They will have to ___ on luxuries until the loan is repaid.', 'cut back', ['cut in', 'cut off', 'cut up']],
    ];
    const rows = bandRows(level, { lower, middle, upper });
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'phrasalVerbs', subskill: 'phrasal_verb_meaning', q, choices: buildChoices(answer, ds), answer, explain: 'Phrasal verbs combine a verb + particle into a fixed meaning — come across (encounter), give up (stop trying), call off (cancel), carry out (perform), run out of (exhaust supply).' };
  },
  verbDistinction(level, i) {
    const p1p2Rows = [
      ['May I ___ a colour pencil from you?', 'borrow', ['get', 'lend', 'use']],
      ['I ___ my grandmother a birthday card. She received it in her mailbox today.', 'sent', ['fetched', 'took', 'picked']],
      ['Please ___ me your eraser; I will return it after class.', 'lend', ['borrow', 'keep', 'take']],
      ['Father will ___ me from school at three o\'clock today.', 'fetch', ['send', 'borrow', 'leave']],
      ['Sara ___ her brother to the park on her bicycle.', 'took', ['brought', 'fetched', 'sent']],
      ['Could you ___ the salt over here, please?', 'pass', ['lend', 'borrow', 'send']],
      ['She ___ her younger sister from their home to the bus stop every morning.', 'takes', ['brings', 'fetches', 'carries']],
      ['He forgot his wallet, so his mother had to ___ it to him at school.', 'bring', ['fetch', 'lend', 'borrow']],
      ['He will ___ his friend the book and expect it back next week.', 'lend', ['give', 'borrow', 'pass']],
      ['The teacher ___ all the marked test papers back to us.', 'returned', ['sent', 'delivered', 'borrowed']],
      ['May I ___ this book from the library for two weeks?', 'borrow', ['rent', 'lend', 'take']],
      ['She ___ her grandfather to the clinic and waited with him there.', 'brought', ['fetched', 'sent', 'delivered']],
      ['Did you ___ the loud thunder last night?', 'hear', ['listen', 'sound', 'watch']],
      ['We sat quietly to ___ to the principal\'s speech.', 'listen', ['hear', 'sound', 'speak']],
      ['Grandma likes to ___ us stories about her childhood.', 'tell', ['say', 'speak', 'talk']],
      ['"Please ___ sorry to your brother," Mum said firmly.', 'say', ['tell', 'speak', 'talk']],
      ['I ___ television for an hour after finishing my homework.', 'watched', ['saw', 'looked', 'stared']],
      ['Remember to ___ your homework before playing any games.', 'do', ['make', 'take', 'have']],
      ['Did you ___ your bed before leaving for school this morning?', 'make', ['do', 'fix', 'set']],
      ['It is chilly today, so ___ a jacket when you go out.', 'wear', ['put', 'dress', 'make']],
    ];
    const p3UpperRows = [
      ['Before the examination began, Jun discovered she had forgotten her ruler and had to ___ one from the student sitting in the next row.', 'borrow', ['get', 'lend', 'use']],
      ['The school principal ___ a letter of congratulations to each finalist, acknowledging the effort they had sustained throughout the competition.', 'sent', ['fetched', 'took', 'picked']],
      ['The librarian offered to ___ Priya a digital recorder so she could capture her interview with the visiting guest author after school.', 'lend', ['borrow', 'give', 'pass']],
      ['Dad had arranged to ___ the children from the sports complex once the inter-school swimming competition had concluded for the day.', 'fetch', ['send', 'borrow', 'leave']],
      ['The senior guide ___ the new recruits to the campsite via a longer route so that they could observe the wildlife along the way.', 'took', ['brought', 'fetched', 'sent']],
      ['Could you ___ the reference books along the row, please, so that everyone has a chance to consult the same chapter?', 'pass', ['lend', 'borrow', 'send']],
      ['Every Tuesday morning, the caretaker ___ the sports equipment over to us on the field before our physical education lesson begins.', 'brings', ['fetches', 'borrows', 'takes']],
      ['She called her son to ask him to ___ her umbrella to the office, as the weather forecast had predicted heavy afternoon showers.', 'bring', ['fetch', 'lend', 'send']],
      ['He agreed to ___ his neighbour the garden hose for the weekend, on the condition that it was returned in good condition by Monday.', 'lend', ['give', 'borrow', 'pass']],
      ['The librarian ___ all donated books to their original shelves after the repair team had finished replacing the damaged flooring in the reading room.', 'returned', ['sent', 'delivered', 'passed']],
      ['Visitors may ___ audio guides from the counter free of charge, provided the devices are returned before the museum closes.', 'borrow', ['lend', 'rent', 'keep']],
      ['She ___ her elderly grandmother to the community centre and stayed with her for the full duration of the health talk.', 'brought', ['fetched', 'sent', 'delivered']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : p3UpperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'verbDistinction', subskill: 'verb_pair_choice', q, choices: buildChoices(answer, ds), answer, explain: 'These verbs look similar but mean different things — pay attention to who is doing what to whom.' };
  },
  movementVerbs(level, i) {
    // P1–P2: everyday movement verbs a young child already uses in speech.
    const lower = [
      ['The rabbit ___ across the grass on its strong back legs.', 'hopped', ['swam', 'flew', 'dug']],
      ['The bird ___ high above the trees in the blue sky.', 'flew', ['swam', 'hopped', 'crawled']],
      ['The fish ___ quickly away when the shadow passed over the pond.', 'swam', ['flew', 'hopped', 'marched']],
      ['The baby ___ across the floor on her hands and knees.', 'crawled', ['flew', 'swam', 'galloped']],
      ['The duck ___ from side to side as it walked to the pond.', 'waddled', ['flew', 'swam', 'crawled']],
      ['The cat ___ quietly towards the sleeping mouse.', 'crept', ['stomped', 'flew', 'swam']],
      ['The squirrel ___ up the tree the moment the dog barked.', 'darted', ['waddled', 'crawled', 'swam']],
      ['The butterfly ___ from flower to flower in the school garden.', 'fluttered', ['stomped', 'crawled', 'swam']],
      ['The elephant ___ heavily through the forest, shaking the ground.', 'stomped', ['darted', 'fluttered', 'hopped']],
      ['The children ___ to the canteen when the bell rang for recess.', 'ran', ['crawled', 'swam', 'flew']],
      ['The snail ___ slowly along the wet garden wall.', 'crawled', ['galloped', 'flew', 'hopped']],
      ['The frog ___ from one lily pad to the next across the pond.', 'leaped', ['crawled', 'stomped', 'swam']],
    ];
    // P3–P4: precise verbs that name a manner of moving.
    const middle = [
      ['The snake ___ silently through the tall grass towards the pond.', 'slithered', ['galloped', 'soared', 'waded']],
      ['The horse ___ gracefully across the open field, kicking up dust.', 'galloped', ['slithered', 'waddled', 'crept']],
      ['The eagle ___ high above the mountains, searching for prey below.', 'soared', ['waded', 'scurried', 'crawled']],
      ['The rabbit ___ away into the bushes when it heard a loud noise.', 'scurried', ['soared', 'galloped', 'waded']],
      ['The hippopotamus ___ slowly through the muddy river shallows.', 'waded', ['soared', 'galloped', 'scurried']],
      ['The hawk ___ from the sky and snatched the mouse in its talons.', 'swooped', ['waded', 'galloped', 'scurried']],
      ['The little crab ___ sideways across the sandy beach at low tide.', 'scuttled', ['soared', 'galloped', 'waded']],
      ['The monkey ___ up the tall tree trunk using its strong limbs.', 'scrambled', ['galloped', 'waded', 'soared']],
      ['The duck ___ gently across the calm lake on a quiet morning.', 'paddled', ['galloped', 'soared', 'scurried']],
      ['The deer ___ gracefully over the low fence and into the forest.', 'leaped', ['waded', 'scuttled', 'paddled']],
      ['The dolphin ___ out of the water and splashed back into the waves.', 'leapt', ['crept', 'waded', 'waddled']],
      ['The swan ___ smoothly across the still surface of the lake.', 'glided', ['scrambled', 'scuttled', 'scurried']],
    ];
    // P5–P6: verbs whose force and weight must be weighed against near neighbours.
    const upper = [
      ['The old bear ___ out of the cave after its long winter sleep.', 'lumbered', ['darted', 'soared', 'prowled']],
      ['The tiger ___ silently through the jungle, watching the deer.', 'prowled', ['waded', 'scurried', 'lumbered']],
      ['The kangaroo ___ across the dry plains with powerful bounding leaps.', 'bounded', ['slithered', 'waded', 'lumbered']],
      ['The worm ___ slowly through the damp soil after the rain.', 'burrowed', ['soared', 'swooped', 'bounded']],
      ['The elephant ___ heavily along the track, in no hurry at all.', 'plodded', ['darted', 'bounded', 'scuttled']],
      ['The exhausted climbers ___ the final stretch to the summit.', 'trudged', ['bounded', 'darted', 'soared']],
      ['The wounded fox ___ back towards its den, dragging one leg.', 'limped', ['bounded', 'soared', 'galloped']],
      ['The heron ___ slowly through the shallows on its long legs, looking for fish.', 'waded', ['bounded', 'lumbered', 'burrowed']],
      ['The panther ___ along the branch without disturbing a single leaf.', 'prowled', ['plodded', 'lumbered', 'trudged']],
      ['The crowds ___ towards the exits once the concert ended.', 'surged', ['plodded', 'burrowed', 'waded']],
      ['The lizard ___ across the hot rock and vanished into a crack.', 'darted', ['plodded', 'lumbered', 'trudged']],
      ['The tortoise ___ steadily onwards while the hare slept.', 'plodded', ['darted', 'bounded', 'surged']],
    ];
    const rows = bandRows(level, { lower, middle, upper });
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'movementVerbs', subskill: 'animal_movement', q, choices: buildChoices(answer, ds), answer, explain: 'Each animal has its own way of moving — match the verb to how that animal travels.' };
  },
};

function toCanonicalCategory(cat) {
  if (cat === 'wordParts') return 'morphologicalAffix';
  return cat;
}

/**
 * Keep one item per seed question, renumbering ids so they stay contiguous.
 * See the twin in grammarMcq.js for why the banks no longer pad with copies.
 *
 * @template {{ seedId: string, id: string }} T
 * @param {T[]} items
 * @returns {T[]}
 */
function dedupeBySeed(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (seen.has(item.seedId)) continue;
    seen.add(item.seedId);
    out.push(item);
  }
  return out.map((item, i) => ({
    ...item,
    id: item.id.replace(/\d+$/, String(i + 1).padStart(3, '0')),
  }));
}

function buildLevel(level) {
  const cats = LEVEL_CATEGORY_PLAN[level];
  const items = [];
  const sessionSeed = Math.floor(Math.random() * 10);

  for (const baseCat of cats) {
    for (let localOffset = 0; localOffset < MIN_QUESTIONS_PER_SCOPE; localOffset += 1) {
      const localIndex = sessionSeed + localOffset;
      const spec = varyMcqNames(VOCAB_BUILDERS[baseCat](level, localIndex), localOffset);
      const variant = contextualizeMcqQuestion(spec.q);
      const item = {
        id: `v-${level.toLowerCase()}-${baseCat}-${String(localOffset + 1).padStart(3, '0')}`,
        level,
        category: toCanonicalCategory(spec.category),
        subskill: spec.subskill,
        // Difficulty comes from the seed's own demands (choice closeness,
        // reading load) — never from its position in the rotation.
        difficulty: deriveMcqDifficulty({ q: spec.q, answer: spec.answer, choices: spec.choices, level }),
        // One identity per seed question: wrapper frames and pupil-name swaps
        // do not create a "new" question for review scheduling or analytics.
        seedId: `v:${mcqSeedKey({ q: spec.q, category: toCanonicalCategory(spec.category), answer: spec.answer })}`,
        q: variant.question,
        questionType: variant.questionType,
        choices: spec.choices,
        answer: spec.answer,
        explain: spec.explain,
      };
      // Explanations, best first: builder-authored text, then gloss-driven
      // teaching explanations (what each word actually means), then the
      // generic category-rule fallback.
      item.optionExplanations = spec.optionExplanations
        || makeVocabTeachingExplanations({ ...spec, category: item.category, choices: item.choices })
        || makeFallbackOptionExplanations(item.answer, item.choices, VOCAB_CATEGORIES[item.category]);
      if (spec.clueWords) item.clueWords = spec.clueWords;
      if (spec.reasoning) item.reasoning = spec.reasoning;
      // Context type reflects the seed sentence, not the presentation wrapper.
      item.contextType = inferQuestionContextType(spec.q);
      items.push(item);
    }
  }

  return dedupeBySeed(items);
}

export const VOCAB_MCQ_ITEMS = Object.fromEntries(
  VOCAB_MCQ_LEVELS.map(level => [level, buildLevel(level)]),
);

/** Build a fresh item set for one level with a new random seed — call this each session. */
export function buildVocabMcqLevel(level) {
  return buildLevel(level);
}
