/**
 * The app shell on real screen sizes, and the states a child actually sees.
 *
 * An app-wide sweep — open every activity, answer once, in light and dark —
 * found these, none of which any existing test looked at:
 *
 *   - The header tagline made the brand 431px wide in a block that does not
 *     shrink. On every phone, on small tablets and most laptop windows, the
 *     streak, Switch player, Bedtime, Settings and the parent dashboard were
 *     off the right edge, unreachable.
 *   - Something then scrolled the overflow-hidden shell sideways to reveal
 *     them, and screens waiting to slide in are parked off to the side, so
 *     opening an activity could leave the left of the game — answer choices
 *     included — cut off, with no way for a child to scroll back.
 *   - The floating microphone covered the bottom of the screen, which is
 *     where the feedback and the Next button appear.
 *   - In dark mode the wrong-answer feedback was 2.4:1, Comprehension Cloze
 *     was 1.1:1, and white "paper" cards lost their headings.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function seed(page, { players = 1, primary = false } = {}) {
  return page.addInitScript(
    ({ players, primary }) => {
      const mk = (id, name) => ({
        id,
        name,
        avatar: '🦊',
        color: '#5a52e0',
        schoolLevel: primary ? 'primary' : 'preschool',
        primaryGrade: primary ? 'P3' : null,
        readingBand: primary ? 'reader' : 'emerging-decoder',
        createdAt: new Date().toISOString(),
      });
      const ps = [mk('p_shell', 'Alexandra'), mk('p_shell2', 'Ben')].slice(0, players);
      localStorage.setItem('phonicsquest_profiles', JSON.stringify(ps));
      localStorage.setItem('phonicsquest_active_profile', ps[0].id);
      localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
      for (const p of ps) {
        localStorage.setItem(
          `phonicsquest_profile_${p.id}`,
          JSON.stringify({
            placementComplete: true,
            placementProfile: { readingBand: p.readingBand },
            onboardingComplete: true,
          }),
        );
      }
    },
    { players, primary },
  );
}

async function home(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);
  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(700);
  if (await tour.isVisible().catch(() => false)) await page.locator('#ob-skip-btn').click();
}

/** Open an early-reading activity through its card, stage picker and lesson. */
async function openActivity(page, mode) {
  await home(page);
  await page.locator('#home-tab-learn').click();
  await page.locator(`.mode-card[data-mode="${mode}"]`).click();
  // Most cards open a stage picker; some go straight to the game. isVisible
  // does not wait, so wait for whichever appears.
  const stage = page.locator('.bp-stage:not(.bp-stage--locked)').first();
  await expect(stage.or(page.locator('#screen-game.active'))).toBeVisible();
  if (await stage.isVisible()) await stage.click();
  // A stage may open with a mini-lesson first — one card or two, depending
  // on the stage. Skip it; these tests are about the screen after it.
  const lesson = page.locator('.mini-lesson-overlay');
  await expect(lesson.or(page.locator('#mode-area .choice-btn').first())).toBeVisible();
  if (await lesson.isVisible()) {
    await lesson
      .locator('#mini-lesson-skip, #mini-lesson-skip2, #mini-lesson-done')
      .first()
      .click();
  }
  await expect(page.locator('#screen-game')).toHaveClass(/active/);
  await page.waitForTimeout(500);
}

/** Answer the first choice — right or wrong, it brings up feedback. */
async function answerOnce(page) {
  await page.locator('#mode-area .choice-btn').first().click();
  await page.waitForTimeout(600);
}

const sideways = (page) =>
  page.evaluate(() => ({
    app: document.getElementById('app').scrollLeft,
    main: document.getElementById('main-content').scrollLeft,
  }));

const overlaps = (a, b) =>
  a && b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

test.describe('the header', () => {
  for (const width of [320, 360, 390, 430, 768, 1024]) {
    test(`every control is reachable at ${width}px with two players`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await seed(page, { players: 2 });
      await home(page);

      const header = await page.locator('.app-header').boundingBox();
      // The grown-up controls and the child's streak never give way.
      for (const id of [
        'streak-chip',
        'profile-chip',
        'bedtime-toggle',
        'settings-btn',
        'dashboard-btn',
      ]) {
        const box = await page.locator(`#${id}`).boundingBox();
        expect(box, `#${id} is not rendered at ${width}px`).not.toBeNull();
        expect(box.x + box.width, `#${id} is off the right edge at ${width}px`).toBeLessThanOrEqual(
          header.x + header.width + 0.5,
        );
      }
      expect(await sideways(page)).toEqual({ app: 0, main: 0 });
    });
  }
});

test('the page fits the screen, so the app cannot wobble', async ({ page }) => {
  // The frame was 100dvh tall inside a padded body: the page was 32–48px
  // taller than the screen, the whole app could scroll by that much, the
  // bottom of every pane sat below the edge, and the page clamping that
  // scroll moved a tapped word back under the word panel.
  await seed(page);
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 1024],
    [1280, 800],
  ]) {
    await page.setViewportSize({ width, height });
    await home(page);
    const m = await page.evaluate(() => ({
      doc: document.documentElement.scrollHeight,
      view: innerHeight,
      appBottom: document.getElementById('app').getBoundingClientRect().bottom,
    }));
    expect(m.doc, `${width}x${height}`).toBeLessThanOrEqual(m.view);
    expect(m.appBottom, `${width}x${height}`).toBeLessThanOrEqual(m.view);
  }
});

test.describe('opening an activity on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const mode of ['hear', 'oddOneOut', 'readAndTap']) {
    test(`${mode}: the screen does not slide sideways and cut off the answers`, async ({
      page,
    }) => {
      await seed(page);
      await openActivity(page, mode);
      await answerOnce(page);

      expect(await sideways(page)).toEqual({ app: 0, main: 0 });
      // And concretely: every answer is inside the screen.
      const shell = await page.locator('#app').boundingBox();
      for (const box of await page
        .locator('#mode-area .choice-btn')
        .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
        expect(box.left).toBeGreaterThanOrEqual(shell.x - 0.5);
        expect(box.right).toBeLessThanOrEqual(shell.x + shell.width + 0.5);
      }
    });
  }

  test('the microphone does not cover the feedback or the buttons', async ({ page }) => {
    await seed(page);
    await openActivity(page, 'first');
    await answerOnce(page);
    await expect(page.locator('.choice-feedback').first()).not.toBeEmpty();

    const mic = await page.locator('#btn-mic').evaluate((e) => e.getBoundingClientRect().toJSON());
    const covered = await page
      .locator('#mode-area .choice-btn, .choice-feedback, #action-bar button')
      .evaluateAll((els) =>
        els
          .filter((e) => e.getBoundingClientRect().width)
          .map((e) => ({ what: e.className || e.id, box: e.getBoundingClientRect().toJSON() })),
      );
    for (const { what, box } of covered) {
      expect(overlaps(mic, box), `the mic covers ${what}`).toBeFalsy();
    }
  });
});

test.describe('dark mode, past the landing screen', () => {
  test.use({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });

  const contrast = async (page) => {
    // Measure settled states: the pointer left over a button mid hover-fade
    // reads as a contrast failure that no one ever sees at rest.
    await page.mouse.move(1, 1);
    await page.waitForTimeout(400);
    const r = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    return r.violations.flatMap((v) =>
      v.nodes.map((n) => `${n.target.join(' ')} — ${n.any[0]?.message?.slice(0, 80)}`),
    );
  };

  test('wrong-answer feedback is readable', async ({ page }) => {
    await seed(page);
    await openActivity(page, 'first');
    // Answer wrong on purpose: the retry message is the one that failed.
    // (A comma selector returns matches in page order, so it has to be this
    // selector alone or .first() can land on the right answer.)
    await page.locator('#mode-area .choice-btn[data-correct="false"]').first().click();
    await expect(page.locator('.choice-feedback--retry')).toBeVisible();
    await page.waitForTimeout(600);
    expect(await contrast(page)).toEqual([]);
  });

  test('a Comprehension Cloze passage is readable', async ({ page }) => {
    await seed(page, { primary: true });
    await home(page);
    await page.getByRole('tab', { name: /Learn/ }).click();
    await page.evaluate(() =>
      document
        .getElementById('btn-comprehension-cloze')
        ?.closest('details')
        ?.setAttribute('open', ''),
    );
    await page.locator('#btn-comprehension-cloze').click();
    await page.locator('.cc-quest__level-btn').first().click();
    await expect(page.locator('.cc-quest__blank').first()).toBeVisible();
    expect(await contrast(page)).toEqual([]);
  });

  test('a story warm-up’s key-word chips are readable', async ({ page }) => {
    // The chips are a light component with fixed dark-purple text; moving
    // their background to the dark surface left the word and its meaning at
    // 1.9:1 and 2.4:1. Caught in review on #330.
    await seed(page);
    await home(page);
    await page.locator('#home-tab-learn').click();
    await page.locator('#btn-stories').scrollIntoViewIfNeeded();
    await page.locator('#btn-stories').click();
    await page.locator('.story-tab[data-band="C"]').click();
    await page.locator('.story-card').first().click();
    const chip = page.locator('.warm-up .vocab-chip').first();
    await expect(chip).toBeVisible();
    await chip.click(); // shows the meaning too
    await expect(chip.locator('.vocab-chip-meaning')).toBeVisible();
    await page.mouse.move(1, 1);
    await page.waitForTimeout(400);
    const r = await new AxeBuilder({ page })
      .include('.warm-up .vocab-chip-list')
      .withRules(['color-contrast'])
      .analyze();
    expect(r.violations.flatMap((v) => v.nodes.map((n) => n.target.join(' ')))).toEqual([]);
  });

  test('the practice-paper cards keep their headings', async ({ page }) => {
    await seed(page, { primary: true });
    await home(page);
    await page.getByRole('tab', { name: /Learn/ }).click();
    await page.evaluate(() =>
      document
        .getElementById('btn-p3-practice-tests')
        ?.closest('details')
        ?.setAttribute('open', ''),
    );
    await page.locator('#btn-p3-practice-tests').click();
    await expect(page.locator('.ptg-launcher-card').first()).toBeVisible();
    expect(await contrast(page)).toEqual([]);
  });
});

test('a comprehension cloze keeps each blank in its sentence on a phone', async ({ page }) => {
  // With no width the browser's 20-character default applied, and every
  // blank wrapped onto a line of its own — when a cloze is answered by
  // reading across the gap.
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page, { primary: true });
  await home(page);
  await page.getByRole('tab', { name: /Learn/ }).click();
  await page.evaluate(() =>
    document
      .getElementById('btn-comprehension-cloze')
      ?.closest('details')
      ?.setAttribute('open', ''),
  );
  await page.locator('#btn-comprehension-cloze').click();
  await page.locator('.cc-quest__level-btn').first().click();
  const blank = page.locator('.cc-quest__blank').first();
  await expect(blank).toBeVisible();
  const width = (await blank.boundingBox()).width;
  const column = (await page.locator('.cc-quest__text').first().boundingBox()).width;
  expect(width).toBeLessThan(column * 0.45);
});

test.describe('the parent dashboard on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  async function openDashboard(page) {
    await home(page);
    // Only reachable on a phone since the header fitted.
    await page.locator('#dashboard-btn').click();
    const digits = page.locator('#modal-pin .pin-digit');
    for (let i = 0; i < 4; i++) await digits.nth(i).fill(String(i + 1));
    await page.locator('#pin-confirm-btn').click();
    await expect(page.locator('#modal-dashboard')).toBeVisible();
    await page.evaluate(() =>
      document.querySelectorAll('#modal-dashboard details').forEach((d) => (d.open = true)),
    );
  }

  test('nothing runs off the right edge', async ({ page }) => {
    await seed(page);
    await openDashboard(page);
    const off = await page.evaluate(() =>
      [...document.querySelectorAll('#modal-dashboard *')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width && r.right > innerWidth + 1;
        })
        .map((e) => `${e.tagName}.${e.className}`),
    );
    expect(off).toEqual([]);
  });

  test('a beginning reader is pointed at a story, not school grammar', async ({ page }) => {
    await seed(page);
    await openDashboard(page);
    const card = page.locator('.parent-report-card');
    await expect(card).toContainText(/read a Giri story together/);
    await expect(card).not.toContainText(/Grammar MCQ/);
    // An empty week has no accuracy — it is not 0%.
    await expect(card).toContainText(/no questions answered yet/);
    await expect(card).not.toContainText(/0% accurate/);
  });
});
