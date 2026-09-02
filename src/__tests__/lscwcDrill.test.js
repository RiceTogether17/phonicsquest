import { describe, it, expect, beforeEach, vi } from 'vitest';

// lscwcDrill → audio → speechSynthesis: jsdom does not provide it.
// Also pre-seed input mode to 'tap' so the orchestration tests can drive
// the bank-tile path. The module reads this once at import time.
vi.hoisted(() => {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text;
      this.rate = 1;
      this.pitch = 1;
      this.volume = 1;
    }
    addEventListener() {}
  };
  // localStorage is available under jsdom before module imports resolve.
  try {
    globalThis.localStorage?.setItem('lscwc_input_mode', 'tap');
  } catch {}
});

const {
  _validateLetter,
  _shuffleLetters,
  _logAttempt,
  _readStats,
  startLscwcDrill,
  cleanupLscwcDrill,
} = await import('../modes/lscwcDrill.js');

const STATS_KEY = 'lscwc_stats';
const INPUT_MODE_KEY = 'lscwc_input_mode';

describe('_validateLetter', () => {
  it('accepts the correct next letter (case-insensitive)', () => {
    expect(_validateLetter('cat', '', 'c')).toBe('correct');
    expect(_validateLetter('cat', '', 'C')).toBe('correct');
    expect(_validateLetter('cat', 'c', 'a')).toBe('correct');
    expect(_validateLetter('cat', 'ca', 't')).toBe('correct');
  });

  it('rejects a wrong next letter', () => {
    expect(_validateLetter('cat', '', 'b')).toBe('wrong');
    expect(_validateLetter('cat', 'c', 'b')).toBe('wrong');
  });

  it('rejects extra input past the target length', () => {
    expect(_validateLetter('cat', 'cat', 's')).toBe('wrong');
  });

  it('returns wrong for non-string inputs', () => {
    expect(_validateLetter(null, '', 'a')).toBe('wrong');
    expect(_validateLetter('cat', null, 'c')).toBe('wrong');
    expect(_validateLetter('cat', '', null)).toBe('wrong');
  });
});

describe('_shuffleLetters', () => {
  it('contains exactly the letters of the word', () => {
    const letters = _shuffleLetters('hello');
    expect(letters.sort().join('')).toBe('ehllo');
  });

  it('preserves duplicate letters', () => {
    const letters = _shuffleLetters('all');
    expect(letters.filter((l) => l === 'l').length).toBe(2);
    expect(letters.filter((l) => l === 'a').length).toBe(1);
  });

  it('lowercases the input', () => {
    const letters = _shuffleLetters('HELLO');
    expect(letters.every((l) => l === l.toLowerCase())).toBe(true);
  });

  it('uses the supplied RNG deterministically', () => {
    // Fixed RNG: cycles 0.5 then 0.0 then 0.9 …
    let i = 0;
    const seq = [0.1, 0.4, 0.7, 0.2, 0.5];
    const rng = () => seq[i++ % seq.length];
    const a = _shuffleLetters('abcde', rng);
    i = 0;
    const b = _shuffleLetters('abcde', rng);
    expect(a).toEqual(b);
  });

  it('handles empty and single-letter words', () => {
    expect(_shuffleLetters('')).toEqual([]);
    expect(_shuffleLetters('a')).toEqual(['a']);
  });
});

describe('_logAttempt + _readStats', () => {
  beforeEach(() => {
    localStorage.removeItem(STATS_KEY);
  });

  it('initialises an entry on first attempt', () => {
    _logAttempt('cat', true);
    const stats = _readStats();
    expect(stats.cat.attempts).toBe(1);
    expect(stats.cat.correct).toBe(1);
    expect(typeof stats.cat.lastTs).toBe('number');
  });

  it('increments attempts and correct separately', () => {
    _logAttempt('dog', false);
    _logAttempt('dog', false);
    _logAttempt('dog', true);
    const stats = _readStats();
    expect(stats.dog.attempts).toBe(3);
    expect(stats.dog.correct).toBe(1);
  });

  it('keys by lowercased word', () => {
    _logAttempt('Apple', true);
    _logAttempt('APPLE', false);
    const stats = _readStats();
    expect(stats.apple.attempts).toBe(2);
    expect(stats.apple.correct).toBe(1);
    expect(stats.Apple).toBeUndefined();
  });

  it('caps the number of distinct words at 200 (oldest by lastTs dropped)', () => {
    // Pre-populate 200 words with ascending timestamps.
    const stats = {};
    for (let i = 0; i < 200; i++) {
      stats[`word${i}`] = { attempts: 1, correct: 1, lastTs: i };
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));

    _logAttempt('newest', true);
    const out = _readStats();
    expect(Object.keys(out).length).toBe(200);
    expect(out.word0).toBeUndefined(); // oldest dropped
    expect(out.word199).toBeDefined(); // recent kept
    expect(out.newest).toBeDefined(); // new entry kept
  });
});

describe('startLscwcDrill — orchestration', () => {
  let host;
  beforeEach(() => {
    document.body.innerHTML = '';
    host = document.createElement('div');
    document.body.appendChild(host);
    localStorage.removeItem(STATS_KEY);
    localStorage.setItem(INPUT_MODE_KEY, 'tap'); // deterministic input mode for tests
  });

  it('renders the Look stage for the first word', () => {
    startLscwcDrill(host, ['cat', 'dog']);
    expect(host.querySelector('.lscwc-panel')).toBeTruthy();
    expect(host.querySelector('.lscwc-look')).toBeTruthy();
    expect(host.querySelector('.lscwc-word')?.textContent).toContain('c');
    expect(host.querySelector('.lscwc-word')?.textContent).toContain('a');
    expect(host.querySelector('.lscwc-progress')?.textContent).toMatch(/1.*2/);
    cleanupLscwcDrill();
  });

  it('progresses Look → Say → Cover → Write on Next-stage clicks', () => {
    startLscwcDrill(host, ['cat']);
    expect(host.querySelector('.lscwc-look')).toBeTruthy();

    host.querySelector('#lscwc-next-stage').click();
    expect(host.querySelector('.lscwc-say')).toBeTruthy();

    host.querySelector('#lscwc-next-stage').click();
    expect(host.querySelector('.lscwc-cover')).toBeTruthy();

    // The Cover stage's Next is disabled until the 1500ms fade. Force-enable
    // it directly and click to advance to Write.
    const next = host.querySelector('#lscwc-next-stage');
    next.disabled = false;
    next.click();
    expect(host.querySelector('.lscwc-write')).toBeTruthy();
    cleanupLscwcDrill();
  });

  it('records a correct first-try spelling via the tap bank and advances to Check', () => {
    startLscwcDrill(host, ['ca']);
    // Walk through Look → Say → Cover → Write
    host.querySelector('#lscwc-next-stage').click(); // Look→Say
    host.querySelector('#lscwc-next-stage').click(); // Say→Cover
    const next = host.querySelector('#lscwc-next-stage');
    next.disabled = false;
    next.click(); // Cover→Write
    expect(host.querySelector('.lscwc-write')).toBeTruthy();

    // Tap letters in order: 'c' then 'a'. Bank tiles carry the actual letter.
    const tapLetter = (letter) => {
      const tiles = [...host.querySelectorAll('.lscwc-bank-tile')];
      const tile = tiles.find((t) => t.textContent.trim() === letter && !t.disabled);
      tile?.click();
    };
    tapLetter('c');
    tapLetter('a');

    // Auto-advance to Check happens after a small timeout — flush microtasks
    // and timers. The check stage logs the correct attempt as side-effect.
    return new Promise((r) => setTimeout(r, 300)).then(() => {
      expect(host.querySelector('.lscwc-check')).toBeTruthy();
      expect(host.querySelector('.lscwc-check--ok')).toBeTruthy();
      const stats = _readStats();
      expect(stats.ca?.attempts).toBe(1);
      expect(stats.ca?.correct).toBe(1);
      cleanupLscwcDrill();
    });
  });

  it('rejects a wrong tap and does not advance the slot', () => {
    startLscwcDrill(host, ['ab']);
    // Skip to Write
    host.querySelector('#lscwc-next-stage').click();
    host.querySelector('#lscwc-next-stage').click();
    const next = host.querySelector('#lscwc-next-stage');
    next.disabled = false;
    next.click();

    // Tap a wrong letter first
    const tiles = [...host.querySelectorAll('.lscwc-bank-tile')];
    const wrongTile = tiles.find((t) => t.textContent.trim() === 'b' && !t.disabled);
    wrongTile?.click();

    // No slot should be filled
    const filled = host.querySelectorAll('.lscwc-slot.filled');
    expect(filled.length).toBe(0);
    // Wrong tile is still enabled
    expect(wrongTile?.disabled).toBe(false);
    cleanupLscwcDrill();
  });

  it('emits an empty summary and calls onDone immediately when given no words', () => {
    let summary = null;
    startLscwcDrill(host, [], {
      onDone: (s) => {
        summary = s;
      },
    });
    expect(summary).toEqual({ totalWords: 0, correctFirstTry: 0, attempts: 0 });
  });

  it('cleanupLscwcDrill is idempotent and safe with no active drill', () => {
    expect(() => {
      cleanupLscwcDrill();
      cleanupLscwcDrill();
    }).not.toThrow();
  });
});
