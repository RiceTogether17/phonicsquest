import { describe, it, expect } from 'vitest';
import { passages } from '../data/passages.js';
import { vocabPassages } from '../data/vocabPassages.js';

const POS_VALUES = new Set([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'word',
  'phrase',
  'article',
  'article/determiner',
  'determiner',
  'preposition',
]);

function buildAffixParts(answer, hint = '') {
  const lower = (answer || '').toLowerCase();
  const knownPrefixes = ['un', 're', 'dis', 'mis', 'in', 'im'];
  const knownSuffixes = [
    'ing',
    'ed',
    'ly',
    'er',
    'est',
    'ful',
    'less',
    'tion',
    'sion',
    'ment',
    'ness',
    'able',
    'ible',
  ];
  const hintAffix = (hint.match(
    /(un-|re-|dis-|mis-|in-|im-|-ing|-ed|-ly|-er|-est|-ful|-less|-tion|-sion|-ment|-ness|-able|-ible)/i,
  ) || [])[0];
  const normalizedHintAffix = hintAffix ? hintAffix.replace(/^-/, '').replace(/-$/, '') : '';
  if (hintAffix) {
    if (hintAffix.startsWith('-')) {
      const affix = normalizedHintAffix;
      return {
        root: answer.slice(0, Math.max(0, answer.length - affix.length)),
        affix,
        type: 'suffix',
      };
    }
    const affix = normalizedHintAffix;
    return { root: answer.slice(affix.length), affix, type: 'prefix' };
  }
  const prefix = knownPrefixes.find((p) => lower.startsWith(p) && lower.length > p.length + 2);
  if (prefix) return { root: answer.slice(prefix.length), affix: prefix, type: 'prefix' };
  const suffix = knownSuffixes.find((sf) => lower.endsWith(sf) && lower.length > sf.length + 2);
  if (suffix)
    return { root: answer.slice(0, answer.length - suffix.length), affix: suffix, type: 'suffix' };
  return { root: answer, affix: '', type: 'suffix' };
}

function checkBase(passage) {
  expect(passage.id).toBeTruthy();
  expect(passage.title).toBeTruthy();
  expect(typeof passage.text).toBe('string');
  expect(Array.isArray(passage.wordBank)).toBe(true);
  expect(Array.isArray(passage.answers)).toBe(true);

  const blanks = (passage.text.match(/___/g) || []).length;
  expect(blanks).toBe(passage.answers.length);

  for (const ans of passage.answers) {
    expect(String(ans).trim().length).toBeGreaterThan(0);
    expect(passage.wordBank).toContain(ans);
  }

  const bankCounts = new Map();
  for (const word of passage.wordBank) {
    const key = String(word).trim();
    expect(key.length, `empty option in wordBank for ${passage.id}`).toBeGreaterThan(0);
    bankCounts.set(key, (bankCounts.get(key) || 0) + 1);
  }
  const answerCounts = new Map();
  for (const ans of passage.answers) {
    const key = String(ans).trim();
    answerCounts.set(key, (answerCounts.get(key) || 0) + 1);
  }
  for (const [key, needed] of answerCounts) {
    const have = bankCounts.get(key) || 0;
    expect(
      have >= needed,
      `wordBank missing copies of "${key}" in ${passage.id} (need ${needed}, have ${have})`,
    ).toBe(true);
  }
}

function checkBlankSkillsSchema(passage) {
  if (!Array.isArray(passage.blankSkills)) return;
  for (const entry of passage.blankSkills) {
    if (entry == null) continue;
    if (typeof entry === 'string') continue;
    if (typeof entry === 'object') {
      if (Object.prototype.hasOwnProperty.call(entry, 'blankIndex')) {
        expect(Number.isInteger(entry.blankIndex), `non-integer blankIndex in ${passage.id}`).toBe(
          true,
        );
        expect(entry.blankIndex, `blankIndex out of range in ${passage.id}`).toBeGreaterThanOrEqual(
          0,
        );
        expect(entry.blankIndex).toBeLessThan(passage.answers.length);
      }
      if (entry.wrongOptionTraps !== undefined) {
        expect(
          typeof entry.wrongOptionTraps === 'object' && !Array.isArray(entry.wrongOptionTraps),
          `wrongOptionTraps must be an object map in ${passage.id}`,
        ).toBe(true);
      }
    }
  }
}

function containsWord(text, word) {
  return new RegExp(`\\b${String(word).replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i').test(
    text,
  );
}

describe('Cloze Castle passage validation', () => {
  it('validates structure, clue references and IDs', () => {
    const ids = new Set();
    for (const [level, cats] of Object.entries(passages)) {
      for (const [catKey, list] of Object.entries(cats || {})) {
        for (const passage of list || []) {
          checkBase(passage);
          expect(ids.has(passage.id), `duplicate id ${passage.id} in ${level}/${catKey}`).toBe(
            false,
          );
          ids.add(passage.id);

          if (Array.isArray(passage.clues)) {
            for (const clue of passage.clues) {
              expect(clue.blankIndex).toBeGreaterThanOrEqual(0);
              expect(clue.blankIndex).toBeLessThan(passage.answers.length);
              expect(String(clue.prompt || '').trim().length).toBeGreaterThan(0);
              expect(Array.isArray(clue.acceptableSpans) && clue.acceptableSpans.length > 0).toBe(
                true,
              );
              expect(String(clue.clueType || '').trim().length).toBeGreaterThan(0);
              if (!clue.allowExternalClue) {
                for (const span of clue.acceptableSpans) {
                  for (const token of String(span).split(/\s+/).filter(Boolean)) {
                    const clean = token.replace(/[^a-zA-Z'-]/g, '');
                    if (!clean || clean.length <= 1) continue;
                    expect(
                      containsWord(passage.text, clean),
                      `missing clue token "${clean}" in ${passage.id}`,
                    ).toBe(true);
                  }
                }
              }
            }
          }

          if (passage.grammarNotes) {
            expect(Array.isArray(passage.grammarNotes)).toBe(true);
            expect(passage.grammarNotes.length).toBeLessThanOrEqual(passage.answers.length);
          }

          checkBlankSkillsSchema(passage);
        }
      }
    }
  });
});

describe('Word Vault passage validation', () => {
  it('validates structure, definitions, POS, collocation and affix split', () => {
    const ids = new Set();
    for (const [catKey, levels] of Object.entries(vocabPassages || {})) {
      for (const [level, list] of Object.entries(levels || {})) {
        for (const passage of list || []) {
          checkBase(passage);
          expect(ids.has(passage.id), `duplicate id ${passage.id} in ${catKey}/${level}`).toBe(
            false,
          );
          ids.add(passage.id);

          if (passage.definitions) {
            for (const answer of passage.answers) {
              const def = passage.definitions[answer];
              expect(
                String(def || '').trim().length,
                `definition missing for ${answer} in ${passage.id}`,
              ).toBeGreaterThan(0);
            }
          }

          if (passage.partOfSpeechMap) {
            for (const pos of Object.values(passage.partOfSpeechMap)) {
              expect(POS_VALUES.has(pos)).toBe(true);
            }
          }

          if (passage.collocationHint !== undefined) {
            expect(String(passage.collocationHint || '').trim().length).toBeGreaterThan(0);
          }
          if (passage.collocationHintsByWord) {
            for (const hint of Object.values(passage.collocationHintsByWord)) {
              expect(String(hint || '').trim().length).toBeGreaterThan(0);
            }
          }

          checkBlankSkillsSchema(passage);

          if (catKey === 'morphologicalAffix' || passage.mode === 'affix') {
            for (let i = 0; i < passage.answers.length; i++) {
              const answer = passage.answers[i];
              const hint = (passage.hints || [])[i] || '';
              const parts = buildAffixParts(answer, hint);
              expect(String(parts.root || '').trim().length).toBeGreaterThan(0);
              if (parts.affix) {
                const recombined =
                  parts.type === 'prefix'
                    ? `${parts.affix}${parts.root}`
                    : `${parts.root}${parts.affix}`;
                expect(recombined.toLowerCase()).toBe(answer.toLowerCase());
              }
            }
          }
        }
      }
    }
  });
});
