import { describe, it, expect } from 'vitest';
import {
  readingRate,
  describeFluency,
  termOfYear,
  gradeNumber,
  ORF_50TH,
  ORF_25TH,
} from '../modules/fluencyNorms.js';

const at = (y, m, d) => new Date(y, m - 1, d);

describe('reading rate', () => {
  it('counts words per minute', () => {
    expect(readingRate(100, 60).wpm).toBe(100);
    expect(readingRate(80, 120).wpm).toBe(40);
  });

  it('gives no words-correct-per-minute when nobody counted errors', () => {
    // The old code called plain words-per-minute "wcpm" and compared it to
    // a words-CORRECT-per-minute benchmark. Null is the honest answer.
    const r = readingRate(100, 60, null);
    expect(r.wcpm).toBeNull();
    expect(r.accuracy).toBeNull();
  });

  it('subtracts the errors once they are counted', () => {
    const r = readingRate(100, 60, 10);
    expect(r.wpm).toBe(100);
    expect(r.wcpm).toBe(90);
    expect(r.accuracy).toBe(90);
  });

  it('does not let a silly error count produce a negative reading', () => {
    expect(readingRate(50, 60, 500).wcpm).toBe(0);
    expect(readingRate(50, 60, -5).wcpm).toBe(50);
  });

  it('survives a zero-length or zero-word timing', () => {
    expect(readingRate(0, 60).wpm).toBe(0);
    expect(readingRate(100, 0).wpm).toBe(0);
  });
});

describe('the school year', () => {
  it('splits the Singapore year into thirds', () => {
    expect(termOfYear(at(2026, 2, 1))).toBe('autumn');
    expect(termOfYear(at(2026, 6, 1))).toBe('winter');
    expect(termOfYear(at(2026, 11, 1))).toBe('spring');
  });

  it('reads a primary grade, and refuses anything else', () => {
    expect(gradeNumber('P3')).toBe(3);
    expect(gradeNumber('p1')).toBe(1);
    expect(gradeNumber('P7')).toBeNull();
    expect(gradeNumber('Grade 3')).toBeNull();
    expect(gradeNumber(null)).toBeNull();
  });
});

describe('the norms table', () => {
  it('rises through each year and across each year', () => {
    for (const grade of [1, 2, 3, 4, 5, 6]) {
      const row = ORF_50TH[grade];
      const terms = ['autumn', 'winter', 'spring'].map((t) => row[t]).filter((n) => n != null);
      for (let i = 1; i < terms.length; i++) expect(terms[i]).toBeGreaterThanOrEqual(terms[i - 1]);
    }
    for (let g = 2; g <= 6; g++) {
      expect(ORF_50TH[g].spring).toBeGreaterThanOrEqual(ORF_50TH[g - 1].spring);
    }
  });

  it('puts the 25th percentile below the 50th everywhere', () => {
    for (const grade of [1, 2, 3, 4, 5, 6]) {
      for (const term of ['autumn', 'winter', 'spring']) {
        const p50 = ORF_50TH[grade][term];
        const p25 = ORF_25TH[grade][term];
        if (p50 == null || p25 == null) continue;
        expect(p25, `P${grade} ${term}`).toBeLessThan(p50);
      }
    }
  });
});

describe('describing a reading', () => {
  it('will not judge a number nobody checked for errors', () => {
    const r = describeFluency({ wpm: 72, wcpm: null, primaryGrade: 'P2' });
    expect(r.band).toBe('uncounted');
    expect(r.headline).toContain('72 words per minute');
    expect(r.detail).toMatch(/words correct per minute/i);
    expect(r.reference).toBeNull();
  });

  it('says which year group it is comparing against', () => {
    const r = describeFluency({ wpm: 110, wcpm: 105, primaryGrade: 'P3', now: at(2026, 11, 1) });
    expect(r.reference).toContain('P3');
    expect(r.reference).toMatch(/Hasbrouck/);
  });

  it('calls 62 fluent in P1 and not in P2 — the bug this replaces', () => {
    // The old rule was a bare `wcpm >= 60 → "🌟 Fluent reader!"`. 62 is
    // around the middle of P1 at year's end, and around the 10th percentile
    // for P2 at year's end: the child most in need of the timing was the
    // one most likely to be congratulated by it.
    const late = at(2026, 11, 1);
    const p1 = describeFluency({ wpm: 62, wcpm: 62, primaryGrade: 'P1', now: late });
    const p2 = describeFluency({ wpm: 62, wcpm: 62, primaryGrade: 'P2', now: late });
    expect(p1.band).toBe('at');
    expect(p2.band).toBe('below');
  });

  it('places a reading against the right third of the year', () => {
    // 55 wcpm in P2: fine in the first third, behind by the last.
    const early = describeFluency({ wpm: 55, wcpm: 55, primaryGrade: 'P2', now: at(2026, 2, 1) });
    const late = describeFluency({ wpm: 55, wcpm: 55, primaryGrade: 'P2', now: at(2026, 11, 1) });
    expect(early.band).toBe('at');
    expect(late.band).toBe('below');
  });

  it('says it does not know, rather than picking a row', () => {
    const noGrade = describeFluency({ wpm: 80, wcpm: 75, primaryGrade: null });
    expect(noGrade.band).toBe('unknown');
    expect(noGrade.reference).toBeNull();
    expect(noGrade.detail).toMatch(/benchmarks start at Primary 1/i);
    // And it must NOT suggest setting a school year: a profile with a
    // primary grade is routed to the Primary English modules and cannot
    // reach the story reader at all, so that would be advice to break the
    // thing they are using.
    expect(noGrade.detail).not.toMatch(/set the school year/i);

    // P1 in the first third has no published benchmark — children are
    // barely reading connected text yet.
    const tooEarly = describeFluency({
      wpm: 20,
      wcpm: 18,
      primaryGrade: 'P1',
      now: at(2026, 2, 1),
    });
    expect(tooEarly.band).toBe('unknown');
    expect(tooEarly.detail).toMatch(/too early/i);
  });

  it('never tells a child they are fast, in any band', () => {
    const late = at(2026, 11, 1);
    for (const grade of ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']) {
      for (const wcpm of [10, 40, 62, 100, 160]) {
        const r = describeFluency({ wpm: wcpm, wcpm, primaryGrade: grade, now: late });
        const text = `${r.headline} ${r.detail}`;
        expect(text, `${grade} @ ${wcpm}`).not.toMatch(/fluent reader|well done|🌟|faster|speed/i);
      }
    }
  });

  it('always names the measure, so the two are never confused', () => {
    expect(describeFluency({ wpm: 70, wcpm: null }).headline).toMatch(/words per minute$/);
    expect(describeFluency({ wpm: 70, wcpm: 65 }).headline).toMatch(/words correct per minute$/);
  });
});
