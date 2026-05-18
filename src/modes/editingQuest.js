import { EDITING_LEVELS, editingPassages } from '../data/editingPassages.js';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { audio } from '../modules/audio.js';
import { getLevelInfo } from '../data/curriculum.js';

// ── Error-specific teach-back content ────────────────────────────────────────
// Keyed by error.rule (specific) then error.type (grammar|spelling) as fallback.
const EDITING_TEACHBACK = {
  // Grammar rules
  svAgreement: {
    icon: '👥',
    rule: 'Subject-verb agreement: singular subjects use singular verbs (adds -s); plural subjects use plural verbs.',
    example: '"The dog runs fast." (singular) — "The dogs run fast." (plural)',
    tip: 'Swap the subject with he/she/it — if that sounds right, the verb needs -s.',
  },
  tense: {
    icon: '⏱️',
    rule: 'Tense shows WHEN something happens. Look for time clues (yesterday, now, soon) to choose the right tense.',
    example: '"Yesterday, she walked home." — "Right now, he is running." — "Tomorrow, we will leave."',
    tip: 'Find the time word first — it tells you which tense belongs in the sentence.',
  },
  articles: {
    icon: '📖',
    rule: 'Use "a" before consonant sounds and "an" before vowel sounds (a, e, i, o, u).',
    example: '"a cat" · "a house" · "an egg" · "an umbrella"',
    tip: 'Say the next word out loud. Does it start with a vowel SOUND? Use "an". Otherwise use "a".',
  },
  prepositions: {
    icon: '📍',
    rule: 'Prepositions link nouns to the rest of the sentence. Common ones: in, on, at, by, with, for, from, to.',
    example: '"She is AT school." — "He sat ON the chair." — "They arrived IN the morning."',
    tip: 'Read the full phrase. Ask: WHERE, WHEN, or HOW? That determines the preposition.',
  },
  pronouns: {
    icon: '🙋',
    rule: 'A pronoun replaces a noun. Subject: I, he, she, they. Object: me, him, her, them.',
    example: '"Tom helped me." (object) — "He helped Tom." (subject)',
    tip: 'Is the pronoun doing the action (subject) or receiving it (object)? Different forms for each.',
  },
  modals: {
    icon: '🛡️',
    rule: 'Modal verbs (can, could, should, must, will, would) come before the base verb — no "to" needed.',
    example: '"She should go." ✓ — "She should to go." ✗',
    tip: 'After a modal, always use the BASE form of the verb (no -s, no -ing, no -ed).',
  },
  connectors: {
    icon: '🔗',
    rule: 'Connectors join ideas. Each type has a different meaning: contrast (but/although), reason (because/since), result (so).',
    example: '"She was tired, SO she rested." — "Although it rained, they played."',
    tip: 'What is the relationship between the two ideas? That relationship tells you which connector fits.',
  },
  // Spelling rules
  doubling: {
    icon: '✏️',
    rule: 'Double the final consonant before adding -ing or -ed to short vowel + consonant words.',
    example: '"run" → "running" · "hop" → "hopped" · "big" → "bigger"',
    tip: 'Check if the word is short vowel + consonant. If so, double the consonant before the suffix.',
  },
  spelling: {
    icon: '🔤',
    rule: 'English spelling often follows patterns. Check vowel pairs, silent letters, and suffix rules.',
    example: '"receive" (i before e except after c) · "necessary" (one c, double s) · "beautiful" (beauty + ful)',
    tip: 'Break the word into syllables. Say each part. Does it match a pattern you know?',
  },
  quantifiers: {
    icon: '🔢',
    rule: 'Use "many/few" with countable nouns and "much/little" with uncountable nouns.',
    example: '"many books" · "few apples" · "much water" · "little sugar"',
    tip: 'Ask: can I count it? If yes → many/few. If not → much/little.',
  },
  comparatives: {
    icon: '📏',
    rule: 'Comparative adjectives compare two things. Short adjectives add -er; long ones use "more".',
    example: '"taller than" · "more expensive than" · "better than" (irregular)',
    tip: 'Two syllables or more? Use "more + adjective". One syllable? Add "-er". Check irregular forms: good → better, bad → worse.',
  },
  conjunctions: {
    icon: '🔗',
    rule: 'Coordinating conjunctions (and, but, or, so) join equal clauses; subordinating (because, although, when) join unequal ones.',
    example: '"She was tired, so she rested." — "Although it rained, they played."',
    tip: 'The conjunction shows the logical link: reason (because), contrast (although/but), result (so), addition (and).',
  },
  // Fallbacks by type
  grammar: {
    icon: '📘',
    rule: 'Grammar errors are about how words work together — tense, agreement, articles, or word order.',
    example: '"She have finished." ✗ → "She has finished." ✓',
    tip: 'Read the sentence aloud slowly. If one part sounds wrong, that is usually the grammar error.',
  },
};

let _container = null;
let _onGoHome = null;
let _level = 1;
let _idx = 0;
let _list = [];
let _errorIndex = 0;
let _passageStats = _newPassageStats();
let _sessionStats = _newSessionStats();
let _attemptState = _newAttemptState();

function _newPassageStats() {
  return {
    grammarCorrect: 0,
    spellingCorrect: 0,
    firstTryCorrect: 0,
    totalAttempts: 0,
  };
}

function _newSessionStats() {
  return {
    passagesCompleted: 0,
    errorsAttempted: 0,
    errorsCorrect: 0,
    firstTryCorrect: 0,
    hintsUsed: 0,
    revealsUsed: 0,
    accuracyByType: { grammar: { correct: 0, total: 0 }, spelling: { correct: 0, total: 0 } },
  };
}

function _newAttemptState() {
  return {
    selectedType: null,
    tries: 0,
    hinted: false,
  };
}

export function initEditingQuest(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function showEditingBrowser() {
  if (!_container) return;
  const completed = store.get('editingCompleted') || {};
  _container.innerHTML = `
    <div class="sfq-browser"><div class="sfq-browser-grid">
      ${Object.entries(EDITING_LEVELS).map(([k, label]) => {
        const total = (editingPassages[k] || []).length;
        const done = completed[k] || 0;
        return `<button class="sfq-level-btn" data-level="${k}">
          <span class="sfq-level-icon">✏️</span>
          <span class="sfq-level-name">${label}</span>
          <span class="sfq-level-count">${Math.min(done, total)} / ${total}</span>
        </button>`;
      }).join('')}
    </div></div>`;

  _container.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', () => _startLevel(Number(btn.dataset.level)));
  });
}

function _startLevel(level) {
  _level = level;
  _sessionStats = _newSessionStats();
  _list = _prioritisePassages(editingPassages[level] || []);
  _idx = 0;
  _renderCurrentPassage();
}

function _prioritisePassages(passages) {
  const scored = passages.map((item) => {
    const weaknesses = item.errors.reduce((sum, error) => {
      const mastery = questMastery.getSkillScore('editingQuest', error.rule || error.type);
      return sum + (1 - mastery);
    }, 0);
    return { item, score: weaknesses / Math.max(item.errors.length, 1) };
  });
  return scored.sort((a, b) => b.score - a.score).map(s => s.item);
}

function _renderCurrentPassage() {
  if (_idx >= _list.length) return _renderComplete();
  _errorIndex = 0;
  _passageStats = _newPassageStats();
  _renderErrorStep();
}

function _renderErrorStep() {
  const item = _list[_idx];
  const error = item.errors[_errorIndex];
  if (!error) {
    _finishPassage(item);
    return;
  }

  _attemptState = _newAttemptState();
  const totalErrors = item.errors.length;
  const progressPct = Math.round(((_errorIndex + 1) / totalErrors) * 100);

  _container.innerHTML = `
    <div class="sfq-game">
      <div class="sfq-header">
        <span class="sfq-badge">✏️ ${EDITING_LEVELS[_level]}</span>
        <span class="sfq-progress">Passage ${_idx + 1} / ${_list.length}</span>
      </div>
      <h3 class="cloze-title">${item.title}</h3>
      <p class="sq-phase-label">PSLE-style editing: item ${_errorIndex + 1} of ${totalErrors}</p>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${progressPct}%"></div></div>
      <p class="cloze-passage"><strong>${item.paragraph}</strong></p>

      <div class="sq-question-card">
        <p class="sq-question-text">Target word: <strong>${error.token}</strong></p>
        <p class="dash-pattern-item">Step 1: Choose error type</p>
        <div class="sfq-bank" id="eq-type-bank">
          <button class="sfq-word-chip" data-type="grammar">Grammar</button>
          <button class="sfq-word-chip" data-type="spelling">Spelling</button>
        </div>
      </div>

      <div id="eq-correction-wrap" hidden>
        <p class="dash-pattern-item">Step 2: Enter correction</p>
        <input id="eq-correction-input" class="cp-name-input" placeholder="Type corrected word/phrase" />
        <div class="sfq-actions" style="margin-top:8px">
          <button class="btn btn--primary" id="eq-submit-correction">Submit correction</button>
          <button class="btn btn--ghost btn--sm" id="eq-hint">Hint</button>
          <button class="btn btn--ghost btn--sm" id="eq-reveal">Reveal</button>
        </div>
      </div>

      <details style="margin-top:8px"><summary>Grammar rules quick reference</summary>
        <ul>
          <li>Subject-verb agreement: singular subject → singular verb.</li>
          <li>Tense consistency: follow time markers (yesterday, last week).</li>
          <li>Prepositions: choose by meaning and collocation.</li>
          <li>Spelling: check doubled consonants and vowel patterns.</li>
        </ul>
      </details>

      <div class="sfq-feedback" id="eq-feedback" role="status" aria-live="polite" hidden></div>
      <div class="dash-pattern-item">💡 Try This! Tier 1: ${item.tryThis?.[0] || 'Write one corrected sentence.'}</div>
      <div class="dash-pattern-item">🚀 Try This! Tier 2: ${item.tryThis?.[1] || 'Explain one rule to a classmate.'}</div>

      <div class="sfq-actions">
        <button class="btn btn--ghost btn--sm" id="eq-quit">Menu</button>
      </div>
    </div>`;

  const typeButtons = Array.from(document.querySelectorAll('#eq-type-bank .sfq-word-chip'));
  const correctionWrap = document.getElementById('eq-correction-wrap');

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      _attemptState.selectedType = btn.dataset.type;
      typeButtons.forEach(b => b.classList.toggle('sfq-word-chip--used', b === btn));
      if (correctionWrap) correctionWrap.hidden = false;
    });
  });

  document.getElementById('eq-submit-correction')?.addEventListener('click', () => {
    const typed = /** @type {HTMLInputElement|null} */ (document.getElementById('eq-correction-input'))?.value?.trim() || '';
    _submitError(item, error, _attemptState.selectedType, typed);
  });

  document.getElementById('eq-hint')?.addEventListener('click', () => {
    if (_attemptState.hinted) return;
    _attemptState.hinted = true;
    _sessionStats.hintsUsed++;
    const fb = document.getElementById('eq-feedback');
    if (!fb) return;
    fb.hidden = false;
    fb.className = 'sfq-feedback';
    const firstLetter = error.correction?.[0] || '';
    fb.textContent = `Hint: this is a ${error.type} item. Correct answer starts with "${firstLetter}".`;
  });

  document.getElementById('eq-reveal')?.addEventListener('click', function handler() {
    this.removeEventListener('click', handler);
    this.disabled = true;
    _sessionStats.revealsUsed++;
    _showFeedback(`🧩 Reveal: ${error.correction}. ${error.explanation}`, false);
    _registerAttempt(error, false, true);
    setTimeout(() => {
      _errorIndex++;
      _renderErrorStep();
    }, 900);
  });

  document.getElementById('eq-quit')?.addEventListener('click', () => {
    cleanupEditingQuest();
    _onGoHome?.();
  });
}

function _showFeedback(message, success) {
  const fb = document.getElementById('eq-feedback');
  if (!fb) return;
  fb.hidden = false;
  fb.className = `sfq-feedback sfq-feedback--${success ? 'success' : 'error'}`;
  fb.textContent = message;
}

function _registerAttempt(error, correct, forcedAdvance = false) {
  _passageStats.totalAttempts++;
  _sessionStats.errorsAttempted++;
  const typeBucket = _sessionStats.accuracyByType[error.type];
  if (typeBucket) typeBucket.total++;

  if (correct) {
    _sessionStats.errorsCorrect++;
    if (typeBucket) typeBucket.correct++;
    if (_attemptState.tries === 0) {
      _passageStats.firstTryCorrect++;
      _sessionStats.firstTryCorrect++;
    }
    if (error.type === 'grammar') _passageStats.grammarCorrect++;
    if (error.type === 'spelling') _passageStats.spellingCorrect++;
  }

  questMastery.updateSkill('editingQuest', error.rule || error.type, correct);
  questMastery.recordAttempt({ quest: 'editingQuest', skill: error.rule || error.type, correct, level: _level });

  store.recordLearningEvent?.({
    eventType: forcedAdvance ? 'editing_reveal' : 'editing_attempt',
    quest: 'editingQuest',
    skill: error.rule || error.type,
    correct,
    level: _level,
    meta: { tries: _attemptState.tries + 1, hinted: _attemptState.hinted, errorType: error.type },
  });
}

function _submitError(item, error, selectedType, typedCorrection) {
  if (!selectedType || !typedCorrection) {
    _showFeedback('Choose error type and enter a correction first.', false);
    return;
  }

  const accepted = error.accepted || [error.correction];
  const typeCorrect = selectedType === error.type;
  const correctionCorrect = accepted.some(a => a.toLowerCase() === typedCorrection.toLowerCase());
  const correct = typeCorrect && correctionCorrect;
  _attemptState.tries++;

  _registerAttempt(error, correct);

  if (correct) {
    _showFeedback(`✅ Correct (${error.type}). ${error.explanation}`, true);
    audio.playSfx('correct');
    setTimeout(() => {
      _errorIndex++;
      _renderErrorStep();
    }, 850);
    return;
  }

  audio.playSfx('wrong');
  const attemptsLeft = Math.max(0, 2 - _attemptState.tries);
  if (_attemptState.tries >= 2) {
    _showEditingTeachBackOverlay(error, () => {
      _errorIndex++;
      _renderErrorStep();
    });
    return;
  }

  _showFeedback(`❌ Not yet. Type: ${error.type}. Try again (${attemptsLeft} attempt left).`, false);

  const input = /** @type {HTMLInputElement|null} */ (document.getElementById('eq-correction-input'));
  if (input) input.value = '';
}

function _showEditingTeachBackOverlay(error, onContinue) {
  const tb = EDITING_TEACHBACK[error.rule] || EDITING_TEACHBACK[error.type] || EDITING_TEACHBACK.grammar;
  const game = _container.querySelector('.sfq-game');
  if (!game) { onContinue(); return; }

  const overlay = document.createElement('div');
  overlay.className = 'eq-teachback-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Grammar rule explanation');
  overlay.innerHTML = `
    <div class="eq-teachback-card">
      <div class="eq-teachback-icon">${tb.icon}</div>
      <h4 class="eq-teachback-heading">Let's learn this rule</h4>
      <p class="eq-teachback-rule">${tb.rule}</p>
      <div class="eq-teachback-example">${tb.example}</div>
      <p class="eq-teachback-tip">💡 <strong>Quick tip:</strong> ${tb.tip}</p>
      <div class="eq-teachback-answer">✅ Correct answer: <strong>${error.correction}</strong></div>
      <p class="eq-teachback-explanation">${error.explanation}</p>
      <button class="btn btn--primary eq-teachback-continue">Got it — Continue</button>
    </div>`;

  game.appendChild(overlay);
  overlay.querySelector('.eq-teachback-continue').addEventListener('click', () => {
    overlay.remove();
    onContinue();
  });
}

function _calculateStars(accuracy, firstTryRate) {
  if (accuracy >= 0.9 && firstTryRate >= 0.7) return 3;
  if (accuracy >= 0.75) return 2;
  return 1;
}

function _finishPassage(item) {
  const totalGrammar = item.errors.filter(e => e.type === 'grammar').length;
  const totalSpelling = item.errors.filter(e => e.type === 'spelling').length;
  const correctTotal = _passageStats.grammarCorrect + _passageStats.spellingCorrect;
  const accuracy = correctTotal / Math.max(item.errors.length, 1);
  const firstTryRate = _passageStats.firstTryCorrect / Math.max(item.errors.length, 1);
  const stars = _calculateStars(accuracy, firstTryRate);
  const xpGain = Math.round((item.xp || 50) * (0.6 + (accuracy * 0.4)) + (stars - 1) * 6);

  const xp = (store.get('xp') || 0) + xpGain;
  const levelInfo = getLevelInfo(xp);
  store.patch({ xp, level: levelInfo.level });

  _sessionStats.passagesCompleted++;

  _container.innerHTML = `
    <div class="sfq-game">
      <h3>✅ Passage complete ${'⭐'.repeat(stars)}</h3>
      <p>Grammar: ${_passageStats.grammarCorrect}/${totalGrammar} · Spelling: ${_passageStats.spellingCorrect}/${totalSpelling}</p>
      <p>First-try accuracy: ${(firstTryRate * 100).toFixed(0)}% · Total attempts: ${_passageStats.totalAttempts}</p>
      <p>XP earned: +${xpGain}</p>
      <p class="dash-pattern-item">📘 Focus next: ${_recommendFocusArea()}.</p>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="eq-next-passage">Next passage →</button>
        <button class="btn btn--ghost btn--sm" id="eq-retry-passage">Retry passage</button>
      </div>
    </div>`;

  document.getElementById('eq-next-passage')?.addEventListener('click', () => {
    _idx++;
    _renderCurrentPassage();
  });
  document.getElementById('eq-retry-passage')?.addEventListener('click', () => {
    _renderCurrentPassage();
  });
}

function _recommendFocusArea() {
  const grammar = _sessionStats.accuracyByType.grammar;
  const spelling = _sessionStats.accuracyByType.spelling;
  const grammarRate = grammar.correct / Math.max(grammar.total, 1);
  const spellingRate = spelling.correct / Math.max(spelling.total, 1);
  return grammarRate < spellingRate ? 'grammar consistency and tense control' : 'spelling patterns and proofreading';
}

function _renderComplete() {
  const completed = { ...(store.get('editingCompleted') || {}) };
  completed[_level] = Math.max(completed[_level] || 0, _list.length);
  store.set('editingCompleted', completed);

  const accuracy = _sessionStats.errorsCorrect / Math.max(_sessionStats.errorsAttempted, 1);
  const firstTryRate = _sessionStats.firstTryCorrect / Math.max(_sessionStats.errorsAttempted, 1);
  const stars = _calculateStars(accuracy, firstTryRate);

  // Build per-rule mastery rows from questMastery
  const rulesEncountered = [...new Set(_list.flatMap(p => p.errors.map(e => e.rule || e.type)))];
  const ruleRows = rulesEncountered.map(rule => {
    const score = questMastery.getSkillScore('editingQuest', rule) ?? 0.5;
    const pct = Math.round(score * 100);
    const tb = EDITING_TEACHBACK[rule];
    const label = tb ? `${tb.icon} ${rule}` : rule;
    const barColour = pct >= 70 ? 'var(--color-success)' : pct >= 40 ? 'var(--color-primary)' : 'var(--color-error)';
    return `
      <div class="sq-skill-row">
        <span class="sq-skill-name">${label}</span>
        <div class="sq-skill-track"><div class="sq-skill-bar" style="width:${pct}%;background:${barColour}"></div></div>
        <span class="sq-skill-pct">${pct}%</span>
      </div>`;
  }).join('');

  const grammarTotal = _sessionStats.accuracyByType.grammar.total;
  const grammarCorrect = _sessionStats.accuracyByType.grammar.correct;
  const spellingTotal = _sessionStats.accuracyByType.spelling.total;
  const spellingCorrect = _sessionStats.accuracyByType.spelling.correct;

  _container.innerHTML = `
    <div class="sfq-game">
      <h3>🎉 Editing Quest Complete ${'⭐'.repeat(stars)}</h3>
      <div class="sq-summary-stats">
        <div class="sq-stat-chip"><span class="sq-stat-val">${_sessionStats.errorsCorrect}/${_sessionStats.errorsAttempted}</span><span class="sq-stat-lbl">Correct</span></div>
        <div class="sq-stat-chip"><span class="sq-stat-val">${(accuracy * 100).toFixed(0)}%</span><span class="sq-stat-lbl">Accuracy</span></div>
        <div class="sq-stat-chip"><span class="sq-stat-val">${(firstTryRate * 100).toFixed(0)}%</span><span class="sq-stat-lbl">First try</span></div>
        <div class="sq-stat-chip"><span class="sq-stat-val">${_sessionStats.passagesCompleted}</span><span class="sq-stat-lbl">Passages</span></div>
      </div>
      <div class="eq-type-breakdown">
        <span>📘 Grammar: ${grammarCorrect}/${grammarTotal}</span>
        <span>🔤 Spelling: ${spellingCorrect}/${spellingTotal}</span>
        <span>💡 Hints: ${_sessionStats.hintsUsed} · 🧩 Reveals: ${_sessionStats.revealsUsed}</span>
      </div>
      ${ruleRows ? `<h4 class="sq-skills-heading">Rule mastery (lifetime)</h4><div class="sq-skills-list">${ruleRows}</div>` : ''}
      <p class="sq-focus-tip">📌 Focus next: ${_recommendFocusArea()}.</p>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="eq-back">Back to Levels</button>
        <button class="btn btn--ghost btn--sm" id="eq-replay">Replay Level</button>
      </div>
    </div>`;

  document.getElementById('eq-back')?.addEventListener('click', showEditingBrowser);
  document.getElementById('eq-replay')?.addEventListener('click', () => _startLevel(_level));
}

export function cleanupEditingQuest() {
  if (_container) _container.innerHTML = '';
}
