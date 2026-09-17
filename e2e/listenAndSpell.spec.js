/**
 * Listen & Spell — the encoding mode, end to end.
 *
 * The unit tests cover the scorer and the word pool, but the thing that
 * makes this an encoding mode at all is a DOM property: the word is spoken
 * and never printed. If the shell were to leave the word in `#word-display`
 * or the phoneme row, the child would be copying, the attempt would still
 * record as spelling evidence, and `progression.js` criterion 2 would fill
 * up with numbers that mean nothing. Only a real browser can show that.
 *
 * Drives the production build, so it also proves the mode survived
 * bundling and lazy-chunk splitting.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_spell',
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
        xp: 120,
        level: 2,
        // A first encounter with a stage opens a mini-lesson overlay before
        // the round starts; these tests are about the round itself.
        lessonsSeen: Object.fromEntries(
          [
            'cvc-a',
            'cvc-e',
            'cvc-i',
            'cvc-o',
            'cvc-u',
            'ccvc-a',
            'ccvc-e',
            'ccvc-i',
            'ccvc-o',
            'ccvc-u',
            'cvcc-a',
            'cvcc-e',
            'cvcc-i',
            'cvcc-o',
            'cvcc-u',
            'digraph-sh',
            'digraph-ch',
            'digraph-th',
          ].map((id) => [`phonics:${id}`, new Date().toISOString()]),
        ),
      }),
    );
  });
}

/** Open Listen & Spell from the Learn tab and wait for the count step. */
async function openListenAndSpell(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(900);
  if (await tour.isVisible().catch(() => false)) {
    await page.locator('#ob-skip-btn').click();
    await expect(tour).toBeHidden();
  }

  await page.locator('#home-tab-learn').click();
  const card = page.locator('[data-mode="listenAndSpell"]');
  await card.scrollIntoViewIfNeeded();
  await card.click();

  // Some modes route through a stage list before the round starts.
  const stage = page.locator('.bp-stage:not(.bp-stage--locked)').first();
  if (await stage.isVisible().catch(() => false)) await stage.click();

  await expect(page.locator('#screen-game')).toHaveClass(/active/);
  await expect(page.locator('#las-counts .las-count').first()).toBeVisible();
}

/** The target word, read off the picture's accessible name. */
async function targetWord(page) {
  const label = await page
    .locator('#screen-game [aria-label^="Picture of"]')
    .first()
    .getAttribute('aria-label');
  return label
    .replace(/^Picture of\s+/, '')
    .trim()
    .toLowerCase();
}

/** Move past the count step by picking the option the mode marks correct. */
async function passCountStep(page) {
  const counts = page.locator('#las-counts .las-count');
  await counts.first().click();
  // Whatever the child picks, the mode corrects and continues — the count is
  // a scaffold, not a gate. The build step must appear either way.
  await expect(page.locator('#las-strip')).toBeVisible({ timeout: 5000 });
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('the word is spoken, never printed', async ({ page }) => {
  await openListenAndSpell(page);

  // The two places the shell would otherwise show the answer.
  await expect(page.locator('#word-display')).toBeEmpty();
  await expect(page.locator('#phoneme-row')).toBeEmpty();

  // And the word must not be sitting anywhere else on the game screen.
  const word = await targetWord(page);
  const body = await page.locator('#screen-game').innerText();
  expect(body.toLowerCase()).not.toContain(word);

  // Replay is the mode's core affordance, so it has to be reachable.
  await expect(page.locator('#las-replay')).toBeVisible();
});

test('the shell Hint button is hidden — it reveals the letters', async ({ page }) => {
  await openListenAndSpell(page);
  await expect(page.locator('#btn-hint')).toBeHidden();
});

test('counting comes before spelling, and a miss does not block', async ({ page }) => {
  await openListenAndSpell(page);

  const counts = page.locator('#las-counts .las-count');
  expect(await counts.count()).toBeGreaterThanOrEqual(3);
  await counts.first().click();

  // The correct count is marked whether the child got it or not — the count
  // is a scaffold, so a miss is corrected rather than penalised. Asserted
  // before the build step replaces the chips.
  await expect(page.locator('.las-count--target')).toHaveCount(1);

  // The correction survives the transition, because it lives outside the
  // stage that gets replaced — the child reads it while spelling.
  await expect(page.locator('#las-feedback')).toContainText(/sounds/i);

  await expect(page.locator('#las-strip')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#las-bank .las-tile').first()).toBeVisible();
});

test('tiles build a spelling, and undo takes one back', async ({ page }) => {
  await openListenAndSpell(page);
  await passCountStep(page);

  await expect(page.locator('.las-strip-empty')).toBeVisible();
  await expect(page.locator('#las-check')).toBeDisabled();

  const tiles = page.locator('#las-bank .las-tile');
  await tiles.first().click();
  await expect(page.locator('#las-strip .las-cell')).toHaveCount(1);
  await expect(page.locator('#las-check')).toBeEnabled();

  await tiles.nth(1).click();
  await expect(page.locator('#las-strip .las-cell')).toHaveCount(2);

  await page.locator('#las-undo').click();
  await expect(page.locator('#las-strip .las-cell')).toHaveCount(1);
});

test('the bank never contains the word itself — the child selects and orders', async ({ page }) => {
  await openListenAndSpell(page);
  const word = await targetWord(page);
  await passCountStep(page);

  const labels = await page.locator('#las-bank .las-tile').allTextContents();
  expect(labels.length).toBeGreaterThan(1);
  for (const label of labels) {
    expect(label.trim().toLowerCase()).not.toBe(word);
  }
});

test('spelling the word correctly is accepted and offers the next word', async ({ page }) => {
  await openListenAndSpell(page);
  const word = await targetWord(page);
  await passCountStep(page);

  // Reconstruct the spelling from the bank: longest tile that still matches
  // the front of what is left. Digraphs win over their first letter, which
  // is how the child is meant to read the bank too.
  const tiles = await page.locator('#las-bank .las-tile').allTextContents();
  const bank = tiles.map((t) => t.trim().toLowerCase());
  let rest = word;
  const taps = [];
  while (rest.length) {
    const match = bank.filter((g) => rest.startsWith(g)).sort((a, b) => b.length - a.length)[0];
    if (!match) break;
    taps.push(match);
    rest = rest.slice(match.length);
  }
  expect(rest, `could not build "${word}" from [${bank.join(', ')}]`).toBe('');

  for (const g of taps) {
    await page.locator(`#las-bank .las-tile[data-grapheme="${g}"]`).first().click();
  }
  await page.locator('#las-check').click();

  await expect(page.locator('.las-feedback--yes')).toContainText(word);
  await expect(page.locator('.vmcq-next-btn')).toBeVisible();
});

test('a wrong spelling coaches once before revealing', async ({ page }) => {
  await openListenAndSpell(page);
  await passCountStep(page);

  // One tile is never a whole word in this bank, so this is reliably wrong.
  await page.locator('#las-bank .las-tile').first().click();
  await page.locator('#las-check').click();

  // First check: a hint, and the child's letters stay put so the fix is an edit.
  await expect(page.locator('.las-feedback--coach')).toBeVisible();
  await expect(page.locator('.vmcq-next-btn')).toHaveCount(0);
  await expect(page.locator('#las-strip .las-cell')).toHaveCount(1);

  // Second check: reveal.
  await page.locator('#las-check').click();
  const word = await targetWord(page);
  await expect(page.locator('.las-reveal-word')).toHaveText(word);
  await expect(page.locator('.vmcq-next-btn')).toBeVisible();
});

test('Listen & Spell has no critical or serious a11y violations', async ({ page }) => {
  await openListenAndSpell(page);
  await passCountStep(page);

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`)).toEqual([]);
});
