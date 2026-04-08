/**
 * PhonicsQuest – Sentence Forge Quest 🔨
 *
 * Word-order game: scrambled words → tap to arrange into a correct sentence.
 *
 * Upgraded sentence-skill engine (Part C):
 *   - Tracks mastery per sentence-skill tag (not only word_order)
 *   - Shows a skill-clue panel before building when metadata is available
 *   - Diagnoses build errors with targeted hints using sentenceSkills metadata
 *   - Renders richer completion summary with per-skill performance
 *
 * Clue Mission Layer (Part E – preserved):
 *   - Sentences with `clueMission` still get pre-build clue-hunt scaffold
 *   - Backward compatible: sentences without any metadata still work normally
 *
 * Public API:
 *   initSentenceForge(container, onGoHome) – attach to DOM container
 *   showSentenceBrowser()                  – render level picker
 *   cleanupSentenceForge()                 – teardown
 */

import { allSentences, SENTENCE_LEVEL_LABELS, SENTENCE_LEVEL_ICONS } from '../data/sentences.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { gamification } from '../modules/gamification.js';
import { questMastery } from '../modules/questMastery.js';
import { celebrateCorrect } from '../components/confettiHelper.js';
import { mascot } from '../components/mascot.js';
import {
  getSkillCluePrompt,
  diagnoseBuildError,
  getSkillSummary,
} from '../modules/sentenceSkills.js';
import { classifySentenceTrack } from '../modules/sentenceForgeTracks.js';

// ── Module state ────────────────────────────────────────────────────────────

let _container = null;
let _onGoHome  = null;

let _currentLevel    = 1;
let _currentTrack    = 'word-order';
let _levelSentences  = [];
let _sentenceIdx     = 0;
let _bankWords       = [];    // [{id, word, used}]
let _answerSlots     = [];    // bank word ids in answer order
let _sessionCorrect  = 0;
let _sessionTotal    = 0;
let _sessionXpEarned = 0;
let _sessionStreakBonus = 0;
let _keyHandler      = null;

// Per-sentence-skill attempt tracking for the session
// { [skillKey]: { correct: number, total: number } }
let _sessionSkillAttempts = {};

// Clue mission state
let _clueMissionDone   = false;
let _clueMissionResult = null;
let _sessionClueCorrect = 0;
let _sessionClueMissionTotal = 0;

// Skill clue panel – dismissed once per sentence after "Got it"
let _skillClueDismissed = false;

// Wrong-attempt counter per sentence — resets each new sentence
let _sentenceWrongCount = 0;

// ── Sentence skill teach-back content ───────────────────────────────────────
const SENTENCE_SKILL_TEACHBACK = {
  connector_clue: {
    icon: '🔗',
    rule: 'Connectors link two ideas. Choose the connector that matches the relationship.',
    example: '"She was tired, BUT she kept working." — "He was late BECAUSE his bus broke down."',
    tip: 'Ask: contrast (but/although), reason (because/since), result (so/therefore), addition (and/also)?',
  },
  comparison_structure: {
    icon: '⚖️',
    rule: 'Comparisons use -er + than for short adjectives, or more + adjective + than for longer ones.',
    example: '"This box is BIGGER than that one." — "She is MORE careful than her brother."',
    tip: 'Short adjective (1–2 syllables): add -er. Long adjective (3+ syllables): use "more".',
  },
  modal_order: {
    icon: '🛡️',
    rule: 'Modal verbs (can, should, must, could, would) go BEFORE the base verb — no "to" needed.',
    example: '"You SHOULD eat vegetables." — "He CAN swim fast." — "They MUST leave now."',
    tip: '"She must go" ✓ · "She must to go" ✗ — modals never need "to".',
  },
  tense_clue: {
    icon: '⏱️',
    rule: 'The tense shows WHEN something happens. Look for time-clue words first.',
    example: '"Yesterday, she WALKED home." — "Right now, he IS RUNNING." — "Tomorrow, we WILL travel."',
    tip: 'Find the time word (yesterday / now / tomorrow / since) — it tells you which tense fits.',
  },
  preposition_clue: {
    icon: '📍',
    rule: 'Prepositions show time, place, or direction: in, on, at, by, with, for, from, to.',
    example: '"The cat is ON the chair." — "We eat AT 7." — "She walked TO school."',
    tip: 'Ask: WHERE is it? WHEN did it happen? HOW was it done? The answer starts with a preposition.',
  },
  word_order: {
    icon: '🔨',
    rule: 'English sentences follow the order: Subject → Verb → Object (SVO).',
    example: '"The dog (S) chased (V) the ball (O)." — "She (S) reads (V) books (O) every day."',
    tip: 'Find WHO is doing the action first — that is the Subject, and it goes at the start.',
  },
  clause_boundary: {
    icon: '✂️',
    rule: 'Clauses are separated by commas. The order of the main clause and subordinate clause matters.',
    example: '"Although it was raining, we went out." — "We went out although it was raining."',
    tip: 'Look for the comma — it marks where one clause ends and the next begins.',
  },
  first_word_clue: {
    icon: '🔤',
    rule: 'The first word of a sentence often signals the sentence type or clause order.',
    example: '"After lunch, we played." — "We played after lunch." Capital letter = sentence start.',
    tip: 'Look at time phrases and conjunctions — they often come first, followed by a comma.',
  },
  punctuation_clue: {
    icon: '❗',
    rule: 'Commas, full stops, and question marks guide sentence structure and word order.',
    example: '"Before eating, wash your hands." — The comma after "eating" signals a clause boundary.',
    tip: 'Find commas first — they separate phrases and show you where to split the sentence.',
  },
  subject_action_clue: {
    icon: '🎯',
    rule: 'Every sentence needs a subject (who/what) and an action (verb). Find them first.',
    example: '"The cat (subject) sat (action) on the mat." — Subject comes before the verb.',
    tip: 'Ask: WHO is doing WHAT? The answer gives you the subject and verb to place first.',
  },
  time_order_clue: {
    icon: '🕐',
    rule: 'Time phrases (yesterday, in the morning, after that) often come first or last in a sentence.',
    example: '"Last week, she visited her grandmother." — "She visited her grandmother last week."',
    tip: 'If the time phrase comes first, remember to add a comma after it.',
  },
  inversion_pattern: {
    icon: '🔄',
    rule: 'In inverted sentences, the verb or auxiliary comes before the subject.',
    example: '"Rarely do we see such talent." — "Not only did he win, but he also set a record."',
    tip: 'Fronted adverbs (Rarely, Seldom, Never, Not only) trigger subject-auxiliary inversion.',
  },
};

const LEVEL_SKILL_KEYS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
const LEVEL_TAG_LABELS = {
  connector_clue: '🔗 Connectors',
  comparison_structure: '⚖️ Comparatives',
  modal_order: '🛡️ Modals',
  tense_clue: '⏱️ Tenses',
  preposition_clue: '📍 Prepositions',
};

export function getSentenceForgeCategoriesByLevel(sentences = allSentences) {
  const result = {};
  for (let lv = 1; lv <= 6; lv++) {
    const skillSet = new Set();
    sentences
      .filter(s => s.level === lv)
      .forEach(s => (s.sentenceSkills || []).forEach(skill => skillSet.add(skill)));
    result[lv] = Object.keys(LEVEL_TAG_LABELS).filter(skill => skillSet.has(skill));
  }
  return result;
}

export function getScoreboardStats({ correct, total }) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
  return { accuracy, stars };
}

// ── Public API ──────────────────────────────────────────────────────────────

export function initSentenceForge(container, onGoHome) {
  _container = container;
  _onGoHome  = onGoHome;
}

export function showSentenceBrowser() {
  _renderBrowser();
}

export function setSentenceForgeTrack(trackKey) {
  if (['word-order', 'sentence-combining', 'synthesis-transformation'].includes(trackKey)) {
    _currentTrack = trackKey;
  }
}

export function cleanupSentenceForge() {
  if (_container) _container.innerHTML = '';
  _bankWords   = [];
  _answerSlots = [];
  _sessionSkillAttempts = {};
  _sessionCorrect  = 0;
  _sessionTotal    = 0;
  _sessionXpEarned = 0;
  _sessionStreakBonus = 0;
  _sessionClueCorrect = 0;
  _sessionClueMissionTotal = 0;
  _sentenceWrongCount = 0;
  if (_keyHandler) { document.removeEventListener('keydown', _keyHandler); _keyHandler = null; }
}

// ── Browser ─────────────────────────────────────────────────────────────────

function _renderBrowser() {
  if (!_container) return;

  const completed = store.get('sfqCompleted') || {};
  const categoryMap = getSentenceForgeCategoriesByLevel();

  const tracks = [
    { key: 'word-order', label: 'Word Order (P1–P2)' },
    { key: 'sentence-combining', label: 'Sentence Combining (P2–P4)' },
    { key: 'synthesis-transformation', label: 'Synthesis & Transformation (P4–P6)' },
  ];

  let html = `<div class="sfq-browser">
    <div class="sfq-actions" style="flex-wrap:wrap">
      ${tracks.map(t => `<button class="btn ${_currentTrack === t.key ? 'btn--primary' : 'btn--ghost'}" data-track="${t.key}">${t.label}</button>`).join('')}
    </div>
    <div class="sfq-browser-grid">`;

  for (let lv = 1; lv <= 6; lv++) {
    const total = allSentences.filter(s => s.level === lv && _getSentenceTrack(s) === _currentTrack).length;
    const done  = completed[lv] || 0;
    const isDone = done >= total;
    const icon   = SENTENCE_LEVEL_ICONS[lv - 1];

    const categorySkills = categoryMap[lv] || [];
    html += total > 0 ? `
      <button class="sfq-level-btn ${isDone ? 'sfq-level-btn--done' : ''}"
              data-level="${lv}" aria-label="${SENTENCE_LEVEL_LABELS[lv]}">
        <span class="sfq-level-icon">${isDone ? '⭐' : icon}</span>
        <span class="sfq-level-name">${SENTENCE_LEVEL_LABELS[lv]}</span>
        <span class="sfq-level-count">${Math.min(done, total)} / ${total}</span>
        <span class="sfq-level-categories" aria-label="Sentence categories for level ${lv}">
          ${categorySkills.map(skill => `<span class="sfq-level-tag">${LEVEL_TAG_LABELS[skill]}</span>`).join('')}
        </span>
      </button>` : '';
  }
  console.info('[SentenceForge] Level selector categories', categoryMap);

  html += '</div></div>';
  _container.innerHTML = html;

  _container.querySelectorAll('.sfq-level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentLevel = parseInt(btn.dataset.level);
      _startLevel(_currentLevel);
    });
  });
  _container.querySelectorAll('[data-track]').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentTrack = btn.dataset.track;
      _renderBrowser();
    });
  });
}

// ── Level flow ───────────────────────────────────────────────────────────────

function _startLevel(level) {
  const raw = allSentences.filter(s => s.level === level && _getSentenceTrack(s) === _currentTrack);
  _levelSentences  = [...raw].sort(() => Math.random() - 0.5);
  _sentenceIdx     = 0;
  _sessionCorrect  = 0;
  _sessionTotal    = 0;
  _sessionXpEarned = 0;
  _sessionStreakBonus = 0;
  _sessionClueCorrect = 0;
  _sessionClueMissionTotal = 0;
  _sessionSkillAttempts = {};
  _showSentence();
}

function _getSentenceTrack(entry) {
  return classifySentenceTrack(entry);
}

function _showSentence() {
  if (_sentenceIdx >= _levelSentences.length) {
    _showComplete();
    return;
  }
  const entry = _levelSentences[_sentenceIdx];

  _clueMissionDone   = false;
  _clueMissionResult = null;
  _skillClueDismissed = false;
  _sentenceWrongCount = 0;

  if (entry.clueMission) {
    _renderClueMission(entry);
  } else {
    _setupArrangePhase(entry);
  }
}

// ── Clue Mission Phase (preserved) ──────────────────────────────────────────

function _renderClueMission(entry) {
  if (!_container) return;

  const mission = entry.clueMission;
  const words   = entry.sentence.replace(/[.!?]$/, '').split(' ');
  const icon    = SENTENCE_LEVEL_ICONS[_currentLevel - 1];
  const prog    = `${_sentenceIdx + 1} / ${_levelSentences.length}`;

  _container.innerHTML = `
    <div class="sfq-game">
      <div class="sfq-header">
        <span class="sfq-badge">${icon} ${SENTENCE_LEVEL_LABELS[_currentLevel]}</span>
        <span class="sfq-progress">${prog}</span>
        ${entry.focusLabel ? `<span class="sfq-focus-chip">${entry.focusLabel}</span>` : ''}
      </div>

      <div class="clue-mission-panel">
        <div class="clue-mission-header">
          <span class="clue-mission-icon">🔍</span>
          <span class="clue-mission-title">Spot the Clue</span>
        </div>
        <p class="clue-mission-prompt">${mission.prompt}</p>

        <div class="clue-mission-words" id="clue-mission-words" aria-label="Tap the clue word">
          ${words.map((w, i) => `
            <button class="clue-mission-word-btn" data-index="${i}" data-word="${w.replace(/[^a-zA-Z]/g, '')}"
                    aria-label="Tap ${w}">
              ${w}
            </button>`).join('')}
        </div>

        <div class="clue-mission-feedback" id="clue-mission-feedback" aria-live="polite"></div>

        <button class="btn btn--ghost btn--sm sfq-mission-skip" id="sfq-mission-skip">
          Skip → Build the sentence
        </button>
      </div>

      <div class="sfq-actions">
        <button class="btn btn--ghost btn--sm" id="sfq-quit">Menu</button>
      </div>
    </div>`;

  _container.querySelectorAll('.clue-mission-word-btn').forEach(btn => {
    btn.addEventListener('click', () => _handleMissionWordTap(btn, entry, words));
  });

  document.getElementById('sfq-mission-skip')?.addEventListener('click', () => {
    _clueMissionDone   = true;
    _clueMissionResult = null;
    _setupArrangePhase(entry);
  });

  document.getElementById('sfq-quit')?.addEventListener('click', () => {
    cleanupSentenceForge(); _onGoHome?.();
  });

  _rebindKeyHandler(() => { cleanupSentenceForge(); _onGoHome?.(); });
}

function _handleMissionWordTap(btn, entry, words) {
  const mission    = entry.clueMission;
  const tappedWord = btn.dataset.word.toLowerCase();
  const acceptable = (mission.acceptableWords || []).map(w => w.toLowerCase());
  const correct    = acceptable.includes(tappedWord);

  document.querySelectorAll('.clue-mission-word-btn').forEach(b => b.classList.remove('clue-mission-word-btn--selected'));
  btn.classList.add(correct ? 'clue-mission-word-btn--correct' : 'clue-mission-word-btn--wrong');

  const fbEl = document.getElementById('clue-mission-feedback');
  if (fbEl) {
    if (correct) {
      fbEl.textContent = `✨ ${mission.explanation}`;
      fbEl.className   = 'clue-mission-feedback clue-mission-feedback--correct';
      document.querySelectorAll('.clue-mission-word-btn').forEach(b => {
        if (acceptable.includes(b.dataset.word.toLowerCase())) {
          b.classList.add('clue-mission-word-btn--correct');
        }
      });
    } else {
      fbEl.textContent = `🔴 Not quite! Look for: ${mission.acceptableWords.join(', ')}`;
      fbEl.className   = 'clue-mission-feedback clue-mission-feedback--wrong';
    }
  }

  store.recordClueAttempt({
    quest: 'sentenceForge',
    result: correct ? 'correct' : 'incorrect',
    clueType: mission.clueType,
  });

  _clueMissionDone   = true;
  _clueMissionResult = correct ? 'correct' : 'incorrect';
  _sessionClueMissionTotal++;
  if (correct) _sessionClueCorrect++;

  audio.playSfx(correct ? 'correct' : 'wrong');
  setTimeout(() => _setupArrangePhase(entry), correct ? 1400 : 2200);
}

// ── Arrange Phase ────────────────────────────────────────────────────────────

function _setupArrangePhase(entry) {
  const clean    = entry.sentence.replace(/[.!?]$/, '');
  const punct    = entry.sentence.slice(clean.length);
  const rawWords = clean.split(' ');

  _bankWords = rawWords.map((w, i) => ({ id: i, word: w, used: false }));

  // Fisher-Yates shuffle
  for (let i = _bankWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_bankWords[i], _bankWords[j]] = [_bankWords[j], _bankWords[i]];
  }

  _answerSlots = [];

  // Show skill-clue panel for enriched entries that have no clueMission
  const skillPrompt = !entry.clueMission ? getSkillCluePrompt(entry) : null;
  if (skillPrompt && !_skillClueDismissed) {
    _renderSkillCluePanel(entry, punct, skillPrompt);
  } else {
    _renderGame(entry, punct);
  }
}

// ── Skill Clue Panel (new) ───────────────────────────────────────────────────

function _renderSkillCluePanel(entry, punct, prompt) {
  if (!_container) return;
  const icon = SENTENCE_LEVEL_ICONS[_currentLevel - 1];
  const prog = `${_sentenceIdx + 1} / ${_levelSentences.length}`;

  _container.innerHTML = `
    <div class="sfq-game">
      <div class="sfq-header">
        <span class="sfq-badge">${icon} ${SENTENCE_LEVEL_LABELS[_currentLevel]}</span>
        <span class="sfq-progress">${prog}</span>
        ${entry.focusLabel ? `<span class="sfq-focus-chip">${entry.focusLabel}</span>` : ''}
      </div>

      <div class="sfq-skill-clue-panel">
        <div class="sfq-skill-clue-icon">💡</div>
        <p class="sfq-skill-clue-prompt">${prompt.prompt}</p>
        ${prompt.detail ? `<p class="sfq-skill-clue-detail">${prompt.detail}</p>` : ''}
        <button class="btn btn--primary sfq-skill-clue-go" id="sfq-skill-clue-go">
          Got it — Build the sentence →
        </button>
      </div>

      <div class="sfq-actions">
        <button class="btn btn--ghost btn--sm" id="sfq-quit">Menu</button>
      </div>
    </div>`;

  document.getElementById('sfq-skill-clue-go')?.addEventListener('click', () => {
    _skillClueDismissed = true;
    _renderGame(entry, punct);
  });
  document.getElementById('sfq-quit')?.addEventListener('click', () => {
    cleanupSentenceForge(); _onGoHome?.();
  });
  _rebindKeyHandler(() => { cleanupSentenceForge(); _onGoHome?.(); });
}

// ── Game render ──────────────────────────────────────────────────────────────

function _renderGame(entry, punct) {
  if (!_container) return;

  const prog   = `${_sentenceIdx + 1} / ${_levelSentences.length}`;
  const icon   = SENTENCE_LEVEL_ICONS[_currentLevel - 1];
  const xpVal  = 10 + _currentLevel * 5;

  const clueBadge = _clueMissionResult === 'correct'
    ? `<span class="sfq-clue-badge sfq-clue-badge--correct" title="Clue found!">🔍✨</span>`
    : _clueMissionResult === 'incorrect'
    ? `<span class="sfq-clue-badge sfq-clue-badge--missed" title="Clue missed">🔍</span>`
    : '';

  _container.innerHTML = `
    <div class="sfq-game">
      <div class="sfq-header">
        <span class="sfq-badge">${icon} ${SENTENCE_LEVEL_LABELS[_currentLevel]}</span>
        <span class="sfq-progress">${prog}</span>
        <span class="sfq-xp-badge">+${xpVal} XP</span>
        ${clueBadge}
        ${entry.focusLabel ? `<span class="sfq-focus-chip">${entry.focusLabel}</span>` : ''}
      </div>

      <p class="sfq-instruction">🔨 Tap the words to build the sentence!</p>
      ${entry.synthesisTask ? `
      <div class="dash-pattern-item" style="margin-bottom:12px">
        <strong>🧪 Synthesis Task:</strong> ${entry.synthesisTask.prompt}
        ${entry.synthesisTask.connectors?.length ? `<br><em>Use one connector:</em> ${entry.synthesisTask.connectors.join(', ')}` : ''}
        ${entry.synthesisTask.punctuationHint ? `<br><em>Punctuation:</em> ${entry.synthesisTask.punctuationHint}` : ''}
      </div>` : ''}

      <div class="sfq-answer-area" id="sfq-answer-area" aria-label="Your sentence">
        <div class="sfq-answer-chips" id="sfq-answer-chips">
          <span class="sfq-placeholder" id="sfq-placeholder">Tap words below…</span>
        </div>
        <span class="sfq-punct" id="sfq-punct" aria-hidden="true">${punct}</span>
      </div>

      <div class="sfq-bank" id="sfq-bank" aria-label="Word choices"></div>

      <div class="sfq-actions">
        <button class="btn btn--ghost btn--sm" id="sfq-clear">↺ Clear</button>
        <button class="btn btn--ghost btn--sm" id="sfq-listen" aria-label="Listen to sentence">🔊 Listen</button>
        <button class="btn btn--primary" id="sfq-check">Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="sfq-quit">Menu</button>
      </div>

      <div class="sfq-feedback" id="sfq-feedback" role="status" aria-live="assertive" hidden></div>
    </div>`;

  _renderBank();
  _renderAnswer();

  document.getElementById('sfq-clear')?.addEventListener('click', () => {
    _bankWords.forEach(w => (w.used = false));
    _answerSlots = [];
    _renderBank();
    _renderAnswer();
  });

  document.getElementById('sfq-listen')?.addEventListener('click', () => audio.speakWord(entry.sentence));
  document.getElementById('sfq-check')?.addEventListener('click', () => _checkAnswer(entry, punct));
  document.getElementById('sfq-quit')?.addEventListener('click', () => { cleanupSentenceForge(); _onGoHome?.(); });

  _rebindKeyHandler(
    () => { cleanupSentenceForge(); _onGoHome?.(); },
    () => document.getElementById('sfq-check')?.click(),
  );

  setTimeout(() => _container?.querySelector('.sfq-word-chip')?.focus(), 100);
}

function _renderBank() {
  const bank = document.getElementById('sfq-bank');
  if (!bank) return;
  bank.innerHTML = _bankWords.map(w => `
    <button class="sfq-word-chip ${w.used ? 'sfq-word-chip--used' : ''}"
            data-id="${w.id}"
            ${w.used ? 'disabled aria-disabled="true"' : ''}
            aria-label="${w.word}">${w.word}</button>
  `).join('');

  bank.querySelectorAll('.sfq-word-chip:not([disabled])').forEach(chip => {
    chip.addEventListener('click', () => {
      const id   = parseInt(chip.dataset.id);
      const item = _bankWords.find(w => w.id === id);
      if (!item || item.used) return;
      item.used = true;
      _answerSlots.push(id);
      audio.playSfx('pop');
      _renderBank();
      _renderAnswer();
    });
  });
}

function _renderAnswer() {
  const area = document.getElementById('sfq-answer-chips');
  const ph   = document.getElementById('sfq-placeholder');
  if (!area) return;

  if (_answerSlots.length === 0) {
    if (ph) ph.hidden = false;
    area.querySelectorAll('.sfq-answer-chip').forEach(c => c.remove());
    return;
  }

  if (ph) ph.hidden = true;
  area.querySelectorAll('.sfq-answer-chip').forEach(c => c.remove());

  _answerSlots.forEach((id, idx) => {
    const item = _bankWords.find(w => w.id === id);
    if (!item) return;
    const chip = document.createElement('button');
    chip.className   = 'sfq-answer-chip';
    chip.textContent = item.word;
    chip.setAttribute('aria-label', `Remove ${item.word}`);
    chip.addEventListener('click', () => {
      item.used = false;
      _answerSlots.splice(idx, 1);
      _renderBank();
      _renderAnswer();
    });
    area.appendChild(chip);
  });
}

// ── Checking ─────────────────────────────────────────────────────────────────

function _checkAnswer(entry, punct) {
  if (_answerSlots.length === 0) {
    _showFeedback('Build your sentence first! 🔨', false);
    return;
  }

  const builtWords  = _answerSlots.map(id => _bankWords.find(w => w.id === id)?.word || '');
  const constructed = builtWords.join(' ') + punct;
  const correct     = constructed === entry.sentence;
  const cleanTarget = entry.sentence.replace(/[.!?]$/, '').split(' ');

  _sessionTotal++;

  // Skills to record — prefer sentenceSkills tags, fall back to word_order
  const skills = entry.sentenceSkills?.length ? entry.sentenceSkills : ['word_order'];

  if (correct) {
    _sessionCorrect++;

    for (const skill of skills) {
      questMastery.recordAttempt({ quest: 'sentenceForge', skill, correct: true, level: _currentLevel });
      questMastery.updateSkill('sentenceForge', skill, true);
      _recordSessionSkill(skill, true);
    }

    const reward = gamification.recordCorrect(1200, false);
    _sessionXpEarned += reward?.xpEarned || 0;
    if (reward?.reasons?.includes('5 in a row!')) _sessionStreakBonus += 10;
    if (reward?.reasons?.includes('10 in a row!')) _sessionStreakBonus += 20;
    celebrateCorrect();
    audio.playSfx('correct');
    mascot.celebrate(false);

    const completed = store.get('sfqCompleted') || {};
    completed[_currentLevel] = (completed[_currentLevel] || 0) + 1;
    store.set('sfqCompleted', completed);

    _showFeedback('✅ Perfect! Well done!', true);
    setTimeout(() => { _sentenceIdx++; _showSentence(); }, 1500);

  } else {
    for (const skill of skills) {
      questMastery.recordAttempt({ quest: 'sentenceForge', skill, correct: false, level: _currentLevel });
      questMastery.updateSkill('sentenceForge', skill, false);
      _recordSessionSkill(skill, false);
    }

    gamification.recordWrong();
    audio.playSfx('wrong');
    mascot.encourage();
    _sentenceWrongCount++;

    // Targeted diagnostic hint using sentence metadata
    const hint = diagnoseBuildError(entry, builtWords, cleanTarget);

    const area = document.getElementById('sfq-answer-area');
    area?.classList.remove('sfq-shake');
    void area?.offsetWidth;
    area?.classList.add('sfq-shake');
    setTimeout(() => area?.classList.remove('sfq-shake'), 500);

    // On 2nd wrong attempt: show teach-back overlay instead of inline hint
    if (_sentenceWrongCount >= 2) {
      _showFeedback('❌ Let\'s look at the rule, then try again!', false);
      setTimeout(() => _showSentenceTeachBackOverlay(entry, punct), 1000);
    } else {
      _showFeedback(`❌ ${hint}`, false);
    }
  }
}

// ── Sentence teach-back overlay ──────────────────────────────────────────────

function _showSentenceTeachBackOverlay(entry, punct) {
  if (!_container) return;

  // Pick the most relevant skill for this sentence
  const primarySkill = (entry.sentenceSkills || [])[0] || 'word_order';
  const tb = SENTENCE_SKILL_TEACHBACK[primarySkill] || SENTENCE_SKILL_TEACHBACK.word_order;

  const existing = document.getElementById('sfq-teachback-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id        = 'sfq-teachback-overlay';
  overlay.className = 'sfq-teachback-overlay';
  overlay.innerHTML = `
    <div class="sfq-tb-panel">
      <div class="sfq-tb-header">
        <span class="sfq-tb-icon">${tb.icon}</span>
        <h3 class="sfq-tb-title">Quick Skill Reminder</h3>
      </div>
      <p class="sfq-tb-rule">${tb.rule}</p>
      <div class="sfq-tb-example">${tb.example}</div>
      <p class="sfq-tb-tip">💡 ${tb.tip}</p>
      <button class="btn btn--primary sfq-tb-btn" id="sfq-tb-got-it">
        Got it — Try again →
      </button>
    </div>`;

  _container.querySelector('.sfq-game')?.appendChild(overlay);
  document.getElementById('sfq-tb-got-it')?.addEventListener('click', () => {
    overlay.remove();
    // Reset answer slots so learner can retry with a fresh slate
    _bankWords.forEach(w => (w.used = false));
    _answerSlots = [];
    _sentenceWrongCount = 0;
    _renderBank();
    _renderAnswer();
    const fbEl = document.getElementById('sfq-feedback');
    if (fbEl) { fbEl.hidden = true; }
  });

  setTimeout(() => document.getElementById('sfq-tb-got-it')?.focus(), 100);
}

function _recordSessionSkill(skill, correct) {
  if (!_sessionSkillAttempts[skill]) _sessionSkillAttempts[skill] = { correct: 0, total: 0 };
  _sessionSkillAttempts[skill].total++;
  if (correct) _sessionSkillAttempts[skill].correct++;
}

function _showFeedback(msg, success) {
  const el = document.getElementById('sfq-feedback');
  if (!el) return;
  el.textContent = msg;
  el.className = `sfq-feedback sfq-feedback--${success ? 'success' : 'error'}`;
  el.hidden = false;
  if (success) setTimeout(() => { el.hidden = true; }, 1400);
}

// ── Complete screen ───────────────────────────────────────────────────────────

function _showComplete() {
  if (!_container) return;

  const { accuracy: acc, stars } = getScoreboardStats({ correct: _sessionCorrect, total: _sessionTotal });
  const icon  = SENTENCE_LEVEL_ICONS[_currentLevel - 1];
  const allLevels = [...LEVEL_SKILL_KEYS];
  const recommendedSkill = questMastery.getRecommendedSkill('sentenceForge', allLevels);
  const recommendedLevel = Number((recommendedSkill || '').replace('p', '')) || Math.min(6, _currentLevel + 1);
  const hasNextLevel = _currentLevel < 6;
  const currentXp = store.get('xp') || 0;

  celebrateCorrect();
  audio.playSfx('levelUp');
  mascot.celebrate(true);

  const skillSummary = getSkillSummary(_sessionSkillAttempts);
  const skillLines = skillSummary.scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => {
      const pct  = Math.round(s.score * 100);
      const fill = pct >= 70 ? 'var(--color-success)' : pct >= 45 ? 'var(--color-warning)' : 'var(--color-error)';
      return `
        <div class="sfq-skill-row">
          <span class="sfq-skill-label">${s.label}</span>
          <div class="sfq-skill-bar-track">
            <div class="sfq-skill-bar-fill" style="width:${pct}%;background:${fill}"></div>
          </div>
          <span class="sfq-skill-pct">${pct}%</span>
        </div>`;
    }).join('');

  const clueAcc = _sessionClueMissionTotal > 0
    ? Math.round((_sessionClueCorrect / _sessionClueMissionTotal) * 100)
    : null;

  const strongestLine = skillSummary.strongest
    ? `<p class="sfq-complete-skill-note">💪 Strongest: <strong>${skillSummary.strongest}</strong></p>` : '';
  const weakestLine = (skillSummary.weakest && skillSummary.weakest !== skillSummary.strongest)
    ? `<p class="sfq-complete-skill-note">📈 To improve: <strong>${skillSummary.weakest}</strong></p>` : '';

  const resultLine = acc >= 90
    ? 'Outstanding sentence smithing!'
    : acc >= 70
    ? 'Great work — keep climbing!'
    : 'Good effort — replay to boost mastery!';

  _container.innerHTML = `
    <div class="sfq-scoreboard-overlay" role="dialog" aria-label="Sentence Forge session summary">
      <div class="sfq-complete">
        <div class="sfq-complete-icon">${icon}</div>
        <h3 class="sfq-complete-title">Session Scoreboard</h3>
        <p class="sfq-complete-sub">${SENTENCE_LEVEL_LABELS[_currentLevel]}</p>
        <div class="sfq-stars" aria-label="${stars} stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <p class="sfq-complete-message">${resultLine}</p>
        <p class="sfq-complete-score">${_sessionCorrect} / ${_sessionTotal} correct · ${acc}%</p>
        <p class="sfq-complete-meta">XP: ${currentXp} · Session XP +${_sessionXpEarned} · Streak bonus +${_sessionStreakBonus}</p>
        <p class="sfq-complete-meta">Recommended next level: <strong>P${recommendedLevel}</strong></p>
        ${clueAcc !== null ? `<p class="sfq-complete-clue">🔍 Clue accuracy: ${clueAcc}%</p>` : ''}

        ${skillLines ? `
          <div class="sfq-skill-summary">
            <h4 class="sfq-skill-summary-title">Sentence Skills This Level</h4>
            ${skillLines}
            ${strongestLine}
            ${weakestLine}
          </div>` : ''}

        <div class="sfq-complete-actions">
          <button class="btn btn--primary btn--lg" id="sfq-replay">Replay Level ↺</button>
          <button class="btn btn--ghost btn--sm" id="sfq-next-level" ${hasNextLevel ? '' : 'disabled'}>${hasNextLevel ? 'Next Level →' : 'No higher level yet'}</button>
          <button class="btn btn--ghost btn--sm" id="sfq-back-levels">Sentence Forge Menu</button>
        </div>
      </div>
    </div>`;

  console.info('[SentenceForge] Scoreboard rendered', {
    correct: _sessionCorrect,
    total: _sessionTotal,
    accuracy: acc,
    stars,
    recommendedLevel,
  });

  document.getElementById('sfq-next-level')?.addEventListener('click', () => {
    if (_currentLevel < 6) { _currentLevel++; _startLevel(_currentLevel); }
  });
  document.getElementById('sfq-replay')?.addEventListener('click', () => _startLevel(_currentLevel));
  document.getElementById('sfq-back-levels')?.addEventListener('click', () => _renderBrowser());

  if (_keyHandler) { document.removeEventListener('keydown', _keyHandler); _keyHandler = null; }
  setTimeout(() => document.getElementById('sfq-replay')?.focus(), 200);
}

// ── Keyboard helper ───────────────────────────────────────────────────────────

function _rebindKeyHandler(onEscape, onEnter) {
  if (_keyHandler) document.removeEventListener('keydown', _keyHandler);
  _keyHandler = (e) => {
    if (e.key === 'Escape') onEscape?.();
    if (e.key === 'Enter' && onEnter) { e.preventDefault(); onEnter(); }
  };
  document.addEventListener('keydown', _keyHandler);
}
