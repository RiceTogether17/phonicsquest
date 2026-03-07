/**
 * PhonicsQuest – Reactive State Store
 * A minimal, event-driven state container backed by localStorage.
 * No framework needed – subscribe to keys and get notified on change.
 */

const DEFAULT_STORAGE_KEY = 'phonicsquest_v2';
let STORAGE_KEY = DEFAULT_STORAGE_KEY;

/** Default application state */
const DEFAULT_STATE = {
  // Gamification
  xp:        0,
  level:     1,
  // Giri Energy: 3 stars per session (non-punitive, resets each session)
  // hearts key kept for backward-compat but ignored by new UI
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

  // Progress (per-word stats)
  wordStats: {},            // { [wordId]: { attempts, correct, lastSeen } }

  // Group mastery (per group accuracy)
  groupMastery: {},         // { [group]: accuracy 0-1 }

  // Quest mastery + telemetry
  questMastery: {
    sentenceForge: {},
    clozeCastle: {},
    wordVault: {},
    stories: {},
  },
  questAttempts: [],        // recent quest attempts (capped)

  // Session
  currentMode:  'blend',
  currentGroup: 'short-a',

  // Per-mode difficulty (auto-adjusts based on performance)
  modeDifficulty: {},  // { [modeKey]: 1|2|3 }

  // Word history (last 50 words played)
  wordHistory: [],

  // Mascot
  mascotName: 'Ollie',
};

class Store {
  constructor() {
    this._state = this._load();
    /** @type {Map<string, Set<Function>>} */
    this._listeners = new Map();
  }

  /** Load from localStorage, merging with defaults to handle new keys */
  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        return { ...DEFAULT_STATE, ...saved };
      }
    } catch (_) { /* ignore parse errors */ }
    return { ...DEFAULT_STATE };
  }

  /** Persist current state to localStorage */
  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
    } catch (_) { /* quota exceeded — ignore */ }
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
   * @param {*} value
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
   * @param {Function} fn  called with (newValue, key)
   * @returns {Function}   unsubscribe function
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
    this._save(); // flush current state before switching
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
    stats[wordId] = {
      attempts: existing.attempts + 1,
      correct:  existing.correct + (correct ? 1 : 0),
      lastSeen: new Date().toISOString(),
    };
    this.set('wordStats', stats);
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

  /** Check and refresh daily goal (resets at midnight). */
  checkDailyReset() {
    const today = new Date().toDateString();
    if (this._state.lastPlayDate !== today) {
      this.patch({ dailyDone: 0, lastPlayDate: today });
    }
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
