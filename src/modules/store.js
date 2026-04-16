/**
 * PhonicsQuest – Reactive State Store
 * A minimal, event-driven state container backed by localStorage.
 * No framework needed – subscribe to keys and get notified on change.
 */

const DEFAULT_STORAGE_KEY = 'phonicsquest_v2';
let STORAGE_KEY = DEFAULT_STORAGE_KEY;

/** Dev-mode logging helper — only logs in development builds */
const devWarn = (...args) => {
  if (import.meta.env.DEV) console.warn('[Store]', ...args);
};

/** Default application state */
const DEFAULT_STATE = {
  // Gamification
  xp:        0,
  level:     1,
  energy:    3,
  streak:    0,
  bestStreak: 0,
  lastPlayDate: null,
  dailyGoal: 10,
  dailyDone: 0,

  // Settings
  theme:          'default',
  difficulty:     1,        // 1 | 2 | 3
  sfxEnabled:     true,
  autoplay:       true,
  voiceSpeed:     0.8,
  parentPin:      null,     // hashed PIN
  reducedMotion:  false,    // manual override for prefers-reduced-motion
  speechEnabled:  true,
  speechLocale:   'en-SG',
  speechThreshold: 0.75,
  fontScale:      100,
  bilingualInstructions: false,
  dyslexiaFontEnabled: false,
  highContrastEnabled: false,
  bankChipScale: 100,

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

  // Progress (per-word stats)
  wordStats: {},            // { [wordId]: { attempts, correct, lastSeen } }

  // Group mastery (per group accuracy)
  groupMastery: {},         // { [group]: accuracy 0-1 }

  // Grammar category stats (Cloze Castle)
  grammarCategoryStats: {}, // { [level-category]: { attempts, correct, accuracy } }

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
  },
  questAttempts: [],        // recent quest attempts (capped)
  learningEvents: [],       // fine-grained telemetry events (capped)

  // Clue detection accuracy (separate from answer accuracy)
  // { attempted: number, strong: number, partial: number, weak: number }
  clueStats: {
    clozeCastle: { attempted: 0, strong: 0, partial: 0, weak: 0 },
    wordVault:   { attempted: 0, strong: 0, partial: 0, weak: 0 },
    sentenceForge: { attempted: 0, correct: 0, incorrect: 0 },
    editingQuest: { attempted: 0, correct: 0, incorrect: 0 },
    byType: {},             // { [clueType]: { attempted, strong, partial, weak } }
  },

  // Session
  currentMode:  'blend',
  currentGroup: 'cvc-a',

  // Per-mode difficulty (auto-adjusts based on performance)
  modeDifficulty: {},  // { [modeKey]: 1|2|3 }

  // Teacher assignment map by class
  teacherAssignments: {}, // { [classId]: { quest, level, updatedAt } }

  // Word history (last 50 words played)
  wordHistory: [],

  // Mascot
  mascotName: 'Ollie',

  // ── Placement & onboarding ─────────────────────────────────────────────
  // Set to true after the placement diagnostic has been completed (or skipped).
  placementComplete: false,
  // Rich placement profile used for reading-stage routing.
  placementProfile: null,

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
};

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
   * Validate critical fields of a saved state object.
   * Returns false if the data is clearly corrupted.
   * @private
   */
  _validateState(saved) {
    if (typeof saved !== 'object' || saved === null) return false;
    // Check critical numeric fields are numbers (not NaN, not strings)
    for (const key of ['xp', 'level', 'energy', 'streak', 'dailyGoal', 'dailyDone']) {
      if (key in saved && (typeof saved[key] !== 'number' || !Number.isFinite(saved[key]))) {
        devWarn(`Invalid ${key}:`, saved[key]);
        return false;
      }
    }
    // Check wordStats is an object if present
    if ('wordStats' in saved && (typeof saved.wordStats !== 'object' || saved.wordStats === null)) {
      devWarn('Invalid wordStats:', typeof saved.wordStats);
      return false;
    }
    return true;
  }

  /** Load from localStorage, merging with defaults to handle new keys */
  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (!this._validateState(saved)) {
          devWarn('State failed validation, using defaults');
          return { ...DEFAULT_STATE };
        }
        return { ...DEFAULT_STATE, ...saved };
      }
    } catch (err) {
      devWarn('Failed to parse stored state:', err.message);
    }
    return { ...DEFAULT_STATE };
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
      this._saveFailures = 0;
    } catch (err) {
      this._saveFailures++;
      devWarn('Save failed:', err.message, `(failure #${this._saveFailures})`);
      if (this._saveFailures >= 3) {
        this._showStorageWarning();
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
    toast.textContent = 'Device storage full — progress may not be saved. Try clearing browser data.';
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
    this._listeners.get(key)?.forEach(fn => fn(value, key));
    this._listeners.get('*')?.forEach(fn => fn(value, key));
  }

  /**
   * Reset all state to defaults (except PIN).
   */
  reset() {
    const pin = this._state.parentPin;
    this._state = { ...DEFAULT_STATE, parentPin: pin };
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
    this._state = this._load();
    this._notify('*', this._state);
  }

  /** Restore to the default storage key (single-profile mode). */
  resetStorageKey() {
    this.setStorageKey(DEFAULT_STORAGE_KEY);
  }

  /** Get a snapshot of the full state. */
  snapshot() {
    return { ...this._state };
  }

  /** Update per-word stats after an attempt. */
  recordWordAttempt(wordId, correct) {
    const stats = { ...this._state.wordStats };
    const existing = stats[wordId] ?? { attempts: 0, correct: 0, lastSeen: null };
    const newAttempts = existing.attempts + 1;
    const newCorrect  = existing.correct + (correct ? 1 : 0);
    const accuracy    = newCorrect / newAttempts;

    // Advance or reset the spaced-repetition review interval when a word
    // transitions from "not mastered" → "mastered" (or regresses).
    // Intervals in days: [0=daily, 1=3d, 2=7d, 3=14d, 4=30d]
    const SRS_INTERVALS = [1, 3, 7, 14, 30];
    const cfg = this._state.adaptiveConfig || {};
    const minAttempts = cfg.masteryMinAttempts ?? 6;
    const strongAcc   = cfg.strongAccuracy   ?? 0.9;

    let reviewInterval = existing.reviewInterval ?? 0;
    let nextReviewDate = existing.nextReviewDate ?? null;

    if (newAttempts >= minAttempts && accuracy >= strongAcc) {
      // Word is mastered — schedule next review
      const wasMastered = (existing.attempts >= minAttempts)
        && ((existing.correct / existing.attempts) >= strongAcc);
      if (correct) {
        // Successfully recalled on schedule → advance interval
        reviewInterval = Math.min(reviewInterval + 1, SRS_INTERVALS.length - 1);
      } else {
        // Forgot a mastered word → reset interval
        reviewInterval = 0;
      }
      const dayMs = 86400000;
      const due = new Date(Date.now() + SRS_INTERVALS[reviewInterval] * dayMs);
      nextReviewDate = due.toISOString();
    } else if (!correct && existing.reviewInterval > 0) {
      // Non-mastered wrong answer after prior mastery — reset
      reviewInterval = 0;
      nextReviewDate = new Date().toISOString();
    }

    stats[wordId] = {
      attempts: newAttempts,
      correct:  newCorrect,
      lastSeen: new Date().toISOString(),
      reviewInterval,
      nextReviewDate,
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
   * Record a fine-grained learning telemetry event (capped at 1000).
   * @param {{eventType: string, quest?: string, skill?: string, correct?: boolean, responseMs?: number, level?: string|number, meta?: object, timestamp?: string}} entry
   */
  recordLearningEvent(entry) {
    const events = [
      {
        eventType: entry.eventType || 'unknown',
        quest: entry.quest ?? null,
        skill: entry.skill ?? null,
        correct: typeof entry.correct === 'boolean' ? entry.correct : null,
        responseMs: entry.responseMs ?? null,
        level: entry.level ?? null,
        meta: entry.meta ?? null,
        timestamp: entry.timestamp || new Date().toISOString(),
      },
      ...(this._state.learningEvents || []),
    ].slice(0, 1000);
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
    if (!stats[quest]) stats[quest] = { attempted: 0, strong: 0, partial: 0, weak: 0, correct: 0, incorrect: 0 };
    stats[quest].attempted = (stats[quest].attempted || 0) + 1;
    if (result in (stats[quest])) stats[quest][result] = (stats[quest][result] || 0) + 1;

    // Per-type bucket ('correct'/'incorrect' normalised to 'strong'/'weak' for cross-quest consistency)
    const byTypeResult = result === 'correct' ? 'strong' : result === 'incorrect' ? 'weak' : result;
    if (clueType) {
      if (!stats.byType) stats.byType = {};
      if (!stats.byType[clueType]) stats.byType[clueType] = { attempted: 0, strong: 0, partial: 0, weak: 0 };
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
    const log = (this._state.weeklyXpLog || []).filter(e => e.date >= cutoff);
    const todayEntry = log.find(e => e.date === today);
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
