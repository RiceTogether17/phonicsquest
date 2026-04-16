/**
 * PhonicsQuest – Mode Registry
 * Maps mode keys to their setup/cleanup functions.
 *
 * Each mode carries a `subskill` tag that describes the specific phonological
 * or phonics skill being practised. This tag can be used for reporting,
 * adaptive routing, and teacher-facing labels.
 *
 * Recommended play order for phonemic awareness:
 *   oralBlend → first → last → middle → soundCount → missing → segment
 */

import { setupBlend, cleanup as cleanupBlend, getCurrentWord as getBlendWord } from './blend.js';
import { setupClassicBlend, cleanup as cleanupClassic, getCurrentWord as getClassicWord } from './classicBlend.js';
import { setupHearChoose, cleanup as cleanupHear, getCurrentWord as getHearWord } from './hearChoose.js';
import { setupSegment, cleanup as cleanupSegment, getCurrentWord as getSegmentWord } from './segment.js';
import { setupMissingSound, cleanup as cleanupMissing, getCurrentWord as getMissingWord } from './missingSound.js';
import { setupFirstSound,  cleanup as cleanupFirst,  getCurrentWord as getFirstWord  } from './firstSound.js';
import { setupLastSound,   cleanup as cleanupLast,   getCurrentWord as getLastWord   } from './lastSound.js';
import { setupMiddleSound, cleanup as cleanupMiddle, getCurrentWord as getMiddleWord } from './middleSound.js';
import { setupOralBlend,   cleanup as cleanupOralBlend, getCurrentWord as getOralBlendWord } from './oralBlend.js';
import { setupSoundCount,  cleanup as cleanupSoundCount, getCurrentWord as getSoundCountWord } from './soundCount.js';

/**
 * @typedef {Object} Mode
 * @property {string} key
 * @property {string} name
 * @property {string} desc
 * @property {string} icon
 * @property {string} group     – UI grouping: 'blend' | 'phonemic'
 * @property {string} subskill  – specific skill tag for reporting/routing
 * @property {(word: import('../data/words.js').Word, els: Record<string, HTMLElement | null>) => void} setup
 * @property {() => void} cleanup
 * @property {() => import('../data/words.js').Word | null} getCurrentWord
 */

/** @type {Record<string, Mode>} */
export const MODES = {
  // ── Blending ──────────────────────────────────────────────────────────
  blend: {
    key: 'blend',
    name: 'Blend It!',
    desc: 'Step by step — for new decoders',
    icon: '🎯',
    group: 'blend',
    subskill: 'phoneme-blending',
    setup: setupBlend,
    cleanup: cleanupBlend,
    getCurrentWord: getBlendWord,
  },
  classicBlend: {
    key: 'classicBlend',
    name: 'Listen & Blend',
    desc: 'Free mode — for confident learners',
    icon: '🔊',
    group: 'blend',
    subskill: 'phoneme-blending',
    setup: setupClassicBlend,
    cleanup: cleanupClassic,
    getCurrentWord: getClassicWord,
  },
  // ── Pure phonemic awareness (sound only, no print required) ───────────
  oralBlend: {
    key: 'oralBlend',
    name: 'Oral Blend',
    desc: 'Blend sounds — no letters needed!',
    icon: '👂',
    group: 'phonemic',
    subskill: 'oral-blending',
    setup: setupOralBlend,
    cleanup: cleanupOralBlend,
    getCurrentWord: getOralBlendWord,
  },
  first: {
    key: 'first',
    name: 'First Sound',
    desc: 'What starts it?',
    icon: '🚀',
    group: 'phonemic',
    subskill: 'initial-phoneme',
    setup: setupFirstSound,
    cleanup: cleanupFirst,
    getCurrentWord: getFirstWord,
  },
  last: {
    key: 'last',
    name: 'Last Sound',
    desc: 'What ends it?',
    icon: '🏁',
    group: 'phonemic',
    subskill: 'final-phoneme',
    setup: setupLastSound,
    cleanup: cleanupLast,
    getCurrentWord: getLastWord,
  },
  middle: {
    key: 'middle',
    name: 'Middle Sound',
    desc: 'Find the vowel!',
    icon: '🎯',
    group: 'phonemic',
    subskill: 'medial-vowel',
    setup: setupMiddleSound,
    cleanup: cleanupMiddle,
    getCurrentWord: getMiddleWord,
  },
  soundCount: {
    key: 'soundCount',
    name: 'Count the Sounds',
    desc: 'How many sounds in the word?',
    icon: '🔢',
    group: 'phonemic',
    subskill: 'phoneme-segmenting',
    setup: setupSoundCount,
    cleanup: cleanupSoundCount,
    getCurrentWord: getSoundCountWord,
  },
  // ── Sound-to-print bridge (phonics application) ───────────────────────
  hear: {
    key: 'hear',
    name: 'Hear & Choose',
    desc: 'Match the word you hear',
    icon: '🔊',
    group: 'phonemic',
    subskill: 'auditory-word-discrimination',
    setup: setupHearChoose,
    cleanup: cleanupHear,
    getCurrentWord: getHearWord,
  },
  missing: {
    key: 'missing',
    name: 'Missing Sound',
    desc: 'Which sound is missing?',
    icon: '🔍',
    group: 'phonemic',
    subskill: 'phoneme-completion',
    setup: setupMissingSound,
    cleanup: cleanupMissing,
    getCurrentWord: getMissingWord,
  },
  segment: {
    key: 'segment',
    name: 'Segment It',
    desc: 'Group letters into sounds',
    icon: '✂️',
    group: 'phonemic',
    subskill: 'grapheme-segmenting',
    setup: setupSegment,
    cleanup: cleanupSegment,
    getCurrentWord: getSegmentWord,
  },
};

export function getModeList() {
  return Object.values(MODES);
}
