/**
 * PhonicsQuest – Progression gate policy.
 *
 * The bars a stage must clear before the next one unlocks. Split out of
 * `progression.js` because it is pure policy with no runtime dependencies,
 * while that module pulls in the store, the word bank and the teacher
 * unlock — so anything wanting to *read* the policy (documentation
 * generators, reports, tooling that runs outside the browser) had to drag
 * the whole app in to see eight numbers.
 *
 * `progression.js` re-exports this, so every existing import still works.
 *
 * The reasoning behind each number lives in the `progression.js` header,
 * next to the code that enforces it.
 */
export const PROGRESSION_GATE = Object.freeze({
  MIN_DECODING_ACCURACY: 0.85,
  MIN_SPELLING_ACCURACY: 0.8,
  MIN_UNIQUE_WORDS: 12,
  MIN_SESSION_DAYS: 2,
  MIN_SPELLING_ATTEMPTS: 6, // before we have this many spelling attempts, treat as no-data
  MIN_DECODING_ATTEMPTS: 6, // need at least this many decoding attempts to judge
  MAX_VOWEL_CONFUSION_GAP: 0.2, // prereq accuracy must not be more than 20 pts below sibling-median
  GROUP_SIZE_FRACTION: 0.75, // small groups: required unique = min(MIN_UNIQUE_WORDS, floor(size * this))
});
