import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * "Read it to me" must stop when the question it belongs to is gone.
 *
 * The MCQ modes rebuild the whole question card with innerHTML, so tapping
 * Next detaches the button mid-script without telling it. The script is two
 * lines — the stem, then "Your choices are: …" — which is exactly long
 * enough for the old question's choices to be read aloud over the new one.
 */

const spoken = [];
let resolveSpeak = null;

vi.mock('../src/modules/audio.js', () => ({
  audio: {
    speakText: (line) => {
      spoken.push(line);
      // Hold the first line open so the test can change the DOM mid-script.
      return new Promise((resolve) => {
        resolveSpeak = resolve;
      });
    },
    cancelSpeech: vi.fn(),
  },
}));

/** Settle the handler's dynamic import of the audio module. */
const speaking = () => vi.waitFor(() => expect(resolveSpeak).toBeTypeOf('function'));

describe('attachReadAloudButton', () => {
  beforeEach(() => {
    spoken.length = 0;
    resolveSpeak = null;
    document.body.innerHTML = '';
  });

  it('stops reading once its question has been replaced', async () => {
    const { attachReadAloudButton } = await import('../src/components/readAloudButton.js');
    const host = document.createElement('div');
    document.body.appendChild(host);

    const btn = attachReadAloudButton(host, () => ({
      question: 'The cat ___ on the mat.',
      choices: ['sit', 'sits', 'sitting', 'sat'],
    }));
    btn.click();
    await speaking();
    expect(spoken).toEqual(['The cat blank on the mat.']);

    // The child taps Next: the mode rebuilds the card, detaching this button.
    host.replaceChildren();
    resolveSpeak();
    await new Promise((r) => setTimeout(r, 400));

    expect(spoken).toEqual(['The cat blank on the mat.']);
  });

  it('reads the whole script while its question is still on screen', async () => {
    const { attachReadAloudButton } = await import('../src/components/readAloudButton.js');
    const host = document.createElement('div');
    document.body.appendChild(host);

    const btn = attachReadAloudButton(host, () => ({
      question: 'The cat ___ on the mat.',
      choices: ['sit', 'sat'],
    }));
    btn.click();
    await speaking();
    resolveSpeak();
    await vi.waitFor(() => expect(spoken).toHaveLength(2));

    expect(spoken[1]).toBe('Your choices are: sit, sat.');
  });
});
