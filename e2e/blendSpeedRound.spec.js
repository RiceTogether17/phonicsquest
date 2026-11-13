/**
 * Blend It speed round — for a teacher leading a class from one screen.
 *
 * The step-by-step round costs a press per sound, a self-check and a word to
 * choose. The speed round shows the whole word and moves on with one press.
 * These checks drive the production build because the behaviour that matters
 * (one press, keyboard, nothing left to scroll to) only exists in the page.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_speed',
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
        // Mark every phonics stage lesson as seen. A first encounter opens a
        // mini-lesson overlay before the round starts, and these tests are
        // about the in-round visuals, not the lesson gate.
        lessonsSeen: Object.fromEntries(
          [
            'cvc-a',
            'cvc-e',
            'cvc-i',
            'cvc-o',
            'cvc-u',
            'ccvc-a',
            'ccvc-e',
            'ccvc-i',
            'ccvc-o',
            'ccvc-u',
            'cvcc-a',
            'cvcc-e',
            'cvcc-i',
            'cvcc-o',
            'cvcc-u',
            'digraph-sh',
            'digraph-ch',
            'digraph-th',
          ].map((id) => [`phonics:${id}`, new Date().toISOString()]),
        ),
      }),
    );
  });
}

async function openBlendIt(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(900);
  if (await tour.isVisible().catch(() => false)) {
    await page.locator('#ob-skip-btn').click();
    await expect(tour).toBeHidden();
  }
  await page.locator('#home-tab-learn').click();
  const card = page.locator('[data-mode="blend"]');
  await card.scrollIntoViewIfNeeded();
  await card.click();
  const stage = page.locator('.bp-stage:not(.bp-stage--locked)').first();
  if (await stage.isVisible().catch(() => false)) await stage.click();
  await expect(page.locator('#screen-game')).toHaveClass(/active/);
  await expect(page.locator('#btn-reveal-next')).toBeVisible();
}

/** The shell's running count of words shown this session ("Word 3"). */
const wordCount = (page) => page.locator('#game-progress-count').textContent();

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('the speed round shows the whole word and one press brings the next', async ({ page }) => {
  await openBlendIt(page);
  await page.locator('[data-blend-speed]').click();

  const next = page.locator('#btn-speed-next');
  await expect(next).toBeVisible();
  await expect(page.locator('#btn-reveal-next')).toHaveCount(0);
  await expect(page.locator('#phoneme-row .phoneme-tile').first()).toBeVisible();

  const first = await wordCount(page);
  await next.click();
  await expect(page.locator('#btn-speed-next')).toBeVisible();
  await expect.poll(() => wordCount(page)).not.toBe(first);

  // No self-check and no word to choose after a speed-round word.
  await expect(page.locator('#btn-self-yes')).toHaveCount(0);
  await expect(page.locator('.blend-confirm, #blend-confirm')).toHaveCount(0);
});

test('Space and the right arrow move on without touching the mouse', async ({ page }) => {
  await openBlendIt(page);
  await page.locator('[data-blend-speed]').click();
  await expect(page.locator('#btn-speed-next')).toBeFocused();

  const first = await wordCount(page);
  await page.keyboard.press('Space');
  await expect.poll(() => wordCount(page)).not.toBe(first);
  await expect(page.locator('#btn-speed-next')).toBeFocused();

  const second = await wordCount(page);
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => wordCount(page)).not.toBe(second);
});

test('the choice is remembered, and step by step is one press away', async ({ page }) => {
  await openBlendIt(page);
  await page.locator('[data-blend-speed]').click();
  await page.locator('#btn-speed-next').click();
  await expect(page.locator('#btn-speed-next')).toBeVisible();

  await page.locator('[data-blend-style="simultaneous"]').click();
  await expect(page.locator('#btn-reveal-next')).toBeVisible();
  await expect(page.locator('#btn-speed-next')).toHaveCount(0);
});

test('both speed-round buttons fit on a phone screen without scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await openBlendIt(page);
  await page.locator('[data-blend-speed]').click();
  for (const id of ['#btn-speed-next', '#btn-speed-sounds']) {
    await expect(page.locator(id)).toBeInViewport({ ratio: 1 });
  }
});

test('the speed round has no critical or serious a11y violations', async ({ page }) => {
  await openBlendIt(page);
  await page.locator('[data-blend-speed]').click();
  await expect(page.locator('#btn-speed-next')).toBeVisible();
  const results = await new AxeBuilder({ page }).include('#screen-game').analyze();
  const bad = results.violations.filter((v) => ['critical', 'serious'].includes(v.impact));
  expect(bad.map((v) => `${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
});

test('switching on while a sound is playing does not get undone', async ({ page }) => {
  await openBlendIt(page);
  // Start a reveal, then switch while its sound is still playing.
  await page.locator('#btn-reveal-next').click();
  await page.locator('[data-blend-speed]').click();
  await expect(page.locator('#btn-speed-next')).toBeVisible();
  await page.waitForTimeout(3000);
  await expect(page.locator('#btn-speed-next')).toBeVisible();
  await expect(page.locator('#btn-reveal-next')).toHaveCount(0);
});
