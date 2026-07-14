/**
 * Sight-word ↔ story weave regression guard.
 *
 * The easy sight-word quests are ordered to match the Giri story
 * sequence: a quest's words should be meetable in stories of its
 * declared band, so the card game pre-teaches what the child is about
 * to read. These tests keep the two content sets aligned as either grows.
 */
import { beforeAll, describe, expect, it } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

let SIGHT_QUESTS, STORIES, extractCountableTokens, weave;
beforeAll(async () => {
  stubAudioGlobals();
  ({ SIGHT_QUESTS } = await import('../data/sightwords.js'));
  ({ STORIES } = await import('../data/stories.js'));
  ({ extractCountableTokens } = await import('../modules/decodability.js'));
  weave = await import('../modules/sightStoryWeave.js');
});

/** All lowercase tokens appearing in stories of the given bands. */
function tokensInBands(bands) {
  const set = new Set();
  for (const story of STORIES) {
    if (!bands.includes(story.band)) continue;
    for (const t of extractCountableTokens(story)) set.add(t);
  }
  return set;
}

describe('story-aligned easy quests', () => {
  it('every easy quest declares a storyBand in non-decreasing order', () => {
    const easy = SIGHT_QUESTS.filter(q => q.tier === 'easy');
    const order = { A: 1, B: 2, C: 3, D: 4 };
    let last = 0;
    for (const quest of easy) {
      expect(order[quest.storyBand], `${quest.id} storyBand`).toBeGreaterThan(0);
      expect(order[quest.storyBand], `${quest.id} out of band order`).toBeGreaterThanOrEqual(last);
      last = order[quest.storyBand];
    }
  });

  it('quest words appear in stories at or before their declared band (few riders allowed)', () => {
    const easy = SIGHT_QUESTS.filter(q => q.tier === 'easy');
    const bandsThrough = { A: ['A'], B: ['A', 'B'], C: ['A', 'B', 'C'], D: ['A', 'B', 'C', 'D'] };
    let riders = 0;
    for (const quest of easy) {
      const available = tokensInBands(bandsThrough[quest.storyBand]);
      for (const word of quest.words) {
        if (!available.has(word.toLowerCase())) riders += 1;
      }
    }
    // 'also', 'does', 'want' never appear in any story — they ride along
    // in the final quests. Anything above that means drift.
    expect(riders).toBeLessThanOrEqual(3);
  });

  it('reordering preserved all 50 easy words exactly once', () => {
    const words = SIGHT_QUESTS.filter(q => q.tier === 'easy').flatMap(q => q.words.map(w => w.toLowerCase()));
    expect(words.length).toBe(50);
    expect(new Set(words).size).toBe(50);
  });
});

describe('weave lookups', () => {
  it('getSightWordsInStory finds quest words in a Band A mini, quest-ordered', () => {
    const words = weave.getSightWordsInStory('core-a-01');
    expect(words.length).toBeGreaterThan(0);
    // 'the' is a Quest 1 word and appears in the story — it should lead.
    expect(words[0]).toBe('a');
  });

  it('every easy quest links to a story in its band', () => {
    for (const quest of SIGHT_QUESTS.filter(q => q.tier === 'easy' && q.storyBand)) {
      const story = weave.getStoryForQuest(quest);
      expect(story, `${quest.id} has no linked story`).not.toBeNull();
      expect(story.band).toBe(quest.storyBand);
    }
  });

  it('returns empty for unknown stories', () => {
    expect(weave.getSightWordsInStory('nope')).toEqual([]);
  });
});

describe('quest-word story coverage floors', () => {
  // Pinned from the current corpus (easy 50/50, medium 220/374, hard 1/50).
  // New stories may only raise these — never let coverage silently regress.
  // Hard-tier words are P4-P6 spelling vocabulary and are NOT expected in
  // decodable stories; their floor stays nominal.
  it('story corpus keeps covering the quest words it covers today', () => {
    const storyTokens = new Set();
    for (const story of STORIES) {
      for (const t of extractCountableTokens(story)) storyTokens.add(t);
    }
    const covered = { easy: 0, medium: 0, hard: 0 };
    for (const quest of SIGHT_QUESTS) {
      for (const w of quest.words) {
        if (storyTokens.has(w.toLowerCase())) covered[quest.tier] += 1;
      }
    }
    expect(covered.easy).toBeGreaterThanOrEqual(50);
    expect(covered.medium).toBeGreaterThanOrEqual(220);
    expect(covered.hard).toBeGreaterThanOrEqual(1);
  });
});
