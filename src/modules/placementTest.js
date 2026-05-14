/**
 * PhonicsQuest – Literacy Placement Screener
 *
 * This is a cross-domain developmental placement tool (not a pure phonics
 * diagnostic).  It measures oral language, phonological awareness, decoding,
 * connected reading, and language readiness to route each learner into the
 * best overall pathway in PhonicsQuest.
 *
 * Gate sequence:
 *   A. Oral/no-print foundations
 *   B. Print decoding (phonics phases + sight words reported separately)
 *   C. Connected reading
 *   D. Sentence/grammar/vocabulary readiness
 *
 * Gate progression is adaptive: B only appears if A is secure, etc.
 *
 * The Gate B phase numbers MUST match curriculum.js. PLACEMENT_PHASES below
 * is the single source of truth for: gate-B item phase tags, the phase →
 * fallback-group mapping, the pre-seeded mastery stats, and the result-card
 * label. Any drift between this file and curriculum.js was the alignment
 * bug called out in the architecture review — keep them in sync.
 */

import { audio } from './audio.js';

/**
 * Canonical phase definitions for Gate B decoding. Each entry is one row
 * the placement test samples. `fallbackGroup` is what we route the learner
 * into if we can't recover a more specific group from their answers, and
 * `seedWords` are the words we mark as already-known when the learner
 * passes a phase below their demonstrated level.
 *
 * Ordered list — index = phase - 1.
 */
export const PLACEMENT_PHASES = [
  { phase: 1, label: 'Phase 1 — CVC',            fallbackGroup: 'cvc-a',   seedWords: ['cat', 'bed', 'sit', 'dog', 'map', 'sun'] },
  { phase: 2, label: 'Phase 2 — Initial blends', fallbackGroup: 'ccvc-a',  seedWords: ['flag', 'frog', 'step', 'skip', 'plan'] },
  { phase: 3, label: 'Phase 3 — Final blends',   fallbackGroup: 'cvcc-a',  seedWords: ['best', 'lamp', 'gift', 'sand', 'hand'] },
  { phase: 4, label: 'Phase 4 — Digraphs',       fallbackGroup: 'digraphs', seedWords: ['ship', 'chin', 'that', 'thin', 'chop'] },
  { phase: 5, label: 'Phase 5 — Both-end blends', fallbackGroup: 'ccvcc-a', seedWords: ['stamp', 'blend', 'print', 'plant', 'crisp'] },
  // Phase 6 fallback points at the FIRST long-vowel micro-stage (a_e) so
  // a child placed here lands on the easiest entry point — the macro-group
  // `long-a` no longer exists as a curriculum stage after the spelling-
  // pattern split.
  { phase: 6, label: 'Phase 6 — Long vowels',    fallbackGroup: 'long-a-ae', seedWords: ['cake', 'kite', 'home', 'rain', 'bike'] },
];

const MAX_PLACEMENT_PHASE = PLACEMENT_PHASES.length;

/**
 * STAGES — the parent-facing skill ladder the screener walks the child up.
 * Items are tagged with a `stage` key; the derive layer computes a score
 * per stage and surfaces matching skill gaps in the parent report.
 *
 * Order matters: a child who fails an earlier stage is not pushed further
 * into print stages (see `getNextGateToAppend`).
 *
 *   1. picture-id        — receptive attention / picture-word matching
 *   2. known-vocab       — receptive vocabulary beyond basic objects
 *   3. phonemic-awareness — first / last / middle sound, oral blending
 *   4. letter-sounds     — grapheme-phoneme correspondence
 *   5. blending          — oral blend → printed word match
 *   6. reading           — decoding, sentence reading, comprehension
 *   7. grammar-vocab     — sentence building, grammar, vocab in context
 *
 * `legacyGate` maps each stage onto the legacy A/B/C/D gates so existing
 * routing logic (gateScores → readingBand → home layout) keeps working.
 */
export const STAGES = [
  { id: 'picture-id',         label: 'Picture identification',  icon: '🖼️', legacyGate: 'A',
    summary: 'Tap the picture I name. Tests attention and basic vocabulary.' },
  { id: 'known-vocab',        label: 'Known vocabulary',        icon: '📚', legacyGate: 'A',
    summary: 'Tap a slightly trickier picture from a spoken word.' },
  { id: 'phonemic-awareness', label: 'Phonemic awareness',      icon: '👂', legacyGate: 'A',
    summary: 'Hear the first, last and middle sounds in short words.' },
  { id: 'letter-sounds',      label: 'Letter sounds',           icon: '🔤', legacyGate: 'A',
    summary: 'Know the sound each letter makes.' },
  { id: 'blending',           label: 'Sound blending',          icon: '🔗', legacyGate: 'A',
    summary: 'Hear /c/ /a/ /t/ — blend it into "cat".' },
  { id: 'reading',            label: 'Reading',                 icon: '📖', legacyGate: 'B',
    summary: 'Read decodable words and short sentences.' },
  { id: 'grammar-vocab',      label: 'Grammar & vocabulary',    icon: '✏️', legacyGate: 'D',
    summary: 'Build sentences, choose grammar, understand words in context.' },
];

export const STAGE_IDS = STAGES.map(s => s.id);

/**
 * Section → stage map. Every item's `section` (used for scoring) belongs to
 * exactly one stage. `oralLanguage` is folded into picture-id because the
 * basic-oral-response teacher items observe attention/comprehension, the
 * same skill the picture-id stage probes from the child side.
 */
const SECTION_TO_STAGE = {
  oral:             'picture-id',
  pictureId:        'picture-id',
  vocab:            'picture-id',          // legacy section name — kept for back-compat scoring
  knownVocab:       'known-vocab',
  firstSound:       'phonemic-awareness',
  lastSound:        'phonemic-awareness',
  middleSound:      'phonemic-awareness',
  oralBlending:     'phonemic-awareness',  // oral blend is still PA, not yet print
  letterSounds:     'letter-sounds',
  blending:         'blending',
  decoding:         'reading',
  sightWords:       'reading',
  connectedReading: 'reading',
  comprehension:    'reading',
  storyReadiness:   'reading',
  sentenceReady:    'grammar-vocab',
  grammarReady:     'grammar-vocab',
  vocabularyReady:  'grammar-vocab',
};

const GATE_A_ITEMS = [
  // ─────────────────────────────────────────────────────────────────────────
  // STAGE 1 — Picture identification.  Tests attention + basic vocabulary.
  // Oral-language teacher observations live here too so a teacher can mark
  // "responsive to instruction" alongside the matching picture-choice items.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'a-or-1',
    gate: 'A',
    stage: 'picture-id',
    section: 'oral',
    kind: 'teacher-scale',
    title: 'Basic oral response',
    prompt: 'Learner responds to name/questions with understandable speech.',
  },
  {
    id: 'a-or-2',
    gate: 'A',
    stage: 'picture-id',
    section: 'oral',
    kind: 'teacher-scale',
    title: 'Basic oral response',
    prompt: 'Learner follows a 2-step instruction (e.g. "Clap twice, then stand up").',
  },
  {
    id: 'a-pic-1',
    gate: 'A',
    stage: 'picture-id',
    section: 'vocab',                                  // legacy section name preserved
    kind: 'picture-choice',
    title: 'Picture identification',
    prompt: 'Tap the fish.',
    speak: 'fish',
    correct: 'fish',
    options: [
      { id: 'fish', emoji: '🐟', label: 'Fish' },
      { id: 'dog', emoji: '🐶', label: 'Dog' },
      { id: 'car', emoji: '🚗', label: 'Car' },
      { id: 'book', emoji: '📘', label: 'Book' },
    ],
  },
  {
    id: 'a-pic-2',
    gate: 'A',
    stage: 'picture-id',
    section: 'vocab',
    kind: 'picture-choice',
    title: 'Picture identification',
    prompt: 'Tap the apple.',
    speak: 'apple',
    correct: 'apple',
    options: [
      { id: 'apple', emoji: '🍎', label: 'Apple' },
      { id: 'ball', emoji: '⚽', label: 'Ball' },
      { id: 'tree', emoji: '🌳', label: 'Tree' },
      { id: 'shoe', emoji: '👟', label: 'Shoe' },
    ],
  },
  {
    id: 'a-pic-3',
    gate: 'A',
    stage: 'picture-id',
    section: 'vocab',
    kind: 'picture-choice',
    title: 'Picture identification',
    prompt: 'Tap the star.',
    speak: 'star',
    correct: 'star',
    options: [
      { id: 'star', emoji: '⭐', label: 'Star' },
      { id: 'cloud', emoji: '☁️', label: 'Cloud' },
      { id: 'flower', emoji: '🌸', label: 'Flower' },
      { id: 'leaf', emoji: '🍃', label: 'Leaf' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // STAGE 2 — Known vocabulary.  Slightly more advanced receptive vocab:
  // actions, attributes, categories.  Still oral / no print.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'a-kv-1',
    gate: 'A',
    stage: 'known-vocab',
    section: 'knownVocab',
    kind: 'picture-choice',
    title: 'Known vocabulary',
    prompt: 'Tap something you eat.',
    speak: 'something you eat',
    correct: 'banana',
    options: [
      { id: 'banana', emoji: '🍌', label: 'Banana' },
      { id: 'truck',  emoji: '🚚', label: 'Truck' },
      { id: 'pencil', emoji: '✏️', label: 'Pencil' },
      { id: 'rain',   emoji: '🌧️', label: 'Rain' },
    ],
  },
  {
    id: 'a-kv-2',
    gate: 'A',
    stage: 'known-vocab',
    section: 'knownVocab',
    kind: 'picture-choice',
    title: 'Known vocabulary',
    prompt: 'Tap someone who is running.',
    speak: 'running',
    correct: 'runner',
    options: [
      { id: 'runner',  emoji: '🏃', label: 'Running' },
      { id: 'sitter',  emoji: '🧎', label: 'Kneeling' },
      { id: 'sleeper', emoji: '😴', label: 'Sleeping' },
      { id: 'reader',  emoji: '📖', label: 'Reading' },
    ],
  },
  {
    id: 'a-kv-3',
    gate: 'A',
    stage: 'known-vocab',
    section: 'knownVocab',
    kind: 'picture-choice',
    title: 'Known vocabulary',
    prompt: 'Tap something that is hot.',
    speak: 'hot',
    correct: 'fire',
    options: [
      { id: 'fire',     emoji: '🔥',  label: 'Fire' },
      { id: 'ice',      emoji: '🧊',  label: 'Ice' },
      { id: 'snow',     emoji: '❄️',  label: 'Snow' },
      { id: 'umbrella', emoji: '☂️', label: 'Umbrella' },
    ],
  },
  {
    id: 'a-kv-4',
    gate: 'A',
    stage: 'known-vocab',
    section: 'knownVocab',
    kind: 'picture-choice',
    title: 'Known vocabulary',
    prompt: 'Tap the helper who treats sick people.',
    speak: 'doctor',
    correct: 'doctor',
    options: [
      { id: 'doctor',  emoji: '🧑‍⚕️', label: 'Doctor' },
      { id: 'baker',   emoji: '👨‍🍳', label: 'Cook' },
      { id: 'farmer',  emoji: '👨‍🌾', label: 'Farmer' },
      { id: 'driver',  emoji: '🚗', label: 'Driver' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // STAGE 3 — Phonemic awareness (first / last / middle sound).  Pure oral,
  // pictures only; the child hears a target phoneme and picks the matching
  // word.  This is the first probe that explicitly tests phoneme handling.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'a-first-1',
    gate: 'A',
    stage: 'phonemic-awareness',
    section: 'firstSound',
    kind: 'picture-choice',
    title: 'First sound',
    prompt: 'Which picture starts with /m/?',
    speak: 'moon',
    correct: 'moon',
    options: [
      { id: 'moon', emoji: '🌙', label: 'Moon' },
      { id: 'sun', emoji: '☀️', label: 'Sun' },
      { id: 'hat', emoji: '🎩', label: 'Hat' },
      { id: 'bus', emoji: '🚌', label: 'Bus' },
    ],
  },
  {
    id: 'a-first-2',
    gate: 'A',
    stage: 'phonemic-awareness',
    section: 'firstSound',
    kind: 'picture-choice',
    title: 'First sound',
    prompt: 'Which picture starts with /s/?',
    speak: 'sock',
    correct: 'sock',
    options: [
      { id: 'sock', emoji: '🧦', label: 'Sock' },
      { id: 'duck', emoji: '🦆', label: 'Duck' },
      { id: 'fish', emoji: '🐟', label: 'Fish' },
      { id: 'bear', emoji: '🐻', label: 'Bear' },
    ],
  },
  {
    id: 'a-first-3',
    gate: 'A',
    stage: 'phonemic-awareness',
    section: 'firstSound',
    kind: 'picture-choice',
    title: 'First sound',
    prompt: 'Which picture starts with /b/?',
    speak: 'ball',
    correct: 'ball',
    options: [
      { id: 'ball', emoji: '⚽', label: 'Ball' },
      { id: 'cat', emoji: '🐱', label: 'Cat' },
      { id: 'tree', emoji: '🌳', label: 'Tree' },
      { id: 'star', emoji: '⭐', label: 'Star' },
    ],
  },
  {
    id: 'a-last-1',
    gate: 'A',
    stage: 'phonemic-awareness',
    section: 'lastSound',
    kind: 'picture-choice',
    title: 'Last sound',
    prompt: 'Which picture ends with /t/?',
    speak: 'cat',
    correct: 'cat',
    options: [
      { id: 'cat', emoji: '🐱', label: 'Cat' },
      { id: 'bee', emoji: '🐝', label: 'Bee' },
      { id: 'goat', emoji: '🐐', label: 'Goat' },
      { id: 'shoe', emoji: '👟', label: 'Shoe' },
    ],
  },
  {
    id: 'a-last-2',
    gate: 'A',
    stage: 'phonemic-awareness',
    section: 'lastSound',
    kind: 'picture-choice',
    title: 'Last sound',
    prompt: 'Which picture ends with /g/?',
    speak: 'dog',
    correct: 'dog',
    options: [
      { id: 'dog', emoji: '🐶', label: 'Dog' },
      { id: 'cat', emoji: '🐱', label: 'Cat' },
      { id: 'hen', emoji: '🐔', label: 'Hen' },
      { id: 'bee', emoji: '🐝', label: 'Bee' },
    ],
  },
  {
    id: 'a-last-3',
    gate: 'A',
    stage: 'phonemic-awareness',
    section: 'lastSound',
    kind: 'picture-choice',
    title: 'Last sound',
    prompt: 'Which picture ends with /n/?',
    speak: 'sun',
    correct: 'sun',
    options: [
      { id: 'sun', emoji: '☀️', label: 'Sun' },
      { id: 'frog', emoji: '🐸', label: 'Frog' },
      { id: 'pig', emoji: '🐷', label: 'Pig' },
      { id: 'duck', emoji: '🦆', label: 'Duck' },
    ],
  },
  {
    id: 'a-middle-1',
    gate: 'A',
    stage: 'phonemic-awareness',
    section: 'middleSound',
    kind: 'picture-choice',
    title: 'Middle sound',
    prompt: 'Which picture has /a/ in the middle?',
    speak: 'cat',
    correct: 'cat',
    options: [
      { id: 'cat', emoji: '🐱', label: 'Cat' },
      { id: 'pig', emoji: '🐷', label: 'Pig' },
      { id: 'bus', emoji: '🚌', label: 'Bus' },
      { id: 'hen', emoji: '🐔', label: 'Hen' },
    ],
  },
  {
    id: 'a-middle-2',
    gate: 'A',
    stage: 'phonemic-awareness',
    section: 'middleSound',
    kind: 'picture-choice',
    title: 'Middle sound',
    prompt: 'Which picture has /i/ in the middle?',
    speak: 'pig',
    correct: 'pig',
    options: [
      { id: 'pig', emoji: '🐷', label: 'Pig' },
      { id: 'dog', emoji: '🐶', label: 'Dog' },
      { id: 'cup', emoji: '🥤', label: 'Cup' },
      { id: 'hen', emoji: '🐔', label: 'Hen' },
    ],
  },
  {
    id: 'a-middle-3',
    gate: 'A',
    stage: 'phonemic-awareness',
    section: 'middleSound',
    kind: 'picture-choice',
    title: 'Middle sound',
    prompt: 'Which picture has /o/ in the middle?',
    speak: 'dog',
    correct: 'dog',
    options: [
      { id: 'dog', emoji: '🐶', label: 'Dog' },
      { id: 'cat', emoji: '🐱', label: 'Cat' },
      { id: 'bee', emoji: '🐝', label: 'Bee' },
      { id: 'pig', emoji: '🐷', label: 'Pig' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // STAGE 4 — Letter-sound knowledge.  Teacher-scored: many K1 learners
  // can't yet self-tap a letter-sound match, so a parent/teacher marks
  // the level of independence.  See `letterSounds` mode for daily practice.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'a-letters-1',
    gate: 'A',
    stage: 'letter-sounds',
    section: 'letterSounds',
    kind: 'teacher-scale',
    title: 'Letter-sound knowledge',
    prompt: 'Teacher score: learner identifies common letter sounds in an adult-led check (no independent print demand).',
  },
  {
    id: 'a-letters-2',
    gate: 'A',
    stage: 'letter-sounds',
    section: 'letterSounds',
    kind: 'teacher-scale',
    title: 'Letter-sound knowledge',
    prompt: 'Teacher score: learner identifies vowel sounds (a, e, i, o, u) when letter cards are shown.',
  },
  // ─────────────────────────────────────────────────────────────────────────
  // STAGE 5 — Oral blending.  Hear separated phonemes, choose the assembled
  // word from picture choices.  Words match the CVC groups the child will
  // see in Blend It! mode (`blend.js`).
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'a-blend-1',
    gate: 'A',
    stage: 'blending',
    section: 'oralBlending',
    kind: 'picture-choice',
    title: 'Oral blending',
    prompt: 'Listen: /c/ /a/ /t/. Tap the word.',
    speak: 'cat',
    correct: 'cat',
    sourceGroup: 'cvc-a',
    options: [
      { id: 'cat', emoji: '🐱', label: 'Cat' },
      { id: 'cap', emoji: '🧢', label: 'Cap' },
      { id: 'can', emoji: '🥫', label: 'Can' },
      { id: 'car', emoji: '🚗', label: 'Car' },
    ],
  },
  {
    id: 'a-blend-2',
    gate: 'A',
    stage: 'blending',
    section: 'oralBlending',
    kind: 'picture-choice',
    title: 'Oral blending',
    prompt: 'Listen: /d/ /o/ /g/. Tap the word.',
    speak: 'dog',
    correct: 'dog',
    sourceGroup: 'cvc-o',
    options: [
      { id: 'dog', emoji: '🐶', label: 'Dog' },
      { id: 'log', emoji: '🪵', label: 'Log' },
      { id: 'fog', emoji: '🌫️', label: 'Fog' },
      { id: 'frog', emoji: '🐸', label: 'Frog' },
    ],
  },
  {
    id: 'a-blend-3',
    gate: 'A',
    stage: 'blending',
    section: 'oralBlending',
    kind: 'picture-choice',
    title: 'Oral blending',
    prompt: 'Listen: /s/ /u/ /n/. Tap the word.',
    speak: 'sun',
    correct: 'sun',
    sourceGroup: 'cvc-u',
    options: [
      { id: 'sun', emoji: '☀️', label: 'Sun' },
      { id: 'bun', emoji: '🍞', label: 'Bun' },
      { id: 'run', emoji: '🏃', label: 'Run' },
      { id: 'fun', emoji: '🎉', label: 'Fun' },
    ],
  },
];

const GATE_B_ITEMS = [
  // ── Phase 1: CVC short vowels ─────────────────────────────────────────────
  { id: 'b-cvc-1', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'CVC decoding', prompt: 'Tap: cat', speak: 'cat', correct: 'cat', phase: 1, group: 'cvc-a', options: ['cat', 'cut', 'cot', 'cap'] },
  { id: 'b-cvc-2', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Short vowels', prompt: 'Tap: bed', speak: 'bed', correct: 'bed', phase: 1, group: 'cvc-e', options: ['bad', 'bid', 'bed', 'bud'] },
  { id: 'b-cvc-3', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Short vowels', prompt: 'Tap: sit', speak: 'sit', correct: 'sit', phase: 1, group: 'cvc-i', options: ['sit', 'set', 'sat', 'bit'] },
  { id: 'b-cvc-4', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Short vowels', prompt: 'Tap: dog', speak: 'dog', correct: 'dog', phase: 1, group: 'cvc-o', options: ['dog', 'dig', 'dug', 'hog'] },
  // ── Phase 2: Initial blends (CCVC) ────────────────────────────────────────
  { id: 'b-blend-1', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Initial blends', prompt: 'Tap: flag', speak: 'flag', correct: 'flag', phase: 2, group: 'ccvc-a', options: ['flag', 'flap', 'frog', 'plug'] },
  { id: 'b-blend-2', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Initial blends', prompt: 'Tap: frog', speak: 'frog', correct: 'frog', phase: 2, group: 'ccvc-o', options: ['frog', 'fog', 'from', 'grog'] },
  { id: 'b-blend-3', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Initial blends', prompt: 'Tap: step', speak: 'step', correct: 'step', phase: 2, group: 'ccvc-e', options: ['step', 'stem', 'stop', 'skip'] },
  // ── Phase 3: Final blends (CVCC) ──────────────────────────────────────────
  { id: 'b-cvcc-1', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Final blends', prompt: 'Tap: best', speak: 'best', correct: 'best', phase: 3, group: 'cvcc-e', options: ['best', 'beast', 'bent', 'belt'] },
  { id: 'b-cvcc-2', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Final blends', prompt: 'Tap: lamp', speak: 'lamp', correct: 'lamp', phase: 3, group: 'cvcc-a', options: ['lamp', 'lame', 'camp', 'damp'] },
  { id: 'b-cvcc-3', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Final blends', prompt: 'Tap: gift', speak: 'gift', correct: 'gift', phase: 3, group: 'cvcc-i', options: ['gift', 'gist', 'lift', 'sift'] },
  // ── Phase 4: Digraphs ─────────────────────────────────────────────────────
  { id: 'b-digraph-1', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Digraphs', prompt: 'Tap: ship', speak: 'ship', correct: 'ship', phase: 4, group: 'digraphs', options: ['chip', 'shop', 'ship', 'slip'] },
  { id: 'b-digraph-2', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Digraphs', prompt: 'Tap: chin', speak: 'chin', correct: 'chin', phase: 4, group: 'digraphs', options: ['chin', 'thin', 'shin', 'win'] },
  { id: 'b-digraph-3', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Digraphs', prompt: 'Tap: that', speak: 'that', correct: 'that', phase: 4, group: 'digraphs', options: ['that', 'chat', 'flat', 'hat'] },
  // ── Phase 5: Both-end blends (CCVCC) ──────────────────────────────────────
  { id: 'b-ccvcc-1', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Both-end blends', prompt: 'Tap: stamp', speak: 'stamp', correct: 'stamp', phase: 5, group: 'ccvcc-a', options: ['stamp', 'stomp', 'stump', 'champ'] },
  { id: 'b-ccvcc-2', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Both-end blends', prompt: 'Tap: blend', speak: 'blend', correct: 'blend', phase: 5, group: 'ccvcc-e', options: ['blend', 'blond', 'bland', 'bend'] },
  { id: 'b-ccvcc-3', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Both-end blends', prompt: 'Tap: print', speak: 'print', correct: 'print', phase: 5, group: 'ccvcc-i', options: ['print', 'paint', 'plant', 'pint'] },
  // ── Phase 6: Long vowels ──────────────────────────────────────────────────
  { id: 'b-long-1', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Long vowels', prompt: 'Tap: cake', speak: 'cake', correct: 'cake', phase: 6, group: 'long-a', options: ['cake', 'cane', 'cook', 'kick'] },
  { id: 'b-long-2', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Long vowels', prompt: 'Tap: kite', speak: 'kite', correct: 'kite', phase: 6, group: 'long-i', options: ['kite', 'kit', 'bite', 'site'] },
  { id: 'b-long-3', gate: 'B', stage: 'reading', section: 'decoding', kind: 'word-choice', title: 'Long vowels', prompt: 'Tap: home', speak: 'home', correct: 'home', phase: 6, group: 'long-o', options: ['home', 'hone', 'some', 'come'] },
  // ── Sight words ───────────────────────────────────────────────────────────
  { id: 'b-sight-1', gate: 'B', stage: 'reading', section: 'sightWords', kind: 'word-choice', title: 'Sight words', prompt: 'Tap: said', speak: 'said', correct: 'said', options: ['seed', 'said', 'sad', 'sail'] },
  { id: 'b-sight-2', gate: 'B', stage: 'reading', section: 'sightWords', kind: 'word-choice', title: 'Sight words', prompt: 'Tap: the', speak: 'the', correct: 'the', options: ['the', 'then', 'them', 'that'] },
  { id: 'b-sight-3', gate: 'B', stage: 'reading', section: 'sightWords', kind: 'word-choice', title: 'Sight words', prompt: 'Tap: was', speak: 'was', correct: 'was', options: ['was', 'saw', 'has', 'gas'] },
  { id: 'b-sight-4', gate: 'B', stage: 'reading', section: 'sightWords', kind: 'word-choice', title: 'Sight words', prompt: 'Tap: they', speak: 'they', correct: 'they', options: ['they', 'them', 'then', 'the'] },
  { id: 'b-sight-5', gate: 'B', stage: 'reading', section: 'sightWords', kind: 'word-choice', title: 'Sight words', prompt: 'Tap: have', speak: 'have', correct: 'have', options: ['have', 'gave', 'live', 'cave'] },
  { id: 'b-sight-6', gate: 'B', stage: 'reading', section: 'sightWords', kind: 'word-choice', title: 'Sight words', prompt: 'Tap: look', speak: 'look', correct: 'look', options: ['look', 'took', 'book', 'good'] },
];

const GATE_C_ITEMS = [
  // ── Decodable word reading ────────────────────────────────────────────────
  {
    id: 'c-word-1', gate: 'C', stage: 'reading', section: 'connectedReading', kind: 'word-choice', title: 'Decodable reading',
    prompt: 'Tap: jump', speak: 'jump', correct: 'jump', options: ['jump', 'lump', 'lamp', 'hump'],
  },
  {
    id: 'c-word-2', gate: 'C', stage: 'reading', section: 'connectedReading', kind: 'word-choice', title: 'Decodable reading',
    prompt: 'Tap: help', speak: 'help', correct: 'help', options: ['help', 'held', 'heap', 'helm'],
  },
  // ── Sentence reading ──────────────────────────────────────────────────────
  {
    id: 'c-sentence-1', gate: 'C', stage: 'reading', section: 'connectedReading', kind: 'sentence-choice', title: 'Sentence reading',
    sentence: 'The cat can hop.', prompt: 'Read and choose the matching picture.',
    correct: 'cat-hop',
    options: [
      { id: 'cat-hop', emoji: '🐱↗️', label: 'Cat can hop' },
      { id: 'dog-run', emoji: '🐶🏃', label: 'Dog can run' },
      { id: 'pig-sit', emoji: '🐷🪑', label: 'Pig can sit' },
      { id: 'hen-fly', emoji: '🐔🪽', label: 'Hen can fly' },
    ],
  },
  {
    id: 'c-sentence-2', gate: 'C', stage: 'reading', section: 'connectedReading', kind: 'sentence-choice', title: 'Sentence reading',
    sentence: 'The dog sat on the rug.', prompt: 'Read and choose the matching picture.',
    correct: 'dog-rug',
    options: [
      { id: 'dog-rug', emoji: '🐶🟫', label: 'Dog on rug' },
      { id: 'cat-bed', emoji: '🐱🛏️', label: 'Cat on bed' },
      { id: 'hen-box', emoji: '🐔📦', label: 'Hen on box' },
      { id: 'pig-mud', emoji: '🐷💧', label: 'Pig in mud' },
    ],
  },
  // ── Read aloud readiness (teacher-scale) ──────────────────────────────────
  {
    id: 'c-readaloud-1', gate: 'C', stage: 'reading', section: 'storyReadiness', kind: 'teacher-scale',
    title: 'Read aloud readiness',
    prompt: 'Teacher score: learner reads 1–2 short decodable sentences with support.',
  },
  {
    id: 'c-readaloud-2', gate: 'C', stage: 'reading', section: 'storyReadiness', kind: 'teacher-scale',
    title: 'Read aloud fluency',
    prompt: 'Teacher score: learner reads short sentences without heavy sounding-out on every word.',
  },
  // ── Comprehension ─────────────────────────────────────────────────────────
  {
    id: 'c-comp-1', gate: 'C', stage: 'reading', section: 'comprehension', kind: 'picture-choice', title: 'Comprehension',
    prompt: 'Listen: "Sam had a red cap." Tap what Sam had.', speak: 'red cap', correct: 'cap',
    options: [
      { id: 'cap', emoji: '🧢', label: 'Cap' },
      { id: 'bag', emoji: '👜', label: 'Bag' },
      { id: 'cup', emoji: '🥤', label: 'Cup' },
      { id: 'pen', emoji: '🖊️', label: 'Pen' },
    ],
  },
  {
    id: 'c-comp-2', gate: 'C', stage: 'reading', section: 'comprehension', kind: 'picture-choice', title: 'Comprehension',
    prompt: 'Listen: "The frog sat on a log." Where did the frog sit?', speak: 'log', correct: 'log',
    options: [
      { id: 'log', emoji: '🪵', label: 'Log' },
      { id: 'rock', emoji: '🪨', label: 'Rock' },
      { id: 'bed', emoji: '🛏️', label: 'Bed' },
      { id: 'hat', emoji: '🎩', label: 'Hat' },
    ],
  },
];

const GATE_D_ITEMS = [
  // ── Sentence building (2 items) ───────────────────────────────────────────
  {
    id: 'd-sentence-1', gate: 'D', stage: 'grammar-vocab', section: 'sentenceReady', kind: 'word-choice', title: 'Sentence building',
    prompt: 'Pick the best sentence:',
    options: ['She is running.', 'She running is.', 'Running she is.', 'Is she running'],
    correct: 'She is running.',
  },
  {
    id: 'd-sentence-2', gate: 'D', stage: 'grammar-vocab', section: 'sentenceReady', kind: 'word-choice', title: 'Sentence building',
    prompt: 'Pick the best sentence:',
    options: ['The boy kicked the ball.', 'Kicked the ball boy.', 'Ball the kicked boy.', 'The kicked boy ball.'],
    correct: 'The boy kicked the ball.',
  },
  // ── Grammar cloze (2 items) ───────────────────────────────────────────────
  {
    id: 'd-grammar-1', gate: 'D', stage: 'grammar-vocab', section: 'grammarReady', kind: 'word-choice', title: 'Grammar cloze',
    prompt: 'He ___ to school yesterday.',
    options: ['go', 'goes', 'went', 'going'],
    correct: 'went',
  },
  {
    id: 'd-grammar-2', gate: 'D', stage: 'grammar-vocab', section: 'grammarReady', kind: 'word-choice', title: 'Grammar cloze',
    prompt: 'She ___ two cats at home.',
    options: ['has', 'have', 'having', 'had'],
    correct: 'has',
  },
  // ── Vocabulary in context (2 items) ───────────────────────────────────────
  {
    id: 'd-vocab-1', gate: 'D', stage: 'grammar-vocab', section: 'vocabularyReady', kind: 'word-choice', title: 'Vocabulary in context',
    prompt: 'The room was dark, so we turned on the ___.',
    options: ['light', 'spoon', 'shoe', 'rain'],
    correct: 'light',
  },
  {
    id: 'd-vocab-2', gate: 'D', stage: 'grammar-vocab', section: 'vocabularyReady', kind: 'word-choice', title: 'Vocabulary in context',
    prompt: 'I was thirsty, so I drank some ___.',
    options: ['water', 'bread', 'paper', 'stone'],
    correct: 'water',
  },
];

function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function _accuracy(results, section) {
  const rows = results.filter(r => r.section === section && typeof r.correct === 'boolean');
  if (!rows.length) return 0;
  return rows.filter(r => r.correct).length / rows.length;
}

function _teacherScore(results, section) {
  const rows = results.filter(r => r.section === section && typeof r.score === 'number');
  if (!rows.length) return 0;
  return rows.reduce((a, b) => a + b.score, 0) / rows.length;
}

function _phaseFromDecoding(results) {
  const decoding = results.filter(r => r.section === 'decoding');
  if (!decoding.length) return { phase: 1, startGroup: PLACEMENT_PHASES[0].fallbackGroup };

  const phaseAccuracy = new Map();
  for (const row of decoding) {
    const p = row.phase || 1;
    const bucket = phaseAccuracy.get(p) || { total: 0, correct: 0, groups: [] };
    bucket.total += 1;
    if (row.correct) bucket.correct += 1;
    if (row.group && !bucket.groups.includes(row.group)) bucket.groups.push(row.group);
    phaseAccuracy.set(p, bucket);
  }

  let phase = 1;
  for (let p = 1; p <= MAX_PLACEMENT_PHASE; p++) {
    const b = phaseAccuracy.get(p);
    if (!b) break;
    if ((b.correct / b.total) >= 0.6) phase = p;
    else break;
  }

  const fallback = PLACEMENT_PHASES[phase - 1]?.fallbackGroup ?? PLACEMENT_PHASES[0].fallbackGroup;
  const group = (phaseAccuracy.get(phase)?.groups || []).slice(-1)[0] || fallback;
  return { phase, startGroup: group };
}

/**
 * Build placement-exempt known-content stats for words below the learner's
 * demonstrated phonics phase. Pulls seed words from PLACEMENT_PHASES so the
 * mapping stays in lockstep with the Gate B item phases and curriculum.js.
 *
 * Stats are stored as placement-seeded (not genuine mastery) so dashboards
 * and adaptive review can distinguish them from real practice data.
 */
function _buildPreSeededStats(phase) {
  if (phase <= 1) return {};
  const now = new Date().toISOString();
  const stats = {};
  // Seed every phase strictly below the learner's demonstrated phase.
  for (const def of PLACEMENT_PHASES) {
    if (def.phase >= phase) break;
    for (const w of def.seedWords) {
      stats[w] = {
        attempts: 3,
        correct: 3,
        lastSeen: now,
        reviewInterval: 1,
        nextReviewDate: now,
        placementSeeded: true,
      };
    }
  }
  return stats;
}

function _recommendedPath(result) {
  const byBand = {
    'pre-reader': ['letter-sounds', 'first-sound', 'last-sound', 'middle-sound', 'hear', 'oral-blend', 'sight-words', 'stories'],
    'emerging-decoder': ['blend', 'classicBlend', 'sight-words', 'stories', 'hear'],
    'developing-reader': ['blend', 'stories', 'sight-words', 'sentence-forge'],
    'reader': ['sentence-forge', 'cloze-castle', 'word-vault', 'editing-quest'],
  };
  return byBand[result.readingBand] || byBand['pre-reader'];
}

// ── Stage scoring + parent-facing skill-gap report ────────────────────────

/**
 * Severity buckets. Strong = solid mastery; Developing = inconsistent but
 * present; Needs practice = some evidence but mostly inaccurate; Not yet =
 * essentially no evidence of the skill.
 */
function _severityFor(score) {
  if (score >= 0.8) return 'strong';
  if (score >= 0.6) return 'developing';
  if (score >= 0.4) return 'needs-practice';
  return 'not-yet';
}

const SEVERITY_LABEL = {
  strong:          '🟢 Strong',
  developing:      '🟡 Developing',
  'needs-practice':'🟠 Needs practice',
  'not-yet':       '🔴 Not yet',
};

/**
 * Aggregate per-stage scores from raw item results. Each stage carries a
 * `composite` (the single number used for the strength chip + severity)
 * plus the per-sub-skill breakdown so the parent report can drill in.
 *
 * Stages that the child never reached (because gating stopped earlier) are
 * marked with `coverage: 'not-tested'` so the report can render them as
 * "Not tested yet" rather than "Not yet" — these are different things.
 */
function _computeStageScores(results) {
  const has = (section) => results.some(r => r.section === section);

  const stage1Vocab     = _accuracy(results, 'vocab');
  const stage1Oral      = _teacherScore(results, 'oral');
  const stage1Composite = (has('vocab') || has('oral'))
    ? (stage1Vocab * 0.7 + stage1Oral * 0.3)
    : 0;

  const stage2 = _accuracy(results, 'knownVocab');

  const firstS  = _accuracy(results, 'firstSound');
  const lastS   = _accuracy(results, 'lastSound');
  const middleS = _accuracy(results, 'middleSound');
  const oralBl  = _accuracy(results, 'oralBlending');
  const paComposite = (firstS + lastS + middleS + oralBl) / 4;

  const letterSounds = _teacherScore(results, 'letterSounds');

  const decoding         = _accuracy(results, 'decoding');
  const sightWords       = _accuracy(results, 'sightWords');
  const connectedReading = _accuracy(results, 'connectedReading');
  const comprehension    = _accuracy(results, 'comprehension');
  const storyReadiness   = _teacherScore(results, 'storyReadiness');
  const readingComposite = has('decoding') || has('connectedReading')
    ? (decoding * 0.4 + sightWords * 0.2 + connectedReading * 0.2 + comprehension * 0.15 + storyReadiness * 0.05)
    : 0;

  const sentenceReady     = _accuracy(results, 'sentenceReady');
  const grammarReady      = _accuracy(results, 'grammarReady');
  const vocabularyReady   = _accuracy(results, 'vocabularyReady');
  const grammarVocabComposite = (has('sentenceReady') || has('grammarReady') || has('vocabularyReady'))
    ? (sentenceReady + grammarReady + vocabularyReady) / 3
    : 0;

  return {
    pictureId: {
      composite: Number(stage1Composite.toFixed(2)),
      coverage:  (has('vocab') || has('oral')) ? 'tested' : 'not-tested',
      pictureChoice: Number(stage1Vocab.toFixed(2)),
      oralResponse:  Number(stage1Oral.toFixed(2)),
    },
    knownVocab: {
      composite: Number(stage2.toFixed(2)),
      coverage:  has('knownVocab') ? 'tested' : 'not-tested',
    },
    phonemicAwareness: {
      composite:    Number(paComposite.toFixed(2)),
      coverage:     (has('firstSound') || has('lastSound') || has('middleSound') || has('oralBlending')) ? 'tested' : 'not-tested',
      firstSound:   Number(firstS.toFixed(2)),
      lastSound:    Number(lastS.toFixed(2)),
      middleSound:  Number(middleS.toFixed(2)),
      oralBlending: Number(oralBl.toFixed(2)),
    },
    letterSounds: {
      composite: Number(letterSounds.toFixed(2)),
      coverage:  has('letterSounds') ? 'tested' : 'not-tested',
    },
    blending: {
      // Stage 5 currently shares items with oralBlending — they're the same
      // probe expressed two ways. Surface it as its own stage so the report
      // can recommend the Blend It! mode independently of the PA group.
      composite: Number(oralBl.toFixed(2)),
      coverage:  has('oralBlending') ? 'tested' : 'not-tested',
    },
    reading: {
      composite:        Number(readingComposite.toFixed(2)),
      coverage:         (has('decoding') || has('connectedReading')) ? 'tested' : 'not-tested',
      decoding:         Number(decoding.toFixed(2)),
      sightWords:       Number(sightWords.toFixed(2)),
      sentenceReading:  Number(connectedReading.toFixed(2)),
      comprehension:    Number(comprehension.toFixed(2)),
      readAloud:        Number(storyReadiness.toFixed(2)),
    },
    grammarVocab: {
      composite:       Number(grammarVocabComposite.toFixed(2)),
      coverage:        (has('sentenceReady') || has('grammarReady') || has('vocabularyReady')) ? 'tested' : 'not-tested',
      sentenceReady:   Number(sentenceReady.toFixed(2)),
      grammarReady:    Number(grammarReady.toFixed(2)),
      vocabularyReady: Number(vocabularyReady.toFixed(2)),
    },
  };
}

/**
 * Parent-facing gap dictionary. Keyed by (stage, skill). Each entry has:
 *   - summary: a one-sentence plain-language description of the gap
 *   - modes:   PhonicsQuest mode IDs (matching `mode-card` data-mode in
 *              the home screen) that target this skill
 *
 * Severity-aware copy is wrapped at render-time ("Your child is still
 * developing X" vs "Your child has not yet shown X").
 */
const GAP_COPY = {
  'pictureId:pictureChoice': {
    summary: 'matching a spoken word to its picture from a small set of choices',
    modes: ['hear', 'first-sound'],
  },
  'pictureId:oralResponse': {
    summary: 'responding to simple spoken instructions',
    modes: ['hear'],
  },
  'knownVocab:knownVocab': {
    summary: 'recognising slightly trickier vocabulary words (actions, attributes, helpers)',
    modes: ['hear', 'word-vault'],
  },
  'phonemicAwareness:firstSound': {
    summary: 'hearing the FIRST sound in a short word',
    modes: ['first-sound'],
  },
  'phonemicAwareness:lastSound': {
    summary: 'hearing the LAST sound in a short word',
    modes: ['last-sound'],
  },
  'phonemicAwareness:middleSound': {
    summary: 'hearing the MIDDLE (vowel) sound in a short word',
    modes: ['middle-sound', 'sound-count'],
  },
  'phonemicAwareness:oralBlending': {
    summary: 'blending separated phonemes (/c/ /a/ /t/) into the whole word',
    modes: ['oral-blend', 'blend'],
  },
  'letterSounds:letterSounds': {
    summary: 'connecting letters to the sounds they make',
    modes: ['letter-sounds', 'first-sound'],
  },
  'blending:blending': {
    summary: 'sounding out a short word letter-by-letter then saying the whole word',
    modes: ['blend', 'classicBlend'],
  },
  'reading:decoding': {
    summary: 'reading short decodable words like cat, bed, ship',
    modes: ['blend', 'classicBlend'],
  },
  'reading:sightWords': {
    summary: 'recognising common sight words (the, said, was) on sight',
    modes: ['sight-words'],
  },
  'reading:sentenceReading': {
    summary: 'reading a short decodable sentence and matching it to a picture',
    modes: ['stories'],
  },
  'reading:comprehension': {
    summary: 'remembering what a short read-aloud sentence said',
    modes: ['stories'],
  },
  'reading:readAloud': {
    summary: 'reading short decodable sentences aloud with light support',
    modes: ['stories'],
  },
  'grammarVocab:sentenceReady': {
    summary: 'putting words in the right order to make a sentence',
    modes: ['sentence-forge'],
  },
  'grammarVocab:grammarReady': {
    summary: 'choosing the right grammar (tense, articles, agreement) in context',
    modes: ['cloze-castle', 'editing-quest'],
  },
  'grammarVocab:vocabularyReady': {
    summary: 'choosing the right word for the meaning when reading',
    modes: ['word-vault'],
  },
};

const SEVERITY_PREFIX = {
  developing:       'is still developing',
  'needs-practice': 'needs more practice with',
  'not-yet':        'has not yet shown',
};

/**
 * Walk the stage scores and emit one gap entry per non-strong sub-skill.
 * "not-tested" sub-skills are skipped — we don't fabricate a gap for a
 * skill we never probed.
 */
function _computeSkillGaps(stageScores) {
  const gaps = [];
  const consider = (stageKey, skillKey, score, coverage) => {
    if (coverage === 'not-tested') return;
    const severity = _severityFor(score);
    if (severity === 'strong') return;
    const copy = GAP_COPY[`${stageKey}:${skillKey}`];
    if (!copy) return;
    gaps.push({
      stage: stageKey,
      skill: skillKey,
      severity,
      summary: `Your child ${SEVERITY_PREFIX[severity]} ${copy.summary}.`,
      recommendedModes: copy.modes,
    });
  };

  // Stage 1
  consider('pictureId', 'pictureChoice', stageScores.pictureId.pictureChoice, stageScores.pictureId.coverage);
  consider('pictureId', 'oralResponse',  stageScores.pictureId.oralResponse,  stageScores.pictureId.coverage);
  // Stage 2
  consider('knownVocab', 'knownVocab', stageScores.knownVocab.composite, stageScores.knownVocab.coverage);
  // Stage 3
  consider('phonemicAwareness', 'firstSound',   stageScores.phonemicAwareness.firstSound,   stageScores.phonemicAwareness.coverage);
  consider('phonemicAwareness', 'lastSound',    stageScores.phonemicAwareness.lastSound,    stageScores.phonemicAwareness.coverage);
  consider('phonemicAwareness', 'middleSound',  stageScores.phonemicAwareness.middleSound,  stageScores.phonemicAwareness.coverage);
  consider('phonemicAwareness', 'oralBlending', stageScores.phonemicAwareness.oralBlending, stageScores.phonemicAwareness.coverage);
  // Stage 4
  consider('letterSounds', 'letterSounds', stageScores.letterSounds.composite, stageScores.letterSounds.coverage);
  // Stage 5
  consider('blending', 'blending', stageScores.blending.composite, stageScores.blending.coverage);
  // Stage 6
  consider('reading', 'decoding',        stageScores.reading.decoding,        stageScores.reading.coverage);
  consider('reading', 'sightWords',      stageScores.reading.sightWords,      stageScores.reading.coverage);
  consider('reading', 'sentenceReading', stageScores.reading.sentenceReading, stageScores.reading.coverage);
  consider('reading', 'comprehension',   stageScores.reading.comprehension,   stageScores.reading.coverage);
  consider('reading', 'readAloud',       stageScores.reading.readAloud,       stageScores.reading.coverage);
  // Stage 7
  consider('grammarVocab', 'sentenceReady',   stageScores.grammarVocab.sentenceReady,   stageScores.grammarVocab.coverage);
  consider('grammarVocab', 'grammarReady',    stageScores.grammarVocab.grammarReady,    stageScores.grammarVocab.coverage);
  consider('grammarVocab', 'vocabularyReady', stageScores.grammarVocab.vocabularyReady, stageScores.grammarVocab.coverage);

  return gaps;
}

/** Plain-language description of the reading band, written for parents. */
const BAND_DESCRIPTION = {
  'pre-reader':         'Your child is at the very beginning of reading. They are still building oral language, phonemic awareness, and letter-sound knowledge — the foundations they need before reading whole words.',
  'emerging-decoder':   'Your child knows many letter sounds and is starting to blend them into short words. They are not yet reading sentences on their own.',
  'developing-reader':  'Your child can decode short words and is starting to read simple sentences. They are building fluency and confidence.',
  'reader':             'Your child reads short passages independently and is ready to grow vocabulary, grammar, and comprehension at sentence and paragraph level.',
};

export { _computeStageScores, _computeSkillGaps, _severityFor, GAP_COPY, BAND_DESCRIPTION, SEVERITY_LABEL };

export function derivePlacementResult(results, intake = {}, schoolLevel = 'preschool') {
  const oral = _teacherScore(results, 'oral');
  const first = _accuracy(results, 'firstSound');
  const last = _accuracy(results, 'lastSound');
  const middle = _accuracy(results, 'middleSound');
  const letterSounds = _teacherScore(results, 'letterSounds');
  const oralBlending = _accuracy(results, 'oralBlending');
  const vocab = _accuracy(results, 'vocab');
  const decoding = _accuracy(results, 'decoding');
  const sightWords = _accuracy(results, 'sightWords');
  const connectedReading = _accuracy(results, 'connectedReading');
  const comprehension = _accuracy(results, 'comprehension');
  const readAloud = _teacherScore(results, 'storyReadiness');
  const sentenceReadyScore = _accuracy(results, 'sentenceReady');
  const grammarReadyScore = _accuracy(results, 'grammarReady');
  const vocabularyReadyScore = _accuracy(results, 'vocabularyReady');

  // Separate child-response scores from teacher-observed scores in Gate A.
  // Child-response items (direct evidence) are weighted more heavily (70/30).
  const gateAChildScore = (first + last + middle + oralBlending + vocab) / 5;
  const gateATeacherScore = (letterSounds + oral) / 2;
  const gateAComposite = gateAChildScore * 0.7 + gateATeacherScore * 0.3;
  const gateASecure = gateAComposite >= 0.6;
  const gateBSecure = decoding >= 0.6;
  // Gate C: separate child-response (connected reading + comprehension) from teacher observation (read aloud).
  const gateCChildScore = (connectedReading + comprehension) / 2;
  const gateCTeacherScore = readAloud;
  const gateCComposite = gateCChildScore * 0.7 + gateCTeacherScore * 0.3;
  const gateCSecure = gateCComposite >= 0.6;

  let readingBand = 'pre-reader';
  if (gateASecure) readingBand = 'emerging-decoder';
  if (gateASecure && gateBSecure) readingBand = 'developing-reader';
  if (gateASecure && gateBSecure && gateCSecure && (sentenceReadyScore + grammarReadyScore + vocabularyReadyScore) / 3 >= 0.6) {
    readingBand = 'reader';
  }

  const { phase: phonicsPhase, startGroup } = _phaseFromDecoding(results);

  const storyReadiness = !gateBSecure
    ? 'not-ready'
    : gateCSecure
      ? 'paragraph'
      : 'sentence';

  const sightWordBand = sightWords >= 0.8
    ? 'strong'
    : sightWords >= 0.55
      ? 'developing'
      : sightWords > 0
        ? 'early'
        : 'none';

  const sentenceReady = readingBand === 'reader' || sentenceReadyScore >= 0.6;
  const grammarReady = readingBand === 'reader' || (gateCSecure && grammarReadyScore >= 0.6);
  const vocabularyReady = readingBand === 'reader' || vocabularyReadyScore >= 0.6;

  const result = {
    readingBand,
    phonicsPhase,
    phase: phonicsPhase,
    startGroup,
    preSeededStats: _buildPreSeededStats(phonicsPhase),
    soundAwarenessProfile: {
      firstSound: first,
      lastSound: last,
      middleSound: middle,
      oralBlending,
      letterSounds,
    },
    oralLanguageProfile: {
      basicResponse: oral,
      receptiveVocabulary: vocab,
    },
    sightWordBand,
    storyReadiness,
    sentenceReady,
    grammarReady,
    vocabularyReady,
    intake: {
      age: intake.age || '',
      schoolLevel: intake.schoolLevel || schoolLevel || 'preschool',
      homeLanguage: intake.homeLanguage || '',
      canWriteName: intake.canWriteName || 'unknown',
      letterRecognition: intake.letterRecognition || 'unknown',
      simpleWordReading: intake.simpleWordReading || 'unknown',
      notes: intake.notes || '',
    },
    gateScores: {
      gateA: Number(gateAComposite.toFixed(2)),
      gateAChildScore: Number(gateAChildScore.toFixed(2)),
      gateATeacherScore: Number(gateATeacherScore.toFixed(2)),
      gateB: Number(decoding.toFixed(2)),
      gateC: Number(gateCComposite.toFixed(2)),
      gateD: Number((((sentenceReadyScore + grammarReadyScore + vocabularyReadyScore) / 3)).toFixed(2)),
    },
  };

  // Per-stage scores + skill-gap list power the new parent-facing report.
  // Legacy fields above are untouched so routing keeps working.
  result.stageScores      = _computeStageScores(results);
  result.skillGaps        = _computeSkillGaps(result.stageScores);
  result.bandDescription  = BAND_DESCRIPTION[readingBand] || BAND_DESCRIPTION['pre-reader'];

  result.recommendedHomePath = _recommendedPath(result);
  return result;
}

// ── Parent-facing report renderers ────────────────────────────────────────

const BAND_LABEL = {
  'pre-reader':        'Pre-reader',
  'emerging-decoder':  'Emerging decoder',
  'developing-reader': 'Developing reader',
  'reader':            'Reader',
};

function _pct(score) { return Math.round(score * 100) + '%'; }
function _escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Build the in-app result HTML. Three sections:
 *   1. Header   — band + plain-language description
 *   2. Profile  — 7-row table, one row per stage, with strength chip
 *   3. Callouts — "What's missing — and what helps" cards per skill gap
 * Plus a footer with "Start learning" CTA and "Print report" link.
 *
 * Exported for tests so the report card can be rendered in isolation.
 */
export function renderPlacementReportHtml(result) {
  const band  = BAND_LABEL[result.readingBand] || 'Pathway';
  const desc  = result.bandDescription || BAND_DESCRIPTION[result.readingBand] || '';
  const stageScores = result.stageScores || {};
  const skillGaps   = Array.isArray(result.skillGaps) ? result.skillGaps : [];

  const profileRowsHtml = STAGES.map((stage, idx) => {
    const ss = _stageCompositeFor(stageScores, stage.id);
    const sev = (ss.coverage === 'not-tested') ? 'not-tested' : _severityFor(ss.composite);
    const chip = sev === 'not-tested' ? '⚪ Not tested yet' : SEVERITY_LABEL[sev];
    const pct  = ss.coverage === 'not-tested' ? '—' : _pct(ss.composite);
    return `
      <li class="pt-profile-row pt-profile-row--${sev}" data-stage="${stage.id}">
        <span class="pt-profile-row__idx">${idx + 1}</span>
        <span class="pt-profile-row__icon" aria-hidden="true">${stage.icon}</span>
        <span class="pt-profile-row__label">
          <strong>${_escapeHtml(stage.label)}</strong>
          <small>${_escapeHtml(stage.summary)}</small>
        </span>
        <span class="pt-profile-row__chip" aria-label="Strength: ${chip}">${chip}</span>
        <span class="pt-profile-row__score">${pct}</span>
      </li>
    `;
  }).join('');

  const gapCardsHtml = skillGaps.length === 0
    ? `<div class="pt-gap-empty">🎉 No major gaps — your child is well-placed!</div>`
    : skillGaps.map(gap => {
        const stage = STAGES.find(s => _camelStageKey(s.id) === gap.stage);
        const stageLabel = stage ? `${stage.icon} ${stage.label}` : gap.stage;
        const modesHtml = gap.recommendedModes.map(m =>
          `<button class="pt-gap-mode-chip" type="button" data-mode="${_escapeHtml(m)}">${_escapeHtml(m)}</button>`
        ).join('');
        return `
          <article class="pt-gap-card pt-gap-card--${gap.severity}">
            <header class="pt-gap-card__head">
              <span class="pt-gap-card__stage">${stageLabel}</span>
              <span class="pt-gap-card__sev">${SEVERITY_LABEL[gap.severity]}</span>
            </header>
            <p class="pt-gap-card__summary">${_escapeHtml(gap.summary)}</p>
            <div class="pt-gap-card__modes">
              <span class="pt-gap-card__modes-label">What helps:</span>
              ${modesHtml}
            </div>
          </article>
        `;
      }).join('');

  return `
    <div class="pt-result">
      <div class="pt-result-icon">🎯</div>
      <h2 class="pt-result-title">Placement complete</h2>
      <p class="pt-result-band"><strong>${_escapeHtml(band)}</strong></p>
      <p class="pt-result-desc">${_escapeHtml(desc)}</p>

      <section class="pt-profile" aria-label="Skill profile">
        <h3 class="pt-section-title">Skill profile</h3>
        <ol class="pt-profile-list" role="list">${profileRowsHtml}</ol>
      </section>

      <section class="pt-gaps" aria-label="Skill gaps and recommendations">
        <h3 class="pt-section-title">What's missing — and what helps</h3>
        <div class="pt-gap-list">${gapCardsHtml}</div>
      </section>

      <div class="pt-result-actions">
        <button class="btn btn--ghost btn--sm" id="pt-print-btn" type="button">🖨️ Print report</button>
        <button class="btn btn--primary btn--xl pt-start-btn" id="pt-start-btn" type="button">Start learning →</button>
      </div>
    </div>
  `;
}

/** Map stage id ("phonemic-awareness") → stageScores key ("phonemicAwareness"). */
function _camelStageKey(stageId) {
  return stageId.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function _stageCompositeFor(stageScores, stageId) {
  const key = _camelStageKey(stageId);
  const s = stageScores[key];
  if (!s) return { composite: 0, coverage: 'not-tested' };
  return {
    composite: typeof s.composite === 'number' ? s.composite : 0,
    coverage:  s.coverage || 'not-tested',
  };
}

/**
 * Open a printable single-page report in a new tab. The browser's native
 * print dialog handles the PDF export — no library needed.
 *
 * Exported for tests; in real use only `finish()` calls it.
 */
export function openPrintableReport(result) {
  if (typeof window === 'undefined') return;
  const w = window.open('', '_blank', 'noopener');
  if (!w) return;
  const band = BAND_LABEL[result.readingBand] || 'Pathway';
  const desc = result.bandDescription || BAND_DESCRIPTION[result.readingBand] || '';
  const stageRows = STAGES.map((stage, idx) => {
    const ss = _stageCompositeFor(result.stageScores || {}, stage.id);
    const sev = ss.coverage === 'not-tested' ? 'not-tested' : _severityFor(ss.composite);
    const chip = sev === 'not-tested' ? 'Not tested yet' : SEVERITY_LABEL[sev].replace(/^[^\s]+\s/, '');
    const pct  = ss.coverage === 'not-tested' ? '—' : _pct(ss.composite);
    return `
      <tr>
        <td>${idx + 1}. ${stage.icon} ${_escapeHtml(stage.label)}</td>
        <td>${_escapeHtml(stage.summary)}</td>
        <td><strong>${chip}</strong></td>
        <td>${pct}</td>
      </tr>`;
  }).join('');

  const skillGaps = Array.isArray(result.skillGaps) ? result.skillGaps : [];
  const gapsHtml = skillGaps.length === 0
    ? `<p>No major gaps — your child is well-placed.</p>`
    : skillGaps.map(g => {
        const stage = STAGES.find(s => _camelStageKey(s.id) === g.stage);
        const stageLabel = stage ? `${stage.icon} ${stage.label}` : g.stage;
        return `
          <li>
            <strong>${stageLabel} · ${SEVERITY_LABEL[g.severity].replace(/^[^\s]+\s/, '')}</strong><br>
            ${_escapeHtml(g.summary)}<br>
            <em>What helps:</em> ${g.recommendedModes.map(_escapeHtml).join(', ')}
          </li>
        `;
      }).join('');

  const intake = result.intake || {};
  const dateStr = new Date().toLocaleDateString();

  const docHtml = `<!doctype html>
<html><head><meta charset="utf-8">
<title>PhonicsQuest — Placement Report</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 720px; margin: 32px auto; padding: 0 24px; color: #111; }
  h1 { margin: 0 0 4px; font-size: 24px; }
  .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
  h2 { font-size: 16px; margin-top: 24px; border-bottom: 2px solid #ddd; padding-bottom: 4px; }
  .band { font-size: 18px; font-weight: 700; color: #4338ca; }
  .desc { line-height: 1.5; margin: 8px 0 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #eee; vertical-align: top; }
  th { background: #f4f4f5; }
  ul { line-height: 1.5; }
  ul li { margin-bottom: 12px; }
  @media print { body { margin: 8px; } }
</style>
</head><body>
  <h1>PhonicsQuest — Placement Report</h1>
  <div class="meta">
    Printed ${_escapeHtml(dateStr)}
    ${intake.age ? ` · age ${_escapeHtml(intake.age)}` : ''}
    ${intake.schoolLevel ? ` · ${_escapeHtml(intake.schoolLevel)}` : ''}
    ${intake.homeLanguage ? ` · home language: ${_escapeHtml(intake.homeLanguage)}` : ''}
  </div>

  <h2>Reading band</h2>
  <p class="band">${_escapeHtml(band)}</p>
  <p class="desc">${_escapeHtml(desc)}</p>

  <h2>Skill profile</h2>
  <table>
    <thead><tr><th>Stage</th><th>What it tests</th><th>Strength</th><th>Score</th></tr></thead>
    <tbody>${stageRows}</tbody>
  </table>

  <h2>What's missing — and what helps</h2>
  <ul>${gapsHtml}</ul>

  <h2>Decoding placement</h2>
  <p>Phase: <strong>${_escapeHtml(PLACEMENT_PHASES.find(p => p.phase === result.phonicsPhase)?.label || '—')}</strong><br>
     Starting group: <strong>${_escapeHtml(result.startGroup || '—')}</strong></p>
</body></html>`;
  w.document.open();
  w.document.write(docHtml);
  w.document.close();
  // Give the browser a tick to lay out, then open the print dialog.
  setTimeout(() => { try { w.print(); } catch {} }, 200);
}

/**
 * Default result used when the placement test is skipped.
 * Always defaults to 'pre-reader' — the safest conservative assumption.
 * A brief screener that controls the entire product pathway should not
 * assume a higher band without evidence.
 */
function _defaultResult(profile) {
  const intake = {
    age: '',
    schoolLevel: profile?.schoolLevel || 'preschool',
    homeLanguage: '',
    canWriteName: 'unknown',
    letterRecognition: 'unknown',
    simpleWordReading: 'unknown',
    notes: '',
  };
  const readingBand = 'pre-reader';
  const base = {
    readingBand,
    phonicsPhase: 1,
    phase: 1,
    startGroup: 'cvc-a',
    preSeededStats: {},
    soundAwarenessProfile: { firstSound: 0, lastSound: 0, middleSound: 0, oralBlending: 0, letterSounds: 0 },
    oralLanguageProfile: { basicResponse: 0, receptiveVocabulary: 0 },
    sightWordBand: 'none',
    storyReadiness: 'not-ready',
    sentenceReady: false,
    grammarReady: false,
    vocabularyReady: false,
    intake,
    gateScores: { gateA: 0, gateB: 0, gateC: 0, gateD: 0 },
  };
  base.recommendedHomePath = _recommendedPath(base);
  return base;
}

export function getNextGateToAppend(baseResult, existingSequence = []) {
  const gates = new Set(existingSequence.map(i => i.gate));
  const gateA = baseResult?.gateScores?.gateA ?? 0;
  const gateB = baseResult?.gateScores?.gateB ?? 0;
  const gateC = baseResult?.gateScores?.gateC ?? 0;

  if (!gates.has('B') && gateA >= 0.55) return 'B';
  if (!gates.has('C') && gateA >= 0.55 && gateB >= 0.55) return 'C';
  if (!gates.has('D') && gateA >= 0.55 && gateB >= 0.55 && gateC >= 0.6) return 'D';
  return null;
}

/**
 * Render the placement test into `container`.
 */
export function showPlacementTest({ container, profile, onComplete }) {
  if (!container) return;

  const intake = {
    schoolLevel: profile?.schoolLevel || 'preschool',
  };
  const responses = [];
  let sequence = [{ gate: 'INTAKE', kind: 'intake', id: 'intake' }, ...GATE_A_ITEMS];
  let index = 0;

  function progressLabel() {
    const current = Math.min(index + 1, sequence.length);
    return `${current} / ${sequence.length}`;
  }

  function renderFrame(content, title = 'Literacy Placement Screener') {
    const pct = sequence.length ? Math.round((index / sequence.length) * 100) : 0;
    container.innerHTML = `
      <div class="pt-wrapper" role="main" aria-label="Literacy placement screener">
        <div class="pt-header">
          <div class="pt-title-row">
            <span class="pt-title-icon" aria-hidden="true">🧭</span>
            <div>
              <h1 class="pt-title">${title}</h1>
              <p class="pt-subtitle">Oral language, then phonics, then reading, then language skills.</p>
            </div>
            <button class="btn btn--ghost btn--sm pt-skip-btn" id="pt-skip">Skip</button>
          </div>
          <div class="pt-progress-bar-wrap"><div class="pt-progress-bar" style="width:${pct}%"></div></div>
          <span class="pt-progress-label">${progressLabel()}</span>
        </div>
        <div class="pt-body" id="pt-body">${content}</div>
      </div>`;

    container.querySelector('#pt-skip')?.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'pt-skip-confirm';
      overlay.innerHTML = `
        <div class="pt-skip-confirm__card">
          <h3>Skip placement?</h3>
          <p>Skipping will place the learner on the pre-reader pathway. The screener helps find the best starting point — are you sure?</p>
          <div class="pt-skip-confirm__actions">
            <button class="btn btn--ghost btn--sm" id="pt-skip-cancel">Go back</button>
            <button class="btn btn--primary btn--sm" id="pt-skip-confirm">Skip anyway</button>
          </div>
        </div>`;
      container.appendChild(overlay);
      overlay.querySelector('#pt-skip-cancel')?.addEventListener('click', () => overlay.remove());
      overlay.querySelector('#pt-skip-confirm')?.addEventListener('click', () => {
        overlay.remove();
        onComplete(_defaultResult(profile));
      });
    });
  }

  function next() {
    index += 1;
    if (index >= sequence.length) return finish();
    renderCurrent();
  }

  function answer(item, payload) {
    responses.push({ id: item.id, gate: item.gate, section: item.section, ...payload });
    next();
  }

  function bindChoice(item, correctId) {
    container.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const picked = btn.getAttribute('data-choice');
        const correct = picked === correctId;
        btn.classList.add(correct ? 'pt-choice--correct' : 'pt-choice--wrong');
        setTimeout(() => answer(item, { correct, selected: picked, phase: item.phase, group: item.group }), 220);
      });
    });

    container.querySelector('#pt-listen')?.addEventListener('click', () => {
      if (item.speak) audio.speakWord(item.speak);
    });

    if (item.speak) setTimeout(() => audio.speakWord(item.speak), 200);
  }

  function renderIntake() {
    renderFrame(`
      <div class="pt-item">
        <div class="pt-phase-tag">Section 1 · Intake</div>
        <p class="pt-question">Quick adult intake (not heavily scored)</p>
        <div class="pt-intake-grid">
          <label>Age <input id="pt-age" type="number" min="2" max="14" value="${intake.age || ''}"/></label>
          <label>School level
            <select id="pt-school-level">
              <option value="preschool" ${intake.schoolLevel === 'preschool' ? 'selected' : ''}>Preschool</option>
              <option value="primary" ${intake.schoolLevel === 'primary' ? 'selected' : ''}>Primary</option>
            </select>
          </label>
          <label>Home language <input id="pt-home-lang" type="text" value="${intake.homeLanguage || ''}" placeholder="e.g. English / Malay"/></label>
          <label>Can write name?
            <select id="pt-write-name">
              <option value="unknown">Not sure</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          <label>Recognises letters?
            <select id="pt-letter-rec">
              <option value="unknown">Not sure</option>
              <option value="yes">Yes</option>
              <option value="some">Some letters</option>
              <option value="no">No</option>
            </select>
          </label>
          <label>Reads simple words?
            <select id="pt-simple-words">
              <option value="unknown">Not sure</option>
              <option value="yes">Yes</option>
              <option value="some">Some words</option>
              <option value="no">No</option>
            </select>
          </label>
          <label class="pt-intake-wide">Notes/concerns
            <textarea id="pt-notes" rows="2" placeholder="Optional"></textarea>
          </label>
        </div>
        <button class="btn btn--primary btn--xl" id="pt-intake-next">Start Gate A →</button>
      </div>
    `);

    container.querySelector('#pt-intake-next')?.addEventListener('click', () => {
      intake.age = container.querySelector('#pt-age')?.value || '';
      intake.schoolLevel = container.querySelector('#pt-school-level')?.value || intake.schoolLevel;
      intake.homeLanguage = container.querySelector('#pt-home-lang')?.value?.trim() || '';
      intake.canWriteName = container.querySelector('#pt-write-name')?.value || 'unknown';
      intake.letterRecognition = container.querySelector('#pt-letter-rec')?.value || 'unknown';
      intake.simpleWordReading = container.querySelector('#pt-simple-words')?.value || 'unknown';
      intake.notes = container.querySelector('#pt-notes')?.value?.trim() || '';
      next();
    });
  }

  function renderTeacherScale(item) {
    renderFrame(`
      <div class="pt-item">
        <div class="pt-phase-tag">Gate ${item.gate} · ${item.title}</div>
        <span class="pt-teacher-badge">Adult observation</span>
        <p class="pt-question">${item.prompt}</p>
        <p class="pt-grammar-hint">This item is scored by the teacher or parent, not the child directly.</p>
        <div class="pt-choices" role="group" aria-label="Teacher scoring options">
          <button class="pt-choice-btn" data-score="0">Not yet</button>
          <button class="pt-choice-btn" data-score="0.5">With support</button>
          <button class="pt-choice-btn" data-score="1">Independent</button>
        </div>
      </div>
    `);
    container.querySelectorAll('[data-score]').forEach(btn => {
      btn.addEventListener('click', () => answer(item, { score: Number(btn.getAttribute('data-score')) }));
    });
  }

  function renderPictureChoice(item) {
    const opts = _shuffle(item.options);
    const hideText = item.gate === 'A';
    renderFrame(`
      <div class="pt-item">
        <div class="pt-phase-tag">Gate ${item.gate} · ${item.title}</div>
        <button class="pt-listen-btn" id="pt-listen">🔊 Hear prompt</button>
        <p class="pt-question">${item.prompt}</p>
        <div class="pt-choices" role="group" aria-label="Picture choices">
          ${opts.map(o => `
            <button class="pt-choice-btn" data-choice="${o.id}" aria-label="${o.label}">
              <span>${o.emoji || ''}</span>
              <small class="${hideText ? 'visually-hidden' : ''}">${o.label}</small>
            </button>
          `).join('')}
        </div>
      </div>
    `);
    bindChoice(item, item.correct);
  }

  function renderWordChoice(item) {
    const opts = _shuffle(item.options);
    renderFrame(`
      <div class="pt-item">
        <div class="pt-phase-tag">Gate ${item.gate} · ${item.title}</div>
        ${item.speak ? '<button class="pt-listen-btn" id="pt-listen">🔊 Hear prompt</button>' : ''}
        <p class="pt-question">${item.prompt}</p>
        ${item.sentence ? `<p class="pt-question pt-question--grammar">${item.sentence}</p>` : ''}
        <div class="pt-choices" role="group">
          ${opts.map(o => {
            const value = typeof o === 'string' ? o : o.id;
            const label = typeof o === 'string' ? o : `${o.emoji || ''} ${o.label}`;
            return `<button class="pt-choice-btn" data-choice="${value}">${label}</button>`;
          }).join('')}
        </div>
      </div>
    `);
    bindChoice(item, item.correct);
  }

  function renderCurrent() {
    const item = sequence[index];
    if (!item) return finish();
    if (item.kind === 'intake') return renderIntake();
    if (item.kind === 'teacher-scale') return renderTeacherScale(item);
    if (item.kind === 'picture-choice') return renderPictureChoice(item);
    return renderWordChoice(item);
  }

  function finish() {
    const baseResult = derivePlacementResult(responses, intake, profile?.schoolLevel);
    const nextGate = getNextGateToAppend(baseResult, sequence);
    if (nextGate === 'B') {
      sequence = [...sequence, ...GATE_B_ITEMS];
      return renderCurrent();
    }
    if (nextGate === 'C') {
      sequence = [...sequence, ...GATE_C_ITEMS];
      return renderCurrent();
    }
    if (nextGate === 'D') {
      sequence = [...sequence, ...GATE_D_ITEMS];
      return renderCurrent();
    }

    const result = derivePlacementResult(responses, intake, profile?.schoolLevel);
    const html = renderPlacementReportHtml(result);
    renderFrame(html, 'Placement Result');

    container.querySelector('#pt-start-btn')?.addEventListener('click', () => onComplete(result));
    container.querySelector('#pt-print-btn')?.addEventListener('click', () => openPrintableReport(result));
  }

  renderCurrent();
}
