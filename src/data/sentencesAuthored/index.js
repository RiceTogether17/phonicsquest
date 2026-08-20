/**
 * PhonicsQuest – Authored Sentence Forge sentences.
 *
 * Sentence Forge used to fill every level/track scope by wrapping ~21 authored
 * sentences per scope in a fronted phrase, so roughly four in five sentences a
 * child met were the same sentence wearing a different hat. These batches are
 * hand-written to take that padding's place.
 *
 * Ids are stamped here rather than written by hand: `a-p3-041` is stable for a
 * given level and position, which is what the spaced-review lane and the
 * per-sentence progress tracker key on.
 */

import { P1_AUTHORED } from './p1.js';
import { P2_AUTHORED } from './p2.js';
import { P3_AUTHORED } from './p3.js';
import { P4_AUTHORED } from './p4.js';
import { P5_AUTHORED } from './p5.js';
import { P6_AUTHORED } from './p6.js';

const BY_LEVEL = {
  1: P1_AUTHORED,
  2: P2_AUTHORED,
  3: P3_AUTHORED,
  4: P4_AUTHORED,
  5: P5_AUTHORED,
  6: P6_AUTHORED,
};

export const AUTHORED_SENTENCES = Object.entries(BY_LEVEL).flatMap(([level, entries]) =>
  entries.map((entry, index) => ({
    ...entry,
    level: Number(level),
    id: `a-p${level}-${String(index + 1).padStart(3, '0')}`,
  })),
);
