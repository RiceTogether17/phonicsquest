/**
 * First Sound must be playable beyond phase-1 CVC: initial-blend, final-blend,
 * digraph, CCVCC and long-vowel stages all offer it, and the sequencer +
 * distractor pipeline handle multi-letter first graphemes (sh, fl, …).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { CURRICULUM, PHASES } from '../src/data/curriculum.js';
import { getStagesForMode } from '../src/modules/phonicsProgression.js';
import { createPaSequencerState, nextPaWord } from '../src/modules/paTargetSequencer.js';
import { WORDS } from '../src/data/words.js';

// firstSound.js pulls in audio.js, which touches speechSynthesis at import.
let getFirstSoundDistractors;
beforeAll(async () => {
  const synth = {
    getVoices: () => [],
    addEventListener: () => {},
    cancel: () => {},
    speak: () => {},
  };
  globalThis.speechSynthesis = globalThis.speechSynthesis || synth;
  if (globalThis.window) window.speechSynthesis = window.speechSynthesis || synth;
  ({ getFirstSoundDistractors } = await import('../src/modes/firstSound.js'));
});

describe('First Sound stage access', () => {
  it('offers stages from phases 1 through 6, not just CVC', () => {
    const stages = getStagesForMode('first', CURRICULUM, PHASES);
    const phases = new Set(stages.map((s) => s.phase));
    for (const p of [1, 2, 3, 4, 5, 6]) {
      expect(phases.has(p), `phase ${p} missing from First Sound picker`).toBe(true);
    }
  });

  it('sequences digraph-stage words with the digraph as the target', () => {
    const state = createPaSequencerState();
    const word = nextPaWord(state, {
      mode: 'first',
      group: 'digraphs',
      maxLevel: 9,
      wordList: WORDS,
    });
    expect(word).toBeTruthy();
    expect(word.group).toBe('digraphs');
  });

  it('sequences blend-stage words (ccvc-a structural set)', () => {
    const state = createPaSequencerState();
    const word = nextPaWord(state, {
      mode: 'first',
      group: 'blends',
      maxLevel: 9,
      wordList: WORDS,
    });
    expect(word).toBeTruthy();
  });

  it('builds 3 usable distractors for a digraph first sound (sh)', () => {
    const distractors = getFirstSoundDistractors('sh', 'd', 9);
    expect(distractors.length).toBeGreaterThanOrEqual(3);
    expect(distractors.every((d) => d.grapheme !== 'sh')).toBe(true);
  });

  it('builds 3 usable distractors for a blend first sound (fl)', () => {
    const distractors = getFirstSoundDistractors('fl', 'bl', 9);
    expect(distractors.length).toBeGreaterThanOrEqual(3);
    expect(distractors.every((d) => d.grapheme !== 'fl')).toBe(true);
  });
});
