/**
 * PhonicsQuest – Class Lesson
 *
 * A screen for an adult leading a group from one shared display. The class
 * reads and answers aloud; the adult moves on with one key.
 *
 * What makes it different from the child-facing games:
 *
 *   • One thing on screen at a time, set large enough to read from the back
 *     of a room, with the controls pinned to the bottom so nothing needs
 *     scrolling to reach.
 *   • One key does everything: Space (or Enter, →, Page Down — what a
 *     presenter clicker sends) shows the answer, then moves to the next card.
 *   • Nothing is scored and nothing is saved. A class answering together is
 *     not evidence about any one child, so it must not reach a child's record.
 *
 * Four kinds of deck:
 *
 *   sentences      one reading phase: read the sentence, answer who / what /
 *                  where, then make a new sentence (data/classSentences.js)
 *   grammar        ten questions from the grammar bank for a level and topic
 *   vocabulary     ten questions from the vocabulary bank
 *   comprehension  one passage, then its questions with model answers
 *
 * The question banks are large, so they are imported only when a deck of
 * that kind is opened.
 */

import { CLASS_SENTENCE_SETS, classSentenceSet } from '../data/classSentences.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export const LEVELS = Object.freeze(['P1', 'P2', 'P3', 'P4', 'P5', 'P6']);

/** Questions in one grammar or vocabulary deck. */
export const DECK_SIZE = 10;

const KIND_META = Object.freeze({
  sentences: {
    icon: '🗣️',
    title: 'Read and talk',
    blurb: 'Read a sentence together, say who did what, then make a new one.',
  },
  grammar: {
    icon: '🧠',
    title: 'Grammar',
    blurb: 'Ten questions on one topic. The class picks, you show the answer.',
  },
  vocabulary: { icon: '🔑', title: 'Vocabulary', blurb: 'Ten word-choice questions for a level.' },
  comprehension: {
    icon: '📖',
    title: 'Comprehension',
    blurb: 'One passage, then its questions with model answers.',
  },
});

// ── Deck building (pure, exported for tests) ─────────────────────────────────

/**
 * @typedef {object} Slide
 * @property {'read'|'ask'|'make'|'mcq'|'passage'} type
 * @property {string} [big]       the text the class reads
 * @property {string} [prompt]    what the adult asks
 * @property {string} [answer]    shown on reveal
 * @property {string} [why]       a short explanation shown with the answer
 * @property {string[]} [choices] options, for an mcq
 * @property {string} [passage]   passage text a question can bring back up
 * @property {string} [title]
 */

/**
 * Slides for one reading phase: read, each question, then make a new one.
 * @param {string} phase
 * @returns {Slide[]}
 */
export function buildSentenceDeck(phase) {
  const set = classSentenceSet(phase);
  if (!set) return [];
  /** @type {Slide[]} */
  const slides = [];
  for (const s of set.sentences) {
    slides.push({ type: 'read', big: s.text, prompt: 'Read it together.' });
    for (const q of s.questions) {
      slides.push({ type: 'ask', big: s.text, prompt: q.q, answer: q.a });
    }
    slides.push({ type: 'make', big: s.text, prompt: s.change });
  }
  return slides;
}

/**
 * Pick `size` questions and turn them into slides.
 * @param {Array<object>} items     bank items ({ q, choices, answer, explain, optionExplanations, category })
 * @param {{ category?: string, size?: number, random?: () => number }} [opts]
 * @returns {Slide[]}
 */
export function buildMcqDeck(
  items,
  { category = '', size = DECK_SIZE, random = Math.random } = {},
) {
  const pool = (items || []).filter(
    (it) =>
      it &&
      Array.isArray(it.choices) &&
      it.choices.includes(it.answer) &&
      (!category || it.category === category),
  );
  const picked = shuffle(pool, random).slice(0, size);
  return picked.map((it) => ({
    type: 'mcq',
    big: it.q,
    choices: it.choices.slice(),
    answer: it.answer,
    why: it.optionExplanations?.[it.answer] || it.explain || '',
  }));
}

/**
 * Slides for one comprehension passage.
 * @param {{ title: string, passage: string, questions: Array<{q: string, model: string}> }} p
 * @returns {Slide[]}
 */
export function buildPassageDeck(p) {
  if (!p) return [];
  /** @type {Slide[]} */
  const slides = [{ type: 'passage', title: p.title, passage: p.passage }];
  for (const q of p.questions || []) {
    slides.push({ type: 'ask', prompt: q.q, answer: q.model, passage: p.passage, title: p.title });
  }
  return slides;
}

/** Fisher–Yates on a copy. */
export function shuffle(list, random = Math.random) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * What one press of the "next" key does from a given position.
 * Reveal first when the slide has an answer still hidden; otherwise move on.
 * @returns {{ index: number, revealed: boolean, done: boolean }}
 */
export function advance(slides, index, revealed) {
  const slide = slides[index];
  if (slide && slide.answer && !revealed) return { index, revealed: true, done: false };
  if (index >= slides.length - 1) return { index, revealed, done: true };
  return { index: index + 1, revealed: false, done: false };
}

/** One press of "back": hide the answer first, then step to the card before. */
export function retreat(index, revealed) {
  if (revealed) return { index, revealed: false };
  return { index: Math.max(0, index - 1), revealed: false };
}

// ── State ────────────────────────────────────────────────────────────────────

let _container = null;
let _onGoHome = null;
let _view = 'browser'; // browser | pick | lesson | done
let _kind = '';
let _level = 'P1';
let _deckTitle = '';
/** @type {Slide[]} */
let _slides = [];
let _index = 0;
let _revealed = false;
let _picked = ''; // the option the class chose on an mcq
let _showPassage = false;
let _topics = []; // [{ key, label }] for the current kind + level
let _passages = []; // comprehension passages for the current level
let _loadToken = 0;

// ── Rendering ────────────────────────────────────────────────────────────────

function _render() {
  if (!_container) return;
  document.body.classList.toggle('class-lesson-on', _view === 'lesson' || _view === 'done');
  const html =
    _view === 'lesson'
      ? _lessonHtml()
      : _view === 'done'
        ? _doneHtml()
        : _view === 'pick'
          ? _pickHtml()
          : _browserHtml();
  _container.innerHTML = html;
  if (_view === 'lesson' || _view === 'done') {
    _container.querySelector('[data-cl="next"], [data-cl="again"]')?.focus({ preventScroll: true });
  }
}

function _browserHtml() {
  const cards = Object.entries(KIND_META)
    .map(
      ([kind, m]) => `
      <button class="class-lesson-kind" data-cl="kind" data-kind="${kind}">
        <span class="class-lesson-kind-icon" aria-hidden="true">${m.icon}</span>
        <span class="class-lesson-kind-text">
          <span class="class-lesson-kind-title">${escapeHtml(m.title)}</span>
          <span class="class-lesson-kind-blurb">${escapeHtml(m.blurb)}</span>
        </span>
      </button>`,
    )
    .join('');
  return `
    <div class="class-lesson-browser">
      <button class="btn btn--ghost btn--sm" data-cl="home">← Back</button>
      <h2 class="class-lesson-heading">Class Lesson</h2>
      <p class="class-lesson-note">For teaching a group from one screen. The class answers aloud. Press <kbd>Space</kbd> to show the answer and again for the next card. Nothing is scored or saved.</p>
      <div class="class-lesson-kinds">${cards}</div>
    </div>`;
}

function _pickHtml() {
  const m = KIND_META[_kind];
  let body;
  if (_kind === 'sentences') {
    body = `<div class="class-lesson-chips">${CLASS_SENTENCE_SETS.map(
      (s, i) =>
        `<button class="class-lesson-chip" data-cl="deck" data-key="${escapeHtml(s.phase)}">${i + 1}. ${escapeHtml(s.label)}</button>`,
    ).join('')}</div>`;
  } else {
    const levels = `<div class="class-lesson-levels" role="group" aria-label="Level">${LEVELS.map(
      (l) =>
        `<button class="class-lesson-level" data-cl="level" data-level="${l}" aria-pressed="${l === _level}">${l}</button>`,
    ).join('')}</div>`;
    let list = '<p class="class-lesson-note" role="status">Loading…</p>';
    if (_kind === 'comprehension' && _passages.length) {
      list = `<div class="class-lesson-chips">${_passages
        .map(
          (p) =>
            `<button class="class-lesson-chip" data-cl="deck" data-key="${escapeHtml(p.id)}">${escapeHtml(p.title)}</button>`,
        )
        .join('')}</div>`;
    } else if (_kind !== 'comprehension' && _topics.length) {
      list = `<div class="class-lesson-chips">
        <button class="class-lesson-chip class-lesson-chip--mixed" data-cl="deck" data-key="">Mixed topics</button>
        ${_topics
          .map(
            (t) =>
              `<button class="class-lesson-chip" data-cl="deck" data-key="${escapeHtml(t.key)}">${escapeHtml(t.label)}</button>`,
          )
          .join('')}</div>`;
    }
    body = levels + list;
  }
  return `
    <div class="class-lesson-browser">
      <button class="btn btn--ghost btn--sm" data-cl="browser">← Back</button>
      <h2 class="class-lesson-heading">${m.icon} ${escapeHtml(m.title)}</h2>
      <p class="class-lesson-note">${escapeHtml(m.blurb)}</p>
      ${body}
    </div>`;
}

function _paragraphs(text) {
  return String(text || '')
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('');
}

function _slideHtml(slide) {
  if (slide.type === 'passage') {
    return `<div class="class-lesson-passage" tabindex="0" aria-label="Passage">
      <h3 class="class-lesson-passage-title">${escapeHtml(slide.title || '')}</h3>
      ${_paragraphs(slide.passage)}
    </div>`;
  }
  if (slide.type === 'mcq') {
    const letters = 'ABCD';
    const options = (slide.choices || [])
      .map((c, i) => {
        const right = _revealed && c === slide.answer;
        const wrong = _revealed && c === _picked && c !== slide.answer;
        const cls = right ? ' is-right' : wrong ? ' is-wrong' : c === _picked ? ' is-picked' : '';
        const mark = right ? ' ✓' : wrong ? ' ✗' : '';
        return `<button class="class-lesson-option${cls}" data-cl="pick" data-choice="${escapeHtml(c)}" aria-pressed="${c === _picked}">
          <span class="class-lesson-option-key" aria-hidden="true">${letters[i] || i + 1}</span>
          <span>${escapeHtml(c)}${mark}</span>
        </button>`;
      })
      .join('');
    const why =
      _revealed && slide.why
        ? `<p class="class-lesson-why" role="status">${escapeHtml(slide.why)}</p>`
        : '';
    return `<p class="class-lesson-big class-lesson-big--question">${escapeHtml(slide.big || '')}</p>
      <div class="class-lesson-options">${options}</div>${why}`;
  }
  // read | ask | make
  if (_showPassage && slide.passage) {
    return `<div class="class-lesson-passage" tabindex="0" aria-label="Passage">
      <h3 class="class-lesson-passage-title">${escapeHtml(slide.title || '')}</h3>
      ${_paragraphs(slide.passage)}
    </div>`;
  }
  const tag =
    slide.type === 'make' ? '<span class="class-lesson-tag">Make a new sentence</span>' : '';
  const big = slide.big ? `<p class="class-lesson-big">${escapeHtml(slide.big)}</p>` : '';
  const prompt = slide.prompt
    ? `<p class="class-lesson-prompt${slide.big ? '' : ' class-lesson-prompt--solo'}">${escapeHtml(slide.prompt)}</p>`
    : '';
  const answer =
    slide.answer && _revealed
      ? `<p class="class-lesson-answer" role="status">${escapeHtml(slide.answer)}</p>`
      : '';
  return `${big}${tag}${prompt}${answer}`;
}

function _lessonHtml() {
  const slide = _slides[_index];
  const needsReveal = !!slide.answer && !_revealed;
  const last = _index >= _slides.length - 1;
  const nextLabel = needsReveal ? 'Show answer' : last ? 'Finish' : 'Next';
  const passageBtn =
    slide.type === 'ask' && slide.passage
      ? `<button class="btn btn--secondary" data-cl="passage" aria-pressed="${_showPassage}">${_showPassage ? 'Hide passage' : 'Show passage'} <kbd>P</kbd></button>`
      : '';
  return `
    <div class="class-lesson-stage" role="region" aria-label="Class lesson">
      <div class="class-lesson-top">
        <span class="class-lesson-deck">${escapeHtml(_deckTitle)}</span>
        <span class="class-lesson-count" aria-label="Card ${_index + 1} of ${_slides.length}">${_index + 1} / ${_slides.length}</span>
        <button class="btn btn--secondary btn--sm" data-cl="exit">✕ Exit <kbd>Esc</kbd></button>
      </div>
      <div class="class-lesson-body">${_slideHtml(slide)}</div>
      <div class="class-lesson-bar">
        <button class="btn btn--secondary" data-cl="back" ${_index === 0 && !_revealed ? 'disabled' : ''}>← Back</button>
        ${passageBtn}
        <button class="btn btn--primary class-lesson-next" data-cl="next">${nextLabel} <kbd>Space</kbd></button>
      </div>
    </div>`;
}

function _doneHtml() {
  return `
    <div class="class-lesson-stage" role="region" aria-label="Class lesson">
      <div class="class-lesson-body">
        <p class="class-lesson-big">Well done, everyone!</p>
        <p class="class-lesson-prompt">That is the end of ${escapeHtml(_deckTitle)}.</p>
      </div>
      <div class="class-lesson-bar">
        <button class="btn btn--secondary" data-cl="exit">Choose another</button>
        <button class="btn btn--primary class-lesson-next" data-cl="again">Go again</button>
      </div>
    </div>`;
}

// ── Loading the pick lists ───────────────────────────────────────────────────

async function _loadPickList() {
  const token = ++_loadToken;
  _topics = [];
  _passages = [];
  _render();
  try {
    if (_kind === 'grammar') {
      const [bank, cats] = await Promise.all([
        import('../data/grammarMcq.js'),
        import('../data/grammarCategories.js'),
      ]);
      if (token !== _loadToken) return;
      _topics = _topicsFor(bank.buildGrammarMcqLevel(_level), cats.GRAMMAR_CATEGORIES);
    } else if (_kind === 'vocabulary') {
      const [bank, cats] = await Promise.all([
        import('../data/vocabMcq.js'),
        import('../data/vocabCategories.js'),
      ]);
      if (token !== _loadToken) return;
      _topics = _topicsFor(bank.buildVocabMcqLevel(_level), cats.VOCAB_CATEGORIES);
    } else if (_kind === 'comprehension') {
      const m = await import('../data/openComprehensionPassages.js');
      if (token !== _loadToken) return;
      _passages = m.OPEN_COMPREHENSION_PASSAGES.filter((p) => p.level === _level);
    }
  } catch {
    /* offline with the bank not cached yet: the list stays on "Loading…" */
  }
  if (token === _loadToken && _view === 'pick') _render();
}

/** Topics that have at least one question at this level, in bank order. */
function _topicsFor(items, categories) {
  const seen = new Set();
  const out = [];
  for (const it of items || []) {
    if (!it?.category || seen.has(it.category)) continue;
    seen.add(it.category);
    out.push({ key: it.category, label: categories?.[it.category]?.label || it.category });
  }
  return out;
}

async function _openDeck(key) {
  let slides;
  let title;
  if (_kind === 'sentences') {
    slides = buildSentenceDeck(key);
    title = classSentenceSet(key)?.label || '';
  } else if (_kind === 'comprehension') {
    const p = _passages.find((x) => x.id === key);
    slides = buildPassageDeck(p);
    title = p ? `${p.level} · ${p.title}` : '';
  } else {
    const bank =
      _kind === 'grammar'
        ? (await import('../data/grammarMcq.js')).buildGrammarMcqLevel(_level)
        : (await import('../data/vocabMcq.js')).buildVocabMcqLevel(_level);
    slides = buildMcqDeck(bank, { category: key });
    const topic = _topics.find((t) => t.key === key)?.label || 'Mixed topics';
    title = `${_level} ${KIND_META[_kind].title} · ${topic}`;
  }
  if (!slides.length || !_container) return;
  _slides = slides;
  _deckTitle = title;
  _index = 0;
  _revealed = false;
  _picked = '';
  _showPassage = false;
  _view = 'lesson';
  _render();
}

// ── Moving through a deck ────────────────────────────────────────────────────

function _next() {
  const r = advance(_slides, _index, _revealed);
  if (r.done) {
    _view = 'done';
  } else {
    if (r.index !== _index) {
      _picked = '';
      _showPassage = false;
    }
    _index = r.index;
    _revealed = r.revealed;
  }
  _render();
}

function _back() {
  const r = retreat(_index, _revealed);
  if (r.index !== _index) {
    _picked = '';
    _showPassage = false;
  }
  _index = r.index;
  _revealed = r.revealed;
  _render();
}

function _pick(choice) {
  if (_revealed) return;
  _picked = _picked === choice ? '' : choice;
  _render();
}

function _exitLesson() {
  _view = 'pick';
  _render();
}

// ── Events ───────────────────────────────────────────────────────────────────

function _onClick(e) {
  const el = e.target instanceof Element ? e.target.closest('[data-cl]') : null;
  if (!el || !_container?.contains(el)) return;
  const act = el.getAttribute('data-cl');
  if (act === 'home') _onGoHome?.();
  else if (act === 'browser') {
    _view = 'browser';
    _render();
  } else if (act === 'kind') {
    _kind = el.getAttribute('data-kind') || 'sentences';
    _view = 'pick';
    if (_kind === 'sentences') _render();
    else _loadPickList();
  } else if (act === 'level') {
    _level = el.getAttribute('data-level') || 'P1';
    _loadPickList();
  } else if (act === 'deck') _openDeck(el.getAttribute('data-key') || '');
  else if (act === 'next') _next();
  else if (act === 'back') _back();
  else if (act === 'pick') _pick(el.getAttribute('data-choice') || '');
  else if (act === 'passage') {
    _showPassage = !_showPassage;
    _render();
  } else if (act === 'exit') _exitLesson();
  else if (act === 'again') {
    _index = 0;
    _revealed = false;
    _picked = '';
    _view = 'lesson';
    _render();
  }
}

function _onKey(e) {
  if (_view !== 'lesson' && _view !== 'done') return;
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const onButton =
    e.target instanceof Element && !!e.target.closest('button, a, input, select, textarea');
  const key = e.key;
  if (key === 'Escape') {
    e.preventDefault();
    _exitLesson();
    return;
  }
  if (_view !== 'lesson') return;
  if (key === 'ArrowRight' || key === 'PageDown') {
    e.preventDefault();
    _next();
  } else if (key === 'ArrowLeft' || key === 'PageUp') {
    e.preventDefault();
    _back();
  } else if ((key === ' ' || key === 'Enter') && !onButton) {
    // On a focused button the browser's own click does the work.
    e.preventDefault();
    _next();
  } else if (key.length === 1) {
    const slide = _slides[_index];
    const k = key.toLowerCase();
    if (k === 'p' && slide?.type === 'ask' && slide.passage) {
      _showPassage = !_showPassage;
      _render();
    } else if (slide?.type === 'mcq') {
      const i = 'abcd'.indexOf(k) >= 0 ? 'abcd'.indexOf(k) : '1234'.indexOf(k);
      if (i >= 0 && slide.choices?.[i] != null) _pick(slide.choices[i]);
    }
  }
}

// ── Lifecycle ────────────────────────────────────────────────────────────────

export function initClassLesson(container, onGoHome) {
  cleanupClassLesson();
  _container = container;
  _onGoHome = onGoHome;
  _container?.addEventListener('click', _onClick);
  document.addEventListener('keydown', _onKey);
}

export function showClassLessonBrowser() {
  _view = 'browser';
  _render();
}

export function cleanupClassLesson() {
  _loadToken++;
  document.removeEventListener('keydown', _onKey);
  _container?.removeEventListener('click', _onClick);
  document.body.classList.remove('class-lesson-on');
  _container = null;
  _onGoHome = null;
  _view = 'browser';
  _slides = [];
  _index = 0;
  _revealed = false;
  _picked = '';
  _showPassage = false;
}
