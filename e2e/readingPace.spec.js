/**
 * Reading pace — a grown-up's measurement, not a child's score.
 *
 * What this replaces: `wcpm >= 60 → "🌟 Fluent reader!"`, printed next to
 * the story with no grade, no time of year and no errors counted. Three
 * separate problems, each pinned below:
 *
 *   · 60 is roughly the middle of Grade 1 at year's end and roughly the
 *     10th percentile for Grade 2 at year's end, so the child most in need
 *     of a timing was the one most likely to be congratulated by it;
 *   · nothing counted errors, so the number was words per minute stored and
 *     displayed under a name that means words CORRECT per minute;
 *   · it was shown to the child, which teaches that reading fast is the
 *     goal — the habit most likely to wreck comprehension.
 */
import { test, expect } from '@playwright/test';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_pace',
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

async function openPacePanel(page) {
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

  await page.locator('.story-tab[data-band="B"]').click();
  await page.locator('.story-card').first().click();
  const skip = page.locator('#gate-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await expect(page.locator('#story-body')).toBeVisible();

  await page.locator('#practice-drawer > summary').click();
  await page.locator('#fluency-bar > summary').click();
  await expect(page.locator('#btn-fluency-start')).toBeVisible();
}

/** Time a read that lasts long enough to count. */
async function timeAread(page, ms = 6200) {
  await page.locator('#btn-fluency-start').click();
  await page.waitForTimeout(ms);
  await page.locator('#btn-fluency-done').click();
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('it is marked as a grown-up tool, not a reward', async ({ page }) => {
  await openPacePanel(page);
  await expect(page.locator('.fluency-summary')).toContainText(/for grown-ups/i);
  await expect(page.locator('.fluency-summary')).toContainText(/not shown as a score/i);
});

test('stopping the timer asks for the error count before reporting anything', async ({ page }) => {
  await openPacePanel(page);
  await timeAread(page);

  // Nothing is reported yet: without errors the number is words per minute,
  // which cannot be compared to a words-CORRECT-per-minute benchmark.
  await expect(page.locator('#fluency-form')).toBeVisible();
  await expect(page.locator('#fluency-result')).toBeHidden();
  await expect(page.locator('#fluency-form')).toContainText(/Words read wrongly/i);
});

test('the reading names its measure and shows accuracy', async ({ page }) => {
  await openPacePanel(page);
  await timeAread(page);

  await page.locator('input[name="errors"]').fill('6');
  await page.locator('#fluency-form button[type="submit"]').click();

  const result = page.locator('#fluency-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText(/words correct per minute/i);
  await expect(result).toContainText(/93% accurate/);
  // And the form gets out of the way rather than sitting under its answer.
  await expect(page.locator('#fluency-form')).toBeHidden();
});

test('it never tells anyone the child is a fluent reader', async ({ page }) => {
  await openPacePanel(page);
  await timeAread(page);
  await page.locator('input[name="errors"]').fill('0');
  await page.locator('#fluency-form button[type="submit"]').click();

  // A six-second timing of an 80-word story is an enormous rate — exactly
  // the case the old `>= 60` rule would have called fluent.
  const text = await page.locator('#fluency-result').textContent();
  expect(text).not.toMatch(/fluent reader|🌟|well done|faster/i);
});

test('it says there is no benchmark for this age, rather than inventing one', async ({ page }) => {
  await openPacePanel(page);
  await timeAread(page);
  await page.locator('input[name="errors"]').fill('4');
  await page.locator('#fluency-form button[type="submit"]').click();

  const result = page.locator('#fluency-result');
  await expect(result).toContainText(/benchmarks start at Primary 1/i);
  // Published norms begin at Grade 1, and a profile with a primary grade is
  // routed away from these stories entirely — so telling a parent to set a
  // school year would be telling them to break what they are using.
  await expect(result).not.toContainText(/set the school year/i);
});

test('"Don\'t save" records nothing', async ({ page }) => {
  await openPacePanel(page);
  await timeAread(page);
  await page.locator('#btn-fluency-discard').click();

  await expect(page.locator('#fluency-result')).toContainText(/Not saved/i);
  expect(await page.evaluate(() => localStorage.getItem('giri_fluency_history'))).toBeNull();
});

test('a saved timing keeps both measures apart', async ({ page }) => {
  await openPacePanel(page);
  await timeAread(page);
  await page.locator('input[name="errors"]').fill('8');
  await page.locator('label:has-text("With some help") input').check();
  await page.locator('#fluency-form button[type="submit"]').click();
  await expect(page.locator('#fluency-result')).toBeVisible();

  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('giri_fluency_history') ?? '{}'),
  );
  const entry = saved['core-b-01'][0];
  // Words per minute and words CORRECT per minute are different numbers and
  // both are kept, so a history can never mix the two silently.
  expect(entry.wpm).toBeGreaterThan(entry.wcpm);
  expect(entry.errors).toBe(8);
  expect(entry.accuracy).toBe(90);
  expect(entry.support).toBe('supported');
});

test('a tap that was not a real reading is rejected', async ({ page }) => {
  await openPacePanel(page);
  await timeAread(page, 600);
  await expect(page.locator('#fluency-form')).toBeHidden();
  await expect(page.locator('#fluency-result')).toContainText(/very quick/i);
});
