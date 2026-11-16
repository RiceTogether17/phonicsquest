// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  DECK_SIZE,
  advance,
  retreat,
  buildSentenceDeck,
  buildMcqDeck,
  buildPassageDeck,
  initClassLesson,
  showClassLessonBrowser,
  cleanupClassLesson,
} from '../modes/classLesson.js';

const item = (n, category = 'articles') => ({
  q: `Question ${n} ___`,
  choices: ['a', 'an', 'the', 'some'],
  answer: 'an',
  category,
  explain: 'General rule.',
  optionExplanations: { an: `Because ${n}.` },
});

describe('class lesson decks', () => {
  it('turns a sentence into read, ask and make cards', () => {
    const deck = buildSentenceDeck('short-a');
    expect(deck[0]).toMatchObject({ type: 'read', big: 'Sam sat on a mat.' });
    expect(deck[1]).toMatchObject({ type: 'ask', prompt: 'Who sat?', answer: 'Sam' });
    expect(deck.filter((s) => s.type === 'make').length).toBe(4);
    expect(buildSentenceDeck('nope')).toEqual([]);
  });

  it('picks ten questions from one topic and explains the right answer', () => {
    const bank = [
      ...Array.from({ length: 30 }, (_, i) => item(i)),
      ...Array.from({ length: 5 }, (_, i) => item(100 + i, 'pronouns')),
      { q: 'broken', choices: ['x'], answer: 'y', category: 'articles' },
    ];
    const deck = buildMcqDeck(bank, { category: 'articles' });
    expect(deck).toHaveLength(DECK_SIZE);
    expect(deck.every((s) => s.type === 'mcq' && s.choices.includes(s.answer))).toBe(true);
    expect(deck[0].why).toMatch(/^Because/);
    expect(buildMcqDeck(bank, { category: 'pronouns' })).toHaveLength(5);
    expect(buildMcqDeck(bank, {}).length).toBe(DECK_SIZE);
  });

  it('shows a passage first, then each question with its model answer', () => {
    const deck = buildPassageDeck({
      title: 'T',
      passage: 'One.\n\nTwo.',
      questions: [{ q: 'Why?', model: 'Because.' }],
    });
    expect(deck.map((s) => s.type)).toEqual(['passage', 'ask']);
    expect(deck[1]).toMatchObject({ prompt: 'Why?', answer: 'Because.', passage: 'One.\n\nTwo.' });
  });

  it('reveals the answer before moving on, and hides it before going back', () => {
    const deck = buildSentenceDeck('short-a');
    expect(advance(deck, 0, false)).toEqual({ index: 1, revealed: false, done: false });
    expect(advance(deck, 1, false)).toEqual({ index: 1, revealed: true, done: false });
    expect(advance(deck, 1, true)).toEqual({ index: 2, revealed: false, done: false });
    expect(advance(deck, deck.length - 1, false).done).toBe(true);
    expect(retreat(1, true)).toEqual({ index: 1, revealed: false });
    expect(retreat(1, false)).toEqual({ index: 0, revealed: false });
    expect(retreat(0, false)).toEqual({ index: 0, revealed: false });
  });
});

describe('class lesson screen', () => {
  let root;
  const key = (k) =>
    document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

  beforeEach(() => {
    localStorage.clear();
    root = document.createElement('div');
    document.body.appendChild(root);
    initClassLesson(root, vi.fn());
    showClassLessonBrowser();
  });
  afterEach(() => {
    cleanupClassLesson();
    root.remove();
  });

  const openSentences = () => {
    root.querySelector('[data-kind="sentences"]').click();
    root.querySelector('[data-key="short-a"]').click();
  };

  it('runs a sentence deck from the keyboard without saving anything', () => {
    openSentences();
    expect(document.body.classList.contains('class-lesson-on')).toBe(true);
    expect(root.querySelector('.class-lesson-big').textContent).toBe('Sam sat on a mat.');
    expect(root.querySelector('.class-lesson-count').textContent).toMatch(/^1 \/ \d+$/);

    key(' ');
    expect(root.querySelector('.class-lesson-prompt').textContent).toBe('Who sat?');
    expect(root.querySelector('.class-lesson-answer')).toBeNull();
    expect(root.querySelector('[data-cl="next"]').textContent).toContain('Show answer');

    key('ArrowRight');
    expect(root.querySelector('.class-lesson-answer').textContent).toBe('Sam');
    key('ArrowLeft');
    expect(root.querySelector('.class-lesson-answer')).toBeNull();
    key('PageDown');
    key('PageDown');
    expect(root.querySelector('.class-lesson-prompt').textContent).toBe('Where did Sam sit?');

    expect(localStorage.length).toBe(0);
  });

  it('leaves Space on a focused button to the button itself', () => {
    openSentences();
    const exit = root.querySelector('[data-cl="exit"]');
    exit.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(root.querySelector('.class-lesson-count').textContent).toMatch(/^1 \//);
  });

  it('ends on a finish card and Escape returns to the list', () => {
    openSentences();
    for (let i = 0; i < 200 && root.querySelector('[data-cl="next"]'); i++) key('ArrowRight');
    expect(root.querySelector('[data-cl="again"]')).not.toBeNull();
    key('Escape');
    expect(document.body.classList.contains('class-lesson-on')).toBe(false);
    expect(root.querySelector('[data-key="short-a"]')).not.toBeNull();
  });

  it('lets the class pick an option, then marks it on reveal', async () => {
    root.querySelector('[data-kind="grammar"]').click();
    await vi.waitFor(() => expect(root.querySelector('[data-cl="deck"]')).not.toBeNull(), {
      timeout: 15000,
    });
    root.querySelector('[data-cl="deck"]').click();
    await vi.waitFor(() => expect(root.querySelector('.class-lesson-option')).not.toBeNull(), {
      timeout: 15000,
    });
    expect(root.querySelectorAll('.class-lesson-option').length).toBeGreaterThanOrEqual(3);
    key('a');
    expect(root.querySelector('.class-lesson-option[aria-pressed="true"]')).not.toBeNull();
    key(' ');
    expect(root.querySelectorAll('.class-lesson-option.is-right').length).toBe(1);
    key('b');
    expect(root.querySelectorAll('.class-lesson-option[aria-pressed="true"]').length).toBe(1);
  }, 30000);

  it('lists passages for the chosen level and can bring the passage back', async () => {
    root.querySelector('[data-kind="comprehension"]').click();
    await vi.waitFor(() => expect(root.querySelector('[data-cl="deck"]')).not.toBeNull());
    root.querySelector('[data-level="P4"]').click();
    await vi.waitFor(() => expect(root.querySelectorAll('[data-cl="deck"]').length).toBe(4));
    expect(root.querySelector('[data-level="P4"]').getAttribute('aria-pressed')).toBe('true');
    root.querySelector('[data-cl="deck"]').click();
    expect(root.querySelector('.class-lesson-passage')).not.toBeNull();
    key(' ');
    expect(root.querySelector('.class-lesson-passage')).toBeNull();
    key('p');
    expect(root.querySelector('.class-lesson-passage')).not.toBeNull();
  });
});
