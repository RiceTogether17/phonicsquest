/**
 * PhonicsQuest – Practice defaults
 *
 * One place that answers "which level should a picker open on?" so every
 * primary module starts where the child should practise, not at P1.
 *
 * Priority: the Quick Check's gentle recommendation (persisted as
 * recommendedPracticeLevel) → the profile's declared grade → 'P1'.
 */

import { store } from './store.js';
import { getActiveProfile } from './profiles.js';

const GRADES = new Set(['P1', 'P2', 'P3', 'P4', 'P5', 'P6']);

/** @returns {'P1'|'P2'|'P3'|'P4'|'P5'|'P6'} */
export function getDefaultPracticeLevel() {
  const recommended = store.get('recommendedPracticeLevel');
  if (GRADES.has(recommended)) return recommended;
  const grade = getActiveProfile?.()?.primaryGrade;
  if (GRADES.has(grade)) return grade;
  return 'P1';
}

/** True when this level is the active recommendation (for a ⭐ badge). */
export function isRecommendedLevel(level) {
  return level === store.get('recommendedPracticeLevel');
}
