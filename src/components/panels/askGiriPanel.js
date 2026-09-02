/**
 * Ask Giri panel.
 *
 * Offers a set of question chips built from what the child has recently
 * found tricky, each answered from the authored offline bank first (so it
 * works with no API key) with an optional "explain it another way" AI
 * follow-up. P4+ learners with a key configured also get a free-text box.
 *
 * Extracted from app.js. Rendering uses the auto-escaping html`` tag —
 * chip text, authored copy and model replies all reach innerHTML.
 */

import { html, raw } from '../../utils/html.js';
import { modalManager } from '../../modules/modalManager.js';
import { giriInline } from '../mascot.js';
import { speakGiri } from '../speakGiri.js';
import { getActiveProfile } from '../../modules/profiles.js';
import { hasApiKey } from '../../modules/aiService.js';
import {
  buildGiriQuestionChips,
  answerChipOffline,
  answerChipAi,
  askGiriFreeText,
} from '../../modules/askGiri.js';
import { attachAskGiriButton } from '../askGiriButton.js';

/** Minimum primary grade for the free-text box (younger children use chips). */
const TYPED_QUESTION_MIN_GRADE = 4;

/** Open the Ask Giri modal, rendering fresh chips each time. */
export function openAskGiriPanel() {
  const host = document.getElementById('ask-giri-content');
  if (!host) return;
  renderAskGiriPanel(host);
  modalManager.open('modal-ask-giri');
}

/**
 * Render the Ask Giri body into `host`.
 * @param {HTMLElement} host
 */
export function renderAskGiriPanel(host) {
  if (!host) return;

  const chips = buildGiriQuestionChips();
  const profile = getActiveProfile ? getActiveProfile() : null;
  const grade = Number(String(profile?.primaryGrade || '').replace(/\D/g, '')) || 0;
  const canType = grade >= TYPED_QUESTION_MIN_GRADE && hasApiKey();

  host.innerHTML = html`
    <p class="ask-giri-intro">Tap a question and Giri will explain it. The questions come from things you've found tricky lately.</p>
    <div class="ask-giri-chips" role="group" aria-label="Suggested questions">
      ${chips.map(
        (c) => html`
        <button class="btn btn--ghost ask-giri-chip" type="button" data-chip-id="${c.id}">
          ${c.question}
        </button>`,
      )}
    </div>
    <div class="ask-giri-answer" id="ask-giri-answer" aria-live="polite"></div>
    ${
      canType
        ? html`
      <div class="ask-giri-typed">
        <label for="ask-giri-input" class="ask-giri-typed-label">Or type your own English question:</label>
        <div class="ask-giri-typed-row">
          <input type="text" id="ask-giri-input" class="settings-input" maxlength="300"
                 placeholder="e.g. When do I use 'much' and when 'many'?" />
          <button class="btn btn--primary" type="button" id="ask-giri-send">Ask</button>
        </div>
      </div>`
        : ''
    }
    ${
      hasApiKey()
        ? ''
        : html`
      <p class="ask-giri-setup">
        Giri is answering from his built-in notes. A grown-up can switch on
        AI answers so he can explain in fresh words each time.
        <button class="btn btn--ghost btn--sm" type="button" id="ask-giri-setup-btn">Set up the AI tutor</button>
      </p>`
    }
  `;

  // The moment a child taps Ask Giri is exactly when a parent finds out the
  // AI is off — so the offer belongs here, not only buried in Settings.
  // Close this modal first: stacking Settings on top of it leaves two open
  // dialogs and an Escape key that dismisses the wrong one.
  host.querySelector('#ask-giri-setup-btn')?.addEventListener('click', () => {
    modalManager.close('modal-ask-giri');
    document.getElementById('btn-home-ai-tutor')?.click();
  });

  const answerHost = host.querySelector('#ask-giri-answer');

  host.querySelectorAll('.ask-giri-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chip = chips.find((c) => c.id === btn.dataset.chipId);
      if (!chip || !answerHost) return;

      const authored = answerChipOffline(chip);
      answerHost.innerHTML = html`
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 ${chip.label}</p>
          <p class="mcq-rule-text">${authored.rule}</p>
          <p class="mcq-rule-example">${authored.example}</p>
          ${authored.tip ? html`<p class="mcq-rule-tip">💡 ${authored.tip}</p>` : ''}
        </div>`;

      attachAskGiriButton(answerHost, () => answerChipAi(chip), {
        label: 'Explain it another way ✨',
        ariaLabel: 'Ask Giri to explain this in different words',
      });
    });
  });

  host.querySelector('#ask-giri-send')?.addEventListener('click', async () => {
    const input = /** @type {HTMLInputElement|null} */ (host.querySelector('#ask-giri-input'));
    const sendBtn = /** @type {HTMLButtonElement|null} */ (host.querySelector('#ask-giri-send'));
    const q = input?.value?.trim();
    if (!q || !answerHost || !sendBtn) return;

    sendBtn.disabled = true;
    answerHost.innerHTML = html`<p class="mcq-ask-giri-answer">${raw(giriInline('thinking'))}Giri is thinking…</p>`;
    const reply = await askGiriFreeText(q);
    sendBtn.disabled = false;

    answerHost.innerHTML = reply
      ? html`<p class="mcq-ask-giri-answer">${raw(giriInline('neutral'))}${reply}</p>`
      : html`<p class="mcq-ask-giri-answer">${raw(giriInline('neutral'))}Giri can't answer right now — try one of the question buttons above!</p>`;
    if (reply) speakGiri(reply);
  });
}
