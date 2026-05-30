import { describe, expect, it } from 'vitest';
import { buildMcqFeedbackHtml } from '../modes/mcqFeedback.js';

describe('buildMcqFeedbackHtml', () => {
  it('shows the selected distractor explanation and keeps the general rule', () => {
    const html = buildMcqFeedbackHtml({
      answer: 'an',
      explain: 'Use "an" before vowel sounds.',
      optionExplanations: {
        a: 'Wrong — "hour" starts with a vowel sound.',
        an: 'Correct — use "an" before vowel sounds.',
        the: 'Wrong — "the" is for a specific noun.',
      },
    }, 'a', false);

    expect(html).toContain('Correct answer:</strong> an');
    expect(html).toContain('Wrong — &quot;hour&quot; starts with a vowel sound.');
    expect(html).toContain('Use "an" before vowel sounds.');
    expect(html).not.toContain('specific noun');
  });

  it('falls back to the existing explanation when option explanations are absent', () => {
    const html = buildMcqFeedbackHtml({
      answer: 'were',
      explain: 'Make the verb agree with the plural subject.',
      clueWords: ['boys', 'yesterday'],
    }, 'was', false);

    expect(html).toContain('Correct answer:</strong> were');
    expect(html).toContain('mcq-clue-chip">boys</span>');
    expect(html).toContain('Make the verb agree with the plural subject.');
  });

  it('can explain why a correct option is correct', () => {
    const html = buildMcqFeedbackHtml({
      answer: 'quietly',
      optionExplanations: {
        quietly: 'Correct — the adverb tells how she entered.',
      },
    }, 'quietly', true);

    expect(html).toContain('Correct!');
    expect(html).toContain('Correct — the adverb tells how she entered.');
  });

  it('can suppress clue words for challenge mode feedback', () => {
    const html = buildMcqFeedbackHtml({
      answer: 'were',
      explain: 'Make the verb agree with the plural subject.',
      clueWords: ['boys', 'yesterday'],
    }, 'was', false, { showClueWords: false });

    expect(html).toContain('Correct answer:</strong> were');
    expect(html).not.toContain('mcq-clue-chip');
    expect(html).toContain('Make the verb agree with the plural subject.');
  });

});
