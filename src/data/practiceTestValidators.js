/**
 * Shared validators for primary practice-test data banks.
 *
 * The per-level validators (validateP5PracticeTests, validateP6PracticeTests…)
 * are responsible for the level-specific shape (how many sections, how many
 * blanks per section, etc.). These helpers check the cross-cutting
 * assessment-quality invariants that should hold at every level:
 *
 *   • MCQ items: 4 distinct choices, answer present, no near-duplicate
 *     options (which would make the question unfair).
 *   • Section marks: the declared `marks` value should equal the number
 *     of gradable inputs multiplied by the standard per-input weight for
 *     that section type. If the two drift apart, the rendered "X marks"
 *     label no longer matches what the grader can actually award.
 */

/** Lowercase + collapse whitespace — what radio-grouping treats as identical. */
function _normChoice(s) {
  return String(s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Append issues for an MCQ items list:
 *   - each item has 4 (or expectedChoices) distinct choices
 *   - answer is present among the choices
 *   - no two choices are duplicates after case/whitespace normalisation
 */
export function checkMcqItems(issues, tag, items, expectedChoices = 4) {
  if (!Array.isArray(items)) return;
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const stub = `${tag}[${i}] "${String(item?.q ?? '').slice(0, 40)}"`;
    if (!item || !item.q || !Array.isArray(item.choices) || item.choices.length !== expectedChoices) {
      issues.push(`${stub}: must have ${expectedChoices} choices`);
      continue;
    }
    if (!item.choices.includes(item.answer)) {
      issues.push(`${stub}: answer "${item.answer}" not among choices`);
    }
    const seen = new Map();
    for (const c of item.choices) {
      const n = _normChoice(c);
      if (seen.has(n)) {
        issues.push(`${stub}: duplicate choice "${c}" matches "${seen.get(n)}"`);
      } else {
        seen.set(n, c);
      }
    }
  }
}

const _STANDARD_WEIGHT = {
  mcq:       1,  // 1 mark per item
  cloze:     1,  // 1 mark per blank
  synthesis: 2,  // 2 marks per item (PSLE convention)
  editing:   1,  // 1 mark per correction
};

/**
 * Verify section.marks equals `expectedItems × standardWeight(kind)`.
 *
 * This is the guard against the bug where a section is declared as "15
 * marks" but only has 10 gradable inputs — the grader can never award
 * more than 10, so the displayed "/15" total is a lie.
 */
export function checkSectionMarks(issues, tag, section, kind, expectedItems) {
  if (!section || typeof section.marks !== 'number') return;
  const weight = _STANDARD_WEIGHT[kind];
  if (weight == null) return;
  const expected = expectedItems * weight;
  if (section.marks !== expected) {
    issues.push(`${tag}: declared marks=${section.marks} but ${expectedItems} ${kind} items × ${weight} = ${expected} mark${expected === 1 ? '' : 's'}`);
  }
}
