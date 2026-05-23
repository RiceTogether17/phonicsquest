/**
 * Phonemic-awareness modes must stay sound-first: no printed word during
 * the question phase, no bare-letter choice buttons. These tests are the
 * regression guard for the PA/phonics split called out in the architecture
 * review.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// jsdom does not implement Web Speech / Web Audio. Stub the bare minimum
// before importing anything that pulls in the audio module.
globalThis.speechSynthesis = globalThis.speechSynthesis || {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
};
globalThis.SpeechSynthesisUtterance = globalThis.SpeechSynthesisUtterance || class { constructor(text){ this.text = text; } };
if (!globalThis.AudioContext) {
  globalThis.AudioContext = class {
    constructor() {}
    createOscillator() { return { connect() {}, start() {}, stop() {} }; }
    createGain()       { return { connect() {}, gain: { value: 0 } }; }
  };
}

const { renderPhonemeChoiceGrid } = await import('../components/phonemeChoice.js');
const { store } = await import('../modules/store.js');
// Silence the audio side-effects so the test output stays clean.
store.set('sfxEnabled', false);

const baseEls = () => {
  document.body.innerHTML = `
    <div id="word-emoji"></div>
    <div id="word-display"></div>
    <div id="phoneme-row"></div>
    <div id="mode-area"></div>
    <p id="mode-instruction"></p>
    <button id="btn-check"></button>
    <button id="btn-sayit"></button>
    <button id="btn-skip"></button>
  `;
  return {
    wordEmoji:       document.getElementById('word-emoji'),
    wordDisplay:     document.getElementById('word-display'),
    phonemeRow:      document.getElementById('phoneme-row'),
    modeArea:        document.getElementById('mode-area'),
    modeInstruction: document.getElementById('mode-instruction'),
    btnCheck:        document.getElementById('btn-check'),
    btnSayIt:        document.getElementById('btn-sayit'),
    btnSkip:         document.getElementById('btn-skip'),
    onResult:        vi.fn(),
  };
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('renderPhonemeChoiceGrid()', () => {
  const choices = [
    { grapheme: 'k', type: 'c', correct: true  },
    { grapheme: 'm', type: 'c', correct: false },
    { grapheme: 's', type: 'c', correct: false },
    { grapheme: 't', type: 'c', correct: false },
  ];

  it('renders one button per choice with phoneme notation, never bare uppercase letters', () => {
    const container = document.createElement('div');
    renderPhonemeChoiceGrid(container, choices, { autoPlay: false });

    const buttons = container.querySelectorAll('.choice-btn--phoneme');
    expect(buttons).toHaveLength(4);

    const labels = [...container.querySelectorAll('.choice-btn-phoneme')].map(el => el.textContent);
    expect(labels).toEqual(['/k/', '/m/', '/s/', '/t/']);
    // No bare uppercase letter labels — those would be print contamination.
    expect(labels.every(l => l.startsWith('/') && l.endsWith('/'))).toBe(true);
  });

  it('marks the correct option via dataset.correct so the existing reveal flow keeps working', () => {
    const container = document.createElement('div');
    renderPhonemeChoiceGrid(container, choices, { autoPlay: false });

    const buttons = [...container.querySelectorAll('.choice-btn--phoneme')];
    expect(buttons.filter(b => b.dataset.correct === 'true')).toHaveLength(1);
    expect(buttons.find(b => b.dataset.correct === 'true').dataset.grapheme).toBe('k');
  });

  it('includes a speaker affordance so the button reads as a sound, not a letter', () => {
    const container = document.createElement('div');
    renderPhonemeChoiceGrid(container, choices, { autoPlay: false });
    const speakers = container.querySelectorAll('.choice-btn-speaker');
    expect(speakers).toHaveLength(4);
    for (const sp of speakers) expect(sp.getAttribute('aria-hidden')).toBe('true');
  });

  it('invokes onChoose with the choice and the clicked button', () => {
    const container = document.createElement('div');
    const onChoose  = vi.fn();
    renderPhonemeChoiceGrid(container, choices, { autoPlay: false, onChoose });

    const second = container.querySelectorAll('.choice-btn--phoneme')[1];
    second.click();
    expect(onChoose).toHaveBeenCalledTimes(1);
    expect(onChoose.mock.calls[0][0]).toEqual(choices[1]);
    expect(onChoose.mock.calls[0][1]).toBe(second);
  });

  it('ignores autoplay errors so a failing audio backend cannot break the question', async () => {
    const container = document.createElement('div');
    // Helper auto-plays via audio.speakPhoneme; in jsdom this returns without
    // throwing because sfx playback degrades gracefully. We just need to
    // confirm that mounting + advancing timers does not throw.
    renderPhonemeChoiceGrid(container, choices, { autoPlay: true, autoPlayDelay: 10, autoPlayStride: 10 });
    await vi.advanceTimersByTimeAsync(200);
    expect(container.querySelectorAll('.choice-btn--phoneme')).toHaveLength(4);
  });

  it('defers choice previews until autoPlayAfter resolves so the word and phonemes never overlap', async () => {
    const { audio } = await import('../modules/audio.js');
    const spy = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();

    let resolveGate;
    const gate = new Promise(r => { resolveGate = r; });

    const container = document.createElement('div');
    renderPhonemeChoiceGrid(container, choices, {
      autoPlay: true,
      autoPlayDelay: 0,
      autoPlayStride: 10,
      autoPlayAfter: gate,
    });

    // While the gate is unresolved, no choice phonemes should have been spoken,
    // regardless of how much wall-clock time has passed.
    await vi.advanceTimersByTimeAsync(500);
    expect(spy).not.toHaveBeenCalled();

    // After the gate resolves the previews queue up.
    resolveGate();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(100);
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});

describe('PA modes hold the choice previews past the word audio even when TTS resolves early', () => {
  /**
   * Regression guard for the iOS Safari quirk where speakWord's Promise can
   * settle before the audio buffer actually finishes outputting. Each PA
   * mode now waits on `Promise.all([ttsDone, floorHold])` where floorHold
   * is a wall-clock duration proportional to the word length. This test
   * makes speakWord resolve instantly and confirms the gate still holds
   * for the floor duration.
   */
  async function runHoldTest(modeName, setupName, wordId) {
    const { audio } = await import('../modules/audio.js');
    const mod = await import(`../modes/${modeName}.js`);
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === wordId);
    const els  = baseEls();

    // Make every audio call complete instantly so the only thing holding
    // the gate is the wall-clock floor.
    const speakWordSpy    = vi.spyOn(audio, 'speakWord').mockResolvedValue();
    const speakPhonemeSpy = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();

    mod[setupName](word, els);

    // Within the first 500ms the speakWord setTimeout has barely fired —
    // the gate must NOT have lifted yet. No phoneme previews allowed.
    await vi.advanceTimersByTimeAsync(500);
    expect(speakPhonemeSpy, `${modeName}: phoneme played within 500ms`).not.toHaveBeenCalled();

    // The floor for a short word is ~1100ms PLUS the 600ms autoPlayDelay
    // PLUS the 350ms pre-speak delay → previews should not begin until ~2.0s.
    await vi.advanceTimersByTimeAsync(800);
    expect(speakPhonemeSpy, `${modeName}: phoneme played at 1.3s, still inside floor`).not.toHaveBeenCalled();

    // After the floor + autoPlay delay we expect at least one preview to run.
    await vi.advanceTimersByTimeAsync(1500);
    expect(speakPhonemeSpy, `${modeName}: phoneme should have played after the floor`).toHaveBeenCalled();

    speakWordSpy.mockRestore();
    speakPhonemeSpy.mockRestore();
  }

  it('firstSound holds previews past the wall-clock floor even when TTS reports done', async () => {
    await runHoldTest('firstSound', 'setupFirstSound', 'cat');
  });

  it('lastSound holds previews past the wall-clock floor even when TTS reports done', async () => {
    await runHoldTest('lastSound', 'setupLastSound', 'cat');
  });

  it('middleSound holds previews past the wall-clock floor even when TTS reports done', async () => {
    await runHoldTest('middleSound', 'setupMiddleSound', 'cat');
  });
});

describe('first/last/middle sound modes hide print during the question', () => {
  it('firstSound never shows the printed word until after a choice', async () => {
    const { setupFirstSound } = await import('../modes/firstSound.js');
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === 'cat');
    const els  = baseEls();

    setupFirstSound(word, els);

    // Word display must be empty during the question.
    expect(els.wordDisplay.innerHTML.trim()).toBe('');
    // Choice buttons must not contain the bare letter 'C'.
    const labels = [...els.modeArea.querySelectorAll('.choice-btn-phoneme')].map(e => e.textContent);
    expect(labels.length).toBe(4);
    expect(labels).toContain('/c/');
    for (const label of labels) {
      expect(label).toMatch(/^\/[a-z]+\/$/); // /lowercase-only/
    }
  });

  it('lastSound never shows the printed word until after a choice', async () => {
    const { setupLastSound } = await import('../modes/lastSound.js');
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === 'cat');
    const els  = baseEls();

    setupLastSound(word, els);
    expect(els.wordDisplay.innerHTML.trim()).toBe('');
    expect(els.modeArea.querySelectorAll('.choice-btn--phoneme')).toHaveLength(4);
  });

  it('middleSound never shows the printed word until after a choice', async () => {
    const { setupMiddleSound } = await import('../modes/middleSound.js');
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === 'cat');
    const els  = baseEls();

    setupMiddleSound(word, els);
    expect(els.wordDisplay.innerHTML.trim()).toBe('');
    expect(els.modeArea.querySelectorAll('.choice-btn--phoneme')).toHaveLength(4);
  });
});

describe('missingSound distractors respect the target word\'s level', () => {
  it('only offers graphemes that appear in some word at or below the target word\'s level', async () => {
    const { setupMissingSound } = await import('../modes/missingSound.js');
    const { WORDS } = await import('../data/words.js');

    // 'cat' is a level-1 CVC word. A level-1 learner must not be shown
    // distractor graphemes that only exist in level-2 or level-3 words
    // (e.g. 'oo', 'ar', 'igh').
    const word = WORDS.find(w => w.id === 'cat');
    expect(word?.level).toBe(1);

    const levelOneGraphemes = new Set();
    for (const w of WORDS.filter(w => w.level <= word.level)) {
      for (const g of w.graphemes) levelOneGraphemes.add(g);
    }

    // Run the setup several times so we exercise the random selection.
    for (let trial = 0; trial < 10; trial++) {
      const els = baseEls();
      setupMissingSound(word, els);
      const buttons = [...els.modeArea.querySelectorAll('.choice-btn')];
      expect(buttons).toHaveLength(4);
      for (const btn of buttons) {
        expect(levelOneGraphemes.has(btn.textContent)).toBe(true);
      }
    }
  });
});

describe('phonemic-awareness modes have a sufficient word pool', () => {
  /**
   * Children need varied practice on first/last/middle sound — including
   * long vowels and diphthongs, not just short-vowel CVC words. These
   * floors lock in the pool depth so a future curriculum refactor can't
   * silently drop the vowel-initial words and leave the modes asking
   * "what does ape start with?" with no answer pool to draw from.
   *
   * Numbers are conservative — well below the actual count, just enough
   * that the modes can always assemble a real adaptive sample.
   */
  const PA_EXCLUDED = new Set(['sight-highfreq', 'multisyllable', 'prefixes', 'suffixes-advanced']);
  const VOWEL_TYPES = new Set(['sv', 'lv', 'rc', 'dp']);

  /** Replicates the middle-index logic used by setupMiddleSound. */
  function middleIdx(word) {
    const minI = word.graphemes.length > 2 ? 1 : 0;
    const maxI = word.graphemes.length > 2 ? word.graphemes.length - 2 : word.graphemes.length - 1;
    for (let i = minI; i <= maxI; i++) {
      if (VOWEL_TYPES.has(word.types[i])) return i;
    }
    return Math.floor(word.graphemes.length / 2);
  }

  let pool;
  beforeEach(async () => {
    const { WORDS } = await import('../data/words.js');
    pool = WORDS.filter(w => !PA_EXCLUDED.has(w.group) && w.pattern !== 'sight');
  });

  it('overall PA-eligible pool is deep enough to keep questions fresh across a session', () => {
    // Each session can play 30+ items; the pool must dwarf that several times
    // over so the adaptive sampler isn't forced to repeat too aggressively.
    expect(pool.filter(w => w.level === 1).length).toBeGreaterThanOrEqual(150);
    expect(pool.filter(w => w.level === 2).length).toBeGreaterThanOrEqual(300);
    expect(pool.filter(w => w.level === 3).length).toBeGreaterThanOrEqual(120);
  });

  it('first-sound mode can practise long vowels and diphthongs, not just consonants', () => {
    const lvFirst = pool.filter(w => w.types[0] === 'lv');
    const dpFirst = pool.filter(w => w.types[0] === 'dp');
    const rcFirst = pool.filter(w => w.types[0] === 'rc');
    // Need at least one correct word + three distractors per round; with
    // adaptive replay we want a comfortable surplus over that floor of 4.
    expect(lvFirst.length).toBeGreaterThanOrEqual(10);
    expect(dpFirst.length).toBeGreaterThanOrEqual(4);
    expect(rcFirst.length).toBeGreaterThanOrEqual(4);
  });

  it('last-sound mode has a non-trivial diphthong and long-vowel pool', () => {
    const lvLast = pool.filter(w => w.types[w.types.length - 1] === 'lv');
    const dpLast = pool.filter(w => w.types[w.types.length - 1] === 'dp');
    expect(lvLast.length).toBeGreaterThanOrEqual(30);
    expect(dpLast.length).toBeGreaterThanOrEqual(10);
  });

  it('middle-sound mode has plenty of long-vowel and diphthong medial words', () => {
    const lvMid = pool.filter(w => w.types[middleIdx(w)] === 'lv');
    const dpMid = pool.filter(w => w.types[middleIdx(w)] === 'dp');
    expect(lvMid.length).toBeGreaterThanOrEqual(150);
    expect(dpMid.length).toBeGreaterThanOrEqual(30);
  });
});

describe('soundCount mode hides the printed word during the question', () => {
  it('does not render the printed word on setup', async () => {
    const { setupSoundCount } = await import('../modes/soundCount.js');
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === 'cake'); // silent-e: phoneme≠grapheme count
    const els  = baseEls();

    setupSoundCount(word, els);
    // If the printed word were rendered, wordDisplay would contain letter
    // tiles. Counting letters instead of sounds would give the wrong answer
    // for cake (4 letters, 3 sounds).
    expect(els.wordDisplay.innerHTML.trim()).toBe('');
  });

  it('reveals the printed word after the child commits a choice', async () => {
    const { setupSoundCount } = await import('../modes/soundCount.js');
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === 'cat');
    const els  = baseEls();

    setupSoundCount(word, els);
    expect(els.wordDisplay.innerHTML.trim()).toBe('');

    // Simulate the child picking any answer.
    const btn = els.modeArea.querySelector('.choice-btn--count');
    btn.click();

    // wordDisplay is populated by buildWordAnimation() in the reveal path.
    expect(els.wordDisplay.innerHTML.trim()).not.toBe('');
  });
});
