import { describe, it, expect } from 'vitest';
import { groupLines, RULER_MODES } from '../modules/readingRuler.js';

/**
 * `groupLines` is the whole reason the ruler tracks the lines a child SEES
 * rather than the paragraphs the DOM knows about. It takes the boxes the
 * words landed in and works out which visual line each one is on, which is
 * the one piece of the ruler that can be checked without a browser.
 */

/** Words on a row: same top/bottom, laid out left to right. */
const row = (top, h, n) => Array.from({ length: n }, () => ({ top, bottom: top + h }));

describe('groupLines', () => {
  it('splits wrapped text into the lines it wrapped onto', () => {
    const boxes = [...row(0, 20, 4), ...row(24, 20, 3), ...row(48, 20, 5)];
    const lines = groupLines(boxes);
    expect(lines.map((l) => [l.first, l.last])).toEqual([
      [0, 3],
      [4, 6],
      [7, 11],
    ]);
  });

  it('every word belongs to exactly one line', () => {
    const boxes = [...row(0, 20, 6), ...row(24, 20, 2), ...row(48, 20, 9)];
    const lines = groupLines(boxes);
    const covered = lines.flatMap((l) =>
      Array.from({ length: l.last - l.first + 1 }, (_, k) => l.first + k),
    );
    expect(covered).toEqual(boxes.map((_, i) => i));
  });

  it('keeps a raised word on its own line', () => {
    // The sound-colour scaffold prints a breve above short vowels. If that
    // ever lifted a word's box, a naive "same top" grouping would split the
    // line in two and the ruler would advance half a line at a time. The
    // midpoint test is what stops that.
    const boxes = [
      { top: 0, bottom: 20 },
      { top: -4, bottom: 20 }, // taller box, same text line
      { top: 0, bottom: 20 },
      { top: 24, bottom: 44 }, // genuinely the next line
    ];
    expect(groupLines(boxes).map((l) => [l.first, l.last])).toEqual([
      [0, 2],
      [3, 3],
    ]);
  });

  it('skips words that are not rendered, without breaking the run', () => {
    const boxes = [{ top: 0, bottom: 20 }, null, { top: 0, bottom: 20 }, { top: 24, bottom: 44 }];
    const lines = groupLines(boxes);
    expect(lines).toHaveLength(2);
    // The hidden word sits inside the first line's span rather than starting
    // a line of its own — indexes stay aligned with the word list.
    expect([lines[0].first, lines[0].last]).toEqual([0, 2]);
  });

  it('handles an empty story and a one-word story', () => {
    expect(groupLines([])).toEqual([]);
    expect(groupLines([null, null])).toEqual([]);
    expect(groupLines([{ top: 0, bottom: 20 }])).toEqual([
      { top: 0, bottom: 20, first: 0, last: 0 },
    ]);
  });

  it('grows a line to cover the tallest word on it', () => {
    const lines = groupLines([
      { top: 4, bottom: 20 },
      { top: 0, bottom: 26 },
      { top: 4, bottom: 20 },
    ]);
    expect(lines).toHaveLength(1);
    expect(lines[0].top).toBe(0);
    expect(lines[0].bottom).toBe(26);
  });
});

describe('ruler modes', () => {
  it('offers the three ways a child is taught to track', () => {
    expect(RULER_MODES.map((m) => m.id)).toEqual(['word', 'line', 'window']);
  });

  it('every mode says in plain words what it does', () => {
    for (const m of RULER_MODES) {
      expect(m.label).toBeTruthy();
      expect(m.icon).toBeTruthy();
      // The hint is the tooltip on the style button — a grown-up has to be
      // able to tell the three apart without trying each one.
      expect(m.hint.length).toBeGreaterThan(20);
      expect(m.hint).toMatch(/\.$/);
    }
  });
});
