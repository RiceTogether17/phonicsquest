// @ts-check
/**
 * PhonicsQuest – motion preference.
 *
 * CSS animations honour prefers-reduced-motion and the .motion-reduced class,
 * but JS-driven motion (GSAP tweens, canvas-confetti) must check explicitly.
 * One shared predicate so the app setting and the OS preference always agree.
 */

import { store } from '../modules/store.js';

/** True when large/decorative motion should be skipped or shortened. */
export function prefersReducedMotion() {
  if (store.get('reducedMotion')) return true;
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
