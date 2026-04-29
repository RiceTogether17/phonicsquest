import { escapeHtml } from '../utils/escapeHtml.js';
import { CLUE_TYPES, getBlankSkillMeta, getClueTypeLabel } from './examTrainingFramework.js';

const SKILL_TO_CLUE_TYPE = Object.freeze({
  gist: 'meaningClue',
  grammar: 'grammarClue',
  tense: 'timeClue',
  subjectVerbAgreement: 'grammarClue',
  pronounReference: 'pronounReferenceClue',
  connectorLogic: 'connectorClue',
  contrast: 'contrastClue',
  causeEffect: 'causeEffectClue',
  vocabularyInContext: 'meaningClue',
  collocation: 'collocationClue',
  phrasalVerb: 'collocationClue',
  wordForm: 'grammarClue',
  spelling: 'grammarClue',
  sentenceLogic: 'meaningClue',
});

function _resolveExpectedClueType(meta = {}) {
  if (meta.clueType && CLUE_TYPES.includes(meta.clueType)) return meta.clueType;
  return SKILL_TO_CLUE_TYPE[meta.primarySkill] || null;
}

function _shuffle(list, randomFn) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a multiple-choice scan task for one blank.
 *
 * Returns `null` when there is not enough metadata to build a meaningful
 * task (the caller should then bypass the scan and continue).
 *
 * Each option carries `{ value, label, isCorrect }`.
 */
export function buildScanTask({ blankIndex = 0, meta = {}, distractorCount = 3, randomFn = Math.random } = {}) {
  const expected = _resolveExpectedClueType(meta);
  if (!expected) return null;

  const pool = CLUE_TYPES.filter((c) => c !== expected);
  const distractors = _shuffle(pool, randomFn).slice(0, distractorCount);
  const ordered = _shuffle([expected, ...distractors], randomFn);

  return {
    blankIndex,
    prompt: `Blank ${blankIndex + 1}: What clue should you look for?`,
    expectedClueType: expected,
    options: ordered.map((value) => ({
      value,
      label: getClueTypeLabel(value),
      isCorrect: value === expected,
    })),
  };
}

function _blankHasRealMetadata(passage, blankIndex) {
  const clue = Array.isArray(passage.clues)
    ? passage.clues.find((c) => c && c.blankIndex === blankIndex)
    : null;
  if (clue && clue.clueType) return true;

  const raw = Array.isArray(passage.blankSkills) ? passage.blankSkills[blankIndex] : undefined;
  if (typeof raw === 'string' && raw.trim()) return true;
  if (raw && typeof raw === 'object' && (raw.clueType || raw.primarySkill)) return true;

  if (passage.skillTag && blankIndex === 0) return true;
  return false;
}

/**
 * Convenience: build a scan task for the first blank of a passage that has
 * any *real* clue/skill metadata. Returns null when no scannable blank
 * exists so the caller can skip the scan step.
 */
export function buildScanTaskForPassage(passage = {}, { randomFn = Math.random } = {}) {
  const total = Array.isArray(passage.answers) ? passage.answers.length : 0;
  for (let i = 0; i < total; i++) {
    if (!_blankHasRealMetadata(passage, i)) continue;
    const meta = getBlankSkillMeta(passage, i);
    const task = buildScanTask({ blankIndex: i, meta, randomFn });
    if (task) return task;
  }
  return null;
}

/**
 * Render a child-friendly scan task into `host`.
 *
 * - `onAnswer({ correct, chosenClueType, expectedClueType })` fires once
 *   the student picks an option. The renderer briefly highlights the
 *   chosen button before the callback runs so the child gets feedback.
 * - `onSkip()` fires when the optional Skip Scan button is clicked.
 */
export function renderScanTask({ host, task, onAnswer, onSkip, allowSkip = true }) {
  if (!host || !task) return;
  host.querySelector('#scan-task-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'scan-task-overlay';
  overlay.className = 'scan-task-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Scan task');

  const optionButtons = task.options.map((opt, idx) => `
    <button class="btn btn--ghost scan-task-option"
            data-value="${escapeHtml(opt.value)}"
            data-correct="${opt.isCorrect ? '1' : '0'}"
            aria-label="Option ${idx + 1}">
      <span class="scan-task-option-letter">${String.fromCharCode(65 + idx)}.</span>
      <span class="scan-task-option-label">${escapeHtml(opt.label)}</span>
    </button>
  `).join('');

  overlay.innerHTML = `
    <div class="scan-task-card">
      <p class="scan-task-step">Step 2 · Spot the clue type</p>
      <p class="scan-task-prompt">${escapeHtml(task.prompt)}</p>
      <div class="scan-task-options">${optionButtons}</div>
      <p class="scan-task-feedback" id="scan-task-feedback" aria-live="polite"></p>
      ${allowSkip ? '<button class="btn btn--ghost btn--sm scan-task-skip" id="scan-task-skip">Skip Scan</button>' : ''}
    </div>`;

  host.appendChild(overlay);

  let answered = false;
  overlay.querySelectorAll('.scan-task-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const correct = btn.dataset.correct === '1';
      const chosen = btn.dataset.value;
      btn.classList.add(correct ? 'scan-task-option--correct' : 'scan-task-option--wrong');
      const fb = overlay.querySelector('#scan-task-feedback');
      if (fb) {
        fb.textContent = correct
          ? `Good scan! Look for the ${getClueTypeLabel(task.expectedClueType).toLowerCase()}.`
          : `Not quite. The clue is the ${getClueTypeLabel(task.expectedClueType).toLowerCase()}.`;
      }
      setTimeout(() => {
        overlay.remove();
        onAnswer?.({ correct, chosenClueType: chosen, expectedClueType: task.expectedClueType });
      }, 700);
    });
  });

  overlay.querySelector('#scan-task-skip')?.addEventListener('click', () => {
    if (answered) return;
    answered = true;
    overlay.remove();
    onSkip?.();
  });
}
