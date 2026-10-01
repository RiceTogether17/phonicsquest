/**
 * One reader, one warm-up.
 *
 * There used to be two readers — "Listen & Follow" and "Sound It Out" —
 * and three pre-teach surfaces. A child opening a story in Sound It Out met
 * the same words up to three times before reading a line, and lost the
 * Listen button, Talk About It, Story Quest and the ending by choosing it.
 *
 * Worse than the repetition, the gate was built from every high-frequency
 * word in the story, and 93% of its chips across the bank were words the
 * child can sound out — "sat", "ran", "at", "can" offered up to be learned
 * by sight in a story that exists to teach short-a. It is built from the
 * words a story genuinely cannot be sounded out from now.
 */
import { test, expect } from '@playwright/test';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_one',
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
      }),
    );
  });
}

/** Open Giri's Nap (core-a-04): a short-a story whose gate used to show 18 chips. */
async function openNap(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(900);
  if (await tour.isVisible().catch(() => false)) {
    await page.locator('#ob-skip-btn').click();
    await expect(tour).toBeHidden();
  }

  await page.locator('#home-tab-learn').click();
  const banner = page.locator('#btn-stories');
  await banner.scrollIntoViewIfNeeded();
  await banner.click();
  await expect(page.locator('.story-card').first()).toBeVisible();
  await page.locator('.story-tab[data-band="A"]').click();
  await page.locator('.story-card').nth(3).click();
  await expect(page.locator('.story-reader-title')).toHaveText("Giri's Nap");
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('there is no mode to choose', async ({ page }) => {
  await openNap(page);
  await expect(page.locator('.story-mode-toggle')).toHaveCount(0);
  await expect(page.locator('#btn-mode-decode')).toHaveCount(0);
});

test('one warm-up, and nothing else teaching the same words', async ({ page }) => {
  await openNap(page);
  await expect(page.locator('.warm-up')).toBeVisible();
  // The old panel above the fold and the old gate are both gone.
  await expect(page.locator('.story-prep:not(.story-prep-strip)')).toHaveCount(0);
  await expect(page.locator('.meet-words-gate')).toHaveCount(0);
});

test('the warm-up offers only the words a child cannot sound out', async ({ page }) => {
  await openNap(page);
  const chips = (await page.locator('.warm-up [data-prep-word]').allTextContents()).map((t) =>
    t.trim(),
  );
  // These are the story's own words that are not decodable at short-a.
  expect(chips).toEqual(expect.arrayContaining(['the', 'said', 'I']));
  // And none of the short-a words the old gate asked a child to memorise.
  for (const decodable of ['sat', 'ran', 'at', 'can', 'an', 'nap', 'mat', 'cat']) {
    expect(chips, `"${decodable}" can be sounded out`).not.toContain(decodable);
  }
});

test('the warm-up words stay reachable while reading', async ({ page }) => {
  await openNap(page);
  await page.locator('#warm-up-skip').click();
  await expect(page.locator('#story-body')).toBeVisible();

  // They used to vanish once the warm-up was passed, so a child who met
  // "said" before the story and hit it in line three had nowhere to go.
  const strip = page.locator('.story-prep-strip');
  await expect(strip).toBeVisible();
  await strip.locator('summary').click();
  const said = strip.locator('[data-prep-word="said"]');
  await expect(said).toBeVisible();
  await said.click();
  await expect(said).toHaveClass(/story-prep-word--said/);
});

test('three taps unlock the story, and "I know these" skips it', async ({ page }) => {
  await openNap(page);
  const go = page.locator('#warm-up-go');
  await expect(go).toBeDisabled();
  const chips = page.locator('.warm-up [data-tap-id]');
  for (let i = 0; i < 3; i++) await chips.nth(i).click();
  await expect(go).toBeEnabled();
  await go.click();
  await expect(page.locator('#story-body')).toBeVisible();
});

test('one reader carries everything the two used to split', async ({ page }) => {
  await openNap(page);
  await page.locator('#warm-up-skip').click();

  // Listen, the scaffolds, tapping a word for the blend ladder, a way to
  // say "finished", and the practice tools — all on the one reader.
  await expect(page.locator('#btn-story-play')).toBeVisible();
  await expect(page.locator('#btn-toggle-graphemes')).toBeVisible();
  await expect(page.locator('#btn-toggle-ruler')).toBeVisible();
  await expect(page.locator('#btn-finish-story')).toBeVisible();
  await expect(page.locator('#practice-drawer')).toBeAttached();

  await page.locator('#story-body .wf-word', { hasText: /^nap$/ }).first().click();
  await expect(page.locator('.blend-ladder')).toBeVisible();
});
