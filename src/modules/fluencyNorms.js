/**
 * PhonicsQuest — reading a fluency timing honestly.
 *
 * What was here before: a bare `wcpm >= 60 → "🌟 Fluent reader!"`, shown to
 * the child, with no grade and no time of year. Three things were wrong with
 * it, and each matters on its own.
 *
 * 1. **60 is not one bar.** It is roughly the middle of Grade 1 at the end of
 *    the year — and about the 10th percentile for Grade 2 at the end of the
 *    year. A Primary 2 child reading 62 was being told they were fluent when
 *    they were near the bottom of their year group, which is exactly the
 *    child a timing is supposed to find.
 *
 * 2. **It was not words *correct* per minute.** No errors were counted, so
 *    the number was words per minute, stored and displayed under a name that
 *    means something else. A child who guesses fast scores higher than one
 *    who reads accurately, which inverts what fluency is.
 *
 * 3. **It was shown to the child as a verdict.** Reading speed is a
 *    screening measure for a teacher. Put in front of a six-year-old it
 *    teaches that reading fast is the goal, which is the habit most likely
 *    to wreck comprehension.
 *
 * So: the timing is a grown-up tool, the error count is asked for, and the
 * reading is placed against the right row of the norms rather than one
 * hardcoded number. Where the app does not know the grade it says so rather
 * than picking a row.
 *
 * ── The norms ─────────────────────────────────────────────────────────────
 * Hasbrouck & Tindal (2017) oral reading fluency norms, 50th percentile
 * WCPM, by grade and time of year. These are US grade norms used as the
 * nearest published reference; Singapore has no equivalent published table,
 * and P1 is mapped to Grade 1 and so on. That approximation is stated on
 * screen rather than buried here, because a parent comparing their child to
 * a benchmark deserves to know which benchmark.
 */

/** 50th-percentile WCPM by grade, at each third of the school year. */
export const ORF_50TH = Object.freeze({
  1: { autumn: null, winter: 29, spring: 60 },
  2: { autumn: 50, winter: 84, spring: 100 },
  3: { autumn: 83, winter: 97, spring: 112 },
  4: { autumn: 94, winter: 120, spring: 133 },
  5: { autumn: 121, winter: 133, spring: 146 },
  6: { autumn: 132, winter: 145, spring: 146 },
});

/** 25th percentile — below this a teacher would usually look more closely. */
export const ORF_25TH = Object.freeze({
  1: { autumn: null, winter: 16, spring: 34 },
  2: { autumn: 25, winter: 52, spring: 72 },
  3: { autumn: 44, winter: 62, spring: 78 },
  4: { autumn: 68, winter: 87, spring: 98 },
  5: { autumn: 85, winter: 99, spring: 109 },
  6: { autumn: 112, winter: 118, spring: 122 },
});

/**
 * Which third of the school year a date falls in.
 *
 * The Singapore school year runs January to November, so the thirds are
 * calendar-aligned here rather than following the northern autumn start the
 * norms were collected on. Another approximation, and the reason the label
 * says "about".
 *
 * @param {Date} [now]
 * @returns {'autumn'|'winter'|'spring'}
 */
export function termOfYear(now = new Date()) {
  const m = now.getMonth(); // 0 = January
  if (m <= 3) return 'autumn'; // Jan–Apr: early in the year
  if (m <= 7) return 'winter'; // May–Aug: middle
  return 'spring'; // Sep–Dec: late
}

/** 'P3' → 3. Anything else → null. */
export function gradeNumber(primaryGrade) {
  const m = /^P([1-6])$/i.exec(String(primaryGrade ?? '').trim());
  return m ? Number(m[1]) : null;
}

/**
 * Words correct per minute — the real thing, not words per minute.
 *
 * @param {number} words words in the passage
 * @param {number} seconds time taken
 * @param {number|null} errors words read wrongly, or null if nobody counted
 * @returns {{wpm:number, wcpm:number|null, accuracy:number|null}}
 */
export function readingRate(words, seconds, errors = null) {
  if (!(words > 0) || !(seconds > 0)) return { wpm: 0, wcpm: null, accuracy: null };
  const minutes = seconds / 60;
  const wpm = Math.round(words / minutes);
  if (errors == null || Number.isNaN(errors)) return { wpm, wcpm: null, accuracy: null };
  const e = Math.max(0, Math.min(words, Math.round(errors)));
  return {
    wpm,
    wcpm: Math.round((words - e) / minutes),
    accuracy: Math.round(((words - e) / words) * 100),
  };
}

/**
 * Place a reading against the norms for this child's grade and this point in
 * the year.
 *
 * @param {object} opts
 * @param {number} opts.wpm
 * @param {number|null} [opts.wcpm] null when nobody counted errors
 * @param {string|null} [opts.primaryGrade] 'P1'–'P6', or null
 * @param {Date} [opts.now]
 * @returns {{
 *   band: 'unknown'|'uncounted'|'below'|'approaching'|'at'|'above',
 *   headline: string, detail: string, reference: string|null,
 * }}
 */
export function describeFluency({ wpm, wcpm = null, primaryGrade = null, now = new Date() }) {
  const grade = gradeNumber(primaryGrade);
  const term = termOfYear(now);
  const p50 = grade ? ORF_50TH[grade]?.[term] : null;
  const p25 = grade ? ORF_25TH[grade]?.[term] : null;

  // Without an error count the number is words per minute, and words per
  // minute cannot be compared to a words-CORRECT-per-minute norm. Saying
  // nothing is better than comparing the wrong quantity.
  if (wcpm == null) {
    return {
      band: 'uncounted',
      headline: `${wpm} words per minute`,
      detail:
        'Count the words read wrongly to turn this into words correct per minute — the measure the benchmarks use. Speed on its own can go up simply by guessing faster.',
      reference: null,
    };
  }

  if (!grade || p50 == null) {
    return {
      band: 'unknown',
      headline: `${wcpm} words correct per minute`,
      // The common case, and not a gap to apologise for: published
      // words-correct-per-minute norms begin at Grade 1, so for a child
      // below that there is no outside number to compare to. The
      // comparison that does mean something is the child against
      // themselves on the same story, which the history below gives.
      //
      // Note it does NOT suggest setting a school year. A profile with a
      // primary grade is routed to the Primary English modules and cannot
      // reach these stories at all, so that would be advice to break the
      // thing they are using.
      detail: grade
        ? 'There is no published benchmark for this point in Primary 1 — the first timings of the year are too early to compare against. Keep it as the starting point to measure later readings against.'
        : 'Published benchmarks start at Primary 1, so there is no outside number to compare this to yet. The useful comparison is the same story read again in a week or two.',
      reference: null,
    };
  }

  const reference = `Around ${p50} words correct per minute is the middle of P${grade} at about this point in the year (Hasbrouck & Tindal, 2017 — US grade norms, the nearest published reference).`;

  if (wcpm >= p50) {
    return {
      band: wcpm >= p50 * 1.25 ? 'above' : 'at',
      headline: `${wcpm} words correct per minute`,
      detail:
        'That is at or above the middle of this year group. Re-reading still builds smoothness and expression.',
      reference,
    };
  }
  if (p25 != null && wcpm >= p25) {
    return {
      band: 'approaching',
      headline: `${wcpm} words correct per minute`,
      detail:
        'A little below the middle of this year group. Re-reading the same story two or three times is the practice that moves this.',
      reference,
    };
  }
  return {
    band: 'below',
    headline: `${wcpm} words correct per minute`,
    detail:
      'Below where most of this year group are. That is worth knowing rather than worrying about — it usually means more practice at the decoding level, on shorter texts, before longer ones.',
    reference,
  };
}
