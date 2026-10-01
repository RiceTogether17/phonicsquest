/*
 * Audit 2026-09-19, finding 12 — practice-bank size overstates instructional
 * variety.
 *
 * The audit measured two scopes:
 *
 *   P1 Articles          27 passages, 102 blanks →  4 unique bodies, 4 answer sequences
 *   P6 Context Inference 38 passages, 114 blanks → 10 unique bodies, 5 answer sequences
 *
 * and noted the README promising more than 100 questions per Grammar and
 * Vocabulary MCQ grade/category against actual sizes of 8–23.
 *
 * Both reproduce here, which is the point of the first block below: the
 * measurement is taken independently of `seedId` (by stripping the generated
 * lead sentence and comparing bodies) and then checked against what `seedId`
 * says. If a future generator tags items with seeds that do not match the
 * material, these two numbers stop agreeing.
 *
 * The fix is not fewer passages. Re-reading a passage a week later is real
 * practice, and the brief is explicit that the claim should be corrected
 * rather than the activity deleted. What changes is the counting: coverage is
 * counted in seeds, practice volume in rounds, and the two are labelled
 * separately wherever a parent or child reads them.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { passages } from '../data/passages.js';
import { vocabPassages } from '../data/vocabPassages.js';
import { allSentences } from '../data/sentences.js';
import { GRAMMAR_MCQ_ITEMS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS } from '../data/vocabMcq.js';
import { classifySentenceTrack } from '../modules/sentenceForgeTracks.js';
import {
  countCoveredSeeds,
  countSeeds,
  isSurfaceVariant,
  practiceSeedId,
  seedBreakdown,
  seedIdIndex,
} from '../data/practiceSeeds.js';
import {
  getUniqueClozeDone,
  getUniqueWordVaultDone,
  recordClozeCompletion,
  recordWordVaultCompletion,
} from '../modes/clozeCompletionTracker.js';

/** The lead sentence `_ensureGrammarPassageDepth` and the Word Vault generator prepend. */
const PASSAGE_LEAD =
  /^[A-Z][a-z]+ shared this (?:story|recount|diary entry|report|news article) with the class\.\s*/;

const body = (text) =>
  String(text || '')
    .replace(PASSAGE_LEAD, '')
    .trim()
    .toLowerCase();

/** The audit's measurement, taken without reference to `seedId`. */
function measure(list) {
  return {
    shown: list.length,
    blanks: list.reduce((sum, p) => sum + (p.answers?.length || 0), 0),
    bodies: new Set(list.map((p) => body(p.text))).size,
    sequences: new Set(list.map((p) => (p.answers || []).join('|').toLowerCase())).size,
  };
}

const CLOZE_SCOPES = Object.entries(passages).flatMap(([level, cats]) =>
  Object.entries(cats).map(([cat, list]) => [`Cloze Castle/${level}/${cat}`, list]),
);
const VAULT_SCOPES = Object.entries(vocabPassages).flatMap(([cat, levels]) =>
  Object.entries(levels).map(([level, list]) => [`Word Vault/${cat}/${level}`, list]),
);

describe('the audit’s measurements still hold (finding 12)', () => {
  it('P1 Articles is 27 passages and 102 blanks built from four bodies', () => {
    const m = measure(passages.P1.articles);
    expect(m).toEqual({ shown: 27, blanks: 102, bodies: 4, sequences: 4 });
  });

  it('P6 Context Inference is 38 passages and 114 blanks built from ten bodies', () => {
    const m = measure(vocabPassages.contextInference.p6);
    expect(m).toEqual({ shown: 38, blanks: 114, bodies: 10, sequences: 5 });
  });

  it('seed ids collapse each scope to exactly the material it holds', () => {
    // The independent measurement and the seed tagging have to agree, or one
    // of them is lying about the bank.
    for (const [tag, list] of [...CLOZE_SCOPES, ...VAULT_SCOPES]) {
      expect(countSeeds(list), `${tag} seeds vs distinct bodies`).toBe(measure(list).bodies);
    }
  });

  it('Grammar and Vocabulary MCQ scopes are 8–23 questions, as the audit found', () => {
    const sizes = [GRAMMAR_MCQ_ITEMS, VOCAB_MCQ_ITEMS].flatMap((bank) =>
      Object.values(bank).flatMap((items) =>
        Object.values(Object.groupBy(items, (item) => item.category)).map((list) => list.length),
      ),
    );
    expect(Math.min(...sizes)).toBe(8);
    expect(Math.max(...sizes)).toBe(23);
  });
});

describe('seeds and variants are distinguishable (finding 12)', () => {
  it('every generated cloze variant names a seed that exists in its own scope', () => {
    for (const [tag, list] of [...CLOZE_SCOPES, ...VAULT_SCOPES]) {
      const ids = new Set(list.map((p) => p.id));
      for (const p of list) {
        expect(ids.has(practiceSeedId(p)), `${tag} · ${p.id} → ${p.seedId}`).toBe(true);
      }
    }
  });

  it('a seed is its own item and a variant is not', () => {
    const [, articles] = CLOZE_SCOPES.find(([tag]) => tag === 'Cloze Castle/P1/articles');
    const seeds = articles.filter((p) => !isSurfaceVariant(p));
    const variants = articles.filter(isSurfaceVariant);

    expect(seeds).toHaveLength(4);
    expect(variants).toHaveLength(23);
    // A variant is the seed's text with a lead sentence in front of it.
    for (const variant of variants) {
      const seed = articles.find((p) => p.id === variant.seedId);
      expect(variant.text.endsWith(seed.text), `${variant.id} carries its seed's text`).toBe(true);
      expect(variant.answers).toEqual(seed.answers);
      expect(variant.isVariant).toBe(true);
    }
  });

  it('reports practice volume and coverage as two different numbers', () => {
    const b = seedBreakdown(passages.P1.articles);
    expect(b).toEqual({
      shown: 27,
      seeds: 4,
      variants: 23,
      questions: 102,
      seedQuestions: 15,
    });
  });

  it('Sentence Forge holds authored sentences, not variants of a few', () => {
    // The one bank whose "100+ per scope" claim was always true. The variant
    // builder still exists and still tags what it makes, but every scope is
    // full of authored material, so it never runs.
    const scopes = new Map();
    for (const item of allSentences) {
      const key = `P${item.level}/${classifySentenceTrack(item)}`;
      if (!scopes.has(key)) scopes.set(key, []);
      scopes.get(key).push(item);
    }
    expect(scopes.size).toBe(15);
    for (const [tag, list] of scopes) {
      expect(list.filter(isSurfaceVariant), `${tag} variants`).toEqual([]);
      expect(countSeeds(list), `${tag} seeds`).toBeGreaterThan(100);
    }
  });
});

describe('completion counts coverage in seeds (finding 12)', () => {
  const scope = passages.P1.articles;
  const index = seedIdIndex(scope);
  const seedOne = scope.filter((p) => practiceSeedId(p) === scope[0].id);

  it('three rounds of the same passage are one passage covered', () => {
    expect(seedOne.length, 'P1 articles re-presents its first passage').toBeGreaterThanOrEqual(3);

    let state = {};
    for (const passage of seedOne.slice(0, 3)) {
      state = recordClozeCompletion({
        level: 'P1',
        category: 'articles',
        passageId: passage.id,
        seedId: practiceSeedId(passage),
        ccqCompletedByPassage: state,
      }).nextByPassage;
    }

    // Three completion records...
    expect(Object.keys(state.P1.articles)).toHaveLength(3);
    // ...covering one passage.
    expect(
      getUniqueClozeDone({
        level: 'P1',
        category: 'articles',
        ccqCompletedByPassage: state,
        seedIndex: index,
      }),
    ).toBe(1);
  });

  it('four different passages are four passages covered', () => {
    const oneEach = [...new Map(scope.map((p) => [practiceSeedId(p), p])).values()];
    let state = {};
    for (const passage of oneEach) {
      state = recordClozeCompletion({
        level: 'P1',
        category: 'articles',
        passageId: passage.id,
        seedId: practiceSeedId(passage),
        ccqCompletedByPassage: state,
      }).nextByPassage;
    }
    expect(
      getUniqueClozeDone({
        level: 'P1',
        category: 'articles',
        ccqCompletedByPassage: state,
        seedIndex: index,
      }),
    ).toBe(4);
  });

  it('resolves records written before seeds were stored', () => {
    // An existing install's records carry a passage id and nothing else. The
    // bank still knows what each id is a repeat of, so their coverage is
    // recoverable rather than permanently overstated.
    const legacy = Object.fromEntries(seedOne.slice(0, 3).map((p) => [p.id, { done: true }]));
    expect(countCoveredSeeds(legacy, index)).toBe(1);
    // Without the index there is nothing to resolve them against, and the old
    // over-count is the only answer available.
    expect(countCoveredSeeds(legacy, new Map())).toBe(3);
  });

  it('counts a passage that has since left the bank rather than dropping it', () => {
    expect(countCoveredSeeds({ 'gxp-p1-articles-999': { done: true } }, index)).toBe(1);
  });

  it('does the same for Word Vault', () => {
    const vault = vocabPassages.contextInference.p6;
    const vaultIndex = seedIdIndex(vault);
    // The generator re-presents each body across the level; take whichever
    // seed it re-presented most.
    const bySeed = new Map();
    for (const p of vault) {
      const seed = practiceSeedId(p);
      bySeed.set(seed, [...(bySeed.get(seed) || []), p]);
    }
    const sameSeed = [...bySeed.values()].sort((a, b) => b.length - a.length)[0];
    expect(sameSeed.length).toBeGreaterThanOrEqual(2);

    let state = {};
    for (const passage of sameSeed.slice(0, 2)) {
      state = recordWordVaultCompletion({
        category: 'contextInference',
        level: 'p6',
        passageId: passage.id,
        seedId: practiceSeedId(passage),
        wvqCompletedByPassage: state,
      }).nextByPassage;
    }
    expect(
      getUniqueWordVaultDone({
        category: 'contextInference',
        level: 'p6',
        wvqCompletedByPassage: state,
        seedIndex: vaultIndex,
      }),
    ).toBe(1);
  });
});

describe('the README reports the live banks (finding 12)', () => {
  const readme = readFileSync(resolve(import.meta.dirname, '../../README.md'), 'utf8');

  /** One row of the practice-bank-sizes table, as a list of trimmed cells. */
  function row(module) {
    const line = readme
      .split('\n')
      .find((l) => l.startsWith('|') && l.split('|')[1]?.trim() === module);
    expect(line, `README row for ${module}`).toBeTruthy();
    return line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
  }

  const range = (list, of) => [Math.min(...list.map(of)), Math.max(...list.map(of))];

  function mcqScopes(bank) {
    return Object.values(bank).flatMap((items) =>
      Object.values(Object.groupBy(items, (item) => item.category)),
    );
  }

  it('no longer claims more than 100 questions in every scope', () => {
    // The specific sentence the audit quoted. It was true of Sentence Forge
    // alone; four of the five banks it named are nowhere near it.
    expect(readme).not.toMatch(/contains more than 100 questions/);
  });

  it.each([
    ['Grammar MCQ', () => mcqScopes(GRAMMAR_MCQ_ITEMS)],
    ['Vocabulary MCQ', () => mcqScopes(VOCAB_MCQ_ITEMS)],
  ])('%s scope count, sizes and total match the bank', (module, get) => {
    const scopes = get();
    const [min, max] = range(scopes, (list) => list.length);
    const total = scopes.reduce((sum, list) => sum + list.length, 0);
    const [scopeCell, sizeCell, totalCell] = [row(module)[1], row(module)[2], row(module)[3]];

    expect(scopeCell).toBe(`${scopes.length} grade/category`);
    expect(sizeCell).toBe(`${min}–${max} questions`);
    expect(totalCell).toBe(`${total} questions, no repeats`);
  });

  it.each([
    ['Cloze Castle', () => CLOZE_SCOPES.map(([, list]) => list), 'grade/category'],
    ['Word Vault', () => VAULT_SCOPES.map(([, list]) => list), 'category/grade'],
  ])('%s scope count, sizes and totals match the bank', (module, get, scopeLabel) => {
    const scopes = get().map(seedBreakdown);
    const [minSeeds, maxSeeds] = range(scopes, (b) => b.seeds);
    const [minQ, maxQ] = range(scopes, (b) => b.seedQuestions);
    const seedTotal = scopes.reduce((sum, b) => sum + b.seeds, 0);
    const shownTotal = scopes.reduce((sum, b) => sum + b.shown, 0);
    const cells = row(module);

    expect(cells[1]).toBe(`${scopes.length} ${scopeLabel}`);
    expect(cells[2]).toBe(`${minSeeds}–${maxSeeds} passages, ${minQ}–${maxQ} blanks`);
    expect(cells[3]).toBe(`${seedTotal} passages, ${shownTotal} rounds`);
  });

  it('Sentence Forge scope count, sizes and total match the bank', () => {
    const scopes = [
      ...allSentences.reduce((map, item) => {
        const key = `P${item.level}/${classifySentenceTrack(item)}`;
        map.set(key, (map.get(key) || 0) + 1);
        return map;
      }, new Map()),
    ];
    const [min, max] = range(scopes, ([, n]) => n);
    const total = scopes.reduce((sum, [, n]) => sum + n, 0);
    const cells = row('Sentence Forge');

    expect(cells[1]).toBe(`${scopes.length} grade/track`);
    expect(cells[2]).toBe(`${min}–${max} sentences`);
    expect(cells[3]).toBe(`${total} sentences, no repeats`);
  });
});
