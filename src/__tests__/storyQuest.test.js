/**
 * @vitest-environment jsdom
 */
/*
 * Story Quest questions. Every right answer in the story bank is stored as
 * the first option, and the options used to be shown in that order, so a
 * child could tap A every time and score full marks without reading.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NOT_SAID, displayOrder, runStoryQuest } from '../modes/storyQuest.js';
import { STORIES } from '../data/stories.js';

/** A small seeded generator, so the shuffles are the same on every run. */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function openFirstQuestion(story) {
  document.body.innerHTML = '<div id="host"></div>';
  runStoryQuest(document.getElementById('host'), story, () => {});
  document.getElementById('sq-start').click();
  return [...document.querySelectorAll('.sq-option')];
}

const withQuestions = STORIES.filter((s) => s.comprehension?.length);

describe('Story Quest answer options', () => {
  afterEach(() => vi.restoreAllMocks());

  it('does not always show the right answer first', () => {
    vi.spyOn(Math, 'random').mockImplementation(seeded(7));
    const places = new Map();
    for (const story of withQuestions) {
      const q = story.comprehension[0];
      const buttons = openFirstQuestion(story);
      const place = buttons.findIndex((b) => Number(b.dataset.idx) === q.answer);
      places.set(place, (places.get(place) ?? 0) + 1);
    }
    expect(places.size, 'the right answer should land in more than one place').toBeGreaterThan(1);
    expect(places.get(0) ?? 0).toBeLessThan(withQuestions.length / 2);
  });

  it('shows every option once, lettered in the order shown', () => {
    vi.spyOn(Math, 'random').mockImplementation(seeded(11));
    for (const story of withQuestions) {
      const q = story.comprehension[0];
      const buttons = openFirstQuestion(story);
      const texts = buttons.map((b) => b.querySelector('.sq-option-text').textContent.trim());
      expect([...texts].sort(), story.id).toEqual([...q.options].sort());
      const letters = buttons.map((b) => b.querySelector('.sq-option-letter').textContent.trim());
      expect(letters, story.id).toEqual(['A', 'B', 'C', 'D'].slice(0, q.options.length));
    }
  });

  describe('checking an answer', () => {
    const story = withQuestions[0];
    const q = story.comprehension[0];
    let buttons;
    beforeEach(() => {
      // Math.random() = 0 moves the stored first option (the answer) to the end.
      vi.spyOn(Math, 'random').mockReturnValue(0);
      buttons = openFirstQuestion(story);
    });

    it('accepts the right option wherever it is shown', () => {
      const right = buttons.find((b) => Number(b.dataset.idx) === q.answer);
      expect(buttons.indexOf(right)).not.toBe(0);
      right.click();
      expect(document.getElementById('sq-feedback').className).toContain('sq-feedback--correct');
      expect(right.classList.contains('sq-option--correct')).toBe(true);
    });

    it('marks the right option, not the one in its old place, after a wrong answer', () => {
      const wrong = buttons.filter((b) => Number(b.dataset.idx) !== q.answer);
      wrong[0].click(); // first miss: sent back to the story
      wrong[1].click(); // second miss: the answer is shown
      const marked = buttons.filter((b) => b.classList.contains('sq-option--correct'));
      expect(marked).toHaveLength(1);
      expect(Number(marked[0].dataset.idx)).toBe(q.answer);
      expect(wrong[1].classList.contains('sq-option--wrong')).toBe(true);
    });
  });
});

describe('the other question kinds', () => {
  /** A small story with one question of each kind and a written answer. */
  const story = {
    id: 'test-kite',
    lines: [
      { type: 'text', text: 'Giri had a red kite.' },
      { type: 'text', text: 'The kite had no tail, so it fell on its side.' },
      { type: 'end', text: 'Giri made a tail, and the kite rose high in the sky.' },
    ],
    comprehension: [
      {
        kind: 'tf',
        q: 'The kite fell on its side.',
        options: ['True', 'False', NOT_SAID],
        answer: 0,
        type: 'literal',
      },
      {
        kind: 'tf',
        q: 'Giri flew the kite with his mum.',
        options: ['True', 'False', NOT_SAID],
        answer: 2,
        type: 'literal',
      },
      {
        kind: 'gap',
        q: 'Giri had a red ___.',
        options: ['kite', 'kit', 'cat'],
        answer: 0,
        type: 'vocabulary',
      },
      {
        kind: 'order',
        q: 'Put these in the order they happened.',
        events: ['The kite fell on its side.', 'Giri made a tail.', 'The kite rose high.'],
        type: 'sequence',
      },
    ],
    openEnded: [
      {
        q: 'Why did the kite fall?',
        sampleAnswer: 'It fell because it had no tail.',
        markingGuide: 'Says the kite had no tail.',
      },
    ],
  };

  const start = () => {
    document.body.innerHTML = '<div id="host"></div>';
    runStoryQuest(document.getElementById('host'), story, () => {});
    document.getElementById('sq-start').click();
  };
  const options = () => [...document.querySelectorAll('.sq-option')];
  const byText = (text) =>
    options().find((b) => b.querySelector('.sq-option-text').textContent.trim() === text);
  const next = () => document.getElementById('sq-next').click();
  const feedback = () => document.getElementById('sq-feedback');

  beforeEach(() => vi.spyOn(Math, 'random').mockImplementation(seeded(3)));
  afterEach(() => vi.restoreAllMocks());

  it('true or false keeps True, False, then "the story does not say"', () => {
    start();
    expect(document.querySelector('.sq-kind-label').textContent).toContain('True or false');
    expect(options().map((b) => b.querySelector('.sq-option-text').textContent.trim())).toEqual([
      'True',
      'False',
      NOT_SAID,
    ]);
    byText('True').click();
    expect(feedback().className).toContain('sq-feedback--correct');
  });

  it('sends a child back to the story when the story does not say, then praises the check', () => {
    start();
    byText('True').click();
    next();
    byText('True').click();
    expect(feedback().className).toContain('sq-feedback--retry');
    expect(feedback().textContent).toContain('can you find a sentence');
    byText(NOT_SAID).click();
    expect(feedback().className).toContain('sq-feedback--correct');
    expect(feedback().textContent).toContain('never says');
  });

  it('fills the gap with the word once it is answered', () => {
    start();
    byText('True').click();
    next();
    byText(NOT_SAID).click();
    next();
    expect(document.getElementById('sq-gap').textContent).toBe('blank');
    byText('kite').click();
    const gap = document.getElementById('sq-gap');
    expect(gap.textContent).toBe('kite');
    expect(gap.classList.contains('sq-gap--filled')).toBe(true);
  });

  describe('put in order', () => {
    const toOrder = () => {
      start();
      byText('True').click();
      next();
      byText(NOT_SAID).click();
      next();
      byText('kite').click();
      next();
    };
    const tap = (i) => byText(story.comprehension[3].events[i]).click();

    it('is never shown already in order', () => {
      toOrder();
      const shown = options().map((b) => Number(b.dataset.idx));
      expect(shown).not.toEqual([0, 1, 2]);
    });

    it('numbers each tap, and Undo takes the last one back', () => {
      toOrder();
      tap(0);
      const first = byText(story.comprehension[3].events[0]);
      expect(first.querySelector('.sq-option-letter').textContent).toBe('1');
      expect(first.disabled).toBe(true);
      document.getElementById('sq-order-undo').click();
      expect(first.querySelector('.sq-option-letter').textContent).toBe('?');
      expect(first.disabled).toBe(false);
    });

    it('gives a wrong order one more go, then accepts the right one', () => {
      toOrder();
      tap(1);
      tap(0);
      tap(2);
      expect(feedback().className).toContain('sq-feedback--retry');
      expect(options().every((b) => !b.disabled)).toBe(true);
      tap(0);
      tap(1);
      tap(2);
      expect(feedback().className).toContain('sq-feedback--correct');
      // Shown in the story's order, numbered.
      expect(options().map((b) => b.querySelector('.sq-option-letter').textContent)).toEqual([
        '1',
        '2',
        '3',
      ]);
      expect(options().map((b) => Number(b.dataset.idx))).toEqual([0, 1, 2]);
    });

    it('shows the story order after a second wrong try', () => {
      toOrder();
      for (let round = 0; round < 2; round++) {
        tap(2);
        tap(1);
        tap(0);
      }
      expect(feedback().className).toContain('sq-feedback--wrong');
      expect(options().map((b) => Number(b.dataset.idx))).toEqual([0, 1, 2]);
    });
  });

  it('asks for a written answer, with a good answer behind a tap, then counts the score', () => {
    start();
    byText('True').click();
    next();
    byText(NOT_SAID).click();
    next();
    byText('kite').click();
    next();
    for (const i of [0, 1, 2]) byText(story.comprehension[3].events[i]).click();
    next();
    const box = document.getElementById('sq-written-0');
    expect(document.querySelector(`label[for="sq-written-0"]`).textContent).toContain(
      'Why did the kite fall?',
    );
    expect(box.tagName).toBe('TEXTAREA');
    expect(document.querySelector('.sq-written-model summary').textContent).toContain(
      'See a good answer',
    );
    document.getElementById('sq-open-next').click();
    expect(document.querySelector('.sq-score-num').textContent).toBe('4');
    expect(document.querySelector('.sq-score-denom').textContent).toContain('4');
  });
});

describe('displayOrder', () => {
  afterEach(() => vi.restoreAllMocks());

  it('always puts "the story does not say" last', () => {
    vi.spyOn(Math, 'random').mockImplementation(seeded(5));
    for (let i = 0; i < 20; i++) {
      const order = displayOrder({ options: [NOT_SAID, 'a', 'b', 'c'], answer: 0 });
      expect(order.at(-1)).toBe(0);
    }
  });
});
