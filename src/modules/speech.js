/**
 * PhonicsQuest – Speech Recognition Scoring
 *
 * Uses the Web Speech API to listen to the child saying a word,
 * then scores it using Levenshtein distance + phonetic similarity.
 */

import { store } from './store.js';

/** Dev-mode logging helper */
const devWarn = (...args) => {
  if (import.meta.env.DEV) console.warn('[Speech]', ...args);
};

export function buildSpeechLocales(preferredLocale = 'en-SG') {
  return [...new Set([preferredLocale, 'en-SG', 'en-GB', 'en-AU', 'en-IN', 'en-US'])];
}

export function calculateCalibrationThreshold(avgScore) {
  const raw = Number(avgScore) * 0.9;
  return Math.max(0.5, Math.min(0.95, Number.isFinite(raw) ? raw : 0.75));
}

class SpeechRecognizer {
  constructor() {
    /** @type {SpeechRecognition|null} */
    this._recognition = null;
    this._listening = false;
    /** @type {(() => void)|null} settles the in-flight listen promise on stop() */
    this._cancelPending = null;
    this.supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Start listening and return a scored result.
   * @param {string} targetWord  the word the child should say
   * @returns {Promise<{ heard: string, score: number, rawScore: number, correct: boolean, confidence?: number, localesTried?: string[] } | null>}
   *   null if cancelled or not supported
   */
  listen(targetWord) {
    if (!this.supported) return Promise.resolve(null);
    if (store.get('speechEnabled') === false) return Promise.resolve(null);

    return new Promise((resolve) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const preferredLocale = store.get('speechLocale') || 'en-SG';
      const locales = buildSpeechLocales(preferredLocale);
      const threshold = Number(store.get('speechThreshold') ?? 0.75);
      let localeIndex = 0;

      const startRecognition = () => {
        this.stop();

        this._recognition = new SpeechRecognition();
        this._recognition.lang = locales[localeIndex];
        this._recognition.continuous = false;
        this._recognition.interimResults = false;
        this._recognition.maxAlternatives = 5;

        const timeout = setTimeout(() => {
          this.stop();
          resolve(null);
        }, 8000);
        // Let an external stop() settle this promise immediately instead of
        // leaving it (and its closure) hanging until the hard timeout.
        this._cancelPending = () => {
          clearTimeout(timeout);
          this._listening = false;
          resolve(null);
        };

        this._recognition.onresult = (event) => {
          clearTimeout(timeout);
          this._cancelPending = null;
          const results = Array.from(event.results[0]);
          const transcripts = results.map((r) => ({
            text: r.transcript.toLowerCase().trim(),
            confidence: r.confidence,
          }));

          const target = targetWord.toLowerCase().trim();
          const exactMatch = transcripts.some((t) => t.text === target);

          let bestMatch = { text: '', score: 0, confidence: 0 };
          for (const t of transcripts) {
            const score = this._phoneticSimilarity(t.text, target);
            if (score > bestMatch.score) {
              bestMatch = { text: t.text, score, confidence: t.confidence };
            }
          }

          this._listening = false;
          resolve({
            heard: bestMatch.text,
            rawScore: bestMatch.score,
            score: Math.round(bestMatch.score * 100),
            correct: exactMatch || bestMatch.score >= threshold,
            confidence: bestMatch.confidence,
            localesTried: locales.slice(0, localeIndex + 1),
          });
        };

        this._recognition.onerror = (event) => {
          clearTimeout(timeout);
          this._listening = false;

          const canFallback =
            (event?.error === 'language-not-supported' || event?.error === 'service-not-allowed') &&
            localeIndex < locales.length - 1;

          if (canFallback) {
            localeIndex += 1;
            // Same promise continues in the retry — detach the cancel hook so
            // the stop() inside startRecognition doesn't resolve it early.
            this._cancelPending = null;
            startRecognition();
            return;
          }

          this._cancelPending = null;
          resolve(null);
        };

        this._recognition.onend = () => {
          clearTimeout(timeout);
          this._listening = false;
        };

        this._listening = true;
        try {
          this._recognition.start();
        } catch (err) {
          devWarn('Recognition start failed:', err.message);
          clearTimeout(timeout);
          this._listening = false;
          this._cancelPending = null;
          resolve(null);
        }
      };

      startRecognition();
    });
  }

  /**
   * Listen and return the raw transcript alternatives without scoring
   * against a single target word. Used by the read-aloud listener to
   * align a whole spoken line against the expected words.
   *
   * @param {object} [opts]
   * @param {number} [opts.timeoutMs]  hard stop — children pause a lot mid-line
   * @returns {Promise<{ transcripts: { text: string, confidence: number }[] } | null>}
   *   null if unsupported, disabled, cancelled, or nothing was heard
   */
  listenTranscript({ timeoutMs = 12000 } = {}) {
    if (!this.supported) return Promise.resolve(null);
    if (store.get('speechEnabled') === false) return Promise.resolve(null);

    return new Promise((resolve) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const preferredLocale = store.get('speechLocale') || 'en-SG';
      const locales = buildSpeechLocales(preferredLocale);
      let localeIndex = 0;

      const startRecognition = () => {
        this.stop();

        this._recognition = new SpeechRecognition();
        this._recognition.lang = locales[localeIndex];
        this._recognition.continuous = false;
        this._recognition.interimResults = false;
        this._recognition.maxAlternatives = 5;

        const timeout = setTimeout(() => {
          this.stop();
          resolve(null);
        }, timeoutMs);
        // Let an external stop() settle this promise immediately instead of
        // leaving it (and its closure) hanging until the hard timeout.
        this._cancelPending = () => {
          clearTimeout(timeout);
          this._listening = false;
          resolve(null);
        };

        this._recognition.onresult = (event) => {
          clearTimeout(timeout);
          this._cancelPending = null;
          this._listening = false;
          const transcripts = Array.from(event.results[0])
            .map((r) => ({
              text: r.transcript.toLowerCase().trim(),
              confidence: r.confidence,
            }))
            .filter((t) => t.text);
          resolve(transcripts.length ? { transcripts } : null);
        };

        this._recognition.onerror = (event) => {
          clearTimeout(timeout);
          this._listening = false;

          const canFallback =
            (event?.error === 'language-not-supported' || event?.error === 'service-not-allowed') &&
            localeIndex < locales.length - 1;

          if (canFallback) {
            localeIndex += 1;
            // Same promise continues in the retry — detach the cancel hook so
            // the stop() inside startRecognition doesn't resolve it early.
            this._cancelPending = null;
            startRecognition();
            return;
          }

          this._cancelPending = null;
          resolve(null);
        };

        this._recognition.onend = () => {
          clearTimeout(timeout);
          this._listening = false;
        };

        this._listening = true;
        try {
          this._recognition.start();
        } catch (err) {
          devWarn('Recognition start failed:', err.message);
          clearTimeout(timeout);
          this._listening = false;
          this._cancelPending = null;
          resolve(null);
        }
      };

      startRecognition();
    });
  }

  /**
   * Public phonetic similarity (0–1) between two single words.
   * Cached; used by the read-aloud aligner.
   */
  phoneticSimilarity(a, b) {
    return this._phoneticSimilarity((a || '').toLowerCase(), (b || '').toLowerCase());
  }

  /** Stop listening and settle any pending listen promise with null. */
  stop() {
    if (this._recognition) {
      try {
        this._recognition.stop();
      } catch (err) {
        devWarn('Stop failed:', err.message);
      }
      this._recognition = null;
    }
    this._listening = false;
    if (this._cancelPending) {
      const cancel = this._cancelPending;
      this._cancelPending = null;
      cancel();
    }
  }

  /** @returns {boolean} */
  get isListening() {
    return this._listening;
  }

  _doubleMetaphoneCode(word) {
    const w = (word || '').toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return '';

    let s = w
      .replace(/^kn/, 'n')
      .replace(/^gn/, 'n')
      .replace(/^wr/, 'r')
      .replace(/^wh/, 'w')
      .replace(/ph/g, 'f')
      .replace(/ght/g, 't')
      .replace(/dg(e|i|y)/g, 'j')
      .replace(/tch/g, 'ch')
      .replace(/sch/g, 'sk')
      .replace(/sh/g, 'x')
      .replace(/ch/g, 'x')
      .replace(/th/g, '0')
      .replace(/ck/g, 'k')
      .replace(/qu/g, 'k')
      .replace(/x/g, 'ks');

    s = s.replace(/[aeiou]+/g, 'a');
    s = s.replace(/(.)\1+/g, '$1');
    s = s.replace(/[^a-z0]/g, '');
    return s.slice(0, 6);
  }

  _doubleMetaphoneSimilarity(a, b) {
    const ca = this._doubleMetaphoneCode(a);
    const cb = this._doubleMetaphoneCode(b);
    if (!ca || !cb) return 0;
    if (ca === cb) return 1;
    if (ca.slice(0, 2) && ca.slice(0, 2) === cb.slice(0, 2)) return 0.8;
    return 0;
  }

  /** @type {Map<string, number>} LRU cache for phonetic similarity scores */
  _similarityCache = new Map();
  _CACHE_MAX = 500;

  _phoneticSimilarity(a, b) {
    if (a === b) return 1;

    const cacheKey = `${a}|${b}`;
    if (this._similarityCache.has(cacheKey)) return this._similarityCache.get(cacheKey);
    const score = this._computePhoneticSimilarity(a, b);
    this._similarityCache.set(cacheKey, score);
    if (this._similarityCache.size > this._CACHE_MAX) {
      this._similarityCache.delete(this._similarityCache.keys().next().value);
    }
    return score;
  }

  _computePhoneticSimilarity(a, b) {
    if (a === b) return 1;

    const normalize = (s) =>
      s
        .replace(/ph/g, 'f')
        .replace(/ck/g, 'k')
        .replace(/igh/g, 'i')
        .replace(/tion/g, 'shun')
        .replace(/ee/g, 'e')
        .replace(/oo/g, 'u')
        .replace(/th/g, 't')
        .replace(/sh/g, 's')
        .replace(/ch/g, 'c')
        .replace(/r\b/g, '')
        .replace(/er\b/g, 'uh');

    const na = normalize(a);
    const nb = normalize(b);

    const dist = this._levenshtein(na, nb);
    const maxLen = Math.max(na.length, nb.length, 1);
    const lev = 1 - dist / maxLen;
    const metaphone = this._doubleMetaphoneSimilarity(na, nb);
    return 0.7 * lev + 0.3 * metaphone;
  }

  _levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }

    return dp[m][n];
  }
}

export const speech = new SpeechRecognizer();
