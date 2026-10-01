/*
 * Audit 2026-09-19, finding 25 — MOE alignment is not established.
 *
 * The audit's evidence is that `SCOPE_AND_SEQUENCE.md` says plainly that the
 * Learning Outcomes are the app's own and nothing is keyed to MOE. That much
 * was honest. The product contradicted it in the one place a parent looks.
 *
 * The Parent Dashboard rendered, per category row:
 *
 *     Articles (LO-ENG-GR-04)      Attempts: 12 · Clue success: 40% · [MOE syllabus]
 *
 * and a section headed "Syllabus coverage" listing `LO 3.1`, `LO 4.2`,
 * `LO 5.2`. Two invented code schemes — twenty-three in `reporting.js`, three
 * in `dashboardInsights.js` — next to a hyperlink labelled "MOE syllabus".
 * Neither scheme appears in the MOE 2020 English Language Syllabus.
 *
 * A fabricated citation is worse than a wrong number. A number can be an
 * error; a reference to an outside authority is a claim that somebody else
 * checked this, and nobody had.
 *
 * Acceptance, from the audit: "every alignment claim has an exact, reviewable
 * source. Label the product's sequence as its own until that work is
 * complete." Both clauses are testable without the syllabus document, which
 * is what this file checks. The crosswalk itself stays empty: moe.gov.sg and
 * the NIE library mirror are both refused by this environment's egress proxy,
 * exactly as they were during the audit, so no Learning Outcome reference has
 * been written from memory or from a search summary.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  CROSSWALK_FIELDS,
  SYLLABUS_CROSSWALK,
  alignmentFor,
  describeAlignmentStatus,
  validateCrosswalkEntry,
} from '../data/syllabusCrosswalk.js';

const root = resolve(import.meta.dirname, '../..');

describe('no alignment claim without a source (finding 25)', () => {
  it('the crosswalk is empty, and says why', () => {
    expect(SYLLABUS_CROSSWALK.isComplete).toBe(false);
    expect(SYLLABUS_CROSSWALK.entries).toEqual([]);
    expect(SYLLABUS_CROSSWALK.syllabusVersion).toBeNull();
    // Recorded so the next person does not have to re-derive why.
    expect(SYLLABUS_CROSSWALK.blockedBy).toMatch(/egress proxy/);
  });

  it('carries every field the audit’s fix names', () => {
    for (const field of [
      'syllabusVersion',
      'learningOutcome',
      'gradeBand',
      'prerequisite',
      'activity',
      'assessmentEvidence',
      'reviewDate',
    ]) {
      expect(CROSSWALK_FIELDS).toContain(field);
    }
    // Plus the two that make "exact, reviewable" mean something.
    expect(CROSSWALK_FIELDS).toContain('sourceQuote');
    expect(CROSSWALK_FIELDS).toContain('retrievedOn');
  });

  it('no skill has an alignment claim while the crosswalk is empty', () => {
    for (const key of ['articles', 'conditionals', 'scienceTechTerms', 'anythingAtAll']) {
      expect(alignmentFor(key)).toBeNull();
    }
  });

  it('refuses an entry that is missing any field', () => {
    const partial = { syllabusVersion: 'MOE English Language Syllabus 2020 (Primary)' };
    const result = validateCrosswalkEntry(partial);
    expect(result.ok).toBe(false);
    expect(result.problems).toContain('missing learningOutcome');
    expect(result.problems).toContain('missing sourceQuote');
    expect(result.problems).toContain('missing reviewedBy');
  });

  it('refuses an entry whose source cannot be checked', () => {
    const complete = Object.fromEntries(
      CROSSWALK_FIELDS.map((f) => [f, 'a value long enough to pass the length check']),
    );
    complete.retrievedOn = '2026-09-22';
    complete.reviewDate = '2026-09-22';
    expect(validateCrosswalkEntry(complete).ok).toBe(true);

    // A one-word "quote" is not a quotation anyone can check against a page.
    expect(validateCrosswalkEntry({ ...complete, sourceQuote: 'reading' }).problems).toContain(
      'sourceQuote is too short to check against the document',
    );
    // A review date that is not a date is how an unreviewed entry looks
    // reviewed.
    expect(validateCrosswalkEntry({ ...complete, reviewDate: 'soon' }).problems).toContain(
      'reviewDate is not an ISO date',
    );
    expect(validateCrosswalkEntry(null).ok).toBe(false);
  });

  it('keeps PSLE format separate from curriculum alignment', () => {
    // "A Paper 2-style activity does not establish that the complete P1–P6
    // sequence matches the syllabus." examBlueprints.js (finding 1) records
    // the exam format; neither file may stand in for the other.
    const crosswalk = readFileSync(resolve(root, 'src/data/syllabusCrosswalk.js'), 'utf8');
    const blueprint = readFileSync(resolve(root, 'src/data/examBlueprints.js'), 'utf8');
    expect(crosswalk).not.toMatch(/^import .*examBlueprints/m);
    expect(blueprint).not.toMatch(/^import .*syllabusCrosswalk/m);
  });
});

describe('the sequence is labelled as the app’s own (finding 25)', () => {
  it('the disclosure says so, in the words the scope document uses', () => {
    const statement = describeAlignmentStatus();
    expect(statement).toMatch(/PhonicsQuest’s own sequence/);
    expect(statement).toMatch(/not mapped to the MOE syllabus/);
    expect(statement).toMatch(/no outcome reference is shown/);
  });

  it('the scope document and the product now agree', () => {
    // SCOPE_AND_SEQUENCE.md always said this; the dashboard said otherwise.
    const scope = readFileSync(resolve(root, 'SCOPE_AND_SEQUENCE.md'), 'utf8');
    expect(scope).toMatch(/No external syllabus mapping yet/);
    expect(scope).toMatch(/learning outcomes\s+above are the app's own/);
  });

  it('no invented outcome code survives anywhere in the source', () => {
    // Enforced at build time by check-contracts.mjs; asserted here so the
    // failure names this finding rather than a generic contract break.
    const contracts = readFileSync(resolve(root, 'scripts/check-contracts.mjs'), 'utf8');
    expect(contracts).toContain('LO_CODE_LITERAL');
    expect(contracts).toContain('syllabusCrosswalk.js');
  });
});

describe('the report no longer cites a syllabus it never read (finding 25)', () => {
  let reporting;

  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    reporting = await import('../modules/reporting.js');
  });

  it('category rows carry no outcome code and no per-row syllabus link', () => {
    for (const rows of [
      reporting.getVocabularyCategoryReport(),
      reporting.getGrammarCategoryReport(),
    ]) {
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.loCode).toBeUndefined();
        expect(row.syllabusLink).toBeUndefined();
        expect(row.alignment).toBeNull();
      }
    }
  });

  it('the syllabus is linked once, beside the statement that nothing is mapped', () => {
    const { statement, syllabusLink } = reporting.getAlignmentDisclosure();
    expect(syllabusLink).toBe('https://www.moe.gov.sg/primary/curriculum/syllabus');
    expect(statement).toMatch(/not mapped/);
  });

  it('the recommendation owns its own priorities', () => {
    // It read "MOE-priority grammar focus: Conditionals". The weights behind
    // it are this app's editorial judgement and were never checked against a
    // syllabus.
    const queue = reporting.getAdaptiveLessonQueue({ limit: 6 });
    for (const item of queue) {
      expect(item.reason).not.toMatch(/MOE/);
      expect(item.loCode).toBeUndefined();
    }
    expect(typeof reporting.getPracticePriorityRecommendations).toBe('function');
    expect(reporting.getMoePriorityRecommendations).toBeUndefined();
  });
});

describe('the dashboard section states the position (finding 25)', () => {
  const dashboard = readFileSync(resolve(root, 'src/components/dashboard.js'), 'utf8');
  const rules = dashboard.replace(/\/\*[\s\S]*?\*\//g, '');

  it('no longer heads a section "Syllabus coverage"', () => {
    // "Coverage" asserts that the syllabus is covered. It is not a claim the
    // app can support.
    expect(rules).not.toContain('Syllabus coverage');
    expect(rules).toContain('Syllabus alignment');
  });

  it('renders the disclosure rather than a list of codes', () => {
    expect(rules).toContain('getAlignmentDisclosure');
    expect(rules).toContain('getSyllabusCrosswalkRows');
    expect(rules).not.toMatch(/r\.loCode/);
  });
});
