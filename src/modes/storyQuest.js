/**
 * Story Quest — Post-reading comprehension & vocabulary activity
 *
 * Flow:
 *   1. Intro card  – "Story Quest! Let's check what you know."
 *   2. Comprehension (3 MCQ, one at a time)
 *   3. Vocab Explorer (5 flip cards: word → meaning + emoji)
 *   4. Grammar Spotlight (1–2 patterns with example & tip)
 *   5. Done screen  – score badge + stars earned
 *
 * Launched from storyMode.js after the reader finishes.
 * Renders inside the same `container` element as the story reader.
 *
 * @param {HTMLElement} container   – the stories-content div
 * @param {object}      story       – the story object (must have .comprehension, .vocab, .grammarSpotlight)
 * @param {Function}    onDone      – called when child presses "Back to Library"
 */
export function runStoryQuest(container, story, onDone) {
  if (!story.comprehension?.length) {
    // Story has no quest data – just go back
    onDone?.();
    return;
  }

  const state = {
    phase: 'intro',        // intro | comprehension | vocab | grammar | done
    qIndex: 0,             // current comprehension question
    vocabIndex: 0,         // current vocab card
    correct: 0,            // correct comprehension answers
    total: story.comprehension.length,
    flipped: false,        // for vocab card
  };

  function render() {
    switch (state.phase) {
      case 'intro':        return _renderIntro();
      case 'comprehension':return _renderComprehension();
      case 'vocab':        return _renderVocab();
      case 'grammar':      return _renderGrammar();
      case 'done':         return _renderDone();
    }
  }

  // ── Intro ──────────────────────────────────────────────────────────────

  function _renderIntro() {
    container.innerHTML = /* html */`
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

  function _renderComprehension() {
    const q = story.comprehension[state.qIndex];
    const qNum = state.qIndex + 1;
    const total = state.total;

    container.innerHTML = /* html */`
      <div class="sq-screen sq-comprehension">
        <div class="sq-progress-bar">
          <div class="sq-progress-fill" style="width:${(qNum / total) * 100}%"></div>
        </div>
        <p class="sq-phase-label">❓ Question ${qNum} of ${total}</p>

        <div class="sq-question-card">
          <p class="sq-question-text">${q.q}</p>
          ${q.type === 'inferential' ? '<span class="sq-infer-badge">🤔 Think about it…</span>' : ''}
        </div>

        <div class="sq-options" id="sq-options">
          ${q.options.map((opt, i) => /* html */`
            <button class="sq-option" data-idx="${i}" aria-label="${opt}">
              <span class="sq-option-letter">${String.fromCharCode(65 + i)}</span>
              <span class="sq-option-text">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div class="sq-feedback" id="sq-feedback" hidden></div>
        <button class="btn btn--primary btn--xl sq-next-btn" id="sq-next" hidden>
          Next →
        </button>
      </div>
    `;

    document.querySelectorAll('.sq-option').forEach(btn => {
      btn.addEventListener('click', () => _handleAnswer(btn, q));
    });
  }

  function _handleAnswer(btn, q) {
    const chosen = parseInt(btn.dataset.idx, 10);
    const correct = chosen === q.answer;
    if (correct) state.correct++;

    // Disable all options
    document.querySelectorAll('.sq-option').forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add('sq-option--correct');
      if (i === chosen && !correct) b.classList.add('sq-option--wrong');
    });

    const feedback = document.getElementById('sq-feedback');
    if (feedback) {
      feedback.hidden = false;
      feedback.className = `sq-feedback ${correct ? 'sq-feedback--correct' : 'sq-feedback--wrong'}`;
      feedback.textContent = correct
        ? '✅ Great thinking!'
        : `✨ The answer is: ${q.options[q.answer]}`;
    }

    const nextBtn = document.getElementById('sq-next');
    if (nextBtn) {
      nextBtn.hidden = false;
      nextBtn.addEventListener('click', () => {
        state.qIndex++;
        if (state.qIndex < state.total) {
          render();
        } else {
          // Move to vocab or grammar or done
          state.phase = story.vocab?.length ? 'vocab' : (story.grammarSpotlight?.length ? 'grammar' : 'done');
          state.vocabIndex = 0;
          render();
        }
      });
    }
  }

  // ── Vocab Explorer ─────────────────────────────────────────────────────

  function _renderVocab() {
    const card = story.vocab[state.vocabIndex];
    const total = story.vocab.length;
    const cardNum = state.vocabIndex + 1;

    container.innerHTML = /* html */`
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
          ${state.flipped ? /* html */`
            <button class="btn btn--primary btn--xl" id="sq-vocab-next">
              ${cardNum < total ? 'Next word →' : 'Done with words!'}
            </button>
          ` : `
            <button class="btn btn--ghost btn--xl" id="sq-flip-btn">
              👀 Flip card
            </button>
          `}
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
    flipCard?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') flipFn(); });
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

    const spotsHtml = spots.map((s, i) => /* html */`
      <div class="sq-grammar-card">
        <div class="sq-grammar-num">${i + 1}</div>
        <h3 class="sq-grammar-pattern">${s.pattern}</h3>
        <div class="sq-grammar-example">
          <span class="sq-grammar-eg-label">Example:</span>
          <em class="sq-grammar-eg-text">${s.example}</em>
        </div>
        <p class="sq-grammar-tip">💡 ${s.tip}</p>
      </div>
    `).join('');

    container.innerHTML = /* html */`
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

    container.innerHTML = /* html */`
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
