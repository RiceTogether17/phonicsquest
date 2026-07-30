/**
 * PhonicsQuest – The Learning Journey (single source of truth)
 *
 * The app teaches reading in six ordered steps. Every activity mode and
 * quest belongs to exactly one step, and every journey surface (Learn tab
 * headings, journey map, roadmap) renders from this table so the pathway
 * reads the same everywhere:
 *
 *   1. Phonemic Awareness — hear the sounds inside spoken words
 *   2. Letter Sounds      — match each letter to its sound
 *   3. Blending & Decoding — sound out printed words (phonics phases 1–10)
 *   4. Sight Words        — recognise high-frequency words instantly
 *   5. Story Reading      — read decodable stories with understanding
 *   6. Primary English    — school-paper grammar, vocabulary and writing
 *
 * `getJourneyStageProgress` derives each step's progress from signals the
 * app already records; nothing here mutates state.
 */

import { store } from '../modules/store.js';
import { CURRICULUM } from './curriculum.js';
import { SIGHT_QUESTS } from './sightwords.js';
import { STORIES } from './stories.js';
import { getPaProgress, getLetterSoundProgress } from '../modules/prePhaseProgress.js';
import { getDomainMastery } from '../modules/masteryEngine.js';

export const JOURNEY_STEPS = Object.freeze([
  {
    key: 'phonemic-awareness',
    step: 1,
    icon: '👂',
    title: 'Phonemic Awareness',
    childLabel: 'Hear the Sounds',
    desc: 'Hear the sounds inside spoken words — no letters yet.',
    modes: ['first', 'last', 'middle', 'oralBlend', 'soundCount', 'oralSegment', 'syllable', 'wordCount', 'oddOneOut', 'train'],
    screens: [],
  },
  {
    key: 'letter-sounds',
    step: 2,
    icon: '🔡',
    title: 'Letter Sounds',
    childLabel: 'Learn the Letters',
    desc: 'Match each letter to the sound it makes.',
    modes: ['soundHunt', 'hear'],
    screens: ['letterSounds'],
  },
  {
    key: 'blending',
    step: 3,
    icon: '🎯',
    title: 'Blending & Decoding',
    childLabel: 'Sound Out Words',
    desc: 'Blend letter sounds into words, from cat to strongest.',
    modes: ['blend', 'classicBlend', 'segment', 'missing', 'wordSort', 'readAndTap', 'fluencySprint'],
    screens: [],
  },
  {
    key: 'sight-words',
    step: 4,
    icon: '🃏',
    title: 'Sight Words',
    childLabel: 'Know Words on Sight',
    desc: 'Recognise the most common words instantly.',
    modes: [],
    screens: ['sightLearn', 'sightMatch'],
  },
  {
    key: 'stories',
    step: 5,
    icon: '📚',
    title: 'Story Reading',
    childLabel: 'Read Stories',
    desc: 'Read decodable stories and show understanding.',
    modes: [],
    screens: ['stories', 'storyQuest'],
  },
  {
    key: 'primary',
    step: 6,
    icon: '🏫',
    title: 'Primary English',
    childLabel: 'School English',
    desc: 'Grammar, vocabulary, comprehension and writing for P1–P6.',
    modes: [],
    screens: ['grammarMcq', 'vocabMcq', 'clozeCastle', 'wordVault', 'sentenceForge', 'editingQuest', 'writingQuest', 'paperMode'],
  },
]);

/** Map any mode key to its journey step key (null when unmapped). */
export function journeyStepForMode(modeKey) {
  for (const stage of JOURNEY_STEPS) {
    if (stage.modes.includes(modeKey) || stage.screens.includes(modeKey)) return stage.key;
  }
  return null;
}

const STORIES_READ_KEY = 'giri_stories_read';

function _storiesReadCount() {
  try {
    const raw = localStorage.getItem(STORIES_READ_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.length : 0;
  } catch (_) {
    return 0;
  }
}

function _blendingProgress() {
  const gm = store.get('groupMastery') || {};
  const stages = CURRICULUM;
  if (!stages.length) return { status: 'locked', pct: 0 };
  let mastered = 0;
  let touched = 0;
  for (const stage of stages) {
    const score = gm[stage.group];
    if (typeof score !== 'number') continue;
    touched += 1;
    if (score >= 0.80) mastered += 1;
  }
  const pct = Math.round((mastered / stages.length) * 100);
  if (!touched) return { status: 'locked', pct: 0 };
  return { status: mastered === stages.length ? 'complete' : 'in-progress', pct };
}

function _sightProgress() {
  const completed = store.get('sightQuestsCompleted') || {};
  const done = Object.keys(completed).length;
  if (!done) return { status: 'locked', pct: 0 };
  // Derived, not hard-coded: this was pinned at 35 against a bank of 95
  // quests, so the journey read 100% complete at roughly a third done.
  const total = SIGHT_QUESTS.length || 1;
  const pct = Math.min(100, Math.round((done / total) * 100));
  return { status: pct >= 100 ? 'complete' : 'in-progress', pct };
}

function _storyProgress() {
  const read = _storiesReadCount();
  if (!read) return { status: 'locked', pct: 0 };
  // Was pinned at 16 against 69 real stories — same overstatement as above.
  const total = STORIES.length || 1;
  const pct = Math.min(100, Math.round((read / total) * 100));
  return { status: pct >= 100 ? 'complete' : 'in-progress', pct };
}

function _primaryProgress() {
  const rows = getDomainMastery() || [];
  const scored = rows.filter(d => typeof d.composite === 'number');
  if (!scored.length) return { status: 'locked', pct: 0 };
  const avg = scored.reduce((a, d) => a + d.composite, 0) / scored.length;
  const pct = Math.round(avg * 100);
  return { status: pct >= 80 ? 'complete' : 'in-progress', pct };
}

/**
 * Progress for one journey step. @returns {{status:'locked'|'in-progress'|'complete', pct:number}}
 */
export function getJourneyStageProgress(key) {
  switch (key) {
    case 'phonemic-awareness': return getPaProgress();
    case 'letter-sounds':      return getLetterSoundProgress();
    case 'blending':           return _blendingProgress();
    case 'sight-words':        return _sightProgress();
    case 'stories':            return _storyProgress();
    case 'primary':            return _primaryProgress();
    default:                   return { status: 'locked', pct: 0 };
  }
}

/** The child's current step = first step that is not complete. */
export function getCurrentJourneyStep() {
  for (const stage of JOURNEY_STEPS) {
    if (getJourneyStageProgress(stage.key).status !== 'complete') return stage;
  }
  return JOURNEY_STEPS[JOURNEY_STEPS.length - 1];
}
