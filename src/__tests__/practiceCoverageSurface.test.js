/*
 * Audit 2026-09-19, finding 12 — what the screen actually says.
 *
 * `practiceSeedCoverage.test.js` checks the data and the counting. This checks
 * the sentence a parent reads over their child's shoulder, because that is the
 * number the brief is about: "anything that produces a number a parent or
 * teacher will read must be correct before it is shown".
 *
 * Before this change the P1 Articles tile read "102 questions · 0 / 27
 * passages", describing 27 pieces of work that are four passages and fifteen
 * blanks, re-presented.
 */

/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';

globalThis.speechSynthesis = {
  getVoices: () => [],
  addEventListener: () => {},
  cancel: () => {},
  speak: () => {},
};
globalThis.SpeechSynthesisUtterance = class {
  constructor(text) {
    this.text = text;
  }
};

const { initClozeCastle, showClozeBrowser } = await import('../modes/clozeCastle.js');
const { seedBreakdown } = await import('../data/practiceSeeds.js');
const { passages } = await import('../data/passages.js');

function mount() {
  document.body.innerHTML = '<div id="cloze-host"></div>';
  const host = document.getElementById('cloze-host');
  initClozeCastle(host, () => {});
  showClozeBrowser();
  return host;
}

describe('Cloze Castle reports coverage, not shelf length (finding 12)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('a level tile counts distinct passages and names the repeats separately', () => {
    const host = mount();
    const p1 = host.querySelector('[data-level="P1"]');
    expect(p1, 'P1 level tile').toBeTruthy();

    const expected = Object.values(passages.P1).map(seedBreakdown);
    const seeds = expected.reduce((sum, b) => sum + b.seeds, 0);
    const questions = expected.reduce((sum, b) => sum + b.seedQuestions, 0);
    const revision = expected.reduce((sum, b) => sum + b.variants, 0);
    const shown = expected.reduce((sum, b) => sum + b.shown, 0);

    // The bank really does hold far more rounds than passages — if it stopped
    // doing so this test would be proving nothing.
    expect(shown).toBeGreaterThan(seeds * 3);

    const count = p1.querySelector('.cloze-level-count').textContent;
    expect(count).toContain(`${questions} questions`);
    expect(count).toContain(`0 / ${seeds} passages done`);
    // The inflated figures are gone from the line a parent reads.
    expect(count).not.toContain(`${shown} passages`);

    expect(p1.querySelector('.cloze-level-revision').textContent).toContain(
      `+ ${revision} revision rounds`,
    );
  });

  it('a topic tile does the same — P1 Articles is four passages, not 27', () => {
    const host = mount();
    host.querySelector('[data-level="P1"]').click();

    const articles = host.querySelector('[data-cat="articles"]');
    expect(articles, 'articles topic tile').toBeTruthy();

    const text = articles.querySelector('.cloze-cat-count').textContent;
    expect(text).toContain('15 questions');
    expect(text).toContain('0 / 4 passages');
    expect(text).toContain('+23 revision rounds');
    expect(text).not.toContain('102 questions');
    expect(text).not.toContain('27 passages');
  });
});
