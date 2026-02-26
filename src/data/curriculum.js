/**
 * PhonicsQuest Curriculum
 *
 * Scope & sequence for the sequential blending progression:
 *
 *   Phase 1  CVC        short A → E → I → O → U
 *   Phase 2  CCVC       short A → E → I → O → U  (blend/digraph + vowel + consonant)
 *   Phase 3  CVCC       short A → E → I → O → U  (consonant + vowel + blend/digraph)
 *   Phase 4  CCVCC      short A → E → I → O → U  (blends at both ends)
 *   Phase 5  Long Vowels  A → E → I → O → U
 *   Phase 6  Diphthongs
 *   Phase 7  Advanced (digraphs standalone review, r-controlled)
 *
 * Each stage unlocks when its prerequisite reaches mastery threshold.
 * The `group` field is used by progress.getAdaptivePool() to filter words.
 */

/** Mastery = accuracy >= this value across recent attempts */
export const MASTERY_THRESHOLD = 0.80;

/** Minimum attempts before mastery is calculated */
export const MIN_ATTEMPTS_FOR_MASTERY = 6;

/**
 * Curriculum stages in learning order.
 * `group` maps to a WORD_GROUPS key or a structural-vowel key (e.g. 'cvc-a').
 */
export const CURRICULUM = [

  /* ── Phase 1: CVC by vowel ─────────────────────────────────────── */
  {
    id: 'cvc-a', phase: 1,
    name: 'CVC – Short A',
    description: 'Simple three-sound words: cat, hat, map…',
    icon: '🐱', group: 'cvc-a', level: 1,
    requiredMastery: 0,           // always unlocked
  },
  {
    id: 'cvc-e', phase: 1,
    name: 'CVC – Short E',
    description: 'Short E words: bed, leg, ten…',
    icon: '🛏️', group: 'cvc-e', level: 1,
    requiredMastery: 0.70, prerequisite: 'cvc-a',
  },
  {
    id: 'cvc-i', phase: 1,
    name: 'CVC – Short I',
    description: 'Short I words: bit, tip, dip…',
    icon: '🐟', group: 'cvc-i', level: 1,
    requiredMastery: 0.70, prerequisite: 'cvc-e',
  },
  {
    id: 'cvc-o', phase: 1,
    name: 'CVC – Short O',
    description: 'Short O words: hop, dog, top…',
    icon: '🐸', group: 'cvc-o', level: 1,
    requiredMastery: 0.70, prerequisite: 'cvc-i',
  },
  {
    id: 'cvc-u', phase: 1,
    name: 'CVC – Short U',
    description: 'Short U words: bug, cup, run…',
    icon: '🐛', group: 'cvc-u', level: 1,
    requiredMastery: 0.70, prerequisite: 'cvc-o',
  },

  /* ── Phase 2: CCVC by vowel ─────────────────────────────────────── */
  {
    id: 'ccvc-a', phase: 2,
    name: 'CCVC – Short A',
    description: 'Blend at the start: flat, clap, trap…',
    icon: '🚩', group: 'ccvc-a', level: 1,
    requiredMastery: 0.70, prerequisite: 'cvc-u',
  },
  {
    id: 'ccvc-e', phase: 2,
    name: 'CCVC – Short E',
    description: 'Blend at the start: step, fret, sled…',
    icon: '🎯', group: 'ccvc-e', level: 1,
    requiredMastery: 0.70, prerequisite: 'ccvc-a',
  },
  {
    id: 'ccvc-i', phase: 2,
    name: 'CCVC – Short I',
    description: 'Blend at the start: flip, trip, drip…',
    icon: '💪', group: 'ccvc-i', level: 1,
    requiredMastery: 0.70, prerequisite: 'ccvc-e',
  },
  {
    id: 'ccvc-o', phase: 2,
    name: 'CCVC – Short O',
    description: 'Blend at the start: flop, drop, stop…',
    icon: '🐊', group: 'ccvc-o', level: 1,
    requiredMastery: 0.70, prerequisite: 'ccvc-i',
  },
  {
    id: 'ccvc-u', phase: 2,
    name: 'CCVC – Short U',
    description: 'Blend at the start: drum, slug, stub…',
    icon: '🥁', group: 'ccvc-u', level: 1,
    requiredMastery: 0.70, prerequisite: 'ccvc-o',
  },

  /* ── Phase 3: CVCC by vowel ─────────────────────────────────────── */
  {
    id: 'cvcc-a', phase: 3,
    name: 'CVCC – Short A',
    description: 'Blend at the end: band, fast, camp…',
    icon: '✋', group: 'cvcc-a', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvc-u',
  },
  {
    id: 'cvcc-e', phase: 3,
    name: 'CVCC – Short E',
    description: 'Blend at the end: belt, best, bend…',
    icon: '🔔', group: 'cvcc-e', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-a',
  },
  {
    id: 'cvcc-i', phase: 3,
    name: 'CVCC – Short I',
    description: 'Blend at the end: gift, milk, list…',
    icon: '🎁', group: 'cvcc-i', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-e',
  },
  {
    id: 'cvcc-o', phase: 3,
    name: 'CVCC – Short O',
    description: 'Blend at the end: bond, song, lost…',
    icon: '🎵', group: 'cvcc-o', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-i',
  },
  {
    id: 'cvcc-u', phase: 3,
    name: 'CVCC – Short U',
    description: 'Blend at the end: jump, dust, lung…',
    icon: '💥', group: 'cvcc-u', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-o',
  },

  /* ── Phase 4: CCVCC by vowel ────────────────────────────────────── */
  {
    id: 'ccvcc-a', phase: 4,
    name: 'CCVCC – Short A',
    description: 'Blends both ends: stamp, clamp, blast…',
    icon: '🌱', group: 'ccvcc-a', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-u',
  },
  {
    id: 'ccvcc-e', phase: 4,
    name: 'CCVCC – Short E',
    description: 'Blends both ends: blend, trend, crest…',
    icon: '🌿', group: 'ccvcc-e', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-a',
  },
  {
    id: 'ccvcc-i', phase: 4,
    name: 'CCVCC – Short I',
    description: 'Blends both ends: blink, drink, print…',
    icon: '💎', group: 'ccvcc-i', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-e',
  },
  {
    id: 'ccvcc-o', phase: 4,
    name: 'CCVCC – Short O',
    description: 'Blends both ends: stomp, front, prong…',
    icon: '🎺', group: 'ccvcc-o', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-i',
  },
  {
    id: 'ccvcc-u', phase: 4,
    name: 'CCVCC – Short U',
    description: 'Blends both ends: stump, clump, blunt…',
    icon: '🏆', group: 'ccvcc-u', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-o',
  },

  /* ── Phase 5: Long vowels ────────────────────────────────────────── */
  {
    id: 'long-a', phase: 5,
    name: 'Long Vowel A',
    description: 'cake, rain, play, name…',
    icon: '✨', group: 'long-a', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-u',
  },
  {
    id: 'long-e', phase: 5,
    name: 'Long Vowel E',
    description: 'keep, beat, tree, feet…',
    icon: '🌟', group: 'long-e', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-a',
  },
  {
    id: 'long-i', phase: 5,
    name: 'Long Vowel I',
    description: 'bike, kite, fly, time…',
    icon: '🌙', group: 'long-i', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-e',
  },
  {
    id: 'long-o', phase: 5,
    name: 'Long Vowel O',
    description: 'home, boat, snow, road…',
    icon: '☀️', group: 'long-o', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-i',
  },
  {
    id: 'long-u', phase: 5,
    name: 'Long Vowel U',
    description: 'cube, tune, blue, rule…',
    icon: '🦄', group: 'long-u', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-o',
  },

  /* ── Phase 6: Diphthongs ─────────────────────────────────────────── */
  {
    id: 'diphthongs', phase: 6,
    name: 'Diphthongs',
    description: 'coin, boy, out, cow, paw…',
    icon: '🌊', group: 'diphthongs', level: 3,
    requiredMastery: 0.70, prerequisite: 'long-u',
  },

  /* ── Phase 7: Advanced patterns ──────────────────────────────────── */
  {
    id: 'digraphs', phase: 7,
    name: 'Digraphs',
    description: 'ship, chip, that, when…',
    icon: '🤝', group: 'digraphs', level: 2,
    requiredMastery: 0.70, prerequisite: 'diphthongs',
  },
  {
    id: 'blends-review', phase: 7,
    name: 'Blends Review',
    description: 'float, crisp, blend, sprint…',
    icon: '🚀', group: 'blends', level: 3,
    requiredMastery: 0.70, prerequisite: 'digraphs',
  },

  /* ── Phase 8: Suffixes ────────────────────────────────────────────── */
  {
    id: 'suffix-ing', phase: 8,
    name: '-ing Words',
    description: 'running, jumping, sitting…',
    icon: '🏃', group: 'suffix-ing', level: 2,
    requiredMastery: 0.70, prerequisite: 'blends-review',
  },
  {
    id: 'suffix-ed', phase: 8,
    name: '-ed Words',
    description: 'jumped, helped, picked…',
    icon: '✅', group: 'suffix-ed', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-ing',
  },
  {
    id: 'suffix-er', phase: 8,
    name: '-er Words',
    description: 'faster, taller, bigger…',
    icon: '📈', group: 'suffix-er', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-ed',
  },
  {
    id: 'suffix-est', phase: 8,
    name: '-est Words',
    description: 'fastest, tallest, biggest…',
    icon: '🏆', group: 'suffix-est', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-er',
  },
];

/** Phase labels for UI display */
export const PHASE_LABELS = {
  1: 'Phase 1 – CVC',
  2: 'Phase 2 – CCVC',
  3: 'Phase 3 – CVCC',
  4: 'Phase 4 – CCVCC',
  5: 'Phase 5 – Long Vowels',
  6: 'Phase 6 – Diphthongs',
  7: 'Phase 7 – Advanced',
  8: 'Phase 8 – Suffixes',
};

/**
 * Returns which curriculum stages are unlocked based on mastery scores.
 * @param {Record<string, number>} groupMastery - map of group -> accuracy (0-1)
 * @returns {string[]} array of unlocked stage IDs
 */
export function getUnlockedStages(groupMastery) {
  const unlocked = [];

  for (const stage of CURRICULUM) {
    if (!stage.prerequisite) { unlocked.push(stage.id); continue; }

    const prereq = CURRICULUM.find(s => s.id === stage.prerequisite);
    if (!prereq) continue;
    if (!unlocked.includes(prereq.id)) continue;

    const prereqAccuracy = getStageAccuracy(prereq, groupMastery);
    if (prereqAccuracy >= stage.requiredMastery) {
      unlocked.push(stage.id);
    }
  }

  return unlocked;
}

/**
 * Average accuracy across all groups in a stage.
 * @param {object} stage
 * @param {Record<string, number>} groupMastery
 * @returns {number} 0-1
 */
function getStageAccuracy(stage, groupMastery) {
  const groups = stage.groups ?? [stage.group];
  if (!groups.length) return 0;
  const scores = groups.map(g => groupMastery[g] ?? 0);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * Get the recommended next stage for the child based on current progress.
 * @param {Record<string, number>} groupMastery
 * @returns {object|null} curriculum stage
 */
export function getRecommendedStage(groupMastery) {
  const unlocked = getUnlockedStages(groupMastery);

  for (const id of unlocked) {
    const stage = CURRICULUM.find(s => s.id === id);
    const accuracy = getStageAccuracy(stage, groupMastery);
    if (accuracy < MASTERY_THRESHOLD) return stage;
  }

  const lastId = unlocked[unlocked.length - 1];
  return CURRICULUM.find(s => s.id === lastId) ?? null;
}

/**
 * XP rewards by action.
 */
export const XP_REWARDS = {
  correct:      10,
  correct_fast: 15,  // answered in < 3 seconds
  streak_5:     20,  // 5 in a row
  streak_10:    40,  // 10 in a row
  daily_goal:   50,  // completed daily goal
  perfect_round: 25, // no mistakes in a session
  new_word:      5,  // first time attempting a word
};

/**
 * Level thresholds: XP needed to reach each level.
 */
export const LEVEL_XP = [
  0,    // Level 1
  100,  // Level 2
  250,  // Level 3
  450,  // Level 4
  700,  // Level 5
  1000, // Level 6
  1400, // Level 7
  1900, // Level 8
  2500, // Level 9
  3200, // Level 10
];

/**
 * Calculate level from total XP.
 * @param {number} xp
 * @returns {{ level: number, progress: number, nextXP: number }}
 */
export function getLevelInfo(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]) level = i + 1;
    else break;
  }
  const currentXP = LEVEL_XP[level - 1] ?? 0;
  const nextXP = LEVEL_XP[level] ?? LEVEL_XP[LEVEL_XP.length - 1];
  const progress = nextXP > currentXP
    ? (xp - currentXP) / (nextXP - currentXP)
    : 1;
  return { level: Math.min(level, LEVEL_XP.length), progress, nextXP };
}
