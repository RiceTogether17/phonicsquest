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

import { STORIES, BAND_META, LEVEL_META } from '../data/stories.js';
import { isHFW, extractStoryHFW } from '../data/hfw.js';
import { WORDS } from '../data/words.js';
import { audio } from '../modules/audio.js';
import { runStoryQuest } from './storyQuest.js';
import {
  startRecording, stopRecording, playRecording, deleteRecording,
  stopPlayback, cleanupRecording, getRecorderState,
  saveFluencyAttempt, getFluencyHistory, getBestWcpm,
} from '../modules/storyRecording.js';

const BASE = import.meta.env.BASE_URL;

// ── Helpers ───────────────────────────────────────────────────────────────

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
let _activeBand  = 'A';       // 'A' | 'B' | 'C' | 'D'
let _activeTab   = 'band';   // 'band' | 'singapore' | 'chapter'
let _readMode    = 'aloud';   // 'aloud' | 'decode'
let _speaking    = false;
let _activeWord  = null;      // for decode panel
let _decodePanelEl = null;    // ref to the decode panel DOM node
let _currentStoryVocab = [];  // vocab words for current story (used in decode panel)
let _currentStory = null;     // story being read (for markStoryRead on TTS finish)

// Word-follow highlighting mode for Read Aloud
let _followMode = 'line';     // 'line' | 'word'  (word = line + word highlight inside)
let _boundarySupported = null; // null = untested, true/false after first TTS attempt

// Echo-read state
let _echoLineIdx  = -1;       // current echo-read line index (-1 = not active)
let _echoStory    = null;     // story reference during echo-read

// ── Story completion tracking ─────────────────────────────────────────────
const READ_KEY = 'giri_stories_read';

function getReadStories() {
  try { return JSON.parse(localStorage.getItem(READ_KEY) ?? '[]'); } catch { return []; }
}

function markStoryRead(id) {
  const read = getReadStories();
  if (!read.includes(id)) {
    read.push(id);
    localStorage.setItem(READ_KEY, JSON.stringify(read));
  }
}

// Fluency timer state
let _fluencyTimer   = null;
let _fluencyStart   = null;
let _fluencyRunning = false;

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
  _stopFluencyTimer();
  cleanupRecording();
  _activeWord = null;
  // Remove body-level decode panel if it exists
  if (_decodePanelEl && _decodePanelEl.parentNode === document.body) {
    _decodePanelEl.remove();
  }
  _decodePanelEl = null;
  _echoLineIdx = -1;
  _echoStory = null;
}

// ── Browser view ──────────────────────────────────────────────────────────

function _renderBrowser() {
  // ── Category tabs ──────────────────────────────────────────────────────
  const categoryTabsHtml = /* html */`
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${_activeTab === 'band'      ? ' active' : ''}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${_activeTab === 'singapore' ? ' active' : ''}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${_activeTab === 'chapter'   ? ' active' : ''}" data-cat="chapter">📚 Chapters</button>
    </div>
  `;

  let innerHtml = '';

  if (_activeTab === 'band') {
    // ── Band tabs + cards ─────────────────────────────────────────────
    const bandMeta = BAND_META.find(m => m.band === _activeBand) ?? BAND_META[0];
    const stories = STORIES.filter(s => s.band === _activeBand && s.category !== 'chapter' && s.category !== 'nonfiction-sg');

    const read = getReadStories();
    const readCount = stories.filter(s => read.includes(s.id)).length;

    const bandTabsHtml = BAND_META.map(m => /* html */`
      <button
        class="story-tab${m.band === _activeBand ? ' active' : ''}"
        data-band="${m.band}"
        style="--tab-color:${m.color}"
      >
        <span class="story-tab-num">${m.band}</span>
        <span class="story-tab-name">${m.label}</span>
      </button>
    `).join('');

    const cardsHtml = stories.map(s => _storyCardHtml(s, bandMeta, false, read.includes(s.id))).join('');
    const progressPct = stories.length ? Math.round((readCount / stories.length) * 100) : 0;

    innerHtml = /* html */`
      <div class="stories-tabs" role="tablist" aria-label="Reading bands">${bandTabsHtml}</div>
      <div class="stories-level-strip"
           style="--level-color:${bandMeta.color};--level-bg:${bandMeta.bg}">
        <span class="slstrip-label">Band ${_activeBand}</span>
        <span class="slstrip-name">${bandMeta.label}</span>
        <span class="slstrip-sounds">${bandMeta.targetSounds}</span>
        <span class="slstrip-prop">${bandMeta.prop}</span>
        <span class="slstrip-progress" title="${readCount} of ${stories.length} stories read">
          ${readCount}/${stories.length} read
          <span class="slstrip-progress-bar" style="--pct:${progressPct}%"></span>
        </span>
      </div>
      <div class="story-cards-grid">${cardsHtml}</div>
    `;
  } else if (_activeTab === 'singapore') {
    // ── Singapore specials ─────────────────────────────────────────────
    const sgStories = STORIES.filter(s => s.category === 'nonfiction-sg');
    const read = getReadStories();
    const cardsHtml = sgStories.map(s => {
      const meta = BAND_META.find(m => m.band === s.band) ?? BAND_META[0];
      return _storyCardHtml(s, meta, false, read.includes(s.id));
    }).join('');

    innerHtml = /* html */`
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${cardsHtml}</div>
    `;
  } else {
    // ── Chapter stories ────────────────────────────────────────────────
    const chapterStories = STORIES.filter(s => s.category === 'chapter').sort(
      (a, b) => (a.chapterNum ?? 0) - (b.chapterNum ?? 0),
    );
    const read = getReadStories();
    const cardsHtml = chapterStories.map(s => {
      const meta = BAND_META.find(m => m.band === s.band) ?? BAND_META[0];
      return _storyCardHtml(s, meta, true, read.includes(s.id));
    }).join('');

    innerHtml = /* html */`
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${cardsHtml}</div>
    `;
  }

  _container.innerHTML = /* html */`
    <div class="stories-browser">
      ${categoryTabsHtml}
      ${innerHtml}
    </div>
  `;

  // Category tab listeners
  _container.querySelectorAll('.sb-cat-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeTab = btn.dataset.cat;
      _renderBrowser();
    });
  });

  // Band tab listeners (only in band tab)
  _container.querySelectorAll('.story-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeBand = btn.dataset.band;
      _renderBrowser();
    });
  });

  // Story card click
  _container.querySelectorAll('.story-card').forEach(btn => {
    btn.addEventListener('click', () => _showReader(btn.dataset.storyId));
  });
}

/** Build a story card button element HTML */
function _storyCardHtml(story, levelMeta, isChapter = false, isRead = false) {
  const questBadge = story.comprehension?.length
    ? '<span class="story-card-quest-badge">⭐ Quest</span>'
    : '';
  const chapterBadge = isChapter
    ? `<span class="story-card-chapter-badge">Ch. ${story.chapterNum}</span>`
    : '';
  const readBadge = isRead
    ? '<span class="story-card-read-badge" title="Story read">✓</span>'
    : '';
  return /* html */`
    <button class="story-card${isChapter ? ' story-card--chapter' : ''}${isRead ? ' story-card--read' : ''}" data-story-id="${story.id}">
      <div class="story-card-illo" style="background:${levelMeta.bg}">
        <img
          src="${BASE}images/stories/${story.illustration}"
          alt="${story.title}"
          class="story-card-mascot"
          draggable="false"
          loading="lazy"
        />
        ${chapterBadge}
        ${readBadge}
      </div>
      <span class="story-card-title">${story.title}</span>
      <div class="story-card-meta">
        <span class="story-card-level" style="color:${levelMeta.color}">Band ${story.band ?? 'A'}</span>
        ${questBadge}
      </div>
    </button>
  `;
}

// ── Reader view ───────────────────────────────────────────────────────────

function _showReader(storyId) {
  const story = STORIES.find(s => s.id === storyId);
  if (!story) return;
  _stopTTS();
  _renderReader(story);
}

function _renderReader(story) {
  const levelMeta = BAND_META.find(m => m.band === story.band) ?? BAND_META[(story.level ?? 1) - 1];

  _container.innerHTML = /* html */`
    <div class="story-reader">

      <!-- Illustration header -->
      <div class="story-illo" style="--level-color:${levelMeta.color};--level-bg:${levelMeta.bg}">
        <img src="${BASE}images/stories/${story.illustration}" alt="${story.title}"
             class="story-illo-mascot" draggable="false"/>
        <div class="story-illo-steam"><span></span><span></span><span></span></div>
      </div>

      <!-- Meta bar -->
      <div class="story-meta-bar" style="--level-color:${levelMeta.color}">
        <button class="btn btn--ghost story-lib-btn" id="btn-reader-back">← Library</button>
        <span class="story-meta-badge">Band ${story.band ?? 'A'} · ${levelMeta.label}</span>
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

/** Count the words in a story's spoken text */
function _countStoryWords(story) {
  return story.lines
    .filter(l => l.type !== 'label' && l.type !== 'chapter' && l.text)
    .reduce((acc, l) => acc + l.text.trim().split(/\s+/).length, 0);
}

function _renderReadAloud(story) {
  const dynamic = document.getElementById('story-dynamic');
  if (!dynamic) return;

  // Use word spans when follow mode is 'word'
  const useWordSpans = _followMode === 'word';
  const linesHtml = story.lines.map((line, i) => _lineHtml(line, i, useWordSpans)).join('');
  const hasQuest  = !!story.comprehension?.length;
  const hasTalk   = !!story.talkAboutIt?.length;

  // Talk About It section (Band A mini-decodables)
  const talkHtml = hasTalk ? /* html */`
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${story.talkAboutIt.map(q => `<li>${q}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  // Fluency history for this story
  const historyAttempts = getFluencyHistory(story.id);
  const bestWcpm = getBestWcpm(story.id);
  const historyHtml = historyAttempts.length > 0 ? /* html */`
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent Attempts</span>
        ${bestWcpm !== null ? `<span class="fluency-history-best">Best: <strong>${bestWcpm}</strong> wpm</span>` : ''}
      </div>
      <div class="fluency-history-list">
        ${historyAttempts.slice().reverse().map(a => {
          const d = new Date(a.date);
          const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
          return `<span class="fluency-history-item">${dateStr}: <strong>${a.wcpm}</strong> wpm</span>`;
        }).join('')}
      </div>
    </div>
  ` : '';

  dynamic.innerHTML = /* html */`
    <!-- Story text column -->
    <div class="story-content-wrap">
      <!-- Follow-mode toggle -->
      <div class="follow-mode-toggle">
        <span class="follow-mode-label">Highlight:</span>
        <button class="follow-mode-btn${_followMode === 'line' ? ' active' : ''}" data-follow="line">Line</button>
        <button class="follow-mode-btn${_followMode === 'word' ? ' active' : ''}" data-follow="word">Line + Word</button>
      </div>

      <div class="story-body" id="story-body" aria-live="polite">${linesHtml}</div>
      ${talkHtml}
    </div>

    <!-- Controls sidebar column -->
    <div class="story-controls-wrap">
      <div class="story-tts-bar">
        <button class="btn btn--primary btn--xl" id="btn-story-play" aria-label="Read aloud">
          ▶ Read Aloud
        </button>
        <button class="btn btn--ghost btn--xl" id="btn-story-stop" style="display:none" aria-label="Stop">
          ⏹ Stop
        </button>
      </div>

      <!-- Fluency timer section (collapsible) -->
      <details class="story-tool-section fluency-bar" id="fluency-bar">
        <summary class="story-tool-summary fluency-summary">
          <span class="fluency-label">⏱ Fluency Read</span>
          <span class="fluency-hint">Time your reading speed</span>
        </summary>
        <div class="story-tool-body">
          <div class="fluency-controls">
            <button class="btn btn--ghost" id="btn-fluency-start">▶ Start timer</button>
            <span class="fluency-clock" id="fluency-clock" aria-live="polite">0:00</span>
            <button class="btn btn--primary" id="btn-fluency-done" disabled>✓ Done</button>
          </div>
          <div class="fluency-result" id="fluency-result" hidden></div>
          ${historyHtml}
        </div>
      </details>

      <!-- Recording controls (collapsible) -->
      <details class="story-tool-section recording-bar" id="recording-bar">
        <summary class="story-tool-summary recording-summary">
          <span class="recording-label">🎙 Record Reading</span>
          <span class="recording-hint">Record yourself reading aloud</span>
        </summary>
        <div class="story-tool-body">
          <div class="recording-controls" id="recording-controls">
            <button class="btn btn--ghost" id="btn-rec-start">🎙 Start Recording</button>
            <button class="btn btn--ghost btn--danger" id="btn-rec-stop" hidden>⏹ Stop</button>
            <button class="btn btn--ghost" id="btn-rec-play" hidden>▶ Play Back</button>
            <button class="btn btn--ghost btn--sm" id="btn-rec-delete" hidden>🗑 Delete</button>
          </div>
          <div class="recording-status" id="recording-status"></div>
        </div>
      </details>

      <!-- Echo Read section (collapsible) -->
      <details class="story-tool-section echo-read-bar" id="echo-read-bar">
        <summary class="story-tool-summary echo-read-summary">
          <span class="echo-read-label">🔁 Echo Read</span>
          <span class="echo-read-hint">Listen, then repeat each line</span>
        </summary>
        <div class="story-tool-body">
          <div class="echo-read-controls">
            <button class="btn btn--ghost" id="btn-echo-start">Start Echo Read</button>
            <button class="btn btn--ghost" id="btn-echo-next" hidden>Next Line →</button>
            <button class="btn btn--ghost" id="btn-echo-rec" hidden>🎙 Your Turn</button>
            <button class="btn btn--ghost" id="btn-echo-play" hidden>▶ Hear Yourself</button>
            <button class="btn btn--ghost btn--sm" id="btn-echo-stop" hidden>✕ Exit Echo Read</button>
          </div>
          <div class="echo-read-status" id="echo-read-status"></div>
        </div>
      </details>

      <!-- Story Quest CTA (shown after TTS or fluency) -->
      ${hasQuest ? /* html */`
        <div class="story-quest-cta" id="story-quest-cta" hidden>
          <div class="sq-cta-inner">
            <span class="sq-cta-icon">🌟</span>
            <div>
              <strong>Story Quest ready!</strong>
              <p>Check your understanding with questions, vocab, and grammar.</p>
            </div>
            <button class="btn btn--primary" id="btn-launch-quest">Start Quest →</button>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Follow-mode toggle
  dynamic.querySelectorAll('.follow-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _followMode = btn.dataset.follow;
      _renderReadAloud(story);
    });
  });

  document.getElementById('btn-story-play')?.addEventListener('click', () => _startTTS(story));
  document.getElementById('btn-story-stop')?.addEventListener('click', () => _stopTTS());

  // Fluency timer controls
  const wordCount = _countStoryWords(story);
  document.getElementById('btn-fluency-start')?.addEventListener('click', () => _startFluencyTimer());
  document.getElementById('btn-fluency-done')?.addEventListener('click', () => _stopFluencyTimer(wordCount, story));

  // Recording controls
  _wireRecordingControls(story);

  // Echo Read controls
  _wireEchoReadControls(story);

  // Story Quest launch
  document.getElementById('btn-launch-quest')?.addEventListener('click', () => {
    _stopTTS();
    _stopFluencyTimer();
    cleanupRecording();
    markStoryRead(story.id);
    runStoryQuest(_container, story, () => {
      _renderBrowser();
    });
  });
}

/**
 * Build HTML for a story line.
 * @param {object} line
 * @param {number} i – line index
 * @param {boolean} [wordSpans=false] – if true, wrap each word in a span for word-follow highlighting
 */
function _lineHtml(line, i, wordSpans = false) {
  const content = wordSpans ? _wordSpanText(line.text) : line.text;
  switch (line.type) {
    case 'chapter':   return `<div class="sline sline--chapter"   data-line="${i}">📚 ${content}</div>`;
    case 'label':     return `<div class="sline sline--label"     data-line="${i}">${content}</div>`;
    case 'beat':      return `<p class="sline sline--beat"        data-line="${i}">${content}</p>`;
    case 'intro':     return `<p class="sline sline--intro"       data-line="${i}">${content}</p>`;
    case 'refrain':   return `<div class="sline sline--refrain"   data-line="${i}">🫧 ${content}</div>`;
    case 'end':       return `<p class="sline sline--end"         data-line="${i}">${content}</p>`;
    case 'text':      return `<p class="sline sline--text"        data-line="${i}">${content}</p>`;
    case 'paragraph': return `<p class="sline sline--paragraph"   data-line="${i}">${content}</p>`;
    default:          return `<p class="sline"                    data-line="${i}">${content}</p>`;
  }
}

/** Wrap each word in a data-word-idx span for word-follow highlighting. */
function _wordSpanText(text) {
  if (!text) return '';
  const tokens = tokenise(text);
  let wordIdx = 0;
  return tokens.map(tok => {
    if (tok.type === 'word') {
      return `<span class="wf-word" data-word-idx="${wordIdx++}">${tok.text}</span>`;
    }
    return tok.text;
  }).join('');
}

// ── DECODE mode ───────────────────────────────────────────────────────────

function _renderDecodeMode(story) {
  const dynamic = document.getElementById('story-dynamic');
  if (!dynamic) return;

  // Store vocab for decode-panel lookup
  _currentStoryVocab = story.vocab ?? [];

  const hfwInStory = extractStoryHFW(story);

  // Pre-teach section — HFW chips
  const hfwChipsHtml = hfwInStory.map(w => /* html */`
    <button class="hfw-chip" data-word="${w}" aria-label="Hear sight word ${w}">
      ⭐ ${w}
    </button>
  `).join('');

  // Pre-teach section — Vocab key-word chips (words that appear in story text)
  const storyText = story.lines.map(l => l.text ?? '').join(' ').toLowerCase();
  const vocabToPreteach = _currentStoryVocab.filter(v => {
    const firstWord = v.word.toLowerCase().split(/\s+/)[0];
    return storyText.includes(firstWord);
  });
  const vocabChipsHtml = vocabToPreteach.map(v => /* html */`
    <button class="vocab-chip" data-word="${v.word}" aria-label="Key word: ${v.word}">
      <span class="vocab-chip-icon">${v.icon}</span>
      <span class="vocab-chip-word">${v.word}</span>
      <span class="vocab-chip-meaning">${v.meaning}</span>
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
      text: 'sline--text', paragraph: 'sline--paragraph',
    }[line.type] ?? '';

    return `<p class="sline ${cls} decode-line" data-line="${lineIdx}">${tokenHtml}</p>`;
  }).join('');

  dynamic.innerHTML = /* html */`
    <!-- Story text column -->
    <div class="story-content-wrap">
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

      <!-- Key vocabulary pre-teach -->
      ${vocabChipsHtml.length ? /* html */`
      <div class="vocab-preteach" id="vocab-preteach">
        <div class="hfw-preteach-header">
          <span class="hfw-preteach-title">📚 Key Words — tap to hear</span>
          <button class="hfw-toggle-btn" id="btn-vocab-toggle" aria-expanded="true" aria-controls="vocab-chip-list">
            Hide ▲
          </button>
        </div>
        <div id="vocab-chip-list" class="vocab-chip-list">${vocabChipsHtml}</div>
      </div>
      ` : ''}

      <!-- Decode-mode story body -->
      <div class="story-body decode-body" id="story-body" aria-live="polite">
        ${storyBodyHtml}
      </div>
    </div>

    <!-- Controls sidebar column -->
    <div class="story-controls-wrap">
      <!-- Mark as read bar -->
      <div class="story-done-bar">
        <button class="btn btn--primary" id="btn-mark-read">✓ Mark story as read</button>
      </div>

      <!-- Decode panel (slides up when a word is tapped) -->
      <div class="decode-panel" id="decode-panel" aria-live="polite" hidden>
        <div class="decode-panel-inner" id="decode-panel-inner">
          <!-- filled dynamically -->
        </div>
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

  // Collapse/expand vocab section
  document.getElementById('btn-vocab-toggle')?.addEventListener('click', () => {
    const list = document.getElementById('vocab-chip-list');
    const btn  = document.getElementById('btn-vocab-toggle');
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

  // Vocab chip taps → read word aloud + expand meaning
  dynamic.querySelectorAll('.vocab-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const w = chip.dataset.word;
      _flashChip(chip);
      chip.classList.toggle('vocab-chip--expanded');
      const utt = new SpeechSynthesisUtterance(w);
      utt.rate = 0.85;
      utt.lang = 'en-GB';
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.speak(utt);
    });
  });

  // Mark as read
  document.getElementById('btn-mark-read')?.addEventListener('click', (e) => {
    markStoryRead(story.id);
    const btn = e.currentTarget;
    btn.textContent = '✓ Read!';
    btn.disabled = true;
    btn.classList.add('btn--success');
  });

  // Word tap → decode
  // Move decode panel to document.body so it escapes #app overflow:hidden
  const inlinePanel = document.getElementById('decode-panel');
  if (inlinePanel) {
    inlinePanel.remove();
    document.body.appendChild(inlinePanel);
  }
  _decodePanelEl = inlinePanel;
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

  _currentStory = story;
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

  // Word-boundary highlighting (progressive enhancement)
  if (_followMode === 'word') {
    _attachBoundaryListener(utt, seg.highlightIdx);
  }

  utt.onend  = () => {
    _clearWordHighlight();
    if (_speaking) setTimeout(() => _speakNext(segments, idx + 1), pauseMs);
  };
  utt.onerror = () => _onTTSDone();

  window.speechSynthesis.speak(utt);
}

/**
 * Attach a 'boundary' event listener to highlight individual words
 * within the active line during TTS playback.
 * Falls back gracefully if the browser/voice doesn't fire boundary events.
 */
function _attachBoundaryListener(utt, lineIndex) {
  const lineEl = _container?.querySelector(`[data-line="${lineIndex}"]`);
  if (!lineEl) return;

  const wordSpans = lineEl.querySelectorAll('.wf-word');
  if (wordSpans.length === 0) return;

  let wordIdx = 0;
  let boundaryFired = false;

  utt.addEventListener('boundary', (e) => {
    if (e.name !== 'word') return;
    boundaryFired = true;
    if (_boundarySupported === null) _boundarySupported = true;

    // Clear previous word highlight
    wordSpans.forEach(s => s.classList.remove('wf-word--active'));

    // charIndex-based matching: find the word span whose position matches
    if (wordIdx < wordSpans.length) {
      wordSpans[wordIdx].classList.add('wf-word--active');
      wordIdx++;
    }
  });

  // If no boundary events fire by the time the utterance ends,
  // mark boundary support as unavailable
  utt.addEventListener('end', () => {
    if (!boundaryFired && _boundarySupported === null) {
      _boundarySupported = false;
    }
  });
}

/** Remove word-level highlighting from all word spans. */
function _clearWordHighlight() {
  _container?.querySelectorAll('.wf-word--active').forEach(el => el.classList.remove('wf-word--active'));
}

function _highlightLine(lineIndex) {
  _container?.querySelectorAll('.sline--active').forEach(el => el.classList.remove('sline--active'));
  _clearWordHighlight();
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
  _clearWordHighlight();
  _toggleTTSButtons(false);
}

function _onTTSDone() {
  _speaking = false;
  _container?.querySelectorAll('.sline--active').forEach(el => el.classList.remove('sline--active'));
  _clearWordHighlight();
  _toggleTTSButtons(false);
  // Mark story as read when TTS finishes
  if (_currentStory) markStoryRead(_currentStory.id);
  // Reveal Story Quest CTA if story has quest data
  const cta = document.getElementById('story-quest-cta');
  if (cta) cta.hidden = false;
}

function _toggleTTSButtons(playing) {
  const play = document.getElementById('btn-story-play');
  const stop = document.getElementById('btn-story-stop');
  if (play) play.style.display = playing ? 'none' : '';
  if (stop) stop.style.display = playing ? ''     : 'none';
}

const _delay = ms => new Promise(r => setTimeout(r, ms));

// ── Recording controls ────────────────────────────────────────────────────

function _wireRecordingControls(story) {
  const btnStart  = document.getElementById('btn-rec-start');
  const btnStop   = document.getElementById('btn-rec-stop');
  const btnPlay   = document.getElementById('btn-rec-play');
  const btnDelete = document.getElementById('btn-rec-delete');
  const statusEl  = document.getElementById('recording-status');
  if (!btnStart) return;

  function updateUI(state) {
    btnStart.hidden  = state !== 'idle';
    btnStop.hidden   = state !== 'recording';
    btnPlay.hidden   = state !== 'recorded' && state !== 'playing';
    btnDelete.hidden = state !== 'recorded' && state !== 'playing';

    if (statusEl) {
      switch (state) {
        case 'recording': statusEl.textContent = '🔴 Recording...'; statusEl.className = 'recording-status recording-status--active'; break;
        case 'recorded':  statusEl.textContent = '✓ Recording ready'; statusEl.className = 'recording-status recording-status--ready'; break;
        case 'playing':   statusEl.textContent = '▶ Playing...'; statusEl.className = 'recording-status recording-status--playing'; break;
        case 'error':     statusEl.textContent = '⚠ Microphone not available — check permissions'; statusEl.className = 'recording-status recording-status--error'; break;
        default:          statusEl.textContent = ''; statusEl.className = 'recording-status'; break;
      }
    }

    // Update play button text
    if (btnPlay) btnPlay.textContent = state === 'playing' ? '⏹ Stop' : '▶ Play Back';
  }

  btnStart.addEventListener('click', async () => {
    const started = await startRecording({
      storyId: story.id,
      onStateChange: updateUI,
    });
    if (!started) updateUI('error');
  });

  btnStop.addEventListener('click', () => {
    stopRecording();
  });

  btnPlay.addEventListener('click', () => {
    if (getRecorderState() === 'playing') {
      stopPlayback();
      updateUI('recorded');
    } else {
      playRecording();
    }
  });

  btnDelete.addEventListener('click', () => {
    deleteRecording();
    updateUI('idle');
  });
}

// ── Echo Read ──────────────────────────────────────────────────────────────

function _wireEchoReadControls(story) {
  const btnStart = document.getElementById('btn-echo-start');
  const btnNext  = document.getElementById('btn-echo-next');
  const btnRec   = document.getElementById('btn-echo-rec');
  const btnPlay  = document.getElementById('btn-echo-play');
  const btnExit  = document.getElementById('btn-echo-stop');
  const statusEl = document.getElementById('echo-read-status');
  if (!btnStart) return;

  // Filter to speakable lines only
  const speakableLines = story.lines
    .map((l, i) => ({ ...l, idx: i }))
    .filter(l => l.type !== 'label' && l.type !== 'chapter' && l.text);

  let currentEchoIdx = -1;
  let echoRecId = null;

  function resetEchoUI() {
    btnStart.hidden = false;
    btnNext.hidden = true;
    btnRec.hidden = true;
    btnPlay.hidden = true;
    btnExit.hidden = true;
    if (statusEl) { statusEl.textContent = ''; statusEl.className = 'echo-read-status'; }
    _container?.querySelectorAll('.sline--echo-active').forEach(el => el.classList.remove('sline--echo-active'));
    currentEchoIdx = -1;
    _echoLineIdx = -1;
  }

  function showEchoLine(echoIdx) {
    currentEchoIdx = echoIdx;
    const line = speakableLines[echoIdx];
    if (!line) { resetEchoUI(); return; }

    _echoLineIdx = line.idx;

    // Highlight the line
    _container?.querySelectorAll('.sline--echo-active').forEach(el => el.classList.remove('sline--echo-active'));
    const lineEl = _container?.querySelector(`[data-line="${line.idx}"]`);
    if (lineEl) {
      lineEl.classList.add('sline--echo-active');
      lineEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (statusEl) {
      statusEl.textContent = `Line ${echoIdx + 1} of ${speakableLines.length}`;
      statusEl.className = 'echo-read-status echo-read-status--active';
    }

    // App reads the line first
    btnNext.hidden = true;
    btnRec.hidden = true;
    btnPlay.hidden = true;
    const utt = new SpeechSynthesisUtterance(line.text);
    utt.rate = 0.82;
    utt.lang = 'en-GB';
    utt.onend = () => {
      // Now child's turn
      btnRec.hidden = false;
      btnRec.textContent = '🎙 Your Turn';
      if (statusEl) statusEl.textContent = `Your turn! Read line ${echoIdx + 1}`;
    };
    utt.onerror = () => {
      btnRec.hidden = false;
    };
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(utt);
  }

  btnStart.addEventListener('click', () => {
    btnStart.hidden = true;
    btnExit.hidden = false;
    echoRecId = null;
    showEchoLine(0);
  });

  btnRec.addEventListener('click', async () => {
    if (getRecorderState() === 'recording') {
      stopRecording();
      return;
    }
    const line = speakableLines[currentEchoIdx];
    const started = await startRecording({
      storyId: story.id,
      lineIdx: line?.idx,
      onStateChange: (state) => {
        if (state === 'recording') {
          btnRec.textContent = '⏹ Stop Recording';
          if (statusEl) { statusEl.textContent = '🔴 Recording...'; statusEl.className = 'echo-read-status echo-read-status--recording'; }
        } else if (state === 'recorded') {
          btnRec.hidden = true;
          btnPlay.hidden = false;
          btnNext.hidden = currentEchoIdx >= speakableLines.length - 1;
          if (statusEl) { statusEl.textContent = '✓ Great job!'; statusEl.className = 'echo-read-status echo-read-status--done'; }
        } else if (state === 'error') {
          if (statusEl) { statusEl.textContent = '⚠ Microphone not available'; statusEl.className = 'echo-read-status echo-read-status--error'; }
        }
      },
    });
    if (!started && statusEl) {
      statusEl.textContent = '⚠ Microphone not available — check permissions';
      statusEl.className = 'echo-read-status echo-read-status--error';
    }
  });

  btnPlay.addEventListener('click', () => {
    playRecording();
  });

  btnNext.addEventListener('click', () => {
    deleteRecording(); // clear previous line's recording
    btnPlay.hidden = true;
    if (currentEchoIdx + 1 < speakableLines.length) {
      showEchoLine(currentEchoIdx + 1);
    } else {
      if (statusEl) { statusEl.textContent = '🎉 Echo Read complete!'; statusEl.className = 'echo-read-status echo-read-status--done'; }
      btnNext.hidden = true;
      btnRec.hidden = true;
      setTimeout(resetEchoUI, 2000);
    }
  });

  btnExit.addEventListener('click', () => {
    _stopTTS();
    stopRecording();
    deleteRecording();
    resetEchoUI();
  });
}

// ── Fluency Timer ─────────────────────────────────────────────────────────

function _startFluencyTimer() {
  if (_fluencyRunning) return;
  _fluencyRunning = true;
  _fluencyStart   = Date.now();
  document.getElementById('btn-fluency-start').disabled = true;
  document.getElementById('btn-fluency-done').disabled  = false;

  _fluencyTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - _fluencyStart) / 1000);
    const mins  = Math.floor(elapsed / 60);
    const secs  = elapsed % 60;
    const clock = document.getElementById('fluency-clock');
    if (clock) clock.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
  }, 500);
}

/**
 * Stop the fluency timer and display WCPM result.
 * @param {number} [wordCount] – total words in story; if omitted, skips WCPM display
 * @param {object} [story] – story object for saving fluency history
 */
function _stopFluencyTimer(wordCount, story) {
  if (!_fluencyRunning && _fluencyTimer === null) return;
  clearInterval(_fluencyTimer);
  _fluencyTimer   = null;
  _fluencyRunning = false;

  document.getElementById('btn-fluency-start').disabled = false;
  document.getElementById('btn-fluency-done').disabled  = true;

  if (!wordCount || !_fluencyStart) return;

  const elapsedSec = (Date.now() - _fluencyStart) / 1000;
  _fluencyStart = null;
  if (elapsedSec < 2) return; // Ignore accidental taps

  const wcpm   = Math.round((wordCount / elapsedSec) * 60);
  const mins   = Math.floor(elapsedSec / 60);
  const secs   = Math.round(elapsedSec % 60);

  // Save to fluency history
  if (story) {
    saveFluencyAttempt({
      storyId: story.id,
      wcpm,
      durationSec: elapsedSec,
      wordCount,
    });
  }

  // Benchmark guidance (Hasbrouck & Tindal norms, Grade 1 Spring ≈ 53 WCPM)
  let level = '';
  if (wcpm >= 60)      level = '🌟 Fluent reader!';
  else if (wcpm >= 40) level = '📈 Building fluency — great progress!';
  else                  level = '📖 Keep practising — try reading it again!';

  const result = document.getElementById('fluency-result');
  if (result) {
    result.hidden = false;
    result.innerHTML = /* html */`
      <div class="fluency-result-inner">
        <span class="fluency-time">Time: ${mins}:${String(secs).padStart(2, '0')}</span>
        <span class="fluency-wcpm"><strong>${wcpm}</strong> words/min</span>
        <span class="fluency-level">${level}</span>
      </div>
      <p class="fluency-tip">Tip: Read the story again to improve your speed!</p>
    `;
    // Show Quest CTA now too
    const cta = document.getElementById('story-quest-cta');
    if (cta) cta.hidden = false;
  }
}
