/**
 * No two answer choices may sound the same, and no wrong choice may sound
 * like the answer.
 *
 * Reported from use: a First Sound round showed /k/ twice and one of them
 * counted as wrong. Choices are labelled by sound (c and k both read /k/),
 * but distractors were de-duplicated by letter. Every word in the bank is run
 * through each builder several times, because the fill-up tiers shuffle.
 */
import { describe, it, expect } from 'vitest';

globalThis.speechSynthesis ??= {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
};

const { WORDS } = await import('../src/data/words.js');
const { firstPhoneme, lastPhoneme, soundKey } = await import('../src/modes/phonemePosition.js');
const { getFirstSoundDistractors } = await import('../src/modes/firstSound.js');
const { getLastSoundDistractors } = await import('../src/modes/lastSound.js');
const { getMiddleSoundDistractors } = await import('../src/modes/middleSound.js');

const RUNS = 6;

/** Every round that shows a sound twice or has too few choices. */
function clashes(build) {
  const bad = new Set();
  for (const word of WORDS) {
    const target = build.target(word);
    if (!target) continue;
    for (let r = 0; r < RUNS; r++) {
      const options = [target, ...build.distractors(word, target).slice(0, 3)];
      const keys = options.map((o) => soundKey(o.grapheme, o.type));
      // Removing same-sound choices must not leave a round short: a two- or
      // three-option grid is easier to guess and counts toward mastery all
      // the same.
      if (options.length < 4) bad.add(`${word.word}: only ${options.length} choices`);
      const dup = keys.find((k, i) => keys.indexOf(k) !== i);
      if (dup) bad.add(`${word.word}: ${dup} twice (${options.map((o) => o.grapheme).join(', ')})`);
    }
  }
  return [...bad];
}

describe('answer choices are distinct sounds', () => {
  it('First Sound (shared with Sound Hunt, Odd One Out, Train Carriages)', () => {
    expect(
      clashes({
        target: (w) => firstPhoneme(w),
        distractors: (w, t) => getFirstSoundDistractors(t.grapheme, t.type, w.level),
      }),
    ).toEqual([]);
  });

  it('Last Sound', () => {
    expect(
      clashes({
        target: (w) => lastPhoneme(w),
        distractors: (w, t) => getLastSoundDistractors(t.grapheme, 'last', w.level, t.type),
      }),
    ).toEqual([]);
  });

  it('Middle Sound', () => {
    const VOWELS = new Set(['sv', 'lv', 'vt', 'dp', 'rc']);
    expect(
      clashes({
        target: (w) => {
          const i = w.types.findIndex((t) => VOWELS.has(t));
          return i < 0 ? null : { grapheme: w.graphemes[i], type: w.types[i] };
        },
        distractors: (w, t) => getMiddleSoundDistractors(t.grapheme, w.level, t.type),
      }),
    ).toEqual([]);
  });
});
