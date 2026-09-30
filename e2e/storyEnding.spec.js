/**
 * The end of a story.
 *
 * Finishing used to produce a disabled button and, for the 34 of 69 stories
 * that carry quest data, a Quest card. There was no "read it again", no next
 * story and no way to stop — the session had no end, and a child who had
 * just read 150 words was told nothing about what they had done.
 */
import { test, expect } from '@playwright/test';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_end',
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

async function openStory(page, band = 'B', nth = 0) {
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

  await page.locator(`.story-tab[data-band="${band}"]`).click();
  await page.locator('.story-card').nth(nth).click();
  const skip = page.locator('#gate-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await expect(page.locator('#story-body')).toBeVisible();
}

/** Read to the last line with the ruler, then tap Next once more. */
async function readToTheEnd(page) {
  await page.locator('#btn-toggle-ruler').click();
  await expect(page.locator('.ruler-nav')).toBeVisible();
  const next = page.locator('#btn-ruler-next');
  for (let i = 0; i < 40; i++) {
    const label = (await next.textContent()).trim();
    await next.click();
    await page.waitForTimeout(90);
    if (label.includes('The end')) return;
  }
  throw new Error('never reached the end of the story');
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('reading every line to the end finishes the story', async ({ page }) => {
  await openStory(page);
  await readToTheEnd(page);

  const ending = page.locator('.story-ending');
  await expect(ending).toBeVisible();
  await expect(ending.locator('.story-ending-title')).toContainText(/whole story/i);
  // The ruler is the one place the app knows the child read it themselves.
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('giri_stories_read'))),
  ).toContain('core-b-01');
});

test('it says what the child did, in words and not a score', async ({ page }) => {
  await openStory(page);

  // Work two words out with Sound It Out before finishing.
  for (const i of [3, 9]) {
    await page.locator('#story-body .wf-word').nth(i).click();
    await expect(page.locator('#modal-word-detective')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal-word-detective')).toBeHidden();
  }
  await readToTheEnd(page);

  const facts = page.locator('.story-ending-facts');
  await expect(facts).toContainText(/\d+ words\./);
  await expect(facts).toContainText(/worked out 2 words/i);
  // No speed, no percentage, no stars. This is the end of a story.
  await expect(facts).not.toContainText(/%|per minute|wpm|score/i);
});

test('offers again, the next story, and a way to stop', async ({ page }) => {
  await openStory(page);
  await readToTheEnd(page);

  await expect(page.locator('#btn-ending-again')).toBeVisible();
  await expect(page.locator('#btn-ending-next')).toBeVisible();
  await expect(page.locator('#btn-ending-done')).toBeVisible();
  // The next story is named, so choosing it is not a leap of faith.
  await expect(page.locator('#btn-ending-next')).toContainText(/Next: \S/);
});

test('"Read it again" goes back to the top of the same story', async ({ page }) => {
  await openStory(page);
  await readToTheEnd(page);

  await page.locator('#btn-ending-again').click();
  await expect(page.locator('.story-ending')).toHaveCount(0);
  await expect(page.locator('#story-body .wf-word').first()).toBeInViewport();
  await expect(page.locator('.ruler-pos b')).toContainText('1 /');
});

test('"Next" opens a different story', async ({ page }) => {
  await openStory(page);
  const first = await page.locator('.story-reader-title').textContent();
  await readToTheEnd(page);

  const label = await page.locator('#btn-ending-next').textContent();
  await page.locator('#btn-ending-next').click();
  await expect(page.locator('.story-ending')).toHaveCount(0);
  const second = await page.locator('.story-reader-title').textContent();
  expect(second).not.toBe(first);
  expect(label).toContain(second.trim());
});

test('"Finish for today" returns to the library', async ({ page }) => {
  await openStory(page);
  await readToTheEnd(page);

  await page.locator('#btn-ending-done').click();
  await expect(page.locator('.stories-browser')).toBeVisible();
  // And the story it just finished is ticked on the shelf.
  await expect(page.locator('.story-card--read').first()).toBeVisible();
});

test('marking a story read in Sound It Out mode ends it too', async ({ page }) => {
  await openStory(page);
  await page.locator('#btn-mode-decode').click();
  await page.locator('#btn-mark-read').click();
  await expect(page.locator('.story-ending')).toBeVisible();
  await expect(page.locator('#btn-ending-done')).toBeVisible();
});

test('the ending appears once, not once per tap', async ({ page }) => {
  await openStory(page);
  await readToTheEnd(page);
  await page.locator('#btn-ruler-next').click();
  await page.locator('#btn-ruler-next').click();
  await expect(page.locator('.story-ending')).toHaveCount(1);
});
