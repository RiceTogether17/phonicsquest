export const MCQ_DIFFICULTIES = Object.freeze({
  guided: {
    key: 'guided',
    label: 'Learn',
    hint: 'Rule tip shown before answering; easier mix.',
  },
  normal: {
    key: 'normal',
    label: 'Practise',
    hint: 'Post-answer feedback and normal adaptive mix.',
  },
  challenge: {
    key: 'challenge',
    label: 'PSLE Challenge',
    hint: 'Harder items, no clue chips, multi-sentence contexts where available.',
  },
});

const UPPER_LEVELS = new Set(['P4', 'P5', 'P6']);

export function filterMcqItemsForDifficulty(items, { level = null, difficulty = 'normal' } = {}) {
  const list = [...items];
  if (difficulty === 'guided') {
    const guided = list.filter(item => (item.difficulty ?? 1) <= 2);
    return guided.length ? guided : list;
  }

  if (difficulty !== 'challenge') return list;

  const hard = list.filter(item => (item.difficulty ?? 1) >= 3);
  const challengePool = hard.length ? hard : list;

  if (UPPER_LEVELS.has(level)) {
    const multiSentence = challengePool.filter(item => item.contextType === 'multi');
    if (multiSentence.length >= Math.min(5, challengePool.length)) return multiSentence;
  }

  return challengePool;
}

export function renderMcqDifficultyToggle({ selected = 'normal', prefix = 'mcq' } = {}) {
  return `
    <div class="cloze-mode-toggle mcq-difficulty-toggle" role="group" aria-label="MCQ difficulty">
      <span class="cloze-mode-label">Mode:</span>
      ${Object.values(MCQ_DIFFICULTIES).map(mode => `
        <button class="btn btn--ghost btn--sm ${selected === mode.key ? 'is-active' : ''}"
                data-${prefix}-difficulty="${mode.key}"
                aria-pressed="${selected === mode.key}">${mode.label}</button>
      `).join('')}
      <span class="cloze-mode-hint">${MCQ_DIFFICULTIES[selected]?.hint || MCQ_DIFFICULTIES.normal.hint}</span>
    </div>`;
}
