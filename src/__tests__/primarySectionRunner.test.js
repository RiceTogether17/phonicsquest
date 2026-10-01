/*
 * Audit 2026-09-19, Findings 17 and 18.
 *
 * 17 — open-ended sections are too large and ignore the learner's grade. A
 * synthetic P6 profile opened Visual Text at P1 with 63 answer boxes,
 * Open-ended Comprehension at P1 with 107, and Situational Writing with 20:
 * every item of every grade in one page. Acceptance: a P6 child lands on P6,
 * and no previous-grade passage is in the default task flow.
 *
 * 18 — Visual Text is largely text-only. Posters were stored as strings and
 * rendered inside `<pre>`, so meaning carried by layout — what is biggest,
 * what is grouped, which column a row belongs to — was not there to read.
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
  constructor(t) {
    this.text = t;
  }
};

const { mountSectionRunner, defaultLevelFor } = await import('../modes/primarySectionRunner.js');
const { renderVisualStimulus } = await import('../modes/visualStimulus.js');
const { mountPlaceholderModule } = await import('../modes/primaryPlaceholders.js');
const { VISUAL_TEXT_ITEMS } = await import('../data/visualTextItems.js');
const { OPEN_COMPREHENSION_PASSAGES } = await import('../data/openComprehensionPassages.js');
const { createProfile, activateProfile } = await import('../modules/profiles.js');

const ALL_LEVELS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

function host() {
  document.body.innerHTML = '<div id="host"></div>';
  return document.getElementById('host');
}

describe('sections open at the learner grade (audit finding 17)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  it('opens a P6 learner at P6, not P1', () => {
    expect(defaultLevelFor(ALL_LEVELS, 'P6')).toBe('P6');
    expect(defaultLevelFor(ALL_LEVELS, 'P3')).toBe('P3');
  });

  it('falls back to the nearest level at or below the learner grade', () => {
    // Situational Writing only has P5 and P6 items. A P3 child should not be
    // dropped into P5 work, and a P6 child meeting a P5-only section should
    // land on P5 rather than the first level in the list.
    expect(defaultLevelFor(['P5', 'P6'], 'P6')).toBe('P6');
    expect(defaultLevelFor(['P5', 'P6'], 'P3')).toBe('P5');
  });

  it('uses the active profile when no grade is passed', () => {
    const p = createProfile('Testy', undefined, undefined, 'primary', { primaryGrade: 'P4' });
    activateProfile(p.id);
    expect(defaultLevelFor(ALL_LEVELS)).toBe('P4');
  });

  it('still works for a visitor with no profile at all', () => {
    expect(defaultLevelFor(ALL_LEVELS)).toBe('P1');
    expect(defaultLevelFor([])).toBe('');
  });

  it('shows a catalogue rather than every item at once', () => {
    const p = createProfile('Testy', undefined, undefined, 'primary', { primaryGrade: 'P6' });
    activateProfile(p.id);

    const el = host();
    mountSectionRunner(el, {
      items: VISUAL_TEXT_ITEMS,
      kind: 'visual-text',
      unit: 'poster',
      renderItem: (item) => `<p class="body">${item.title}</p>`,
    });

    // A list of choices, and no task body yet.
    expect(el.querySelectorAll('[data-psr-open]').length).toBeGreaterThan(0);
    expect(el.querySelectorAll('.body').length).toBe(0);

    // Only the learner's own grade is offered by default.
    const p6Count = VISUAL_TEXT_ITEMS.filter((i) => i.level === 'P6').length;
    expect(el.querySelectorAll('[data-psr-open]').length).toBe(p6Count);
  });

  it('opens exactly one item, with progress and navigation', () => {
    const p = createProfile('Testy', undefined, undefined, 'primary', { primaryGrade: 'P6' });
    activateProfile(p.id);

    const el = host();
    mountSectionRunner(el, {
      items: VISUAL_TEXT_ITEMS,
      kind: 'visual-text',
      unit: 'poster',
      renderItem: (item) => `<p class="body">${item.title}</p>`,
    });
    el.querySelector('[data-psr-open]').click();

    expect(el.querySelectorAll('.body').length).toBe(1);
    expect(el.querySelector('.psr-progress').textContent).toMatch(/P6 · poster 1 of \d+/);
    expect(el.querySelector('[data-psr-prev]').disabled).toBe(true);
    expect(el.querySelector('[data-psr-next]')).toBeTruthy();
    expect(el.querySelector('[data-psr-back]')).toBeTruthy();
  });

  it('reaches a clear end instead of just running out of page', () => {
    const el = host();
    const single = [{ level: 'P6', title: 'Only one', questions: [{ q: 'a' }] }];
    mountSectionRunner(el, {
      items: single,
      kind: 'visual-text',
      unit: 'poster',
      renderItem: () => '<p class="body">x</p>',
    });

    el.querySelector('[data-psr-open]').click();
    expect(el.querySelector('[data-psr-next]').textContent.trim()).toBe('Finish');

    el.querySelector('[data-psr-next]').click();
    expect(el.querySelector('[data-psr-view="done"]')).toBeTruthy();
    expect(el.textContent).toMatch(/last poster in P6/i);
  });

  it('keeps a half-written answer when the child navigates away and back', () => {
    // Losing a draft would teach a child that moving around the app is risky.
    const el = host();
    const items = [
      { level: 'P6', title: 'One', questions: [] },
      { level: 'P6', title: 'Two', questions: [] },
    ];
    mountSectionRunner(el, {
      items,
      kind: 'open-comprehension',
      unit: 'passage',
      renderItem: (item) => `<textarea id="draft-${item.title}"></textarea>`,
    });

    el.querySelector('[data-psr-open]').click();
    el.querySelector('#draft-One').value = 'half an answer';

    el.querySelector('[data-psr-next]').click();
    expect(el.querySelector('#draft-Two')).toBeTruthy();

    el.querySelector('[data-psr-prev]').click();
    expect(el.querySelector('#draft-One').value).toBe('half an answer');
  });

  it('lets a child reach another grade deliberately', () => {
    const p = createProfile('Testy', undefined, undefined, 'primary', { primaryGrade: 'P6' });
    activateProfile(p.id);

    const el = host();
    mountSectionRunner(el, {
      items: VISUAL_TEXT_ITEMS,
      kind: 'visual-text',
      unit: 'poster',
      renderItem: () => '<p class="body">x</p>',
    });

    el.querySelector('[data-psr-level="P1"]').click();
    expect(el.querySelector('.psr-intro').textContent).toMatch(/Showing P1/);
    expect(el.querySelector('[data-psr-level="P1"]').getAttribute('aria-pressed')).toBe('true');
  });

  it('mounts the real Visual Text section without dumping every grade', () => {
    const p = createProfile('Testy', undefined, undefined, 'primary', { primaryGrade: 'P6' });
    activateProfile(p.id);

    const el = host();
    mountPlaceholderModule(el, 'visual-text', {});

    // The audit counted 63 answer boxes here. The catalogue has none.
    expect(el.querySelectorAll('textarea').length).toBe(0);
    expect(el.querySelectorAll('[data-psr-open]').length).toBe(
      VISUAL_TEXT_ITEMS.filter((i) => i.level === 'P6').length,
    );
  });

  it('mounts Open-ended Comprehension the same way', () => {
    const p = createProfile('Testy', undefined, undefined, 'primary', { primaryGrade: 'P6' });
    activateProfile(p.id);

    const el = host();
    mountPlaceholderModule(el, 'open-comprehension', {});

    // The audit counted 107 answer boxes here.
    expect(el.querySelectorAll('textarea').length).toBe(0);

    // Opening one passage gives only that passage's questions.
    el.querySelector('[data-psr-open]').click();
    const p6 = OPEN_COMPREHENSION_PASSAGES.filter((i) => i.level === 'P6');
    expect(el.querySelectorAll('textarea').length).toBe(p6[0].questions.length);
  });
});

describe('Visual Text stimuli have real structure (audit finding 18)', () => {
  it('no longer renders posters as preformatted text', () => {
    for (const item of VISUAL_TEXT_ITEMS) {
      const html = renderVisualStimulus(item);
      expect(html, `${item.id} still uses <pre>`).not.toContain('<pre');
      expect(html, `${item.id} has no headline`).toContain('vstim-headline');
    }
  });

  it('gives a schedule real table structure, with headers where there are any', () => {
    const schedule = VISUAL_TEXT_ITEMS.find((i) => i.type === 'schedule');
    expect(schedule, 'no schedule item in the bank').toBeTruthy();

    const html = renderVisualStimulus(schedule);
    expect(html).toContain('<table');
    expect(html).toMatch(/<t[dh]/);
  });

  it('turns numbered rules into an ordered list', () => {
    // "OUR CLASSROOM RULES" is 1..5 — a list a child should see as a list.
    const rules = VISUAL_TEXT_ITEMS.find((i) => /^\s*1[.)]\s/m.test(i.poster || ''));
    expect(rules).toBeTruthy();
    expect(renderVisualStimulus(rules)).toContain('<ol');
  });

  it('names what kind of text it is, without describing the content', () => {
    // A caption saying "A poster" orients the reader. A description of what
    // the poster says would hand over the answers the questions ask for.
    const poster = VISUAL_TEXT_ITEMS.find((i) => i.type === 'poster');
    const html = renderVisualStimulus(poster);

    expect(html).toContain('vstim-caption');
    expect(html).toMatch(/>A poster</);
  });

  it('escapes item text rather than trusting it as markup', () => {
    const html = renderVisualStimulus({
      type: 'notice',
      poster: '<script>alert(1)</script>\n\nBody line',
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('survives an empty or missing poster', () => {
    expect(renderVisualStimulus({ type: 'poster', poster: '' })).toBe('');
    expect(renderVisualStimulus({})).toBe('');
    expect(renderVisualStimulus(null)).toBe('');
  });
});
