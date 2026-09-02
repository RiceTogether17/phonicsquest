import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Regressions found in the webapp audit.
 *
 * Each case here is a bug that shipped green: the code ran, nothing threw,
 * and the failure was silent — a tutor that never learned anything about the
 * child, a parent report that always said "0", a voice that carried on
 * talking over the next screen. Tests that only ask "did it throw?" cannot
 * see any of those, so these ask what the feature was actually for.
 */

describe('learnerContext: what Giri is told about the child', () => {
  beforeEach(async () => {
    const { store } = await import('../src/modules/store.js');
    store.reset();
  });

  it('names the words the child recently got wrong', async () => {
    const { store } = await import('../src/modules/store.js');
    const { learnerContext } = await import('../src/modules/aiGuardrails.js');

    // wordHistory is newest-first, exactly as progress.recordAttempt writes it.
    store.set('wordHistory', [
      { wordId: 'ship', correct: false, mode: 'first' },
      { wordId: 'cat', correct: true, mode: 'blend' },
      { wordId: 'chop', correct: false, mode: 'last' },
    ]);

    const context = learnerContext();
    expect(context).toContain('ship');
    expect(context).toContain('chop');
    // A word they got RIGHT is not a gap to work on.
    expect(context).not.toContain('cat');
  });

  it('does not repeat a word missed several times', async () => {
    const { store } = await import('../src/modules/store.js');
    const { learnerContext } = await import('../src/modules/aiGuardrails.js');

    store.set(
      'wordHistory',
      Array.from({ length: 5 }, () => ({ wordId: 'ship', correct: false, mode: 'first' })),
    );

    const line = learnerContext()
      .split('\n')
      .find((l) => l.includes('Recently got'));
    expect(line.match(/ship/g)).toHaveLength(1);
  });

  it('says nothing about mistakes for a child who has made none', async () => {
    const { learnerContext } = await import('../src/modules/aiGuardrails.js');
    expect(learnerContext()).not.toContain('Recently got');
  });
});

describe('printed parent report: days played this week', () => {
  it('counts the days the rolling XP ledger recorded play on', async () => {
    const { countDaysPlayedThisWeek } = await import('../src/components/dashboard.js');
    const now = Date.parse('2026-09-02T09:00:00Z');
    const day = (offset) => new Date(now - offset * 86_400_000).toISOString().slice(0, 10);

    expect(
      countDaysPlayedThisWeek(
        [
          { date: day(0), xp: 30 },
          { date: day(2), xp: 10 },
          { date: day(3), xp: 0 }, // opened the app, earned nothing
          { date: day(9), xp: 50 }, // outside the week
        ],
        now,
      ),
    ).toBe(2);
  });

  it('reports zero rather than throwing when there is no ledger yet', async () => {
    const { countDaysPlayedThisWeek } = await import('../src/components/dashboard.js');
    expect(countDaysPlayedThisWeek(undefined)).toBe(0);
    expect(countDaysPlayedThisWeek([])).toBe(0);
  });
});

describe('cancelSpeech during the onset guard', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  it('drops an utterance that has not reached the engine yet', async () => {
    const spoken = [];
    globalThis.speechSynthesis = {
      getVoices: () => [],
      addEventListener: () => {},
      speak: (utt) => {
        spoken.push(utt.text);
        utt.onend?.();
      },
      cancel: () => {},
      paused: false,
      resume: () => {},
    };
    globalThis.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };

    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', true);

    // A word is queued, then the mode is torn down inside the 80–150 ms
    // onset guard — before speechSynthesis has anything to cancel.
    const pending = audio.speakText('the cat sat on the mat');
    audio.cancelSpeech();
    await vi.advanceTimersByTimeAsync(500);
    await pending;

    expect(spoken).toEqual([]);

    vi.useRealTimers();
    delete globalThis.speechSynthesis;
    delete globalThis.SpeechSynthesisUtterance;
  });
});
