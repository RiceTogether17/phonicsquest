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
      ['The cake was so sweet that everyone asked for ___ slice.', 'another', ['a smaller', 'no more', 'a last']],
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
      { 'another': '"another" fits — liking something sweet makes you want one more slice.', 'a smaller': '"a smaller" suggests wanting less — the opposite if the cake is enjoyed.', 'no more': '"no more" means refusing — contradicts "so sweet that everyone asked for".', 'a last': '"a last" implies reluctance, not enjoyment.' },
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
      ['A person who flies an aeroplane is a ___.', 'pilot', ['captain', 'engineer', 'soldier']],
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
      ['An official document that allows a person to travel abroad is a ___.', 'passport', ['permit', 'visa', 'certificate']],
      ['A person who is new to a job or skill and is still learning is an ___.', 'apprentice', ['intern', 'assistant', 'consultant']],
      ['The study of the stars and planets is called ___.', 'astronomy', ['astrology', 'geology', 'philosophy']],
      ['A piece of land entirely surrounded by water is an ___.', 'island', ['peninsula', 'atoll', 'lagoon']],
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
      { 'pilot': 'A pilot flies an aeroplane — the definition says exactly that.', 'captain': 'A captain leads a ship or team — not specifically an aeroplane.', 'engineer': 'An engineer designs or maintains systems — not the person who flies the plane.', 'soldier': 'A soldier serves in the military — not a pilot.' },
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
      { 'passport': 'A passport is an official travel document — "official document … travel abroad" matches.', 'permit': 'A permit allows a specific activity — not the standard international travel document.', 'visa': 'A visa is a stamp allowing entry to a country — not the document itself that allows general travel.', 'certificate': 'A certificate proves an achievement — not a travel document.' },
      { 'apprentice': 'An apprentice is a beginner learning a trade — "new to a job … still learning" matches.', 'intern': 'An intern is a temporary trainee — usually in a professional context, not learning a trade.', 'assistant': 'An assistant helps someone — not necessarily a beginner still learning.', 'consultant': 'A consultant is an expert adviser — the opposite of someone new to the job.' },
      { 'astronomy': 'Astronomy is the study of stars and planets — both clues match.', 'astrology': 'Astrology uses stars to predict fortunes — not a scientific study.', 'geology': 'Geology studies rocks and the Earth — not stars and planets.', 'philosophy': 'Philosophy studies ideas and existence — not stars and planets.' },
      { 'island': 'An island is land entirely surrounded by water — "entirely surrounded by water" matches.', 'peninsula': 'A peninsula is surrounded by water on three sides — not entirely surrounded.', 'atoll': 'An atoll is a ring-shaped coral island — a specific type, not the general definition.', 'lagoon': 'A lagoon is a stretch of shallow water — not a piece of land.' },
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
      ['The opposite of "oppressive" in this passage is ___.', 'liberating', ['demanding', 'strict', 'formal']],
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
      ['The children ___ a song at the National Day celebration.', 'sang', ['played', 'told', 'acted']],
      ['Could you ___ me a favour and pass the salt?', 'do', ['give', 'make', 'offer']],
      ['The pupils have to ___ their homework before going home.', 'complete', ['finish off', 'end', 'close']],
      ['She ___ a deep breath before stepping onto the stage.', 'took', ['made', 'inhaled', 'pulled']],
      ['We should ___ care of our belongings.', 'take', ['do', 'make', 'give']],
      ['The doctor asked the patient to ___ an appointment early.', 'make', ['take', 'put', 'keep']],
      ['The team had to ___ a plan before the competition.', 'form', ['assemble', 'build', 'arrange']],
    ];
    const upperRows = [
      ['The government decided to ___ a new policy on plastic use.', 'implement', ['deploy', 'announce', 'delay']],
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
      ['The government will ___ measures to tackle water wastage.', 'introduce', ['invent', 'enforce', 'publish']],
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
      { 'sang': 'We "sang a song" — the natural verb for performing a vocal piece.', 'played': '"played a song" is used for instruments, not singing.', 'told': '"told a song" is not English — we tell stories, not songs.', 'acted': '"acted a song" is not standard; acting applies to drama.' },
      { 'do': 'We "do a favour" — the fixed collocation; you cannot "give" or "make" a favour.', 'give': '"give a favour" is not the standard collocation.', 'make': '"make a favour" is not standard in English.', 'offer': '"offer a favour" suggests proposing, not the act itself.' },
      { 'complete': 'We "complete homework" — the precise verb for finishing all required work.', 'finish off': '"finish off" is informal and suggests finishing the last part.', 'end': '"end homework" is not a natural collocation.', 'close': '"close homework" is not a real expression.' },
      { 'took': 'We "took a deep breath" — the fixed collocation for this action.', 'made': '"made a deep breath" is not a standard collocation.', 'inhaled': '"inhaled a deep breath" is redundant — inhaling is part of breathing.', 'pulled': '"pulled a deep breath" is not standard.' },
      { 'take': 'We "take care of" — the fixed phrase for looking after something.', 'do': '"do care of" is not correct.', 'make': '"make care of" is not a real collocation.', 'give': '"give care of" is not standard.' },
      { 'make': 'We "make an appointment" — the standard collocation for booking a time.', 'take': '"take an appointment" is not the standard phrase.', 'put': '"put an appointment" is not an English collocation.', 'keep': '"keep an appointment" means to not miss it — not to book one.' },
      { 'form': 'We "form a plan" — a fixed collocation meaning to develop and create a plan.', 'assemble': '"assemble a plan" is not natural — assemble is for physical parts.', 'build': '"build a plan" is not the natural collocation — plans are "formed" or "made".', 'arrange': '"arrange a plan" is not the natural collocation for creating one.' },
    ];
    const upperEx = [
      { 'implement': 'We "implement a policy" — the precise collocation for putting a policy into action.', 'deploy': '"deploy a policy" is used in technology, not government contexts.', 'announce': '"announce a policy" means to tell people about it — not to put it into action.', 'delay': '"delay a policy" means to postpone — the opposite of implementing.' },
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
      { 'introduce': 'We "introduce measures" — the formal collocation for putting new actions in place.', 'invent': '"invent measures" is not the collocation for putting new rules in place.', 'enforce': '"enforce measures" means to make people follow them — not the same as starting them.', 'publish': '"publish measures" means to announce them — not to put them into action.' },
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
    const p1p2Rows = [
      ['Although the backpack looked small, it was surprisingly ___.', 'heavy', ['empty', 'gentle', 'silent']],
      ['Because the lights went out suddenly, the hall became ___.', 'dark', ['tiny', 'modern', 'spacious']],
      ['She was nervous, yet her voice remained ___.', 'steady', ['crooked', 'dusty', 'fragile']],
      ['The toy was old; however, it was still ___.', 'working', ['broken', 'missing', 'rusted']],
      ['He ate a big breakfast, so he was not ___ by lunchtime.', 'hungry', ['sleepy', 'angry', 'wet']],
      ['Although it was raining, the children played ___ outside.', 'happily', ['sadly', 'lazily', 'quietly']],
      ['She practised hard; therefore, she performed ___ on stage.', 'well', ['badly', 'slowly', 'silently']],
      ['The shop was far; however, Mum walked there ___.', 'anyway', ['never', 'slowly', 'reluctantly']],
      ['Because the sun was bright, everyone wore ___ glasses.', 'sunglasses', ['mittens', 'boots', 'scarves']],
      ['He forgot his umbrella, so he got ___ in the rain.', 'wet', ['lost', 'cold', 'scared']],
      ['Despite the cold, Mei wore only a ___ jacket outside.', 'thin', ['thick', 'warm', 'heavy']],
      ['Because he dropped his tray, the food got ___.', 'dirty', ['tasty', 'hot', 'fresh']],
      ['The bag was full, so Mum had to carry it ___.', 'carefully', ['lightly', 'lazily', 'quickly']],
      ['She had not eaten all day, yet she still looked ___.', 'cheerful', ['hungry', 'weak', 'tired']],
      ['Although the homework was long, Ali finished it ___.', 'quickly', ['slowly', 'badly', 'late']],
      ['He left his water bottle behind; however, he was not ___ at all.', 'thirsty', ['happy', 'sleepy', 'bored']],
    ];
    const upperRows = [
      ['The map was clear; however, the route was still ___.', 'confusing', ['tidy', 'famous', 'silent']],
      ['Despite the setback, the team remained ___ and continued their work.', 'determined', ['discouraged', 'confused', 'impatient']],
      ['Although the experiment failed, the scientists gained ___ insights.', 'valuable', ['negative', 'useless', 'obvious']],
      ['The evidence was limited; nevertheless, the judge reached a ___ verdict.', 'reasonable', ['hasty', 'unfair', 'random']],
      ['She had rehearsed for months; consequently, her performance was ___.', 'outstanding', ['average', 'poor', 'rushed']],
      ['Unless the budget is increased, the project will remain ___.', 'incomplete', ['ambitious', 'approved', 'successful']],
      ['The policy was popular; however, its implementation was ___.', 'challenging', ['swift', 'celebrated', 'clear']],
      ['While the report was detailed, the recommendations were surprisingly ___.', 'vague', ['thorough', 'accepted', 'decisive']],
      ['He prepared thoroughly; therefore, he answered the questions ___.', 'confidently', ['nervously', 'carelessly', 'reluctantly']],
      ['Even though the task seemed impossible, the team completed it ___.', 'successfully', ['poorly', 'reluctantly', 'hastily']],
      ['Because of the heavy traffic, the convoy arrived ___ at the venue.', 'late', ['early', 'quietly', 'ahead']],
      ['The solution was elegant; furthermore, it was ___ to implement.', 'practical', ['costly', 'difficult', 'controversial']],
      ['Despite being the youngest member, she contributed ___ to the group.', 'significantly', ['minimally', 'carelessly', 'grudgingly']],
      ['The data was incomplete; as a result, the conclusions were ___.', 'unreliable', ['precise', 'final', 'convincing']],
      ['He was nervous before the interview; nonetheless, he performed ___.', 'admirably', ['terribly', 'forgetfully', 'quietly']],
      ['Since the deadline was moved forward, the team had to work ___.', 'faster', ['later', 'individually', 'silently']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'connectorClue', subskill: 'connector_inference', q, choices: buildChoices(answer, ds), answer, explain: 'Use the connector to infer the missing meaning word.' };
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
    const rows = [
      ['"Practice makes ___."', 'perfect', ['faster', 'silent', 'famous']],
      ['"Where there is a will, there is a ___."', 'way', ['roadblock', 'ticket', 'raincoat']],
      ['"Actions speak louder than ___."', 'words', ['coins', 'voices', 'windows']],
      ['"A stitch in time saves ___."', 'nine', ['mine', 'fine', 'line']],
      ['"Do not judge a book by its ___."', 'cover', ['content', 'author', 'title']],
      ['"Better late than ___."', 'never', ['later', 'sooner', 'always']],
      ['"Two heads are better than ___."', 'one', ['two', 'none', 'three']],
      ['"Every cloud has a silver ___."', 'lining', ['edge', 'border', 'frame']],
      ['"Look before you ___."', 'leap', ['run', 'sleep', 'climb']],
      ['"The early bird catches the ___."', 'worm', ['fish', 'fly', 'bug']],
      ['"All that glitters is not ___."', 'gold', ['bright', 'silver', 'precious']],
      ['"A friend in need is a friend ___."', 'indeed', ['always', 'forever', 'truly']],
      ['"Too many cooks spoil the ___."', 'broth', ['meal', 'food', 'dish']],
      ['"When in Rome, do as the Romans ___."', 'do', ['say', 'eat', 'sing']],
      ['"Honesty is the best ___."', 'policy', ['action', 'virtue', 'lesson']],
      ['"The pen is mightier than the ___."', 'sword', ['gun', 'shield', 'arrow']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'proverbsSayings', subskill: 'proverb_completion', q, choices: buildChoices(answer, ds), answer, explain: 'Choose the proverb word that completes the saying correctly.' };
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
      ['Data stored in a remote server accessible via the internet is called ___ storage.', 'cloud', ['digital', 'virtual', 'remote']],
      ['The branch of science that studies matter and its interactions with energy is ___.', 'physics', ['chemistry', 'geology', 'biology']],
      ['An organism that breaks down dead material into simpler substances is a ___.', 'decomposer', ['producer', 'consumer', 'predator']],
      ['The use of computer systems to perform tasks that normally require human intelligence is ___.', 'artificial intelligence', ['machine learning', 'data science', 'robotics']],
      ['A ___ is a strand of DNA that carries genetic information.', 'chromosome', ['protein', 'enzyme', 'hormone']],
      ['The study of the structure and history of the Earth is called ___.', 'geology', ['ecology', 'biology', 'meteorology']],
      ['Software that protects a computer from malicious programmes is called ___.', 'antivirus software', ['firewall', 'operating system', 'browser']],
      ['A ___ is a device that measures the amount of an electric current.', 'ammeter', ['voltmeter', 'galvanometer', 'resistor']],
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
      ['A rule that everyone in a community must follow is called a ___.', 'rule', ['suggestion', 'guideline', 'request']],
      ['The person who leads a country is called the ___.', 'leader', ['mayor', 'officer', 'assistant']],
      ['People who move to a new country to live are called ___.', 'immigrants', ['tourists', 'travellers', 'diplomats']],
      ['A person who keeps the neighbourhood safe is a ___.', 'police officer', ['firefighter', 'doctor', 'teacher']],
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
      ['The body of international law that protects people affected by armed conflict is ___.', 'humanitarian law', ['trade law', 'maritime law', 'civil law']],
      ['A tax placed on imported goods to protect domestic industries is a ___.', 'tariff', ['subsidy', 'quota', 'levy']],
      ['The idea that every person has basic rights simply by being human is called ___.', 'human rights', ['civil liberties', 'legal rights', 'civil rights']],
      ['The belief that the interests of one\'s own nation come before those of all other nations is ___.', 'nationalism', ['protectionism', 'isolationism', 'globalism']],
      ['The process by which countries work together on issues that affect the whole world is ___.', 'multilateralism', ['bilateralism', 'unilateralism', 'pluralism']],
      ['A reduction in the value of a country\'s currency relative to other currencies is ___.', 'depreciation', ['devaluation', 'deflation', 'recession']],
      ['The practice of managing a country\'s money supply to control inflation is called ___ policy.', 'monetary', ['fiscal', 'trade', 'industrial']],
      ['A group of countries that cooperate on economic and political matters is called a ___.', 'bloc', ['alliance', 'coalition', 'federation']],
      ['The upholding of what is right and the punishment of wrongdoing through the law is called ___.', 'justice', ['equality', 'fairness', 'democracy']],
      ['The right of a country to govern itself without interference from others is called ___.', 'sovereignty', ['democracy', 'diplomacy', 'citizenship']],
      ['The migration of skilled workers from developing countries to developed ones is called brain ___.', 'drain', ['gain', 'shift', 'flow']],
      ['Organisations that operate across multiple countries are called ___ corporations.', 'multinational', ['bilateral', 'regional', 'national']],
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
      ['Bill finished a whole ___ of ice-cream on his own.', 'tub', ['carton', 'container', 'box']],
      ['A ___ of fish swam past the diver.', 'school', ['flock', 'herd', 'pack']],
      ['Mrs Lee bought a ___ of milk from the supermarket.', 'carton', ['bowl', 'tub', 'tray']],
      ['A ___ of wolves howled in the forest at night.', 'pack', ['flock', 'herd', 'troop']],
      ['A ___ of bees buzzed around the hive near our garden.', 'swarm', ['flock', 'colony', 'herd']],
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
      ['To everyone\'s amusement, he finished an entire ___ of ice cream during the film without offering a single spoonful to anyone.', 'tub', ['carton', 'container', 'box']],
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
      ['I was feeling ill, so I visited a ___ to see a doctor.', 'clinic', ['shop', 'hospital', 'sickbay']],
      ['It is hot and dry in the ___ where few plants can survive.', 'desert', ['forest', 'jungle', 'reservoir']],
      ['Everyone rushed towards the ___ of the building to escape from the fire.', 'exit', ['entrance', 'lobby', 'corridor']],
      ['We borrowed storybooks from the school ___.', 'library', ['canteen', 'office', 'hall']],
      ['Mum stopped at the ___ to fill the car with petrol.', 'petrol station', ['bus stop', 'taxi stand', 'workshop']],
      ['We watched a movie at the ___ last weekend.', 'cinema', ['theatre', 'studio', 'gallery']],
      ['Athletes train and compete in a large covered ___.', 'stadium', ['gymnasium', 'court', 'arena']],
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
      ['Mum brought Kai to the ___ after he complained of a persistent headache that had not improved despite resting through the afternoon.', 'clinic', ['shop', 'hospital', 'sickbay']],
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
    const p1p2Rows = [
      ['Our pet dog ___ its tail excitedly when it sees us.', 'wags', ['flaps', 'waves', 'shakes']],
      ['Gail ___ the dirty table with a cloth.', 'wiped', ['rubbed', 'mopped', 'brushed']],
      ['No one saw the burglar ___ into the house when night fell.', 'sneaking', ['crawling', 'strolling', 'marching']],
      ['"Look at that caterpillar ___ on the branch!" Joe said.', 'crawling', ['sliding', 'trotting', 'travelling']],
      ['Betsy let out a scream when the snake ___ towards her.', 'slithered', ['slid', 'crept', 'glided']],
      ['Little Sophie went missing as she had ___ off on her own.', 'wandered', ['marched', 'strolled', 'travelled']],
      ['The vase ___ when it hit the floor.', 'shattered', ['exploded', 'burst', 'crashed']],
      ['The chef ___ the eggs in a bowl before pouring them into the pan.', 'whisked', ['poured', 'sliced', 'fried']],
      ['Anna ___ a cup of hot tea slowly so as not to burn her tongue.', 'sipped', ['gulped', 'chewed', 'spilled']],
      ['The puppy ___ at the ball and knocked it across the room.', 'pounced', ['leaped', 'snapped', 'dashed']],
      ['He ___ the wet shirt on the bamboo pole to dry.', 'hung', ['draped', 'placed', 'dropped']],
      ['She ___ the heavy bag over her shoulders before setting off.', 'hoisted', ['carried', 'threw', 'held']],
      ['Tom ___ the crumpled paper into the bin from across the room.', 'tossed', ['lifted', 'carried', 'pushed']],
      ['The baby ___ the toy tightly and would not let go.', 'clutched', ['tapped', 'patted', 'poked']],
      ['Mum ___ the pancake high into the air with the frying pan.', 'flipped', ['rolled', 'stirred', 'spread']],
      ['The children ___ across the icy floor in their socks.', 'slid', ['hopped', 'stamped', 'marched']],
      ['She ___ the stamps carefully onto the envelope.', 'stuck', ['drew', 'wrote', 'clipped']],
      ['The monkey ___ from branch to branch high above us.', 'swung', ['crawled', 'waddled', 'slithered']],
      ['Grandpa ___ the seeds evenly over the freshly dug soil.', 'scattered', ['piled', 'buried', 'stacked']],
      ['The goalkeeper ___ across the goal to stop the ball.', 'dived', ['stepped', 'walked', 'turned']],
    ];
    const p3UpperRows = [
      ['The golden retriever ___ its tail so vigorously when it recognises its owner\'s car in the driveway that its whole body shakes.', 'wags', ['flaps', 'waves', 'shakes']],
      ['The forensic technician carefully ___ the surface of the evidence tray before dusting it for fingerprints at the scene.', 'wiped', ['rubbed', 'mopped', 'brushed']],
      ['Security footage showed a figure ___ through the emergency exit while the guard was occupied at the front desk.', 'sneaking', ['crawling', 'strolling', 'marching']],
      ['The nature photographer spent three hours flat on the ground, watching a caterpillar ___ along the underside of a broad leaf.', 'crawling', ['sliding', 'trotting', 'travelling']],
      ['The python ___ through the underbrush with barely a rustle, keeping its eyes fixed on the unsuspecting prey ahead.', 'slithered', ['slid', 'crept', 'glided']],
      ['The elderly professor ___ into the wrong lecture hall and had begun speaking for several minutes before anyone dared to interrupt.', 'wandered', ['marched', 'strolled', 'travelled']],
      ['The ancient vase ___ when it fell from the display case, scattering fragments across the polished museum floor.', 'shattered', ['exploded', 'burst', 'crashed']],
      ['The pastry chef ___ the egg whites until they formed stiff peaks, then folded them gently into the cake mixture.', 'whisked', ['poured', 'sliced', 'fried']],
      ['She ___ her chamomile tea in silence, reading through the final draft of her speech one last time before the ceremony.', 'sipped', ['gulped', 'chewed', 'spilled']],
      ['The cheetah ___ on the gazelle with breathtaking speed, ending a chase that had stretched nearly four hundred metres across the plain.', 'pounced', ['leaped', 'snapped', 'dashed']],
      ['Workers ___ the elaborate festival decorations across the entire length of the street, transforming it in preparation for the night\'s celebration.', 'hung', ['draped', 'placed', 'dropped']],
      ['The mountaineers ___ their packs and began the steep ascent before sunrise, hoping to reach the summit by noon before the clouds moved in.', 'hoisted', ['carried', 'threw', 'held']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : p3UpperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'actionVerbs', subskill: 'action_verb', q, choices: buildChoices(answer, ds), answer, explain: 'Each action has a precise verb — pick the one that matches the movement, speed and surface.' };
  },
  soundVerbs(level, i) {
    const p1p2Rows = [
      ['Every morning, I can hear birds ___ outside my window.', 'chirping', ['humming', 'cheeping', 'screeching']],
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
      ['The crowd ___ in delight when the magician pulled a rabbit from his hat.', 'gasped', ['sighed', 'screamed', 'mumbled']],
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
      ['As dawn broke over the nature reserve, dozens of bird species began ___ in the treetops, filling the air with a rich layering of sound.', 'chirping', ['humming', 'cheeping', 'screeching']],
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
      ['The audience ___ in unison when the trapeze artist released his grip at the very peak of the arc and appeared to plummet towards the net below.', 'gasped', ['sighed', 'screamed', 'mumbled']],
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
      ['When the judges announced her name as the first-prize winner, Alison was so ___ that she could barely manage her acceptance speech.', 'delighted', ['upset', 'excited', 'surprised']],
      ['Visitors to the science exhibition were ___ at the working robot that could solve a Rubik\'s cube in under thirty seconds.', 'amazed', ['frightened', 'delighted', 'angry']],
      ['Whenever Steve has not slept well the night before an examination, he tends to be in a particularly ___ mood throughout the day.', 'grumpy', ['jolly', 'lazy', 'miserable']],
      ['Although she had rehearsed the piece over a hundred times, she still felt ___ the moment she sat down before the panel of judges.', 'nervous', ['excited', 'annoyed', 'discouraged']],
      ['Stranded at the airport without her phone or boarding pass, she felt completely ___ and unsure what steps to take next.', 'miserable', ['nasty', 'disappointed', 'discouraged']],
      ['The entire class was ___ by the magician\'s final trick, and not even the teacher could work out how it had been done.', 'puzzled', ['curious', 'amazed', 'dazed']],
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
      ['After running the race, John was as fast as a ___.', 'cheetah', ['turtle', 'snail', 'whale']],
      ['The kitten\'s fur felt as soft as ___.', 'silk', ['sand', 'rock', 'wood']],
      ['Our prefect, Aliya, is as brave as a ___ when she stops bullies in school.', 'lion', ['mouse', 'rabbit', 'parrot']],
      ['Daniel was as busy as a ___ during the school carnival.', 'bee', ['bear', 'sloth', 'cat']],
      ['The old man\'s skin was as rough as ___.', 'sandpaper', ['cotton', 'silk', 'velvet']],
      ['Her answer was as clear as ___ — there was no doubt at all.', 'crystal', ['mud', 'sand', 'glass']],
      ['He was as stubborn as a ___ and refused to change his mind.', 'mule', ['cat', 'rabbit', 'fox']],
      ['The twins are as alike as two peas in a ___.', 'pod', ['bag', 'box', 'basket']],
      ['Her memory is as sharp as a ___ — she never forgets a face.', 'tack', ['knife', 'pin', 'pencil']],
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
      ['Even a decade after the event, Grandma\'s memory was as sharp as a ___, and she could recall every name and detail from that day.', 'tack', ['knife', 'pin', 'pencil']],
      ['After completing the gruelling orienteering course through the jungle trail, the scouts were as hungry as ___ and devoured every scrap of food in sight.', 'wolves', ['birds', 'fish', 'ducks']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p1p2Rows : p3UpperRows;
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
      ['The ambulance sped ___ through the traffic to reach the patient.', 'swiftly', ['calmly', 'lazily', 'carefully']],
      ['The thief moved ___ through the dark corridor so as not to make a sound.', 'stealthily', ['boldly', 'noisily', 'carelessly']],
      ['She answered the teacher\'s question ___ without hesitation.', 'confidently', ['shyly', 'reluctantly', 'vaguely']],
      ['The wounded soldier crawled ___ towards the shelter.', 'painfully', ['comfortably', 'swiftly', 'playfully']],
      ['He practised the piano ___ every evening until he mastered the piece.', 'diligently', ['casually', 'lazily', 'reluctantly']],
      ['The baby slept ___ in her mother\'s arms throughout the journey.', 'peacefully', ['restlessly', 'noisily', 'alertly']],
      ['The librarian spoke ___ so as not to disturb the readers.', 'softly', ['loudly', 'harshly', 'briskly']],
      ['The gymnast landed ___ on the mat after her somersault.', 'gracefully', ['clumsily', 'heavily', 'roughly']],
      ['He waited ___ in line even though the queue was very long.', 'patiently', ['angrily', 'restlessly', 'rudely']],
      ['The children cheered ___ when the extra holiday was announced.', 'joyfully', ['sadly', 'quietly', 'bitterly']],
      ['She carried the tray of glasses ___ across the crowded room.', 'carefully', ['carelessly', 'hurriedly', 'roughly']],
      ['The detective examined the footprints ___ before drawing any conclusions.', 'closely', ['briefly', 'blindly', 'loosely']],
      ['The knight fought ___ to defend the castle gates.', 'bravely', ['fearfully', 'weakly', 'timidly']],
      ['He shut the gate ___ behind him so the dog could not escape.', 'firmly', ['loosely', 'lazily', 'faintly']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'mannerAdverbs', subskill: 'adverb_manner', q, choices: buildChoices(answer, ds), answer, explain: 'An adverb of manner describes HOW an action is done — match the adverb to the mood and intensity of the scene.' };
  },
  phrasalVerbs(level, i) {
    const rows = [
      ['The prisoners succeeded in ___ of prison by using a secret underground tunnel.', 'breaking out', ['breaking into', 'breaking up', 'breaking through']],
      ['The business deal ___ because both sides could not agree on many matters.', 'fell through', ['fell out', 'fell behind', 'fell over']],
      ['Ali is very ___ with his sister — they share everything.', 'close to', ['close with', 'close on', 'close at']],
      ['Please ___ the music. We can\'t hear ourselves think.', 'turn down', ['turn off', 'turn over', 'turn out']],
      ['I am ___ to my birthday next week.', 'looking forward', ['looking up', 'looking out', 'looking after']],
      ['The teacher told us to ___ our textbooks to page 42.', 'turn to', ['turn over', 'turn down', 'turn in']],
      ['Mum said I had to ___ my room before going out.', 'tidy up', ['give up', 'turn up', 'take up']],
      ['I ___ my old photo album while clearing the storeroom and found many childhood memories.', 'came across', ['came over', 'came along', 'came through']],
      ['Despite training hard all year, the team decided to ___ just before the finals.', 'give up', ['give in', 'give out', 'give away']],
      ['The school concert was ___ because the hall was flooded after the heavy rain.', 'called off', ['called out', 'called up', 'called for']],
      ['The scientist ___ a series of experiments to test her new theory.', 'carried out', ['carried on', 'carried over', 'carried away']],
      ['We have ___ milk. Could you buy some on your way home?', 'run out of', ['run into', 'run over', 'run through']],
      ['The teacher ___ that the answer to question 5 was on the board all along.', 'pointed out', ['pointed at', 'pointed to', 'pointed up']],
      ['My father ___ his own business after working for a large company for twenty years.', 'set up', ['set off', 'set out', 'set aside']],
      ['She had to ___ a very difficult period after her grandmother passed away.', 'go through', ['go over', 'go along', 'go into']],
      ['My sister and I always ___ after an argument — we cannot stay angry at each other for long.', 'make up', ['make out', 'make over', 'make for']],
      ['My brother decided to ___ swimming as a hobby after watching the Olympics.', 'take up', ['take on', 'take over', 'take off']],
      ['The manager had to ___ a difficult decision that affected the whole team.', 'face up to', ['face off with', 'face down from', 'face away from']],
      ['He was so excited that he could not ___ the urge to share the news.', 'hold back', ['hold on', 'hold out', 'hold up']],
      ['The volunteers ___ enough food to feed the entire shelter for a week.', 'gathered up', ['used up', 'gave out', 'called off']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'phrasalVerbs', subskill: 'phrasal_verb_meaning', q, choices: buildChoices(answer, ds), answer, explain: 'Phrasal verbs combine a verb + particle into a fixed meaning — come across (encounter), give up (stop trying), call off (cancel), carry out (perform), run out of (exhaust supply).' };
  },
  verbDistinction(level, i) {
    const p1p2Rows = [
      ['May I ___ a colour pencil from you?', 'borrow', ['get', 'lend', 'use']],
      ['I ___ my grandmother a birthday card. She received it in her mailbox today.', 'sent', ['fetched', 'took', 'picked']],
      ['Please ___ me your eraser; I will return it after class.', 'lend', ['borrow', 'give', 'pass']],
      ['Father will ___ me from school at three o\'clock today.', 'fetch', ['send', 'borrow', 'leave']],
      ['Sara ___ her brother to the park on her bicycle.', 'took', ['brought', 'fetched', 'sent']],
      ['Could you ___ the salt over here, please?', 'pass', ['lend', 'borrow', 'send']],
      ['She ___ her younger sister from their home to the bus stop every morning.', 'takes', ['brings', 'fetches', 'carries']],
      ['He forgot his wallet, so his mother had to ___ it to him at school.', 'bring', ['fetch', 'lend', 'send']],
      ['He will ___ his friend the book and expect it back next week.', 'lend', ['give', 'borrow', 'pass']],
      ['The teacher ___ all the marked test papers back to us.', 'returned', ['sent', 'delivered', 'passed']],
      ['May I ___ this book from the library for two weeks?', 'borrow', ['rent', 'lend', 'take']],
      ['She ___ her grandfather to the clinic and waited with him there.', 'brought', ['fetched', 'sent', 'delivered']],
      ['Did you ___ the loud thunder last night?', 'hear', ['listen', 'sound', 'watch']],
      ['We sat quietly to ___ to the principal\'s speech.', 'listen', ['hear', 'sound', 'speak']],
      ['Grandma likes to ___ us stories about her childhood.', 'tell', ['say', 'speak', 'talk']],
      ['"Please ___ sorry to your brother," Mum said firmly.', 'say', ['tell', 'speak', 'talk']],
      ['I ___ television for an hour after finishing my homework.', 'watched', ['saw', 'looked', 'stared']],
      ['Remember to ___ your homework before playing any games.', 'do', ['make', 'take', 'have']],
      ['Did you ___ your bed before leaving for school this morning?', 'make', ['do', 'fix', 'set']],
      ['It is chilly today, so ___ a jacket when you go out.', 'wear', ['put', 'dress', 'carry']],
    ];
    const p3UpperRows = [
      ['Before the examination began, Jun discovered she had forgotten her ruler and had to ___ one from the student sitting in the next row.', 'borrow', ['get', 'lend', 'use']],
      ['The school principal ___ a letter of congratulations to each finalist, acknowledging the effort they had sustained throughout the competition.', 'sent', ['fetched', 'took', 'picked']],
      ['The librarian offered to ___ Priya a digital recorder so she could capture her interview with the visiting guest author after school.', 'lend', ['borrow', 'give', 'pass']],
      ['Dad had arranged to ___ the children from the sports complex once the inter-school swimming competition had concluded for the day.', 'fetch', ['send', 'borrow', 'leave']],
      ['The senior guide ___ the new recruits to the campsite via a longer route so that they could observe the wildlife along the way.', 'took', ['brought', 'fetched', 'sent']],
      ['Could you ___ the reference books along the row, please, so that everyone has a chance to consult the same chapter?', 'pass', ['lend', 'borrow', 'send']],
      ['Every Tuesday morning, the caretaker ___ the sports equipment out of the storeroom before physical education lessons begin on the field.', 'brings', ['fetches', 'sends', 'takes']],
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
    const rows = [
      ['The snake ___ silently through the tall grass towards the pond.', 'slithered', ['galloped', 'soared', 'waded']],
      ['The horse ___ gracefully across the open field, kicking up dust.', 'galloped', ['slithered', 'waddled', 'lumbered']],
      ['The eagle ___ high above the mountains, searching for prey below.', 'soared', ['prowled', 'waded', 'scurried']],
      ['The rabbit ___ away into the bushes when it heard a loud noise.', 'scurried', ['lumbered', 'soared', 'galloped']],
      ['The hippopotamus ___ slowly through the muddy river shallows.', 'waded', ['soared', 'galloped', 'scurried']],
      ['The tiger ___ silently through the jungle, watching the deer.', 'prowled', ['waded', 'scurried', 'galloped']],
      ['The old bear ___ out of the cave after its long winter sleep.', 'lumbered', ['darted', 'soared', 'prowled']],
      ['The hawk ___ from the sky and snatched the mouse in its talons.', 'swooped', ['lumbered', 'waded', 'galloped']],
      ['The frog ___ from one lily pad to the next across the pond.', 'leaped', ['slithered', 'lumbered', 'prowled']],
      ['The little crab ___ sideways across the sandy beach at low tide.', 'scuttled', ['soared', 'galloped', 'waded']],
      ['The monkey ___ up the tall tree trunk using its strong limbs.', 'scrambled', ['galloped', 'waded', 'prowled']],
      ['The kangaroo ___ across the dry plains with powerful bounding leaps.', 'bounded', ['slithered', 'waded', 'lumbered']],
      ['The cat ___ slowly towards the sleeping mouse, making no sound.', 'crept', ['galloped', 'soared', 'bounded']],
      ['The duck ___ gently across the calm lake on a quiet morning.', 'paddled', ['galloped', 'prowled', 'scurried']],
      ['The deer ___ gracefully over the low fence and into the forest.', 'leaped', ['waded', 'lumbered', 'scuttled']],
      ['The penguin ___ clumsily across the ice towards the sea.', 'waddled', ['galloped', 'slithered', 'soared']],
      ['The squirrel ___ up the tree the moment the dog barked.', 'darted', ['lumbered', 'waded', 'waddled']],
      ['The butterfly ___ from flower to flower in the school garden.', 'fluttered', ['stomped', 'crawled', 'plodded']],
      ['The elephant ___ heavily through the forest, shaking the ground.', 'plodded', ['darted', 'fluttered', 'scuttled']],
      ['The dolphin ___ out of the water and splashed back into the waves.', 'leapt', ['crept', 'plodded', 'waddled']],
      ['The worm ___ slowly through the damp soil after the rain.', 'burrowed', ['galloped', 'soared', 'swooped']],
      ['The lizard ___ quickly up the wall and out of the window.', 'darted', ['plodded', 'waddled', 'lumbered']],
      ['The swan ___ smoothly across the still surface of the lake.', 'glided', ['stomped', 'scrambled', 'scuttled']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { category: 'movementVerbs', subskill: 'animal_movement', q, choices: buildChoices(answer, ds), answer, explain: 'Each animal has its own way of moving — match the verb to how that animal travels.' };
  },
};

function toCanonicalCategory(cat) {
  if (cat === 'wordParts') return 'morphologicalAffix';
  return cat;
}

function buildLevel(level) {
  const cats = LEVEL_CATEGORY_PLAN[level];
  const items = [];
  const sessionSeed = Math.floor(Math.random() * 10);

  for (const baseCat of cats) {
    for (let localOffset = 0; localOffset < MIN_QUESTIONS_PER_SCOPE; localOffset += 1) {
      const localIndex = sessionSeed + localOffset;
      const spec = varyMcqNames(VOCAB_BUILDERS[baseCat](level, localIndex), localOffset);
      const variant = contextualizeMcqQuestion(spec.q, localOffset, level);
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

  return items;
}

export const VOCAB_MCQ_ITEMS = Object.fromEntries(
  VOCAB_MCQ_LEVELS.map(level => [level, buildLevel(level)]),
);

/** Build a fresh item set for one level with a new random seed — call this each session. */
export function buildVocabMcqLevel(level) {
  return buildLevel(level);
}
