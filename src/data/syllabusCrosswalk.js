/**
 * PhonicsQuest – syllabus crosswalk.
 *
 * Audit 2026-09-19, finding 25. The audit's evidence is that
 * `SCOPE_AND_SEQUENCE.md` says plainly that the Learning Outcomes are the
 * app's own and that nothing is keyed to MOE — which is honest, and which the
 * product then contradicted in the place a parent actually looks.
 *
 * The Parent Dashboard rendered, per category:
 *
 *     Articles (LO-ENG-GR-04)          …  [MOE syllabus]
 *
 * and a section headed "Syllabus coverage" listing `LO 3.1`, `LO 4.2`,
 * `LO 5.2`. Two different invented code schemes — twenty-three codes in
 * `reporting.js`, three more in `dashboardInsights.js` — sitting next to a
 * hyperlink labelled "MOE syllabus". None of them is an MOE reference. The
 * MOE 2020 English Language Syllabus does not use either scheme.
 *
 * A fabricated citation is worse than no citation. A number a parent reads
 * can be wrong; a reference to an external authority is a claim that someone
 * else vouched for this, and nobody did.
 *
 * ## What this file is
 *
 * The structure the audit's fix asks for: "a teacher-approved crosswalk
 * containing MOE Syllabus version, exact Learning Outcome reference,
 * grade/band, prerequisite, activity, assessment evidence and review date."
 *
 * It is deliberately empty. The syllabus PDF was unreachable from the audit's
 * environment and is unreachable from this one (`moe.gov.sg` and the NIE
 * library mirror are both refused by the egress proxy), so there is nothing
 * to key entries to. `validateCrosswalkEntry` refuses anything that does not
 * carry all seven fields including a verbatim quotation and a retrieval date,
 * so the next person cannot fill it in from memory either.
 *
 * `alignmentFor()` returns null for every skill while `isComplete` is false,
 * and the surfaces that used to print a code now say the sequence is the
 * app's own — which is what `SCOPE_AND_SEQUENCE.md` has said all along.
 *
 * ## PSLE format is a different thing
 *
 * `examBlueprints.js` (finding 1) records the PSLE paper format. That is a
 * mapping of an *examination's components*, not of a curriculum sequence, and
 * the audit is explicit that the two must stay apart: "a Paper 2-style
 * activity does not establish that the complete P1–P6 sequence matches the
 * syllabus." Nothing here reads that file, and nothing there should read this
 * one.
 */

/**
 * The fields every crosswalk entry must carry, from the audit's fix.
 *
 * `sourceQuote` and `retrievedOn` are not in the audit's list; they are here
 * because "exact, reviewable source" is the acceptance criterion, and a code
 * with no quotation behind it is exactly what this finding is about.
 */
export const CROSSWALK_FIELDS = Object.freeze([
  'syllabusVersion', // e.g. "MOE English Language Syllabus 2020 (Primary)"
  'learningOutcome', // the reference exactly as the document prints it
  'sourceQuote', // the outcome's wording, quoted verbatim
  'sourcePage', // where in the document it appears
  'retrievedOn', // ISO date the document was read
  'gradeBand', // the grade or band the document assigns it to
  'prerequisite', // what the syllabus expects first
  'activity', // the PhonicsQuest activity claimed to address it
  'assessmentEvidence', // what the app would accept as evidence it was met
  'reviewedBy', // the teacher who approved the mapping
  'reviewDate', // when they approved it
]);

/**
 * The crosswalk itself.
 *
 * `isComplete: false` is the load-bearing field: every consumer checks it
 * before showing an alignment claim, so an empty crosswalk produces no claim
 * rather than a blank one.
 */
export const SYLLABUS_CROSSWALK = Object.freeze({
  syllabusVersion: null,
  isComplete: false,
  /**
   * Why it is empty, so nobody has to re-derive it.
   */
  blockedBy:
    'The MOE English Language Syllabus (Primary) could not be retrieved: moe.gov.sg and the NIE library mirror are both refused by this environment’s egress proxy, as they were during the audit. No Learning Outcome reference has been written from memory or from a search summary.',
  entries: Object.freeze([]),
});

/**
 * Is an entry complete enough to be shown to a parent as an alignment claim?
 *
 * @param {Record<string, unknown>} entry
 * @returns {{ok: boolean, problems: string[]}}
 */
export function validateCrosswalkEntry(entry) {
  const problems = [];
  if (!entry || typeof entry !== 'object') {
    return { ok: false, problems: ['not an object'] };
  }

  for (const field of CROSSWALK_FIELDS) {
    const value = entry[field];
    if (typeof value !== 'string' || !value.trim()) {
      problems.push(`missing ${field}`);
    }
  }

  // A date that is not a date is the easiest way for an unreviewed entry to
  // look reviewed.
  for (const field of ['retrievedOn', 'reviewDate']) {
    const value = entry[field];
    if (typeof value === 'string' && value.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
      problems.push(`${field} is not an ISO date`);
    }
  }

  // The quotation is what makes the claim reviewable. A placeholder is not.
  const quote = typeof entry.sourceQuote === 'string' ? entry.sourceQuote.trim() : '';
  if (quote && quote.length < 20) {
    problems.push('sourceQuote is too short to check against the document');
  }

  return { ok: problems.length === 0, problems };
}

/**
 * The approved alignment claim for one app skill, or null when there is none.
 *
 * Returns null for everything while the crosswalk is empty. Callers render
 * nothing rather than a placeholder — see `describeAlignmentStatus`.
 *
 * @param {string} skillKey
 * @returns {object|null}
 */
export function alignmentFor(skillKey) {
  if (!SYLLABUS_CROSSWALK.isComplete) return null;
  const entry = SYLLABUS_CROSSWALK.entries.find((e) => e.activity === skillKey);
  if (!entry) return null;
  return validateCrosswalkEntry(entry).ok ? entry : null;
}

/**
 * One sentence for any surface that used to print a syllabus code.
 *
 * Matches what `SCOPE_AND_SEQUENCE.md` already says, so the document and the
 * product cannot disagree about this again.
 *
 * @returns {string}
 */
export function describeAlignmentStatus() {
  if (SYLLABUS_CROSSWALK.isComplete) {
    return `Mapped to ${SYLLABUS_CROSSWALK.syllabusVersion}, teacher-reviewed.`;
  }
  return 'These categories are PhonicsQuest’s own sequence. They are not mapped to the MOE syllabus or any other published syllabus, so no outcome reference is shown.';
}
