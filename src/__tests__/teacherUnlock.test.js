import { describe, it, expect, beforeEach } from 'vitest';
import {
  isTeacherUnlockActive,
  tryTeacherUnlock,
  setTeacherUnlock,
  lockTeacherMode,
} from '../modules/teacherUnlock.js';
import { getUnlockedStages } from '../modules/progression.js';
import { CURRICULUM } from '../data/curriculum.js';

describe('teacherUnlock', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('is inactive by default', () => {
    expect(isTeacherUnlockActive()).toBe(false);
  });

  it('rejects a wrong password and stays locked', () => {
    expect(tryTeacherUnlock('nope')).toBe(false);
    expect(tryTeacherUnlock('')).toBe(false);
    expect(tryTeacherUnlock(null)).toBe(false);
    expect(isTeacherUnlockActive()).toBe(false);
  });

  it('unlocks with the correct password and persists', () => {
    expect(tryTeacherUnlock('kingstonrocks')).toBe(true);
    expect(isTeacherUnlockActive()).toBe(true);
  });

  it('can be locked again', () => {
    setTeacherUnlock(true);
    expect(isTeacherUnlockActive()).toBe(true);
    lockTeacherMode();
    expect(isTeacherUnlockActive()).toBe(false);
  });

  it('unlocks every curriculum stage when active', () => {
    // Locked: not all stages are open from a cold profile.
    expect(getUnlockedStages().length).toBeLessThan(CURRICULUM.length);
    setTeacherUnlock(true);
    expect(getUnlockedStages().length).toBe(CURRICULUM.length);
    lockTeacherMode();
  });
});
