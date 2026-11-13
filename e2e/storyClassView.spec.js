/**
 * Story class view — a story for a teacher leading a class from one screen.
 *
 * On a 1280×720 laptop the ordinary reader shows the app header, the library
 * header, the cover, the title, a toolbar, a colour legend and a words strip
 * before the first line of the story, and the buttons that move through it
 * sit below the fold. Class view keeps only the text and the ruler. These
 * checks are about what is on screen, which only a browser can answer.
 */
import { test, expect } from '@playwright/test';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_class',
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

async function openStory(page) {
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
  await page.locator('.story-tab[data-band="C"]').click();
  await page.locator('.story-card').first().click();
  const skip = page.locator('#warm-up-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await expect(page.locator('#story-body')).toBeVisible();
}

test.use({ viewport: { width: 1280, height: 720 } });

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('stories open plain, with sound colours off', async ({ page }) => {
  await openStory(page);
  await expect(page.locator('#btn-toggle-graphemes')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.sound-legend')).toHaveCount(0);
});

test('class view shows the story and the ruler, and nothing to scroll past', async ({ page }) => {
  await openStory(page);
  await page.locator('#btn-toggle-class').click();

  for (const hidden of [
    '.app-header',
    '#screen-stories .stories-screen-header',
    '.story-illo',
    '.story-reader-toolbar',
  ]) {
    await expect(page.locator(hidden)).toBeHidden();
  }
  // The first line of the story and both ruler buttons are on screen at once.
  await expect(page.locator('#story-body .wf-word').first()).toBeInViewport({ ratio: 1 });
  await expect(page.locator('#btn-ruler-next')).toBeInViewport({ ratio: 1 });
  await expect(page.locator('#btn-ruler-back')).toBeInViewport({ ratio: 1 });

  const size = await page
    .locator('#story-body .wf-word')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(36);
});

test('the ruler buttons stay in reach all the way down the story', async ({ page }) => {
  await openStory(page);
  await page.locator('#btn-toggle-class').click();
  const next = page.locator('#btn-ruler-next');
  for (let i = 0; i < 8; i++) {
    await next.click();
    await expect(next).toBeInViewport({ ratio: 1 });
  }
});

test('word by word, each line ends with the whole line', async ({ page }) => {
  await openStory(page);
  await page.locator('#btn-toggle-class').click();
  // Switch the ruler to its Word style.
  for (let i = 0; i < 3; i++) {
    if ((await page.locator('#btn-ruler-style').textContent())?.includes('Word')) break;
    await page.locator('#btn-ruler-style').click();
  }
  await expect(page.locator('#btn-ruler-style')).toContainText('Word');

  const label = page.locator('.ruler-pos small');
  const next = page.locator('#btn-ruler-next');
  await expect(label).toHaveText('Word');
  let steps = 0;
  while ((await label.textContent()) !== 'Whole line' && steps < 40) {
    await next.click();
    steps++;
  }
  await expect(label).toHaveText('Whole line');
  await expect(page.locator('#story-body .wf-word.is-pointed')).toHaveCount(0);
  await expect(next).toHaveText('Next line ▶');

  await next.click();
  await expect(label).toHaveText('Word');
  await expect(page.locator('#story-body .wf-word.is-pointed')).toHaveCount(1);
});

test('a clicker (Page Down) moves the ruler, and Escape leaves class view', async ({ page }) => {
  await openStory(page);
  await page.locator('#btn-toggle-class').click();
  const pos = page.locator('.ruler-pos b');
  const before = await pos.textContent();
  await page.keyboard.press('PageDown');
  await expect(pos).not.toHaveText(before ?? '');

  await page.keyboard.press('Escape');
  await expect(page.locator('.app-header')).toBeVisible();
  await expect(page.locator('#btn-toggle-class')).toHaveAttribute('aria-pressed', 'false');
});

test('leaving for the library puts the app header back', async ({ page }) => {
  await openStory(page);
  await page.locator('#btn-toggle-class').click();
  await expect(page.locator('.app-header')).toBeHidden();
  await page.locator('#btn-class-exit').click();
  await page.locator('#btn-reader-back').click();
  await expect(page.locator('.app-header')).toBeVisible();
});
