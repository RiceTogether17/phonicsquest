/**
 * Segment It — Elkonin sound boxes + Giri word card.
 *
 * These visuals only exist once a real word is loaded and the mode has
 * rendered, which is exactly what unit tests can't reach. This drives the
 * production build: open Segment It, confirm the sound track and Giri card
 * appear, and confirm the new SVG-free markup introduces no accessibility
 * violation on the game screen.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_boxes',
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

/** Open Segment It from the Learn tab. */
async function openSegmentIt(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(900);
  if (await tour.isVisible().catch(() => false)) {
    await page.locator('#ob-skip-btn').click();
    await expect(tour).toBeHidden();
  }

  await page.locator('#home-tab-learn').click();
  const card = page.locator('[data-mode="segment"]');
  await card.scrollIntoViewIfNeeded();
  await card.click();

  // Segment It is a picker mode: choosing it opens the stage list, so pick
  // the first unlocked stage to actually reach the game.
  const stage = page.locator('.bp-stage:not(.bp-stage--locked)').first();
  await expect(stage).toBeVisible();
  await stage.click();

  await expect(page.locator('#screen-game')).toHaveClass(/active/);
  await expect(page.locator('#segment-sound-boxes .sound-box').first()).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('sound boxes render one box per sound, all empty to start', async ({ page }) => {
  await openSegmentIt(page);

  const boxes = page.locator('#segment-sound-boxes .sound-box');
  const count = await boxes.count();
  expect(count).toBeGreaterThanOrEqual(2);

  // The track must not give the answer away before the child works.
  const states = await boxes.evaluateAll((els) => els.map((e) => e.dataset.state));
  expect(states.filter((s) => s === 'filled' || s === 'correct')).toHaveLength(0);
  expect(states).toContain('active');
});

test('the sound track is described to assistive tech', async ({ page }) => {
  await openSegmentIt(page);

  const host = page.locator('#segment-sound-boxes');
  await expect(host).toHaveAttribute('role', 'list');
  await expect(host).toHaveAttribute('aria-label', /Sound boxes: \d+ sounds?, 0 filled/);

  // Each box carries its own position/state label, so state is never
  // communicated by colour alone.
  const firstLabel = await page
    .locator('#segment-sound-boxes .sound-box')
    .first()
    .getAttribute('aria-label');
  expect(firstLabel).toMatch(/^Sound 1 of \d+:/);
});

test('Giri presents the word with its picture', async ({ page }) => {
  await openSegmentIt(page);

  const card = page.locator('#segment-giri-card');
  await expect(card).toHaveAttribute('data-pose', 'think');

  // The picture is the accessible subject; Giri is decorative.
  const picture = card.locator('.giri-word-card__picture');
  await expect(picture).toHaveAttribute('role', 'img');
  await expect(picture).toHaveAttribute('aria-label', /^Picture of \w+/);
  await expect(card.locator('.giri-word-card__giri')).toHaveAttribute('aria-hidden', 'true');
});

test('the word picture is shown exactly once', async ({ page }) => {
  await openSegmentIt(page);

  // The shared #word-emoji is hidden in this mode so the Giri card owns the
  // picture — otherwise the same emoji would appear twice on screen, and a
  // screen reader would announce "Picture of cat" twice.
  const pictures = page.locator('#screen-game [aria-label^="Picture of"]:visible');
  await expect(pictures).toHaveCount(1);
  await expect(page.locator('#word-image-wrap')).toBeHidden();
});

test('boxes fill as the child groups letters', async ({ page }) => {
  await openSegmentIt(page);

  // Tap the first letter — for a CVC word that alone is the first grapheme,
  // which auto-submits and should fill box 1.
  await page.locator('#segment-letters .segment-btn').first().click();
  await page.waitForTimeout(600);

  const firstBox = page.locator('#segment-sound-boxes .sound-box').first();
  const state = await firstBox.getAttribute('data-state');
  expect(['filled', 'correct']).toContain(state);
  await expect(page.locator('#segment-sound-boxes')).toHaveAttribute('aria-label', /1 filled/);
});

test('Segment It has no critical or serious a11y violations', async ({ page }) => {
  await openSegmentIt(page);

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  const blocking = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`)).toEqual([]);
});
