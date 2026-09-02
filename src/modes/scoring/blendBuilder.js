/**
 * Blend Builder — scoring & hints.
 *
 * The child taps phonemes in order to construct a target word. The attempt
 * captures the sequence they tapped, the target grapheme sequence, and the
 * time taken.
 *
 * Attempt shape:
 *   {
 *     target:    { word: 'flat', graphemes: ['f','l','a','t'] },
 *     placed:    ['f','l','a','t'],   // graphemes in the order the child placed them
 *     timeMs:    number,
 *   }
 *
 * Error categories (in priority order):
 *   - missing-sound   : fewer sounds placed than target
 *   - extra-sound     : more sounds placed than target
 *   - out-of-order    : same multiset, wrong order
 *   - wrong-grapheme  : at least one grapheme is not in the target
 *   - default
 */

const HINTS = Object.freeze({
  'missing-sound': 'You missed a sound. Say the word slowly and count the sounds.',
  'extra-sound': 'There is one sound too many. Say the word again and listen carefully.',
  'out-of-order': 'The sounds are right, but the order is mixed up. Start with the first sound.',
  'wrong-grapheme': 'That sound is right, but a different letter spells it here.',
  default: 'Say each sound, then push them together. Slow and steady.',
});

function multisetEqual(a, b) {
  if (a.length !== b.length) return false;
  const counts = new Map();
  for (const g of a) counts.set(g, (counts.get(g) ?? 0) + 1);
  for (const g of b) {
    const n = counts.get(g);
    if (!n) return false;
    counts.set(g, n - 1);
  }
  return [...counts.values()].every((n) => n === 0);
}

function classify(target = [], placed = []) {
  if (placed.length < target.length) return 'missing-sound';
  if (placed.length > target.length) return 'extra-sound';
  if (multisetEqual(target, placed)) return 'out-of-order';
  const targetSet = new Set(target);
  if (placed.some((g) => !targetSet.has(g))) return 'wrong-grapheme';
  return 'default';
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export function getBlendBuilderHint(attempt = {}) {
  const target = attempt?.target?.graphemes ?? [];
  const placed = attempt?.placed ?? [];
  if (arraysEqual(target, placed)) return '';
  const cat = classify(target, placed);
  return HINTS[cat] ?? HINTS.default;
}

export function scoreBlendBuilder(attempt = {}) {
  const target = Array.isArray(attempt?.target?.graphemes) ? attempt.target.graphemes : [];
  const placed = Array.isArray(attempt?.placed) ? attempt.placed : [];
  const correct = target.length > 0 && arraysEqual(target, placed);
  const errorCategory = correct ? null : classify(target, placed);

  // Partial-credit accuracy: how many positions match.
  const matches = target.reduce((n, g, i) => n + (placed[i] === g ? 1 : 0), 0);
  const accuracy = target.length === 0 ? 0 : matches / target.length;

  return {
    correct,
    errorCategory,
    hint: correct ? '' : (HINTS[errorCategory] ?? HINTS.default),
    masteryDelta: correct ? 1 : 0,
    scoreBreakdown: { accuracy, matches, total: target.length },
  };
}
