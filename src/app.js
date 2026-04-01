/**
 * PhonicsQuest – App Orchestrator
 *
 * Manages screens (home → game → result), mode lifecycle,
 * settings/dashboard modals, and keyboard shortcuts.
 *
 * Architecture note: domain concerns have been extracted into focused modules:
 *   - constants.js          → SCREENS enum, QUEST_THRESHOLDS
 *   - modalManager.js       → open/close lifecycle, Escape-key cleanup
 *   - keyboardManager.js    → global keyboard shortcuts (fixes 'n' bug)
 *   - settingsController.js → settings panel binding & value application
 */

import { store } from './modules/store.js';
import { audio } from './modules/audio.js';
import { gamification } from './modules/gamification.js';
import { badges } from './modules/badges.js';
import { progress } from './modules/progress.js';
import { speech, calculateCalibrationThreshold } from './modules/speech.js';
import { mascot } from './components/mascot.js';
import { spinWheel, buildWordAnimation } from './components/wheel.js';
import { renderDashboard, destroyDashboard } from './components/dashboard.js';
import { celebrateCorrect, celebrateLevelUp, celebrateStreak, celebrateDailyGoal } from './components/confettiHelper.js';
import { MODES } from './modes/index.js';
import { getRecommendation, getDailyPlan, getLearnerSummaryChips } from './modules/recommendations.js';
import { initStoryMode, showBrowser, cleanupStoryMode } from './modes/storyMode.js';
import { initLetterSounds, cleanupLetterSounds } from './modes/letterSounds.js';
import { initSightMatch, showSightBrowser, cleanupSightMatch } from './modes/sightMatch.js';
import { initSentenceForge, showSentenceBrowser, cleanupSentenceForge } from './modes/sentenceForge.js';
import { initClozeCastle, showClozeBrowser, cleanupClozeCastle } from './modes/clozeCastle.js';
import { initWordVault, showVaultBrowser, cleanupWordVault } from './modes/wordVault.js';
import { initEditingQuest, showEditingBrowser, cleanupEditingQuest } from './modes/editingQuest.js';
import { initWritingQuest, showWritingBrowser, cleanupWritingQuest } from './modes/writingQuest.js';
import {
  getProfiles, createProfile, deleteProfile, activateProfile,
  getActiveProfile, needsProfileSelection, restoreActiveProfile,
  exportProfile, importProfile,
  AVATAR_OPTIONS, COLOR_OPTIONS,
} from './modules/profiles.js';
import {
  getDailyChallengeWords, isDailyChallengeComplete,
  completeDailyChallenge, DAILY_BONUS_XP,
} from './modules/dailyChallenge.js';
import {
  CURRICULUM, PHASE_LABELS, getUnlockedStages, getRecommendedStage,
} from './data/curriculum.js';
import { SCREENS, QUEST_THRESHOLDS } from './constants.js';
import { modalManager } from './modules/modalManager.js';
import { keyboardManager } from './modules/keyboardManager.js';
import { settingsController } from './modules/settingsController.js';
import { getQuestUnlockStatus } from './modules/questUnlocks.js';
import { showPlacementTest } from './modules/placementTest.js';
import { getReadingBand } from './modules/readingStages.js';
import { showSessionSummary } from './components/sessionSummary.js';
import { showWeeklyRecap, shouldShowWeeklyRecap } from './components/weeklyRecap.js';

async function hashPin(pin) {
  if (!window.crypto?.subtle) return `plain:${pin}`;
  const data = new TextEncoder().encode(pin);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `sha256:${hex}`;
}

function isHashedPin(value) {
  return typeof value === 'string' && (value.startsWith('sha256:') || value.startsWith('plain:'));
}

class App {
  constructor() {
    /** @type {string} current screen id */
    this._screen = SCREENS.HOME;
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

    /** @type {boolean} hint used for current word (no heart loss on 1st wrong if unused) */
    this._hintUsed = false;
    /** @type {number} wrong attempts on current word (for two-strike system) */
    this._wrongStrikes = 0;

    /**
     * Guard flag – prevents _handleResult from being called twice for the
     * same word (e.g. rapid button clicks, or a delayed speech-recognition
     * timeout firing after the user has already moved to the next word).
     * @type {boolean}
     */
    this._resultProcessing = false;

    // Cache DOM elements
    this._els = {};
  }

  /** Boot the application */
  init() {
    this._cacheElements();
    this._bindEvents();

    // Apply persisted settings to the UI (uses settingsController).
    settingsController.apply(store);

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
    settingsController.applyTheme(store.get('theme') || 'default');

    // Route to profile picker if needed
    if (needsProfileSelection()) {
      this._showScreen(SCREENS.PROFILES);
      this._renderProfileGrid();
    } else {
      this._updateProfileChip();
      // Returning user — increment total sessions and run return-event checks
      store.set('totalSessions', (store.get('totalSessions') || 0) + 1);
      setTimeout(() => this._checkReturnEvents(), 800);
    }

    this._updateDailyBanner();
    this._updateQuestBanners();
    this._renderGuidedJourney();

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
      btnHint:  document.getElementById('btn-hint'),
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
        if (this._mode === 'blend') {
          // Show curriculum stage picker before starting Blend It!
          this._openBlendPicker();
        } else {
          // For Listen & Blend, respect the saved category so the first word
          // matches the dropdown that is pre-populated from the store.
          // For all other modes keep the same behaviour as _nextWord().
          this._startGame(store.get('currentGroup') || undefined);
        }
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
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    // Stories button (home → stories screen)
    document.getElementById('btn-stories')?.addEventListener('click', () => {
      initStoryMode(
        document.getElementById('stories-content'),
        () => {
          cleanupStoryMode();
          this._showScreen(SCREENS.HOME);
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
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    // Letter Sounds button (home → letter sounds screen)
    document.getElementById('btn-letter-sounds')?.addEventListener('click', () => {
      initLetterSounds(
        document.getElementById('ls-content'),
        () => {
          cleanupLetterSounds();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      this._showScreen('screen-letter-sounds');
      mascot.setState('whiteboard');
    });

    // Letter Sounds screen back button (→ home)
    document.getElementById('btn-ls-back')?.addEventListener('click', () => {
      cleanupLetterSounds();
      this._showScreen(SCREENS.HOME);
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
          this._showScreen(SCREENS.HOME);
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
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    // Sentence Forge Quest button (home → sentence-forge screen)
    document.getElementById('btn-sentence-forge')?.addEventListener('click', () => {
      const unlock = this._getQuestUnlockStatus();
      if (!unlock.sentenceForge.unlocked) {
        this._showToast(`Master ${unlock.sentenceForge.required} words to unlock! (${unlock.sentenceForge.current} so far)`, 'warning');
        return;
      }
      initSentenceForge(
        document.getElementById('sentence-forge-content'),
        () => {
          cleanupSentenceForge();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      showSentenceBrowser();
      this._showScreen('screen-sentence-forge');
      mascot.setState('celebrate');
    });

    // Sentence Forge screen back button (→ home)
    document.getElementById('btn-sfq-back')?.addEventListener('click', () => {
      cleanupSentenceForge();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    // Cloze Castle Quest button (home → cloze-castle screen)
    document.getElementById('btn-cloze-castle')?.addEventListener('click', () => {
      const unlock = this._getQuestUnlockStatus();
      if (!unlock.clozeCastle.unlocked) {
        this._showToast(`Master ${unlock.clozeCastle.required} words to unlock! (${unlock.clozeCastle.current} so far)`, 'warning');
        return;
      }
      initClozeCastle(
        document.getElementById('cloze-castle-content'),
        () => {
          cleanupClozeCastle();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      showClozeBrowser();
      this._showScreen('screen-cloze-castle');
      mascot.setState('celebrate');
    });

    // Cloze Castle screen back button (→ home)
    document.getElementById('btn-ccq-back')?.addEventListener('click', () => {
      cleanupClozeCastle();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    // Word Vault Quest button (home → word-vault screen)
    document.getElementById('btn-word-vault')?.addEventListener('click', () => {
      const unlock = this._getQuestUnlockStatus();
      if (!unlock.wordVault.unlocked) {
        this._showToast(`Master ${unlock.wordVault.required} words to unlock! (${unlock.wordVault.current} so far)`, 'warning');
        return;
      }
      initWordVault(
        document.getElementById('word-vault-content'),
        () => {
          cleanupWordVault();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      showVaultBrowser();
      this._showScreen('screen-word-vault');
      mascot.setState('celebrate');
    });

    // Word Vault screen back button (→ home)
    document.getElementById('btn-wvq-back')?.addEventListener('click', () => {
      cleanupWordVault();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    // Editing Quest button (home → editing quest screen)
    document.getElementById('btn-editing-quest')?.addEventListener('click', () => {
      const unlock = this._getQuestUnlockStatus();
      if (!unlock.editingQuest.unlocked) {
        this._showToast(`Master ${unlock.editingQuest.required} words to unlock! (${unlock.editingQuest.current} so far)`, 'warning');
        return;
      }
      initEditingQuest(
        document.getElementById('editing-quest-content'),
        () => {
          cleanupEditingQuest();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      showEditingBrowser();
      this._showScreen(SCREENS.EDITING_QUEST);
      mascot.setState('whiteboard');
    });

    document.getElementById('btn-eq-back')?.addEventListener('click', () => {
      cleanupEditingQuest();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-writing-quest')?.addEventListener('click', () => {
      const unlock = this._getQuestUnlockStatus();
      if (!unlock.writingQuest.unlocked) {
        this._showToast(`Master ${unlock.writingQuest.required} words to unlock! (${unlock.writingQuest.current} so far)`, 'warning');
        return;
      }
      initWritingQuest(
        document.getElementById('writing-quest-content'),
        () => {
          cleanupWritingQuest();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      showWritingBrowser();
      this._showScreen(SCREENS.WRITING_QUEST);
      mascot.setState('whiteboard');
    });

    document.getElementById('btn-writing-back')?.addEventListener('click', () => {
      cleanupWritingQuest();
      this._showScreen(SCREENS.HOME);
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

    // Hint button — play first phoneme sound; no heart penalty on next wrong
    this._els.btnHint?.addEventListener('click', () => {
      this._giveHint();
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

    document.getElementById('btn-calibrate-mic')?.addEventListener('click', () => {
      this._runMicCalibration();
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

    // Settings bindings (via settingsController)
    settingsController.bind({
      store,
      badges,
      gamification,
      closeModal : (id) => this._closeModal(id),
      onReset    : () => this._showToast('Progress reset!', 'warning'),
    });

    // PIN gate
    this._bindPinGate();

    // Keyboard shortcuts (via keyboardManager – fixes the 'n' shortcut bug)
    keyboardManager.init({
      getScreen   : () => this._screen,
      els         : this._els,
      onHome      : () => this._showScreen(SCREENS.HOME),
      modalManager,
    });

    // Mascot tap (random cheer)
    document.getElementById('mascot-trigger')?.addEventListener('click', () => {
      mascot.clap();
      this._showToast(mascot.getCheer(), 'success');
      audio.playSfx('pop');
    });

    // Profile chip → show profile picker
    document.getElementById('profile-chip')?.addEventListener('click', () => {
      this._renderProfileGrid();
      this._showScreen(SCREENS.PROFILES);
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
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
      return;
    } else {
      // Use per-mode difficulty if available, falling back to global setting
      const modeDiffs = store.get('modeDifficulty') || {};
      const effectiveDiff = modeDiffs[this._mode] ?? store.get('difficulty') ?? 1;
      const opts = { maxLevel: effectiveDiff, mode: this._mode };
      if (group) opts.group = group;
      this._currentWord = progress.getNextWord(opts);
    }

    // Preload audio
    audio.preloadWord(this._currentWord);

    // Reset per-word state (hint, strikes, and the double-submit guard).
    this._hintUsed = false;
    this._wrongStrikes = 0;
    this._resultProcessing = false;
    this._els.btnHint?.classList.remove('used');
    this._els.btnHint?.removeAttribute('aria-disabled');

    // Switch to game screen
    this._showScreen(SCREENS.GAME);
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

    // Prevent double-submission: rapid button clicks or a delayed speech-
    // recognition timeout firing after the word has already been evaluated.
    if (this._resultProcessing) return;
    this._resultProcessing = true;

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

      // Track today's session XP
      store.addSessionXp(reward.xpEarned || 0);

      if (reward.dailyComplete) {
        celebrateDailyGoal();
        // Show session summary after a brief result screen pause
        setTimeout(() => this._showSessionSummaryScreen(reward), 1800);
      }

      // Show result screen
      this._showResultScreen(true, word, reward);

      // Check if per-mode difficulty should adjust
      this._adjustModeDifficulty();

    } else {
      // Wrong — shake the phoneme row before transitioning
      const phonemeRow = document.getElementById('phoneme-row');
      phonemeRow?.classList.remove('phoneme-row--shake');
      // Force reflow so animation restarts if already applied
      void phonemeRow?.offsetWidth;
      phonemeRow?.classList.add('phoneme-row--shake');
      setTimeout(() => phonemeRow?.classList.remove('phoneme-row--shake'), 500);

      this._wrongStrikes++;

      // Two-strike system: first wrong with no hint used = gentle nudge, no heart loss
      if (this._wrongStrikes === 1 && !this._hintUsed) {
        mascot.encourage();
        audio.playSfx('wrong');
        this._showToast('Almost! Try the 💡 Hint to hear the first sound.', 'warning');
        // Pulse the hint button to draw attention
        this._els.btnHint?.classList.remove('btn--hint-pulse');
        void this._els.btnHint?.offsetWidth;
        this._els.btnHint?.classList.add('btn--hint-pulse');
        this._els.btnHint?.addEventListener('animationend', () => {
          this._els.btnHint?.classList.remove('btn--hint-pulse');
        }, { once: true });
        // Allow the next wrong attempt to be processed.
        this._resultProcessing = false;
        return; // Stay on game screen — no result screen yet
      }

      const result = gamification.recordWrong();
      mascot.encourage();
      mascot.setResultState('encourage');
      audio.playSfx('wrong');

      this._showResultScreen(false, word, null);
      this._adjustModeDifficulty();

      if (result.needsRest) {
        this._showToast('Take a short break — Giri needs rest! ⭐', 'warning');
        setTimeout(() => gamification.resetEnergy(), 2000);
      }
    }

    // Reset guard so the next word can be submitted.
    this._resultProcessing = false;
  }

  /** Show the result screen with appropriate content */
  _showResultScreen(correct, word, reward) {
    this._showScreen(SCREENS.RESULT);

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

    // Refresh quest banners and guided journey when returning home
    if (screenId === SCREENS.HOME) {
      this._updateQuestBanners();
      this._renderGuidedJourney();
    }
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

    // Snapshot the word ID *before* the await so we can verify the user
    // hasn't moved to a different word by the time the timeout fires.
    const recognisedWordId = this._currentWord.id;

    const result = await speech.listen(this._currentWord.word);

    btn.setAttribute('aria-pressed', 'false');

    if (!result) {
      this._showSpeechBubble('I didn\'t hear anything. Try again!');
      return;
    }

    if (result.correct) {
      this._showSpeechBubble(`I heard "${result.heard}" – ${result.score}% match! Great job!`);
      // Auto-mark as correct — but only if the word hasn't changed while we
      // were waiting (guards against double-submission on rapid navigation).
      setTimeout(() => {
        if (this._currentWord?.id === recognisedWordId) {
          this._handleResult(true, 3000);
        }
      }, 1200);
    } else {
      this._showSpeechBubble(`I heard "${result.heard}" – ${result.score}% match. Try saying "${this._currentWord.word}" more clearly!`, {
        allowOverride: true,
        recognisedWordId,
      });
    }
  }

  /**
   * Give a hint: play the first phoneme of the current word.
   * Marks hint as used so the two-strike grace no longer applies.
   */
  async _giveHint() {
    if (!this._currentWord) return;
    if (this._hintUsed) return; // Only one hint per word

    this._hintUsed = true;

    // Mark button as used
    const btn = this._els.btnHint;
    if (btn) {
      btn.classList.add('used');
      btn.setAttribute('aria-disabled', 'true');
    }

    // Play first phoneme sound
    const firstGrapheme = this._currentWord.graphemes[0];
    const firstType     = this._currentWord.types[0];
    await audio.speakPhoneme(firstGrapheme, firstType);

    // Highlight the first phoneme tile briefly
    const firstTile = document.querySelector('#phoneme-row .phoneme-tile');
    if (firstTile) {
      firstTile.classList.add('active');
      setTimeout(() => firstTile.classList.remove('active'), 600);
    }
  }

  /** Show speech bubble with result */
  _showSpeechBubble(text, opts = {}) {
    const bubble = this._els.speechBubble;
    if (!bubble) return;

    bubble.innerHTML = `<span>${text}</span>`;

    if (opts.allowOverride) {
      const btn = document.createElement('button');
      btn.className = 'btn btn--ghost btn--sm';
      btn.textContent = 'Mark Correct';
      btn.style.marginTop = '8px';
      btn.addEventListener('click', () => this._applyManualSpeechOverride(opts.recognisedWordId));
      bubble.appendChild(btn);
    }

    bubble.hidden = false;
    setTimeout(() => { bubble.hidden = true; }, opts.allowOverride ? 6500 : 4000);
  }

  _applyManualSpeechOverride(recognisedWordId) {
    if (!this._currentWord || this._currentWord.id !== recognisedWordId) return;

    progress.recordAttempt(this._currentWord.id, true, this._mode);
    gamification.recordCorrect(2500, false);
    this._showToast('Manual override applied: marked as correct.', 'success');

    this._els.speechBubble && (this._els.speechBubble.hidden = true);
    this._cleanupMode();
    this._nextWord();
  }

  async _runMicCalibration() {
    const status = document.getElementById('calibrate-mic-status');
    if (!speech.supported) {
      if (status) status.textContent = 'Speech recognition is not supported on this device.';
      return;
    }

    const sampleWords = ['cat', 'dog', 'fish'];
    const scores = [];

    alert('Mic calibration: you will be asked to say 3 sample words.');

    for (const word of sampleWords) {
      alert(`Please say: ${word}`);
      const result = await speech.listen(word);
      if (result?.rawScore != null) scores.push(result.rawScore);
    }

    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0.75;
    const threshold = calculateCalibrationThreshold(avg);
    store.set('speechThreshold', threshold);

    if (status) status.textContent = `Calibrated threshold: ${Math.round(threshold * 100)}%`;
    const sensitivity = document.getElementById('speech-sensitivity');
    if (sensitivity) sensitivity.value = String(Math.round(threshold * 100));
    const display = document.getElementById('speech-sensitivity-display');
    if (display) display.textContent = `${Math.round(threshold * 100)}%`;
  }

  // ── Settings ──
  // Binding and value-application have been extracted to settingsController.js.

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
    document.getElementById('pin-confirm-btn')?.addEventListener('click', async () => {
      const pin = Array.from(digits).map(d => d.value).join('');
      if (pin.length < 4) {
        if (hint) hint.textContent = 'Enter all 4 digits';
        return;
      }

      const savedPin = store.get('parentPin');
      const candidateHash = await hashPin(pin);

      if (!savedPin) {
        // First time: store hashed PIN
        store.set('parentPin', candidateHash);
        if (hint) hint.textContent = '';
        this._closeModal('modal-pin');
        this._openDashboard();
      } else if (savedPin === pin || savedPin === candidateHash || savedPin === `plain:${pin}`) {
        // Migrate legacy plaintext pins to hashed format.
        if (!isHashedPin(savedPin)) {
          store.set('parentPin', candidateHash);
        }
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

  // ── Onboarding Tutorial ──

  /**
   * Show the first-run onboarding tutorial modal.
   * 4 screens explain: pathway, daily order, Best Next Step card, bonus activities.
   * Stores a flag so it only shows once per install.
   * @param {object} profile - the newly activated profile
   */
  _showOnboardingTutorial(profile) {
    const isPrimary = profile?.schoolLevel === 'primary';
    const levelKey  = isPrimary ? 'primary' : 'preschool';

    const TUTORIAL = {
      preschool: [
        {
          icon: '🌱',
          title: "Your child's Preschool Journey",
          body: `<p class="ob-intro">PhonicsQuest guides your child through three daily activities:</p>
                 <ul class="ob-list">
                   <li><strong>🎯 Blend It!</strong> — sound out letters to make words</li>
                   <li><strong>👂 Sound skills</strong> — first, last &amp; middle sounds</li>
                   <li><strong>📚 Giri Stories</strong> — read a short phonics story</li>
                 </ul>`,
        },
        {
          icon: '📋',
          title: 'Follow this order each day',
          body: `<div class="ob-steps">
                   <div class="ob-step">
                     <span class="ob-step-num">1</span>
                     <div><strong>Start with Blend It!</strong><br><small>Step-by-step sound blending</small></div>
                   </div>
                   <div class="ob-step">
                     <span class="ob-step-num">2</span>
                     <div><strong>Practise one sound skill</strong><br><small>First Sound or Hear &amp; Choose</small></div>
                   </div>
                   <div class="ob-step">
                     <span class="ob-step-num">3</span>
                     <div><strong>Read one Giri Story</strong><br><small>Short decodable phonics story</small></div>
                   </div>
                 </div>`,
        },
        {
          icon: '⭐',
          title: 'Look for this card every day',
          body: `<div class="ob-highlight-card">
                   <div class="ob-highlight-eyebrow">TODAY'S START POINT</div>
                   <p class="ob-highlight-title">Best Next Step</p>
                   <p class="ob-highlight-body">This card is always first on the home screen. It tells you <strong>exactly which activity</strong> to start with today, based on your child's progress.</p>
                 </div>
                 <p class="ob-highlight-hint">👆 Just tap the big button — the app guides you from there.</p>`,
        },
        {
          icon: '🎮',
          title: 'Bonus activities — use after the main lesson',
          body: `<div class="ob-bonus-list">
                   <div class="ob-bonus-item">⚡ <strong>Daily Challenge</strong> — 5-word bonus round, earns extra XP</div>
                   <div class="ob-bonus-item">🃏 <strong>Sight Words</strong> — flip &amp; match high-frequency words</div>
                   <div class="ob-bonus-item">🎡 <strong>Random Activity</strong> — spin the wheel for a surprise mode</div>
                   <div class="ob-bonus-item">🔤 <strong>Letter Sounds</strong> — tap any sound to hear it</div>
                 </div>
                 <p class="ob-bonus-note">Find these in the <strong>Extra Practice</strong> section below the main lesson cards.</p>`,
        },
      ],
      primary: [
        {
          icon: '🏫',
          title: "Your child's Primary Journey",
          body: `<p class="ob-intro">PhonicsQuest guides your child through three daily quests:</p>
                 <ul class="ob-list">
                   <li><strong>🔨 Sentence Forge</strong> — unscramble &amp; build sentences</li>
                   <li><strong>🏰 Cloze Castle</strong> — grammar cloze passages P1–P6</li>
                   <li><strong>🔑 Word Vault</strong> — vocabulary in context</li>
                 </ul>`,
        },
        {
          icon: '📋',
          title: 'Follow this order each day',
          body: `<div class="ob-steps">
                   <div class="ob-step">
                     <span class="ob-step-num">1</span>
                     <div><strong>Start with Sentence Forge</strong><br><small>Build sentence structure skills</small></div>
                   </div>
                   <div class="ob-step">
                     <span class="ob-step-num">2</span>
                     <div><strong>Do Cloze Castle</strong><br><small>Grammar cloze with clue detection</small></div>
                   </div>
                   <div class="ob-step">
                     <span class="ob-step-num">3</span>
                     <div><strong>Finish with Word Vault</strong><br><small>Vocabulary in context practice</small></div>
                   </div>
                 </div>`,
        },
        {
          icon: '⭐',
          title: 'Look for this card every day',
          body: `<div class="ob-highlight-card">
                   <div class="ob-highlight-eyebrow">TODAY'S START POINT</div>
                   <p class="ob-highlight-title">Best Next Step</p>
                   <p class="ob-highlight-body">This card is always first on the home screen. It targets your child's <strong>weakest skill</strong> so every session has a clear, focused starting point.</p>
                 </div>
                 <p class="ob-highlight-hint">👆 Just tap the big button — the app guides you from there.</p>`,
        },
        {
          icon: '🎮',
          title: 'Bonus activities — use after the main lesson',
          body: `<div class="ob-bonus-list">
                   <div class="ob-bonus-item">⚡ <strong>Daily Challenge</strong> — 5-word bonus round, earns extra XP</div>
                   <div class="ob-bonus-item">📚 <strong>Giri Stories</strong> — short decodable phonics stories</div>
                   <div class="ob-bonus-item">🃏 <strong>Sight Words</strong> — flip &amp; match high-frequency words</div>
                   <div class="ob-bonus-item">🎡 <strong>Random Activity</strong> — spin the wheel for variety</div>
                 </div>
                 <p class="ob-bonus-note">Find these in the <strong>Extra Practice</strong> section below the main lesson cards.</p>`,
        },
      ],
    };

    const screens   = TUTORIAL[levelKey];
    let   step      = 0;

    const contentEl = document.getElementById('ob-content');
    const dotsEl    = document.getElementById('ob-dots');
    const prevBtn   = document.getElementById('ob-prev');
    const nextBtn   = document.getElementById('ob-next');
    const skipBtn   = document.getElementById('ob-skip-btn');

    if (!contentEl || !dotsEl || !prevBtn || !nextBtn) return;

    const renderStep = (s) => {
      const sc = screens[s];
      contentEl.innerHTML = `
        <div class="ob-screen">
          <div class="ob-screen-icon" aria-hidden="true">${sc.icon}</div>
          <h2 class="ob-screen-title">${sc.title}</h2>
          <div class="ob-screen-body">${sc.body}</div>
        </div>`;

      dotsEl.innerHTML = screens.map((_, i) =>
        `<span class="ob-dot ${i === s ? 'ob-dot--active' : ''}" role="tab" aria-selected="${i === s}"></span>`
      ).join('');

      prevBtn.hidden = s === 0;
      nextBtn.textContent = s === screens.length - 1 ? "Let's go! 🚀" : 'Next →';
    };

    const closeTutorial = () => {
      store.set('onboardingComplete', true);
      this._closeModal('modal-onboarding');
    };

    // Re-attach listeners each open (avoids accumulation across re-opens)
    prevBtn.onclick = () => { if (step > 0) { step--; renderStep(step); } };
    nextBtn.onclick = () => {
      if (step < screens.length - 1) { step++; renderStep(step); }
      else closeTutorial();
    };
    if (skipBtn) skipBtn.onclick = closeTutorial;

    renderStep(0);
    this._openModal('modal-onboarding');
  }

  _openDashboard() {
    this._openModal('modal-dashboard');
    const container = document.getElementById('dashboard-content');
    if (container) {
      renderDashboard(container, {
        // Allow dashboard CTAs to close the dashboard and navigate to a quest
        onNavigate: ({ target, group }) => {
          this._closeModal('modal-dashboard');
          this._navigateTo(target, group);
        },
      });
    }

    // Bind the export-profile button inside the dashboard (rendered dynamically)
    setTimeout(() => {
      const exportBtn = document.getElementById('dashboard-export-btn');
      if (exportBtn && !exportBtn._bound) {
        exportBtn._bound = true;
        exportBtn.addEventListener('click', () => {
          const profile = getActiveProfile();
          if (profile?.id) {
            const ok = exportProfile(profile.id);
            this._showToast(ok ? '📥 Backup downloaded!' : 'Export failed — please try again.', ok ? 'success' : 'warning');
          }
        });
      }

      const importInput = document.getElementById('dashboard-import-input');
      if (importInput && !importInput._bound) {
        importInput._bound = true;
        importInput.addEventListener('change', (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            const { profile: newProfile, error } = importProfile(ev.target.result);
            if (error) {
              this._showToast(`Import failed: ${error}`, 'warning');
            } else {
              this._showToast(`Profile "${newProfile.name}" imported! Switch profiles to use it.`, 'success');
            }
            importInput.value = '';
          };
          reader.readAsText(file);
        });
      }
    }, 100);
  }

  /**
   * Navigate to a named activity from the guided journey or dashboard.
   * @param {string} target - ctaTarget value from recommendation
   * @param {string|null} [group]
   */
  _navigateTo(target, group = null) {
    const unlock = this._getQuestUnlockStatus();
    switch (target) {
      case 'blend':
        this._mode = 'blend';
        store.set('currentMode', 'blend');
        if (group) {
          store.set('currentGroup', group);
          this._startGame(group);
        } else {
          this._openBlendPicker();
        }
        break;
      case 'classicBlend':
        this._mode = 'classicBlend';
        store.set('currentMode', 'classicBlend');
        this._startGame(store.get('currentGroup') || undefined);
        break;
      case 'first-sound':
        this._mode = 'first';
        store.set('currentMode', 'first');
        this._startGame();
        break;
      case 'oral-blend':
        this._mode = 'oralBlend';
        store.set('currentMode', 'oralBlend');
        this._startGame();
        break;
      case 'letter-sounds':
        document.getElementById('btn-letter-sounds')?.click();
        break;
      case 'hear':
        this._mode = 'hear';
        store.set('currentMode', 'hear');
        this._startGame();
        break;
      case 'sentence-forge':
        document.getElementById('btn-sentence-forge')?.click();
        break;
      case 'cloze-castle':
        document.getElementById('btn-cloze-castle')?.click();
        break;
      case 'word-vault':
        document.getElementById('btn-word-vault')?.click();
        break;
      case 'editing-quest':
        document.getElementById('btn-editing-quest')?.click();
        break;
      case 'writing-quest':
        document.getElementById('btn-writing-quest')?.click();
        break;
      case 'sight-words':
        document.getElementById('btn-sight-words')?.click();
        break;
      case 'stories':
        document.getElementById('btn-stories')?.click();
        break;
      default:
        break;
    }
  }

  /**
   * Render the guided learner journey section on the home screen.
   *
   * New IA (redesign):
   *   1. Pathway badge  – "🌱 Preschool Journey" / "🏫 Primary Journey"
   *   2. Start card     – dominant hero with a single, large CTA (Best Next Step)
   *   3. Today's path   – 3-step clickable roadmap (do these in order)
   *   4. Progress chips – concise learner snapshot
   *
   * Then manages section visibility so preschool vs primary layouts differ.
   */
  _renderGuidedJourney() {
    const section = document.getElementById('guided-journey-section');
    if (!section) return;

    const profile   = getActiveProfile ? getActiveProfile() : null;
    const placement = store.get('placementProfile') || null;
    const readingBand = getReadingBand(profile, placement);

    let rec, plan, chips;
    try {
      rec   = getRecommendation();
      plan  = getDailyPlan();
      chips = getLearnerSummaryChips();
    } catch (_) {
      section.innerHTML = '';
      return;
    }

    // ── Pathway meta ───────────────────────────────────────────────────────
    const stageMeta = {
      'pre-reader': { icon: '🌱', label: 'Pre-reader Journey', mod: 'pathway-badge--preschool' },
      'emerging-decoder': { icon: '🧩', label: 'Emerging Decoder Journey', mod: 'pathway-badge--preschool' },
      'developing-reader': { icon: '📘', label: 'Developing Reader Journey', mod: 'pathway-badge--primary' },
      reader: { icon: '🏫', label: 'Reader Journey', mod: 'pathway-badge--primary' },
    };
    const pathwayIcon  = stageMeta[readingBand]?.icon || '🌱';
    const pathwayLabel = stageMeta[readingBand]?.label || 'Reading Journey';
    const pathwayMod   = stageMeta[readingBand]?.mod || 'pathway-badge--preschool';
    const profileName  = profile?.name ? `${profile.name}'s ` : '';

    // ── Urgency display ────────────────────────────────────────────────────
    const urgencyIcon  = rec.urgency === 'high'   ? '🔴'
                       : rec.urgency === 'medium' ? '🟡' : '🟢';
    const urgencyText  = rec.urgency === 'high'   ? 'Focus area'
                       : rec.urgency === 'medium' ? 'Needs practice' : 'Looking good';

    // ── 3-step roadmap ─────────────────────────────────────────────────────
    const roadmapHtml = plan.map(step => `
      <button class="home-roadmap-step"
              data-target="${step.ctaTarget}"
              ${step.ctaGroup ? `data-group="${step.ctaGroup}"` : ''}
              aria-label="Step ${step.step}: ${step.label}">
        <span class="roadmap-num" aria-hidden="true">${step.step}</span>
        <div class="roadmap-info">
          <span class="roadmap-label">${step.label}</span>
          <span class="roadmap-detail">${step.detail}</span>
        </div>
        <span class="roadmap-arrow" aria-hidden="true">→</span>
      </button>`).join('');

    // ── Progress chips ─────────────────────────────────────────────────────
    const chipsHtml = chips.length
      ? `<div class="progress-chips" aria-label="Progress snapshot">
           ${chips.map(c => `<span class="progress-chip">${c}</span>`).join('')}
         </div>`
      : '';

    // ── Render ─────────────────────────────────────────────────────────────
    section.innerHTML = `
      <div class="pathway-badge ${pathwayMod}" aria-label="Learning pathway: ${pathwayLabel}">
        <span class="pathway-badge-icon" aria-hidden="true">${pathwayIcon}</span>
        <span class="pathway-badge-text">${profileName}${pathwayLabel}</span>
      </div>

      <div class="home-start-card" aria-label="Today's best next step">
        <div class="start-card-eyebrow">
          <span class="start-card-label">TODAY'S START POINT</span>
          <span class="start-card-urgency" aria-label="Urgency: ${urgencyText}">
            ${urgencyIcon} ${urgencyText}
          </span>
        </div>
        <span class="start-card-domain-badge">${rec.domain}</span>
        <h2 class="start-card-title">${rec.title}</h2>
        <p class="start-card-reason">${rec.reason}</p>
        <button class="btn btn--primary btn--xl start-card-cta"
                data-target="${rec.ctaTarget}"
                ${rec.ctaGroup ? `data-group="${rec.ctaGroup}"` : ''}>
          ${rec.ctaLabel} →
        </button>
      </div>

      <div class="home-roadmap" aria-label="Today's recommended learning path">
        <h3 class="home-roadmap-title">
          <span aria-hidden="true">📋</span>
          Your child's path today
          <span class="roadmap-order-hint">· do in order</span>
        </h3>
        <div class="home-roadmap-steps">
          ${roadmapHtml}
        </div>
      </div>

      ${chipsHtml ? `<div class="progress-snapshot" aria-label="Progress snapshot">${chipsHtml}</div>` : ''}`;

    // Wire up all [data-target] buttons
    section.querySelectorAll('[data-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._navigateTo(btn.dataset.target, btn.dataset.group || null);
      });
    });

    // Manage section visibility for preschool vs primary layout
    this._manageSectionVisibility(readingBand);
  }

  /**
   * Show / hide home sections based on pathway so parents see a clean,
   * pathway-specific layout rather than an undifferentiated content library.
   *
   * Preschool: phonics mode grid is the main lesson → show it prominently.
   *            Quest banners are locked milestones → demote below extra practice.
   * Primary:   quest banners are the main lesson → show them prominently.
   *            Phonics modes are irrelevant → hide them.
   */
  _manageSectionVisibility(readingBand = 'pre-reader') {
    const coreSection   = document.getElementById('home-core-section');
    const questsSection = document.getElementById('home-quests-section');
    const questsHeading = document.getElementById('quests-section-heading');
    const questsSub     = document.getElementById('quests-section-sub');

    const grammarHeavy = readingBand === 'reader';
    if (grammarHeavy) {
      // Hide preschool phonics grid; quests are the primary lesson
      coreSection?.classList.add('home-section--hidden');
      questsSection?.classList.remove('home-section--milestone');
      if (questsHeading) questsHeading.textContent = 'Your Learning Quests';
      if (questsSub)     questsSub.textContent     = 'Follow the order above · do these each session';
    } else {
      // Show phonics grid; demote quests as milestone tracker
      coreSection?.classList.remove('home-section--hidden');
      questsSection?.classList.add('home-section--milestone');
      if (questsHeading) questsHeading.textContent = 'Quest Milestones';
      if (questsSub)     questsSub.textContent     = 'Unlocks as decoding and reading readiness improve';
    }
  }

  // ── Modals ──

  /**
   * Open a modal by ID.
   * Delegates focus-trapping and Escape-key registration to `modalManager`
   * so that listeners never accumulate across multiple open/close cycles.
   */
  _openModal(id) {
    modalManager.open(id, {
      onClose: () => {
        // Run any modal-specific close-side-effects (e.g. chart teardown).
        this._onModalClosed(id);
      },
    });
  }

  /**
   * Close a modal by ID.
   * Delegates to `modalManager` (removes the Escape listener) then handles
   * any modal-specific cleanup.
   */
  _closeModal(id) {
    modalManager.close(id);
    this._onModalClosed(id);
  }

  /**
   * Side-effects that must run whenever a modal is dismissed, regardless of
   * whether it was closed via button, overlay-click, or Escape key.
   * @param {string} id
   */
  _onModalClosed(id) {
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
        this._showScreen(SCREENS.HOME);
        mascot.setHomeState('holdCard');
        audio.playSfx('correct');
        // Refresh guided journey for the newly activated profile
        this._renderGuidedJourney();
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
    if (profiles.length === 0) {
      chip.style.display = 'none';
      return;
    }

    const profile = getActiveProfile();
    if (!profile) {
      chip.style.display = '';
      chip.setAttribute('aria-label', 'Manage players');
      if (avatar) avatar.textContent = '🧑‍🎓';
      if (name)   name.textContent   = 'Players';
      return;
    }

    chip.style.display = '';
    chip.setAttribute('aria-label', profiles.length > 1 ? 'Switch player' : 'Manage players');
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

    // Reset school-level picker to Preschool and wire up toggle
    const levelGroup = document.getElementById('cp-level-group');
    const levelHint  = document.getElementById('cp-level-hint');
    if (levelGroup) {
      const levelBtns = levelGroup.querySelectorAll('.cp-level-btn');
      const setLevel = (selected) => {
        levelBtns.forEach(b => {
          const active = b === selected;
          b.classList.toggle('cp-level-btn--selected', active);
          b.setAttribute('aria-pressed', String(active));
        });
        if (levelHint) {
          levelHint.textContent = selected.dataset.level === 'primary'
            ? 'Sentence Forge, Cloze Castle & Word Vault unlock immediately'
            : 'Phonics games unlock as words are mastered';
        }
      };
      // Default to preschool on each open
      setLevel(levelGroup.querySelector('[data-level="preschool"]'));
      levelBtns.forEach(btn => btn.addEventListener('click', () => setLevel(btn)));
    }

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
    const selectedLevelBtn = document.querySelector('.cp-level-btn--selected');
    const schoolLevel = selectedLevelBtn?.dataset.level || 'preschool';

    const profile = createProfile(name, avatar, color, schoolLevel);
    this._closeModal('modal-create-profile');

    activateProfile(profile.id);
    gamification.init();
    this._updateProfileChip();
    this._renderProfileGrid();

    // Show placement test for new profiles before home screen.
    // Preschool learners go to home directly (they start at Phase 1 by design).
    // Primary learners get a short diagnostic to set starting level.
    if (!store.get('placementComplete')) {
      this._showScreen('screen-placement');
      this._runPlacementTest(profile);
    } else {
      this._afterPlacement(profile, null);
    }

    audio.playSfx('correct');
  }

  // ── Placement Test ──

  /**
   * Run the placement diagnostic for a newly created profile.
   * Renders into #screen-placement and calls _afterPlacement when done.
   * @param {object} profile
   */
  _runPlacementTest(profile) {
    const container = document.getElementById('screen-placement');
    if (!container) {
      this._afterPlacement(profile, null);
      return;
    }
    showPlacementTest({
      container,
      profile,
      onComplete: (result) => {
        // Apply placement result to store
        if (result.preSeededStats && Object.keys(result.preSeededStats).length > 0) {
          const existing = store.get('wordStats') || {};
          store.set('wordStats', { ...result.preSeededStats, ...existing });
        }
        if (result.startGroup) {
          store.set('currentGroup', result.startGroup);
        }
        store.set('placementProfile', result);
        store.set('placementComplete', true);
        this._afterPlacement(profile, result);
      },
    });
  }

  /**
   * Navigate to the home screen after placement (or on returning users).
   * Applies post-placement state, shows onboarding tutorial if needed,
   * then checks for weekly recap / comeback session.
   * @param {object} profile
   * @param {object|null} placementResult
   */
  _afterPlacement(profile, placementResult) {
    this._showScreen(SCREENS.HOME);
    mascot.setHomeState('holdCard');
    this._renderGuidedJourney();
    this._updateQuestBanners();

    // Show onboarding tutorial for new profiles (first-run experience)
    if (!store.get('onboardingComplete')) {
      setTimeout(() => this._showOnboardingTutorial(profile), 400);
      return;
    }

    // Weekly recap / comeback checks for returning users
    this._checkReturnEvents();
  }

  // ── Return-event checks (streak freeze, comeback, weekly recap, backup) ──

  /**
   * Run on init (returning user) or after first placement (onboarding done).
   * Checks: streak freeze notification → comeback session → weekly recap → backup reminder.
   * Each check is mutually exclusive per session to avoid modal stacking.
   */
  _checkReturnEvents() {
    // 1. Streak freeze notification
    if (gamification.wasFreezeUsed()) {
      this._showToast('Streak saved! 🛡️ Your streak freeze was used automatically.', 'success');
    }

    // 2. Comeback session: 2–6 days away
    const daysAway = gamification.getDaysAway();
    if (daysAway >= 2 && daysAway <= 6) {
      const last = store.get('comebackShownAt');
      const today = new Date().toDateString();
      if (!last || new Date(last).toDateString() !== today) {
        store.set('comebackShownAt', new Date().toISOString());
        setTimeout(() => this._showComebackModal(daysAway), 600);
        return; // don't show other modals on top
      }
    }

    // 3. Weekly recap (7+ days since last shown, and user has some history)
    if (shouldShowWeeklyRecap()) {
      const stats = gamification.getWeeklyStats();
      setTimeout(() => showWeeklyRecap({
        stats,
        onClose: () => this._checkBackupReminder(),
      }), 600);
      return;
    }

    // 4. Backup reminder
    this._checkBackupReminder();
  }

  /**
   * Show the "Welcome back" modal after a 2–6 day absence.
   * @param {number} daysAway
   */
  _showComebackModal(daysAway) {
    const profile  = getActiveProfile();
    const name     = profile?.name?.split(' ')[0] || 'there';
    const existing = document.getElementById('modal-comeback');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id        = 'modal-comeback';
    modal.className = 'modal-overlay modal-overlay--active';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Welcome back');

    const dayLabel = daysAway === 1 ? 'yesterday' : `${daysAway} days ago`;
    const streak   = store.get('streak') || 0;

    modal.innerHTML = `
      <div class="modal-panel cb-panel">
        <div class="cb-icon" aria-hidden="true">👋</div>
        <h2 class="cb-title">Welcome back, ${name}!</h2>
        <p class="cb-body">You last played ${dayLabel}. Let's warm up with a quick 5-question round before diving in.</p>
        ${streak > 0 ? `<p class="cb-streak">🔥 Your streak is at <strong>${streak} days</strong> — keep it going!</p>` : ''}
        <div class="cb-actions">
          <button class="btn btn--primary btn--xl" id="cb-warm-up">Start warm-up →</button>
          <button class="btn btn--ghost" id="cb-skip">Skip, go to home</button>
        </div>
      </div>`;

    document.body.appendChild(modal);

    modal.querySelector('#cb-warm-up')?.addEventListener('click', () => {
      modal.remove();
      // Start blend mode on the last-played group — a familiar warm-up
      this._mode = 'blend';
      store.set('currentMode', 'blend');
      this._startGame(store.get('currentGroup') || 'cvc-a');
    });
    modal.querySelector('#cb-skip')?.addEventListener('click', () => {
      modal.remove();
      this._checkBackupReminder();
    });

    setTimeout(() => modal.querySelector('#cb-warm-up')?.focus(), 100);
  }

  /**
   * Show the backup reminder if 7+ days have passed since the last reminder
   * and the profile has meaningful progress.
   */
  _checkBackupReminder() {
    const last = store.get('lastBackupReminderAt');
    if (last) {
      const daysSince = (Date.now() - new Date(last).getTime()) / 86400000;
      if (daysSince < 7) return;
    }

    // Only remind if there is real progress to lose
    const wordCount = Object.keys(store.get('wordStats') || {}).length;
    if (wordCount < 10) return;

    store.set('lastBackupReminderAt', new Date().toISOString());
    this._showBackupReminderModal();
  }

  /**
   * Show the backup reminder modal.
   */
  _showBackupReminderModal() {
    const existing = document.getElementById('modal-backup-reminder');
    if (existing) existing.remove();

    const profile  = getActiveProfile();
    const wordCount = Object.keys(store.get('wordStats') || {}).length;

    const modal = document.createElement('div');
    modal.id        = 'modal-backup-reminder';
    modal.className = 'modal-overlay modal-overlay--active';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Backup your progress');

    modal.innerHTML = `
      <div class="modal-panel br-panel">
        <div class="br-icon" aria-hidden="true">💾</div>
        <h2 class="br-title">Back up your progress!</h2>
        <p class="br-body">
          ${profile?.name || 'Your learner'} has practised <strong>${wordCount} words</strong>.
          If browser data is cleared, this progress could be lost.
        </p>
        <p class="br-body">Download a backup file to keep it safe.</p>
        <div class="br-actions">
          <button class="btn btn--primary" id="br-export-btn">📥 Download backup</button>
          <button class="btn btn--ghost" id="br-dismiss-btn">Remind me later</button>
        </div>
      </div>`;

    document.body.appendChild(modal);

    modal.querySelector('#br-export-btn')?.addEventListener('click', () => {
      const activeId = profile?.id;
      if (activeId) exportProfile(activeId);
      modal.remove();
      this._showToast('Backup downloaded! Keep the file somewhere safe.', 'success');
    });
    modal.querySelector('#br-dismiss-btn')?.addEventListener('click', () => modal.remove());

    setTimeout(() => modal.querySelector('#br-export-btn')?.focus(), 100);
  }

  // ── Session Summary ──

  /**
   * Show the session summary screen when the daily goal is reached.
   * Called from _handleResult when dailyComplete is true.
   * @param {{ xpEarned: number }} reward
   */
  _showSessionSummaryScreen(reward) {
    const wordsToday = (store.get('sessionWordsToday') || []).length;
    const streak     = store.get('streak') || 0;

    // Collect any badges that fired today
    const newBadges = badges.getRecentlyEarned?.() || [];

    showSessionSummary({
      xpEarned:   store.get('sessionXpToday') || reward.xpEarned || 0,
      wordsCount: wordsToday,
      streak,
      newBadges,
      onClose: ({ continueSession } = {}) => {
        if (continueSession) {
          // Go back to game
          this._nextWord();
        } else {
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        }
      },
    });
    this._showScreen('screen-session-summary');
  }

  // ── Blend Curriculum Picker ──

  /**
   * Show a modal curriculum stage browser for Blend It!
   * Groups stages by phase, shows lock/unlock & mastery, highlights recommended.
   */
  _openBlendPicker() {
    const groupMastery = store.get('groupMastery') || {};
    const unlocked     = getUnlockedStages(groupMastery);
    const recommended  = getRecommendedStage(groupMastery);

    // Remove stale picker if any
    document.getElementById('modal-blend-picker')?.remove();

    // Group stages by phase
    const byPhase = {};
    for (const stage of CURRICULUM) {
      (byPhase[stage.phase] ??= []).push(stage);
    }

    let stagesHtml = '';
    for (const [phaseNum, stages] of Object.entries(byPhase)) {
      const phaseLabel = PHASE_LABELS[phaseNum] || `Phase ${phaseNum}`;
      stagesHtml += `<div class="bp-phase-header">${phaseLabel}</div><div class="bp-phase-stages">`;

      for (const stage of stages) {
        const isUnlocked = unlocked.includes(stage.id);
        const isRec      = recommended?.id === stage.id;
        const mastery    = groupMastery[stage.group] ?? 0;
        const pct        = Math.round(mastery * 100);
        const lockedCls  = isUnlocked ? '' : 'bp-stage--locked';
        const recCls     = isRec      ? 'bp-stage--recommended' : '';

        stagesHtml += `
          <button class="bp-stage ${lockedCls} ${recCls}"
                  data-group="${stage.group}"
                  ${isUnlocked ? '' : 'disabled aria-disabled="true"'}
                  aria-label="${stage.name}${isRec ? ' – Recommended' : ''}${!isUnlocked ? ' – Locked' : ''}">
            <span class="bp-stage-icon">${isUnlocked ? stage.icon : '🔒'}</span>
            <div class="bp-stage-info">
              <div class="bp-stage-name">
                ${stage.name}${isRec ? '<span class="bp-rec-badge">★ Next</span>' : ''}
              </div>
              <div class="bp-stage-desc">${stage.description}</div>
              ${isUnlocked ? `
                <div class="bp-stage-mastery-wrap">
                  <div class="bp-stage-mastery-bar" style="width:${pct}%"></div>
                </div>` : ''}
            </div>
          </button>`;
      }
      stagesHtml += '</div>';
    }

    const modal = document.createElement('div');
    modal.id        = 'modal-blend-picker';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-panel bp-panel">
        <div class="modal-header">
          <h2 class="modal-title">🎯 Choose Your Stage</h2>
          <button class="modal-close" id="bp-close-btn" aria-label="Close picker">✕</button>
        </div>
        <div class="bp-stages-list">${stagesHtml}</div>
      </div>`;

    document.body.appendChild(modal);

    // Stage click → start game with that group
    modal.querySelectorAll('.bp-stage:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.group;
        store.set('currentGroup', group);
        modal.remove();
        this._startGame(group);
      });
    });

    document.getElementById('bp-close-btn')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    // Scroll recommended stage into view
    setTimeout(() => {
      modal.querySelector('.bp-stage--recommended')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
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

  // ── Per-Mode Adaptive Difficulty ──

  /**
   * Auto-adjust difficulty for the current mode based on recent performance.
   * Called after each correct/wrong result. Checks the last 10 attempts in
   * this mode and adjusts the per-mode difficulty level up or down.
   */
  _adjustModeDifficulty() {
    const history = store.get('wordHistory') || [];
    const modeHistory = history.filter(h => h.mode === this._mode).slice(0, 10);
    if (modeHistory.length < 10) return; // not enough data yet

    const correct = modeHistory.filter(h => h.correct).length;
    const accuracy = correct / modeHistory.length;

    const modeDiffs = store.get('modeDifficulty') || {};
    const current = modeDiffs[this._mode] ?? store.get('difficulty') ?? 1;

    let next = current;
    if (accuracy >= 0.85 && current < 3) {
      next = current + 1;
    } else if (accuracy < 0.50 && current > 1) {
      next = current - 1;
    }

    if (next !== current) {
      modeDiffs[this._mode] = next;
      store.set('modeDifficulty', modeDiffs);
      const labels = { 1: 'Starter', 2: 'Explorer', 3: 'Champion' };
      this._showToast(
        next > current
          ? `Level up! ${labels[next]} difficulty for this mode!`
          : `Easing back to ${labels[next]} for this mode.`,
        next > current ? 'success' : 'info'
      );
    }
  }

  // ── Quest Unlock Gating ──
  // QUEST_THRESHOLDS have been moved to constants.js.

  /**
   * Calculate quest unlock status based on words mastered.
   * A word is "mastered" when it has >= 6 attempts and >= 80% accuracy.
   *
   * Primary-school profiles bypass mastery gating: all three quests are
   * treated as immediately unlocked regardless of word progress.
   * Preschool profiles (and existing profiles without a schoolLevel field)
   * continue to use the mastery-threshold unlock path.
   */
  _getQuestUnlockStatus() {
    const profile = getActiveProfile();
    const stats = store.get('wordStats') || {};
    const placementProfile = store.get('placementProfile') || null;
    return getQuestUnlockStatus(stats, profile, QUEST_THRESHOLDS, placementProfile);
  }

  /** Update quest banner UI to show lock/unlock state */
  _updateQuestBanners() {
    const unlock = this._getQuestUnlockStatus();

    const banners = [
      { id: 'btn-sentence-forge', quest: unlock.sentenceForge, label: '6 levels · unscramble & build sentences' },
      { id: 'btn-cloze-castle',   quest: unlock.clozeCastle,   label: 'P1–P6 · grammar cloze passages' },
      { id: 'btn-word-vault',     quest: unlock.wordVault,     label: '7 categories · vocabulary cloze passages' },
      { id: 'btn-editing-quest',  quest: unlock.editingQuest,  label: 'Editing and grammar correction tasks' },
      { id: 'btn-writing-quest',  quest: unlock.writingQuest,  label: 'Guided writing with rubric feedback' },
    ];

    for (const b of banners) {
      const el = document.getElementById(b.id);
      if (!el) continue;
      const sub = el.querySelector('.stories-banner-sub');
      const arrow = el.querySelector('.stories-banner-arrow');
      if (b.quest.unlocked) {
        if (sub) sub.textContent = b.label;
        if (arrow) arrow.textContent = '→';
        el.classList.remove('stories-banner--locked');
      } else {
        if (sub) sub.textContent = `🔒 Master ${b.quest.required} words to unlock (${b.quest.current}/${b.quest.required})`;
        if (arrow) arrow.textContent = '🔒';
        el.classList.add('stories-banner--locked');
      }
    }
  }

  // ── Keyboard Shortcuts ──
  // Handled by keyboardManager (see src/modules/keyboardManager.js).
  // keyboardManager.init() is called from _bindEvents().
}


export const app = new App();
