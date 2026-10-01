import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  savePlace,
  getPlace,
  clearPlace,
  placesInOrder,
  prune,
  MAX_PLACES,
  PLACE_TTL_DAYS,
  MIN_WORTH_SAVING,
} from '../modules/storyPlace.js';

const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe('remembering where a child stopped', () => {
  it('saves and returns a place', () => {
    savePlace('core-d-01', 64);
    expect(getPlace('core-d-01')).toBe(64);
  });

  it('does not remember the first few words', () => {
    // "You stopped at word 2" would greet a child with a welcome-back banner
    // for a story they had barely opened.
    savePlace('s1', MIN_WORTH_SAVING - 1);
    expect(getPlace('s1')).toBeNull();
    savePlace('s1', MIN_WORTH_SAVING);
    expect(getPlace('s1')).toBe(MIN_WORTH_SAVING);
  });

  it('scrolling back to the top forgets the place', () => {
    savePlace('s1', 40);
    expect(getPlace('s1')).toBe(40);
    savePlace('s1', 1); // child scrolled back up to start again
    expect(getPlace('s1')).toBeNull();
  });

  it('clears a place when the story is finished', () => {
    savePlace('s1', 40);
    clearPlace('s1');
    expect(getPlace('s1')).toBeNull();
  });

  it('rounds and floors the index rather than storing nonsense', () => {
    savePlace('s1', 42.7);
    expect(getPlace('s1')).toBe(43);
    savePlace('s2', Number.NaN);
    savePlace('s3', Infinity);
    expect(getPlace('s2')).toBeNull();
    expect(getPlace('s3')).toBeNull();
  });

  it('returns null for a story with no place, and for junk in storage', () => {
    expect(getPlace('never-opened')).toBeNull();
    localStorage.setItem('giri_story_place', 'not json');
    expect(getPlace('s1')).toBeNull();
    localStorage.setItem('giri_story_place', '["an","array"]');
    expect(getPlace('s1')).toBeNull();
  });

  it('survives storage being unavailable', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    // Losing a bookmark is not worth throwing over and losing the reader.
    expect(() => savePlace('s1', 40)).not.toThrow();
    setItem.mockRestore();
  });
});

describe('pruning', () => {
  it('drops places older than the time-to-live', () => {
    const now = Date.now();
    const map = {
      fresh: { word: 10, at: now - DAY },
      stale: { word: 10, at: now - (PLACE_TTL_DAYS + 1) * DAY },
    };
    expect(Object.keys(prune(map, now))).toEqual(['fresh']);
  });

  it('keeps the newest when there are too many, so the live story is safe', () => {
    const now = Date.now();
    const map = {};
    for (let i = 0; i < MAX_PLACES + 12; i++) map[`s${i}`] = { word: 10, at: now - i * 1000 };
    const kept = prune(map, now);
    expect(Object.keys(kept)).toHaveLength(MAX_PLACES);
    expect(kept.s0).toBeDefined(); // the most recent — the one being read
    expect(kept[`s${MAX_PLACES + 11}`]).toBeUndefined();
  });

  it('drops malformed entries', () => {
    const now = Date.now();
    const map = { ok: { word: 10, at: now }, bad: null, worse: { word: 'x', at: now } };
    expect(Object.keys(prune(map, now))).toEqual(['ok']);
  });

  it('a long reading history never grows past the cap on disk', () => {
    const now = Date.now();
    for (let i = 0; i < MAX_PLACES + 20; i++) savePlace(`s${i}`, 20, now + i);
    expect(placesInOrder()).toHaveLength(MAX_PLACES);
  });
});

describe('places in order', () => {
  it('lists the most recently read first', () => {
    const now = Date.now();
    savePlace('old', 20, now - 3 * DAY);
    savePlace('newest', 30, now);
    savePlace('middle', 25, now - DAY);
    expect(placesInOrder().map((p) => p.storyId)).toEqual(['newest', 'middle', 'old']);
  });
});
