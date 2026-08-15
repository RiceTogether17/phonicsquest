import { beforeEach, describe, expect, it, vi } from 'vitest';
import { store } from '../modules/store.js';
import { attachOpenResponses, renderOpenResponseHtml, SELF_MARKS } from '../modes/openResponse.js';

/**
 * Three library modules shipped as answer keys: Visual Text Comprehension,
 * Open-ended Comprehension and Situational Writing rendered every question
 * with a "Show model answer" toggle and zero input elements. There was
 * nothing to do but read the answer.
 */

function mount({
  model = 'Emma and her family were moving away.',
  skill = 'openComprehension',
} = {}) {
  document.body.innerHTML = `<div id="host">${renderOpenResponseHtml({ id: 'q1', model, skill })}</div>`;
  return {
    host: document.getElementById('host'),
    input: () => document.querySelector('.open-response__input'),
    check: () => document.querySelector('[data-or-check]'),
    result: () => document.querySelector('[data-or-result]'),
  };
}

beforeEach(() => {
  store.set('questMastery', {});
  store.set('learningEvents', []);
});

describe('renderOpenResponseHtml', () => {
  it('gives the question an input, which is the whole point', () => {
    const dom = mount();
    expect(dom.input()).not.toBeNull();
    expect(dom.check()).not.toBeNull();
  });

  it('does not put the model answer on screen before the child has answered', () => {
    const dom = mount();
    expect(dom.host.textContent).not.toContain('moving away');
    expect(dom.result().hidden).toBe(true);
  });

  it('escapes a model answer rather than splicing it into markup', () => {
    const dom = mount({ model: '<img src=x onerror=alert(1)>' });
    // The model rides in an attribute; nothing may become an element from it,
    // before or after the answer is revealed.
    expect(dom.host.querySelector('img')).toBeNull();

    attachOpenResponses(dom.host, { quest: 'open-comprehension' });
    dom.input().value = 'anything';
    dom.check().click();

    expect(dom.host.querySelector('img')).toBeNull();
    expect(dom.result().textContent).toContain('<img src=x onerror=alert(1)>');
  });
});

describe('attachOpenResponses', () => {
  it('locks the answer before revealing the model, so it cannot become copying', () => {
    const dom = mount();
    attachOpenResponses(dom.host, { quest: 'open-comprehension' });

    dom.input().value = 'Emma moved away';
    dom.check().click();

    expect(dom.input().readOnly).toBe(true);
    expect(dom.check().disabled).toBe(true);
    expect(dom.result().textContent).toContain('moving away');
  });

  it('lists which of the model ideas the answer covered and which it missed', () => {
    const dom = mount();
    attachOpenResponses(dom.host, { quest: 'open-comprehension' });

    dom.input().value = 'Emma moved away';
    dom.check().click();

    const text = dom.result().textContent;
    expect(text).toContain('In your answer:');
    expect(text).toContain('Not mentioned:');
    expect(text).toContain('family');
    // and says plainly that the checklist is not the mark
    expect(text).toContain('not a mark');
  });

  it('asks for something rather than locking an empty answer', () => {
    const dom = mount();
    attachOpenResponses(dom.host, { quest: 'open-comprehension' });

    dom.check().click();

    expect(dom.result().textContent).toContain('Write something first');
    expect(dom.input().readOnly).toBe(false);
    expect(dom.check().disabled).toBe(false);
    expect(dom.result().textContent).not.toContain('moving away');
  });

  it('records a self-mark as guided evidence, never as proof', () => {
    const dom = mount();
    attachOpenResponses(dom.host, { quest: 'open-comprehension', level: 'P1' });

    dom.input().value = 'Emma moved away with her family';
    dom.check().click();
    document.querySelector('[data-or-mark="got"]').click();

    expect(store.get('questMastery')['open-comprehension'].openComprehension).toBeGreaterThan(0.5);
    const [event] = store.get('learningEvents');
    expect(event.eventType).toBe('open_response_self_mark');
    expect(event.evidence).toBe('guided');
    expect(event.meta.selfAssessed).toBe(true);
  });

  it('reports the chosen mark to the caller and shows which was picked', () => {
    const dom = mount();
    const onMark = vi.fn();
    attachOpenResponses(dom.host, { quest: 'open-comprehension', onMark });

    dom.input().value = 'Something';
    dom.check().click();
    document.querySelector('[data-or-mark="partly"]').click();

    expect(onMark).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'q1', mark: 'partly', value: 0.5 }),
    );
    expect(document.querySelectorAll('.open-response__mark-btn--picked')).toHaveLength(1);
  });

  it('offers exactly one mark at a time when the child changes their mind', () => {
    const dom = mount();
    attachOpenResponses(dom.host, { quest: 'open-comprehension' });

    dom.input().value = 'Something';
    dom.check().click();
    document.querySelector('[data-or-mark="got"]').click();
    document.querySelector('[data-or-mark="not-yet"]').click();

    const picked = document.querySelectorAll('.open-response__mark-btn--picked');
    expect(picked).toHaveLength(1);
    expect(picked[0].getAttribute('data-or-mark')).toBe('not-yet');
  });

  it('exposes three marks, so "partly" is available and not a binary', () => {
    expect(SELF_MARKS.map((m) => m.key)).toEqual(['got', 'partly', 'not-yet']);
  });

  it('does nothing without a container', () => {
    expect(() => attachOpenResponses(null)).not.toThrow();
  });
});
