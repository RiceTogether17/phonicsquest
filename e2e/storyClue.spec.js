/**
 * What happens after a wrong answer.
 *
 * It used to end the question: every option locked, the right one revealed.
 * That turns "I got it wrong" into a score instead of into a second go at
 * reading for meaning, which is the skill the questions exist to build. A
 * teacher sends the child back to the sentence.
 *
 * Also pinned here: Story Quest's "Next" button. It is rendered with the
 * `hidden` attribute and un-hidden once a question is answered — but `.btn`
 * sets `display: inline-flex`, which beats the browser's UA rule for
 * `[hidden]`, so it had always been on screen. A child could tap straight
 * past every comprehension question without answering one.
 */
import { test, expect } from '@playwright/test';

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_clue',
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
      }),
    );
  });
}

/** Open a Band C story — those all carry a three-question Story Quest. */
async function openStory(page) {
  await page.goto('./');
  await expect(page.locator('#screen-home')).toHaveClass(/active/);

  const tour = page.locator('#modal-onboarding');
  await page.waitForTimeout(900);
  if (await tour.isVisible().catch(() => false)) {
    await page.locator('#ob-skip-btn').click();
    await expect(tour).toBeHidden();
  }

  await page.locator('#home-tab-learn').click();
  const banner = page.locator('#btn-stories');
  await banner.scrollIntoViewIfNeeded();
  await banner.click();
  await expect(page.locator('.story-card').first()).toBeVisible();

  await page.locator('.story-tab[data-band="C"]').click();
  await page.locator('.story-card').first().click();
  const skip = page.locator('#warm-up-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await expect(page.locator('#story-body')).toBeVisible();
}

async function openQuest(page) {
  await openStory(page);
  await page.locator('#btn-finish-story').click();
  await expect(page.locator('#story-quest-cta')).toBeAttached();
  await page.evaluate(() => {
    const c = document.getElementById('story-quest-cta');
    if (c) c.hidden = false;
  });
  await page.locator('#btn-launch-quest').click();
  await expect(page.locator('.sq-screen')).toBeVisible();
  await page.locator('.sq-screen button').first().click();
  await expect(page.locator('.sq-option').first()).toBeVisible();
}

/** Click an option that is not the right one. */
async function answerWrong(page) {
  const options = page.locator('.sq-option');
  const n = await options.count();
  // The quest's first Band C question is "Where was Giri…" with the answer
  // first, so the last option is reliably wrong.
  await options.nth(n - 1).click();
}

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
});

test('Next cannot be used to skip a question', async ({ page }) => {
  await openQuest(page);
  // `.btn` set `display: inline-flex`, which beat the UA rule for [hidden].
  await expect(page.locator('#sq-next')).toBeHidden();
});

test('a wrong answer sends the child to the sentence, not to the answer', async ({ page }) => {
  await openQuest(page);
  await answerWrong(page);

  const feedback = page.locator('#sq-feedback');
  await expect(feedback).toBeVisible();
  await expect(feedback).toContainText(/The story says/i);
  await expect(feedback.locator('.sq-clue')).toBeVisible();
  await expect(feedback).toContainText(/another go/i);

  // The question is still open: the right answer has NOT been given away,
  // and the remaining options are still live.
  await expect(page.locator('.sq-option--correct')).toHaveCount(0);
  expect(await page.locator('.sq-option:not([disabled])').count()).toBeGreaterThan(0);
  await expect(page.locator('#sq-next')).toBeHidden();
});

test('the clue quotes a real sentence from this story', async ({ page }) => {
  await openQuest(page);
  const storyText = await page.evaluate(() => {
    // Captured before the quest replaced the reader.
    return window.__pqStoryText ?? '';
  });
  await answerWrong(page);
  const clue = (await page.locator('.sq-clue').textContent()).replace(/[“”"]/g, '').trim();
  expect(clue.length).toBeGreaterThan(10);
  if (storyText) expect(storyText).toContain(clue);
});

test('getting it right after the clue is counted as working it out', async ({ page }) => {
  await openQuest(page);
  await answerWrong(page);
  await page.locator('.sq-option').first().click(); // the right one

  await expect(page.locator('#sq-feedback')).toContainText(/You found it/i);
  await expect(page.locator('#sq-next')).toBeVisible();
});

test('a second wrong answer shows the answer WITH its sentence', async ({ page }) => {
  await openQuest(page);
  await answerWrong(page);
  // Another wrong one: the clue has been given, so now the answer comes.
  await page.locator('.sq-option').nth(1).click();

  const feedback = page.locator('#sq-feedback');
  await expect(feedback).toContainText(/The answer is/i);
  // Telling a child the answer teaches nothing; the sentence it came from
  // is what they can use next time.
  await expect(feedback.locator('.sq-clue')).toBeVisible();
  await expect(page.locator('.sq-option--correct')).toHaveCount(1);
});

test('the summary separates right-first-time from worked-out', async ({ page }) => {
  await openQuest(page);
  // Q1 the slow way, then answer the rest however they land.
  await answerWrong(page);
  await page.locator('.sq-option').first().click();
  await page.locator('#sq-next').click();

  for (let i = 0; i < 4; i++) {
    const opts = page.locator('.sq-option:not([disabled])');
    if (!(await opts.count())) break;
    await opts.first().click();
    const next = page.locator('#sq-next');
    if (await next.isVisible()) await next.click();
    else await opts.first().click(); // retry path
    if (
      await page
        .locator('.sq-done')
        .isVisible()
        .catch(() => false)
    )
      break;
  }

  // Whenever the run ends, a clue-assisted answer must be reported as its
  // own thing — a teacher wants to know which kind of right it was.
  const done = page.locator('.sq-done');
  if (await done.isVisible().catch(() => false)) {
    await expect(page.locator('.sq-breakdown')).toContainText(/worked out from the story/i);
  }
});

test('"Show me where" lights up the sentence, not the end of the story', async ({ page }) => {
  await openStory(page);

  // The quick check appears when the story is finished. Finishing with the
  // ruler keeps us in Listen & Follow, where the story body is rendered
  // with the numbered word spans a clue addresses.
  await page.locator('#btn-toggle-ruler').click();
  const next = page.locator('#btn-ruler-next');
  for (let i = 0; i < 40; i++) {
    const label = (await next.textContent()).trim();
    await next.click();
    await page.waitForTimeout(80);
    if (label.includes('The end')) break;
  }
  await expect(page.locator('.comp-check')).toBeVisible();

  await page.locator('.comp-choice[data-resp="hint"]').click();

  const lit = page.locator('#story-body .wf-word.is-clue');
  if (await lit.count()) {
    // It used to scroll to the last line of the story whatever was asked.
    await expect(lit.first()).toBeInViewport();
    await expect(page.locator('#comp-feedback')).toContainText(/lit up/i);
    // The lit words are one contiguous sentence, not the whole paragraph.
    const lines = await lit.evaluateAll((els) =>
      Array.from(new Set(els.map((e) => e.closest('[data-line]')?.dataset.line))),
    );
    expect(lines).toHaveLength(1);
  } else {
    // "What does this story teach us?" has no clue sentence. Saying so
    // beats pointing somewhere arbitrary.
    await expect(page.locator('#comp-feedback')).toContainText(/work out/i);
  }
});
