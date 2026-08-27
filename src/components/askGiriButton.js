/**
 * PhonicsQuest – shared "Ask Giri ✨" button
 *
 * One consistent on-demand AI elaboration affordance for feedback panels
 * and teach-back overlays. Strictly additive: callers render their
 * authored/offline content first; this button only appears when an API
 * key is configured and today's call cap isn't reached (aiGuardrails),
 * and a failed call degrades to a friendly no-op line.
 */

import { canCallAi } from '../modules/aiGuardrails.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { giriInline, giriImageEl } from './mascot.js';
import { speakGiri } from './speakGiri.js';

const FALLBACK_LINE = `${giriInline('neutral')}Giri is having a quiet moment — the explanation above has you covered!`;

/**
 * Append an Ask-Giri button to a host element.
 *
 * @param {HTMLElement|null} hostEl
 * @param {() => Promise<string|null>} fetchAnswer  resolves to the sanitised
 *        AI reply (from aiGuardrails-backed aiService helpers) or null
 * @param {object} [opts]
 * @param {string} [opts.label]      button text
 * @param {string} [opts.ariaLabel]
 * @returns {HTMLElement|null} the appended wrapper, or null when AI is unavailable
 */
export function attachAskGiriButton(hostEl, fetchAnswer, { label = 'Ask Giri why ✨', ariaLabel = 'Ask Giri to explain this answer' } = {}) {
  if (!hostEl || typeof fetchAnswer !== 'function' || !canCallAi()) return null;

  const wrap = document.createElement('div');
  wrap.className = 'mcq-ask-giri';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mcq-ask-giri-btn';
  btn.textContent = label;
  btn.setAttribute('aria-label', ariaLabel);
  wrap.appendChild(btn);
  hostEl.appendChild(wrap);

  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.replaceChildren(giriImageEl('thinking'), document.createTextNode('Giri is thinking…'));
    Promise.resolve(fetchAnswer()).then(answer => {
      if (!wrap.isConnected) return;
      wrap.innerHTML = answer
        ? `<p class="mcq-ask-giri-answer" role="status">${giriInline('neutral')}${escapeHtml(answer)}</p>`
        : `<p class="mcq-ask-giri-answer" role="status">${FALLBACK_LINE}</p>`;
      // Giri explains out loud as well as on screen. A child who needed the
      // explanation is often the same child who finds a paragraph hard work.
      if (answer) speakGiri(answer);
    }).catch(() => {
      if (!wrap.isConnected) return;
      wrap.innerHTML = `<p class="mcq-ask-giri-answer" role="status">${FALLBACK_LINE}</p>`;
    });
  }, { once: true });

  return wrap;
}
