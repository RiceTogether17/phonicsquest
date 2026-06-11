/**
 * PhonicsQuest – Reading Journey bar
 *
 * The 4-stage reading-band progress visual (Pre-reader → Emerging →
 * Developing → Reader), shared by the home guided-journey section and the
 * parent Learning Roadmap. Pure HTML builder — no DOM access, no store —
 * so both surfaces render identically and it tests directly.
 */

export const JOURNEY_STAGES = Object.freeze([
  { key: 'pre-reader',        label: 'Pre-reader',  shortLabel: 'Pre',        desc: 'Learning sounds & letters' },
  { key: 'emerging-decoder',  label: 'Emerging',    shortLabel: 'Emerging',   desc: 'Decoding simple words' },
  { key: 'developing-reader', label: 'Developing',  shortLabel: 'Developing', desc: 'Reading short stories' },
  { key: 'reader',            label: 'Reader',      shortLabel: 'Reader',     desc: 'Reading fluently' },
]);

export const STAGE_META = Object.freeze({
  'pre-reader':        { icon: '🌱', label: 'Pre-reader Journey',        mod: 'pathway-badge--preschool' },
  'emerging-decoder':  { icon: '🧩', label: 'Emerging Decoder Journey',  mod: 'pathway-badge--preschool' },
  'developing-reader': { icon: '📘', label: 'Developing Reader Journey', mod: 'pathway-badge--primary' },
  reader:              { icon: '🏫', label: 'Reader Journey',            mod: 'pathway-badge--primary' },
});

/**
 * Overall journey progress: each of 4 stages = 25%, plus partial credit
 * from within-stage group mastery.
 *
 * @param {string} readingBand
 * @param {Record<string, number>} groupMastery  store's groupMastery map
 * @returns {{ safeIdx: number, totalProgress: number, nextStage: object|null }}
 */
export function computeJourneyProgress(readingBand, groupMastery = {}) {
  const currentStageIdx = JOURNEY_STAGES.findIndex(s => s.key === readingBand);
  const safeIdx = currentStageIdx === -1 ? 0 : currentStageIdx;
  const masteryValues = Object.values(groupMastery).filter(v => typeof v === 'number');
  const avgMastery = masteryValues.length ? masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length : 0;
  const withinStagePct = Math.min(Math.round(avgMastery * 100), 99);
  const totalProgress = Math.min(safeIdx * 25 + Math.round(withinStagePct * 0.25), 100);
  return { safeIdx, totalProgress, nextStage: JOURNEY_STAGES[safeIdx + 1] || null };
}

/**
 * Build the journey-bar HTML (header, progress track, stage dots, next goal).
 * @param {string} readingBand
 * @param {Record<string, number>} groupMastery
 * @returns {string}
 */
export function buildJourneyBarHtml(readingBand, groupMastery = {}) {
  const { safeIdx, totalProgress, nextStage } = computeJourneyProgress(readingBand, groupMastery);

  const journeyStepsHtml = JOURNEY_STAGES.map((s, i) => {
    const isDone    = i < safeIdx;
    const isCurrent = i === safeIdx;
    return `<div class="journey-stage ${isDone ? 'journey-stage--done' : ''} ${isCurrent ? 'journey-stage--current' : ''}"
                 aria-label="${s.label}${isCurrent ? ' (current)' : isDone ? ' (complete)' : ''}">
      <div class="journey-stage-dot">${isDone ? '✓' : isCurrent ? STAGE_META[readingBand]?.icon || '•' : ''}</div>
      <span class="journey-stage-name">${s.shortLabel}</span>
    </div>`;
  }).join('<div class="journey-stage-connector"></div>');

  return `
    <div class="reading-journey-bar" aria-label="Reading level progress">
      <div class="journey-bar-header">
        <span class="journey-bar-title">Reading Journey</span>
        <span class="journey-bar-stage">${JOURNEY_STAGES[safeIdx].label} · Stage ${safeIdx + 1} of 4</span>
      </div>
      <div class="journey-progress-track" role="progressbar" aria-valuenow="${totalProgress}" aria-valuemin="0" aria-valuemax="100" aria-label="Overall reading level: ${totalProgress}%">
        <div class="journey-progress-fill" style="width:${totalProgress}%"></div>
      </div>
      <div class="journey-stages">
        ${journeyStepsHtml}
      </div>
      ${nextStage ? `<p class="journey-next-goal">Next: <strong>${nextStage.label}</strong> — ${nextStage.desc}</p>` : '<p class="journey-next-goal">🏅 Reading journey complete!</p>'}
    </div>`;
}
