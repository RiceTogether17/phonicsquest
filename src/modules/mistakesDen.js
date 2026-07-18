/**
 * PhonicsQuest – Mistakes Den
 *
 * A universal "Practice Hub" hatched from the Duolingo pattern but built on
 * PhonicsQuest's own telemetry. Pulls the last 7 days of wrong answers
 * across every mode — phonics (wordHistory) and primary (questAttempts) —
 * so the child has one place to revisit anything that tripped them up.
 *
 * Mistakes are deduped per (kind, key) so a word missed three times in a
 * row shows once with a "×3" chip rather than three identical rows.
 * Tapping a row routes back to the parent module; the module's own
 * adaptive selection picks up the now-overdue item (via the Review Lane
 * box ladder or the existing weighted picker) without any per-item
 * replay plumbing.
 *
 * Charter-safe: this surface never names a child's mistake with a red
 * flash or guilt-style copy. It frames every entry as "to retry" — a
 * gentle invitation, not a scold.
 */

import { store } from './store.js';

/** Default lookback window for the den. Matches the existing weekly recap. */
export const MISTAKES_LOOKBACK_DAYS = 7;
const DAY_MS = 86_400_000;

/**
 * Mode/quest key → home navigation target. Mirrors the routes in
 * missionToday's QUEST_TO_TARGET and the phonics-mode keys used by
 * app._navigateTo / data-mode on the home grid.
 */
const MODULE_TARGETS = Object.freeze({
  // Phonics modes (wordHistory.mode values)
  blend:        'blend',
  classicBlend: 'classicBlend',
  hear:         'hear',
  oralBlend:    'oralBlend',
  first:        'first',
  last:         'last',
  middle:       'middle',
  soundCount:   'soundCount',
  oralSegment:  'oralSegment',
  missing:      'missing',
  segment:      'segment',
  // Primary quests (questAttempts.quest values)
  clozeCastle:    'cloze-castle',
  wordVault:      'word-vault',
  grammarMcq:     'grammar-mcq',
  vocabMcq:       'vocab-mcq',
  editingQuest:   'editing-quest',
  sentenceForge:  'sentence-forge',
  writingQuest:   'writing-quest',
  synthesisQuest: 'synthesis-quest',
  paperMode:      'paper-mode',
  stories:        'stories',
});

/** Human-readable label per module/quest. */
const MODULE_LABELS = Object.freeze({
  blend:          '🎯 Blend It!',
  classicBlend:   '🔊 Listen & Blend',
  hear:           '👂 Hear & Choose',
  oralBlend:      '🗣️ Oral Blend',
  first:          '🚀 First Sound',
  last:           '🏁 Last Sound',
  middle:         '🎯 Middle Sound',
  soundCount:     '🔢 Count the Sounds',
  oralSegment:    '🥁 Tap the Sounds',
  missing:        '🔍 Missing Sound',
  segment:        '✂️ Segment It',
  clozeCastle:    '🏰 Cloze Castle',
  wordVault:      '🔑 Word Vault',
  grammarMcq:     '🧠 Grammar MCQ',
  vocabMcq:       '📖 Vocabulary MCQ',
  editingQuest:   '✏️ Editing Quest',
  sentenceForge:  '🔨 Sentence Forge',
  writingQuest:   '📝 Writing Quest',
  synthesisQuest: '🔁 Synthesis & Transformation',
  paperMode:      '📋 Exam Practice Hub',
  stories:        '📚 Giri Stories',
});

function moduleLabel(key) {
  if (!key) return 'Practice';
  return MODULE_LABELS[key] || _humanise(key);
}

function moduleTarget(key) {
  return MODULE_TARGETS[key] || null;
}

function _humanise(key) {
  return String(key)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, c => c.toUpperCase());
}

/**
 * Pull recent mistakes from wordHistory + questAttempts, normalize them,
 * dedupe by (kind, key), and sort newest first.
 *
 * @param {{ days?: number, now?: number }} [opts]
 * @returns {Array<{
 *   id: string, kind: 'word'|'quest', label: string, subLabel: string,
 *   moduleKey: string, moduleLabel: string, target: string|null,
 *   count: number, lastMistakeAt: number,
 * }>}
 */
export function getRecentMistakes(opts = {}) {
  const { days = MISTAKES_LOOKBACK_DAYS, now = Date.now() } = opts;
  const cutoff = now - days * DAY_MS;

  /** @type {Map<string, any>} */
  const bucket = new Map();

  // ── Phonics-side mistakes ─────────────────────────────────────────────
  const history = Array.isArray(store.get('wordHistory')) ? store.get('wordHistory') : [];
  for (const h of history) {
    if (!h || h.correct !== false || !h.wordId) continue;
    const t = h.timestamp ? new Date(h.timestamp).getTime() : 0;
    if (!Number.isFinite(t) || t < cutoff) continue;

    const moduleKey = h.mode || 'blend';
    const dedupeKey = `word:${moduleKey}:${h.wordId}`;
    const prev = bucket.get(dedupeKey);
    if (prev) {
      prev.count++;
      if (t > prev.lastMistakeAt) prev.lastMistakeAt = t;
    } else {
      bucket.set(dedupeKey, {
        id: dedupeKey,
        kind: 'word',
        label: String(h.wordId),
        subLabel: moduleLabel(moduleKey),
        moduleKey,
        moduleLabel: moduleLabel(moduleKey),
        target: moduleTarget(moduleKey),
        count: 1,
        lastMistakeAt: t,
      });
    }
  }

  // ── Primary-side mistakes ─────────────────────────────────────────────
  const qa = Array.isArray(store.get('questAttempts')) ? store.get('questAttempts') : [];
  for (const a of qa) {
    if (!a || a.correct !== false) continue;
    const t = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    if (!Number.isFinite(t) || t < cutoff) continue;

    const moduleKey = a.quest || 'practice';
    const skill = a.skill || 'general';
    const dedupeKey = `quest:${moduleKey}:${skill}`;
    const prev = bucket.get(dedupeKey);
    if (prev) {
      prev.count++;
      if (t > prev.lastMistakeAt) prev.lastMistakeAt = t;
    } else {
      bucket.set(dedupeKey, {
        id: dedupeKey,
        kind: 'quest',
        label: _humanise(skill),
        subLabel: moduleLabel(moduleKey),
        moduleKey,
        moduleLabel: moduleLabel(moduleKey),
        target: moduleTarget(moduleKey),
        count: 1,
        lastMistakeAt: t,
      });
    }
  }

  return Array.from(bucket.values()).sort((a, b) => b.lastMistakeAt - a.lastMistakeAt);
}

/**
 * Summary for the home tile and modal header.
 *
 * @param {{ days?: number, now?: number }} [opts]
 * @returns {{
 *   count: number,
 *   mistakes: ReturnType<typeof getRecentMistakes>,
 *   byModule: Record<string, number>,
 * }}
 */
export function getMistakesDenSummary(opts = {}) {
  const mistakes = getRecentMistakes(opts);
  const byModule = {};
  for (const m of mistakes) {
    byModule[m.moduleKey] = (byModule[m.moduleKey] || 0) + 1;
  }
  return { count: mistakes.length, mistakes, byModule };
}

/**
 * Friendly "X days ago" / "today" / "yesterday" label for the modal rows.
 * @param {number} timestamp ms epoch
 * @param {number} [now]
 */
export function timeAgo(timestamp, now = Date.now()) {
  if (!Number.isFinite(timestamp)) return '';
  const diff = Math.max(0, now - timestamp);
  if (diff < DAY_MS) return 'today';
  if (diff < 2 * DAY_MS) return 'yesterday';
  const days = Math.floor(diff / DAY_MS);
  return `${days} days ago`;
}

export const __TEST__ = { MODULE_TARGETS, MODULE_LABELS, _humanise };
