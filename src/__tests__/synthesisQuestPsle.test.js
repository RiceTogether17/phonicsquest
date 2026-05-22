/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';

// audio.js (loaded transitively by synthesisQuest.js) calls
// speechSynthesis.getVoices() at module init. JSDOM does not provide
// SpeechSynthesis, so we stub it on both globalThis and window BEFORE
// importing the module under test. Static imports are hoisted above
// any executable code, so the side-effecting imports must be dynamic
// and gated behind the stub.
const _speechSynthesisStub = {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
};
globalThis.speechSynthesis = _speechSynthesisStub;
if (typeof window !== 'undefined') window.speechSynthesis = _speechSynthesisStub;

const { SYNTHESIS_ITEMS } = await import('../data/synthesisItems.js');
const { buildAcceptableAnswers, initSynthesisQuest, showSynthesisBrowser, cleanupSynthesisQuest } =
  await import('../modes/synthesisQuest.js');

function mountQuest() {
  document.body.innerHTML = '<div id="root"></div>';
  const root = document.getElementById('root');
  initSynthesisQuest(root, () => {});
  showSynthesisBrowser();
  return root;
}

function startLevel(root, level) {
  const btn = root.querySelector(`.sq-level-btn[data-level="${level}"]`);
  btn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('Synthesis Quest — PSLE blank-fill format', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    cleanupSynthesisQuest();
  });

  it('renders the stem as a fixed visible prefix, not as a placeholder hint', () => {
    const root = mountQuest();
    startLevel(root, 'P5');
    const prefix = root.querySelector('.sq-psle-prefix');
    const blank = root.querySelector('.sq-psle-blank');
    expect(prefix, 'expected a visible PSLE-style prefix block').toBeTruthy();
    expect(blank, 'expected a visible blank indicator').toBeTruthy();
    expect(prefix.textContent.trim().length).toBeGreaterThan(0);
  });

  it('the textarea is labelled "type what fills the blank" (continuation, not full sentence)', () => {
    const root = mountQuest();
    startLevel(root, 'P5');
    const label = root.querySelector('.sq-input-label')?.textContent || '';
    expect(label.toLowerCase()).toMatch(/blank/);
  });
});

describe('buildAcceptableAnswers — accepts both PSLE continuation and full-sentence forms', () => {
  it('returns the stripped continuation when the answer starts with the stem', () => {
    const item = {
      id: 'fixture-1',
      stem: 'Although',
      answer: 'Although Siti was feeling very tired, she completed all her chores.',
      alternates: [],
    };
    const accepts = buildAcceptableAnswers(item);
    // Continuation form must appear so the student can type just the blank-fill.
    expect(accepts).toContain('Siti was feeling very tired, she completed all her chores.');
    // Full sentence form is also accepted as a fallback.
    expect(accepts).toContain(item.answer);
  });

  it('preserves alternates that DO NOT start with the stem (clause-reversed forms)', () => {
    const item = {
      id: 'fixture-2',
      stem: 'Although',
      answer: 'Although Siti was tired, she finished her work.',
      alternates: ['Siti finished her work although she was tired.'],
    };
    const accepts = buildAcceptableAnswers(item);
    // The reversed-clause form must still appear in full — it doesn't start
    // with "Although" so there's nothing to strip, but a student who types it
    // anyway should still get credit.
    expect(accepts).toContain('Siti finished her work although she was tired.');
  });

  it('de-duplicates entries that normalise to the same string', () => {
    const item = {
      id: 'fixture-3',
      stem: 'Although',
      answer: 'Although she tried, she failed.',
      alternates: ['Although she tried, she failed.', 'Although she tried, she failed!'],
    };
    const accepts = buildAcceptableAnswers(item);
    // Exactly one full-sentence form + one continuation form survive after dedup.
    expect(accepts.length).toBe(2);
  });
});

describe('Synthesis data alignment — every stem starts its answer', () => {
  it('all 58 items have a stem that cleanly prefixes the canonical answer', () => {
    const offenders = [];
    for (const item of SYNTHESIS_ITEMS) {
      if (!item.stem) { offenders.push(`${item.id}: missing stem`); continue; }
      const stem = item.stem.toLowerCase().trim();
      const ans = item.answer.toLowerCase().trim();
      if (!ans.startsWith(stem)) {
        offenders.push(`${item.id}: stem "${item.stem}" does not start answer "${item.answer.slice(0, 50)}…"`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('every item has an explain field (used by the teach-back overlay)', () => {
    const offenders = SYNTHESIS_ITEMS.filter(i => !i.explain).map(i => i.id);
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('every item covers a recognised PSLE transformation skill', () => {
    const pslePatterns = new Set([
      'connectorContrast', 'connectorResult', 'connectorAddition',
      'connectorTime', 'connectorCondition',
      'activeToPassive', 'passiveToActive',
      'reportedSpeechStatement', 'reportedSpeechQuestion',
      'reportedSpeechCommand', 'reportedSpeechExclamation',
      'relativeClause', 'comparison',
      'advancedConstruction', 'causativeHave', 'cleftSentence',
      'conditionalType2', 'conditionalType3', 'despiteInSpiteOf',
    ]);
    const offenders = SYNTHESIS_ITEMS.filter(i => !pslePatterns.has(i.skillKey)).map(i => `${i.id}: ${i.skillKey}`);
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
