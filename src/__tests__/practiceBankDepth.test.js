import { describe, expect, it } from 'vitest';
import { GRAMMAR_MCQ_ITEMS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS } from '../data/vocabMcq.js';
import { passages } from '../data/passages.js';
import { vocabPassages } from '../data/vocabPassages.js';
import { allSentences } from '../data/sentences.js';
import { MIN_QUESTIONS_PER_SCOPE } from '../data/practiceExpansion.js';
import { classifySentenceTrack } from '../modules/sentenceForgeTracks.js';
import { practiceSeedId, seedBreakdown } from '../data/practiceSeeds.js';

const normalize = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();
const blankCount = (text) => (String(text || '').match(/___/g) || []).length;

// Every category used to report 101 questions. It never held 101: each was a
// rotation through ~18 authored sentences, repeated six times and disguised
// by a scene-setting wrapper ("Fill in the blank in Siti's sentence: …").
// Removing the wrapper removed the disguise, so the banks now report what
// they actually contain. This floor is the real one — raise it by authoring
// more sentences in a builder, never by padding with copies again.
const MIN_QUESTIONS_PER_CATEGORY = 8;

function expectMcqScopes(bank, label) {
  for (const [level, items] of Object.entries(bank)) {
    const scopes = Object.groupBy(items, (item) => item.category);
    for (const [category, questions] of Object.entries(scopes)) {
      const tag = `${label}/${level}/${category}`;
      expect(questions.length, tag).toBeGreaterThanOrEqual(MIN_QUESTIONS_PER_CATEGORY);
      expect(
        new Set(questions.map((item) => normalize(item.q))).size,
        `${tag} unique prompts`,
      ).toBe(questions.length);
      // One item per seed now, so seed identity and item count match.
      expect(new Set(questions.map((item) => item.seedId)).size, `${tag} distinct seeds`).toBe(
        questions.length,
      );
      for (const item of questions) {
        expect(item.choices.length, `${item.id} choices`).toBe(4);
        expect(new Set(item.choices.map(normalize)).size, `${item.id} distinct choices`).toBe(4);
        expect(item.choices.includes(item.answer), `${item.id} answer in choices`).toBe(true);
        expect(item.explain, `${item.id} explanation`).toBeTruthy();
      }
    }
  }
}

// Audit 2026-09-19, finding 12. This file used to certify each cloze scope as
// holding "unique passages" by comparing whole passage texts — and the texts
// differ, because the generator prepends a lead sentence ("Mei shared this
// recount with the class."). Underneath, P1 Articles' 27 passages are four
// bodies and four answer sequences; P6 Context Inference's 38 are ten bodies
// and five sequences. The test was measuring the disguise.
//
// It now measures the material. `seedId` names the authored passage an item
// re-presents, so a scope's real depth is its seed count. Measured floors on
// this commit: Cloze Castle 3–11 seeds and 9–33 seed questions per scope,
// Word Vault 6–14 and 18–42. Raise these by authoring passages, never by
// generating more copies.
const MIN_SEEDS_PER_CLOZE_SCOPE = 3;
const MIN_SEED_QUESTIONS_PER_CLOZE_SCOPE = 9;

/** A generated variant is its seed plus a lead sentence; strip it to compare. */
const PASSAGE_LEAD =
  /^[A-Z][a-z]+ shared this (?:story|recount|diary entry|report|news article) with the class\.\s*/;
const passageBody = (text) => normalize(String(text || '').replace(PASSAGE_LEAD, ''));

function expectClozeScope(passagesForScope, tag) {
  const breakdown = seedBreakdown(passagesForScope);

  // Depth, counted in authored material rather than in copies.
  expect(breakdown.seeds, `${tag} distinct passages`).toBeGreaterThanOrEqual(
    MIN_SEEDS_PER_CLOZE_SCOPE,
  );
  expect(breakdown.seedQuestions, `${tag} distinct questions`).toBeGreaterThanOrEqual(
    MIN_SEED_QUESTIONS_PER_CLOZE_SCOPE,
  );

  // Every seed points at a passage in this same scope, so a completion record
  // can always be resolved to one.
  const ids = new Set(passagesForScope.map((passage) => passage.id));
  for (const passage of passagesForScope) {
    expect(ids.has(practiceSeedId(passage)), `${passage.id} seed ${passage.seedId} in ${tag}`).toBe(
      true,
    );
  }

  // Seeds are distinct material, and items sharing a seed really are the same
  // question — otherwise collapsing them into one unit of coverage would lose
  // something a child was asked.
  const bodyBySeed = new Map();
  const answersBySeed = new Map();
  for (const passage of passagesForScope) {
    const seed = practiceSeedId(passage);
    const body = passageBody(passage.text);
    const answers = passage.answers.map(normalize).join('|');
    if (!bodyBySeed.has(seed)) {
      bodyBySeed.set(seed, body);
      answersBySeed.set(seed, answers);
      continue;
    }
    expect(bodyBySeed.get(seed), `${passage.id} body matches its seed`).toBe(body);
    expect(answersBySeed.get(seed), `${passage.id} answers match its seed`).toBe(answers);
  }
  expect(new Set(bodyBySeed.values()).size, `${tag} distinct bodies`).toBe(bodyBySeed.size);

  for (const passage of passagesForScope) {
    expect(blankCount(passage.text), `${passage.id} blank count`).toBe(passage.answers.length);
    const bank = new Set(passage.wordBank.map(normalize));
    for (const answer of passage.answers) {
      expect(bank.has(normalize(answer)), `${passage.id} contains answer “${answer}”`).toBe(true);
    }
  }
}

describe('practice banks hold accurate, non-repeating questions per selectable scope', () => {
  it('covers every Grammar MCQ grade/category without repeating a question', () => {
    expectMcqScopes(GRAMMAR_MCQ_ITEMS, 'Grammar MCQ');
  });

  it('covers every Vocabulary MCQ grade/category without repeating a question', () => {
    expectMcqScopes(VOCAB_MCQ_ITEMS, 'Vocabulary MCQ');
  });

  it('no MCQ stem carries a scene-setting wrapper', () => {
    // The wrappers restated the on-screen instruction and buried the sentence
    // the child has to read. If one comes back, it means a generator started
    // padding a thin category with disguised copies again.
    const WRAPPERS = [
      /Fill in the blank in .+?'s sentence:/i,
      /is checking a sentence\. Choose the word/i,
      /read this sentence aloud, leaving out one word/i,
      /Choose the best word for the blank in/i,
      /Help .+? complete this sentence:/i,
      /is working on this question:/i,
      /Help .+? answer this:/i,
      /'s class discussed this question:/i,
      /Choose the best answer for .+?'s question:/i,
      /was asked this in class:/i,
    ];
    const offenders = [];
    for (const bank of [GRAMMAR_MCQ_ITEMS, VOCAB_MCQ_ITEMS]) {
      for (const items of Object.values(bank)) {
        for (const item of items) {
          if (WRAPPERS.some((re) => re.test(item.q))) offenders.push(`${item.id}: ${item.q}`);
        }
      }
    }
    expect(offenders.slice(0, 5), `${offenders.length} wrapped stems`).toEqual([]);
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
        const scope = allSentences.filter(
          (item) => item.level === level && classifySentenceTrack(item) === track,
        );
        if (!scope.length) continue;
        const tag = `Sentence Forge/P${level}/${track}`;
        expect(scope.length, tag).toBeGreaterThan(100);
        expect(
          new Set(scope.map((item) => normalize(item.sentence))).size,
          `${tag} unique sentences`,
        ).toBe(scope.length);
        expect(
          new Set(scope.map((item) => item.focusLabel)).size,
          `${tag} structural variety`,
        ).toBeGreaterThanOrEqual(4);
        for (const item of scope) {
          expect(item.sentence, `${item.id} sentence`).toMatch(/[.?!]$/);
          expect(item.sentenceSkills?.length, `${item.id} skills`).toBeGreaterThan(0);
          expect(item.grammarNote, `${item.id} grammar note`).toBeTruthy();
        }
      }
    }
  });

  it('uses the shared rotation depth expected by every generator', () => {
    // Still 101: generators rotate this many times through their authored
    // sentences, and the deduplication step keeps whatever distinct
    // questions that rotation produced.
    expect(MIN_QUESTIONS_PER_SCOPE).toBe(101);
  });
});
