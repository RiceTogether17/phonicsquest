/**
 * PhonicsQuest – Giri says it out loud
 *
 * The AI tutor's answers arrive as a paragraph of text, which is a problem
 * for exactly the child who needed the explanation: a struggling reader has
 * to decode the help before they can use it. Giri reads it out instead.
 *
 * Runs on the device's own speech — the same voice the phonics modes use —
 * so it costs nothing on top of the AI call and works with any provider.
 * Honours the sfx setting, because everything else does.
 */

/**
 * Speak one of Giri's replies. Never throws and never blocks the caller:
 * the answer is already on screen, and audio is the bonus.
 *
 * @param {string} text  an already-sanitised reply from aiGuardrails
 */
export function speakGiri(text) {
  const line = String(text || '').trim();
  if (!line) return;
  // Imported on demand so the AI panels don't drag the speech manager into
  // their chunk just to have the option.
  import('../modules/audio.js')
    .then(({ audio }) => {
      // Stop whatever is mid-sentence: a new answer supersedes the last one.
      audio.cancelSpeech();
      return audio.speakText(line);
    })
    .catch(() => { /* silence is an acceptable outcome */ });
}
