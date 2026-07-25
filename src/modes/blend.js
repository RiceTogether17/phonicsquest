/**
 * Blend It! — Sequential Guided Mode  (ideal for beginners / new decoders)
 *
 * Step-by-step sound reveal with explicit scaffolding:
 * 1. Show word image + tip prompt
 * 2. Child presses "Next Sound" to reveal each phoneme one at a time
 * 3. Visual step-dots track progress
 * 4. After all sounds: explicit "Blend it!" call-to-action plays the word
 * 5. Self-assess
 *
 * Designed for parents and teachers introducing blending to new readers.
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';

let currentWord   = null;
let revealedCount = 0;
let blendStart    = 0;
let isRevealing   = false;
let _blendStyle   = 'cumulative'; // 'simultaneous' | 'cumulative'

// ── Setup ─────────────────────────────────────────────────────────────────

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupBlend(word, els) {
  currentWord   = word;
  revealedCount = 0;
  blendStart    = Date.now();
  isRevealing   = false;
  _blendStyle   = store.get('blendStyle') || 'cumulative';

  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';

  els.modeInstruction.textContent = 'Press "Next Sound" to hear each sound — then blend!';

  // Phoneme row: all hidden at start
  renderPhonemes(word, els.phonemeRow, { showDiacritics: true, revealedIndices: [] });

  _renderControls(els, word, 'initial');

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = 'none';
  els.btnSkip.style.display  = '';

  if (store.get('autoplay')) {
    setTimeout(() => _revealNext(word, els), 700);
  }
}

// ── Controls rendering ────────────────────────────────────────────────────

function _renderControls(els, word, stage) {
  const total = word.graphemes.length;

  // Step dots
  const dots = Array.from({ length: total }, (_, i) => {
    const filled = i < revealedCount ? 'filled' : '';
    const active = i === revealedCount ? 'current' : '';
    return `<span class="step-dot ${filled} ${active}" aria-hidden="true"></span>`;
  }).join('');

  const dotsHtml = `
    <div class="step-dots" aria-label="Progress: ${revealedCount} of ${total} sounds revealed">
      ${dots}
    </div>
  `;

  if (stage === 'initial' || stage === 'revealing') {
    const remaining = total - revealedCount;
    const btnLabel  = revealedCount === 0
      ? '▶ First Sound'
      : remaining === 1 ? '▶ Last Sound' : '▶ Next Sound';

    const styleBtns = revealedCount === 0 ? ['simultaneous', 'cumulative'].map(s => {
      const label = { simultaneous: '🔤 Sound by Sound', cumulative: '🔗 Build It Up' }[s];
      const desc  = {
        simultaneous: 'Play each sound on its own, then the word',
        cumulative:   'Blend each new sound with the ones before it',
      }[s];
      const active = _blendStyle === s ? 'speed-btn--active' : '';
      return `<button class="speed-btn ${active}" data-blend-style="${s}" aria-label="${desc}" title="${desc}">${label}</button>`;
    }).join('') : '';

    els.modeArea.innerHTML = /* html */`
      <div class="blend-guided-wrap">
        <div class="blend-tip" id="blend-tip" aria-live="polite">
          ${revealedCount === 0
            ? '👂 Listen to each sound and say it out loud!'
            : `Sound ${revealedCount} of ${total} — keep going!`}
        </div>
        ${dotsHtml}
        ${styleBtns ? `
        <div class="speed-row" role="group" aria-label="Blending style">
          <span class="speed-label">Blend:</span>
          <div class="speed-btns">${styleBtns}</div>
        </div>
        ` : ''}
        <button class="btn btn--primary btn--xl blend-next-btn" id="btn-reveal-next"
                aria-label="${btnLabel}">
          ${btnLabel}
        </button>
      </div>
    `;

    document.getElementById('btn-reveal-next')?.addEventListener('click', () => {
      _revealNext(word, els);
    });

    els.modeArea.querySelectorAll('[data-blend-style]').forEach(btn => {
      btn.addEventListener('click', () => {
        _blendStyle = btn.dataset.blendStyle;
        store.set('blendStyle', _blendStyle);
        els.modeArea.querySelectorAll('[data-blend-style]').forEach(b => {
          b.classList.toggle('speed-btn--active', b.dataset.blendStyle === _blendStyle);
        });
      });
    });

  } else if (stage === 'blend') {
    els.modeArea.innerHTML = /* html */`
      <div class="blend-guided-wrap">
        <div class="blend-blend-cta" id="blend-cta">
          🔗 Now put them together!
        </div>
        ${dotsHtml}
        <button class="btn btn--success btn--xl" id="btn-blend-now"
                aria-label="Blend all sounds together">
          🔊 Blend it!
        </button>
      </div>
    `;

    document.getElementById('btn-blend-now')?.addEventListener('click', () => {
      _doBlend(word, els);
    });

    if (store.get('autoplay')) {
      setTimeout(() => _doBlend(word, els), 500);
    }

  } else if (stage === 'assess') {
    els.modeArea.innerHTML = /* html */`
      <div class="blend-guided-wrap">
        <div class="blend-assess-prompt">Did you blend it right?</div>
        ${dotsHtml}
        <div class="blend-assess-btns">
          <button class="btn btn--success btn--xl" id="btn-self-yes">Yes! ✓</button>
          <button class="btn btn--ghost btn--xl"   id="btn-self-no">Not yet</button>
        </div>
      </div>
    `;

    document.getElementById('btn-self-yes')?.addEventListener('click', () => {
      els.onResult(true, Date.now() - blendStart);
    });
    document.getElementById('btn-self-no')?.addEventListener('click', () => {
      els.onResult(false, Date.now() - blendStart);
    });
  }
}

// ── Reveal logic ──────────────────────────────────────────────────────────

async function _revealNext(word, els) {
  if (isRevealing || revealedCount >= word.graphemes.length) return;
  isRevealing = true;

  revealedCount++;
  const idx = revealedCount - 1;

  // Update phoneme display
  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    revealedIndices: Array.from({ length: revealedCount }, (_, i) => i),
  });

  // Play the new sound — in cumulative (successive-blending) style each
  // reveal repeats the chunk so far, says the new sound, then blends them
  // ("li" · "s(t)" · "list") instead of playing the sound alone.
  if (_blendStyle === 'cumulative' && idx > 0) {
    await audio.speakChunk(word, idx);
    await _delay(150);
    await audio.speakPhoneme(word.graphemes[idx], word.types[idx], {
      word: word.word, prevGrapheme: word.graphemes[idx - 1],
    });
    await _delay(150);
    await audio.speakChunk(word, idx + 1);
  } else {
    const prevGrapheme = idx > 0 ? word.graphemes[idx - 1] : null;
    await audio.speakPhoneme(word.graphemes[idx], word.types[idx], { word: word.word, prevGrapheme });
  }
  await _delay(200);

  isRevealing = false;

  if (revealedCount >= word.graphemes.length) {
    // All revealed → go to blend stage
    _renderControls(els, word, 'blend');
  } else {
    _renderControls(els, word, 'revealing');
    if (store.get('autoplay')) {
      await _delay(400);
      _revealNext(word, els);
    }
  }
}

async function _doBlend(word, els) {
  // Show all tiles with labels
  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    showLabels: true,
    revealedIndices: null,
  });

  // Animated sweep: highlight each phoneme tile in sequence
  await _animateBlendSweep(els.phonemeRow, word);

  // Build word animation
  buildWordAnimation(word, els.wordDisplay);

  // Brief pause then say the blended word
  await _delay(300);
  await audio.speakWord(word.word);

  els.btnSayIt.style.display = '';

  _renderControls(els, word, 'assess');
}

/**
 * Animate a left-to-right highlight sweep across phoneme tiles.
 * Each tile lights up in sequence, then all glow together at the end.
 */
async function _animateBlendSweep(phonemeRow, word) {
  const tiles = phonemeRow.querySelectorAll('.phoneme-tile');
  if (!tiles.length) return;

  const perTile = Math.max(200, Math.min(500, 1200 / tiles.length));

  if (_blendStyle === 'cumulative') {
    // Successive blending: each step repeats the chunk so far, says the new
    // sound, then blends them ("l · i · li", "li · s(t) · list"), with the
    // highlight bar growing as each blended chunk lands.
    if (tiles.length < 2) {
      tiles[0].classList.add('blend-highlight');
      await audio.speakPhoneme(word.graphemes[0], word.types[0], { word: word.word });
      await _delay(perTile);
    } else {
      for (let i = 1; i < tiles.length; i++) {
        tiles.forEach((t, ti) => t.classList.toggle('blend-highlight', ti < i));
        await audio.speakChunk(word, i);
        await _delay(150);

        tiles.forEach((t, ti) => t.classList.toggle('blend-highlight', ti === i));
        await audio.speakPhoneme(word.graphemes[i], word.types[i], {
          word: word.word, prevGrapheme: word.graphemes[i - 1],
        });
        await _delay(150);

        tiles.forEach((t, ti) => t.classList.toggle('blend-highlight', ti <= i));
        await audio.speakChunk(word, i + 1);
        await _delay(perTile);
      }
    }
    tiles.forEach(t => t.classList.remove('blend-highlight'));
  } else {
    // Sequential highlight
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].classList.add('blend-highlight');
      const prev = i > 0 ? word.graphemes[i - 1] : null;
      await audio.speakPhoneme(word.graphemes[i], word.types[i], { word: word.word, prevGrapheme: prev });
      await _delay(perTile);
      tiles[i].classList.remove('blend-highlight');
    }
  }

  // Flash all together for the "blend" moment
  tiles.forEach(t => t.classList.add('blend-highlight-all'));
  await _delay(400);
  tiles.forEach(t => t.classList.remove('blend-highlight-all'));
}

const _delay = ms => new Promise(r => setTimeout(r, ms));

// ── Exports ───────────────────────────────────────────────────────────────

export function getCurrentWord() { return currentWord; }

export function cleanup() {
  currentWord   = null;
  revealedCount = 0;
  isRevealing   = false;
}
