import { beforeEach, describe, expect, it } from 'vitest';
import { MCQ_ROUND_SIZE } from '../constants.js';
import { store } from '../modules/store.js';
import * as grammarMcq from '../modes/grammarMcq.js';
import * as vocabMcq from '../modes/vocabMcq.js';

/**
 * A round has to be something a child can finish.
 *
 * Both MCQ modes used to serve the entire filtered bank as one session: on a
 * P4 profile, "Start P4 (All Skills)" opened at `1/2929`. There was no end, no
 * summary screen reachable by playing, and a progress bar that moved 0.03% per
 * question.
 *
 * The modes are imported statically on purpose. Resetting modules between
 * tests would give each mode its own copy of the store, so `paperItemLimit`
 * set here would never reach the mode under test.
 */

globalThis.speechSynthesis ||= {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
  paused: false,
  resume: () => {},
};

function mount() {
  document.body.innerHTML = '<div id="host"></div>';
  return document.getElementById('host');
}

/**
 * Start a round and click past any teach-before-practice rule card, which
 * renders in place of the first question the first time a category is met.
 */
function startRound(mode, level) {
  const host = mount();
  if (mode === grammarMcq) {
    grammarMcq.initGrammarMcq(host, () => {});
    grammarMcq.startGrammarMcqLevel(level);
  } else {
    vocabMcq.initVocabMcq(host, () => {});
    vocabMcq.startVocabMcqLevel(level);
  }
  for (let i = 0; i < 5; i++) {
    const card = document.querySelector('.mcq-rule-card button');
    if (!card) break;
    card.click();
  }
}

/** Read the total out of the round's "3 / 10" progress chip. */
function roundLength() {
  const text = document.querySelector('.sfq-progress')?.textContent || '';
  const match = text.match(/(\d+)\s*\/\s*(\d+)/);
  return match ? Number(match[2]) : null;
}

beforeEach(() => {
  store.set('paperItemLimit', null);
  store.set('lessonsSeen', {});
});

describe('MCQ round length', () => {
  it('is a finishable default, not the whole bank', () => {
    startRound(grammarMcq, 'P4');

    expect(roundLength()).toBe(MCQ_ROUND_SIZE);
    expect(document.querySelectorAll('[data-choice]').length).toBeGreaterThan(0);
  });

  it('applies to Vocabulary MCQ too', () => {
    startRound(vocabMcq, 'P4');
    expect(roundLength()).toBe(MCQ_ROUND_SIZE);
  });

  it('still honours a Paper Mode override', () => {
    store.set('paperItemLimit', 3);
    startRound(grammarMcq, 'P4');
    expect(roundLength()).toBe(3);
  });

  it('consumes the override so the next round is a normal length', () => {
    store.set('paperItemLimit', 3);
    startRound(grammarMcq, 'P4');
    expect(store.get('paperItemLimit')).toBeNull();

    startRound(grammarMcq, 'P4');
    expect(roundLength()).toBe(MCQ_ROUND_SIZE);
  });

  it('never serves more questions than the bank holds', () => {
    startRound(grammarMcq, 'P1');
    const available = grammarMcq.countItemsForScope({ level: 'P1' });

    expect(roundLength()).toBeLessThanOrEqual(Math.min(MCQ_ROUND_SIZE, available));
  });
});
