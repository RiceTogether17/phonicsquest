/**
 * PhonicsQuest – MCQ browser shell
 *
 * Shared framing for the Grammar MCQ and Vocabulary MCQ start screens.
 *
 * Both browsers opened on a three-step chooser — level, then support level,
 * then skill — before a child could answer anything. Measured on a 390px
 * viewport that was 3,722 px of scrolling and 40 buttons, four taps deep from
 * the home screen, every single session. A child who just wants to practise
 * should not have to configure a practice session first.
 *
 * So the chooser is still all there, but it is one tap away behind a
 * disclosure, and the screen leads with a single button that starts the
 * recommended round immediately.
 */

import { escapeHtml } from '../utils/escapeHtml.js';
import { MCQ_ROUND_SIZE } from '../constants.js';

/**
 * The hero "just start" action plus the collapsed chooser.
 *
 * @param {object} params
 * @param {string} params.prefix       id prefix, 'gmcq' | 'vmcq'
 * @param {string} params.level        the level the hero button will start
 * @param {boolean} [params.recommended]  whether `level` is the recommended one
 * @param {string} params.chooserHtml  the existing step-by-step chooser markup
 * @returns {string}
 */
export function renderMcqQuickStart({ prefix, level, recommended = false, chooserHtml }) {
  const safeLevel = escapeHtml(level);
  return `
    <div class="mcq-quickstart">
      <button class="btn btn--primary mcq-quickstart__go" id="${prefix}-quick-start">
        Start ${MCQ_ROUND_SIZE} questions · ${safeLevel}
      </button>
      <p class="mcq-quickstart__note">
        ${
          recommended
            ? `${safeLevel} is the level we recommend for you right now.`
            : `Practising at ${safeLevel}.`
        }
      </p>
    </div>

    <details class="mcq-chooser">
      <summary class="mcq-chooser__summary">Change level, support or skill</summary>
      <div class="mcq-chooser__body">${chooserHtml}</div>
    </details>`;
}
