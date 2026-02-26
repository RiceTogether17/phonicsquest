/**
 * Giri Stories — Story browser and reader
 *
 * Two reading modes:
 *  📖 Read Aloud  — TTS reads the whole story, paragraph by paragraph,
 *                   highlighting each line as it's spoken.
 *  🔤 Decode      — Each word is tappable. Decodable words are broken into
 *                   phonemes and spoken one-by-one. Sight words are read
 *                   aloud immediately with a ⭐ badge. A pre-teach panel
 *                   shows every sight word in the story before reading starts.
 */

import { STORIES, LEVEL_META } from '../data/stories.js';
import { isHFW, extractStoryHFW } from '../data/hfw.js';
import { WORDS } from '../data/words.js';
import { audio } from '../modules/audio.js';

const BASE = import.meta.env.BASE_URL;

// ── Helpers ───────────────────────────────────────────────────────────────

function mascotSrc(state) {
  const MAP = {
    neutral:   'giri-neutral.png',
    celebrate: 'giri-celebrate.png',
    confetti:  'giri-celebrate-confetti.png',
    clap:      'giri-clap-frame.png',
    encourage: 'giri-encourage.png',
    holdCard:  'giri-hold-card.png',
    pointLeft: 'giri-point-left.png',
    pointRight:'giri-point-right.png',
    thinking:  'giri-thinking.png',
    trophy:    'giri-trophy.png',
    whiteboard:'giri-whiteboard.png',
  };
  return `${BASE}images/mascot/${MAP[state] ?? MAP.neutral}`;
}

/** Look up a word token in the word bank (case/punct insensitive). */
function lookupWord(token) {
  const clean = token.toLowerCase().replace(/[^a-z]/g, '');
  return WORDS.find(w => w.word === clean) ?? null;
}

/**
 * Tokenise a text string into word / punctuation / space chunks.
 * @returns {Array<{text:string, type:'word'|'punct'|'space'}>}
 */
function tokenise(text) {
  const parts = text.split(/(\s+|["""'',.!?;:()\-]+)/);
  return parts
    .filter(p => p.length > 0)
    .map(p => ({
      text: p,
      type: /^\s+$/.test(p) ? 'space' : /^[^a-zA-Z0-9]+$/.test(p) ? 'punct' : 'word',
    }));
}

// ── Module state ──────────────────────────────────────────────────────────

let _container   = null;
let _onGoHome    = null;
let _activeLevel = 1;
let _readMode    = 'aloud';   // 'aloud' | 'decode'
let _speaking    = false;
let _activeWord  = null;      // for decode panel
let _decodePanelEl = null;    // ref to the decode panel DOM node

// ── Public API ────────────────────────────────────────────────────────────

export function initStoryMode(container, onGoHome) {
  _container = container;
  _onGoHome  = onGoHome;
}

export function showBrowser() {
  _stopTTS();
  _renderBrowser();
}

export function cleanupStoryMode() {
  _stopTTS();
  _activeWord = null;
  _decodePanelEl = null;
}

// ── Browser view ──────────────────────────────────────────────────────────

function _renderBrowser() {
  const levelMeta = LEVEL_META[_activeLevel - 1];
  const stories   = STORIES.filter(s => s.level === _activeLevel);

  const tabsHtml = LEVEL_META.map(m => /* html */`
    <button
      class="story-tab${m.level === _activeLevel ? ' active' : ''}"
      data-level="${m.level}"
      style="--tab-color:${m.color}"
    >
      <span class="story-tab-num">L${m.level}</span>
      <span class="story-tab-name">${m.label}</span>
    </button>
  `).join('');

  const cardsHtml = stories.map(s => /* html */`
    <button class="story-card" data-story-id="${s.id}">
      <div class="story-card-illo" style="background:${levelMeta.bg}">
        <img
          src="${mascotSrc(s.mascotState)}"
          alt="Giri"
          class="story-card-mascot"
          draggable="false"
        />
        <span class="story-card-prop">${s.emoji}</span>
      </div>
      <span class="story-card-title">${s.title}</span>
      <span class="story-card-level" style="color:${levelMeta.color}">Level ${s.level}</span>
    </button>
  `).join('');

  _container.innerHTML = /* html */`
    <div class="stories-browser">
      <div class="stories-tabs" role="tablist" aria-label="Story levels">${tabsHtml}</div>
      <div class="stories-level-strip"
           style="--level-color:${levelMeta.color};--level-bg:${levelMeta.bg}">
        <span class="slstrip-label">Level ${_activeLevel}</span>
        <span class="slstrip-name">${levelMeta.label}</span>
        <span class="slstrip-sounds">${levelMeta.targetSounds}</span>
        <span class="slstrip-prop">${levelMeta.prop}</span>
      </div>
      <div class="story-cards-grid">${cardsHtml}</div>
    </div>
  `;

  _container.querySelectorAll('.story-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeLevel = parseInt(btn.dataset.level, 10);
      _renderBrowser();
    });
  });

  _container.querySelectorAll('.story-card').forEach(btn => {
    btn.addEventListener('click', () => _showReader(btn.dataset.storyId));
  });
}

// ── Reader view ───────────────────────────────────────────────────────────

function _showReader(storyId) {
  const story = STORIES.find(s => s.id === storyId);
  if (!story) return;
  _stopTTS();
  _renderReader(story);
}

function _renderReader(story) {
  const levelMeta = LEVEL_META[story.level - 1];

  _container.innerHTML = /* html */`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${levelMeta.color};--level-bg:${levelMeta.bg}">
        <img src="${mascotSrc(story.mascotState)}" alt="Giri — ${story.title}"
             class="story-illo-mascot" draggable="false"/>
        <span class="story-illo-prop">${story.emoji}</span>
        <div class="story-illo-steam"><span></span><span></span><span></span></div>
      </div>

      <!-- Meta bar -->
      <div class="story-meta-bar" style="--level-color:${levelMeta.color}">
        <button class="btn btn--ghost story-lib-btn" id="btn-reader-back">← Library</button>
        <span class="story-meta-badge">Level ${story.level} · ${levelMeta.label}</span>
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${story.title}</h2>

      <!-- Mode toggle -->
      <div class="story-mode-toggle" role="group" aria-label="Reading mode">
        <button class="smode-btn${_readMode === 'aloud'  ? ' active' : ''}" data-mode="aloud"  id="btn-mode-aloud">
          📖 Read Aloud
        </button>
        <button class="smode-btn${_readMode === 'decode' ? ' active' : ''}" data-mode="decode" id="btn-mode-decode">
          🔤 Decode Mode
        </button>
      </div>

      <!-- Dynamic content area (pre-teach + story body + controls) -->
      <div id="story-dynamic" class="story-dynamic"></div>

    </div>
  `;

  document.getElementById('btn-reader-back')?.addEventListener('click', () => {
    _stopTTS();
    _renderBrowser();
  });

  document.getElementById('btn-mode-aloud')?.addEventListener('click', () => {
    _readMode = 'aloud';
    _stopTTS();
    _setModeToggle('aloud');
    _renderReadAloud(story);
  });

  document.getElementById('btn-mode-decode')?.addEventListener('click', () => {
    _readMode = 'decode';
    _stopTTS();
    _setModeToggle('decode');
    _renderDecodeMode(story);
  });

  // Render current mode
  if (_readMode === 'aloud') {
    _renderReadAloud(story);
  } else {
    _renderDecodeMode(story);
  }
}

function _setModeToggle(mode) {
  document.querySelectorAll('.smode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
}

// ── READ ALOUD mode ───────────────────────────────────────────────────────

function _renderReadAloud(story) {
  const dynamic = document.getElementById('story-dynamic');
  if (!dynamic) return;

  const linesHtml = story.lines.map((line, i) => _lineHtml(line, i)).join('');

  dynamic.innerHTML = /* html */`
    <div class="story-body" id="story-body" aria-live="polite">${linesHtml}</div>
    <div class="story-tts-bar">
      <button class="btn btn--primary btn--xl" id="btn-story-play" aria-label="Read aloud">
        ▶ Read Aloud
      </button>
      <button class="btn btn--ghost btn--xl" id="btn-story-stop" style="display:none" aria-label="Stop">
        ⏹ Stop
      </button>
    </div>
  `;

  document.getElementById('btn-story-play')?.addEventListener('click', () => _startTTS(story));
  document.getElementById('btn-story-stop')?.addEventListener('click', () => _stopTTS());
}

function _lineHtml(line, i) {
  switch (line.type) {
    case 'label':   return `<div class="sline sline--label" data-line="${i}">${line.text}</div>`;
    case 'beat':    return `<p class="sline sline--beat"  data-line="${i}">${line.text}</p>`;
    case 'intro':   return `<p class="sline sline--intro" data-line="${i}">${line.text}</p>`;
    case 'refrain': return `<div class="sline sline--refrain" data-line="${i}">🫧 ${line.text}</div>`;
    case 'end':     return `<p class="sline sline--end"   data-line="${i}">${line.text}</p>`;
    default:        return `<p class="sline" data-line="${i}">${line.text}</p>`;
  }
}

// ── DECODE mode ───────────────────────────────────────────────────────────

function _renderDecodeMode(story) {
  const dynamic = document.getElementById('story-dynamic');
  if (!dynamic) return;

  const hfwInStory = extractStoryHFW(story);

  // Pre-teach section
  const hfwChipsHtml = hfwInStory.map(w => /* html */`
    <button class="hfw-chip" data-word="${w}" aria-label="Hear sight word ${w}">
      ⭐ ${w}
    </button>
  `).join('');

  // Build clickable story body
  const storyBodyHtml = story.lines.map((line, lineIdx) => {
    if (line.type === 'label') {
      return `<div class="sline sline--label" data-line="${lineIdx}">${line.text}</div>`;
    }
    if (line.type === 'refrain') {
      return `<div class="sline sline--refrain" data-line="${lineIdx}">🫧 ${line.text}</div>`;
    }
    // All other types: tokenise into clickable words
    const tokens = tokenise(line.text);
    const tokenHtml = tokens.map(tok => {
      if (tok.type === 'word') {
        const cleanWord = tok.text.toLowerCase().replace(/[^a-z]/g, '');
        const hfw = isHFW(cleanWord);
        return `<button class="decode-word${hfw ? ' decode-hfw' : ''}"
                         data-word="${tok.text}"
                         aria-label="${hfw ? 'Sight word: ' : 'Decode: '}${tok.text}"
                >${tok.text}</button>`;
      }
      return `<span class="decode-punct">${tok.text}</span>`;
    }).join('');

    const cls = {
      intro: 'sline--intro', beat: 'sline--beat', end: 'sline--end',
    }[line.type] ?? '';

    return `<p class="sline ${cls} decode-line" data-line="${lineIdx}">${tokenHtml}</p>`;
  }).join('');

  dynamic.innerHTML = /* html */`
    <!-- Sight word pre-teach -->
    <div class="hfw-preteach" id="hfw-preteach">
      <div class="hfw-preteach-header">
        <span class="hfw-preteach-title">⭐ Sight Words in this story</span>
        <button class="hfw-toggle-btn" id="btn-hfw-toggle" aria-expanded="true" aria-controls="hfw-chip-list">
          Hide ▲
        </button>
      </div>
      <div id="hfw-chip-list" class="hfw-chip-list">
        ${hfwChipsHtml.length
          ? hfwChipsHtml
          : '<span class="hfw-none">None — all words are fully decodable!</span>'}
        <p class="hfw-tip">Tap each word to hear it. These words are read aloud in the story.</p>
      </div>
    </div>

    <!-- Decode-mode story body -->
    <div class="story-body decode-body" id="story-body" aria-live="polite">
      ${storyBodyHtml}
    </div>

    <!-- Decode panel (slides up when a word is tapped) -->
    <div class="decode-panel" id="decode-panel" aria-live="polite" hidden>
      <div class="decode-panel-inner" id="decode-panel-inner">
        <!-- filled dynamically -->
      </div>
    </div>
  `;

  // Collapse/expand HFW section
  document.getElementById('btn-hfw-toggle')?.addEventListener('click', () => {
    const list = document.getElementById('hfw-chip-list');
    const btn  = document.getElementById('btn-hfw-toggle');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    list.hidden  = expanded;
    btn.setAttribute('aria-expanded', String(!expanded));
    btn.textContent = expanded ? 'Show ▼' : 'Hide ▲';
  });

  // HFW chip taps → just read the word aloud
  dynamic.querySelectorAll('.hfw-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const w = chip.dataset.word;
      _flashChip(chip);
      const utt = new SpeechSynthesisUtterance(w);
      utt.rate = 0.85;
      utt.lang = 'en-GB';
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.speak(utt);
    });
  });

  // Word tap → decode
  _decodePanelEl = document.getElementById('decode-panel');
  dynamic.querySelectorAll('.decode-word').forEach(btn => {
    btn.addEventListener('click', () => _handleWordTap(btn));
  });
}

async function _handleWordTap(wordBtn) {
  // Clear previous active
  document.querySelectorAll('.decode-word.decoding').forEach(b => b.classList.remove('decoding'));
  wordBtn.classList.add('decoding');

  const rawWord = wordBtn.dataset.word;
  const clean   = rawWord.toLowerCase().replace(/[^a-z]/g, '');
  // Check word bank first — a word that can be decoded should never be shown
  // as a sight word, even if it also appears in the HFW list.
  const wordObj = lookupWord(rawWord);
  const hfw     = !wordObj && isHFW(clean);

  const panel = _decodePanelEl;
  if (!panel) return;

  panel.removeAttribute('hidden');

  if (hfw) {
    // ── Sight word ──
    _showDecodePanel({ type: 'hfw', word: clean });
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.85;
    utt.lang = 'en-GB';
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(utt);
  } else if (wordObj) {
    // ── Decodable word from bank ──
    _showDecodePanel({ type: 'decode', word: wordObj.word, wordObj });
    await _speakPhonemes(wordObj);
  } else {
    // ── Word not in bank → TTS only ──
    _showDecodePanel({ type: 'tts', word: clean });
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.85;
    utt.lang = 'en-GB';
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(utt);
  }
}

function _showDecodePanel({ type, word, wordObj }) {
  const inner = document.getElementById('decode-panel-inner');
  if (!inner) return;

  if (type === 'hfw') {
    inner.innerHTML = /* html */`
      <div class="dp-hfw">
        <span class="dp-sight-badge">⭐ Sight Word</span>
        <span class="dp-word">${word}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `;
    document.getElementById('dp-hear')?.addEventListener('click', () => {
      const utt = new SpeechSynthesisUtterance(word);
      utt.rate = 0.85;
      utt.lang = 'en-GB';
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.speak(utt);
    });
    return;
  }

  if (type === 'tts') {
    inner.innerHTML = /* html */`
      <div class="dp-tts">
        <span class="dp-word">${word}</span>
        <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
      </div>
    `;
    document.getElementById('dp-hear')?.addEventListener('click', () => {
      const utt = new SpeechSynthesisUtterance(word);
      utt.rate = 0.85;
      utt.lang = 'en-GB';
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.speak(utt);
    });
    return;
  }

  // type === 'decode'
  const TYPE_COLORS = {
    c: '#3b82f6', sv: '#ef4444', lv: '#22c55e', d: '#a855f7',
    bl: '#f97316', rc: '#ec4899', dp: '#0d9488', se: '#94a3b8',
  };

  const tilesHtml = wordObj.graphemes.map((g, i) => {
    const color = TYPE_COLORS[wordObj.types[i]] ?? '#6c63ff';
    return `<span class="dp-tile" data-idx="${i}" style="--tile-color:${color}">${g}</span>`;
  }).join('');

  inner.innerHTML = /* html */`
    <div class="dp-decode">
      <div class="dp-tiles" id="dp-tiles">${tilesHtml}</div>
      <span class="dp-word" id="dp-word-label">${wordObj.word}</span>
      <button class="dp-hear-btn" id="dp-hear">🔊 Hear again</button>
    </div>
  `;

  document.getElementById('dp-hear')?.addEventListener('click', async () => {
    await _speakPhonemes(wordObj);
  });
}

async function _speakPhonemes(wordObj) {
  const tiles = document.querySelectorAll('.dp-tile');
  for (let i = 0; i < wordObj.graphemes.length; i++) {
    tiles.forEach((t, ti) => t.classList.toggle('dp-tile--active', ti === i));
    await audio.speakPhoneme(wordObj.graphemes[i], wordObj.types[i]);
    await _delay(200);
  }
  tiles.forEach(t => t.classList.remove('dp-tile--active'));
  await _delay(250);
  // Blend: say the full word
  const wordLabel = document.getElementById('dp-word-label');
  if (wordLabel) wordLabel.classList.add('dp-word--blend');
  try {
    await audio.speakWord(wordObj.word);
  } finally {
    if (wordLabel) wordLabel.classList.remove('dp-word--blend');
  }
}

function _flashChip(chip) {
  chip.classList.add('hfw-chip--flash');
  setTimeout(() => chip.classList.remove('hfw-chip--flash'), 500);
}

// ── TTS (Read Aloud mode) ─────────────────────────────────────────────────

function _buildSegments(story) {
  const segments = [];
  const lines = story.lines;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.type === 'label') {
      const next = lines[i + 1];
      if (next && next.type === 'beat') {
        segments.push({ text: `${line.text} ${next.text}`, highlightIdx: i + 1 });
        i += 2;
        continue;
      }
      i++;
      continue;
    }
    segments.push({ text: line.text, highlightIdx: i });
    i++;
  }
  return segments;
}

function _startTTS(story) {
  if (!window.speechSynthesis) return;
  _stopTTS();

  _toggleTTSButtons(true);
  _speaking = true;

  const segments = _buildSegments(story);
  _speakNext(segments, 0);
}

function _speakNext(segments, idx) {
  if (!_speaking || idx >= segments.length) {
    _onTTSDone();
    return;
  }

  const seg = segments[idx];
  _highlightLine(seg.highlightIdx);

  const utt  = new SpeechSynthesisUtterance(seg.text);
  utt.rate   = 0.82;
  utt.lang   = 'en-GB';
  const pauseMs = seg.text.startsWith('Puff') ? 600 : 380;

  utt.onend  = () => { if (_speaking) setTimeout(() => _speakNext(segments, idx + 1), pauseMs); };
  utt.onerror = () => _onTTSDone();

  window.speechSynthesis.speak(utt);
}

function _highlightLine(lineIndex) {
  _container?.querySelectorAll('.sline--active').forEach(el => el.classList.remove('sline--active'));
  const el = _container?.querySelector(`[data-line="${lineIndex}"]`);
  if (el) {
    el.classList.add('sline--active');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function _stopTTS() {
  _speaking = false;
  window.speechSynthesis?.cancel();
  _container?.querySelectorAll('.sline--active').forEach(el => el.classList.remove('sline--active'));
  _toggleTTSButtons(false);
}

function _onTTSDone() {
  _speaking = false;
  _container?.querySelectorAll('.sline--active').forEach(el => el.classList.remove('sline--active'));
  _toggleTTSButtons(false);
}

function _toggleTTSButtons(playing) {
  const play = document.getElementById('btn-story-play');
  const stop = document.getElementById('btn-story-stop');
  if (play) play.style.display = playing ? 'none' : '';
  if (stop) stop.style.display = playing ? ''     : 'none';
}

const _delay = ms => new Promise(r => setTimeout(r, ms));
