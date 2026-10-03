/**
 * Sentence Stars, end to end: open it from the Sight Words browser, read a
 * sentence, pick a wrong picture (no star, a clue), then the right one (a
 * star), and check the screen passes axe, in both colour schemes.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SHOTS = process.env.SS_SHOTS; // optional folder for review screenshots

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const p = {
      id: 'p_ss',
      name: 'Sam',
      avatar: '🦊',
      color: '#5a52e0',
      schoolLevel: 'preschool',
      primaryGrade: null,
      readingBand: 'emerging-decoder',
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
  });
});

async function openSentenceStars(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  await page.waitForTimeout(700);
  const tour = page.locator('#modal-onboarding');
  if (await tour.isVisible().catch(() => false)) await page.locator('#ob-skip-btn').click();
  await page.locator('#home-tab-learn').click();
  await page.locator('#btn-sight-words').click();
  await page.locator('.sm-quest-action--sentences[data-quest="e1"]').click();
  await expect(page.locator('.sst-intro-word')).toHaveText('a');
}

for (const scheme of ['light', 'dark']) {
  test(`read a sentence and earn a star (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await openSentenceStars(page);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/intro-${scheme}.png` });
    // The heart-marked letter on the star word must be readable too.
    const intro = await new AxeBuilder({ page })
      .include('.sst-intro')
      .withRules(['color-contrast'])
      .analyze();
    expect(intro.violations.flatMap((v) => v.nodes.map((n) => n.target))).toEqual([]);

    await page.locator('#sst-btn-go').click();
    const sentence = (await page.locator('#sst-sentence').innerText()).replace(/\s+/g, ' ').trim();
    const pics = page.locator('.sst-pic');
    await expect(pics).toHaveCount(3);
    const labels = await pics.evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')));
    const right = labels.findIndex((l) => l.endsWith(sentence.replace(/[.?!]$/, '')));
    const wrong = right === 0 ? 1 : 0;
    expect(right).toBeGreaterThanOrEqual(0);

    await pics.nth(wrong).click();
    await expect(page.locator('.sst-word--hint').first()).toBeVisible();
    await expect(page.locator('.sst-star--on')).toHaveCount(0);
    // The highlighted clue words must stay readable in both schemes.
    await page.waitForTimeout(2000); // let the hint bounce finish
    const hint = await new AxeBuilder({ page })
      .include('#sst-sentence')
      .withRules(['color-contrast'])
      .analyze();
    expect(hint.violations.flatMap((v) => v.nodes.map((n) => n.target))).toEqual([]);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/miss-${scheme}.png` });

    await pics.nth(right).click();
    await expect(page.locator('.sst-star--on')).toHaveCount(1);
    await expect(page.locator('#sst-btn-next')).toBeVisible();
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/star-${scheme}.png` });

    const r = await new AxeBuilder({ page }).include('#sst-game').analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual(
      [],
    );
  });
}

test('fits a phone screen without sideways scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await openSentenceStars(page);
  await page.locator('#sst-btn-go').click();
  await page.locator('.sst-pic').first().click(); // may be right or wrong
  await page.waitForTimeout(600);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/phone.png`, fullPage: true });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
