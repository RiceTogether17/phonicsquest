/**
 * PhonicsQuest – Evidence Model
 *
 * Records HOW an answer was obtained, not just whether it was right.
 *
 * The problem this solves: before this module, a child who tapped "Yes! ✓"
 * after the app had played the phonemes and blended the word aloud produced
 * a stored record byte-identical to a child who read a printed word cold.
 * Both wrote `correct: true`. Mastery, stage unlocks, SRS promotion and the
 * parent report card all treated them the same.
 *
 * Four levels, ranked. Each answers "what did the child actually do?":
 *
 *   exposure     The app demonstrated the answer. Modelled blends and
 *                self-reports ("Did you blend it right?") live here — the
 *                child heard the word before claiming to have read it.
 *                Real learning activity; not proof of anything.
 *   guided       The child produced the answer, but with support: a hint was
 *                used, an earlier attempt was wrong, or the task supplies the
 *                answer in another channel (audio + printed options).
 *   independent  No model, no hint, first try. This is the evidence mastery
 *                is allowed to rest on.
 *   verified     An adult watched and marked it. Outranks everything —
 *                nothing else can distinguish "blended it" from "copied it".
 *
 * Practice at ANY level still counts as practice: XP, streaks, badges and
 * activity totals are untouched. What changes is what may be called mastery.
 *
 * Public API:
 *   EVIDENCE                     the four level constants
 *   EVIDENCE_RANK                level → 0..3, for comparisons
 *   MIN_MASTERY_EVIDENCE         the level mastery claims require
 *   isMasteryEvidence(level)     level >= independent?
 *   classifyEvidence(opts)       derive a level from the live attempt state
 *   emptyEvidenceCounts()        a fresh { level: {attempts, correct} } map
 *   ensureEvidenceBuckets(stat)  lazy backfill for pre-v2 saved stats
 *   addEvidenceCount(...)        immutably bump one level's counters
 *   confidenceFor(n)             independent-sample-size → confidence band
 */

/** @typedef {'exposure'|'guided'|'independent'|'verified'} EvidenceLevel */

/** @type {Record<string, EvidenceLevel>} */
export const EVIDENCE = Object.freeze({
  EXPOSURE: 'exposure',
  GUIDED: 'guided',
  INDEPENDENT: 'independent',
  VERIFIED: 'verified',
});

/** Ordered ranks so levels can be compared and `min`-ed. */
export const EVIDENCE_RANK = Object.freeze({
  exposure: 0,
  guided: 1,
  independent: 2,
  verified: 3,
});

/** Levels in rank order — the canonical iteration order for buckets. */
export const EVIDENCE_LEVELS = Object.freeze([
  EVIDENCE.EXPOSURE,
  EVIDENCE.GUIDED,
  EVIDENCE.INDEPENDENT,
  EVIDENCE.VERIFIED,
]);

/**
 * The floor for any mastery claim. Exposure and guided work still count as
 * practice and still drive adaptive selection — they just can't be cited as
 * proof the child can do the thing unaided.
 */
export const MIN_MASTERY_EVIDENCE = EVIDENCE.INDEPENDENT;

/**
 * Evidence level applied to attempts recorded before this module existed.
 * Grandfathering as `guided` keeps every already-unlocked stage unlocked and
 * every accumulated count visible, while excluding unverified history from
 * the new independent-evidence requirement. Treating it as `independent`
 * would launder exactly the data this model exists to distinguish; treating
 * it as `exposure` would drop live learners' progress mid-journey.
 */
export const LEGACY_EVIDENCE = EVIDENCE.GUIDED;

/** True when a level is strong enough to support a mastery claim. */
export function isMasteryEvidence(level) {
  return (EVIDENCE_RANK[level] ?? -1) >= EVIDENCE_RANK[MIN_MASTERY_EVIDENCE];
}

/** The weaker of two levels. Unknown levels are treated as `exposure`. */
function _min(a, b) {
  const ra = EVIDENCE_RANK[a] ?? 0;
  const rb = EVIDENCE_RANK[b] ?? 0;
  return ra <= rb
    ? (EVIDENCE_LEVELS[ra] ?? EVIDENCE.EXPOSURE)
    : (EVIDENCE_LEVELS[rb] ?? EVIDENCE.EXPOSURE);
}

/**
 * Derive the evidence level for one attempt.
 *
 * The result is the WEAKER of two independent limits:
 *   1. what the mode is capable of showing (`ceiling`, declared per mode in
 *      the MODES registry) — a self-assessed blend can never exceed
 *      `exposure` no matter how cleanly the child taps;
 *   2. what happened during this particular attempt — a hint or a wrong
 *      first try caps an otherwise-independent mode at `guided`.
 *
 * An adult verdict bypasses both: a grown-up who watched knows more than any
 * inference we can make from button taps.
 *
 * @param {Object}  opts
 * @param {EvidenceLevel} [opts.ceiling]    mode's declared maximum
 * @param {boolean} [opts.hintUsed]         any hint tier was opened
 * @param {number}  [opts.wrongStrikes]     wrong attempts before this one
 * @param {'independent'|'help'|'not-yet'|null} [opts.adultVerdict]
 * @returns {EvidenceLevel}
 */
export function classifyEvidence({
  ceiling = EVIDENCE.INDEPENDENT,
  hintUsed = false,
  wrongStrikes = 0,
  adultVerdict = null,
} = {}) {
  // An observing adult is the only source that can confirm the child did the
  // work rather than echoed it — including when they report needing help.
  if (adultVerdict === 'independent') return EVIDENCE.VERIFIED;
  if (adultVerdict === 'help' || adultVerdict === 'not-yet') return EVIDENCE.GUIDED;

  const fromAttempt = hintUsed || wrongStrikes > 0 ? EVIDENCE.GUIDED : EVIDENCE.INDEPENDENT;

  return _min(ceiling, fromAttempt);
}

/**
 * Mode key → the strongest evidence that mode can produce unaided.
 *
 * This lives here, not in the MODES registry, for two reasons: progress.js
 * needs it and cannot import modes/index.js without a cycle
 * (modes/index.js → fluencySprintMode.js → progress.js); and several scored
 * modes (`letterSounds`, `sightMatch`) are not in that registry at all.
 * MODES entries carry a matching `evidenceCeiling` field for readability at
 * the point of use — `src/__tests__/evidence.test.js` asserts the two agree.
 *
 * @type {Record<string, EvidenceLevel>}
 */
export const MODE_EVIDENCE_CEILING = Object.freeze({
  // Self-assessed: the app reveals the phonemes and blends the word aloud,
  // then asks the child whether they got it. Reflection, not demonstration.
  blend: EVIDENCE.EXPOSURE,
  classicBlend: EVIDENCE.EXPOSURE,

  // The target is spoken before the child picks from printed options, so a
  // correct tap shows auditory-to-print matching rather than decoding.
  hear: EVIDENCE.GUIDED,
  sightMatch: EVIDENCE.GUIDED,

  // Objectively scored, answer not supplied in advance.
  oralBlend: EVIDENCE.INDEPENDENT,
  oralSegment: EVIDENCE.INDEPENDENT,
  first: EVIDENCE.INDEPENDENT,
  last: EVIDENCE.INDEPENDENT,
  middle: EVIDENCE.INDEPENDENT,
  soundCount: EVIDENCE.INDEPENDENT,
  segment: EVIDENCE.INDEPENDENT,
  missing: EVIDENCE.INDEPENDENT,
  wordSort: EVIDENCE.INDEPENDENT,
  readAndTap: EVIDENCE.INDEPENDENT,
  fluencySprint: EVIDENCE.INDEPENDENT,
  letterSounds: EVIDENCE.INDEPENDENT,
  train: EVIDENCE.INDEPENDENT,
  oddOneOut: EVIDENCE.INDEPENDENT,
  wordCount: EVIDENCE.INDEPENDENT,
  syllable: EVIDENCE.INDEPENDENT,
  soundHunt: EVIDENCE.INDEPENDENT,

  // The confirmation round that follows a self-assessed blend: three printed
  // words, no audio, no model. This is where blending earns real evidence.
  blendConfirm: EVIDENCE.INDEPENDENT,
});

/**
 * Ceiling for a mode key. Unknown modes fall back to `guided` rather than
 * `independent`: a mode nobody has classified has not earned the benefit of
 * the doubt, and the failure mode should be under-claiming.
 *
 * @param {string} mode
 * @returns {EvidenceLevel}
 */
export function evidenceCeilingForMode(mode) {
  return MODE_EVIDENCE_CEILING[mode] ?? EVIDENCE.GUIDED;
}

/** A fresh per-level counter map. */
export function emptyEvidenceCounts() {
  const out = {};
  for (const level of EVIDENCE_LEVELS) out[level] = { attempts: 0, correct: 0 };
  return out;
}

/**
 * Lazy migration for stats saved before evidence tracking existed.
 *
 * Mirrors the in-line `seedFromLegacy` pattern already used for Leitner
 * boxes in store.recordWordAttempt: backfill on first touch rather than
 * rewriting every saved record at load. Readers call this too, so an
 * un-migrated entry reports correctly without being written back.
 *
 * Historical attempts land in the `guided` bucket (see LEGACY_EVIDENCE).
 *
 * @param {{attempts?: number, correct?: number, byEvidence?: object}|null|undefined} stat
 * @returns {Record<EvidenceLevel, {attempts: number, correct: number}>}
 */
export function ensureEvidenceBuckets(stat) {
  if (stat?.byEvidence) {
    // Fill any level added after this record was written.
    const out = { ...stat.byEvidence };
    for (const level of EVIDENCE_LEVELS) {
      if (!out[level]) out[level] = { attempts: 0, correct: 0 };
    }
    return out;
  }
  const buckets = emptyEvidenceCounts();
  const attempts = Number(stat?.attempts || 0);
  if (attempts > 0) {
    buckets[LEGACY_EVIDENCE] = {
      attempts,
      correct: Number(stat?.correct || 0),
    };
  }
  return buckets;
}

/**
 * Immutably bump one level's counters.
 * @returns {Record<EvidenceLevel, {attempts: number, correct: number}>}
 */
export function addEvidenceCount(buckets, level, correct) {
  const key = EVIDENCE_RANK[level] === undefined ? EVIDENCE.EXPOSURE : level;
  const prev = buckets[key] || { attempts: 0, correct: 0 };
  return {
    ...buckets,
    [key]: {
      attempts: prev.attempts + 1,
      correct: prev.correct + (correct ? 1 : 0),
    },
  };
}

/**
 * Total attempts/correct at or above a given level.
 * @returns {{attempts: number, correct: number}}
 */
export function countAtLeast(buckets, level) {
  const floor = EVIDENCE_RANK[level] ?? 0;
  let attempts = 0,
    correct = 0;
  for (const l of EVIDENCE_LEVELS) {
    if ((EVIDENCE_RANK[l] ?? 0) < floor) continue;
    attempts += buckets?.[l]?.attempts || 0;
    correct += buckets?.[l]?.correct || 0;
  }
  return { attempts, correct };
}

/** Independent-or-better attempts recorded against a stat. */
export function independentCount(stat) {
  return countAtLeast(ensureEvidenceBuckets(stat), MIN_MASTERY_EVIDENCE);
}

/**
 * Confidence bands, driven by how many independent attempts a score rests on.
 * A 100% score from two data points and a 100% score from twenty are not the
 * same claim, and the dashboard should not render them identically.
 *
 * @param {number} independentAttempts
 * @returns {'none'|'low'|'moderate'|'high'}
 */
export function confidenceFor(independentAttempts) {
  const n = Number(independentAttempts || 0);
  if (n <= 0) return 'none';
  if (n < 6) return 'low';
  if (n < 12) return 'moderate';
  return 'high';
}

/** Parent/teacher-facing label for a confidence band. */
export function confidenceLabel(band) {
  return (
    {
      none: 'No independent evidence yet',
      low: 'Low confidence — few independent attempts',
      moderate: 'Moderate confidence',
      high: 'High confidence',
    }[band] || band
  );
}

/** Child-safe label for an evidence level (used in grown-up views only). */
export function evidenceLabel(level) {
  return (
    {
      exposure: 'Shown by the app',
      guided: 'With support',
      independent: 'On their own',
      verified: 'Checked by a grown-up',
    }[level] || level
  );
}
