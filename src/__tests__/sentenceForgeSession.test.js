/**
 * Sentence Forge session behaviour, driven through the real mode module.
 *
 * These pin the three session bugs a child would actually feel: a round with
 * no end, being scored twice for one sentence, and having no way out when
 * stuck.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// The mode's audio layer touches these at import time.
globalThis.speechSynthesis = {
  getVoices: () => [],
  addEventListener() {},
  speak() {},
  cancel() {},
  paused: false,
  resume: () => {},
};
globalThis.SpeechSynthesisUtterance = function SpeechSynthesisUtteranceStub() {
  return {};
};
// jsdom has no Web Audio; the sfx layer constructs one per sound effect.
if (!globalThis.AudioContext) {
  globalThis.AudioContext = class {
    createOscillator() {
      return { connect() {}, start() {}, stop() {}, frequency: { value: 0 } };
    }
    createGain() {
      return {
        connect() {},
        gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
      };
    }
    get destination() {
      return {};
    }
    get currentTime() {
      return 0;
    }
  };
}

let store;
let questMastery;
let sf;
let SENTENCE_FORGE_ROUND_SIZE;

beforeAll(async () => {
  ({ store } = await import('../modules/store.js'));
  ({ questMastery } = await import('../modules/questMastery.js'));
  ({ SENTENCE_FORGE_ROUND_SIZE } = await import('../constants.js'));
  sf = await import('../modes/sentenceForge.js');
});

function mount() {
  document.body.innerHTML = '<div id="host"></div>';
  sf.initSentenceForge(document.getElementById('host'), () => {});
}

function startLevel(level = 1) {
  mount();
  sf.showSentenceBrowser();
  document.querySelector(`.sfq-level-btn[data-level="${level}"]`)?.click();
  // Step past the skill-clue panel if this sentence has one.
  document.getElementById('sfq-skill-clue-go')?.click();
}

/** Submit a deliberately wrong order (the bank, reversed). */
function submitWrong() {
  document.getElementById('sfq-clear')?.click();
  const chips = [...document.querySelectorAll('#sfq-bank .sfq-word-chip:not([disabled])')];
  chips.reverse().forEach((chip) => chip.click());
  document.getElementById('sfq-check')?.click();
}

beforeEach(() => {
  store.set('sfqCompleted', {});
  store.set('sfqCompletedBySentence', {});
  store.set('questMastery', {});
  vi.restoreAllMocks();
});

describe('Sentence Forge session', () => {
  it('serves a round a child can finish, not the whole bank', () => {
    startLevel(1);
    const progress = document.querySelector('.sfq-progress')?.textContent || '';
    const total = Number(progress.split('/')[1]?.trim());
    expect(total).toBe(SENTENCE_FORGE_ROUND_SIZE);
  });

  it('scores a sentence once, even after the teach-back resets the retry ladder', async () => {
    const spy = vi.spyOn(questMastery, 'recordAttempt');
    startLevel(1);

    submitWrong();
    const afterFirst = spy.mock.calls.length;
    expect(afterFirst, 'the first attempt is the mark').toBeGreaterThan(0);

    submitWrong(); // second wrong → teach-back
    expect(spy.mock.calls.length, 'a retry is not a second mark').toBe(afterFirst);

    await new Promise((resolve) => setTimeout(resolve, 1300));
    expect(document.getElementById('sfq-teachback-overlay')).toBeTruthy();

    // "Got it" clears the hint ladder — but must not reopen the scoring.
    document.getElementById('sfq-tb-got-it')?.click();
    submitWrong();
    expect(
      spy.mock.calls.length,
      'the same sentence must never be recorded against mastery twice',
    ).toBe(afterFirst);
  });

  it('shows a stuck child the sentence instead of looping forever', async () => {
    startLevel(1);
    for (let i = 0; i < 2; i += 1) submitWrong();
    await new Promise((resolve) => setTimeout(resolve, 1300));
    document.getElementById('sfq-tb-got-it')?.click();

    // Keep failing past the teach-back.
    for (let i = 0; i < 3; i += 1) submitWrong();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const reveal = document.querySelector('.sfq-reveal-answer');
    expect(reveal, 'the answer must eventually be shown').toBeTruthy();
    expect(reveal.textContent.trim().length).toBeGreaterThan(0);
    expect(document.getElementById('sfq-reveal-next')).toBeTruthy();
  });

  it('a revealed sentence is not counted as progress', async () => {
    startLevel(1);
    for (let i = 0; i < 2; i += 1) submitWrong();
    await new Promise((resolve) => setTimeout(resolve, 1300));
    document.getElementById('sfq-tb-got-it')?.click();
    for (let i = 0; i < 3; i += 1) submitWrong();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(document.querySelector('.sfq-reveal-answer')).toBeTruthy();
    const bySentence = store.get('sfqCompletedBySentence') || {};
    expect(Object.keys(bySentence[1] || {})).toEqual([]);
  });
});
