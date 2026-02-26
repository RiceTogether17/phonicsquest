/**
 * PhonicsQuest – Speech Recognition Scoring
 *
 * Uses the Web Speech API to listen to the child saying a word,
 * then scores it using Levenshtein distance + phonetic similarity.
 */

class SpeechRecognizer {
  constructor() {
    /** @type {SpeechRecognition|null} */
    this._recognition = null;
    this._listening = false;
    this.supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Start listening and return a scored result.
   * @param {string} targetWord  the word the child should say
   * @returns {Promise<{ heard: string, score: number, correct: boolean } | null>}
   *   null if cancelled or not supported
   */
  listen(targetWord) {
    if (!this.supported) return Promise.resolve(null);

    return new Promise((resolve) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this._recognition = new SpeechRecognition();
      this._recognition.lang = 'en-US';
      this._recognition.continuous = false;
      this._recognition.interimResults = false;
      this._recognition.maxAlternatives = 5;

      const timeout = setTimeout(() => {
        this.stop();
        resolve(null);
      }, 8000); // 8-second timeout

      this._recognition.onresult = (event) => {
        clearTimeout(timeout);
        const results = Array.from(event.results[0]);
        const transcripts = results.map(r => ({
          text: r.transcript.toLowerCase().trim(),
          confidence: r.confidence,
        }));

        const target = targetWord.toLowerCase().trim();

        // Check all alternatives for an exact match
        const exactMatch = transcripts.some(t => t.text === target);

        // Find best match using phonetic similarity
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
          score: Math.round(bestMatch.score * 100),
          correct: exactMatch || bestMatch.score >= 0.75,
          confidence: bestMatch.confidence,
        });
      };

      this._recognition.onerror = () => {
        clearTimeout(timeout);
        this._listening = false;
        resolve(null);
      };

      this._recognition.onend = () => {
        clearTimeout(timeout);
        this._listening = false;
      };

      this._listening = true;
      this._recognition.start();
    });
  }

  /** Stop listening */
  stop() {
    if (this._recognition) {
      try { this._recognition.stop(); } catch (_) {}
      this._recognition = null;
    }
    this._listening = false;
  }

  /** @returns {boolean} */
  get isListening() {
    return this._listening;
  }

  /**
   * Compute phonetic similarity between two strings.
   * Uses Levenshtein distance normalized to 0-1, with phonetic adjustments.
   * @private
   */
  _phoneticSimilarity(a, b) {
    if (a === b) return 1;

    // Simple phonetic normalization
    const normalize = (s) => s
      .replace(/ph/g, 'f')
      .replace(/ck/g, 'k')
      .replace(/igh/g, 'i')
      .replace(/tion/g, 'shun')
      .replace(/ee/g, 'e')
      .replace(/oo/g, 'u')
      .replace(/th/g, 't')
      .replace(/sh/g, 's')
      .replace(/ch/g, 'c');

    const na = normalize(a);
    const nb = normalize(b);

    const dist = this._levenshtein(na, nb);
    const maxLen = Math.max(na.length, nb.length, 1);
    return 1 - (dist / maxLen);
  }

  /**
   * Standard Levenshtein distance.
   * @private
   */
  _levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,       // deletion
          dp[i][j - 1] + 1,       // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return dp[m][n];
  }
}

export const speech = new SpeechRecognizer();
