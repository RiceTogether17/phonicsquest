/**
 * Middle Sound must only ask about words with a genuine MEDIAL vowel.
 * From the long-vowel stages onward, many words carry their vowel first
 * or last ("ape" /ā/-p, "car" c-/ar/, "boy" b-/oy/) — quizzing those as
 * "the middle sound" actually tests a first or last sound, and for
 * silent-e words the old absolute-middle fallback even targeted a
 * consonant. These tests guard the pool filter and the stage coverage.
 */
import { describe, expect, it } from 'vitest';

const { hasInteriorVowel, progress } = await import('../modules/progress.js');
const { CURRICULUM } = await import('../data/curriculum.js');

describe('hasInteriorVowel()', () => {
  it('accepts CVC and CCVC words with a medial vowel', () => {
    expect(
      hasInteriorVowel({ word: 'cat', graphemes: ['c', 'a', 't'], types: ['c', 'sv', 'c'] }),
    ).toBe(true);
    expect(
      hasInteriorVowel({ word: 'rain', graphemes: ['r', 'ai', 'n'], types: ['c', 'lv', 'c'] }),
    ).toBe(true);
    expect(
      hasInteriorVowel({
        word: 'stop',
        graphemes: ['s', 't', 'o', 'p'],
        types: ['c', 'c', 'sv', 'c'],
      }),
    ).toBe(true);
  });

  it('rejects words whose vowel is the first or last sound', () => {
    expect(hasInteriorVowel({ word: 'car', graphemes: ['c', 'ar'], types: ['c', 'rc'] })).toBe(
      false,
    );
    expect(hasInteriorVowel({ word: 'boy', graphemes: ['b', 'oy'], types: ['c', 'dp'] })).toBe(
      false,
    );
    expect(
      hasInteriorVowel({ word: 'ape', graphemes: ['a', 'p', 'e'], types: ['lv', 'c', 'se'] }),
    ).toBe(false);
    expect(hasInteriorVowel({ word: 'zoo', graphemes: ['z', 'oo'], types: ['c', 'lv'] })).toBe(
      false,
    );
  });
});

describe('middle-sound word selection', () => {
  const middleStages = CURRICULUM.filter((s) => s.recommendedModes?.includes('middle'));

  it('every adaptive pool for mode "middle" contains only interior-vowel words', () => {
    for (const stage of middleStages) {
      const pool = progress.getAdaptivePool(50, {
        mode: 'middle',
        group: stage.group,
        maxLevel: 9,
      });
      const bad = pool.filter((w) => !hasInteriorVowel(w));
      expect(
        bad.map((w) => `${stage.group}:${w.word}`),
        `stage ${stage.group}`,
      ).toEqual([]);
    }
  });

  it('the filter never empties a stage that recommends the mode', () => {
    for (const stage of middleStages) {
      const pool = progress.getAdaptivePool(50, {
        mode: 'middle',
        group: stage.group,
        maxLevel: 9,
      });
      expect(pool.length, `stage ${stage.group}`).toBeGreaterThan(0);
    }
  });

  it('other modes still receive the full stage pool (no over-filtering)', () => {
    const pool = progress.getAdaptivePool(50, { mode: 'first', group: 'rc-ar-or', maxLevel: 9 });
    // "car"-type words (vowel last) are perfectly valid First Sound words.
    expect(pool.some((w) => !hasInteriorVowel(w))).toBe(true);
  });
});

describe('middleSound fallback for replayed words without an interior vowel', () => {
  it('targets a vowel, never the consonant at the absolute middle', async () => {
    // Exercise via the exported setup path indirectly: the fallback logic is
    // internal, so assert through the mode's rendered correct choice.
    globalThis.speechSynthesis = globalThis.speechSynthesis || {
      getVoices: () => [],
      addEventListener: () => {},
      speak: () => {},
      cancel: () => {},
    };
    globalThis.SpeechSynthesisUtterance =
      globalThis.SpeechSynthesisUtterance ||
      class {
        constructor(t) {
          this.text = t;
        }
      };
    const { setupMiddleSound, cleanup } = await import('../modes/middleSound.js');

    document.body.innerHTML = `
      <div class="word-image-wrap"><div id="word-emoji"></div></div>
      <div id="word-display"></div><div id="phoneme-row"></div>
      <div id="mode-area"></div><p id="mode-instruction"></p>
      <button id="btn-check"></button><button id="btn-sayit"></button><button id="btn-skip"></button>
    `;
    const els = {
      wordEmoji: document.getElementById('word-emoji'),
      wordDisplay: document.getElementById('word-display'),
      phonemeRow: document.getElementById('phoneme-row'),
      modeArea: document.getElementById('mode-area'),
      modeInstruction: document.getElementById('mode-instruction'),
      btnCheck: document.getElementById('btn-check'),
      btnSayIt: document.getElementById('btn-sayit'),
      btnSkip: document.getElementById('btn-skip'),
      onResult: () => {},
    };

    // "ape": old fallback picked index 1 → the consonant 'p'.
    const ape = {
      id: 'ape',
      word: 'ape',
      emoji: '🦍',
      group: 'silent-e',
      level: 3,
      graphemes: ['a', 'p', 'e'],
      types: ['lv', 'c', 'se'],
      phonemes: ['a', 'p'],
    };
    setupMiddleSound(ape, els);

    const correctBtn = els.modeArea.querySelector('[data-correct="true"]');
    expect(correctBtn).toBeTruthy();
    // The vowel 'a', not the absolute-middle consonant 'p'.
    expect(correctBtn.dataset.grapheme).toBe('a');
    cleanup();
    document.body.innerHTML = '';
  });
});
