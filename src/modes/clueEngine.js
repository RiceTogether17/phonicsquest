/**
 * PhonicsQuest – Clue Engine
 *
 * Shared module for clue-detection gameplay in Cloze Castle and Word Vault.
 *
 * Design goals
 * ─────────────
 * 1. Passages that have NO `clues` array → classic mode, zero behaviour change.
 * 2. Passages that DO have a `clues` array → clue-hunt step before the word bank
 *    unlocks for each blank.
 * 3. Three-tier evaluation:  strong clue → partial clue → weak clue.
 * 4. Four-step hint ladder when the student is stuck.
 *
 * Clue data shape (one object per blank, stored in passage.clues[]):
 * {
 *   blankIndex:      0,               // 0-based index of the ___ this clue targets
 *   prompt:          'Which word tells you the tense?',
 *   acceptableSpans: ['Last Sunday'], // any word within these spans → STRONG
 *   partialSpans:    ['Sunday'],      // any word in these spans → PARTIAL
 *   clueType:        'time-marker',   // for analytics / dashboard labels
 *   explanation:     '"Last Sunday" tells us this happened in the past …'
 * }
 */

import { escapeAttr, escapeHtml } from '../utils/escapeHtml.js';

// ── Tokenisation ─────────────────────────────────────────────────────────────

/**
 * Break a cloze passage into tappable tokens.
 * Each word becomes its own token so students can tap individual words.
 *
 * Token types:
 *   'word'  – tappable word (may have attached punctuation stored separately)
 *   'blank' – the ___ placeholder, carries blankIndex
 *   'space' – whitespace separator rendered as a plain space
 *   'punct' – punctuation attached to a word, not tappable
 *
 * @param {string} text  passage text containing ___ blanks
 * @returns {Array<{type: string, value: string, blankIndex?: number}>}
 */
export function tokenizePassage(text) {
  const parts   = text.split('___');
  const tokens  = [];
  let   blankIdx = 0;

  parts.forEach((part, partIdx) => {
    // Split part into space-separated chunks
    const chunks = part.split(' ');

    chunks.forEach((chunk, chunkIdx) => {
      if (chunkIdx > 0) tokens.push({ type: 'space', value: ' ' });

      if (!chunk) return; // empty string from leading/trailing space

      // Separate leading & trailing punctuation from the core word
      const m = chunk.match(/^([^a-zA-Z0-9']*)([\w'-]+)([^a-zA-Z0-9']*)$/);
      if (m) {
        if (m[1]) tokens.push({ type: 'punct', value: m[1] });
        tokens.push({ type: 'word', value: m[2] });
        if (m[3]) tokens.push({ type: 'punct', value: m[3] });
      } else {
        // chunk has no word characters – treat as punct (e.g. ellipsis)
        tokens.push({ type: 'punct', value: chunk });
      }
    });

    // Insert blank after every part except the last
    if (partIdx < parts.length - 1) {
      tokens.push({ type: 'space',  value: ' ' });
      tokens.push({ type: 'blank',  value: '___', blankIndex: blankIdx });
      tokens.push({ type: 'space',  value: ' ' });
      blankIdx++;
    }
  });

  return tokens;
}

// ── Clue evaluation ──────────────────────────────────────────────────────────

/**
 * Normalise a word for comparison: lowercase, strip outer punctuation.
 * @param {string} w
 * @returns {string}
 */
function norm(w) {
  return w.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, '');
}

/**
 * Check whether normWord appears in any word of the supplied span strings.
 * e.g. span "Last Sunday" → ['last', 'sunday']
 * @param {string}   normWord
 * @param {string[]} spans
 * @returns {boolean}
 */
function wordInSpans(normWord, spans) {
  return (spans || []).some(span =>
    span.split(/\s+/).some(w => norm(w) === normWord)
  );
}

/**
 * Evaluate a student's clue selection against a clue data object.
 *
 * @param {string} tappedWord  the word the student tapped (raw)
 * @param {Object} clueData    the clue object for the active blank
 * @returns {'strong'|'partial'|'weak'}
 */
export function evaluateClueSelection(tappedWord, clueData) {
  if (!clueData) return 'weak';
  const w = norm(tappedWord);
  if (wordInSpans(w, clueData.acceptableSpans)) return 'strong';
  if (wordInSpans(w, clueData.partialSpans))    return 'partial';
  return 'weak';
}

// ── Rendering ────────────────────────────────────────────────────────────────

/**
 * Render a cloze passage with individually tappable word tokens.
 * Used during the clue-hunt phase so students can tap the clue word.
 *
 * Options:
 *   container        – DOM element to render into
 *   text             – raw passage text with ___ blanks
 *   activeBlankIndex – which blank is currently targeted (-1 = none)
 *   selectedWord     – word already chosen (or null)
 *   selectedResult   – 'strong'|'partial'|'weak'|null
 *   filledAnswers    – array of filled word strings for already-done blanks
 *   onTapWord        – callback(word: string, el: Element)
 *
 * @param {Object} opts
 */
export function renderClueHuntPassage({
  container,
  text,
  activeBlankIndex = -1,
  selectedWord     = null,
  selectedResult   = null,
  filledAnswers    = [],
  onTapWord,
}) {
  const tokens = tokenizePassage(text);

  const html = tokens.map(tok => {
    switch (tok.type) {
      case 'space':
        return ' ';

      case 'punct':
        return `<span class="clue-punct">${escapeHtml(tok.value)}</span>`;

      case 'blank': {
        const isActive = tok.blankIndex === activeBlankIndex;
        const filled   = filledAnswers[tok.blankIndex];
        if (filled) {
          return `<span class="clue-blank-token clue-blank-token--filled">${escapeHtml(filled)}</span>`;
        }
        return `<span class="clue-blank-token ${isActive ? 'clue-blank-token--active' : ''}"
                      aria-label="${escapeAttr(isActive ? 'Active blank ' + (tok.blankIndex + 1) : 'Blank ' + (tok.blankIndex + 1))}">
                  ${isActive ? '❓' : '___'}
                </span>`;
      }

      case 'word': {
        const isSelected = selectedWord && norm(tok.value) === norm(selectedWord);
        let extra = '';
        if (isSelected && selectedResult) {
          extra = `clue-word-token--${selectedResult}`;
        }
        return `<button class="clue-word-token ${extra}"
                        data-word="${escapeAttr(tok.value)}"
                        aria-label="${escapeAttr(`Tap ${tok.value} as clue`)}">${escapeHtml(tok.value)}</button>`;
      }

      default:
        return '';
    }
  }).join('');

  container.innerHTML = html;

  if (onTapWord) {
    container.querySelectorAll('.clue-word-token').forEach(btn => {
      btn.addEventListener('click', () => onTapWord(btn.dataset.word, btn));
    });
  }
}

// ── Hint ladder ──────────────────────────────────────────────────────────────

/**
 * Return a hint message for the given hint level (1–4).
 *
 * Level 1 – generic nudge
 * Level 2 – grammatical type hint
 * Level 3 – highlight the region (caller should apply CSS)
 * Level 4 – reveal exact clue phrase
 *
 * @param {number} hintLevel  1 | 2 | 3 | 4
 * @param {Object} clueData
 * @returns {{ message: string, revealSpan: string|null }}
 */
export function getClueHint(hintLevel, clueData) {
  if (!clueData) return { message: 'Look at the whole sentence.', revealSpan: null };

  switch (hintLevel) {
    case 1:
      return {
        message: 'Look near the blank for a clue word.',
        revealSpan: null,
      };
    case 2: {
      const typeHints = {
        'time-marker':     'Which word tells you when this happened?',
        'subject-clue':    'Which word tells you about the subject?',
        'connector-clue':  'Which connector word gives you a hint?',
        'contrast-clue':   'Find the word that shows a contrast.',
        'cause-clue':      'Find the word that shows a reason.',
        'description-clue':'Find a describing word near the blank.',
        'collocation-clue':'Look for a word that often pairs with the answer.',
      };
      return {
        message: typeHints[clueData.clueType] || 'Look for the key word in the sentence.',
        revealSpan: null,
      };
    }
    case 3: {
      // Pick the sentence most likely to contain the clue
      const acceptable = (clueData.acceptableSpans || [])[0] || '';
      return {
        message: acceptable
          ? `The clue is somewhere near: "${acceptable.split(' ')[0]}…"`
          : 'The clue is in the same sentence as the blank.',
        revealSpan: null,
      };
    }
    case 4: {
      const span = (clueData.acceptableSpans || [])[0] || '';
      return {
        message: span
          ? `The clue is "${span}". ${clueData.explanation || ''}`
          : clueData.explanation || 'Read the whole sentence carefully.',
        revealSpan: span || null,
      };
    }
    default:
      return { message: 'Read the whole sentence carefully.', revealSpan: null };
  }
}

// ── Scoring helpers ──────────────────────────────────────────────────────────

/**
 * Map a clue result to a numeric clue score.
 * strong → 1   partial → 0.5   weak → 0
 * @param {'strong'|'partial'|'weak'|null} result
 * @returns {number}
 */
export function clueResultToScore(result) {
  if (result === 'strong')  return 1;
  if (result === 'partial') return 0.5;
  return 0;
}

/**
 * Return the feedback message and CSS modifier class for a clue result.
 * @param {'strong'|'partial'|'weak'} result
 * @returns {{ message: string, cssClass: string }}
 */
export function clueResultFeedback(result) {
  switch (result) {
    case 'strong':
      return {
        message:  'Excellent clue! This tells you the answer directly.',
        cssClass: 'clue-feedback--strong',
      };
    case 'partial':
      return {
        message:  'Good clue, but there is a stronger one nearby.',
        cssClass: 'clue-feedback--partial',
      };
    case 'weak':
    default:
      return {
        message:  'This word does not help enough. Look near the blank.',
        cssClass: 'clue-feedback--weak',
      };
  }
}
