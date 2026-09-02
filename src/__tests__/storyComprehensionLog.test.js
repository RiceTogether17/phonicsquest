import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.hoisted(() => {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
});

const { _logComprehensionAttempt } = await import('../modes/storyMode.js');

const LOG_KEY = 'giri_comp_log';

describe('Comprehension micro-check log', () => {
  beforeEach(() => {
    localStorage.removeItem(LOG_KEY);
  });

  it('writes the first attempt to localStorage', () => {
    _logComprehensionAttempt({
      storyId: 'core-a-01',
      question: 'Why did Giri sit on the mat?',
      response: 'confident',
    });
    const log = JSON.parse(localStorage.getItem(LOG_KEY));
    expect(log).toHaveLength(1);
    expect(log[0].storyId).toBe('core-a-01');
    expect(log[0].response).toBe('confident');
    expect(typeof log[0].ts).toBe('number');
  });

  it('appends subsequent attempts', () => {
    _logComprehensionAttempt({ storyId: 's1', response: 'reread' });
    _logComprehensionAttempt({ storyId: 's1', response: 'confident' });
    _logComprehensionAttempt({ storyId: 's2', response: 'hint' });
    const log = JSON.parse(localStorage.getItem(LOG_KEY));
    expect(log.map((e) => e.response)).toEqual(['reread', 'confident', 'hint']);
  });

  it('caps the log at 100 entries (FIFO eviction)', () => {
    for (let i = 0; i < 105; i++) {
      _logComprehensionAttempt({ storyId: `s${i}`, response: 'confident' });
    }
    const log = JSON.parse(localStorage.getItem(LOG_KEY));
    expect(log).toHaveLength(100);
    // Oldest 5 should be dropped (s0..s4)
    expect(log[0].storyId).toBe('s5');
    expect(log[99].storyId).toBe('s104');
  });

  it('captures all four response kinds', () => {
    const responses = ['confident', 'reread', 'hint', 'skipped'];
    for (const r of responses) {
      _logComprehensionAttempt({ storyId: 's', response: r });
    }
    const log = JSON.parse(localStorage.getItem(LOG_KEY));
    expect(log.map((e) => e.response)).toEqual(responses);
  });
});
