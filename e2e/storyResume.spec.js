/**
 * Coming back to a story where you left it.
 *
 * A Band D story runs to 181 words and nothing saved the reading position,
 * so a child who closed the tab came back to the top and read the first
 * third again. The unit tests pin the storage rules; these pin that a child
 * actually lands where they stopped, is told why, and can say no.
 */
import { test, expect } from '@playwright/test';

const PROFILE = 'p_resume';
const STORY = 'core-d-01';

async function seedLearner(page, { place = null, read = [] } = {}) {
  await page.addInitScript(
    ({ PROFILE, STORY, place, read }) => {
      const profile = {
        id: PROFILE,
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
      if (place !== null) {
        localStorage.setItem(
          `giri_story_place__${PROFILE}`,
          JSON.stringify({ [STORY]: { word: place, at: Date.now() } }),
        );
      }
      if (read.length) localStorage.setItem(`giri_stories_read__${PROFILE}`, JSON.stringify(read));
    },
    { PROFILE, STORY, place, read },
  );
}

/** Open the first Band D story — the longest ones in the bank. */
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
  await expect(page.locator('.story-card').first()).toBeVisible();

  await page.locator('.story-tab[data-band="D"]').click();
  await page.locator('.story-card').first().click();
  const skip = page.locator('#warm-up-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await expect(page.locator('#story-body')).toBeVisible();
}

const savedPlace = (page) =>
  page.evaluate((k) => {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : null;
  }, `giri_story_place__${PROFILE}`);

test('reading down the story saves the place', async ({ page }) => {
  await seedLearner(page);
  await openStory(page);

  expect(await savedPlace(page)).toBeNull();

  await page.evaluate(() => document.getElementById('stories-content').scrollBy({ top: 700 }));
  await page.waitForTimeout(900);

  const saved = await savedPlace(page);
  expect(saved).not.toBeNull();
  expect(saved[STORY].word).toBeGreaterThan(8);
});

test('coming back lands on the word they stopped at, and says so', async ({ page }) => {
  await seedLearner(page, { place: 82 });
  await openStory(page);
  await page.waitForTimeout(900);

  // The note has to be visible AFTER the scroll that restores the place —
  // an explanation the child cannot see explains nothing.
  const note = page.locator('#story-resume');
  await expect(note).toBeVisible();
  await expect(note).toContainText(/where you stopped/i);

  // And the word itself is on screen, marked.
  const marked = page.locator('#story-body .wf-word--resumed');
  await expect(marked).toHaveCount(1);
  await expect(marked).toBeInViewport();
});

test('"Start from the beginning" goes back to the top and forgets the place', async ({ page }) => {
  await seedLearner(page, { place: 82 });
  await openStory(page);
  await page.waitForTimeout(900);

  await page.locator('#btn-resume-restart').click();
  await expect(page.locator('#story-resume')).toHaveCount(0);
  expect((await savedPlace(page))?.[STORY]).toBeUndefined();

  // The first word of the story is what they are looking at now.
  await expect(page.locator('#story-body .wf-word').first()).toBeInViewport();
});

test('a story already read starts at the beginning, with no note', async ({ page }) => {
  // Re-reading for fluency starts at the top; that is the point of a re-read.
  await seedLearner(page, { place: 82, read: [STORY] });
  await openStory(page);
  await page.waitForTimeout(800);
  await expect(page.locator('#story-resume')).toHaveCount(0);
});

test('the note goes away once the child scrolls on their own', async ({ page }) => {
  await seedLearner(page, { place: 82 });
  await openStory(page);
  await expect(page.locator('#story-resume')).toBeVisible();

  // A sticky note that rode down the whole story would cover the line the
  // child is reading. It leaves as soon as they have their bearings.
  await page.waitForTimeout(1400);
  await page.evaluate(() => document.getElementById('stories-content').scrollBy({ top: 120 }));
  await expect(page.locator('#story-resume')).toHaveCount(0);
});

test('finishing the story clears the place', async ({ page }) => {
  await seedLearner(page, { place: 82 });
  await openStory(page);
  await page.waitForTimeout(900);

  await page.locator('#btn-finish-story').click();
  await page.waitForTimeout(400);
  expect((await savedPlace(page))?.[STORY]).toBeUndefined();
});

test('the place belongs to one child, not to the device', async ({ page }) => {
  await seedLearner(page, { place: 82 });
  await openStory(page);
  await page.waitForTimeout(900);

  // Siblings share a tablet. The key carries the profile id, so one child's
  // bookmark can never drop another child halfway into a story.
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toContain(`giri_story_place__${PROFILE}`);
  expect(keys).not.toContain('giri_story_place');
});
