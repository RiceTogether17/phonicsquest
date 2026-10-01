/**
 * PhonicsQuest – seeds, surface variants, and what may be counted as coverage.
 *
 * Audit 2026-09-19, finding 12. Several banks reach their advertised depth by
 * duplicating an authored item and changing its surface. `passages.js` adds a
 * lead sentence ("Mei shared this recount with the class."); the Word Vault
 * generator reuses one template across six school contexts; two older helpers
 * in `vocabPassages.js` clone a passage outright and append "(Practice 2)".
 *
 * Reproduced on the audited commit, and again here:
 *
 *   P1 Articles           27 passages, 102 blanks →  4 distinct bodies, 4 answer sequences
 *   P6 Context Inference  38 passages, 114 blanks → 10 distinct bodies, 5 answer sequences
 *
 * Practising the same passage again is a reasonable thing to ask a child to
 * do — spaced repetition is how anything sticks. The problem is arithmetic: a
 * screen that says "3 / 27 passages done" is describing 27 different pieces of
 * work, and a parent reading "102 questions" in this topic will believe their
 * child met 102 questions. Neither is true.
 *
 * So the repeats stay, and the counting changes. Every item now carries:
 *
 *   `seedId`  — the authored passage this item's content comes from. An
 *               authored passage is its own seed.
 *   `isVariant` — true when this item is a re-presentation of a seed rather
 *               than new material.
 *
 * Coverage — "how much of this topic has this child met" — is counted in
 * seeds. Practice volume — "how much work has this child done" — is still
 * counted in items, because a repeat genuinely is work. The two numbers are
 * shown separately and labelled, rather than one standing in for the other.
 *
 * This module is the only place that decides which is which, so a new
 * generator has one rule to follow: set `seedId` on anything you copy.
 */

/**
 * The authored item a bank item's content comes from.
 *
 * @param {{id?: string, seedId?: string}} item
 * @returns {string}
 */
export function practiceSeedId(item) {
  return String(item?.seedId || item?.id || '');
}

/**
 * True when this item re-presents a seed rather than adding material.
 *
 * Read from `seedId` rather than the `isVariant` flag, so an item that a
 * generator tagged with a seed but forgot to flag is still counted honestly.
 *
 * @param {{id?: string, seedId?: string}} item
 */
export function isSurfaceVariant(item) {
  const seed = practiceSeedId(item);
  return Boolean(seed) && seed !== String(item?.id || '');
}

/**
 * How many distinct authored items a list of bank items actually contains.
 *
 * @param {Array<{id?: string, seedId?: string}>} items
 * @returns {number}
 */
export function countSeeds(items = []) {
  return new Set((items || []).map(practiceSeedId)).size;
}

/**
 * Map every item id in a scope to its seed, so a stored completion record
 * written before seeds existed can still be resolved to one.
 *
 * @param {Array<{id?: string, seedId?: string}>} items
 * @returns {Map<string, string>}
 */
export function seedIdIndex(items = []) {
  return new Map((items || []).map((item) => [String(item?.id || ''), practiceSeedId(item)]));
}

/**
 * The shape of one selectable scope: what is on offer, and how much of it is
 * distinct material.
 *
 * `questions` counts every blank a child could be shown. `seedQuestions`
 * counts the blanks of one representative per seed — the size of the topic as
 * a teacher would describe it.
 *
 * @param {Array<{id?: string, seedId?: string, answers?: unknown[]}>} items
 * @returns {{shown: number, seeds: number, variants: number, questions: number, seedQuestions: number}}
 */
export function seedBreakdown(items = []) {
  const list = items || [];
  const seen = new Set();
  let seedQuestions = 0;
  let questions = 0;

  for (const item of list) {
    const blanks = item?.answers?.length || 0;
    questions += blanks;
    const seed = practiceSeedId(item);
    if (seen.has(seed)) continue;
    seen.add(seed);
    seedQuestions += blanks;
  }

  return {
    shown: list.length,
    seeds: seen.size,
    variants: list.length - seen.size,
    questions,
    seedQuestions,
  };
}

/**
 * How many distinct seeds a set of completed item ids covers.
 *
 * `records` is the stored completion map for one scope, keyed by item id. A
 * record written since this change carries its own `seedId`; an older one does
 * not, so its id is resolved through `index` instead. An id that is in neither
 * — a passage that has since been removed from the bank — counts as its own
 * seed, which is the honest reading: something was completed, and we can no
 * longer say what it was a repeat of.
 *
 * @param {Record<string, {done?: boolean, seedId?: string}>} records
 * @param {Map<string, string>} index — item id → seed id, from `seedIdIndex`
 * @returns {number}
 */
export function countCoveredSeeds(records = {}, index = new Map()) {
  const seeds = new Set();
  for (const [itemId, record] of Object.entries(records || {})) {
    if (record && record.done === false) continue;
    seeds.add(String(record?.seedId || index.get(itemId) || itemId));
  }
  return seeds.size;
}
