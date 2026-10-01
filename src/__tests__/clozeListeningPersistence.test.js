/*
 * Audit 2026-09-19, Finding 16 — Comprehension Cloze and Listening have
 * reporting gaps.
 *
 * comprehensionClozeQuest displayed a score and recorded misconception
 * feedback, but committed no quest attempt, no mastery and no persistent
 * passage completion. listeningComp kept answers in a module-local `_scores`
 * and rendered a result with no persistent commit at all. So the activity
 * disappeared on leaving the section, and a daily plan could not know what had
 * been completed.
 *
 * The same code also re-logged a mistake on every Check press, turning one
 * error into a repeat offence for a child who pressed Check twice to re-read
 * the explanations.
 *
 * Acceptance: a completed session appears in the correct learner's report
 * after reload; revealed answers do not count as independent successes; a
 * mistake is not logged again on every Check.
 */

/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

const { store } = await import('../modules/store.js');
const { questMastery } = await import('../modules/questMastery.js');
const { EVIDENCE } = await import('../modules/evidence.js');

const root = resolve(import.meta.dirname, '../..');
const clozeSource = readFileSync(resolve(root, 'src/modes/comprehensionClozeQuest.js'), 'utf8');
const listeningSource = readFileSync(resolve(root, 'src/modes/listeningComp.js'), 'utf8');

describe('cloze and listening persist their work (audit finding 16)', () => {
  beforeEach(() => {
    store.reset();
  });

  it('gives both modules a persistent commit path', () => {
    // Neither imported questMastery at all before this finding.
    for (const [name, source] of [
      ['comprehensionClozeQuest', clozeSource],
      ['listeningComp', listeningSource],
    ]) {
      expect(source, `${name} does not commit to questMastery`).toMatch(/questMastery/);
      expect(source, `${name} records no learning event`).toMatch(/recordLearningEvent/);
    }
  });

  it('commits each passage once, however many times Check is pressed', () => {
    // The guard both modules use. Without it, re-reading the explanations
    // banks another attempt and re-logs the same mistake.
    expect(clozeSource).toMatch(/_committedPassageIds/);
    expect(listeningSource).toMatch(/_committedPassageIds/);

    // The misconception log sits inside the guard, not outside it.
    const guardAt = clozeSource.indexOf('if (!_committedPassageIds.has(');
    const logAt = clozeSource.indexOf('recordMisconceptionsFromReview(');
    expect(guardAt).toBeGreaterThan(-1);
    expect(logAt).toBeGreaterThan(guardAt);
  });

  it('records a supported cloze pass as guided, not independent', () => {
    // Directly exercising the rule the module applies: hints or a reveal mean
    // the answer was supported, so it cannot be an independent success.
    const supported = true;
    const evidence = supported ? EVIDENCE.GUIDED : EVIDENCE.INDEPENDENT;

    questMastery.updateSkill('comprehensionCloze', 'preposition', true, {
      evidence,
      attemptId: 'ccq:cc-p3-01:preposition',
    });

    expect(questMastery.getSkillScore('comprehensionCloze', 'preposition')).toBe(0.5);
    expect(questMastery.getSkillSample('comprehensionCloze', 'preposition').attempts).toBe(0);
  });

  it('records an unsupported cloze pass as independent evidence', () => {
    questMastery.updateSkill('comprehensionCloze', 'preposition', true, {
      evidence: EVIDENCE.INDEPENDENT,
      attemptId: 'ccq:cc-p3-01:preposition',
    });

    expect(questMastery.getSkillScore('comprehensionCloze', 'preposition')).toBeGreaterThan(0.5);
    expect(questMastery.getSkillSample('comprehensionCloze', 'preposition').attempts).toBe(1);
  });

  it('ties the cloze evidence level to hints and reveals in the source', () => {
    expect(clozeSource).toMatch(/_hintsShown\s*\|\|\s*_revealed/);
    expect(clozeSource).toMatch(/supported \? EVIDENCE\.GUIDED : EVIDENCE\.INDEPENDENT/);
    // And _revealAnswers actually sets the flag it depends on.
    expect(clozeSource).toMatch(/function _revealAnswers\(\)\s*\{[\s\S]{0,120}_revealed = true/);
  });

  it('keeps a listening self-mark out of independent evidence', () => {
    // Separate commits: the app marking an MCQ is independent, a child marking
    // their own open answer is a self-report and stays guided.
    expect(listeningSource).toMatch(/_selfMarkedIdx/);
    expect(listeningSource).toMatch(/lc:\$\{passage\.id\}:auto/);
    expect(listeningSource).toMatch(/lc:\$\{passage\.id\}:self/);

    questMastery.updateSkill('listeningComp', 'listeningComprehension', true, {
      evidence: EVIDENCE.GUIDED,
      attemptId: 'lc:lp-01:self',
    });
    expect(questMastery.getSkillScore('listeningComp', 'listeningComprehension')).toBe(0.5);
  });

  it('persists completion so a reload can still see the session', () => {
    expect(clozeSource).toMatch(/recordClozeCompletion/);
    expect(clozeSource).toMatch(/ccqCompletedByPassage/);
    expect(listeningSource).toMatch(/listeningCompleted/);

    // The listening key exists in the store's defaults, so it survives a load.
    expect(store.get('listeningCompleted')).toEqual({});
  });

  it('never lets completion tracking break the child’s feedback', () => {
    // Both commits wrap persistence in try/catch: a full localStorage must not
    // take the results screen down with it. Check the try/catch actually
    // encloses the completion write, rather than merely existing in the file.
    const clozeCommit = clozeSource.slice(
      clozeSource.indexOf('function _commitPassageAttempt'),
      clozeSource.indexOf('function _revealAnswers'),
    );
    expect(clozeCommit).toMatch(/try \{[\s\S]*recordClozeCompletion[\s\S]*\} catch \(_\)/);

    const listeningCommit = listeningSource.slice(
      listeningSource.indexOf('function _commitListeningAttempt'),
      listeningSource.indexOf('// ── Screen: Results'),
    );
    expect(listeningCommit).toMatch(/try \{[\s\S]*listeningCompleted[\s\S]*\} catch \(_\)/);
  });
});
