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

/** Compare two strings ignoring case + trailing/leading whitespace. */
function _eqLoose(a, b) {
  return String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();
}

/**
 * Verify an editing section: every blank should test a REAL error.
 *
 * PSLE editing sections explicitly tell the student "the passage contains
 * errors" — so each numbered blank must have a correction that differs
 * from the underlined wrong text. "No change" / control items confuse the
 * exam discipline (students stop hunting for errors) and never appear in
 * real papers.
 *
 * Punctuation blanks have an empty `wrong` (just the circle marker) and
 * a non-empty `correction` — those are real errors by construction, not
 * "no change", so we only flag matches when BOTH fields are non-empty.
 */
export function checkEditingErrors(issues, tag, section) {
  if (!section || !Array.isArray(section.errors)) return;
  for (let i = 0; i < section.errors.length; i += 1) {
    const e = section.errors[i];
    const wrong = String(e?.wrong ?? '');
    const correction = String(e?.correction ?? '');
    if (!wrong.trim() || !correction.trim()) continue; // punctuation slot
    if (_eqLoose(wrong, correction)) {
      issues.push(`${tag}/error[${i}] (num ${e.num}): "wrong" and "correction" are both "${wrong}" — every editing blank must test a real error.`);
    }
  }
}
