/**
 * writingBadges.js
 *
 * Craft badge definitions and detection logic for Writing Quest.
 *
 * Badges are awarded for specific, observable writing behaviours — not just
 * for reaching a score threshold. This keeps the incentive aligned with
 * genuine craft development rather than score gaming.
 */

export const BADGE_DEFS = {
  'strong-opener': {
    label: 'Strong Opener',
    emoji: '🏁',
    description: 'Your first sentence sets the scene or action immediately.',
  },
  'clear-ending': {
    label: 'Clear Ending',
    emoji: '🔚',
    description: 'Your writing ends clearly and completely.',
  },
  'connector-builder': {
    label: 'Connector Builder',
    emoji: '🔗',
    description: 'You used 3 or more different connectors to link ideas.',
  },
  'dialogue-hero': {
    label: 'Dialogue Hero',
    emoji: '💬',
    description: 'You included dialogue with correct speech-mark punctuation.',
  },
  'show-dont-tell': {
    label: 'Show-Don\'t-Tell',
    emoji: '🎭',
    description: 'You showed feelings through actions rather than naming emotions directly.',
  },
  'formal-tone': {
    label: 'Formal Tone Keeper',
    emoji: '📋',
    description: 'You used a correct formal opening and closing for your audience.',
  },
  'task-champion': {
    label: 'Task Champion',
    emoji: '✅',
    description: 'You covered every required point in your response.',
  },
  'revision-star': {
    label: 'Revision Star',
    emoji: '⭐',
    description: 'Your revision meaningfully improved your first draft.',
  },
};

/**
 * Detect which badges are earned from an evaluation.
 *
 * @param {object} metrics    – from computeMetrics() in writingEvaluator.js
 * @param {string} text       – the raw text (used for first-sentence check)
 * @param {object|null} comparison – from compareRevisions(), when revising
 * @returns {string[]}        – array of earned badge keys
 */
export function detectBadges(metrics, text, comparison = null) {
  const earned = [];

  // Strong Opener: first sentence is substantial and avoids clichéd openers.
  // "I went", "I am", "My name" and "Today" are common weak openers in primary writing.
  const first        = metrics.firstSentence || '';
  const weakOpeners  = /^(i went|i am|my name is|today i|this is about|one day i went)/i;
  if (first.length > 20 && !weakOpeners.test(first.trim())) {
    earned.push('strong-opener');
  }

  // Clear Ending: ends with terminal punctuation and has reasonable length
  if (metrics.hasEndPunct && metrics.sentenceCount >= 4) {
    earned.push('clear-ending');
  }

  // Connector Builder: 3+ distinct connectors drawn from different banks
  if (metrics.totalDistinct >= 3) {
    earned.push('connector-builder');
  }

  // Dialogue Hero: dialogue present AND correctly punctuated
  if (metrics.hasDialogue && metrics.dialoguePunctOk) {
    earned.push('dialogue-hero');
  }

  // Show-Don't-Tell: sensory / action language present, low emotion-naming
  // (relevant primarily for P5/P6 narrative tasks)
  if (metrics.sensoryHits >= 2 && metrics.emotionTellingCount <= 1) {
    earned.push('show-dont-tell');
  }

  // Formal Tone: both formal opening AND closing present
  // (relevant for situational / formal writing tasks)
  if (metrics.hasFormalOpening && metrics.hasFormalClosing) {
    earned.push('formal-tone');
  }

  // Task Champion: all required checks passed
  if (metrics.requiredTotal > 0 && metrics.requiredHits === metrics.requiredTotal) {
    earned.push('task-champion');
  }

  // Revision Star: earned on the summary screen when revision improved the score
  if (comparison?.revisionBonus >= 5) {
    earned.push('revision-star');
  }

  return earned;
}

/**
 * Render badge chips as an HTML string for display.
 * @param {string[]} badgeKeys
 * @returns {string}
 */
export function renderBadgeChips(badgeKeys) {
  if (!badgeKeys?.length) return '<em style="color:var(--text-muted)">No badges this time — keep practising!</em>';
  return badgeKeys
    .map(key => {
      const def = BADGE_DEFS[key];
      if (!def) return '';
      return `<span class="sfq-badge" title="${def.description}" style="margin:2px 4px;display:inline-block">${def.emoji} ${def.label}</span>`;
    })
    .join('');
}
