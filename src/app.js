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
import {
  initSightMatch, showSightBrowser, cleanupSightMatch,
  startSightMatchQuest,
} from './modes/sightMatch.js';
import {
  initSightLearn, showSightLearn, cleanupSightLearn,
} from './modes/sightLearn.js';
import { initSentenceForge, showSentenceBrowser, cleanupSentenceForge, setSentenceForgeTrack } from './modes/sentenceForge.js';
import { initClozeCastle, showClozeBrowser, cleanupClozeCastle } from './modes/clozeCastle.js';
import { initWordVault, showVaultBrowser, cleanupWordVault } from './modes/wordVault.js';
import { initGrammarMcq, showGrammarMcqBrowser, cleanupGrammarMcq, startGrammarMcqLevel } from './modes/grammarMcq.js';
import { initVocabMcq, showVocabMcqBrowser, cleanupVocabMcq, startVocabMcqLevel } from './modes/vocabMcq.js';
import { initPaperMode, showPaperModeBrowser, cleanupPaperMode } from './modes/paperMode.js';
import { initEditingQuest, showEditingBrowser, cleanupEditingQuest } from './modes/editingQuest.js';
import { initWritingQuest, showWritingBrowser, cleanupWritingQuest } from './modes/writingQuest.js';
import { mountPlaceholderModule, getPlaceholderMeta } from './modes/primaryPlaceholders.js';
import { initComprehensionClozeQuest, cleanupComprehensionClozeQuest } from './modes/comprehensionClozeQuest.js';
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
  getMissionSummary, markMissionStepDone,
} from './modules/missionToday.js';
import { CURRICULUM, PHASE_LABELS } from './data/curriculum.js';
import {
  buildProgressionSnapshot, getUnlockedStages, getRecommendedStage, explainLockReason,
} from './modules/progression.js';
import { SCREENS, QUEST_THRESHOLDS } from './constants.js';
import { modalManager } from './modules/modalManager.js';
import { keyboardManager } from './modules/keyboardManager.js';
import { settingsController } from './modules/settingsController.js';
import { getQuestUnlockStatus } from './modules/questUnlocks.js';
import { showPlacementTest } from './modules/placementTest.js';
import { getReadingBand, getHomeLayoutForReadingBand } from './modules/readingStages.js';
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

    /**
     * Session type: 'normal' | 'dailyChallenge' | 'review'
     * Prevents review sessions from accidentally completing the daily challenge.
     * @type {'normal'|'dailyChallenge'|'review'}
     */
    this._sessionType = 'normal';
    /** @type {import('./data/words.js').Word[]} remaining queued words (daily/review) */
    this._queuedWords = [];
    /** @type {number} correct answers in current queued session */
    this._queuedCorrect = 0;

    /** @type {number} words completed in current session */
    this._sessionWordCount = 0;

    /** @type {boolean} hint used for current word (no heart loss on 1st wrong if unused) */
    this._hintUsed = false;
    /** @type {number} wrong attempts on current word (for two-strike system) */
    this._wrongStrikes = 0;
    /** @type {number} progressive hint tier for current word (0 = none, 1-3 = tiers) */
    this._hintTier = 0;

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

    settingsController.apply(store);
    restoreActiveProfile();

    gamification.init();
    mascot.init();

    const canvas = document.getElementById('spin-wheel');
    if (canvas) spinWheel.init(canvas);

    const micBtn = document.getElementById('btn-mic');
    if (micBtn && !speech.supported) {
      micBtn.classList.add('hidden');
    }

    settingsController.applyTheme(store.get('theme') || 'default');

    if (needsProfileSelection()) {
      this._showScreen(SCREENS.PROFILES);
      this._renderProfileGrid();
    } else {
      this._updateProfileChip();
      store.set('totalSessions', (store.get('totalSessions') || 0) + 1);
      setTimeout(() => this._checkReturnEvents(), 800);
    }

    this._updateDailyBanner();
    this._updateQuestBanners();
    this._updateReviewBanner();
    this._renderGuidedJourney();

    console.log('[PhonicsQuest] App initialized');
  }

  /** Cache frequently used DOM elements */
  _cacheElements() {
    this._els = {
      screenHome:   document.getElementById('screen-home'),
      screenGame:   document.getElementById('screen-game'),
      screenResult: document.getElementById('screen-result'),

      wordDisplay:    document.getElementById('word-display'),
      wordEmoji:      document.getElementById('word-emoji'),
      phonemeRow:     document.getElementById('phoneme-row'),
      modeInstruction: document.getElementById('mode-instruction'),
      modeArea:       document.getElementById('mode-area'),

      btnCheck: document.getElementById('btn-check'),
      btnSayIt: document.getElementById('btn-say-it'),
      btnHint:  document.getElementById('btn-hint'),
      btnSkip:  document.getElementById('btn-skip'),
      btnBack:  document.getElementById('btn-back'),
      btnNext:  document.getElementById('btn-next'),
      btnMic:   document.getElementById('btn-mic'),

      resultBadge:   document.getElementById('result-badge'),
      resultMessage: document.getElementById('result-message'),
      resultWord:    document.getElementById('result-word-display'),
      resultXp:      document.getElementById('result-xp'),
      resultMascot:  document.getElementById('result-mascot'),

      speechBubble: document.getElementById('speech-bubble'),

      toastContainer: document.getElementById('toast-container'),
    };
  }

  /** Bind all event listeners */
  _bindEvents() {
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

    document.getElementById('spin-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('spin-btn');
      if (!btn || spinWheel.isSpinning) return;
      btn.disabled = true;
      const group = await spinWheel.spin();
      store.set('currentGroup', group);
      audio.playSfx('correct');
      this._mode = 'blend';
      setTimeout(() => this._startGame(group), 500);
      btn.disabled = false;
    });

    this._els.btnBack?.addEventListener('click', () => {
      this._cleanupMode();
      this._sessionWordCount = 0;
      this._hideGameMascot();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

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
      badges.onStoriesOpened().forEach(b => badges.notify(b));
    });

    document.getElementById('btn-stories-back')?.addEventListener('click', () => {
      cleanupStoryMode();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

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

    document.getElementById('btn-ls-back')?.addEventListener('click', () => {
      cleanupLetterSounds();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-daily-challenge')?.addEventListener('click', () => {
      if (isDailyChallengeComplete()) {
        this._showToast('Daily challenge already done! Come back tomorrow.', 'info');
        return;
      }
      this._startDailyChallenge();
    });

    // Sight Words: the container hosts both the Match mode (browser + card
    // game) and the Learn mode (study screen). The two are wired together via
    // callbacks so the child can hop between Learn → Match → Browser without
    // leaving the Sight Words screen.
    const sightContainer = () => document.getElementById('sight-match-content');

    const enterSightBrowser = () => {
      cleanupSightLearn();
      initSightMatch(sightContainer(), goHomeFromSight, openSightLearn);
      showSightBrowser();
    };

    const openSightLearn = (quest) => {
      cleanupSightMatch();
      initSightLearn(sightContainer(), {
        onGoHome:        goHomeFromSight,
        onBackToBrowser: enterSightBrowser,
        onStartMatch:    (q) => {
          cleanupSightLearn();
          initSightMatch(sightContainer(), goHomeFromSight, openSightLearn);
          startSightMatchQuest(q);
        },
      });
      showSightLearn(quest);
      mascot.setState('celebrate');
    };

    const goHomeFromSight = () => {
      cleanupSightMatch();
      cleanupSightLearn();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    };

    document.getElementById('btn-sight-words')?.addEventListener('click', () => {
      enterSightBrowser();
      this._showScreen('screen-sight-match');
      mascot.setState('celebrate');
    });

    document.getElementById('btn-sm-back')?.addEventListener('click', goHomeFromSight);

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

    document.getElementById('btn-sfq-back')?.addEventListener('click', () => {
      cleanupSentenceForge();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-grammar-mcq')?.addEventListener('click', () => {
      initGrammarMcq(
        document.getElementById('grammar-mcq-content'),
        () => {
          cleanupGrammarMcq();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      showGrammarMcqBrowser();
      this._showScreen(SCREENS.GRAMMAR_MCQ);
      mascot.setState('whiteboard');
    });
    document.getElementById('btn-gmcq-back')?.addEventListener('click', () => {
      cleanupGrammarMcq();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-vocab-mcq')?.addEventListener('click', () => {
      initVocabMcq(
        document.getElementById('vocab-mcq-content'),
        () => {
          cleanupVocabMcq();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      showVocabMcqBrowser();
      this._showScreen(SCREENS.VOCAB_MCQ);
      mascot.setState('celebrate');
    });
    document.getElementById('btn-vmcq-back')?.addEventListener('click', () => {
      cleanupVocabMcq();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-paper-mode')?.addEventListener('click', () => {
      initPaperMode(document.getElementById('paper-mode-content'), {
        onGoHome: () => {
          cleanupPaperMode();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
        onLaunchSection: (sectionKey, level) => {
          cleanupPaperMode();
          this._launchPaperSection(sectionKey, level);
        },
      });
      showPaperModeBrowser();
      this._showScreen(SCREENS.PAPER_MODE);
      mascot.setState('whiteboard');
    });
    document.getElementById('btn-paper-back')?.addEventListener('click', () => {
      cleanupPaperMode();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

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

    document.getElementById('btn-ccq-back')?.addEventListener('click', () => {
      cleanupClozeCastle();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

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

    document.getElementById('btn-wvq-back')?.addEventListener('click', () => {
      cleanupWordVault();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

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

    // ── Primary English placeholder modules (Visual Text, Comprehension Cloze,
    //    Open-ended Comprehension, Synthesis & Transformation, Situational
    //    Writing) — first-version implementations so parents can see the full
    //    Primary English pathway in the home screen.
    const placeholderHandlers = [
      ['btn-visual-text',         'visual-text'],
      ['btn-comprehension-cloze', 'comprehension-cloze'],
      ['btn-open-comprehension',  'open-comprehension'],
      ['btn-synthesis',           'synthesis'],
      ['btn-situational-writing', 'situational-writing'],
      ['btn-p1-practice-tests',   'p1-practice-tests'],
      ['btn-p2-practice-tests',   'p2-practice-tests'],
      ['btn-p3-practice-tests',   'p3-practice-tests'],
    ];
    placeholderHandlers.forEach(([btnId, kind]) => {
      document.getElementById(btnId)?.addEventListener('click', () => {
        this._openPrimaryPlaceholder(kind);
      });
    });
    document.getElementById('btn-pp-back')?.addEventListener('click', () => {
      cleanupComprehensionClozeQuest();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    // Next word button
    this._els.btnNext?.addEventListener('click', () => {
      this._nextWord();
    });

    this._els.btnSayIt?.addEventListener('click', () => {
      if (this._currentWord) audio.speakWord(this._currentWord.word);
    });

    this._els.btnHint?.addEventListener('click', () => {
      this._giveHint();
    });

    this._els.btnSkip?.addEventListener('click', () => {
      this._cleanupMode();
      this._nextWord();
    });

    this._els.btnMic?.addEventListener('click', () => {
      this._handleSpeechRecognition();
    });

    document.getElementById('settings-btn')?.addEventListener('click', () => {
      this._openModal('modal-settings');
    });

    document.getElementById('btn-calibrate-mic')?.addEventListener('click', () => {
      this._runMicCalibration();
    });

    document.getElementById('dashboard-btn')?.addEventListener('click', () => {
      this._openModal('modal-pin');
      setTimeout(() => document.querySelector('.pin-digit')?.focus(), 200);
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        if (modalId) this._closeModal(modalId);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this._closeModal(overlay.id);
      });
    });

    settingsController.bind({
      store,
      badges,
      gamification,
      closeModal : (id) => this._closeModal(id),
      onReset    : () => this._showToast('Progress reset!', 'warning'),
    });

    this._bindPinGate();

    keyboardManager.init({
      getScreen   : () => this._screen,
      els         : this._els,
      onHome      : () => this._showScreen(SCREENS.HOME),
      modalManager,
    });

    document.getElementById('btn-review-words')?.addEventListener('click', () => {
      this._startReviewSession();
    });

    document.getElementById('extra-practice-toggle')?.addEventListener('click', () => {
      const content = document.getElementById('extra-practice-content');
      const toggle = document.getElementById('extra-practice-toggle');
      if (!content || !toggle) return;
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      content.classList.toggle('home-extra-content--collapsed', isExpanded);
    });

    document.getElementById('mascot-trigger')?.addEventListener('click', () => {
      mascot.clap();
      this._showToast(mascot.getCheer(), 'success');
      audio.playSfx('pop');
    });

    document.getElementById('profile-chip')?.addEventListener('click', () => {
      this._renderProfileGrid();
      this._showScreen(SCREENS.PROFILES);
    });

    document.getElementById('btn-add-profile')?.addEventListener('click', () => {
      this._openCreateProfileModal();
    });

    // Home-screen "For Parents" footer — large tappable mirrors of the
    // header icons so mobile users don't have to hunt in the top right.
    document.getElementById('btn-home-manage-players')?.addEventListener('click', () => {
      this._renderProfileGrid();
      this._showScreen(SCREENS.PROFILES);
    });
    document.getElementById('btn-home-parent-dashboard')?.addEventListener('click', () => {
      document.getElementById('dashboard-btn')?.click();
    });

    document.querySelector('[data-close="modal-create-profile"]')?.addEventListener('click', () => {
      this._closeModal('modal-create-profile');
    });
    document.getElementById('modal-create-profile')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal-create-profile')) {
        this._closeModal('modal-create-profile');
      }
    });

    document.getElementById('cp-confirm-btn')?.addEventListener('click', () => {
      this._confirmCreateProfile();
    });
    document.getElementById('cp-name-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._confirmCreateProfile();
    });
  }

  /** Start a game round */
  _startGame(group) {
    if (this._sessionType !== 'normal' && this._queuedWords.length > 0) {
      this._currentWord = this._queuedWords.shift();
    } else if (this._sessionType !== 'normal' && this._queuedWords.length === 0) {
      this._finishQueuedSession();
      return;
    } else {
      const modeDiffs = store.get('modeDifficulty') || {};
      const effectiveDiff = modeDiffs[this._mode] ?? store.get('difficulty') ?? 1;
      const opts = { maxLevel: effectiveDiff, mode: this._mode };
      if (group) opts.group = group;
      this._currentWord = progress.getNextWord(opts);
    }

    audio.preloadWord(this._currentWord);

    this._sessionWordCount++;
    const progressEl = document.getElementById('game-progress-count');
    if (progressEl) {
      progressEl.textContent = `Word ${this._sessionWordCount}`;
    }

    this._hintUsed = false;
    this._hintTier = 0;
    this._wrongStrikes = 0;
    this._resultProcessing = false;
    if (this._els.btnHint) {
      this._els.btnHint.classList.remove('used');
      this._els.btnHint.removeAttribute('aria-disabled');
      this._els.btnHint.textContent = '💡 Hint';
    }

    this._showScreen(SCREENS.GAME);
    mascot.think();

    // Show floating mascot in game
    this._setGameMascot('thinking');

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

  _nextWord() {
    this._cleanupMode();
    this._startGame(store.get('currentGroup'));
  }

  /** Handle a correct/wrong result from any mode */
  _handleResult(correct, responseTime) {
    const word = this._currentWord;
    if (!word) return;

    // Guard against double-submission: rapid button clicks or a delayed speech-
    // recognition timeout firing after the word has already been evaluated.
    if (this._resultProcessing) return;
    this._resultProcessing = true;

    const isNew = progress.isNewWord(word.id);
    progress.recordAttempt(word.id, correct, this._mode, responseTime);

    // First-attempt success = decoded without any wrong strikes or hint use.
    if (correct && this._wrongStrikes === 0 && !this._hintUsed) {
      store.set('sessionFirstTryToday', (store.get('sessionFirstTryToday') || 0) + 1);
    }

    if (correct) {
      const reward = gamification.recordCorrect(responseTime, isNew);

      const newBadges = badges.onCorrect({
        fast: responseTime < 3000,
        sessionStreak: gamification.getSessionStats().correct,
        level: reward.newLevel,
        dayStreak: store.get('streak'),
        dailyComplete: reward.dailyComplete,
        mode: this._mode,
      });
      newBadges.forEach(b => badges.notify(b));

      mascot.celebrate(reward.levelUp);
      mascot.setResultState(reward.levelUp ? 'trophy' : 'confetti');
      this._setGameMascot('celebrate');

      if (reward.levelUp) {
        celebrateLevelUp();
        audio.playSfx('levelUp');
        this._showToast(`Level ${reward.newLevel}!`, 'success');
      } else {
        celebrateCorrect();
        audio.playSfx('correct');
      }

      store.addSessionXp(reward.xpEarned || 0);

      if (reward.dailyComplete) {
        celebrateDailyGoal();
        setTimeout(() => this._showSessionSummaryScreen(reward), 1800);
      }

      this._showResultScreen(true, word, reward);
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
      this._setGameMascot('encourage');

      // Two-strike system: first wrong with no hint = gentle nudge, no energy loss.
      if (this._wrongStrikes === 1 && !this._hintUsed) {
        mascot.encourage();
        audio.playSfx('wrong');
        this._showToast('Almost! Try the 💡 Hint to hear the first sound.', 'warning');
        this._els.btnHint?.classList.remove('btn--hint-pulse');
        void this._els.btnHint?.offsetWidth;
        this._els.btnHint?.classList.add('btn--hint-pulse');
        this._els.btnHint?.addEventListener('animationend', () => {
          this._els.btnHint?.classList.remove('btn--hint-pulse');
        }, { once: true });
        this._resultProcessing = false;
        return;
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

    if (screenId === SCREENS.HOME) {
      this._updateQuestBanners();
      this._updateReviewBanner();
      this._renderGuidedJourney();
    }
  }

  _setGameMascot(state) {
    const el = document.getElementById('game-mascot');
    if (!el) return;
    const src = {
      thinking: 'giri-thinking.png',
      celebrate: 'giri-celebrate.png',
      encourage: 'giri-encourage.png',
      clap: 'giri-clap-frame.png',
    }[state] || 'giri-neutral.png';
    const base = import.meta.env.BASE_URL;
    el.innerHTML = `<img src="${base}images/mascot/${src}" alt="" width="48" height="48" style="object-fit:contain"/>`;
    el.classList.add('game-mascot--visible');
    el.classList.remove('game-mascot--celebrate');
    if (state === 'celebrate' || state === 'clap') {
      el.classList.add('game-mascot--celebrate');
    }
  }

  _hideGameMascot() {
    const el = document.getElementById('game-mascot');
    if (el) {
      el.classList.remove('game-mascot--visible', 'game-mascot--celebrate');
    }
  }

  _cleanupMode() {
    const mode = MODES[this._mode];
    mode?.cleanup();
  }

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
      // Guard: word may have changed if the user navigated away during the await.
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
   * Give a progressive hint — three tiers of scaffolding:
   *  Tier 1: Highlight the vowel type (short/long) below the phoneme row
   *  Tier 2: Play the first phoneme sound and highlight the first tile
   *  Tier 3: Reveal a hidden grapheme or play the full word slowly
   * Each tap advances the tier. After tier 3 the button is disabled.
   */
  async _giveHint() {
    if (!this._currentWord) return;

    this._hintTier++;
    const word = this._currentWord;
    const btn = this._els.btnHint;

    if (this._hintTier === 1) {
      this._hintUsed = true;
      const vowelIdx = word.types.findIndex(t => t === 'sv' || t === 'lv');
      if (vowelIdx >= 0) {
        const vowelType = word.types[vowelIdx] === 'sv' ? 'short' : 'long';
        this._showToast(`Hint: The vowel makes a ${vowelType} sound`, 'info');
        const tiles = document.querySelectorAll('#phoneme-row .phoneme-tile');
        if (tiles[vowelIdx]) {
          tiles[vowelIdx].classList.add('active');
          setTimeout(() => tiles[vowelIdx].classList.remove('active'), 800);
        }
      } else {
        // No vowel tile to highlight — advance straight to tier 2
        this._hintTier++;
      }
      if (btn) btn.textContent = '💡 Hint 2';
    }

    if (this._hintTier === 2) {
      const firstGrapheme = word.graphemes[0];
      const firstType     = word.types[0];
      await audio.speakPhoneme(firstGrapheme, firstType);

      const firstTile = document.querySelector('#phoneme-row .phoneme-tile');
      if (firstTile) {
        firstTile.classList.add('active');
        setTimeout(() => firstTile.classList.remove('active'), 800);
      }
      if (btn) btn.textContent = '💡 Hint 3';

    } else if (this._hintTier >= 3) {
      await audio.speakWord(word.word);

      if (btn) {
        btn.classList.add('used');
        btn.setAttribute('aria-disabled', 'true');
        btn.textContent = '💡 Used';
      }
    }
  }

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

    this._els.speechBubble && (this._els.speechBubble.hidden = true);

    // Route through the normal result flow so celebrations, badges,
    // level-ups, and session stats all fire consistently.
    this._handleResult(true, 2500);
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

  // ── PIN Gate ──

  _bindPinGate() {
    const digits = document.querySelectorAll('.pin-digit');
    const hint = document.getElementById('pin-hint');

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

    document.getElementById('pin-confirm-btn')?.addEventListener('click', async () => {
      const pin = Array.from(digits).map(d => d.value).join('');
      if (pin.length < 4) {
        if (hint) hint.textContent = 'Enter all 4 digits';
        return;
      }

      const savedPin = store.get('parentPin');
      const candidateHash = await hashPin(pin);

      if (!savedPin) {
        // First time entering a PIN — store it hashed.
        store.set('parentPin', candidateHash);
        if (hint) hint.textContent = '';
        this._closeModal('modal-pin');
        this._openDashboard();
      } else if (savedPin === pin || savedPin === candidateHash || savedPin === `plain:${pin}`) {
        // Migrate legacy plaintext pins to hashed format.
        if (!isHashedPin(savedPin)) {
          store.set('parentPin', candidateHash);
        }
        if (hint) hint.textContent = '';
        this._closeModal('modal-pin');
        this._openDashboard();
      } else {
        if (hint) hint.textContent = 'Wrong PIN. Try again.';
        digits.forEach(d => { d.value = ''; });
        digits[0].focus();
      }
    });

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
    const readingBand = getReadingBand(profile, store.get('placementProfile') || null);
    const levelKey = readingBand;

    const TUTORIAL = {
      'pre-reader': [
        {
          icon: '🌱',
          title: "Your child's Pre-reader Journey",
          body: `<p class="ob-intro">PhonicsQuest guides your child through three daily activities:</p>
                 <ul class="ob-list">
                   <li><strong>👂 First Sound</strong> — listening-first sound awareness</li>
                   <li><strong>👂 Sound skills</strong> — first, last &amp; middle sounds</li>
                   <li><strong>🔤 Letter Sounds</strong> — adult-guided sound-to-print bridge</li>
                 </ul>`,
        },
        {
          icon: '📋',
          title: 'Follow this order each day',
          body: `<div class="ob-steps">
                   <div class="ob-step">
                     <span class="ob-step-num">1</span>
                     <div><strong>Start with First Sound</strong><br><small>No-print listening warm-up</small></div>
                   </div>
                   <div class="ob-step">
                     <span class="ob-step-num">2</span>
                     <div><strong>Practise Hear &amp; Choose</strong><br><small>Sound-to-picture matching</small></div>
                   </div>
                   <div class="ob-step">
                     <span class="ob-step-num">3</span>
                     <div><strong>Add Letter Sounds</strong><br><small>Teacher-supported print bridge</small></div>
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
      'emerging-decoder': [
        {
          icon: '🧩',
          title: "Your child's Emerging Decoder Journey",
          body: `<p class="ob-intro">This stage strengthens early reading fluency:</p>
                 <ul class="ob-list">
                   <li><strong>🎯 Blend It!</strong> — decode step by step</li>
                   <li><strong>🃏 Sight Words</strong> — build automatic word reading</li>
                   <li><strong>📚 Giri Stories</strong> — short connected reading</li>
                 </ul>`,
        },
      ],
      'developing-reader': [
        {
          icon: '📘',
          title: "Your child's Developing Reader Bridge",
          body: `<p class="ob-intro">Keep decoding active while adding sentence work:</p>
                 <ul class="ob-list">
                   <li><strong>🎯 Blend It!</strong> — quick phonics review</li>
                   <li><strong>📚 Giri Stories</strong> — sentence &amp; paragraph reading</li>
                   <li><strong>🔨 Sentence Forge</strong> — begin sentence building</li>
                 </ul>`,
        },
      ],
      reader: [
        {
          icon: '🏫',
          title: "Your child's Reader Journey",
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

    const screens   = TUTORIAL[levelKey] || TUTORIAL['pre-reader'];
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
        onNavigate: ({ target, group }) => {
          this._closeModal('modal-dashboard');
          this._navigateTo(target, group);
        },
      });
    }

    // Export/import buttons are rendered inside the dashboard — bind after it renders.
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
      case 'grammar-mcq':
        document.getElementById('btn-grammar-mcq')?.click();
        break;
      case 'vocab-mcq':
        document.getElementById('btn-vocab-mcq')?.click();
        break;
      case 'paper-mode':
        document.getElementById('btn-paper-mode')?.click();
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
      case 'visual-text':
      case 'comprehension-cloze':
      case 'open-comprehension':
      case 'synthesis':
      case 'situational-writing':
      case 'p1-practice-tests':
      case 'p2-practice-tests':
      case 'p3-practice-tests':
        this._openPrimaryPlaceholder(target);
        break;
      default:
        break;
    }
  }

  _openPrimaryPlaceholder(kind) {
    const meta = getPlaceholderMeta(kind);
    if (!meta) return;
    const titleEl = document.getElementById('primary-placeholder-title');
    const iconEl  = document.getElementById('primary-placeholder-icon');
    if (titleEl) titleEl.textContent = meta.label;
    if (iconEl)  iconEl.textContent = meta.icon;
    const container = document.getElementById('primary-placeholder-content');
    const goHome = () => {
      cleanupComprehensionClozeQuest();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    };
    if (kind === 'comprehension-cloze') {
      initComprehensionClozeQuest(container, { onClose: goHome });
    } else {
      mountPlaceholderModule(container, kind, {
        onClose: goHome,
        onRelated: (target) => this._navigateTo(target),
      });
    }
    this._showScreen(SCREENS.PRIMARY_PLACEHOLDER);
    mascot.setState('whiteboard');
  }

  _launchPaperSection(sectionKey, level) {
    const map = {
      'grammar-mcq': () => {
        initGrammarMcq(
          document.getElementById('grammar-mcq-content'),
          () => {
            cleanupGrammarMcq();
            this._showScreen(SCREENS.HOME);
            mascot.setHomeState('holdCard');
          },
        );
        this._showScreen(SCREENS.GRAMMAR_MCQ);
        mascot.setState('whiteboard');
        if (level) startGrammarMcqLevel(level);
        else showGrammarMcqBrowser();
      },
      'vocab-mcq': () => {
        initVocabMcq(
          document.getElementById('vocab-mcq-content'),
          () => {
            cleanupVocabMcq();
            this._showScreen(SCREENS.HOME);
            mascot.setHomeState('holdCard');
          },
        );
        this._showScreen(SCREENS.VOCAB_MCQ);
        mascot.setState('celebrate');
        if (level) startVocabMcqLevel(level);
        else showVocabMcqBrowser();
      },
      'cloze-castle': () => document.getElementById('btn-cloze-castle')?.click(),
      'word-vault': () => document.getElementById('btn-word-vault')?.click(),
      'editing-quest': () => document.getElementById('btn-editing-quest')?.click(),
      'sentence-forge-word-order': () => {
        setSentenceForgeTrack('word-order');
        document.getElementById('btn-sentence-forge')?.click();
      },
      'sentence-forge-combining': () => {
        setSentenceForgeTrack('sentence-combining');
        document.getElementById('btn-sentence-forge')?.click();
      },
      'sentence-forge-synthesis': () => {
        setSentenceForgeTrack('synthesis-transformation');
        document.getElementById('btn-sentence-forge')?.click();
      },
    };
    map[sectionKey]?.();
  }

  /**
   * Render the guided learner journey section on the home screen.
   * Renders: pathway badge, Best Next Step hero card, 3-step roadmap, progress chips.
   * Then adjusts section visibility for preschool vs primary layouts.
   */
  _renderGuidedJourney() {
    const section = document.getElementById('guided-journey-section');
    if (!section) return;

    const profile   = getActiveProfile ? getActiveProfile() : null;
    const placement = store.get('placementProfile') || null;
    const readingBand = getReadingBand(profile, placement);

    const rec   = getRecommendation();
    const plan  = getDailyPlan();
    const chips = getLearnerSummaryChips();

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

    // Progress bar: each of 4 stages = 25%, plus partial credit from within-stage mastery.
    const JOURNEY_STAGES = [
      { key: 'pre-reader',       label: 'Pre-reader',   shortLabel: 'Pre',     desc: 'Learning sounds & letters' },
      { key: 'emerging-decoder', label: 'Emerging',     shortLabel: 'Emerging', desc: 'Decoding simple words' },
      { key: 'developing-reader',label: 'Developing',   shortLabel: 'Developing', desc: 'Reading short stories' },
      { key: 'reader',           label: 'Reader',       shortLabel: 'Reader',  desc: 'Reading fluently' },
    ];
    const currentStageIdx = JOURNEY_STAGES.findIndex(s => s.key === readingBand);
    const safeIdx         = currentStageIdx === -1 ? 0 : currentStageIdx;
    const groupMastery    = store.get('groupMastery') || {};
    const masteryValues   = Object.values(groupMastery).filter(v => typeof v === 'number');
    const avgMastery      = masteryValues.length ? masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length : 0;
    const withinStagePct  = Math.min(Math.round(avgMastery * 100), 99);
    const baseProgress    = safeIdx * 25;
    const totalProgress   = Math.min(baseProgress + Math.round(withinStagePct * 0.25), 100);
    const nextStage       = JOURNEY_STAGES[safeIdx + 1];

    const journeyStepsHtml = JOURNEY_STAGES.map((s, i) => {
      const isDone    = i < safeIdx;
      const isCurrent = i === safeIdx;
      return `<div class="journey-stage ${isDone ? 'journey-stage--done' : ''} ${isCurrent ? 'journey-stage--current' : ''}"
                   aria-label="${s.label}${isCurrent ? ' (current)' : isDone ? ' (complete)' : ''}">
        <div class="journey-stage-dot">${isDone ? '✓' : isCurrent ? stageMeta[readingBand]?.icon || '•' : ''}</div>
        <span class="journey-stage-name">${s.shortLabel}</span>
      </div>`;
    }).join('<div class="journey-stage-connector"></div>');

    const journeyBarHtml = `
      <div class="reading-journey-bar" aria-label="Reading level progress">
        <div class="journey-bar-header">
          <span class="journey-bar-title">Reading Journey</span>
          <span class="journey-bar-stage">${JOURNEY_STAGES[safeIdx].label} · Stage ${safeIdx + 1} of 4</span>
        </div>
        <div class="journey-progress-track" role="progressbar" aria-valuenow="${totalProgress}" aria-valuemin="0" aria-valuemax="100" aria-label="Overall reading level: ${totalProgress}%">
          <div class="journey-progress-fill" style="width:${totalProgress}%"></div>
        </div>
        <div class="journey-stages">
          ${journeyStepsHtml}
        </div>
        ${nextStage ? `<p class="journey-next-goal">Next: <strong>${nextStage.label}</strong> — ${nextStage.desc}</p>` : '<p class="journey-next-goal">🏅 Reading journey complete!</p>'}
      </div>`;

    const urgencyIcon  = rec.urgency === 'high'   ? '🔴'
                       : rec.urgency === 'medium' ? '🟡' : '🟢';
    const urgencyText  = rec.urgency === 'high'   ? 'Focus area'
                       : rec.urgency === 'medium' ? 'Needs practice' : 'Looking good';

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

    const chipsHtml = chips.length
      ? `<div class="progress-chips" aria-label="Progress snapshot">
           ${chips.map(c => `<span class="progress-chip">${c}</span>`).join('')}
         </div>`
      : '';

    section.innerHTML = `
      ${journeyBarHtml}

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
    const levelBadge    = document.getElementById('primary-level-badge');
    const startHere     = document.getElementById('primary-start-here');

    const profile = getActiveProfile ? getActiveProfile() : null;
    // P1–P6 primary profiles always get the Primary English-first layout
    // even if their reading band placement hasn't run yet.
    const isPrimary = !!profile?.primaryGrade
      || profile?.schoolLevel === 'primary'
      || readingBand === 'reader';

    const layout = isPrimary
      ? { hidePhonicsCore: true, questsMilestone: false, spotlightSentenceForge: false }
      : getHomeLayoutForReadingBand(readingBand);
    const sentenceForgeBtn = document.getElementById('btn-sentence-forge');

    if (layout.hidePhonicsCore) {
      // Primary pathway: collapse Early Reading Quest to a small "also available"
      // strip below the Primary English Quest hub, and surface a "Start Here
      // Today" recommendation built from weak skills.
      coreSection?.classList.add('home-section--collapsed');
      questsSection?.classList.remove('home-section--milestone');
      questsSection?.classList.add('home-section--primary-priority');
      if (questsHeading) questsHeading.textContent = '🏫 Primary English Quest';
      if (questsSub)     questsSub.textContent     = 'School-paper components · choose a module · P1–P6';
      sentenceForgeBtn?.classList.remove('stories-banner--spotlight');

      if (levelBadge && profile?.primaryGrade) {
        levelBadge.style.display = '';
        levelBadge.innerHTML =
          `<span class="primary-level-badge__text">Practising: <strong>${profile.primaryGrade} English</strong></span>`;
      } else if (levelBadge) {
        levelBadge.style.display = 'none';
      }

      this._renderPrimaryStartHere(startHere);
      this._renderPrimaryEarlyReadingNote(coreSection);
    } else if (!layout.questsMilestone) {
      coreSection?.classList.remove('home-section--hidden', 'home-section--collapsed');
      questsSection?.classList.remove('home-section--milestone', 'home-section--primary-priority');
      if (questsHeading) questsHeading.textContent = 'Bridge Quests';
      if (questsSub)     questsSub.textContent     = 'Keep phonics active and begin Sentence Forge first';
      sentenceForgeBtn?.classList.toggle('stories-banner--spotlight', layout.spotlightSentenceForge);
      if (levelBadge) levelBadge.style.display = 'none';
      if (startHere) startHere.style.display = 'none';
    } else {
      coreSection?.classList.remove('home-section--hidden', 'home-section--collapsed');
      questsSection?.classList.add('home-section--milestone');
      questsSection?.classList.remove('home-section--primary-priority');
      if (questsHeading) questsHeading.textContent = 'Quest Milestones';
      if (questsSub)     questsSub.textContent     = 'Unlocks as decoding and reading readiness improve';
      sentenceForgeBtn?.classList.toggle('stories-banner--spotlight', layout.spotlightSentenceForge);
      if (levelBadge) levelBadge.style.display = 'none';
      if (startHere) startHere.style.display = 'none';
    }
  }

  /**
   * Render the "Today's Mission" card on the primary home — a five-step
   * 10-minute English Quest (3 grammar cloze + 3 vocab cloze + 1 comp clue
   * + 1 sentence correction + 1 yesterday's-slip review). Step progress is
   * read live from questAttempts so completing tasks inside the modules
   * ticks chips automatically.
   */
  _renderPrimaryStartHere(host) {
    if (!host) return;
    let summary;
    try { summary = getMissionSummary(); } catch (_) { summary = null; }
    if (!summary) {
      host.style.display = 'none';
      return;
    }

    const escAttr = (s) => String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const escText = (s) => String(s ?? '').replace(/[<>&]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;' }[c]));

    const stepsHtml = summary.steps.map(step => {
      const stateClass = step.done ? 'mission-step--done' : '';
      const progressLabel = step.goal > 1
        ? `${Math.min(step.count, step.goal)}/${step.goal}`
        : (step.done ? '✓' : 'Start');
      const aria = step.done
        ? `${step.title}, complete`
        : `${step.title}, ${progressLabel}`;
      return `
        <button type="button"
          class="mission-step ${stateClass}"
          data-target="${escAttr(step.target || '')}"
          data-step-id="${escAttr(step.id)}"
          aria-label="${escAttr(aria)}">
          <span class="mission-step__num" aria-hidden="true">${step.num}</span>
          <span class="mission-step__icon" aria-hidden="true">${escText(step.icon)}</span>
          <span class="mission-step__body">
            <span class="mission-step__title">${escText(step.title)}</span>
            <span class="mission-step__desc">${escText(step.description)}</span>
          </span>
          <span class="mission-step__progress" aria-hidden="true">${escText(progressLabel)}</span>
        </button>`;
    }).join('');

    const headline = summary.complete
      ? '🎉 Mission complete! See you tomorrow.'
      : `🎯 Today's Mission · ${summary.done}/${summary.total} done`;

    host.style.display = '';
    host.innerHTML = `
      <div class="home-section-header">
        <p class="home-section-heading">${headline}</p>
        <p class="home-section-sub">10 minutes · do them in order for the best lift.</p>
      </div>
      <div class="mission-card" role="list">${stepsHtml}</div>`;

    host.querySelectorAll('.mission-step[data-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        const stepId = btn.dataset.stepId;
        if (!target) return;
        if (stepId === 'comprehension-clue') {
          markMissionStepDone(stepId);
        }
        this._navigateTo(target);
      });
    });
  }

  _renderPrimaryEarlyReadingNote(section) {
    if (!section) return;
    if (section.querySelector('.early-reading-note')) return;
    const note = document.createElement('p');
    note.className = 'early-reading-note';
    note.setAttribute('role', 'note');
    note.textContent = 'Phonics and blending are still available below — open them whenever you want a warm-up before Primary English practice.';
    section.prepend(note);
  }

  // ── Modals ──

  _openModal(id) {
    modalManager.open(id, {
      onClose: () => this._onModalClosed(id),
    });
  }

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

    const levelGroup = document.getElementById('cp-level-group');
    const gradeGroup = document.getElementById('cp-grade-group');
    const levelHint  = document.getElementById('cp-level-hint');
    if (levelGroup) {
      const levelBtns = levelGroup.querySelectorAll('.cp-level-btn');
      const gradeBtns = gradeGroup ? gradeGroup.querySelectorAll('.cp-grade-btn') : [];

      const setGrade = (selected) => {
        gradeBtns.forEach(b => {
          const active = b === selected;
          b.classList.toggle('cp-grade-btn--selected', active);
          b.setAttribute('aria-pressed', String(active));
        });
      };

      const setLevel = (selected) => {
        levelBtns.forEach(b => {
          const active = b === selected;
          b.classList.toggle('cp-level-btn--selected', active);
          b.setAttribute('aria-pressed', String(active));
        });
        const isPrimary = selected.dataset.level === 'primary';
        if (gradeGroup) gradeGroup.style.display = isPrimary ? '' : 'none';
        if (levelHint) {
          levelHint.textContent = isPrimary
            ? 'All Primary English components unlock immediately'
            : 'Phonics games unlock as words are mastered';
        }
        if (!isPrimary) setGrade(null);
      };

      // Default to preschool on each open
      setLevel(levelGroup.querySelector('[data-level="preschool"]'));
      levelBtns.forEach(btn => btn.addEventListener('click', () => setLevel(btn)));
      gradeBtns.forEach(btn => btn.addEventListener('click', () => setGrade(btn)));
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
    const selectedGradeBtn = document.querySelector('.cp-grade-btn--selected');
    const primaryGrade = selectedGradeBtn?.dataset.grade || null;

    const profile = createProfile(name, avatar, color, schoolLevel, { primaryGrade });
    this._closeModal('modal-create-profile');

    activateProfile(profile.id);
    gamification.init();
    this._updateProfileChip();
    this._renderProfileGrid();

    // Placement determines reading band; school level only affects quest gating.
    //
    // Primary-school profiles (P1-P6) skip the phonics diagnostic — those
    // children are already past the decode-blend-segment stage and the
    // placement test would just be a frustrating barrier between them and
    // the Primary English content.  Seed a "reader" placement so downstream
    // band-aware logic still has a sane shape to read from.
    if (profile.schoolLevel === 'primary' && !store.get('placementComplete')) {
      const primaryPlacement = this._buildPrimaryDefaultPlacement(profile);
      store.set('placementProfile', primaryPlacement);
      store.set('placementComplete', true);
      this._afterPlacement(profile, primaryPlacement);
    } else if (!store.get('placementComplete')) {
      this._showScreen('screen-placement');
      this._runPlacementTest(profile);
    } else {
      this._afterPlacement(profile, null);
    }

    audio.playSfx('correct');
  }

  /**
   * Build a default placement payload for primary-school profiles that
   * skip the diagnostic.  Sets readingBand to "reader" so the Primary
   * English layout is shown, and marks every readiness flag so quest
   * gating doesn't block access.  Phonics-stage fields are kept at
   * their highest values for consistency with the rest of the app.
   * @param {object} profile
   */
  _buildPrimaryDefaultPlacement(profile) {
    return {
      readingBand: 'reader',
      phonicsPhase: 5,
      phase: 5,
      startGroup: null,
      preSeededStats: {},
      sightWordBand: 'strong',
      storyReadiness: 'paragraph',
      sentenceReady: true,
      grammarReady: true,
      vocabularyReady: true,
      bandDescription: 'Primary English pathway — diagnostic skipped for school-age learners.',
      intake: {
        schoolLevel: 'primary',
        primaryGrade: profile?.primaryGrade || null,
      },
      skippedDiagnostic: true,
    };
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

    if (!store.get('onboardingComplete')) {
      setTimeout(() => this._showOnboardingTutorial(profile), 400);
      return;
    }

    this._checkReturnEvents();
  }

  // ── Return-event checks (streak freeze, comeback, weekly recap, backup) ──

  /**
   * Checks: streak freeze notification → comeback session → weekly recap → backup reminder.
   * Each check is mutually exclusive per session to avoid modal stacking.
   */
  _checkReturnEvents() {
    if (gamification.wasFreezeUsed()) {
      this._showToast('Streak saved! 🛡️ Your streak freeze was used automatically.', 'success');
    }

    const daysAway = gamification.getDaysAway();
    if (daysAway >= 2 && daysAway <= 6) {
      const last = store.get('comebackShownAt');
      const today = new Date().toDateString();
      if (!last || new Date(last).toDateString() !== today) {
        store.set('comebackShownAt', new Date().toISOString());
        setTimeout(() => this._showComebackModal(daysAway), 600);
        return;
      }
    }

    if (shouldShowWeeklyRecap()) {
      const stats = gamification.getWeeklyStats();
      setTimeout(() => showWeeklyRecap({
        stats,
        onClose: () => this._checkBackupReminder(),
      }), 600);
      return;
    }

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

    const wordCount = Object.keys(store.get('wordStats') || {}).length;
    if (wordCount < 10) return;

    store.set('lastBackupReminderAt', new Date().toISOString());
    this._showBackupReminderModal();
  }

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
    const wordsToday   = (store.get('sessionWordsToday') || []).length;
    const firstTryCount = store.get('sessionFirstTryToday') || 0;
    const streak       = store.get('streak') || 0;

    // Collect any badges that fired today
    const newBadges = badges.getRecentlyEarned?.() || [];

    showSessionSummary({
      xpEarned:    store.get('sessionXpToday') || reward.xpEarned || 0,
      wordsCount:  wordsToday,
      firstTryCount,
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
    const snapshot     = buildProgressionSnapshot();
    const unlocked     = getUnlockedStages(snapshot);
    const recommended  = getRecommendedStage(snapshot);

    document.getElementById('modal-blend-picker')?.remove();

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
        // When locked, show *why* — the strict gate's failed checks. Helps
        // a parent see "ah, only 8/12 unique words" rather than a bare 🔒.
        const lockReason = isUnlocked ? '' : (explainLockReason(stage.id, snapshot) || '');

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
                <div class="bp-stage-mastery-row">
                  <div class="bp-stage-mastery-wrap">
                    <div class="bp-stage-mastery-bar" style="width:${pct}%"></div>
                  </div>
                  <span class="bp-stage-pct${pct >= 80 ? ' bp-stage-pct--mastered' : ''}">${pct}%</span>
                </div>` : lockReason ? `<div class="bp-stage-lock-reason">${lockReason}</div>` : ''}
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

  // ── Queued Sessions (Daily Challenge / Review) ──

  _startDailyChallenge() {
    this._sessionType = 'dailyChallenge';
    this._queuedWords = getDailyChallengeWords();
    this._queuedCorrect = 0;
    this._mode = 'blend';
    store.set('currentGroup', null);
    this._showToast(`Today's 5 words – go! ⚡`, 'info');
    this._startGame();
  }

  /** Start a review session with SRS-due words */
  _startReviewSession() {
    const dueWords = progress.getReviewDueWords();
    if (dueWords.length === 0) {
      this._showToast('No words due for review right now!', 'info');
      return;
    }
    this._sessionType = 'review';
    this._queuedWords = dueWords.slice(0, 10);
    this._queuedCorrect = 0;
    this._mode = 'blend';
    store.set('currentGroup', null);
    this._showToast(`Review time! ${this._queuedWords.length} words to practise 🔄`, 'info');
    this._startGame();
  }

  /**
   * Handle completion of a queued session (daily challenge or review).
   * Only daily challenge sessions trigger completeDailyChallenge().
   */
  _finishQueuedSession() {
    const type = this._sessionType;
    this._sessionType = 'normal';

    if (type === 'dailyChallenge') {
      const bonusXp = completeDailyChallenge();
      if (bonusXp > 0) {
        celebrateDailyGoal();
        audio.playSfx('levelUp');
        this._showToast(`Daily Challenge done! +${bonusXp} bonus XP!`, 'success');
      } else {
        this._showToast('Daily Challenge already claimed today!', 'info');
      }
      this._updateDailyBanner();
    } else if (type === 'review') {
      this._showToast('Review session complete! Great revision! 🔄', 'success');
      audio.playSfx('correct');
    }

    this._showScreen(SCREENS.HOME);
    mascot.setHomeState('holdCard');
  }

  /** Update the review words banner */
  _updateReviewBanner() {
    const dueWords = progress.getReviewDueWords();
    const banner = document.getElementById('review-banner');
    const sub = document.getElementById('review-banner-sub');
    if (!banner) return;

    if (dueWords.length > 0) {
      banner.style.display = '';
      if (sub) sub.textContent = `${dueWords.length} word${dueWords.length === 1 ? '' : 's'} due for review`;
    } else {
      banner.style.display = 'none';
    }
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

  /**
   * Primary-school profiles bypass mastery gating (all quests unlock immediately).
   * Preschool profiles unlock quests as words are mastered (≥6 attempts, ≥80% accuracy).
   */
  _getQuestUnlockStatus() {
    const profile = getActiveProfile();
    const stats = store.get('wordStats') || {};
    const placementProfile = store.get('placementProfile') || null;
    return getQuestUnlockStatus(stats, profile, QUEST_THRESHOLDS, placementProfile);
  }

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

}


export const app = new App();
