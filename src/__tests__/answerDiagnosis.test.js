import { describe, expect, it } from 'vitest';
import {
  diagnoseAnswer,
  diagnoseWrittenAnswer,
  editDistance,
  findTimeMarker,
  gapContext,
  verbLemma,
} from '../modules/answerDiagnosis.js';

describe('gapContext', () => {
  it('splits a stem around the blank', () => {
    const ctx = gapContext('The boys ___ playing football.');
    expect(ctx.hasGap).toBe(true);
    expect(ctx.before).toEqual(['the', 'boys']);
    expect(ctx.after).toEqual(['playing', 'football']);
  });

  it('treats a numbered blank as a gap', () => {
    expect(gapContext('Sara (1) to the shop.').hasGap).toBe(true);
  });

  it('reports no gap for a plain question', () => {
    const ctx = gapContext('Which word means very happy?');
    expect(ctx.hasGap).toBe(false);
    expect(ctx.after).toEqual([]);
  });
});

describe('findTimeMarker', () => {
  it('finds a past marker', () => {
    expect(findTimeMarker('Yesterday she ___ to school.')).toEqual({
      phrase: 'yesterday',
      tense: 'past',
    });
  });

  it('prefers the longer phrase', () => {
    expect(findTimeMarker('Every day he ___ rice.').phrase).toBe('every day');
  });

  it('returns null when there is no time signal', () => {
    expect(findTimeMarker('The cat ___ on the mat.')).toBeNull();
  });
});

describe('verbLemma', () => {
  it.each([
    ['went', 'go'],
    ['goes', 'go'],
    ['running', 'run'],
    ['stopped', 'stop'],
    ['carried', 'carry'],
    ['watches', 'watch'],
    ['taught', 'teach'],
    ['makes', 'make'],
  ])('%s → %s', (form, lemma) => {
    expect(verbLemma(form)).toBe(lemma);
  });
});

describe('editDistance', () => {
  it('counts single-character edits', () => {
    expect(editDistance('beautiful', 'beautifull')).toBe(1);
    expect(editDistance('cat', 'cat')).toBe(0);
    expect(editDistance('', 'abc')).toBe(3);
  });
});

describe('diagnoseAnswer — grammar', () => {
  it('names subject-verb agreement', () => {
    const d = diagnoseAnswer({ stem: 'The boys ___ playing.', given: 'is', correct: 'are' });
    expect(d.id).toBe('subject-verb-agreement');
    expect(d.matched).toBe(true);
  });

  it('distinguishes agreement with the nearest noun', () => {
    const d = diagnoseAnswer({ stem: 'The box of apples ___ heavy.', given: 'are', correct: 'is' });
    expect(d.id).toBe('agreement-with-nearest-noun');
  });

  it('spots a missed time marker', () => {
    const d = diagnoseAnswer({
      stem: 'Yesterday she ___ to the market.',
      given: 'walks',
      correct: 'walked',
    });
    expect(d.id).toBe('tense-time-marker');
    expect(d.evidence).toBe('yesterday');
  });

  it('falls back to a plain tense slip without a time word', () => {
    const d = diagnoseAnswer({ stem: 'She ___ to the market.', given: 'walks', correct: 'walked' });
    expect(d.id).toBe('tense-choice');
  });

  it('spots an inflected verb after a helper word', () => {
    const d = diagnoseAnswer({ stem: 'She can ___ very fast.', given: 'swims', correct: 'swim' });
    expect(d.id).toBe('verb-form-after-helper');
    expect(d.evidence).toBe('can');
  });

  it('names a / an as a sound decision', () => {
    expect(diagnoseAnswer({ stem: 'She waited ___ hour.', given: 'a', correct: 'an' }).id).toBe(
      'article-sound',
    );
  });

  it('separates a / the from a / an', () => {
    expect(diagnoseAnswer({ stem: 'I saw ___ dog.', given: 'the', correct: 'a' }).id).toBe(
      'article-specificity',
    );
  });

  it('names pronoun case', () => {
    expect(diagnoseAnswer({ stem: 'Give the book to ___.', given: 'I', correct: 'me' }).id).toBe(
      'pronoun-case',
    );
  });

  it('names comparative vs superlative and points at "than"', () => {
    const d = diagnoseAnswer({ stem: 'Ali is ___ than Ben.', given: 'tallest', correct: 'taller' });
    expect(d.id).toBe('comparative-vs-superlative');
    expect(d.evidence).toBe('than');
  });

  it('names countable / uncountable', () => {
    expect(
      diagnoseAnswer({ stem: 'How ___ water is left?', given: 'many', correct: 'much' }).id,
    ).toBe('countable-uncountable');
  });

  it('names preposition collocation and quotes the pairing', () => {
    const d = diagnoseAnswer({ stem: 'She is good ___ drawing.', given: 'in', correct: 'at' });
    expect(d.id).toBe('preposition-collocation');
    expect(d.evidence).toBe('good at');
  });

  it('names connector meaning', () => {
    expect(
      diagnoseAnswer({ stem: 'It rained, ___ we stayed in.', given: 'but', correct: 'so' }).id,
    ).toBe('connector-meaning');
  });

  it('names homophone confusion', () => {
    const d = diagnoseAnswer({ stem: '___ bags are wet.', given: 'There', correct: 'Their' });
    expect(d.id).toBe('homophone-confusion');
    expect(d.evidence).toContain('their');
  });

  it('names an irregular plural slip', () => {
    expect(
      diagnoseAnswer({ stem: 'Three ___ ran past.', given: 'childs', correct: 'children' }).id,
    ).toBe('noun-number');
  });
});

describe('diagnoseAnswer — vocabulary and spelling', () => {
  it('names word form when the stem is shared', () => {
    const d = diagnoseAnswer({
      stem: 'He drove ___ through the rain.',
      given: 'careful',
      correct: 'carefully',
      domain: 'vocab',
    });
    expect(d.id).toBe('word-form');
  });

  it('names a spelling slip for a near-miss', () => {
    const d = diagnoseAnswer({ given: 'beautifull', correct: 'beautiful', domain: 'vocab' });
    expect(d.id).toBe('spelling-slip');
  });

  it('falls back to word choice for an unrelated vocabulary distractor', () => {
    const d = diagnoseAnswer({
      stem: 'The crowd was ___.',
      given: 'delighted',
      correct: 'enormous',
      domain: 'vocab',
    });
    expect(d.id).toBe('word-choice-context');
    expect(d.matched).toBe(false);
  });

  it('falls back to evidence checking for comprehension', () => {
    const d = diagnoseAnswer({ given: 'the dog', correct: 'the postman', domain: 'comprehension' });
    expect(d.id).toBe('evidence-not-checked');
  });

  it('treats an empty answer as its own case', () => {
    expect(diagnoseAnswer({ given: '', correct: 'were' }).id).toBe('no-answer');
  });
});

describe('diagnoseWrittenAnswer', () => {
  it('flags a missing required opening', () => {
    const d = diagnoseWrittenAnswer({
      given: 'He sat down and the bell rang.',
      model: 'No sooner had he sat down than the bell rang.',
      requiredWords: ['no', 'sooner'],
    });
    expect(d.id).toBe('structure-not-followed');
    expect(d.evidence).toContain('sooner');
  });

  it('flags an answer far shorter than the model', () => {
    const d = diagnoseWrittenAnswer({
      given: 'She was late.',
      model: 'She was late because the bus broke down on the way to school.',
    });
    expect(d.id).toBe('incomplete-answer');
  });

  it('falls through to word-level diagnosis for a one-word difference', () => {
    const d = diagnoseWrittenAnswer({
      given: 'The boys is playing football',
      model: 'The boys are playing football',
      domain: 'grammar',
    });
    expect(d.id).toBe('subject-verb-agreement');
  });

  it('treats an empty response as no answer', () => {
    expect(diagnoseWrittenAnswer({ given: '   ', model: 'anything' }).id).toBe('no-answer');
  });
});
