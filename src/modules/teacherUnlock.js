/**
 * Teacher Unlock — a single password-gated master override that unlocks
 * EVERY mode, EVERY word level, and EVERY quest/category at once.
 *
 * Intended for teachers (or parents) on a shared classroom device who need
 * to demonstrate, assess, or jump into any activity regardless of the
 * child's placement, reading band, grade, or mastery progress. Toggling it
 * off restores the normal adaptive gating immediately.
 *
 * SECURITY NOTE: this is a convenience lock, not real authentication. The
 * password lives in the client bundle, so treat it as a "keep little
 * fingers out" gate — never as protection for anything sensitive. The flag
 * is stored under its own localStorage key so it is device-global and
 * survives profile switches (a teacher unlocks the device, not one child).
 */

const STORAGE_KEY = 'phonicsquest_teacher_unlock';
const TEACHER_PASSWORD = 'kingstonrocks';

/** @returns {boolean} whether the master unlock is currently active. */
export function isTeacherUnlockActive() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Turn the unlock on or off directly (used by the toggle UI once a password
 * has already been verified, and to lock again).
 * @param {boolean} on
 */
export function setTeacherUnlock(on) {
  try {
    if (on) localStorage.setItem(STORAGE_KEY, '1');
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable — unlock simply won't persist */
  }
}

/**
 * Attempt to enable the master unlock with a password.
 * @param {string} password
 * @returns {boolean} true if the password matched and the unlock is now active.
 */
export function tryTeacherUnlock(password) {
  if (typeof password === 'string' && password === TEACHER_PASSWORD) {
    setTeacherUnlock(true);
    return true;
  }
  return false;
}

/** Turn the master unlock off. */
export function lockTeacherMode() {
  setTeacherUnlock(false);
}
