/**
 * PhonicsQuest Curriculum
 *
 * Scope & sequence for the sequential blending progression. The phase numbers
 * here MUST stay in sync with the placement screener in
 * `src/modules/placementTest.js` — the architecture review called out a
 * curriculum/placement mismatch where each file claimed a different home for
 * digraphs, and we don't want that to drift again.
 *
 *   Phase 1  CVC               short A → E → I → O → U
 *   Phase 2  CCVC              initial blends  (blend + vowel + consonant)
 *   Phase 3  CVCC              final blends    (consonant + vowel + blend)
 *   Phase 4  Digraphs          sh, ch, th, wh, ck, ng — needed for early
 *                              decodable reading, hence introduced before
 *                              long vowels rather than buried at the end
 *   Phase 5  CCVCC             both-end blends
 *   Phase 6  Long Vowels       A → E → I → O → U
 *   Phase 7  Diphthongs
 *   Phase 8  Advanced          mixed-blends review
 *   Phase 9  Suffixes
 *   Phase 10 Morphology & high-frequency sight words
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

  /* ── Phase 4: Digraphs ───────────────────────────────────────────── */
  // Introduced before CCVCC and long vowels because sh/ch/th/ck/ng appear
  // in real decodable reading from the start. Buried-at-the-end placement
  // was the curriculum vs. placement mismatch flagged in the review.
  {
    id: 'digraphs', phase: 4,
    name: 'Digraphs',
    description: 'ship, chip, that, when, sing…',
    icon: '🤝', group: 'digraphs', level: 2,
    requiredMastery: 0.70, prerequisite: 'cvcc-u',
  },

  /* ── Phase 5: CCVCC by vowel ────────────────────────────────────── */
  {
    id: 'ccvcc-a', phase: 5,
    name: 'CCVCC – Short A',
    description: 'Blends both ends: stamp, clamp, blast…',
    icon: '🌱', group: 'ccvcc-a', level: 2,
    requiredMastery: 0.70, prerequisite: 'digraphs',
  },
  {
    id: 'ccvcc-e', phase: 5,
    name: 'CCVCC – Short E',
    description: 'Blends both ends: blend, trend, crest…',
    icon: '🌿', group: 'ccvcc-e', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-a',
  },
  {
    id: 'ccvcc-i', phase: 5,
    name: 'CCVCC – Short I',
    description: 'Blends both ends: blink, drink, print…',
    icon: '💎', group: 'ccvcc-i', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-e',
  },
  {
    id: 'ccvcc-o', phase: 5,
    name: 'CCVCC – Short O',
    description: 'Blends both ends: stomp, front, prong…',
    icon: '🎺', group: 'ccvcc-o', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-i',
  },
  {
    id: 'ccvcc-u', phase: 5,
    name: 'CCVCC – Short U',
    description: 'Blends both ends: stump, clump, blunt…',
    icon: '🏆', group: 'ccvcc-u', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-o',
  },

  /* ── Phase 6: Long vowels (split by spelling pattern) ────────────────
   *
   * Each long vowel is split into orthographic micro-stages because
   * children master the patterns at very different rates. Within a vowel,
   * the order is: split-digraph (a_e/o_e/etc.) → vowel teams (ai/oa/ee)
   * → end-of-word patterns (ay/ow). Long I and Long U have a single stage
   * each for now — igh, final-y, ue and ew aren't yet in the word data;
   * deriveSpellingPattern() in words.js will route those words to the
   * right stage as soon as they are added.
   */

  // Long A: a_e → ai → ay
  {
    id: 'long-a-ae', phase: 6,
    name: 'Long A · a_e',
    description: 'Split digraph: cake, name, late…',
    icon: '🎂', group: 'long-a-ae', level: 2,
    requiredMastery: 0.70, prerequisite: 'ccvcc-u',
  },
  {
    id: 'long-a-ai', phase: 6,
    name: 'Long A · ai',
    description: 'Vowel team: rain, tail, sail…',
    icon: '🌧️', group: 'long-a-ai', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-a-ae',
  },
  {
    id: 'long-a-ay', phase: 6,
    name: 'Long A · ay',
    description: 'Word-end pattern: play, day, way…',
    icon: '🎲', group: 'long-a-ay', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-a-ai',
  },
  {
    id: 'long-a-y', phase: 6,
    name: 'Long A · y (2-syllable)',
    description: 'Long A in syllable 1 + y-as-long-e ending: baby, lady, lazy…',
    icon: '👶', group: 'long-a-y', level: 3,
    requiredMastery: 0.70, prerequisite: 'long-a-ay',
  },

  // Long E: ee → ea → ie → y
  {
    id: 'long-e-ee', phase: 6,
    name: 'Long E · ee',
    description: 'Doubled vowel team: tree, feet, see…',
    icon: '🌲', group: 'long-e-ee', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-a-y',
  },
  {
    id: 'long-e-ea', phase: 6,
    name: 'Long E · ea',
    description: 'Vowel team: beat, sea, dream…',
    icon: '🍃', group: 'long-e-ea', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-e-ee',
  },
  {
    id: 'long-e-ie', phase: 6,
    name: 'Long E · ie',
    description: 'Vowel team ie says /ee/: thief, brief, field, believe…',
    icon: '🥷', group: 'long-e-ie', level: 3,
    requiredMastery: 0.70, prerequisite: 'long-e-ea',
  },
  {
    id: 'long-e-y', phase: 6,
    name: 'Long E · y (2-syllable)',
    description: 'Word-end y as long /ee/ in 2-syllable words: happy, puppy, funny, lazy…',
    icon: '😊', group: 'long-e-y', level: 3,
    requiredMastery: 0.70, prerequisite: 'long-e-ie',
  },

  // Long I: i_e → igh → y → ind → ild
  {
    id: 'long-i-ie', phase: 6,
    name: 'Long I · i_e',
    description: 'Split digraph: kite, like, time…',
    icon: '🪁', group: 'long-i-ie', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-e-y',
  },
  {
    id: 'long-i-igh', phase: 6,
    name: 'Long I · igh',
    description: 'Trigraph (igh = one /ī/ sound): night, light, right, might…',
    icon: '💡', group: 'long-i-igh', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-i-ie',
  },
  {
    id: 'long-i-y', phase: 6,
    name: 'Long I · y',
    description: 'Word-end y as long /ī/: cry, try, fly, my, sky…',
    icon: '😭', group: 'long-i-y', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-i-igh',
  },
  {
    id: 'long-i-ind', phase: 6,
    name: 'Long I · ind',
    description: 'Naked i + nd cluster says long /ī/: find, kind, blind…',
    icon: '🔍', group: 'long-i-ind', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-i-y',
  },
  {
    id: 'long-i-ild', phase: 6,
    name: 'Long I · ild',
    description: 'Naked i + ld cluster says long /ī/: mild, wild, child…',
    icon: '🧒', group: 'long-i-ild', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-i-ind',
  },

  // Long O: o_e → oa → ow → old
  {
    id: 'long-o-oe', phase: 6,
    name: 'Long O · o_e',
    description: 'Split digraph: home, hope, note…',
    icon: '🏠', group: 'long-o-oe', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-i-ild',
  },
  {
    id: 'long-o-oa', phase: 6,
    name: 'Long O · oa',
    description: 'Vowel team: boat, coat, road…',
    icon: '🚤', group: 'long-o-oa', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-o-oe',
  },
  {
    id: 'long-o-ow', phase: 6,
    name: 'Long O · ow',
    description: 'Word-end pattern: snow, slow, low…',
    icon: '❄️', group: 'long-o-ow', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-o-oa',
  },
  {
    id: 'long-o-old', phase: 6,
    name: 'Long O · old',
    description: 'Naked o + ld cluster says long /ō/: cold, gold, hold, told…',
    icon: '🥇', group: 'long-o-old', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-o-ow',
  },

  // Long U: u_e (split-digraph) → ue (vowel team) → ew → oo → ui → y
  {
    id: 'long-u-ue', phase: 6,
    name: 'Long U · u_e',
    description: 'Split digraph: cube, tube, rule…',
    icon: '🎲', group: 'long-u-ue', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-o-old',
  },
  {
    id: 'long-u-uue', phase: 6,
    name: 'Long U · ue',
    description: 'Vowel team ue (different from u_e): blue, true, glue, clue.',
    icon: '💙', group: 'long-u-uue', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-u-ue',
  },
  {
    id: 'long-u-ew', phase: 6,
    name: 'Long U · ew',
    description: 'Word-end ew: new, few, drew, blew, flew, grew…',
    icon: '🆕', group: 'long-u-ew', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-u-uue',
  },
  {
    id: 'long-u-oo', phase: 6,
    name: 'Long U · oo',
    description: 'Long /uː/ as in moon, food, pool, room (NOT short /ʊ/ as in book).',
    icon: '🌙', group: 'long-u-oo', level: 2,
    requiredMastery: 0.70, prerequisite: 'long-u-ew',
  },
  {
    id: 'long-u-ui', phase: 6,
    name: 'Long U · ui',
    description: 'Vowel team ui says /uː/: fruit, suit, juice, bruise…',
    icon: '🍎', group: 'long-u-ui', level: 3,
    requiredMastery: 0.70, prerequisite: 'long-u-oo',
  },
  {
    id: 'long-u-y', phase: 6,
    name: 'Long U · y (2-syllable)',
    description: 'Long U in syllable 1 + y-as-long-e ending: duty, ruby, fruity…',
    icon: '🧃', group: 'long-u-y', level: 3,
    requiredMastery: 0.70, prerequisite: 'long-u-ui',
  },

  /* ── Phase 7: Diphthongs (split by spelling pattern) ─────────────────
   *
   * oi/oy share the /ɔɪ/ sound and get one stage. ou/ow share /aʊ/ and
   * get one stage. /aw/ is technically a low back vowel rather than a
   * true diphthong, so it earns its own stage rather than being mixed in
   * with the others.
   */
  {
    id: 'dip-oi', phase: 7,
    name: 'Diphthong · oi/oy',
    description: 'Same /ɔɪ/ sound: coin, boy, soil, joy…',
    icon: '🪙', group: 'dip-oi', level: 3,
    requiredMastery: 0.70, prerequisite: 'long-u-y',
  },
  {
    id: 'dip-ou', phase: 7,
    name: 'Diphthong · ou/ow',
    description: 'Same /aʊ/ sound: out, cow, loud, town…',
    icon: '🐄', group: 'dip-ou', level: 3,
    requiredMastery: 0.70, prerequisite: 'dip-oi',
  },
  {
    id: 'dip-aw', phase: 7,
    name: '/aw/ pattern',
    description: 'Separate from oi/ou: paw, jaw, saw, dawn…',
    icon: '🐾', group: 'dip-aw', level: 3,
    requiredMastery: 0.70, prerequisite: 'dip-ou',
  },

  /* ── Phase 8: Advanced — mixed-blends review ──────────────────────── */
  {
    id: 'blends-review', phase: 8,
    name: 'Blends Review',
    description: 'float, crisp, blend, sprint…',
    icon: '🚀', group: 'blends', level: 3,
    requiredMastery: 0.70, prerequisite: 'dip-aw',
  },

  /* ── Phase 9: Suffixes ────────────────────────────────────────────── */
  {
    id: 'suffix-ing', phase: 9,
    name: '-ing Words',
    description: 'running, jumping, sitting…',
    icon: '🏃', group: 'suffix-ing', level: 2,
    requiredMastery: 0.70, prerequisite: 'blends-review',
  },
  {
    id: 'suffix-ed', phase: 9,
    name: '-ed Words',
    description: 'jumped, helped, picked…',
    icon: '✅', group: 'suffix-ed', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-ing',
  },
  {
    id: 'suffix-er', phase: 9,
    name: '-er Words',
    description: 'faster, taller, bigger…',
    icon: '📈', group: 'suffix-er', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-ed',
  },
  {
    id: 'suffix-est', phase: 9,
    name: '-est Words',
    description: 'fastest, tallest, biggest…',
    icon: '🏆', group: 'suffix-est', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-er',
  },

  /* ── Phase 10: Morphology + multisyllabic + sight vocabulary ─────────── */
  {
    id: 'prefixes', phase: 10,
    name: 'Prefixes (re-, un-)',
    description: 'redo, untie, unwrap…',
    icon: '↩️', group: 'prefixes', level: 2,
    requiredMastery: 0.70, prerequisite: 'suffix-est',
  },
  {
    id: 'suffixes-advanced', phase: 10,
    name: 'Advanced Suffixes (-tion, -able)',
    description: 'action, nation, readable…',
    icon: '🧩', group: 'suffixes-advanced', level: 3,
    requiredMastery: 0.70, prerequisite: 'prefixes',
  },
  {
    id: 'multisyllable', phase: 10,
    name: 'Multi-syllabic Words',
    description: 'science, market, energy…',
    icon: '🎼', group: 'multisyllable', level: 3,
    requiredMastery: 0.70, prerequisite: 'suffixes-advanced',
  },
  {
    id: 'sight-highfreq', phase: 10,
    name: 'High-frequency Sight Words',
    description: 'their, because, enough…',
    icon: '👀', group: 'sight-highfreq', level: 3,
    requiredMastery: 0.70, prerequisite: 'multisyllable',
  },
];

/** Phase labels for UI display. Must match PLACEMENT_PHASES in placementTest.js. */
export const PHASE_LABELS = {
  1:  'Phase 1 – CVC',
  2:  'Phase 2 – CCVC',
  3:  'Phase 3 – CVCC',
  4:  'Phase 4 – Digraphs',
  5:  'Phase 5 – CCVCC',
  6:  'Phase 6 – Long Vowels',
  7:  'Phase 7 – Diphthongs',
  8:  'Phase 8 – Advanced',
  9:  'Phase 9 – Suffixes',
  10: 'Phase 10 – Morphology & Fluency',
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
