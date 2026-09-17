/**
 * Listen and Spell Mode  (Encoding — spoken word → phonemes → graphemes)
 *
 * The reverse of every blending mode in the app. Blending goes print → sound
 * → word; spelling goes word → sound → print, and the two are not the same
 * skill. A child who reads `cake` fluently and writes `cak` has not mastered
 * the split digraph — reading lets you recognise a spelling, writing makes
 * you produce it. Until this mode existed, PhonicsQuest measured only the
 * easier half: `listenAndSpell` was registered but pointed at `classicBlend`,
 * a reading UI, and `progression.js` criterion 2 (spelling accuracy ≥ 80%)
 * had no source of data, so it passed every child as `no-data`.
 *
 * ── The loop ─────────────────────────────────────────────────────────────
 *
 *   1. LISTEN   The word is spoken. It is never printed, and the phoneme row
 *               stays empty — printing it would turn spelling into copying.
 *   2. COUNT    "How many sounds?" The segmenting step comes first because
 *               that is the order the skill is actually performed in: you
 *               cannot spell a sound you have not separated out. A wrong
 *               count is corrected and the child continues — the count is a
 *               scaffold, not a gate.
 *   3. BUILD    A controlled grapheme bank, tapped into a build strip. Tiles
 *               are reusable, so the bank size never leaks the word length
 *               and double letters (`pop`) are spellable.
 *   4. CHECK    The canonical scorer diagnoses the slip, the child gets one
 *               correction, and the second check reveals.
 *
 * ── Why the bank holds plausible alternatives ────────────────────────────
 *
 * The distractors are the other real spellings of the word's own sounds —
 * `ai` and `ay` alongside the `a…e` in cake, `ir` and `ur` alongside `er`.
 * A bank of impossible letters would be a sorting puzzle solvable by
 * elimination; a bank of genuine alternatives forces the orthographic choice
 * that spelling actually consists of. It also makes the interesting error
 * reachable: `caik` is scored `plausible-spelling`, not lumped in with
 * `cadk`, because the child segmented correctly and chose the wrong spelling.
 *
 * ── Evidence level ───────────────────────────────────────────────────────
 *
 * `independent` (see modules/evidence.js). Hear & Choose is capped at
 * `guided` because the answer is on screen among the options and a correct
 * tap only proves matching. Nothing here shows the child the spelling: the
 * bank offers graphemes, and the child has to select AND order them. That is
 * production, so a clean first attempt is evidence of encoding. Hints and
 * second tries are downgraded by the shell in the usual way.
 *
 * ── Tiles, and the words where sounds outnumber them ─────────────────────
 *
 * Blends are expanded — `st` is two letters making two sounds, and you spell
 * it one sound at a time — while a silent e stays its own tile, because
 * letters exceeding sounds is exactly what a split digraph is and naming
 * that is the lesson.
 *
 * Tiles and sounds are not always one to one, and `soundsPerTile` keeps the
 * per-tile counts rather than flattening them, so the cases where they part
 * company can be taught instead of dodged: a silent e makes no sound, `x`
 * makes two in one letter, `-ing` makes two as one spelling unit. The child
 * is told the true sound count and then told that one part of the word
 * carries two of them — without being told WHICH part, which would spell a
 * piece of the word for them.
 *
 * Where the per-grapheme table and `derivePhonemes` genuinely disagree (the
 * `-ed` suffix shifts with the sound before it), the counting step is
 * dropped rather than guessed at — about 2% of the bank. Those words are NOT
 * swapped for neater ones: the shell records every attempt against the word
 * IT chose, so handing back a substitute would file the result under a word
 * the child never saw.
 */

import { renderWordImage } from '../components/phonemeDisplay.js';
import { celebrateCorrect } from '../components/confettiHelper.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { progress } from '../modules/progress.js';
import { WORDS, derivePhonemes, phonemeNotation, shuffleArray } from '../data/words.js';
import { html } from '../utils/html.js';
import { scoreListenAndSpell, alternativeSpellings } from './scoring/listenAndSpell.js';

/** Most tiles a bank may hold. Beyond this a young child is scanning, not spelling. */
const MAX_BANK = 9;
/** Fewest. Under this the answer is most of the bank and ordering is all that's left. */
const MIN_BANK = 6;
/** Extra plausible alternatives to mix in beyond the word's own tiles. */
const TARGET_DISTRACTORS = 4;

let _word = null;
let _els = null;
/** @type {{g: string, type: string, label: string}[]} – the correct tiles, in order */
let _targetTiles = [];
/** @type {{g: string, type: string, label: string}[]} – the bank, shuffled */
let _bank = [];
/** @type {{g: string, label: string}[]} – tiles the child has placed, in order */
let _placed = [];
/** @type {'count'|'build'|'done'} */
let _stage = 'count';
let _soundCount = 0;
/** @type {number[]|null} – sounds each tile makes; null = can't ask the count */
let _tileSounds = null;
/** Whether the mode can honestly ask "how many sounds?" for this word. */
let _askCount = true;
let _startTime = 0;
let _firstTryCorrect = null;
let _checks = 0;
let _timeouts = [];

// ── Word shaping ──────────────────────────────────────────────────────────

/**
 * The spelling tiles for a word: its graphemes, with blends split into single
 * letters (each letter of `st` is its own sound, and is spelled as its own
 * sound) and everything else left as the one unit it is taught as.
 *
 * `g` is the letters the tile contributes and `label` is how it is printed.
 * They differ for affixes, which words.js stores with their teaching hyphen
 * (`-ing`): a child spelling `sitting` needs the tile to add `ing`, while the
 * tile should still READ `-ing`, which is how the suffix is taught. Joining
 * the labels instead would build `sitt-ing` and mark every morphology word
 * wrong no matter what the child did.
 *
 * @param {import('../data/words.js').Word} word
 * @returns {{g: string, type: string, label: string}[]}
 */
export function spellingTilesFor(word) {
  const graphemes = Array.isArray(word?.graphemes) ? word.graphemes : [];
  const types = Array.isArray(word?.types) ? word.types : [];
  /** @type {{g: string, type: string, label: string}[]} */
  const tiles = [];
  for (let i = 0; i < graphemes.length; i++) {
    const label = String(graphemes[i]).toLowerCase();
    const g = label.replace(/^-+|-+$/g, '');
    const type = types[i] ?? 'c';
    if (type === 'bl' && g.length > 1) {
      for (const letter of g) tiles.push({ g: letter, type: 'c', label: letter });
    } else {
      tiles.push({ g, type, label });
    }
  }
  return tiles;
}

/**
 * How many sounds each tile makes — or `null` when that cannot be told
 * honestly.
 *
 * The counting step asks "how many sounds do you hear?", so the mode has to
 * know how the answer maps onto the tiles the child is about to place. It is
 * usually one each, but not always:
 *
 *   - a silent e makes none (`cake` → [1, 1, 1, 0])
 *   - `x` makes two in one letter (`fox` → [1, 1, 2])
 *   - `-ing` makes two as one spelling unit (`jumping` → [1, 1, 1, 1, 2])
 *
 * Those last two are worth teaching rather than hiding, which is why the
 * counts are returned per tile instead of being flattened to a yes/no: the
 * mode can ask the true sound count and tell the child that one part of the
 * word carries two of them.
 *
 * The per-grapheme table and `derivePhonemes` can still disagree — `-ed`
 * shifts with the sound before it (`jumped` /t/ vs `landed` /ɪd/), and
 * `derivePhonemes` adjusts for that where a standalone grapheme lookup
 * cannot. When the two don't reconcile this returns null and the mode drops
 * the counting step rather than teach a number it isn't sure of. That is
 * about 2% of the bank.
 *
 * Words it returns null for are still perfectly spellable, and are NOT
 * swapped out: the shell records every attempt against the word IT chose, so
 * handing back a different word would file the result under the wrong id.
 *
 * @param {import('../data/words.js').Word} word
 * @returns {number[]|null}
 */
export function soundsPerTile(word) {
  const tiles = spellingTilesFor(word);
  if (!tiles.length) return null;
  const counts = tiles.map((t) => phonemeNotation(t.g, t.type).length);
  const total = counts.reduce((sum, n) => sum + n, 0);
  return total === derivePhonemes(word).length ? counts : null;
}

/**
 * Build the grapheme bank: the word's own tiles plus real alternative
 * spellings of the word's own sounds.
 *
 * Tiles keep a type so tapping one can play the sound it makes — an
 * alternative inherits the type of the tile whose sound it spells, which is
 * what makes `ai` play /ā/ rather than /a/+/i/.
 *
 * @param {{g: string, type: string, label: string}[]} tiles
 * @returns {{g: string, type: string, label: string}[]}
 */
function _buildBank(tiles) {
  /** @type {Map<string, {type: string, label: string}>} letters → tile (first wins) */
  const own = new Map();
  for (const t of tiles) if (!own.has(t.g)) own.set(t.g, { type: t.type, label: t.label });

  // The vowel of a split digraph is asked about as the folded unit (`a_e`),
  // so the bank offers `ai`/`ay` — the choice the child genuinely has.
  /** @type {Map<string, string>} */
  const alts = new Map();
  for (let i = 0; i < tiles.length; i++) {
    const { g, type } = tiles[i];
    const isSplitVowel = g.length === 1 && tiles[i + 2]?.type === 'se';
    for (const alt of alternativeSpellings(isSplitVowel ? `${g}_e` : g, type)) {
      if (own.has(alt) || alts.has(alt) || alt.includes('_')) continue;
      alts.set(alt, isSplitVowel ? 'lv' : type);
    }
  }

  const extras = shuffleArray([...alts.keys()]).slice(0, TARGET_DISTRACTORS);
  const bank = [
    ...[...own.entries()].map(([g, { type, label }]) => ({ g, type, label })),
    ...extras.map((g) => ({ g, type: alts.get(g), label: g })),
  ];

  // Some words have almost no alternative spellings (`yam` — /y/ and /a/ each
  // have one), which would leave a bank that is nearly all answer. Top it up
  // from words in the same stage: graphemes the child is learning to tell
  // apart anyway, so the choice stays a real one.
  if (bank.length < MIN_BANK) {
    const taken = new Set(bank.map((t) => t.g));
    for (const t of shuffleArray(_siblingGraphemes())) {
      if (bank.length >= MIN_BANK) break;
      if (taken.has(t.g)) continue;
      taken.add(t.g);
      bank.push(t);
    }
  }

  return shuffleArray(bank.slice(0, MAX_BANK));
}

/** Graphemes from other words in the current stage, for topping up a bank. */
function _siblingGraphemes() {
  const maxLevel = store.get('difficulty') || 1;
  const group = store.get('currentGroup') || _word?.group;
  const siblings = group ? progress.getWordsInGroup(group, maxLevel) : [];
  const pool = siblings.length ? siblings : WORDS.filter((w) => w.level <= maxLevel);
  return pool
    .slice(0, 40)
    .flatMap(spellingTilesFor)
    .filter((t) => t.type !== 'se');
}

/** Sound-count options: the true count flanked by its neighbours. */
function _countOptions(n) {
  const opts = new Set([n]);
  if (n > 1) opts.add(n - 1);
  opts.add(n + 1);
  if (opts.size < 3 && n > 2) opts.add(n - 2);
  return [...opts].sort((a, b) => a - b);
}

// ── Setup ─────────────────────────────────────────────────────────────────

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupListenAndSpell(word, els) {
  _els = els;
  _placed = [];
  _checks = 0;
  _firstTryCorrect = null;
  _timeouts = [];
  _startTime = Date.now();

  // The shell's word, always — never a substitute. `_handleResult` records
  // against the word the SHELL picked, so swapping here would file the
  // attempt under a word the child never saw.
  _word = word;
  _targetTiles = spellingTilesFor(_word);
  _soundCount = derivePhonemes(_word).length || _targetTiles.length;
  _bank = _buildBank(_targetTiles);
  _tileSounds = soundsPerTile(_word);
  _askCount = _tileSounds !== null;
  _stage = _askCount ? 'count' : 'build';

  // The picture stays (it names the word, never its spelling). The print and
  // the phoneme tiles must not — they ARE the answer.
  renderWordImage(_word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';
  // `.word-display` reserves 80px for letter tiles even when empty. This mode
  // never fills it, and that dead band pushed the letter bank below the fold
  // on a phone — a child should not have to scroll to reach the letters.
  els.wordDisplay.style.display = 'none';
  els.modeInstruction.textContent = _askCount
    ? 'Listen to the word. How many sounds do you hear?'
    : 'Listen to the word. Build it letter by letter.';

  // The shell's Check acts on the blend UI, and its Hint reveals the letters —
  // both wrong here. The mic scores a spoken reading of a printed word, and
  // there is no printed word; it also floats over the letter bank. Say-It is
  // the point of the mode, so it stays.
  if (els.btnCheck) els.btnCheck.style.display = 'none';
  if (els.btnHint) els.btnHint.style.display = 'none';
  if (els.btnMic) els.btnMic.style.display = 'none';
  if (els.btnSayIt) els.btnSayIt.style.display = '';
  if (els.btnSkip) els.btnSkip.style.display = '';

  els.modeArea.innerHTML = /* html */ `
    <div class="las-round">
      <button type="button" class="btn btn--secondary las-replay" id="las-replay">
        🔊 Hear it again
      </button>
      <div class="las-stage" id="las-stage"></div>
      <div class="las-feedback" id="las-feedback" role="status" aria-live="polite"></div>
    </div>
  `;

  document.getElementById('las-replay')?.addEventListener('click', () => _say());
  // Ask about the sound count only when the tiles and the sounds agree; for
  // `fox` and the morphology words they don't, so the question is skipped
  // rather than answered wrongly.
  if (_askCount) _renderCount();
  else _renderBuild();
  _timeouts.push(setTimeout(() => _say(), 400));
}

function _say() {
  if (!_word) return;
  audio.speakWord(_word.word).catch(() => {});
}

// ── Stage 1: how many sounds? ─────────────────────────────────────────────

function _renderCount() {
  const host = document.getElementById('las-stage');
  if (!host) return;
  host.innerHTML = /* html */ `
    <p class="las-prompt">How many sounds?</p>
    <div class="choice-grid choice-grid--count las-counts" id="las-counts"
         role="group" aria-label="How many sounds do you hear?"></div>
  `;
  const grid = document.getElementById('las-counts');
  for (const n of _countOptions(_soundCount)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn choice-btn--count las-count';
    btn.textContent = String(n);
    btn.dataset.count = String(n);
    btn.setAttribute('aria-label', `${n} sounds`);
    btn.addEventListener('click', () => _onCount(n, btn), { once: true });
    grid.appendChild(btn);
  }
}

function _onCount(n, btn) {
  if (_stage !== 'count') return;
  const right = n === _soundCount;
  const feedback = document.getElementById('las-feedback');

  document.querySelectorAll('.las-count').forEach((b) => {
    b.disabled = true;
    if (Number(b.dataset.count) === _soundCount) b.classList.add('las-count--target');
  });
  btn.classList.add(right ? 'las-count--yes' : 'las-count--no');
  audio.playSfx(right ? 'correct' : 'wrong').catch(() => {});

  if (feedback) {
    feedback.className = `las-feedback las-feedback--${right ? 'yes' : 'coach'}`;
    // The count is a scaffold, so a miss is corrected out loud and the child
    // carries on — being wrong here must not cost the spelling attempt.
    const opener = right
      ? `✓ Yes — ${_soundCount} sounds.`
      : `Let's count together: ${_soundCount} sounds.`;
    feedback.textContent = `${opener} ${_countBridge()}`;
  }

  // A word that needs the two-sounds-one-part explanation gets longer to
  // read it — it is the lesson, not a consolation line.
  const dwell = _multiSoundTile() ? 2200 : right ? 700 : 1400;
  _timeouts.push(setTimeout(() => _renderBuild(), dwell));
}

/** True when some tile makes more than one sound (`x`, `-ing`). */
function _multiSoundTile() {
  return Array.isArray(_tileSounds) && _tileSounds.some((n) => n > 1);
}

/**
 * The line between counting and spelling.
 *
 * When every sound gets its own tile this is just "now spell it". When one
 * tile carries two — `x` in `fox`, `-ing` in `jumping` — the child who
 * counted correctly is about to place FEWER tiles than sounds, and without
 * being told why, that reads as having been wrong. Saying it is the lesson:
 * one part of this word makes two sounds. The part is deliberately not
 * named, because naming it would spell a piece of the word.
 *
 * Pure so the copy can be tested against tile counts directly, rather than
 * by hunting for an x-word in a live round.
 *
 * @param {number[]|null} tileSounds  sounds each tile makes
 * @param {number} tileCount          how many tiles the child will place
 * @returns {string}
 */
export function countBridge(tileSounds, tileCount) {
  const multi = Array.isArray(tileSounds) && tileSounds.some((n) => n > 1);
  if (!multi) return 'Now spell it!';
  return `One part makes two sounds — so you'll tap ${tileCount}.`;
}

function _countBridge() {
  return countBridge(_tileSounds, _targetTiles.length);
}

// ── Stage 2: build the spelling ───────────────────────────────────────────

function _renderBuild() {
  const host = document.getElementById('las-stage');
  if (!host || !_els) return;
  _stage = 'build';

  const silentE = _targetTiles.some((t) => t.type === 'se');
  if (_els.modeInstruction) _els.modeInstruction.textContent = 'Tap the letters to spell the word.';

  // The sound count is only named for words whose tiles match it — quoting a
  // count the child cannot place would undo the counting step's whole point.
  const counts = _askCount
    ? ` — ${_soundCount} sounds${silentE ? ', and a silent e at the end' : ''}`
    : '';

  host.innerHTML = html`
    <p class="las-prompt">Spell the word${counts}.</p>
    <div class="las-strip" id="las-strip" role="group" aria-label="Your spelling"></div>
    <div class="las-controls">
      <button type="button" class="btn btn--ghost las-undo" id="las-undo"
              aria-label="Remove the last letter">⌫ Undo</button>
      <button type="button" class="btn btn--primary las-check" id="las-check"
              aria-label="Check my spelling">Check ✓</button>
    </div>
    <div class="las-bank choice-grid" id="las-bank" role="group" aria-label="Letters to choose from"></div>
  `;

  const bank = document.getElementById('las-bank');
  for (const { g, type, label } of _bank) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn las-tile';
    // Printed as it is taught (`-ing`), spelled as it is written (`ing`).
    btn.textContent = label;
    btn.dataset.grapheme = g;
    btn.setAttribute('aria-label', `Add ${g.split('').join(' ')}`);
    btn.addEventListener('click', () => _place(g, type, label));
    bank.appendChild(btn);
  }

  document.getElementById('las-undo')?.addEventListener('click', () => _undo());
  document.getElementById('las-check')?.addEventListener('click', () => _check());
  _renderStrip();
}

function _renderStrip() {
  const strip = document.getElementById('las-strip');
  if (!strip) return;
  strip.innerHTML = '';

  if (_placed.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'las-strip-empty';
    empty.textContent = 'Tap a letter to start';
    strip.appendChild(empty);
  } else {
    _placed.forEach(({ g, label }, i) => {
      const cell = document.createElement('span');
      cell.className = 'las-cell';
      cell.textContent = label;
      cell.setAttribute('aria-label', `Sound ${i + 1}: ${g.split('').join(' ')}`);
      strip.appendChild(cell);
    });
  }

  strip.setAttribute(
    'aria-label',
    _placed.length
      ? `Your spelling: ${_placed.map((p) => p.label).join(' ')}`
      : 'Your spelling is empty',
  );
  const check = document.getElementById('las-check');
  if (check) check.disabled = _placed.length === 0;
  const undo = document.getElementById('las-undo');
  if (undo) undo.disabled = _placed.length === 0;
}

function _place(grapheme, type, label) {
  if (_stage !== 'build') return;
  // Generous, but bounded: a runaway strip is a stuck child, not an answer.
  if (_placed.length >= _targetTiles.length + 3) return;
  _placed.push({ g: grapheme, label });
  // Play the SOUND the tile makes, not its letter name — the whole mode is
  // about mapping one to the other.
  audio.speakPhoneme(grapheme, type, { word: _word.word }).catch(() => {});
  _renderStrip();
}

function _undo() {
  if (_stage !== 'build' || !_placed.length) return;
  _placed.pop();
  _renderStrip();
}

// ── Stage 3: check ────────────────────────────────────────────────────────

function _check() {
  if (_stage !== 'build' || !_placed.length) return;
  _checks++;

  const result = scoreListenAndSpell({
    target: _word.word,
    written: _placed.map((p) => p.g).join(''),
    timeMs: Date.now() - _startTime,
    targetGraphemes: _targetTiles.map((t) => t.g),
    targetTypes: _targetTiles.map((t) => t.type),
    writtenGraphemes: _placed.map((p) => p.g),
  });

  if (_firstTryCorrect === null) _firstTryCorrect = result.correct;

  const feedback = document.getElementById('las-feedback');
  audio.playSfx(result.correct ? 'correct' : 'wrong').catch(() => {});

  if (result.correct) {
    celebrateCorrect();
    if (feedback) {
      feedback.className = 'las-feedback las-feedback--yes';
      feedback.textContent = `✓ ${_word.word} — that's it!`;
    }
    return _finish(result);
  }

  // One correction, then reveal — the shell's two-try contract, with the
  // child's letters left in place so the fix is an edit, not a restart.
  if (_checks === 1) {
    if (feedback) {
      feedback.className = 'las-feedback las-feedback--coach';
      feedback.textContent = `💡 ${result.hint}`;
    }
    _timeouts.push(setTimeout(() => _say(), 400));
    return;
  }

  if (feedback) {
    feedback.className = 'las-feedback las-feedback--reveal';
    feedback.innerHTML = html`
      <span class="las-reveal-label">It is spelled</span>
      <span class="las-reveal-word">${_word.word}</span>
      <span class="las-reveal-hint">${result.hint}</span>
    `;
  }
  _finish(result);
}

function _finish(result) {
  _stage = 'done';
  document.querySelectorAll('.las-tile').forEach((b) => {
    b.disabled = true;
  });
  const check = document.getElementById('las-check');
  const undo = document.getElementById('las-undo');
  if (check) check.disabled = true;
  if (undo) undo.disabled = true;

  // Right sounds, wrong spelling is still a wrong spelling — it must not
  // reach mastery — but the child hears what they got right, because they
  // did the hard half.
  if (!result.correct && result.plausible) {
    const strip = document.getElementById('las-strip');
    strip?.classList.add('las-strip--plausible');
  }

  const area = _els?.modeArea;
  if (!area) return;
  const wrap = document.createElement('div');
  wrap.className = 'vmcq-next-wrap';
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'btn btn--primary vmcq-next-btn';
  next.textContent = 'Next →';
  next.setAttribute('aria-label', 'Next word');
  wrap.appendChild(next);
  area.querySelector('.las-round')?.appendChild(wrap);

  next.addEventListener(
    'click',
    () => _els?.onResult(_firstTryCorrect === true, Date.now() - _startTime),
    { once: true },
  );
  next.focus();
}

export function getCurrentWord() {
  return _word;
}

export function cleanup() {
  _timeouts.forEach((id) => clearTimeout(id));
  _timeouts = [];
  // Restore the shell buttons this mode hid — nothing else resets them.
  if (_els?.btnHint) _els.btnHint.style.display = '';
  if (_els?.btnMic) _els.btnMic.style.display = '';
  if (_els?.wordDisplay) _els.wordDisplay.style.display = '';
  _word = null;
  _els = null;
  _targetTiles = [];
  _bank = [];
  _placed = [];
  _stage = 'count';
  _askCount = true;
  _tileSounds = null;
  _soundCount = 0;
  _checks = 0;
  _firstTryCorrect = null;
}
