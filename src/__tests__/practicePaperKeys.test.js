/**
 * Answer keys in the P4 to P6 practice papers must read as correct English
 * once the keyed answer is put back into its sentence.
 *
 * These checks catch the mechanical slips a key can carry: a word the
 * sentence already supplies repeated by the answer ("would not have have
 * occurred"), and a word-box passage that needs one word twice while telling
 * the child each word is used once.
 */
import { describe, it, expect } from 'vitest';
import { P4_PRACTICE_TESTS } from '../data/p4PracticeTests.js';
import { P5_PRACTICE_TESTS } from '../data/p5PracticeTests.js';
import { P6_PRACTICE_TESTS } from '../data/p6PracticeTests.js';

const PAPERS = [
  ['P4', P4_PRACTICE_TESTS],
  ['P5', P5_PRACTICE_TESTS],
  ['P6', P6_PRACTICE_TESTS],
];

function mcqItems() {
  const out = [];
  for (const [level, tests] of PAPERS) {
    for (const [key, test] of Object.entries(tests)) {
      for (const sectionKey of ['sectionA', 'sectionB']) {
        (test[sectionKey]?.items || []).forEach((q, i) =>
          out.push([`${level} ${key} ${sectionKey} Q${i + 1}`, q]),
        );
      }
    }
  }
  return out;
}

function wordBoxSections() {
  const out = [];
  for (const [level, tests] of PAPERS) {
    for (const [key, test] of Object.entries(tests)) {
      for (const sectionKey of ['sectionC', 'sectionD']) {
        const s = test[sectionKey];
        if (s?.wordBank && s?.text) out.push([`${level} ${key} ${sectionKey}`, s]);
      }
    }
  }
  return out;
}

/** Put a keyed answer ("a / b" fills two blanks) back into its sentence. */
function fill(q) {
  const parts = String(q.answer).split(' / ');
  let i = 0;
  return q.q.replace(/_{3,}/g, () => parts[Math.min(i++, parts.length - 1)]);
}

describe('practice paper multiple-choice keys', () => {
  it('finds the papers', () => {
    expect(mcqItems().length).toBeGreaterThan(150);
  });

  it('every keyed answer is one of the choices, and choices are distinct', () => {
    for (const [name, q] of mcqItems()) {
      expect(q.choices, name).toContain(q.answer);
      expect(new Set(q.choices).size, name).toBe(q.choices.length);
    }
  });

  it('the keyed answer does not repeat a word the sentence already supplies', () => {
    for (const [name, q] of mcqItems()) {
      const words = fill(q)
        .toLowerCase()
        .replace(/[^a-z'\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
      for (let i = 1; i < words.length; i++) {
        // "had had" and "that that" are real English; nothing else doubled is.
        if (words[i] === words[i - 1] && !['had', 'that'].includes(words[i])) {
          throw new Error(`${name}: "${words[i]} ${words[i]}" in "${fill(q)}"`);
        }
      }
    }
  });
});

describe('practice paper word-box passages', () => {
  it('every answer is in the word box', () => {
    for (const [name, s] of wordBoxSections()) {
      const box = s.wordBank.map((w) => w.toLowerCase());
      for (const a of s.answers) expect(box, `${name}: ${a}`).toContain(a.toLowerCase());
    }
  });

  it('uses each word once when the instructions say so', () => {
    for (const [name, s] of wordBoxSections()) {
      if (!/once/i.test(s.instructions) || /more than once/i.test(s.instructions)) continue;
      const used = s.answers.map((a) => a.toLowerCase());
      expect(new Set(used).size, name).toBe(used.length);
    }
  });

  it('lists as left over exactly the words the answers do not use', () => {
    for (const [name, s] of wordBoxSections()) {
      if (!Array.isArray(s.leftOver)) continue;
      const used = new Set(s.answers.map((a) => a.toLowerCase()));
      const unused = s.wordBank.filter((w) => !used.has(w.toLowerCase())).sort();
      expect([...s.leftOver].sort(), name).toEqual(unused);
    }
  });
});
