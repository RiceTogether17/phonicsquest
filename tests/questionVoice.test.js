import { beforeAll, describe, expect, it } from 'vitest';

/**
 * Reading the question aloud, and the wrappers being gone.
 *
 * Two halves of the same idea: a grammar question should test grammar, not
 * whether the child can decode the sentence it is wrapped in — so the
 * wrapper went, and a voice arrived.
 */

globalThis.speechSynthesis = {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
  paused: false,
  resume: () => {},
};
globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };

let speakableStem, buildReadAloudScript, contextualizeMcqQuestion;
let GRAMMAR_MCQ_ITEMS, VOCAB_MCQ_ITEMS;

beforeAll(async () => {
  ({ speakableStem, buildReadAloudScript } = await import('../src/components/readAloudButton.js'));
  ({ contextualizeMcqQuestion } = await import('../src/data/practiceExpansion.js'));
  ({ GRAMMAR_MCQ_ITEMS } = await import('../src/data/grammarMcq.js'));
  ({ VOCAB_MCQ_ITEMS } = await import('../src/data/vocabMcq.js'));
});

describe('questions are no longer wrapped in admin', () => {
  it('returns the sentence exactly as authored', () => {
    const out = contextualizeMcqQuestion('I drank ___ water after the long run.');
    expect(out.question).toBe('I drank ___ water after the long run.');
    expect(out.question).not.toContain('Fill in the blank');
  });

  it('still terminates a stem that was authored without punctuation', () => {
    expect(contextualizeMcqQuestion('The dog ___ loudly').question).toBe('The dog ___ loudly.');
  });

  it('classifies by the stem itself, not by a wrapper it was given', () => {
    expect(contextualizeMcqQuestion('The dog ___ loudly.').questionType).toBe('sentence-completion');
    expect(contextualizeMcqQuestion('Which word means happy?').questionType).toBe('question-response');
  });

  it('ships no question twice', () => {
    // The banks used to hold ~6 copies of every sentence, told apart only by
    // the wrapper. A repeat here means padding has crept back in.
    for (const [label, bank] of [['grammar', GRAMMAR_MCQ_ITEMS], ['vocab', VOCAB_MCQ_ITEMS]]) {
      for (const [level, items] of Object.entries(bank)) {
        const stems = items.map(i => i.q.trim().toLowerCase());
        expect(new Set(stems).size, `${label}/${level}`).toBe(items.length);
      }
    }
  });
});

describe('what Giri says when he reads a question', () => {
  it('speaks the gap instead of swallowing it', () => {
    // "___" is read as underscores or as nothing at all, which leaves a
    // listening child a sentence with a hole and no idea where it was.
    expect(speakableStem('I drank ___ water.')).toBe('I drank blank water.');
  });

  it('handles a blank of any length', () => {
    expect(speakableStem('The dog __ loudly.')).toBe('The dog blank loudly.');
    expect(speakableStem('He ______ home.')).toBe('He blank home.');
  });

  it('leaves an ordinary sentence untouched', () => {
    expect(speakableStem('Which word means happy?')).toBe('Which word means happy?');
  });

  it('does not leave a gap before punctuation that followed the blank', () => {
    // "the key is blank ." reads with an audible stumble on some engines.
    expect(speakableStem('The spare key is ___.')).toBe('The spare key is blank.');
    expect(speakableStem('Is it ___?')).toBe('Is it blank?');
  });

  it('reads the choices out too', () => {
    // A child listening rather than reading cannot scan the four buttons.
    const script = buildReadAloudScript('I drank ___ water.', ['much', 'many', 'any', 'some']);
    expect(script).toEqual([
      'I drank blank water.',
      'Your choices are: much, many, any, some.',
    ]);
  });

  it('reads a question with no choices without inventing a line', () => {
    expect(buildReadAloudScript('Which word means happy?', [])).toEqual(['Which word means happy?']);
  });
});
