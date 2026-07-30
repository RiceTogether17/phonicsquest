/**
 * Sight Word Learn — "met" is not "practised".
 *
 * The screen used to label both states "Practiced", and "Listen to all"
 * added every word to that set in a single pass. A child could therefore
 * complete the study step, fill the progress counter and unlock Quick Recall
 * without doing anything except pressing one button.
 *
 * Hearing a word is exposure. Recalling it from four choices, with nothing on
 * screen naming it, is the first evidence the child knows it. These tests pin
 * that distinction — the same one modules/evidence.js draws for phonics.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../modules/audio.js', () => ({
  audio: {
    playSfx: vi.fn(),
    speakSightWord: vi.fn(),
    speakWord: vi.fn(),
    speakText: vi.fn(() => Promise.resolve()),
  },
}));
vi.mock('./lscwcDrill.js', () => ({
  startLscwcDrill: vi.fn(),
  cleanupLscwcDrill: vi.fn(),
}));

const QUEST = {
  id: 'e1',
  tier: 'easy',
  name: 'Quest 1',
  icon: '⭐',
  words: ['a', 'it', 'on', 'the', 'not'],
};

/** @returns {{ met: number, remembered: number }} */
function counts() {
  return {
    met: Number(document.getElementById('sl-progress-count')?.textContent || 0),
    remembered: Number(document.getElementById('sl-recalled-count')?.textContent || 0),
  };
}

function badges() {
  return [...document.querySelectorAll('.sl-word-check')].map((e) => e.textContent.trim());
}

describe('Sight Word Learn separates heard from remembered', () => {
  let mod, container;

  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    document.body.innerHTML = '<div id="sl-root"></div>';
    container = document.getElementById('sl-root');
    mod = await import('../modes/sightLearn.js');
    mod.initSightLearn(container, {});
    mod.showSightLearn(QUEST);
  });

  it('starts with nothing met and nothing remembered', () => {
    expect(counts()).toEqual({ met: 0, remembered: 0 });
    expect(badges()).toEqual(['', '', '', '', '']);
  });

  it('counts a card tap as met, never as remembered', () => {
    /** @type {HTMLElement} */
    const card = document.querySelector('.sl-word-card');
    card.click();

    expect(counts().met).toBe(1);
    // The whole point: tapping to hear a word proves nothing about knowing it.
    expect(counts().remembered).toBe(0);
    expect(card.classList.contains('sl-word-card--met')).toBe(true);
    expect(card.classList.contains('sl-word-card--recalled')).toBe(false);
  });

  it('shows a distinct badge for heard vs remembered', () => {
    /** @type {HTMLElement} */ (document.querySelector('.sl-word-card')).click();
    // ♪ = heard. A ✓ here would read as "done" for a word the child has only
    // listened to, which is exactly what the old UI claimed.
    expect(badges()[0]).toBe('♪');
    expect(badges()[0]).not.toBe('✓');
  });

  it('does not credit "Listen to all" as remembering anything', async () => {
    document.getElementById('sl-btn-listen-all')?.click();
    // The sequence awaits between words; let it drain.
    await vi.waitFor(() => expect(counts().met).toBe(QUEST.words.length), { timeout: 8000 });

    expect(counts().remembered).toBe(0);
    expect(badges()).toEqual(['♪', '♪', '♪', '♪', '♪']);
    expect(document.querySelectorAll('.sl-word-card--recalled')).toHaveLength(0);
  }, 12000);

  it('credits a word as remembered only on a correct Quick Recall answer', async () => {
    // Quick Recall picks its target and shuffles its choices with
    // Math.random; pin it to 0 so the target is words[0] and the test can
    // click the right card deliberately rather than guessing.
    vi.spyOn(Math, 'random').mockReturnValue(0);

    document.getElementById('sl-btn-listen-all')?.click();
    await vi.waitFor(() => expect(counts().met).toBe(QUEST.words.length), { timeout: 8000 });

    // Quick Recall becomes available once every word has been met — meeting
    // them is the prerequisite for trying to recall them, which is fine. What
    // must not happen is meeting them counting AS recalling them.
    const panel = document.getElementById('sl-recall');
    expect(panel?.hidden).toBe(false);
    /** @type {HTMLElement|null} */
    const start = panel?.querySelector('button');
    start?.click();

    await vi.waitFor(() => {
      expect(document.querySelectorAll('.sl-quiz-choice').length).toBeGreaterThan(0);
    });

    // The target is only ever spoken, and a wrong tap locks the round, so
    // there is no way to read it off the DOM. Pin it instead: with
    // Math.random() at 0 the target is words[0].
    const target = QUEST.words[0];
    /** @type {HTMLElement|null} */
    const correct = document.querySelector(`.sl-quiz-choice[data-word="${target}"]`);
    expect(correct, `no choice rendered for the target "${target}"`).not.toBeNull();
    correct.click();
    expect(correct.classList.contains('sl-quiz-choice--correct')).toBe(true);

    expect(counts().remembered).toBe(1);
    expect(counts().met).toBe(QUEST.words.length);
  }, 12000);
});
