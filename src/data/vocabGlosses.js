/**
 * PhonicsQuest – Vocabulary glosses and teaching explanations
 *
 * A tutor closes a vocabulary miss by teaching the word, not by restating the
 * answer key. This module holds one-line child-friendly glosses for the words
 * used in the fact-based vocabulary categories, plus generators that turn
 * them into per-choice explanations: every wrong choice is explained by what
 * that word actually means, and every reveal teaches the target word.
 *
 * Categories with hand-authored per-choice explanations in vocabMcq.js
 * (contextInference, definitionMatch, synonymContrast, collocationCloze) are
 * untouched — authored text still wins. Everything else routes through
 * `makeVocabTeachingExplanations`, falling back to the old generic line only
 * for a choice with no gloss and no template.
 */

// ── Word glosses ──────────────────────────────────────────────────────────
// Keep each gloss a lowercase fragment that reads after "X — …" and inside
// "“X” means …". One line per word; alphabetical within its group.

export const WORD_GLOSSES = {
  // sound verbs (animal + human sounds)
  bark: 'the short, loud sound a dog makes',
  barked: 'made the short, loud sound of a dog',
  barking: 'making the short, loud sound of a dog',
  bleated: 'made the wavering cry of a sheep or goat',
  brayed: 'made the loud, harsh cry of a donkey',
  buzzing: 'making the low humming sound of bees or insects',
  caw: 'the harsh cry of a crow',
  cawed: 'made the harsh cry of a crow',
  cheeping: 'making the faint, high sound of a baby bird',
  chirp: 'the short, high sound of a small bird',
  chirped: 'made the short, high sound of a small bird',
  chirping: 'making the short, high sounds of small birds',
  clucked: 'made the short, low sounds of a hen',
  cooed: 'made the soft, gentle sound of a pigeon or dove',
  croaked: 'made the deep, rough sound of a frog',
  crow: 'the loud cry a rooster makes at dawn',
  crowed: 'made the loud cry of a rooster',
  crowing: 'making the loud cry of a rooster',
  gasped: 'took in a sudden sharp breath in surprise',
  growl: 'the low, angry rumble of a dog or bear',
  growled: 'made a low, angry rumbling sound',
  grunted: 'made the short, low sound of a pig',
  hissed: 'made the sharp "sss" sound of a snake',
  hissing: 'the sharp "sss" sound a snake makes',
  honked: 'made the loud horn-like cry of a goose',
  hooted: 'made the deep "hoo" call of an owl',
  hooting: 'making the deep "hoo" call of an owl',
  howl: 'the long, mournful cry of a wolf or dog',
  howled: 'made the long, mournful cry of a wolf',
  hum: 'a soft, steady sound made with closed lips',
  humming: 'making a soft, steady sound with closed lips',
  meowed: 'made the familiar crying sound of a cat',
  mewed: 'made the soft, weak cry of a kitten',
  mumbled: 'spoke in a low, unclear way',
  neighed: 'made the loud, high cry of a horse',
  purred: 'made the soft, steady rumble of a contented cat',
  quacked: 'made the flat, honking sound of a duck',
  roar: 'the deep, powerful cry of a lion',
  roared: 'made the deep, powerful cry of a lion',
  roaring: 'making the deep, powerful cry of a lion',
  screamed: 'gave a loud, high cry of fear or excitement',
  screech: 'a loud, harsh, high-pitched cry',
  screeching: 'making a loud, harsh, high-pitched cry',
  sigh: 'a long breath out that shows tiredness or relief',
  sighed: 'let out a long breath showing tiredness or relief',
  squawk: 'the loud, harsh cry of a startled bird',
  squeaked: 'made the tiny, high sound of a mouse',
  squeal: 'a long, high-pitched cry',
  yowled: 'made the long, wailing cry of an unhappy cat',

  // movement verbs
  bounded: 'moved in big, energetic leaps',
  burrowed: 'dug and pushed through soil',
  crawled: 'moved slowly with the body close to the ground',
  crept: 'moved slowly, quietly and carefully',
  darted: 'moved suddenly and very fast',
  fluttered: 'flew with quick, light wing beats',
  galloped: 'ran at full speed the way a horse does',
  glided: 'moved smoothly without effort',
  leaped: 'jumped high or far',
  leapt: 'jumped high or far',
  lumbered: 'moved in a slow, heavy, clumsy way',
  paddled: 'moved through water using feet or paws',
  plodded: 'walked slowly with heavy steps',
  prowled: 'moved quietly while hunting',
  scrambled: 'climbed or moved quickly using hands and feet',
  scurried: 'ran with quick, short steps',
  scuttled: 'ran quickly with short steps, like a crab',
  slithered: 'slid along the ground the way a snake does',
  soared: 'flew high with little effort',
  stomped: 'walked with loud, heavy, angry steps',
  swooped: 'flew down suddenly through the air',
  waddled: 'walked with short steps, rocking side to side, like a duck',
  waded: 'walked through water',

  // movement verbs — added with the level-banded pools
  dug: 'made a hole by moving earth away',
  flew: 'moved through the air',
  hopped: 'made short jumps, usually on one or both feet',
  limped: 'walked unevenly because of an injured leg',
  marched: 'walked with regular, measured steps',
  ran: 'moved quickly on foot',
  surged: 'moved forward suddenly and powerfully, like a wave',
  swam: 'moved through water',
  trudged: 'walked slowly and heavily, as if worn out',

  // collective nouns and containers
  army: 'the collective noun for ants (an army of ants) or soldiers',
  band: 'a group of musicians playing together',
  bar: 'a solid block, used for chocolate or soap',
  block: 'a solid piece, used for flats or ice',
  bowl: 'a round, deep dish for food',
  box: 'a container with straight sides and a lid, used for crayons or tissues',
  bunch: 'things growing or gathered together, like bananas or keys',
  bundle: 'things tied loosely together, like sticks or clothes',
  carton: 'a box-shaped container for drinks or eggs',
  colony: 'the collective noun for ants or bats living together',
  container: 'a general word for anything that holds things',
  crew: 'the team working on a ship, plane or project',
  cup: 'a small container for drinking',
  fleet: 'a group of ships or vehicles',
  flight: 'the collective noun for stairs (a flight of stairs)',
  flock: 'the collective noun for birds or sheep',
  gang: 'a group of workers or troublemakers',
  garland: 'flowers strung together in a circle',
  group: 'the general word for people or things gathered together',
  heap: 'an untidy pile',
  herd: 'the collective noun for cattle, elephants or grazing animals',
  ladder: 'a climbing frame of steps — not a group word',
  line: 'people or things arranged one behind another',
  litter: 'the collective noun for puppies or kittens born together',
  loaf: 'a shaped block of baked bread',
  nest: 'the home a bird builds — not a group word',
  pack: 'the collective noun for wolves or playing cards',
  pile: 'things stacked on top of each other',
  pride: 'the collective noun for lions',
  row: 'things arranged side by side in a line',
  school: 'the collective noun for fish swimming together',
  sheet: 'a thin, flat piece, used for paper or metal',
  slice: 'a thin, flat piece cut from something',
  stack: 'a neat pile, one thing on top of another',
  string: 'things threaded together, like beads or pearls',
  swarm: 'the collective noun for bees or flying insects',
  tray: 'a flat board for carrying food',
  troop: 'the collective noun for monkeys or scouts',
  troupe: 'a group of performers, like dancers or actors',
  tub: 'a round, open container, used for ice cream or margarine',

  // animal body parts
  antlers: 'the branching horns on a deer’s head',
  beak: 'the hard, pointed mouth of a bird',
  body: 'the whole of an animal, not one special part',
  claws: 'the sharp, curved nails on an animal’s feet',
  ears: 'the parts used for hearing',
  eyelashes: 'the small hairs along the edge of the eyelid',
  fangs: 'the long, sharp teeth of a snake or a wolf',
  feathers: 'the light covering that birds have',
  fins: 'the thin flaps a fish swims with',
  fleece: 'the woolly coat of a sheep',
  flippers: 'the wide, flat limbs a seal or penguin swims with',
  'front legs': 'the two legs at the front of an animal',
  fur: 'the soft, thick hair covering many animals',
  gills: 'the parts a fish breathes with underwater',
  'hind legs': 'the two legs at the back of an animal',
  hooves: 'the hard feet of horses, cows and goats',
  horn: 'a single hard, pointed growth on an animal’s head',
  horns: 'the hard, pointed growths on the heads of cattle or goats',
  hump: 'the raised store of fat on a camel’s back',
  legs: 'the limbs an animal walks on',
  mane: 'the long hair on the neck of a lion or horse',
  paw: 'the soft foot of a cat, dog or bear',
  paws: 'the soft feet of cats, dogs and bears',
  pincers: 'the gripping claws of a crab or scorpion',
  pouch: 'the pocket of skin a kangaroo carries its young in',
  scales: 'the small, hard plates covering fish and reptiles',
  shell: 'the hard covering of a snail, crab or tortoise',
  skin: 'the outer covering of a body',
  spines: 'the sharp, stiff points on a hedgehog or porcupine',
  tail: 'the part that extends from the back of an animal’s body',
  'tail fin': 'the fin at the end of a fish’s body',
  tails: 'the parts extending from the backs of animals’ bodies',
  talons: 'the sharp, hooked claws of an eagle or owl',
  trunk: 'the long, flexible nose of an elephant',
  tusks: 'the long, curved teeth of an elephant or walrus',
  whiskers: 'the long, sensitive hairs on an animal’s face',
  wing: 'the part a bird or insect flies with',
  wings: 'the parts a bird or insect flies with',
  wool: 'the soft, curly hair that sheep grow',

  // place nouns
  airport: 'the place where planes take off and land',
  aquarium: 'the place where sea creatures are kept for viewing',
  arena: 'a large space for sports or shows with seats around it',
  bakery: 'the shop where bread and cakes are baked and sold',
  'bus stop': 'the place where you wait to board a bus',
  canteen: 'the place in a school where meals are sold and eaten',
  'car park': 'the place where cars are parked',
  'changing room': 'the room where people change their clothes',
  cinema: 'the place where films are shown on a big screen',
  classroom: 'the room where lessons are taught',
  clinic: 'the place where a doctor sees patients',
  'clinic room': 'a room in a clinic where a patient is examined',
  corridor: 'a long passage inside a building',
  court: 'a marked space for games like basketball, or where a judge works',
  depot: 'the place where buses or goods are kept',
  desert: 'a dry, sandy land with very little rain',
  driveway: 'the short private road leading to a house',
  entrance: 'the way into a place',
  exit: 'the way out of a place',
  farm: 'the place where crops are grown and animals are raised',
  field: 'an open grassy space for games or crops',
  forest: 'a large area thickly covered with trees',
  foundry: 'the workshop where metal is melted and shaped',
  gallery: 'the place where art is displayed',
  garage: 'the place where a car is kept or repaired',
  gymnasium: 'the hall used for indoor exercise and sport',
  hall: 'a large room for assemblies and events',
  harbour: 'the sheltered water where ships anchor',
  hospital: 'the place where sick and injured people are treated',
  'hospital ward': 'the room in a hospital where patients stay in beds',
  jungle: 'a thick, tropical forest',
  kitchen: 'the room where food is cooked',
  laboratory: 'the room where science experiments are done',
  library: 'the place where books are kept for borrowing and reading',
  lobby: 'the entrance hall of a building',
  mall: 'a large building full of different shops',
  market: 'the place where fresh food and goods are bought and sold',
  meadow: 'a field of grass and wild flowers',
  museum: 'the place where important objects are displayed',
  nursery: 'the place where young children are cared for, or young plants are grown',
  office: 'the room where people do desk work',
  orchard: 'a field of fruit trees',
  'petrol station': 'the place where vehicles fill up with fuel',
  pharmacy: 'the shop where medicines are prepared and sold',
  planetarium: 'the domed theatre that shows the night sky',
  quarry: 'the place where stone is dug out of the ground',
  reservoir: 'the man-made lake where water is stored',
  restaurant: 'the place where meals are cooked and served to customers',
  sawmill: 'the factory where logs are cut into planks',
  shop: 'a place where things are sold',
  sickbay: 'the room in a school where an unwell pupil rests',
  stadium: 'the large sports ground with seats for spectators',
  'staff room': 'the room where teachers work between lessons',
  stall: 'a small open-fronted shop or table selling things',
  station: 'the place where trains or buses pick up passengers',
  'store room': 'the room where equipment and supplies are kept',
  studio: 'the room where an artist, dancer or broadcaster works',
  surgery: 'the room where a doctor or dentist treats patients',
  'taxi stand': 'the place where taxis wait for passengers',
  theatre: 'the place where plays are performed on a stage',
  warehouse: 'the large building where goods are stored',
  workshop: 'the place where things are made or repaired with tools',

  // verb distinctions (direction / exchange / speech / perception)
  borrow: 'to take something for a while and return it later',
  bring: 'to carry something towards the speaker or to where they will be',
  brings: 'carries something towards the speaker or to where they will be',
  brought: 'carried something (or someone) along to a place',
  carries: 'holds something and moves with it',
  carry: 'to hold something and move with it',
  delivered: 'took goods to the person they were meant for',
  do: 'to carry out a task or activity',
  dress: 'to put clothes on a person',
  fetch: 'to go somewhere, collect someone or something, and come back',
  fetched: 'went, collected someone or something, and came back',
  fetches: 'goes, collects someone or something, and comes back',
  fix: 'to repair something broken',
  get: 'to receive or obtain something',
  give: 'to hand something over for keeps',
  have: 'to own or hold something',
  hear: 'to notice a sound with your ears, without trying',
  keep: 'to continue holding something and not return it',
  leave: 'to go away from a place, or let something stay behind',
  lend: 'to let someone use your things for a while',
  listen: 'to pay attention to a sound on purpose',
  looked: 'directed your eyes at something on purpose',
  make: 'to create or produce something',
  pass: 'to hand something to someone nearby',
  passed: 'handed something to someone nearby',
  picked: 'chose or plucked something',
  put: 'to place something somewhere',
  rent: 'to pay money to use something',
  returned: 'gave or went back',
  saw: 'noticed something with your eyes',
  say: 'to speak words (you say something)',
  send: 'to make something or someone go to another place without you',
  sends: 'makes something or someone go to another place without going along',
  sent: 'made something or someone go to another place',
  set: 'to place carefully or arrange',
  sound: 'to seem a certain way when heard',
  speak: 'to use your voice to talk',
  stared: 'looked at one thing for a long time without moving your eyes',
  take: 'to carry something or someone away from here to another place',
  takes: 'carries something or someone away from here to another place',
  talk: 'to have a conversation',
  tell: 'to give information to a person (you tell someone something)',
  took: 'carried something or someone along to another place',
  use: 'to do something with a tool or object',
  watch: 'to look at something for a time, following what happens',
  watched: 'looked at something for a time, following what happened',
  wear: 'to have clothes on your body',

  // emotion adjectives
  afraid: 'feeling fear',
  amazed: 'feeling great surprise and wonder',
  amused: 'finding something funny',
  angry: 'feeling strong annoyance',
  annoyed: 'feeling slightly angry',
  ashamed: 'feeling bad about something wrong you did',
  bored: 'tired of something dull',
  calm: 'peaceful and not worried',
  careless: 'not taking enough care',
  cheerful: 'happy and lively',
  confident: 'sure of yourself and your ability',
  confused: 'unable to understand what is happening',
  curious: 'eager to find out about something',
  dazed: 'unable to think clearly after a shock',
  delighted: 'very pleased',
  disappointed: 'sad because something hoped for did not happen',
  discouraged: 'having lost hope and confidence',
  embarrassed: 'awkward and ashamed in front of others',
  excited: 'very eager and full of energy about something',
  famous: 'known by many people — a fact, not a feeling',
  fond: 'liking someone or something very much',
  frightened: 'feeling sudden fear',
  furious: 'extremely angry',
  grateful: 'thankful for something received',
  grumpy: 'in a bad mood and easily annoyed',
  honest: 'always telling the truth',
  hopeful: 'expecting something good to happen',
  hurt: 'feeling emotional or physical pain',
  jealous: 'unhappy because someone has what you want',
  jolly: 'happy and full of fun',
  lazy: 'unwilling to work or make an effort',
  mischievous: 'playfully naughty',
  miserable: 'very unhappy',
  nasty: 'unkind and unpleasant',
  nervous: 'worried and slightly afraid about what may happen',
  patient: 'able to wait calmly without complaining',
  pleased: 'happy and satisfied',
  proud: 'feeling pleased about something you or others achieved',
  puzzled: 'confused because something makes no sense',
  relieved: 'glad because a worry has passed',
  sleepy: 'ready to fall asleep',
  sly: 'clever in a secretive, tricky way',
  sorry: 'feeling regret for something done',
  sure: 'certain, with no doubt',
  surprised: 'feeling that something unexpected has happened',
  terrified: 'extremely frightened',
  thrilled: 'extremely excited and pleased',
  tired: 'needing rest',
  truthful: 'telling the truth',
  upset: 'unhappy and troubled',
  worried: 'anxious about a problem',

  // phrasal verbs
  'breaking into': 'entering a place by force',
  'breaking out': 'escaping from a place',
  'breaking through': 'forcing a way past a barrier',
  'breaking up': 'ending a relationship, or separating into pieces',
  'called for': 'demanded, or went to collect someone',
  'called off': 'cancelled',
  'called out': 'shouted, or summoned for duty',
  'called up': 'telephoned, or summoned for service',
  'came across': 'found by chance',
  'came along': 'accompanied someone, or arrived',
  'came over': 'visited, or affected someone suddenly',
  'came through': 'survived a difficulty, or delivered as promised',
  'carried away': 'so excited that control is lost',
  'carried on': 'continued',
  'carried out': 'performed or completed a task',
  'carried over': 'moved to a later time',
  'close at': 'not a phrasal expression — "close at hand" needs "hand"',
  'close on': 'not the expression — nearness to a person is "close to"',
  'close to': 'near to, or having a strong bond with',
  'close with': 'not the expression — English says "close to" someone',
  'face away from': 'to turn so your front is not towards something',
  'face down from': 'not an English expression',
  'face off with': 'to confront an opponent in a contest',
  'face up to': 'to accept and deal with something difficult',
  'fell behind': 'failed to keep up',
  'fell out': 'quarrelled and stopped being friendly',
  'fell over': 'toppled to the ground',
  'fell through': 'failed to happen; collapsed (of a plan or deal)',
  'gathered up': 'collected together',
  'gave out': 'distributed, or stopped working',
  'give away': 'to hand over for free, or reveal a secret',
  'give in': 'to surrender to pressure',
  'give out': 'to distribute, or stop working',
  'give up': 'to stop trying',
  'go along': 'to accompany, or agree with',
  'go into': 'to enter, or examine in detail',
  'go over': 'to review or check',
  'go through': 'to experience something difficult',
  'hold back': 'to stop yourself from doing or showing something',
  'hold on': 'to wait, or grip tightly',
  'hold out': 'to last, or resist',
  'hold up': 'to delay, or support',
  'looking after': 'taking care of',
  'looking forward': 'waiting for something with pleasure (looking forward to)',
  'looking out': 'watching for danger (looking out for)',
  'looking up': 'searching for information, or improving',
  'make for': 'to head towards',
  'make out': 'to see or hear with difficulty',
  'make over': 'to change the appearance of',
  'make up': 'to become friends again after a quarrel, or invent',
  'pointed at': 'aimed a finger towards',
  'pointed out': 'drew attention to',
  'pointed to': 'indicated as evidence',
  'pointed up': 'not the expression — drawing attention is "pointed out"',
  'run into': 'to meet by chance, or collide with',
  'run out of': 'to use up all of something',
  'run over': 'to hit with a vehicle, or exceed time',
  'run through': 'to rehearse, or read quickly',
  'set aside': 'to save for later',
  'set off': 'to begin a journey, or trigger',
  'set out': 'to begin a journey or task with a plan',
  'set up': 'to start a business or arrangement',
  'take off': 'to leave the ground, or remove',
  'take on': 'to accept a challenge or responsibility',
  'take over': 'to gain control of',
  'take up': 'to start a new hobby or activity',
  'tidy up': 'to make a place neat',
  'turn down': 'to reduce the volume, or refuse',
  'turn in': 'to submit work, or go to bed',
  'turn off': 'to stop a device completely',
  'turn out': 'to end up a certain way, or attend',
  'turn over': 'to flip to the other side',
  'turn to': 'to open a page, or go to someone for help',
  'turn up': 'to arrive, or increase the volume',
  'used up': 'finished completely so none is left',

  // phrasal verbs — added with the level-banded pools
  'cut back': 'to reduce the amount of something',
  'gave away': 'handed over for free, or accidentally revealed a secret',
  'gave in': 'surrendered to pressure',
  'gave up': 'stopped trying',
  'got by': 'managed with only just enough',
  'got on': 'boarded a vehicle, or made progress',
  'got up': 'rose from bed or from a seat',
  'look out': 'to watch for danger',
  'got over': 'recovered from an illness, shock or difficulty',
  'look after': 'to take care of someone or something',
  'look into': 'to investigate a matter',
  'cut in': 'to interrupt, or to move in front of others in a queue',
  'cut off': 'to disconnect or separate something',
  'cut up': 'to cut into pieces',
  'fill in': 'to complete a form by writing in the blanks',
  'fill out of': 'not an English expression — a form is "filled in" or "filled out"',
  'fill over': 'not an English expression',
  'fill up': 'to make something completely full',
  'get by': 'to manage with only just enough',
  'get on': 'to board a vehicle, or to make progress',
  'get over': 'to recover from an illness, shock or difficulty',
  'get up': 'to rise from bed or from a seat',
  'give off': 'to send out a smell, heat or light',
  'go off': 'to explode or sound an alarm, or to stop working',
  'go out': 'to leave the house, or to stop burning',
  'look up': 'to search for information, or to improve',
  'pressed in': 'not the expression — continuing despite difficulty is "pressed on"',
  'pressed on': 'continued despite difficulty',
  'pressed out': 'not the expression for continuing despite difficulty',
  'pressed over': 'not an English expression',
  'put away': 'to return something to its proper place',
  'put down': 'to set something on a surface, or to criticise someone',
  'put off': 'to postpone something to a later time',
  'put on': 'to dress yourself in something, or to switch on',
  'put up': 'to raise or build something, or to give someone a place to stay',
  'ruled on': 'gave an official decision about something',
  'ruled out': 'decided that something is impossible and dismissed it',
  'ruled over': 'governed a country or people',
  'ruled up': 'not an English expression',
  'threw away': 'got rid of something as rubbish',
  'throw away': 'to get rid of something as rubbish',
  'throw on': 'to put clothing on hastily',
  'throw over': 'not the expression for discarding — that is "throw away"',
  'throw up': 'to vomit',
  'went along': 'accompanied someone, or agreed with a plan',
  'went off': 'exploded or sounded, or stopped working',
  'went out': 'left the house, or stopped burning',
  'went over': 'reviewed or checked something carefully',
  'wound down': 'gradually reduced an activity towards its end',
  'wound on': 'not an English expression',
  'wound over': 'not an English expression',
  'wound up': 'brought to an end and closed down',
};

// ── Proverb meanings ──────────────────────────────────────────────────────
// Keyed by a distinctive fragment of the proverb stem, so name swaps and
// wrapper frames cannot break the lookup.

export const PROVERB_MEANINGS = [
  ['practice makes', 'doing something many times makes you good at it'],
  ['where there is a will', 'if you truly want something, you will find a way to do it'],
  ['actions speak louder', 'what people do matters more than what they say'],
  ['a stitch in time', 'fixing a small problem early prevents a bigger one later'],
  ['judge a book by its', 'do not decide what something is like from its appearance alone'],
  ['better late than', 'doing something late is better than never doing it at all'],
  ['two heads are better', 'two people working together solve problems better than one alone'],
  ['every cloud has a silver', 'every bad situation has some hidden good in it'],
  ['look before you', 'think carefully before you act'],
  ['the early bird catches', 'the person who acts first gets the reward'],
  ['all that glitters', 'not everything that looks valuable really is'],
  ['a friend in need', 'a person who helps you in hard times is a true friend'],
  ['too many cooks', 'too many people working on one thing spoil it'],
  ['when in rome', 'follow the customs of the place you are in'],
  ['honesty is the best', 'telling the truth is always the wisest choice'],
  ['the pen is mightier', 'writing and ideas achieve more than force'],
];

export function proverbMeaningFor(stem) {
  const lower = String(stem || '').toLowerCase();
  const hit = PROVERB_MEANINGS.find(([key]) => lower.includes(key));
  return hit ? hit[1] : '';
}

// ── Helpers ───────────────────────────────────────────────────────────────

export function getWordGloss(word) {
  return WORD_GLOSSES[String(word || '')] || WORD_GLOSSES[String(word || '').toLowerCase()] || '';
}

function genericWrong(choice, answer) {
  return `“${choice}” does not fit this sentence — the sentence needs “${answer}”.`;
}

function quotedIdiom(stem) {
  const match = String(stem || '').match(/["“”']([^"“”']{3,})["“”']/);
  return match ? match[1].trim() : '';
}

function simileFrame(stem) {
  const match = String(stem || '').match(/as ([a-z]+) as/i);
  return match ? match[1] : '';
}

/** Rough word-form description from a suffix, used only when confident. */
function describeWordForm(word) {
  const w = String(word || '').toLowerCase();
  if (/ness$|ity$|tion$|sion$|ment$/.test(w)) return 'a noun that names a quality or thing';
  if (/[a-z]ly$/.test(w) && !/(ugly|silly|friendly|lovely|lonely|early)$/.test(w))
    return 'an adverb that describes how an action is done';
  if (/ful$|less$|ous$|ive$|able$|ible$/.test(w)) return 'an adjective that describes a noun';
  if (/ing$/.test(w)) return 'an -ing form of a verb';
  return '';
}

// ── The generator ─────────────────────────────────────────────────────────

const GLOSS_CATEGORIES = new Set([
  'soundVerbs', 'movementVerbs', 'collectiveNouns', 'bodyPartsAnimals', 'placeNouns',
  'verbDistinction', 'emotionAdjectives', 'phrasalVerbs',
]);

const DEFINITION_CATEGORIES = new Set(['scienceTechTerms', 'socialStudiesVocab']);

const FORM_CATEGORIES = new Set(['grammaticalRole', 'wordParts', 'morphologicalAffix']);

/**
 * Per-choice teaching explanations derived from the gloss lexicon and the
 * category's structure. Returns a complete choice→text map, or null when the
 * category has no teaching template (caller then uses the generic fallback).
 *
 * @param {{ category: string, q: string, answer: string, choices: string[] }} spec
 * @returns {Record<string, string>|null}
 */
export function makeVocabTeachingExplanations(spec) {
  const { category, q, answer, choices = [] } = spec || {};
  if (!category || !answer || !choices.length) return null;

  const build = (explainChoice) =>
    Object.fromEntries(choices.map((choice) => [choice, explainChoice(choice)]));

  if (GLOSS_CATEGORIES.has(category)) {
    const answerGloss = getWordGloss(answer);
    return build((choice) => {
      if (choice === answer) {
        return answerGloss
          ? `Correct — “${answer}” means ${answerGloss}, which is exactly what this sentence describes.`
          : `Correct — “${answer}” is the word this sentence describes.`;
      }
      const gloss = getWordGloss(choice);
      if (gloss && answerGloss) {
        return `“${choice}” means ${gloss} — not what this sentence describes. It needs “${answer}”: ${answerGloss}.`;
      }
      if (gloss) return `“${choice}” means ${gloss} — not what this sentence describes.`;
      return genericWrong(choice, answer);
    });
  }

  if (category === 'proverbsSayings') {
    const meaning = proverbMeaningFor(q);
    if (!meaning) return null;
    // Upper primary asks what the proverb MEANS or which situation shows it,
    // so the feedback must reason about the situation, not the missing word.
    if (spec.subskill === 'proverb_meaning') {
      return build((choice) =>
        choice === answer
          ? `Correct — the proverb means ${meaning}, and this is the case that shows it.`
          : `“${choice}” does not show the proverb at work: it means ${meaning}.`,
      );
    }
    return build((choice) =>
      choice === answer
        ? `Correct — the proverb ends with “${answer}”. It means ${meaning}.`
        : `“${choice}” is not how this proverb goes — the fixed saying ends with “${answer}”, and it means ${meaning}.`,
    );
  }

  if (category === 'similes') {
    const quality = simileFrame(q);
    if (!quality) return null;
    return build((choice) =>
      choice === answer
        ? `Correct — “as ${quality} as ${answer}” is the fixed English simile; the pairing never changes.`
        : `“As ${quality} as ${choice}” is not the English simile — the fixed saying is “as ${quality} as ${answer}”.`,
    );
  }

  if (category === 'idiomaticExpressions') {
    const idiom = quotedIdiom(q);
    if (!idiom) return null;
    return build((choice) =>
      choice === answer
        ? `Correct — “${idiom}” really means “${answer}”. Idioms carry a figurative meaning, not their literal words.`
        : `“${choice}” is not what “${idiom}” means — the idiom means “${answer}”, whatever its literal words suggest.`,
    );
  }

  if (DEFINITION_CATEGORIES.has(category)) {
    return build((choice) =>
      choice === answer
        ? `Correct — the sentence is the definition of “${answer}”; every clue in it points to this term.`
        : `“${choice}” names a different idea — reread the definition in the sentence: it describes “${answer}”, not “${choice}”.`,
    );
  }

  if (FORM_CATEGORIES.has(category)) {
    const answerForm = describeWordForm(answer);
    return build((choice) => {
      if (choice === answer) {
        return answerForm
          ? `Correct — “${answer}” is ${answerForm}, which is the form this slot in the sentence needs.`
          : `Correct — “${answer}” is the word form that fits this slot in the sentence.`;
      }
      const form = describeWordForm(choice);
      if (form) {
        return `“${choice}” is ${form} — the wrong job for this slot. The sentence needs “${answer}”.`;
      }
      return `“${choice}” is the wrong form of the word for this slot — the sentence needs “${answer}”.`;
    });
  }

  return null;
}
