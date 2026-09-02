/**
 * PhonicsQuest – Gamification Engine
 * XP, levels, Giri Energy stars, streaks, daily goals, celebrations.
 *
 * Energy system (replaces punitive hearts):
 *   • 3 ⭐ stars per session, shown in the header
 *   • A star drains only on the 2nd wrong attempt on the same word
 *     (the first wrong triggers the gentle two-strike grace in app.js)
 *   • 0 stars → tired Giri, but child can still play
 *   • Energy resets to 3 at the start of each new game session
 */

import { store } from './store.js';
import { getLevelInfo, XP_REWARDS } from '../data/curriculum.js';
import { isBedtimeActive } from './bedtimeMode.js';

class Gamification {
  constructor() {
    this._sessionCorrect = 0;
    this._sessionStreak = 0;
    this._sessionWrong = 0;
    this._freezeUsedThisSession = false;
  }

  /** Initialize: check daily reset, update streak, reset session energy */
  init() {
    store.checkDailyReset();
    this._checkStreak();
    store.resetEnergy();
    this._updateUI();
  }

  /**
   * Check / maintain day streak, applying a freeze token if available.
   *
   * Must be called BEFORE lastPlayDate is overwritten by checkDailyReset()
   * or recordCorrect(), so we can read the *real* last-played date.
   */
  _checkStreak() {
    const today = new Date().toDateString();
    const last = store.get('lastPlayDate');
    if (!last) return; // first-ever session — nothing to evaluate
    if (last === today) return; // already played today — streak already counted

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last === yesterday) return; // consecutive day — streak intact

    // Missed at least one day. Refresh weekly freeze token first.
    this._refreshWeeklyFreeze();

    const freezes = store.get('streakFreezes') ?? 0;
    const calendarGap = this._daysBetween(last, today); // e.g. Mon→Wed = 2
    const skippedDays = calendarGap - 1; // days actually missed

    // Apply a freeze token if exactly 1 day was skipped and a token is available.
    if (skippedDays === 1 && freezes > 0) {
      store.patch({
        streakFreezes: freezes - 1,
        // Do NOT reset streak — the freeze bridges the gap.
      });
      this._freezeUsedThisSession = true;
    } else {
      // Streak genuinely broken — reset.
      store.set('streak', 0);
    }
  }

  /** Refresh the weekly streak-freeze token on Sunday. */
  _refreshWeeklyFreeze() {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const lastReset = store.get('weeklyFreezeResetAt');
    const lastDate = lastReset ? new Date(lastReset).toDateString() : null;

    if (isSunday && lastDate !== now.toDateString()) {
      store.patch({
        streakFreezes: 1,
        weeklyFreezeResetAt: now.toISOString(),
      });
    }
  }

  /**
   * Count the number of calendar days between two Date.toDateString() values.
   * @param {string} fromDateStr
   * @param {string} toDateStr
   * @returns {number}
   */
  _daysBetween(fromDateStr, toDateStr) {
    const from = new Date(fromDateStr).getTime();
    const to = new Date(toDateStr).getTime();
    return Math.round(Math.abs(to - from) / 86400000);
  }

  /**
   * How many days has the learner been away?
   * Returns 0 if they played today, a positive integer otherwise.
   * @returns {number}
   */
  getDaysAway() {
    const last = store.get('lastPlayDate');
    if (!last) return 0;
    const today = new Date().toDateString();
    if (last === today) return 0;
    return this._daysBetween(last, today);
  }

  /**
   * Central XP awarding method. All XP grants MUST go through this so
   * level-ups, session XP, weekly logs, and badge hooks stay in sync.
   * @param {number} amount   XP to award (must be positive)
   * @param {string} [reason] human-readable label for UI / telemetry
   * @returns {{ newXP: number, levelUp: boolean, newLevel: number }}
   */
  awardXp(amount, reason = '') {
    if (!amount || amount <= 0)
      return { newXP: store.get('xp'), levelUp: false, newLevel: store.get('level') };

    // Bedtime Mode honours the "not every minute needs XP" charter rule.
    // When it's on, attempts are still recorded (so the SR ladder and
    // dashboard stay accurate), but no XP/level-up triggers fire. The
    // wind-down session is calm — not a hype loop before lights-out.
    if (isBedtimeActive()) {
      return { newXP: store.get('xp'), levelUp: false, newLevel: store.get('level') };
    }

    const oldLevel = store.get('level');
    const newXP = store.get('xp') + amount;
    const { level: newLevel } = getLevelInfo(newXP);

    store.patch({ xp: newXP, level: newLevel });
    store.addSessionXp(amount);

    this._updateUI();
    return { newXP, levelUp: newLevel > oldLevel, newLevel };
  }

  /**
   * Record a correct answer. Returns the XP earned breakdown.
   * @param {number} responseTimeMs  how fast the child answered
   * @param {boolean} isNewWord      first time seeing this word
   * @returns {{ xpEarned: number, reasons: string[] }}
   */
  recordCorrect(responseTimeMs = 5000, isNewWord = false) {
    this._sessionCorrect++;
    this._sessionStreak++;
    const reasons = [];
    let xpEarned = 0;

    // Base XP
    if (responseTimeMs < 3000) {
      xpEarned += XP_REWARDS.correct_fast;
      reasons.push('Quick answer!');
    } else {
      xpEarned += XP_REWARDS.correct;
      reasons.push('Correct!');
    }

    // New word bonus
    if (isNewWord) {
      xpEarned += XP_REWARDS.new_word;
      reasons.push('New word!');
    }

    // Streak bonuses (use _sessionStreak so wrong answers don't corrupt _sessionCorrect)
    const currentStreak = this._sessionStreak;
    if (currentStreak === 5) {
      xpEarned += XP_REWARDS.streak_5;
      reasons.push('5 in a row!');
    } else if (currentStreak === 10) {
      xpEarned += XP_REWARDS.streak_10;
      reasons.push('10 in a row!');
    }

    // Apply XP via centralized pipeline
    const oldLevel = store.get('level');
    const { newXP, newLevel } = this.awardXp(xpEarned);
    const { progress } = getLevelInfo(newXP);

    // Daily goal
    store.incrementDailyDone();
    const dailyDone = store.get('dailyDone');
    const dailyGoal = store.get('dailyGoal');
    if (dailyDone === dailyGoal) {
      xpEarned += XP_REWARDS.daily_goal;
      this.awardXp(XP_REWARDS.daily_goal, 'daily_goal');
      reasons.push('Daily goal complete!');
    }

    // Day streak update
    const today = new Date().toDateString();
    if (store.get('lastPlayDate') !== today) {
      store.patch({
        lastPlayDate: today,
        streak: store.get('streak') + 1,
      });
      const newStreak = store.get('streak');
      if (newStreak > store.get('bestStreak')) {
        store.set('bestStreak', newStreak);
      }
    }

    this._updateUI();

    return {
      xpEarned,
      reasons,
      levelUp: newLevel > oldLevel,
      newLevel,
      progress,
      dailyComplete: dailyDone === dailyGoal,
    };
  }

  /**
   * Record a wrong answer. Drains one Giri Energy star.
   * @returns {{ energyLeft: number, needsRest: boolean }}
   */
  recordWrong() {
    this._sessionStreak = 0;
    this._sessionWrong++;

    store.drainEnergy();
    const energyLeft = store.get('energy');

    this._updateUI();

    return {
      energyLeft,
      needsRest: energyLeft === 0,
    };
  }

  /** Reset energy to 3 stars (new session or break taken) */
  resetEnergy() {
    store.resetEnergy();
    this._updateUI();
  }

  /** Get current session stats */
  getSessionStats() {
    return {
      correct: this._sessionCorrect,
      wrong: this._sessionWrong,
      total: this._sessionCorrect + this._sessionWrong,
      accuracy:
        this._sessionCorrect + this._sessionWrong > 0
          ? this._sessionCorrect / (this._sessionCorrect + this._sessionWrong)
          : 0,
    };
  }

  /** Reset session counters */
  resetSession() {
    this._sessionCorrect = 0;
    this._sessionStreak = 0;
    this._sessionWrong = 0;
    this._freezeUsedThisSession = false;
  }

  /**
   * Was a streak freeze consumed when the app loaded today?
   * Used to show a "streak saved!" message in the UI.
   */
  wasFreezeUsed() {
    return !!this._freezeUsedThisSession;
  }

  /**
   * Aggregate learning stats for the last 7 calendar days.
   * Used by the weekly recap screen and parent dashboard.
   * @returns {{ daysPlayed:number, xpThisWeek:number, wordsThisWeek:number, questsThisWeek:number, newBadgesThisWeek:string[] }}
   */
  getWeeklyStats() {
    const events = store.get('learningEvents') || [];
    const calendar = store.get('challengeCalendar') || [];
    const cutoff = Date.now() - 7 * 86400000;

    const recentEvents = events.filter((e) => {
      const t = e.timestamp ? new Date(e.timestamp).getTime() : 0;
      return t >= cutoff;
    });

    const wordsSeen = new Set(
      recentEvents
        .filter((e) => e.eventType === 'word_attempt' && e.meta?.wordId)
        .map((e) => e.meta.wordId),
    );

    const questsCompleted = recentEvents.filter((e) => e.eventType === 'quest_complete').length;

    // Days played is estimated from the challengeCalendar + lastPlayDate
    const today = new Date().toDateString();
    const daysAgo = (dStr) => {
      const d = new Date(dStr);
      return isNaN(d) ? Infinity : Math.floor((Date.now() - d.getTime()) / 86400000);
    };
    const daysPlayed = new Set(
      calendar
        .filter((d) => daysAgo(d) < 7)
        .concat(store.get('lastPlayDate') === today ? [today] : []),
    ).size;

    // XP gained this week: sum of xpEarned in recent events
    const xpThisWeek = recentEvents
      .filter((e) => typeof e.meta?.xpEarned === 'number')
      .reduce((sum, e) => sum + e.meta.xpEarned, 0);

    return {
      daysPlayed,
      xpThisWeek,
      wordsThisWeek: wordsSeen.size,
      questsThisWeek: questsCompleted,
    };
  }

  /** Announce a message to screen readers via a transient aria-live region */
  _announceToScreenReader(message) {
    const el = document.createElement('div');
    el.className = 'sr-only';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  /** Trigger a brief pop/bump on a stat chip element */
  _bumpChip(el) {
    if (!el) return;
    const chip = el.closest('.stat-chip');
    if (!chip) return;
    chip.classList.remove('stat-chip--bump');
    void chip.offsetWidth; // reflow to restart animation
    chip.classList.add('stat-chip--bump');
    chip.addEventListener('animationend', () => chip.classList.remove('stat-chip--bump'), {
      once: true,
    });
  }

  /** Update all header UI elements */
  _updateUI() {
    const energyEl = document.getElementById('energy-display');
    const streakEl = document.getElementById('streak-val');
    const xpEl = document.getElementById('xp-val');
    const streakChip = document.getElementById('streak-chip');
    const levelEl = document.getElementById('level-val');
    const nextEl = document.getElementById('level-next-val');
    const barEl = document.getElementById('level-bar-fill');
    const goalFill = document.getElementById('goal-fill');
    const goalDone = document.getElementById('goal-done');
    const goalTotal = document.getElementById('goal-total');

    const prevEnergy = energyEl ? energyEl.querySelectorAll('.energy-star--full').length : null;
    const prevXp = xpEl ? Number(xpEl.textContent) : null;
    const prevStreak = streakEl ? Number(streakEl.textContent) : null;

    // Render energy stars
    const energy = store.get('energy') ?? 3;
    if (energyEl) {
      energyEl.innerHTML = [0, 1, 2]
        .map(
          (i) =>
            `<span class="energy-star ${i < energy ? 'energy-star--full' : 'energy-star--empty'}"
               aria-hidden="true">${i < energy ? '⭐' : '✩'}</span>`,
        )
        .join('');
      energyEl.setAttribute('aria-label', `Giri energy: ${energy} of 3 stars`);
    }

    if (streakEl) streakEl.textContent = store.get('streak');
    if (xpEl) xpEl.textContent = store.get('xp');

    const streak = store.get('streak') || 0;
    if (streakChip) {
      const tier = streak >= 14 ? 'legend' : streak >= 7 ? 'hot' : streak >= 3 ? 'warm' : 'idle';
      streakChip.setAttribute('data-streak-tier', tier);
      streakChip.setAttribute('aria-label', `Day streak: ${streak}`);
    }

    // Bump chips when values change + announce to screen readers
    if (prevEnergy !== null && energy < prevEnergy) this._bumpChip(energyEl);
    if (prevXp !== null && store.get('xp') > prevXp) {
      this._bumpChip(xpEl);
      this._announceToScreenReader(`Experience points: ${store.get('xp')}`);
    }
    if (prevStreak !== null && store.get('streak') > prevStreak) {
      this._bumpChip(streakEl);
      this._announceToScreenReader(`Day streak: ${store.get('streak')}`);
    }

    const { level, progress } = getLevelInfo(store.get('xp'));
    if (levelEl) levelEl.textContent = level;
    if (nextEl) nextEl.textContent = level + 1;
    if (barEl) barEl.style.width = `${Math.round(progress * 100)}%`;

    const done = store.get('dailyDone');
    const total = store.get('dailyGoal');
    if (goalFill) goalFill.style.width = `${Math.min(100, Math.round((done / total) * 100))}%`;
    if (goalDone) goalDone.textContent = done;
    if (goalTotal) goalTotal.textContent = total;
  }
}

export const gamification = new Gamification();
