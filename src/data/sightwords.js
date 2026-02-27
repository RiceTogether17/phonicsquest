/**
 * PhonicsQuest – Sight Word Data
 *
 * Words are organised into quests of 5 each for the card-match game.
 * Curriculum sequence is preserved exactly as supplied.
 *
 * Tiers:
 *   easy   – 10 quests × 5 words  = 50 words   (Quests 1-10)
 *   medium – 74 quests × 5 words
 *            + 1 quest  × 4 words  = 374 words  (Quests 11-85)
 *   hard   – 10 quests × 5 words  = 50 words   (Quests 86-95)
 */

/** All quests in order */
export const SIGHT_QUESTS = [

  /* ── Easy ─────────────────────────────────────────────────────────── */
  { id: 'e1',  tier: 'easy', name: 'Quest 1',  icon: '⭐', words: ['a',     'about',  'above',  'again',  'all'] },
  { id: 'e2',  tier: 'easy', name: 'Quest 2',  icon: '⭐', words: ['also',  'are',    'be',     'came',   'day'] },
  { id: 'e3',  tier: 'easy', name: 'Quest 3',  icon: '⭐', words: ['do',    'does',   'for',    'go',     'he'] },
  { id: 'e4',  tier: 'easy', name: 'Quest 4',  icon: '⭐', words: ['her',   'his',    'how',    'I',      'in'] },
  { id: 'e5',  tier: 'easy', name: 'Quest 5',  icon: '⭐', words: ['into',  'is',     'it',     'know',   'many'] },
  { id: 'e6',  tier: 'easy', name: 'Quest 6',  icon: '⭐', words: ['name',  'not',    'now',    'of',     'on'] },
  { id: 'e7',  tier: 'easy', name: 'Quest 7',  icon: '⭐', words: ['one',   'over',   'said',   'she',    'so'] },
  { id: 'e8',  tier: 'easy', name: 'Quest 8',  icon: '⭐', words: ['some',  'story',  'the',    'their',  'then'] },
  { id: 'e9',  tier: 'easy', name: 'Quest 9',  icon: '⭐', words: ['there', 'this',   'to',     'too',    'want'] },
  { id: 'e10', tier: 'easy', name: 'Quest 10', icon: '⭐', words: ['was',   'were',   'what',   'when',   'white'] },

  /* ── Medium ───────────────────────────────────────────────────────── */
  { id: 'm1',  tier: 'medium', name: 'Quest 11', icon: '🌟', words: ['no',       'me',       'saw',      'two',      'out'] },
  { id: 'm2',  tier: 'medium', name: 'Quest 12', icon: '🌟', words: ['take',     'find',     'they',     'here',     'while'] },
  { id: 'm3',  tier: 'medium', name: 'Quest 13', icon: '🌟', words: ['see',      'would',    'should',   'could',    'good'] },
  { id: 'm4',  tier: 'medium', name: 'Quest 14', icon: '🌟', words: ['made',     'across',   'come',     'water',    'will'] },
  { id: 'm5',  tier: 'medium', name: 'Quest 15', icon: '🌟', words: ['under',    'from',     'cold',     'love',     'put'] },
  { id: 'm6',  tier: 'medium', name: 'Quest 16', icon: '🌟', words: ['other',    'salt',     'because',  'upon',     'before'] },
  { id: 'm7',  tier: 'medium', name: 'Quest 17', icon: '🌟', words: ['until',    'young',    'you',      'who',      'give'] },
  { id: 'm8',  tier: 'medium', name: 'Quest 18', icon: '🌟', words: ['mother',   'brother',  'something','become',   'wolf'] },
  { id: 'm9',  tier: 'medium', name: 'Quest 19', icon: '🌟', words: ['just',     'with',     'must',     'girl',     'boy'] },
  { id: 'm10', tier: 'medium', name: 'Quest 20', icon: '🌟', words: ['where',    'thought',  'fast',     'down',     'watch'] },
  { id: 'm11', tier: 'medium', name: 'Quest 21', icon: '🌟', words: ['head',     'may',      'friend',   'maybe',    'has'] },
  { id: 'm12', tier: 'medium', name: 'Quest 22', icon: '🌟', words: ['have',     'away',     'way',      'make',     'ate'] },
  { id: 'm13', tier: 'medium', name: 'Quest 23', icon: '🌟', words: ['been',     'same',     'say',      'green',    'people'] },
  { id: 'm14', tier: 'medium', name: 'Quest 24', icon: '🌟', words: ['each',     'your',     'happy',    'pretty',   'please'] },
  { id: 'm15', tier: 'medium', name: 'Quest 25', icon: '🌟', words: ['keep',     'leave',    'these',    'sea',      'flies'] },
  { id: 'm16', tier: 'medium', name: 'Quest 26', icon: '🌟', words: ['fly',      'life',     'light',    'myself',   'time'] },
  { id: 'm17', tier: 'medium', name: 'Quest 27', icon: '🌟', words: ['why',      'fine',     'high',     'eye',      'nothing'] },
  { id: 'm18', tier: 'medium', name: 'Quest 28', icon: '🌟', words: ['buy',      'wrote',    'by',       'going',    'own'] },
  { id: 'm19', tier: 'medium', name: 'Quest 29', icon: '🌟', words: ['only',     'ago',      'very',     'though',   'large'] },
  { id: 'm20', tier: 'medium', name: 'Quest 30', icon: '🌟', words: ['goes',     'both',     'home',     "don't",    'any'] },
  { id: 'm21', tier: 'medium', name: 'Quest 31', icon: '🌟', words: ['became',   'began',    'begin',    'change',   'eat'] },
  { id: 'm22', tier: 'medium', name: 'Quest 32', icon: '🌟', words: ['few',      'knew',     'music',    'really',   'through'] },
  { id: 'm23', tier: 'medium', name: 'Quest 33', icon: '🌟', words: ['place',    'move',     'brought',  'inside',   'which'] },
  { id: 'm24', tier: 'medium', name: 'Quest 34', icon: '🌟', words: ['after',    'always',   'aunty',    'work',     'off'] },
  { id: 'm25', tier: 'medium', name: 'Quest 35', icon: '🌟', words: ['behind',   'body',     'family',   'today',    'open'] },
  { id: 'm26', tier: 'medium', name: 'Quest 36', icon: '🌟', words: ['below',    'carry',    'finally',  'try',      'along'] },
  { id: 'm27', tier: 'medium', name: 'Quest 37', icon: '🌟', words: ['between',  'easy',     'funny',    'often',    'done'] },
  { id: 'm28', tier: 'medium', name: 'Quest 38', icon: '🌟', words: ['city',     'eight',    'feel',     'feet',     'great'] },
  { id: 'm29', tier: 'medium', name: 'Quest 39', icon: '🌟', words: ['sleep',    'here',     'without',  'kind',     'might'] },
  { id: 'm30', tier: 'medium', name: 'Quest 40', icon: '🌟', words: ['night',    'nice',     'once',     'rain',     "can't"] },
  { id: 'm31', tier: 'medium', name: 'Quest 41', icon: '🌟', words: ['catch',    'children', "couldn't", 'enough',   'even'] },
  { id: 'm32', tier: 'medium', name: 'Quest 42', icon: '🌟', words: ['group',    'when',     'yellow',   'low',      'money'] },
  { id: 'm33', tier: 'medium', name: 'Quest 43', icon: '🌟', words: ['most',     'much',     'new',      'page',     'hard'] },
  { id: 'm34', tier: 'medium', name: 'Quest 44', icon: '🌟', words: ['start',    'part',     'last',     'laugh',    'car'] },
  { id: 'm35', tier: 'medium', name: 'Quest 45', icon: '🌟', words: ['half',     'ask',      'father',   'air',      'little'] },
  { id: 'm36', tier: 'medium', name: 'Quest 46', icon: '🌟', words: ['every',    'parent',   'ever',     'never',    'number'] },
  { id: 'm37', tier: 'medium', name: 'Quest 47', icon: '🌟', words: ['together', 'bought',   'everywhere','question', 'answer'] },
  { id: 'm38', tier: 'medium', name: 'Quest 48', icon: '🌟', words: ['early',    'earth',    'later',    'letter',   'our'] },
  { id: 'm39', tier: 'medium', name: 'Quest 49', icon: '🌟', words: ['we',       'first',    'hurt',     'heard',    'call'] },
  { id: 'm40', tier: 'medium', name: 'Quest 50', icon: '🌟', words: ['door',     'draw',     'four',     'more',     'morning'] },
  { id: 'm41', tier: 'medium', name: 'Quest 51', icon: '🌟', words: ['small',    'walk',     'already',  'toy',      'found'] },
  { id: 'm42', tier: 'medium', name: 'Quest 52', icon: '🌟', words: ['house',    'around',   'almost',   'hear',     'horse'] },
  { id: 'm43', tier: 'medium', name: 'Quest 53', icon: '🌟', words: ['talk',     'short',    'fall',     'point',    'another'] },
  { id: 'm44', tier: 'medium', name: 'Quest 54', icon: '🌟', words: ['against',  'ear',      'able',     'outside',  'pull'] },
  { id: 'm45', tier: 'medium', name: 'Quest 55', icon: '🌟', words: ['far',      'push',     'fire',     'right',    'dear'] },
  { id: 'm46', tier: 'medium', name: 'Quest 56', icon: '🌟', words: ['idea',     'year',     'near',     'ball',     'blue'] },
  { id: 'm47', tier: 'medium', name: 'Quest 57', icon: '🌟', words: ['during',   'front',    'hold',     'like',     'look'] },
  { id: 'm48', tier: 'medium', name: 'Quest 58', icon: '🌟', words: ['write',    'way',      'my',       'called',   'oil'] },
  { id: 'm49', tier: 'medium', name: 'Quest 59', icon: '🌟', words: ['long',     'use',      'words',    'sound',    'live'] },
  { id: 'm50', tier: 'medium', name: 'Quest 60', icon: '🌟', words: ['back',     'things',   'sentence', 'line',     'means'] },
  { id: 'm51', tier: 'medium', name: 'Quest 61', icon: '🌟', words: ['old',      'tell',     'fellow',   'show',     'form'] },
  { id: 'm52', tier: 'medium', name: 'Quest 62', icon: '🌟', words: ['three',    'well',     'such',     'turn',     'read'] },
  { id: 'm53', tier: 'medium', name: 'Quest 63', icon: '🌟', words: ['need',     'different','picture',  'play',     'spell'] },
  { id: 'm54', tier: 'medium', name: 'Quest 64', icon: '🌟', words: ['animal',   'study',    'still',    'learn',    'Singapore'] },
  { id: 'm55', tier: 'medium', name: 'Quest 65', icon: '🌟', words: ['world',    'add',      'food',     'country',  'plant'] },
  { id: 'm56', tier: 'medium', name: 'Quest 66', icon: '🌟', words: ['school',   'father',   'tree',     'close',    'seem'] },
  { id: 'm57', tier: 'medium', name: 'Quest 67', icon: '🌟', words: ['example',  'those',    'paper',    'important','side'] },
  { id: 'm58', tier: 'medium', name: 'Quest 68', icon: '🌟', words: ['metre',    'grow',     'took',     'river',    'state'] },
  { id: 'm59', tier: 'medium', name: 'Quest 69', icon: '🌟', words: ['book',     'stop',     'second',   'late',     'miss'] },
  { id: 'm60', tier: 'medium', name: 'Quest 70', icon: '🌟', words: ['face',     'Indian',   'real',     'sometimes','mountains'] },
  { id: 'm61', tier: 'medium', name: 'Quest 71', icon: '🌟', words: ['soon',     'song',     'being',    'Monday',   'Tuesday'] },
  { id: 'm62', tier: 'medium', name: 'Quest 72', icon: '🌟', words: ["it's",     'colour',   'area',     'mark',     'birds'] },
  { id: 'm63', tier: 'medium', name: 'Quest 73', icon: '🌟', words: ['problem',  'complete', 'room',     'Wednesday','Thursday'] },
  { id: 'm64', tier: 'medium', name: 'Quest 74', icon: '🌟', words: ['since',    'piece',    'told',     'usually',  "didn't"] },
  { id: 'm65', tier: 'medium', name: 'Quest 75', icon: '🌟', words: ['friends',  'order',    'sure',     'Friday',   'Saturday'] },
  { id: 'm66', tier: 'medium', name: 'Quest 76', icon: '🌟', words: ['Sunday',   'better',   'however',  'black',    'products'] },
  { id: 'm67', tier: 'medium', name: 'Quest 77', icon: '🌟', words: ['happened', 'whole',    'measure',  'remember', 'waves'] },
  { id: 'm68', tier: 'medium', name: 'Quest 78', icon: '🌟', words: ['reached',  'listen',   'wind',     'rock',     'space'] },
  { id: 'm69', tier: 'medium', name: 'Quest 79', icon: '🌟', words: ['covered',  'several',  'himself',  'towards',  'five'] },
  { id: 'm70', tier: 'medium', name: 'Quest 80', icon: '🌟', words: ['passed',   'vowel',    'true',     'hundred',  'pattern'] },
  { id: 'm71', tier: 'medium', name: 'Quest 81', icon: '🌟', words: ['numeral',  'table',    'north',    'slowly',   'farm'] },
  { id: 'm72', tier: 'medium', name: 'Quest 82', icon: '🌟', words: ['pulled',   'voice',    'seen',     'cried',    'plan'] },
  { id: 'm73', tier: 'medium', name: 'Quest 83', icon: '🌟', words: ['notice',   'south',    'sing',     'ground',   'king'] },
  { id: 'm74', tier: 'medium', name: 'Quest 84', icon: '🌟', words: ['town',     "I'll",     'unit',     'figure',   'certain'] },
  { id: 'm75', tier: 'medium', name: 'Quest 85', icon: '🌟', words: ['field',    'travel',   'wood',     'used'] },

  /* ── Hard ─────────────────────────────────────────────────────────── */
  { id: 'h1',  tier: 'hard', name: 'Quest 86', icon: '💎', words: ['absence',       'accommodate',  'achieve',       'acquire',       'address'] },
  { id: 'h2',  tier: 'hard', name: 'Quest 87', icon: '💎', words: ['advertise',     'apparent',     'argument',      'athlete',       'beginning'] },
  { id: 'h3',  tier: 'hard', name: 'Quest 88', icon: '💎', words: ['believe',       'bicycle',      'biscuit',       'business',      'calendar'] },
  { id: 'h4',  tier: 'hard', name: 'Quest 89', icon: '💎', words: ['category',      'ceiling',      'cemetery',      'changeable',    'chocolate'] },
  { id: 'h5',  tier: 'hard', name: 'Quest 90', icon: '💎', words: ['committee',     'communicate',  'compare',       'competition',   'concentrate'] },
  { id: 'h6',  tier: 'hard', name: 'Quest 91', icon: '💎', words: ['congratulations','conscience',  'conscious',     'controversial', 'convenience'] },
  { id: 'h7',  tier: 'hard', name: 'Quest 92', icon: '💎', words: ['correspond',    'criticize',    'curiosity',     'deceive',       'decision'] },
  { id: 'h8',  tier: 'hard', name: 'Quest 93', icon: '💎', words: ['definite',      'description',  'desperate',     'develop',       'dictionary'] },
  { id: 'h9',  tier: 'hard', name: 'Quest 94', icon: '💎', words: ['dilemma',       'disappear',    'disappoint',    'discipline',    'disease'] },
  { id: 'h10', tier: 'hard', name: 'Quest 95', icon: '💎', words: ['embarrass',     'environment',  'especially',    'exaggerate',    'excellent'] },
];

/** Lookup quest by id */
export function getQuestById(id) {
  return SIGHT_QUESTS.find(q => q.id === id) ?? null;
}

/** Get quests filtered by tier */
export function getQuestsByTier(tier) {
  return SIGHT_QUESTS.filter(q => q.tier === tier);
}

export const TIER_LABELS = {
  easy:   { label: 'Easy',   icon: '⭐', color: '#22c55e', desc: 'Pre-Primer sight words' },
  medium: { label: 'Medium', icon: '🌟', color: '#f59e0b', desc: 'Primer & Grade 1 words' },
  hard:   { label: 'Hard',   icon: '💎', color: '#6c63ff', desc: 'Grade 2 & 3 words'     },
};
