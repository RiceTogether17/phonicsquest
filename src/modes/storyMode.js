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

import { STORIES, BAND_META } from '../data/stories.js';
import { isHFW, extractStoryHFW } from '../data/hfw.js';
import { WORDS } from '../data/words.js';
import { audio } from '../modules/audio.js';
import { runStoryQuest } from './storyQuest.js';
import { mapCharIndexToWord, isOffscreen } from '../modules/karaokeUtils.js';
import { lookupWord as lookupWordForDetective, addWordToReview } from '../modules/wordDetective.js';
import { modalManager } from '../modules/modalManager.js';
import { unlockFriend, isFriendUnlocked, getRosterSummary, friendFromStory } from '../modules/storyFriends.js';
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
// Karaoke read-aloud follows individual words by default (rule 6 — accessibility
// is first-class). Hydrated from PREFS_FOLLOW_KEY further down so the value
// survives reloads; defaults to 'word' on first run.
let _followMode = 'word'; // 'line' | 'word'
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
  // C3 — every story has a co-star. Finishing the story unlocks the
  // friend (a one-shot narrative reward; pure charter-safe collectible
  // since it's earned by reading, not bought).
  unlockFriend(id);
}

// Fluency timer state
let _fluencyTimer   = null;
let _fluencyStart   = null;
let _fluencyRunning = false;

// ── Structured-literacy preferences (per-device localStorage) ─────────────
// Visual scaffolds — child/teacher can switch them off when no longer needed.

const PREFS_GRAPHEMES_KEY = 'giri_show_graphemes';
const PREFS_RULER_KEY     = 'giri_show_ruler';
const PREFS_FOLLOW_KEY    = 'giri_follow_mode';
const PREFS_DETECTIVE_KEY = 'giri_detective_mode';
const MEET_WORDS_KEY      = 'giri_meet_words';
const COMP_LOG_KEY        = 'giri_comp_log';

let _showGraphemes = _loadPref(PREFS_GRAPHEMES_KEY, true);
let _showRuler     = _loadPref(PREFS_RULER_KEY, false);
// Word Detective is opt-in (default OFF) so the dominant tap-action stays
// "repeat the word" (karaoke). Turn on to make taps open the breakdown card.
let _detectiveMode = _loadPref(PREFS_DETECTIVE_KEY, false);

// Hydrate the karaoke follow-mode from prefs now that PREFS_FOLLOW_KEY is in
// scope. Defaults to 'word' (declared above) so first-run users get karaoke
// out of the box without having to discover the toggle.
_followMode = _loadPref(PREFS_FOLLOW_KEY, 'word');

function _loadPref(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}

function _persistPref(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Meet-the-Words gate state ─────────────────────────────────────────────
// Tracks which stories have had their pre-teach panel completed today so
// the gate appears once-per-story-per-day in both Read Aloud and Decode
// mode. Stale entries (> 30 days) are dropped on the next read.

const _gatePassedSession = new Set();

function _todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function _readMeetWordsMap() {
  try {
    const raw = localStorage.getItem(MEET_WORDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function _writeMeetWordsMap(map) {
  try { localStorage.setItem(MEET_WORDS_KEY, JSON.stringify(map)); } catch {}
}

export function _isMeetWordsCompletedToday(storyId) {
  if (_gatePassedSession.has(storyId)) return true;
  return _readMeetWordsMap()[storyId] === _todayStr();
}

export function _setMeetWordsCompleted(storyId) {
  _gatePassedSession.add(storyId);
  const map = _readMeetWordsMap();
  map[storyId] = _todayStr();
  // Drop entries older than 30 days
  const cutoffMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
  for (const [k, v] of Object.entries(map)) {
    if (!v || Date.parse(v) < cutoffMs) delete map[k];
  }
  _writeMeetWordsMap(map);
}

// ── Comprehension micro-check state ───────────────────────────────────────
// Once-per-story-per-session, shown after the story is read. Implements the
// "ask quick comprehension questions after reading" principle as an oral
// self-check (the way a teacher would coach it) rather than an MCQ test —
// stories don't carry MCQ distractor data for the open-ended talkAboutIt
// prompts, so a self-check is more honest and still surfaces the question.

const _compShownSession = new Set();
const COMP_LOG_CAP = 100;

export function _logComprehensionAttempt(entry) {
  try {
    const raw = localStorage.getItem(COMP_LOG_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ ts: Date.now(), ...entry });
    while (list.length > COMP_LOG_CAP) list.shift();
    localStorage.setItem(COMP_LOG_KEY, JSON.stringify(list));
  } catch {}
}

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
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${_renderFriendsCount()}</button>
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

  // Category tab listeners. The Friends pill is a sibling button but
  // doesn't switch tabs — it opens the gallery modal instead.
  _container.querySelectorAll('.sb-cat-tab[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeTab = btn.dataset.cat;
      _renderBrowser();
    });
  });
  document.getElementById('btn-open-friends')?.addEventListener('click', () => {
    _openFriendsGallery();
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
    _renderModeOrGate(story);
  });

  document.getElementById('btn-mode-decode')?.addEventListener('click', () => {
    _readMode = 'decode';
    _stopTTS();
    _setModeToggle('decode');
    _renderModeOrGate(story);
  });

  // Render current mode — but first show Meet-the-Words gate if not done today.
  // The gate teaches sight words + key vocabulary before any reading begins,
  // so beginning readers can decode in context rather than guess at unfamiliar
  // words. Once passed (today, this story), both modes load the reader directly.
  _renderModeOrGate(story);
}

function _renderModeOrGate(story) {
  if (_isMeetWordsCompletedToday(story.id)) {
    if (_readMode === 'aloud') _renderReadAloud(story);
    else _renderDecodeMode(story);
  } else {
    _renderMeetTheWordsGate(story);
  }
}

function _setModeToggle(mode) {
  document.querySelectorAll('.smode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
}

// ── MEET THE WORDS gate (pre-reading vocab + sight word introduction) ─────

function _renderMeetTheWordsGate(story) {
  const dynamic = document.getElementById('story-dynamic');
  if (!dynamic) return;

  _currentStoryVocab = story.vocab ?? [];
  const hfwInStory = extractStoryHFW(story);

  // Filter vocab to words actually appearing in the story text
  const storyText = story.lines.map(l => l.text ?? '').join(' ').toLowerCase();
  const vocabToPreteach = _currentStoryVocab.filter(v => {
    const firstWord = v.word.toLowerCase().split(/\s+/)[0];
    return storyText.includes(firstWord);
  });

  // Nothing to pre-teach? Skip the gate silently.
  if (!hfwInStory.length && !vocabToPreteach.length) {
    _setMeetWordsCompleted(story.id);
    _renderModeOrGate(story);
    return;
  }

  const totalChips = hfwInStory.length + vocabToPreteach.length;
  // Gate softening (audit fix #8): require a 3-tap warm-up rather than
  // every chip, so the child gets to the story in seconds without losing
  // the priming benefit. The skip button stays available for returning
  // readers who already know all the words.
  const WARMUP_TARGET = 3;
  const targetTaps = Math.min(WARMUP_TARGET, totalChips);
  const tapped = new Set();

  const hfwChipsHtml = hfwInStory.map(w => /* html */`
    <button class="hfw-chip" data-tap-id="hfw:${w}" data-word="${w}" aria-label="Hear sight word ${w}">
      ⭐ ${w}
    </button>
  `).join('');

  const vocabChipsHtml = vocabToPreteach.map(v => /* html */`
    <button class="vocab-chip" data-tap-id="vocab:${v.word}" data-word="${v.word}" aria-label="Key word: ${v.word}">
      <span class="vocab-chip-icon">${v.icon}</span>
      <span class="vocab-chip-word">${v.word}</span>
      <span class="vocab-chip-meaning">${v.meaning}</span>
    </button>
  `).join('');

  dynamic.innerHTML = /* html */`
    <div class="meet-words-gate" role="region" aria-labelledby="gate-title">
      <h3 id="gate-title">🤝 Meet the Words</h3>
      <p class="gate-hello">
        Tap <strong>any ${targetTaps}</strong> to warm up — or skip if you already
        know them. Then read <strong>${story.title}</strong>.
      </p>

      ${hfwChipsHtml ? /* html */`
        <div class="gate-section">
          <div class="gate-section-title">⭐ Sight words in this story</div>
          <div class="hfw-chip-list">${hfwChipsHtml}</div>
        </div>
      ` : ''}

      ${vocabChipsHtml ? /* html */`
        <div class="gate-section">
          <div class="gate-section-title">📚 Key words to know</div>
          <div class="vocab-chip-list">${vocabChipsHtml}</div>
        </div>
      ` : ''}

      <div class="gate-continue-row">
        <span class="gate-progress" id="gate-progress" aria-live="polite">0 of ${targetTaps} tapped</span>
        <button class="btn btn--ghost" id="gate-skip" type="button">I know these →</button>
        <button class="btn btn--primary" id="gate-continue" type="button" disabled>Start Reading →</button>
      </div>
    </div>
  `;

  function recordTap(chip) {
    const id = chip.dataset.tapId;
    if (tapped.has(id)) return;
    tapped.add(id);
    chip.setAttribute('data-tapped', 'true');
    const progressEl = document.getElementById('gate-progress');
    if (progressEl) {
      progressEl.textContent = tapped.size >= targetTaps
        ? `✓ Warmed up (${tapped.size} tapped) — keep going or start the story`
        : `${tapped.size} of ${targetTaps} tapped`;
    }
    if (tapped.size >= targetTaps) {
      const continueBtn = document.getElementById('gate-continue');
      if (continueBtn) continueBtn.disabled = false;
    }
  }

  // Wire chip taps (HFW + vocab) — speak the word and mark as tapped.
  dynamic.querySelectorAll('.hfw-chip, .vocab-chip').forEach(chip => {
    chip.addEventListener('click', async () => {
      _flashChip(chip);
      try { await audio.speakWord(chip.dataset.word); } catch {}
      recordTap(chip);
    });
  });

  const proceed = () => {
    _setMeetWordsCompleted(story.id);
    _renderModeOrGate(story);
  };
  document.getElementById('gate-skip')?.addEventListener('click', proceed);
  document.getElementById('gate-continue')?.addEventListener('click', proceed);
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
  const linesHtml = story.lines.map((line, i) => _lineHtml(line, i, useWordSpans, story)).join('');
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
      <!-- Combined reading toolbar — Scaffolds + Highlight + Tap-a-word.
           Wraps to multiple rows on phones, lays out horizontally on tablet+
           so the story body claims its space back (audit findings #5, #6). -->
      <div class="story-reader-toolbar" role="group" aria-label="Reading controls">
        <div class="reader-scaffold-bar" role="group" aria-label="Reading scaffolds">
          <span class="scaffold-label">Scaffolds</span>
          <button class="scaffold-toggle" id="btn-toggle-graphemes" aria-pressed="${_showGraphemes}" title="Highlight the target sound in this story">🎨 Show sounds</button>
          <button class="scaffold-toggle" id="btn-toggle-ruler" aria-pressed="${_showRuler}" title="Underline the line being read to keep your eyes on track">📏 Reading ruler</button>
        </div>

        <div class="follow-mode-toggle">
          <span class="follow-mode-label">Highlight:</span>
          <button class="follow-mode-btn${_followMode === 'line' ? ' active' : ''}" data-follow="line"
                  title="Light up the whole line as Giri reads it.">Whole line</button>
          <button class="follow-mode-btn${_followMode === 'word' ? ' active' : ''}" data-follow="word"
                  title="Light up each word as Giri says it — karaoke style.">Word by word</button>
        </div>

        <div class="follow-mode-toggle">
          <span class="follow-mode-label">Tap a word:</span>
          <button class="follow-mode-btn${!_detectiveMode ? ' active' : ''}" data-detective="off" title="Tap a word to hear it">🔊 Hear it</button>
          <button class="follow-mode-btn${_detectiveMode ? ' active' : ''}" data-detective="on" title="Tap a word to see its sounds">🔍 Detective</button>
        </div>
      </div>

      <div class="story-body story-body--follow-${_followMode}${_showRuler ? ' story-ruler-on' : ''}" id="story-body" aria-live="polite">${linesHtml}</div>
      ${talkHtml}
    </div>

    <!-- Controls sidebar column -->
    <div class="story-controls-wrap">
      <div class="story-tts-bar">
        <button class="btn btn--primary btn--xl" id="btn-story-play" aria-label="Listen — play this story">
          ▶ Listen
        </button>
        <button class="btn btn--ghost btn--xl" id="btn-story-stop" style="display:none" aria-label="Stop listening">
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

  // Follow-mode toggle (persisted so karaoke preference sticks across stories)
  dynamic.querySelectorAll('.follow-mode-btn[data-follow]').forEach(btn => {
    btn.addEventListener('click', () => {
      _followMode = btn.dataset.follow;
      _persistPref(PREFS_FOLLOW_KEY, _followMode);
      _renderReadAloud(story);
    });
  });

  // Detective toggle — re-renders so the word spans pick up the new tap
  // behavior. Persisted so a teacher's "investigate this story together"
  // session carries across pages.
  dynamic.querySelectorAll('.follow-mode-btn[data-detective]').forEach(btn => {
    btn.addEventListener('click', () => {
      _detectiveMode = btn.dataset.detective === 'on';
      _persistPref(PREFS_DETECTIVE_KEY, _detectiveMode);
      _renderReadAloud(story);
    });
  });

  // Word tap behaviour: in karaoke mode (default) a tap replays the word
  // via TTS; in Detective mode it opens the breakdown card. Every span is
  // keyboard-accessible so the same flow works without a pointer.
  dynamic.querySelectorAll('.wf-word').forEach(span => {
    span.setAttribute('role', 'button');
    span.setAttribute('tabindex', '0');
    const handle = (ev) => {
      const word = (span.textContent || '').trim();
      if (!word) return;
      ev.preventDefault();
      if (_detectiveMode) {
        _openWordDetective(word);
      } else {
        _stopTTS();
        try { audio.speakWord(word); } catch (_) { /* ignore — no SFX */ }
      }
    };
    span.addEventListener('click', handle);
    span.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') handle(ev);
    });
  });

  // Show-sounds toggle (target-grapheme highlighting)
  document.getElementById('btn-toggle-graphemes')?.addEventListener('click', () => {
    _showGraphemes = !_showGraphemes;
    _persistPref(PREFS_GRAPHEMES_KEY, _showGraphemes);
    _renderReadAloud(story);
  });

  // Reading-ruler toggle
  document.getElementById('btn-toggle-ruler')?.addEventListener('click', () => {
    _showRuler = !_showRuler;
    _persistPref(PREFS_RULER_KEY, _showRuler);
    const btn  = document.getElementById('btn-toggle-ruler');
    const body = document.getElementById('story-body');
    btn?.setAttribute('aria-pressed', String(_showRuler));
    body?.classList.toggle('story-ruler-on', _showRuler);
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
 * Wrap target-grapheme substrings in a story-text segment with band-aware
 * spans so beginning readers can attach the eye to the new pattern. Single
 * vowels are matched everywhere; digraphs (ai/ee/oa/igh/oo…) match greedily
 * left-to-right longest-first; split digraphs ('a_e','i_e','o_e','u_e') only
 * match a vowel-consonant-e pattern at a word boundary, and wrap the vowel
 * and the silent e separately (different colours).
 *
 * @param {string} text
 * @param {string[]} targetGraphemes
 * @param {string}   band  – 'A'|'B'|'C'|'D'
 * @returns {string} HTML with grapheme spans
 */
export function _highlightGraphemes(text, targetGraphemes, band) {
  if (!_showGraphemes || !text || !targetGraphemes?.length || !band) return text;

  const ALPHA = /[a-z]/;
  const CONS  = /[bcdfghjklmnpqrstvwxyz]/;
  const lower = text.toLowerCase();

  const splits   = [];
  const digraphs = [];
  const vowels   = [];
  for (const g of targetGraphemes) {
    if (!g) continue;
    if (g.includes('_e')) splits.push(g[0].toLowerCase());
    else if (g.length >= 2) digraphs.push(g.toLowerCase());
    else vowels.push(g.toLowerCase());
  }
  digraphs.sort((a, b) => b.length - a.length);

  let out = '';
  let i = 0;
  while (i < text.length) {
    // Try split-digraph (e.g. 'a_e' → match v-C-e at word boundary)
    let matched = false;
    for (const v of splits) {
      if (lower[i] === v &&
          i + 2 < text.length &&
          CONS.test(lower[i + 1]) &&
          lower[i + 2] === 'e' &&
          (i + 3 >= text.length || !ALPHA.test(lower[i + 3]))) {
        out += `<span class="gph gph--${band} gph-vowel">${text[i]}</span>`;
        out += text[i + 1];
        out += `<span class="gph gph--${band} gph-silent">${text[i + 2]}</span>`;
        i += 3;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Try digraph (longest first)
    for (const g of digraphs) {
      if (lower.slice(i, i + g.length) === g) {
        out += `<span class="gph gph--${band} gph-digraph">${text.slice(i, i + g.length)}</span>`;
        i += g.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Try single vowel
    for (const v of vowels) {
      if (lower[i] === v) {
        out += `<span class="gph gph--${band} gph-vowel">${text[i]}</span>`;
        i += 1;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    out += text[i];
    i += 1;
  }
  return out;
}

/**
 * Build HTML for a story line.
 * @param {object} line
 * @param {number} i – line index
 * @param {boolean} [wordSpans=false] – if true, wrap each word in a span for word-follow highlighting
 * @param {object}  [story]            – the current story (for grapheme highlighting)
 */
function _lineHtml(line, i, wordSpans = false, story = null) {
  const baseText = line.text ?? '';
  const highlighted = story
    ? _highlightGraphemes(baseText, story.targetGraphemes, story.band)
    : baseText;
  const content = wordSpans ? _wordSpanText(baseText, story) : highlighted;
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
function _wordSpanText(text, story = null) {
  if (!text) return '';
  const tokens = tokenise(text);
  let wordIdx = 0;
  return tokens.map(tok => {
    if (tok.type === 'word') {
      const inner = story
        ? _highlightGraphemes(tok.text, story.targetGraphemes, story.band)
        : tok.text;
      return `<span class="wf-word" data-word-idx="${wordIdx++}">${inner}</span>`;
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
        const inner = _highlightGraphemes(tok.text, story.targetGraphemes, story.band);
        return `<button class="decode-word${hfw ? ' decode-hfw' : ''}"
                         data-word="${tok.text}"
                         aria-label="${hfw ? 'Sight word: ' : 'Decode: '}${tok.text}"
                >${inner}</button>`;
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
      <!-- Reading scaffold toggles -->
      <div class="reader-scaffold-bar" role="group" aria-label="Reading scaffolds">
        <span class="scaffold-label">Scaffolds</span>
        <button class="scaffold-toggle" id="btn-toggle-graphemes-decode" aria-pressed="${_showGraphemes}" title="Highlight the target sound in this story">🎨 Show sounds</button>
      </div>

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

  // Show-sounds toggle (target-grapheme highlighting) — re-renders this mode
  document.getElementById('btn-toggle-graphemes-decode')?.addEventListener('click', () => {
    _showGraphemes = !_showGraphemes;
    _persistPref(PREFS_GRAPHEMES_KEY, _showGraphemes);
    _renderDecodeMode(story);
  });

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
      _applyTtsVoice(utt);
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
      _applyTtsVoice(utt);
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
    // Surface a quick comprehension self-check after marking the story read
    _showComprehensionCheck(story);
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
    _applyTtsVoice(utt);
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
    _applyTtsVoice(utt);
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
      _applyTtsVoice(utt);
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
      _applyTtsVoice(utt);
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
    const prevGrapheme = i > 0 ? wordObj.graphemes[i - 1] : null;
    await audio.speakPhoneme(wordObj.graphemes[i], wordObj.types[i], { word: wordObj.word, prevGrapheme });
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
  _applyTtsVoice(utt);
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
 * within the active line during TTS playback. Uses the event's `charIndex`
 * to map back to the right word span — sturdier than a counter when a
 * voice fires multiple boundary events for one word (some Safari voices).
 * Falls back gracefully if the browser/voice doesn't fire boundary events.
 */
function _attachBoundaryListener(utt, lineIndex) {
  const lineEl = _container?.querySelector(`[data-line="${lineIndex}"]`);
  if (!lineEl) return;

  const wordSpans = lineEl.querySelectorAll('.wf-word');
  if (wordSpans.length === 0) return;

  const lineText = utt.text || '';
  let boundaryFired = false;
  let lastWordIdx = -1;
  let fallbackTimers = [];
  let fallbackStarted = false;

  function highlightWord(wordIdx) {
    if (wordIdx < 0 || wordIdx >= wordSpans.length) return;
    if (wordIdx === lastWordIdx) return;
    lastWordIdx = wordIdx;
    wordSpans.forEach(s => s.classList.remove('wf-word--active'));
    const active = wordSpans[wordIdx];
    active.classList.add('wf-word--active');
    _scrollIntoViewIfNeeded(active);
  }

  function clearFallback() {
    for (const t of fallbackTimers) clearTimeout(t);
    fallbackTimers = [];
  }

  // ── Per-word duration estimate ─────────────────────────────────────
  // Browsers that don't fire `boundary` events get a calibrated fallback:
  // schedule one setTimeout per word at the word's predicted start time.
  // Long words get more time than short ones — a fixed-interval timer
  // (the previous approach) drifts because "a" and "Giri" take very
  // different amounts of speech time.
  //
  // Calibration (empirical, English, normal cadence):
  //   per-word ms ≈ (90ms base + 60ms × character_count) / rate
  //   minimum 160ms so very short words still register visually.
  function startFallback() {
    if (fallbackStarted) return;
    fallbackStarted = true;
    const rate = typeof utt.rate === 'number' && utt.rate > 0 ? utt.rate : 0.82;
    // Use the actual word spans' text for length — story renderer
    // splits on whitespace and punctuation, matching the highlight
    // grain we want.
    const wordTexts = Array.from(wordSpans, s => (s.textContent || '').trim());
    let offset = 0;
    for (let i = 0; i < wordSpans.length; i++) {
      const wordIdx = i;
      const len = wordTexts[i]?.length || 3;
      const dur = Math.max(160, Math.round((90 + len * 60) / rate));
      const t = setTimeout(() => {
        if (boundaryFired) return;
        highlightWord(wordIdx);
      }, offset);
      fallbackTimers.push(t);
      offset += dur;
    }
  }

  utt.addEventListener('boundary', (e) => {
    if (e.name && e.name !== 'word') return;
    boundaryFired = true;
    if (_boundarySupported === null) _boundarySupported = true;
    // Real boundary events arrived → cancel any fallback timeouts so
    // we don't double-step the highlight.
    clearFallback();
    highlightWord(mapCharIndexToWord(lineText, e.charIndex ?? -1));
  });

  utt.addEventListener('end', () => {
    clearFallback();
    if (!boundaryFired && _boundarySupported === null) {
      _boundarySupported = false;
    }
  });

  // Anchor the fallback to when AUDIO actually starts, not when speak()
  // was queued — Chrome can have a 100ms queue delay, Safari can hit
  // 300-500ms on the first utterance of a session. Without this anchor
  // the highlight would lead the audio by that delay. After a small
  // grace period (so a real boundary event can declare boundary
  // support and skip the fallback entirely), schedule per-word
  // highlights.
  utt.addEventListener('start', () => {
    if (boundaryFired) return;
    const t = setTimeout(() => {
      if (boundaryFired) return;
      // Light up the first word immediately when fallback engages, so
      // the karaoke doesn't open with a blank line.
      highlightWord(0);
      startFallback();
    }, 180);
    fallbackTimers.push(t);
  });

  // Belt-and-suspenders: some browsers (older Safari) don't fire `start`.
  // If 800ms passes after `speak()` with no boundary AND no fallback
  // started, start it anyway.
  const safetyTimer = setTimeout(() => {
    if (boundaryFired || fallbackStarted) return;
    highlightWord(0);
    startFallback();
  }, 800);
  fallbackTimers.push(safetyTimer);
}

/**
 * Open the Word Detective card for a tapped word. Looks up grapheme
 * breakdown via wordDetective.lookupWord, renders the card into the
 * shared modal body, then mounts the modal. Charter-safe: the "Add to
 * Review Lane" CTA only enables when the word is in the WORDS bank (no
 * stat pollution for story-only names).
 *
 * @param {string} text — raw word text from the tapped span
 * @private
 */
function _openWordDetective(text) {
  const host = document.getElementById('word-detective-content');
  if (!host) return;
  // Pause any karaoke so the child can focus on the breakdown card.
  _stopTTS();
  const info = lookupWordForDetective(text);
  host.innerHTML = _renderWordDetectiveCard(info);
  modalManager.open('modal-word-detective');

  host.querySelector('[data-action="hear"]')?.addEventListener('click', () => {
    try { audio.speakWord(info.text); } catch (_) { /* ignore */ }
  });

  const addBtn = host.querySelector('[data-action="add-review"]');
  addBtn?.addEventListener('click', () => {
    if (!info.word) return;
    const ok = addWordToReview(info.word.id);
    if (ok) {
      addBtn.disabled = true;
      addBtn.textContent = '✓ In your Review Lane';
    }
  });
}

/**
 * Build the Word Detective card HTML. Pure — takes a lookup result, returns
 * an HTML string with grapheme tiles colour-coded via the existing
 * `.letter-tile--<family>` classes.
 *
 * @param {ReturnType<import('../modules/wordDetective.js').lookupWord>} info
 * @returns {string}
 */
function _renderWordDetectiveCard(info) {
  const escText = (s) => String(s ?? '').replace(/[<>&]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;' }[c]));
  const TYPE_CLASS = {
    c: 'consonant', sv: 'short-vowel', lv: 'long-vowel', d: 'digraph',
    bl: 'blend', se: 'silent-e', rc: 'r-control', dp: 'diphthong',
    sf: 'suffix', p: 'suffix', soft_c: 'consonant', soft_g: 'consonant',
  };
  const TYPE_LABEL = {
    c: 'consonant', sv: 'short vowel', lv: 'long vowel', d: 'digraph',
    bl: 'blend', se: 'silent e', rc: 'r-controlled', dp: 'diphthong',
    sf: 'suffix', p: 'prefix', soft_c: 'soft c', soft_g: 'soft g',
  };

  const tilesHtml = info.graphemes.map((g, i) => {
    const type = info.types[i] || 'c';
    const cls = TYPE_CLASS[type] || 'consonant';
    const label = TYPE_LABEL[type] || 'sound';
    return `<span class="wd-tile letter-tile letter-tile--${cls}" aria-label="${escText(g)}, ${escText(label)}">${escText(g)}</span>`;
  }).join('');

  const inBankBlock = info.foundInBank
    ? `<button class="btn btn--primary" type="button" data-action="add-review" ${info.alreadyTracked ? 'disabled' : ''}>
         ${info.alreadyTracked ? '✓ Already in your Review Lane' : '🎯 Add to my Review Lane'}
       </button>`
    : `<p class="wd-note">This word isn't in the practice bank — but you can still hear its sounds.</p>`;

  return `
    <div class="wd-card">
      <p class="wd-word">${escText(info.text)}</p>
      <div class="wd-tiles" aria-label="Sound breakdown">${tilesHtml}</div>
      <div class="wd-actions">
        <button class="btn btn--ghost" type="button" data-action="hear">🔊 Hear it</button>
        ${inBankBlock}
      </div>
    </div>`;
}

/**
 * Scroll an element into view only if it's currently off-screen — cheap
 * and jiggle-free for karaoke highlighting; doesn't fight a manual scroll.
 * @private
 */
function _scrollIntoViewIfNeeded(el) {
  if (!el || typeof el.getBoundingClientRect !== 'function') return;
  try {
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    if (isOffscreen(rect, viewportH)) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  } catch (_) { /* JSDOM or older browsers — ignore */ }
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

/**
 * Apply the well-tested voice from `audio.js` to a SpeechSynthesisUtterance
 * so Read Aloud / Decode TTS picks the best-available cross-browser voice
 * (en-US → en-GB → en-AU → en-SG → en-IN) rather than gambling on whether
 * the user's device happens to ship the bare `lang: 'en-GB'` we used to
 * request. Devices without an en-GB voice were silently queuing utterances
 * with no audible output — the "Listen button does nothing" regression.
 *
 * @param {SpeechSynthesisUtterance} utt
 */
function _applyTtsVoice(utt) {
  let voice = null;
  try { voice = audio.getTtsVoice?.() || null; } catch (_) { voice = null; }
  if (voice) {
    utt.voice = voice;
    utt.lang = voice.lang || 'en-GB';
  } else {
    utt.lang = 'en-GB';
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
  // Surface a quick comprehension self-check (once per session)
  if (_currentStory) _showComprehensionCheck(_currentStory);
}

/**
 * Render an inline comprehension self-check at the end of the story.
 * Uses the existing `talkAboutIt` prompt — coaches the learner to retell
 * rather than testing with auto-generated MCQ distractors. Logged to
 * localStorage so a teacher/parent can spot stories that needed re-reads.
 *
 * Buttons:
 *   🙂 I can answer        – logs response='confident', closes panel
 *   🤔 Let me re-read     – logs response='reread',    re-plays TTS
 *   💭 Show me where      – logs response='hint',      scrolls last line into view
 */
function _showComprehensionCheck(story) {
  if (!story || !story.talkAboutIt?.length) return;
  if (_compShownSession.has(story.id)) return;

  const content = _container?.querySelector('.story-content-wrap');
  if (!content) return;
  // Avoid double-inserting
  if (content.querySelector('.comp-check')) return;

  _compShownSession.add(story.id);
  const question = story.talkAboutIt[0];

  const panel = document.createElement('div');
  panel.className = 'comp-check';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Comprehension check');
  panel.innerHTML = /* html */`
    <h4>💬 Quick check</h4>
    <div class="comp-q">${question}</div>
    <div class="comp-choices">
      <button class="comp-choice" data-resp="confident" type="button">🙂 I can answer this</button>
      <button class="comp-choice" data-resp="reread" type="button">🤔 Let me re-read</button>
      <button class="comp-choice" data-resp="hint" type="button">💭 Show me where</button>
    </div>
    <div class="comp-feedback" id="comp-feedback" hidden></div>
    <button class="comp-skip" id="comp-skip" type="button">Skip</button>
  `;
  content.appendChild(panel);
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const feedback = panel.querySelector('#comp-feedback');

  panel.querySelectorAll('.comp-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const resp = btn.dataset.resp;
      _logComprehensionAttempt({ storyId: story.id, question, response: resp });

      panel.querySelectorAll('.comp-choice').forEach(b => b.disabled = true);
      btn.classList.add('correct'); // green outline regardless — this is a self-check

      if (resp === 'confident') {
        feedback.textContent = '👍 Great! You understood the story.';
      } else if (resp === 'reread') {
        feedback.textContent = '📖 Good plan — listening again helps build fluency.';
        // If TTS is available, re-start the read-aloud for the same story
        setTimeout(() => _startTTS(story), 300);
      } else {
        feedback.textContent = '💡 Look at the end of the story for clues.';
        // Scroll the last text line into view to support the prompt
        const lastLine = _container?.querySelector('.sline.sline--end, .sline:last-of-type');
        lastLine?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      feedback.hidden = false;
    });
  });

  panel.querySelector('#comp-skip')?.addEventListener('click', () => {
    _logComprehensionAttempt({ storyId: story.id, question, response: 'skipped' });
    panel.remove();
  });
}

/**
 * Render the "X/Y" count chip embedded in the Friends pill in the stories
 * browser header.
 */
function _renderFriendsCount() {
  try {
    const summary = getRosterSummary(STORIES);
    return `<span class="sb-friends-count">${summary.unlocked}/${summary.total}</span>`;
  } catch (_) {
    return '';
  }
}

/**
 * Open the Friends gallery modal. Renders unlocked friends in full
 * colour and locked friends as silhouettes (NEVER as a "buy with XP"
 * gate — friends are earned by reading, full stop).
 *
 * Reuses the global #modal-word-detective container by ID-mirroring
 * the pattern, but actually creates a fresh DOM node so we don't
 * collide with the Detective modal that lives elsewhere.
 */
function _openFriendsGallery() {
  // Lazy-create the modal element so we don't add markup to index.html
  // for a single rarely-opened surface.
  document.getElementById('modal-story-friends')?.remove();
  const summary = getRosterSummary(STORIES);
  const modal = document.createElement('div');
  modal.id = 'modal-story-friends';
  modal.className = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', "Giri's Friends gallery");

  const escText = (s) => String(s ?? '').replace(/[<>&]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;' }[c]));

  // Group by band so the wall reads as a journey
  const byBand = new Map();
  for (const friend of summary.roster) {
    if (!byBand.has(friend.band)) byBand.set(friend.band, []);
    byBand.get(friend.band).push(friend);
  }

  const sectionsHtml = Array.from(byBand.entries())
    .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
    .map(([band, friends]) => {
      const unlockedInBand = friends.filter(f => f.unlocked).length;
      const tilesHtml = friends.map(f => `
        <button class="sf-tile ${f.unlocked ? 'sf-tile--unlocked' : 'sf-tile--locked'}"
                data-story-id="${escText(f.storyId)}"
                ${f.unlocked ? '' : 'disabled aria-disabled="true"'}
                aria-label="${f.unlocked ? `${escText(f.name)} from ${escText(f.storyTitle)} — tap to re-read` : `Locked — read ${escText(f.storyTitle)} to meet ${escText(f.name)}`}">
          <span class="sf-tile__emoji" aria-hidden="true">${f.unlocked ? escText(f.emoji) : '🔒'}</span>
          <span class="sf-tile__name">${f.unlocked ? escText(f.name) : '???'}</span>
          ${f.unlocked ? `<span class="sf-tile__story">from ${escText(f.storyTitle)}</span>` : `<span class="sf-tile__story">${escText(f.storyTitle)}</span>`}
        </button>
      `).join('');
      return `
        <div class="sf-band">
          <h3 class="sf-band__title">Band ${escText(band)} <small>${unlockedInBand}/${friends.length} met</small></h3>
          <div class="sf-grid">${tilesHtml}</div>
        </div>`;
    }).join('');

  const intro = summary.unlocked === 0
    ? "🐾 Read a Giri Story and the co-star moves in here. No friends yet — start with Band A!"
    : `🐾 You've met <strong>${summary.unlocked}</strong> of <strong>${summary.total}</strong>. Tap a friend to re-read their story.`;

  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header">
        <h2 class="modal-title">🐾 Giri's Friends</h2>
        <button class="modal-close" aria-label="Close Friends gallery" data-close="modal-story-friends">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="sf-intro">${intro}</p>
        ${sectionsHtml}
      </div>
    </div>`;

  document.body.appendChild(modal);
  modalManager.open('modal-story-friends');

  modal.querySelector('[data-close]')?.addEventListener('click', () => {
    modalManager.close('modal-story-friends');
    modal.remove();
  });
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modalManager.close('modal-story-friends');
      modal.remove();
    }
  });

  // Tap an unlocked tile → close the modal and open that story.
  modal.querySelectorAll('.sf-tile--unlocked[data-story-id]').forEach(tile => {
    tile.addEventListener('click', () => {
      const storyId = tile.dataset.storyId;
      if (!storyId) return;
      modalManager.close('modal-story-friends');
      modal.remove();
      _showReader(storyId);
    });
  });
}

function _toggleTTSButtons(playing) {
  const play = document.getElementById('btn-story-play');
  const stop = document.getElementById('btn-story-stop');
  if (play) play.style.display = playing ? 'none' : '';
  if (stop) stop.style.display = playing ? ''     : 'none';
  // While listening, mark the reader so CSS can collapse the hero
  // illustration and give the story body the space it needs (audit
  // finding #5 — hero is 250px tall on desktop and only matters
  // pre-play).
  const reader = _container?.querySelector('.story-reader');
  if (reader) reader.classList.toggle('story-reader--listening', playing);
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
    _applyTtsVoice(utt);
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
