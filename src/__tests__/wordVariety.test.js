import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../modules/store.js';
import { progress } from '../modules/progress.js';

function resetState() {
  localStorage.clear();
  store.resetStorageKey();
  store.reset();
}

/**
 * Regression guard for getNextWord variety (free / guided blending).
 *
 * Children practising a narrow phonics stage were seeing the same handful of
 * words repeat almost immediately: the old fixed 5-word recency window blocked
 * the *whole* small pool, so the picker fell straight back to a just-shown
 * word. The window now scales with the pool, giving a round-robin through small
 * stages and spreading repeats much further apart in large ones.
 */
describe('getNextWord variety', () => {
  beforeEach(() => resetState());

  it('never returns the same word twice in a row for a small stage', () => {
    store.set('difficulty', 3);
    const opts = { group: 'ccvcc-e', mode: 'blend' };
    const pool = progress.getWordsInGroup('ccvcc-e');
    expect(pool.length).toBeGreaterThan(2);

    let prev = null;
    for (let round = 0; round < 30; round += 1) {
      const word = progress.getNextWord(opts);
      expect(word).toBeTruthy();
      expect(word.id).not.toBe(prev);
      progress.recordAttempt(word.id, true, 'blend');
      prev = word.id;
    }
  });

  it('cycles through every word of a tiny stage before repeating any', () => {
    store.set('difficulty', 3);
    const opts = { group: 'ccvcc-e', mode: 'blend' };
    const n = progress.getWordsInGroup('ccvcc-e').length;

    const firstPass = [];
    for (let round = 0; round < n; round += 1) {
      const word = progress.getNextWord(opts);
      firstPass.push(word.id);
      progress.recordAttempt(word.id, true, 'blend');
    }
    // A pool of n ≤ 6 words rotates as a round-robin — every word appears once
    // before any repeat, the maximum possible variety for that stage.
    expect(new Set(firstPass).size).toBe(n);
  });
});
