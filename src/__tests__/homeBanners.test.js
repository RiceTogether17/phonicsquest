/**
 * Home-screen banners & badges.
 *
 * Extracted from app.js, where they were untestable DOM wiring. The rule
 * these all share: a banner offering an activity must hide itself when
 * there is nothing waiting, so the home screen doesn't advertise empty
 * work to a child who is fully caught up.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

/** The subset of home markup the banners touch. */
function mountHomeDom() {
  document.body.innerHTML = `
    <div id="review-banner"><span id="review-banner-sub"></span></div>
    <div id="word-workout-banner"><span id="word-workout-sub"></span></div>
    <div id="mistakes-den-banner"><span id="mistakes-den-sub"></span></div>
    <div id="personal-best-banner"><span id="personal-best-sub"></span></div>
    <button id="btn-daily-challenge">
      <span id="daily-banner-title"></span>
      <span id="daily-banner-sub"></span>
      <span id="daily-banner-arrow"></span>
    </button>
    <button id="home-tab-today" aria-label="Today — your lesson and reviews">
      <span id="home-tab-today-badge" hidden></span>
    </button>
    <button id="btn-sentence-forge">
      <span class="stories-banner-sub"></span><span class="stories-banner-arrow"></span>
    </button>`;
}

beforeEach(() => {
  stubAudioGlobals();
  localStorage.clear();
  vi.resetModules();
  mountHomeDom();
});

describe('review banner', () => {
  it('hides itself when nothing is due', async () => {
    const banners = await import('../modules/homeBanners.js');
    banners.updateReviewBanner();
    expect(document.getElementById('review-banner').style.display).toBe('none');
  });

  it('shows a count and time estimate when words are due', async () => {
    const { progress } = await import('../modules/progress.js');
    vi.spyOn(progress, 'getReviewDueCount').mockReturnValue(4);

    const banners = await import('../modules/homeBanners.js');
    banners.updateReviewBanner();

    const banner = document.getElementById('review-banner');
    expect(banner.style.display).not.toBe('none');
    const sub = document.getElementById('review-banner-sub').textContent;
    expect(sub).toContain('4 words due today');
    expect(sub).toMatch(/about \d+ min/);
  });

  it('uses the singular for exactly one due word', async () => {
    const { progress } = await import('../modules/progress.js');
    vi.spyOn(progress, 'getReviewDueCount').mockReturnValue(1);

    const banners = await import('../modules/homeBanners.js');
    banners.updateReviewBanner();
    expect(document.getElementById('review-banner-sub').textContent).toContain('1 word due');
  });
});

describe('word workout banner', () => {
  it('only offers a workout when something is due', async () => {
    const { progress } = await import('../modules/progress.js');
    const spy = vi.spyOn(progress, 'getReviewDueCount').mockReturnValue(0);
    const banners = await import('../modules/homeBanners.js');

    banners.updateWordWorkoutBanner();
    expect(document.getElementById('word-workout-banner').style.display).toBe('none');

    spy.mockReturnValue(2);
    banners.updateWordWorkoutBanner();
    expect(document.getElementById('word-workout-banner').style.display).not.toBe('none');
  });
});

describe('daily challenge banner', () => {
  it('advertises the XP on offer when not yet done', async () => {
    const banners = await import('../modules/homeBanners.js');
    banners.updateDailyBanner();

    expect(document.getElementById('daily-banner-title').textContent).toContain('Daily Challenge');
    expect(document.getElementById('daily-banner-sub').textContent).toMatch(/bonus XP/);
    expect(document.getElementById('daily-banner-arrow').textContent).toBe('→');
    expect(document.getElementById('btn-daily-challenge').classList.contains('stories-banner--done')).toBe(false);
  });

  it('switches to a completed state once done', async () => {
    const daily = await import('../modules/dailyChallenge.js');
    vi.spyOn(daily, 'isDailyChallengeComplete').mockReturnValue(true);

    const banners = await import('../modules/homeBanners.js');
    banners.updateDailyBanner();

    expect(document.getElementById('daily-banner-sub').textContent).toMatch(/well done/i);
    expect(document.getElementById('daily-banner-arrow').textContent).toBe('✓');
    expect(document.getElementById('btn-daily-challenge').classList.contains('stories-banner--done')).toBe(true);
  });
});

describe('personal best banner', () => {
  it('stays hidden for a learner with nothing to show yet', async () => {
    const banners = await import('../modules/homeBanners.js');
    banners.updatePersonalBestBanner();
    expect(document.getElementById('personal-best-banner').style.display).toBe('none');
  });

  it('appears once the child has earned XP', async () => {
    const { store } = await import('../modules/store.js');
    store.set('xp', 50);

    const banners = await import('../modules/homeBanners.js');
    banners.updatePersonalBestBanner();
    expect(document.getElementById('personal-best-banner').style.display).not.toBe('none');
    expect(document.getElementById('personal-best-sub').textContent).toBeTruthy();
  });

  it('mentions the best streak when there is one', async () => {
    const { store } = await import('../modules/store.js');
    store.set('xp', 50);
    store.set('bestStreak', 4);

    const banners = await import('../modules/homeBanners.js');
    banners.updatePersonalBestBanner();
    expect(document.getElementById('personal-best-sub').textContent).toContain('4 days');
  });
});

describe('quest banners', () => {
  it('describes a locked quest with what is still needed', async () => {
    const banners = await import('../modules/homeBanners.js');
    banners.updateQuestBanners({
      sentenceForge: { unlocked: false, required: 20, current: 7 },
    });

    const el = document.getElementById('btn-sentence-forge');
    expect(el.classList.contains('stories-banner--locked')).toBe(true);
    expect(el.querySelector('.stories-banner-sub').textContent).toContain('7/20');
    expect(el.querySelector('.stories-banner-arrow').textContent).toBe('🔒');
  });

  it('shows the real description once unlocked', async () => {
    const banners = await import('../modules/homeBanners.js');
    banners.updateQuestBanners({
      sentenceForge: { unlocked: true, required: 20, current: 20 },
    });

    const el = document.getElementById('btn-sentence-forge');
    expect(el.classList.contains('stories-banner--locked')).toBe(false);
    expect(el.querySelector('.stories-banner-sub').textContent).toContain('unscramble');
    expect(el.querySelector('.stories-banner-arrow').textContent).toBe('→');
  });

  it('is a no-op without an unlock status rather than throwing', async () => {
    const banners = await import('../modules/homeBanners.js');
    expect(() => banners.updateQuestBanners(undefined)).not.toThrow();
  });
});

describe('today tab badge', () => {
  it('is hidden when nothing is waiting', async () => {
    const banners = await import('../modules/homeBanners.js');
    banners.updateTodayTabBadge();
    expect(document.getElementById('home-tab-today-badge').hidden).toBe(true);
  });

  it('counts reviews and announces them to assistive tech', async () => {
    const { progress } = await import('../modules/progress.js');
    vi.spyOn(progress, 'getReviewDueCount').mockReturnValue(3);

    const banners = await import('../modules/homeBanners.js');
    banners.updateTodayTabBadge();

    const badge = document.getElementById('home-tab-today-badge');
    expect(badge.hidden).toBe(false);
    expect(badge.textContent).toBe('3');
    expect(document.getElementById('home-tab-today').getAttribute('aria-label')).toContain('3 items waiting');
  });

  it('caps the badge at 9+ so it stays readable', async () => {
    const { progress } = await import('../modules/progress.js');
    vi.spyOn(progress, 'getReviewDueCount').mockReturnValue(42);

    const banners = await import('../modules/homeBanners.js');
    banners.updateTodayTabBadge();
    expect(document.getElementById('home-tab-today-badge').textContent).toBe('9+');
  });
});

describe('missing DOM', () => {
  it('every updater is a no-op when the home screen is not mounted', async () => {
    document.body.innerHTML = '';
    const banners = await import('../modules/homeBanners.js');
    expect(() => {
      banners.updateReviewBanner();
      banners.updateDailyBanner();
      banners.updateWordWorkoutBanner();
      banners.updateMistakesDenBanner();
      banners.updatePersonalBestBanner();
      banners.updateTodayTabBadge();
      banners.updateQuestBanners({ sentenceForge: { unlocked: true } });
    }).not.toThrow();
  });
});
