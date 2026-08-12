/**
 * PhonicsQuest – Word Vault Quest 🔑
 *
 * Vocabulary cloze passages across all eligible categories × 6 levels (p1–p6).
 * Same tap-to-fill mechanics as Cloze Castle but with a two-step browser:
 *   1. Choose category
 *   2. Choose level
 *   3. Play passage
 *
 * Clue Mode (Part A, D)
 * ─────────────────────
 * When a passage has a `clues` array, a clue-hunt step precedes the word bank
 * for each blank that has clue data.  Backward compatible: passages without
 * `clues` behave exactly as before.
 *
 * Public API:
 *   initWordVault(container, onGoHome)  – attach to DOM container
 *   showVaultBrowser()                  – render category picker
 *   cleanupWordVault()                  – teardown
 */

import { vocabPassages, VOCAB_CATEGORIES } from '../data/vocabPassages.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { gamification } from '../modules/gamification.js';
import { questMastery } from '../modules/questMastery.js';
import {
  buildUserAnswers,
  clearClozeRound,
  createClozeRound,
  fillNextBlank,
  renderClozePassage,
} from './clozeEngine.js';
import {
  evaluateClueSelection,
  renderClueHuntPassage,
  getClueHint,
  clueResultFeedback,
  clueResultToScore,
} from './clueEngine.js';
import { celebrateCorrect } from '../components/confettiHelper.js';
import { mascot } from '../components/mascot.js';
import { escapeAttr, escapeHtml } from '../utils/escapeHtml.js';
import { getUniqueWordVaultDone, recordWordVaultCompletion } from './clozeCompletionTracker.js';
import { showAnswerReviewPanel } from './clozeReviewPanel.js';
import { renderReadFirstScan } from './readFirstScan.js';
import { buildScanTaskForPassage, renderScanTask } from './scanTask.js';
import {
  buildCopySummaryText,
  buildParentReport,
  getModeConfig,
  getNextStepRecommendation,
  groupWrongLinesBySkill,
  pickStrongestWeakest,
} from './clozeSessionSummary.js';
import { incrementHintUsage } from './hintUsage.js';
import {
  buildWhyWrongExplanation,
  getBlankSkillMeta,
  getClueTypeLabel,
  getReviewPromptForSkill,
  getSkillLabel,
  normaliseSkillTag,
} from './examTrainingFramework.js';
import { stemForBlank } from '../modules/answerDiagnosis.js';
import { recordMisconceptionsFromReview } from '../modules/teacherFeedback.js';
import { getTopWeakSkills, recordWeakSkills } from './clozeCompletionTracker.js';
import { KNOWN_PREFIXES_EXTENDED, KNOWN_SUFFIXES_EXTENDED } from '../data/words.js';
import { getTopMasteryGaps, recordMasteryAttempt, summariseMasteryGap } from './masteryMap.js';
import { getActiveProfile } from '../modules/profiles.js';
import { scheduleWord, getDueCount } from '../modules/srsScheduler.js';

// ── Module state ───────────────────────────────────────────────────────────

let _container = null;
let _onGoHome = null;

let _currentCat = null; // category key
let _currentLevel = 'p1'; // 'p1' … 'p6'
let _bankWords = []; // [{id, word, used}]
let _blankFills = []; // null | bankWordId per blank
let _passage = null; // current passage object
let _sessionCorrect = 0;
let _sessionTotal = 0;
let _sessionBlankCorrect = 0;
let _sessionBlankTotal = 0;
let _keyHandler = null;

// ── Clue-mode state ────────────────────────────────────────────────────────

let _activeBlankIndex = -1;
let _clueResults = {};
let _hintLevel = 0;
let _bankLocked = false;
let _weakAttempts = 0;
let _sessionClueScore = 0;

const LEVEL_LABELS = { p1: 'P1', p2: 'P2', p3: 'P3', p4: 'P4', p5: 'P5', p6: 'P6' };
const LEVEL_ICONS = { p1: '🌱', p2: '🌿', p3: '🌳', p4: '🔥', p5: '💎', p6: '👑' };

// Map the active profile's primary grade to a lowercase level key ('p1'–'p6').
// Falls back to 'p3' if no grade is set, 'p1' for preschool profiles.
function _getProfileLevelKey() {
  const profile = getActiveProfile();
  if (!profile) return 'p3';
  if (profile.schoolLevel !== 'primary') return 'p1';
  const grade = profile.primaryGrade; // e.g. 'P3' stored on profile
  if (grade && /^P[1-6]$/i.test(grade)) return grade.toLowerCase();
  return 'p3';
}

// Human-readable label for the current profile level, e.g. 'P3'.
function _getProfileLevelLabel() {
  return LEVEL_LABELS[_getProfileLevelKey()] || 'P3';
}

let _sessionHintsUsed = 0;
let _sessionMode = 'practice';
let _examStartedAt = 0;
let _infoPanelOpen = false;
let _sessionReviewRows = [];
let _affixWrongAttempts = {};
let _affixParts = [];

// Wrong-attempt counter per passage — resets each new passage
let _passageWrongCount = 0;

let _readFirstAcknowledged = false;
let _scanTaskCompleted = false;
let _sessionScanCorrect = 0;
let _sessionScanTotal = 0;
let _sessionSkillStats = {}; // skill -> { correct, total, label, lastWrongExamples: [] }

// ── Category-specific teach-back content ────────────────────────────────────
const VAULT_TEACHBACK = {
  morphologicalAffix: {
    icon: '🧩',
    rule: 'Word parts: a PREFIX comes before the root, a SUFFIX comes after it.',
    example:
      '"un-" + "happy" = "unhappy" (not happy)  ·  "teach" + "-er" = "teacher" (one who teaches)',
    tip: 'Find the ROOT word meaning first, then choose the affix that changes it in the right direction.',
  },
  synonymContrast: {
    icon: '📚',
    rule: 'A synonym means nearly the same thing; an antonym means the opposite.',
    example: '"Happy" ↔ "joyful" (synonyms)  ·  "Happy" ↔ "sad" (antonyms)',
    tip: 'Read the tone of the passage — does it need a SAME-meaning word or an OPPOSITE one?',
  },
  collocationCloze: {
    icon: '🤝',
    rule: 'Collocations are word partners that always travel together in natural English.',
    example: '"make a decision" (not "do a decision")  ·  "heavy rain" (not "strong rain")',
    tip: 'Ask: which option sounds most natural next to the surrounding words?',
  },
  connectorClue: {
    icon: '🔗',
    rule: 'Connectors show HOW two ideas relate: contrast, reason, result, sequence, or addition.',
    example:
      '"She was tired, SO she rested." (result)  ·  "Although it rained, they played." (contrast)',
    tip: 'Contrast: but/although · Reason: because/since · Result: so/therefore · Sequence: then/finally',
  },
  grammaticalRole: {
    icon: '🔤',
    rule: 'Every word has a role: NOUN (thing), VERB (action), ADJECTIVE (describes noun), ADVERB (describes verb, often -ly).',
    example: '"The FAST (adj) car ZOOMED (verb) QUICKLY (adv) past the BUILDING (noun)."',
    tip: 'After "the/a" = noun · Before a noun = adjective · Modifying a verb = adverb.',
  },
  default: {
    icon: '🔍',
    rule: 'Context clues are hints in the surrounding sentences that help you find the right answer.',
    example:
      '"The scientist performed many ___. Each experiment took days." → the blank must be a noun meaning tests.',
    tip: 'Read the whole sentence AND the sentence before/after. Together they usually reveal the answer.',
  },
};

const POS_CLASS_MAP = {
  noun: 'pos-noun',
  verb: 'pos-verb',
  adjective: 'pos-adjective',
  adverb: 'pos-adverb',
};
const CONNECTOR_TYPE_LABELS = {
  reason: 'Reason connector (because/since)',
  contrast: 'Contrast connector (although/however)',
  sequence: 'Sequence connector (then/next/finally)',
  result: 'Result connector (so/therefore)',
  addition: 'Addition connector (also/furthermore)',
};

export function renderSummaryStars(stars) {
  const safe = Math.max(1, Math.min(3, Number(stars) || 1));
  return `${'⭐'.repeat(safe)}${'☆'.repeat(3 - safe)}`;
}

export function getWordVaultStars({ accuracy = 0, hintsUsed = 0 }) {
  if (accuracy >= 90 && hintsUsed <= 1) return 3;
  if (accuracy >= 70 && hintsUsed <= 3) return 2;
  return 1;
}

export function buildAffixParts(answer, hint = '') {
  const lower = (answer || '').toLowerCase();
  // Source of truth lives in src/data/words.js so morphology splits stay
  // consistent across the app (helpers, audio, lesson UI).
  const knownPrefixes = KNOWN_PREFIXES_EXTENDED;
  const knownSuffixes = KNOWN_SUFFIXES_EXTENDED;
  const hintAffix = (hint.match(
    /(un-|re-|dis-|mis-|in-|im-|-ing|-ed|-ly|-er|-est|-ful|-less|-tion|-sion|-ment|-ness|-able|-ible)/i,
  ) || [])[0];

  const normalizedHintAffix = hintAffix ? hintAffix.replace(/^-/, '').replace(/-$/, '') : '';
  if (hintAffix) {
    if (hintAffix.startsWith('-')) {
      const affix = normalizedHintAffix;
      return {
        root: answer.slice(0, Math.max(0, answer.length - affix.length)),
        affix,
        type: 'suffix',
      };
    }
    const affix = normalizedHintAffix;
    return { root: answer.slice(affix.length), affix, type: 'prefix' };
  }

  const prefix = knownPrefixes.find((p) => lower.startsWith(p) && lower.length > p.length + 2);
  if (prefix) return { root: answer.slice(prefix.length), affix: prefix, type: 'prefix' };

  const suffix = knownSuffixes.find((sf) => lower.endsWith(sf) && lower.length > sf.length + 2);
  if (suffix)
    return { root: answer.slice(0, answer.length - suffix.length), affix: suffix, type: 'suffix' };

  return { root: answer, affix: '', type: 'suffix' };
}

function _isAffixMode(passage) {
  return _currentCat === 'morphologicalAffix' || passage?.mode === 'affix';
}

function _isGrammarGuidanceCategory() {
  return ['grammaticalRole', 'connectorClue'].includes(_currentCat);
}

function _getActiveBlankIndex() {
  const idx = _blankFills.findIndex((f) => f === null);
  return idx === -1 ? _blankFills.length - 1 : idx;
}

function _recordVocabPerformance(answer, correct) {
  const stats = { ...(store.get('wvqWordPerformance') || {}) };
  const key = String(answer || '').toLowerCase();
  const prev = stats[key] || { attempts: 0, correct: 0 };
  stats[key] = { attempts: prev.attempts + 1, correct: prev.correct + (correct ? 1 : 0) };
  store.set('wvqWordPerformance', stats);
}

function _recordAffixAttempt(affix, correct) {
  if (!affix) return;
  const clueStats = { ...(store.get('clueStats') || {}) };
  const morph = { ...(clueStats.morphologicalAffix || {}) };
  const prev = morph[affix] || { attempts: 0, correct: 0 };
  morph[affix] = { attempts: prev.attempts + 1, correct: prev.correct + (correct ? 1 : 0) };
  clueStats.morphologicalAffix = morph;
  store.set('clueStats', clueStats);
}

function _getUniquePassageCountForCategory(catKey, levels = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']) {
  return levels.reduce(
    (sum, lv) =>
      sum +
      getUniqueWordVaultDone({
        category: catKey,
        level: lv,
        wvqCompletedByPassage: store.get('wvqCompletedByPassage') || {},
        wvqCompleted: store.get('wvqCompleted') || {},
      }),
    0,
  );
}

function _buildDefinitionRows(passage) {
  const defs = passage.definitions || {};
  return (passage.wordBank || []).map((word) => ({
    word,
    definition: defs[word] || 'Use the sentence context and clue to infer this word.',
    pos: (passage.partOfSpeechMap || {})[word] || 'word',
    collocationHint: (passage.collocationHintsByWord || {})[word] || passage.collocationHint || '',
  }));
}

// ── Public API ─────────────────────────────────────────────────────────────

export function initWordVault(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function showVaultBrowser() {
  _renderCategoryBrowser();
}

export function cleanupWordVault() {
  if (_container) _container.innerHTML = '';
  _bankWords = [];
  _blankFills = [];
  _passage = null;
  if (_keyHandler) {
    document.removeEventListener('keydown', _keyHandler);
    _keyHandler = null;
  }
}

// ── Category browser ───────────────────────────────────────────────────────

function _renderCategoryBrowser() {
  if (!_container) return;

  const completed = store.get('wvqCompleted') || {};

  const levelLabel = _getProfileLevelLabel();

  const dueCount = getDueCount();

  let html = '<div class="wv-browser">';
  html += `<div class="wv-level-context-banner" aria-live="polite">
    Currently practising: <strong>${levelLabel} Vocabulary Cloze</strong>
  </div>`;
  html +=
    '<p class="cloze-cat-subtitle">Pick a word skill to practise. Each passage is a short story — read it through first, then fill every blank with the best word.</p>';
  if (dueCount > 0) {
    html += `<div class="wv-srs-due-badge" aria-live="polite">📅 ${dueCount} word${dueCount === 1 ? '' : 's'} due for review</div>`;
  }
  html += '<div class="wv-cat-grid">';

  const keys = Object.keys(VOCAB_CATEGORIES);
  const recommendedCat = questMastery.getRecommendedSkill('wordVault', keys);
  const masteryGaps = getTopMasteryGaps({
    mode: 'wordVault',
    level: levelLabel,
    masteryMap: store.get('masteryMap') || {},
  });
  const weakSkills = masteryGaps.length
    ? masteryGaps
    : getTopWeakSkills({ level: levelLabel, weakSkillsMap: store.get('wvWeakSkills') || {} }).map(
        (s) => ({
          skill: s.skill,
          skillLabel: getSkillLabel(s.skill),
          attempts: s.attempts,
          wrong: s.wrong,
          accuracy: Math.round(((s.attempts - s.wrong) / Math.max(1, s.attempts)) * 100),
          lastExample: null,
        }),
      );

  for (const [key, meta] of Object.entries(VOCAB_CATEGORIES)) {
    const doneLevels = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].filter(
      (lv) =>
        getUniqueWordVaultDone({
          category: key,
          level: lv,
          wvqCompletedByPassage: store.get('wvqCompletedByPassage') || {},
          wvqCompleted: completed,
        }) > 0,
    ).length;
    const levelsForCat = Object.values(vocabPassages[key] || {});
    const totalLevels = levelsForCat.filter((arr) => (arr || []).length > 0).length;
    const totalPassages = levelsForCat.reduce((sum, arr) => sum + (arr || []).length, 0);
    const totalQuestions = levelsForCat.reduce(
      (sum, arr) => sum + (arr || []).reduce((n, passage) => n + (passage.answers?.length || 0), 0),
      0,
    );
    const donePassages = _getUniquePassageCountForCategory(key);
    const perLevel = totalLevels ? Math.round(totalQuestions / totalLevels) : 0;
    const isRecommended = key === recommendedCat;

    html += `
      <button class="wv-cat-btn ${isRecommended ? 'wv-cat-btn--recommended' : ''}" data-cat="${key}"
              style="--cat-color:${meta.color}"
              aria-label="${meta.label}${isRecommended ? ' (recommended)' : ''}">
        <span class="wv-cat-icon">${meta.icon}</span>
        <span class="wv-cat-label">${meta.label}</span>
        <span class="wv-cat-desc">${meta.desc}</span>
        <span class="wv-cat-progress">${doneLevels}/${totalLevels} levels · ${totalQuestions} questions (~${perLevel}/level) · ${donePassages}/${totalPassages} passages${isRecommended ? ' · Recommended' : ''}</span>
      </button>`;
  }

  const weakList = weakSkills
    .map((item) => {
      const recommendation = summariseMasteryGap(item);
      const lastExample = item.lastExample
        ? ` · Last slip: "${escapeHtml(item.lastExample.chosen || '—')}" → "${escapeHtml(item.lastExample.correct || '?')}"`
        : '';
      return `<li>${escapeHtml(item.skillLabel || getSkillLabel(item.skill))}: ${item.wrong}/${item.attempts} · ${escapeHtml(recommendation)}${lastExample}</li>`;
    })
    .join('');
  html += `</div>
    <div class="cloze-cat-actions">
      <button class="btn btn--ghost btn--sm" id="wv-mastery-review">Review Weak Words</button>
      ${weakSkills.length ? `<ul class="cloze-mastery-list">${weakList}</ul>` : '<p class="cloze-cat-subtitle">Complete a few passages and the skills that need more practice will appear here.</p>'}
    </div>
  </div>`;
  _container.innerHTML = html;

  _container.querySelectorAll('.wv-cat-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      _currentCat = btn.dataset.cat;
      _renderLevelBrowser(_currentCat);
    });
  });
  document.getElementById('wv-mastery-review')?.addEventListener('click', () => {
    const target = recommendedCat || keys[0];
    _currentCat = target;
    _currentLevel = _getProfileLevelKey();
    _startPassage(_currentCat, _currentLevel);
  });
}

// ── Level browser (within a category) ─────────────────────────────────────

function _renderLevelBrowser(catKey) {
  if (!_container) return;

  const meta = VOCAB_CATEGORIES[catKey];
  const catData = vocabPassages[catKey] || {};
  const completed = (store.get('wvqCompleted') || {})[catKey] || {};
  const levels = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

  let html = `
    <div class="wv-level-browser">
      <div class="wv-level-header">
        <button class="btn btn--ghost btn--sm" id="wv-back-cats">← Categories</button>
        <span class="wv-level-title" style="color:${meta.color}">${meta.icon} ${meta.label}</span>
      </div>
      <p class="wv-level-desc">${meta.desc}</p>
      <div class="cloze-mode-toggle">
        <span class="cloze-mode-label">Mode:</span>
        <button class="btn btn--ghost btn--sm ${_sessionMode === 'practice' ? 'is-active' : ''}" id="wv-mode-practice" aria-pressed="${_sessionMode === 'practice'}">Practice Mode</button>
        <button class="btn btn--ghost btn--sm ${_sessionMode === 'exam' ? 'is-active' : ''}" id="wv-mode-exam" aria-pressed="${_sessionMode === 'exam'}">Exam Mode</button>
        <span class="cloze-mode-hint">${_sessionMode === 'practice' ? 'Learn as you go: hints, a warm-up read, and feedback after every passage.' : 'Just like the real paper: no hints, timed, and all feedback saved for the end.'}</span>
      </div>
      <div class="wv-level-grid">`;

  for (const lv of levels) {
    const passages = catData[lv];
    const hasPassage = passages && passages.length > 0;
    const isDone =
      getUniqueWordVaultDone({
        category: catKey,
        level: lv,
        wvqCompletedByPassage: store.get('wvqCompletedByPassage') || {},
        wvqCompleted: store.get('wvqCompleted') || {},
      }) > 0;
    const uniqueDone = getUniqueWordVaultDone({
      category: catKey,
      level: lv,
      wvqCompletedByPassage: store.get('wvqCompletedByPassage') || {},
      wvqCompleted: store.get('wvqCompleted') || {},
    });
    const questionTotal = (passages || []).reduce(
      (sum, passage) => sum + (passage.answers?.length || 0),
      0,
    );

    html += `
      <button class="wv-level-btn ${isDone ? 'wv-level-btn--done' : ''} ${!hasPassage ? 'wv-level-btn--locked' : ''}"
              data-level="${lv}"
              ${!hasPassage ? 'disabled aria-disabled="true"' : ''}
              style="--cat-color:${meta.color}"
              aria-label="${LEVEL_LABELS[lv]}${isDone ? ' – completed' : ''}">
        <span class="wv-level-icon">${isDone ? renderSummaryStars(completed[lv]?.stars || 1) : LEVEL_ICONS[lv]}</span>
        <span class="wv-level-name">${LEVEL_LABELS[lv]}</span>
        <span class="wv-level-count">${questionTotal} questions · ${uniqueDone}/${(passages || []).length} passages</span>
      </button>`;
  }

  html += '</div></div>';
  _container.innerHTML = html;

  document
    .getElementById('wv-back-cats')
    ?.addEventListener('click', () => _renderCategoryBrowser());
  document.getElementById('wv-mode-practice')?.addEventListener('click', () => {
    _sessionMode = 'practice';
    _renderLevelBrowser(catKey);
  });
  document.getElementById('wv-mode-exam')?.addEventListener('click', () => {
    _sessionMode = 'exam';
    _renderLevelBrowser(catKey);
  });

  _container.querySelectorAll('.wv-level-btn:not([disabled])').forEach((btn) => {
    btn.addEventListener('click', () => {
      _currentLevel = btn.dataset.level;
      _startPassage(catKey, _currentLevel);
    });
  });
}

// ── Passage flow ───────────────────────────────────────────────────────────

function _startPassage(catKey, level) {
  const passageList = (vocabPassages[catKey] || {})[level] || [];
  if (!passageList.length) return;

  _sessionCorrect = 0;
  _sessionTotal = 0;
  _sessionClueScore = 0;
  _sessionHintsUsed = 0;
  _sessionScanCorrect = 0;
  _sessionScanTotal = 0;
  _sessionSkillStats = {};
  _examStartedAt = Date.now();
  _sessionReviewRows = [];
  _infoPanelOpen = false;

  const perf = store.get('wvqWordPerformance') || {};
  const weighted = passageList.map((p) => {
    const avg =
      (p.answers || []).reduce((acc, ans) => {
        const st = perf[String(ans || '').toLowerCase()] || { attempts: 0, correct: 0 };
        const score = st.attempts ? st.correct / st.attempts : 0.45;
        return acc + score;
      }, 0) / Math.max(1, (p.answers || []).length);
    const weight = Math.max(0.2, 1.2 - avg);
    return { passage: p, weight };
  });

  const totalWeight = weighted.reduce((a, w) => a + w.weight, 0);
  let roll = Math.random() * totalWeight;
  _passage = weighted[weighted.length - 1].passage;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) {
      _passage = entry.passage;
      break;
    }
  }

  // Show rule card before the passage in practice mode.
  if (_sessionMode !== 'exam') {
    _renderVaultRuleCard(_currentCat, () => _initPassage(_passage));
  } else {
    _initPassage(_passage);
  }
}

function _initPassage(passage) {
  const round = createClozeRound(passage);
  _bankWords = round.bankWords;
  _blankFills = round.blankFills;
  _affixWrongAttempts = {};
  _affixParts = [];
  _passageWrongCount = 0;

  if (_isAffixMode(passage)) {
    _affixParts = (passage.answers || []).map((ans, idx) => {
      const hint = (passage.hints || [])[idx] || '';
      const parts = buildAffixParts(ans, hint);
      return {
        ...parts,
        answer: ans,
        meaning: hint,
        definition: (passage.definitions || {})[ans] || hint || 'Word built with affix.',
      };
    });

    _bankWords = _affixParts.map((part, id) => ({
      id,
      word: part.affix ? `${part.type === 'prefix' ? part.affix + '-' : '-' + part.affix}` : 'base',
      used: false,
    }));
  }

  // Reset clue state
  _clueResults = {};
  _hintLevel = 0;
  _weakAttempts = 0;

  if (passage.clues && passage.clues.length > 0) {
    const firstClue = [...passage.clues].sort((a, b) => a.blankIndex - b.blankIndex)[0];
    _activeBlankIndex = firstClue?.blankIndex ?? -1;
    _bankLocked = true;
  } else {
    _activeBlankIndex = -1;
    _bankLocked = false;
  }

  _readFirstAcknowledged = false;
  _scanTaskCompleted = false;
  _renderVaultScan(passage);
}

function _renderVaultScan(passage) {
  if (!_container) return;
  if (_readFirstAcknowledged) {
    _renderVaultScanTaskStep(passage);
    return;
  }
  renderReadFirstScan({
    host: _container,
    quest: 'vault',
    passageTitle: passage.title || 'Word Vault',
    passageText: passage.text || '',
    onContinue: () => {
      _readFirstAcknowledged = true;
      _renderVaultScanTaskStep(passage);
    },
    onQuit: () => {
      cleanupWordVault();
      _onGoHome?.();
    },
  });
}

function _renderVaultScanTaskStep(passage) {
  if (!_container) return;
  if (_scanTaskCompleted || _sessionMode === 'exam') {
    _renderPassage(passage);
    return;
  }
  const task = buildScanTaskForPassage(passage);
  if (!task) {
    _scanTaskCompleted = true;
    _renderPassage(passage);
    return;
  }
  _container.innerHTML = `
    <div class="wv-game wv-game--scan">
      <div class="wv-game-header">
        <span class="wv-game-badge">Scan Step</span>
      </div>
      <h3 class="wv-passage-title">${escapeHtml(passage.title || 'Word Vault')}</h3>
      <p class="wv-instruction">Warm-up: answer one quick question about the passage before you fill the blanks.</p>
      <div id="wv-scan-host"></div>
    </div>`;
  const host = document.getElementById('wv-scan-host');
  renderScanTask({
    host,
    task,
    onAnswer: ({ correct }) => {
      _scanTaskCompleted = true;
      _sessionScanTotal++;
      if (correct) _sessionScanCorrect++;
      _renderPassage(passage);
    },
    onSkip: () => {
      _scanTaskCompleted = true;
      _renderPassage(passage);
    },
  });
}

// ── Passage render ─────────────────────────────────────────────────────────

function _renderPassage(passage) {
  if (!_container) return;

  const meta = VOCAB_CATEGORIES[_currentCat];
  const lv = _currentLevel;
  const inClueMode = passage.clues && passage.clues.length > 0 && _bankLocked;
  const showLegend = _currentCat === 'grammaticalRole';
  const modeCfg = getModeConfig(_sessionMode);

  _container.innerHTML = `
    <div class="wv-game">
      <div class="wv-game-header">
        <button class="btn btn--ghost btn--sm" id="wv-back-levels">← Levels</button>
        <span class="wv-game-badge" style="color:${meta.color}">${meta.icon} ${meta.label}</span>
        <span class="wv-game-level">${LEVEL_ICONS[lv]} ${LEVEL_LABELS[lv]}</span>
        <span class="wv-game-level">${modeCfg.label}</span>
      </div>

      <h3 class="wv-passage-title">${passage.title}</h3>
      <div class="wv-progress"><span style="width:${((_sessionCorrect / Math.max(1, _sessionTotal || 1)) * 100).toFixed(0)}%"></span></div>

      ${inClueMode ? _buildClueHuntPanel(passage) : ''}

      <p class="wv-instruction" id="wv-instruction">
        ${inClueMode ? `🔍 ${passage.clueMission || 'Tap the context clue in the passage first!'}` : '🔑 Read the whole passage first, then tap a word to fill each blank.'}
      </p>

      ${showLegend ? '<div class="wv-pos-legend">POS: <span class="pos-noun">Noun</span><span class="pos-verb">Verb</span><span class="pos-adjective">Adjective</span><span class="pos-adverb">Adverb (-ly)</span></div>' : ''}

      <div class="wv-passage-text" id="wv-passage-text" aria-live="polite"></div>

      <div class="wv-bank-wrapper ${inClueMode ? 'wv-bank-wrapper--locked' : ''}" id="wv-bank-wrapper">
        ${inClueMode ? '<div class="wv-bank-lock-msg">🔒 Find the context clue first!</div>' : ''}
        <div class="wv-bank" id="wv-bank" aria-label="Word choices"></div>
      </div>

      ${modeCfg.allowInfoPanel ? `<aside class="wv-info-panel ${_infoPanelOpen ? 'wv-info-panel--open' : ''}" id="wv-info-panel" aria-live="polite"></aside>` : ''}

      <div class="wv-actions">
        <button class="btn btn--ghost btn--sm" id="wv-clear">↺ Clear all</button>
        <button class="btn btn--ghost btn--sm" id="wv-listen" aria-label="Listen to passage">🔊 Listen</button>
        ${modeCfg.allowInfoPanel ? '<button class="btn btn--ghost btn--sm" id="wv-info" aria-label="Show definitions panel">ℹ️ Info</button>' : ''}
        ${modeCfg.allowHints ? '<button class="btn btn--ghost btn--sm" id="wv-hint">💡 Hint</button>' : ''}
        ${modeCfg.allowInfoPanel ? '<button class="btn btn--ghost btn--sm" id="wv-rule-hint" aria-expanded="false">📖 Stuck? Show the rule</button>' : ''}
        <button class="btn btn--primary" id="wv-check" ${inClueMode ? 'disabled' : ''}>Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="wv-quit">Menu</button>
      </div>
      <div class="mcq-hint-panel" id="wv-rule-hint-panel" hidden></div>

      <div class="wv-feedback" id="wv-feedback" role="status" aria-live="assertive" hidden></div>
    </div>`;

  _renderText(passage);
  _renderBank(passage);
  _renderInfoPanel(passage);

  if (inClueMode) _attachClueHuntListeners(passage);

  document
    .getElementById('wv-back-levels')
    ?.addEventListener('click', () => _renderLevelBrowser(_currentCat));
  document.getElementById('wv-clear')?.addEventListener('click', () => {
    clearClozeRound(_bankWords, _blankFills);
    if (_isAffixMode(passage)) {
      _blankFills = Array(passage.answers.length).fill(null);
      _bankWords.forEach((w) => {
        w.used = false;
      });
    }
    _renderText(passage);
    _renderBank(passage);
  });
  document.getElementById('wv-listen')?.addEventListener('click', () => {
    let readable = passage.text;
    for (const ans of passage.answers) readable = readable.replace('___', ans);
    audio.speakWord(readable);
  });
  document.getElementById('wv-info')?.addEventListener('click', () => {
    _infoPanelOpen = !_infoPanelOpen;
    _renderInfoPanel(passage);
  });
  document.getElementById('wv-hint')?.addEventListener('click', () => {
    const idx = _getActiveBlankIndex();
    const msg =
      (passage.hints || [])[idx] ||
      (passage.clueType
        ? CONNECTOR_TYPE_LABELS[passage.clueType] || passage.clueType
        : 'Look for nearby context clues.');
    _sessionHintsUsed = incrementHintUsage(_sessionHintsUsed);
    _showFeedback(`💡 ${msg}`, false);
    if (_isAffixMode(passage) && _affixParts[idx]) {
      audio.speakWord(_affixParts[idx].meaning || `Affix ${_affixParts[idx].affix}`);
    } else if (_currentCat === 'collocationCloze' && passage.collocationHint) {
      audio.speakWord(passage.collocationHint);
    }
  });
  document.getElementById('wv-rule-hint')?.addEventListener('click', () => {
    const btn = document.getElementById('wv-rule-hint');
    const panel = document.getElementById('wv-rule-hint-panel');
    if (!btn || !panel) return;
    const wasHidden = panel.hidden;
    panel.hidden = !wasHidden;
    btn.setAttribute('aria-expanded', String(wasHidden));
    btn.textContent = wasHidden ? '📖 Hide the rule' : '📖 Stuck? Show the rule';
    if (wasHidden) {
      const tb = VAULT_TEACHBACK[_currentCat] || VAULT_TEACHBACK.default;
      panel.innerHTML = `
        <p class="mcq-hint-rule"><strong>Rule:</strong> ${escapeHtml(tb.rule)}</p>
        <p class="mcq-hint-eg"><em>${escapeHtml(tb.example)}</em></p>
        <p class="mcq-hint-tip">${escapeHtml(tb.tip)}</p>`;
    }
  });
  document.getElementById('wv-check')?.addEventListener('click', () => _checkPassage(passage));
  document.getElementById('wv-quit')?.addEventListener('click', () => {
    cleanupWordVault();
    _onGoHome?.();
  });

  if (_keyHandler) document.removeEventListener('keydown', _keyHandler);
  _keyHandler = (e) => {
    if (e.key === 'Enter' && !_bankLocked) {
      e.preventDefault();
      document.getElementById('wv-check')?.click();
    }
    if (e.key === 'Escape') {
      cleanupWordVault();
      _onGoHome?.();
    }
  };
  document.addEventListener('keydown', _keyHandler);
}

function _renderInfoPanel(passage) {
  if (!getModeConfig(_sessionMode).allowInfoPanel) return;
  const panel = document.getElementById('wv-info-panel');
  if (!panel) return;
  panel.className = `wv-info-panel ${_infoPanelOpen ? 'wv-info-panel--open' : ''}`;
  if (!_infoPanelOpen) {
    panel.innerHTML = '';
    return;
  }

  const rows = _buildDefinitionRows(passage);
  panel.innerHTML = `<h4>Word Guide</h4>${rows.map((r) => `<div class="wv-info-row"><strong>${escapeHtml(r.word)}</strong><span>${escapeHtml(r.definition)}</span><small>${escapeHtml(r.pos)}${r.collocationHint ? ` · ${escapeHtml(r.collocationHint)}` : ''}</small></div>`).join('')}`;
}

function _renderClueScoreMeter() {
  const scores = Object.values(_clueResults || {}).map(clueResultToScore);
  if (!scores.length) return '☆ ☆ ☆';
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const stars = avg >= 0.85 ? 3 : avg >= 0.45 ? 2 : 1;
  return `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`;
}

// ── Clue Hunt Panel HTML ───────────────────────────────────────────────────

function _buildClueHuntPanel(passage) {
  const clueData = _getActiveClueData(passage);
  if (!clueData) return '';
  const modeCfg = getModeConfig(_sessionMode);

  return `
    <div class="clue-hunt-panel" id="clue-hunt-panel">
      <div class="clue-hunt-header">
        <span class="clue-hunt-icon">🔍</span>
        <span class="clue-hunt-title">Find the Context Clue</span>
        <span class="clue-hunt-sub">Blank ${_activeBlankIndex + 1} · Clue Score ${_renderClueScoreMeter()}</span>
      </div>
      <p class="clue-hunt-prompt">${escapeHtml(clueData.prompt)}</p>
      <div class="clue-hunt-feedback" id="clue-hunt-feedback" aria-live="polite"></div>
      <div class="clue-hint-row">
        ${modeCfg.allowHints ? '<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-hint-btn" aria-label="Get a hint">💡 Hint</button>' : ''}
        ${modeCfg.allowHints ? '<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-skip-btn" aria-label="Skip clue">Skip clue</button>' : ''}
        <span class="clue-hint-msg" id="clue-hint-msg"></span>
      </div>
    </div>`;
}

// ── Clue Hunt Listeners ────────────────────────────────────────────────────

function _attachClueHuntListeners(passage) {
  if (!getModeConfig(_sessionMode).allowHints) return;
  document.getElementById('clue-hint-btn')?.addEventListener('click', () => {
    const clueData = _getActiveClueData(passage);
    if (!clueData) return;
    _hintLevel = Math.min(_hintLevel + 1, 4);
    _sessionHintsUsed = incrementHintUsage(_sessionHintsUsed);
    const { message } = getClueHint(_hintLevel, clueData);
    const hintMsg = document.getElementById('clue-hint-msg');
    if (hintMsg) {
      hintMsg.textContent = message;
      hintMsg.className = 'clue-hint-msg clue-hint-msg--visible';
    }
    if (_hintLevel >= 4) {
      _clueResults[_activeBlankIndex] = 'weak';
      _unlockBankAfterClue(passage, 'weak');
    }
  });

  document.getElementById('clue-skip-btn')?.addEventListener('click', () => {
    if (_activeBlankIndex < 0) return;
    _clueResults[_activeBlankIndex] = 'weak';
    _unlockBankAfterClue(passage, 'weak');
  });
}

// ── Clue Hunt — word tap ───────────────────────────────────────────────────

function _handleClueWordTap(tappedWord, passage) {
  const clueData = _getActiveClueData(passage);
  if (!clueData) return;

  const result = evaluateClueSelection(tappedWord, clueData);
  const feedback = clueResultFeedback(result);

  const fbEl = document.getElementById('clue-hunt-feedback');
  if (fbEl) {
    fbEl.textContent = feedback.message;
    fbEl.className = `clue-hunt-feedback ${feedback.cssClass}`;
  }

  // Re-render passage with highlighted selection
  const passageEl = document.getElementById('wv-passage-text');
  if (passageEl) {
    renderClueHuntPassage({
      container: passageEl,
      text: passage.text,
      activeBlankIndex: _activeBlankIndex,
      selectedWord: tappedWord,
      selectedResult: result,
      filledAnswers: _blankFills.map((id) =>
        id !== null ? _bankWords.find((w) => w.id === id)?.word || '' : '',
      ),
      onTapWord: (word) => _handleClueWordTap(word, passage),
    });
  }

  store.recordClueAttempt({
    quest: 'wordVault',
    result,
    clueType: clueData.clueType,
  });

  if (result === 'strong' || result === 'partial') {
    _clueResults[_activeBlankIndex] = result;
    audio.playSfx(result === 'strong' ? 'correct' : 'pop');
    setTimeout(() => _unlockBankAfterClue(passage, result), 800);
  } else {
    _weakAttempts++;
    audio.playSfx('wrong');
    if (_weakAttempts >= 2) {
      _clueResults[_activeBlankIndex] = 'weak';
      setTimeout(() => _unlockBankAfterClue(passage, 'weak'), 1000);
    }
  }
}

function _unlockBankAfterClue(passage, result) {
  if (!_bankLocked) return;

  _bankLocked = false;
  _activeBlankIndex = -1;
  _sessionClueScore += clueResultToScore(result || 'weak');

  const instr = document.getElementById('wv-instruction');
  if (instr) instr.textContent = '🔑 Clue found! Now tap the word that fits the blank.';

  const wrapper = document.getElementById('wv-bank-wrapper');
  if (wrapper) wrapper.className = 'wv-bank-wrapper';

  const checkBtn = document.getElementById('wv-check');
  if (checkBtn) checkBtn.disabled = false;

  _renderBank(passage);
}

// ── Passage text + bank rendering ─────────────────────────────────────────

function _renderText(passage) {
  const container = document.getElementById('wv-passage-text');
  if (!container) return;

  if (_bankLocked) {
    const filled = _blankFills.map((id) =>
      id !== null ? _bankWords.find((w) => w.id === id)?.word || '' : '',
    );
    renderClueHuntPassage({
      container,
      text: passage.text,
      activeBlankIndex: _activeBlankIndex,
      filledAnswers: filled,
      onTapWord: (word) => _handleClueWordTap(word, passage),
    });
    return;
  }

  if (_isAffixMode(passage)) {
    const parts = passage.text.split('___');
    let html = '';
    parts.forEach((part, i) => {
      html += `<span>${part}</span>`;
      if (i < parts.length - 1) {
        const fillId = _blankFills[i];
        const fill = fillId !== null ? _bankWords.find((w) => w.id === fillId) : null;
        const affix = _affixParts[i];
        if (fill) {
          const label = affix?.answer || '';
          html += `<button class="wv-blank wv-blank--filled" data-blank="${i}" aria-label="Remove ${label}">${label}</button>`;
        } else {
          const rootLabel = affix
            ? affix.type === 'prefix'
              ? `${affix.root}`
              : `${affix.root}`
            : '';
          html += `<button class="wv-blank wv-blank--affix" data-blank="${i}" aria-label="Blank ${i + 1}">${rootLabel}<span class="wv-affix-slot">${affix?.type === 'prefix' ? 'prefix' : 'suffix'}</span></button>`;
        }
      }
    });
    container.innerHTML = html;
    container.querySelectorAll('.wv-blank--filled').forEach((blank) => {
      blank.addEventListener('click', () => {
        const idx = parseInt(blank.dataset.blank, 10);
        const id = _blankFills[idx];
        const item = _bankWords.find((w) => w.id === id);
        if (item) item.used = false;
        _blankFills[idx] = null;
        _renderText(passage);
        _renderBank(passage);
      });
    });
    return;
  }

  renderClozePassage({
    container,
    text: passage.text,
    blankFills: _blankFills,
    bankWords: _bankWords,
    blankClass: 'wv-blank',
    filledClass: 'wv-blank--filled',
    emptyBlankAria: (i) => `Blank ${i + 1}`,
    removeBlankAria: (word) => `Remove ${word}`,
    onRemoveWord: () => {
      _renderText(passage);
      _renderBank(passage);
    },
  });
}

function _renderBank(passage) {
  const bank = document.getElementById('wv-bank');
  if (!bank) return;

  if (_bankLocked) {
    bank.innerHTML = _bankWords
      .map(
        (w) => `
      <button class="wv-word-chip wv-word-chip--locked"
              disabled aria-disabled="true"
              aria-label="${escapeAttr(w.word)}">${escapeHtml(w.word)}</button>
    `,
      )
      .join('');
    return;
  }

  const activeBlank = _getActiveBlankIndex();
  const answerForBlank = passage.answers?.[activeBlank] || '';

  bank.innerHTML = _bankWords
    .map((w) => {
      const isUsed = w.used;
      const tone = _getChipToneClass(passage, w.word);
      const cue =
        _currentCat === 'collocationCloze' &&
        passage.collocationHintsByWord?.[answerForBlank] &&
        !isUsed
          ? ` title="${escapeAttr(passage.collocationHintsByWord[w.word] || '')}"`
          : '';
      const label =
        _currentCat === 'collocationCloze' && passage.collocationHintsByWord?.[w.word]
          ? `${w.word} … ${(passage.collocationHintsByWord[w.word].split('+')[1] || '').trim()}`
          : w.word;
      return `<button class="wv-word-chip ${tone} ${isUsed ? 'wv-word-chip--used' : ''}" data-id="${w.id}" ${isUsed ? 'disabled aria-disabled="true"' : ''}${cue} aria-label="${escapeAttr(label)}">${escapeHtml(label)}</button>`;
    })
    .join('');

  bank.querySelectorAll('.wv-word-chip:not([disabled])').forEach((chip) => {
    chip.addEventListener('click', () => {
      const id = parseInt(chip.dataset.id, 10);
      const chosen = _bankWords.find((w) => w.id === id);
      if (!chosen || chosen.used) return;

      const blankIdx = _blankFills.findIndex((fill) => fill === null);
      if (blankIdx === -1) return;

      if (_isAffixMode(passage)) {
        const expectedAffix = _affixParts[blankIdx]?.affix;
        const chosenAffix = chosen.word.replace(/^-/, '').replace(/-$/, '');
        if (expectedAffix !== chosenAffix) {
          _affixWrongAttempts[blankIdx] = (_affixWrongAttempts[blankIdx] || 0) + 1;
          _showFeedback(
            `Not quite. ${chosenAffix || 'That option'} does not fit this root.`,
            false,
          );
          if (_affixWrongAttempts[blankIdx] >= 2) {
            _showFeedback(
              `💡 Affix meaning: ${_affixParts[blankIdx]?.meaning || 'Use the affix that matches the word meaning.'}`,
              false,
            );
          }
          _recordAffixAttempt(chosenAffix, false);
          return;
        }
        chosen.used = true;
        _blankFills[blankIdx] = id;
        _recordAffixAttempt(chosenAffix, true);
      } else {
        if (!fillNextBlank(_bankWords, _blankFills, id)) return;
      }

      audio.playSfx('pop');

      const expected = passage.answers?.[blankIdx];
      if (_currentCat === 'synonymContrast' && chosen.word !== expected) {
        const pair = (passage.contrastPairs || []).find((p) => p.word === chosen.word);
        if (pair)
          _showFeedback(pair.explanation || `${pair.word} is linked with ${pair.pair}.`, false);
      }
      if (_currentCat === 'connectorClue' && chosen.word !== expected) {
        const t = passage.clueType || _getClueDataForBlank(passage, blankIdx)?.clueType;
        _showFeedback(
          `Connector type mismatch. ${CONNECTOR_TYPE_LABELS[t] || 'Check connector meaning.'}`,
          false,
        );
      }
      if (_currentCat === 'collocationCloze' && chosen.word !== expected) {
        const good = passage.collocationHintsByWord?.[expected] || passage.collocationHint || '';
        const bad = passage.collocationHintsByWord?.[chosen.word] || '';
        _showFeedback(
          `Collocation tip: ${good || `Use ${expected}`}${bad ? ` (not ${bad})` : ''}`,
          false,
        );
      }

      const nextClue = (passage.clues || [])
        .slice()
        .sort((a, b) => a.blankIndex - b.blankIndex)
        .find(
          (c) => _blankFills[c.blankIndex] === null && !Object.hasOwn(_clueResults, c.blankIndex),
        );

      if (nextClue) {
        _activeBlankIndex = nextClue.blankIndex;
        _bankLocked = true;
        _hintLevel = 0;
        _weakAttempts = 0;
        _renderPassage(passage);
      } else {
        _renderText(passage);
        _renderBank(passage);
      }
    });
  });
}

function _getChipToneClass(passage, word) {
  if (_currentCat === 'synonymContrast') {
    const pair = (passage.contrastPairs || []).find((p) => p.word === word);
    return pair?.type === 'antonym'
      ? 'wv-word-chip--antonym'
      : pair?.type === 'synonym'
        ? 'wv-word-chip--synonym'
        : '';
  }
  if (_currentCat === 'grammaticalRole') {
    const pos = (passage.partOfSpeechMap || {})[word];
    return POS_CLASS_MAP[pos] || '';
  }
  return '';
}

// ── Clue data helpers ──────────────────────────────────────────────────────

function _getActiveClueData(passage) {
  if (!passage.clues) return null;
  return passage.clues.find((c) => c.blankIndex === _activeBlankIndex) || null;
}

function _getClueDataForBlank(passage, blankIndex) {
  if (!passage.clues) return null;
  return passage.clues.find((c) => c.blankIndex === blankIndex) || null;
}

function _getVocabSkillLabel() {
  if (_currentCat === 'synonymContrast') return 'synonym';
  if (_currentCat === 'collocationCloze') return 'collocation';
  if (_currentCat === 'connectorClue') return 'connector';
  if (_currentCat === 'morphologicalAffix') return 'affix';
  if (_currentCat === 'grammaticalRole') return 'word form';
  return 'context meaning';
}

function _buildVocabReviewRows(passage, userAnswers) {
  const fallbackSkill = _currentCat === 'collocationCloze' ? 'collocation' : 'vocabularyInContext';
  return passage.answers.map((correctAnswer, idx) => {
    const clue = _getClueDataForBlank(passage, idx);
    const meta = getBlankSkillMeta(passage, idx);
    const skillTag = normaliseSkillTag(meta.primarySkill || passage.skillTag || fallbackSkill);
    const chosen = userAnswers[idx] || '';
    const isWrong = chosen !== correctAnswer;
    const why = isWrong
      ? buildWhyWrongExplanation({
          meta,
          chosen,
          correct: correctAnswer,
          stem: stemForBlank(passage.text, idx, passage.answers),
          domain: 'vocab',
        })
      : null;
    const simpleMeaning =
      meta.simpleMeaning ||
      (passage.definitions || {})[correctAnswer] ||
      'Use context clues to find the meaning.';
    const trapReason =
      (passage.wrongOptionTraps || []).find((t) => t.option === chosen)?.reason ||
      meta.wrongOptionTraps?.[chosen];

    const explanationParts = [simpleMeaning];
    if (trapReason) explanationParts.push(`Trap check: ${trapReason}`);
    else explanationParts.push('Choose the word that matches the clue meaning.');

    const nextStepParts = [getReviewPromptForSkill(skillTag)];
    if (meta.partOfSpeech) nextStepParts.push(`POS: ${meta.partOfSpeech}.`);
    if (meta.writingUse) nextStepParts.push(`Writing tip: ${meta.writingUse}`);

    return {
      blank: `#${idx + 1}`,
      passageTitle: passage.title,
      studentAnswer: chosen,
      correctAnswer,
      status: isWrong ? 'Try again' : 'Correct',
      skillTag,
      skillLabel: getSkillLabel(skillTag),
      clueTypeLabel: getClueTypeLabel(meta.clueType || clue?.clueType || passage.clueType),
      clue: clue?.acceptableSpans?.[0] || (passage.hints || [])[idx] || 'Look near this blank.',
      explanation: explanationParts.join(' '),
      nextStepPrompt: nextStepParts.join(' '),
      whyWrong: why?.whyWrong,
      whyRight: why?.whyRight,
      missedClue: why?.missedClue,
      examTip: meta.examTip || (why ? why.examTip : ''),
      misconceptionId: why?.misconceptionId || null,
    };
  });
}

// ── Checking ───────────────────────────────────────────────────────────────

function _checkPassage(passage) {
  if (_blankFills.some((f) => f === null)) {
    _showFeedback('Fill all the blanks first! 🔑', false);
    return;
  }

  const userAnswers = _isAffixMode(passage)
    ? _blankFills.map((id, i) => {
        const item = _bankWords.find((w) => w.id === id);
        const affix = (item?.word || '').replace(/^-/, '').replace(/-$/, '');
        const part = _affixParts[i];
        return part
          ? part.type === 'prefix'
            ? `${affix}${part.root}`
            : `${part.root}${affix}`
          : '';
      })
    : buildUserAnswers(_blankFills, _bankWords);

  const blankCorrect = userAnswers.filter((ans, i) => ans === passage.answers[i]).length;
  const blankTotal = passage.answers.length;
  const allCorrect = blankCorrect === blankTotal;
  const modeCfg = getModeConfig(_sessionMode);
  const skillTag = normaliseSkillTag(
    passage.skillTag ||
      (_currentCat === 'collocationCloze' ? 'collocation' : 'vocabularyInContext'),
  );

  _sessionTotal++;
  const weakMap = recordWeakSkills({
    storageKey: 'wvWeakSkills',
    level: String(_currentLevel).toUpperCase(),
    skills: passage.answers.map(() => skillTag),
    wrongSkillSet: new Set(allCorrect ? [] : [skillTag]),
    current: store.get('wvWeakSkills') || {},
  });
  store.set('wvWeakSkills', weakMap);

  let masteryMap = store.get('masteryMap') || {};
  const vocabRows = _buildVocabReviewRows(passage, userAnswers);
  // First submission only — a retry of the same blanks is the child working
  // on the slip, not repeating it.
  if (_passageWrongCount === 0) {
    recordMisconceptionsFromReview(vocabRows, { mode: 'wordVault' });
  }
  const vaultLevel = String(_currentLevel).toUpperCase();
  vocabRows.forEach((row, idx) => {
    const meta = getBlankSkillMeta(passage, idx);
    const wasWrong = row.status !== 'Correct';
    const skillKey = meta.primarySkill || skillTag;
    if (!_sessionSkillStats[skillKey]) {
      _sessionSkillStats[skillKey] = {
        correct: 0,
        total: 0,
        label: row.skillLabel || getSkillLabel(skillKey),
        lastWrongExamples: [],
      };
    }
    const stat = _sessionSkillStats[skillKey];
    stat.total += 1;
    if (!wasWrong) stat.correct += 1;
    else if (row.correctAnswer && stat.lastWrongExamples.length < 3) {
      stat.lastWrongExamples.push(row.correctAnswer);
    }
    masteryMap = recordMasteryAttempt({
      mode: 'wordVault',
      level: vaultLevel,
      category: _currentCat,
      skill: skillKey,
      clueType: meta.clueType,
      wasWrong,
      example: wasWrong
        ? {
            passageId: passage.id,
            blankIndex: idx,
            chosen: row.studentAnswer,
            correct: row.correctAnswer,
            clueType: meta.clueType,
          }
        : null,
      current: masteryMap,
    });
  });
  store.set('masteryMap', masteryMap);

  userAnswers.forEach((ans, i) =>
    _recordVocabPerformance(passage.answers[i], ans === passage.answers[i]),
  );

  if (modeCfg.showFinalReviewOnly) {
    _sessionBlankCorrect = blankCorrect;
    _sessionBlankTotal = blankTotal;
    _sessionReviewRows.push(
      ...vocabRows
        .filter((r) => r.status !== 'Correct')
        .map((r) => ({
          passageTitle: passage.title,
          blank: r.blank,
          studentAnswer: r.studentAnswer,
          correctAnswer: r.correctAnswer,
          explanation: r.explanation,
          skillLabel: r.skillLabel,
        })),
    );
    const examAttempts = store.get('wvqExamAttempts') || [];
    examAttempts.push({
      category: _currentCat,
      level: _currentLevel,
      passageId: passage.id,
      blankCorrect,
      blankTotal,
      submittedAt: Date.now(),
    });
    store.set('wvqExamAttempts', examAttempts.slice(-150));
    _showComplete({ blankCorrect, blankTotal, userAnswers });
    return;
  }

  if (allCorrect) {
    _sessionCorrect++;
    gamification.recordCorrect(2000, false);
    if (getModeConfig(_sessionMode).confettiPerPassage) celebrateCorrect();
    audio.playSfx('correct');
    mascot.celebrate(false);

    const accPercent = Math.round((blankCorrect / Math.max(1, blankTotal)) * 100);
    const stars = getWordVaultStars({ accuracy: accPercent, hintsUsed: _sessionHintsUsed });
    if (passage.id) {
      const tracked = recordWordVaultCompletion({
        category: _currentCat,
        level: _currentLevel,
        passageId: passage.id,
        stars,
        accuracy: accPercent,
        wvqCompletedByPassage: store.get('wvqCompletedByPassage') || {},
        wvqCompleted: store.get('wvqCompleted') || {},
      });
      store.set('wvqCompletedByPassage', tracked.nextByPassage);
      store.set('wvqCompleted', tracked.nextCompleted);
    }

    questMastery.recordAttempt({
      quest: 'wordVault',
      skill: _currentCat,
      correct: true,
      responseMs: 1500,
      level: _currentLevel,
    });
    questMastery.updateSkill('wordVault', _currentCat, true);

    document
      .querySelectorAll('.wv-blank--filled')
      .forEach((b) => b.classList.add('wv-blank--correct'));

    _sessionBlankCorrect = blankCorrect;
    _sessionBlankTotal = blankTotal;

    // In practice mode, wrap _showComplete with the sentence step.
    const _advanceToComplete = () => {
      if (_sessionMode === 'practice') {
        _showSentenceStep(passage, () => _showComplete({ blankCorrect, blankTotal }));
      } else {
        _showComplete({ blankCorrect, blankTotal });
      }
    };

    showAnswerReviewPanel({
      host: _container.querySelector('.wv-game'),
      title: 'Answer Review',
      rows: _buildVocabReviewRows(passage, userAnswers),
      onContinue: () => {
        if (_isAffixMode(passage))
          return _showMorphologySummary(passage, () => setTimeout(() => _advanceToComplete(), 300));
        if (_currentCat === 'synonymContrast')
          return _showSynonymReview(passage, () => setTimeout(() => _advanceToComplete(), 300));
        if (_currentCat === 'collocationCloze')
          return _showCollocationReview(passage, () => setTimeout(() => _advanceToComplete(), 300));
        if (passage.clues && passage.clues.length > 0)
          return _showClueExplanation(passage, () => setTimeout(() => _advanceToComplete(), 400));
        _advanceToComplete();
      },
    });
  } else {
    audio.playSfx('wrong');
    questMastery.recordAttempt({
      quest: 'wordVault',
      skill: _currentCat,
      correct: false,
      responseMs: 2000,
      level: _currentLevel,
    });
    questMastery.updateSkill('wordVault', _currentCat, false);
    document.querySelectorAll('.wv-blank--filled').forEach((b, i) => {
      const ans = userAnswers[i] || '';
      b.classList.toggle('wv-blank--wrong', ans !== passage.answers[i]);
    });
    mascot.encourage();
    _passageWrongCount++;

    if (_sessionMode === 'exam') {
      showAnswerReviewPanel({
        host: _container.querySelector('.wv-game'),
        title: 'Exam Submission Review',
        rows: _buildVocabReviewRows(passage, userAnswers),
        onContinue: () => _showComplete({ blankCorrect, blankTotal, userAnswers }),
      });
      return;
    }

    if (_passageWrongCount >= 2) {
      _showFeedback("❌ Let's review the mistakes first.", false);
      setTimeout(() => {
        document
          .querySelectorAll('.wv-blank--wrong')
          .forEach((b) => b.classList.remove('wv-blank--wrong'));
        showAnswerReviewPanel({
          host: _container.querySelector('.wv-game'),
          title: 'Review Mistakes',
          rows: _buildVocabReviewRows(passage, userAnswers),
          onContinue: () => _showVaultTeachBackOverlay(passage),
        });
      }, 800);
    } else {
      _showFeedback(
        '❌ Not quite — the red blanks need another look. Reread those sentences before you try again.',
        false,
      );
      setTimeout(() => {
        document
          .querySelectorAll('.wv-blank--wrong')
          .forEach((b) => b.classList.remove('wv-blank--wrong'));
        const fb = document.getElementById('wv-feedback');
        if (fb) fb.hidden = true;
      }, 1800);
    }
  }
}

// ── Pre-session rule card ──────────────────────────────────────────────────

function _renderVaultRuleCard(catKey, onStart) {
  if (!_container) return;
  const tb = VAULT_TEACHBACK[catKey] || VAULT_TEACHBACK.default;
  const meta = VOCAB_CATEGORIES[catKey] || { icon: '📘', label: catKey };

  _container.innerHTML = `
    <div class="mcq-rule-card" role="region" aria-label="Vocabulary tip: ${escapeAttr(meta.label)}">
      <div class="mcq-rule-icon" aria-hidden="true">${tb.icon || meta.icon}</div>
      <h2 class="mcq-rule-title">${escapeHtml(meta.label)}</h2>
      <p class="mcq-rule-intro">A quick lesson before you start — read it once, then use it in the passage.</p>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${escapeHtml(tb.rule)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${escapeHtml(tb.example)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${escapeHtml(tb.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="wv-rule-start">Got it — start passage →</button>
        <button class="btn btn--ghost" id="wv-rule-skip">I know this rule — skip →</button>
      </div>
    </div>`;

  _container.querySelector('#wv-rule-start')?.addEventListener('click', onStart);
  _container.querySelector('#wv-rule-skip')?.addEventListener('click', onStart);
}

// ── Vocabulary teach-back overlay ──────────────────────────────────────────

function _showVaultTeachBackOverlay(passage) {
  if (!_container) return;

  const tb = VAULT_TEACHBACK[_currentCat] || VAULT_TEACHBACK.default;

  const existing = document.getElementById('wv-teachback-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'wv-teachback-overlay';
  overlay.className = 'wv-teachback-overlay';
  overlay.innerHTML = `
    <div class="wv-tb-panel">
      <div class="wv-tb-header">
        <span class="wv-tb-icon">${tb.icon}</span>
        <h3 class="wv-tb-title">Quick Skill Reminder</h3>
      </div>
      <p class="wv-tb-rule">${escapeHtml(tb.rule)}</p>
      <div class="wv-tb-example">${escapeHtml(tb.example)}</div>
      <p class="wv-tb-tip">💡 ${escapeHtml(tb.tip)}</p>
      <p class="cloze-restart-note">Your blanks will be cleared so you can try the whole passage again with this rule in mind.</p>
      <button class="btn btn--primary wv-tb-btn" id="wv-tb-got-it">
        Got it — Try again →
      </button>
    </div>`;

  _container.querySelector('.wv-game')?.appendChild(overlay);

  document.getElementById('wv-tb-got-it')?.addEventListener('click', () => {
    overlay.remove();
    // Reset fills so learner retries from scratch
    _bankWords.forEach((w) => {
      w.used = false;
    });
    _blankFills.fill(null);
    _passageWrongCount = 0;
    _renderText(passage);
    _renderBank(passage);
    const fb = document.getElementById('wv-feedback');
    if (fb) fb.hidden = true;
  });

  setTimeout(() => document.getElementById('wv-tb-got-it')?.focus(), 100);
}

// ── Post-answer Clue Explanation ───────────────────────────────────────────

function _showClueExplanation(passage, onContinue) {
  if (!_container) return;

  const primaryClue = passage.clues[0];
  const clueSpan = (primaryClue.acceptableSpans || [])[0] || '';
  const playerResult = _clueResults[primaryClue.blankIndex] || 'weak';
  const { cssClass } = clueResultFeedback(playerResult);

  const existing = document.getElementById('wv-explanation-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'wv-explanation-overlay';
  overlay.className = 'clue-explanation-overlay';
  overlay.innerHTML = `
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">✅ Brilliant! All correct!</p>
      <div class="clue-explanation-body">
        <p class="clue-explanation-label">Context clue:</p>
        <span class="clue-result-badge ${cssClass}">${escapeHtml(clueSpan || 'No clue selected')}</span>
        <p class="clue-explanation-text">${escapeHtml(primaryClue.explanation)}</p>
      </div>
      <button class="btn btn--primary" id="wv-explanation-next">Continue →</button>
    </div>`;

  _container.querySelector('.wv-game')?.appendChild(overlay);
  audio.playSfx('correct');

  document.getElementById('wv-explanation-next')?.addEventListener('click', () => {
    overlay.remove();
    onContinue();
  });

  setTimeout(() => {
    if (document.getElementById('wv-explanation-overlay')) {
      overlay.remove();
      onContinue();
    }
  }, 4000);
}

function _showMorphologySummary(passage, onContinue) {
  const overlay = document.createElement('div');
  overlay.className = 'clue-explanation-overlay';
  overlay.innerHTML = `<div class="clue-explanation-card"><p class="clue-explanation-title">🧩 Word Parts Recap</p>
    <div class="clue-explanation-body">${_affixParts.map((part) => `<p><strong>${escapeHtml(part.answer)}</strong> = ${part.type === 'prefix' ? `${part.affix}- + ${part.root}` : `${part.root} + -${part.affix}`} → ${escapeHtml(part.definition)}</p>`).join('')}</div>
    <button class="btn btn--primary" id="wv-review-next">Continue →</button></div>`;
  _container.querySelector('.wv-game')?.appendChild(overlay);
  document.getElementById('wv-review-next')?.addEventListener('click', () => {
    overlay.remove();
    onContinue?.();
  });
}

function _showSynonymReview(passage, onContinue) {
  const defs = passage.definitions || {};
  const overlay = document.createElement('div');
  overlay.className = 'clue-explanation-overlay';
  overlay.innerHTML = `<div class="clue-explanation-card"><p class="clue-explanation-title">📚 Synonym & Contrast Review</p>
    <div class="clue-explanation-body"><table class="wv-review-table"><thead><tr><th>Answer</th><th>Definition</th><th>Synonym</th><th>Antonym</th></tr></thead>
    <tbody>${passage.answers
      .map((word) => {
        const syn =
          (passage.contrastPairs || []).find((p) => p.word === word && p.type === 'synonym')
            ?.pair || '—';
        const ant =
          (passage.contrastPairs || []).find((p) => p.word === word && p.type === 'antonym')
            ?.pair || '—';
        return `<tr><td>${word}</td><td>${escapeHtml(defs[word] || '—')}</td><td>${escapeHtml(syn)}</td><td>${escapeHtml(ant)}</td></tr>`;
      })
      .join('')}</tbody></table></div>
    <button class="btn btn--primary" id="wv-review-next">Continue →</button></div>`;
  _container.querySelector('.wv-game')?.appendChild(overlay);
  document.getElementById('wv-review-next')?.addEventListener('click', () => {
    overlay.remove();
    onContinue?.();
  });
}

function _showCollocationReview(passage, onContinue) {
  const overlay = document.createElement('div');
  overlay.className = 'clue-explanation-overlay';
  overlay.innerHTML = `<div class="clue-explanation-card"><p class="clue-explanation-title">🤝 Collocation Guide</p>
    <div class="clue-explanation-body">${passage.answers.map((word) => `<p><strong>${escapeHtml(word)}</strong>: ${escapeHtml((passage.collocationHintsByWord || {})[word] || passage.collocationHint || 'Word partner pattern')}</p>`).join('')}</div>
    <button class="btn btn--primary" id="wv-review-next">Continue →</button></div>`;
  _container.querySelector('.wv-game')?.appendChild(overlay);
  document.getElementById('wv-review-next')?.addEventListener('click', () => {
    overlay.remove();
    onContinue?.();
  });
}

// ── "Use it in a sentence" step (practice mode only) ──────────────────────

/**
 * Pick the target word for the sentence step.
 * Prefer the first answer that has a definition in passage.definitions,
 * fall back to the first answer.
 */
function _getSentenceTargetWord(passage) {
  const defs = passage.definitions || {};
  const answers = passage.answers || [];
  const withDef = answers.find((a) => defs[a]);
  return withDef || answers[0] || null;
}

/**
 * Build a model sentence fragment from the passage text for the target word.
 * Finds the sentence in the passage that contains the blank corresponding to
 * the target word, then returns it with the blank filled.
 */
function _getModelSentence(passage, targetWord) {
  const answers = passage.answers || [];
  const blankIndex = answers.indexOf(targetWord);
  if (blankIndex === -1) return `Use "${targetWord}" in a complete sentence.`;

  // Split on ___ and reconstruct the surrounding sentence
  const parts = (passage.text || '').split('___');
  if (blankIndex >= parts.length - 1) return `Use "${targetWord}" in a complete sentence.`;

  // Grab the text segment that spans the blank
  const before = parts[blankIndex];
  const after = parts[blankIndex + 1];

  // Find the start of the sentence containing the blank
  const sentenceStartMatch = before.match(/(?:^|[.!?]\s+)([^.!?]*)$/s);
  const sentenceBefore = sentenceStartMatch ? sentenceStartMatch[1] : before.slice(-60);

  // Find the end of the sentence after the blank
  const sentenceEndMatch = after.match(/^([^.!?]*[.!?])/s);
  const sentenceAfter = sentenceEndMatch ? sentenceEndMatch[1] : after.slice(0, 60);

  const model = `${sentenceBefore.trimStart()}${targetWord}${sentenceAfter}`.trim();
  return model || `Use "${targetWord}" in a complete sentence.`;
}

/**
 * Show the "Use it in a sentence" intermediate screen.
 * Only called in practice mode. Calls scheduleWord() on self-assessment or skip,
 * then invokes onContinue.
 *
 * @param {object} passage     - current passage object
 * @param {function} onContinue - called after the step resolves
 */
function _showSentenceStep(passage, onContinue) {
  if (!_container) {
    onContinue();
    return;
  }

  const targetWord = _getSentenceTargetWord(passage);
  if (!targetWord) {
    onContinue();
    return;
  }

  const defs = passage.definitions || {};
  const definition = defs[targetWord] || 'Use the sentence context to understand this word.';
  const modelSentence = _getModelSentence(passage, targetWord);
  const wordId = `${_currentCat}__${targetWord}`.toLowerCase().replace(/\s+/g, '_');

  const existing = document.getElementById('wv-sentence-step-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'wv-sentence-step-overlay';
  overlay.className = 'clue-explanation-overlay';
  overlay.innerHTML = `
    <div class="clue-explanation-card wv-sentence-step">
      <p class="clue-explanation-title">📝 Use the word in a sentence!</p>
      <p class="clue-explanation-text">Making your own sentence with a new word is the best way to remember it.</p>
      <div class="clue-explanation-body">
        <p class="wv-sentence-step__word">Word: <strong>${escapeHtml(targetWord)}</strong></p>
        <p class="wv-sentence-step__meaning">Meaning: ${escapeHtml(definition)}</p>
        <label class="wv-sentence-step__label" for="wv-sentence-input">
          Write a sentence using "<strong>${escapeHtml(targetWord)}</strong>":
        </label>
        <input
          type="text"
          id="wv-sentence-input"
          class="sfq-input wv-sentence-step__input"
          placeholder="Type your sentence here…"
          autocomplete="off"
          aria-label="Write a sentence using the word ${escapeHtml(targetWord)}"
        />
        <div class="wv-sentence-step__model" id="wv-sentence-model" hidden>
          <p class="wv-sentence-step__model-label">Model sentence:</p>
          <p class="wv-sentence-step__model-text">${escapeHtml(modelSentence)}</p>
        </div>
      </div>
      <div class="wv-sentence-step__actions">
        <button class="btn btn--primary" id="wv-sentence-similar">✓ My sentence is similar</button>
        <button class="btn btn--ghost btn--sm" id="wv-sentence-skip">↩ Skip</button>
      </div>
    </div>`;

  _container.querySelector('.wv-game')?.appendChild(overlay);

  const input = overlay.querySelector('#wv-sentence-input');
  const modelEl = overlay.querySelector('#wv-sentence-model');

  // Show model sentence once at least 5 characters have been typed
  input?.addEventListener('input', () => {
    if (input.value.length >= 5 && modelEl) {
      modelEl.hidden = false;
    }
  });

  overlay.querySelector('#wv-sentence-similar')?.addEventListener('click', () => {
    scheduleWord(wordId, true);
    overlay.remove();
    onContinue();
  });

  overlay.querySelector('#wv-sentence-skip')?.addEventListener('click', () => {
    scheduleWord(wordId, false);
    overlay.remove();
    onContinue();
  });

  setTimeout(() => input?.focus(), 100);
}

function _showFeedback(msg, success) {
  const el = document.getElementById('wv-feedback');
  if (!el) return;
  el.textContent = msg;
  el.className = `wv-feedback wv-feedback--${success ? 'success' : 'error'}`;
  el.hidden = false;
  if (success)
    setTimeout(() => {
      el.hidden = true;
    }, 1600);
}

// ── Complete screen ────────────────────────────────────────────────────────

function _showComplete(summary = {}) {
  if (!_container) return;

  const meta = VOCAB_CATEGORIES[_currentCat];
  const levels = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
  const nextLv = levels[levels.indexOf(_currentLevel) + 1] || null;

  celebrateCorrect();
  audio.playSfx('levelUp');
  mascot.celebrate(true);

  const totalBlanks = summary.blankTotal ?? _sessionBlankTotal ?? _passage?.answers?.length ?? 0;
  const correctBlanks = summary.blankCorrect ?? _sessionBlankCorrect ?? 0;
  const acc = totalBlanks > 0 ? Math.round((correctBlanks / totalBlanks) * 100) : 0;
  const stars = getWordVaultStars({ accuracy: acc, hintsUsed: _sessionHintsUsed });
  const modeCfg = getModeConfig(_sessionMode);
  const elapsedSec = Math.max(1, Math.round((Date.now() - (_examStartedAt || Date.now())) / 1000));
  const recommendation = getNextStepRecommendation({
    accuracy: acc,
    skillLabel: meta.label,
    hintsUsed: _sessionHintsUsed,
  });
  const weakSkills = getTopWeakSkills({
    level: String(_currentLevel).toUpperCase(),
    weakSkillsMap: store.get('wvWeakSkills') || {},
  });
  const weakSkillsLine = weakSkills.length
    ? `<p class="wv-complete-score">Weak skills: ${weakSkills.map((s) => `${getSkillLabel(s.skill)} ${s.wrong}/${s.attempts}`).join(' · ')}</p>`
    : '';
  const wrongLines =
    _sessionMode === 'exam' && _sessionReviewRows.length
      ? groupWrongLinesBySkill(_sessionReviewRows)
      : _sessionReviewRows.map(
          (row) =>
            `- ${row.passageTitle} ${row.blank}: ${row.studentAnswer || '(blank)'} → ${row.correctAnswer}`,
        );

  const clueTotal = Object.keys(_clueResults).length;
  const clueAcc = clueTotal > 0 ? Math.round((_sessionClueScore / clueTotal) * 100) : null;
  const clueAccLine =
    clueAcc !== null ? `<p class="wv-complete-clue">🔍 Clue accuracy: ${clueAcc}%</p>` : '';

  const scanAcc =
    _sessionScanTotal > 0 ? Math.round((_sessionScanCorrect / _sessionScanTotal) * 100) : null;
  const scanAccLine =
    scanAcc !== null
      ? `<p class="wv-complete-clue">🔎 Scan accuracy: ${scanAcc}% (${_sessionScanCorrect}/${_sessionScanTotal})</p>`
      : '';

  let focusTip = '';
  if (acc < 70 && _currentCat) {
    const tb = VAULT_TEACHBACK[_currentCat] || VAULT_TEACHBACK.default;
    const tipMeta = VOCAB_CATEGORIES[_currentCat] || { icon: '📘', label: _currentCat };
    focusTip = `
      <div class="mcq-focus-tip">
        <p class="mcq-focus-tip-heading">${tb.icon || tipMeta.icon} Focus on: <strong>${escapeHtml(tipMeta.label)}</strong></p>
        <p class="mcq-focus-tip-rule">${escapeHtml(tb.rule)}</p>
        <p class="mcq-focus-tip-eg"><em>${escapeHtml(tb.example)}</em></p>
        <p class="mcq-focus-tip-tip">${escapeHtml(tb.tip)}</p>
      </div>`;
  }

  _container.innerHTML = `
    <div class="wv-summary-overlay"><div class="wv-complete">
      <div class="wv-complete-icon">${meta.icon}</div>
      <h3 class="wv-complete-title">Vault Opened! 🔑</h3>
      <p class="wv-complete-sub">${meta.label} · ${LEVEL_LABELS[_currentLevel]}</p>
      <div class="wv-stars">${renderSummaryStars(stars)}</div>
      <p class="wv-complete-score">Blanks: ${correctBlanks} / ${totalBlanks} correct · ${acc}%</p>
      <p class="wv-complete-score">Mode: ${modeCfg.label} · Hints used: ${_sessionHintsUsed} · Time: ${elapsedSec}s</p>
      ${weakSkillsLine}
      ${clueAccLine}
      ${scanAccLine}${focusTip}
      <p class="wv-complete-score">Next Step: ${recommendation}</p>
      <div class="wv-complete-actions">
        ${
          nextLv
            ? `<button class="btn btn--primary btn--lg" id="wv-next-level">${LEVEL_LABELS[nextLv]} →</button>`
            : ''
        }
        <button class="btn btn--ghost btn--sm" id="wv-replay">Play Again ↺</button>
        <button class="btn btn--ghost btn--sm" id="wv-copy-summary">Copy Summary</button>
        <button class="btn btn--ghost btn--sm" id="wv-copy-parent-report">Copy Parent Report</button>
        <button class="btn btn--ghost btn--sm" id="wv-back-lvls">All Levels</button>
        <button class="btn btn--ghost btn--sm" id="wv-back-cats2">Categories</button>
      </div>
    </div></div>`;

  document.getElementById('wv-next-level')?.addEventListener('click', () => {
    _currentLevel = nextLv;
    _startPassage(_currentCat, _currentLevel);
  });
  document
    .getElementById('wv-replay')
    ?.addEventListener('click', () => _startPassage(_currentCat, _currentLevel));
  document.getElementById('wv-copy-summary')?.addEventListener('click', async () => {
    const text = buildCopySummaryText({
      modeLabel: modeCfg.label,
      title: _passage?.title || 'Word Vault Passage',
      category: meta.label,
      level: LEVEL_LABELS[_currentLevel],
      scoreLine: `${correctBlanks}/${totalBlanks}`,
      accuracy: acc,
      timeTaken: `${elapsedSec}s`,
      hintsUsed: _sessionHintsUsed,
      clueScore: clueAcc ?? 0,
      wrongLines,
      nextStep: recommendation,
    });
    try {
      await navigator.clipboard?.writeText(text);
      _showFeedback('Summary copied!', true);
    } catch {
      _showFeedback('Unable to copy summary on this device.', false);
    }
  });
  document.getElementById('wv-copy-parent-report')?.addEventListener('click', async () => {
    const { strongest, weakest } = pickStrongestWeakest(_sessionSkillStats);
    const text = buildParentReport({
      questLabel: 'Word Vault',
      modeLabel: modeCfg.label,
      scoreLine: `${correctBlanks}/${totalBlanks}`,
      accuracy: acc,
      strongest,
      weakest,
      weakExamples: weakest ? _sessionSkillStats[weakest.skill]?.lastWrongExamples || [] : [],
      recommendation,
    });
    try {
      await navigator.clipboard?.writeText(text);
      _showFeedback('Parent report copied!', true);
    } catch {
      _showFeedback('Unable to copy parent report on this device.', false);
    }
  });
  document
    .getElementById('wv-back-lvls')
    ?.addEventListener('click', () => _renderLevelBrowser(_currentCat));
  document
    .getElementById('wv-back-cats2')
    ?.addEventListener('click', () => _renderCategoryBrowser());

  if (_keyHandler) {
    document.removeEventListener('keydown', _keyHandler);
    _keyHandler = null;
  }
  setTimeout(
    () =>
      (document.getElementById('wv-next-level') || document.getElementById('wv-replay'))?.focus(),
    200,
  );
}
