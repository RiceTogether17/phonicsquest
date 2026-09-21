/**
 * Offline readiness, in a real browser with a real service worker.
 *
 * Audit 2026-09-19, finding 22. The unit tests check the worker's decision
 * rules and the build manifest; neither can prove the thing the audit actually
 * asked about, which is whether a child at a tuition centre with no signal can
 * open an activity they have never opened before.
 *
 * The old worker cached lazy chunks on first fetch, so they could not — while
 * the indicator said "Ready offline", because the phoneme MP3s were cached.
 * Every activity is now precached from the build manifest at install.
 *
 * Serial, because a service worker is per-origin state: two of these running
 * in parallel would install over each other.
 */
import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

/** Seed a P6 learner so the primary modules are reachable from the home screen. */
async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_offline',
      name: 'Testy',
      avatar: '🦊',
      color: '#5a52e0',
      schoolLevel: 'primary',
      primaryGrade: 'P6',
      readingBand: 'fluent',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('phonicsquest_profiles', JSON.stringify([profile]));
    localStorage.setItem('phonicsquest_active_profile', profile.id);
    localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
    // Every quest open, so the test exercises the chunk fetch rather than a
    // progression gate.
    localStorage.setItem('phonicsquest_teacher_unlock', '1');
    localStorage.setItem(
      `phonicsquest_profile_${profile.id}`,
      JSON.stringify({ placementComplete: true, placementProfile: { readingBand: 'fluent' } }),
    );
  });
}

/** Wait for the worker to finish precaching everything in the manifest. */
async function waitForOfflineReady(page) {
  await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    if (!reg) throw new Error('no service worker');
  });

  // The worker broadcasts `offline-ready` when the manifest is stored. It may
  // have fired before this listener attached on a fast machine, so also poll
  // the cache for the last file the manifest lists.
  await page.waitForFunction(
    async () => {
      const manifest = await (await fetch('./sw-manifest.json', { cache: 'no-store' })).json();
      const last = manifest.precache[manifest.precache.length - 1];
      return Boolean(await caches.match(last));
    },
    null,
    { timeout: 60_000 },
  );
}

test('every built module is stored for offline use, not just the audio', async ({ page }) => {
  await seedLearner(page);
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  await waitForOfflineReady(page);

  const report = await page.evaluate(async () => {
    const manifest = await (await fetch('./sw-manifest.json', { cache: 'no-store' })).json();
    const missing = [];
    for (const url of manifest.precache) {
      if (!(await caches.match(url))) missing.push(url);
    }
    const names = await caches.keys();
    return { missing, total: manifest.precache.length, names, buildId: manifest.buildId };
  });

  expect(report.missing).toEqual([]);
  expect(report.total).toBeGreaterThan(20);

  // Cache names carry the build id, so the next build fills new caches
  // instead of reusing these — the app-upgrade scenario.
  expect(report.names.some((n) => n === `phonicsquest-assets-${report.buildId}`)).toBe(true);
});

test('an activity never opened online still opens offline', async ({ page, context }) => {
  await seedLearner(page);
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  await waitForOfflineReady(page);

  // Cut the network, then reload so the whole session — shell and chunks —
  // comes from the cache. Nothing in this session has opened Cloze Castle.
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  await page.getByRole('tab', { name: /Learn/ }).click();
  // The primary modules sit inside collapsible groups; open every ancestor.
  await page.evaluate(() => {
    let node = document.getElementById('btn-cloze-castle');
    while (node) {
      if (node.tagName === 'DETAILS') node.setAttribute('open', '');
      node = node.parentElement;
    }
  });
  const launch = page.locator('#btn-cloze-castle');
  await launch.scrollIntoViewIfNeeded();
  await launch.click();

  // The module's chunk had to come from the cache to render this.
  await expect(page.locator('.cloze-level-btn').first()).toBeVisible();
  await expect(page.locator('.cloze-cat-title')).toContainText('Cloze Castle');

  await context.setOffline(false);
});

test('cleanup removes this app’s old caches and leaves other apps alone', async ({ page }) => {
  await seedLearner(page);
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  await waitForOfflineReady(page);

  // Two caches the worker will meet on its next activate: one of ours from an
  // older build, and one belonging to a different app on the same origin —
  // the situation the audit describes for a shared `*.github.io` account.
  await page.evaluate(async () => {
    await caches.open('phonicsquest-assets-oldbuild01');
    const other = await caches.open('spellingbee-shell-v2');
    await other.put('/spellingbee/data.json', new Response('{"kept":true}'));
  });

  // Force the worker through install and activate again.
  await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    await reg?.unregister();
  });
  await page.reload();
  await waitForOfflineReady(page);

  const after = await page.evaluate(async () => ({
    names: await caches.keys(),
    otherAppData: await (await caches.open('spellingbee-shell-v2')).match('/spellingbee/data.json'),
  }));

  expect(after.names).not.toContain('phonicsquest-assets-oldbuild01');
  expect(after.names).toContain('spellingbee-shell-v2');
  expect(after.otherAppData, "another app's cached file survived").toBeTruthy();
});
