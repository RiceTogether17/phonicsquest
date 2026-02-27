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

class Gamification {
  constructor() {
    this._sessionCorrect = 0;
    this._sessionWrong   = 0;
  }

  /** Initialize: check daily reset, update streak, reset session energy */
  init() {
    store.checkDailyReset();
    this._checkStreak();
    store.resetEnergy();
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
   * Record a wrong answer. Drains one Giri Energy star.
   * @returns {{ energyLeft: number, needsRest: boolean }}
   */
  recordWrong() {
    this._sessionCorrect = 0; // reset session streak
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

  /** @deprecated kept for compat – use resetEnergy() */
  refillHearts() { this.resetEnergy(); }

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

  /** Trigger a brief pop/bump on a stat chip element */
  _bumpChip(el) {
    if (!el) return;
    const chip = el.closest('.stat-chip');
    if (!chip) return;
    chip.classList.remove('stat-chip--bump');
    void chip.offsetWidth; // reflow to restart animation
    chip.classList.add('stat-chip--bump');
    chip.addEventListener('animationend', () => chip.classList.remove('stat-chip--bump'), { once: true });
  }

  /** Update all header UI elements */
  _updateUI() {
    const energyEl  = document.getElementById('energy-display');
    const streakEl  = document.getElementById('streak-val');
    const xpEl      = document.getElementById('xp-val');
    const levelEl   = document.getElementById('level-val');
    const nextEl    = document.getElementById('level-next-val');
    const barEl     = document.getElementById('level-bar-fill');
    const goalFill  = document.getElementById('goal-fill');
    const goalDone  = document.getElementById('goal-done');
    const goalTotal = document.getElementById('goal-total');

    const prevEnergy = energyEl ? energyEl.querySelectorAll('.energy-star--full').length : null;
    const prevXp     = xpEl     ? Number(xpEl.textContent) : null;
    const prevStreak = streakEl  ? Number(streakEl.textContent) : null;

    // Render energy stars
    const energy = store.get('energy') ?? 3;
    if (energyEl) {
      energyEl.innerHTML = [0, 1, 2].map(i =>
        `<span class="energy-star ${i < energy ? 'energy-star--full' : 'energy-star--empty'}"
               aria-hidden="true">${i < energy ? '⭐' : '✩'}</span>`
      ).join('');
      energyEl.setAttribute('aria-label', `Giri energy: ${energy} of 3 stars`);
    }

    if (streakEl) streakEl.textContent = store.get('streak');
    if (xpEl) xpEl.textContent = store.get('xp');

    // Bump chips when values change
    if (prevEnergy !== null && energy < prevEnergy) this._bumpChip(energyEl);
    if (prevXp     !== null && store.get('xp')     > prevXp)     this._bumpChip(xpEl);
    if (prevStreak !== null && store.get('streak')  > prevStreak) this._bumpChip(streakEl);

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
