/**
 * Accessibility scan of the primary English section screens.
 *
 * Audit 2026-09-19, finding 20. The existing browser suite covered the home
 * screen and the preschool activities, so the primary sections were never
 * scanned by CI — which is why these survived:
 *
 *   - the Comprehension Cloze level picker was a `<div role="list">` whose
 *     children were bare `<button>`s, a CRITICAL aria-required-children
 *     violation;
 *   - `.placeholder-paper-link` failed WCAG AA small-text contrast on
 *     Situational Writing, Visual Text, Open-ended Comprehension and the P6
 *     practice-paper launcher. Measured on the 18%-primary tint it sits on:
 *     4.37:1 in the default theme and as low as 1.88:1 in the green one.
 *
 * Scanning the landing state of each section is the regression guard. The
 * audit is explicit that this is useful evidence rather than whole-application
 * WCAG certification: task, feedback, modal and result states in each theme
 * still need their own passes.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** Seed a returning P6 learner, so the primary pathway is on the home screen. */
async function seedPrimaryLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_e2e_primary',
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
    localStorage.setItem(
      `phonicsquest_profile_${profile.id}`,
      JSON.stringify({
        placementComplete: true,
        placementProfile: { readingBand: 'fluent' },
      }),
    );
  });
}

/**
 * Reveal a primary module button.
 *
 * The home screen defaults to the "Today" tab; the primary modules live in the
 * "Learn" panel, inside a collapsible <details> group. Both have to be opened
 * before the button exists on screen — which is also why CI had never scanned
 * these sections.
 */
async function revealSection(page, btnId) {
  await page.getByRole('tab', { name: /Learn/ }).click();
  await page.evaluate((id) => {
    document.getElementById(id)?.closest('details')?.setAttribute('open', '');
  }, btnId);
}

/** The sections the audit found violations on, by their launch button. */
const SECTIONS = [
  ['Comprehension Cloze', 'btn-comprehension-cloze'],
  ['Situational Writing', 'btn-situational-writing'],
  ['Visual Text', 'btn-visual-text'],
  ['Open-ended Comprehension', 'btn-open-comprehension'],
  ['P6 practice papers', 'btn-p6-practice-tests'],
];

for (const [label, btnId] of SECTIONS) {
  test(`${label} has no critical or serious a11y violations`, async ({ page }) => {
    await seedPrimaryLearner(page);
    await page.goto('./');
    await expect(page.locator('#screen-home')).toHaveClass(/active/);

    await revealSection(page, btnId);

    const btn = page.locator(`#${btnId}`);
    await btn.scrollIntoViewIfNeeded();
    await btn.click();

    // Wait for the section itself to paint before scanning. Comprehension
    // Cloze renders its own quest shell; the rest render a placeholder header.
    await expect(page.locator('.placeholder-header, .cc-quest__picker').first()).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    expect(blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`)).toEqual([]);
  });
}

test('the cloze level picker is a real list, not a div claiming to be one', async ({ page }) => {
  // The specific critical violation, asserted structurally as well as by axe:
  // a list that promises list items and has none leaves a screen-reader user
  // with no item count and no way to navigate it as a list.
  await seedPrimaryLearner(page);
  await page.goto('./');
  await revealSection(page, 'btn-comprehension-cloze');
  await page.locator('#btn-comprehension-cloze').click();

  const list = page.locator('.cc-quest__levels');
  await expect(list).toBeVisible();
  await expect(list).toHaveJSProperty('tagName', 'UL');

  const items = list.locator('> li');
  expect(await items.count()).toBeGreaterThan(0);
  // Every level button sits inside a list item.
  expect(await list.locator('> li > button[data-level]').count()).toBe(await items.count());
});
