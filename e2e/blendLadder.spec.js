/**
 * Sounding a word out, one sound at a time.
 *
 * Tapping a word used to auto-play every sound and then say the word. The
 * child watched. Blending is the step where decoding is actually built —
 * holding the sounds so far and adding the next one — so the panel now waits
 * for the child at every rung.
 *
 * These also pin the two things a browser catches and a unit test does not:
 * that the ladder reaches words outside the curated bank (two thirds of the
 * words in the story bank), and that a tap always does something.
 */
import { test, expect } from '@playwright/test';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_blend',
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
  await expect(page.locator('.story-card').first()).toBeVisible();

  await page.locator('.story-tab[data-band="B"]').click();
  await page.locator('.story-card').first().click();
  const skip = page.locator('#gate-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await expect(page.locator('#story-body')).toBeVisible();
}

/** The rungs so far, without the closing prompt. */
async function rungs(page) {
  const all = await page.locator('.bl-steps li:not(.bl-done)').allTextContents();
  return all.map((s) => s.replace(/[^A-Za-z]/g, ''));
}

async function tapWord(page, word) {
  await page
    .locator('#story-body .wf-word', { hasText: new RegExp(`^${word}$`) })
    .first()
    .click();
  await expect(page.locator('.blend-ladder')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('the panel waits — it does not sound the word out for you', async ({ page }) => {
  await openStory(page);
  await tapWord(page, 'cake');

  // Nothing has been blended yet, and the only way forward is the child's tap.
  expect(await rungs(page)).toEqual([]);
  await expect(page.locator('.bl-next')).toBeVisible();
});

test('each tap adds one sound to the sounds already held', async ({ page }) => {
  await openStory(page);
  await tapWord(page, 'cake');

  await page.locator('.bl-next').click();
  expect(await rungs(page)).toEqual(['c']);
  await page.locator('.bl-next').click();
  expect(await rungs(page)).toEqual(['c', 'ca']);
  await page.locator('.bl-next').click();
  // The silent e has no rung of its own but joins the word when it finishes.
  expect(await rungs(page)).toEqual(['c', 'ca', 'cake']);
  await expect(page.locator('.bl-next')).toBeHidden();
  await expect(page.locator('.bl-again')).toBeVisible();
});

test('a tap always moves, even before a sound has finished playing', async ({ page }) => {
  await openStory(page);
  await tapWord(page, 'cake');

  // Three taps in quick succession. Gating the next tap on audio finishing
  // meant a child pressing again got nothing whenever a recording was slow.
  const next = page.locator('.bl-next');
  await next.click();
  await next.click();
  await next.click();
  expect(await rungs(page)).toEqual(['c', 'ca', 'cake']);
});

test('it reaches words the curated bank does not hold', async ({ page }) => {
  await openStory(page);

  // "stayed" is not a bank word. Two thirds of story words are not, so a
  // ladder that only worked for bank entries would be a ladder one tap in
  // three — and "stayed" is no less decodable than "stay".
  await tapWord(page, 'stayed');
  const next = page.locator('.bl-next');
  for (let i = 0; i < 6; i++) {
    if (!(await next.isVisible())) break;
    await next.click();
  }
  expect(await rungs(page)).toEqual(['s', 'st', 'stay', 'stayed']);
});

test('a blend is two sounds, a digraph is one', async ({ page }) => {
  await openStory(page);
  await tapWord(page, 'stayed');

  // The bank groups "st" as one tile. In a ladder that skips the blending
  // step the ladder exists to teach, so the tiles open it up.
  const tiles = await page.locator('.bl-tile').allTextContents();
  expect(tiles.map((t) => t.trim())).toEqual(['s', 't', 'ay', '-ed']);
});

test('"Start again" clears the ladder back to nothing', async ({ page }) => {
  await openStory(page);
  await tapWord(page, 'cake');
  const next = page.locator('.bl-next');
  await next.click();
  await next.click();
  await next.click();

  await page.locator('.bl-again').click();
  expect(await rungs(page)).toEqual([]);
  await expect(next).toBeVisible();
});

test('hearing the word is always one tap away', async ({ page }) => {
  await openStory(page);
  await tapWord(page, 'cake');

  // Keeping the story moving matters more than finishing every blend: a
  // child stuck on one word must not be stuck in the panel.
  const say = page.locator('.bl-say');
  await expect(say).toBeVisible();
  await expect(say).toContainText(/Just hear the word/i);

  await page.locator('.bl-next').click();
  await page.locator('.bl-next').click();
  await page.locator('.bl-next').click();
  // Afterwards the same button is how they check themselves.
  await expect(say).toContainText(/Hear the word/i);
});

test('a grown-up is told how to help', async ({ page }) => {
  await openStory(page);
  await tapWord(page, 'cake');
  const help = page.locator('.bl-help');
  await expect(help).toBeVisible();
  await help.locator('summary').click();
  await expect(help).toContainText(/let your child say it first/i);
});

test('Sound It Out mode shows the same ladder', async ({ page }) => {
  await openStory(page);
  await page.locator('#btn-mode-decode').click();

  // Tapping a word is one action, so it teaches one thing wherever it is
  // tapped — the decode panel used to auto-play instead.
  await page
    .locator('.decode-word', { hasText: /^cake$/ })
    .first()
    .click();
  await expect(page.locator('.decode-panel .blend-ladder')).toBeVisible();
  expect(await rungs(page)).toEqual([]);
});

test('a name falls back to hearing it, rather than a made-up split', async ({ page }) => {
  await openStory(page);

  // "Giri" is a proper noun: there is no rule-based split to offer, and
  // inventing one would teach a grapheme the language does not have.
  await page
    .locator('#story-body .wf-word', { hasText: /^Giri$/ })
    .first()
    .click();
  await expect(page.locator('#modal-word-detective')).toBeVisible();
  await expect(page.locator('.blend-ladder')).toHaveCount(0);
  await expect(page.locator('.wd-fallback')).toBeVisible();
});
