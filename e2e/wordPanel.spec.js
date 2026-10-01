/**
 * The docked word panel.
 *
 * Tapping a word used to open a modal over the story. The blend ladder in it
 * ends by asking the child to read the word's sentence again and check it
 * makes sense — and the sentence was behind a dimmed overlay. Cross-checking
 * a decoded word against its context is what turns sounding-out into
 * reading, so the panel now docks at the bottom of the screen and the story
 * scrolls the tapped word to just above it.
 *
 * Geometry is what matters here, so these run at a phone's size, where the
 * panel takes half the screen and covering the word is the easy mistake.
 */
import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

async function seedLearner(page) {
  await page.addInitScript(() => {
    const profile = {
      id: 'p_panel',
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

  await page.locator('.story-tab[data-band="B"]').click();
  await page.locator('.story-card').first().click();
  const skip = page.locator('#warm-up-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await expect(page.locator('#story-body')).toBeVisible();
}

/**
 * Scroll the reading pane so a word sits near the bottom of the screen —
 * exactly where the panel will land — and return its index. Picks a word
 * that can be sounded out, so the ladder is what opens.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{last?: boolean}} [opts] last: use the story's final word, which
 *   needs the pane to grow before it can be lifted clear
 */
async function placeWordLow(page, { last = false } = {}) {
  return page.evaluate((last) => {
    const words = [...document.querySelectorAll('#story-body .wf-word')];
    const decodable = words
      .map((w, i) => ({ w, i }))
      .filter(({ w }) => /^[a-z]{3,}$/.test(w.dataset.plain || ''));
    const { w, i } = last
      ? decodable[decodable.length - 1]
      : decodable[Math.floor(decodable.length / 2)];
    const pane = document.getElementById('stories-content');
    pane.scrollTop += w.getBoundingClientRect().top - window.innerHeight * 0.85;
    return i;
  }, last);
}

/** Where the word and the panel are, once both have settled. */
async function geometry(page, i) {
  return page.evaluate((i) => {
    const w = document.querySelectorAll('#story-body .wf-word')[i].getBoundingClientRect();
    const p = document.getElementById('word-panel').getBoundingClientRect();
    const pane = document.getElementById('stories-content').getBoundingClientRect();
    return { wordTop: w.top, wordBottom: w.bottom, panelTop: p.top, paneTop: pane.top };
  }, i);
}

const word = (page, i) => page.locator('#story-body .wf-word').nth(i);

test.beforeEach(async ({ page }) => {
  await seedLearner(page);
  // No slide-in and no smooth scroll, so every measurement is of where
  // things came to rest. One test below runs with motion on.
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('a word low on the screen is lifted above the panel, not covered by it', async ({ page }) => {
  await openStory(page);
  const i = await placeWordLow(page);
  const before = await geometry(page, i).catch(() => null);
  await word(page, i).click();
  await expect(page.locator('#word-panel .blend-ladder')).toBeVisible();

  const g = await geometry(page, i);
  // Left alone, the panel would have landed right on top of it.
  expect(before === null || before.wordTop > 600).toBe(true);
  expect(g.wordBottom).toBeLessThanOrEqual(g.panelTop - 16);
  expect(g.wordTop).toBeGreaterThanOrEqual(g.paneTop);
  // And it is marked, so the child can find it in the sentence.
  await expect(word(page, i)).toHaveClass(/wf-word--looking/);
});

test('the story is not hidden behind an overlay', async ({ page }) => {
  await openStory(page);
  await word(page, await placeWordLow(page)).click();

  const panel = page.locator('#word-panel');
  await expect(panel).toBeVisible();
  // A named, non-modal dialog: the story behind it stays live, which is the
  // whole point — the child is meant to read the sentence while using it.
  await expect(panel).toHaveAttribute('role', 'dialog');
  await expect(panel).toHaveAttribute('aria-label', /Sound out the word \S+/);
  expect(await panel.getAttribute('aria-modal')).toBeNull();
  await expect(page.locator('.modal-overlay:not([hidden])')).toHaveCount(0);
});

test('the word stays in sight as the ladder grows', async ({ page }) => {
  await openStory(page);
  const i = await placeWordLow(page);
  await word(page, i).click();

  // Each rung can wrap the steps onto another line and make the panel
  // taller, sliding its top up towards the word.
  const next = page.locator('.bl-next');
  for (let k = 0; k < 6 && (await next.isVisible()); k++) await next.click();
  await expect(page.locator('.bl-done')).toBeVisible();
  const g = await geometry(page, i);
  expect(g.wordBottom).toBeLessThanOrEqual(g.panelTop - 8);
});

test('a word on the last line can be lifted clear too', async ({ page }) => {
  await openStory(page);
  const i = await placeWordLow(page, { last: true });
  await word(page, i).click();
  await expect(page.locator('#word-panel')).toBeVisible();
  // There is nothing below the last line to scroll up into view, so the pane
  // is given room the height of the panel while it is open.
  const g = await geometry(page, i);
  expect(g.wordBottom).toBeLessThanOrEqual(g.panelTop - 16);
});

test('Escape closes it and puts the child back on the word', async ({ page }) => {
  await openStory(page);
  const i = await placeWordLow(page);
  await word(page, i).click();
  await expect(page.locator('.bl-next')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.locator('#word-panel')).toBeHidden();
  await expect(word(page, i)).toBeFocused();
  await expect(page.locator('.wf-word--looking')).toHaveCount(0);
  // The room made for the panel goes with it.
  expect(
    await page.evaluate(() => document.getElementById('stories-content').style.paddingBottom),
  ).toBe('');
});

test('"Back to my story" and the close button both close it', async ({ page }) => {
  await openStory(page);
  const i = await placeWordLow(page);

  await word(page, i).click();
  await page.locator('#word-panel [data-action="back"]').click();
  await expect(page.locator('#word-panel')).toBeHidden();

  await word(page, i).click();
  await page.locator('#word-panel [data-action="close"]').click();
  await expect(page.locator('#word-panel')).toBeHidden();
  await expect(word(page, i)).toBeFocused();
});

test('tapping another word switches the panel to it', async ({ page }) => {
  await openStory(page);
  const i = await placeWordLow(page);
  await word(page, i).click();
  const firstLabel = await page.locator('#word-panel').getAttribute('aria-label');

  // The story above the panel is live, so the next word is one tap away.
  await word(page, 2).click();
  await expect(page.locator('#word-panel')).toBeVisible();
  expect(await page.locator('#word-panel').getAttribute('aria-label')).not.toBe(firstLabel);
  await expect(page.locator('.wf-word--looking')).toHaveCount(1);
  await expect(word(page, 2)).toHaveClass(/wf-word--looking/);
});

test('the arrow keys inside the panel do not move the ruler', async ({ page }) => {
  await openStory(page);
  await page.locator('#btn-toggle-ruler').click();
  await expect(page.locator('.ruler-pos b')).toContainText('1 /');
  await word(page, 2).click();
  await expect(page.locator('.bl-next')).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  // The ruler would otherwise slide the story out from under the word.
  await expect(page.locator('.ruler-pos b')).toContainText('1 /');
});

test('leaving the story takes the panel with it', async ({ page }) => {
  await openStory(page);
  await word(page, 2).click();
  await expect(page.locator('#word-panel')).toBeVisible();

  // It lives on <body>, outside the reader — so it has to be closed on the
  // way out, or it would float over the library.
  await page.locator('#btn-reader-back').click();
  await expect(page.locator('.story-card').first()).toBeVisible();
  await expect(page.locator('#word-panel')).toBeHidden();
});

test('with motion on, it still measures where the panel comes to rest', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openStory(page);
  const i = await placeWordLow(page);
  await word(page, i).click();

  // The panel slides up as it opens. Measuring it mid-slide left the word
  // tucked against its edge.
  await expect
    .poll(async () => {
      const g = await geometry(page, i);
      return g.panelTop - g.wordBottom;
    })
    .toBeGreaterThanOrEqual(16);
});

test.describe('while Giri is reading aloud', () => {
  test.beforeEach(async ({ page }) => {
    // A stand-in voice: every line "finishes" quickly, and what was spoken
    // is recorded, so the test can see where the narration picks up. Like
    // Chrome, cancelling reports an "interrupted" error on the line it cut off.
    await page.addInitScript(() => {
      window.__spoken = [];
      let current = null;
      const synth = {
        speaking: false,
        pending: false,
        paused: false,
        speak(u) {
          window.__spoken.push(u.text);
          current = u;
          setTimeout(() => {
            if (current !== u) return;
            current = null;
            u.onend?.();
          }, 60);
        },
        cancel() {
          const u = current;
          current = null;
          if (u) setTimeout(() => u.onerror?.({ error: 'interrupted' }), 0);
        },
        pause() {},
        resume() {},
        getVoices: () => [],
        addEventListener() {},
        removeEventListener() {},
      };
      Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
    });
  });

  test('the way back carries on from the same line', async ({ page }) => {
    await openStory(page);
    await page.locator('#btn-story-play').click();
    await expect.poll(() => page.evaluate(() => window.__spoken.length)).toBeGreaterThan(2);

    await word(page, 2).click();
    const back = page.locator('#word-panel [data-action="back"]');
    // Not "Back to my story": the child was listening, so that is what the
    // button offers to carry on with.
    await expect(back).toContainText(/Keep listening/);
    const spoken = await page.evaluate(() => [...window.__spoken]);
    const interrupted = spoken[spoken.length - 1];

    await back.click();
    await expect
      .poll(() => page.evaluate(() => window.__spoken.length))
      .toBeGreaterThan(spoken.length);
    const resumed = await page.evaluate((n) => window.__spoken[n], spoken.length);
    // It re-reads the sentence it stopped in — now with the worked-out word
    // in it — rather than going back to the top of the story.
    expect(resumed).toBe(interrupted);
    expect(resumed).not.toBe(spoken[0]);
  });

  // Stopping used to fall through to "the story is finished": the pause timer
  // between lines saw narration was off and called the end-of-story route,
  // and so did the error Chrome raises when speech is cancelled. Pressing
  // Stop — or tapping a word, which pauses the narration — marked the story
  // read and put up the ending over a story the child was halfway through.
  for (const [name, interrupt] of [
    ['pressing Stop', (page) => page.locator('#btn-story-stop').click()],
    ['tapping a word', (page) => word(page, 2).click()],
  ]) {
    test(`${name} part-way through does not finish the story`, async ({ page }) => {
      await openStory(page);
      await page.locator('#btn-story-play').click();
      await expect.poll(() => page.evaluate(() => window.__spoken.length)).toBeGreaterThan(1);

      await interrupt(page);
      const spoken = await page.evaluate(() => window.__spoken.length);
      await page.waitForTimeout(1200); // past any pause between lines

      await expect(page.locator('.story-ending')).toHaveCount(0);
      expect(
        await page.evaluate(() => JSON.parse(localStorage.getItem('giri_stories_read') || '[]')),
      ).not.toContain('core-b-01');
      // And it really did stop, rather than carrying on underneath.
      expect(await page.evaluate(() => window.__spoken.length)).toBe(spoken);
    });
  }

  test('listening all the way to the end still finishes it', async ({ page }) => {
    await openStory(page);
    await page.locator('#btn-story-play').click();
    await expect(page.locator('.story-ending')).toBeVisible({ timeout: 20000 });
  });

  test('when nobody was reading aloud, the way back just goes back', async ({ page }) => {
    await openStory(page);
    await word(page, 2).click();
    await expect(page.locator('#word-panel [data-action="back"]')).toContainText(
      /Back to my story/,
    );
  });
});
