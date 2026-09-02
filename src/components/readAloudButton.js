/**
 * PhonicsQuest – "Read it to me" for a question
 *
 * A child who cannot yet decode a sentence cannot answer a grammar question
 * about it — the reading gets in the way of the thing being assessed. This
 * reads the stem and the choices aloud so the question is about grammar
 * again.
 *
 * Uses the device's own speech, so it costs nothing, needs no key and works
 * offline. It is not the AI tutor; it is the same voice the phonics modes
 * already use.
 */

import { giriImageEl } from './mascot.js';

// Loaded on first tap, not at import time. The MCQ modes had no audio
// dependency before this button existed, and a static import would pull the
// whole speech manager into their chunk for a feature most rounds never use.
const getAudio = () => import('../modules/audio.js').then((m) => m.audio);

const IDLE_LABEL = 'Read it to me';
const BUSY_LABEL = 'Reading…';

/**
 * One voice, shared across every read-aloud button on the page.
 *
 * Deliberately module-level rather than per-button: each question is a NEW
 * button (the MCQ modes rebuild the whole card), so a per-button counter can
 * never see that a different button has taken over the speakers. A child who
 * moves on mid-sentence would still hear the old question's choices read out
 * over the new one.
 */
let _readerToken = 0;

/**
 * Turn a written stem into something worth hearing.
 *
 * A blank is written "___", which speech engines render as three underscores
 * or, worse, silence — leaving the child a sentence with a hole and no clue
 * where it was. Saying "blank" puts the gap back where it belongs.
 *
 * @param {string} text
 * @returns {string}
 */
export function speakableStem(text) {
  return (
    String(text || '')
      .replace(/_{2,}/g, ' blank ')
      .replace(/\s{2,}/g, ' ')
      // The substitution leaves a space before any punctuation that followed
      // the blank ("is blank ."), which some engines read as a pause.
      .replace(/\s+([.,!?;:])/g, '$1')
      .trim()
  );
}

/**
 * What the button should say out loud for a question: the sentence, a beat,
 * then the options — because a child listening rather than reading has no
 * way to scan the four buttons.
 *
 * @param {string} question
 * @param {string[]} choices
 * @returns {string[]} lines, spoken in order
 */
export function buildReadAloudScript(question, choices = []) {
  const lines = [speakableStem(question)];
  if (choices.length) {
    lines.push(`Your choices are: ${choices.join(', ')}.`);
  }
  return lines.filter(Boolean);
}

/**
 * Append a read-aloud button to `host`.
 *
 * @param {HTMLElement|null} host
 * @param {() => { question: string, choices?: string[] }} getContent
 *        Read at tap time, so a re-rendered question is always current.
 * @returns {HTMLButtonElement|null}
 */
export function attachReadAloudButton(host, getContent) {
  if (!host || typeof getContent !== 'function') return null;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'read-aloud-btn';
  btn.setAttribute('aria-label', 'Read the question and the choices aloud');
  const setLabel = (text, pose) => {
    btn.replaceChildren(giriImageEl(pose, 20), document.createTextNode(text));
  };
  setLabel(IDLE_LABEL, 'neutral');

  btn.addEventListener('click', async () => {
    // A second tap stops rather than queues: a child who taps twice wants it
    // to start again, not to hear the sentence twice back to back.
    const mine = ++_readerToken;
    const audio = await getAudio();
    if (btn.dataset.speaking === 'true') {
      audio.cancelSpeech();
      btn.dataset.speaking = 'false';
      setLabel(IDLE_LABEL, 'neutral');
      return;
    }

    btn.dataset.speaking = 'true';
    setLabel(BUSY_LABEL, 'encourage');
    // Superseded, or the question it belongs to has been replaced. Either way
    // this reader owns the voice only while it is still the newest one, so a
    // newer reader's audio is never cut off by an older one giving up.
    const stale = () => mine !== _readerToken || !btn.isConnected;
    try {
      const { question, choices } = getContent() || {};
      for (const line of buildReadAloudScript(question, choices)) {
        if (stale()) break;
        await audio.speakText(line);
        if (stale()) break;
        await new Promise((r) => setTimeout(r, 250));
      }
    } catch {
      /* a silent tutor is the same as no button */
    }

    if (mine !== _readerToken) return;
    // The MCQ modes rebuild the question with innerHTML, which detaches this
    // button mid-script without telling it. Without this, the previous
    // question's choices carry on being read over the new one.
    if (!btn.isConnected) {
      audio.cancelSpeech();
      return;
    }
    btn.dataset.speaking = 'false';
    setLabel(IDLE_LABEL, 'neutral');
  });

  host.appendChild(btn);
  return btn;
}
