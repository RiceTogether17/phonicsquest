/**
 * Story-band soft gating + writing badge detection.
 *
 * storyGating decides which story shelf the library recommends from the
 * child's phonics mastery — deliberately soft, so an unready band stays
 * tappable but is labelled. writingBadges turns evaluator metrics into the
 * praise a child sees after writing, so each rule's threshold is pinned.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

/** Set groupMastery for every curriculum stage in the given phases. */
async function masterPhases(phases, value = 1) {
  const { store } = await import('../modules/store.js');
  const { CURRICULUM } = await import('../data/curriculum.js');
  const gm = store.get('groupMastery') || {};
  for (const stage of CURRICULUM) {
    if (phases.includes(stage.phase)) gm[stage.group] = value;
  }
  store.set('groupMastery', gm);
}

beforeEach(() => {
  stubAudioGlobals();
  localStorage.clear();
  vi.resetModules();
});

describe('story band readiness', () => {
  it('always keeps Band A open for a brand-new learner', async () => {
    const { getBandReadiness } = await import('../modules/storyGating.js');
    const r = getBandReadiness();
    expect(r.A.ready).toBe(true);
    expect(r.A.hint).toBe('');
  });

  it('gates B, C and D for a learner with no mastery, with guidance hints', async () => {
    const { getBandReadiness } = await import('../modules/storyGating.js');
    const r = getBandReadiness();
    expect(r.B.ready).toBe(false);
    expect(r.C.ready).toBe(false);
    expect(r.D.ready).toBe(false);
    // Soft gating means a hint explaining when the band suits them.
    expect(r.B.hint).toMatch(/Phase 6/i);
    expect(r.D.hint).toMatch(/Phase 7/i);
  });

  it('opens Band B once early phases are mostly mastered', async () => {
    await masterPhases([1, 2, 3, 4, 5]);
    const { getBandReadiness } = await import('../modules/storyGating.js');
    const r = getBandReadiness();
    expect(r.B.ready).toBe(true);
    expect(r.B.hint).toBe('');
  });

  it('opens Band B as soon as long vowels are merely started', async () => {
    // Touched but nowhere near mastered — soft gating rewards starting.
    await masterPhases([6], 0.1);
    const { getBandReadiness } = await import('../modules/storyGating.js');
    expect(getBandReadiness().B.ready).toBe(true);
  });

  it('requires B before C, and C before D', async () => {
    // Diphthongs started but no earlier progress: D must stay closed
    // because readiness is cumulative.
    await masterPhases([7], 0.5);
    const { getBandReadiness } = await import('../modules/storyGating.js');
    const r = getBandReadiness();
    expect(r.B.ready).toBe(false);
    expect(r.C.ready).toBe(false);
    expect(r.D.ready).toBe(false);
  });

  it('opens D only when B, C and diphthongs are all in play', async () => {
    await masterPhases([1, 2, 3, 4, 5]);
    await masterPhases([6]);
    await masterPhases([7], 0.4);
    const { getBandReadiness } = await import('../modules/storyGating.js');
    const r = getBandReadiness();
    expect(r.C.ready).toBe(true);
    expect(r.D.ready).toBe(true);
  });
});

describe('recommended band', () => {
  const shelves = {
    A: [{ id: 'a1' }, { id: 'a2' }],
    B: [{ id: 'b1' }],
    C: [{ id: 'c1' }],
    D: [{ id: 'd1' }],
  };

  it('recommends A while it still has unread stories', async () => {
    const { getRecommendedBand } = await import('../modules/storyGating.js');
    expect(getRecommendedBand([], shelves)).toBe('A');
  });

  it('moves to the next ready band once the current one is finished', async () => {
    await masterPhases([1, 2, 3, 4, 5]);
    const { getRecommendedBand } = await import('../modules/storyGating.js');
    expect(getRecommendedBand(['a1', 'a2'], shelves)).toBe('B');
  });

  it('stops at the last ready band rather than recommending a locked one', async () => {
    // A finished, but B is not ready → fall back rather than advance.
    const { getRecommendedBand } = await import('../modules/storyGating.js');
    expect(getRecommendedBand(['a1', 'a2'], shelves)).toBe('A');
  });

  it('tolerates missing arguments', async () => {
    const { getRecommendedBand } = await import('../modules/storyGating.js');
    expect(['A', 'B', 'C', 'D']).toContain(getRecommendedBand(undefined, undefined));
  });
});

describe('writing badge detection', () => {
  /** Metrics shaped like computeMetrics() output, with nothing earned. */
  const baseMetrics = {
    firstSentence: '', hasEndPunct: false, sentenceCount: 0, totalDistinct: 0,
    hasDialogue: false, dialoguePunctOk: false, sensoryHits: 0, emotionTellingCount: 0,
    hasFormalOpening: false, hasFormalClosing: false, requiredHits: 0, requiredTotal: 0,
  };

  it('awards nothing for empty writing', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    expect(detectBadges(baseMetrics, '')).toEqual([]);
  });

  it('awards Strong Opener for a substantial, non-clichéd first sentence', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    const m = { ...baseMetrics, firstSentence: 'Thunder cracked as the old gate swung open.' };
    expect(detectBadges(m, '')).toContain('strong-opener');
  });

  it('withholds Strong Opener for the common weak openers', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    for (const opener of [
      'I went to the shops and then I came home again.',
      'My name is Sam and I like to play football.',
      'Today I will tell you about my school holiday.',
    ]) {
      const m = { ...baseMetrics, firstSentence: opener };
      expect(detectBadges(m, '')).not.toContain('strong-opener');
    }
  });

  it('withholds Strong Opener for a very short opener', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    expect(detectBadges({ ...baseMetrics, firstSentence: 'It rained.' }, ''))
      .not.toContain('strong-opener');
  });

  it('awards Clear Ending only with terminal punctuation and enough sentences', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    expect(detectBadges({ ...baseMetrics, hasEndPunct: true, sentenceCount: 4 }, ''))
      .toContain('clear-ending');
    expect(detectBadges({ ...baseMetrics, hasEndPunct: true, sentenceCount: 3 }, ''))
      .not.toContain('clear-ending');
  });

  it('awards Connector Builder at three distinct connectors', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    expect(detectBadges({ ...baseMetrics, totalDistinct: 3 }, '')).toContain('connector-builder');
    expect(detectBadges({ ...baseMetrics, totalDistinct: 2 }, '')).not.toContain('connector-builder');
  });

  it('requires correct punctuation for Dialogue Hero', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    expect(detectBadges({ ...baseMetrics, hasDialogue: true, dialoguePunctOk: true }, ''))
      .toContain('dialogue-hero');
    // Dialogue attempted but mispunctuated earns nothing — that's the lesson.
    expect(detectBadges({ ...baseMetrics, hasDialogue: true, dialoguePunctOk: false }, ''))
      .not.toContain('dialogue-hero');
  });

  it('awards Show-Don\'t-Tell for sensory language with little emotion-naming', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    expect(detectBadges({ ...baseMetrics, sensoryHits: 2, emotionTellingCount: 1 }, ''))
      .toContain('show-dont-tell');
    expect(detectBadges({ ...baseMetrics, sensoryHits: 2, emotionTellingCount: 2 }, ''))
      .not.toContain('show-dont-tell');
  });

  it('requires both a formal opening and closing for Formal Tone', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    expect(detectBadges({ ...baseMetrics, hasFormalOpening: true, hasFormalClosing: true }, ''))
      .toContain('formal-tone');
    expect(detectBadges({ ...baseMetrics, hasFormalOpening: true }, ''))
      .not.toContain('formal-tone');
  });

  it('awards Task Champion only when every required point is covered', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    expect(detectBadges({ ...baseMetrics, requiredHits: 3, requiredTotal: 3 }, ''))
      .toContain('task-champion');
    expect(detectBadges({ ...baseMetrics, requiredHits: 2, requiredTotal: 3 }, ''))
      .not.toContain('task-champion');
    // No requirements defined → not a free badge.
    expect(detectBadges({ ...baseMetrics, requiredHits: 0, requiredTotal: 0 }, ''))
      .not.toContain('task-champion');
  });

  it('awards Revision Star for a meaningful improvement only', async () => {
    const { detectBadges } = await import('../modules/writingBadges.js');
    expect(detectBadges(baseMetrics, '', { revisionBonus: 5 })).toContain('revision-star');
    expect(detectBadges(baseMetrics, '', { revisionBonus: 4 })).not.toContain('revision-star');
    expect(detectBadges(baseMetrics, '', null)).not.toContain('revision-star');
  });
});

describe('badge chip rendering', () => {
  it('encourages rather than shaming when nothing was earned', async () => {
    const { renderBadgeChips } = await import('../modules/writingBadges.js');
    const out = renderBadgeChips([]);
    expect(out).toMatch(/keep practising/i);
    expect(renderBadgeChips(undefined)).toBe(out);
  });

  it('renders a chip per known badge and skips unknown keys', async () => {
    const { renderBadgeChips, BADGE_DEFS } = await import('../modules/writingBadges.js');
    const out = renderBadgeChips(['strong-opener', 'not-a-badge', 'clear-ending']);
    expect(out).toContain(BADGE_DEFS['strong-opener'].label);
    expect(out).toContain(BADGE_DEFS['clear-ending'].label);
    expect(out).not.toContain('not-a-badge');
  });

  it('every badge definition carries the fields the UI renders', async () => {
    const { BADGE_DEFS } = await import('../modules/writingBadges.js');
    for (const [key, def] of Object.entries(BADGE_DEFS)) {
      expect(def.label, key).toBeTruthy();
      expect(def.emoji, key).toBeTruthy();
      expect(def.description, key).toBeTruthy();
    }
  });
});
