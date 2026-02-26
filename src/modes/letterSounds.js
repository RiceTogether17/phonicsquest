/**
 * Letter Sounds — Introduction Screen
 *
 * A browsable reference showing every grapheme-phoneme correspondence
 * found in the word bank, organised by phoneme type. Tapping a card
 * plays the isolated sound and shows an example word.
 *
 * Used as a standalone screen (like Stories), not as a word-game mode.
 */

import { audio } from '../modules/audio.js';
import { WORDS } from '../data/words.js';

const BASE = import.meta.env.BASE_URL;

// ── Phoneme-type metadata ─────────────────────────────────────────────────

const TYPE_META = {
  c:   { label: 'Consonants',    short: 'Con',   color: '#3b82f6', bg: '#dbeafe', order: 1 },
  sv:  { label: 'Short Vowels',  short: 'Short', color: '#ef4444', bg: '#fee2e2', order: 2 },
  lv:  { label: 'Long Vowels',   short: 'Long',  color: '#22c55e', bg: '#dcfce7', order: 3 },
  d:   { label: 'Digraphs',      short: 'Digrph',color: '#a855f7', bg: '#f3e8ff', order: 4 },
  bl:  { label: 'Blends',        short: 'Blend', color: '#f97316', bg: '#ffedd5', order: 5 },
  rc:  { label: 'R-Controlled',  short: 'R-Ctrl',color: '#ec4899', bg: '#fce7f3', order: 6 },
  dp:  { label: 'Diphthongs',    short: 'Dipth', color: '#0d9488', bg: '#ccfbf1', order: 7 },
  se:  { label: 'Silent-E',      short: 'Sil-E', color: '#94a3b8', bg: '#f1f5f9', order: 8 },
  sfx: { label: 'Suffixes',      short: 'Suffix',color: '#d97706', bg: '#fef3c7', order: 9 },
};

// ── Build card data from word bank ────────────────────────────────────────

function buildCardMap() {
  /** @type {Map<string, { grapheme:string, type:string, examples:Array<{word:string,emoji:string}> }>} */
  const map = new Map();

  for (const word of WORDS) {
    for (let i = 0; i < word.graphemes.length; i++) {
      const g = word.graphemes[i];
      const t = word.types[i];
      const key = `${g}::${t}`;

      if (!map.has(key)) {
        map.set(key, { grapheme: g, type: t, examples: [] });
      }
      const card = map.get(key);
      if (card.examples.length < 3) {
        card.examples.push({ word: word.word, emoji: word.emoji });
      }
    }
  }

  return [...map.values()].sort((a, b) => {
    const oa = TYPE_META[a.type]?.order ?? 99;
    const ob = TYPE_META[b.type]?.order ?? 99;
    if (oa !== ob) return oa - ob;
    return a.grapheme.localeCompare(b.grapheme);
  });
}

// ── Module state ──────────────────────────────────────────────────────────

let _container  = null;
let _onGoHome   = null;
let _activeType = 'all';
let _playingKey = null;

const ALL_CARDS = buildCardMap();

// ── Public API ────────────────────────────────────────────────────────────

/**
 * @param {HTMLElement} container
 * @param {Function}    onGoHome
 */
export function initLetterSounds(container, onGoHome) {
  _container  = container;
  _onGoHome   = onGoHome;
  _activeType = 'all';
  _render();
}

export function cleanupLetterSounds() {
  _container = null;
  _onGoHome  = null;
  _activeType = 'all';
}

// ── Render ────────────────────────────────────────────────────────────────

function _render() {
  const types = ['all', ...Object.keys(TYPE_META)];

  const tabsHtml = types.map(t => {
    const meta = t === 'all'
      ? { label: 'All Sounds', color: '#6c63ff' }
      : TYPE_META[t];
    if (!meta) return '';
    const active = t === _activeType ? ' active' : '';
    return `<button class="ls-tab${active}" data-type="${t}" style="--tab-color:${meta.color}">${meta.label}</button>`;
  }).join('');

  const cards = _activeType === 'all'
    ? ALL_CARDS
    : ALL_CARDS.filter(c => c.type === _activeType);

  const cardsHtml = cards.map(card => {
    const meta = TYPE_META[card.type] || { color: '#6c63ff', bg: '#e0e7ff', label: '' };
    const ex   = card.examples[0];
    const key  = `${card.grapheme}::${card.type}`;

    return /* html */`
      <button
        class="ls-card"
        data-grapheme="${card.grapheme}"
        data-type="${card.type}"
        data-key="${key}"
        style="--card-color:${meta.color};--card-bg:${meta.bg}"
        aria-label="Hear the sound for ${card.grapheme}"
      >
        <span class="ls-grapheme">${card.grapheme}</span>
        ${ex ? `
          <span class="ls-ex-emoji" aria-hidden="true">${ex.emoji}</span>
          <span class="ls-ex-word">${ex.word}</span>
        ` : ''}
        <span class="ls-type-tag">${meta.short ?? meta.label}</span>
      </button>
    `;
  }).join('');

  // Count per type for the tab badge
  const tabCountHtml = types.map(t => {
    if (t === 'all') return '';
    const count = ALL_CARDS.filter(c => c.type === t).length;
    return `<span data-count-type="${t}">${count}</span>`;
  }).join('');

  _container.innerHTML = /* html */`
    <div class="ls-browser">
      <div class="ls-intro">
        <p class="ls-intro-text">
          Tap any card to hear the sound. Each card shows an example word.
        </p>
      </div>
      <div class="ls-tabs" role="tablist" aria-label="Sound types">
        ${tabsHtml}
      </div>
      <div class="ls-count" aria-live="polite">
        ${cards.length} sound${cards.length !== 1 ? 's' : ''}
      </div>
      <div class="ls-grid" role="list">
        ${cardsHtml}
      </div>
    </div>
  `;

  _container.querySelectorAll('.ls-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeType = btn.dataset.type;
      _render();
    });
  });

  _container.querySelectorAll('.ls-card').forEach(btn => {
    btn.addEventListener('click', () => _handleCardClick(btn));
  });
}

// ── Playback ──────────────────────────────────────────────────────────────

async function _handleCardClick(btn) {
  const key = btn.dataset.key;
  if (_playingKey === key) return; // debounce

  _playingKey = key;
  btn.classList.add('ls-playing');

  // Brief bounce animation
  btn.style.transform = 'scale(0.93)';
  setTimeout(() => (btn.style.transform = ''), 120);

  await audio.speakPhoneme(btn.dataset.grapheme, btn.dataset.type);

  btn.classList.remove('ls-playing');
  _playingKey = null;
}
