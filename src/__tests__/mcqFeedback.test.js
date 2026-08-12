import { beforeEach, describe, expect, it, vi } from 'vitest';
import { store } from '../modules/store.js';
import { attachMcqAnswerLadder, buildMcqFeedback } from '../modes/mcqFeedback.js';
import { teacherFeedbackText } from '../modules/teacherFeedback.js';

const ARTICLE_ITEM = {
  q: 'She waited for ___ hour.',
  answer: 'an',
  choices: ['a', 'an', 'the'],
  category: 'articles',
  explain: 'Use "an" before vowel sounds.',
  optionExplanations: {
    a: 'Wrong — "hour" starts with a vowel sound.',
    an: 'Correct — use "an" before vowel sounds.',
    the: 'Wrong — "the" is for a specific noun.',
  },
};

beforeEach(() => {
  store.set('misconceptionLog', {});
  document.body.innerHTML = '';
});

describe('buildMcqFeedback', () => {
  it('coaches on the first wrong tap without naming the answer', () => {
    const fb = buildMcqFeedback({
      item: ARTICLE_ITEM,
      selectedChoice: 'a',
      isCorrect: false,
      attempt: 1,
      domain: 'grammar',
    });

    expect(fb.stage).toBe('coach');
    expect(fb.misconceptionId).toBe('article-sound');
    expect(teacherFeedbackText(fb)).toContain('vowel sound');
    expect(teacherFeedbackText(fb)).not.toContain('Answer:');
  });

  it('uses the authored explanation for the chosen distractor when re-teaching', () => {
    const fb = buildMcqFeedback({
      item: ARTICLE_ITEM,
      selectedChoice: 'a',
      isCorrect: false,
      attempt: 2,
    });

    const text = teacherFeedbackText(fb);
    expect(text).toContain('"hour" starts with a vowel sound');
    // the authored "Wrong — " prefix is dropped: the headline already says it
    expect(text).not.toContain('Wrong —');
    expect(text).not.toContain('specific noun');
    expect(text).toContain('Answer: an');
  });

  it('falls back to the general explanation when no per-option text exists', () => {
    const fb = buildMcqFeedback({
      item: {
        q: 'The boys ___ playing.',
        answer: 'were',
        choices: ['was', 'were'],
        explain: 'Make the verb agree with the plural subject.',
      },
      selectedChoice: 'was',
      isCorrect: false,
      attempt: 2,
    });

    expect(teacherFeedbackText(fb)).toContain('Make the verb agree with the plural subject.');
  });

  it('offers the clue words as the thing to look at', () => {
    const fb = buildMcqFeedback({
      item: {
        q: 'The boys ___ playing.',
        answer: 'were',
        choices: ['was', 'were'],
        clueWords: ['boys'],
      },
      selectedChoice: 'was',
      isCorrect: false,
      attempt: 1,
    });

    // The stem gives no separate evidence phrase, so the authored clue words fill in.
    expect(teacherFeedbackText(fb)).toContain('boys');
  });

  it('withholds the clue words in challenge mode', () => {
    const fb = buildMcqFeedback({
      item: {
        q: 'The boys ___ playing.',
        answer: 'were',
        choices: ['was', 'were'],
        clueWords: ['boys'],
      },
      selectedChoice: 'was',
      isCorrect: false,
      attempt: 1,
      showClueWords: false,
    });

    expect(teacherFeedbackText(fb)).not.toContain('boys');
  });

  it('explains a correct answer rather than only marking it', () => {
    const fb = buildMcqFeedback({
      item: ARTICLE_ITEM,
      selectedChoice: 'an',
      isCorrect: true,
      tip: { rule: 'Use "an" before vowel sounds.' },
    });

    expect(fb.stage).toBe('praise');
    expect(teacherFeedbackText(fb)).toContain('use "an" before vowel sounds.');
  });
});

describe('attachMcqAnswerLadder', () => {
  function mountRound(item = ARTICLE_ITEM) {
    document.body.innerHTML = `
      <div id="root">
        <div class="pt-choices">
          ${item.choices.map((c) => `<button class="pt-choice-btn" data-choice="${c}">${c}</button>`).join('')}
        </div>
        <p id="fb"></p>
        <div id="next-wrap" style="display:none"><button id="next">Next</button></div>
      </div>`;
    return {
      root: document.getElementById('root'),
      feedbackEl: document.getElementById('fb'),
      nextWrap: document.getElementById('next-wrap'),
      nextBtn: document.getElementById('next'),
      choice: (value) => document.querySelector(`[data-choice="${value}"]`),
    };
  }

  it('keeps the round open after one wrong tap and hides the answer', () => {
    const dom = mountRound();
    const onFirstAttempt = vi.fn();
    const onResolved = vi.fn();
    attachMcqAnswerLadder({
      ...dom,
      item: ARTICLE_ITEM,
      onFirstAttempt,
      onResolved,
      mode: 'grammarMcq',
    });

    dom.choice('a').click();

    expect(onFirstAttempt).toHaveBeenCalledWith(false, 'a');
    expect(onResolved).not.toHaveBeenCalled();
    expect(dom.choice('a').disabled).toBe(true);
    expect(dom.choice('an').disabled).toBe(false);
    expect(dom.choice('an').classList.contains('pt-choice--correct')).toBe(false);
    expect(dom.nextWrap.style.display).toBe('none');
    expect(dom.feedbackEl.innerHTML).toContain('tf-feedback--coach');
  });

  it('resolves on the second tap and reveals the answer', () => {
    const dom = mountRound();
    const onFirstAttempt = vi.fn();
    const onResolved = vi.fn();
    attachMcqAnswerLadder({
      ...dom,
      item: ARTICLE_ITEM,
      onFirstAttempt,
      onResolved,
      mode: 'grammarMcq',
    });

    dom.choice('a').click();
    dom.choice('the').click();

    expect(onFirstAttempt).toHaveBeenCalledTimes(1);
    expect(onResolved).toHaveBeenCalledWith({ correct: false, attempts: 2, chosen: 'the' });
    expect(dom.choice('an').classList.contains('pt-choice--correct')).toBe(true);
    expect(dom.nextWrap.style.display).toBe('');
    expect(dom.feedbackEl.innerHTML).toContain('tf-feedback--reteach');
  });

  it('scores the first attempt only, so a self-correction is not marked right', () => {
    const dom = mountRound();
    const onFirstAttempt = vi.fn();
    const onResolved = vi.fn();
    attachMcqAnswerLadder({
      ...dom,
      item: ARTICLE_ITEM,
      onFirstAttempt,
      onResolved,
      mode: 'grammarMcq',
    });

    dom.choice('a').click();
    dom.choice('an').click();

    expect(onFirstAttempt).toHaveBeenCalledTimes(1);
    expect(onFirstAttempt).toHaveBeenCalledWith(false, 'a');
    expect(onResolved).toHaveBeenCalledWith({ correct: true, attempts: 2, chosen: 'an' });
    expect(dom.feedbackEl.innerHTML).toContain('tf-feedback--praise-recovered');
  });

  it('finishes immediately on a correct first tap', () => {
    const dom = mountRound();
    const onResolved = vi.fn();
    attachMcqAnswerLadder({ ...dom, item: ARTICLE_ITEM, onResolved, mode: 'grammarMcq' });

    dom.choice('an').click();

    expect(onResolved).toHaveBeenCalledWith({ correct: true, attempts: 1, chosen: 'an' });
    expect(dom.choice('a').disabled).toBe(true);
    expect(dom.nextWrap.style.display).toBe('');
  });

  it('ignores further taps once the item is resolved', () => {
    const dom = mountRound();
    const onResolved = vi.fn();
    attachMcqAnswerLadder({ ...dom, item: ARTICLE_ITEM, onResolved, mode: 'grammarMcq' });

    dom.choice('an').click();
    dom.choice('a').dispatchEvent(new Event('click'));

    expect(onResolved).toHaveBeenCalledTimes(1);
  });

  it('appends mode-specific extras only on a wrong answer', () => {
    const dom = mountRound();
    attachMcqAnswerLadder({
      ...dom,
      item: ARTICLE_ITEM,
      mode: 'grammarMcq',
      extraHtml: (_chosen, ok) =>
        ok ? '' : '<p class="tf-section--redirect">Try Cloze Castle</p>',
    });

    dom.choice('a').click();
    expect(dom.feedbackEl.innerHTML).toContain('Try Cloze Castle');
  });

  it('moves focus off the ruled-out choice so keyboard users are not stranded', () => {
    const dom = mountRound();
    attachMcqAnswerLadder({ ...dom, item: ARTICLE_ITEM, mode: 'grammarMcq' });

    dom.choice('a').focus();
    dom.choice('a').click();

    expect(document.activeElement).not.toBe(dom.choice('a'));
    expect(document.activeElement.dataset.choice).toBe('an');
  });
});
