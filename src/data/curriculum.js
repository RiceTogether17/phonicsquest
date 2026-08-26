/**
 * PhonicsQuest Curriculum — Single Source of Truth
 *
 * This file is the canonical curriculum. Anything that needs to know about
 * phases, stages, learning outcomes, target sounds, sample words, decodable
 * sentence examples, recommended game modes, or mastery thresholds reads
 * from here. UI components MUST NOT redefine their own phase metadata —
 * `src/components/curriculumMap.js` previously kept a parallel PHASE_META
 * table that drifted out of sync (7 vs 10 phases). That duplication has been
 * removed; see `PHASES` below.
 *
 * The phase numbers here MUST stay in sync with the placement screener in
 * `src/modules/placementTest.js` — covered by
 * `__tests__/curriculumPlacementAlignment.test.js`.
 *
 *   Phase 1  CVC               short A → E → I → O → U
 *   Phase 2  CCVC              initial blends  (blend + vowel + consonant)
 *   Phase 3  CVCC              final blends    (consonant + vowel + blend)
 *   Phase 4  Digraphs          sh, ch, th, wh, ck, ng
 *   Phase 5  CCVCC             both-end blends
 *   Phase 6  Long Vowels       split-digraph / vowel-team / word-end patterns
 *   Phase 7  Diphthongs        oi/oy, ou/ow, aw
 *   Phase 8  Advanced          mixed-blends review
 *   Phase 9  Suffixes          -ing, -ed, -er, -est
 *   Phase 10 Morphology        prefixes, advanced suffixes, multisyllabic, sight
 *
 * Each stage unlocks when its prerequisite reaches mastery threshold.
 * The `group` field is used by progress.getAdaptivePool() to filter words.
 */

/** Mastery = accuracy >= this value across recent attempts */
export const MASTERY_THRESHOLD = 0.80;

/** Minimum attempts before mastery is calculated */
export const MIN_ATTEMPTS_FOR_MASTERY = 6;

/**
 * Default per-stage mastery criteria. Individual stages may override these
 * by providing their own `masteryCriteria` field. The strict-gate readiness
 * check in `src/modules/progression.js` uses additional criteria (unique
 * words, session days, vowel confusion) on top of these.
 */
export const DEFAULT_MASTERY_CRITERIA = Object.freeze({
  accuracy:    MASTERY_THRESHOLD,
  minAttempts: MIN_ATTEMPTS_FOR_MASTERY,
});

/**
 * Required fields every CURRICULUM stage must declare. Asserted in
 * `__tests__/curriculumSchema.test.js`.
 */
export const REQUIRED_STAGE_FIELDS = Object.freeze([
  'id',
  'phase',
  'name',
  'group',
  'learningOutcome',
  'targetSounds',
  'sampleWords',
  'sentenceExamples',
  'recommendedModes',
  'masteryCriteria',
]);

/**
 * Required fields every PHASES entry must declare. Asserted in
 * `__tests__/curriculumSchema.test.js`.
 */
export const REQUIRED_PHASE_FIELDS = Object.freeze([
  'phase',
  'id',
  'title',
  'label',
  'icon',
  'description',
  'learningOutcome',
  'targetSounds',
  'sampleWords',
  'sentenceExamples',
  'recommendedModes',
  'masteryCriteria',
]);

/**
 * Phase-level rollup. UI surfaces (curriculum map, dashboard headings)
 * derive their phase cards from this table instead of redefining one
 * locally. `label` is the short header form ("Phase 1 — CVC"); `title` is
 * the friendly card title; `description` is one parent-facing sentence.
 */
/**
 * Pre-phases — the two foundation steps that come BEFORE decoding print.
 * They are first-class curriculum entries (same field schema as PHASES)
 * but keep string phase keys ('0a'/'0b') so the numeric phonics phases
 * 1–10, which are baked into saved progress, placement mapping and
 * decodability, never shift.
 *
 *   0a  Phonemic Awareness — hearing and playing with sounds, no print
 *   0b  Letter Sounds      — grapheme–phoneme correspondence
 *
 * Progress signals are derived in `src/modules/prePhaseProgress.js`.
 */
export const PRE_PHASES = Object.freeze([
  {
    phase: '0a',
    id: 'phase-0a-phonemic-awareness',
    title: 'Phonemic Awareness',
    label: 'Step 0a — Phonemic Awareness',
    icon: '👂',
    description: 'Hearing sounds in spoken words — first, last and middle sounds, clapping syllables, blending sounds by ear. No letters yet.',
    learningOutcome: 'Hear, count and play with the individual sounds inside spoken words: isolate first/last/middle sounds and orally blend three sounds into a word.',
    targetSounds: ['first sound isolation', 'last sound isolation', 'middle sound isolation', 'oral blending', 'syllable clapping', 'word counting'],
    sampleWords: ['cat (/k/ /a/ /t/)', 'sun (/s/ /u/ /n/)', 'map (/m/ /a/ /p/)', 'ti-ger (2 claps)', 'ba-na-na (3 claps)'],
    sentenceExamples: ['What sound does "sun" start with?', 'Clap the beats in "tiger".', '/d/ /o/ /g/ — what word is that?'],
    recommendedModes: ['first', 'last', 'middle', 'oralBlend', 'soundCount', 'oralSegment', 'syllable', 'wordCount', 'oddOneOut', 'train'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    phase: '0b',
    id: 'phase-0b-letter-sounds',
    title: 'Letter Sounds',
    label: 'Step 0b — Letter Sounds',
    icon: '🔡',
    description: 'Matching each letter to the sound it makes — s says /s/, a says /ă/ — so sounds can be read from print.',
    learningOutcome: 'Say the most common sound for each single letter quickly and pick the letter that matches a spoken sound.',
    targetSounds: ['s /s/', 'a /ă/', 't /t/', 'p /p/', 'i /ĭ/', 'n /n/', 'm /m/', 'd /d/', 'g /g/', 'o /ŏ/', 'c /k/', 'k /k/', 'e /ĕ/', 'u /ŭ/', 'r /r/', 'h /h/', 'b /b/', 'f /f/', 'l /l/'],
    sampleWords: ['s → sun', 'a → apple', 't → top', 'p → pig', 'i → ink', 'n → net'],
    sentenceExamples: ['Which letter says /sss/?', 'Tap the letter that starts "map".'],
    recommendedModes: ['letterSounds', 'soundHunt', 'hear'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
]);

/** Look up a pre-phase by its phase key ('0a'/'0b') or id. */
export function getPrePhase(key) {
  return PRE_PHASES.find(p => p.phase === key || p.id === key) || null;
}

export const PHASES = Object.freeze([
  {
    phase: 1,
    id: 'phase-1-cvc',
    title: 'CVC Words',
    label: 'Phase 1 — CVC',
    icon: '🔤',
    description: 'Simple 3-sound short-vowel words (cat, hen, big, dog, bug).',
    learningOutcome: 'Decode any short-vowel consonant–vowel–consonant word in isolation and in a simple sentence.',
    targetSounds: ['short a /ă/', 'short e /ĕ/', 'short i /ĭ/', 'short o /ŏ/', 'short u /ŭ/'],
    sampleWords: ['cat', 'hen', 'big', 'dog', 'bug', 'map', 'pen', 'sit', 'top', 'sun'],
    sentenceExamples: ['The cat sat on a mat.', 'A pig is in the mud.'],
    recommendedModes: ['wordCount', 'oralBlend', 'first', 'last', 'middle', 'soundCount', 'oralSegment', 'blend', 'classicBlend', 'segment', 'hear', 'train', 'oddOneOut', 'soundHunt'],
    sightWords: ['the', 'to', 'I', 'no', 'go', 'into'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    phase: 2,
    id: 'phase-2-ccvc',
    title: 'CCVC Initial Blends',
    label: 'Phase 2 — CCVC',
    icon: '🔀',
    description: 'Two consonants at the start before the vowel (flat, step, drip, drum).',
    learningOutcome: 'Decode and spell short-vowel words that begin with an l-, r-, or s-blend.',
    targetSounds: ['bl', 'cl', 'fl', 'gl', 'pl', 'sl', 'br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'sk', 'sm', 'sn', 'sp', 'st', 'sw'],
    sampleWords: ['flat', 'clap', 'trap', 'step', 'sled', 'flip', 'drip', 'drop', 'stop', 'drum'],
    sentenceExamples: ['I can clap and step.', 'A frog is on the slip mat.'],
    recommendedModes: ['blend', 'classicBlend', 'segment', 'hear', 'first', 'last', 'middle', 'soundCount', 'missing', 'train', 'oddOneOut', 'soundHunt'],
    sightWords: ['he', 'she', 'we', 'me', 'be'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    phase: 3,
    id: 'phase-3-cvcc',
    title: 'CVCC Final Blends',
    label: 'Phase 3 — CVCC',
    icon: '📐',
    description: 'Two consonants at the end after the vowel (band, belt, gift, song, jump).',
    learningOutcome: 'Decode and spell short-vowel words that end in a consonant blend.',
    targetSounds: ['-nd', '-nt', '-mp', '-st', '-lt', '-lk', '-lp', '-sk', '-ft', '-nk', '-ng'],
    sampleWords: ['band', 'bank', 'belt', 'gift', 'milk', 'song', 'lost', 'jump', 'dust', 'lamp'],
    sentenceExamples: ['Hand me the lamp.', 'I jump in the dust.'],
    recommendedModes: ['classicBlend', 'blend', 'segment', 'first', 'last', 'middle', 'hear', 'missing'],
    sightWords: ['was', 'you', 'they', 'all', 'are'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    phase: 4,
    id: 'phase-4-digraphs',
    title: 'Consonant Digraphs',
    label: 'Phase 4 — Digraphs',
    icon: '🤝',
    description: 'Two letters making one sound — sh, ch, th, wh, ck, ng.',
    learningOutcome: 'Recognise that two letters can make one sound, and decode digraph words in connected text.',
    targetSounds: ['sh /ʃ/', 'ch /tʃ/', 'th /θ/', 'th /ð/', 'wh /w/', 'ck /k/', 'ng /ŋ/'],
    sampleWords: ['ship', 'chip', 'that', 'when', 'sing', 'lock', 'fish', 'chop', 'this', 'whip'],
    sentenceExamples: ['The ship has a chip.', 'Wash the dish in the sink.'],
    recommendedModes: ['hear', 'blend', 'classicBlend', 'segment', 'first', 'last', 'middle', 'missing', 'soundCount'],
    sightWords: ['my', 'her', 'said', 'have', 'like'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    phase: 5,
    id: 'phase-5-ccvcc',
    title: 'CCVCC Both-end Blends',
    label: 'Phase 5 — CCVCC',
    icon: '🎯',
    description: 'Blends at both ends of the word (stamp, blend, print, stomp, stump).',
    learningOutcome: 'Decode and spell short-vowel words with blends at both the start and the end.',
    targetSounds: ['stCC-', 'plCC-', 'brCC-', 'spCC-', 'sprCC-', '-mp', '-nd', '-nt', '-st'],
    sampleWords: ['stamp', 'blend', 'print', 'stomp', 'stump', 'plank', 'crest', 'drink', 'frost', 'trust'],
    sentenceExamples: ['Print the brand on the stamp.', 'I trust the stump will hold.'],
    recommendedModes: ['classicBlend', 'blend', 'segment', 'hear', 'first', 'last', 'middle', 'missing', 'soundCount'],
    sightWords: ['so', 'do', 'some', 'come', 'were'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    phase: 6,
    id: 'phase-6-long-vowels',
    title: 'Long Vowels',
    label: 'Phase 6 — Long Vowels',
    icon: '🌟',
    description: 'Long vowel patterns — split digraphs (a_e), vowel teams (ai, ee, oa) and word-end patterns (ay, ow, y).',
    learningOutcome: 'Decode long-vowel words across the major spelling patterns and choose the right pattern when spelling.',
    targetSounds: ['a_e /eɪ/', 'ai /eɪ/', 'ay /eɪ/', 'ee /iː/', 'ea /iː/', 'i_e /aɪ/', 'igh /aɪ/', 'y /aɪ/', 'o_e /oʊ/', 'oa /oʊ/', 'ow /oʊ/', 'u_e /juː/', 'ue /uː/', 'ew /uː/', 'oo /uː/', 'oo /ʊ/'],
    sampleWords: ['cake', 'rain', 'play', 'tree', 'beat', 'kite', 'night', 'cry', 'home', 'boat', 'snow', 'cube', 'blue', 'new', 'moon'],
    sentenceExamples: ['The cake is on the plate.', 'I see a bee in the tree.', 'At night the light is bright.'],
    recommendedModes: ['classicBlend', 'blend', 'hear', 'first', 'last', 'middle', 'segment', 'missing'],
    sightWords: ['there', 'little', 'one', 'when', 'what'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    phase: 7,
    id: 'phase-7-diphthongs',
    title: 'Diphthongs',
    label: 'Phase 7 — Diphthongs',
    icon: '🌊',
    description: 'Sliding vowel sounds — oi/oy, ou/ow and the aw pattern.',
    learningOutcome: 'Decode and spell words with diphthong vowel patterns and discriminate them by sound.',
    targetSounds: ['oi /ɔɪ/', 'oy /ɔɪ/', 'ou /aʊ/', 'ow /aʊ/', 'aw /ɔː/', 'au /ɔː/'],
    sampleWords: ['coin', 'boy', 'out', 'cow', 'paw', 'jaw', 'loud', 'joy', 'town', 'dawn'],
    sentenceExamples: ['The boy found a coin.', 'I saw a paw on the lawn.'],
    recommendedModes: ['classicBlend', 'blend', 'hear', 'first', 'last', 'middle', 'segment', 'missing'],
    sightWords: ['oh', 'their', 'people', 'looked', 'out'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    phase: 8,
    id: 'phase-8-advanced',
    title: 'Advanced Blends & Bossy R',
    label: 'Phase 8 — Advanced',
    icon: '🚀',
    description: 'Mixed-blend review, r-controlled vowels (ar, or, er, ir, ur) and the late consonant spellings tch, dge and ph.',
    learningOutcome: 'Read mixed-blend words fluently and decode words where r changes the vowel sound.',
    targetSounds: ['CCV', 'CVCC', 'CCVCC', 'multi-blend review', 'ar /ɑr/', 'or /ɔr/', 'er/ir/ur /ɜr/', 'tch /tʃ/', 'dge /dʒ/', 'ph /f/'],
    sampleWords: ['float', 'crisp', 'blend', 'sprint', 'plank', 'scrap', 'twist', 'shrink', 'sprout', 'thrust'],
    sentenceExamples: ['Sprint and stamp until the drums thump.', 'The girl saw a bird in the fern.'],
    recommendedModes: ['classicBlend', 'blend', 'hear', 'first', 'last', 'middle', 'segment', 'soundCount'],
    sightWords: ['called', 'asked', 'could', 'should', 'would'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    phase: 9,
    id: 'phase-9-suffixes',
    title: 'Inflectional Suffixes',
    label: 'Phase 9 — Suffixes',
    icon: '🏃',
    description: '-ing, -ed, -er and -est on familiar base words.',
    learningOutcome: 'Read and spell words with -ing, -ed, -er and -est, hearing the suffix as a separate chunk.',
    targetSounds: ['-ing /ɪŋ/', '-ed /d/, /t/, /ɪd/', '-er /ɚ/', '-est /ɪst/'],
    sampleWords: ['running', 'jumped', 'grander', 'tallest', 'helped', 'biggest', 'playing', 'sitting', 'slower', 'eating'],
    sentenceExamples: ['He was running faster than me.', 'The biggest cat jumped highest.'],
    recommendedModes: ['classicBlend', 'blend', 'hear', 'segment'],
    sightWords: ['because', 'once', 'please', 'thought'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    phase: 10,
    id: 'phase-10-morphology',
    title: 'Morphology & Fluency',
    label: 'Phase 10 — Morphology & Fluency',
    icon: '🧩',
    description: 'Prefixes, advanced suffixes, multi-syllabic words and high-frequency irregular sight words.',
    learningOutcome: 'Read multi-syllable and morphologically complex words and recognise common irregular sight words on sight.',
    targetSounds: ['re-', 'un-', '-tion', '-able', 'open/closed syllables', 'irregular sight'],
    sampleWords: ['redo', 'untie', 'action', 'readable', 'science', 'market', 'their', 'because', 'enough', 'through'],
    sentenceExamples: ['Their friend is reading because the book is good.', 'I will redo my action plan.'],
    recommendedModes: ['classicBlend', 'blend', 'hear'],
    sightWords: ['through', 'enough', 'again', 'friend', 'where'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
]);

/**
 * High-frequency "tricky" words interleaved into each phonics phase, in
 * Letters-and-Sounds-style order. Sight words are not a separate silo —
 * a few are learned alongside each phase's code knowledge.
 * @param {number} phase
 * @returns {string[]}
 */
export function getSightWordsForPhase(phase) {
  return PHASES.find(p => p.phase === phase)?.sightWords || [];
}

/** All phase-interleaved sight words up to and including a phase. */
export function getSightWordsThroughPhase(phase) {
  return PHASES.filter(p => p.phase <= phase).flatMap(p => p.sightWords || []);
}

/** Phase labels for UI display. Derived from PHASES so they cannot drift. */
export const PHASE_LABELS = Object.freeze(
  PHASES.reduce((acc, p) => { acc[p.phase] = p.label; return acc; }, {})
);

/**
 * Curriculum stages in learning order.
 * `group` maps to a WORD_GROUPS key or a structural-vowel key (e.g. 'cvc-a').
 *
 * Each stage carries the canonical educational metadata that all surfaces
 * (UI, reporting, adaptive routing) depend on. See REQUIRED_STAGE_FIELDS.
 */
export const CURRICULUM = [

  /* ── Phase 1: CVC by vowel ─────────────────────────────────────── */
  {
    id: 'cvc-a', phase: 1,
    name: 'CVC – Short A',
    description: 'Simple three-sound words: cat, hat, map…',
    icon: '🐱', group: 'cvc-a', level: 1,
    requiredMastery: 0,
    learningOutcome: 'Decode and spell short-A CVC words in isolation and in a simple sentence.',
    targetSounds: ['short a /ă/'],
    sampleWords: ['cat', 'hat', 'map', 'bat', 'ran', 'pan', 'jam', 'tap'],
    sentenceExamples: ['The cat sat on a mat.', 'A bat had a hat.'],
    recommendedModes: ['oralBlend', 'first', 'middle', 'blend', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'cvc-e', phase: 1,
    name: 'CVC – Short E',
    description: 'Short E words: bed, leg, ten…',
    icon: '🛏️', group: 'cvc-e', level: 1,
    requiredMastery: 0.70, prerequisite: 'cvc-a',
    learningOutcome: 'Discriminate short-E from short-A and decode short-E CVC words.',
    targetSounds: ['short e /ĕ/'],
    sampleWords: ['bed', 'leg', 'ten', 'hen', 'pen', 'red', 'web', 'jet'],
    sentenceExamples: ['Ten men ran.', 'The hen is in the pen.'],
    recommendedModes: ['middle', 'blend', 'segment', 'hear'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'cvc-i', phase: 1,
    name: 'CVC – Short I',
    description: 'Short I words: bit, tip, dip…',
    icon: '🐟', group: 'cvc-i', level: 1,
    requiredMastery: 0.70, prerequisite: 'cvc-e',
    learningOutcome: 'Decode short-I CVC words and contrast /ĭ/ with /ĕ/.',
    targetSounds: ['short i /ĭ/'],
    sampleWords: ['bit', 'tip', 'dip', 'pig', 'win', 'sit', 'big', 'lip'],
    sentenceExamples: ['A pig can dig.', 'I sit in the bin.'],
    recommendedModes: ['middle', 'blend', 'segment', 'hear'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'cvc-o', phase: 1,
    name: 'CVC – Short O',
    description: 'Short O words: hop, dog, top…',
    icon: '🐸', group: 'cvc-o', level: 1,
    requiredMastery: 0.70, prerequisite: 'cvc-i',
    learningOutcome: 'Decode short-O CVC words and contrast /ŏ/ with the other short vowels.',
    targetSounds: ['short o /ŏ/'],
    sampleWords: ['hop', 'dog', 'top', 'pot', 'fox', 'hot', 'log', 'mom'],
    sentenceExamples: ['The dog hops on top.', 'A fox got a pot.'],
    recommendedModes: ['middle', 'blend', 'segment', 'hear'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'cvc-u', phase: 1,
    name: 'CVC – Short U',
    description: 'Short U words: bug, cup, run…',
    icon: '🐛', group: 'cvc-u', level: 1,
    requiredMastery: 0.70, prerequisite: 'cvc-o',
    learningOutcome: 'Decode short-U CVC words and contrast /ŭ/ with the other short vowels.',
    targetSounds: ['short u /ŭ/'],
    sampleWords: ['bug', 'cup', 'run', 'sun', 'mud', 'hug', 'fun', 'nut'],
    sentenceExamples: ['The bug is in the mud.', 'The sun is hot.'],
    recommendedModes: ['middle', 'blend', 'segment', 'hear'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  /* ── Phase 2: CCVC by vowel ─────────────────────────────────────── */
  {
    id: 'ccvc-a', phase: 2,
    name: 'CCVC – Short A',
    description: 'Blend at the start: flat, clap, trap…',
    icon: '🚩', group: 'ccvc-a', level: 1,
    requiredMastery: 0.70, prerequisite: 'cvc-u',
    learningOutcome: 'Decode short-A words with an initial l-, r- or s-blend without skipping the second consonant.',
    targetSounds: ['bl', 'cl', 'fl', 'pl', 'sl', 'br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'sk', 'sm', 'sn', 'sp', 'st', 'sw'],
    sampleWords: ['flat', 'clap', 'trap', 'plan', 'snap', 'flag', 'grab', 'stab'],
    sentenceExamples: ['I clap and tap.', 'A frog is in a trap.'],
    recommendedModes: ['blend', 'classicBlend', 'segment', 'soundCount'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'ccvc-e', phase: 2,
    name: 'CCVC – Short E',
    description: 'Blend at the start: step, fret, sled…',
    icon: '🎯', group: 'ccvc-e', level: 1,
    requiredMastery: 0.70, prerequisite: 'ccvc-a',
    learningOutcome: 'Decode short-E words with an initial consonant blend.',
    targetSounds: ['st-', 'fr-', 'sl-', 'sp-', 'sw-'],
    sampleWords: ['step', 'fret', 'sled', 'fled', 'spell', 'swept', 'stem', 'sped'],
    sentenceExamples: ['Step on the sled.', 'I fell off the sled.'],
    recommendedModes: ['blend', 'classicBlend', 'segment', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'ccvc-i', phase: 2,
    name: 'CCVC – Short I',
    description: 'Blend at the start: flip, trip, drip…',
    icon: '💪', group: 'ccvc-i', level: 1,
    requiredMastery: 0.70, prerequisite: 'ccvc-e',
    learningOutcome: 'Decode short-I words with an initial consonant blend.',
    targetSounds: ['fl-', 'tr-', 'dr-', 'sl-', 'sw-', 'sp-'],
    sampleWords: ['flip', 'trip', 'drip', 'slip', 'swim', 'spin', 'grin', 'skin'],
    sentenceExamples: ['Flip and slip on the trip.', 'I can spin and grin.'],
    recommendedModes: ['blend', 'classicBlend', 'segment', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'ccvc-o', phase: 2,
    name: 'CCVC – Short O',
    description: 'Blend at the start: flop, drop, stop…',
    icon: '🐊', group: 'ccvc-o', level: 1,
    requiredMastery: 0.70, prerequisite: 'ccvc-i',
    learningOutcome: 'Decode short-O words with an initial consonant blend.',
    targetSounds: ['fl-', 'dr-', 'st-', 'sl-', 'pl-'],
    sampleWords: ['flop', 'drop', 'stop', 'slot', 'plot', 'crop', 'trot', 'frog'],
    sentenceExamples: ['Stop! Drop the box.', 'The frog can hop and trot.'],
    recommendedModes: ['blend', 'classicBlend', 'segment', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'ccvc-u', phase: 2,
    name: 'CCVC – Short U',
    description: 'Blend at the start: drum, slug, stub…',
    icon: '🥁', group: 'ccvc-u', level: 1,
    requiredMastery: 0.70, prerequisite: 'ccvc-o',
    learningOutcome: 'Decode short-U words with an initial consonant blend.',
    targetSounds: ['dr-', 'sl-', 'st-', 'pl-', 'bl-'],
    sampleWords: ['drum', 'slug', 'stub', 'plum', 'blur', 'club', 'snug', 'crust'],
    sentenceExamples: ['Drum on the drum.', 'A snug slug hid in the mud.'],
    recommendedModes: ['blend', 'classicBlend', 'segment', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  /* ── Phase 3: CVCC by vowel ─────────────────────────────────────── */
  {
    id: 'cvcc-a', phase: 3,
    name: 'CVCC – Short A',
    description: 'Blend at the end: band, fast, camp…',
    icon: '✋', group: 'cvcc-a', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvc-u',
    learningOutcome: 'Decode short-A words ending in a consonant blend.',
    targetSounds: ['-nd', '-st', '-mp', '-nk', '-sk', '-ft'],
    sampleWords: ['band', 'bank', 'camp', 'hand', 'sand', 'lamp', 'tank', 'ramp'],
    sentenceExamples: ['The band is fast.', 'Hand me the lamp.'],
    recommendedModes: ['classicBlend', 'segment', 'last', 'hear'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'cvcc-e', phase: 3,
    name: 'CVCC – Short E',
    description: 'Blend at the end: belt, best, bend…',
    icon: '🔔', group: 'cvcc-e', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-a',
    learningOutcome: 'Decode short-E words ending in a consonant blend.',
    targetSounds: ['-lt', '-st', '-nd', '-nt', '-lp'],
    sampleWords: ['belt', 'best', 'bend', 'melt', 'vent', 'help', 'kept', 'left'],
    sentenceExamples: ['The best belt is here.', 'Help me melt the wax.'],
    recommendedModes: ['classicBlend', 'segment', 'last', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'cvcc-i', phase: 3,
    name: 'CVCC – Short I',
    description: 'Blend at the end: gift, milk, list…',
    icon: '🎁', group: 'cvcc-i', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-e',
    learningOutcome: 'Decode short-I words ending in a consonant blend.',
    targetSounds: ['-ft', '-lk', '-st', '-nt', '-lt'],
    sampleWords: ['gift', 'milk', 'list', 'hint', 'lift', 'silk', 'mist', 'wilt'],
    sentenceExamples: ['A gift in the bin.', 'Lift the lid for a hint.'],
    recommendedModes: ['classicBlend', 'segment', 'last', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'cvcc-o', phase: 3,
    name: 'CVCC – Short O',
    description: 'Blend at the end: bond, song, lost…',
    icon: '🎵', group: 'cvcc-o', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-i',
    learningOutcome: 'Decode short-O words ending in a consonant blend.',
    targetSounds: ['-nd', '-ng', '-st', '-nk'],
    sampleWords: ['bond', 'song', 'lost', 'long', 'cost', 'pond', 'gong', 'honk'],
    sentenceExamples: ['I sing a long song.', 'The pond is lost in fog.'],
    recommendedModes: ['classicBlend', 'segment', 'last', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'cvcc-u', phase: 3,
    name: 'CVCC – Short U',
    description: 'Blend at the end: jump, dust, lung…',
    icon: '💥', group: 'cvcc-u', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-o',
    learningOutcome: 'Decode short-U words ending in a consonant blend.',
    targetSounds: ['-mp', '-st', '-ng', '-nt'],
    sampleWords: ['jump', 'dust', 'lung', 'hunt', 'dump', 'rust', 'sung', 'bunt'],
    sentenceExamples: ['Jump in the dust.', 'The hunt was fun.'],
    recommendedModes: ['classicBlend', 'segment', 'last', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  /* ── Phase 4: Digraphs ───────────────────────────────────────────── */
  {
    id: 'digraphs', phase: 4,
    name: 'Digraphs',
    description: 'ship, chip, that, when, sing…',
    icon: '🤝', group: 'digraphs', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-u',
    learningOutcome: 'Treat sh, ch, th, wh, ck and ng as single phonemes when decoding and segmenting.',
    targetSounds: ['sh /ʃ/', 'ch /tʃ/', 'th /θ/', 'th /ð/', 'wh /w/', 'ck /k/', 'ng /ŋ/'],
    sampleWords: ['ship', 'chip', 'that', 'when', 'sing', 'lock', 'fish', 'chop', 'this', 'whip'],
    sentenceExamples: ['The ship has a chip.', 'Wash the dish in the sink.'],
    recommendedModes: ['hear', 'blend', 'segment', 'missing', 'soundCount'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  /* ── Phase 5: CCVCC by vowel ────────────────────────────────────── */
  {
    id: 'ccvcc-a', phase: 5,
    name: 'CCVCC – Short A',
    description: 'Blends both ends: stamp, clamp, plank…',
    icon: '🌱', group: 'ccvcc-a', level: 2,
    requiredMastery: 0.70, prerequisite: 'digraphs',
    learningOutcome: 'Decode short-A words with blends at both ends.',
    targetSounds: ['stCC-mp', 'clCC-', 'blCC-st', 'brCC-nd'],
    sampleWords: ['stamp', 'clamp', 'plank', 'brand', 'prank', 'blank', 'grand', 'tract'],
    sentenceExamples: ['The grand band can stamp and clap.', 'Stamp the blank card and print it.'],
    recommendedModes: ['classicBlend', 'segment', 'missing', 'soundCount'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'ccvcc-e', phase: 5,
    name: 'CCVCC – Short E',
    description: 'Blends both ends: blend, trend, crest…',
    icon: '🌿', group: 'ccvcc-e', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-a',
    learningOutcome: 'Decode short-E words with blends at both ends.',
    targetSounds: ['blCC-nd', 'trCC-nd', 'crCC-st', 'spCC-nt'],
    sampleWords: ['blend', 'trend', 'crest', 'spent', 'swept', 'crept', 'shelf', 'flesh'],
    sentenceExamples: ['I blend and trend.', 'The crest of the hill swept down.'],
    recommendedModes: ['classicBlend', 'segment', 'missing', 'soundCount'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'ccvcc-i', phase: 5,
    name: 'CCVCC – Short I',
    description: 'Blends both ends: blink, drink, print…',
    icon: '💎', group: 'ccvcc-i', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-e',
    learningOutcome: 'Decode short-I words with blends at both ends.',
    targetSounds: ['blCC-nk', 'drCC-nk', 'prCC-nt', 'swCC-ft'],
    sampleWords: ['blink', 'drink', 'print', 'swift', 'sprint', 'flint', 'crisp', 'glint'],
    sentenceExamples: ['Blink and drink fast.', 'Print and sprint to the desk.'],
    recommendedModes: ['classicBlend', 'segment', 'missing', 'soundCount'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'ccvcc-o', phase: 5,
    name: 'CCVCC – Short O',
    // 'front' removed: it says /ʌ/ (rhymes with hunt), not short-o.
    description: 'Blends both ends: stomp, frost, prong…',
    icon: '🎺', group: 'ccvcc-o', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-i',
    learningOutcome: 'Decode short-O words with blends at both ends.',
    targetSounds: ['stCC-mp', 'prCC-ng', 'frCC-st', 'flCC-ss'],
    sampleWords: ['stomp', 'prong', 'blond', 'frost', 'floss', 'cross', 'gloss', 'strong'],
    sentenceExamples: ['Stomp on the frost.', 'The frost is on the prong.'],
    recommendedModes: ['classicBlend', 'segment', 'missing', 'soundCount'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'ccvcc-u', phase: 5,
    name: 'CCVCC – Short U',
    description: 'Blends both ends: stump, clump, blunt…',
    icon: '🏆', group: 'ccvcc-u', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-o',
    learningOutcome: 'Decode short-U words with blends at both ends.',
    targetSounds: ['stCC-mp', 'clCC-mp', 'blCC-nt', 'grCC-nt'],
    sampleWords: ['stump', 'clump', 'blunt', 'grunt', 'trust', 'thump', 'crust', 'crunch'],
    sentenceExamples: ['Trust the blunt stump.', 'I crunch the crust and grunt.'],
    recommendedModes: ['classicBlend', 'segment', 'missing', 'soundCount'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  /* ── Phase 6: Long vowels (split by spelling pattern) ────────────── */

  // Long A: a_e → ai → ay
  {
    id: 'long-a-ae', phase: 6,
    name: 'Long A · a_e',
    description: 'Split digraph: cake, name, late…',
    icon: '🎂', group: 'long-a-ae', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-u',
    learningOutcome: 'Read and spell long-A words with the a_e split-digraph pattern.',
    targetSounds: ['a_e /eɪ/'],
    sampleWords: ['cake', 'name', 'late', 'bake', 'lake', 'gate', 'wave', 'tape'],
    sentenceExamples: ['The cake has my name.', 'Make a lake by the gate.'],
    recommendedModes: ['classicBlend', 'hear', 'middle', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'long-a-ai', phase: 6,
    name: 'Long A · ai',
    description: 'Vowel team: rain, tail, sail…',
    icon: '🌧️', group: 'long-a-ai', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-a-ae',
    learningOutcome: 'Read and spell long-A words with the ai vowel-team pattern.',
    targetSounds: ['ai /eɪ/'],
    sampleWords: ['rain', 'tail', 'sail', 'paid', 'train', 'mail', 'wait', 'snail'],
    sentenceExamples: ['Rain on the train.', 'The snail has a tail.'],
    recommendedModes: ['classicBlend', 'hear', 'segment', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'long-a-ay', phase: 6,
    name: 'Long A · ay',
    description: 'Word-end pattern: play, day, way…',
    icon: '🎲', group: 'long-a-ay', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-a-ai',
    learningOutcome: 'Read and spell long-A words ending in -ay.',
    targetSounds: ['ay /eɪ/'],
    sampleWords: ['play', 'day', 'way', 'say', 'may', 'stay', 'tray', 'gray'],
    sentenceExamples: ['We play all day.', 'Stay on the tray.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  // Long E: ee → ea
  {
    id: 'long-e-ee', phase: 6,
    name: 'Long E · ee',
    description: 'Doubled vowel team: tree, feet, see…',
    icon: '🌲', group: 'long-e-ee', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-a-ay',
    learningOutcome: 'Read and spell long-E words with the ee vowel-team pattern.',
    targetSounds: ['ee /iː/'],
    sampleWords: ['tree', 'feet', 'see', 'bee', 'week', 'seed', 'feed', 'green'],
    sentenceExamples: ['I see a bee in the tree.', 'My feet feel the seeds.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'long-e-ea', phase: 6,
    name: 'Long E · ea',
    description: 'Vowel team: beat, sea, dream…',
    icon: '🍃', group: 'long-e-ea', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-e-ee',
    learningOutcome: 'Read and spell long-E words with the ea vowel-team pattern.',
    targetSounds: ['ea /iː/'],
    sampleWords: ['beat', 'sea', 'dream', 'beach', 'leaf', 'seat', 'mean', 'team'],
    sentenceExamples: ['I dream of the sea.', 'The team is on the beach.'],
    recommendedModes: ['classicBlend', 'hear', 'segment', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  // Long I: i_e → igh → y
  {
    id: 'long-i-ie', phase: 6,
    name: 'Long I · i_e',
    description: 'Split digraph: kite, like, time…',
    icon: '🪁', group: 'long-i-ie', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-e-ea',
    learningOutcome: 'Read and spell long-I words with the i_e split-digraph pattern.',
    targetSounds: ['i_e /aɪ/'],
    sampleWords: ['kite', 'like', 'time', 'ride', 'smile', 'bike', 'side', 'wide'],
    sentenceExamples: ['I ride my bike at five.', 'It is time to fly the kite.'],
    recommendedModes: ['classicBlend', 'hear', 'middle', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'long-i-igh', phase: 6,
    name: 'Long I · igh',
    description: 'Trigraph (igh = one /ī/ sound): night, light, right, might…',
    icon: '💡', group: 'long-i-igh', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-i-ie',
    learningOutcome: 'Read and spell long-I words using the igh trigraph as a single phoneme.',
    targetSounds: ['igh /aɪ/'],
    sampleWords: ['night', 'light', 'right', 'might', 'sight', 'high', 'fight', 'bright'],
    sentenceExamples: ['At night the light is bright.', 'The right path is in sight.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'long-i-y', phase: 6,
    name: 'Long I · y',
    description: 'Word-end y as long /ī/: cry, try, fly, my, sky…',
    icon: '😭', group: 'long-i-y', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-i-igh',
    learningOutcome: 'Read and spell short one-syllable words ending in y pronounced /aɪ/.',
    targetSounds: ['y /aɪ/'],
    sampleWords: ['cry', 'try', 'fly', 'my', 'sky', 'why', 'dry', 'shy'],
    sentenceExamples: ['Why does my fly try to fly?', 'The sky is dry today.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  // Long O: o_e → oa → ow
  {
    id: 'long-o-oe', phase: 6,
    name: 'Long O · o_e',
    description: 'Split digraph: home, hope, note…',
    icon: '🏠', group: 'long-o-oe', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-i-y',
    learningOutcome: 'Read and spell long-O words with the o_e split-digraph pattern.',
    targetSounds: ['o_e /oʊ/'],
    sampleWords: ['home', 'hope', 'note', 'rope', 'vote', 'bone', 'rose', 'stove'],
    sentenceExamples: ['Hope is at home.', 'Tie the rope by the stove.'],
    recommendedModes: ['classicBlend', 'hear', 'middle', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'long-o-oa', phase: 6,
    name: 'Long O · oa',
    description: 'Vowel team: boat, coat, road…',
    icon: '🚤', group: 'long-o-oa', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-o-oe',
    learningOutcome: 'Read and spell long-O words with the oa vowel-team pattern.',
    targetSounds: ['oa /oʊ/'],
    sampleWords: ['boat', 'coat', 'road', 'soap', 'toad', 'goal', 'load', 'foam'],
    sentenceExamples: ['A toad in a boat.', 'I load soap onto the road.'],
    recommendedModes: ['classicBlend', 'hear', 'segment', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'long-o-ow', phase: 6,
    name: 'Long O · ow',
    description: 'Word-end pattern: snow, slow, low…',
    icon: '❄️', group: 'long-o-ow', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-o-oa',
    learningOutcome: 'Read and spell long-O words ending in -ow.',
    targetSounds: ['ow /oʊ/'],
    sampleWords: ['snow', 'slow', 'low', 'mow', 'grow', 'blow', 'show', 'glow'],
    sentenceExamples: ['The snow is so low.', 'Slow plants grow well.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  // Long U: u_e → ue → ew → oo
  {
    id: 'long-u-ue', phase: 6,
    name: 'Long U · u_e',
    description: 'Split digraph: cube, tube, rule…',
    icon: '🎲', group: 'long-u-ue', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-o-ow',
    learningOutcome: 'Read and spell long-U words with the u_e split-digraph pattern.',
    targetSounds: ['u_e /juː/', 'u_e /uː/'],
    sampleWords: ['cube', 'tube', 'rule', 'mule', 'cute', 'use', 'tune', 'flute'],
    sentenceExamples: ['The cube is cute.', 'Use the flute to play a tune.'],
    recommendedModes: ['classicBlend', 'hear', 'middle', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'long-u-uue', phase: 6,
    name: 'Vowel team /oo/ · ue',
    description: 'Vowel team ue (different from u_e): blue, true, glue, clue.',
    icon: '💙', group: 'long-u-uue', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-u-ue',
    learningOutcome: 'Read and spell /uː/ words with the ue vowel-team pattern.',
    targetSounds: ['ue /uː/'],
    sampleWords: ['blue', 'true', 'glue', 'clue', 'sue', 'due', 'value', 'rescue'],
    sentenceExamples: ['The blue glue is true.', 'The clue is in the rescue.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'long-u-ew', phase: 6,
    name: 'Vowel team /oo/ · ew',
    description: 'Word-end ew: new, few, drew, blew, flew, grew…',
    icon: '🆕', group: 'long-u-ew', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-u-uue',
    learningOutcome: 'Read and spell /uː/ words ending in -ew.',
    targetSounds: ['ew /uː/'],
    sampleWords: ['new', 'few', 'drew', 'blew', 'flew', 'grew', 'chew', 'stew'],
    sentenceExamples: ['I drew a new boat.', 'A few birds flew over the stew.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'long-u-oo', phase: 6,
    name: 'Vowel team /oo/ · oo',
    description: 'Long /uː/ as in moon, food, pool, room (NOT short /ʊ/ as in book).',
    icon: '🌙', group: 'long-u-oo', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-u-ew',
    learningOutcome: 'Read and spell words with the oo /uː/ pattern and distinguish them from /ʊ/ as in book.',
    targetSounds: ['oo /uː/'],
    sampleWords: ['moon', 'food', 'pool', 'room', 'soon', 'boot', 'roof', 'noon'],
    sentenceExamples: ['The moon is on the pool soon.', 'I eat my food at noon.'],
    recommendedModes: ['classicBlend', 'hear', 'middle', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'short-oo', phase: 6,
    name: 'Short oo /ʊ/ · oo',
    description: 'oo\'s OTHER sound — short /ʊ/ as in book, look, good, foot.',
    icon: '📖', group: 'short-oo', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-u-oo',
    learningOutcome: 'Read and spell oo /ʊ/ words and discriminate them from the long /uː/ of moon.',
    targetSounds: ['oo /ʊ/'],
    sampleWords: ['book', 'look', 'cook', 'hook', 'foot', 'good', 'wood', 'hood'],
    sentenceExamples: ['Look at the good book.', 'The cook has a wood hook.'],
    recommendedModes: ['classicBlend', 'hear', 'middle', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  /* ── Phase 7: Diphthongs (split by spelling pattern) ─────────────── */
  {
    id: 'dip-oi', phase: 7,
    name: 'Diphthong · oi/oy',
    description: 'Same /ɔɪ/ sound: coin, boy, soil, joy…',
    icon: '🪙', group: 'dip-oi', level: 3,
    requiredMastery: 0.70, prerequisite: 'long-u-oo',
    learningOutcome: 'Read and spell oi/oy words and choose oi inside a word vs oy at word-end.',
    targetSounds: ['oi /ɔɪ/', 'oy /ɔɪ/'],
    sampleWords: ['coin', 'boy', 'soil', 'joy', 'boil', 'toy', 'point', 'enjoy'],
    sentenceExamples: ['The boy has a coin.', 'Joy is in the soil.'],
    recommendedModes: ['classicBlend', 'hear', 'middle', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'dip-ou', phase: 7,
    name: 'Diphthong · ou/ow',
    description: 'Same /aʊ/ sound: out, cow, loud, town…',
    icon: '🐄', group: 'dip-ou', level: 3,
    requiredMastery: 0.70, prerequisite: 'dip-oi',
    learningOutcome: 'Read and spell ou/ow words and discriminate /aʊ/ from /oʊ/ in similar spellings.',
    targetSounds: ['ou /aʊ/', 'ow /aʊ/'],
    sampleWords: ['out', 'cow', 'loud', 'town', 'found', 'now', 'down', 'house'],
    sentenceExamples: ['The cow is loud in town.', 'I found a house down the road.'],
    recommendedModes: ['classicBlend', 'hear', 'middle', 'missing'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'dip-aw', phase: 7,
    name: '/aw/ pattern',
    description: 'Separate from oi/ou: paw, jaw, saw, dawn…',
    icon: '🐾', group: 'dip-aw', level: 3,
    requiredMastery: 0.70, prerequisite: 'dip-ou',
    learningOutcome: 'Read and spell words with the aw / au /ɔː/ pattern.',
    targetSounds: ['aw /ɔː/', 'au /ɔː/'],
    sampleWords: ['paw', 'jaw', 'saw', 'dawn', 'lawn', 'draw', 'yawn', 'crawl'],
    sentenceExamples: ['I saw a paw on the lawn.', 'Draw a yawn at dawn.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  /* ── Phase 8: Advanced — mixed-blends review ─────────────────────── */
  {
    id: 'blends-review', phase: 8,
    name: 'Blends Review',
    description: 'float, crisp, blend, sprint…',
    icon: '🚀', group: 'blends', level: 3,
    requiredMastery: 0.70, prerequisite: 'dip-aw',
    learningOutcome: 'Read mixed-blend words fluently in continuous text without sounding each one out.',
    targetSounds: ['initial blends', 'final blends', 'both-end blends', 'tri-consonant blends (spr-, str-, scr-)'],
    sampleWords: ['float', 'crisp', 'blend', 'sprint', 'plank', 'scrap', 'twist', 'shrink'],
    sentenceExamples: ['Sprint and stamp until the drums thump.', 'Twist the lid and stash the snack.'],
    recommendedModes: ['classicBlend', 'hear', 'soundCount'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'rc-ar-or', phase: 8,
    name: 'Bossy R · ar & or',
    description: 'The r changes the vowel: car, star, corn, fork…',
    icon: '⭐', group: 'rc-ar-or', level: 3,
    requiredMastery: 0.70, prerequisite: 'blends-review',
    learningOutcome: 'Read and spell words where r changes the vowel sound: ar /ɑr/ and or /ɔr/.',
    targetSounds: ['ar /ɑr/', 'or /ɔr/'],
    sampleWords: ['car', 'star', 'farm', 'park', 'corn', 'fork', 'storm', 'sport'],
    sentenceExamples: ['A star shone on the farm.', 'The fork fell in the corn.'],
    recommendedModes: ['classicBlend', 'hear', 'middle'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'rc-er-ir-ur', phase: 8,
    name: 'Bossy R · er, ir & ur',
    description: 'Three spellings, one sound: her, bird, turn…',
    icon: '🐦', group: 'rc-er-ir-ur', level: 3,
    requiredMastery: 0.70, prerequisite: 'rc-ar-or',
    learningOutcome: 'Read and spell er/ir/ur words and recognise that all three spellings say the same /ɜr/ sound.',
    targetSounds: ['er /ɜr/', 'ir /ɜr/', 'ur /ɜr/'],
    sampleWords: ['her', 'fern', 'bird', 'girl', 'turn', 'burn', 'shirt', 'nurse'],
    sentenceExamples: ['The girl saw a bird in the fern.', 'Turn to the nurse in the shirt.'],
    recommendedModes: ['classicBlend', 'hear', 'middle'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  {
    id: 'cons-tch-dge', phase: 8,
    name: 'tch and dge',
    description: 'catch, match, badge, bridge…',
    icon: '🪝', group: 'cons-tch-dge', level: 2,
    requiredMastery: 0.70, prerequisite: 'rc-er-ir-ur',
    learningOutcome: 'Read and spell the three-letter tch and dge spellings, and choose them after a short vowel.',
    targetSounds: ['tch /tʃ/', 'dge /dʒ/'],
    sampleWords: ['catch', 'match', 'patch', 'fetch', 'pitch', 'badge', 'edge', 'bridge'],
    sentenceExamples: ['Catch the ball on the patch of grass.', 'The badge fell off the bridge.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'cons-ph', phase: 8,
    name: 'ph says /f/',
    description: 'phone, graph, dolphin…',
    icon: '📱', group: 'cons-ph', level: 2,
    requiredMastery: 0.70, prerequisite: 'cons-tch-dge',
    learningOutcome: 'Read and spell words where ph stands for the /f/ sound.',
    targetSounds: ['ph /f/'],
    sampleWords: ['phone', 'graph', 'photo', 'dolphin', 'elephant', 'alphabet', 'trophy', 'phonics'],
    sentenceExamples: ['I took a photo of the dolphin.', 'Her phone has the alphabet on it.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  /* ── Phase 9: Suffixes ──────────────────────────────────────────── */
  {
    id: 'suffix-ing', phase: 9,
    name: '-ing Words',
    description: 'running, jumping, sitting…',
    icon: '🏃', group: 'suffix-ing', level: 2,
    requiredMastery: 0.70, prerequisite: 'cons-ph',
    learningOutcome: 'Read and spell base + -ing words, including doubled-consonant forms (running, sitting).',
    targetSounds: ['-ing /ɪŋ/'],
    sampleWords: ['running', 'jumping', 'sitting', 'eating', 'playing', 'singing', 'reading', 'going'],
    sentenceExamples: ['She is running and jumping.', 'I am reading and singing.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'suffix-ed', phase: 9,
    name: '-ed Words',
    description: 'jumped, helped, picked…',
    icon: '✅', group: 'suffix-ed', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-ing',
    learningOutcome: 'Read and spell base + -ed words and recognise the three pronunciations /d/, /t/, /ɪd/.',
    targetSounds: ['-ed /d/', '-ed /t/', '-ed /ɪd/'],
    sampleWords: ['jumped', 'helped', 'picked', 'played', 'walked', 'wanted', 'landed', 'rested'],
    sentenceExamples: ['She picked and packed.', 'I walked and wanted to rest.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'suffix-er', phase: 9,
    name: '-er Words',
    description: 'faster, taller, bigger…',
    icon: '📈', group: 'suffix-er', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-ed',
    learningOutcome: 'Read and spell comparative -er adjectives, including doubled-consonant forms.',
    targetSounds: ['-er /ɚ/'],
    sampleWords: ['grander', 'taller', 'bigger', 'smaller', 'slower', 'longer', 'higher', 'softer'],
    sentenceExamples: ['Faster than a snail.', 'The taller tree is older.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'suffix-est', phase: 9,
    name: '-est Words',
    description: 'fastest, tallest, biggest…',
    icon: '🏆', group: 'suffix-est', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-er',
    learningOutcome: 'Read and spell superlative -est adjectives, including doubled-consonant forms.',
    targetSounds: ['-est /ɪst/'],
    sampleWords: ['grandest', 'tallest', 'biggest', 'smallest', 'slowest', 'longest', 'softest', 'kindest'],
    sentenceExamples: ['The fastest is the best.', 'Kindest words win the longest friends.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },

  /* ── Phase 10: Morphology + multisyllabic + sight vocabulary ───── */
  {
    id: 'prefixes', phase: 10,
    name: 'Prefixes (re-, un-)',
    description: 'redo, untie, unwrap…',
    icon: '↩️', group: 'prefixes', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-est',
    learningOutcome: 'Read and spell base words with re- and un- prefixes and infer the meaning shift.',
    targetSounds: ['re- /ri/', 'un- /ʌn/'],
    sampleWords: ['redo', 'untie', 'unwrap', 'rewrite', 'unzip', 'unsafe', 'reuse', 'unfold'],
    sentenceExamples: ['I will redo my work and untie my shoe.', 'Unwrap the gift and reuse the box.'],
    recommendedModes: ['classicBlend', 'hear', 'segment'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'suffixes-advanced', phase: 10,
    name: 'Advanced Suffixes (-tion, -able)',
    description: 'action, nation, readable…',
    icon: '🧩', group: 'suffixes-advanced', level: 3,
    requiredMastery: 0.70, prerequisite: 'prefixes',
    learningOutcome: 'Read and spell words with -tion (/ʃən/) and -able (/əbl/) suffixes.',
    targetSounds: ['-tion /ʃən/', '-able /əbl/'],
    sampleWords: ['action', 'nation', 'readable', 'station', 'lovable', 'fiction', 'portable', 'option'],
    sentenceExamples: ['The nation took action.', 'A readable book is portable.'],
    recommendedModes: ['classicBlend', 'hear'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'multisyllable', phase: 10,
    name: 'Multi-syllabic Words',
    description: 'science, market, energy…',
    icon: '🎼', group: 'multisyllable', level: 3,
    requiredMastery: 0.70, prerequisite: 'suffixes-advanced',
    learningOutcome: 'Read and spell two- and three-syllable words using syllable-division heuristics.',
    targetSounds: ['open syllable', 'closed syllable', 'consonant-le'],
    sampleWords: ['science', 'market', 'energy', 'jungle', 'planet', 'magnet', 'family', 'puzzle'],
    sentenceExamples: ['We learn science at the market.', 'My family solved the jungle puzzle.'],
    recommendedModes: ['classicBlend', 'hear'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
  {
    id: 'sight-highfreq', phase: 10,
    name: 'High-frequency Sight Words',
    description: 'their, because, enough…',
    icon: '👀', group: 'sight-highfreq', level: 3,
    requiredMastery: 0.70, prerequisite: 'multisyllable',
    learningOutcome: 'Recognise and spell common irregular high-frequency words on sight.',
    targetSounds: ['irregular sight'],
    sampleWords: ['their', 'because', 'enough', 'through', 'friend', 'every', 'people', 'thought'],
    sentenceExamples: ['Their friend has enough.', 'Every person thought of a friend.'],
    recommendedModes: ['classicBlend', 'hear'],
    masteryCriteria: DEFAULT_MASTERY_CRITERIA,
  },
];

// ── Lookups ────────────────────────────────────────────────────────────────

/** Get the PHASES entry for a phase number, or null. */
export function getPhase(phaseNumber) {
  return PHASES.find(p => p.phase === phaseNumber) ?? null;
}

/** Get a CURRICULUM stage by id, or null. */
export function getStage(stageId) {
  return CURRICULUM.find(s => s.id === stageId) ?? null;
}

/** Get every CURRICULUM stage that belongs to a phase number. */
export function getStagesInPhase(phaseNumber) {
  return CURRICULUM.filter(s => s.phase === phaseNumber);
}

/**
 * Returns which curriculum stages are unlocked based on mastery scores.
 * @param {Record<string, number>} groupMastery - map of group -> accuracy (0-1)
 * @returns {string[]} array of unlocked stage IDs
 */
export function getUnlockedStages(groupMastery) {
  const unlocked = [];

  for (const stage of CURRICULUM) {
    if (!stage.prerequisite) { unlocked.push(stage.id); continue; }

    const prereq = CURRICULUM.find(s => s.id === stage.prerequisite);
    if (!prereq) continue;
    if (!unlocked.includes(prereq.id)) continue;

    const prereqAccuracy = getStageAccuracy(prereq, groupMastery);
    if (prereqAccuracy >= stage.requiredMastery) {
      unlocked.push(stage.id);
    }
  }

  return unlocked;
}

/**
 * Average accuracy across all groups in a stage.
 * @param {object} stage
 * @param {Record<string, number>} groupMastery
 * @returns {number} 0-1
 */
function getStageAccuracy(stage, groupMastery) {
  const groups = stage.groups ?? [stage.group];
  if (!groups.length) return 0;
  const scores = groups.map(g => groupMastery[g] ?? 0);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * Get the recommended next stage for the child based on current progress.
 * @param {Record<string, number>} groupMastery
 * @returns {object|null} curriculum stage
 */
export function getRecommendedStage(groupMastery) {
  const unlocked = getUnlockedStages(groupMastery);

  for (const id of unlocked) {
    const stage = CURRICULUM.find(s => s.id === id);
    const accuracy = getStageAccuracy(stage, groupMastery);
    if (accuracy < MASTERY_THRESHOLD) return stage;
  }

  const lastId = unlocked[unlocked.length - 1];
  return CURRICULUM.find(s => s.id === lastId) ?? null;
}

/**
 * XP rewards by action.
 */
export const XP_REWARDS = {
  correct:      10,
  correct_fast: 15,  // answered in < 3 seconds
  streak_5:     20,  // 5 in a row
  streak_10:    40,  // 10 in a row
  daily_goal:   50,  // completed daily goal
  perfect_round: 25, // no mistakes in a session
  new_word:      5,  // first time attempting a word
};

/**
 * Level thresholds: XP needed to reach each level.
 */
export const LEVEL_XP = [
  0,    // Level 1
  100,  // Level 2
  250,  // Level 3
  450,  // Level 4
  700,  // Level 5
  1000, // Level 6
  1400, // Level 7
  1900, // Level 8
  2500, // Level 9
  3200, // Level 10
];

/**
 * Calculate level from total XP.
 * @param {number} xp
 * @returns {{ level: number, progress: number, nextXP: number }}
 */
export function getLevelInfo(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]) level = i + 1;
    else break;
  }
  const currentXP = LEVEL_XP[level - 1] ?? 0;
  const nextXP = LEVEL_XP[level] ?? LEVEL_XP[LEVEL_XP.length - 1];
  const progress = nextXP > currentXP
    ? (xp - currentXP) / (nextXP - currentXP)
    : 1;
  return { level: Math.min(level, LEVEL_XP.length), progress, nextXP };
}
