/**
 * Class snapshot, end to end.
 *
 * Two things only a browser can show:
 *
 *   1. It is reachable — inside the PIN-gated dashboard, which is where it
 *      belongs, because it names other children and what they cannot yet do.
 *   2. Reading four siblings' progress leaves the ACTIVE profile untouched.
 *      `store` is bound to one profile at a time, so a "switch, read, switch
 *      back" implementation would corrupt the live session, and the unit
 *      test can only prove it for the module in isolation.
 */
import { test, expect } from '@playwright/test';

/** Three children on one device, two of whom share a weak stage. */
async function seedClass(page) {
  await page.addInitScript(() => {
    const kids = [
      { id: 'k1', name: 'Ana', mastery: { 'cvc-a': 0.3, 'cvc-e': 0.95 } },
      { id: 'k2', name: 'Bo', mastery: { 'cvc-a': 0.45, 'cvc-e': 0.9 } },
      { id: 'k3', name: 'Cal', mastery: { 'cvc-e': 0.92 } },
    ];
    localStorage.setItem(
      'phonicsquest_profiles',
      JSON.stringify(
        kids.map((k) => ({
          id: k.id,
          name: k.name,
          avatar: '🦊',
          color: '#f97316',
          schoolLevel: 'preschool',
          readingBand: 'emerging-decoder',
          createdAt: new Date().toISOString(),
        })),
      ),
    );
    for (const k of kids) {
      localStorage.setItem(
        `phonicsquest_profile_${k.id}`,
        JSON.stringify({
          placementComplete: true,
          onboardingComplete: true,
          placementProfile: { readingBand: 'emerging-decoder' },
          groupMastery: k.mastery,
          xp: 100,
          level: 2,
        }),
      );
    }
    localStorage.setItem('phonicsquest_active_profile', 'k1');
    localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
  });
}

/** Open the PIN-gated dashboard. A device with no PIN set lets you straight in. */
async function openDashboard(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(900);
  if (await tour.isVisible().catch(() => false)) {
    await page.locator('#ob-skip-btn').click();
    await expect(tour).toBeHidden();
  }

  await page.locator('#dashboard-btn').click();

  // The gate is a 4-digit parent PIN; on a device that has none, the digits
  // typed here become it. That gate is the point — the snapshot names other
  // children, so it must not sit anywhere a child can reach.
  const pinModal = page.locator('#modal-pin');
  await expect(pinModal).toBeVisible();
  const digits = pinModal.locator('.pin-digit');
  const count = await digits.count();
  for (let i = 0; i < count; i++) await digits.nth(i).fill(String(i + 1));
  await pinModal.locator('#pin-confirm-btn').click();

  await expect(page.locator('#dash-class-snapshot')).toBeAttached({ timeout: 15_000 });
}

test.beforeEach(async ({ page }) => {
  await seedClass(page);
});

test('groups the two children who share a weak stage, and not the third', async ({ page }) => {
  await openDashboard(page);

  const section = page.locator('.cs-section');
  await expect(section).toBeVisible();

  const card = page.locator('.cs-card').first();
  await expect(card).toBeVisible();
  // Ana and Bo both sit under 60% on cvc-a; Cal has never practised it, and
  // "not there yet" is not the same difficulty as "practised and stuck".
  const names = await card.locator('.cs-child').allTextContents();
  expect(names.join(' ')).toContain('Ana');
  expect(names.join(' ')).toContain('Bo');
  expect(names.join(' ')).not.toContain('Cal');
});

test('reading the other children does not move the active profile', async ({ page }) => {
  await openDashboard(page);
  await expect(page.locator('.cs-card').first()).toBeVisible();

  const active = await page.evaluate(() => localStorage.getItem('phonicsquest_active_profile'));
  expect(active).toBe('k1');

  // And no sibling's saved progress was rewritten on the way past.
  const bo = await page.evaluate(() => localStorage.getItem('phonicsquest_profile_k2'));
  expect(JSON.parse(bo).groupMastery['cvc-a']).toBe(0.45);
});

test('offers the lesson as a one-tap action', async ({ page }) => {
  await openDashboard(page);
  const action = page.locator('.cs-action').first();
  await expect(action).toBeVisible();
  await expect(action).toHaveAttribute('data-group', /.+/);
});
