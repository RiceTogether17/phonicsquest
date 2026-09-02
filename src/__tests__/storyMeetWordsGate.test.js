import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock speechSynthesis before storyMode.js (transitively) imports audio.js
vi.hoisted(() => {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
});

const { _isMeetWordsCompletedToday, _setMeetWordsCompleted } =
  await import('../modes/storyMode.js');

const KEY = 'giri_meet_words';

describe('Meet-the-Words gate state', () => {
  beforeEach(() => {
    localStorage.removeItem(KEY);
  });

  it('returns false for a story with no record', () => {
    expect(_isMeetWordsCompletedToday('core-a-01')).toBe(false);
  });

  it('returns true after _setMeetWordsCompleted is called', () => {
    _setMeetWordsCompleted('core-a-01');
    expect(_isMeetWordsCompletedToday('core-a-01')).toBe(true);
  });

  it('persists the date stamp in localStorage', () => {
    _setMeetWordsCompleted('core-a-02');
    const map = JSON.parse(localStorage.getItem(KEY));
    const today = new Date().toISOString().slice(0, 10);
    expect(map['core-a-02']).toBe(today);
  });

  it('keeps stories independent — completing one does not unlock another', () => {
    _setMeetWordsCompleted('core-a-03');
    expect(_isMeetWordsCompletedToday('core-a-03')).toBe(true);
    expect(_isMeetWordsCompletedToday('core-a-04')).toBe(false);
  });

  it('drops entries older than 30 days when writing a new completion', () => {
    const stale = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    localStorage.setItem(
      KEY,
      JSON.stringify({
        'old-story': stale,
        'recent-story': new Date().toISOString().slice(0, 10),
      }),
    );
    _setMeetWordsCompleted('core-a-05');
    const map = JSON.parse(localStorage.getItem(KEY));
    expect(map['old-story']).toBeUndefined();
    expect(map['recent-story']).toBeDefined();
    expect(map['core-a-05']).toBeDefined();
  });

  it('treats a stale entry (yesterday or older) as not completed', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    localStorage.setItem(KEY, JSON.stringify({ 'core-a-06': yesterday }));
    // Note: session-scoped flag may still leak from a prior call. Use a
    // fresh story id that has no session-side effect from earlier tests.
    expect(_isMeetWordsCompletedToday('core-a-06')).toBe(false);
  });
});
