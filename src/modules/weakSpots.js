/**
 * Weak spots: the few things this child most needs taught next.
 *
 * The dashboard holds a great deal of detail. A parent or tutor with ten
 * minutes needs the opposite: at most five lines, each saying what goes
 * wrong, how often, and what to do about it. This gathers what the app has
 * already recorded and ranks it, earliest skills first, because a sound a
 * child cannot hear holds back everything built on it.
 */

import { store } from './store.js';
import { getSoundConfusions } from './soundConfusions.js';
import { getStuckWords } from './dashboardInsights.js';
import { getMisconceptionSummary } from './teacherFeedback.js';
import { buildErrorDigest } from './parentReportCard.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';

export const MAX_WEAK_SPOTS = 5;

/** What to say about each Oral Practice check when it was the weakest. */
const ORAL_NEXT_STEPS = Object.freeze({
  words: 'saying every word correctly when reading aloud',
  pace: 'reading aloud at a steady pace, pausing at commas and full stops',
  feeling: 'reading aloud with expression',
  ideas: 'giving a reason and an example when answering a question aloud',
  clear: 'answering aloud in full, clear sentences',
});

function _skillLabel(skill) {
  return GRAMMAR_CATEGORIES[skill]?.label ?? VOCAB_CATEGORIES[skill]?.label ?? null;
}

function _list(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

function _latestOral() {
  const done = Object.values(store.get('oralCompleted') || {}).filter((r) => r?.at);
  done.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  return done[0] ?? null;
}

/**
 * @typedef {object} WeakSpot
 * @property {'sounds'|'words'|'habit'|'skill'|'oral'} kind
 * @property {string} title    what goes wrong, in a sentence a parent can read
 * @property {string} evidence how the app knows
 * @property {string} action   what to do next
 */

/**
 * The ranked list. Empty when there is nothing recorded worth acting on.
 * @returns {WeakSpot[]}
 */
export function buildWeakSpots() {
  /** @type {WeakSpot[]} */
  const spots = [];

  // 1. Sounds mixed up: the earliest skill, so it leads.
  for (const c of getSoundConfusions().slice(0, 2)) {
    const [a, b] = c.sounds;
    spots.push({
      kind: 'sounds',
      title: `Mixes up the sounds ${a} and ${b}`,
      evidence: `${c.count} times in the last two weeks${
        c.words.length ? `, in words such as ${_list(c.words.map((w) => `"${w}"`))}` : ''
      }.`,
      action: `Say the two sounds one after the other and have your child copy you, then play First Sound or Middle Sound again.`,
    });
  }

  // 2. Words that are not sticking.
  const stuck = getStuckWords();
  if (stuck.length) {
    spots.push({
      kind: 'words',
      title: `Keeps getting ${stuck.length === 1 ? 'this word' : 'these words'} wrong: ${_list(
        stuck.slice(0, 4).map((w) => `"${w.word}"`),
      )}`,
      evidence: `Right less than 4 times in 10 after at least 6 tries each.`,
      action: `Sound each one out together, tile by tile, in Blend It before more mixed practice.`,
    });
  }

  // 3. A named habit seen again and again in grammar, cloze or editing.
  for (const m of getMisconceptionSummary(2)) {
    spots.push({
      kind: 'habit',
      title: m.label,
      evidence: `Seen ${m.count} times in the last two weeks.`,
      action: m.selfCheck || m.rule || 'Go through one worked example together, then try again.',
    });
  }

  // 4. Topics with low scores this fortnight.
  for (const s of buildErrorDigest().weakSkills) {
    const label = _skillLabel(s.skill);
    if (!label) continue;
    spots.push({
      kind: 'skill',
      title: `Finds ${label} hard`,
      evidence: `About ${Math.round(s.score * 100)}% right, with ${s.recentWrong} wrong in the last two weeks.`,
      action: `Do one short round of ${label} together and talk through each wrong answer.`,
    });
    if (spots.filter((x) => x.kind === 'skill').length >= 2) break;
  }

  // 5. Oral: the child's own check from the latest sitting.
  const oral = _latestOral();
  if (oral?.nextStep && ORAL_NEXT_STEPS[oral.nextStep]) {
    spots.push({
      kind: 'oral',
      title: `Oral: working on ${ORAL_NEXT_STEPS[oral.nextStep]}`,
      evidence: `From your child's own check after the last Oral Practice.`,
      action: `Listen to one reading or answer and say one thing that was good and one thing to change.`,
    });
  }

  return spots.slice(0, MAX_WEAK_SPOTS);
}

/** The same list as plain text, for pasting into a message to a tutor. */
export function weakSpotsText(spots, name = '') {
  if (!spots.length) return '';
  const head = name ? `What ${name} needs next:` : 'What to work on next:';
  return [head, ...spots.map((s, i) => `${i + 1}. ${s.title}. ${s.evidence} ${s.action}`)].join(
    '\n',
  );
}
