/**
 * Word Sort Mode  (Phonics application — pattern discrimination)
 *
 * Core loop:
 * 1. Two labelled sound-pattern bins are shown (e.g. Short A vs Short E,
 *    or Long A · a_e vs Long A · ai).
 * 2. Words appear one at a time (printed word + emoji + 🔊).
 * 3. The child taps the bin the word belongs in; instant ✓/✗ feedback.
 * 4. After all words, the round is scored with the canonical Word Sort
 *    scorer (scoring/wordSort.js) and a summary with a targeted hint is
 *    shown before a single final result is reported.
 *
 * Scorer-category note: the scorer's SHORT_VOWEL_CATS set only contains
 * `short-*` and `cvc-*` keys, so structural stage groups (ccvc-a, cvcc-o,
 * ccvcc-u…) are canonicalized to `short-<vowel>` scorer keys — otherwise a
 * short-vowel mix-up would never classify as vowel-confusion.
 */

import { renderWordImage } from '../components/phonemeDisplay.js';
import { celebrateCorrect } from '../components/confettiHelper.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { progress } from '../modules/progress.js';
import { WORD_GROUPS, shuffleArray } from '../data/words.js';
import { CURRICULUM } from '../data/curriculum.js';
import { buildWordSortRound, scoreWordSort } from './scoring/wordSort.js';

const WORDS_PER_BIN = 3;
const ADVANCE_MS    = 700;

let _word       = null;   // shell word — recording target
let _els        = null;
let _queue      = [];     // [{ word, wordObj, expected }]
let _idx        = 0;
let _placements = [];
let _bins       = [];     // [{ group, scorerKey, label, icon, color, bg }]
let _startTime  = 0;
let _timeouts   = [];
let _locked     = false;
let _done       = false;

const SHORT_STAGE_RE = /^(?:cvc|ccvc|cvcc|ccvcc)-([aeiou])$/;
const SHORT_GROUP_RE = /^short-([aeiou])$/;
const LONG_STAGE_RE  = /^long-([aeiou])-/;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupWordSort(word, els) {
  _word       = word;
  _els        = els;
  _idx        = 0;
  _placements = [];
  _timeouts   = [];
  _locked     = false;
  _done       = false;
  _startTime  = Date.now();

  const stageGroup = store.get('currentGroup') || word.group;
  _bins  = _deriveBins(stageGroup, word);
  _queue = _buildQueue(word, _bins);

  // Standard word-card header stays empty — the round has its own card.
  renderWordImage(word, els.wordEmoji, false);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML  = '';
  els.modeInstruction.textContent = 'Put each word in the box that matches its sound.';

  // Hide the shell's Say-It: it always speaks the shell word, which is
  // wrong for every card after the first — the round card has its own 🔊.
  if (els.btnCheck) els.btnCheck.style.display = 'none';
  if (els.btnSayIt) els.btnSayIt.style.display = 'none';
  if (els.btnSkip)  els.btnSkip.style.display  = '';

  els.modeArea.innerHTML = /* html */`
    <div class="ws-round">
      <div class="ws-progress" id="ws-progress" aria-live="polite"></div>
      <div class="ws-card" id="ws-card"></div>
      <div class="ws-bins" id="ws-bins" role="group" aria-label="Sound pattern boxes"></div>
      <div class="ws-status" id="ws-status" role="status" aria-live="polite"></div>
    </div>
  `;

  const binsEl = document.getElementById('ws-bins');
  _bins.forEach((bin, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ws-bin';
    btn.dataset.bin = String(i);
    btn.dataset.scorerKey = bin.scorerKey;
    btn.dataset.group = bin.group;
    btn.style.setProperty('--ws-bin-color', bin.color);
    btn.style.setProperty('--ws-bin-bg', bin.bg);
    btn.setAttribute('aria-label', `Sort into ${bin.label}`);
    btn.innerHTML = `
      <span class="ws-bin-icon" aria-hidden="true">${bin.icon}</span>
      <span class="ws-bin-label">${bin.label}</span>
    `;
    btn.addEventListener('click', () => _onBinTap(bin, btn));
    binsEl.appendChild(btn);
  });

  _renderCurrent();
}

/**
 * Pick the two sorting bins: the stage's own group plus its most
 * instructionally useful sibling.
 */
function _deriveBins(stageGroup, word) {
  const maxLevel = store.get('difficulty') || 1;
  const poolSize = g => {
    const capped = progress.getWordsInGroup(g, maxLevel);
    return (capped.length >= 2 ? capped : progress.getWordsInGroup(g, null)).length;
  };
  const mk = (group, scorerKey) => {
    const meta  = WORD_GROUPS[group] || {};
    const stage = CURRICULUM.find(s => s.group === group || s.id === group);
    return {
      group,
      scorerKey,
      label: meta.label || stage?.name || group,
      icon:  meta.icon  || stage?.icon || '📦',
      color: meta.color || 'var(--color-primary)',
      bg:    meta.bg    || 'var(--surface-2)',
    };
  };

  const shortMatch = SHORT_STAGE_RE.exec(stageGroup) || SHORT_GROUP_RE.exec(stageGroup);
  if (shortMatch) {
    // Sibling = same structure, different vowel. Scorer keys canonicalized
    // to short-<vowel> so the vowel-confusion classifier can fire.
    const vowel  = shortMatch[1];
    const prefix = stageGroup.slice(0, stageGroup.lastIndexOf('-'));
    for (const v of shuffleArray(['a', 'e', 'i', 'o', 'u'].filter(x => x !== vowel))) {
      const sibling = `${prefix}-${v}`;
      if (poolSize(sibling) >= 2) {
        return [mk(stageGroup, `short-${vowel}`), mk(sibling, `short-${v}`)];
      }
    }
  }

  const longMatch = LONG_STAGE_RE.exec(stageGroup);
  if (longMatch) {
    // Sibling = same vowel, different spelling pattern (long-a-ae vs long-a-ai)
    // — this exercises the scorer's pattern-confusion path.
    const siblings = Object.keys(WORD_GROUPS)
      .filter(k => k !== stageGroup && LONG_STAGE_RE.exec(k)?.[1] === longMatch[1]);
    for (const sibling of shuffleArray(siblings)) {
      if (poolSize(sibling) >= 2) {
        return [mk(stageGroup, stageGroup), mk(sibling, sibling)];
      }
    }
  }

  // Fallback: any other stage group at the word's level with words available.
  const level = word.level ?? 1;
  for (const stage of shuffleArray(CURRICULUM.filter(s => s.group !== stageGroup && s.level === level))) {
    if (poolSize(stage.group) >= 2) {
      return [mk(stageGroup, stageGroup), mk(stage.group, stage.group)];
    }
  }
  // Last resort: any group with words at all.
  const any = Object.keys(WORD_GROUPS).find(g => g !== stageGroup && poolSize(g) >= 2) || stageGroup;
  return [mk(stageGroup, stageGroup), mk(any, any)];
}

/** Build the shuffled round queue, always including the shell word in bin A. */
function _buildQueue(word, bins) {
  const maxLevel = store.get('difficulty') || 1;
  const pull = (group) => {
    const capped = progress.getWordsInGroup(group, maxLevel);
    return capped.length >= 2 ? capped : progress.getWordsInGroup(group, null);
  };

  const byId = new Map();
  const items = [];
  const add = (w, scorerKey) => {
    if (!w || byId.has(w.id)) return;
    byId.set(w.id, w);
    items.push({ word: w.word, category: scorerKey, wordObj: w });
  };

  // Shell word first so the app's recordAttempt target genuinely appeared.
  add(word, bins[0].scorerKey);
  for (const w of shuffleArray(pull(bins[0].group))) {
    if (items.filter(i => i.category === bins[0].scorerKey).length >= WORDS_PER_BIN) break;
    add(w, bins[0].scorerKey);
  }
  for (const w of shuffleArray(pull(bins[1].group))) {
    if (items.filter(i => i.category === bins[1].scorerKey).length >= WORDS_PER_BIN) break;
    add(w, bins[1].scorerKey);
  }

  const round = buildWordSortRound(items, [bins[0].scorerKey, bins[1].scorerKey], { count: items.length });
  return round.items.map(i => ({ word: i.word, wordObj: i.wordObj, expected: i.category }));
}

function _renderCurrent() {
  const item = _queue[_idx];
  if (!item) return _finishRound();

  const progressEl = document.getElementById('ws-progress');
  if (progressEl) progressEl.textContent = `Word ${_idx + 1} of ${_queue.length}`;

  const card = document.getElementById('ws-card');
  if (card) {
    card.innerHTML = `
      <span class="ws-card-emoji" aria-hidden="true">${item.wordObj?.emoji ?? ''}</span>
      <span class="ws-card-word">${item.word}</span>
      <button class="ws-card-speak" type="button" aria-label="Hear the word ${item.word}">🔊</button>
    `;
    card.querySelector('.ws-card-speak')?.addEventListener('click', () => {
      audio.speakWord(item.word);
    });
  }

  document.getElementById('ws-status')?.replaceChildren();
  _locked = false;
  _timeouts.push(setTimeout(() => { if (!_done) audio.speakWord(item.word); }, 400));
}

function _onBinTap(bin, btn) {
  if (_locked || _done) return;
  const item = _queue[_idx];
  if (!item) return;
  _locked = true;

  const correct = bin.scorerKey === item.expected;
  _placements.push({ word: item.word, expected: item.expected, placed: bin.scorerKey });

  audio.playSfx(correct ? 'correct' : 'wrong');
  btn.classList.add(correct ? 'ws-bin--yes' : 'ws-bin--no');
  _timeouts.push(setTimeout(() => btn.classList.remove('ws-bin--yes', 'ws-bin--no'), 600));

  const status = document.getElementById('ws-status');
  if (status) {
    const rightBin = _bins.find(b => b.scorerKey === item.expected);
    status.textContent = correct
      ? `✓ Yes! “${item.word}” goes in ${bin.label}.`
      : `✗ “${item.word}” belongs in ${rightBin?.label ?? 'the other box'}.`;
    status.className = `ws-status ${correct ? 'ws-status--yes' : 'ws-status--no'}`;
  }

  _timeouts.push(setTimeout(() => {
    _idx++;
    _renderCurrent();
  }, ADVANCE_MS));
}

function _finishRound() {
  if (_done) return;
  _done = true;

  const elapsed = Date.now() - _startTime;
  const result  = scoreWordSort({ placements: _placements, timeMs: elapsed });
  const { correctPlacements, total } = result.scoreBreakdown;

  if (result.correct) {
    celebrateCorrect();
    audio.playSfx('correct');
  }

  const misplaced = _placements.filter(p => p.expected !== p.placed);
  const missList = misplaced.map(p => {
    const rightBin = _bins.find(b => b.scorerKey === p.expected);
    return `<li>“${p.word}” → ${rightBin?.label ?? p.expected}</li>`;
  }).join('');

  const area = _els?.modeArea;
  if (!area) return;
  const summary = document.createElement('div');
  summary.className = 'ws-summary';
  summary.setAttribute('role', 'status');
  summary.innerHTML = `
    <div class="ws-summary-headline">${result.correct ? '🎉 Perfect sort!' : 'Good sorting!'}</div>
    <div class="ws-summary-score">${correctPlacements} of ${total} in the right box</div>
    ${missList ? `<ul class="ws-summary-misses">${missList}</ul>` : ''}
    ${result.hint ? `<p class="ws-summary-hint">💡 ${result.hint}</p>` : ''}
  `;
  area.querySelector('.ws-round')?.appendChild(summary);

  const wrap = document.createElement('div');
  wrap.className = 'vmcq-next-wrap';
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'btn btn--primary vmcq-next-btn';
  nextBtn.textContent = 'Next →';
  nextBtn.setAttribute('aria-label', 'Next round');
  wrap.appendChild(nextBtn);
  area.appendChild(wrap);
  nextBtn.addEventListener('click', () => {
    _els?.onResult(result.correct, elapsed);
  }, { once: true });
  nextBtn.focus();
}

export function getCurrentWord() {
  return _word;
}

export function cleanup() {
  _timeouts.forEach(id => clearTimeout(id));
  _timeouts = [];
  // Restore the shell's Say-It for the next mode.
  if (_els?.btnSayIt) _els.btnSayIt.style.display = '';
  _word = null;
  _els = null;
  _queue = [];
  _placements = [];
  _bins = [];
  _idx = 0;
  _locked = false;
  _done = false;
}
