import { describe, expect, it } from 'vitest';
import { GRAMMAR_MCQ_ITEMS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS } from '../data/vocabMcq.js';
import { passages } from '../data/passages.js';
import { vocabPassages } from '../data/vocabPassages.js';
import { allSentences } from '../data/sentences.js';
import { MIN_QUESTIONS_PER_SCOPE } from '../data/practiceExpansion.js';
import { classifySentenceTrack } from '../modules/sentenceForgeTracks.js';

const normalize = value => String(value || '').trim().toLowerCase();
const blankCount = text => (String(text || '').match(/___/g) || []).length;

function expectMcqScopes(bank, label) {
  for (const [level, items] of Object.entries(bank)) {
    const scopes = Object.groupBy(items, item => item.category);
    for (const [category, questions] of Object.entries(scopes)) {
      const tag = `${label}/${level}/${category}`;
      expect(questions.length, tag).toBeGreaterThan(100);
      expect(new Set(questions.map(item => normalize(item.q))).size, `${tag} unique prompts`).toBe(questions.length);
      expect(new Set(questions.map(item => item.questionType)).size, `${tag} question formats`).toBeGreaterThanOrEqual(5);
      for (const item of questions) {
        expect(item.choices.length, `${item.id} choices`).toBe(4);
        expect(new Set(item.choices.map(normalize)).size, `${item.id} distinct choices`).toBe(4);
        expect(item.choices.includes(item.answer), `${item.id} answer in choices`).toBe(true);
        expect(item.explain, `${item.id} explanation`).toBeTruthy();
      }
    }
  }
}

function expectClozeScope(passagesForScope, tag) {
  const questionCount = passagesForScope.reduce((sum, passage) => sum + passage.answers.length, 0);
  expect(questionCount, `${tag} question count`).toBeGreaterThan(100);
  expect(new Set(passagesForScope.map(passage => normalize(passage.text))).size, `${tag} unique passages`).toBe(passagesForScope.length);
  for (const passage of passagesForScope) {
    expect(blankCount(passage.text), `${passage.id} blank count`).toBe(passage.answers.length);
    const bank = new Set(passage.wordBank.map(normalize));
    for (const answer of passage.answers) {
      expect(bank.has(normalize(answer)), `${passage.id} contains answer “${answer}”`).toBe(true);
    }
  }
}

describe('practice banks exceed 100 accurate questions per selectable scope', () => {
  it('covers every Grammar MCQ grade/category with five question formats', () => {
    expectMcqScopes(GRAMMAR_MCQ_ITEMS, 'Grammar MCQ');
  });

  it('covers every Vocabulary MCQ grade/category with five question formats', () => {
    expectMcqScopes(VOCAB_MCQ_ITEMS, 'Vocabulary MCQ');
  });

  it('covers every Cloze Castle grade/category with unique, answerable blanks', () => {
    for (const [level, categories] of Object.entries(passages)) {
      for (const [category, scope] of Object.entries(categories)) {
        expectClozeScope(scope, `Cloze Castle/${level}/${category}`);
      }
    }
  });

  it('covers every Word Vault category/grade with unique, answerable blanks', () => {
    for (const [category, levels] of Object.entries(vocabPassages)) {
      for (const [level, scope] of Object.entries(levels)) {
        expectClozeScope(scope, `Word Vault/${category}/${level}`);
      }
    }
  });

  it('covers every selectable Sentence Forge grade/track with varied structures', () => {
    const tracks = ['word-order', 'sentence-combining', 'synthesis-transformation'];
    for (let level = 1; level <= 6; level += 1) {
      for (const track of tracks) {
        const scope = allSentences.filter(item => item.level === level && classifySentenceTrack(item) === track);
        if (!scope.length) continue;
        const tag = `Sentence Forge/P${level}/${track}`;
        expect(scope.length, tag).toBeGreaterThan(100);
        expect(new Set(scope.map(item => normalize(item.sentence))).size, `${tag} unique sentences`).toBe(scope.length);
        expect(new Set(scope.map(item => item.focusLabel)).size, `${tag} structural variety`).toBeGreaterThanOrEqual(4);
        for (const item of scope) {
          expect(item.sentence, `${item.id} sentence`).toMatch(/[.?!]$/);
          expect(item.sentenceSkills?.length, `${item.id} skills`).toBeGreaterThan(0);
          expect(item.grammarNote, `${item.id} grammar note`).toBeTruthy();
        }
      }
    }
  });

  it('uses the shared threshold expected by every generator', () => {
    expect(MIN_QUESTIONS_PER_SCOPE).toBe(101);
  });
});
