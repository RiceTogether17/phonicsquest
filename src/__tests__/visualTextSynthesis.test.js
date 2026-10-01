import { describe, it, expect } from 'vitest';
import { VISUAL_TEXT_ITEMS } from '../data/visualTextItems.js';
import { SYNTHESIS_ITEMS } from '../data/synthesisItems.js';
import { OPEN_COMPREHENSION_PASSAGES } from '../data/openComprehensionPassages.js';
import { buildPlaceholderHtml } from '../modes/primaryPlaceholders.js';

describe('VISUAL_TEXT_ITEMS data bank', () => {
  it('has at least 20 items', () => {
    expect(VISUAL_TEXT_ITEMS.length).toBeGreaterThanOrEqual(20);
  });

  it('covers all primary levels P1–P6', () => {
    const levels = new Set(VISUAL_TEXT_ITEMS.map((i) => i.level));
    for (const l of ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']) {
      expect(levels, `missing level ${l}`).toContain(l);
    }
  });

  it('every item has exactly 3 questions with answers', () => {
    for (const item of VISUAL_TEXT_ITEMS) {
      expect(Array.isArray(item.questions), `${item.id} questions must be array`).toBe(true);
      expect(item.questions.length, `${item.id} must have 3 questions`).toBe(3);
      for (const q of item.questions) {
        expect(q.q, `${item.id} question text missing`).toBeTruthy();
        expect(q.a, `${item.id} question answer missing`).toBeTruthy();
      }
    }
  });

  it('every item has id, level, title and poster text', () => {
    for (const item of VISUAL_TEXT_ITEMS) {
      expect(item.id, 'missing id').toBeTruthy();
      expect(item.level, `${item.id} missing level`).toMatch(/^P[1-6]$/);
      expect(item.title, `${item.id} missing title`).toBeTruthy();
      expect(item.poster, `${item.id} missing poster text`).toBeTruthy();
    }
  });

  it('ids are unique', () => {
    const ids = VISUAL_TEXT_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('renders the visual-text section header and a host for its items', () => {
    // Audit 2026-09-19, finding 17: this used to assert that an item title
    // appeared in the static HTML, because every item of every grade was
    // rendered into one page — 63 answer boxes, starting at P1 whatever grade
    // the child is in. Items now paint after mount, one at a time, so the
    // static body carries the header and the runner's host. The items
    // themselves are covered in primarySectionRunner.test.js, through the real
    // mount path.
    const html = buildPlaceholderHtml('visual-text');
    expect(html).toContain('Visual Text Comprehension');
    expect(html).toContain('data-section-runner');
  });
});

describe('SYNTHESIS_ITEMS data bank', () => {
  it('has at least 30 items', () => {
    expect(SYNTHESIS_ITEMS.length).toBeGreaterThanOrEqual(30);
  });

  it('covers P4, P5 and P6', () => {
    const levels = new Set(SYNTHESIS_ITEMS.map((i) => i.level));
    expect(levels).toContain('P4');
    expect(levels).toContain('P5');
    expect(levels).toContain('P6');
  });

  it('every item has required fields', () => {
    for (const item of SYNTHESIS_ITEMS) {
      expect(item.id, 'missing id').toBeTruthy();
      expect(item.level, `${item.id} missing level`).toMatch(/^P[4-6]$/);
      expect(item.skill, `${item.id} missing skill`).toBeTruthy();
      expect(item.original, `${item.id} missing original`).toBeTruthy();
      expect(item.answer, `${item.id} missing answer`).toBeTruthy();
    }
  });

  it('alternates is always an array', () => {
    for (const item of SYNTHESIS_ITEMS) {
      expect(Array.isArray(item.alternates), `${item.id} alternates must be array`).toBe(true);
    }
  });

  it('ids are unique', () => {
    const ids = SYNTHESIS_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('renders synthesis placeholder html with items', () => {
    const html = buildPlaceholderHtml('synthesis');
    expect(html).toContain('Synthesis');
    expect(html).toContain(SYNTHESIS_ITEMS[0].skill);
  });
});

describe('OPEN_COMPREHENSION_PASSAGES data bank', () => {
  it('has at least 20 passages', () => {
    expect(OPEN_COMPREHENSION_PASSAGES.length).toBeGreaterThanOrEqual(20);
  });

  it('covers P1 through P6', () => {
    const levels = new Set(OPEN_COMPREHENSION_PASSAGES.map((p) => p.level));
    for (const l of ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']) {
      expect(levels, `missing level ${l}`).toContain(l);
    }
  });

  it('every passage has id, title, passage text and questions', () => {
    for (const item of OPEN_COMPREHENSION_PASSAGES) {
      expect(item.id, 'missing id').toBeTruthy();
      expect(item.title, `${item.id} missing title`).toBeTruthy();
      expect(item.passage, `${item.id} missing passage`).toBeTruthy();
      expect(Array.isArray(item.questions), `${item.id} questions must be array`).toBe(true);
      expect(item.questions.length, `${item.id} needs at least 2 questions`).toBeGreaterThanOrEqual(
        2,
      );
    }
  });

  it('every question has a model answer', () => {
    for (const item of OPEN_COMPREHENSION_PASSAGES) {
      for (const q of item.questions) {
        expect(q.q, `${item.id} question text missing`).toBeTruthy();
        expect(q.model, `${item.id} model answer missing`).toBeTruthy();
      }
    }
  });

  it('ids are unique', () => {
    const ids = OPEN_COMPREHENSION_PASSAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('renders the open-comprehension header and a host for its passages', () => {
    // Same change as Visual Text above: 107 answer boxes became one passage at
    // a time. Audit 2026-09-19, finding 17.
    const html = buildPlaceholderHtml('open-comprehension');
    expect(html).toContain('Open-ended Comprehension');
    expect(html).toContain('data-section-runner');
  });
});
