/**
 * PhonicsQuest – Official examination blueprints
 *
 * Audit 2026-09-19, finding 1. The four P6 papers were labelled "full
 * PSLE-format" and "Full Paper 1 + Paper 2 structure", while the module header
 * described a single 95-mark hybrid sat in 1 h 50 min. The real SEAB 2026
 * English Language format is two written papers, and it contains a component
 * the repository papers do not have at all: Continuous Writing, 36 marks — on
 * its own more than a third of Paper 1 + Paper 2's written total.
 *
 * A child practising the hybrid rehearses a different examination: different
 * section weighting, different timing, and no practice for a large block of
 * the real marks. "Exam-ready" cannot be read off that result.
 *
 * ## Why this file is incomplete, on purpose
 *
 * `PSLE_2026_ENGLISH` records ONLY figures the audit verified against the
 * official SEAB specification and printed in its comparison table. The
 * remaining Paper 2 components are deliberately absent: the primary sources
 * (seab.gov.sg and the linked specification PDF) were unreachable from this
 * environment, and an examination blueprint assembled from memory is exactly
 * the kind of confidently-wrong number this audit is about. A partly-recorded
 * blueprint can still prove a paper does NOT match, which is what finding 1
 * needs today. It cannot certify that one does, so `isComplete` is false and
 * `certifyAgainstBlueprint` refuses.
 *
 * Completing this from the official PDF, and then building papers that satisfy
 * it, is work package 6 in the audit's implementation order. What is done here
 * is the part the audit marked "immediately": stop claiming the match.
 *
 * Source for every figure below: SEAB, PSLE formats examined in 2026 —
 * English Language, as quoted in PhonicsQuest_Audit_2026-09-19.md finding 1.
 * https://www.seab.gov.sg/psle/psle-formats-examined-in-2026/
 */

/**
 * @typedef {object} BlueprintComponent
 * @property {string} name
 * @property {number} marks
 * @property {number|null} items       number of questions where the audit recorded it
 * @property {string} responseType
 */

/** Components of the 2026 format that the audit verified individually. */
const VERIFIED_COMPONENTS = Object.freeze({
  'Situational Writing': Object.freeze({
    name: 'Situational Writing',
    marks: 14,
    items: 1,
    responseType: 'written',
    paper: 'Paper 1',
  }),
  'Continuous Writing': Object.freeze({
    name: 'Continuous Writing',
    marks: 36,
    items: 1,
    responseType: 'written',
    paper: 'Paper 1',
  }),
  'Vocabulary Cloze': Object.freeze({
    name: 'Vocabulary Cloze',
    marks: 5,
    items: 5,
    responseType: 'mcq',
    paper: 'Paper 2',
  }),
  'Visual Text Comprehension': Object.freeze({
    name: 'Visual Text Comprehension',
    marks: 5,
    items: 5,
    responseType: 'mcq',
    paper: 'Paper 2',
  }),
  'Comprehension Cloze': Object.freeze({
    name: 'Comprehension Cloze',
    marks: 15,
    items: 15,
    responseType: 'cloze',
    paper: 'Paper 2',
  }),
  'Comprehension Open-ended': Object.freeze({
    name: 'Comprehension Open-ended',
    marks: 20,
    items: 10,
    responseType: 'written',
    paper: 'Paper 2',
  }),
});

export const PSLE_2026_ENGLISH = Object.freeze({
  examVersion: 'SEAB-2026',
  subject: 'English Language',
  source: 'https://www.seab.gov.sg/psle/psle-formats-examined-in-2026/',

  /**
   * False until every component is transcribed from the official
   * specification. Guards against this file being mistaken for a complete
   * blueprint and used to certify a paper.
   */
  isComplete: false,

  /** Paper-level totals and durations, both audit-verified. */
  papers: Object.freeze([
    Object.freeze({ name: 'Paper 1', title: 'Writing', marks: 50, duration: '1 h 10 min' }),
    Object.freeze({
      name: 'Paper 2',
      title: 'Language Use and Comprehension',
      marks: 90,
      duration: '1 h 50 min',
    }),
  ]),

  components: VERIFIED_COMPONENTS,
});

/** Combined written-paper marks: Paper 1 + Paper 2. */
export function blueprintTotalMarks(blueprint = PSLE_2026_ENGLISH) {
  return blueprint.papers.reduce((sum, paper) => sum + paper.marks, 0);
}

/**
 * Differences between a practice paper and the verified parts of a blueprint.
 *
 * Only reports on components the blueprint actually records, so an unrecorded
 * component is never counted as a mismatch. `matchesVerifiedParts` therefore
 * means "nothing we have checked disagrees" — NOT "this paper is in format".
 *
 * @param {{totalMarks: number, sections: {name: string, marks: number}[]}} paper
 * @param {typeof PSLE_2026_ENGLISH} [blueprint]
 */
export function diffAgainstBlueprint(paper, blueprint = PSLE_2026_ENGLISH) {
  const official = blueprint.components;
  const present = new Set(paper.sections.map((s) => s.name));

  const markMismatches = [];
  for (const section of paper.sections) {
    const spec = official[section.name];
    if (spec && spec.marks !== section.marks) {
      markMismatches.push({
        component: section.name,
        paperMarks: section.marks,
        officialMarks: spec.marks,
      });
    }
  }

  const missing = Object.keys(official).filter((name) => !present.has(name));

  const officialTotal = blueprintTotalMarks(blueprint);

  return {
    missing,
    markMismatches,
    totalMarks: { paper: paper.totalMarks, official: officialTotal },
    totalMarksMatch: paper.totalMarks === officialTotal,
    matchesVerifiedParts:
      missing.length === 0 && markMismatches.length === 0 && paper.totalMarks === officialTotal,
  };
}

/**
 * Whether a paper may be presented to a parent or teacher as being in the
 * official examination format.
 *
 * Always false while `isComplete` is false: a paper cannot be certified
 * against a blueprint that is itself only partly transcribed. This is the
 * function any "PSLE format" or "exam-ready" label must consult before it is
 * allowed to appear.
 *
 * @returns {{certified: boolean, reason: string}}
 */
export function certifyAgainstBlueprint(paper, blueprint = PSLE_2026_ENGLISH) {
  if (!blueprint.isComplete) {
    return {
      certified: false,
      reason:
        'Blueprint is only partly transcribed from the official specification, ' +
        'so no paper can be certified as matching it yet.',
    };
  }

  const diff = diffAgainstBlueprint(paper, blueprint);
  return diff.matchesVerifiedParts
    ? { certified: true, reason: 'Matches every recorded component.' }
    : { certified: false, reason: 'Differs from the official blueprint.' };
}
