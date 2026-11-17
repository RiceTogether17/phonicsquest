/**
 * A P6 paper laid out like Paper 2, sat in a real browser: every one of the
 * nine sections fits the width of a phone and a laptop, is readable in light
 * and dark, and the blanks in a passage are marked when the section is checked.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function seedPrimaryLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_e2e_paper2',
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
    localStorage.setItem(
      `phonicsquest_profile_${profile.id}`,
      JSON.stringify({
        placementComplete: true,
        placementProfile: { readingBand: 'fluent' },
        onboardingComplete: true,
      }),
    );
  });
}

async function openFirstLayoutPaper(page) {
  await seedPrimaryLearner(page);
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(700);
  if (await tour.isVisible().catch(() => false)) await page.locator('#ob-skip-btn').click();
  await page.getByRole('tab', { name: /Learn/ }).click();
  await page.evaluate(() => {
    document.getElementById('btn-p6-practice-tests')?.closest('details')?.setAttribute('open', '');
  });
  const btn = page.locator('#btn-p6-practice-tests');
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await expect(page.locator('[data-paper-id="p6-paper2-1"]')).toBeVisible();
  await page.locator('[data-start-paper="p6-paper2-1"]').click();
  await expect(page.locator('.ptg-section-title')).toContainText('Booklet A');
}

async function sidewaysOverflow(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

async function seriousProblems(page) {
  const results = await new AxeBuilder({ page })
    .include('.ptg')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  return results.violations
    .filter((v) => v.impact === 'critical' || v.impact === 'serious')
    .map(
      (v) =>
        `${v.id}: ${v.nodes.map((n) => `${n.html.slice(0, 80)} ${n.any[0]?.message || ''}`).join(' | ')}`,
    );
}

for (const size of [
  { name: 'phone', width: 375, height: 667 },
  { name: 'laptop', width: 1366, height: 768 },
]) {
  test(`all nine sections fit and can be checked on a ${size.name}`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: size.width, height: size.height });
    await openFirstLayoutPaper(page);

    const titles = [];
    for (let i = 0; i < 9; i++) {
      const title = await page.locator('.ptg-section-title').textContent();
      titles.push(title);
      expect(await sidewaysOverflow(page), title).toBeLessThanOrEqual(1);

      if (/Vocabulary Cloze/.test(title)) {
        await expect(page.locator('.ptg-tested-word')).toHaveCount(5);
        expect(await seriousProblems(page)).toEqual([]);
        await page.emulateMedia({ colorScheme: 'dark' });
        // Let the colour transitions settle; mid-fade colours are not real ones.
        await page.waitForTimeout(500);
        expect(await seriousProblems(page)).toEqual([]);
        await page.emulateMedia({ colorScheme: 'light' });
      }
      if (/Visual Text/.test(title)) {
        await expect(page.locator('.vstim')).toBeVisible();
      }
      if (/Comprehension Cloze/.test(title)) {
        const blanks = page.locator('.ptg-input--cloze');
        await expect(blanks).toHaveCount(15);
        const answer = await blanks.first().getAttribute('data-answer');
        await blanks.first().fill(answer);
        await blanks.nth(1).fill('zzz');
      }

      await page.locator('[data-action="check"]').click();

      if (/Comprehension Cloze/.test(title)) {
        await expect(page.locator('.ptg-input--right')).toHaveCount(1);
        await expect(page.locator('.ptg-input--wrong')).toHaveCount(14);
        await expect(page.locator('[data-feedback-for="sectionG/all"]')).toContainText(
          '1 / 15 blanks correct',
        );
        expect(await sidewaysOverflow(page), `${title} after marking`).toBeLessThanOrEqual(1);
        expect(await seriousProblems(page)).toEqual([]);
      }

      if (i < 8) await page.locator('[data-action="next"]').click();
    }

    expect(titles[4]).toContain('Booklet B');
    expect(titles[8]).toContain('Comprehension');
    await page.locator('[data-action="finish"]').click();
    await expect(page.locator('.ptg-summary-caveat')).toContainText('Paper 2');
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(1);
  });
}
