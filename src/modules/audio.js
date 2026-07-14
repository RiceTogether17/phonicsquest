/**
 * PhonicsQuest – Audio Manager
 *
 * Priority order for phoneme sounds:
 *   1. Cached Web Audio API buffer (best quality, offline)
 *   2. HTML Audio element (MP3 from /public/audio/phonemes/)
 *   3. Web Speech API TTS (fallback, always works)
 *
 * For full word pronunciation: TTS is preferred (more natural prosody).
 */

import { store } from './store.js';

/** Dev-mode logging helper */
const devWarn = (...args) => {
  if (import.meta.env.DEV) console.warn('[Audio]', ...args);
};

/** Base path for phoneme MP3 files */
const BASE = import.meta.env.BASE_URL;
const PHONEME_PATH = `${BASE}audio/phonemes/`;
const SFX_PATH     = `${BASE}audio/sfx/`;

/** Phoneme to MP3 filename mapping */
const PHONEME_FILES = {
  // Consonants
  b: 'b', c: 'c', d: 'd', f: 'f', g: 'g', h: 'h', j: 'j', k: 'k',
  l: 'l', m: 'm', n: 'n', p: 'p', r: 'r', s: 's', t: 't', v: 'v',
  w: 'w', x: 'x', y: 'y', z: 'z',
  // Digraphs — wh/ck/ll/se alias to their base consonant sound
  sh: 'sh', ch: 'ch', th: 'th', ng: 'ng',
  wh: 'w',   // "wh" makes the /w/ sound
  ck: 'c',   // "ck" makes the /k/ sound
  ll: 'l',   // "ll" makes the /l/ sound
  ss: 's',   // "ss" makes the /s/ sound
  tt: 't',   // "tt" makes the /t/ sound (doubled consonant)
  nn: 'n',   // "nn" makes the /n/ sound (doubled consonant)
  gg: 'g',   // "gg" makes the /g/ sound (doubled consonant)
  ff: 'f',   // "ff" makes the /f/ sound (doubled consonant)
  dd: 'd',   // "dd" makes the /d/ sound (doubled consonant)
  zz: 'z',   // "zz" makes the /z/ sound (doubled consonant)
  bb: 'b',   // "bb" makes the /b/ sound (doubled consonant)
  pp: 'p',   // "pp" makes the /p/ sound (doubled consonant)
  mm: 'm',   // "mm" makes the /m/ sound (doubled consonant)
  rr: 'r',   // "rr" makes the /r/ sound (doubled consonant)
  se: 's',   // "se" makes the /s/ sound
  // R-controlled vowels
  ar: 'ar', or: 'or', er: 'er',
  ir: 'er',  // ir = same /ɜr/ sound as er
  ur: 'er',  // ur = same /ɜr/ sound as er
  // R-controlled trigraphs
  air: 'air',
  ear: 'ear',
  are: 'air', // 'are' = same /ɛr/ sound as 'air'
  // Short vowels
  a: 'a', e: 'e', i: 'i', o: 'o', u: 'u',
  // Long vowels (canonical keys)
  long_a: 'long_a', long_e: 'long_e', long_i: 'long_i',
  long_o: 'long_o', long_u: 'long_u',
  // Long-vowel spelling aliases — vowel teams map to their base long-vowel audio
  long_ai: 'long_a',  // ai  → long A sound
  long_ay: 'long_a',  // ay  → long A sound
  long_ea: 'long_e',  // ea  → long E sound
  long_ee: 'long_e',  // ee  → long E sound
  long_oa: 'long_o',  // oa  → long O sound
  long_ow: 'long_o',  // ow (long-O words: blow, snow…) → long O sound
  long_oe: 'long_o',  // oe (toe, goes) → long O sound
  long_y:  'long_i',  // final y as long i (cry, fly, sky) → long I sound
  long_ie: 'long_i',  // ie (pie, tie)                    → long I sound
  long_igh:'long_i',  // igh (night, light, high)         → long I sound
  // /uː/ and /ʊ/ have their own recordings (long_u.mp3 says /juː/ "you",
  // which is only right for the u_e split digraph: cube, cute):
  long_oo:  'long_oo',   // oo /uː/ — moon, food, zoo
  long_ue:  'long_oo',   // ue vowel team says /uː/ — blue, true, glue
  long_ew:  'long_oo',   // ew vowel team says /uː/ — flew, grew, chew
  short_oo: 'short_oo',  // oo /ʊ/ — book, look, good (and u in bush, full, pull)
  // Diphthongs  (oi covers oi+oy, ow covers ow+ou, aw covers aw+au)
  oi: 'oi', ow: 'ow', aw: 'aw',
  // Soft consonants (used only when explicitly tagged in word data)
  soft_g: 'soft_g', soft_c: 'soft_c',
  // Schwa (used in affix phoneme sequences)
  'ə': 'u',  // schwa maps to short-u audio as closest match
};

/**
 * Pronunciation map for PREFIX tiles (type 'p' on the word entry).
 *
 * Without this, a 'un' grapheme would fall through to `_playPhonemeAudio('un')`,
 * which lacks a PHONEME_FILES entry and would speak the literal text "un"
 * via TTS. Splitting each prefix into its real phoneme sequence makes the
 * Blend It / per-phoneme reveal mode sound correct.
 */
const PREFIX_PRONUNCIATION = {
  un:  ['u', 'n'],
  re:  ['r', 'long_e'],
  pre: ['p', 'r', 'long_e'],
  dis: ['d', 'i', 's'],
  mis: ['m', 'i', 's'],
  in:  ['i', 'n'],
  im:  ['i', 'm'],
};

/**
 * Explicit pronunciation map for affix / suffix chunks.
 *
 * Consonant+le endings, reduced-vowel suffixes, and other affixes where
 * raw text-to-speech guesses wrong (letter-name spelling or wrong vowel).
 * Each value is an array of phoneme keys to play in sequence.
 * The special key 'ə' represents the schwa sound.
 */
const AFFIX_PRONUNCIATION = {
  // Consonant + le endings → consonant, /l/, /ə/
  ble: ['b', 'l', 'ə'],
  cle: ['c', 'l', 'ə'],
  dle: ['d', 'l', 'ə'],
  fle: ['f', 'l', 'ə'],
  gle: ['g', 'l', 'ə'],
  kle: ['k', 'l', 'ə'],
  ple: ['p', 'l', 'ə'],
  tle: ['t', 'l', 'ə'],
  zle: ['z', 'l', 'ə'],
  // Bare -le suffix (e.g. "unable" → ['un','a','b','le'])
  le:  ['l', 'ə'],
  // Schwa-reduced endings
  al: ['ə', 'l'],
  el: ['ə', 'l'],
};

/**
 * Sight-word pronunciation overrides.
 *
 * Sight words whose default browser-TTS pronunciation differs from how the
 * word is actually read in connected speech.  Each entry is either a
 * phoneme key (preferred, plays the cached MP3 — consistent across voices)
 * or a TTS-text override (used when no single phoneme captures the word).
 *
 * The classic offender is the article "a", which TTS reads as the letter
 * NAME /eɪ/ ("ay") rather than the schwa /ə/ ("uh") that occurs in real
 * sentences.  Keep additions narrow — most sight words speak correctly
 * with raw TTS and adding too many overrides would obscure regressions.
 */
const SIGHT_WORD_PRONUNCIATIONS = {
  a:   { phoneme: 'u' },   // schwa → use the short-u MP3 (closest cached match)
};

/**
 * TTS text overrides for affixes that should be spoken as a unit
 * but where raw text produces the wrong pronunciation.
 */
const AFFIX_TTS_OVERRIDES = {
  tion: 'shun',
  sion: 'zhun',
  ous:  'uss',
  ious: 'ee-uss',
  ture: 'chur',
};

/**
 * Phonetic text for TTS fallback.
 * TTS says letter NAMES for single letters (e.g. "bee" for 'b').
 * This map gives phonetic spellings that TTS will pronounce as the sound.
 */
const PHONEME_TTS = {
  // Consonants – voiced/unvoiced pairs with a schwa where needed
  b: 'buh',  c: 'kuh',  d: 'duh',  f: 'fff',  g: 'guh',  h: 'huh',
  j: 'juh',  k: 'kuh',  l: 'lll',  m: 'mmm',  n: 'nnn',  p: 'puh',
  r: 'rrr',  s: 'sss',  t: 'tuh',  v: 'vvv',  w: 'wuh',  x: 'ks',
  y: 'yuh',  z: 'zzz',
  // Digraphs
  sh: 'shh',  ch: 'chuh',  th: 'thuh',  ng: 'ing',
  wh: 'wuh',  ck: 'kuh',  ll: 'lll',  se: 'sss',
  ss: 'sss',  tt: 'tuh',  nn: 'nnn',  gg: 'guh',
  ff: 'fff',  dd: 'duh',  zz: 'zzz',  bb: 'buh',
  pp: 'puh',  mm: 'mmm',  rr: 'rrr',
  // Short vowels
  a: 'ah',  e: 'eh',  i: 'ih',  o: 'aw',  u: 'uh',
  // Long vowels (canonical)
  long_a: 'ay',  long_e: 'ee',  long_i: 'eye',  long_o: 'oh',  long_u: 'you',
  // Long-vowel spelling aliases — fallback TTS strings when MP3 unavailable
  long_ai: 'ay',  long_ay: 'ay',
  long_ea: 'ee',  long_ee: 'ee',
  long_oa: 'oh',  long_ow: 'oh',  long_oe: 'oh',
  long_y:  'eye', long_ie: 'eye', long_igh: 'eye',
  long_oo:  'oo',   // /uː/ as in moon, food, zoo
  short_oo: 'oo',   // /ʊ/  as in book, look, cook (closest TTS match)
  long_ue: 'oo', long_ew: 'oo',   // ue/ew vowel teams say /uː/ (blue, flew), not /juː/
  // R-controlled vowels
  ar: 'ar',  or: 'or',  er: 'err',
  ir: 'err', ur: 'err',
  // R-controlled trigraphs
  air: 'air', ear: 'ear', are: 'air',
  // Diphthongs
  oi: 'oy',  ow: 'ow',  aw: 'aw',
  // Soft consonants
  soft_g: 'juh', soft_c: 'sss',
  // Schwa (reduced unstressed vowel in affixes)
  'ə': 'uh',
};

/** Sound effect file names */
const _SFX = {
  correct:  'reveal-sound', // reuse existing MP3
  wrong:    null,           // generated via oscillator
  reveal:   'reveal-sound',
  levelUp:  null,           // generated
  click:    null,           // generated
};

class AudioManager {
  constructor() {
    /** @type {AudioContext|null} */
    this._ctx = null;
    /** @type {Map<string, AudioBuffer>} */
    this._buffers = new Map();
    /** @type {Map<string, HTMLAudioElement>} */
    this._elements = new Map();
    this._ttsVoice = null;
    this._initTTS();
  }

  /**
   * Best-available TTS voice (or null if voices haven't loaded yet).
   * Exposed so other modules — like storyMode's Read Aloud — can apply the
   * same elaborate cross-browser fallback this module already does,
   * instead of just setting `utt.lang = 'en-GB'` and gambling on whether
   * the user's device happens to ship that locale.
   */
  getTtsVoice() {
    return this._ttsVoice;
  }

  /** Lazily create AudioContext (must be after user gesture) */
  _ensureCtx() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this._ctx.state === 'suspended') {
      this._ctx.resume().catch(() => {});
    }
    return this._ctx;
  }

  /**
   * Load the clearest available English TTS voice — biased hard toward
   * UK female voices so PhonicsQuest sounds consistent across devices.
   *
   * Phonics relies on accurate, well-articulated speech, so the choice
   * of voice matters as much as the audio path. The same word can sound
   * crisp from one voice and muffled from another — and a child building
   * a phonemic map of English needs the model voice to be stable.
   *
   * Selection order:
   *
   *   1. Named clearest UK FEMALE voices known to ship on each platform
   *      (Microsoft Sonia / Libby / Olivia — Edge & Windows;
   *       Google UK English Female — Chrome/Android;
   *       Kate / Serena / Stephanie (Enhanced/Premium) — macOS/iOS).
   *   2. Any en-GB voice whose first name is a known UK female (Sonia,
   *      Libby, Hazel, Olivia, Kate, Serena, Stephanie, Susan, Amy,
   *      Emma, Maisie, Hollie, Mia…).
   *   3. Any high-quality en-GB voice (Natural / Neural / Online /
   *      Enhanced / Premium / Studio / WaveNet) of any gender.
   *   4. Any en-GB voice at all.
   *   5. Fall through to the cross-locale fallback chain — premium
   *      US/AU/SG/IN voices, then absolute last resort.
   *
   * Tiers 1–4 only fire on en-GB voices, so users on platforms without
   * any UK voice installed still get a sensible non-robotic fallback.
   */
  _initTTS() {
    const isLowQuality = (v) =>
      // iOS "Compact" voices are noticeably more robotic than the default
      // ones, and "Eloquence" / novelty voices distort phoneme articulation.
      /\bcompact\b|eloquence|novelty|whisper|bahh|albert|fred|junior|kathy|ralph|trinoids|zarvox/i.test(v.name || '');

    const isEnglish   = (v) => /^en(?:[-_]|$)/i.test(v.lang || '');
    const isUkEnglish = (v) => /^en[-_]gb/i.test(v.lang || '');

    // Tier 1 — exact-name picks: the clearest UK female voices known to
    // ship on each major platform. Listed in priority order so neural
    // cloud voices win over older offline ones.
    const UK_FEMALE_NAMED = [
      // Microsoft (Windows 11 / Edge / Azure Speech) — neural, very clear
      'Microsoft Sonia Online (Natural) - English (United Kingdom)',
      'Microsoft Libby Online (Natural) - English (United Kingdom)',
      'Microsoft Olivia Online (Natural) - English (United Kingdom)',
      'Microsoft Sonia',
      'Microsoft Libby',
      'Microsoft Olivia',
      'Microsoft Hazel',
      // Google (Chrome / Android / Chrome OS)
      'Google UK English Female',
      // Apple (macOS / iOS) — Enhanced/Premium versions first
      'Kate (Enhanced)',  'Kate (Premium)',
      'Serena (Enhanced)', 'Serena (Premium)',
      'Stephanie (Enhanced)', 'Stephanie (Premium)',
      'Kate', 'Serena', 'Stephanie', 'Susan',
    ];

    // Tier 2 fallback: en-GB voices whose first name is a known UK
    // female. Catches future Microsoft Aria-style additions without
    // needing the registry to be touched, and catches platform-specific
    // naming variants ("Kate-compact" etc.) the named list misses.
    const UK_FEMALE_FIRST_NAMES = /\b(sonia|libby|hazel|olivia|maisie|ada|bella|catherine|elsie|hollie|imogen|mia|susie|kate|serena|stephanie|susan|amy|emma|aria|jenny)\b/i;

    const load = () => {
      const all = speechSynthesis.getVoices();
      if (!all.length) return;
      const voices = all.filter(v => isEnglish(v) && !isLowQuality(v));

      // Tier 1 — exact named UK female voices, highest clarity first.
      for (const name of UK_FEMALE_NAMED) {
        const v = voices.find(x => (x.name || '').includes(name));
        if (v) { this._ttsVoice = v; return; }
      }

      // Tier 2 — any en-GB voice with a known female first name.
      const ukVoices = voices.filter(isUkEnglish);
      const ukFemaleByName = ukVoices.find(v => UK_FEMALE_FIRST_NAMES.test(v.name || ''));
      if (ukFemaleByName) { this._ttsVoice = ukFemaleByName; return; }

      // Tier 3 — any premium-quality en-GB voice (cloud / enhanced).
      const ukPremium = ukVoices.find(v =>
        /natural|neural|online|wavenet|studio|enhanced|premium|hd\b/i.test(v.name)
      );
      if (ukPremium) { this._ttsVoice = ukPremium; return; }

      // Tier 4 — any en-GB voice at all.
      if (ukVoices.length) { this._ttsVoice = ukVoices[0]; return; }

      // ── Fallback chain when no UK voice is installed ────────────────

      // Cloud / neural voices in any English locale (still better than
      // robotic offline voices).
      const naturalNeural = voices.find(v => /natural|neural|online|wavenet|studio/i.test(v.name));
      if (naturalNeural) { this._ttsVoice = naturalNeural; return; }

      // Premium named female voices in other locales — kept female so
      // the model voice stays consistent in gender across fallbacks.
      const namedPreferredFemale = [
        'Samantha (Enhanced)', 'Ava (Enhanced)', 'Ava (Premium)', 'Allison (Enhanced)',
        'Samantha', 'Ava', 'Allison', 'Karen', 'Moira', 'Tessa',
        'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira',
        'Google US English',
      ];
      for (const name of namedPreferredFemale) {
        const v = voices.find(x => (x.name || '').includes(name));
        if (v) { this._ttsVoice = v; return; }
      }

      // Any enhanced/premium voice in any English locale.
      const enhanced = voices.find(v => /enhanced|premium|hd\b/i.test(v.name));
      if (enhanced) { this._ttsVoice = enhanced; return; }

      // First voice in a clear language preference order.
      const langOrder = ['en-US', 'en-AU', 'en-SG', 'en-IN'];
      for (const lang of langOrder) {
        const v = voices.find(x => (x.lang || '').toLowerCase() === lang.toLowerCase());
        if (v) { this._ttsVoice = v; return; }
      }

      // Absolute last resort.
      this._ttsVoice = voices[0] ?? all[0] ?? null;
    };

    if (speechSynthesis.getVoices().length) load();
    else speechSynthesis.addEventListener('voiceschanged', load);
  }

  /**
   * Speak a phoneme using MP3 → TTS fallback.
   * Maps phoneme type + grapheme to the right file.
   * @param {string} grapheme  e.g. 'a', 'sh', 'e'
   * @param {string} type      phoneme type ('sv'|'lv'|'c'|'d'|'bl'|'se')
   * @param {object} [opts]    optional context
   * @param {string} [opts.word] the full word (for context-dependent sounds)
   * @returns {Promise<void>}
   */
  async speakPhoneme(grapheme, type, opts = {}) {
    if (!store.get('sfxEnabled')) return;

    // Map grapheme + type to audio key
    let key = grapheme.toLowerCase();
    if (type === 'lv') key = `long_${grapheme.toLowerCase().replace('ee','e').replace('ay','a')}`;
    // 'oo' typed as a SHORT vowel is the /ʊ/ pattern (book, look, good) —
    // distinct from the long /uː/ team (moon) which is typed 'lv'.
    if (type === 'sv' && key === 'oo') key = 'short_oo';
    if (type === 'soft_c') key = 'soft_c';
    if (type === 'soft_g') key = 'soft_g';
    if (type === 'se') return; // silent-e: no sound

    // Ensure hard /g/ for consonant 'g' — always use 'g' (hard g) audio.
    // Words like get, give, gift, girl use hard g despite preceding e/i.
    if (key === 'g' && type === 'c') key = 'g';

    // Diphthong: normalise oy→oi, ou→ow, au→aw so they share one audio file each
    if (type === 'dp') {
      const dipMap = { oy: 'oi', ou: 'ow', au: 'aw' };
      key = dipMap[grapheme.toLowerCase()] ?? grapheme.toLowerCase();
      return this._playPhonemeAudio(key);
    }

    // Suffix / affix tile (-ing, -ed, -er, -est, -ble, -tion, etc.)
    // For -ed: pronunciation depends on the final sound of the base word:
    //   /ɪd/ after /t/ or /d/ sounds (preceding grapheme ends with t or d)
    //   /t/  after voiceless sounds (preceding grapheme ends with p, k, f, s, x, or is sh/ch/th/ck/ss)
    //   /d/  after voiced sounds (everything else)
    if (type === 'sf') {
      const suffix = grapheme.replace(/^-/, '');

      // 1) Explicit phoneme sequence (consonant+le, schwa endings, etc.)
      //    Plays each phoneme individually so TTS never guesses wrong.
      const phonemes = AFFIX_PRONUNCIATION[suffix];
      if (phonemes) {
        for (let i = 0; i < phonemes.length; i++) {
          if (i > 0) await this._delay(80);
          await this._playPhonemeAudio(phonemes[i]);
        }
        return;
      }

      // 2) TTS text override (e.g. "tion" → "shun")
      const ttsOverride = AFFIX_TTS_OVERRIDES[suffix];
      if (ttsOverride) {
        return this._speak(ttsOverride, 0.9);
      }

      // 3) Context-dependent -ed pronunciation
      if (suffix === 'ed') {
        // Prefer the preceding grapheme tile; fall back to the base word's
        // spelling (word minus the -ed) so lesson chips and any caller that
        // knows the word still get the right variant.
        let prev = opts.prevGrapheme?.toLowerCase() ?? null;
        if (!prev && opts.word) {
          const base = opts.word.toLowerCase().replace(/ed$/, '');
          if (base) prev = base.slice(-2);
        }
        if (prev) {
          const lastChar = prev[prev.length - 1];
          // /ɪd/ after t or d (landed, melted) — an extra syllable, played
          // as cached short-i + d phonemes so every voice says it the same
          if (lastChar === 't' || lastChar === 'd') {
            await this._playPhonemeAudio('i');
            await this._delay(80);
            return this._playPhonemeAudio('d');
          }
          // /t/ after voiceless consonants (jumped, fished, kicked)
          const voicelessEndings = ['p','k','f','s','x'];
          const voicelessDigraphs = ['sh','ch','th','ck','ss','tch'];
          if (voicelessEndings.includes(lastChar) || voicelessDigraphs.includes(prev)) {
            return this._playPhonemeAudio('t');
          }
          // /d/ after voiced sounds (filled, played)
          return this._playPhonemeAudio('d');
        }
      }

      // 4) Fallback: let TTS pronounce the suffix text directly
      return this._speak(suffix, 0.9);
    }

    // Blend components — speak each letter separately (handles 2- and 3-letter blends)
    if (type === 'bl') {
      for (let i = 0; i < grapheme.length; i++) {
        if (i > 0) await this._delay(80);
        await this._playPhonemeAudio(grapheme[i]);
      }
      return;
    }

    // Prefix tile — play the curated phoneme sequence (un → /u/+/n/,
    // re → /r/+/ē/, pre → /p/+/r/+/ē/). Falls back to per-letter playback
    // if the prefix isn't in PREFIX_PRONUNCIATION.
    if (type === 'p') {
      const seq = PREFIX_PRONUNCIATION[grapheme.toLowerCase()];
      const sequence = seq ?? [...grapheme];
      for (let i = 0; i < sequence.length; i++) {
        if (i > 0) await this._delay(80);
        await this._playPhonemeAudio(sequence[i]);
      }
      return;
    }

    return this._playPhonemeAudio(key);
  }

  /** @private */
  async _playPhonemeAudio(key) {
    // Try cached buffer first
    if (this._buffers.has(key)) {
      return this._playBuffer(this._buffers.get(key));
    }

    // Try MP3 file
    const filename = PHONEME_FILES[key];
    if (filename) {
      try {
        const buf = await this._loadBuffer(`${PHONEME_PATH}${filename}.mp3`);
        this._buffers.set(key, buf);
        return this._playBuffer(buf);
      } catch (err) {
        devWarn(`MP3 load failed for "${key}", falling back to TTS:`, err.message);
      }
    }

    // TTS fallback – use phonetic text so TTS speaks the sound, not the letter name
    const ttsText = PHONEME_TTS[key] ?? key;
    return this._speak(ttsText, 0.9);
  }

  /**
   * Speak the full word naturally using TTS.
   * @param {string} word
   * @returns {Promise<void>}
   */
  speakWord(word) {
    if (!store.get('sfxEnabled')) return Promise.resolve();
    return this._speak(word, store.get('voiceSpeed') ?? 0.8);
  }

  /**
   * Speak an arbitrary instruction or teaching line with the configured
   * voice. Used by the mini-lesson overlay to narrate Giri's script.
   * Slightly faster floor than word playback so sentences sound natural.
   * @param {string} text
   * @returns {Promise<void>}
   */
  speakText(text) {
    if (!store.get('sfxEnabled')) return Promise.resolve();
    const rate = Math.max(store.get('voiceSpeed') ?? 0.8, 0.85);
    return this._speak(text, rate);
  }

  /**
   * Speak a word at a slower, articulated rate WITHOUT segmenting.
   *
   * For First / Last / Middle Sound modes, the child has to identify
   * one phoneme in a position. Segmenting the word (speakWordStretched)
   * would reveal the answer; playing it at natural conversational
   * speed (speakWord) muddles the target sound. The middle path is
   * what classroom teachers actually do — slow the whole word right
   * down so each beat is audible, but keep it as a single coarticulated
   * utterance so the segmentation is still the child's job.
   *
   * Honours the user's voiceSpeed setting as a CEILING: a child whose
   * parent has already lowered the slider gets the lower of (0.55,
   * their setting), never faster than 0.55.
   *
   * @param {string} word
   * @returns {Promise<void>}
   */
  speakWordArticulated(word) {
    if (!store.get('sfxEnabled')) return Promise.resolve();
    const userRate = store.get('voiceSpeed') ?? 0.8;
    // Neutral pitch: the playful +10% used for chatter shifts vowel
    // formants slightly, which matters when the child is trying to hear
    // WHICH vowel it is. The longer onset delay protects the first
    // consonant from engine clipping.
    return this._speak(word, Math.min(userRate, 0.55), { pitch: 1.0, preDelayMs: 150 });
  }

  /**
   * The classroom "say it twice" model for phonemic-awareness prompts:
   * once slow and fully articulated, a beat of silence, then again at a
   * gentler near-natural rate so the child hears the word both ways
   * before answering. Neutral pitch throughout.
   *
   * @param {string} word
   * @returns {Promise<void>}
   */
  async speakWordTwiceClear(word) {
    if (!store.get('sfxEnabled')) return;
    const userRate = store.get('voiceSpeed') ?? 0.8;
    await this._speak(word, Math.min(userRate, 0.55), { pitch: 1.0, preDelayMs: 150 });
    await new Promise(r => setTimeout(r, 450));
    await this._speak(word, Math.min(userRate, 0.7), { pitch: 1.0, preDelayMs: 80 });
  }

  /**
   * Speak a SIGHT WORD with the natural unstressed pronunciation.
   *
   * Browser TTS engines pronounce single-letter strings like "a" using the
   * letter NAME ("ay" /eɪ/) instead of the unstressed schwa /ə/ that the
   * article actually has in connected speech.  This wrecks the phonics
   * lesson: a child taps the sight-word card "a" expecting to hear the
   * sound they read, and hears the alphabet letter instead.
   *
   * Look the word up in SIGHT_WORD_PRONUNCIATIONS — entries can be either:
   *   • { phoneme: '<key>' } → play the phoneme MP3 directly
   *   • { tts: '<text>' }    → speak overridden TTS text (e.g. "uh")
   * Falls back to plain speakWord for any word with no override.
   *
   * @param {string} word
   * @returns {Promise<void>}
   */
  speakSightWord(word) {
    if (!store.get('sfxEnabled')) return Promise.resolve();
    const key = String(word || '').trim();
    const override = SIGHT_WORD_PRONUNCIATIONS[key] || SIGHT_WORD_PRONUNCIATIONS[key.toLowerCase()];
    if (override?.phoneme) {
      return this._playPhonemeAudio(override.phoneme);
    }
    if (override?.tts) {
      return this._speak(override.tts, store.get('voiceSpeed') ?? 0.8);
    }
    return this.speakWord(word);
  }

  /**
   * Speak a word "stretched out" for phonemic-awareness practice.
   *
   * Plays each grapheme through the existing speakPhoneme pipeline (so
   * digraphs, blends, prefixes, suffixes all sound correct), separated by
   * short gaps small enough that the child still perceives a single word
   * — just elongated — then re-says the full word slowly so they hear the
   * sounds reassemble. This is the "ssss-aaaa-t … sat" model that
   * structured-literacy programmes use when isolating phonemes.
   *
   * Falls back to a single slow speakWord call when wordData lacks the
   * grapheme breakdown (sight words, irregulars) so callers never branch.
   *
   * @param {import('../data/words.js').Word|string} wordData
   * @returns {Promise<void>}
   */
  async speakWordStretched(wordData) {
    if (!store.get('sfxEnabled')) return;

    const word      = typeof wordData === 'string' ? wordData : wordData?.word;
    const graphemes = typeof wordData === 'string' ? null     : wordData?.graphemes;
    const types     = typeof wordData === 'string' ? null     : wordData?.types;
    const slowRate  = Math.max(0.4, (store.get('voiceSpeed') ?? 0.8) * 0.7);

    if (!Array.isArray(graphemes) || graphemes.length === 0) {
      return this._speak(word || '', slowRate);
    }

    // Tight inter-phoneme gap — short enough to feel like one elongated word
    // rather than separated sounds (revealPhonemes uses 350 ms for the
    // explicit per-sound reveal in Blend It; PA needs the sounds to flow).
    const INTER_PHONEME_MS = 140;

    const overrides = typeof wordData === 'string' ? null : wordData?.phonemeKeys;
    for (let i = 0; i < graphemes.length; i++) {
      if (i > 0) await this._delay(INTER_PHONEME_MS);
      // Per-word phoneme override (e.g. the 'u' in bush/full/pull says /ʊ/,
      // not short-u) — play the named phoneme audio directly.
      if (overrides?.[i]) {
        await this._playPhonemeAudio(overrides[i]);
        continue;
      }
      await this.speakPhoneme(graphemes[i], types[i], {
        word,
        prevGrapheme: i > 0 ? graphemes[i - 1] : null,
      });
    }

    await this._delay(280);
    await this._speak(word, slowRate);
  }

  /**
   * Reveal phonemes one-by-one for Blend It mode.
   * @param {import('../data/words.js').Word} wordData
   * @param {(index: number) => void} [onPhoneme]  called with (index) after each phoneme plays
   */
  async revealPhonemes(wordData, onPhoneme) {
    for (let i = 0; i < wordData.graphemes.length; i++) {
      const grapheme = wordData.graphemes[i];
      const type     = wordData.types[i];
      const prevGrapheme = i > 0 ? wordData.graphemes[i - 1] : null;
      onPhoneme?.(i);
      // Per-word phoneme override (see speakWordStretched).
      if (wordData.phonemeKeys?.[i]) {
        await this._playPhonemeAudio(wordData.phonemeKeys[i]);
      } else {
        await this.speakPhoneme(grapheme, type, { word: wordData.word, prevGrapheme });
      }
      await this._delay(350);
    }
    // Brief pause then say full word
    await this._delay(200);
    await this.speakWord(wordData.word);
  }

  /** Play a UI sound effect */
  async playSfx(name) {
    if (!store.get('sfxEnabled')) return;
    const ctx = this._ensureCtx();

    switch (name) {
      case 'correct':
        this._playTone(ctx, 880, 0.15, 'sine');
        await this._delay(80);
        this._playTone(ctx, 1108, 0.12, 'sine');
        break;
      case 'wrong':
        this._playTone(ctx, 200, 0.2, 'sawtooth');
        break;
      case 'pop':
        this._playTone(ctx, 660, 0.08, 'sine', 0.05);
        break;
      case 'clap':
        // A hand-clap-like transient: a short, sharp burst of band-passed
        // noise with a fast decay. Much more audible (and clap-like) than the
        // faint 'pop' blip, so the Clap-the-Syllables button gives the child
        // real per-beat feedback. Falls back to a tone where the environment
        // lacks buffer/filter support (e.g. jsdom test stubs).
        try {
          const dur    = 0.09;
          const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
          const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
          const data   = buffer.getChannelData(0);
          for (let i = 0; i < frames; i++) {
            const env = Math.pow(1 - i / frames, 2.5);   // fast exponential decay
            data[i] = (Math.random() * 2 - 1) * env;
          }
          const src  = ctx.createBufferSource();
          src.buffer = buffer;
          const band = ctx.createBiquadFilter();
          band.type = 'bandpass';
          band.frequency.value = 1600;
          band.Q.value = 0.8;
          const gain = ctx.createGain();
          gain.gain.value = 0.55;
          src.connect(band);
          band.connect(gain);
          gain.connect(ctx.destination);
          src.start();
        } catch (err) {
          devWarn('Clap SFX fallback to tone:', err.message);
          this._playTone(ctx, 800, 0.25, 'triangle', 0.08);
        }
        break;
      case 'levelUp':
        for (const [freq, t] of [[523,0],[659,0.1],[784,0.2],[1047,0.3]]) {
          setTimeout(() => this._playTone(ctx, freq, 0.15, 'sine'), t * 1000);
        }
        break;
      case 'spin':
        this._playTone(ctx, 440, 0.05, 'triangle', 0.08);
        break;
      case 'reveal':
        try {
          const buf = await this._loadBuffer(`${SFX_PATH}reveal-sound.mp3`);
          this._playBuffer(buf, 0.4);
        } catch (err) {
          devWarn('Reveal SFX fallback to tone:', err.message);
          this._playTone(ctx, 523, 0.1, 'sine');
        }
        break;
      default:
        break;
    }
  }

  /** @private — Web Speech API utterance */
  _speak(text, rate = 0.8, { pitch = 1.1, preDelayMs = 80 } = {}) {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) { resolve(); return; }
      speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate  = rate;
      utt.pitch = pitch;
      utt.volume = 1;
      if (this._ttsVoice) utt.voice = this._ttsVoice;
      // Setting `lang` matters even when a voice is selected: on Android the
      // voiceschanged event sometimes fires after the first utterance, so
      // lang is what nudges the engine to pick an English voice instead of
      // the device default (which may be muffled or non-English).
      utt.lang = this._ttsVoice?.lang || 'en-US';

      let resolved = false;
      const done = () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(safariFallback);
        clearInterval(safariResumeCheck);
        resolve();
      };

      utt.onend  = done;
      utt.onerror = done;

      // Safari bug: speechSynthesis.onend can silently never fire, stalling
      // the whole playback chain. Resolve after a generous time limit based
      // on text length so the app always continues.
      const estimatedMs = Math.max(1500, Math.ceil(text.length * 80 / rate)) + 800;
      const safariFallback = setTimeout(done, estimatedMs);

      // Safari iOS: synthesis silently pauses when the page loses focus or
      // another audio event fires. Poll and resume so sounds keep playing.
      const safariResumeCheck = setInterval(() => {
        if (resolved) { clearInterval(safariResumeCheck); return; }
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      }, 250);

      // Onset guard: speaking immediately after cancel() clips the first
      // consonant on Chrome/Android — fatal for First Sound, where that
      // consonant IS the question. A short gap lets the engine settle.
      setTimeout(() => speechSynthesis.speak(utt), preDelayMs);
    });
  }

  /** @private — fetch and decode an MP3 into AudioBuffer */
  async _loadBuffer(url) {
    const ctx = this._ensureCtx();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    try {
      return await ctx.decodeAudioData(arrayBuffer);
    } catch (err) {
      devWarn(`Failed to decode audio ${url}:`, err.message);
      throw err;
    }
  }

  /** @private — play an AudioBuffer */
  _playBuffer(buffer, gainValue = 0.8) {
    return new Promise((resolve) => {
      const ctx = this._ensureCtx();
      const source = ctx.createBufferSource();
      const gain   = ctx.createGain();
      source.buffer = buffer;
      gain.gain.value = gainValue;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.onended = () => resolve();
      source.start(0);
    });
  }

  /** @private — synthesize a simple tone */
  _playTone(ctx, frequency, gain = 0.1, type = 'sine', duration = 0.15) {
    const osc  = ctx.createOscillator();
    const vol  = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    vol.gain.setValueAtTime(gain, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(vol);
    vol.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  /** @private */
  _delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  /**
   * Preload phoneme MP3s for a word (non-blocking, best-effort).
   * Call this when a word is displayed so audio is ready.
   */
  preloadWord(wordData) {
    // Some modes (e.g. Clap the Syllables) play words from a phonological
    // pool that carries no grapheme breakdown — nothing to preload.
    if (!Array.isArray(wordData?.graphemes)) return;
    for (let i = 0; i < wordData.graphemes.length; i++) {
      const grapheme = wordData.graphemes[i];
      const type     = wordData.types[i];
      let key = grapheme.toLowerCase();
      if (type === 'lv') key = `long_${grapheme.toLowerCase()}`;
      if (type === 'soft_c') key = 'soft_c';
      if (type === 'soft_g') key = 'soft_g';
      if (type === 'dp') {
        const dipMap = { oy: 'oi', ou: 'ow', au: 'aw' };
        key = dipMap[grapheme.toLowerCase()] ?? grapheme.toLowerCase();
      }
      if (type === 'se' || this._buffers.has(key)) continue;
      const filename = PHONEME_FILES[key];
      if (filename) {
        this._loadBuffer(`${PHONEME_PATH}${filename}.mp3`)
          .then(buf => this._buffers.set(key, buf))
          .catch(err => devWarn(`Preload failed for "${key}":`, err.message));
      }
    }
  }
}

export const audio = new AudioManager();
