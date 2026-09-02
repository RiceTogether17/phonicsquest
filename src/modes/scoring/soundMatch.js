/**
 * Sound Match — scoring & hints.
 *
 * Attempt shape:
 *   {
 *     prompt:   { sound: '/sh/', grapheme: 'sh' },   // the correct answer
 *     chosen:   string,                              // grapheme the child picked
 *     choices:  string[],                            // distractors offered
 *     timeMs:   number,                              // ms from prompt to answer
 *   }
 *
 * Result shape:
 *   {
 *     correct:        boolean,
 *     errorCategory:  string|null,
 *     hint:           string,
 *     masteryDelta:   number,    // +1 correct, 0 wrong (caller weights it)
 *     scoreBreakdown: { accuracy: number, speedBonus: number },
 *   }
 *
 * The scorer is pure: same input -> same output, no DOM or audio side
 * effects.
 */

const VOICED_PAIRS = new Map([
  ['p', 'b'],
  ['b', 'p'],
  ['t', 'd'],
  ['d', 't'],
  ['k', 'g'],
  ['g', 'k'],
  ['f', 'v'],
  ['v', 'f'],
  ['s', 'z'],
  ['z', 's'],
]);

const SHORT_VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
const DIGRAPHS = new Set(['sh', 'ch', 'th', 'wh', 'ck', 'ng', 'ph']);

const FAST_MS = 3000;

/**
 * Categorise the error so the hint engine can be specific.
 */
function categoriseError(target, chosen) {
  if (!chosen) return 'default';
  const t = String(target).toLowerCase();
  const c = String(chosen).toLowerCase();
  if (t === c) return null;

  if (VOICED_PAIRS.get(t) === c) return 'voicing-confusion';
  if (SHORT_VOWELS.has(t) && SHORT_VOWELS.has(c)) return 'short-vowel-confusion';
  if (DIGRAPHS.has(t) && (DIGRAPHS.has(c) || c.length === 1)) return 'digraph-confusion';
  return 'default';
}

const HINTS = Object.freeze({
  'voicing-confusion': 'Listen for whether the sound is whispered (/p/) or buzzes (/b/).',
  'short-vowel-confusion': 'Open your mouth a little wider for /ă/ and smile a little for /ĕ/.',
  'digraph-confusion': 'Two letters can make one sound. Say sh-, ch-, or th- first.',
  default: 'Listen again. Say the sound out loud, then look for that letter.',
});

export function getSoundMatchHint(attempt = {}) {
  const target = attempt?.prompt?.grapheme;
  const chosen = attempt?.chosen;
  const cat = categoriseError(target, chosen) || 'default';
  return HINTS[cat] ?? HINTS.default;
}

export function scoreSoundMatch(attempt = {}) {
  const target = attempt?.prompt?.grapheme;
  const chosen = attempt?.chosen;
  const timeMs = typeof attempt?.timeMs === 'number' ? attempt.timeMs : null;

  const correct = !!target && String(chosen).toLowerCase() === String(target).toLowerCase();
  const errorCategory = correct ? null : categoriseError(target, chosen) || 'default';
  const speedBonus = correct && timeMs !== null && timeMs <= FAST_MS ? 1 : 0;

  return {
    correct,
    errorCategory,
    hint: correct ? '' : (HINTS[errorCategory] ?? HINTS.default),
    masteryDelta: correct ? 1 : 0,
    scoreBreakdown: { accuracy: correct ? 1 : 0, speedBonus },
  };
}
