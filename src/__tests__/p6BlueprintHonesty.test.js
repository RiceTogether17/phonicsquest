/**
 * Audit 2026-09-19, Finding 1 — P6 "full PSLE-format" claims are incorrect.
 *
 * The papers are a single 95-mark hybrid; the SEAB 2026 format is Paper 1
 * (50 marks) plus Paper 2 (90 marks), and includes Continuous Writing (36
 * marks) which these papers do not contain at all.
 *
 * These tests do not check that the papers are in format — they are not, and
 * making them so is a later work package. They check the weaker, enforceable
 * property: **the app does not claim a match it does not have**. That is the
 * thing that misleads a parent, and it is the thing that can regress silently
 * the next time someone writes marketing copy.
 */

import { describe, it, expect } from 'vitest';
import { P6_PRACTICE_TESTS, P6_EXAM_ALIGNMENT } from '../data/p6PracticeTests.js';
import { PLACEHOLDER_META } from '../modes/placeholderMeta.js';
import {
  PSLE_2026_ENGLISH,
  blueprintTotalMarks,
  diffAgainstBlueprint,
  certifyAgainstBlueprint,
} from '../data/examBlueprints.js';

const PAPERS = Object.values(P6_PRACTICE_TESTS);

describe('P6 papers do not claim a PSLE format they do not have (audit finding 1)', () => {
  it('records the two written papers and their verified totals', () => {
    expect(PAPERS.length).toBe(4);
    expect(blueprintTotalMarks()).toBe(140);
    expect(PSLE_2026_ENGLISH.papers.map((p) => p.marks)).toEqual([50, 90]);
    expect(PSLE_2026_ENGLISH.papers.map((p) => p.duration)).toEqual(['1 h 10 min', '1 h 50 min']);
  });

  it('refuses to certify any paper while the blueprint is only partly transcribed', () => {
    // The official specification was unreachable when this was written, so
    // only the audit-verified components are recorded. A partial blueprint
    // must never be the basis of an "in format" claim.
    expect(PSLE_2026_ENGLISH.isComplete).toBe(false);

    for (const paper of PAPERS) {
      const { certified } = certifyAgainstBlueprint({
        totalMarks: paper.totalMarks,
        sections: [],
      });
      expect(certified).toBe(false);
    }
  });

  it('declares every paper as not matching the official format', () => {
    for (const paper of PAPERS) {
      expect(paper.examAlignment, `${paper.id} has no examAlignment`).toBeTruthy();
      expect(paper.examAlignment.matchesOfficialFormat).toBe(false);
      expect(paper.examAlignment.comparedAgainst).toBe(PSLE_2026_ENGLISH.examVersion);
      expect(paper.examAlignment.scoreCaveat).toMatch(/not a PSLE readiness figure/i);
    }
  });

  it('still differs from the blueprint in the ways the audit measured', () => {
    // If someone rebuilds the papers to match, this test is the reminder to
    // revisit the labels rather than leave them pessimistic forever.
    const paper = PAPERS[0];
    const diff = diffAgainstBlueprint({
      totalMarks: paper.totalMarks,
      sections: [
        { name: 'Situational Writing', marks: 15 },
        { name: 'Vocabulary Cloze', marks: 10 },
        { name: 'Comprehension Cloze', marks: 10 },
        { name: 'Comprehension Open-ended', marks: 15 },
      ],
    });

    expect(diff.matchesVerifiedParts).toBe(false);
    expect(diff.missing).toContain('Continuous Writing');
    expect(diff.missing).toContain('Visual Text Comprehension');
    expect(diff.totalMarks).toEqual({ paper: 95, official: 140 });

    const byComponent = Object.fromEntries(
      diff.markMismatches.map((m) => [m.component, [m.paperMarks, m.officialMarks]]),
    );
    expect(byComponent['Situational Writing']).toEqual([15, 14]);
    expect(byComponent['Vocabulary Cloze']).toEqual([10, 5]);
    expect(byComponent['Comprehension Cloze']).toEqual([10, 15]);
    expect(byComponent['Comprehension Open-ended']).toEqual([15, 20]);
  });

  it('makes no PSLE-format or exam-ready claim in P6 labels and blurbs', () => {
    const forbidden = [/full\s+PSLE/i, /PSLE[- ]format/i, /exam[- ]ready/i, /PSLE\s+mock/i];

    const surfaces = [
      PLACEHOLDER_META['p6-practice-tests'].blurb,
      PLACEHOLDER_META['p6-practice-tests'].paperLink,
      ...PAPERS.map((p) => p.label),
      ...PAPERS.map((p) => p.blurb),
    ];

    for (const text of surfaces) {
      for (const pattern of forbidden) {
        expect(text, `"${text}" still makes a format claim`).not.toMatch(pattern);
      }
    }
  });

  it('names the differences it is relying on, so the claim can be rechecked', () => {
    expect(P6_EXAM_ALIGNMENT.differences.length).toBeGreaterThanOrEqual(7);
    expect(P6_EXAM_ALIGNMENT.differences.join(' ')).toMatch(/Continuous Writing/);
  });
});
