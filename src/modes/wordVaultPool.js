/**
 * Which Word Vault passages a child can be dealt next.
 *
 * About nine in ten Word Vault passages come from the template generator in
 * `vocabPassagesExtra/generator.js`: 34 per category and level, built from six
 * bodies that share the same three answers at every level. Dealing from the
 * whole list at random meant a child met "muddy / umbrella / dry" far more
 * often than any hand-written passage — about 89% of the time on a first visit.
 *
 * So hand-written passages come first: until each one has been completed, only
 * those are dealt. After that, the generated material joins as variety, but as
 * one passage per distinct body rather than 34 near-copies. Categories with
 * no hand-written passage get the same treatment from the start.
 *
 * @param {object[]} passageList   one category and level of Word Vault
 * @param {Iterable<string>} doneSeeds  seed ids the child has completed there
 * @param {(p: object) => string} seedOf
 * @returns {object[]}
 */
export function wordVaultDealPool(passageList, doneSeeds, seedOf) {
  const isGenerated = (p) => String(p.id || '').startsWith('vxg-');
  const authored = passageList.filter((p) => !isGenerated(p));

  const done = new Set(doneSeeds);
  const unseen = authored.filter((p) => !done.has(seedOf(p)));
  if (unseen.length) return unseen;

  const generatedBodies = new Map();
  for (const p of passageList) {
    if (isGenerated(p) && !generatedBodies.has(seedOf(p))) generatedBodies.set(seedOf(p), p);
  }
  const pool = [...authored, ...generatedBodies.values()];
  return pool.length ? pool : passageList;
}
