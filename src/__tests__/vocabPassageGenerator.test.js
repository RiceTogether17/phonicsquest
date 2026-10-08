/*
 * The generated Word Vault passages (vxg-*) teach clue-hunting, so the clue
 * each blank names has to be the words that actually decide the answer.
 *
 * Before: the generator took the five words after each blank as "the key
 * textual evidence" (". Mei opened her" for muddy), one template made
 * "focused" the answer to "Because his friends were chatting, he became ___",
 * and P1 and P6 practised the same answer words.
 */
import { describe, expect, it } from 'vitest';

import { vocabPassages } from '../data/vocabPassages.js';
import { GENERATED_BANKS } from '../data/vocabPassagesExtra/authored.js';
import { LEXICON } from '../data/vocabPassagesExtra/lexicon.js';
import { evaluateClueSelection, hasClueHunt, spanKeyWords } from '../modes/clueEngine.js';

const generated = Object.entries(vocabPassages).flatMap(([category, levels]) =>
  Object.entries(levels).flatMap(([level, list]) =>
    list.filter((p) => p.id.startsWith('vxg-')).map((p) => ({ category, level, p })),
  ),
);

const words = (str) =>
  String(str)
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/^[^a-z]+|[^a-z]+$/g, ''))
    .filter(Boolean);

/** The sentence of `text` holding blank `i` (0-based). */
function sentenceWithBlank(text, i) {
  let seen = -1;
  for (const sentence of text.match(/[^.!?]+[.!?]+/g) || []) {
    seen += sentence.split('___').length - 1;
    if (seen >= i) return sentence;
  }
  return '';
}

/** Categories whose distractors may appear in the body on purpose. */
const DISTRACTOR_IN_TEXT_OK = new Set([
  'synonymContrast', // "not polite" is the clue for rude
  'grammarPrepositions',
  'grammarArticles',
  'grammarSVA',
]);

describe('generated Word Vault passages', () => {
  it('exist for every banked category at every level', () => {
    for (const category of Object.keys(GENERATED_BANKS)) {
      for (const level of ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']) {
        const count = generated.filter((g) => g.category === category && g.level === level).length;
        expect(count, `${category}/${level}`).toBeGreaterThan(0);
      }
    }
  });

  it('name a clue for every blank, made of words the child can tap in the passage', () => {
    for (const { p } of generated) {
      expect(p.clues, p.id).toHaveLength(p.answers.length);
      const present = new Set(words(p.text));
      p.clues.forEach((clue, i) => {
        expect(clue.blankIndex).toBe(i);
        expect(clue.acceptableSpans.length, `${p.id} blank ${i + 1}`).toBeGreaterThan(0);
        for (const span of [...clue.acceptableSpans, ...clue.partialSpans]) {
          for (const w of words(span)) expect(present.has(w), `${p.id}: "${w}"`).toBe(true);
        }
        // Every span has a word worth tapping, and tapping it is graded strong.
        for (const span of clue.acceptableSpans) {
          const [key] = spanKeyWords(span);
          expect(key, `${p.id}: "${span}" has no key word`).toBeTruthy();
          expect(evaluateClueSelection(key, clue)).toBe('strong');
        }
        expect(clue.generated, `${p.id} clue is authored, not derived`).toBeUndefined();
        expect(clue.explanation, p.id).not.toMatch(/key textual evidence/);
      });
    }
  });

  it('get the clue hunt back, now that their clues are authored', () => {
    for (const { p } of generated) expect(hasClueHunt(p), p.id).toBe(true);
  });

  it('no longer marks the words after the blank as the clue for muddy', () => {
    const muddy = generated.filter(({ p }) => p.answers[0] === 'muddy');
    expect(muddy.length).toBeGreaterThan(0);
    for (const { p } of muddy) {
      const spans = p.clues[0].acceptableSpans.join(' ').toLowerCase();
      expect(spans).not.toMatch(/opened her/);
      expect(spans).toMatch(/dirt|soil|rain|slippery/);
    }
  });

  it('puts "focused" only where a contrast makes it the right answer', () => {
    const focused = generated.filter(({ p }) => p.answers.includes('focused'));
    expect(focused.length).toBeGreaterThan(0);
    for (const { p } of focused) {
      const sentence = sentenceWithBlank(p.text, p.answers.indexOf('focused')).toLowerCase();
      expect(sentence, p.id).toMatch(/\b(although|even though|yet|despite|but)\b/);
      expect(sentence, p.id).not.toMatch(/\bbecause\b/);
    }
  });

  it('give P1–P3 and P4–P6 different words', () => {
    for (const [category, bands] of Object.entries(GENERATED_BANKS)) {
      if (category.startsWith('grammar')) continue; // closed sets: a/an/the, is/are …
      const lower = new Set([...bands.lower.answers, ...bands.lower.distractors]);
      const shared = [...bands.upper.answers, ...bands.upper.distractors].filter((w) =>
        lower.has(w),
      );
      expect(shared, category).toEqual([]);
    }
    const p1 = new Set(
      vocabPassages.scienceTechTerms.p1
        .filter((p) => p.id.startsWith('vxg-'))
        .flatMap((p) => p.answers),
    );
    const p6 = vocabPassages.scienceTechTerms.p6
      .filter((p) => p.id.startsWith('vxg-'))
      .flatMap((p) => p.answers);
    expect(p6.filter((w) => p1.has(w))).toEqual([]);
  });

  it('never print an answer in the passage, school context included', () => {
    for (const { category, p } of generated) {
      if (category.startsWith('grammar')) continue;
      const text = ` ${words(p.text).join(' ')} `;
      for (const a of p.answers) {
        expect(text.includes(` ${a.toLowerCase()} `), `${p.id} gives away "${a}"`).toBe(false);
      }
    }
  });

  it('keep distractors out of the passage, so the child cannot copy one from the text', () => {
    for (const { category, p } of generated) {
      if (DISTRACTOR_IN_TEXT_OK.has(category)) continue;
      const text = ` ${words(p.text).join(' ')} `;
      for (const d of p.wordBank.filter((w) => !p.answers.includes(w))) {
        expect(text.includes(` ${d.toLowerCase()} `), `${p.id} contains distractor "${d}"`).toBe(
          false,
        );
      }
    }
  });

  it('have one template shape: a context slot, three blanks, three clues', () => {
    for (const [category, bands] of Object.entries(GENERATED_BANKS)) {
      for (const [band, bank] of Object.entries(bands)) {
        expect(bank.answers, `${category}/${band}`).toHaveLength(3);
        for (const w of [...bank.answers, ...bank.distractors]) {
          expect(LEXICON[w], `${w} needs a lexicon entry`).toBeDefined();
        }
        for (const t of bank.templates) {
          expect(t.body).toContain('{context}');
          expect(t.body.split('___')).toHaveLength(4);
          expect(t.clues).toHaveLength(3);
          // A blank at the start of a sentence would need a capital letter.
          expect(t.body, `${category}/${band}`).not.toMatch(/(^|[.!?]\s+)___/);
        }
      }
    }
  });
});
