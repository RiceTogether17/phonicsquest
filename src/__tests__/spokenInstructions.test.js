/**
 * A child who can't read yet must still be able to play the early games.
 *
 * Guards:
 *  1. Every phonics game has a spoken instruction written for listening.
 *  2. The mini-lesson reads itself aloud, without a button press.
 *  3. Sound choices can be heard again after the first preview.
 *  4. Middle Sound never asks about a word whose vowel is its first or last
 *     sound, like "ash" (a-sh).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

globalThis.speechSynthesis = globalThis.speechSynthesis || {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
};
globalThis.SpeechSynthesisUtterance =
  globalThis.SpeechSynthesisUtterance ||
  class {
    constructor(text) {
      this.text = text;
    }
  };

const { MODES } = await import('../modes/index.js');
const { SPOKEN_INSTRUCTIONS, LISTENING_MODES, spokenInstructionFor } =
  await import('../modules/spokenInstructions.js');
const { audio } = await import('../modules/audio.js');
const { renderPhonemeChoiceGrid } = await import('../components/phonemeChoice.js');
const { showMiniLesson } = await import('../components/miniLesson.js');
const { getPhonicsLesson } = await import('../data/lessons/phonicsLessons.js');
const { CURRICULUM } = await import('../data/curriculum.js');
const { WORDS } = await import('../data/words.js');
const { nextPaWord, createPaSequencerState } = await import('../modules/paTargetSequencer.js');

const flush = () => new Promise((r) => setTimeout(r, 0));

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('spoken game instructions', () => {
  it('has a spoken line for every phonics game', () => {
    for (const key of Object.keys(MODES)) {
      expect(SPOKEN_INSTRUCTIONS[key], `${key} needs a spoken instruction`).toEqual(
        expect.any(String),
      );
    }
  });

  it('writes each line for listening: no symbols, and it says what to tap or do', () => {
    for (const [key, line] of Object.entries(SPOKEN_INSTRUCTIONS)) {
      expect(line, key).not.toMatch(/[/…—]|\p{Extended_Pictographic}/u);
      expect(line, key).toMatch(/\b(tap|say|clap|put)\b/i);
    }
  });

  it('only lists real games as listening games', () => {
    for (const key of LISTENING_MODES) expect(MODES[key], key).toBeTruthy();
  });

  it('falls back to the printed line with symbols removed', () => {
    expect(spokenInstructionFor('not-a-mode', '🗣️ Listen… what is the /m/ word?')).toBe(
      'Listen what is the m word?',
    );
  });
});

describe('mini-lesson narration', () => {
  const stage = CURRICULUM.find((s) => s.id === 'cvc-a') || CURRICULUM[0];
  const lesson = getPhonicsLesson(stage.id);

  beforeEach(() => {
    vi.spyOn(audio, 'speakText').mockResolvedValue(undefined);
    vi.spyOn(audio, 'speakPhoneme').mockResolvedValue(undefined);
    vi.spyOn(audio, 'speakWordStretched').mockResolvedValue(undefined);
  });

  it('reads the lesson aloud as soon as it opens', async () => {
    showMiniLesson({ stage, lesson, onDone: () => {} });
    for (let i = 0; i < lesson.script.length + 2; i++) await flush();

    const spoken = audio.speakText.mock.calls.map((c) => c[0]);
    expect(spoken).toEqual([lesson.headline, ...lesson.script]);
  });

  it('stops reading when the child taps a sound chip', async () => {
    let finishLine;
    audio.speakText.mockImplementation(() => new Promise((r) => (finishLine = r)));
    showMiniLesson({ stage, lesson, onDone: () => {} });
    await flush();
    expect(audio.speakText).toHaveBeenCalledTimes(1);

    document.querySelector('[data-chip]').click();
    finishLine();
    await flush();
    await flush();
    expect(audio.speakText).toHaveBeenCalledTimes(1);
    expect(audio.speakPhoneme).toHaveBeenCalled();
  });

  it('tells the child what to do on the "read one together" step', async () => {
    showMiniLesson({ stage, lesson, onDone: () => {} });
    document.getElementById('mini-lesson-next').click();
    await flush();

    const spoken = audio.speakText.mock.calls.map((c) => c[0]);
    expect(spoken).toContain("Let's read one together!");
    expect(spoken.at(-1)).toMatch(/Blend it with Giri/);
  });
});

describe('hearing the sound choices again', () => {
  const choices = [
    { grapheme: 'k', type: 'c', correct: true },
    { grapheme: 'm', type: 'c', correct: false },
    { grapheme: 's', type: 'c', correct: false },
  ];

  it('replays every option in order without choosing one', async () => {
    vi.useFakeTimers();
    const speak = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue(undefined);
    const onChoose = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderPhonemeChoiceGrid(container, choices, { onChoose, autoPlay: false });

    container.querySelector('.choice-replay').click();
    await vi.runAllTimersAsync();

    expect(speak.mock.calls.map((c) => c[0])).toEqual(['k', 'm', 's']);
    expect(onChoose).not.toHaveBeenCalled();
  });

  it('keeps the replay control out of the answer buttons', () => {
    const container = document.createElement('div');
    renderPhonemeChoiceGrid(container, choices, { autoPlay: false });
    expect(container.querySelector('.choice-replay').classList.contains('choice-btn')).toBe(false);
    expect(container.querySelectorAll('.choice-btn')).toHaveLength(3);
  });
});

describe('Middle Sound word choice', () => {
  it('never picks a word without a vowel between its first and last sounds', () => {
    const groups = [...new Set(WORDS.map((w) => w.group))];
    for (const group of groups) {
      const state = createPaSequencerState();
      for (let i = 0; i < 30; i++) {
        const word = nextPaWord(state, { mode: 'middle', group, maxLevel: 99, wordList: WORDS });
        if (!word) break;
        const inner = word.types.slice(1, -1);
        expect(word.types.length, `${word.word} in ${group}`).toBeGreaterThan(2);
        expect(
          inner.some((t) => ['sv', 'lv', 'rc', 'dp'].includes(t)),
          `${word.word} in ${group}`,
        ).toBe(true);
      }
    }
  });

  it('skips "ash" in the short-a stage', () => {
    const state = createPaSequencerState();
    const seen = new Set();
    for (let i = 0; i < 200; i++) {
      const w = nextPaWord(state, {
        mode: 'middle',
        group: 'short-a',
        maxLevel: 99,
        wordList: WORDS,
      });
      if (w) seen.add(w.word);
    }
    expect(seen.size).toBeGreaterThan(0);
    expect(seen.has('ash')).toBe(false);
  });
});
