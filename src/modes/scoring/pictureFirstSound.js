/**
 * Picture First Sound — scoring & hints.
 *
 * Attempt shape:
 *   {
 *     prompt:  { word: 'cat', picture: '🐱' },
 *     phonemes: ['/k/', '/a/', '/t/'],   // optional, lets us classify error
 *     chosen:  '/t/'|'/a/'|'/k/'|...     // sound the child picked
 *     timeMs:  number
 *   }
 *
 * Error categories:
 *   - picked-final   : child picked the final phoneme
 *   - picked-medial  : child picked the medial vowel
 *   - blend-skipped  : child picked second letter of an initial blend
 *   - default        : something else
 */

const HINTS = Object.freeze({
  'picked-final':  'That sound ends the word. We want the FIRST sound. Say the word slowly.',
  'picked-medial': 'That sound is in the middle. Say the word and listen for the very first sound.',
  'blend-skipped': 'Two sounds blend at the start. Listen for both, like /s/–/t/ in star.',
  'default':       'Say the word out loud. What sound does your mouth make first?',
});

function classify(chosen, phonemes) {
  if (!Array.isArray(phonemes) || phonemes.length === 0) return 'default';
  if (!chosen) return 'default';

  const idx = phonemes.findIndex(p => String(p).toLowerCase() === String(chosen).toLowerCase());
  if (idx === -1) return 'default';
  if (idx === phonemes.length - 1) return 'picked-final';
  if (idx === 1 && phonemes.length === 3) return 'picked-medial';
  if (idx === 1 && phonemes.length >= 4) return 'blend-skipped';
  return 'default';
}

export function getPictureFirstSoundHint(attempt = {}) {
  const cat = classify(attempt?.chosen, attempt?.phonemes);
  return HINTS[cat] ?? HINTS.default;
}

export function scorePictureFirstSound(attempt = {}) {
  const phonemes = attempt?.phonemes;
  const expected = Array.isArray(phonemes) && phonemes.length > 0 ? phonemes[0] : null;
  const correct  = !!expected && String(attempt?.chosen).toLowerCase() === String(expected).toLowerCase();
  const errorCategory = correct ? null : classify(attempt?.chosen, phonemes);

  return {
    correct,
    errorCategory,
    hint: correct ? '' : (HINTS[errorCategory] ?? HINTS.default),
    masteryDelta: correct ? 1 : 0,
    scoreBreakdown: { accuracy: correct ? 1 : 0 },
  };
}
