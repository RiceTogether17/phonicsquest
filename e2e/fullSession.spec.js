/**
 * Full tutoring-session end-to-end test.
 *
 * One unbroken flow through the production build, the way a real child and
 * parent would use it on day one:
 *
 *   create profile → answer the ENTIRE placement diagnostic through the UI
 *   → see the placement report → land on home → open Today's Lesson (the
 *   guided tutor entry) → verify the app recorded a placement profile and
 *   selected a starting pathway.
 *
 * This is the sequence a tutor's first sitting covers: intake, assessment,
 * placement decision, and the first assigned activity.
 */
import { test, expect } from '@playwright/test';

test('a new child completes intake, the full placement diagnostic, and starts the first lesson', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('./');

  // ── Profile creation ────────────────────────────────────────────────
  await expect(page.locator('#screen-profiles')).toHaveClass(/active/);
  await page.locator('#btn-add-profile').click();
  await page.locator('#cp-name-input').fill('Testy');
  await page.locator('#cp-confirm-btn').click();
  await expect(page.locator('#screen-placement')).toHaveClass(/active/);

  // ── Complete the whole placement diagnostic through the real UI ─────
  // The screener auto-advances after each tap; teacher-scored items use
  // data-score buttons, child items use data-choice picture/word buttons,
  // and the intake form has its own Next button.
  let sawResult = false;
  for (let step = 0; step < 120; step++) {
    if (await page.locator('#pt-start-btn').count()) { sawResult = true; break; }

    const intakeNext = page.locator('#pt-intake-next');
    if (await intakeNext.count()) {
      await intakeNext.click();
    } else {
      const choice = page.locator('[data-choice], [data-score]').first();
      if (await choice.count()) {
        await choice.click();
      }
    }
    await page.waitForTimeout(400);
  }
  expect(sawResult, 'placement should reach its results screen').toBe(true);

  // The placement report shows a band and per-stage profile.
  await expect(page.locator('.pt-result-band')).toBeVisible();

  // ── "Start learning" hands over to the home screen ─────────────────
  await page.locator('#pt-start-btn').click();
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  // ── The app made a placement decision and persisted it ─────────────
  const placement = await page.evaluate(() => {
    const profiles = JSON.parse(localStorage.getItem('phonicsquest_profiles') || '[]');
    const id = localStorage.getItem('phonicsquest_active_profile');
    const state = JSON.parse(localStorage.getItem(`phonicsquest_profile_${id}`) || '{}');
    return {
      profileCount: profiles.length,
      placementComplete: state.placementComplete,
      readingBand: state.placementProfile?.readingBand,
    };
  });
  expect(placement.profileCount).toBe(1);
  expect(placement.placementComplete).toBe(true);
  expect(placement.readingBand).toBeTruthy();

  // First-run welcome tour pops over home (possibly after a beat) — skip
  // it like a parent would, then make sure the overlay is really gone.
  const tour = page.locator('#modal-onboarding');
  const skipTour = page.locator('#ob-skip-btn');
  await page.waitForTimeout(1200);
  if (await tour.isVisible().catch(() => false)) {
    await skipTour.click();
    await expect(tour).toBeHidden();
  }

  // ── Today's Lesson: the guided tutor entry point exists and works ───
  const heroCta = page.locator('#lesson-hero-cta');
  await expect(heroCta).toBeVisible();
  await heroCta.click();

  // The lesson step navigates somewhere actionable: either another screen
  // becomes active, or a picker/modal opens on home. Either way the child
  // is one tap into their first assigned activity.
  await page.waitForTimeout(1500);
  const state = await page.evaluate(() => ({
    activeScreens: [...document.querySelectorAll('.screen.active')].map(s => s.id),
    modalOpen: [...document.querySelectorAll('.modal')].some(m =>
      getComputedStyle(m).display !== 'none' && !m.hasAttribute('hidden')),
  }));
  const leftHome = state.activeScreens.some(id => id !== 'screen-home');
  expect(leftHome || state.modalOpen, 'lesson CTA should open an activity').toBe(true);
});
