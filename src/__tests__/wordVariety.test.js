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

  it('does not repeat a word within the (pool-scaled) recency window', () => {
    store.set('difficulty', 3);
    const opts = { group: 'ccvcc-e', mode: 'blend' };
    const n = progress.getWordsInGroup('ccvcc-e').length;
    // The recency window getNextWord applies for a pool of this size.
    const windowSize = Math.min(n - 1, Math.max(5, Math.floor(n * 0.6)));

    const shown = [];
    for (let round = 0; round < 40; round += 1) {
      const word = progress.getNextWord(opts);
      shown.push(word.id);
      progress.recordAttempt(word.id, true, 'blend');
    }
    // No word may reappear until it has dropped out of the recency window —
    // i.e. the gap between two showings of the same word always exceeds it.
    const lastSeen = {};
    shown.forEach((id, i) => {
      if (lastSeen[id] != null) {
        expect(i - lastSeen[id], `"${id}" repeated within the recency window`).toBeGreaterThan(
          windowSize,
        );
      }
      lastSeen[id] = i;
    });
  });
});
