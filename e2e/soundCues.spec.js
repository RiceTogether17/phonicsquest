/**
 * The sound-colour scaffold's second channel, and the word tap it depends on.
 *
 * Two things a unit test cannot see:
 *
 *   1. The breve and macron actually paint. They are CSS pseudo-elements fed
 *      by a `data-cue` attribute, so the markup being right proves nothing —
 *      only a browser can say whether a child sees a mark above the vowel.
 *      This matters because the vowel colours alone cannot carry short vs
 *      long: in dark mode those two hues simulate to ΔE 9.4 apart under
 *      deuteranopia, which is indistinguishable.
 *
 *   2. Tapping a word works in BOTH follow modes. The reader prints
 *      "👆 Tap a word to hear its sounds" unconditionally, but the word spans
 *      used to be built only in "Word by word" mode — so a child who chose
 *      "Whole line" was told to tap words that were not tappable.
 */
import { test, expect } from '@playwright/test';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_cues',
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

/** Open a Band B story — long vowels, so ă and ā land on the same page. */
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

  const skip = page.locator('#warm-up-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await expect(page.locator('#story-body')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('short and long vowels wear a mark, not just a colour', async ({ page }) => {
  await openStory(page);

  const short = page.locator('.vs--short[data-cue]').first();
  const long = page.locator('.vs--long[data-cue]').first();
  await expect(short).toHaveCount(1);
  await expect(long).toHaveCount(1);

  // The mark is drawn by CSS, so ask the browser what it actually painted.
  const painted = (loc) =>
    loc.evaluate((el) => {
      const s = getComputedStyle(el, '::after');
      return { content: s.content, width: parseFloat(s.width) || 0 };
    });

  const s = await painted(short);
  const l = await painted(long);
  expect(s.content).toContain('˘');
  expect(l.content).toContain('¯');
  // A pseudo-element that exists but renders nothing is the failure mode
  // this is really guarding: zero width means no mark reached the child.
  expect(s.width).toBeGreaterThan(0);
  expect(l.width).toBeGreaterThan(0);
});

test('the marks sit above the word without pushing the line around', async ({ page }) => {
  await openStory(page);

  // Absolutely positioned, so a marked vowel must not be wider than the
  // letters it wraps — otherwise every marked line would rewrap and the
  // reading ruler would measure the wrong thing.
  const overflow = await page.locator('#story-body').evaluate((body) => {
    let worst = 0;
    for (const el of body.querySelectorAll('.vs[data-cue]')) {
      const own = el.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(el);
      const text = range.getBoundingClientRect();
      worst = Math.max(worst, own.width - text.width);
    }
    return worst;
  });
  expect(overflow).toBeLessThan(1);
});

test('a word can be tapped in BOTH follow modes', async ({ page }) => {
  await openStory(page);

  for (const mode of ['word', 'line']) {
    await page.locator(`.follow-mode-btn[data-follow="${mode}"]`).click();
    await expect(page.locator('#story-body')).toBeVisible();

    // The hint is printed in both modes, so the spans must exist in both.
    await expect(page.locator('.reader-tap-hint')).toBeVisible();
    const words = page.locator('#story-body .wf-word');
    expect(await words.count(), `no tappable words in "${mode}" mode`).toBeGreaterThan(0);

    await words.first().click();
    const panel = page.locator('#word-panel');
    await expect(panel, `tapping a word did nothing in "${mode}" mode`).toBeVisible();
    await expect(panel.locator('.wd-tile, .bl-tile').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  }
});

test('a screen reader is given the word, not the word plus its marks', async ({ page }) => {
  await openStory(page);

  // These spans are exposed as buttons, so their name comes from their
  // contents — which include CSS-drawn diacritics on some engines. The
  // explicit label is what keeps "cake" from being announced "c ¯ a k e".
  const span = page.locator('#story-body .wf-word').first();
  const label = await span.getAttribute('aria-label');
  const plain = await span.getAttribute('data-plain');
  expect(label).toBeTruthy();
  expect(label).toBe(plain);
  expect(label).toMatch(/^[A-Za-z][A-Za-z'’-]*$/);
});

test('the story-grammar labels are not run through the phonics scaffold', async ({ page }) => {
  await openStory(page);

  // "Problem:" / "Attempt:" / "Solution:" name the shape of the story for a
  // grown-up. Colouring them put a breve over "PRŎBLĔM" — phonics notation
  // on a word no Primary 1 reader is being asked to sound out.
  const labels = page.locator('#story-body .sline--label');
  expect(await labels.count()).toBeGreaterThan(0);
  expect(await labels.locator('.vs').count()).toBe(0);
  expect(await labels.locator('.wf-word').count()).toBe(0);
});

test('the colour key explains the marks, not only the colours', async ({ page }) => {
  await openStory(page);
  const legend = page.locator('.sound-legend');
  await expect(legend).toBeVisible();
  await expect(legend.locator('.sl-lead')).toContainText(/short vowel wears/i);
  // Every category still names itself in words, for anyone the colour and
  // the mark both fail.
  await expect(legend.locator('.sl-item')).toHaveCount(6);
});
