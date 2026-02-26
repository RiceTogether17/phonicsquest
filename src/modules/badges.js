/**
 * PhonicsQuest – Achievement Badges
 *
 * Each badge has a unique id, emoji, name, description,
 * and a condition checked after every game event.
 *
 * State is stored in its own localStorage key so it never
 * conflicts with the main store.
 */

const STORAGE_KEY = 'phonicsquest_badges';

/** All available achievements, ordered by expected earn time */
const BADGE_DEFINITIONS = [
  {
    id: 'first_blend',
    emoji: '🎯',
    name: 'First Blend!',
    desc: 'Got your very first word correct',
    check: (s) => s.totalCorrect >= 1,
  },
  {
    id: 'quick_fingers',
    emoji: '⚡',
    name: 'Quick Fingers',
    desc: 'Answered in under 3 seconds',
    check: (s) => s.lastWasFast,
  },
  {
    id: 'on_a_roll',
    emoji: '🎳',
    name: 'On a Roll',
    desc: '5 correct answers in a row',
    check: (s) => s.sessionStreak >= 5,
  },
  {
    id: 'unstoppable',
    emoji: '🔥',
    name: 'Unstoppable!',
    desc: '10 correct answers in a row',
    check: (s) => s.sessionStreak >= 10,
  },
  {
    id: 'word_collector',
    emoji: '📚',
    name: 'Word Collector',
    desc: 'Got 25 words correct',
    check: (s) => s.totalCorrect >= 25,
  },
  {
    id: 'century',
    emoji: '💯',
    name: 'Century Club',
    desc: 'Got 100 words correct',
    check: (s) => s.totalCorrect >= 100,
  },
  {
    id: 'master_reader',
    emoji: '🏆',
    name: 'Master Reader',
    desc: 'Got 250 words correct',
    check: (s) => s.totalCorrect >= 250,
  },
  {
    id: 'mode_explorer',
    emoji: '🌍',
    name: 'Mode Explorer',
    desc: 'Tried all 8 game modes',
    check: (s) => s.modesPlayed.length >= 8,
  },
  {
    id: 'story_reader',
    emoji: '📖',
    name: 'Story Reader',
    desc: 'Opened the Giri Stories library',
    check: (s) => s.storiesOpened,
  },
  {
    id: 'day_one',
    emoji: '📅',
    name: 'Day One',
    desc: 'Played for 2 days in a row',
    check: (s) => s.dayStreak >= 2,
  },
  {
    id: 'week_warrior',
    emoji: '🗓️',
    name: 'Week Warrior',
    desc: '7-day streak — you\'re amazing!',
    check: (s) => s.dayStreak >= 7,
  },
  {
    id: 'level_five',
    emoji: '⭐',
    name: 'Rising Star',
    desc: 'Reached Level 5',
    check: (s) => s.level >= 5,
  },
  {
    id: 'level_ten',
    emoji: '👑',
    name: 'PhonicsQuest Champion',
    desc: 'Reached the maximum level — Level 10!',
    check: (s) => s.level >= 10,
  },
  {
    id: 'daily_hat_trick',
    emoji: '🎪',
    name: 'Hat Trick',
    desc: 'Completed your daily goal 3 times',
    check: (s) => s.dailyGoalsCompleted >= 3,
  },
];

class BadgeManager {
  constructor() {
    this._state = this._load();
  }

  /** Load badge state from localStorage */
  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          earned: new Set(parsed.earned ?? []),
          totalCorrect: parsed.totalCorrect ?? 0,
          modesPlayed: new Set(parsed.modesPlayed ?? []),
          storiesOpened: parsed.storiesOpened ?? false,
          dailyGoalsCompleted: parsed.dailyGoalsCompleted ?? 0,
        };
      }
    } catch (_) { /* ignore corrupted storage */ }
    return {
      earned: new Set(),
      totalCorrect: 0,
      modesPlayed: new Set(),
      storiesOpened: false,
      dailyGoalsCompleted: 0,
    };
  }

  /** Persist badge state to localStorage */
  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        earned: [...this._state.earned],
        totalCorrect: this._state.totalCorrect,
        modesPlayed: [...this._state.modesPlayed],
        storiesOpened: this._state.storiesOpened,
        dailyGoalsCompleted: this._state.dailyGoalsCompleted,
      }));
    } catch (_) { /* storage quota — not critical */ }
  }

  /**
   * Call after each correct answer.
   * @param {{
   *   fast: boolean,
   *   sessionStreak: number,
   *   level: number,
   *   dayStreak: number,
   *   dailyComplete: boolean,
   *   mode: string
   * }} ctx
   * @returns {Array<{emoji,name,desc}>} newly earned badges
   */
  onCorrect(ctx) {
    const { fast = false, sessionStreak = 0, level = 1, dayStreak = 0, dailyComplete = false, mode = '' } = ctx;

    // Update state
    this._state.totalCorrect++;
    if (mode) this._state.modesPlayed.add(mode);
    if (dailyComplete) this._state.dailyGoalsCompleted++;

    this._save();

    return this._checkAll({
      totalCorrect: this._state.totalCorrect,
      lastWasFast: fast,
      sessionStreak,
      level,
      dayStreak,
      dailyGoalsCompleted: this._state.dailyGoalsCompleted,
      modesPlayed: this._state.modesPlayed,
      storiesOpened: this._state.storiesOpened,
    });
  }

  /** Call when the stories screen is opened */
  onStoriesOpened() {
    if (this._state.storiesOpened) return [];
    this._state.storiesOpened = true;
    this._save();
    return this._checkAll({
      totalCorrect: this._state.totalCorrect,
      lastWasFast: false,
      sessionStreak: 0,
      level: 1,
      dayStreak: 0,
      dailyGoalsCompleted: this._state.dailyGoalsCompleted,
      modesPlayed: this._state.modesPlayed,
      storiesOpened: true,
    });
  }

  /** Check all badge conditions, return newly earned badges */
  _checkAll(snapshot) {
    const newly = [];
    for (const badge of BADGE_DEFINITIONS) {
      if (this._state.earned.has(badge.id)) continue;
      if (badge.check(snapshot)) {
        this._state.earned.add(badge.id);
        newly.push(badge);
      }
    }
    if (newly.length) this._save();
    return newly;
  }

  /** Get all earned badge definitions */
  getEarned() {
    return BADGE_DEFINITIONS.filter(b => this._state.earned.has(b.id));
  }

  /** Get all badge definitions (for dashboard display) */
  getAll() {
    return BADGE_DEFINITIONS.map(b => ({ ...b, earned: this._state.earned.has(b.id) }));
  }

  /** Show a toast notification for a newly earned badge */
  notify(badge) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast toast--badge';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <span class="toast-badge-emoji">${badge.emoji}</span>
      <span class="toast-badge-text">
        <strong>Badge unlocked!</strong>
        <span>${badge.name}</span>
      </span>
    `;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /** Reset all badge progress (called with store reset) */
  reset() {
    this._state = {
      earned: new Set(),
      totalCorrect: 0,
      modesPlayed: new Set(),
      storiesOpened: false,
      dailyGoalsCompleted: 0,
    };
    this._save();
  }

  /** Total number of badges earned */
  get earnedCount() {
    return this._state.earned.size;
  }

  /** Total number of badges available */
  get totalCount() {
    return BADGE_DEFINITIONS.length;
  }
}

export const badges = new BadgeManager();
