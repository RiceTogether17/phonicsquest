/**
 * A child who can't read yet hears what each game wants before the first
 * word plays, can ask again with "What do I do?", and is not shown the
 * reading lesson inside a listening-only game.
 */
import { test, expect } from '@playwright/test';

function seed(page) {
  return page.addInitScript(() => {
    const p = {
      id: 'p_spoken',
      name: 'Mei',
      avatar: '🦊',
      color: '#5a52e0',
      schoolLevel: 'preschool',
      primaryGrade: null,
      readingBand: 'pre-reader',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('phonicsquest_profiles', JSON.stringify([p]));
    localStorage.setItem('phonicsquest_active_profile', p.id);
    localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
    localStorage.setItem(
      `phonicsquest_profile_${p.id}`,
      JSON.stringify({
        placementComplete: true,
        placementProfile: { readingBand: p.readingBand },
        onboardingComplete: true,
      }),
    );

    // Record what the app says. Each utterance "finishes" shortly after it
    // starts, the way a real voice would.
    window.__spoken = [];
    const synth = {
      speaking: false,
      paused: false,
      pending: false,
      getVoices: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      cancel: () => {},
      pause: () => {},
      resume: () => {},
      speak(utt) {
        window.__spoken.push(utt.text);
        setTimeout(() => utt.onend?.(), 50);
      },
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  });
}

async function openFirstSound(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  await page.waitForTimeout(700);
  const tour = page.locator('#modal-onboarding');
  if (await tour.isVisible().catch(() => false)) await page.locator('#ob-skip-btn').click();
  await page.locator('#home-tab-learn').click();
  await page.locator('.mode-card[data-mode="first"]').click();
  const stage = page.locator('.bp-stage:not(.bp-stage--locked)').first();
  await expect(stage.or(page.locator('#screen-game.active'))).toBeVisible();
  if (await stage.isVisible()) await stage.click();
}

test('First Sound says what to do, then plays the game, with no reading lesson', async ({
  page,
}) => {
  await seed(page);
  await openFirstSound(page);

  await expect(page.locator('#mode-area .choice-btn').first()).toBeVisible();
  await expect(page.locator('.mini-lesson-overlay')).toHaveCount(0);

  const spoken = await page.evaluate(() => window.__spoken);
  const intro = 'Listen to the word. What sound does it start with? Tap that sound.';
  expect(spoken[0]).toBe(intro);

  await page.evaluate(() => (window.__spoken = []));
  await page.locator('#btn-hear-instruction').click();
  await expect.poll(() => page.evaluate(() => window.__spoken)).toEqual([intro]);

  await expect(page.locator('#mode-area .choice-replay')).toBeVisible();
});
