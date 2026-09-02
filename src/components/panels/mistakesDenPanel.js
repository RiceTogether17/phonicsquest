/**
 * Mistakes Den panel.
 *
 * Recent slips, grouped by the module they came from, each row tappable to
 * jump back to that module — where adaptive selection picks the now-overdue
 * item up. Framing is deliberately warm ("Tap any to retry — Giri's got
 * you"): mistakes are safe here, never scored.
 *
 * Extracted from app.js. Navigation is injected as a callback so this
 * module doesn't depend on the app's router.
 */

import { html } from '../../utils/html.js';
import { modalManager } from '../../modules/modalManager.js';
import {
  getMistakesDenSummary,
  timeAgo as mistakeTimeAgo,
  MISTAKES_LOOKBACK_DAYS,
} from '../../modules/mistakesDen.js';

/**
 * Open the Mistakes Den modal. Pulls a fresh summary every open so a
 * mid-session retry that just happened isn't shown stale.
 * @param {(target: string) => void} onNavigate  where a row should take the child
 */
export function openMistakesDenPanel(onNavigate) {
  const host = document.getElementById('mistakes-den-content');
  if (!host) return;

  let summary;
  try {
    summary = getMistakesDenSummary();
  } catch (_) {
    summary = { count: 0, mistakes: [], byModule: {} };
  }

  renderMistakesDenPanel(host, summary, onNavigate);
  modalManager.open('modal-mistakes-den');
}

/**
 * Render the Mistakes Den body — list grouped by module, each row tappable
 * to navigate back to the parent module.
 * @param {HTMLElement} host
 * @param {{count:number, mistakes:Array<object>}} summary
 * @param {(target: string) => void} [onNavigate]
 */
export function renderMistakesDenPanel(host, summary, onNavigate) {
  if (!host) return;

  if (!summary || summary.count === 0) {
    host.innerHTML = html`
      <div class="mistakes-den-empty">
        <p class="mistakes-den-empty__title">🎉 Nothing to retry — all clear!</p>
        <p class="mistakes-den-empty__sub">Mistakes from the last ${MISTAKES_LOOKBACK_DAYS} days show up here so you can have another go.</p>
      </div>`;
    return;
  }

  // Group rows by moduleLabel so the modal reads as "Grammar MCQ · 4 · …".
  const byModuleLabel = new Map();
  for (const m of summary.mistakes) {
    const key = m.moduleLabel;
    if (!byModuleLabel.has(key)) byModuleLabel.set(key, []);
    byModuleLabel.get(key).push(m);
  }

  const groupsHtml = Array.from(byModuleLabel.entries()).map(([label, items]) => {
    const rowsHtml = items.map((m) => {
      const when = mistakeTimeAgo(m.lastMistakeAt);
      return html`
        <button type="button"
          class="mistakes-den-row"
          data-target="${m.target || ''}"
          data-id="${m.id}"
          aria-label="Retry ${m.label} in ${m.moduleLabel}, ${when}">
          <span class="mistakes-den-row__label">${m.label}</span>
          <span class="mistakes-den-row__when">${when}</span>
          ${m.count > 1 ? html`<span class="mistakes-den-row__count" aria-label="${m.count} mistakes">×${m.count}</span>` : ''}
          <span class="mistakes-den-row__arrow" aria-hidden="true">→</span>
        </button>`;
    });

    return html`
      <div class="mistakes-den-group" role="list">
        <h3 class="mistakes-den-group__title">${label} <small>· ${items.length}</small></h3>
        ${rowsHtml}
      </div>`;
  });

  host.innerHTML = html`
    <p class="mistakes-den-intro">Tap any to retry — Giri's got you. ${summary.count} slip${summary.count === 1 ? '' : 's'} from the last ${MISTAKES_LOOKBACK_DAYS} days.</p>
    <div class="mistakes-den-list">${groupsHtml}</div>`;

  host.querySelectorAll('.mistakes-den-row[data-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (!target) return;
      modalManager.close('modal-mistakes-den');
      onNavigate?.(target);
    });
  });
}
