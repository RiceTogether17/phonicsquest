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
  se: 's',   // "se" makes the /s/ sound
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
  // Diphthongs  (oi covers oi+oy, ow covers ow+ou, aw covers aw+au)
  oi: 'oi', ow: 'ow', aw: 'aw',
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
  // Short vowels
  a: 'ah',  e: 'eh',  i: 'ih',  o: 'aw',  u: 'uh',
  // Long vowels (canonical)
  long_a: 'ay',  long_e: 'ee',  long_i: 'eye',  long_o: 'oh',  long_u: 'you',
  // Long-vowel spelling aliases
  long_ai: 'ay',  long_ay: 'ay',
  long_ea: 'ee',  long_ee: 'ee',
  long_oa: 'oh',  long_ow: 'oh',
  // Diphthongs
  oi: 'oy',  ow: 'ow',  aw: 'aw',
};

/** Sound effect file names */
const SFX = {
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

  /** Load preferred TTS voice */
  _initTTS() {
    const load = () => {
      const voices = speechSynthesis.getVoices();
      // Prefer natural-sounding English voices
      const preferred = [
        'Google US English', 'Microsoft Aria Online',
        'Karen', 'Samantha', 'Daniel',
      ];
      for (const name of preferred) {
        const v = voices.find(v => v.name.includes(name));
        if (v) { this._ttsVoice = v; return; }
      }
      // Fallback: first en-US voice
      this._ttsVoice = voices.find(v => v.lang === 'en-US') ?? voices[0] ?? null;
    };
    if (speechSynthesis.getVoices().length) load();
    else speechSynthesis.addEventListener('voiceschanged', load, { once: true });
  }

  /**
   * Speak a phoneme using MP3 → TTS fallback.
   * Maps phoneme type + grapheme to the right file.
   * @param {string} grapheme  e.g. 'a', 'sh', 'e'
   * @param {string} type      phoneme type ('sv'|'lv'|'c'|'d'|'bl'|'se')
   * @returns {Promise<void>}
   */
  async speakPhoneme(grapheme, type) {
    if (!store.get('sfxEnabled')) return;

    // Map grapheme + type to audio key
    let key = grapheme.toLowerCase();
    if (type === 'lv') key = `long_${grapheme.toLowerCase().replace('ee','e').replace('ay','a')}`;
    if (type === 'se') return; // silent-e: no sound

    // Diphthong: normalise oy→oi, ou→ow, au→aw so they share one audio file each
    if (type === 'dp') {
      const dipMap = { oy: 'oi', ou: 'ow', au: 'aw' };
      key = dipMap[grapheme.toLowerCase()] ?? grapheme.toLowerCase();
      return this._playPhonemeAudio(key);
    }

    // Suffix tile (-ing, -ed, -er, -est) — speak the morpheme via TTS
    if (type === 'sf') {
      return this._speak(grapheme.replace(/^-/, ''), 0.9);
    }

    // Consolidate blend components (fl, sl, etc.) — speak each letter separately
    if (type === 'bl' && grapheme.length === 2) {
      await this._playPhonemeAudio(grapheme[0]);
      await this._delay(80);
      await this._playPhonemeAudio(grapheme[1]);
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
      } catch (_) { /* fall through to TTS */ }
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
   * Reveal phonemes one-by-one for Blend It mode.
   * @param {import('../data/words.js').Word} wordData
   * @param {Function} [onPhoneme]  called with (index) after each phoneme plays
   */
  async revealPhonemes(wordData, onPhoneme) {
    for (let i = 0; i < wordData.graphemes.length; i++) {
      const grapheme = wordData.graphemes[i];
      const type     = wordData.types[i];
      onPhoneme?.(i);
      await this.speakPhoneme(grapheme, type);
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
        } catch (_) {
          this._playTone(ctx, 523, 0.1, 'sine');
        }
        break;
      default:
        break;
    }
  }

  /** @private — Web Speech API utterance */
  _speak(text, rate = 0.8) {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) { resolve(); return; }
      speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate  = rate;
      utt.pitch = 1.1;
      utt.volume = 1;
      if (this._ttsVoice) utt.voice = this._ttsVoice;

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

      speechSynthesis.speak(utt);
    });
  }

  /** @private — fetch and decode an MP3 into AudioBuffer */
  async _loadBuffer(url) {
    const ctx = this._ensureCtx();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    return ctx.decodeAudioData(arrayBuffer);
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
    for (let i = 0; i < wordData.graphemes.length; i++) {
      const grapheme = wordData.graphemes[i];
      const type     = wordData.types[i];
      let key = grapheme.toLowerCase();
      if (type === 'lv') key = `long_${grapheme.toLowerCase()}`;
      if (type === 'dp') {
        const dipMap = { oy: 'oi', ou: 'ow', au: 'aw' };
        key = dipMap[grapheme.toLowerCase()] ?? grapheme.toLowerCase();
      }
      if (type === 'se' || this._buffers.has(key)) continue;
      const filename = PHONEME_FILES[key];
      if (filename) {
        this._loadBuffer(`${PHONEME_PATH}${filename}.mp3`)
          .then(buf => this._buffers.set(key, buf))
          .catch(() => {});
      }
    }
  }
}

export const audio = new AudioManager();
