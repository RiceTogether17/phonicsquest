/**
 * Story pre-teach words and the two support labels.
 *
 * VALIDITY_ROADMAP 1.4 asks for the words a story cannot be sounded out
 * from to be shown BEFORE it is read, rather than only inside the
 * validator. The reader did print a list, but it came from the sight-word
 * quest weave and was capped at six — a different set. Across the bank it
 * omitted 110 words children actually need over 37 stories, while spending
 * slots on decodable words like "back" and "plan".
 *
 * The unit tests pin the list. This pins that the child actually sees it.
 */
import { test, expect } from '@playwright/test';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_story',
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

/** Open the Giri story library. The banner lives in the Learn panel. */
async function openLibrary(page) {
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
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('library cards say how many words need meeting first', async ({ page }) => {
  await openLibrary(page);

  const supports = page.locator('.story-card-support');
  expect(await supports.count()).toBeGreaterThan(0);

  // Band A minis carry the heaviest pre-teach load — that is where "the",
  // "said" and "I" all land — so at least one card must advertise a count.
  const labels = (await supports.allTextContents()).join(' | ');
  expect(labels).toMatch(/new words?|Read by myself/);
});

test('opening a story lists the words it cannot be sounded out from', async ({ page }) => {
  await openLibrary(page);

  // Giri's Nap (core-a-04) needs ten: it, day, for, on, the, too, I, said,
  // his, then. The old six-word panel showed fewer, and not these.
  await page.locator('.story-card').nth(3).click();

  const prep = page.locator('.story-prep');
  await expect(prep).toBeVisible();
  await expect(page.locator('#story-prep-title')).toContainText(/Words to know first/i);

  const words = page.locator('.story-prep-word');
  expect(await words.count()).toBeGreaterThan(6);

  // The pronoun prints as a capital — the classifier lowercases every token,
  // and a panel teaching sight recognition must not show the wrong shape.
  const shown = await words.allTextContents();
  expect(shown).toContain('I');
  expect(shown).not.toContain('i');
});

test('a pre-teach word speaks when tapped', async ({ page }) => {
  await openLibrary(page);
  await page.locator('.story-card').nth(3).click();

  const first = page.locator('.story-prep-word').first();
  await expect(first).toHaveAttribute('aria-label', /^Hear the word /);
  await first.click();
  // Hearing it is the only way to meet a word you cannot sound out, so the
  // tap has to acknowledge itself.
  await expect(first).toHaveClass(/story-prep-word--said/);
});

test('every story is labelled read-alone or read-with-a-grown-up', async ({ page }) => {
  await openLibrary(page);
  await page.locator('.story-card').first().click();

  // Band A minis are tightly controlled, so this one reads alone.
  await expect(page.locator('.story-meta-badge--independent')).toBeVisible();
  await expect(page.locator('.story-meta-badge--supported')).toHaveCount(0);
});

test('the Singapore readers say they need a grown-up', async ({ page }) => {
  await openLibrary(page);

  // These play by looser rules than the shelf they sit on — a lifted HFW cap
  // and the full code — and nothing on screen used to say so.
  await page.locator('.sb-cat-tab[data-cat="singapore"]').click();
  await expect(page.locator('.story-card').first()).toBeVisible();
  await page.locator('.story-card').first().click();

  await expect(page.locator('.story-meta-badge--supported')).toContainText(/grown-up/i);
});
