import { getProfileScopedKey } from '../modules/profiles.js';
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
import { audio } from '../modules/audio.js';
import { giriInline, giriImageEl } from '../components/mascot.js';
import { runStoryQuest } from './storyQuest.js';
import { mapCharIndexToWord, isOffscreen } from '../modules/karaokeUtils.js';
import { prefersReducedMotion } from '../utils/motion.js';
import { lookupWord as lookupWordForDetective, addWordToReview } from '../modules/wordDetective.js';
import { isReadAloudSupported, listenToLine, stopListening } from '../modules/readAloudListener.js';
import { createRuler, scrollHost, RULER_MODES } from '../modules/readingRuler.js';
import { savePlace, getPlace, clearPlace } from '../modules/storyPlace.js';
import { store } from '../modules/store.js';
import { getBandReadiness, getRecommendedBand } from '../modules/storyGating.js';
import { storySupportLevel } from '../modules/decodability.js';
import { wordsToMeet } from '../modules/wordsToMeet.js';
import { escapeHtml, escapeAttr } from '../utils/escapeHtml.js';
import { html } from '../utils/html.js';
import { tokenise } from '../utils/tokenise.js';
import { renderBlendLadder } from '../modules/blendLadder.js';
import { deriveGraphemes, expandBlends } from '../modules/deriveGraphemes.js';
import { readingRate, describeFluency } from '../modules/fluencyNorms.js';
import { findClue } from '../modules/storyClue.js';
import { getActiveProfile } from '../modules/profiles.js';
import {
  soundColoredHtml,
  graphemeSounds,
  SOUND_META,
  VOWEL_LEGEND,
} from '../modules/phonemeColors.js';
import { modalManager } from '../modules/modalManager.js';
import {
  unlockFriend,
  isFriendUnlocked,
  friendFromStory,
  getRosterSummary,
} from '../modules/storyFriends.js';
import {
  startRecording,
  stopRecording,
  playRecording,
  deleteRecording,
  stopPlayback,
  cleanupRecording,
  getRecorderState,
  saveFluencyAttempt,
  getFluencyHistory,
} from '../modules/storyRecording.js';

const BASE = import.meta.env.BASE_URL;

// ── Module state ──────────────────────────────────────────────────────────

let _container = null;
let _onGoHome = null;
let _activeBand = 'A'; // 'A' | 'B' | 'C' | 'D' | 'E'
let _bandAutoPicked = false; // pick the recommended shelf once per session
let _activeTab = 'band'; // 'band' | 'singapore' | 'chapter'
let _speaking = false;
// The line the narration is on, so it can pick up there after a word break.
let _ttsLine = 0;
// Bumped on every start and stop of the narration. Its callbacks outlive it —
// the pause timer between lines, the voice's end and error events (Chrome
// fires "interrupted" on cancel), the karaoke fallback timers — and each one
// checks it is still the run it belongs to before doing anything.
let _ttsRun = 0;
// The docked word panel: the panel, the word it is about (focus goes back
// there), the pane given room to scroll, and the observer that keeps the
// word in sight as the ladder grows.
let _wordPanel = null;
let _panelWord = null;
let _panelRoomHost = null;
let _panelObserver = null;
// Cancels the one re-check scheduled for when scrolling settles.
let _panelSettle = null;
// The story open in the reader. Set when the reader renders, not only when
// text-to-speech starts, because the ruler and the place tracker need to
// know which story they are in whether or not anything is being spoken.
let _currentStory = null;

// Word-follow highlighting mode for Read Aloud
// Karaoke read-aloud follows individual words by default (rule 6 — accessibility
// is first-class). Hydrated from PREFS_FOLLOW_KEY further down so the value
// survives reloads; defaults to 'word' on first run.
let _followMode = 'word'; // 'line' | 'word'
let _boundarySupported = null; // null = untested, true/false after first TTS attempt

// Echo-read state
let _echoLineIdx = -1; // current echo-read line index (-1 = not active)
let _echoStory = null; // story reference during echo-read

// Read-to-Giri state (line-by-line listening — see readAloudListener.js)
let _rtgActive = false;
let _rtgLineIdx = -1; // index into _rtgLines
let _rtgLines = []; // data-line indexes that contain readable words
let _rtgNullCount = 0; // consecutive failed recognitions (degrade at 2)
let _rtgMisses = []; // words flagged for checking this session
let _rtgMatches = 0;
let _rtgTotal = 0;

// ── Story completion tracking ─────────────────────────────────────────────
/*
 * Audit 2026-09-19, finding 4: this key was global, so every child on a shared
 * device saw the same records. Scoped per profile via getProfileScopedKey, the
 * mechanism giri_friends_unlocked already used. profiles.js registers the base
 * name so deleting a profile cleans it up.
 */
const READ_KEY_BASE = 'giri_stories_read';
function readKey() {
  return getProfileScopedKey(READ_KEY_BASE);
}

function getReadStories() {
  try {
    return JSON.parse(localStorage.getItem(readKey()) ?? '[]');
  } catch {
    return [];
  }
}

function markStoryRead(id) {
  const read = getReadStories();
  if (!read.includes(id)) {
    read.push(id);
    localStorage.setItem(readKey(), JSON.stringify(read));
  }
  // A finished story has no "where you stopped" — the next read is a
  // re-read for fluency, and those start at the beginning.
  clearPlace(id);
  // C3 — every story has a co-star. Finishing the story unlocks the
  // friend (a one-shot narrative reward; pure charter-safe collectible
  // since it's earned by reading, not bought).
  unlockFriend(id);
}

// Fluency timer state
let _fluencyTimer = null;
let _fluencyStart = null;
let _fluencyRunning = false;
// Seconds from the last timing, held while the grown-up enters the error count.
let _fluencySeconds = 0;

// ── Structured-literacy preferences (per-device localStorage) ─────────────
// Visual scaffolds — child/teacher can switch them off when no longer needed.

const PREFS_GRAPHEMES_KEY = 'giri_show_graphemes';
const PREFS_RULER_KEY = 'giri_show_ruler';
const PREFS_RULER_MODE_KEY = 'giri_ruler_mode';
const PREFS_FOLLOW_KEY = 'giri_follow_mode';
/*
 * Audit 2026-09-19, finding 4: this key was global, so every child on a shared
 * device saw the same records. Scoped per profile via getProfileScopedKey, the
 * mechanism giri_friends_unlocked already used. profiles.js registers the base
 * name so deleting a profile cleans it up.
 */
const MEET_WORDS_KEY_BASE = 'giri_meet_words';
function meetWordsKey() {
  return getProfileScopedKey(MEET_WORDS_KEY_BASE);
}
/*
 * Audit 2026-09-19, finding 4: this key was global, so every child on a shared
 * device saw the same records. Scoped per profile via getProfileScopedKey, the
 * mechanism giri_friends_unlocked already used. profiles.js registers the base
 * name so deleting a profile cleans it up.
 */
const COMP_LOG_KEY_BASE = 'giri_comp_log';
function compLogKey() {
  return getProfileScopedKey(COMP_LOG_KEY_BASE);
}

let _showGraphemes = _loadPref(PREFS_GRAPHEMES_KEY, true);
let _showRuler = _loadPref(PREFS_RULER_KEY, false);

// Live Reading Ruler (readingRuler.js) and the last position it reported.
// 'line' is the default style: it is the card-under-the-line a teacher hands
// a child, and it reads a whole line at a time rather than one word.
let _ruler = null;
let _rulerState = null;
let _rulerModeId = _loadPref(PREFS_RULER_MODE_KEY, 'line');

// Where the child stopped last time, restored once per open (storyPlace.js).
// Null means "no saved place, or this story is already read".
let _resumeWord = null;
let _placeSaveTimer = 0;
let _placeScrollHost = null;

// Hydrate the karaoke follow-mode from prefs now that PREFS_FOLLOW_KEY is in
// scope. Defaults to 'word' (declared above) so first-run users get karaoke
// out of the box without having to discover the toggle.
_followMode = _loadPref(PREFS_FOLLOW_KEY, 'word');

function _loadPref(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function _persistPref(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
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
    const raw = localStorage.getItem(meetWordsKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function _writeMeetWordsMap(map) {
  try {
    localStorage.setItem(meetWordsKey(), JSON.stringify(map));
  } catch {}
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
    const raw = localStorage.getItem(compLogKey());
    const list = raw ? JSON.parse(raw) : [];
    list.push({ ts: Date.now(), ...entry });
    while (list.length > COMP_LOG_CAP) list.shift();
    localStorage.setItem(compLogKey(), JSON.stringify(list));
  } catch {}
}

// ── Public API ────────────────────────────────────────────────────────────

export function initStoryMode(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function showBrowser() {
  _stopTTS();
  _renderBrowser();
}

export function cleanupStoryMode() {
  _stopTTS();
  // The panel lives on <body>, outside the screen being torn down.
  _closeWordPanel({ restoreFocus: false });
  _stopFluencyTimer();
  cleanupRecording();
  _resetReadToGiri();
  _echoLineIdx = -1;
  _echoStory = null;
}

// ── Browser view ──────────────────────────────────────────────────────────

function _renderBrowser() {
  // Leaving the reader for the library — tear the ruler down, or its
  // ResizeObserver outlives the story it measured.
  _destroyRuler();
  _closeWordPanel({ restoreFocus: false });
  _unwirePlaceTracking();
  _currentStory = null;

  // ── Category tabs ──────────────────────────────────────────────────────
  const categoryTabsHtml = /* html */ `
    <div class="sb-category-tabs" role="tablist" aria-label="Story categories">
      <button class="sb-cat-tab${_activeTab === 'band' ? ' active' : ''}" data-cat="band">📖 By Band</button>
      <button class="sb-cat-tab${_activeTab === 'singapore' ? ' active' : ''}" data-cat="singapore">🇸🇬 Singapore</button>
      <button class="sb-cat-tab${_activeTab === 'chapter' ? ' active' : ''}" data-cat="chapter">📚 Chapters</button>
      <button class="sb-cat-tab sb-cat-tab--friends" id="btn-open-friends" type="button" aria-label="Open Giri's Friends">🐾 Friends ${_renderFriendsCount()}</button>
    </div>
  `;

  let innerHtml;

  if (_activeTab === 'band') {
    // Open on the shelf that matches the child's phonics progress (once
    // per session — after that, respect whatever tab they tap).
    if (!_bandAutoPicked) {
      _bandAutoPicked = true;
      try {
        const byBand = {};
        for (const st of STORIES) (byBand[st.band] ??= []).push(st);
        _activeBand = getRecommendedBand(getReadStories(), byBand) || _activeBand;
      } catch (_) {
        /* keep default */
      }
    }
    // ── Band tabs + cards ─────────────────────────────────────────────
    const bandMeta = BAND_META.find((m) => m.band === _activeBand) ?? BAND_META[0];
    const stories = STORIES.filter(
      (s) => s.band === _activeBand && s.category !== 'chapter' && s.category !== 'nonfiction-sg',
    );

    const read = getReadStories();
    const readCount = stories.filter((s) => read.includes(s.id)).length;

    const readiness = getBandReadiness();
    const bandTabsHtml = BAND_META.map(
      (m) => /* html */ `
      <button
        class="story-tab${m.band === _activeBand ? ' active' : ''}${readiness[m.band]?.ready ? '' : ' story-tab--not-ready'}"
        data-band="${m.band}"
        style="--tab-color:${m.color}"
        ${readiness[m.band]?.ready ? '' : `title="${readiness[m.band].hint}"`}
      >
        <span class="story-tab-num">${m.band}</span>
        <span class="story-tab-name">${m.label}</span>
        ${readiness[m.band]?.ready ? '' : '<span class="story-tab-lock" aria-hidden="true">🔓</span>'}
      </button>
    `,
    ).join('');

    const cardsHtml = stories
      .map((s) => _storyCardHtml(s, bandMeta, false, read.includes(s.id)))
      .join('');
    const progressPct = stories.length ? Math.round((readCount / stories.length) * 100) : 0;

    innerHtml = /* html */ `
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
      ${
        readiness[_activeBand]?.ready
          ? ''
          : `
        <p class="stories-readiness-note" role="note">
          🧭 ${readiness[_activeBand].hint}. You can still read together with a grown-up!
        </p>`
      }
      <div class="story-cards-grid">${cardsHtml}</div>
    `;
  } else if (_activeTab === 'singapore') {
    // ── Singapore specials ─────────────────────────────────────────────
    const sgStories = STORIES.filter((s) => s.category === 'nonfiction-sg');
    const read = getReadStories();
    const cardsHtml = sgStories
      .map((s) => {
        const meta = BAND_META.find((m) => m.band === s.band) ?? BAND_META[0];
        return _storyCardHtml(s, meta, false, read.includes(s.id));
      })
      .join('');

    innerHtml = /* html */ `
      <div class="sb-section-header">
        <h3 class="sb-section-title">🇸🇬 Singapore Stories</h3>
        <p class="sb-section-desc">Stories set in Singapore — hawker centres, MRT, festivals & more.</p>
      </div>
      <div class="story-cards-grid">${cardsHtml}</div>
    `;
  } else {
    // ── Chapter stories ────────────────────────────────────────────────
    const chapterStories = STORIES.filter((s) => s.category === 'chapter').sort(
      (a, b) => (a.chapterNum ?? 0) - (b.chapterNum ?? 0),
    );
    const read = getReadStories();
    const cardsHtml = chapterStories
      .map((s) => {
        const meta = BAND_META.find((m) => m.band === s.band) ?? BAND_META[0];
        return _storyCardHtml(s, meta, true, read.includes(s.id));
      })
      .join('');

    innerHtml = /* html */ `
      <div class="sb-section-header">
        <h3 class="sb-section-title">📚 The Lost Key</h3>
        <p class="sb-section-desc">A three-chapter story. Read them in order!</p>
      </div>
      <div class="story-cards-grid story-cards-grid--chapters">${cardsHtml}</div>
    `;
  }

  _container.innerHTML = /* html */ `
    <div class="stories-browser">
      ${categoryTabsHtml}
      ${innerHtml}
    </div>
  `;

  // Category tab listeners. The Friends pill is a sibling button but
  // doesn't switch tabs — it opens the gallery modal instead.
  _container.querySelectorAll('.sb-cat-tab[data-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      _activeTab = btn.dataset.cat;
      _renderBrowser();
    });
  });
  document.getElementById('btn-open-friends')?.addEventListener('click', () => {
    _openFriendsGallery();
  });

  // Band tab listeners (only in band tab)
  _container.querySelectorAll('.story-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      _activeBand = btn.dataset.band;
      _renderBrowser();
    });
  });

  // Story card click
  _container.querySelectorAll('.story-card').forEach((btn) => {
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
  const readBadge = isRead ? '<span class="story-card-read-badge" title="Story read">✓</span>' : '';
  return /* html */ `
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
        ${
          // Two things a grown-up wants before opening it: is this one the
          // child can take on alone, and how many words need meeting first.
          storySupportLevel(story) === 'adult-supported'
            ? '<span class="story-card-support" data-support="adult">🧑‍🏫 With a grown-up</span>'
            : (() => {
                const n = wordsToMeet(story).length;
                return n
                  ? `<span class="story-card-support" data-support="independent">👀 ${n} new ${n === 1 ? 'word' : 'words'}</span>`
                  : '<span class="story-card-support" data-support="independent">🙋 Read by myself</span>';
              })()
        }
      </div>
    </button>
  `;
}

// ── Reader view ───────────────────────────────────────────────────────────

function _showReader(storyId) {
  const story = STORIES.find((s) => s.id === storyId);
  if (!story) return;
  _stopTTS();
  // Read the saved place once per open, not on every re-render: switching
  // follow mode or toggling a scaffold rebuilds the body, and a banner that
  // reappeared each time would be nagging rather than helpful.
  _resumeWord = getReadStories().includes(story.id) ? null : getPlace(story.id);
  _wordsHelped.clear();
  _renderReader(story);
}

function _renderReader(story) {
  _currentStory = story;
  const levelMeta =
    BAND_META.find((m) => m.band === story.band) ?? BAND_META[(story.level ?? 1) - 1];

  _container.innerHTML = /* html */ `
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
        ${
          // Teacher-supported formats sit on the same shelf as the tightly
          // controlled readers while playing by looser rules (FORMAT_RULES
          // lifts their HFW cap; STORY_PHASES grants them the full code).
          // Saying so is the whole point of the two labels.
          storySupportLevel(story) === 'adult-supported'
            ? `<span class="story-meta-badge story-meta-badge--supported">🧑‍🏫 Read with a grown-up</span>`
            : `<span class="story-meta-badge story-meta-badge--independent">🙋 Read by myself</span>`
        }
      </div>

      <!-- Title -->
      <h2 class="story-reader-title">${story.title}</h2>

      <div id="story-dynamic" class="story-dynamic"></div>

    </div>
  `;

  document.getElementById('btn-reader-back')?.addEventListener('click', () => {
    _stopTTS();
    _renderBrowser();
  });

  // One warm-up, then the story. There is no mode to pick: tapping a word
  // sounds it out wherever you are, and listening is a button rather than a
  // different reader. See the header comment on _renderStory.
  _renderWarmUpOrStory(story);
}

function _renderWarmUpOrStory(story) {
  if (_isMeetWordsCompletedToday(story.id)) _renderStory(story);
  else _renderWarmUp(story);
}

// ── The warm-up ───────────────────────────────────────────────────────────
/**
 * The one warm-up before reading.
 *
 * There used to be three pre-teach surfaces, and a child opening a story in
 * Sound It Out met the same words up to three times before reading a line:
 * a "Words to know first" panel above the fold, this gate, and a third copy
 * inside the decode reader.
 *
 * Worse than the repetition was what the gate was teaching. It was built
 * from `extractStoryHFW` — every word in the story that happens to be on
 * the high-frequency list — and across the bank **1664 of its 1793 chips
 * are words the child can sound out**. In a short-a story it was offering
 * "sat", "ran", "at" and "can" to be memorised by sight, which is the exact
 * habit a synthetic-phonics programme exists to prevent. The other panel
 * had already been moved off that list for the same reason; the gate had
 * not.
 *
 * So the warm-up is now built from `wordsToMeet` — the words this story
 * genuinely cannot be sounded out from — which is 299 chips across the whole
 * bank rather than 1793. A child meets the words they actually need to be
 * told, and sounds out the rest, which is the point of a decodable reader.
 * (It was 133 until heart words whose spelling passes the code check, like
 * "said" and "was", joined in the band where they first appear; see
 * wordsToMeet.js.)
 *
 * Key vocabulary (`story.vocab`) stays: that is a different job. Those words
 * ARE decodable; what the child needs is what they mean.
 */
function _renderWarmUp(story) {
  const dynamic = document.getElementById('story-dynamic');
  if (!dynamic) return;

  _destroyRuler();

  const prep = wordsToMeet(story);
  const storyText = story.lines
    .map((l) => l.text ?? '')
    .join(' ')
    .toLowerCase();
  const vocab = (story.vocab ?? []).filter((v) =>
    storyText.includes(v.word.toLowerCase().split(/\s+/)[0]),
  );

  // Nothing a child has to be told? Then there is nothing to warm up, and
  // saying so is better than a gate with no content behind it.
  if (!prep.length && !vocab.length) {
    _setMeetWordsCompleted(story.id);
    _renderStory(story);
    return;
  }

  // Three taps, not every chip: enough to prime, fast enough to get to the
  // story. "I know these" stays for a returning reader.
  const target = Math.min(3, prep.length + vocab.length);
  const tapped = new Set();

  dynamic.innerHTML = html`
    <section class="warm-up" aria-labelledby="warm-up-title">
      <h3 id="warm-up-title">🤝 Meet the words</h3>
      <p class="warm-up-lead">
        ${
          prep.length
            ? html`These are the words in <strong>${story.title}</strong> you cannot sound out — so
              here they are first. Tap any ${target} to warm up.`
            : html`A few words worth knowing before you read
              <strong>${story.title}</strong>. Tap any ${target} to warm up.`
        }
      </p>

      ${
        prep.length
          ? html`<div class="warm-up-section">
            <div class="warm-up-section-title">👀 Words to know first — tap to hear</div>
            <div class="warm-up-words">
              ${prep.map(
                ({ word, display, status }) => html`<button
                  type="button"
                  class="story-prep-word"
                  data-tap-id="prep:${word}"
                  data-prep-word="${word}"
                  data-status="${status}"
                  aria-label="Hear the word ${display}"
                >
                  ${display}
                </button>`,
              )}
            </div>
          </div>`
          : ''
      }

      ${
        vocab.length
          ? html`<div class="warm-up-section">
            <div class="warm-up-section-title">📚 Key words — tap to hear what they mean</div>
            <div class="vocab-chip-list">
              ${vocab.map(
                (v) => html`<button
                  class="vocab-chip"
                  type="button"
                  data-tap-id="vocab:${v.word}"
                  data-word="${v.word}"
                  aria-label="Key word: ${v.word}. ${v.meaning}"
                >
                  <span class="vocab-chip-icon">${v.icon}</span>
                  <span class="vocab-chip-word">${v.word}</span>
                  <span class="vocab-chip-meaning">${v.meaning}</span>
                </button>`,
              )}
            </div>
          </div>`
          : ''
      }

      <div class="warm-up-row">
        <span class="warm-up-progress" id="warm-up-progress" aria-live="polite"
          >0 of ${target} tapped</span
        >
        <button class="btn btn--ghost" id="warm-up-skip" type="button">I know these →</button>
        <button class="btn btn--primary" id="warm-up-go" type="button" disabled>
          Start reading →
        </button>
      </div>
    </section>
  `;

  const progress = document.getElementById('warm-up-progress');
  const go = document.getElementById('warm-up-go');

  function recordTap(chip) {
    const id = chip.dataset.tapId;
    if (tapped.has(id)) return;
    tapped.add(id);
    chip.setAttribute('data-tapped', 'true');
    if (progress) {
      progress.textContent =
        tapped.size >= target
          ? `✓ Warmed up — start the story, or keep tapping`
          : `${tapped.size} of ${target} tapped`;
    }
    if (tapped.size >= target && go) {
      go.disabled = false;
      go.focus({ preventScroll: true });
    }
  }

  dynamic.querySelectorAll('[data-prep-word]').forEach((chip) => {
    chip.addEventListener('click', () => {
      // These cannot be sounded out, so hearing one IS the teaching step.
      audio.speakSightWord(chip.dataset.prepWord)?.catch?.(() => {});
      chip.classList.add('story-prep-word--said');
      setTimeout(() => chip.classList.remove('story-prep-word--said'), 600);
      recordTap(chip);
    });
  });
  dynamic.querySelectorAll('.vocab-chip').forEach((chip) => {
    chip.addEventListener('click', async () => {
      _flashChip(chip);
      // "Key words — tap to hear what they mean". These words are decodable;
      // what a child needs is the meaning, and the warm-up used to say only
      // the word while the meaning stayed hidden. Show it and say it — the
      // definition is usually harder to read than the story itself.
      chip.classList.add('vocab-chip--expanded');
      recordTap(chip);
      const meaning = chip.querySelector('.vocab-chip-meaning')?.textContent?.trim();
      try {
        await audio.speakWord(chip.dataset.word);
        if (meaning) await audio.speakText(meaning);
      } catch {}
    });
  });

  const proceed = () => {
    _setMeetWordsCompleted(story.id);
    _renderStory(story);
  };
  document.getElementById('warm-up-skip')?.addEventListener('click', proceed);
  go?.addEventListener('click', proceed);
}

// ── The reader ────────────────────────────────────────────────────────────

/** Count the words in a story's spoken text */
function _countStoryWords(story) {
  return story.lines
    .filter((l) => l.type !== 'label' && l.type !== 'chapter' && l.text)
    .reduce((acc, l) => acc + l.text.trim().split(/\s+/).length, 0);
}

/**
 * The story reader.
 *
 * There used to be two: "Listen & Follow" and "Sound It Out", chosen with a
 * toggle. They had drifted into being two different apps over one story —
 * Sound It Out had no Listen button, no Talk About It, no Story Quest and no
 * ending, and laid its pre-teach words out differently. A child who chose it
 * lost the model read and the comprehension work; a child who chose the
 * other was told "tap a word to sound it out" by a reader that was not
 * called Sound It Out.
 *
 * There is one reader now, because the thing that made them two modes is
 * gone: tapping a word opens the blend ladder wherever it is tapped.
 * Listening is a button on that one reader, not a different reader.
 */
function _renderStory(story) {
  const dynamic = document.getElementById('story-dynamic');
  if (!dynamic) return;

  // This render replaces the story body the ruler measured and overlays —
  // and the word the panel was keeping in sight.
  _destroyRuler();
  _closeWordPanel({ restoreFocus: false });

  // Word spans are always rendered, in both follow modes. They are what makes
  // "👆 Tap a word to hear its sounds" true — that hint is printed
  // unconditionally, and while the spans were built only in word-follow mode a
  // child who chose "Whole line" was told to tap words that were not tappable.
  // Line-follow highlighting is unaffected: it lights the `.sline`, and the
  // per-word boundary listener is still only attached in word mode.
  const linesHtml = story.lines.map((line, i) => _lineHtml(line, i, true, story)).join('');
  const hasQuest = !!story.comprehension?.length;
  const hasTalk = !!story.talkAboutIt?.length;

  // Talk About It section (Band A mini-decodables)
  const talkHtml = hasTalk
    ? /* html */ `
    <div class="story-talk">
      <h3 class="story-talk-title">💬 Talk About It</h3>
      <ul class="story-talk-list">
        ${story.talkAboutIt.map((q) => `<li>${q}</li>`).join('')}
      </ul>
    </div>
  `
    : '';

  // Reading-pace history for this story. Each entry says which measure it
  // is: an older attempt with no error count is words per minute, and
  // printing that beside a words-correct-per-minute reading as if they were
  // the same number is how the old display misled.
  const historyAttempts = getFluencyHistory(story.id);
  const historyHtml = historyAttempts.length
    ? /* html */ `
    <div class="fluency-history" id="fluency-history">
      <div class="fluency-history-header">
        <span class="fluency-history-title">📊 Recent timings</span>
      </div>
      <div class="fluency-history-list">
        ${historyAttempts
          .slice()
          .reverse()
          .map((a) => {
            const d = new Date(a.date);
            const when = `${d.getDate()}/${d.getMonth() + 1}`;
            const counted = typeof a.wcpm === 'number' && a.errors != null;
            const n = counted ? a.wcpm : (a.wpm ?? a.wcpm);
            const unit = counted ? 'correct/min' : 'words/min';
            const help = a.support === 'supported' ? ' · with help' : '';
            return `<span class="fluency-history-item">${when}: <strong>${n}</strong> ${unit}${help}</span>`;
          })
          .join('')}
      </div>
    </div>
  `
    : '';

  dynamic.innerHTML = /* html */ `
    <!-- Story text column -->
    <div class="story-content-wrap">
      <!-- Reading toolbar. Three tools, each with a clear payoff:
           Sound colours (teach the vowel sound), Follow along (track the
           voice), Tap a word (hear it + see its sounds). -->
      <div class="story-reader-toolbar" role="group" aria-label="Reading controls">
        <div class="reader-scaffold-bar" role="group" aria-label="Reading scaffolds">
          <button class="scaffold-toggle" id="btn-toggle-graphemes" aria-pressed="${_showGraphemes}" title="Colour each vowel by the sound it makes — short, long, schwa, bossy-r or sliding">🎨 Sound colours</button>
          <button class="scaffold-toggle" id="btn-toggle-ruler" aria-pressed="${_showRuler}" title="Cover the lines you are not reading, and move down one at a time">📏 Reading ruler</button>
        </div>

        <div class="follow-mode-toggle">
          <span class="follow-mode-label">Follow along:</span>
          <button class="follow-mode-btn${_followMode === 'line' ? ' active' : ''}" data-follow="line"
                  title="Light up the whole line as Giri reads it.">Whole line</button>
          <button class="follow-mode-btn${_followMode === 'word' ? ' active' : ''}" data-follow="word"
                  title="Light up each word as Giri says it — karaoke style.">Word by word</button>
        </div>

        <span class="reader-tap-hint" title="Tap any word in the story to hear it and see its sounds">👆 Tap a word to hear its sounds</span>
      </div>

      ${_showGraphemes ? _soundLegendHtml() : ''}

      ${(() => {
        // The warm-up words, still reachable while reading. They used to
        // vanish once the warm-up was passed, so a child who met "said" at
        // the start and hit it in the third line had nowhere to go — and
        // "said" is precisely a word they cannot work out for themselves.
        // Folded away, because it is a reference now rather than a step.
        const prep = wordsToMeet(story);
        if (!prep.length) return '';
        return String(html`
          <details class="story-prep-strip">
            <summary>
              👀 ${prep.length} ${prep.length === 1 ? 'word' : 'words'} to know — tap to hear
            </summary>
            <div class="story-prep-words">
              ${prep.map(
                ({ word, display, status }) => html`<button
                  type="button"
                  class="story-prep-word"
                  data-prep-word="${word}"
                  data-status="${status}"
                  aria-label="Hear the word ${display}"
                >
                  ${display}
                </button>`,
              )}
            </div>
          </details>
        `);
      })()}

      ${
        // Where the child stopped last time. Shown rather than silently
        // jumped to: landing halfway down a story with no explanation is
        // disorienting, and a child who wants to start again must be able to.
        _resumeWord !== null
          ? /* html */ `
        <p class="story-resume" id="story-resume" role="note">
          <span class="story-resume-pin" aria-hidden="true">📍</span>
          Welcome back! We have gone to where you stopped.
          <button class="link-btn" type="button" id="btn-resume-restart">Start from the beginning</button>
        </p>`
          : ''
      }

      ${_castNoteHtml(story)}
      <div class="story-body story-body--follow-${_followMode}" id="story-body" aria-live="polite">${linesHtml}</div>

      <!-- The ruler's own controls. They live under the text, not in the
           tools sidebar, because they are used continuously while reading
           and a child should not have to look away from the line to press
           Next. Filled in by _startRuler when the ruler is switched on. -->
      <div class="ruler-nav-slot" id="ruler-nav-slot"></div>

      <!-- A child reading quietly to themselves needs a way to say they have
           finished. The read-aloud running out and the ruler reaching the
           last line both end the story, but neither happens when someone
           simply reads it — which is the point of the whole thing. -->
      <div class="story-finish">
        <button class="btn btn--primary btn--xl" type="button" id="btn-finish-story">
          ✓ I have read the story
        </button>
        <p class="story-finish-note">Tap this when you get to the end.</p>
      </div>
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

      <!-- Story Quest CTA (shown after TTS or fluency) — the payoff, kept
           right by the primary Listen button instead of buried under tools. -->
      ${
        hasQuest
          ? /* html */ `
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
      `
          : ''
      }

      <!-- Extra practice tools fold into one optional grown-up drawer, so the
           reader isn't a wall of competing accordions. Listening to the story
           and sounding words out (Decode mode) are the child-facing basics;
           these four are for a grown-up choosing to practise reading aloud. -->
      <details class="story-tool-section story-practice-drawer" id="practice-drawer">
        <summary class="story-tool-summary practice-summary">
          <span class="practice-label">🧑‍🏫 More ways to practise</span>
          <span class="practice-hint">Optional · for grown-ups</span>
        </summary>
        <div class="story-tool-body practice-drawer-body">
          <!-- Reading pace. A grown-up tool, and never shown to the child as
               a score: reading speed is a screening measure for a teacher,
               and put in front of a six-year-old it teaches that reading
               fast is the goal — the habit most likely to wreck
               comprehension. It asks for the error count, because without
               one the number is words per minute, which cannot be compared
               to a words-CORRECT-per-minute benchmark. -->
          <details class="story-tool-section fluency-bar" id="fluency-bar">
            <summary class="story-tool-summary fluency-summary">
              <span class="fluency-label">⏱ Reading pace</span>
              <span class="fluency-hint">For grown-ups · not shown as a score</span>
            </summary>
            <div class="story-tool-body">
              <p class="fluency-intro">
                Time one read-aloud of the whole story (${_countStoryWords(story)} words).
                The app can't hear mistakes, so count them yourself to get
                <strong>words correct per minute</strong> — the measure the benchmarks use.
              </p>
              <div class="fluency-controls">
                <button class="btn btn--ghost" id="btn-fluency-start">▶ Start timing</button>
                <span class="fluency-clock" id="fluency-clock" aria-live="polite">0:00</span>
                <button class="btn btn--primary" id="btn-fluency-done" disabled>✓ Stop</button>
              </div>
              <form class="fluency-form" id="fluency-form" hidden>
                <p class="fluency-time" id="fluency-time"></p>
                <label class="fluency-field">
                  Words read wrongly <small>(skipped, guessed, or given to them)</small>
                  <input type="number" name="errors" min="0" max="${_countStoryWords(story)}" inputmode="numeric" />
                </label>
                <fieldset class="fluency-field">
                  <legend>How did they read it?</legend>
                  <label><input type="radio" name="support" value="independent" checked /> On their own</label>
                  <label><input type="radio" name="support" value="supported" /> With some help</label>
                </fieldset>
                <div class="fluency-controls">
                  <button class="btn btn--primary btn--sm" type="submit">Save</button>
                  <button class="btn btn--ghost btn--sm" type="button" id="btn-fluency-discard">Don't save</button>
                </div>
              </form>
              <div class="fluency-result" id="fluency-result" hidden aria-live="polite"></div>
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

          <!-- Read to Giri section (collapsible) — Giri listens while you read -->
          <details class="story-tool-section rtg-bar" id="rtg-bar">
            <summary class="story-tool-summary rtg-summary">
              <span class="rtg-label">${giriInline('encourage', 18)}Read to Giri</span>
              <span class="rtg-hint">Read each line — Giri listens</span>
            </summary>
            <div class="story-tool-body">
              ${
                isReadAloudSupported()
                  ? /* html */ `
                <div class="rtg-controls" id="rtg-controls">
                  <button class="btn btn--ghost" id="btn-rtg-start">Start</button>
                  <button class="btn btn--primary" id="btn-rtg-listen" hidden>🎙 Read this line</button>
                  <button class="btn btn--ghost" id="btn-rtg-next" hidden>Next line →</button>
                  <button class="btn btn--ghost btn--sm" id="btn-rtg-exit" hidden>✕ Exit</button>
                </div>
                <div class="rtg-status" id="rtg-status" aria-live="polite"></div>
              `
                  : /* html */ `
                <p class="rtg-status">Giri can't listen in this browser — use 🎙 Record Reading instead and play it back together.</p>
              `
              }
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
        </div>
      </details>
    </div>
  `;

  // Follow-mode toggle (persisted so karaoke preference sticks across stories)
  dynamic.querySelectorAll('.follow-mode-btn[data-follow]').forEach((btn) => {
    btn.addEventListener('click', () => {
      _followMode = btn.dataset.follow;
      _persistPref(PREFS_FOLLOW_KEY, _followMode);
      _renderStory(story);
    });
  });

  // Word tap behaviour: one predictable action — a tap hears the word and
  // opens its Word Detective breakdown (unified sound colours + Review Lane),
  // no mode to choose. Every span is keyboard-accessible for pointer-free use.
  dynamic.querySelectorAll('.wf-word').forEach((span) => {
    span.setAttribute('role', 'button');
    span.setAttribute('tabindex', '0');
    const handle = (ev) => {
      const word = _plainWord(span);
      if (!word) return;
      ev.preventDefault();
      // Tapping a word is also how you move the ruler to it — the same
      // gesture, so a child never has to choose between "get help with this
      // word" and "keep my place".
      _ruler?.tap(ev.clientY ?? 0, span);
      _openWordDetective(word, span);
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
    _renderStory(story);
  });

  // Reading-ruler toggle
  document.getElementById('btn-toggle-ruler')?.addEventListener('click', () => {
    _showRuler = !_showRuler;
    _persistPref(PREFS_RULER_KEY, _showRuler);
    document.getElementById('btn-toggle-ruler')?.setAttribute('aria-pressed', String(_showRuler));
    _destroyRuler();
    if (_showRuler) {
      _startRuler();
      document.getElementById('btn-ruler-next')?.focus({ preventScroll: true });
    }
  });

  // ── Where the child stopped ────────────────────────────────────────────
  // The ruler, when it is on, both restores the place and reports every
  // move; without it the place is the first word below the top of the
  // reading pane, sampled as the child scrolls.
  if (_showRuler) requestAnimationFrame(() => _startRuler(_resumeWord));
  else if (_resumeWord !== null) requestAnimationFrame(() => _goToWord(_resumeWord));
  _wirePlaceTracking(story);

  document.getElementById('btn-resume-restart')?.addEventListener('click', (e) => {
    clearPlace(story.id);
    _resumeWord = null;
    e.currentTarget.closest('.story-resume')?.remove();
    _goToWord(0);
    if (_ruler) _ruler.goTo(0);
  });
  _wireResumeBannerDismiss();

  document.getElementById('btn-story-play')?.addEventListener('click', () => _startTTS(story));
  document.getElementById('btn-story-stop')?.addEventListener('click', () => _stopTTS());

  // The folded strip of words that cannot be sounded out — hearing one is
  // the only way to meet it, so a tap speaks it.
  dynamic.querySelectorAll('.story-prep-strip [data-prep-word]').forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.speakSightWord(btn.dataset.prepWord)?.catch?.(() => {});
      btn.classList.add('story-prep-word--said');
      setTimeout(() => btn.classList.remove('story-prep-word--said'), 600);
    });
  });

  document.getElementById('btn-finish-story')?.addEventListener('click', (e) => {
    _finishStory(story);
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = '✓ Read — well done!';
    const note = document.querySelector('.story-finish-note');
    if (note)
      note.textContent = story.comprehension?.length ? 'Now have a go at the questions.' : '';
  });

  // Fluency timer controls
  const wordCount = _countStoryWords(story);
  document
    .getElementById('btn-fluency-start')
    ?.addEventListener('click', () => _startFluencyTimer());
  document
    .getElementById('btn-fluency-done')
    ?.addEventListener('click', () => _stopFluencyTimer(wordCount, story));
  _wireFluencyForm(wordCount, story);

  // Recording controls
  _wireRecordingControls(story);

  // Read to Giri controls
  _resetReadToGiri();
  _wireReadToGiriControls(story);

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

// ── Sending a child back to the sentence ──────────────────────────────────
//
// What a teacher does with a wrong answer is not tell the child the answer.
// It is point at the place in the text that holds it, so the wrong answer
// becomes a second go at reading for meaning. The clue is located by
// storyClue.js; this lights it up and brings it into view.

/** The question "Show me where" is currently about. */
let _currentCompQuestion = '';

/**
 * Light up a clue sentence in the story body.
 * @param {{line:number, from:number, to:number}} clue
 */
function _highlightClue(clue) {
  _clearClue();
  const lineEl = _container?.querySelector(`#story-body [data-line="${clue.line}"]`);
  if (!lineEl) return;
  const words = [...lineEl.querySelectorAll('.wf-word')].filter((w) => {
    const i = Number(w.dataset.wordIdx);
    return i >= clue.from && i <= clue.to;
  });
  if (!words.length) return;
  words.forEach((w) => w.classList.add('is-clue'));
  // The ruler owns the scrolling when it is on, so it keeps its place in
  // step rather than being left behind on another line.
  if (_ruler) _ruler.follow(words[0]);
  else words[0].scrollIntoView({ behavior: _scrollBehavior(), block: 'center' });
}

function _clearClue() {
  _container?.querySelectorAll('.wf-word.is-clue').forEach((w) => w.classList.remove('is-clue'));
}

// ── Where the child stopped ───────────────────────────────────────────────

/** Bring a word into the calm upper part of the reading pane. */
function _goToWord(i) {
  const words = _container?.querySelectorAll('#story-body .wf-word');
  const el = words?.[Math.max(0, Math.min((words?.length ?? 1) - 1, i))];
  if (!el) return;
  el.scrollIntoView({ behavior: _scrollBehavior(), block: 'center' });
  // A brief mark, so the child can see WHERE they were rather than just
  // finding themselves somewhere down the page.
  el.classList.add('wf-word--resumed');
  setTimeout(() => el.classList.remove('wf-word--resumed'), 2600);
}

/**
 * Keep the saved place up to date while the child reads.
 *
 * Two sources, because there are two ways to read: with the ruler the place
 * is wherever the ruler is, which is exact; without it, the best guess is
 * the first word below the top of the reading pane, sampled after scrolling
 * settles. A finished story stops recording — re-reading it for fluency
 * should start at the top.
 */
function _wirePlaceTracking(story) {
  _unwirePlaceTracking();
  const body = document.getElementById('story-body');
  if (!body) return;
  const host = scrollHost(body);
  if (!host) return;

  _placeScrollHost = host;
  _placeScrollHost._pqPlaceHandler = () => {
    clearTimeout(_placeSaveTimer);
    _placeSaveTimer = setTimeout(() => {
      if (_ruler || getReadStories().includes(story.id)) return;
      const box = body.getBoundingClientRect();
      const safe = _rulerSafeArea();
      // Reading the questions rather than the story: leave the place alone.
      if (box.bottom < safe.top || box.top > safe.bottom) return;
      const words = [...body.querySelectorAll('.wf-word')];
      const i = words.findIndex((w) => w.getBoundingClientRect().top >= safe.top);
      if (i >= 0) savePlace(story.id, i);
    }, 500);
  };
  host.addEventListener('scroll', _placeScrollHost._pqPlaceHandler, { passive: true });
}

/**
 * The welcome-back banner has done its job once the child has got their
 * bearings, so it goes on their first scroll — or after a few seconds if
 * they just sit and read. Without this a sticky note would ride down the
 * whole story, covering the line they are on.
 */
function _wireResumeBannerDismiss() {
  const banner = document.getElementById('story-resume');
  if (!banner) return;
  const host = scrollHost(banner);
  let timer = 0;
  const go = () => {
    clearTimeout(timer);
    host?.removeEventListener('scroll', onScroll);
    banner.remove();
  };
  // Restoring the place scrolls the pane itself; ignore that one so the
  // banner is not dismissed before it has been seen.
  let settled = false;
  setTimeout(() => {
    settled = true;
  }, 1200);
  const onScroll = () => {
    if (settled) go();
  };
  host?.addEventListener('scroll', onScroll, { passive: true });
  timer = setTimeout(go, 9000);
}

function _unwirePlaceTracking() {
  clearTimeout(_placeSaveTimer);
  if (_placeScrollHost?._pqPlaceHandler) {
    _placeScrollHost.removeEventListener('scroll', _placeScrollHost._pqPlaceHandler);
    delete _placeScrollHost._pqPlaceHandler;
  }
  _placeScrollHost = null;
}

// ── Reading Ruler ─────────────────────────────────────────────────────────
//
// The toggle above used to set a class that underlined `.sline--active` —
// and that class is only ever set while text-to-speech is speaking. So the
// "ruler" drew a line under the sentence the app was reading aloud, and did
// nothing when the child read by themselves, which is the only time a
// reading ruler has a job. It is a real one now: see readingRuler.js.

/**
 * The band of screen the child can actually read in.
 *
 * Bounded by the scrolling pane, not the window: `#app` and `main` are
 * `overflow: hidden`, so the story scrolls inside a pane whose bottom is well
 * above the bottom of the browser window. Measuring against the window would
 * tell the ruler a line was comfortably in view when it was in fact below the
 * pane and invisible.
 *
 * Then trimmed by the sticky app header at the top and the ruler's own
 * controls at the bottom — the two things that sit over the text.
 */
function _rulerSafeArea() {
  const body = document.getElementById('story-body');
  const pane = body ? scrollHost(body) : null;
  const paneBox = pane?.getBoundingClientRect();
  const header = document.querySelector('.app-header');
  const nav = document.querySelector('.ruler-nav');

  const top = Math.max(paneBox?.top ?? 0, header?.getBoundingClientRect().bottom ?? 0) + 12;
  const floor = Math.min(paneBox?.bottom ?? window.innerHeight, window.innerHeight);
  const bottom = (nav ? Math.min(nav.getBoundingClientRect().top, floor) : floor) - 12;
  return { top: Math.max(0, top), bottom: Math.max(bottom, top + 120) };
}

function _rulerMode() {
  return RULER_MODES.find((m) => m.id === _rulerModeId) ?? RULER_MODES[1];
}

function _rulerNavHtml() {
  const m = _rulerMode();
  return /* html */ `
    <div class="ruler-nav" role="group" aria-label="Reading ruler">
      <button class="ruler-style" type="button" id="btn-ruler-style"
              aria-label="Ruler style: ${escapeAttr(m.label)}. Tap to change."
              title="${escapeAttr(m.hint)}">
        <span class="rs-i" aria-hidden="true">${m.icon}</span><small>${escapeHtml(m.label)}</small>
      </button>
      <button class="ruler-back" type="button" id="btn-ruler-back" aria-label="Back">◀</button>
      <span class="ruler-pos"><small></small><b></b></span>
      <button class="ruler-next btn btn--primary" type="button" id="btn-ruler-next">Next ▶</button>
    </div>`;
}

function _startRuler(startWord = null) {
  const storyEl = document.getElementById('story-body');
  const slot = document.getElementById('ruler-nav-slot');
  if (!storyEl || !slot) return;

  slot.innerHTML = _rulerNavHtml();
  const m = _rulerMode();
  const posLabel = slot.querySelector('.ruler-pos small');
  const posNum = slot.querySelector('.ruler-pos b');
  const next = slot.querySelector('#btn-ruler-next');
  const back = slot.querySelector('#btn-ruler-back');

  _ruler = createRuler(storyEl, {
    mode: m.id,
    word: startWord,
    wordSelector: '.wf-word',
    safeArea: _rulerSafeArea,
    onMove(s) {
      _rulerState = s;
      const byWord = m.id === 'word';
      posLabel.textContent = byWord ? 'Word' : 'Line';
      posNum.textContent = byWord ? `${s.word + 1} / ${s.words}` : `${s.line + 1} / ${s.lines}`;
      back.disabled = byWord ? s.word === 0 : s.line === 0;
      next.textContent = s.atEnd ? 'The end ✓' : byWord ? 'Next word ▶' : 'Next line ▶';
      next.classList.toggle('is-end', s.atEnd);
      // With the ruler on, the place is exactly where the ruler is.
      clearTimeout(_placeSaveTimer);
      _placeSaveTimer = setTimeout(() => {
        if (!getReadStories().includes(_currentStory?.id ?? ''))
          savePlace(_currentStory?.id, s.word);
      }, 400);
    },
  });

  back.addEventListener('click', () => _ruler?.prev());
  next.addEventListener('click', () => {
    if (!_rulerState?.atEnd) return _ruler?.next();
    // Tapping Next off the last line is the child saying they have finished.
    // The ruler is the one place where the app knows they read every line
    // themselves rather than listening to it.
    _finishStory(_currentStory);
  });
  slot.querySelector('#btn-ruler-style').addEventListener('click', () => {
    const at = _rulerState?.word ?? 0;
    const i = RULER_MODES.indexOf(_rulerMode());
    _rulerModeId = RULER_MODES[(i + 1) % RULER_MODES.length].id;
    _persistPref(PREFS_RULER_MODE_KEY, _rulerModeId);
    _destroyRuler();
    _startRuler(at);
    document.getElementById('btn-ruler-style')?.focus({ preventScroll: true });
  });
}

function _destroyRuler() {
  _ruler?.destroy();
  _ruler = null;
  _rulerState = null;
  const slot = document.getElementById('ruler-nav-slot');
  if (slot) slot.innerHTML = '';
}

/**
 * Arrow keys move the ruler (↓↑ by line, →← by word in Word mode). Skipped
 * while the focus is in a control that wants those keys for itself.
 */
function _onRulerKey(e) {
  if (!_ruler || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (e.target?.closest?.('input, textarea, select, summary, [contenteditable="true"]')) return;
  if (document.querySelector('.modal.active, .modal[open]')) return;
  // Arrows on the word panel's buttons must not slide the story out from
  // under the word being worked on.
  if (e.target?.closest?.('.word-panel')) return;
  const byWord = _rulerMode().id === 'word';
  const act = {
    ArrowDown: () => _ruler.nextLine(),
    ArrowUp: () => _ruler.prevLine(),
    ArrowRight: () => (byWord ? _ruler.next() : _ruler.nextLine()),
    ArrowLeft: () => (byWord ? _ruler.prev() : _ruler.prevLine()),
  }[e.key];
  if (!act) return;
  e.preventDefault();
  act();
}
document.addEventListener('keydown', _onRulerKey);

// ── Read to Giri (line-by-line listening) ─────────────────────────────────
//
// The child reads the glowing line; Giri listens (one single-shot recognition
// per line — continuous recognition is unreliable for children) and lights up
// the words it heard clearly. Flagged words are framed as "let's check this
// word together", never as errors, and are added to the spaced-review queue.

function _wireReadToGiriControls(story) {
  document
    .getElementById('btn-rtg-start')
    ?.addEventListener('click', () => _startReadToGiri(story));
  document.getElementById('btn-rtg-listen')?.addEventListener('click', () => _rtgListen(story));
  document.getElementById('btn-rtg-next')?.addEventListener('click', () => _rtgAdvance(story));
  document.getElementById('btn-rtg-exit')?.addEventListener('click', () => {
    _resetReadToGiri();
    _renderStory(story);
  });
}

function _rtgSetStatus(html) {
  const el = document.getElementById('rtg-status');
  if (el) el.innerHTML = html;
}

function _rtgLineEl() {
  const lineIdx = _rtgLines[_rtgLineIdx];
  return document.querySelector(`#story-body .sline[data-line="${lineIdx}"]`) || null;
}

function _startReadToGiri(story) {
  // Word-level highlighting needs the word spans — switch follow mode if the
  // reader is in whole-line mode, then resume from the re-rendered DOM.
  if (_followMode !== 'word') {
    _followMode = 'word';
    _persistPref(PREFS_FOLLOW_KEY, _followMode);
    _renderStory(story);
    // Re-render collapses the tool drawers; reopen the grown-up drawer and
    // the Read-to-Giri section so the controls the child just started stay put.
    const drawer = document.getElementById('practice-drawer');
    if (drawer) drawer.open = true;
    const bar = document.getElementById('rtg-bar');
    if (bar) bar.open = true;
  }

  _stopTTS();
  const lines = Array.from(document.querySelectorAll('#story-body .sline'))
    .filter((el) => el.querySelector('.wf-word'))
    .map((el) => Number(el.dataset.line));
  if (lines.length === 0) return;

  _rtgActive = true;
  _rtgLines = lines;
  _rtgLineIdx = 0;
  _rtgNullCount = 0;
  _rtgMisses = [];
  _rtgMatches = 0;
  _rtgTotal = 0;

  document.getElementById('btn-rtg-start')?.setAttribute('hidden', '');
  document.getElementById('btn-rtg-listen')?.removeAttribute('hidden');
  document.getElementById('btn-rtg-exit')?.removeAttribute('hidden');
  _rtgHighlightCurrent();
  _rtgSetStatus('Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.');
}

function _rtgHighlightCurrent() {
  document
    .querySelectorAll('#story-body .sline--rtg-current')
    .forEach((el) => el.classList.remove('sline--rtg-current'));
  const el = _rtgLineEl();
  if (el) {
    el.classList.add('sline--rtg-current');
    el.scrollIntoView({ block: 'center', behavior: _scrollBehavior() });
  }
}

async function _rtgListen(story) {
  const lineEl = _rtgLineEl();
  const listenBtn = document.getElementById('btn-rtg-listen');
  if (!lineEl || !listenBtn || listenBtn.disabled) return;

  const spans = Array.from(lineEl.querySelectorAll('.wf-word'));
  const expectedText = spans.map(_plainWord).filter(Boolean).join(' ');
  if (!expectedText) {
    _rtgAdvance(story);
    return;
  }

  listenBtn.disabled = true;
  listenBtn.replaceChildren(
    giriImageEl('encourage'),
    document.createTextNode('Giri is listening…'),
  );
  _rtgSetStatus('Go ahead — read the glowing line now.');

  const result = await listenToLine(expectedText);

  listenBtn.disabled = false;
  listenBtn.textContent = '🎙 Read this line';
  if (!_rtgActive) return; // exited while listening

  if (!result) {
    _rtgNullCount++;
    if (_rtgNullCount >= 2) {
      _rtgSetStatus(
        'Giri is having trouble hearing today. You can keep trying, or use <strong>🎙 Record Reading</strong> below and listen back together.',
      );
    } else {
      _rtgSetStatus(
        "Giri couldn't hear that — move a little closer to the microphone and try again!",
      );
    }
    return;
  }
  _rtgNullCount = 0;

  // Light up what Giri heard. Accepted = match or unsure (we never tell a
  // child they read a word wrongly on shaky evidence); only clear misses are
  // flagged — gently — for checking together.
  const flaggedHere = [];
  result.words.forEach((w, i) => {
    const span = spans[i];
    if (!span) return;
    span.classList.remove('rtg-word--match', 'rtg-word--check');
    if (w.status === 'miss') {
      span.classList.add('rtg-word--check');
      const clean = w.word.replace(/[^a-z]/g, '');
      if (clean.length > 2) {
        flaggedHere.push(clean);
        addWordToReview(clean);
      }
    } else {
      span.classList.add('rtg-word--match');
    }
  });

  const accepted = result.words.filter((w) => w.status !== 'miss').length;
  _rtgMatches += accepted;
  _rtgTotal += result.words.length;
  _rtgMisses.push(...flaggedHere);

  const isLast = _rtgLineIdx >= _rtgLines.length - 1;
  if (flaggedHere.length > 0) {
    _rtgSetStatus(
      `Nice reading! Let's check the orange ${flaggedHere.length === 1 ? 'word' : 'words'} together — tap ${flaggedHere.length === 1 ? 'it' : 'each one'} to hear it. Then ${isLast ? 'finish up' : 'go on'}!`,
    );
  } else {
    _rtgSetStatus('⭐ Great — Giri heard every word!');
  }

  document.getElementById('btn-rtg-listen')?.setAttribute('hidden', '');
  const nextBtn = document.getElementById('btn-rtg-next');
  if (nextBtn) {
    nextBtn.textContent = isLast ? '🌟 Finish' : 'Next line →';
    nextBtn.removeAttribute('hidden');
    nextBtn.focus();
  }
}

function _rtgAdvance(story) {
  if (_rtgLineIdx >= _rtgLines.length - 1) {
    _rtgFinish(story);
    return;
  }
  _rtgLineIdx++;
  document.getElementById('btn-rtg-next')?.setAttribute('hidden', '');
  document.getElementById('btn-rtg-listen')?.removeAttribute('hidden');
  _rtgHighlightCurrent();
  _rtgSetStatus('Read the glowing line out loud, then tap <strong>🎙 Read this line</strong>.');
}

function _rtgFinish(story) {
  const pct = _rtgTotal > 0 ? Math.round((_rtgMatches / _rtgTotal) * 100) : 0;
  const missedUnique = [...new Set(_rtgMisses)];

  // Per-story stats for the parent dashboard / report card.
  const stats = { ...(store.get('readAloudStats') || {}) };
  const prev = stats[story.id] || { attempts: 0 };
  stats[story.id] = {
    attempts: (prev.attempts || 0) + 1,
    lastMatchPct: pct,
    lastMissedWords: missedUnique.slice(0, 12),
    updatedAt: new Date().toISOString(),
  };
  store.set('readAloudStats', stats);

  document
    .querySelectorAll('#story-body .sline--rtg-current')
    .forEach((el) => el.classList.remove('sline--rtg-current'));
  document.getElementById('btn-rtg-next')?.setAttribute('hidden', '');
  document.getElementById('btn-rtg-exit')?.setAttribute('hidden', '');
  const startBtn = document.getElementById('btn-rtg-start');
  if (startBtn) {
    startBtn.removeAttribute('hidden');
    startBtn.textContent = 'Read it again';
  }

  const missNote = missedUnique.length
    ? ` Words to practise: <strong>${missedUnique.slice(0, 6).join(', ')}</strong> — they've been added to your review pile.`
    : ' Every word was loud and clear!';
  _rtgSetStatus(`🌟 You read the whole story to Giri — ${pct}% heard clearly.${missNote}`);

  markStoryRead(story.id);
  _rtgActive = false;
}

function _resetReadToGiri() {
  if (_rtgActive) stopListening();
  _rtgActive = false;
  _rtgLineIdx = -1;
  _rtgLines = [];
  _rtgNullCount = 0;
  _rtgMisses = [];
  _rtgMatches = 0;
  _rtgTotal = 0;
}

/**
 * Colour the vowels of a story-text segment by the SOUND each one makes here
 * (short / long / schwa / r-controlled / sliding / silent), so the same
 * letter reads differently in "căt", "cāke" and "əbout". Delegates to the
 * shared phonemeColors classifier so the inline scaffold, the Decode panel
 * and the Word Detective card all speak one colour language. A no-op when
 * the "Sound colours" scaffold is off. Extra args are accepted (and ignored)
 * for backward-compatible call sites.
 *
 * @param {string} text
 * @returns {string} HTML with sound-coloured vowel spans
 */
export function _highlightGraphemes(text) {
  if (!_showGraphemes || !text) return text;
  return soundColoredHtml(text);
}

/**
 * Legend for the "Sound colours" scaffold — one chip per vowel-sound
 * category so a grown-up and child can read what each colour means
 * (short ă, long ā, schwa ə, bossy-r, sliding, silent).
 * @returns {string} HTML
 */
function _soundLegendHtml() {
  const items = VOWEL_LEGEND.map(
    (s) => `
    <span class="sl-item">
      <span class="sl-chip vs--${s.key}">${s.mark || '•'}</span>${s.label}
    </span>`,
  ).join('');
  // Short and long also print their diacritic above the vowel in the story
  // itself, so the two that turn up on every line are never told apart by
  // colour alone, and a heart part prints a ♥. Saying so is what makes the
  // marks readable rather than mysterious.
  return `<div class="sound-legend" aria-label="What the vowel colours mean">
      <span class="sl-lead">A short vowel wears <b class="vs--short">˘</b>, a long vowel wears <b class="vs--long">¯</b>, and a heart part wears <b class="vs--heart">♥&#xFE0E;</b> — learn that bit by heart:</span>
      ${items}
    </div>`;
}

/**
 * A play's parts, and how to read it together. A play is for reading aloud
 * with someone: each reader takes a part, and swapping parts for a second
 * read is where the fluency practice comes from.
 * @param {object} story
 */
export function _castNoteHtml(story) {
  if (!story?.roles?.length) return '';
  return html`<p class="story-cast" role="note">
    🎭 <strong>A play to read together.</strong> The parts:
    ${story.roles.map(
      (role, i) =>
        html`<span class="story-cast-part" data-part="${i}">${role}</span>${i < story.roles.length - 1 ? ', ' : '.'}`,
    )}
    Pick a part each and read your lines with feeling. Then swap parts and read it again!
  </p>`;
}

/**
 * Build HTML for a story line.
 * @param {object} line
 * @param {number} i – line index
 * @param {boolean} [wordSpans=false] – if true, wrap each word in a span for word-follow highlighting
 * @param {object}  [story]            – the current story (for grapheme highlighting)
 */
export function _lineHtml(line, i, wordSpans = false, story = null) {
  const baseText = line.text ?? '';
  // "Problem:" / "Attempt:" / "Solution:" are the teacher's story-grammar
  // frame, not text the child decodes. Running them through the sound-colour
  // scaffold put a breve over "PRŎBLĔM" — phonics notation on a word that is
  // there to label the shape of the story, and one no Primary 1 reader is
  // being asked to sound out. They stay plain, and are not tappable.
  if (line.type === 'label') {
    return `<div class="sline sline--label" data-line="${i}">${escapeHtml(baseText)}</div>`;
  }
  const highlighted = story
    ? _highlightGraphemes(baseText, story.targetGraphemes, story.band)
    : baseText;
  const content = wordSpans ? _wordSpanText(baseText, story) : highlighted;
  if (line.type === 'script') {
    // A line in a play. The speaker's name tells whoever reads that part when
    // it is their turn; like "Problem:" it is not text to decode, so it sits
    // outside the word spans and the word numbering a clue relies on.
    const part = Math.max(0, (story?.roles ?? []).indexOf(line.role));
    return `<p class="sline sline--script" data-line="${i}" data-part="${part}"><span class="sline-role">${escapeHtml(line.role ?? '')}:</span> ${content}</p>`;
  }
  switch (line.type) {
    case 'chapter':
      return `<div class="sline sline--chapter"   data-line="${i}">📚 ${content}</div>`;
    case 'beat':
      return `<p class="sline sline--beat"        data-line="${i}">${content}</p>`;
    case 'intro':
      return `<p class="sline sline--intro"       data-line="${i}">${content}</p>`;
    case 'refrain':
      return `<p class="sline sline--refrain"     data-line="${i}">${content}</p>`;
    case 'end':
      return `<p class="sline sline--end"         data-line="${i}">${content}</p>`;
    case 'text':
      return `<p class="sline sline--text"        data-line="${i}">${content}</p>`;
    case 'paragraph':
      return `<p class="sline sline--paragraph"   data-line="${i}">${content}</p>`;
    default:
      return `<p class="sline"                    data-line="${i}">${content}</p>`;
  }
}

/**
 * Wrap each word in a span for word-follow highlighting and word taps.
 *
 * Two attributes matter beyond the index:
 *
 * `data-plain` is the word exactly as the story wrote it. The sound-colour
 * scaffold wraps vowels in `.vs` spans and CSS prints a breve or macron above
 * them from `data-cue`; on engines that expose pseudo-element content, reading
 * this node back with `textContent` can pick that diacritic up. Three features
 * read the word back out of the DOM — the tap handler, the karaoke
 * word-duration fallback and Read to Giri's expected text — so they read
 * `data-plain` and never have to trust the rendered text.
 *
 * `aria-label` is the same plain word. These spans are exposed as buttons, and
 * a button's name comes from its contents unless labelled — so without this a
 * screen reader could announce "cake" as "c ¯ a k e".
 */
function _wordSpanText(text, story = null) {
  if (!text) return '';
  const tokens = tokenise(text);
  let wordIdx = 0;
  return tokens
    .map((tok) => {
      if (tok.type === 'word') {
        const inner = story
          ? _highlightGraphemes(tok.text, story.targetGraphemes, story.band)
          : tok.text;
        return `<span class="wf-word" data-word-idx="${wordIdx++}" data-plain="${escapeAttr(tok.text)}" aria-label="${escapeAttr(tok.text)}">${inner}</span>`;
      }
      return tok.text;
    })
    .join('');
}

/** The word a `.wf-word` span stands for, never the rendered diacritics. */
function _plainWord(span) {
  return (span?.dataset?.plain ?? span?.textContent ?? '').trim();
}

// ── DECODE mode ───────────────────────────────────────────────────────────

/**
 * Put a blend ladder in `host`.
 *
 * The bank's split wins where it has the word; `deriveGraphemes` covers the
 * rest, which is most of them — only a third of story word tokens are bank
 * words, so without the fallback the ladder would appear on one tap in three
 * and "here, listen" the other two, for plainly decodable words like
 * "cakes" and "walked".
 *
 * Either way blend tiles are opened up: the bank groups "st" as a single
 * tile, and a ladder that jumps from nothing to "st" skips the blending it
 * exists to teach.
 *
 * `trusted` says the caller's split is the curated one. Word Detective hands
 * back a letter-by-letter placeholder for words it cannot find, which looks
 * like a split but is not one — taking it would have given "stayed" six rungs
 * (s·t·a·y·e·d) instead of four (s·t·ay·-ed).
 *
 * @param {HTMLElement} host
 * @param {{word:string, graphemes?:string[], types?:string[]}} wordObj
 * @param {boolean} [trusted]
 * @returns {boolean} false when the word cannot be split at all
 */
function _mountBlendLadder(host, wordObj, trusted = true) {
  const source =
    trusted && wordObj.graphemes?.length
      ? { graphemes: wordObj.graphemes, types: wordObj.types }
      : deriveGraphemes(wordObj.word);
  if (!source) return false;

  const { graphemes, types } = expandBlends(source.graphemes, source.types);
  renderBlendLadder(host, {
    word: wordObj.word,
    graphemes,
    types,
    speakPhoneme: (g, t, ctx) =>
      audio.speakPhoneme(g, t, {
        word: wordObj.word,
        prevGrapheme: ctx.index > 0 ? graphemes[ctx.index - 1] : null,
      }),
    speakWord: (w) => audio.speakWord(w),
  });
  return true;
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

/**
 * @param {object} story
 * @param {number} [fromLine] start at this line instead of the top — used to
 *   pick the narration back up after the child stopped to work out a word.
 */
function _startTTS(story, fromLine = 0) {
  if (!window.speechSynthesis) return;
  _stopTTS();
  _closeWordPanel({ restoreFocus: false });

  _currentStory = story;
  _toggleTTSButtons(true);
  _speaking = true;

  const segments = _buildSegments(story);
  const start = segments.findIndex((s) => s.highlightIdx >= fromLine);
  _speakNext(segments, Math.max(0, start));
}

function _speakNext(segments, idx, run = _ttsRun) {
  // Stopped, or superseded by a new start. This used to fall through to
  // "done" — so a Stop pressed in the pause between two lines, or a word
  // tapped there, finished the story: marked it read and showed the ending.
  if (run !== _ttsRun || !_speaking) return;
  if (idx >= segments.length) {
    _onTTSDone();
    return;
  }

  const seg = segments[idx];
  _ttsLine = seg.highlightIdx;
  _highlightLine(seg.highlightIdx);

  const utt = new SpeechSynthesisUtterance(seg.text);
  utt.rate = 0.82;
  _applyTtsVoice(utt);
  const pauseMs = seg.text.startsWith('Puff') ? 600 : 380;

  // Word-boundary highlighting (progressive enhancement)
  if (_followMode === 'word') {
    _attachBoundaryListener(utt, seg.highlightIdx);
  }

  utt.onend = () => {
    if (run !== _ttsRun) return;
    _clearWordHighlight();
    setTimeout(() => _speakNext(segments, idx + 1, run), pauseMs);
  };
  // Our own cancel arrives here as an "interrupted" error, and a real one
  // means the voice failed — neither is the child finishing the story.
  utt.onerror = () => {
    if (run === _ttsRun) _stopTTS();
  };

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
  const run = _ttsRun;

  const lineText = utt.text || '';
  let boundaryFired = false;
  let lastWordIdx = -1;
  let fallbackTimers = [];
  let fallbackStarted = false;

  function highlightWord(wordIdx) {
    // A timer from a narration that has since stopped — lighting words and
    // scrolling now would drag the story out from under the word panel.
    if (run !== _ttsRun) return;
    if (wordIdx < 0 || wordIdx >= wordSpans.length) return;
    if (wordIdx === lastWordIdx) return;
    lastWordIdx = wordIdx;
    wordSpans.forEach((s) => s.classList.remove('wf-word--active'));
    const active = wordSpans[wordIdx];
    active.classList.add('wf-word--active');
    // With the ruler on it does the scrolling, and keeps its own place in
    // step with the voice — so the child can take over mid-story without
    // first hunting for where Giri got to.
    if (_ruler) _ruler.follow(active);
    else _scrollIntoViewIfNeeded(active);
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
    const wordTexts = Array.from(wordSpans, _plainWord);
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

// ── The docked word panel ─────────────────────────────────────────────────
//
// Tapping a word used to open a modal over the story. The ladder in it ends
// "Does it make sense in the sentence?" — a question a child cannot answer
// with the sentence hidden behind a dimmed overlay. Checking a decoded word
// against its context is the habit that turns sounding-out into reading, so
// the panel now docks at the bottom of the screen like a card held under the
// line, and the story scrolls so the tapped word sits just above it, marked,
// in its sentence. It is not modal: the story stays readable and tappable.

/**
 * Open the panel for a tapped word: the blend ladder, or for a word that
 * cannot be split (a name, usually) its tiles and a way to hear it.
 * Charter-safe: the "Add to Review Lane" CTA only appears when the word is in
 * the WORDS bank (no stat pollution for story-only names).
 *
 * @param {string} text — raw word text from the tapped span
 * @param {HTMLElement} [span] — the tapped word; kept in sight and marked
 *   while the panel is open, and given focus back when it closes
 * @private
 */
function _openWordDetective(text, span) {
  // Counted for the ending: "you worked out 3 words by sounding them out" is
  // the one number a beginning reader can be proud of without it being a score.
  _wordsHelped.add(text.toLowerCase().replace(/[^a-z']/g, ''));
  // Pause any karaoke so the child can focus on the word — but remember it
  // was playing, so the way back can pick it up again at the same line.
  const wasSpeaking = _speaking;
  const resumeLine = _ttsLine;
  _stopTTS();
  _closeWordPanel({ restoreFocus: false });

  const info = lookupWordForDetective(text);
  const p = _ensureWordPanel();
  p.setAttribute('aria-label', `Sound out the word ${info.text}`);
  p.innerHTML = _renderWordDetectiveCard(info, { resume: wasSpeaking });
  p.hidden = false;
  document.body.classList.add('word-panel-open');

  _panelWord = span?.isConnected ? span : null;
  _panelWord?.classList.add('wf-word--looking');
  _panelRoomHost = _panelWord
    ? (_panelWord.closest('.stories-content') ?? scrollHost(_panelWord))
    : null;

  // Tapping a word is one action, so it teaches one thing wherever it is
  // tapped: the blend ladder. The panel does not say the word on open —
  // being told the answer before you have looked at it is the opposite of
  // sounding it out. "Just hear the word" is one tap away throughout.
  const ladderHost = p.querySelector('[data-role="ladder"]');
  const ladder =
    ladderHost &&
    _mountBlendLadder(
      ladderHost,
      { word: info.text, graphemes: info.graphemes, types: info.types },
      info.foundInBank,
    );
  if (!ladder) {
    // A proper noun or a name — nothing to split, so hearing it is all this
    // panel can honestly offer.
    const fallback = p.querySelector('.wd-fallback');
    if (fallback) fallback.hidden = false;
    try {
      audio.speakWord(info.text);
    } catch (_) {
      /* ignore — no SFX */
    }
  }

  p.querySelector('[data-action="hear"]')?.addEventListener('click', () => {
    try {
      audio.speakWord(info.text);
    } catch (_) {
      /* ignore */
    }
  });

  const addBtn = p.querySelector('[data-action="add-review"]');
  addBtn?.addEventListener('click', () => {
    if (!info.word) return;
    const ok = addWordToReview(info.word.id);
    if (ok) {
      addBtn.disabled = true;
      addBtn.textContent = '✓ In your Review Lane';
    }
  });

  p.querySelector('[data-action="close"]')?.addEventListener('click', () => _closeWordPanel());
  p.querySelector('[data-action="back"]')?.addEventListener('click', () => {
    _closeWordPanel();
    if (wasSpeaking && _currentStory) _startTTS(_currentStory, resumeLine);
  });

  // Straight to the child's next move: the next sound, or for a name, hearing it.
  const first =
    p.querySelector('.bl-next:not([hidden])') ??
    p.querySelector('[data-action="hear"]') ??
    p.querySelector('[data-action="close"]');
  first?.focus({ preventScroll: true });

  _keepWordInSight();
  // Check again once scrolling has finished. Layout can shift underneath a
  // smooth scroll — the page itself clamping its own scroll as the screen
  // settles moved the word 26px after it had been placed, leaving it 6px
  // above the panel. _keepWordInSight re-sizes the pane's room each time, so
  // a second pass absorbs the shift. scrollend where supported, a timer
  // where not; whichever comes first, and cancelled if the panel closes.
  _panelSettle = new AbortController();
  const { signal } = _panelSettle;
  const settle = () => {
    if (signal.aborted) return;
    _keepWordInSight();
  };
  (_panelRoomHost ?? window).addEventListener('scrollend', settle, { once: true, signal });
  window.addEventListener('scrollend', settle, { once: true, signal });
  const settleTimer = setTimeout(settle, 700);
  signal.addEventListener('abort', () => clearTimeout(settleTimer));
  // The ladder grows a rung at a time and can wrap onto another line, which
  // makes the panel taller and would slide it up over the word. Re-check
  // whenever it changes size (and on rotation, which resizes it too).
  if (typeof ResizeObserver === 'function') {
    _panelObserver = new ResizeObserver(() => _keepWordInSight());
    _panelObserver.observe(p);
  }
}

/** The panel is created once, on <body>: `#app` clips its overflow. */
function _ensureWordPanel() {
  if (_wordPanel?.isConnected) return _wordPanel;
  const p = document.createElement('aside');
  p.id = 'word-panel';
  p.className = 'word-panel';
  // A non-modal dialog: it has a name and Escape closes it, but the story
  // behind it is not inert — the child reads the sentence while using it.
  p.setAttribute('role', 'dialog');
  p.hidden = true;
  document.body.appendChild(p);
  _wordPanel = p;
  return p;
}

/**
 * Close the panel. Focus goes back to the word that opened it, so a keyboard
 * or switch user carries on from exactly where they were in the story.
 *
 * @param {{restoreFocus?: boolean}} [opts] false when the story is being
 *   re-rendered or left, and the word is no longer the place to be.
 */
function _closeWordPanel({ restoreFocus = true } = {}) {
  _panelObserver?.disconnect();
  _panelObserver = null;
  _panelSettle?.abort();
  _panelSettle = null;
  if (_panelRoomHost) _panelRoomHost.style.paddingBottom = '';
  _panelRoomHost = null;
  document.body.classList.remove('word-panel-open');
  document
    .querySelectorAll('.wf-word--looking')
    .forEach((el) => el.classList.remove('wf-word--looking'));
  const word = _panelWord;
  _panelWord = null;
  if (!_wordPanel || _wordPanel.hidden) return;
  try {
    audio.cancelSpeech?.();
  } catch (_) {
    /* ignore */
  }
  _wordPanel.hidden = true;
  _wordPanel.innerHTML = '';
  if (restoreFocus && word?.isConnected) word.focus({ preventScroll: true });
}

/**
 * Scroll the tapped word to just above the panel, if the panel is covering
 * it. The pane is first given bottom padding the height of the panel, so a
 * word on the last line can be lifted clear too.
 * @private
 */
function _keepWordInSight() {
  const p = _wordPanel;
  const word = _panelWord;
  if (!p || p.hidden || !word?.isConnected) return;
  // Where the panel comes to rest, not where its slide-in has got to: the box
  // is still easing up for a moment after it opens, and measuring that left
  // the word tucked against the panel's edge.
  const bottomGap = parseFloat(getComputedStyle(p).bottom) || 0;
  const panelTop = window.innerHeight - bottomGap - p.offsetHeight;
  const host = _panelRoomHost;
  const hostRect = host?.getBoundingClientRect();
  if (host && hostRect) {
    host.style.paddingBottom = `${Math.max(0, Math.ceil(hostRect.bottom - panelTop) + 24)}px`;
  }
  const r = word.getBoundingClientRect();
  const paneTop = hostRect?.top ?? 0;
  let by = 0;
  if (r.bottom > panelTop - 16) {
    // Under the panel: lift it to just above, with breathing room — but never
    // so far that the word itself goes up under the top of the pane.
    by = Math.min(r.bottom - panelTop + 32, Math.max(0, r.top - paneTop - 8));
  } else if (r.top < paneTop + 8) {
    // Above the pane, which a rotation or a resize re-wrapping the story can
    // do: bring it back down into the band between the top and the panel.
    by = r.top - (paneTop + (panelTop - paneTop) * 0.4);
  }
  if (by) (host ?? window).scrollBy({ top: by, behavior: _scrollBehavior() });
}

// Escape closes the panel — unless a modal is open above it, which owns the key.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !_wordPanel || _wordPanel.hidden) return;
  if (document.querySelector('.modal-overlay:not([hidden])')) return;
  e.preventDefault();
  _closeWordPanel();
});

/**
 * Build the panel's HTML. Pure — takes a lookup result, returns an HTML
 * string with grapheme tiles colour-coded via the shared sound palette.
 *
 * @param {ReturnType<import('../modules/wordDetective.js').lookupWord>} info
 * @param {{resume?: boolean}} [opts] resume: narration was playing when the
 *   word was tapped, so the way back offers to carry on listening.
 * @returns {string}
 */
function _renderWordDetectiveCard(info, { resume = false } = {}) {
  const escText = (s) =>
    String(s ?? '').replace(
      /[<>&"]/g,
      (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c],
    );

  // The blend ladder is mounted into the slot below by `_openWordDetective`,
  // and brings its own tiles and its own "hear the word". The coloured tiles
  // and the Hear button here are the fallback for a word that cannot be
  // split at all — a name, usually — and are added by that branch, so they
  // never sit above a ladder saying the same thing twice.
  const sounds = graphemeSounds(info.text, info.graphemes, info.types);
  const tilesHtml = info.graphemes
    .map((g, i) => {
      const meta = SOUND_META[sounds[i]] ?? SOUND_META.consonant;
      const mark = meta.mark ? ` data-mark="${escText(meta.mark)}"` : '';
      return `<span class="wd-tile vs--${sounds[i]}"${mark} style="--tile-color:${meta.color}" aria-label="${escText(g)}, ${escText(meta.label)}">${escText(g)}</span>`;
    })
    .join('');

  const inBankBlock = info.foundInBank
    ? `<button class="btn btn--ghost btn--sm" type="button" data-action="add-review" ${info.alreadyTracked ? 'disabled' : ''}>
         ${info.alreadyTracked ? '✓ Already in your Review Lane' : '🎯 Add to my Review Lane'}
       </button>`
    : '';

  // Ghost, not primary: the one filled button in the panel is the child's
  // next move in the ladder, and two of them compete for the same tap.
  // The way back says what the child was doing: reading by themselves, or
  // listening to Giri — in which case it carries on from the same line, so
  // they hear the word they just worked out in its sentence.
  const backLabel = resume ? '▶ Keep listening' : '↩ Back to my story';

  return `
    <div class="wd-card">
      <button class="wp-close" type="button" data-action="close" aria-label="Close">✕</button>
      <p class="wd-word">${escText(info.text)}</p>
      <div data-role="ladder"></div>
      <div class="wd-fallback" hidden>
        ${tilesHtml ? `<div class="wd-tiles" aria-label="Sound breakdown">${tilesHtml}</div>` : ''}
        <button class="btn btn--ghost" type="button" data-action="hear">🔊 Hear it</button>
      </div>
      <div class="wd-actions">
        <button class="btn btn--ghost btn--sm wp-back" type="button" data-action="back">${backLabel}</button>
        ${inBankBlock}
      </div>
    </div>`;
}

/**
 * Scroll an element into view only if it's currently off-screen — cheap
 * and jiggle-free for karaoke highlighting; doesn't fight a manual scroll.
 * @private
 */
/**
 * Scroll behavior that honours the OS/app reduced-motion preference —
 * CSS handles its own animations, but scrollIntoView must check in JS.
 * @private
 */
function _scrollBehavior() {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}

function _scrollIntoViewIfNeeded(el) {
  if (!el || typeof el.getBoundingClientRect !== 'function') return;
  try {
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    if (isOffscreen(rect, viewportH)) {
      el.scrollIntoView({ block: 'center', behavior: _scrollBehavior() });
    }
  } catch (_) {
    /* JSDOM or older browsers — ignore */
  }
}

/** Remove word-level highlighting from all word spans. */
function _clearWordHighlight() {
  _container
    ?.querySelectorAll('.wf-word--active')
    .forEach((el) => el.classList.remove('wf-word--active'));
}

function _highlightLine(lineIndex) {
  _container
    ?.querySelectorAll('.sline--active')
    .forEach((el) => el.classList.remove('sline--active'));
  _clearWordHighlight();
  const el = _container?.querySelector(`[data-line="${lineIndex}"]`);
  if (el) {
    el.classList.add('sline--active');
    // The ruler owns the scrolling when it is on, so it stays in step with
    // the voice instead of fighting it for the scroll position.
    const firstWord = el.querySelector('.wf-word');
    if (_ruler && firstWord) _ruler.follow(firstWord);
    else el.scrollIntoView({ behavior: _scrollBehavior(), block: 'nearest' });
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
  let voice;
  try {
    voice = audio.getTtsVoice?.() || null;
  } catch (_) {
    voice = null;
  }
  if (voice) {
    utt.voice = voice;
    utt.lang = voice.lang || 'en-GB';
  } else {
    utt.lang = 'en-GB';
  }
}

function _stopTTS() {
  _ttsRun++;
  _speaking = false;
  window.speechSynthesis?.cancel();
  _container
    ?.querySelectorAll('.sline--active')
    .forEach((el) => el.classList.remove('sline--active'));
  _clearWordHighlight();
  _toggleTTSButtons(false);
}

function _onTTSDone() {
  _ttsRun++;
  _speaking = false;
  _container
    ?.querySelectorAll('.sline--active')
    .forEach((el) => el.classList.remove('sline--active'));
  _clearWordHighlight();
  _toggleTTSButtons(false);
  _finishStory(_currentStory);
}

/**
 * The story is done — by whichever of the three routes got here.
 *
 * The read-aloud running out, the ruler reaching the last line, and the
 * child tapping "I have read the story" all mean the same thing and all did
 * the same four steps in three places. One path now, so a route can never
 * quietly skip the ending or the quest.
 */
function _finishStory(story) {
  if (!story) return;
  _closeWordPanel({ restoreFocus: false });
  markStoryRead(story.id);
  const cta = document.getElementById('story-quest-cta');
  if (cta) cta.hidden = false;
  _showComprehensionCheck(story);
  _showEnding(story);
}

// ── The end of a story ────────────────────────────────────────────────────
//
// Finishing used to produce a disabled button, or a Quest card for the 34 of
// 69 stories that carry quest data. There was no "read it again", no next
// story and no way to stop — so the session had no end, and a child who had
// just read 150 words was told nothing about it.

/** Words the child worked on with Sound It Out during this reading. */
const _wordsHelped = new Set();

/** The next unread story on the same shelf, else the next one along. */
function _nextStory(story) {
  const shelf = STORIES.filter(
    (s) => s.band === story.band && s.category === story.category && s.id !== story.id,
  );
  const read = getReadStories();
  return shelf.find((s) => !read.includes(s.id)) ?? shelf[0] ?? null;
}

/**
 * What the child did, in things they can recognise — words read, words
 * worked on, times through. Never a score, and never a speed: this is the
 * end of a story, not a test result.
 */
function _endingFacts(story) {
  const facts = [
    html`You read <strong>${story.title}</strong> — ${_countStoryWords(story)} words.`,
  ];
  if (_wordsHelped.size) {
    const n = _wordsHelped.size;
    facts.push(
      html`You worked out ${n} ${n === 1 ? 'word' : 'words'} by sounding
      ${n === 1 ? 'it' : 'them'} out.`,
    );
  }
  if (story.roles || story.talkAboutIt?.length) {
    facts.push(html`You had a think about what happened.`);
  }
  const friend = isFriendUnlocked(story.id) ? friendFromStory(story)?.name : '';
  // The co-star by name — "Bakes a Cake's friend" is not a name.
  if (friend) facts.push(html`<strong>${friend}</strong> has joined your 🐾 Friends.`);
  return facts;
}

function _showEnding(story) {
  if (!story) return;
  const host = _container?.querySelector('.story-content-wrap');
  if (!host || host.querySelector('.story-ending')) return;

  const next = _nextStory(story);
  const panel = document.createElement('section');
  panel.className = 'story-ending';
  panel.setAttribute('aria-label', 'You finished the story');
  panel.innerHTML = html`
    <h3 class="story-ending-title">🌟 You read the whole story!</h3>
    <ul class="story-ending-facts">
      ${_endingFacts(story).map((f) => html`<li>${f}</li>`)}
    </ul>
    <div class="story-ending-actions">
      <button class="btn btn--ghost" type="button" id="btn-ending-again">📖 Read it again</button>
      ${
        next
          ? html`<button
            class="btn btn--ghost"
            type="button"
            id="btn-ending-next"
            data-story-id="${next.id}"
          >
            ➡️ Next: ${next.title}
          </button>`
          : ''
      }
      <button class="btn btn--primary" type="button" id="btn-ending-done">🏁 Finish for today</button>
    </div>
  `;
  host.appendChild(panel);
  panel.scrollIntoView({ behavior: _scrollBehavior(), block: 'nearest' });

  panel.querySelector('#btn-ending-again')?.addEventListener('click', () => {
    // A re-read starts at the top — that is what re-reading for fluency is.
    _wordsHelped.clear();
    clearPlace(story.id);
    _resumeWord = null;
    panel.remove();
    _goToWord(0);
    if (_ruler) _ruler.goTo(0);
  });
  panel.querySelector('#btn-ending-next')?.addEventListener('click', (e) => {
    _stopTTS();
    _showReader(e.currentTarget.dataset.storyId);
  });
  panel.querySelector('#btn-ending-done')?.addEventListener('click', () => {
    _stopTTS();
    _renderBrowser();
  });
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
  // Which question "Show me where" should look for — it changes when the
  // child taps "one more question".
  _currentCompQuestion = question;
  // Stories carry a retrieval question first and a thinking question second
  // (inference, vocabulary in context, or the story's message). Only one is
  // ever on screen — two at once is a lot for a young reader — but the second
  // must be reachable, or authoring it was pointless.
  const followUp = story.talkAboutIt[1] || '';

  const panel = document.createElement('div');
  panel.className = 'comp-check';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Comprehension check');
  panel.innerHTML = /* html */ `
    <h4>💬 Quick check</h4>
    <div class="comp-q" id="comp-q">${question}</div>
    <div class="comp-choices">
      <button class="comp-choice" data-resp="confident" type="button">🙂 I can answer this</button>
      <button class="comp-choice" data-resp="reread" type="button">🤔 Let me re-read</button>
      <button class="comp-choice" data-resp="hint" type="button">💭 Show me where</button>
    </div>
    <div class="comp-feedback" id="comp-feedback" hidden></div>
    ${followUp ? '<button class="comp-more" id="comp-more" type="button" hidden>💬 One more question</button>' : ''}
    <button class="comp-skip" id="comp-skip" type="button">Skip</button>
  `;
  content.appendChild(panel);
  panel.scrollIntoView({ behavior: _scrollBehavior(), block: 'nearest' });

  const feedback = panel.querySelector('#comp-feedback');

  panel.querySelectorAll('.comp-choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      const resp = btn.dataset.resp;
      _logComprehensionAttempt({ storyId: story.id, question, response: resp });

      panel.querySelectorAll('.comp-choice').forEach((b) => (b.disabled = true));
      btn.classList.add('correct'); // green outline regardless — this is a self-check

      if (resp === 'confident') {
        feedback.textContent = '👍 Great! You understood the story.';
      } else if (resp === 'reread') {
        feedback.textContent = '📖 Good plan — listening again helps build fluency.';
        // If TTS is available, re-start the read-aloud for the same story
        setTimeout(() => _startTTS(story), 300);
      } else {
        // The sentence that actually answers THIS question, located by word
        // overlap (storyClue.js). This used to scroll to the last line of
        // the story whatever was asked — a fixed guess dressed as help.
        const clue = findClue(story, _currentCompQuestion || question);
        if (clue) {
          feedback.textContent = '💡 Have a look at the sentence we have lit up.';
          _highlightClue(clue);
        } else {
          // Some questions ("what does this story teach us?") have no one
          // sentence behind them. Saying so beats pointing somewhere wrong.
          feedback.textContent =
            '💭 This one is not written down in the story — it is for you to work out. Have a think, then tell someone your answer.';
        }
      }
      feedback.hidden = false;
      // Offer the thinking question once the first one is answered.
      const more = panel.querySelector('#comp-more');
      if (more) more.hidden = false;
    });
  });

  panel.querySelector('#comp-more')?.addEventListener('click', () => {
    const qEl = panel.querySelector('#comp-q');
    if (qEl) qEl.textContent = followUp;
    _currentCompQuestion = followUp;
    _clearClue();
    _logComprehensionAttempt({ storyId: story.id, question: followUp, response: 'followup' });
    panel.querySelector('#comp-more')?.remove();
    if (feedback) {
      feedback.textContent = '💭 Have a think, then tell someone your answer.';
      feedback.hidden = false;
    }
    // Re-open the choices so the child can respond to the new question.
    panel.querySelectorAll('.comp-choice').forEach((b) => {
      b.disabled = false;
      b.classList.remove('correct');
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
 * Created on demand rather than kept in index.html.
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

  const escText = (s) =>
    String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);

  // Group by band so the wall reads as a journey
  const byBand = new Map();
  for (const friend of summary.roster) {
    if (!byBand.has(friend.band)) byBand.set(friend.band, []);
    byBand.get(friend.band).push(friend);
  }

  const sectionsHtml = Array.from(byBand.entries())
    .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
    .map(([band, friends]) => {
      const unlockedInBand = friends.filter((f) => f.unlocked).length;
      const tilesHtml = friends
        .map(
          (f) => `
        <button class="sf-tile ${f.unlocked ? 'sf-tile--unlocked' : 'sf-tile--locked'}"
                data-story-id="${escText(f.storyId)}"
                ${f.unlocked ? '' : 'disabled aria-disabled="true"'}
                aria-label="${f.unlocked ? `${escText(f.name)} from ${escText(f.storyTitle)} — tap to re-read` : `Locked — read ${escText(f.storyTitle)} to meet ${escText(f.name)}`}">
          <span class="sf-tile__emoji" aria-hidden="true">${f.unlocked ? escText(f.emoji) : '🔒'}</span>
          <span class="sf-tile__name">${f.unlocked ? escText(f.name) : '???'}</span>
          ${f.unlocked ? `<span class="sf-tile__story">from ${escText(f.storyTitle)}</span>` : `<span class="sf-tile__story">${escText(f.storyTitle)}</span>`}
        </button>
      `,
        )
        .join('');
      return `
        <div class="sf-band">
          <h3 class="sf-band__title">Band ${escText(band)} <small>${unlockedInBand}/${friends.length} met</small></h3>
          <div class="sf-grid">${tilesHtml}</div>
        </div>`;
    })
    .join('');

  const intro =
    summary.unlocked === 0
      ? '🐾 Read a Giri Story and the co-star moves in here. No friends yet — start with Band A!'
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
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modalManager.close('modal-story-friends');
      modal.remove();
    }
  });

  // Tap an unlocked tile → close the modal and open that story.
  modal.querySelectorAll('.sf-tile--unlocked[data-story-id]').forEach((tile) => {
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
  if (stop) stop.style.display = playing ? '' : 'none';
  // While listening, mark the reader so CSS can collapse the hero
  // illustration and give the story body the space it needs (audit
  // finding #5 — hero is 250px tall on desktop and only matters
  // pre-play).
  const reader = _container?.querySelector('.story-reader');
  if (reader) reader.classList.toggle('story-reader--listening', playing);
}

const _delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Recording controls ────────────────────────────────────────────────────

function _wireRecordingControls(story) {
  const btnStart = document.getElementById('btn-rec-start');
  const btnStop = document.getElementById('btn-rec-stop');
  const btnPlay = document.getElementById('btn-rec-play');
  const btnDelete = document.getElementById('btn-rec-delete');
  const statusEl = document.getElementById('recording-status');
  if (!btnStart) return;

  function updateUI(state) {
    btnStart.hidden = state !== 'idle';
    btnStop.hidden = state !== 'recording';
    btnPlay.hidden = state !== 'recorded' && state !== 'playing';
    btnDelete.hidden = state !== 'recorded' && state !== 'playing';

    if (statusEl) {
      switch (state) {
        case 'recording':
          statusEl.textContent = '🔴 Recording...';
          statusEl.className = 'recording-status recording-status--active';
          break;
        case 'recorded':
          statusEl.textContent = '✓ Recording ready';
          statusEl.className = 'recording-status recording-status--ready';
          break;
        case 'playing':
          statusEl.textContent = '▶ Playing...';
          statusEl.className = 'recording-status recording-status--playing';
          break;
        case 'error':
          statusEl.textContent = '⚠ Microphone not available — check permissions';
          statusEl.className = 'recording-status recording-status--error';
          break;
        default:
          statusEl.textContent = '';
          statusEl.className = 'recording-status';
          break;
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
  const btnNext = document.getElementById('btn-echo-next');
  const btnRec = document.getElementById('btn-echo-rec');
  const btnPlay = document.getElementById('btn-echo-play');
  const btnExit = document.getElementById('btn-echo-stop');
  const statusEl = document.getElementById('echo-read-status');
  if (!btnStart) return;

  // Filter to speakable lines only
  const speakableLines = story.lines
    .map((l, i) => ({ ...l, idx: i }))
    .filter((l) => l.type !== 'label' && l.type !== 'chapter' && l.text);

  let currentEchoIdx = -1;

  function resetEchoUI() {
    btnStart.hidden = false;
    btnNext.hidden = true;
    btnRec.hidden = true;
    btnPlay.hidden = true;
    btnExit.hidden = true;
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'echo-read-status';
    }
    _container
      ?.querySelectorAll('.sline--echo-active')
      .forEach((el) => el.classList.remove('sline--echo-active'));
    currentEchoIdx = -1;
    _echoLineIdx = -1;
  }

  function showEchoLine(echoIdx) {
    currentEchoIdx = echoIdx;
    const line = speakableLines[echoIdx];
    if (!line) {
      resetEchoUI();
      return;
    }

    _echoLineIdx = line.idx;

    // Highlight the line
    _container
      ?.querySelectorAll('.sline--echo-active')
      .forEach((el) => el.classList.remove('sline--echo-active'));
    const lineEl = _container?.querySelector(`[data-line="${line.idx}"]`);
    if (lineEl) {
      lineEl.classList.add('sline--echo-active');
      lineEl.scrollIntoView({ behavior: _scrollBehavior(), block: 'nearest' });
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
          if (statusEl) {
            statusEl.textContent = '🔴 Recording...';
            statusEl.className = 'echo-read-status echo-read-status--recording';
          }
        } else if (state === 'recorded') {
          btnRec.hidden = true;
          btnPlay.hidden = false;
          btnNext.hidden = currentEchoIdx >= speakableLines.length - 1;
          if (statusEl) {
            statusEl.textContent = '✓ Great job!';
            statusEl.className = 'echo-read-status echo-read-status--done';
          }
        } else if (state === 'error') {
          if (statusEl) {
            statusEl.textContent = '⚠ Microphone not available';
            statusEl.className = 'echo-read-status echo-read-status--error';
          }
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
      if (statusEl) {
        statusEl.textContent = '🎉 Echo Read complete!';
        statusEl.className = 'echo-read-status echo-read-status--done';
      }
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
  _fluencyStart = Date.now();
  document.getElementById('btn-fluency-start').disabled = true;
  document.getElementById('btn-fluency-done').disabled = false;

  _fluencyTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - _fluencyStart) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const clock = document.getElementById('fluency-clock');
    if (clock) clock.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
  }, 500);
}

const _clock = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

/**
 * Stop the timer and ask the grown-up for the error count.
 *
 * Nothing is reported or saved until they answer, because without an error
 * count the number is words per minute, and words per minute cannot be
 * compared to a words-CORRECT-per-minute benchmark. It used to print
 * "🌟 Fluent reader!" at 60 with no grade and no errors counted — which is
 * about the middle of Grade 1 at year's end and about the 10th percentile
 * for Grade 2, so the child most in need of the timing was the one most
 * likely to be congratulated by it.
 *
 * @param {number} [wordCount]
 * @param {object} [story]
 */
function _stopFluencyTimer(wordCount, story) {
  if (!_fluencyRunning && _fluencyTimer === null) return;
  clearInterval(_fluencyTimer);
  _fluencyTimer = null;
  _fluencyRunning = false;

  const startBtn = document.getElementById('btn-fluency-start');
  const doneBtn = document.getElementById('btn-fluency-done');
  if (startBtn) startBtn.disabled = false;
  if (doneBtn) doneBtn.disabled = true;

  if (!wordCount || !_fluencyStart) return;
  const seconds = (Date.now() - _fluencyStart) / 1000;
  _fluencyStart = null;

  const result = document.getElementById('fluency-result');
  const form = document.getElementById('fluency-form');
  if (seconds < 5) {
    if (result) {
      result.hidden = false;
      result.textContent = 'That was very quick — start timing as the reading begins.';
    }
    return;
  }
  if (!form) return;

  _fluencySeconds = seconds;
  if (result) result.hidden = true;
  form.hidden = false;
  const timeEl = document.getElementById('fluency-time');
  if (timeEl) timeEl.textContent = `${wordCount} words in ${_clock(seconds)}.`;
  form.querySelector('input[name="errors"]')?.focus({ preventScroll: true });
}

/** Wire the error-count form that turns a timing into a reading. */
function _wireFluencyForm(wordCount, story) {
  const form = document.getElementById('fluency-form');
  const result = document.getElementById('fluency-result');
  if (!form || !result) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = form.querySelector('input[name="errors"]')?.value ?? '';
    const errors = raw === '' ? null : Number(raw);
    const support = form.querySelector('input[name="support"]:checked')?.value ?? null;
    const { wpm, wcpm, accuracy } = readingRate(wordCount, _fluencySeconds, errors);

    saveFluencyAttempt({
      storyId: story.id,
      wpm,
      wcpm,
      errors,
      accuracy,
      support,
      durationSec: _fluencySeconds,
      wordCount,
    });

    const read = describeFluency({
      wpm,
      wcpm,
      primaryGrade: getActiveProfile()?.primaryGrade ?? null,
    });

    form.hidden = true;
    form.reset();
    result.hidden = false;
    result.innerHTML = html`
      <div class="fluency-result-inner">
        <span class="fluency-time">${_clock(_fluencySeconds)}</span>
        <span class="fluency-wcpm">${read.headline}</span>
        ${accuracy != null ? html`<span class="fluency-acc">${accuracy}% accurate</span>` : ''}
      </div>
      <p class="fluency-detail">${read.detail}</p>
      ${read.reference ? html`<p class="fluency-reference">${read.reference}</p>` : ''}
    `;
    const cta = document.getElementById('story-quest-cta');
    if (cta) cta.hidden = false;
  });

  document.getElementById('btn-fluency-discard')?.addEventListener('click', () => {
    form.hidden = true;
    form.reset();
    result.hidden = false;
    result.textContent = 'Not saved.';
  });
}
