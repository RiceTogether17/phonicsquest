/**
 * No two answer choices may sound the same, and no wrong choice may sound
 * like the answer.
 *
 * Reported from use: a First Sound round showed /k/ twice and one of them
 * counted as wrong. Choices are labelled by sound (c and k both read /k/),
 * but distractors were de-duplicated by letter. Reported in review: the
 * printed notation in turn keeps spellings of one sound apart (/ir/ /er/ /ur/,
 * /oi/ /oy/, /ai/ /ay/) although the audio plays each group as one recording.
 *
 * Every word in the bank is run through each builder several times, because
 * the fill-up tiers shuffle. "Same sound" is computed HERE, from the printed
 * notation and the recording directly — not through the builders' own helper
 * — so weakening the code under test cannot weaken the test.
 */
import { describe, it, expect } from 'vitest';

globalThis.speechSynthesis ??= {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
};

const { WORDS, phonemeNotation } = await import('../src/data/words.js');
const { phonemeAudioFile } = await import('../src/modules/audio.js');
const { firstPhoneme, lastPhoneme } = await import('../src/modes/phonemePosition.js');
const { getFirstSoundDistractors } = await import('../src/modes/firstSound.js');
const { getLastSoundDistractors } = await import('../src/modes/lastSound.js');
const { getMiddleSoundDistractors } = await import('../src/modes/middleSound.js');

const RUNS = 6;
const VOWELS = new Set(['sv', 'lv', 'vt', 'dp', 'rc']);

/** What a child sees and hears for a choice: the printed sound and the recording. */
function heard(o) {
  const file = phonemeAudioFile(o.grapheme, o.type);
  return [`n:${phonemeNotation(o.grapheme, o.type).join('')}`, ...(file ? [`a:${file}`] : [])];
}

/** Every round that repeats a sound or has too few choices. */
function clashes({ targets, distractors }) {
  const bad = new Set();
  for (const word of WORDS) {
    for (const target of targets(word)) {
      for (let r = 0; r < RUNS; r++) {
        const options = [target, ...distractors(word, target).slice(0, 3)];
        // Removing same-sound choices must not leave a round short: a two- or
        // three-option grid is easier to guess and counts toward mastery all
        // the same.
        if (options.length < 4) bad.add(`${word.word}: only ${options.length} choices`);
        const keys = options.flatMap(heard);
        const dup = keys.find((k, i) => keys.indexOf(k) !== i);
        if (dup) {
          bad.add(`${word.word}: ${dup} twice (${options.map((o) => o.grapheme).join(', ')})`);
        }
      }
    }
  }
  return [...bad];
}

describe('answer choices are distinct sounds', () => {
  it('First Sound (shared with Sound Hunt, Odd One Out, Train Carriages)', () => {
    expect(
      clashes({
        targets: (w) => [firstPhoneme(w)],
        distractors: (w, t) => getFirstSoundDistractors(t.grapheme, t.type, w.level),
      }),
    ).toEqual([]);
  });

  it('Last Sound', () => {
    expect(
      clashes({
        targets: (w) => [lastPhoneme(w)],
        distractors: (w, t) => getLastSoundDistractors(t.grapheme, 'last', w.level, t.type),
      }),
    ).toEqual([]);
  });

  it('Middle Sound — every vowel, long and r-controlled ones included', () => {
    expect(
      clashes({
        targets: (w) =>
          w.types
            .map((t, i) => (VOWELS.has(t) ? { grapheme: w.graphemes[i], type: t } : null))
            .filter(Boolean),
        distractors: (w, t) => getMiddleSoundDistractors(t.grapheme, w.level, t.type),
      }),
    ).toEqual([]);
  });

  it('never offers another spelling of the answer’s sound as a wrong answer', () => {
    // The review's examples: a child who hears "bird" correctly must not be
    // marked wrong for "er" or "ur", nor one who hears "rain" for "ay".
    const cases = [
      ['ir', 'rc', ['er', 'ur']],
      ['er', 'rc', ['ir', 'ur']],
      ['oi', 'dp', ['oy']],
      ['ai', 'lv', ['ay', 'a']],
      ['ee', 'lv', ['ea']],
    ];
    for (const [answer, type, twins] of cases) {
      for (let r = 0; r < 20; r++) {
        const offered = getMiddleSoundDistractors(answer, 4, type).map((d) => d.grapheme);
        for (const twin of twins) expect(offered, `${answer} offered ${twin}`).not.toContain(twin);
      }
    }
  });
});
