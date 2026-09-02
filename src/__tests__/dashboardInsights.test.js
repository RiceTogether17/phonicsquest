/**
 * Parent-dashboard insight derivation.
 *
 * These functions turn raw progress state into the sentences a parent
 * reads. The critical property is honesty under sparse data: a brand-new
 * learner must produce "not enough data yet" rather than a confident but
 * fabricated strength/weakness. Each function must also survive empty or
 * malformed state without throwing, since the dashboard renders eagerly.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
}

function setProfile({ schoolLevel = 'preschool', name = 'Testy' } = {}) {
  const id = 'p_di_test';
  localStorage.setItem(
    'phonicsquest_profiles',
    JSON.stringify([
      {
        id,
        name,
        avatar: '🦊',
        color: '#6c63ff',
        schoolLevel,
        primaryGrade: null,
        readingBand: null,
      },
    ]),
  );
  localStorage.setItem('phonicsquest_active_profile', id);
  localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
  return id;
}

beforeEach(() => {
  stubAudioGlobals();
  localStorage.clear();
  vi.resetModules();
});

describe('learner summary', () => {
  it('admits when there is not enough data instead of inventing a strength', async () => {
    setProfile();
    const { getLearnerSummary } = await import('../modules/dashboardInsights.js');
    const s = getLearnerSummary();
    expect(s.strongest).toMatch(/not enough data/i);
    expect(s.weakest).toMatch(/not enough data/i);
  });

  it('reports the active profile identity', async () => {
    setProfile({ name: 'Ada' });
    const { getLearnerSummary } = await import('../modules/dashboardInsights.js');
    const s = getLearnerSummary();
    expect(s.profileName).toBe('Ada');
    expect(s.learnerType).toBe('Preschool');
  });

  it('labels a primary profile as Primary', async () => {
    setProfile({ schoolLevel: 'primary' });
    const { getLearnerSummary } = await import('../modules/dashboardInsights.js');
    expect(getLearnerSummary().learnerType).toBe('Primary');
  });

  it('falls back to safe defaults with no profile at all', async () => {
    const { getLearnerSummary } = await import('../modules/dashboardInsights.js');
    const s = getLearnerSummary();
    expect(s.profileName).toBe('Learner');
    expect(s.profileAvatar).toBeTruthy();
    expect(s.currentFocus).toBeTruthy();
  });

  it('names a weak short-vowel group as the focus once data exists', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    // Deliberately weak on one vowel, strong elsewhere.
    store.set('groupMastery', { 'cvc-a': 0.2, 'cvc-e': 0.9, 'cvc-i': 0.9 });

    const { getLearnerSummary } = await import('../modules/dashboardInsights.js');
    const s = getLearnerSummary();
    expect(s.currentFocus).toMatch(/short vowel/i);
    expect(s.strongest).not.toMatch(/not enough data/i);
  });
});

describe('literacy domains', () => {
  it('returns a domain list that is renderable with no data', async () => {
    setProfile();
    const { getLiteracyDomains } = await import('../modules/dashboardInsights.js');
    const domains = getLiteracyDomains();
    expect(Array.isArray(domains)).toBe(true);
    // A null score means "no data" and must be preserved, not coerced to 0 —
    // showing a parent 0% for something never attempted would be misleading.
    expect(domains.length).toBeGreaterThan(0);
    for (const d of domains) {
      expect(d.id, JSON.stringify(d)).toBeTruthy();
      expect(d.label, d.id).toBeTruthy();
      expect(d.icon, d.id).toBeTruthy();
      expect(d.score === null || typeof d.score === 'number').toBe(true);
    }
  });

  it('scores a domain once there is data for it', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    store.set('groupMastery', { 'cvc-a': 0.8, 'cvc-e': 0.6 });

    const { getLiteracyDomains } = await import('../modules/dashboardInsights.js');
    const phonics = getLiteracyDomains().find((d) => d.id === 'phonics');
    expect(typeof phonics.score).toBe('number');
    expect(phonics.score).toBeGreaterThan(0);
  });
});

describe('clue insights, MOE mappings and recommendations', () => {
  it('produce usable shapes on empty state', async () => {
    setProfile();
    const insights = await import('../modules/dashboardInsights.js');

    const clue = insights.getClueInsights();
    expect(clue).toHaveProperty('questInsights');
    expect(clue).toHaveProperty('byType');

    const moe = insights.getMoeOutcomeMappings();
    expect(Array.isArray(moe)).toBe(true);
    expect(moe.length).toBeGreaterThan(0);

    expect(Array.isArray(insights.getRecommendedActions())).toBe(true);
  });
});

describe('recent pattern insights', () => {
  it('returns a bounded list for a learner with no history', async () => {
    setProfile();
    const { getRecentPatternInsights } = await import('../modules/dashboardInsights.js');
    const out = getRecentPatternInsights();
    expect(Array.isArray(out)).toBe(true);
    expect(out.length).toBeLessThanOrEqual(4);
  });

  it('reports an accuracy dip when this week is clearly worse than last', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    const DAY = 86_400_000;
    const now = Date.now();
    const entry = (daysAgo, correct) => ({
      word: 'cat',
      correct,
      timestamp: new Date(now - daysAgo * DAY).toISOString(),
    });
    store.set('wordHistory', [
      // Last week: strong (8/8). Needs >= 5 entries in each window.
      ...Array.from({ length: 8 }, () => entry(9, true)),
      // This week: weak (1/8).
      ...Array.from({ length: 7 }, () => entry(2, false)),
      entry(2, true),
    ]);

    const { getRecentPatternInsights } = await import('../modules/dashboardInsights.js');
    expect(getRecentPatternInsights().join(' ')).toMatch(/dipped/i);
  });

  it('reports improvement when this week is clearly better than last', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    const DAY = 86_400_000;
    const now = Date.now();
    const entry = (daysAgo, correct) => ({
      word: 'cat',
      correct,
      timestamp: new Date(now - daysAgo * DAY).toISOString(),
    });
    store.set('wordHistory', [
      ...Array.from({ length: 8 }, () => entry(9, false)),
      ...Array.from({ length: 8 }, () => entry(2, true)),
    ]);

    const { getRecentPatternInsights } = await import('../modules/dashboardInsights.js');
    expect(getRecentPatternInsights().join(' ')).toMatch(/improved/i);
  });

  it('never returns more than the dashboard can show', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    const now = Date.now();
    const DAY = 86_400_000;
    // Spread history across this week and last week so comparisons engage.
    const history = [];
    for (let i = 0; i < 40; i++) {
      history.push({
        word: `w${i}`,
        correct: i % 3 !== 0,
        timestamp: new Date(now - (i % 13) * DAY).toISOString(),
      });
    }
    store.set('wordHistory', history);

    const { getRecentPatternInsights } = await import('../modules/dashboardInsights.js');
    expect(getRecentPatternInsights().length).toBeLessThanOrEqual(4);
  });

  it('ignores history entries with no timestamp rather than throwing', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    store.set('wordHistory', [
      { word: 'x', correct: true },
      { word: 'y', correct: false },
    ]);

    const { getRecentPatternInsights } = await import('../modules/dashboardInsights.js');
    expect(() => getRecentPatternInsights()).not.toThrow();
  });
});

describe('parent coaching card', () => {
  it('always gives the parent something actionable', async () => {
    setProfile();
    const { getParentCoachingCard } = await import('../modules/dashboardInsights.js');
    const card = getParentCoachingCard();
    expect(card).toBeTruthy();
    expect(typeof card).toBe('object');
  });
});

describe('stuck words', () => {
  it('is empty for a learner with no attempts', async () => {
    setProfile();
    const { getStuckWords } = await import('../modules/dashboardInsights.js');
    expect(getStuckWords()).toEqual([]);
  });

  it('surfaces repeatedly-missed words, capped for readability', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    const { WORDS } = await import('../data/words.js');
    // Stats are keyed by real curriculum word ids, so seed actual words.
    const stats = {};
    for (const w of WORDS.slice(0, 10)) {
      stats[w.id] = { attempts: 10, correct: 2 }; // 20% — well under the 40% bar
    }
    store.set('wordStats', stats);

    const { getStuckWords } = await import('../modules/dashboardInsights.js');
    const stuck = getStuckWords();
    expect(stuck.length).toBeGreaterThan(0);
    expect(stuck.length).toBeLessThanOrEqual(6);
    // Sorted worst-first so the parent sees the biggest problem at the top.
    expect(stuck[0].accuracy).toBeLessThanOrEqual(stuck[stuck.length - 1].accuracy);
  });

  it('does not flag words the child answers well', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    const { WORDS } = await import('../data/words.js');
    const easy = WORDS[0];
    store.set('wordStats', { [easy.id]: { attempts: 10, correct: 10 } });

    const { getStuckWords } = await import('../modules/dashboardInsights.js');
    expect(getStuckWords().some((w) => w.word === easy.word)).toBe(false);
  });

  it('ignores words with too few attempts to judge', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    const { WORDS } = await import('../data/words.js');
    const w = WORDS[0];
    // 0% accuracy but only 5 attempts — below the 6-attempt confidence bar.
    store.set('wordStats', { [w.id]: { attempts: 5, correct: 0 } });

    const { getStuckWords } = await import('../modules/dashboardInsights.js');
    expect(getStuckWords()).toEqual([]);
  });
});
