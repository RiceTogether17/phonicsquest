/**
 * Fluency Sprint — scoring & hints.
 *
 * The child reads a list of familiar words within a time window. We measure
 * both accuracy and speed (words-per-minute equivalent). Mastery requires
 * both ≥90% accuracy AND meeting the target WPM threshold — a child who
 * sprints inaccurately or reads carefully but slowly does not master.
 *
 * Attempt shape:
 *   {
 *     attempts: [
 *       { word: 'cat', correct: true,  timeMs: 800 },
 *       { word: 'hat', correct: false, timeMs: 1500 },
 *       ...
 *     ],
 *     durationMs: number,   // total elapsed sprint time
 *     targetWpm?: number,   // override default mastery threshold
 *   }
 *
 * Error categories:
 *   - fast-and-error     : speed ≥ target but accuracy < 90%
 *   - slow-and-accurate  : accuracy ≥ 90% but speed < target
 *   - sound-by-sound     : average per-word time very slow (> 2500 ms)
 *   - default
 */

const DEFAULT_TARGET_WPM = 30;
const MASTERY_ACCURACY   = 0.90;
const SOUND_BY_SOUND_MS  = 2500;

const HINTS = Object.freeze({
  'slow-and-accurate': 'Great accuracy! Read three words a beat faster next time.',
  'fast-and-error':    'Slow down a tiny bit. Accuracy first, speed second.',
  'sound-by-sound':    'These words are familiar. Try reading them as whole chunks.',
  'default':           'Take a breath, then read three words together as a phrase.',
});

function classify({ accuracy, wpm, avgMs, targetWpm }) {
  if (avgMs > SOUND_BY_SOUND_MS) return 'sound-by-sound';
  if (wpm >= targetWpm && accuracy < MASTERY_ACCURACY) return 'fast-and-error';
  if (wpm <  targetWpm && accuracy >= MASTERY_ACCURACY) return 'slow-and-accurate';
  return 'default';
}

function _summarise(attempt = {}) {
  const list = Array.isArray(attempt?.attempts) ? attempt.attempts : [];
  const total = list.length;
  const correct = list.filter(a => a?.correct === true).length;
  const accuracy = total === 0 ? 0 : correct / total;

  const summed = list.reduce((acc, a) => acc + (typeof a.timeMs === 'number' ? a.timeMs : 0), 0);
  const avgMs = total === 0 ? 0 : summed / total;
  const durationMs = typeof attempt.durationMs === 'number' && attempt.durationMs > 0
    ? attempt.durationMs
    : summed;
  const wpm = durationMs > 0 ? (correct / (durationMs / 60000)) : 0;

  return { total, correct, accuracy, avgMs, wpm };
}

export function getFluencySprintHint(attempt = {}) {
  const s = _summarise(attempt);
  const targetWpm = typeof attempt?.targetWpm === 'number' ? attempt.targetWpm : DEFAULT_TARGET_WPM;
  const cat = classify({ ...s, targetWpm });
  return HINTS[cat] ?? HINTS.default;
}

export function scoreFluencySprint(attempt = {}) {
  const s = _summarise(attempt);
  const targetWpm = typeof attempt?.targetWpm === 'number' ? attempt.targetWpm : DEFAULT_TARGET_WPM;

  const mastered = s.accuracy >= MASTERY_ACCURACY && s.wpm >= targetWpm;
  const cat = mastered ? null : classify({ ...s, targetWpm });

  return {
    correct: mastered,
    errorCategory: cat,
    hint: mastered ? '' : (HINTS[cat] ?? HINTS.default),
    masteryDelta: mastered ? 1 : 0,
    scoreBreakdown: {
      accuracy: s.accuracy,
      wpm:      Number(s.wpm.toFixed(1)),
      avgMs:    Math.round(s.avgMs),
      correct:  s.correct,
      total:    s.total,
      targetWpm,
    },
  };
}
