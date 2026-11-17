/**
 * The parent screen in a real browser: each thing to work on comes with
 * something to try at home, a child with nothing listed still gets one tip,
 * and the panel fits a phone and is readable in light and dark.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function seed(page, { withSlips }) {
  return page.addInitScript((slips) => {
    const p = {
      id: 'p_tonight',
      name: 'Mei',
      avatar: '🦊',
      color: '#5a52e0',
      schoolLevel: 'preschool',
      readingBand: 'emerging-decoder',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('phonicsquest_profiles', JSON.stringify([p]));
    localStorage.setItem('phonicsquest_active_profile', p.id);
    localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
    const now = new Date().toISOString();
    localStorage.setItem(
      `phonicsquest_profile_${p.id}`,
      JSON.stringify({
        placementComplete: true,
        onboardingComplete: true,
        placementProfile: { readingBand: 'emerging-decoder' },
        soundConfusions: slips
          ? {
              '/a/ /e/': { sounds: ['/a/', '/e/'], count: 4, words: ['pen', 'bed'], lastSeen: now },
            }
          : {},
        oralCompleted: slips ? { one: { at: now, nextStep: 'pace' } } : {},
      }),
    );
  }, withSlips);
}

async function openDashboard(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(900);
  if (await tour.isVisible().catch(() => false)) await page.locator('#ob-skip-btn').click();
  await page.locator('#dashboard-btn').click();
  const pinModal = page.locator('#modal-pin');
  await expect(pinModal).toBeVisible();
  const digits = pinModal.locator('.pin-digit');
  const count = await digits.count();
  for (let i = 0; i < count; i++) await digits.nth(i).fill(String(i + 1));
  await pinModal.locator('#pin-confirm-btn').click();
  await expect(page.locator('#modal-dashboard')).toBeVisible();
  await expect(page.locator('#dash-weak-spots > section')).toBeVisible({ timeout: 15_000 });
}

async function contrastProblems(page) {
  const results = await new AxeBuilder({ page })
    .include('#dash-weak-spots')
    .withRules(['color-contrast'])
    .analyze();
  return results.violations.flatMap((v) => v.nodes.map((n) => n.html.slice(0, 80)));
}

/** Nothing in the panel is wider than the panel, and the page does not scroll sideways. */
async function fitsItsWidth(page) {
  const over = await page.evaluate(() => {
    const box = document.getElementById('dash-weak-spots');
    const right = box.getBoundingClientRect().right;
    const spill = [...box.querySelectorAll('*')].filter(
      (el) => el.getBoundingClientRect().right > right + 1,
    ).length;
    return {
      spill,
      page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(over.spill).toBe(0);
  expect(over.page).toBeLessThanOrEqual(1);
}

for (const size of [
  { name: 'phone', width: 375, height: 667 },
  { name: 'laptop', width: 1366, height: 768 },
]) {
  test(`each thing to work on has a home activity on a ${size.name}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await seed(page, { withSlips: true });
    await openDashboard(page);

    const tips = page.locator('#dash-weak-spots .weak-spot__tonight');
    await expect(tips).toHaveCount(2);
    await expect(tips.first()).toContainText('Try this tonight:');
    await expect(tips.first()).toContainText('"pen" and "bed"');
    await expect(tips.nth(1)).toContainText('comma and full stop');
    await fitsItsWidth(page);
    expect(await contrastProblems(page)).toEqual([]);
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);
    expect(await contrastProblems(page)).toEqual([]);
  });
}

test('a child with nothing listed still gets one thing to try', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await seed(page, { withSlips: false });
  await openDashboard(page);
  const panel = page.locator('#dash-weak-spots');
  await expect(panel.getByRole('heading', { name: /Try this tonight/ })).toBeVisible();
  await expect(panel).toContainText('taking turns line by line');
  await expect(panel.locator('.weak-spot')).toHaveCount(0);
  await fitsItsWidth(page);
  expect(await contrastProblems(page)).toEqual([]);
});
