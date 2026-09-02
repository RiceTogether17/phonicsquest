/**
 * PhonicsQuest end-to-end smoke flows.
 *
 * These cover the tutor-critical paths that unit tests can't reach — the
 * real DOM wiring in app.js against the production build:
 *
 *   1. First launch → profile creation → placement diagnostic starts
 *   2. Returning learner lands on the home screen with a plan
 *   3. A learning activity opens from the home screen
 *   4. Settings modal opens and closes with the keyboard
 *   5. Home screen has no critical/serious accessibility violations (axe)
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** Seed a returning preschool learner who has completed placement. */
async function seedReturningLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_e2e',
      name: 'Testy',
      avatar: '🦊',
      color: '#f97316',
      schoolLevel: 'preschool',
      primaryGrade: null,
      readingBand: 'emerging-decoder',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('phonicsquest_profiles', JSON.stringify([profile]));
    localStorage.setItem('phonicsquest_active_profile', profile.id);
    localStorage.setItem(
      `phonicsquest_profile_${profile.id}`,
      JSON.stringify({
        placementComplete: true,
        placementProfile: { readingBand: 'emerging-decoder' },
      }),
    );
  });
}

test('first launch walks a new child into the placement diagnostic', async ({ page }) => {
  await page.goto('./');

  // Fresh device → profile chooser first.
  await expect(page.locator('#screen-profiles')).toHaveClass(/active/);
  await page.locator('#btn-add-profile').click();

  // Create-profile modal: type a name, keep the preschool default, confirm.
  const nameInput = page.locator('#cp-name-input');
  await expect(nameInput).toBeVisible();
  await nameInput.fill('Testy');
  await page.locator('#cp-confirm-btn').click();

  // A preschool profile goes straight into the placement diagnostic —
  // the app decides where to start, like a tutor's intake assessment.
  await expect(page.locator('#screen-placement')).toHaveClass(/active/);
  await expect(page.locator('#screen-placement')).not.toBeEmpty();
});

test('a returning learner lands on the home screen', async ({ page }) => {
  await seedReturningLearner(page);
  await page.goto('./');

  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  await expect(page.locator('#screen-profiles')).not.toHaveClass(/active/);
});

test('a learning activity opens from the home screen', async ({ page }) => {
  await seedReturningLearner(page);
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  await page.locator('#home-tab-learn').click();
  const letterSounds = page.locator('#btn-letter-sounds');
  await letterSounds.scrollIntoViewIfNeeded();
  await letterSounds.click();

  await expect(page.locator('#screen-letter-sounds')).toHaveClass(/active/);
  await expect(page.locator('#screen-letter-sounds')).not.toBeEmpty();
});

test('settings modal opens and closes with the keyboard', async ({ page }) => {
  await seedReturningLearner(page);
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  await page.locator('#home-tab-grownups').click();
  const settingsBtn = page.locator('#btn-home-settings');
  await settingsBtn.scrollIntoViewIfNeeded();
  await settingsBtn.click();

  const modal = page.locator('#modal-settings');
  await expect(modal).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible();
});

test('home screen has no critical or serious a11y violations', async ({ page }) => {
  await seedReturningLearner(page);
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  const blocking = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`)).toEqual([]);
});
