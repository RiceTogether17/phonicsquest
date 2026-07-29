/**
 * Trophy Room ("Personal Best Wall") panel.
 *
 * A grid of the child's own bests, a highlights strip Giri reads back, and
 * earned badges. Every number is you-vs-you: no rankings, no leagues, no
 * comparison to other children — stated explicitly in the intro copy so a
 * parent reading over a shoulder sees the framing too.
 *
 * Extracted from app.js. Pure HTML build — no chart library.
 */

import { html } from '../../utils/html.js';
import { modalManager } from '../../modules/modalManager.js';
import { getPersonalBests } from '../../modules/personalBestWall.js';

/**
 * Open the trophy room modal — pulls a fresh snapshot every time so a
 * just-earned graduation / streak day shows immediately.
 */
export function openTrophyRoomPanel() {
  const host = document.getElementById('personal-best-content');
  if (!host) return;

  let pb;
  try { pb = getPersonalBests(); } catch (_) { pb = null; }

  renderTrophyRoomPanel(host, pb);
  modalManager.open('modal-personal-best');
}

/**
 * Render the trophy room body.
 * @param {HTMLElement} host
 * @param {{cards:Array<object>, summary?:{highlights?:string[]}, badges?:Array<object>}|null} pb
 */
export function renderTrophyRoomPanel(host, pb) {
  if (!host) return;

  if (!pb) {
    host.innerHTML = '<p class="trophy-empty">No data yet — play a quest to start your trophy room.</p>';
    return;
  }

  const cardsHtml = (pb.cards || []).map(card => html`
    <div class="trophy-card" role="group" aria-label="${card.label}, ${card.value}">
      <div class="trophy-card__icon" aria-hidden="true">${card.icon}</div>
      <div class="trophy-card__value">${card.value}</div>
      <div class="trophy-card__label">${card.label}</div>
      ${card.sub ? html`<div class="trophy-card__sub">${card.sub}</div>` : ''}
    </div>`);

  const highlightsHtml = pb.summary?.highlights?.length
    ? html`<ul class="trophy-highlights">${pb.summary.highlights.map(h => html`<li>${h}</li>`)}</ul>`
    : '';

  const badgesHtml = pb.badges?.length
    ? html`<div class="trophy-badges">
         <h3 class="trophy-badges__title">🎖️ Badges earned · ${pb.badges.length}</h3>
         <div class="trophy-badges__list">
           ${pb.badges.map(b => html`<span class="trophy-badge" title="${b.name}"><span aria-hidden="true">${b.emoji}</span> ${b.name}</span>`)}
         </div>
       </div>`
    : '';

  host.innerHTML = html`
    <p class="trophy-intro">Every number here is just <strong>you vs you</strong> — no rankings, no leagues.</p>
    ${highlightsHtml}
    <div class="trophy-grid">${cardsHtml}</div>
    ${badgesHtml}`;
}
