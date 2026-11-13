/**
 * Synthesis & Transformation marking must not give full marks for the very
 * mistake an item tests. Meaning units are checked as before; on top of them
 * the answer has to use the construction of a correct answer.
 */
import { describe, it, expect } from 'vitest';
import {
  gradeTransformation,
  hasCorrectStructure,
  sentenceShape,
} from '../modes/scoring/transformationGrader.js';
import { SYNTHESIS_ITEMS } from '../data/synthesisItems.js';
import { P4_PRACTICE_TESTS } from '../data/p4PracticeTests.js';
import { P5_PRACTICE_TESTS } from '../data/p5PracticeTests.js';
import { P6_PRACTICE_TESTS } from '../data/p6PracticeTests.js';

const item = (id) => SYNTHESIS_ITEMS.find((i) => i.id === id);

function paperItems() {
  const out = [];
  for (const [level, tests] of [
    ['P4', P4_PRACTICE_TESTS],
    ['P5', P5_PRACTICE_TESTS],
    ['P6', P6_PRACTICE_TESTS],
  ]) {
    for (const [key, test] of Object.entries(tests)) {
      (test.sectionF?.items || []).forEach((it, i) => out.push([`${level} ${key} Q${i + 1}`, it]));
    }
  }
  return out;
}

describe('sentenceShape', () => {
  it('keeps structural words and collapses everything else to a gap', () => {
    expect(
      sentenceShape('No sooner had the children sat down than the teacher started the test.'),
    ).toBe('no sooner had • than •');
  });

  it('shows word order, not only which words were used', () => {
    expect(sentenceShape('Not only is the complex affordable')).not.toBe(
      sentenceShape('Not only the complex is affordable'),
    );
  });

  it('reads a contraction as the words it stands for', () => {
    expect(sentenceShape("she didn't go")).toBe(sentenceShape('she did not go'));
  });
});

describe('the mistake each item tests no longer earns full marks', () => {
  const cases = [
    ['st-conn-7', 'No sooner had the children sat down when the teacher started the test.'],
    [
      'st-conn-11',
      'Not only the new sports complex is affordable, but it is also conveniently located.',
    ],
    ['st-rs-6', 'The judge exclaimed that what a beautiful painting this is.'],
    ['st-adv-4', 'Never the champion lost a match in his entire career.'],
    ['st-adv-3', 'Seldom she complain about her difficulties.'],
    ['st-pass-6', 'The P5 pupils was conducted the science experiment last Friday.'],
    ['st-adv-1', 'It was not until Priya reached home when she realised she had lost her phone.'],
    ['st-cleft-3', 'It was at the science fair they first met in 2019.'],
  ];
  it.each(cases)('%s: %s', (id, typed) => {
    expect(gradeTransformation(typed, item(id)).fraction).toBeLessThan(1);
  });

  it('still gives half for the right content in the wrong construction', () => {
    const r = gradeTransformation(
      'No sooner had the children sat down when the teacher started the test.',
      item('st-conn-7'),
    );
    expect(r.fraction).toBe(0.5);
    expect(r.trace.reason).toBe('structure-mismatch');
  });
});

describe('correct answers still earn full marks', () => {
  it('accepts a listed synonym in the right construction', () => {
    expect(
      gradeTransformation(
        'It was not until Priya got home that she noticed she had lost her phone.',
        item('st-adv-1'),
      ).fraction,
    ).toBe(1);
  });

  it('accepts only the part after the given beginning', () => {
    expect(
      gradeTransformation(
        'the children sat down than the teacher began the test',
        item('st-conn-7'),
      ).fraction,
    ).toBe(1);
  });

  it('accepts either connector a paper item lists', () => {
    const q = P5_PRACTICE_TESTS.T2.sectionF.items[0];
    expect(
      gradeTransformation(
        'Ms Wong asked Julian if he had remembered to submit his portfolio before the deadline.',
        q,
      ).fraction,
    ).toBe(1);
    expect(
      hasCorrectStructure(
        'whether he had remembered to hand in his portfolio before the deadline',
        q,
      ),
    ).toBe(true);
  });

  it('every Synthesis Quest answer key passes its own marking', () => {
    for (const it of SYNTHESIS_ITEMS) {
      expect(gradeTransformation(it.answer, it).fraction, it.id).toBe(1);
    }
  });

  it('every practice paper answer key passes, typed whole or as the continuation', () => {
    for (const [name, q] of paperItems()) {
      const stem = String(q.stem || '')
        .replace(/_+/g, '')
        .trim();
      for (const a of [q.answer, ...(q.alternates || [])]) {
        const whole = a.toLowerCase().startsWith(stem.toLowerCase()) ? a : `${stem} ${a}`;
        expect(gradeTransformation(a, q).fraction, `${name}: ${a}`).toBe(1);
        expect(gradeTransformation(whole, q).fraction, `${name}: ${whole}`).toBe(1);
      }
    }
  });
});
