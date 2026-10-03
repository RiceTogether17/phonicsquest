/**
 * PhonicsQuest – Sentence Stars (sight words in sentences)
 *
 * The game version of the Giri "Sight Word Sentences" worksheets. On paper the
 * child decodes three sentences per sight word and colours a star for each.
 * Here they earn the star by proving they read the sentence: they pick the
 * one of three Giri pictures that matches it.
 *
 * Why a picture choice: the three sentences for a word differ only in their
 * decodable words ("Sam has a cat." / "Max has a rat." / "Dan has a mat."),
 * so the child cannot pick a picture without decoding those words. The sight
 * word itself is the same in all three, which is the point: they meet it
 * again and again in real sentences.
 *
 * Flow for one quest (5 sight words, 15 sentences):
 *   1. Star word – the sight word on its own, spoken aloud. Sight words are
 *      learned by heart, so the child hears it before reading it.
 *   2. Three sentence rounds – the sentence is shown with the sight word in
 *      bold and the short vowels of the decodable words in red, as on the
 *      worksheet. Sight words can be tapped to hear them at any time.
 *      Decodable words cannot at first: decoding them is the child's job.
 *      After a wrong pick, the word(s) that tell the pictures apart are
 *      highlighted and become tap-to-hear (slow, articulated) as support.
 *   3. After the right picture, the whole sentence is read aloud as a model,
 *      and a star is coloured in.
 *
 * Progress is saved under `sightSentencesCompleted`:
 *   { [questId]: { stars, firstTry, total } } — best first-try score kept.
 *
 * Public API:
 *   initSightSentences(container, handlers) – attach to DOM container.
 *     handlers = { onGoHome?, onBackToBrowser? }
 *   showSightSentences(quest)                – start a quest.
 *   cleanupSightSentences()                  – tear down state and speech.
 */

import { SIGHT_QUESTS } from '../data/sightwords.js';
import { getSentencesForWord, questHasSentences } from '../data/sightSentences.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';

const BASE = import.meta.env.BASE_URL;
const IMG_DIR = `${BASE}images/sight-sentences/`;

/** Every word taught in a sentence quest — read by heart, not decoded. */
const SIGHT_WORD_SET = new Set(
  SIGHT_QUESTS.filter(questHasSentences).flatMap((q) => q.words.map((w) => w.toLowerCase())),
);

/**
 * Single-vowel words whose vowel is not the short sound, so must not be
 * coloured as one ("put" is /ʊ/, not /ʌ/).
 */
const NOT_SHORT_VOWEL = new Set(['put']);

// ── Pure helpers (exported for tests) ──────────────────────────────────────

/** Strip punctuation and lowercase, for comparing words. */
export function bareWord(token) {
  return String(token)
    .replace(/[^A-Za-z']/g, '')
    .toLowerCase();
}

/**
 * Index of the short vowel to colour red in a decodable word, or -1.
 *
 * Mirrors the worksheet: closed-syllable words with exactly one vowel letter
 * (cat, hills, jumps) get it coloured. Words with more than one vowel letter
 * (lake, zoo, book), an open vowel (we), or a vowel teamed with r/w/y
 * (down, they) are left alone, since their vowel is not short.
 * @param {string} word  bare lowercase word
 */
export function shortVowelIndex(word) {
  if (!word || SIGHT_WORD_SET.has(word) || NOT_SHORT_VOWEL.has(word)) return -1;
  const vowels = [...word].flatMap((ch, i) => ('aeiou'.includes(ch) ? [i] : []));
  if (vowels.length !== 1) return -1;
  const next = word[vowels[0] + 1];
  if (next === undefined || 'rwy'.includes(next)) return -1;
  return vowels[0];
}

/**
 * The words in `text` that appear in none of `others` — what tells the
 * pictures apart, so what the child should look at again after a miss.
 * @param {string} text
 * @param {string[]} others
 * @returns {Set<string>} bare lowercase words
 */
export function distinguishingWords(text, others) {
  const seen = new Set(others.flatMap((o) => o.split(/\s+/).map(bareWord)));
  return new Set(
    text
      .split(/\s+/)
      .map(bareWord)
      .filter((w) => w && !seen.has(w)),
  );
}

/**
 * The rounds for a quest: a star-word intro, then its three sentences in a
 * random order, for each word in quest order.
 */
export function buildRounds(quest) {
  const rounds = [];
  for (const word of quest.words) {
    const sentences = getSentencesForWord(word);
    rounds.push({ type: 'intro', word });
    for (const s of _shuffle(sentences)) {
      rounds.push({
        type: 'read',
        word,
        sentence: s,
        choices: _shuffle(sentences),
        clue: distinguishingWords(
          s.text,
          sentences.filter((o) => o !== s).map((o) => o.text),
        ),
      });
    }
  }
  return rounds;
}

function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function _escape(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}

// ── Module state ───────────────────────────────────────────────────────────

let _container = null;
/** @type {{ onGoHome?: () => void, onBackToBrowser?: () => void }} */
let _handlers = {};

let _quest = null;
let _rounds = [];
let _roundIdx = 0;
/** One entry per sentence solved: true if solved on the first pick. */
let _stars = [];
let _misses = 0; // wrong picks in the current round
let _solved = false; // current round answered correctly

// ── Public API ─────────────────────────────────────────────────────────────

export function initSightSentences(container, handlers = {}) {
  _container = container;
  _handlers = handlers || {};
}

export function showSightSentences(quest) {
  if (!quest || !questHasSentences(quest)) return;
  _quest = quest;
  _rounds = buildRounds(quest);
  _roundIdx = 0;
  _stars = [];
  _renderRound();
}

export function cleanupSightSentences() {
  audio.cancelSpeech();
  if (_container) _container.innerHTML = '';
  _quest = null;
  _rounds = [];
  _roundIdx = 0;
  _stars = [];
}

// ── Rendering ──────────────────────────────────────────────────────────────

function _totalSentences() {
  return _rounds.filter((r) => r.type === 'read').length;
}

function _starTrackHtml() {
  const total = _totalSentences();
  let html = `<div class="sst-stars" id="sst-stars" role="img" aria-label="${_stars.length} of ${total} stars">`;
  for (let i = 0; i < total; i++) {
    const cls = i < _stars.length ? 'sst-star sst-star--on' : 'sst-star';
    html += `<span class="${cls}" aria-hidden="true">${i < _stars.length ? '★' : '☆'}</span>`;
  }
  return html + '</div>';
}

function _shellHtml(inner) {
  return `
    <div class="sst-game" id="sst-game">
      <div class="sst-header">
        <div class="sst-title">${_quest.icon} ${_escape(_quest.name)} · Sentence Stars</div>
        ${_starTrackHtml()}
      </div>
      ${inner}
      <div class="sst-actions">
        <button class="btn btn--ghost btn--sm" id="sst-btn-quests">← Quests</button>
        <button class="btn btn--ghost btn--sm" id="sst-btn-menu">Menu</button>
      </div>
    </div>`;
}

function _bindShell() {
  document.getElementById('sst-btn-quests')?.addEventListener('click', () => {
    cleanupSightSentences();
    _handlers.onBackToBrowser?.();
  });
  document.getElementById('sst-btn-menu')?.addEventListener('click', () => {
    cleanupSightSentences();
    _handlers.onGoHome?.();
  });
}

function _renderRound() {
  if (!_container || !_quest) return;
  const round = _rounds[_roundIdx];
  if (!round) {
    _onQuestComplete();
    return;
  }
  _misses = 0;
  _solved = false;
  if (round.type === 'intro') _renderIntro(round);
  else _renderRead(round);
}

function _renderIntro(round) {
  const n = getSentencesForWord(round.word).length;
  _container.innerHTML = _shellHtml(`
    <div class="sst-intro">
      <p class="sst-kicker">⭐ Star word</p>
      <button class="sst-intro-word" id="sst-intro-word" aria-label="Hear the word ${_escape(round.word)}">
        ${_escape(round.word)}
      </button>
      <p class="sst-intro-tip">Tap the word to hear it. Say it with me!<br>
        Now find <strong>${_escape(round.word)}</strong> in ${n} sentences.</p>
      <button class="btn btn--primary" id="sst-btn-go">Let's read! →</button>
    </div>`);
  _bindShell();

  const say = () => audio.speakSightWord(round.word);
  document.getElementById('sst-intro-word')?.addEventListener('click', say);
  document.getElementById('sst-btn-go')?.addEventListener('click', () => {
    _roundIdx++;
    _renderRound();
  });
  document.getElementById('sst-btn-go')?.focus({ preventScroll: true });
  say();
}

/** The sentence, word by word, with the worksheet's colouring. */
function _sentenceHtml(round) {
  const target = bareWord(round.word);
  return round.sentence.text
    .split(/\s+/)
    .map((token, i) => {
      const bare = bareWord(token);
      if (bare === target || SIGHT_WORD_SET.has(bare)) {
        const cls = `sst-word ${bare === target ? 'sst-word--target' : 'sst-word--sight'}${round.clue.has(bare) ? ' sst-word--clue' : ''}`;
        return `<button class="${cls}" data-say="sight" data-word="${_escape(bare)}"
                  aria-label="${_escape(bare)} – tap to hear">${_escape(token)}</button>`;
      }
      const v = shortVowelIndex(bare);
      // Map the bare-word vowel index back onto the token (which may start
      // with a capital and end with punctuation — both keep their position).
      const letters =
        v < 0
          ? _escape(token)
          : `${_escape(token.slice(0, v))}<span class="sst-vowel">${_escape(token[v])}</span>${_escape(token.slice(v + 1))}`;
      const isClue = round.clue.has(bare);
      return `<span class="sst-word sst-word--decode${isClue ? ' sst-word--clue' : ''}"
                data-idx="${i}" data-word="${_escape(bare)}">${letters}</span>`;
    })
    .join(' ');
}

function _renderRead(round) {
  const pictures = round.choices
    .map(
      (s, i) => `
      <button class="sst-pic" data-img="${_escape(s.img)}"
              aria-label="Picture ${i + 1}: ${_escape(s.text.replace(/[.?!]$/, ''))}">
        <img src="${IMG_DIR}${_escape(s.img)}" alt="" draggable="false" width="240" height="240">
      </button>`,
    )
    .join('');

  _container.innerHTML = _shellHtml(`
    <div class="sst-round">
      <p class="sst-prompt" id="sst-prompt">Read the sentence. Then tap the picture that matches!</p>
      <p class="sst-sentence" id="sst-sentence" aria-describedby="sst-prompt">${_sentenceHtml(round)}</p>
      <div class="sst-pics" role="group" aria-label="Pick the matching picture">${pictures}</div>
      <p class="sst-feedback" id="sst-feedback" role="status" aria-live="polite"></p>
      <div class="sst-next-row">
        <button class="btn btn--ghost btn--sm" id="sst-btn-hear" hidden>🔊 Hear it again</button>
        <button class="btn btn--primary" id="sst-btn-next" hidden>Next →</button>
      </div>
    </div>`);
  _bindShell();

  _container.querySelectorAll('.sst-word[data-say="sight"]').forEach((el) => {
    el.addEventListener('click', () => audio.speakSightWord(el.dataset.word));
  });
  // Decodable words only speak once help is on (after a miss, or once solved).
  _container.querySelectorAll('.sst-word--decode').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.classList.contains('sst-word--hearable')) audio.speakWordArticulated(el.dataset.word);
    });
  });
  _container.querySelectorAll('.sst-pic').forEach((btn) => {
    btn.addEventListener('click', () => _onPick(round, btn));
  });
  document.getElementById('sst-btn-hear')?.addEventListener('click', () => {
    audio.speakText(round.sentence.text);
  });
  document.getElementById('sst-btn-next')?.addEventListener('click', () => {
    _roundIdx++;
    _renderRound();
  });
}

/** Turn a decodable word into a tap-to-hear button (keyboard reachable). */
function _makeHearable(el) {
  if (el.classList.contains('sst-word--hearable')) return;
  el.classList.add('sst-word--hearable');
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', `${el.dataset.word} – tap to hear it slowly`);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });
}

/**
 * The clue words to name in feedback: the decodable ones if there are any
 * (those are what the child has to sound out), at most three — spelled as
 * they appear in the sentence, so names keep their capital ("Dan").
 */
function _clueList(round) {
  const words = round.sentence.text
    .split(/\s+/)
    .map((t) => t.replace(/[^A-Za-z']/g, ''))
    .filter((t) => round.clue.has(t.toLowerCase()));
  const decodable = words.filter((w) => !SIGHT_WORD_SET.has(w.toLowerCase()));
  return (decodable.length ? decodable : words)
    .slice(0, 3)
    .map((w) => `“${w}”`)
    .join(' and ');
}

function _onPick(round, btn) {
  if (_solved || btn.disabled) return;
  const feedback = document.getElementById('sst-feedback');

  if (btn.dataset.img !== round.sentence.img) {
    _misses++;
    btn.disabled = true;
    btn.classList.add('sst-pic--wrong');
    audio.playSfx('wrong');

    // Point the child at the word(s) that tell the pictures apart, and let
    // them hear those slowly — support for decoding, not a replacement.
    _container.querySelectorAll('.sst-word--clue').forEach((el) => {
      el.classList.add('sst-word--hint');
      if (el.classList.contains('sst-word--decode')) _makeHearable(el);
    });
    const clueWords = _clueList(round);
    if (feedback) {
      feedback.textContent = clueWords
        ? `Not quite! Look again at ${clueWords}. Sound it out, or tap it to hear it.`
        : 'Not quite! Read the sentence again and try another picture.';
    }
    return;
  }

  _solved = true;
  const firstTry = _misses === 0;
  _stars.push(firstTry);
  btn.classList.add('sst-pic--correct');
  _container.querySelectorAll('.sst-pic').forEach((b) => {
    b.disabled = true;
    if (b !== btn) b.classList.add('sst-pic--faded');
  });
  document.getElementById('sst-sentence')?.classList.add('sst-sentence--done');
  _container.querySelectorAll('.sst-word--decode').forEach(_makeHearable);
  audio.playSfx('correct');

  // Refresh the star track in place, with the new star popping in.
  const track = document.getElementById('sst-stars');
  if (track) {
    track.outerHTML = _starTrackHtml();
    const lit = document.querySelectorAll('#sst-stars .sst-star--on');
    lit[lit.length - 1]?.classList.add('sst-star--new');
  }

  if (feedback) {
    feedback.textContent = firstTry
      ? '⭐ You read it! Listen, then read it with me.'
      : '⭐ You got it! Listen, then read it with me.';
  }
  // Model fluent reading of the whole sentence once it has been decoded.
  audio.speakText(round.sentence.text);

  const hear = document.getElementById('sst-btn-hear');
  const next = document.getElementById('sst-btn-next');
  hear?.removeAttribute('hidden');
  if (next) {
    next.removeAttribute('hidden');
    next.textContent = _roundIdx === _rounds.length - 1 ? 'Finish ⭐' : 'Next →';
    // Keep the sentence and pictures in view; just move keyboard focus.
    next.focus({ preventScroll: true });
  }
}

// ── Completion ─────────────────────────────────────────────────────────────

function _nextSentenceQuest() {
  const idx = SIGHT_QUESTS.findIndex((q) => q.id === _quest.id);
  return SIGHT_QUESTS.slice(idx + 1).find(questHasSentences) || null;
}

function _onQuestComplete() {
  const total = _stars.length;
  const firstTry = _stars.filter(Boolean).length;

  const saved = store.get('sightSentencesCompleted') || {};
  const prev = saved[_quest.id];
  saved[_quest.id] = {
    stars: total,
    firstTry: Math.max(firstTry, prev?.firstTry ?? 0),
    total,
  };
  store.set('sightSentencesCompleted', saved);

  const quest = _quest;
  const next = _nextSentenceQuest();
  const message =
    firstTry === total
      ? 'Every sentence on the first try — super reading!'
      : `${firstTry} of ${total} on the first try. Keep reading to get them all!`;

  _container.innerHTML = _shellHtml(`
    <div class="sst-complete" role="status">
      <div class="sm-complete-emoji" aria-hidden="true">🌟</div>
      <h3 class="sm-complete-title">You read ${total} sentences!</h3>
      <p class="sm-complete-sub">${message}</p>
      <div class="sm-complete-words">
        ${quest.words.map((w) => `<span class="sm-word-chip">${_escape(w)}</span>`).join('')}
      </div>
      <div class="sm-complete-actions">
        ${next ? `<button class="btn btn--primary" id="sst-btn-next-quest">Next: ${_escape(next.name)} →</button>` : ''}
        <button class="btn btn--ghost btn--sm" id="sst-btn-replay">Read again</button>
      </div>
    </div>`);
  _bindShell();
  audio.playSfx('levelUp');

  document
    .getElementById('sst-btn-next-quest')
    ?.addEventListener('click', () => showSightSentences(next));
  document
    .getElementById('sst-btn-replay')
    ?.addEventListener('click', () => showSightSentences(quest));
  (
    document.getElementById('sst-btn-next-quest') || document.getElementById('sst-btn-replay')
  )?.focus();
}
