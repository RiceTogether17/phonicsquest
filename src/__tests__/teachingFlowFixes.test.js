/*
 * Follow-up to the 2026-10-07 second-reader review (SECOND_READER_REVIEW_2026-10-07.md):
 *   D1 — the clue hunt only asks for clues a person wrote;
 *   D2 — Word Vault deals hand-written passages before template ones;
 *   D4 — P1–P2 Grammar MCQ items explain every option.
 */

import { describe, it, expect } from 'vitest';
import { passages } from '../data/passages.js';
import { vocabPassages } from '../data/vocabPassages.js';
import { GRAMMAR_MCQ_ITEMS } from '../data/grammarMcq.js';
import { practiceSeedId } from '../data/practiceSeeds.js';
import { hasClueHunt, huntableClue, nextClueHuntBlank } from '../modes/clueEngine.js';
import { wordVaultDealPool } from '../modes/wordVaultPool.js';

const clozeAll = (bank) => Object.values(bank).flatMap((group) => Object.values(group).flat());
const GENERIC_CLUE =
  /gives a clue for the correct|is the key textual evidence|signals the grammar form/;

describe('clue hunt asks only for authored clues', () => {
  it('flags every mechanically derived clue in both banks', () => {
    for (const p of [...clozeAll(passages), ...clozeAll(vocabPassages)]) {
      for (const clue of p.clues || []) {
        if (GENERIC_CLUE.test(clue.explanation || '')) expect(clue.generated, p.id).toBe(true);
      }
    }
  });

  it('hunts the next empty blank only when a person wrote its clue', () => {
    const passage = {
      clues: [
        { blankIndex: 0, generated: true, acceptableSpans: ['likes to play'] },
        { blankIndex: 1, acceptableSpans: ['Sara'] },
      ],
    };
    expect(hasClueHunt(passage)).toBe(true);
    expect(huntableClue(passage, 0)).toBeNull();
    expect(nextClueHuntBlank(passage, [null, null], {})).toBe(-1); // blank 1 is not next yet
    expect(nextClueHuntBlank(passage, [3, null], {})).toBe(1);
    expect(nextClueHuntBlank(passage, [3, null], { 1: 'strong' })).toBe(-1);
    expect(hasClueHunt({ clues: [{ blankIndex: 0, generated: true }] })).toBe(false);
  });

  it('keeps authored grammar clues huntable', () => {
    const p = clozeAll(passages).find((x) => x.id === 'gm-p4-perfectContinuousTenses-1');
    expect(huntableClue(p, 0)?.acceptableSpans).toEqual(['By noon']);
  });
});

describe('Word Vault deals hand-written passages first', () => {
  const list = vocabPassages.contextInference.p6;
  const generated = (pool) => pool.filter((p) => p.id.startsWith('vxg-'));

  it('deals no template passage until every hand-written one is done', () => {
    const fresh = wordVaultDealPool(list, [], practiceSeedId);
    expect(fresh.length).toBeGreaterThan(0);
    expect(generated(fresh)).toHaveLength(0);
  });

  it('then adds one passage per template body, not 34 near-copies', () => {
    const authoredSeeds = list.filter((p) => !p.id.startsWith('vxg-')).map(practiceSeedId);
    const later = wordVaultDealPool(list, authoredSeeds, practiceSeedId);
    const bodies = new Set(generated(list).map(practiceSeedId));
    expect(generated(later)).toHaveLength(bodies.size);
  });

  it('collapses template copies where nothing is hand-written', () => {
    const onlyGenerated = vocabPassages.proverbsSayings.p1.filter((p) => p.id.startsWith('vxg-'));
    const pool = wordVaultDealPool(onlyGenerated, [], practiceSeedId);
    expect(pool.length).toBe(new Set(onlyGenerated.map(practiceSeedId)).size);
  });
});

describe('P1–P2 Grammar MCQ explains every option', () => {
  const GENERIC = /is the choice that fits this sentence/;

  it.each(['P1', 'P2'])('%s has no generic explanation left', (level) => {
    const generic = GRAMMAR_MCQ_ITEMS[level].filter((i) =>
      Object.values(i.optionExplanations).some((t) => GENERIC.test(t)),
    );
    expect(generic.map((i) => i.q)).toEqual([]);
  });

  it('names the time clue in simple-past feedback', () => {
    const item = GRAMMAR_MCQ_ITEMS.P1.find((i) => i.q.startsWith('Yesterday, Grandma'));
    expect(item.optionExplanations[item.answer]).toMatch(
      /“Yesterday” tells us it already happened/,
    );
    expect(item.optionExplanations['is giving']).toMatch(/happening right now/);
  });

  it('names who the pronoun stands for, even after a name swap', () => {
    for (const item of GRAMMAR_MCQ_ITEMS.P1.filter((i) =>
      /went to the park\. ___ played/.test(i.q),
    )) {
      const name = item.q.split(' ')[0];
      expect(item.optionExplanations.We).toContain(name);
    }
  });
});
