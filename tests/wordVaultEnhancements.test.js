import { describe, expect, it, vi } from 'vitest';
import { vocabPassages } from '../src/data/vocabPassages.js';

describe('word vault enhancements', () => {
  it('computes star ratings with hint-sensitive thresholds', async () => {
    vi.resetModules();
    globalThis.speechSynthesis = { getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {} };
    const { getWordVaultStars, renderSummaryStars } = await import('../src/modes/wordVault.js');

    expect(getWordVaultStars({ accuracy: 95, hintsUsed: 0 })).toBe(3);
    expect(getWordVaultStars({ accuracy: 75, hintsUsed: 2 })).toBe(2);
    expect(getWordVaultStars({ accuracy: 65, hintsUsed: 0 })).toBe(1);
    expect(renderSummaryStars(2)).toBe('⭐⭐☆');
  });

  it('builds affix parts from answers and hints', async () => {
    vi.resetModules();
    globalThis.speechSynthesis = { getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {} };
    const { buildAffixParts } = await import('../src/modes/wordVault.js');

    expect(buildAffixParts('unhappy', 'Prefix un- means not')).toEqual({ root: 'happy', affix: 'un', type: 'prefix' });
    expect(buildAffixParts('careful', 'Suffix -ful means full of')).toEqual({ root: 'care', affix: 'ful', type: 'suffix' });
  });

  it('enriches vocab metadata and ensures minimum category content', () => {
    const sampleSyn = vocabPassages.synonymContrast.p4[0];
    expect(sampleSyn.contrastPairs?.length).toBeGreaterThan(0);
    expect(Object.keys(sampleSyn.definitions || {}).length).toBeGreaterThan(0);

    const sampleCollocation = vocabPassages.collocationCloze.p5[0];
    expect(sampleCollocation.collocationHint).toBeTruthy();

    const sampleGrammar = vocabPassages.grammaticalRole.p4[0];
    expect(sampleGrammar.partOfSpeechMap).toBeTruthy();

    expect((vocabPassages.contextInference.p1 || []).length).toBeGreaterThanOrEqual(8);
    expect((vocabPassages.definitionMatch.p6 || []).length).toBeGreaterThanOrEqual(8);
    expect((vocabPassages.idiomaticExpressions.p3 || []).length).toBeGreaterThanOrEqual(8);
    expect((vocabPassages.scienceTechTerms.p6 || []).length).toBeGreaterThanOrEqual(8);
  });
});
