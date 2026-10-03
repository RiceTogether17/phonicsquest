/**
 * @vitest-environment jsdom
 */
/*
 * Story Quest questions. Every right answer in the story bank is stored as
 * the first option, and the options used to be shown in that order, so a
 * child could tap A every time and score full marks without reading.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runStoryQuest } from '../modes/storyQuest.js';
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
