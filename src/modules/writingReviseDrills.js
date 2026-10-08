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
    passed:
      drills.length === 0 ? true : correctCount >= Math.max(1, Math.ceil(drills.length * 0.6)),
    results,
  };
}

export function collectDrillAnswers(container, drillCount) {
  return Array.from({ length: drillCount }, (_, idx) => {
    // Check for MCQ radio answer
    const radio = container.querySelector(`input[name="drill-${idx}"]:checked`);
    if (radio) return radio.value;

    // Check for arrange-sequence answer
    // The child numbers the items by tapping them, so the answer is the
    // tap order, not the (shuffled) order they appear on screen.
    const sequenceContainer = container.querySelector(`[data-arrange-drill="${idx}"]`);
    if (sequenceContainer) {
      return Array.from(sequenceContainer.querySelectorAll('.arrange-item[data-pick]'))
        .sort((a, b) => Number(a.dataset.pick) - Number(b.dataset.pick))
        .map((el) => Number(el.dataset.origIndex))
        .join(',');
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
    ${
      hasOptions
        ? drill.options
            .map(
              (opt, oi) =>
                `<label style="display:block"><input type="radio" name="drill-${index}" value="${oi}"/> ${opt}</label>`,
            )
            .join('')
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
  const hits = signals.filter((s) => text.includes(s.toLowerCase()));
  return { type: drill.type, correct: hits.length >= Math.max(1, Math.ceil(signals.length * 0.5)) };
}

// ── Arrange Sequence Drill ──────────────────────────────────────────────────
// Shows sentences in scrambled order. Student clicks to reorder them.
// Uses numbered buttons for simplicity (no drag-and-drop needed).

function _renderArrangeSequence(drill, index) {
  // Scrambled display order — shuffle but preserve original indices
  const items = (drill.sentences || []).map((s, i) => ({ text: s, origIndex: i }));
  const shuffled = drill.scrambledOrder
    ? drill.scrambledOrder.map((i) => items[i])
    : _shuffleDeterministic(items, index);

  return `<div class="dash-pattern-item" data-drill-type="arrange_sequence">
    <strong>Drill ${index + 1} — Arrange the Story</strong>
    <p>${drill.question || 'Put these sentences in the best story order:'}</p>
    <div data-arrange-drill="${index}" class="arrange-container">
      ${shuffled
        .map(
          (
            item,
          ) => `<button type="button" class="arrange-item" data-orig-index="${item.origIndex}" aria-pressed="false" style="display:block;width:100%;text-align:left;padding:6px 10px;margin:4px 0;border:1px solid var(--border);border-radius:6px;cursor:pointer;background:var(--bg-card);color:inherit;font:inherit">
        <span class="arrange-number" style="font-weight:bold;margin-right:6px">?</span> ${item.text}
      </button>`,
        )
        .join('')}
    </div>
    <p style="font-size:0.85em;color:var(--text-muted)">Tap the sentences in order: first, second, third… Tap a numbered sentence again to undo it.</p>
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

  const studentOrder =
    typeof answer === 'string'
      ? answer.split(',').map(Number)
      : Array.isArray(answer)
        ? answer.map(Number)
        : [];

  const correct =
    correctOrder.length === studentOrder.length &&
    correctOrder.every((v, i) => v === studentOrder[i]);

  return { type: drill.type, correct };
}

/**
 * Wire up tap-to-number for every arrange-sequence drill inside `container`.
 * Tapping an unnumbered sentence gives it the next number; tapping a numbered
 * one removes its number and every number after it, so a child can back up
 * without starting over.
 */
export function bindArrangeDrills(container) {
  container?.querySelectorAll('[data-arrange-drill]').forEach((group) => {
    const items = Array.from(group.querySelectorAll('.arrange-item'));
    const paint = () =>
      items.forEach((el) => {
        const pick = el.dataset.pick;
        el.querySelector('.arrange-number').textContent = pick ? String(Number(pick) + 1) : '?';
        el.setAttribute('aria-pressed', pick ? 'true' : 'false');
      });
    items.forEach((el) =>
      el.addEventListener('click', () => {
        if (el.dataset.pick !== undefined) {
          const removed = Number(el.dataset.pick);
          items.forEach((other) => {
            if (other.dataset.pick !== undefined && Number(other.dataset.pick) >= removed) {
              delete other.dataset.pick;
            }
          });
        } else {
          el.dataset.pick = String(items.filter((o) => o.dataset.pick !== undefined).length);
        }
        paint();
      }),
    );
  });
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

// ── Teaching feedback ───────────────────────────────────────────────────────

/**
 * What to tell the child about one drill after they submit.
 *
 * A wrong answer before the child has passed gets the `hint` (the rule, not
 * the answer), so a retry is still practice. Once the round is passed, every
 * drill shows the right answer and the `why`, so a lucky guess still teaches.
 */
export function describeDrillResult(drill, result, { reveal = false } = {}) {
  const correct = Boolean(result?.correct);
  let answer = '';
  if (drill.type === 'arrange_sequence') {
    const order = drill.correctOrder || drill.sentences?.map((_, i) => i) || [];
    answer = order.map((i, n) => `${n + 1}. ${drill.sentences?.[i] ?? ''}`).join(' ');
  } else if (Array.isArray(drill.options)) {
    answer = drill.options[drill.correctIndex] ?? '';
  }
  if (correct) {
    return { correct, title: 'Correct!', answer: '', why: drill.why || '' };
  }
  if (reveal) {
    return { correct, title: 'Not quite.', answer, why: drill.why || '' };
  }
  return {
    correct,
    title: 'Not yet. Try this one again.',
    answer: '',
    why: drill.hint || 'Look back at the teaching cards on the Learn page.',
  };
}

// ── Exported for testing ────────────────────────────────────────────────────
export { DRILL_RENDERERS, DRILL_GRADERS };
