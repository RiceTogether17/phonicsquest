/**
 * PhonicsQuest – Gamification Engine
 * XP, levels, hearts, streaks, daily goals, celebrations.
 */

import { store } from './store.js';
import { getLevelInfo, XP_REWARDS } from '../data/curriculum.js';

class Gamification {
  constructor() {
    this._sessionCorrect = 0;
    this._sessionWrong   = 0;
  }

  /** Initialize: check daily reset, update streak */
  init() {
    store.checkDailyReset();
    this._checkStreak();
    this._updateUI();
  }

  /** Check / maintain day streak */
  _checkStreak() {
    const today = new Date().toDateString();
    const last  = store.get('lastPlayDate');
    if (!last) return;
    if (last === today) return; // same day

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last !== yesterday) {
      // Streak broken
      store.set('streak', 0);
    }
  }

  /**
   * Record a correct answer. Returns the XP earned breakdown.
   * @param {number} responseTimeMs  how fast the child answered
   * @param {boolean} isNewWord      first time seeing this word
   * @returns {{ xpEarned: number, reasons: string[] }}
   */
  recordCorrect(responseTimeMs = 5000, isNewWord = false) {
    this._sessionCorrect++;
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

    // Streak bonuses
    const currentStreak = this._sessionCorrect;
    if (currentStreak === 5) {
      xpEarned += XP_REWARDS.streak_5;
      reasons.push('5 in a row!');
    } else if (currentStreak === 10) {
      xpEarned += XP_REWARDS.streak_10;
      reasons.push('10 in a row!');
    }

    // Apply XP
    const newXP = store.get('xp') + xpEarned;
    const oldLevel = store.get('level');
    const { level: newLevel, progress } = getLevelInfo(newXP);

    store.patch({
      xp: newXP,
      level: newLevel,
    });

    // Daily goal
    store.incrementDailyDone();
    const dailyDone = store.get('dailyDone');
    const dailyGoal = store.get('dailyGoal');
    if (dailyDone === dailyGoal) {
      xpEarned += XP_REWARDS.daily_goal;
      store.set('xp', store.get('xp') + XP_REWARDS.daily_goal);
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
   * Record a wrong answer. Decrements hearts.
   * @returns {{ heartsLeft: number, gameOver: boolean }}
   */
  recordWrong() {
    this._sessionCorrect = 0; // reset streak
    this._sessionWrong++;

    let hearts = store.get('hearts');
    hearts = Math.max(0, hearts - 1);
    store.set('hearts', hearts);

    this._updateUI();

    return {
      heartsLeft: hearts,
      gameOver: hearts <= 0,
    };
  }

  /** Refill hearts (called on timer or new session) */
  refillHearts() {
    store.set('hearts', 5);
    this._updateUI();
  }

  /** Get current session stats */
  getSessionStats() {
    return {
      correct: this._sessionCorrect,
      wrong:   this._sessionWrong,
      total:   this._sessionCorrect + this._sessionWrong,
      accuracy: this._sessionCorrect + this._sessionWrong > 0
        ? this._sessionCorrect / (this._sessionCorrect + this._sessionWrong)
        : 0,
    };
  }

  /** Reset session counters */
  resetSession() {
    this._sessionCorrect = 0;
    this._sessionWrong   = 0;
  }

  /** Update all header UI elements */
  _updateUI() {
    const heartsEl = document.getElementById('hearts-val');
    const streakEl = document.getElementById('streak-val');
    const xpEl     = document.getElementById('xp-val');
    const levelEl  = document.getElementById('level-val');
    const nextEl   = document.getElementById('level-next-val');
    const barEl    = document.getElementById('level-bar-fill');
    const goalFill = document.getElementById('goal-fill');
    const goalDone = document.getElementById('goal-done');
    const goalTotal = document.getElementById('goal-total');

    if (heartsEl) heartsEl.textContent = store.get('hearts');
    if (streakEl) streakEl.textContent = store.get('streak');
    if (xpEl) xpEl.textContent = store.get('xp');

    const { level, progress } = getLevelInfo(store.get('xp'));
    if (levelEl) levelEl.textContent = level;
    if (nextEl) nextEl.textContent = level + 1;
    if (barEl) barEl.style.width = `${Math.round(progress * 100)}%`;

    const done  = store.get('dailyDone');
    const total = store.get('dailyGoal');
    if (goalFill) goalFill.style.width = `${Math.min(100, Math.round((done / total) * 100))}%`;
    if (goalDone) goalDone.textContent = done;
    if (goalTotal) goalTotal.textContent = total;
  }
}

export const gamification = new Gamification();
