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
import { escapeHtml } from './utils/escapeHtml.js';
import * as homeBanners from './modules/homeBanners.js';
import * as askGiriPanel from './components/panels/askGiriPanel.js';
import * as mistakesDenPanel from './components/panels/mistakesDenPanel.js';
import * as trophyRoomPanel from './components/panels/trophyRoomPanel.js';
import { html, raw } from './utils/html.js';
import { audio } from './modules/audio.js';
import { gamification } from './modules/gamification.js';
import { badges } from './modules/badges.js';
import { progress, isStageHiddenForMode } from './modules/progress.js';
import { getReviewCapForProfile } from './modules/reviewScheduler.js';
import { buildWordWorkout } from './modules/wordWorkout.js';
import {
  isBedtimeActive,
  setBedtimeEnabled,
  applyBedtimeStateToDom,
  getBedtimeStatus,
} from './modules/bedtimeMode.js';
import { initHomeTabs, selectTab, getInitialTab } from './modules/homeTabs.js';
import { buildJourneyBarHtml, STAGE_META } from './components/journeyBar.js';
import { renderJourneyMap } from './components/journeyMap.js';
import { speech, calculateCalibrationThreshold } from './modules/speech.js';
import { mascot } from './components/mascot.js';
import { findStageForGroup, hasSeenLesson, maybeShowStageLesson, showTipLesson } from './components/miniLesson.js';
import { spinWheel } from './components/wheel.js';
import { celebrateCorrect, celebrateLevelUp, celebrateDailyGoal } from './components/confettiHelper.js';
import { MODES } from './modes/index.js';
import { getLearnerSummaryChips } from './modules/recommendations.js';
import { initLetterSounds, cleanupLetterSounds } from './modes/letterSounds.js';
import {
  initSightMatch, showSightBrowser, cleanupSightMatch,
  startSightMatchQuest,
} from './modes/sightMatch.js';
import {
  initSightLearn, showSightLearn, cleanupSightLearn,
} from './modes/sightLearn.js';
import { getPlaceholderMeta } from './modes/placeholderMeta.js';
import { lazyModule } from './modes/lazy.js';

// ── Lazily-loaded heavy features ────────────────────────────────────────────
// These modes/components carry large data sets (word banks, practice tests,
// comprehension passages) or libraries (chart.js). They are split into their
// own chunks and fetched on first open instead of bloating the initial bundle.
// Cleanup paths use `.get()?.fn()` so a feature that was never opened is a
// safe no-op.
const dashboardMod    = lazyModule(() => import('./components/dashboard.js'));
const roadmapMod      = lazyModule(() => import('./components/roadmap.js'));
const storyModeMod    = lazyModule(() => import('./modes/storyMode.js'));
const sentenceForgeMod = lazyModule(() => import('./modes/sentenceForge.js'));
const clozeCastleMod  = lazyModule(() => import('./modes/clozeCastle.js'));
const wordVaultMod    = lazyModule(() => import('./modes/wordVault.js'));
const grammarMcqMod   = lazyModule(() => import('./modes/grammarMcq.js'));
const vocabMcqMod     = lazyModule(() => import('./modes/vocabMcq.js'));
const paperModeMod    = lazyModule(() => import('./modes/paperMode.js'));
const editingQuestMod = lazyModule(() => import('./modes/editingQuest.js'));
const writingQuestMod = lazyModule(() => import('./modes/writingQuest.js'));
const synthesisQuestMod = lazyModule(() => import('./modes/synthesisQuest.js'));
const placeholdersMod = lazyModule(() => import('./modes/primaryPlaceholders.js'));
const comprehensionClozeMod = lazyModule(() => import('./modes/comprehensionClozeQuest.js'));
const listeningCompMod = lazyModule(() => import('./modes/listeningComp.js'));
import {
  getProfiles, createProfile, deleteProfile, activateProfile,
  getActiveProfile, needsProfileSelection, restoreActiveProfile,
  exportProfile, importProfile,
  AVATAR_OPTIONS, COLOR_OPTIONS,
} from './modules/profiles.js';
import {
  getDailyChallengeWords, isDailyChallengeComplete,
  completeDailyChallenge,
} from './modules/dailyChallenge.js';
import { markMissionStepDone } from './modules/missionToday.js';
import {
  getTodaysLessonView, markLessonStarted, markTeachDone,
  finalizeLessonIfComplete, LESSON_BONUS_XP,
} from './modules/lessonRunner.js';
import { CURRICULUM, PHASES, PHASE_LABELS } from './data/curriculum.js';
import { getStagesForMode } from './modules/phonicsProgression.js';
import {
  buildProgressionSnapshot, getUnlockedStages, getRecommendedStage, explainLockReason,
} from './modules/progression.js';
import { createPaSequencerState, nextPaWord, paPositionForMode } from './modules/paTargetSequencer.js';
import { WORDS } from './data/words.js';
import { pickSyllableWord } from './data/syllableWords.js';
import { SCREENS, QUEST_THRESHOLDS } from './constants.js';
import { modalManager } from './modules/modalManager.js';
import { keyboardManager } from './modules/keyboardManager.js';
import { settingsController } from './modules/settingsController.js';
import { getQuestUnlockStatus } from './modules/questUnlocks.js';
import { showPlacementTest } from './modules/placementTest.js';
const quickCheckMod = lazyModule(() => import('./modules/primaryQuickCheck.js'));
import { getReadingBand, getHomeLayoutForReadingBand } from './modules/readingStages.js';
import { isTeacherUnlockActive, tryTeacherUnlock, lockTeacherMode } from './modules/teacherUnlock.js';
import { showSessionSummary } from './components/sessionSummary.js';
import { showWeeklyRecap, shouldShowWeeklyRecap } from './components/weeklyRecap.js';

import { createPinHash, verifyPin } from './modules/parentPin.js';

class App {
  constructor() {
    /** @type {string} current screen id */
    this._screen = SCREENS.HOME;
    /** @type {string} current mode key */
    this._mode = 'blend';
    /** @type {import('./data/words.js').Word|null} */
    this._currentWord = null;

    /**
     * Per-session state for the phonemic-awareness target sequencer
     * (First / Last / Middle Sound). Tracks where on the alphabetical
     * target ladder the child is, so each sound is heard as a SET of
     * exemplars before the ladder advances. Auto-resets when the mode
     * or stage changes — see paTargetSequencer.js for the policy.
     * @type {import('./modules/paTargetSequencer.js').PaSequencerState}
     */
    this._paSeqState = createPaSequencerState();

    /**
     * Recently-shown ids for Clap the Syllables (most-recent first),
     * so the phonological pool doesn't repeat a picture back-to-back.
     * @type {string[]}
     */
    this._syllableHistory = [];

    /**
     * Session type: 'normal' | 'dailyChallenge' | 'review' | 'wordWorkout'
     * Prevents review sessions from accidentally completing the daily challenge.
     * @type {'normal'|'dailyChallenge'|'review'|'wordWorkout'}
     */
    this._sessionType = 'normal';
    /** @type {import('./data/words.js').Word[]} remaining queued words (daily/review) */
    this._queuedWords = [];
    /**
     * Multi-mode rounds for the Word Workout session. Each entry pins a
     * specific mode to a specific word; the same word repeats across the
     * list so the workout drills one item from several angles.
     * @type {Array<{ word: import('./data/words.js').Word, mode: string }>}
     */
    this._queuedRounds = [];
    /** Word being drilled in the active Word Workout (for results copy). */
    this._workoutWord = null;
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
    initHomeTabs();

    gamification.init();
    mascot.init();

    const canvas = document.getElementById('spin-wheel');
    if (canvas) spinWheel.init(canvas);

    const micBtn = document.getElementById('btn-mic');
    if (micBtn && !speech.supported) {
      micBtn.classList.add('hidden');
    }

    settingsController.applyTheme(store.get('theme') || 'default');
    // Re-apply the persisted Bedtime Mode flag (was hydrated by the
    // localStorage read in bedtimeMode.js when the module imported).
    applyBedtimeStateToDom();
    this._refreshBedtimeToggle();

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
    this._updateWordWorkoutBanner();
    this._updateMistakesDenBanner();
    this._updatePersonalBestBanner();
    this._refreshBedtimeToggle();
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
    // Phonics modes that get the curriculum-stage picker before play
    // starts. Classic Blend keeps its built-in dropdown (it sets the
    // group itself), so it's excluded.
    // Clap the Syllables is intentionally NOT here — it's a phonological
    // game decoupled from the decoding curriculum, so it skips the
    // (lockable) stage picker and launches straight into play.
    const PICKER_MODES = new Set([
      'blend', 'oralBlend', 'first', 'last', 'middle',
      'soundCount', 'oralSegment', 'hear', 'missing', 'segment',
      'train', 'soundHunt', 'oddOneOut', 'wordCount',
      'wordSort', 'readAndTap',
    ]);

    document.querySelectorAll('.mode-card').forEach((card, idx) => {
      card.style.setProperty('--i', String(idx));
      card.addEventListener('click', () => {
        this._mode = card.dataset.mode;
        store.set('currentMode', this._mode);
        if (PICKER_MODES.has(this._mode)) {
          // Phonemic-awareness and segmenting modes now share Blend It!'s
          // phase-by-phase progression — pick a stage, get a mastery bar.
          this._openStagePicker(this._mode);
        } else {
          // Classic Blend has its own dropdown; everything else starts
          // with the last group the child chose (or no group at all).
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
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-stories')?.addEventListener('click', async () => {
      const m = await storyModeMod.load();
      m.initStoryMode(
        document.getElementById('stories-content'),
        () => {
          storyModeMod.get()?.cleanupStoryMode();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      m.showBrowser();
      this._showScreen('screen-stories');
      mascot.setState('celebrate');
      badges.onStoriesOpened().forEach(b => badges.notify(b));
    });

    document.getElementById('btn-stories-back')?.addEventListener('click', () => {
      storyModeMod.get()?.cleanupStoryMode();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-home-roadmap')?.addEventListener('click', () => {
      this._openRoadmap();
    });

    document.getElementById('btn-home-teacher-unlock')?.addEventListener('click', () => {
      this._toggleTeacherUnlock();
    });

    document.getElementById('btn-roadmap-back')?.addEventListener('click', () => {
      this._showScreen(SCREENS.HOME);
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

    document.getElementById('btn-sentence-forge')?.addEventListener('click', async () => {
      const unlock = this._getQuestUnlockStatus();
      if (!unlock.sentenceForge.unlocked) {
        this._showToast(`Master ${unlock.sentenceForge.required} words to unlock! (${unlock.sentenceForge.current} so far)`, 'warning');
        return;
      }
      const m = await sentenceForgeMod.load();
      m.initSentenceForge(
        document.getElementById('sentence-forge-content'),
        () => {
          sentenceForgeMod.get()?.cleanupSentenceForge();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      m.showSentenceBrowser();
      this._showScreen('screen-sentence-forge');
      mascot.setState('celebrate');
    });

    document.getElementById('btn-sfq-back')?.addEventListener('click', () => {
      sentenceForgeMod.get()?.cleanupSentenceForge();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-grammar-mcq')?.addEventListener('click', async () => {
      const m = await grammarMcqMod.load();
      m.initGrammarMcq(
        document.getElementById('grammar-mcq-content'),
        () => {
          grammarMcqMod.get()?.cleanupGrammarMcq();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      m.showGrammarMcqBrowser();
      this._showScreen(SCREENS.GRAMMAR_MCQ);
      mascot.setState('whiteboard');
    });
    document.getElementById('btn-gmcq-back')?.addEventListener('click', () => {
      grammarMcqMod.get()?.cleanupGrammarMcq();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-vocab-mcq')?.addEventListener('click', async () => {
      const m = await vocabMcqMod.load();
      m.initVocabMcq(
        document.getElementById('vocab-mcq-content'),
        () => {
          vocabMcqMod.get()?.cleanupVocabMcq();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      m.showVocabMcqBrowser();
      this._showScreen(SCREENS.VOCAB_MCQ);
      mascot.setState('celebrate');
    });
    document.getElementById('btn-vmcq-back')?.addEventListener('click', () => {
      vocabMcqMod.get()?.cleanupVocabMcq();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-paper-mode')?.addEventListener('click', async () => {
      const m = await paperModeMod.load();
      m.initPaperMode(document.getElementById('paper-mode-content'), {
        onGoHome: () => {
          paperModeMod.get()?.cleanupPaperMode();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
        onLaunchSection: (sectionKey, level) => {
          paperModeMod.get()?.cleanupPaperMode();
          this._launchPaperSection(sectionKey, level);
        },
      });
      m.showPaperModeBrowser();
      this._showScreen(SCREENS.PAPER_MODE);
      mascot.setState('whiteboard');
    });
    document.getElementById('btn-paper-back')?.addEventListener('click', () => {
      paperModeMod.get()?.cleanupPaperMode();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-cloze-castle')?.addEventListener('click', async () => {
      const unlock = this._getQuestUnlockStatus();
      if (!unlock.clozeCastle.unlocked) {
        this._showToast(`Master ${unlock.clozeCastle.required} words to unlock! (${unlock.clozeCastle.current} so far)`, 'warning');
        return;
      }
      const m = await clozeCastleMod.load();
      m.initClozeCastle(
        document.getElementById('cloze-castle-content'),
        () => {
          clozeCastleMod.get()?.cleanupClozeCastle();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      m.showClozeBrowser();
      this._showScreen('screen-cloze-castle');
      mascot.setState('celebrate');
    });

    document.getElementById('btn-ccq-back')?.addEventListener('click', () => {
      clozeCastleMod.get()?.cleanupClozeCastle();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-word-vault')?.addEventListener('click', async () => {
      const unlock = this._getQuestUnlockStatus();
      if (!unlock.wordVault.unlocked) {
        this._showToast(`Master ${unlock.wordVault.required} words to unlock! (${unlock.wordVault.current} so far)`, 'warning');
        return;
      }
      const m = await wordVaultMod.load();
      m.initWordVault(
        document.getElementById('word-vault-content'),
        () => {
          wordVaultMod.get()?.cleanupWordVault();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      m.showVaultBrowser();
      this._showScreen('screen-word-vault');
      mascot.setState('celebrate');
    });

    document.getElementById('btn-wvq-back')?.addEventListener('click', () => {
      wordVaultMod.get()?.cleanupWordVault();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-editing-quest')?.addEventListener('click', async () => {
      const unlock = this._getQuestUnlockStatus();
      if (!unlock.editingQuest.unlocked) {
        this._showToast(`Master ${unlock.editingQuest.required} words to unlock! (${unlock.editingQuest.current} so far)`, 'warning');
        return;
      }
      const m = await editingQuestMod.load();
      m.initEditingQuest(
        document.getElementById('editing-quest-content'),
        () => {
          editingQuestMod.get()?.cleanupEditingQuest();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      m.showEditingBrowser();
      this._showScreen(SCREENS.EDITING_QUEST);
      mascot.setState('whiteboard');
    });

    document.getElementById('btn-eq-back')?.addEventListener('click', () => {
      editingQuestMod.get()?.cleanupEditingQuest();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    document.getElementById('btn-writing-quest')?.addEventListener('click', async () => {
      const unlock = this._getQuestUnlockStatus();
      if (!unlock.writingQuest.unlocked) {
        this._showToast(`Master ${unlock.writingQuest.required} words to unlock! (${unlock.writingQuest.current} so far)`, 'warning');
        return;
      }
      const m = await writingQuestMod.load();
      m.initWritingQuest(
        document.getElementById('writing-quest-content'),
        () => {
          writingQuestMod.get()?.cleanupWritingQuest();
          this._showScreen(SCREENS.HOME);
          mascot.setHomeState('holdCard');
        },
      );
      m.showWritingBrowser();
      this._showScreen(SCREENS.WRITING_QUEST);
      mascot.setState('whiteboard');
    });

    document.getElementById('btn-writing-back')?.addEventListener('click', () => {
      writingQuestMod.get()?.cleanupWritingQuest();
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
      ['btn-p4-practice-tests',   'p4-practice-tests'],
      ['btn-p5-practice-tests',   'p5-practice-tests'],
      ['btn-p6-practice-tests',   'p6-practice-tests'],
      ['btn-listening-comp',      'listening-comp'],
    ];
    placeholderHandlers.forEach(([btnId, kind]) => {
      document.getElementById(btnId)?.addEventListener('click', () => {
        this._openPrimaryPlaceholder(kind);
      });
    });
    document.getElementById('btn-pp-back')?.addEventListener('click', () => {
      comprehensionClozeMod.get()?.cleanupComprehensionClozeQuest();
      synthesisQuestMod.get()?.cleanupSynthesisQuest();
      listeningCompMod.get()?.cleanupListeningComp();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    });

    // Next word button
    this._els.btnNext?.addEventListener('click', () => {
      this._nextWord();
    });

    this._els.btnSayIt?.addEventListener('click', () => this._handleSayIt());

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

    document.getElementById('bedtime-toggle')?.addEventListener('click', () => {
      const next = !isBedtimeActive();
      setBedtimeEnabled(next);
      this._refreshBedtimeToggle();
      this._showToast(
        next
          ? '🌙 Bedtime Mode on — story time, no XP. Sweet dreams!'
          : '☀️ Bedtime Mode off — XP and celebrations are back.',
        'info',
      );
    });

    document.getElementById('btn-calibrate-mic')?.addEventListener('click', () => {
      this._runMicCalibration();
    });

    document.getElementById('dashboard-btn')?.addEventListener('click', () => {
      // Show the first-time hint only while no PIN is set — once parents
      // have chosen one, the modal gives a reading child no clues.
      const setupHint = document.getElementById('pin-setup-hint');
      if (setupHint) setupHint.hidden = !!store.get('parentPin');
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

    document.getElementById('btn-mistakes-den')?.addEventListener('click', () => {
      this._openMistakesDen();
    });

    document.getElementById('btn-word-workout')?.addEventListener('click', () => {
      this._startWordWorkout();
    });

    document.querySelectorAll('[data-close="modal-mistakes-den"]').forEach(btn => {
      btn.addEventListener('click', () => modalManager.close('modal-mistakes-den'));
    });

    document.getElementById('btn-ask-giri')?.addEventListener('click', () => {
      this._openAskGiri();
    });

    document.querySelectorAll('[data-close="modal-ask-giri"]').forEach(btn => {
      btn.addEventListener('click', () => modalManager.close('modal-ask-giri'));
    });

    document.getElementById('btn-personal-best')?.addEventListener('click', () => {
      this._openPersonalBestWall();
    });

    document.querySelectorAll('[data-close="modal-personal-best"]').forEach(btn => {
      btn.addEventListener('click', () => modalManager.close('modal-personal-best'));
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
    document.getElementById('btn-home-settings')?.addEventListener('click', () => {
      this._openModal('modal-settings');
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
    // Word Workout rounds pin a mode per round (the same word seen through
    // 3–4 different cues). Handle this branch first so the mode-switch is
    // applied before any setup is dispatched.
    if (this._sessionType === 'wordWorkout' && this._queuedRounds.length > 0) {
      const round = this._queuedRounds.shift();
      this._mode = round.mode;
      store.set('currentMode', this._mode);
      this._currentWord = round.word;
    } else if (this._sessionType === 'wordWorkout' && this._queuedRounds.length === 0) {
      this._finishQueuedSession();
      return;
    } else if (this._sessionType !== 'normal' && this._queuedWords.length > 0) {
      this._currentWord = this._queuedWords.shift();
    } else if (this._sessionType !== 'normal' && this._queuedWords.length === 0) {
      this._finishQueuedSession();
      return;
    } else {
      // Normal rounds must pick a fresh word every time _startGame runs. Without
      // clearing the previous round's word here, the fallback below sees an
      // existing `_currentWord` and reuses it indefinitely (for example, Blend It
      // and Segment It can get stuck showing only the initial “bag” word).
      this._currentWord = null;

      const modeDiffs = store.get('modeDifficulty') || {};
      // Teacher master unlock lifts the level cap so every word is in play.
      const effectiveDiff = isTeacherUnlockActive()
        ? 99
        : (modeDiffs[this._mode] ?? store.get('difficulty') ?? 1);
      const opts = { maxLevel: effectiveDiff, mode: this._mode };
      if (group) opts.group = group;

      if (this._mode === 'syllable') {
        // Phonological game — draw from its own always-available pool
        // that ramps 1→4 syllables, ignoring the decoding curriculum.
        this._currentWord = pickSyllableWord(this._syllableHistory);
        this._syllableHistory = [this._currentWord.id, ...this._syllableHistory].slice(0, 8);
      } else if (paPositionForMode(this._mode)) {
        // First / Last / Middle Sound run through the target sequencer so the
        // child meets each target phoneme as a set of exemplars (alphabetical
        // ladder) before moving on, instead of bouncing around adaptively.
        this._currentWord = nextPaWord(this._paSeqState, { ...opts, wordList: WORDS })
          || progress.getNextWord(opts);
      } else {
        // Every other mode (blend, segment, hear, missing, soundCount, …)
        // uses the adaptive picker. Must run unconditionally — checking
        // `!this._currentWord` here would silently reuse the previous
        // round's word and re-show the same card forever (regression bug).
        this._currentWord = progress.getNextWord(opts);
      }
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

    // Set up the mode
    const mode = MODES[this._mode];
    if (!mode) return;

    const setupMode = () => mode.setup(this._currentWord, {
      ...this._els,
      onResult: (correct, responseTime) => this._handleResult(correct, responseTime),
      onGroupChange: (group) => {
        // Teacher changed category in Listen & Blend — reload immediately
        this._cleanupMode();
        this._startGame(group || undefined);
      },
    });

    // Explicit instruction first: the first time a child practises a
    // curriculum stage, Giri teaches it (mini-lesson overlay) before
    // independent practice begins. Wheel "free play" groups (short-a, …)
    // don't map to a stage and start immediately.
    const lessonStage = this._sessionType === 'normal' && group ? findStageForGroup(group) : null;
    if (lessonStage && !hasSeenLesson(`phonics:${lessonStage.id}`)) {
      maybeShowStageLesson(group).then(setupMode, setupMode);
    } else {
      setupMode();
    }
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

    // Gentle-nudge retry applies only to self-assess modes (Blend It! /
    // Listen & Blend), where the child can genuinely re-attempt the same
    // word from the still-live Yes/Not-yet controls. Commit-on-tap modes
    // run their own in-round two-try flow (choiceRound.js) and deliver a
    // FINAL result here — bouncing those back used to strand the round on
    // a locked screen and record the same wrong answer twice.
    const canRetry = !correct
      && MODES[this._mode]?.resultPolicy === 'selfAssess'
      && this._wrongStrikes === 0
      && !this._hintUsed;

    if (canRetry) {
      const phonemeRow = document.getElementById('phoneme-row');
      phonemeRow?.classList.remove('phoneme-row--shake');
      void phonemeRow?.offsetWidth;
      phonemeRow?.classList.add('phoneme-row--shake');
      setTimeout(() => phonemeRow?.classList.remove('phoneme-row--shake'), 500);

      this._wrongStrikes++;
      mascot.encourage();
      audio.playSfx('wrong');
      this._showToast('Almost! Have another go — the 💡 Hint plays the first sound.', 'warning');
      this._els.btnHint?.classList.remove('btn--hint-pulse');
      void this._els.btnHint?.offsetWidth;
      this._els.btnHint?.classList.add('btn--hint-pulse');
      this._els.btnHint?.addEventListener('animationend', () => {
        this._els.btnHint?.classList.remove('btn--hint-pulse');
      }, { once: true });
      // Nothing is recorded on the nudge: mastery counts the final outcome
      // exactly once, when the child finishes the word.
      this._resultProcessing = false;
      return;
    }

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
      this._updateMistakesDenBanner();
      this._updatePersonalBestBanner();
      this._renderGuidedJourney();
      this._refreshQuestProgress();
      // Re-apply tab choice on every return home: covers a day rolling over
      // mid-session (back to Today) and a profile switch (their last tab).
      selectTab(getInitialTab(), { persist: false });
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
   *
   * Phonemic-awareness modes (group='phonemic') bypass the tier system —
   * tier-1 highlight tiles aren't rendered yet, and tier-2 would directly
   * speak the answer for first-sound. Instead, a single-press hint plays
   * the stretched word so the child can hear each sound in isolation.
   */
  /**
   * Replay the current word for the child. Mode-aware:
   *   • segment      → stretched (segmenting is the task; revealing
   *                    the per-phoneme breakdown is the point).
   *   • first/last/middle → articulated (slowed whole-word so the
   *                    child can hear the target sound without it
   *                    being spelled out for them).
   *   • everything else → natural rate.
   */
  _handleSayIt() {
    if (!this._currentWord) return;
    const mode = this._mode;
    if (mode === 'segment') {
      return audio.speakWordStretched(this._currentWord);
    }
    if (mode === 'first' || mode === 'last' || mode === 'middle') {
      return audio.speakWordArticulated(this._currentWord.word);
    }
    return audio.speakWord(this._currentWord.word);
  }

  async _giveHint() {
    if (!this._currentWord) return;

    const word = this._currentWord;
    const btn = this._els.btnHint;
    const isPhonemicMode = MODES[this._mode]?.group === 'phonemic';

    if (isPhonemicMode) {
      this._hintUsed = true;
      await audio.speakWordStretched(word);
      if (btn) {
        btn.classList.add('used');
        btn.setAttribute('aria-disabled', 'true');
        btn.textContent = '💡 Used';
      }
      return;
    }

    this._hintTier++;

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

      if (!savedPin) {
        // First time entering a PIN — store it salted+hashed.
        store.set('parentPin', await createPinHash(pin));
        if (hint) hint.textContent = '';
        this._closeModal('modal-pin');
        this._openDashboard();
        return;
      }

      const { ok, needsUpgrade } = await verifyPin(pin, savedPin);
      if (ok) {
        // Upgrade legacy plaintext/unsalted formats on successful entry.
        if (needsUpgrade) store.set('parentPin', await createPinHash(pin));
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
                 <p class="ob-bonus-note">Find these in the <strong>🎁 Extra</strong> tab at the top of the home screen.</p>`,
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
                 <p class="ob-bonus-note">Find these in the <strong>🎁 Extra</strong> tab at the top of the home screen.</p>`,
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

  async _openDashboard() {
    this._openModal('modal-dashboard');
    const container = document.getElementById('dashboard-content');
    if (container) {
      const { renderDashboard } = await dashboardMod.load();
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
      case 'p4-practice-tests':
      case 'p5-practice-tests':
      case 'p6-practice-tests':
      case 'listening-comp':
        this._openPrimaryPlaceholder(target);
        break;
      default:
        // Any bare game-mode key (first, last, middle, oddOneOut, syllable,
        // soundHunt, segment, …) starts that mode directly — journey-aware
        // warm-up steps navigate this way.
        if (MODES[target]) {
          this._mode = target;
          store.set('currentMode', target);
          this._startGame();
        }
        break;
    }
  }

  async _openPrimaryPlaceholder(kind) {
    const meta = getPlaceholderMeta(kind);
    // listening-comp manages its own header text inside the container
    if (!meta && kind !== 'listening-comp') return;
    const titleEl = document.getElementById('primary-placeholder-title');
    const iconEl  = document.getElementById('primary-placeholder-icon');
    if (meta) {
      if (titleEl) titleEl.textContent = meta.label;
      if (iconEl)  iconEl.textContent = meta.icon;
    } else {
      if (titleEl) titleEl.textContent = 'Listening Comprehension';
      if (iconEl)  iconEl.textContent = '👂';
    }
    const container = document.getElementById('primary-placeholder-content');
    const goHome = () => {
      comprehensionClozeMod.get()?.cleanupComprehensionClozeQuest();
      synthesisQuestMod.get()?.cleanupSynthesisQuest();
      listeningCompMod.get()?.cleanupListeningComp();
      this._showScreen(SCREENS.HOME);
      mascot.setHomeState('holdCard');
    };
    if (kind === 'comprehension-cloze') {
      const m = await comprehensionClozeMod.load();
      m.initComprehensionClozeQuest(container, { onClose: goHome });
    } else if (kind === 'synthesis') {
      const m = await synthesisQuestMod.load();
      m.initSynthesisQuest(container, goHome);
      m.showSynthesisBrowser();
    } else if (kind === 'listening-comp') {
      const m = await listeningCompMod.load();
      m.initListeningComp(container, goHome);
      m.showListeningBrowser();
    } else {
      const m = await placeholdersMod.load();
      m.mountPlaceholderModule(container, kind, {
        onClose: goHome,
        onRelated: (target) => this._navigateTo(target),
      });
    }
    this._showScreen(SCREENS.PRIMARY_PLACEHOLDER);
    mascot.setState('whiteboard');
  }

  _launchPaperSection(sectionKey, level) {
    const map = {
      'grammar-mcq': async () => {
        const m = await grammarMcqMod.load();
        m.initGrammarMcq(
          document.getElementById('grammar-mcq-content'),
          () => {
            grammarMcqMod.get()?.cleanupGrammarMcq();
            this._showScreen(SCREENS.HOME);
            mascot.setHomeState('holdCard');
          },
        );
        this._showScreen(SCREENS.GRAMMAR_MCQ);
        mascot.setState('whiteboard');
        if (level) m.startGrammarMcqLevel(level);
        else m.showGrammarMcqBrowser();
      },
      'vocab-mcq': async () => {
        const m = await vocabMcqMod.load();
        m.initVocabMcq(
          document.getElementById('vocab-mcq-content'),
          () => {
            vocabMcqMod.get()?.cleanupVocabMcq();
            this._showScreen(SCREENS.HOME);
            mascot.setHomeState('holdCard');
          },
        );
        this._showScreen(SCREENS.VOCAB_MCQ);
        mascot.setState('celebrate');
        if (level) m.startVocabMcqLevel(level);
        else m.showVocabMcqBrowser();
      },
      'cloze-castle': () => document.getElementById('btn-cloze-castle')?.click(),
      'word-vault': () => document.getElementById('btn-word-vault')?.click(),
      'editing-quest': () => document.getElementById('btn-editing-quest')?.click(),
      'sentence-forge-word-order': async () => {
        (await sentenceForgeMod.load()).setSentenceForgeTrack('word-order');
        document.getElementById('btn-sentence-forge')?.click();
      },
      'sentence-forge-combining': async () => {
        (await sentenceForgeMod.load()).setSentenceForgeTrack('sentence-combining');
        document.getElementById('btn-sentence-forge')?.click();
      },
      'sentence-forge-synthesis': async () => {
        (await sentenceForgeMod.load()).setSentenceForgeTrack('synthesis-transformation');
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
    // Six-step journey map on the Learn tab — same refresh lifecycle.
    try { renderJourneyMap(document.getElementById('learn-journey-map'), { avatar: getActiveProfile?.()?.avatar || '🦁' }); } catch (_) { /* non-fatal */ }

    const section = document.getElementById('guided-journey-section');
    if (!section) return;

    const profile   = getActiveProfile ? getActiveProfile() : null;
    const placement = store.get('placementProfile') || null;
    const readingBand = getReadingBand(profile, placement);

    const chips = getLearnerSummaryChips();

    const pathwayIcon  = STAGE_META[readingBand]?.icon || '🌱';
    const pathwayLabel = STAGE_META[readingBand]?.label || 'Reading Journey';
    const pathwayMod   = STAGE_META[readingBand]?.mod || 'pathway-badge--preschool';
    // Escaped: the profile name is user-supplied and can also arrive from an
    // imported profile file, and this string is spliced into innerHTML below.
    const profileName  = profile?.name ? `${escapeHtml(profile.name)}'s ` : '';

    const journeyBarHtml = buildJourneyBarHtml(readingBand, store.get('groupMastery') || {});

    const chipsHtml = chips.length
      ? `<div class="progress-chips" aria-label="Progress snapshot">
           ${chips.map(c => `<span class="progress-chip">${c}</span>`).join('')}
         </div>`
      : '';

    // One "today" surface: the guided lesson hero. The detailed step list
    // renders in the lesson card below (_renderTodaysLesson); this hero
    // surfaces the next step and a single Start/Continue CTA — the way a
    // tutor opens a sitting — replacing the old start-card + roadmap pair.
    const esc = (s) => String(s ?? '').replace(/[<>&"]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;' }[c]));
    let lesson;
    try { lesson = getTodaysLessonView(); } catch (_) { lesson = null; }
    const next = lesson?.nextStep || null;
    const lessonHeroHtml = lesson ? `
      <div class="home-start-card" aria-label="Today's lesson with Giri">
        <div class="start-card-eyebrow">
          <span class="start-card-label">🦉 TODAY'S LESSON WITH GIRI</span>
          <span class="start-card-urgency">${lesson.complete ? '🎉 Complete' : `${lesson.done}/${lesson.total} steps done`}</span>
        </div>
        <h2 class="start-card-title">${next ? `${esc(next.icon)} ${esc(next.title)}` : '🎉 Lesson complete — great work!'}</h2>
        <p class="start-card-reason">${next ? esc(next.detail) : `You finished every step today and earned a +${LESSON_BONUS_XP} XP bonus.`}</p>
        ${next ? `<button class="btn btn--primary btn--xl start-card-cta" id="lesson-hero-cta">
          ${lesson.started ? 'Continue lesson' : "Start today's lesson"} →
        </button>` : ''}
      </div>` : '';

    section.innerHTML = `
      ${journeyBarHtml}

      <button class="pathway-badge ${pathwayMod}" id="pathway-badge-btn" aria-label="Learning pathway: ${pathwayLabel} — open the learning roadmap">
        <span class="pathway-badge-icon" aria-hidden="true">${pathwayIcon}</span>
        <span class="pathway-badge-text">${profileName}${pathwayLabel}</span>
        <span class="pathway-badge-map" aria-hidden="true">🗺️</span>
      </button>

      ${lessonHeroHtml}

      ${chipsHtml ? `<div class="progress-snapshot" aria-label="Progress snapshot">${chipsHtml}</div>` : ''}`;

    section.querySelector('#lesson-hero-cta')?.addEventListener('click', () => {
      this._runLessonStep(next);
    });

    // The pathway badge doubles as the roadmap entry (this section is
    // innerHTML-rebuilt each render, so per-render binding is the pattern).
    section.querySelector('#pathway-badge-btn')?.addEventListener('click', () => {
      this._openRoadmap();
    });

    // Award the completion bonus the moment the last step ticks over.
    const award = (() => { try { return finalizeLessonIfComplete(); } catch (_) { return null; } })();
    if (award) {
      this._showToast(`🎉 Today's lesson complete! +${award.bonus} bonus XP`, 'success');
    }

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

    const todaysPlanHost = document.getElementById('early-reading-todays-plan');

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

      this._renderTodaysLesson(startHere);
      this._renderPrimaryEarlyReadingNote(coreSection);
      this._filterGradeSpecificModules(profile?.primaryGrade || null);
      // Primary profiles get the guided lesson card above — hide the
      // early-reading host so they aren't shown two overlapping cards.
      if (todaysPlanHost) todaysPlanHost.style.display = 'none';
    } else if (!layout.questsMilestone) {
      coreSection?.classList.remove('home-section--hidden', 'home-section--collapsed');
      questsSection?.classList.remove('home-section--milestone', 'home-section--primary-priority');
      if (questsHeading) questsHeading.textContent = 'Bridge Quests';
      if (questsSub)     questsSub.textContent     = 'Keep phonics active and begin Sentence Forge first';
      sentenceForgeBtn?.classList.toggle('stories-banner--spotlight', layout.spotlightSentenceForge);
      if (levelBadge) levelBadge.style.display = 'none';
      if (startHere) startHere.style.display = 'none';
      this._renderTodaysLesson(todaysPlanHost);
    } else {
      coreSection?.classList.remove('home-section--hidden', 'home-section--collapsed');
      questsSection?.classList.add('home-section--milestone');
      questsSection?.classList.remove('home-section--primary-priority');
      if (questsHeading) questsHeading.textContent = 'Quest Milestones';
      if (questsSub)     questsSub.textContent     = 'Unlocks as decoding and reading readiness improve';
      sentenceForgeBtn?.classList.toggle('stories-banner--spotlight', layout.spotlightSentenceForge);
      if (levelBadge) levelBadge.style.display = 'none';
      if (startHere) startHere.style.display = 'none';
      this._renderTodaysLesson(todaysPlanHost);
    }

    // Apply pathway-specific Primary English group visibility when the
    // profile's pathway changes. Younger (preschool / bridge) profiles
    // see these as future "milestone" content, so collapse them all; primary
    // profiles open the full Primary English catalogue so every school-paper
    // component is visible immediately. Only re-applied on a pathway change
    // so a parent's own expand/collapse toggles persist across normal renders.
    const questLayoutKind = isPrimary ? 'primary' : 'early';
    if (this._questLayoutKind !== questLayoutKind) {
      this._questLayoutKind = questLayoutKind;
      this._applyQuestGroupDefaults(questLayoutKind);
    }

    // Teacher master unlock: reveal the Early Reading mode grid AND every
    // grade's Primary English / Exam modules, on top of whatever layout the
    // child's band would otherwise show.
    if (isTeacherUnlockActive()) {
      coreSection?.classList.remove('home-section--hidden', 'home-section--collapsed');
      this._filterGradeSpecificModules(null);
    }
    this._updateTeacherUnlockButton();
  }

  /**
   * Set the default expand/collapse state of the Primary English module groups
   * for a pathway.
   *
   *   'early'   – preschool / bridge: collapse every group (milestone content).
   *   'primary' – open every Primary English group so the complete P1–P6
   *               pathway and paper bank are visible without extra taps.
   *
   * @param {'early'|'primary'} kind
   */
  _applyQuestGroupDefaults(kind) {
    document.querySelectorAll('#home-quests-section .home-group').forEach(group => {
      if (kind === 'primary') {
        group.setAttribute('open', '');
      } else {
        group.removeAttribute('open');
      }
    });
  }

  /**
   * Reflect teacher-unlock state on its Grown-ups button and wire its toggle.
   * Enabling asks for the password; disabling just confirms.
   */
  _updateTeacherUnlockButton() {
    const sub = document.getElementById('teacher-unlock-sub');
    const btn = document.getElementById('btn-home-teacher-unlock');
    const active = isTeacherUnlockActive();
    if (sub) {
      sub.textContent = active
        ? '✅ ON — all modes, words & categories unlocked · tap to lock'
        : 'Unlock every mode, word and category';
    }
    if (btn) btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  }

  /** Toggle the teacher master unlock (password-gated on enable). */
  _toggleTeacherUnlock() {
    if (isTeacherUnlockActive()) {
      if (window.confirm('Lock teacher mode again? The app will return to the normal locked view for this child.')) {
        lockTeacherMode();
        this._showToast('Teacher mode locked. Back to normal view.', 'info');
        this._renderGuidedJourney();
        this._updateQuestBanners();
      }
      return;
    }
    const entered = window.prompt('Teacher Unlock — enter password to open every mode, word and category:');
    if (entered == null) return; // cancelled
    if (tryTeacherUnlock(entered)) {
      this._showToast('🔓 Teacher mode ON — everything is unlocked.', 'success');
      this._renderGuidedJourney();
      this._updateQuestBanners();
    } else {
      this._showToast('Incorrect password.', 'warning');
    }
  }

  /**
   * Render the guided "Today's Lesson with Giri" card — the single daily
   * surface for BOTH pathways (it replaced the separate Today's Plan and
   * Today's Mission cards). Steps come from lessonComposer via
   * lessonRunner: warm-up → teach → practice → review, with completion
   * read live from the underlying systems.
   */
  _renderTodaysLesson(host) {
    if (!host) return;
    let lesson;
    try { lesson = getTodaysLessonView(); } catch (_) { lesson = null; }
    if (!lesson || lesson.total === 0) { host.style.display = 'none'; return; }

    const escAttr = (s) => String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const escText = (s) => String(s ?? '').replace(/[<>&]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;' }[c]));

    const stepsHtml = lesson.steps.map((step, i) => {
      const stateClass = step.done ? 'mission-step--done' : '';
      const aria = step.done
        ? `${step.title}, complete`
        : `${step.title}, ${step.progressLabel}`;
      return `
        <button type="button"
          class="mission-step ${stateClass}"
          data-lesson-step="${i}"
          aria-label="${escAttr(aria)}">
          <span class="mission-step__num" aria-hidden="true">${i + 1}</span>
          <span class="mission-step__icon" aria-hidden="true">${escText(step.icon)}</span>
          <span class="mission-step__body">
            <span class="mission-step__title">${escText(step.kindLabel ? `${step.kindLabel} · ` : '')}${escText(step.title)}</span>
            <span class="mission-step__desc">${escText(step.detail)}</span>
          </span>
          <span class="mission-step__progress" aria-hidden="true">${escText(step.progressLabel)}</span>
        </button>`;
    }).join('');

    const headline = lesson.complete
      ? "🎉 Today's lesson complete! See you tomorrow."
      : `🦉 Today's Lesson · ${lesson.done}/${lesson.total} done`;
    const sub = lesson.complete
      ? `Every step done — +${LESSON_BONUS_XP} bonus XP earned.`
      : 'Warm up, learn something new, practise, review — in order, like a real lesson.';

    host.style.display = '';
    host.innerHTML = `
      <div class="home-section-header">
        <p class="home-section-heading">${headline}</p>
        <p class="home-section-sub">${sub}</p>
      </div>
      <div class="mission-card" role="group" aria-label="Today's lesson steps">${stepsHtml}</div>`;

    host.querySelectorAll('[data-lesson-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = lesson.steps[Number(btn.dataset.lessonStep)];
        this._runLessonStep(step);
      });
    });
  }

  /** Dispatch one guided-lesson step to the right activity. */
  _runLessonStep(step) {
    if (!step) return;
    markLessonStarted();
    const action = step.action || {};
    switch (action.type) {
      case 'review':
        this._startReviewSession();
        break;
      case 'daily':
        if (isDailyChallengeComplete()) {
          this._showToast('Daily challenge already done! Come back tomorrow.', 'info');
          break;
        }
        this._startDailyChallenge();
        break;
      case 'teach-phonics':
        // Force-show the stage mini-lesson, then flow into scoped practice.
        maybeShowStageLesson(action.group, { force: true }).then(() => {
          markTeachDone();
          this._navigateTo(action.target || 'blend', action.group || null);
        });
        break;
      case 'teach-tip':
        showTipLesson({
          ...action.tip,
          onDone: () => {
            markTeachDone();
            if (action.followUp?.target) {
              this._navigateTo(action.followUp.target);
            } else {
              this._showScreen(SCREENS.HOME);
            }
          },
        });
        break;
      case 'navigate':
      default:
        if (!action.target) return;
        if (action.missionStepId === 'comprehension-clue') {
          markMissionStepDone(action.missionStepId);
        }
        this._navigateTo(action.target, action.group || null);
    }
  }

  /** Mark mode cards and quest banners that have been used before. */
  _refreshQuestProgress() {
    const currentMode = store.get('currentMode');
    document.querySelectorAll('.mode-card').forEach(card => {
      card.classList.toggle('mode-card--started', !!currentMode && card.dataset.mode === currentMode);
    });

    const mastery = store.get('questMastery') || {};
    const questMap = {
      'btn-grammar-mcq':   'grammarMcq',
      'btn-vocab-mcq':     'vocabMcq',
      'btn-cloze-castle':  'clozeCastle',
      'btn-word-vault':    'wordVault',
      'btn-sentence-forge':'sentenceForge',
      'btn-editing-quest': 'editingQuest',
      'btn-writing-quest': 'writingQuest',
      'btn-paper-mode':    'paperMode',
      'btn-stories':       'stories',
    };
    Object.entries(questMap).forEach(([btnId, key]) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      const hasProgress = Object.keys(mastery[key] || {}).length > 0;
      btn.classList.toggle('stories-banner--started', hasProgress);
    });
  }

  /**
   * Hide grade-specific practice-test buttons that don't match the child's
   * primaryGrade.  A P3 child shouldn't see "P1 Practice Tests" + "P2
   * Practice Tests" in the list — those are pure noise for them.  When
   * no grade is set we show everything (e.g. for a generic primary
   * profile created without a grade picker).
   * @param {?string} grade  e.g. 'P1' / 'P2' / 'P3' / null
   */
  _filterGradeSpecificModules(grade) {
    // Teacher master unlock shows every grade's modules (P1–P6), not just
    // the active child's grade.
    if (isTeacherUnlockActive()) grade = null;
    const buttons = document.querySelectorAll('[data-grade-filter]');
    if (!grade) {
      buttons.forEach((b) => { b.hidden = false; });
      return;
    }
    buttons.forEach((b) => {
      const filter = b.getAttribute('data-grade-filter');
      b.hidden = filter !== grade;
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
    if (id === 'modal-dashboard') dashboardMod.get()?.destroyDashboard();
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

    // html`` escapes each interpolation, so a profile name carrying markup
    // (typed, or arriving via an imported profile file) renders as text.
    // Raw.toString() makes the trailing .join('') safe to keep.
    grid.innerHTML = profiles.map(p => html`
      <div class="profile-card ${activeProfile?.id === p.id ? 'profile-card--active' : ''}"
           role="listitem">
        <button class="profile-select-btn" data-profile-id="${p.id}"
                aria-label="Play as ${p.name}${activeProfile?.id === p.id ? ' (current)' : ''}">
          <span class="profile-avatar" style="background:${p.color}20;border-color:${p.color}">
            ${p.avatar}
          </span>
          <span class="profile-name">${p.name}</span>
          ${activeProfile?.id === p.id ? raw('<span class="profile-active-badge">●</span>') : ''}
        </button>
        ${profiles.length > 1 ? html`
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
      // Primary profiles still get the maxed default placement (the existing
      // skip behaviour kept skill-gates from blocking access), but we now
      // offer an optional Quick Check first so questMastery, the parent
      // dashboard and Today's Mission have signal from day one rather than
      // having to wait for a couple of sessions of organic play.
      this._runPrimaryQuickCheck(profile);
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
   * Run the optional 6-question Primary Quick Check (B1). Mounts into the
   * shared #screen-placement container, then unconditionally seeds the
   * maxed primary defaults so quest-gating still lets a P1 through every
   * door — the Quick Check only enriches questMastery / questAttempts so
   * Today's Mission and the dashboard have signal from day one.
   *
   * On skip OR completion we end up in the same place: defaults applied,
   * placementComplete set, _afterPlacement called.
   * @param {object} profile
   */
  async _runPrimaryQuickCheck(profile) {
    const container = document.getElementById('screen-placement');
    const seedDefaultsAndContinue = () => {
      const primaryPlacement = this._buildPrimaryDefaultPlacement(profile);
      store.set('placementProfile', primaryPlacement);
      store.set('placementComplete', true);
      this._afterPlacement(profile, primaryPlacement);
    };
    if (!container) { seedDefaultsAndContinue(); return; }
    this._showScreen('screen-placement');
    try {
      const { showPrimaryQuickCheck } = await quickCheckMod.load();
      showPrimaryQuickCheck({
        container,
        profile,
        onComplete: (payload) => {
          // Whether the parent skipped or completed, primary still gets the
          // maxed default placement — Quick Check results are additive to
          // questMastery and never gate access. A completed check may also
          // carry a gentle practice-level recommendation; persist it so the
          // level pickers can default to it.
          const rec = payload?.results?.recommendation;
          if (rec?.level) store.set('recommendedPracticeLevel', rec.level);
          seedDefaultsAndContinue();
        },
      });
    } catch (err) {
      // Defensive: if Quick Check render throws, fall back to the previous
      // straight-to-home behaviour so we never block a new profile.
      if (import.meta.env?.DEV) console.warn('[QuickCheck] mount failed', err);
      seedDefaultsAndContinue();
    }
  }

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
    // Escaped: spliced into the comeback modal's innerHTML below.
    const name     = escapeHtml(profile?.name?.split(' ')[0] || 'there');
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
          ${escapeHtml(profile?.name || 'Your learner')} has practised <strong>${wordCount} words</strong>.
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
  /**
   * Back-compat wrapper for the original Blend It! picker entry point.
   * Every other phonics mode now uses the parameterised version below.
   */
  _openBlendPicker() {
    this._openStagePicker('blend');
  }

  /**
   * Open the curriculum-stage picker for `mode`. The same picker chrome
   * Blend It! has always used — now filtered to stages where the phase's
   * `recommendedModes` includes the mode the child tapped, so the
   * phonemic-awareness and segmenting modes finally get phase-by-phase
   * progression instead of starting cold on whatever `currentGroup` was
   * last touched.
   *
   * @param {string} [mode] mode key (e.g. 'first', 'segment'). Defaults to
   *   the currently active mode.
   */
  _openStagePicker(mode = this._mode) {
    // Drop stages a mode can't actually serve — e.g. the irregular sight-word
    // stage under Blend It! / Listen & Blend, which can't be sounded out and
    // would otherwise fall back to the general pool (a misleading dead stage).
    const stagesForMode = getStagesForMode(mode, CURRICULUM, PHASES)
      .filter(stage => !isStageHiddenForMode(stage.group, mode));
    if (!stagesForMode.length) {
      // Defensive: should never hit — getStagesForMode falls back to full
      // curriculum when no phase recommends the mode. If it does, just
      // start the game from the current group rather than block the child.
      this._startGame(store.get('currentGroup') || undefined);
      return;
    }

    const groupMastery = store.get('groupMastery') || {};
    const snapshot     = buildProgressionSnapshot();
    // Listening-first modes don't require decoding, so the strict decoding
    // gate would lock out exactly the pre-readers these games exist for.
    // Every stage stays open; word difficulty still rises stage by stage.
    const ORAL_MODES = new Set(['first', 'last', 'middle', 'oralBlend', 'soundCount', 'oralSegment', 'oddOneOut', 'train', 'wordCount']);
    const isOralMode   = ORAL_MODES.has(mode);
    const unlocked     = isOralMode
      ? stagesForMode.map(s => s.id)
      : getUnlockedStages(snapshot);
    const recommended  = getRecommendedStage(snapshot);

    document.getElementById('modal-blend-picker')?.remove();

    // Group filtered stages by phase so headers stay accurate even when
    // a mode skips, say, the digraph phase (e.g. middle-sound on CCVCC).
    const byPhase = {};
    for (const stage of stagesForMode) {
      (byPhase[stage.phase] ??= []).push(stage);
    }

    const modeMeta   = MODES[mode] || null;
    const modeIcon   = modeMeta?.icon || '🎯';
    const modeName   = modeMeta?.name || 'Phonics Quest';
    const desc       = modeMeta?.desc || '';
    const modeIntro  = desc ? (/[.?!]$/.test(desc) ? desc : `${desc}.`) : '';

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
          <h2 class="modal-title">${modeIcon} ${modeName} — Choose Your Stage</h2>
          <button class="modal-close" id="bp-close-btn" aria-label="Close picker">✕</button>
        </div>
        ${modeIntro ? `<p class="bp-intro">${modeIntro} Pick a stage to practise.</p>` : ''}
        ${typeof isOralMode !== 'undefined' && isOralMode ? '<p class="bp-intro bp-intro--oral">👂 A listening game — every stage is open. Words get trickier as you go!</p>' : ''}
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
    this._mode = 'blend';
    store.set('currentGroup', null);
    this._showToast(`Today's 5 words – go! ⚡`, 'info');
    this._startGame();
  }

  /**
   * Open Giri's Review Lane — pulls due items oldest-overdue first and caps
   * the session by the child's reading band (K1–P1: 10, P2+: 20) so a child
   * returning from a missed week isn't avalanched by a 50-item pile.
   */
  _startReviewSession() {
    const profile = getActiveProfile ? getActiveProfile() : null;
    const cap = getReviewCapForProfile(profile);
    const dueWords = progress.getReviewDueWords({ cap });
    const totalDue = progress.getReviewDueCount();
    if (dueWords.length === 0) {
      this._showToast('All caught up! Come back tomorrow.', 'info');
      return;
    }
    this._sessionType = 'review';
    this._queuedWords = dueWords;
    this._mode = 'blend';
    store.set('currentGroup', null);
    const overflow = totalDue > dueWords.length
      ? ` (${totalDue - dueWords.length} more saved for tomorrow)`
      : '';
    this._showToast(`Review Lane: ${dueWords.length} word${dueWords.length === 1 ? '' : 's'}${overflow} 🌟`, 'info');
    this._startGame();
  }

  /**
   * Handle completion of a queued session (daily challenge / review /
   * word workout). Only daily challenge sessions trigger
   * completeDailyChallenge(); workouts get a bespoke "you took X through
   * N modes!" toast.
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
      this._updateReviewBanner();
    } else if (type === 'wordWorkout') {
      const word = this._workoutWord?.word || 'that word';
      this._showToast(`Workout done! You took “${word}” through every angle. 🎽`, 'success');
      audio.playSfx('correct');
      this._workoutWord = null;
      this._queuedRounds = [];
      this._updateReviewBanner();
      this._updateWordWorkoutBanner();
    }
    // Refresh Today's Plan ticks immediately on return to home so the child
    // sees their step flip to ✓ without waiting for the next render.
    this._renderGuidedJourney();

    this._showScreen(SCREENS.HOME);
    mascot.setHomeState('holdCard');
  }

  /**
   * Start a Word Workout — pick the most-overdue Review Lane word (or fall
   * back to the daily warmup), build a 3–4-round multi-mode ladder, and
   * dispatch through the queued-session machinery. Same word, different
   * cues per round.
   *
   * @param {import('./data/words.js').Word} [word]  optional explicit word
   */
  _startWordWorkout(word = null) {
    let target = word;
    if (!target) {
      // Pull the most-overdue Review Lane item — the workout's natural
      // home. If the queue is empty, surface a friendly toast and bail
      // (the home tile is hidden in that case anyway).
      const due = progress.getReviewDueWords({ cap: 1 });
      target = due[0] || null;
    }
    if (!target) {
      this._showToast('No words to work out — try Review Lane after some practice.', 'info');
      return;
    }
    const rounds = buildWordWorkout(target);
    if (rounds.length === 0) {
      this._showToast('That word doesn\'t have a workout ladder yet.', 'info');
      return;
    }
    this._sessionType = 'wordWorkout';
    this._queuedRounds = rounds;
    this._workoutWord = target;
    store.set('currentGroup', null);
    this._showToast(`Workout: “${target.word}” through ${rounds.length} modes 🎽`, 'info');
    this._startGame();
  }

  /**
   * Refresh the Giri's Review Lane home-screen tile. Hides itself when there
   * are no due items so a brand-new profile sees a clean home; surfaces a
   * minutes estimate (~35s/item) once the queue has anything in it.
   */
  /** @see modules/homeBanners.js */
  _updateReviewBanner() { homeBanners.updateReviewBanner(); }

  /**
   * Small count pill on the 🎯 Today tab: review-due words + recent
   * mistakes, so a child sees there's something waiting without opening
   * the tab. Capped at 9+ to stay glanceable.
   */
  /** @see modules/homeBanners.js */
  _updateTodayTabBadge() { homeBanners.updateTodayTabBadge(); }

  /**
   * Refresh the Bedtime Mode toggle in the header. Mirrors the persisted
   * flag onto `aria-pressed`, applies the soft "suggested" pulse during
   * the 19:00–06:00 window when bedtime isn't yet on, and updates the
   * title attribute so the hover label reflects the current state.
   */
  _refreshBedtimeToggle() {
    const btn = document.getElementById('bedtime-toggle');
    if (!btn) return;
    const status = getBedtimeStatus();
    btn.setAttribute('aria-pressed', status.active ? 'true' : 'false');
    btn.classList.toggle('bedtime-toggle--suggested', status.suggested);
    btn.title = status.active
      ? 'Bedtime Mode on — tap to turn off'
      : status.suggested
        ? "It's getting late — try Bedtime Mode (no XP, just stories)"
        : 'Bedtime Mode';
  }

  /**
   * Refresh the Word Workout home tile. Hidden when there's nothing
   * overdue (a workout always pulls a Review Lane item), so a brand-new
   * profile doesn't see a button that would just say "nothing to do".
   */
  /** @see modules/homeBanners.js */
  _updateWordWorkoutBanner() { homeBanners.updateWordWorkoutBanner(); }

  /**
   * Refresh the Mistakes Den home tile. Hidden when the last 7 days are
   * blank so a brand-new profile (or one that hasn't slipped at all) sees
   * a clean home rather than a "0 mistakes" guilt-free chip.
   */
  /** @see modules/homeBanners.js */
  _updateMistakesDenBanner() { homeBanners.updateMistakesDenBanner(); }

  /**
   * Open the Learning Roadmap — the parent journey map. Deliberately not
   * behind the parent PIN: it shows motivational progress info and mutates
   * nothing; detailed scores/exports stay in the PIN-gated dashboard,
   * reachable from the roadmap footer.
   */
  async _openRoadmap() {
    const host = document.getElementById('roadmap-content');
    if (!host) return;
    const m = await roadmapMod.load();
    m.renderRoadmap(host, {
      onClose: () => this._showScreen(SCREENS.HOME),
      onOpenDashboard: () => {
        this._showScreen(SCREENS.HOME);
        document.getElementById('dashboard-btn')?.click();
      },
      onGoToday: () => {
        this._showScreen(SCREENS.HOME);
        selectTab('today');
      },
    });
    this._showScreen(SCREENS.ROADMAP);
  }

  /**
   * Open the Ask Giri modal: question chips built from the child's recent
   * mistakes, each answered instantly with the authored rule card and —
   * when an API key is configured — an optional AI re-explanation. P4–P6
   * profiles with a key also get a typed question box.
   */
  /** @see components/panels/askGiriPanel.js */
  _openAskGiri() { askGiriPanel.openAskGiriPanel(); }

  /** @see components/panels/askGiriPanel.js */
  _renderAskGiri(host) { askGiriPanel.renderAskGiriPanel(host); }

  /**
   * Open the Mistakes Den modal. Pulls a fresh summary every open so a
   * mid-session retry that just happened isn't shown stale.
   */
  /** @see components/panels/mistakesDenPanel.js */
  _openMistakesDen() { mistakesDenPanel.openMistakesDenPanel(t => this._navigateTo(t)); }

  /**
   * Render the Mistakes Den modal body — list grouped by module, each row
   * tappable to navigate back to the parent module (where adaptive
   * selection picks up the now-overdue item).
   */
  /** @see components/panels/mistakesDenPanel.js */
  _renderMistakesDen(host, summary) { mistakesDenPanel.renderMistakesDenPanel(host, summary, t => this._navigateTo(t)); }

  /**
   * Refresh the "My Trophy Room" home tile. Only surfaces once the child
   * has earned some XP or completed at least one Daily Challenge — a
   * brand-new profile sees nothing to celebrate yet, which is honest, not
   * punitive. The tile copy is intentionally celebratory ("See your
   * personal bests") not aspirational ("Beat your best"), so a slow
   * week never feels like a scold.
   */
  /** @see modules/homeBanners.js */
  _updatePersonalBestBanner() { homeBanners.updatePersonalBestBanner(); }

  /**
   * Open the trophy room modal — pulls a fresh snapshot every time so a
   * just-earned graduation / streak day shows immediately.
   */
  /** @see components/panels/trophyRoomPanel.js */
  _openPersonalBestWall() { trophyRoomPanel.openTrophyRoomPanel(); }

  /**
   * Render the trophy room body: a grid of cards (numbers + label + sub),
   * a "highlights" strip Giri reads back, and earned badges.
   * Pure HTML build — no chart library, no comparison-to-others framing.
   */
  /** @see components/panels/trophyRoomPanel.js */
  _renderPersonalBestWall(host, pb) { trophyRoomPanel.renderTrophyRoomPanel(host, pb); }

  /** @see modules/homeBanners.js */
  _updateDailyBanner() { homeBanners.updateDailyBanner(); }

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
    // Teacher master unlock: every quest/category is open regardless of
    // mastery, reading band, or grade.
    if (isTeacherUnlockActive()) {
      const open = (required) => ({ unlocked: true, required, current: Infinity });
      return {
        mastered: Infinity,
        sentenceForge: open(QUEST_THRESHOLDS.sentenceForge),
        clozeCastle:   open(QUEST_THRESHOLDS.clozeCastle),
        wordVault:     open(QUEST_THRESHOLDS.wordVault),
        editingQuest:  open(QUEST_THRESHOLDS.editingQuest),
        writingQuest:  open(QUEST_THRESHOLDS.writingQuest),
      };
    }
    const profile = getActiveProfile();
    const stats = store.get('wordStats') || {};
    const placementProfile = store.get('placementProfile') || null;
    return getQuestUnlockStatus(stats, profile, QUEST_THRESHOLDS, placementProfile);
  }

  /** @see modules/homeBanners.js */
  _updateQuestBanners() { homeBanners.updateQuestBanners(this._getQuestUnlockStatus()); }

}


export const app = new App();
