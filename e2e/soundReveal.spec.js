/**
 * First Sound reveal — target ring + articulation cue.
 *
 * These only appear after a correct answer, so they need a real round to be
 * driven end to end. The pedagogy being protected: a child who identifies a
 * sound should also learn *where* it sat in the word and *how* to say it.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const seen = {};
    ['cvc-a', 'cvc-e', 'cvc-i', 'cvc-o', 'cvc-u'].forEach((id) => {
      seen[`phonics:${id}`] = new Date().toISOString();
    });
    const profile = {
      id: 'p_reveal',
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
        lessonsSeen: seen,
      }),
    );
  });
}

/** Open First Sound and answer correctly so the reveal runs. */
async function revealFirstSound(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(900);
  if (await tour.isVisible().catch(() => false)) {
    await page.locator('#ob-skip-btn').click();
    await expect(tour).toBeHidden();
  }

  await page.locator('#home-tab-learn').click();
  await page.locator('[data-mode="first"]').click();
  await page.locator('.bp-stage:not(.bp-stage--locked)').first().click();

  // The correct option is marked in the DOM, so the round can be driven
  // deterministically rather than guessing.
  const correct = page.locator('[data-correct="true"]').first();
  await expect(correct).toBeVisible();
  await correct.click();

  await expect(page.locator('.phoneme-tile--target')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('the reveal rings the sound the round asked about', async ({ page }) => {
  await revealFirstSound(page);

  // First Sound asks for the opening phoneme, so the ring belongs on tile 1.
  const tiles = page.locator('#phoneme-row .phoneme-tile');
  await expect(tiles.first()).toHaveClass(/phoneme-tile--target/);
  await expect(page.locator('.phoneme-tile--target')).toHaveCount(1);
});

test('the ringed sound is named to assistive tech', async ({ page }) => {
  await revealFirstSound(page);

  const symbol = page.locator('.phoneme-tile--target .phoneme-symbol');
  await expect(symbol).toHaveAttribute('aria-label', /the sound you were listening for/);
});

test('an articulation cue shows how to make the sound', async ({ page }) => {
  await revealFirstSound(page);

  const cue = page.locator('#reveal-mouth-cue');
  await expect(cue).toBeVisible();
  await expect(cue.locator('svg')).toBeVisible();

  // The instruction is actionable, not phonetics jargon.
  const text = await cue.locator('.mouth-cue__text').textContent();
  expect(text).toMatch(/lips|tongue|teeth|mouth|jaw|air/i);

  // Announced once: the diagram carries the label, the text is hidden.
  await expect(cue.locator('.mouth-cue__diagram')).toHaveAttribute('role', 'img');
  await expect(cue.locator('.mouth-cue__text')).toHaveAttribute('aria-hidden', 'true');
});

test('the reveal introduces no accessibility violations', async ({ page }) => {
  await revealFirstSound(page);

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  const blocking = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`)).toEqual([]);
});
