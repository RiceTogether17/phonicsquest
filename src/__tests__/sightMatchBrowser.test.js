/**
 * Sight Match quest browser — async render regression guard.
 *
 * sightStoryWeave (and the full stories.js bank behind it) is loaded
 * lazily when the browser opens, so the startup bundle stays small.
 * These tests pin the two behaviors that lazy load must not break:
 * the browser still renders its quest cards (with story-link badges),
 * and it doesn't clobber the game screen if the child starts a quest
 * before the story bank finishes loading.
 */
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
}

const flush = async (done = () => true) => {
  for (let i = 0; i < 50 && !done(); i++) await new Promise((r) => setTimeout(r, 10));
};

let sightMatch, SIGHT_QUESTS;
beforeAll(async () => {
  stubAudioGlobals();
  sightMatch = await import('../modes/sightMatch.js');
  ({ SIGHT_QUESTS } = await import('../data/sightwords.js'));
});

let container;
beforeEach(() => {
  document.body.innerHTML = '<div id="sm-root"></div>';
  container = document.getElementById('sm-root');
  sightMatch.initSightMatch(
    container,
    () => {},
    () => {},
  );
});

describe('showSightBrowser', () => {
  it('renders quest cards once the lazy story bank resolves', async () => {
    sightMatch.showSightBrowser();
    await flush(() => container.querySelector('.sm-browser'));
    expect(container.querySelector('.sm-browser')).toBeTruthy();
    expect(container.querySelectorAll('.sm-quest-card').length).toBe(SIGHT_QUESTS.length);
  });

  it('badges story-aligned quests with their linked story', async () => {
    sightMatch.showSightBrowser();
    await flush(() => container.querySelector('.sm-browser'));
    expect(container.querySelectorAll('.sm-quest-story-link').length).toBeGreaterThan(0);
  });

  it('does not overwrite an active game if a quest starts before the load resolves', async () => {
    sightMatch.showSightBrowser(); // async render kicks off
    sightMatch.startSightMatchQuest(SIGHT_QUESTS[0]); // child jumps straight in
    await flush(() => false); // let the lazy load settle fully
    expect(container.querySelector('.sm-card')).toBeTruthy(); // game stayed up
    expect(container.querySelector('.sm-browser')).toBeFalsy(); // browser skipped
  });
});
