/**
 * PhonicsQuest – Primary Quick Check (Diagnostic)
 *
 * The roadmap's B1 — a brief 6-question diagnostic for new primary
 * (P1–P6) profiles. Today's primary placement path skips placement
 * entirely and seeds maxed defaults, so `questMastery` and
 * `questAttempts` start empty and Today's Mission / Mistakes Den /
 * the parent dashboard have nothing to show until the child plays a
 * few rounds in each module.
 *
 * The Quick Check fixes that by sampling three grammar categories and
 * three vocab categories from the grade-aligned banks, then routing
 * answers through `questMastery.updateSkill` + `questMastery.recordAttempt`
 * so every downstream surface (Today's Mission, Mistakes Den, Personal
 * Best Wall, parent dashboard) has signal from day one.
 *
 * Charter-safe:
 *   - Optional / skippable — never blocks access to the app
 *   - Never re-runs without consent (the home offers a Re-take button
 *     only when the parent / teacher explicitly asks)
 *   - No red, no buzzer, no "you failed the diagnostic"
 *   - Frames itself as "let me get to know you" — not as a test
 */

import { GRAMMAR_MCQ_ITEMS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS } from '../data/vocabMcq.js';
import { questMastery } from './questMastery.js';

/** Number of items per domain (grammar + vocab). 3 each → 6 total ≈ 5 minutes. */
export const QUICK_CHECK_PER_DOMAIN = 3;

/**
 * Build a Quick Check item list for the given grade.
 * Picks the first item of the top N categories per domain so coverage
 * is broad and the choice is deterministic across reloads.
 *
 * @param {string} grade — 'P1'..'P6'
 * @returns {{
 *   grade: string,
 *   items: Array<{
 *     source: 'grammarMcq'|'vocabMcq',
 *     category: string,
 *     subskill: string,
 *     q: string,
 *     choices: string[],
 *     answer: string,
 *     explain: string,
 *   }>,
 * }}
 */
export function buildPrimaryQuickCheck(grade) {
  const normalised = _normaliseGrade(grade);
  const grammar = _pickPerCategory(
    GRAMMAR_MCQ_ITEMS[normalised] || [],
    QUICK_CHECK_PER_DOMAIN,
    'grammarMcq',
  );
  const vocab = _pickPerCategory(
    VOCAB_MCQ_ITEMS[normalised] || [],
    QUICK_CHECK_PER_DOMAIN,
    'vocabMcq',
  );
  return {
    grade: normalised,
    items: [...grammar, ...vocab],
  };
}

/**
 * Apply Quick Check results. Records each answer via the questMastery
 * service so all downstream surfaces (Today's Mission, dashboard,
 * Mistakes Den, Personal Best Wall) pick up signal immediately.
 *
 * Returns a summary the UI can render in a closing celebration card.
 *
 * @param {Array<{
 *   source: 'grammarMcq'|'vocabMcq', category: string, correct: boolean,
 * }>} answers
 * @returns {{
 *   total: number, correct: number, accuracy: number,
 *   weakSkills: Array<{ quest: string, skill: string }>,
 *   strongSkills: Array<{ quest: string, skill: string }>,
 * }}
 */
/** Ordered primary grades for level-recommendation stepping. */
const GRADES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

/**
 * Recommend a practice level from the declared grade and Quick Check
 * accuracy. Deliberately gentle: never moves more than one grade, never
 * below P1 or above P6, and stays at the declared grade in the broad
 * middle band. A struggling child practises one grade down to rebuild
 * confidence; a child who aces the check may stretch one grade up.
 *
 * @param {string} declaredGrade — 'P1'..'P6'
 * @param {number} accuracy — 0..1 from the Quick Check
 * @param {number} total — number of questions answered
 * @returns {{ level: string, direction: 'down'|'same'|'up' }}
 */
export function recommendPrimaryLevel(declaredGrade, accuracy, total = 0) {
  const idx = GRADES.indexOf(String(declaredGrade || '').toUpperCase());
  const at = idx === -1 ? 2 : idx; // default P3
  if (total < 4) return { level: GRADES[at], direction: 'same' }; // too little signal
  if (accuracy <= 0.35 && at > 0) return { level: GRADES[at - 1], direction: 'down' };
  if (accuracy >= 0.9 && at < GRADES.length - 1) return { level: GRADES[at + 1], direction: 'up' };
  return { level: GRADES[at], direction: 'same' };
}

export function applyPrimaryQuickCheckResults(answers) {
  if (!Array.isArray(answers) || answers.length === 0) {
    return { total: 0, correct: 0, accuracy: 0, weakSkills: [], strongSkills: [] };
  }

  const weak = [];
  const strong = [];
  let correctCount = 0;

  for (const a of answers) {
    if (!a || !a.source || !a.category) continue;
    const ok = !!a.correct;
    if (ok) correctCount++;
    questMastery.updateSkill(a.source, a.category, ok, { alpha: 0.45 });
    questMastery.recordAttempt({
      quest: a.source,
      skill: a.category,
      correct: ok,
      level: a.level || null,
    });
    (ok ? strong : weak).push({ quest: a.source, skill: a.category });
  }

  return {
    total: answers.length,
    correct: correctCount,
    accuracy: answers.length > 0 ? correctCount / answers.length : 0,
    weakSkills: weak,
    strongSkills: strong,
  };
}

function _normaliseGrade(grade) {
  const g = String(grade || '').toUpperCase();
  return /^P[1-6]$/.test(g) ? g : 'P3';
}

/**
 * Pick the first item per category until we have `count` items.
 * Stops if the bank has fewer distinct categories than requested.
 * @private
 */
function _pickPerCategory(bank, count, source) {
  const out = [];
  const seenCats = new Set();
  for (const item of bank) {
    if (!item || !item.category) continue;
    if (seenCats.has(item.category)) continue;
    seenCats.add(item.category);
    out.push({
      source,
      category: item.category,
      subskill: item.subskill || item.category,
      q: item.q,
      choices: Array.isArray(item.choices) ? [...item.choices] : [],
      answer: item.answer,
      explain: item.explain || '',
      level: item.level || null,
    });
    if (out.length >= count) break;
  }
  return out;
}

export const __TEST__ = { _normaliseGrade, _pickPerCategory };

// ────────────────────────────────────────────────────────────────────
// UI — render the Quick Check intro + question flow into a container.
// Mirrors the showPlacementTest signature so app.js can swap them in
// the same placement screen.
// ────────────────────────────────────────────────────────────────────

const escText = (s) =>
  String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);
const escAttr = (s) =>
  String(s ?? '')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');

/**
 * Mount the Primary Quick Check experience into `container`.
 * Three phases: intro (choose Start or Skip) → questions (6 in order)
 * → summary. Calls `onComplete({ skipped, results })` once finished.
 *
 * @param {{
 *   container: HTMLElement,
 *   profile: { name?: string, primaryGrade?: string },
 *   onComplete: (payload: { skipped: boolean, results?: ReturnType<typeof applyPrimaryQuickCheckResults> }) => void,
 * }} args
 */
export function showPrimaryQuickCheck({ container, profile, onComplete }) {
  if (!container || typeof onComplete !== 'function') return;
  const grade = profile?.primaryGrade || 'P3';
  const name = profile?.name || 'Friend';
  const { items } = buildPrimaryQuickCheck(grade);
  const answers = [];
  let phase = 'intro'; // 'intro' | 'questions' | 'summary'
  let qIndex = 0;
  let lockChoices = false;

  function render() {
    if (phase === 'intro') return _renderIntro();
    if (phase === 'summary') return _renderSummary();
    return _renderQuestion();
  }

  function _renderIntro() {
    container.innerHTML = `
      <div class="pqc-card">
        <p class="pqc-eyebrow">👋 Welcome, ${escText(name)}!</p>
        <h2 class="pqc-title">A quick check — about 5 minutes</h2>
        <p class="pqc-body">
          Try ${items.length} questions so Giri knows what to recommend.
          Wrong answers won't lose anything — this is just to get started.
        </p>
        <div class="pqc-actions">
          <button class="btn btn--primary btn--lg" data-action="start">Start the quick check</button>
          <button class="btn btn--ghost" data-action="skip">Skip — I'll learn as I go</button>
        </div>
      </div>`;
    container.querySelector('[data-action="start"]')?.addEventListener('click', () => {
      phase = 'questions';
      qIndex = 0;
      render();
    });
    container.querySelector('[data-action="skip"]')?.addEventListener('click', () => {
      onComplete({ skipped: true });
    });
  }

  function _renderQuestion() {
    const item = items[qIndex];
    if (!item) {
      phase = 'summary';
      return render();
    }
    const progress = `${qIndex + 1} / ${items.length}`;
    container.innerHTML = `
      <div class="pqc-card pqc-card--question">
        <div class="pqc-progress" role="status">${escText(progress)}</div>
        <p class="pqc-prompt">${escText(item.q)}</p>
        <div class="pqc-choices" role="group" aria-label="Choices">
          ${item.choices
            .map(
              (c) => `
            <button class="pqc-choice" type="button" data-choice="${escAttr(c)}">${escText(c)}</button>
          `,
            )
            .join('')}
        </div>
        <div class="pqc-feedback" id="pqc-feedback" aria-live="polite"></div>
      </div>`;
    lockChoices = false;
    container.querySelectorAll('.pqc-choice').forEach((btn) => {
      btn.addEventListener('click', () => _onChoice(btn));
    });
  }

  function _onChoice(btn) {
    if (lockChoices) return;
    lockChoices = true;
    const choice = btn.dataset.choice;
    const item = items[qIndex];
    const ok = choice === item.answer;
    answers.push({
      source: item.source,
      category: item.category,
      level: item.level,
      correct: ok,
    });
    // Charter-safe feedback: green tick for right, amber "Almost!" for wrong.
    container.querySelectorAll('.pqc-choice').forEach((b) => {
      if (b.dataset.choice === item.answer) b.classList.add('pqc-choice--correct');
      else if (b === btn && !ok) b.classList.add('pqc-choice--wrong');
      b.disabled = true;
    });
    const feedback = container.querySelector('#pqc-feedback');
    if (feedback) {
      feedback.className = `pqc-feedback ${ok ? 'pqc-feedback--correct' : 'pqc-feedback--wrong'}`;
      feedback.innerHTML = ok
        ? `<strong>Yes!</strong> ${escText(item.explain || '')}`
        : `<strong>Almost!</strong> ${escText(item.explain || '')}`;
    }
    setTimeout(() => {
      qIndex++;
      if (qIndex >= items.length) {
        phase = 'summary';
      }
      render();
    }, 1100);
  }

  function _renderSummary() {
    const results = applyPrimaryQuickCheckResults(answers);
    const pct = Math.round(results.accuracy * 100);
    const recommendation = recommendPrimaryLevel(grade, results.accuracy, results.total);
    results.recommendation = recommendation;
    const levelNote =
      recommendation.direction === 'down'
        ? `Giri suggests warming up with <strong>${escText(recommendation.level)}</strong> practice first — quick wins build speed for ${escText(grade)}.`
        : recommendation.direction === 'up'
          ? `Wow — Giri thinks you are ready to stretch into <strong>${escText(recommendation.level)}</strong> practice!`
          : '';
    container.innerHTML = `
      <div class="pqc-card pqc-card--summary">
        <p class="pqc-eyebrow">🎉 All done — thanks for the quick check!</p>
        <h2 class="pqc-title">Giri has a plan for you now.</h2>
        <p class="pqc-body">
          You answered ${results.correct} of ${results.total} (${pct}%) — but the score doesn't matter.
          What matters is Giri now knows which skills to bring up first.
        </p>
        ${levelNote ? `<p class="pqc-body pqc-body--level">${levelNote}</p>` : ''}
        <div class="pqc-actions">
          <button class="btn btn--primary btn--lg" data-action="continue">Start exploring</button>
        </div>
      </div>`;
    container.querySelector('[data-action="continue"]')?.addEventListener('click', () => {
      onComplete({ skipped: false, results });
    });
  }

  render();
}
