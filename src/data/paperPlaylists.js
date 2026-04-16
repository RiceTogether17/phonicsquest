export const PAPER_LEVELS = ['P1','P2','P3','P4','P5','P6'];

/**
 * PSLE Paper 2 (Language Use and Comprehension) section order:
 *   Booklet A — Grammar MCQ → Grammar Cloze → Vocabulary MCQ →
 *               Vocabulary Cloze → Editing for Spelling and Grammar
 *   Booklet B — Synthesis & Transformation (+ Comprehension in actual PSLE)
 *
 * P1-P2 use a foundational ordering that introduces each component type.
 * P3 transitions toward the PSLE sequence.
 * P4-P6 follow the official PSLE Paper 2 section order.
 */
export const PAPER_MODE_PLAYLISTS = {
  // P1-P2: Foundational format — builds familiarity with each section type
  P1: ['grammar-mcq', 'vocab-mcq', 'cloze-castle', 'word-vault', 'sentence-forge-word-order', 'editing-quest'],
  P2: ['grammar-mcq', 'vocab-mcq', 'cloze-castle', 'word-vault', 'sentence-forge-word-order', 'sentence-forge-combining', 'editing-quest'],
  // P3: Transition format — introduces PSLE section order
  P3: ['grammar-mcq', 'cloze-castle', 'vocab-mcq', 'word-vault', 'sentence-forge-combining', 'editing-quest'],
  // P4-P6: PSLE Paper 2 order — Booklet A sections then Booklet B
  P4: ['grammar-mcq', 'cloze-castle', 'vocab-mcq', 'word-vault', 'editing-quest', 'sentence-forge-synthesis'],
  P5: ['grammar-mcq', 'cloze-castle', 'vocab-mcq', 'word-vault', 'editing-quest', 'sentence-forge-synthesis'],
  P6: ['grammar-mcq', 'cloze-castle', 'vocab-mcq', 'word-vault', 'editing-quest', 'sentence-forge-synthesis'],
};

export const PAPER_SECTION_LABELS = {
  'grammar-mcq': 'Grammar MCQ',
  'vocab-mcq': 'Vocabulary MCQ',
  'cloze-castle': 'Grammar Cloze',
  'word-vault': 'Vocabulary Cloze',
  'sentence-forge-word-order': 'Word Order',
  'sentence-forge-combining': 'Sentence Combining',
  'sentence-forge-synthesis': 'Synthesis & Transformation',
  'editing-quest': 'Editing for Spelling and Grammar',
};

/** Marks allocated per section, per level (aligned to school and PSLE weighting). */
export const PAPER_SECTION_MARKS = {
  P1: { 'grammar-mcq': 10, 'vocab-mcq': 5, 'cloze-castle': 10, 'word-vault': 5, 'sentence-forge-word-order': 5, 'editing-quest': 8 },
  P2: { 'grammar-mcq': 10, 'vocab-mcq': 5, 'cloze-castle': 10, 'word-vault': 5, 'sentence-forge-word-order': 5, 'sentence-forge-combining': 5, 'editing-quest': 8 },
  P3: { 'grammar-mcq': 12, 'cloze-castle': 10, 'vocab-mcq': 5, 'word-vault': 5, 'sentence-forge-combining': 8, 'editing-quest': 10 },
  P4: { 'grammar-mcq': 15, 'cloze-castle': 10, 'vocab-mcq': 5, 'word-vault': 5, 'editing-quest': 12, 'sentence-forge-synthesis': 10 },
  P5: { 'grammar-mcq': 15, 'cloze-castle': 10, 'vocab-mcq': 5, 'word-vault': 5, 'editing-quest': 12, 'sentence-forge-synthesis': 10 },
  P6: { 'grammar-mcq': 15, 'cloze-castle': 10, 'vocab-mcq': 5, 'word-vault': 5, 'editing-quest': 12, 'sentence-forge-synthesis': 10 },
};

/**
 * Booklet split for P4-P6 (mirrors PSLE Paper 2 structure).
 * Booklet A: Grammar MCQ → Grammar Cloze → Vocab MCQ → Vocab Cloze → Editing
 * Booklet B: Synthesis & Transformation
 */
export const PAPER_BOOKLET_SPLIT = {
  P4: { bookletA: ['grammar-mcq', 'cloze-castle', 'vocab-mcq', 'word-vault', 'editing-quest'], bookletB: ['sentence-forge-synthesis'] },
  P5: { bookletA: ['grammar-mcq', 'cloze-castle', 'vocab-mcq', 'word-vault', 'editing-quest'], bookletB: ['sentence-forge-synthesis'] },
  P6: { bookletA: ['grammar-mcq', 'cloze-castle', 'vocab-mcq', 'word-vault', 'editing-quest'], bookletB: ['sentence-forge-synthesis'] },
};

/**
 * Item count caps per section per level, aligned to PSLE Paper 2 question
 * counts.  When Paper Mode launches a section, it sets this as a one-shot
 * store flag so MCQ modes present only the right number of questions rather
 * than the entire item bank.
 *
 * null means "no cap — present all items" (e.g. cloze passages where length
 * is determined by the passage itself).
 */
export const PAPER_ITEM_COUNTS = {
  P1: { 'grammar-mcq': 10, 'vocab-mcq': 5,  'cloze-castle': null, 'word-vault': null, 'sentence-forge-word-order': null, 'editing-quest': null },
  P2: { 'grammar-mcq': 10, 'vocab-mcq': 5,  'cloze-castle': null, 'word-vault': null, 'sentence-forge-word-order': null, 'sentence-forge-combining': null, 'editing-quest': null },
  P3: { 'grammar-mcq': 12, 'vocab-mcq': 5,  'cloze-castle': null, 'word-vault': null, 'sentence-forge-combining': null, 'editing-quest': null },
  P4: { 'grammar-mcq': 15, 'vocab-mcq': 5,  'cloze-castle': null, 'word-vault': null, 'editing-quest': null, 'sentence-forge-synthesis': null },
  P5: { 'grammar-mcq': 15, 'vocab-mcq': 5,  'cloze-castle': null, 'word-vault': null, 'editing-quest': null, 'sentence-forge-synthesis': null },
  P6: { 'grammar-mcq': 15, 'vocab-mcq': 5,  'cloze-castle': null, 'word-vault': null, 'editing-quest': null, 'sentence-forge-synthesis': null },
};

/** Suggested time per level (practice paper pacing). */
export const PAPER_TIMING = {
  P1: '45 min',
  P2: '50 min',
  P3: '1 h',
  P4: '1 h 10 min',
  P5: '1 h 30 min',
  P6: '1 h 50 min',
};
