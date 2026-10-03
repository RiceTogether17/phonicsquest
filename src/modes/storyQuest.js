/**
 * Story Quest — Post-reading comprehension & vocabulary activity
 *
 * Flow:
 *   1. Intro card  – "Story Quest! Let's check what you know."
 *   2. Questions, one at a time (see the kinds below)
 *   3. Written answers (`openEnded`), if the story has any
 *   4. Vocab Explorer (flip cards: word → meaning + emoji)
 *   5. Grammar Spotlight (1–2 patterns with example & tip)
 *   6. Done screen  – score badge + stars earned
 *
 * Question kinds in `story.comprehension`:
 *   (none)  multiple choice   { q, options, answer, type }
 *   'tf'    true or false     { kind, q: a statement, options: ['True', 'False', NOT_SAID?], answer, type }
 *   'gap'   fill the gap      { kind, q: a sentence with ___, options: the word bank, answer, type }
 *   'order' put in order      { kind, q: the instruction, events: [first, …, last], type }
 * `answer` is an index into `options`; `events` are stored in story order.
 *
 * Launched from storyMode.js after the reader finishes.
 * Renders inside the same `container` element as the story reader.
 *
 * @param {HTMLElement} container   – the stories-content div
 * @param {{ comprehension: Array<{q: string, kind?: string, options?: string[], answer?: number, events?: string[], type: string}>, openEnded?: Array<{q: string, sampleAnswer: string, markingGuide: string}>, vocab: Array<{word: string, meaning: string, icon: string}>, grammarSpotlight: Array<{pattern: string, example: string, tip: string}> }} story – the story object
 * @param {() => void}  onDone      – called when child presses "Back to Library"
 */
import { clueForQuestion } from '../modules/storyClue.js';
import { shuffleArray } from '../data/words.js';
import { html } from '../utils/html.js';

/** The gap in a fill-the-gap sentence. */
const GAP = '___';

/** The option for a statement nothing in the story answers. */
export const NOT_SAID = 'The story does not say';

/** Is "the story does not say" the right answer? */
const answersNotSaid = (q) => q.options?.[q.answer] === NOT_SAID;

/**
 * The order to show a question's options in, as indices into q.options.
 *
 * The story bank stores every right answer first. Shown in that order, a
 * child could tap A every time and score full marks without reading a word,
 * so options are shuffled once per question. True or false keeps its fixed
 * True, False order, which is what a child expects, and "the story does not
 * say" always comes last, where a child looks for it. Each button keeps its
 * option's index in the data, which is what the answer is checked against.
 *
 * @param {{ kind?: string, options: string[] }} q
 * @returns {number[]}
 */
export function displayOrder(q) {
  const idx = q.options.map((_, i) => i);
  const last = idx.filter((i) => q.options[i] === NOT_SAID);
  const rest = idx.filter((i) => q.options[i] !== NOT_SAID);
  return [...(q.kind === 'tf' ? rest : shuffleArray(rest)), ...last];
}

export function runStoryQuest(container, story, onDone) {
  if (!story.comprehension?.length) {
    // Story has no quest data – just go back
    onDone?.();
    return;
  }

  const state = {
    phase: 'intro', // intro | comprehension | openEnded | vocab | grammar | done
    qIndex: 0, // current comprehension question
    vocabIndex: 0, // current vocab card
    correct: 0, // correct comprehension answers
    firstTry: 0, // right without needing the clue
    withClue: 0, // right after being sent back to the sentence
    hadClue: false, // this question has already shown its clue
    clue: null, // the sentence that answers the current question
    total: story.comprehension.length,
    flipped: false, // for vocab card
  };

  function render() {
    switch (state.phase) {
      case 'intro':
        return _renderIntro();
      case 'comprehension':
        return _renderComprehension();
      case 'vocab':
        return _renderVocab();
      case 'openEnded':
        return _renderOpenEnded();
      case 'grammar':
        return _renderGrammar();
      case 'done':
        return _renderDone();
    }
  }

  // ── Intro ──────────────────────────────────────────────────────────────

  function _renderIntro() {
    container.innerHTML = /* html */ `
      <div class="sq-screen sq-intro">
        <div class="sq-mascot-emoji">🌟</div>
        <h2 class="sq-title">Story Quest!</h2>
        <p class="sq-subtitle">You finished the story.<br>Let's check what you know!</p>
        <div class="sq-quest-preview">
          <span class="sq-badge sq-badge--blue">❓ ${story.comprehension.length} questions</span>
          ${story.vocab?.length ? `<span class="sq-badge sq-badge--green">📖 ${story.vocab.length} words</span>` : ''}
          ${story.grammarSpotlight?.length ? `<span class="sq-badge sq-badge--purple">✏️ grammar</span>` : ''}
        </div>
        <button class="btn btn--primary btn--xl sq-start-btn" id="sq-start">
          Let's go! →
        </button>
        <button class="btn btn--ghost sq-skip-btn" id="sq-skip">
          Skip for now
        </button>
      </div>
    `;
    document.getElementById('sq-start')?.addEventListener('click', () => {
      state.phase = 'comprehension';
      state.qIndex = 0;
      render();
    });
    document.getElementById('sq-skip')?.addEventListener('click', () => onDone?.());
  }

  // ── Comprehension ──────────────────────────────────────────────────────

  function _progressHtml() {
    const qNum = state.qIndex + 1;
    return html`
      <div class="sq-progress-bar">
        <div class="sq-progress-fill" style="width:${(qNum / state.total) * 100}%"></div>
      </div>
      <p class="sq-phase-label">❓ Question ${qNum} of ${state.total}</p>
    `;
  }

  /** The question card: a question, a true-or-false statement, or a sentence with a gap. */
  function _questionHtml(q) {
    if (q.kind === 'tf') {
      return html`<p class="sq-kind-label">True or false?</p>
        <p class="sq-question-text">${q.q}</p>`;
    }
    if (q.kind === 'gap') {
      const [before, after = ''] = q.q.split(GAP);
      return html`<p class="sq-kind-label">Pick the word that fits.</p>
        <p class="sq-question-text">
          ${before}<span class="sq-gap" id="sq-gap"><span class="visually-hidden">blank</span></span>${after}
        </p>`;
    }
    return html`<p class="sq-question-text">${q.q}</p>
      ${q.type === 'inferential' && html`<span class="sq-infer-badge">🤔 Think about it…</span>`}`;
  }

  function _renderComprehension() {
    const q = story.comprehension[state.qIndex];
    if (q.kind === 'order') return _renderOrder(q);
    // Found once per question so a wrong answer can send the child to the
    // sentence rather than to the answer. Null for the handful of questions
    // ("what does this story teach us?") whose answer is in no one sentence,
    // and for "the story does not say", where pointing at a sentence would
    // tell the child the opposite of the answer.
    state.clue = answersNotSaid(q) ? null : clueForQuestion(story, q);
    state.hadClue = false;
    const order = displayOrder(q);

    container.innerHTML = html`
      <div class="sq-screen sq-comprehension">
        ${_progressHtml()}
        <div class="sq-question-card">${_questionHtml(q)}</div>

        <div class="sq-options" id="sq-options">
          ${order.map(
            (idx, pos) => html`
              <button class="sq-option" data-idx="${idx}" aria-label="${q.options[idx]}">
                <span class="sq-option-letter">${String.fromCharCode(65 + pos)}</span>
                <span class="sq-option-text">${q.options[idx]}</span>
              </button>
            `,
          )}
        </div>

        <div class="sq-feedback" id="sq-feedback" aria-live="polite" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>Next →</button>
      </div>
    `;

    document.querySelectorAll('.sq-option').forEach((btn) => {
      btn.addEventListener('click', () => _handleAnswer(btn, q));
    });
  }

  /**
   * A wrong answer used to end the question: every option locked and the
   * right one revealed. That turns "I got it wrong" into a score rather
   * than into a second go at reading for meaning, which is the skill the
   * questions are for.
   *
   * It is now check → look at the clue → try again → and only then the
   * answer, with the sentence that proves it. First-time-right and
   * worked-out-with-a-clue are counted separately, because a teacher wants
   * to know which it was.
   */
  function _handleAnswer(btn, q) {
    const chosen = parseInt(btn.dataset.idx, 10);
    const correct = chosen === q.answer;
    const feedback = document.getElementById('sq-feedback');
    const clue = state.clue;
    const notSaid = answersNotSaid(q);

    if (!correct && !state.hadClue && (clue || notSaid)) {
      // First miss, and there is somewhere to send them: the sentence, or
      // the story itself when the answer is that it never says.
      state.hadClue = true;
      btn.disabled = true;
      btn.classList.add('sq-option--wrong');
      if (feedback) {
        feedback.hidden = false;
        feedback.className = 'sq-feedback sq-feedback--retry';
        feedback.innerHTML = clue
          ? html`Not quite. The story says: <q class="sq-clue">${clue.text}</q> Have another go.`
          : html`Not quite. Look back at the story: can you find a sentence that says this? Have
              another go.`;
      }
      return; // the other options stay live
    }

    if (correct) {
      if (state.hadClue) state.withClue++;
      else state.firstTry++;
      state.correct++;
    }

    document.querySelectorAll('.sq-option').forEach((b) => {
      const idx = parseInt(b.dataset.idx, 10);
      b.disabled = true;
      if (idx === q.answer) b.classList.add('sq-option--correct');
      if (idx === chosen && !correct) b.classList.add('sq-option--wrong');
    });

    // The finished sentence is worth seeing whichever way the child got there.
    const gap = document.getElementById('sq-gap');
    if (gap) {
      gap.textContent = q.options[q.answer];
      gap.classList.add('sq-gap--filled');
    }

    if (feedback) {
      feedback.hidden = false;
      feedback.className = `sq-feedback ${correct ? 'sq-feedback--correct' : 'sq-feedback--wrong'}`;
      if (correct) {
        feedback.textContent = notSaid
          ? '✅ Good checking — the story never says that.'
          : state.hadClue
            ? '✅ You found it!'
            : '✅ Great thinking!';
      } else if (notSaid) {
        feedback.innerHTML = html`The answer is <strong>${NOT_SAID}</strong>. Nothing in it tells us
          that.`;
      } else {
        // Showing the answer alone teaches nothing; showing the sentence it
        // came from is what a child can use next time.
        feedback.innerHTML = clue
          ? html`The answer is <strong>${q.options[q.answer]}</strong>. The story says:
              <q class="sq-clue">${clue.text}</q>`
          : html`The answer is <strong>${q.options[q.answer]}</strong>.`;
      }
    }

    _showNext();
  }

  /**
   * Put the story's events in order. The child taps them first to last;
   * each tap numbers the event, and Undo takes the last one back. A wrong
   * order gets one more go, then the story's order is shown.
   */
  function _renderOrder(q) {
    state.clue = null;
    state.hadClue = false;
    const picked = [];
    let shown = shuffleArray(q.events.map((_, i) => i));
    // Already in order would be no question at all.
    if (shown.every((v, i) => v === i)) shown = [...shown.slice(1), shown[0]];

    container.innerHTML = html`
      <div class="sq-screen sq-comprehension">
        ${_progressHtml()}
        <div class="sq-question-card">
          <p class="sq-kind-label">Tap them from first to last.</p>
          <p class="sq-question-text">${q.q}</p>
        </div>

        <div class="sq-options" id="sq-options">
          ${shown.map(
            (idx) => html`
              <button class="sq-option sq-order-event" data-idx="${idx}">
                <span class="sq-option-letter" aria-hidden="true">?</span>
                <span class="sq-option-text">${q.events[idx]}</span>
              </button>
            `,
          )}
        </div>
        <button class="btn btn--ghost" id="sq-order-undo" disabled>↩ Undo</button>

        <div class="sq-feedback" id="sq-feedback" aria-live="polite" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>Next →</button>
      </div>
    `;

    const buttons = [...document.querySelectorAll('.sq-order-event')];
    const undo = document.getElementById('sq-order-undo');
    const feedback = document.getElementById('sq-feedback');
    const label = (b, text) => {
      b.querySelector('.sq-option-letter').textContent = text;
    };
    const describe = (b) => {
      const n = picked.indexOf(Number(b.dataset.idx));
      const text = b.querySelector('.sq-option-text').textContent.trim();
      b.setAttribute('aria-label', n >= 0 ? `${n + 1}: ${text}` : text);
    };
    const reset = () => {
      picked.length = 0;
      buttons.forEach((b) => {
        b.disabled = false;
        b.classList.remove('sq-order-event--picked');
        label(b, '?');
        describe(b);
      });
      undo.disabled = true;
    };

    buttons.forEach((b) => {
      describe(b);
      b.addEventListener('click', () => {
        picked.push(Number(b.dataset.idx));
        b.disabled = true;
        b.classList.add('sq-order-event--picked');
        label(b, String(picked.length));
        describe(b);
        undo.disabled = false;
        if (feedback) feedback.hidden = true;
        if (picked.length === q.events.length) check();
      });
    });

    undo.addEventListener('click', () => {
      const last = picked.pop();
      const b = buttons.find((x) => Number(x.dataset.idx) === last);
      if (b) {
        b.disabled = false;
        b.classList.remove('sq-order-event--picked');
        label(b, '?');
        describe(b);
      }
      undo.disabled = picked.length === 0;
    });

    function check() {
      const right = picked.every((idx, pos) => idx === pos);
      if (!right && !state.hadClue) {
        state.hadClue = true;
        reset();
        if (feedback) {
          feedback.hidden = false;
          feedback.className = 'sq-feedback sq-feedback--retry';
          feedback.textContent =
            'Not quite. Think about what happened first in the story, then try again.';
        }
        return;
      }

      if (right) {
        if (state.hadClue) state.withClue++;
        else state.firstTry++;
        state.correct++;
      }

      // Show the story's order either way, numbered.
      const host = document.getElementById('sq-options');
      [...buttons]
        .sort((a, b) => Number(a.dataset.idx) - Number(b.dataset.idx))
        .forEach((b) => {
          host.appendChild(b);
          b.disabled = true;
          b.classList.remove('sq-order-event--picked');
          label(b, String(Number(b.dataset.idx) + 1));
          b.classList.add(right ? 'sq-option--correct' : 'sq-order-event--shown');
        });
      undo.hidden = true;

      if (feedback) {
        feedback.hidden = false;
        feedback.className = `sq-feedback ${right ? 'sq-feedback--correct' : 'sq-feedback--wrong'}`;
        feedback.textContent = right
          ? state.hadClue
            ? '✅ You worked it out!'
            : '✅ That is the order it happened in!'
          : 'This is the order it happened in the story.';
      }
      _showNext();
    }
  }

  /** Reveal Next, which moves to the next question or on to the next part. */
  function _showNext() {
    const nextBtn = document.getElementById('sq-next');
    if (!nextBtn) return;
    nextBtn.hidden = false;
    nextBtn.addEventListener('click', () => {
      state.qIndex++;
      if (state.qIndex < state.total) {
        render();
      } else {
        // Move to vocab or grammar or done
        state.phase = story.openEnded?.length
          ? 'openEnded'
          : story.vocab?.length
            ? 'vocab'
            : story.grammarSpotlight?.length
              ? 'grammar'
              : 'done';
        state.vocabIndex = 0;
        render();
      }
    });
  }

  function _renderOpenEnded() {
    const prompts = story.openEnded || [];
    if (!prompts.length) {
      state.phase = story.vocab?.length
        ? 'vocab'
        : story.grammarSpotlight?.length
          ? 'grammar'
          : 'done';
      render();
      return;
    }

    // Written first, compared after: the good answer sits behind a tap so a
    // child tries in their own words before seeing one. Nothing is marked —
    // the check line says what a good answer does, for the child or a
    // grown-up to look for.
    container.innerHTML = html`
      <div class="sq-screen sq-comprehension">
        <p class="sq-phase-label">✍️ Your turn to write</p>
        ${prompts.map(
          (p, i) => html`
            <div class="sq-question-card sq-written">
              <label class="sq-question-text" for="sq-written-${i}">${p.q}</label>
              <textarea
                class="cp-name-input sq-written-input"
                id="sq-written-${i}"
                rows="3"
                placeholder="Write your answer here…"
              ></textarea>
              <details class="sq-written-model">
                <summary>See a good answer</summary>
                <p>${p.sampleAnswer}</p>
                <p class="sq-written-check">✅ ${p.markingGuide}</p>
              </details>
            </div>
          `,
        )}
        <button class="btn btn--primary btn--xl" id="sq-open-next">Continue →</button>
      </div>
    `;

    document.getElementById('sq-open-next')?.addEventListener('click', () => {
      state.phase = story.vocab?.length
        ? 'vocab'
        : story.grammarSpotlight?.length
          ? 'grammar'
          : 'done';
      render();
    });
  }

  // ── Vocab Explorer ─────────────────────────────────────────────────────

  function _renderVocab() {
    const card = story.vocab[state.vocabIndex];
    const total = story.vocab.length;
    const cardNum = state.vocabIndex + 1;

    container.innerHTML = /* html */ `
      <div class="sq-screen sq-vocab">
        <p class="sq-phase-label">📖 Word ${cardNum} of ${total}</p>

        <div class="sq-flip-card ${state.flipped ? 'sq-flip-card--flipped' : ''}" id="sq-flip-card" role="button" aria-label="Flip card to see meaning" tabindex="0">
          <div class="sq-flip-front">
            <div class="sq-flip-emoji">${card.icon}</div>
            <p class="sq-flip-word">${card.word}</p>
            <p class="sq-flip-hint">Tap to see meaning</p>
          </div>
          <div class="sq-flip-back">
            <div class="sq-flip-emoji">${card.icon}</div>
            <p class="sq-flip-meaning">${card.meaning}</p>
          </div>
        </div>

        <div class="sq-vocab-controls">
          ${
            state.flipped
              ? /* html */ `
            <button class="btn btn--primary btn--xl" id="sq-vocab-next">
              ${cardNum < total ? 'Next word →' : 'Done with words!'}
            </button>
          `
              : `
            <button class="btn btn--ghost btn--xl" id="sq-flip-btn">
              👀 Flip card
            </button>
          `
          }
        </div>
        <button class="btn btn--ghost sq-skip-btn" id="sq-vocab-skip">
          Skip vocab
        </button>
      </div>
    `;

    const flipCard = document.getElementById('sq-flip-card');
    const flipFn = () => {
      state.flipped = true;
      render();
    };
    flipCard?.addEventListener('click', flipFn);
    flipCard?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') flipFn();
    });
    document.getElementById('sq-flip-btn')?.addEventListener('click', flipFn);

    document.getElementById('sq-vocab-next')?.addEventListener('click', () => {
      state.vocabIndex++;
      state.flipped = false;
      if (state.vocabIndex < total) {
        render();
      } else {
        state.phase = story.grammarSpotlight?.length ? 'grammar' : 'done';
        render();
      }
    });

    document.getElementById('sq-vocab-skip')?.addEventListener('click', () => {
      state.phase = story.grammarSpotlight?.length ? 'grammar' : 'done';
      render();
    });
  }

  // ── Grammar Spotlight ──────────────────────────────────────────────────

  function _renderGrammar() {
    const spots = story.grammarSpotlight ?? [];

    const spotsHtml = spots
      .map(
        (s, i) => /* html */ `
      <div class="sq-grammar-card">
        <div class="sq-grammar-num">${i + 1}</div>
        <h3 class="sq-grammar-pattern">${s.pattern}</h3>
        <div class="sq-grammar-example">
          <span class="sq-grammar-eg-label">Example:</span>
          <em class="sq-grammar-eg-text">${s.example}</em>
        </div>
        <p class="sq-grammar-tip">💡 ${s.tip}</p>
      </div>
    `,
      )
      .join('');

    container.innerHTML = /* html */ `
      <div class="sq-screen sq-grammar">
        <p class="sq-phase-label">✏️ Grammar Spotlight</p>
        <div class="sq-grammar-list">${spotsHtml}</div>
        <button class="btn btn--primary btn--xl" id="sq-grammar-done">
          See my score! 🌟
        </button>
      </div>
    `;

    document.getElementById('sq-grammar-done')?.addEventListener('click', () => {
      state.phase = 'done';
      render();
    });
  }

  // ── Done ───────────────────────────────────────────────────────────────

  function _renderDone() {
    const pct = state.total > 0 ? Math.round((state.correct / state.total) * 100) : 100;
    const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;
    const starsHtml = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const xpEarned = state.correct * 15 + (pct === 100 ? 25 : 0);

    const messages = [
      'Great job — keep it up!',
      'Nice work! Read the story again to practise.',
      'Super reader! You aced this Story Quest!',
    ];
    const msg = stars === 3 ? messages[2] : stars === 2 ? messages[1] : messages[0];

    container.innerHTML = /* html */ `
      <div class="sq-screen sq-done">
        <div class="sq-done-stars">${starsHtml}</div>
        <h2 class="sq-title">Story Quest complete!</h2>
        <p class="sq-subtitle">${msg}</p>
        <div class="sq-score-row">
          <div class="sq-score-badge">
            <span class="sq-score-num">${state.correct}</span>
            <span class="sq-score-denom">/ ${state.total}</span>
            <span class="sq-score-label">correct</span>
          </div>
          <div class="sq-xp-badge">
            <span class="sq-xp-num">+${xpEarned}</span>
            <span class="sq-xp-label">XP</span>
          </div>
        </div>
        ${
          // Right first time and right after looking it up are two different
          // things, and a grown-up reading this wants to know which. Working
          // it out from the text is a success, so it is phrased as one.
          state.withClue
            ? `<p class="sq-breakdown">${state.firstTry} right first time · ${state.withClue} worked out from the story</p>`
            : ''
        }
        <button class="btn btn--primary btn--xl" id="sq-back">
          ← Back to Library
        </button>
      </div>
    `;

    document.getElementById('sq-back')?.addEventListener('click', () => onDone?.());
  }

  // ── Boot ───────────────────────────────────────────────────────────────
  render();
}
