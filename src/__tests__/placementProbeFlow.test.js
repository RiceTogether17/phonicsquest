/**
 * The nonword probe inside the real screener flow.
 *
 * The unit tests pin the item bank and the scoring. This drives
 * `showPlacementTest` itself, because the parts most likely to break are the
 * joins: whether `renderCurrent` dispatches the new `pseudoword` kind at all,
 * whether the B2 block is appended after Gate B, and whether the printed
 * word reaches the DOM without the audio button that would turn the item
 * into the listen-and-choose task Gate B already runs.
 *
 * A wrong dispatch would silently fall through to `renderWordChoice`, which
 * for an item with no `options` renders an empty choice grid — a dead end a
 * child cannot tap past.
 */
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';

let showPlacementTest, GATE_A_ITEMS, GATE_B_ITEMS, PSEUDOWORD_ITEMS;

beforeAll(async () => {
  const synth = {
    getVoices: () => [],
    addEventListener: () => {},
    cancel: () => {},
    speak: () => {},
  };
  globalThis.speechSynthesis = globalThis.speechSynthesis || synth;
  // jsdom has no speech synthesis at all; the screener speaks its prompts.
  class Utterance {
    constructor(text) {
      this.text = text;
    }
  }
  globalThis.SpeechSynthesisUtterance = globalThis.SpeechSynthesisUtterance || Utterance;
  if (globalThis.window) {
    globalThis.window.speechSynthesis = globalThis.window.speechSynthesis || synth;
    globalThis.window.SpeechSynthesisUtterance =
      globalThis.window.SpeechSynthesisUtterance || Utterance;
  }
  ({ showPlacementTest, GATE_A_ITEMS, GATE_B_ITEMS, PSEUDOWORD_ITEMS } =
    await import('../modules/placementTest.js'));
});

/**
 * The screener renders no item id, so the driver tracks the sequence itself.
 * It is deterministic: intake, then Gate A, then Gate B appended on a pass,
 * then the nonword block — one item per tap.
 */
function expectedOrder() {
  return [{ kind: 'intake' }, ...GATE_A_ITEMS, ...GATE_B_ITEMS, ...PSEUDOWORD_ITEMS];
}

/**
 * Choice items advance on a 220ms delay so the child sees their tap land,
 * so a synchronous driver would click the same screen forever. Teacher-scale
 * items answer immediately, which is why Gate A's opening items moved and
 * everything after them did not.
 */
function flush() {
  vi.advanceTimersByTime(400);
}

/**
 * Answer the screener as a strong reader: every teacher scale marked
 * independent, every choice item answered correctly where the bank says
 * what correct is.
 */
function driveScreener(container, { pseudowordScore = 1, maxSteps = 250 } = {}) {
  const order = expectedOrder();
  const seen = [];
  let cursor = 0;

  for (let step = 0; step < maxSteps; step++) {
    if (container.querySelector('#pt-start-btn')) break;

    const pseudo = container.querySelector('.pt-pseudo-word');
    if (pseudo) seen.push(pseudo.textContent.trim());

    const intakeNext = container.querySelector('#pt-intake-next');
    if (intakeNext) {
      intakeNext.click();
      flush();
      cursor += 1;
      continue;
    }

    const scored = [...container.querySelectorAll('[data-score]')];
    if (scored.length) {
      const wanted = pseudo ? String(pseudowordScore) : '1';
      (scored.find((b) => b.dataset.score === wanted) ?? scored.at(-1)).click();
      flush();
      cursor += 1;
      continue;
    }

    const choices = [...container.querySelectorAll('[data-choice]')];
    if (!choices.length) {
      throw new Error(`screener offered no way forward at step ${step}`);
    }
    const correct = order[cursor]?.correct;
    const target = choices.find((b) => b.dataset.choice === correct) ?? choices[0];
    target.click();
    flush();
    cursor += 1;
  }
  return seen;
}

describe('the probe in the live screener', () => {
  let container;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    document.body.innerHTML = '<div id="host"></div>';
    container = document.getElementById('host');
  });

  afterEach(() => vi.useRealTimers());

  it('dispatches the pseudoword kind instead of falling through to word-choice', () => {
    showPlacementTest({ container, profile: { schoolLevel: 'primary' }, onComplete: () => {} });

    // driveScreener throws if any screen has no tappable way forward, which
    // is exactly what a bad dispatch produces.
    const wordsShown = driveScreener(container);

    expect(wordsShown.length, 'the nonword probe never appeared').toBeGreaterThan(0);
    for (const word of wordsShown) {
      expect(PSEUDOWORD_ITEMS.map((i) => i.word)).toContain(word);
    }
    // And the screener still reaches its result screen afterwards.
    expect(container.querySelector('#pt-start-btn')).toBeTruthy();
  });

  it('prints the word and offers no audio — print to sound, not sound to print', () => {
    showPlacementTest({ container, profile: { schoolLevel: 'primary' }, onComplete: () => {} });

    const order = expectedOrder();
    let cursor = 0;
    for (let step = 0; step < 250; step++) {
      if (container.querySelector('#pt-start-btn')) break;
      if (container.querySelector('.pt-pseudo-word')) {
        expect(container.querySelector('#pt-listen'), 'probe must not speak the word').toBeNull();
        expect(container.querySelector('.pt-teacher-badge')).toBeTruthy();
        expect(container.querySelectorAll('[data-score]').length).toBe(3);
        return;
      }
      const intakeNext = container.querySelector('#pt-intake-next');
      if (intakeNext) {
        intakeNext.click();
        flush();
        cursor += 1;
        continue;
      }
      const scored = [...container.querySelectorAll('[data-score]')];
      if (scored.length) {
        scored.at(-1).click();
        flush();
        cursor += 1;
        continue;
      }
      const choices = [...container.querySelectorAll('[data-choice]')];
      const correct = order[cursor]?.correct;
      (choices.find((b) => b.dataset.choice === correct) ?? choices[0])?.click();
      flush();
      cursor += 1;
    }
    throw new Error('never reached the nonword probe');
  });
});
