/**
 * Stage pickers — which stages each mode offers.
 *
 * `getStagesForMode` falls back to the WHOLE curriculum for a mode that no
 * phase's `recommendedModes` names. It is a deliberate kindness so a new mode
 * never renders an empty picker, but it is silent, and Word Sort, Read & Tap
 * and Fluency Sprint had all been sitting in it: each opened a picker
 * offering every stage from CVC to multisyllable, with nothing to say so.
 *
 * The unit test pins the phase lists. This pins the thing a unit test cannot
 * see: that the picker a child actually taps through reflects them, and that
 * the modes newly given a picker still reach their game.
 */
import { test, expect } from '@playwright/test';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_picker',
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
    localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
    localStorage.setItem(
      `phonicsquest_profile_${profile.id}`,
      JSON.stringify({
        placementComplete: true,
        placementProfile: { readingBand: 'emerging-decoder' },
        onboardingComplete: true,
        xp: 120,
        level: 2,
        lessonsSeen: Object.fromEntries(
          ['cvc-a', 'cvc-e', 'cvc-i', 'cvc-o', 'cvc-u'].map((id) => [
            `phonics:${id}`,
            new Date().toISOString(),
          ]),
        ),
      }),
    );
  });
}

/** Open a mode's stage picker from the Learn tab and return its phase headers. */
async function openPicker(page, mode) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(900);
  if (await tour.isVisible().catch(() => false)) {
    await page.locator('#ob-skip-btn').click();
    await expect(tour).toBeHidden();
  }

  await page.locator('#home-tab-learn').click();
  const card = page.locator(`[data-mode="${mode}"]`);
  await card.scrollIntoViewIfNeeded();
  await card.click();

  await expect(page.locator('.bp-stage').first()).toBeVisible();
  return (await page.locator('.bp-phase-header').allTextContents()).join(' | ');
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('Word Sort offers the sound-pattern phases and stops before morphology', async ({ page }) => {
  // Word Sort contrasts two sound patterns, and its second bin is a sibling
  // stage. Phases 9 and 10 study the morpheme, so a sort there has no
  // principled second bin — they must not be on offer.
  const headers = await openPicker(page, 'wordSort');

  expect(headers).toMatch(/Phase 1\b/);
  expect(headers).toMatch(/Phase 8\b/);
  expect(headers).not.toMatch(/Phase 9\b/);
  expect(headers).not.toMatch(/Phase 10\b/);
});

test('Read & Tap offers every phase, morphology included', async ({ page }) => {
  // Connected text is worth practising on multisyllable words too.
  const headers = await openPicker(page, 'readAndTap');

  expect(headers).toMatch(/Phase 1\b/);
  expect(headers).toMatch(/Phase 10\b/);
});

test('Fluency Sprint now picks a stage, then plays it', async ({ page }) => {
  // It used to skip the picker entirely and start on whatever group was last
  // touched — no stage progression and no mastery bar, unlike every other
  // print mode.
  const headers = await openPicker(page, 'fluencySprint');
  expect(headers).toMatch(/Phase 1\b/);

  await page.locator('.bp-stage:not(.bp-stage--locked)').first().click();
  await expect(page.locator('#screen-game')).toHaveClass(/active/);
  await expect(page.locator('#fs-start-btn')).toBeVisible();
});

test('Listen & Spell picks a stage from the card, as it does from the daily plan', async ({
  page,
}) => {
  // The daily plan routes it through a picker when it has no group, so the
  // mode card doing something different would be the odd one out.
  const headers = await openPicker(page, 'listenAndSpell');
  expect(headers).toMatch(/Phase 1\b/);

  await page.locator('.bp-stage:not(.bp-stage--locked)').first().click();
  await expect(page.locator('#screen-game')).toHaveClass(/active/);
  await expect(page.locator('#las-replay')).toBeVisible();
});
