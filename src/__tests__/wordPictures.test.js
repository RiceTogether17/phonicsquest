/*
 * A picture teaches what the child will call the word. A yoga pose for
 * "mat", a frog for "hop" or a broom for "sat" is named — and, in a picture
 * choice, judged — as the thing drawn, not the word on the card. Words with
 * no faithful picture are flagged noPicture: they show no picture, and
 * games whose answer IS a picture never use them.
 */
import { describe, expect, it } from 'vitest';

const { WORDS, NO_FAITHFUL_PICTURE, wordPicture, getDistractors } =
  await import('../data/words.js');
const { progress } = await import('../modules/progress.js');
const { CURRICULUM } = await import('../data/curriculum.js');

const byWord = (w) => WORDS.find((x) => x.word === w);

describe('no-picture words', () => {
  it('every listed word is in the bank and is flagged', () => {
    const missing = [...NO_FAITHFUL_PICTURE].filter((w) => !byWord(w));
    expect(missing).toEqual([]);
    for (const w of NO_FAITHFUL_PICTURE) expect(byWord(w).noPicture, w).toBe(true);
  });

  it('wordPicture is empty for a flagged word and the emoji otherwise', () => {
    expect(wordPicture(byWord('mat'))).toBe('');
    expect(wordPicture(byWord('cat'))).toBe(byWord('cat').emoji);
    expect(wordPicture(undefined)).toBe('');
  });

  it('"saw" is drawn as a saw, not a hammer', () => {
    expect(byWord('saw').emoji).toBe('🪚');
  });

  it('picture distractors are all picturable', () => {
    const cat = byWord('cat');
    for (let i = 0; i < 20; i++) {
      const d = getDistractors(cat, 3, { maxLevel: cat.level, requirePicture: true });
      expect(d.filter((w) => w.noPicture).map((w) => w.word)).toEqual([]);
    }
  });
});

describe('picture-choice pools', () => {
  const stages = CURRICULUM.filter((s) =>
    s.recommendedModes?.some((m) => ['oralBlend', 'oddOneOut', 'train'].includes(m)),
  );

  it.each(['oralBlend', 'oddOneOut', 'train'])(
    '%s never picks an unpicturable word when a picturable one exists',
    (mode) => {
      for (const stage of stages) {
        const pool = progress.getAdaptivePool(50, { mode, group: stage.group, maxLevel: 9 });
        expect(pool.length, stage.id).toBeGreaterThan(0);
        const anyPictured = WORDS.some((w) => w.group === stage.group && !w.noPicture);
        if (anyPictured) {
          expect(
            pool.filter((w) => w.noPicture).map((w) => w.word),
            stage.id,
          ).toEqual([]);
        }
      }
    },
  );
});
