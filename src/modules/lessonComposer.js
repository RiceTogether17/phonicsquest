/**
 * PhonicsQuest – Today's Lesson Composer
 *
 * Builds the tutor-style guided session for the day: a single ordered
 * list of steps that walks the child through
 *
 *   warm-up → teach something new → practise → review → (wrap-up)
 *
 * the way a tutor would run a sitting, instead of leaving the child to
 * pick from a menu. It does NOT invent new step mechanics — it composes
 * the existing daily systems:
 *
 *   • Early-reading bands: todaysPlan.getEarlyReadingPlan() steps
 *     (Review Lane / Daily Challenge / targeted warm-up) plus a teach
 *     step from the recommended curriculum stage's mini-lesson.
 *   • Primary bands: missionToday.getMissionSteps() plus a teach step
 *     from the child's weakest skill (remediationRouter) with its
 *     grammar/vocab tip.
 *
 * Completion is read live from the same signals those systems already
 * use; only the teach step needs a manual flag (held by lessonRunner).
 *
 * Pure composition — no DOM. Rendering lives in app.js, session state
 * in lessonRunner.js.
 */

import { store } from './store.js';
import { getActiveProfile } from './profiles.js';
import { getReadingBand } from './readingStages.js';
import { getEarlyReadingPlan } from './todaysPlan.js';
import { getCurrentJourneyStep } from '../data/journeyStages.js';
import { getMissionSteps } from './missionToday.js';
import { getRemediationPlan } from './remediationRouter.js';
import { getRecommendedStage } from './progression.js';
import { getGrammarTip } from '../data/grammarTips.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';

/**
 * @typedef {object} LessonStep
 * @property {string} id
 * @property {'warmup'|'teach'|'practice'|'review'} kind
 * @property {string} icon
 * @property {string} title
 * @property {string} detail
 * @property {boolean} done       live completion (teach steps: overridden by runner)
 * @property {string} progressLabel
 * @property {object} action      { type: 'review'|'daily'|'navigate'|'teach-phonics'|'teach-tip', … }
 */

/** Is this profile on the primary (P1–P6) pathway? Mirrors app.js layout logic. */
export function isPrimaryPathway(profile = getActiveProfile?.() || null) {
  const placement = store.get('placementProfile') || null;
  const band = getReadingBand(profile, placement);
  return !!profile?.primaryGrade || profile?.schoolLevel === 'primary' || band === 'reader';
}

/**
 * Compose today's guided lesson.
 * @param {Date} [now]
 * @returns {{ band: 'early'|'primary', steps: LessonStep[] }}
 */
export function composeTodaysLesson(now = new Date()) {
  return isPrimaryPathway()
    ? { band: 'primary', steps: _composePrimary(now) }
    : { band: 'early', steps: _composeEarly() };
}

/* ── Early reading (K1–P1) ───────────────────────────────────────── */

function _composeEarly() {
  const plan = getEarlyReadingPlan();
  const byId = Object.fromEntries(plan.steps.map((s) => [s.id, s]));

  const steps = [];

  // 1 · Warm-up: clear the spaced-review queue (or it's already clear).
  if (byId.review) {
    steps.push(_fromEarlyStep(byId.review, 'warmup', 'Warm-up'));
  }

  // 2 · Teach: the recommended curriculum stage's mini-lesson.
  const teach = _earlyTeachStep();
  if (teach) steps.push(teach);

  // 3 · Practice: the targeted warm-up at the weakest group.
  if (byId.warmup) {
    steps.push(_fromEarlyStep(byId.warmup, 'practice', 'Practice'));
  }

  // 4 · Review: the daily challenge (mixed seeded set).
  if (byId.daily) {
    steps.push(_fromEarlyStep(byId.daily, 'review', 'Challenge'));
  }

  return steps;
}

function _fromEarlyStep(step, kind, kindLabel) {
  return {
    id: step.id,
    kind,
    kindLabel,
    icon: step.icon,
    title: step.title,
    detail: step.detail,
    done: step.done,
    progressLabel: step.progressLabel,
    action:
      step.id === 'review'
        ? { type: 'review' }
        : step.id === 'daily'
          ? { type: 'daily' }
          : { type: 'navigate', target: step.target, group: step.group || null },
  };
}

function _earlyTeachStep() {
  // Children still on the pre-print journey steps (hearing sounds,
  // learning letters) don't get a blending mini-lesson yet — their
  // journey warm-up IS the day's teaching moment.
  try {
    const journeyKey = getCurrentJourneyStep()?.key;
    if (journeyKey === 'phonemic-awareness' || journeyKey === 'letter-sounds') return null;
  } catch (_) {
    /* fall through to the phonics teach step */
  }

  let stage;
  try {
    stage = getRecommendedStage();
  } catch (_) {
    stage = null;
  }
  if (!stage) return null;

  return {
    id: `teach-${stage.id}`,
    kind: 'teach',
    kindLabel: 'Learn',
    icon: stage.icon || '🦉',
    title: `Giri teaches: ${stage.name}`,
    detail: 'A 1-minute lesson, then try one together.',
    done: false, // lessonRunner overrides from its teachDone flag
    progressLabel: 'Start',
    // After the lesson, practice flows into Blend It at the same stage —
    // the one mode every stage supports and _navigateTo can scope by group.
    action: { type: 'teach-phonics', stageId: stage.id, group: stage.group, target: 'blend' },
  };
}

/* ── Primary (P1–P6) ─────────────────────────────────────────────── */

function _composePrimary(now) {
  const steps = [];

  // 1 · Teach: today's tip for the weakest skill.
  const teach = _primaryTeachStep();
  if (teach) steps.push(teach);

  // 2…n · The five mission steps (already ordered grammar → vocab →
  // comprehension → editing → yesterday's slip = practice then review).
  const mission = getMissionSteps(now);
  for (const step of mission) {
    const isReview = step.id === 'yesterday-review';
    steps.push({
      id: step.id,
      kind: isReview ? 'review' : 'practice',
      kindLabel: isReview ? 'Review' : 'Practice',
      icon: step.icon,
      title: step.title,
      detail: step.description,
      done: step.done,
      progressLabel:
        step.goal > 1
          ? `${Math.min(step.count, step.goal)}/${step.goal}`
          : step.done
            ? '✓'
            : 'Start',
      action: { type: 'navigate', target: step.target, missionStepId: step.id },
    });
  }

  return steps;
}

function _primaryTeachStep() {
  let plan;
  try {
    plan = getRemediationPlan(1) || [];
  } catch (_) {
    plan = [];
  }
  const weakest = plan[0];
  if (!weakest) return null;

  const isGrammar = weakest.domain === 'grammar';
  const meta = isGrammar ? GRAMMAR_CATEGORIES[weakest.skill] : VOCAB_CATEGORIES[weakest.skill];
  const tip = isGrammar
    ? getGrammarTip(weakest.skill)
    : meta && meta.rule
      ? { rule: meta.rule, example: meta.example, tip: meta.tip }
      : null;
  if (!tip) return null;

  const followUp = weakest.nextStep
    ? { target: weakest.nextStep.target, label: weakest.nextStep.label }
    : null;

  return {
    id: `teach-${weakest.skill}`,
    kind: 'teach',
    kindLabel: 'Learn',
    icon: meta?.icon || '🦉',
    title: `Giri teaches: ${weakest.skillLabel}`,
    detail: `Your trickiest skill right now (${Math.round((weakest.score || 0) * 100)}%). One quick rule first.`,
    done: false, // lessonRunner overrides
    progressLabel: 'Start',
    action: {
      type: 'teach-tip',
      skill: weakest.skill,
      tip: {
        icon: meta?.icon || '🦉',
        label: weakest.skillLabel,
        rule: tip.rule,
        example: tip.example,
        tip: tip.tip || '',
      },
      followUp,
    },
  };
}
