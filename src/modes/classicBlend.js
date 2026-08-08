/**
 * Listen & Blend — Free Mode  (for confident learners, parents & teachers)
 *
 * Shows ALL phoneme tiles immediately, then plays sounds on demand.
 * No step-by-step hand-holding — ideal for fluent learners and whole-class
 * teacher modelling where the goal is fluency and speed.
 *
 * Features:
 *  • Category selector — pick any word group freely
 *  • Speed control — Slow / Normal / Fast playback
 *  • Self-assessment after first play
 *
 * For step-by-step guided blending use "Blend It!" instead.
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { WORD_GROUPS, BLENDING_GROUP_ORDER, STRUCT_GROUP_ORDER, SUFFIX_GROUP_ORDER } from '../data/words.js';

/** @type {import('../data/words.js').Word|null} */
let currentWord = null;
let isPlaying   = false;
let startTime   = 0;
let _speed      = 'normal'; // 'slow' | 'normal' | 'fast'
let _blendStyle = 'simultaneous'; // 'simultaneous' | 'cumulative'

/** Inter-phoneme delay (ms) per speed setting */
const SPEED_DELAY = { slow: 600, normal: 320, fast: 120 };

/**
 * Set up Classic Blend mode for a word.
 * @param {import('../data/words.js').Word} word
 * @param {object} els  DOM element references + callbacks
 */
export function setupClassicBlend(word, els) {
  currentWord = word;
  isPlaying = false;
  startTime = Date.now();
  _blendStyle = store.get('blendStyle') || 'simultaneous';

  renderWordImage(word, els.wordEmoji, true);

  // Clear the assembled-word tiles. This mode shows only the emoji + the
  // labelled phoneme row; it never populates #word-display itself. Without
  // this, a previous mode/word's buildWordAnimation tiles linger on screen
  // (e.g. "prong") next to the current word's phoneme tiles (e.g. "list"),
  // showing two different words at once. _cleanupMode() clears no DOM, so
  // every mode is responsible for resetting the regions it doesn't own.
  els.wordDisplay.innerHTML = '';

  els.modeInstruction.textContent = 'Listen to each sound — then blend!';

  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    showLabels: true,
    revealedIndices: null,
  });

  _renderControls(els, word);

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = 'none';
  els.btnSkip.style.display = '';

  if (store.get('autoplay')) {
    setTimeout(() => _playSounds(word, els), 500);
  }
}

// ── Category selector ─────────────────────────────────────────────────────

function _buildGroupOptions() {
  const savedGroup = store.get('currentGroup') || '';
  const allSelected = !savedGroup ? 'selected' : '';

  const opt = (key, g) => {
    const sel = savedGroup === key ? 'selected' : '';
    return `<option value="${key}" ${sel}>${g.icon} ${g.label}</option>`;
  };

  return [
    `<option value="" ${allSelected}>🔤 All Words</option>`,
    `<optgroup label="── By Vowel Sound ──">`,
    ...BLENDING_GROUP_ORDER.map(key => opt(key, WORD_GROUPS[key])),
    `</optgroup>`,
    `<optgroup label="── By Word Pattern ──">`,
    ...STRUCT_GROUP_ORDER.map(key => opt(key, WORD_GROUPS[key])),
    `</optgroup>`,
    `<optgroup label="── By Suffix ──">`,
    ...SUFFIX_GROUP_ORDER.map(key => opt(key, WORD_GROUPS[key])),
    `</optgroup>`,
  ].join('');
}

// ── Controls rendering ────────────────────────────────────────────────────

function _renderControls(els, word, played = false) {
  const speedBtns = ['slow', 'normal', 'fast'].map(s => {
    const label = { slow: '🐢 Slow', normal: '▶ Normal', fast: '⚡ Fast' }[s];
    const active = _speed === s ? 'speed-btn--active' : '';
    return `<button class="speed-btn ${active}" data-speed="${s}" aria-label="Set speed to ${s}">${label}</button>`;
  }).join('');

  const styleBtns = ['simultaneous', 'cumulative'].map(s => {
    const label = { simultaneous: '🔤 Sound by Sound', cumulative: '🔗 Build It Up' }[s];
    const desc  = {
      simultaneous: 'Play each sound on its own, then the word',
      cumulative:   'Blend each new sound with the ones before it',
    }[s];
    const active = _blendStyle === s ? 'speed-btn--active' : '';
    return `<button class="speed-btn ${active}" data-blend-style="${s}" aria-label="${desc}" title="${desc}">${label}</button>`;
  }).join('');

  els.modeArea.innerHTML = `
    <div class="classic-blend-wrap">

      <!-- Category selector -->
      <div class="category-row">
        <label class="category-label" for="classic-group-select">Category:</label>
        <select id="classic-group-select" class="category-select" aria-label="Choose word category">
          ${_buildGroupOptions()}
        </select>
      </div>

      <!-- Speed control -->
      <div class="speed-row" role="group" aria-label="Playback speed">
        <span class="speed-label">Speed:</span>
        <div class="speed-btns">${speedBtns}</div>
      </div>

      <!-- Blending style -->
      <div class="speed-row" role="group" aria-label="Blending style">
        <span class="speed-label">Blend:</span>
        <div class="speed-btns">${styleBtns}</div>
      </div>

      <!-- Play buttons -->
      <div class="classic-btn-row">
        <button class="btn btn--primary btn--xl" id="btn-classic-play" aria-label="Play all sounds">
          ▶ Play Sounds
        </button>
        ${played ? `
        <button class="btn btn--ghost btn--xl" id="btn-classic-again" aria-label="Play again">
          🔁 Again
        </button>
        ` : ''}
      </div>

      <!-- Self-assessment (after first play) -->
      ${played ? `
      <div class="classic-assess-row">
        <button class="btn btn--success btn--xl" id="btn-self-yes" aria-label="Yes, I blended it!">
          Yes! ✓
        </button>
        <button class="btn btn--ghost btn--xl" id="btn-self-no" aria-label="Not quite yet">
          Not yet
        </button>
      </div>
      ` : ''}

    </div>
  `;

  // Category change → notify app to reload with new group
  document.getElementById('classic-group-select')?.addEventListener('change', (e) => {
    const group = e.target.value || null;
    store.set('currentGroup', group);
    els.onGroupChange?.(group);
  });

  document.getElementById('btn-classic-play')?.addEventListener('click', () => {
    _playSounds(word, els);
  });

  document.getElementById('btn-classic-again')?.addEventListener('click', () => {
    _playSounds(word, els);
  });

  document.getElementById('btn-self-yes')?.addEventListener('click', () => {
    els.onResult(true, Date.now() - startTime);
  });

  document.getElementById('btn-self-no')?.addEventListener('click', () => {
    els.onResult(false, Date.now() - startTime);
  });

  // Speed buttons
  els.modeArea.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _speed = btn.dataset.speed;
      els.modeArea.querySelectorAll('.speed-btn').forEach(b => {
        b.classList.toggle('speed-btn--active', b.dataset.speed === _speed);
      });
    });
  });

  // Blend-style buttons
  els.modeArea.querySelectorAll('[data-blend-style]').forEach(btn => {
    btn.addEventListener('click', () => {
      _blendStyle = btn.dataset.blendStyle;
      store.set('blendStyle', _blendStyle);
      els.modeArea.querySelectorAll('[data-blend-style]').forEach(b => {
        b.classList.toggle('speed-btn--active', b.dataset.blendStyle === _blendStyle);
      });
    });
  });
}

// ── Playback ──────────────────────────────────────────────────────────────

async function _playSounds(word, els) {
  if (isPlaying) return;
  isPlaying = true;

  const tiles = els.phonemeRow.querySelectorAll('.phoneme-tile');
  const delay = SPEED_DELAY[_speed] ?? 320;

  if (_blendStyle === 'cumulative') {
    // Successive blending: each step repeats the chunk so far, says the new
    // sound, then blends them — "l · i · li", "li · s(t) · list". The final
    // blended chunk IS the whole word, so no separate word playback.
    if (word.graphemes.length < 2) {
      tiles.forEach(t => t.classList.add('active'));
      await audio.speakWord(word.word);
    } else {
      for (let i = 1; i < word.graphemes.length; i++) {
        // Chunk so far
        tiles.forEach((t, ti) => t.classList.toggle('active', ti < i));
        await audio.speakChunk(word, i);
        await _delay(Math.min(delay, 200));

        // New sound on its own
        tiles.forEach((t, ti) => t.classList.toggle('active', ti === i));
        await audio.speakPhoneme(word.graphemes[i], word.types[i], {
          word: word.word, prevGrapheme: word.graphemes[i - 1],
        });
        await _delay(Math.min(delay, 200));

        // Blend them together
        tiles.forEach((t, ti) => t.classList.toggle('active', ti <= i));
        await audio.speakChunk(word, i + 1);
        await _delay(delay);
      }
    }
    tiles.forEach(t => t.classList.remove('active'));
  } else {
    for (let i = 0; i < word.graphemes.length; i++) {
      // Highlight current tile
      tiles.forEach((t, ti) => t.classList.toggle('active', ti === i));

      // Play this phoneme's audio
      const prevGrapheme = i > 0 ? word.graphemes[i - 1] : null;
      await audio.speakPhoneme(word.graphemes[i], word.types[i], { word: word.word, prevGrapheme });
      await _delay(delay);
    }

    tiles.forEach(t => t.classList.remove('active'));

    await _delay(Math.min(delay, 300));
    await audio.speakWord(word.word);
  }

  isPlaying = false;

  _renderControls(els, word, true);
  els.btnSayIt.style.display = '';
}

const _delay = ms => new Promise(r => setTimeout(r, ms));

/** @returns {import('../data/words.js').Word|null} */
export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  isPlaying = false;
}
