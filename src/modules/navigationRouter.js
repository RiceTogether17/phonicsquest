/**
 * PhonicsQuest – Navigation router
 *
 * One place that turns a target string into "open that thing". Targets come
 * from everywhere — Today's Lesson steps, the recommendations engine, the
 * Mistakes Den rows, journey warm-ups — so this is the single map from a
 * name to an action.
 *
 * Extracted from a 91-line switch in app.js. The switch had exactly three
 * repeating shapes, so they are now three tables and a short dispatcher:
 * adding a destination is a one-line table entry instead of another case
 * block, and it is impossible to add one that silently does nothing.
 *
 * App-specific actions are injected, so this module holds no app state.
 */

import { MODES } from '../modes/index.js';

/**
 * Targets that open a screen by clicking its home-screen button. The button
 * owns the real setup (lazy module load, container wiring), so routing to it
 * keeps that logic in one place rather than duplicating it here.
 */
export const BUTTON_TARGETS = Object.freeze({
  'letter-sounds':  'btn-letter-sounds',
  'sentence-forge': 'btn-sentence-forge',
  'grammar-mcq':    'btn-grammar-mcq',
  'vocab-mcq':      'btn-vocab-mcq',
  'paper-mode':     'btn-paper-mode',
  'cloze-castle':   'btn-cloze-castle',
  'word-vault':     'btn-word-vault',
  'editing-quest':  'btn-editing-quest',
  'writing-quest':  'btn-writing-quest',
  'sight-words':    'btn-sight-words',
  'stories':        'btn-stories',
});

/**
 * Hyphenated aliases for game modes whose internal key differs from the
 * target name used in recommendations and lesson steps.
 */
export const MODE_ALIASES = Object.freeze({
  'first-sound': 'first',
  'oral-blend':  'oralBlend',
  'classicBlend': 'classicBlend',
  'hear':        'hear',
});

/**
 * Mode targets that resume the child's last-chosen phonics group rather than
 * letting the mode pick a word. Only Classic Blend behaves this way.
 */
const GROUP_RESUMING_TARGETS = Object.freeze(new Set(['classicBlend']));

/** Primary-English screens that share the placeholder host. */
export const PLACEHOLDER_TARGETS = Object.freeze(new Set([
  'visual-text', 'comprehension-cloze', 'open-comprehension', 'synthesis',
  'situational-writing', 'listening-comp',
  'p1-practice-tests', 'p2-practice-tests', 'p3-practice-tests',
  'p4-practice-tests', 'p5-practice-tests', 'p6-practice-tests',
]));

/**
 * @typedef {object} NavHandlers
 * @property {(mode: string) => void} setMode          record the active mode
 * @property {(group?: string) => void} startGame
 * @property {() => void} openBlendPicker
 * @property {(target: string) => void} openPrimaryPlaceholder
 * @property {(group: string) => void} [setGroup]
 * @property {() => string|undefined} [getCurrentGroup]
 */

/**
 * Route to a target.
 *
 * @param {string} target
 * @param {string|null} group  optional phonics group for game modes
 * @param {NavHandlers} handlers
 * @returns {boolean} false when the target is unknown (caller may warn)
 */
export function navigateTo(target, group, handlers) {
  if (!target || !handlers) return false;

  // Blend is the one target with a picker fallback: with a group it starts
  // straight away, without one the child chooses a stage first.
  if (target === 'blend') {
    handlers.setMode('blend');
    if (group) {
      handlers.setGroup?.(group);
      handlers.startGame(group);
    } else {
      handlers.openBlendPicker();
    }
    return true;
  }

  const buttonId = BUTTON_TARGETS[target];
  if (buttonId) {
    /** @type {HTMLElement|null} */
    const btn = document.getElementById(buttonId);
    btn?.click();
    return Boolean(btn);
  }

  if (PLACEHOLDER_TARGETS.has(target)) {
    handlers.openPrimaryPlaceholder(target);
    return true;
  }

  // Aliased modes, then any bare mode key (first, last, middle, oddOneOut,
  // syllable, soundHunt, segment…). Journey warm-up steps navigate this way.
  const modeKey = MODE_ALIASES[target] || (MODES[target] ? target : null);
  if (modeKey) {
    handlers.setMode(modeKey);
    // Classic Blend resumes the group the child last chose; the phonemic
    // awareness modes pick their own word and take no group.
    handlers.startGame(
      GROUP_RESUMING_TARGETS.has(target) ? handlers.getCurrentGroup?.() : undefined,
    );
    return true;
  }

  return false;
}

/** Every target this router understands — used by tests and tooling. */
export function knownTargets() {
  return [
    'blend',
    ...Object.keys(BUTTON_TARGETS),
    ...Object.keys(MODE_ALIASES),
    ...PLACEHOLDER_TARGETS,
    ...Object.keys(MODES),
  ];
}
