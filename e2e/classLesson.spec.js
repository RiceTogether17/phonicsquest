/**
 * Class Lesson in a real browser: the card and its controls fit on a
 * projected laptop and on a phone without scrolling the page, one key runs
 * the lesson, the text is readable in light and dark, and nothing a class
 * does is written to the child's saved progress.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PROFILE_KEY = 'phonicsquest_profile_p_class';

function seed(page) {
  return page.addInitScript(() => {
    const p = {
      id: 'p_class',
      name: 'Testy',
      avatar: '🦊',
      color: '#5a52e0',
      schoolLevel: 'primary',
      primaryGrade: 'P3',
      readingBand: 'reader',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('phonicsquest_profiles', JSON.stringify([p]));
    localStorage.setItem('phonicsquest_active_profile', p.id);
    localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
    if (!localStorage.getItem(`phonicsquest_profile_${p.id}`)) {
      localStorage.setItem(
        `phonicsquest_profile_${p.id}`,
        JSON.stringify({
          placementComplete: true,
          placementProfile: { readingBand: 'reader' },
          onboardingComplete: true,
        }),
      );
    }
  });
}

async function openClassLesson(page) {
  await seed(page);
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(700);
  if (await tour.isVisible().catch(() => false)) await page.locator('#ob-skip-btn').click();
  await page.getByRole('tab', { name: /Learn/ }).click();
  await page.locator('#btn-class-lesson').click();
  await expect(page.locator('.class-lesson-browser')).toBeVisible();
}

/** The Next button and the card are both wholly inside the window. */
async function fitsTheWindow(page) {
  const box = await page.evaluate(() => {
    const r = (sel) => document.querySelector(sel)?.getBoundingClientRect();
    const next = r('[data-cl="next"]');
    const body = document.querySelector('.class-lesson-body');
    return {
      vw: window.innerWidth,
      vh: window.innerHeight,
      nextBottom: next?.bottom ?? 0,
      nextRight: next?.right ?? 0,
      nextTop: next?.top ?? -1,
      bodyOverflowX: body ? body.scrollWidth - body.clientWidth : 0,
      pageOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(box.nextTop).toBeGreaterThanOrEqual(0);
  expect(box.nextBottom).toBeLessThanOrEqual(box.vh + 1);
  expect(box.nextRight).toBeLessThanOrEqual(box.vw + 1);
  expect(box.bodyOverflowX).toBeLessThanOrEqual(1);
  expect(box.pageOverflowX).toBeLessThanOrEqual(1);
}

async function contrastProblems(page) {
  const results = await new AxeBuilder({ page })
    .include('.class-lesson-stage')
    .withRules(['color-contrast'])
    .analyze();
  return results.violations.flatMap((v) => v.nodes.map((n) => n.html.slice(0, 80)));
}

for (const size of [
  { name: 'projected laptop', width: 1366, height: 768 },
  { name: 'phone', width: 375, height: 667 },
]) {
  test(`a sentence deck runs from the keyboard on a ${size.name}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await openClassLesson(page);
    const before = await page.evaluate((k) => localStorage.getItem(k), PROFILE_KEY);

    await page.locator('[data-kind="sentences"]').click();
    await page.locator('[data-key="short-a"]').click();
    await expect(page.locator('.class-lesson-big')).toHaveText('Sam sat on a mat.');
    await fitsTheWindow(page);

    await page.keyboard.press('Space');
    await expect(page.locator('.class-lesson-prompt')).toHaveText('Who sat?');
    await expect(page.locator('.class-lesson-answer')).toHaveCount(0);
    await page.keyboard.press('Space');
    await expect(page.locator('.class-lesson-answer')).toHaveText('Sam');
    await fitsTheWindow(page);
    expect(await contrastProblems(page)).toEqual([]);
    await page.emulateMedia({ colorScheme: 'dark' });
    expect(await contrastProblems(page)).toEqual([]);
    await page.emulateMedia({ colorScheme: 'light' });

    // A presenter clicker sends Page Down / Page Up.
    await page.keyboard.press('PageDown');
    await expect(page.locator('.class-lesson-prompt')).toHaveText('Where did Sam sit?');
    await page.keyboard.press('PageUp');
    await expect(page.locator('.class-lesson-prompt')).toHaveText('Who sat?');

    await page.keyboard.press('Escape');
    await expect(page.locator('.class-lesson-stage')).toHaveCount(0);
    await expect(page.locator('[data-key="short-a"]')).toBeVisible();

    const after = await page.evaluate((k) => localStorage.getItem(k), PROFILE_KEY);
    expect(after).toBe(before);
  });

  test(`a grammar question fits and marks the answer on a ${size.name}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.emulateMedia({ colorScheme: 'dark' });
    await openClassLesson(page);
    await page.locator('[data-kind="grammar"]').click();
    await page.locator('[data-level="P3"]').click();
    await page.locator('.class-lesson-chip--mixed').click();
    await expect(page.locator('.class-lesson-option').first()).toBeVisible();
    await fitsTheWindow(page);

    await page.keyboard.press('a');
    await expect(page.locator('.class-lesson-option[aria-pressed="true"]')).toHaveCount(1);
    expect(await contrastProblems(page)).toEqual([]);
    await page.keyboard.press('Space');
    await expect(page.locator('.class-lesson-option.is-right')).toHaveCount(1);
    await fitsTheWindow(page);
    expect(await contrastProblems(page)).toEqual([]);
  });
}

test('a comprehension passage can be brought back while a question is up', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await openClassLesson(page);
  await page.locator('[data-kind="comprehension"]').click();
  await page.locator('[data-level="P3"]').click();
  await page.locator('[data-cl="deck"]').first().click();
  await expect(page.locator('.class-lesson-passage')).toBeVisible();
  await fitsTheWindow(page);
  await page.keyboard.press('Space');
  await expect(page.locator('.class-lesson-prompt')).toBeVisible();
  await expect(page.locator('.class-lesson-passage')).toHaveCount(0);
  await page.keyboard.press('p');
  await expect(page.locator('.class-lesson-passage')).toBeVisible();
  await page.keyboard.press('p');
  await page.keyboard.press('Space');
  await expect(page.locator('.class-lesson-answer')).toBeVisible();
  await fitsTheWindow(page);
});
