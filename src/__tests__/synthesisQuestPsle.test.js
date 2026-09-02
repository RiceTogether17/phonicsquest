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

describe('P6 synthesis — PSLE-style partial credit via requiredGroups', () => {
  const p6 = SYNTHESIS_ITEMS.filter((i) => i.level === 'P6');

  it('every P6 item declares exactly 2 required meaning units (1 + 1 marks)', () => {
    const offenders = p6
      .filter((i) => !Array.isArray(i.requiredGroups) || i.requiredGroups.length !== 2)
      .map((i) => i.id);
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('the canonical answer for every P6 item scores 1.0 against its requiredGroups', async () => {
    const { gradeShortAnswer } = await import('../modes/scoring/shortAnswerGrader.js');
    const offenders = [];
    for (const item of p6) {
      const r = gradeShortAnswer(item.answer, { requiredGroups: item.requiredGroups });
      if (r.fraction !== 1) {
        offenders.push(`${item.id}: ${r.fraction} (missed ${r.trace.misses.join(', ')})`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('every listed alternate also scores 1.0 against its requiredGroups', async () => {
    const { gradeShortAnswer } = await import('../modes/scoring/shortAnswerGrader.js');
    const offenders = [];
    for (const item of p6) {
      for (const alt of item.alternates || []) {
        const r = gradeShortAnswer(alt, { requiredGroups: item.requiredGroups });
        if (r.fraction !== 1) {
          offenders.push(`${item.id} alt "${alt.slice(0, 40)}...": ${r.fraction}`);
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('drops a P6 item to 0.5 when only one meaning unit is preserved (reported speech)', async () => {
    const { gradeShortAnswer } = await import('../modes/scoring/shortAnswerGrader.js');
    const rs10 = p6.find((i) => i.id === 'st-rs-10');
    expect(rs10).toBeTruthy();
    // Tense backshifted (had finished) but time NOT backshifted (still "ago").
    // PSLE marker: 1/2 — got the structure but missed the time-word shift.
    const r = gradeShortAnswer('that she had finished the project three days ago.', {
      requiredGroups: rs10.requiredGroups,
    });
    expect(r.fraction).toBeCloseTo(0.5, 5);
  });

  it('scores 0 when neither meaning unit is preserved', async () => {
    const { gradeShortAnswer } = await import('../modes/scoring/shortAnswerGrader.js');
    const conn7 = p6.find((i) => i.id === 'st-conn-7');
    const r = gradeShortAnswer('Something completely different happened in a faraway place.', {
      requiredGroups: conn7.requiredGroups,
    });
    expect(r.fraction).toBe(0);
  });
});

describe('Negation detector — PSLE fronted-inversion and not-only exemptions', () => {
  it('does NOT reject keywords after a fronted "Never" at clause start', async () => {
    const { hasUnnegatedMatch } = await import('../modes/scoring/shortAnswerGrader.js');
    expect(hasUnnegatedMatch('Never had the champion lost a match.', 'had the champion lost')).toBe(
      true,
    );
  });

  it('does NOT reject keywords after "not only" / "no sooner" fixed phrases', async () => {
    const { hasUnnegatedMatch } = await import('../modes/scoring/shortAnswerGrader.js');
    expect(
      hasUnnegatedMatch('The complex is not only affordable but also convenient.', 'affordable'),
    ).toBe(true);
    expect(hasUnnegatedMatch('No sooner had he sat down than the bell rang.', 'sat down')).toBe(
      true,
    );
  });

  it('still rejects a true predicate negation ("She was never afraid" → keyword "afraid")', async () => {
    const { hasUnnegatedMatch } = await import('../modes/scoring/shortAnswerGrader.js');
    expect(hasUnnegatedMatch('She was never afraid of speaking up.', 'afraid')).toBe(false);
  });

  it('credits the conditional outcome after "would not have got X" (X is the outcome, not negated)', async () => {
    const { hasUnnegatedMatch } = await import('../modes/scoring/shortAnswerGrader.js');
    expect(hasUnnegatedMatch('They would not have got drenched in the rain.', 'drenched')).toBe(
      true,
    );
  });
});

describe('Synthesis data alignment — every stem starts its answer', () => {
  it('all 58 items have a stem that cleanly prefixes the canonical answer', () => {
    const offenders = [];
    for (const item of SYNTHESIS_ITEMS) {
      if (!item.stem) {
        offenders.push(`${item.id}: missing stem`);
        continue;
      }
      const stem = item.stem.toLowerCase().trim();
      const ans = item.answer.toLowerCase().trim();
      if (!ans.startsWith(stem)) {
        offenders.push(
          `${item.id}: stem "${item.stem}" does not start answer "${item.answer.slice(0, 50)}…"`,
        );
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('every item has an explain field (used by the teach-back overlay)', () => {
    const offenders = SYNTHESIS_ITEMS.filter((i) => !i.explain).map((i) => i.id);
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('every item covers a recognised PSLE transformation skill', () => {
    const pslePatterns = new Set([
      'connectorContrast',
      'connectorResult',
      'connectorAddition',
      'connectorTime',
      'connectorCondition',
      'activeToPassive',
      'passiveToActive',
      'reportedSpeechStatement',
      'reportedSpeechQuestion',
      'reportedSpeechCommand',
      'reportedSpeechExclamation',
      'relativeClause',
      'comparison',
      'advancedConstruction',
      'causativeHave',
      'cleftSentence',
      'conditionalType2',
      'conditionalType3',
      'despiteInSpiteOf',
    ]);
    const offenders = SYNTHESIS_ITEMS.filter((i) => !pslePatterns.has(i.skillKey)).map(
      (i) => `${i.id}: ${i.skillKey}`,
    );
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
