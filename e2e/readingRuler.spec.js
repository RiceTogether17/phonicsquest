/**
 * The Reading Ruler, in a browser — which is the only place it means
 * anything, since the whole thing is measured from where words landed after
 * wrapping.
 *
 * The bug this replaces: the "📏 Reading ruler" toggle set a class that
 * underlined `.sline--active`, and that class is only ever set while
 * text-to-speech is speaking. So the ruler marked the line the app was
 * reading aloud and did nothing at all when the child read by themselves —
 * the only time a reading ruler has a purpose. Every test below would have
 * passed vacuously against that version, so each asserts on something the
 * old one could not do: advance, cover, follow, survive a resize.
 */
import { test, expect } from '@playwright/test';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_ruler',
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

/** A Band C reader — long enough to wrap onto a dozen visual lines. */
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

  await page.locator('.story-tab[data-band="C"]').click();
  await page.locator('.story-card').first().click();
  const skip = page.locator('#gate-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await expect(page.locator('#story-body')).toBeVisible();
}

async function turnOnRuler(page) {
  await page.locator('#btn-toggle-ruler').click();
  await expect(page.locator('.ruler-layer')).toBeAttached();
  await expect(page.locator('.ruler-nav')).toBeVisible();
}

/**
 * Where the ruler has decided the bar belongs, in story-body coordinates.
 *
 * Read from the inline `top` the ruler set, not from a bounding box: the bar
 * eases into place over --dur-fast, so a box measured straight after a move
 * is wherever the animation had got to, which made this flaky against a
 * ruler that was working perfectly.
 */
const barTop = (page) => page.locator('.ruler-bar').evaluate((el) => parseFloat(el.style.top));

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('the ruler works without anything reading aloud', async ({ page }) => {
  await openStory(page);
  await turnOnRuler(page);

  // Nothing is speaking, so the old implementation had no active line and
  // therefore nothing to draw.
  expect(await page.locator('.sline--active').count()).toBe(0);
  await expect(page.locator('.ruler-bar')).toBeVisible();
  await expect(page.locator('.ruler-pos b')).toContainText('1 /');
});

test('Next moves it down one line at a time, and Back comes up again', async ({ page }) => {
  await openStory(page);
  await turnOnRuler(page);

  const back = page.locator('#btn-ruler-back');
  await expect(back).toBeDisabled(); // nothing above line one

  const first = await barTop(page);
  await page.locator('#btn-ruler-next').click();
  await expect(page.locator('.ruler-pos b')).toContainText('2 /');
  const second = await barTop(page);
  expect(second).toBeGreaterThan(first);

  await expect(back).toBeEnabled();
  await back.click();
  await expect(page.locator('.ruler-pos b')).toContainText('1 /');
  expect(Math.abs((await barTop(page)) - first)).toBeLessThan(2);
});

test('it counts the lines the child sees, not the paragraphs', async ({ page }) => {
  await openStory(page);
  await turnOnRuler(page);

  const paragraphs = await page.locator('#story-body .sline').count();
  const lines = Number((await page.locator('.ruler-pos b').textContent()).split('/')[1].trim());
  // Wrapped text: a handful of paragraph elements, many more visual lines.
  // Tracking paragraph-by-paragraph is not tracking.
  expect(lines).toBeGreaterThan(paragraphs);
});

test('the lines still to come are covered more than the lines already read', async ({ page }) => {
  await openStory(page);
  await turnOnRuler(page);
  for (let i = 0; i < 3; i++) await page.locator('#btn-ruler-next').click();
  await page.waitForTimeout(250);

  const veils = await page.evaluate(() => {
    const above = document.querySelector('.ruler-veil--above').getBoundingClientRect();
    const below = document.querySelector('.ruler-veil--below').getBoundingClientRect();
    const bar = document.querySelector('.ruler-bar').getBoundingClientRect();
    const alpha = (sel) => {
      const bg = getComputedStyle(document.querySelector(sel)).backgroundColor;
      const m = bg.match(/[\d.]+/g);
      return m && m.length === 4 ? parseFloat(m[3]) : 1;
    };
    return {
      gap: bar.top - above.bottom, // the clear band the child reads
      belowStartsAfterBar: below.top >= bar.bottom - 1,
      aboveAlpha: alpha('.ruler-veil--above'),
      belowAlpha: alpha('.ruler-veil--below'),
    };
  });

  expect(veils.gap).toBeGreaterThan(10); // there IS a clear line
  expect(veils.belowStartsAfterBar).toBe(true);
  // Read lines stay legible for a re-check; unread lines are covered, which
  // is the point of holding a card under the line.
  expect(veils.belowAlpha).toBeGreaterThan(veils.aboveAlpha);
});

test('the style button cycles Line, Window and Word, keeping the place', async ({ page }) => {
  await openStory(page);
  await turnOnRuler(page);
  for (let i = 0; i < 4; i++) await page.locator('#btn-ruler-next').click();
  await page.waitForTimeout(250);
  const before = await barTop(page);

  // Line → Window: the current line lights up instead of the rest going dark.
  await expect(page.locator('.ruler-style small')).toHaveText('Line');
  await page.locator('#btn-ruler-style').click();
  await expect(page.locator('.ruler-style small')).toHaveText('Window');
  await expect(page.locator('.ruler-layer--window .ruler-strip')).toBeVisible();

  // Window → Word: a pointer on one word, and the counter changes unit.
  await page.locator('#btn-ruler-style').click();
  await expect(page.locator('.ruler-style small')).toHaveText('Word');
  await expect(page.locator('.ruler-layer--word .ruler-word')).toBeVisible();
  await expect(page.locator('.ruler-pos small')).toHaveText('Word');
  await expect(page.locator('#story-body .wf-word.is-pointed')).toHaveCount(1);

  // Changing the style must not lose the child's place in the story.
  expect(Math.abs((await barTop(page)) - before)).toBeLessThan(20);
});

test('arrow keys move it, so it works without a touchscreen', async ({ page }) => {
  await openStory(page);
  await turnOnRuler(page);
  const first = await barTop(page);

  await page.locator('#story-body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.ruler-pos b')).toContainText('3 /');
  expect(await barTop(page)).toBeGreaterThan(first);

  await page.keyboard.press('ArrowUp');
  await expect(page.locator('.ruler-pos b')).toContainText('2 /');
});

test('it re-measures when the window is resized', async ({ page }) => {
  await openStory(page);
  await turnOnRuler(page);
  const wide = Number((await page.locator('.ruler-pos b').textContent()).split('/')[1].trim());

  // Narrower column → the same words wrap onto more lines. A ruler that
  // cached its measurements would now be pointing at the wrong place.
  await page.setViewportSize({ width: 420, height: 800 });
  await page.waitForTimeout(600);
  const narrow = Number((await page.locator('.ruler-pos b').textContent()).split('/')[1].trim());
  expect(narrow).toBeGreaterThan(wide);
  await expect(page.locator('.ruler-bar')).toBeVisible();
});

test('turning it off removes it, and the choice is remembered', async ({ page }) => {
  await openStory(page);
  await turnOnRuler(page);

  await page.locator('#btn-toggle-ruler').click();
  await expect(page.locator('.ruler-layer')).toHaveCount(0);
  await expect(page.locator('.ruler-nav')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('giri_show_ruler'))).toBe('false');

  await page.locator('#btn-toggle-ruler').click();
  expect(await page.evaluate(() => localStorage.getItem('giri_show_ruler'))).toBe('true');

  // And it comes back on its own when the story is reopened.
  await page.locator('#btn-reader-back').click();
  await page.locator('.story-card').first().click();
  const skip = page.locator('#gate-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await expect(page.locator('.ruler-layer')).toBeAttached();
});

test('leaving the story takes the ruler with it', async ({ page }) => {
  await openStory(page);
  await turnOnRuler(page);

  // Switching mode rebuilds the story body the ruler was measuring. A ruler
  // left behind keeps a ResizeObserver on a detached node.
  await page.locator('#btn-mode-decode').click();
  await expect(page.locator('.ruler-layer')).toHaveCount(0);

  await page.locator('#btn-reader-back').click();
  await expect(page.locator('.story-card').first()).toBeVisible();
  await expect(page.locator('.ruler-layer')).toHaveCount(0);
});
