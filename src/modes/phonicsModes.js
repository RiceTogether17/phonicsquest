/**
 * Canonical phonics-mode registry.
 *
 * The seven educational game modes children play in PhonicsQuest:
 *
 *   1. Sound Match          – hear a sound, choose the matching grapheme
 *   2. Picture First Sound  – see a picture, choose its beginning sound
 *   3. Blend Builder        – tap or drag sounds to build a target word
 *   4. Word Sort            – sort words by vowel or sound pattern
 *   5. Read and Tap         – read a decodable sentence, tap the target word
 *   6. Listen and Spell     – hear a word, build it letter by letter
 *   7. Fluency Sprint       – read a list of familiar words quickly
 *
 * Each entry carries the educational metadata the UI and reporting layers
 * need so we don't sprinkle copy across files:
 *   - `instruction`     short, child-friendly (≤15 words)
 *   - `objective`       one clear learning objective for the parent dashboard
 *   - `keyboard` /`touch` – supported input modalities
 *   - `errorHints`      map of error category -> remediation hint
 *   - `score`           pure scoring function: (attempt) -> result
 *   - `masteryCriteria` mastery accuracy + attempt threshold
 *   - `impl`            mode key in `MODES` (when this educational mode is
 *                       backed by an existing UI implementation)
 *
 * The scoring functions are pure — give them an attempt object, get back a
 * result object. UI code calls them and renders the feedback; reporting
 * code calls them and rolls them into mastery stats.
 *
 * FOLLOW-UP: `wordSort`, `readAndTap`, and `fluencySprint` have no `impl`
 * (no playable UI) and are not reachable from any menu — they exist only
 * as scoring/hint engines consumed by the Quest Journey slice and tests.
 * `listenAndSpell` maps to `classicBlend` as the closest existing UI.
 * Building dedicated UIs for these three is tracked as future work; do
 * not list them in user-facing menus until an `impl` exists.
 */

import { scoreSoundMatch, getSoundMatchHint } from './scoring/soundMatch.js';
import { scorePictureFirstSound, getPictureFirstSoundHint } from './scoring/pictureFirstSound.js';
import { scoreBlendBuilder, getBlendBuilderHint } from './scoring/blendBuilder.js';
import { scoreWordSort, getWordSortHint } from './scoring/wordSort.js';
import { scoreReadAndTap, getReadAndTapHint } from './scoring/readAndTap.js';
import { scoreListenAndSpell, getListenAndSpellHint } from './scoring/listenAndSpell.js';
import { scoreFluencySprint, getFluencySprintHint } from './scoring/fluencySprint.js';

const DEFAULT_MASTERY = Object.freeze({ accuracy: 0.80, minAttempts: 6 });

/**
 * Required educational-metadata fields. Asserted in
 * `__tests__/phonicsModes.test.js`.
 */
export const REQUIRED_MODE_FIELDS = Object.freeze([
  'key',
  'name',
  'instruction',
  'objective',
  'keyboard',
  'touch',
  'errorHints',
  'masteryCriteria',
  'score',
]);

/**
 * @typedef PhonicsMode
 * @property {string}   key            – stable identifier
 * @property {string}   name           – child-facing name
 * @property {string}   instruction    – ≤15 words, child-facing
 * @property {string}   objective      – parent-facing learning objective
 * @property {boolean}  keyboard       – supports keyboard input
 * @property {boolean}  touch          – supports touch / mouse input
 * @property {Object<string,string>} errorHints – error-category → hint copy
 * @property {{accuracy:number,minAttempts:number}} masteryCriteria
 * @property {(attempt: object) => object} score  – pure scorer
 * @property {(attempt: object) => string} hint   – error-specific hint
 * @property {string=}  impl           – key into MODES if backed by an existing UI mode
 */

/** @type {Object<string, PhonicsMode>} */
export const PHONICS_MODES = Object.freeze({
  soundMatch: {
    key: 'soundMatch',
    name: 'Sound Match',
    instruction: 'Listen to the sound. Tap the letter that makes it.',
    objective: 'Map a heard phoneme to its written grapheme.',
    keyboard: true,
    touch: true,
    impl: 'hear',
    errorHints: {
      'voicing-confusion':   'Listen for whether the sound is whispered (/p/) or buzzes (/b/).',
      'short-vowel-confusion':'Open your mouth a little wider for /ă/ and smile a little for /ĕ/.',
      'digraph-confusion':   'Two letters can make one sound. Say sh-, ch-, or th- first.',
      'default':             'Listen again. Say the sound out loud, then look for that letter.',
    },
    masteryCriteria: DEFAULT_MASTERY,
    score: scoreSoundMatch,
    hint:  getSoundMatchHint,
  },

  pictureFirstSound: {
    key: 'pictureFirstSound',
    name: 'Picture First Sound',
    instruction: 'Look at the picture. Tap the sound it starts with.',
    objective: 'Identify the initial phoneme of a spoken word from a picture cue.',
    keyboard: true,
    touch: true,
    impl: 'first',
    errorHints: {
      'picked-final':   'That sound ends the word. We want the FIRST sound. Say the word slowly.',
      'picked-medial':  'That sound is in the middle. Say the word and listen for the very first sound.',
      'blend-skipped':  'Two sounds blend at the start. Listen for both, like /s/–/t/ in star.',
      'default':        'Say the word out loud. What sound does your mouth make first?',
    },
    masteryCriteria: DEFAULT_MASTERY,
    score: scorePictureFirstSound,
    hint:  getPictureFirstSoundHint,
  },

  blendBuilder: {
    key: 'blendBuilder',
    name: 'Blend Builder',
    instruction: 'Tap the sounds in order to build the word.',
    objective: 'Blend phonemes in sequence to construct a target word.',
    keyboard: true,
    touch: true,
    impl: 'blend',
    errorHints: {
      'out-of-order':    'The sounds are right, but the order is mixed up. Start with the first sound.',
      'missing-sound':   'You missed a sound. Say the word slowly and count the sounds.',
      'extra-sound':     'There is one sound too many. Say the word again and listen carefully.',
      'wrong-grapheme':  'That sound is right, but a different letter spells it here.',
      'default':         'Say each sound, then push them together. Slow and steady.',
    },
    masteryCriteria: DEFAULT_MASTERY,
    score: scoreBlendBuilder,
    hint:  getBlendBuilderHint,
  },

  wordSort: {
    key: 'wordSort',
    name: 'Word Sort',
    instruction: 'Put each word in the box that matches its sound.',
    objective: 'Sort words by their vowel or target spelling pattern.',
    keyboard: true,
    touch: true,
    errorHints: {
      'vowel-confusion':   'Say the word slowly. What vowel sound do you hear in the middle?',
      'pattern-confusion': 'Look at the letters in the middle. Does it have a_e, ai, or ay?',
      'default':           'Stretch the word out. The middle sound tells you the right box.',
    },
    masteryCriteria: DEFAULT_MASTERY,
    score: scoreWordSort,
    hint:  getWordSortHint,
  },

  readAndTap: {
    key: 'readAndTap',
    name: 'Read and Tap',
    instruction: 'Read the sentence. Tap the word you hear.',
    objective: 'Locate a target decodable word inside a connected sentence.',
    keyboard: true,
    touch: true,
    errorHints: {
      'tapped-similar-onset': 'Two words start the same. Say each one and listen for the rest.',
      'tapped-rhyme':         'Those words rhyme. Look at how the start is spelled.',
      'tapped-anywhere':      'Read the sentence left to right. Stop when the word sounds the same.',
      'default':              'Read each word out loud. Tap the one that matches what you heard.',
    },
    masteryCriteria: DEFAULT_MASTERY,
    score: scoreReadAndTap,
    hint:  getReadAndTapHint,
  },

  listenAndSpell: {
    key: 'listenAndSpell',
    name: 'Listen and Spell',
    instruction: 'Listen to the word. Build it letter by letter.',
    objective: 'Map every phoneme in a spoken word to its correct grapheme.',
    keyboard: true,
    touch: true,
    impl: 'classicBlend', // closest existing UI; full spelling drill lives in lscwcDrill
    errorHints: {
      'missing-letter':      'You missed a letter. Say the word and count the sounds.',
      'transposed-letters':  'The right letters, the wrong order. Say each sound from left to right.',
      'wrong-vowel':         'Listen to the vowel sound. Try a different vowel and re-read it.',
      'silent-e-missing':    'The vowel says its name. Add a silent e at the end.',
      'default':             'Say the word slowly. Tap one letter for each sound you hear.',
    },
    masteryCriteria: DEFAULT_MASTERY,
    score: scoreListenAndSpell,
    hint:  getListenAndSpellHint,
  },

  fluencySprint: {
    key: 'fluencySprint',
    name: 'Fluency Sprint',
    instruction: 'Read each word out loud. Keep going as fast as you can.',
    objective: 'Read familiar words quickly and accurately within a time window.',
    keyboard: true,
    touch: true,
    errorHints: {
      'slow-and-accurate': 'Great accuracy! Read three words a beat faster next time.',
      'fast-and-error':    'Slow down a tiny bit. Accuracy first, speed second.',
      'sound-by-sound':    'These words are familiar. Try reading them as whole chunks.',
      'default':           'Take a breath, then read three words together as a phrase.',
    },
    masteryCriteria: Object.freeze({ accuracy: 0.90, minAttempts: 10, targetWpm: 30 }),
    score: scoreFluencySprint,
    hint:  getFluencySprintHint,
  },
});

/** Canonical ordering for menus / dashboards. */
export const PHONICS_MODE_ORDER = Object.freeze([
  'soundMatch',
  'pictureFirstSound',
  'blendBuilder',
  'wordSort',
  'readAndTap',
  'listenAndSpell',
  'fluencySprint',
]);

/** @returns {PhonicsMode|null} */
export function getPhonicsMode(key) {
  return PHONICS_MODES[key] ?? null;
}

/** Word count limit for the child-friendly instruction copy. */
export const MAX_INSTRUCTION_WORDS = 15;
