/*
 * Audit 2026-09-19, Finding 9 — synthesis accepts answers that ignore the
 * required opening.
 *
 * For `st-conn-1` the required opening is "Although", but
 * "Even though Siti was feeling very tired, she completed all her chores."
 * was accepted, because it was listed as an alternate and the grader only
 * checked meaning. The audit confirmed this with an executable reproduction
 * and screened 31 of the 58 items as carrying at least one alternate that
 * does not start with the supplied stem.
 */

/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';

// synthesisQuest pulls in audio.js, whose constructor calls
// speechSynthesis.getVoices(); JSDOM does not ship it.
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

const { buildAcceptableAnswers, checkTaskConstraints, getTaskConstraints, offTaskAlternates } =
  await import('../modes/synthesisQuest.js');
const { SYNTHESIS_ITEMS } = await import('../data/synthesisItems.js');

const byId = (id) => SYNTHESIS_ITEMS.find((i) => i.id === id);

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?;:]+$/g, '')
    .trim();

describe('synthesis task constraints (audit finding 9)', () => {
  it('rejects the audit reproduction: right meaning, wrong required opening', () => {
    const item = byId('st-conn-1');
    expect(item.stem).toBe('Although');

    const evenThough = 'Even though Siti was feeling very tired, she completed all her chores.';
    const check = checkTaskConstraints(evenThough, item);

    expect(check.ok).toBe(false);
    expect(check.violation).toBe('start');
    expect(check.message).toMatch(/begin with "Although"/);

    // And it is no longer in the accepted set at all.
    expect(buildAcceptableAnswers(item).map(norm)).not.toContain(norm(evenThough));
  });

  it('still accepts the authored answer and its continuation', () => {
    const item = byId('st-conn-1');

    expect(checkTaskConstraints(item.answer, item).ok).toBe(true);

    const accepts = buildAcceptableAnswers(item).map(norm);
    expect(accepts).toContain(norm(item.answer));
    expect(accepts).toContain(norm('Siti was feeling very tired, she completed all her chores.'));
  });

  it('accepts a bare continuation, which is not held to the opening', () => {
    const item = byId('st-conn-1');
    // PSLE format asks only for the blank; a continuation cannot be expected to
    // repeat the stem it follows.
    const check = checkTaskConstraints(
      'Siti was feeling very tired, she completed all her chores',
      item,
    );
    expect(check.ok).toBe(true);
  });

  it('keeps every authored answer acceptable to its own item', () => {
    // The constraint must never reject the answer the item itself supplies.
    for (const item of SYNTHESIS_ITEMS) {
      const check = checkTaskConstraints(item.answer, item);
      expect(check.ok, `${item.id}: authored answer fails its own constraint`).toBe(true);
      expect(
        buildAcceptableAnswers(item).length,
        `${item.id} has no acceptable answers`,
      ).toBeGreaterThan(0);
    }
  });

  it('accepts the continuation of every authored answer across the bank', () => {
    // The subordinator check must not misfire on a legitimate continuation.
    for (const item of SYNTHESIS_ITEMS) {
      const stem = item.stem;
      if (!norm(item.answer).startsWith(norm(stem))) continue;
      const continuation = item.answer
        .trim()
        .slice(stem.trim().length)
        .replace(/^[\s,]+/, '');
      const check = checkTaskConstraints(continuation, item);
      expect(check.ok, `${item.id}: continuation "${continuation}" was rejected`).toBe(true);
    }
  });

  it('derives a required opening for every item, since all 58 are stemmed', () => {
    expect(SYNTHESIS_ITEMS.length).toBe(58);
    for (const item of SYNTHESIS_ITEMS) {
      expect(getTaskConstraints(item).requiredStart, `${item.id}`).toBeTruthy();
    }
  });

  it('holds back the off-task alternates rather than discarding them', () => {
    // 31 items carry at least one; they stay available as data so feedback can
    // say "that works, but this task asks you to start with X".
    const affected = SYNTHESIS_ITEMS.filter((i) => offTaskAlternates(i).length > 0);
    expect(affected.length).toBe(31);

    for (const item of affected) {
      for (const alt of offTaskAlternates(item)) {
        expect(buildAcceptableAnswers(item).map(norm)).not.toContain(norm(alt));
      }
    }
  });

  it('lets an item opt into open sentence-combining', () => {
    const open = { ...byId('st-conn-1'), allowAnyStructure: true };

    expect(getTaskConstraints(open).requiredStart).toBeNull();
    expect(
      checkTaskConstraints(
        'Even though Siti was feeling very tired, she completed all her chores.',
        open,
      ).ok,
    ).toBe(true);
    expect(offTaskAlternates(open)).toEqual([]);
  });

  it('enforces a required connector when one is declared', () => {
    const item = { ...byId('st-conn-1'), requiredConnector: 'although' };

    const missing = checkTaskConstraints('Siti was tired but she finished her chores.', item);
    expect(missing.ok).toBe(false);
    expect(missing.violation).toBe('connector');
    expect(checkTaskConstraints(item.answer, item).ok).toBe(true);
  });
});
