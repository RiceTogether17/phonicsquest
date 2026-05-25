/**
 * PhonicsQuest – Word Workout (B4)
 *
 * Multi-mode practice from one item. The Quizlet pattern adapted to
 * PhonicsQuest's existing modes — take a single word and run it through
 * an escalating ladder (recognise → blend → segment → completion) so the
 * child retrieves the same lexical entry from several different cues.
 * Retrieval practice with varied cues is the most durable learning
 * lever in the evidence base; this is the surface that brings it home.
 *
 * Pure. No DOM, no store reads. The picker just answers "given this
 * word, which 3–4 modes form a sensible ladder?" — the app shells out
 * the actual round-by-round dispatch through the existing setupBlend
 * / setupHearChoose / setupSegment paths so no new game widget is
 * introduced.
 *
 * Charter-safe: every round honours the per-mode amber-feedback
 * contract; a wrong answer demotes the SR box like any other attempt
 * (Review Lane keeps integrity). No new XP grind, no "level-up after
 * 4 rounds" bling — the workout is its own reward.
 */

/**
 * Pick an ordered list of modes appropriate to the word's complexity.
 *
 *   • CVC (cat, hen)        → hear → blend → segment → missing
 *   • CCVC (flat, drop)     → blend → segment → missing → soundCount
 *   • CVCC (band, jump)     → blend → segment → last → missing
 *   • CCVCC (stamp, blast)  → blend → segment → soundCount → missing
 *   • Digraph (ship, chop)  → hear → blend → segment → middle
 *   • Long vowel (cake)     → hear → blend → middle → segment
 *   • Other / unknown       → hear → blend → segment   (3-step fallback)
 *
 * Choices follow the curriculum's `recommendedModes` for the relevant
 * phase, so a CVCC word in Phase 3 doesn't land on a Phase 1 mode that
 * wouldn't be a useful exercise for it.
 *
 * @param {{ id:string, word:string, pattern?:string, group?:string }} word
 * @returns {string[]} ordered mode keys
 */
export function pickWorkoutModes(word) {
  if (!word) return [];
  const pattern = String(word.pattern || '').toUpperCase();
  const group   = String(word.group   || '').toLowerCase();

  // Long-vowel / digraph words: anchor on middle / vowel-pattern work.
  if (group.startsWith('long-') || group === 'digraphs') {
    return ['hear', 'blend', 'middle', 'segment'];
  }
  if (group === 'r-controlled' || group === 'diphthongs') {
    return ['hear', 'blend', 'middle', 'missing'];
  }

  switch (pattern) {
    case 'CVC':    return ['hear', 'blend', 'segment', 'missing'];
    case 'CCVC':   return ['blend', 'segment', 'missing', 'soundCount'];
    case 'CVCC':   return ['blend', 'segment', 'last', 'missing'];
    case 'CCVCC':  return ['blend', 'segment', 'soundCount', 'missing'];
    case 'DIGRAPH':return ['hear', 'blend', 'segment', 'middle'];
    default:       return ['hear', 'blend', 'segment'];
  }
}

/**
 * Build a workout: a list of {word, mode} rounds in order. The same word
 * appears in every round — that's the whole point — and the modes are
 * picked via `pickWorkoutModes`.
 *
 * @param {{ id:string, word:string, pattern?:string, group?:string }} word
 * @returns {Array<{ word: typeof word, mode: string }>}
 */
export function buildWordWorkout(word) {
  if (!word || !word.id) return [];
  return pickWorkoutModes(word).map(mode => ({ word, mode }));
}

