/*
 * Audit 2026-09-19, Finding 10 — teaching rules overgeneralise or give
 * incorrect advice.
 *
 * Five specific rules were named. Each was wrong in the same way: a useful
 * beginner heuristic stated as an absolute, which makes a child mark correct
 * English as an error and distrust their own ear.
 *
 * The audit's standing instruction, which these tests enforce where they can:
 * avoid "always" and "never" when the rule is only a useful pattern.
 */

/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';

// Both modes pull in audio.js, whose constructor calls speechSynthesis.
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

const { readFileSync } = await import('node:fs');
const { resolve } = await import('node:path');
const { SQ_TEACHBACK } = await import('../modes/synthesisQuest.js');
const { EDITING_TEACHBACK } = await import('../modes/editingQuest.js');
const { PHASES } = await import('../data/curriculum.js');

const root = resolve(import.meta.dirname, '../..');
const guardrails = readFileSync(resolve(root, 'src/modules/aiGuardrails.js'), 'utf8');

/**
 * The child-visible text of one teach-back entry, joined.
 *
 * Read from the exported object rather than the source file: asserting against
 * the file text also matched the code comments recording what the old wording
 * said, so a correct fix looked like a failure.
 */
function ruleText(bank, key) {
  const entry = bank[key];
  expect(entry, `no teach-back entry for ${key}`).toBeTruthy();
  return [entry.rule, entry.structure, entry.example, entry.tip].filter(Boolean).join(' \n ');
}

describe('teaching rules do not overgeneralise (audit finding 10)', () => {
  it('distinguishes the fronted negative from the "not until…that" cleft', () => {
    const block = ruleText(SQ_TEACHBACK, 'advancedConstruction');

    // It said both "all trigger inversion". The cleft does not invert — that is
    // the point of it — and teaching them as one rule yields
    // "It was not until noon that did he arrive".
    expect(block).not.toMatch(/all trigger inversion/i);
    expect(block).toMatch(/did he arrive/);
    expect(block).toMatch(/that he arrived/);
  });

  it('does not forbid "unless" with "not" outright', () => {
    const block = ruleText(SQ_TEACHBACK, 'connectorCondition');

    // "Never pair unless with not" marks "unless you don't mind" as an error.
    expect(block).not.toMatch(/Never pair/i);
    // The real advice is about meaning, and the exception is acknowledged.
    expect(block).toMatch(/opposite of what you meant|reverses your meaning/i);
    expect(block).toMatch(/don't mind/);
  });

  it('does not make syllable count an absolute comparative rule', () => {
    const block = ruleText(EDITING_TEACHBACK, 'comparatives');

    // "Two syllables or more? Use more + adjective" marks happier, easier,
    // simpler and cleverer wrong. All are standard.
    expect(block).not.toMatch(/Two syllables or more\?\s*Use "more/i);
    expect(block).toMatch(/happier/);
    expect(block).toMatch(/cleverer/);
    expect(block).toMatch(/either way|both are correct/i);
  });

  it('restricts the subject-verb -s rule to the simple present', () => {
    const block = ruleText(EDITING_TEACHBACK, 'svAgreement');

    // Unrestricted, "singular subjects add -s" licenses "The dog runs
    // yesterday" and "she cans swim", and makes correct past tense look wrong.
    expect(block).toMatch(/SIMPLE PRESENT|simple present/);
    expect(block).toMatch(/ran\b/);
    expect(block).toMatch(/modals? never take -s|never "she cans"|she cans/i);
    expect(block).toMatch(/is\/are|was\/were|has\/have/);
  });

  it('calls tch and dge trigraphs in the AI system prompt', () => {
    // A child can read this output, so the terminology has to be right.
    expect(guardrails).toMatch(/trigraph/i);
    expect(guardrails).toMatch(/THREE letters making ONE sound/i);
    // And the old claim is gone.
    expect(guardrails).not.toMatch(/digraph \(sh, ch, th, ck, ng, tch, dge, ph\)/);
  });

  it('keeps the digraph list in the prompt free of three-letter graphemes', () => {
    // Pull the sentence that defines "digraph" and check its examples.
    const line = guardrails.split('\n').find((l) => /A digraph is/i.test(l));
    expect(line, 'no digraph definition found in the prompt').toBeTruthy();

    const parenthetical = line.slice(line.indexOf('('), line.indexOf(')') + 1);
    for (const trigraph of ['tch', 'dge', 'igh']) {
      expect(parenthetical, `"${trigraph}" is listed as a digraph example`).not.toContain(trigraph);
    }
  });

  it('keeps the child-facing digraph phase free of trigraphs', () => {
    // The internal stage id is still called "digraphs" and is persisted, but
    // what a child reads must be accurate.
    const phase4 = PHASES.find((p) => p.phase === 4);

    expect(phase4.title).toMatch(/Digraph/i);
    for (const trigraph of ['tch', 'dge']) {
      expect(phase4.targetSounds.join(' ')).not.toContain(trigraph);
      expect(phase4.description).not.toContain(trigraph);
    }
  });
});
