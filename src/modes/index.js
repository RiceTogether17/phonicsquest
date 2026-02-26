/**
 * PhonicsQuest – Mode Registry
 * Maps mode keys to their setup/cleanup functions.
 */

import { setupBlend, cleanup as cleanupBlend, getCurrentWord as getBlendWord } from './blend.js';
import { setupClassicBlend, cleanup as cleanupClassic, getCurrentWord as getClassicWord } from './classicBlend.js';
import { setupHearChoose, cleanup as cleanupHear, getCurrentWord as getHearWord } from './hearChoose.js';
import { setupSegment, cleanup as cleanupSegment, getCurrentWord as getSegmentWord } from './segment.js';
import { setupMissingSound, cleanup as cleanupMissing, getCurrentWord as getMissingWord } from './missingSound.js';
import { setupFirstSound,  cleanup as cleanupFirst,  getCurrentWord as getFirstWord  } from './firstSound.js';
import { setupLastSound,   cleanup as cleanupLast,   getCurrentWord as getLastWord   } from './lastSound.js';
import { setupMiddleSound, cleanup as cleanupMiddle, getCurrentWord as getMiddleWord } from './middleSound.js';

/**
 * @typedef {Object} Mode
 * @property {string} key
 * @property {string} name
 * @property {string} desc
 * @property {string} icon
 * @property {string} group  – UI grouping: 'blend' | 'phonemic'
 * @property {Function} setup  (word, els) => void
 * @property {Function} cleanup  () => void
 * @property {Function} getCurrentWord  () => Word|null
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
    setup: setupClassicBlend,
    cleanup: cleanupClassic,
    getCurrentWord: getClassicWord,
  },
  // ── Phoneme identification ─────────────────────────────────────────────
  hear: {
    key: 'hear',
    name: 'Hear & Choose',
    desc: 'Listen carefully',
    icon: '👂',
    group: 'phonemic',
    setup: setupHearChoose,
    cleanup: cleanupHear,
    getCurrentWord: getHearWord,
  },
  segment: {
    key: 'segment',
    name: 'Segment It',
    desc: 'Break it apart',
    icon: '✂️',
    group: 'phonemic',
    setup: setupSegment,
    cleanup: cleanupSegment,
    getCurrentWord: getSegmentWord,
  },
  missing: {
    key: 'missing',
    name: 'Missing Sound',
    desc: 'Find the gap',
    icon: '🔍',
    group: 'phonemic',
    setup: setupMissingSound,
    cleanup: cleanupMissing,
    getCurrentWord: getMissingWord,
  },
  // ── Phonemic awareness ────────────────────────────────────────────────
  first: {
    key: 'first',
    name: 'First Sound',
    desc: 'What starts it?',
    icon: '🚀',
    group: 'phonemic',
    setup: setupFirstSound,
    cleanup: cleanupFirst,
    getCurrentWord: getFirstWord,
  },
  last: {
    key: 'last',
    name: 'Last Sound',
    desc: 'What ends it?',
    icon: '🎯',
    group: 'phonemic',
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
    setup: setupMiddleSound,
    cleanup: cleanupMiddle,
    getCurrentWord: getMiddleWord,
  },
};

export function getModeList() {
  return Object.values(MODES);
}
