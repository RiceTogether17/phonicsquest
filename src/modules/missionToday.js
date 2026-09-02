/**
 * PhonicsQuest – Today's Mission
 *
 * The Primary English "10-Minute English Quest" daily roadmap. A primary
 * profile sees five small steps in this order:
 *
 *   1. Grammar Cloze       — 3 attempts in Cloze Castle
 *   2. Vocabulary Cloze    — 3 attempts in Word Vault
 *   3. Comprehension Clue  — open the Comprehension Cloze placeholder
 *   4. Sentence Correction — 1 attempt in Editing Quest
 *   5. Yesterday's Slip    — replay one wrong attempt from yesterday
 *
 * Step completion is read live from `questAttempts` (filtered to today),
 * with a small `manualSteps` map for steps that don't currently emit
 * `recordAttempt` events (e.g. the comprehension-cloze placeholder).
 */

import { store } from './store.js';

const STORAGE_KEY = 'dailyMission';

/** Quest key → home-screen navigation target used by app._navigateTo. */
const QUEST_TO_TARGET = Object.freeze({
  clozeCastle: 'cloze-castle',
  wordVault: 'word-vault',
  grammarMcq: 'grammar-mcq',
  vocabMcq: 'vocab-mcq',
  editingQuest: 'editing-quest',
  sentenceForge: 'sentence-forge',
  writingQuest: 'writing-quest',
});

/** Quest key → human-readable module name. */
const QUEST_TO_LABEL = Object.freeze({
  clozeCastle: 'Cloze Castle',
  wordVault: 'Word Vault',
  grammarMcq: 'Grammar MCQ',
  vocabMcq: 'Vocabulary MCQ',
  editingQuest: 'Editing Quest',
  sentenceForge: 'Sentence Forge',
  writingQuest: 'Writing Quest',
});

/** Five steps that compose a single 10-minute English mission. */
const MISSION_TEMPLATE = Object.freeze([
  {
    id: 'grammar-cloze',
    num: 1,
    title: 'Grammar Cloze',
    icon: '🏰',
    target: 'cloze-castle',
    quest: 'clozeCastle',
    goal: 3,
    description: 'Tap the clue, then answer 3 grammar blanks.',
  },
  {
    id: 'vocab-cloze',
    num: 2,
    title: 'Vocabulary Cloze',
    icon: '🔑',
    target: 'word-vault',
    quest: 'wordVault',
    goal: 3,
    description: 'Find the right word for 3 vocabulary blanks.',
  },
  {
    id: 'comprehension-clue',
    num: 3,
    title: 'Comprehension Clue',
    icon: '📰',
    target: 'comprehension-cloze',
    quest: null,
    manual: true,
    goal: 1,
    description: 'Read carefully and pick the best fit.',
  },
  {
    id: 'sentence-correction',
    num: 4,
    title: 'Sentence Correction',
    icon: '✏️',
    target: 'editing-quest',
    quest: 'editingQuest',
    goal: 1,
    description: 'Spot one spelling or grammar error.',
  },
  {
    id: 'yesterday-review',
    num: 5,
    title: "Yesterday's Slip",
    icon: '🔁',
    target: null,
    quest: null,
    goal: 1,
    description: 'Replay one question you got wrong yesterday.',
  },
]);

function pad2(n) {
  return String(n).padStart(2, '0');
}

function ymd(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function dayOf(timestamp) {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return null;
  return ymd(d);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function pickYesterdayMistake(questAttempts, now) {
  if (!Array.isArray(questAttempts) || questAttempts.length === 0) return null;
  const yesterday = ymd(addDays(now, -1));
  const wrongYesterday = questAttempts.find(
    (a) => a && a.correct === false && dayOf(a.timestamp) === yesterday && QUEST_TO_TARGET[a.quest],
  );
  if (wrongYesterday) return wrongYesterday;

  // Fall back: most recent wrong attempt in the past 7 days that maps to a
  // module we can navigate to.
  const cutoff = addDays(now, -7);
  return (
    questAttempts.find((a) => {
      if (!a || a.correct !== false) return false;
      if (!QUEST_TO_TARGET[a.quest]) return false;
      const t = a.timestamp ? new Date(a.timestamp) : null;
      return t && !Number.isNaN(t.getTime()) && t >= cutoff;
    }) || null
  );
}

function loadOrCreateState(now) {
  const today = ymd(now);
  const stored = store.get(STORAGE_KEY);
  if (stored && stored.date === today) return stored;

  const questAttempts = store.get('questAttempts') || [];
  const mistake = pickYesterdayMistake(questAttempts, now);
  const next = {
    date: today,
    mistakeReplay: mistake
      ? {
          quest: mistake.quest,
          skill: mistake.skill || null,
          moduleLabel: QUEST_TO_LABEL[mistake.quest] || 'a recent question',
        }
      : null,
    manualSteps: {},
  };
  store.set(STORAGE_KEY, next);
  return next;
}

/**
 * Get today's mission state (creating a new mission for the day if needed).
 * @param {Date} [now]
 */
export function getTodaysMission(now = new Date()) {
  return loadOrCreateState(now);
}

/**
 * Build the five mission steps with per-step progress. The returned objects
 * are plain data — the home screen renders them.
 * @param {Date} [now]
 */
export function getMissionSteps(now = new Date()) {
  const state = loadOrCreateState(now);
  const today = state.date;
  const questAttempts = store.get('questAttempts') || [];
  const todayAttempts = questAttempts.filter((a) => a && dayOf(a.timestamp) === today);

  return MISSION_TEMPLATE.map((step) => {
    const enriched = { ...step };

    if (step.id === 'yesterday-review') {
      const m = state.mistakeReplay;
      if (m && QUEST_TO_TARGET[m.quest]) {
        enriched.target = QUEST_TO_TARGET[m.quest];
        enriched.title = `Replay: ${m.moduleLabel}`;
        enriched.description = m.skill
          ? `Try one more on "${m.skill}" — yesterday's slip.`
          : `One more from yesterday's ${m.moduleLabel} session.`;
        enriched.quest = m.quest;
        enriched.replaySkill = m.skill;
      } else {
        enriched.target = 'grammar-mcq';
        enriched.description = 'No slips yet — warm up with Grammar MCQ.';
      }
    }

    let count = 0;
    if (enriched.quest && !enriched.manual) {
      count = todayAttempts.filter((a) => {
        if (a.quest !== enriched.quest) return false;
        if (enriched.replaySkill) return a.skill === enriched.replaySkill;
        return true;
      }).length;
    }
    const manualDone = !!state.manualSteps?.[step.id];
    const done = manualDone || (enriched.goal > 0 && count >= enriched.goal);
    return { ...enriched, count, done };
  });
}

/**
 * Mark a step manually complete. Used for steps that don't currently emit
 * questAttempt events (e.g. the Comprehension Cloze placeholder).
 * @param {string} stepId
 * @param {Date} [now]
 */
export function markMissionStepDone(stepId, now = new Date()) {
  if (!stepId) return;
  const state = loadOrCreateState(now);
  const manualSteps = { ...(state.manualSteps || {}), [stepId]: true };
  store.set(STORAGE_KEY, { ...state, manualSteps });
}

/**
 * Summary card used by the home screen.
 * @param {Date} [now]
 */
export function getMissionSummary(now = new Date()) {
  const steps = getMissionSteps(now);
  const done = steps.filter((s) => s.done).length;
  return {
    steps,
    done,
    total: steps.length,
    complete: done === steps.length,
  };
}

export const __TEST__ = { MISSION_TEMPLATE, QUEST_TO_TARGET, QUEST_TO_LABEL };
