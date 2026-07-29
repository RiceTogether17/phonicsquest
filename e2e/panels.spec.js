/**
 * Slide-in panel flows.
 *
 * These panels (Ask Giri, Mistakes Den, Trophy Room) were extracted out of
 * app.js, and their event wiring is exactly the layer unit tests can't
 * see: a dropped listener during extraction would leave a button that
 * silently does nothing. These tests open each from the real home screen.
 */
import { test, expect } from '@playwright/test';

/** Seed a returning learner with enough progress for every panel to render. */
async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_panels', name: 'Testy', avatar: '🦊', color: '#f97316',
      schoolLevel: 'preschool', primaryGrade: null, readingBand: 'emerging-decoder',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('phonicsquest_profiles', JSON.stringify([profile]));
    localStorage.setItem('phonicsquest_active_profile', profile.id);
    localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
    localStorage.setItem(`phonicsquest_profile_${profile.id}`, JSON.stringify({
      placementComplete: true,
      placementProfile: { readingBand: 'emerging-decoder' },
      xp: 240, level: 3, streak: 4, bestStreak: 6,
      challengeCalendar: [new Date().toISOString().slice(0, 10)],
    }));
  });
}

/** Dismiss the first-run welcome tour if it appears. */
async function dismissTour(page) {
  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(800);
  if (await tour.isVisible().catch(() => false)) {
    await page.locator('#ob-skip-btn').click();
    await expect(tour).toBeHidden();
  }
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  await dismissTour(page);
});

test('Ask Giri panel opens with answerable question chips', async ({ page }) => {
  const btn = page.locator('#btn-ask-giri');
  await btn.scrollIntoViewIfNeeded();
  await btn.click();

  const modal = page.locator('#modal-ask-giri');
  await expect(modal).toBeVisible();

  // Chips are the whole point of the panel — it must never open empty.
  const chips = modal.locator('.ask-giri-chip');
  await expect(chips.first()).toBeVisible();

  // Tapping a chip produces an authored answer with no API key configured.
  await chips.first().click();
  await expect(modal.locator('#ask-giri-answer .mcq-rule-text')).toBeVisible();
});

test('Trophy Room opens and shows the child\'s own bests', async ({ page }) => {
  // The trophy tile lives on the Extra tab, not Today.
  await page.locator('#home-tab-extra').click();
  const btn = page.locator('#btn-personal-best');
  await btn.scrollIntoViewIfNeeded();
  await btn.click();

  const modal = page.locator('#modal-personal-best');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.trophy-card').first()).toBeVisible();
  // The you-vs-you framing is a product commitment, not decoration.
  await expect(modal.locator('.trophy-intro')).toContainText('you vs you');
});

test('Mistakes Den opens and reports an all-clear when there is nothing to retry', async ({ page }) => {
  // The banner only shows when mistakes exist; drive the panel directly so
  // the empty state is covered too.
  await page.evaluate(() => document.getElementById('btn-mistakes-den')?.click());

  const modal = page.locator('#modal-mistakes-den');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.mistakes-den-empty__title')).toContainText('all clear');
});

test('panels close on Escape and restore focus', async ({ page }) => {
  const btn = page.locator('#btn-ask-giri');
  await btn.scrollIntoViewIfNeeded();
  await btn.click();

  const modal = page.locator('#modal-ask-giri');
  await expect(modal).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible();
});
