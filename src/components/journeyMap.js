/**
 * PhonicsQuest – Journey Map
 *
 * The six-step learning path (Hear the Sounds → Learn the Letters →
 * Sound Out Words → Know Words on Sight → Read Stories → School English)
 * rendered as a compact horizontal path with the child's position marked.
 *
 * Pure builder + one small renderer; progress comes from journeyStages.js
 * so this stays consistent with every other journey surface.
 *
 * Public API:
 *   buildJourneyMapHtml({ avatar })  → html string
 *   renderJourneyMap(container, { avatar })
 */

import { JOURNEY_STEPS, getJourneyStageProgress, getCurrentJourneyStep } from '../data/journeyStages.js';

/**
 * @param {{avatar?: string}} [opts]
 * @returns {string}
 */
export function buildJourneyMapHtml({ avatar = '🦁' } = {}) {
  const current = getCurrentJourneyStep();

  const steps = JOURNEY_STEPS.map((stage, i) => {
    const { status, pct } = getJourneyStageProgress(stage.key);
    const isCurrent = stage.key === current.key;
    const isDone = status === 'complete';
    const stateClass = isDone ? 'jm-step--done' : isCurrent ? 'jm-step--current' : 'jm-step--upcoming';
    const badge = isDone ? '✓' : isCurrent ? avatar : stage.icon;
    return `
      <div class="jm-step ${stateClass}" role="listitem"
           aria-label="Step ${stage.step}: ${stage.title} — ${isDone ? 'complete' : isCurrent ? `current, ${pct}%` : 'coming up'}">
        <div class="jm-step-dot" aria-hidden="true">${badge}</div>
        <span class="jm-step-label">${stage.childLabel}</span>
        ${isCurrent && pct > 0 ? `<span class="jm-step-pct">${pct}%</span>` : ''}
      </div>
      ${i < JOURNEY_STEPS.length - 1 ? '<div class="jm-connector" aria-hidden="true"></div>' : ''}`;
  }).join('');

  return `
    <div class="journey-map" role="list" aria-label="Your reading journey — six steps">
      ${steps}
    </div>`;
}

/**
 * @param {HTMLElement} container
 * @param {{avatar?: string}} [opts]
 */
export function renderJourneyMap(container, opts = {}) {
  if (!container) return;
  container.innerHTML = buildJourneyMapHtml(opts);
}
