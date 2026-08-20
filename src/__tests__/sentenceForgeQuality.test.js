/**
 * Sentence Forge — content and session guardrails.
 *
 * The mode builds 79% of its sentences by wrapping an authored one in a
 * fronted phrase. That expansion is load-bearing (it fills every level/track
 * scope), so these tests pin the things it must never do: invent a second
 * clock, stack two fronted phrases, or offer an answer the word bank cannot
 * spell.
 */
import { describe, expect, it } from 'vitest';
import { allSentences } from '../data/sentences.js';
import { describeFirstDivergence } from '../modules/sentenceSkills.js';
import {
  getUniqueSentencesDone,
  recordSentenceCompletion,
  getShakySentenceIds,
} from '../modes/sentenceForgeCompletion.js';

/** Word multiset of a sentence — what the shuffled bank actually offers. */
function tokens(sentence) {
  return sentence
    .replace(/[.!?]$/, '')
    .split(' ')
    .slice()
    .sort()
    .join('|');
}

describe('Sentence Forge content', () => {
  it('never asks a child to build an answer the word bank cannot spell', () => {
    const impossible = [];
    for (const entry of allSentences) {
      for (const alt of entry.acceptableAnswers || []) {
        if (tokens(alt) !== tokens(entry.sentence)) impossible.push(`${entry.id}: ${alt}`);
      }
    }
    expect(impossible, impossible.slice(0, 10).join('\n')).toEqual([]);
  });

  it('never fronts a time phrase onto a sentence that already has one', () => {
    const SECOND_CLOCK =
      /\b(yesterday|tomorrow|tonight|last (?:week|night|month|year|Saturday|Sunday|Monday|Friday)|next (?:week|month|year|Friday|Monday|Saturday)|every (?:day|morning|week)|this (?:morning|afternoon|evening)|at noon)\b/i;
    const clashes = allSentences
      .filter((s) => /^On /.test(s.sentence))
      .filter((s) => SECOND_CLOCK.test(s.sentence.replace(/^On [^,]+,\s*/, '')))
      .map((s) => `${s.id}: ${s.sentence}`);
    expect(clashes, clashes.slice(0, 10).join('\n')).toEqual([]);
  });

  it('does not stack a second fronted phrase on an already-fronted sentence', () => {
    // "In our classroom, yesterday, Ravi played…" — grammatical but clumsy.
    const stacked = allSentences
      .filter((s) => /^sx-/.test(s.id))
      .filter((s) => /^[^,]{1,40},\s+[^,]{1,30},\s/.test(s.sentence))
      .map((s) => `${s.id}: ${s.sentence}`);
    expect(stacked.length, stacked.slice(0, 5).join('\n')).toBeLessThanOrEqual(20);
  });

  it('every sentence carries a stable id, and ids are unique', () => {
    const ids = allSentences.map((s) => s.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('describeFirstDivergence', () => {
  const target = ['The', 'dog', 'chased', 'the', 'ball'];

  it('names how much is right and where the build goes wrong', () => {
    const hint = describeFirstDivergence(['The', 'dog', 'the', 'chased', 'ball'], target);
    expect(hint).toContain('first 2 words are right');
    expect(hint).toContain('"the"');
  });

  it('stays silent when nothing is right yet, rather than saying "word 1 is wrong"', () => {
    expect(describeFirstDivergence(['ball', 'the', 'dog'], target)).toBe('');
  });

  it('encourages a correct but unfinished build', () => {
    const hint = describeFirstDivergence(['The', 'dog'], target);
    expect(hint).toContain('Keep going');
    // Must not dictate the sentence one word per Check press.
    expect(hint).not.toContain('chased');
  });

  it('says nothing when the build matches', () => {
    expect(describeFirstDivergence(target, target)).toBe('');
  });

  it('never reveals the whole answer', () => {
    const hint = describeFirstDivergence(['The', 'dog', 'the', 'chased', 'ball'], target);
    expect(hint).not.toContain('chased the ball');
  });
});

describe('sentence completion tracking', () => {
  it('counts sentences finished, not correct answers given', () => {
    let state = { bySentence: {}, completed: {} };
    // The same sentence, solved three times.
    for (let i = 0; i < 3; i += 1) {
      const next = recordSentenceCompletion({
        level: 1,
        sentenceId: 's001',
        firstTryCorrect: i === 0,
        sfqCompletedBySentence: state.bySentence,
        sfqCompleted: state.completed,
      });
      state = { bySentence: next.nextBySentence, completed: next.nextCompleted };
    }
    expect(getUniqueSentencesDone({ level: 1, sfqCompletedBySentence: state.bySentence })).toBe(1);
    expect(state.completed[1]).toBe(1);
  });

  it('counts distinct sentences separately', () => {
    let state = { bySentence: {}, completed: {} };
    for (const id of ['s001', 's002', 's003']) {
      const next = recordSentenceCompletion({
        level: 2,
        sentenceId: id,
        sfqCompletedBySentence: state.bySentence,
        sfqCompleted: state.completed,
      });
      state = { bySentence: next.nextBySentence, completed: next.nextCompleted };
    }
    expect(getUniqueSentencesDone({ level: 2, sfqCompletedBySentence: state.bySentence })).toBe(3);
  });

  it('falls back to the legacy tally so existing profiles keep their progress', () => {
    expect(getUniqueSentencesDone({ level: 3, sfqCompleted: { 3: 12 } })).toBe(12);
  });

  it('remembers which sentences needed help, and never takes a clean run away', () => {
    let { nextBySentence } = recordSentenceCompletion({
      level: 1,
      sentenceId: 'shaky',
      firstTryCorrect: false,
    });
    ({ nextBySentence } = recordSentenceCompletion({
      level: 1,
      sentenceId: 'clean',
      firstTryCorrect: true,
      sfqCompletedBySentence: nextBySentence,
    }));
    expect(getShakySentenceIds({ level: 1, sfqCompletedBySentence: nextBySentence })).toEqual([
      'shaky',
    ]);

    // Replaying a clean sentence without a first-try win keeps its clean record.
    ({ nextBySentence } = recordSentenceCompletion({
      level: 1,
      sentenceId: 'clean',
      firstTryCorrect: false,
      sfqCompletedBySentence: nextBySentence,
    }));
    expect(getShakySentenceIds({ level: 1, sfqCompletedBySentence: nextBySentence })).toEqual([
      'shaky',
    ]);
  });
});
