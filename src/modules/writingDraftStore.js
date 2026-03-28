/**
 * writingDraftStore.js
 *
 * Dedicated local-first persistence layer for Writing Quest draft state.
 * Stores per-learner, per-lesson writing work: drafts, plans, feedback,
 * revision data, and phase information so learners can resume where they
 * left off and review feedback at any time.
 *
 * Storage: uses the main store under key `writingDraftData`.
 * Structure: { [draftKey]: DraftRecord }
 *   draftKey = `${trackId}__${lessonIdx}` or `legacy__${level}__${lessonIdx}`
 */

import { store } from './store.js';

const DRAFT_DATA_KEY = 'writingDraftData';

/** Build a storage key for a tracked lesson. */
function _makeKey(trackId, lessonIdx) {
  return `${trackId}__${lessonIdx}`;
}

/** Build a storage key for a legacy (untracked) lesson. */
function _makeLegacyKey(level, lessonIdx) {
  return `legacy__${level}__${lessonIdx}`;
}

/** Read the entire draft data map from the store. */
function _getMap() {
  const map = store.get(DRAFT_DATA_KEY);
  return map && typeof map === 'object' ? map : {};
}

/** Write the entire draft data map back to the store. */
function _setMap(map) {
  store.set(DRAFT_DATA_KEY, map);
}

/**
 * @typedef {Object} DraftRecord
 * @property {string}  draftText          - Current/latest draft text
 * @property {string}  firstDraftText     - First submitted draft text
 * @property {string}  revisedDraftText   - Revised draft text (after repair)
 * @property {Object}  plan               - Plot plan object
 * @property {string}  selectedStarter    - Chosen story starter
 * @property {string}  phase              - Current lesson phase
 * @property {Object}  feedbackResult     - Latest evaluation result (structured)
 * @property {Object}  revisionComparison - Revision comparison data
 * @property {Object}  remediation        - Remediation path data
 * @property {Array}   missionStatus      - Paragraph mission hit status
 * @property {Array}   badges             - Detected badges
 * @property {string}  createdAt          - ISO timestamp of first save
 * @property {string}  updatedAt          - ISO timestamp of last update
 * @property {string}  trackId            - Track ID for reference
 * @property {number}  lessonIdx          - Lesson index for reference
 */

/**
 * Load a saved draft record for a tracked lesson.
 * @param {string} trackId
 * @param {number} lessonIdx
 * @returns {DraftRecord|null}
 */
export function loadDraft(trackId, lessonIdx) {
  const map = _getMap();
  return map[_makeKey(trackId, lessonIdx)] || null;
}

/**
 * Load a saved draft record for a legacy lesson.
 * @param {number} level
 * @param {number} lessonIdx
 * @returns {DraftRecord|null}
 */
export function loadLegacyDraft(level, lessonIdx) {
  const map = _getMap();
  return map[_makeLegacyKey(level, lessonIdx)] || null;
}

/**
 * Save or update a draft record for a tracked lesson.
 * Merges with existing data so partial updates are safe.
 * @param {string} trackId
 * @param {number} lessonIdx
 * @param {Partial<DraftRecord>} data
 */
export function saveDraft(trackId, lessonIdx, data) {
  const map = _getMap();
  const key = _makeKey(trackId, lessonIdx);
  const existing = map[key] || {};
  const now = new Date().toISOString();
  map[key] = {
    ...existing,
    ...data,
    trackId,
    lessonIdx,
    createdAt: existing.createdAt || now,
    updatedAt: now,
  };
  _setMap(map);
}

/**
 * Save or update a draft record for a legacy lesson.
 * @param {number} level
 * @param {number} lessonIdx
 * @param {Partial<DraftRecord>} data
 */
export function saveLegacyDraft(level, lessonIdx, data) {
  const map = _getMap();
  const key = _makeLegacyKey(level, lessonIdx);
  const existing = map[key] || {};
  const now = new Date().toISOString();
  map[key] = {
    ...existing,
    ...data,
    level,
    lessonIdx,
    createdAt: existing.createdAt || now,
    updatedAt: now,
  };
  _setMap(map);
}

/**
 * Update just the phase for a tracked lesson.
 * @param {string} trackId
 * @param {number} lessonIdx
 * @param {string} phase
 */
export function updatePhase(trackId, lessonIdx, phase) {
  saveDraft(trackId, lessonIdx, { phase });
}

/**
 * Update feedback result for a tracked lesson.
 * Saves the full structured feedback so it can be reviewed later.
 * @param {string} trackId
 * @param {number} lessonIdx
 * @param {Object} feedbackResult - Full evaluation result
 * @param {Object} [remediation] - Remediation path data
 * @param {Array}  [missionStatus] - Mission hit status
 * @param {Array}  [badges] - Detected badges
 */
export function updateFeedback(trackId, lessonIdx, feedbackResult, remediation, missionStatus, badges) {
  const patch = { feedbackResult };
  if (remediation !== undefined) patch.remediation = remediation;
  if (missionStatus !== undefined) patch.missionStatus = missionStatus;
  if (badges !== undefined) patch.badges = badges;
  saveDraft(trackId, lessonIdx, patch);
}

/**
 * Update revision data for a tracked lesson.
 * @param {string} trackId
 * @param {number} lessonIdx
 * @param {string} revisedDraftText
 * @param {Object} revisionResult - Evaluation of revised draft
 * @param {Object} revisionComparison - Before/after comparison
 * @param {Array}  [badges] - Badges from revision
 */
export function updateRevision(trackId, lessonIdx, revisedDraftText, revisionResult, revisionComparison, badges) {
  saveDraft(trackId, lessonIdx, {
    revisedDraftText,
    revisionResult,
    revisionComparison,
    badges: badges || [],
  });
}

/**
 * Clear a saved draft for a tracked lesson (e.g., on lesson complete + next).
 * @param {string} trackId
 * @param {number} lessonIdx
 */
export function clearDraft(trackId, lessonIdx) {
  const map = _getMap();
  delete map[_makeKey(trackId, lessonIdx)];
  _setMap(map);
}

/**
 * Clear a saved draft for a legacy lesson.
 * @param {number} level
 * @param {number} lessonIdx
 */
export function clearLegacyDraft(level, lessonIdx) {
  const map = _getMap();
  delete map[_makeLegacyKey(level, lessonIdx)];
  _setMap(map);
}

/**
 * Check whether a saved draft exists for a tracked lesson.
 * @param {string} trackId
 * @param {number} lessonIdx
 * @returns {boolean}
 */
export function hasDraft(trackId, lessonIdx) {
  return !!loadDraft(trackId, lessonIdx);
}

/**
 * Get a human-readable summary of a saved draft (for UI display).
 * @param {DraftRecord} record
 * @returns {{ phase: string, hasText: boolean, hasFeedback: boolean, updatedAt: string }}
 */
export function getDraftSummary(record) {
  if (!record) return null;
  return {
    phase: record.phase || 'unknown',
    hasText: !!(record.draftText || record.firstDraftText),
    hasFeedback: !!record.feedbackResult,
    hasRevision: !!record.revisedDraftText,
    updatedAt: record.updatedAt || '',
  };
}
