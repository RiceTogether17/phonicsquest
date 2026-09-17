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
  //
  // Matched on word boundaries, not as a substring: the prompt reads "How
  // MANy sounds?" and `man` is a short-a word, so a substring check fails
  // whenever the round happens to pick it — intermittently, and for a reason
  // that has nothing to do with the word being leaked.
  const word = await targetWord(page);
  const body = await page.locator('#screen-game').innerText();
  expect(body.toLowerCase()).not.toMatch(new RegExp(`\\b${word}\\b`));

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

/**
 * The daily lesson is where a child actually goes. Every step of every plan
 * used to be reading, so spelling now alternates into the first step — same
 * weak group, read it one day and spell it the next, without the session
 * getting longer. Clock is fixed rather than mocked wholesale: the app leans
 * on timers, and only `Date.now()` decides which half of the pair is due.
 */
test.describe("today's lesson alternates reading and spelling", () => {
  const SPELLING_DAY = new Date('2026-01-02T09:00:00Z');
  const READING_DAY = new Date('2026-01-03T09:00:00Z');

  /**
   * Put the child on the BLENDING journey step. Earlier steps get a listening
   * or letter-sound warm-up and never consult the daily plan at all, which is
   * correct — a child who has not learned letters is not asked to spell — but
   * it means the alternation only shows up once those steps are complete.
   */
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const raw = localStorage.getItem('phonicsquest_profile_p_spell');
      const state = raw ? JSON.parse(raw) : {};
      state.placementProfile = {
        readingBand: 'emerging-decoder',
        stageScores: {
          phonemicAwareness: { composite: 1 },
          letterSounds: { composite: 1 },
        },
      };
      // One weak group so the plan has something to name, and so the reading
      // and spelling days can be compared on the same target.
      state.groupMastery = { 'cvc-a': 0.2, 'cvc-e': 0.95 };
      localStorage.setItem('phonicsquest_profile_p_spell', JSON.stringify(state));
    });
  });

  async function openHome(page) {
    await page.goto('./');
    await expect(page.locator('#screen-home')).toHaveClass(/active/);
    const tour = page.locator('#modal-onboarding');
    await page.waitForTimeout(900);
    if (await tour.isVisible().catch(() => false)) {
      await page.locator('#ob-skip-btn').click();
      await expect(tour).toBeHidden();
    }
    return (await page.locator('.mission-step__title').allTextContents()).join(' | ');
  }

  test('offers spelling on a spelling day, and it opens the mode', async ({ page }) => {
    await page.clock.setFixedTime(SPELLING_DAY);
    const titles = await openHome(page);
    expect(titles).toMatch(/Listen & Spell/);

    await page.locator('[data-lesson-step]').filter({ hasText: 'Listen & Spell' }).first().click();

    // It has to land in the encoding mode, not just say so on the card.
    await expect(page.locator('#screen-game')).toHaveClass(/active/);
    await expect(page.locator('#las-replay')).toBeVisible();
    await expect(page.locator('#word-display')).toBeEmpty();
  });

  test('offers reading on a reading day', async ({ page }) => {
    await page.clock.setFixedTime(READING_DAY);
    const titles = await openHome(page);
    expect(titles).toMatch(/Blend It!/);
    expect(titles).not.toMatch(/Listen & Spell/);
  });
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
