/**
 * Synthesis & Transformation Quest — interactive exercise mode.
 *
 * Architecture mirrors editingQuest.js:
 *   initSynthesisQuest(container, onGoHome)  — mount
 *   showSynthesisBrowser()                   — show level picker
 *   cleanupSynthesisQuest()                  — tear down
 */

import { SYNTHESIS_ITEMS } from '../data/synthesisItems.js';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { audio } from '../modules/audio.js';
import { getLevelInfo } from '../data/curriculum.js';
import { gradeShortAnswer } from './scoring/shortAnswerGrader.js';
import { hasApiKey, gradeSynthesisAnswer, explainTeachBack } from '../modules/aiService.js';
import { diagnoseWrittenAnswer } from '../modules/answerDiagnosis.js';
import { recordMisconception } from '../modules/teacherFeedback.js';
import { attachAskGiriButton } from '../components/askGiriButton.js';

const LEVEL_LABELS = { P4: 'Primary 4', P5: 'Primary 5', P6: 'Primary 6' };
const SESSION_SIZE = 8;
const MAX_TRIES = 2;

// ── Teach-back content per skillKey ─────────────────────────────────────────
const SQ_TEACHBACK = {
  connectorContrast: {
    icon: '⚡',
    rule: 'Contrast connectors join two opposing ideas',
    structure: 'Although/Even though + [clause], [main clause].',
    tip: 'Never use "but" in the same sentence as "although" — they do the same job.',
  },
  connectorResult: {
    icon: '💥',
    rule: '"So…that" and "such…that" express cause and result',
    structure: 'so + [adjective] + that  /  such + a/an + [adjective + noun] + that.',
    tip: 'Use "so" before an adjective alone; use "such" when a noun follows.',
  },
  connectorAddition: {
    icon: '➕',
    rule: '"Not only…but also" links two facts and emphasises both',
    structure: '[Subject] not only [verb phrase 1] but also [verb phrase 2].',
    tip: 'When "not only" starts the sentence, invert subject and auxiliary: "Not only did he…"',
  },
  connectorTime: {
    icon: '⏰',
    rule: '"As soon as" and "no sooner…than" show immediate sequence',
    structure:
      'As soon as [past simple], [past simple].  /  No sooner had [subject] [past participle] than [past simple].',
    tip: '"No sooner had…" uses past perfect. No comma is needed when "as soon as" falls in the middle.',
  },
  connectorCondition: {
    icon: '🔐',
    rule: '"Unless" means "if not"; "provided that" means "on the condition that"',
    structure: '[Main clause] unless [condition].  /  [Main clause] provided that [condition].',
    tip: 'Never pair "unless" with "not" in the same clause — "unless" already contains the negative.',
  },
  activeToPassive: {
    icon: '🔄',
    rule: 'Active → Passive shifts focus from the doer to the receiver',
    structure: '[Object] + was/were + past participle + by + [agent].',
    tip: 'Choose was/were based on the new subject. Drop "by [agent]" if obvious or unimportant.',
  },
  passiveToActive: {
    icon: '🔁',
    rule: 'Passive → Active: the agent becomes the subject, verb returns to active form',
    structure: '[Agent] + [active verb in correct tense] + [original object].',
    tip: 'Remove "was/were…by" and reconstruct the verb in the matching tense.',
  },
  reportedSpeechStatement: {
    icon: '💬',
    rule: 'Reported statements shift tense back and change pronouns and time words',
    structure: '[He/She] said (that) + [back-shifted verb clause].',
    tip: '"Yesterday" → "the day before"; "ago" → "before/earlier"; present → past; past → past perfect.',
  },
  reportedSpeechQuestion: {
    icon: '❓',
    rule: 'Reported questions use statement word order — no inversion, no question mark',
    structure: '[He/She] asked [who/what/whether/if] + [subject] + [verb].',
    tip: 'No auxiliary "do/does/did" after the question word. Use "if/whether" for yes/no questions.',
  },
  reportedSpeechCommand: {
    icon: '📢',
    rule: 'Reported commands use "told/asked + object + to + base verb"',
    structure: '[He/She] told/asked [person] + (not) to + [base verb].',
    tip: 'For negative commands: "told her not to…". Use "asked" for polite requests.',
  },
  relativeClause: {
    icon: '🔗',
    rule: 'Relative clauses add information about a noun using who/which/whose/whom/that',
    structure: '[Main noun] + who/which/whose/that + [relative clause].',
    tip: 'Non-defining clauses (extra info) use commas and cannot use "that". Defining clauses can use "that".',
  },
  comparison: {
    icon: '⚖️',
    rule: 'Comparison: as…as (equal), not as…as (unequal), more/less…than (different degrees)',
    structure:
      '[Subject] is as [adjective] as [comparison].  /  [Subject] is more [adj] than [comparison].',
    tip: '"The more…the more" shows proportional increase. Both halves use the comparative form.',
  },
  advancedConstruction: {
    icon: '🏆',
    rule: 'Fronted negative/emphatic elements require subject-verb inversion',
    structure: '[Never/Seldom/Not until] + [auxiliary] + [subject] + [main verb].',
    tip: '"It was not until…that" and fronted negatives (never/seldom/rarely) all trigger inversion.',
  },
  causativeHave: {
    icon: '🛠️',
    rule: '"Have something done" shows that someone arranged for another person to perform an action',
    structure: '[Subject] + have/had + [object] + past participle.',
    tip: 'The subject does NOT do the action — they arranged for someone else to do it.',
  },
  cleftSentence: {
    icon: '🎯',
    rule: 'Cleft sentences (It was/is…who/that) split a sentence to emphasise one element',
    structure: 'It was/is + [emphasised element] + who/that + [rest of sentence].',
    tip: 'Use "who" for people, "that" for things or ideas. Match "was/is" to the original tense.',
  },
  conditionalType2: {
    icon: '🌀',
    rule: 'Type 2 conditional: imaginary or unlikely present/future situation',
    structure: 'If + [past simple], [would/could/might] + [base verb].',
    tip: 'Use "were" instead of "was" after "if" in formal writing: "If I were you…"',
  },
  conditionalType3: {
    icon: '⏮️',
    rule: 'Type 3 conditional: imaginary past — something that did NOT happen',
    structure: 'If + [past perfect], [would/could/might] + have + [past participle].',
    tip: '"Would have" is most common; "could have" = possibility; "might have" = weaker probability.',
  },
  despiteInSpiteOf: {
    icon: '🧱',
    rule: '"Despite" and "in spite of" show contrast — followed by a noun or -ing form, NOT a full clause',
    structure: 'Despite/In spite of + [noun phrase or -ing form], [main clause].',
    tip: 'Never write "despite of…". When a full clause follows the contrast, use "although/even though" instead.',
  },
};

// ── Module state ─────────────────────────────────────────────────────────────
let _container = null;
let _onGoHome = null;
let _level = null;
let _queue = [];
let _qIdx = 0;
let _tries = 0;
let _sessionStats = null;

function _newStats() {
  return { correct: 0, total: 0, firstTry: 0, bySkill: {} };
}

// ── Public API ────────────────────────────────────────────────────────────────
export function initSynthesisQuest(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function showSynthesisBrowser() {
  if (!_container) return;
  _renderBrowser();
}

export function cleanupSynthesisQuest() {
  if (_container) _container.innerHTML = '';
  _container = null;
  _onGoHome = null;
}

// ── Browser ──────────────────────────────────────────────────────────────────
function _renderBrowser() {
  const levels = ['P4', 'P5', 'P6'];
  const mastery = store.get('questMastery')?.synthesisQuest || {};

  _container.innerHTML = `
    <div class="sq-browser">
      <p class="sq-browser-intro">Choose a level to begin an 8-item session. Items are selected to target your weakest patterns first.</p>
      <div class="sq-level-grid">
        ${levels
          .map((lv) => {
            const items = SYNTHESIS_ITEMS.filter((i) => i.level === lv);
            const skills = [...new Set(items.map((i) => i.skillKey))];
            const masteredCount = skills.filter((s) => (mastery[s] || 0) >= 0.7).length;
            return `
          <button class="sq-level-btn" data-level="${lv}">
            <span class="sq-level-badge">${lv}</span>
            <span class="sq-level-name">${LEVEL_LABELS[lv]}</span>
            <span class="sq-level-meta">${items.length} items · ${skills.length} patterns</span>
            ${masteredCount > 0 ? `<span class="sq-level-progress">${masteredCount}/${skills.length} patterns ≥70%</span>` : ''}
          </button>`;
          })
          .join('')}
      </div>
      <p class="sq-browser-tip">💡 Weak patterns are shown first. After 2 wrong attempts you see the rule and model answer.</p>
    </div>`;

  _container.querySelectorAll('.sq-level-btn').forEach((btn) => {
    btn.addEventListener('click', () => _startLevel(btn.dataset.level));
  });
}

// ── Session ───────────────────────────────────────────────────────────────────
function _startLevel(level) {
  _level = level;
  _sessionStats = _newStats();
  _queue = _buildQueue(level);
  _qIdx = 0;
  _renderQuestion();
}

function _buildQueue(level) {
  const items = SYNTHESIS_ITEMS.filter((i) => i.level === level);
  const scored = items.map((item) => {
    const m = questMastery.getSkillScore('synthesisQuest', item.skillKey) ?? 0.5;
    const noise = (Math.random() - 0.5) * 0.12;
    return { item, score: 1 - m + noise };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, SESSION_SIZE).map((s) => s.item);
}

// ── Question rendering ────────────────────────────────────────────────────────
function _renderQuestion() {
  if (_qIdx >= _queue.length) {
    _renderSummary();
    return;
  }
  const item = _queue[_qIdx];
  _tries = 0;
  const progressPct = Math.round((_qIdx / _queue.length) * 100);

  _container.innerHTML = `
    <div class="sq-game">
      <div class="sfq-header">
        <span class="sfq-badge">✏️ Synthesis — ${_level}</span>
        <span class="sfq-progress">${_qIdx + 1} / ${_queue.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${progressPct}%"></div></div>

      <div class="sq-pattern-chip">${_esc(item.pattern || item.skill)}</div>

      <div class="sq-task-card">
        <p class="sq-task-label">Rewrite without changing the meaning. <small class="sq-task-note">(PSLE format — fill in the blank only)</small></p>
        <p class="sq-original">${_esc(item.original)}</p>
        ${
          item.stem
            ? `
          <div class="sq-psle-prompt" aria-label="Sentence to complete">
            <span class="sq-psle-prefix">${_esc(item.stem)}</span>
            <span class="sq-psle-blank" aria-hidden="true">_______________</span>
          </div>`
            : ''
        }
      </div>

      <div class="sq-input-wrap">
        <label for="sq-answer-input" class="sq-input-label">
          ${item.stem ? 'Type what fills the blank' : 'Type your rewritten sentence'}
        </label>
        <textarea
          id="sq-answer-input"
          class="sq-textarea"
          rows="2"
          placeholder="${item.stem ? 'continue the sentence…' : 'rewrite the sentence…'}"
          autocomplete="off"
          spellcheck="false"
          aria-label="Your answer"
        ></textarea>
        <div class="sq-input-actions">
          <button class="btn btn--primary" id="sq-check">Check ✓</button>
          <button class="btn btn--ghost btn--sm" id="sq-hint-btn">💡 Hint</button>
        </div>
      </div>

      <div id="sq-feedback" class="sfq-feedback" role="status" aria-live="polite" hidden></div>

      <div class="sfq-actions" style="margin-top:var(--space-3)">
        <button class="btn btn--ghost btn--sm" id="sq-quit">Menu</button>
      </div>
    </div>`;

  const textarea = /** @type {HTMLTextAreaElement|null} */ (
    document.getElementById('sq-answer-input')
  );

  document.getElementById('sq-check')?.addEventListener('click', () => _checkAnswer(item));
  textarea?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      _checkAnswer(item);
    }
  });
  document.getElementById('sq-hint-btn')?.addEventListener('click', () => _showHint(item));
  document.getElementById('sq-quit')?.addEventListener('click', () => {
    cleanupSynthesisQuest();
    _onGoHome?.();
  });

  textarea?.focus();
}

// ── Answer checking ───────────────────────────────────────────────────────────
function _normalise(str) {
  return str
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/[.,!?;:]+$/g, '')
    .trim();
}

/**
 * Strip the stem from the front of a candidate answer.
 *
 * PSLE format presents a partial sentence ending in ___ and asks the
 * student to fill ONLY the blank. We accept either form (full sentence
 * or the continuation alone) by maintaining a set of acceptable
 * strings that includes both.
 */
function _stripStem(stem, candidate) {
  if (!stem) return null;
  const ns = _normalise(stem);
  const nc = _normalise(candidate);
  if (!nc.startsWith(ns)) return null;
  // We want the human-readable continuation, not the normalised one,
  // for display. Find the corresponding slice in the original candidate
  // by matching the stem length after trimming.
  const stemLen = stem.trim().length;
  return candidate
    .trim()
    .slice(stemLen)
    .replace(/^[\s,]+/, '')
    .trim();
}

/**
 * Build the acceptable-answer set for an item.
 *
 * Returns every form a marker would award — the full rewritten sentence(s),
 * and (when the answer starts with the stem) the bare continuation. The
 * student is free to type either form.
 */
export function buildAcceptableAnswers(item) {
  const fulls = [item.answer, ...(item.alternates || [])].filter(Boolean);
  const completions = [];
  for (const full of fulls) {
    const c = _stripStem(item.stem, full);
    if (c) completions.push(c);
  }
  // De-dupe by normalised form so the grader doesn't try the same string twice.
  const seen = new Set();
  const all = [];
  for (const s of [...completions, ...fulls]) {
    const k = _normalise(s);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    all.push(s);
  }
  return all;
}

function _grade(typed, item) {
  const accepts = buildAcceptableAnswers(item);
  return gradeShortAnswer(typed, {
    expected: accepts[0] || '',
    accepts: accepts.slice(1),
    // Per-item authored partial-credit support (not used yet — opt-in).
    requiredGroups: Array.isArray(item.requiredGroups) ? item.requiredGroups : null,
  });
}

function _isCorrect(typed, item) {
  return _grade(typed, item).fraction >= 1;
}

async function _checkAnswer(item) {
  const textarea = /** @type {HTMLTextAreaElement|null} */ (
    document.getElementById('sq-answer-input')
  );
  const typed = textarea?.value?.trim() || '';
  if (!typed) {
    _showFeedback('Type your rewritten sentence first.', 'neutral');
    return;
  }

  _tries++;
  const result = _grade(typed, item);
  const localCorrect = result.fraction >= 1;
  const partial = result.fraction > 0 && result.fraction < 1;

  // When local grader says wrong and Gemini key is available, ask Gemini before
  // penalising the student — their wording may be valid even if it differs from
  // the authored alternates.
  if (!localCorrect && hasApiKey()) {
    _showFeedback('✨ Checking with AI…', 'hint');
    const checkBtn = document.getElementById('sq-check');
    if (checkBtn) checkBtn.disabled = true;

    const alts = item.alternates || [];
    const ai = await gradeSynthesisAnswer(
      item.original,
      item.stem || '',
      item.answer,
      alts,
      typed,
      item.skill || item.skillKey,
    );

    if (checkBtn) checkBtn.disabled = false;

    if (ai?.verdict === 'CORRECT') {
      _recordOutcome(item, true, typed);
      return;
    }
    if (ai?.verdict === 'PARTIAL') {
      _recordOutcome(item, false);
      const tb = SQ_TEACHBACK[item.skillKey];
      const structureHint = tb?.structure
        ? `Structure: ${tb.structure}`
        : `Use the "${item.pattern || item.skill}" pattern.`;
      const aiFb = ai.feedback ? ` ${ai.feedback}` : '';
      _showFeedback(`◐ Almost!${aiFb} ${structureHint}`, 'hint');
      if (textarea) textarea.value = '';
      textarea?.focus();
      return;
    }
    // WRONG or null — fall through to normal wrong handling
  }

  if (localCorrect) {
    _recordOutcome(item, true, typed);
    return;
  }

  _recordOutcome(item, false);

  if (_tries >= MAX_TRIES) {
    _showTeachBackOverlay(
      item,
      () => {
        _qIdx++;
        _renderQuestion();
      },
      typed,
    );
    return;
  }

  const tb = SQ_TEACHBACK[item.skillKey];
  const structureHint = tb?.structure
    ? `Structure: ${tb.structure}`
    : `Use the "${item.pattern || item.skill}" pattern.`;
  if (partial) {
    const pct = Math.round(result.fraction * 100);
    const hits = result.trace?.hits || [];
    const misses = result.trace?.misses || [];
    const hitText = hits.length ? ` ✓ ${hits.join(', ')}` : '';
    const missText = misses.length ? ` ✗ still need: ${misses.join(', ')}` : '';
    _showFeedback(`◐ Partial (${pct}% structure). ${structureHint}${hitText}${missText}`, 'hint');
  } else {
    const diagnosis = _diagnoseRewrite(item, typed);
    _showFeedback(`Not yet. ${diagnosis.misconception.cue} ${structureHint}`, 'error');
  }
  // Leave the sentence in the box. Revising your own draft is the skill this
  // mode teaches; wiping it makes the child start from a blank page instead.
  textarea?.focus();
  textarea?.select();
}

/**
 * The words a rewrite must contain to count as using the pattern asked for —
 * the given opening ("No sooner…") plus any authored required group.
 * @param {object} item
 * @returns {string[]}
 */
function _requiredWordsFor(item) {
  const opening = String(item.stem || '').trim();
  if (!opening) return [];
  return opening.split(/\s+/).filter(Boolean);
}

/** Diagnose a rewrite against the model answer. */
function _diagnoseRewrite(item, typed) {
  return diagnoseWrittenAnswer({
    given: typed,
    model: item.answer,
    stem: item.original || '',
    requiredWords: _requiredWordsFor(item),
    domain: 'writing',
  });
}

function _recordOutcome(item, correct, typed) {
  audio.playSfx(correct ? 'correct' : 'wrong');

  // Score the first attempt only. This used to run on every try, so an item
  // the child solved on the second attempt was recorded as one wrong AND one
  // right — two attempts against a single question. The retry is a teaching
  // move; the mark belongs to the first answer.
  if (_tries === 1) {
    const sk = _sessionStats.bySkill[item.skillKey] || { correct: 0, total: 0, label: item.skill };
    sk.total++;
    _sessionStats.total++;
    questMastery.recordAttempt({
      quest: 'synthesisQuest',
      skill: item.skillKey,
      correct,
      level: _level,
    });
    if (correct) {
      sk.correct++;
      _sessionStats.correct++;
      _sessionStats.firstTry++;
    }
    _sessionStats.bySkill[item.skillKey] = sk;
    questMastery.updateSkill('synthesisQuest', item.skillKey, correct);
  }

  if (correct && typed !== undefined) _showSuccessCard(item, typed);
}

function _showHint(item) {
  const tb = SQ_TEACHBACK[item.skillKey];
  _showFeedback(
    `💡 ${tb?.tip || `Begin your sentence with: "${item.stem || item.pattern}"`}`,
    'hint',
  );
}

function _showFeedback(msg, type) {
  const fb = document.getElementById('sq-feedback');
  if (!fb) return;
  fb.hidden = false;
  fb.className = `sfq-feedback${
    type === 'error' ? ' sfq-feedback--error' : type === 'hint' ? ' sfq-feedback--hint' : ''
  }`;
  fb.textContent = msg;
}

// ── Success card (overlay on top of question) ─────────────────────────────────
function _showSuccessCard(item, typed) {
  const game = _container.querySelector('.sq-game');
  if (!game) return;
  const stars = _tries === 1 ? '⭐⭐' : '⭐';
  const overlay = document.createElement('div');
  overlay.className = 'sq-success-overlay';
  // Show how the student's continuation fits with the given stem so they see
  // the complete PSLE-formatted sentence, not just the blank-fill in isolation.
  const stitched = item.stem ? `${item.stem} ${typed.trim()}` : typed.trim();
  overlay.innerHTML = `
    <div class="sq-success-card">
      <div class="sq-success-icon">✅</div>
      <h4 class="sq-success-heading">${stars} Correct!</h4>
      ${item.stem ? `<p class="sq-success-stitched"><strong>Full sentence:</strong> <em>${_esc(stitched)}</em></p>` : `<p class="sq-success-your-answer"><em>${_esc(typed)}</em></p>`}
      <p class="sq-success-explain">${_esc(item.explain)}</p>
      ${
        item.alternates?.length
          ? `<p class="sq-success-alts"><strong>Also accepted:</strong> ${item.alternates.map((a) => `<em>${_esc(a)}</em>`).join('; ')}</p>`
          : ''
      }
      <button class="btn btn--primary sq-success-next">Next →</button>
    </div>`;
  game.appendChild(overlay);
  overlay.querySelector('.sq-success-next').addEventListener('click', () => {
    overlay.remove();
    _qIdx++;
    _renderQuestion();
  });
}

// ── Teach-back overlay (after 2 wrong) ───────────────────────────────────────
function _showTeachBackOverlay(item, onContinue, typed = '') {
  const tb = SQ_TEACHBACK[item.skillKey] || {
    icon: '📘',
    rule: item.skill,
    structure: '',
    tip: '',
  };
  const game = _container.querySelector('.sq-game');
  if (!game) {
    onContinue();
    return;
  }

  // Name the slip and log it, so a rewrite that ignores the given opening
  // reads as the same habit whether it happens here or in a practice paper.
  const diagnosis = typed ? _diagnoseRewrite(item, typed) : null;
  if (diagnosis) {
    recordMisconception(diagnosis.id, { skill: item.skillKey, mode: 'synthesisQuest' });
  }

  const overlay = document.createElement('div');
  overlay.className = 'eq-teachback-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Grammar pattern explanation');
  overlay.innerHTML = `
    <div class="eq-teachback-card">
      <div class="eq-teachback-icon">${tb.icon}</div>
      <h4 class="eq-teachback-heading">Let's learn this pattern</h4>
      <p class="eq-teachback-rule">${_esc(tb.rule)}</p>
      ${tb.structure ? `<div class="eq-teachback-example"><strong>Structure:</strong> ${_esc(tb.structure)}</div>` : ''}
      ${tb.tip ? `<p class="eq-teachback-tip">💡 <strong>Remember:</strong> ${_esc(tb.tip)}</p>` : ''}
      <div class="eq-teachback-answer">✅ Model answer: <strong>${_esc(item.answer)}</strong></div>
      ${
        item.alternates?.length
          ? `<p class="eq-teachback-explanation">Also accepted: ${item.alternates.map((a) => `<em>${_esc(a)}</em>`).join('; ')}</p>`
          : ''
      }
      <p class="eq-teachback-explanation">${_esc(item.explain)}</p>
      ${
        diagnosis
          ? `<p class="eq-teachback-noticed">👀 Your sentence — that is ${_esc(diagnosis.misconception.childName)}.</p>
      <p class="eq-teachback-nexttime">🧭 <strong>Next time:</strong> ${_esc(diagnosis.misconception.selfCheck)}</p>`
          : ''
      }
      <button class="btn btn--primary eq-teachback-continue">Got it — Continue</button>
    </div>`;

  game.appendChild(overlay);

  if (typed) {
    attachAskGiriButton(overlay.querySelector('.eq-teachback-card'), () =>
      explainTeachBack({
        skillLabel: item.skill || item.skillKey,
        exercise: `Rewrite: "${item.original}"${item.stem ? ` starting with "${item.stem}"` : ''}`,
        studentAnswer: typed,
        correctAnswer: item.answer,
        level: _level,
      }),
    );
  }

  overlay.querySelector('.eq-teachback-continue').addEventListener('click', () => {
    overlay.remove();
    onContinue();
  });
}

// ── Session summary ───────────────────────────────────────────────────────────
function _renderSummary() {
  const { correct, total, firstTry, bySkill } = _sessionStats;
  const accuracy = total > 0 ? correct / total : 0;
  const firstTryRate = total > 0 ? firstTry / total : 0;
  const stars = accuracy >= 0.9 && firstTryRate >= 0.7 ? 3 : accuracy >= 0.7 ? 2 : 1;
  const xpGain = Math.round(30 + correct * 8 + (stars - 1) * 10);

  const xp = (store.get('xp') || 0) + xpGain;
  const levelInfo = getLevelInfo(xp);
  store.patch({ xp, level: levelInfo.level });

  const skillsSorted = Object.entries(bySkill).sort(
    (a, b) => a[1].correct / Math.max(a[1].total, 1) - b[1].correct / Math.max(b[1].total, 1),
  );

  const skillRows = skillsSorted
    .map(([key, s]) => {
      const pct = Math.round((s.correct / Math.max(s.total, 1)) * 100);
      const label = SQ_TEACHBACK[key]?.rule?.split(':')[0]?.split('—')[0]?.trim() || key;
      const barColour =
        pct >= 70
          ? 'var(--color-success)'
          : pct >= 40
            ? 'var(--color-primary)'
            : 'var(--color-error)';
      return `
      <div class="sq-skill-row">
        <span class="sq-skill-name">${_esc(label)}</span>
        <div class="sq-skill-track"><div class="sq-skill-bar" style="width:${pct}%;background:${barColour}"></div></div>
        <span class="sq-skill-pct">${pct}%</span>
      </div>`;
    })
    .join('');

  const weakSkill = skillsSorted[0];
  const focusTip =
    weakSkill && weakSkill[1].correct / Math.max(weakSkill[1].total, 1) < 0.7
      ? `Review the "${SQ_TEACHBACK[weakSkill[0]]?.rule?.split(':')[0]?.trim() || weakSkill[0]}" pattern.`
      : 'Great work — try the next level!';

  _container.innerHTML = `
    <div class="sq-game">
      <div class="sq-summary">
        <h3 class="sq-summary-title">🎉 Session Complete ${'⭐'.repeat(stars)}</h3>
        <div class="sq-summary-stats">
          <div class="sq-stat-chip"><span class="sq-stat-val">${correct}/${total}</span><span class="sq-stat-lbl">Correct</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">${(accuracy * 100).toFixed(0)}%</span><span class="sq-stat-lbl">Accuracy</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">${(firstTryRate * 100).toFixed(0)}%</span><span class="sq-stat-lbl">First try</span></div>
          <div class="sq-stat-chip"><span class="sq-stat-val">+${xpGain}</span><span class="sq-stat-lbl">XP</span></div>
        </div>
        ${skillRows ? `<h4 class="sq-skills-heading">Skills breakdown</h4><div class="sq-skills-list">${skillRows}</div>` : ''}
        <p class="sq-focus-tip">📌 Focus next: ${_esc(focusTip)}</p>
        <div class="sfq-actions">
          <button class="btn btn--primary" id="sq-retry">Try another set →</button>
          <button class="btn btn--ghost btn--sm" id="sq-home">Back to levels</button>
        </div>
      </div>
    </div>`;

  document.getElementById('sq-retry')?.addEventListener('click', () => _startLevel(_level));
  document.getElementById('sq-home')?.addEventListener('click', () => showSynthesisBrowser());
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function _esc(str) {
  return String(str ?? '').replace(
    /[<>&"']/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c],
  );
}
