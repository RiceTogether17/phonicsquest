/**
 * writingReviseDrills.js
 *
 * Multi-format drill renderer and grader for Writing Quest revise phase.
 * Supports:
 *   - mcq (radio-button): standard multiple-choice (legacy default)
 *   - sentence_upgrade: given a weak sentence, pick or type the best upgrade
 *   - arrange_sequence: drag/click sentences into correct narrative order
 *   - choose_best_revision: compare two revisions of a passage, pick the stronger one
 *   - dialogue_improve: pick the most purposeful dialogue replacement
 *
 * All drill types follow a common { type, question, ... } schema and are
 * graded through gradeDrills().
 */

// ── Drill Type Registry ─────────────────────────────────────────────────────

const DRILL_RENDERERS = {
  // Default MCQ types (legacy radio-button drills)
  vocab_mcq: _renderMCQ,
  spelling_pick: _renderMCQ,
  show_not_tell: _renderMCQ,
  opening_upgrade: _renderMCQ,
  dialogue_tag: _renderMCQ,
  order_sequence: _renderMCQ,

  // New richer drill types
  sentence_upgrade: _renderSentenceUpgrade,
  arrange_sequence: _renderArrangeSequence,
  choose_best_revision: _renderChooseBestRevision,
  dialogue_improve: _renderDialogueImprove,
};

const DRILL_GRADERS = {
  sentence_upgrade: _gradeSentenceUpgrade,
  arrange_sequence: _gradeArrangeSequence,
  choose_best_revision: _gradeMCQ,
  dialogue_improve: _gradeMCQ,
};

// ── Public API ──────────────────────────────────────────────────────────────

export function renderDrill(drill, index) {
  const renderer = DRILL_RENDERERS[drill.type] || _renderMCQ;
  return renderer(drill, index);
}

export function gradeDrills(drills = [], answers = []) {
  const results = drills.map((drill, idx) => {
    const grader = DRILL_GRADERS[drill.type] || _gradeMCQ;
    return grader(drill, answers[idx]);
  });
  const correctCount = results.filter((r) => r.correct).length;
  return {
    correctCount,
    total: drills.length,
    passed: drills.length === 0 ? true : correctCount >= Math.max(1, Math.ceil(drills.length * 0.6)),
    results,
  };
}

export function collectDrillAnswers(container, drillCount) {
  return Array.from({ length: drillCount }, (_, idx) => {
    // Check for MCQ radio answer
    const radio = container.querySelector(`input[name="drill-${idx}"]:checked`);
    if (radio) return radio.value;

    // Check for arrange-sequence answer
    const sequenceContainer = container.querySelector(`[data-arrange-drill="${idx}"]`);
    if (sequenceContainer) {
      const items = sequenceContainer.querySelectorAll('.arrange-item');
      return Array.from(items).map(el => Number(el.dataset.origIndex)).join(',');
    }

    // Check for sentence-upgrade textarea
    const textarea = container.querySelector(`textarea[data-drill-upgrade="${idx}"]`);
    if (textarea) return textarea.value.trim();

    return -1;
  });
}

// ── MCQ Renderer (legacy + new MCQ-style drills) ────────────────────────────

function _renderMCQ(drill, index) {
  return `<div class="dash-pattern-item" data-drill-type="${drill.type}">
    <strong>Drill ${index + 1}</strong>
    <p>${drill.question}</p>
    ${drill.options.map((opt, oi) => `<label style="display:block"><input type="radio" name="drill-${index}" value="${oi}"/> ${opt}</label>`).join('')}
  </div>`;
}

function _gradeMCQ(drill, answer) {
  return { type: drill.type, correct: Number(answer) === Number(drill.correctIndex) };
}

// ── Sentence Upgrade Drill ──────────────────────────────────────────────────
// Shows a weak sentence. Student picks the best upgraded version from options,
// OR types a free-text upgrade that is checked for required improvement signals.

function _renderSentenceUpgrade(drill, index) {
  const hasOptions = drill.options?.length > 0;
  return `<div class="dash-pattern-item" data-drill-type="sentence_upgrade">
    <strong>Drill ${index + 1} — Sentence Upgrade</strong>
    <p><em>Weak sentence:</em> "${drill.weakSentence || drill.question}"</p>
    <p>Pick the strongest upgrade${!hasOptions ? ' or write your own' : ''}:</p>
    ${hasOptions
      ? drill.options.map((opt, oi) => `<label style="display:block"><input type="radio" name="drill-${index}" value="${oi}"/> ${opt}</label>`).join('')
      : `<textarea data-drill-upgrade="${index}" class="cp-name-input" rows="2" placeholder="Write your upgraded sentence..."></textarea>`
    }
  </div>`;
}

function _gradeSentenceUpgrade(drill, answer) {
  // If options are present, grade like MCQ
  if (drill.options?.length) {
    return { type: drill.type, correct: Number(answer) === Number(drill.correctIndex) };
  }
  // Free-text grading: check that the answer has at least one required signal
  const text = (answer || '').toLowerCase();
  const signals = drill.requiredSignals || [];
  if (signals.length === 0) {
    // Basic check: longer than original and different
    const orig = (drill.weakSentence || drill.question || '').toLowerCase();
    return { type: drill.type, correct: text.length > orig.length && text !== orig };
  }
  const hits = signals.filter(s => text.includes(s.toLowerCase()));
  return { type: drill.type, correct: hits.length >= Math.max(1, Math.ceil(signals.length * 0.5)) };
}

// ── Arrange Sequence Drill ──────────────────────────────────────────────────
// Shows sentences in scrambled order. Student clicks to reorder them.
// Uses numbered buttons for simplicity (no drag-and-drop needed).

function _renderArrangeSequence(drill, index) {
  // Scrambled display order — shuffle but preserve original indices
  const items = (drill.sentences || []).map((s, i) => ({ text: s, origIndex: i }));
  const shuffled = drill.scrambledOrder
    ? drill.scrambledOrder.map(i => items[i])
    : _shuffleDeterministic(items, index);

  return `<div class="dash-pattern-item" data-drill-type="arrange_sequence">
    <strong>Drill ${index + 1} — Arrange the Story</strong>
    <p>${drill.question || 'Put these sentences in the best story order:'}</p>
    <div data-arrange-drill="${index}" class="arrange-container">
      ${shuffled.map((item) => `<div class="arrange-item" data-orig-index="${item.origIndex}" style="padding:6px 10px;margin:4px 0;border:1px solid var(--border);border-radius:6px;cursor:pointer;background:var(--bg-card)">
        <span class="arrange-number" style="font-weight:bold;margin-right:6px">?</span> ${item.text}
      </div>`).join('')}
    </div>
    <p style="font-size:0.85em;color:var(--text-muted)">Click items in order (1st, 2nd, 3rd...) to number them.</p>
  </div>`;
}

function _shuffleDeterministic(items, seed) {
  // Simple seeded shuffle that avoids producing the correct order
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (seed * 7 + i * 3) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // If accidentally in correct order, swap first two
  if (arr.every((item, i) => item.origIndex === i) && arr.length > 1) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

function _gradeArrangeSequence(drill, answer) {
  const correctOrder = drill.correctOrder || drill.sentences?.map((_, i) => i);
  if (!correctOrder) return { type: drill.type, correct: false };

  const studentOrder = (typeof answer === 'string')
    ? answer.split(',').map(Number)
    : (Array.isArray(answer) ? answer.map(Number) : []);

  const correct = correctOrder.length === studentOrder.length
    && correctOrder.every((v, i) => v === studentOrder[i]);

  return { type: drill.type, correct };
}

// ── Choose Best Revision Drill ──────────────────────────────────────────────
// Shows an original passage and two revised versions. Student picks the better one.

function _renderChooseBestRevision(drill, index) {
  return `<div class="dash-pattern-item" data-drill-type="choose_best_revision">
    <strong>Drill ${index + 1} — Choose the Better Revision</strong>
    <p><em>Original:</em> "${drill.original || drill.question}"</p>
    <p>Which revision is stronger?</p>
    ${drill.options.map((opt, oi) => `<label style="display:block;margin:4px 0;padding:6px;border:1px solid var(--border);border-radius:6px"><input type="radio" name="drill-${index}" value="${oi}"/> ${opt}</label>`).join('')}
  </div>`;
}

// ── Dialogue Improve Drill ──────────────────────────────────────────────────
// Shows weak dialogue and asks student to pick the most purposeful replacement.

function _renderDialogueImprove(drill, index) {
  return `<div class="dash-pattern-item" data-drill-type="dialogue_improve">
    <strong>Drill ${index + 1} — Improve the Dialogue</strong>
    <p><em>Weak dialogue:</em> "${drill.weakDialogue || drill.question}"</p>
    <p>Pick the dialogue that best moves the story forward:</p>
    ${drill.options.map((opt, oi) => `<label style="display:block;margin:4px 0"><input type="radio" name="drill-${index}" value="${oi}"/> ${opt}</label>`).join('')}
  </div>`;
}

// ── Exported for testing ────────────────────────────────────────────────────
export { DRILL_RENDERERS, DRILL_GRADERS };
