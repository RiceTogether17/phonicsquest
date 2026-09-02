import { describe, expect, it, vi } from 'vitest';

/**
 * Every MCQ generator must be able to fill a 4-option grid: a question
 * that renders with only 1–3 options is trivially guessable but still
 * counts toward mastery. These specs pin the boundary cases.
 */

globalThis.speechSynthesis = {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
  paused: false,
  resume: () => {},
};
globalThis.SpeechSynthesisUtterance = class {
  constructor(t) {
    this.text = t;
  }
};

const { _getCountChoices } = await import('../src/modes/soundCount.js');
const { getPhonemeDistractors } = await import('../src/modes/missingSound.js');
const { getFirstSoundDistractors } = await import('../src/modes/firstSound.js');

describe('soundCount _getCountChoices', () => {
  it('yields 4 unique choices at the low boundary (correct = 1)', () => {
    const choices = _getCountChoices(1);
    expect(new Set(choices).size).toBe(4);
    expect(choices).toContain(1);
    for (const c of choices) expect(c).toBeGreaterThanOrEqual(1);
  });

  it('yields 4 unique choices at the high boundary (correct = 7)', () => {
    const choices = _getCountChoices(7);
    expect(new Set(choices).size).toBe(4);
    expect(choices).toContain(7);
    for (const c of choices) expect(c).toBeLessThanOrEqual(8);
  });

  it('yields 4 unique in-range choices for every realistic count', () => {
    for (let correct = 1; correct <= 8; correct++) {
      const choices = _getCountChoices(correct);
      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(correct);
      for (const c of choices) {
        expect(c).toBeGreaterThanOrEqual(1);
        expect(c).toBeLessThanOrEqual(8);
      }
    }
  });
});

describe('missingSound getPhonemeDistractors', () => {
  it('returns at least 3 distractors for common types at every level cap', () => {
    for (const [grapheme, type] of [
      ['a', 'sv'],
      ['sh', 'd'],
      ['t', 'c'],
      ['ee', 'lv'],
    ]) {
      for (const maxLevel of [1, 2, 3]) {
        const pool = getPhonemeDistractors(grapheme, type, maxLevel);
        expect(pool.length).toBeGreaterThanOrEqual(3);
        expect(pool).not.toContain(grapheme);
      }
    }
  });

  it('falls back to the static pool for a type absent from the word list', () => {
    // A made-up type has no words at all — the static consonant pool pads it.
    const pool = getPhonemeDistractors('x', 'zz', 1);
    expect(pool.length).toBeGreaterThanOrEqual(3);
  });
});

describe('firstSound getFirstSoundDistractors', () => {
  it('returns at least 3 distractors for every initial grapheme in the bank', async () => {
    const { WORDS } = await import('../src/data/words.js');
    const initials = new Map();
    for (const w of WORDS) {
      if (Array.isArray(w.graphemes) && w.graphemes.length >= 2) {
        initials.set(w.graphemes[0], w.types[0]);
      }
    }
    for (const [grapheme, type] of initials) {
      const pool = getFirstSoundDistractors(grapheme, type, 1);
      expect(pool.length, `initial /${grapheme}/ at level 1`).toBeGreaterThanOrEqual(3);
      expect(pool.map((d) => d.grapheme)).not.toContain(grapheme);
    }
  });
});

describe('phonemeChoice preview timers are cancellable', () => {
  it('cancelChoicePreviews stops queued previews from firing', async () => {
    vi.useFakeTimers();
    try {
      const { renderPhonemeChoiceGrid, cancelChoicePreviews } =
        await import('../src/components/phonemeChoice.js');
      const { audio } = await import('../src/modules/audio.js');
      const spy = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();

      const container = document.createElement('div');
      const choices = [
        { grapheme: 'c', type: 'c', correct: true },
        { grapheme: 'a', type: 'sv', correct: false },
        { grapheme: 't', type: 'c', correct: false },
      ];
      renderPhonemeChoiceGrid(container, choices, {
        autoPlay: true,
        autoPlayDelay: 50,
        autoPlayStride: 50,
      });

      cancelChoicePreviews();
      await vi.advanceTimersByTimeAsync(1000);
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    } finally {
      vi.useRealTimers();
    }
  });

  it('re-rendering a grid cancels the previous grid’s pending previews', async () => {
    vi.useFakeTimers();
    try {
      const { renderPhonemeChoiceGrid } = await import('../src/components/phonemeChoice.js');
      const { audio } = await import('../src/modules/audio.js');
      const spy = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();

      const container = document.createElement('div');
      const round1 = [{ grapheme: 'b', type: 'c', correct: true }];
      const round2 = [{ grapheme: 'z', type: 'c', correct: true }];
      renderPhonemeChoiceGrid(container, round1, {
        autoPlay: true,
        autoPlayDelay: 500,
        autoPlayStride: 50,
      });
      // New round renders before round 1's preview ever fires.
      renderPhonemeChoiceGrid(container, round2, {
        autoPlay: true,
        autoPlayDelay: 10,
        autoPlayStride: 50,
      });

      await vi.advanceTimersByTimeAsync(2000);
      const spoken = spy.mock.calls.map((c) => c[0]);
      expect(spoken).toContain('z');
      expect(spoken).not.toContain('b'); // stale round-1 audio never bleeds through

      spy.mockRestore();
    } finally {
      vi.useRealTimers();
    }
  });
});
