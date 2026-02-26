/**
 * PhonicsQuest – App Orchestrator
 *
 * Manages screens (home → game → result), mode lifecycle,
 * settings/dashboard modals, and keyboard shortcuts.
 */

import { store } from './modules/store.js';
import { audio } from './modules/audio.js';
import { gamification } from './modules/gamification.js';
import { badges } from './modules/badges.js';
import { progress } from './modules/progress.js';
import { speech } from './modules/speech.js';
import { mascot } from './components/mascot.js';
import { spinWheel, buildWordAnimation } from './components/wheel.js';
import { renderDashboard, destroyDashboard } from './components/dashboard.js';
import { celebrateCorrect, celebrateLevelUp, celebrateStreak, celebrateDailyGoal } from './components/confettiHelper.js';
import { MODES } from './modes/index.js';
import { initStoryMode, showBrowser, cleanupStoryMode } from './modes/storyMode.js';
import { initLetterSounds, cleanupLetterSounds } from './modes/letterSounds.js';
import { initSightMatch, showSightBrowser, cleanupSightMatch } from './modes/sightMatch.js';
import {
  getProfiles, createProfile, deleteProfile, activateProfile,
  getActiveProfile, needsProfileSelection, restoreActiveProfile,
  AVATAR_OPTIONS, COLOR_OPTIONS,
} from './modules/profiles.js';
import {
  getDailyChallengeWords, isDailyChallengeComplete,
  completeDailyChallenge, DAILY_BONUS_XP,
} from './modules/dailyChallenge.js';

class App {
  constructor() {
    /** @type {string} current screen id */
    this._screen = 'screen-home';
    /** @type {string} current mode key */
    this._mode = 'blend';
    /** @type {import('./data/words.js').Word|null} */
    this._currentWord = null;

    /** @type {boolean} whether a daily challenge session is active */
    this._dailyMode = false;
    /** @type {import('./data/words.js').Word[]} remaining daily words */
    this._dailyWordsQueue = [];
    /** @type {number} correct answers in current daily session */
    this._dailyCorrect = 0;

    // Cache DOM elements
    this._els = {};
  }

  /** Boot the application */
  init() {
    this._cacheElements();
    this._bindEvents();
    this._applySettings();

    // Restore active profile (if any) before any store reads
    restoreActiveProfile();

    // Init subsystems
    gamification.init();
    mascot.init();

    // Init spin wheel
    const canvas = document.getElementById('spin-wheel');
    if (canvas) spinWheel.init(canvas);

    // Show mic button only if speech recognition is supported
    const micBtn = document.getElementById('btn-mic');
    if (micBtn && !speech.supported) {
      micBtn.classList.add('hidden');
    }

    // Apply saved theme
    this._applyTheme(store.get('theme') || 'default');

    // Route to profile picker if needed
    if (needsProfileSelection()) {
      this._showScreen('screen-profiles');
      this._renderProfileGrid();
    } else {
      this._updateProfileChip();
    }

    this._updateDailyBanner();

    console.log('[PhonicsQuest] App initialized');
  }

  /** Cache frequently used DOM elements */
  _cacheElements() {
    this._els = {
      // Screens
      screenHome:   document.getElementById('screen-home'),
      screenGame:   document.getElementById('screen-game'),
      screenResult: document.getElementById('screen-result'),

      // Game elements
      wordDisplay:    document.getElementById('word-display'),
      wordEmoji:      document.getElementById('word-emoji'),
      phonemeRow:     document.getElementById('phoneme-row'),
      modeInstruction: document.getElementById('mode-instruction'),
      modeArea:       document.getElementById('mode-area'),

      // Buttons
      btnCheck: document.getElementById('btn-check'),
      btnSayIt: document.getElementById('btn-say-it'),
      btnSkip:  document.getElementById('btn-skip'),
      btnBack:  document.getElementById('btn-back'),
      btnNext:  document.getElementById('btn-next'),
      btnMic:   document.getElementById('btn-mic'),

      // Result
      resultBadge:   document.getElementById('result-badge'),
      resultMessage: document.getElementById('result-message'),
      resultWord:    document.getElementById('result-word-display'),
      resultXp:      document.getElementById('result-xp'),
      resultMascot:  document.getElementById('result-mascot'),

      // Speech
      speechBubble: document.getElementById('speech-bubble'),

      // Toast
      toastContainer: document.getElementById('toast-container'),
    };
  }

  /** Bind all event listeners */
  _bindEvents() {
    // Mode cards
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        this._mode = card.dataset.mode;
        store.set('currentMode', this._mode);
        this._startGame();
      });
    });

    // Spin wheel
    document.getElementById('spin-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('spin-btn');
      if (!btn || spinWheel.isSpinning) return;
      btn.disabled = true;
      try {
        const group = await spinWheel.spin();
        store.set('currentGroup', group);
        audio.playSfx('correct');
        // Start game in blend mode with that group
        this._mode = 'blend';
        setTimeout(() => this._startGame(group), 500);
      } catch (_) {}
      btn.disabled = false;
    });

    // Back button
    this._els.btnBack?.addEventListener('click', () => {
      this._cleanupMode();
      this._showScreen('screen-home');
      mascot.setHomeState('holdCard');
    });

    // Stories button (home → stories screen)
    document.getElementById('btn-stories')?.addEventListener('click', () => {
      initStoryMode(
        document.getElementById('stories-content'),
        () => {
          cleanupStoryMode();
          this._showScreen('screen-home');
          mascot.setHomeState('holdCard');
        },
      );
      showBrowser();
      this._showScreen('screen-stories');
      mascot.setState('celebrate');
      // Check badge for first story open
      badges.onStoriesOpened().forEach(b => badges.notify(b));
    });

    // Stories screen back button (→ home)
    document.getElementById('btn-stories-back')?.addEventListener('click', () => {
      cleanupStoryMode();
      this._showScreen('screen-home');
      mascot.setHomeState('holdCard');
    });

    // Letter Sounds button (home → letter sounds screen)
    document.getElementById('btn-letter-sounds')?.addEventListener('click', () => {
      initLetterSounds(
        document.getElementById('ls-content'),
        () => {
          cleanupLetterSounds();
          this._showScreen('screen-home');
          mascot.setHomeState('holdCard');
        },
      );
      this._showScreen('screen-letter-sounds');
      mascot.setState('whiteboard');
    });

    // Letter Sounds screen back button (→ home)
    document.getElementById('btn-ls-back')?.addEventListener('click', () => {
      cleanupLetterSounds();
      this._showScreen('screen-home');
      mascot.setHomeState('holdCard');
    });

    // Daily Challenge button
    document.getElementById('btn-daily-challenge')?.addEventListener('click', () => {
      if (isDailyChallengeComplete()) {
        this._showToast('Daily challenge already done! Come back tomorrow.', 'info');
        return;
      }
      this._startDailyChallenge();
    });

    // Sight Words button (home → sight match screen)
    document.getElementById('btn-sight-words')?.addEventListener('click', () => {
      initSightMatch(
        document.getElementById('sight-match-content'),
        () => {
          cleanupSightMatch();
          this._showScreen('screen-home');
          mascot.setHomeState('holdCard');
        },
      );
      showSightBrowser();
      this._showScreen('screen-sight-match');
      mascot.setState('celebrate');
    });

    // Sight Words screen back button (→ home)
    document.getElementById('btn-sm-back')?.addEventListener('click', () => {
      cleanupSightMatch();
      this._showScreen('screen-home');
      mascot.setHomeState('holdCard');
    });

    // Next word button
    this._els.btnNext?.addEventListener('click', () => {
      this._nextWord();
    });

    // Say It button
    this._els.btnSayIt?.addEventListener('click', () => {
      if (this._currentWord) audio.speakWord(this._currentWord.word);
    });

    // Skip button
    this._els.btnSkip?.addEventListener('click', () => {
      this._cleanupMode();
      this._nextWord();
    });

    // Mic button (speech recognition)
    this._els.btnMic?.addEventListener('click', () => {
      this._handleSpeechRecognition();
    });

    // Settings button
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      this._openModal('modal-settings');
    });

    // Dashboard button (PIN-gated)
    document.getElementById('dashboard-btn')?.addEventListener('click', () => {
      this._openModal('modal-pin');
      // Focus first PIN digit
      setTimeout(() => document.querySelector('.pin-digit')?.focus(), 200);
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        if (modalId) this._closeModal(modalId);
      });
    });

    // Modal overlay click-to-close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this._closeModal(overlay.id);
      });
    });

    // Settings bindings
    this._bindSettings();

    // PIN gate
    this._bindPinGate();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this._handleKeyboard(e));

    // Mascot tap (random cheer)
    document.getElementById('mascot-trigger')?.addEventListener('click', () => {
      mascot.clap();
      this._showToast(mascot.getCheer(), 'success');
      audio.playSfx('pop');
    });

    // Profile chip → show profile picker
    document.getElementById('profile-chip')?.addEventListener('click', () => {
      this._renderProfileGrid();
      this._showScreen('screen-profiles');
    });

    // Add profile button on profile screen
    document.getElementById('btn-add-profile')?.addEventListener('click', () => {
      this._openCreateProfileModal();
    });

    // Create profile modal close
    document.querySelector('[data-close="modal-create-profile"]')?.addEventListener('click', () => {
      this._closeModal('modal-create-profile');
    });
    document.getElementById('modal-create-profile')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal-create-profile')) {
        this._closeModal('modal-create-profile');
      }
    });

    // Confirm new profile creation
    document.getElementById('cp-confirm-btn')?.addEventListener('click', () => {
      this._confirmCreateProfile();
    });
    document.getElementById('cp-name-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._confirmCreateProfile();
    });
  }

  /** Start a game round */
  _startGame(group) {
    // Get next word (adaptive or daily)
    if (this._dailyMode && this._dailyWordsQueue.length > 0) {
      this._currentWord = this._dailyWordsQueue.shift();
    } else if (this._dailyMode) {
      // All daily words played — complete the challenge
      this._dailyMode = false;
      const bonusXp = completeDailyChallenge();
      if (bonusXp > 0) {
        celebrateDailyGoal();
        audio.playSfx('levelUp');
        this._showToast(`Daily Challenge done! +${bonusXp} bonus XP!`, 'success');
      } else {
        this._showToast('Daily Challenge already claimed today!', 'info');
      }
      this._updateDailyBanner();
      this._showScreen('screen-home');
      mascot.setHomeState('holdCard');
      return;
    } else {
      const opts = { maxLevel: store.get('difficulty') || 1 };
      if (group) opts.group = group;
      this._currentWord = progress.getNextWord(opts);
    }

    // Preload audio
    audio.preloadWord(this._currentWord);

    // Switch to game screen
    this._showScreen('screen-game');
    mascot.think();

    // Set up the mode
    const mode = MODES[this._mode];
    if (!mode) return;

    mode.setup(this._currentWord, {
      ...this._els,
      onResult: (correct, responseTime) => this._handleResult(correct, responseTime),
      onGroupChange: (group) => {
        // Teacher changed category in Listen & Blend — reload immediately
        this._cleanupMode();
        this._startGame(group || undefined);
      },
    });
  }

  /** Load the next word in the current mode */
  _nextWord() {
    this._cleanupMode();
    this._startGame(store.get('currentGroup'));
  }

  /** Handle a correct/wrong result from any mode */
  _handleResult(correct, responseTime) {
    const word = this._currentWord;
    if (!word) return;

    // Record progress
    const isNew = progress.isNewWord(word.id);
    progress.recordAttempt(word.id, correct, this._mode);

    if (correct) {
      // Gamification
      const reward = gamification.recordCorrect(responseTime, isNew);

      // Badges
      const newBadges = badges.onCorrect({
        fast: responseTime < 3000,
        sessionStreak: gamification.getSessionStats().correct,
        level: reward.newLevel,
        dayStreak: store.get('streak'),
        dailyComplete: reward.dailyComplete,
        mode: this._mode,
      });
      newBadges.forEach(b => badges.notify(b));

      // Celebrations
      mascot.celebrate(reward.levelUp);
      mascot.setResultState(reward.levelUp ? 'trophy' : 'confetti');

      if (reward.levelUp) {
        celebrateLevelUp();
        audio.playSfx('levelUp');
        this._showToast(`Level ${reward.newLevel}!`, 'success');
      } else {
        celebrateCorrect();
        audio.playSfx('correct');
      }

      if (reward.dailyComplete) {
        celebrateDailyGoal();
        this._showToast('Daily goal complete!', 'success');
      }

      // Show result screen
      this._showResultScreen(true, word, reward);

    } else {
      // Wrong
      const result = gamification.recordWrong();
      mascot.encourage();
      mascot.setResultState('encourage');
      audio.playSfx('wrong');

      this._showResultScreen(false, word, null);

      if (result.gameOver) {
        this._showToast('Hearts refilled! Take a break?', 'warning');
        setTimeout(() => gamification.refillHearts(), 2000);
      }
    }
  }

  /** Show the result screen with appropriate content */
  _showResultScreen(correct, word, reward) {
    this._showScreen('screen-result');

    if (correct) {
      this._els.resultBadge.textContent = '🌟';
      this._els.resultMessage.textContent = mascot.getCheer();
      this._els.resultMessage.style.color = 'var(--color-success)';
      this._els.resultXp.textContent = reward ? `+${reward.xpEarned} XP` : '+10 XP';
      this._els.resultXp.style.display = '';
    } else {
      this._els.resultBadge.textContent = '💪';
      this._els.resultMessage.textContent = mascot.getEncouragement();
      this._els.resultMessage.style.color = 'var(--color-error)';
      this._els.resultXp.style.display = 'none';
    }

    this._els.resultWord.textContent = word.emoji + ' ' + word.word;
    this._els.btnNext.focus();
  }

  /** Switch visible screen with animation */
  _showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
      if (screen.id === screenId) {
        screen.classList.remove('exit');
        screen.classList.add('active');
      } else if (screen.classList.contains('active')) {
        screen.classList.remove('active');
        screen.classList.add('exit');
        setTimeout(() => screen.classList.remove('exit'), 400);
      }
    });
    this._screen = screenId;
  }

  /** Cleanup current mode */
  _cleanupMode() {
    const mode = MODES[this._mode];
    mode?.cleanup();
  }

  /** Handle speech recognition flow */
  async _handleSpeechRecognition() {
    if (!this._currentWord || !speech.supported) return;
    const btn = this._els.btnMic;
    if (!btn) return;

    if (speech.isListening) {
      speech.stop();
      btn.setAttribute('aria-pressed', 'false');
      return;
    }

    btn.setAttribute('aria-pressed', 'true');

    const result = await speech.listen(this._currentWord.word);

    btn.setAttribute('aria-pressed', 'false');

    if (!result) {
      this._showSpeechBubble('I didn\'t hear anything. Try again!');
      return;
    }

    if (result.correct) {
      this._showSpeechBubble(`I heard "${result.heard}" – ${result.score}% match! Great job!`);
      // Auto-mark as correct
      setTimeout(() => this._handleResult(true, 3000), 1200);
    } else {
      this._showSpeechBubble(`I heard "${result.heard}" – ${result.score}% match. Try saying "${this._currentWord.word}" more clearly!`);
    }
  }

  /** Show speech bubble with result */
  _showSpeechBubble(text) {
    const bubble = this._els.speechBubble;
    if (!bubble) return;
    bubble.textContent = text;
    bubble.hidden = false;
    setTimeout(() => { bubble.hidden = true; }, 4000);
  }

  // ── Settings ──

  _bindSettings() {
    // Theme swatches
    document.querySelectorAll('.theme-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const theme = swatch.dataset.theme;
        this._applyTheme(theme);
        store.set('theme', theme);
        document.querySelectorAll('.theme-swatch').forEach(s => {
          s.classList.toggle('active', s.dataset.theme === theme);
          s.setAttribute('aria-pressed', s.dataset.theme === theme);
        });
      });
    });

    // SFX toggle
    document.getElementById('sfx-toggle')?.addEventListener('change', (e) => {
      store.set('sfxEnabled', e.target.checked);
    });

    // Autoplay toggle
    document.getElementById('autoplay-toggle')?.addEventListener('change', (e) => {
      store.set('autoplay', e.target.checked);
    });

    // Voice speed
    document.getElementById('voice-speed')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      store.set('voiceSpeed', val);
      const display = document.getElementById('voice-speed-display');
      if (display) display.textContent = `${val}×`;
    });

    // Difficulty buttons
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const diff = parseInt(btn.dataset.diff);
        store.set('difficulty', diff);
        document.querySelectorAll('.diff-btn').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.diff) === diff);
          b.setAttribute('aria-pressed', parseInt(b.dataset.diff) === diff);
        });
      });
    });

    // Daily goal slider
    document.getElementById('goal-range')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      store.set('dailyGoal', val);
      const display = document.getElementById('goal-range-display');
      if (display) display.textContent = val;
      document.getElementById('goal-total').textContent = val;
    });

    // Reset progress
    document.getElementById('reset-progress-btn')?.addEventListener('click', () => {
      if (confirm('This will erase all progress. Are you sure?')) {
        store.reset();
        badges.reset();
        gamification.init();
        this._showToast('Progress reset!', 'warning');
        this._closeModal('modal-settings');
      }
    });
  }

  _applySettings() {
    // Apply saved settings to UI
    const sfx = document.getElementById('sfx-toggle');
    if (sfx) sfx.checked = store.get('sfxEnabled');

    const autoplay = document.getElementById('autoplay-toggle');
    if (autoplay) autoplay.checked = store.get('autoplay');

    const speed = document.getElementById('voice-speed');
    if (speed) speed.value = store.get('voiceSpeed');
    const speedDisplay = document.getElementById('voice-speed-display');
    if (speedDisplay) speedDisplay.textContent = `${store.get('voiceSpeed')}×`;

    const diff = store.get('difficulty') || 1;
    document.querySelectorAll('.diff-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.diff) === diff);
      b.setAttribute('aria-pressed', parseInt(b.dataset.diff) === diff);
    });

    const goal = store.get('dailyGoal') || 10;
    const goalRange = document.getElementById('goal-range');
    if (goalRange) goalRange.value = goal;
    const goalDisplay = document.getElementById('goal-range-display');
    if (goalDisplay) goalDisplay.textContent = goal;
  }

  _applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // ── PIN Gate ──

  _bindPinGate() {
    const digits = document.querySelectorAll('.pin-digit');
    const hint = document.getElementById('pin-hint');

    // Auto-advance PIN inputs
    digits.forEach((input, i) => {
      input.addEventListener('input', (e) => {
        if (e.target.value && i < digits.length - 1) {
          digits[i + 1].focus();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && i > 0) {
          digits[i - 1].focus();
        }
      });
    });

    // Confirm PIN
    document.getElementById('pin-confirm-btn')?.addEventListener('click', () => {
      const pin = Array.from(digits).map(d => d.value).join('');
      if (pin.length < 4) {
        if (hint) hint.textContent = 'Enter all 4 digits';
        return;
      }

      const savedPin = store.get('parentPin');

      if (!savedPin) {
        // First time: set the PIN
        store.set('parentPin', pin);
        if (hint) hint.textContent = '';
        this._closeModal('modal-pin');
        this._openDashboard();
      } else if (pin === savedPin) {
        // Correct PIN
        if (hint) hint.textContent = '';
        this._closeModal('modal-pin');
        this._openDashboard();
      } else {
        // Wrong PIN
        if (hint) hint.textContent = 'Wrong PIN. Try again.';
        digits.forEach(d => { d.value = ''; });
        digits[0].focus();
      }
    });

    // Cancel PIN
    document.getElementById('pin-cancel-btn')?.addEventListener('click', () => {
      this._closeModal('modal-pin');
      document.querySelectorAll('.pin-digit').forEach(d => { d.value = ''; });
    });
  }

  _openDashboard() {
    this._openModal('modal-dashboard');
    const container = document.getElementById('dashboard-content');
    if (container) renderDashboard(container);
  }

  // ── Modals ──

  _openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;

    // Trap focus
    const focusable = modal.querySelectorAll('button, input, [tabindex]');
    if (focusable.length) focusable[0].focus();

    // Escape to close
    const handler = (e) => {
      if (e.key === 'Escape') {
        this._closeModal(id);
        document.removeEventListener('keydown', handler);
      }
    };
    document.addEventListener('keydown', handler);
  }

  _closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = true;

    // Cleanup dashboard chart
    if (id === 'modal-dashboard') destroyDashboard();
  }

  // ── Toast ──

  _showToast(message, type = 'info') {
    const container = this._els.toastContainer;
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  // ── Profiles ──

  _renderProfileGrid() {
    const grid = document.getElementById('profile-grid');
    if (!grid) return;
    const profiles = getProfiles();
    const activeProfile = getActiveProfile();

    if (profiles.length === 0) {
      grid.innerHTML = '<p class="profile-empty">No players yet. Add one below!</p>';
      return;
    }

    grid.innerHTML = profiles.map(p => `
      <div class="profile-card ${activeProfile?.id === p.id ? 'profile-card--active' : ''}"
           role="listitem">
        <button class="profile-select-btn" data-profile-id="${p.id}"
                aria-label="Play as ${p.name}${activeProfile?.id === p.id ? ' (current)' : ''}">
          <span class="profile-avatar" style="background:${p.color}20;border-color:${p.color}">
            ${p.avatar}
          </span>
          <span class="profile-name">${p.name}</span>
          ${activeProfile?.id === p.id ? '<span class="profile-active-badge">●</span>' : ''}
        </button>
        ${profiles.length > 1 ? `
          <button class="profile-delete-btn" data-delete-id="${p.id}"
                  aria-label="Delete ${p.name}'s profile">✕</button>
        ` : ''}
      </div>
    `).join('');

    grid.querySelectorAll('.profile-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.profileId;
        activateProfile(id);
        gamification.init();
        this._updateProfileChip();
        this._showScreen('screen-home');
        mascot.setHomeState('holdCard');
        audio.playSfx('correct');
      });
    });

    grid.querySelectorAll('.profile-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.deleteId;
        const name = getProfiles().find(p => p.id === id)?.name || 'this player';
        if (confirm(`Delete ${name}'s profile and all progress?`)) {
          deleteProfile(id);
          this._renderProfileGrid();
        }
      });
    });
  }

  _updateProfileChip() {
    const chip = document.getElementById('profile-chip');
    const avatar = document.getElementById('profile-chip-avatar');
    const name   = document.getElementById('profile-chip-name');
    const profiles = getProfiles();

    if (!chip) return;
    if (profiles.length <= 1) {
      chip.style.display = 'none';
      return;
    }

    const profile = getActiveProfile();
    if (!profile) { chip.style.display = 'none'; return; }

    chip.style.display = '';
    chip.style.setProperty('--profile-color', profile.color);
    if (avatar) avatar.textContent = profile.avatar;
    if (name)   name.textContent   = profile.name;
  }

  _openCreateProfileModal() {
    // Populate avatar picker
    const row = document.getElementById('cp-avatar-row');
    if (row) {
      row.innerHTML = AVATAR_OPTIONS.map((av, i) => `
        <button class="cp-avatar-btn ${i === 0 ? 'cp-avatar-btn--selected' : ''}"
                data-avatar="${av}" aria-label="${av}" aria-pressed="${i === 0}">
          ${av}
        </button>
      `).join('');

      row.querySelectorAll('.cp-avatar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          row.querySelectorAll('.cp-avatar-btn').forEach(b => {
            b.classList.remove('cp-avatar-btn--selected');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('cp-avatar-btn--selected');
          btn.setAttribute('aria-pressed', 'true');
        });
      });
    }

    const input = document.getElementById('cp-name-input');
    if (input) input.value = '';

    this._openModal('modal-create-profile');
    setTimeout(() => input?.focus(), 200);
  }

  _confirmCreateProfile() {
    const name = document.getElementById('cp-name-input')?.value.trim();
    if (!name) {
      document.getElementById('cp-name-input')?.focus();
      return;
    }

    const selectedAvatarBtn = document.querySelector('.cp-avatar-btn--selected');
    const avatar = selectedAvatarBtn?.dataset.avatar || AVATAR_OPTIONS[0];
    const colorIdx = getProfiles().length % COLOR_OPTIONS.length;
    const color = COLOR_OPTIONS[colorIdx];

    const profile = createProfile(name, avatar, color);
    this._closeModal('modal-create-profile');

    activateProfile(profile.id);
    gamification.init();
    this._updateProfileChip();
    this._renderProfileGrid();

    // If this is the first profile, go straight to home
    if (getProfiles().length === 1) {
      this._showScreen('screen-home');
      mascot.setHomeState('holdCard');
    }
    audio.playSfx('correct');
  }

  // ── Daily Challenge ──

  _startDailyChallenge() {
    this._dailyMode = true;
    this._dailyWordsQueue = getDailyChallengeWords();
    this._dailyCorrect = 0;
    this._mode = 'blend';
    store.set('currentGroup', null);
    this._showToast(`Today's 5 words – go! ⚡`, 'info');
    this._startGame();
  }

  _updateDailyBanner() {
    const done = isDailyChallengeComplete();
    const title = document.getElementById('daily-banner-title');
    const sub   = document.getElementById('daily-banner-sub');
    const arrow = document.getElementById('daily-banner-arrow');

    if (title) title.textContent = done ? '✅ Daily Challenge' : '⚡ Daily Challenge';
    if (sub)   sub.textContent   = done ? 'Completed today – well done!' : `5 words · earn ${DAILY_BONUS_XP} bonus XP`;
    if (arrow) arrow.textContent = done ? '✓' : '→';

    const banner = document.getElementById('btn-daily-challenge');
    if (banner) banner.classList.toggle('stories-banner--done', done);
  }

  // ── Keyboard Shortcuts ──

  _handleKeyboard(e) {
    // Only when on game screen
    if (this._screen !== 'screen-game') return;

    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        // Trigger primary action (reveal / check)
        document.getElementById('btn-reveal-next')?.click();
        break;
      case 's':
        this._els.btnSayIt?.click();
        break;
      case 'Escape':
        this._els.btnBack?.click();
        break;
      case 'n':
        if (this._screen === 'screen-result') {
          this._els.btnNext?.click();
        }
        break;
    }
  }
}

export const app = new App();
