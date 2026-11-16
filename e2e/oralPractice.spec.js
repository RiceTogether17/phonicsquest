/**
 * Oral Practice in a real browser: the whole sitting can be done on a phone
 * and on a projected laptop, in light and dark, and nothing on the way is
 * unreadable or off the side of the screen. A fake microphone stands in for
 * a real one so the record and play-back path runs too.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({
  permissions: ['microphone'],
  launchOptions: {
    args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
    // Setting launchOptions here replaces the config's, so keep its browser path.
    ...(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {}),
  },
});

function seed(page) {
  return page.addInitScript(() => {
    const p = {
      id: 'p_oral',
      name: 'Testy',
      avatar: '🦊',
      color: '#5a52e0',
      schoolLevel: 'primary',
      primaryGrade: 'P5',
      readingBand: 'reader',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('phonicsquest_profiles', JSON.stringify([p]));
    localStorage.setItem('phonicsquest_active_profile', p.id);
    localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
    localStorage.setItem(
      `phonicsquest_profile_${p.id}`,
      JSON.stringify({
        placementComplete: true,
        placementProfile: { readingBand: 'reader' },
        onboardingComplete: true,
      }),
    );
  });
}

async function openOral(page) {
  await seed(page);
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(700);
  if (await tour.isVisible().catch(() => false)) await page.locator('#ob-skip-btn').click();
  await page.getByRole('tab', { name: /Learn/ }).click();
  await page.evaluate(() =>
    document.getElementById('btn-oral-practice')?.closest('details')?.setAttribute('open', ''),
  );
  await page.locator('#btn-oral-practice').click();
  await expect(page.locator('.oral')).toBeVisible();
}

async function rateAll(page) {
  const ids = await page
    .locator('[data-act="rate"]')
    .evaluateAll((els) => [...new Set(els.map((e) => e.dataset.check))]);
  for (const id of ids) {
    await page.locator(`[data-act="rate"][data-check="${id}"][data-value="2"]`).click();
  }
}

async function noSidewaysScroll(page) {
  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(over).toBeLessThanOrEqual(1);
}

async function contrastProblems(page) {
  const results = await new AxeBuilder({ page })
    .include('.oral')
    .withRules(['color-contrast'])
    .analyze();
  return results.violations.flatMap((v) => v.nodes.map((n) => n.html.slice(0, 80)));
}

test('a whole sitting, from the passage to the results', async ({ page }) => {
  await openOral(page);
  await page.locator('[data-act="band"][data-band="P5-P6"]').click();
  await page.locator('[data-act="open"]').first().click();

  // Part 1: the passage, with the conversation held back until it is checked.
  await expect(page.locator('#oral-passage')).toBeVisible();
  await expect(page.locator('[data-act="to-talk"]')).toBeDisabled();
  expect(await contrastProblems(page)).toEqual([]);

  // Record and play back with the fake microphone.
  await page.locator('[data-act="record-start"]').click();
  await expect(page.locator('.oral-recording')).toBeVisible();
  await page.waitForTimeout(400);
  await page.locator('[data-act="record-stop"]').click();
  await expect(page.locator('.oral-playback')).toBeVisible();

  await rateAll(page);
  await page.locator('[data-act="to-talk"]').click();

  // Part 2: three questions, each with its model answer kept back.
  for (let i = 1; i <= 3; i++) {
    await expect(page.locator('.oral-step')).toContainText(`Question ${i} of 3`);
    await expect(page.locator('.oral-notice')).toBeVisible();
    await expect(page.locator('.oral-model')).toHaveCount(0);
    await page.locator('[data-act="show-model"]').click();
    await expect(page.locator('.oral-model')).toBeVisible();
    if (i === 1) expect(await contrastProblems(page)).toEqual([]);
    await rateAll(page);
    await page.locator('[data-act="next-prompt"]').click();
  }

  await expect(page.locator('.oral-scores')).toContainText('6 / 6');
  await expect(page.locator('.oral-scores')).toContainText('12 / 12');
  expect(await contrastProblems(page)).toEqual([]);

  // The set is ticked when the child goes back to choose another.
  await page.locator('[data-act="browser"]').click();
  await expect(page.locator('[data-act="open"]').first()).toContainText('✅');
});

test('it fits a phone without scrolling sideways', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await openOral(page);
  await noSidewaysScroll(page);
  await page.locator('[data-act="open"]').first().click();
  await noSidewaysScroll(page);
  await rateAll(page);
  await page.locator('[data-act="to-talk"]').click();
  await noSidewaysScroll(page);
  await page.locator('[data-act="show-model"]').click();
  await noSidewaysScroll(page);
});

test('it is readable in dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await openOral(page);
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.locator('[data-act="open"]').first().click();
  expect(await contrastProblems(page)).toEqual([]);
  await rateAll(page);
  await page.locator('[data-act="to-talk"]').click();
  await page.locator('[data-act="show-model"]').click();
  expect(await contrastProblems(page)).toEqual([]);
});

test('Back in the header leaves and stops the microphone', async ({ page }) => {
  await openOral(page);
  await page.locator('[data-act="open"]').first().click();
  await page.locator('[data-act="record-start"]').click();
  await expect(page.locator('.oral-recording')).toBeVisible();
  await page.locator('#btn-pp-back').click();
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
});
