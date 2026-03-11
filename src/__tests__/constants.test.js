/**
 * Sanity tests for constants.js.
 *
 * Verifies the SCREENS object is frozen (immutable) and contains the expected
 * screen IDs so that any accidental rename is caught at test time.
 */

import { describe, it, expect } from 'vitest';
import { SCREENS, QUEST_THRESHOLDS } from '../constants.js';

describe('SCREENS', () => {
  it('contains all expected screen IDs', () => {
    expect(SCREENS.PROFILES).toBe('screen-profiles');
    expect(SCREENS.HOME).toBe('screen-home');
    expect(SCREENS.GAME).toBe('screen-game');
    expect(SCREENS.RESULT).toBe('screen-result');
    expect(SCREENS.STORIES).toBe('screen-stories');
    expect(SCREENS.LETTER_SOUNDS).toBe('screen-letter-sounds');
    expect(SCREENS.SIGHT_MATCH).toBe('screen-sight-match');
    expect(SCREENS.SENTENCE_FORGE).toBe('screen-sentence-forge');
    expect(SCREENS.CLOZE_CASTLE).toBe('screen-cloze-castle');
    expect(SCREENS.WORD_VAULT).toBe('screen-word-vault');
    expect(SCREENS.EDITING_QUEST).toBe('screen-editing-quest');
    expect(SCREENS.WRITING_QUEST).toBe('screen-writing-quest');
  });

  it('is frozen (immutable)', () => {
    expect(Object.isFrozen(SCREENS)).toBe(true);
  });
});

describe('QUEST_THRESHOLDS', () => {
  it('has the expected mastery thresholds', () => {
    expect(QUEST_THRESHOLDS.sentenceForge).toBe(10);
    expect(QUEST_THRESHOLDS.clozeCastle).toBe(25);
    expect(QUEST_THRESHOLDS.wordVault).toBe(50);
    expect(QUEST_THRESHOLDS.editingQuest).toBe(70);
    expect(QUEST_THRESHOLDS.writingQuest).toBe(90);
  });

  it('is frozen (immutable)', () => {
    expect(Object.isFrozen(QUEST_THRESHOLDS)).toBe(true);
  });
});
