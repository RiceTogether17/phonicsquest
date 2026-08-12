/**
 * PhonicsQuest – Reactive State Store
 * A minimal, event-driven state container backed by localStorage.
 * No framework needed – subscribe to keys and get notified on change.
 */

import { scheduleAttempt, seedFromLegacy } from './reviewScheduler.js';
import { idbGet, idbSet, isAvailable as idbAvailable } from './idb.js';
import {
  LEGACY_EVIDENCE,
  isMasteryEvidence,
  ensureEvidenceBuckets,
  addEvidenceCount,
} from './evidence.js';

/**
 * State keys persisted to IndexedDB instead of localStorage.
 *
 * Criteria: large, append-only, and non-critical — losing one must degrade
 * a signal, never a child's progress. `learningEvents` is fine-grained
 * telemetry feeding the mastery engine's speed dimension; everything that
 * actually represents learning (wordStats, badges, mastery) stays in
 * localStorage where it is written synchronously and backed up daily.
 */
const OFFLOADED_KEYS = ['learningEvents'];

/** Cap on the fine-grained learning-event log. */
const MAX_LEARNING_EVENTS = 1000;

const DEFAULT_STORAGE_KEY = 'phonicsquest_v2';
let STORAGE_KEY = DEFAULT_STORAGE_KEY;

/** Dev-mode logging helper — only logs in development builds */
const devWarn = (...args) => {
  if (import.meta.env.DEV) console.warn('[Store]', ...args);
};

/**
 * Keys whose DEFAULT_STATE value is a structured object with meaningful
 * sub-keys. A plain top-level spread would replace these wholesale with the
 * saved copy, silently dropping sub-keys added in newer versions (e.g. a new
 * quest bucket in questMastery). These are merged one level deep on load.
 */
const DEEP_MERGE_KEYS = ['adaptiveConfig', 'questMastery', 'clueStats'];

/** Default application state */
const DEFAULT_STATE = {
  /**
   * Bump when a saved-state migration is needed; _load can then branch on
   * the version found in storage. Versions before this field existed load
   * as undefined and are treated as 1.
   *
   * v2 — evidence levels (modules/evidence.js). Attempts now record HOW they
   * were obtained. There is no bulk rewrite: pre-v2 `wordStats` /
   * `wordSkillStats` entries backfill into the `guided` bucket the first time
   * they are read or written, so existing learners keep every count and every
   * unlocked stage while their unverified history stops counting as
   * independent evidence.
   */
  schemaVersion: 2,

  // Gamification
  xp: 0,
  level: 1,
  energy: 3,
  streak: 0,
  bestStreak: 0,
  lastPlayDate: null,
  dailyGoal: 10,
  dailyDone: 0,

  // Settings
  theme: 'default',
  difficulty: 1, // 1 | 2 | 3
  sfxEnabled: true,
  autoplay: true,
  voiceSpeed: 0.8,
  // When true, phonemic-awareness modes play the prompt word "stretched"
  // (sound-by-sound with tight gaps) so children can isolate each phoneme.
  // The 💡 Hint button in any PA mode uses stretched playback regardless.
  stretchedSpeech: false,
  // How blend modes play a word's sounds:
  //   'simultaneous' — each phoneme separately, then the whole word (/c/ /a/ /t/ → "cat")
  //   'cumulative'   — successive blending: each new sound is blended with
  //                    everything so far (/c/ → "ca" → "cat")
  blendStyle: 'simultaneous',
  parentPin: null, // hashed PIN
  geminiApiKey: null, // parent-supplied AI key (survives progress reset)
  reducedMotion: false, // manual override for prefers-reduced-motion
  speechEnabled: true,
  speechLocale: 'en-SG',
  speechThreshold: 0.75,
  fontScale: 100,
  bilingualInstructions: false,
  dyslexiaFontEnabled: false,
  highContrastEnabled: false,
  bankChipScale: 100,
  // When on, a grown-up sitting with the child can mark each answer
  // (Independent / With a little help / Not yet). An adult verdict is the
  // only source of `verified` evidence — nothing else can tell whether a
  // child blended the word or echoed it. Off by default: solo learners
  // shouldn't see a control meant for someone else.
  adultObserverMode: false,

  // Adaptive selection tuning (can be overridden by educator tooling)
  adaptiveConfig: {
    unseenWeight: 3,
    weakWeight: 5,
    mediumWeight: 3,
    strongWeight: 0.5,
    defaultWeight: 1,
    weakAccuracy: 0.5,
    mediumAccuracy: 0.7,
    strongAccuracy: 0.9,
    masteryMinAttempts: 6,
  },

  // Progress (per-word stats — cross-skill summary, kept for backward compat)
  wordStats: {}, // { [wordId]: { attempts, correct, lastSeen, ... } }

  // Per-word per-skill stats (oralBlend / segmenting / decoding / spelling).
  // A child who decodes 'cat' easily but can't orally segment /c/-/a/-/t/
  // shows up here as decoding=high, segmenting=low. Adaptive review reads
  // this map to target the actual gap rather than the cross-skill average.
  wordSkillStats: {}, // { [wordId]: { [skill]: { attempts, correct, lastSeen, lastResponseMs } } }

  // Group mastery (per group accuracy)
  groupMastery: {}, // { [group]: accuracy 0-1 }

  // Explicit-instruction tracking: which mini-lessons / rule cards have been
  // taught to this profile. Keys are namespaced lesson ids, e.g.
  // 'phonics:cvc-a', 'gmcq:articles', 'vmcq:contextInference'.
  lessonsSeen: {}, // { [lessonKey]: isoDate }

  // Today's guided lesson (lessonRunner.js): per-day session state plus a
  // capped history of completed lessons for the parent report.
  currentLesson: null, // { date, startedAt, teachDone, completedAt, bonusAwarded }
  lessonHistory: [], // [{ date, band, steps, completedAt }] capped at 30

  // Parent-visible log of child-initiated AI tutor calls (aiGuardrails.js).
  aiUsageLog: [], // [{ date, at, kind, summary }] capped at 100

  // Read-to-Giri per-story listening stats (storyMode.js).
  readAloudStats: {}, // { [storyId]: { attempts, lastMatchPct, lastMissedWords, updatedAt } }

  // Home tab state (homeTabs.js): last-used tab, reset to Today each new day.
  homeTab: null, // 'today' | 'learn' | 'extra' | 'grownups'
  homeTabDate: null, // 'YYYY-MM-DD' the tab was last used

  // Grammar category stats (Cloze Castle)
  grammarCategoryStats: {}, // { [level-category]: { attempts, correct, accuracy } }

  // Recurring misconceptions (modules/teacherFeedback.js). One entry per
  // named misconception rather than per attempt, so the log stays small
  // enough for localStorage: it is what lets the feedback say "that is the
  // third time this fortnight" instead of treating every slip as new.
  misconceptionLog: {}, // { [misconceptionId]: { count, skills, modes, firstSeen, lastSeen, cleanStreak } }

  // Quest mastery + telemetry
  questMastery: {
    sentenceForge: {},
    clozeCastle: {},
    wordVault: {},
    stories: {},
    editingQuest: {},
    writingQuest: {},
    grammarMcq: {},
    vocabMcq: {},
    paperMode: {},
    synthesisQuest: {},
  },
  questAttempts: [], // recent quest attempts (capped)
  learningEvents: [], // fine-grained telemetry events (capped)

  // Clue detection accuracy (separate from answer accuracy)
  // { attempted: number, strong: number, partial: number, weak: number }
  clueStats: {
    clozeCastle: { attempted: 0, strong: 0, partial: 0, weak: 0 },
    wordVault: { attempted: 0, strong: 0, partial: 0, weak: 0 },
    sentenceForge: { attempted: 0, correct: 0, incorrect: 0 },
    editingQuest: { attempted: 0, correct: 0, incorrect: 0 },
    byType: {}, // { [clueType]: { attempted, strong, partial, weak } }
  },

  // Session
  currentMode: 'blend',
  currentGroup: 'cvc-a',

  // Per-mode difficulty (auto-adjusts based on performance)
  modeDifficulty: {}, // { [modeKey]: 1|2|3 }

  // Word history (last 50 words played)
  wordHistory: [],

  // Mascot
  mascotName: 'Giri',

  // ── Placement & onboarding ─────────────────────────────────────────────
  // Set to true after the placement diagnostic has been completed (or skipped).
  placementComplete: false,
  // Rich placement profile used for reading-stage routing.
  placementProfile: null,
  recommendedPracticeLevel: null, // 'P1'..'P6' from the Primary Quick Check

  // Total sessions ever played (incremented on each session start).
  totalSessions: 0,

  // ── Streak freeze system ────────────────────────────────────────────────
  // Number of streak-freeze tokens available to the learner.
  // Refreshes to 1 each week (Sunday midnight).
  streakFreezes: 1,
  // ISO date string of last weekly freeze reset (to determine when to refresh).
  weeklyFreezeResetAt: null,

  // ── Comeback / return detection ─────────────────────────────────────────
  // ISO date string of last time the comeback session was shown, so it only
  // appears once per return event (not every time the app opens).
  comebackShownAt: null,

  // ── Session summary ─────────────────────────────────────────────────────
  // XP earned in the current calendar day (reset at midnight alongside dailyDone).
  sessionXpToday: 0,
  // Words seen in the current calendar day (IDs, capped at 50).
  sessionWordsToday: [],
  // Words decoded correctly on the FIRST attempt (no wrong strikes, no hint used).
  // Resets each day alongside sessionWordsToday.
  sessionFirstTryToday: 0,

  // ── Weekly recap ────────────────────────────────────────────────────────
  // ISO date string of last time the weekly recap was shown.
  lastWeeklyRecapAt: null,

  // ── Backup reminder ─────────────────────────────────────────────────────
  // ISO date string of last time the backup reminder was shown.
  lastBackupReminderAt: null,

  // ── Weekly XP log ────────────────────────────────────────────────────────
  // Rolling daily XP ledger for true 7-day reporting.
  // Each entry: { date: 'YYYY-MM-DD', xp: number }. Pruned to last 8 days.
  weeklyXpLog: [],

  // ── Writing Quest draft persistence ─────────────────────────────────────
  // Per-lesson draft state: text, plan, feedback, phase, revision data.
  // Keyed by `${trackId}__${lessonIdx}` or `legacy__${level}__${lessonIdx}`.
  writingDraftData: {},

  // ── Word Vault SM-2 schedule ────────────────────────────────────────────
  // { [wordId]: { interval, repetitions, easeFactor, dueAt, correct, wrong } }.
  // Written by srsScheduler.js. Declared here so it participates in the
  // store's schema, reset and backup paths like every other persisted key.
  srsSchedule: {},
};

/**
 * A fresh deep copy of the defaults.
 *
 * DEFAULT_STATE holds mutable arrays and objects (learningEvents,
 * wordHistory, questMastery...). Spreading it shallowly hands every new or
 * reset state the *same* nested references, so anything that mutates one in
 * place would silently write through to the defaults — and thence into
 * every profile loaded afterwards. Cloning removes that whole class of
 * aliasing bug.
 */
function freshDefaults() {
  return typeof structuredClone === 'function'
    ? structuredClone(DEFAULT_STATE)
    : JSON.parse(JSON.stringify(DEFAULT_STATE));
}

class Store {
  constructor() {
    this._state = this._load();
    /** @type {Map<string, Set<(value: unknown, key: string) => void>>} */
    this._listeners = new Map();
    /** Consecutive save failures for circuit breaker */
    this._saveFailures = 0;
    /** Whether a save is already queued via microtask */
    this._savePending = false;
  }

  /**
   * Repair recoverable damage in a saved state object. One bad field must
   * never cost the child their whole profile: invalid numeric fields and a
   * corrupt wordStats bucket are individually reset to defaults while every
   * other key is kept. Returns the repaired object, or null only when the
   * payload is not a state object at all.
   * @private
   */
  _repairState(saved) {
    if (typeof saved !== 'object' || saved === null || Array.isArray(saved)) return null;
    let repaired = false;
    for (const key of ['xp', 'level', 'energy', 'streak', 'dailyGoal', 'dailyDone']) {
      if (key in saved && (typeof saved[key] !== 'number' || !Number.isFinite(saved[key]))) {
        devWarn(`Repairing invalid ${key}:`, saved[key]);
        saved[key] = DEFAULT_STATE[key];
        repaired = true;
      }
    }
    if ('wordStats' in saved && (typeof saved.wordStats !== 'object' || saved.wordStats === null)) {
      devWarn('Resetting invalid wordStats:', typeof saved.wordStats);
      saved.wordStats = {};
      repaired = true;
    }
    if (repaired) this._notifyRecovery('Some saved data was damaged and has been repaired.');
    return saved;
  }

  /**
   * Merge a repaired saved state over the defaults.
   * @private
   */
  _mergeWithDefaults(repaired) {
    const merged = { ...freshDefaults(), ...repaired };
    // Structured objects merge one level deep so sub-keys added in
    // newer versions (e.g. a new quest bucket) exist for old saves.
    for (const key of DEEP_MERGE_KEYS) {
      merged[key] = { ...DEFAULT_STATE[key], ...(repaired[key] || {}) };
    }
    merged.schemaVersion = DEFAULT_STATE.schemaVersion;
    return merged;
  }

  /** Load from localStorage, merging with defaults to handle new keys */
  _load() {
    let raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const repaired = this._repairState(JSON.parse(raw));
        if (repaired) return this._mergeWithDefaults(repaired);
        devWarn('State unrecoverable, backing up');
        this._backupCorruptState(raw);
      }
    } catch (err) {
      devWarn('Failed to parse stored state:', err.message);
      this._backupCorruptState(raw);
    }
    // Main key missing or unreadable — fall back to the automatic daily
    // backup before surrendering to a blank profile.
    if (raw) {
      const restored = this._loadFromBackup();
      if (restored) {
        this._notifyRecovery('Progress was restored from the latest backup.');
        return restored;
      }
    }
    return freshDefaults();
  }

  /**
   * Read the automatic backup written by _flushSave. Returns a merged
   * state object, or null if there is no usable backup.
   * @private
   */
  _loadFromBackup() {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}__backup`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const repaired = this._repairState(parsed?.state);
      return repaired ? this._mergeWithDefaults(repaired) : null;
    } catch {
      return null;
    }
  }

  /**
   * True when the daily backup should be refreshed (missing, unreadable,
   * or from an earlier day).
   * @private
   */
  _isBackupStale() {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}__backup`);
      if (!raw) return true;
      const { savedAt } = JSON.parse(raw);
      return (
        typeof savedAt !== 'string' ||
        savedAt.slice(0, 10) !== new Date().toISOString().slice(0, 10)
      );
    } catch {
      return true;
    }
  }

  /**
   * Keep the unreadable payload under a side key instead of silently
   * overwriting it, so progress can still be recovered by hand.
   * @private
   */
  _backupCorruptState(raw) {
    if (!raw) return;
    try {
      localStorage.setItem(`${STORAGE_KEY}__corrupt`, raw);
    } catch {
      // Storage full — nothing more we can do here.
    }
    this._notifyRecovery('Saved progress could not be read. A backup copy was kept.');
  }

  /**
   * Toast a recovery notice once the DOM is ready. _load runs at module
   * import time, before #toast-container exists, so defer to the next tick.
   * @private
   */
  _notifyRecovery(message) {
    if (typeof document === 'undefined') return;
    setTimeout(() => {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'toast toast--warning';
      toast.setAttribute('role', 'alert');
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 8000);
    }, 0);
  }

  /**
   * Schedule a persist to localStorage.
   * Batches multiple synchronous set()/patch() calls into a single write
   * via queueMicrotask, reducing UI jank on low-end devices.
   */
  _save() {
    if (this._savePending) return;
    this._savePending = true;
    queueMicrotask(() => {
      this._savePending = false;
      this._flushSave();
    });
  }

  /** Actually write to localStorage (called by debounced _save). */
  _flushSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._serialisableState()));
      this._saveFailures = 0;
      this._flushOffloadedKeys();
      // Roll the automatic backup forward once per day, on the first
      // successful save: a known-good copy from at most yesterday is what
      // _load falls back to if the main key is ever corrupted.
      if (this._backupPending === undefined) this._backupPending = this._isBackupStale();
      if (this._backupPending) {
        this._backupPending = false;
        try {
          localStorage.setItem(
            `${STORAGE_KEY}__backup`,
            JSON.stringify({ savedAt: new Date().toISOString(), state: this._state }),
          );
        } catch {
          // Storage full — the main save above still succeeded.
        }
      }
    } catch (err) {
      this._saveFailures++;
      devWarn('Save failed:', err.message, `(failure #${this._saveFailures})`);
      if (this._saveFailures >= 3) {
        this._showStorageWarning();
      }
    }
  }

  /**
   * State minus the keys offloaded to IndexedDB.
   *
   * `learningEvents` alone is up to 1,000 records — re-serialising it into
   * localStorage on every answer was the single biggest write cost in the
   * app, and it shares the same ~5 MB quota as the child's actual progress.
   * @private
   */
  _serialisableState() {
    if (!OFFLOADED_KEYS.length) return this._state;
    const out = { ...this._state };
    for (const key of OFFLOADED_KEYS) delete out[key];
    return out;
  }

  /**
   * Write-behind the offloaded keys to IndexedDB. Fire-and-forget: this is
   * telemetry, and `idbSet` resolves false rather than throwing when
   * IndexedDB is unavailable (private browsing, older engines).
   *
   * When IndexedDB is missing we deliberately do NOT fall back to
   * localStorage — that would reinstate the very quota pressure this
   * avoids. The log simply doesn't persist across reloads, which costs the
   * mastery engine some speed signal and nothing else.
   * @private
   */
  _flushOffloadedKeys() {
    if (!OFFLOADED_KEYS.length || !idbAvailable()) return;
    for (const key of OFFLOADED_KEYS) {
      idbSet(`${STORAGE_KEY}::${key}`, this._state[key]);
    }
  }

  /**
   * Load offloaded keys back into memory. Async, so consumers reading in
   * the first moments after boot see the default (empty) value and then the
   * hydrated one — every consumer already guards with `|| []`.
   * @returns {Promise<void>}
   */
  async hydrateOffloadedKeys() {
    if (!OFFLOADED_KEYS.length || !idbAvailable()) return;
    for (const key of OFFLOADED_KEYS) {
      const value = await idbGet(`${STORAGE_KEY}::${key}`);
      if (Array.isArray(value)) {
        this._state[key] = value;
        this._notify(key, value);
      }
    }
  }

  /** Show a user-visible warning when storage is persistently failing */
  _showStorageWarning() {
    const container = document.getElementById('toast-container');
    if (!container) return;
    // Only show once per session
    if (this._storageWarningShown) return;
    this._storageWarningShown = true;
    const toast = document.createElement('div');
    toast.className = 'toast toast--warning';
    toast.setAttribute('role', 'alert');
    toast.textContent =
      'Device storage full — progress may not be saved. Try clearing browser data.';
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 8000);
  }

  /**
   * Read a value from state.
   * @template {keyof typeof DEFAULT_STATE} K
   * @param {K} key
   * @returns {typeof DEFAULT_STATE[K]}
   */
  get(key) {
    return this._state[key];
  }

  /**
   * Update one key and notify subscribers.
   * @param {string} key
   * @param {typeof DEFAULT_STATE[keyof typeof DEFAULT_STATE]} value
   */
  set(key, value) {
    this._state[key] = value;
    this._notify(key, value);
    this._save();
  }

  /**
   * Update multiple keys at once and notify all.
   * @param {Partial<typeof DEFAULT_STATE>} patch
   */
  patch(patch) {
    Object.assign(this._state, patch);
    for (const [key, value] of Object.entries(patch)) {
      this._notify(key, value);
    }
    this._save();
  }

  /**
   * Subscribe to a state key change.
   * @param {string} key   state key, or '*' for any change
   * @param {(value: unknown, key: string) => void} fn  called with (newValue, key)
   * @returns {() => void}   unsubscribe function
   */
  subscribe(key, fn) {
    if (!this._listeners.has(key)) this._listeners.set(key, new Set());
    this._listeners.get(key).add(fn);
    return () => this._listeners.get(key)?.delete(fn);
  }

  /** @private */
  _notify(key, value) {
    this._listeners.get(key)?.forEach((fn) => fn(value, key));
    this._listeners.get('*')?.forEach((fn) => fn(value, key));
  }

  /**
   * Reset all state to defaults (except PIN).
   */
  reset() {
    // Parent-level credentials survive a progress reset: wiping a child's
    // progress must not delete the parent's PIN or their AI key.
    const pin = this._state.parentPin;
    const apiKey = this._state.geminiApiKey;
    this._state = { ...freshDefaults(), parentPin: pin, geminiApiKey: apiKey };
    this._save();
    this._notify('*', this._state);
  }

  /**
   * Switch the active storage key (for multi-profile support).
   * Saves current state to the old key, then loads from the new key.
   * @param {string} key  localStorage key to use going forward
   */
  setStorageKey(key) {
    this._flushSave(); // flush current state synchronously before switching
    STORAGE_KEY = key;
    this._backupPending = undefined; // re-evaluate staleness for the new key
    this._state = this._load();
    this._notify('*', this._state);
    // Offloaded keys are namespaced per storage key, and _load() resets them
    // to their defaults, so the incoming profile starts from an empty log
    // (never the previous child's) and fills in as IndexedDB resolves.
    this.hydrateOffloadedKeys();
  }

  /** Restore to the default storage key (single-profile mode). */
  resetStorageKey() {
    this.setStorageKey(DEFAULT_STORAGE_KEY);
  }

  /** Get a snapshot of the full state. */
  snapshot() {
    return { ...this._state };
  }

  /**
   * Update per-word stats after an attempt.
   *
   * Each call rides the Leitner box ladder from reviewScheduler:
   *   correct + independent evidence → advance one box (Graduated at box 6)
   *   correct + weaker evidence      → hold the box, keep the existing due date
   *   wrong                          → drop one box (graduated drops to box 3)
   *
   * The evidence gate matters: the box ladder is a retention measure, and a
   * word the app blended aloud before the child tapped "Yes" has not been
   * retrieved from memory. Such answers still count as attempts and still
   * earn XP — they just can't push the word further down the review queue.
   *
   * Legacy `reviewInterval` / `nextReviewDate` fields are kept as derived
   * views of the new `box` / `dueAt` so the existing weighted-pick logic in
   * adaptiveSelection.js and the daily-challenge picker keep working.
   *
   * @param {string} wordId
   * @param {boolean} correct
   * @param {import('./evidence.js').EvidenceLevel} [evidence]
   *   How the answer was obtained. Defaults to the legacy level so untouched
   *   callers (and old tests) keep their previous meaning rather than
   *   silently claiming independence.
   */
  recordWordAttempt(wordId, correct, evidence = LEGACY_EVIDENCE) {
    const stats = { ...this._state.wordStats };
    let existing = stats[wordId] ?? { attempts: 0, correct: 0, lastSeen: null };

    // In-line migration: seed box/dueAt for legacy stats so the ladder starts
    // from the child's existing accuracy, not from scratch.
    if (typeof existing.box !== 'number') {
      const seeded = seedFromLegacy(existing);
      existing = { ...existing, box: seeded.box, dueAt: seeded.dueAt };
    }

    const newAttempts = existing.attempts + 1;
    const newCorrect = existing.correct + (correct ? 1 : 0);
    // Backfill pre-evidence records into the `guided` bucket on first touch,
    // matching the seedFromLegacy pattern above.
    const byEvidence = addEvidenceCount(ensureEvidenceBuckets(existing), evidence, correct);
    const sched = scheduleAttempt(existing, correct, Date.now(), {
      promote: isMasteryEvidence(evidence),
    });

    stats[wordId] = {
      ...existing,
      attempts: newAttempts,
      correct: newCorrect,
      lastSeen: new Date().toISOString(),
      byEvidence,
      box: sched.box,
      dueAt: sched.dueAt,
      lastResult: sched.lastResult,
      graduatedAt: sched.graduatedAt,
      // Legacy view fields — kept so adaptiveSelection.getWordWeight() and
      // existing analytics keep reading the same shape.
      reviewInterval: Math.min(sched.box, 4),
      nextReviewDate: new Date(sched.dueAt).toISOString(),
    };
    this.set('wordStats', stats);

    // Track today's words (for session summary)
    const today = new Date().toDateString();
    if (this._state.lastPlayDate === today) {
      const todayWords = [...(this._state.sessionWordsToday || [])];
      if (!todayWords.includes(wordId)) {
        this.set('sessionWordsToday', [...todayWords, wordId].slice(-50));
      }
    }
  }

  /**
   * Record a per-word per-skill attempt. Coexists with recordWordAttempt —
   * both are called on every attempt (the cross-skill summary and the
   * skill-specific breakdown stay in sync). `skill` is one of the bins
   * returned by progress.getSkillForMode(); pass null to skip skill recording
   * for modes that don't map to a phonics skill (e.g. grammar quests).
   *
   * `independentAttempts` / `independentCorrect` are tracked alongside the
   * totals so the progression gate and dashboard can ask "what can this child
   * do unaided?" without re-deriving it from the evidence buckets each time.
   *
   * @param {string} wordId
   * @param {string} skill
   * @param {boolean} correct
   * @param {number|null} [responseMs]
   * @param {import('./evidence.js').EvidenceLevel} [evidence]
   */
  recordWordSkillAttempt(wordId, skill, correct, responseMs = null, evidence = LEGACY_EVIDENCE) {
    if (!wordId || !skill) return;
    const all = { ...(this._state.wordSkillStats || {}) };
    const forWord = { ...(all[wordId] || {}) };
    const prev = forWord[skill] || {
      attempts: 0,
      correct: 0,
      lastSeen: null,
      lastResponseMs: null,
    };
    const independent = isMasteryEvidence(evidence);
    forWord[skill] = {
      ...prev,
      attempts: prev.attempts + 1,
      correct: prev.correct + (correct ? 1 : 0),
      lastSeen: new Date().toISOString(),
      lastResponseMs: typeof responseMs === 'number' ? responseMs : prev.lastResponseMs,
      byEvidence: addEvidenceCount(ensureEvidenceBuckets(prev), evidence, correct),
      // Pre-evidence records have no independent history — they backfill as
      // `guided`, so these start at zero rather than inheriting `attempts`.
      independentAttempts: (prev.independentAttempts || 0) + (independent ? 1 : 0),
      independentCorrect: (prev.independentCorrect || 0) + (independent && correct ? 1 : 0),
    };
    all[wordId] = forWord;
    this.set('wordSkillStats', all);
  }

  /** Append an entry to word history (capped at 100). */
  addWordHistory(entry) {
    const history = [entry, ...this._state.wordHistory].slice(0, 100);
    this.set('wordHistory', history);
  }

  /** Update group mastery percentage. */
  updateGroupMastery(group, accuracy) {
    const mastery = { ...this._state.groupMastery, [group]: accuracy };
    this.set('groupMastery', mastery);
  }

  /** Update one quest-skill mastery value (0..1). */
  updateQuestMastery(questKey, skillKey, accuracy) {
    const next = { ...(this._state.questMastery || {}) };
    const bucket = { ...(next[questKey] || {}) };
    bucket[skillKey] = Math.max(0, Math.min(1, accuracy));
    next[questKey] = bucket;
    this.set('questMastery', next);
  }

  /**
   * Record quest attempt telemetry (capped at 300).
   * @param {{quest: string, skill: string, correct: boolean, responseMs?: number, level?: string|number}} entry
   */
  recordQuestAttempt(entry) {
    const attempts = [
      {
        quest: entry.quest,
        skill: entry.skill,
        correct: !!entry.correct,
        responseMs: entry.responseMs ?? null,
        level: entry.level ?? null,
        timestamp: new Date().toISOString(),
      },
      ...(this._state.questAttempts || []),
    ].slice(0, 300);
    this.set('questAttempts', attempts);
  }

  /**
   * Record a fine-grained learning telemetry event (capped at MAX_LEARNING_EVENTS).
   * @param {{eventType: string, quest?: string, skill?: string, correct?: boolean, responseMs?: number, level?: string|number, meta?: object, timestamp?: string}} entry
   */
  recordLearningEvent(entry) {
    const events = this._state.learningEvents || [];
    // Mutate in place rather than rebuilding a 1,000-element array on every
    // answer: unshift + pop is one shift, where the old spread-and-slice
    // allocated a fresh copy of the whole log per event.
    events.unshift({
      eventType: entry.eventType || 'unknown',
      quest: entry.quest ?? null,
      skill: entry.skill ?? null,
      correct: typeof entry.correct === 'boolean' ? entry.correct : null,
      responseMs: entry.responseMs ?? null,
      level: entry.level ?? null,
      // How the answer was obtained — see modules/evidence.js. Null on events
      // logged before evidence tracking, and on non-attempt event types.
      evidence: entry.evidence ?? null,
      meta: entry.meta ?? null,
      timestamp: entry.timestamp || new Date().toISOString(),
    });
    while (events.length > MAX_LEARNING_EVENTS) events.pop();
    this.set('learningEvents', events);
  }

  /**
   * Record a clue detection attempt for analytics.
   * @param {Object} opts
   * @param {'clozeCastle'|'wordVault'|'sentenceForge'} opts.quest
   * @param {'strong'|'partial'|'weak'|'correct'|'incorrect'} opts.result
   * @param {string} [opts.clueType]  e.g. 'time-marker', 'connector-clue'
   */
  recordClueAttempt({ quest, result, clueType }) {
    const stats = JSON.parse(JSON.stringify(this._state.clueStats || {}));

    // Per-quest bucket
    if (!stats[quest])
      stats[quest] = { attempted: 0, strong: 0, partial: 0, weak: 0, correct: 0, incorrect: 0 };
    stats[quest].attempted = (stats[quest].attempted || 0) + 1;
    if (result in stats[quest]) stats[quest][result] = (stats[quest][result] || 0) + 1;

    // Per-type bucket ('correct'/'incorrect' normalised to 'strong'/'weak' for cross-quest consistency)
    const byTypeResult = result === 'correct' ? 'strong' : result === 'incorrect' ? 'weak' : result;
    if (clueType) {
      if (!stats.byType) stats.byType = {};
      if (!stats.byType[clueType])
        stats.byType[clueType] = { attempted: 0, strong: 0, partial: 0, weak: 0 };
      stats.byType[clueType].attempted++;
      if (byTypeResult in stats.byType[clueType]) stats.byType[clueType][byTypeResult]++;
    }

    this.set('clueStats', stats);
  }

  /**
   * Check and refresh daily goal (resets at midnight).
   * IMPORTANT: does NOT overwrite lastPlayDate — streak logic must read
   * the original lastPlayDate first. The date is updated later by
   * gamification.recordCorrect() on the first correct answer of the day.
   */
  checkDailyReset() {
    const today = new Date().toDateString();
    if (this._state.lastPlayDate !== today) {
      this.patch({
        dailyDone: 0,
        sessionXpToday: 0,
        sessionWordsToday: [],
        sessionFirstTryToday: 0,
      });
    }
  }

  /** Add XP to today's session total AND rolling weekly log. */
  addSessionXp(amount) {
    if (!amount || amount <= 0) return;
    this.set('sessionXpToday', (this._state.sessionXpToday || 0) + amount);

    // Accumulate into rolling weekly log (one entry per calendar day)
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const cutoff = new Date(Date.now() - 8 * 86400000).toISOString().slice(0, 10);
    const log = (this._state.weeklyXpLog || []).filter((e) => e.date >= cutoff);
    const todayEntry = log.find((e) => e.date === today);
    if (todayEntry) {
      todayEntry.xp = (todayEntry.xp || 0) + amount;
    } else {
      log.push({ date: today, xp: amount });
    }
    this.set('weeklyXpLog', log);
  }

  /** Increment daily goal counter. */
  incrementDailyDone() {
    this.set('dailyDone', this._state.dailyDone + 1);
  }

  /** Reset Giri Energy to full (3 stars) for a new session. */
  resetEnergy() {
    this.set('energy', 3);
  }

  /** Deduct one energy star (min 0). */
  drainEnergy() {
    this.set('energy', Math.max(0, this._state.energy - 1));
  }
}

// Singleton
export const store = new Store();
